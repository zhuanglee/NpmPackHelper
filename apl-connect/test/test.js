const App = require('../index');
const app = new App(defaultRouteFinalHandler, errorHandler);

/**
 * 默认的路由最后一个处理函数
 * @param ctx
 */
function defaultRouteFinalHandler(ctx) {
    if(ctx){
        console.log(arguments.callee.name, ctx.path, ctx.method);
    }else{
        console.log(arguments.callee.name);
    }
}

/**
 * 错误处理函数
 * @param err
 * @param ctx
 */
function errorHandler(err, ctx) {
    if(ctx){
        console.log(ctx.path, ctx.method);
    }
    if(err){
        console.log(err);
    }
}

/**
 * 默认的处理函数
 * @param ctx
 */
function defaultHandler(ctx) {
    console.log(arguments.callee.name, ctx.path, ctx.method);
}

console.time('initUseTime');

app.before(function (ctx) {
    console.log('\n...start', ctx.path, ctx.method);
}, function (ctx) {
    console.time(ctx.path + '/time');
});

app.after(function (ctx) {
    console.timeEnd(ctx.path + '/time');
}, function (ctx) {
    console.log('...end', ctx.path, ctx.method);
});

app.get('index', defaultHandler);
app.post('user/register', defaultHandler);
app.post('user/login', defaultHandler);
app.use('user/info', defaultHandler);
app.use('user/list', function () {
    console.log(this.tmp)
},{tmp:'测试函数的执行环境'});

console.timeEnd('initUseTime');

class Request {
    constructor(method, path, params = {}) {
        this.params = params;
        this.method = method;
        this.path = path;
    }
}

class Response {
    constructor() {

    }
}

async function testGetIndex() {
    let req = new Request('get', 'index');
    let res = new Response();
    await app.handle(req, res, function () {
        console.log('get index success');
    });
}

async function testPostRegister() {
    let req = new Request('post', 'user/register',
        {id: 1, username:'lzh', password: '123456'});
    let res = new Response();
    await app.handle(req, res);
}

async function testPostLogin() {
    let req = new Request('post', 'user/login',
        {username: 'lzh', password: '123456'});
    let res = new Response();
    await app.handle(req, res);
}

async function testGetUserInfo() {
    let req = new Request('get', 'user/info', {id: 1});
    let res = new Response();
    await app.handle(req, res);
}

async function testPostUserInfo() {
    let req = new Request('post', 'user/info', {id: 1});
    let res = new Response();
    await app.handle(req, res);
}

async function testGetUserList() {
    let req = new Request('get', 'user/list');
    let res = new Response();
    await app.handle(req, res);
}

async function test() {
    await testGetIndex();
    await testPostRegister();
    await testPostLogin();
    await testGetUserInfo();
    await testPostUserInfo();
    await testGetUserList();
}

test().then(function () {
    console.log('\n测试结束');
}).catch(errorHandler);
