import express from 'express';
import bodyParser from 'body-parser'
import exphbs from 'express-handlebars';
import routes from './routes.js';
import config from './config.js';

const app = express();

// hbs
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// routes
app.use('/', routes);

app.listen(config.port, () => console.log('[server] Running on port', config.port));
