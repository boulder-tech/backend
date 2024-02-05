'use strict';

/**
 * deployed-token router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::deployed-token.deployed-token');
