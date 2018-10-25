const { Subject } = require('rxjs');
const deserializeArgs = require('./deserializeArgs');
const uuidv1 = require('uuid/v1');

function generateId(that) {
    return new Promise((resolve, reject) => {
        let newId;
        that.act("role:id,cmd:generate", (err, response) => {
            newId = response.id;
            resolve(newId);
        })
    })
}


function nodePlugin() {
    let nodePluginID;
    this.add('role:fw,cmd:createActor', (msg, response) => {
        console.log("source actor id " + nodePluginID);
        this.act('role:fw,cmd:newActor', msg, (err, resp) => {
            if (err) console.log(err);
            response({payload:resp.payload});
        });
    });

    this.add('role:fw,cmd:newActor', async (msg, response) => {
        let actorId;
        let result =[];
        await generateId(this).then((newId) => {
            console.log("new id for new actor generated", newId);
            actorId = newId;
        });
        const m = deserializeArgs(msg);
        const { Subject } = require('rxjs');
        const s = new Subject();
        const arr1 = m.operations.map(o => {
            const op = require('rxjs/operators')[o.operator];
            return op.apply(op, o.args);
        });
        s.pipe.apply(s, arr1).subscribe((data) => {
            result.push(data);
            console.log(data);
        }, (err) => {
            response(err, null);
        }
            , () => {
                console.log("completed");
                response(null, { payload: {
                    id : actorId,
                    data : result
                } })
            });
        m.values.forEach(i => s.next(i));
        s.complete();
    });


    this.add({ init: 'nodePlugin' }, (msg, respond) => {
        generateId(this).then((newId) => {
            nodePluginID = newId;
            respond();
        })

    })

}

module.exports = nodePlugin;