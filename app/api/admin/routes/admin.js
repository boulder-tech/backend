module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/admin/signup',
      handler: 'api::admin.admin.signup',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/login',
      handler: 'api::admin.admin.login',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/verify-token/:token',
      handler: 'api::admin.admin.verifyToken',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
