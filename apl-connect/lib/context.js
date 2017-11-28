const delegate = require('delegates');

const proto = module.exports = {
    // throw: function (code, params) {
    //     // 强引用了未来添加的app.error类
    //     throw new this.app.error(code, params);
    // },
    // assert: function (value, code, params) {
    //     if (value) return;
    //     throw (this.throw(code, params));
    // }
};

delegate(proto, 'request')
    .access('path')
    .access('method')
    .access('params');

delegate(proto, 'app')
    .access('config')
    .access('model')
    .access('helper')
    .access('error')
    .access('logger');

