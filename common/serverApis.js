var router = require("koa-router");
var _rotr = new router();
var fs = require("fs");
const apihandler = async (ctx) => {
  var apinm = ctx.params.apiname;
  console.log("API RECEIVE:", apinm);
  //匹配到路由函数,路由函数异常自动返回错误,创建xdat用来传递共享数据
  var apifn = _rotr.apis[apinm];
  ctx.xdat = {
    apiName: apinm,
  };
  if (apifn && apifn.constructor == Function) {
    await apifn(ctx)
      .then((result) => {
        ctx.body = { status: "success", data: result };
      })
      .catch((error) => {
        ctx.body = { status: "failed", errorMessage: error };
      });
  } else {
    ctx.body = {
      status: "failed",
      errorCode: 222,
      errorMessage: "服务端找不到接口程序，api missed",
      errApi: apinm,
    };
  }
};
_rotr.get("/api/:apiname", apihandler);
_rotr.post("/api/:apiname", apihandler);
var connection = require("./mysqlServer.js");
/*所有api处理函数都收集到这里必须是返回promise各个api处理函数用promise衔接,return传递ctx*/
_rotr.apis = {};
const Query = function (sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, rows) => {
      if (err) {
        reject(err.sqlMessage);
      } else {
        resolve(rows);
      }
    });
  });
};

const getQueryDatas = (queryString, resolve, reject) => {
  Query(queryString)
    .then((result) => {
      resolve(result);
    })
    .catch((error) => {
      reject(error);
    });
};

/*处理Api请求
 默认tenk的api直接使用
 每个app的独立api格式appname_apiname
 */
const writeFile = function (file) {
  return new Promise((resolve, reject) => {
    const reader = fs.createReadStream(file.path); // 创建可读流
    const upStream = fs.createWriteStream(`static/images/` + file.name); // 创建可写流
    reader.pipe(upStream); // 可读流通过管道写入可写流
    resolve("ok");
    // fs.writeFile('static/img/'+file.name,file,{},(error)=>{
    //     if(error){
    //         console.log('error+++',error)
    //         reject(error)
    //     }
    //     else{
    //         resolve('上传成功！')
    //     }
    // });
  });
};
/**
 * 用户登录*/
_rotr.apis.loginIn = function (ctx) {
  let userName = ctx.query.userName || ctx.request.body.userName;
  let userPwd = ctx.query.userPwd || ctx.request.body.userPwd;
  console.error("userName", userName);
  return new Promise(function (resolve, reject) {
    Query(
      `select userId from user where userName="${userName}" and userPwd="${userPwd}"`
    )
      .then((result) => {
        let userId = null;
        if (result.length) {
          userId = result[0].userId;
        }
        resolve(userId);
      })
      .catch((error) => {
        reject(error.sqlMessage);
      });
  });
};
/**
 * 获取用户信息*/
_rotr.apis.getUserInfo = function (ctx) {
  let userId = ctx.query.userId || ctx.request.body.userId;
  console.error("userId", userId);
  return new Promise(function (resolve, reject) {
    getQueryDatas(`select * from user where userId=${userId}`, resolve, reject);
  });
};

/**
 * 获取树数据*/
_rotr.apis.getTreeData = function (ctx) {
  return new Promise(function (resolve, reject) {
    fs.readFile("data/tree.json", "utf-8", (error, data) => {
      if (error) {
        console.log("error+++", error);
        reject(error);
      } else {
        resolve(JSON.parse(data).data);
      }
    });
  });
};

/**
 * 修改用户信息*/
_rotr.apis.updateUserInfo = function (ctx) {
  let userId = ctx.query.userId || ctx.request.body.userId;
  let realName = ctx.query.realName || ctx.request.body.realName;
  let userName = ctx.query.userName || ctx.request.body.userName;
  let sign = ctx.query.sign || ctx.request.body.sign;
  let description = ctx.query.description || ctx.request.body.description;
  return new Promise(function (resolve, reject) {
    getQueryDatas(
      `update user set userName='${userName}',realName='${realName}',description='${description}',sign='${sign}' where userId=${userId}`,
      resolve,
      reject
    );
  });
};
/**
 * 用户头像上传*/
_rotr.apis.uploadUserImg = function (ctx) {
  let file = ctx.request.files.file;
  let userId = ctx.query.userId || ctx.request.body.userId;
  return new Promise(function (resolve, reject) {
    writeFile(file)
      .then((result) => {
        getQueryDatas(
          `update user set userImg="${file.name}" where userId=${userId}`,
          resolve,
          reject
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * 向邮箱发送验证码*/

_rotr.apis.checkMail = function (ctx) {
  let userId = ctx.query.userId || ctx.request.body.userId;
  let email = ctx.query.email || ctx.request.body.email;
  return new Promise(function (resolve, reject) {
    getQueryDatas(
      `select userName from user where userId=${userId} and userEmail='${email}'`,
      resolve,
      reject
    );
  });
};

/**
 * 修改密码*/

_rotr.apis.updatePwd = function (ctx) {
  let userId = ctx.query.userId || ctx.request.body.userId;
  let someWords = ctx.query.someWords || ctx.request.body.someWords;
  return new Promise(function (resolve, reject) {
    getQueryDatas(
      `update  user set userPwd='${someWords}' where userId=${userId}`,
      resolve,
      reject
    );
  });
};

/**
 * 向邮箱发送验证码*/
const _sendMail = require("./mailer");
const AES = require("./getInfoByAES");
_rotr.apis.checkMailMsg = function (ctx) {
  let email = ctx.query.email || ctx.request.body.email;
  let commonWords = ctx.query.commonWords || ctx.request.body.commonWords;
  let someWords = ctx.query.someWords || ctx.request.body.someWords;
  let checkWords = AES.aesDecrypt(someWords, commonWords);
  console.log("someWords", checkWords);
  return new Promise((resolve, reject) => {
    _sendMail.sendMail(
      {
        from: "Fred Foo <978145022@qq.com>",
        to: email, //客户端用户输入的邮箱账号
        subject: "您正在进行邮箱验证",
        html:
          "<h1>您的邮箱验证码为：" + checkWords + "，此验证码10分钟内有效</h1>",
      },
      (err, rows) => {
        if (err) {
          reject({ status: "failed", data: err });
        } else {
          resolve({ status: "success", data: null });
        }
      }
    );
  });
};
module.exports = _rotr;
