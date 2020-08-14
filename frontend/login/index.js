let url = window.backend_url;
(() => {
    angular.module('app', []);

})();
(() => {
    angular.module('app')
        .controller('MainController', function ($http, $window) {
            let main = this;

            // console.log(main.lib_id)
            main.submit = () => {
                if (isNaN(main.lib_id.slice(4, 6))) {
                    main.lib_id = main.lib_id.slice(0, 4) + main.lib_id.slice(4, 6).toLowerCase() + main.lib_id.slice(6,);
                    console.log(main.lib_id)
                }
                // http://127.0.0.1:8000/student/login/
                $http({
                    method: 'POST',
                    url: url + 'login/',
                    data: {
                        lib_id: main.lib_id,
                        password: main.password
                    }
                })
                    .then(
                        success = (response) => {
                            console.log(response.data);
                            if (response.data == "invalid") {
                                angular.element(document.querySelector('#alert')).removeClass('ng-hide');
                                angular.element(document.querySelector('#alert')).addClass('ng-show');
                            } else {
                                sessionStorage.lib_id = response.data[0].lib_id;
                                sessionStorage.name = response.data[0].name;
                                $window.location = "../homepage/index.html"
                            }
                        },
                        error = (response) => {
                            console.log(response.data);
                            alert('try again later')
                        }
                    )
            }
        });
})();

