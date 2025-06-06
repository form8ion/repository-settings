export default function liftRepositoryDetails({homepage, tags, existingRepositoryDetails}) {
  const mergedTags = [
    ...existingRepositoryDetails.topics ? [...existingRepositoryDetails.topics.split(', ')] : [],
    ...tags || []
  ];

  return {
    ...existingRepositoryDetails,
    ...homepage && {homepage},
    ...tags && {topics: mergedTags.join(', ')}
  };
}
