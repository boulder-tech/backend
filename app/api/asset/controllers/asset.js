'use strict';

/**
 * asset controller
 */

const moment = require('moment');
const { fetchHistoricalPrice } = require('../../../utils');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::asset.asset', ({ strapi }) => ({
  async findByName(ctx) {
    const { name } = ctx.params;

    const [currentAsset, asset24hAgo] = await Promise.all([
      strapi.db.query('api::asset.asset').findOne({
        select: ['price'],
        where: { name },
        orderBy: { createdAt: 'desc' },
      }),
      strapi.db.query('api::asset.asset').findOne({
        select: ['price'],
        where: {
          name,
          createdAt: {
            $lte: moment().subtract(24, 'hours').toISOString(), // Filtrar por fechas menores o iguales a la fecha de hace 24 h
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    let firstPrice = 0;

    if (!asset24hAgo) {
      const firstAsset = await strapi.db.query('api::asset.asset').findOne({
        select: ['price'],
        where: { name },
        orderBy: { createdAt: 'asc' },
      });

      firstPrice = firstAsset ? firstAsset.price : 0;
    }

    const price = currentAsset ? currentAsset.price : 0;
    const price_24h = asset24hAgo ? asset24hAgo.price : firstPrice;

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
      if (currentDate.hour() === 21 && currentDate.minute() === 0) {
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

    let history = [];

    if (resolution === '1d' || resolution === '1M') {
      let prices = [];

      for (let i = 1; i <= 50; i++) {
        prices.push(fetchHistoricalPrice({ name, range: i, resolution }));
      }

      const historyPrices = await Promise.all(prices);
      const seenIds = new Set();

      historyPrices.forEach((item) => {
        if (
          history.length < 30 &&
          item &&
          !!item.price &&
          !seenIds.has(item.id)
        ) {
          history.push(item);
          seenIds.add(item.id);
        }
      });

      //history = historyPrices.filter((data) => !!data.price);
    } else
      history = await strapi.db.query('api::asset.asset').findMany({
        where: { name, resolution },
        orderBy: { createdAt: 'DESC' },
        limit: 100,
      });

    return ctx.send({
      history,
      success: true,
    });
  },
}));
