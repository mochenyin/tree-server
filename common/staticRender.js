var router = require('koa-router');
const send = require('koa-send');//用来下载文件，否则请求文件一直处于pending状态，或返回ok字符串

const pichandler=async (ctx) => {
    console.log('staticGet',ctx.path)
    const path = ctx.path;
    ctx.attachment(path);
    await send(ctx, path);
};
var staticRoute = new router();
staticRoute.get('*', pichandler);
staticRoute.post('*', pichandler);

module.exports = staticRoute;
