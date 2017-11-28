const bluebird = require('bluebird');
const redis = bluebird.promisifyAll(require('redis'));
const debug = require('debug');
const assert = require('assert');
const rewriteScan = require('./lib/scanAsync');
const _proxy = new Proxy({}, {
  get: function ({}, prop) {
    throw new Error('call redis.connect before use');
  }
});

let _oldCreate = redis.createClient;
redis.createClient = function (options) {
  let client = _oldCreate.call(redis, options);
  rewriteScan(client, 'hash');
  rewriteScan(client, 'set');
  rewriteScan(client, '');
  return client;
};

module.exports = {
  client: _proxy,
  subClient: _proxy,
  eventClient: _proxy,
  createClient: function() {
    throw new Error('call redis.connect before use');
  },
  connect: function (options) {
    assert(options.host && options.port);
    if (this.client === _proxy || this.subClient === _proxy) {
      this.client = redis.createClient(options);
      this.subClient = redis.createClient(options);
      this.createClient = function () {
        return redis.createClient(options);
      };
      this.eventClient = redis.createClient(options);
      debug('Redis connected with host:', options.host, 'Port:', options.port);
    }
  }
};
