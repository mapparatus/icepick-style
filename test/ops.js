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
        "foo": "text",
      }
    });
    assert.equal(style.history.length, 1);
    style.merge({
      "metadata": {
        "bar": "text",
      }
    })
    assert.equal(style.history.length, 2);
    assert.deepEqual(style.current, {
      "version": 8,
      "sources": {},
      "layers": [],
      "metadata": {
        "foo": "text",
        "bar": "text",
      }
    });
  });
})
