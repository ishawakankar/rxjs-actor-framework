const seneca = require('seneca');
const nodeService = seneca().client();
const serializeArgs = require('./serializeArgs');
const uuid = require('uuid/v1');
const data = {
    operations: [{
        operator: 'filter',
        args: [i => i%2 !== 0]
    }, {
        operator: 'map',
        args: [i => i*2]
    }],
    values: [2, 3, 4, 5],
    sourceId: uuid()
}


nodeService
.act({role:'fw',cmd:'createActor'},serializeArgs(data), (err, response) => {
    if(err) console.log(err);
    console.log("new actor id " , response.payload);
});