var http = require('http')
var fs = require('fs')
var cookieParser = require('cookie-parser')
const express = require('express') 
const httpProxy = require('express-http-proxy')
const app = express() 

const filePath = './log.txt'

app.use(cookieParser()); 
 
app.get('/', (req, res, next) => {  
    res.json({message: "Funcionando!"});
})

//login
app.post('/users/login', (req, res, next) => {
    const proxy = httpProxy('http://localhost:4006/');
    saveLog("http://localhost:4006/users/login - " + req.body)
    proxy(req, res, next);
})

//events
app.post('/events/list', (req, res, next) => {
    const proxy = httpProxy('http://localhost:1006');
    saveLog("http://localhost:1006/events/list - " + req.body)
    proxy(req, res, next);
})

app.post('/events/edit', (req, res, next) => {    //{"id": 1,"category": "Nova","name": "Jogo 1","description": "inovador","starts_at": "2020-11-30T05:15:38.930Z","ends_at": "2020-11-31T05:15:38.930Z"}
    const proxy = httpProxy('http://localhost:1006');
    saveLog("http://localhost:1006/events/edit - " + req.body)
    proxy(req, res, next);
})

app.post('/events/create', (req, res, next) => {    //{"id": 1,"category": "Nova","name": "Jogo 2","description": "inovador","starts_at": "2020-11-30T05:15:38.930Z","ends_at": "2020-11-31T05:15:38.930Z"}
    const proxy = httpProxy('http://localhost:1006');
    saveLog("http://localhost:1006/events/create - " + req.body)
    proxy(req, res, next);
})

app.post('/events/checkinEvent', (req, res, next) => { // {event_id: 1 }
    const proxy = httpProxy('http://localhost:1006');
    saveLog("http://localhost:1006/events/checkinEvent - " + req.body)
    proxy(req, res, next);
})

//certificates
app.post('/certificates/list', (req, res, next) => {
    const proxy = httpProxy('http://localhost:3033');
    saveLog("http://localhost:3033/certificates/list - " + req.body)
    proxy(req, res, next);   
})

app.post('/certificates/create', (req, res, next) => { //{"subscription_id": 1,"text": "Certificado de participação"}
    const proxy = httpProxy('http://localhost:3033');
    saveLog("http://localhost:3033/certificates/create - " + req.body)
    proxy(req, res, next);   
})

app.post('/certificates/validation', (req, res, next) => { //{"subscription_id": 1}
    const proxy = httpProxy('http://localhost:3033');
    saveLog("http://localhost:3033/certificates/validation - " + req.body)
    proxy(req, res, next);   
})

//user
app.post('/users/list', (req, res, next) => {
    const proxy = httpProxy('http://localhost:4006');
    saveLog("http://localhost:4006/users/list - " + req.body)
    proxy(req, res, next);  
})

app.post('/users/simpleCreate', (req, res, next) => { //{"cpf": 102020,"name": "Teste"}
    const proxy = httpProxy('http://localhost:4006');
    saveLog("http://localhost:4006/users/simpleCreate - " + req.body)
    proxy(req, res, next);
})

app.post('/users/fullCreate', (req, res, next) => { //{"cpf": 54546,"name": "rosi","email": "rosi@email.com","password": "senha"}
    const proxy = httpProxy('http://localhost:4006');
    saveLog("http://localhost:4006/users/fullCreate - " + req.body)
    proxy(req, res, next);  
})

app.post('/users/checkinCpf', (req, res, next) => { //{"cpf": 102020}
    const proxy = httpProxy('http://localhost:4006');
    saveLog("http://localhost:4006/users/checkinCpf - " + req.body)
    proxy(req, res, next);  
})

app.post('/users/checkinUser', (req, res, next) => { //{"user_id": 1}
    const proxy = httpProxy('http://localhost:4006');
    saveLog("http://localhost:4006/users/checkinUser - " + req.body)
    proxy(req, res, next);  
})

