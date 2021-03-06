angular.module('controller.favourites', ['ionic'])

.controller('FavouritesCtrl', function($scope, LoadingService, RequestService, FavouritesService, AlertService) {

  var favourites = FavouritesService.getFavourites();

  $scope.fetchData = function() {
    $scope.repos = [];

    if (favourites.length > 0) {
      LoadingService.show();

      angular.forEach(favourites, function(value, key) {
        RequestService
          .request('GET', '/repos/' + value.slug, value.isPro, false)
          .then(function(data) {
            console.log('Success-Favourite Repo!');
            data.repo.login_id = data.repo.slug.split('/')[0];
            data.repo.short_slug = data.repo.slug.split('/')[1];
            data.repo.is_pro = value.isPro;
            $scope.repos.push(data.repo);

            if (key + 1 == favourites.length) {
              LoadingService.hide();
            }
          }, function(data) {
            // Failure
            AlertService.raiseAlert('Oops! We couldn\'t get your favourites\' repos info from Travis CI. Please try again.');
            LoadingService.hide();
          })
          .finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
      });
    } else {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }
  };

  $scope.fetchData();

});
