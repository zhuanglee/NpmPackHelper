const assert = require('assert');

/**
 * 执行source对象中函数名在whiteList中的函数，
 * 并以函数名为key，函数执行结果为value,存入新的Object中。
 * 如：
 * source = {a:1,b:()=>1}
 * whiteList = ['b'];// a不是函数，加入会报错
 * return {b:1};
 * @param source 原对象
 * @param whiteList source中的函数名数组
 * @return {Object} {函数名:函数执行结果}
 */
module.exports = (source, whiteList) => {
  let newObj = {};
  assert(Array.isArray(whiteList));
  for (let key of whiteList) {
    newObj[key] = source[key]();
  }
  return newObj;
};
