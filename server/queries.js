const { request, response } = require('express');

const Pool = require('pg').Pool;
// DONT PUSH THIS
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'blackjackjs',
    password: 'mysql',
    port: 3005
});

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
}

const createUser = (request, response) => {
    const {username, password} = request.body;

    Promise.all([
        pool.query('INSERT INTO users (username, password, created_on) VALUES ($1, $2, $3)', [username, password, new Date(new Date().toISOString())])
    ]).then(function([query1Results, query2Results]) {    
        response.status(201).send('Successfully inserted');
    }).catch(function (e) {
        response.status(500).send('Insert failed');
    });
}

module.exports = {
    getUsers,
    createUser,
}
