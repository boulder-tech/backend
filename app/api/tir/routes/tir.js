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
        {
            method: 'GET',
            path: '/tir/name/:name',
            handler: 'api::tir.tir.findByName',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};
