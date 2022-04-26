const express = require('express');
const PDFKit = require('pdfkit');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const database = require('./database');

var app = express();
app.use(bodyParser.json());
app.use('/documents', express.static(path.join(__dirname, 'documents')));

app.post('/certificates/list', function(req, res) {
    database.show(req, res);
});

app.post('/certificates/create', function(req, res) {
    
    let subscription_id = req.body.subscription_id;
    let text = req.body.text;

    if((subscription_id < 0 || subscription_id != null) && (text != null)) {
    
        const pdf = new PDFKit();

        let path = 'documents/certificate'+ subscription_id + '.pdf';

        pdf.text(text);
        pdf.pipe(fs.createWriteStream(path));
        pdf.end();            

        var filePath = 'localhost:3033/' + path;

        //Define o valor do incrição
        req.body.sub = subscription_id; 
        req.body.path = filePath; 

        database.create(req, res);
    }
});

app.post('/certificates/validation', function(req, res){
    database.validation(req, res);
});

app.listen(3033, function() {
    console.log('API certificate rodando');
});