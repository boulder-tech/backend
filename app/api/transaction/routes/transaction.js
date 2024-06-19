module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/transaction',
      handler: 'api::transaction.transaction.startTransaction',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/transaction',
      handler: 'api::transaction.transaction.updateTransaction',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/transaction/address/:address',
      handler: 'api::transaction.transaction.allTransactionsByAddress',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/transaction/:token/all',
      handler: 'api::transaction.transaction.transactions',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/transaction/:hash',
      handler: 'api::transaction.transaction.findByHash',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/transactions',
      handler: 'api::transaction.transaction.fetchAllTransactions',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
