/**
 * @file 校验错误信息输出
 * @author chris<wfsr@foxmail.com>
 */

'use strict';

var util = require('./util');
var Commit = require('./commit');

/**
 * 从 git-log 输出中分析所有提交
 *
 * @param {string[]} args git-log 命令参数
 * @param {function(Commit[])} done 以分析出所有提交实例数组调用的回调函数
 */
module.exports = function (args, done) {

    var parseCommits = function (logs) {
        var commits = logs.split(/\r?\n/).map(function (log) {
            return Commit.from(log);
        }).filter(Boolean);

        done(commits);
    };

    args.unshift('log');
    util.git(args, parseCommits);
};
