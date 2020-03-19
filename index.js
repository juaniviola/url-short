const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')

require('dotenv').config()

const config = {
  port: process.env.PORT,
  url: process.env.URL,
}

const port = config.port || 3001

const { createUrl, findUrl } = require('./db/')

// hbs
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// main page
app.get('/', (req, res) => {
  res.render('index')
})

// post url, return short url
app.post('/url', async (req, res) => {
  const { url } = req.body

  try {
    const uri = await createUrl(url)
    if (!uri || uri.error) {
      return res.render('index', { error: uri.error })
    }

    res.render('index', { url: `${config.url}/${uri.shortUrl}`, longUrl: uri.longUrl })
  } catch (err) {
    res.render('index', { error: 'An error ocurred' })
  }
})

// get short url, redirect to url
app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params

  try {
    const url = await findUrl(shortUrl)
    if (!url || url.error) {
      return res.render('index', { error: url.error })
    }

    res.redirect(url)
  } catch (err) {
    res.render('index', { error: 'An error ocurred' })
  }
})

app.listen(config.port, () => console.log('running'))
