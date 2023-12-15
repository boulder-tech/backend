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
      method: "POST",
      path: "/asset",
      handler: "api::asset.asset.create",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/asset/:id",
      handler: "api::asset.asset.findOne",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/asset/name/:name",
      handler: "api::asset.asset.findByName",
      config: {
        auth: false,
        policies: [],
      },
    },
    /*
        {
            method: 'PUT',
            path: '/client/verify-token/:token',
            handler: 'api::client.client.verifyToken',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'POST',
            path: '/client/login',
            handler: 'api::client.client.login',
            config: {
                auth: false,
                policies: [],
            },
        },
        */
  ],
};
