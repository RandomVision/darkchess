module.exports = function (app) {

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
  // will print stacktrace
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('errors/generic', {
      message: err.message,
      error: err
    });
  });

  // production error handler
  // no stacktraces leaked to user
  // app.use(function(err, req, res, next) {
  //   res.status(err.status || 500);
  //   res.render('partials/error', {
  //     message: err.message,
  //     error: {}
  //   });
  // });

}