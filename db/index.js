'use strict'

const { modelUrl } = require('./setup')
const shortid = require('shortid')
const validUrl = require('valid-url')

let Url = null
async function setup () {
  if (!Url)
    Url = await modelUrl()
}

// functions
module.exports = {
  createUrl: async (longUrl) => {
    try {
      await setup()
      const url = await Url.findAll({
        where: { longUrl }
      })

      if (url && url.length && url.length === 1 && url[0].longUrl === longUrl)
        return url[0]

      if (!validUrl.isUri(longUrl))
        return { error: 'Invalid url' }

      const shortUrl = shortid.generate()
      const newUrl = await Url.create({
        longUrl,
        shortUrl
      })

      return newUrl
    } catch (err) {
      console.error(err)
    }
  },

  findUrl: async (shortUrl) => {
    try {
      await setup()
      const url = await Url.findAll({
        where: { shortUrl }
      })

      if (url && url.length && url.length === 1 && url[0].longUrl) {
        return url[0].longUrl
      } else {
        return { error: 'Url not found' }
      }
    } catch (err) {
      console.error(err)
    }
  }
}