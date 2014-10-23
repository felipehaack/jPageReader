var jMangaPageViewerUtility = {
    screen: {
        screenWidth: 0,
        screenHeight: 0
    },
    hasWebKit: "",
    touchOrClick: {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
    },
    pageX: '',
    pageY: '',
    pageEndX: '',
    pageEndY: '',
    setTouchOrClick: function() {

        var t = "ontouchstart" in document.documentElement;
        if (t) {
            jMangaPageViewerUtility.touchOrClick.start = "touchstart";
            jMangaPageViewerUtility.touchOrClick.move = "touchmove";
            jMangaPageViewerUtility.touchOrClick.end = "touchend"
        }
    },
    setScreenWidthHeight: function() {

        jMangaPageViewerUtility.screen.screenWidth = $(window).width();
        jMangaPageViewerUtility.screen.screenHeight = $(window).height();

        $('body').width(jMangaPageViewerUtility.screen.screenWidth);
        $('body').height(jMangaPageViewerUtility.screen.screenHeight);
    },
    setHasWebKit: function() {

        var t = 'WebkitAppearance' in document.documentElement.style;
        if (t) {
            jMangaPageViewerUtility.hasWebKit = "-webkit-"
        }
    },
    setPageEndXY: function() {

        if (jMangaPageViewerUtility.touchOrClick.start == 'touchstart') {

            jMangaPageViewerUtility.pageEndX = function(e) {

                return e.originalEvent.changedTouches[0].pageX;
            };

            jMangaPageViewerUtility.pageEndY = function(e) {

                return e.originalEvent.changedTouches[0].pageY;
            };
        } else {

            jMangaPageViewerUtility.pageEndX = function(e) {

                return e.pageX;
            };

            jMangaPageViewerUtility.pageEndY = function(e) {

                return e.pageY;
            };
        }
    },
    setPageXY: function() {

        if (jMangaPageViewerUtility.touchOrClick.start == 'touchstart') {

            jMangaPageViewerUtility.pageX = function(e, p) {

                return e.originalEvent.touches.length > p ? e.originalEvent.touches[p].pageX : -1;
            };

            jMangaPageViewerUtility.pageY = function(e, p) {

                return e.originalEvent.touches.length > p ? e.originalEvent.touches[p].pageY : -1;
            };
        } else {

            jMangaPageViewerUtility.pageX = function(e) {

                return e.pageX;
            };

            jMangaPageViewerUtility.pageY = function(e) {

                return e.pageY;
            };
        }
    },
    setWidthForcePage: function() {

        var border = 30;

        if (jMangaPageViewerUtility.screen.screenWidth < 480) {
            jMangaPageViewer.moduleManageGestures.force.width = 50;
            border = 30;
        } else
        if (jMangaPageViewerUtility.screen.screenWidth < 720) {
            jMangaPageViewer.moduleManageGestures.force.width = 60;
            border = 40;
        } else
        if (jMangaPageViewerUtility.screen.screenWidth < 1024) {
            jMangaPageViewer.moduleManageGestures.force.width = 100;
            border = 50;
        } else
        if (jMangaPageViewerUtility.screen.screenWidth >= 1024) {
            jMangaPageViewer.moduleManageGestures.force.width = 100;
            border = 60;
        }

        $('.jMangaPageViewerNext, .jMangaPageViewerPrevious').width(jMangaPageViewer.moduleManageGestures.force.width);
        $('.jMangaPageViewerPreviousArrow').css({'border-top': border + 'px solid transparent', 'border-bottom': border + 'px solid transparent', 'border-right': border + 'px solid black'});
        $('.jMangaPageViewerNextArrow').css({'border-top': border + 'px solid transparent', 'border-bottom': border + 'px solid transparent', 'border-left': border + 'px solid black'});
    },
    isDevice: {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        mobile: function() {
            return (jMangaPageViewerUtility.isDevice.Android() || jMangaPageViewerUtility.isDevice.BlackBerry() || jMangaPageViewerUtility.isDevice.iOS() || jMangaPageViewerUtility.isDevice.Opera() || jMangaPageViewerUtility.isDevice.Windows());
        }
    },
    beforeCloseBrowserTab: function() {

        if (jMangaPageViewerUtility.touchOrClick.start == 'mousedown') {

            $(window).bind('beforeunload', function(e) {

                var e = e || window.event;

                jMangaPageViewerUtility.storage.save();

                if (e)
                    e.returnValue = 'Are you sure want to leave?';

                return 'Are you sure want to leave?';
            });
        }
    },
    storage: {
        isStorage: function() {

            if (typeof (Storage) != "undefined")
                return true;
            else
                return false;
        },
        load: function() {

            if (jMangaPageViewerUtility.storage.isStorage())
                if (typeof (localStorage.nameManga) != "undefined") {
                    if (localStorage.nameManga == jMangaPageViewer.moduleImage.nameManga)
                        jMangaPageViewer.moduleImage.current.position = parseInt(localStorage.imageCurrentPosition);
                } else
                    localStorage.clear();
        },
        save: function() {

            if (jMangaPageViewerUtility.storage.isStorage()) {
                
                localStorage.nameManga = jMangaPageViewer.moduleImage.nameManga;
                localStorage.imageCurrentPosition = jMangaPageViewer.moduleImage.current.position;
            }
        }
    },
    initDivMain: function() {

        var containerTouch = document.createElement('div');
        containerTouch.id = jMangaPageViewer.containerGestures.replace('#', '');
        document.getElementsByTagName('body')[0].appendChild(containerTouch);
    },
    init: function() {

        jMangaPageViewerUtility.initDivMain();
        jMangaPageViewerUtility.setHasWebKit();
        jMangaPageViewerUtility.setTouchOrClick();
        jMangaPageViewerUtility.setScreenWidthHeight();
        jMangaPageViewerUtility.setWidthForcePage();
        jMangaPageViewerUtility.setPageXY();
        jMangaPageViewerUtility.setPageEndXY();
        //jMangaPageViewerUtility.beforeCloseBrowserTab();
        //jMangaPageViewerUtility.storage.load();
    }
};

