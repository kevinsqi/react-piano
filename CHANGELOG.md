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
