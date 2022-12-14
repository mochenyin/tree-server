// development config
const path = require("path");
const KoaStatic = require("koa-static");
const koaBody = require("koa-body"); //拿来上传文件
const BodyParser = require("koa-bodyparser");
const Koa = require("koa");
const http = require("http");
const app = new Koa();
const _rotr = require("../common/serverApis.js");
const staticRoute = require("../common/staticRender.js");
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
  })
);
app.use(BodyParser());
app.use(KoaStatic(path.join(__dirname, "../static"))); //koa的静态资源目录
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "http://localhost:3000"); // 只允许http://localhost:3000过来的请求访问
  if (ctx.path.match(/^.css|.jpg|static|.svg/)) {
    return await staticRoute.routes()(ctx, next);
  } else {
    console.log("path", ctx.path);
    return await _rotr.routes()(ctx, next);
  }
});
http.createServer(app.callback()).listen(8800, '127.0.0.1',()=>{
    console.log('Starting server on http://localhost:8800');
});
