app.factory('RestService', ['$http', '$q', '$log', function ($http, $q, $log) {
    
    //Heroku Server
    var url = 'https://clueless-server.herokuapp.com/';
    
    //Local Ruby Server
//    var url = 'http://localhost:3000/';
    
    var services = {
        get: function (name) {
                $log.debug("getting list of " + name);
                var deferredPromise = $q.defer();
                $http({
                    method: 'GET',
                    url: url+name
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
                $http({
                    method: 'GET',
                    url: url+name+'/'+id
                })
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
                $http({
                    method: 'POST',
                    url: url+name,
                    data: newData
                })
                    .then(function (response) {
                        $log.debug("added new data to ..." + name);
                        deferredPromise.resolve(response);
                    },
                    function (error) {
                        $log.error("error adding new data to table " + name);
                        deferredPromise.reject(error);
                    });
                return deferredPromise.promise;
            },
        postAction: function (name, id, action, newData) {
                $log.debug("adding new data " + angular.toJson(newData) + " to " + name + '/' + id + '/' + action);
                var deferredPromise = $q.defer();
                $http({
                    method: 'POST',
                    url: url+name+'/'+id+'/'+action,
                    data: newData
                })
                    .then(function (response) {
                        $log.debug("added new data to ..." + name + '/' + id + '/' + action);
                        deferredPromise.resolve(response);
                    },
                    function (error) {
                        $log.error("error adding new data to table " + name + '/' + id + '/' + action);
                        deferredPromise.reject(error);
                    });
                return deferredPromise.promise;
            },
        put: function (name, newData) {
                $log.debug("adding new data " + angular.toJson(newData) + " to " + name);
                var deferredPromise = $q.defer();
                $http({
                    method: 'PUT',
                    url: url+name,
                    data: newData
                })
                    .then(function (response) {
                        $log.debug("added new data to ..." + name);
                        deferredPromise.resolve(response);
                    },
                    function (error) {
                        $log.error("error adding new data to table " + name);
                        deferredPromise.reject(error);
                    });
                return deferredPromise.promise;
            },
        delete: function (name) {
                $log.debug("getting list of " + name);
                var deferredPromise = $q.defer();
                $http({
                    method: 'DELETE',
                    url: url+name
                })
                    .then(function (response) {
                        $log.debug("response received for " + name);
                        deferredPromise.resolve(response);

                    },
                    function (error) {
                        $log.error("error deleting " + name);
                        deferredPromise.reject(error);
                    });
                return deferredPromise.promise;
            },
    };
    return services;
}]);