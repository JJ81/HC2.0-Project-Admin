/**
 * Created by cheese on 2017. 2. 2..
 */

const
	express = require('express'),
	router = express.Router(),
	request = require('request');

// TODO 모든 라우터에서 사용중 어디로 빼야 될까? 글로벌로 ??
const HOST_INFO = {
	LOCAL: 'http://localhost:3002/api/',
	DEV: 'http://beta.holdemclub.tv/api/',
	REAL: 'http://holdemclub.tv/api/',
	VERSION: 'v1'
};

const HOST = `${HOST_INFO.LOCAL}${HOST_INFO.VERSION}`;
router.get('/', (req, res)=>{
	request.get(`${HOST}/event`, (err, response, body) =>{
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
            
			res.render('event',{
				current_path: 'event',
				title: PROJ_TITLE + '이벤트',
				result: _body.result,
			});
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

router.get('/result', (req, res)=>{
	request.get(`${HOST}/event/result`, (err, response, body) =>{
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
    
			res.render('event_result',{
				current_path: 'event_result',
				title: PROJ_TITLE + '이벤트 결과 등록',
				result: _body.result,
			});
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

module.exports = router;

