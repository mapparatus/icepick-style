const diff      = require("deep-diff");
const get       = require("lodash.get");
const icepick   = require("icepick");
const set       = require("lodash.set");
const styleSpec = require("@mapbox/mapbox-gl-style-spec");
const unset     = require("lodash.unset");


const INVALID_ROOT_KEYS = [
  "layers",
  "sources"
];

function mutateObjectWithChanges (doc, newDoc) {
  const changes = diff(doc, newDoc);

  if (changes) {
    changes.forEach(function(change) {
      if(change.kind === "D") {
        // console.log(">> A")
        unset(doc, change.path);
      }
      else {
        // if(change.path) {
        //   console.log(change);
        //   let changeObj = change.rhs;
        //   if (change.kind === "N") {
        //     if(Array.isArray(change.rhs)) {
        //       changeObj = [];
        //     }
        //     else if (typeof(change.rhs) === "object") {
        //       changeObj = {};
        //     }
        //   }
        //   console.log(">> B", changeObj)
        //   set(doc, change.path, changeObj);
        //   if(change.kind === "N" && typeof(change.rhs) === "object") {
        //     console.log("HERE");
        //     const changedDoc = get(doc, change.path);
        //     console.log(changedDoc, change.rhs);
        //     objectAssignDeep(changedDoc, change.rhs);
        //     set(doc, change.path, changedDoc);
        //   }
        // }
        if (change.kind === "A") {
          if(change.index < doc.length) {
            // console.log(">> B", change)
            if(change.kind = "N" && typeof(change.rhs) === "object") {
              doc.insertAt(change.index, Array.isArray(change.rhs) ? [] : {});
              objectAssignDeepAlt(change[index], [], change.rhs) 
            }
            else {
              doc.insertAt(change.index, change.item.rhs);
            }
          }
          else {
            // console.log(">> C", change)
            if(change.kind = "N" && typeof(change.rhs) === "object") {
              const newIndex = doc.length;
              doc.push(Array.isArray(change.rhs) ? [] : {});
              objectAssignDeepAlt(change[newIndex], [], change.rhs) 
            }
            else {
              doc[change.path].push(change.item.rhs);
            }
          }
          // if(change.index < doc.length) {
          //   console.log(">> C")
          //   doc.insertAt(change.index, change.item.rhs);
          // }
          // else {
          //   console.log(">> D")
          //   doc.push(change.item.rhs);
          // }
        }
        else {
          // console.log(">> D", change)
          if(change.kind = "N" && typeof(change.rhs) === "object") {
            // console.log(">>> DEEP", change)
            objectAssignDeepAlt(doc, change.path, change.rhs);
          }
          else {
            // console.log("NO DEEP", change);
            set(doc, change.path, change.rhs);
          }
        }
      }
    })
  }
}

function argToFn (arg) {
  if(typeof(arg) === "function") {
    return arg;
  }
  else {
    return function(doc) {
      return arg;
    }
  }
}

class IcepickMapboxStyle {

  constructor (inputObj, opts={}) {
    opts = {
      styleSpec: styleSpec.latest,
      maxHistoryLength: 100,
      ...opts
    }

    this._maxHistoryLength = opts.maxHistoryLength;
    this._styleSpec = opts.styleSpec;

    this.current = icepick.freeze(inputObj || {
      "version": 8,
      "name": "",
      "metadata": {},
      "sources": {},
      "glyphs": "https://maputnik.github.io/glyphs/{fontstack}/{range}.pbf",
      "sprites": "https://maputnik.github.io/sprites/starter",
      "layers": []
    });
  }

  _change (fn) {
    this.doc = Automerge.change(this.doc, (doc) => {
      fn(doc);
 
      const validation = styleSpec.validate(
        doc.style
      );

      const errors = validation.map(error => error.message);

      doc.isValid = !!validation;
      // mutateObjectWithChanges(doc.errors, errors || []);
    })
  }

  /**
   * General methods
   */
  change (arg) {
    const fn = argToFn(arg);
    this._change((doc) => {
      const ret = fn(doc);
      if (ret) {
        mutateObjectWithChanges(doc.style, ret);
      }
    })
  }

  merge () {
    const tmpDoc = Automerge.merge(this.doc, newDoc);
    this.change(tmpDoc);
  }

  getChanges (newDoc) {
    return Automerge.getChanges(this.doc, newDoc);
  }

  applyChanges (newDoc) {
    return Automerge.applyChanges(this.doc, newDoc);
  }

  canUndo () {
    return Automerge.canUndo(this.doc);
  }

  undo () {
    return Automerge.undo(this.doc);
  }

  canRedo () {
    return Automerge.canRedo(this.doc);
  }

  redo () {
    return Automerge.redo(this.doc);
  }

  diff (newDoc) {
    return Automerge.diff(this.doc, newDoc);
  }

  /**
   * Style functions
   */
  modifyRoot (key, arg) {
    const fn = argToFn(arg);

    if(INVALID_ROOT_KEYS.indexOf(key) > -1) {
      const keyTitlecase = key.charAt(0).toUpperCase()+key.slice(1);
      throw new Error(`Can't modify ${key} use *${keyTitlecase} helper method instead`);
    }

    this._change((doc) => {
      if(!doc.style[key]) {
        doc.style[key] = {};
      }
      const obj = doc.style[key];
      const ret = fn(obj);
      if (ret) {
        if(typeof(ret) === "object") {
          // console.log(">> A", ret);
          mutateObjectWithChanges(doc.style[key], ret);
        }
        else {
          // console.log(">> B");
          doc.style[key] = ret;
        }
      }
    })
  }

  removeRoot(keyPath) {
    this._change((doc) => {
      unset(doc, keyPath);
    })
  }

  modifySource (key, arg) {
    const fn = argToFn(arg);

    this._change((doc) => {
      if(!doc.style.sources[key]) {
        doc.style.sources[key] = {};
      }
      const obj = doc.style.sources[key];
      const ret = fn(obj);
      if (ret) {
        mutateObjectWithChanges(obj, ret);
      }
    })
  }

  renameSource (currentId, newId) {
    throw "TODO";
  }

  removeSource (id) {
    this._change((doc) => {
      unset(doc.sources, id);
    })
  }

  modifyLayer (id, arg) {
    const fn = argToFn(arg);

    this._change((doc) => {
      if(!doc.style.layers[key]) {
        doc.style.layers[key] = [];
      }
      const obj = doc.style.layers.find(layer => layer.id == id);
      const ret = fn(obj);
      if (ret) {
        mutateObjectWithChanges(obj, ret);
      }
    })
  }

  renameLayer (currentId, newId) {
    throw "TODO";
  }

  removeLayer(id) {
    this._change((doc) => {
      const idx = doc.style.layers.findIndex(layer => layer.id == id);
      doc.style.layers.splice(idx, 1);
    })
  }

}

module.exports = IcepickMapboxStyle;
