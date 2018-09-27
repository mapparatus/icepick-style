const Automerge = require('automerge')
const styleSpec = require("@mapbox/mapbox-gl-style-spec");
const diff = require("deep-diff");
const set = require("lodash.set");
const get = require("lodash.get");
const unset = require("lodash.unset");
const objectAssignDeep = require("object-assign-deep");

const INVALID_KEYS = [
  "layers",
  "sources"
];

function objLeaves(obj, fn, path=[]) {
  if(typeof(obj) !== "object") {
    fn(path, obj);
  }
  else {
    if(path.length > 0) {
      fn(path, {})
    }
    for(var k in obj) {
      var keyPath;
      if(!obj.hasOwnProperty(k)) continue;

      keyPath = path.concat(k);

      if(
        typeof(obj[k]) === "object"
      ) {
        if(Array.isArray(obj[k])) {
          fn(keyPath, [])
          obj[k].forEach(function(item, idx) {
            objLeaves(item, fn, keyPath.concat(idx));
          })
        }
        else {
          objLeaves(obj[k], fn, keyPath);
        }
      } else {
        fn(keyPath, obj[k]);
      }
    }
  }
}

function objectAssignDeepAlt(a, b) {
  objLeaves(b, function(path, value) {
    console.log("??????", path, value)
    set(a, path, value);
    console.log("ZZZZZ", JSON.stringify(a))
  })
}

function mutateObjectWithChanges (doc, newDoc) {
  const changes = diff(doc, newDoc);

  if (changes) {
    console.log("changes", changes)
    changes.forEach(function(change) {
      if(change.kind === "D") {
        console.log(">> A")
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
            console.log(">> B", change)
            if(change.kind = "N" && typeof(change.rhs) === "object") {
              doc.insertAt(change.index, Array.isArray(change.rhs) ? [] : {});
              objectAssignDeepAlt(change[index], change.rhs) 
            }
            else {
              doc.insertAt(change.index, change.item.rhs);
            }
          }
          else {
            console.log(">> C", change)
            if(change.kind = "N" && typeof(change.rhs) === "object") {
              const newIndex = doc.length;
              doc.push(Array.isArray(change.rhs) ? [] : {});
              objectAssignDeepAlt(change[newIndex], change.rhs) 
            }
            else {
              doc.push(change.item.rhs);
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
          console.log(">> D", change)
          if(change.kind = "N" && typeof(change.rhs) === "object") {
            console.log(">>> DEEP", change)
            objectAssignDeepAlt(doc, change.rhs);
          }
          else {
            console.log("NO DEEP", change);
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

const root = {
  modify: function(key, arg) {
    const fn = argToFn(arg);

    if(INVALID_KEYS.indexOf(key) > -1) {
      throw new Error(`Can't modify ${key} use ${key}.* helper method instead`);
    }

    this._change((doc) => {
      if(!doc.style[key]) {
        doc.style[key] = {};
      }
      const obj = doc.style[key];
      const ret = fn(obj);
      if (ret) {
        if(typeof(ret) === "object") {
          console.log(">> A", ret);
          mutateObjectWithChanges(doc.style[key], ret);
        }
        else {
          console.log(">> B");
          doc.style[key] = ret;
        }
      }
    })
  },
  remove(keyPath) {
    this._change((doc) => {
      unset(doc, keyPath);
    })
  }
}

const sources = {
  modify: function(key, arg) {
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
  },
  remove(id) {
    this._change((doc) => {
      unset(doc.sources, id);
    })
  }
}

const layers = {
  modify: function(id, arg) {
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
  },
  remove(id) {
    this._change((doc) => {
      const idx = doc.style.layers.findIndex(layer => layer.id == id);
      doc.style.layers.splice(idx, 1);
    })
  }
}

function bindAll(scope, obj) {
  const out = {};
  for(let k in obj) {
    out[k] = obj[k].bind(scope)
  }
  return out;
}

class MapboxStyle {

  constructor (inputObj, opts={}) {
    this.doc = Automerge.init();

    this._change((doc) => {
      doc.isValid = true;
      doc.errors = [];
      doc.style = inputObj || {
        "version": 8,
        "name": "",
        "metadata": {},
        "sources": {},
        "glyphs": "",
        "sprites": "",
        "layers": []
      }
    })
    this._stypeSpec = opts.styleSpec || styleSpec.latest;

    this.root = bindAll(this, root);
    this.sources = bindAll(this, sources);
    this.layers = bindAll(this, layers);
  }

  _change (fn) {
    this.doc = Automerge.change(this.doc, (doc) => {
      fn(doc);
 
      const validation = styleSpec.validate(
        doc.style,
        this._stypeSpec
      );

      const errors = validation.map(error => error.message);

      doc.isValid = !!validation;
      // mutateObjectWithChanges(doc.errors, errors || []);
    })
  }

  change (fn) {
    this._change((doc) => {
      const ret = fn(doc);
      if (ret) {
        mutateObjectWithChanges(doc, ret);
      }
    })
  }

  getHistory () {
    return Automerge.getHistory(this.doc);
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

}

const mgl = new MapboxStyle();

// mgl.root.modify("name", function(doc) {
//   return "foo"
// });

// mgl.root.modify("center", function(doc) {
//   return [1,2];
// });

// mgl.root.modify("name", function(doc) {
//   return "bar"
// });

// mgl.root.modify("center", function(doc) {
//   return [1,3];
// });

// mgl.sources.modify("mapbox-streets", function(doc) {
//   return {
//     "type": "vector",
//     "tiles": [
//       "http://a.example.com/tiles/{z}/{x}/{y}.pbf",
//       "http://b.example.com/tiles/{z}/{x}/{y}.pbf"
//     ],
//     "maxzoom": 14
//   };
// });

mgl.sources.modify("mapbox-streets", {
  "foo": {
    "bar":  [{a: 2}]
  },
});

mgl.sources.modify("mapbox-streets", {
  "foo": {
    "bar":  [{a: 4}]
  },
});

// mgl.root.modify("name", function(doc) {
//   return "foobar"
// })

// mgl.root.modify("name", function(doc) {
//   return "foobar!"
// })

// mgl.root.modify("name", "hello")

// mgl.root.modify("metadata", {
//   "foo": {
//     "bar": 2
//   }
// })

// mgl.root.modify("metadata", {
//   "foo": {
//     "bar": 3
//   }
// })


console.log(
  JSON.stringify(
    mgl.getHistory(),
    null,
    2
  )
);

module.exports = MapboxStyle;
