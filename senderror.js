const { nanoid } = require("nanoid");
const connection = require("./connection");
const { servererror } = require("./response");

async function senderror (req, res, errorparams, name) {
  const { stack } = errorparams;
  const id = nanoid(25);
  const createdat = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const data = {
    iderror: id,
    detailerror: `Error at ${name} because ${stack}`,
    createdaterror: createdat,
  };
  const query = 'INSERT INTO errorkad SET ?';
  await connection.query(query, data);
  return res.response(servererror(stack));
}

module.exports = { senderror };
