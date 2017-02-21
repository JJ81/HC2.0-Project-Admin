/**
 * Created by yijaejun on 15/12/2016.
 */
const CommonDAO = {};

CommonDAO.QueryDataByKeyName = (reqCache, key, callback) => {
	return reqCache.get(key, callback);
};

CommonDAO.CacheWithKeyName = (reqCache, key, value, callback) => {
	return reqCache.set(key, value, callback);
};

CommonDAO.DeleteByKeyName = (reqCache, key, callback) => {
	return reqCache.del(key, callback);
};

CommonDAO.GetKeysWithPattern = (reqCache, key, callback) => {
	return reqCache.keys(key, callback);
};

CommonDAO.DeleteByKeyPattern = (reqCache, key, callback) => {
	reqCache.keys(key, (err, keyList) => {
		return reqCache.del(keyList, callback);
	});
};

module.exports = CommonDAO;