/**
 * @file git 运行辅助类
 * @author chris<wfsr@foxmail.com>
 */

import {options} from './config';

let spawn = (function () {
    // istanbul ignore next
    return process.env.comspec
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
})();

let queue = Symbol('queue');
let run = Symbol('run');

export default class Git {

    constructor() {
        this[queue] = [];
    }

    /**
     * 执行 git 子命令
     *
     * @public
     * @param {string[]} args  命令参数
     * @return {Promise.<string>}
     */
    run(...args) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self[queue].push([resolve, reject, args]);
            self[run]();
        });
    }

    /**
     * 执行命令队列
     *
     * @private
     */
    [run]() {
        let list = this[queue];

        if (!list.length || list.child) {
            return;
        }

        let buffer = [];
        let length = 0;
        let [resolve, reject, args] = list.shift();

        let child = list.child = spawn('git', args);

        // istanbul ignore next
        child.on('error', function (error) {
            child.stdout.removeAllListeners();
            reject(error);
        });

        var self = this;
        child.on('exit', function () {
            child.removeAllListeners();
            list.child = null;

            process.nextTick(function () {
                self[run]();
            });
        });

        child.stdout.on('data', function (data) {
            buffer.push(data);
            length += data.length;
        });

        child.stdout.on('finish', function () {
            child.stdout.removeAllListeners();
            resolve(Buffer.concat(buffer, length).toString());
        });

        if (options.logit) {
            console.log('git', args.join(' '));
        }
    }

}

export let git = new Git();