var jMangaPageViewer = {
    containerGestures: '#jMangaPageViewerTouch',
    containerImgs: '#jMangaPageViewerImage',
    containerLoading: '#jMangaPageViewerLoading',
    moduleManageGestures: {
        event: '',
        locks: {
            start: false,
            move: false,
            end: false,
            scroll: false,
            lockAll: function() {

                var max = 3;
                var now = 0;
                for (var lock in jMangaPageViewer.moduleManageGestures.locks) {

                    if (now <= max)
                        jMangaPageViewer.moduleManageGestures.locks[lock] = true;
                    else
                        break;

                    now++;
                }
            },
            unlockAll: function() {

                var max = 3;
                var now = 0;
                for (var lock in jMangaPageViewer.moduleManageGestures.locks) {

                    if (now <= max)
                        jMangaPageViewer.moduleManageGestures.locks[lock] = false;
                    else
                        break;

                    now++;
                }
            },
            lockSpecific: function(who) {

                if (who.constructor == Array)
                    for (var i = 0; i < who.length; ++i)
                        jMangaPageViewer.moduleManageGestures.locks[who[i]] = true;
                else
                    jMangaPageViewer.moduleManageGestures.locks[who] = true;
            },
            unlockSpecific: function(who) {

                if (who.constructor == Array)
                    for (var i = 0; i < who.length; ++i)
                        jMangaPageViewer.moduleManageGestures.locks[who[i]] = false;
                else
                    jMangaPageViewer.moduleManageGestures.locks[who] = false;
            }
        },
        gestures: {
            startmove: false,
            move: false,
            doubletap: false,
            pinch: false,
            translate: {
                before: false,
                after: false
            },
            force: {
                before: false,
                after: false
            }
        },
        force: {
            times: 0,
            width: 0,
            validate: function(x) {

                if (x == jMangaPageViewer.moduleMove.x) {

                    if (x >= (jMangaPageViewerUtility.screen.screenWidth - jMangaPageViewer.moduleManageGestures.force.width) &&
                            jMangaPageViewer.moduleImage.current.position < jMangaPageViewer.moduleImage.images.length - 1) {

                        jMangaPageViewer.moduleManageGestures.gestures.force.before = false;
                        return (jMangaPageViewer.moduleManageGestures.gestures.force.after = true);
                    } else {

                        if (x <= jMangaPageViewer.moduleManageGestures.force.width && jMangaPageViewer.moduleImage.current.position - 1 >= 0) {

                            jMangaPageViewer.moduleManageGestures.gestures.force.after = false;
                            return (jMangaPageViewer.moduleManageGestures.gestures.force.before = true);
                        }
                    }
                }

                jMangaPageViewer.moduleManageGestures.gestures.force.before = jMangaPageViewer.moduleManageGestures.gestures.force.after = false;

                return false;
            }
        },
        doubletap: {
            timestamp: 200,
            controller: false,
            exController: false,
            reset: function() {

                jMangaPageViewer.moduleManageGestures.doubletap.controller = false;
                jMangaPageViewer.moduleManageGestures.doubletap.exController = false;
            },
            disable: function() {

                if (!jMangaPageViewer.moduleManageGestures.doubletap.exController) {

                    jMangaPageViewer.moduleManageGestures.doubletap.exController = true;

                    window.setTimeout(function() {

                        jMangaPageViewer.moduleManageGestures.doubletap.exController = false;
                        jMangaPageViewer.moduleManageGestures.doubletap.controller = false;

                        if (jMangaPageViewer.moduleManageGestures.force.times == 1) {

                            if (jMangaPageViewer.moduleManageGestures.gestures.force.after || jMangaPageViewer.moduleManageGestures.gestures.force.before)
                                jMangaPageViewer.moduleForcePage.init();

                            jMangaPageViewer.moduleManageGestures.force.times = 0;
                        }
                    }, jMangaPageViewer.moduleManageGestures.doubletap.timestamp);
                }
            },
            validate: function(x, y) {

                if (jMangaPageViewer.moduleManageGestures.doubletap.controller) {

                    jMangaPageViewer.moduleManageGestures.force.times = 0;
                    jMangaPageViewer.moduleManageGestures.doubletap.reset();
                    jMangaPageViewer.moduleDoubleTap.init(x, y);
                } else {

                    if (!jMangaPageViewer.moduleManageGestures.doubletap.controller && !jMangaPageViewer.moduleManageGestures.doubletap.exController) {

                        jMangaPageViewer.moduleManageGestures.force.times++;
                        jMangaPageViewer.moduleManageGestures.force.validate(x);

                        jMangaPageViewer.moduleManageGestures.doubletap.controller = true;
                        jMangaPageViewer.moduleManageGestures.doubletap.disable();
                    }
                }
            }
        },
        init: function() {

            $(jMangaPageViewer.containerGestures).bind(jMangaPageViewerUtility.touchOrClick.start, function(e) {

                if (!jMangaPageViewer.moduleManageGestures.locks.start) {

                    e.preventDefault();

                    if (jMangaPageViewerUtility.pageX(e, 1) < 0 || jMangaPageViewerUtility.touchOrClick.start == 'mousedown') {

                        jMangaPageViewer.moduleManageGestures.gestures.startmove = true;

                        jMangaPageViewer.moduleMove.start(jMangaPageViewerUtility.pageX(e, 0), jMangaPageViewerUtility.pageY(e, 0));
                    } else {

                        if (!jMangaPageViewer.moduleManageGestures.gestures.pinch) {

                            jMangaPageViewer.moduleManageGestures.gestures.startmove = false;
                            jMangaPageViewer.moduleManageGestures.gestures.move = false;

                            jMangaPageViewer.moduleManageGestures.gestures.pinch = true;

                            jMangaPageViewer.moduleManageGestures.doubletap.reset();

                            jMangaPageViewer.modulePinch.start(jMangaPageViewerUtility.pageX(e, 0), jMangaPageViewerUtility.pageX(e, 1), jMangaPageViewerUtility.pageY(e, 0), jMangaPageViewerUtility.pageY(e, 1));
                        }
                    }
                }
            });

            $(jMangaPageViewer.containerGestures).bind(jMangaPageViewerUtility.touchOrClick.move, function(e) {

                if (!jMangaPageViewer.moduleManageGestures.locks.move) {

                    e.preventDefault();

                    if (jMangaPageViewer.moduleManageGestures.gestures.startmove) {

                        if (jMangaPageViewer.moduleManageGestures.gestures.move)
                            jMangaPageViewer.moduleMove.move(jMangaPageViewerUtility.pageX(e, 0), jMangaPageViewerUtility.pageY(e, 0));
                        else {

                            var x = jMangaPageViewerUtility.pageX(e, 0);
                            var xN = jMangaPageViewer.moduleMove.x - x;

                            var y = jMangaPageViewerUtility.pageY(e, 0);
                            var yN = jMangaPageViewer.moduleMove.y - y;

                            if (xN <= -8 || xN >= 8 || yN <= -8 || yN >= 8)
                                jMangaPageViewer.moduleManageGestures.gestures.move = true;
                        }
                    } else {

                        if (jMangaPageViewer.moduleManageGestures.gestures.pinch)
                            jMangaPageViewer.modulePinch.move(jMangaPageViewerUtility.pageX(e, 0), jMangaPageViewerUtility.pageX(e, 1), jMangaPageViewerUtility.pageY(e, 0), jMangaPageViewerUtility.pageY(e, 1));
                    }
                }
            });

            $(jMangaPageViewer.containerGestures).bind(jMangaPageViewerUtility.touchOrClick.end, function(e) {

                if (!jMangaPageViewer.moduleManageGestures.locks.end) {

                    if (!jMangaPageViewer.moduleManageGestures.gestures.move && !jMangaPageViewer.moduleManageGestures.gestures.pinch)
                        jMangaPageViewer.moduleManageGestures.doubletap.validate(jMangaPageViewerUtility.pageEndX(e), jMangaPageViewerUtility.pageEndY(e));

                    if (jMangaPageViewerUtility.pageX(e, 1) < 0)
                        jMangaPageViewer.moduleManageGestures.gestures.pinch = false;

                    if (jMangaPageViewer.moduleManageGestures.gestures.startmove) {

                        jMangaPageViewer.moduleManageGestures.gestures.startmove = false;
                        jMangaPageViewer.moduleManageGestures.gestures.move = false;
                    }
                }
            });

            if (jMangaPageViewerUtility.touchOrClick.start === 'mousedown')
                if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
                    document.getElementById(jMangaPageViewer.containerGestures.replace('#', '')).addEventListener("DOMMouseScroll", jMangaPageViewer.moduleMouseWheel.init, false);
                else
                    document.getElementById(jMangaPageViewer.containerGestures.replace('#', '')).addEventListener("mousewheel", jMangaPageViewer.moduleMouseWheel.init, false);
        }
    },
    moduleMove: {
        x: 0,
        y: 0,
        time: '',
        limitWidth: 0,
        limitHeight: 0,
        lock: false,
        move: function(x, y) {

            var newX = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].x + (x - jMangaPageViewer.moduleMove.x);
            var newY = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].y + (y - jMangaPageViewer.moduleMove.y);
            var flag = false;

            if (newX < 0 && (newX + jMangaPageViewer.moduleMove.limitWidth) > jMangaPageViewerUtility.screen.screenWidth) {

                flag = true;
                jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].x = newX;
            }

            if (newY < 0 && (newY + jMangaPageViewer.moduleMove.limitHeight) > jMangaPageViewerUtility.screen.screenHeight) {

                flag = true;
                jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].y = newY;
            }

            jMangaPageViewer.moduleMove.x = x;
            jMangaPageViewer.moduleMove.y = y;

            if (flag)
                jMangaPageViewer.moduleTransformation.transformationGeneric(jMangaPageViewer.moduleImage.current.get.imageWithDiv());
        },
        start: function(x, y) {

            jMangaPageViewer.moduleCss.move();

            //jMangaPageViewer.moduleMove.time = new Date().getTime();
            jMangaPageViewer.moduleMove.x = x;
            jMangaPageViewer.moduleMove.y = y;
            jMangaPageViewer.moduleMove.limitWidth = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].widthInitial * jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent;
            jMangaPageViewer.moduleMove.limitHeight = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].heightInitial * jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent;
        }
    },
    modulePinch: {
        cpX: 0,
        cpY: 0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        dist: 0,
        zoom: 0.05,
        width: 8,
        update: function(x1, x2, y1, y2, dist) {

            jMangaPageViewer.modulePinch.x1 = x1;
            jMangaPageViewer.modulePinch.x2 = x2;
            jMangaPageViewer.modulePinch.y1 = y1;
            jMangaPageViewer.modulePinch.y2 = y2;
            jMangaPageViewer.modulePinch.dist = dist;
        },
        pinchOut: function(s) {

            var c = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent - s;

            if (c >= jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleInitial) {

                jMangaPageViewer.moduleScale.scale(jMangaPageViewer.modulePinch.cpX, jMangaPageViewer.modulePinch.cpY, -s);
            } else {

                jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleInitial;
                jMangaPageViewer.moduleScale.scale(jMangaPageViewer.modulePinch.cpX, jMangaPageViewer.modulePinch.cpY);
            }
        },
        pinchIn: function(s) {

            var c = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent + s;

            if (c <= jMangaPageViewer.moduleDoubleTap.vScales[jMangaPageViewer.moduleDoubleTap.vScales.length - 1])
                jMangaPageViewer.moduleScale.scale(jMangaPageViewer.modulePinch.cpX, jMangaPageViewer.modulePinch.cpY, s);
        },
        move: function(x1, x2, y1, y2) {

            var dist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            var displ = dist - jMangaPageViewer.modulePinch.dist;

            if (displ > jMangaPageViewer.modulePinch.width || displ < -jMangaPageViewer.modulePinch.width) {

                if (dist > jMangaPageViewer.modulePinch.dist)
                    jMangaPageViewer.modulePinch.pinchIn(jMangaPageViewer.modulePinch.zoom);
                else
                    jMangaPageViewer.modulePinch.pinchOut(jMangaPageViewer.modulePinch.zoom);

                jMangaPageViewer.modulePinch.update(x1, x2, y1, y2, dist);
            }
        },
        start: function(x1, x2, y1, y2) {

            jMangaPageViewer.moduleCss.pinch();

            jMangaPageViewer.modulePinch.x1 = x1;
            jMangaPageViewer.modulePinch.x2 = x2;

            jMangaPageViewer.modulePinch.y1 = y1;
            jMangaPageViewer.modulePinch.y2 = y2;

            jMangaPageViewer.modulePinch.dist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

            jMangaPageViewer.modulePinch.cpX = x1 < x2 ? ((x1 + x2) / 2) : ((x2 + x1) / 2);
            jMangaPageViewer.modulePinch.cpY = y1 < y2 ? ((y1 + y2) / 2) : ((y2 + y1) / 2);
        }
    },
    moduleMouseWheel: {
        init: function(e) {

            if (!jMangaPageViewer.moduleManageGestures.locks.scroll) {

                jMangaPageViewer.moduleCss.mousewheel();

                var delta = 0;
                if (Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) < 0)
                    delta = -0.1;
                else
                    delta = 0.1;

                var c = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent + delta;

                if (c >= jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleInitial && c <= jMangaPageViewer.moduleDoubleTap.vScales[jMangaPageViewer.moduleDoubleTap.vScales.length - 1])
                    jMangaPageViewer.moduleScale.scale(jMangaPageViewerUtility.pageX(e, 0), jMangaPageViewerUtility.pageY(e, 0), delta);
                else {

                    if (c < jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleInitial) {
                        jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleInitial;
                        jMangaPageViewer.moduleScale.scale(jMangaPageViewerUtility.pageX(e, 0), jMangaPageViewerUtility.pageY(e, 0));
                    }
                }
            }
        }
    },
    moduleDoubleTap: {
        vScales: [1, 2, 3.5],
        pCurrent: 0,
        zoom: 'in',
        staticScales: false,
        configureVScales: function() {

            if (!jMangaPageViewer.moduleDoubleTap.staticScales) {

                jMangaPageViewer.moduleDoubleTap.vScales = [];
                jMangaPageViewer.moduleDoubleTap.vScales[0] = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleInitial;

                jMangaPageViewer.moduleDoubleTap.vScales[1] = Math.max(jMangaPageViewerUtility.screen.screenWidth / jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].widthInitial, jMangaPageViewerUtility.screen.screenHeight / jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].heightInitial);

                jMangaPageViewer.moduleDoubleTap.vScales[1] = Math.max((jMangaPageViewerUtility.screen.screenWidth * 2) / jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].widthInitial, (jMangaPageViewerUtility.screen.screenHeight * 2) / jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].heightInitial);

                jMangaPageViewer.moduleDoubleTap.vScales[2] = Math.max((jMangaPageViewerUtility.screen.screenWidth * 3) / jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].widthInitial, (jMangaPageViewerUtility.screen.screenHeight * 3) / jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].heightInitial);
            }
        },
        chooseZoom: function() {

            if (jMangaPageViewer.moduleDoubleTap.pCurrent >= jMangaPageViewer.moduleDoubleTap.vScales.length - 1)
                jMangaPageViewer.moduleDoubleTap.zoom = 'out';
            else
            if (jMangaPageViewer.moduleDoubleTap.pCurrent <= 0)
                jMangaPageViewer.moduleDoubleTap.zoom = 'in';

            if (jMangaPageViewer.moduleDoubleTap.zoom == 'in')
                jMangaPageViewer.moduleDoubleTap.pCurrent++;
            else
                jMangaPageViewer.moduleDoubleTap.pCurrent--;
        },
        init: function(x, y) {

            jMangaPageViewer.moduleCss.doubletap();
            jMangaPageViewer.moduleDoubleTap.chooseZoom();
            jMangaPageViewer.moduleScale.scale(x, y, 0, 'doubletap');
        }
    },
    moduleForcePage: {
        old: '',
        timestamp: 400,
        releaseLocksForce: function() {

            jMangaPageViewer.moduleManageGestures.locks.unlockAll();
            jMangaPageViewer.moduleManageGestures.gestures.force.before = jMangaPageViewer.moduleManageGestures.gestures.force.after = false;
        },
        translate: function() {

            if (jMangaPageViewer.moduleManageGestures.gestures.force.after)
                jMangaPageViewer.moduleTransformation.parent.translateWidthPositive(jMangaPageViewer.moduleImage.current.position);
            else
                jMangaPageViewer.moduleTransformation.parent.translateWidthNegative(jMangaPageViewer.moduleImage.current.position);

            window.setTimeout(function() {

                $(jMangaPageViewer.moduleImage.current.get.imageWithDiv()).css('opacity', 1);

                jMangaPageViewer.moduleCss.force($(jMangaPageViewer.moduleImage.current.get.imageWithDiv()).parent());

                window.setTimeout(function() {

                    if (jMangaPageViewer.moduleManageGestures.gestures.force.after)
                        jMangaPageViewer.moduleTransformation.parent.translateWidthNegative(jMangaPageViewer.moduleForcePage.old);
                    else
                        jMangaPageViewer.moduleTransformation.parent.translateWidthPositive(jMangaPageViewer.moduleForcePage.old);

                    jMangaPageViewer.moduleTransformation.parent.center(jMangaPageViewer.moduleImage.current.position);

                    jMangaPageViewer.moduleDirectionsArrows.show();

                    window.setTimeout(function() {

                        jMangaPageViewer.moduleForcePage.releaseLocksForce();
                    }, jMangaPageViewer.moduleForcePage.timestamp);
                }, 33);
            }, 33);
        },
        choose: function() {

            jMangaPageViewer.moduleCss.force($(jMangaPageViewer.moduleImage.current.get.imageWithDiv()).parent());
            jMangaPageViewer.moduleForcePage.old = jMangaPageViewer.moduleImage.current.position;

            if (jMangaPageViewer.moduleManageGestures.gestures.force.after)
                jMangaPageViewer.moduleImage.current.position++;
            else
                jMangaPageViewer.moduleImage.current.position--;

            jMangaPageViewer.moduleImage.insert(jMangaPageViewer.moduleForcePage.translate);
        },
        init: function() {

            jMangaPageViewer.moduleManageGestures.locks.lockAll();
            jMangaPageViewer.moduleForcePage.choose();
        }
    },
    moduleRange: {
        max: 1,
        init: function() {

            if (jMangaPageViewerUtility.isDevice.mobile()) {

                if (jMangaPageViewerUtility.screen.screenWidth < 720)
                    jMangaPageViewer.moduleRange.max = 1;
                else
                if (jMangaPageViewerUtility.screen.screenWidth >= 720)
                    jMangaPageViewer.moduleRange.max = 2;
            } else
                jMangaPageViewer.moduleRange.max = 2;
        }
    },
    moduleScale: {
        lock: {
            lock: false,
            scale: 1
        },
        scale: function(pX, pY, sF, who) {

            var wN, hN, xN, yN;

            wN = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].widthInitial * jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent;
            hN = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].heightInitial * jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent;
            xN = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].x;
            yN = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].y;

            var wA, hA;

            if (typeof sF == 'undefined')
                sF = 0;

            switch (who) {

                case 'doubletap':
                    {

                        wA = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].widthInitial * jMangaPageViewer.moduleDoubleTap.vScales[jMangaPageViewer.moduleDoubleTap.pCurrent];
                        hA = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].heightInitial * jMangaPageViewer.moduleDoubleTap.vScales[jMangaPageViewer.moduleDoubleTap.pCurrent];

                        jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent = jMangaPageViewer.moduleDoubleTap.vScales[jMangaPageViewer.moduleDoubleTap.pCurrent];

                        break;
                    }

                default :
                    {

                        wA = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].widthInitial * (jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent + sF);
                        hA = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].heightInitial * (jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent + sF);
                        jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent = jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent + sF;

                        break;
                    }
            }

            var xNew, yNew;

            var fat1 = pX - xN;
            if (xN >= 0)
                fat1 = pX - xN;

            if (fat1 < 0 || fat1 > wN || wA < jMangaPageViewerUtility.screen.screenWidth)
                xNew = (jMangaPageViewerUtility.screen.screenWidth - wA) / 2;
            else {
                xNew = -(fat1 * (wA / wN)) + pX;

                var boundary = -(wA - jMangaPageViewerUtility.screen.screenWidth);
                if (xNew >= 0)
                    xNew = 0;
                else
                if (xNew < boundary)
                    xNew = boundary;
            }

            var fat2 = pY - yN;
            if (yN >= 0)
                fat2 = pY - yN;

            if (fat2 < 0 || fat2 > hN || hA < jMangaPageViewerUtility.screen.screenHeight)
                yNew = (jMangaPageViewerUtility.screen.screenHeight - hA) / 2;
            else {
                yNew = -(fat2 * (hA / hN)) + pY;

                var boundary = -(hA - jMangaPageViewerUtility.screen.screenHeight);
                if (yNew >= 0)
                    yNew = 0;
                else
                if (yNew < boundary)
                    yNew = boundary;
            }

            jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].x = xNew;
            jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].y = yNew;

            jMangaPageViewer.moduleTransformation.transformationGeneric(jMangaPageViewer.moduleImage.current.get.imageWithDiv());
        }
    },
    moduleTransformation: {
        transformationGenericWithPosition: function(t, p) {

            $(t).css(jMangaPageViewerUtility.hasWebKit + 'transform', 'translate3d(' + jMangaPageViewer.moduleImage.images[p].x.toFixed(2) + 'px, ' + jMangaPageViewer.moduleImage.images[p].y.toFixed(2) + 'px, 0) scale3d(' + jMangaPageViewer.moduleImage.images[p].scaleCurrent.toFixed(3) + ',  ' + jMangaPageViewer.moduleImage.images[p].scaleCurrent.toFixed(3) + ', 1)');
        },
        transformationGeneric: function(t) {

            $(t).css(jMangaPageViewerUtility.hasWebKit + 'transform', 'translate3d(' + jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].x.toFixed(2) + 'px, ' + jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].y.toFixed(2) + 'px, 0) scale3d(' + jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent.toFixed(3) + ',  ' + jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].scaleCurrent.toFixed(3) + ', 1)');
        },
        parent: {
            center: function(p) {

                $(jMangaPageViewer.moduleImage.another.imageWithDiv(p)).parent().css(jMangaPageViewerUtility.hasWebKit + 'transform', 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)');
            },
            translateWidthNegative: function(p) {

                $(jMangaPageViewer.moduleImage.another.imageWithDiv(p)).parent().css(jMangaPageViewerUtility.hasWebKit + 'transform', 'translate3d(' + -jMangaPageViewerUtility.screen.screenWidth + 'px, 0px, 0) scale3d(1, 1, 1)');
            },
            translateWidthPositive: function(p) {

                $(jMangaPageViewer.moduleImage.another.imageWithDiv(p)).parent().css(jMangaPageViewerUtility.hasWebKit + 'transform', 'translate3d(' + jMangaPageViewerUtility.screen.screenWidth + 'px, 0px, 0) scale3d(1, 1, 1)');
            }
        }
    },
    moduleCss: {
        doubletap: function() {

            $(jMangaPageViewer.moduleImage.current.get.imageWithDiv()).css(jMangaPageViewerUtility.hasWebKit + 'transition', 'all 0.3s ease');
        },
        mousewheel: function() {

            $(jMangaPageViewer.moduleImage.current.get.imageWithDiv()).css(jMangaPageViewerUtility.hasWebKit + 'transition', 'all 0.1s linear');
        },
        pinch: function() {

            $(jMangaPageViewer.moduleImage.current.get.imageWithDiv()).css(jMangaPageViewerUtility.hasWebKit + 'transition', '0s');
        },
        move: function() {

            $(jMangaPageViewer.moduleImage.current.get.imageWithDiv()).css(jMangaPageViewerUtility.hasWebKit + 'transition', '0s');
        },
        force: function(DOM) {

            DOM.css(jMangaPageViewerUtility.hasWebKit + 'transition', 'all 0.4s ease');
        }
    },
    moduleDirectionsArrows: {
        activity: false,
        hide: function() {

            $('.jMangaPageViewerNext').css('opacity', 0);
            $('.jMangaPageViewerPrevious').css('opacity', 0);

            jMangaPageViewer.moduleDirectionsArrows.activity = false;
        },
        show: function() {

            if (!jMangaPageViewer.moduleDirectionsArrows.activity) {

                if (jMangaPageViewer.moduleImage.current.position < jMangaPageViewer.moduleImage.images.length - 1)
                    $('.jMangaPageViewerNext').css('opacity', 0.6);

                if (jMangaPageViewer.moduleImage.current.position > 0)
                    $('.jMangaPageViewerPrevious').css('opacity', 0.6);

                window.setTimeout("jMangaPageViewer.moduleDirectionsArrows.hide()", 1200);

                jMangaPageViewer.moduleDirectionsArrows.activity = true;
            }
        }
    },
    moduleImage: {
        nameManga: 'Gokukoku no Brynhildr',
        path: 'imgs/',
        images: '',
        another: {
            imageWithDiv: function(p) {

                return '#' + jMangaPageViewer.moduleImage.images[p].image;
            },
            image: function(p) {

                return jMangaPageViewer.moduleImage.images[p].image;
            },
            extension: function(p) {

                return jMangaPageViewer.moduleImage.images[p].extension;
            }
        },
        current: {
            position: 0,
            get: {
                imageWithDiv: function() {

                    return '#' + jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].image;
                },
                image: function() {

                    return jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].image;
                },
                extension: function() {

                    return jMangaPageViewer.moduleImage.images[jMangaPageViewer.moduleImage.current.position].extension;
                }
            },
            show: function() {

                $(jMangaPageViewer.moduleImage.current.get.imageWithDiv()).css('opacity', 1);
            }
        },
        center: function(p) {

            jMangaPageViewer.moduleImage.images[p].x = (jMangaPageViewerUtility.screen.screenWidth - (jMangaPageViewer.moduleImage.images[p].widthInitial * jMangaPageViewer.moduleImage.images[p].scaleInitial)) / 2;
            jMangaPageViewer.moduleImage.images[p].y = (jMangaPageViewerUtility.screen.screenHeight - (jMangaPageViewer.moduleImage.images[p].heightInitial * jMangaPageViewer.moduleImage.images[p].scaleInitial)) / 2;
        },
        scale: function(p) {

            jMangaPageViewer.moduleImage.images[p].scaleInitial = jMangaPageViewer.moduleImage.images[p].scaleCurrent = Math.min(jMangaPageViewerUtility.screen.screenWidth / jMangaPageViewer.moduleImage.images[p].widthInitial, jMangaPageViewerUtility.screen.screenHeight / jMangaPageViewer.moduleImage.images[p].heightInitial);

            if (jMangaPageViewer.moduleScale.lock.lock)
                jMangaPageViewer.moduleImage.images[p].scaleCurrent = jMangaPageViewer.moduleScale.lock.scale;
        },
        adjustImage: function(p, c) {

            var image = jMangaPageViewer.moduleImage.another.imageWithDiv(p);

            jMangaPageViewer.moduleImage.images[p].widthInitial = $(image).width();
            jMangaPageViewer.moduleImage.images[p].heightInitial = $(image).height();

            jMangaPageViewer.moduleImage.scale(p);
            jMangaPageViewer.moduleImage.center(p);

            jMangaPageViewer.moduleDoubleTap.configureVScales();

            jMangaPageViewer.moduleTransformation.transformationGenericWithPosition(image, p);

            if (typeof c != 'function')
                jMangaPageViewer.moduleImage.current.show();
            else
                c(p);
        },
        insertConfigure: function(p, c) {

            if (document.getElementById(jMangaPageViewer.moduleImage.another.image(p)) == null) {

                var containerImg = document.createElement('div');
                containerImg.id = jMangaPageViewer.containerImgs.replace('#', '') + jMangaPageViewer.moduleImage.another.image(p);

                containerImg.style.width = '100%';
                containerImg.style.height = '100%';
                containerImg.style.position = 'absolute';
                containerImg.style.overflow = 'hidden';
                containerImg.style["z-index"] = 2;

                document.getElementsByTagName('body')[0].appendChild(containerImg);

                var image = document.createElement("img");
                image.id = jMangaPageViewer.moduleImage.another.image(p);
                image.src = jMangaPageViewer.moduleImage.path + image.id + jMangaPageViewer.moduleImage.another.extension(p);

                image.style.opacity = 0;
                image.style.position = 'absolute';
                image.style.background = 'black';

                image.onload = function() {
                    jMangaPageViewer.moduleImage.adjustImage(p, c);
                };

                $("#" + containerImg.id).append(image);
            } else {

                jMangaPageViewer.moduleImage.adjustImage(p, c);
            }
        },
        insert: function(c) {

            var left = jMangaPageViewer.moduleImage.current.position - jMangaPageViewer.moduleRange.max;
            var right = jMangaPageViewer.moduleImage.current.position + jMangaPageViewer.moduleRange.max;

            if (left >= 0 && jMangaPageViewer.moduleImage.current.position != left)
                for (var i = left; i < jMangaPageViewer.moduleImage.current.position; ++i)
                    if (document.getElementById(jMangaPageViewer.moduleImage.images[i].image) == null) {
                        jMangaPageViewer.moduleTransformation.parent.translateWidthNegative(i);
                        jMangaPageViewer.moduleImage.insertConfigure(i, function() {
                        });
                    }

            if (right < jMangaPageViewer.moduleImage.images.length && jMangaPageViewer.moduleImage.current.position != left)
                for (var i = right; i > jMangaPageViewer.moduleImage.current.position; --i)
                    if (document.getElementById(jMangaPageViewer.moduleImage.images[i].image) == null) {
                        jMangaPageViewer.moduleTransformation.parent.translateWidthNegative(i);
                        jMangaPageViewer.moduleImage.insertConfigure(i, function() {
                        });
                    }

            if (left - 1 >= 0)
                if (jMangaPageViewer.moduleImage.current.position != left)
                    $("#" + jMangaPageViewer.moduleImage.images[left - 1].image).parent().remove();
                else
                if (left - 2 >= 0)
                    $("#" + jMangaPageViewer.moduleImage.images[left - 2].image).parent().remove();

            if (right + 1 < jMangaPageViewer.moduleImage.images.length)
                if (jMangaPageViewer.moduleImage.current.position != right)
                    $("#" + jMangaPageViewer.moduleImage.images[right + 1].image).parent().remove();
                else
                if (right + 2 < jMangaPageViewer.moduleImage.images.length)
                    $("#" + jMangaPageViewer.moduleImage.images[right + 2].image).parent().remove();

            jMangaPageViewer.moduleDoubleTap.pCurrent = 0;
            jMangaPageViewer.moduleImage.insertConfigure(jMangaPageViewer.moduleImage.current.position, c);
        }
    },
    init: function() {

        jMangaPageViewerUtility.init();

        jMangaPageViewer.moduleRange.init();
        jMangaPageViewer.moduleImage.insert();
        jMangaPageViewer.moduleManageGestures.init();
        jMangaPageViewer.moduleDirectionsArrows.show();
    }
};