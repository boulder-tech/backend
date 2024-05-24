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
      path: '/token/mint',
      handler: 'api::token.token.mint',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
