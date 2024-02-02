'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

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

            const existingToken = await strapi.db
                .query('api::token.token')
                .findOne({
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
    })
);
