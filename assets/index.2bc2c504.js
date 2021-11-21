var vt=Object.defineProperty;var J=Object.getOwnPropertySymbols;var ft=Object.prototype.hasOwnProperty,Ct=Object.prototype.propertyIsEnumerable;var F=(s,t,e)=>t in s?vt(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e,R=(s,t)=>{for(var e in t||(t={}))ft.call(t,e)&&F(s,e,t[e]);if(J)for(var e of J(t))Ct.call(t,e)&&F(s,e,t[e]);return s};var r=(s,t,e)=>(F(s,typeof t!="symbol"?t+"":t,e),e);const mt=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function e(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerpolicy&&(i.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?i.credentials="include":o.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=e(o);fetch(o.href,i)}};mt();class d{constructor(t=0,e=0){r(this,"x");r(this,"y");this.x=t,this.y=e}equals(t){return this.x===t.x&&this.y===t.y}move(t){return new d(this.x+t.x,this.y+t.y)}sub(t){return new d(this.x-t.x,this.y-t.y)}get angle(){return Math.atan2(this.y,this.x)/Math.PI*180}get length(){return Math.sqrt(this.x**2+this.y**2)}rotate(t){const e=t/180*Math.PI,n=Math.cos(e),o=Math.sin(e),i=this.x*n-this.y*o,l=this.x*o+this.y*n;return new d(i,l)}scale(t){return new d(this.x*t,this.y*t)}get invert(){return this.scale(-1)}}const Q=s=>new d(s.x,s.y);class C{constructor(t){r(this,"scroll");r(this,"scale");r(this,"angle");r(this,"flipY");r(this,"_matrix");var e,n,o,i;this.scroll=(e=t==null?void 0:t.scroll)!=null?e:new d,this.scale=(n=t==null?void 0:t.scale)!=null?n:1,this.angle=(o=t==null?void 0:t.angle)!=null?o:0,this.flipY=(i=t==null?void 0:t.flipY)!=null?i:!1,this._matrix=new DOMMatrix().translateSelf(this.scroll.x,this.scroll.y).scaleSelf(this.scale,this.scale*(this.flipY?-1:1)).rotateSelf(this.angle)}toData(){return{scroll:this.scroll,scale:this.scale,angle:this.angle,flipY:this.flipY}}clone(t){const e=this.toData();return new C(R(R({},e),t))}get invert(){return new C({scroll:this.scroll.scale(-1),scale:1/this.scale,angle:-this.angle})}get matrix(){return this._matrix.translate(0)}get matrixScrollAfter(){return new DOMMatrix().scaleSelf(this.scale,this.scale*(this.flipY?-1:1)).rotateSelf(this.angle).translateSelf(this.scroll.x,this.scroll.y)}}class q{constructor(t,e){r(this,"el");r(this,"ctx");r(this,"width");r(this,"height");r(this,"_coord");const n=document.createElement("canvas"),o=n.getContext("2d");if(!o)throw new Error("Failed to get 2d context for canvas");this.width=t,this.height=e,n.width=t,n.height=e,o.lineCap="round",this.el=n,this.ctx=o,this._coord=new C}get centor(){return new d(this.width/2,this.height/2)}set coord(t){const e=this.centor;this._coord=t,this.ctx.resetTransform(),this.ctx.translate(e.x,e.y),this.ctx.translate(t.scroll.x,t.scroll.y),this.ctx.rotate(-t.angle/180*Math.PI),this.ctx.scale(1/t.scale,1/t.scale)}get coord(){return this._coord}output(t,e){const n=this.centor;t.save();const o=this.coord;t.resetTransform(),t.translate(n.x,n.y),t.scale(o.scale,o.scale),t.rotate(o.angle/180*Math.PI),t.translate(-o.scroll.x,-o.scroll.y),t.translate(-n.x,-n.y),this.transferImageTo(t,e),t.restore()}copy(t,e){t.save(),t.resetTransform(),this.transferImageTo(t,e),t.restore()}transferImageTo(t,e){var n,o;t.globalAlpha=(n=e==null?void 0:e.alpha)!=null?n:1,t.globalCompositeOperation=(o=e==null?void 0:e.composition)!=null?o:"source-over",(e==null?void 0:e.background)&&(t.fillStyle=e.background,t.fillRect(0,0,this.width,this.height)),t.drawImage(this.el,0,0)}}class f{constructor(){r(this,"listeners",[])}fire(t){this.listeners.forEach(e=>e(t))}listen(t){this.listeners.includes(t)||this.listeners.push(t)}clear(){this.listeners.length=0}}const O=s=>{const t=s>=0?s%360:360+s%360;return t<=180?t:-360+t},tt=s=>s/180*Math.PI,b=s=>{s.ctx.save(),s.ctx.resetTransform(),s.ctx.clearRect(0,0,s.width,s.height),s.ctx.restore()},wt=(s,t)=>{s.ctx.save(),s.ctx.resetTransform(),s.ctx.fillStyle=t,s.ctx.fillRect(0,0,s.width,s.height),s.ctx.restore()},et=(s,t,e,n,o="#91bccc")=>{const i=o,l=`${o}88`,h=new d(s.width/2,s.height/2).move(n.scroll),g=Math.sqrt(s.width**2+s.height**2);s.ctx.save(),s.ctx.resetTransform(),s.ctx.translate(h.x,h.y),s.ctx.rotate(tt(n.angle)),s.ctx.lineWidth=1,s.ctx.rotate(tt(-90+360/t/2));for(let c=0;c<t;c++){const p=e&&c%2!=0;s.ctx.strokeStyle=p?l:i,s.ctx.setLineDash(p?[4,4]:[]),s.ctx.beginPath(),s.ctx.moveTo(0,0),s.ctx.lineTo(0,g),s.ctx.stroke(),s.ctx.closePath(),s.ctx.rotate(360/t/180*Math.PI)}s.ctx.restore()};class H{constructor(t=10){r(this,"maxItems");r(this,"items",[]);r(this,"onOverflow",new f);this.maxItems=t}get length(){return this.items.length}clear(){this.items.length=0}push(t){if(this.items.push(t),this.items.length<=this.maxItems)return;const e=this.items.shift();e&&this.onOverflow.fire(e)}pop(){return this.items.pop()}peek(t=0){return this.items[this.items.length-1+t]}getItems(){return[...this.items]}listenOverflow(...t){this.onOverflow.listen(...t)}}class _{constructor(){r(this,"_coord",new C);r(this,"children",[])}get coord(){return this._coord}set coord(t){this._coord=this._coord.clone(t)}get childCount(){return this.children.length}get state(){return{coord:this.coord,children:this.children.map(t=>t.state)}}set state(t){for(this.coord=t.coord,this.children.length>t.children.length&&(this.children.length=t.children.length);this.children.length<t.children.length;)this.addChildPen();t.children.forEach((e,n)=>{this.children[n].state=e})}get leafs(){return this.childCount?this.children.flatMap(t=>t.leafs):[this]}childAt(t){return this.children[t]}matrices(t){const e=t.multiply(this.coord.matrix);return this.childCount?this.children.flatMap(n=>n.matrices(e)):[e]}firstPenCoord(){return this.childCount?[this.coord,...this.children[0].firstPenCoord()]:[this.coord]}addChildPen(t){const e=new _;return t&&(e.coord=t),this.children.push(e),e}clearChildren(){this.children.length=0}drawTo(t,e,n,o=.5){if(o<=0)return;const i=t.ctx,l=[e,n],a=this.dryRun([{point:l[0],pressure:0},{point:l[1],pressure:o}]),h=i.lineWidth;a.forEach(([g,c])=>{if(!c)return;const p=[g.point,c.point],[m,x]=p;i.beginPath(),i.moveTo(m.x,m.y),i.lineWidth=h*c.pressure,i.lineTo(x.x,x.y),i.stroke()}),i.lineWidth=h}drawLines(t,e,n=.5){if(e.length<2)return;const o=t.ctx,i=e.map(h=>({point:h,pressure:n})),l=this.dryRun(i),a=o.lineWidth;o.lineWidth=a*n,l.forEach(h=>{const g=h.map(m=>m.point),[c,...p]=g;o.beginPath(),o.moveTo(c.x,c.y),p.forEach(m=>{o.lineTo(m.x,m.y)}),o.stroke()}),o.lineWidth=a}dryRun(t){const e=this.matrices(new DOMMatrix),n=e[0].inverse();return e.map(o=>t.map(i=>{const l=n.transformPoint(i.point);return{point:Q(o.transformPoint(l)),pressure:i.pressure}}))}}const St=s=>s.reduce((t,e)=>t+e,0)/s.length,yt=s=>{if(!s.length)return 0;const t=Math.floor(s.length*.9);return s[t].pressure},Pt=s=>s.length?St(s.map(t=>t.pressure).filter(t=>t>0)):0,st=s=>{const t=s.findIndex((l,a)=>a>0&&l.pressure===0);if(t===-1)return[s];const e=s.slice(0,t),n=s.slice(t),o=!(e.length===1&&e[0].pressure===0),i=!(n.length===1&&n[0].pressure===0);return[...o?[e]:[],...i?st(n):[]]},nt=(s,t,e)=>{s.ctx.strokeStyle=t.style.color,s.ctx.lineWidth=t.style.penSize*t.canvasCoord.scale;const n=new _;if(n.state=t.penState,e)st(t.inputs).forEach(i=>{const l=Pt(i);n.drawLines(s,i.map(a=>a.point),l)});else{const[o,...i]=t.inputs;if(!o)return;let l=o;i.forEach(a=>{a.pressure&&n.drawTo(s,l.point,a.point,a.pressure),l=a})}},xt=s=>{b(s)},kt=(s,t,e,n=!1)=>{e.forEach(o=>{o.tool==="pen"&&(b(t),nt(t,o,n),t.copy(s.ctx,{alpha:o.style.alpha,composition:o.style.composition})),o.tool==="clearAll"&&xt(s)}),b(t)},bt=s=>s.flatMap(t=>{if(!t.length)return t;const e=t[0],n=t[t.length-1];return[{point:e.point,pressure:0},...t,{point:n.point,pressure:0}]});class N{constructor(t,e,n,o="pen"){r(this,"inputs",[]);r(this,"penState");r(this,"style");r(this,"canvasCoord");r(this,"tool");this.canvasCoord=t,this.penState=e,this.style=n,this.tool=o}addPoint(t,e){this.inputs.push({point:t,pressure:e})}clearPoints(t=!1,e=!1){const n=t?this.inputs.shift():void 0,o=e?this.inputs.pop():void 0;this.inputs.length=0,n&&this.inputs.push(n),o&&this.inputs.push(o)}get flatten(){const t=new _;t.state=this.penState;const e=t.dryRun(this.inputs),n=Q(this.canvasCoord.matrixScrollAfter.transformPoint(t.coord.scroll)).invert,o=bt(e).map(l=>({point:l.point.move(n),pressure:l.pressure}));t.clearChildren(),t.coord=new C;const i=new N(this.canvasCoord,t.state,this.style,this.tool);return i.inputs.push(...o),i}}const Et=110,Y=10;class Tt{constructor(t,e){r(this,"canvasWidth");r(this,"canvasHeight");r(this,"history",new H(1/0));r(this,"snapshots",new H(Et/Y));r(this,"currentStroke");r(this,"lastSnapshotIndex",0);r(this,"oldestSnapshotIndex",0);this.canvasWidth=t,this.canvasHeight=e,this.snapshots.listenOverflow(()=>{this.oldestSnapshotIndex+=Y,console.log(`oldestSnapshotIndex: ${this.oldestSnapshotIndex}`)})}get strokes(){return this.history.peek()}get snapshot(){return this.snapshots.peek()}get prevSnapshot(){return this.snapshots.peek(-1)}get lastHistories(){return this.history.getItems().slice(this.lastSnapshotIndex)}addSnapshot(){const t=new q(this.canvasWidth,this.canvasHeight);this.snapshots.push(t);const e=this.prevSnapshot;e&&t.ctx.drawImage(e.el,0,0);const n=document.querySelector("#debug .history .snaps");if(n){const o=120/Math.max(t.el.width,t.el.height);t.el.style.width=`${t.el.width*o}px`,t.el.style.height=`${t.el.height*o}px`,n.appendChild(t.el),t.el.scrollIntoView()}this.lastSnapshotIndex=this.history.length-1}start(t,e,n,o){const i=new N(t,e,n,o);return this.currentStroke=i,i}commit(t){if(!this.currentStroke)return;if(this.history.push(this.currentStroke),this.history.length-this.lastSnapshotIndex-1===Y){if(this.addSnapshot(),!this.snapshot){console.error("failed to add snapshot");return}t.copy(this.snapshot.ctx,{alpha:this.currentStroke.style.alpha}),console.log("new snapshot",this.snapshots.length)}this.currentStroke=void 0}rollback(){!this.currentStroke||(console.log("stroke rollbacked"),this.currentStroke=void 0)}get current(){return this.currentStroke}get undoable(){return this.history.length>this.oldestSnapshotIndex}undo(t,e){var o;if(!this.undoable)return console.log("no more history"),!1;t.ctx.save();const n=this.snapshot;if(n?(t.ctx.resetTransform(),t.ctx.drawImage(n.el,0,0)):console.log("no prev"),this.history.pop(),kt(t,e,this.lastHistories),!this.lastHistories.length&&this.snapshots.length>=1){const i=this.snapshots.pop();i&&((o=i.el.parentNode)==null||o.removeChild(i.el)),this.lastSnapshotIndex-=Y,console.log("back prev snap",this.snapshots.length,this.snapshots)}return t.ctx.restore(),!0}}class ${constructor(t){r(this,"color");r(this,"penSize");r(this,"alpha");r(this,"composition");var e,n,o,i;this.color=(e=t==null?void 0:t.color)!=null?e:"#000000",this.penSize=(n=t==null?void 0:t.penSize)!=null?n:10,this.alpha=(o=t==null?void 0:t.alpha)!=null?o:1,this.composition=(i=t==null?void 0:t.composition)!=null?i:""}toData(){return{color:this.color,penSize:this.penSize,alpha:this.alpha,composition:this.composition}}clone(t){return new $(R(R({},this.toData()),t))}}const At=s=>{var t;return(t={draw:"crosshair",scroll:"move",zoomup:"zoom-in",zoomdown:"zoom-out",rotate:"grab","draw:line":"crosshair","draw:stamp":"crosshair"}[s])!=null?t:"default"},Lt=s=>{const t=s.getBoundingClientRect();return new d(t.left+t.width/2,t.top+t.height/2)},Mt=(s,t,e)=>{const n=t.sub(s).angle;return e.sub(s).angle-n},ot=(s,t,e)=>({distance:e.sub(t),angle:Mt(Lt(s),t,e)}),_t=(s,t,e,n,o=1)=>{const i={startPoint:new d,lastRawPoint:new d,isWatchMove:!1},l=c=>{!c.isPrimary||(i.startPoint=i.lastRawPoint=new d(c.clientX,c.clientY),i.isWatchMove=t(c))},a=c=>{if(!c.isPrimary||!i.isWatchMove)return;const p=new d(c.clientX,c.clientY);p.sub(i.lastRawPoint).length<o||(e(c,ot(s,i.startPoint,p)),i.lastRawPoint=p)},h=c=>{if(!c.isPrimary||!i.isWatchMove)return;const p=new d(c.clientX,c.clientY);n(c,ot(s,i.startPoint,p)),i.isWatchMove=!1};return s.addEventListener("pointerdown",l),s.addEventListener("pointermove",a),s.addEventListener("pointerup",h),()=>{s.removeEventListener("pointerdown",l),s.removeEventListener("pointermove",a),s.removeEventListener("pointerup",h)}},It=200,Dt=300,Rt=10,it=s=>{const[t,e]=s,n=new d((t.x+e.x)/2,(t.y+e.y)/2),o=t.sub(n).angle,i=e.sub(t).length;return{center:n,angle:o,dist:i}},Kt=s=>{const[t,e]=s;return{scroll:e.center.sub(t.center),angle:O(e.angle-t.angle),scale:e.dist/t.dist,center:e.center}},G=s=>{const t=[];for(let e=0;e<s.length;e++)t.push(s[e]);return t},Wt=(s,t,e=1)=>{let n=[],o,i=0,l=!1,a=0,h=0;const g=()=>{i=Date.now(),l=!1,a=0,h=0},c=()=>Date.now()-i<=It,p=()=>{if(!(n.length<2))return[n[0].pagePoint,n[1].pagePoint]},m=S=>{const P=G(S).map(w=>w.identifier);n=n.filter(w=>!P.includes(w.identifier))},x=S=>{m(S);const P=G(S).map(w=>({identifier:w.identifier,pagePoint:new d(w.clientX,w.clientY)}));n=[...n,...P]},T=S=>{const P=G(S);let w=!1;return P.forEach(E=>{const D=n.find(W=>W.identifier===E.identifier);if(!D)return;const K=new d(E.clientX,E.clientY);D.pagePoint.sub(K).length<=e||(D.pagePoint=K,w=!0)}),w},A=S=>{var w;const P=n.length;x(S.changedTouches),P===0&&g(),P<=1&&n.length>=2&&c()&&(l=!0,o=p(),(w=t.onStart)==null||w.call(t)),a=Math.max(a,n.length)},k=S=>{var P,w,E;m(S.changedTouches),n.length<=1&&l&&(l=!1,o=void 0,(P=t.onEnd)==null||P.call(t),Date.now()-i<Dt&&h<=Rt&&(a===2&&((w=t.onTwoFingerTap)==null||w.call(t)),a===3&&((E=t.onThreeFingerTap)==null||E.call(t))))},L=S=>{var E;if(!l||!T(S.changedTouches))return;const w=p();if(o&&w){const[D,K]=[it(o),it(w)],W=Kt([D,K]);h=Math.max(h,W.scroll.length),(E=t.onTransform)==null||E.call(t,W,a)}};return s.addEventListener("touchstart",A),s.addEventListener("touchend",k),s.addEventListener("touchcancel",k),s.addEventListener("touchmove",L),()=>{s.removeEventListener("touchstart",A),s.removeEventListener("touchend",k),s.removeEventListener("touchcancel",k),s.removeEventListener("touchmove",L)}},rt=.2,lt=4,at=[0,rt,.33,.5,.67,.75,1,1.5,2,2.5,3,3.5,lt,1/0],ht=(s,t)=>{var i;const e=t?at:[...at].reverse(),n=e.findIndex(l=>t?l>s:l<s),o=(i=e[n])!=null?i:0;return Math.max(rt,Math.min(lt,o))},Z=.1,qt=3,ct=(s,t)=>t.sub(s).angle,Ot=(s,t,e)=>{const n=e.sub(t);return n.rotate(s-n.angle).move(t)},Nt=(s,t,e=.5)=>{const n=new d(1,0).rotate(s).scale(1-e),o=new d(1,0).rotate(t).scale(e);return n.move(o).angle};class Yt{constructor(){r(this,"inps",new H(30))}clear(){this.inps.clear()}add(t){const e=this.inps.peek();if(!e||this.inps.length<qt)return this.inps.push(t),t;const n=this.avrAngle(),o=ct(e.point,t.point),i=Nt(n,o,1-Z),l=Ot(i,e.point,t.point),a=this.avrPressure()*Z+t.pressure*(1-Z),h={point:l,pressure:a};return this.inps.push(h),h}avrAngle(){const t=this.inps.getItems(),e=t.map((o,i)=>{const l=t[i+1];return l?ct(o.point,l.point):NaN}).filter(o=>!isNaN(o)),n=e.map((o,i)=>{const l=e[i-1];return l===void 0?0:O(o-l)});return O(e[0]+n.reduce((o,i)=>o+i,0)/n.length)}avrPressure(){const t=this.inps.getItems();return t.map(e=>e.pressure).reduce((e,n)=>e+n)/t.length}}const U=(s,t)=>{if(s.length!==t.length)return!1;for(let e=0;e<s.length;e++)if(s[e]!==t[e])return!1;return!0},y=2,ut=3,Ut={normal:"",eraser:"destination-out"};class zt{constructor(t,e,n){r(this,"width");r(this,"height");r(this,"canvas");r(this,"strokeCanvas");r(this,"view");r(this,"eventStatus",{isUseStrokeCanvas:!1,activeEvent:void 0,startCoord:new C,startAnchor:[new C,new C],startPoint:new d,lastPoint:new d,isCapturing:!1,isInMultiTouch:!1});r(this,"history");r(this,"requestChangeZoom",new f);r(this,"requestScrollTo",new f);r(this,"requestRotateTo",new f);r(this,"requestUndo",new f);r(this,"requestAnchorTransform",new f);r(this,"requestAnchorReset",new f);r(this,"pen",new _);r(this,"style",new $);r(this,"stamp");r(this,"_tool","draw");r(this,"_backgroundColor","#ffffff");r(this,"_anchor",new C);r(this,"_anchorChild",new C);r(this,"_penCount",[1,0]);r(this,"_isKaleido",[!1,!1]);r(this,"smoother",new Yt);r(this,"view2canvasPos",(t,e)=>{const n=e==="start"?this.eventStatus.startCoord:this.coord;return t.scale(1/n.scale).rotate(-n.angle).move(n.scroll)});var i,l;this.width=e,this.height=n,this.canvas=new q(this.width*y,this.height*y),this.strokeCanvas=new q(this.width*y,this.height*y),this.view=new q(this.width*y,this.height*y),this.history=new Tt(this.width*y,this.height*y),this.view.el.style.width=`${e}px`,this.view.el.style.height=`${n}px`,t.appendChild(this.view.el);const o=document.getElementById("debug");if(o){const a=200/Math.max(e,n);this.canvas.el.style.width=`${e*a}px`,this.canvas.el.style.height=`${n*a}px`,this.strokeCanvas.el.style.width=`${e*a}px`,this.strokeCanvas.el.style.height=`${n*a}px`,(i=o.querySelector(".canvas"))==null||i.appendChild(this.canvas.el),(l=o.querySelector(".stroke"))==null||l.appendChild(this.strokeCanvas.el)}Wt(this.view.el,{onStart:()=>{this.endStroke(!1),this.eventStatus.isInMultiTouch=!0},onTransform:(a,h)=>h>=3?this.onTouchTramsformAnchor(a):this.onTouchTramsformCanvas(a),onEnd:()=>{this.eventStatus.isInMultiTouch=!1},onTwoFingerTap:()=>this.requestUndo.fire(),onThreeFingerTap:()=>this.requestAnchorReset.fire()},ut),_t(this.view.el,a=>!this.eventStatus.isInMultiTouch&&this.onDown(a),(a,h)=>!this.eventStatus.isInMultiTouch&&this.onDrag(a,h),(a,h)=>!this.eventStatus.isInMultiTouch&&this.onUp(a,h),ut),this.childAnchor=new C({scroll:new d(300,0),angle:0}),this.tool="draw",this.clear(!1)}get coord(){return this.canvas.coord}set coord(t){this.canvas.coord=t.clone({}),this.rePaint()}get tool(){return this._tool}set tool(t){this._tool=t,this.view.el.style.cursor=At(t)}get isKaleido(){return[...this._isKaleido]}set isKaleido(t){U(this.isKaleido,t)||(this._isKaleido=[...t],this.rebuildPen(),this.rePaint())}get penCount(){return this._penCount}set penCount(t){U(this.penCount,t)||(this._penCount=[...t],this.rebuildPen(),this.rePaint())}get hasSubPen(){return this.penCount[1]>=1}set penWidth(t){this.style=this.style.clone({penSize:t})}set penColor(t){this.style=this.style.clone({color:t})}set penAlpha(t){this.style=this.style.clone({alpha:t})}get penKind(){return this.style.composition===""?"normal":"eraser"}set penKind(t){this.style=this.style.clone({composition:Ut[t]})}get hasStamp(){return!!this.stamp}get backgroundColor(){return this._backgroundColor}set backgroundColor(t){this._backgroundColor!==t&&(this._backgroundColor=t,this.rePaint())}get anchor(){return this._anchor}set anchor(t){this._anchor=t,this.rebuildPen(),this.rePaint()}get childAnchor(){return this._anchorChild}set childAnchor(t){this._anchorChild=t,this.rebuildPen(),this.rePaint()}get relativeChildAnchor(){return new C({scroll:this.childAnchor.scroll.sub(this.anchor.scroll).rotate(-this.anchor.angle),angle:this.childAnchor.angle})}rebuildPen(){const t=this.pen,[e,n]=this.isKaleido,[o,i]=[this.penCount[0]*(e?2:1),this.penCount[1]*(n?2:1)],l=this.relativeChildAnchor;t.clearChildren(),t.coord=this._anchor;for(let a=0;a<o;a++){const h=this._isKaleido[0]&&a%2!=0,g=t.addChildPen(new C({angle:a/o*360,flipY:h}));for(let c=0;c<i;c++){const p=this._isKaleido[1]&&c%2!=0;g.addChildPen(new C({scroll:l.scroll,angle:l.angle})).addChildPen(new C({angle:c/i*360,flipY:p}))}}}listenRequestZoom(...t){this.requestChangeZoom.listen(...t)}listenRequestScrollTo(...t){this.requestScrollTo.listen(...t)}listenRequestRotateTo(...t){this.requestRotateTo.listen(...t)}listenRequestUndo(...t){this.requestUndo.listen(...t)}listenRequestAnchorTransform(...t){this.requestAnchorTransform.listen(...t)}listenRequestAnchorReset(...t){this.requestAnchorReset.listen(...t)}clear(t=!0){t&&(this.history.start(this.coord,this.pen.state,this.style,"clearAll"),this.history.commit(this.canvas)),b(this.canvas),this.rePaint()}undo(){!this.history.undoable||(this.clear(!1),this.history.undo(this.canvas,this.strokeCanvas),this.rePaint())}async toImgBlob(){return new Promise((t,e)=>{this.canvas.el.toBlob(n=>n?t(n):e())})}event2viewPoint(t){return new d((t.offsetX-this.width/2)*y,(t.offsetY-this.height/2)*y)}onDown(t){const e=this.tool;if(this.eventStatus.activeEvent=e,this.eventStatus.startCoord=this.coord,this.eventStatus.startAnchor=[this.anchor,this.childAnchor],this.eventStatus.lastPoint=this.eventStatus.startPoint=this.event2viewPoint(t),this.eventStatus.isCapturing=t.metaKey,this.smoother.clear(),e==="zoomup"||e==="zoomdown"){const n=this.coord.scale;return e==="zoomup"&&this.requestChangeZoom.fire(ht(n,!0)),e==="zoomdown"&&this.requestChangeZoom.fire(ht(n,!1)),!1}return(e==="draw"||e==="draw:line"||e==="draw:stamp")&&this.startStroke(this.eventStatus.startPoint),!0}onDrag(t,e){const n=this.eventStatus.activeEvent,o=this.event2viewPoint(t),i=this.smoother.add({point:o,pressure:t.pressure});if(n==="draw"&&(this.continueStroke(i.point,i.pressure||.5),this.eventStatus.lastPoint=i.point),n==="draw:line"&&(b(this.strokeCanvas),this.continueStroke(i.point,i.pressure||.5)),n==="draw:stamp"&&this.stamp){b(this.strokeCanvas);const l=i.point.sub(this.eventStatus.startPoint),a=l.length/100;this.putStroke(this.stamp,this.eventStatus.startPoint,a,l.angle,!0)}n==="scroll"&&this.onScroll(e),n==="rotate"&&this.onRotate(e),t.preventDefault()}onUp(t,e){var l,a;const n=this.eventStatus.activeEvent,o=this.event2viewPoint(t),i=n==="draw"||n==="draw:line"||n==="draw:stamp";if(n==="draw"&&this.continueStroke(o,t.pressure||0),n==="draw:line"&&(b(this.strokeCanvas),this.continueStroke(o,this.history.current?yt(this.history.current.inputs):.5),(l=this.history.current)==null||l.clearPoints(!0,!0)),n==="draw:stamp"&&this.stamp){b(this.strokeCanvas);const h=o.sub(this.eventStatus.startPoint),g=h.length/100;this.putStroke(this.stamp,this.eventStatus.startPoint,g,h.angle,!1)}if((n==="draw"||n==="draw:line")&&this.eventStatus.isCapturing){this.stamp=(a=this.history.current)==null?void 0:a.flatten,this.endStroke(!1),this.rePaint();return}n==="scroll"&&this.onScroll(e),n==="rotate"&&this.onRotate(e),this.endStroke(i)}startStroke(t){var o;const e=this.view2canvasPos(t,"start");this.eventStatus.isUseStrokeCanvas=!0,this.strokeCanvas.coord=new C,this.strokeCanvas.ctx.lineWidth=this.style.penSize*this.canvas.coord.scale;const n=()=>this.eventStatus.isCapturing?"#0044aa":this.penKind==="eraser"?this.backgroundColor:this.style.color;this.strokeCanvas.ctx.strokeStyle=n(),this.history.start(this.coord,this.pen.state,this.style),(o=this.history.current)==null||o.addPoint(e,.5)}continueStroke(t,e=.5){var i;const n=this.view2canvasPos(this.eventStatus.lastPoint,"start"),o=this.view2canvasPos(t,"start");(i=this.history.current)==null||i.addPoint(o,e),this.pen.drawTo(this.strokeCanvas,n,o,e),this.rePaint()}endStroke(t){t?(this.history.commit(this.canvas),this.strokeCanvas.copy(this.canvas.ctx,{alpha:this.style.alpha,composition:this.style.composition}),b(this.strokeCanvas)):(this.history.rollback(),b(this.strokeCanvas)),this.eventStatus.isUseStrokeCanvas=!1,this.eventStatus.activeEvent=void 0,this.rePaint()}onScroll(t){const e=this.eventStatus.startCoord.scroll.move(t.distance.scale(-1/this.coord.scale*y).rotate(-this.coord.angle));this.requestScrollTo.fire(e)}onRotate(t){const e=this.eventStatus.startCoord.angle+t.angle;this.requestRotateTo.fire(O(e))}onTouchTramsformCanvas(t){const e=this.eventStatus.startCoord,{center:n,scroll:o,scale:i,angle:l}=t,a=L=>L.rotate(-e.angle).scale(1/e.scale),h=new d((n.x-this.width/2)*y,(n.y-this.height/2)*y),g=this.view2canvasPos(h,"start"),c=new d(0,0),p=this.view2canvasPos(c,"start"),m=g.sub(p),T=m.rotate(-l).scale(1/i).sub(m),A=o.scale(y),k=a(A);this.requestRotateTo.fire(e.angle+l),this.requestChangeZoom.fire(e.scale*i),this.requestScrollTo.fire(e.scroll.sub(T).sub(k))}onTouchTramsformAnchor(t){const e=this.hasSubPen?"child":"root",n=this.eventStatus.startAnchor[this.hasSubPen?1:0],o=t.angle+n.angle,i=t.scroll.scale(1/this.eventStatus.startCoord.scale*y).rotate(-this.eventStatus.startCoord.angle).move(n.scroll);this.requestAnchorTransform.fire({coord:n.clone({scroll:i,angle:o}),target:e})}putStroke(t,e,n,o,i){const l=new _;l.state=this.pen.state;const a=this.style.clone({color:this.penKind==="eraser"?this.backgroundColor:this.style.color}),h=e,g=new N(this.coord,l.state,i?a:this.style,t.tool),c=t.inputs.map(m=>({point:m.point.scale(n).rotate(o).move(h),pressure:m.pressure}));g.inputs.push(...c),nt(this.strokeCanvas,g,i),this.rePaint();const p=this.history.current;!i&&p&&(p.clearPoints(),p.inputs.push(...g.inputs))}rePaint(){wt(this.view,"#cccccc"),this.canvas.output(this.view.ctx,{background:this.backgroundColor}),this.eventStatus.isUseStrokeCanvas&&(this.strokeCanvas.ctx.save(),this.strokeCanvas.coord=this.canvas.coord,this.strokeCanvas.output(this.view.ctx,{alpha:this.style.alpha}),this.strokeCanvas.ctx.restore());const[t,e]=this.penCount,[n,o]=[t>=2,e>=2];n&&et(this.view,t*(this.isKaleido[0]?2:1),this.isKaleido[0],new C({scroll:this.coord.scroll.invert.move(this.anchor.scroll).scale(this.canvas.coord.scale).rotate(this.coord.angle),angle:this.coord.angle+this.anchor.angle}),o?"#cccccc":void 0),o&&et(this.view,e*(this.isKaleido[1]?2:1),this.isKaleido[1],new C({scroll:this.coord.scroll.invert.move(this.childAnchor.scroll).scale(this.canvas.coord.scale).rotate(this.coord.angle),angle:this.coord.angle+this.anchor.angle+this.childAnchor.angle}),"#eeaabb")}}class V{constructor(t){r(this,"el");const e=this.el=document.createElement("button");e.className="Button",e.textContent=t}addEventListener(...t){return this.el.addEventListener(...t)}removeEventListener(...t){return this.el.removeEventListener(...t)}}class M{constructor(t,e=0,n=100,o=0,i=!1){r(this,"el");r(this,"elSlider");r(this,"elText");r(this,"isPercent");const l=this.el=document.createElement("div"),a=this.elSlider=document.createElement("input"),h=document.createElement("label"),g=document.createElement("span"),c=this.elText=document.createElement("span");this.isPercent=i,l.appendChild(h),h.appendChild(g),h.appendChild(c),h.appendChild(a),a.type="range",a.className="Slider",a.min=String(e),a.max=String(n),a.value=String(o),g.textContent=`${t}: `,c.textContent=a.value,a.addEventListener("input",()=>{c.textContent=a.value})}get value(){return this.elSlider.valueAsNumber*(this.isPercent?.01:1)}set value(t){const e=t*(this.isPercent?100:1);this.elSlider.value=String(e),this.elText.textContent=String(e)}addEventListener(...t){return this.elSlider.addEventListener(...t)}removeEventListener(...t){return this.elSlider.removeEventListener(...t)}}class z{constructor(t,e=!1){r(this,"el");r(this,"elCheck");const n=this.el=document.createElement("div"),o=this.elCheck=document.createElement("input"),i=document.createElement("label"),l=document.createElement("span");n.appendChild(i),i.appendChild(o),i.appendChild(l),n.className="Checkbox",o.type="checkbox",o.checked=e,l.textContent=t}get value(){return this.elCheck.checked}set value(t){this.elCheck.checked=t}addEventListener(...t){return this.elCheck.addEventListener(...t)}removeEventListener(...t){return this.elCheck.removeEventListener(...t)}}class dt{constructor(t,e=!1){r(this,"el");r(this,"elColor");const n=this.el=document.createElement("div"),o=this.elColor=document.createElement("input"),i=document.createElement("label"),l=document.createElement("span");n.appendChild(i),i.appendChild(o),i.appendChild(l),n.className="ColorSelector",o.type="color",o.checked=e,l.textContent=t}get value(){return this.elColor.value}set value(t){this.elColor.value=t}addEventListener(...t){return this.elColor.addEventListener(...t)}removeEventListener(...t){return this.elColor.removeEventListener(...t)}}class Xt{constructor(t,e){r(this,"checks");r(this,"_value");r(this,"el");r(this,"_updating",!1);r(this,"onChange",new f);const n=Object.keys(t);this.checks=n.map(i=>({cb:new z(t[i]),key:i})),this.value=e,this._value=e,this.checks.forEach(i=>{i.cb.addEventListener("change",()=>{this._updating||i.cb.value&&(this.value=i.key)})});const o=this.el=document.createElement("div");o.className="RadioGroup",this.checks.forEach(i=>{o.appendChild(i.cb.el)})}get value(){return this._value}set value(t){const e=this._value!==t;this._value=t,this.updateChecked(),!!e&&this.onChange.fire(t)}updateChecked(){this._updating=!0,this.checks.forEach(t=>t.cb.value=t.key===this.value),this._updating=!1}listenChange(...t){this.onChange.listen(...t)}}const Bt={draw:"Draw","draw:line":"Line","draw:stamp":"Stamp",scroll:"Move",rotate:"Rotate",zoomup:"+",zoomdown:"-"};class Ft{constructor(t,e){r(this,"slScale");r(this,"slAngle");r(this,"slX");r(this,"slY");r(this,"slPenCount1");r(this,"slPenCount2");r(this,"slPenWidth");r(this,"cbKaleido1");r(this,"cbKaleido2");r(this,"cbEraser");r(this,"csDrawingColor");r(this,"csCanvasColor");r(this,"slDrawingAlpha");r(this,"cbTools");r(this,"onScaleChange",new f);r(this,"onAngleChange",new f);r(this,"onScrollChange",new f);r(this,"onPenCountChange",new f);r(this,"onPenWidthChange",new f);r(this,"onClear",new f);r(this,"onUndo",new f);r(this,"onCopy",new f);r(this,"onKaleidoChange",new f);r(this,"onEraserChange",new f);r(this,"onDrawingColorChange",new f);r(this,"onCanvasColorChange",new f);r(this,"onDrawingAlphaChange",new f);r(this,"onToolChange",new f);r(this,"canvasWidth");r(this,"canvasHeight");this.canvasWidth=e.height,this.canvasHeight=e.height;const n=this.slScale=new M("Scale",50,300,100,!0),o=this.slAngle=new M("Angle",-360,360,0),i=this.slX=new M("Scroll X",-this.canvasWidth/2,this.canvasWidth/2,0),l=this.slY=new M("Scroll Y",-this.canvasHeight/2,this.canvasHeight/2,0),a=this.slPenCount1=new M("Pen Count Parent",1,16,1),h=this.slPenCount2=new M("Pen Count Child",0,8,1),g=this.slPenWidth=new M("Pen Size",2,100,20),c=new V("Clear All"),p=new V("Undo"),m=new V("Copy Image"),x=this.cbKaleido1=new z("Kalaidoscope"),T=this.cbKaleido2=new z("Kalaidoscope"),A=this.cbEraser=new z("Eraser"),k=this.csDrawingColor=new dt("Pen Color"),L=this.csCanvasColor=new dt("BG Color"),I=this.slDrawingAlpha=new M("Pen Alpha",1,100,100,!0),S=this.cbTools=new Xt(Bt,"draw");t.appendChild(S.el),t.appendChild(A.el),t.appendChild(k.el),t.appendChild(L.el),t.appendChild(a.el),t.appendChild(x.el),t.appendChild(h.el),t.appendChild(T.el),t.appendChild(I.el),t.appendChild(g.el),t.appendChild(c.el),t.appendChild(p.el),t.appendChild(m.el),n.addEventListener("input",()=>{this.onScaleChange.fire(n.value)}),o.addEventListener("input",()=>{this.onAngleChange.fire(o.value)}),i.addEventListener("input",()=>{this.onScrollChange.fire(new d(i.value,l.value))}),l.addEventListener("input",()=>{this.onScrollChange.fire(new d(i.value,l.value))}),a.addEventListener("input",()=>{this.onPenCountChange.fire([a.value,h.value])}),h.addEventListener("input",()=>{this.onPenCountChange.fire([a.value,h.value])}),g.addEventListener("input",()=>{this.onPenWidthChange.fire(g.value)}),c.addEventListener("click",()=>{this.onClear.fire()}),p.addEventListener("click",()=>{this.onUndo.fire()}),m.addEventListener("click",()=>{this.onCopy.fire()}),x.addEventListener("change",()=>{this.onKaleidoChange.fire([x.value,T.value])}),T.addEventListener("change",()=>{this.onKaleidoChange.fire([x.value,T.value])}),A.addEventListener("change",()=>{this.onEraserChange.fire(A.value)}),k.addEventListener("input",()=>{this.onDrawingColorChange.fire(k.value)}),L.addEventListener("input",()=>{this.onCanvasColorChange.fire(L.value)}),I.addEventListener("input",()=>{this.onDrawingAlphaChange.fire(I.value)}),S.listenChange(P=>this.onToolChange.fire(P))}get scale(){return this.slScale.value}get angle(){return this.slAngle.value}get scroll(){return new d(this.slX.value,this.slY.value)}get penCount(){return[this.slPenCount1.value,this.slPenCount2.value]}get penWidth(){return this.slPenWidth.value}get kaleidoscope(){return[this.cbKaleido1.value,this.cbKaleido2.value]}get drawingColor(){return this.csDrawingColor.value}get canvasColor(){return this.csCanvasColor.value}get drawingAlpha(){return this.slDrawingAlpha.value}get tool(){return this.cbTools.value}get eraser(){return this.cbEraser.value}set scale(t){this.scale!==t&&(this.slScale.value=t,this.onScaleChange.fire(this.slScale.value),this.updateScrollRange())}set angle(t){this.angle!==t&&(this.slAngle.value=t,this.onAngleChange.fire(this.slAngle.value))}set scrollX(t){this.slX.value!==t&&(this.slX.value=t,this.onScrollChange.fire(new d(this.slX.value,this.slY.value)))}set scrollY(t){this.slY.value!==t&&(this.slY.value=t,this.onScrollChange.fire(new d(this.slX.value,this.slY.value)))}set penCount(t){U(this.penCount,t)||(this.slPenCount1.value=t[0],this.slPenCount2.value=t[1],this.onPenCountChange.fire([this.slPenCount1.value,this.slPenCount2.value]))}set penWidth(t){this.penWidth!==t&&(this.slPenWidth.value=t,this.onPenWidthChange.fire(this.slPenWidth.value))}set kaleidoscope(t){U(this.kaleidoscope,t)||(this.cbKaleido1.value=t[0],this.cbKaleido2.value=t[1],this.onKaleidoChange.fire([this.cbKaleido1.value,this.cbKaleido2.value]))}set drawingColor(t){this.drawingColor!==t&&(this.csDrawingColor.value=t,this.onDrawingColorChange.fire(this.csDrawingColor.value))}set canvasColor(t){this.canvasColor!==t&&(this.csCanvasColor.value=t,this.onCanvasColorChange.fire(this.csCanvasColor.value))}set drawingAlpa(t){this.drawingAlpa!==t&&(this.slDrawingAlpha.value=t,this.onDrawingAlphaChange.fire(this.slDrawingAlpha.value))}set tool(t){this.cbTools.value=t}set eraser(t){this.cbEraser.value=t}penCountUp(){const[t,e]=this.penCount;this.penCount=[t+1,e]}penCountDown(){const[t,e]=this.penCount;t<=1||(this.penCount=[t-1,e])}updateScrollRange(){const t=this.canvasWidth/2*this.scale,e=this.canvasHeight/2*this.scale;this.slX.elSlider.min=String(-t),this.slX.elSlider.max=String(t),this.slY.elSlider.min=String(-e),this.slY.elSlider.max=String(e)}}class Ht{constructor(t){r(this,"target");r(this,"_keys",{});r(this,"_removeEvents");r(this,"onChange",new f);this.target=t!=null?t:document.body;const e=o=>{const i=o.key;this._keys[i]=!0,this.onChange.fire({key:i,isDown:!0})},n=o=>{const i=o.key;delete this._keys[i],this.onChange.fire({key:i,isDown:!1})};this.target.addEventListener("keydown",e),this.target.addEventListener("keyup",n),this._removeEvents=()=>{this.target.removeEventListener("keydown",e),this.target.removeEventListener("keyup",n)}}listen(...t){this.onChange.listen(...t)}destroy(){this._removeEvents(),this.onChange.clear()}key(t){return!!this._keys[t]}get keys(){return Object.keys(this._keys)}}const $t=s=>{const t=s.includes(" "),e=s.includes("Alt"),n=s.includes("Meta"),o=s.includes("Shift");return t&&n&&e?"zoomdown":t&&n?"zoomup":t&&e?"rotate":t?"scroll":o?"draw:line":e?"draw:stamp":"draw"};class Gt{constructor(){r(this,"keyWatcher");r(this,"tool");r(this,"onChange",new f);this.keyWatcher=new Ht,this.keyWatcher.listen(()=>{const t=$t(this.keyWatcher.keys);this.tool!==t&&(this.tool=t,this.onChange.fire(t))})}listenChange(...t){this.onChange.listen(...t)}}const X=document.querySelector("#main"),pt=document.querySelector("#palette"),j=document.querySelector("#toast"),B=new d(X.offsetWidth,X.offsetHeight),Zt=s=>{j.textContent=s,j.classList.add("visible"),setTimeout(()=>{j.classList.remove("visible")},5e3)},v=new Ft(pt,{width:B.x,height:B.y}),u=new zt(X,B.x,B.y);v.onScaleChange.listen(s=>{u.coord=u.coord.clone({scale:s})});v.onAngleChange.listen(s=>{u.coord=u.coord.clone({angle:s})});v.onScrollChange.listen(s=>{u.coord=u.coord.clone({scroll:s})});v.onPenCountChange.listen(s=>{u.penCount=s});v.onPenWidthChange.listen(s=>{u.penWidth=s});v.onClear.listen(()=>{u.clear()});v.onUndo.listen(()=>{u.undo()});const Vt=async()=>{const s=await u.toImgBlob(),t=new ClipboardItem({"image/png":s});await navigator.clipboard.write([t])};v.onCopy.listen(()=>{Vt().catch(s=>{console.error(s),alert("failed to copy img.")})});v.onKaleidoChange.listen(s=>{u.isKaleido=s});v.onEraserChange.listen(s=>{u.penKind=s?"eraser":"normal"});v.onDrawingColorChange.listen(s=>{u.penColor=s});v.onCanvasColorChange.listen(s=>{u.backgroundColor=s});v.onDrawingAlphaChange.listen(s=>{u.penAlpha=s});v.onToolChange.listen(s=>{if(u.tool=s,s==="draw:stamp"&&!u.hasStamp){const t={ja:"\u30B9\u30BF\u30F3\u30D7\u3092\u4F7F\u7528\u3059\u308B\u306B\u306F\u3001\u5148\u306BCommand(Ctrl)\u3092\u62BC\u3057\u306A\u304C\u3089\u7DDA\u3092\u5F15\u3044\u3066\u30B9\u30BF\u30F3\u30D7\u3092\u8A18\u9332\u3057\u307E\u3059",en:"Before using stamp, draw with Command(Ctrl) key for record a stroke."}[gt];Zt(t)}});u.coord=u.coord.clone({scroll:v.scroll,scale:v.scale,angle:v.angle});u.listenRequestZoom(s=>{u.coord=u.coord.clone({scale:s})});u.listenRequestScrollTo(s=>{u.coord=u.coord.clone({scroll:s})});u.listenRequestRotateTo(s=>{u.coord=u.coord.clone({angle:s})});u.listenRequestUndo(()=>{u.undo()});u.listenRequestAnchorTransform(({coord:s,target:t})=>{t==="root"&&(u.anchor=s),t==="child"&&(u.childAnchor=s)});u.listenRequestAnchorReset(()=>{u.anchor=new C});window.addEventListener("keydown",s=>{s.key==="ArrowUp"&&v.penCountUp(),s.key==="ArrowDown"&&v.penCountDown(),s.key==="z"&&s.metaKey&&v.onUndo.fire(),s.key==="z"&&s.metaKey&&v.onCopy.fire()});const jt=new Gt;jt.listenChange(s=>v.tool=s);v.kaleidoscope=[!0,!0];v.penCount=[6,4];v.canvasColor="#ffffff";X.addEventListener("touchmove",function(s){s.preventDefault()},{passive:!1});pt.addEventListener("touchmove",function(s){s.touches.length>=2&&s.preventDefault()},{passive:!1});const gt=navigator.language==="ja"?"ja":"en";document.querySelectorAll(".lang").forEach(s=>s.style.display="none");document.querySelectorAll(`.lang.${gt}`).forEach(s=>s.style.display="");
