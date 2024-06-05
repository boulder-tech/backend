'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const Manager = require('../../../services/Manager');

module.exports = createCoreController(
  'api::contract.contract',
  ({ strapi }) => ({
    async saveContract(ctx) {
      const { name, address, token_address } = ctx.request.body;

      let existingContract = await strapi.db
        .query('api::contract.contract')
        .findOne({
          select: [],
          where: { address },
        });

      if (!existingContract) {
        existingContract = await strapi.db
          .query('api::contract.contract')
          .create({
            data: { name, address },
          });
      }

      const existingToken = await strapi.db.query('api::token.token').findOne({
        select: [],
        where: {
          address: token_address,
        },
        //populate: { contracts: true },
      });

      //console.log('existingToken', existingToken);

      if (existingToken) {
        await strapi.db.query('api::token.token').update({
          where: { address: token_address },
          data: {
            contracts: { connect: [existingContract.id] },
          },
        });
      }

      return ctx.send({
        success: true,
      });
    },
    async addAgent(ctx) {
      const { address: contract_address } = ctx.params;
      const { contract_type, agent_address } = ctx.request.body;

      const manager = new Manager({ apiKey: ctx.request.headers['x-api-key'] });

      const { success, data, message } = await manager.addAgent({
        contract_type,
        contract_address,
        agent_address,
      });

      console.log('success', success);
      console.log('data', data);
      console.log('message', message);

      if (success)
        return ctx.send({
          success: true,
        });
      else
        return ctx.send(
          {
            success: false,
            message,
          },
          500
        );
    },
    async removeAgent(ctx) {
      const { address: contract_address } = ctx.params;
      const { contract_type, agent_address } = ctx.request.body;

      const manager = new Manager({ apiKey: ctx.request.headers['x-api-key'] });

      const { success, data, message } = await manager.removeAgent({
        contract_type,
        contract_address,
        agent_address,
      });

      console.log('success', success);
      console.log('data', data);
      console.log('message', message);

      if (success)
        return ctx.send({
          success: true,
        });
      else
        return ctx.send(
          {
            success: false,
            message,
          },
          500
        );
    },
  })
);
