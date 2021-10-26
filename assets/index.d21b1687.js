var j=Object.defineProperty;var K=Object.getOwnPropertySymbols;var G=Object.prototype.hasOwnProperty,V=Object.prototype.propertyIsEnumerable;var T=(s,t,e)=>t in s?j(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e,x=(s,t)=>{for(var e in t||(t={}))G.call(t,e)&&T(s,e,t[e]);if(K)for(var e of K(t))V.call(t,e)&&T(s,e,t[e]);return s};var o=(s,t,e)=>(T(s,typeof t!="symbol"?t+"":t,e),e);const J=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerpolicy&&(r.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?r.credentials="include":i.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}};J();class u{constructor(t=0,e=0){o(this,"x");o(this,"y");this.x=t,this.y=e}equals(t){return this.x===t.x&&this.y===t.y}move(t){return new u(this.x+t.x,this.y+t.y)}sub(t){return new u(this.x-t.x,this.y-t.y)}get angle(){return Math.atan2(this.y,this.x)/Math.PI*180}get length(){return Math.sqrt(this.x**2+this.y**2)}rotate(t){const e=t/180*Math.PI,n=Math.cos(e),i=Math.sin(e),r=this.x*n-this.y*i,l=this.x*i+this.y*n;return new u(r,l)}scale(t){return new u(this.x*t,this.y*t)}}class S{constructor(t){o(this,"scroll");o(this,"scale");o(this,"angle");o(this,"flipY");o(this,"_matrix");var e,n,i,r;this.scroll=(e=t==null?void 0:t.scroll)!=null?e:new u,this.scale=(n=t==null?void 0:t.scale)!=null?n:1,this.angle=(i=t==null?void 0:t.angle)!=null?i:0,this.flipY=(r=t==null?void 0:t.flipY)!=null?r:!1,this._matrix=new DOMMatrix().translateSelf(this.scroll.x,this.scroll.y).scaleSelf(this.scale,this.scale*(this.flipY?-1:1)).rotateSelf(this.angle)}toData(){return{scroll:this.scroll,scale:this.scale,angle:this.angle,flipY:this.flipY}}clone(t){const e=this.toData();return new S(x(x({},e),t))}get matrix(){return this._matrix.translate(0)}}class P{constructor(t,e){o(this,"el");o(this,"ctx");o(this,"width");o(this,"height");o(this,"_coord");const n=document.createElement("canvas"),i=n.getContext("2d");if(!i)throw new Error("Failed to get 2d context for canvas");this.width=t,this.height=e,n.width=t,n.height=e,i.lineCap="round",this.el=n,this.ctx=i,this._coord=new S}get centor(){return new u(this.width/2,this.height/2)}set coord(t){const e=this.centor;this._coord=t,this.ctx.resetTransform(),this.ctx.translate(e.x,e.y),this.ctx.translate(t.scroll.x,t.scroll.y),this.ctx.rotate(-t.angle/180*Math.PI),this.ctx.scale(1/t.scale,1/t.scale)}get coord(){return this._coord}output(t,e){var r;const n=this.centor;t.save(),t.globalAlpha=(r=e==null?void 0:e.alpha)!=null?r:1;const i=this.coord;t.resetTransform(),t.translate(n.x,n.y),t.scale(i.scale,i.scale),t.rotate(i.angle/180*Math.PI),t.translate(-i.scroll.x,-i.scroll.y),t.translate(-n.x,-n.y),t.drawImage(this.el,0,0),t.restore()}copy(t,e){var n;t.save(),t.globalAlpha=(n=e==null?void 0:e.alpha)!=null?n:1,t.resetTransform(),t.drawImage(this.el,0,0),t.restore()}}class d{constructor(){o(this,"listeners",[])}fire(t){this.listeners.forEach(e=>e(t))}listen(t){this.listeners.includes(t)||this.listeners.push(t)}clear(){this.listeners.length=0}}const O=s=>new u(s.offsetWidth/2,s.offsetHeight/2),q=(s,t,e)=>{const n=t.sub(s).angle;return e.sub(s).angle-n};class Q{constructor(t){o(this,"el");o(this,"startPoint",new u);o(this,"lastPoint",new u);o(this,"isMoveWatching",!1);o(this,"onMoved",new d);o(this,"onRotated",new d);o(this,"_removeEvents");o(this,"watchingAction");this.el=t;const e=i=>{this.isMoveWatching=this.onDown(new u(i.offsetX,i.offsetY))},n=i=>{!this.isMoveWatching||this.onDrag(new u(i.offsetX,i.offsetY))};this.el.addEventListener("pointerdown",e),this.el.addEventListener("pointermove",n),this._removeEvents=()=>{this.el.removeEventListener("pointerdown",e),this.el.removeEventListener("pointermove",n)}}onDown(t){return this.watchingAction==="dragmove"?(this.startPoint=t,this.lastPoint=t,!0):this.watchingAction==="dragrotate"?(this.startPoint=t,this.lastPoint=t,!0):!1}onDrag(t){if(this.watchingAction==="dragmove"){const e=this.startPoint.sub(t),n=this.lastPoint.sub(t);this.lastPoint=t,this.onMoved.fire({dStart:e,dLast:n})}if(this.watchingAction==="dragrotate"){const e=q(O(this.el),this.startPoint,t),n=q(O(this.el),this.lastPoint,t),i=e-n;this.lastPoint=t,this.onRotated.fire({dStart:e,dLast:i})}}listenMove(...t){this.onMoved.listen(...t)}listenRotate(...t){this.onRotated.listen(...t)}destroy(){this._removeEvents(),this.onMoved.clear(),this.onRotated.clear()}}const tt=s=>{const t=s>=0?s%360:360+s%360;return t<=180?t:-360+t},et=s=>s/180*Math.PI,w=s=>{s.ctx.save(),s.ctx.resetTransform(),s.ctx.clearRect(0,0,s.width,s.height),s.ctx.restore()},Y=(s,t)=>{s.ctx.save(),s.ctx.resetTransform(),s.ctx.fillStyle=t,s.ctx.fillRect(0,0,s.width,s.height),s.ctx.restore()},st=(s,t,e)=>{const n="#91bcccbb",i=e?"#c5e4ebbb":n,r=new u(s.width/2,s.height/2);s.ctx.save(),s.ctx.resetTransform(),s.ctx.translate(r.x,r.y),s.ctx.lineWidth=1,s.ctx.rotate(et(-90+360/t/2));for(let l=0;l<t;l++)s.ctx.strokeStyle=l%2==0?n:i,s.ctx.beginPath(),s.ctx.moveTo(0,0),s.ctx.lineTo(0,s.height),s.ctx.stroke(),s.ctx.closePath(),s.ctx.rotate(360/t/180*Math.PI);s.ctx.restore()};class z{constructor(t=10){o(this,"maxItems");o(this,"items",[]);o(this,"onOverflow",new d);this.maxItems=t}get length(){return this.items.length}clear(){this.items.length=0}push(t){if(this.items.push(t),this.items.length<=this.maxItems)return;const e=this.items.shift();e&&this.onOverflow.fire(e)}pop(){return this.items.pop()}peek(t=0){return this.items[this.items.length-1+t]}getItems(){return[...this.items]}listenOverflow(...t){this.onOverflow.listen(...t)}}class C{constructor(){o(this,"position",new u);o(this,"_coord");o(this,"children",[]);this._coord=new S}get coord(){return this._coord}set coord(t){this._coord=this._coord.clone({scale:t.scale,scroll:t.scroll,angle:t.angle,flipY:t.flipY})}get childCount(){return this.children.length}get pos(){return this.position}get state(){return{position:this.position,coord:this.coord,children:this.children.map(t=>t.state)}}set state(t){for(this.position=t.position,this.coord=t.coord,this.children.length>t.children.length&&(this.children.length=t.children.length);this.children.length<t.children.length;)this.addChildPen();t.children.forEach((e,n)=>{this.children[n].state=e})}get leafs(){return this.childCount?this.children.flatMap(t=>t.leafs):[this]}addChildPen(t){const e=new C;return t&&(e.coord=t),this.children.push(e),e}clearChildren(){this.children.length=0}moveTo(t){this.position=t,this.children.forEach(e=>e.moveTo(t))}drawTo(t,e,n,i=.5,r=""){if(i<=0)return;const l=t.ctx;r&&console.group(r);const a=e.multiply(this.coord.matrix);if(this.childCount===0){const c=a.transformPoint(this.position),g=a.transformPoint(n),v=l.lineWidth;l.beginPath(),l.lineWidth=v*i,l.moveTo(c.x,c.y),l.lineTo(g.x,g.y),r&&console.log(`${c.x} ${c.y}, ${g.x} ${g.y}`),l.stroke(),l.lineWidth=v}this.children.forEach((c,g)=>c.drawTo(t,a,n,i,r?`${r}-${g}`:"")),this.position=n,r&&console.groupEnd()}drawLines(t,e,n,i=.5){if(n.length<2)return;const r=t.ctx,l=e.multiply(this.coord.matrix);if(this.childCount===0){const[a,...c]=n,g=r.lineWidth;r.lineWidth=g*i,r.beginPath();const v=l.transformPoint(a);r.moveTo(v.x,v.y),c.forEach(k=>{const y=l.transformPoint(k);r.lineTo(y.x,y.y)}),r.stroke(),r.lineWidth=g}this.children.forEach(a=>a.drawLines(t,l,n,i))}drayRun(t,e){const n=t.multiply(this.coord.matrix);return this.childCount===0?[e.map(i=>{const r=n.transformPoint(i.point);return{point:new u(r.x,r.y),pressure:i.pressure}})]:this.children.flatMap(i=>i.drayRun(n,e))}}const nt=s=>s.reduce((t,e)=>t+e,0)/s.length,it=s=>{if(!s.length)return 0;const t=Math.floor(s.length*.9);return s[t].pressure},ot=s=>s.length?nt(s.map(t=>t.pressure).filter(t=>t>0)):0,B=s=>{const t=s.findIndex((l,a)=>a>0&&l.pressure===0);if(t===-1)return[s];const e=s.slice(0,t),n=s.slice(t),i=!(e.length===1&&e[0].pressure===0),r=!(n.length===1&&n[0].pressure===0);return[...i?[e]:[],...r?B(n):[]]},H=(s,t,e)=>{const n=new DOMMatrix;s.coord=t.canvasCoord,s.ctx.strokeStyle=t.style.color,s.ctx.lineWidth=t.style.penSize*t.canvasCoord.scale;const i=new C;if(i.state=t.penState,e)B(t.inputs).forEach(l=>{const a=ot(l);i.drawLines(s,n,l.map(c=>c.point),a)});else{const[r,...l]=t.inputs;if(!r)return;i.moveTo(r.point),l.forEach(a=>{a.pressure?i.drawTo(s,n,a.point,a.pressure):i.moveTo(a.point)})}},rt=s=>{w(s)},lt=(s,t,e,n=!1)=>{e.forEach(i=>{i.tool==="pen"&&(w(t),H(t,i,n),t.copy(s.ctx,{alpha:i.style.alpha})),i.tool==="clearAll"&&rt(s)}),w(t)},at=s=>s.flatMap(t=>{if(!t.length)return t;const e=t[0],n=t[t.length-1];return[{point:e.point,pressure:0},...t,{point:n.point,pressure:0}]});class E{constructor(t,e,n,i="pen"){o(this,"inputs",[]);o(this,"penState");o(this,"style");o(this,"canvasCoord");o(this,"tool");this.canvasCoord=t,this.penState=e,this.style=n,this.tool=i}addPoint(t,e){this.inputs.push({point:t,pressure:e})}clearPoints(t=!1,e=!1){const n=t?this.inputs.shift():void 0,i=e?this.inputs.pop():void 0;this.inputs.length=0,n&&this.inputs.push(n),i&&this.inputs.push(i)}get flatten(){const t=new C;t.state=this.penState;const e=t.drayRun(new DOMMatrix,this.inputs),n=at(e);t.clearChildren();const i=new E(this.canvasCoord,t.state,this.style,this.tool);return i.inputs.push(...n),i}}const ht=110,b=10;class ct{constructor(t,e){o(this,"canvasWidth");o(this,"canvasHeight");o(this,"history",new z(1/0));o(this,"snapshots",new z(ht/b));o(this,"currentStroke");o(this,"lastSnapshotIndex",0);o(this,"oldestSnapshotIndex",0);this.canvasWidth=t,this.canvasHeight=e,this.snapshots.listenOverflow(()=>{this.oldestSnapshotIndex+=b,console.log(`oldestSnapshotIndex: ${this.oldestSnapshotIndex}`)})}get strokes(){return this.history.peek()}get snapshot(){return this.snapshots.peek()}get prevSnapshot(){return this.snapshots.peek(-1)}get lastHistories(){return this.history.getItems().slice(this.lastSnapshotIndex)}addSnapshot(){const t=new P(this.canvasWidth,this.canvasHeight);this.snapshots.push(t);const e=this.prevSnapshot;e&&t.ctx.drawImage(e.el,0,0);const n=document.querySelector("#debug .history .snaps");if(n){const i=120/Math.max(t.el.width,t.el.height);t.el.style.width=t.el.width*i+"px",t.el.style.height=t.el.height*i+"px",n.appendChild(t.el),t.el.scrollIntoView()}this.lastSnapshotIndex=this.history.length-1}start(t,e,n,i){const r=new E(t,e,n,i);return this.currentStroke=r,r}commit(t){if(!this.currentStroke)return;this.history.push(this.currentStroke),this.history.length-this.lastSnapshotIndex-1===b&&(this.addSnapshot(),t.copy(this.snapshot.ctx,{alpha:this.currentStroke.style.alpha}),console.log("new snapshot",this.snapshots.length)),this.currentStroke=void 0}rollback(){!this.currentStroke||(console.log("stroke rollbacked"),this.currentStroke=void 0)}get current(){return this.currentStroke}get undoable(){return this.history.length>this.oldestSnapshotIndex}undo(t,e){var i;if(!this.undoable)return console.log("no more history"),!1;t.ctx.save();const n=this.snapshot;if(n?(t.ctx.resetTransform(),t.ctx.drawImage(n.el,0,0)):console.log("no prev"),this.history.pop(),lt(t,e,this.lastHistories),!this.lastHistories.length&&this.snapshots.length>=1){const r=this.snapshots.pop();r&&((i=document.getElementById("debug"))==null||i.removeChild(r.el)),this.lastSnapshotIndex-=b,console.log("back prev snap",this.snapshots.length,this.snapshots)}return t.ctx.restore(),!0}}class D{constructor(t){o(this,"color");o(this,"penSize");o(this,"alpha");var e,n,i;this.color=(e=t==null?void 0:t.color)!=null?e:"#000000",this.penSize=(n=t==null?void 0:t.penSize)!=null?n:10,this.alpha=(i=t==null?void 0:t.alpha)!=null?i:1}toData(){return{color:this.color,penSize:this.penSize,alpha:this.alpha}}clone(t){return new D(x(x({},this.toData()),t))}}const ut=s=>{var t;return(t={draw:"crosshair",scroll:"move",zoomup:"zoom-in",zoomdown:"zoom-out",rotate:"grab","draw:line":"crosshair","draw:stamp":"crosshair"}[s])!=null?t:"default"},f=2,dt=3;class pt{constructor(t,e,n){o(this,"width");o(this,"height");o(this,"canvas");o(this,"strokeCanvas");o(this,"view");o(this,"dragWatcher");o(this,"eventStatus",{isWatchMove:!1,isUseStrokeCanvas:!1,activeEvent:void 0,startCoord:new S,startPoint:new u,isCapturing:!1});o(this,"history");o(this,"requestChangeZoom",new d);o(this,"requestScrollTo",new d);o(this,"requestRotateTo",new d);o(this,"pen");o(this,"style",new D);o(this,"stamp");o(this,"_tool","draw");o(this,"_isKaleido",!1);var r,l;this.width=e,this.height=n,this.canvas=new P(this.width*f,this.height*f),this.strokeCanvas=new P(this.width*f,this.height*f),this.view=new P(this.width*f,this.height*f),this.history=new ct(this.width*f,this.height*f),this.view.el.style.width=`${e}px`,this.view.el.style.height=`${n}px`,t.appendChild(this.view.el);const i=document.getElementById("debug");if(i){const a=200/Math.max(e,n);this.canvas.el.style.width=e*a+"px",this.canvas.el.style.height=n*a+"px",this.strokeCanvas.el.style.width=e*a+"px",this.strokeCanvas.el.style.height=n*a+"px",(r=i.querySelector(".canvas"))==null||r.appendChild(this.canvas.el),(l=i.querySelector(".stroke"))==null||l.appendChild(this.strokeCanvas.el)}this.registerEventHandlers(),this.dragWatcher=new Q(this.view.el),this.dragWatcher.listenMove(({dStart:a})=>{const c=this.eventStatus.startCoord.scroll.move(a.scale(1/this.coord.scale*f).rotate(-this.coord.angle));this.requestScrollTo.fire(c)}),this.dragWatcher.listenRotate(({dStart:a})=>{const c=tt(this.eventStatus.startCoord.angle+a);this.requestRotateTo.fire(c)}),this.pen=new C,this.tool="draw",this.clear(!1)}registerEventHandlers(){const t=this.view.el;let e=new u;t.addEventListener("pointerdown",n=>{e=new u(n.screenX,n.screenY),this.onDown(n)}),t.addEventListener("pointermove",n=>{if(!this.eventStatus.isWatchMove)return;const i=new u(n.screenX,n.screenY);i.sub(e).length<dt||(this.onMove(n),e=i)}),t.addEventListener("pointerup",n=>this.eventStatus.isWatchMove&&this.onUp(n))}get coord(){return this.canvas.coord}set coord(t){this.canvas.coord=t.clone({}),this.rePaint()}get tool(){return this._tool}set tool(t){this._tool=t,this.view.el.style.cursor=ut(t)}get isKaleido(){return this._isKaleido}set isKaleido(t){if(t!==this._isKaleido){if(this._isKaleido=t,t){const e=this.penCount;this.penCount=1,this.penCount=e}this.rePaint()}}get penCount(){return this.pen.childCount}set penCount(t){if(t===this.penCount)return;const e=this.pen;e.clearChildren();for(let n=0;n<t;n++){const i=this._isKaleido&&n%2!=0;e.addChildPen(new S({angle:n*360/t,flipY:i}))}this.rePaint()}set penWidth(t){this.style=this.style.clone({penSize:t})}set penColor(t){this.style=this.style.clone({color:t})}set penAlpha(t){this.style=this.style.clone({alpha:t})}get hasStamp(){return!!this.stamp}listenRequestZoom(...t){this.requestChangeZoom.listen(...t)}listenRequestScrollTo(...t){this.requestScrollTo.listen(...t)}listenRequestRotateTo(...t){this.requestRotateTo.listen(...t)}clear(t=!0){t&&(this.history.start(this.coord,this.pen.state,this.style,"clearAll"),this.history.commit(this.canvas)),Y(this.canvas,"#ffffff"),this.rePaint()}undo(){!this.history.undoable||(this.clear(!1),this.history.undo(this.canvas,this.strokeCanvas),this.rePaint())}async toImgBlob(){return new Promise((t,e)=>{this.canvas.el.toBlob(n=>n?t(n):e())})}event2canvasPoint(t){return new u((t.offsetX-this.width/2)*f,(t.offsetY-this.height/2)*f)}onDown(t){const e=this.tool;this.eventStatus.activeEvent=e,this.eventStatus.startCoord=this.coord,this.eventStatus.startPoint=this.event2canvasPoint(t),this.eventStatus.isCapturing=t.metaKey,(e==="draw"||e==="draw:line"||e==="draw:stamp")&&(this.eventStatus.isWatchMove=!0,this.startStroke(this.eventStatus.startPoint)),e==="zoomup"&&this.requestChangeZoom.fire(!0),e==="zoomdown"&&this.requestChangeZoom.fire(!1),e==="scroll"&&(this.eventStatus.isWatchMove=!0,this.dragWatcher.watchingAction="dragmove"),e==="rotate"&&(this.eventStatus.isWatchMove=!0,this.dragWatcher.watchingAction="dragrotate")}onMove(t){const e=this.eventStatus.activeEvent;if(e==="draw"&&this.continueStroke(this.event2canvasPoint(t),t.pressure||.5),e==="draw:line"&&(w(this.strokeCanvas),this.pen.moveTo(this.eventStatus.startPoint),this.continueStroke(this.event2canvasPoint(t),t.pressure||.5)),e==="draw:stamp"&&this.stamp){w(this.strokeCanvas);const n=this.event2canvasPoint(t).sub(this.eventStatus.startPoint),i=n.length/100;this.putStroke(this.stamp,this.eventStatus.startPoint,i,n.angle,!0)}t.preventDefault()}onUp(t){var i,r;const e=this.eventStatus.activeEvent,n=e==="draw"||e==="draw:line"||e==="draw:stamp";if(e==="draw"&&this.continueStroke(this.event2canvasPoint(t),t.pressure||0),e==="draw:line"&&(w(this.strokeCanvas),this.pen.moveTo(this.eventStatus.startPoint),this.continueStroke(this.event2canvasPoint(t),this.history.current?it(this.history.current.inputs):.5),(i=this.history.current)==null||i.clearPoints(!0,!0)),e==="draw:stamp"&&this.stamp){w(this.strokeCanvas);const l=this.event2canvasPoint(t).sub(this.eventStatus.startPoint),a=l.length/100;this.putStroke(this.stamp,this.eventStatus.startPoint,a,l.angle,!1)}if((e==="draw"||e==="draw:line")&&this.eventStatus.isCapturing){this.stamp=(r=this.history.current)==null?void 0:r.flatten,this.endStroke(!1),this.rePaint();return}this.endStroke(n)}startStroke(t){var e;this.eventStatus.isUseStrokeCanvas=!0,this.strokeCanvas.coord=this.canvas.coord,this.strokeCanvas.ctx.lineWidth=this.style.penSize*this.canvas.coord.scale,this.strokeCanvas.ctx.strokeStyle=this.eventStatus.isCapturing?"#0044aa":this.style.color,this.history.start(this.coord,this.pen.state,this.style),(e=this.history.current)==null||e.addPoint(t,.5),this.pen.moveTo(t)}continueStroke(t,e=.5){var n;(n=this.history.current)==null||n.addPoint(t,e),this.pen.drawTo(this.strokeCanvas,new DOMMatrix,t,e),this.rePaint()}endStroke(t){t?(this.history.commit(this.canvas),this.strokeCanvas.copy(this.canvas.ctx,{alpha:this.style.alpha}),w(this.strokeCanvas)):(this.history.rollback(),w(this.strokeCanvas)),this.eventStatus.isWatchMove=!1,this.eventStatus.isUseStrokeCanvas=!1,this.eventStatus.activeEvent=void 0,this.dragWatcher.watchingAction=void 0}putStroke(t,e,n,i,r){const l=new C;l.state=this.pen.state;const a=new C;a.state=t.penState,a.coord=a.coord.clone({scroll:e,scale:n,angle:i}),l.leafs.forEach(v=>v.addChildPen()),l.leafs.forEach(v=>v.state=a.state);const c=new E(this.coord,l.state,this.style,t.tool);c.inputs.push(...t.inputs),H(this.strokeCanvas,c,r),this.rePaint();const g=this.history.current;!r&&g&&(this.history.rollback(),this.history.start(g.canvasCoord,l.state,this.style,g.tool).inputs.push(...t.inputs))}rePaint(){Y(this.view,"#cccccc"),this.canvas.output(this.view.ctx),this.eventStatus.isUseStrokeCanvas&&this.strokeCanvas.output(this.view.ctx,{alpha:this.style.alpha}),this.penCount>=2&&st(this.view,this.penCount,this.isKaleido)}}class I{constructor(t){o(this,"el");const e=this.el=document.createElement("button");e.className="Button",e.textContent=t}addEventListener(...t){return this.el.addEventListener(...t)}removeEventListener(...t){return this.el.removeEventListener(...t)}}class m{constructor(t,e=0,n=100,i=0,r=!1){o(this,"el");o(this,"elSlider");o(this,"elText");o(this,"isPercent");const l=this.el=document.createElement("div"),a=this.elSlider=document.createElement("input"),c=document.createElement("label"),g=document.createElement("span"),v=this.elText=document.createElement("span");this.isPercent=r,l.appendChild(c),c.appendChild(g),c.appendChild(v),c.appendChild(a),a.type="range",a.className="Slider",a.min=String(e),a.max=String(n),a.value=String(i),g.textContent=`${t}: `,v.textContent=a.value,a.addEventListener("input",()=>{v.textContent=a.value})}get value(){return this.elSlider.valueAsNumber*(this.isPercent?.01:1)}set value(t){const e=t*(this.isPercent?100:1);this.elSlider.value=String(e),this.elText.textContent=String(e)}addEventListener(...t){return this.elSlider.addEventListener(...t)}removeEventListener(...t){return this.elSlider.removeEventListener(...t)}}class X{constructor(t,e=!1){o(this,"el");o(this,"elCheck");const n=this.el=document.createElement("div"),i=this.elCheck=document.createElement("input"),r=document.createElement("label"),l=document.createElement("span");n.appendChild(r),r.appendChild(i),r.appendChild(l),n.className="Checkbox",i.type="checkbox",i.checked=e,l.textContent=t}get value(){return this.elCheck.checked}set value(t){this.elCheck.checked=t}addEventListener(...t){return this.elCheck.addEventListener(...t)}removeEventListener(...t){return this.elCheck.removeEventListener(...t)}}class gt{constructor(t,e=!1){o(this,"el");o(this,"elColor");const n=this.el=document.createElement("div"),i=this.elColor=document.createElement("input"),r=document.createElement("label"),l=document.createElement("span");n.appendChild(r),r.appendChild(i),r.appendChild(l),n.className="ColorSelector",i.type="color",i.checked=e,l.textContent=t}get value(){return this.elColor.value}set value(t){this.elColor.value=t}addEventListener(...t){return this.elColor.addEventListener(...t)}removeEventListener(...t){return this.elColor.removeEventListener(...t)}}class vt{constructor(t,e){o(this,"checks");o(this,"_value");o(this,"el");o(this,"_updating",!1);o(this,"onChange",new d);const n=Object.keys(t);this.checks=n.map(r=>({cb:new X(t[r]),key:r})),this.value=e,this._value=e,this.checks.forEach(r=>{r.cb.addEventListener("change",()=>{this._updating||r.cb.value&&(this.value=r.key)})});const i=this.el=document.createElement("div");i.className="RadioGroup",this.checks.forEach(r=>{i.appendChild(r.cb.el)})}get value(){return this._value}set value(t){const e=this._value!==t;this._value=t,this.updateChecked(),!!e&&this.onChange.fire(t)}updateChecked(){this._updating=!0,this.checks.forEach(t=>t.cb.value=t.key===this.value),this._updating=!1}listenChange(...t){this.onChange.listen(...t)}}const ft={draw:"Draw","draw:line":"Line","draw:stamp":"Stamp",scroll:"Move",rotate:"Rotate",zoomup:"+",zoomdown:"-"};class wt{constructor(t,e){o(this,"slScale");o(this,"slAngle");o(this,"slX");o(this,"slY");o(this,"slPenCount");o(this,"slPenWidth");o(this,"cbKaleido");o(this,"csDrawingColor");o(this,"slDrawingAlpha");o(this,"cbTools");o(this,"onScaleChange",new d);o(this,"onAngleChange",new d);o(this,"onScrollChange",new d);o(this,"onPenCountChange",new d);o(this,"onPenWidthChange",new d);o(this,"onClear",new d);o(this,"onUndo",new d);o(this,"onCopy",new d);o(this,"onKaleidoChange",new d);o(this,"onDrawingColorChange",new d);o(this,"onDrawingAlphaChange",new d);o(this,"onToolChange",new d);o(this,"canvasWidth");o(this,"canvasHeight");this.canvasWidth=e.height,this.canvasHeight=e.height;const n=this.slScale=new m("Scale",50,300,100,!0),i=this.slAngle=new m("Angle",-360,360,0),r=this.slX=new m("Scroll X",-this.canvasWidth/2,this.canvasWidth/2,0),l=this.slY=new m("Scroll Y",-this.canvasHeight/2,this.canvasHeight/2,0),a=this.slPenCount=new m("Pen Count",1,32,1),c=this.slPenWidth=new m("Pen Size",2,100,20),g=new I("Clear All"),v=new I("Undo"),k=new I("Copy Image"),y=this.cbKaleido=new X("Kalaidoscope"),W=this.csDrawingColor=new gt("Pen Color"),M=this.slDrawingAlpha=new m("Pen Alpha",1,100,100,!0),R=this.cbTools=new vt(ft,"draw");t.appendChild(R.el),t.appendChild(a.el),t.appendChild(y.el),t.appendChild(W.el),t.appendChild(M.el),t.appendChild(c.el),t.appendChild(g.el),t.appendChild(v.el),t.appendChild(k.el),n.addEventListener("input",()=>{this.onScaleChange.fire(n.value)}),i.addEventListener("input",()=>{this.onAngleChange.fire(i.value)}),r.addEventListener("input",()=>{this.onScrollChange.fire(new u(r.value,l.value))}),l.addEventListener("input",()=>{this.onScrollChange.fire(new u(r.value,l.value))}),a.addEventListener("input",()=>{this.onPenCountChange.fire(a.value)}),c.addEventListener("input",()=>{this.onPenWidthChange.fire(c.value)}),g.addEventListener("click",()=>{this.onClear.fire()}),v.addEventListener("click",()=>{this.onUndo.fire()}),k.addEventListener("click",()=>{this.onCopy.fire()}),y.addEventListener("change",()=>{this.onKaleidoChange.fire(y.value),this.updateKareido2PenCount()}),W.addEventListener("input",()=>{this.onDrawingColorChange.fire(W.value)}),M.addEventListener("input",()=>{this.onDrawingAlphaChange.fire(M.value)}),R.listenChange(Z=>this.onToolChange.fire(Z))}get scale(){return this.slScale.value}get angle(){return this.slAngle.value}get scroll(){return new u(this.slX.value,this.slY.value)}get penCount(){return this.slPenCount.value}get penWidth(){return this.slPenWidth.value}get kaleidoscope(){return this.cbKaleido.value}get drawingColor(){return this.csDrawingColor.value}get drawingAlpha(){return this.slDrawingAlpha.value}get tool(){return this.cbTools.value}set scale(t){this.scale!==t&&(this.slScale.value=t,this.onScaleChange.fire(this.slScale.value),this.updateScrollRange())}set angle(t){this.angle!==t&&(this.slAngle.value=t,this.onAngleChange.fire(this.slAngle.value))}set scrollX(t){this.slX.value!==t&&(this.slX.value=t,this.onScrollChange.fire(new u(this.slX.value,this.slY.value)))}set scrollY(t){this.slY.value!==t&&(this.slY.value=t,this.onScrollChange.fire(new u(this.slX.value,this.slY.value)))}set penCount(t){this.penCount!==t&&(this.slPenCount.value=t,this.onPenCountChange.fire(this.slPenCount.value))}set penWidth(t){this.penWidth!==t&&(this.slPenWidth.value=t,this.onPenWidthChange.fire(this.slPenWidth.value))}set kaleidoscope(t){this.kaleidoscope!==t&&(this.cbKaleido.value=t,this.onKaleidoChange.fire(this.cbKaleido.value),this.updateKareido2PenCount())}set drawingColor(t){this.drawingColor!==t&&(this.csDrawingColor.value=t,this.onDrawingColorChange.fire(this.csDrawingColor.value))}set drawingAlpa(t){this.drawingAlpa!==t&&(this.slDrawingAlpha.value=t,this.onDrawingAlphaChange.fire(this.slDrawingAlpha.value))}set tool(t){this.cbTools.value=t}penCountUp(){this.penCount+=this.kaleidoscope?2:1}penCountDown(){this.penCount-=this.kaleidoscope?2:1}updateKareido2PenCount(){const t=this.cbKaleido.value;t&&(this.penCount+=this.penCount%2),this.slPenCount.elSlider.min=t?"2":"1",this.slPenCount.elSlider.step=t?"2":"1"}updateScrollRange(){const t=this.canvasWidth/2*this.scale,e=this.canvasHeight/2*this.scale;this.slX.elSlider.min=String(-t),this.slX.elSlider.max=String(t),this.slY.elSlider.min=String(-e),this.slY.elSlider.max=String(e)}}const U=.2,F=4,N=[0,U,.33,.5,.67,.75,1,1.5,2,2.5,3,3.5,F,1/0],Ct=(s,t)=>{var r;const e=t?N:[...N].reverse(),n=e.findIndex(l=>t?l>s:l<s),i=(r=e[n])!=null?r:0;return Math.max(U,Math.min(F,i))};class mt{constructor(t){o(this,"target");o(this,"_keys",{});o(this,"_removeEvents");o(this,"onChange",new d);this.target=t!=null?t:document.body;const e=i=>{const r=i.key;this._keys[r]=!0,this.onChange.fire({key:r,isDown:!0})},n=i=>{const r=i.key;delete this._keys[r],this.onChange.fire({key:r,isDown:!1})};this.target.addEventListener("keydown",e),this.target.addEventListener("keyup",n),this._removeEvents=()=>{this.target.removeEventListener("keydown",e),this.target.removeEventListener("keyup",n)}}listen(...t){this.onChange.listen(...t)}destroy(){this._removeEvents(),this.onChange.clear()}key(t){return!!this._keys[t]}get keys(){return Object.keys(this._keys)}}const yt=s=>{const t=s.includes(" "),e=s.includes("Alt"),n=s.includes("Meta"),i=s.includes("Shift");return t&&n&&e?"zoomdown":t&&n?"zoomup":t&&e?"rotate":t?"scroll":i?"draw:line":e?"draw:stamp":"draw"};class St{constructor(){o(this,"keyWatcher");o(this,"tool");o(this,"onChange",new d);this.keyWatcher=new mt,this.keyWatcher.listen(()=>{const t=yt(this.keyWatcher.keys);this.tool!==t&&(this.tool=t,this.onChange.fire(t))})}listenChange(...t){this.onChange.listen(...t)}}const L=document.querySelector("#main"),xt=document.querySelector("#palette"),_=document.querySelector("#toast"),A=new u(L.offsetWidth,L.offsetHeight),kt=s=>{_.textContent=s,_.classList.add("visible"),setTimeout(()=>{_.classList.remove("visible")},5e3)},h=new wt(xt,{width:A.x,height:A.y}),p=new pt(L,A.x,A.y);h.onScaleChange.listen(s=>{p.coord=p.coord.clone({scale:s})});h.onAngleChange.listen(s=>{p.coord=p.coord.clone({angle:s})});h.onScrollChange.listen(s=>{p.coord=p.coord.clone({scroll:s})});h.onPenCountChange.listen(s=>{p.penCount=s});h.onPenWidthChange.listen(s=>{p.penWidth=s});h.onClear.listen(()=>{p.clear()});h.onUndo.listen(()=>{p.undo()});h.onCopy.listen(async()=>{const s=await p.toImgBlob(),t=new ClipboardItem({"image/png":s});await navigator.clipboard.write([t])});h.onKaleidoChange.listen(s=>{p.isKaleido=s});h.onDrawingColorChange.listen(s=>{p.penColor=s});h.onDrawingAlphaChange.listen(s=>{p.penAlpha=s});h.onToolChange.listen(s=>{if(p.tool=s,s==="draw:stamp"&&!p.hasStamp){const t={ja:"\u30B9\u30BF\u30F3\u30D7\u3092\u4F7F\u7528\u3059\u308B\u306B\u306F\u3001\u5148\u306BCommand(Ctrl)\u3092\u62BC\u3057\u306A\u304C\u3089\u7DDA\u3092\u5F15\u3044\u3066\u30B9\u30BF\u30F3\u30D7\u3092\u8A18\u9332\u3057\u307E\u3059",en:"Before using stamp, draw with Command(Ctrl) key for record a stroke."}[$];kt(t)}});p.coord=p.coord.clone({scroll:h.scroll,scale:h.scale,angle:h.angle});p.listenRequestZoom(s=>{h.scale=Ct(h.scale,s)});p.listenRequestScrollTo(s=>{h.scrollX=s.x,h.scrollY=s.y});p.listenRequestRotateTo(s=>{h.angle=s});window.addEventListener("keydown",s=>{s.key==="ArrowUp"&&h.penCountUp(),s.key==="ArrowDown"&&h.penCountDown(),s.key==="z"&&s.metaKey&&h.onUndo.fire(),s.key==="z"&&s.metaKey&&h.onCopy.fire()});const Pt=new St;Pt.listenChange(s=>h.tool=s);h.kaleidoscope=!0;h.penCount=6;L.addEventListener("touchmove",function(s){s.preventDefault()});const $=navigator.language==="ja"?"ja":"en";document.querySelectorAll(".lang").forEach(s=>s.style.display="none");document.querySelectorAll(`.lang.${$}`).forEach(s=>s.style.display="");
