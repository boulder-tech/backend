"use strict";

/**
 * transaction controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::transaction.transaction",
  ({ strapi }) => ({
    async startTransaction(ctx) {
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
    async endTransaction(ctx) {
      const { token_minted, hash_mint, hash, change } = ctx.request.body;

      await strapi.db.query("api::transaction.transaction").update({
        where: { hash: hash },
        data: { status: "tokens_minted", token_minted, hash_mint, change },
      });

      return ctx.send({
        success: true,
      });
    },
    async allTransactions(ctx) {
      try {
        const { address } = ctx.params;

        const client = await this.getByPublicAddress(address);

        if (!client) {
          return ctx.send({
            success: false,
            message: "Client not found on db",
          });
        }

        const transactions = await strapi.db
          .query("api::transaction.transaction")
          .findMany({
            client: client.id,
          });

        return ctx.send({
          success: true,
          transactions,
        });
      } catch (error) {
        console.error(error);
        return ctx.send({
          success: false,
          message: "Error occurred when getting all transactions.",
        });
      }
    },
  })
);
