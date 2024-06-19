'use strict';

/**
 * transaction-sell controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::transaction-sell.transaction-sell',
  ({ strapi }) => ({
    async startTransaction(ctx) {
      const { token_amount, token, address, hash, price_ask } =
        ctx.request.body;

      const client = await this.getByPublicAddress(address);

      const status = 'pending_redeem';

      await strapi.db.query('api::transaction-sell.transaction-sell').create({
        data: {
          client_id: client.id,
          token_amount,
          token,
          address,
          hash,
          status,
          price_ask,
        },
      });

      return ctx.send({
        success: true,
      });
    },
    async getByPublicAddress(address) {
      const existingAddress = await strapi.db
        .query('api::public-address.public-address')
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
      const { amount_redeemed, hash_redeem, hash } = ctx.request.body;

      try {
        await strapi.db.query('api::transaction-sell.transaction-sell').update({
          where: { hash: hash },
          data: {
            status: 'token_redeemed',
            amount_redeemed: parseFloat(amount_redeemed),
            hash_redeem,
          },
        });

        return ctx.send({
          success: true,
        });
      } catch (e) {
        console.log('ERROR AT END TRANSFER', e);

        return ctx.send(
          {
            success: false,
          },
          500
        );
      }
    },
    async updateTransaction(ctx) {
      const { hash, ...data } = ctx.request.body;

      try {
        await strapi.db.query('api::transaction-sell.transaction-sell').update({
          where: { hash },
          data,
        });

        return ctx.send({
          success: true,
        });
      } catch (e) {
        console.log('ERROR AT UPDATE TRANSFER', e);

        return ctx.send(
          {
            success: false,
          },
          500
        );
      }
    },
    async allTransactionsByAddress(ctx) {
      try {
        const { address } = ctx.params;

        const client = await this.getByPublicAddress(address);

        if (!client) {
          return ctx.send({
            success: false,
            message: 'Client not found on db',
          });
        }

        const transactions = await strapi.db
          .query('api::transaction-sell.transaction-sell')
          .findMany({
            select: [
              'hash',
              'hash_redeem',
              'token_amount',
              'token',
              'amount_redeemed',
              'status',
              'price_ask',
              'price_sold',
            ],
            where: { client_id: client.id },
            orderBy: { createdAt: 'DESC' },
            limit: 100,
          });

        return ctx.send({
          success: true,
          transactions,
        });
      } catch (error) {
        console.error(error);
        return ctx.send({
          success: false,
          message: 'Error occurred when getting all transactions.',
        });
      }
    },
    async transactions(ctx) {
      try {
        const { token } = ctx.params;

        const transactions = await strapi.db
          .query('api::transaction-sell.transaction-sell')
          .findMany({
            where: { token },
          });

        return ctx.send({
          success: true,
          transactions,
        });
      } catch (error) {
        console.error(error);
        return ctx.send({
          success: false,
          message: 'Error occurred when getting all transactions.',
        });
      }
    },
    async findByHash(ctx) {
      try {
        const { hash } = ctx.params;

        const transaction = await strapi.db
          .query('api::transaction-sell.transaction-sell')
          .findOne({
            where: { hash },
          });

        return ctx.send({
          success: true,
          transaction,
        });
      } catch (error) {
        console.error(error);
        return ctx.send({
          success: false,
          message: 'Error occurred when getting all transactions.',
        });
      }
    },
    async fetchAllTransactions(ctx) {
      try {
        const transactions = await strapi.db
          .query('api::transaction-sell.transaction-sell')
          .findMany({
            start: 0,
            limit: 10,
            orderBy: { createdAt: 'DESC' },
          });

        return ctx.send({
          success: true,
          transactions,
        });
      } catch (error) {
        console.error(error);
        return ctx.send({
          success: false,
          message: 'Error occurred when getting all transactions.',
        });
      }
    },
    async completeTransaction(ctx) {
      try {
        const transactions = await strapi.db
          .query('api::transaction-sell.transaction-sell')
          .findMany({
            start: 0,
            limit: 10,
            orderBy: { createdAt: 'DESC' },
          });

        return ctx.send({
          success: true,
          transactions,
        });
      } catch (error) {
        console.error(error);
        return ctx.send({
          success: false,
          message: 'Error occurred when getting all transactions.',
        });
      }
    },
  })
);
