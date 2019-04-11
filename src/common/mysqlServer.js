/**
 * Created by SWSD on 2018-11-02.
 */
const mySql = require('mysql');
    var conn = mySql.createConnection({
        host:'127.0.0.1',
        port:'3306',
        database:'myProject',
        user:'root',
        password:'Nchu3245'
    });
    //连接错误，2秒重试
    conn.connect(function (err,connection) {
        if (err) {
            console.log('error when connecting to db:', err);
            // setTimeout(handleMysql, 5000);
        }
    });
    conn.on('error', function (err) {
        console.log("db error :" + err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            // handleMysql();
        }
    });
    setInterval(function () {
        conn.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
            console.log('The solution is: 2');
        });
    }, 3600000);
    console.log('mysql is ready!');
module.exports=conn;