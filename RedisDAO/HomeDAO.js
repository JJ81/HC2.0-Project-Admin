var HomeDAO = {};


/*TODO 1. 해당 에이전트
 * TODO 2. 날자 별정리는 ?? 라이브러리에서 알아서할듯한데?*/


/*{Service}:{Page}:{Feature}:{SpecificKeyWord} 네이밍규칙*/

// HomeDAO.QueryHomeReadByToday = function (reqCache, key, callback) {
//   return reqCache.get(key, callback)
// };

HomeDAO.QueryHomeReadByDate = function (reqCache, key, callback) {
	return reqCache.get(key, callback);
};

HomeDAO.CacheWithAgentWallet = function (reqCache, key, value, callback) {
	return reqCache.set(key, value, callback);
};

HomeDAO.DeleteByKey = function (reqCache, key, callback) {
	return reqCache.del(key, callback);
};

module.exports = HomeDAO;