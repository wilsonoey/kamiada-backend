const { customAlphabet, nanoid } = require('nanoid');
const {
  clienterror,
  notfound,
  servererror,
  successwithdata,
  success,
  successcreated,
  successcreatedwithdata,
  authenticationerror,
  authorizationerror,
  successwithdataANDcount,
} = require('./response');
const bcrypt = require('bcryptjs');
const connection = require('./connection');
const TokenManager = require('./tokenmanager');
const partAuth = require('./authuser');
const variable = require('./variable');
const { senderror } = require('./senderror');

async function loginUser(request, h) {
  try {
    const { emailuser, passworduser } = request.payload;
    const query = 'SELECT * FROM userskad WHERE emailuser = ?';
    const [results] = await connection.query(query, emailuser);

    if (results.length > 0) {
      const user = results[0];
      const isValid = await bcrypt.compare(passworduser, user.passworduser);
      if (isValid) {
        const accessToken = TokenManager.generateAccessToken({
          iduser: user.iduser,
          emailuser: user.emailuser,
          passworduser: user.passworduser,
        });
        const refreshToken = TokenManager.generateRefreshToken({
          iduser: user.iduser,
          emailuser: user.emailuser,
          passworduser: user.passworduser,
        });
        await partAuth.addToken(refreshToken);
        return h.response(
          successcreatedwithdata('Login berhasil', { accessToken, refreshToken })
        ).code(201);
      } else {
        return h.response(authenticationerror('Password Salah')).code(401);
      }
    } else {
      return h.response(
        clienterror('Email tidak ditemukan. Silakan registrasi terlebih dahulu.')
      ).code(400);
    }
  } catch (error) {
    senderror(request, h, error, "loginUser");
  }
}

async function registerUser(request, h) {
  try {
    const addOtherPayload = { ...request.payload };
    const id = customAlphabet('1234567890', 15);
    const hashPassword = await bcrypt.hash(addOtherPayload.passworduser, 10);
    const createdat = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const data = {
      iduser: id(),
      ...request.payload,
      passworduser: hashPassword,
      createdatuser: createdat,
      updatedatuser: createdat,
    };
    const querychecker = 'SELECT * FROM userskad WHERE phoneuser = ? OR emailuser = ? OR username = ?';
    const [resultschecker] = await connection.query(querychecker, [
      addOtherPayload.phoneuser, addOtherPayload.emailuser, addOtherPayload.username,
    ]);
    if (resultschecker.length > 0) {
      const userchecker = resultschecker[0];
      if (userchecker.phoneuser == addOtherPayload.phoneuser) {
        return h.response(
          clienterror('Nomor ponsel sudah ada. Silakan hubungi admin untuk bantuan.')
        ).code(400);
      } else if (userchecker.emailuser == addOtherPayload.emailuser) {
        return h.response(
          clienterror('Email sudah ada. Silakan hubungi admin untuk bantuan.')
        ).code(400);
      } else if (userchecker.username == addOtherPayload.username) {
        return h.response(
          clienterror('Username sudah ada. Gunakan username yang lain.')
        ).code(400);
      }
    } else {
      if ((addOtherPayload.username && addOtherPayload.emailuser) == null) {
        return h.response(
          clienterror('Username atau email tidak boleh kosong.')
        ).code(400);
      } else {
        const query = 'INSERT INTO userskad SET ?';
        await connection.query(query, data);
        return h.response(
          successcreated(`User berhasil ditambahkan dengan iduser ${data.iduser}`)
        ).code(201);
      }
    }
  } catch (error) {
    senderror(request, h, error, "registerUser");
  }
}

async function getuserme(request, h) {
  try {
    const verificator = request.auth.credentials;
    const query = 'SELECT * FROM userskad WHERE iduser = ?';
    const [results] = await connection.query(query, verificator.iduser);
    if (results.length === 0) {
      return h.response(notfound('User tidak ditemukan')).code(404);
    } else {
      return h.response(successwithdata('User berhasil ditampilkan', results[0])).code(200);
    }
  } catch (error) {
    senderror(request, h, error, "getuserme");
  }
}

async function editInfoUser(request, h) {
  try {
    const verificator = request.auth.credentials;
    const updatedat = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const checkiduser = 'SELECT * FROM userskad WHERE iduser = ?';
    const [resultsiduser] = await connection.query(checkiduser, verificator.iduser);
    if (resultsiduser.length === 0) {
      return h.response(notfound('User tidak ditemukan')).code(404);
    } else {
      const data = {
        ...request.payload,
        updatedatuser: updatedat,
      };
      if (data.passworduser) {
        const hashedPass = await bcrypt.hash(data.passworduser, 10);
        data.passworduser = hashedPass;
      }
      const updateQuery = 'UPDATE userskad SET ? WHERE iduser = ?';
      const [results] = await connection.query(updateQuery, [data, verificator.iduser]);
      if (results.affectedRows > 0) {
        return h.response(success('User berhasil diupdate')).code(200);
      } else {
        return h.response(clienterror('User gagal diupdate')).code(400);
      }
    }
  } catch (error) {
    senderror(request, h, error, "editUser");
  }
}

