import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import liftRepositoryDetails from './lifter.js';

describe('repository details lifter', () => {
  const homepage = any.url();
  const tags = any.listOf(any.word);

  it('should not modify the repository details if no updated details are provided', () => {
    const existingRepositoryDetails = any.simpleObject();

    expect(liftRepositoryDetails({existingRepositoryDetails})).toEqual(existingRepositoryDetails);
  });

  it('should update the homepage when provided', () => {
    const existingRepositoryDetails = any.simpleObject();

    expect(liftRepositoryDetails({homepage, existingRepositoryDetails}))
      .toEqual({...existingRepositoryDetails, homepage});
  });

  it('should update the tags when provided', () => {
    const existingRepositoryDetails = any.simpleObject();

    expect(liftRepositoryDetails({tags, existingRepositoryDetails}))
      .toEqual({...existingRepositoryDetails, topics: tags.join(', ')});
  });

  it('should update the existing homepage when a new value is provided', () => {
    const existingRepositoryDetails = {...any.simpleObject(), homepage: any.url()};

    expect(liftRepositoryDetails({homepage, existingRepositoryDetails})).toEqual({
      ...existingRepositoryDetails,
      homepage
    });
  });

  it('should append the additional topics when new tags are provided', () => {
    const existingTags = any.listOf(any.word);
    const existingRepositoryDetails = {...any.simpleObject(), topics: existingTags.join(', ')};

    expect(liftRepositoryDetails({tags, existingRepositoryDetails})).toEqual({
      ...existingRepositoryDetails,
      topics: `${existingTags.join(', ')}, ${tags.join(', ')}`
    });
  });
});
