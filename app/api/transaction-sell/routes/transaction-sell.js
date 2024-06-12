module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transaction-sell",
      handler: "api::transaction-sell.transaction-sell.startTransaction",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/transaction-sell",
      handler: "api::transaction-sell.transaction-sell.endTransaction",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/transaction-sell/address/:address",
      handler:
        "api::transaction-sell.transaction-sell.allTransactionsByAddress",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/transaction-sell/:token/all",
      handler: "api::transaction-sell.transaction-sell.transactions",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/transaction-sell/:hash",
      handler: "api::transaction-sell.transaction-sell.findByHash",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/transactions",
      handler: "api::transaction-sell.transaction-sell.fetchAllTransactions",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
