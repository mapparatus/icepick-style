/* eslint-env node, mocha, */
/* eslint max-nested-callbacks: off */
const assert = require('assert');
const IcepickStyle = require('..');

describe('events', () => {
	describe('change', () => {
    it("fired on change", () => {
      const style = new IcepickStyle({
        version: 8,
        sources: {},
        layers: []
      });

      let called = false;
      style.on('change', () => called = true);

      style.modifyRoot('zoom', 3);
      assert.equal(called, true);
    })

    it("not fired when no change", () => {
      const style = new IcepickStyle({
        version: 8,
        sources: {},
        layers: [],
        zoom: 3
      });

      let called = false;
      style.on('change', () => called = true);

      style.modifyRoot('zoom', 3);
      assert.equal(called, false);
    })
  });
});
