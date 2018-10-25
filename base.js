seneca = require('seneca');
seneca()
.use('mesh' , {
    base:true,
    monitor:true,
})