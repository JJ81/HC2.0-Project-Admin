/**
 * Created by cheese on 2017. 1. 24..
 */


const
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	flash = require('connect-flash'),
	Auth = {};


/**
 * 서드파티 로그인
 * HC 로그인
 * 게임 로그인은 passport 인증을 할이유가없을거같다
 * @type {{}}
 */

// passport.serializeUser((user, done) => {
// 	done(null, user);
// });
//
// passport.deserializeUser((user, done) => {
// 	done(null, user);
// });

Auth.HCAuth = (bool, user_info) => {
	console.log(user_info);
	passport.use(new LocalStrategy({},
        (done) =>{
	return bool ? done(null, {user_info}) : done(null, false);
}
    ));
};

module.exports = Auth;