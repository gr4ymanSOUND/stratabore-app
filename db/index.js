const client = require('./client');
const models = require('./models');

// module.exports = {
//   client
// };

module.exports = {
  client,
  ...models,
};
