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
  const query = (target === 'ref_id') ? QUERY.Contents.ActiveRT : QUERY.Contents.ActiveOther;
  
  connection.query(query, [active, id], (err, result) => {
    callback(err, result);
  });
};

Contents.register = (ref_id, video_id, type, callback) => {
  const id = ref_id.split(',');
  const _values = {
    channel_id: id[0], //channel_id
    video_id: id[1] || null, //video_id
    type: type,
    created_dt: new Date(),
    priority: null,
    active: 0
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