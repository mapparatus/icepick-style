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

 - If we have an immutable data structure we can improve rendering performance in react-like UI frameworks by checking object equality
 - More robust by having a library to deal with changes

Features include

 - All changes get validated against the style spec
 - Helper methods for modifying data specific to the style spec
 - Can validate against any version of style spec


## Install
To install

```
npm install mgljs-contrib/icepick-style --save
```


## API
General methods

 - `current` - the current immutable object
 - `history` - array of immutable objects
 - `canUndo()`
 - `undo()`
 - `canRedo()`
 - `redo()`
 - `merge(styleObject)`

[MapboxGL spec](https://www.mapbox.com/mapbox-gl-js/style-spec) specific. These methods are chainable

 - `modifyRoot(keyPath, modifier)`
 - `removeRoot(keyPath)`
 - `modifyLayer(id, modifier)`
 - `renameLayer(id, newId)`
 - `removeLayer(id)`
 - `modifySource(id, modifier)`
 - `removeSource(id)`
 - `renameSource(id, newId)`

Note: These also validate the style after each change

Where `modifier` is either the new value.


## Usage
Creating a new style

```js
const IcepickMapboxStyle = require("icepick-style");

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

