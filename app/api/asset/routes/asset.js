module.exports = {
  routes: [
    /*
        {
            method: 'POST',
            path: '/client/signup',
            handler: 'api::client.client.create',
            config: {
                auth: false,
                policies: [],
            },
        },
        */
    /*
        {
            method: 'GET',
            path: '/asset/',
            handler: 'api::client.client.sendEmail',
            config: {
                auth: false,
                policies: [],
            },
        },
        */
    {
      method: 'POST',
      path: '/asset',
      handler: 'api::asset.asset.create',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/asset/:id',
      handler: 'api::asset.asset.findOne',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/asset/name/:name',
      handler: 'api::asset.asset.findByName',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/asset/:name/price',
      handler: 'api::asset.asset.findByName',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/asset/savePriceDiffRes',
      handler: 'api::asset.asset.savePriceDiffRes',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/asset/:name/resolution/:resolution',
      handler: 'api::asset.asset.fetchHistoricalData',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
