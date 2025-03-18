import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import liftRulesets from './lifter.js';

describe('rulesets details lifter', () => {
  it('should define a rule to prevent destruction of the `master` branch', async () => {
    expect(liftRulesets({})).toEqual([{
      name: 'prevent destruction of the default branch',
      target: 'branch',
      enforcement: 'active',
      conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
      rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
    }]);
  });

  it('should return existing rulesets unchanged', async () => {
    const existingRulesets = any.listOf(any.simpleObject);

    expect(liftRulesets({existingRulesets})).toEqual(existingRulesets);
  });
});
