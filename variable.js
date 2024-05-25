const variable = {
  HOSTDB: process.env.HOSTDB,
  USERDB: process.env.USERDB,
  PASSDB: process.env.PASSDB,
  NAMEDB: process.env.NAMEDB,
  ACCESSJWT: process.env.ACCESSJWT,
  REFRESHJWT: process.env.REFRESHJWT,
  ACCESS_TOKEN_AGE: process.env.ACCESS_TOKEN_AGE,
  NODE_ENV: process.env.NODE_ENV,
}

module.exports = variable;