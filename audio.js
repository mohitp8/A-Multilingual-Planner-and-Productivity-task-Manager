// Web Audio API Sound Effects Synthesizer (Zero External Audio File Dependencies)
class SoundFX {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
    }

    playClick() {
        try {
            this.init();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        } catch (e) {}
    }

    playComplete() {
        try {
            this.init();
            const now = this.ctx.currentTime;

            // Major Triad Arpeggio (C5 -> E5 -> G5 -> C6)
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, index) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + index * 0.08);

                gain.gain.setValueAtTime(0.15, now + index * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.25);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + index * 0.08);
                osc.stop(now + index * 0.08 + 0.25);
            });
        } catch (e) {}
    }

    playTimerBell() {
        try {
            this.init();
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 1.2);
        } catch (e) {}
    }
}

const sfx = new SoundFX();
