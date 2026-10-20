import * as THREE from '__THREE_URL__';
import {scrollProgress} from '__PROGRESS_URL__';
const sceneEl=document.getElementById('pour-scene'),canvas=document.getElementById('pour'),range=document.getElementById('scrub'),progress=document.getElementById('progress-value'),fill=document.getElementById('progress-fill'),status=document.getElementById('scene-status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer,material,scene,camera,ready=false,queued=false,current=0,hidden=document.hidden;
function render(p){current=p;range.value=String(Math.round(p*1000));progress.textContent=Math.round(p*100)+'%';fill.style.transform='scaleX('+p+')';if(ready&&!hidden){material.uniforms.uProgress.value=p;renderer.render(scene,camera);}}
function sync(){queued=false;if(reduced.matches)return;const r=sceneEl.getBoundingClientRect();render(scrollProgress(r.top,r.height,innerHeight));}
function schedule(){if(!queued){queued=true;requestAnimationFrame(sync);}}
function resize(){if(!ready)return;const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);material.uniforms.uView.value.set(r.width,r.height);render(current);}
function mode(){document.body.classList.toggle('reduced-motion',reduced.matches);if(reduced.matches)render(1);else schedule();}
range.addEventListener('input',()=>{const p=Number(range.value)/1000;if(reduced.matches){render(p);return;}const r=sceneEl.getBoundingClientRect(),top=scrollY+r.top,travel=r.height-innerHeight;window.scrollTo({top:top+p*Math.max(0,travel),behavior:'instant'});render(p);});
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{resize();schedule();});reduced.addEventListener('change',mode);
document.addEventListener('visibilitychange',()=>{hidden=document.hidden;if(!hidden){resize();render(current);}});
document.getElementById('restart').onclick=()=>{const r=sceneEl.getBoundingClientRect();scrollTo({top:scrollY+r.top,behavior:'instant'});render(reduced.matches?1:0);};
canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();ready=false;canvas.hidden=true;status.textContent='Vista estática: el motor gráfico se detuvo.';});
try{
 renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.toneMapping=THREE.NoToneMapping;
 scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-1,1,1,-1,0,2);camera.position.z=1;
 const [texture,finalTexture]=await Promise.all([new THREE.TextureLoader().loadAsync(document.getElementById('plate').src),new THREE.TextureLoader().loadAsync(document.getElementById('final-plate').src)]);for(const t of [texture,finalTexture]){t.colorSpace=THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=false;}
 material=new THREE.ShaderMaterial({uniforms:{uImage:{value:texture},uFinal:{value:finalTexture},uProgress:{value:0},uView:{value:new THREE.Vector2(1,1)},uImageSize:{value:new THREE.Vector2(texture.image.width,texture.image.height)}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:document.getElementById('fragment').textContent,depthTest:false,depthWrite:false,toneMapped:false});
 scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));
 let shaderError=false;renderer.debug.onShaderError=()=>{shaderError=true;};
 ready=true;resize();mode();
 if(shaderError)throw new Error('Shader compilation failed');
 status.textContent='Bajá para servir · subí para volver';
}catch(error){ready=false;canvas.hidden=true;status.textContent='Vista estática: WebGL no está disponible en este navegador.';console.warn('Negro Mercado: static fallback',error.message);}
