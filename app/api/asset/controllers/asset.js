"use strict";

/**
 * asset controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::asset.asset", ({ strapi }) => ({
  async findByName(ctx) {
    const { name } = ctx.params;

    const { price } = await strapi.db.query("api::asset.asset").findOne({
      select: ["price"],
      where: { name },
      orderBy: { createdAt: "desc" },
    });

    return ctx.send({
      price,
    });
  },
}));

// module.exports = createCoreController('api::asset.asset');
