import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import liftRepositoryDetails from './lifter.js';

describe('repository details lifter', () => {
  it('should not modify the repository details if no updated details are provided', () => {
    expect(liftRepositoryDetails({})).toEqual({});
  });

  it('should update the homepage when provided', () => {
    const homepage = any.url();

    expect(liftRepositoryDetails({homepage})).toEqual({homepage});
  });

  it('should update the tags when provided', () => {
    const tags = any.listOf(any.word);

    expect(liftRepositoryDetails({tags})).toEqual({topics: tags.join(', ')});
  });
});
