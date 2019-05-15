/* eslint-env node, mocha */
const assert = require('assert');
const IcepickStyle = require('..');

describe('source', () => {
	describe('addSource', () => {
		it('new with no existing sources', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [],
			});

			style.addSource('testSource', {
				type: 'vector',
				url: 'http://example.com'
			});

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.notStrictEqual(style.current.sources, style.history[0].sources);
    });

		it('new with existing layers', () => {
			const style = new IcepickStyle({
				version: 8,
				layers: [],
				sources: {
          testSource: {
            type: 'vector',
            url: 'http://example.com'
          }
        },
			});

      assert.throws(
        () => {
          style.addSource('testSource', {
            type: 'vector',
            url: 'http://example.com'
          });
        },
        {
          message: "Style already has source named 'testSource'"
        }
      );
    })
  });

	describe('modifySource', () => {
		it('new with no existing sources', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {},
				layers: [],
				zoom: 2
			});

			style.modifySource('testSource', {
				type: 'vector',
				url: 'http://example.com'
			});

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.notStrictEqual(style.current.sources, style.history[0].sources);
		});

		it('new with existing sources', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {
					foo: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			style.modifySource('testSource', {
				type: 'vector',
				url: 'http://example.com'
			});

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					foo: {
						type: 'vector',
						url: 'http://example.com'
					},
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.notStrictEqual(style.current.sources, style.history[0].sources);
			assert.strictEqual(
				style.current.sources.foo,
				style.history[0].sources.foo
			);
		});

		it('modify', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			style.modifySource('testSource', {
				type: 'vector',
				url: 'http://foo.example.com'
			});

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://foo.example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.notStrictEqual(style.current.sources, style.history[0].sources);
			assert.notStrictEqual(
				style.current.sources.testSource,
				style.history[0].sources.testSource
			);
		});

		it('modify (removing key)', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com',
            maxZoom: 2
					}
				},
				layers: [],
				zoom: 2
			});

			style.modifySource('testSource', {
				type: 'vector',
				url: 'http://foo.example.com'
			});

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://foo.example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.notStrictEqual(style.current.sources, style.history[0].sources);
			assert.notStrictEqual(
				style.current.sources.testSource,
				style.history[0].sources.testSource
			);
		});

		it('noop', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			style.modifySource('testSource', {
				type: 'vector',
				url: 'http://example.com'
			});

			assert.strictEqual(style.history.length, 1);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.strictEqual(style.current.sources, style.history[0].sources);
			assert.strictEqual(
				style.current.sources.testSource,
				style.history[0].sources.testSource
			);
		});
	});

	describe('renameSource', () => {
		it('missing id', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			let err;
			try {
				style.renameSource('foo', 'bar');
			} catch (error) {
				err = error;
			}

			assert(err);
			assert.strictEqual(err.message, 'Missing source: \'foo\'');
			assert.strictEqual(style.history.length, 1);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.strictEqual(style.current.sources, style.history[0].sources);
			assert.strictEqual(
				style.current.sources.testSource,
				style.history[0].sources.testSource
			);
		});

		it('modify', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			style.renameSource('testSource', 'testSourceChanged');

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					testSourceChanged: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.notStrictEqual(style.current.sources, style.history[0].sources);
			assert.strictEqual(
				style.current.sources.testSourceChanged,
				style.history[0].sources.testSource
			);
		});

		it('noop', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			style.renameSource('testSource', 'testSource');

			assert.strictEqual(style.history.length, 1);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.strictEqual(style.current.sources, style.history[0].sources);
			assert.strictEqual(
				style.current.sources.testSource,
				style.history[0].sources.testSource
			);
		});
	});

	describe('removeSource', () => {
		it('missing id', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {
					foo: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			let err;
			try {
				style.removeSource('testSource');
			} catch (error) {
				err = error;
			}

			assert(err);
			assert.strictEqual(err.message, 'Missing source: \'testSource\'');
			assert.strictEqual(style.history.length, 1);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					foo: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.strictEqual(style.current.sources, style.history[0].sources);
			assert.strictEqual(
				style.current.sources.foo,
				style.history[0].sources.foo
			);
		});

		it('valid id', () => {
			const style = new IcepickStyle({
				version: 8,
				sources: {
					testSource: {
						type: 'vector',
						url: 'http://example.com'
					},
					foo: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			style.removeSource('testSource');

			assert.strictEqual(style.history.length, 2);
			assert.deepStrictEqual(style.current, {
				version: 8,
				sources: {
					foo: {
						type: 'vector',
						url: 'http://example.com'
					}
				},
				layers: [],
				zoom: 2
			});

			assert.strictEqual(style.current.layers, style.history[0].layers);
			assert.notStrictEqual(style.current.sources, style.history[0].sources);
			assert.strictEqual(
				style.current.sources.foo,
				style.history[0].sources.foo
			);
		});
	});
});
