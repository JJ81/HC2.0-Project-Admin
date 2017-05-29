const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

if(express().get('env') === 'production'){
	require('../database/redis')(router, 'real');
}else{
	require('../database/redis')(router, 'local');
}

require('../helpers/helpers');


const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
};

router.get('/', isAuthenticated, (req, res) => {
  res.redirect('/broadcast/live');
});

var httpToHttps = function (req, res, next) {
	var
		isHttps = req.headers['x-forwarded-port'],
		host = req.headers.host,
		url = req.url;

	if(express().get('env') !== 'production'){
		next();
	}else{
		if(isHttps === '443'){
			//console.log('443');
			next();
		}else{
			//console.log('80');
			res.redirect(`https://${host}${url}`);
		}
	}
};

router.get('/login', httpToHttps, function (req, res) {
	if (req.user == null) {
		res.render('login', {
			current_path: 'login',
			title: PROJ_TITLE + 'login'
		});
	} else {
		res.redirect('/');
	}
});


/*------------TEST CODE----------*/
// router.get('/test', (req, res) => {
// 	res.json({result: 'Hello World'});
// });
//
// // TEST CSRF token
// const csrf = require('csurf');
// const csrfProtection = csrf({cookie: true});
// const bodyParser = require('body-parser');
// const parseForm = bodyParser.urlencoded({extended: false});
// // todo app.js에서 사용하고 있는 global에 바인딩된 것은 왜 사용하지 못하지?
//
//
// router.get('/test/form', csrfProtection, (req, res) => {
// 	res.render('form', {
// 		title: PROJ_TITLE
//         , csrfToken: req.csrfToken()
//         // test : mysql_location // this is working!!
// 	});
// });
//
// router.post('/test/form/submit', parseForm, csrfProtection, (req, res) => {
// 	res.send('data is being processed');
// });

module.exports = router;