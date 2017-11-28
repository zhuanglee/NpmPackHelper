const assert = require('assert');
const debug = require('debug')('apl:redis:scanAsync');
const uniqBy = require('lodash').uniqBy;

module.exports = (client, ...types) => {
  for (let type of types) {
    let fnName = _scanType(type);
    let oldScan = client[fnName];
    client[fnName] = async function () {
      let results = [];
      let arr = [];
      let cursor = 0,
        initialFlag = true;
      let idx = fnName === 'scanAsync' ? 0 : 1;
      let args = Array.prototype.slice.call(arguments);
      args.push('count', 200);
      debug('scan run', args);
      while (cursor || initialFlag) {
        debug('args', args);
        initialFlag = false;
        args[idx] = cursor;
        [cursor, arr]= await oldScan.apply(client, args);
        cursor = +cursor;
        debug('run once', fnName, cursor, arr);
        let newArr = [];
        if (fnName[0] === 'h') {
          for (let i = 0; i < arr.length; i += 2) {
            results.push({field: arr[i], value: arr[i+1]});
          }
        } else if (fnName[0] === 's') {
          results = results.concat(arr);
        }
      }
      if (fnName[0] === 'h') {
        results = uniqBy(results, item => item.field);
      }
      debug('result:', results);
      return results;
    }
  }
}

function _scanType (type) {
  let _prefix;
  if (type === '' || type === undefined) {
    _prefix = '';
  } else if (typeof type === 'string' && ['h', 's', 'z'].indexOf(type[0].toLowerCase()) > -1) {
    _prefix = type[0];
  } else {
    throw new Error('Scan TypeError');
  }
  return _prefix.toLowerCase() + 'scanAsync';
}
