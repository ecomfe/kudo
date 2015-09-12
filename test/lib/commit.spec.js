/**
 * @file commit file
 * @author chris<wfsr@foxmail.com>
 */

import Commit from '../../lib/commit';

let commit;

beforeEach(function () {
    commit = new Commit({id: '0b151b2', date: new Date('Wed Sep 9 01:01:45 2015 +0800')});
});

afterEach(function () {
    commit = null;
});

describe('Commit', function () {
    it('id and date', function () {
        expect(commit.id).toBe('0b151b2');
        expect(commit.date).toEqual(new Date('Wed Sep 9 01:01:45 2015 +0800'));
    });

    it('set id and date after initialized', function () {
        commit = null;
        commit = new Commit();
        commit.id = '0b151b2';
        commit.date = new Date('Wed Sep 9 01:01:45 2015 +0800');

        expect(commit.id).toBe('0b151b2');
        expect(commit.date).toEqual(new Date('Wed Sep 9 01:01:45 2015 +0800'));
    });

    it('get Commit from log', function () {
        commit = null;
        commit = Commit.from('0b151b2,Wed Sep 9 01:01:45 2015 +0800');
        expect(commit.id).toBe('0b151b2');
        expect(commit.date).toEqual(new Date('Wed Sep 9 01:01:45 2015 +0800'));
    });

    it('invalid log should be return null', function () {
        commit = null;
        commit = Commit.from('foo-bar');
        expect(commit).toBeNull();
    });

    it('parse commits', function () {
        let logs = '\n'
            + '183ddd8,Thu Aug 27 16:09:40 2015 +0800'
            + '\n8f804d7,Thu Aug 27 16:03:06 2015 +0800'
            + '\n22dce77,Thu Aug 27 16:02:35 2015 +0800'
            + '\nea54028,Thu Aug 27 16:02:04 2015 +0800'
            + '\na0aa40b,Wed Aug 12 19:42:34 2015 +0800'
            + '\n6c866ab,Wed Aug 12 19:41:33 2015 +0800\n\n';

        let commits = Commit.parse(logs);
        expect(commits.length).toBe(6);
        expect(commits[0].id).toBe('183ddd8');
    });

    it('get commits', function (done) {
        Commit.getCommits('chris', 'Wed Aug 12 19:41:33 2015 +0800').then(function (commits) {
            expect(commits[commits.length - 1].id).toBe('6c866ab');
            expect(commits[commits.length - 2].id).toBe('a0aa40b');
            done();
        });
    });

    it('get files in 0b151b2', function (done) {
        let output = ''
            + 'bin/kudo       |  26 +-\n'
            + 'lib/analyse.js |  40 +-\n'
            + 'lib/check.js   |  64 +-\n'
            + 'lib/cli.js     |  79 +-\n'
            + 'lib/commit.js  | 111 +-\n'
            + 'lib/file.js    |  78 +\n'
            + 'lib/git.js     |  92 +\n'
            + 'package.json   |   2 +-\n'
            + '8 files changed, 339 insertions(+), 153 deletions(-)';

        commit.getFiles(output).then(function (files) {
            expect(files.length).toBe(6);
            expect(files[0].path).toBe('lib/analyse.js');
            expect(files[1].path).toBe('lib/check.js');
            expect(files[2].path).toBe('lib/cli.js');
            expect(files[3].path).toBe('lib/commit.js');
            expect(files[4].path).toBe('lib/file.js');
            expect(files[5].path).toBe('lib/git.js');
            done();
        });
    });

    it('get files in empty output', function (done) {
        let output = '';

        commit.getFiles(output).then(function (files) {
            expect(files.length).toBe(0);
            done();
        });
    });

    it('get commit files', function (done) {
        Commit.getFiles([commit]).then(function (files) {
            expect(files.length).toBe(1);

            files = files[0];
            expect(files.length).toBe(6);
            expect(files[0].path).toBe('lib/analyse.js');
            expect(files[1].path).toBe('lib/check.js');
            expect(files[2].path).toBe('lib/cli.js');
            expect(files[3].path).toBe('lib/commit.js');
            expect(files[4].path).toBe('lib/file.js');
            expect(files[5].path).toBe('lib/git.js');
            done();
        });
    });

    it('get commits', function (done) {
        Commit.getCommits('chris', 'Wed Aug 12 19:41:33 2015 +0800').then(function (commits) {
            expect(commits[commits.length - 1].id).toBe('6c866ab');
            expect(commits[commits.length - 2].id).toBe('a0aa40b');
            done();
        });
    });



});
