const { Client, Databases, Query } = require('node-appwrite');
module.exports = async function ({ req, res }) {
  return res.json({ ok: true, message: 'It works!' });
};
