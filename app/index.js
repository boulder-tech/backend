module.exports = {
    register(/*{ strapi }*/) {},

    bootstrap({ strapi }) {
        const io = require('socket.io')(strapi.server.httpServer, {
            cors: {
                origin: '*', //'http://localhost:3000',
                methods: ['GET', 'POST'],
                allowedHeaders: ['my-custom-header'],
                credentials: true,
            },
        });

        io.on('connection', function (socket) {
            socket.on(`subscribe`, (msg) => {
                console.log(
                    `Client ${msg.address} has subscribed to its own channel`
                );

                socket.join(msg.address);
            });
        });

        strapi.io = io;
    },
};
