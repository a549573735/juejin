const mysql =require('mysql');
const util =require('util');

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'reptile',
    charset:'utf8mb4'
})

connection.connect();

module.exports={
    query:util.promisify(connection.query).bind(connection)
}
