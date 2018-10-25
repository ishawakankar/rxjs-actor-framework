const Seneca = require('seneca')
const serializeArgs = require('./serializeArgs');
const uuid = require('uuid');
const data = {
    operations: [{
        operator: 'filter',
        args: [i => i%2 !== 0]
    }, {
        operator: 'map',
        args: [i => i*2]
    }]
}
let id = uuid();
Seneca({log:'test'})
.add( `role:app , cmd:printResult , id:${id}` , (msg, response) => {
    console.log(msg.value);
    response({status:'logged result'});
})
.use('mesh' , {
    pin:`role:app , cmd:printResult , id:${id}` 
})
Seneca({log: 'test'})
  .use('mesh')
  .act('role:fw,cmd:application',(err, response) => {
    console.log('This is response X: ',response.x);
    [ {next:1},{next:2},{next:3},{next:4}, {complete: true} ].forEach(i => {
        
        Seneca({log: 'test'})
                .use('mesh')
                .act(response.x,{value:i,data:serializeArgs(data), clientActorid:id}, (err, res) => {
            console.log(res);
        });
    });
    console.log('Response of application is: ', response);
})