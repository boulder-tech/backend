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

      console.log(`hash to be modified: ${hash}`);
      console.log(`token_minted to be modified: ${token_minted}`);
      console.log(`hash_mint to be modified: ${hash_mint}`);
      console.log(`change to be modified: ${change}`);

      // const end_status = "tokens_minted";

      console.log("por entrar al update");

      await strapi.db.query("api::transaction.transaction").update({
        where: { hash: hash },
        data: { status: "tokens_minted", token_minted, hash_mint, change },
      });

      // await strapi.service("api::transaction.transaction").update(
      //   {
      //     id: transaction_id,
      //   },
      //   {
      //     token_minted,
      //     hash_mint,
      //     status: end_status,
      //     change,
      //   }
      // );

      return ctx.send({
        success: true,
      });
    },
  })
);
