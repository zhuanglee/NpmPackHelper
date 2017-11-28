const mysql = require('mysql');
const Mock = require('mockjs');
const debug = require('debug')('mysql');

let pool = undefined;

exports.connect = function (options) {
  if (!pool) {
    pool = mysql.createPool(options);
  }
};

/**
 *   query
 *   @return promise
 *   resolve({results, fields})
 */
const _query = sqls => {
  debug(sqls);
  return new Promise((resolve, reject) => {
    if (!pool) reject(new Error('call mysql.connect before query'));
    pool.getConnection(function(err, conn) {
      if (err) reject(err);
      conn.query(sqls, function (err, result, fields) {
        conn.release();
        if (err) reject(err);
        resolve(result, fields);
      });
    });
  });
};

exports.escape = function (...args) {
  return pool.escape(...args);
};
exports.query = _query;
exports.mock = (options) => {
  return Mock.mock(options);
};
