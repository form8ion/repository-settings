export default function scaffoldRepositoryDetails({projectName, description, homepage, visibility, topics = []}) {
  return {
    name: projectName,
    description,
    homepage,
    private: 'Public' !== visibility,
    ...topics.length && {topics: topics.join(', ')}
  };
}
