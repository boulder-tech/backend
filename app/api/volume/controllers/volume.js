"use strict";

/**
 * volume controller
 */

const moment = require("moment");

const { createCoreController } = require("@strapi/strapi").factories;

(module.exports = createCoreController("api::volume.volume")),
  ({ strapi }) => ({
    async saveVolDiffRes(ctx) {
      try {
        const { name, value } = ctx.request.body;

        const currentDate = moment().startOf("minute");
        console.log(`current date: ${currentDate}`);

        const resolutions = [];

        // 5 minutes
        if (currentDate.minute() % 5 === 0) {
          resolutions.push("5m");
        }

        // 15 minutes
        if (currentDate.minute() % 15 === 0) {
          resolutions.push("15m");
        }

        // half hour
        if (currentDate.minute() % 30 === 0) {
          resolutions.push("30m");
        }

        // hourly
        if (currentDate.minute() === 0) {
          resolutions.push("1h");
        }

        // 4 hours
        if (currentDate.hour() % 4 === 0 && currentDate.minute() === 0) {
          resolutions.push("4h");
        }

        // 8 hours
        if (currentDate.hour() % 8 === 0 && currentDate.minute() === 0) {
          resolutions.push("8h");
        }

        // daily
        if (currentDate.hour() === 21 && currentDate.minute() === 0) {
          resolutions.push("1d");
        }

        if (
          currentDate.day() == 5 &&
          currentDate.hour() === 21 &&
          currentDate.minute() === 0
        ) {
          resolutions.push("1w");
        }

        console.log(`RESOLUTIONS: ${resolutions}`);
        for (const resolution of resolutions) {
          await strapi.db.query("api::volume.volume").create({
            data: {
              name,
              value,
              resolution,
            },
          });
        }

        return ctx.send({
          success: true,
        });
      } catch (error) {
        console.error(error);
        return ctx.send({ error: "An error occurred" }, 500);
      }
    },
  });
