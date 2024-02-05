module.exports = {
  routes: [
    {
      method: "POST",
      path: "/factory",
      handler: "api::factory.factory.create",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
