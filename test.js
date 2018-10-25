const chai = require('chai');
chai.should();
const seneca = require('seneca');
const nodePlugin = require('./nodePlugin');

describe(`
    Rx.from([2,3,4,5]).pipe(
        filter(i => i % 2 !== 0),
        map(i => i*2)
    ).subscribe(console.log, console.log)
`, function() {
    let nodeService, clientService;
    const messages = [];
    before(function() {
        nodeService = seneca();
        nodeService.use(nodePlugin);
        nodeService.use(idPlugin);
        clientService = nodeService;
        clientService.add(`role:app,destId:${clientService.destId}`, (msg, respond) => {
            messages.push(msg);
            respond(null, {done: true});
        });
    });

    
    it('should create an actor with pattern "role:app,destId:{actorId},data:*" ', function(done) {
        clientService.act('role:fw,cmd:createActor', {destId: clientService.destId}, (err, res) => {
            if(err) { done(err);  }
            res.should.have.property('actorId').and.not.be.null;
            const destId = res.actorId;
            let count = 0;
            [1,2,3,4].forEach(i => {
                clientService.act(`role:app,destId:${actorId},data:${i}`, (err, res) => {
                    if(err) { done(err); return; }
                    if(++count === 4) {
                        done();
                    }
                });
            });
        });
    });

});