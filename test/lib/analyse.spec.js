/**
 * @file commit file
 * @author chris<wfsr@foxmail.com>
 */

import {git} from '../../lib/git';
import analyse from '../../lib/analyse';


describe('analyse', function () {

    it('diff analyse.js in 0b151b2', function (done) {
        git.run('diff', '0b151b2^', '0b151b2', '--', 'lib/analyse.js')
        .then(analyse)
        .then(function (result) {
            expect(result.lines).toBe(19);
            expect(result.range).toEqual([
                '2', '12', '20', '28', '29', '40', '[43,48]',
                '50', '69', '115', '117', '125', '126', '128'
            ]);
            done();
        });
    });

    it('diff mock', function () {
        let diffs = ''
            + 'diff --git a/lib/analyse.js b/lib/analyse.js\n'
            + 'index 56c46e2..c818741 100644\n'
            + '--- a/lib/analyse.js\n'
            + '+++ b/lib/analyse.js\n'
            + '@@ -123,6 +123,9 @@ function parse(diffs, isNew) {\n'
            + '  * @return {Object} 包含变更行数 lines 及 range 的对象\n'
            + '  */\n'
            + ' export default function (diffs) {\n'
            + '+foo\n'
            + '     let isNew = isNewFile(diffs);\n'
            + '     return parse(diffs, isNew);\n'
            + ' }\n'
            + '+\n'
            + '+bar';

        var result = analyse(diffs);
        expect(result.lines).toBe(3);
        expect(result.range).toEqual(['126', '130', '131']);
    });

});