async function deleteUser(request, h) {
  try {
    const verificator = request.auth.credentials;
    const query = 'DELETE FROM userskad WHERE iduser = ?';
    const [results] = await connection.query(query, verificator.iduser);
    if (results.affectedRows === 0) {
      return h.response(notfound('User tidak ditemukan')).code(404);
    } else {
      return h.response(success('User berhasil dihapus')).code(200);
    }
  } catch (error) {
    senderror(request, h, error, "deleteUser");
  }
}

async function dashboarduser(request, h) {
  try {
    const verificator = request.auth.credentials;
    const selectuser = 'SELECT userskad.username, userskad.avataruser, serviceskad.* FROM userskad';
    const query = `${selectuser} LEFT JOIN serviceskad ON userskad.iduser = serviceskad.iduser WHERE userskad.iduser = ?`;
    const [results] = await connection.query(query, verificator.iduser);
    if (results && results.length > 0) {
      const myServices = {
        iduser: results[0].iduser,
        avataruser: results[0].avataruser,
        username: results[0].username,
        services: results.map((row) => ({
          idservice: row.idservice,
          nameservice: row.nameservice,
          avatarservice: row.avatarservice,
          descriptionservice: row.descriptionservice,
          categoryservice: row.categoryservice,
          areaservice: row.areaservice,
          contactservice: row.contactservice,
          statusservice: row.statusservice,
          createdatservice: row.createdatservice,
          updatedatservice: row.updatedatservice,
        })),
      };
      return h.response(successwithdataANDcount(results.length, 'Dashboard berhasil ditampilkan', myServices)).code(200);
    } else {
      return h.response(notfound('Dashboard tidak ditemukan')).code(404);
    }
  } catch (error) {
    senderror(request, h, error, "dashboarduser");
  }
}

async function addservicebyuser(request, h) {
  try {
    const verificator = request.auth.credentials;
    const selectediduserchecker = 'SELECT * FROM userskad WHERE iduser = ?';
    const [resultschecker] = await connection.query(selectediduserchecker, verificator.iduser);
    if (resultschecker.length > 0) {
      const idservice = nanoid(50);
      const createdat = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      const data = {
        idservice: idservice,
        iduser: verificator.iduser,
        ...request.payload,
        createdatservice: createdat,
        updatedatservice: createdat,
      };
      const query = 'INSERT INTO serviceskad SET ?';
      await connection.query(query, data);
      return h.response(successcreated(`Service berhasil ditambahkan dengan idservice ${idservice}`)).code(201);
    } else {
      return h.response(authorizationerror('User tidak memiliki akses untuk menambahkan layanan jasa')).code(403);
    }
  } catch (error) {
    senderror(request, h, error, "addservicebyuser");
  }
}

async function getallservice(_, h) {
  try {
    const query = 'SELECT serviceskad.*, userskad.avataruser, userskad.username FROM userskad JOIN serviceskad USING(iduser)';
    const [results] = await connection.query(query);
    return h.response(successwithdataANDcount(results.length, 'Service berhasil ditampilkan', results)).code(200);
  } catch (error) {
    senderror(request, h, error, "getallservice");
  }
}

async function getallservicebyiduser(request, h) {
  try {
    const { iduser } = request.params;
    const querychecker = 'SELECT * FROM userskad WHERE iduser = ?';
    const selectuser = 'SELECT userskad.username, userskad.avataruser, serviceskad.* FROM userskad';
    const query = `${selectuser} LEFT JOIN serviceskad ON userskad.iduser = serviceskad.iduser WHERE userskad.iduser = ?`;
    const [resultschecker] = await connection.query(querychecker, iduser);
    if (resultschecker.length === 0) {
      return h.response(notfound('User tidak ditemukan')).code(404);
    } else {
      const [results] = await connection.query(query, iduser);
      if (results.length === 0) {
        return h.response(notfound('Layanan jasa tidak ditemukan')).code(404);
      } else {
        return h.response(successwithdataANDcount(results.length, 'Layanan jasa berhasil ditampilkan', results)).code(200);
      }
    }
  } catch (error) {
    senderror(request, h, error, "getallservicebyiduser");
  }
}

async function getservicebyiduserthenidservice(request, h) {
  try {
    const { iduser, idservice } = request.params;
    const querychecker = 'SELECT * FROM userskad WHERE iduser = ?';
    const selectuser = 'SELECT userskad.username, userskad.avataruser, serviceskad.* FROM userskad';
    const query = `${selectuser} LEFT JOIN serviceskad ON userskad.iduser = serviceskad.iduser WHERE serviceskad.idservice = ?`;
    const [resultschecker] = await connection.query(querychecker, iduser);
    if (resultschecker.length > 0) {
      const [results] = await connection.query(query, idservice);
      if (results.length > 0) {
        return h.response(successwithdata('Service berhasil ditampilkan', results[0])).code(200);
      } else {
        return h.response(notfound('Layanan jasa tidak ditemukan')).code(404);
      }
    } else {
      return h.response(notfound('User tidak ditemukan')).code(404);
    }
  } catch (error) {
    senderror(request, h, error, "getservicebyiduserthenidservice");
  }
}

