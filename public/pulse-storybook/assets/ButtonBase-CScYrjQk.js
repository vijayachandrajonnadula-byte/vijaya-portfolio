import{a as e,n as t}from"./rolldown-runtime-sJBDdmOt.js";import{t as n}from"./react-DlPsW1c0.js";import{a as r,c as i,i as a,l as o,r as s,s as c,u as l}from"./capitalize-BvZDbWO7.js";import{i as u,n as d,r as f,t as p}from"./useEventCallback-zn8DLzFb.js";import{Dt as m,F as h,I as g,K as _,Tt as v,g as y,m as ee,nt as b,p as x,q as S,tt as C,v as w,w as te,wt as T}from"./iframe-Bn17Xg98.js";import{n as ne}from"./isFocusVisible-CqN4mfET.js";var E;function D(){return(D=t((()=>{f(),E=u})))()}var O;function k(){return(k=t((()=>{p(),O=d})))()}function re(e){let{focusableWhenDisabled:t,disabled:n,composite:r=!1,tabIndex:i=0,isNativeButton:a}=e,o=r&&t!==!1,s=r&&t===!1;return ie.useMemo(()=>{let e={onKeyDown(e){n&&t&&e.key!==`Tab`&&e.preventDefault()}};return r||(e.tabIndex=i,!a&&n&&(e.tabIndex=t?i:-1)),(a&&(t||o)||!a&&n)&&(e[`aria-disabled`]=n),a&&(!t||s)&&(e.disabled=n),e},[r,n,t,o,s,a,i])}var ie;function ae(){return(ae=t((()=>{ie=e(n(),1)})))()}function oe(e){let{nativeButton:t,nativeButtonProp:n,internalNativeButton:r=t,allowInferredHostMismatch:i=!1,disabled:a,type:o,hasFormAction:s=!1,tabIndex:c=0,focusableWhenDisabled:l,stopEventPropagation:u=!1,onBeforeKeyDown:d,onBeforeKeyUp:f}=e,p=A.useRef(null),m=l===!0,h=re({focusableWhenDisabled:m,disabled:a,isNativeButton:t,tabIndex:c}),g=A.useCallback(()=>{let e=p.current;return e==null?t:e.tagName===`BUTTON`||!!(e.tagName===`A`&&e.href)},[t]),_=A.useMemo(()=>{let e=m?{}:{tabIndex:a?-1:c};return t?(e.type=o===void 0&&!s?`button`:o,m||(e.disabled=a)):(e.role=`button`,!m&&a&&(e[`aria-disabled`]=a)),m?{...e,...h}:e},[a,m,h,s,t,c,o]);return{getButtonProps:A.useCallback((e=se)=>{let{onClick:t,onKeyDown:n,onKeyUp:r,...i}=e,o=e=>{u&&e.stopPropagation(),a?e.preventDefault():t?.(e)},s=e=>{m&&h.onKeyDown(e),a||(d?.(e),n?.(e),e.target!==e.currentTarget||g()||(e.key===` `?e.preventDefault():e.key===`Enter`&&(e.preventDefault(),e.currentTarget.click())))},c=e=>{a||(f?.(e),r?.(e),e.target===e.currentTarget&&!g()&&e.key===` `&&!e.defaultPrevented&&e.currentTarget.click())};return{..._,...i,onClick:o,onKeyDown:s,onKeyUp:c}},[_,a,m,h,g,d,f,u]),rootRef:p}}var A,se;function j(){return(j=t((()=>{A=e(n(),1),ae(),se={}})))()}function M(e,t){let n=ce.useRef(N);return n.current===N&&(n.current=e(t)),n}var ce,N;function P(){return(P=t((()=>{ce=e(n(),1),N={}})))()}function le(){return L.use()}function F(){let e,t,n=new Promise((n,r)=>{e=n,t=r});return n.resolve=e,n.reject=t,n}var I,L;function R(){return(R=t((()=>{I=e(n(),1),P(),L=class e{ref={current:null};shouldMount=!1;mounted=null;didMount=!1;setShouldMount=null;static create(){return new e}static use(){let t=M(e.create).current,[n,r]=I.useState(!1);return t.shouldMount=n,t.setShouldMount=r,I.useEffect(t.mountEffect,[n]),t}mount(){return this.mounted||(this.mounted=F(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}mountEffect=()=>{this.shouldMount&&!this.didMount&&(this.ref.current!==null&&(this.didMount=!0),this.mounted.resolve())};start(...e){this.mount().then(()=>this.ref.current?.start(...e))}stop(...e){this.mount().then(()=>this.ref.current?.stop(...e))}pulsate(...e){this.mount().then(()=>this.ref.current?.pulsate(...e))}}})))()}function z(e){B.useEffect(e,ue)}var B,ue;function V(){return(V=t((()=>{B=e(n(),1),ue=[]})))()}function H(){let e=M(U.create).current;return z(e.disposeEffect),e}var U;function W(){return(W=t((()=>{P(),V(),U=class e{static create(){return new e}currentId=null;start(e,t){this.clear(),this.currentId=setTimeout(()=>{this.currentId=null,t()},e)}clear=()=>{this.currentId!==null&&(clearTimeout(this.currentId),this.currentId=null)};disposeEffect=()=>this.clear}})))()}function de(e){let{className:t,classes:n,pulsate:r=!1,rippleX:i,rippleY:a,rippleSize:o,in:s,onExited:c,timeout:l}=e,[u,d]=G.useState(!1),f=H(),p=G.useRef(!1),m=G.useRef(c);m.current=c;let h=c!=null,g=C(t,n.ripple,n.rippleVisible,r&&n.ripplePulsate),_={width:o,height:o,top:-(o/2)+a,left:-(o/2)+i},v=C(n.child,u&&n.childLeaving,r&&n.childPulsate);return!s&&!u&&d(!0),G.useEffect(()=>{!s&&h?p.current||(p.current=!0,f.start(l,()=>{p.current=!1,m.current?.()})):(p.current=!1,f.clear())},[f,h,s,l]),(0,fe.jsx)(`span`,{className:g,style:_,children:(0,fe.jsx)(`span`,{className:v})})}var G,fe;function pe(){return(pe=t((()=>{G=e(n(),1),b(),W(),fe=T()})))()}var K;function me(){return(me=t((()=>{i(),K=c(`MuiTouchRipple`,[`root`,`ripple`,`rippleVisible`,`ripplePulsate`,`child`,`childLeaving`,`childPulsate`])})))()}function he(e){let[t,n]=q.useState(()=>({enabled:e,matches:e?null:!1})),r=t.matches;return t.enabled!==e&&(r=null,e||(r=!1)),S(()=>{let r=t=>{n(n=>n.enabled===e&&n.matches===t?n:{enabled:e,matches:t})};if(!e){t.enabled&&r(!1);return}if(typeof window>`u`||typeof window.matchMedia!=`function`){r(!1);return}let i=window.matchMedia(ve),a=()=>{r(i.matches)};return a(),i.addEventListener(`change`,a),()=>{i.removeEventListener(`change`,a)}},[e,t.enabled]),r}function ge(e){let t=e?Ce:Se,[n,r]=q.useMemo(()=>{if(!e||typeof window>`u`||typeof window.matchMedia!=`function`)return[Se,we];let t=window.matchMedia(ve);return[()=>t.matches,e=>(t.addEventListener(`change`,e),()=>{t.removeEventListener(`change`,e)})]},[e]);return J(r,n,t)}function _e(e,t){let n=Te(!t&&e===`system`),r=!t&&(e===`always`||e===`system`&&n!==!1);return q.useMemo(()=>({shouldReduceMotion:r,getTransitionTiming(e){return r?{duration:ye,delay:be}:e}}),[r])}var q,ve,ye,be,xe,Se,Ce,we,J,Te;function Y(){return(Y=t((()=>{q=e(n(),1),_(),ve=`(prefers-reduced-motion: reduce)`,ye=0,be=`0ms`,xe=()=>{},Se=()=>!1,Ce=()=>!0,we=()=>xe,J={...q}.useSyncExternalStore,Te=J===void 0?he:ge})))()}function Ee(e,t){let n=new Set(t),r=new Map,i=[];for(let t of e)n.has(t)?i.length>0&&(r.set(t,i),i=[]):i.push(t);let a=[];for(let e of t){let t=r.get(e);t&&a.push(...t),a.push(e)}return a.push(...i),a}function De({event:e,element:t,center:n}){let r=t?t.getBoundingClientRect():{width:0,height:0,left:0,top:0},i,a;if(n||e===void 0||e.clientX===0&&e.clientY===0||!e.clientX&&!e.touches)i=Math.round(r.width/2),a=Math.round(r.height/2);else{let{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;i=Math.round(t-r.left),a=Math.round(n-r.top)}let o;if(n)o=Math.sqrt((2*r.width**2+r.height**2)/3),o%2==0&&(o+=1);else{let e=Math.max(Math.abs((t?t.clientWidth:0)-i),i)*2+2,n=Math.max(Math.abs((t?t.clientHeight:0)-a),a)*2+2;o=Math.sqrt(e**2+n**2)}return{rippleX:i,rippleY:a,rippleSize:o}}function Oe(e){if(e.motion.reducedMotion===`always`)return null;let t=v`
    &.${K.rippleVisible} {
      animation-name: ${Ne};
      animation-duration: ${Ae}ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
    }

    &.${K.ripplePulsate} {
      animation-duration: ${e.transitions.duration.shorter}ms;
    }

    & .${K.childLeaving} {
      animation-name: ${Pe};
      animation-duration: ${Ae}ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
    }

    & .${K.childPulsate} {
      animation-name: ${Fe};
      animation-duration: 2500ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
      animation-iteration-count: infinite;
      animation-delay: 200ms;
    }
  `;return e.motion.reducedMotion===`system`?v`
      @media (prefers-reduced-motion: no-preference) {
        ${t}
      }
    `:t}var X,ke,Ae,Z,je,Me,Ne,Pe,Fe,Ie,Le,Re;function ze(){return(ze=t((()=>{X=e(n(),1),b(),V(),W(),y(),x(),pe(),me(),k(),Y(),ke=T(),Ae=550,Z={},je=[],Me=()=>{},Ne=m`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,Pe=m`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,Fe=m`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,Ie=w(`span`,{name:`MuiTouchRipple`,slot:`Root`})({overflow:`hidden`,pointerEvents:`none`,position:`absolute`,zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:`inherit`}),Le=w(de,{name:`MuiTouchRipple`,slot:`Ripple`})`
  opacity: 0;
  position: absolute;

  &.${K.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
  }

  /*
   * Order matters: 'child', 'childLeaving' and 'childPulsate' apply to the same
   * element with equal specificity, so the later rule wins. 'child' must come
   * before 'childLeaving' so the leaving 'opacity: 0' takes precedence. A focus
   * (pulsate) ripple keeps 'pulsateKeyframe' (no opacity animation) on exit, so
   * it relies on this static 'opacity: 0' to disappear on blur instead of
   * lingering until removal.
   */
  & .${K.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${K.childLeaving} {
    opacity: 0;
  }

  & .${K.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
  }

  ${({theme:e})=>Oe(e)}
`,Re=X.forwardRef(function(e,t){let n=ee({props:e,name:`MuiTouchRipple`}),r=_e(te().motion.reducedMotion,!1),{center:i=!1,classes:a=Z,className:o,...s}=n,[c,l]=X.useState({items:je,order:je}),u=c.items,d=X.useRef(0),f=X.useRef(null),p=X.useRef(!1);z(()=>(p.current=!0,()=>{p.current=!1})),X.useEffect(()=>{f.current&&=(f.current(),null)},[u]);let m=X.useRef(!1),h=H(),g=X.useRef(null),_=X.useRef(null),v=O(e=>{p.current&&l(t=>{let n=t.items.filter(t=>t.key!==e);return{items:n,order:Ee(t.order.filter(t=>t!==e),n.filter(e=>!e.exiting).map(e=>e.key))}})}),y=O(e=>{let{pulsate:t,rippleX:n,rippleY:r,rippleSize:i,cb:a}=e,o=d.current;d.current+=1,l(e=>{let a=[...e.items,{key:o,pulsate:t,rippleX:n,rippleY:r,rippleSize:i,exiting:!1}];return{items:a,order:Ee(e.order,a.filter(e=>!e.exiting).map(e=>e.key))}}),f.current=a}),b=O((e=Z,t=Z,n=Me)=>{let{pulsate:r=!1,center:a=i||t.pulsate,fakeElement:o=!1}=t;if(e?.type===`mousedown`&&m.current){m.current=!1;return}e?.type===`touchstart`&&(m.current=!0);let{rippleX:s,rippleY:c,rippleSize:l}=De({event:e,element:o?null:_.current,center:a});e?.touches?g.current===null&&(g.current=()=>{y({pulsate:r,rippleX:s,rippleY:c,rippleSize:l,cb:n})},h.start(80,()=>{g.current&&=(g.current(),null)})):y({pulsate:r,rippleX:s,rippleY:c,rippleSize:l,cb:n})}),x=O(()=>{b(Z,{pulsate:!0})}),S=O((e,t)=>{h.clear(),e?.type===`touchend`&&g.current?(g.current(),g.current=null,h.start(0,()=>{S(e,t)})):(g.current=null,l(e=>{let t=e.items.findIndex(e=>!e.exiting);if(t===-1)return e;let n=e.items.slice();return n[t]={...n[t],exiting:!0},{items:n,order:Ee(e.order,n.filter(e=>!e.exiting).map(e=>e.key))}}),f.current=t)});X.useImperativeHandle(t,()=>({pulsate:x,start:b,stop:S}),[x,b,S]);let w=new Map(u.map(e=>[e.key,e])),T=c.order.map(e=>w.get(e)).filter(Boolean);return(0,ke.jsx)(Ie,{className:C(K.root,a.root,o),ref:_,...s,children:T.map(e=>(0,ke.jsx)(Le,{classes:{ripple:C(a.ripple,K.ripple),rippleVisible:C(a.rippleVisible,K.rippleVisible),ripplePulsate:C(a.ripplePulsate,K.ripplePulsate),child:C(a.child,K.child),childLeaving:C(a.childLeaving,K.childLeaving),childPulsate:C(a.childPulsate,K.childPulsate)},timeout:r.shouldReduceMotion?0:Ae,pulsate:e.pulsate,rippleX:e.rippleX,rippleY:e.rippleY,rippleSize:e.rippleSize,in:!e.exiting,onExited:()=>v(e.key)},e.key))})})})))()}function Be(e){return o(`MuiButtonBase`,e)}var Ve;function He(){return(He=t((()=>{i(),l(),Ve=c(`MuiButtonBase`,[`root`,`disabled`,`focusVisible`])})))()}function Q(e,t,n,r=!1){return O(i=>(n&&n(i),r||e[t](i),!0))}var $,Ue,We,Ge,Ke;function qe(){return(qe=t((()=>{$=e(n(),1),b(),y(),s(),x(),D(),k(),j(),R(),ze(),He(),h(),Ue=T(),We=e=>{let{disabled:t,focusVisible:n,focusVisibleClassName:i,suppressFocusVisible:a,classes:o}=e,s=r({root:[`root`,t&&`disabled`,n&&!a&&`focusVisible`]},Be,o);return n&&!a&&i&&(s.root+=` ${i}`),s},Ge=w(`button`,{name:`MuiButtonBase`,slot:`Root`})(a(({theme:e})=>({display:`inline-flex`,alignItems:`center`,justifyContent:`center`,position:`relative`,boxSizing:`border-box`,WebkitTapHighlightColor:`transparent`,backgroundColor:`transparent`,outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:`pointer`,userSelect:`none`,verticalAlign:`middle`,MozAppearance:`none`,WebkitAppearance:`none`,textDecoration:`none`,color:`inherit`,"&::-moz-focus-inner":{borderStyle:`none`},[`&.${Ve.disabled}`]:{pointerEvents:`none`,cursor:`default`},"@media print":{colorAdjust:`exact`},variants:[{props:{internalDisabledThemeFocusVisible:!1},style:e.focusVisible&&{...g,[`&.${Ve.focusVisible}`]:e.focusVisible}}]}))),Ke=$.forwardRef(function(e,t){let n=ee({props:e,name:`MuiButtonBase`}),{action:r,centerRipple:i=!1,children:a,className:o,component:s=`button`,disabled:c=!1,disableRipple:l=!1,disableTouchRipple:u=!1,focusRipple:d=!1,focusVisibleClassName:f,focusableWhenDisabled:p,suppressFocusVisible:m=!1,internalNativeButton:h,internalDisabledThemeFocusVisible:g=!1,LinkComponent:_=`a`,nativeButton:v,onBlur:y,onClick:b,onContextMenu:x,onDragLeave:S,onFocus:w,onFocusVisible:te,onKeyDown:T,onKeyUp:D,onMouseDown:k,onMouseLeave:re,onMouseUp:ie,onTouchEnd:ae,onTouchMove:A,onTouchStart:se,tabIndex:j=0,TouchRippleProps:M,touchRippleRef:ce,type:N,...P}=n,F=!!(P.href||P.to),I=!!P.formAction,L=s;L===`button`&&F&&(L=_);let R=typeof L==`string`?L===`button`:h??!1,z=v??R,B=le(),ue=E(B.ref,ce),[V,H]=$.useState(!1);(c||m)&&V&&H(!1);let U=O(e=>{d&&!e.repeat&&V&&e.key===` `&&B.stop(e,()=>{B.start(e)})}),W=O(e=>{d&&e.key===` `&&V&&!e.defaultPrevented&&B.stop(e,()=>{B.pulsate(e)})}),{getButtonProps:de,rootRef:G}=oe({nativeButton:z,nativeButtonProp:v,internalNativeButton:R,allowInferredHostMismatch:F||typeof L==`string`,disabled:c,type:N,hasFormAction:I,tabIndex:j,onBeforeKeyDown:U,onBeforeKeyUp:W}),{onClick:fe,onKeyDown:pe,onKeyUp:K,...me}=de({onClick:b,onKeyDown:T,onKeyUp:D});$.useImperativeHandle(r,()=>({focusVisible:()=>{H(!0),G.current.focus()}}),[G]);let he=B.shouldMount&&!l&&!c;$.useEffect(()=>{V&&d&&!l&&B.pulsate()},[l,d,V,B]);let ge=Q(B,`start`,k,u),_e=Q(B,`stop`,x,u),q=Q(B,`stop`,S,u),ve=Q(B,`stop`,ie,u),ye=Q(B,`stop`,e=>{V&&e.preventDefault(),re&&re(e)},u),be=Q(B,`start`,se,u),xe=Q(B,`stop`,ae,u),Se=Q(B,`stop`,A,u),Ce=Q(B,`stop`,e=>{ne(e.target)||H(!1),y&&y(e)},!1),we=O(e=>{G.current||=e.currentTarget,!m&&ne(e.target)&&(H(!0),te&&te(e)),w&&w(e)}),J={};F&&(J.tabIndex=c?-1:j,c&&(J[`aria-disabled`]=c),J.type=N);let Te=E(t,G),Y={...n,centerRipple:i,component:s,disabled:c,disableRipple:l,disableTouchRipple:u,focusRipple:d,suppressFocusVisible:m,tabIndex:j,focusVisible:V,internalDisabledThemeFocusVisible:g},Ee=We(Y);return(0,Ue.jsxs)(Ge,{as:L,className:C(Ee.root,o),ownerState:Y,onBlur:Ce,onClick:fe,onContextMenu:_e,onFocus:we,onKeyDown:pe,onKeyUp:K,onMouseDown:ge,onMouseLeave:ye,onMouseUp:ve,onDragLeave:q,onTouchEnd:xe,onTouchMove:Se,onTouchStart:be,ref:Te,...F?J:me,...P,children:[a,he?(0,Ue.jsx)(Re,{ref:ue,center:i,...M}):null]})})})))()}export{E as _,Y as a,W as c,z as d,P as f,D as g,O as h,He as i,H as l,k as m,qe as n,_e as o,M as p,Ve as r,U as s,Ke as t,V as u};