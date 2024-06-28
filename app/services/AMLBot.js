const axios = require('axios');

const AML_BOT_API_URL = strapi.config.get('environments.personaApiURL');

class AMLBot {
  constructor({ token }) {
    this.token = token;
  }

  async createApplicant({ data }) {
    const response = await axios.post(`${AML_BOT_API_URL}/applicants`, data, {
      headers: { Authorization: `Token ${this.token}` },
    });

    return response.data;
  }
}

module.exports = AMLBot;
