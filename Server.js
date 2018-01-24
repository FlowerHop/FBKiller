'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const queryString = require('querystring');
const app = express();
const gameCenterCtrl = require('./GameCenter.js');
const englishLearningCtrl = require('./EnglishLearning.js');
const comicsCtrl = require('./Comics.js');
app.set('port', process.env.PORT || 1338);
app.use(bodyParser.json());
app.use('/', express.static('public'));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/helloWorld', function(req, res) {
    res.send("HelloWorld");
    res.end();
});

app.get('/getNewsList/Gamer', function(req, res) {
    gameCenterCtrl.updateNews(() => {
        res.send(JSON.stringify(gameCenterCtrl.getNewsList()));
    });
});
app.get('/getNewsList/EnglishLearning', function(req, res) {
    englishLearningCtrl.updateNews(() => {
        res.send(JSON.stringify(englishLearningCtrl.getNewsList()));
    });
});

app.get('/getNewsList/getComics', function(req, res) {
    comicsCtrl.updateComics(() => {
        res.send(JSON.stringify(comicsCtrl.getComics()));
    });
});

app.listen(app.get('port'), function() {
    console.log('Ready on port: ' + app.get('port'));
});