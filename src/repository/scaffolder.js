export default function ({projectName, description, homepage, visibility, topics}) {
  return {
    name: projectName,
    description,
    homepage,
    private: 'Public' !== visibility,
    ...topics && {topics: topics.join(', ')}
  };
}
