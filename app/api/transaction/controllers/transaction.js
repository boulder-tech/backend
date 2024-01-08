"use strict";

/**
 * transaction controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::transaction.transaction",
  ({ strapi }) => ({
    async fullTransaction(ctx) {
      const { amount_stable, token, address, hash, type_stable } =
        ctx.request.body;

      const client = await this.getByPublicAddress(address);

      const status = "pending_mint";

      await strapi.db.query("api::transaction.transaction").create({
        data: {
          client_id: client.id,
          amount_stable,
          token,
          address,
          hash,
          status,
          type_stable,
        },
      });

      return ctx.send({
        success: true,
      });
    },
    async getByPublicAddress(address) {
      const existingAddress = await strapi.db
        .query("api::public-address.public-address")
        .findOne({
          where: { address },
          populate: { client: true },
        });

      if (existingAddress) {
        const { client } = existingAddress;
        return client;
      } else {
        return null;
      }
    },
  })
);
