'use strict';

const methods = ['get', 'post', 'put', 'delete'];
const contextProto = require('./context');
const requestProto = require('./request');
const responseProto = require('./response');

/**
 * 实现路由与中间件功能
 */
class App {
    constructor(finalHandler, errorHandler) {
        this._finalHandler = finalHandler || (_ => {});
        this._errorHandler = errorHandler || console.error;
        this._allBefore = [];
        this._stacks = {};
        this._allAfter = [];
    };

    /**
     * 该路径的路由支持所有method:
     * use('index', firstFn, firstFnCtxObj, secondFn, thirdFn,...);
     * @param path
     * @param fns 函数或函数执行环境
     */
    use(path, ...fns) {
        methods.forEach(method => {
            method = method.toLowerCase();
            let stacks = this._stacks;
            stacks[path] = stacks[path] || {};
            stacks[path][method] = stacks[path][method] || [];
            // stacks[path][method] = stacks[path][method].concat(fns);
            stacks[path][method].push(...fns);
        });
    };

    /**
     * 在所有路由函数之前执行的操作：
     * before(firstFn, firstFnCtxObj, secondFn, thirdFn,...);
     * @param fns 函数或函数执行环境
     */
    before(...fns) {
        this._allBefore.push(...fns);
    };

    /**
     * 在所有路由函数之后执行的操作：
     * after(firstFn, firstFnCtxObj, secondFn, thirdFn,...);
     * @param fns 函数或函数执行环境
     */
    after(...fns) {
        this._allAfter.push(...fns);
    };

    /**
     * 处理请求
     * @param req
     * @param res
     * @param fn
     * @return {Promise.<void>}
     */
    async handle(req, res, fn) {
        let that = this;
        let ctx = createContext(req, res);
        if (!ctx.method) {
            throw new Error('conn: lack of method when handle')
        }
        if (!ctx.path) {
            throw new Error('conn: lack of path when handle')
        }
        const stacks = this._allBefore
            .concat(this._stacks[ctx.path][ctx.method.toLowerCase()])
            .concat(this._allAfter);
        try {
            await _handleStack(ctx, stacks, fn || this._finalHandler);
        } catch (e) {
            this._errorHandler(e, ctx);
        }

        /**
         * 任务链
         * @param ctx
         * @param stacks
         * @param finalHandler
         * @return {Promise.<void>}
         * @private
         */
        async function _handleStack(ctx, stacks, finalHandler) {
            let i = 0;
            for(let fn of stacks){
                if(typeof fn !== 'function'){
                    ++i;
                    continue;
                }
                let fnCtx = stacks[++i];
                if(fnCtx && typeof fnCtx === 'object'){
                    await fn.call(fnCtx, ctx);
                } else {
                    await fn(ctx);
                }
            }
            await finalHandler(ctx);
        }

        /**
         * 创建请求的上下文
         * @param req
         * @param res
         * @return {contextProto}
         */
        function createContext(req, res) {
            const context = Object.create(contextProto);
            const request = context.request = Object.create(requestProto);
            const response = context.response = Object.create(responseProto);
            Object.assign(request, req);
            Object.assign(response, res);
            context.app = that;
            context.state = {};
            return context;
        }
    };

}

/**
 * 分别创建['get', 'post', 'put', 'delete']函数，用于添加路由相应方法的路由
 */
methods.forEach(method => {
    method = method.toLowerCase();
    App.prototype[method] = function (path, ...fns) {
        let stacks = this._stacks;
        stacks[path] = stacks[path] || {};
        stacks[path][method] = stacks[path][method] || [];
        // stacks[path][method] = stacks[path][method].concat(fns);
        stacks[path][method].push(...fns);
    };
});

module.exports = App;
