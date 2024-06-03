const connection = require('./connection');

async function addRefreshToken(token) {
    const query = 'INSERT INTO authuserskad SET tokenuser = ?';
    await connection.query(query, token);
}

async function verifyRefreshToken(token) {
    const query = 'SELECT token FROM authuserskad WHERE tokenuser = ?';
    await connection.query(query, token);
}

async function deleteRefreshToken(token) {
    const query = 'DELETE FROM authuserskad WHERE tokenuser = ?';
    await connection.query(query, token);
}

const partAuth = {
    addToken: (token) => addRefreshToken(token),
    verifyToken: (token) => verifyRefreshToken(token),
    deleteToken: (token) => deleteRefreshToken(token),
};

module.exports = partAuth;
