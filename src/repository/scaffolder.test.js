import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import scaffoldRepositoryDetails from './scaffolder.js';

describe('repository details scaffolder', () => {
  const projectName = any.string();
  const description = any.sentence();
  const homepage = any.url();

  it('should define the repository details', () => {
    expect(scaffoldRepositoryDetails({
      projectName,
      description,
      homepage,
      visibility: 'OSS'
    })).toEqual({name: projectName, description, homepage, visibility: 'public'});
  });

  it('should define private to be `true` when visibility is closed source`', () => {
    expect(scaffoldRepositoryDetails({
      projectName,
      description,
      homepage,
      visibility: 'CS',
      topics: []
    })).toEqual({name: projectName, description, homepage, visibility: 'private'});
  });

  it('should define private to be `true` when visibility is inner source`', () => {
    expect(scaffoldRepositoryDetails({
      projectName,
      description,
      homepage,
      visibility: 'ISS',
      topics: []
    })).toEqual({name: projectName, description, homepage, visibility: 'internal'});
  });

  it('should comma separate the list of topics', () => {
    const topicList = any.listOf(any.word);

    const {topics} = scaffoldRepositoryDetails({
      projectName,
      description,
      homepage,
      visibility: 'Private',
      topics: topicList
    });

    expect(topics).toEqual(topicList.join(', '));
  });
});
