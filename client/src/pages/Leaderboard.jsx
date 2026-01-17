import { useState, useEffect } from "react";
import { BrowserRouter as Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/leaderboard");
      setLeaderboard(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-zinc-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-fallout-green font-robotomono mb-4">
            FNV BLACKJACK LEADERBOARD
          </h1>
          <p className="text-zinc-400">Highest Earners:</p>
        </div>

        {loading && (
          <div className="text-center text-zinc-400">
            Loading leaderboard...
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="max-w-2xl mx-auto">
            {leaderboard.length === 0 ? (
              <div className="text-center text-zinc-400">
                No scores yet. Be the first to play!
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      index === 0
                        ? 'bg-fallout-green bg-opacity-10 border-fallout-green'
                        : index === 1
                        ? 'bg-zinc-700 border-zinc-600'
                        : index === 2
                        ? 'bg-amber-900 bg-opacity-30 border-amber-700'
                        : 'bg-zinc-800 border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-fallout-green text-zinc-900' :
                        index === 1 ? 'bg-zinc-600 text-zinc-200' :
                        index === 2 ? 'bg-amber-700 text-zinc-200' :
                        'bg-zinc-700 text-zinc-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-200">{entry.username}</div>
                        <div className="text-sm text-zinc-400">
                          {new Date(entry.lastPlayed).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-fallout-green">
                        {entry.score.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <Link to="/"
                className="inline-block bg-fallout-green hover:bg-green-600 text-zinc-900 font-bold py-3 px-8 rounded transition-colors"
              >
                Play Blackjack
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
