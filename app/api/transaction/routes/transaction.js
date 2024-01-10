module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transaction",
      handler: "api::transaction.transaction.startTransaction",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/transaction",
      handler: "api::transaction.transaction.endTransaction",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
