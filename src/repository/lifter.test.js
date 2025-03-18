import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import liftRepositoryDetails from './lifter.js';

describe('repository details lifter', () => {
  const homepage = any.url();
  const tags = any.listOf(any.word);

  it('should not modify the repository details if no updated details are provided', () => {
    expect(liftRepositoryDetails({})).toEqual({});
  });

  it('should update the homepage when provided', () => {
    expect(liftRepositoryDetails({homepage})).toEqual({homepage});
  });

  it('should update the tags when provided', () => {
    expect(liftRepositoryDetails({tags})).toEqual({topics: tags.join(', ')});
  });

  it('should update the existing homepage when a new value is provided', () => {
    const existingRepositoryDetails = {...any.simpleObject(), homepage: any.url()};

    expect(liftRepositoryDetails({homepage, existingRepositoryDetails})).toEqual({
      ...existingRepositoryDetails,
      homepage
    });
  });

  it('should replace the existing topics when new tags are provided', () => {
    const existingRepositoryDetails = {...any.simpleObject(), topics: any.listOf(any.word).join(', ')};

    expect(liftRepositoryDetails({tags, existingRepositoryDetails})).toEqual({
      ...existingRepositoryDetails,
      topics: tags.join(', ')
    });
  });
});
