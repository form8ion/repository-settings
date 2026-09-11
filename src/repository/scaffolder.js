export const projectToRepositoryVisibilityMap = {
  OSS: 'public',
  ISS: 'internal',
  CS: 'private'
};

export default function scaffoldRepositoryDetails({projectName, description, homepage, visibility, topics = []}) {
  return {
    name: projectName,
    description,
    homepage,
    visibility: projectToRepositoryVisibilityMap[visibility],
    ...topics.length && {topics: topics.join(', ')}
  };
}
