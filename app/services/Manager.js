const axios = require('axios');

const managerApiURL = strapi.config.get('environments.managerApiURL');

class Manager {
  constructor({ privateKey }) {
    this.privateKey = privateKey;
  }

  /**
   * Adds a new agent to the specified contract.
   *
   * @async
   * @param {Object} params - The parameters for adding the agent.
   * @param {string} params.contract_type - The type of contract (e.g., 'token' or 'identity_registry').
   * @param {string} params.contract_address - The address of the contract.
   * @param {string} params.agent_address - The address of the new agent to be added.
   * @returns {Promise<Object>} An object containing the success status and either the response data or an error message.
   */
  async addAgent({
    contract_type,
    contract_address,
    agent_address: new_agent_address,
  }) {
    let addAgentPath = '';
    const payload = {
      deployer_private_key: this.privateKey,
      new_agent_address,
    };

    if (contract_type === 'token') {
      addAgentPath = '/add_token_agent';
      payload['token_address'] = contract_address;
    } else if (contract_type === 'identity-registry') {
      addAgentPath = '/add_ir_agent';
      payload['ir_address'] = contract_address;
    }

    try {
      const response = await axios.post(
        `${managerApiURL}/${addAgentPath}`,
        payload,
        { headers: {} }
      );

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add agent: ${error.message}`,
      };
    }
  }

  /**
   * Removes an agent from the specified contract.
   *
   * @async
   * @param {Object} params - The parameters for removing the agent.
   * @param {string} params.contract_type - The type of contract (e.g., 'token' or 'identity_registry').
   * @param {string} params.contract_address - The address of the contract.
   * @param {string} params.agent_address - The address of the agent to be removed.
   * @returns {Promise<Object>} An object containing the success status and either the response data or an error message.
   */
  async removeAgent({ contract_type, contract_address, agent_address }) {
    let removeAgentPath = '';

    const payload = {
      deployer_private_key: this.privateKey,
      agent_address,
    };

    if (contract_type === 'token') {
      removeAgentPath = '/remove_token_agent';
      payload['token_address'] = contract_address;
    } else if (contract_type === 'identity-registry') {
      removeAgentPath = '/remove_ir_agent';
      payload['ir_address'] = contract_address;
    }

    try {
      const response = await axios.post(
        `${managerApiURL}/${removeAgentPath}`,
        payload,
        { headers: {} }
      );

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: `Failed to remove agent: ${error.message}`,
      };
    }
  }
}

module.exports = Manager;
