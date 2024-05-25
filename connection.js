const { createConnection } = require('mysql');
const variable = require('./variable');

const connection = createConnection({
  host: variable.HOSTDB,
  user: variable.USERDB,
  password: variable.PASSDB,
  database: variable.NAMEDB,
});
connection.connect((checker) => console.log(checker));
// tampilkan di terminal setiap tindakan database menggunakan method yang ada
connection.on('enqueue', (sequence) => (sequence.constructor.name === 'Query' ? console.log(sequence.sql) : null));

module.exports = connection;
