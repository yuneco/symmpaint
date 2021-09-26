var t=Object.defineProperty,e=Object.getOwnPropertySymbols,s=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable,i=(e,s,n)=>s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[s]=n,o=(t,o)=>{for(var r in o||(o={}))s.call(o,r)&&i(t,r,o[r]);if(e)for(var r of e(o))n.call(o,r)&&i(t,r,o[r]);return t},r=(t,e,s)=>(i(t,"symbol"!=typeof e?e+"":e,s),s);!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver((t=>{for(const s of t)if("childList"===s.type)for(const t of s.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&e(t)})).observe(document,{childList:!0,subtree:!0})}function e(t){if(t.ep)return;t.ep=!0;const e=function(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerpolicy&&(e.referrerPolicy=t.referrerpolicy),"use-credentials"===t.crossorigin?e.credentials="include":"anonymous"===t.crossorigin?e.credentials="omit":e.credentials="same-origin",e}(t);fetch(t.href,e)}}();class l{constructor(t=0,e=0){r(this,"x"),r(this,"y"),this.x=t,this.y=e}equals(t){return this.x===t.x&&this.y===t.y}move(t){return new l(this.x+t.x,this.y+t.y)}sub(t){return new l(this.x-t.x,this.y-t.y)}rotate(t){const e=t/180*Math.PI,s=Math.cos(e),n=Math.sin(e),i=this.x*s-this.y*n,o=this.x*n+this.y*s;return new l(i,o)}scale(t){return new l(this.x*t,this.y*t)}}class h{constructor(t){var e,s,n,i;r(this,"anchor"),r(this,"scroll"),r(this,"scale"),r(this,"angle"),this.anchor=null!=(e=null==t?void 0:t.anchor)?e:new l,this.scroll=null!=(s=null==t?void 0:t.scroll)?s:new l,this.scale=null!=(n=null==t?void 0:t.scale)?n:1,this.angle=null!=(i=null==t?void 0:t.angle)?i:0}toData(){return{anchor:this.anchor,scroll:this.scroll,scale:this.scale,angle:this.angle}}clone(t){const e=this.toData();return new h(o(o({},e),t))}}class a{constructor(t,e=0,s=1){r(this,"ctx"),r(this,"outWidth"),r(this,"outHeight"),r(this,"position",new l),r(this,"_coord"),r(this,"children",[]),r(this,"color","#000000"),r(this,"lineWidth",10),r(this,"isDrawSelf",!0),this.ctx=t,this.outWidth=e,this.outHeight=s,this._coord=new h({anchor:new l(e/2,s/2)})}set coord(t){this._coord=this._coord.clone({scale:t.scale,scroll:t.scroll,angle:t.angle})}addChildPen(t){const e=new a(this.ctx,this.outWidth,this.outHeight);t&&(e.coord=t),this.children.push(e)}clearChildren(){this.children.length=0}applyCoord(){const t=this._coord;this.ctx.translate(-t.scroll.x,-t.scroll.y),this.ctx.translate(t.anchor.x,t.anchor.y),this.ctx.rotate(t.angle/180*Math.PI),this.ctx.scale(t.scale,t.scale),this.ctx.translate(-t.anchor.x,-t.anchor.y)}moveTo(t){this.position=t,this.children.forEach((e=>e.moveTo(t)))}drawTo(t,e=.5){this.ctx.save(),this.applyCoord(),this.isDrawSelf&&(this.ctx.lineWidth=this.lineWidth*e,this.ctx.strokeStyle=this.color,this.ctx.beginPath(),this.ctx.moveTo(this.position.x,this.position.y),this.ctx.lineTo(t.x,t.y),this.ctx.stroke()),this.children.forEach((s=>s.drawTo(t,e))),this.ctx.restore(),this.position=t}}class c{constructor(t,e){r(this,"el"),r(this,"ctx"),r(this,"width"),r(this,"height"),r(this,"_coord"),r(this,"_pen");const s=document.createElement("canvas"),n=s.getContext("2d");if(!n)throw new Error("Failed to get 2d context for canvas");this.width=t,this.height=e,s.width=t,s.height=e,s.style.border="1px solid #aaa",n.lineCap="round",this.el=s,this.ctx=n,this._coord=new h,this._pen=new a(n,t,e)}set coord(t){this._coord=t,this.ctx.resetTransform(),this.ctx.translate(-t.anchor.x,-t.anchor.y),this.ctx.scale(1/t.scale,1/t.scale),this.ctx.rotate(-t.angle/180*Math.PI),this.ctx.translate(t.anchor.x,t.anchor.y),this.ctx.translate(t.scroll.x,t.scroll.y)}get pen(){return this._pen}get coord(){return this._coord}moveTo(t){this.pen.moveTo(t)}drawTo(t,e=.5){this.pen.drawTo(t,e)}clear(){this.ctx.save(),this.ctx.resetTransform(),this.ctx.clearRect(0,0,this.width,this.height),this.ctx.restore()}output(t,e){e.save();const s=this.coord;e.resetTransform(),e.clearRect(0,0,t.width,t.height),e.translate(-s.scroll.x,-s.scroll.y),e.translate(-s.anchor.x,-s.anchor.y),e.rotate(s.angle/180*Math.PI),e.scale(s.scale,s.scale),e.translate(s.anchor.x,s.anchor.y),e.drawImage(this.el,0,0),e.strokeStyle="#aaaaaa",e.strokeRect(0,0,t.width,t.height),e.restore()}}class d{constructor(){r(this,"listeners",[])}fire(t){this.listeners.forEach((e=>e(t)))}listen(t){this.listeners.includes(t)||this.listeners.push(t)}clear(){this.listeners.length=0}}class u{constructor(t){r(this,"el"),r(this,"startPoint",new l),r(this,"lastPoint",new l),r(this,"isMoveWatching",!1),r(this,"onMoved",new d),r(this,"_removeEvents"),r(this,"watchingAction"),this.el=t;const e=t=>{this.isMoveWatching=this.onDown(new l(t.offsetX,t.offsetY))},s=t=>{this.isMoveWatching&&this.onDrag(new l(t.offsetX,t.offsetY))};this.el.addEventListener("pointerdown",e),this.el.addEventListener("pointermove",s),this._removeEvents=()=>{this.el.removeEventListener("pointerdown",e),this.el.removeEventListener("pointermove",s)}}onDown(t){return"dragmove"===this.watchingAction&&(this.startPoint=t,this.lastPoint=t,!0)}onDrag(t){if("dragmove"===this.watchingAction){const e=this.startPoint.sub(t),s=this.lastPoint.sub(t);this.lastPoint=t,this.onMoved.fire({dStart:e,dLast:s})}}listenMove(...t){this.onMoved.listen(...t)}destroy(){this._removeEvents(),this.onMoved.clear()}}class v{constructor(t){r(this,"target"),r(this,"_keys",{}),r(this,"_removeEvents"),r(this,"onChange",new d),this.target=null!=t?t:document.body;const e=t=>{const e=t.key;this._keys[e]=!0,this.onChange.fire({key:e,isDown:!0})},s=t=>{const e=t.key;delete this._keys[e],this.onChange.fire({key:e,isDown:!1})};this.target.addEventListener("keydown",e),this.target.addEventListener("keyup",s),this._removeEvents=()=>{this.target.removeEventListener("keydown",e),this.target.removeEventListener("keyup",s)}}listen(...t){this.onChange.listen(...t)}destroy(){this._removeEvents(),this.onChange.clear()}key(t){return!!this._keys[t]}get keys(){return Object.keys(this._keys)}}const g=t=>{const e=t.includes(" "),s=t.includes("Alt"),n=t.includes("Meta");return e&&n&&s?"zoomdown":e&&n?"zoomup":e?"scroll":"draw"};class w{constructor(t){r(this,"el");const e=this.el=document.createElement("button");e.className="Button",e.textContent=t}addEventListener(...t){return this.el.addEventListener(...t)}removeEventListener(...t){return this.el.removeEventListener(...t)}}class p{constructor(t,e=0,s=100,n=0,i=!1){r(this,"el"),r(this,"elSlider"),r(this,"elText"),r(this,"isPercent");const o=this.el=document.createElement("div"),l=this.elSlider=document.createElement("input"),h=document.createElement("label"),a=document.createElement("span"),c=this.elText=document.createElement("span");this.isPercent=i,o.appendChild(h),h.appendChild(a),h.appendChild(c),h.appendChild(l),l.type="range",l.className="Slider",l.min=String(e),l.max=String(s),l.value=String(n),a.textContent=`${t}: `,c.textContent=l.value,l.addEventListener("input",(()=>{c.textContent=l.value}))}get value(){return this.elSlider.valueAsNumber*(this.isPercent?.01:1)}set value(t){const e=t*(this.isPercent?100:1);this.elSlider.value=String(e),this.elText.textContent=String(e)}addEventListener(...t){return this.elSlider.addEventListener(...t)}removeEventListener(...t){return this.elSlider.removeEventListener(...t)}}const m=[0,.2,.33,.5,.67,.75,1,1.5,2,2.5,3,3.5,4,1/0],C=document.querySelector("#main"),y=document.querySelector("#palette"),f=new class{constructor(t){r(this,"slScale"),r(this,"slAngle"),r(this,"slX"),r(this,"slY"),r(this,"slPenCount"),r(this,"onScaleChange",new d),r(this,"onAngleChange",new d),r(this,"onScrollChange",new d),r(this,"onPenCountChange",new d),r(this,"onClear",new d);const e=this.slScale=new p("Scale",50,300,100,!0),s=this.slAngle=new p("Angle",-180,180,0),n=this.slX=new p("Scroll X",-400,400,0),i=this.slY=new p("Scroll Y",-400,400,0),o=this.slPenCount=new p("Pen Count",1,12,1),h=new w("Clear All");t.appendChild(e.el),t.appendChild(s.el),t.appendChild(n.el),t.appendChild(i.el),t.appendChild(o.el),t.appendChild(h.el),e.addEventListener("input",(()=>{this.onScaleChange.fire(e.value)})),s.addEventListener("input",(()=>{this.onAngleChange.fire(s.value)})),n.addEventListener("input",(()=>{this.onScrollChange.fire(new l(n.value,i.value))})),i.addEventListener("input",(()=>{this.onScrollChange.fire(new l(n.value,i.value))})),o.addEventListener("input",(()=>{this.onPenCountChange.fire(o.value)})),h.addEventListener("click",(()=>{this.onClear.fire()}))}get scale(){return this.slScale.value}get angle(){return this.slAngle.value}get scroll(){return new l(this.slX.value,this.slY.value)}get penCount(){return this.slPenCount.value}set scale(t){this.scale!==t&&(this.slScale.value=t,this.onScaleChange.fire(this.slScale.value))}set angle(t){this.angle!==t&&(this.slAngle.value=t,this.onAngleChange.fire(this.slAngle.value))}set scrollX(t){this.slX.value!==t&&(this.slX.value=t,this.onScrollChange.fire(new l(this.slX.value,this.slY.value)))}set scrollY(t){this.slY.value!==t&&(this.slY.value=t,this.onScrollChange.fire(new l(this.slX.value,this.slY.value)))}set penCount(t){this.penCount!==t&&(this.slPenCount.value=t,this.onPenCountChange.fire(this.slPenCount.value))}}(y),x=new class{constructor(t){r(this,"canvas"),r(this,"view"),r(this,"keyWatcher"),r(this,"dragWatcher"),r(this,"eventStatus",{isWatchMove:!1,activeEvent:void 0,startCoord:new h}),r(this,"requestChangeZoom",new d),r(this,"requestScrollTo",new d),r(this,"_penCount",1),this.canvas=new c(800,800),this.view=new c(800,800),t.appendChild(this.view.el),this.registerEventHandlers(),this.keyWatcher=new v,this.keyWatcher.listen((()=>{var t,e;this.view.el.style.cursor=(t=g(this.keyWatcher.keys),null!=(e={draw:"crosshair",scroll:"move",zoomup:"zoom-in",zoomdown:"zoom-out"}[t])?e:"default")})),this.dragWatcher=new u(this.view.el),this.dragWatcher.listenMove((({dStart:t})=>{const e=this.eventStatus.startCoord.scroll.move(t);this.requestScrollTo.fire(e)}))}registerEventHandlers(){const t=this.view.el;t.addEventListener("pointerdown",(t=>this.onDown(t))),t.addEventListener("pointermove",(t=>this.eventStatus.isWatchMove&&this.onMove(t))),t.addEventListener("pointerup",(t=>this.eventStatus.isWatchMove&&this.onUp(t)))}get coord(){return this.canvas.coord}set coord(t){this.canvas.coord=t.clone({anchor:new l(-400,-400)}),this.canvas.output(this.view.el,this.view.ctx)}get penCount(){return this._penCount}set penCount(t){if(t===this.penCount)return;const e=this.canvas.pen;if(e.clearChildren(),!(t<=1))for(let s=1;s<t;s++)e.addChildPen(new h({angle:360*s/t}))}listenRequestZoom(...t){this.requestChangeZoom.listen(...t)}listenRequestScrollTo(...t){this.requestScrollTo.listen(...t)}clear(){this.canvas.clear(),this.canvas.output(this.view.el,this.view.ctx)}event2canvasPoint(t){return new l(1*t.offsetX,1*t.offsetY)}onDown(t){const e=g(this.keyWatcher.keys);this.eventStatus.activeEvent=e,this.eventStatus.startCoord=this.coord,"draw"===e&&(this.eventStatus.isWatchMove=!0,this.moveTo(this.event2canvasPoint(t))),"zoomup"===e&&this.requestChangeZoom.fire(!0),"zoomdown"===e&&this.requestChangeZoom.fire(!1),"scroll"===e&&(this.eventStatus.isWatchMove=!0,this.dragWatcher.watchingAction="dragmove")}onMove(t){"draw"===this.eventStatus.activeEvent&&this.drawTo(this.event2canvasPoint(t),t.pressure)}onUp(t){"draw"===this.eventStatus.activeEvent&&this.drawTo(this.event2canvasPoint(t),t.pressure),this.eventStatus.isWatchMove=!1,this.eventStatus.activeEvent=void 0,this.dragWatcher.watchingAction=void 0}moveTo(t){this.canvas.moveTo(t)}drawTo(t,e=.5){this.canvas.drawTo(t,e),this.canvas.output(this.view.el,this.view.ctx)}}(C);f.onScaleChange.listen((t=>{x.coord=x.coord.clone({scale:t})})),f.onAngleChange.listen((t=>{x.coord=x.coord.clone({angle:t})})),f.onScrollChange.listen((t=>{x.coord=x.coord.clone({scroll:t})})),x.coord=x.coord.clone({scroll:f.scroll,scale:f.scale,angle:f.angle}),f.onPenCountChange.listen((t=>{x.penCount=t})),f.onClear.listen((()=>{x.clear()})),x.listenRequestZoom((t=>{f.scale=((t,e)=>{var s;const n=e?m:[...m].reverse(),i=n.findIndex((s=>e?s>t:s<t)),o=null!=(s=n[i])?s:0;return Math.max(.2,Math.min(4,o))})(f.scale,t)})),x.listenRequestScrollTo((t=>{f.scrollX=t.x,f.scrollY=t.y}));