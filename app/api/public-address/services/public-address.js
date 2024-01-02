'use strict';

/**
 * public-address service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::public-address.public-address');
