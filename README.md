kudo
========

[![Build Status](https://img.shields.io/travis/ecomfe/kudo.svg?style=flat)](http://travis-ci.org/ecomfe/kudo)
[![NPM version](https://img.shields.io/npm/v/kudo.svg?style=flat)](https://www.npmjs.com/package/kudo)
[![Coverage Status](https://img.shields.io/coveralls/ecomfe/kudo.svg?style=flat)](https://coveralls.io/r/ecomfe/kudo)
[![Dependencies](https://img.shields.io/david/ecomfe/kudo.svg?style=flat)](https://david-dm.org/ecomfe/kudo)
[![DevDependencies](https://img.shields.io/david/dev/ecomfe/kudo.svg?style=flat)](https://david-dm.org/ecomfe/kudo)


kudo is for checking someone's code quality in git repository.

### Install

	npm i -g kudo

### Usage

* in CLI

	```shell
	$ kudo <author> [3.months.ago]

    $ kudo <author> [--since=3.months.ago]
	```

* in Node.js

	```javascript
	var kudo = require('kudo');
    kudo.deduce('kiddo', '3.days.ago');
	```
