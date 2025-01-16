const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const pool = require('../database'); // Assume database connection is configured

exports.register = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
};

exports.login = async (username, password) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length === 0) throw new Error('No such user found');

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Password is incorrect');

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};
