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
      agent_manager,
      address_owner,
      address_agent,
      address_blacklister,
      address_pauser,
      address_token_holder,
      address_stable_receiver,
      external_agent_address,
      factory,
      protocol,
      network,
      token_holder_address,
      stable_receiver_address,
    } = ctx.request.body;

    const {
      identity_registry_storage,
      trex_factory,
      claim_topics_registry,
      network: networkFactory,
    } = await strapi.db.query('api::factory.factory').findOne({
      where: { factory_name: factory },
    });

    const chain = networkFactory ? networkFactory : network;

    console.log({
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
      external_agent_address,
    });

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
      if (factory) {
        try {
          console.log({
            name,
            symbol,
            decimals,
            deployer_private_key,
            identity_registry_storage,
            trex_factory,
            claim_topics_registry,
            token_holder_address,
            stable_receiver_address,
            external_agent_address,
            factory_name: factory,
          });

          const response = await axios.post(
            `http://54.67.10.124:${
              chain === 'arbitrumSepolia' ? 4000 : 5000
            }/deploy_from_factory_one_account`,
            {
              name,
              symbol,
              decimals,
              deployer_private_key,
              identity_registry_storage,
              trex_factory,
              claim_topics_registry,
              token_holder_address,
              stable_receiver_address,
              external_agent_address,
              factory_name: factory,
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
            `http://54.67.10.124:${
              network === 'arbitrumSepolia' ? '4000' : '5000'
            }/deploy_one_account`, //was /deploy
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
  async deployFactory(ctx) {
    const {
      name: factory_name,
      private_key: deployer_private_key,
      network,
    } = ctx.request.body;

    try {
      const response = await axios.post(
        `http://54.67.10.124:${
          network === 'arbitrumSepolia' ? '4000' : '5000'
        }/deploy_factory_one_account`,
        {
          factory_name,
          deployer_private_key,
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

    return ctx.send({
      success: true,
    });
  },
  async mint(ctx) {
    const { token_address, amount, client_address, hash } = ctx.request.body;

    try {
      const { data } = await axios.post(
        'http://54.67.10.124:4000/mint_tokens_demo',
        {
          token_address,
          amount,
          client_address,
        },
        {
          headers: {},
        }
      );

      await strapi.db.query('api::transaction.transaction').update({
        where: { hash },
        data: {
          status: 'tokens_minted',
          //token_minted: parseFloat(token_minted),
          hash_mint: data.transaction_mint_hash,
          token_minted: data.amount,
        },
      });

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
