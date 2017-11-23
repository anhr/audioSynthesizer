/**
 * JavaScript source code
 * Author: Andrej Hristoliubov
 * email: anhr@mail.ru
 * About me: http://anhr.ucoz.net/AboutMe/
 * source: 
 * example: 
 * Thanks to https://github.com/miroshko/Synzer
 * Licences: GPL, The MIT License (MIT)
 * Copyright: (c) 2015 Andrej Hristoliubov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Revision:
 *  2017-09-17, : 
 *       + init.
 *
 */

function Keyboard(selectors) {
    loadCSS('css/page.css');
    loadCSS('css/keyboard.css');
    var elKeyboard = document.createElement('div');
    //        elKeyboard.className = 'keyboard';
    this.el = document.querySelector(selectors).appendChild(elKeyboard);
    this.draw = function (lowestNote, highestNote) {
        var key;
        for (var i = lowestNote; i <= highestNote; i++) {
            var key = document.createElement('span')
            key.note = new this.Note(i);
            key.classList.add('key');
            if (['C#', 'D#', 'F#', 'G#', 'B'].indexOf(key.note.letter()) > -1) {
                key.classList.add('key-black');
            }
            key.onmousedown = function (event) {
                var elKey = getElementFromEvent(event);
                consoleLog('key.onmousedown i = ' + elKey.note.pitch + ' frequency = ' + elKey.note.frequency() + ' letter = ' + elKey.note.letter() + ' octave = ' + elKey.note.octave());
                elKey.classList.add('pressed');
                // an array of [ 0, 1 ] would be a perfect sine wave
                var real = new Float32Array([0, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1]),
                    imag = real;
                new toneGenerator.create({
                    frequency: elKey.note.frequency(),
                    audio: ac,
                    volume: 0.3,
                    attenuation: { volume: 1.2, time: 3000 },
//                        harmonics: [{ volume: 0.05 }, { volume: 0.1 }],
                    arraysPeriodicWave: { real: real, imag: imag },
                    scope: scope
                }).start();
            }
            key.onmouseup = function (event) {
                var elKey = getElementFromEvent(event);
                consoleLog('key.onmouseup i = ' + elKey.note.pitch);
                elKey.classList.remove('pressed');
            }
//            key.title = parseInt(key.note.frequency()) + 'Hz. octave ' + key.note.octave();
            key.title = lang.keyTitle.replace('%frequency', parseInt(key.note.frequency())).replace('%octave', key.note.octave());//'%frequency Hz. octave %octave'
            this.el.appendChild(key);
        }
    };
    this.Note = function (letterWithOctaveOrPitch) {
        //октавная система
        //https://ru.wikipedia.org/wiki/%D0%9E%D0%BA%D1%82%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0
        this._NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'B', 'H'];
        this.letter = function () { return this._NOTES[(this.pitch - 21 + 9) % 12]; }
        this.octave = function () { return Math.floor((this.pitch - 12) / 12); }
        this.frequency = function () { return Math.pow(2, (this.pitch - 20 - 49) / 12) * 440; }
        this._parsePitch = function (letterWithOctaveOrPitch) {
            // 21 == A0
            pitch = parseInt(letterWithOctaveOrPitch);
            if (isNaN(pitch) || pitch < 21 || pitch > 108) {
                if (typeof letterWithOctaveOrPitch != "string")
                    return false;
                var match = letterWithOctaveOrPitch.match(/([ABCDEFGH]#?)(\d+)/);
                if (!match.length)
                    return false;
                this.pitch = this._NOTES.indexOf(match[1]) + 12 * (parseInt(match[2]) + 1);
                return true;
            }

            //                    this.octave = Math.floor((pitch - 12) / 12);
            this.pitch = pitch;
            //                    this.frequency = this._freq(this.pitch);
            return true;
        };
        /*
                        this._parseLetter = function (letterOctave) {
                            var match = letterOctave.match(/([ABCDEFGH]#?)(\d+)/);
                            if (!match.length)
                                return false;
        //                    this.letter = match[1];
        //                    this.octave = parseInt(match[2]);
        //                    this.pitch = this._NOTES.indexOf(this.letter) + 12 * (this.octave + 1);
                            this.pitch = this._NOTES.indexOf(match[1]) + 12 * (parseInt(match[2]) + 1);
        //                    this.frequency = this._freq(this.pitch);
                            return true;
                        };
        */
        if (!this._parsePitch(letterWithOctaveOrPitch))// && !this._parseLetter(letterWithOctaveOrPitch))
            throw new Error('Can not parse ' + letterWithOctaveOrPitch);
    }
    this.draw(21, 108);//48, 83);
    //            this.Note('C3');
}
loadScript("../ToneGenerator/ToneGenerator.js", function () {
    Keyboard('.synzer');
    loadScript("toneControls/toneControls.js");
});
