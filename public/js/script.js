//var socket = io('http://medialive.top:3020');
var socket = io();

var start = document.querySelector('.start');
var loop = document.querySelector('.loop');
var stop = document.querySelector('.stop');
var clear = document.querySelector('.clear');
var timer = document.querySelector('.timer');
var res = document.querySelector('.results');

start.addEventListener('click', function () {
    Timer.start()
    socket.emit('start_timer')
})
stop.addEventListener('click', function () {
    Timer.stop()
    socket.emit('stop')
})
clear.addEventListener('click', function () {
    Timer.clear();
    socket.emit('clear')
})
loop.addEventListener('click', function () {
    Timer.loop(Timer.miliseconds, Timer.prevTime)
    socket.emit('loop')
})


let timeStart = 0,
    laps = [],
    hash = window.location.hash,
    timerLoop

const Timer = {
    miliseconds: 0,
    prevTime: 0,
    loops: 0,
    getTime: function (milisec) {
        const c = (n) => n < 10 ? '0' + n : n
        let sec = milisec / 1000,
            h = parseInt(sec / 3600),
            m = parseInt(sec / 60 % 60),
            s = parseInt(sec % 60),
            ms = (sec % 60).toFixed(1).split('.')[1] || 0

        return c(h) + ':' + c(m) + ':' + c(s) + '<span class="milisec">.' + ms + '</span>'
    },
    start: function () {
        $('.start, .clear').addClass('hidden')
        $('.btn.loop, .stop').removeClass('hidden')
        timerLoop = setInterval(() => {
            this.miliseconds += 100;
            this.render(this.miliseconds)
        }, 1000 / 10)

        if (timeStart == 0) timeStart = new Date().getTime()
        window.location.hash = setHash(false, timeStart, this.miliseconds, laps)
    },
    stop: function () {
        $('.start, .clear').removeClass('hidden')
        $('.btn.loop, .stop').addClass('hidden')
        clearInterval(timerLoop)

        window.location.hash = setHash(true, timeStart, this.miliseconds, laps)
    },
    loop: function (ms, pT, onStart) {
        this.loops++;

        $('.results').removeClass('hidden')
        $(".results").prepend(`<tr class='loop'><td>${this.loops}</td>
            <td class='res-time'>${this.getTime(ms - pT)}</td>
        <td class='res-time'>${this.getTime(ms)}</td>
        </tr>`);
        this.prevTime = ms
        if (!onStart) {
            laps.push(ms)
            window.location.hash = setHash(false, timeStart, ms, laps)
        }
    },
    clear: function () {
        this.miliseconds = 0
        this.stop()
        this.render(0)
        this.prevTime = 0
        res.innerHTML = ''
        laps = []
        window.location.hash = ''
    },
    render: function (ms) {
        timer.innerHTML = this.getTime(ms);
    }
}


var setHash = function (disabled, tS, mS, laps) {
    let l = laps.length > 0 ? `&laps:${laps.join(',')}` : ''
    return disabled ? `disabled&msec=${mS}${l}` : `start=${tS}${l}`
}

var hasLaps = function () {
    if (hash.indexOf('laps') != -1) {
        var reg = /(?:laps:)(.+)/
        laps = hash.match(reg)[1].split(',')
        laps.map((el, i) => Timer.loop(el, laps[i - 1] || 0, true))
    }
}


var isStarted = function () {
    if (hash) {
        hasLaps()
        let curTime = new Date().getTime()
        if (hash.indexOf('disabled') == -1) {
            let regS = /(?:#start=)(\d+)/
            timeStart = parseInt(hash.match(regS)[1])
            Timer.miliseconds = curTime - timeStart
            Timer.start()
        }
        else {
            let regS = /(?:msec=)(\d+)/
            let ms = parseInt(hash.match(regS)[1])
            Timer.miliseconds = ms
            timeStart = curTime - ms
            Timer.render(ms)
        }
    }
}
isStarted()

socket.on('start_timer', () => {
    Timer.start();
})
socket.on('loop', () => {
    Timer.loop(Timer.miliseconds, Timer.prevTime);
})
socket.on('stop', () => {
    Timer.stop();
})
socket.on('clear', () => {
    Timer.clear();
})

$('.expand').click(function () {
    $('.main-container').toggleClass('full-screen')
})