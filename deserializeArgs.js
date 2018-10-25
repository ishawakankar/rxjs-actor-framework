function deSerializeArgs(data) {
    return Object.assign({}, data, {
        operations: data.operations.map(o => Object.assign({}, o, {
            args: o.args.map(a => a.type === 'function' ? eval( `(${a.val})` ) : a)
        }))
    });
}

module.exports = deSerializeArgs;