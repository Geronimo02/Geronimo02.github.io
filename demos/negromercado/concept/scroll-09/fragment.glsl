#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D uImage;
uniform sampler2D uFinal;
uniform float uProgress;
uniform vec2 uView;
uniform vec2 uImageSize;
varying vec2 vUv;
float sat(float x){return clamp(x,0.,1.);}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
 float va=uView.x/uView.y; float ia=uImageSize.x/uImageSize.y;
 vec2 uv=vUv;
 // The photographic plate covers the scene; mobile keeps the cup in view.
 if(va>ia){uv.y=(uv.y-.5)*(ia/va)+.5;}
 else{float focus=mix(.50,.72,1.-smoothstep(.65,1.2,va)); uv.x=(uv.x-.5)*(va/ia)+focus;}
 vec2 q=vec2(uv.x,1.-uv.y);
 float p=sat(uProgress);
 vec2 impact=vec2(.748,.451),spout=vec2(.768,.143);
 vec2 v=(q-vec2(.744,.445))/vec2(.195,.19);
 float radius=length(v);
 float arrival=smoothstep(.13,.96,p);
 float flowOn=smoothstep(.10,.18,p)*(1.-smoothstep(.82,.96,p));
 float surfaceMask=1.-smoothstep(.91,1.0,radius);
 vec2 fromImpact=(q-impact)/vec2(.195,.19);
 float wave=sin(length(fromImpact)*45.-p*51.)*exp(-length(fromImpact)*3.)*flowOn;
 vec2 rippleUV=uv+normalize(fromImpact+vec2(.0001))*wave*.0007*surfaceMask;
 vec3 col=texture2D(uImage,rippleUV).rgb;
 vec3 finished=texture2D(uFinal,rippleUV).rgb;
 float reveal=smoothstep(radius-.25,radius+.25,arrival*1.6);
 col=mix(col,finished,arrival*surfaceMask*reveal);
 // Every strand, wave and shade derives from progress: there is no clock.
 float t=(q.y-spout.y)/(impact.y-spout.y);
 float head=smoothstep(.015,.14,p),tail=smoothstep(.82,.96,p);
 float curve=sat(t);float wobble=sin(curve*24.-p*42.)*.00065*flowOn;
 float sx=mix(spout.x,impact.x,curve)+wobble;
 float width=mix(.012,.0063,curve)*(1.+sin(curve*37.-p*55.)*.045);
 float distanceX=abs(q.x-sx);
 float strand=(1.-smoothstep(width*.65,width,distanceX));
 float ends=smoothstep(tail-.004,tail+.004,t)*(1.-smoothstep(head-.004,head+.004,t));
 float exists=smoothstep(0.,.012,p)*(1.-smoothstep(.95,.97,p));
 float light=sat((q.x-sx)/width*.5+.5);
 vec3 liquid=mix(vec3(.78,.65,.46),vec3(1.,.985,.925),smoothstep(.04,.64,light));
 col=mix(col,liquid,strand*ends*exists);
 gl_FragColor=vec4(col,1.);
}
