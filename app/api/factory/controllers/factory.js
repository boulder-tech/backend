'use strict';

/**
 * factory controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::factory.factory');
