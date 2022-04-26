const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const database = require('./database');

var app = express();
app.use(bodyParser.json());

app.post('/subscriptions/list', function(req, res) {
    database.list(req, res);
});

app.post('/subscriptions/searchSubscription', function(req, res) { //id da inscrição
    database.searchSubscription(req, res);
});

app.post('/subscriptions/listSubscriptionsUser', function(req, res) { //user_id do usuario
    database.listSubscriptionsUser(req, res);
});

app.post('/subscriptions/listSubscriptionsEvent', function(req, res) { //event_id do evento
    database.listSubscriptionsEvent(req, res);
});

app.post('/subscriptions/checkedUserInEvent', function(req, res) { //event_id and user_id
    database.checkedUserInEvent(req, res);
});

app.post('/subscriptions/create', function(req, res) { //event_id, user_id
    database.create(req, res);
});

app.post('/subscriptions/checkin', function(req, res) { //id da subscrição
    database.checkin(req, res);
});

app.post('/subscriptions/unsubscribed', function(req, res) { //id da subscrição
    database.unsubscribed(req, res);
});

app.listen(2222, function() {
    console.log('API subscriptions rodando');
});