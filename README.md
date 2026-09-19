[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]

# PostCSS Mixins [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

This is a fork of [CSS Tools Mixins] implementing additional CSS funcionality such as:
- nested mixins

```bash
npm install @pirxpilot/postcss-mixins --save-dev
```

[PostCSS Mixins] lets you use `@mixin` and `@apply` following [CSS Mixins 1].

Several specification aspects of CSS Mixins still need to be settled.  
This plugin is only a partial implementation to avoid conflicts with the final specification.

Unsupported:
- mixin arguments
- `@contents` blocks
- `@result` blocks
- layered `@mixin` declarations
- mixin overrides

```css
@mixin --foo() {
	color: green;
}

.foo {
	@apply --foo;
}

/* becomes */

.foo {
	color: green;
}
```

## Usage

Add [PostCSS Mixins] to your project:

```bash
npm install postcss @pirxpilot/postcss-mixins --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssMixins = require('@pirxpilot/postcss-mixins');

postcss([
	postcssMixins(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
postcssMixins({ preserve: true })
```

```css
@mixin --foo() {
	color: green;
}

.foo {
	@apply --foo;
}

/* becomes */

@mixin --foo() {
	color: green;
}

.foo {
	color: green;
	@apply --foo;
}
```

[PostCSS]: https://github.com/postcss/postcss
[CSS Tools Mixins]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-mixins
[PostCSS Mixins]: https://github.com/pirxpilot/postcss-mixins
[CSS Mixins 1]: https://drafts.csswg.org/css-mixins/#mixin-rule

[npm-image]: https://img.shields.io/npm/v/@pirxpilot/postcss-mixins
[npm-url]: https://npmjs.org/package/@pirxpilot/postcss-mixins

[build-url]: https://github.com/pirxpilot/postcss-mixins/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/postcss-mixins/check.yaml?branch=main
