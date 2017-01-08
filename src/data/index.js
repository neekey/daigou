function requireAll(requireContext) {
  return requireContext.keys().map((key) => {
    if (key.indexOf('.raw.json') < 0) {
      return requireContext(key);
    }
    return [];
  });
}
// requires and returns all modules that match

const products = requireAll(require.context('src/data/products', true, /.*\.json$/));
let data = [];
products.forEach(product => (data = data.concat(product)));

export default function getData({ keyword, tags = [] }, limit) {
  const result = [];
  let matchers = tags;
  if (typeof matchers === 'string') {
    matchers = [matchers];
  }
  const keywordEx = keyword ? new RegExp(keyword, 'i') : null;

  data.forEach(item => {
    if (!limit || result.length < limit) {
      let match = true;
      if (keywordEx) {
        if (!keywordEx.test(item.name)) {
          match = false;
        }
      }

      if (matchers.length) {
        let tagsMatch = true;
        matchers.forEach(tag => {
          if (!item.tags.includes(tag)) {
            tagsMatch = false;
          }
        });

        if (!tagsMatch) {
          match = false;
        }
      }

      if (match) {
        result.push(item);
      }
    }
  });

  return result;
}
