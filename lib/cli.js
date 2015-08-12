/**
 * @file 校验错误信息输出
 * @author chris<wfsr@foxmail.com>
 */

'use strict';

var log = require('./log');
var show = require('./show');
var diff = require('./diff');
var read = require('./read');
var check = require('./check');

/**
 * 计算相关提交的信息
 *
 * @param {Commit} commit 提交实例
 * @param {function(Commit)} done  以计算后的提交实例为参数的回调函数
 */
function compute(commit, done) {
    var count = commit.files && commit.files.length;
    if (!count) {
        done(commit);
        return;
    }

    var files = [];

    var countdown = function (file) {
        count--;
        files.push(file);

        if (!count) {
            commit.files = files;
            done(commit);
        }
    };

    var diffCount = function (file) {
        diff(file, countdown);
    };

    commit.files.forEach(function (filename) {
        read(commit, filename, diffCount);
    });
}

/**
 * 开始分析指定 author 在指定时间内的提交
 *
 * @param {string} name 提交代码的作者名字
 * @param {string} since git 格式的时间段表示
 */
exports.exec = function (name, since) {
    var args = ['--author=' + name, '--since=\'' + since + '\'', '--pretty=format:%h,%ad'];

    log(args, function (commits) {
        var count = commits.length;
        var countdown = function (commit) {
            count--;
            if (!count) {
                check(
                    commits.filter(function (commit) {
                        return commit.files && !!commit.files.length;
                    })
                );
            }
        };

        commits.forEach(function (commit) {
            show(commit, function () {
                compute(commit, countdown);
            });
        });
    });
};
