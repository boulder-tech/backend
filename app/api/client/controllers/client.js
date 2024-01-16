"use strict";

/**
 * client controller
 */

const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const Persona = require("../../../services/Persona");

const {
  generateRegistrationToken,
  verifyRegistrationToken,
} = require("../../../utils/auth");

const { createCoreController } = require("@strapi/strapi").factories;

const accessKeyId = strapi.config.get("environments.aws.ses.accessKeyId", "");
const secretAccessKey = strapi.config.get(
  "environments.aws.ses.secretAccessKey",
  ""
);
const aws_ses_email = strapi.config.get("environments.aws.ses.email", "");
const region = strapi.config.get("environments.aws.region", "");
const frontendURL = strapi.config.get("environments.frontendURL");
const personaApiKey = strapi.config.get("environments.personaApiKey");

module.exports = createCoreController("api::client.client", ({ strapi }) => ({
  async signup(ctx) {
    const { email, name, lastname, password, verified } = ctx.request.body;

    const client = await strapi.db.query("api::client.client").findOne({
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
        await strapi.db.query("api::client.client").create({
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
              Data: "Welcome to Boulder Tech",
            },
          },
          Source: aws_ses_email,
        };

        ses.sendEmail(params, (err, data) => {
          if (err) {
            console.error(
              "Error al enviar el correo electrónico:",
              err.message
            );
          } else {
            console.log(
              "Correo electrónico enviado. ID del mensaje:",
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

    const client = await strapi.db.query("api::client.client").findOne({
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
      .query("api::public-address.public-address")
      .findOne({ select: [], where: { address } });

    if (existingAddress) {
      return ctx.send({
        success: false,
      });
    }

    const { id } = await strapi.db.query("api::client.client").create({
      data: { status: "created" },
    });

    await strapi.db.query("api::public-address.public-address").create({
      data: { client: id, address },
    });

    return ctx.send({
      success: true,
    });
  },
  async KYC(ctx) {
    const { public_address: address, ...data } = ctx.request.body;

    const existingAddress = await strapi.db
      .query("api::public-address.public-address")
      .findOne({
        where: { address },
        populate: { client: true },
      });

    if (existingAddress) {
      console.log(existingAddress.client);
      await strapi.db.query("api::client.client").update({
        where: { id: existingAddress.client.id },
        data: { status: "pending_review", ...data },
      });

      return ctx.send({
        success: true,
      });
    }
  },
  async updateData(ctx) {
    const { address: main_address, ...data } = ctx.request.body;

    const existingAddress = await strapi.db
      .query("api::public-address.public-address")
      .findOne({
        where: { address: main_address },
        populate: { client: true },
      });

    const reviewStatus = data.status;

    if (existingAddress) {
      await strapi.db.query("api::client.client").update({
        where: { id: existingAddress.client.id },
        data,
      });
    }

    return ctx.send({
      success: true,
    });
  },
  async getByPublicAddress(ctx) {
    const { address } = ctx.params;

    const existingAddress = await strapi.db
      .query("api::public-address.public-address")
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
      "environments.personaInquiryTemplateId"
    );
    const persona = new Persona({ apiKey: personaApiKey });

    const data = {
      attributes: {
        "inquiry-template-id": templateId,
      },
    };

    const meta = {
      "auto-create-account": true,
      "auto-create-account-reference-id": public_address,
    };

    const {
      data: { id: inquiryId },
    } = await persona.createInquiry({
      data,
      meta,
    });

    console.log("inquiryId", inquiryId);

    const { meta: kyc } = await persona.generateOneTimeInquiryLink({
      inquiryId,
      meta: {},
    });

    return ctx.send({
      kyc,
      success: true,
    });
  },
  async withPersonaStatus(ctx) {
    const { data } = ctx.request.body;

    console.log(JSON.stringify(data));

    return ctx.send({
      success: true,
    });
  },
}));
