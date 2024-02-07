module.exports = ({ env }) => ({
  aws: {
    ses: {
      accessKeyId: env('AWS_SES_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_SES_SECRET_KEY_ID'),
      email: env('AWS_SES_EMAIL'),
    },
    region: env('AWS_REGION'),
  },
  environment: env('NODE_ENV'),
  frontendURL: env('FRONTEND_URL'),
  managerApiURL: env('MANAGER_API_URL'),
  personaApiKey: env('PERSONA_API_KEY_SANDBOX'),
  personaApiURL: env('PERSONA_API_URL'),
  personaInquiryTemplateId: env('PERSONA_INQUIRY_TEMPLATE_ID'),
});
