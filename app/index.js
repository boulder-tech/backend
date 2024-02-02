module.exports = {
  register(/*{ strapi }*/) {},

  bootstrap({ strapi }) {
    const io = require("socket.io")(strapi.server.httpServer, {
      cors: {
        origin: "*", //["http://54.241.170.100", "https://app.bouldertech.fi"], //'http://localhost:3000',
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });

    io.on("connection", function (socket) {
      const address = socket.handshake.address;
      const userId = socket.id;
      const clientAddress = socket.handshake.headers["x-real-ip"] || address;

      console.log(
        `Acá está el user id -------> ${userId} New connection from ${clientAddress}`
      );

      socket.on(`subscribe`, (msg) => {
        console.log(
          `Client ${msg.address} has subscribed to its own channel - Socket ID ${socket.id}`
        );

        socket.join(msg.address);
      });

      socket.on("start-kyc", async ({ address }) => {
        try {
          console.log(
            `Client ${address} has started a KYC process - Socket ID ${socket.id}`
          );
          await strapi.controllers["api::client.client"].updateClient({
            address,
            status: "pending_onboarding",
          });

          console.log("strapi.io.sockets", strapi.io.sockets.in(address).rooms);

          strapi.io.sockets.in(address).emit("kyc-started", {
            address,
            status: "pending_onboarding",
          });
        } catch (e) {
          console.log("here", e);
        }
      });

      socket.on("disconnect", () => {
        console.log("DISCONNECTED FROM SOCKET", userId);
      });
    });

    strapi.io = io;
  },
};
