'use strict';

/**
 * tir service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tir.tir');
