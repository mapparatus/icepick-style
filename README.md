# mgl-style-automerge
Automerge + MapboxGL styles

[![stability-unstable](https://img.shields.io/badge/stability-unstable-yellow.svg)][stability]
[![Build Status](https://circleci.com/gh/orangemug/{proj}.png?style=shield)][circleci]
[![Dependency Status](https://david-dm.org/orangemug/{proj}.svg)][dm-prod]
[![Dev Dependency Status](https://david-dm.org/orangemug/{proj}/dev-status.svg)][dm-dev]

[stability]:   https://github.com/orangemug/stability-badges#unstable
[circleci]:    https://circleci.com/gh/orangemug/{proj}
[dm-prod]:     https://david-dm.org/orangemug/{proj}
[dm-dev]:      https://david-dm.org/orangemug/{proj}#info=devDependencies

Built for the [Maputnik editor](https://github.com/maputnik/editor), but should hopefully be generally useful.

Why

 - If we have an immutable data structure we can improve rendering performance in UI like react by checking object equality
 - An immutable history of change that isn't simply a copy of the entire structure
   - Hopefully this reduces memory footprint, need to confirm this

Features

 - All changes get validated against the style spec
 - Helper methods for modifying data
 - Caches last valid state
 - Can validate against any version of style spec


## Install
To install

```
npm install orangemug/immuatable-mgl-style
```


## Usage
From Automerge scoped to the current document

 - `getHistory`
 - `merge`
 - `getChanges`
 - `applyChanges`
 - `canUndo`
 - `undo`
 - `canRedo`
 - `redo`
 - `diff`
 - `change` (validates on change)

[MapboxGL spec](https://www.mapbox.com/mapbox-gl-js/style-spec) specific. Note these also validate on change

 - `root.modify(keyPath, modifier)`
 - `root.remove(keyPath)`
 - `layer.modify(id, modifier)`
 - `layer.remove(id)`
 - `source.modify(id, modifier)`
 - `source.remove(id)`

Where `modifier` is either a

 - [`Function`] as defined in the Automerge docs
   - `Function`'s can also return object which will diff'ed against the current value
 - [`Object`/`Array`] the change to make, note that this gets diffed

Other methods

 - `doc` - a reference to the Automerge document
 - `forEachSnapshot(offset=0, limit=Number.MAX_SAFE_INTEGER)`


## License
[MIT](LICENSE)

