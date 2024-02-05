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
    ],
};
