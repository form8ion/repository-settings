import {describe, it, expect} from 'vitest';

import liftBranchProtectionDetails from './lifter.js';

describe('classic branch protection details lifter', () => {
  it('should disable classic branch protection for the `master` branch', () => {
    expect(liftBranchProtectionDetails()).toEqual([{name: 'master', protection: null}]);
  });
});
