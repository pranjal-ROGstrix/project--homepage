(() => {
    angular.module('app', ['ui.router', 'gridster', 'ui.calendar', 'ui.calendar', 'ui.bootstrap']);
})();
(() => {
    angular.module('app')
        .controller('MainController', function ($window) {
            let main = this;

            // control the side nav-bar

            if ($window.screen.width >= 900) {
                angular.element(document.querySelector('#mySidenav')).addClass('open_state')
            }
            main.toggleSideNavbar = () => {
                let sideNavbar = angular.element(document.querySelector('#mySidenav'))
                if (sideNavbar.hasClass('open_state')) {
                    sideNavbar.removeClass('open_state');
                    sideNavbar.addClass('close_state');
                } else {
                    sideNavbar.removeClass('close_state')
                    sideNavbar.addClass('open_state')
                }
            }

            // main.openNav = function () {
            //     angular.element(document.querySelector('#mySidenav')).addClass('open_state')
            //     // document.getElementById("mySidenav").style.width = "250px";
            // }

            // main.closeNav = function () {
            //     document.getElementById("mySidenav").style.width = "0";
            // }
        })
})();
(() => { })();
(() => { })();
(() => { })();
(() => { })();
(() => { })();
(() => { })();
(() => { })();
(() => { })();
(() => { })();
(() => { })();
(() => { })();