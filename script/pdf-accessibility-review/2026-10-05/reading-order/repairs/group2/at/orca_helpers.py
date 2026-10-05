from pathlib import Path
import os,subprocess,time,ctypes

def start(base,name,procs):
 d=base/(name+'-speech-config');d.mkdir(exist_ok=True);(d/'modules').mkdir(exist_ok=True);(d/'modules/dummy.conf').write_text('')
 (d/'speechd.conf').write_text('LogLevel 3\nAddModule "dummy" "sd_dummy" "dummy.conf"\nDefaultModule dummy\n')
 logs=base/(name+'-speech-logs');logs.mkdir(exist_ok=True);socket=base/(name+'-runtime')/'speechd.sock';os.environ['SPEECHD_ADDRESS']='unix_socket:'+str(socket)
 out=(base/(name+'-speech.log')).open('w');procs.append(subprocess.Popen(['speech-dispatcher','-s','-C',str(d),'-L',str(logs),'-S',str(socket),'-P',str(base/(name+'-runtime')/'speechd.pid'),'-t','0'],stdout=out,stderr=subprocess.STDOUT))
 time.sleep(1)
 out=(base/(name+'-orca.log')).open('w');procs.append(subprocess.Popen(['orca','--debug-file',str(base/(name+'-orca-debug.txt'))],stdout=out,stderr=subprocess.STDOUT))
 time.sleep(2)

def keys():
 x=ctypes.CDLL('libX11.so.6');xt=ctypes.CDLL('libXtst.so.6');x.XOpenDisplay.restype=ctypes.c_void_p;x.XStringToKeysym.argtypes=[ctypes.c_char_p];x.XStringToKeysym.restype=ctypes.c_ulong;x.XKeysymToKeycode.argtypes=[ctypes.c_void_p,ctypes.c_ulong];x.XKeysymToKeycode.restype=ctypes.c_uint;xt.XTestFakeKeyEvent.argtypes=[ctypes.c_void_p,ctypes.c_uint,ctypes.c_int,ctypes.c_ulong];x.XFlush.argtypes=[ctypes.c_void_p]
 display=x.XOpenDisplay(None);assert display
 def key(name,on):xt.XTestFakeKeyEvent(display,x.XKeysymToKeycode(display,x.XStringToKeysym(name.encode())),on,0);x.XFlush(display);time.sleep(.1)
 key('Control_L',1);key('Home',1);key('Home',0);key('Control_L',0);time.sleep(.5)
 key('h',1);key('h',0);time.sleep(.5);key('KP_Add',1);key('KP_Add',0)
