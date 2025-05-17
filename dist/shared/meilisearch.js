"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meilisearch_1 = require("meilisearch");
const meiliClient = new meilisearch_1.MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'aSampleMasterKey',
});
exports.default = meiliClient;
