const { createClient } = require('redis');

// Create Redis client
const client = createClient();

// Connect to Redis
client.connect().catch(console.error);

// Redis key constants
const USER_NEXT_ID_KEY = 'users:next_id';
const USER_BY_USERNAME_KEY = 'users:by_username';
const USER_DATA_KEY_PREFIX = 'users:data:';
const HIGHSCORES_KEY = 'highscores:all';
const LEADERBOARD_KEY = 'leaderboard:top10';

const initializeRedis = async () => {
  try {
    // Initialize next user ID counter if it doesn't exist
    const exists = await client.exists(USER_NEXT_ID_KEY);
    if (!exists) {
      await client.set(USER_NEXT_ID_KEY, '1');
    }
  } catch (error) {
    console.error('Redis initialization error:', error);
  }
};

// Call initialization
initializeRedis();

const getOrCreateUser = async (username) => {
  try {
    // Check if user exists
    const userId = await client.hGet(USER_BY_USERNAME_KEY, username);

    if (userId) {
      // User exists, return their data
      const userData = await client.hGetAll(`${USER_DATA_KEY_PREFIX}${userId}`);
      return {
        userId: parseInt(userId),
        username,
        highScore: parseInt(userData.highScore || '0'),
        lastPlayed: parseInt(userData.lastPlayed || '0'),
        gamesPlayed: parseInt(userData.gamesPlayed || '0')
      };
    } else {
      // Create new user
      const newUserId = await client.incr(USER_NEXT_ID_KEY);
      await client.hSet(USER_BY_USERNAME_KEY, username, newUserId.toString());

      const userData = {
        userId: newUserId,
        username,
        highScore: 0,
        lastPlayed: Date.now(),
        gamesPlayed: 0
      };

      await client.hSet(`${USER_DATA_KEY_PREFIX}${newUserId}`, {
        username,
        highScore: '0',
        lastPlayed: Date.now().toString(),
        gamesPlayed: '0'
      });

      return userData;
    }
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  }
};

const submitScore = async (username, score) => {
  try {
    const user = await getOrCreateUser(username);

    // Check if this is a new high score
    const isNewHighScore = score > user.highScore;

    if (isNewHighScore) {
      // Update user's high score
      await client.hSet(`${USER_DATA_KEY_PREFIX}${user.userId}`, {
        highScore: score.toString(),
        lastPlayed: Date.now().toString(),
        gamesPlayed: (user.gamesPlayed + 1).toString()
      });

      // Update global highscores sorted set (score as key, userId as value)
      await client.zAdd(HIGHSCORES_KEY, {
        score: score,
        value: user.userId.toString()
      });

      // Update top 10 leaderboard cache
      await updateLeaderboardCache();

      return {
        success: true,
        newHighScore: true,
        previousScore: user.highScore,
        currentScore: score
      };
    } else {
      // Update games played but not high score
      await client.hSet(`${USER_DATA_KEY_PREFIX}${user.userId}`, {
        lastPlayed: Date.now().toString(),
        gamesPlayed: (user.gamesPlayed + 1).toString()
      });

      return {
        success: true,
        newHighScore: false,
        currentScore: user.highScore
      };
    }
  } catch (error) {
    console.error('Error in submitScore:', error);
    throw error;
  }
};

const updateLeaderboardCache = async () => {
  try {
    // Get top 10 scores with user IDs
    const topScores = await client.zRangeWithScores(HIGHSCORES_KEY, -10, -1, { REV: true });

    // Clear existing leaderboard
    await client.del(LEADERBOARD_KEY);

    // Build leaderboard with user details
    const leaderboard = [];
    for (const entry of topScores) {
      const userId = entry.value;
      const userData = await client.hGetAll(`${USER_DATA_KEY_PREFIX}${userId}`);

      leaderboard.push({
        userId: parseInt(userId),
        username: userData.username,
        score: parseInt(entry.score),
        lastPlayed: parseInt(userData.lastPlayed)
      });
    }

    // Cache the leaderboard
    await client.set(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch (error) {
    console.error('Error updating leaderboard cache:', error);
  }
};

const getLeaderboard = async (limit = 10) => {
  try {
    // Try to get cached leaderboard first
    const cached = await client.get(LEADERBOARD_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    // If no cache, build it
    await updateLeaderboardCache();
    const cachedAgain = await client.get(LEADERBOARD_KEY);
    return cachedAgain ? JSON.parse(cachedAgain) : [];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

const getUserScore = async (username) => {
  try {
    const user = await getOrCreateUser(username);
    return user;
  } catch (error) {
    console.error('Error getting user score:', error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const userIds = await client.hVals(USER_BY_USERNAME_KEY);
    const users = [];

    for (const userId of userIds) {
      const userData = await client.hGetAll(`${USER_DATA_KEY_PREFIX}${userId}`);
      users.push({
        userId: parseInt(userId),
        username: userData.username,
        highScore: parseInt(userData.highScore || '0'),
        lastPlayed: parseInt(userData.lastPlayed || '0'),
        gamesPlayed: parseInt(userData.gamesPlayed || '0')
      });
    }

    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

module.exports = {
  getOrCreateUser,
  submitScore,
  getLeaderboard,
  getUserScore,
  getAllUsers,
  client // Export client for cleanup if needed
};
