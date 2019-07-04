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
         """

def reportError(msg):
    printUsage()
    raise Exception(msg)
    
def parseOpts():
    opts = {}
    options, remainder = getopt.getopt(sys.argv[1:], 'p:j:', ['package=',
                                                         'verbose',
                                                         'javascript=',
                                                         ])
    for opt, arg in options:
        if opt in ('-p', '--packageName'):
            opts['packageName'] = arg
        elif opt in ('-j', '--javascript'):
            opts['jsName'] = arg
    if 'packageName' not in opts or opts['packageName']==None:  reportError("please set a package name ")
    if 'jsName'      not in opts or opts['jsName'     ]==None:  reportError("please set a javascript file name ")
    print 'packageName ',':', opts['packageName']
    print 'jsName      ',':', opts['jsName'     ]
    return opts

def main():
    opts = parseOpts()
    print 'opts', opts

    device = frida.get_usb_device()
    print device
    try:
        session = device.attach(opts['packageName'])
        def on_message(message, data):
            print message, data
        script = session.create_script(open(opts['jsName']).read())
        script.on('message', on_message)
        script.load()
        print session
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

