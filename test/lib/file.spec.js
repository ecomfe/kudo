/**
 * @file commit file
 * @author chris<wfsr@foxmail.com>
 */

import File from '../../lib/file';

let file;

beforeEach(function () {
    file = new File({cid: '0b151b2', path: 'lib/file.js'});
});

afterEach(function () {
    file = null;
});

describe('File', function () {
    it('relative should be equal to path', function () {
        expect(file.relative).toBe(file.path);
    });

    it('should be not null', function () {
        expect(file.isNull()).toBeFalsy();
    });

    it('read contents and analyse', function (done) {
        expect(file.contents).toBeUndefined();
        file.read().then(function () {
            expect(file.contents).not.toBeUndefined();
            expect(file.stat.total).toBe(78);
            done();
        });
    });

    it('set cid and path after initialized', function (done) {
        file = null;
        file = new File();
        file.cid = '0b151b2';
        file.path = 'lib/file.js';

        expect(file.relative).toBe(file.path);
        expect(file.isNull()).toBeFalsy();
        expect(file.contents).toBeUndefined();

        file.read().then(function () {
            expect(file.contents).not.toBeUndefined();
            expect(file.stat.total).toBe(78);
            done();
        });
    });

});
