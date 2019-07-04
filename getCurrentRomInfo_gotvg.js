
'use strict';


var module = Process.findModuleByName('libMobilePlatform.so')
dumpModule(module)
var ptrBurnGetDrvSelect = module.findExportByName('BurnGetDrvSelect')
console.log('funBurnGetDrvSelect ' + ptrBurnGetDrvSelect);

// call BurnGetDrvSelect to get current driver
var funBurnGetDrvSelect = new NativeFunction(ptrBurnGetDrvSelect, 'int', [])
var drvSelect = funBurnGetDrvSelect()
console.log('drvSelect ' + drvSelect)

