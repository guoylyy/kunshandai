define(['app','moment'],function(app, moment){
  return app.filter('dateFilter', function() {
    return function(date){
      return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss');
    };
  });
});
