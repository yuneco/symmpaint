var yt=Object.defineProperty;var et=Object.getOwnPropertySymbols;var St=Object.prototype.hasOwnProperty,xt=Object.prototype.propertyIsEnumerable;var G=(e,t,n)=>t in e?yt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,_=(e,t)=>{for(var n in t||(t={}))St.call(t,n)&&G(e,n,t[n]);if(et)for(var n of et(t))xt.call(t,n)&&G(e,n,t[n]);return e};var i=(e,t,n)=>(G(e,typeof t!="symbol"?t+"":t,n),n);import{d as F}from"./vendor.1c606baf.js";const Pt=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}};Pt();class m{constructor(t=0,n=0){i(this,"x");i(this,"y");this.x=t,this.y=n}equals(t){return this.x===t.x&&this.y===t.y}move(t){return new m(this.x+t.x,this.y+t.y)}sub(t){return new m(this.x-t.x,this.y-t.y)}get angle(){return Math.atan2(this.y,this.x)/Math.PI*180}get length(){return Math.sqrt(this.x**2+this.y**2)}rotate(t){const n=t/180*Math.PI,s=Math.cos(n),o=Math.sin(n),r=this.x*s-this.y*o,a=this.x*o+this.y*s;return new m(r,a)}scale(t){return new m(this.x*t,this.y*t)}get invert(){return this.scale(-1)}}const nt=e=>new m(e.x,e.y);class A{constructor(t){i(this,"scroll");i(this,"scale");i(this,"angle");i(this,"flipY");i(this,"_matrix");var n,s,o,r;this.scroll=(n=t==null?void 0:t.scroll)!=null?n:new m,this.scale=(s=t==null?void 0:t.scale)!=null?s:1,this.angle=(o=t==null?void 0:t.angle)!=null?o:0,this.flipY=(r=t==null?void 0:t.flipY)!=null?r:!1,this._matrix=new DOMMatrix().translateSelf(this.scroll.x,this.scroll.y).scaleSelf(this.scale,this.scale*(this.flipY?-1:1)).rotateSelf(this.angle)}toData(){return{scroll:this.scroll,scale:this.scale,angle:this.angle,flipY:this.flipY}}clone(t){const n=this.toData();return new A(_(_({},n),t))}get invert(){return new A({scroll:this.scroll.scale(-1),scale:1/this.scale,angle:-this.angle})}get matrix(){return this._matrix.translate(0)}get matrixScrollAfter(){return new DOMMatrix().scaleSelf(this.scale,this.scale*(this.flipY?-1:1)).rotateSelf(this.angle).translateSelf(this.scroll.x,this.scroll.y)}}class B{constructor(t,n){i(this,"el");i(this,"ctx");i(this,"width");i(this,"height");i(this,"_coord",new A);const s=document.createElement("canvas"),o=s.getContext("2d");if(!o)throw new Error("Failed to get 2d context for canvas");this.width=t,this.height=n,s.width=t,s.height=n,o.lineCap="round",this.el=s,this.ctx=o,this.coord=new A}get centor(){return new m(this.width/2,this.height/2)}set coord(t){const n=this.centor;this._coord=t,this.ctx.resetTransform(),this.ctx.translate(n.x,n.y),this.ctx.translate(t.scroll.x,t.scroll.y),this.ctx.rotate(-t.angle/180*Math.PI),this.ctx.scale(1/t.scale,1/t.scale)}get coord(){return this._coord}output(t,n){const s=this.centor;t.save();const o=this.coord;t.resetTransform(),t.translate(s.x,s.y),t.scale(o.scale,o.scale),t.rotate(o.angle/180*Math.PI),t.translate(-o.scroll.x,-o.scroll.y),t.translate(-s.x,-s.y),this.transferImageTo(t,n),t.restore()}copy(t,n){t.save(),t.resetTransform(),this.transferImageTo(t,n),t.restore()}transferImageTo(t,n){var s,o;this.el.width===0||this.el.height===0||(t.globalAlpha=(s=n==null?void 0:n.alpha)!=null?s:1,t.globalCompositeOperation=(o=n==null?void 0:n.composition)!=null?o:"source-over",(n==null?void 0:n.background)&&(t.fillStyle=n.background,t.fillRect(0,0,this.width,this.height)),t.drawImage(this.el,0,0))}}class x{constructor(){i(this,"listeners",[])}fire(t){this.listeners.forEach(n=>n(t))}listen(t){this.listeners.includes(t)||this.listeners.push(t)}clear(){this.listeners.length=0}}const st=e=>{const t=e>=0?e%360:360+e%360;return t<=180?t:-360+t},bt=e=>e/180*Math.PI,R=e=>{e.ctx.save(),e.ctx.resetTransform(),e.ctx.clearRect(0,0,e.width,e.height),e.ctx.restore()},Et=(e,t)=>{e.ctx.save(),e.ctx.resetTransform(),e.ctx.fillStyle=t,e.ctx.fillRect(0,0,e.width,e.height),e.ctx.restore()},ot=(e,t,n,s,o="#91bccc",r=!1)=>{const a=o,l=`${o}88`,C=new m(e.width/2,e.height/2).move(s.scroll),v=Math.sqrt(e.width**2+e.height**2),b=v*.15;e.ctx.save(),e.ctx.resetTransform(),e.ctx.translate(C.x,C.y),e.ctx.rotate(bt(s.angle)),e.ctx.lineWidth=1;for(let y=0;y<t;y++){const k=n&&y%2!=0,g=y===0||!r?v:b;e.ctx.strokeStyle=k?l:a,e.ctx.setLineDash(k?[4,4]:[]),e.ctx.beginPath(),e.ctx.moveTo(0,0),e.ctx.lineTo(0,g),e.ctx.stroke(),e.ctx.closePath(),e.ctx.rotate(360/t/180*Math.PI)}e.ctx.restore()};class rt{constructor(t=10){i(this,"maxItems");i(this,"items",[]);i(this,"onOverflow",new x);this.maxItems=t}get length(){return this.items.length}clear(){this.items.length=0}push(t){if(this.items.push(t),this.items.length<=this.maxItems)return;const n=this.items.shift();n&&this.onOverflow.fire(n)}pop(){return this.items.pop()}peek(t=0){return this.items[this.items.length-1+t]}getItems(){return[...this.items]}listenOverflow(...t){this.onOverflow.listen(...t)}}const kt=e=>Math.max(.1,1-Math.pow(1-e,2)),At=e=>{const[t,...n]=e,s=`M${t.x}, ${t.y} L`+n.map(r=>isNaN(r.x+r.y)?"":`${r.x}, ${r.y}`).join(" ")+"";return new Path2D(s)},it=e=>{if(e.length<=2)return[e];for(let t=2;t<e.length;t++){const n=e[t-2],s=e[t-1],o=e[t-0],r=s.point.sub(n.point).angle,a=o.point.sub(s.point).angle,l=Math.abs(r-a);if(Math.abs(l-180)<30)return[e.slice(0,t),...it(e.slice(t-1))]}return[e]},Tt=(e,t)=>{const n=e.map(r=>({x:r.point.x,y:r.point.y,w:Math.max(1,kt(r.pressure)*t)})),s=F.exports.smooth(n,3),o=[];for(let r=0;r<s.length;r+=1){const{left:a,right:l}=F.exports.computeSidePoints(s[r],s[r-1]||s[r+1]),u=o.slice(r)[0];let C=!1;if(u){const v=F.exports.vector2.length(u,a),b=F.exports.vector2.length(u,l);C=v-b>0}u&&C?o.splice(r,0,a,l):o.splice(r,0,l,a)}return At(o)},lt=(e,t,n)=>{const o=t.flatMap(it).map(r=>Tt(r,e.lineWidth));n.forEach(r=>{o.forEach(a=>{const l=new Path2D;l.addPath(a,r),e.fill(l)})})};class K{constructor(){i(this,"_coord",new A);i(this,"children",[])}get coord(){return this._coord}set coord(t){this._coord=this._coord.clone(t)}get childCount(){return this.children.length}get state(){return{coord:this.coord,children:this.children.map(t=>t.state)}}set state(t){for(this.coord=t.coord,this.children.length>t.children.length&&(this.children.length=t.children.length);this.children.length<t.children.length;)this.addChildPen();t.children.forEach((n,s)=>{this.children[s].state=n})}get leafs(){return this.childCount?this.children.flatMap(t=>t.leafs):[this]}clone(){const t=new K;return t.state=this.state,t}childAt(t){return this.children[t]}matrices(t){const n=t.multiply(this.coord.matrix);return this.childCount?this.children.flatMap(s=>s.matrices(n)):[n]}matricesBasedFirstPen(t){const n=this.matrices(t),s=n[0].inverse();return n.map(o=>o.multiply(s))}addChildPen(t){const n=new K;return t&&(n.coord=t),this.children.push(n),n}clearChildren(){this.children.length=0}drawStrokes(t,n){const s=this.matricesBasedFirstPen(new DOMMatrix);lt(t.ctx,n,s)}drawLines(t,n,s=.5){if(n.length<2)return;const o=t.ctx,r=n.map(l=>({point:l,pressure:s})),a=this.matricesBasedFirstPen(new DOMMatrix);lt(o,[r],a)}dryRun(t){const n=this.matrices(new DOMMatrix),s=n[0].inverse();return n.map(o=>t.map(r=>{const a=s.transformPoint(r.point);return{point:nt(o.transformPoint(a)),pressure:r.pressure}}))}}const Lt=e=>{if(e.length===0)return[];const t=[];let n=[e[0]],s=e[0].pressure!==0;for(let o=1;o<e.length;o++){const r=e[o];if(s&&r.pressure===0){n.push(r),t.push(n),n=[r],s=!1;continue}if(!s&&r.pressure===0){n=[r],s=!1;continue}n.push(r),s=!0}return s&&t.push(n),t},at=(e,t)=>{e.ctx.save(),e.ctx.fillStyle=t.style.color,e.ctx.lineWidth=t.style.penSize;const n=new K;n.state=t.penState,n.drawStrokes(e,Lt(t.inputs)),e.ctx.restore()},Mt=e=>{R(e)},Dt=(e,t,n)=>{n.forEach(s=>{s.tool==="pen"&&(R(t),at(t,s),t.copy(e.ctx,{alpha:s.style.alpha,composition:s.style.composition})),s.tool==="clearAll"&&Mt(e)}),R(t)},It=e=>e.flatMap(t=>{if(!t.length)return t;const n=t[0],s=t[t.length-1];return[{point:n.point,pressure:0},...t,{point:s.point,pressure:0}]});class Y{constructor(t,n,s,o="pen"){i(this,"inputs",[]);i(this,"penState");i(this,"style");i(this,"canvasCoord");i(this,"tool");this.canvasCoord=t,this.penState=n,this.style=s,this.tool=o}addPoint(t,n){this.inputs.push({point:t,pressure:n})}clearPoints(t=!1,n=!1){const s=t?this.inputs.shift():void 0,o=n?this.inputs.pop():void 0;this.inputs.length=0,s&&this.inputs.push(s),o&&this.inputs.push(o)}get flatten(){const t=new K;t.state=this.penState;const n=t.dryRun(this.inputs),s=nt(this.canvasCoord.matrixScrollAfter.transformPoint(t.coord.scroll)).invert,o=It(n).map(a=>({point:a.point.move(s),pressure:a.pressure}));t.clearChildren(),t.coord=new A;const r=new Y(this.canvasCoord,t.state,this.style,this.tool);return r.inputs.push(...o),r}}const Rt=110,z=10;class ct{constructor(t,n){i(this,"canvasWidth");i(this,"canvasHeight");i(this,"history",new rt(1/0));i(this,"snapshots",new rt(Rt/z));i(this,"currentStroke");i(this,"lastSnapshotIndex",0);i(this,"oldestSnapshotIndex",0);this.canvasWidth=t,this.canvasHeight=n,this.snapshots.listenOverflow(()=>{this.oldestSnapshotIndex+=z});const s=document.querySelector("#debug .history .snaps");s&&(s.innerHTML="")}get length(){return this.history.length-this.oldestSnapshotIndex}get strokes(){return this.history.peek()}get snapshot(){return this.snapshots.peek()}get prevSnapshot(){return this.snapshots.peek(-1)}get lastHistories(){return this.history.getItems().slice(this.lastSnapshotIndex)}get current(){return this.currentStroke}get undoable(){return this.length>=1}addSnapshot(){const t=new B(this.canvasWidth,this.canvasHeight);this.snapshots.push(t);const n=document.querySelector("#debug .history .snaps");if(n){const s=120/Math.max(t.el.width,t.el.height);t.el.style.width=`${t.el.width*s}px`,t.el.style.height=`${t.el.height*s}px`,n.appendChild(t.el),t.el.scrollIntoView()}this.lastSnapshotIndex=this.history.length-1}start(t,n,s,o){const r=new Y(t,n,s,o);return this.currentStroke=r,r}commit(t){if(!this.currentStroke)return;if(this.history.push(this.currentStroke),this.history.length-this.lastSnapshotIndex-1===z){if(this.addSnapshot(),!this.snapshot){console.error("failed to add snapshot");return}t.copy(this.snapshot.ctx)}this.currentStroke=void 0}rollback(){!this.currentStroke||(this.currentStroke=void 0)}undo(t){var o;if(!this.undoable)return!1;const n=new B(t.width,t.height);t.ctx.save();const s=this.snapshot;if(s&&(t.ctx.save(),t.ctx.resetTransform(),t.ctx.drawImage(s.el,0,0),t.ctx.restore()),this.history.pop(),Dt(t,n,this.lastHistories),!this.lastHistories.length&&this.snapshots.length>=1){const r=this.snapshots.pop();r&&((o=r.el.parentNode)==null||o.removeChild(r.el)),this.lastSnapshotIndex-=z}return t.ctx.restore(),!0}}class j{constructor(t){i(this,"color");i(this,"penSize");i(this,"alpha");i(this,"composition");var n,s,o,r;this.color=(n=t==null?void 0:t.color)!=null?n:"#000000",this.penSize=(s=t==null?void 0:t.penSize)!=null?s:10,this.alpha=(o=t==null?void 0:t.alpha)!=null?o:1,this.composition=(r=t==null?void 0:t.composition)!=null?r:""}toData(){return{color:this.color,penSize:this.penSize,alpha:this.alpha,composition:this.composition}}clone(t){return new j(_(_({},this.toData()),t))}}const qt=e=>{var t;return(t={draw:"crosshair",scroll:"move","scroll:anchor":"move",zoomup:"zoom-in",zoomdown:"zoom-out",rotate:"grab","rotate:anchor":"grab","draw:line":"crosshair","draw:stamp":"crosshair"}[e])!=null?t:"default"},Kt=(e,t)=>{const n=e.getBoundingClientRect();return new m(n.left,n.top).move(t!=null?t:new m(n.width/2,n.height/2))},Ot=(e,t,n)=>{const s=t.sub(e).angle;return n.sub(e).angle-s},ht=(e,t,n)=>({distance:n.sub(t),angle:Ot(e,t,n)}),Wt=(e,t,n,s,o,r=1,a=60)=>{const l={startPoint:new m,lastRawPoint:new m,isWatchMove:!1,lastMs:Date.now()},u=()=>Kt(e,o==null?void 0:o()),C=g=>{!g.isPrimary||(l.startPoint=l.lastRawPoint=new m(g.clientX,g.clientY),l.isWatchMove=t(g))},v=g=>{if(!g.isPrimary||!l.isWatchMove)return;const E=new m(g.clientX,g.clientY),w=E.sub(l.lastRawPoint).length,T=Date.now(),q=1e3/(T-l.lastMs);w<r||q>a||w/r*(a/q)<3||(n(g,ht(u(),l.startPoint,E)),l.lastRawPoint=E,l.lastMs=T)},b=(g,E=!0)=>{if(!g.isPrimary||!l.isWatchMove)return;const w=new m(g.clientX,g.clientY);s(g,ht(u(),l.startPoint,w),E),l.isWatchMove=!1},y=g=>{b(g,!1)};return e.addEventListener("pointerdown",C),e.addEventListener("pointermove",v),e.addEventListener("pointerup",b),e.addEventListener("pointercancel",y),()=>{e.removeEventListener("pointerdown",C),e.removeEventListener("pointermove",v),e.removeEventListener("pointerup",b),e.removeEventListener("pointercancel",y)}},_t=200,Bt=300,Nt=10,ut=e=>{const[t,n]=e,s=new m((t.x+n.x)/2,(t.y+n.y)/2),o=t.sub(s).angle,r=n.sub(t).length;return{center:s,angle:o,dist:r}},Ft=e=>{const[t,n]=e;return{scroll:n.center.sub(t.center),angle:st(n.angle-t.angle),scale:n.dist/t.dist,center:n.center}},V=e=>{const t=[];for(let n=0;n<e.length;n++)t.push(e[n]);return t},Yt=(e,t,n=1)=>{let s=[],o,r=0,a=!1,l=0,u=0;const C=()=>{r=Date.now(),a=!1,l=0,u=0},v=()=>Date.now()-r<=_t,b=()=>{if(!(s.length<2))return[s[0].pagePoint,s[1].pagePoint]},y=c=>{const h=V(c).map(d=>d.identifier);s=s.filter(d=>!h.includes(d.identifier))},k=c=>{y(c);const h=V(c).map(d=>({identifier:d.identifier,pagePoint:new m(d.clientX,d.clientY)}));s=[...s,...h]},g=c=>{const h=V(c);let d=!1;return h.forEach(f=>{const S=s.find(I=>I.identifier===f.identifier);if(!S)return;const D=new m(f.clientX,f.clientY);S.pagePoint.sub(D).length<=n||(S.pagePoint=D,d=!0)}),d},E=c=>{var d;const h=s.length;k(c.changedTouches),h===0&&C(),h<=1&&s.length>=2&&v()&&(a=!0,o=b(),(d=t.onStart)==null||d.call(t)),l=Math.max(l,s.length)},w=c=>{var h,d,f;y(c.changedTouches),s.length<=1&&a&&(a=!1,o=void 0,(h=t.onEnd)==null||h.call(t),Date.now()-r<Bt&&u<=Nt&&(l===2&&((d=t.onTwoFingerTap)==null||d.call(t)),l===3&&((f=t.onThreeFingerTap)==null||f.call(t))))},T=c=>{var f;if(!a||!g(c.changedTouches))return;const d=b();if(o&&d){const[S,D]=[ut(o),ut(d)],I=Ft([S,D]);u=Math.max(u,I.scroll.length),(f=t.onTransform)==null||f.call(t,I,l)}};return e.addEventListener("touchstart",E),e.addEventListener("touchend",w),e.addEventListener("touchcancel",w),e.addEventListener("touchmove",T),()=>{e.removeEventListener("touchstart",E),e.removeEventListener("touchend",w),e.removeEventListener("touchcancel",w),e.removeEventListener("touchmove",T)}},X=(e,t)=>{if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0};class zt{constructor(t){i(this,"target");i(this,"_keys",{});i(this,"_removeEvents");i(this,"onChange",new x);this.target=t!=null?t:document.body;const n=o=>{const r=o.key;this._keys[r]=!0,this.onChange.fire({key:r,isDown:!0})},s=o=>{const r=o.key;delete this._keys[r],this.onChange.fire({key:r,isDown:!1})};this.target.addEventListener("keydown",n),this.target.addEventListener("keyup",s),this._removeEvents=()=>{this.target.removeEventListener("keydown",n),this.target.removeEventListener("keyup",s)}}listen(...t){this.onChange.listen(...t)}destroy(){this._removeEvents(),this.onChange.clear()}key(t){return!!this._keys[t]}get keys(){return Object.keys(this._keys)}}const Xt=e=>{const t=e.includes(" "),n=e.includes("Alt"),s=e.includes("Meta"),o=e.includes("Shift");return t&&s&&n?"zoomdown":t&&s?"zoomup":t&&n&&o?"rotate:anchor":t&&n?"rotate":t&&o?"scroll:anchor":t?"scroll":o?"draw:line":n?"draw:stamp":"draw"};class Ut{constructor(){i(this,"keyWatcher");i(this,"tool");i(this,"onChange",new x);this.keyWatcher=new zt,this.keyWatcher.listen(()=>{const t=Xt(this.keyWatcher.keys);this.tool!==t&&(this.tool=t,this.onChange.fire(t))})}listenChange(...t){this.onChange.listen(...t)}}const dt=.2,pt=4,gt=[0,dt,.33,.5,.67,.75,1,1.5,2,2.5,3,3.5,pt,1/0],ft=(e,t)=>{var r;const n=t?gt:[...gt].reverse(),s=n.findIndex(a=>t?a>e:a<e),o=(r=n[s])!=null?r:0;return Math.max(dt,Math.min(pt,o))},Ht=e=>{if(!e.length)return 0;const t=Math.floor(e.length*.9);return e[t].pressure},$t=(e,t)=>{let n=!0;const s={activeEvent:void 0,startCoord:new A,startAnchor:[new A,new A],startPoint:new m,lastPoint:new m,isCapturing:!1,currentStroke:void 0,pen:new K},o=new B(e.width*e.resolution,e.height*e.resolution),r=c=>new m((c.offsetX-e.width/2)*e.resolution,(c.offsetY-e.height/2)*e.resolution),a=c=>{const h=e.tool;s.activeEvent=h,s.startCoord=e.coord,s.startAnchor=[e.anchor,e.childAnchor],s.lastPoint=s.startPoint=r(c),s.isCapturing=e.enableCapture&&c.metaKey,s.pen=e.canvasPen,s.currentStroke=void 0},l=c=>{if(!n)return!1;const h=e.tool;if(a(c),h==="zoomup"||h==="zoomdown"){const d=e.coord.scale;return h==="zoomup"&&t.onZoom(ft(d,!0)),h==="zoomdown"&&t.onZoom(ft(d,!1)),!1}return(h==="draw"||h==="draw:line"||h==="draw:stamp")&&v(s.startPoint),!0},u=(c,h)=>{if(!n)return;const d=s.activeEvent,f={point:r(c),pressure:c.pressure};if((d==="draw"||d==="draw:line")&&(R(o),b(f.point,f.pressure||.5)),d==="draw:stamp"&&e.stamp){const S=f.point.sub(s.startPoint),D=S.length/100;R(o),k(e.stamp,s.startPoint,D,S.angle,!0)}d==="scroll"&&E(h,"canvas"),d==="scroll:anchor"&&E(h,"anchor"),d==="rotate"&&w(h,"canvas"),d==="rotate:anchor"&&w(h,"anchor"),s.lastPoint=f.point,c.preventDefault()},C=(c,h,d=!1)=>{var I;if(!n)return!1;if(d)return y(!1),T(),!1;const f=s.activeEvent,S={point:r(c),pressure:c.pressure},D=f==="draw"||f==="draw:line"||f==="draw:stamp";if(f==="draw"&&b(S.point,c.pressure||0),f==="draw:line"){R(o);const L=s.currentStroke,O=L?Ht(L.inputs):.5;if(b(S.point,O),L){const N=L.inputs[L.inputs.length-1];L.inputs.length=1,L.inputs[0].pressure=O,L.inputs.push(N,N)}}if(f==="draw:stamp"&&e.stamp){R(o);const L=S.point.sub(s.startPoint),O=L.length/100;k(e.stamp,s.startPoint,O,L.angle,!1)}return(f==="draw"||f==="draw:line")&&s.isCapturing?(e.stamp=(I=s.currentStroke)==null?void 0:I.flatten,y(!1),T(),!1):(f==="scroll"&&E(h,"canvas"),f==="scroll:anchor"&&E(h,"anchor"),f==="rotate"&&w(h,"canvas"),f==="rotate:anchor"&&w(h,"anchor"),y(D),!0)},v=c=>{const h=e.view2canvasPos(c,"start");o.coord=new A,o.ctx.lineWidth=e.style.penSize;const d=()=>s.isCapturing?"#0044aa":e.penKind==="eraser"?e.backgroundColor:e.style.color;o.ctx.fillStyle=d(),s.currentStroke=e.startHistory(),s.currentStroke.addPoint(h,0)},b=(c,h=.5)=>{const d=s.activeEvent,f=e.view2canvasPos(c,"start"),S=s.currentStroke;if(!!S){if(S.addPoint(f,h),d==="draw:line"){const D={point:S.inputs[0].point,pressure:h},I=S.inputs[S.inputs.length-1],L=[D,I,I];s.pen.drawStrokes(o,[L])}else s.pen.drawStrokes(o,[S.inputs]);T()}},y=c=>{e.endHistory(c,o),R(o),s.activeEvent=void 0},k=(c,h,d,f,S)=>{const D=new K;D.state=s.pen.state;const I=e.style.clone({color:e.penKind==="eraser"?e.backgroundColor:e.style.color}),L=h,O=new Y(e.coord,D.state,S?I:e.style,c.tool),N=c.inputs.map(tt=>({point:tt.point.scale(d).rotate(f).move(L),pressure:tt.pressure}));O.inputs.push(...N),at(o,O),T();const Z=s.currentStroke;!S&&Z&&(Z.clearPoints(),Z.inputs.push(...O.inputs))},g=()=>{y(!1)},E=(c,h)=>{const d=e.hasSubPen?1:0,S={canvas:s.startCoord,anchor:s.startAnchor[d]}[h].scroll.move(c.distance.scale(-1/e.coord.scale*e.resolution).rotate(-e.coord.angle).scale(h==="anchor"?-1:1));t.onScroll(S,h)},w=(c,h)=>{const d=e.hasSubPen?1:0,S={canvas:s.startCoord,anchor:s.startAnchor[d]}[h].angle+c.angle;t.onRotate(st(S),h)},T=()=>{e.rePaint(c=>{o.ctx.save(),o.coord=e.coord,o.output(c,{alpha:e.style.alpha}),o.ctx.restore()})};return{onDown:l,onDrag:u,onUp:C,strokeState:{get enabled(){return n},set enabled(c){n=c,n||g()},get startCoord(){return s.startCoord},get startAnchor(){return s.startAnchor}}}},Zt=e=>{const t=e[1].scroll.sub(e[0].scroll).angle;return new A({scroll:e[1].scroll.sub(e[0].scroll).rotate(-e[0].angle),angle:t+e[1].angle})},Gt=(e,t,n)=>{const s=new K,[o,r]=n,[a,l]=[e[0]*(o?2:1),e[1]*(r?2:1)],u=360/a/2,C=360/l/2,v=t[0].clone({angle:t[0].angle+u}),b=t[1],y=Zt([v,b]);s.coord=v;for(let k=0;k<a;k++){const g=o&&k%2!=0,E=s.addChildPen(new A({angle:k/a*360,flipY:g}));for(let w=0;w<l;w++){const T=r&&w%2!=0;E.addChildPen(new A({scroll:y.scroll,angle:y.angle+(C-u)-t[0].angle})).addChildPen(new A({angle:w/l*360,flipY:T}))}}return s},jt=(e,t,n,s,o,r)=>{const[a,l]=[o[0]>=2,o[1]>=2],[u,C]=s,[v,b]=[o[0]*(u?2:1),o[1]*(C?2:1)],[y,k]=n,g=k.scroll.sub(y.scroll).angle,E=o[0]%2?360/v/2:0,w=t.angle+n[0].angle+E;a&&ot(e,v,s[0],new A({scroll:t.scroll.invert.move(n[0].scroll).scale(t.scale).rotate(t.angle),angle:w}),l?"#cccccc":r[0]),l&&ot(e,b,s[1],new A({scroll:t.scroll.invert.move(n[1].scroll).scale(t.scale).rotate(t.angle),angle:g+n[1].angle+90}),r[1],!0)},M=2,mt=3.5,Vt={normal:"",eraser:"destination-out"};class Jt{constructor(t,n,s){i(this,"width");i(this,"height");i(this,"resolution",M);i(this,"canvas");i(this,"view");i(this,"history");i(this,"strokeState");i(this,"events",{requestChangeZoom:new x,requestScrollTo:new x,requestRotateTo:new x,requestUndo:new x,requestAnchorTransform:new x,requestAnchorReset:new x,strokeStart:new x,strokeEnd:new x});i(this,"setting",{style:new j,stamp:void 0,tool:"draw",backgroundColor:"#ffffff",anchor:[new A,new A],penCount:[1,0],isKaleido:[!1,!1],anchorColor:["#91bccc","#eeaabb"],enableCapure:!0});i(this,"pen",new K);i(this,"view2canvasPos",(t,n)=>{const s=n==="start"?this.strokeState.startCoord:this.coord;return t.scale(1/s.scale).rotate(-s.angle).move(s.scroll)});i(this,"canvas2viewPos",(t,n)=>{const s=n==="start"?this.strokeState.startCoord:this.coord;return t.move(s.scroll.invert).rotate(s.angle).scale(s.scale)});i(this,"canvas2displayPos",(t,n)=>this.canvas2viewPos(t,n).move(new m(this.width,this.height)).scale(1/M));i(this,"display2canvasPos",(t,n)=>this.canvas2viewPos(t.scale(M).move(new m(-this.width,-this.height)),n));i(this,"rePaintRequestId",0);var a;this.width=n,this.height=s,this.canvas=new B(this.width*M,this.height*M),this.view=new B(this.width*M,this.height*M),this.history=new ct(this.width*M,this.height*M),this.view.el.style.width=`${n}px`,this.view.el.style.height=`${s}px`,t.appendChild(this.view.el);const o=document.getElementById("debug");if(o){const l=200/Math.max(n,s);this.canvas.el.style.width=`${n*l}px`,this.canvas.el.style.height=`${s*l}px`,(a=o.querySelector(".canvas"))==null||a.appendChild(this.canvas.el)}const r=$t(this,{onScroll:(l,u)=>this.events.requestScrollTo.fire({point:l,target:u}),onRotate:(l,u)=>this.events.requestRotateTo.fire({angle:l,target:u}),onZoom:l=>this.events.requestChangeZoom.fire(l)});this.strokeState=r.strokeState,Yt(this.view.el,{onStart:()=>{this.strokeState.enabled=!1},onTransform:(l,u)=>u>=3?this.onTouchTramsformAnchor(l):this.onTouchTramsformCanvas(l),onEnd:()=>{this.strokeState.enabled=!0},onTwoFingerTap:()=>this.events.requestUndo.fire(),onThreeFingerTap:()=>this.events.requestAnchorReset.fire()},mt),Wt(this.view.el,l=>{const u=r.onDown(l);return u&&this.events.strokeStart.fire(),u},(l,u)=>r.onDrag(l,u),(l,u,C)=>{const v=r.onUp(l,u,!C);this.events.strokeEnd.fire(v)},()=>this.tool==="scroll:anchor"||this.tool==="rotate:anchor"?this.canvas2displayPos(this.activeAnchor.scroll,"start"):void 0,mt),this.childAnchor=new A({scroll:new m(300,-70),angle:0}),this.tool="draw",R(this.canvas)}get canvasPen(){return this.pen.clone()}get coord(){return this.canvas.coord}set coord(t){this.canvas.coord=t,this.rePaint()}get tool(){return this.setting.tool}set tool(t){this.setting.tool=t,this.view.el.style.cursor=qt(t)}get isKaleido(){return[...this.setting.isKaleido]}set isKaleido(t){X(this.isKaleido,t)||(this.setting.isKaleido=[...t],this.rebuildPen(),this.rePaint())}get penCount(){return this.setting.penCount}set penCount(t){X(this.penCount,t)||(this.setting.penCount=[...t],this.rebuildPen(),this.rePaint())}get hasSubPen(){return this.penCount[1]>=1}set penWidth(t){this.setting.style=this.setting.style.clone({penSize:t})}set penColor(t){this.setting.style=this.setting.style.clone({color:t})}set penAlpha(t){this.setting.style=this.setting.style.clone({alpha:t})}get penKind(){return this.setting.style.composition===""?"normal":"eraser"}set penKind(t){this.setting.style=this.setting.style.clone({composition:Vt[t]})}get stamp(){return this.setting.stamp}set stamp(t){this.setting.stamp=t}get backgroundColor(){return this.setting.backgroundColor}set backgroundColor(t){this.setting.backgroundColor!==t&&(this.setting.backgroundColor=t,this.rePaint())}get anchor(){return this.setting.anchor[0]}set anchor(t){this.setting.anchor[0]=t,this.rebuildPen(),this.rePaint()}get childAnchor(){return this.setting.anchor[1]}set childAnchor(t){this.setting.anchor[1]=t,this.rebuildPen(),this.rePaint()}get activeAnchor(){return this.hasSubPen?this.childAnchor:this.anchor}set activeAnchor(t){this[this.hasSubPen?"childAnchor":"anchor"]=t}get style(){return this.setting.style}get anchorColor(){return[...this.setting.anchorColor]}set anchorColor(t){this.setting.anchorColor=[...t]}get enableCapture(){return this.setting.enableCapure}set enableCapture(t){this.setting.enableCapure=t}get historyCount(){return this.history.length}rebuildPen(){this.pen.state=Gt(this.setting.penCount,this.setting.anchor,this.setting.isKaleido).state}listenRequestZoom(t){this.events.requestChangeZoom.listen(t)}listenRequestScrollTo(t){this.events.requestScrollTo.listen(t)}listenRequestRotateTo(t){this.events.requestRotateTo.listen(t)}listenRequestUndo(t){this.events.requestUndo.listen(t)}listenRequestAnchorTransform(t){this.events.requestAnchorTransform.listen(t)}listenRequestAnchorReset(t){this.events.requestAnchorReset.listen(t)}listenStrokeStart(t){this.events.strokeStart.listen(t)}listenStrokeEnd(t){this.events.strokeEnd.listen(t)}clear(t){t?this.history=new ct(this.width*M,this.height*M):(this.history.start(this.coord,this.pen.state,this.setting.style,"clearAll"),this.history.commit(this.canvas)),R(this.canvas),this.rePaint()}undo(){!this.history.undoable||(R(this.canvas),this.history.undo(this.canvas),this.rePaint())}startHistory(){return this.history.start(this.coord,this.pen.state,this.setting.style)}endHistory(t,n){if(!t){this.history.rollback();return}this.history.commit(this.canvas),n==null||n.copy(this.canvas.ctx,{alpha:this.setting.style.alpha,composition:this.setting.style.composition}),this.rePaint()}async toImgBlob(){return new Promise((t,n)=>{this.canvas.el.toBlob(s=>s?t(s):n())})}onTouchTramsformCanvas(t){const n=this.strokeState.startCoord,{center:s,scroll:o,scale:r,angle:a}=t,l=T=>T.rotate(-n.angle).scale(1/n.scale),u=new m((s.x-this.width/2)*M,(s.y-this.height/2)*M),C=this.view2canvasPos(u,"start"),v=new m(0,0),b=this.view2canvasPos(v,"start"),y=C.sub(b),g=y.rotate(-a).scale(1/r).sub(y),E=o.scale(M),w=l(E);this.events.requestRotateTo.fire({angle:n.angle+a,target:"canvas"}),this.events.requestChangeZoom.fire(n.scale*r),this.events.requestScrollTo.fire({point:n.scroll.sub(g).sub(w),target:"canvas"})}onTouchTramsformAnchor(t){const n=this.strokeState.startAnchor[this.hasSubPen?1:0],s=t.angle+n.angle,o=t.scroll.scale(1/this.strokeState.startCoord.scale*M).rotate(-this.strokeState.startCoord.angle).move(n.scroll);this.events.requestAnchorTransform.fire(n.clone({scroll:o,angle:s}))}rePaint(t){cancelAnimationFrame(this.rePaintRequestId),this.rePaintRequestId=requestAnimationFrame(()=>{this.rePaintRequestId=0,Et(this.view,"#cccccc"),this.canvas.output(this.view.ctx,{background:this.backgroundColor}),t==null||t(this.view.ctx),jt(this.view,this.coord,this.setting.anchor,this.isKaleido,this.penCount,this.setting.anchorColor)})}}class J{constructor(t){i(this,"el");const n=this.el=document.createElement("button");n.className="Button",n.textContent=t}addEventListener(...t){return this.el.addEventListener(...t)}removeEventListener(...t){return this.el.removeEventListener(...t)}}class W{constructor(t,n=0,s=100,o=0,r=!1){i(this,"el");i(this,"elSlider");i(this,"elText");i(this,"isPercent");const a=this.el=document.createElement("div"),l=this.elSlider=document.createElement("input"),u=document.createElement("label"),C=document.createElement("span"),v=this.elText=document.createElement("span");this.isPercent=r,a.appendChild(u),u.appendChild(C),u.appendChild(v),u.appendChild(l),l.type="range",l.className="Slider",l.min=String(n),l.max=String(s),l.value=String(o),C.textContent=`${t}: `,v.textContent=l.value,l.addEventListener("input",()=>{v.textContent=l.value})}get value(){return this.elSlider.valueAsNumber*(this.isPercent?.01:1)}set value(t){const n=t*(this.isPercent?100:1);this.elSlider.value=String(n),this.elText.textContent=String(n)}addEventListener(...t){return this.elSlider.addEventListener(...t)}removeEventListener(...t){return this.elSlider.removeEventListener(...t)}}class U{constructor(t,n=!1){i(this,"el");i(this,"elCheck");const s=this.el=document.createElement("div"),o=this.elCheck=document.createElement("input"),r=document.createElement("label"),a=document.createElement("span");s.appendChild(r),r.appendChild(o),r.appendChild(a),s.className="Checkbox",o.type="checkbox",o.checked=n,a.textContent=t}get value(){return this.elCheck.checked}set value(t){this.elCheck.checked=t}addEventListener(...t){return this.elCheck.addEventListener(...t)}removeEventListener(...t){return this.elCheck.removeEventListener(...t)}}class vt{constructor(t,n=!1){i(this,"el");i(this,"elColor");const s=this.el=document.createElement("div"),o=this.elColor=document.createElement("input"),r=document.createElement("label"),a=document.createElement("span");s.appendChild(r),r.appendChild(o),r.appendChild(a),s.className="ColorSelector",o.type="color",o.checked=n,a.textContent=t}get value(){return this.elColor.value}set value(t){this.elColor.value=t}addEventListener(...t){return this.elColor.addEventListener(...t)}removeEventListener(...t){return this.elColor.removeEventListener(...t)}}class Qt{constructor(t,n){i(this,"checks");i(this,"_value");i(this,"el");i(this,"_updating",!1);i(this,"onChange",new x);const s=Object.keys(t);this.checks=s.map(r=>({cb:new U(t[r]),key:r})),this.value=n,this._value=n,this.checks.forEach(r=>{r.cb.addEventListener("change",()=>{this._updating||r.cb.value&&(this.value=r.key)})});const o=this.el=document.createElement("div");o.className="RadioGroup",this.checks.forEach(r=>{o.appendChild(r.cb.el)})}get value(){return this._value}set value(t){const n=this._value!==t;this._value=t,this.updateChecked(),!!n&&this.onChange.fire(t)}updateChecked(){this._updating=!0,this.checks.forEach(t=>t.cb.value=t.key===this.value),this._updating=!1}listenChange(...t){this.onChange.listen(...t)}}const te={draw:"Draw","draw:line":"Line","draw:stamp":"Stamp",scroll:"Move","scroll:anchor":"Move Anchor",rotate:"Rotate","rotate:anchor":"Rotate Anchor",zoomup:"+",zoomdown:"-"};class ee{constructor(t,n){i(this,"slScale");i(this,"slAngle");i(this,"slX");i(this,"slY");i(this,"slPenCount1");i(this,"slPenCount2");i(this,"slPenWidth");i(this,"cbKaleido1");i(this,"cbKaleido2");i(this,"cbEraser");i(this,"csDrawingColor");i(this,"csCanvasColor");i(this,"slDrawingAlpha");i(this,"cbTools");i(this,"onScaleChange",new x);i(this,"onAngleChange",new x);i(this,"onScrollChange",new x);i(this,"onPenCountChange",new x);i(this,"onPenWidthChange",new x);i(this,"onClear",new x);i(this,"onUndo",new x);i(this,"onCopy",new x);i(this,"onKaleidoChange",new x);i(this,"onEraserChange",new x);i(this,"onDrawingColorChange",new x);i(this,"onCanvasColorChange",new x);i(this,"onDrawingAlphaChange",new x);i(this,"onToolChange",new x);i(this,"canvasWidth");i(this,"canvasHeight");this.canvasWidth=n.height,this.canvasHeight=n.height;const s=this.slScale=new W("Scale",50,300,100,!0),o=this.slAngle=new W("Angle",-360,360,0),r=this.slX=new W("Scroll X",-this.canvasWidth/2,this.canvasWidth/2,0),a=this.slY=new W("Scroll Y",-this.canvasHeight/2,this.canvasHeight/2,0),l=this.slPenCount1=new W("Pen Count Parent",1,16,1),u=this.slPenCount2=new W("Pen Count Child",0,8,1),C=this.slPenWidth=new W("Pen Size",2,100,20),v=new J("Clear All"),b=new J("Undo"),y=new J("Copy Image"),k=this.cbKaleido1=new U("Kalaidoscope"),g=this.cbKaleido2=new U("Kalaidoscope"),E=this.cbEraser=new U("Eraser"),w=this.csDrawingColor=new vt("Pen Color"),T=this.csCanvasColor=new vt("BG Color"),q=this.slDrawingAlpha=new W("Pen Alpha",1,100,100,!0),c=this.cbTools=new Qt(te,"draw");t.appendChild(c.el),t.appendChild(E.el),t.appendChild(w.el),t.appendChild(T.el),t.appendChild(l.el),t.appendChild(k.el),t.appendChild(u.el),t.appendChild(g.el),t.appendChild(q.el),t.appendChild(C.el),t.appendChild(v.el),t.appendChild(b.el),t.appendChild(y.el),s.addEventListener("input",()=>{this.onScaleChange.fire(s.value)}),o.addEventListener("input",()=>{this.onAngleChange.fire(o.value)}),r.addEventListener("input",()=>{this.onScrollChange.fire(new m(r.value,a.value))}),a.addEventListener("input",()=>{this.onScrollChange.fire(new m(r.value,a.value))}),l.addEventListener("input",()=>{this.onPenCountChange.fire([l.value,u.value])}),u.addEventListener("input",()=>{this.onPenCountChange.fire([l.value,u.value])}),C.addEventListener("input",()=>{this.onPenWidthChange.fire(C.value)}),v.addEventListener("click",()=>{this.onClear.fire()}),b.addEventListener("click",()=>{this.onUndo.fire()}),y.addEventListener("click",()=>{this.onCopy.fire()}),k.addEventListener("change",()=>{this.onKaleidoChange.fire([k.value,g.value])}),g.addEventListener("change",()=>{this.onKaleidoChange.fire([k.value,g.value])}),E.addEventListener("change",()=>{this.onEraserChange.fire(E.value)}),w.addEventListener("input",()=>{this.onDrawingColorChange.fire(w.value)}),T.addEventListener("input",()=>{this.onCanvasColorChange.fire(T.value)}),q.addEventListener("input",()=>{this.onDrawingAlphaChange.fire(q.value)}),c.listenChange(h=>this.onToolChange.fire(h))}get scale(){return this.slScale.value}get angle(){return this.slAngle.value}get scroll(){return new m(this.slX.value,this.slY.value)}get penCount(){return[this.slPenCount1.value,this.slPenCount2.value]}get penWidth(){return this.slPenWidth.value}get kaleidoscope(){return[this.cbKaleido1.value,this.cbKaleido2.value]}get drawingColor(){return this.csDrawingColor.value}get canvasColor(){return this.csCanvasColor.value}get drawingAlpha(){return this.slDrawingAlpha.value}get tool(){return this.cbTools.value}get eraser(){return this.cbEraser.value}set scale(t){this.scale!==t&&(this.slScale.value=t,this.onScaleChange.fire(this.slScale.value),this.updateScrollRange())}set angle(t){this.angle!==t&&(this.slAngle.value=t,this.onAngleChange.fire(this.slAngle.value))}set scrollX(t){this.slX.value!==t&&(this.slX.value=t,this.onScrollChange.fire(new m(this.slX.value,this.slY.value)))}set scrollY(t){this.slY.value!==t&&(this.slY.value=t,this.onScrollChange.fire(new m(this.slX.value,this.slY.value)))}set penCount(t){X(this.penCount,t)||(this.slPenCount1.value=t[0],this.slPenCount2.value=t[1],this.onPenCountChange.fire([this.slPenCount1.value,this.slPenCount2.value]))}set penWidth(t){this.penWidth!==t&&(this.slPenWidth.value=t,this.onPenWidthChange.fire(this.slPenWidth.value))}set kaleidoscope(t){X(this.kaleidoscope,t)||(this.cbKaleido1.value=t[0],this.cbKaleido2.value=t[1],this.onKaleidoChange.fire([this.cbKaleido1.value,this.cbKaleido2.value]))}set drawingColor(t){this.drawingColor!==t&&(this.csDrawingColor.value=t,this.onDrawingColorChange.fire(this.csDrawingColor.value))}set canvasColor(t){this.canvasColor!==t&&(this.csCanvasColor.value=t,this.onCanvasColorChange.fire(this.csCanvasColor.value))}set drawingAlpa(t){this.drawingAlpa!==t&&(this.slDrawingAlpha.value=t,this.onDrawingAlphaChange.fire(this.slDrawingAlpha.value))}set tool(t){this.cbTools.value=t}set eraser(t){this.cbEraser.value=t}penCountUp(){const[t,n]=this.penCount;this.penCount=[t+1,n]}penCountDown(){const[t,n]=this.penCount;t<=1||(this.penCount=[t-1,n])}updateScrollRange(){const t=this.canvasWidth/2*this.scale,n=this.canvasHeight/2*this.scale;this.slX.elSlider.min=String(-t),this.slX.elSlider.max=String(t),this.slY.elSlider.min=String(-n),this.slY.elSlider.max=String(n)}}const H=document.querySelector("#main"),Ct=document.querySelector("#palette"),Q=document.querySelector("#toast"),$=new m(H.offsetWidth,H.offsetHeight),ne=e=>{Q.textContent=e,Q.classList.add("visible"),setTimeout(()=>{Q.classList.remove("visible")},5e3)},P=new ee(Ct,{width:$.x,height:$.y}),p=new Jt(H,$.x,$.y);P.onScaleChange.listen(e=>{p.coord=p.coord.clone({scale:e})});P.onAngleChange.listen(e=>{p.coord=p.coord.clone({angle:e})});P.onScrollChange.listen(e=>{p.coord=p.coord.clone({scroll:e})});P.onPenCountChange.listen(e=>{p.penCount=e});P.onPenWidthChange.listen(e=>{p.penWidth=e});P.onClear.listen(()=>{!confirm("Are you sure you want to clear canvas? This action can not undo.")||p.clear(!0)});P.onUndo.listen(()=>{p.undo()});const se=async()=>{let e;try{e=new ClipboardItem({"image/png":p.toImgBlob()})}catch{e=new ClipboardItem({"image/png":await p.toImgBlob()})}await navigator.clipboard.write([e])};P.onCopy.listen(()=>{se().catch(e=>{console.error(e),alert("failed to copy img.")})});P.onKaleidoChange.listen(e=>{p.isKaleido=e});P.onEraserChange.listen(e=>{p.penKind=e?"eraser":"normal"});P.onDrawingColorChange.listen(e=>{p.penColor=e});P.onCanvasColorChange.listen(e=>{p.backgroundColor=e});P.onDrawingAlphaChange.listen(e=>{p.penAlpha=e});P.onToolChange.listen(e=>{if(p.tool=e,e==="draw:stamp"&&!p.stamp){const t={ja:"\u30B9\u30BF\u30F3\u30D7\u3092\u4F7F\u7528\u3059\u308B\u306B\u306F\u3001\u5148\u306BCommand(Ctrl)\u3092\u62BC\u3057\u306A\u304C\u3089\u7DDA\u3092\u5F15\u3044\u3066\u30B9\u30BF\u30F3\u30D7\u3092\u8A18\u9332\u3057\u307E\u3059",en:"Before using stamp, draw with Command(Ctrl) key for record a stroke."}[wt];ne(t)}});p.coord=p.coord.clone({scroll:P.scroll,scale:P.scale,angle:P.angle});p.listenRequestZoom(e=>{p.coord=p.coord.clone({scale:e})});p.listenRequestScrollTo(({point:e,target:t})=>{t==="canvas"&&(p.coord=p.coord.clone({scroll:e})),t==="anchor"&&(p.activeAnchor=p.activeAnchor.clone({scroll:e}))});p.listenRequestRotateTo(({angle:e,target:t})=>{t==="canvas"&&(p.coord=p.coord.clone({angle:e})),t==="anchor"&&(p.activeAnchor=p.activeAnchor.clone({angle:e}))});p.listenRequestUndo(()=>{p.undo()});p.listenRequestAnchorTransform(e=>{p.activeAnchor=e});p.listenRequestAnchorReset(()=>{p.anchor=new A});p.listenStrokeStart(()=>{console.log("start stroke")});p.listenStrokeEnd(()=>{console.log("end stroke")});window.addEventListener("keydown",e=>{e.key==="ArrowUp"&&P.penCountUp(),e.key==="ArrowDown"&&P.penCountDown(),e.key==="z"&&e.metaKey&&P.onUndo.fire(),e.key==="c"&&e.metaKey&&P.onCopy.fire()});const oe=new Ut;oe.listenChange(e=>P.tool=e);P.kaleidoscope=[!0,!0];P.penCount=[6,6];P.canvasColor="#ffffff";H.addEventListener("touchmove",function(e){e.preventDefault()},{passive:!1});Ct.addEventListener("touchmove",function(e){e.touches.length>=2&&e.preventDefault()},{passive:!1});const wt=navigator.language==="ja"?"ja":"en";document.querySelectorAll(".lang").forEach(e=>e.style.display="none");document.querySelectorAll(`.lang.${wt}`).forEach(e=>e.style.display="");
