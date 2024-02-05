'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::token.token', ({ strapi }) => ({
    async findAll(ctx) {
        const tokens = await strapi.db.query('api::token.token').findMany({
            select: [],
        });

        return ctx.send({
            tokens,
            success: true,
        });
    },
}));
