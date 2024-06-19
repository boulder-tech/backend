'use strict';

/**
 * transaction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::transaction.transaction',
  ({ strapi }) => ({
    async startTransaction(ctx) {
      const { amount_stable, token, address, hash, type_stable, price_bid } =
        ctx.request.body;

      const client = await this.getByPublicAddress(address);

      const status = 'pending_mint';

      await strapi.db.query('api::transaction.transaction').create({
        data: {
          client_id: client.id,
          amount_stable,
          token,
          address,
          hash,
          status,
          type_stable,
          price_bid,
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
      const { token_minted, hash_mint, hash, change } = ctx.request.body;

      try {
        await strapi.db.query('api::transaction.transaction').update({
          where: { hash: hash },
          data: {
            status: 'tokens_minted',
            token_minted: parseFloat(token_minted),
            hash_mint,
            change,
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
        await strapi.db.query('api::transaction.transaction').update({
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
          .query('api::transaction.transaction')
          .findMany({
            select: [
              'hash',
              'hash_mint',
              'amount_stable',
              'type_stable',
              'token',
              'token_minted',
              'status',
              'price_bid',
              'price_minted',
            ],
            where: { client_id: client.id },
            orderBy: { createdAt: 'DESC' },
            limit: 100,
          });

        let redeemTransactions = await strapi.db
          .query('api::transaction-sell.transaction-sell')
          .findMany({
            select: [
              'hash',
              'hash_redeem',
              'token_amount',
              'token',
              'status',
              'price_ask',
              'price_sold',
            ],
            where: { client_id: client.id },
            orderBy: { createdAt: 'DESC' },
            limit: 100,
          });

        redeemTransactions = redeemTransactions.map((transaction) => ({
          hash: transaction.hash,
          hash_mint: transaction.hash_redeem,
          amount_stable: transaction.token_amount,
          type_stable: transaction.token,
          token: transaction.token,
          price_bid: transaction.price_ask,
          status: transaction.status,
          createdAt: transaction.createdAt,
        }));

        const combinedTransactions = [...transactions, ...redeemTransactions];

        combinedTransactions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return ctx.send({
          success: true,
          transactions: combinedTransactions,
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
          .query('api::transaction.transaction')
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
          .query('api::transaction.transaction')
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
          .query('api::transaction.transaction')
          .findMany({
            start: 0,
            limit: 10,
            orderBy: { createdAt: 'DESC' },
          });

        const redeemTransactions = await strapi.db
          .query('api::transaction-sell.transaction-sell')
          .findMany({
            start: 0,
            limit: 10,
            orderBy: { createdAt: 'DESC' },
          });

        const combinedTransactions = [...transactions, ...redeemTransactions];

        combinedTransactions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Limita el resultado a los primeros 10 elementos
        const limitedTransactions = combinedTransactions.slice(0, 10);

        return ctx.send({
          success: true,
          transactions: combinedTransactions,
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
          .query('api::transaction.transaction')
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
