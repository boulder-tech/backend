"use strict";

/**
 * asset controller
 */

const moment = require("moment");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::asset.asset", ({ strapi }) => ({
  async findByName(ctx) {
    const { name } = ctx.params;

    const { price } = await strapi.db.query("api::asset.asset").findOne({
      select: ["price"],
      where: { name },
      orderBy: { createdAt: "desc" },
    });

    // Obtener la fecha actual y la fecha de hace 24 horas
    const currentDate = moment();
    const pastDate = moment().subtract(24, "hours");

    const { price: price_24h } = await strapi.db
      .query("api::asset.asset")
      .findOne({
        select: ["price"],
        where: {
          name,
          createdAt: {
            // $gte: pastDate.toISOString(), // Filtrar por fechas mayores o iguales a hace 24 horas
            // $lte: currentDate.toISOString(), // Filtrar por fechas menores o iguales a la fecha actual
            $lte: pastDate.toISOString(), // Filtrar por fechas menores o iguales a la fecha de hace 24 h
          },
        },
        orderBy: { createdAt: "desc" },
      });

    return ctx.send({
      price,
      last_24h: price_24h !== undefined ? price_24h - price : null,
    });
  },
}));

// module.exports = createCoreController('api::asset.asset');
