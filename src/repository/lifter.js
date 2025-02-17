export default function ({homepage, tags}) {
  return {
    ...homepage && {homepage},
    ...tags && {topics: tags.join(', ')}
  };
}
