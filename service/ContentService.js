/**
 * Created by cheese on 2017. 2. 7..
 */
const
  mysql_dbc = require('../commons/db_conn')(),
  connection = mysql_dbc.init(),
  QUERY = require('../database/query'),
  Contents = {};

Contents.getRepresentativeList = (callback) => {
  connection.query(QUERY.Contents.RepresentativeList, (err, result) => {
    callback(err, result);
  });
};

Contents.getEducationList = (callback) => {
  connection.query(QUERY.Contents.EducationList, (err, result) => {
    callback(err, result);
  });
};
Contents.getSummaryList = (callback) => {
  connection.query(QUERY.Contents.SummaryList, (err, result) => {
    callback(err, result);
  });
};
Contents.getRecommendList = (callback) => {
  connection.query(QUERY.Contents.RecommendList, (err, result) => {
    callback(err, result);
  });
};

Contents.active = (id, active, target, callback) => {
  console.log(`${id} / ${active} / ${target}`);

  // todo 일단 대표 콘텐츠를 일 경우와 그렇지 않을 경우를 구분할 수 있다.
  const query = (target === 'channel_id') ? QUERY.Contents.ActiveRT : QUERY.Contents.ActiveOther;
  
  connection.query(query, [active, id], (err, result) => {
    callback(err, result);
  });
};

Contents.register = (channel_id, video_id, type, callback) => {
	console.log(channel_id);
	console.log(video_id);
	console.log(type);

  // const id = channel_id.split(',');
	// const id = ;

  const _values = {
    channel_id, //channel_id
    video_id, //video_id
    type
    // created_dt: new Date(), // todo 디비가 한국시간의 그룹에 편성되어 있는지 확인할 것. (시간으로 확인)
    //priority : null,
    //active: 0
  };

  connection.query(QUERY.Contents.Register, _values, (err, result) => {
    callback(err, result);
  });
};

Contents.delete = (id, callback) => {
  connection.query(QUERY.Contents.Delete, id, (err, result) => {
    callback(err, result);
  });
};

Contents.update = (id, ref_id, type, callback) => {
  connection.query(QUERY.Contents.Update, [ref_id, type, id], (err, result) => {
    callback(err, result);
  });
};
module.exports = Contents;