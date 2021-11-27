const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const server = require('./index');
server.listen(8080, () => {
  console.log('listen on port 8080...');
});
