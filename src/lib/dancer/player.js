/*global $, Dancer, mesh, console, dampingValue, light*/
$(function () {
    "use strict";

    var AUDIO_FILE = '../songs/song',
        fft = document.getElementById('fft'),
        ctx = fft.getContext('2d'),
        dancer,
        kick;

    //Execute when loaded
    function loaded() {
        var
            loading = document.getElementById('loading'),
            anchor = document.createElement('A'),
            supported = Dancer.isSupported(),
            p;

        anchor.appendChild(document.createTextNode(supported ? 'Play!' : 'Close'));
        anchor.setAttribute('href', '#');
        loading.innerHTML = '';
        loading.appendChild(anchor);

        if (!supported) {
            p = document.createElement('P');
            p.appendChild(document.createTextNode('Your browser does not currently support either Web Audio API or Audio Data API. The audio may play, but the visualizers will not move to the music; check out the latest Chrome or Firefox browsers!'));
            loading.appendChild(p);
        }

        anchor.addEventListener('click', function () {
            dancer.play();
            document.getElementById('loading').style.display = 'none';
        });
    }

    function generateRandomColor() {
        return '0x' + Math.floor(Math.random() * 16777215).toString(16);
    }

    function init() {
        /*
         * Dancer.js magic
         */
        Dancer.setOptions({
            flashSWF: '../../lib/soundmanager2.swf',
            flashJS: '../../lib/soundmanager2.js'
        });

        dancer = new Dancer();
        kick = dancer.createKick({
            onKick: function () {
                ctx.fillStyle = '#ff0077';
                dampingValue = 0.03;
                light.color.setHex(generateRandomColor());
                //mesh.scale.set(dampingValue, dampingValue, dampingValue);
            },
            offKick: function () {
                ctx.fillStyle = '#666';
                //mesh.scale.set(1, 1, 1);
            }
        }).on();

        dancer
            .after(0, function () {
                console.log(this.getFrequency(400));
                circle.position.y = this.getFrequency(500) * 100;
            })
            .fft(fft, {
                fillStyle: '#666'
            })
            .load({
                src: AUDIO_FILE,
                codecs: ['mp3']
            });

        Dancer.isSupported() || loaded();
        !dancer.isLoaded() ? dancer.bind('loaded', loaded) : loaded();

        // For debugging
        window.dancer = dancer;
    }

    init();

});