async function getservicebyidservice(request, h) {
  try {
    const { idservice } = request.params;
    const selectuser = 'SELECT userskad.username, userskad.avataruser, serviceskad.* FROM userskad';
    const query = `${selectuser} LEFT JOIN serviceskad ON userskad.iduser = serviceskad.iduser WHERE serviceskad.idservice = ?`;
    const [results] = await connection.query(query, idservice);
    if (results.length === 0) {
      return h.response(notfound('Layanan jasa tidak ditemukan')).code(404);
    } else {
      return h.response(successwithdata('Service berhasil ditampilkan', results[0])).code(200);
    }
  } catch (error) {
    senderror(request, h, error, "getservicebyidservice");
  }
}

async function getservicebycategory(request, h) {
  try {
    const { categoryservice } = request.params;
    const selectuser = 'SELECT userskad.username, userskad.avataruser, serviceskad.* FROM userskad';
    const query = `${selectuser} LEFT JOIN serviceskad ON userskad.iduser = serviceskad.iduser WHERE serviceskad.categoryservice = ?`;
    const [results] = await connection.query(query, categoryservice);
    if (results.length === 0) {
      return h.response(notfound('Layanan jasa tidak ditemukan')).code(404);
    } else {
      return h.response(successwithdata('Service berhasil ditampilkan', results)).code(200);
    }
  } catch (error) {
    senderror(request, h, error, "getservicebycategory");
  }
}

async function updateservice(request, h) {
  try {
    const verificator = request.auth.credentials;
    const { idservice } = request.params;
    const updatedat = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const data = { ...request.payload, updatedatservice: updatedat };
    const querychecker = 'SELECT * FROM serviceskad WHERE idservice = ?';
    if (verificator.iduser === undefined) {
      return h.response(authorizationerror('User tidak memiliki akses untuk mengedit layanan jasa')).code(403);
    } else {
      const [resultschecker] = await connection.query(querychecker, idservice);
      if (resultschecker.length === 0) {
        return h.response(notfound('Jasa tidak ditemukan')).code(404);
      } else if (verificator.iduser != resultschecker[0].iduser) {
        return h.response(authorizationerror('User tidak memiliki akses untuk mengedit layanan jasa')).code(403);
      } else {
        const updateQuery = 'UPDATE serviceskad SET ? WHERE idservice = ?';
        const [results] = await connection.query(updateQuery, [data, idservice]);
        if (results.affectedRows > 0) {
          return h.response(success('Service berhasil diupdate')).code(200);
        } else {
          return h.response(clienterror('Service gagal diupdate')).code(400);
        }
      }
    }
  } catch (error) {
    senderror(request, h, error, "updateservice");
  }
}

async function deleteservice(request, h) {
  try {
    const verificator = request.auth.credentials;
    const { idservice } = request.params;
    const querychecker = 'SELECT * FROM serviceskad WHERE idservice = ?';
    if (verificator.iduser === undefined) {
      return h.response(
        authorizationerror('User tidak memiliki akses untuk menghapus layanan jasa')
      ).code(403);
    } else {
      const [resultschecker] = await connection.query(querychecker, idservice);
      if (resultschecker.length === 0) {
        return h.response(notfound('Jasa tidak ditemukan')).code(404);
      } else if (verificator.iduser != resultschecker[0].iduser) {
        return h.response(authorizationerror('User tidak memiliki akses untuk menghapus layanan jasa')).code(403);
      } else {
        const query = 'DELETE FROM serviceskad WHERE idservice = ?';
        const [results] = await connection.query(query, idservice);
        if (results.affectedRows > 0) {
          return h.response(success('Service berhasil dihapus')).code(200);
        } else {
          return h.response(notfound('Layanan jasa tidak ditemukan')).code(404);
        }
      }
    }
  } catch (error) {
    senderror(request, h, error, "deleteservice");
  }
}

async function geterror(request, h) {
  try {
    const query = 'SELECT * FROM errorkad ORDER BY createdaterror DESC';
    const [results] = await connection.query(query);
    return h.response(successwithdataANDcount(results.length, 'Error berhasil ditampilkan', results)).code(200);
  } catch (error) {
    senderror(request, h, error, "geterror");
  }
}

function notfound(req, res) {
  return res.response({
    status: 'fail',
    message: 'Halaman yang Anda cari tidak ditemukan',
  }).code(404);
}

const part = {
  loginkad: loginUser,
  registerkad: registerUser,
  getusermekad: getuserme,
  editinfouserkad: editInfoUser,
  deleteuserkad: deleteUser,
  dashboarduserkad: dashboarduser,
  addservicebyuserkad: addservicebyuser,
  allservicekad: getallservice,
  allservicebyiduserkad: getallservicebyiduser,
  servicebyiduserthenidservicekad: getservicebyiduserthenidservice,
  servicebyidservicekad: getservicebyidservice,
  servicebycategorykad: getservicebycategory,
  updateservicekad: updateservice,
  deleteservicekad: deleteservice,
  geterrorkad: geterror,
  besides: notfound,
};

module.exports = part;
