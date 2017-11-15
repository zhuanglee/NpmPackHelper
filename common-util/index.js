/**
 * 用于快速实现类型判断函数的偏函数
 * @param type object|function
 * @returns {Function}
 */
const isType = function (type) {
    return function (obj) {
        return typeof obj === type;
    }
};

/**
 * 获取参数的类型
 * @param obj
 * @returns {*}
 */
exports.getType = function (obj) {
    return typeof obj;
};

/**
 * 判断参数的类型是否为 object
 * @param obj
 */
exports.isObject = isType("object");

/**
 * 判断参数的类型是否为 function
 * @param obj
 */
exports.isFunction = isType("function");

/**
 * 判断参数的类型是否为 string
 * @param obj
 */
exports.isString = isType("string");
