const icepick   = require("icepick");
const styleSpec = require("@mapbox/mapbox-gl-style-spec");


const INVALID_ROOT_KEYS = [
  "layers",
  "sources"
];

class IcepickMapboxStyle {

  constructor (inputStyle, opts={}) {
    opts = {
      styleSpec: styleSpec.latest,
      maxHistoryLength: 100,
      ...opts
    }

    this._maxHistoryLength = opts.maxHistoryLength;
    this._styleSpec = opts.styleSpec;
    this.current = icepick.freeze(inputStyle || {
      "version": 8,
      "name": "",
      "metadata": {},
      "sources": {},
      "glyphs": "https://maputnik.github.io/glyphs/{fontstack}/{range}.pbf",
      "sprites": "https://maputnik.github.io/sprites/starter",
      "layers": []
    });

    this.history = icepick.freeze([
      this.current
    ]);
    this._historyIdx = 1;

  }

  transaction(fn) {
    this._inTransaction = true;
    try {
      fn();
    }
    finally {
      this._pushHistory(this.current);
      this._inTransaction = false;
    }
  }

  _pushHistory (newDoc) {
    if(newDoc !== this.current) {
      let endIdx = 0;
      if(this._historyIdx < this.history.length) {
        endIdx = this.history.length;
      }
      this.history = icepick.splice(this.history, this._historyIdx, endIdx, newDoc);
      this.current = newDoc;
    }
  }

  /**
   * General methods
   */
  merge (obj) {
    const newDoc = icepick.merge(this.current, obj);
    this._pushHistory(newDoc);
  }

  canUndo () {
    return this._historyIdx > 0;
  }

  undo () {
    if(!this.canUndo()) {
      throw new Error("No items in undo stack");
    }
    this._historyIdx--;
    this.current = this.current[this._historyIdx];
  }

  canRedo () {
    this._historyIdx < this.history.length - 1;
  }

  redo () {
    if(!this.canRedo()) {
      throw new Error("No items in redo stack");
    }
    this._historyIdx++;
    this.current = this.current[this._historyIdx];
  }

  /**
   * Style functions
   */
  modifyRoot (key, obj) {
    if(INVALID_ROOT_KEYS.indexOf(key) > -1) {
      const keyTitlecase = key.charAt(0).toUpperCase()+key.slice(1);
      throw new Error(`Can't modify ${key} use modify${keyTitlecase} method`);
    }

    const currentValue = this.current[key];
    let newDoc;

    if (typeof(currentValue) === "object") {
      newDoc = icepick.setIn(
        this.current,
        [key],
        icepick.merge(
          this.current[key],
          obj
        )
      );
    }
    else {
      newDoc = icepick.setIn(
        this.current,
        [key],
        obj
      );
    }

    this._pushHistory(newDoc);
    return this;
  }

  removeRoot(key) {
    const newDoc = icepick.unsetIn(this.current, [key])
    this._pushHistory(newDoc);
    return this;
  }

  modifySource (id, arg) {
    const newDoc = icepick.setIn(
      this.current,
      ["sources", id],
      icepick.merge(
        this.current.sources[id], {
        type: "raster"
      })
    );
    this._pushHistory(newDoc);
    return this;
  }

  renameSource (currentId, newId) {
    const source = this.current.sources[currentId];
    const change1 = icepick.unsetIn(
      this.current,
      ["sources", id]
    );

    const change2 = icepick.setIn(
      this.current,
      ["sources", id],
      sources
    );

    this._pushHistory(change2);
    return this;
  }

  removeSource (id) {
    const newDoc = icepick.unsetIn(
      this.current,
      ["sources", id]
    );
    this._pushHistory(newDoc);
    return this;
  }

  _findLayerIdxById (id) {
    return this.current.layers.find((layer) => {
      return layer.id === id;
    });
  }

  modifyLayer (id, arg) {
    const idx = this._findLayerIdxById(id);

    if(!this.current.layers || !Array.isArray(this.current.layers)) {
      this.current = icepick.set("layers", []);
    }

    const newDoc = icepick.setIn(
      this.current,
      ["layers", idx || this.current.layers.length],
      icepick.merge(
        this.current.layers[idx] || {},
        {...arg, id},
      )
    );

    this._pushHistory(newDoc);
    return this;
  }

  renameLayer (oldId, newId) {
    const idx = this._findLayerIdxById(oldId);

    const newDoc = icepick.setIn(
      ["layers", idx, "id"],
      newId
    );
    this._pushHistory(newDoc);
    return this;
  }

  removeLayer(id) {
    const idx = this._findLayerIdxById(id);

    const newDoc = icepick.unsetIn(
      ["layers", idx]
    );
    this._pushHistory(newDoc);
    return this;
  }

}

module.exports = IcepickMapboxStyle;
