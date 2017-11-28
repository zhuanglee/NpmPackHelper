const assert = require('assert');

module.exports = function pickByMap(obj, columnMap) {
  let rst = {};
  for (let k in obj) {
    let v = obj[k];
    if (k in columnMap) {
      let map = columnMap[k];
      if (typeof map === 'string') {
        rst[map] = v;
      } else if (Array.isArray(map)) {
        let [column, fn] = map;
        assert(typeof column === 'string');
        assert(typeof fn === 'function');
        rst[column] = fn(v)
      } else {
        throw new Error('columnMap 支持: {a: "a1", c: ["c1", v => +v + 1], d}');
      }
    }
  }
  return rst;
};