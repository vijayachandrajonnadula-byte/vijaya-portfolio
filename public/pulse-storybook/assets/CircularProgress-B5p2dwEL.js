import{a as e,n as t}from"./rolldown-runtime-sJBDdmOt.js";import{t as n}from"./react-DlPsW1c0.js";import{a as r,c as i,i as a,l as o,n as s,r as c,s as l,t as u,u as d}from"./capitalize-BmeeCsQQ.js";import{i as f,o as p,t as m}from"./utils-Edfws2Ax.js";import{Dt as h,Tt as g,g as _,m as v,nt as y,p as b,tt as x,v as S,wt as C}from"./iframe-CFPYGgD7.js";import{n as w,t as T}from"./createSimplePaletteValueFilter-DP55OMRj.js";function E(e){return o(`MuiCircularProgress`,e)}function D(){return(D=t((()=>{i(),d(),l(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`track`,`circle`,`circleDisableShrink`])})))()}var O,k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=t((()=>{O=e(n(),1),y(),_(),c(),b(),s(),w(),p(),D(),k=C(),A=44,j=h`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,M=h`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`,N=typeof j==`string`?null:g`
        animation: ${j} 1.4s linear infinite;
      `,P=typeof M==`string`?null:g`
        animation: ${M} 1.4s ease-in-out infinite;
      `,F=e=>{let{classes:t,variant:n,color:i,disableShrink:a}=e,o={root:[`root`,n,`color${u(i)}`],svg:[`svg`],track:[`track`],circle:[`circle`,a&&`circleDisableShrink`]};return r(o,E,t)},I=S(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],t[`color${u(n.color)}`]]}})(a(({theme:e})=>{let t=m(e,{animation:`none`});return{display:`inline-block`,variants:[{props:{variant:`determinate`},style:{...f(e,`transform`)}},{props:{variant:`indeterminate`},style:N||{animation:`${j} 1.4s linear infinite`}},...t?[{props:{variant:`indeterminate`},style:t}]:[],...Object.entries(e.palette).filter(T()).map(([t])=>({props:{color:t},style:{color:(e.vars||e).palette[t].main}}))]}})),L=S(`svg`,{name:`MuiCircularProgress`,slot:`Svg`})({display:`block`}),R=S(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.circle,n.disableShrink&&t.circleDisableShrink]}})(a(({theme:e})=>{let t=m(e,{animation:`none`});return{stroke:`currentColor`,variants:[{props:{variant:`determinate`},style:{...f(e,`stroke-dashoffset`)}},{props:{variant:`indeterminate`},style:{strokeDasharray:`80px, 200px`,strokeDashoffset:0}},{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:P||{animation:`${M} 1.4s ease-in-out infinite`}},...t?[{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:t}]:[]]}})),z=S(`circle`,{name:`MuiCircularProgress`,slot:`Track`})(a(({theme:e})=>({stroke:`currentColor`,opacity:(e.vars||e).palette.action.activatedOpacity}))),B=O.forwardRef(function(e,t){let n=v({props:e,name:`MuiCircularProgress`}),{className:r,color:i=`primary`,disableShrink:a=!1,enableTrackSlot:o=!1,min:s,max:c,size:l=40,style:u,thickness:d=3.6,value:f=n.min??0,variant:p=`indeterminate`,...m}=n,h=s??0,g=c??100,_={...n,color:i,disableShrink:a,size:l,thickness:d,value:f,variant:p,enableTrackSlot:o},y=F(_),b={},S={},C={};if(p===`determinate`){let e=2*Math.PI*((A-d)/2),t=g-h;b.strokeDasharray=e.toFixed(3),b.strokeDashoffset=t>0?`${((g-f)/t*e).toFixed(3)}px`:`${e.toFixed(3)}px`,S.transform=`rotate(-90deg)`,C[`aria-valuenow`]=f,C[`aria-valuemin`]=h,C[`aria-valuemax`]=g}return(0,k.jsx)(I,{className:x(y.root,r),style:{width:l,height:l,...S,...u},ownerState:_,ref:t,role:`progressbar`,...C,...m,children:(0,k.jsxs)(L,{className:y.svg,ownerState:_,viewBox:`${A/2} ${A/2} ${A} ${A}`,children:[o?(0,k.jsx)(z,{className:y.track,ownerState:_,cx:A,cy:A,r:(A-d)/2,fill:`none`,strokeWidth:d,"aria-hidden":`true`}):null,(0,k.jsx)(R,{className:y.circle,style:b,ownerState:_,cx:A,cy:A,r:(A-d)/2,fill:`none`,strokeWidth:d})]})})})})))()}export{V as n,B as t};