const seneca = require('seneca');
const nodeService = seneca();
const nodePlugin = require('./nodePlugin');
const IdPlugin = require('./IdPlugin');

nodeService
    .use(IdPlugin)
    .use(nodePlugin)
.listen();