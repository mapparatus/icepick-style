/* eslint-env node, mocha */
const assert = require('assert');
const IcepickStyle = require('..');

describe('layer', () => {
	describe('addLayer', () => {
		it('new no existing layers', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: []
			});

			style.addLayer('test-layer', {
				type: 'background'
			});

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'test-layer',
						type: 'background'
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.notStrictEqual(style.current.layers, style.history[0].style.layers);
		});

		it('new with existing layers', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'test-layer',
						type: 'background'
					}
				]
			});

			assert.throws(
				() => {
					style.addLayer('test-layer', {
						type: 'background'
					});
				},
				{
					message: 'Layer already exists'
				}
			);
		});

		it('new with existing layers at index', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'before',
						type: 'background'
					},
					{
						id: 'after',
						type: 'background'
					}
				]
			});

      style.addLayer('test-layer', {
        type: 'background'
      }, 1);

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'before',
						type: 'background'
					},
					{
						id: 'test-layer',
						type: 'background'
					},
					{
						id: 'after',
						type: 'background'
					},
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.notStrictEqual(style.current.layers, style.history[0].style.layers);
			assert.strictEqual(style.current.layers[0], style.history[0].style.layers[0]);
			assert.strictEqual(style.current.layers[2], style.history[0].style.layers[1]);
		});
	});

	describe('modifyLayer', () => {
		it('new no existing layers', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: []
			});

			style.modifyLayer('test-layer', {
				type: 'background'
			});

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'test-layer',
						type: 'background'
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.notStrictEqual(style.current.layers, style.history[0].style.layers);
		});

		it('new with existing layers', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background'
					}
				]
			});

			style.modifyLayer('test-layer', {
				type: 'background'
			});

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background'
					},
					{
						id: 'test-layer',
						type: 'background'
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.notStrictEqual(style.current.layers, style.history[0].style.layers);
			assert.strictEqual(style.current.layers[0], style.history[0].style.layers[0]);
		});

		it('modify', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						layout: {},
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			style.modifyLayer('foo', {
				id: 'foo',
				type: 'background',
				layout: {},
				paint: {
					'background-color': 'rgb(255,255,255)'
				}
			});

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						layout: {},
						paint: {
							'background-color': 'rgb(255,255,255)'
						}
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.notStrictEqual(style.current.layers, style.history[0].style.layers);
			assert.notStrictEqual(
				style.current.layers[0],
				style.history[0].style.layers[0]
			);
			assert.strictEqual(
				style.current.layers[0].layout,
				style.history[0].style.layers[0].layout
			);
			assert.notStrictEqual(
				style.current.layers[0].paint,
				style.history[0].style.layers[0].paint
			);
		});

		it('modify (remove key)', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						layout: {},
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			style.modifyLayer('foo', {
				id: 'foo',
				type: 'background',
				paint: {
					'background-color': 'rgb(255,255,255)'
				}
			});

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						paint: {
							'background-color': 'rgb(255,255,255)'
						}
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.notStrictEqual(style.current.layers, style.history[0].style.layers);
			assert.notStrictEqual(
				style.current.layers[0],
				style.history[0].style.layers[0]
			);
			assert.notStrictEqual(
				style.current.layers[0].paint,
				style.history[0].style.layers[0].paint
			);
		});

		it('noop', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			style.modifyLayer('foo', {
				id: 'foo',
				type: 'background',
				paint: {
					'background-color': 'rgb(0,0,0)'
				}
			});

			assert.strictEqual(style.history.length, 1);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.strictEqual(style.current.layers, style.history[0].style.layers);
		});
	});

	describe('renameLayer', () => {
		it('missing id', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'baz',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			let err;
			try {
				style.renameLayer('foo', 'bar');
			} catch (error) {
				err = error;
			}

			assert(err);
			assert.strictEqual(err.message, 'Missing layer: \'foo\'');

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.strictEqual(style.current.layers, style.history[0].style.layers);
		});

		it('modify', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						layout: {},
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			style.renameLayer('foo', 'bar');
			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'bar',
						type: 'background',
						layout: {},
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.notStrictEqual(style.current.layers, style.history[0].style.layers);
			assert.notStrictEqual(
				style.current.layers[0],
				style.history[0].style.layers[0]
			);
			assert.strictEqual(
				style.current.layers[0].layout,
				style.history[0].style.layers[0].layout
			);
			assert.strictEqual(
				style.current.layers[0].paint,
				style.history[0].style.layers[0].paint
			);
		});

		it('noop', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			style.renameLayer('foo', 'foo');
			assert.strictEqual(style.history.length, 1);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.strictEqual(style.current.layers, style.history[0].style.layers);
			assert.strictEqual(style.current.layers[0], style.history[0].style.layers[0]);
		});
	});

	describe('removeLayer', () => {
		it('missing id', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			style.removeLayer('bar');
			assert.strictEqual(style.history.length, 1);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.strictEqual(style.current.layers, style.history[0].style.layers);
		});

		it('valid id', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					},
					{
						id: 'bar',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					},
					{
						id: 'baz',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			style.removeLayer('bar');
			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'foo',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					},
					{
						id: 'baz',
						type: 'background',
						paint: {
							'background-color': 'rgb(0,0,0)'
						}
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.notStrictEqual(style.current.layers, style.history[0].style.layers);
			assert.strictEqual(style.current.layers[0], style.history[0].style.layers[0]);
			assert.strictEqual(style.current.layers[1], style.history[0].style.layers[2]);
		});
	});

  describe("moveLayer", () => {
		it('forward', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'a',
						type: 'background'
					},
					{
						id: 'b',
						type: 'background'
					},
					{
						id: 'c',
						type: 'background'
					},
					{
						id: 'd',
						type: 'background'
					},
					{
						id: 'e',
						type: 'background'
					}
				]
			});

      style.moveLayer(1, 3);

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'a',
						type: 'background'
					},
					{
						id: 'c',
						type: 'background'
					},
					{
						id: 'b',
						type: 'background'
					},
					{
						id: 'd',
						type: 'background'
					},
					{
						id: 'e',
						type: 'background'
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.notStrictEqual(style.current.layers, style.history[0].style.layers);
			assert.strictEqual(style.current.layers[0], style.history[0].style.layers[0]);
			assert.strictEqual(style.current.layers[2], style.history[0].style.layers[1]);
		});

		it('backward', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'a',
						type: 'background'
					},
					{
						id: 'b',
						type: 'background'
					},
					{
						id: 'c',
						type: 'background'
					},
					{
						id: 'd',
						type: 'background'
					},
					{
						id: 'e',
						type: 'background'
					}
				]
			});

      style.moveLayer(3, 1);

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {},
				layers: [
					{
						id: 'a',
						type: 'background'
					},
					{
						id: 'd',
						type: 'background'
					},
					{
						id: 'b',
						type: 'background'
					},
					{
						id: 'c',
						type: 'background'
					},
					{
						id: 'e',
						type: 'background'
					}
				]
			});

			assert.strictEqual(style.current.sources, style.history[0].style.sources);
			assert.notStrictEqual(style.current.layers, style.history[0].style.layers);
			assert.strictEqual(style.current.layers[0], style.history[0].style.layers[0]);
			assert.strictEqual(style.current.layers[2], style.history[0].style.layers[1]);
		});
  });

  describe("getLayerById", () => {
		it('valid', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'a',
						type: 'background'
					},
					{
						id: 'b',
						type: 'background'
					},
					{
						id: 'c',
						type: 'background'
					},
				]
			});

      const out = style.getLayerById('b');
      assert.deepStrictEqual(out, {
        id: 'b',
        type: 'background'
      });

			assert.strictEqual(style.history.length, 1);
		});

		it('invalid', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [
					{
						id: 'a',
						type: 'background'
					},
					{
						id: 'b',
						type: 'background'
					},
					{
						id: 'c',
						type: 'background'
					},
				]
			});

      const out = style.getLayerById('f');
      assert.strictEqual(out, undefined);
			assert.strictEqual(style.history.length, 1);
		});
  })
});
