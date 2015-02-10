var jPageViewerUtility = {
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
            jPageViewerUtility.touchOrClick.start = "touchstart";
            jPageViewerUtility.touchOrClick.move = "touchmove";
            jPageViewerUtility.touchOrClick.end = "touchend"
        }
    },
    setScreenWidthHeight: function() {

        jPageViewerUtility.screen.screenWidth = $(window).width();
        jPageViewerUtility.screen.screenHeight = $(window).height();

        $('body').width(jPageViewerUtility.screen.screenWidth);
        $('body').height(jPageViewerUtility.screen.screenHeight);
    },
    setHasWebKit: function() {

        var t = 'WebkitAppearance' in document.documentElement.style;
        if (t) {
            jPageViewerUtility.hasWebKit = "-webkit-"
        }
    },
    setPageEndXY: function() {

        if (jPageViewerUtility.touchOrClick.start == 'touchstart') {

            jPageViewerUtility.pageEndX = function(e) {

                return e.originalEvent.changedTouches[0].pageX;
            };

            jPageViewerUtility.pageEndY = function(e) {

                return e.originalEvent.changedTouches[0].pageY;
            };
        } else {

            jPageViewerUtility.pageEndX = function(e) {

                return e.pageX;
            };

            jPageViewerUtility.pageEndY = function(e) {

                return e.pageY;
            };
        }
    },
    setPageXY: function() {

        if (jPageViewerUtility.touchOrClick.start == 'touchstart') {

            jPageViewerUtility.pageX = function(e, p) {

                return e.originalEvent.touches.length > p ? e.originalEvent.touches[p].pageX : -1;
            };

            jPageViewerUtility.pageY = function(e, p) {

                return e.originalEvent.touches.length > p ? e.originalEvent.touches[p].pageY : -1;
            };
        } else {

            jPageViewerUtility.pageX = function(e) {

                return e.pageX;
            };

            jPageViewerUtility.pageY = function(e) {

                return e.pageY;
            };
        }
    },
    setWidthForcePage: function() {

        var border = 30;

        if (jPageViewerUtility.screen.screenWidth < 480) {
            jPageViewer.moduleManageGestures.force.width = 50;
            border = 30;
        } else
        if (jPageViewerUtility.screen.screenWidth < 720) {
            jPageViewer.moduleManageGestures.force.width = 60;
            border = 40;
        } else
        if (jPageViewerUtility.screen.screenWidth < 1024) {
            jPageViewer.moduleManageGestures.force.width = 100;
            border = 50;
        } else
        if (jPageViewerUtility.screen.screenWidth >= 1024) {
            jPageViewer.moduleManageGestures.force.width = 100;
            border = 60;
        }

        $('.jPageViewerNext, .jPageViewerPrevious').width(jPageViewer.moduleManageGestures.force.width);
        $('.jPageViewerPreviousArrow').css({'border-top': border + 'px solid transparent', 'border-bottom': border + 'px solid transparent', 'border-right': border + 'px solid black'});
        $('.jPageViewerNextArrow').css({'border-top': border + 'px solid transparent', 'border-bottom': border + 'px solid transparent', 'border-left': border + 'px solid black'});
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
            return (jPageViewerUtility.isDevice.Android() || jPageViewerUtility.isDevice.BlackBerry() || jPageViewerUtility.isDevice.iOS() || jPageViewerUtility.isDevice.Opera() || jPageViewerUtility.isDevice.Windows());
        }
    },
    beforeCloseBrowserTab: function() {

        if (jPageViewerUtility.touchOrClick.start == 'mousedown') {

            $(window).bind('beforeunload', function(e) {

                var e = e || window.event;

                jPageViewerUtility.storage.save();

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

            if (jPageViewerUtility.storage.isStorage())
                if (typeof (localStorage.nameManga) != "undefined") {
                    if (localStorage.nameManga == jPageViewer.moduleImage.nameManga)
                        jPageViewer.moduleImage.current.position = parseInt(localStorage.imageCurrentPosition);
                } else
                    localStorage.clear();
        },
        save: function() {

            if (jPageViewerUtility.storage.isStorage()) {

                localStorage.nameManga = jPageViewer.moduleImage.nameManga;
                localStorage.imageCurrentPosition = jPageViewer.moduleImage.current.position;
            }
        }
    },
    initDivMain: function() {

        var containerTouch = document.createElement('div');
        containerTouch.id = jPageViewer.containerGestures.replace('#', '');
        document.getElementsByTagName('body')[0].appendChild(containerTouch);
    },
    init: function() {

        jPageViewerUtility.initDivMain();
        jPageViewerUtility.setHasWebKit();
        jPageViewerUtility.setTouchOrClick();
        jPageViewerUtility.setScreenWidthHeight();
        jPageViewerUtility.setWidthForcePage();
        jPageViewerUtility.setPageXY();
        jPageViewerUtility.setPageEndXY();
        jPageViewerUtility.beforeCloseBrowserTab();
        jPageViewerUtility.storage.load();
    }
};

var jPageViewer = {
    containerGestures: '#jPageViewerTouch',
    containerImgs: '#jPageViewerImage',
    containerLoading: '#jPageViewerLoading',
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
                for (var lock in jPageViewer.moduleManageGestures.locks) {

                    if (now <= max)
                        jPageViewer.moduleManageGestures.locks[lock] = true;
                    else
                        break;

                    now++;
                }
            },
            unlockAll: function() {

                var max = 3;
                var now = 0;
                for (var lock in jPageViewer.moduleManageGestures.locks) {

                    if (now <= max)
                        jPageViewer.moduleManageGestures.locks[lock] = false;
                    else
                        break;

                    now++;
                }
            },
            lockSpecific: function(who) {

                if (who.constructor == Array)
                    for (var i = 0; i < who.length; ++i)
                        jPageViewer.moduleManageGestures.locks[who[i]] = true;
                else
                    jPageViewer.moduleManageGestures.locks[who] = true;
            },
            unlockSpecific: function(who) {

                if (who.constructor == Array)
                    for (var i = 0; i < who.length; ++i)
                        jPageViewer.moduleManageGestures.locks[who[i]] = false;
                else
                    jPageViewer.moduleManageGestures.locks[who] = false;
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

                if (x == jPageViewer.moduleMove.x) {

                    if (x >= (jPageViewerUtility.screen.screenWidth - jPageViewer.moduleManageGestures.force.width) &&
                            jPageViewer.moduleImage.current.position < jPageViewer.moduleImage.images.length - 1) {

                        jPageViewer.moduleManageGestures.gestures.force.before = false;
                        return (jPageViewer.moduleManageGestures.gestures.force.after = true);
                    } else {

                        if (x <= jPageViewer.moduleManageGestures.force.width && jPageViewer.moduleImage.current.position - 1 >= 0) {

                            jPageViewer.moduleManageGestures.gestures.force.after = false;
                            return (jPageViewer.moduleManageGestures.gestures.force.before = true);
                        }
                    }
                }

                jPageViewer.moduleManageGestures.gestures.force.before = jPageViewer.moduleManageGestures.gestures.force.after = false;

                return false;
            }
        },
        doubletap: {
            timestamp: 200,
            controller: false,
            exController: false,
            reset: function() {

                jPageViewer.moduleManageGestures.doubletap.controller = false;
                jPageViewer.moduleManageGestures.doubletap.exController = false;
            },
            disable: function() {

                if (!jPageViewer.moduleManageGestures.doubletap.exController) {

                    jPageViewer.moduleManageGestures.doubletap.exController = true;

                    window.setTimeout(function() {

                        jPageViewer.moduleManageGestures.doubletap.exController = false;
                        jPageViewer.moduleManageGestures.doubletap.controller = false;

                        if (jPageViewer.moduleManageGestures.force.times == 1) {

                            if (jPageViewer.moduleManageGestures.gestures.force.after || jPageViewer.moduleManageGestures.gestures.force.before)
                                jPageViewer.moduleForcePage.init();

                            jPageViewer.moduleManageGestures.force.times = 0;
                        }
                    }, jPageViewer.moduleManageGestures.doubletap.timestamp);
                }
            },
            validate: function(x, y) {

                if (jPageViewer.moduleManageGestures.doubletap.controller) {

                    jPageViewer.moduleManageGestures.force.times = 0;
                    jPageViewer.moduleManageGestures.doubletap.reset();
                    jPageViewer.moduleDoubleTap.init(x, y);
                } else {

                    if (!jPageViewer.moduleManageGestures.doubletap.controller && !jPageViewer.moduleManageGestures.doubletap.exController) {

                        jPageViewer.moduleManageGestures.force.times++;
                        jPageViewer.moduleManageGestures.force.validate(x);

                        jPageViewer.moduleManageGestures.doubletap.controller = true;
                        jPageViewer.moduleManageGestures.doubletap.disable();
                    }
                }
            }
        },
        init: function() {

            $(jPageViewer.containerGestures).bind(jPageViewerUtility.touchOrClick.start, function(e) {

                if (!jPageViewer.moduleManageGestures.locks.start) {

                    e.preventDefault();

                    if (jPageViewerUtility.pageX(e, 1) < 0 || jPageViewerUtility.touchOrClick.start == 'mousedown') {

                        jPageViewer.moduleManageGestures.gestures.startmove = true;

                        jPageViewer.moduleMove.start(jPageViewerUtility.pageX(e, 0), jPageViewerUtility.pageY(e, 0));
                    } else {

                        if (!jPageViewer.moduleManageGestures.gestures.pinch) {

                            jPageViewer.moduleManageGestures.gestures.startmove = false;
                            jPageViewer.moduleManageGestures.gestures.move = false;

                            jPageViewer.moduleManageGestures.gestures.pinch = true;

                            jPageViewer.moduleManageGestures.doubletap.reset();

                            jPageViewer.modulePinch.start(jPageViewerUtility.pageX(e, 0), jPageViewerUtility.pageX(e, 1), jPageViewerUtility.pageY(e, 0), jPageViewerUtility.pageY(e, 1));
                        }
                    }
                }
            });

            $(jPageViewer.containerGestures).bind(jPageViewerUtility.touchOrClick.move, function(e) {

                if (!jPageViewer.moduleManageGestures.locks.move) {

                    e.preventDefault();

                    if (jPageViewer.moduleManageGestures.gestures.startmove) {

                        if (jPageViewer.moduleManageGestures.gestures.move)
                            jPageViewer.moduleMove.move(jPageViewerUtility.pageX(e, 0), jPageViewerUtility.pageY(e, 0));
                        else {

                            var x = jPageViewerUtility.pageX(e, 0);
                            var xN = jPageViewer.moduleMove.x - x;

                            var y = jPageViewerUtility.pageY(e, 0);
                            var yN = jPageViewer.moduleMove.y - y;

                            if (xN <= -8 || xN >= 8 || yN <= -8 || yN >= 8)
                                jPageViewer.moduleManageGestures.gestures.move = true;
                        }
                    } else {

                        if (jPageViewer.moduleManageGestures.gestures.pinch)
                            jPageViewer.modulePinch.move(jPageViewerUtility.pageX(e, 0), jPageViewerUtility.pageX(e, 1), jPageViewerUtility.pageY(e, 0), jPageViewerUtility.pageY(e, 1));
                    }
                }
            });

            $(jPageViewer.containerGestures).bind(jPageViewerUtility.touchOrClick.end, function(e) {

                if (!jPageViewer.moduleManageGestures.locks.end) {

                    if (!jPageViewer.moduleManageGestures.gestures.move && !jPageViewer.moduleManageGestures.gestures.pinch)
                        jPageViewer.moduleManageGestures.doubletap.validate(jPageViewerUtility.pageEndX(e), jPageViewerUtility.pageEndY(e));

                    if (jPageViewerUtility.pageX(e, 1) < 0)
                        jPageViewer.moduleManageGestures.gestures.pinch = false;

                    if (jPageViewer.moduleManageGestures.gestures.startmove) {

                       jPageViewer.moduleMove.lock = false;
                        jPageViewer.moduleManageGestures.gestures.startmove = false;
                        jPageViewer.moduleManageGestures.gestures.move = false;
                    }
                }
            });

            if (jPageViewerUtility.touchOrClick.start === 'mousedown')
                if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
                    document.getElementById(jPageViewer.containerGestures.replace('#', '')).addEventListener("DOMMouseScroll", jPageViewer.moduleMouseWheel.init, false);
                else
                    document.getElementById(jPageViewer.containerGestures.replace('#', '')).addEventListener("mousewheel", jPageViewer.moduleMouseWheel.init, false);
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

            var newX = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].x + (x - jPageViewer.moduleMove.x);
            var newY = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].y + (y - jPageViewer.moduleMove.y);
            var flag = false;

            if (newX < 0 && (newX + jPageViewer.moduleMove.limitWidth) > jPageViewerUtility.screen.screenWidth) {

                flag = true;
                jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].x = newX;
            }

            if (newY < 0 && (newY + jPageViewer.moduleMove.limitHeight) > jPageViewerUtility.screen.screenHeight) {

                flag = true;
                jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].y = newY;
            }

            jPageViewer.moduleMove.x = x;
            jPageViewer.moduleMove.y = y;

            if (flag) {

                /*jPageViewer.moduleMove.accumX.push(jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].x);
                jPageViewer.moduleMove.accumY.push(jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].y);*/

                //if (!jPageViewer.moduleMove.lock) {

                    //jPageViewer.moduleMove.lock = true;
                    jPageViewer.moduleTransformation.transformationGeneric(jPageViewer.moduleImage.current.get.imageWithDiv());
                //}
            }
        },
        start: function(x, y) {

            jPageViewer.moduleCss.move();

            jPageViewer.moduleMove.x = x;
            jPageViewer.moduleMove.y = y;
            jPageViewer.moduleMove.limitWidth = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].widthInitial * jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent;
            jPageViewer.moduleMove.limitHeight = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].heightInitial * jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent;
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

            jPageViewer.modulePinch.x1 = x1;
            jPageViewer.modulePinch.x2 = x2;
            jPageViewer.modulePinch.y1 = y1;
            jPageViewer.modulePinch.y2 = y2;
            jPageViewer.modulePinch.dist = dist;
        },
        pinchOut: function(s) {

            var c = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent - s;

            if (c >= jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleInitial) {

                jPageViewer.moduleScale.scale(jPageViewer.modulePinch.cpX, jPageViewer.modulePinch.cpY, -s);
            } else {

                jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleInitial;
                jPageViewer.moduleScale.scale(jPageViewer.modulePinch.cpX, jPageViewer.modulePinch.cpY);
            }
        },
        pinchIn: function(s) {

            var c = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent + s;

            if (c <= jPageViewer.moduleDoubleTap.vScales[jPageViewer.moduleDoubleTap.vScales.length - 1])
                jPageViewer.moduleScale.scale(jPageViewer.modulePinch.cpX, jPageViewer.modulePinch.cpY, s);
        },
        move: function(x1, x2, y1, y2) {

            var dist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            var displ = dist - jPageViewer.modulePinch.dist;

            if (displ > jPageViewer.modulePinch.width || displ < -jPageViewer.modulePinch.width) {

                if (dist > jPageViewer.modulePinch.dist)
                    jPageViewer.modulePinch.pinchIn(jPageViewer.modulePinch.zoom);
                else
                    jPageViewer.modulePinch.pinchOut(jPageViewer.modulePinch.zoom);

                jPageViewer.modulePinch.update(x1, x2, y1, y2, dist);
            }
        },
        start: function(x1, x2, y1, y2) {

            jPageViewer.moduleCss.pinch();

            jPageViewer.modulePinch.x1 = x1;
            jPageViewer.modulePinch.x2 = x2;

            jPageViewer.modulePinch.y1 = y1;
            jPageViewer.modulePinch.y2 = y2;

            jPageViewer.modulePinch.dist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

            jPageViewer.modulePinch.cpX = x1 < x2 ? ((x1 + x2) / 2) : ((x2 + x1) / 2);
            jPageViewer.modulePinch.cpY = y1 < y2 ? ((y1 + y2) / 2) : ((y2 + y1) / 2);
        }
    },
    moduleMouseWheel: {
        init: function(e) {

            if (!jPageViewer.moduleManageGestures.locks.scroll) {

                jPageViewer.moduleCss.mousewheel();

                var delta = 0;
                if (Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) < 0)
                    delta = -0.1;
                else
                    delta = 0.1;

                var c = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent + delta;

                if (c >= jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleInitial && c <= jPageViewer.moduleDoubleTap.vScales[jPageViewer.moduleDoubleTap.vScales.length - 1])
                    jPageViewer.moduleScale.scale(jPageViewerUtility.pageX(e, 0), jPageViewerUtility.pageY(e, 0), delta);
                else {

                    if (c < jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleInitial) {
                        jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleInitial;
                        jPageViewer.moduleScale.scale(jPageViewerUtility.pageX(e, 0), jPageViewerUtility.pageY(e, 0));
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

            if (!jPageViewer.moduleDoubleTap.staticScales) {

                jPageViewer.moduleDoubleTap.vScales = [];
                jPageViewer.moduleDoubleTap.vScales[0] = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleInitial;

                jPageViewer.moduleDoubleTap.vScales[1] = Math.max(jPageViewerUtility.screen.screenWidth / jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].widthInitial, jPageViewerUtility.screen.screenHeight / jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].heightInitial);

                jPageViewer.moduleDoubleTap.vScales[1] = Math.max((jPageViewerUtility.screen.screenWidth * 2) / jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].widthInitial, (jPageViewerUtility.screen.screenHeight * 2) / jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].heightInitial);

                jPageViewer.moduleDoubleTap.vScales[2] = Math.max((jPageViewerUtility.screen.screenWidth * 3) / jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].widthInitial, (jPageViewerUtility.screen.screenHeight * 3) / jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].heightInitial);
            }
        },
        chooseZoom: function() {

            if (jPageViewer.moduleDoubleTap.pCurrent >= jPageViewer.moduleDoubleTap.vScales.length - 1)
                jPageViewer.moduleDoubleTap.zoom = 'out';
            else
            if (jPageViewer.moduleDoubleTap.pCurrent <= 0)
                jPageViewer.moduleDoubleTap.zoom = 'in';

            if (jPageViewer.moduleDoubleTap.zoom == 'in')
                jPageViewer.moduleDoubleTap.pCurrent++;
            else
                jPageViewer.moduleDoubleTap.pCurrent--;
        },
        init: function(x, y) {

            jPageViewer.moduleCss.doubletap();
            jPageViewer.moduleDoubleTap.chooseZoom();
            jPageViewer.moduleScale.scale(x, y, 0, 'doubletap');
        }
    },
    moduleForcePage: {
        old: '',
        timestamp: 400,
        releaseLocksForce: function() {

            jPageViewer.moduleManageGestures.locks.unlockAll();
            jPageViewer.moduleManageGestures.gestures.force.before = jPageViewer.moduleManageGestures.gestures.force.after = false;
        },
        translate: function() {

            if (jPageViewer.moduleManageGestures.gestures.force.after)
                jPageViewer.moduleTransformation.parent.translateWidthPositive(jPageViewer.moduleImage.current.position);
            else
                jPageViewer.moduleTransformation.parent.translateWidthNegative(jPageViewer.moduleImage.current.position);

            window.setTimeout(function() {

                $(jPageViewer.moduleImage.current.get.imageWithDiv()).css('opacity', 1);

                jPageViewer.moduleCss.force($(jPageViewer.moduleImage.current.get.imageWithDiv()).parent());

                window.setTimeout(function() {

                    if (jPageViewer.moduleManageGestures.gestures.force.after)
                        jPageViewer.moduleTransformation.parent.translateWidthNegative(jPageViewer.moduleForcePage.old);
                    else
                        jPageViewer.moduleTransformation.parent.translateWidthPositive(jPageViewer.moduleForcePage.old);

                    jPageViewer.moduleTransformation.parent.center(jPageViewer.moduleImage.current.position);

                    jPageViewer.moduleDirectionsArrows.show();

                    window.setTimeout(function() {

                        jPageViewer.moduleForcePage.releaseLocksForce();
                    }, jPageViewer.moduleForcePage.timestamp);
                }, 33);
            }, 33);
        },
        choose: function() {

            jPageViewer.moduleCss.force($(jPageViewer.moduleImage.current.get.imageWithDiv()).parent());
            jPageViewer.moduleForcePage.old = jPageViewer.moduleImage.current.position;

            if (jPageViewer.moduleManageGestures.gestures.force.after)
                jPageViewer.moduleImage.current.position++;
            else
                jPageViewer.moduleImage.current.position--;

            jPageViewer.moduleImage.insert(jPageViewer.moduleForcePage.translate);
        },
        init: function() {

            jPageViewer.moduleManageGestures.locks.lockAll();
            jPageViewer.moduleForcePage.choose();
        }
    },
    moduleRange: {
        max: 1,
        init: function() {

            if (jPageViewerUtility.isDevice.mobile()) {

                if (jPageViewerUtility.screen.screenWidth < 720)
                    jPageViewer.moduleRange.max = 1;
                else
                if (jPageViewerUtility.screen.screenWidth >= 720)
                    jPageViewer.moduleRange.max = 2;
            } else
                jPageViewer.moduleRange.max = 2;
        }
    },
    moduleScale: {
        lock: {
            lock: false,
            scale: 1
        },
        scale: function(pX, pY, sF, who) {

            var wN, hN, xN, yN;

            wN = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].widthInitial * jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent;
            hN = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].heightInitial * jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent;
            xN = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].x;
            yN = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].y;

            var wA, hA;

            if (typeof sF == 'undefined')
                sF = 0;

            switch (who) {

                case 'doubletap':
                    {

                        wA = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].widthInitial * jPageViewer.moduleDoubleTap.vScales[jPageViewer.moduleDoubleTap.pCurrent];
                        hA = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].heightInitial * jPageViewer.moduleDoubleTap.vScales[jPageViewer.moduleDoubleTap.pCurrent];

                        jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent = jPageViewer.moduleDoubleTap.vScales[jPageViewer.moduleDoubleTap.pCurrent];

                        break;
                    }

                default :
                    {

                        wA = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].widthInitial * (jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent + sF);
                        hA = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].heightInitial * (jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent + sF);
                        jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent = jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent + sF;

                        break;
                    }
            }

            var xNew, yNew;

            var fat1 = pX - xN;
            if (xN >= 0)
                fat1 = pX - xN;

            if (fat1 < 0 || fat1 > wN || wA < jPageViewerUtility.screen.screenWidth)
                xNew = (jPageViewerUtility.screen.screenWidth - wA) / 2;
            else {
                xNew = -(fat1 * (wA / wN)) + pX;

                var boundary = -(wA - jPageViewerUtility.screen.screenWidth);
                if (xNew >= 0)
                    xNew = 0;
                else
                if (xNew < boundary)
                    xNew = boundary;
            }

            var fat2 = pY - yN;
            if (yN >= 0)
                fat2 = pY - yN;

            if (fat2 < 0 || fat2 > hN || hA < jPageViewerUtility.screen.screenHeight)
                yNew = (jPageViewerUtility.screen.screenHeight - hA) / 2;
            else {
                yNew = -(fat2 * (hA / hN)) + pY;

                var boundary = -(hA - jPageViewerUtility.screen.screenHeight);
                if (yNew >= 0)
                    yNew = 0;
                else
                if (yNew < boundary)
                    yNew = boundary;
            }

            jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].x = xNew;
            jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].y = yNew;

            jPageViewer.moduleTransformation.transformationGeneric(jPageViewer.moduleImage.current.get.imageWithDiv());
        }
    },
    moduleTransformation: {
        transformationGenericWithPosition: function(t, p) {

            $(t).css(jPageViewerUtility.hasWebKit + 'transform', 'translate3d(' + jPageViewer.moduleImage.images[p].x.toFixed(2) + 'px, ' + jPageViewer.moduleImage.images[p].y.toFixed(2) + 'px, 0) scale3d(' + jPageViewer.moduleImage.images[p].scaleCurrent.toFixed(3) + ',  ' + jPageViewer.moduleImage.images[p].scaleCurrent.toFixed(3) + ', 1)');
        },
        transformationGeneric: function(t) {

            $(t).css(jPageViewerUtility.hasWebKit + 'transform', 'translate3d(' + jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].x.toFixed(2) + 'px, ' + jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].y.toFixed(2) + 'px, 0) scale3d(' + jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent.toFixed(3) + ',  ' + jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent.toFixed(3) + ', 1)');
        },
        transformWithXY: function(t, x, y) {

            $(t).css(jPageViewerUtility.hasWebKit + 'transform', 'translate3d(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px, 0) scale3d(' + jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent.toFixed(3) + ',  ' + jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].scaleCurrent.toFixed(3) + ', 1)');
        },
        parent: {
            center: function(p) {

                $(jPageViewer.moduleImage.another.imageWithDiv(p)).parent().css(jPageViewerUtility.hasWebKit + 'transform', 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)');
            },
            translateWidthNegative: function(p) {

                $(jPageViewer.moduleImage.another.imageWithDiv(p)).parent().css(jPageViewerUtility.hasWebKit + 'transform', 'translate3d(' + -jPageViewerUtility.screen.screenWidth + 'px, 0px, 0) scale3d(1, 1, 1)');
            },
            translateWidthPositive: function(p) {

                $(jPageViewer.moduleImage.another.imageWithDiv(p)).parent().css(jPageViewerUtility.hasWebKit + 'transform', 'translate3d(' + jPageViewerUtility.screen.screenWidth + 'px, 0px, 0) scale3d(1, 1, 1)');
            }
        }
    },
    moduleCss: {
        doubletap: function() {

            $(jPageViewer.moduleImage.current.get.imageWithDiv()).css(jPageViewerUtility.hasWebKit + 'transition', 'all 0.3s ease');
        },
        mousewheel: function() {

            $(jPageViewer.moduleImage.current.get.imageWithDiv()).css(jPageViewerUtility.hasWebKit + 'transition', 'all 0.1s linear');
        },
        pinch: function() {

            $(jPageViewer.moduleImage.current.get.imageWithDiv()).css(jPageViewerUtility.hasWebKit + 'transition', '0s');
        },
        move: function() {

            $(jPageViewer.moduleImage.current.get.imageWithDiv()).css(jPageViewerUtility.hasWebKit + 'transition', '0ms');
        },
        force: function(DOM) {

            DOM.css(jPageViewerUtility.hasWebKit + 'transition', 'all 0.4s ease');
        }
    },
    moduleDirectionsArrows: {
        activity: false,
        hide: function() {

            $('.jPageViewerNext').css('opacity', 0);
            $('.jPageViewerPrevious').css('opacity', 0);

            jPageViewer.moduleDirectionsArrows.activity = false;
        },
        show: function() {

            if (!jPageViewer.moduleDirectionsArrows.activity) {

                if (jPageViewer.moduleImage.current.position < jPageViewer.moduleImage.images.length - 1)
                    $('.jPageViewerNext').css('opacity', 0.6);

                if (jPageViewer.moduleImage.current.position > 0)
                    $('.jPageViewerPrevious').css('opacity', 0.6);

                window.setTimeout("jPageViewer.moduleDirectionsArrows.hide()", 1200);

                jPageViewer.moduleDirectionsArrows.activity = true;
            }
        }
    },
    moduleImage: {
        nameManga: 'Gokukoku no Brynhildr',
        path: 'imgs/',
        images: '',
        another: {
            imageWithDiv: function(p) {

                return '#' + jPageViewer.moduleImage.images[p].image;
            },
            image: function(p) {

                return jPageViewer.moduleImage.images[p].image;
            },
            extension: function(p) {

                return jPageViewer.moduleImage.images[p].extension;
            }
        },
        current: {
            position: 0,
            get: {
                imageWithDiv: function() {

                    return '#' + jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].image;
                },
                image: function() {

                    return jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].image;
                },
                extension: function() {

                    return jPageViewer.moduleImage.images[jPageViewer.moduleImage.current.position].extension;
                }
            },
            show: function() {

                $(jPageViewer.moduleImage.current.get.imageWithDiv()).css('opacity', 1);
            }
        },
        center: function(p) {

            jPageViewer.moduleImage.images[p].x = (jPageViewerUtility.screen.screenWidth - (jPageViewer.moduleImage.images[p].widthInitial * jPageViewer.moduleImage.images[p].scaleInitial)) / 2;
            jPageViewer.moduleImage.images[p].y = (jPageViewerUtility.screen.screenHeight - (jPageViewer.moduleImage.images[p].heightInitial * jPageViewer.moduleImage.images[p].scaleInitial)) / 2;
        },
        scale: function(p) {

            jPageViewer.moduleImage.images[p].scaleInitial = jPageViewer.moduleImage.images[p].scaleCurrent = Math.min(jPageViewerUtility.screen.screenWidth / jPageViewer.moduleImage.images[p].widthInitial, jPageViewerUtility.screen.screenHeight / jPageViewer.moduleImage.images[p].heightInitial);

            if (jPageViewer.moduleScale.lock.lock)
                jPageViewer.moduleImage.images[p].scaleCurrent = jPageViewer.moduleScale.lock.scale;
        },
        adjustImage: function(p, c) {

            var image = jPageViewer.moduleImage.another.imageWithDiv(p);

            jPageViewer.moduleImage.images[p].widthInitial = $(image).width();
            jPageViewer.moduleImage.images[p].heightInitial = $(image).height();

            jPageViewer.moduleImage.scale(p);
            jPageViewer.moduleImage.center(p);

            jPageViewer.moduleDoubleTap.configureVScales();

            jPageViewer.moduleTransformation.transformationGenericWithPosition(image, p);

            if (typeof c != 'function')
                jPageViewer.moduleImage.current.show();
            else
                c(p);
        },
        insertConfigure: function(p, c) {

            if (document.getElementById(jPageViewer.moduleImage.another.image(p)) == null) {

                var containerImg = document.createElement('div');
                containerImg.id = jPageViewer.containerImgs.replace('#', '') + jPageViewer.moduleImage.another.image(p);

                containerImg.style.width = '100%';
                containerImg.style.height = '100%';
                containerImg.style.position = 'absolute';
                containerImg.style.overflow = 'hidden';
                containerImg.style["z-index"] = 2;

                document.getElementsByTagName('body')[0].appendChild(containerImg);

                var image = document.createElement("img");
                image.id = jPageViewer.moduleImage.another.image(p);
                image.src = jPageViewer.moduleImage.path + image.id + jPageViewer.moduleImage.another.extension(p);

                image.style.opacity = 0;
                image.style.position = 'absolute';
                image.style.background = 'black';

                image.onload = function() {
                    jPageViewer.moduleImage.adjustImage(p, c);
                };

                $("#" + containerImg.id).append(image);
            } else {

                jPageViewer.moduleImage.adjustImage(p, c);
            }
        },
        insert: function(c) {

            var left = jPageViewer.moduleImage.current.position - jPageViewer.moduleRange.max;
            var right = jPageViewer.moduleImage.current.position + jPageViewer.moduleRange.max;

            if (left >= 0 && jPageViewer.moduleImage.current.position != left)
                for (var i = left; i < jPageViewer.moduleImage.current.position; ++i)
                    if (document.getElementById(jPageViewer.moduleImage.images[i].image) == null) {
                        jPageViewer.moduleTransformation.parent.translateWidthNegative(i);
                        jPageViewer.moduleImage.insertConfigure(i, function() {
                        });
                    }

            if (right < jPageViewer.moduleImage.images.length && jPageViewer.moduleImage.current.position != left)
                for (var i = right; i > jPageViewer.moduleImage.current.position; --i)
                    if (document.getElementById(jPageViewer.moduleImage.images[i].image) == null) {
                        jPageViewer.moduleTransformation.parent.translateWidthNegative(i);
                        jPageViewer.moduleImage.insertConfigure(i, function() {
                        });
                    }

            if (left - 1 >= 0)
                if (jPageViewer.moduleImage.current.position != left)
                    $("#" + jPageViewer.moduleImage.images[left - 1].image).parent().remove();
                else
                if (left - 2 >= 0)
                    $("#" + jPageViewer.moduleImage.images[left - 2].image).parent().remove();

            if (right + 1 < jPageViewer.moduleImage.images.length)
                if (jPageViewer.moduleImage.current.position != right)
                    $("#" + jPageViewer.moduleImage.images[right + 1].image).parent().remove();
                else
                if (right + 2 < jPageViewer.moduleImage.images.length)
                    $("#" + jPageViewer.moduleImage.images[right + 2].image).parent().remove();

            jPageViewer.moduleDoubleTap.pCurrent = 0;
            jPageViewer.moduleImage.insertConfigure(jPageViewer.moduleImage.current.position, c);
        }
    },
    init: function() {

        jPageViewerUtility.init();

        jPageViewer.moduleRange.init();
        jPageViewer.moduleImage.insert();
        jPageViewer.moduleManageGestures.init();
        jPageViewer.moduleDirectionsArrows.show();
    }
};