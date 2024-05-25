const connection = require('./connection');

async function addRefreshToken(token) {
    const query = `INSERT INTO authuserskad SET tokenuser = '${token}'`;
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => error ? reject(error) : resolve(results));
    });
}

async function verifyRefreshToken(token) {
    const query = `SELECT token FROM authuserskad WHERE tokenuser = '${token}'`;
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => error ? reject(error) : resolve(results));
    });
}

async function deleteRefreshToken(token) {
    const query = `DELETE FROM authuserskad WHERE tokenuser = '${token}'`;
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => error ? reject(error) : resolve(results));
    });
}

const partAuth = {
    addToken: (token) => addRefreshToken(token),
    verifyToken: (token) => verifyRefreshToken(token),
    deleteToken: (token) => deleteRefreshToken(token),
};

module.exports = partAuth;
