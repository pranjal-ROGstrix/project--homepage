let url = window.backend_url;
// console.log(url)
(() => {
    angular.module('app', ['ui.router', 'gridster', 'ui.calendar', 'ui.calendar', 'ui.bootstrap']);
})();
(() => {
    angular.module('app')
        .controller('MainController', function ($window, $timeout) {
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
            "template1", "template2", "template3", "template4",
                // gridster 
                main.templates = ["template1", "template2", "template3", "template4", "template5"]
            main.standardItems = [
                { sizeX: 6, sizeY: 2, row: 0, col: 0 },//template 1(attendance)
                { sizeX: 4, sizeY: 2, row: 2, col: 0 },//template 2(calendar)
                { sizeX: 2, sizeY: 2, row: 2, col: 4 },//template 3(birthday)
                { sizeX: 3, sizeY: 2, row: 4, col: 0 },//template 4(marks)
                { sizeX: 3, sizeY: 2, row: 4, col: 3 },//template 5(timetable)

            ];
            main.gridsterOpts = {
                columns: 6, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [20, 20], // the pixel distance between each widget
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
            main.enable_disable = "Enable";
            main.enable_disable_counter = 1;
            main.darkMode = () => {
                if (main.enable_disable_counter % 2 == 0) {
                    main.enable_disable = "Enable";
                }
                else {
                    main.enable_disable = "Disable";
                }
                main.enable_disable_counter += 1;
                document.body.classList.toggle("light");
                // main.enable_disable = "Disable";
                (() => {
                    document.body.classList.add('document_transition');
                    console.log("Toggling")
                    $timeout(() => {
                        document.body.classList.remove('document_transition');
                    }, 1100)
                })()
            }
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
                        // #004c6d
                        // #00628e
                        // #0079b0
                        // #0090d4
                        // #00a8f9
                        labels: myChartLabels,
                        datasets: [
                            {
                                label: "# of Votes",
                                data: myChartPercentage,
                                backgroundColor: [
                                    "rgba(54, 162, 235, 0.8)",
                                    "rgba(255, 206, 86, 0.6)",
                                    "rgba(75, 192, 192, 0.6)",
                                    "rgba(255, 99, 132, 0.6)",

                                    // "rgba(153, 102, 255, 0.6)",

                                ],
                                borderColor: [
                                    "rgba(54, 162, 235, 1)",
                                    "rgba(255, 206, 86, 1)",
                                    "rgba(75, 192, 192, 1)",
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
            $timeout(() => { jQuery('.fc-today-button').click(); console.log('calendar loaded'); }, 500)
            // (() => { $('.fc-today-button').click(); }, 2000)();
            // setInterval(function () { $('.fc-today-button').click(); }, 1000);
            // today()
            //  fc-button fc-state-default fc-corner-left fc-corner-right fc-today-button
        })
})();

(() => { })();


(() => {
    angular.module('app')
        .controller('template3Controller', function ($http, $timeout) {
            let temp3Ctrl = this;
            // 2020-08-12 12:14:25.381410
            // new Date(year, month[, date[, hours[, minutes[, seconds[, milliseconds]]]]]);
            $http({
                method: 'POST',
                url: url + 'get_birthdays/',
                data: {
                    date: "2020-08-12 12:14:25.381410"
                }
            })
                .then(
                    mysuccess = (response) => {
                        console.log(response.data)
                        temp3Ctrl.birthdays = response.data;
                    },
                    myerror = (response) => {
                        console.log(response.data)
                    }
                )
            // $timeout(() => {
            //     $('.slimScrollDiv').slimScroll({
            //         height: '420px',
            //         railVisible: false,
            //         alwaysVisible: false,
            //         position: 'right',
            //         // wheelStep: 50,
            //     });
            // }, 50);
            console.log("template3")
        })
})();
(() => {
    angular.module('app')
        .controller('template4Controller', function ($http, $timeout) {
            let temp4Ctrl = this;
            $http({
                method: "POST",
                url: url + "get_marks/",
                data: {
                    "lib_id": sessionStorage.lib_id
                }
            })
                .then(
                    success = (response) => {
                        console.log(response.data)
                        temp4Ctrl.marksData = response.data;
                        let marks_value = [];
                        let marks_labels = [];
                        for (let x = 0; x < temp4Ctrl.marksData.length; x++) {
                            marks_value.push(temp4Ctrl.marksData[x].marks)
                            marks_labels.push(temp4Ctrl.marksData[x].subject)
                        }
                        // console.log(marks_value + marks_labels)
                        makechart(marks_value, marks_labels)
                    },
                    error = (response) => {
                        console.log(response.data)
                    }
                )
            makechart = (marks_value, marks_labels) => {
                var ctxx = document.getElementById("myChart1").getContext("2d");
                var myChart = new Chart(ctxx, {
                    type: "bar",
                    data: {
                        labels: marks_labels,
                        datasets: [
                            {
                                label: "Score",
                                data: marks_value,
                                backgroundColor: [
                                    "rgba(255, 99, 132, 0.8)",
                                    "rgba(54, 162, 235, 0.8)",
                                    "rgba(255, 206, 86, 0.8)",
                                    "rgba(75, 192, 192, 0.8)",
                                    "rgba(153, 102, 255, 0.8)",
                                    "rgba(255, 159, 64, 0.8)",
                                ],
                                borderColor: [
                                    "rgba(255, 99, 132, 1)",
                                    "rgba(54, 162, 235, 1)",
                                    "rgba(255, 206, 86, 1)",
                                    "rgba(75, 192, 192, 1)",
                                    "rgba(153, 102, 255, 1)",
                                    "rgba(255, 159, 64, 1)",
                                ],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        max: 100,
                                        min: 0,
                                        id: "hello"
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'MARKS'
                                    }
                                },
                            ],

                            xAxes: [
                                {
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'SUBJECTS'
                                    }
                                }
                            ]
                        },
                    },
                });
            };


        })
    console.log("tremplate4")
})();


(() => {
    angular.module('app')
        .controller('template5Controller', function ($http) {
            let temp5Ctrl = this;
            $http({
                method: 'GET',
                url: url + "get_timetable"
            })
                .then(
                    success = (response) => {
                        console.log(response.data)
                        temp5Ctrl.timetable = response.data;
                    },
                    error = (response) => {
                        console.log(response.data)
                    }
                )
            console.log("tremplate5")
        })
})();


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
                        },
                        'template4': {
                            templateUrl: './templates/template4.html',
                            controller: 'template4Controller',
                            controllerAs: 'temp4Ctrl'
                        },
                        'template5': {
                            templateUrl: './templates/template5.html',
                            controller: 'template5Controller',
                            controllerAs: 'temp5Ctrl'
                        }
                    }
                })
            $urlRouterProvider.otherwise('/dashboard');
        })
})();
(() => { })();
