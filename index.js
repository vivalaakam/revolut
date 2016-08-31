var express = require('express');
var app = express();
var webpack = require('webpack');
var config = require('./webpack.config');
var path = require('path');
var moment = require('moment');
var getSign = require('horoscope').getSign;

var compiler = webpack(config);

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

var progress = 0;
var tokenBase = 'fake_token_35jkn345!'
var counter = 0;
var reset = false;

function getNewToken() {
    counter++;
    return tokenBase + '_' + counter + '_' + Date.now();
}

var token = getNewToken();

function incProgress(init) {
    if (reset && !init) {
        reset = false;
        progress = 0;
        return;
    }

    reset = false;
    setTimeout(function () {
        progress += Math.round(Math.random() * 10);
        if (progress >= 100) {
            progress = 100;
            return;
        }

        incProgress();
    }, Math.random() * 2000);
}

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/astrosign', function (req, res) {
    var birth = moment(req.body.birthday, 'DD.MM.YYYY');
    var astrosign = getSign({month: birth.get('month') + 1, day: birth.get('date')});
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({astrosign: astrosign.toLowerCase()}));
});

app.get('/:astrosign/:username', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    if (req.query.token) {
        if (progress < 100) {
            res.send(JSON.stringify({progress: progress}));
        } else {
            res.send(JSON.stringify({progress: progress, available: (Math.random() > 0.5)}));
        }
        return;
    }

    reset = true;
    progress = 0;
    res.send(JSON.stringify({token: getNewToken()}));
    incProgress(true);
});

app.post('/:astrosign/:username', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({state: 'saved'}));

});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});
