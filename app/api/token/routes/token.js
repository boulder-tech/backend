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
    ],
};
