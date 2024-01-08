module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transaction",
      handler: "api::transaction.transaction.fullTransaction", //create',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
