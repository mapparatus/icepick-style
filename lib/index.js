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
      "sources": {},
      "layers": []
    });

    this.history = icepick.freeze([
      this.current
    ]);
    this._historyIdx = 0;

  }

  _pushHistory (newDoc) {
    if(newDoc !== this.current) {
      let endIdx = 0;
      if(this._historyIdx < this.history.length) {
        endIdx = this.history.length;
      }
      this.history = icepick.splice(this.history, this._historyIdx+1, endIdx, newDoc);
      this._historyIdx = this.history.length-1;
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
    this.current = this.history[this._historyIdx];
  }

  canRedo () {
    return this._historyIdx < this.history.length - 1;
  }

  redo () {
    if(!this.canRedo()) {
      throw new Error("No items in redo stack");
    }
    this._historyIdx++;
    this.current = this.history[this._historyIdx];
  }

  /**
   * Style functions
   */
  modifyRoot (key, obj) {
    if(INVALID_ROOT_KEYS.indexOf(key) > -1) {
      const keyTitlecase = key.charAt(0).toUpperCase()+key.slice(1);
      throw new Error(`Can't modify ${key} use modify* methods instead`);
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
    if(INVALID_ROOT_KEYS.indexOf(key) > -1) {
      const keyTitlecase = key.charAt(0).toUpperCase()+key.slice(1);
      throw new Error(`Can't remove ${key} use remove* methods instead`);
    }

    if (this.current.hasOwnProperty(key)) {
      const newDoc = icepick.unsetIn(this.current, [key])
      this._pushHistory(newDoc);
    }
    return this;
  }

  modifySource (id, arg) {
    const newDoc = icepick.setIn(
      this.current,
      ["sources", id],
      icepick.merge(
        this.current.sources[id] || {}, arg
      )
    );
    this._pushHistory(newDoc);
    return this;
  }

  renameSource (currentId, newId) {
    if (!this.current.sources.hasOwnProperty(currentId)) {
      throw new Error(`Missing source: '${currentId}'`);
    }

    if (currentId !== newId) {
      const source = this.current.sources[currentId];
      const change1 = icepick.unsetIn(
        this.current,
        ["sources", currentId]
      );

      const change2 = icepick.setIn(
        change1,
        ["sources", newId],
        source
      );

      this._pushHistory(change2);
    }
    return this;
  }

  removeSource (id) {
    if (!this.current.sources.hasOwnProperty(id)) {
      throw new Error(`Missing source: '${id}'`);
    }

    const newDoc = icepick.unsetIn(
      this.current,
      ["sources", id]
    );
    this._pushHistory(newDoc);
    return this;
  }

  _findLayerIdxById (id, _default=-1) {
    const idx = this.current.layers.findIndex((layer) => {
      return layer.id === id;
    });
    if (idx < 0) {
      return _default;
    }
    else {
      return idx;
    }
  }

  modifyLayer (id, arg) {
    const idx = this._findLayerIdxById(id, this.current.layers.length);
    let doc = this.current;

    if(!this.current.layers || !Array.isArray(this.current.layers)) {
      doc = icepick.set(doc, "layers", []);
    }

    const newDoc = icepick.setIn(
      doc,
      ["layers", idx],
      icepick.merge(
        this.current.layers[idx] || {},
        {...arg, id},
      )
    );

    this._pushHistory(newDoc);
    return this;
  }

  renameLayer (oldId, newId) {
    if (oldId !== newId) {
      const idx = this._findLayerIdxById(oldId);
      if (idx < 0) {
        throw new Error(`Missing layer: '${oldId}'`);
      }

      const newDoc = icepick.setIn(
        this.current,
        ["layers", idx],
        icepick.merge(
          this.current.layers[idx],
          {id: newId},
        )
      );
      this._pushHistory(newDoc);
    }
    return this;
  }

  removeLayer(id) {
    const idx = this._findLayerIdxById(id);

    if (idx > -1) {
      const newDoc = icepick.setIn(
        this.current,
        ["layers"],
        icepick.splice(this.current.layers, idx, idx)
      );
      this._pushHistory(newDoc);
    }
    return this;
  }

}

module.exports = IcepickMapboxStyle;
