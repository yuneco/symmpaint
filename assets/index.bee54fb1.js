var yt=Object.defineProperty;var tt=Object.getOwnPropertySymbols;var St=Object.prototype.hasOwnProperty,xt=Object.prototype.propertyIsEnumerable;var Z=(e,t,n)=>t in e?yt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,_=(e,t)=>{for(var n in t||(t={}))St.call(t,n)&&Z(e,n,t[n]);if(tt)for(var n of tt(t))xt.call(t,n)&&Z(e,n,t[n]);return e};var i=(e,t,n)=>(Z(e,typeof t!="symbol"?t+"":t,n),n);import{d as N}from"./vendor.1c606baf.js";const Pt=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}};Pt();class g{constructor(t=0,n=0){i(this,"x");i(this,"y");this.x=t,this.y=n}equals(t){return this.x===t.x&&this.y===t.y}move(t){return new g(this.x+t.x,this.y+t.y)}sub(t){return new g(this.x-t.x,this.y-t.y)}get angle(){return Math.atan2(this.y,this.x)/Math.PI*180}get length(){return Math.sqrt(this.x**2+this.y**2)}rotate(t){const n=t/180*Math.PI,s=Math.cos(n),o=Math.sin(n),r=this.x*s-this.y*o,a=this.x*o+this.y*s;return new g(r,a)}scale(t){return new g(this.x*t,this.y*t)}get invert(){return this.scale(-1)}}const et=e=>new g(e.x,e.y);class E{constructor(t){i(this,"scroll");i(this,"scale");i(this,"angle");i(this,"flipY");i(this,"_matrix");var n,s,o,r;this.scroll=(n=t==null?void 0:t.scroll)!=null?n:new g,this.scale=(s=t==null?void 0:t.scale)!=null?s:1,this.angle=(o=t==null?void 0:t.angle)!=null?o:0,this.flipY=(r=t==null?void 0:t.flipY)!=null?r:!1,this._matrix=new DOMMatrix().translateSelf(this.scroll.x,this.scroll.y).scaleSelf(this.scale,this.scale*(this.flipY?-1:1)).rotateSelf(this.angle)}toData(){return{scroll:this.scroll,scale:this.scale,angle:this.angle,flipY:this.flipY}}clone(t){const n=this.toData();return new E(_(_({},n),t))}get invert(){return new E({scroll:this.scroll.scale(-1),scale:1/this.scale,angle:-this.angle})}get matrix(){return this._matrix.translate(0)}get matrixScrollAfter(){return new DOMMatrix().scaleSelf(this.scale,this.scale*(this.flipY?-1:1)).rotateSelf(this.angle).translateSelf(this.scroll.x,this.scroll.y)}}class B{constructor(t,n){i(this,"el");i(this,"ctx");i(this,"width");i(this,"height");i(this,"_coord",new E);const s=document.createElement("canvas"),o=s.getContext("2d");if(!o)throw new Error("Failed to get 2d context for canvas");this.width=t,this.height=n,s.width=t,s.height=n,o.lineCap="round",this.el=s,this.ctx=o,this.coord=new E}get centor(){return new g(this.width/2,this.height/2)}set coord(t){const n=this.centor;this._coord=t,this.ctx.resetTransform(),this.ctx.translate(n.x,n.y),this.ctx.translate(t.scroll.x,t.scroll.y),this.ctx.rotate(-t.angle/180*Math.PI),this.ctx.scale(1/t.scale,1/t.scale)}get coord(){return this._coord}output(t,n){const s=this.centor;t.save();const o=this.coord;t.resetTransform(),t.translate(s.x,s.y),t.scale(o.scale,o.scale),t.rotate(o.angle/180*Math.PI),t.translate(-o.scroll.x,-o.scroll.y),t.translate(-s.x,-s.y),this.transferImageTo(t,n),t.restore()}copy(t,n){t.save(),t.resetTransform(),this.transferImageTo(t,n),t.restore()}transferImageTo(t,n){var s,o;t.globalAlpha=(s=n==null?void 0:n.alpha)!=null?s:1,t.globalCompositeOperation=(o=n==null?void 0:n.composition)!=null?o:"source-over",(n==null?void 0:n.background)&&(t.fillStyle=n.background,t.fillRect(0,0,this.width,this.height)),t.drawImage(this.el,0,0)}}class y{constructor(){i(this,"listeners",[])}fire(t){this.listeners.forEach(n=>n(t))}listen(t){this.listeners.includes(t)||this.listeners.push(t)}clear(){this.listeners.length=0}}const nt=e=>{const t=e>=0?e%360:360+e%360;return t<=180?t:-360+t},bt=e=>e/180*Math.PI,R=e=>{e.ctx.save(),e.ctx.resetTransform(),e.ctx.clearRect(0,0,e.width,e.height),e.ctx.restore()},Et=(e,t)=>{e.ctx.save(),e.ctx.resetTransform(),e.ctx.fillStyle=t,e.ctx.fillRect(0,0,e.width,e.height),e.ctx.restore()},st=(e,t,n,s,o="#91bccc")=>{const r=o,a=`${o}88`,d=new g(e.width/2,e.height/2).move(s.scroll),S=Math.sqrt(e.width**2+e.height**2);e.ctx.save(),e.ctx.resetTransform(),e.ctx.translate(d.x,d.y),e.ctx.rotate(bt(s.angle)),e.ctx.lineWidth=1;for(let w=0;w<t;w++){const C=n&&w%2!=0;e.ctx.strokeStyle=C?a:r,e.ctx.setLineDash(C?[4,4]:[]),e.ctx.beginPath(),e.ctx.moveTo(0,0),e.ctx.lineTo(0,S),e.ctx.stroke(),e.ctx.closePath(),e.ctx.rotate(360/t/180*Math.PI)}e.ctx.restore()};class ot{constructor(t=10){i(this,"maxItems");i(this,"items",[]);i(this,"onOverflow",new y);this.maxItems=t}get length(){return this.items.length}clear(){this.items.length=0}push(t){if(this.items.push(t),this.items.length<=this.maxItems)return;const n=this.items.shift();n&&this.onOverflow.fire(n)}pop(){return this.items.pop()}peek(t=0){return this.items[this.items.length-1+t]}getItems(){return[...this.items]}listenOverflow(...t){this.onOverflow.listen(...t)}}const kt=e=>Math.max(.1,1-Math.pow(1-e,2)),At=e=>{const[t,...n]=e,s=`M${t.x}, ${t.y} L`+n.map(r=>isNaN(r.x+r.y)?"":`${r.x}, ${r.y}`).join(" ")+"";return new Path2D(s)},rt=e=>{if(e.length<=2)return[e];for(let t=2;t<e.length;t++){const n=e[t-2],s=e[t-1],o=e[t-0],r=s.point.sub(n.point).angle,a=o.point.sub(s.point).angle,l=Math.abs(r-a);if(Math.abs(l-180)<30)return[e.slice(0,t),...rt(e.slice(t-1))]}return[e]},Tt=(e,t)=>{const n=e.map(r=>({x:r.point.x,y:r.point.y,w:Math.max(1,kt(r.pressure)*t)})),s=N.exports.smooth(n,3),o=[];for(let r=0;r<s.length;r+=1){const{left:a,right:l}=N.exports.computeSidePoints(s[r],s[r-1]||s[r+1]),d=o.slice(r)[0];let S=!1;if(d){const w=N.exports.vector2.length(d,a),C=N.exports.vector2.length(d,l);S=w-C>0}d&&S?o.splice(r,0,a,l):o.splice(r,0,l,a)}return At(o)},it=(e,t,n)=>{const o=t.flatMap(rt).map(r=>Tt(r,e.lineWidth));n.forEach(r=>{o.forEach(a=>{const l=new Path2D;l.addPath(a,r),e.fill(l)})})};class q{constructor(){i(this,"_coord",new E);i(this,"children",[])}get coord(){return this._coord}set coord(t){this._coord=this._coord.clone(t)}get childCount(){return this.children.length}get state(){return{coord:this.coord,children:this.children.map(t=>t.state)}}set state(t){for(this.coord=t.coord,this.children.length>t.children.length&&(this.children.length=t.children.length);this.children.length<t.children.length;)this.addChildPen();t.children.forEach((n,s)=>{this.children[s].state=n})}get leafs(){return this.childCount?this.children.flatMap(t=>t.leafs):[this]}clone(){const t=new q;return t.state=this.state,t}childAt(t){return this.children[t]}matrices(t){const n=t.multiply(this.coord.matrix);return this.childCount?this.children.flatMap(s=>s.matrices(n)):[n]}matricesBasedFirstPen(t){const n=this.matrices(t),s=n[0].inverse();return n.map(o=>o.multiply(s))}addChildPen(t){const n=new q;return t&&(n.coord=t),this.children.push(n),n}clearChildren(){this.children.length=0}drawStrokes(t,n){const s=this.matricesBasedFirstPen(new DOMMatrix);it(t.ctx,n,s)}drawLines(t,n,s=.5){if(n.length<2)return;const o=t.ctx,r=n.map(l=>({point:l,pressure:s})),a=this.matricesBasedFirstPen(new DOMMatrix);it(o,[r],a)}dryRun(t){const n=this.matrices(new DOMMatrix),s=n[0].inverse();return n.map(o=>t.map(r=>{const a=s.transformPoint(r.point);return{point:et(o.transformPoint(a)),pressure:r.pressure}}))}}const lt=e=>{const t=e.findIndex((a,l)=>l>0&&a.pressure===0);if(t===-1)return[e];const n=e.slice(0,t),s=e.slice(t),o=!(n.length===1&&n[0].pressure===0),r=!(s.length===1&&s[0].pressure===0);return[...o?[n]:[],...r?lt(s):[]]},at=(e,t)=>{e.ctx.save(),e.ctx.fillStyle=t.style.color,e.ctx.lineWidth=t.style.penSize;const n=new q;n.state=t.penState,n.drawStrokes(e,lt(t.inputs)),e.ctx.restore()},Lt=e=>{R(e)},Mt=(e,t,n)=>{n.forEach(s=>{s.tool==="pen"&&(R(t),at(t,s),t.copy(e.ctx,{alpha:s.style.alpha,composition:s.style.composition})),s.tool==="clearAll"&&Lt(e)}),R(t)},Dt=e=>e.flatMap(t=>{if(!t.length)return t;const n=t[0],s=t[t.length-1];return[{point:n.point,pressure:0},...t,{point:s.point,pressure:0}]});class F{constructor(t,n,s,o="pen"){i(this,"inputs",[]);i(this,"penState");i(this,"style");i(this,"canvasCoord");i(this,"tool");this.canvasCoord=t,this.penState=n,this.style=s,this.tool=o}addPoint(t,n){this.inputs.push({point:t,pressure:n})}clearPoints(t=!1,n=!1){const s=t?this.inputs.shift():void 0,o=n?this.inputs.pop():void 0;this.inputs.length=0,s&&this.inputs.push(s),o&&this.inputs.push(o)}get flatten(){const t=new q;t.state=this.penState;const n=t.dryRun(this.inputs),s=et(this.canvasCoord.matrixScrollAfter.transformPoint(t.coord.scroll)).invert,o=Dt(n).map(a=>({point:a.point.move(s),pressure:a.pressure}));t.clearChildren(),t.coord=new E;const r=new F(this.canvasCoord,t.state,this.style,this.tool);return r.inputs.push(...o),r}}const It=110,Y=10;class Rt{constructor(t,n){i(this,"canvasWidth");i(this,"canvasHeight");i(this,"history",new ot(1/0));i(this,"snapshots",new ot(It/Y));i(this,"currentStroke");i(this,"lastSnapshotIndex",0);i(this,"oldestSnapshotIndex",0);this.canvasWidth=t,this.canvasHeight=n,this.snapshots.listenOverflow(()=>{this.oldestSnapshotIndex+=Y,console.log(`oldestSnapshotIndex: ${this.oldestSnapshotIndex}`)})}get strokes(){return this.history.peek()}get snapshot(){return this.snapshots.peek()}get prevSnapshot(){return this.snapshots.peek(-1)}get lastHistories(){return this.history.getItems().slice(this.lastSnapshotIndex)}addSnapshot(){const t=new B(this.canvasWidth,this.canvasHeight);this.snapshots.push(t);const n=this.prevSnapshot;n&&t.ctx.drawImage(n.el,0,0);const s=document.querySelector("#debug .history .snaps");if(s){const o=120/Math.max(t.el.width,t.el.height);t.el.style.width=`${t.el.width*o}px`,t.el.style.height=`${t.el.height*o}px`,s.appendChild(t.el),t.el.scrollIntoView()}this.lastSnapshotIndex=this.history.length-1}start(t,n,s,o){const r=new F(t,n,s,o);return this.currentStroke=r,r}commit(t){if(!this.currentStroke)return;if(this.history.push(this.currentStroke),this.history.length-this.lastSnapshotIndex-1===Y){if(this.addSnapshot(),!this.snapshot){console.error("failed to add snapshot");return}t.copy(this.snapshot.ctx,{alpha:this.currentStroke.style.alpha}),console.log("new snapshot",this.snapshots.length)}this.currentStroke=void 0}rollback(){!this.currentStroke||(console.log("stroke rollbacked"),this.currentStroke=void 0)}get current(){return this.currentStroke}get undoable(){return this.history.length>this.oldestSnapshotIndex}undo(t){var o;if(!this.undoable)return console.log("no more history"),!1;const n=new B(t.width,t.height);t.ctx.save();const s=this.snapshot;if(s?(t.ctx.resetTransform(),t.ctx.drawImage(s.el,0,0)):console.log("no prev"),this.history.pop(),Mt(t,n,this.lastHistories),!this.lastHistories.length&&this.snapshots.length>=1){const r=this.snapshots.pop();r&&((o=r.el.parentNode)==null||o.removeChild(r.el)),this.lastSnapshotIndex-=Y,console.log("back prev snap",this.snapshots.length,this.snapshots)}return t.ctx.restore(),!0}}class G{constructor(t){i(this,"color");i(this,"penSize");i(this,"alpha");i(this,"composition");var n,s,o,r;this.color=(n=t==null?void 0:t.color)!=null?n:"#000000",this.penSize=(s=t==null?void 0:t.penSize)!=null?s:10,this.alpha=(o=t==null?void 0:t.alpha)!=null?o:1,this.composition=(r=t==null?void 0:t.composition)!=null?r:""}toData(){return{color:this.color,penSize:this.penSize,alpha:this.alpha,composition:this.composition}}clone(t){return new G(_(_({},this.toData()),t))}}const qt=e=>{var t;return(t={draw:"crosshair",scroll:"move","scroll:anchor":"move",zoomup:"zoom-in",zoomdown:"zoom-out",rotate:"grab","rotate:anchor":"grab","draw:line":"crosshair","draw:stamp":"crosshair"}[e])!=null?t:"default"},Kt=(e,t)=>{const n=e.getBoundingClientRect();return new g(n.left,n.top).move(t!=null?t:new g(n.width/2,n.height/2))},Wt=(e,t,n)=>{const s=t.sub(e).angle;return n.sub(e).angle-s},ct=(e,t,n)=>({distance:n.sub(t),angle:Wt(e,t,n)}),Ot=(e,t,n,s,o,r=1,a=60)=>{const l={startPoint:new g,lastRawPoint:new g,isWatchMove:!1,lastMs:Date.now()},d=()=>Kt(e,o==null?void 0:o()),S=f=>{!f.isPrimary||(l.startPoint=l.lastRawPoint=new g(f.clientX,f.clientY),l.isWatchMove=t(f))},w=f=>{if(!f.isPrimary||!l.isWatchMove)return;const x=new g(f.clientX,f.clientY),k=x.sub(l.lastRawPoint).length,A=Date.now(),L=1e3/(A-l.lastMs);k<r||L>a||k/r*(a/L)<3||(n(f,ct(d(),l.startPoint,x)),l.lastRawPoint=x,l.lastMs=A)},C=f=>{if(!f.isPrimary||!l.isWatchMove)return;const x=new g(f.clientX,f.clientY);s(f,ct(d(),l.startPoint,x)),l.isWatchMove=!1};return e.addEventListener("pointerdown",S),e.addEventListener("pointermove",w),e.addEventListener("pointerup",C),()=>{e.removeEventListener("pointerdown",S),e.removeEventListener("pointermove",w),e.removeEventListener("pointerup",C)}},_t=200,Bt=300,Nt=10,ht=e=>{const[t,n]=e,s=new g((t.x+n.x)/2,(t.y+n.y)/2),o=t.sub(s).angle,r=n.sub(t).length;return{center:s,angle:o,dist:r}},Ft=e=>{const[t,n]=e;return{scroll:n.center.sub(t.center),angle:nt(n.angle-t.angle),scale:n.dist/t.dist,center:n.center}},j=e=>{const t=[];for(let n=0;n<e.length;n++)t.push(e[n]);return t},Yt=(e,t,n=1)=>{let s=[],o,r=0,a=!1,l=0,d=0;const S=()=>{r=Date.now(),a=!1,l=0,d=0},w=()=>Date.now()-r<=_t,C=()=>{if(!(s.length<2))return[s[0].pagePoint,s[1].pagePoint]},T=u=>{const h=j(u).map(c=>c.identifier);s=s.filter(c=>!h.includes(c.identifier))},f=u=>{T(u);const h=j(u).map(c=>({identifier:c.identifier,pagePoint:new g(c.clientX,c.clientY)}));s=[...s,...h]},x=u=>{const h=j(u);let c=!1;return h.forEach(P=>{const m=s.find(b=>b.identifier===P.identifier);if(!m)return;const M=new g(P.clientX,P.clientY);m.pagePoint.sub(M).length<=n||(m.pagePoint=M,c=!0)}),c},k=u=>{var c;const h=s.length;f(u.changedTouches),h===0&&S(),h<=1&&s.length>=2&&w()&&(a=!0,o=C(),(c=t.onStart)==null||c.call(t)),l=Math.max(l,s.length)},A=u=>{var h,c,P;T(u.changedTouches),s.length<=1&&a&&(a=!1,o=void 0,(h=t.onEnd)==null||h.call(t),Date.now()-r<Bt&&d<=Nt&&(l===2&&((c=t.onTwoFingerTap)==null||c.call(t)),l===3&&((P=t.onThreeFingerTap)==null||P.call(t))))},L=u=>{var P;if(!a||!x(u.changedTouches))return;const c=C();if(o&&c){const[m,M]=[ht(o),ht(c)],b=Ft([m,M]);d=Math.max(d,b.scroll.length),(P=t.onTransform)==null||P.call(t,b,l)}};return e.addEventListener("touchstart",k),e.addEventListener("touchend",A),e.addEventListener("touchcancel",A),e.addEventListener("touchmove",L),()=>{e.removeEventListener("touchstart",k),e.removeEventListener("touchend",A),e.removeEventListener("touchcancel",A),e.removeEventListener("touchmove",L)}},z=(e,t)=>{if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0};class zt{constructor(t){i(this,"target");i(this,"_keys",{});i(this,"_removeEvents");i(this,"onChange",new y);this.target=t!=null?t:document.body;const n=o=>{const r=o.key;this._keys[r]=!0,this.onChange.fire({key:r,isDown:!0})},s=o=>{const r=o.key;delete this._keys[r],this.onChange.fire({key:r,isDown:!1})};this.target.addEventListener("keydown",n),this.target.addEventListener("keyup",s),this._removeEvents=()=>{this.target.removeEventListener("keydown",n),this.target.removeEventListener("keyup",s)}}listen(...t){this.onChange.listen(...t)}destroy(){this._removeEvents(),this.onChange.clear()}key(t){return!!this._keys[t]}get keys(){return Object.keys(this._keys)}}const Xt=e=>{const t=e.includes(" "),n=e.includes("Alt"),s=e.includes("Meta"),o=e.includes("Shift");return t&&s&&n?"zoomdown":t&&s?"zoomup":t&&n&&o?"rotate:anchor":t&&n?"rotate":t&&o?"scroll:anchor":t?"scroll":o?"draw:line":n?"draw:stamp":"draw"};class Ut{constructor(){i(this,"keyWatcher");i(this,"tool");i(this,"onChange",new y);this.keyWatcher=new zt,this.keyWatcher.listen(()=>{const t=Xt(this.keyWatcher.keys);this.tool!==t&&(this.tool=t,this.onChange.fire(t))})}listenChange(...t){this.onChange.listen(...t)}}const ut=.2,dt=4,pt=[0,ut,.33,.5,.67,.75,1,1.5,2,2.5,3,3.5,dt,1/0],gt=(e,t)=>{var r;const n=t?pt:[...pt].reverse(),s=n.findIndex(a=>t?a>e:a<e),o=(r=n[s])!=null?r:0;return Math.max(ut,Math.min(dt,o))},Ht=e=>{if(!e.length)return 0;const t=Math.floor(e.length*.9);return e[t].pressure},$t=(e,t)=>{let n=!0;const s={activeEvent:void 0,startCoord:new E,startAnchor:[new E,new E],startPoint:new g,lastPoint:new g,isCapturing:!1,currentStroke:void 0,pen:new q},o=new B(e.width*e.resolution,e.height*e.resolution),r=u=>new g((u.offsetX-e.width/2)*e.resolution,(u.offsetY-e.height/2)*e.resolution),a=u=>{const h=e.tool;s.activeEvent=h,s.startCoord=e.coord,s.startAnchor=[e.anchor,e.childAnchor],s.lastPoint=s.startPoint=r(u),s.isCapturing=u.metaKey,s.pen=e.canvasPen,s.currentStroke=void 0},l=u=>{if(!n)return!1;const h=e.tool;if(a(u),h==="zoomup"||h==="zoomdown"){const c=e.coord.scale;return h==="zoomup"&&t.onZoom(gt(c,!0)),h==="zoomdown"&&t.onZoom(gt(c,!1)),!1}return(h==="draw"||h==="draw:line"||h==="draw:stamp")&&w(s.startPoint),!0},d=(u,h)=>{if(!n)return;const c=s.activeEvent,m={point:r(u),pressure:u.pressure};if((c==="draw"||c==="draw:line")&&(R(o),C(m.point,m.pressure||.5)),c==="draw:stamp"&&e.stamp){const M=m.point.sub(s.startPoint),b=M.length/100;R(o),f(e.stamp,s.startPoint,b,M.angle,!0)}c==="scroll"&&k(h,"canvas"),c==="scroll:anchor"&&k(h,"anchor"),c==="rotate"&&A(h,"canvas"),c==="rotate:anchor"&&A(h,"anchor"),s.lastPoint=m.point,u.preventDefault()},S=(u,h)=>{var M;if(!n)return;const c=s.activeEvent,P=r(u),m=c==="draw"||c==="draw:line"||c==="draw:stamp";if(c==="draw"&&C(P,u.pressure||0),c==="draw:line"){R(o);const b=s.currentStroke,I=b?Ht(b.inputs):.5;if(C(P,I),b){b.inputs.length=1,b.inputs[0].pressure=I;const O={point:P,pressure:I};b.inputs.push(O,O)}}if(c==="draw:stamp"&&e.stamp){R(o);const b=P.sub(s.startPoint),I=b.length/100;f(e.stamp,s.startPoint,I,b.angle,!1)}if((c==="draw"||c==="draw:line")&&s.isCapturing){e.stamp=(M=s.currentStroke)==null?void 0:M.flatten,T(!1),L();return}c==="scroll"&&k(h,"canvas"),c==="scroll:anchor"&&k(h,"anchor"),c==="rotate"&&A(h,"canvas"),c==="rotate:anchor"&&A(h,"anchor"),T(m)},w=u=>{const h=e.view2canvasPos(u,"start");o.coord=new E,o.ctx.lineWidth=e.style.penSize;const c=()=>s.isCapturing?"#0044aa":e.penKind==="eraser"?e.backgroundColor:e.style.color;o.ctx.fillStyle=c(),s.currentStroke=e.startHistory(),s.currentStroke.addPoint(h,0)},C=(u,h=.5)=>{const c=s.activeEvent,P=e.view2canvasPos(u,"start"),m=s.currentStroke;if(!!m){if(m.addPoint(P,h),c==="draw:line"){const M={point:m.inputs[0].point,pressure:h},b=m.inputs[m.inputs.length-1],I=[M,b,b];s.pen.drawStrokes(o,[I])}else s.pen.drawStrokes(o,[m.inputs]);L()}},T=u=>{e.endHistory(u,o),R(o),s.activeEvent=void 0},f=(u,h,c,P,m)=>{const M=new q;M.state=s.pen.state;const b=e.style.clone({color:e.penKind==="eraser"?e.backgroundColor:e.style.color}),I=h,O=new F(e.coord,M.state,m?b:e.style,u.tool),Ct=u.inputs.map(Q=>({point:Q.point.scale(c).rotate(P).move(I),pressure:Q.pressure}));O.inputs.push(...Ct),at(o,O),L();const $=s.currentStroke;!m&&$&&($.clearPoints(),$.inputs.push(...O.inputs))},x=()=>{T(!1)},k=(u,h)=>{const c=e.hasSubPen?1:0,m={canvas:s.startCoord,anchor:s.startAnchor[c]}[h].scroll.move(u.distance.scale(-1/e.coord.scale*e.resolution).rotate(-e.coord.angle).scale(h==="anchor"?-1:1));t.onScroll(m,h)},A=(u,h)=>{const c=e.hasSubPen?1:0,m={canvas:s.startCoord,anchor:s.startAnchor[c]}[h].angle+u.angle;t.onRotate(nt(m),h)},L=()=>{e.rePaint(u=>{o.ctx.save(),o.coord=e.coord,o.output(u,{alpha:e.style.alpha}),o.ctx.restore()})};return{onDown:l,onDrag:d,onUp:S,strokeState:{get enabled(){return n},set enabled(u){n=u,n||x()},get startCoord(){return s.startCoord},get startAnchor(){return s.startAnchor}}}},Zt=e=>new E({scroll:e[1].scroll.sub(e[0].scroll).rotate(-e[0].angle),angle:e[1].angle}),Gt=(e,t,n)=>{const s=new q,[o,r]=n,[a,l]=[e[0]*(o?2:1),e[1]*(r?2:1)],d=t[0].clone({angle:t[0].angle+360/a/2}),S=t[1],w=Zt([d,S]);s.coord=d;for(let C=0;C<a;C++){const T=o&&C%2!=0,f=s.addChildPen(new E({angle:C/a*360,flipY:T}));for(let x=0;x<l;x++){const k=r&&x%2!=0;f.addChildPen(new E({scroll:w.scroll,angle:w.angle+360/l/2})).addChildPen(new E({angle:x/l*360,flipY:k}))}}return console.log(s.state),s},jt=(e,t,n,s,o)=>{const[r,a]=o,[l,d]=[r>=2,a>=2];l&&st(e,r*(s[0]?2:1),s[0],new E({scroll:t.scroll.invert.move(n[0].scroll).scale(t.scale).rotate(t.angle),angle:t.angle+n[0].angle}),d?"#cccccc":void 0),d&&st(e,a*(s[1]?2:1),s[1],new E({scroll:t.scroll.invert.move(n[1].scroll).scale(t.scale).rotate(t.angle),angle:t.angle+n[0].angle+n[1].angle}),"#eeaabb")},D=2,ft=3.5,Vt={normal:"",eraser:"destination-out"};class Jt{constructor(t,n,s){i(this,"width");i(this,"height");i(this,"resolution",D);i(this,"canvas");i(this,"view");i(this,"history");i(this,"strokeState");i(this,"events",{requestChangeZoom:new y,requestScrollTo:new y,requestRotateTo:new y,requestUndo:new y,requestAnchorTransform:new y,requestAnchorReset:new y});i(this,"setting",{style:new G,stamp:void 0,tool:"draw",backgroundColor:"#ffffff",anchor:[new E,new E],penCount:[1,0],isKaleido:[!1,!1]});i(this,"pen",new q);i(this,"view2canvasPos",(t,n)=>{const s=n==="start"?this.strokeState.startCoord:this.coord;return t.scale(1/s.scale).rotate(-s.angle).move(s.scroll)});i(this,"canvas2viewPos",(t,n)=>{const s=n==="start"?this.strokeState.startCoord:this.coord;return t.move(s.scroll.invert).rotate(s.angle).scale(s.scale)});i(this,"canvas2displayPos",(t,n)=>this.canvas2viewPos(t,n).move(new g(this.width,this.height)).scale(1/D));i(this,"rePaintRequestId",0);var a;this.width=n,this.height=s,this.canvas=new B(this.width*D,this.height*D),this.view=new B(this.width*D,this.height*D),this.history=new Rt(this.width*D,this.height*D),this.view.el.style.width=`${n}px`,this.view.el.style.height=`${s}px`,t.appendChild(this.view.el);const o=document.getElementById("debug");if(o){const l=200/Math.max(n,s);this.canvas.el.style.width=`${n*l}px`,this.canvas.el.style.height=`${s*l}px`,(a=o.querySelector(".canvas"))==null||a.appendChild(this.canvas.el)}const r=$t(this,{onScroll:(l,d)=>this.events.requestScrollTo.fire({point:l,target:d}),onRotate:(l,d)=>this.events.requestRotateTo.fire({angle:l,target:d}),onZoom:l=>this.events.requestChangeZoom.fire(l)});this.strokeState=r.strokeState,Yt(this.view.el,{onStart:()=>{this.strokeState.enabled=!1},onTransform:(l,d)=>d>=3?this.onTouchTramsformAnchor(l):this.onTouchTramsformCanvas(l),onEnd:()=>{this.strokeState.enabled=!0},onTwoFingerTap:()=>this.events.requestUndo.fire(),onThreeFingerTap:()=>this.events.requestAnchorReset.fire()},ft),Ot(this.view.el,l=>r.onDown(l),(l,d)=>r.onDrag(l,d),(l,d)=>r.onUp(l,d),()=>this.tool==="scroll:anchor"||this.tool==="rotate:anchor"?this.canvas2displayPos(this.activeAnchor.scroll,"start"):void 0,ft),this.childAnchor=new E({scroll:new g(300,0),angle:0}),this.tool="draw",this.clear(!1)}get canvasPen(){return this.pen.clone()}get coord(){return this.canvas.coord}set coord(t){this.canvas.coord=t,this.rePaint()}get tool(){return this.setting.tool}set tool(t){this.setting.tool=t,this.view.el.style.cursor=qt(t)}get isKaleido(){return[...this.setting.isKaleido]}set isKaleido(t){z(this.isKaleido,t)||(this.setting.isKaleido=[...t],this.rebuildPen(),this.rePaint())}get penCount(){return this.setting.penCount}set penCount(t){z(this.penCount,t)||(this.setting.penCount=[...t],this.rebuildPen(),this.rePaint())}get hasSubPen(){return this.penCount[1]>=1}set penWidth(t){this.setting.style=this.setting.style.clone({penSize:t})}set penColor(t){this.setting.style=this.setting.style.clone({color:t})}set penAlpha(t){this.setting.style=this.setting.style.clone({alpha:t})}get penKind(){return this.setting.style.composition===""?"normal":"eraser"}set penKind(t){this.setting.style=this.setting.style.clone({composition:Vt[t]})}get stamp(){return this.setting.stamp}set stamp(t){this.setting.stamp=t}get backgroundColor(){return this.setting.backgroundColor}set backgroundColor(t){this.setting.backgroundColor!==t&&(this.setting.backgroundColor=t,this.rePaint())}get anchor(){return this.setting.anchor[0]}set anchor(t){this.setting.anchor[0]=t,this.rebuildPen(),this.rePaint()}get childAnchor(){return this.setting.anchor[1]}set childAnchor(t){this.setting.anchor[1]=t,this.rebuildPen(),this.rePaint()}get activeAnchor(){return this.hasSubPen?this.childAnchor:this.anchor}set activeAnchor(t){this[this.hasSubPen?"childAnchor":"anchor"]=t}get style(){return this.setting.style}rebuildPen(){this.pen.state=Gt(this.setting.penCount,this.setting.anchor,this.setting.isKaleido).state}listenRequestZoom(t){this.events.requestChangeZoom.listen(t)}listenRequestScrollTo(t){this.events.requestScrollTo.listen(t)}listenRequestRotateTo(t){this.events.requestRotateTo.listen(t)}listenRequestUndo(t){this.events.requestUndo.listen(t)}listenRequestAnchorTransform(t){this.events.requestAnchorTransform.listen(t)}listenRequestAnchorReset(t){this.events.requestAnchorReset.listen(t)}clear(t=!0){t&&(this.history.start(this.coord,this.pen.state,this.setting.style,"clearAll"),this.history.commit(this.canvas)),R(this.canvas),this.rePaint()}undo(){!this.history.undoable||(this.clear(!1),this.history.undo(this.canvas),this.rePaint())}startHistory(){return this.history.start(this.coord,this.pen.state,this.setting.style)}endHistory(t,n){if(!t){this.history.rollback();return}this.history.commit(this.canvas),n==null||n.copy(this.canvas.ctx,{alpha:this.setting.style.alpha,composition:this.setting.style.composition}),this.rePaint()}async toImgBlob(){return new Promise((t,n)=>{this.canvas.el.toBlob(s=>s?t(s):n())})}onTouchTramsformCanvas(t){const n=this.strokeState.startCoord,{center:s,scroll:o,scale:r,angle:a}=t,l=L=>L.rotate(-n.angle).scale(1/n.scale),d=new g((s.x-this.width/2)*D,(s.y-this.height/2)*D),S=this.view2canvasPos(d,"start"),w=new g(0,0),C=this.view2canvasPos(w,"start"),T=S.sub(C),x=T.rotate(-a).scale(1/r).sub(T),k=o.scale(D),A=l(k);this.events.requestRotateTo.fire({angle:n.angle+a,target:"canvas"}),this.events.requestChangeZoom.fire(n.scale*r),this.events.requestScrollTo.fire({point:n.scroll.sub(x).sub(A),target:"canvas"})}onTouchTramsformAnchor(t){const n=this.strokeState.startAnchor[this.hasSubPen?1:0],s=t.angle+n.angle,o=t.scroll.scale(1/this.strokeState.startCoord.scale*D).rotate(-this.strokeState.startCoord.angle).move(n.scroll);this.events.requestAnchorTransform.fire(n.clone({scroll:o,angle:s}))}rePaint(t){cancelAnimationFrame(this.rePaintRequestId),this.rePaintRequestId=requestAnimationFrame(()=>{this.rePaintRequestId=0,Et(this.view,"#cccccc"),this.canvas.output(this.view.ctx,{background:this.backgroundColor}),t==null||t(this.view.ctx),jt(this.view,this.coord,this.setting.anchor,this.isKaleido,this.penCount)})}}class V{constructor(t){i(this,"el");const n=this.el=document.createElement("button");n.className="Button",n.textContent=t}addEventListener(...t){return this.el.addEventListener(...t)}removeEventListener(...t){return this.el.removeEventListener(...t)}}class K{constructor(t,n=0,s=100,o=0,r=!1){i(this,"el");i(this,"elSlider");i(this,"elText");i(this,"isPercent");const a=this.el=document.createElement("div"),l=this.elSlider=document.createElement("input"),d=document.createElement("label"),S=document.createElement("span"),w=this.elText=document.createElement("span");this.isPercent=r,a.appendChild(d),d.appendChild(S),d.appendChild(w),d.appendChild(l),l.type="range",l.className="Slider",l.min=String(n),l.max=String(s),l.value=String(o),S.textContent=`${t}: `,w.textContent=l.value,l.addEventListener("input",()=>{w.textContent=l.value})}get value(){return this.elSlider.valueAsNumber*(this.isPercent?.01:1)}set value(t){const n=t*(this.isPercent?100:1);this.elSlider.value=String(n),this.elText.textContent=String(n)}addEventListener(...t){return this.elSlider.addEventListener(...t)}removeEventListener(...t){return this.elSlider.removeEventListener(...t)}}class X{constructor(t,n=!1){i(this,"el");i(this,"elCheck");const s=this.el=document.createElement("div"),o=this.elCheck=document.createElement("input"),r=document.createElement("label"),a=document.createElement("span");s.appendChild(r),r.appendChild(o),r.appendChild(a),s.className="Checkbox",o.type="checkbox",o.checked=n,a.textContent=t}get value(){return this.elCheck.checked}set value(t){this.elCheck.checked=t}addEventListener(...t){return this.elCheck.addEventListener(...t)}removeEventListener(...t){return this.elCheck.removeEventListener(...t)}}class mt{constructor(t,n=!1){i(this,"el");i(this,"elColor");const s=this.el=document.createElement("div"),o=this.elColor=document.createElement("input"),r=document.createElement("label"),a=document.createElement("span");s.appendChild(r),r.appendChild(o),r.appendChild(a),s.className="ColorSelector",o.type="color",o.checked=n,a.textContent=t}get value(){return this.elColor.value}set value(t){this.elColor.value=t}addEventListener(...t){return this.elColor.addEventListener(...t)}removeEventListener(...t){return this.elColor.removeEventListener(...t)}}class Qt{constructor(t,n){i(this,"checks");i(this,"_value");i(this,"el");i(this,"_updating",!1);i(this,"onChange",new y);const s=Object.keys(t);this.checks=s.map(r=>({cb:new X(t[r]),key:r})),this.value=n,this._value=n,this.checks.forEach(r=>{r.cb.addEventListener("change",()=>{this._updating||r.cb.value&&(this.value=r.key)})});const o=this.el=document.createElement("div");o.className="RadioGroup",this.checks.forEach(r=>{o.appendChild(r.cb.el)})}get value(){return this._value}set value(t){const n=this._value!==t;this._value=t,this.updateChecked(),!!n&&this.onChange.fire(t)}updateChecked(){this._updating=!0,this.checks.forEach(t=>t.cb.value=t.key===this.value),this._updating=!1}listenChange(...t){this.onChange.listen(...t)}}const te={draw:"Draw","draw:line":"Line","draw:stamp":"Stamp",scroll:"Move","scroll:anchor":"Move Anchor",rotate:"Rotate","rotate:anchor":"Rotate Anchor",zoomup:"+",zoomdown:"-"};class ee{constructor(t,n){i(this,"slScale");i(this,"slAngle");i(this,"slX");i(this,"slY");i(this,"slPenCount1");i(this,"slPenCount2");i(this,"slPenWidth");i(this,"cbKaleido1");i(this,"cbKaleido2");i(this,"cbEraser");i(this,"csDrawingColor");i(this,"csCanvasColor");i(this,"slDrawingAlpha");i(this,"cbTools");i(this,"onScaleChange",new y);i(this,"onAngleChange",new y);i(this,"onScrollChange",new y);i(this,"onPenCountChange",new y);i(this,"onPenWidthChange",new y);i(this,"onClear",new y);i(this,"onUndo",new y);i(this,"onCopy",new y);i(this,"onKaleidoChange",new y);i(this,"onEraserChange",new y);i(this,"onDrawingColorChange",new y);i(this,"onCanvasColorChange",new y);i(this,"onDrawingAlphaChange",new y);i(this,"onToolChange",new y);i(this,"canvasWidth");i(this,"canvasHeight");this.canvasWidth=n.height,this.canvasHeight=n.height;const s=this.slScale=new K("Scale",50,300,100,!0),o=this.slAngle=new K("Angle",-360,360,0),r=this.slX=new K("Scroll X",-this.canvasWidth/2,this.canvasWidth/2,0),a=this.slY=new K("Scroll Y",-this.canvasHeight/2,this.canvasHeight/2,0),l=this.slPenCount1=new K("Pen Count Parent",1,16,1),d=this.slPenCount2=new K("Pen Count Child",0,8,1),S=this.slPenWidth=new K("Pen Size",2,100,20),w=new V("Clear All"),C=new V("Undo"),T=new V("Copy Image"),f=this.cbKaleido1=new X("Kalaidoscope"),x=this.cbKaleido2=new X("Kalaidoscope"),k=this.cbEraser=new X("Eraser"),A=this.csDrawingColor=new mt("Pen Color"),L=this.csCanvasColor=new mt("BG Color"),W=this.slDrawingAlpha=new K("Pen Alpha",1,100,100,!0),u=this.cbTools=new Qt(te,"draw");t.appendChild(u.el),t.appendChild(k.el),t.appendChild(A.el),t.appendChild(L.el),t.appendChild(l.el),t.appendChild(f.el),t.appendChild(d.el),t.appendChild(x.el),t.appendChild(W.el),t.appendChild(S.el),t.appendChild(w.el),t.appendChild(C.el),t.appendChild(T.el),s.addEventListener("input",()=>{this.onScaleChange.fire(s.value)}),o.addEventListener("input",()=>{this.onAngleChange.fire(o.value)}),r.addEventListener("input",()=>{this.onScrollChange.fire(new g(r.value,a.value))}),a.addEventListener("input",()=>{this.onScrollChange.fire(new g(r.value,a.value))}),l.addEventListener("input",()=>{this.onPenCountChange.fire([l.value,d.value])}),d.addEventListener("input",()=>{this.onPenCountChange.fire([l.value,d.value])}),S.addEventListener("input",()=>{this.onPenWidthChange.fire(S.value)}),w.addEventListener("click",()=>{this.onClear.fire()}),C.addEventListener("click",()=>{this.onUndo.fire()}),T.addEventListener("click",()=>{this.onCopy.fire()}),f.addEventListener("change",()=>{this.onKaleidoChange.fire([f.value,x.value])}),x.addEventListener("change",()=>{this.onKaleidoChange.fire([f.value,x.value])}),k.addEventListener("change",()=>{this.onEraserChange.fire(k.value)}),A.addEventListener("input",()=>{this.onDrawingColorChange.fire(A.value)}),L.addEventListener("input",()=>{this.onCanvasColorChange.fire(L.value)}),W.addEventListener("input",()=>{this.onDrawingAlphaChange.fire(W.value)}),u.listenChange(h=>this.onToolChange.fire(h))}get scale(){return this.slScale.value}get angle(){return this.slAngle.value}get scroll(){return new g(this.slX.value,this.slY.value)}get penCount(){return[this.slPenCount1.value,this.slPenCount2.value]}get penWidth(){return this.slPenWidth.value}get kaleidoscope(){return[this.cbKaleido1.value,this.cbKaleido2.value]}get drawingColor(){return this.csDrawingColor.value}get canvasColor(){return this.csCanvasColor.value}get drawingAlpha(){return this.slDrawingAlpha.value}get tool(){return this.cbTools.value}get eraser(){return this.cbEraser.value}set scale(t){this.scale!==t&&(this.slScale.value=t,this.onScaleChange.fire(this.slScale.value),this.updateScrollRange())}set angle(t){this.angle!==t&&(this.slAngle.value=t,this.onAngleChange.fire(this.slAngle.value))}set scrollX(t){this.slX.value!==t&&(this.slX.value=t,this.onScrollChange.fire(new g(this.slX.value,this.slY.value)))}set scrollY(t){this.slY.value!==t&&(this.slY.value=t,this.onScrollChange.fire(new g(this.slX.value,this.slY.value)))}set penCount(t){z(this.penCount,t)||(this.slPenCount1.value=t[0],this.slPenCount2.value=t[1],this.onPenCountChange.fire([this.slPenCount1.value,this.slPenCount2.value]))}set penWidth(t){this.penWidth!==t&&(this.slPenWidth.value=t,this.onPenWidthChange.fire(this.slPenWidth.value))}set kaleidoscope(t){z(this.kaleidoscope,t)||(this.cbKaleido1.value=t[0],this.cbKaleido2.value=t[1],this.onKaleidoChange.fire([this.cbKaleido1.value,this.cbKaleido2.value]))}set drawingColor(t){this.drawingColor!==t&&(this.csDrawingColor.value=t,this.onDrawingColorChange.fire(this.csDrawingColor.value))}set canvasColor(t){this.canvasColor!==t&&(this.csCanvasColor.value=t,this.onCanvasColorChange.fire(this.csCanvasColor.value))}set drawingAlpa(t){this.drawingAlpa!==t&&(this.slDrawingAlpha.value=t,this.onDrawingAlphaChange.fire(this.slDrawingAlpha.value))}set tool(t){this.cbTools.value=t}set eraser(t){this.cbEraser.value=t}penCountUp(){const[t,n]=this.penCount;this.penCount=[t+1,n]}penCountDown(){const[t,n]=this.penCount;t<=1||(this.penCount=[t-1,n])}updateScrollRange(){const t=this.canvasWidth/2*this.scale,n=this.canvasHeight/2*this.scale;this.slX.elSlider.min=String(-t),this.slX.elSlider.max=String(t),this.slY.elSlider.min=String(-n),this.slY.elSlider.max=String(n)}}const U=document.querySelector("#main"),vt=document.querySelector("#palette"),J=document.querySelector("#toast"),H=new g(U.offsetWidth,U.offsetHeight),ne=e=>{J.textContent=e,J.classList.add("visible"),setTimeout(()=>{J.classList.remove("visible")},5e3)},v=new ee(vt,{width:H.x,height:H.y}),p=new Jt(U,H.x,H.y);v.onScaleChange.listen(e=>{p.coord=p.coord.clone({scale:e})});v.onAngleChange.listen(e=>{p.coord=p.coord.clone({angle:e})});v.onScrollChange.listen(e=>{p.coord=p.coord.clone({scroll:e})});v.onPenCountChange.listen(e=>{p.penCount=e});v.onPenWidthChange.listen(e=>{p.penWidth=e});v.onClear.listen(()=>{p.clear()});v.onUndo.listen(()=>{p.undo()});const se=async()=>{let e;try{e=new ClipboardItem({"image/png":p.toImgBlob()})}catch{e=new ClipboardItem({"image/png":await p.toImgBlob()})}await navigator.clipboard.write([e])};v.onCopy.listen(()=>{se().catch(e=>{console.error(e),alert("failed to copy img.")})});v.onKaleidoChange.listen(e=>{p.isKaleido=e});v.onEraserChange.listen(e=>{p.penKind=e?"eraser":"normal"});v.onDrawingColorChange.listen(e=>{p.penColor=e});v.onCanvasColorChange.listen(e=>{p.backgroundColor=e});v.onDrawingAlphaChange.listen(e=>{p.penAlpha=e});v.onToolChange.listen(e=>{if(p.tool=e,e==="draw:stamp"&&!p.stamp){const t={ja:"\u30B9\u30BF\u30F3\u30D7\u3092\u4F7F\u7528\u3059\u308B\u306B\u306F\u3001\u5148\u306BCommand(Ctrl)\u3092\u62BC\u3057\u306A\u304C\u3089\u7DDA\u3092\u5F15\u3044\u3066\u30B9\u30BF\u30F3\u30D7\u3092\u8A18\u9332\u3057\u307E\u3059",en:"Before using stamp, draw with Command(Ctrl) key for record a stroke."}[wt];ne(t)}});p.coord=p.coord.clone({scroll:v.scroll,scale:v.scale,angle:v.angle});p.listenRequestZoom(e=>{p.coord=p.coord.clone({scale:e})});p.listenRequestScrollTo(({point:e,target:t})=>{t==="canvas"&&(p.coord=p.coord.clone({scroll:e})),t==="anchor"&&(p.activeAnchor=p.activeAnchor.clone({scroll:e}))});p.listenRequestRotateTo(({angle:e,target:t})=>{t==="canvas"&&(p.coord=p.coord.clone({angle:e})),t==="anchor"&&(p.activeAnchor=p.activeAnchor.clone({angle:e}))});p.listenRequestUndo(()=>{p.undo()});p.listenRequestAnchorTransform(e=>{p.activeAnchor=e});p.listenRequestAnchorReset(()=>{p.anchor=new E});window.addEventListener("keydown",e=>{e.key==="ArrowUp"&&v.penCountUp(),e.key==="ArrowDown"&&v.penCountDown(),e.key==="z"&&e.metaKey&&v.onUndo.fire(),e.key==="c"&&e.metaKey&&v.onCopy.fire()});const oe=new Ut;oe.listenChange(e=>v.tool=e);v.kaleidoscope=[!0,!0];v.penCount=[6,6];v.canvasColor="#ffffff";U.addEventListener("touchmove",function(e){e.preventDefault()},{passive:!1});vt.addEventListener("touchmove",function(e){e.touches.length>=2&&e.preventDefault()},{passive:!1});const wt=navigator.language==="ja"?"ja":"en";document.querySelectorAll(".lang").forEach(e=>e.style.display="none");document.querySelectorAll(`.lang.${wt}`).forEach(e=>e.style.display="");
