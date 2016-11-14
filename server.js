import express from 'express';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import moment from 'moment';
import { getSign } from 'horoscope';
import render from './render';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('static'));
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

if (process.env.NODE_ENV === 'development') {
  const config = require('./config/dev.config.js');
  const compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

let progress = 0;
const tokenBase = 'fake_token_35jkn345!';
let counter = 0;
let reset = false;

function getNewToken() {
  counter += 1;
  return `${tokenBase}_${counter}_${Date.now()}`;
}

function incProgress(init) {
  if (reset && !init) {
    reset = false;
    progress = 0;
    return;
  }

  reset = false;
  setTimeout(() => {
    progress += Math.round(Math.random() * 10);
    if (progress >= 100) {
      progress = 100;
      return;
    }

    incProgress();
  }, Math.random() * 1000);
}

app.get('/', (req, res) => {
  res.send(render());
});

app.post('/astrosign', (req, res) => {
  const birth = moment(req.body.birthday, 'DD.MM.YYYY');
  const astrosign = getSign({ month: birth.get('month') + 1, day: birth.get('date') });
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ astrosign: astrosign.toLowerCase() }));
});

app.get('/:astrosign/:username', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.query.token) {
    if (progress < 100) {
      res.send(JSON.stringify({ progress }));
    } else {
      res.send(JSON.stringify({ progress, available: (Math.random() > 0.5) }));
    }
    return;
  }

  reset = true;
  progress = 0;
  res.send(JSON.stringify({ token: getNewToken() }));
  incProgress(true);
});

app.post('/:astrosign/:username', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ state: 'saved' }));
});

app.listen(port, () => {
  /* eslint no-console: ["error", { allow: ["log"] }] */
  console.log(`Listening on port ${port}`);
});
