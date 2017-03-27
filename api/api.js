/**
 * Created by cheese on 2017. 1. 23..
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Common = require('../service/CommonService');
const Broadcast = require('../service/BroadcastService');
const Event = require('../service/Eventservice');
const Content = require('../service/ContentService');
const Channel = require('../service/ChannelService');
const Video = require('../service/VideoService');
const News = require('../service/NewsService');


/**
 * URI에 리소스명은 동사보다는 명사를 사용한다.
 * URI에 동사는 http 메서드로 대신한다.
 * 가급적이면 의미상 단수형 명사(/dog)보다는 복수형 명사(/dogs)를 사용하는 것이 의미상 표현하기가 더 좋다.
 *
 * 만약에 관계의 명이 복잡하다면 관계명을 명시적으로 표현하는 방법이 있다. 예를 들어 사용자가 “좋아하는” 디바이스 목록을 표현해보면
 * HTTP Get : /users/{userid}/likes/devices
 * 예) /users/terry/likes/devices
 *
 * 에러핸들링 공통 로직이될거같으니 하나의 힘수로 만들자
 * 가급적이면 Error Code 번호를 제공하는 것이 좋다.
 *
 * 200 성공
 * 400 Bad Request - field validation 실패시
 * 401 Unauthorized - API 인증,인가 실패
 * 404 Not found ? 해당 리소스가 없음
 * 500 Internal Server Error - 서버 에러
 *
 * 공통 URL = /api/v1/
 *
 * {행위} , {HTTP Method}, {URI}
 *
 * 로그인, 댓글, 답글, 회원가입, 아이디중복검사, 닉네임중복검사, 아이디찾기, 비빌번호 찾기(새롭게 설정함)
 * 조회수 증가로직, 게임 로그인을 위한 회원가입(유저아아디, 닉네임 받아야됨)
 * 회원 정보수정, 로그아웃,
 *
 *
 *
 */


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

/**
 * 홀덤쿨럽 티비 로그인 API
 * 로그인 실패시 로그인실패 카운트 증가, 로그인 실패 10일경우 계정락
 */

passport.use(new LocalStrategy({
    usernameField: 'user_id',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, usernameField, passwordField, done) => {
    Common.login(usernameField, passwordField, (err, result) => {
      if (err) {
        return done(null, false);
      } else {
        if (result.success) {
          return done(null, result.admin_info);
        } else {
          return done(null, false);
        }
      }
    });
  }
));

router.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/hc/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  res.redirect('/');
});


