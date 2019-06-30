import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';

whyDidYouRender(React, { trackHooks: false });

import ControlledPiano from './ControlledPiano';
import Piano from './Piano';
import Keyboard from './Keyboard';
import KeyboardShortcuts from './KeyboardShortcuts';
import MidiNumbers from './MidiNumbers';

export { ControlledPiano, Piano, Keyboard, KeyboardShortcuts, MidiNumbers };
