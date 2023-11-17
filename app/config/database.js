module.exports = ({ env }) => ({
    defaultConnection: 'default',
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        schema: env('DATABASE_SCHEMA', 'public'), // Not required
        ssl: env('DATABASE_SSL', false)
        //ssl: {
          //rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), // For self-signed certificates
        //},
      },
      debug: false,
    },
    /*
    connections: {
      default: {
        connector: 'mongoose',
        settings: {
          client: 'mongo',
          host: env('DATABASE_HOST', '127.0.0.1'),
          port: env.int('DATABASE_PORT', 27017),
          database: env('DATABASE_NAME', 'strapi'),
          username: env('DATABASE_USERNAME', ''),
          password: env('DATABASE_PASSWORD', ''),
        },
        options: {
          authenticationDatabase: env('AUTHENTICATION_DATABASE', null),
          ssl: env('DATABASE_SSL', false),
        },
      },
    },
    */
  });
  