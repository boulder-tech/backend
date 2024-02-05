'use strict';

/**
 * deployed-token service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::deployed-token.deployed-token');
