const
	express = require('express'),
	Broadcast = require('../service/BroadcastService'),
	request = require('request'),
	router = express.Router();


// TODO 모든 라우터에서 사용중 어디로 빼야 될까? 글로벌로 ??
const HOST_INFO = {
	LOCAL: 'http://localhost:3002/api/',
	DEV: 'http://beta.holdemclub.tv/api/',
	REAL: 'http://holdemclub.tv/api/',
	VERSION: 'v1'
};

const HOST = `${HOST_INFO.LOCAL}${HOST_INFO.VERSION}`;

router.get('/calendar', (req, res) => {
    
	request.get(`${HOST}/broadcast/calendar`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
            
			res.render('bc_calendar', {
				current_path: 'bc_calendar',
				title: PROJ_TITLE + '방송 편성표',
				result: _body.result,
			});
            
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
    
});


router.get('/live', (req, res) => {
    
	request.get(`${HOST}/broadcast/live`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
            
			res.render('bc_live', {
				current_path: 'bc_live',
				title: PROJ_TITLE + '라이브 방송',
				live_result: (_body.result === 0) ? false : _body.result
			});
            
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});


module.exports = router;