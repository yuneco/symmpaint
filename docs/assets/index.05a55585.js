var $=Object.defineProperty;var I=Object.getOwnPropertySymbols;var B=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable;var M=(s,t,e)=>t in s?$(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e,P=(s,t)=>{for(var e in t||(t={}))B.call(t,e)&&M(s,e,t[e]);if(I)for(var e of I(t))Z.call(t,e)&&M(s,e,t[e]);return s};var o=(s,t,e)=>(M(s,typeof t!="symbol"?t+"":t,e),e);const N=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerpolicy&&(r.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?r.credentials="include":i.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}};N();class h{constructor(t=0,e=0){o(this,"x");o(this,"y");this.x=t,this.y=e}equals(t){return this.x===t.x&&this.y===t.y}move(t){return new h(this.x+t.x,this.y+t.y)}sub(t){return new h(this.x-t.x,this.y-t.y)}get angle(){return Math.atan2(this.y,this.x)/Math.PI*180}get length(){return Math.sqrt(this.x**2+this.y**2)}rotate(t){const e=t/180*Math.PI,n=Math.cos(e),i=Math.sin(e),r=this.x*n-this.y*i,l=this.x*i+this.y*n;return new h(r,l)}scale(t){return new h(this.x*t,this.y*t)}}class x{constructor(t){o(this,"scroll");o(this,"scale");o(this,"angle");o(this,"flipY");o(this,"_matrix");var e,n,i,r;this.scroll=(e=t==null?void 0:t.scroll)!=null?e:new h,this.scale=(n=t==null?void 0:t.scale)!=null?n:1,this.angle=(i=t==null?void 0:t.angle)!=null?i:0,this.flipY=(r=t==null?void 0:t.flipY)!=null?r:!1,this._matrix=new DOMMatrix().translateSelf(this.scroll.x,this.scroll.y).scaleSelf(this.scale,this.scale*(this.flipY?-1:1)).rotateSelf(this.angle)}toData(){return{scroll:this.scroll,scale:this.scale,angle:this.angle,flipY:this.flipY}}clone(t){const e=this.toData();return new x(P(P({},e),t))}get matrix(){return this._matrix.translate(0)}}class b{constructor(t,e){o(this,"el");o(this,"ctx");o(this,"width");o(this,"height");o(this,"_coord");const n=document.createElement("canvas"),i=n.getContext("2d");if(!i)throw new Error("Failed to get 2d context for canvas");this.width=t,this.height=e,n.width=t,n.height=e,n.style.border="1px solid #aaa",i.lineCap="round",this.el=n,this.ctx=i,this._coord=new x}get centor(){return new h(this.width/2,this.height/2)}set coord(t){const e=this.centor;this._coord=t,this.ctx.resetTransform(),this.ctx.translate(e.x,e.y),this.ctx.translate(t.scroll.x,t.scroll.y),this.ctx.rotate(-t.angle/180*Math.PI),this.ctx.scale(1/t.scale,1/t.scale)}get coord(){return this._coord}clear(){this.ctx.save(),this.ctx.resetTransform(),this.ctx.fillStyle="#ffffff",this.ctx.fillRect(0,0,this.width,this.height),this.ctx.restore()}output(t,e){var r;const n=this.centor;t.save(),t.globalAlpha=(r=e==null?void 0:e.alpha)!=null?r:1;const i=this.coord;t.resetTransform(),t.translate(n.x,n.y),t.scale(i.scale,i.scale),t.rotate(i.angle/180*Math.PI),t.translate(-i.scroll.x,-i.scroll.y),t.translate(-n.x,-n.y),t.drawImage(this.el,0,0),t.restore()}copy(t,e){var n;t.save(),t.globalAlpha=(n=e==null?void 0:e.alpha)!=null?n:1,t.resetTransform(),t.drawImage(this.el,0,0),t.restore()}}class g{constructor(){o(this,"listeners",[])}fire(t){this.listeners.forEach(e=>e(t))}listen(t){this.listeners.includes(t)||this.listeners.push(t)}clear(){this.listeners.length=0}}const R=s=>new h(s.offsetWidth/2,s.offsetHeight/2),O=(s,t,e)=>{const n=t.sub(s).angle;return e.sub(s).angle-n};class j{constructor(t){o(this,"el");o(this,"startPoint",new h);o(this,"lastPoint",new h);o(this,"isMoveWatching",!1);o(this,"onMoved",new g);o(this,"onRotated",new g);o(this,"_removeEvents");o(this,"watchingAction");this.el=t;const e=i=>{this.isMoveWatching=this.onDown(new h(i.offsetX,i.offsetY))},n=i=>{!this.isMoveWatching||this.onDrag(new h(i.offsetX,i.offsetY))};this.el.addEventListener("pointerdown",e),this.el.addEventListener("pointermove",n),this._removeEvents=()=>{this.el.removeEventListener("pointerdown",e),this.el.removeEventListener("pointermove",n)}}onDown(t){return this.watchingAction==="dragmove"?(this.startPoint=t,this.lastPoint=t,!0):this.watchingAction==="dragrotate"?(this.startPoint=t,this.lastPoint=t,!0):!1}onDrag(t){if(this.watchingAction==="dragmove"){const e=this.startPoint.sub(t),n=this.lastPoint.sub(t);this.lastPoint=t,this.onMoved.fire({dStart:e,dLast:n})}if(this.watchingAction==="dragrotate"){const e=O(R(this.el),this.startPoint,t),n=O(R(this.el),this.lastPoint,t),i=e-n;this.lastPoint=t,this.onRotated.fire({dStart:e,dLast:i})}}listenMove(...t){this.onMoved.listen(...t)}listenRotate(...t){this.onRotated.listen(...t)}destroy(){this._removeEvents(),this.onMoved.clear(),this.onRotated.clear()}}class F{constructor(t){o(this,"target");o(this,"_keys",{});o(this,"_removeEvents");o(this,"onChange",new g);this.target=t!=null?t:document.body;const e=i=>{const r=i.key;this._keys[r]=!0,this.onChange.fire({key:r,isDown:!0})},n=i=>{const r=i.key;delete this._keys[r],this.onChange.fire({key:r,isDown:!1})};this.target.addEventListener("keydown",e),this.target.addEventListener("keyup",n),this._removeEvents=()=>{this.target.removeEventListener("keydown",e),this.target.removeEventListener("keyup",n)}}listen(...t){this.onChange.listen(...t)}destroy(){this._removeEvents(),this.onChange.clear()}key(t){return!!this._keys[t]}get keys(){return Object.keys(this._keys)}}const V=s=>{const t=s>=0?s%360:360+s%360;return t<=180?t:-360+t},G=s=>s/180*Math.PI,C=s=>{s.ctx.save(),s.ctx.resetTransform(),s.ctx.clearRect(0,0,s.width,s.height),s.ctx.restore()},J=(s,t)=>{s.ctx.save(),s.ctx.resetTransform(),s.ctx.fillStyle=t,s.ctx.fillRect(0,0,s.width,s.height),s.ctx.restore()},Q=(s,t,e)=>{const n="#91bcccbb",i=e?"#c5e4ebbb":n,r=new h(s.width/2,s.height/2);s.ctx.save(),s.ctx.resetTransform(),s.ctx.translate(r.x,r.y),s.ctx.lineWidth=1,s.ctx.rotate(G(-90+360/t/2));for(let l=0;l<t;l++)s.ctx.strokeStyle=l%2==0?n:i,s.ctx.beginPath(),s.ctx.moveTo(0,0),s.ctx.lineTo(0,s.height),s.ctx.stroke(),s.ctx.closePath(),s.ctx.rotate(360/t/180*Math.PI);s.ctx.restore()},tt=s=>{var t;return(t={draw:"crosshair",scroll:"move",zoomup:"zoom-in",zoomdown:"zoom-out",rotate:"grab","draw:line":"crosshair","draw:stamp":"crosshair"}[s])!=null?t:"default"},K=s=>{const t=s.includes(" "),e=s.includes("Alt"),n=s.includes("Meta"),i=s.includes("Shift");return t&&n&&e?"zoomdown":t&&n?"zoomup":t&&e?"rotate":t?"scroll":i?"draw:line":e?"draw:stamp":"draw"};class Y{constructor(t=10){o(this,"maxItems");o(this,"items",[]);o(this,"onOverflow",new g);this.maxItems=t}get length(){return this.items.length}clear(){this.items.length=0}push(t){if(this.items.push(t),this.items.length<=this.maxItems)return;const e=this.items.shift();e&&this.onOverflow.fire(e)}pop(){return this.items.pop()}peek(t=0){return this.items[this.items.length-1+t]}getItems(){return[...this.items]}listenOverflow(...t){this.onOverflow.listen(...t)}}class m{constructor(){o(this,"position",new h);o(this,"_coord");o(this,"children",[]);this._coord=new x}get coord(){return this._coord}set coord(t){this._coord=this._coord.clone({scale:t.scale,scroll:t.scroll,angle:t.angle,flipY:t.flipY})}get childCount(){return this.children.length}get pos(){return this.position}get state(){return{position:this.position,coord:this.coord,children:this.children.map(t=>t.state)}}set state(t){for(this.position=t.position,this.coord=t.coord,this.children.length>t.children.length&&(this.children.length=t.children.length);this.children.length<t.children.length;)this.addChildPen();t.children.forEach((e,n)=>{this.children[n].state=e})}get leafs(){return this.childCount?this.children.flatMap(t=>t.leafs):[this]}addChildPen(t){const e=new m;return t&&(e.coord=t),this.children.push(e),e}clearChildren(){this.children.length=0}moveTo(t){this.position=t,this.children.forEach(e=>e.moveTo(t))}drawTo(t,e,n,i=.5,r=""){const l=t.ctx;r&&console.group(r);const a=e.multiply(this.coord.matrix);if(this.childCount===0){const u=a.transformPoint(this.position),d=a.transformPoint(n),v=l.lineWidth;l.beginPath(),l.lineWidth=v*i,l.moveTo(u.x,u.y),l.lineTo(d.x,d.y),r&&console.log(`${u.x} ${u.y}, ${d.x} ${d.y}`),l.stroke(),l.lineWidth=v}this.children.forEach((u,d)=>u.drawTo(t,a,n,i,r?`${r}-${d}`:"")),this.position=n,r&&console.groupEnd()}drawLines(t,e,n,i=.5){if(n.length<2)return;const r=t.ctx,l=e.multiply(this.coord.matrix);if(this.childCount===0){const[a,...u]=n,d=r.lineWidth;r.lineWidth=d*i,r.beginPath();const v=l.transformPoint(a);r.moveTo(v.x,v.y),u.forEach(k=>{const y=l.transformPoint(k);r.lineTo(y.x,y.y)}),r.stroke(),r.lineWidth=d}this.children.forEach(a=>a.drawLines(t,l,n,i))}drayRun(t,e){const n=t.multiply(this.coord.matrix);return this.childCount===0?[e.map(i=>{const r=n.transformPoint(i.point);return{point:new h(r.x,r.y),pressure:i.pressure}})]:this.children.flatMap(i=>i.drayRun(n,e))}}const et=s=>s.reduce((t,e)=>t+e,0)/s.length,st=s=>{if(!s.length)return 0;const t=Math.floor(s.length*.9);return s[t].pressure},nt=s=>s.length?et(s.map(t=>t.pressure).filter(t=>t>0)):0,_=s=>{const t=s.findIndex((l,a)=>a>0&&l.pressure===0);if(t===-1)return[s];const e=s.slice(0,t),n=s.slice(t),i=!(e.length===1&&e[0].pressure===0),r=!(n.length===1&&n[0].pressure===0);return[...i?[e]:[],...r?_(n):[]]},q=(s,t,e)=>{const n=new DOMMatrix;s.coord=t.canvasCoord,s.ctx.strokeStyle=t.style.color,s.ctx.lineWidth=t.style.penSize*t.canvasCoord.scale;const i=new m;if(i.state=t.penState,e)_(t.inputs).forEach(l=>{const a=nt(l);i.drawLines(s,n,l.map(u=>u.point),a)});else{const[r,...l]=t.inputs;if(!r)return;i.moveTo(r.point),l.forEach(a=>{a.pressure?i.drawTo(s,n,a.point,a.pressure):i.moveTo(a.point)})}},it=s=>{s.clear()},ot=(s,t,e,n=!1)=>{e.forEach(i=>{i.tool==="pen"&&(C(t),q(t,i,n),t.copy(s.ctx,{alpha:i.style.alpha})),i.tool==="clearAll"&&it(s)}),t.clear()},rt=s=>s.flatMap(t=>{if(!t.length)return t;const e=t[0],n=t[t.length-1];return[{point:e.point,pressure:0},...t,{point:n.point,pressure:0}]});class L{constructor(t,e,n,i="pen"){o(this,"inputs",[]);o(this,"penState");o(this,"style");o(this,"canvasCoord");o(this,"tool");this.canvasCoord=t,this.penState=e,this.style=n,this.tool=i}addPoint(t,e){this.inputs.push({point:t,pressure:e})}clearPoints(t=!1,e=!1){const n=t?this.inputs.shift():void 0,i=e?this.inputs.pop():void 0;this.inputs.length=0,n&&this.inputs.push(n),i&&this.inputs.push(i)}get flatten(){const t=new m;t.state=this.penState;const e=t.drayRun(new DOMMatrix,this.inputs),n=rt(e);t.clearChildren();const i=new L(this.canvasCoord,t.state,this.style,this.tool);return i.inputs.push(...n),i}}const lt=110,A=10;class at{constructor(t,e){o(this,"canvasWidth");o(this,"canvasHeight");o(this,"history",new Y(1/0));o(this,"snapshots",new Y(lt/A));o(this,"currentStroke");o(this,"lastSnapshotIndex",0);o(this,"oldestSnapshotIndex",0);o(this,"oldestSnapshot");this.canvasWidth=t,this.canvasHeight=e,this.addSnapshot(),this.snapshots.listenOverflow(n=>{this.oldestSnapshotIndex+=A,this.oldestSnapshot=n,console.log(`oldestSnapshotIndex: ${this.oldestSnapshotIndex}`)})}get strokes(){return this.history.peek()}get snapshot(){return this.snapshots.peek()}get prevSnapshot(){return this.snapshots.peek(-1)}get lastHistories(){return this.history.getItems().slice(this.lastSnapshotIndex+1)}addSnapshot(){const t=new b(this.canvasWidth,this.canvasHeight);this.snapshots.push(t);const e=this.prevSnapshot;e&&t.ctx.drawImage(e.el,0,0),this.lastSnapshotIndex=this.history.length-1}start(t,e,n,i){const r=new L(t,e,n,i);return this.currentStroke=r,r}commit(t){if(!this.currentStroke)return;this.history.push(this.currentStroke),t&&t.copy(this.snapshot.ctx,{alpha:this.currentStroke.style.alpha}),this.history.length-this.lastSnapshotIndex-1===A&&(console.log("new snapshot",this.snapshots.length),this.addSnapshot()),this.currentStroke=void 0}rollback(){!this.currentStroke||(console.log("stroke rollbacked"),this.currentStroke=void 0)}get current(){return this.currentStroke}get undoable(){return this.history.length>this.oldestSnapshotIndex}undo(t,e){var i;if(!this.undoable)return console.log("no more history"),!1;const n=(i=this.prevSnapshot)!=null?i:this.oldestSnapshot;return n?t.ctx.drawImage(n.el,0,0):console.log("no prev"),this.history.pop(),ot(t,e,this.lastHistories),!this.lastHistories.length&&this.snapshots.length>1&&(this.snapshots.pop(),console.log("back prev snap",this.snapshots.length),this.lastSnapshotIndex-=A),!0}}class T{constructor(t){o(this,"color");o(this,"penSize");o(this,"alpha");var e,n,i;this.color=(e=t==null?void 0:t.color)!=null?e:"#000000",this.penSize=(n=t==null?void 0:t.penSize)!=null?n:10,this.alpha=(i=t==null?void 0:t.alpha)!=null?i:1}toData(){return{color:this.color,penSize:this.penSize,alpha:this.alpha}}clone(t){return new T(P(P({},this.toData()),t))}}const w=800,E=800,f=1,ht=3;class ct{constructor(t){o(this,"canvas");o(this,"strokeCanvas");o(this,"view");o(this,"keyWatcher");o(this,"dragWatcher");o(this,"eventStatus",{isWatchMove:!1,isUseStrokeCanvas:!1,activeEvent:void 0,startCoord:new x,startPoint:new h,isCapturing:!1});o(this,"history");o(this,"requestChangeZoom",new g);o(this,"requestScrollTo",new g);o(this,"requestRotateTo",new g);o(this,"pen");o(this,"style",new T);o(this,"stamp");o(this,"_isKaleido",!1);var n,i;this.canvas=new b(w*f,E*f),this.strokeCanvas=new b(w*f,E*f),this.view=new b(w*f,E*f),this.history=new at(w*f,E*f),t.appendChild(this.view.el);const e=document.getElementById("debug");e&&(this.canvas.el.style.width=`${w*.25}px`,this.canvas.el.style.height=`${w*.25}px`,this.strokeCanvas.el.style.width=`${w*.25}px`,this.strokeCanvas.el.style.height=`${w*.25}px`,(n=e.querySelector(".canvas"))==null||n.appendChild(this.canvas.el),(i=e.querySelector(".stroke"))==null||i.appendChild(this.strokeCanvas.el)),this.registerEventHandlers(),this.keyWatcher=new F,this.keyWatcher.listen(()=>{this.view.el.style.cursor=tt(K(this.keyWatcher.keys))}),this.dragWatcher=new j(this.view.el),this.dragWatcher.listenMove(({dStart:r})=>{const l=this.eventStatus.startCoord.scroll.move(r.scale(1/this.coord.scale).rotate(-this.coord.angle));this.requestScrollTo.fire(l)}),this.dragWatcher.listenRotate(({dStart:r})=>{const l=V(this.eventStatus.startCoord.angle+r);this.requestRotateTo.fire(l)}),this.pen=new m,this.clear(!1)}registerEventHandlers(){const t=this.view.el;let e=new h;t.addEventListener("pointerdown",n=>{e=new h(n.screenX,n.screenY),this.onDown(n)}),t.addEventListener("pointermove",n=>{if(!this.eventStatus.isWatchMove)return;const i=new h(n.screenX,n.screenY);i.sub(e).length<ht||(this.onMove(n),e=i)}),t.addEventListener("pointerup",n=>this.eventStatus.isWatchMove&&this.onUp(n))}get coord(){return this.canvas.coord}set coord(t){this.canvas.coord=t.clone({}),this.rePaint()}get isKaleido(){return this._isKaleido}set isKaleido(t){if(t!==this._isKaleido){if(this._isKaleido=t,t){const e=this.penCount;this.penCount=1,this.penCount=e}this.rePaint()}}get penCount(){return this.pen.childCount}set penCount(t){if(t===this.penCount)return;const e=this.pen;e.clearChildren();for(let n=0;n<t;n++){const i=this._isKaleido&&n%2!=0;e.addChildPen(new x({angle:n*360/t,flipY:i}))}this.rePaint()}set penWidth(t){this.style=this.style.clone({penSize:t})}set penColor(t){this.style=this.style.clone({color:t})}set penAlpha(t){this.style=this.style.clone({alpha:t})}listenRequestZoom(...t){this.requestChangeZoom.listen(...t)}listenRequestScrollTo(...t){this.requestScrollTo.listen(...t)}listenRequestRotateTo(...t){this.requestRotateTo.listen(...t)}clear(t=!0){t&&(this.history.start(this.coord,this.pen.state,this.style,"clearAll"),this.history.commit()),this.canvas.clear(),this.rePaint()}undo(){!this.history.undoable||(this.clear(!1),this.history.undo(this.canvas,this.strokeCanvas),this.rePaint())}async toImgBlob(){return new Promise((t,e)=>{this.canvas.el.toBlob(n=>n?t(n):e())})}event2canvasPoint(t){return new h(t.offsetX*f-w/2,t.offsetY*f-E/2)}onDown(t){const e=K(this.keyWatcher.keys);this.eventStatus.activeEvent=e,this.eventStatus.startCoord=this.coord,this.eventStatus.startPoint=this.event2canvasPoint(t),this.eventStatus.isCapturing=t.metaKey,(e==="draw"||e==="draw:line"||e==="draw:stamp")&&(this.eventStatus.isWatchMove=!0,this.startStroke(this.eventStatus.startPoint)),e==="zoomup"&&this.requestChangeZoom.fire(!0),e==="zoomdown"&&this.requestChangeZoom.fire(!1),e==="scroll"&&(this.eventStatus.isWatchMove=!0,this.dragWatcher.watchingAction="dragmove"),e==="rotate"&&(this.eventStatus.isWatchMove=!0,this.dragWatcher.watchingAction="dragrotate")}onMove(t){const e=this.eventStatus.activeEvent;if(e==="draw"&&this.continueStroke(this.event2canvasPoint(t),t.pressure||.5),e==="draw:line"&&(C(this.strokeCanvas),this.pen.moveTo(this.eventStatus.startPoint),this.continueStroke(this.event2canvasPoint(t),t.pressure||.5)),e==="draw:stamp"&&this.stamp){C(this.strokeCanvas);const n=this.event2canvasPoint(t).sub(this.eventStatus.startPoint),i=n.length/100;this.putStroke(this.stamp,this.eventStatus.startPoint,i,n.angle,!0)}t.preventDefault()}onUp(t){var i,r;const e=this.eventStatus.activeEvent,n=e==="draw"||e==="draw:line"||e==="draw:stamp";if(e==="draw"&&this.continueStroke(this.event2canvasPoint(t),t.pressure||0),e==="draw:line"&&(C(this.strokeCanvas),this.pen.moveTo(this.eventStatus.startPoint),this.continueStroke(this.event2canvasPoint(t),this.history.current?st(this.history.current.inputs):.5),(i=this.history.current)==null||i.clearPoints(!0,!0)),e==="draw:stamp"&&this.stamp){C(this.strokeCanvas);const l=this.event2canvasPoint(t).sub(this.eventStatus.startPoint),a=l.length/100;this.putStroke(this.stamp,this.eventStatus.startPoint,a,l.angle,!1)}if((e==="draw"||e==="draw:line")&&this.eventStatus.isCapturing){this.stamp=(r=this.history.current)==null?void 0:r.flatten,this.endStroke(!1),this.rePaint();return}this.endStroke(n)}startStroke(t){var e;this.eventStatus.isUseStrokeCanvas=!0,this.strokeCanvas.coord=this.canvas.coord,this.strokeCanvas.ctx.lineWidth=this.style.penSize*this.canvas.coord.scale,this.strokeCanvas.ctx.strokeStyle=this.eventStatus.isCapturing?"#0044aa":this.style.color,this.history.start(this.coord,this.pen.state,this.style),(e=this.history.current)==null||e.addPoint(t,.5),this.pen.moveTo(t)}continueStroke(t,e=.5){var n;(n=this.history.current)==null||n.addPoint(t,e),this.pen.drawTo(this.strokeCanvas,new DOMMatrix,t,e),this.rePaint()}endStroke(t){t?(this.history.commit(this.strokeCanvas),this.strokeCanvas.copy(this.canvas.ctx,{alpha:this.style.alpha}),C(this.strokeCanvas)):(this.history.rollback(),C(this.strokeCanvas)),this.eventStatus.isWatchMove=!1,this.eventStatus.isUseStrokeCanvas=!1,this.eventStatus.activeEvent=void 0,this.dragWatcher.watchingAction=void 0}putStroke(t,e,n,i,r){const l=new m;l.state=this.pen.state;const a=new m;a.state=t.penState,a.coord=a.coord.clone({scroll:e,scale:n,angle:i}),l.leafs.forEach(v=>v.addChildPen()),l.leafs.forEach(v=>v.state=a.state);const u=new L(this.coord,l.state,this.style,t.tool);u.inputs.push(...t.inputs),q(this.strokeCanvas,u,r),this.rePaint();const d=this.history.current;!r&&d&&(this.history.rollback(),this.history.start(d.canvasCoord,l.state,this.style,d.tool).inputs.push(...t.inputs))}rePaint(){J(this.view,"#cccccc"),this.canvas.output(this.view.ctx),this.eventStatus.isUseStrokeCanvas&&this.strokeCanvas.output(this.view.ctx,{alpha:this.style.alpha}),this.penCount>=2&&Q(this.view,this.penCount,this.isKaleido)}}class D{constructor(t){o(this,"el");const e=this.el=document.createElement("button");e.className="Button",e.textContent=t}addEventListener(...t){return this.el.addEventListener(...t)}removeEventListener(...t){return this.el.removeEventListener(...t)}}class S{constructor(t,e=0,n=100,i=0,r=!1){o(this,"el");o(this,"elSlider");o(this,"elText");o(this,"isPercent");const l=this.el=document.createElement("div"),a=this.elSlider=document.createElement("input"),u=document.createElement("label"),d=document.createElement("span"),v=this.elText=document.createElement("span");this.isPercent=r,l.appendChild(u),u.appendChild(d),u.appendChild(v),u.appendChild(a),a.type="range",a.className="Slider",a.min=String(e),a.max=String(n),a.value=String(i),d.textContent=`${t}: `,v.textContent=a.value,a.addEventListener("input",()=>{v.textContent=a.value})}get value(){return this.elSlider.valueAsNumber*(this.isPercent?.01:1)}set value(t){const e=t*(this.isPercent?100:1);this.elSlider.value=String(e),this.elText.textContent=String(e)}addEventListener(...t){return this.elSlider.addEventListener(...t)}removeEventListener(...t){return this.elSlider.removeEventListener(...t)}}class ut{constructor(t,e=!1){o(this,"el");o(this,"elCheck");const n=this.el=document.createElement("div"),i=this.elCheck=document.createElement("input"),r=document.createElement("label"),l=document.createElement("span");n.appendChild(r),r.appendChild(i),r.appendChild(l),i.type="checkbox",i.className="Checkbox",i.checked=e,l.textContent=t}get value(){return this.elCheck.checked}set value(t){this.elCheck.checked=t}addEventListener(...t){return this.elCheck.addEventListener(...t)}removeEventListener(...t){return this.elCheck.removeEventListener(...t)}}class dt{constructor(t,e=!1){o(this,"el");o(this,"elColor");const n=this.el=document.createElement("div"),i=this.elColor=document.createElement("input"),r=document.createElement("label"),l=document.createElement("span");n.appendChild(r),r.appendChild(i),r.appendChild(l),i.type="color",i.className="ColorSelect",i.checked=e,l.textContent=t}get value(){return this.elColor.value}set value(t){this.elColor.value=t}addEventListener(...t){return this.elColor.addEventListener(...t)}removeEventListener(...t){return this.elColor.removeEventListener(...t)}}class pt{constructor(t){o(this,"slScale");o(this,"slAngle");o(this,"slX");o(this,"slY");o(this,"slPenCount");o(this,"slPenWidth");o(this,"cbKaleido");o(this,"csDrawingColor");o(this,"slDrawingAlpha");o(this,"onScaleChange",new g);o(this,"onAngleChange",new g);o(this,"onScrollChange",new g);o(this,"onPenCountChange",new g);o(this,"onPenWidthChange",new g);o(this,"onClear",new g);o(this,"onUndo",new g);o(this,"onCopy",new g);o(this,"onKaleidoChange",new g);o(this,"onDrawingColorChange",new g);o(this,"onDrawingAlphaChange",new g);o(this,"canvasWidth",800);o(this,"canvasHeight",800);const e=this.slScale=new S("Scale",50,300,100,!0),n=this.slAngle=new S("Angle",-360,360,0),i=this.slX=new S("Scroll X",-this.canvasWidth/2,this.canvasWidth/2,0),r=this.slY=new S("Scroll Y",-this.canvasHeight/2,this.canvasHeight/2,0),l=this.slPenCount=new S("Pen Count",1,32,1),a=this.slPenWidth=new S("Pen Size",1,40,10),u=new D("Clear All"),d=new D("Undo"),v=new D("Copy Image"),k=this.cbKaleido=new ut("Kalaidoscope"),y=this.csDrawingColor=new dt("Pen Color"),W=this.slDrawingAlpha=new S("Pen Alpha",1,100,100,!0);t.appendChild(l.el),t.appendChild(k.el),t.appendChild(y.el),t.appendChild(W.el),t.appendChild(a.el),t.appendChild(u.el),t.appendChild(d.el),t.appendChild(v.el),e.addEventListener("input",()=>{this.onScaleChange.fire(e.value)}),n.addEventListener("input",()=>{this.onAngleChange.fire(n.value)}),i.addEventListener("input",()=>{this.onScrollChange.fire(new h(i.value,r.value))}),r.addEventListener("input",()=>{this.onScrollChange.fire(new h(i.value,r.value))}),l.addEventListener("input",()=>{this.onPenCountChange.fire(l.value)}),a.addEventListener("input",()=>{this.onPenWidthChange.fire(a.value)}),u.addEventListener("click",()=>{this.onClear.fire()}),d.addEventListener("click",()=>{this.onUndo.fire()}),v.addEventListener("click",()=>{this.onCopy.fire()}),k.addEventListener("change",()=>{this.onKaleidoChange.fire(k.value)}),y.addEventListener("input",()=>{this.onDrawingColorChange.fire(y.value)}),W.addEventListener("input",()=>{this.onDrawingAlphaChange.fire(W.value)})}get scale(){return this.slScale.value}get angle(){return this.slAngle.value}get scroll(){return new h(this.slX.value,this.slY.value)}get penCount(){return this.slPenCount.value}get penWidth(){return this.slPenWidth.value}get kaleidoscope(){return this.cbKaleido.value}get drawingColor(){return this.csDrawingColor.value}get drawingAlpha(){return this.slDrawingAlpha.value}set scale(t){this.scale!==t&&(this.slScale.value=t,this.onScaleChange.fire(this.slScale.value),this.updateScrollRange())}set angle(t){this.angle!==t&&(this.slAngle.value=t,this.onAngleChange.fire(this.slAngle.value))}set scrollX(t){this.slX.value!==t&&(this.slX.value=t,this.onScrollChange.fire(new h(this.slX.value,this.slY.value)))}set scrollY(t){this.slY.value!==t&&(this.slY.value=t,this.onScrollChange.fire(new h(this.slX.value,this.slY.value)))}set penCount(t){this.penCount!==t&&(this.slPenCount.value=t,this.onPenCountChange.fire(this.slPenCount.value))}set penWidth(t){this.penWidth!==t&&(this.slPenWidth.value=t,this.onPenWidthChange.fire(this.slPenWidth.value))}set kaleidoscope(t){this.kaleidoscope!==t&&(this.cbKaleido.value=t,t&&(this.penCount+=this.penCount%2),this.slPenCount.elSlider.min=t?"2":"1",this.slPenCount.elSlider.step=t?"2":"1",this.onKaleidoChange.fire(this.cbKaleido.value))}set drawingColor(t){this.drawingColor!==t&&(this.csDrawingColor.value=t,this.onDrawingColorChange.fire(this.csDrawingColor.value))}set drawingAlpa(t){this.drawingAlpa!==t&&(this.slDrawingAlpha.value=t,this.onDrawingAlphaChange.fire(this.slDrawingAlpha.value))}penCountUp(){this.penCount+=this.kaleidoscope?2:1}penCountDown(){this.penCount-=this.kaleidoscope?2:1}updateScrollRange(){const t=this.canvasWidth/2*this.scale,e=this.canvasHeight/2*this.scale;this.slX.elSlider.min=String(-t),this.slX.elSlider.max=String(t),this.slY.elSlider.min=String(-e),this.slY.elSlider.max=String(e)}}const H=.2,z=4,X=[0,H,.33,.5,.67,.75,1,1.5,2,2.5,3,3.5,z,1/0],gt=(s,t)=>{var r;const e=t?X:[...X].reverse(),n=e.findIndex(l=>t?l>s:l<s),i=(r=e[n])!=null?r:0;return Math.max(H,Math.min(z,i))},U=document.querySelector("#main"),vt=document.querySelector("#palette"),c=new pt(vt),p=new ct(U);c.onScaleChange.listen(s=>{p.coord=p.coord.clone({scale:s})});c.onAngleChange.listen(s=>{p.coord=p.coord.clone({angle:s})});c.onScrollChange.listen(s=>{p.coord=p.coord.clone({scroll:s})});c.onPenCountChange.listen(s=>{p.penCount=s});c.onPenWidthChange.listen(s=>{p.penWidth=s});c.onClear.listen(()=>{p.clear()});c.onUndo.listen(()=>{p.undo()});c.onCopy.listen(async()=>{const s=await p.toImgBlob(),t=new ClipboardItem({"image/png":s});await navigator.clipboard.write([t])});c.onKaleidoChange.listen(s=>{p.isKaleido=s});c.onDrawingColorChange.listen(s=>{p.penColor=s});c.onDrawingAlphaChange.listen(s=>{p.penAlpha=s});p.coord=p.coord.clone({scroll:c.scroll,scale:c.scale,angle:c.angle});p.listenRequestZoom(s=>{c.scale=gt(c.scale,s)});p.listenRequestScrollTo(s=>{c.scrollX=s.x,c.scrollY=s.y});p.listenRequestRotateTo(s=>{c.angle=s});window.addEventListener("keydown",s=>{s.key==="ArrowUp"&&c.penCountUp(),s.key==="ArrowDown"&&c.penCountDown(),s.key==="z"&&s.metaKey&&c.onUndo.fire(),s.key==="z"&&s.metaKey&&c.onCopy.fire()});c.kaleidoscope=!0;c.penCount=6;U.addEventListener("touchmove",function(s){s.preventDefault()});const ft=navigator.language==="ja"?"ja":"en";document.querySelectorAll(".lang").forEach(s=>s.style.display="none");document.querySelectorAll(`.lang.${ft}`).forEach(s=>s.style.display="");
