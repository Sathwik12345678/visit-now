'use client';
import {useEffect,useRef} from 'react';
import {Phone,ScreenType} from './phone';

const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export default function JourneyPhone({screen}:{screen:ScreenType}) {
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const node=root.current!;
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  let anchors:{x:number;y:number}[]=[];
  let howTop=0,howHeight=0,aboutTop=0,appTop=0;
  let docked=false,initialized=false,dockTime=0;
  let lastPose={x:0,y:0,scale:1,rotation:0};
  let dockFrom=lastPose;
  const measure=()=>{
   anchors=['phone-start','phone-about','phone-finish','phone-download'].map(id=>{const r=document.getElementById(id)!.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+window.scrollY+r.height/2}});
   const how=document.getElementById('how')!;
   howTop=how.getBoundingClientRect().top+window.scrollY;howHeight=how.offsetHeight;
   aboutTop=document.getElementById('about')!.getBoundingClientRect().top+window.scrollY;
   appTop=document.getElementById('app')!.getBoundingClientRect().top+window.scrollY;
   schedule();
  };
  const draw=()=>{
   frame=0;
   const enabled=!media.matches && window.innerWidth>=1024;
   document.documentElement.classList.toggle('journey-enabled',enabled);
   if(!enabled){node.style.visibility='hidden';return}
   const y=window.scrollY,h=window.innerHeight,w=window.innerWidth;
   const center=h/2+35;
   const a=anchors[0],b=anchors[1],c=anchors[2],d=anchors[3];
   const entry=clamp((y-(a.y-center))/Math.max(1,aboutTop-(a.y-center)));
   const leaveStart=howTop+howHeight-h;
   const leave=clamp((y-leaveStart)/Math.max(1,c.y-center-leaveStart));
   const smooth=(t:number)=>t*t*(3-2*t);
   const t=smooth(entry),u=smooth(leave);
   const scale=Math.min(1.32,(h-150)/492,(w-60)/242);
   // Pause in the three-phone showcase, then carry the same phone to download.
   const dock=c.y-center;
   const depart=dock+Math.min(h*.18,(d.y-c.y)*.15);
   const arrive=d.y-center;
   const travel=smooth(clamp((y-depart)/Math.max(1,arrive-depart)));
   const desktop=w>=1024;
   const howSide=desktop?smooth(clamp((y-(howTop-h*.7))/(h*.55))):0;
   const storyX=mix(mix(a.x,b.x,t),a.x,howSide);
   let x=mix(mix(storyX,c.x,u),d.x,travel);
   let py=y<a.y-center?a.y-y:center;
   if(y>dock)py=y<depart?c.y-y:y<arrive?mix(c.y-depart,center,travel):d.y-y;
   let phoneSize=mix(mix(1,scale,t),1,u);
   let rotation=mix(mix(-9,0,t),7,travel);
   const shouldDock=desktop && y>=appTop-h*.75;
   if(shouldDock && !docked){
    dockTime=initialized?performance.now():0;
    dockFrom={...lastPose};
   }
   docked=shouldDock;
   if(desktop && !shouldDock && y>=leaveStart){x=a.x;phoneSize=scale}
   if(shouldDock && y<depart){
    const progress=dockTime?smooth(clamp((performance.now()-dockTime)/450)):1;
    // Descend beside the heading first, then slide into the actual showcase slot.
    x=mix(dockFrom.x,c.x,smooth(clamp((progress-.6)/.4)));
    py=mix(dockFrom.y,c.y,smooth(clamp(progress/.6)))-y;
    phoneSize=mix(dockFrom.scale,1,progress);
    rotation=mix(dockFrom.rotation,0,progress);
    if(progress<1)schedule();
   }
   initialized=true;
   lastPose={x,y:py+y,scale:phoneSize,rotation};
   node.style.visibility=py < -400 || py > h+400?'hidden':'visible';
   node.style.transform=`translate3d(${x}px,${py}px,0) translate(-50%,-50%) scale(${phoneSize}) rotate(${rotation}deg)`;
   const about=clamp((y-aboutTop+h*.4)/(h*.35))*(1-leave);
   const steps=clamp((y-howTop+h*.35)/(h*.3))*(1-leave);
   node.querySelector<HTMLElement>('.journey-about-screen')!.style.opacity=String(shouldDock?0:about*(1-steps));
   node.querySelector<HTMLElement>('.journey-steps-screen')!.style.opacity=String(shouldDock?0:steps);
   node.querySelectorAll<HTMLElement>('.journey-stack-card').forEach((card,i)=>{
    const progress=clamp((y-howTop-h*.1-i*h*.38)/(h*.32));
    card.style.transform=`translateY(${(1-progress)*230+i*14}px) scale(${1-i*.025})`;
    card.style.opacity=String(progress);
   });
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw)};
  const observer=new ResizeObserver(measure);
  ['home','about','how','app','download'].forEach(id=>observer.observe(document.getElementById(id)!));
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure);media.addEventListener('change',measure);
  measure();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);media.removeEventListener('change',measure);document.documentElement.classList.remove('journey-enabled')};
 },[]);
 return <div ref={root} className="journey-phone" aria-hidden="true"><Phone screen={screen}/><div className="journey-about-screen journey-content"><span className="eyebrow">VISIT NOW</span><h2>A better way to experience healthcare.</h2><p>Discover hospitals, plan your visit, and arrive with confidence.</p><div className="journey-ad">Less waiting.<br/>More living.</div><p>Simplicity · Accessibility · Convenience</p></div><div className="journey-steps-screen journey-content"><span className="eyebrow">How it works</span><h2>Your visit.<br/>Three simple steps.</h2><div className="journey-stack">{[['Discover','Find hospitals and explore healthcare services.'],['Plan','Review information and prepare for your visit.'],['Visit','Carry everything you need into your healthcare journey.']].map(([title,text],i)=><div className="journey-stack-card" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></div>)}</div></div></div>;
}
