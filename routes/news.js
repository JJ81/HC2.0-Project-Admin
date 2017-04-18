/**
 * Created by cheese on 2017. 2. 16..
 */

const
	express = require('express'),
	router = express.Router(),
	request = require('request');

// todo 공통 모듈에 심어서 임포트할 수 있도록 변경할 것.
const HOST_INFO = {
	LOCAL: 'http://localhost:3001/api/',
	// DEV: 'http://beta.holdemclub.tv/api/',
	// REAL: 'http://holdemclub.tv/api/',
	VERSION: 'v1'
};

const HOST = `${HOST_INFO.LOCAL}${HOST_INFO.VERSION}`;
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

router.get('/', isAuthenticated, (req, res) => {
	request.get(`${HOST}/news`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);

			res.render('news', {
				current_path: 'news',
				title: PROJ_TITLE + '뉴스',
				result: _body.result,
			});
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

module.exports = router;