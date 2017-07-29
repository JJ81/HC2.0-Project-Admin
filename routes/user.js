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


// todo 20170729 사용자 정보 출력
const UserService = require('../service/UserService');
router.get('/', isAuthenticated, (req, res) => {
	UserService.getCustomerList((err, result) => {
		if(!err){
			var count = result.length;
			res.render('user_list', {
				user : req.user.admin_id,
				current_path: 'notice', // todo 변경없이 그대로 임시로 사용함
				title: PROJ_TITLE + ' 사용자관리',
				result,
				count
			});
		}else{
			console.error(err);
			res.redirect('/');
		}
	});
});

module.exports = router;