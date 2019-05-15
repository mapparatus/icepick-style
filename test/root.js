/* eslint-env node, mocha, */
/* eslint max-nested-callbacks: off */
const assert = require('assert');
const IcepickStyle = require('..');

describe('root', () => {
	describe('invalid keys', () => {
		[['modifyRoot', 'modify'], ['removeRoot', 'remove'], ['addRoot', 'add']].forEach(
			([fnName, modName]) => {
				describe(fnName, () => {
					['layers', 'sources'].forEach(key => {
						it(key, () => {
							const style = new IcepickStyle({
								version: 8,
								sources: {},
								layers: []
							});

							let err;
							try {
								style[fnName](key, 'foo');
							} catch (error) {
								err = error;
							}

							assert(err);
							assert.strictEqual(
								err.message,
								`Can't ${modName} ${key} use ${modName}* methods instead`
							);
						});
					});
				});
			}
		);
	});

	describe('addRoot', () => {
		it('new', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: []
			});

			style.addRoot('name', 'Foo bar');
			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				name: 'Foo bar',
				sources: {},
				layers: []
			});

			assert.notStrictEqual(style.current, style.history[0]);
			assert.strictEqual(style.current.sources, style.history[0].sources);
			assert.strictEqual(style.current.layers, style.history[0].layers);
		});

		it('existing', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [],
				name: 'Foo bar'
			});

			assert.throws(
				() => {
					style.addRoot('name', 'Foo bar');
				},
				{
					message: 'Already has root element'
				}
			);
		});
	});

	describe('modifyRoot', () => {
		describe('name (string)', () => {
			it('new', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: []
				});

				style.modifyRoot('name', 'Foo bar');
				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					name: 'Foo bar',
					sources: {},
					layers: []
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
			});

			it('modify', () => {
				const style = new IcepickStyle({
					version: 8,
					name: 'original',
					sources: {},
					layers: []
				});

				style.modifyRoot('name', 'Foo bar');
				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					name: 'Foo bar',
					sources: {},
					layers: []
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
			});

			it('noop', () => {
				const style = new IcepickStyle({
					version: 8,
					name: 'original',
					sources: {},
					layers: []
				});

				style.modifyRoot('name', 'original');
				assert.strictEqual(style.history.length, 1);
				assert.deepStrictEqual(style.current, {
					version: 8,
					name: 'original',
					sources: {},
					layers: []
				});

				assert.strictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
			});
		});

		describe('metadata (object)', () => {
			it('new', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: []
				});

				style.modifyRoot('metadata', {foo: 3});

				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: [],
					metadata: {
						foo: 3
					}
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
			});

			it('modify', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: [],
					metadata: {
						foo: 'testing',
						bar: {
							subNonMod: 123,
							subMod: 456
						},
						baz: {}
					}
				});

				style.modifyRoot('metadata', {
					foo: 'altered',
					bar: {
						subNonMod: 123,
						subMod: 100
					},
					baz: {}
				});

				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: [],
					metadata: {
						foo: 'altered',
						bar: {
							subNonMod: 123,
							subMod: 100
						},
						baz: {}
					}
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
				assert.notStrictEqual(
					style.current.metadata,
					style.history[0].metadata
				);
				assert.strictEqual(
					style.current.metadata.baz,
					style.history[0].metadata.baz
				);
			});

			it('noop', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: [],
					metadata: {
						foo: 'testing',
						bar: {
							subNonMod: 123,
							subMod: 456
						},
						baz: {}
					}
				});

				style.modifyRoot('metadata', {
					foo: 'testing',
					bar: {
						subNonMod: 123,
						subMod: 456
					},
					baz: {}
				});

				assert.strictEqual(style.history.length, 1);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: [],
					metadata: {
						foo: 'testing',
						bar: {
							subNonMod: 123,
							subMod: 456
						},
						baz: {}
					}
				});

				assert.strictEqual(style.current, style.history[0]);
			});
		});

		describe('center (array)', () => {
			it('new', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: []
				});

				style.modifyRoot('center', [0.222, 1.222]);

				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: [],
					center: [0.222, 1.222]
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
				assert.notStrictEqual(style.current.center, style.history[0].center);
			});

			it('modify', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: [],
					center: [0.111, 1.111]
				});

				style.modifyRoot('center', [0.222, 1.222]);

				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: [],
					center: [0.222, 1.222]
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);

				// Note: We currently replace arrays if they differ
				assert.notStrictEqual(style.current.center, style.history[0].center);
			});

			it('noop ', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: [],
					center: [0.111, 1.111]
				});

				style.modifyRoot('center', [0.111, 1.111]);

				assert.strictEqual(style.history.length, 1);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: [],
					center: [0.111, 1.111]
				});

				assert.strictEqual(style.current, style.history[0]);
			});
		});

		describe('zoom (number)', () => {
			it('new', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: []
				});

				style.modifyRoot('zoom', 2);

				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: [],
					zoom: 2
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
			});

			it('modify', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: [],
					zoom: 1
				});

				style.modifyRoot('zoom', 2);

				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: [],
					zoom: 2
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
			});

			it('noop ', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: [],
					zoom: 2
				});

				style.modifyRoot('zoom', 2);

				assert.strictEqual(style.history.length, 1);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: [],
					zoom: 2
				});

				assert.strictEqual(style.current, style.history[0]);
			});
		});
	});

	describe('removeRoot', () => {
		describe('name (string)', () => {
			it('existing', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: [],
					name: 'testing'
				});

				style.removeRoot('name');
				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: []
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
			});

			it('non existing', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: []
				});

				style.removeRoot('name');
				assert.strictEqual(style.history.length, 1);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: []
				});

				assert.strictEqual(style.current, style.history[0]);
			});
		});

		describe('metadata (object)', () => {
			it('existing', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: [],
					metadata: {
						foo: 'bar'
					}
				});

				style.removeRoot('metadata');
				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: []
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
			});

			it('non existing', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: []
				});

				style.removeRoot('metadata');
				assert.strictEqual(style.history.length, 1);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: []
				});

				assert.strictEqual(style.current, style.history[0]);
			});
		});

		describe('center (array)', () => {
			it('existing', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: [],
					center: [1, 2]
				});

				style.removeRoot('center');
				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: []
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
			});

			it('non existing', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: []
				});

				style.removeRoot('metadata');
				assert.strictEqual(style.history.length, 1);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: []
				});

				assert.strictEqual(style.current, style.history[0]);
			});
		});

		describe('zoom (number)', () => {
			it('existing', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: [],
					zoom: 2
				});

				style.removeRoot('zoom');
				assert.strictEqual(style.history.length, 2);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: []
				});

				assert.notStrictEqual(style.current, style.history[0]);
				assert.strictEqual(style.current.sources, style.history[0].sources);
				assert.strictEqual(style.current.layers, style.history[0].layers);
			});

			it('non existing', () => {
				const style = new IcepickStyle({
					version: 8,
					sources: {},
					layers: []
				});

				style.removeRoot('zoom');
				assert.strictEqual(style.history.length, 1);
				assert.deepStrictEqual(style.current, {
					version: 8,
					sources: {},
					layers: []
				});

				assert.strictEqual(style.current, style.history[0]);
			});
		});
	});
});
