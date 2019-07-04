#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import traceback
import frida
import getopt

def printUsage():
    print """
         runfridascriptOnAndroid.py  
         options:
            -p, --package       packageName
            -j, --javascript    jsName
            -m, --jsmodule      add js module files
            -v, --verbose       verbose
         """

def reportError(msg):
    printUsage()
    raise Exception(msg)
    
def parseOpts():
    opts = {'jsmodules':[], 'verbose':False}
    options, remainder = getopt.getopt(sys.argv[1:], 'p:j:m:v', ['package=',
                                                         'javascript=',
                                                         'jsmodule=',
                                                         'verbose',
                                                         ])
    for opt, arg in options:
        if opt in ('-p', '--packageName'):
            opts['packageName'] = arg
        elif opt in ('-j', '--javascript'):
            opts['jsName'] = arg
        elif opt in ('-m', '--jsmodule'):
            opts['jsmodules'].append(arg)
        elif opt in ('-v', '--verbose'):
            opts['verbose'] = True;
    if 'packageName' not in opts or opts['packageName']==None:  reportError("please set a package name ")
    if 'jsName'      not in opts or opts['jsName'     ]==None:  reportError("please set a javascript file name ")
    print 'packageName ',':', opts['packageName']
    print 'jsName      ',':', opts['jsName'     ]
    print 'jsmodules   ',':', opts['jsmodules'  ]
    return opts

def main():
    opts = parseOpts()
    if opts['verbose']:
        print 'opts', opts

    device = frida.get_usb_device()
    if opts['verbose']:
        print device
    try:
        session = device.attach(opts['packageName'])
        def on_message(message, data):
            print message, data
        src = ''
        for m in opts['jsmodules']:
            src += '\n'
            src += '//   %s ' % m 
            src += open(m).read()
            src += '\n'
        src += '\n'
        src += '//   %s ' % opts['jsName']
        src+=open(opts['jsName']).read()
        src += '\n'
        if opts['verbose']:
            print '##################################################'
            lines = src.splitlines()
            for t in range(len(lines)):
                print '%4d'%(t +1) , lines[t]
            print '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'
        print '================= RUN ============================'
        script = session.create_script(src)
        script.on('message', on_message)
        script.load()
        print 'press ctrl-D to exit'
        sys.stdin.read()
    except Exception as e:
        print (e)
        exc_info = sys.exc_info()
        traceback.print_exception(*exc_info)
    finally:
        session.detach()

if __name__ == '__main__':
  # some initialization code
  reload(sys)
  sys.setdefaultencoding('utf8')

  main()

