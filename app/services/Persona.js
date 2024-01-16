const axios = require('axios');

const personaApiURL = strapi.config.get('environments.personaApiURL');

class Persona {
    constructor({ apiKey }) {
        this.apiKey = apiKey;
    }

    async createInquiry({ data, meta }) {
        const response = await axios.post(
            `${personaApiURL}/inquiries`,
            {
                data,
                meta,
            },
            { headers: { Authorization: `Bearer ${this.apiKey}` } }
        );

        return response.data;
    }

    async generateOneTimeInquiryLink({ inquiryId, meta }) {
        console.log(
            `${personaApiURL}/inquiries/${inquiryId}/generate-one-time-link`
        );
        const response = await axios.post(
            `${personaApiURL}/inquiries/${inquiryId}/generate-one-time-link`,
            {
                meta,
            },
            { headers: { Authorization: `Bearer ${this.apiKey}` } }
        );

        return response.data;
    }

    /*
  async sendSMSVerification({ countryCode, email, phone }) {
    const response = await this.registerUser({ countryCode, email, phone });
    const {
      user: { id: authyId }
    } = response;
    const { success } = await this.requestSms({ authyId });
    return { authyId, success };
  }

  async verifyUser({ authyId, token }) {
    return this.client.verifyToken({ authyId, token });
  }

  async registerUser({ countryCode, email, phone }) {
    return this.client.registerUser({
      countryCode,
      email,
      phone
    });
  }

  async requestSms({ authyId }) {
    return this.client.requestSms({ authyId });
  }
  */
}

module.exports = Persona;
