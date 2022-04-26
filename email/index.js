var express = require('express');
var sender = require('./sender');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.post('/send-email', function(req, res) {

	let to = req.body.to;
	let subject = req.body.subject;
	let text = req.body.text;
	let html = req.body.html;

	sender.send(to, subject, text, html);
  	res.send('OK');
});

app.listen(4186, function() {
    console.log('API email rodando');
});