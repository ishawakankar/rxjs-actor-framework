const Seneca = require('seneca');
const deserializeArgs = require('./deserializeArgs');
const uuid = require('uuid');
Seneca()
    .add('role:fw,cmd:application',(msg, response) =>{
        const id = uuid();
        
        Seneca().add(`role:fw,cmd:createActor,id:${id}`, (msg, response) => {
            console.log('Inside createActor---------------')
            const m = deserializeArgs(msg.data);
            
            const {Subject} = require('rxjs');
            const s = new Subject();
            
            const arr1 = m.operations.map(o => {
                const op = require('rxjs/operators')[o.operator];
                return op.apply(op, o.args);                            // filter(i => i%2 === 0)
            });
            
            let value= 'not odd';
            
            // s.pipe.apply(s, arr1).subscribe((resp,err) => {
            //     value = resp;
            // });
            const s2 =   s.pipe.apply(s, arr1);
            
            
            s2.subscribe( (resp) => {
                value=resp;
                console.log('---------------------------inside sub of s2 -----------------------');
                Seneca()
                .use('mesh')
                .act(`role:app,cmd:printResult,id:${msg.clientActorid}`,{value:value} , (req, resp) => {
                    console.log(resp);
                } )
            } );
            s.subscribe(
               (data)=> response({data:'next data received'}),
                (data) => response({data:'error ,received'}),
               data => {
                console.log('completed');
                response({data:"completed"});
               } 
                
            );
            
            
            if(msg.value.hasOwnProperty('err')){
                // console.log('error----------------------');
                s.error('error: something went wrong');
            }else if(msg.value.hasOwnProperty('complete')){
                // console.log('complete----------------------------');
                s.complete("complete true is being transmitted");
            }else{
                // console.log('next value---------------------------');
                s.next(msg.value.next);
            }
        })
        .use('mesh', {
            isbase: false,
            pin: `role:fw,cmd:createActor,id:${id}`
        })
        
        response({x:`role:fw,cmd:createActor,id:${id}`})
    })
    .use('mesh', {
        isbase: false,
        pin: 'role:fw,cmd:application'
      })