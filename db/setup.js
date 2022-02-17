import Sequelize from 'sequelize';
import path from 'path';

// dialect
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(path.dirname('./'), 'db.sqlite'),
  logging: false,
});

// model
const Model = Sequelize.Model;
class Url extends Model {};

Url.init({
  longUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shortUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'url',
});

// setup fn
export default async function modelUrl() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    return Url;
  } catch (err) { console.error(err); }
}
