const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');

var app = express();
app.use(bodyParser.json());

app.post('/users/list', function(req, res) {
    database.show(req, res);
});

app.post('/users/simpleCreate', function(req, res) {      //cpf, name
    database.simpleCreate(req, res);
});

app.post('/users/fullCreate', function(req, res) {    //cpf, name, email, password
    database.fullCreate(req, res);
});

app.post('/users/checkinCpf', function(req, res) {    //cpf
    database.checkinUserCpf(req, res);
});

app.post('/users/checkinUser', function(req, res) {    //id
    database.checkinUser(req, res);
});

app.post('/users/completedCreate', function(req, res) {    //cpf, email, password
    database.completedCreate(req, res);
});

app.post('/users/login', function(req, res){   //email, password
    database.login(req, res);
});

app.post('/users/editUser', function(req, res) {    //id, cpf, name, email, password
    database.editUser(req, res);
});

app.post('/users/updateAdmin', function(req, res) { //id da subscrição, admin: boolean
    database.updateAdmin(req, res);
});

app.listen(4006, function() {
    console.log('API user rodando');
});