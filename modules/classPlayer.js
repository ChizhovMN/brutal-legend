export default class player {
    #audioPath = null;
    audio = new Audio();
    count = 0;
    set audioPath(path) {
        this.#audioPath = path
        this.audio.pause();
        this.audio.src = this.#audioPath;
        this.audio.load();
    }
    get audioPath() {
        return this.#audioPath;
    }
    createPlayer(id, end = '') {
        this.controls = document.createElement('div');
        this.controls.classList.add('controls');

        this.audioControl = document.createElement('div');
        this.audioControl.classList.add('audio-control');

        this.volumeControl = document.createElement('div');
        this.volumeControl.classList.add('volume-control');

        this.playerBtn = document.createElement('button');
        this.playerBtn.classList.add('player-btn', 'player-icon');
        this.playerBtn.id = `play${id}`

        this.timelineWrapper = document.createElement('div');
        this.timelineWrapper.classList.add('timeline-wrapper');
        this.volumeLineWrapper = document.createElement('div');
        this.volumeLineWrapper.classList.add('volumeline-wrapper');
        this.timeline = document.createElement('input');
        this.timeline.classList.add('timeline');
        this.timeline.type = "range";
        this.timeline.min = 0;
        this.timeline.value = 0;

        this.current = document.createElement('div');
        this.current.classList.add('start-track');
        this.current.textContent = '0:00';
        this.end = document.createElement('div');
        this.end.classList.add('end-track');
        this.end.textContent = '0:00';

        this.volumeBtn = document.createElement('button');
        this.volumeBtn.classList.add('volume-btn', 'player-icon');
        this.volumeBtn.addEventListener('click', () => this.volumeMute())

        this.volumeLine = document.createElement('input');
        this.volumeLine.classList.add('volume-line');
        this.volumeLine.type = "range";
        this.volumeLine.step = 0.05;
        this.volumeLine.min = 0;
        this.volumeLine.max = 1;
        this.volumeLine.value = 0.3;
        this.playerBtn.addEventListener('click', () => {
            if (this.audioPath) {
                this.toggleAudio(end)
            }
        });
        this.timeline.onchange = () => this.audio.currentTime = this.timeline.value
        this.audio.addEventListener('timeupdate', () => {
            if (end) {
                this.timeline.max = end;
                if (this.audio.currentTime > end) {
                    this.audio.pause();
                    this.playerBtn.classList.remove('pause');
                    this.timeline.max = end;
                    this.audio.currentTime = 0;
                }
                this.end.textContent = `O:${end}`;
            } else {
                this.timeline.max = this.audio.duration;
                if (this.formatTime(this.audio.duration) === 'NaN:NaN') {
                    this.end.textContent = '0:00';
                } else {
                    this.end.textContent = this.formatTime(this.audio.duration);
                }
                if (this.audio.currentTime == this.audio.duration) {
                    this.playerBtn.classList.remove('pause');
                }
            }
            this.timeline.value = this.audio.currentTime;
            this.current.textContent = this.formatTime(this.timeline.value);
        });
        this.timeline.addEventListener('input', () => {
            end ? this.end.textContent = `O:${end}` : this.end.textContent = this.formatTime(this.audio.duration);
            this.current.textContent = this.formatTime(this.timeline.value);
        })
        this.audio.addEventListener('volumechange', () => {
            if (this.audio.volume == 0) {
                this.volumeBtn.classList.add('mute');
            } else {
                this.volumeBtn.classList.remove('mute');
            }
        })
        this.volumeLine.addEventListener('input', () => {
            this.audio.volume = this.volumeLine.value
        })
        this.controls.append(this.audio);
        this.timelineWrapper.appendChild(this.timeline);
        this.timelineWrapper.appendChild(this.current);
        this.timelineWrapper.appendChild(this.end);

        this.audioControl.appendChild(this.playerBtn);
        this.audioControl.appendChild(this.timelineWrapper);

        this.volumeLineWrapper.appendChild(this.volumeLine);
        this.volumeControl.appendChild(this.volumeBtn);
        this.volumeControl.appendChild(this.volumeLineWrapper);
        this.controls.appendChild(this.audioControl);
        this.controls.appendChild(this.volumeControl);
        return this.controls;
    }
    isPlay() {
        if (this.audio.play()) {
            this.audio.pause();
            this.playerBtn.classList.remove('pause');
        }
    }
    toggleAudio(end = '') {
        if (this.audio.paused || !this.audio.currentTime) {
            this.audio.play();
            end ? this.timeline.max = end : this.timeline.max = this.audio.duration;
            this.playerBtn.classList.add('pause');
        } else {
            this.audio.pause();
            this.playerBtn.classList.remove('pause');
        }
    }
    nextSong(target, length, func) {
        this.audio.onended = () => {
            target = +target + 1;
            this.count = target;
            if (+ target > length - 1) {
                target = 0
            }
            func(target);
        }
    }
    formatTime(seconds) {
        this.min = Math.floor(seconds / 60);
        this.sec = Math.floor(seconds - (this.min * 60));
        if (this.sec < 10) {
            this.sec = `0${this.sec}`;
        }
        return `${this.min}:${this.sec}`;
    }
    volumeMute() {
        if (this.audio.volume > 0) {
            this.volumeBtn.classList.add('mute');
            return this.audio.volume = 0;
        } else {
            this.volumeBtn.classList.remove('mute');
            return this.audio.volume = this.volumeLine.value;
        }
    }

}