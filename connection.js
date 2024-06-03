const mysql2 = require('mysql2/promise');
const variable = require('./variable');

const connection = mysql2.createPool({
  host: variable.HOSTDB,
  user: variable.USERDB,
  password: variable.PASSDB,
  database: variable.NAMEDB,
});
connection.on('enqueue', (sequence) => (sequence.constructor.name === 'Query' ? console.log(sequence.sql) : null));

module.exports = connection;
