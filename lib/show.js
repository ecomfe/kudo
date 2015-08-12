/**
 * @file 校验错误信息输出
 * @author chris<wfsr@foxmail.com>
 */

'use strict';

var util = require('./util');

/**
 * 从 git-show 输出中匹配文件路径的正则
 *
 * @const
 * @type {RegExp}
 */
var FILE_REG = /^\s*\S+(?=\s*\|)/gm;

/**
 * 从 git-show 输出中分析某次提交的所有前端文件
 *
 * @param {Commit} commit 提交对象
 * @param {function(Commit)} done 使用包含本次相关文件的提交对象调用的回调函数
 */
module.exports = function (commit, done) {
    var finish = function (data) {
        commit.files = (data.match(FILE_REG) || []).reduce(function (files, name) {
            name = name.trim();
            if (/.+\.(?:js|css|html)$/.test(name)) {
                files.push(name);
            }

            return files;
        }, []);

        done(commit);
    };

    util.git(
        [
            'show', commit.id,
            '--pretty=format:', '--diff-filter=AM',
            '--stat=1200', '--stat-graph-width=1'
        ],
         finish
    );
};

