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
        {
            method: 'POST',
            path: '/client/signup',
            handler: 'api::client.client.signup',
            config: {
                auth: false,
                policies: [],
            },
        },
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
        {
            method: 'POST',
            path: '/client/connect-wallet',
            handler: 'api::client.client.connectWallet',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'PUT',
            path: '/client/kyc',
            handler: 'api::client.client.KYC',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'GET',
            path: '/client/public-address/:address',
            handler: 'api::client.client.getByPublicAddress',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};
