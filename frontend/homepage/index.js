let url = window.backend_url;
// console.log(url)
(() => {
    angular.module('app', ['ui.router', 'gridster', 'ui.calendar', 'ui.calendar', 'ui.bootstrap']);
})();
(() => {
    angular.module('app')
        .controller('MainController', function ($window) {
            if (sessionStorage.length < 2) {
                $window.location = "../login/index.html"
            }
            let main = this;

            // control the side nav-bar

            if ($window.screen.width >= 900) {
                angular.element(document.querySelector('#mySidenav')).addClass('open_state')
                angular.element(document.querySelector('#main__section')).addClass('main__section--content')
            }
            main.toggleSideNavbar = () => {
                let sideNavbar = angular.element(document.querySelector('#mySidenav'))
                if (sideNavbar.hasClass('open_state')) {
                    sideNavbar.removeClass('open_state');
                    sideNavbar.addClass('close_state');
                    angular.element(document.querySelector('#main__section')).removeClass('main__section--content')
                } else {
                    sideNavbar.removeClass('close_state')
                    sideNavbar.addClass('open_state')
                    angular.element(document.querySelector('#main__section')).addClass('main__section--content')

                }
            }
            // saving user details from sessionStorage to the conteoller's instance
            main.user = {}
            main.user.name = sessionStorage.name;
            main.user.lib_id = sessionStorage.lib_id;
            console.log(main)

            // gridster 
            main.templates = ["template1", "template2", "template3"]
            main.standardItems = [
                { sizeX: 6, sizeY: 2, row: 0, col: 0 },//template 1(attendance)
                { sizeX: 4, sizeY: 2, row: 2, col: 0 },//template 2()
                // { sizeX: 2, sizeY: 2, row: 3, col: 4 },
            ];
            main.gridsterOpts = {
                // columns: 6, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [15, 15], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid
                sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                isMobile: false, // stacks the grid items if true
                mobileBreakPoint: 700, // if the screen is not wider that this, remove the grid layout and stack the items
                mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
                minColumns: 1, // the minimum columns the grid must have
                minRows: 2, // the minimum height of the grid, in rows
                maxRows: 100,
                defaultSizeX: 2, // the default width of a gridster item, if not specifed
                defaultSizeY: 1, // the default height of a gridster item, if not specified
                minSizeX: 1, // minimum column width of an item
                maxSizeX: null, // maximum column width of an item
                minSizeY: 1, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                    enabled: false,
                    handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                    start: function (event, $element, widget) { }, // optional callback fired when resize is started,
                    resize: function (event, $element, widget) { }, // optional callback fired when item is resized,
                    stop: function (event, $element, widget) { } // optional callback fired when item is finished resizing
                },
                draggable: {
                    enabled: true, // whether dragging items is supported
                    // handle: '.my-class', // optional selector for drag handle
                    start: function (event, $element, widget) { }, // optional callback fired when drag is started,
                    drag: function (event, $element, widget) { }, // optional callback fired when item is moved,
                    stop: function (event, $element, widget) { } // optional callback fired when item is finished dragging
                }
            };
        })
})();
// template 1 controller => Attendance
(() => {
    angular.module('app')
        .controller('template1Controller', function ($http) {
            let temp1Ctrl = this;
            console.log(url)

            $http({
                method: "POST",
                url: url + 'get_attendance/',
                data: {
                    lib_id: sessionStorage.lib_id
                }
            })
                .then(
                    success = (response) => {
                        // console.log(response.data)
                        temp1Ctrl.attendance_data = [];
                        let chart_data = [];

                        for (let x = 0; x < response.data.length; x += 1) {
                            temp1Ctrl.attendance_data.push(response.data[x])
                            chart_data.push(response.data[x])
                        }
                        // console.log(response.data)

                        // console.log(temp1Ctrl.attendance_data)
                        let total_present_percentage = 0;
                        for (let x = 0; x < chart_data.length; x += 1) {
                            total_present_percentage += Number(chart_data[x].attendance_percentage);
                        }
                        temp1Ctrl.total_present_percentage = total_present_percentage;
                        // console.log(chart_data)
                        chart_data.push({
                            attendance_type: 'ABSENT',
                            attendance_percentage: String(100 - total_present_percentage)
                        })

                        let x = 0;
                        let myChartLabels = [];
                        let myChartPercentage = [];
                        for (x = 0; x < chart_data.length; x += 1) {
                            myChartLabels.push(chart_data[x].attendance_type);
                            myChartPercentage.push(chart_data[x].attendance_percentage)
                        }
                        // myChartLabels.push('Absent');

                        makeChart(myChartLabels, myChartPercentage);
                        // console.log(myChartLabels)
                    },
                    failure = (response) => {
                        console.log(response.data)
                    }
                )

            makeChart = function (myChartLabels, myChartPercentage) {
                var ctx = document.getElementById("myChart").getContext("2d");
                var myDoughnutChart = new Chart(ctx, {
                    type: "doughnut",
                    data: {

                        labels: myChartLabels,
                        datasets: [
                            {
                                label: "# of Votes",
                                data: myChartPercentage,
                                backgroundColor: [
                                    'rgba(54, 162, 235, 0.6)',
                                    "rgba(75, 192, 192, 0.6)",
                                    'rgba(255, 159, 64, 0.6)',
                                    "rgba(255, 99, 132, 0.6)",

                                ],
                                borderColor: [
                                    'rgba(54, 162, 235, 1)',
                                    "rgba(75, 192, 192, 1)",
                                    'rgba(255, 159, 64, 1)',
                                    "rgba(255, 99, 132, 1)",
                                ],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                    },
                });
            }
            console.log("template1")
        })
})();

// template 2 controller
(() => {
    angular.module('app')
        .controller('template2Controller', function ($scope, $compile, $timeout, uiCalendarConfig, $http, $window) {
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            /* event source that pulls from google.com */
            $scope.eventSource = {
                url: "http://www.google.com/calendar/feeds/indian__en%40holiday.calendar.google.com/public/basic",
                // className: 'gcal-event',           // an option!,
                currentTimezone: 'India', // an option!
                googleCalendarApiKey: 'AIzaSyCc5LZyMQ2pBB1dAJerfliEEu0P8hMUVwg'
            };
            /* event source that contains custom events on the scope */
            $scope.events = [];
            /* event source that calls a function on every view switch */
            $scope.eventsF = function (start, end, timezone, callback) {
                var s = new Date(start).getTime() / 1000;
                var e = new Date(end).getTime() / 1000;
                var m = new Date(start).getMonth();
                var events = [{ title: 'Feed Me ' + m, start: s + (50000), end: s + (100000), allDay: false, className: ['customFeed'] }];
                callback(events);
            };

            $scope.calEventsExt = {
                color: '#f00',
                textColor: 'yellow',
                events: []
            };

            $scope.eventRender = function (event, element, view) {
                element.attr({
                    'tooltip': event.title,
                    'tooltip-append-to-body': true
                });
                $compile(element)($scope);
            };
            /* config object */
            $scope.uiConfig = {
                calendar: {
                    height: 455,
                    editable: false,
                    header: {
                        left: 'title',
                        center: '',
                        right: 'today prev,next'
                    },
                    eventRender: $scope.eventRender,
                }
            };

            /* event sources array*/
            // $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
            // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
            // $scope.eventSources = [getEvents];
            $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
            console.log("template2");

            // to load the calendar 
            $timeout(() => { jQuery('.fc-today-button').click(); console.log('calendar loded'); }, 500)
            // (() => { $('.fc-today-button').click(); }, 2000)();
            // setInterval(function () { $('.fc-today-button').click(); }, 1000);
            // today()
            //  fc-button fc-state-default fc-corner-left fc-corner-right fc-today-button
        })
})();

(() => { })();


(() => {
    angular.module('app')
        .controller('template3Controller', function ($http) {
            let temp3Ctrl = this;
            console.log("template3")
        })
})();
(() => { })();


// UI.Routing 

(() => {
    angular.module('app')
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('dashboard', {
                    url: '/dashboard',
                    views: {
                        'template1': {
                            templateUrl: './templates/template1.html',
                            controller: 'template1Controller',
                            controllerAs: 'temp1Ctrl'
                        },
                        'template2': {
                            templateUrl: './templates/template2.html',
                            controller: 'template2Controller'
                            // controllerAs: 'temp2Ctrl'
                        },
                        'template3': {
                            templateUrl: './templates/template3.html',
                            controller: 'template3Controller',
                            controllerAs: 'temp3Ctrl'
                        }
                    }
                })
            $urlRouterProvider.otherwise('/dashboard');
        })
})();
(() => { })();
(() => { })();
(() => { })();
(() => { })();
(() => { })();
(() => { })();
(() => { })();

