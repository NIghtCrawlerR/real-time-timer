//var socket = io('http://medialive.top:3020');
var socket = io();

var start = document.querySelector('.start');
var loop = document.querySelector('.loop');
var stop = document.querySelector('.stop');
var clear = document.querySelector('.clear');
var timer = document.querySelector('.timer');
var res = document.querySelector('.results');


if (window.location.pathname.indexOf('timer-2') == -1) {
    start.addEventListener('click', function () {
        //  Timer.start()
        Timer2.start()
        //socket.send('start_timer')
        socket.emit('start_timer')
    })
    stop.addEventListener('click', function () {
        // Timer.stop()
        Timer2.stop()
        socket.emit('stop')
    })
    clear.addEventListener('click', function () {
        //  Timer.clear()
        Timer2.clear();
        socket.emit('clear')
    })
    loop.addEventListener('click', function () {
        //  Timer.loop()
        Timer2.loop()
        socket.emit('loop')
    })
}

//var interval, loop, isRun = false;
var timerLoop
var Timer2 = {
    miliseconds: 0,
    prevTime: [0, 0],
    minutes: 0,
    loops: 0,
    getTime: function(m, s){
        var time = String(s / 1000).split('.')
        var sec = parseInt(time[0]) < 10 ? '0' + time[0] : time[0],
            milisec = time[1] || '0',
            minutes = m < 10 ? '0' + m : m
        return `${minutes}:${sec}<span class='milisec'>.${milisec}</span>`
    },
    start: function () {
        $('.start, .clear').addClass('hidden')
        $('.btn.loop, .stop').removeClass('hidden')
        timerLoop = setInterval(() => {
            if (this.miliseconds == 59900) {
                this.miliseconds = 0;
                this.minutes++
            }
            else this.miliseconds += 100;
            this.render()
        }, 1000 / 10)
    },
    stop: function () {
        $('.start, .clear').removeClass('hidden')
        $('.btn.loop, .stop').addClass('hidden')
        clearInterval(timerLoop)
    },
    loop: function(){
        this.loops++;
        
        $('.results').removeClass('hidden')
        $(".results").prepend(`<tr class='loop'><td>${this.loops}</td>
            <td class='res-time'>${this.getTime(this.minutes - this.prevTime[0], this.miliseconds - this.prevTime[1])}</td>
        <td class='res-time'>${this.getTime(this.minutes, this.miliseconds)}</td>
       </tr>`);
       this.prevTime = [this.minutes, this.miliseconds]
    },
    clear: function () {
        this.miliseconds = 0;
        this.minutes = 0;
        this.stop();
        this.render();
        res.innerHTML = '';
        this.prevTime = [0, 0]
    },
    render: function () {
        timer.innerHTML = this.getTime(this.minutes, this.miliseconds);
    }
}

// var Timer = {
//     timer: 0,
//     min: 0,
//     sec: 0,
//     milisec: 0,
//     loopMin: 0,
//     loopSec: 0,
//     loopTimer: 0,
//     loops: 0,
//     start: function () {
//         $('.start, .clear').addClass('hidden')
//         $('.btn.loop, .stop').removeClass('hidden')
//         interval = setInterval(() => {
//             // this.timer += 0.01;
//             if (this.milisec == 10) {
//                 this.milisec = 0;
//                 this.sec++
//             }
//             if (this.sec == 60 && this.milisec == 0) {
//                 this.min++;
//             }
//             if (this.sec == 60) {
//                 this.sec = 0;
//             }
//             this.milisec++;

//             this.update();
//         }, 1000 / 10);

//         loop = setInterval(() => {
//             if (this.loopSec == 60) {
//                 this.loopSec = 0;
//                 this.loopMin++;
//             }
//             this.loopSec++
//             this.loopTimer += 0.01;
//         }, 1000)
//     },
//     loop: function () {
//         isRun = true;
//         enableBtn()
//         this.loops++
//         var loopTime = `${this.loopMin < 10 ? '0' + this.loopMin : this.loopMin}:${this.loopSec < 10 ? '0' + this.loopSec : this.loopSec}`
//         var milisec = `<span class="milisec">.${this.milisec == 10 ? '0' : this.milisec}</span>`
//         var resTime = `${this.min < 10 ? '0' + this.min : this.min}:${this.sec < 10 ? '0' + this.sec : this.sec}`
//         $('.results').removeClass('hidden')
//         $(".results").prepend(`<tr class='loop'><td>${this.loops} km</td>
//             <td class='res-time'>${loopTime}${milisec}</td>
//         <td class='res-time'>${resTime}${milisec}</td>
//        </tr>`);

//         // $('#results').editableTableWidget();
//         this.loopMin = 0;
//         this.loopSec = 0;
//     },
//     stop: function () {
//         $('.start, .clear').removeClass('hidden')
//         $('.btn.loop, .stop').addClass('hidden')
//         clearInterval(interval)
//         clearInterval(loop)
//     },
//     clear: function () {
//         this.min = 0;
//         this.sec = 0;
//         this.milisec = 0;
//         this.loopMin = 0;
//         this.loopSec = 0;
//         this.loops = 0;
//         res.innerHTML = '';
//         this.stop();
//         this.update();
//     },
//     update: function () {
//         $('.btn.loop').prop('disabled', isRun)
//         var sec = `${this.sec < 10 ? '0' + this.sec : this.sec}`
//         var milisec = `<span class="milisec">.${this.milisec == 10 ? '0' : this.milisec}</span>`
//         //var milisec = ''
//         timer.innerHTML = `${this.min < 10 ? '0' + this.min : this.min}:${sec == '60' ? '00' : sec}${milisec}`;
//     }
// }

// function enableBtn() {
//     setTimeout(function () {
//         isRun = false
//     }, 3000)
// }

socket.on('start_timer', () => {
    Timer2.start();
})
socket.on('loop', () => {
    Timer2.loop();
})
socket.on('stop', () => {
    Timer2.stop();
})
socket.on('clear', () => {
    Timer2.clear();
})

$('.expand').click(function () {
    $('.main-container').toggleClass('full-screen')
})

// $(document).keypress(function (e) {
//     if (e.keyCode == 114) isRun = false
// })