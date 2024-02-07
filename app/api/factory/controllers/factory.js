'use strict';

/**
 * factory controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::factory.factory', ({ strapi }) => ({
    async fetchAll(ctx) {
        const factories = await strapi.db
            .query('api::factory.factory')
            .findMany({
                where: {},
                sort: { createdAt: 'DESC' },
                limit: 100,
            });

        return ctx.send({
            factories,
            success: true,
        });
    },
    async findByName(ctx) {
        const { name } = ctx.params;

        const factory = await strapi.db.query('api::factory.factory').findOne({
            where: { factory_name: name },
        });

        return ctx.send({
            factory,
            success: true,
        });
    },
}));
