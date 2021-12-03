const config = require("config");

module.exports = () => {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined!');
  }

  console.log(`Aplication name: ${config.get("name")}`);
  console.log(`Aplication default port: ${config.get("default port")}`);
}

