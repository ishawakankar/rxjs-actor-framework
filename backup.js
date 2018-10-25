const { Subject } = require('rxjs');

const deserializeArgs = require('./deserializeArgs');

function nodePlugin() {

    this.add('role:fw,cmd:createActor', (msg, response) => {
        console.log("entered the outer service");
        this.act('role:fw,cmd:innerService', msg, (err, resp) => {
            if (err) console.log(err);
            console.log("response from outer service", resp);
            response({second:resp})
        });     
    });

    
    this.add('role:fw,cmd:innerService', (msg, response) => {
        console.log("entered the inner service ")
        const m = deserializeArgs(msg);
        const { Subject } = require('rxjs');
        const s = new Subject();
        const arr1 = m.operations.map(o => {
            const op = require('rxjs/operators')[o.operator];
            return op.apply(op, o.args);
        });
        s.pipe.apply(s, arr1).subscribe(console.log, console.log);
        m.values.forEach(i => s.next(i));
        s.complete();
        response(null, { answer: ' reponse from inner service is ok' });
    })

}

module.exports = nodePlugin;
