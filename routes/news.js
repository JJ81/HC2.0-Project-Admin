/**
 * Created by cheese on 2017. 2. 16..
 */

const
	express = require('express'),
	router = express.Router(),
	request = require('request');

const HOST_INFO = {
	LOCAL: 'http://localhost:3002/api/',
	DEV: 'http://beta.holdemclub.tv/api/',
	REAL: 'http://holdemclub.tv/api/',
	VERSION: 'v1'
};

const HOST = `${HOST_INFO.LOCAL}${HOST_INFO.VERSION}`;


router.get('/', (req, res) => {
	request.get(`${HOST}/news`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);
      
			res.render('news', {
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

module.exports = router;
