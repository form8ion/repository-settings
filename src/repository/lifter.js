export default function ({homepage, tags, existingRepositoryDetails}) {
  return {
    ...existingRepositoryDetails,
    ...homepage && {homepage},
    ...tags && {topics: tags.join(', ')}
  };
}
