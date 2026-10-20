"""Render actual shader with Mesa EGL. These are GPU frames, NOT browser screenshots."""
from pathlib import Path
import ctypes as C,ctypes.util,json,array
from PIL import Image,ImageChops
D=Path(__file__).resolve().parent;W,H=1280,720
E=C.CDLL(ctypes.util.find_library('EGL'));G=C.CDLL(ctypes.util.find_library('GL'))
def bind(lib,n,r,args):f=getattr(lib,n);f.restype=r;f.argtypes=args;return f
I=C.c_int;U=C.c_uint;V=C.c_void_p;F=C.c_float;P=C.POINTER
getdisplay=bind(E,'eglGetPlatformDisplay',V,[U,V,P(I)])
dpy=getdisplay(0x31DD,None,None)
init=bind(E,'eglInitialize',U,[V,P(I),P(I)]);a,b=I(),I();assert init(dpy,C.byref(a),C.byref(b))
assert bind(E,'eglBindAPI',U,[U])(0x30A2)
attrs=(I*13)(0x3033,1,0x3040,8,0x3024,8,0x3023,8,0x3022,8,0x3021,8,0x3038)
cfg=V();num=I();assert bind(E,'eglChooseConfig',U,[V,P(I),P(V),I,P(I)])(dpy,attrs,C.byref(cfg),1,C.byref(num)) and num.value
surf=bind(E,'eglCreatePbufferSurface',V,[V,V,P(I)])(dpy,cfg,(I*5)(0x3057,W,0x3056,H,0x3038));assert surf
ctx=bind(E,'eglCreateContext',V,[V,V,V,P(I)])(dpy,cfg,None,(I*1)(0x3038));assert ctx
assert bind(E,'eglMakeCurrent',U,[V,V,V,V])(dpy,surf,surf,ctx)
version=bind(G,'glGetString',C.c_char_p,[U])(0x1F02).decode()
create=bind(G,'glCreateShader',U,[U]);source=bind(G,'glShaderSource',None,[U,I,P(C.c_char_p),P(I)]);compile_=bind(G,'glCompileShader',None,[U]);getiv=bind(G,'glGetShaderiv',None,[U,U,P(I)]);getlog=bind(G,'glGetShaderInfoLog',None,[U,I,P(I),C.c_char_p])
def shader(kind,text):
 s=create(kind);t=C.c_char_p(text.encode());source(s,1,C.byref(t),None);compile_(s);ok=I();getiv(s,0x8B81,C.byref(ok));log=C.create_string_buffer(10000);getlog(s,10000,None,log);assert ok.value,log.value.decode();return s
vs=shader(0x8B31,'attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}')
fs=shader(0x8B30,(D/'fragment.glsl').read_text())
program=bind(G,'glCreateProgram',U,[])();attach=bind(G,'glAttachShader',None,[U,U]);attach(program,vs);attach(program,fs);bind(G,'glLinkProgram',None,[U])(program);ok=I();bind(G,'glGetProgramiv',None,[U,U,P(I)])(program,0x8B82,C.byref(ok));assert ok.value
bind(G,'glUseProgram',None,[U])(program)
verts=array.array('f',[-1,-1,0,0,1,-1,1,0,-1,1,0,1,-1,1,0,1,1,-1,1,0,1,1,1,1]);buf=U();bind(G,'glGenBuffers',None,[I,P(U)])(1,C.byref(buf));bind(G,'glBindBuffer',None,[U,U])(0x8892,buf);vdata=(F*len(verts))(*verts);bind(G,'glBufferData',None,[U,C.c_ssize_t,V,U])(0x8892,C.sizeof(vdata),C.cast(vdata,V),0x88E4)
for n,off in [('position',0),('uv',8)]:
 loc=bind(G,'glGetAttribLocation',I,[U,C.c_char_p])(program,n.encode());bind(G,'glEnableVertexAttribArray',None,[U])(loc);bind(G,'glVertexAttribPointer',None,[U,I,U,U,I,V])(loc,2,0x1406,0,16,V(off))
im=Image.open(D/'coffee-before.webp').convert('RGBA')
for unit,name in [(0,'coffee-before.webp'),(1,'coffee-after.webp')]:
 image=Image.open(D/name).convert('RGBA');raw=image.transpose(Image.Transpose.FLIP_TOP_BOTTOM).tobytes();tex=U();bind(G,'glActiveTexture',None,[U])(0x84C0+unit);bind(G,'glGenTextures',None,[I,P(U)])(1,C.byref(tex));bind(G,'glBindTexture',None,[U,U])(0x0DE1,tex)
 for k,v in [(0x2801,0x2601),(0x2800,0x2601),(0x2802,0x812F),(0x2803,0x812F)]:bind(G,'glTexParameteri',None,[U,U,I])(0x0DE1,k,v)
 bind(G,'glTexImage2D',None,[U,I,I,I,I,I,U,U,V])(0x0DE1,0,0x1908,image.width,image.height,0,0x1908,0x1401,C.cast(C.c_char_p(raw),V))
uniform=bind(G,'glGetUniformLocation',I,[U,C.c_char_p]);bind(G,'glUniform1i',None,[I,I])(uniform(program,b'uImage'),0)
bind(G,'glUniform1i',None,[I,I])(uniform(program,b'uFinal'),1)
u2=bind(G,'glUniform2f',None,[I,F,F]);u2(uniform(program,b'uView'),W,H);u2(uniform(program,b'uImageSize'),im.width,im.height)
bind(G,'glViewport',None,[I,I,I,I])(0,0,W,H);up=uniform(program,b'uProgress');u1=bind(G,'glUniform1f',None,[I,F]);draw=bind(G,'glDrawArrays',None,[U,I,I]);read=bind(G,'glReadPixels',None,[I,I,I,I,U,U,V]);finish=bind(G,'glFinish',None,[])
def render(p):
 u1(up,p);draw(0x0004,0,6);finish();out=(C.c_ubyte*(W*H*4))();read(0,0,W,H,0x1908,0x1401,C.cast(out,V));return bytes(out)
frames={}
for p in [0,.25,.5,.75,1]:
 data=render(p);frames[p]=data;Image.frombytes('RGBA',(W,H),data).transpose(Image.Transpose.FLIP_TOP_BOTTOM).convert('RGB').save(D/'shader-renders'/('progress-'+str(int(p*100)).zfill(3)+'.png'))
assert render(.5)==frames[.5],'Frame changes without new progress'
render(.8);assert render(.25)==frames[.25],'Reverse progress is not deterministic'
assert len(set(frames.values()))==5,'Frames do not change'
check={'shader_compile':'pass','shader_link':'pass','distinct_progress_frames':5,'stop_is_identical':'pass','reverse_is_identical':'pass','renderer':version,'render_type':'EGL OpenGL actual fragment shader, NOT browser screenshot','browser_render':'not_tested','scroll_dom_interaction':'not_tested'}
(D/'shader-checks.json').write_text(json.dumps(check,indent=2)+'\n');print(json.dumps(check))
