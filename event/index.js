const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');

var app = express();
app.use(bodyParser.json());

app.post('/events/list', function(req, res) {
    database.list(req, res);
});

app.post('/events/checkinEvent', function(req, res) { //event_id
    database.checkinEvent(req, res);
});

app.post('/events/create', function(req, res) {      //  category, name, description, starts_at, ends_at
    database.create(req, res);
});

app.post('/events/edit', function(req, res) {    // id, category, name, description, starts_at, ends_at
    database.edit(req, res);
});

app.listen(1006, function() {
    console.log('API event rodando');
});