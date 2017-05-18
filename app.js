const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan'); // todo 어떻게 사용이 되고 있는지 확인할 것
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

/*routes*/
const routes = require('./routes/index');
const api = require('./api/api');
const event = require('./routes/event');
const contents = require('./routes/contents');
const channel = require('./routes/channel');
const news = require('./routes/news');
const broadcast = require('./routes/broadcast');
const notice = require('./routes/notice');

const app = express();
const hbs = require('hbs');
const passport = require('passport');
const flash = require('connect-flash');
// 쿠키 기반 스토리지를 구현 하나의 세션키가 아닌 세션 전체를 쿠키에 직렬화한다
// 브라우저는 하나의 쿠키당 4096바이트 이상을 지원하도록 되어 있지만 한계를 초과하지 않도록 보장하려면 하나의 도메인당 4093바이트의 크기를 초과해서는 안된다
// 클라이언트에서 쿠키 데이터를 볼 수 있기 때문에 쿠키 데이터를 안전하게 모호하게 유지를 해야 할 경우 express-session을 선택하는 것이 더 나을 수 있다.
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const errorHandler = require('errorhandler');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartials(__dirname + '/views/modal');
hbs.registerPartials(__dirname + '/views/main');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(cookieSession({
  name: 'hc2.0_session',
  keys: ['HC_Admin2.0', 'HoldemclubAdmin2.0'],
  cookie: {
    secure: false // https를 통해서만 쿠키를 전송하도록 한다
    , httpOnly: false // 쿠키가 클라이언트 js가 아닌 https를 통해서만 전송이 되도록 하며 XSS 공격으로부터 보호할 수 있다
    , domain: 'admin-dev.holdemclub.tv' // 쿠키의 도메인 설정
    , expires: expiryDate // 지속적 쿠키에 대한 만기 일짜를 설정, 쿠키에 중요한 정보가 없으므로 로그인을 일단 유지하게 한다.
  }
}));

// helmet related configuration for security
app.use(helmet());
app.disable('x-powered-by');

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
// app.use('/static', express.static(__dirname + '/public'));

const allowCORS = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  (req.method === 'OPTIONS') ? res.send(200) : next();
};
app.use(allowCORS);

global.PROJ_TITLE = '홀덤클럽티비 관리자, ';

app.use('/', routes);
app.use('/api/v1', api);
// app.use('/event', event);
app.use('/contents', contents);
app.use('/broadcast', broadcast);
app.use('/channel', channel);
app.use('/news', news);
app.use('/notice', notice);

// catch 404 and forward to error handler
app.use((req, res) => {
  // TODO 무조건 404를 거쳐가고 있는데 이것을 방지하는 코드를 넣을 것
  // todo 404 처리는 모든 라우터를 지나고 걸릴 것이 없을 경우 처리되는 것
  // 그러하면 이 바로 아래 코드는 무슨 역할을 하는가?
  res.status(404);
  res.render('404', {
    current_path: '404 Error Page',
    title: PROJ_TITLE + 'ERROR PAGE',
    loggedIn: req.user
  });
});

// // error handlers
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use((err, req, res) => {
//     res.status(err.status || 500);
//     res.render('500', {
//       current_path: ' 500 Error Page',
//       title: PROJ_TITLE + 'ERROR PAGE'
//     });
//   });
// }
//
// // todo production 용 error handler를 설정할 것.
//
//
// // production error handler
// // no stacktraces leaked to user
// app.use((err, req, res) => {
//   res.render('500', {
//     current_path: '500 Error Page',
//     title: PROJ_TITLE + 'ERROR PAGE'
//   });
// });

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') !== 'production') {
	// app.use((err, req, res, next) => {
	// 	res.status(err.status || 500);
	// 	res.render('500', {
	// 		current_path: ' 500 Error Page',
	// 		title: PROJ_TITLE + 'ERROR PAGE'
	// 	});
	// });

	app.use(errorHandler());
}

if(app.get('env') === 'production'){
	// todo production으로 띄울 경우 에러가 발생했을 때 메일을 받을 수 있도록 변경할 것

// production error handler
// no stacktraces leaked to user
	app.use((err, req, res, next) => {
		console.log('From production');

		if(err.code === 'EBADCSRFTOKEN'){
			console.error(`CSRFERR : ${err}`);
		}

		// todo log@holdemclub.tv로 받을 수 있도록 한다.
		console.error(err.stack);

		res.render('500', {
			current_path: '500 Error Page',
			title: PROJ_TITLE + 'ERROR PAGE'
		});
	});
}


module.exports = app;