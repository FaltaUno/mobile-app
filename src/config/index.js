import development from 'config/development'
// import staging from 'config/staging'
// import production from 'config/production'

// const env = process.env.NODE_ENV || 'development';

const config = {
  development,
  // staging,
  // production,
};

export default config['development'];
