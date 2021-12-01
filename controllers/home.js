exports.index = (req, res) => {
  res.render('index', {title: 'Vidly', message: 'Wellcome to Vidly!'});
}
