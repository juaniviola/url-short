'use strict'

const Sequelize = require('sequelize')
const path = require('path')

// dialect
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'db.sqlite')
});

// model
const Model = Sequelize.Model
class Url extends Model {}
Url.init({
  longUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  shortUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'url'
})

// setup fn
async function modelUrl() {
  try {
    await sequelize.authenticate()
    console.log('autenticado')

    await sequelize.sync()
    console.log('Tables created')

    return Url
  } catch (err) { console.error(err) }
}

module.exports = { modelUrl }