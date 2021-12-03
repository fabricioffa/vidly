const express = require("express");
const app = express();

require('./startup/loggings')();
require('./startup/routes')(app);
require('./startup/db')(app);
require('./startup/configSettings')();

const port = process.env.PORT || 3333;
app.on('connected', () => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
})
