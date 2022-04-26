var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var axios = require('axios');

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const api = axios.create({
	baseURL: 'http://localhost:3222',
})

//Varivel utilizada para testes
var exemplo = "<email de teste>";

//Menu
app.get('/menu', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/menu/menu.html'));
});

//Menu Admin
app.get('/menuAdmin', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/menu/menuAdmin.html'));
});

//Login
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/user/login.html'));
});

app.post('/auth', function (req, res) {
	api.post('/users/login', (req.body)).then(response => {
		const user = response.data.user;

		if (user != "") {
			var texto = JSON.stringify(user);
			var jsonParsed = JSON.parse(texto);

			var id = jsonParsed[0].id;

			var admin = jsonParsed[0].admin;

			if (admin) {
				res.redirect('/menuAdmin?id=' + id);
			} else {
				res.redirect('/menu?id=' + id);
			}
		} else {
			res.redirect('/');
		}
	}, () => {
		res.redirect('/');
	});
});

//Create User
app.get('/createUser', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/user/createUser.html'));
});

app.post('/createUser', function (req, res) {
	api.post('/users/fullCreate', (req.body)).then(response => {
		const user = response.data;
		if (user != "") {
			res.redirect('/'); //retorna para tela de login
		} else {
			res.redirect('/createUser');
		}
	}, () => {
		res.redirect('/createUser');
	});
});

//Check CPF
app.get('/checkinCpf', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/user/checkCpf.html'));
});

app.post('/checkinCpf', function (req, res) {
	api.post('/users/checkinCpf', (req.body)).then(response => {
		const user = response.data;

		if (user != "") {
			var texto = JSON.stringify(user);
			var jsonParsed = JSON.parse(texto);

			var id = jsonParsed[0].id;
			var name = jsonParsed[0].name;
			var cpf = jsonParsed[0].cpf;

			if (user != null) {
				res.redirect('/completedCreate?id=' + id + '&name=' + name + '&cpf=' + cpf); //retorna para tela para completar o cadastro
			} else {
				res.redirect('/checkinCpf');
			}
		} else {
			res.redirect('/checkinCpf');
		}
	}, () => {
		res.redirect('/checkinCpf');
	});
});

app.get('/completedCreate', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/user/completedCreate.html'));
});

app.post('/completedCreate', function (req, res) {
	api.post('/users/completedCreate', (req.body)).then(response => {
		res.redirect('/'); //retorna para tela de login
	}, () => {
		res.redirect('/completedCreate');
	});
});

//List Events
app.get('/listEvents', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/event/listEvents.html'));
});

function listEvents(req, res, error) {
	api.post('/events/list').then(response => {
		const event = response.data;
		var user_id = req.body.user_id;
		var list = JSON.stringify(event);

		if (event != null) {
			res.redirect('/listEvents?id=' + user_id + '&error=' + error + '&list=' + list); //retorna para tela para completar o cadastro
		} else {
			res.redirect('/');
		}
	}, () => {
		res.redirect('/');
	});
}

app.post('/listEvents', function (req, res) {
	listEvents(req, res, false);
});

// Create Subscriptions
app.post('/createSubscription', function (req, res) {
	api.post('/subscriptions/checkedUserInEvent', (req.body)).then(response => {
		const sub = response.data;

		if (sub == "") {
			api.post('/subscriptions/create', (req.body)).then(response => {
				const event = response.data;

				if (event != null) {
					api.post('/users/checkinUser', (req.body)).then(response => {
						const user = response.data;

						if (user != "") {
							var texto = JSON.stringify(user);
							var userJson = JSON.parse(texto);

							//var to = userJson[0].email;
							var subject = "Inscrição em Evento"
							var text = "Olá " + userJson[0].name + ", você acabou de se inscrever no evento X"

							sendEmail(exemplo, subject, text)

							listEvents(req, res, false);
						} else {
							listEvents(req, res, true);
						}
					})
				} else {
					listEvents(req, res, true);
				}
			})
		} else {
			listEvents(req, res, true);
		}
	}, () => {
		listEvents(req, res, true);
	});
});

//List Inscrições
app.get('/listSubscriptions', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/subscription/listSubscriptions.html'));
});

