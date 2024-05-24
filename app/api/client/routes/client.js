module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/client/signup',
      handler: 'api::client.client.signup',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/client/verify-token/:token',
      handler: 'api::client.client.verifyToken',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/client/login',
      handler: 'api::client.client.login',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/client/connect-wallet',
      handler: 'api::client.client.connectWallet',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/client/kyc',
      handler: 'api::client.client.KYC',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/client/updateData',
      handler: 'api::client.client.updateData',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/client/public-address/:address',
      handler: 'api::client.client.getByPublicAddress',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/client/kyc/one-time-link',
      handler: 'api::client.client.generateOneTimeLinkForKyc',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/client/kyc/withPersonaStatus',
      handler: 'api::client.client.withPersonaStatus',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/client/status/:status',
      handler: 'api::client.client.getAllKycApproved',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/client/batch-register-identity',
      handler: 'api::client.client.batchRegisterIdentity',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
