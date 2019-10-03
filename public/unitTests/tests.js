/*
    All Frames are loaded into an iframe, we are using the iframe
    as our starting point for launching tests.
*/

var iframe;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        iframe = document.getElementsByTagName('iframe')[0].contentWindow;
    });
} else {
    iframe = document.getElementsByTagName('iframe')[0].contentWindow;
}

QATools.scripts.color = {
    name: 'Change Color',
    url: '/unitTests/backgroundColor.js',
    isAlreadyLoaded: page => {
        return false;
    }
};

//console.log(QATools.scripts)

// QUnit.on('testEnd', element => {
//     iframe.location = iframe.location;
// });

function injectionTest(name, callback) {
    var frames = [],
        injectionPromises = [];

    QATools.findFrames(iframe, frames);

    frames.forEach(frame => {
        var injectionPromise = new Promise((resolve, reject) => {
            //console.log(QATools.scripts[name])
            QATools.injectScript(QATools.scripts[name], frame, resolve);
        });

        injectionPromises.push(injectionPromise);
    });

    Promise.all(injectionPromises).then(function () {
        //console.log('Injection Test All Promises Resolved')
    }).then(callback);
}

/*
    Test injecting libraries.
*/
// Inject Color Change Script - No Frames
QUnit.test('Color Change!', assert => {
    var frames = [];
    var done = assert.async();

    injectionTest('color', () => {
        QATools.findFrames(iframe, frames);

        assert.ok(frames[2].doc.backgroundWasChanged, QATools.scripts.color.name + ' was injected successfully!');

        done();
    });
});

// Inject Color Change Script - 2 Frames
// Inject Color Change Script - 3 Frames


QUnit.test('Inject jQuery', assert => {
    var frames = [];
    var done = assert.async();

    injectionTest('jQuery', () => {
        QATools.findFrames(iframe, frames);

        frames.forEach(frame => {
            assert.ok(frame.win.jQuery, QATools.scripts.jQuery.name + ' was injected successfully into frame ' + frame.win.name);
        });

        done();
    });
});

QUnit.test('Inject lodash', assert => {
    var frames = [];
    var done = assert.async();

    injectionTest('lodash', () => {
        QATools.findFrames(iframe, frames);

        frames.forEach(frame => {
            assert.ok(frame.win.lodash, QATools.scripts.lodash.name + ' was injected successfully into frame ' + frame.win.name);
        });

        done();
    });
});

/*
    Test selecting the correct frame for the test scripts
*/

QUnit.test('Find Frames', assert => {
    var frames = [],
        frameInfo = [];

    QATools.findFrames(iframe, frames);

    frames.forEach(frame => {
        var frameName;

        if (frame.win.name == '') {
            frameName = 'top';
        } else {
            frameName = frame.win.name;
        }

        frameInfo.push(frameName);
    });

    assert.ok(frameInfo.length == 5, 'Frames Found: ' + frameInfo.join(', '));
});