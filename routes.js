const part = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/user/login',
    handler: part.loginkad,
  },
  {
    method: 'POST',
    path: '/user/register',
    handler: part.registerkad,
  },
  {
    method: 'GET',
    path: '/user/profile',
    handler: part.getusermekad,
    options: {
      auth: 'kamiada_jwt',
    }
  },
  {
    method: 'PUT',
    path: '/user',
    handler: part.editinfouserkad,
    options: {
      auth: 'kamiada_jwt',
    }
  },
  {
    method: 'DELETE',
    path: '/user',
    handler: part.deleteuserkad,
    options: {
      auth: 'kamiada_jwt',
    }
  },
  {
    method: 'DELETE',
    path: '/user/logout',
    handler: part.logoutkad,
    options: {
      auth: 'kamiada_jwt',
    }
  },
  {
    method: 'GET',
    path: '/dashboard',
    handler: part.dashboarduserkad,
    options: {
      auth: 'kamiada_jwt',
    }
  },
  {
    method: 'POST',
    path: '/user/service/add',
    handler: part.addservicebyuserkad,
    options: {
      auth: 'kamiada_jwt',
    }
  },
  {
    method: 'GET',
    path: '/service',
    handler: part.allservicekad,
  },
  {
    method: 'GET',
    path: '/user/{iduser}/service',
    handler: part.allservicebyiduserkad,
  },
  {
    method: 'GET',
    path: '/user/{iduser}/service/{idservice}',
    handler: part.servicebyiduserthenidservicekad,
  },
  {
    method: 'GET',
    path: '/service/{idservice}',
    handler: part.servicebyidservicekad,
  },
  {
    method: 'GET',
    path: '/service/category/{categoryservice}',
    handler: part.servicebycategorykad,
  },
  {
    method: 'PUT',
    path: '/user/service/{idservice}',
    handler: part.updateservicekad,
    options: {
      auth: 'kamiada_jwt',
    }
  },
  {
    method: 'DELETE',
    path: '/user/service/{idservice}',
    handler: part.deleteservicekad,
    options: {
      auth: 'kamiada_jwt',
    }
  },
  {
    method: 'GET',
    path: '/error',
    handler: part.geterrorkad,
  },
];

module.exports = routes;