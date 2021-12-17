var ft=Object.defineProperty;var j=Object.getOwnPropertySymbols;var Ct=Object.prototype.hasOwnProperty,mt=Object.prototype.propertyIsEnumerable;var X=(s,t,e)=>t in s?ft(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e,R=(s,t)=>{for(var e in t||(t={}))Ct.call(t,e)&&X(s,e,t[e]);if(j)for(var e of j(t))mt.call(t,e)&&X(s,e,t[e]);return s};var r=(s,t,e)=>(X(s,typeof t!="symbol"?t+"":t,e),e);import{d as W}from"./vendor.1c606baf.js";const wt=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function e(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerpolicy&&(i.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?i.credentials="include":o.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=e(o);fetch(o.href,i)}};wt();class u{constructor(t=0,e=0){r(this,"x");r(this,"y");this.x=t,this.y=e}equals(t){return this.x===t.x&&this.y===t.y}move(t){return new u(this.x+t.x,this.y+t.y)}sub(t){return new u(this.x-t.x,this.y-t.y)}get angle(){return Math.atan2(this.y,this.x)/Math.PI*180}get length(){return Math.sqrt(this.x**2+this.y**2)}rotate(t){const e=t/180*Math.PI,n=Math.cos(e),o=Math.sin(e),i=this.x*n-this.y*o,l=this.x*o+this.y*n;return new u(i,l)}scale(t){return new u(this.x*t,this.y*t)}get invert(){return this.scale(-1)}}const V=s=>new u(s.x,s.y);class m{constructor(t){r(this,"scroll");r(this,"scale");r(this,"angle");r(this,"flipY");r(this,"_matrix");var e,n,o,i;this.scroll=(e=t==null?void 0:t.scroll)!=null?e:new u,this.scale=(n=t==null?void 0:t.scale)!=null?n:1,this.angle=(o=t==null?void 0:t.angle)!=null?o:0,this.flipY=(i=t==null?void 0:t.flipY)!=null?i:!1,this._matrix=new DOMMatrix().translateSelf(this.scroll.x,this.scroll.y).scaleSelf(this.scale,this.scale*(this.flipY?-1:1)).rotateSelf(this.angle)}toData(){return{scroll:this.scroll,scale:this.scale,angle:this.angle,flipY:this.flipY}}clone(t){const e=this.toData();return new m(R(R({},e),t))}get invert(){return new m({scroll:this.scroll.scale(-1),scale:1/this.scale,angle:-this.angle})}get matrix(){return this._matrix.translate(0)}get matrixScrollAfter(){return new DOMMatrix().scaleSelf(this.scale,this.scale*(this.flipY?-1:1)).rotateSelf(this.angle).translateSelf(this.scroll.x,this.scroll.y)}}class O{constructor(t,e){r(this,"el");r(this,"ctx");r(this,"width");r(this,"height");r(this,"_coord");const n=document.createElement("canvas"),o=n.getContext("2d");if(!o)throw new Error("Failed to get 2d context for canvas");this.width=t,this.height=e,n.width=t,n.height=e,o.lineCap="round",this.el=n,this.ctx=o,this._coord=new m}get centor(){return new u(this.width/2,this.height/2)}set coord(t){const e=this.centor;this._coord=t,this.ctx.resetTransform(),this.ctx.translate(e.x,e.y),this.ctx.translate(t.scroll.x,t.scroll.y),this.ctx.rotate(-t.angle/180*Math.PI),this.ctx.scale(1/t.scale,1/t.scale)}get coord(){return this._coord}output(t,e){const n=this.centor;t.save();const o=this.coord;t.resetTransform(),t.translate(n.x,n.y),t.scale(o.scale,o.scale),t.rotate(o.angle/180*Math.PI),t.translate(-o.scroll.x,-o.scroll.y),t.translate(-n.x,-n.y),this.transferImageTo(t,e),t.restore()}copy(t,e){t.save(),t.resetTransform(),this.transferImageTo(t,e),t.restore()}transferImageTo(t,e){var n,o;t.globalAlpha=(n=e==null?void 0:e.alpha)!=null?n:1,t.globalCompositeOperation=(o=e==null?void 0:e.composition)!=null?o:"source-over",(e==null?void 0:e.background)&&(t.fillStyle=e.background,t.fillRect(0,0,this.width,this.height)),t.drawImage(this.el,0,0)}}class v{constructor(){r(this,"listeners",[])}fire(t){this.listeners.forEach(e=>e(t))}listen(t){this.listeners.includes(t)||this.listeners.push(t)}clear(){this.listeners.length=0}}const J=s=>{const t=s>=0?s%360:360+s%360;return t<=180?t:-360+t},Q=s=>s/180*Math.PI,L=s=>{s.ctx.save(),s.ctx.resetTransform(),s.ctx.clearRect(0,0,s.width,s.height),s.ctx.restore()},St=(s,t)=>{s.ctx.save(),s.ctx.resetTransform(),s.ctx.fillStyle=t,s.ctx.fillRect(0,0,s.width,s.height),s.ctx.restore()},tt=(s,t,e,n,o="#91bccc")=>{const i=o,l=`${o}88`,h=new u(s.width/2,s.height/2).move(n.scroll),d=Math.sqrt(s.width**2+s.height**2);s.ctx.save(),s.ctx.resetTransform(),s.ctx.translate(h.x,h.y),s.ctx.rotate(Q(n.angle)),s.ctx.lineWidth=1,s.ctx.rotate(Q(-90+360/t/2));for(let p=0;p<t;p++){const C=e&&p%2!=0;s.ctx.strokeStyle=C?l:i,s.ctx.setLineDash(C?[4,4]:[]),s.ctx.beginPath(),s.ctx.moveTo(0,0),s.ctx.lineTo(0,d),s.ctx.stroke(),s.ctx.closePath(),s.ctx.rotate(360/t/180*Math.PI)}s.ctx.restore()};class et{constructor(t=10){r(this,"maxItems");r(this,"items",[]);r(this,"onOverflow",new v);this.maxItems=t}get length(){return this.items.length}clear(){this.items.length=0}push(t){if(this.items.push(t),this.items.length<=this.maxItems)return;const e=this.items.shift();e&&this.onOverflow.fire(e)}pop(){return this.items.pop()}peek(t=0){return this.items[this.items.length-1+t]}getItems(){return[...this.items]}listenOverflow(...t){this.onOverflow.listen(...t)}}const yt=s=>Math.max(.1,1-Math.pow(1-s,2)),Pt=s=>{const[t,...e]=s,n=`M${t.x}, ${t.y} L`+e.map(i=>isNaN(i.x+i.y)?"":`${i.x}, ${i.y}`).join(" ")+"";return new Path2D(n)},st=s=>{if(s.length<=2)return[s];for(let t=2;t<s.length;t++){const e=s[t-2],n=s[t-1],o=s[t-0],i=n.point.sub(e.point).angle,l=o.point.sub(n.point).angle,a=Math.abs(i-l);if(Math.abs(a-180)<30)return[s.slice(0,t),...st(s.slice(t-1))]}return[s]},xt=(s,t)=>{const e=s.map(i=>({x:i.point.x,y:i.point.y,w:Math.max(1,yt(i.pressure)*t)})),n=W.exports.smooth(e,3),o=[];for(let i=0;i<n.length;i+=1){const{left:l,right:a}=W.exports.computeSidePoints(n[i],n[i-1]||n[i+1]),h=o.slice(i)[0];let d=!1;if(h){const p=W.exports.vector2.length(h,l),C=W.exports.vector2.length(h,a);d=p-C>0}h&&d?o.splice(i,0,l,a):o.splice(i,0,a,l)}return Pt(o)},nt=(s,t,e)=>{const o=t.flatMap(st).map(i=>xt(i,s.lineWidth));e.forEach(i=>{o.forEach(l=>{const a=new Path2D;a.addPath(l,i),s.fill(a)})})};class _{constructor(){r(this,"_coord",new m);r(this,"children",[])}get coord(){return this._coord}set coord(t){this._coord=this._coord.clone(t)}get childCount(){return this.children.length}get state(){return{coord:this.coord,children:this.children.map(t=>t.state)}}set state(t){for(this.coord=t.coord,this.children.length>t.children.length&&(this.children.length=t.children.length);this.children.length<t.children.length;)this.addChildPen();t.children.forEach((e,n)=>{this.children[n].state=e})}get leafs(){return this.childCount?this.children.flatMap(t=>t.leafs):[this]}childAt(t){return this.children[t]}matrices(t){const e=t.multiply(this.coord.matrix);return this.childCount?this.children.flatMap(n=>n.matrices(e)):[e]}matricesBasedFirstPen(t){const e=this.matrices(t),n=e[0].inverse();return e.map(o=>o.multiply(n))}addChildPen(t){const e=new _;return t&&(e.coord=t),this.children.push(e),e}clearChildren(){this.children.length=0}drawStrokes(t,e){const n=this.matricesBasedFirstPen(new DOMMatrix);nt(t.ctx,e,n)}drawLines(t,e,n=.5){if(e.length<2)return;const o=t.ctx,i=e.map(a=>({point:a,pressure:n})),l=this.matricesBasedFirstPen(new DOMMatrix);nt(o,[i],l)}dryRun(t){const e=this.matrices(new DOMMatrix),n=e[0].inverse();return e.map(o=>t.map(i=>{const l=n.transformPoint(i.point);return{point:V(o.transformPoint(l)),pressure:i.pressure}}))}}const ot=s=>{const t=s.findIndex((l,a)=>a>0&&l.pressure===0);if(t===-1)return[s];const e=s.slice(0,t),n=s.slice(t),o=!(e.length===1&&e[0].pressure===0),i=!(n.length===1&&n[0].pressure===0);return[...o?[e]:[],...i?ot(n):[]]},it=(s,t)=>{s.ctx.strokeStyle=t.style.color,s.ctx.lineWidth=t.style.penSize;const e=new _;e.state=t.penState,e.drawStrokes(s,ot(t.inputs))},kt=s=>{L(s)},bt=(s,t,e)=>{e.forEach(n=>{n.tool==="pen"&&(L(t),it(t,n),t.copy(s.ctx,{alpha:n.style.alpha,composition:n.style.composition})),n.tool==="clearAll"&&kt(s)}),L(t)},Et=s=>s.flatMap(t=>{if(!t.length)return t;const e=t[0],n=t[t.length-1];return[{point:e.point,pressure:0},...t,{point:n.point,pressure:0}]});class B{constructor(t,e,n,o="pen"){r(this,"inputs",[]);r(this,"penState");r(this,"style");r(this,"canvasCoord");r(this,"tool");this.canvasCoord=t,this.penState=e,this.style=n,this.tool=o}addPoint(t,e){this.inputs.push({point:t,pressure:e})}clearPoints(t=!1,e=!1){const n=t?this.inputs.shift():void 0,o=e?this.inputs.pop():void 0;this.inputs.length=0,n&&this.inputs.push(n),o&&this.inputs.push(o)}get flatten(){const t=new _;t.state=this.penState;const e=t.dryRun(this.inputs),n=V(this.canvasCoord.matrixScrollAfter.transformPoint(t.coord.scroll)).invert,o=Et(e).map(l=>({point:l.point.move(n),pressure:l.pressure}));t.clearChildren(),t.coord=new m;const i=new B(this.canvasCoord,t.state,this.style,this.tool);return i.inputs.push(...o),i}}const At=110,N=10;class Tt{constructor(t,e){r(this,"canvasWidth");r(this,"canvasHeight");r(this,"history",new et(1/0));r(this,"snapshots",new et(At/N));r(this,"currentStroke");r(this,"lastSnapshotIndex",0);r(this,"oldestSnapshotIndex",0);this.canvasWidth=t,this.canvasHeight=e,this.snapshots.listenOverflow(()=>{this.oldestSnapshotIndex+=N,console.log(`oldestSnapshotIndex: ${this.oldestSnapshotIndex}`)})}get strokes(){return this.history.peek()}get snapshot(){return this.snapshots.peek()}get prevSnapshot(){return this.snapshots.peek(-1)}get lastHistories(){return this.history.getItems().slice(this.lastSnapshotIndex)}addSnapshot(){const t=new O(this.canvasWidth,this.canvasHeight);this.snapshots.push(t);const e=this.prevSnapshot;e&&t.ctx.drawImage(e.el,0,0);const n=document.querySelector("#debug .history .snaps");if(n){const o=120/Math.max(t.el.width,t.el.height);t.el.style.width=`${t.el.width*o}px`,t.el.style.height=`${t.el.height*o}px`,n.appendChild(t.el),t.el.scrollIntoView()}this.lastSnapshotIndex=this.history.length-1}start(t,e,n,o){const i=new B(t,e,n,o);return this.currentStroke=i,i}commit(t){if(!this.currentStroke)return;if(this.history.push(this.currentStroke),this.history.length-this.lastSnapshotIndex-1===N){if(this.addSnapshot(),!this.snapshot){console.error("failed to add snapshot");return}t.copy(this.snapshot.ctx,{alpha:this.currentStroke.style.alpha}),console.log("new snapshot",this.snapshots.length)}this.currentStroke=void 0}rollback(){!this.currentStroke||(console.log("stroke rollbacked"),this.currentStroke=void 0)}get current(){return this.currentStroke}get undoable(){return this.history.length>this.oldestSnapshotIndex}undo(t,e){var o;if(!this.undoable)return console.log("no more history"),!1;t.ctx.save();const n=this.snapshot;if(n?(t.ctx.resetTransform(),t.ctx.drawImage(n.el,0,0)):console.log("no prev"),this.history.pop(),bt(t,e,this.lastHistories),!this.lastHistories.length&&this.snapshots.length>=1){const i=this.snapshots.pop();i&&((o=i.el.parentNode)==null||o.removeChild(i.el)),this.lastSnapshotIndex-=N,console.log("back prev snap",this.snapshots.length,this.snapshots)}return t.ctx.restore(),!0}}const Lt=s=>{if(!s.length)return 0;const t=Math.floor(s.length*.9);return s[t].pressure};class ${constructor(t){r(this,"color");r(this,"penSize");r(this,"alpha");r(this,"composition");var e,n,o,i;this.color=(e=t==null?void 0:t.color)!=null?e:"#000000",this.penSize=(n=t==null?void 0:t.penSize)!=null?n:10,this.alpha=(o=t==null?void 0:t.alpha)!=null?o:1,this.composition=(i=t==null?void 0:t.composition)!=null?i:""}toData(){return{color:this.color,penSize:this.penSize,alpha:this.alpha,composition:this.composition}}clone(t){return new $(R(R({},this.toData()),t))}}const Mt=s=>{var t;return(t={draw:"crosshair",scroll:"move","scroll:anchor":"move",zoomup:"zoom-in",zoomdown:"zoom-out",rotate:"grab","rotate:anchor":"grab","draw:line":"crosshair","draw:stamp":"crosshair"}[s])!=null?t:"default"},_t=(s,t)=>{const e=s.getBoundingClientRect();return new u(e.left,e.top).move(t!=null?t:new u(e.width/2,e.height/2))},It=(s,t,e)=>{const n=t.sub(s).angle;return e.sub(s).angle-n},rt=(s,t,e)=>({distance:e.sub(t),angle:It(s,t,e)}),Dt=(s,t,e,n,o,i=1,l=60)=>{const a={startPoint:new u,lastRawPoint:new u,isWatchMove:!1,lastMs:Date.now()},h=()=>_t(s,o==null?void 0:o()),d=f=>{!f.isPrimary||(a.startPoint=a.lastRawPoint=new u(f.clientX,f.clientY),a.isWatchMove=t(f))},p=f=>{if(!f.isPrimary||!a.isWatchMove)return;const P=new u(f.clientX,f.clientY),E=P.sub(a.lastRawPoint).length,k=Date.now(),A=1e3/(k-a.lastMs);E<i||A>l||E/i*(l/A)<3||(e(f,rt(h(),a.startPoint,P)),a.lastRawPoint=P,a.lastMs=k)},C=f=>{if(!f.isPrimary||!a.isWatchMove)return;const P=new u(f.clientX,f.clientY);n(f,rt(h(),a.startPoint,P)),a.isWatchMove=!1};return s.addEventListener("pointerdown",d),s.addEventListener("pointermove",p),s.addEventListener("pointerup",C),()=>{s.removeEventListener("pointerdown",d),s.removeEventListener("pointermove",p),s.removeEventListener("pointerup",C)}},Rt=200,Kt=300,qt=10,at=s=>{const[t,e]=s,n=new u((t.x+e.x)/2,(t.y+e.y)/2),o=t.sub(n).angle,i=e.sub(t).length;return{center:n,angle:o,dist:i}},Wt=s=>{const[t,e]=s;return{scroll:e.center.sub(t.center),angle:J(e.angle-t.angle),scale:e.dist/t.dist,center:e.center}},H=s=>{const t=[];for(let e=0;e<s.length;e++)t.push(s[e]);return t},Ot=(s,t,e=1)=>{let n=[],o,i=0,l=!1,a=0,h=0;const d=()=>{i=Date.now(),l=!1,a=0,h=0},p=()=>Date.now()-i<=Rt,C=()=>{if(!(n.length<2))return[n[0].pagePoint,n[1].pagePoint]},b=y=>{const x=H(y).map(w=>w.identifier);n=n.filter(w=>!x.includes(w.identifier))},f=y=>{b(y);const x=H(y).map(w=>({identifier:w.identifier,pagePoint:new u(w.clientX,w.clientY)}));n=[...n,...x]},P=y=>{const x=H(y);let w=!1;return x.forEach(T=>{const D=n.find(q=>q.identifier===T.identifier);if(!D)return;const K=new u(T.clientX,T.clientY);D.pagePoint.sub(K).length<=e||(D.pagePoint=K,w=!0)}),w},E=y=>{var w;const x=n.length;f(y.changedTouches),x===0&&d(),x<=1&&n.length>=2&&p()&&(l=!0,o=C(),(w=t.onStart)==null||w.call(t)),a=Math.max(a,n.length)},k=y=>{var x,w,T;b(y.changedTouches),n.length<=1&&l&&(l=!1,o=void 0,(x=t.onEnd)==null||x.call(t),Date.now()-i<Kt&&h<=qt&&(a===2&&((w=t.onTwoFingerTap)==null||w.call(t)),a===3&&((T=t.onThreeFingerTap)==null||T.call(t))))},A=y=>{var T;if(!l||!P(y.changedTouches))return;const w=C();if(o&&w){const[D,K]=[at(o),at(w)],q=Wt([D,K]);h=Math.max(h,q.scroll.length),(T=t.onTransform)==null||T.call(t,q,a)}};return s.addEventListener("touchstart",E),s.addEventListener("touchend",k),s.addEventListener("touchcancel",k),s.addEventListener("touchmove",A),()=>{s.removeEventListener("touchstart",E),s.removeEventListener("touchend",k),s.removeEventListener("touchcancel",k),s.removeEventListener("touchmove",A)}},lt=.2,ht=4,ct=[0,lt,.33,.5,.67,.75,1,1.5,2,2.5,3,3.5,ht,1/0],ut=(s,t)=>{var i;const e=t?ct:[...ct].reverse(),n=e.findIndex(l=>t?l>s:l<s),o=(i=e[n])!=null?i:0;return Math.max(lt,Math.min(ht,o))},Y=(s,t)=>{if(s.length!==t.length)return!1;for(let e=0;e<s.length;e++)if(s[e]!==t[e])return!1;return!0},S=2,dt=3.5,Bt={normal:"",eraser:"destination-out"};class Nt{constructor(t,e,n){r(this,"width");r(this,"height");r(this,"canvas");r(this,"strokeCanvas");r(this,"view");r(this,"eventStatus",{isUseStrokeCanvas:!1,activeEvent:void 0,startCoord:new m,startAnchor:[new m,new m],startPoint:new u,lastPoint:new u,isCapturing:!1,isInMultiTouch:!1});r(this,"history");r(this,"requestChangeZoom",new v);r(this,"requestScrollTo",new v);r(this,"requestRotateTo",new v);r(this,"requestUndo",new v);r(this,"requestAnchorTransform",new v);r(this,"requestAnchorReset",new v);r(this,"pen",new _);r(this,"style",new $);r(this,"stamp");r(this,"_tool","draw");r(this,"_backgroundColor","#ffffff");r(this,"_anchor",new m);r(this,"_anchorChild",new m);r(this,"_penCount",[1,0]);r(this,"_isKaleido",[!1,!1]);r(this,"view2canvasPos",(t,e)=>{const n=e==="start"?this.eventStatus.startCoord:this.coord;return t.scale(1/n.scale).rotate(-n.angle).move(n.scroll)});r(this,"canvas2viewPos",(t,e)=>{const n=e==="start"?this.eventStatus.startCoord:this.coord;return t.move(n.scroll.invert).rotate(n.angle).scale(n.scale)});r(this,"canvas2displayPos",(t,e)=>this.canvas2viewPos(t,e).move(new u(this.width,this.height)).scale(1/S));var i,l;this.width=e,this.height=n,this.canvas=new O(this.width*S,this.height*S),this.strokeCanvas=new O(this.width*S,this.height*S),this.view=new O(this.width*S,this.height*S),this.history=new Tt(this.width*S,this.height*S),this.view.el.style.width=`${e}px`,this.view.el.style.height=`${n}px`,t.appendChild(this.view.el);const o=document.getElementById("debug");if(o){const a=200/Math.max(e,n);this.canvas.el.style.width=`${e*a}px`,this.canvas.el.style.height=`${n*a}px`,this.strokeCanvas.el.style.width=`${e*a}px`,this.strokeCanvas.el.style.height=`${n*a}px`,(i=o.querySelector(".canvas"))==null||i.appendChild(this.canvas.el),(l=o.querySelector(".stroke"))==null||l.appendChild(this.strokeCanvas.el)}Ot(this.view.el,{onStart:()=>{this.endStroke(!1),this.eventStatus.isInMultiTouch=!0},onTransform:(a,h)=>h>=3?this.onTouchTramsformAnchor(a):this.onTouchTramsformCanvas(a),onEnd:()=>{this.eventStatus.isInMultiTouch=!1},onTwoFingerTap:()=>this.requestUndo.fire(),onThreeFingerTap:()=>this.requestAnchorReset.fire()},dt),Dt(this.view.el,a=>!this.eventStatus.isInMultiTouch&&this.onDown(a),(a,h)=>!this.eventStatus.isInMultiTouch&&this.onDrag(a,h),(a,h)=>!this.eventStatus.isInMultiTouch&&this.onUp(a,h),()=>this.tool==="scroll:anchor"||this.tool==="rotate:anchor"?this.canvas2displayPos(this.activeAnchor.scroll,"start"):void 0,dt),this.childAnchor=new m({scroll:new u(300,0),angle:0}),this.tool="draw",this.clear(!1)}get coord(){return this.canvas.coord}set coord(t){this.canvas.coord=t.clone({}),this.rePaint()}get tool(){return this._tool}set tool(t){this._tool=t,this.view.el.style.cursor=Mt(t)}get isKaleido(){return[...this._isKaleido]}set isKaleido(t){Y(this.isKaleido,t)||(this._isKaleido=[...t],this.rebuildPen(),this.rePaint())}get penCount(){return this._penCount}set penCount(t){Y(this.penCount,t)||(this._penCount=[...t],this.rebuildPen(),this.rePaint())}get hasSubPen(){return this.penCount[1]>=1}set penWidth(t){this.style=this.style.clone({penSize:t})}set penColor(t){this.style=this.style.clone({color:t})}set penAlpha(t){this.style=this.style.clone({alpha:t})}get penKind(){return this.style.composition===""?"normal":"eraser"}set penKind(t){this.style=this.style.clone({composition:Bt[t]})}get hasStamp(){return!!this.stamp}get backgroundColor(){return this._backgroundColor}set backgroundColor(t){this._backgroundColor!==t&&(this._backgroundColor=t,this.rePaint())}get anchor(){return this._anchor}set anchor(t){this._anchor=t,this.rebuildPen(),this.rePaint()}get childAnchor(){return this._anchorChild}set childAnchor(t){this._anchorChild=t,this.rebuildPen(),this.rePaint()}get activeAnchor(){return this.hasSubPen?this.childAnchor:this.anchor}set activeAnchor(t){this[this.hasSubPen?"childAnchor":"anchor"]=t}get relativeChildAnchor(){return new m({scroll:this.childAnchor.scroll.sub(this.anchor.scroll).rotate(-this.anchor.angle),angle:this.childAnchor.angle})}rebuildPen(){const t=this.pen,[e,n]=this.isKaleido,[o,i]=[this.penCount[0]*(e?2:1),this.penCount[1]*(n?2:1)],l=this.relativeChildAnchor;t.clearChildren(),t.coord=this._anchor;for(let a=0;a<o;a++){const h=this._isKaleido[0]&&a%2!=0,d=t.addChildPen(new m({angle:a/o*360,flipY:h}));for(let p=0;p<i;p++){const C=this._isKaleido[1]&&p%2!=0;d.addChildPen(new m({scroll:l.scroll,angle:l.angle})).addChildPen(new m({angle:p/i*360,flipY:C}))}}}listenRequestZoom(...t){this.requestChangeZoom.listen(...t)}listenRequestScrollTo(...t){this.requestScrollTo.listen(...t)}listenRequestRotateTo(...t){this.requestRotateTo.listen(...t)}listenRequestUndo(...t){this.requestUndo.listen(...t)}listenRequestAnchorTransform(...t){this.requestAnchorTransform.listen(...t)}listenRequestAnchorReset(...t){this.requestAnchorReset.listen(...t)}clear(t=!0){t&&(this.history.start(this.coord,this.pen.state,this.style,"clearAll"),this.history.commit(this.canvas)),L(this.canvas),this.rePaint()}undo(){!this.history.undoable||(this.clear(!1),this.history.undo(this.canvas,this.strokeCanvas),this.rePaint())}async toImgBlob(){return new Promise((t,e)=>{this.canvas.el.toBlob(n=>n?t(n):e())})}event2viewPoint(t){return new u((t.offsetX-this.width/2)*S,(t.offsetY-this.height/2)*S)}onDown(t){const e=this.tool;if(this.eventStatus.activeEvent=e,this.eventStatus.startCoord=this.coord,this.eventStatus.startAnchor=[this.anchor,this.childAnchor],this.eventStatus.lastPoint=this.eventStatus.startPoint=this.event2viewPoint(t),this.eventStatus.isCapturing=t.metaKey,e==="zoomup"||e==="zoomdown"){const n=this.coord.scale;return e==="zoomup"&&this.requestChangeZoom.fire(ut(n,!0)),e==="zoomdown"&&this.requestChangeZoom.fire(ut(n,!1)),!1}return(e==="draw"||e==="draw:line"||e==="draw:stamp")&&this.startStroke(this.eventStatus.startPoint),!0}onDrag(t,e){const n=this.eventStatus.activeEvent,i={point:this.event2viewPoint(t),pressure:t.pressure};if((n==="draw"||n==="draw:line")&&(this.continueStroke(i.point,i.pressure||.5),this.eventStatus.lastPoint=i.point),n==="draw:stamp"&&this.stamp){const l=i.point.sub(this.eventStatus.startPoint),a=l.length/100;this.putStroke(this.stamp,this.eventStatus.startPoint,a,l.angle,!0)}n==="scroll"&&this.onScroll(e,"canvas"),n==="scroll:anchor"&&this.onScroll(e,"anchor"),n==="rotate"&&this.onRotate(e,"canvas"),n==="rotate:anchor"&&this.onRotate(e,"anchor"),t.preventDefault()}onUp(t,e){var l;const n=this.eventStatus.activeEvent,o=this.event2viewPoint(t),i=n==="draw"||n==="draw:line"||n==="draw:stamp";if(n==="draw"&&this.continueStroke(o,t.pressure||0),n==="draw:line"){L(this.strokeCanvas);const a=this.history.current,h=this.history.current?Lt(this.history.current.inputs):.5;if(this.continueStroke(o,h),a){a.inputs.length=1,a.inputs[0].pressure=h;const d={point:o,pressure:h};a.inputs.push(d,d)}}if(n==="draw:stamp"&&this.stamp){L(this.strokeCanvas);const a=o.sub(this.eventStatus.startPoint),h=a.length/100;this.putStroke(this.stamp,this.eventStatus.startPoint,h,a.angle,!1)}if((n==="draw"||n==="draw:line")&&this.eventStatus.isCapturing){this.stamp=(l=this.history.current)==null?void 0:l.flatten,this.endStroke(!1),this.rePaint();return}n==="scroll"&&this.onScroll(e,"canvas"),n==="scroll:anchor"&&this.onScroll(e,"anchor"),n==="rotate"&&this.onRotate(e,"canvas"),n==="rotate:anchor"&&this.onRotate(e,"anchor"),this.endStroke(i)}startStroke(t){var o;const e=this.view2canvasPos(t,"start");this.eventStatus.isUseStrokeCanvas=!0,this.strokeCanvas.coord=new m,this.strokeCanvas.ctx.lineWidth=this.style.penSize;const n=()=>this.eventStatus.isCapturing?"#0044aa":this.penKind==="eraser"?this.backgroundColor:this.style.color;this.strokeCanvas.ctx.fillStyle=n(),this.history.start(this.coord,this.pen.state,this.style),(o=this.history.current)==null||o.addPoint(e,0)}continueStroke(t,e=.5){const n=this.eventStatus.activeEvent,o=this.view2canvasPos(t,"start"),i=this.history.current;if(!!i){if(i.addPoint(o,e),L(this.strokeCanvas),n==="draw:line"){const l={point:i.inputs[0].point,pressure:e},a=i.inputs[i.inputs.length-1],h=[l,a,a];this.pen.drawStrokes(this.strokeCanvas,[h])}else this.pen.drawStrokes(this.strokeCanvas,[i.inputs]);this.rePaint()}}endStroke(t){t?(this.history.commit(this.canvas),this.strokeCanvas.copy(this.canvas.ctx,{alpha:this.style.alpha,composition:this.style.composition}),L(this.strokeCanvas)):(this.history.rollback(),L(this.strokeCanvas)),this.eventStatus.isUseStrokeCanvas=!1,this.eventStatus.activeEvent=void 0,this.rePaint()}onScroll(t,e){const n=this.hasSubPen?1:0,i={canvas:this.eventStatus.startCoord,anchor:this.eventStatus.startAnchor[n]}[e].scroll.move(t.distance.scale(-1/this.coord.scale*S).rotate(-this.coord.angle).scale(e==="anchor"?-1:1));this.requestScrollTo.fire({point:i,target:e})}onRotate(t,e){const n=this.hasSubPen?1:0,i={canvas:this.eventStatus.startCoord,anchor:this.eventStatus.startAnchor[n]}[e].angle+t.angle;this.requestRotateTo.fire({angle:J(i),target:e})}onTouchTramsformCanvas(t){const e=this.eventStatus.startCoord,{center:n,scroll:o,scale:i,angle:l}=t,a=A=>A.rotate(-e.angle).scale(1/e.scale),h=new u((n.x-this.width/2)*S,(n.y-this.height/2)*S),d=this.view2canvasPos(h,"start"),p=new u(0,0),C=this.view2canvasPos(p,"start"),b=d.sub(C),P=b.rotate(-l).scale(1/i).sub(b),E=o.scale(S),k=a(E);this.requestRotateTo.fire({angle:e.angle+l,target:"canvas"}),this.requestChangeZoom.fire(e.scale*i),this.requestScrollTo.fire({point:e.scroll.sub(P).sub(k),target:"canvas"})}onTouchTramsformAnchor(t){const e=this.eventStatus.startAnchor[this.hasSubPen?1:0],n=t.angle+e.angle,o=t.scroll.scale(1/this.eventStatus.startCoord.scale*S).rotate(-this.eventStatus.startCoord.angle).move(e.scroll);this.requestAnchorTransform.fire(e.clone({scroll:o,angle:n}))}putStroke(t,e,n,o,i){const l=new _;l.state=this.pen.state;const a=this.style.clone({color:this.penKind==="eraser"?this.backgroundColor:this.style.color}),h=e,d=new B(this.coord,l.state,i?a:this.style,t.tool),p=t.inputs.map(b=>({point:b.point.scale(n).rotate(o).move(h),pressure:b.pressure}));d.inputs.push(...p),it(this.strokeCanvas,d),this.rePaint();const C=this.history.current;!i&&C&&(C.clearPoints(),C.inputs.push(...d.inputs))}rePaint(){St(this.view,"#cccccc"),this.canvas.output(this.view.ctx,{background:this.backgroundColor}),this.eventStatus.isUseStrokeCanvas&&(this.strokeCanvas.ctx.save(),this.strokeCanvas.coord=this.canvas.coord,this.strokeCanvas.output(this.view.ctx,{alpha:this.style.alpha}),this.strokeCanvas.ctx.restore());const[t,e]=this.penCount,[n,o]=[t>=2,e>=2];n&&tt(this.view,t*(this.isKaleido[0]?2:1),this.isKaleido[0],new m({scroll:this.coord.scroll.invert.move(this.anchor.scroll).scale(this.canvas.coord.scale).rotate(this.coord.angle),angle:this.coord.angle+this.anchor.angle}),o?"#cccccc":void 0),o&&tt(this.view,e*(this.isKaleido[1]?2:1),this.isKaleido[1],new m({scroll:this.coord.scroll.invert.move(this.childAnchor.scroll).scale(this.canvas.coord.scale).rotate(this.coord.angle),angle:this.coord.angle+this.anchor.angle+this.childAnchor.angle}),"#eeaabb")}}class Z{constructor(t){r(this,"el");const e=this.el=document.createElement("button");e.className="Button",e.textContent=t}addEventListener(...t){return this.el.addEventListener(...t)}removeEventListener(...t){return this.el.removeEventListener(...t)}}class M{constructor(t,e=0,n=100,o=0,i=!1){r(this,"el");r(this,"elSlider");r(this,"elText");r(this,"isPercent");const l=this.el=document.createElement("div"),a=this.elSlider=document.createElement("input"),h=document.createElement("label"),d=document.createElement("span"),p=this.elText=document.createElement("span");this.isPercent=i,l.appendChild(h),h.appendChild(d),h.appendChild(p),h.appendChild(a),a.type="range",a.className="Slider",a.min=String(e),a.max=String(n),a.value=String(o),d.textContent=`${t}: `,p.textContent=a.value,a.addEventListener("input",()=>{p.textContent=a.value})}get value(){return this.elSlider.valueAsNumber*(this.isPercent?.01:1)}set value(t){const e=t*(this.isPercent?100:1);this.elSlider.value=String(e),this.elText.textContent=String(e)}addEventListener(...t){return this.elSlider.addEventListener(...t)}removeEventListener(...t){return this.elSlider.removeEventListener(...t)}}class F{constructor(t,e=!1){r(this,"el");r(this,"elCheck");const n=this.el=document.createElement("div"),o=this.elCheck=document.createElement("input"),i=document.createElement("label"),l=document.createElement("span");n.appendChild(i),i.appendChild(o),i.appendChild(l),n.className="Checkbox",o.type="checkbox",o.checked=e,l.textContent=t}get value(){return this.elCheck.checked}set value(t){this.elCheck.checked=t}addEventListener(...t){return this.elCheck.addEventListener(...t)}removeEventListener(...t){return this.elCheck.removeEventListener(...t)}}class pt{constructor(t,e=!1){r(this,"el");r(this,"elColor");const n=this.el=document.createElement("div"),o=this.elColor=document.createElement("input"),i=document.createElement("label"),l=document.createElement("span");n.appendChild(i),i.appendChild(o),i.appendChild(l),n.className="ColorSelector",o.type="color",o.checked=e,l.textContent=t}get value(){return this.elColor.value}set value(t){this.elColor.value=t}addEventListener(...t){return this.elColor.addEventListener(...t)}removeEventListener(...t){return this.elColor.removeEventListener(...t)}}class Yt{constructor(t,e){r(this,"checks");r(this,"_value");r(this,"el");r(this,"_updating",!1);r(this,"onChange",new v);const n=Object.keys(t);this.checks=n.map(i=>({cb:new F(t[i]),key:i})),this.value=e,this._value=e,this.checks.forEach(i=>{i.cb.addEventListener("change",()=>{this._updating||i.cb.value&&(this.value=i.key)})});const o=this.el=document.createElement("div");o.className="RadioGroup",this.checks.forEach(i=>{o.appendChild(i.cb.el)})}get value(){return this._value}set value(t){const e=this._value!==t;this._value=t,this.updateChecked(),!!e&&this.onChange.fire(t)}updateChecked(){this._updating=!0,this.checks.forEach(t=>t.cb.value=t.key===this.value),this._updating=!1}listenChange(...t){this.onChange.listen(...t)}}const Ft={draw:"Draw","draw:line":"Line","draw:stamp":"Stamp",scroll:"Move","scroll:anchor":"Move Anchor",rotate:"Rotate","rotate:anchor":"Rotate Anchor",zoomup:"+",zoomdown:"-"};class Ut{constructor(t,e){r(this,"slScale");r(this,"slAngle");r(this,"slX");r(this,"slY");r(this,"slPenCount1");r(this,"slPenCount2");r(this,"slPenWidth");r(this,"cbKaleido1");r(this,"cbKaleido2");r(this,"cbEraser");r(this,"csDrawingColor");r(this,"csCanvasColor");r(this,"slDrawingAlpha");r(this,"cbTools");r(this,"onScaleChange",new v);r(this,"onAngleChange",new v);r(this,"onScrollChange",new v);r(this,"onPenCountChange",new v);r(this,"onPenWidthChange",new v);r(this,"onClear",new v);r(this,"onUndo",new v);r(this,"onCopy",new v);r(this,"onKaleidoChange",new v);r(this,"onEraserChange",new v);r(this,"onDrawingColorChange",new v);r(this,"onCanvasColorChange",new v);r(this,"onDrawingAlphaChange",new v);r(this,"onToolChange",new v);r(this,"canvasWidth");r(this,"canvasHeight");this.canvasWidth=e.height,this.canvasHeight=e.height;const n=this.slScale=new M("Scale",50,300,100,!0),o=this.slAngle=new M("Angle",-360,360,0),i=this.slX=new M("Scroll X",-this.canvasWidth/2,this.canvasWidth/2,0),l=this.slY=new M("Scroll Y",-this.canvasHeight/2,this.canvasHeight/2,0),a=this.slPenCount1=new M("Pen Count Parent",1,16,1),h=this.slPenCount2=new M("Pen Count Child",0,8,1),d=this.slPenWidth=new M("Pen Size",2,100,20),p=new Z("Clear All"),C=new Z("Undo"),b=new Z("Copy Image"),f=this.cbKaleido1=new F("Kalaidoscope"),P=this.cbKaleido2=new F("Kalaidoscope"),E=this.cbEraser=new F("Eraser"),k=this.csDrawingColor=new pt("Pen Color"),A=this.csCanvasColor=new pt("BG Color"),I=this.slDrawingAlpha=new M("Pen Alpha",1,100,100,!0),y=this.cbTools=new Yt(Ft,"draw");t.appendChild(y.el),t.appendChild(E.el),t.appendChild(k.el),t.appendChild(A.el),t.appendChild(a.el),t.appendChild(f.el),t.appendChild(h.el),t.appendChild(P.el),t.appendChild(I.el),t.appendChild(d.el),t.appendChild(p.el),t.appendChild(C.el),t.appendChild(b.el),n.addEventListener("input",()=>{this.onScaleChange.fire(n.value)}),o.addEventListener("input",()=>{this.onAngleChange.fire(o.value)}),i.addEventListener("input",()=>{this.onScrollChange.fire(new u(i.value,l.value))}),l.addEventListener("input",()=>{this.onScrollChange.fire(new u(i.value,l.value))}),a.addEventListener("input",()=>{this.onPenCountChange.fire([a.value,h.value])}),h.addEventListener("input",()=>{this.onPenCountChange.fire([a.value,h.value])}),d.addEventListener("input",()=>{this.onPenWidthChange.fire(d.value)}),p.addEventListener("click",()=>{this.onClear.fire()}),C.addEventListener("click",()=>{this.onUndo.fire()}),b.addEventListener("click",()=>{this.onCopy.fire()}),f.addEventListener("change",()=>{this.onKaleidoChange.fire([f.value,P.value])}),P.addEventListener("change",()=>{this.onKaleidoChange.fire([f.value,P.value])}),E.addEventListener("change",()=>{this.onEraserChange.fire(E.value)}),k.addEventListener("input",()=>{this.onDrawingColorChange.fire(k.value)}),A.addEventListener("input",()=>{this.onCanvasColorChange.fire(A.value)}),I.addEventListener("input",()=>{this.onDrawingAlphaChange.fire(I.value)}),y.listenChange(x=>this.onToolChange.fire(x))}get scale(){return this.slScale.value}get angle(){return this.slAngle.value}get scroll(){return new u(this.slX.value,this.slY.value)}get penCount(){return[this.slPenCount1.value,this.slPenCount2.value]}get penWidth(){return this.slPenWidth.value}get kaleidoscope(){return[this.cbKaleido1.value,this.cbKaleido2.value]}get drawingColor(){return this.csDrawingColor.value}get canvasColor(){return this.csCanvasColor.value}get drawingAlpha(){return this.slDrawingAlpha.value}get tool(){return this.cbTools.value}get eraser(){return this.cbEraser.value}set scale(t){this.scale!==t&&(this.slScale.value=t,this.onScaleChange.fire(this.slScale.value),this.updateScrollRange())}set angle(t){this.angle!==t&&(this.slAngle.value=t,this.onAngleChange.fire(this.slAngle.value))}set scrollX(t){this.slX.value!==t&&(this.slX.value=t,this.onScrollChange.fire(new u(this.slX.value,this.slY.value)))}set scrollY(t){this.slY.value!==t&&(this.slY.value=t,this.onScrollChange.fire(new u(this.slX.value,this.slY.value)))}set penCount(t){Y(this.penCount,t)||(this.slPenCount1.value=t[0],this.slPenCount2.value=t[1],this.onPenCountChange.fire([this.slPenCount1.value,this.slPenCount2.value]))}set penWidth(t){this.penWidth!==t&&(this.slPenWidth.value=t,this.onPenWidthChange.fire(this.slPenWidth.value))}set kaleidoscope(t){Y(this.kaleidoscope,t)||(this.cbKaleido1.value=t[0],this.cbKaleido2.value=t[1],this.onKaleidoChange.fire([this.cbKaleido1.value,this.cbKaleido2.value]))}set drawingColor(t){this.drawingColor!==t&&(this.csDrawingColor.value=t,this.onDrawingColorChange.fire(this.csDrawingColor.value))}set canvasColor(t){this.canvasColor!==t&&(this.csCanvasColor.value=t,this.onCanvasColorChange.fire(this.csCanvasColor.value))}set drawingAlpa(t){this.drawingAlpa!==t&&(this.slDrawingAlpha.value=t,this.onDrawingAlphaChange.fire(this.slDrawingAlpha.value))}set tool(t){this.cbTools.value=t}set eraser(t){this.cbEraser.value=t}penCountUp(){const[t,e]=this.penCount;this.penCount=[t+1,e]}penCountDown(){const[t,e]=this.penCount;t<=1||(this.penCount=[t-1,e])}updateScrollRange(){const t=this.canvasWidth/2*this.scale,e=this.canvasHeight/2*this.scale;this.slX.elSlider.min=String(-t),this.slX.elSlider.max=String(t),this.slY.elSlider.min=String(-e),this.slY.elSlider.max=String(e)}}class zt{constructor(t){r(this,"target");r(this,"_keys",{});r(this,"_removeEvents");r(this,"onChange",new v);this.target=t!=null?t:document.body;const e=o=>{const i=o.key;this._keys[i]=!0,this.onChange.fire({key:i,isDown:!0})},n=o=>{const i=o.key;delete this._keys[i],this.onChange.fire({key:i,isDown:!1})};this.target.addEventListener("keydown",e),this.target.addEventListener("keyup",n),this._removeEvents=()=>{this.target.removeEventListener("keydown",e),this.target.removeEventListener("keyup",n)}}listen(...t){this.onChange.listen(...t)}destroy(){this._removeEvents(),this.onChange.clear()}key(t){return!!this._keys[t]}get keys(){return Object.keys(this._keys)}}const Xt=s=>{const t=s.includes(" "),e=s.includes("Alt"),n=s.includes("Meta"),o=s.includes("Shift");return t&&n&&e?"zoomdown":t&&n?"zoomup":t&&e&&o?"rotate:anchor":t&&e?"rotate":t&&o?"scroll:anchor":t?"scroll":o?"draw:line":e?"draw:stamp":"draw"};class $t{constructor(){r(this,"keyWatcher");r(this,"tool");r(this,"onChange",new v);this.keyWatcher=new zt,this.keyWatcher.listen(()=>{const t=Xt(this.keyWatcher.keys);this.tool!==t&&(this.tool=t,this.onChange.fire(t))})}listenChange(...t){this.onChange.listen(...t)}}const U=document.querySelector("#main"),gt=document.querySelector("#palette"),G=document.querySelector("#toast"),z=new u(U.offsetWidth,U.offsetHeight),Ht=s=>{G.textContent=s,G.classList.add("visible"),setTimeout(()=>{G.classList.remove("visible")},5e3)},g=new Ut(gt,{width:z.x,height:z.y}),c=new Nt(U,z.x,z.y);g.onScaleChange.listen(s=>{c.coord=c.coord.clone({scale:s})});g.onAngleChange.listen(s=>{c.coord=c.coord.clone({angle:s})});g.onScrollChange.listen(s=>{c.coord=c.coord.clone({scroll:s})});g.onPenCountChange.listen(s=>{c.penCount=s});g.onPenWidthChange.listen(s=>{c.penWidth=s});g.onClear.listen(()=>{c.clear()});g.onUndo.listen(()=>{c.undo()});const Zt=async()=>{let s;try{s=new ClipboardItem({"image/png":c.toImgBlob()})}catch{s=new ClipboardItem({"image/png":await c.toImgBlob()})}await navigator.clipboard.write([s])};g.onCopy.listen(()=>{Zt().catch(s=>{console.error(s),alert("failed to copy img.")})});g.onKaleidoChange.listen(s=>{c.isKaleido=s});g.onEraserChange.listen(s=>{c.penKind=s?"eraser":"normal"});g.onDrawingColorChange.listen(s=>{c.penColor=s});g.onCanvasColorChange.listen(s=>{c.backgroundColor=s});g.onDrawingAlphaChange.listen(s=>{c.penAlpha=s});g.onToolChange.listen(s=>{if(c.tool=s,s==="draw:stamp"&&!c.hasStamp){const t={ja:"\u30B9\u30BF\u30F3\u30D7\u3092\u4F7F\u7528\u3059\u308B\u306B\u306F\u3001\u5148\u306BCommand(Ctrl)\u3092\u62BC\u3057\u306A\u304C\u3089\u7DDA\u3092\u5F15\u3044\u3066\u30B9\u30BF\u30F3\u30D7\u3092\u8A18\u9332\u3057\u307E\u3059",en:"Before using stamp, draw with Command(Ctrl) key for record a stroke."}[vt];Ht(t)}});c.coord=c.coord.clone({scroll:g.scroll,scale:g.scale,angle:g.angle});c.listenRequestZoom(s=>{c.coord=c.coord.clone({scale:s})});c.listenRequestScrollTo(({point:s,target:t})=>{t==="canvas"&&(c.coord=c.coord.clone({scroll:s})),t==="anchor"&&(c.activeAnchor=c.activeAnchor.clone({scroll:s}))});c.listenRequestRotateTo(({angle:s,target:t})=>{t==="canvas"&&(c.coord=c.coord.clone({angle:s})),t==="anchor"&&(c.activeAnchor=c.activeAnchor.clone({angle:s}))});c.listenRequestUndo(()=>{c.undo()});c.listenRequestAnchorTransform(s=>{c.activeAnchor=s});c.listenRequestAnchorReset(()=>{c.anchor=new m});window.addEventListener("keydown",s=>{s.key==="ArrowUp"&&g.penCountUp(),s.key==="ArrowDown"&&g.penCountDown(),s.key==="z"&&s.metaKey&&g.onUndo.fire(),s.key==="c"&&s.metaKey&&g.onCopy.fire()});const Gt=new $t;Gt.listenChange(s=>g.tool=s);g.kaleidoscope=[!0,!0];g.penCount=[6,6];g.canvasColor="#ffffff";U.addEventListener("touchmove",function(s){s.preventDefault()},{passive:!1});gt.addEventListener("touchmove",function(s){s.touches.length>=2&&s.preventDefault()},{passive:!1});const vt=navigator.language==="ja"?"ja":"en";document.querySelectorAll(".lang").forEach(s=>s.style.display="none");document.querySelectorAll(`.lang.${vt}`).forEach(s=>s.style.display="");
