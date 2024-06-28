const axios = require('axios');

const AML_BOT_API_URL = strapi.config.get('environments.amlBotApiUrl');
const AML_BOT_FORM_ID = strapi.config.get('environments.amlBotFormId');

class AMLBot {
  constructor({ token }) {
    this.token = token;
  }

  async createApplicant(data) {
    const response = await axios.post(`${AML_BOT_API_URL}/applicants`, data, {
      headers: { Authorization: `Token ${this.token}` },
    });

    return response.data;
  }

  async getApplicant(applicant_id) {
    const response = await axios.get(
      `${AML_BOT_API_URL}/applicants/${applicant_id}`,
      {
        headers: { Authorization: `Token ${this.token}` },
      }
    );

    return response.data;
  }

  async getFormURL(data) {
    const response = await axios.post(
      `${AML_BOT_API_URL}/forms/${AML_BOT_FORM_ID}/urls`,
      data,
      {
        headers: { Authorization: `Token ${this.token}` },
      }
    );

    return response.data;
  }
}

module.exports = AMLBot;
