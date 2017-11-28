const assert = require('assert');

module.exports = (target, matches) => {
  assert(Array.isArray(matches) && typeof target === 'string');
  for (let match of matches) {
    if (target.indexOf(match) > -1) return true;
  }
  return false;
};