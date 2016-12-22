import a2Data from './a2.json';
import aptamilData from './aptamil.json';
import bellamyData from './bellamy.json';
import bioIslandData from './bio_island.json';
import bioglanData from './bioglan.json';
import blackmores from './blackmores.json';
import karicareData from './karicare.json';
import natures from './natures_way.json';
import swisse from './swisse.json';


export const data = []
  .concat(a2Data)
  .concat(aptamilData)
  .concat(bellamyData)
  .concat(bioIslandData)
  .concat(bioglanData)
  .concat(karicareData)
  .concat(swisse)
  .concat(blackmores)
  .concat(natures);

export default function getData({ keyword, tags = [] }, limit) {
  const result = [];
  let matchers = tags;
  if (typeof matchers === 'string') {
    matchers = [matchers];
  }

  data.forEach(item => {
    if (!limit || result.length < limit) {
      let match = true;
      if (keyword) {
        if (data.name.indexOf(keyword) < 0) {
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
