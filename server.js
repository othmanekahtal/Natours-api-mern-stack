const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const server = require('./index');
console.log(process.env);
server.listen(8080, () => {
  console.log('listen on port 8080...');
});
