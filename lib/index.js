import { IS_APPLY_REGEX, processableApplyRule } from './processable-apply.js';
import { processableMixinRule } from './processable-mixin.js';

const creator = opts => {
  const options = Object.assign(
    // Default options
    {
      preserve: false
    },
    // Provided options
    opts
  );
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
            mixin.each(mixinNode => {
              atRule.before(mixinNode.clone());
            });
            if (!options.preserve) {
              atRule.remove();
            }
          });
        }
      };
    }
  };
};
creator.postcss = true;
export default creator;
export { creator as 'module.exports' };
