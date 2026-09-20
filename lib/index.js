import { IS_APPLY_REGEX, processableApplyRule } from './processable-apply.js';
import { processableMixinRule } from './processable-mixin.js';

export default function creator(opts = {}) {
  const options = {
    // Default options
    preserve: false,
    // Provided options
    ...opts
  };
  return {
    postcssPlugin: 'postcss-mixins',
    prepare() {
      const mixins = new Map();
      const knownMixins = new Set();
      return {
        postcssPlugin: 'mixins',
        Once(root) {
          root.each(child => {
            if (child.type !== 'atrule') {
              return;
            }
            const mixinName = processableMixinRule(child);
            if (!mixinName) {
              return;
            }
            // TODO: support mixin overrides
            if (knownMixins.has(mixinName)) {
              mixins.delete(mixinName);
              return;
            }
            mixins.set(mixinName, child);
            // Pre-resolve nested @apply rules inside each mixin definition.
            // This handles chains like: --bar contains @apply --foo.
            resolveNestedApplies(child, mixins, options.preserve);
            knownMixins.add(mixinName);
          });
          for (const child of mixins.values()) {
            if (!options.preserve) {
              child.remove();
            }
          }
          root.walkAtRules(IS_APPLY_REGEX, atRule => {
            const mixinName = processableApplyRule(atRule);
            if (!mixinName) {
              return;
            }
            const mixin = mixins.get(mixinName);
            if (!mixin?.nodes) {
              return;
            }
            mixin.each(mixinNode => atRule.before(mixinNode.clone()));
            if (!options.preserve) {
              atRule.remove();
            }
          });
        }
      };
    }
  };
}

/**
 * Recursively resolves @apply rules inside a mixin definition by mutating
 * the original tree. Safe to call during the Once() hook as we haven't
 * started walking the main tree yet.
 */
function resolveNestedApplies(mixinDef, mixins, preserve = false) {
  mixinDef.walkAtRules(IS_APPLY_REGEX, innerApply => {
    const innerName = processableApplyRule(innerApply, true);
    if (!innerName) {
      return;
    }
    const innerMixin = mixins.get(innerName);
    if (!innerMixin?.nodes) {
      return;
    }
    // Recursively resolve the inner mixin before expanding it
    resolveNestedApplies(innerMixin, mixins, preserve);
    innerMixin.each(node => innerApply.before(node.clone()));
    if (!preserve) {
      innerApply.remove();
    }
  });
}
creator.postcss = true;
