// Ken Burns harness for projects that have no live prototype: it pans and zooms slowly across the
// project's REAL screens (public/images/...), crossfades between them, and moves a thin accent ring
// to the control being discussed. The screens are never altered or redrawn. The page is written to the
// work dir (not the repo), recorded in real time, then handed to record() in lib.mjs.
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { record, repo, WORK, sleep } from './lib.mjs';

/**
 * scene = { img: 'public/images/...png', w, h (image size),
 *           from: {cx, cy, w}, to: {cx, cy, w},      // view centre + view width in image px
 *           ring: {x, y, w, h} | [rectA, rectB] }     // in image px; optional
 */
export async function kenburns(id, scenes, { D = 1.55, F = 0.4, ring = '#E2705A' } = {}) {
  fs.mkdirSync(WORK, { recursive: true });
  const T = scenes.length * D + F;
  const data = scenes.map((s) => ({ ...s, src: pathToFileURL(path.join(repo, s.img)).href }));
  const html = `<!doctype html><meta charset=utf-8><style>
html,body{margin:0;background:#fff;overflow:hidden}
#stage{position:relative;width:960px;height:600px;overflow:hidden;background:#fff}
#stage img{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform,opacity;max-width:none}
.ring{position:absolute;border:3px solid ${ring};border-radius:10px;box-sizing:border-box;opacity:0;box-shadow:0 0 0 3px rgba(226,112,90,.18)}
</style><div id=stage></div><script>
const S=${JSON.stringify(data)}, D=${D}, F=${F}, T=${T}, N=S.length;
const stage=document.getElementById('stage');
const els=S.map(s=>{const i=new Image();i.src=s.src;stage.appendChild(i);return i});
const rings=S.map(()=>{const r=document.createElement('div');r.className='ring';stage.appendChild(r);return r});
// scene list for the timeline: each scene, then scene 0 again so the last frame matches the first
const L=S.map((s,i)=>({k:i,s:i*D})).concat([{k:0,s:N*D,again:true}]);
const e=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function view(sc,p){const q=e(p);const w0=sc.from.w,w1=sc.to.w;let w=w0+(w1-w0)*q,cx=sc.from.cx+(sc.to.cx-sc.from.cx)*q,cy=sc.from.cy+(sc.to.cy-sc.from.cy)*q;
 w=Math.min(w,sc.w,sc.h/0.625);const h=w*0.625;cx=clamp(cx,w/2,sc.w-w/2);cy=clamp(cy,h/2,sc.h-h/2);return{x0:cx-w/2,y0:cy-h/2,s:960/w}}
function frame(t){
 L.forEach((l,li)=>{const sc=S[l.k],el=els[l.k],rg=rings[l.k];
  const dt=t-l.s, vis=dt>=-1e-6&&dt<=D+F;
  if(!vis){if(!l.again){el.style.opacity=0;rg.style.opacity=0}return}
  const p=l.again?0:clamp(dt/(D+F),0,1), v=view(sc,p);
  const first=(l.k===0&&!l.again);
  el.style.opacity=first?1:clamp(dt/F,0,1);
  el.style.zIndex=li+1;
  el.style.transform='translate('+(-v.x0*v.s)+'px,'+(-v.y0*v.s)+'px) scale('+v.s+')';
  if(l.again||!sc.ring){rg.style.opacity=0;return}
  const rr=Array.isArray(sc.ring)?sc.ring:[sc.ring,sc.ring];
  const q=clamp((dt-.4)/(D-.45),0,1), m=q<.5?0:1, dip=rr[0]===rr[1]?1:clamp(Math.abs(q-.5)*7,0,1);
  const r={x:rr[0].x+(rr[1].x-rr[0].x)*m,y:rr[0].y+(rr[1].y-rr[0].y)*m,w:rr[0].w+(rr[1].w-rr[0].w)*m,h:rr[0].h+(rr[1].h-rr[0].h)*m};
  const ra=dip*clamp((dt-.3)/.35,0,1)*(dt>D?1-clamp((dt-D)/F,0,1):1);
  rg.style.left=((r.x-v.x0)*v.s-5)+'px';rg.style.top=((r.y-v.y0)*v.s-5)+'px';
  rg.style.width=(r.w*v.s+10)+'px';rg.style.height=(r.h*v.s+10)+'px';rg.style.opacity=ra;rg.style.zIndex=100+li;
 });
}
frame(0);
let t0=null;window.__ready=Promise.all(els.map(i=>i.decode()));
window.start=()=>{t0=performance.now();const f=n=>{const t=(n-t0)/1000;frame(Math.min(t,T));if(t<T+.2)requestAnimationFrame(f)};requestAnimationFrame(f)};
</script>`;
  const file = path.join(WORK, `kb-${id}.html`);
  fs.writeFileSync(file, html, 'utf8');
  await record(id, {
    url: pathToFileURL(file).href,
    minDur: 6,
    maxDur: 9,
    async run(page, t) {
      await page.evaluate(() => window.__ready);
      await sleep(500);
      await page.evaluate(() => window.start());
      t.mark();
      await sleep(T * 1000);
      t.end();
    },
  });
}
