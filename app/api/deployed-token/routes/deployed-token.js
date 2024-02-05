module.exports = {
  routes: [
    {
      method: "POST",
      path: "/deployed-token",
      handler: "api::deployed-token.deployed-token.create",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
