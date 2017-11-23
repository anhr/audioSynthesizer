/**
 * JavaScript source code
 * Author: Andrej Hristoliubov
 * email: anhr@mail.ru
 * About me: http://anhr.ucoz.net/AboutMe/
 * Licences: GPL, The MIT License (MIT)
 * Copyright: (c) 2015 Andrej Hristoliubov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Revision:
 *  2017-10-12, : 
 *       + init.
 *
 */

loadScript("../ScopeKevincennis/Scope/src/scope.js",//"../../audioSynthesizer/Scope/ScopeKevincennis/Scope/src/scope.js",
    function () {
        var canvas = document.querySelector('#osc'),
          osc,// = ac.createOscillator(),
          slider = document.querySelector('#min'),
          label = document.querySelector('#label'),
          radios = document.querySelectorAll('input[type=radio]'),
          mic;//real, imag, wave;
        scope = new Scope(ac, canvas);

        function scale(val, f0, f1, t0, t1) {
            return (val - f0) * (t1 - t0) / (f1 - f0) + t0;
        }

        slider.value = scope.sensitivity;
        label.textContent = ~~scope.sensitivity;

        scope.start();

        slider.addEventListener('input', function () {
            scope.sensitivity = slider.value;
            label.textContent = slider.value;
        }, false);

        [].forEach.call(radios, function (radio) {
            radio.addEventListener('click', function (ev) {
                if (osc == undefined) {
                    osc = ac.createOscillator();
                }
                osc.frequency.value = 440;
                switch (ev.target.value) {
                    case 'microphone': return microphone();
                        //                    case 'audioOutput': return audioOutput();
                }
                mic && mic.disconnect();
                osc.connect(scope.input);
                osc.connect(ac.destination);
                if (ev.target.value === 'custom') {
                    // each index (past 0) represents a partial in the harmonic series
                    // so index 1 is the fundamental, index 2 is an octave,
                    // index 3 is a perfect fifth, index 4 is another octave
                    // index 5 is a major third, etc...

                    // an array of [ 0, 1 ] would be a perfect sine wave
                    var real = new Float32Array([0, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1]),
                        imag = real;
                    osc.setPeriodicWave(ac.createPeriodicWave(real, imag));
                } else {
                    osc.type = ev.target.value;
                }
                osc.start();
            });
        });

        function microphone() {
            osc.disconnect();
            if (mic) {
                mic.connect(scope.input);
                return;
            }
            function success(stream) {
                mic = ac.createMediaStreamSource(stream);
                mic.connect(scope.input);
            }
            function error() { consoleError('GetUserMedia failed!'); }
            if (navigator.webkitGetUserMedia) navigator.webkitGetUserMedia({ audio: true }, success, error);
            else if (navigator.mozGetUserMedia) navigator.mozGetUserMedia({ audio: true }, success, error);
            else if (navigator.getUserMedia) navigator.getUserMedia({ audio: true }, success, error);
            else alert('Microphone access not supported by your browser. Try Chrome');
        }

        if (elAudio != undefined) {
            loadScript("../ScopeKevincennis/Scope/src/MediaElementAudio.js",//"../../audioSynthesizer/Scope/ScopeKevincennis/Scope/src/MediaElementAudio.js",
                function () { MediaElementAudio.Play(elAudio, ac, scope); });
        }
    }
);
