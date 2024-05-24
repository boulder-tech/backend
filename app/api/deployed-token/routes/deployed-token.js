module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/deployed-token',
      handler: 'api::deployed-token.deployed-token.create',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/deployed-token/all',
      handler: 'api::deployed-token.deployed-token.findAll',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/deployed-token/:symbol',
      handler: 'api::deployed-token.deployed-token.findBySymbol',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/identity-registry/:address/token',
      handler: 'api::deployed-token.deployed-token.findByIdentityRegistryAddress',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