function listSubscriptions(req, res, error) {
	api.post('/subscriptions/listSubscriptionsUser', (req.body)).then(response => {
		const event = response.data;
		var user_id = req.body.user_id;
		var path = req.body.path;

		var texto = JSON.stringify(event);

		var subscriptions = JSON.parse(texto);

		api.post('/events/list').then(response => {
			const event = response.data;

			var texto = JSON.stringify(event);
			var events = JSON.parse(texto);

			var list = '[';

			for (const key in subscriptions) {
				for (const id in events) {
					if (subscriptions[key].event_id == events[id].id) {
						if (key > 0) { list += ',' }
						list += '{"id":' + subscriptions[key].id + ',';
						list += '"name":"' + events[id].name + '",';
						list += '"description":"' + events[id].description + '",';
						list += '"starts_at":"' + events[id].starts_at + '",';
						list += '"ends_at":"' + events[id].ends_at + '",';
						list += '"unsubscribed":' + subscriptions[key].unsubscribed;

						// if (new Date() > new Date(events[id].ends_at) && new Date(subscriptions[key].checkin_at) < new Date(events[id].ends_at)) {
						if(subscriptions[key].checkin_at != null && subscriptions[key].unsubscribed == false) {
							list += ',"checkin_date":' + true;
						} else {
							list += ',"checkin_date":' + false;
						}

						list += '}';
					}
				}
			}

			list += "]";

			if (event != "") {
				var render = '/listSubscriptions?id=' + user_id + '&error=' + error + '&list=' + list;
				if (path != null) { render += '&path=' + path }
				res.redirect(render);
			} else {
				res.redirect('/menu?id=' + user_id);
			}
		})
	}, () => {
		res.redirect('/menu?id=' + user_id);
	});
}

app.post('/listSubscriptions', function (req, res) {
	listSubscriptions(req, res, false);
});

app.post('/createCertificate', function (req, res) {
	api.post('/users/checkinUser', (req.body)).then(response => {
		const user = response.data;

		var event = req.body.text
		var text = "Certificado de Participação do Evento " + req.body.text + "\r\nParticipante: " + user[0].name + "\r\nCodigo de autenticação: " + req.body.subscription_id;

		req.body.text = text;

		api.post('/certificates/create', (req.body)).then(response => {
			const certificate = response.data;

			var texto = JSON.stringify(certificate);
			var certificateJson = JSON.parse(texto);

			if (certificate != "") {
				req.body.path = certificateJson.path;

				if (user != "") {
					//var to = userJson[0].email;
					var subject = "Certificado Emitido com Sucesso"
					var textEmail = "Olá " + user[0].name + ", seu certificado do evento " + event + " foi emitido com sucerro\r\n Link de acesso: " + req.body.path;
	
					sendEmail(exemplo, subject, textEmail)
	
					listSubscriptions(req, res, false);
				} else {
					listSubscriptions(req, res, true);
				}
			}
		}, () => {
			listSubscriptions(req, res, true);
		});
	})
});

app.post('/validateCertificate', function (req, res) {
	api.post('/certificates/validation', (req.body)).then(response => {
		const certificate = response.data;

		if (certificate != "") {
			listSubscriptions(req, res, true);
		} else {
			listSubscriptions(req, res, false);
		}
	}, () => {
		listSubscriptions(req, res, false);
	});
});

app.post('/unSubscribed', function (req, res) {
	api.post('/subscriptions/unsubscribed', (req.body)).then(response => {
		const sub = response.data;

		if (sub != "") {
			api.post('/users/checkinUser', (req.body)).then(response => {
				const user = response.data;

				if (user != "") {
					var texto = JSON.stringify(user)
					var userJson = JSON.parse(texto)

					//var to = userJson[0].email;
					var subject = "Inscrição de Evento Cancelada"
					var text = "Olá " + userJson[0].name + ", você acabou de cancelar sua inscrição no evento X"

					sendEmail(exemplo, subject, text)

					listSubscriptions(req, res, false);
				} else {
					listSubscriptions(req, res, false);
				}
			})
		} else {
			listSubscriptions(req, res, false);
		}
	}, () => {
		listSubscriptions(req, res, false);
	});
});

//List Events
app.get('/listEventsAdmin', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/event/listEventsAdmin.html'));
});

function listEventsAdmin(req, res, error) {
	api.post('/events/list').then(response => {
		const event = response.data;
		var user_id = req.body.user_id;
		var list = JSON.stringify(event);

		if (event != null) {
			res.redirect('/listEventsAdmin?id=' + user_id + '&error=' + error + '&list=' + list); //retorna para tela para completar o cadastro
		} else {
			res.redirect('/menuAdmin?id=' + user_id);
		}
	}, () => {
		res.redirect('/menuAdmin?id=' + user_id);
	});
}

