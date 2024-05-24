'use strict';

const axios = require('axios');
const { createCoreController } = require('@strapi/strapi').factories;

const { verifyJWT } = require('../../../utils/auth');

module.exports = createCoreController('api::token.token', ({ strapi }) => ({
  async findAll(ctx) {
    const tokens = await strapi.db.query('api::token.token').findMany({
      select: [],
    });

    return ctx.send({
      tokens,
      success: true,
    });
  },
  async deploy(ctx) {
    const { authorization } = ctx.request.headers;

    if (authorization) {
      const isAuthorized = verifyJWT(authorization.split(' ')[1]);

      if (!isAuthorized)
        return ctx.send(
          {
            success: false,
          },
          401
        );
    } else
      return ctx.send(
        {
          success: false,
        },
        401
      );

    const {
      name,
      symbol,
      decimals,
      deployer_private_key,
      identity_registry_storage,
      trex_factory,
      agent_manager,
      claim_topics_registry,
      address_owner,
      address_agent,
      address_blacklister,
      address_pauser,
      address_token_holder,
      address_stable_receiver,
      protocol,
    } = ctx.request.body;

    if (protocol === 'ERC-20') {
      try {
        const response = await axios.post(
          'http://54.67.10.124:8000/deploy_erc20',
          {
            name,
            symbol,
            decimals,
            address_owner,
            address_agent,
            address_blacklister,
            address_pauser,
            address_token_holder,
            address_stable_receiver,
          },
          {
            headers: {
              // Puedes incluir otros encabezados según sea necesario
            },
          }
        );

        console.log('RESPONSE', response);

        return ctx.send({
          success: true,
        });
      } catch (e) {
        console.log('ERROR', e);
        return ctx.send({
          success: false,
        });
      }
    } else if (protocol === 'ERC-3643') {
      if (trex_factory) {
        try {
          console.log('LOGS', {
            name,
            symbol,
            decimals,
            deployer_private_key,
            identity_registry_storage,
            trex_factory,
            agent_manager,
            claim_topics_registry,
            token_holder_address,
            stable_receiver_address,
            final_owner_address,
          });

          const response = await axios.post(
            'http://54.67.10.124:5000/deploy_from_factory_one_acount_transfer_ownership',
            {
              name,
              symbol,
              decimals,
              deployer_private_key,
              identity_registry_storage,
              trex_factory,
              agent_manager,
              claim_topics_registry,
              token_holder_address,
              stable_receiver_address,
              final_owner_address,
            },
            {
              headers: {
                // Puedes incluir otros encabezados según sea necesario
              },
            }
          );

          console.log('RESPONSE', response);

          return ctx.send({
            success: true,
          });
        } catch (e) {
          console.log('ERROR', e);
          return ctx.send({
            success: false,
          });
        }
      } else {
        try {
          const response = await axios.post(
            'http://54.67.10.124:4000/deploy_one_account', //was /deploy
            {
              name,
              symbol,
              decimals,
              deployer_private_key,
              final_owner_address: address_owner,
              token_holder_address: address_token_holder,
              stable_receiver_address: address_stable_receiver,
            },
            {
              headers: {
                // Puedes incluir otros encabezados según sea necesario
              },
            }
          );

          console.log('RESPONSE', response);

          return ctx.send({
            success: true,
          });
        } catch (e) {
          console.log('ERROR', e);
          return ctx.send({
            success: false,
          });
        }
      }
    }
  },
  async mint(ctx) {
    const { authorization } = ctx.request.headers;

    if (authorization) {
      const isAuthorized = verifyJWT(authorization.split(' ')[1]);

      if (!isAuthorized)
        return ctx.send(
          {
            success: false,
          },
          401
        );
    } else
      return ctx.send(
        {
          success: false,
        },
        401
      );

    const { token_address, amount, client_address } = ctx.request.body;

    try {
      const response = await axios.post(
        'http://54.67.10.124:4000/mint_tokens_demo', //was /deploy
        {
          token_address,
          amount,
          client_address,
        },
        {
          headers: {},
        }
      );

      console.log('RESPONSE', response);

      return ctx.send({
        success: true,
      });
    } catch (e) {
      console.log('ERROR', e);
      return ctx.send(
        {
          success: false,
        },
        500
      );
    }
  },
}));
