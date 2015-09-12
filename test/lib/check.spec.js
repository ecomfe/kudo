/**
 * @file commit file
 * @author chris<wfsr@foxmail.com>
 */

import check from '../../lib/check';

function mockFile(path, contents) {
    contents = '/**\n * @file mock file\n **/\n\n' + contents;
    console.log(contents);
    return Object.create({
        cid: '0b151b2',
        path: path,
        relative: path,
        contents: contents,
        stat: {
            size: contents.length,
            total: contents.split(/\r?\n/).length
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
        check(files).then(function ({success, files, errors, errorLines, total}) {
            expect(success).toBeTruthy();
            expect(total).toBe(13);
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
        check(files).then(function ({success, files, errors, errorLines, total}) {
            expect(success).toBeFalsy();
            expect(total).toBe(13);
            expect(files).toBe(2);
            expect(errors).toBe(3);
            expect(errorLines).toBe(2);
            done();
        });
    });
});
