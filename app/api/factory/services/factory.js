'use strict';

/**
 * factory service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::factory.factory');
