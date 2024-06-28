const moment = require('moment');

const timeFrames = { '1d': 'days', '1w': 'weeks', '1M': 'months' };

const fetchHistoricalPrice = async ({ name, range, resolution }) => {
  const oneResolutionBefore = moment().subtract(range, timeFrames[resolution]);

  return await strapi.db.query('api::asset.asset').findOne({
    where: {
      $and: [
        {
          name,
          resolution: '8h',
        },
        {
          createdAt: {
            $lte: oneResolutionBefore.toISOString(),
          },
        },
      ],
    },
    orderBy: { createdAt: 'DESC' },
  });
};

module.exports = { fetchHistoricalPrice };
