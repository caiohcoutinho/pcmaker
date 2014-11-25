var myApp = angular.module('myapp',['ui.bootstrap']);

myApp.controller('pcmaker', ['$scope', '$http', function($scope, $http) {

	var createCatalog = function(filter){
		  $http.get('/catalog').success(function(data, status, headers, config) {
		  	  var catalog = data;
			  if(!_.isUndefined(filter)){
			  	catalog = _.map(catalog, function(type){
				  	return {
				  		name: type.name,
				  		options: _.filter(type.options, filter)
				  	}
				  });	
			  }
			  catalog = _.sortBy(catalog, "name");
			  _.each(catalog, function(type){
			  	type.options = _.sortBy(type.options, "price");
			  });
			  $scope.catalog = catalog;
		  }).error(function(data, status, headers, config) {
		      console.log("Erro ao recuperar catálogo");
		      $scope.catalog = [];
		  });
	};

  createCatalog();

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
			return this.option.price*this.quantity+fare;
  		}
  		return 0;
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
}]);

myApp.controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

myApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});