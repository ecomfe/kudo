/**
 * @file 分析有 diff 的行
 * @author chris<wfsr@foxmail.com>
 */

import minimist from 'minimist';

let defaults = {
    author: '',
    since: '3.months.ago',
    until: '',
    logit: false,
    lookup: false
};

let options;

export default function set(argv) {
    let cliOptions = minimist(
        argv || process.argv.slice(2),
        {
            'string': ['_', 'since'],
            'boolean': ['lookup', 'logit'],
            'default': defaults,
            'alias': {
                v: 'version'
            }
        }
    );

    options = {};
    Object.assign(options, cliOptions);
    options.author = options.author || options._[0];
    options.since = options._[1] || options.since;
    options.until = options.until || options._[2];

    return options;
}

Object.defineProperty(set, 'options', {
    get() {
        if (options == null) {
            set();
        }

        return options;
    }
});
