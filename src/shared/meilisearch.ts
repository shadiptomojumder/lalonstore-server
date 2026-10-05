import { Meilisearch } from 'meilisearch';

const meiliClient = new Meilisearch({
  host: 'http://localhost:7700',
  apiKey: 'aSampleMasterKey',
});

export default meiliClient;
