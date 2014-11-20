var myApp = angular.module('myapp',[]);

myApp.controller('pcmaker', ['$scope', function($scope) {

	var createCatalog = function(filter){
		var catalog = [
		  	{
		  		name: "Graphical Processing Unit",
		  		options: [
		  			{description: "Nvidia Geforce GTX750 1GB GDDR5 1085Mhz", price: 460, fare: 13.67, ebay: false},
		  			{description: "ZOTAC NVIDIA GeForce GTX 750 1GB GDDR5 DVI/HDMI/DisplayPort pci-e Video", price: 85, ebay: true},
		  		],
			},{
		  		name: "Computer Processing Unit",
		  		options: [
			  		{description: "AMD Buldozer FX 6300 3.5ghz", price: 376, ebay: false},
			  		{description: "AMD FX-6300 Vishera Six-Core AM3+ CPU Processor 3.5GHz 95W Retail FD6300WMHKBOX", price: 259, ebay: true},
		  		],
		  	},{
		  		name: "Motherboard",
		  		options: [
		  			{description: "ASUS M5A78L M LX/BR", price: 190, ebay: false}
		  		]
		  	},{
		  		name: "Case",
		  		options: [
		  			{description: "Cougar MX 300", price: 200, ebay: false}
		  		]
		  	},{
		  		name: "RAM",
		  		options: [
		  			{description: "DDR3 4gb 1333MHz", price: 180, fare: 18, ebay: false},
		  			{description: "Corsair DDR3 Vengeance 4GB RAM 1600 MHZ DIMM", price: 126, ebay: true},
		  		]
		  	},{
		  		name: "Hard Disk",
		  		options: [
		  			{description: "Hd Hitachi 1tb 1000gb 7200rpm 3.5", price: 175, fare: 10, ebay: false},
		  		]
		  	},{
		  		name: "Power Supply",
		  		options: [
		  			{description: "Atx 500w Reais Blue Case Super Silenciosa Com Nf-e", price: 85, ebay: false},
		  			{description: "Zeus ATX 500W 220V PSU 120mm Silent Fan", price: 59.5, ebay: true},
		  		]
		  	},{
		  		name: "Solid State Driver",
		  		options: [
		  			{description: "Kingston V300 120GB Sata 3 - 450 Mb/s", price: 224, fare: 11.06, ebay: false},
		  			{description: "Kingston V300 120GB Sata 3 - 6GB/SEC", price: 171.21, ebay: true},
		  			{description: "Kingston V300 240GB", price: 229.93, ebay: true},
		  			{description: "Kingston V300 240gb 2.5 Sata 3", price: 370, fare: 12.08, ebay: false},
		  		],
		  	},{
		  		name: "Blu-ray",
		  		options : [
		  			{description: "Gravador E Leitor Interno De Blu-ray Sata Lg M-disc Preto 3d", price: 260, fare: 11.31, ebay: false},
		  			{description: "Samsung Desktop Blu-Ray Internal SATA Drive SH-B083A (Black) NEW RETAIL BOX 1 Y", price: 130, fare: 11.31, ebay: true},
		  		]
		  	}
		  ];
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
		  return catalog;
	};

  $scope.catalog = createCatalog();

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

  $scope.greeting = 'Hola!';
  $scope.totalPrice = function(){
  	return _.reduce($scope.items, function(total, item){
  		if(!_.isUndefined(item)){
  			return total+item.price();
  		}
  		return total;
  	}, 0);
  };
  $scope.items = [];
  $scope.addItem = function(){
  	$scope.items.push(new Item());
  }
  $scope.hasTable = function(){
  	return !_.isEmpty($scope.items);
  };
  $scope.filterCatalog = function(){
  	var sure = confirm("Tem certeza que deseja filtrar os resultados?");
  	if(sure){
  		$scope.items = [];
  		if($scope.ebay && $scope.mercadoLivre){
  			$scope.catalog = createCatalog();
  		} else if($scope.ebay == true){
  			$scope.catalog = createCatalog(_.property("ebay"));
  		} else if($scope.mercadoLivre == true){
			$scope.catalog = createCatalog(_.negate(_.property("ebay")));
  		}
  	}
  };
}]);