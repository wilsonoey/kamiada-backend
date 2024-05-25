function notfound (message) {
  var response = {
    statusCode: 404,
    status: 'fail',
    message: message
  };
  return response;
}

function clienterror (message) {
  var response = {
    statusCode: 400,
    status: 'fail',
    message: message
  };
  return response;
}

function servererror (message) {
  var response = {
    statusCode: 500,
    status: 'error',
    message: message
  };
  return response;
}

function successwithdata (message, data) {
  var response = {
    statusCode: 200,
    status: 'success',
    message: message,
    data: data
  };
  return response;
}

function success (message) {
  var response = {
    statusCode: 200,
    status: 'success',
    message: message
  };
  return response;
}

function successcreated (message) {
  var response = {
    statusCode: 201,
    status: 'success',
    message: message
  };
  return response;
}

function successcreatedwithdata (message, data) {
  var response = {
    statusCode: 201,
    status: 'success',
    message: message,
    data: data
  };
  return response;
}

function authenticationerror (message) {
  var response = {
    statusCode: 401,
    status: 'fail',
    message: message
  };
  return response;
}

function authorizationerror (message) {
  var response = {
    statusCode: 403,
    status: 'fail',
    message: message
  };
  return response;
}

function successwithdataANDcount (count, message, data) {
  var response = {
    statusCode: 200,
    status: 'success',
    count: count,
    message: message,
    data: data
  };
  return response;
}

module.exports = {
  clienterror,
  notfound,
  servererror,
  successwithdata,
  success,
  successcreated,
  successcreatedwithdata,
  authenticationerror,
  authorizationerror,
  successwithdataANDcount
};