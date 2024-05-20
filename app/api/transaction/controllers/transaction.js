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
          price_bid
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
              'price_mint',
            ],
            where: { client_id: client.id },
            orderBy: { createdAt: 'DESC' },
            limit: 100,
          });

        console.log('transactions', transactions);

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

        console.log('TRANSACTIONS', transactions);

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
          .query('api::transaction.transaction')
          .findMany({
            start: 0,
            limit: 10,
            orderBy: { createdAt: 'DESC' },
          });

        console.log('TRANSACTIONS', transactions);

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
