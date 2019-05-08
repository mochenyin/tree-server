var $nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var  email={
    service: 'QQ', //用QQ账号作为发送方账号
    user: '123456@qq.com',
    pass: '************',//qq邮箱使用授权码
};

var _sendMail= $nodemailer.createTransport(smtpTransport({
    service:'QQ',
    auth:{
        user:email.user,
        pass:email.pass
    }
}));

module.exports = _sendMail;//导出模块
