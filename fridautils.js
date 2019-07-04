'use strict';


var dumpModule = function (m) { 
    console.log('module :')
    console.log('    name ' + m.name)
    console.log('    base ' + m.base)
    console.log('    size ' + m.size)
    console.log('    path ' + m.path)
};

var dumpMemory = function(p, l) {
    console.log(hexdump(p, {
        offset: 0,
        length: l,
        header: true,
        ansi: true
}));

};
