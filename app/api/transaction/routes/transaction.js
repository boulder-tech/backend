module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transaction",
      handler: "api::transaction.transaction.startTransaction", //create',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/transaction",
      handler: "api::transaction.transaction.endTransaction", //create',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
