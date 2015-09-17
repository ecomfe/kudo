/**
 * @file commit file
 * @author chris<wfsr@foxmail.com>
 */

import check from '../../lib/check';

function mockFile(path, contents) {
    contents = '/**\n * @file mock file\n **/\n\n' + contents;
    return Object.create({
        cid: '0b151b2',
        date: new Date('Wed Sep 9 01:01:45 2015 +0800'),
        path: path,
        relative: path,
        contents: contents,
        stat: {
            size: contents.length,
            lines: contents.split(/\r?\n/).length
        },
        filter: {level: 2},
        isNull() {
            return false;
        }
    });
}

describe('check by fecs', function () {
    it('check valid files', function (done) {
        let files = [
            [mockFile('lib/foo.js', 'export default function () {\n}\n')],
            [mockFile('lib/bar.js', 'export const foo = \'bar\';\n')]
        ];
        check(files).then(function ({total: {success, files, errors, lines, errorLines}}) {
            expect(success).toBeTruthy();
            expect(lines).toBe(13);
            expect(files).toBe(2);
            expect(errors).toBe(0);
            expect(errorLines).toBe(0);
            done();
        });
    });

    it('check invalid files', function (done) {
        let files = [
            [mockFile('lib/foo.js', 'export default function () {\nreturn true}\n')],
            [mockFile('lib/bar.js', 'let foo = \'bar\'\n')]
        ];
        check(files).then(function ({total: {success, files, errors, lines, errorLines}}) {
            expect(success).toBeFalsy();
            expect(lines).toBe(13);
            expect(files).toBe(2);
            expect(errors).toBe(3);
            expect(errorLines).toBe(2);
            done();
        });
    });
});
