import { Client, Databases, Query } from 'node-appwrite';

export default async function ({ req, res }) {
  return res.json({ ok: true, message: 'It works!' });
};
