import express from 'express';
import database from '../db/index.js';
import config from './config.js';

const app = express.Router();
let apiDatabase = null;

// main page
app.get('/', (req, res) => {
  res.render('index');
});

// post url, return short url
app.post('/url', async (req, res) => {
  if (!apiDatabase) apiDatabase = await database();

  const { url } = req.body;

  try {
    const uri = await apiDatabase.createUrl(url);
    if (!uri || uri.error) {
      return res.render('index', { error: uri.error });
    }

    res.render('index', { url: `${config.url}/${uri.shortUrl}`, longUrl: uri.longUrl });
  } catch (err) {
    console.error(err);
    res.render('index', { error: 'An error ocurred' });
  }
});

// get short url, redirect to url
app.get('/:shortUrl', async (req, res) => {
  if (!apiDatabase) apiDatabase = await database();

  const { shortUrl } = req.params;

  try {
    const url = await apiDatabase.findUrl(shortUrl);
    if (!url || url.error) {
      return res.render('index', { error: url.error });
    }

    res.redirect(url);
  } catch (err) {
    res.render('index', { error: 'An error ocurred' });
  }
});

export default app;
