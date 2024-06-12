'use strict';

/**
 * client controller
 */

const AWS = require('aws-sdk');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const web3 = require('web3');
const Persona = require('../../../services/Persona');

const {
  verifyJWT,
  generateRegistrationToken,
  verifyRegistrationToken,
} = require('../../../utils/auth');

const { createCoreController } = require('@strapi/strapi').factories;

const accessKeyId = strapi.config.get('environments.aws.ses.accessKeyId', '');
const secretAccessKey = strapi.config.get(
  'environments.aws.ses.secretAccessKey',
  ''
);

const aws_ses_email = strapi.config.get('environments.aws.ses.email', '');
const region = strapi.config.get('environments.aws.region', '');
const frontendURL = strapi.config.get('environments.frontendURL');
const personaApiKey = strapi.config.get('environments.personaApiKey');
const environment = strapi.config.get('environments.environment');
const managerApiURL = strapi.config.get('environments.managerApiURL');

const persona_status = {
  kyc_approved: 'pending_review',
  pending_review: 'pending_onboarding',
  approved: 'kyc_approved',
  created: 'pending_onboarding',
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = createCoreController('api::client.client', ({ strapi }) => ({
  async signup(ctx) {
    const { email, name, lastname, password, verified } = ctx.request.body;

    const client = await strapi.db.query('api::client.client').findOne({
      select: [],
      where: { email },
      //populate: { category: true },
    });

    if (client) {
      return ctx.send({
        code: 100,
        success: true,
      });
    } else {
      if (verified) {
        await strapi.db.query('api::client.client').create({
          data: {
            email,
            name,
            lastname,
            password: await bcrypt.hash(password, 10),
          },
        });

        return ctx.send({
          code: 102,
          success: true,
        });
      } else {
        AWS.config.update({
          accessKeyId,
          secretAccessKey,
          region,
        });

        const ses = new AWS.SES();
        const token = generateRegistrationToken(email);

        const params = {
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Body: {
              Html: {
                Data: `<p>Hello,</p>
                
                                <p>Thank you for your interest in our platform! To get started, please register by clicking on the following link:</p>
                               
                                <p><a href="${frontendURL}/auth/token/${token}">${frontendURL}/auth/token/${token}</a></p>
                                
                                <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                                
                                <p>Best regards,<br>
                                Boulder Tech</p>
                                `,
              },
            },
            Subject: {
              Data: 'Welcome to Boulder Tech',
            },
          },
          Source: aws_ses_email,
        };

        ses.sendEmail(params, (err, data) => {
          if (err) {
            console.error(
              'Error al enviar el correo electrónico:',
              err.message
            );
          } else {
            console.log(
              'Correo electrónico enviado. ID del mensaje:',
              data.MessageId
            );
          }
        });

        return ctx.send({
          code: 101,
          success: true,
        });
      }
    }
  },
  async login(ctx) {
    const { email, password } = ctx.request.body;

    const client = await strapi.db.query('api::client.client').findOne({
      select: [],
      where: { email },
    });

    const correctPassword = await bcrypt.compare(password, client.password);

    delete client.password;

    if (!correctPassword)
      return ctx.send(
        {
          code: 103,
          success: false,
        },
        401
      );

    return ctx.send({
      client,
      success: true,
    });
  },
  async verifyToken(ctx) {
    const { token } = ctx.params;
    const { email } = verifyRegistrationToken(token);

    return ctx.send({
      email: email,
      success: true,
    });
  },
  async connectWallet(ctx) {
    const { public_address: address } = ctx.request.body;

    const existingAddress = await strapi.db
      .query('api::public-address.public-address')
      .findOne({ select: [], where: { address } });

    if (existingAddress) {
      return ctx.send({
        success: false,
      });
    }

    const kyc = await this.createOneTimeLinkForKyc(address);

    console.log('KYC', kyc);

    const { id } = await strapi.db.query('api::client.client').create({
      data: { status: 'created', kyc_url: kyc['one-time-link-short'] },
    });

    await strapi.db.query('api::public-address.public-address').create({
      data: { client: id, address },
    });

    return ctx.send({
      kyc_url: kyc['one-time-link-short'],
      success: true,
    });
  },
  async KYC(ctx) {
    const { public_address: address, ...data } = ctx.request.body;

    const existingAddress = await strapi.db
      .query('api::public-address.public-address')
      .findOne({
        where: { address },
        populate: { client: true },
      });

    if (existingAddress) {
      console.log(existingAddress.client);
      await strapi.db.query('api::client.client').update({
        where: { id: existingAddress.client.id },
        data: { status: 'pending_review', ...data },
      });

      return ctx.send({
        success: true,
      });
    }
  },
  async updateData(ctx) {
    const { address: main_address, ...data } = ctx.request.body;

    console.log('CLIENT => UPDATE DATA');
    console.log('main_address', main_address);
    console.log('data', data);

    const existingAddress = await strapi.db
      .query('api::public-address.public-address')
      .findOne({
        where: { address: main_address },
        populate: { client: true },
      });

    const reviewStatus = data.status;

    console.log('existingAddress', existingAddress);

    if (existingAddress) {
      await strapi.db.query('api::client.client').update({
        where: { id: existingAddress.client.id },
        data,
      });
    }

    console.log('CLIENT => END!');

    return ctx.send({
      success: true,
    });
  },
  async getByPublicAddress(ctx) {
    const { address } = ctx.params;

    console.log('GET BY PUBLIC ADDRESS', address);

    const existingAddress = await strapi.db
      .query('api::public-address.public-address')
      .findOne({
        where: { address },
        populate: { client: true },
      });

    if (existingAddress) {
      const {
        address: public_address,
        client: { id, createdAt, updatedAt, ...clientData },
      } = existingAddress;

      return ctx.send({
        public_address,
        client: clientData,
        success: true,
      });
    } else {
      return ctx.send(
        {
          success: false,
        },
        404
      );
    }
  },
  async generateOneTimeLinkForKyc(ctx) {
    const { public_address } = ctx.request.body;
    const templateId = strapi.config.get(
      'environments.personaInquiryTemplateId'
    );
    const persona = new Persona({ apiKey: personaApiKey });

    const data = {
      attributes: {
        'inquiry-template-id': templateId,
      },
    };

    const meta = {
      'auto-create-account': true,
      'auto-create-account-reference-id': public_address,
    };

    const {
      data: { id: inquiryId },
    } = await persona.createInquiry({
      data,
      meta,
    });

    console.log('inquiryId', inquiryId);

    const { meta: kyc } = await persona.generateOneTimeInquiryLink({
      inquiryId,
      meta: {},
    });

    return ctx.send({
      kyc,
      success: true,
    });
  },
  async createOneTimeLinkForKyc(public_address) {
    const templateId = strapi.config.get(
      'environments.personaInquiryTemplateId'
    );
    const persona = new Persona({ apiKey: personaApiKey });

    const data = {
      attributes: {
        'inquiry-template-id': templateId,
      },
    };

    console.log('CREATING INQUIRY WITH REFERENCE ID ->', public_address);

    const meta = {
      'auto-create-account': true,
      'auto-create-account-reference-id': public_address,
    };

    const {
      data: { id: inquiryId },
    } = await persona.createInquiry({
      data,
      meta,
    });

    console.log('INQUIRY ID =>', inquiryId);

    const { meta: kyc } = await persona.generateOneTimeInquiryLink({
      inquiryId,
      meta: {},
    });

    return kyc;
  },
  async withPersonaStatus(ctx) {
    if (ctx.request.body.abi) {
      return ctx.send({
        success: true,
      });
    }

    const {
      data: {
        attributes: {
          name,
          payload: {
            data: { id: inquiryId, attributes },
          },
        },
      },
    } = ctx.request.body;

    console.log('INQUIRY NAME', name);

    if (name === 'inquiry.started') {
      console.log(`INQUIRY ${inquiryId} STARTED`);
    } else if (name === 'inquiry.completed') {
      console.log(`INQUIRY ${inquiryId} COMPLETED`);
      console.log(`environment`, environment);

      await this.updateClient({
        address:
          environment === 'development'
            ? web3.utils.toChecksumAddress(attributes.referenceId)
            : attributes.referenceId,
        status: 'pending_review',
      });
    } else if (name === 'inquiry.approved') {
      console.log(`INQUIRY ${inquiryId} APPROVED`);
      console.log(`environment`, environment);
      //Just for sandbox: 10 seconds before update client status to approved because it happens too fast at sandbox environment
      await delay(10000);

      //TODO: whitelist user

      const address =
        environment === 'development'
          ? web3.utils.toChecksumAddress(attributes.referenceId)
          : attributes.referenceId;

      await this.updateClient({
        address,
        status: 'kyc_approved',
      });

      /*
      strapi.io.sockets
        .in(address)
        .emit('kyc-approved', { address, status: 'approved' });
      */
    } else if (name === 'inquiry.expired') {
      console.log(`INQUIRY ${inquiryId} EXPIRED: ANOTHER ONE BITES THE DUST`);

      const address =
        environment === 'development'
          ? web3.utils.toChecksumAddress(attributes.referenceId)
          : attributes.referenceId;

      const kyc = await this.createOneTimeLinkForKyc(address);

      await this.updateClient({
        address,
        kyc_url: kyc['one-time-link-short'],
        status: 'created',
      });

      strapi.io.sockets
        .in(address)
        .emit('kyc-expired', { address, status: 'expired' });
    } else {
      console.log(`INQUIRY ${inquiryId}: ANOTHER ONE BITES THE DUST`);
    }

    console.log('ATTRIBUTES', JSON.stringify(attributes));

    return ctx.send({
      success: true,
    });
  },
  async updateClient(clientData) {
    const { address, ...data } = clientData;

    const existingAddress = await strapi.db
      .query('api::public-address.public-address')
      .findOne({
        where: { address },
        populate: { client: true },
      });

    if (existingAddress) {
      await strapi.db.query('api::client.client').update({
        where: {
          id: existingAddress.client.id,
          status: { $eq: persona_status[data.status] },
        },
        data,
      });
    }
  },
  async getAllKycApproved(ctx) {
    const { status } = ctx.params;

    const clients = await strapi.db.query('api::client.client').findMany({
      select: ['createdAt'],
      where: { status },
      populate: { public_addresses: true },
    });

    return ctx.send({
      clients,
      success: true,
    });
  },
  async batchRegisterIdentity(ctx) {
    const payload = ctx.request.body;

    try {
      const response = await axios.post(
        'http://54.67.10.124:4000/batch_register_identity',
        payload,
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
      return ctx.send({
        success: false,
      });
    }
  },
}));
