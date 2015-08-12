/**
 * @file baidu reporter
 * @author chris<wfsr@foxmail.com>
 */

var util = require('../../lib/util');

describe('util', function () {

    it('extend', function () {
        var foo = {foo: 1};
        var bar = {bar: 1};
        var baz = {foo: 0, baz: 1};

        var foobar = util.extend(foo, bar);

        expect(foobar.foo).toBe(foo.foo);
        expect(foobar.bar).toBe(bar.bar);

        var foobaz = util.extend(foo, baz);

        expect(foobaz.foo).toBe(baz.foo);
        expect(foobaz.baz).toBe(baz.baz);
    });

    it('deep extend', function () {
        var foo = {fecs: {foo: 1}};
        var bar = {fecs: {bar: 1}};
        var baz = {fecs: {foo: 0, baz: 1}};

        var foobar = util.extend(foo, bar);

        expect(foobar.fecs.foo).toBe(foo.fecs.foo);
        expect(foobar.fecs.bar).toBe(bar.fecs.bar);

        var foobaz = util.extend(foo, baz);

        expect(foobaz.fecs.foo).toBe(baz.fecs.foo);
        expect(foobaz.fecs.baz).toBe(baz.fecs.baz);
    });

    it('extend should ignore property from prototype', function () {
        var foo = {foo: 1};
        var bar = Object.create({bar: 1});

        var foobar = util.extend(foo, bar);

        expect(foobar.foo).toBe(foo.foo);
        expect(foobar.bar).toBeUndefined();
    });

    it('mix', function () {
        var foo = {foo: 1};
        var bar = {bar: 1};
        var baz = {foo: 0, baz: 1};

        var foobaz = util.mix(foo, bar, baz, null, undefined);


        expect(foobaz.foo).toBe(baz.foo);
        expect(foobaz.baz).toBe(baz.baz);
    });


});
