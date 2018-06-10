'use strict';

angular
  .module('AgilisiumApp', [])
  .controller('MainController', ['$scope', 'ApiService', MainController])
  .controller('MasterDataController', ['$scope', 'ApiService', MasterDataController])
  .controller('CreateProductController', ['$scope', 'ApiService', CreateProductController])
  .service('ApiService', ['$http', ApiService]);

  function MainController ($scope, ApiService) {
    $scope.loading = true;
    $scope.activeTab = 'master';

    $scope.setActiveTab = function (tab) {
      $scope.activeTab = tab;

      switch (tab) {
        case 'master': {
          $scope.loading = true;
          $scope.getData();
        } break;
      }
    }

    $scope.getData = function () {
      ApiService.getRequest('/masterdata', function (response) {
        $scope.$applyAsync(function () {
          $scope.mainData = response.data.masterdata;
          $scope.loading = false;
        });
      });
    };

    $scope.getData();
  }

  function MasterDataController ($scope, ApiService) {
    $scope.selectedItem = {};
    $scope.salesItem = {};

    $scope.selectView = function (item) {
      $scope.selectedItem = item;
      ApiService.getRequest('/salesdata/' + $scope.selectedItem.productId, (response) => {
        $scope.salesItem = response.data.salesdata;
      });
      $('#detailModal').modal('show');
    }

    $scope.selectDelete = function (item) {
      $scope.selectedItem = item;
      $('#deleteModal').modal('show');
    };

    $scope.confirmDelete = function () {
      ApiService.deleteRequest('/masterdata/' + $scope.selectedItem.productId
      , (response) => {
        if (response.status === 200) {
          $('#deleteModal').modal('hide');
          deleteSales($scope.selectedItem.productId);
          $scope.getData();
        }
      });
    };

    function deleteSales (id) {
      ApiService.deleteRequest('/salesdata/' + id, (response) => {
      });
    };
  }

  function CreateProductController ($scope, ApiService) {
    $scope.product = {};
    $scope.errors = [];

    $scope.getData = function () {
      ApiService.getRequest('/masterdata', function (response) {
        $scope.$applyAsync(function () {
          $scope.data = response.data.masterdata;
        });
      });
    };
    $scope.getData();

    $scope.save = function ($event) {
      var pattern1 = new RegExp(/^[0-9]*\.[0-9]{2}$/g);
      var pattern2 = new RegExp(/^[0-9]*\.[0-9]{2}$/g);
      $scope.errors = [];

      //VALIDATION
      if (!validate.isDefined($scope.product.artistName)) {
        $scope.errors.push("Artist name is required!");
      }
      if (!validate.isDefined($scope.product.title)) {
        $scope.errors.push("Album title is required!");
      }
      for (var i = 0; i < $scope.data.length; i++) {
        if ($scope.data[i].productId === $scope.product.productId) {
          $scope.errors.push("Product Id must be unique!");
        }
      }
      if (!validate.isDefined($scope.product.productId)) {
        $scope.errors.push("Product Id is required!");
      }
      if (!validate.isNumber($scope.product.productId)) {
        $scope.errors.push("Product Id must be a number!");
      }
      if (!validate.isDefined($scope.product.upc)) {
        $scope.errors.push("UPC is required!");

      } else if ($scope.product.upc) {
        if ($scope.product.upc.toString().length != 12) {
          $scope.errors.push("UPC must be 12 characters!");
        }
      }
      if (!validate.isNumber($scope.product.upc)) {
        $scope.errors.push("UPC must be a number!");
      }
      if (!validate.isDate($scope.product.relDate)) {
        $scope.errors.push("Release date must be a valid Date!");
      }
      if (!validate.isDefined($scope.product.saleRev)) {
        $scope.errors.push("Sale Revenue is required!");
      } else if (!(pattern1.test($scope.product.saleRev))) {
        $scope.errors.push("Check format on Sale Revenue!");
      }
      if (!validate.isDefined($scope.product.unitPrice)) {
        $scope.errors.push("Unit price is required!");
      } else if (!(pattern2.test($scope.product.unitPrice))) {
        $scope.errors.push("Check format on Unit Price!");
      }

      if (!$scope.errors.length) {
        var masterdata = {
          productId: $scope.product.productId,
          upc: $scope.product.upc,
          title: $scope.product.title,
          artistName: $scope.product.artistName,
          relDate: $scope.product.relDate
        }
        var salesdata = {
          productId: $scope.product.productId,
          saleQty: $scope.product.saleQty,
          saleRev: $scope.product.saleRev,
          unitPrice: $scope.product.unitPrice
        }

        ApiService.postRequest('/masterdata', masterdata, (response) => {
          if (response.status === 200) {
            ApiService.postRequest('/salesdata', salesdata, (response) => {
              if (response.status === 200) {
                $scope.product = {};
                $scope.success = true;

                setTimeout(function () {
                  $scope.success = false;
                }, 5000);
              }
            });
          }
        });
      }
    }
  }

  function ApiService ($http) {
    return {
      getRequest: function (route, callback) {
        $http({
          method: 'GET',
          url: route
        }).then((response) => {
          callback(response);
        });
      },
      postRequest: function (route, data, callback) {
        $http({
          method: 'POST',
          url: route,
          data: data
        }).then((response) => {
          callback(response);
        }).catch();
      },
      deleteRequest: function (route, callback) {
        $http({
          method: 'DELETE',
          url: route
        }).then((response) => {
          callback(response);
        });
      }
    };
  }
