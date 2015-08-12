/**
 * @file baidu reporter
 * @author chris<wfsr@foxmail.com>
 */

'use strict';

var through = require('through2');

var toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 对象属性拷贝
 *
 * @param {Object} target 目标对象
 * @param {...Object} source 源对象
 * @return {Object} 返回目标对象
 */
exports.extend = function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i];
        if (src == null) {
            continue;
        }

        for (var key in src) {
            if (hasOwnProperty.call(src, key)) {

                if (toString.call(src[key]) === '[object Object]'
                    && toString.call(target[key]) === '[object Object]'
                ) {
                    extend(target[key], src[key]);
                }
                else {
                    target[key] = src[key];
                }

            }
        }
    }
    return target;
};

/**
 * 混合对象
 *
 * @param {...Object} source 要混合的对象
 * @return {Object} 混合后的对象
 */
exports.mix = function () {
    var o = Object.create(null);
    var src = Array.prototype.slice.call(arguments);
    return exports.extend.apply(this, [o].concat(src));
};

/**
 * 对 child_process.spawn 的包装
 *
 * @param {string} command 要支持的命令
 * @param {?Array.<string>} args 要传递给 command 的参数列表
 * @property {?Object} options 配置项
 * @return {ChildProcess} 同原 spawn 的返回对象
 */
exports.spawn = process.env.comspec
    ? function (command, args, options) {
        var spawn = require('child_process').spawn;
        return spawn(
            process.env.comspec,
            ['/c', command].concat(args),
            options
        );
    }
    : function (command, args, options) {
        var spawn = require('child_process').spawn;
        return spawn(command, args, options);
    };

/**
 * 通过 spawn 执行 git 子命令
 *
 * @param {string[]} args git 命令参数
 * @param {function (string)} done 命令完后使用输出的字符回调函数
 * @return {ChildProcess} 运行 git 命令的子进程实例
 */
exports.git = function (args, done) {
    var git = exports.spawn('git', args);

    var list = [];
    var length = 0;
    var each = function (data) {
        list.push(data);
        length += data.length;
    };

    var finish = function () {
        done(Buffer.concat(list, length).toString());
    };

    git.stdout.on('data', each);
    git.stdout.on('finish', finish);
    git.on('error', function (error) {
        console.log(error);
    });

    console.log('git ' + args.join(' '));
    return git;
};

/**
 * through2 的 through.obj 别名
 *
 * @param {number} max highWaterMark 值
 * @param {Function=} transform transform 操作
 * @param {Function=} flush flush 操作
 * @return {Transform}  转换流
 */
exports.through = function (max, transform, flush) {
    return through.obj({highWaterMark: max}, transform, flush);
};

