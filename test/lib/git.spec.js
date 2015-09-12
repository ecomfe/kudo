/**
 * @file 分析有 diff 的行
 * @author chris<wfsr@foxmail.com>
 */

import Git from '../../lib/git';

let git;
beforeEach(function () {
    git = new Git();
});

afterEach(function () {
    git = null;
});

describe('Git', function () {
    it('log at Wed Sep 9 01:01:45 2015 +0800', function (done) {
        git.run(
            'log', '-1',
            '--author=chris',
            '--until=\'Wed Sep 9 01:01:45 2015 +0800\'',
            '--pretty=format:%h,%ad'
        ).then(function (output) {
            expect(output).toBe('0b151b2,Wed Sep 9 01:01:45 2015 +0800');
            done();
        });
    });

    it('show 0b151b2', function (done) {
        git.run(
            'show', '0b151b2',
            '--pretty=format:', '--diff-filter=AM',
            '--stat=1200', '--stat-graph-width=1'
        ).then(function (output) {
            expect(output.indexOf('8 files changed') > 0).toBeTruthy();
            done();
        });
    });

    xit('error', function (done) {
        git.run('show', 'abcdefg').catch(function (error) {
            console.error(error);
            done();
        });
    });
});
