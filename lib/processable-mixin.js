import { isFunctionNode, parseComponentValue } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

const IS_IGNORED_CHILD_RULE = /^(?:contents|result)$/i;

export function processableMixinRule(atRule) {
  if (atRule.name.toLowerCase() !== 'mixin') {
    return false;
  }
  if (!atRule.params?.includes('--')) {
    return false;
  }
  if (!atRule.nodes?.length) {
    return false;
  }
  // TODO: support conditional @mixin declarations
  if (atRule.parent !== atRule.root()) {
    return false;
  }
  const nameNode = parseComponentValue(
    tokenize({
      css: atRule.params
    })
  );
  if (!isFunctionNode(nameNode)) {
    return false;
  }
  if (nameNode.value.length) {
    return false;
  }
  // TODO: support @content
  let hasNestedContents = false;
  atRule.walk(x => {
    if (x.type === 'atrule' && IS_IGNORED_CHILD_RULE.test(x.name)) {
      hasNestedContents = true;
    }
  });
  if (hasNestedContents) {
    return false;
  }
  return nameNode.getName();
}