app.post('/listEventsAdmin', function (req, res) {
	listEventsAdmin(req, res, false);
});

//listCheckin
app.get('/listCheckin', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/subscription/listCheckin.html'));
});

function listCheckin(req, res, error) {

	var user_id = req.body.user_id;

	api.post('/subscriptions/listSubscriptionsEvent', (req.body)).then(response => {
		const listSubscription = response.data;

		var texto = JSON.stringify(listSubscription);
		var subscriptions = JSON.parse(texto);

		api.post('/users/list').then(response => {
			const listUsers = response.data;

			var texto = JSON.stringify(listUsers);
			const users = JSON.parse(texto);

			api.post('/events/list').then(response => {
				const listEvent = response.data;

				var texto = JSON.stringify(listEvent);
				var events = JSON.parse(texto);

				var list = '[';

				for (const key in subscriptions) {
					for (const id in users) {
						if (subscriptions[key].user_id == users[id].id && subscriptions[key].unsubscribed != true) {
							if (key > 0) { list += ',' }
							list += '{"event_id":' + subscriptions[key].event_id + ',';
							list += '"user_id":' + subscriptions[key].user_id + ',';
							list += '"id":' + subscriptions[key].id + ',';
							list += '"name":"' + users[id].name + '",';
							list += '"cpf":"' + users[id].cpf + '",';
							list += '"subscribed_at":"' + subscriptions[key].subscribed_at + '"';

							for (const i in events) {
								if (subscriptions[key].event_id == events[i].id) {
									if (new Date() > new Date(events[i].ends_at) || subscriptions[key].checkin_at != null) {
										list += ',"checkin_date":' + false;
									} else {
										list += ',"checkin_date":' + true;
									}

									list += '}';
								}
							}
						}
					}
				}

				list += "]";

				if (listUsers != "") {
					res.redirect('/listCheckin?id=' + user_id + '&error=' + error + '&list=' + list);
				} else {
					res.redirect('/menuAdmin?id=' + user_id);
				}
			})
		})
	}, () => {
		res.redirect('/menuAdmin?id=' + user_id);
	});
}

app.post('/listCheckin', function (req, res) {
	listCheckin(req, res, false);
});

app.post('/checkin', function (req, res) {
	api.post('/subscriptions/checkin', (req.body)).then(response => {
		const sub = response.data;

		api.post('/users/checkinUser', (req.body)).then(response => {
			const user = response.data;

			if (sub != "" && user != "") {
				var texto = JSON.stringify(user);
				var userJson = JSON.parse(texto);

				//var to = userJson[0].email;
				var subject = "Presença Registrada no Evento"
				var text = "Olá " + userJson[0].name + ", obrigado por participar do evento X \r\nAgora será possivel gerar o certificado de participação nas suas inscrições"

				sendEmail(exemplo, subject, text)

				listCheckin(req, res, true);
			} else {
				listCheckin(req, res, false);
			}
		})
	}, () => {
		listCheckin(req, res, false);
	});
});

//SimpleCreate
app.get('/simpleCreate', function (req, res) {
	res.sendFile(path.join(__dirname + '/pages/user/simpleCreate.html'));
});

app.post('/simpleCreate', function (req, res) {
	api.post('/users/simpleCreate', (req.body)).then(response => {
		const user = response.data;

		if (user != "") {

			var texto = JSON.stringify(user);
			var userJson = JSON.parse(texto);

			api.post('/subscriptions/create', ({"event_id": req.body.event_id,"user_id": userJson[0].id})).then(response => {
				const sub = response.data;

				if (sub != "") {
					listCheckin(req, res, false);
				} else {
					listCheckin(req, res, false);
				}
			});
		} else {
			listCheckin(req, res, false);
		}
	}, () => {
		listCheckin(req, res, false);
	});
});

function sendEmail(to, subject, text) {

	if (to != null && subject != null && text != null) {

		api.post('/send-email', ({ "to": to, "subject": subject, "text": text })).then(response => {
			const email = response.data;
		});
	}
}

app.get('/logout', function (req, res) {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.redirect('/');
	}
	res.end();
});

var server = http.createServer(app)
server.listen(3452);
console.log("API client rodando");