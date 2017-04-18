const
	express = require('express'),
	router = express.Router(),
	request = require('request'),
	JSON = require('JSON');

// TODO 모든 라우터에서 사용중 어디로 빼야 될까?
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

router.get('/representative', isAuthenticated, (req, res) => {
	request.get(`${HOST}/contents/representative`, (err, response, body) => {
        
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
            
			res.render('contents_rt', {
				current_path: 'contents_rt',
				title: PROJ_TITLE + '대표 체널',
				result: _body.result,
				type: 'RT'
			});
            
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

router.get('/education', isAuthenticated, (req, res) => {
	request.get(`${HOST}/contents/education`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
            
			res.render('contents_edu', {
				current_path: 'contents',
				title: PROJ_TITLE + '대표 체널',
				result: _body.result,
        type: 'E'
			});
            
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

router.get('/summary', isAuthenticated, (req, res) => {
	request.get(`${HOST}/contents/summary`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
			
			res.render('contents_sum', {
				current_path: 'contents',
				title: PROJ_TITLE + '대표 체널',
				result: _body.result,
        type: 'S'
			});
            
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

router.get('/recommend', isAuthenticated, (req, res) => {
	request.get(`${HOST}/contents/recommend`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
            
			res.render('contents_recom', {
				current_path: 'contents_rt',
				title: PROJ_TITLE + '대표 체널',
				result: _body.result,
        type: 'R'
			});
            
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});


module.exports = router;