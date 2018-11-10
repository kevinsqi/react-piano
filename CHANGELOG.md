## 3.1.2 (November 10, 2018)

* Make Piano use activeNotes prop for initial state [#40]

## 3.1.1 (November 3, 2018)

* Fix issue where Piano does not expand to container size when "width" prop is omitted [#38]

## 3.1.0 (September 30, 2018)

* Fix activeNotes prop behavior, and add onPlayNoteInput/onStopNoteInput props [#37]

## 3.0.0 (September 23, 2018)

Migration guide from 2.x.x:

* Piano component's `playbackNotes` prop has been replaced with `activeNotes` [#36]
* Rename Piano's `onPlayNote` prop to `playNote` [#36]
* Rename Piano's `onStopNote` prop to `stopNote` [#36]
* If you need to support IE, you may now need to polyfill `Array.find` [#30]

Non-migratable changes:

* Gliss behavior is modified so that clicking down on mouse outside the Piano component will not start a gliss - you have to click within the Piano element to start a gliss [#33]

PRs:

* Make Piano a controllable component, and export a ControlledPiano component [#36]
* Only apply mouse/touch listeners on the piano component [#33]
* Remove lodash utilities in favour of just/native [#30]
* Use Rollup filesize plugin [#28]

Thanks to @ritz078 for #30 and #33, and for making the suggestion for #28 and #36!

## 2.0.1 (September 8, 2018)

* Use babel env target to compile ES6 features to ES5 to fix create-react-app prod build [#25]

## 2.0.0 (September 8, 2018)

Migration guide from 1.x.x:

* Import the styles with `import 'react-piano/dist/styles.css'` instead of `import 'react-piano/build/styles.css'` [#23]
* If you customized the `renderNoteLabel` prop, you may need to adjust its behavior because it is now called on all keys, not just ones with keyboardShortcuts. See [this commit](https://github.com/iqnivek/react-piano/pull/24/commits/822b66738e79909009ccea41b8a8f13554c7c01e) for more detail.

PRs:

* Call renderNoteLabel for all keys, even if it doesn't have a keyboardShortcut [#24]
* Fix build size and replace webpack with rollup [#23]

## 1.1.0 (July 27, 2018)

* Add className prop [#21]
* Add enzyme tests [#20]

## 1.0.0 (July 20, 2018)

First major release.
