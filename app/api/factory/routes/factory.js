module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/factory',
            handler: 'api::factory.factory.create',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'GET',
            path: '/factory/all',
            handler: 'api::factory.factory.fetchAll',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
          method: 'GET',
          path: '/factory/:name',
          handler: 'api::factory.factory.findByName',
          config: {
              auth: false,
              policies: [],
          },
      },
    ],
};
