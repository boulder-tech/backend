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
    ],
};
