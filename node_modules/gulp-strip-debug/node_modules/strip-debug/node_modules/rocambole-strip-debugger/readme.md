# rocambole-strip-debugger [![Build Status](https://travis-ci.org/sindresorhus/rocambole-strip-debugger.png?branch=master)](https://travis-ci.org/sindresorhus/rocambole-strip-debugger)

> Strip debugger statements from a [rocambole](https://github.com/millermedeiros/rocambole) AST


## Install

```
npm install --save rocambole-strip-debugger
```


## Example

```js
var rocambole = require('rocambole');
var stripDebugger = require('rocambole-strip-debugger');

rocambole.moonwalk('if (true) { debugger; }', function (node) {
	stripDebugger(node);
}).toString();
//=> if (true) {  }
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
