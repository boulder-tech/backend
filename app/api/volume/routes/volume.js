module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/volume/saveVolDiffRes',
            handler: 'api::volume.volume.saveVolDiffRes',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};