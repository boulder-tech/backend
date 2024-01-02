module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/transaction',
            handler: 'api::transaction.transaction.create',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};
