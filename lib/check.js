/**
 * @file 校验错误信息输出
 * @author chris<wfsr@foxmail.com>
 */

'use strict';

var fecs = require('fecs');

var util = require('./util');

/**
 * 使用 fecs 检查所有提交涉及到的文件
 *
 * @param {Commit[]} commits 所有提交
 */
module.exports = function (commits) {

    var total = 0;
    var stream = util.through(1000);
    commits.forEach(function (commit) {
        commit.files.forEach(function (file) {
            stream.write(file);
            total += file.stat.total;
        });

    });

    stream.end(null);

    var options = fecs.getOptions();
    options.command = 'check';
    options.stream = stream;
    options.lookup = false;
    options.reporter = 'baidu';

    var log = console.log;
    // console.log = function () {};

    var finish = function (success, json, files, errors) {
        var errorLines = json.reduce(function (count, file) {
            var map = {};

            count += file.errors.reduce(function (n, error) {
                if (!map[error.line]) {
                    n++;
                    map[error.line] = true;
                }
                return n;
            }, 0);

            return count;
        }, 0);

        log('files: %s, errors: %s, changed lines: %s of %s', files, errors, errorLines, total);
        log((100 - (errorLines * 100 / total)).toFixed(2) + '%');
    };

    fecs.check(options, finish);
};
