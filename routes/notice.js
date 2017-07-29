const
  express = require('express'),
  //Broadcast = require('../service/BroadcastService'), // todo ?
  request = require('request'),
  router = express.Router(),
	HOST_INFO = require('../secret/config').API_INFO;


const HOST = `${HOST_INFO.PATH}${HOST_INFO.VERSION}`;

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

router.get('/', isAuthenticated, (req, res) => {
  // todo offset, page, size를 받아서 노출할 수 있도록 한다.


  request.get(`${HOST}/notice/list?size=20&offset=0`, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const _body = JSON.parse(body);

      res.render('notice_list', {
	      user : req.user.admin_id,
        current_path: 'notice',
        title: PROJ_TITLE + ' 공지 게시판',
        result: _body.result,
      });

    } else {
      console.error(err);
      throw new Error(err);
    }
  });

});

router.get('/content/:id',isAuthenticated, (req, res) => {
	var id = req.params.id;
	console.log(id);

	request.get(`${HOST}/notice/content/${id}/${req.user.admin_id}`, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			const _body = JSON.parse(body);

			console.log(_body);

			res.render('notice_content', {
				user : req.user.admin_id,
				current_path: 'notice',
				title: PROJ_TITLE + ' 공지 게시판',
				result: _body.result
			});

		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

// todo csrf 설정이 필요
const NoticeService = require('../service/NoticeService');
router.post('/content/activate', isAuthenticated, (req, res) => {
	var info = {
		id : req.body.id.trim(),
		active : req.body.active.trim()
	};

	NoticeService.ActivateById(info, (err, result) => {
		if(err){
			console.log(result);
			console.error(err);
		}

		res.redirect(`/notice`);
		
	});
});


router.get('/write', isAuthenticated, (req, res) => {
	res.render('notice_write', {
		user : req.user.admin_id,
		current_path: 'notice',
		title: PROJ_TITLE + ' 공지 게시판'
	});
});

router.post('/content/write', isAuthenticated, (req, res) => {
	var info = {
		title : req.body.title.trim(),
		content : req.body.content.trim(),
		user_id : req.user.admin_id
	};

	NoticeService.CreateContent(info, (err, result) => {
		if(!err){
			console.log(result);
			res.redirect(`/notice/content/${result.insertId}`);
		}else{
			console.error(err);
			res.redirect(`/notice`);
		}
	});
});

router.get('/modify/:id',isAuthenticated, (req, res) => {
	var id = req.params.id.trim();
	console.log(id);
	NoticeService.GetContentById(id, (err, result) => {
		if(!err){
			console.log('result');
			console.log(result);

			res.render('notice_update', {
				user : req.user.admin_id,
				current_path: 'notice',
				title: PROJ_TITLE + ' 공지 게시판',
				result
			});
		}else{
			console.error(err);
			res.redirect('/notice');
		}
	});
});


router.post('/modify/result', isAuthenticated, (req, res) => {
	var info = {
		id : req.body.id.trim(),
		title : req.body.title.trim(),
		content: req.body.content.trim(),
		user_id : req.body.user_id,
		admin_id : req.user.admin_id
	};

	NoticeService.UpdateById(info, (err, result) => {
		if(err){
			console.error(err);
		}
		res.redirect(`/notice/content/${info.id}`);
	});
});


module.exports = router;