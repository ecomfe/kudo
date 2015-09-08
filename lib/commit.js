/**
 * @file commit 处理
 * @author chris<wfsr@foxmail.com>
 */

import {git} from './git';
import File from './file';

/**
 * 匹配文件路径的正则
 *
 * @const
 * @type {RegExp}
 */
const FILE_REG = /^\s*\S+(?=\s*\|)/gm;

/**
 * Commit
 *
 * @class
 * @param {Object} options 配置项
 * @param {string} options.id 提交的 id
 * @param {string} options.date 提交时间
 */
export default class Commit {

    constructor(options = {}) {
        Object.assign(this, options);
    }

    /**
     * 从 git-show 输出中获取提交的文件路径
     *
     * @param {string} output git-show 的输出
     * @return {Promise.<File[]>}
     */
    getFiles(output) {
        let cid = this.id;
        let files = (output.match(FILE_REG) || []).reduce(function (files, path) {
            path = path.trim();
            if (/.+\.(?:js|css|html)$/.test(path)) {
                files.push(new File({cid, path}));
            }

            return files;
        }, []);

        return Promise.all(files.map((file) => file.read())).then((files) => this.files = files);
    }

    /**
     * 从 git-log 输出中分析生成提交实例
     *
     * @param {string} log git-log 的输出
     * @return {?Commit}
     */
    static from(log) {
        let [id, date] = log.replace(/\s*(\r?\n)+/g, '').split(',');

        if (id && date) {
            return new Commit({id, date: new Date(date)});
        }

        return null;
    }

    /**
     * 从 git-log 获取指定用户在某个时间段内的所有 Commit
     *
     * @param {string} name 提交代码的作者名字
     * @param {string} since git 格式的时间段表示
     * @return {Promise.<Commit[]>}
     */
    static getCommits(name, since) {
        return git.run('log', '--author=' + name, '--since=\'' + since + '\'', '--pretty=format:%h,%ad')
            .then(Commit.parse);
    }

    /**
     * 从 git-show 获取所有 Commit 的相关文件
     *
     * @param {Commit[]} commits Commit 列表
     * @return {Promise.<Array.<File[]>>}
     */
    static getFiles(commits) {
        return Promise.all(commits.map(function (commit) {
            return git.run(
                'show', commit.id,
                '--pretty=format:', '--diff-filter=AM',
                '--stat=1200', '--stat-graph-width=1'
            ).then(commit.getFiles.bind(commit));
        }));
    }

    /**
     * 解释出 Commit 列表
     *
     * @param {string} logs git-log 的输出
     * @return {Commit[]}
     */
    static parse(logs) {
        return logs.split(/\r?\n/).map(function (log) {
            return Commit.from(log);
        }).filter(Boolean);
    }

}
