const { verifyJWT } = require('../../../utils/auth');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { authorization } = ctx.request.headers;

    if (authorization) {
      const token = authorization.split(' ')[1];
      const isAuthorized = verifyJWT(token);

      if (!isAuthorized) {
        return ctx.unauthorized('Unauthorized');
      }
    } else {
      return ctx.unauthorized('Unauthorized');
    }

    await next();
  };
};