app.post('/users/completedCreate', (req, res, next) => { //{"cpf": 102020,"email": "julia@gmail.com","password": "senha"}
    const proxy = httpProxy('http://localhost:4006');
    saveLog("http://localhost:4006/users/completedCreate - " + req.body)
    proxy(req, res, next);  
})

app.post('/users/login', (req, res, next) => { //{"email": "mateus@gmail.com","password": "senha"}
    const proxy = httpProxy('http://localhost:4006');
    saveLog("http://localhost:4006/users/login - " + req.body)
    proxy(req, res, next);  
})

app.post('/users/editUser', (req, res, next) => { //{"id": 2,"cpf": 123456,"name": "Douglas","email": "douglas@email.com","password": "senha"}
    const proxy = httpProxy('http://localhost:4006');
    saveLog("http://localhost:4006/users/editUser - " + req.body)
    proxy(req, res, next);  
})

app.post('/users/updateAdmin', (req, res, next) => { //{"id": 1, "admin": true}
    const proxy = httpProxy('http://localhost:4006');
    saveLog("http://localhost:4006/users/updateAdmin - " + req.body)
    proxy(req, res, next);  
})

//subscriptions
app.post('/subscriptions/list', (req, res, next) => {
    const proxy = httpProxy('http://localhost:2222');
    saveLog("http://localhost:2222/subscriptions/list - " + req.body)
    proxy(req, res, next);
})

app.post('/subscriptions/create', (req, res, next) => {   //{"event_id": 4,"user_id": 2}
    const proxy = httpProxy('http://localhost:2222');
    saveLog("http://localhost:2222/subscriptions/create - " + req.body)
    proxy(req, res, next);  
})

app.post('/subscriptions/checkin', (req, res, next) => { //{"id": 5}   
    const proxy = httpProxy('http://localhost:2222');
    saveLog("http://localhost:2222/subscriptions/checkin - " + req.body)
    proxy(req, res, next);  
})

app.post('/subscriptions/unsubscribed', (req, res, next) => { //{"id": 5}   
    const proxy = httpProxy('http://localhost:2222');
    saveLog("http://localhost:2222/subscriptions/unsubscribed - " + req.body)
    proxy(req, res, next);  
})

app.post('/subscriptions/searchSubscription', (req, res, next) => { //{"id": 5}   
    const proxy = httpProxy('http://localhost:2222');
    saveLog("http://localhost:2222/subscriptions/searchSubscription - " + req.body)
    proxy(req, res, next);  
})

app.post('/subscriptions/listSubscriptionsUser', (req, res, next) => { //{"user_id": 5}   
    const proxy = httpProxy('http://localhost:2222');
    saveLog("http://localhost:2222/subscriptions/listSubscriptionsUser - " + req.body)
    proxy(req, res, next);  
})

app.post('/subscriptions/checkedUserInEvent', (req, res, next) => { //{"event_id": 1,"user_id": 1}
    const proxy = httpProxy('http://localhost:2222');
    saveLog("http://localhost:2222/subscriptions/checkedUserInEvent - " + req.body)
    proxy(req, res, next);  
})

app.post('/subscriptions/listSubscriptionsEvent', (req, res, next) => { //{"event_id": 5}   
    const proxy = httpProxy('http://localhost:2222');
    saveLog("http://localhost:2222/subscriptions/listSubscriptionsEvent - " + req.body)
    proxy(req, res, next);  
})

app.post('/send-email', (req, res, next) => { //{"event_id": 5}   
    const proxy = httpProxy('http://localhost:4186');
    saveLog("http://localhost:4186/send-email - " + req.body)
    proxy(req, res, next);  
})

app.post('/logout', function(req, res) {
    saveLog("http://localhost:4006/logout - " + req.body)
    res.json({ auth: false });
})

function saveLog(content) {
    var contentString = fs.readFileSync(filePath, "utf-8")
    contentString = contentString + "\r\n" + JSON.stringify(content)
    fs.writeFileSync(filePath, contentString)
}

//Inicia o server
var server = http.createServer(app); 
server.listen(3222);
console.log("API gateway rodando")