'use strict';

/**
 * asset controller
 */

const moment = require('moment');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::asset.asset', ({ strapi }) => ({
    async findByName(ctx) {
        const { name } = ctx.params;

        const { price } = await strapi.db.query('api::asset.asset').findOne({
            select: ['price'],
            where: { name },
            orderBy: { createdAt: 'desc' },
        });

        // Obtener la fecha actual y la fecha de hace 24 horas
        const currentDate = moment();
        const pastDate = moment().subtract(24, 'hours');

        const { price: price_24h } = await strapi.db
            .query('api::asset.asset')
            .findOne({
                select: ['price'],
                where: {
                    name,
                    createdAt: {
                        // $gte: pastDate.toISOString(), // Filtrar por fechas mayores o iguales a hace 24 horas
                        // $lte: currentDate.toISOString(), // Filtrar por fechas menores o iguales a la fecha actual
                        $lte: pastDate.toISOString(), // Filtrar por fechas menores o iguales a la fecha de hace 24 h
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

        return ctx.send({
            price,
            price_24h,
            last_24h: price_24h !== undefined ? price - price_24h : null,
        });
    },

    async savePriceDiffRes(ctx) {
        try {
            const { name, price } = ctx.request.body;

            const currentDate = moment().startOf('minute');
            console.log(`current date: ${currentDate}`);

            const resolutions = [];

            // 5 minutes
            if (currentDate.minute() % 5 === 0) {
                resolutions.push('5m');
            }

            // 15 minutes
            if (currentDate.minute() % 15 === 0) {
                resolutions.push('15m');
            }

            // half hour
            if (currentDate.minute() % 30 === 0) {
                resolutions.push('30m');
            }

            // hourly
            if (currentDate.minute() === 0) {
                resolutions.push('1h');
            }

            // 4 hours
            if (currentDate.hour() % 4 === 0 && currentDate.minute() === 0) {
                resolutions.push('4h');
            }

            // 8 hours
            if (currentDate.hour() % 8 === 0 && currentDate.minute() === 0) {
                resolutions.push('8h');
            }

            // daily
            if (currentDate.hour() === 0 && currentDate.minute() === 0) {
                resolutions.push('1d');
            }

            if (
                currentDate.day() == 5 &&
                currentDate.hour() === 21 &&
                currentDate.minute() === 0
            ) {
                resolutions.push('1w');
            }

            console.log(`RESOLUTIONS: ${resolutions}`);
            for (const resolution of resolutions) {
                await strapi.db.query('api::asset.asset').create({
                    data: {
                        name,
                        price,
                        resolution,
                    },
                });
            }

            return ctx.send({
                success: true,
            });
        } catch (error) {
            console.error(error);
            return ctx.send({ error: 'An error occurred' }, 500);
        }
    },
    async fetchHistoricalData(ctx) {
        const { name, resolution } = ctx.params;

        const history = await strapi.db.query('api::asset.asset').findMany({
            where: { name, resolution },
            sort: { createdAt: 'DESC' },
            limit: 20,
        });

        return ctx.send({
            history,
            success: true,
        });
    },
}));
