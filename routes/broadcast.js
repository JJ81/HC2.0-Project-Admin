const
  express = require('express'),
  Broadcast = require('../service/BroadcastService'),
  request = require('request'),
  router = express.Router();


const HOST_INFO = {
  LOCAL: 'http://localhost:2500/api/',
  VERSION: 'v1'
};

const HOST = `${HOST_INFO.LOCAL}${HOST_INFO.VERSION}`;

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

router.get('/calendar', isAuthenticated, (req, res) => {
  
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


router.get('/live', isAuthenticated, (req, res) => {
  
  request.get(`${HOST}/broadcast/live`, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const _body = JSON.parse(body);
      
      res.render('bc_live', {
        user : req.user.admin_id,
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