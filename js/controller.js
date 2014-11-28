var myApp = angular.module('myapp',['ui.bootstrap']);

myApp.controller('pcmaker', ['$scope', '$http', '$modal', '$log', function($scope, $http, $modal, $log) {

  $scope.refreshCatalog = function(filter){
    $http.get('/catalog').success(function(data, status, headers, config) {
          var catalog = data;
          if(!_.isUndefined(filter)){
              catalog = _.map(catalog, function(type){
                  return {
                      name: type.name,
                      options: _.filter(type.options, filter),
                  }
              }); 
          }
          catalog = _.sortBy(catalog, "name");
          _.each(catalog, function(type){
              type.options = _.sortBy(type.options, function(option){
                  return parseFloat(option.price);
              });
          });
          $scope.catalog = catalog;
      }).error(function(data, status, headers, config) {
          console.log("Erro ao recuperar catálogo");
          $scope.catalog = [];
      });
  };

  $scope.refreshCatalog();

  var Item = function(){
    	this.quantity = 1;
    	this.definedType = function(){
    		  return !_.isUndefined(this.type) && !_.isNull(this.type);
    	};
    	this.price = function(){
      		if(this.quantity>0 && !_.isUndefined(this.option)){
        			var fare = 0;
        			if(!_.isUndefined(this.option.fare)){
        				  fare = this.option.fare;
        			};
    			    return parseInt(this.option.price)*parseInt(this.quantity)+parseFloat(fare);
      		}
      		return 0;
    	}
      this.hasLink = function(){
          return this.option != undefined && this.option.link != undefined && this.option.link != "";
      }
  };

  $scope.totalPrice = function(){
    	return _.reduce($scope.items, function(total, item){
      		if(!_.isUndefined(item)){
      			  return total+item.price();
      		}
      		return total;
    	}, 0);
  };
  $scope.items = [];
  $scope.addComponent = function(){
  	  $scope.items.push(new Item());
  }
  $scope.hasTable = function(){
  	  return !_.isEmpty($scope.items);
  };
  var findItem = function(typeName){
    	return _.some($scope.items, function(item){
    		  return item.definedType() && item.type.name == typeName && !_.isNull(item.option) && !_.isUndefined(item.option) && item.quantity > 0;
    	});
  }
  $scope.progress = function(){
    	var requiredComponents = _.filter($scope.catalog, _.matches({"required": "true"}));
    	return  100*_.size(_.filter(_.map(requiredComponents, "name"), findItem)) / _.size(requiredComponents);
  }
  $scope.progressOptional = function(){
    	var notRequiredComponents = _.filter($scope.catalog, _.matches({"required": "false"}));
    	return  100*_.size(_.filter(_.map(notRequiredComponents, "name"), findItem)) / _.size(notRequiredComponents);
  }
  $scope.findItem = findItem;
  $scope.remove = function(index){
  	  $scope.items.splice(index, 1);
  }

  $scope.open = function (size) {

      var modalInstance = $modal.open({
          templateUrl: 'modalContent.html',
          controller: 'ModalInstanceCtrl',
          size: 'lg',
          resolve: {
            catalog: function () {
              return $scope.catalog;
            }
          }
      });

      modalInstance.result.then(function (newItem) {
          $http.post('/savecatalog', {newItem: newItem}).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("success");
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert("error!");
          });
      }, function () {
          $log.info('Modal dismissed at: ' + new Date());
      });
  };
}]);

myApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $http, catalog) {

    $scope.newItem = {};

    $scope.catalog = catalog;

    $scope.save = function () {
        $modalInstance.close($scope.newItem);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('canceled');
    };
});