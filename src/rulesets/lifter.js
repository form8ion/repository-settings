export default function () {
  return [{
    name: 'prevent destruction of the default branch',
    target: 'branch',
    enforcement: 'active',
    conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
    rules: [{type: 'deletion'}, {type: 'non_fast_forward'}]
  }];
}
