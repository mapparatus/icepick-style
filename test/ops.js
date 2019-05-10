const assert = require("assert");
const IcepickStyle = require("../");


describe("ops", () => {
  it("constructor(undefined)", () => {
    const style = new IcepickStyle();
    assert.equal(style.history.length, 1);
    assert.deepEqual(style.current, {
      "version": 8,
      "sources": {},
      "layers": []
    });
  });

  it("constructor([style])", () => {
    const style = new IcepickStyle({
      "version": 8,
      "sources": {},
      "layers": [],
      "center": [0.111, 1.111]
    });

    assert.equal(style.history.length, 1);
    assert.deepEqual(style.current, {
      "version": 8,
      "sources": {},
      "layers": [],
      "center": [0.111, 1.111]
    });
  });

  it("canUndo()", () => {
    const style = new IcepickStyle({
      "version": 8,
      "sources": {},
      "layers": [],
    });

    assert.equal(style.canUndo(), false);
    style.modifyRoot("name", "foo bar");
    assert.equal(style.canUndo(), true);
  });

  it("undo()", () => {
    const style = new IcepickStyle({
      "version": 8,
      "sources": {},
      "layers": [],
    });

    style.modifyRoot("name", "foo bar");
    assert.deepEqual(style.current, {
      "version": 8,
      "sources": {},
      "layers": [],
      "name": "foo bar"
    });
    style.undo();
    assert.deepEqual(style.current, {
      "version": 8,
      "sources": {},
      "layers": [],
    });
    assert.equal(style.canUndo(), false);
  });

  it("undo() past stack", () => {
    const style = new IcepickStyle({
      "version": 8,
      "sources": {},
      "layers": [],
    });

    style.modifyRoot("name", "foo bar");
    style.undo();

    let err;
    try {
      style.undo();
    }
    catch (_err) {
      err = _err;
    }
    assert(err);
    assert.equal(err.message, "No items to undo in stack");
  });

  it("canRedo()", () => {
    const style = new IcepickStyle({
      "version": 8,
      "sources": {},
      "layers": [],
    });

    style.modifyRoot("name", "foo bar");
    style.undo();
    assert.equal(style.canRedo(), true);
  });

  it("redo()", () => {
    const style = new IcepickStyle({
      "version": 8,
      "sources": {},
      "layers": [],
    });

    style.modifyRoot("name", "foo bar");
    style.undo();
    assert.deepEqual(style.current, {
      "version": 8,
      "sources": {},
      "layers": [],
    });
    style.redo();
    assert.deepEqual(style.current, {
      "version": 8,
      "sources": {},
      "layers": [],
      "name": "foo bar"
    });
  });

  it("redo() beyond stack", () => {
    const style = new IcepickStyle({
      "version": 8,
      "sources": {},
      "layers": [],
    });

    style.modifyRoot("name", "foo bar");
    style.undo();
    style.redo();

    let err;
    try {
      style.redo();
    }
    catch (_err) {
      err = _err;
    }
    assert(err);
    assert(err.message, "No items to redo in stack");
  })

  it("merge()", () => {
    const style = new IcepickStyle({
      "version": 8,
      "sources": {},
      "layers": [],
      "metadata": {
        "foo": {"bar": 1},
      }
    });
    assert.equal(style.history.length, 1);
    style.merge({
      "metadata": {
        "baz": "text",
      }
    })
    assert.equal(style.history.length, 2);
    assert.deepEqual(style.current, {
      "version": 8,
      "sources": {},
      "layers": [],
      "metadata": {
        "foo": {"bar": 1},
        "baz": "text",
      }
    });

    assert.equal(style.current.sources, style.history[0].sources);
    assert.equal(style.current.layers, style.history[0].layers);
    assert.notEqual(style.current.metadata, style.history[0].metadata);
    assert.equal(style.current.metadata.foo, style.history[0].metadata.foo);
  });
})
