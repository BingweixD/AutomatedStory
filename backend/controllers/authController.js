// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// // const pool = require('../db'); // Assume `pool` is your database connection instance

// exports.registerUser = async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
//         await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
//         res.status(201).send('User registered');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error registering new user');
//     }
// };

// exports.loginUser = async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const [results] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

//         if (results.length === 0) {
//             return res.status(401).send('No such user found');
//         }

//         const user = results[0];
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(401).send('Password is incorrect');
//         }

//         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
//         res.json({ token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error logging in user');
//     }
// };


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    // Temporary mock response
    res.status(201).send('User registration feature is not available yet.');
};

const loginUser = (req, res) => {
    // Temporary mock response
    res.json({ token: 'mock-jwt-token' });
};

module.exports = { registerUser, loginUser };
