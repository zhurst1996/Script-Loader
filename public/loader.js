window.QATools = (function () {
    // For local testing
    var QAToolServerUrl = 'http://localhost:8080';

    /*
        Styles for console log messages (for debugging purposes).

        var successCSS = 'padding: 10px; border-radius: 4px;' +
        'background-color: rgba(66, 209, 0, 0.63); color: #bfe2bf',
        warningCSS = 'padding: 10px; border-radius: 4px;' +
        'background-color: #FFD700; color: #6f4800',
        dangerCSS = 'padding: 10px; border-radius: 4px;' +
        'background-color: #F08080; color: #8B0000';
    */

    /*
        allFrames contains a list of every frame on the page (including nested frames).


        pageDocument is the document of the frame in which the loader
        pop up is appended and is set by selectTargetFrame


        targetedFrameWindow is the window for the pageDocument frame.
    */
    var allFrames = [],
        pageDocument,
        targetedFrameWindow;

    var scripts = {
            'jQuery': {
                name: 'jQuery',
                url: 'https://code.jquery.com/jquery-3.4.1.min.js',
                isAlreadyLoaded: function (page) {
                    return !!page.jQuery && parseInt(page.$.fn.jquery) >= '3';
                }
            },
            'UI': {
                name: 'jQuery UI',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
                isAlreadyLoaded: function (page) {
                    if (!page.jQuery) {
                        return false;
                    }

                    return !!page.$.ui;
                }
            },
            'lodash': {
                name: 'lodash',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.js',
                isAlreadyLoaded: function (page) {
                    if (!page.jQuery) {
                        return false;
                    }

                    return !!page._;
                }
            },
            'Selectize': {
                name: 'Selectize JS',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.6/js/standalone/selectize.js',
                isAlreadyLoaded: function (page) {
                    if (!page.jQuery) {
                        return false;
                    }

                    return !!page.$.fn.selectize;
                }
            }
        },
        scriptKeys = Object.keys(scripts),
        styles = [{
            name: 'Selectize Bootstrap CSS',
            url: 'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.6/css/selectize.bootstrap3.css',
        }, {
            name: 'Selectize CSS',
            url: 'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.6/css/selectize.legacy.css',
        }];

    var scriptOptionHtml = [];

    var injectionPromises = [];

    var loader = {
        findFrames: function (win, results) {
            /*
             * Finding every frame and each of those frames nested frames.
             * This function uses recursion.
             */

            var doc = win.document || win.contentDocument;
            var frames = doc.getElementsByTagName('frame');

            if (frames.length === 0) {
                results.push({
                    win: win,
                    doc: doc
                });
            } else {
                results.push({
                    win: win,
                    doc: doc
                });

                for (var i = 0; i < frames.length; i++) {
                    loader.findFrames(frames[i].contentWindow, results);
                }
            }
        },
        selectTargetFrame: function () {
            /*
                Setting target document and window to be manipulated by the loader.
             */
            loader.findFrames(window.top, allFrames);

            if (allFrames.length >= 3) {
                pageDocument = allFrames[allFrames.length - 2].doc;
                targetedFrameWindow = allFrames[allFrames.length - 2].win;

                if (/top/i.test(pageDocument.location.pathname)) {
                    pageDocument = allFrames[allFrames.length - 1].doc;
                    targetedFrameWindow = allFrames[allFrames.length - 1].win;
                }

            } else {
                pageDocument = allFrames[allFrames.length - 1].doc;
                targetedFrameWindow = allFrames[allFrames.length - 1].win;
            }
        },
        injectScript: function (script, page, callback) {
            /*
                For injecting javascript
            */
            var frame = page.win.name,
                isOnPage = script.isAlreadyLoaded(page.win),
                tag,
                resourceUrl = script.url;

            if (!frame) {
                frame = 'top';
            }

            if (!isOnPage) {
                tag = page.doc.createElement('script');
                tag.type = 'text/javascript';
                tag.async = false;
                tag.src = resourceUrl;

                tag.onload = callback;

                page.doc.getElementsByTagName('head')[0].appendChild(tag);

                //console.log('%c Injection! Frame: ' + frame + '; Library: ' + resourceUrl, successCSS);
            } else {
                //console.log('%c Rejected Injection Request in Frame: ' + frame + '; Library: ' + resourceUrl + ' was not injected because it was already on the page.', warningCSS);
                callback();
            }
        },
        injectCSS: function (resourceUrl, page, callback) {
            var frame = page.win.name,
                tag;

            if (!frame) {
                frame = 'top';
            }

            tag = page.doc.createElement('link');
            tag.rel = 'stylesheet';
            tag.href = resourceUrl;
            tag.onload = callback;

            page.doc.getElementsByTagName('head')[0].appendChild(tag);

            if (callback) callback();
        },
        startInjections: function (frame) {
            /*
             * Searches all the frames for the libraries and injects the appropriate MISSING libraries.
             */

            for (var i = 0; i < scriptKeys.length; i++) {
                var injectedPromise = new Promise(function (resolve, reject) {
                    loader.injectScript(scripts[scriptKeys[i]], frame, resolve);
                });

                injectionPromises.push(injectedPromise);
            }

            styles.forEach(function (style) {
                loader.injectCSS(style.url, frame);
            });
        },
        loadAvailableScripts: function () {
            /*
             * Below is where we are setting the select options, button functionality
             * and the overall markup for the loader.js tool through loadQAToolsMarkup
             * and bindEvents. This will only not show certain scripts to the end user
             * that DO NOT end in "Code Test" in the document name. The rest of
             * the scripts will be hidden unless the url's hash is set to "#QAAdmin".
             */

            return $.get(QAToolServerUrl + '/list-scripts', function (scripts) {
                var options = [],
                    adminScripts = _.remove(scripts, function (script) {
                        return (/.CodeTest\.js$/).test(script);
                    });

                if (window.location.hash !== '#QAAdmin') {
                    $.each(scripts, function (i, script) {
                        var $opt = $('<option>')
                            .prop('value', script)
                            .text(script.replace(/\.js$/, ''));

                        options.push($opt);
                    });
                    scriptOptionHtml = options;
                } else {
                    $.each(adminScripts, function (i, script) {
                        var $opt = $('<option>')
                            .prop('value', script)
                            .text(script.replace(/(CodeTest)?\.js$/, ''));

                        options.push($opt);
                    });
                    scriptOptionHtml = options;
                }
            });
        },
        loadQAToolsMarkup: function () {
            return $.get(QAToolServerUrl + '/QAToolsMarkup.htm', function (markup) {
                $('body', pageDocument).prepend(markup);
            });
        },
        bindEvents: function () {
            $('#QATools', pageDocument)
                .find('.close-tools')
                .one('click', function (event) {
                    event.preventDefault();
                    $('#QAToolsContainer', pageDocument).remove();
                })
                .end()
                .find('.run-script-button')
                .one('click', function (event) {
                    event.preventDefault();
                    var scriptSrc = $('#QATools .available-scripts', pageDocument).val();
                    loader.injectScript({
                        name: scriptSrc,
                        url: QAToolServerUrl + '/test-scripts/' + scriptSrc,
                        isAlreadyLoaded: function () {
                            return false;
                        }
                    }, {
                        win: targetedFrameWindow,
                        doc: pageDocument
                    }, function () {
                        $('#QAToolsContainer', pageDocument).remove();
                    }, pageDocument);
                });
        },
        showToolsPopup: function () {
            if ($('#QATools', pageDocument).length == 0) {
                if (!targetedFrameWindow.Cookies) {
                    targetedFrameWindow.Cookies = {
                        get: $.noop,
                        remove: $.noop
                    };
                }
                $.when(loader.loadAvailableScripts(), loader.loadQAToolsMarkup()).then(function () {

                    $('#QATools .available-scripts', pageDocument)
                        .html(scriptOptionHtml)
                        .selectize()
                        .on('change', function () {
                            $('#QATools .run-script-button', pageDocument).focus();
                        });

                    loader.bindEvents();

                    $('#QATools', pageDocument)
                        .fadeIn()
                        .draggable({
                            distance: 20
                        })
                        .find('input')
                        .focus()
                        .end()
                        .find('#member strong')
                        .append('Hello User,');

                    $(pageDocument).keypress(function (e) {
                        if (e.which === $.ui.keyCode.ENTER) {
                            $('.run-script-button', pageDocument).click();
                        }
                    }).keypress(function (e) {
                        if (e.which === $.ui.keyCode.SPACE) {
                            $('#QATools input', pageDocument).focus();
                        }
                    });

                }).fail(function (err) {
                    console.log(err);
                    loader.bindEvents();
                });
            } else {
                $('#QATools', pageDocument)
                    .effect('bounce')
                    .addClass('onpage');

                setTimeout(function () {
                    $('#QATools', pageDocument).removeClass('onpage');
                }, 450);
            }
        },
        init: function () {
            if (!window.top.QUnit) {

                loader.selectTargetFrame();

                if (!pageDocument.getElementById('QATools')) {

                    /*
                     * The condition is being set because we want to make sure we are not automatically
                     * the loader if QUnit is on the page. This is to unit the different functions throughout
                     * the loader.
                     */


                    allFrames.forEach(function (frame) {

                        /*
                         * Check document ready status of each frame.
                         */
                        if (frame.doc.readyState === 'loading') {
                            frame.doc.addEventListener('DOMContentLoaded', function () {
                                loader.startInjections(frame);
                            });
                        } else {
                            loader.startInjections(frame);
                        }

                    });
                    return Promise.all(injectionPromises).then(loader.showToolsPopup);
                } else {
                    $('#QATools', pageDocument)
                        .effect('bounce')
                        .addClass('onpage')
                        .find('input')
                        .focus();

                    setTimeout(function () {
                        $('#QATools', pageDocument).removeClass('onpage');
                    }, 450);
                }
            } else {
                scriptKeys.forEach(function (key) {
                    scripts[key].url = 'https://qa.ctmecontracts.net' + scripts[key].url;
                });
            }
        }
    };

    loader.init();

    return {
        QAToolServerUrl: QAToolServerUrl,
        scripts: scripts,
        pageDocument: pageDocument,
        targetedFrameWindow: targetedFrameWindow,
        findFrames: loader.findFrames,
        injectScript: loader.injectScript,
        scriptKeys: scriptKeys,
        selectTargetFrame: loader.selectTargetFrame
    };
}());