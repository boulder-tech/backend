module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/tir/saveTirDiffRes',
            handler: 'api::tir.tir.saveTirDiffRes',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};
