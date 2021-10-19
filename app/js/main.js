"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,a){return t&&_defineProperties(e.prototype,t),a&&_defineProperties(e,a),e}function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function canvasApp(){var e,t,a,n,l,i,r,s,o,c,d,u,h,f,p,v,m,g,y,x,M,k,b,P,C,_,L,j,S,V,Y,w,X,E,A,I,T,Z,z,D=arguments.length>0&&void 0!==arguments[0]?arguments[0]:180,O=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[70,255,140],q=.7,B=document.getElementById("canvasOne"),R=B.getContext("2d");function W(){n=(a=1)-1,l=8,o=O[0],c=O[1],d=O[2],L="rgba("+o+","+c+","+d+",",s=1,e=B.width,t=B.height,f=e/2,p=t/2,v=(u=320)-2,i={},r={},b=.1,P=.1,C=.1,_=-0,M=2.5,0,y=0,x=-3-D,k=-750,g=2*Math.PI/5e3,m=0,setInterval(F,10/24)}function F(){if(++n>=a)for(n=0,E=0;E<l;E++){A=2*Math.random()*Math.PI,I=Math.acos(2*Math.random()-1),T=D*Math.sin(I)*Math.cos(A),Z=D*Math.sin(I)*Math.sin(A),z=D*Math.cos(I);var r=G(T,y+Z,x+z,.002*T,.002*Z,.002*z);r.attack=50,r.hold=50,r.decay=100,r.initValue=0,r.holdValue=s,r.lastValue=0,r.stuckTime=90+20*Math.random(),r.accelX=0,r.accelY=_,r.accelZ=0}for(m=(m+g)%(2*Math.PI),S=Math.sin(m),V=Math.cos(m),R.fillStyle="#000000",R.fillRect(0,0,e,t),r=i.first;null!=r;)j=r.next,r.age++,r.age>r.stuckTime&&(r.velX+=r.accelX+b*(2*Math.random()-1),r.velY+=r.accelY+P*(2*Math.random()-1),r.velZ+=r.accelZ+C*(2*Math.random()-1),r.x+=r.velX,r.y+=r.velY,r.z+=r.velZ),Y=V*r.x+S*(r.z-x),w=-S*r.x+V*(r.z-x)+x,h=q*u/(u-w),r.projX=Y*h+f,r.projY=r.y*h+p,r.age<r.attack+r.hold+r.decay?r.age<r.attack?r.alpha=(r.holdValue-r.initValue)/r.attack*r.age+r.initValue:r.age<r.attack+r.hold?r.alpha=r.holdValue:r.age<r.attack+r.hold+r.decay&&(r.alpha=(r.lastValue-r.holdValue)/r.decay*(r.age-r.attack-r.hold)+r.holdValue):r.dead=!0,r.projX>e||r.projX<0||r.projY<0||r.projY>t||w>v||r.dead?H(r):(X=(X=1-w/k)>1?1:X<0?0:X,R.fillStyle=L+X*r.alpha+")",R.beginPath(),R.arc(r.projX,r.projY,h*M,0,2*Math.PI,!1),R.fill(),R.closePath()),r=j}function G(e,t,a,n,l,s){var o;return null!=r.first?null!=(o=r.first).next?(r.first=o.next,o.next.prev=null):r.first=null:o={},null==i.first?(i.first=o,o.prev=null,o.next=null):(o.next=i.first,i.first.prev=o,i.first=o,o.prev=null),o.x=e,o.y=t,o.z=a,o.velX=n,o.velY=l,o.velZ=s,o.age=0,o.dead=!1,Math.random()<.5?o.right=!0:o.right=!1,o}function H(e){i.first==e?null!=e.next?(e.next.prev=null,i.first=e.next):i.first=null:null==e.next?e.prev.next=null:(e.prev.next=e.next,e.next.prev=e.prev),null==r.first?(r.first=e,e.prev=null,e.next=null):(e.next=r.first,r.first.prev=e,r.first=e,e.prev=null)}return W(),function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[o,c,d];L="rgba("+e[0]+","+e[1]+","+e[2]+","}}function getPoints(){var e=document.querySelector(".container"),t=document.createElement("canvas"),a=t.getContext("2d");a.beginPath(),a.strokeStyle="#ffffff",a.lineWidth=1,a.setLineDash([5,15]),a.moveTo(30,50),a.lineTo(550,300),a.stroke(),console.log(e),e.appendChild(t)}var Anima=function(){function e(t){var a=this;_classCallCheck(this,e),_defineProperty(this,"handleScroll",(function(e){e.preventDefault();var t=Date.now(),n=a.step;t-a.lastAnimation<a.delay||(e.deltaY<0||(a.step=a.step===a.steps?a.steps:++a.step),n!=a.step&&a.upd(),a.lastAnimation=t)})),this.element=document.querySelector(t),this.steps=4,this.step=1,this.delay=2e3,this.lastAnimation=0,this.setup(),this.changeColor=canvasApp(160,[1,136,245])}return _createClass(e,[{key:"setup",value:function(){document.addEventListener("wheel",this.handleScroll,{passive:!1}),document.addEventListener("touchmove",this.handleScroll,{passive:!1}),document.addEventListener("touchstart",this.handleScroll,{passive:!1}),document.addEventListener("touchend",this.handleScroll,{passive:!1})}},{key:"upd",value:function(){var e=this;switch(this.step){case 1:break;case 2:this.element.classList.add("frame_1"),setTimeout((function(){e.element.classList.add("frame_2"),e.changeColor([70,240,157])}),1e3);break;case 3:this.element.classList.add("frame_3");break;case 4:this.element.classList.add("frame_4")}}}]),e}();function init(){new Anima(".anima")}document.addEventListener("DOMContentLoaded",init);