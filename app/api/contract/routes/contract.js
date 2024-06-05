module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/contract',
      handler: 'api::contract.contract.saveContract',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/contract/:address/add-agent',
      handler: 'api::contract.contract.addAgent',
      config: {
        auth: false,
        policies: [],
        middlewares: ['api::admin.auth'],
      },
    },
    {
      method: 'POST',
      path: '/contract/:address/remove-agent',
      handler: 'api::contract.contract.addAgent',
      config: {
        auth: false,
        policies: [],
        middlewares: ['api::admin.auth'],
      },
    },
  ],
};
