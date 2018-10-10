# icepick-mapbox-style
The library that combines [Icepick](https://github.com/aearly/icepick) and [Mapbox style spec](https://www.mapbox.com/mapbox-gl-js/style-spec/)

[![stability-unstable](https://img.shields.io/badge/stability-unstable-yellow.svg)][stability]
[![Build Status](https://circleci.com/gh/orangemug/icepick-mapbox-style.png?style=shield)][circleci]
[![Dependency Status](https://david-dm.org/orangemug/icepick-mapbox-style.svg)][dm-prod]
[![Dev Dependency Status](https://david-dm.org/orangemug/icepick-mapbox-style/dev-status.svg)][dm-dev]

[stability]:   https://github.com/orangemug/stability-badges#unstable
[circleci]:    https://circleci.com/gh/orangemug/icepick-mapbox-style
[dm-prod]:     https://david-dm.org/orangemug/icepick-mapbox-style
[dm-dev]:      https://david-dm.org/orangemug/icepick-mapbox-style#info=devDependencies

Built for the [Maputnik editor](https://github.com/maputnik/editor), but should hopefully be generally useful.

Why does this exist?

 - If we have an immutable data structure we can improve rendering performance in react-like UI frameworks by checking object equality
 - More robust by having a library to deal with changes

Features include

 - All changes get validated against the style spec
 - Helper methods for modifying data specific to the style spec
 - Can validate against any version of style spec


## Install
To install

```
npm install orangemug/icepick-mapbox-style --save
```


## API
General methods

 - `current` - the current immutable object
 - `history` - array of immutable objects
 - `canUndo()`
 - `undo()`
 - `canRedo()`
 - `redo()`
 - `transaction(fn)`

[MapboxGL spec](https://www.mapbox.com/mapbox-gl-js/style-spec) specific. These methods are chainable

 - `merge(modifier)`
 - `modifyRoot(keyPath, modifier)`
 - `removeRoot(keyPath)`
 - `modifyLayer(id, modifier)`
 - `renameLayer(id, newId)`
 - `removeLayer(id)`
 - `modifySource(id, modifier)`
 - `removeSource(id)`
 - `renameSource(id, newId)`

Note: These also validate the style after each change

Where `modifier` is either a

 - `Function(obj)`
   - `Function`'s can also return object which will run a diff against the current object
 - `Object`/`Array`/`Number`/`String`/`Boolean`
   - The change to apply. Note, that this runs a diff against the source object


## Usage
Creating a new style

```js
const IcepickMapboxStyle = require("icepick-mapbox-style");

const style = new IcepickMapboxStyle();

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


## FAQ

> Why icepick and not immutable.js

Because

 1. It's a "tiny (1kb min/gzipped), zero-dependency library"
 2. It's fast <https://github.com/aearly/icepick-benchmarks>



## Ideas

 - `current` - the current commited state
 - `dirty` - the dirty un-commited state
 - `commit()` - commit the changes to the history
 - `rollback()` - reset dirty state to `current` state



## License
[MIT](LICENSE)

