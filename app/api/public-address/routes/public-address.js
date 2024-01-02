'use strict';

/**
 * public-address router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::public-address.public-address');
