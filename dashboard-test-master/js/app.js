(function(){
  angular.module('mainApp',[])
  .config(function ($httpProvider) {
      $httpProvider.defaults.headers.common = {};
      $httpProvider.defaults.headers.post = {};
      $httpProvider.defaults.headers.put = {};
      $httpProvider.defaults.headers.patch = {};
  })
  .controller('CINController', function($rootScope,$scope, $http){
    $scope.display = function(){
      var cin = document.getElementById("CINinput").value;
      if(!isNaN(cin)){
        // For Customer Info display -->
        $scope.displayContent = false;
        $scope.userError = false;
        $http.get("https://cors.io/?https://l20jgb1jch.execute-api.us-east-1.amazonaws.com/customers/info?cin="+
                  cin).then(function(response){
                    //console.log("working?");
                    if(response.data.queryStatus!="success"){
                      $rootScope.userError = true;
                      $rootScope.errorResponse = response.data.queryStatus;
                    }else{
                      if(response.data.customerType=="Corporate"){
                        $scope.type = true;
                      }else{
                        $scope.type = false;
                      }
                      $scope.displayContent = true;
                      $scope.user = response.data;
                    }
                  });

        // For Supply Chain Display -->
        //    Our GET request function
        $scope.outputdatacin = "";
        $scope.outputdatatotal = "";
        $scope.outputdatapending = "";
        $scope.outputdatalast = "";
            $http.get("http://cors-anywhere.herokuapp.com/https://9pded99twc.execute-api.ap-south-1.amazonaws.com/SCF_Test_1/scfresource?cin="+cin)
                .then(function successCallback(response) {
                    //$scope.outputdata = response.text;

                    var responsedata = response.data;
                    $scope.outputdatacin = responsedata.cin;
                    $scope.outputdatatotal = responsedata.total_discounted;
                    $scope.outputdatapending = responsedata.pending_payments;
                    $scope.outputdatalast = responsedata.last_month;
                    console.log("Successfully GET");
                    google.charts.load('current', {
                        'packages': ['bar']
                    });
                    google.charts.setOnLoadCallback(drawStuff);

                    function drawStuff() {

                        var total_discounted = document.getElementById("total_discounted").value;
                        console.log(total_discounted);

                        var data = google.visualization.arrayToDataTable([
                    ['', '', {
                                role: 'style'
                    }],
                    ['Paid', responsedata.total_discounted, 'green'], // English color name
                    ['Pending', responsedata.pending_payments, 'blue'], // CSS-style declaration
                    ['Last Month', responsedata.last_month, 'red'],
                ]);

                        var options = {
                            width: 200,
                            chart: {
                                title: ' ',
                                subtitle: ''
                            },
                            bars: 'horizontal', // Required for Material Bar Charts.
                            series: {
                                0: {
                                    axis: 'distance'
                                }, // Bind series 0 to an axis named 'distance'.
                                1: {
                                    axis: 'brightness'
                                } // Bind series 1 to an axis named 'brightness'.
                            },
                            axes: {
                                x: {
                                    distance: {
                                        label: 'Amount in EUR (in Thosuands)'
                                    }, // Bottom x-axis.
                                    brightness: {
                                        side: 'top',
                                        label: 'apparent magnitude'
                                    } // Top x-axis.
                                }
                            }
                        };

                        var chart = new google.charts.Bar(document.getElementById('dual_x_div'));
                        chart.draw(data, options);
                    };
                    console.log(response.data);
                }, function errorCallback(response) {
                    console.log("GET Failed");
                });
        }else{
          $scope.userError = true;
          $scope.errorResponse = "Please enter valid CIN number";
        }
                        // trade finance
    
                        var userDetailsSuccess = function (response) {
                            var wip=0;
                            var te=0;
                            console.log(response.data)
                            $scope.userDetails = response.data;
                            wip=wip+$scope.userDetails.message['Work in Progress'];
                            te=te+$scope.userDetails.message['Total Exposure'];
                            if($scope.userDetails.message['status']=="Success")
                            {
                            drawChart(wip,te);
                            $scope.status_customer=true;
                            //$scope.nocus=false;
                            }
                            else
                            {
                            $scope.status_customer=false;
                            drawChart(wip,te);
                            //$scope.nocus=true;
                            }
                        };
                        var userDetailsError = function (error) {
                            console.log("ERROR :::" + error);
                            console.log(error)
                        }
                           
                            console.log("user login called");
                            $http.get("https://cors.io/?https://bztwi1cu97.execute-api.ap-south-1.amazonaws.com/TF/tf?CIN="+cin)
                            .then(userDetailsSuccess,userDetailsError);


    }
  });

})();
