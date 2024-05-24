'use strict';

/**
 * deployed-token controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::deployed-token.deployed-token',
  ({ strapi }) => ({
    async findAll(ctx) {
      const tokens = await strapi.db
        .query('api::deployed-token.deployed-token')
        .findMany({
          select: [],
        });

      return ctx.send({
        tokens,
        success: true,
      });
    },
    async findBySymbol(ctx) {
      const { symbol } = ctx.params;

      const token = await strapi.db
        .query('api::deployed-token.deployed-token')
        .findOne({
          where: { token_symbol: symbol },
        });

      return ctx.send({
        token,
        success: true,
      });
    },
    async findByIdentityRegistryAddress(ctx) {
      const { address } = ctx.params;

      const token = await strapi.db
        .query('api::deployed-token.deployed-token')
        .findOne({
          where: { identity_registry: address },
        });

      return ctx.send({
        token,
        success: true,
      });
    },
  })
);
