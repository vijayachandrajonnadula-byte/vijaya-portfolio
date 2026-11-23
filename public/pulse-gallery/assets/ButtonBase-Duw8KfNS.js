import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{$ as t,C as n,T as r,V as i,h as a,i as o,m as s,n as c,r as l,w as u}from"./capitalize-DTW5MDI6.js";import{t as d}from"./isFocusVisible-CmHL3Ev5.js";import{n as f,t as p}from"./useEventCallback-B_yIq5zh.js";import{n as m,r as h}from"./emotion-react.browser.esm-CLQngqZq.js";import{t as g}from"./useTheme-Pvrzopa6.js";import{b as _}from"./index-2OXcKh2H.js";var v=e(t(),1),y=f,b=p;function x(e){let{focusableWhenDisabled:t,disabled:n,composite:r=!1,tabIndex:i=0,isNativeButton:a}=e,o=r&&t!==!1,s=r&&t===!1;return v.useMemo(()=>{let e={onKeyDown(e){n&&t&&e.key!==`Tab`&&e.preventDefault()}};return r||(e.tabIndex=i,!a&&n&&(e.tabIndex=t?i:-1)),(a&&(t||o)||!a&&n)&&(e[`aria-disabled`]=n),a&&(!t||s)&&(e.disabled=n),e},[r,n,t,o,s,a,i])}var S={};function ee(e){let{nativeButton:t,nativeButtonProp:n,internalNativeButton:r=t,allowInferredHostMismatch:i=!1,disabled:a,type:o,hasFormAction:s=!1,tabIndex:c=0,focusableWhenDisabled:l,stopEventPropagation:u=!1,onBeforeKeyDown:d,onBeforeKeyUp:f}=e,p=v.useRef(null),m=l===!0,h=x({focusableWhenDisabled:m,disabled:a,isNativeButton:t,tabIndex:c}),g=v.useCallback(()=>{let e=p.current;return e==null?t:e.tagName===`BUTTON`||!!(e.tagName===`A`&&e.href)},[t]),_=v.useMemo(()=>{let e=m?{}:{tabIndex:a?-1:c};return t?(e.type=o===void 0&&!s?`button`:o,m||(e.disabled=a)):(e.role=`button`,!m&&a&&(e[`aria-disabled`]=a)),m?{...e,...h}:e},[a,m,h,s,t,c,o]);return{getButtonProps:v.useCallback((e=S)=>{let{onClick:t,onKeyDown:n,onKeyUp:r,...i}=e,o=e=>{u&&e.stopPropagation(),a?e.preventDefault():t?.(e)},s=e=>{m&&h.onKeyDown(e),a||(d?.(e),n?.(e),e.target!==e.currentTarget||g()||(e.key===` `?e.preventDefault():e.key===`Enter`&&(e.preventDefault(),e.currentTarget.click())))},c=e=>{a||(f?.(e),r?.(e),e.target===e.currentTarget&&!g()&&e.key===` `&&!e.defaultPrevented&&e.currentTarget.click())};return{..._,...i,onClick:o,onKeyDown:s,onKeyUp:c}},[_,a,m,h,g,d,f,u]),rootRef:p}}var C={};function w(e,t){let n=v.useRef(C);return n.current===C&&(n.current=e(t)),n}var T=class e{ref={current:null};shouldMount=!1;mounted=null;didMount=!1;setShouldMount=null;static create(){return new e}static use(){let t=w(e.create).current,[n,r]=v.useState(!1);return t.shouldMount=n,t.setShouldMount=r,v.useEffect(t.mountEffect,[n]),t}mount(){return this.mounted||(this.mounted=D(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}mountEffect=()=>{this.shouldMount&&!this.didMount&&(this.ref.current!==null&&(this.didMount=!0),this.mounted.resolve())};start(...e){this.mount().then(()=>this.ref.current?.start(...e))}stop(...e){this.mount().then(()=>this.ref.current?.stop(...e))}pulsate(...e){this.mount().then(()=>this.ref.current?.pulsate(...e))}};function E(){return T.use()}function D(){let e,t,n=new Promise((n,r)=>{e=n,t=r});return n.resolve=e,n.reject=t,n}var O=[];function k(e){v.useEffect(e,O)}var A=class e{static create(){return new e}currentId=null;start(e,t){this.clear(),this.currentId=setTimeout(()=>{this.currentId=null,t()},e)}clear=()=>{this.currentId!==null&&(clearTimeout(this.currentId),this.currentId=null)};disposeEffect=()=>this.clear};function j(){let e=w(A.create).current;return k(e.disposeEffect),e}var M=i();function N(e){let{className:t,classes:n,pulsate:i=!1,rippleX:a,rippleY:o,rippleSize:s,in:c,onExited:l,timeout:u}=e,[d,f]=v.useState(!1),p=j(),m=v.useRef(!1),h=v.useRef(l);h.current=l;let g=l!=null,_=r(t,n.ripple,n.rippleVisible,i&&n.ripplePulsate),y={width:s,height:s,top:-(s/2)+o,left:-(s/2)+a},b=r(n.child,d&&n.childLeaving,i&&n.childPulsate);return!c&&!d&&f(!0),v.useEffect(()=>{!c&&g?m.current||(m.current=!0,p.start(u,()=>{m.current=!1,h.current?.()})):(m.current=!1,p.clear())},[p,g,c,u]),(0,M.jsx)(`span`,{className:_,style:y,children:(0,M.jsx)(`span`,{className:b})})}var P=n(`MuiTouchRipple`,[`root`,`ripple`,`rippleVisible`,`ripplePulsate`,`child`,`childLeaving`,`childPulsate`]),F=`(prefers-reduced-motion: reduce)`,I=0,te=`0ms`,ne=()=>{},L=()=>!1,re=()=>!0,R=()=>ne;function ie(e){let[t,n]=v.useState(()=>({enabled:e,matches:e?null:!1})),r=t.matches;return t.enabled!==e&&(r=null,e||(r=!1)),_(()=>{let r=t=>{n(n=>n.enabled===e&&n.matches===t?n:{enabled:e,matches:t})};if(!e){t.enabled&&r(!1);return}if(typeof window>`u`||typeof window.matchMedia!=`function`){r(!1);return}let i=window.matchMedia(F),a=()=>{r(i.matches)};return a(),i.addEventListener(`change`,a),()=>{i.removeEventListener(`change`,a)}},[e,t.enabled]),r}var z={...v}.useSyncExternalStore;function B(e){let t=e?re:L,[n,r]=v.useMemo(()=>{if(!e||typeof window>`u`||typeof window.matchMedia!=`function`)return[L,R];let t=window.matchMedia(F);return[()=>t.matches,e=>(t.addEventListener(`change`,e),()=>{t.removeEventListener(`change`,e)})]},[e]);return z(r,n,t)}var V=z===void 0?ie:B;function H(e,t){let n=V(!t&&e===`system`),r=!t&&(e===`always`||e===`system`&&n!==!1);return v.useMemo(()=>({shouldReduceMotion:r,getTransitionTiming(e){return r?{duration:I,delay:te}:e}}),[r])}var U=550,W={},G=[],ae=()=>{};function K(e,t){let n=new Set(t),r=new Map,i=[];for(let t of e)n.has(t)?i.length>0&&(r.set(t,i),i=[]):i.push(t);let a=[];for(let e of t){let t=r.get(e);t&&a.push(...t),a.push(e)}return a.push(...i),a}function q({event:e,element:t,center:n}){let r=t?t.getBoundingClientRect():{width:0,height:0,left:0,top:0},i,a;if(n||e===void 0||e.clientX===0&&e.clientY===0||!e.clientX&&!e.touches)i=Math.round(r.width/2),a=Math.round(r.height/2);else{let{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;i=Math.round(t-r.left),a=Math.round(n-r.top)}let o;if(n)o=Math.sqrt((2*r.width**2+r.height**2)/3),o%2==0&&(o+=1);else{let e=Math.max(Math.abs((t?t.clientWidth:0)-i),i)*2+2,n=Math.max(Math.abs((t?t.clientHeight:0)-a),a)*2+2;o=Math.sqrt(e**2+n**2)}return{rippleX:i,rippleY:a,rippleSize:o}}var J=h`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,Y=h`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,oe=h`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`;function se(e){if(e.motion.reducedMotion===`always`)return null;let t=m`
    &.${P.rippleVisible} {
      animation-name: ${J};
      animation-duration: ${U}ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
    }

    &.${P.ripplePulsate} {
      animation-duration: ${e.transitions.duration.shorter}ms;
    }

    & .${P.childLeaving} {
      animation-name: ${Y};
      animation-duration: ${U}ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
    }

    & .${P.childPulsate} {
      animation-name: ${oe};
      animation-duration: 2500ms;
      animation-timing-function: ${e.transitions.easing.easeInOut};
      animation-iteration-count: infinite;
      animation-delay: 200ms;
    }
  `;return e.motion.reducedMotion===`system`?m`
      @media (prefers-reduced-motion: no-preference) {
        ${t}
      }
    `:t}var ce=o(`span`,{name:`MuiTouchRipple`,slot:`Root`})({overflow:`hidden`,pointerEvents:`none`,position:`absolute`,zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:`inherit`}),X=o(N,{name:`MuiTouchRipple`,slot:`Ripple`})`
  opacity: 0;
  position: absolute;

  &.${P.rippleVisible} {
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
  & .${P.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${P.childLeaving} {
    opacity: 0;
  }

  & .${P.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
  }

  ${({theme:e})=>se(e)}
`,le=v.forwardRef(function(e,t){let n=c({props:e,name:`MuiTouchRipple`}),i=H(g().motion.reducedMotion,!1),{center:a=!1,classes:o=W,className:s,...l}=n,[u,d]=v.useState({items:G,order:G}),f=u.items,p=v.useRef(0),m=v.useRef(null),h=v.useRef(!1);k(()=>(h.current=!0,()=>{h.current=!1})),v.useEffect(()=>{m.current&&=(m.current(),null)},[f]);let _=v.useRef(!1),y=j(),x=v.useRef(null),S=v.useRef(null),ee=b(e=>{h.current&&d(t=>{let n=t.items.filter(t=>t.key!==e);return{items:n,order:K(t.order.filter(t=>t!==e),n.filter(e=>!e.exiting).map(e=>e.key))}})}),C=b(e=>{let{pulsate:t,rippleX:n,rippleY:r,rippleSize:i,cb:a}=e,o=p.current;p.current+=1,d(e=>{let a=[...e.items,{key:o,pulsate:t,rippleX:n,rippleY:r,rippleSize:i,exiting:!1}];return{items:a,order:K(e.order,a.filter(e=>!e.exiting).map(e=>e.key))}}),m.current=a}),w=b((e=W,t=W,n=ae)=>{let{pulsate:r=!1,center:i=a||t.pulsate,fakeElement:o=!1}=t;if(e?.type===`mousedown`&&_.current){_.current=!1;return}e?.type===`touchstart`&&(_.current=!0);let{rippleX:s,rippleY:c,rippleSize:l}=q({event:e,element:o?null:S.current,center:i});e?.touches?x.current===null&&(x.current=()=>{C({pulsate:r,rippleX:s,rippleY:c,rippleSize:l,cb:n})},y.start(80,()=>{x.current&&=(x.current(),null)})):C({pulsate:r,rippleX:s,rippleY:c,rippleSize:l,cb:n})}),T=b(()=>{w(W,{pulsate:!0})}),E=b((e,t)=>{y.clear(),e?.type===`touchend`&&x.current?(x.current(),x.current=null,y.start(0,()=>{E(e,t)})):(x.current=null,d(e=>{let t=e.items.findIndex(e=>!e.exiting);if(t===-1)return e;let n=e.items.slice();return n[t]={...n[t],exiting:!0},{items:n,order:K(e.order,n.filter(e=>!e.exiting).map(e=>e.key))}}),m.current=t)});v.useImperativeHandle(t,()=>({pulsate:T,start:w,stop:E}),[T,w,E]);let D=new Map(f.map(e=>[e.key,e])),O=u.order.map(e=>D.get(e)).filter(Boolean);return(0,M.jsx)(ce,{className:r(P.root,o.root,s),ref:S,...l,children:O.map(e=>(0,M.jsx)(X,{classes:{ripple:r(o.ripple,P.ripple),rippleVisible:r(o.rippleVisible,P.rippleVisible),ripplePulsate:r(o.ripplePulsate,P.ripplePulsate),child:r(o.child,P.child),childLeaving:r(o.childLeaving,P.childLeaving),childPulsate:r(o.childPulsate,P.childPulsate)},timeout:i.shouldReduceMotion?0:U,pulsate:e.pulsate,rippleX:e.rippleX,rippleY:e.rippleY,rippleSize:e.rippleSize,in:!e.exiting,onExited:()=>ee(e.key)},e.key))})});function ue(e){return u(`MuiButtonBase`,e)}var Z=n(`MuiButtonBase`,[`root`,`disabled`,`focusVisible`]),de=e=>{let{disabled:t,focusVisible:n,focusVisibleClassName:r,suppressFocusVisible:i,classes:o}=e,s=a({root:[`root`,t&&`disabled`,n&&!i&&`focusVisible`]},ue,o);return n&&!i&&r&&(s.root+=` ${r}`),s},fe=o(`button`,{name:`MuiButtonBase`,slot:`Root`})(l(({theme:e})=>({display:`inline-flex`,alignItems:`center`,justifyContent:`center`,position:`relative`,boxSizing:`border-box`,WebkitTapHighlightColor:`transparent`,backgroundColor:`transparent`,outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:`pointer`,userSelect:`none`,verticalAlign:`middle`,MozAppearance:`none`,WebkitAppearance:`none`,textDecoration:`none`,color:`inherit`,"&::-moz-focus-inner":{borderStyle:`none`},[`&.${Z.disabled}`]:{pointerEvents:`none`,cursor:`default`},"@media print":{colorAdjust:`exact`},variants:[{props:{internalDisabledThemeFocusVisible:!1},style:e.focusVisible&&{...s,[`&.${Z.focusVisible}`]:e.focusVisible}}]}))),pe=v.forwardRef(function(e,t){let n=c({props:e,name:`MuiButtonBase`}),{action:i,centerRipple:a=!1,children:o,className:s,component:l=`button`,disabled:u=!1,disableRipple:f=!1,disableTouchRipple:p=!1,focusRipple:m=!1,focusVisibleClassName:h,focusableWhenDisabled:g,suppressFocusVisible:_=!1,internalNativeButton:x,internalDisabledThemeFocusVisible:S=!1,LinkComponent:C=`a`,nativeButton:w,onBlur:T,onClick:D,onContextMenu:O,onDragLeave:k,onFocus:A,onFocusVisible:j,onKeyDown:N,onKeyUp:P,onMouseDown:F,onMouseLeave:I,onMouseUp:te,onTouchEnd:ne,onTouchMove:L,onTouchStart:re,tabIndex:R=0,TouchRippleProps:ie,touchRippleRef:z,type:B,...V}=n,H=!!(V.href||V.to),U=!!V.formAction,W=l;W===`button`&&H&&(W=C);let G=typeof W==`string`?W===`button`:x??!1,ae=w??G,K=E(),q=y(K.ref,z),[J,Y]=v.useState(!1);(u||_)&&J&&Y(!1);let oe=b(e=>{m&&!e.repeat&&J&&e.key===` `&&K.stop(e,()=>{K.start(e)})}),se=b(e=>{m&&e.key===` `&&J&&!e.defaultPrevented&&K.stop(e,()=>{K.pulsate(e)})}),{getButtonProps:ce,rootRef:X}=ee({nativeButton:ae,nativeButtonProp:w,internalNativeButton:G,allowInferredHostMismatch:H||typeof W==`string`,disabled:u,type:B,hasFormAction:U,tabIndex:R,onBeforeKeyDown:oe,onBeforeKeyUp:se}),{onClick:ue,onKeyDown:Z,onKeyUp:pe,...me}=ce({onClick:D,onKeyDown:N,onKeyUp:P});v.useImperativeHandle(i,()=>({focusVisible:()=>{Y(!0),X.current.focus()}}),[X]);let he=K.shouldMount&&!f&&!u;v.useEffect(()=>{J&&m&&!f&&K.pulsate()},[f,m,J,K]);let ge=Q(K,`start`,F,p),_e=Q(K,`stop`,O,p),ve=Q(K,`stop`,k,p),ye=Q(K,`stop`,te,p),be=Q(K,`stop`,e=>{J&&e.preventDefault(),I&&I(e)},p),xe=Q(K,`start`,re,p),Se=Q(K,`stop`,ne,p),Ce=Q(K,`stop`,L,p),we=Q(K,`stop`,e=>{d(e.target)||Y(!1),T&&T(e)},!1),Te=b(e=>{X.current||=e.currentTarget,!_&&d(e.target)&&(Y(!0),j&&j(e)),A&&A(e)}),$={};H&&($.tabIndex=u?-1:R,u&&($[`aria-disabled`]=u),$.type=B);let Ee=y(t,X),De={...n,centerRipple:a,component:l,disabled:u,disableRipple:f,disableTouchRipple:p,focusRipple:m,suppressFocusVisible:_,tabIndex:R,focusVisible:J,internalDisabledThemeFocusVisible:S},Oe=de(De);return(0,M.jsxs)(fe,{as:W,className:r(Oe.root,s),ownerState:De,onBlur:we,onClick:ue,onContextMenu:_e,onFocus:Te,onKeyDown:Z,onKeyUp:pe,onMouseDown:ge,onMouseLeave:be,onMouseUp:ye,onDragLeave:ve,onTouchEnd:Se,onTouchMove:Ce,onTouchStart:xe,ref:Ee,...H?$:me,...V,children:[o,he?(0,M.jsx)(le,{ref:q,center:a,...ie}):null]})});function Q(e,t,n,r=!1){return b(i=>(n&&n(i),r||e[t](i),!0))}export{j as a,b as c,A as i,y as l,Z as n,k as o,H as r,w as s,pe as t};