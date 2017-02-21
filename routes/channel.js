/**
 * Created by cheese on 2017. 2. 14..
 */

const
	express = require('express'),
	router = express.Router(),
	async = require('async'),
	request = require('request');

// TODO 모든 라우터에서 사용중 어디로 빼야 될까? 글로벌로 ??
const HOST_INFO = {
	LOCAL: 'http://localhost:3002/api/',
	DEV: 'http://beta.holdemclub.tv/api/',
	REAL: 'http://holdemclub.tv/api/',
	VERSION: 'v1/'
};

const HOST = `${HOST_INFO.LOCAL}${HOST_INFO.VERSION}`;
router.get('/', (req, res) => {
	request.get(`${HOST}channel`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
      
			res.render('channel_register', {
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

router.get('/:channel_id/video/list', (req, res) => {
	const channel_id = req.params.channel_id;
  
	request.get(`${HOST}/video/list/${channel_id}`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
      
			res.render('video_list', {
				current_path: 'event_result',
				title: PROJ_TITLE + '이벤트 결과 등록',
				result: _body.result,
				channel_id: channel_id
			});
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});


router.get('/:channel_id/video/:video_id/', (req, res) => {
	const channel_id = req.params.channel_id;
	const video_id = req.params.video_id;
  
	request.get(`${HOST}/video/view/${video_id}`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
			console.log(_body);
      
			res.render('video_view', {
				current_path: 'video_view',
				title: PROJ_TITLE + '비디오 뷰',
				result: _body.result,
				channel_id: channel_id
			});
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

router.get('/group', (req, res) => {
  
	const tasks = [
		(callback) => {
			request.get(`${HOST}channel/special`, (err, response, body) => {
				if (!err && response.statusCode === 200) {
					callback(null, JSON.parse(body));
				} else {
					callback('err or not 200', null);
				}
			});
		},
    
		(callback) => {
			request.get(`${HOST}/channel/general`, (err, response, body) => {
				if (!err && response.statusCode === 200) {
					callback(null, JSON.parse(body));
				} else {
					callback('err or not 200', null);
				}
			});
		},
    
		(callback) => {
			request.get(`${HOST}/channel/under`, (err, response, body) => {
				if (!err && response.statusCode === 200) {
					callback(null, JSON.parse(body));
				} else {
					callback('err or not 200', null);
				}
			});
		}
	];
  
	async.parallel(tasks, (err, results) => {
		if (!err) {
			res.render('channel_group', {
				current_path: 'channel_group',
				title: PROJ_TITLE + '채널 그룹',
				result_special: results[0].result,
				result_general: results[1].result,
				result_under: results[2].result
			});
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});


module.exports = router;

