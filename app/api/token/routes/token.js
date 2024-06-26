module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/token',
      handler: 'api::token.token.create',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/token/all',
      handler: 'api::token.token.findAll',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/token/deploy',
      handler: 'api::token.token.deploy',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/token/deploy-factory',
      handler: 'api::token.token.deployFactory',
      config: {
        auth: false,
        policies: [],
        middlewares: ['api::admin.auth'],
      },
    },
    {
      method: 'POST',
      path: '/token/mint',
      handler: 'api::token.token.mint',
      config: {
        auth: false,
        policies: [],
        middlewares: ['api::admin.auth'],
      },
    },
    {
      method: 'POST',
      path: '/token/change',
      handler: 'api::token.token.change',
      config: {
        auth: false,
        policies: [],
        middlewares: ['api::admin.auth'],
      },
    },
    {
      method: 'POST',
      path: '/token/burn',
      handler: 'api::token.token.burn',
      config: {
        auth: false,
        policies: [],
        middlewares: ['api::admin.auth'],
      },
    },
  ],
};
