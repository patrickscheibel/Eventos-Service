var nodemailer = require('nodemailer');

var transportador = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        user: '<email>',
	        pass: '<senha>'
	    }
	});

module.exports.send = function(to, subject, text, html){
	
	var configuracoes = {
	    from: '<email>',
	    to: to,
	    subject: subject,
	    text: text,
	    // html: html
	};

	transportador.sendMail(configuracoes, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Email enviado ' + info.response);
	    }
	});
}