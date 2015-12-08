app.factory('RestService', ['$http', '$q', '$log', 'Restangular', function ($http, $q, $log, Restangular) {
    var services = {
//        createGameboard: function() {
//            $log.debug('creating /game_board...');
//            var deferredPromise = $q.defer();
//            Restangular.all("game_board").post()
//                .then(function (response) {
//                    $log.debug("creating new game_board...");
//                    console.log(response);
//                    deferredPromise.resolve(response);
//                },
//                function (error) {
//                    $log.error("error creating new game_board!");
//                    alert('error creating new game_board!');
//                    deferredPromise.reject(error);
//                });
//            return deferredPromise.promise;
//        },
        
        get: function (name) {
                $log.debug("getting list of " + name);
                var deferredPromise = $q.defer();
//                Restangular.all(name).getList()
                $http({
                    method: 'GET',
                    url: '/'+name
                })
                    .then(function (response) {
                        $log.debug("response received for " + name);
                        deferredPromise.resolve(response);

                    },
                    function (error) {
                        $log.error("error getting " + name);
                        deferredPromise.reject(error);
                    });
                return deferredPromise.promise;
            },
        getOne: function (name, id) {
                $log.debug("getting " + name + " by id - " + id);
                var deferredPromise = $q.defer();
                Restangular.one(name, id).get()
                    .then(function (response) {
                        $log.debug("response received for "+ name + " by id - " + id);
                        deferredPromise.resolve(response);
                    },
                    function (error) {
                        $log.error("error! " + name + " by id - " + id);
                        deferredPromise.reject(error);
                    });
                return deferredPromise.promise;
            },
        post: function (name, newData) {
                $log.debug("adding new data " + angular.toJson(newData) + " to " + name);
                var deferredPromise = $q.defer();
                Restangular.all(name).post(angular.toJson(newData))
                    .then(function (response) {
                        $log.debug("added new data to ..." + name);
                        deferredPromise.resolve(response);
                    },
                    function (error) {
                        $log.error("error adding new data to table! " + name);
                        deferredPromise.reject(error);
                    });
                return deferredPromise.promise;
            }
    };
    return services;
}]);