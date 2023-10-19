module.exports = {
    development: {
      client: 'pg',
      connection: {
        host: 'localhost:8888',
        user: 'postgres',
        password: 'secret',
        database: 'playground',
      },
      migrations: {
        directory: './migrations',
      },
    },
  };
  