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
