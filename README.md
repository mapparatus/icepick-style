# icepick-style
The library that combines [Icepick](https://github.com/aearly/icepick) and [Mapbox style spec](https://www.mapbox.com/mapbox-gl-js/style-spec/)

[![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg)][stability]
[![Build Status](https://circleci.com/gh/mgljs-contrib/icepick-style.png?style=shield)][circleci]
[![Dependency Status](https://david-dm.org/mgljs-contrib/icepick-style.svg)][dm-prod]
[![Dev Dependency Status](https://david-dm.org/mgljs-contrib/icepick-style/dev-status.svg)][dm-dev]

[stability]:   https://github.com/orangemug/stability-badges#work-in-progress
[circleci]:    https://circleci.com/gh/mgljs-contrib/icepick-style
[dm-prod]:     https://david-dm.org/mgljs-contrib/icepick-style
[dm-dev]:      https://david-dm.org/mgljs-contrib/icepick-style#info=devDependencies


Built for the [Maputnik editor](https://github.com/maputnik/editor), but should hopefully be generally useful.

Why does this exist?

 - If we have an immutable data structure we can improve rendering performance in UI frameworks that checking object equality when updating the UI (for example React)
 - More robust by having a library to deal with changes

Features include

 - Methods for modifying data specific to the style spec, keeping object mutations to a minimum
 - In library style specification validation


## Install
To install

```
npm install mgljs-contrib/icepick-style --save
```


## API
General methods

 - `valid` - is the current style valid
 - `errors` - list of current errors
 - `current` - the current immutable object
 - `history` - array of immutable objects
 - `canUndo()` - is there anything to undo in the history stack
 - `undo()` - move backward in the history stack
 - `canRedo()` - is there anything to redo in the history stack
 - `redo()` - move forward in the history stack
 - `merge(styleObject)` - merge a style into another style
 - `replace(styleObject)` - replace the style keeping object equality where possible
 - `addHook(key, fn)` - add a hook (see [hooks](#hooks))
 - `removeHook(key, fn)` - remove a hook (see [hooks](#hooks))

[MapboxGL spec](https://www.mapbox.com/mapbox-gl-js/style-spec) specific. These methods are chainable

 - `addRoot(keyPath, value)`
 - `modifyRoot(keyPath, value)`
 - `removeRoot(keyPath)`
 - `addLayer(id, value)`
 - `modifyLayer(id, value)`
 - `renameLayer(id, newId)`
 - `removeLayer(id)`
 - `addSource(id, value)`
 - `modifySource(id, value)`
 - `removeSource(id)`
 - `renameSource(id, newId)`


## Usage
Creating a new style

```js
const IcepickStyle = require("icepick-style");

const style = new IcepickStyle();

style
  .modifyRoot("name", "Test style")
  .modifySource("openmaptiles", {...});

// Sometime later....
style
  .modifySource("openmaptiles", function(doc) {
    doc.maxZoom = 13;
  });

assert.equal(style.current.name, "Test style");

assert.equal(style.history.length, 2);
assert.equal(style.current.sources.openmaptiles.maxZoom, 13);
assert.equal(style.history[0].sources.openmaptiles.maxZoom, 16);

```

You can also start a transaction to group changes into a single history entry

```js
style
  .transaction((style) => {
    style
      .modifyRoot("name", "Foo bar")
      .modifyLayer((layer) => {
        layer.maxZoom = 14;
      })
  })

// Only a single history item
assert.equal(style.history.length, 1);
```


## Hooks
It also comes with a _validate_ hook which will validate the current state of the style and output errors to `style.errors`, see an example below

```js
const IcepickStyle = require('icepick-style');
const mapboxGlValidateHook = require('icepick-style/hooks/validate/mapbox-gl');

const style = new IcepickStyle();
style.addHook('validate', mapboxGlValidateHook);

style.addLayer('foo', {
  type: 'background',
  paint: 1
});

assert.deepStrictEqual(
  style.errors[0].message,
  'layers[0].paint: object expected, number found'
);
```


## FAQ

> Why icepick and not immutable.js

Because

 1. It's a "tiny (1kb min/gzipped), zero-dependency library"
 2. It's fast <https://github.com/aearly/icepick-benchmarks>


## License
[MIT](LICENSE)

