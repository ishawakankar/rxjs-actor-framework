const uuid = require('uuid/v1');

module.exports = function IdPlugin(){
    this.add("role:id,cmd:generate" , (msg,response)=>{
        console.log("id plugin is called");
        const id = uuid();
        response({id:id});
    });
}