'use strict';

/**
 * transaction-sell service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::transaction-sell.transaction-sell');
