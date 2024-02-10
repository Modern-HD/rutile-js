/** @typedef {import('../index')} Rutile */ /** @type {Rutile.Rutile} */ const Rutile=function(){const e=["javascript","script","<iframe","vbscript","applet","embed","<object","<frame","onblur","onchange","onclick","ondblclick","enerror","onfocus","onload","onmouse","onscroll","onsubmit","onunload","onerror"],t=[{origin:"onClick",fix:"onclick"},{origin:"onChange",fix:"onchange"},{origin:"onInput",fix:"oninput"}],a=new Map,n=new Map,l=new Map,s=new Map,o=new Map;function*r(e){let t=0,a=0;for(;;)a>=Number.MAX_SAFE_INTEGER&&(t++,a=0),yield`__${e}_${t}_${a++}_`}const c=r("FUNC"),u=r("DOM_REF"),i=r("DOM_READY"),d=r("DOM_SUBS"),f=r("DOM_SUBS_CALL_BACK"),b={render(r,c,u){const i=new RegExp(e.join("|"),"gi"),d=r.replace(i,"x");for(;i.test(r);)r=r.replace(i,"x");const f=document.createElement("div"),p=[];f.innerHTML=d,t.forEach(((e,t)=>{f.querySelectorAll(`div [data-func_prepare_${t}]`).forEach((n=>{let l;const s=n.dataset[`func_prepare_${t}`];(l=a.get(s))&&(n[e.fix]=l),delete n.dataset[`func_prepare_${t}`],!f.querySelector(`[data-func_prepare_${t}="${s}"]`)&&a.delete(s)}))})),f.querySelectorAll("div [ref]").forEach((e=>{const t=e.getAttribute("ref");n.get(t).current=e,e.removeAttribute("ref"),n.delete(t)})),f.querySelectorAll("div dom-ready-event[data-dom_ready]").forEach((e=>{const t=e.dataset.dom_ready;p.push(l.get(t)),l.delete(t),e.remove()})),f.querySelectorAll("div state-subs").forEach((e=>{if(!(e instanceof HTMLElement))return;const t=e.dataset.dom_subs,a=e.dataset.dom_global_subs;if(!t&&!a)return;const n=t?s.get(t):o.get(a);if(!n)return;const l=e.dataset.dom_subs_component,r=e.dataset.dom_subs_callback,c=r?n.callbackMap.get(r):void 0;l?p.push((()=>{b.render(b.build(c?`${c(n.value)}`:n.value),e)})):e.innerText=c?b.safeXSS(`${c(n.value)}`):b.safeXSS(`${n.value}`),n.subsList.push({elem:e,callback:c,component:l&&"true"===l}),delete e.dataset.dom_subs,l&&delete e.dataset.dom_subs_component,r&&delete e.dataset.dom_subs_callback,a&&delete e.dataset.dom_global_subs,c&&n.callbackMap.delete(r)})),f.querySelectorAll("div script").forEach((e=>{e.remove()})),u&&u.append||(c.innerHTML=""),Array.from(f.children).forEach((e=>{c.appendChild(e)})),p.forEach((e=>e())),s.forEach(((e,t)=>{e.subsList=e.subsList.filter((e=>document.contains(e.elem))),0===e.subsList.length&&s.delete(t)}))},build(e,n){if(!n)return e;let s=e;if(n.eventPrepare&&t.forEach(((e,t)=>{const l=`${e.origin}="{(.*?)}"`,o=new RegExp(l,"g");let r;for(const l of s.matchAll(o)){const o=l[1];if(r&&r===o)continue;if(r=o,!n.eventPrepare[o])continue;const u=c.next().value;s=s.replaceAll(`${e.origin}="{${o}}"`,`data-func_prepare_${t}="${u}"`),a.set(u,n.eventPrepare[o])}})),n.stylePrepare){let e=new RegExp('style="({.*?})"',"g");for(const t of s.matchAll(e)){const e=t[1].substring(1,t[1].length-1);if(!n.stylePrepare[e])continue;let a="";for(const t in n.stylePrepare[e])a+=`${o=t,o.split("").map(((e,t)=>{const a=e.toLowerCase();return e!==a&&t>0?"-"+a:a})).join("")}: ${n.stylePrepare[e][t]}; `;s=s.replaceAll(`{${e}}`,a)}}var o;if(n.domReady){if(n.domReady instanceof Function){const e=[];e.push(n.domReady),n.domReady=e}n.domReady instanceof Array&&n.domReady.forEach((e=>{const t=i.next().value;l.set(t,e),s+=`<dom-ready-event data-dom_ready="${t}"></dom-ready-event> `}))}return s},domRef(){const e={current:null,set:u.next().value};return n.set(e.set,e),e},createState(e){const t=d.next().value,a={value:e,subsList:[],callbackMap:new Map};return s.set(t,a),[{subs(e="inline",n){e instanceof Function&&(n=e,e="inline");let l=`<state-subs data-dom_subs="${t}" ${"block"===e?'style="display: block;"':""} `;if("component"===e&&(l+='data-dom_subs_component="true" '),n instanceof Function){const e=f.next().value;l+=`data-dom_subs_callback="${e}" `,a.callbackMap.set(e,n)}return l+="></state-subs>",l},getState:()=>a.value instanceof Object?{...a.value}:a.value instanceof Array?[...a.value]:a.value},e=>{a.value!==e&&(a.value=e,m(a))}]},createGlobalState(e){if(o.has(e.key))throw new p("globalState에서는 중복된 키를 사용하실 수 없습니다.");const t={value:e.default,default:e.default,subsList:[],callbackMap:new Map};o.set(e.key,t);const a=t.default instanceof Object?{...t.default}:t.default instanceof Array?[...t.default]:t.default;return{stateKey:e.key,defaultValue:a}},getGlobalState:e=>({subs(t="inline",a){t instanceof Function&&(a=t,t="inline");let n=`<state-subs data-dom_global_subs="${e.stateKey}" ${"block"===t?'style="display: block;"':""} `;"component"===t&&(n+='data-dom_subs_component="true" ');const l=o.get(e.stateKey);if(a instanceof Function){const e=f.next().value;n+=`data-dom_subs_callback="${e}" `,l.callbackMap.set(e,a)}return n+="></state-subs>",n},getState(){const t=o.get(e.stateKey);return t.value instanceof Object?{...t.value}:t.value instanceof Array?[...t.value]:t.value}}),setGlobalState:e=>t=>{const a=o.get(e.stateKey);a.value!==t&&(a.value=t,a.subsList=a.subsList.filter((e=>document.contains(e.elem))),m(a))},useGlobalState:e=>[b.getGlobalState(e),b.setGlobalState(e)],resetGlobalState(e){const t=o.get(e.stateKey);t.value!==t.default&&(t.value=t.default,t.subsList=t.subsList.filter((e=>document.contains(e.elem))),m(t))},safeXSS:e=>e.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")};class p extends Error{constructor(e){super(e),this.name="DuplicateKeyError"}}function m(e){e.subsList.forEach((t=>{t.component?b.render(b.build(t.callback?`${t.callback(e.value)}`:e.value),t.elem):t.callback?t.elem.innerText=b.safeXSS(`${t.callback(e.value)}`):t.elem.innerText=b.safeXSS(`${e.value}`)}))}return b}();export default Rutile;