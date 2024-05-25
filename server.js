const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const Jwt = require('@hapi/jwt');
const variable = require('./variable');
const { success } = require('./response');
const connection = require('./connection');
const { nanoid } = require('nanoid');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    const id = nanoid(25);
    const createdat = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    if (response.isBoom) {
      const data = {
        iderror: id,
        detailerror: response.message || response.output.payload,
        createdaterror: createdat,
      };
      const query = 'INSERT INTO errorkad SET ?';
      connection.query(query, data, (error) => {
        if (error) {
          console.error(error);
        }
        h.response(success('Error berhasil ditambahkan')).code(201);
      });
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('kamiada_jwt', 'jwt', {
    keys: variable.ACCESSJWT,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: variable.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        iduser: artifacts.decoded.payload.iduser,
        emailuser: artifacts.decoded.payload.emailuser,
        passworduser: artifacts.decoded.payload.passworduser,        
      },
    }),
  });
  server.route(routes);
  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};
     
init();