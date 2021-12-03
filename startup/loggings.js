module.exports = () => {
  process.on('uncaughtException', (ex) => {
  console.log('Uncaught Exception:\n', ex);
  process.exit(1);
});

process.on('unhandledRejection', (ex) => {
  console.log('Unhandled Rejection:\n', ex);
  process.exit(1);
});

};
