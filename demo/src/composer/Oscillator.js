import range from 'lodash.range';

export const MIN_MIDI_NUMBER = 12;
export const MAX_MIDI_NUMBER = 127;

// TODO: rewrite more understandably
function midiNumberToFrequency(midiNumber) {
  const A4 = 440;
  return A4 / 32 * Math.pow(2, (midiNumber - 9) / 12);
}

const midiNumberFrequencies = range(MIN_MIDI_NUMBER, MAX_MIDI_NUMBER + 1).reduce(
  (cache, midiNumber) => {
    cache[midiNumber] = midiNumberToFrequency(midiNumber);
    return cache;
  },
  {},
);

class Oscillator {
  constructor(options = {}) {
    this.audioContext = options.audioContext;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = options.gain;
    this.gainNode.connect(this.audioContext.destination);

    this.oscillators = {};
  }

  start(midiNumber) {
    if (this.oscillators[midiNumber]) {
      return;
    }

    let oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = midiNumberFrequencies[midiNumber];
    oscillator.connect(this.gainNode);
    oscillator.start(0);
    this.oscillators[midiNumber] = oscillator;
  }

  stop(midiNumber) {
    if (!this.oscillators[midiNumber]) {
      return;
    }

    this.oscillators[midiNumber].stop(0);
    this.oscillators[midiNumber].disconnect();
    delete this.oscillators[midiNumber];
  }
}

export default Oscillator;
