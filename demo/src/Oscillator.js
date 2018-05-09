// TODO: dedupe with microharmonic
class Oscillator {
  constructor(options = {}) {
    this.audioContext = options.audioContext;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = options.gain;
    this.gainNode.connect(this.audioContext.destination);

    this.oscillators = {};
  }

  start(freq) {
    if (this.oscillators[freq]) {
      return;
    }

    let oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    oscillator.connect(this.gainNode);
    oscillator.start(0);
    this.oscillators[freq] = oscillator;
  }

  stop(freq) {
    if (!this.oscillators[freq]) {
      return;
    }

    this.oscillators[freq].stop(0);
    this.oscillators[freq].disconnect();
    delete this.oscillators[freq];
  }
}

export default Oscillator;
