const
	express = require('express'),
	router = express.Router(),
	request = require('request'),
	JSON = require('JSON');

// TODO 모든 라우터에서 사용중 어디로 빼야 될까?
const HOST_INFO = {
	LOCAL: 'http://localhost:3002/api/',
	DEV: 'http://beta.holdemclub.tv/api/',
	REAL: 'http://holdemclub.tv/api/',
	VERSION: 'v1'
};

const HOST = `${HOST_INFO.LOCAL}${HOST_INFO.VERSION}`;
console.log(HOST);

router.get('/representative', (req, res) => {
	request.get(`${HOST}/contents/representative`, (err, response, body) => {
        
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
            
			res.render('contents_rt', {
				current_path: 'contents',
				title: PROJ_TITLE + '대표 체널',
				result: _body.result,
				type: (_body.result.length ===0)?  null: _body.result[0].type
			});
            
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

router.get('/education', (req, res) => {
	request.get(`${HOST}/contents/education`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
            
			res.render('contents_edu', {
				current_path: 'contents',
				title: PROJ_TITLE + '대표 체널',
				result: _body.result,
				type: (_body.result.length ===0)?  null: _body.result[0].type
			});
            
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

router.get('/summary', (req, res) => {
	request.get(`${HOST}/contents/summary`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
			console.log(typeof _body.result);
            
            
			res.render('contents_sum', {
				current_path: 'contents',
				title: PROJ_TITLE + '대표 체널',
				result: _body.result,
				type: (_body.result.length ===0)?  null: _body.result[0].type
			});
            
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

router.get('/recommend', (req, res) => {
	request.get(`${HOST}/contents/recommend`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
            
			res.render('contents_recom', {
				current_path: 'contents',
				title: PROJ_TITLE + '대표 체널',
				result: _body.result,
				type: (_body.result.length ===0)?  null: _body.result[0].type
			});
            
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});


module.exports = router;