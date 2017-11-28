const debug = require('debug')('redis:path');
function _pathFactory (vars) {
  function Path (p) {
    if (typeof p !== 'string') {
      throw new Error(`FormatParser must be a : split string, ${p}`);
    }
    this.path = p;
    this.parts = p.split(':');
    let that = this;
    this.type = 'path';
    Object.keys(vars).forEach(_var => {
      that[_var] = function () {
        try {
          if (_var === 'json') {
            return JSON.parse(that.parts[vars[_var]]);
          } else {
            return that.parts[vars[_var]];
          }
        } catch (err) {
          err.message = 'Redis path parse error: ' + err.message;
          throw err;
        }
      }
    })
  }
  return Path;
}


function RedisPath (...parts) {
  if (!(this instanceof RedisPath)) {
    return new RedisPath(...parts);
  }
  let vars = {};
  let _allMatch = '(.*?)', _regStr = '^', _template = '';
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    if (part === '') continue;
    if (part[0] === ':') {
      vars[part.slice(1)] = i;
      _template += ':' + '$' + i;
      _regStr += _allMatch + '\\$' + i;
    } else {
      _template += ':' + part;
    }
  }
  _template = _template.slice(1);
  _regStr += _allMatch + '$';
  let _replaceReg = new RegExp(_regStr);

  let _Path = _pathFactory(vars);
  this.vars = vars;
  this.create = function (..._rawVars) {
//    console.log('redis-path', _rawVars, vars);
    let _vars = _rawVars;
    if (Object.keys(vars).length !== _vars.length) {
      _vars = (_vars[0] + '').split(':');
      if (Object.keys(vars).length !== _vars.length) {
        throw new Error(`Redis Path: lack of variable, varirables:${JSON.stringify(vars)}, arguments: ${JSON.stringify(_rawVars)},`);
      }
    }
    debug(_vars, _template, _regStr, _replaceReg);
    let pathStr =  _template.replace(_replaceReg, function () {
      let rst = '';
      let slices = Array.prototype.slice.call(arguments, 1, arguments.length-2); 
      let slicesLen = slices.length;
//      debug('replace', slices, _vars);
      for (let j = 0; j < slicesLen; j++) {
        rst += slices[j];
        if (j < slicesLen - 1) {
          rst += _vars[j];
        }
      }
      return rst;
    });
    debug(_template, _regStr, pathStr);
    return new _Path(pathStr);
  }
}

module.exports = RedisPath;



