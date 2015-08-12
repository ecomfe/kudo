/**
 * @file 校验错误信息输出
 * @author chris<wfsr@foxmail.com>
 */

'use strict';

var util = require('./util');

/**
 * 是否空文件，模拟的 vinyl 文件对象的方法
 *
 * @return {boolean} 恒为 flase
 */
var isNull = function () {
    return false;
};

/**
 * 读取某个提交中指定路径的文件内容
 *
 * @param {Commit} commit 提交对象实例
 * @param {string} path  要读取的文件路径
 * @param {function(Object)} done 使用包含读取到的文件内容的模拟 vinyl 文件对象调用的回调函数
 */
module.exports = function (commit, path, done) {

    var finish = function (contents) {
        done({cid: commit.id, path: path, relative: path, contents: contents, isNull: isNull});
    };

    util.git(['show', commit.id + ':' + path], finish);
};
