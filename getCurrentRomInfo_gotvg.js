
'use strict';


var module = Process.findModuleByName('libMobilePlatform.so')
dumpModule(module)
var ptrBurnGetDrvSelect = module.findExportByName('BurnGetDrvSelect')
console.log('funBurnGetDrvSelect ' + ptrBurnGetDrvSelect);

// call BurnGetDrvSelect to get current driver
var funBurnGetDrvSelect = new NativeFunction(ptrBurnGetDrvSelect, 'int', [])
var drvSelect = funBurnGetDrvSelect()
console.log('drvSelect ' + drvSelect)

// 4FB908 pdriver
var pDriver= (0x4FB908+drvSelect*4)
console.log('pDriver '  + ptr(pDriver));

showDrvInfoByCallBurnFuns();

