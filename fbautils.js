
'use strict';

var showDrvInfoByCallBurnFuns = function()
{
    var module = Process.findModuleByName('libMobilePlatform.so')
    
    //BurnDrvGetTextA
    {
        var textIds=[ 0, 1, 2, 4, 5, 6, 7, 8, 9 ];
        var textStrings=[ 
        'DRV_NAME'          ,
        'DRV_DATE'          ,
        'DRV_FULLNAME'      ,
        'DRV_COMMENT'       ,
        'DRV_MANUFACTURER'  ,
        'DRV_SYSTEM'        ,
        'DRV_PARENT'        ,
        'DRV_BOARDROM'      ,
        'DRV_SAMPLENAME'    ,
        ];
        
        console.log(' BurnDrvGetTextA @ ');
        var ptrBurnDrvGetTextA = module.findExportByName('BurnDrvGetTextA');
        var funBurnDrvGetTextA = new NativeFunction(ptrBurnDrvGetTextA, 'pointer', ['uint', 'int']);
        for (var i = 0; i<textIds.length;i++)
        {
            var t = textIds[i];
            var str = textStrings[i];
            var p = funBurnDrvGetTextA(t, -1);
            if(p !=0)
                console.log('  '+str + ' : ' + Memory.readUtf8String(p));
        }
    }
    
    // BurnDrvGetRomInfo , BurnDrvGetRomName
    {
        console.log(' BurnDrvGetRomInfo, BurnDrvGetRomName @ ');
        var pname = Memory.alloc(16);
        var ptrBurnDrvGetRomName = module.findExportByName('BurnDrvGetRomName');
        var funBurnDrvGetRomName = new NativeFunction(ptrBurnDrvGetRomName, 'uint', ['pointer', 'uint','int','int']);
        var pri = Memory.alloc(16);
        var ptrBurnDrvGetRomInfo = module.findExportByName('BurnDrvGetRomInfo');
        var funBurnDrvGetRomInfo = new NativeFunction(ptrBurnDrvGetRomInfo, 'uint', ['pointer', 'uint','int']);
        for (var i = 0;i<256;i++)
        {
            Memory.writeU32(pri.add( 4), 0) 
            Memory.writeU32(pri.add(12), 0) 
            var ret;
            ret = funBurnDrvGetRomName(pname, i, 0, -1);
            if( ret != 0) break;
            var romName = Memory.readUtf8String(Memory.readPointer(pname))
            ret = funBurnDrvGetRomInfo(pri, i, -1);
            var nLen = Memory.readU32(pri.add(0x04))
            var nCrc = Memory.readU32(pri.add(0x08))
            var nType= Memory.readU32(pri.add(0x0c))
            console.log(' ' + romName + '  ' + ptr(nLen) + ' ' + ptr(nCrc) + ' ' + ptr(nType));
        }
    }
    // BurnDrvGetInputInfo
    {
        console.log(' BurnDrvGetInputInfo @')
        var nGameInpCount = Memory.readU32(module.findExportByName('nGameInpCount'))
        console.log('nGameInpCount ' + nGameInpCount)
        var ptrBurnDrvGetInputInfo = module.findExportByName('BurnDrvGetInputInfo');
        var funBurnDrvGetInputInfo = new NativeFunction(ptrBurnDrvGetInputInfo, 'uint', ['pointer', 'uint','int']);
        var pbii = Memory.alloc(0x20)
        for (var i = 0;i< nGameInpCount; i++)
        {
            var ret = funBurnDrvGetInputInfo(pbii, i,  -1)
            var szName = Memory.readUtf8String(Memory.readPointer(pbii.add(0x00)));
            var szInfo = Memory.readUtf8String(Memory.readPointer(pbii.add(0x0c)));
            var pVal   = Memory.readPointer(pbii.add(0x08));
            var nType  = Memory.readU8(pbii.add(0x04));
            console.log('ret ' + i + ' ' + szName+ ' ' + szInfo +  ' '+ nType + ' ' + pVal.sub(module.base))
        }
    }
    // BurnDrvGetDIPInfo
    {
        console.log(' BurnDrvGetDIPInfo @')
        var pdi = Memory.alloc(0x20);
        var ptrBurnDrvGetDIPInfo = module.findExportByName('BurnDrvGetDIPInfo');
        var funBurnDrvGetDIPInfo = new NativeFunction(ptrBurnDrvGetDIPInfo, 'uint', ['pointer', 'uint','int']);
        for(var i=0;i<256;i++)
        {
            var ret= funBurnDrvGetDIPInfo(pdi, i, -1);
            var nInput   = Memory.readU32(pdi.add(0x00))
            var nFlags   = Memory.readU8 (pdi.add(0x04))
            var nMask    = Memory.readU8 (pdi.add(0x05))
            var nSetting = Memory.readU8 (pdi.add(0x06))
            var pszText   = Memory.readPointer(pdi.add(0x08))
            var szText = "";
            if (pszText != 0) szText = Memory.readUtf8String(pszText);
            console.log('  ' + nInput + ' ' + nFlags + ' ' + nMask + ' ' + nSetting + ' ' + szText);
            if (ret != 0) break;
        }
    }
    // BurnDrvGetVisibleSize
    {
        console.log(' BurnDrvGetVisibleSize @' )
        var ptrBurnDrvGetVisibleSize = module.findExportByName('BurnDrvGetVisibleSize');
        var funBurnDrvGetVisibleSize = new NativeFunction(ptrBurnDrvGetVisibleSize, 'uint', ['pointer', 'pointer','int', 'int']);
        var pVisibleSize = Memory.alloc(0x10);
        var ret = funBurnDrvGetVisibleSize(pVisibleSize, pVisibleSize.add(4), 0, -1)
        console.log('   ret ' + ret);
        var nWidth = Memory.readS32(pVisibleSize.add(0x00));
        var nHeight= Memory.readS32(pVisibleSize.add(0x04));
        console.log(' ' + nWidth + ' ' + nHeight);
    }
    // BurnDrvGetVisibleOffs
    {
        console.log(' BurnDrvGetVisibleOffs @' )
        var ptrBurnDrvGetVisibleOffs = module.findExportByName('BurnDrvGetVisibleOffs');
        var funBurnDrvGetVisibleOffs = new NativeFunction(ptrBurnDrvGetVisibleOffs, 'uint', ['pointer', 'pointer']);
        var pVisibleOffs = Memory.alloc(0x10);
        var ret = funBurnDrvGetVisibleOffs(pVisibleOffs, pVisibleOffs.add(4));
        console.log('   ret ' + ret);
        var nLeft  = Memory.readS32(pVisibleOffs.add(0x00));
        var nTop   = Memory.readS32(pVisibleOffs.add(0x04));
        console.log(' ' + nLeft  + ' ' + nTop   );
        
    }
    // BurnDrvGetAspect // not used
    // {
    //     console.log(' BurnDrvGetAspect ' )
    //     var ptrBurnDrvGetAspect = module.findExportByName('BurnDrvGetAspect');
    //     var funBurnDrvGetAspect = new NativeFunction(ptrBurnDrvGetAspect, 'uint', ['pointer', 'pointer', 'int']);
    //     var pAspect = Memory.alloc(0x10);
    //     var ret = funBurnDrvGetAspect(pAspect, pAspect.add(4), -1);
    //     console.log('   ret ' + ret);
    //     dumpMemory(pAspect, 0x10)
    //     var nXAspect  = Memory.readFloat(pAspect.add(0x00));
    //     var nYAspect  = Memory.readFloat(pAspect.add(0x04));
    //     console.log(' ' + nXAspect  + ' ' + nYAspect );
    // }

    // BurnDrvGetHardwareCode
    {
         console.log(' BurnDrvGetHardwareCode @' )
         var ptrBurnDrvGetHardwareCode = module.findExportByName('BurnDrvGetHardwareCode');
         var funBurnDrvGetHardwareCode = new NativeFunction(ptrBurnDrvGetHardwareCode, 'int', ['int']);
         var hardwareCode = funBurnDrvGetHardwareCode(-1);
         console.log(' ' + ptr(hardwareCode))
    }
    // BurnDrvGetFlags
    {
         console.log(' BurnDrvGetFlags @' )
         var ptrBurnDrvGetFlags = module.findExportByName('BurnDrvGetFlags');
         var funBurnDrvGetFlags = new NativeFunction(ptrBurnDrvGetFlags, 'int', ['int']);
         var flags = funBurnDrvGetFlags(-1);
         console.log(' ' + ptr(flags));
    }
    // BurnDrvGetMaxPlayers
    {
         console.log(' BurnDrvGetMaxPlayers @' )
         var ptrBurnDrvGetMaxPlayer = module.findExportByName('BurnDrvGetMaxPlayers');
         var funBurnDrvGetMaxPlayer = new NativeFunction(ptrBurnDrvGetMaxPlayer, 'int', ['int']);
         var maxPlayers = funBurnDrvGetMaxPlayer(-1);
         console.log(' ' + maxPlayers);
    }
};