router.route('/broadcast/live')
  .get((req, res) => {
    Broadcast.getLiveList((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .post((req, res) => {
    const link = req.body.link;
    Broadcast.onLive(link, (err) => {
      if (!err) {
        res.json({success: true, msg: '생방송 등록 완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요', err: err});
      }
    });
  })
  .put((req, res) => {
    const id = req.body.id;
    Broadcast.endLive(id, (err) => {
      if (!err) {
        res.json({success: true, msg: '생방송 종료 완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요'});
      }
    });
  })
  .delete((req, res) => {
    const id = req.body.id;
    Broadcast.endLive(id, (err) => {
      if (!err) {
        res.json({success: true, msg: '삭제를 완료했습니다.'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요'});
      }
    });
  });


router.route('/broadcast/calendar')
  .get((req, res) => {
    Broadcast.getCalendarList((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .post((req, res) => {
    Broadcast.registerCalendar(req, (err) => {
      if (!err) {
        res.json({success: true, msg: '등록 완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요'});
      }
    });
  })
  .delete((req, res) => {
    const id = req.body.id;
    Broadcast.deleteCalendar(id, (err) => {
      if (!err) {
        res.json({success: true, msg: '삭제를 완료했습니다.'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요'});
      }
    });
  })
  .put((req, res) => {
    const id = req.body.id;
    const active = req.body.active;
    
    Broadcast.activeCalendar(id, active, (err) => {
      if (!err) {
        res.json({success: true, msg: '활성화 완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요'});
      }
    });
    
    
  });

//broadcast API END

//event API Start

router.route('/event')
  .get((req, res) => {
    Event.getList((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .post((req, res) => {
    Event.register(req, (err) => {
      if (!err) {
        res.json({success: true, msg: '등록 완료'});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .put((req, res) => {
    const event_id = req.body.event_id;
    
    Event.start(event_id, (err) => {
      if (!err) {
        res.json({success: true, msg: '작업완료'});
      } else {
        res.json({success: false, err: err});
      }
    });
  });

router.route('/event/result')
  .get((req, res) => {
    Event.getResultList((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .post((req, res) => {
    Event.registerResult(req, (err) => {
      if (!err) {
        res.json({success: true, msg: '방송표 업로드 완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요'});
      }
    })
  })
  .delete((req, res) => {
    const event_id = req.body.event_id;
    Event.deleteResult(event_id, (err) => {
      if (!err) {
        res.json({success: true, msg: '이벤트 결과 삭제'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요'});
      }
    });
  });


//contents API start

router
  .get('/contents/representative', (req, res) => {
    Content.getRepresentativeList((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .get('/contents/education', (req, res) => {
    Content.getEducationList((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .get('/contents/summary', (req, res) => {
    Content.getSummaryList((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .get('/contents/recommend', (req, res) => {
    Content.getRecommendList((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  // 콘텐츠 활성화 or 비활성화
  .put('/contents/active', (req, res) => {
    const id = req.body.id;
    const active = req.body.active;
    const target = req.body.target;
    
    Content.active(id, active, target, (err) => {
      if (!err) {
        res.json({success: true, msg: '처리되었습니다.'});
      } else {
        res.json({success: false, err: err});
      }
    });
  });

// todo 네 가지 콘텐츠 CUD 설정을 확인할 것
router.route('/contents')
  .post((req, res) => {
    const
      channel_id = req.body.channel_id,
      video_id = req.body.video_id || null,
      type = req.body.type;

    console.log(`[api] ${channel_id} / ${video_id} / ${type}`);

    Content.register(channel_id, video_id, type, (err) => {
      if (!err) {
        res.json({success: true, msg: '등록완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.'});
      }
    });
  })
  .put((req, res) => {
    const
      id = req.body.id,
      ref_id = req.body.ref_id,
      type = req.body.type;
    
    Content.update(id, ref_id, type, (err) => {
      if (!err) {
        res.json({success: true, msg: '수정 완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.'});
      }
    });
  })
  .delete((req, res) => {
    const id = req.body.id;
    Content.delete(id, (err) => {
      if (!err) {
        res.json({success: true, msg: '삭제 완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.'});
      }
    });
  });

//contents API end

//channel API start
router
  .get('/channel/special', (req, res) => {
    Channel.getListSpecial((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .get('/channel/general', (req, res) => {
    Channel.getListGeneral((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .get('/channel/under', (req, res) => {
    Channel.getListUnder((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    })
  });

router.route('/channel')
  .get((req, res) => {
    Channel.getListAll((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .post((req, res) => {
    Channel.register(req, (err) => {
      if (!err) {
        res.json({success: true, msg: '등록완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.', err: err});
      }
    });
  })
  .put((req, res) => {
    Channel.modify(req, (err) => {
      if (!err) {
        res.json({success: true, msg: '등록완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.', err: err});
      }
    });
  });

router.route('/channel/active')
  .put((req, res) => {
    const channel_id = req.body.channel_id;
    const active = req.body.active;
    Channel.active(channel_id, active, (err) => {
      if (!err) {
        res.json({success: true, msg: '작업 완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.', err: err});
      }
    });
  });

router.route('/channel/group')
  .post((req, res) => {
    const group_id = req.body.channel_rt_group_id;
    const channel_id = req.body.channel_id;
    
    Channel.registerGroup(group_id, channel_id, (err) => {
      if (!err) {
        res.json({success: true, msg: '등록완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.'});
      }
    });
  })
  .put((req, res) => {
    const channel_id = req.body.channel_id;
    
    Channel.deleteGroup(channel_id, (err) => {
      if (!err) {
        res.json({success: true, msg: '해제'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.'});
      }
    });
  });

//channel API end

//video API START

router
  .get('/video/list/:channel_id', (req, res) => {
    const channel_id = req.params.channel_id;
    Video.getList(channel_id, (err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  }) // 입력된 비디오 타이틀 값을 통해서 비디오를 가져온다.
  .get('/video/title/:title', (req, res) => {
    const title = req.params.title.trim();

    Video.getListByTitle(`%${title}%`, (err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .get('/video/view/:video_id', (req, res) => {
    const video_id = req.params.video_id;
    Video.view(video_id, (err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  });

router.route('/video')
  .post((req, res) => {
    Video.register(req, (err) => {
      if (!err) {
        res.json({success: true, msg: '등록완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.', err: err});
      }
    });
  })
  .put((req, res) => {
    Video.modify(req, (err) => {
      if (!err) {
        res.json({success: true, msg: '수정 완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.', err: err});
      }
    });
  });

router.route('/video/active')
  .put((req, res) => {
    const video_id = req.body.video_id;
    const active = req.body.active;
    
    Video.active(video_id, active, (err) => {
      if (!err) {
        res.json({success: true, msg: '작업완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.', err: err});
      }
    });
  });

//video API END

//NEWS API START
router.route('/news')
  .get((req, res) => {
    News.getListAll((err, result) => {
      if (!err) {
        res.json({success: true, result: result});
      } else {
        res.json({success: false, err: err});
      }
    });
  })
  .post((req, res) => {
  // 뉴스 관련 업로드
    News.register(req, (err) => {
      if (!err) {
        res.json({success: true, msg: '등록완료'});
      } else {
        console.log(err);
        // todo 일부 에러에 대해서만 리턴이 된다 따라서 어떤 에러든지 받을 수 있고 해당 에러를 적절한 문구로서 엔드유저에게 보여줄 수 있어야 한다!
        res.json({success: false, msg: '다시 시도해주세요.', err: err});
      }
    });
  })
  .put((req, res) => {
    News.modify(req, (err)=>{
      if (!err) {
        res.json({success: true, msg: '작업완료'});
      } else {
        console.log(err);
        res.json({success: false, msg: '다시 시도해주세요.', err: err});
      }
    });
  })
  .delete((req, res) => {
    const id = req.body.id;
    News.delete(id, (err) => {
      if (!err) {
        res.json({success: true, msg: '삭제완료'});
      } else {
        res.json({success: false, msg: '다시 시도해주세요.', err: err});
      }
    });
  });


//NEWS API END
module.exports = router;