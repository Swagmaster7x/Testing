(()=>{var ds={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},fs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Rf=0,Jh=1,Cf=2;var ad=1,Gc=2,mi=3,Hi=0,jt=1,Lt=2,Bi=0,zi=1,Ur=2,Kh=3,jh=4,Pf=5,ss=100,If=101,Lf=102,Df=103,Uf=104,Nf=200,kf=201,Ff=202,Of=203,wl=204,El=205,Bf=206,zf=207,Hf=208,Vf=209,Gf=210,Wf=211,Xf=212,Yf=213,qf=214,Tl=0,Al=1,Rl=2,Gs=3,Cl=4,Pl=5,Il=6,Ll=7,ld=0,Zf=1,$f=2,ti=0,Jf=1,Kf=2,jf=3,Wc=4,Qf=5,ep=6,tp=7;var cd=300,Ws=301,Xs=302,Dl=303,Ul=304,ya=306,Nr=1e3,as=1001,Nl=1002,Mn=1003,np=1004;var mo=1005;var Qn=1006,Wa=1007;var ls=1008;var xi=1009,hd=1010,ud=1011,kr=1012,Xc=1013,cs=1014,ei=1015,Yr=1016,Yc=1017,qc=1018,Ys=1020,dd=35902,fd=1021,pd=1022,Bn=1023,md=1024,gd=1025,zs=1026,qs=1027,Zc=1028,$c=1029,_d=1030,Jc=1031;var Kc=1033,Go=33776,Wo=33777,Xo=33778,Yo=33779,kl=35840,Fl=35841,Ol=35842,Bl=35843,zl=36196,Hl=37492,Vl=37496,Gl=37808,Wl=37809,Xl=37810,Yl=37811,ql=37812,Zl=37813,$l=37814,Jl=37815,Kl=37816,jl=37817,Ql=37818,ec=37819,tc=37820,nc=37821,qo=36492,ic=36494,sc=36495,xd=36283,rc=36284,oc=36285,ac=36286;var Zo=2300,lc=2301,Xa=2302,Qh=2400,eu=2401,tu=2402;var ip=3200,sp=3201;var yd=0,rp=1,Oi="",Bt="srgb",Qs="srgb-linear",va="linear",rt="srgb";var Ss=7680;var nu=519,op=512,ap=513,lp=514,vd=515,cp=516,hp=517,up=518,dp=519,iu=35044;var su="300 es",gi=2e3,$o=2001,yi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let i=this._listeners[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ru=1234567,Ir=Math.PI/180,Fr=180/Math.PI;function er(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Jt[n&255]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[t&63|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[i&255]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]).toLowerCase()}function It(n,e,t){return Math.max(e,Math.min(t,n))}function jc(n,e){return(n%e+e)%e}function fp(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function pp(n,e,t){return n!==e?(t-n)/(e-n):0}function Lr(n,e,t){return(1-t)*n+t*e}function mp(n,e,t,i){return Lr(n,e,1-Math.exp(-t*i))}function gp(n,e=1){return e-Math.abs(jc(n,e*2)-e)}function _p(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function xp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function yp(n,e){return n+Math.floor(Math.random()*(e-n+1))}function vp(n,e){return n+Math.random()*(e-n)}function bp(n){return n*(.5-Math.random())}function Mp(n){n!==void 0&&(ru=n);let e=ru+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Sp(n){return n*Ir}function wp(n){return n*Fr}function Ep(n){return(n&n-1)===0&&n!==0}function Tp(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Ap(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Rp(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),h=r((e+i)/2),l=o((e+i)/2),u=r((e-i)/2),f=o((e-i)/2),p=r((i-e)/2),g=o((i-e)/2);switch(s){case"XYX":n.set(a*l,c*u,c*f,a*h);break;case"YZY":n.set(c*f,a*l,c*u,a*h);break;case"ZXZ":n.set(c*u,c*f,a*l,a*h);break;case"XZX":n.set(a*l,c*g,c*p,a*h);break;case"YXY":n.set(c*p,a*l,c*g,a*h);break;case"ZYZ":n.set(c*g,c*p,a*l,a*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Os(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Qt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var qr={DEG2RAD:Ir,RAD2DEG:Fr,generateUUID:er,clamp:It,euclideanModulo:jc,mapLinear:fp,inverseLerp:pp,lerp:Lr,damp:mp,pingpong:gp,smoothstep:_p,smootherstep:xp,randInt:yp,randFloat:vp,randFloatSpread:bp,seededRandom:Mp,degToRad:Sp,radToDeg:wp,isPowerOfTwo:Ep,ceilPowerOfTwo:Tp,floorPowerOfTwo:Ap,setQuaternionFromProperEuler:Rp,normalize:Qt,denormalize:Os},be=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(It(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Fe=class n{constructor(e,t,i,s,r,o,a,c,h){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,h)}set(e,t,i,s,r,o,a,c,h){let l=this.elements;return l[0]=e,l[1]=s,l[2]=a,l[3]=t,l[4]=r,l[5]=c,l[6]=i,l[7]=o,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],c=i[6],h=i[1],l=i[4],u=i[7],f=i[2],p=i[5],g=i[8],_=s[0],m=s[3],d=s[6],x=s[1],v=s[4],y=s[7],P=s[2],T=s[5],A=s[8];return r[0]=o*_+a*x+c*P,r[3]=o*m+a*v+c*T,r[6]=o*d+a*y+c*A,r[1]=h*_+l*x+u*P,r[4]=h*m+l*v+u*T,r[7]=h*d+l*y+u*A,r[2]=f*_+p*x+g*P,r[5]=f*m+p*v+g*T,r[8]=f*d+p*y+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8];return t*o*l-t*a*h-i*r*l+i*a*c+s*r*h-s*o*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8],u=l*o-a*h,f=a*c-l*r,p=h*r-o*c,g=t*u+i*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(s*h-l*i)*_,e[2]=(a*i-s*o)*_,e[3]=f*_,e[4]=(l*t-s*c)*_,e[5]=(s*r-a*t)*_,e[6]=p*_,e[7]=(i*c-h*t)*_,e[8]=(o*t-i*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let c=Math.cos(r),h=Math.sin(r);return this.set(i*c,i*h,-i*(c*o+h*a)+o+e,-s*h,s*c,-s*(-h*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ya.makeScale(e,t)),this}rotate(e){return this.premultiply(Ya.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ya.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ya=new Fe;function bd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Jo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Cp(){let n=Jo("canvas");return n.style.display="block",n}var ou={};function Cr(n){n in ou||(ou[n]=!0,console.warn(n))}function Pp(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function Ip(n){let e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Lp(n){let e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var Ke={enabled:!0,workingColorSpace:Qs,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===rt&&(n.r=_i(n.r),n.g=_i(n.g),n.b=_i(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===rt&&(n.r=Hs(n.r),n.g=Hs(n.g),n.b=Hs(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Oi?va:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function _i(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Hs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var au=[.64,.33,.3,.6,.15,.06],lu=[.2126,.7152,.0722],cu=[.3127,.329],hu=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),uu=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ke.define({[Qs]:{primaries:au,whitePoint:cu,transfer:va,toXYZ:hu,fromXYZ:uu,luminanceCoefficients:lu,workingColorSpaceConfig:{unpackColorSpace:Bt},outputColorSpaceConfig:{drawingBufferColorSpace:Bt}},[Bt]:{primaries:au,whitePoint:cu,transfer:rt,toXYZ:hu,fromXYZ:uu,luminanceCoefficients:lu,outputColorSpaceConfig:{drawingBufferColorSpace:Bt}}});var ws,cc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ws===void 0&&(ws=Jo("canvas")),ws.width=e.width,ws.height=e.height;let i=ws.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=ws}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=Jo("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=_i(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(_i(t[i]/255)*255):t[i]=_i(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Dp=0,Ko=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Dp++}),this.uuid=er(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(qa(s[o].image)):r.push(qa(s[o]))}else r=qa(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function qa(n){return typeof HTMLImageElement!="undefined"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&n instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&n instanceof ImageBitmap?cc.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Up=0,cn=class n extends yi{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=as,s=as,r=Qn,o=ls,a=Bn,c=xi,h=n.DEFAULT_ANISOTROPY,l=Oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Up++}),this.uuid=er(),this.name="",this.source=new Ko(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=h,this.format=a,this.internalFormat=null,this.type=c,this.offset=new be(0,0),this.repeat=new be(1,1),this.center=new be(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==cd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Nr:e.x=e.x-Math.floor(e.x);break;case as:e.x=e.x<0?0:1;break;case Nl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Nr:e.y=e.y-Math.floor(e.y);break;case as:e.y=e.y<0?0:1;break;case Nl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=cd;cn.DEFAULT_ANISOTROPY=1;var ot=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,h=c[0],l=c[4],u=c[8],f=c[1],p=c[5],g=c[9],_=c[2],m=c[6],d=c[10];if(Math.abs(l-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(h+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(h+1)/2,y=(p+1)/2,P=(d+1)/2,T=(l+f)/4,A=(u+_)/4,C=(g+m)/4;return v>y&&v>P?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=T/i,r=A/i):y>P?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=T/s,r=C/s):P<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),i=A/r,s=C/r),this.set(i,s,r,t),this}let x=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-l)*(f-l));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-_)/x,this.z=(f-l)/x,this.w=Math.acos((h+p+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},hc=class extends yi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ot(0,0,e,t),this.scissorTest=!1,this.viewport=new ot(0,0,e,t);let s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let r=new cn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Ko(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},zn=class extends hc{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},jo=class extends cn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Mn,this.minFilter=Mn,this.wrapR=as,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var uc=class extends cn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Mn,this.minFilter=Mn,this.wrapR=as,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Wt=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let c=i[s+0],h=i[s+1],l=i[s+2],u=i[s+3],f=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=h,e[t+2]=l,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(u!==_||c!==f||h!==p||l!==g){let m=1-a,d=c*f+h*p+l*g+u*_,x=d>=0?1:-1,v=1-d*d;if(v>Number.EPSILON){let P=Math.sqrt(v),T=Math.atan2(P,d*x);m=Math.sin(m*T)/P,a=Math.sin(a*T)/P}let y=a*x;if(c=c*m+f*y,h=h*m+p*y,l=l*m+g*y,u=u*m+_*y,m===1-a){let P=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=P,h*=P,l*=P,u*=P}}e[t]=c,e[t+1]=h,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],c=i[s+1],h=i[s+2],l=i[s+3],u=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+l*u+c*p-h*f,e[t+1]=c*g+l*f+h*u-a*p,e[t+2]=h*g+l*p+a*f-c*u,e[t+3]=l*g-a*u-c*f-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,h=a(i/2),l=a(s/2),u=a(r/2),f=c(i/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*l*u+h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u-f*p*g;break;case"YXZ":this._x=f*l*u+h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u+f*p*g;break;case"ZXY":this._x=f*l*u-h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u-f*p*g;break;case"ZYX":this._x=f*l*u-h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u+f*p*g;break;case"YZX":this._x=f*l*u+h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u-f*p*g;break;case"XZY":this._x=f*l*u-h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],h=t[2],l=t[6],u=t[10],f=i+a+u;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(l-c)*p,this._y=(r-h)*p,this._z=(o-s)*p}else if(i>a&&i>u){let p=2*Math.sqrt(1+i-a-u);this._w=(l-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+h)/p}else if(a>u){let p=2*Math.sqrt(1+a-i-u);this._w=(r-h)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+l)/p}else{let p=2*Math.sqrt(1+u-i-a);this._w=(o-s)/p,this._x=(r+h)/p,this._y=(c+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(It(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,h=t._z,l=t._w;return this._x=i*l+o*a+s*h-r*c,this._y=s*l+o*c+r*a-i*h,this._z=r*l+o*h+i*c-s*a,this._w=o*l-i*a-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+i*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let h=Math.sqrt(c),l=Math.atan2(h,a),u=Math.sin((1-t)*l)/h,f=Math.sin(t*l)/h;return this._w=o*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(du.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(du.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,h=2*(o*s-a*i),l=2*(a*t-r*s),u=2*(r*i-o*t);return this.x=t+c*h+o*u-a*l,this.y=i+c*l+a*h-r*u,this.z=s+c*u+r*l-o*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Za.copy(this).projectOnVector(e),this.sub(Za)}reflect(e){return this.sub(Za.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(It(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Za=new I,du=new Wt,Sn=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(kn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(kn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=kn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,kn):kn.fromBufferAttribute(r,o),kn.applyMatrix4(e.matrixWorld),this.expandByPoint(kn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),go.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),go.copy(i.boundingBox)),go.applyMatrix4(e.matrixWorld),this.union(go)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,kn),kn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(br),_o.subVectors(this.max,br),Es.subVectors(e.a,br),Ts.subVectors(e.b,br),As.subVectors(e.c,br),Li.subVectors(Ts,Es),Di.subVectors(As,Ts),Ki.subVectors(Es,As);let t=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-Ki.z,Ki.y,Li.z,0,-Li.x,Di.z,0,-Di.x,Ki.z,0,-Ki.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-Ki.y,Ki.x,0];return!$a(t,Es,Ts,As,_o)||(t=[1,0,0,0,1,0,0,0,1],!$a(t,Es,Ts,As,_o))?!1:(xo.crossVectors(Li,Di),t=[xo.x,xo.y,xo.z],$a(t,Es,Ts,As,_o))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(hi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},hi=[new I,new I,new I,new I,new I,new I,new I,new I],kn=new I,go=new Sn,Es=new I,Ts=new I,As=new I,Li=new I,Di=new I,Ki=new I,br=new I,_o=new I,xo=new I,ji=new I;function $a(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){ji.fromArray(n,r);let a=s.x*Math.abs(ji.x)+s.y*Math.abs(ji.y)+s.z*Math.abs(ji.z),c=e.dot(ji),h=t.dot(ji),l=i.dot(ji);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>a)return!1}return!0}var Np=new Sn,Mr=new I,Ja=new I,vi=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Np.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Mr.subVectors(e,this.center);let t=Mr.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Mr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ja.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Mr.copy(e.center).add(Ja)),this.expandByPoint(Mr.copy(e.center).sub(Ja))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},ui=new I,Ka=new I,yo=new I,Ui=new I,ja=new I,vo=new I,Qa=new I,Vi=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ui)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ui.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ui.copy(this.origin).addScaledVector(this.direction,t),ui.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Ka.copy(e).add(t).multiplyScalar(.5),yo.copy(t).sub(e).normalize(),Ui.copy(this.origin).sub(Ka);let r=e.distanceTo(t)*.5,o=-this.direction.dot(yo),a=Ui.dot(this.direction),c=-Ui.dot(yo),h=Ui.lengthSq(),l=Math.abs(1-o*o),u,f,p,g;if(l>0)if(u=o*c-a,f=o*a-c,g=r*l,u>=0)if(f>=-g)if(f<=g){let _=1/l;u*=_,f*=_,p=u*(u+o*f+2*a)+f*(o*u+f+2*c)+h}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+h):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ka).addScaledVector(yo,f),p}intersectSphere(e,t){ui.subVectors(e.center,this.origin);let i=ui.dot(this.direction),s=ui.dot(ui)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,c,h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,f=this.origin;return h>=0?(i=(e.min.x-f.x)*h,s=(e.max.x-f.x)*h):(i=(e.max.x-f.x)*h,s=(e.min.x-f.x)*h),l>=0?(r=(e.min.y-f.y)*l,o=(e.max.y-f.y)*l):(r=(e.max.y-f.y)*l,o=(e.min.y-f.y)*l),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,ui)!==null}intersectTriangle(e,t,i,s,r){ja.subVectors(t,e),vo.subVectors(i,e),Qa.crossVectors(ja,vo);let o=this.direction.dot(Qa),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ui.subVectors(this.origin,e);let c=a*this.direction.dot(vo.crossVectors(Ui,vo));if(c<0)return null;let h=a*this.direction.dot(ja.cross(Ui));if(h<0||c+h>o)return null;let l=-a*Ui.dot(Qa);return l<0?null:this.at(l/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ge=class n{constructor(e,t,i,s,r,o,a,c,h,l,u,f,p,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,h,l,u,f,p,g,_,m)}set(e,t,i,s,r,o,a,c,h,l,u,f,p,g,_,m){let d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=h,d[6]=l,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/Rs.setFromMatrixColumn(e,0).length(),r=1/Rs.setFromMatrixColumn(e,1).length(),o=1/Rs.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=o*l,p=o*u,g=a*l,_=a*u;t[0]=c*l,t[4]=-c*u,t[8]=h,t[1]=p+g*h,t[5]=f-_*h,t[9]=-a*c,t[2]=_-f*h,t[6]=g+p*h,t[10]=o*c}else if(e.order==="YXZ"){let f=c*l,p=c*u,g=h*l,_=h*u;t[0]=f+_*a,t[4]=g*a-p,t[8]=o*h,t[1]=o*u,t[5]=o*l,t[9]=-a,t[2]=p*a-g,t[6]=_+f*a,t[10]=o*c}else if(e.order==="ZXY"){let f=c*l,p=c*u,g=h*l,_=h*u;t[0]=f-_*a,t[4]=-o*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*l,t[9]=_-f*a,t[2]=-o*h,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let f=o*l,p=o*u,g=a*l,_=a*u;t[0]=c*l,t[4]=g*h-p,t[8]=f*h+_,t[1]=c*u,t[5]=_*h+f,t[9]=p*h-g,t[2]=-h,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let f=o*c,p=o*h,g=a*c,_=a*h;t[0]=c*l,t[4]=_-f*u,t[8]=g*u+p,t[1]=u,t[5]=o*l,t[9]=-a*l,t[2]=-h*l,t[6]=p*u+g,t[10]=f-_*u}else if(e.order==="XZY"){let f=o*c,p=o*h,g=a*c,_=a*h;t[0]=c*l,t[4]=-u,t[8]=h*l,t[1]=f*u+_,t[5]=o*l,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*l,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(kp,e,Fp)}lookAt(e,t,i){let s=this.elements;return yn.subVectors(e,t),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),Ni.crossVectors(i,yn),Ni.lengthSq()===0&&(Math.abs(i.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),Ni.crossVectors(i,yn)),Ni.normalize(),bo.crossVectors(yn,Ni),s[0]=Ni.x,s[4]=bo.x,s[8]=yn.x,s[1]=Ni.y,s[5]=bo.y,s[9]=yn.y,s[2]=Ni.z,s[6]=bo.z,s[10]=yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],c=i[8],h=i[12],l=i[1],u=i[5],f=i[9],p=i[13],g=i[2],_=i[6],m=i[10],d=i[14],x=i[3],v=i[7],y=i[11],P=i[15],T=s[0],A=s[4],C=s[8],M=s[12],b=s[1],D=s[5],G=s[9],W=s[13],q=s[2],ie=s[6],Z=s[10],w=s[14],L=s[3],B=s[7],J=s[11],Q=s[15];return r[0]=o*T+a*b+c*q+h*L,r[4]=o*A+a*D+c*ie+h*B,r[8]=o*C+a*G+c*Z+h*J,r[12]=o*M+a*W+c*w+h*Q,r[1]=l*T+u*b+f*q+p*L,r[5]=l*A+u*D+f*ie+p*B,r[9]=l*C+u*G+f*Z+p*J,r[13]=l*M+u*W+f*w+p*Q,r[2]=g*T+_*b+m*q+d*L,r[6]=g*A+_*D+m*ie+d*B,r[10]=g*C+_*G+m*Z+d*J,r[14]=g*M+_*W+m*w+d*Q,r[3]=x*T+v*b+y*q+P*L,r[7]=x*A+v*D+y*ie+P*B,r[11]=x*C+v*G+y*Z+P*J,r[15]=x*M+v*W+y*w+P*Q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],h=e[13],l=e[2],u=e[6],f=e[10],p=e[14],g=e[3],_=e[7],m=e[11],d=e[15];return g*(+r*c*u-s*h*u-r*a*f+i*h*f+s*a*p-i*c*p)+_*(+t*c*p-t*h*f+r*o*f-s*o*p+s*h*l-r*c*l)+m*(+t*h*u-t*a*p-r*o*u+i*o*p+r*a*l-i*h*l)+d*(-s*a*l-t*c*u+t*a*f+s*o*u-i*o*f+i*c*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8],u=e[9],f=e[10],p=e[11],g=e[12],_=e[13],m=e[14],d=e[15],x=u*m*h-_*f*h+_*c*p-a*m*p-u*c*d+a*f*d,v=g*f*h-l*m*h-g*c*p+o*m*p+l*c*d-o*f*d,y=l*_*h-g*u*h+g*a*p-o*_*p-l*a*d+o*u*d,P=g*u*c-l*_*c-g*a*f+o*_*f+l*a*m-o*u*m,T=t*x+i*v+s*y+r*P;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/T;return e[0]=x*A,e[1]=(_*f*r-u*m*r-_*s*p+i*m*p+u*s*d-i*f*d)*A,e[2]=(a*m*r-_*c*r+_*s*h-i*m*h-a*s*d+i*c*d)*A,e[3]=(u*c*r-a*f*r-u*s*h+i*f*h+a*s*p-i*c*p)*A,e[4]=v*A,e[5]=(l*m*r-g*f*r+g*s*p-t*m*p-l*s*d+t*f*d)*A,e[6]=(g*c*r-o*m*r-g*s*h+t*m*h+o*s*d-t*c*d)*A,e[7]=(o*f*r-l*c*r+l*s*h-t*f*h-o*s*p+t*c*p)*A,e[8]=y*A,e[9]=(g*u*r-l*_*r-g*i*p+t*_*p+l*i*d-t*u*d)*A,e[10]=(o*_*r-g*a*r+g*i*h-t*_*h-o*i*d+t*a*d)*A,e[11]=(l*a*r-o*u*r-l*i*h+t*u*h+o*i*p-t*a*p)*A,e[12]=P*A,e[13]=(l*_*s-g*u*s+g*i*f-t*_*f-l*i*m+t*u*m)*A,e[14]=(g*a*s-o*_*s-g*i*c+t*_*c+o*i*m-t*a*m)*A,e[15]=(o*u*s-l*a*s+l*i*c-t*u*c-o*i*f+t*a*f)*A,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,c=e.z,h=r*o,l=r*a;return this.set(h*o+i,h*a-s*c,h*c+s*a,0,h*a+s*c,l*a+i,l*c-s*o,0,h*c-s*a,l*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,h=r+r,l=o+o,u=a+a,f=r*h,p=r*l,g=r*u,_=o*l,m=o*u,d=a*u,x=c*h,v=c*l,y=c*u,P=i.x,T=i.y,A=i.z;return s[0]=(1-(_+d))*P,s[1]=(p+y)*P,s[2]=(g-v)*P,s[3]=0,s[4]=(p-y)*T,s[5]=(1-(f+d))*T,s[6]=(m+x)*T,s[7]=0,s[8]=(g+v)*A,s[9]=(m-x)*A,s[10]=(1-(f+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=Rs.set(s[0],s[1],s[2]).length(),o=Rs.set(s[4],s[5],s[6]).length(),a=Rs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Fn.copy(this);let h=1/r,l=1/o,u=1/a;return Fn.elements[0]*=h,Fn.elements[1]*=h,Fn.elements[2]*=h,Fn.elements[4]*=l,Fn.elements[5]*=l,Fn.elements[6]*=l,Fn.elements[8]*=u,Fn.elements[9]*=u,Fn.elements[10]*=u,t.setFromRotationMatrix(Fn),i.x=r,i.y=o,i.z=a,this}makePerspective(e,t,i,s,r,o,a=gi){let c=this.elements,h=2*r/(t-e),l=2*r/(i-s),u=(t+e)/(t-e),f=(i+s)/(i-s),p,g;if(a===gi)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===$o)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=gi){let c=this.elements,h=1/(t-e),l=1/(i-s),u=1/(o-r),f=(t+e)*h,p=(i+s)*l,g,_;if(a===gi)g=(o+r)*u,_=-2*u;else if(a===$o)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Rs=new I,Fn=new Ge,kp=new I(0,0,0),Fp=new I(1,1,1),Ni=new I,bo=new I,yn=new I,fu=new Ge,pu=new Wt,hn=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],h=s[5],l=s[9],u=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(It(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-It(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(It(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-It(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(It(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-It(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-l,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return fu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fu,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return pu.setFromEuler(this),this.setFromQuaternion(pu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};hn.DEFAULT_ORDER="XYZ";var Or=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Op=0,mu=new I,Cs=new Wt,di=new Ge,Mo=new I,Sr=new I,Bp=new I,zp=new Wt,gu=new I(1,0,0),_u=new I(0,1,0),xu=new I(0,0,1),yu={type:"added"},Hp={type:"removed"},Ps={type:"childadded",child:null},el={type:"childremoved",child:null},Xt=class n extends yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Op++}),this.uuid=er(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new I,t=new hn,i=new Wt,s=new I(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ge},normalMatrix:{value:new Fe}}),this.matrix=new Ge,this.matrixWorld=new Ge,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Or,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Cs.setFromAxisAngle(e,t),this.quaternion.multiply(Cs),this}rotateOnWorldAxis(e,t){return Cs.setFromAxisAngle(e,t),this.quaternion.premultiply(Cs),this}rotateX(e){return this.rotateOnAxis(gu,e)}rotateY(e){return this.rotateOnAxis(_u,e)}rotateZ(e){return this.rotateOnAxis(xu,e)}translateOnAxis(e,t){return mu.copy(e).applyQuaternion(this.quaternion),this.position.add(mu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gu,e)}translateY(e){return this.translateOnAxis(_u,e)}translateZ(e){return this.translateOnAxis(xu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Mo.copy(e):Mo.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Sr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(Sr,Mo,this.up):di.lookAt(Mo,Sr,this.up),this.quaternion.setFromRotationMatrix(di),s&&(di.extractRotation(s.matrixWorld),Cs.setFromRotationMatrix(di),this.quaternion.premultiply(Cs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yu),Ps.child=e,this.dispatchEvent(Ps),Ps.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hp),el.child=e,this.dispatchEvent(el),el.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),di.multiply(e.parent.matrixWorld)),e.applyMatrix4(di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yu),Ps.child=e,this.dispatchEvent(Ps),Ps.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Sr,e,Bp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Sr,zp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){let u=c[h];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,h=this.material.length;c<h;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),h=o(e.textures),l=o(e.images),u=o(e.shapes),f=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),l.length>0&&(i.images=l),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let c=[];for(let h in a){let l=a[h];delete l.metadata,c.push(l)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Xt.DEFAULT_UP=new I(0,1,0);Xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var On=new I,fi=new I,tl=new I,pi=new I,Is=new I,Ls=new I,vu=new I,nl=new I,il=new I,sl=new I,rl=new ot,ol=new ot,al=new ot,rs=class n{constructor(e=new I,t=new I,i=new I){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),On.subVectors(e,t),s.cross(On);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){On.subVectors(s,t),fi.subVectors(i,t),tl.subVectors(e,t);let o=On.dot(On),a=On.dot(fi),c=On.dot(tl),h=fi.dot(fi),l=fi.dot(tl),u=o*h-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,p=(h*c-a*l)*f,g=(o*l-a*c)*f;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(e,t,i,s,r,o,a,c){return this.getBarycoord(e,t,i,s,pi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,pi.x),c.addScaledVector(o,pi.y),c.addScaledVector(a,pi.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return rl.setScalar(0),ol.setScalar(0),al.setScalar(0),rl.fromBufferAttribute(e,t),ol.fromBufferAttribute(e,i),al.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(rl,r.x),o.addScaledVector(ol,r.y),o.addScaledVector(al,r.z),o}static isFrontFacing(e,t,i,s){return On.subVectors(i,t),fi.subVectors(e,t),On.cross(fi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return On.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),On.cross(fi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;Is.subVectors(s,i),Ls.subVectors(r,i),nl.subVectors(e,i);let c=Is.dot(nl),h=Ls.dot(nl);if(c<=0&&h<=0)return t.copy(i);il.subVectors(e,s);let l=Is.dot(il),u=Ls.dot(il);if(l>=0&&u<=l)return t.copy(s);let f=c*u-l*h;if(f<=0&&c>=0&&l<=0)return o=c/(c-l),t.copy(i).addScaledVector(Is,o);sl.subVectors(e,r);let p=Is.dot(sl),g=Ls.dot(sl);if(g>=0&&p<=g)return t.copy(r);let _=p*h-c*g;if(_<=0&&h>=0&&g<=0)return a=h/(h-g),t.copy(i).addScaledVector(Ls,a);let m=l*g-p*u;if(m<=0&&u-l>=0&&p-g>=0)return vu.subVectors(r,s),a=(u-l)/(u-l+(p-g)),t.copy(s).addScaledVector(vu,a);let d=1/(m+_+f);return o=_*d,a=f*d,t.copy(i).addScaledVector(Is,o).addScaledVector(Ls,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Md={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ki={h:0,s:0,l:0},So={h:0,s:0,l:0};function ll(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Pe=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ke.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=Ke.workingColorSpace){if(e=jc(e,1),t=It(t,0,1),i=It(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=ll(o,r,e+1/3),this.g=ll(o,r,e),this.b=ll(o,r,e-1/3)}return Ke.toWorkingColorSpace(this,s),this}setStyle(e,t=Bt){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bt){let i=Md[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=_i(e.r),this.g=_i(e.g),this.b=_i(e.b),this}copyLinearToSRGB(e){return this.r=Hs(e.r),this.g=Hs(e.g),this.b=Hs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bt){return Ke.fromWorkingColorSpace(Kt.copy(this),e),Math.round(It(Kt.r*255,0,255))*65536+Math.round(It(Kt.g*255,0,255))*256+Math.round(It(Kt.b*255,0,255))}getHexString(e=Bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.fromWorkingColorSpace(Kt.copy(this),t);let i=Kt.r,s=Kt.g,r=Kt.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,h,l=(a+o)/2;if(a===o)c=0,h=0;else{let u=o-a;switch(h=l<=.5?u/(o+a):u/(2-o-a),o){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=l,e}getRGB(e,t=Ke.workingColorSpace){return Ke.fromWorkingColorSpace(Kt.copy(this),t),e.r=Kt.r,e.g=Kt.g,e.b=Kt.b,e}getStyle(e=Bt){Ke.fromWorkingColorSpace(Kt.copy(this),e);let t=Kt.r,i=Kt.g,s=Kt.b;return e!==Bt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ki),this.setHSL(ki.h+e,ki.s+t,ki.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ki),e.getHSL(So);let i=Lr(ki.h,So.h,t),s=Lr(ki.s,So.s,t),r=Lr(ki.l,So.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Kt=new Pe;Pe.NAMES=Md;var Vp=0,bi=class extends yi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vp++}),this.uuid=er(),this.name="",this.blending=zi,this.side=Hi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wl,this.blendDst=El,this.blendEquation=ss,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=Gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ss,this.stencilZFail=Ss,this.stencilZPass=Ss,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(i.blending=this.blending),this.side!==Hi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==wl&&(i.blendSrc=this.blendSrc),this.blendDst!==El&&(i.blendDst=this.blendDst),this.blendEquation!==ss&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Gs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ss&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ss&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ss&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},zt=class extends bi{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=ld,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Ct=new I,wo=new be,_t=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=iu,this.updateRanges=[],this.gpuType=ei,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)wo.fromBufferAttribute(this,t),wo.applyMatrix3(e),this.setXY(t,wo.x,wo.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Os(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Qt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Os(t,this.array)),t}setX(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Os(t,this.array)),t}setY(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Os(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Os(t,this.array)),t}setW(e,t){return this.normalized&&(t=Qt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array),s=Qt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Qt(t,this.array),i=Qt(i,this.array),s=Qt(s,this.array),r=Qt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==iu&&(e.usage=this.usage),e}};var Qo=class extends _t{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var ea=class extends _t{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var Ze=class extends _t{constructor(e,t,i){super(new Float32Array(e),t,i)}},Gp=0,An=new Ge,cl=new Xt,Ds=new I,vn=new Sn,wr=new Sn,Ot=new I,xt=class n extends yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Gp++}),this.uuid=er(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(bd(e)?ea:Qo)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Fe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,i){return An.makeTranslation(e,t,i),this.applyMatrix4(An),this}scale(e,t,i){return An.makeScale(e,t,i),this.applyMatrix4(An),this}lookAt(e){return cl.lookAt(e),cl.updateMatrix(),this.applyMatrix4(cl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ds).negate(),this.translate(Ds.x,Ds.y,Ds.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ze(i,3))}else{for(let i=0,s=t.count;i<s;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];vn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ot.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(Ot),Ot.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(Ot)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let i=this.boundingSphere.center;if(vn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];wr.setFromBufferAttribute(a),this.morphTargetsRelative?(Ot.addVectors(vn.min,wr.min),vn.expandByPoint(Ot),Ot.addVectors(vn.max,wr.max),vn.expandByPoint(Ot)):(vn.expandByPoint(wr.min),vn.expandByPoint(wr.max))}vn.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)Ot.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ot));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let h=0,l=a.count;h<l;h++)Ot.fromBufferAttribute(a,h),c&&(Ds.fromBufferAttribute(e,h),Ot.add(Ds)),s=Math.max(s,i.distanceToSquared(Ot))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _t(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<i.count;C++)a[C]=new I,c[C]=new I;let h=new I,l=new I,u=new I,f=new be,p=new be,g=new be,_=new I,m=new I;function d(C,M,b){h.fromBufferAttribute(i,C),l.fromBufferAttribute(i,M),u.fromBufferAttribute(i,b),f.fromBufferAttribute(r,C),p.fromBufferAttribute(r,M),g.fromBufferAttribute(r,b),l.sub(h),u.sub(h),p.sub(f),g.sub(f);let D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(_.copy(l).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(D),m.copy(u).multiplyScalar(p.x).addScaledVector(l,-g.x).multiplyScalar(D),a[C].add(_),a[M].add(_),a[b].add(_),c[C].add(m),c[M].add(m),c[b].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let C=0,M=x.length;C<M;++C){let b=x[C],D=b.start,G=b.count;for(let W=D,q=D+G;W<q;W+=3)d(e.getX(W+0),e.getX(W+1),e.getX(W+2))}let v=new I,y=new I,P=new I,T=new I;function A(C){P.fromBufferAttribute(s,C),T.copy(P);let M=a[C];v.copy(M),v.sub(P.multiplyScalar(P.dot(M))).normalize(),y.crossVectors(T,M);let D=y.dot(c[C])<0?-1:1;o.setXYZW(C,v.x,v.y,v.z,D)}for(let C=0,M=x.length;C<M;++C){let b=x[C],D=b.start,G=b.count;for(let W=D,q=D+G;W<q;W+=3)A(e.getX(W+0)),A(e.getX(W+1)),A(e.getX(W+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new _t(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);let s=new I,r=new I,o=new I,a=new I,c=new I,h=new I,l=new I,u=new I;if(e)for(let f=0,p=e.count;f<p;f+=3){let g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),l.subVectors(o,r),u.subVectors(s,r),l.cross(u),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,m),a.add(l),c.add(l),h.add(l),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,h.x,h.y,h.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),l.subVectors(o,r),u.subVectors(s,r),l.cross(u),i.setXYZ(f+0,l.x,l.y,l.z),i.setXYZ(f+1,l.x,l.y,l.z),i.setXYZ(f+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ot.fromBufferAttribute(e,t),Ot.normalize(),e.setXYZ(t,Ot.x,Ot.y,Ot.z)}toNonIndexed(){function e(a,c){let h=a.array,l=a.itemSize,u=a.normalized,f=new h.constructor(c.length*l),p=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?p=c[_]*a.data.stride+a.offset:p=c[_]*l;for(let d=0;d<l;d++)f[g++]=h[p++]}return new _t(f,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],h=e(c,i);t.setAttribute(a,h)}let r=this.morphAttributes;for(let a in r){let c=[],h=r[a];for(let l=0,u=h.length;l<u;l++){let f=h[l],p=e(f,i);c.push(p)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let h=o[a];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let h=i[c];e.data.attributes[c]=h.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let h=this.morphAttributes[c],l=[];for(let u=0,f=h.length;u<f;u++){let p=h[u];l.push(p.toJSON(e.data))}l.length>0&&(s[c]=l,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let s=e.attributes;for(let h in s){let l=s[h];this.setAttribute(h,l.clone(t))}let r=e.morphAttributes;for(let h in r){let l=[],u=r[h];for(let f=0,p=u.length;f<p;f++)l.push(u[f].clone(t));this.morphAttributes[h]=l}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let h=0,l=o.length;h<l;h++){let u=o[h];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},bu=new Ge,Qi=new Vi,Eo=new vi,Mu=new I,To=new I,Ao=new I,Ro=new I,hl=new I,Co=new I,Su=new I,Po=new I,De=class extends Xt{constructor(e=new xt,t=new zt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Co.set(0,0,0);for(let c=0,h=r.length;c<h;c++){let l=a[c],u=r[c];l!==0&&(hl.fromBufferAttribute(u,e),o?Co.addScaledVector(hl,l):Co.addScaledVector(hl.sub(t),l))}t.add(Co)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Eo.copy(i.boundingSphere),Eo.applyMatrix4(r),Qi.copy(e.ray).recast(e.near),!(Eo.containsPoint(Qi.origin)===!1&&(Qi.intersectSphere(Eo,Mu)===null||Qi.origin.distanceToSquared(Mu)>(e.far-e.near)**2))&&(bu.copy(r).invert(),Qi.copy(e.ray).applyMatrix4(bu),!(i.boundingBox!==null&&Qi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Qi)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],d=o[m.materialIndex],x=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=x,P=v;y<P;y+=3){let T=a.getX(y),A=a.getX(y+1),C=a.getX(y+2);s=Io(this,d,e,i,h,l,u,T,A,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){let x=a.getX(m),v=a.getX(m+1),y=a.getX(m+2);s=Io(this,o,e,i,h,l,u,x,v,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],d=o[m.materialIndex],x=Math.max(m.start,p.start),v=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let y=x,P=v;y<P;y+=3){let T=y,A=y+1,C=y+2;s=Io(this,d,e,i,h,l,u,T,A,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){let x=m,v=m+1,y=m+2;s=Io(this,o,e,i,h,l,u,x,v,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Wp(n,e,t,i,s,r,o,a){let c;if(e.side===jt?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,e.side===Hi,a),c===null)return null;Po.copy(a),Po.applyMatrix4(n.matrixWorld);let h=t.ray.origin.distanceTo(Po);return h<t.near||h>t.far?null:{distance:h,point:Po.clone(),object:n}}function Io(n,e,t,i,s,r,o,a,c,h){n.getVertexPosition(a,To),n.getVertexPosition(c,Ao),n.getVertexPosition(h,Ro);let l=Wp(n,e,t,i,To,Ao,Ro,Su);if(l){let u=new I;rs.getBarycoord(Su,To,Ao,Ro,u),s&&(l.uv=rs.getInterpolatedAttribute(s,a,c,h,u,new be)),r&&(l.uv1=rs.getInterpolatedAttribute(r,a,c,h,u,new be)),o&&(l.normal=rs.getInterpolatedAttribute(o,a,c,h,u,new I),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));let f={a,b:c,c:h,normal:new I,materialIndex:0};rs.getNormal(To,Ao,Ro,f.normal),l.face=f,l.barycoord=u}return l}var Hn=class n extends xt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],h=[],l=[],u=[],f=0,p=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Ze(h,3)),this.setAttribute("normal",new Ze(l,3)),this.setAttribute("uv",new Ze(u,2));function g(_,m,d,x,v,y,P,T,A,C,M){let b=y/A,D=P/C,G=y/2,W=P/2,q=T/2,ie=A+1,Z=C+1,w=0,L=0,B=new I;for(let J=0;J<Z;J++){let Q=J*D-W;for(let K=0;K<ie;K++){let se=K*b-G;B[_]=se*x,B[m]=Q*v,B[d]=q,h.push(B.x,B.y,B.z),B[_]=0,B[m]=0,B[d]=T>0?1:-1,l.push(B.x,B.y,B.z),u.push(K/A),u.push(1-J/C),w+=1}}for(let J=0;J<C;J++)for(let Q=0;Q<A;Q++){let K=f+Q+ie*J,se=f+Q+ie*(J+1),U=f+(Q+1)+ie*(J+1),z=f+(Q+1)+ie*J;c.push(K,se,z),c.push(se,U,z),L+=6}a.addGroup(p,L,M),p+=L,f+=w}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Zs(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function en(n){let e={};for(let t=0;t<n.length;t++){let i=Zs(n[t]);for(let s in i)e[s]=i[s]}return e}function Xp(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Sd(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}var Yp={clone:Zs,merge:en},qp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Zp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Rn=class extends bi{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=qp,this.fragmentShader=Zp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zs(e.uniforms),this.uniformsGroups=Xp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},ta=class extends Xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ge,this.projectionMatrix=new Ge,this.projectionMatrixInverse=new Ge,this.coordinateSystem=gi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Fi=new I,wu=new be,Eu=new be,Gt=class extends ta{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Fr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ir*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fr*2*Math.atan(Math.tan(Ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z)}getViewSize(e,t){return this.getViewBounds(e,wu,Eu),t.subVectors(Eu,wu)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ir*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,h=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/h,s*=o.width/c,i*=o.height/h}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Us=-90,Ns=1,dc=class extends Xt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Gt(Us,Ns,e,t);s.layers=this.layers,this.add(s);let r=new Gt(Us,Ns,e,t);r.layers=this.layers,this.add(r);let o=new Gt(Us,Ns,e,t);o.layers=this.layers,this.add(o);let a=new Gt(Us,Ns,e,t);a.layers=this.layers,this.add(a);let c=new Gt(Us,Ns,e,t);c.layers=this.layers,this.add(c);let h=new Gt(Us,Ns,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,c]=t;for(let h of t)this.remove(h);if(e===gi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===$o)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,h,l]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,o),e.setRenderTarget(i,2,s),e.render(t,a),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,l),e.setRenderTarget(u,f,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},na=class extends cn{constructor(e,t,i,s,r,o,a,c,h,l){e=e!==void 0?e:[],t=t!==void 0?t:Ws,super(e,t,i,s,r,o,a,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},fc=class extends zn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new na(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Qn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Hn(5,5,5),r=new Rn({name:"CubemapFromEquirect",uniforms:Zs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:jt,blending:Bi});r.uniforms.tEquirect.value=t;let o=new De(s,r),a=t.minFilter;return t.minFilter===ls&&(t.minFilter=Qn),new dc(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}},ul=new I,$p=new I,Jp=new Fe,bn=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=ul.subVectors(i,t).cross($p.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(ul),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Jp.getNormalMatrix(e),s=this.coplanarPoint(ul).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},es=new vi,Lo=new I,Br=class{constructor(e=new bn,t=new bn,i=new bn,s=new bn,r=new bn,o=new bn){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=gi){let i=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],h=s[4],l=s[5],u=s[6],f=s[7],p=s[8],g=s[9],_=s[10],m=s[11],d=s[12],x=s[13],v=s[14],y=s[15];if(i[0].setComponents(c-r,f-h,m-p,y-d).normalize(),i[1].setComponents(c+r,f+h,m+p,y+d).normalize(),i[2].setComponents(c+o,f+l,m+g,y+x).normalize(),i[3].setComponents(c-o,f-l,m-g,y-x).normalize(),i[4].setComponents(c-a,f-u,m-_,y-v).normalize(),t===gi)i[5].setComponents(c+a,f+u,m+_,y+v).normalize();else if(t===$o)i[5].setComponents(a,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),es.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),es.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(es)}intersectsSprite(e){return es.center.set(0,0,0),es.radius=.7071067811865476,es.applyMatrix4(e.matrixWorld),this.intersectsSphere(es)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(Lo.x=s.normal.x>0?e.max.x:e.min.x,Lo.y=s.normal.y>0?e.max.y:e.min.y,Lo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Lo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function wd(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Kp(n){let e=new WeakMap;function t(a,c){let h=a.array,l=a.usage,u=h.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,h,l),a.onUploadCallback();let p;if(h instanceof Float32Array)p=n.FLOAT;else if(h instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=n.SHORT;else if(h instanceof Uint32Array)p=n.UNSIGNED_INT;else if(h instanceof Int32Array)p=n.INT;else if(h instanceof Int8Array)p=n.BYTE;else if(h instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:f,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,c,h){let l=c.array,u=c.updateRanges;if(n.bindBuffer(h,a),u.length===0)n.bufferSubData(h,0,l);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){let g=u[f],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];n.bufferSubData(h,_.start*l.BYTES_PER_ELEMENT,l,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let l=e.get(a);(!l||l.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let h=e.get(a);if(h===void 0)e.set(a,t(a,c));else if(h.version<a.version){if(h.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,a,c),h.version=a.version}}return{get:s,remove:r,update:o}}var Mi=class n extends xt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),c=Math.floor(s),h=a+1,l=c+1,u=e/a,f=t/c,p=[],g=[],_=[],m=[];for(let d=0;d<l;d++){let x=d*f-o;for(let v=0;v<h;v++){let y=v*u-r;g.push(y,-x,0),_.push(0,0,1),m.push(v/a),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let x=0;x<a;x++){let v=x+h*d,y=x+h*(d+1),P=x+1+h*(d+1),T=x+1+h*d;p.push(v,y,T),p.push(y,P,T)}this.setIndex(p),this.setAttribute("position",new Ze(g,3)),this.setAttribute("normal",new Ze(_,3)),this.setAttribute("uv",new Ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},jp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Qp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,em=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,tm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,im=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,rm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,om=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,am=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,um=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,dm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,fm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,pm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_m=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,xm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ym=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,vm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,bm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Mm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Sm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,wm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Em=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Am=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Rm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Pm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Im=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Lm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Dm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Um=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Nm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,km=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Om=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Bm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,zm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Hm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Vm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Gm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Wm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Xm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ym=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$m=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Jm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Km=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,jm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Qm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,e0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,t0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,n0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,i0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,s0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,r0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,o0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,a0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,l0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,c0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,h0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,u0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,d0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,f0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,p0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,m0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,g0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,_0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,x0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,y0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,v0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,b0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,M0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,S0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,w0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,E0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,T0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,A0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,R0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,C0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,P0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,I0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,L0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,D0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,U0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,N0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,k0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,F0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,O0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,B0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,z0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,H0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,V0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,G0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,W0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,X0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Y0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,q0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,J0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,K0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,j0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ng=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,sg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,rg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,og=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ag=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ug=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,dg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,gg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_g=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,xg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,yg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Mg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Eg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Tg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ag=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Cg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:jp,alphahash_pars_fragment:Qp,alphamap_fragment:em,alphamap_pars_fragment:tm,alphatest_fragment:nm,alphatest_pars_fragment:im,aomap_fragment:sm,aomap_pars_fragment:rm,batching_pars_vertex:om,batching_vertex:am,begin_vertex:lm,beginnormal_vertex:cm,bsdfs:hm,iridescence_fragment:um,bumpmap_pars_fragment:dm,clipping_planes_fragment:fm,clipping_planes_pars_fragment:pm,clipping_planes_pars_vertex:mm,clipping_planes_vertex:gm,color_fragment:_m,color_pars_fragment:xm,color_pars_vertex:ym,color_vertex:vm,common:bm,cube_uv_reflection_fragment:Mm,defaultnormal_vertex:Sm,displacementmap_pars_vertex:wm,displacementmap_vertex:Em,emissivemap_fragment:Tm,emissivemap_pars_fragment:Am,colorspace_fragment:Rm,colorspace_pars_fragment:Cm,envmap_fragment:Pm,envmap_common_pars_fragment:Im,envmap_pars_fragment:Lm,envmap_pars_vertex:Dm,envmap_physical_pars_fragment:Wm,envmap_vertex:Um,fog_vertex:Nm,fog_pars_vertex:km,fog_fragment:Fm,fog_pars_fragment:Om,gradientmap_pars_fragment:Bm,lightmap_pars_fragment:zm,lights_lambert_fragment:Hm,lights_lambert_pars_fragment:Vm,lights_pars_begin:Gm,lights_toon_fragment:Xm,lights_toon_pars_fragment:Ym,lights_phong_fragment:qm,lights_phong_pars_fragment:Zm,lights_physical_fragment:$m,lights_physical_pars_fragment:Jm,lights_fragment_begin:Km,lights_fragment_maps:jm,lights_fragment_end:Qm,logdepthbuf_fragment:e0,logdepthbuf_pars_fragment:t0,logdepthbuf_pars_vertex:n0,logdepthbuf_vertex:i0,map_fragment:s0,map_pars_fragment:r0,map_particle_fragment:o0,map_particle_pars_fragment:a0,metalnessmap_fragment:l0,metalnessmap_pars_fragment:c0,morphinstance_vertex:h0,morphcolor_vertex:u0,morphnormal_vertex:d0,morphtarget_pars_vertex:f0,morphtarget_vertex:p0,normal_fragment_begin:m0,normal_fragment_maps:g0,normal_pars_fragment:_0,normal_pars_vertex:x0,normal_vertex:y0,normalmap_pars_fragment:v0,clearcoat_normal_fragment_begin:b0,clearcoat_normal_fragment_maps:M0,clearcoat_pars_fragment:S0,iridescence_pars_fragment:w0,opaque_fragment:E0,packing:T0,premultiplied_alpha_fragment:A0,project_vertex:R0,dithering_fragment:C0,dithering_pars_fragment:P0,roughnessmap_fragment:I0,roughnessmap_pars_fragment:L0,shadowmap_pars_fragment:D0,shadowmap_pars_vertex:U0,shadowmap_vertex:N0,shadowmask_pars_fragment:k0,skinbase_vertex:F0,skinning_pars_vertex:O0,skinning_vertex:B0,skinnormal_vertex:z0,specularmap_fragment:H0,specularmap_pars_fragment:V0,tonemapping_fragment:G0,tonemapping_pars_fragment:W0,transmission_fragment:X0,transmission_pars_fragment:Y0,uv_pars_fragment:q0,uv_pars_vertex:Z0,uv_vertex:$0,worldpos_vertex:J0,background_vert:K0,background_frag:j0,backgroundCube_vert:Q0,backgroundCube_frag:eg,cube_vert:tg,cube_frag:ng,depth_vert:ig,depth_frag:sg,distanceRGBA_vert:rg,distanceRGBA_frag:og,equirect_vert:ag,equirect_frag:lg,linedashed_vert:cg,linedashed_frag:hg,meshbasic_vert:ug,meshbasic_frag:dg,meshlambert_vert:fg,meshlambert_frag:pg,meshmatcap_vert:mg,meshmatcap_frag:gg,meshnormal_vert:_g,meshnormal_frag:xg,meshphong_vert:yg,meshphong_frag:vg,meshphysical_vert:bg,meshphysical_frag:Mg,meshtoon_vert:Sg,meshtoon_frag:wg,points_vert:Eg,points_frag:Tg,shadow_vert:Ag,shadow_frag:Rg,sprite_vert:Cg,sprite_frag:Pg},de={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new be(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new be(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},jn={basic:{uniforms:en([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:en([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:en([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:en([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:en([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:en([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:en([de.points,de.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:en([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:en([de.common,de.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:en([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:en([de.sprite,de.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distanceRGBA:{uniforms:en([de.common,de.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distanceRGBA_vert,fragmentShader:Ye.distanceRGBA_frag},shadow:{uniforms:en([de.lights,de.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};jn.physical={uniforms:en([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new be(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new be},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new be},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};var Do={r:0,b:0,g:0},ts=new hn,Ig=new Ge;function Lg(n,e,t,i,s,r,o){let a=new Pe(0),c=r===!0?0:1,h,l,u=null,f=0,p=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?t:e).get(v)),v}function _(x){let v=!1,y=g(x);y===null?d(a,c):y&&y.isColor&&(d(y,1),v=!0);let P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,o):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,v){let y=g(v);y&&(y.isCubeTexture||y.mapping===ya)?(l===void 0&&(l=new De(new Hn(1,1,1),new Rn({name:"BackgroundCubeMaterial",uniforms:Zs(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:jt,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(P,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),ts.copy(v.backgroundRotation),ts.x*=-1,ts.y*=-1,ts.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ts.y*=-1,ts.z*=-1),l.material.uniforms.envMap.value=y,l.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Ig.makeRotationFromEuler(ts)),l.material.toneMapped=Ke.getTransfer(y.colorSpace)!==rt,(u!==y||f!==y.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,f=y.version,p=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null)):y&&y.isTexture&&(h===void 0&&(h=new De(new Mi(2,2),new Rn({name:"BackgroundMaterial",uniforms:Zs(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:Hi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=y,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.toneMapped=Ke.getTransfer(y.colorSpace)!==rt,y.matrixAutoUpdate===!0&&y.updateMatrix(),h.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||f!==y.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=y,f=y.version,p=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null))}function d(x,v){x.getRGB(Do,Sd(n)),i.buffers.color.setClear(Do.r,Do.g,Do.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),c=v,d(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,d(a,c)},render:_,addToRenderList:m}}function Dg(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,o=!1;function a(b,D,G,W,q){let ie=!1,Z=u(W,G,D);r!==Z&&(r=Z,h(r.object)),ie=p(b,W,G,q),ie&&g(b,W,G,q),q!==null&&e.update(q,n.ELEMENT_ARRAY_BUFFER),(ie||o)&&(o=!1,y(b,D,G,W),q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function c(){return n.createVertexArray()}function h(b){return n.bindVertexArray(b)}function l(b){return n.deleteVertexArray(b)}function u(b,D,G){let W=G.wireframe===!0,q=i[b.id];q===void 0&&(q={},i[b.id]=q);let ie=q[D.id];ie===void 0&&(ie={},q[D.id]=ie);let Z=ie[W];return Z===void 0&&(Z=f(c()),ie[W]=Z),Z}function f(b){let D=[],G=[],W=[];for(let q=0;q<t;q++)D[q]=0,G[q]=0,W[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:G,attributeDivisors:W,object:b,attributes:{},index:null}}function p(b,D,G,W){let q=r.attributes,ie=D.attributes,Z=0,w=G.getAttributes();for(let L in w)if(w[L].location>=0){let J=q[L],Q=ie[L];if(Q===void 0&&(L==="instanceMatrix"&&b.instanceMatrix&&(Q=b.instanceMatrix),L==="instanceColor"&&b.instanceColor&&(Q=b.instanceColor)),J===void 0||J.attribute!==Q||Q&&J.data!==Q.data)return!0;Z++}return r.attributesNum!==Z||r.index!==W}function g(b,D,G,W){let q={},ie=D.attributes,Z=0,w=G.getAttributes();for(let L in w)if(w[L].location>=0){let J=ie[L];J===void 0&&(L==="instanceMatrix"&&b.instanceMatrix&&(J=b.instanceMatrix),L==="instanceColor"&&b.instanceColor&&(J=b.instanceColor));let Q={};Q.attribute=J,J&&J.data&&(Q.data=J.data),q[L]=Q,Z++}r.attributes=q,r.attributesNum=Z,r.index=W}function _(){let b=r.newAttributes;for(let D=0,G=b.length;D<G;D++)b[D]=0}function m(b){d(b,0)}function d(b,D){let G=r.newAttributes,W=r.enabledAttributes,q=r.attributeDivisors;G[b]=1,W[b]===0&&(n.enableVertexAttribArray(b),W[b]=1),q[b]!==D&&(n.vertexAttribDivisor(b,D),q[b]=D)}function x(){let b=r.newAttributes,D=r.enabledAttributes;for(let G=0,W=D.length;G<W;G++)D[G]!==b[G]&&(n.disableVertexAttribArray(G),D[G]=0)}function v(b,D,G,W,q,ie,Z){Z===!0?n.vertexAttribIPointer(b,D,G,q,ie):n.vertexAttribPointer(b,D,G,W,q,ie)}function y(b,D,G,W){_();let q=W.attributes,ie=G.getAttributes(),Z=D.defaultAttributeValues;for(let w in ie){let L=ie[w];if(L.location>=0){let B=q[w];if(B===void 0&&(w==="instanceMatrix"&&b.instanceMatrix&&(B=b.instanceMatrix),w==="instanceColor"&&b.instanceColor&&(B=b.instanceColor)),B!==void 0){let J=B.normalized,Q=B.itemSize,K=e.get(B);if(K===void 0)continue;let se=K.buffer,U=K.type,z=K.bytesPerElement,oe=U===n.INT||U===n.UNSIGNED_INT||B.gpuType===Xc;if(B.isInterleavedBufferAttribute){let H=B.data,he=H.stride,Re=B.offset;if(H.isInstancedInterleavedBuffer){for(let Ne=0;Ne<L.locationSize;Ne++)d(L.location+Ne,H.meshPerAttribute);b.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let Ne=0;Ne<L.locationSize;Ne++)m(L.location+Ne);n.bindBuffer(n.ARRAY_BUFFER,se);for(let Ne=0;Ne<L.locationSize;Ne++)v(L.location+Ne,Q/L.locationSize,U,J,he*z,(Re+Q/L.locationSize*Ne)*z,oe)}else{if(B.isInstancedBufferAttribute){for(let H=0;H<L.locationSize;H++)d(L.location+H,B.meshPerAttribute);b.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let H=0;H<L.locationSize;H++)m(L.location+H);n.bindBuffer(n.ARRAY_BUFFER,se);for(let H=0;H<L.locationSize;H++)v(L.location+H,Q/L.locationSize,U,J,Q*z,Q/L.locationSize*H*z,oe)}}else if(Z!==void 0){let J=Z[w];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(L.location,J);break;case 3:n.vertexAttrib3fv(L.location,J);break;case 4:n.vertexAttrib4fv(L.location,J);break;default:n.vertexAttrib1fv(L.location,J)}}}}x()}function P(){C();for(let b in i){let D=i[b];for(let G in D){let W=D[G];for(let q in W)l(W[q].object),delete W[q];delete D[G]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;let D=i[b.id];for(let G in D){let W=D[G];for(let q in W)l(W[q].object),delete W[q];delete D[G]}delete i[b.id]}function A(b){for(let D in i){let G=i[D];if(G[b.id]===void 0)continue;let W=G[b.id];for(let q in W)l(W[q].object),delete W[q];delete G[b.id]}}function C(){M(),o=!0,r!==s&&(r=s,h(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:M,dispose:P,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function Ug(n,e,t){let i;function s(h){i=h}function r(h,l){n.drawArrays(i,h,l),t.update(l,i,1)}function o(h,l,u){u!==0&&(n.drawArraysInstanced(i,h,l,u),t.update(l,i,u))}function a(h,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,l,0,u);let p=0;for(let g=0;g<u;g++)p+=l[g];t.update(p,i,1)}function c(h,l,u,f){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<h.length;g++)o(h[g],l[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(i,h,0,l,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=l[_]*f[_];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Ng(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Bn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let C=A===Yr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==xi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ei&&!C)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp",l=c(h);l!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",l,"instead."),h=l);let u=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:h,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:P,maxSamples:T}}function kg(n){let e=this,t=null,i=0,s=!1,r=!1,o=new bn,a=new Fe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let p=u.length!==0||f||i!==0||s;return s=f,i=u.length,p},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=l(u,f,0)},this.setState=function(u,f,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,d=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?l(null):h();else{let x=r?0:i,v=x*4,y=d.clippingState||null;c.value=y,y=l(g,f,v,p);for(let P=0;P!==v;++P)y[P]=t[P];d.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function l(u,f,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let d=p+_*4,x=f.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<d)&&(m=new Float32Array(d));for(let v=0,y=p;v!==_;++v,y+=4)o.copy(u[v]).applyMatrix4(x,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Fg(n){let e=new WeakMap;function t(o,a){return a===Dl?o.mapping=Ws:a===Ul&&(o.mapping=Xs),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===Dl||a===Ul)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let h=new fc(c.height);return h.fromEquirectangularTexture(n,o),e.set(o,h),o.addEventListener("dispose",s),t(h.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var ia=class extends ta{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,o=r+h*this.view.width,a-=l*this.view.offsetY,c=a-l*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Bs=4,Tu=[.125,.215,.35,.446,.526,.582],os=20,dl=new ia,Au=new Pe,fl=null,pl=0,ml=0,gl=!1,is=(1+Math.sqrt(5))/2,ks=1/is,Ru=[new I(-is,ks,0),new I(is,ks,0),new I(-ks,0,is),new I(ks,0,is),new I(0,is,-ks),new I(0,is,ks),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],$s=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){fl=this._renderer.getRenderTarget(),pl=this._renderer.getActiveCubeFace(),ml=this._renderer.getActiveMipmapLevel(),gl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Iu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Pu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(fl,pl,ml),this._renderer.xr.enabled=gl,e.scissorTest=!1,Uo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ws||e.mapping===Xs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),fl=this._renderer.getRenderTarget(),pl=this._renderer.getActiveCubeFace(),ml=this._renderer.getActiveMipmapLevel(),gl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Qn,minFilter:Qn,generateMipmaps:!1,type:Yr,format:Bn,colorSpace:Qs,depthBuffer:!1},s=Cu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Cu(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Og(r)),this._blurMaterial=Bg(r,e,t)}return s}_compileMaterial(e){let t=new De(this._lodPlanes[0],e);this._renderer.compile(t,dl)}_sceneToCubeUV(e,t,i,s){let a=new Gt(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,f=l.toneMapping;l.getClearColor(Au),l.toneMapping=ti,l.autoClear=!1;let p=new zt({name:"PMREM.Background",side:jt,depthWrite:!1,depthTest:!1}),g=new De(new Hn,p),_=!1,m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(Au),_=!0);for(let d=0;d<6;d++){let x=d%3;x===0?(a.up.set(0,c[d],0),a.lookAt(h[d],0,0)):x===1?(a.up.set(0,0,c[d]),a.lookAt(0,h[d],0)):(a.up.set(0,c[d],0),a.lookAt(0,0,h[d]));let v=this._cubeSize;Uo(s,x*v,d>2?v:0,v,v),l.setRenderTarget(s),_&&l.render(g,a),l.render(e,a)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=f,l.autoClear=u,e.background=m}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Ws||e.mapping===Xs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Iu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Pu());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new De(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Uo(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,dl)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ru[(s-r-1)%Ru.length];this._blur(e,r-1,r,o,a)}t.autoClear=i}_blur(e,t,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){let c=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let l=3,u=new De(this._lodPlanes[s],h),f=h.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*os-1),_=r/g,m=isFinite(r)?1+Math.floor(l*_):os;m>os&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${os}`);let d=[],x=0;for(let A=0;A<os;++A){let C=A/_,M=Math.exp(-C*C/2);d.push(M),A===0?x+=M:A<m&&(x+=2*M)}for(let A=0;A<d.length;A++)d[A]=d[A]/x;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-i;let y=this._sizeLods[s],P=3*y*(s>v-Bs?s-v+Bs:0),T=4*(this._cubeSize-y);Uo(t,P,T,3*y,2*y),c.setRenderTarget(t),c.render(u,dl)}};function Og(n){let e=[],t=[],i=[],s=n,r=n-Bs+1+Tu.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>n-Bs?c=Tu[o-n+Bs-1]:o===0&&(c=0),i.push(c);let h=1/(a-2),l=-h,u=1+h,f=[l,l,u,l,u,u,l,l,u,u,l,u],p=6,g=6,_=3,m=2,d=1,x=new Float32Array(_*g*p),v=new Float32Array(m*g*p),y=new Float32Array(d*g*p);for(let T=0;T<p;T++){let A=T%3*2/3-1,C=T>2?0:-1,M=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];x.set(M,_*g*T),v.set(f,m*g*T);let b=[T,T,T,T,T,T];y.set(b,d*g*T)}let P=new xt;P.setAttribute("position",new _t(x,_)),P.setAttribute("uv",new _t(v,m)),P.setAttribute("faceIndex",new _t(y,d)),e.push(P),s>Bs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Cu(n,e,t){let i=new zn(n,e,t);return i.texture.mapping=ya,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Uo(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function Bg(n,e,t){let i=new Float32Array(os),s=new I(0,1,0);return new Rn({name:"SphericalGaussianBlur",defines:{n:os,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Qc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function Pu(){return new Rn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function Iu(){return new Rn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function Qc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function zg(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){let c=a.mapping,h=c===Dl||c===Ul,l=c===Ws||c===Xs;if(h||l){let u=e.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new $s(n)),u=h?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return h&&p&&p.height>0||l&&p&&s(p)?(t===null&&(t=new $s(n)),u=h?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0,h=6;for(let l=0;l<h;l++)a[l]!==void 0&&c++;return c===h}function r(a){let c=a.target;c.removeEventListener("dispose",r);let h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function Hg(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Cr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Vg(n,e,t,i){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);for(let g in f.morphAttributes){let _=f.morphAttributes[g];for(let m=0,d=_.length;m<d;m++)e.remove(_[m])}f.removeEventListener("dispose",o),delete s[f.id];let p=r.get(f);p&&(e.remove(p),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function c(u){let f=u.attributes;for(let g in f)e.update(f[g],n.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let m=0,d=_.length;m<d;m++)e.update(_[m],n.ARRAY_BUFFER)}}function h(u){let f=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let x=p.array;_=p.version;for(let v=0,y=x.length;v<y;v+=3){let P=x[v+0],T=x[v+1],A=x[v+2];f.push(P,T,T,A,A,P)}}else if(g!==void 0){let x=g.array;_=g.version;for(let v=0,y=x.length/3-1;v<y;v+=3){let P=v+0,T=v+1,A=v+2;f.push(P,T,T,A,A,P)}}else return;let m=new(bd(f)?ea:Qo)(f,1);m.version=_;let d=r.get(u);d&&e.remove(d),r.set(u,m)}function l(u){let f=r.get(u);if(f){let p=u.index;p!==null&&f.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:l}}function Gg(n,e,t){let i;function s(f){i=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,p){n.drawElements(i,p,r,f*o),t.update(p,i,1)}function h(f,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,f*o,g),t.update(p,i,g))}function l(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];t.update(m,i,1)}function u(f,p,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)h(f[d]/o,p[d],_[d]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,f,0,_,0,g);let d=0;for(let x=0;x<g;x++)d+=p[x]*_[x];t.update(d,i,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=h,this.renderMultiDraw=l,this.renderMultiDrawInstances=u}function Wg(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Xg(n,e,t){let i=new WeakMap,s=new ot;function r(o,a,c){let h=o.morphTargetInfluences,l=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=l!==void 0?l.length:0,f=i.get(a);if(f===void 0||f.count!==u){let M=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",M)};f!==void 0&&f.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],v=0;p===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let y=a.attributes.position.count*v,P=1;y>e.maxTextureSize&&(P=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let T=new Float32Array(y*P*4*u),A=new jo(T,y,P,u);A.type=ei,A.needsUpdate=!0;let C=v*4;for(let b=0;b<u;b++){let D=m[b],G=d[b],W=x[b],q=y*P*4*b;for(let ie=0;ie<D.count;ie++){let Z=ie*C;p===!0&&(s.fromBufferAttribute(D,ie),T[q+Z+0]=s.x,T[q+Z+1]=s.y,T[q+Z+2]=s.z,T[q+Z+3]=0),g===!0&&(s.fromBufferAttribute(G,ie),T[q+Z+4]=s.x,T[q+Z+5]=s.y,T[q+Z+6]=s.z,T[q+Z+7]=0),_===!0&&(s.fromBufferAttribute(W,ie),T[q+Z+8]=s.x,T[q+Z+9]=s.y,T[q+Z+10]=s.z,T[q+Z+11]=W.itemSize===4?s.w:1)}}f={count:u,texture:A,size:new be(y,P)},i.set(a,f),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let p=0;for(let _=0;_<h.length;_++)p+=h[_];let g=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function Yg(n,e,t,i){let s=new WeakMap;function r(c){let h=i.render.frame,l=c.geometry,u=e.get(c,l);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function o(){s=new WeakMap}function a(c){let h=c.target;h.removeEventListener("dispose",a),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}var sa=class extends cn{constructor(e,t,i,s,r,o,a,c,h,l=zs){if(l!==zs&&l!==qs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&l===zs&&(i=cs),i===void 0&&l===qs&&(i=Ys),super(null,s,r,o,a,c,l,i,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Mn,this.minFilter=c!==void 0?c:Mn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Ed=new cn,Lu=new sa(1,1),Td=new jo,Ad=new uc,Rd=new na,Du=[],Uu=[],Nu=new Float32Array(16),ku=new Float32Array(9),Fu=new Float32Array(4);function tr(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=Du[s];if(r===void 0&&(r=new Float32Array(s),Du[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function Dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ut(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ba(n,e){let t=Uu[e];t===void 0&&(t=new Int32Array(e),Uu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function qg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Zg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2fv(this.addr,e),Ut(t,e)}}function $g(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;n.uniform3fv(this.addr,e),Ut(t,e)}}function Jg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4fv(this.addr,e),Ut(t,e)}}function Kg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;Fu.set(i),n.uniformMatrix2fv(this.addr,!1,Fu),Ut(t,i)}}function jg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;ku.set(i),n.uniformMatrix3fv(this.addr,!1,ku),Ut(t,i)}}function Qg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;Nu.set(i),n.uniformMatrix4fv(this.addr,!1,Nu),Ut(t,i)}}function e_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function t_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2iv(this.addr,e),Ut(t,e)}}function n_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3iv(this.addr,e),Ut(t,e)}}function i_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4iv(this.addr,e),Ut(t,e)}}function s_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function r_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2uiv(this.addr,e),Ut(t,e)}}function o_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3uiv(this.addr,e),Ut(t,e)}}function a_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4uiv(this.addr,e),Ut(t,e)}}function l_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Lu.compareFunction=vd,r=Lu):r=Ed,t.setTexture2D(e||r,s)}function c_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Ad,s)}function h_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Rd,s)}function u_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Td,s)}function d_(n){switch(n){case 5126:return qg;case 35664:return Zg;case 35665:return $g;case 35666:return Jg;case 35674:return Kg;case 35675:return jg;case 35676:return Qg;case 5124:case 35670:return e_;case 35667:case 35671:return t_;case 35668:case 35672:return n_;case 35669:case 35673:return i_;case 5125:return s_;case 36294:return r_;case 36295:return o_;case 36296:return a_;case 35678:case 36198:case 36298:case 36306:case 35682:return l_;case 35679:case 36299:case 36307:return c_;case 35680:case 36300:case 36308:case 36293:return h_;case 36289:case 36303:case 36311:case 36292:return u_}}function f_(n,e){n.uniform1fv(this.addr,e)}function p_(n,e){let t=tr(e,this.size,2);n.uniform2fv(this.addr,t)}function m_(n,e){let t=tr(e,this.size,3);n.uniform3fv(this.addr,t)}function g_(n,e){let t=tr(e,this.size,4);n.uniform4fv(this.addr,t)}function __(n,e){let t=tr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function x_(n,e){let t=tr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function y_(n,e){let t=tr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function v_(n,e){n.uniform1iv(this.addr,e)}function b_(n,e){n.uniform2iv(this.addr,e)}function M_(n,e){n.uniform3iv(this.addr,e)}function S_(n,e){n.uniform4iv(this.addr,e)}function w_(n,e){n.uniform1uiv(this.addr,e)}function E_(n,e){n.uniform2uiv(this.addr,e)}function T_(n,e){n.uniform3uiv(this.addr,e)}function A_(n,e){n.uniform4uiv(this.addr,e)}function R_(n,e,t){let i=this.cache,s=e.length,r=ba(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Ed,r[o])}function C_(n,e,t){let i=this.cache,s=e.length,r=ba(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Ad,r[o])}function P_(n,e,t){let i=this.cache,s=e.length,r=ba(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Rd,r[o])}function I_(n,e,t){let i=this.cache,s=e.length,r=ba(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Td,r[o])}function L_(n){switch(n){case 5126:return f_;case 35664:return p_;case 35665:return m_;case 35666:return g_;case 35674:return __;case 35675:return x_;case 35676:return y_;case 5124:case 35670:return v_;case 35667:case 35671:return b_;case 35668:case 35672:return M_;case 35669:case 35673:return S_;case 5125:return w_;case 36294:return E_;case 36295:return T_;case 36296:return A_;case 35678:case 36198:case 36298:case 36306:case 35682:return R_;case 35679:case 36299:case 36307:return C_;case 35680:case 36300:case 36308:case 36293:return P_;case 36289:case 36303:case 36311:case 36292:return I_}}var pc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=d_(t.type)}},mc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=L_(t.type)}},gc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},_l=/(\w+)(\])?(\[|\.)?/g;function Ou(n,e){n.seq.push(e),n.map[e.id]=e}function D_(n,e,t){let i=n.name,s=i.length;for(_l.lastIndex=0;;){let r=_l.exec(i),o=_l.lastIndex,a=r[1],c=r[2]==="]",h=r[3];if(c&&(a=a|0),h===void 0||h==="["&&o+2===s){Ou(t,h===void 0?new pc(a,n,e):new mc(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new gc(a),Ou(t,u)),t=u}}}var Vs=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);D_(r,o,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function Bu(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var U_=37297,N_=0;function k_(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var zu=new Fe;function F_(n){Ke._getMatrix(zu,Ke.workingColorSpace,n);let e=`mat3( ${zu.elements.map(t=>t.toFixed(4))} )`;switch(Ke.getTransfer(n)){case va:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Hu(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+k_(n.getShaderSource(e),o)}else return s}function O_(n,e){let t=F_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function B_(n,e){let t;switch(e){case Jf:t="Linear";break;case Kf:t="Reinhard";break;case jf:t="Cineon";break;case Wc:t="ACESFilmic";break;case ep:t="AgX";break;case tp:t="Neutral";break;case Qf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var No=new I;function z_(){Ke.getLuminanceCoefficients(No);let n=No.x.toFixed(4),e=No.y.toFixed(4),t=No.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function H_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Pr).join(`
`)}function V_(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function G_(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Pr(n){return n!==""}function Vu(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Gu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var W_=/^[ \t]*#include +<([\w\d./]+)>/gm;function _c(n){return n.replace(W_,Y_)}var X_=new Map;function Y_(n,e){let t=Ye[e];if(t===void 0){let i=X_.get(e);if(i!==void 0)t=Ye[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return _c(t)}var q_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wu(n){return n.replace(q_,Z_)}function Z_(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Xu(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function $_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ad?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Gc?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===mi&&(e="SHADOWMAP_TYPE_VSM"),e}function J_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ws:case Xs:e="ENVMAP_TYPE_CUBE";break;case ya:e="ENVMAP_TYPE_CUBE_UV";break}return e}function K_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Xs:e="ENVMAP_MODE_REFRACTION";break}return e}function j_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ld:e="ENVMAP_BLENDING_MULTIPLY";break;case Zf:e="ENVMAP_BLENDING_MIX";break;case $f:e="ENVMAP_BLENDING_ADD";break}return e}function Q_(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function ex(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=$_(t),h=J_(t),l=K_(t),u=j_(t),f=Q_(t),p=H_(t),g=V_(r),_=s.createProgram(),m,d,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Pr).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Pr).join(`
`),d.length>0&&(d+=`
`)):(m=[Xu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Pr).join(`
`),d=[Xu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ti?"#define TONE_MAPPING":"",t.toneMapping!==ti?Ye.tonemapping_pars_fragment:"",t.toneMapping!==ti?B_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,O_("linearToOutputTexel",t.outputColorSpace),z_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Pr).join(`
`)),o=_c(o),o=Vu(o,t),o=Gu(o,t),a=_c(a),a=Vu(a,t),a=Gu(a,t),o=Wu(o),a=Wu(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===su?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===su?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let v=x+m+o,y=x+d+a,P=Bu(s,s.VERTEX_SHADER,v),T=Bu(s,s.FRAGMENT_SHADER,y);s.attachShader(_,P),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(D){if(n.debug.checkShaderErrors){let G=s.getProgramInfoLog(_).trim(),W=s.getShaderInfoLog(P).trim(),q=s.getShaderInfoLog(T).trim(),ie=!0,Z=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(ie=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,P,T);else{let w=Hu(s,P,"vertex"),L=Hu(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+G+`
`+w+`
`+L)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(W===""||q==="")&&(Z=!1);Z&&(D.diagnostics={runnable:ie,programLog:G,vertexShader:{log:W,prefix:m},fragmentShader:{log:q,prefix:d}})}s.deleteShader(P),s.deleteShader(T),C=new Vs(s,_),M=G_(s,_)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(_,U_)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=N_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=T,this}var tx=0,xc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new yc(e),t.set(e,i)),i}},yc=class{constructor(e){this.id=tx++,this.code=e,this.usedTimes=0}};function nx(n,e,t,i,s,r,o){let a=new Or,c=new xc,h=new Set,l=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return h.add(M),M===0?"uv":`uv${M}`}function m(M,b,D,G,W){let q=G.fog,ie=W.geometry,Z=M.isMeshStandardMaterial?G.environment:null,w=(M.isMeshStandardMaterial?t:e).get(M.envMap||Z),L=w&&w.mapping===ya?w.image.height:null,B=g[M.type];M.precision!==null&&(p=s.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));let J=ie.morphAttributes.position||ie.morphAttributes.normal||ie.morphAttributes.color,Q=J!==void 0?J.length:0,K=0;ie.morphAttributes.position!==void 0&&(K=1),ie.morphAttributes.normal!==void 0&&(K=2),ie.morphAttributes.color!==void 0&&(K=3);let se,U,z,oe;if(B){let nt=jn[B];se=nt.vertexShader,U=nt.fragmentShader}else se=M.vertexShader,U=M.fragmentShader,c.update(M),z=c.getVertexShaderID(M),oe=c.getFragmentShaderID(M);let H=n.getRenderTarget(),he=n.state.buffers.depth.getReversed(),Re=W.isInstancedMesh===!0,Ne=W.isBatchedMesh===!0,Qe=!!M.map,qe=!!M.matcap,pt=!!w,F=!!M.aoMap,yt=!!M.lightMap,Be=!!M.bumpMap,ze=!!M.normalMap,Ce=!!M.displacementMap,ft=!!M.emissiveMap,Ie=!!M.metalnessMap,R=!!M.roughnessMap,S=M.anisotropy>0,V=M.clearcoat>0,te=M.dispersion>0,re=M.iridescence>0,ee=M.sheen>0,Te=M.transmission>0,pe=S&&!!M.anisotropyMap,xe=V&&!!M.clearcoatMap,Je=V&&!!M.clearcoatNormalMap,le=V&&!!M.clearcoatRoughnessMap,ye=re&&!!M.iridescenceMap,Le=re&&!!M.iridescenceThicknessMap,Ue=ee&&!!M.sheenColorMap,ve=ee&&!!M.sheenRoughnessMap,$e=!!M.specularMap,Xe=!!M.specularColorMap,mt=!!M.specularIntensityMap,N=Te&&!!M.transmissionMap,fe=Te&&!!M.thicknessMap,$=!!M.gradientMap,ne=!!M.alphaMap,_e=M.alphaTest>0,me=!!M.alphaHash,He=!!M.extensions,wt=ti;M.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(wt=n.toneMapping);let $t={shaderID:B,shaderType:M.type,shaderName:M.name,vertexShader:se,fragmentShader:U,defines:M.defines,customVertexShaderID:z,customFragmentShaderID:oe,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:Ne,batchingColor:Ne&&W._colorsTexture!==null,instancing:Re,instancingColor:Re&&W.instanceColor!==null,instancingMorph:Re&&W.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:H===null?n.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:Qs,alphaToCoverage:!!M.alphaToCoverage,map:Qe,matcap:qe,envMap:pt,envMapMode:pt&&w.mapping,envMapCubeUVHeight:L,aoMap:F,lightMap:yt,bumpMap:Be,normalMap:ze,displacementMap:f&&Ce,emissiveMap:ft,normalMapObjectSpace:ze&&M.normalMapType===rp,normalMapTangentSpace:ze&&M.normalMapType===yd,metalnessMap:Ie,roughnessMap:R,anisotropy:S,anisotropyMap:pe,clearcoat:V,clearcoatMap:xe,clearcoatNormalMap:Je,clearcoatRoughnessMap:le,dispersion:te,iridescence:re,iridescenceMap:ye,iridescenceThicknessMap:Le,sheen:ee,sheenColorMap:Ue,sheenRoughnessMap:ve,specularMap:$e,specularColorMap:Xe,specularIntensityMap:mt,transmission:Te,transmissionMap:N,thicknessMap:fe,gradientMap:$,opaque:M.transparent===!1&&M.blending===zi&&M.alphaToCoverage===!1,alphaMap:ne,alphaTest:_e,alphaHash:me,combine:M.combine,mapUv:Qe&&_(M.map.channel),aoMapUv:F&&_(M.aoMap.channel),lightMapUv:yt&&_(M.lightMap.channel),bumpMapUv:Be&&_(M.bumpMap.channel),normalMapUv:ze&&_(M.normalMap.channel),displacementMapUv:Ce&&_(M.displacementMap.channel),emissiveMapUv:ft&&_(M.emissiveMap.channel),metalnessMapUv:Ie&&_(M.metalnessMap.channel),roughnessMapUv:R&&_(M.roughnessMap.channel),anisotropyMapUv:pe&&_(M.anisotropyMap.channel),clearcoatMapUv:xe&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Je&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:le&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:Le&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ue&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:ve&&_(M.sheenRoughnessMap.channel),specularMapUv:$e&&_(M.specularMap.channel),specularColorMapUv:Xe&&_(M.specularColorMap.channel),specularIntensityMapUv:mt&&_(M.specularIntensityMap.channel),transmissionMapUv:N&&_(M.transmissionMap.channel),thicknessMapUv:fe&&_(M.thicknessMap.channel),alphaMapUv:ne&&_(M.alphaMap.channel),vertexTangents:!!ie.attributes.tangent&&(ze||S),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!ie.attributes.color&&ie.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!ie.attributes.uv&&(Qe||ne),fog:!!q,useFog:M.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:he,skinning:W.isSkinnedMesh===!0,morphTargets:ie.morphAttributes.position!==void 0,morphNormals:ie.morphAttributes.normal!==void 0,morphColors:ie.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:K,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:wt,decodeVideoTexture:Qe&&M.map.isVideoTexture===!0&&Ke.getTransfer(M.map.colorSpace)===rt,decodeVideoTextureEmissive:ft&&M.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(M.emissiveMap.colorSpace)===rt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Lt,flipSided:M.side===jt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:He&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(He&&M.extensions.multiDraw===!0||Ne)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return $t.vertexUv1s=h.has(1),$t.vertexUv2s=h.has(2),$t.vertexUv3s=h.has(3),h.clear(),$t}function d(M){let b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(let D in M.defines)b.push(D),b.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(x(b,M),v(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function x(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function v(M,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reverseDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),M.push(a.mask)}function y(M){let b=g[M.type],D;if(b){let G=jn[b];D=Yp.clone(G.uniforms)}else D=M.uniforms;return D}function P(M,b){let D;for(let G=0,W=l.length;G<W;G++){let q=l[G];if(q.cacheKey===b){D=q,++D.usedTimes;break}}return D===void 0&&(D=new ex(n,b,M,r),l.push(D)),D}function T(M){if(--M.usedTimes===0){let b=l.indexOf(M);l[b]=l[l.length-1],l.pop(),M.destroy()}}function A(M){c.remove(M)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:y,acquireProgram:P,releaseProgram:T,releaseShaderCache:A,programs:l,dispose:C}}function ix(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function sx(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Yu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function qu(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(u,f,p,g,_,m){let d=n[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=m),e++,d}function a(u,f,p,g,_,m){let d=o(u,f,p,g,_,m);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):t.push(d)}function c(u,f,p,g,_,m){let d=o(u,f,p,g,_,m);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function h(u,f){t.length>1&&t.sort(u||sx),i.length>1&&i.sort(f||Yu),s.length>1&&s.sort(f||Yu)}function l(){for(let u=e,f=n.length;u<f;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:a,unshift:c,finish:l,sort:h}}function rx(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new qu,n.set(i,[o])):s>=r.length?(o=new qu,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function ox(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Pe};break;case"SpotLight":t={position:new I,direction:new I,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t}}}function ax(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new be};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new be};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new be,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var lx=0;function cx(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function hx(n){let e=new ox,t=ax(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new I);let s=new I,r=new Ge,o=new Ge;function a(h){let l=0,u=0,f=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let p=0,g=0,_=0,m=0,d=0,x=0,v=0,y=0,P=0,T=0,A=0;h.sort(cx);for(let M=0,b=h.length;M<b;M++){let D=h[M],G=D.color,W=D.intensity,q=D.distance,ie=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)l+=G.r*W,u+=G.g*W,f+=G.b*W;else if(D.isLightProbe){for(let Z=0;Z<9;Z++)i.probe[Z].addScaledVector(D.sh.coefficients[Z],W);A++}else if(D.isDirectionalLight){let Z=e.get(D);if(Z.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let w=D.shadow,L=t.get(D);L.shadowIntensity=w.intensity,L.shadowBias=w.bias,L.shadowNormalBias=w.normalBias,L.shadowRadius=w.radius,L.shadowMapSize=w.mapSize,i.directionalShadow[p]=L,i.directionalShadowMap[p]=ie,i.directionalShadowMatrix[p]=D.shadow.matrix,x++}i.directional[p]=Z,p++}else if(D.isSpotLight){let Z=e.get(D);Z.position.setFromMatrixPosition(D.matrixWorld),Z.color.copy(G).multiplyScalar(W),Z.distance=q,Z.coneCos=Math.cos(D.angle),Z.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),Z.decay=D.decay,i.spot[_]=Z;let w=D.shadow;if(D.map&&(i.spotLightMap[P]=D.map,P++,w.updateMatrices(D),D.castShadow&&T++),i.spotLightMatrix[_]=w.matrix,D.castShadow){let L=t.get(D);L.shadowIntensity=w.intensity,L.shadowBias=w.bias,L.shadowNormalBias=w.normalBias,L.shadowRadius=w.radius,L.shadowMapSize=w.mapSize,i.spotShadow[_]=L,i.spotShadowMap[_]=ie,y++}_++}else if(D.isRectAreaLight){let Z=e.get(D);Z.color.copy(G).multiplyScalar(W),Z.halfWidth.set(D.width*.5,0,0),Z.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=Z,m++}else if(D.isPointLight){let Z=e.get(D);if(Z.color.copy(D.color).multiplyScalar(D.intensity),Z.distance=D.distance,Z.decay=D.decay,D.castShadow){let w=D.shadow,L=t.get(D);L.shadowIntensity=w.intensity,L.shadowBias=w.bias,L.shadowNormalBias=w.normalBias,L.shadowRadius=w.radius,L.shadowMapSize=w.mapSize,L.shadowCameraNear=w.camera.near,L.shadowCameraFar=w.camera.far,i.pointShadow[g]=L,i.pointShadowMap[g]=ie,i.pointShadowMatrix[g]=D.shadow.matrix,v++}i.point[g]=Z,g++}else if(D.isHemisphereLight){let Z=e.get(D);Z.skyColor.copy(D.color).multiplyScalar(W),Z.groundColor.copy(D.groundColor).multiplyScalar(W),i.hemi[d]=Z,d++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2):(i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2)),i.ambient[0]=l,i.ambient[1]=u,i.ambient[2]=f;let C=i.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==d||C.numDirectionalShadows!==x||C.numPointShadows!==v||C.numSpotShadows!==y||C.numSpotMaps!==P||C.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=d,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=y+P-T,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,C.directionalLength=p,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=d,C.numDirectionalShadows=x,C.numPointShadows=v,C.numSpotShadows=y,C.numSpotMaps=P,C.numLightProbes=A,i.version=lx++)}function c(h,l){let u=0,f=0,p=0,g=0,_=0,m=l.matrixWorldInverse;for(let d=0,x=h.length;d<x;d++){let v=h[d];if(v.isDirectionalLight){let y=i.directional[u];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(v.isSpotLight){let y=i.spot[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(v.isRectAreaLight){let y=i.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){let y=i.point[f];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){let y=i.hemi[_];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:i}}function Zu(n){let e=new hx(n),t=[],i=[];function s(l){h.camera=l,t.length=0,i.length=0}function r(l){t.push(l)}function o(l){i.push(l)}function a(){e.setup(t)}function c(l){e.setupView(t,l)}let h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function ux(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Zu(n),e.set(s,[a])):r>=o.length?(a=new Zu(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var vc=class extends bi{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=ip,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},bc=class extends bi{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},dx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function px(n,e,t){let i=new Br,s=new be,r=new be,o=new ot,a=new vc({depthPacking:sp}),c=new bc,h={},l=t.maxTextureSize,u={[Hi]:jt,[jt]:Hi,[Lt]:Lt},f=new Rn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new be},radius:{value:4}},vertexShader:dx,fragmentShader:fx}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let g=new xt;g.setAttribute("position",new _t(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new De(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ad;let d=this.type;this.render=function(T,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;let M=n.getRenderTarget(),b=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),G=n.state;G.setBlending(Bi),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);let W=d!==mi&&this.type===mi,q=d===mi&&this.type!==mi;for(let ie=0,Z=T.length;ie<Z;ie++){let w=T[ie],L=w.shadow;if(L===void 0){console.warn("THREE.WebGLShadowMap:",w,"has no shadow.");continue}if(L.autoUpdate===!1&&L.needsUpdate===!1)continue;s.copy(L.mapSize);let B=L.getFrameExtents();if(s.multiply(B),r.copy(L.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/B.x),s.x=r.x*B.x,L.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/B.y),s.y=r.y*B.y,L.mapSize.y=r.y)),L.map===null||W===!0||q===!0){let Q=this.type!==mi?{minFilter:Mn,magFilter:Mn}:{};L.map!==null&&L.map.dispose(),L.map=new zn(s.x,s.y,Q),L.map.texture.name=w.name+".shadowMap",L.camera.updateProjectionMatrix()}n.setRenderTarget(L.map),n.clear();let J=L.getViewportCount();for(let Q=0;Q<J;Q++){let K=L.getViewport(Q);o.set(r.x*K.x,r.y*K.y,r.x*K.z,r.y*K.w),G.viewport(o),L.updateMatrices(w,Q),i=L.getFrustum(),y(A,C,L.camera,w,this.type)}L.isPointLightShadow!==!0&&this.type===mi&&x(L,C),L.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(M,b,D)};function x(T,A){let C=e.update(_);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new zn(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,C,f,_,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,C,p,_,null)}function v(T,A,C,M){let b=null,D=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)b=D;else if(b=C.isPointLight===!0?c:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let G=b.uuid,W=A.uuid,q=h[G];q===void 0&&(q={},h[G]=q);let ie=q[W];ie===void 0&&(ie=b.clone(),q[W]=ie,A.addEventListener("dispose",P)),b=ie}if(b.visible=A.visible,b.wireframe=A.wireframe,M===mi?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,C.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let G=n.properties.get(b);G.light=C}return b}function y(T,A,C,M,b){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===mi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);let W=e.update(T),q=T.material;if(Array.isArray(q)){let ie=W.groups;for(let Z=0,w=ie.length;Z<w;Z++){let L=ie[Z],B=q[L.materialIndex];if(B&&B.visible){let J=v(T,B,M,b);T.onBeforeShadow(n,T,A,C,W,J,L),n.renderBufferDirect(C,null,W,J,T,L),T.onAfterShadow(n,T,A,C,W,J,L)}}}else if(q.visible){let ie=v(T,q,M,b);T.onBeforeShadow(n,T,A,C,W,ie,null),n.renderBufferDirect(C,null,W,ie,T,null),T.onAfterShadow(n,T,A,C,W,ie,null)}}let G=T.children;for(let W=0,q=G.length;W<q;W++)y(G[W],A,C,M,b)}function P(T){T.target.removeEventListener("dispose",P);for(let C in h){let M=h[C],b=T.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}var mx={[Tl]:Al,[Rl]:Il,[Cl]:Ll,[Gs]:Pl,[Al]:Tl,[Il]:Rl,[Ll]:Cl,[Pl]:Gs};function gx(n,e){function t(){let N=!1,fe=new ot,$=null,ne=new ot(0,0,0,0);return{setMask:function(_e){$!==_e&&!N&&(n.colorMask(_e,_e,_e,_e),$=_e)},setLocked:function(_e){N=_e},setClear:function(_e,me,He,wt,$t){$t===!0&&(_e*=wt,me*=wt,He*=wt),fe.set(_e,me,He,wt),ne.equals(fe)===!1&&(n.clearColor(_e,me,He,wt),ne.copy(fe))},reset:function(){N=!1,$=null,ne.set(-1,0,0,0)}}}function i(){let N=!1,fe=!1,$=null,ne=null,_e=null;return{setReversed:function(me){if(fe!==me){let He=e.get("EXT_clip_control");fe?He.clipControlEXT(He.LOWER_LEFT_EXT,He.ZERO_TO_ONE_EXT):He.clipControlEXT(He.LOWER_LEFT_EXT,He.NEGATIVE_ONE_TO_ONE_EXT);let wt=_e;_e=null,this.setClear(wt)}fe=me},getReversed:function(){return fe},setTest:function(me){me?H(n.DEPTH_TEST):he(n.DEPTH_TEST)},setMask:function(me){$!==me&&!N&&(n.depthMask(me),$=me)},setFunc:function(me){if(fe&&(me=mx[me]),ne!==me){switch(me){case Tl:n.depthFunc(n.NEVER);break;case Al:n.depthFunc(n.ALWAYS);break;case Rl:n.depthFunc(n.LESS);break;case Gs:n.depthFunc(n.LEQUAL);break;case Cl:n.depthFunc(n.EQUAL);break;case Pl:n.depthFunc(n.GEQUAL);break;case Il:n.depthFunc(n.GREATER);break;case Ll:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ne=me}},setLocked:function(me){N=me},setClear:function(me){_e!==me&&(fe&&(me=1-me),n.clearDepth(me),_e=me)},reset:function(){N=!1,$=null,ne=null,_e=null,fe=!1}}}function s(){let N=!1,fe=null,$=null,ne=null,_e=null,me=null,He=null,wt=null,$t=null;return{setTest:function(nt){N||(nt?H(n.STENCIL_TEST):he(n.STENCIL_TEST))},setMask:function(nt){fe!==nt&&!N&&(n.stencilMask(nt),fe=nt)},setFunc:function(nt,Un,li){($!==nt||ne!==Un||_e!==li)&&(n.stencilFunc(nt,Un,li),$=nt,ne=Un,_e=li)},setOp:function(nt,Un,li){(me!==nt||He!==Un||wt!==li)&&(n.stencilOp(nt,Un,li),me=nt,He=Un,wt=li)},setLocked:function(nt){N=nt},setClear:function(nt){$t!==nt&&(n.clearStencil(nt),$t=nt)},reset:function(){N=!1,fe=null,$=null,ne=null,_e=null,me=null,He=null,wt=null,$t=null}}}let r=new t,o=new i,a=new s,c=new WeakMap,h=new WeakMap,l={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,x=null,v=null,y=null,P=null,T=null,A=new Pe(0,0,0),C=0,M=!1,b=null,D=null,G=null,W=null,q=null,ie=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Z=!1,w=0,L=n.getParameter(n.VERSION);L.indexOf("WebGL")!==-1?(w=parseFloat(/^WebGL (\d)/.exec(L)[1]),Z=w>=1):L.indexOf("OpenGL ES")!==-1&&(w=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),Z=w>=2);let B=null,J={},Q=n.getParameter(n.SCISSOR_BOX),K=n.getParameter(n.VIEWPORT),se=new ot().fromArray(Q),U=new ot().fromArray(K);function z(N,fe,$,ne){let _e=new Uint8Array(4),me=n.createTexture();n.bindTexture(N,me),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let He=0;He<$;He++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(fe,0,n.RGBA,1,1,ne,0,n.RGBA,n.UNSIGNED_BYTE,_e):n.texImage2D(fe+He,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,_e);return me}let oe={};oe[n.TEXTURE_2D]=z(n.TEXTURE_2D,n.TEXTURE_2D,1),oe[n.TEXTURE_CUBE_MAP]=z(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[n.TEXTURE_2D_ARRAY]=z(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),oe[n.TEXTURE_3D]=z(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),H(n.DEPTH_TEST),o.setFunc(Gs),Be(!1),ze(Jh),H(n.CULL_FACE),F(Bi);function H(N){l[N]!==!0&&(n.enable(N),l[N]=!0)}function he(N){l[N]!==!1&&(n.disable(N),l[N]=!1)}function Re(N,fe){return u[N]!==fe?(n.bindFramebuffer(N,fe),u[N]=fe,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=fe),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=fe),!0):!1}function Ne(N,fe){let $=p,ne=!1;if(N){$=f.get(fe),$===void 0&&($=[],f.set(fe,$));let _e=N.textures;if($.length!==_e.length||$[0]!==n.COLOR_ATTACHMENT0){for(let me=0,He=_e.length;me<He;me++)$[me]=n.COLOR_ATTACHMENT0+me;$.length=_e.length,ne=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,ne=!0);ne&&n.drawBuffers($)}function Qe(N){return g!==N?(n.useProgram(N),g=N,!0):!1}let qe={[ss]:n.FUNC_ADD,[If]:n.FUNC_SUBTRACT,[Lf]:n.FUNC_REVERSE_SUBTRACT};qe[Df]=n.MIN,qe[Uf]=n.MAX;let pt={[Nf]:n.ZERO,[kf]:n.ONE,[Ff]:n.SRC_COLOR,[wl]:n.SRC_ALPHA,[Gf]:n.SRC_ALPHA_SATURATE,[Hf]:n.DST_COLOR,[Bf]:n.DST_ALPHA,[Of]:n.ONE_MINUS_SRC_COLOR,[El]:n.ONE_MINUS_SRC_ALPHA,[Vf]:n.ONE_MINUS_DST_COLOR,[zf]:n.ONE_MINUS_DST_ALPHA,[Wf]:n.CONSTANT_COLOR,[Xf]:n.ONE_MINUS_CONSTANT_COLOR,[Yf]:n.CONSTANT_ALPHA,[qf]:n.ONE_MINUS_CONSTANT_ALPHA};function F(N,fe,$,ne,_e,me,He,wt,$t,nt){if(N===Bi){_===!0&&(he(n.BLEND),_=!1);return}if(_===!1&&(H(n.BLEND),_=!0),N!==Pf){if(N!==m||nt!==M){if((d!==ss||y!==ss)&&(n.blendEquation(n.FUNC_ADD),d=ss,y=ss),nt)switch(N){case zi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ur:n.blendFunc(n.ONE,n.ONE);break;case Kh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case jh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case zi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ur:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Kh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case jh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,v=null,P=null,T=null,A.set(0,0,0),C=0,m=N,M=nt}return}_e=_e||fe,me=me||$,He=He||ne,(fe!==d||_e!==y)&&(n.blendEquationSeparate(qe[fe],qe[_e]),d=fe,y=_e),($!==x||ne!==v||me!==P||He!==T)&&(n.blendFuncSeparate(pt[$],pt[ne],pt[me],pt[He]),x=$,v=ne,P=me,T=He),(wt.equals(A)===!1||$t!==C)&&(n.blendColor(wt.r,wt.g,wt.b,$t),A.copy(wt),C=$t),m=N,M=!1}function yt(N,fe){N.side===Lt?he(n.CULL_FACE):H(n.CULL_FACE);let $=N.side===jt;fe&&($=!$),Be($),N.blending===zi&&N.transparent===!1?F(Bi):F(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let ne=N.stencilWrite;a.setTest(ne),ne&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),ft(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?H(n.SAMPLE_ALPHA_TO_COVERAGE):he(n.SAMPLE_ALPHA_TO_COVERAGE)}function Be(N){b!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),b=N)}function ze(N){N!==Rf?(H(n.CULL_FACE),N!==D&&(N===Jh?n.cullFace(n.BACK):N===Cf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):he(n.CULL_FACE),D=N}function Ce(N){N!==G&&(Z&&n.lineWidth(N),G=N)}function ft(N,fe,$){N?(H(n.POLYGON_OFFSET_FILL),(W!==fe||q!==$)&&(n.polygonOffset(fe,$),W=fe,q=$)):he(n.POLYGON_OFFSET_FILL)}function Ie(N){N?H(n.SCISSOR_TEST):he(n.SCISSOR_TEST)}function R(N){N===void 0&&(N=n.TEXTURE0+ie-1),B!==N&&(n.activeTexture(N),B=N)}function S(N,fe,$){$===void 0&&(B===null?$=n.TEXTURE0+ie-1:$=B);let ne=J[$];ne===void 0&&(ne={type:void 0,texture:void 0},J[$]=ne),(ne.type!==N||ne.texture!==fe)&&(B!==$&&(n.activeTexture($),B=$),n.bindTexture(N,fe||oe[N]),ne.type=N,ne.texture=fe)}function V(){let N=J[B];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function te(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function re(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ee(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Te(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function pe(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function xe(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Je(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function le(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ye(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Le(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ue(N){se.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),se.copy(N))}function ve(N){U.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),U.copy(N))}function $e(N,fe){let $=h.get(fe);$===void 0&&($=new WeakMap,h.set(fe,$));let ne=$.get(N);ne===void 0&&(ne=n.getUniformBlockIndex(fe,N.name),$.set(N,ne))}function Xe(N,fe){let ne=h.get(fe).get(N);c.get(fe)!==ne&&(n.uniformBlockBinding(fe,ne,N.__bindingPointIndex),c.set(fe,ne))}function mt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),l={},B=null,J={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,x=null,v=null,y=null,P=null,T=null,A=new Pe(0,0,0),C=0,M=!1,b=null,D=null,G=null,W=null,q=null,se.set(0,0,n.canvas.width,n.canvas.height),U.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:H,disable:he,bindFramebuffer:Re,drawBuffers:Ne,useProgram:Qe,setBlending:F,setMaterial:yt,setFlipSided:Be,setCullFace:ze,setLineWidth:Ce,setPolygonOffset:ft,setScissorTest:Ie,activeTexture:R,bindTexture:S,unbindTexture:V,compressedTexImage2D:te,compressedTexImage3D:re,texImage2D:ye,texImage3D:Le,updateUBOMapping:$e,uniformBlockBinding:Xe,texStorage2D:Je,texStorage3D:le,texSubImage2D:ee,texSubImage3D:Te,compressedTexSubImage2D:pe,compressedTexSubImage3D:xe,scissor:Ue,viewport:ve,reset:mt}}function $u(n,e,t,i){let s=_x(i);switch(t){case fd:return n*e;case md:return n*e;case gd:return n*e*2;case Zc:return n*e/s.components*s.byteLength;case $c:return n*e/s.components*s.byteLength;case _d:return n*e*2/s.components*s.byteLength;case Jc:return n*e*2/s.components*s.byteLength;case pd:return n*e*3/s.components*s.byteLength;case Bn:return n*e*4/s.components*s.byteLength;case Kc:return n*e*4/s.components*s.byteLength;case Go:case Wo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Xo:case Yo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fl:case Bl:return Math.max(n,16)*Math.max(e,8)/4;case kl:case Ol:return Math.max(n,8)*Math.max(e,8)/2;case zl:case Hl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Vl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Gl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Xl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Yl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case ql:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Zl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case $l:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Jl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Kl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case jl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Ql:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ec:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case tc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case nc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case qo:case ic:case sc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case xd:case rc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case oc:case ac:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function _x(n){switch(n){case xi:case hd:return{byteLength:1,components:1};case kr:case ud:case Yr:return{byteLength:2,components:1};case Yc:case qc:return{byteLength:2,components:4};case cs:case Xc:case ei:return{byteLength:4,components:1};case dd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function xx(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new be,l=new WeakMap,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,S){return p?new OffscreenCanvas(R,S):Jo("canvas")}function _(R,S,V){let te=1,re=Ie(R);if((re.width>V||re.height>V)&&(te=V/Math.max(re.width,re.height)),te<1)if(typeof HTMLImageElement!="undefined"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&R instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&R instanceof ImageBitmap||typeof VideoFrame!="undefined"&&R instanceof VideoFrame){let ee=Math.floor(te*re.width),Te=Math.floor(te*re.height);u===void 0&&(u=g(ee,Te));let pe=S?g(ee,Te):u;return pe.width=ee,pe.height=Te,pe.getContext("2d").drawImage(R,0,0,ee,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+ee+"x"+Te+")."),pe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),R;return R}function m(R){return R.generateMipmaps}function d(R){n.generateMipmap(R)}function x(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(R,S,V,te,re=!1){if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ee=S;if(S===n.RED&&(V===n.FLOAT&&(ee=n.R32F),V===n.HALF_FLOAT&&(ee=n.R16F),V===n.UNSIGNED_BYTE&&(ee=n.R8)),S===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(ee=n.R8UI),V===n.UNSIGNED_SHORT&&(ee=n.R16UI),V===n.UNSIGNED_INT&&(ee=n.R32UI),V===n.BYTE&&(ee=n.R8I),V===n.SHORT&&(ee=n.R16I),V===n.INT&&(ee=n.R32I)),S===n.RG&&(V===n.FLOAT&&(ee=n.RG32F),V===n.HALF_FLOAT&&(ee=n.RG16F),V===n.UNSIGNED_BYTE&&(ee=n.RG8)),S===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(ee=n.RG8UI),V===n.UNSIGNED_SHORT&&(ee=n.RG16UI),V===n.UNSIGNED_INT&&(ee=n.RG32UI),V===n.BYTE&&(ee=n.RG8I),V===n.SHORT&&(ee=n.RG16I),V===n.INT&&(ee=n.RG32I)),S===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(ee=n.RGB8UI),V===n.UNSIGNED_SHORT&&(ee=n.RGB16UI),V===n.UNSIGNED_INT&&(ee=n.RGB32UI),V===n.BYTE&&(ee=n.RGB8I),V===n.SHORT&&(ee=n.RGB16I),V===n.INT&&(ee=n.RGB32I)),S===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(ee=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(ee=n.RGBA16UI),V===n.UNSIGNED_INT&&(ee=n.RGBA32UI),V===n.BYTE&&(ee=n.RGBA8I),V===n.SHORT&&(ee=n.RGBA16I),V===n.INT&&(ee=n.RGBA32I)),S===n.RGB&&V===n.UNSIGNED_INT_5_9_9_9_REV&&(ee=n.RGB9_E5),S===n.RGBA){let Te=re?va:Ke.getTransfer(te);V===n.FLOAT&&(ee=n.RGBA32F),V===n.HALF_FLOAT&&(ee=n.RGBA16F),V===n.UNSIGNED_BYTE&&(ee=Te===rt?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&(ee=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(ee=n.RGB5_A1)}return(ee===n.R16F||ee===n.R32F||ee===n.RG16F||ee===n.RG32F||ee===n.RGBA16F||ee===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function y(R,S){let V;return R?S===null||S===cs||S===Ys?V=n.DEPTH24_STENCIL8:S===ei?V=n.DEPTH32F_STENCIL8:S===kr&&(V=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===cs||S===Ys?V=n.DEPTH_COMPONENT24:S===ei?V=n.DEPTH_COMPONENT32F:S===kr&&(V=n.DEPTH_COMPONENT16),V}function P(R,S){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Mn&&R.minFilter!==Qn?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function T(R){let S=R.target;S.removeEventListener("dispose",T),C(S),S.isVideoTexture&&l.delete(S)}function A(R){let S=R.target;S.removeEventListener("dispose",A),b(S)}function C(R){let S=i.get(R);if(S.__webglInit===void 0)return;let V=R.source,te=f.get(V);if(te){let re=te[S.__cacheKey];re.usedTimes--,re.usedTimes===0&&M(R),Object.keys(te).length===0&&f.delete(V)}i.remove(R)}function M(R){let S=i.get(R);n.deleteTexture(S.__webglTexture);let V=R.source,te=f.get(V);delete te[S.__cacheKey],o.memory.textures--}function b(R){let S=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(S.__webglFramebuffer[te]))for(let re=0;re<S.__webglFramebuffer[te].length;re++)n.deleteFramebuffer(S.__webglFramebuffer[te][re]);else n.deleteFramebuffer(S.__webglFramebuffer[te]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[te])}else{if(Array.isArray(S.__webglFramebuffer))for(let te=0;te<S.__webglFramebuffer.length;te++)n.deleteFramebuffer(S.__webglFramebuffer[te]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let te=0;te<S.__webglColorRenderbuffer.length;te++)S.__webglColorRenderbuffer[te]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[te]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let V=R.textures;for(let te=0,re=V.length;te<re;te++){let ee=i.get(V[te]);ee.__webglTexture&&(n.deleteTexture(ee.__webglTexture),o.memory.textures--),i.remove(V[te])}i.remove(R)}let D=0;function G(){D=0}function W(){let R=D;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),D+=1,R}function q(R){let S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function ie(R,S){let V=i.get(R);if(R.isVideoTexture&&Ce(R),R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){let te=R.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{U(V,R,S);return}}t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+S)}function Z(R,S){let V=i.get(R);if(R.version>0&&V.__version!==R.version){U(V,R,S);return}t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+S)}function w(R,S){let V=i.get(R);if(R.version>0&&V.__version!==R.version){U(V,R,S);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+S)}function L(R,S){let V=i.get(R);if(R.version>0&&V.__version!==R.version){z(V,R,S);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+S)}let B={[Nr]:n.REPEAT,[as]:n.CLAMP_TO_EDGE,[Nl]:n.MIRRORED_REPEAT},J={[Mn]:n.NEAREST,[np]:n.NEAREST_MIPMAP_NEAREST,[mo]:n.NEAREST_MIPMAP_LINEAR,[Qn]:n.LINEAR,[Wa]:n.LINEAR_MIPMAP_NEAREST,[ls]:n.LINEAR_MIPMAP_LINEAR},Q={[op]:n.NEVER,[dp]:n.ALWAYS,[ap]:n.LESS,[vd]:n.LEQUAL,[lp]:n.EQUAL,[up]:n.GEQUAL,[cp]:n.GREATER,[hp]:n.NOTEQUAL};function K(R,S){if(S.type===ei&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Qn||S.magFilter===Wa||S.magFilter===mo||S.magFilter===ls||S.minFilter===Qn||S.minFilter===Wa||S.minFilter===mo||S.minFilter===ls)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,B[S.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,B[S.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,B[S.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,J[S.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,J[S.minFilter]),S.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,Q[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Mn||S.minFilter!==mo&&S.minFilter!==ls||S.type===ei&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function se(R,S){let V=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",T));let te=S.source,re=f.get(te);re===void 0&&(re={},f.set(te,re));let ee=q(S);if(ee!==R.__cacheKey){re[ee]===void 0&&(re[ee]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,V=!0),re[ee].usedTimes++;let Te=re[R.__cacheKey];Te!==void 0&&(re[R.__cacheKey].usedTimes--,Te.usedTimes===0&&M(S)),R.__cacheKey=ee,R.__webglTexture=re[ee].texture}return V}function U(R,S,V){let te=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(te=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(te=n.TEXTURE_3D);let re=se(R,S),ee=S.source;t.bindTexture(te,R.__webglTexture,n.TEXTURE0+V);let Te=i.get(ee);if(ee.version!==Te.__version||re===!0){t.activeTexture(n.TEXTURE0+V);let pe=Ke.getPrimaries(Ke.workingColorSpace),xe=S.colorSpace===Oi?null:Ke.getPrimaries(S.colorSpace),Je=S.colorSpace===Oi||pe===xe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je);let le=_(S.image,!1,s.maxTextureSize);le=ft(S,le);let ye=r.convert(S.format,S.colorSpace),Le=r.convert(S.type),Ue=v(S.internalFormat,ye,Le,S.colorSpace,S.isVideoTexture);K(te,S);let ve,$e=S.mipmaps,Xe=S.isVideoTexture!==!0,mt=Te.__version===void 0||re===!0,N=ee.dataReady,fe=P(S,le);if(S.isDepthTexture)Ue=y(S.format===qs,S.type),mt&&(Xe?t.texStorage2D(n.TEXTURE_2D,1,Ue,le.width,le.height):t.texImage2D(n.TEXTURE_2D,0,Ue,le.width,le.height,0,ye,Le,null));else if(S.isDataTexture)if($e.length>0){Xe&&mt&&t.texStorage2D(n.TEXTURE_2D,fe,Ue,$e[0].width,$e[0].height);for(let $=0,ne=$e.length;$<ne;$++)ve=$e[$],Xe?N&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,ve.width,ve.height,ye,Le,ve.data):t.texImage2D(n.TEXTURE_2D,$,Ue,ve.width,ve.height,0,ye,Le,ve.data);S.generateMipmaps=!1}else Xe?(mt&&t.texStorage2D(n.TEXTURE_2D,fe,Ue,le.width,le.height),N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,le.width,le.height,ye,Le,le.data)):t.texImage2D(n.TEXTURE_2D,0,Ue,le.width,le.height,0,ye,Le,le.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Xe&&mt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,Ue,$e[0].width,$e[0].height,le.depth);for(let $=0,ne=$e.length;$<ne;$++)if(ve=$e[$],S.format!==Bn)if(ye!==null)if(Xe){if(N)if(S.layerUpdates.size>0){let _e=$u(ve.width,ve.height,S.format,S.type);for(let me of S.layerUpdates){let He=ve.data.subarray(me*_e/ve.data.BYTES_PER_ELEMENT,(me+1)*_e/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,me,ve.width,ve.height,1,ye,He)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,ve.width,ve.height,le.depth,ye,ve.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,Ue,ve.width,ve.height,le.depth,0,ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?N&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,ve.width,ve.height,le.depth,ye,Le,ve.data):t.texImage3D(n.TEXTURE_2D_ARRAY,$,Ue,ve.width,ve.height,le.depth,0,ye,Le,ve.data)}else{Xe&&mt&&t.texStorage2D(n.TEXTURE_2D,fe,Ue,$e[0].width,$e[0].height);for(let $=0,ne=$e.length;$<ne;$++)ve=$e[$],S.format!==Bn?ye!==null?Xe?N&&t.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,ve.width,ve.height,ye,ve.data):t.compressedTexImage2D(n.TEXTURE_2D,$,Ue,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?N&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,ve.width,ve.height,ye,Le,ve.data):t.texImage2D(n.TEXTURE_2D,$,Ue,ve.width,ve.height,0,ye,Le,ve.data)}else if(S.isDataArrayTexture)if(Xe){if(mt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,Ue,le.width,le.height,le.depth),N)if(S.layerUpdates.size>0){let $=$u(le.width,le.height,S.format,S.type);for(let ne of S.layerUpdates){let _e=le.data.subarray(ne*$/le.data.BYTES_PER_ELEMENT,(ne+1)*$/le.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ne,le.width,le.height,1,ye,Le,_e)}S.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,ye,Le,le.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ue,le.width,le.height,le.depth,0,ye,Le,le.data);else if(S.isData3DTexture)Xe?(mt&&t.texStorage3D(n.TEXTURE_3D,fe,Ue,le.width,le.height,le.depth),N&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,ye,Le,le.data)):t.texImage3D(n.TEXTURE_3D,0,Ue,le.width,le.height,le.depth,0,ye,Le,le.data);else if(S.isFramebufferTexture){if(mt)if(Xe)t.texStorage2D(n.TEXTURE_2D,fe,Ue,le.width,le.height);else{let $=le.width,ne=le.height;for(let _e=0;_e<fe;_e++)t.texImage2D(n.TEXTURE_2D,_e,Ue,$,ne,0,ye,Le,null),$>>=1,ne>>=1}}else if($e.length>0){if(Xe&&mt){let $=Ie($e[0]);t.texStorage2D(n.TEXTURE_2D,fe,Ue,$.width,$.height)}for(let $=0,ne=$e.length;$<ne;$++)ve=$e[$],Xe?N&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,ye,Le,ve):t.texImage2D(n.TEXTURE_2D,$,Ue,ye,Le,ve);S.generateMipmaps=!1}else if(Xe){if(mt){let $=Ie(le);t.texStorage2D(n.TEXTURE_2D,fe,Ue,$.width,$.height)}N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ye,Le,le)}else t.texImage2D(n.TEXTURE_2D,0,Ue,ye,Le,le);m(S)&&d(te),Te.__version=ee.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function z(R,S,V){if(S.image.length!==6)return;let te=se(R,S),re=S.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+V);let ee=i.get(re);if(re.version!==ee.__version||te===!0){t.activeTexture(n.TEXTURE0+V);let Te=Ke.getPrimaries(Ke.workingColorSpace),pe=S.colorSpace===Oi?null:Ke.getPrimaries(S.colorSpace),xe=S.colorSpace===Oi||Te===pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);let Je=S.isCompressedTexture||S.image[0].isCompressedTexture,le=S.image[0]&&S.image[0].isDataTexture,ye=[];for(let ne=0;ne<6;ne++)!Je&&!le?ye[ne]=_(S.image[ne],!0,s.maxCubemapSize):ye[ne]=le?S.image[ne].image:S.image[ne],ye[ne]=ft(S,ye[ne]);let Le=ye[0],Ue=r.convert(S.format,S.colorSpace),ve=r.convert(S.type),$e=v(S.internalFormat,Ue,ve,S.colorSpace),Xe=S.isVideoTexture!==!0,mt=ee.__version===void 0||te===!0,N=re.dataReady,fe=P(S,Le);K(n.TEXTURE_CUBE_MAP,S);let $;if(Je){Xe&&mt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,fe,$e,Le.width,Le.height);for(let ne=0;ne<6;ne++){$=ye[ne].mipmaps;for(let _e=0;_e<$.length;_e++){let me=$[_e];S.format!==Bn?Ue!==null?Xe?N&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,_e,0,0,me.width,me.height,Ue,me.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,_e,$e,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Xe?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,_e,0,0,me.width,me.height,Ue,ve,me.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,_e,$e,me.width,me.height,0,Ue,ve,me.data)}}}else{if($=S.mipmaps,Xe&&mt){$.length>0&&fe++;let ne=Ie(ye[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,fe,$e,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(le){Xe?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,ye[ne].width,ye[ne].height,Ue,ve,ye[ne].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,$e,ye[ne].width,ye[ne].height,0,Ue,ve,ye[ne].data);for(let _e=0;_e<$.length;_e++){let He=$[_e].image[ne].image;Xe?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,_e+1,0,0,He.width,He.height,Ue,ve,He.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,_e+1,$e,He.width,He.height,0,Ue,ve,He.data)}}else{Xe?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,Ue,ve,ye[ne]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,$e,Ue,ve,ye[ne]);for(let _e=0;_e<$.length;_e++){let me=$[_e];Xe?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,_e+1,0,0,Ue,ve,me.image[ne]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,_e+1,$e,Ue,ve,me.image[ne])}}}m(S)&&d(n.TEXTURE_CUBE_MAP),ee.__version=re.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function oe(R,S,V,te,re,ee){let Te=r.convert(V.format,V.colorSpace),pe=r.convert(V.type),xe=v(V.internalFormat,Te,pe,V.colorSpace),Je=i.get(S),le=i.get(V);if(le.__renderTarget=S,!Je.__hasExternalTextures){let ye=Math.max(1,S.width>>ee),Le=Math.max(1,S.height>>ee);re===n.TEXTURE_3D||re===n.TEXTURE_2D_ARRAY?t.texImage3D(re,ee,xe,ye,Le,S.depth,0,Te,pe,null):t.texImage2D(re,ee,xe,ye,Le,0,Te,pe,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),ze(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,te,re,le.__webglTexture,0,Be(S)):(re===n.TEXTURE_2D||re>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,te,re,le.__webglTexture,ee),t.bindFramebuffer(n.FRAMEBUFFER,null)}function H(R,S,V){if(n.bindRenderbuffer(n.RENDERBUFFER,R),S.depthBuffer){let te=S.depthTexture,re=te&&te.isDepthTexture?te.type:null,ee=y(S.stencilBuffer,re),Te=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,pe=Be(S);ze(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,pe,ee,S.width,S.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,pe,ee,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,ee,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Te,n.RENDERBUFFER,R)}else{let te=S.textures;for(let re=0;re<te.length;re++){let ee=te[re],Te=r.convert(ee.format,ee.colorSpace),pe=r.convert(ee.type),xe=v(ee.internalFormat,Te,pe,ee.colorSpace),Je=Be(S);V&&ze(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Je,xe,S.width,S.height):ze(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Je,xe,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,xe,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function he(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let te=i.get(S.depthTexture);te.__renderTarget=S,(!te.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),ie(S.depthTexture,0);let re=te.__webglTexture,ee=Be(S);if(S.depthTexture.format===zs)ze(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,re,0,ee):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,re,0);else if(S.depthTexture.format===qs)ze(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,re,0,ee):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function Re(R){let S=i.get(R),V=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){let te=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),te){let re=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,te.removeEventListener("dispose",re)};te.addEventListener("dispose",re),S.__depthDisposeCallback=re}S.__boundDepthTexture=te}if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");he(S.__webglFramebuffer,R)}else if(V){S.__webglDepthbuffer=[];for(let te=0;te<6;te++)if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[te]),S.__webglDepthbuffer[te]===void 0)S.__webglDepthbuffer[te]=n.createRenderbuffer(),H(S.__webglDepthbuffer[te],R,!1);else{let re=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=S.__webglDepthbuffer[te];n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,re,n.RENDERBUFFER,ee)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),H(S.__webglDepthbuffer,R,!1);else{let te=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,re)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ne(R,S,V){let te=i.get(R);S!==void 0&&oe(te.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&Re(R)}function Qe(R){let S=R.texture,V=i.get(R),te=i.get(S);R.addEventListener("dispose",A);let re=R.textures,ee=R.isWebGLCubeRenderTarget===!0,Te=re.length>1;if(Te||(te.__webglTexture===void 0&&(te.__webglTexture=n.createTexture()),te.__version=S.version,o.memory.textures++),ee){V.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(S.mipmaps&&S.mipmaps.length>0){V.__webglFramebuffer[pe]=[];for(let xe=0;xe<S.mipmaps.length;xe++)V.__webglFramebuffer[pe][xe]=n.createFramebuffer()}else V.__webglFramebuffer[pe]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){V.__webglFramebuffer=[];for(let pe=0;pe<S.mipmaps.length;pe++)V.__webglFramebuffer[pe]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(Te)for(let pe=0,xe=re.length;pe<xe;pe++){let Je=i.get(re[pe]);Je.__webglTexture===void 0&&(Je.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&ze(R)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let pe=0;pe<re.length;pe++){let xe=re[pe];V.__webglColorRenderbuffer[pe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[pe]);let Je=r.convert(xe.format,xe.colorSpace),le=r.convert(xe.type),ye=v(xe.internalFormat,Je,le,xe.colorSpace,R.isXRRenderTarget===!0),Le=Be(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Le,ye,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.RENDERBUFFER,V.__webglColorRenderbuffer[pe])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),H(V.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ee){t.bindTexture(n.TEXTURE_CUBE_MAP,te.__webglTexture),K(n.TEXTURE_CUBE_MAP,S);for(let pe=0;pe<6;pe++)if(S.mipmaps&&S.mipmaps.length>0)for(let xe=0;xe<S.mipmaps.length;xe++)oe(V.__webglFramebuffer[pe][xe],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,xe);else oe(V.__webglFramebuffer[pe],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);m(S)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let pe=0,xe=re.length;pe<xe;pe++){let Je=re[pe],le=i.get(Je);t.bindTexture(n.TEXTURE_2D,le.__webglTexture),K(n.TEXTURE_2D,Je),oe(V.__webglFramebuffer,R,Je,n.COLOR_ATTACHMENT0+pe,n.TEXTURE_2D,0),m(Je)&&d(n.TEXTURE_2D)}t.unbindTexture()}else{let pe=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(pe,te.__webglTexture),K(pe,S),S.mipmaps&&S.mipmaps.length>0)for(let xe=0;xe<S.mipmaps.length;xe++)oe(V.__webglFramebuffer[xe],R,S,n.COLOR_ATTACHMENT0,pe,xe);else oe(V.__webglFramebuffer,R,S,n.COLOR_ATTACHMENT0,pe,0);m(S)&&d(pe),t.unbindTexture()}R.depthBuffer&&Re(R)}function qe(R){let S=R.textures;for(let V=0,te=S.length;V<te;V++){let re=S[V];if(m(re)){let ee=x(R),Te=i.get(re).__webglTexture;t.bindTexture(ee,Te),d(ee),t.unbindTexture()}}}let pt=[],F=[];function yt(R){if(R.samples>0){if(ze(R)===!1){let S=R.textures,V=R.width,te=R.height,re=n.COLOR_BUFFER_BIT,ee=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Te=i.get(R),pe=S.length>1;if(pe)for(let xe=0;xe<S.length;xe++)t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let xe=0;xe<S.length;xe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(re|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(re|=n.STENCIL_BUFFER_BIT)),pe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Te.__webglColorRenderbuffer[xe]);let Je=i.get(S[xe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Je,0)}n.blitFramebuffer(0,0,V,te,0,0,V,te,re,n.NEAREST),c===!0&&(pt.length=0,F.length=0,pt.push(n.COLOR_ATTACHMENT0+xe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(pt.push(ee),F.push(ee),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,F)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,pt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),pe)for(let xe=0;xe<S.length;xe++){t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.RENDERBUFFER,Te.__webglColorRenderbuffer[xe]);let Je=i.get(S[xe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.TEXTURE_2D,Je,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let S=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function Be(R){return Math.min(s.maxSamples,R.samples)}function ze(R){let S=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Ce(R){let S=o.render.frame;l.get(R)!==S&&(l.set(R,S),R.update())}function ft(R,S){let V=R.colorSpace,te=R.format,re=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||V!==Qs&&V!==Oi&&(Ke.getTransfer(V)===rt?(te!==Bn||re!==xi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),S}function Ie(R){return typeof HTMLImageElement!="undefined"&&R instanceof HTMLImageElement?(h.width=R.naturalWidth||R.width,h.height=R.naturalHeight||R.height):typeof VideoFrame!="undefined"&&R instanceof VideoFrame?(h.width=R.displayWidth,h.height=R.displayHeight):(h.width=R.width,h.height=R.height),h}this.allocateTextureUnit=W,this.resetTextureUnits=G,this.setTexture2D=ie,this.setTexture2DArray=Z,this.setTexture3D=w,this.setTextureCube=L,this.rebindTextures=Ne,this.setupRenderTarget=Qe,this.updateRenderTargetMipmap=qe,this.updateMultisampleRenderTarget=yt,this.setupDepthRenderbuffer=Re,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=ze}function yx(n,e){function t(i,s=Oi){let r,o=Ke.getTransfer(s);if(i===xi)return n.UNSIGNED_BYTE;if(i===Yc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===qc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===dd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===hd)return n.BYTE;if(i===ud)return n.SHORT;if(i===kr)return n.UNSIGNED_SHORT;if(i===Xc)return n.INT;if(i===cs)return n.UNSIGNED_INT;if(i===ei)return n.FLOAT;if(i===Yr)return n.HALF_FLOAT;if(i===fd)return n.ALPHA;if(i===pd)return n.RGB;if(i===Bn)return n.RGBA;if(i===md)return n.LUMINANCE;if(i===gd)return n.LUMINANCE_ALPHA;if(i===zs)return n.DEPTH_COMPONENT;if(i===qs)return n.DEPTH_STENCIL;if(i===Zc)return n.RED;if(i===$c)return n.RED_INTEGER;if(i===_d)return n.RG;if(i===Jc)return n.RG_INTEGER;if(i===Kc)return n.RGBA_INTEGER;if(i===Go||i===Wo||i===Xo||i===Yo)if(o===rt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Go)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Wo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Xo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Yo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Go)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Wo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Xo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Yo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===kl||i===Fl||i===Ol||i===Bl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===kl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Fl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ol)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Bl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===zl||i===Hl||i===Vl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===zl||i===Hl)return o===rt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Vl)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Gl||i===Wl||i===Xl||i===Yl||i===ql||i===Zl||i===$l||i===Jl||i===Kl||i===jl||i===Ql||i===ec||i===tc||i===nc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Gl)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Wl)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Xl)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Yl)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ql)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Zl)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===$l)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Jl)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Kl)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===jl)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ql)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ec)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===tc)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===nc)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===qo||i===ic||i===sc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===qo)return o===rt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ic)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===sc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===xd||i===rc||i===oc||i===ac)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===qo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===rc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===oc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ac)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ys?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var Mc=class extends Gt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Et=class extends Xt{constructor(){super(),this.isGroup=!0,this.type="Group"}},vx={type:"move"},Dr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Et,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Et,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Et,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,i),d=this._getHandJoint(h,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],f=l.position.distanceTo(u.position),p=.02,g=.005;h.inputState.pinching&&f>p+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&f<=p-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(vx)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Et;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},bx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Mx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Sc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){let s=new cn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Rn({vertexShader:bx,fragmentShader:Mx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new De(new Mi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},wc=class extends yi{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,h=null,l=null,u=null,f=null,p=null,g=null,_=new Sc,m=t.getContextAttributes(),d=null,x=null,v=[],y=[],P=new be,T=null,A=new Gt;A.viewport=new ot;let C=new Gt;C.viewport=new ot;let M=[A,C],b=new Mc,D=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let z=v[U];return z===void 0&&(z=new Dr,v[U]=z),z.getTargetRaySpace()},this.getControllerGrip=function(U){let z=v[U];return z===void 0&&(z=new Dr,v[U]=z),z.getGripSpace()},this.getHand=function(U){let z=v[U];return z===void 0&&(z=new Dr,v[U]=z),z.getHandSpace()};function W(U){let z=y.indexOf(U.inputSource);if(z===-1)return;let oe=v[z];oe!==void 0&&(oe.update(U.inputSource,U.frame,h||o),oe.dispatchEvent({type:U.type,data:U.inputSource}))}function q(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",ie);for(let U=0;U<v.length;U++){let z=y[U];z!==null&&(y[U]=null,v[U].disconnect(z))}D=null,G=null,_.reset(),e.setRenderTarget(d),p=null,f=null,u=null,s=null,x=null,se.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){r=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){a=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(U){h=U},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(U){if(s=U,s!==null){if(d=e.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",q),s.addEventListener("inputsourceschange",ie),m.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(P),s.renderState.layers===void 0){let z={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,z),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new zn(p.framebufferWidth,p.framebufferHeight,{format:Bn,type:xi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let z=null,oe=null,H=null;m.depth&&(H=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,z=m.stencil?qs:zs,oe=m.stencil?Ys:cs);let he={colorFormat:t.RGBA8,depthFormat:H,scaleFactor:r};u=new XRWebGLBinding(s,t),f=u.createProjectionLayer(he),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new zn(f.textureWidth,f.textureHeight,{format:Bn,type:xi,depthTexture:new sa(f.textureWidth,f.textureHeight,oe,void 0,void 0,void 0,void 0,void 0,void 0,z),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),h=null,o=await s.requestReferenceSpace(a),se.setContext(s),se.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function ie(U){for(let z=0;z<U.removed.length;z++){let oe=U.removed[z],H=y.indexOf(oe);H>=0&&(y[H]=null,v[H].disconnect(oe))}for(let z=0;z<U.added.length;z++){let oe=U.added[z],H=y.indexOf(oe);if(H===-1){for(let Re=0;Re<v.length;Re++)if(Re>=y.length){y.push(oe),H=Re;break}else if(y[Re]===null){y[Re]=oe,H=Re;break}if(H===-1)break}let he=v[H];he&&he.connect(oe)}}let Z=new I,w=new I;function L(U,z,oe){Z.setFromMatrixPosition(z.matrixWorld),w.setFromMatrixPosition(oe.matrixWorld);let H=Z.distanceTo(w),he=z.projectionMatrix.elements,Re=oe.projectionMatrix.elements,Ne=he[14]/(he[10]-1),Qe=he[14]/(he[10]+1),qe=(he[9]+1)/he[5],pt=(he[9]-1)/he[5],F=(he[8]-1)/he[0],yt=(Re[8]+1)/Re[0],Be=Ne*F,ze=Ne*yt,Ce=H/(-F+yt),ft=Ce*-F;if(z.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(ft),U.translateZ(Ce),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert(),he[10]===-1)U.projectionMatrix.copy(z.projectionMatrix),U.projectionMatrixInverse.copy(z.projectionMatrixInverse);else{let Ie=Ne+Ce,R=Qe+Ce,S=Be-ft,V=ze+(H-ft),te=qe*Qe/R*Ie,re=pt*Qe/R*Ie;U.projectionMatrix.makePerspective(S,V,te,re,Ie,R),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}}function B(U,z){z===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(z.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(s===null)return;let z=U.near,oe=U.far;_.texture!==null&&(_.depthNear>0&&(z=_.depthNear),_.depthFar>0&&(oe=_.depthFar)),b.near=C.near=A.near=z,b.far=C.far=A.far=oe,(D!==b.near||G!==b.far)&&(s.updateRenderState({depthNear:b.near,depthFar:b.far}),D=b.near,G=b.far),A.layers.mask=U.layers.mask|2,C.layers.mask=U.layers.mask|4,b.layers.mask=A.layers.mask|C.layers.mask;let H=U.parent,he=b.cameras;B(b,H);for(let Re=0;Re<he.length;Re++)B(he[Re],H);he.length===2?L(b,A,C):b.projectionMatrix.copy(A.projectionMatrix),J(U,b,H)};function J(U,z,oe){oe===null?U.matrix.copy(z.matrixWorld):(U.matrix.copy(oe.matrixWorld),U.matrix.invert(),U.matrix.multiply(z.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(z.projectionMatrix),U.projectionMatrixInverse.copy(z.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=Fr*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(U){c=U,f!==null&&(f.fixedFoveation=U),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=U)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(b)};let Q=null;function K(U,z){if(l=z.getViewerPose(h||o),g=z,l!==null){let oe=l.views;p!==null&&(e.setRenderTargetFramebuffer(x,p.framebuffer),e.setRenderTarget(x));let H=!1;oe.length!==b.cameras.length&&(b.cameras.length=0,H=!0);for(let Re=0;Re<oe.length;Re++){let Ne=oe[Re],Qe=null;if(p!==null)Qe=p.getViewport(Ne);else{let pt=u.getViewSubImage(f,Ne);Qe=pt.viewport,Re===0&&(e.setRenderTargetTextures(x,pt.colorTexture,f.ignoreDepthValues?void 0:pt.depthStencilTexture),e.setRenderTarget(x))}let qe=M[Re];qe===void 0&&(qe=new Gt,qe.layers.enable(Re),qe.viewport=new ot,M[Re]=qe),qe.matrix.fromArray(Ne.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(Ne.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(Qe.x,Qe.y,Qe.width,Qe.height),Re===0&&(b.matrix.copy(qe.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),H===!0&&b.cameras.push(qe)}let he=s.enabledFeatures;if(he&&he.includes("depth-sensing")){let Re=u.getDepthInformation(oe[0]);Re&&Re.isValid&&Re.texture&&_.init(e,Re,s.renderState)}}for(let oe=0;oe<v.length;oe++){let H=y[oe],he=v[oe];H!==null&&he!==void 0&&he.update(H,z,h||o)}Q&&Q(U,z),z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:z}),g=null}let se=new wd;se.setAnimationLoop(K),this.setAnimationLoop=function(U){Q=U},this.dispose=function(){}}},ns=new hn,Sx=new Ge;function wx(n,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,Sd(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,x,v,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),l(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,y)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),_(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?c(m,d,x,v):d.isSpriteMaterial?h(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===jt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===jt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let x=e.get(d),v=x.envMap,y=x.envMapRotation;v&&(m.envMap.value=v,ns.copy(y),ns.x*=-1,ns.y*=-1,ns.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),m.envMapRotation.value.setFromMatrix4(Sx.makeRotationFromEuler(ns)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,x,v){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*x,m.scale.value=v*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,x){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===jt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){let x=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Ex(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,v){let y=v.program;i.uniformBlockBinding(x,y)}function h(x,v){let y=s[x.id];y===void 0&&(g(x),y=l(x),s[x.id]=y,x.addEventListener("dispose",m));let P=v.program;i.updateUBOMapping(x,P);let T=e.render.frame;r[x.id]!==T&&(f(x),r[x.id]=T)}function l(x){let v=u();x.__bindingPointIndex=v;let y=n.createBuffer(),P=x.__size,T=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,P,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,y),y}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){let v=s[x.id],y=x.uniforms,P=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,A=y.length;T<A;T++){let C=Array.isArray(y[T])?y[T]:[y[T]];for(let M=0,b=C.length;M<b;M++){let D=C[M];if(p(D,T,M,P)===!0){let G=D.__offset,W=Array.isArray(D.value)?D.value:[D.value],q=0;for(let ie=0;ie<W.length;ie++){let Z=W[ie],w=_(Z);typeof Z=="number"||typeof Z=="boolean"?(D.__data[0]=Z,n.bufferSubData(n.UNIFORM_BUFFER,G+q,D.__data)):Z.isMatrix3?(D.__data[0]=Z.elements[0],D.__data[1]=Z.elements[1],D.__data[2]=Z.elements[2],D.__data[3]=0,D.__data[4]=Z.elements[3],D.__data[5]=Z.elements[4],D.__data[6]=Z.elements[5],D.__data[7]=0,D.__data[8]=Z.elements[6],D.__data[9]=Z.elements[7],D.__data[10]=Z.elements[8],D.__data[11]=0):(Z.toArray(D.__data,q),q+=w.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,G,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(x,v,y,P){let T=x.value,A=v+"_"+y;if(P[A]===void 0)return typeof T=="number"||typeof T=="boolean"?P[A]=T:P[A]=T.clone(),!0;{let C=P[A];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return P[A]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(x){let v=x.uniforms,y=0,P=16;for(let A=0,C=v.length;A<C;A++){let M=Array.isArray(v[A])?v[A]:[v[A]];for(let b=0,D=M.length;b<D;b++){let G=M[b],W=Array.isArray(G.value)?G.value:[G.value];for(let q=0,ie=W.length;q<ie;q++){let Z=W[q],w=_(Z),L=y%P,B=L%w.boundary,J=L+B;y+=B,J!==0&&P-J<w.storage&&(y+=P-J),G.__data=new Float32Array(w.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=y,y+=w.storage}}}let T=y%P;return T>0&&(y+=P-T),x.__size=y,x.__cache={},this}function _(x){let v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function m(x){let v=x.target;v.removeEventListener("dispose",m);let y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function d(){for(let x in s)n.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:c,update:h,dispose:d}}var ra=class{constructor(e={}){let{canvas:t=Cp(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext!="undefined"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,d=null,x=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Bt,this.toneMapping=ti,this.toneMappingExposure=1;let y=this,P=!1,T=0,A=0,C=null,M=-1,b=null,D=new ot,G=new ot,W=null,q=new Pe(0),ie=0,Z=t.width,w=t.height,L=1,B=null,J=null,Q=new ot(0,0,Z,w),K=new ot(0,0,Z,w),se=!1,U=new Br,z=!1,oe=!1,H=new Ge,he=new Ge,Re=new I,Ne=new ot,Qe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},qe=!1;function pt(){return C===null?L:1}let F=i;function yt(E,k){return t.getContext(E,k)}try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",ne,!1),t.addEventListener("webglcontextrestored",_e,!1),t.addEventListener("webglcontextcreationerror",me,!1),F===null){let k="webgl2";if(F=yt(k,E),F===null)throw yt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Be,ze,Ce,ft,Ie,R,S,V,te,re,ee,Te,pe,xe,Je,le,ye,Le,Ue,ve,$e,Xe,mt,N;function fe(){Be=new Hg(F),Be.init(),Xe=new yx(F,Be),ze=new Ng(F,Be,e,Xe),Ce=new gx(F,Be),ze.reverseDepthBuffer&&f&&Ce.buffers.depth.setReversed(!0),ft=new Wg(F),Ie=new ix,R=new xx(F,Be,Ce,Ie,ze,Xe,ft),S=new Fg(y),V=new zg(y),te=new Kp(F),mt=new Dg(F,te),re=new Vg(F,te,ft,mt),ee=new Yg(F,re,te,ft),Ue=new Xg(F,ze,R),le=new kg(Ie),Te=new nx(y,S,V,Be,ze,mt,le),pe=new wx(y,Ie),xe=new rx,Je=new ux(Be),Le=new Lg(y,S,V,Ce,ee,p,c),ye=new px(y,ee,ze),N=new Ex(F,ft,ze,Ce),ve=new Ug(F,Be,ft),$e=new Gg(F,Be,ft),ft.programs=Te.programs,y.capabilities=ze,y.extensions=Be,y.properties=Ie,y.renderLists=xe,y.shadowMap=ye,y.state=Ce,y.info=ft}fe();let $=new wc(y,F);this.xr=$,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let E=Be.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Be.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return L},this.setPixelRatio=function(E){E!==void 0&&(L=E,this.setSize(Z,w,!1))},this.getSize=function(E){return E.set(Z,w)},this.setSize=function(E,k,X=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=E,w=k,t.width=Math.floor(E*L),t.height=Math.floor(k*L),X===!0&&(t.style.width=E+"px",t.style.height=k+"px"),this.setViewport(0,0,E,k)},this.getDrawingBufferSize=function(E){return E.set(Z*L,w*L).floor()},this.setDrawingBufferSize=function(E,k,X){Z=E,w=k,L=X,t.width=Math.floor(E*X),t.height=Math.floor(k*X),this.setViewport(0,0,E,k)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(Q)},this.setViewport=function(E,k,X,Y){E.isVector4?Q.set(E.x,E.y,E.z,E.w):Q.set(E,k,X,Y),Ce.viewport(D.copy(Q).multiplyScalar(L).round())},this.getScissor=function(E){return E.copy(K)},this.setScissor=function(E,k,X,Y){E.isVector4?K.set(E.x,E.y,E.z,E.w):K.set(E,k,X,Y),Ce.scissor(G.copy(K).multiplyScalar(L).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(E){Ce.setScissorTest(se=E)},this.setOpaqueSort=function(E){B=E},this.setTransparentSort=function(E){J=E},this.getClearColor=function(E){return E.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor.apply(Le,arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha.apply(Le,arguments)},this.clear=function(E=!0,k=!0,X=!0){let Y=0;if(E){let O=!1;if(C!==null){let ce=C.texture.format;O=ce===Kc||ce===Jc||ce===$c}if(O){let ce=C.texture.type,ge=ce===xi||ce===cs||ce===kr||ce===Ys||ce===Yc||ce===qc,Se=Le.getClearColor(),we=Le.getClearAlpha(),ke=Se.r,Ve=Se.g,Ee=Se.b;ge?(g[0]=ke,g[1]=Ve,g[2]=Ee,g[3]=we,F.clearBufferuiv(F.COLOR,0,g)):(_[0]=ke,_[1]=Ve,_[2]=Ee,_[3]=we,F.clearBufferiv(F.COLOR,0,_))}else Y|=F.COLOR_BUFFER_BIT}k&&(Y|=F.DEPTH_BUFFER_BIT),X&&(Y|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ne,!1),t.removeEventListener("webglcontextrestored",_e,!1),t.removeEventListener("webglcontextcreationerror",me,!1),xe.dispose(),Je.dispose(),Ie.dispose(),S.dispose(),V.dispose(),ee.dispose(),mt.dispose(),N.dispose(),Te.dispose(),$.dispose(),$.removeEventListener("sessionstart",Vh),$.removeEventListener("sessionend",Gh),Ji.stop()};function ne(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function _e(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;let E=ft.autoReset,k=ye.enabled,X=ye.autoUpdate,Y=ye.needsUpdate,O=ye.type;fe(),ft.autoReset=E,ye.enabled=k,ye.autoUpdate=X,ye.needsUpdate=Y,ye.type=O}function me(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function He(E){let k=E.target;k.removeEventListener("dispose",He),wt(k)}function wt(E){$t(E),Ie.remove(E)}function $t(E){let k=Ie.get(E).programs;k!==void 0&&(k.forEach(function(X){Te.releaseProgram(X)}),E.isShaderMaterial&&Te.releaseShaderCache(E))}this.renderBufferDirect=function(E,k,X,Y,O,ce){k===null&&(k=Qe);let ge=O.isMesh&&O.matrixWorld.determinant()<0,Se=Ef(E,k,X,Y,O);Ce.setMaterial(Y,ge);let we=X.index,ke=1;if(Y.wireframe===!0){if(we=re.getWireframeAttribute(X),we===void 0)return;ke=2}let Ve=X.drawRange,Ee=X.attributes.position,je=Ve.start*ke,gt=(Ve.start+Ve.count)*ke;ce!==null&&(je=Math.max(je,ce.start*ke),gt=Math.min(gt,(ce.start+ce.count)*ke)),we!==null?(je=Math.max(je,0),gt=Math.min(gt,we.count)):Ee!=null&&(je=Math.max(je,0),gt=Math.min(gt,Ee.count));let vt=gt-je;if(vt<0||vt===1/0)return;mt.setup(O,Y,Se,X,we);let ln,et=ve;if(we!==null&&(ln=te.get(we),et=$e,et.setIndex(ln)),O.isMesh)Y.wireframe===!0?(Ce.setLineWidth(Y.wireframeLinewidth*pt()),et.setMode(F.LINES)):et.setMode(F.TRIANGLES);else if(O.isLine){let Ae=Y.linewidth;Ae===void 0&&(Ae=1),Ce.setLineWidth(Ae*pt()),O.isLineSegments?et.setMode(F.LINES):O.isLineLoop?et.setMode(F.LINE_LOOP):et.setMode(F.LINE_STRIP)}else O.isPoints?et.setMode(F.POINTS):O.isSprite&&et.setMode(F.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)et.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Be.get("WEBGL_multi_draw"))et.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Ae=O._multiDrawStarts,ci=O._multiDrawCounts,tt=O._multiDrawCount,Nn=we?te.get(we).bytesPerElement:1,Ms=Ie.get(Y).currentProgram.getUniforms();for(let xn=0;xn<tt;xn++)Ms.setValue(F,"_gl_DrawID",xn),et.render(Ae[xn]/Nn,ci[xn])}else if(O.isInstancedMesh)et.renderInstances(je,vt,O.count);else if(X.isInstancedBufferGeometry){let Ae=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,ci=Math.min(X.instanceCount,Ae);et.renderInstances(je,vt,ci)}else et.render(je,vt)};function nt(E,k,X){E.transparent===!0&&E.side===Lt&&E.forceSinglePass===!1?(E.side=jt,E.needsUpdate=!0,po(E,k,X),E.side=Hi,E.needsUpdate=!0,po(E,k,X),E.side=Lt):po(E,k,X)}this.compile=function(E,k,X=null){X===null&&(X=E),d=Je.get(X),d.init(k),v.push(d),X.traverseVisible(function(O){O.isLight&&O.layers.test(k.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),E!==X&&E.traverseVisible(function(O){O.isLight&&O.layers.test(k.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),d.setupLights();let Y=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let ce=O.material;if(ce)if(Array.isArray(ce))for(let ge=0;ge<ce.length;ge++){let Se=ce[ge];nt(Se,X,O),Y.add(Se)}else nt(ce,X,O),Y.add(ce)}),v.pop(),d=null,Y},this.compileAsync=function(E,k,X=null){let Y=this.compile(E,k,X);return new Promise(O=>{function ce(){if(Y.forEach(function(ge){Ie.get(ge).currentProgram.isReady()&&Y.delete(ge)}),Y.size===0){O(E);return}setTimeout(ce,10)}Be.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let Un=null;function li(E){Un&&Un(E)}function Vh(){Ji.stop()}function Gh(){Ji.start()}let Ji=new wd;Ji.setAnimationLoop(li),typeof self!="undefined"&&Ji.setContext(self),this.setAnimationLoop=function(E){Un=E,$.setAnimationLoop(E),E===null?Ji.stop():Ji.start()},$.addEventListener("sessionstart",Vh),$.addEventListener("sessionend",Gh),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(k),k=$.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,k,C),d=Je.get(E,v.length),d.init(k),v.push(d),he.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),U.setFromProjectionMatrix(he),oe=this.localClippingEnabled,z=le.init(this.clippingPlanes,oe),m=xe.get(E,x.length),m.init(),x.push(m),$.enabled===!0&&$.isPresenting===!0){let ce=y.xr.getDepthSensingMesh();ce!==null&&Ga(ce,k,-1/0,y.sortObjects)}Ga(E,k,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(B,J),qe=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,qe&&Le.addToRenderList(m,E),this.info.render.frame++,z===!0&&le.beginShadows();let X=d.state.shadowsArray;ye.render(X,E,k),z===!0&&le.endShadows(),this.info.autoReset===!0&&this.info.reset();let Y=m.opaque,O=m.transmissive;if(d.setupLights(),k.isArrayCamera){let ce=k.cameras;if(O.length>0)for(let ge=0,Se=ce.length;ge<Se;ge++){let we=ce[ge];Xh(Y,O,E,we)}qe&&Le.render(E);for(let ge=0,Se=ce.length;ge<Se;ge++){let we=ce[ge];Wh(m,E,we,we.viewport)}}else O.length>0&&Xh(Y,O,E,k),qe&&Le.render(E),Wh(m,E,k);C!==null&&(R.updateMultisampleRenderTarget(C),R.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(y,E,k),mt.resetDefaultState(),M=-1,b=null,v.pop(),v.length>0?(d=v[v.length-1],z===!0&&le.setGlobalState(y.clippingPlanes,d.state.camera)):d=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Ga(E,k,X,Y){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLight)d.pushLight(E),E.castShadow&&d.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||U.intersectsSprite(E)){Y&&Ne.setFromMatrixPosition(E.matrixWorld).applyMatrix4(he);let ge=ee.update(E),Se=E.material;Se.visible&&m.push(E,ge,Se,X,Ne.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||U.intersectsObject(E))){let ge=ee.update(E),Se=E.material;if(Y&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ne.copy(E.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),Ne.copy(ge.boundingSphere.center)),Ne.applyMatrix4(E.matrixWorld).applyMatrix4(he)),Array.isArray(Se)){let we=ge.groups;for(let ke=0,Ve=we.length;ke<Ve;ke++){let Ee=we[ke],je=Se[Ee.materialIndex];je&&je.visible&&m.push(E,ge,je,X,Ne.z,Ee)}}else Se.visible&&m.push(E,ge,Se,X,Ne.z,null)}}let ce=E.children;for(let ge=0,Se=ce.length;ge<Se;ge++)Ga(ce[ge],k,X,Y)}function Wh(E,k,X,Y){let O=E.opaque,ce=E.transmissive,ge=E.transparent;d.setupLightsView(X),z===!0&&le.setGlobalState(y.clippingPlanes,X),Y&&Ce.viewport(D.copy(Y)),O.length>0&&fo(O,k,X),ce.length>0&&fo(ce,k,X),ge.length>0&&fo(ge,k,X),Ce.buffers.depth.setTest(!0),Ce.buffers.depth.setMask(!0),Ce.buffers.color.setMask(!0),Ce.setPolygonOffset(!1)}function Xh(E,k,X,Y){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[Y.id]===void 0&&(d.state.transmissionRenderTarget[Y.id]=new zn(1,1,{generateMipmaps:!0,type:Be.has("EXT_color_buffer_half_float")||Be.has("EXT_color_buffer_float")?Yr:xi,minFilter:ls,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ke.workingColorSpace}));let ce=d.state.transmissionRenderTarget[Y.id],ge=Y.viewport||D;ce.setSize(ge.z,ge.w);let Se=y.getRenderTarget();y.setRenderTarget(ce),y.getClearColor(q),ie=y.getClearAlpha(),ie<1&&y.setClearColor(16777215,.5),y.clear(),qe&&Le.render(X);let we=y.toneMapping;y.toneMapping=ti;let ke=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),d.setupLightsView(Y),z===!0&&le.setGlobalState(y.clippingPlanes,Y),fo(E,X,Y),R.updateMultisampleRenderTarget(ce),R.updateRenderTargetMipmap(ce),Be.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let Ee=0,je=k.length;Ee<je;Ee++){let gt=k[Ee],vt=gt.object,ln=gt.geometry,et=gt.material,Ae=gt.group;if(et.side===Lt&&vt.layers.test(Y.layers)){let ci=et.side;et.side=jt,et.needsUpdate=!0,Yh(vt,X,Y,ln,et,Ae),et.side=ci,et.needsUpdate=!0,Ve=!0}}Ve===!0&&(R.updateMultisampleRenderTarget(ce),R.updateRenderTargetMipmap(ce))}y.setRenderTarget(Se),y.setClearColor(q,ie),ke!==void 0&&(Y.viewport=ke),y.toneMapping=we}function fo(E,k,X){let Y=k.isScene===!0?k.overrideMaterial:null;for(let O=0,ce=E.length;O<ce;O++){let ge=E[O],Se=ge.object,we=ge.geometry,ke=Y===null?ge.material:Y,Ve=ge.group;Se.layers.test(X.layers)&&Yh(Se,k,X,we,ke,Ve)}}function Yh(E,k,X,Y,O,ce){E.onBeforeRender(y,k,X,Y,O,ce),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(y,k,X,Y,E,ce),O.transparent===!0&&O.side===Lt&&O.forceSinglePass===!1?(O.side=jt,O.needsUpdate=!0,y.renderBufferDirect(X,k,Y,O,E,ce),O.side=Hi,O.needsUpdate=!0,y.renderBufferDirect(X,k,Y,O,E,ce),O.side=Lt):y.renderBufferDirect(X,k,Y,O,E,ce),E.onAfterRender(y,k,X,Y,O,ce)}function po(E,k,X){k.isScene!==!0&&(k=Qe);let Y=Ie.get(E),O=d.state.lights,ce=d.state.shadowsArray,ge=O.state.version,Se=Te.getParameters(E,O.state,ce,k,X),we=Te.getProgramCacheKey(Se),ke=Y.programs;Y.environment=E.isMeshStandardMaterial?k.environment:null,Y.fog=k.fog,Y.envMap=(E.isMeshStandardMaterial?V:S).get(E.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,ke===void 0&&(E.addEventListener("dispose",He),ke=new Map,Y.programs=ke);let Ve=ke.get(we);if(Ve!==void 0){if(Y.currentProgram===Ve&&Y.lightsStateVersion===ge)return Zh(E,Se),Ve}else Se.uniforms=Te.getUniforms(E),E.onBeforeCompile(Se,y),Ve=Te.acquireProgram(Se,we),ke.set(we,Ve),Y.uniforms=Se.uniforms;let Ee=Y.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ee.clippingPlanes=le.uniform),Zh(E,Se),Y.needsLights=Af(E),Y.lightsStateVersion=ge,Y.needsLights&&(Ee.ambientLightColor.value=O.state.ambient,Ee.lightProbe.value=O.state.probe,Ee.directionalLights.value=O.state.directional,Ee.directionalLightShadows.value=O.state.directionalShadow,Ee.spotLights.value=O.state.spot,Ee.spotLightShadows.value=O.state.spotShadow,Ee.rectAreaLights.value=O.state.rectArea,Ee.ltc_1.value=O.state.rectAreaLTC1,Ee.ltc_2.value=O.state.rectAreaLTC2,Ee.pointLights.value=O.state.point,Ee.pointLightShadows.value=O.state.pointShadow,Ee.hemisphereLights.value=O.state.hemi,Ee.directionalShadowMap.value=O.state.directionalShadowMap,Ee.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ee.spotShadowMap.value=O.state.spotShadowMap,Ee.spotLightMatrix.value=O.state.spotLightMatrix,Ee.spotLightMap.value=O.state.spotLightMap,Ee.pointShadowMap.value=O.state.pointShadowMap,Ee.pointShadowMatrix.value=O.state.pointShadowMatrix),Y.currentProgram=Ve,Y.uniformsList=null,Ve}function qh(E){if(E.uniformsList===null){let k=E.currentProgram.getUniforms();E.uniformsList=Vs.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function Zh(E,k){let X=Ie.get(E);X.outputColorSpace=k.outputColorSpace,X.batching=k.batching,X.batchingColor=k.batchingColor,X.instancing=k.instancing,X.instancingColor=k.instancingColor,X.instancingMorph=k.instancingMorph,X.skinning=k.skinning,X.morphTargets=k.morphTargets,X.morphNormals=k.morphNormals,X.morphColors=k.morphColors,X.morphTargetsCount=k.morphTargetsCount,X.numClippingPlanes=k.numClippingPlanes,X.numIntersection=k.numClipIntersection,X.vertexAlphas=k.vertexAlphas,X.vertexTangents=k.vertexTangents,X.toneMapping=k.toneMapping}function Ef(E,k,X,Y,O){k.isScene!==!0&&(k=Qe),R.resetTextureUnits();let ce=k.fog,ge=Y.isMeshStandardMaterial?k.environment:null,Se=C===null?y.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Qs,we=(Y.isMeshStandardMaterial?V:S).get(Y.envMap||ge),ke=Y.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ve=!!X.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Ee=!!X.morphAttributes.position,je=!!X.morphAttributes.normal,gt=!!X.morphAttributes.color,vt=ti;Y.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(vt=y.toneMapping);let ln=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,et=ln!==void 0?ln.length:0,Ae=Ie.get(Y),ci=d.state.lights;if(z===!0&&(oe===!0||E!==b)){let Tn=E===b&&Y.id===M;le.setState(Y,E,Tn)}let tt=!1;Y.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==ci.state.version||Ae.outputColorSpace!==Se||O.isBatchedMesh&&Ae.batching===!1||!O.isBatchedMesh&&Ae.batching===!0||O.isBatchedMesh&&Ae.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ae.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ae.instancing===!1||!O.isInstancedMesh&&Ae.instancing===!0||O.isSkinnedMesh&&Ae.skinning===!1||!O.isSkinnedMesh&&Ae.skinning===!0||O.isInstancedMesh&&Ae.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ae.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ae.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ae.instancingMorph===!1&&O.morphTexture!==null||Ae.envMap!==we||Y.fog===!0&&Ae.fog!==ce||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==le.numPlanes||Ae.numIntersection!==le.numIntersection)||Ae.vertexAlphas!==ke||Ae.vertexTangents!==Ve||Ae.morphTargets!==Ee||Ae.morphNormals!==je||Ae.morphColors!==gt||Ae.toneMapping!==vt||Ae.morphTargetsCount!==et)&&(tt=!0):(tt=!0,Ae.__version=Y.version);let Nn=Ae.currentProgram;tt===!0&&(Nn=po(Y,k,O));let Ms=!1,xn=!1,yr=!1,bt=Nn.getUniforms(),Kn=Ae.uniforms;if(Ce.useProgram(Nn.program)&&(Ms=!0,xn=!0,yr=!0),Y.id!==M&&(M=Y.id,xn=!0),Ms||b!==E){Ce.buffers.depth.getReversed()?(H.copy(E.projectionMatrix),Ip(H),Lp(H),bt.setValue(F,"projectionMatrix",H)):bt.setValue(F,"projectionMatrix",E.projectionMatrix),bt.setValue(F,"viewMatrix",E.matrixWorldInverse);let Pi=bt.map.cameraPosition;Pi!==void 0&&Pi.setValue(F,Re.setFromMatrixPosition(E.matrixWorld)),ze.logarithmicDepthBuffer&&bt.setValue(F,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&bt.setValue(F,"isOrthographic",E.isOrthographicCamera===!0),b!==E&&(b=E,xn=!0,yr=!0)}if(O.isSkinnedMesh){bt.setOptional(F,O,"bindMatrix"),bt.setOptional(F,O,"bindMatrixInverse");let Tn=O.skeleton;Tn&&(Tn.boneTexture===null&&Tn.computeBoneTexture(),bt.setValue(F,"boneTexture",Tn.boneTexture,R))}O.isBatchedMesh&&(bt.setOptional(F,O,"batchingTexture"),bt.setValue(F,"batchingTexture",O._matricesTexture,R),bt.setOptional(F,O,"batchingIdTexture"),bt.setValue(F,"batchingIdTexture",O._indirectTexture,R),bt.setOptional(F,O,"batchingColorTexture"),O._colorsTexture!==null&&bt.setValue(F,"batchingColorTexture",O._colorsTexture,R));let vr=X.morphAttributes;if((vr.position!==void 0||vr.normal!==void 0||vr.color!==void 0)&&Ue.update(O,X,Nn),(xn||Ae.receiveShadow!==O.receiveShadow)&&(Ae.receiveShadow=O.receiveShadow,bt.setValue(F,"receiveShadow",O.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Kn.envMap.value=we,Kn.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&k.environment!==null&&(Kn.envMapIntensity.value=k.environmentIntensity),xn&&(bt.setValue(F,"toneMappingExposure",y.toneMappingExposure),Ae.needsLights&&Tf(Kn,yr),ce&&Y.fog===!0&&pe.refreshFogUniforms(Kn,ce),pe.refreshMaterialUniforms(Kn,Y,L,w,d.state.transmissionRenderTarget[E.id]),Vs.upload(F,qh(Ae),Kn,R)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Vs.upload(F,qh(Ae),Kn,R),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&bt.setValue(F,"center",O.center),bt.setValue(F,"modelViewMatrix",O.modelViewMatrix),bt.setValue(F,"normalMatrix",O.normalMatrix),bt.setValue(F,"modelMatrix",O.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){let Tn=Y.uniformsGroups;for(let Pi=0,Ii=Tn.length;Pi<Ii;Pi++){let $h=Tn[Pi];N.update($h,Nn),N.bind($h,Nn)}}return Nn}function Tf(E,k){E.ambientLightColor.needsUpdate=k,E.lightProbe.needsUpdate=k,E.directionalLights.needsUpdate=k,E.directionalLightShadows.needsUpdate=k,E.pointLights.needsUpdate=k,E.pointLightShadows.needsUpdate=k,E.spotLights.needsUpdate=k,E.spotLightShadows.needsUpdate=k,E.rectAreaLights.needsUpdate=k,E.hemisphereLights.needsUpdate=k}function Af(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,k,X){Ie.get(E.texture).__webglTexture=k,Ie.get(E.depthTexture).__webglTexture=X;let Y=Ie.get(E);Y.__hasExternalTextures=!0,Y.__autoAllocateDepthBuffer=X===void 0,Y.__autoAllocateDepthBuffer||Be.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,k){let X=Ie.get(E);X.__webglFramebuffer=k,X.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(E,k=0,X=0){C=E,T=k,A=X;let Y=!0,O=null,ce=!1,ge=!1;if(E){let we=Ie.get(E);if(we.__useDefaultFramebuffer!==void 0)Ce.bindFramebuffer(F.FRAMEBUFFER,null),Y=!1;else if(we.__webglFramebuffer===void 0)R.setupRenderTarget(E);else if(we.__hasExternalTextures)R.rebindTextures(E,Ie.get(E.texture).__webglTexture,Ie.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Ee=E.depthTexture;if(we.__boundDepthTexture!==Ee){if(Ee!==null&&Ie.has(Ee)&&(E.width!==Ee.image.width||E.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(E)}}let ke=E.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(ge=!0);let Ve=Ie.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ve[k])?O=Ve[k][X]:O=Ve[k],ce=!0):E.samples>0&&R.useMultisampledRTT(E)===!1?O=Ie.get(E).__webglMultisampledFramebuffer:Array.isArray(Ve)?O=Ve[X]:O=Ve,D.copy(E.viewport),G.copy(E.scissor),W=E.scissorTest}else D.copy(Q).multiplyScalar(L).floor(),G.copy(K).multiplyScalar(L).floor(),W=se;if(Ce.bindFramebuffer(F.FRAMEBUFFER,O)&&Y&&Ce.drawBuffers(E,O),Ce.viewport(D),Ce.scissor(G),Ce.setScissorTest(W),ce){let we=Ie.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+k,we.__webglTexture,X)}else if(ge){let we=Ie.get(E.texture),ke=k||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,we.__webglTexture,X||0,ke)}M=-1},this.readRenderTargetPixels=function(E,k,X,Y,O,ce,ge){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ie.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se){Ce.bindFramebuffer(F.FRAMEBUFFER,Se);try{let we=E.texture,ke=we.format,Ve=we.type;if(!ze.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ze.textureTypeReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=E.width-Y&&X>=0&&X<=E.height-O&&F.readPixels(k,X,Y,O,Xe.convert(ke),Xe.convert(Ve),ce)}finally{let we=C!==null?Ie.get(C).__webglFramebuffer:null;Ce.bindFramebuffer(F.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(E,k,X,Y,O,ce,ge){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Ie.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se){let we=E.texture,ke=we.format,Ve=we.type;if(!ze.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ze.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=E.width-Y&&X>=0&&X<=E.height-O){Ce.bindFramebuffer(F.FRAMEBUFFER,Se);let Ee=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Ee),F.bufferData(F.PIXEL_PACK_BUFFER,ce.byteLength,F.STREAM_READ),F.readPixels(k,X,Y,O,Xe.convert(ke),Xe.convert(Ve),0);let je=C!==null?Ie.get(C).__webglFramebuffer:null;Ce.bindFramebuffer(F.FRAMEBUFFER,je);let gt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Pp(F,gt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Ee),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ce),F.deleteBuffer(Ee),F.deleteSync(gt),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,k=null,X=0){E.isTexture!==!0&&(Cr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,E=arguments[1]);let Y=Math.pow(2,-X),O=Math.floor(E.image.width*Y),ce=Math.floor(E.image.height*Y),ge=k!==null?k.x:0,Se=k!==null?k.y:0;R.setTexture2D(E,0),F.copyTexSubImage2D(F.TEXTURE_2D,X,0,0,ge,Se,O,ce),Ce.unbindTexture()},this.copyTextureToTexture=function(E,k,X=null,Y=null,O=0){E.isTexture!==!0&&(Cr("WebGLRenderer: copyTextureToTexture function signature has changed."),Y=arguments[0]||null,E=arguments[1],k=arguments[2],O=arguments[3]||0,X=null);let ce,ge,Se,we,ke,Ve,Ee,je,gt,vt=E.isCompressedTexture?E.mipmaps[O]:E.image;X!==null?(ce=X.max.x-X.min.x,ge=X.max.y-X.min.y,Se=X.isBox3?X.max.z-X.min.z:1,we=X.min.x,ke=X.min.y,Ve=X.isBox3?X.min.z:0):(ce=vt.width,ge=vt.height,Se=vt.depth||1,we=0,ke=0,Ve=0),Y!==null?(Ee=Y.x,je=Y.y,gt=Y.z):(Ee=0,je=0,gt=0);let ln=Xe.convert(k.format),et=Xe.convert(k.type),Ae;k.isData3DTexture?(R.setTexture3D(k,0),Ae=F.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(R.setTexture2DArray(k,0),Ae=F.TEXTURE_2D_ARRAY):(R.setTexture2D(k,0),Ae=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,k.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,k.unpackAlignment);let ci=F.getParameter(F.UNPACK_ROW_LENGTH),tt=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Nn=F.getParameter(F.UNPACK_SKIP_PIXELS),Ms=F.getParameter(F.UNPACK_SKIP_ROWS),xn=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,vt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,vt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,we),F.pixelStorei(F.UNPACK_SKIP_ROWS,ke),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Ve);let yr=E.isDataArrayTexture||E.isData3DTexture,bt=k.isDataArrayTexture||k.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){let Kn=Ie.get(E),vr=Ie.get(k),Tn=Ie.get(Kn.__renderTarget),Pi=Ie.get(vr.__renderTarget);Ce.bindFramebuffer(F.READ_FRAMEBUFFER,Tn.__webglFramebuffer),Ce.bindFramebuffer(F.DRAW_FRAMEBUFFER,Pi.__webglFramebuffer);for(let Ii=0;Ii<Se;Ii++)yr&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ie.get(E).__webglTexture,O,Ve+Ii),E.isDepthTexture?(bt&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ie.get(k).__webglTexture,O,gt+Ii),F.blitFramebuffer(we,ke,ce,ge,Ee,je,ce,ge,F.DEPTH_BUFFER_BIT,F.NEAREST)):bt?F.copyTexSubImage3D(Ae,O,Ee,je,gt+Ii,we,ke,ce,ge):F.copyTexSubImage2D(Ae,O,Ee,je,gt+Ii,we,ke,ce,ge);Ce.bindFramebuffer(F.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else bt?E.isDataTexture||E.isData3DTexture?F.texSubImage3D(Ae,O,Ee,je,gt,ce,ge,Se,ln,et,vt.data):k.isCompressedArrayTexture?F.compressedTexSubImage3D(Ae,O,Ee,je,gt,ce,ge,Se,ln,vt.data):F.texSubImage3D(Ae,O,Ee,je,gt,ce,ge,Se,ln,et,vt):E.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,O,Ee,je,ce,ge,ln,et,vt.data):E.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,O,Ee,je,vt.width,vt.height,ln,vt.data):F.texSubImage2D(F.TEXTURE_2D,O,Ee,je,ce,ge,ln,et,vt);F.pixelStorei(F.UNPACK_ROW_LENGTH,ci),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,tt),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Nn),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ms),F.pixelStorei(F.UNPACK_SKIP_IMAGES,xn),O===0&&k.generateMipmaps&&F.generateMipmap(Ae),Ce.unbindTexture()},this.copyTextureToTexture3D=function(E,k,X=null,Y=null,O=0){return E.isTexture!==!0&&(Cr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),X=arguments[0]||null,Y=arguments[1]||null,E=arguments[2],k=arguments[3],O=arguments[4]||0),Cr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,k,X,Y,O)},this.initRenderTarget=function(E){Ie.get(E).__webglFramebuffer===void 0&&R.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?R.setTextureCube(E,0):E.isData3DTexture?R.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?R.setTexture2DArray(E,0):R.setTexture2D(E,0),Ce.unbindTexture()},this.resetState=function(){T=0,A=0,C=null,Ce.reset(),mt.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}};var Js=class extends Xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Ec=class extends cn{constructor(e=null,t=1,i=1,s,r,o,a,c,h=Mn,l=Mn,u,f){super(null,o,a,c,h,l,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var zr=class extends _t{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Fs=new Ge,Ju=new Ge,ko=[],Ku=new Sn,Tx=new Ge,Er=new De,Tr=new vi,Hr=class extends De{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new zr(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Tx)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Sn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Fs),Ku.copy(e.boundingBox).applyMatrix4(Fs),this.boundingBox.union(Ku)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new vi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Fs),Tr.copy(e.boundingSphere).applyMatrix4(Fs),this.boundingSphere.union(Tr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(Er.geometry=this.geometry,Er.material=this.material,Er.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Tr.copy(this.boundingSphere),Tr.applyMatrix4(i),e.ray.intersectsSphere(Tr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Fs),Ju.multiplyMatrices(i,Fs),Er.matrixWorld=Ju,Er.raycast(e,ko);for(let o=0,a=ko.length;o<a;o++){let c=ko[o];c.instanceId=r,c.object=this,t.push(c)}ko.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new zr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Ec(new Float32Array(s*this.count),s,this.count,Zc,ei));let r=this.morphTexture.source.data.data,o=0;for(let h=0;h<i.length;h++)o+=i[h];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;r[c]=a,r.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Vr=class extends bi{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Pe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},oa=new I,aa=new I,ju=new Ge,Ar=new Vi,Fo=new vi,xl=new I,Qu=new I,la=class extends Xt{constructor(e=new xt,t=new Vr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)oa.fromBufferAttribute(t,s-1),aa.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=oa.distanceTo(aa);e.setAttribute("lineDistance",new Ze(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Fo.copy(i.boundingSphere),Fo.applyMatrix4(s),Fo.radius+=r,e.ray.intersectsSphere(Fo)===!1)return;ju.copy(s).invert(),Ar.copy(e.ray).applyMatrix4(ju);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,h=this.isLineSegments?2:1,l=i.index,f=i.attributes.position;if(l!==null){let p=Math.max(0,o.start),g=Math.min(l.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=h){let d=l.getX(_),x=l.getX(_+1),v=Oo(this,e,Ar,c,d,x);v&&t.push(v)}if(this.isLineLoop){let _=l.getX(g-1),m=l.getX(p),d=Oo(this,e,Ar,c,_,m);d&&t.push(d)}}else{let p=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=h){let d=Oo(this,e,Ar,c,_,_+1);d&&t.push(d)}if(this.isLineLoop){let _=Oo(this,e,Ar,c,g-1,p);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Oo(n,e,t,i,s,r){let o=n.geometry.attributes.position;if(oa.fromBufferAttribute(o,s),aa.fromBufferAttribute(o,r),t.distanceSqToSegment(oa,aa,xl,Qu)>i)return;xl.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(xl);if(!(c<e.near||c>e.far))return{distance:c,point:Qu.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}var Tc=class extends bi{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ed=new Ge,Ac=new Vi,Bo=new vi,zo=new I,ca=class extends Xt{constructor(e=new xt,t=new Tc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bo.copy(i.boundingSphere),Bo.applyMatrix4(s),Bo.radius+=r,e.ray.intersectsSphere(Bo)===!1)return;ed.copy(s).invert(),Ac.copy(e.ray).applyMatrix4(ed);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,h=i.index,u=i.attributes.position;if(h!==null){let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let g=f,_=p;g<_;g++){let m=h.getX(g);zo.fromBufferAttribute(u,m),td(zo,m,c,s,e,t,this)}}else{let f=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let g=f,_=p;g<_;g++)zo.fromBufferAttribute(u,g),td(zo,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function td(n,e,t,i,s,r,o){let a=Ac.distanceSqToPoint(n);if(a<t){let c=new I;Ac.closestPointToPoint(n,c),c.applyMatrix4(i);let h=s.ray.origin.distanceTo(c);if(h<s.near||h>s.far)return;r.push({distance:h,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var ni=class extends cn{constructor(e,t,i,s,r,o,a,c,h){super(e,t,i,s,r,o,a,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}},Rc=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,c=r-1,h;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),h=i[s]-o,h<0)a=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(r-1);let l=i[s],f=i[s+1]-l,p=(o-l)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new be:new I);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new I,s=[],r=[],o=[],a=new I,c=new Ge;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new I)}r[0]=new I,o[0]=new I;let h=Number.MAX_VALUE,l=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);l<=h&&(h=l,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),f<=h&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(It(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(It(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}};function eh(){let n=0,e=0,t=0,i=0;function s(r,o,a,c){n=r,e=a,t=-3*r+3*o-2*a-c,i=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,h){s(o,a,h*(a-r),h*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,h,l,u){let f=(o-r)/h-(a-r)/(h+l)+(a-o)/l,p=(a-o)/l-(c-o)/(l+u)+(c-a)/u;f*=l,p*=l,s(o,a,f,p)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var Ho=new I,yl=new eh,vl=new eh,bl=new eh,Gi=class extends Rc{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new I){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let h,l;this.closed||a>0?h=s[(a-1)%r]:(Ho.subVectors(s[0],s[1]).add(s[0]),h=Ho);let u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?l=s[(a+2)%r]:(Ho.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=Ho),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(h.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(l),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),yl.initNonuniformCatmullRom(h.x,u.x,f.x,l.x,g,_,m),vl.initNonuniformCatmullRom(h.y,u.y,f.y,l.y,g,_,m),bl.initNonuniformCatmullRom(h.z,u.z,f.z,l.z,g,_,m)}else this.curveType==="catmullrom"&&(yl.initCatmullRom(h.x,u.x,f.x,l.x,this.tension),vl.initCatmullRom(h.y,u.y,f.y,l.y,this.tension),bl.initCatmullRom(h.z,u.z,f.z,l.z,this.tension));return i.set(yl.calc(c),vl.calc(c),bl.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};var ha=class n extends xt{constructor(e=[new be(0,-.5),new be(.5,0),new be(0,.5)],t=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:s},t=Math.floor(t),s=It(s,0,Math.PI*2);let r=[],o=[],a=[],c=[],h=[],l=1/t,u=new I,f=new be,p=new I,g=new I,_=new I,m=0,d=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:m=e[x+1].x-e[x].x,d=e[x+1].y-e[x].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(_.x,_.y,_.z);break;default:m=e[x+1].x-e[x].x,d=e[x+1].y-e[x].y,p.x=d*1,p.y=-m,p.z=d*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),c.push(p.x,p.y,p.z),_.copy(g)}for(let x=0;x<=t;x++){let v=i+x*l*s,y=Math.sin(v),P=Math.cos(v);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*y,u.y=e[T].y,u.z=e[T].x*P,o.push(u.x,u.y,u.z),f.x=x/t,f.y=T/(e.length-1),a.push(f.x,f.y);let A=c[3*T+0]*y,C=c[3*T+1],M=c[3*T+0]*P;h.push(A,C,M)}}for(let x=0;x<t;x++)for(let v=0;v<e.length-1;v++){let y=v+x*e.length,P=y,T=y+e.length,A=y+e.length+1,C=y+1;r.push(P,T,C),r.push(A,C,T)}this.setIndex(r),this.setAttribute("position",new Ze(o,3)),this.setAttribute("uv",new Ze(a,2)),this.setAttribute("normal",new Ze(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.points,e.segments,e.phiStart,e.phiLength)}};var Ks=class n extends xt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],c=[],h=new I,l=new be;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){let p=i+u/t*s;h.x=e*Math.cos(p),h.y=e*Math.sin(p),o.push(h.x,h.y,h.z),a.push(0,0,1),l.x=(o[f]/e+1)/2,l.y=(o[f+1]/e+1)/2,c.push(l.x,l.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ze(o,3)),this.setAttribute("normal",new Ze(a,3)),this.setAttribute("uv",new Ze(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Vn=class n extends xt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let h=this;s=Math.floor(s),r=Math.floor(r);let l=[],u=[],f=[],p=[],g=0,_=[],m=i/2,d=0;x(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute("position",new Ze(u,3)),this.setAttribute("normal",new Ze(f,3)),this.setAttribute("uv",new Ze(p,2));function x(){let y=new I,P=new I,T=0,A=(t-e)/i;for(let C=0;C<=r;C++){let M=[],b=C/r,D=b*(t-e)+e;for(let G=0;G<=s;G++){let W=G/s,q=W*c+a,ie=Math.sin(q),Z=Math.cos(q);P.x=D*ie,P.y=-b*i+m,P.z=D*Z,u.push(P.x,P.y,P.z),y.set(ie,A,Z).normalize(),f.push(y.x,y.y,y.z),p.push(W,1-b),M.push(g++)}_.push(M)}for(let C=0;C<s;C++)for(let M=0;M<r;M++){let b=_[M][C],D=_[M+1][C],G=_[M+1][C+1],W=_[M][C+1];(e>0||M!==0)&&(l.push(b,D,W),T+=3),(t>0||M!==r-1)&&(l.push(D,G,W),T+=3)}h.addGroup(d,T,0),d+=T}function v(y){let P=g,T=new be,A=new I,C=0,M=y===!0?e:t,b=y===!0?1:-1;for(let G=1;G<=s;G++)u.push(0,m*b,0),f.push(0,b,0),p.push(.5,.5),g++;let D=g;for(let G=0;G<=s;G++){let q=G/s*c+a,ie=Math.cos(q),Z=Math.sin(q);A.x=M*Z,A.y=m*b,A.z=M*ie,u.push(A.x,A.y,A.z),f.push(0,b,0),T.x=ie*.5+.5,T.y=Z*.5*b+.5,p.push(T.x,T.y),g++}for(let G=0;G<s;G++){let W=P+G,q=D+G;y===!0?l.push(q,q+1,W):l.push(q+1,q,W),C+=3}h.addGroup(d,C,y===!0?1:2),d+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Si=class n extends Vn{constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Cc=class n extends xt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),h(i),l(),this.setAttribute("position",new Ze(r,3)),this.setAttribute("normal",new Ze(r.slice(),3)),this.setAttribute("uv",new Ze(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let v=new I,y=new I,P=new I;for(let T=0;T<t.length;T+=3)p(t[T+0],v),p(t[T+1],y),p(t[T+2],P),c(v,y,P,x)}function c(x,v,y,P){let T=P+1,A=[];for(let C=0;C<=T;C++){A[C]=[];let M=x.clone().lerp(y,C/T),b=v.clone().lerp(y,C/T),D=T-C;for(let G=0;G<=D;G++)G===0&&C===T?A[C][G]=M:A[C][G]=M.clone().lerp(b,G/D)}for(let C=0;C<T;C++)for(let M=0;M<2*(T-C)-1;M++){let b=Math.floor(M/2);M%2===0?(f(A[C][b+1]),f(A[C+1][b]),f(A[C][b])):(f(A[C][b+1]),f(A[C+1][b+1]),f(A[C+1][b]))}}function h(x){let v=new I;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(x),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function l(){let x=new I;for(let v=0;v<r.length;v+=3){x.x=r[v+0],x.y=r[v+1],x.z=r[v+2];let y=m(x)/2/Math.PI+.5,P=d(x)/Math.PI+.5;o.push(y,1-P)}g(),u()}function u(){for(let x=0;x<o.length;x+=6){let v=o[x+0],y=o[x+2],P=o[x+4],T=Math.max(v,y,P),A=Math.min(v,y,P);T>.9&&A<.1&&(v<.2&&(o[x+0]+=1),y<.2&&(o[x+2]+=1),P<.2&&(o[x+4]+=1))}}function f(x){r.push(x.x,x.y,x.z)}function p(x,v){let y=x*3;v.x=e[y+0],v.y=e[y+1],v.z=e[y+2]}function g(){let x=new I,v=new I,y=new I,P=new I,T=new be,A=new be,C=new be;for(let M=0,b=0;M<r.length;M+=9,b+=6){x.set(r[M+0],r[M+1],r[M+2]),v.set(r[M+3],r[M+4],r[M+5]),y.set(r[M+6],r[M+7],r[M+8]),T.set(o[b+0],o[b+1]),A.set(o[b+2],o[b+3]),C.set(o[b+4],o[b+5]),P.copy(x).add(v).add(y).divideScalar(3);let D=m(P);_(T,b+0,x,D),_(A,b+2,v,D),_(C,b+4,y,D)}}function _(x,v,y,P){P<0&&x.x===1&&(o[v]=x.x-1),y.x===0&&y.z===0&&(o[v]=P/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}};var ua=class n extends Cc{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var da=class n extends xt{constructor(e=.5,t=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],c=[],h=[],l=[],u=e,f=(t-e)/s,p=new I,g=new be;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){let d=r+m/i*o;p.x=u*Math.cos(d),p.y=u*Math.sin(d),c.push(p.x,p.y,p.z),h.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,l.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){let m=_*(i+1);for(let d=0;d<i;d++){let x=d+m,v=x,y=x+i+1,P=x+i+2,T=x+1;a.push(v,y,T),a.push(y,P,T)}}this.setIndex(a),this.setAttribute("position",new Ze(c,3)),this.setAttribute("normal",new Ze(h,3)),this.setAttribute("uv",new Ze(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var tn=class n extends xt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(o+a,Math.PI),h=0,l=[],u=new I,f=new I,p=[],g=[],_=[],m=[];for(let d=0;d<=i;d++){let x=[],v=d/i,y=0;d===0&&o===0?y=.5/t:d===i&&c===Math.PI&&(y=-.5/t);for(let P=0;P<=t;P++){let T=P/t;u.x=-e*Math.cos(s+T*r)*Math.sin(o+v*a),u.y=e*Math.cos(o+v*a),u.z=e*Math.sin(s+T*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(T+y,1-v),x.push(h++)}l.push(x)}for(let d=0;d<i;d++)for(let x=0;x<t;x++){let v=l[d][x+1],y=l[d][x],P=l[d+1][x],T=l[d+1][x+1];(d!==0||o>0)&&p.push(v,y,T),(d!==i-1||c<Math.PI)&&p.push(y,P,T)}this.setIndex(p),this.setAttribute("position",new Ze(g,3)),this.setAttribute("normal",new Ze(_,3)),this.setAttribute("uv",new Ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var un=class n extends xt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let o=[],a=[],c=[],h=[],l=new I,u=new I,f=new I;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){let _=g/s*r,m=p/i*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),l.x=e*Math.cos(_),l.y=e*Math.sin(_),f.subVectors(u,l).normalize(),c.push(f.x,f.y,f.z),h.push(g/s),h.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){let _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,d=(s+1)*(p-1)+g,x=(s+1)*p+g;o.push(_,m,x),o.push(m,d,x)}this.setIndex(o),this.setAttribute("position",new Ze(a,3)),this.setAttribute("normal",new Ze(c,3)),this.setAttribute("uv",new Ze(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Nt=class extends bi{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Pe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=yd,this.normalScale=new be(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function Vo(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Ax(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var js=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Pc=class extends js{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Qh,endingEnd:Qh}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case eu:r=e,a=2*t-i;break;case tu:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case eu:o=e,c=2*i-t;break;case tu:o=1,c=i+s[1]-s[0];break;default:o=e-1,c=t}let h=(i-t)*.5,l=this.valueSize;this._weightPrev=h/(t-a),this._weightNext=h/(c-i),this._offsetPrev=r*l,this._offsetNext=o*l}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,h=c-a,l=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,p=this._weightNext,g=(i-t)/(s-t),_=g*g,m=_*g,d=-f*m+2*f*_-f*g,x=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,v=(-1-p)*m+(1.5+p)*_+.5*g,y=p*m-p*_;for(let P=0;P!==a;++P)r[P]=d*o[l+P]+x*o[h+P]+v*o[c+P]+y*o[u+P];return r}},Ic=class extends js{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,h=c-a,l=(i-t)/(s-t),u=1-l;for(let f=0;f!==a;++f)r[f]=o[h+f]*u+o[c+f]*l;return r}},Lc=class extends js{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Gn=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Vo(t,this.TimeBufferType),this.values=Vo(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Vo(e.times,Array),values:Vo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Lc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ic(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Pc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Zo:t=this.InterpolantFactoryMethodDiscrete;break;case lc:t=this.InterpolantFactoryMethodLinear;break;case Xa:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Zo;case this.InterpolantFactoryMethodLinear:return lc;case this.InterpolantFactoryMethodSmooth:return Xa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&Ax(s))for(let a=0,c=s.length;a!==c;++a){let h=s[a];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,h),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Xa,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,h=e[a],l=e[a+1];if(h!==l&&(a!==1||h!==e[0]))if(s)c=!0;else{let u=a*i,f=u-i,p=u+i;for(let g=0;g!==i;++g){let _=t[u+g];if(_!==t[f+g]||_!==t[p+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let u=a*i,f=o*i;for(let p=0;p!==i;++p)t[f+p]=t[u+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,c=o*i,h=0;h!==i;++h)t[c+h]=t[a+h];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Gn.prototype.TimeBufferType=Float32Array;Gn.prototype.ValueBufferType=Float32Array;Gn.prototype.DefaultInterpolation=lc;var hs=class extends Gn{constructor(e,t,i){super(e,t,i)}};hs.prototype.ValueTypeName="bool";hs.prototype.ValueBufferType=Array;hs.prototype.DefaultInterpolation=Zo;hs.prototype.InterpolantFactoryMethodLinear=void 0;hs.prototype.InterpolantFactoryMethodSmooth=void 0;var Dc=class extends Gn{};Dc.prototype.ValueTypeName="color";var Uc=class extends Gn{};Uc.prototype.ValueTypeName="number";var Nc=class extends js{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-t)/(s-t),h=e*a;for(let l=h+a;h!==l;h+=4)Wt.slerpFlat(r,0,o,h-a,o,h,c);return r}},fa=class extends Gn{InterpolantFactoryMethodLinear(e){return new Nc(this.times,this.values,this.getValueSize(),e)}};fa.prototype.ValueTypeName="quaternion";fa.prototype.InterpolantFactoryMethodSmooth=void 0;var us=class extends Gn{constructor(e,t,i){super(e,t,i)}};us.prototype.ValueTypeName="string";us.prototype.ValueBufferType=Array;us.prototype.DefaultInterpolation=Zo;us.prototype.InterpolantFactoryMethodLinear=void 0;us.prototype.InterpolantFactoryMethodSmooth=void 0;var kc=class extends Gn{};kc.prototype.ValueTypeName="vector";var Fc=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,c,h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(l){a++,r===!1&&s.onStart!==void 0&&s.onStart(l,o,a),r=!0},this.itemEnd=function(l){o++,s.onProgress!==void 0&&s.onProgress(l,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(l){s.onError!==void 0&&s.onError(l)},this.resolveURL=function(l){return c?c(l):l},this.setURLModifier=function(l){return c=l,this},this.addHandler=function(l,u){return h.push(l,u),this},this.removeHandler=function(l){let u=h.indexOf(l);return u!==-1&&h.splice(u,2),this},this.getHandler=function(l){for(let u=0,f=h.length;u<f;u+=2){let p=h[u],g=h[u+1];if(p.global&&(p.lastIndex=0),p.test(l))return g}return null}}},Rx=new Fc,Oc=class{constructor(e){this.manager=e!==void 0?e:Rx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Oc.DEFAULT_MATERIAL_NAME="__DEFAULT";var Gr=class extends Xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},pa=class extends Gr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Ml=new Ge,nd=new I,id=new I,ma=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new be(512,512),this.map=null,this.mapPass=null,this.matrix=new Ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Br,this._frameExtents=new be(1,1),this._viewportCount=1,this._viewports=[new ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;nd.setFromMatrixPosition(e.matrixWorld),t.position.copy(nd),id.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(id),t.updateMatrixWorld(),Ml.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ml),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ml)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var sd=new Ge,Rr=new I,Sl=new I,Bc=class extends ma{constructor(){super(new Gt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new be(4,2),this._viewportCount=6,this._viewports=[new ot(2,1,1,1),new ot(0,1,1,1),new ot(3,1,1,1),new ot(1,1,1,1),new ot(3,0,1,1),new ot(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Rr.setFromMatrixPosition(e.matrixWorld),i.position.copy(Rr),Sl.copy(i.position),Sl.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Sl),i.updateMatrixWorld(),s.makeTranslation(-Rr.x,-Rr.y,-Rr.z),sd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sd)}},ga=class extends Gr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Bc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},zc=class extends ma{constructor(){super(new ia(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Wr=class extends Gr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.target=new Xt,this.shadow=new zc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var th="\\[\\]\\.:\\/",Cx=new RegExp("["+th+"]","g"),nh="[^"+th+"]",Px="[^"+th.replace("\\.","")+"]",Ix=/((?:WC+[\/:])*)/.source.replace("WC",nh),Lx=/(WCOD+)?/.source.replace("WCOD",Px),Dx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",nh),Ux=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",nh),Nx=new RegExp("^"+Ix+Lx+Dx+Ux+"$"),kx=["material","materials","bones","map"],Hc=class{constructor(e,t,i){let s=i||Mt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Mt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Cx,"")}static parseTrackName(e){let t=Nx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);kx.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=i(a.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let h=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let l=0;l<e.length;l++)if(e[l].name===h){h=l;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(h!==void 0){if(e[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}let o=e[s];if(o===void 0){let h=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Mt.Composite=Hc;Mt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Mt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Mt.prototype.GetterByBindingType=[Mt.prototype._getValue_direct,Mt.prototype._getValue_array,Mt.prototype._getValue_arrayElement,Mt.prototype._getValue_toArray];Mt.prototype.SetterByBindingTypeAndVersioning=[[Mt.prototype._setValue_direct,Mt.prototype._setValue_direct_setNeedsUpdate,Mt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_array,Mt.prototype._setValue_array_setNeedsUpdate,Mt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_arrayElement,Mt.prototype._setValue_arrayElement_setNeedsUpdate,Mt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_fromArray,Mt.prototype._setValue_fromArray_setNeedsUpdate,Mt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var dv=new Float32Array(1);var rd=new Ge,_a=class{constructor(e,t,i=0,s=1/0){this.ray=new Vi(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Or,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return rd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(rd),this}intersectObject(e,t=!0,i=[]){return Vc(e,this,i,t),i.sort(od),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Vc(e[s],this,i,t);return i.sort(od),i}};function od(n,e){return n.distance-e.distance}function Vc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let o=0,a=r.length;o<a;o++)Vc(r[o],e,t,!0)}}var Xr=class{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(It(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var xa=class extends yi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");var Cd={type:"change"},sh={type:"start"},Id={type:"end"},Ma=new Vi,Pd=new bn,Fx=Math.cos(70*qr.DEG2RAD),kt=new I,dn=2*Math.PI,at={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ih=1e-6,Sa=class extends xa{constructor(e,t=null){super(e,t),this.state=at.NONE,this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ds.ROTATE,MIDDLE:ds.DOLLY,RIGHT:ds.PAN},this.touches={ONE:fs.ROTATE,TWO:fs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new Wt,this._lastTargetPosition=new I,this._quat=new Wt().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Xr,this._sphericalDelta=new Xr,this._scale=1,this._panOffset=new I,this._rotateStart=new be,this._rotateEnd=new be,this._rotateDelta=new be,this._panStart=new be,this._panEnd=new be,this._panDelta=new be,this._dollyStart=new be,this._dollyEnd=new be,this._dollyDelta=new be,this._dollyDirection=new I,this._mouse=new be,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Bx.bind(this),this._onPointerDown=Ox.bind(this),this._onPointerUp=zx.bind(this),this._onContextMenu=qx.bind(this),this._onMouseWheel=Gx.bind(this),this._onKeyDown=Wx.bind(this),this._onTouchStart=Xx.bind(this),this._onTouchMove=Yx.bind(this),this._onMouseDown=Hx.bind(this),this._onMouseMove=Vx.bind(this),this._interceptControlDown=Zx.bind(this),this._interceptControlUp=$x.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Cd),this.update(),this.state=at.NONE}update(e=null){let t=this.object.position;kt.copy(t).sub(this.target),kt.applyQuaternion(this._quat),this._spherical.setFromVector3(kt),this.autoRotate&&this.state===at.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=dn:i>Math.PI&&(i-=dn),s<-Math.PI?s+=dn:s>Math.PI&&(s-=dn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(kt.setFromSpherical(this._spherical),kt.applyQuaternion(this._quatInverse),t.copy(this.target).add(kt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=kt.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let a=new I(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let h=new I(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(a),this.object.updateMatrixWorld(),o=kt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ma.origin.copy(this.object.position),Ma.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ma.direction))<Fx?this.object.lookAt(this.target):(Pd.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ma.intersectPlane(Pd,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ih||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ih||this._lastTargetPosition.distanceToSquared(this.target)>ih?(this.dispatchEvent(Cd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?dn/60*this.autoRotateSpeed*e:dn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){kt.setFromMatrixColumn(t,0),kt.multiplyScalar(-e),this._panOffset.add(kt)}_panUp(e,t){this.screenSpacePanning===!0?kt.setFromMatrixColumn(t,1):(kt.setFromMatrixColumn(t,0),kt.crossVectors(this.object.up,kt)),kt.multiplyScalar(e),this._panOffset.add(kt)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;kt.copy(s).sub(this.target);let r=kt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(dn*this._rotateDelta.x/t.clientHeight),this._rotateUp(dn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(dn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-dn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(dn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-dn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(dn*this._rotateDelta.x/t.clientHeight),this._rotateUp(dn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new be,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function Ox(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function Bx(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function zx(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Id),this.state=at.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Hx(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ds.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=at.DOLLY;break;case ds.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=at.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=at.ROTATE}break;case ds.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=at.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=at.PAN}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(sh)}function Vx(n){switch(this.state){case at.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case at.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case at.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Gx(n){this.enabled===!1||this.enableZoom===!1||this.state!==at.NONE||(n.preventDefault(),this.dispatchEvent(sh),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Id))}function Wx(n){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(n)}function Xx(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case fs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=at.TOUCH_ROTATE;break;case fs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=at.TOUCH_PAN;break;default:this.state=at.NONE}break;case 2:switch(this.touches.TWO){case fs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=at.TOUCH_DOLLY_PAN;break;case fs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=at.TOUCH_DOLLY_ROTATE;break;default:this.state=at.NONE}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(sh)}function Yx(n){switch(this._trackPointer(n),this.state){case at.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case at.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case at.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case at.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=at.NONE}}function qx(n){this.enabled!==!1&&n.preventDefault()}function Zx(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function $x(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var wa=class extends Js{constructor(){super();let e=new Hn;e.deleteAttribute("uv");let t=new Nt({side:jt}),i=new Nt,s=new ga(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new De(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new De(e,i);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);let a=new De(e,i);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);let c=new De(e,i);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);let h=new De(e,i);h.position.set(-2.017,.018,6.124),h.rotation.set(0,.333,0),h.scale.set(2.002,4.566,2.064),this.add(h);let l=new De(e,i);l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),this.add(l);let u=new De(e,i);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);let f=new De(e,nr(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);let p=new De(e,nr(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let g=new De(e,nr(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);let _=new De(e,nr(43));_.position.set(-.462,8.89,14.52),_.scale.set(4.38,5.441,.088),this.add(_);let m=new De(e,nr(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);let d=new De(e,nr(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function nr(n){let e=new zt;return e.color.setScalar(n),e}var Ea=18,Ta=24,Jx=`
float h31(vec3 p){ p = fract(p*0.3183099+vec3(.1,.2,.3)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vn(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ return 0.55*vn(p)+0.3*vn(p*2.1+3.1)+0.15*vn(p*4.3+7.7); }
vec3 vor(vec3 x){ vec3 n=floor(x), f=fract(x); float d1=8.0, d2=8.0, id=0.0;
  for(int k=-1;k<=1;k++) for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec3 g=vec3(float(i),float(j),float(k)); float hh=h31(n+g);
    vec3 o=vec3(hh, fract(hh*17.3), fract(hh*91.7));
    vec3 r=g+o-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; id=hh; } else if(d<d2){ d2=d; } }
  return vec3(sqrt(d1), sqrt(d2), id); }
`,Kx=`
{
  // Fur strands are cut out first, so discarded pixels skip the pattern maths.
  float furShade = 1.0;
  if (uShell > 0.0) {
    vec3 fp = vWPos * uFurDensity;
    vec3 cell = floor(fp);
    float rnd = h31(cell);
    float len = 0.45 + 0.55*rnd;
    vec3 jit = (vec3(fract(rnd*13.7), fract(rnd*57.3), fract(rnd*91.1)) - 0.5) * 0.5;
    float d = length(fract(fp) - 0.5 - jit);
    if (uShell > len || d > 0.6*(1.0 - 0.8*uShell/len)) discard;
    furShade = mix(0.55, 1.15, uShell) * (0.88 + 0.24*fract(rnd*7.0));
  }

  vec3 pp = vWPos * uPatScale; pp.x = abs(pp.x);
  float pat = 0.0;
  if (uPattern == 1) pat = smoothstep(0.15, 0.4, sin(pp.z*7.0 + (fbm(pp*1.3)-0.5)*7.0 + pp.y*1.5));
  else if (uPattern == 2) pat = 1.0 - smoothstep(0.26, 0.34, vor(pp*3.2).x);
  else if (uPattern == 3) pat = smoothstep(0.47, 0.53, fbm(pp*1.4+5.0));
  else if (uPattern == 4) { vec3 w = vor(pp*2.6); pat = smoothstep(0.05, 0.13, w.y-w.x); }
  else if (uPattern == 5) pat = smoothstep(0.35, 0.75, vWNrm.y + (fbm(pp*2.0)-0.5)*0.5);
  else if (uPattern == 6) pat = step(0.78, h31(floor(pp*14.0))) * (1.0 - smoothstep(0.2, 0.45, length(fract(pp*14.0)-0.5)));
  else if (uPattern == 7) pat = smoothstep(0.0, 0.25, sin(pp.z*5.0 + pp.y*5.0));
  vec3 col = mix(uBase, uSecond, pat);
  float bel = smoothstep(0.25, 0.8, dot(vWNrm, uBellyDir)) * uBelly;
  col = mix(col, uBellyCol, bel);
  if (uTex == 1) { vec3 w = vor(vWPos*uTexScale); float e = smoothstep(0.0, 0.16, w.y-w.x); col *= mix(0.6, 1.0, e) * (0.9 + 0.2*w.z); ccH = e * 0.012 + w.z * 0.004; }
  else if (uTex == 2) { float k = fbm(vWPos*30.0); col *= 0.92 + 0.16*k; ccH = k * 0.004; }
  else if (uShell == 0.0 && uFurLen == 0.0) { float k = fbm(vWPos*60.0); col *= 0.97 + 0.06*k; ccH = k * 0.0007 + vn(vWPos*220.0) * 0.00035; }
  if (uShell > 0.0) col *= furShade; else if (uFurLen > 0.0) col *= 0.75;
  diffuseColor.rgb = col;
}
`;function Aa(){let n={uBase:{value:new Pe},uSecond:{value:new Pe},uBellyCol:{value:new Pe},uBellyDir:{value:new I(0,-1,0)},uBelly:{value:.8},uPattern:{value:0},uPatScale:{value:1},uTex:{value:0},uTexScale:{value:22},uPM:{value:Array.from({length:Ta},()=>new Ge)},uBump:{value:1},uFurLen:{value:0},uFurDensity:{value:90},uDroop:{value:.3}},e=s=>{let r=new Nt({roughness:.7,metalness:0});return s>0&&(r.defines={FUR_SHELL:1}),r.onBeforeCompile=o=>{Object.assign(o.uniforms,n,{uShell:{value:s}}),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
attribute float fur; attribute float bone; attribute vec3 rp; attribute vec3 rn;
uniform float uShell; uniform float uFurLen; uniform float uDroop; uniform mat4 uPM[`+Ta+`];
varying vec3 vWPos; varying vec3 vWNrm;`).replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
#ifdef FUR_SHELL
objectNormal = mat3(uPM[int(bone + 0.5)]) * objectNormal;
#endif`).replace("#include <begin_vertex>",`vec3 transformed = vec3(position);
          // Patterns and fur are worked out at the creature's rest pose (rp, rn), so they stay put when limbs move.
          vWPos = rp;
          vWNrm = normalize(rn);
          #ifdef FUR_SHELL
          // Fur shells are one merged mesh; each vertex follows the limb ("bone") it grew from.
          mat4 pm = uPM[int(bone + 0.5)];
          float fl = uShell * uFurLen * fur;
          transformed = (pm * vec4(transformed, 1.0)).xyz + (mat3(pm) * normal) * fl;
          transformed += vec3(0.0, -1.0, -0.6) * (uShell * fl * uDroop);
          #endif`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
          uniform vec3 uBase, uSecond, uBellyCol, uBellyDir; uniform float uBelly, uPatScale, uTexScale, uShell, uFurLen, uFurDensity, uBump;
          uniform int uPattern, uTex; varying vec3 vWPos; varying vec3 vWNrm; float ccH = 0.0;`+Jx).replace("#include <color_fragment>",`#include <color_fragment>
`+Kx).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
          #ifndef FUR_SHELL
          { vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
            vec3 r1 = cross(sy, normal), r2 = cross(normal, sx); float det = dot(sx, r1);
            vec3 grad = sign(det) * (dFdx(ccH) * r1 + dFdy(ccH) * r2);
            normal = normalize(abs(det) * normal - grad * uBump); }
          #endif`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
          totalEmissiveRadiance += diffuseColor.rgb * pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0) * 0.4;`)},r},t=s=>new Nt(s);return{U:n,skin:e(0),shells:Array.from({length:Ea},(s,r)=>e((r+1)/Ea)),accent:t({roughness:.35}),hair:t({roughness:.55}),membrane:t({roughness:.6,side:Lt}),glass:t({roughness:.15,transparent:!0,opacity:.45,side:Lt,depthWrite:!1}),teeth:t({color:16052188,roughness:.3}),mouth:t({color:3804436,roughness:.5}),tongue:t({color:14248572,roughness:.4}),dark:t({color:1775384,roughness:.25}),lip:t({roughness:.35}),glint:new zt({color:16777215}),lash:t({color:1380370,roughness:.6}),eyeCache:new Map}}var jx={skin:0,scales:1,chitin:2,slime:0,fur:0},Qx={skin:.72,scales:.45,chitin:.22,slime:.1,fur:.9};function ii(n,e,t){var r,o;let i=n.U;i.uBase.value.set(e.base),i.uSecond.value.set(e.second),i.uBellyCol.value.set(e.belly),i.uBelly.value=e.bellyAmt,i.uPattern.value=e.pattern,i.uPatScale.value=e.patScale,i.uBellyDir.value.set(...t).normalize(),i.uTex.value=(r=jx[e.cover])!=null?r:0,i.uBump.value=e.cover==="slime"?.35:1;let s=e.cover==="fur";i.uFurLen.value=s?.012+e.furLen*.13:0,i.uDroop.value=e.furDroop*1.2,i.uFurDensity.value=330-e.furLen*170;for(let a of[n.skin,...n.shells])a.roughness=(o=Qx[e.cover])!=null?o:.7,a.metalness=e.cover==="chitin"?.25:0;n.accent.color.set(e.accent),n.hair.color.set(e.hair),n.membrane.color.set(e.membrane),n.glass.color.set(e.membrane),n.lip.color.set(e.base).lerp(new Pe(12075102),.6)}function Ld(n,e,t,i){let s=e+t+i.toFixed(2);if(n.eyeCache.has(s))return n.eyeCache.get(s);let r=256,o=128,a=document.createElement("canvas");a.width=r,a.height=o;let c=a.getContext("2d"),h=new Pe(t),l={};h.getHSL(l);let u=(g,_,m)=>`hsl(${(g*360).toFixed(0)},${(_*100).toFixed(0)}%,${(ey(m)*100).toFixed(0)}%)`,f=new Nt({roughness:.06,metalness:0});if(e==="compound"){c.fillStyle=u(l.h,l.s,l.l*.8),c.fillRect(0,0,r,o);for(let g=0;g<22;g++)for(let _=0;_<44;_++){let m=(_+g%2*.5)*(r/44),d=g*(o/22)+3,x=c.createRadialGradient(m-1,d-1,0,m,d,3.4);x.addColorStop(0,u(l.h+.05,l.s,l.l*1.5+.1)),x.addColorStop(1,u(l.h,l.s,l.l*.35)),c.fillStyle=x,c.beginPath(),c.arc(m,d,3.4,0,7),c.fill()}f.roughness=.18,f.metalness=.3}else if(e==="beady")c.fillStyle="#0b0a0d",c.fillRect(0,0,r,o),c.fillStyle=u(l.h,l.s,.12),c.fillRect(0,0,r,o*.3);else{let g=c.createLinearGradient(0,0,0,o);g.addColorStop(0,"#f7f4ee"),g.addColorStop(.45,"#efe6df"),g.addColorStop(.7,"#d9a9a4"),c.fillStyle=g,c.fillRect(0,0,r,o);let _=i*.95/Math.PI*o,m=7,d=()=>(m=m*16807%2147483647,m/2147483647);for(let x=0;x<r;x++){let v=x/r*Math.PI*2+Math.PI,y=.75+d()*.5,P=c.createLinearGradient(0,0,0,_);if(P.addColorStop(0,u(l.h+.03,l.s,l.l*1.5*y+.08)),P.addColorStop(.75,u(l.h,l.s,l.l*y)),P.addColorStop(.93,u(l.h,l.s,l.l*.3)),P.addColorStop(1,"#20140f"),c.fillStyle=P,c.fillRect(x,0,1,_),e!=="glow"){let T=.5,A=.5;e==="cat"?(T=.13,A=.9):e==="goat"&&(T=.85,A=.22);let C=T*A/Math.sqrt((A*Math.cos(v))**2+(T*Math.sin(v))**2);c.fillStyle="#050406",c.fillRect(x,0,1,_*C)}}if(e==="glow"){f.emissive=h.clone(),f.emissiveIntensity=1.3;let x=document.createElement("canvas");x.width=4,x.height=o;let v=x.getContext("2d");v.fillStyle="#000",v.fillRect(0,0,4,o);let y=v.createLinearGradient(0,0,0,_);y.addColorStop(0,"#fff"),y.addColorStop(1,"#333"),v.fillStyle=y,v.fillRect(0,0,4,_),f.emissiveMap=new ni(x)}}let p=new ni(a);return p.colorSpace=Bt,p.wrapS=Nr,p.anisotropy=4,f.map=p,n.eyeCache.set(s,f),f}var ey=n=>Math.min(1,Math.max(0,n));function Ud(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,c=new xt,h=0;for(let l=0;l<n.length;++l){let u=n[l],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(e){let p;if(t)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,l),h+=p}}if(t){let l=0,u=[];for(let f=0;f<n.length;++f){let p=n[f].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+l);l+=n[f].attributes.position.count}c.setIndex(u)}for(let l in r){let u=Dd(r[l]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;c.setAttribute(l,u)}for(let l in o){let u=o[l][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[l]=[];for(let f=0;f<u;++f){let p=[];for(let _=0;_<o[l].length;++_)p.push(o[l][_][f]);let g=Dd(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;c.morphAttributes[l].push(g)}}return c}function Dd(n){let e,t,i,s=-1,r=0;for(let h=0;h<n.length;++h){let l=n[h];if(e===void 0&&(e=l.array.constructor),e!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=l.itemSize),t!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=l.normalized),i!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=l.gpuType),s!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=l.count*t}let o=new e(r),a=new _t(o,t,i),c=0;for(let h=0;h<n.length;++h){let l=n[h];if(l.isInterleavedBufferAttribute){let u=c/t;for(let f=0,p=l.count;f<p;f++)for(let g=0;g<t;g++){let _=l.getComponent(f,g);a.setComponent(f+u,g,_)}}else o.set(l.array,c);c+=l.count*t}return s!==void 0&&(a.gpuType=s),a}var ty=I,ae=(n=0,e=0,t=0)=>new ty(n,e,t),Wn=(n,e,t)=>Math.min(t,Math.max(e,n)),fn=(n,e,t)=>n+(e-n)*t,Cn=ae(1,0,0),Yt=ae(0,1,0),ir=ae(0,0,1);function Zr(n){let e=(n|0)+1831565813;return()=>(e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296)}function ny(n,e,t,i,s){let r=s*s,o=r*s;return .5*(2*e+(t-n)*s+(2*n-5*e+4*t-i)*r+(3*e-n-3*t+i)*o)}function Nd(n,e){let t=n.length,i=Wn(e,0,1)*(t-1),s=Math.min(Math.floor(i),t-2),r=i-s,o=n[Math.max(s-1,0)],a=n[s],c=n[s+1],h=n[Math.min(s+2,t-1)];return Wn(ny(o,a,c,h,r),Math.min(a,c)*.9,Math.max(a,c)*1.06)}function nn(n,e={}){var B,J,Q,K,se;let t=(B=e.radial)!=null?B:14,i=(J=e.sub)!=null?J:6,s=(Q=e.capRings)!=null?Q:4,r=(K=e.capStart)!=null?K:1,o=(se=e.capEnd)!=null?se:1,a=n.length,c=new Gi(n.map(U=>U.p),!1,"centripetal"),h=n.map(U=>U.rx),l=n.map(U=>{var z;return(z=U.ry)!=null?z:U.rx}),u=(a-1)*i+1,f=[],p=[],g=[],_=[],m=[],d=[],x=null;for(let U=0;U<u;U++){let z=U/(u-1),oe=c.getPoint(z),H=c.getTangent(z).normalize();x||(x=e.side?e.side.clone():Math.abs(H.x)<.9?Cn.clone():Yt.clone()),x=x.clone().addScaledVector(H,-x.dot(H)),x.lengthSq()<1e-8&&(x=Math.abs(H.y)<.9?Yt.clone().cross(H):Cn.clone().cross(H)),x.normalize(),f.push(oe),p.push(H),g.push(x),_.push(H.clone().cross(x).normalize());let he=Nd(h,z),Re=Nd(l,z);if(e.ridges){let Ne=1+e.ridgeAmp*Math.sin(z*e.ridges*Math.PI*2);he*=Ne,Re*=Ne}m.push(Math.max(he,1e-4)),d.push(Math.max(Re,1e-4))}let v=[],y=(U,z)=>z*(m[U]+d[U])*.5;if(r>0)for(let U=s;U>=1;U--){let z=U/s*Math.PI/2;v.push({c:f[0].clone().addScaledVector(p[0],-y(0,r)*Math.sin(z)),i:0,s:Math.max(Math.cos(z),.015),u:-U/s})}for(let U=0;U<u;U++)v.push({c:f[U],i:U,s:1,u:U/(u-1)});if(o>0)for(let U=1;U<=s;U++){let z=U/s*Math.PI/2;v.push({c:f[u-1].clone().addScaledVector(p[u-1],y(u-1,o)*Math.sin(z)),i:u-1,s:Math.max(Math.cos(z),.015),u:1+U/s})}let P=v.length,T=t+1,A=new Float32Array(P*T*3),C=new Float32Array(P*T*3),M=new Float32Array(P*T*2),b=ae();for(let U=0;U<P;U++){let z=v[U],oe=z.i;for(let H=0;H<=t;H++){let he=H/t*Math.PI*2;b.copy(z.c).addScaledVector(g[oe],m[oe]*z.s*Math.sin(he)).addScaledVector(_[oe],d[oe]*z.s*Math.cos(he));let Re=(U*T+H)*3;A[Re]=b.x,A[Re+1]=b.y,A[Re+2]=b.z,M[(U*T+H)*2]=z.u,M[(U*T+H)*2+1]=H/t}}let D=(U,z,oe)=>{let H=(U*T+z)*3;return oe.set(A[H],A[H+1],A[H+2])},G=ae(),W=ae(),q=ae(),ie=ae(),Z=ae();for(let U=0;U<P;U++)for(let z=0;z<=t;z++){let oe=z%t;D(Math.min(U+1,P-1),oe,G),D(Math.max(U-1,0),oe,W),D(U,(oe+1)%t,q),D(U,(oe-1+t)%t,ie),Z.copy(G.sub(W)).cross(q.sub(ie)),Z.lengthSq()<1e-16&&Z.copy(p[v[U].i]).multiplyScalar(U<P/2?-1:1),Z.normalize();let H=(U*T+z)*3;C[H]=Z.x,C[H+1]=Z.y,C[H+2]=Z.z}let w=[];for(let U=0;U<P-1;U++)for(let z=0;z<t;z++){let oe=U*T+z,H=oe+T;w.push(oe,H,oe+1,oe+1,H,H+1)}let L=new xt;return L.setAttribute("position",new _t(A,3)),L.setAttribute("normal",new _t(C,3)),L.setAttribute("uv",new _t(M,2)),L.setIndex(w),e.frames&&(L.userData.frames={C:f,T:p,S:g,U:_,RX:m,RY:d,capS:r,capE:o,m:u}),L.userData.end={p:f[u-1],t:p[u-1],r:(m[u-1]+d[u-1])/2},L}function sr(n,e,t){let i=Wn(e,0,1),s=i*(n.m-1),r=Math.min(Math.floor(s),n.m-2),o=s-r,a=r+1,c=n.C[r].clone().lerp(n.C[a],o),h=n.S[r].clone().lerp(n.S[a],o).normalize(),l=n.T[r].clone().lerp(n.T[a],o).normalize(),u=l.clone().cross(h).normalize(),f=fn(n.RX[r],n.RX[a],o),p=fn(n.RY[r],n.RY[a],o),g=1,_=0,m=0;(e<0||e>1)&&(m=e<0?-1:1,_=Wn(e<0?-e:e-1,0,1)*Math.PI/2,c.addScaledVector(l,m*(m<0?n.capS:n.capE)*(f+p)*.5*Math.sin(_)),g=Math.max(Math.cos(_),.015));let d=Math.sin(t),x=Math.cos(t),v=c.clone().addScaledVector(h,f*g*d).addScaledVector(u,p*g*x),P=h.clone().multiplyScalar(d/f).addScaledVector(u,x/p).normalize().multiplyScalar(Math.cos(_)).addScaledVector(l,m*Math.sin(_)).normalize();return{pos:v,normal:P,tangent:l,center:c,rx:f,ry:p,r:(f+p)/2}}function lt(n,e){return nn(n.map(t=>{var i;return{p:ae(t[0],t[1],t[2]),rx:t[3],ry:(i=t[4])!=null?i:t[3]}}),e)}function ct(n,e=1,t=1,i=1,s=0,r=0,o=0,a=14){let c=new tn(n,a,Math.max(8,Math.round(a*.7)));return c.scale(e,t,i),c.translate(s,r,o),c}function ps(n,e){let t=n.length,i=[],s=[],r=[];for(let a=0;a<t;a++)i.push(n[a].x,n[a].y,n[a].z,e[a].x,e[a].y,e[a].z),r.push(a/(t-1),0,a/(t-1),1);for(let a=0;a<t-1;a++){let c=a*2;s.push(c,c+1,c+2,c+2,c+1,c+3)}let o=new xt;return o.setAttribute("position",new Ze(i,3)),o.setAttribute("uv",new Ze(r,2)),o.setIndex(s),o.computeVertexNormals(),o}function kd(n,e){return n.applyMatrix4(e),n}function ms(n,e,t,i){return n.translate(e,t,i),n}function rh(n,e,t,i){return new Ge().makeBasis(n,e,t).setPosition(i||ae())}function Fd(n){let e=n.index.array;for(let t=0;t<e.length;t+=3){let i=e[t];e[t]=e[t+2],e[t+2]=i}}function Oe(n,e=[]){if(n.length===1)return n[0];let t=n.map(i=>{let s=i.index?i:i.toNonIndexed();for(let r of Object.keys(s.attributes))r!=="position"&&r!=="normal"&&r!=="uv"&&!e.includes(r)&&s.deleteAttribute(r);return s});return Ud(t,!1)}var qt=Math.PI;var sn=(n,e,t,i={})=>nn([{p:n,rx:t},{p:n.clone().lerp(e,.5),rx:t*.62},{p:e,rx:t*.04}],{radial:8,sub:3,capStart:0,capEnd:0,...i}),si=(n,e)=>{let t=e.clone().addScaledVector(n,-e.dot(n));return t.lengthSq()<1e-6?(Math.abs(n.x)<.9?Cn:Yt).clone().cross(n).normalize():t.normalize()};function Pn(n,e,t,i,s={}){let r=n[n.length-1].clone().sub(n[0]).normalize(),o=r.clone().cross(i);return nn(n.map((a,c)=>({p:a,rx:Math.max(e[c],.004),ry:Math.max(t*(e[c]>.03?1:.4),.003)})),{radial:8,sub:4,side:o.lengthSq()<1e-6?si(r,Cn):o.normalize(),capStart:.5,capEnd:.5,capRings:2,...s})}function iy(n){return(e,t)=>{var c,h,l,u,f;let i=[],r=n==="stalk",o=r?1.55:n==="compound"?0:n==="beady"?.05:-.1,a=new tn(.5,28,18);if(a.rotateX(qt/2),n==="compound"&&a.scale(.95,1.2,.85),i.push({g:ms(a,0,0,o),m:Ld(t.M,r?"round":n,t.look.eye,(c=e.iris)!=null?c:.75)}),n!=="compound"&&i.push({g:ct(.055,1.5,1,.5,-.14,.17,o+.455,8),m:t.M.glint}),r&&i.push({g:lt([[0,0,-.3,.3],[0,.05,.5,.2],[0,0,1.15,.19],[0,0,1.5,.4]],{capEnd:.6}),m:"skin"}),n!=="compound"){let p=new un(.51,.085,8,28);p.scale(1,1,1.3),r||i.push({g:ms(p,0,0,-.03),m:"skin"});let g=(h=e.lid)!=null?h:.3;if(g>.02&&n!=="beady"){let _=new tn(.535,22,10,0,qt*2,0,.55+g*1.05);_.rotateX(.55),_.rotateZ((l=e.brow)!=null?l:0),i.push({g:ms(_,0,0,o),m:"skin"});let m=new tn(.5*1.06,22,8,0,qt*2,0,.42+g*.4);if(m.rotateX(qt-.3),i.push({g:ms(m,0,0,o),m:"skin"}),t.female&&((u=e.lash)!=null?u:1)>.05){let d=.55+g*1.05,x=[];for(let v=0;v<7;v++){let y=-1.05+v*.35,P=ae(Math.sin(d)*Math.sin(y),Math.cos(d),Math.sin(d)*Math.cos(y)).applyAxisAngle(Cn,.55).applyAxisAngle(ir,(f=e.brow)!=null?f:0),T=P.clone().multiplyScalar(.5*1.06).add(ae(0,0,o)),A=T.clone().add(P.clone().add(ae(0,.75,.55)).normalize().multiplyScalar(.3*e.lash*(1-Math.abs(y)*.3)));x.push(sn(T,A,.028,{radial:5}))}i.push({g:Oe(x),m:"lash"})}}}return i}}var sy={iris:[.4,1.2,.75,"Iris size"],lid:[0,.9,.3,"Eyelid"],brow:[-.7,.7,0,"Sad / angry"],lash:[0,2,1,"Lashes (female)"]};function Od(n,e,t,i=1){let s=[];for(let r=0;r<n;r++){let o=e(r/(n-1));s.push(sn(o.p,o.p.clone().add(ae(0,-i*t*o.s,0)),.035*(.7+o.s*.5),{radial:6}))}return s}function ry(n){let e=n.len,t=[],i=n.open;t.push({g:lt([[0,.06,-.35,.52,.44],[0,.08,.2*e,.44,.34],[0,.04,.62*e,.34,.24],[0,0,.9*e,.27,.19]],{radial:16}),m:"skin",fur:.3}),t.push({g:ct(.15,1.25,.85,.9,0,.1,.9*e+.2),m:"dark"});let s=lt([[0,-.1,-.3,.44,.22],[0,-.14,.3*e,.34,.15],[0,-.13,.82*e,.21,.1]],{radial:14}),r=n.teeth,o=[s],a=[],c=[];for(let l of[-1,1])a.push(...Od(6,u=>({p:ae(l*fn(.36,.17,u),-.08,fn(.2,.95,u)*e),s:u>.75&&u<.95?2.2:1}),.13*r)),c.push(...Od(5,u=>({p:ae(l*fn(.3,.14,u),-.05,fn(.25,.82,u)*e),s:u>.7?1.6:.8}),.1*r,-1));let h=l=>(l.translate(0,.1,.3),l.rotateX(i*.75),l.translate(0,-.1,-.3),l);return t.push({g:h(s),m:"skin",fur:.3}),r>.05&&(t.push({g:Oe(a),m:"teeth"}),t.push({g:h(Oe(c)),m:"teeth"})),t.push({g:ct(.5,.62,.16+i*.25,.9*e,0,-.1-i*.1,.4*e),m:"mouth"}),i>.25&&t.push({g:h(ct(.5,.36,.07,.7*e,0,-.03,.42*e)),m:"tongue"}),t}function oy(n){let e=n.len,t=n.hook,i=[];i.push({g:lt([[0,.05,-.3,.44,.38],[0,.07,.3*e,.33,.27],[0,.03-t*.05,.72*e,.17,.15],[0,-t*.4,1*e,.015]],{radial:12,capEnd:.3}),m:"accent"});let s=lt([[0,-.16,-.3,.38,.2],[0,-.17,.35*e,.24,.11],[0,-.14,.8*e,.02]],{radial:12,capEnd:.3});return s.translate(0,.1,.2),s.rotateX(n.open*.6),s.translate(0,-.1,-.2),i.push({g:s,m:"accent"}),i.push({g:Oe([ct(.035,1,1,1.6,.14,.2,.3*e),ct(.035,1,1,1.6,-.14,.2,.3*e)]),m:"dark"}),n.open>.2&&i.push({g:ct(.5,.4,.12,.6*e,0,-.08,.3*e),m:"mouth"}),i}function ay(n){let e=[],t=[],i=n.open;for(let s of[-1,1])e.push(lt([[s*.28,0,-.15,.17],[s*(.5+i*.25),-.05,.4,.14],[s*(.36+i*.3),-.1,.85*n.len,.08],[s*(.08+i*.3),-.12,1.1*n.len,.01]],{radial:10,ridges:0})),t.push(lt([[s*.12,-.2,-.1,.07],[s*.15,-.35,.3,.05],[s*.1,-.5,.45,.02]],{radial:8}));return[{g:Oe(e),m:"accent"},{g:Oe(t),m:"skin"},{g:ct(.3,1,.8,.5,0,-.08,.02),m:"mouth"}]}function ly(n){let e=new un(.42,.15,10,28);e.translate(0,0,.05);let t=[],i=Math.round(n.count);for(let s=0;s<2;s++)for(let r=0;r<i;r++){let o=(r+s*.5)/i*qt*2,a=.36-s*.1,c=ae(Math.cos(o)*a,Math.sin(o)*a,.1-s*.08);t.push(sn(c,c.clone().add(ae(-Math.cos(o)*.14,-Math.sin(o)*.14,.16).multiplyScalar(n.teeth)),.045,{radial:6}))}return[{g:e,m:"skin"},{g:ct(.4,1,1,.35,0,0,-.02),m:"mouth"},{g:Oe(t),m:"teeth"}]}function cy(n){let e=(i,s,r)=>{let o=[];for(let a=0;a<=6;a++){let c=a/6-.5,h=1-Math.abs(c)*2;o.push([c,i+n.smile*.22*(c*c*4)+r*.03*h,.04-c*c*.45,.012+.075*s*Math.pow(h,.6),.012+.06*s*Math.pow(h,.6)])}return lt(o,{radial:10,sub:3,side:ae(0,1,0)})},t=lt([[-.48,n.smile*.2,-.06,.012],[0,0,.065,.02],[.48,n.smile*.2,-.06,.012]],{radial:6});return[{g:Oe([e(.045,n.full*.85,1),e(-.05,n.full,-1)]),m:"lip"},{g:t,m:"mouth"}]}function hy(n){let e=n.curl;return[{g:lt([[0,0,-.3,.4],[0,-.05,.45,.34],[0,-.55,.95,.27],[0,-1.25*n.len,1.1,.21],[0,-1.9*n.len,1+e*.2,.17],[0,-2.3*n.len,1+e*.9,.14]],{radial:14,sub:8,ridges:26,ridgeAmp:.04}),m:"skin"}]}function uy(n,e){let t=[],i=Math.round(n.count);for(let s=0;s<i;s++){let r=(s-(i-1)/2)*(.7/i),o=.1*Math.sin(s*2.4),a=e.down,c=ae(r,0,-.15),h=ae(r*1.2,0,.3),l=h.clone().addScaledVector(a,.5*n.len).add(ae(0,0,.1)),u=l.clone().addScaledVector(a,.6*n.len).add(ae(r*.5+o,0,-.1+o));t.push(nn([{p:c,rx:.12},{p:h,rx:.1},{p:l,rx:.07},{p:u,rx:.02}],{radial:8}))}return[{g:Oe(t),m:"skin"},{g:ct(.25,1.2,.7,.4,0,-.05,0),m:"mouth"}]}function dy(n){return[{g:Oe([lt([[0,.5*n.len,-.1,.09,.08],[0,.2,.1*n.len+.05,.12,.11],[0,-.06,.3*n.len,.17,.14]],{radial:10}),ct(.12,1,.8,1,.15*n.wide,-.1,.1*n.len),ct(.12,1,.8,1,-.15*n.wide,-.1,.1*n.len)]),m:"skin"}]}function $r(n){return(e,t)=>{let i=t.up,s=t.down,r={point:[[ae(0,0,-.15),.34],[ae(0,.04,.3),.37],[ae(0,.07,.72),.22],[ae(0,.09,1.08),.02]],round:[[ae(0,0,-.12),.3],[ae(0,0,.3),.5],[ae(0,0,.62),.44],[ae(0,0,.8),.2]],long:[[ae(0,0,-.15),.2],[ae(0,.03,.6),.27],[ae(0,.04,1.45),.24],[ae(0,0,2.1),.03]],elf:[[ae(0,0,-.12),.17],[ae(0,0,.2).addScaledVector(i,.12),.3],[ae(0,0,.42).addScaledVector(i,.45),.2],[ae(0,0,.62).addScaledVector(i,.95*e.len),.02]],floppy:[[ae(0,0,-.12),.3],[ae(0,0,.3),.38],[ae(0,0,.5).addScaledVector(s,.5*e.len),.42],[ae(0,0,.46).addScaledVector(s,1.1*e.len),.32],[ae(0,0,.42).addScaledVector(s,1.45*e.len),.06]]}[n],o=n==="floppy"||n==="elf"?1:e.len,a=r.map(u=>ae(u[0].x,u[0].y,u[0].z*(u[0].z>0?o:1))),c=r.map(u=>u[1]*e.wide),h=n==="floppy"?ae(0,0,1):t.fwd,l=Pn(a.map((u,f)=>u.clone().addScaledVector(h,.045).multiplyScalar(f?.9:1)),c.map(u=>u*.62),.03,h);return[{g:Pn(a,c,.07,h,{radial:10}),m:"skin",fur:.3},{g:l,m:"membrane"}]}}function fy(n,e){let t=[],i=[],s=[];for(let r=0;r<5;r++){let o=-.6+r*.42,a=ae(0,0,1).multiplyScalar(Math.cos(o)).addScaledVector(e.up,Math.sin(o)),c=a.clone().multiplyScalar(n.len*(.8+.35*Math.sin((r+.5)/5*qt)));t.push(c),i.push(a.clone().multiplyScalar(.05)),s.push(sn(ae(0,0,-.1),c,.045,{radial:6}))}return[{g:Oe(s),m:"accent"},{g:ps(i,t.map(r=>r.clone().multiplyScalar(.93))),m:"membrane"}]}function rr(n){return e=>{var c,h;let t=e.len,i=(c=e.curve)!=null?c:1,s={radial:12,sub:7,ridges:n==="spike"?0:9*t,ridgeAmp:.05,capEnd:.3};if(n==="spike")return[{g:lt([[0,0,-.15,.3],[0,.02*i,.5*t,.2],[0,.1*i,1.25*t,.01]],s),m:"accent"}];if(n==="curved")return[{g:lt([[0,0,-.15,.3],[0,.05*i,.42*t,.26],[0,.32*i,.88*t,.18],[0,.78*i,1.12*t,.09],[0,1.2*i,1.05*t,.01]],s),m:"accent"}];if(n==="ram"){let l=[];for(let u=0;u<=12;u++){let f=u/12,p=f*qt*1.75*i,g=.62*t*(1-f*.45);l.push([.12+f*.75,g*Math.sin(p)*.9,-.15+g*(1-Math.cos(p)),.32*(1-f*.95)+.01])}return[{g:lt(l,{...s,sub:4,ridges:22}),m:"accent"}]}if(n==="tusk")return[{g:lt([[0,0,-.25,.2],[0,-.3*i,.3*t,.17],[0,-.38*i,.8*t,.12],[0,-.05,1.3*t,.01]],{...s,ridges:0}),m:"teeth"}];let r=[[0,0,-.15,.14],[.05,.2,.6,.115],[.12,.5,1.2,.095],[.15,.62,1.9,.065],[.1,.5,2.5,.012]].map(l=>[l[0],l[1]*i,l[2]*t,l[3]]),o=[lt(r,{radial:8,sub:5})],a=Math.round((h=e.tines)!=null?h:3);for(let l=0;l<a;l++){let u=(l+.6)/(a+.4),f=u*4,p=Math.min(Math.floor(f),3),g=f-p,_=ae(fn(r[p][0],r[p+1][0],g),fn(r[p][1],r[p+1][1],g),fn(r[p][2],r[p+1][2],g)),m=l%2?1:-1,d=.7*(1-u*.4);o.push(nn([{p:_,rx:.08},{p:_.clone().add(ae(m*.2*d,-.35*d,.3*d)),rx:.065},{p:_.clone().add(ae(m*.3*d,-.5*d,.9*d)),rx:.012}],{radial:7,sub:4,capStart:0}))}return[{g:Oe(o),m:"accent"}]}}function Bd(n){return e=>{let t=e.len,i=e.curve,s=[[0,0,-.08,.055],[0,.1*i,.6*t,.045],[0,.5*i,1.2*t,.035],[0,1.05*i,1.5*t,.028]],r=[lt(s,{radial:7,sub:6})];if(!n)return[{g:r[0],m:"accent"},{g:ct(.09,1,1,1,0,1.05*i,1.5*t),m:"accent"}];let o=new Gi(s.map(a=>ae(a[0],a[1],a[2])));for(let a=2;a<16;a++){let c=o.getPoint(a/16),h=.3*Math.sin(a/16*qt)+.05;for(let l of[-1,1])r.push(sn(c,c.clone().add(ae(l*h,.05,h*.3)),.016,{radial:4}))}return[{g:Oe(r),m:"hair"}]}}function oh(n){return(e,t)=>{var l,u,f,p,g,_;let i=[],s=Math.round((l=e.count)!=null?l:n.count),r=(u=e.droop)!=null?u:n.droop,o=(f=e.len)!=null?f:1,a=(p=e.spread)!=null?p:n.spread,c=(g=n.capR)!=null?g:.5,h=ae(0,0,-c-.02);for(let m=0;m<s;m++){let d=a*Math.sqrt((m+.5)/s),x=m*2.39996+t.rnd()*.3,v=ae(Math.sin(d)*Math.cos(x),Math.sin(d)*Math.sin(x),Math.cos(d)),y=o*(.75+.5*t.rnd()),P=n.width*(.8+.4*t.rnd()),T=y/4,A=[h.clone().addScaledVector(v,c)],C=v.clone(),M=A[0].clone();for(let D=1;D<=4;D++){C.multiplyScalar(1-r*.5).addScaledVector(t.down,r*.3*D).normalize(),M=M.clone().addScaledVector(C,T);let G=M.clone().sub(h);n.hug&&G.length()<c*1.05&&(M=h.clone().add(G.setLength(c*1.05))),A.push(M)}let b=n.hug?A[2].clone().sub(h).normalize():si(v,t.fwd.clone().add(ae(t.rnd()-.5,t.rnd()-.5,0)));i.push(Pn(A,[P*.75,P,P*.95,P*.65,.012],P*.2,b,{radial:6,sub:3}))}if(n.hug){let m=new tn(c*1.03,24,12,0,qt*2,0,Math.min(a*.82,qt*.6));m.rotateX(qt/2),m.translate(h.x,h.y,h.z),i.push(m)}return[{g:Oe(i),m:(_=n.mat)!=null?_:"hair"}]}}function py(n,e){let t=[];for(let i=0;i<4;i++){let s=-.45+i*.3,o=ae(0,0,1).multiplyScalar(.35).addScaledVector(e.up,Math.sin(s)*.6).addScaledVector(e.fwd,-.15).add(ae(0,0,.6)).normalize().clone().multiplyScalar(n.len*1.6);t.push(nn([{p:ae(0,(i-1.5)*.1,0),rx:.016},{p:o.clone().multiplyScalar(.5).addScaledVector(e.down,-.05),rx:.012},{p:o.addScaledVector(e.down,.12*n.len),rx:.004}],{radial:4,sub:4}))}return[{g:Oe(t),m:"teeth"}]}function my(n){let e=new un(.5,.06,6,28);e.scale(1,n.long,1);let t=[];for(let i=0;i<7;i++){let s=i/6*qt*2,r=i===6?0:.27;t.push(ct(.17,1,1,.35,Math.cos(s)*r,Math.sin(s)*r*n.long,.5*n.dome*(i===6?.98:.8)))}return[{g:Oe([ct(.5,1,n.long,n.dome,0,0,0,22),e]),m:"accent"},{g:Oe(t),m:"skin"}]}function gy(n,e){let t=e.fwd.clone().multiplyScalar(-1),i=ae(0,0,1),s=(r,o)=>i.clone().multiplyScalar(r).addScaledVector(t,o);return[{g:Pn([s(-.12,0),s(.4*n.len,.15*n.sweep),s(.8*n.len,.5*n.sweep),s(1.1*n.len,.95*n.sweep)],[.5,.42,.25,.02],.06,si(i,t.clone().cross(i)),{radial:10}),m:"skin"}]}function _y(n,e){let t=e.fwd.clone().multiplyScalar(-1),i=ae(0,0,1),s=e.down,r=(o,a,c)=>i.clone().multiplyScalar(o).addScaledVector(t,a).addScaledVector(s,c);return[{g:Pn([r(-.12,0,0),r(.4*n.len,.15*n.sweep,.08),r(.9*n.len,.5*n.sweep,.2),r(1.25*n.len,.95*n.sweep,.3)],[.3,.38,.27,.02],.05,e.up,{radial:10}),m:"skin"}]}var Ca={human(){let n=[];for(let e=0;e<5;e++)n.push(ct(.3-e*.03,1,.8,1.3,-.62+e*.33,-.95,2.55-e*.14));return[{g:Oe([ct(.95,.95,.85,1.05,0,-.45,-.25),lt([[0,-.4,-.2,.8,.6],[0,-.65,1.1,.9,.5],[0,-.85,2.3,.95,.3]],{radial:10}),...n]),m:"skin"}]},paw(){let n=[ct(1,1.15,.8,1.35,0,-.55,.45)],e=[];for(let t=0;t<4;t++){let i=-.75+t*.5,s=1.55-Math.abs(t-1.5)*.18;n.push(ct(.42,1,.9,1.3,i,-.75,s)),e.push(sn(ae(i,-.6,s+.35),ae(i*1.08,-1.05,s+.95),.14,{radial:6}))}return[{g:Oe(n),m:"skin",fur:.35},{g:Oe(e),m:"accent"}]},hoof(){return[{g:lt([[0,.1,0,.95],[0,-.6,.15,1.2,1.25],[0,-1.15,.3,1.4,1.5]],{radial:12,capEnd:.12,capStart:0}),m:"accent"}]},talon(n){let e=[],t=[];for(let[s,r,o]of[[-1.25,1.7,1],[0,2.3,1.1],[1.25,1.7,1],[0,-1.4,.7]]){e.push(lt([[0,-.1,0,.55],[s*.5,-.75,r*.5,.45],[s,-1,r,.32]],{radial:8,ridges:5,ridgeAmp:.08}));let a=ae(s,0,r).normalize();t.push(sn(ae(s,-.95,r),ae(s,-1.25,r).addScaledVector(a,.75*o),.26,{radial:6}))}let i=[{g:Oe(e),m:"skin"},{g:Oe(t),m:"accent"}];return n&&i.push({g:ps([ae(0,-.6,.2),ae(0,-.6,.2),ae(0,-.6,.2),ae(0,-.6,.2),ae(0,-.6,.2)],[ae(-1.45,-1.05,1.95),ae(-.75,-1.05,1.8),ae(0,-1.05,2.6),ae(.75,-1.05,1.8),ae(1.45,-1.05,1.95)]),m:"membrane"}),i},webbed(){return Ca.talon(!0)},stump(){let n=[];for(let e=0;e<4;e++){let t=-.9+e*.6;n.push(ct(.3,1,.8,.6,Math.sin(t)*1.3,-.95,Math.cos(t)*1.3+.1))}return[{g:lt([[0,.2,0,1],[0,-.6,.05,1.2],[0,-1.15,.1,1.38]],{radial:12,capEnd:.1,capStart:0}),m:"skin"},{g:Oe(n),m:"accent"}]},point(){return[{g:sn(ae(0,.2,0),ae(.3,-1.9,.2),.95,{capStart:0}),m:"accent"}]},none(){return[]}},zd={human(){let n=[ct(1,1.2,1.3,.6,0,1,0)];return[-.82,-.28,.27,.8].forEach((e,t)=>{let i=[.85,1,1.05,.95][t];n.push(lt([[e,1.8,0,.3],[e*1.1,1.8+1.1*i,.1,.27],[e*1.15,1.8+1.9*i,.4,.24],[e*1.15,1.8+2.4*i,.8,.2]],{radial:7,sub:4,ridges:3,ridgeAmp:.06}))}),n.push(lt([[.7,.6,.2,.36],[1.5,1.3,.5,.3],[1.9,2.1,.75,.24]],{radial:7,sub:4})),[{g:Oe(n),m:"skin"}]},claw(){let n=[ct(1,1.2,1.2,.75,0,.9,0)],e=[];for(let t of[-.85,0,.85])n.push(lt([[t,1.5,0,.42],[t*1.3,2.6,.2,.38],[t*1.4,3.3,.7,.3]],{radial:7,sub:4,ridges:2,ridgeAmp:.08})),e.push(sn(ae(t*1.4,3.25,.65),ae(t*1.45,3.9,1.6),.27,{radial:6}));return n.push(lt([[.9,.5,.2,.4],[1.7,1.2,.6,.3]],{radial:7})),e.push(sn(ae(1.7,1.2,.6),ae(2,1.7,1.3),.26,{radial:6})),[{g:Oe(n),m:"skin"},{g:Oe(e),m:"accent"}]},pincer(){return[{g:Oe([ct(1,1.7,2.1,1.25,0,1.6,0),lt([[-.7,3,0,.8,.6],[-1.1,4.4,0,.6,.45],[-.75,5.5,0,.3],[-.1,6.1,0,.03]],{radial:9,capStart:0}),lt([[.8,2.9,0,.6,.5],[1.1,4.1,0,.42],[.75,5.1,0,.22],[.2,5.7,0,.03]],{radial:9,capStart:0})]),m:"skin"}]},mitt(){return[{g:ct(1,1.25,1.5,.9,0,1.1,0),m:"skin",fur:!0}]},none(){return[]}},xy={plant:{pts:[[0,0,0],[.03,-.24,.035],[.05,-.5,.075],[.04,-.74,.005],[.03,-.97,-.03]],r:[1,1.08,.72,.84,.48],bulge:[1,3]},digi:{pts:[[0,0,0],[.03,-.2,.1],[.05,-.42,.16],[.04,-.62,-.02],[.03,-.8,-.12],[.03,-.97,-.03]],r:[1.1,1.2,.8,.62,.42,.4],bulge:[1]},pillar:{pts:[[0,0,0],[.01,-.3,.01],[.02,-.6,.02],[.02,-.9,0]],r:[1.15,1.1,.95,.95],bulge:[1]},arm:{pts:[[0,0,0],[.05,-.22,-.01],[.08,-.46,-.03],[.09,-.7,.04],[.09,-.93,.11]],r:[.95,1.02,.7,.74,.5],bulge:[1,3]},insect:{pts:[[0,0,0],[.28,.2,0],[.5,.32,0],[.72,-.15,.02],[.88,-.65,.03],[.93,-.95,.03]],r:[.75,.62,.5,.42,.3,.16],bulge:[]}};function ch(n,e,t){return(i,s)=>{var P;let r=s.size,o=xy[n],a=r*.105*i.thick*s.limbMul,c=Math.cos(i.splay),h=Math.sin(i.splay),l=Math.cos(i.swing),u=Math.sin(i.swing),p=o.pts.map(([T,A,C])=>{C*=i.bend,n==="insect"&&(A=A>0?A*i.bend:A);let M=T*c-A*h,b=T*h+A*c,D=b*l+C*u,G=-b*u+C*l;return s.root.clone().addScaledVector(s.out,M*r).addScaledVector(Yt,D*r).addScaledVector(s.fwd,G*r)}).map((T,A)=>({p:T,rx:o.r[A]*a*(o.bulge.includes(A)?i.muscle:1)})),g=n==="insect",_=nn(p,{radial:16,sub:7,ridges:g?5:0,ridgeAmp:.1}),m=[{g:_,m:"skin",fur:g?.5:.75}],d=_.userData.end,x=d.r*i.end,v=(P=i.endType)!=null?P:t;s.anchors&&e===zd&&s.anchors.push({p:d.p.clone(),t:d.t.clone(),r:d.r*i.end});let y;if(e===Ca)y=rh(s.out.clone().multiplyScalar(x),Yt.clone().multiplyScalar(x),s.fwd.clone().multiplyScalar(x),d.p);else{let T=d.t.clone(),A=si(T,s.fwd),C=T.clone().cross(A);y=rh(C.multiplyScalar(x),T.multiplyScalar(x),A.multiplyScalar(x),d.p.clone().addScaledVector(d.t,-d.r*.4))}for(let T of e[v]())m.push({g:kd(T.g,y),m:T.m,fur:T.fur||0});return m}}function yy(n,e){let t=e.size,i=[],s=n.curl,r=t*.085*n.thick*e.limbMul;for(let c=0;c<=9;c++){let h=c/9,l=.5*Math.pow(h,.8)+s*.16*Math.sin(h*5+e.seed)*h,u=-.8*Math.pow(h,1.25)+s*.22*h*h*Math.sin(h*6.5),f=.14*Math.sin(h*7+e.seed*2)*h*s,p=Math.cos(n.splay),g=Math.sin(n.splay);i.push({p:e.root.clone().addScaledVector(e.out,(l*p-u*g)*t).addScaledVector(Yt,(l*g+u*p)*t).addScaledVector(e.fwd,f*t),rx:r*(Math.pow(1-h,.75)*.94+.06)})}let o=nn(i,{radial:12,sub:5}),a=[{g:o,m:"skin"}];if(e.anchors&&e.anchors.push({p:o.userData.end.p.clone(),t:o.userData.end.t.clone(),r:r*.5}),n.suckers>.5){let c=new Gi(i.map(l=>l.p)),h=[];for(let l=3;l<22;l++){let u=l/22,f=c.getPoint(u),p=c.getTangent(u),g=r*(Math.pow(1-u,.75)*.94+.06),_=si(p,e.out.clone().multiplyScalar(-1).add(ae(0,-.6,0))),m=ct(g*.36,1,1,1,0,0,0,8);m.translate(f.x+_.x*g*.85,f.y+_.y*g*.85,f.z+_.z*g*.85),h.push(m)}a.push({g:Oe(h),m:"membrane"})}return a}function ah(n){return(e,t)=>{let i=t.size,s=Math.cos(e.lift),r=Math.sin(e.lift),o=Math.cos(e.sweep),a=Math.sin(e.sweep),c=(l,u,f)=>{let p=l*s-u*r,g=l*r+u*s,_=p*o+f*a,m=-p*a+f*o;return t.root.clone().addScaledVector(t.out,_*i).addScaledVector(Yt,g*i).addScaledVector(t.fwd,m*i)},h=[];if(n==="bat"){let l=c(0,0,0),u=c(.33,.22,0),f=c(.6,.45,.06),p=[c(1.45,.5,-.1),c(1.25,-.02,-.38),c(.92,-.36,-.52),c(.55,-.45,-.55),c(.02,-.3,-.3)],g=[nn([{p:l,rx:i*.05},{p:u,rx:i*.036},{p:f,rx:i*.028}],{radial:8})],_=[];p.forEach((m,d)=>{if(d<4&&g.push(nn([{p:f,rx:i*.018},{p:f.clone().lerp(m,.5).addScaledVector(Yt,i*.03),rx:i*.013},{p:m,rx:i*.004}],{radial:6,capStart:0})),d>0){let x=[],v=[],y=d<4?f:u;for(let P=0;P<=8;P++){let T=P/8,A=p[d-1].clone().lerp(m,T);A.lerp(y,.2*Math.sin(T*qt)),x.push(y),v.push(A)}_.push(ps(x,v))}}),_.push(ps([l,l,l],[u,p[4].clone().lerp(u,.5),p[4]])),_.push(ps([f,f],[u,p[4]])),g.push(sn(f,c(.62,.62,.16),i*.02,{radial:5})),h.push({g:Oe(g),m:"skin"},{g:Oe(_),m:"membrane"})}else if(n==="feather"){let l=[c(0,0,0),c(.3,.16,.02),c(.62,.26,.06),c(.9,.2,.02)];h.push({g:nn(l.map((d,x)=>({p:d,rx:i*[.07,.06,.045,.03][x]})),{radial:8}),m:"skin",fur:!0});let u=new Gi(l),f=c(0,0,1).sub(c(0,0,0)).normalize(),p=[],g=[],_=(d,x,v,y,P,T)=>{let A=u.getPoint(d).addScaledVector(f,T*i),C=c(Math.sin(x),-Math.cos(x),-.18).sub(c(0,0,0)).normalize(),M=A.clone().addScaledVector(C,v*i);P.push(Pn([A,A.clone().lerp(M,.4),A.clone().lerp(M,.8),M],[y*i*.6,y*i,y*i*.9,y*i*.15],i*.006,f,{radial:6,sub:3}))},m=Math.round(e.feathers);for(let d=0;d<m;d++){let x=d/(m-1);_(.08+x*.92,fn(-.15,1.45,Math.pow(x,1.6)),fn(.5,.95,Math.sin(x*qt*.62)),.062,p,-.004*(d%2)),_(.05+x*.9,fn(-.1,1.2,Math.pow(x,1.6)),fn(.28,.4,x),.07,g,.012)}h.push({g:Oe(p),m:"hair"},{g:Oe(g),m:"skin"})}else{let l=[];for(let[u,f,p]of[[.2,1,.17],[.85,.72,.2]]){let g=_=>c(Math.cos(u)*_*f,.04*_,-Math.sin(u)*_*f);l.push(Pn([g(0),g(.35),g(.75),g(1)],[.03*i,p*i*.8,p*i,.02*i],i*.004,Yt,{radial:6,sub:4}))}h.push({g:Oe(l),m:"glass"})}return h}}function Ei(n){return(e,t)=>{let i=t.size,s=e.curl,r=t.normal,o=[],a=si(r,Yt),c=m=>n==="stinger"?t.root.clone().addScaledVector(r,i*.42*Math.sin(m*2.7*Math.abs(s||1))).addScaledVector(a,i*.4*(1-Math.cos(m*2.7*Math.abs(s||1)))*Math.sign(s||1)):t.root.clone().addScaledVector(r,i*m*(1-.3*Math.abs(s)*m)).addScaledVector(a,i*s*.65*m*m),h=Math.min(t.r*.8,i*.22)*e.thick,l={thin:m=>i*.035*e.thick*(1-m*.7),thick:m=>h*Math.pow(1-m,.9)+i*.006,fluffy:m=>i*.1*e.thick*(.35+1*Math.sin(Math.min(m*1.25,1)*qt*.8))*(m>.95?.5:1),club:m=>i*.05*e.thick*(1-m*.4),stinger:m=>i*.075*e.thick*(1-m*.45),fluke:m=>h*Math.pow(1-m,.7)*.9+i*.02,fishfin:m=>h*Math.pow(1-m,.7)*.9+i*.02,fan:m=>i*.05*(1-m*.5),tuft:m=>i*.03*e.thick*(1-m*.5)}[n],u=n==="fan"?.3:n==="fluke"||n==="fishfin"?.75:1,f=[];for(let m=0;m<=7;m++){let d=m/7;f.push({p:c(d*u),rx:Math.max(l(d),.003),ry:Math.max(l(d)*(n==="fishfin"?1.25:1),.003)})}let p=nn(f,{radial:12,sub:5,ridges:n==="stinger"?7:0,ridgeAmp:.12});o.push({g:p,m:"skin",fur:n==="fluffy"?1.6:n!=="stinger"&&n!=="fishfin"&&n!=="fluke"});let g=p.userData.end,_=g.t;if(n==="club"){let m=[];for(let d=0;d<12;d++){let x=ae(Math.sin(d*2.4)*Math.sqrt(1-(d/11*2-1)**2),d/11*2-1,Math.cos(d*2.4)*Math.sqrt(1-(d/11*2-1)**2));m.push(sn(g.p.clone().addScaledVector(x,i*.07),g.p.clone().addScaledVector(x,i*.17*e.tip),i*.03,{radial:6}))}o.push({g:Oe([ms(ct(i*.1*e.tip,1,1,1),g.p.x,g.p.y,g.p.z),...m]),m:"accent"})}else if(n==="stinger"){let m=g.p.clone().addScaledVector(_,i*.06);o.push({g:ms(ct(i*.075*e.tip,1,1,1),m.x,m.y,m.z),m:"skin"}),o.push({g:sn(m.clone().addScaledVector(_,i*.04),m.clone().addScaledVector(_,i*.2*e.tip).addScaledVector(a,-i*.1*e.tip*Math.sign(s||1)),i*.035*e.tip),m:"accent"})}else if(n==="fluke"||n==="fishfin"){let m=n==="fluke"?t.out:a,d=n==="fluke"?a:t.out,x=[];for(let v of[-1,1]){let y=g.p.clone().addScaledVector(_,-i*.08),P=g.p.clone().addScaledVector(_,i*.3*e.tip).addScaledVector(m,v*i*.36*e.tip);x.push(Pn([y,y.clone().lerp(P,.45).addScaledVector(_,i*.05),y.clone().lerp(P,.8),P],[i*.03,i*.11*e.tip,i*.08*e.tip,i*.01],i*.012,d,{radial:8}))}o.push({g:Oe(x),m:n==="fluke"?"skin":"membrane"})}else if(n==="fan"){let m=[],d=Math.round(e.count);for(let x=0;x<d;x++){let v=(x/(d-1)-.5)*e.spread*2,y=_.clone().multiplyScalar(Math.cos(v)).addScaledVector(t.out,Math.sin(v)).addScaledVector(a,s*.2).normalize(),P=g.p.clone().addScaledVector(y,i*(.8+.2*Math.cos(v*1.5)));m.push(Pn([g.p.clone().addScaledVector(_,-i*.1),g.p.clone().lerp(P,.4),g.p.clone().lerp(P,.82),P],[i*.02,i*.055,i*.07,i*.02],i*.005,a,{radial:6,sub:3}))}o.push({g:Oe(m),m:"hair"})}else if(n==="tuft"){let m=[];for(let d=0;d<14;d++){let x=_.clone().add(ae(Math.sin(d*2.4),Math.cos(d*1.7),Math.sin(d*.9)).multiplyScalar(.55)).normalize(),v=g.p.clone().addScaledVector(x,i*.24*e.tip);m.push(Pn([g.p.clone(),g.p.clone().lerp(v,.5),v],[i*.02,i*.035*e.tip,i*.004],i*.012,si(x,Yt),{radial:6,sub:3}))}o.push({g:Oe(m),m:"hair"})}return o}}function Ra(n){return(e,t)=>{let i=Math.round(e.count),s=[],r=[],o=[],a=[];for(let h=0;h<i;h++){let l=i===1?.5:h/(i-1),u=Wn(t.part.u+(l-.5)*e.span,-.6,1.6),f=sr(t.frames,u,t.a),p=t.size*Math.pow(Math.sin((l*.84+.08)*qt),.7),g=f.normal,_=f.tangent.clone().multiplyScalar(-1),m=f.pos.clone().addScaledVector(g,-p*.12);if(n==="spikes")s.push(sn(m,f.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean),p*.2,{radial:7}));else if(n==="plates"){let d=f.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean);s.push(Pn([m,m.clone().lerp(d,.45),m.clone().lerp(d,.8),d],[p*.3,p*.42,p*.3,p*.03],p*.05,si(g,f.tangent.clone().cross(g)),{radial:8}))}else if(n==="mane")for(let d=0;d<3;d++){let x=si(g,Cn).multiplyScalar((d-1)*.7+(t.rnd()-.5)*.4),v=g.clone().add(x).addScaledVector(_,e.lean).normalize(),y=m.clone().addScaledVector(v,p*.45),P=y.clone().addScaledVector(v,p*.3).addScaledVector(Yt,-p*.45*e.droop).addScaledVector(x,p*.3);r.push(Pn([m,y,P],[p*.09,p*.11,p*.01],p*.025,si(v,_),{radial:6,sub:3}))}else{let d=f.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean);s.push(sn(m,d,p*.035,{radial:5})),o.push(m.clone().lerp(d,.94)),a.push(m)}}let c=[];if(s.length&&c.push({g:Oe(s),m:"accent"}),n==="mane"&&c.push({g:Oe(r),m:"hair"}),o.length>1){let h=[],l=[];for(let u=0;u<o.length-1;u++)for(let f=0;f<4;f++){let p=f/4,g=Wn(t.part.u+((u+p)/(i-1)-.5)*e.span,-.6,1.6);h.push(sr(t.frames,g,t.a).pos),l.push(o[u].clone().lerp(o[u+1],p).lerp(h[h.length-1],.12*Math.sin(p*qt)))}h.push(a[i-1]),l.push(o[i-1]),c.push({g:ps(h,l),m:"membrane"})}return c}}var hh={thick:[.4,2.2,1,"Thickness"],muscle:[.7,1.6,1,"Muscle"],splay:[-.3,1.3,.05,"Spread"],swing:[-1.4,1.4,0,"Swing"],yaw:[-1.6,1.6,0,"Turn"],bend:[-.5,2.5,1,"Bend"],end:[.5,2.2,1,"Foot size"]},vy={...hh,end:[.5,2.2,1,"Hand size"]},Hd=["human","paw","hoof","talon","webbed","stump","point","none"],by=["human","claw","pincer","mitt","none"],gs={thick:[.3,2.5,1,"Thickness"],curl:[-1.2,1.2,.2,"Curl"]},or=(n,e,t,i={})=>({n,cat:"limbs",kind:"world",slot:"leg",rel:1,mirror:!0,P:hh,C:{endType:Hd},D:{endType:t,...i},build:ch(e,Ca,t)}),lh=(n,e,t={})=>({n,cat:"limbs",kind:"world",slot:"arm",rel:.85,mirror:!0,P:vy,C:{endType:by},D:{endType:e,...t},build:ch("arm",zd,e)}),_s=(n,e,t={})=>({n,cat:"eyes",kind:"surface",slot:"eye",size:.55,mirror:!0,P:e==="compound"||e==="beady"?{}:sy,build:iy(e),...t}),Wi={len:[.4,2.5,1,"Length"],curve:[-1.5,2,1,"Curve"]},Pt={eye_round:_s("Round eye","round"),eye_cat:_s("Slit eye","cat"),eye_goat:_s("Bar-pupil eye","goat"),eye_glow:_s("Glowing eye","glow"),eye_beady:_s("Beady eye","beady",{size:.3}),eye_compound:_s("Compound eye","compound",{size:.8}),eye_stalk:_s("Stalk eye","stalk",{size:.45}),muzzle:{n:"Muzzle",cat:"mouth",kind:"surface",slot:"mouth",size:1.25,P:{len:[.3,2.5,1,"Length"],open:[0,1,.15,"Open"],teeth:[0,3,1,"Teeth"]},build:ry},beak:{n:"Beak",cat:"mouth",kind:"surface",slot:"mouth",size:1.2,P:{len:[.4,3.5,1,"Length"],hook:[0,1.5,.5,"Hook"],open:[0,1,.1,"Open"]},build:oy},mandibles:{n:"Mandibles",cat:"mouth",kind:"surface",slot:"mouth",size:1.2,P:{len:[.5,2,1,"Length"],open:[0,1,.3,"Open"]},build:ay},maw:{n:"Round maw",cat:"mouth",kind:"surface",slot:"mouth",size:1.1,P:{teeth:[.3,2.5,1,"Teeth"],count:[5,18,11,"Tooth count"]},build:ly},lips:{n:"Lips",cat:"mouth",kind:"surface",slot:"mouth",size:.85,P:{full:[.3,2,1,"Fullness"],smile:[-1,1,.25,"Frown / smile"]},build:cy},trunk:{n:"Trunk",cat:"mouth",kind:"surface",slot:"mouth",size:.9,P:{len:[.4,2,1,"Length"],curl:[-1,1.5,.4,"Curl"]},build:hy},feelers:{n:"Face feelers",cat:"mouth",kind:"surface",slot:"mouth",size:1.1,P:{len:[.4,2.5,1,"Length"],count:[2,8,4,"Count"]},build:uy},nose:{n:"Nose",cat:"mouth",kind:"surface",slot:"nose",size:.55,P:{len:[.4,2.2,1,"Length"],wide:[.5,1.8,1,"Width"]},build:dy},whiskers:{n:"Whiskers",cat:"mouth",kind:"surface",slot:"cheek",size:.9,mirror:!0,P:{len:[.4,2,1,"Length"]},build:py},tusk:{n:"Tusk",cat:"mouth",kind:"surface",slot:"cheek",size:.7,mirror:!0,orn:!0,P:Wi,build:rr("tusk")},beard:{n:"Beard",cat:"mouth",kind:"surface",slot:"chin",size:.9,P:{len:[.3,3,1,"Length"],count:[6,60,26,"Thickness"]},build:oh({count:26,spread:.7,droop:1,width:.11,capR:.6})},ear_point:{n:"Pointed ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:$r("point")},ear_round:{n:"Round ear",cat:"ears",kind:"surface",slot:"ear",size:.9,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:$r("round")},ear_long:{n:"Long ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:$r("long")},ear_floppy:{n:"Floppy ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:$r("floppy")},ear_elf:{n:"Swept ear",cat:"ears",kind:"surface",slot:"earSide",size:.75,mirror:!0,P:{len:[.2,2.5,.6,"Length"],wide:[.4,2,1,"Width"]},build:$r("elf")},ear_fin:{n:"Fin ear",cat:"ears",kind:"surface",slot:"earSide",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"]},build:fy},horn_spike:{n:"Spike horn",cat:"horns",kind:"surface",slot:"horn",size:.7,mirror:!0,orn:!0,P:Wi,build:rr("spike")},horn_curved:{n:"Curved horn",cat:"horns",kind:"surface",slot:"horn",size:.75,mirror:!0,orn:!0,P:Wi,build:rr("curved")},horn_ram:{n:"Ram horn",cat:"horns",kind:"surface",slot:"horn",size:.8,mirror:!0,orn:!0,P:Wi,build:rr("ram")},antler:{n:"Antler",cat:"horns",kind:"surface",slot:"horn",size:.7,mirror:!0,orn:!0,P:{...Wi,tines:[1,6,3,"Tines"]},build:rr("antler")},antenna:{n:"Antenna",cat:"horns",kind:"surface",slot:"horn",size:1.2,mirror:!0,P:Wi,build:Bd(!1)},antenna_feather:{n:"Feathery antenna",cat:"horns",kind:"surface",slot:"horn",size:1.2,mirror:!0,orn:!0,P:Wi,build:Bd(!0)},crest:{n:"Feather crest",cat:"horns",kind:"surface",slot:"top",size:1.3,orn:!0,P:{len:[.3,3,1,"Length"],count:[3,30,9,"Feathers"],spread:[.1,1.4,.45,"Spread"],droop:[0,1,.1,"Droop"]},build:oh({count:9,spread:.45,droop:.1,width:.12,capR:.3})},hair:{n:"Hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.15,2.5,.7,"Length"],count:[20,200,110,"Thickness"],spread:[.5,1.9,1.45,"Coverage"],droop:[0,1,.85,"Droop"]},build:oh({count:110,spread:1.45,droop:.85,width:.085,capR:.5,hug:!0})},leg_human:or("Walker leg","plant","human"),leg_beast:or("Beast leg","digi","paw"),leg_hoof:or("Hoofed leg","digi","hoof",{thick:.8}),leg_bird:or("Taloned leg","digi","talon",{thick:.6,end:1.3}),leg_frog:or("Webbed leg","plant","webbed",{bend:2,end:1.3}),leg_pillar:or("Pillar leg","pillar","stump",{thick:1.5}),leg_insect:{n:"Jointed leg",cat:"limbs",kind:"world",slot:"leg",rel:1.25,mirror:!0,radial:!0,P:{...hh,thick:[.3,2.2,.55,"Thickness"]},C:{endType:Hd},D:{endType:"point",thick:.55,splay:0},build:ch("insect",Ca,"point")},arm_human:lh("Arm with hand","human"),arm_claw:lh("Clawed arm","claw"),arm_pincer:lh("Pincer arm","pincer",{splay:.5,swing:.9}),tentacle:{n:"Tentacle",cat:"limbs",kind:"world",slot:"arm",rel:1.3,mirror:!0,radial:!0,P:{thick:[.4,2.2,1,"Thickness"],curl:[0,2,1,"Wiggle"],splay:[-.6,1.4,.1,"Spread"],yaw:[-1.6,1.6,0,"Turn"],suckers:[0,1,1,"Suckers"]},build:yy},wing_feather:{n:"Feathered wing",cat:"wings",kind:"world",slot:"wing",rel:1.3,mirror:!0,P:{lift:[-1.2,1.3,.25,"Lift"],sweep:[-.6,1.4,.3,"Sweep"],feathers:[5,16,11,"Feathers"]},build:ah("feather")},wing_bat:{n:"Skin wing",cat:"wings",kind:"world",slot:"wing",rel:1.3,mirror:!0,P:{lift:[-1.2,1.3,.3,"Lift"],sweep:[-.6,1.4,.25,"Sweep"]},build:ah("bat")},wing_insect:{n:"Glass wing",cat:"wings",kind:"world",slot:"wing",rel:1.2,mirror:!0,P:{lift:[-1.2,1.3,.35,"Lift"],sweep:[-.6,1.4,.2,"Sweep"]},build:ah("insect")},fin_dorsal:{n:"Back fin",cat:"wings",kind:"surface",slot:"back",size:1.3,P:{len:[.4,2.5,1,"Height"],sweep:[-.5,2,1,"Sweep"]},build:gy},fin_side:{n:"Flipper",cat:"wings",kind:"surface",slot:"arm",size:1.5,mirror:!0,P:{len:[.4,2.5,1,"Length"],sweep:[-.5,2,1,"Sweep"]},build:_y},tail_thin:{n:"Whip tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:gs,build:Ei("thin")},tail_thick:{n:"Heavy tail",cat:"tails",kind:"world",slot:"tail",rel:1.2,P:gs,build:Ei("thick")},tail_fluffy:{n:"Bushy tail",cat:"tails",kind:"world",slot:"tail",rel:.9,P:gs,build:Ei("fluffy")},tail_tuft:{n:"Tufted tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:{...gs,tip:[.4,2.5,1,"Tuft size"]},build:Ei("tuft")},tail_club:{n:"Club tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:{...gs,tip:[.4,2.5,1,"Club size"]},build:Ei("club")},tail_stinger:{n:"Stinger tail",cat:"tails",kind:"world",slot:"tail",rel:1.3,P:{thick:[.3,2.5,1,"Thickness"],curl:[-1.2,1.2,1,"Curl"],tip:[.4,2.5,1,"Stinger size"]},build:Ei("stinger")},tail_fluke:{n:"Fluke tail",cat:"tails",kind:"world",slot:"tail",rel:.9,P:{...gs,tip:[.4,2.5,1,"Fluke size"]},D:{curl:0},build:Ei("fluke")},tail_fish:{n:"Fish tail",cat:"tails",kind:"world",slot:"tail",rel:.8,P:{...gs,tip:[.4,2.5,1,"Fin size"]},D:{curl:0},build:Ei("fishfin")},tail_fan:{n:"Feather fan",cat:"tails",kind:"world",slot:"tail",rel:.8,orn:!0,P:{curl:[-1.2,1.5,.3,"Lift"],count:[3,21,9,"Feathers"],spread:[.1,1.5,.6,"Spread"]},build:Ei("fan")},ridge_spikes:{n:"Spike row",cat:"back",kind:"world",slot:"back",rel:.22,ridge:!0,P:{count:[1,24,9,"Count"],span:[.05,1.6,.6,"Row length"],lean:[-1,1.5,.3,"Lean"]},build:Ra("spikes")},ridge_plates:{n:"Plate row",cat:"back",kind:"world",slot:"back",rel:.3,ridge:!0,P:{count:[1,20,8,"Count"],span:[.05,1.6,.6,"Row length"],lean:[-1,1.5,.1,"Lean"]},build:Ra("plates")},ridge_sail:{n:"Sail",cat:"back",kind:"world",slot:"back",rel:.45,ridge:!0,P:{count:[3,20,9,"Spines"],span:[.05,1.6,.55,"Row length"],lean:[-1,1.5,.2,"Lean"]},build:Ra("sail")},ridge_mane:{n:"Mane",cat:"back",kind:"world",slot:"mane",rel:.4,ridge:!0,orn:!0,P:{count:[3,30,14,"Thickness"],span:[.05,1.6,.3,"Row length"],lean:[-1,1.5,.5,"Sweep"],droop:[0,2,1,"Droop"]},build:Ra("mane")},spike:{n:"Single spike",cat:"back",kind:"surface",slot:"back",size:.5,P:Wi,build:rr("spike")},shell:{n:"Shell",cat:"back",kind:"surface",slot:"back",size:2.4,P:{dome:[.2,1.5,.55,"Dome"],long:[.6,2.2,1.35,"Length"]},build:my}},Pa=[["eyes","Eyes"],["mouth","Mouth"],["ears","Ears"],["horns","Head"],["limbs","Limbs"],["wings","Wings"],["tails","Tails"],["back","Back"]];function Ia(n){let e=Pt[n],t={};for(let[i,s]of Object.entries(e.P||{}))t[i]=s[2];return Object.assign(t,e.D||{})}var Ht=Math.PI,Xi=n=>({base:"#c9b08a",second:"#6b4a2e",belly:"#efe2c8",bellyAmt:.8,pattern:0,patScale:1,cover:"skin",furLen:.3,furDroop:.3,accent:"#e8e0cc",hair:"#3b2a1e",membrane:"#c98a8a",eye:"#3f8f4a",...n}),At={humanoid:{name:"Humanoid",blurb:"Upright, two arms, two legs",limbLen:.9,bellyDir:[0,-.2,1],dimorph:"std",capS:.55,nodes:[[.93,-.012,.15,.1,"hips"],[1.03,-.01,.16,.105,"hips"],[1.17,0,.118,.088,"waist"],[1.33,.012,.15,.115,"chest"],[1.45,.005,.17,.105,"shoulders"],[1.505,0,.13,.085,"shoulders"],[1.55,0,.06,.058,"neck"],[1.615,.008,.058,.058,"neck"],[1.675,.022,.102,.108,"head"],[1.765,.03,.128,.135,"head"],[1.85,.022,.118,.126,"head"]],slots:{eye:[.893,2.74],mouth:[.812,Ht],nose:[.858,Ht],cheek:[.83,2.45],chin:[.79,Ht],ear:[1.35,1.1],earSide:[.885,1.57],horn:[1.4,2.1],top:[1.85,0],leg:[-.4,1.57],arm:[.43,1.57],wing:[.4,.45],tail:[.03,0],back:[.3,0],mane:[.6,0]},look:Xi({base:"#c99573",second:"#8a5a3c",belly:"#d9a888",bellyAmt:.4,hair:"#2c1b12",eye:"#4a7fb5"}),parts:[["leg_human","leg",{size:.9}],["arm_human","arm",{size:.74,p:{splay:.12}}],["eye_round","eye",{size:.058,p:{lid:.28,iris:.85}}],["nose","nose",{size:.042}],["lips","mouth",{size:.07}],["ear_elf","earSide",{size:.08,p:{len:.25}}],["hair","top",{size:.3,p:{len:.6}}]]},quadruped:{name:"Quadruped",blurb:"Four legs, tail, muzzle",limbLen:.85,bellyDir:[0,-1,0],dimorph:"std",nodes:[[.95,-.62,.15,.17,"hips"],[.98,-.36,.2,.23,"hips"],[.96,0,.195,.235,"waist"],[.99,.34,.21,.27,"chest"],[1.06,.55,.17,.22,"shoulders"],[1.25,.74,.115,.135,"neck"],[1.39,.9,.125,.13,"head"],[1.38,1.03,.105,.105,"head"]],slots:{eye:[.93,.95],mouth:[1.85,Ht],nose:[1.9,0],cheek:[1.35,1.9],chin:[.95,Ht],ear:[.85,.6],earSide:[.86,1.2],horn:[.9,.3],top:[.86,0],leg:[.3,2.1],arm:[.56,1.5],wing:[.5,.55],tail:[-.8,0],back:[.35,0],mane:[.68,0]},look:Xi({base:"#b9773a",second:"#3a2616",belly:"#f3e6d0",cover:"fur",furLen:.3,pattern:5,hair:"#3a2616",eye:"#d9a020"}),parts:[["leg_beast",[.12,2.1],{size:.84}],["leg_beast",[.53,2.1],{size:.86,p:{bend:.45,thick:.9}}],["muzzle","mouth"],["eye_cat","eye"],["ear_point","ear"],["tail_fluffy","tail",{p:{curl:-.35}}],["whiskers","cheek"]]},avian:{name:"Avian",blurb:"Wings, beak, talons",limbLen:.7,bellyDir:[0,-.8,.6],dimorph:"std",nodes:[[.76,-.32,.07,.07,"hips"],[.8,-.1,.17,.17,"hips"],[.92,.1,.19,.2,"chest"],[1.1,.22,.12,.125,"neck"],[1.3,.26,.075,.075,"neck"],[1.42,.3,.1,.1,"head"],[1.44,.38,.085,.085,"head"]],slots:{eye:[.9,1.25],mouth:[1.85,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.85,Ht],ear:[.86,.6],earSide:[.86,1.2],horn:[.92,.5],top:[.9,0],leg:[.22,2.35],arm:[.36,1.5],wing:[.38,.85],tail:[-.85,0],back:[.25,0],mane:[.55,0]},look:Xi({base:"#2f7fc2",second:"#f2c230",belly:"#f4f0e6",cover:"fur",furLen:.12,pattern:5,accent:"#e8a020",hair:"#1f4f9a",eye:"#e8a020"}),parts:[["leg_bird","leg",{size:.74}],["wing_feather","wing",{size:.95}],["beak","mouth"],["eye_round","eye",{p:{lid:.15}}],["crest","top",{sexOnly:null}],["tail_fan","tail",{size:.6}]]},insectoid:{name:"Insectoid",blurb:"Six legs, antennae, chitin",limbLen:.72,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[.5,-.78,.1,.1,"abdomen"],[.56,-.5,.26,.24,"abdomen"],[.53,-.2,.2,.18,"abdomen"],[.5,-.02,.07,.07,"waist"],[.55,.15,.16,.15,"chest"],[.56,.38,.15,.14,"chest"],[.56,.5,.06,.06,"neck"],[.58,.62,.14,.13,"head"],[.56,.74,.1,.1,"head"]],slots:{eye:[.93,1.1],mouth:[1.8,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Ht],ear:[.9,.8],earSide:[.9,1.3],horn:[.97,.45],top:[.9,0],leg:[.56,2],arm:[.64,1.7],wing:[.56,.5],tail:[-.9,0],back:[.15,0],mane:[.55,0]},look:Xi({base:"#2f6b3a",second:"#12281a",belly:"#9fb86a",bellyAmt:.5,cover:"chitin",pattern:7,accent:"#1c1a14",membrane:"#bfe8e0",eye:"#b03020"}),parts:[["leg_insect",[.47,2],{size:.72,p:{yaw:-.7}}],["leg_insect",[.56,2],{size:.68,p:{yaw:0}}],["leg_insect",[.64,2],{size:.7,p:{yaw:.75}}],["eye_compound","eye"],["mandibles","mouth",{size:.13}],["antenna","horn"],["wing_insect","wing",{size:.95}]]},arachnid:{name:"Arachnid",blurb:"Eight legs, many eyes",limbLen:1,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[.62,-.62,.14,.14,"abdomen"],[.7,-.36,.32,.3,"abdomen"],[.6,-.08,.2,.18,"abdomen"],[.5,.05,.08,.07,"waist"],[.5,.25,.22,.15,"chest"],[.5,.45,.17,.12,"head"],[.48,.55,.1,.08,"head"]],slots:{eye:[1.3,.6],mouth:[1.85,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Ht],ear:[.9,.8],earSide:[.9,1.3],horn:[.9,.45],top:[.85,0],leg:[.7,1.9],arm:[.85,1.7],wing:[.66,.5],tail:[-.9,0],back:[.18,0],mane:[.5,0]},look:Xi({base:"#3a2a22",second:"#c8501c",belly:"#5a463a",bellyAmt:.4,cover:"fur",furLen:.1,pattern:7,accent:"#14100e",eye:"#a01818"}),parts:[["leg_insect",[.6,1.9],{size:1,p:{yaw:-1}}],["leg_insect",[.66,1.9],{size:.9,p:{yaw:-.35}}],["leg_insect",[.72,1.9],{size:.9,p:{yaw:.3}}],["leg_insect",[.78,1.9],{size:1.05,p:{yaw:.95}}],["eye_beady",[1.35,.5],{size:.045}],["eye_beady",[1.3,1.15],{size:.03}],["eye_beady",[.97,.5],{size:.032}],["eye_beady",[.95,1],{size:.026}],["mandibles","mouth",{size:.12}]]},cephalopod:{name:"Cephalopod",blurb:"Soft mantle, eight tentacles",limbLen:1.1,bellyDir:[0,-.5,-.8],dimorph:"reverse",nodes:[[1.78,-.52,.07,.07,"abdomen"],[1.56,-.38,.24,.22,"abdomen"],[1.26,-.2,.3,.28,"abdomen"],[.97,-.05,.215,.215,"waist"],[.77,.02,.225,.215,"head"],[.62,.05,.19,.19,"head"]],slots:{eye:[.86,1.4],mouth:[2,0],nose:[.8,0],cheek:[.9,.8],chin:[1.2,0],ear:[.7,1.2],earSide:[.7,1.5],horn:[.72,.6],top:[.3,Ht],leg:[1.45,1.57],arm:[1.45,1],wing:[.3,1.57],tail:[-.9,0],back:[.3,Ht],mane:[.4,Ht]},look:Xi({base:"#c4472e",second:"#f0b090",belly:"#f2d6c4",bellyAmt:.7,cover:"slime",pattern:2,patScale:1.6,membrane:"#f2c4b0",eye:"#e0b030"}),parts:[["tentacle",[1.45,.38],{size:1.15}],["tentacle",[1.45,1.15],{size:1.05}],["tentacle",[1.45,1.95],{size:1.05}],["tentacle",[1.45,2.75],{size:1.15}],["eye_goat","eye",{p:{lid:.2}}]]},serpent:{name:"Serpent",blurb:"Long limbless body",limbLen:.5,bellyDir:[0,-1,0],dimorph:"std",nodes:[[.05,-1.75,.025,.025,"tail"],[.09,-1.35,.07,.07,"tail"],[.11,-.9,.1,.1,"hips"],[.12,-.4,.115,.115,"waist"],[.13,.1,.12,.12,"waist"],[.22,.5,.115,.115,"chest"],[.56,.74,.105,.105,"neck"],[.9,.8,.095,.1,"neck"],[1.09,.93,.125,.1,"head"],[1.07,1.1,.1,.075,"head"]],slots:{eye:[.96,.95],mouth:[1.8,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.97,Ht],ear:[.92,.7],earSide:[.92,1.3],horn:[.95,.45],top:[.93,0],leg:[.45,2.1],arm:[.72,1.7],wing:[.68,.6],tail:[-.9,0],back:[.5,0],mane:[.8,0]},look:Xi({base:"#4f8a3a",second:"#1f3a1c",belly:"#e6dfa0",cover:"scales",pattern:1,eye:"#e8c020"}),parts:[["muzzle","mouth",{size:.13,p:{len:.7,teeth:1.8,open:.35}}],["eye_cat","eye",{size:.05}],["ridge_spikes",[.6,0],{size:.07,p:{count:16,span:.7}}]]},aquatic:{name:"Aquatic",blurb:"Fins, flippers, fish tail",limbLen:.5,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[1,-1,.03,.07,"tail"],[1,-.6,.08,.15,"tail"],[1,-.1,.17,.26,"abdomen"],[1.02,.35,.19,.28,"chest"],[1,.7,.15,.2,"head"],[.98,.95,.09,.11,"head"]],slots:{eye:[.9,1.15],mouth:[1.75,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Ht],ear:[.85,.7],earSide:[.85,1.3],horn:[.9,.45],top:[.85,0],leg:[.4,2.3],arm:[.64,2],wing:[.5,.6],tail:[-.8,0],back:[.52,0],mane:[.7,0]},look:Xi({base:"#3a7f9a",second:"#1c3f5a",belly:"#eef2f0",cover:"scales",pattern:5,membrane:"#7fc4d0",eye:"#e8e0a0"}),parts:[["muzzle","mouth",{size:.13,p:{len:.45,teeth:1.6,open:.3}}],["eye_round","eye",{size:.06,p:{lid:0}}],["fin_dorsal","back",{size:.32}],["fin_side","arm",{size:.3}],["tail_fish","tail",{size:.5,p:{tip:1.3}}]]}};var My=1,Sy=()=>"p"+My+++Math.random().toString(36).slice(2,6),wy={std:{m:{roles:{shoulders:[.16,.08],chest:[.1,.05],neck:[.2,.16],waist:[.04,.02],head:[.03,.03]},limb:.15,orn:.3,all:.03},f:{roles:{shoulders:[-.1,-.05],chest:[-.04,.07],waist:[-.14,-.08],hips:[.13,.07],neck:[-.13,-.1]},limb:-.1,orn:-.4,all:-.02}},reverse:{m:{roles:{abdomen:[-.12,-.12],head:[.05,.05]},limb:-.05,orn:.35,all:-.05},f:{roles:{abdomen:[.2,.18]},limb:.05,orn:-.3,all:.04}}};function Gd(n){let e=wy[At[n.type].dimorph][n.sex],t=n.dimorph;return{roles:e.roles,k:t,limb:1+e.limb*t,orn:1+e.orn*t,all:1+e.all*t}}function xs(n){let e=At[n],t={v:1,name:"New "+e.name,type:n,sex:"f",dimorph:.7,bulk:1,stretch:1,nodes:e.nodes.map(s=>({y:s[0],z:s[1],rx:s[2],ry:s[3],role:s[4]})),look:{...e.look},parts:[]},i=La(t,{sexless:!0}).userData.frames;for(let[s,r,o]of e.parts)ri(t,s,i,typeof r=="string"?e.slots[r]:r,o);return t}function ri(n,e,t,i,s={}){let r=Pt[e],o=At[n.type],[a,c]=i||o.slots[r.slot]||o.slots.back;for(;!i&&n.parts.some(u=>Math.abs(u.u-a)<.02&&Math.abs(u.a-c)<.05&&Pt[u.kind].cat===r.cat);)a-=.07;let h=sr(t,a,c),l={id:Sy(),kind:e,u:a,a:c,mirror:!!r.mirror,rot:0,tilt:0,sexOnly:null,size:r.kind==="surface"?r.size*h.r:r.rel*(r.ridge?Math.max(h.r,.08)*4.5:o.limbLen),p:Ia(e)};s.p&&Object.assign(l.p,s.p);for(let u of["size","rot","tilt","sexOnly","mirror"])s[u]!==void 0&&(l[u]=s[u]);return n.parts.push(l),l}function La(n,e={}){var o;let t=Gd(n),i=n.nodes.reduce((a,c)=>a+c.y,0)/n.nodes.length,s=n.nodes.reduce((a,c)=>a+c.z,0)/n.nodes.length,r=n.nodes.map(a=>{let c=!e.sexless&&t.roles[a.role]||[0,0];return{p:ae(0,i+(a.y-i)*n.stretch,s+(a.z-s)*n.stretch),rx:a.rx*n.bulk*(e.sexless?1:t.all)*(1+c[0]*t.k),ry:a.ry*n.bulk*(e.sexless?1:t.all)*(1+c[1]*t.k)}});return nn(r,{radial:52,sub:10,capRings:7,side:Cn.clone(),frames:!0,capStart:(o=At[n.type].capS)!=null?o:1})}function Vd(n,e,t){let i=new Map;for(let r of n){if(!r||!r.g)continue;let o=typeof r.m=="string"?e[r.m]:r.m,a=o.uuid+(r.fur||0);i.has(a)||i.set(a,{mat:o,fur:r.fur,gs:[]}),i.get(a).gs.push(r.g)}let s=[];for(let r of i.values()){let o=new De(Oe(r.gs),r.mat);o.userData.fur=r.mat===e.skin?r.fur===!0?1:r.fur||0:0,o.castShadow=r.mat!==e.glass,o.receiveShadow=r.mat===e.skin,s.push(o)}return s}function dh(n){let e=(n.a%(2*Math.PI)+2*Math.PI)%(2*Math.PI);return n.mirror?(e>Math.PI&&(e=2*Math.PI-e),e<.1?{a:0,mirrored:!1}:e>Math.PI-.1?{a:Math.PI,mirrored:!1}:{a:e,mirrored:!0}):{a:e,mirrored:!1}}function uh(n,e){let t=n.geometry;if(!e){t.setAttribute("rp",t.attributes.position),t.setAttribute("rn",t.attributes.normal);return}let i=t.attributes.position.clone().applyMatrix4(e),s=t.attributes.normal.clone().applyNormalMatrix(new Fe().getNormalMatrix(e));t.setAttribute("rp",i),t.setAttribute("rn",s)}function Wd(n,e,t,i,s,r){let o=Pt[e.kind],a=Gd(n),c=new Et;if(c.userData.partId=e.id,e.sexOnly&&e.sexOnly!==n.sex)return c;let{a:h,mirrored:l}=dh(e),u=sr(t,e.u,h),f=[...e.id].reduce((x,v)=>x*31+v.charCodeAt(0)|0,7),p={M:i,look:n.look,female:n.sex==="f",k:a.k,limbMul:a.limb,rnd:Zr(f),seed:f%100/16,part:e,frames:t,a:h,r:u.r,normal:u.normal},g=o.orn?a.orn:1,_=s?[]:null;p.anchors=_;let m=new Et;if(c.userData.anchor=u.pos.clone(),o.kind==="surface"){let x=u.normal,v=Math.abs(x.y)<.9?Yt.clone():x.y>0?ir.clone().multiplyScalar(-1):ir.clone(),y=v.addScaledVector(x,-v.dot(x)).normalize(),P=y.clone().cross(x),T=new Wt().setFromRotationMatrix(new Ge().makeBasis(P,y,x));T.multiply(new Wt().setFromAxisAngle(ir,e.rot)).multiply(new Wt().setFromAxisAngle(Cn,-e.tilt));let A=T.clone().invert();p.down=ae(0,-1,0).applyQuaternion(A),p.up=ae(0,1,0).applyQuaternion(A),p.fwd=ae(0,0,1).applyQuaternion(A);for(let C of Vd(o.build(e.p,p),i))m.add(C);m.quaternion.copy(T),m.position.copy(u.pos),m.scale.setScalar(e.size*g),m.updateMatrix();for(let C of m.children)C.material===i.skin&&uh(C,m.matrix)}else{p.size=e.size*g;let x=e.p.yaw||0,v=Cn.clone();o.radial&&(v=ae(u.normal.x,0,u.normal.z),v.lengthSq()<.01&&(v=Cn.clone()),v.normalize()),v.applyAxisAngle(Yt,-x),p.out=v,p.fwd=v.clone().cross(Yt).normalize(),p.root=o.ridge?u.pos:u.pos.clone().addScaledVector(u.normal,-u.r*(o.cat==="limbs"?.4:.25));for(let y of Vd(o.build(e.p,p),i))m.add(y),y.material===i.skin&&uh(y);o.ridge||(m.userData.joint={pivot:p.root.clone(),kind:o.cat==="limbs"?e.kind.startsWith("leg")?"leg":e.kind==="tentacle"?"tentacle":"arm":o.cat==="wings"?"wing":"tail",partId:e.id,side:1})}c.add(m);let d=null;if(l){let x=new Et;x.scale.x=-1,d=m.clone(),m.userData.joint&&(d.userData.joint={...m.userData.joint,side:-1}),x.add(d),c.add(x)}if(r&&m.userData.joint)for(let x of[m,d])x&&r.n<Ta&&(x.userData.joint.bone=r.n++);if(_)for(let x of _)s.push({...x,node:m}),d&&s.push({...x,node:d});return c}function ar(n,e,t={}){let i=new Et,s=La(n),r=s.userData.frames,o=new De(s,e.skin),a=t.animated?{n:1}:null;o.castShadow=o.receiveShadow=!0,uh(o),o.userData.fur=1,o.userData.partId="body",i.add(o);let c={group:i,body:o,frames:r,parts:new Map,shells:new Et,data:n,M:e};for(let h of n.parts){let l;try{l=Wd(n,h,r,e,t.anchors,a)}catch(u){console.error("part failed",h.kind,u),l=new Et,l.userData.partId=h.id}c.parts.set(h.id,l),i.add(l)}return i.add(c.shells),Jr(c),c}function Da(n,e){let t=n.parts.get(e.id);t&&(n.group.remove(t),Yi(t));let i=Wd(n.data,e,n.frames,n.M);return n.parts.set(e.id,i),n.group.add(i),i}function Jr(n,e){for(let s of[...n.shells.children])n.shells.remove(s);if(n.shellGeo&&(n.shellGeo.dispose(),n.shellGeo=null),n.data.look.cover!=="fur")return;n.group.updateMatrixWorld(!0);let t=[],i=n.group.matrixWorld.clone().invert();if(n.group.traverse(s=>{if(!s.isMesh||!s.userData.fur)return;let r=s,o=!1;for(;r;)e&&r.userData.partId===e&&(o=!0),r=r.parent;if(o)return;let a=0;for(let l=s.parent;l&&l!==n.group;l=l.parent)l.userData.joint&&l.userData.joint.bone&&(a=l.userData.joint.bone);let c=i.clone().multiply(s.matrixWorld),h=s.geometry.clone();h.deleteAttribute("rp"),h.deleteAttribute("rn"),h.applyMatrix4(c),c.determinant()<0&&Fd(h),h.setAttribute("bone",new _t(new Float32Array(h.attributes.position.count).fill(a),1)),h.setAttribute("fur",new _t(new Float32Array(h.attributes.position.count).fill(s.userData.fur),1)),t.push(h)}),!!t.length){n.shellGeo=Oe(t,["fur","bone"]),n.shellGeo.setAttribute("rp",n.shellGeo.attributes.position),n.shellGeo.setAttribute("rn",n.shellGeo.attributes.normal),t.forEach(s=>s!==n.shellGeo&&s.dispose());for(let s=0;s<Ea;s++){let r=new De(n.shellGeo,n.M.shells[s]);r.frustumCulled=!1,r.raycast=()=>{},n.shells.add(r)}}}function Yi(n){n.traverse(e=>{e.isMesh&&e.geometry.dispose()})}function Kr(n){let e=new Sn;return n.group.updateMatrixWorld(!0),n.group.traverse(t=>{t.isMesh&&t.parent!==n.shells&&(t.geometry.computeBoundingBox(),e.union(t.geometry.boundingBox.clone().applyMatrix4(t.matrixWorld)))}),e}var Xd={muzzle:n=>{var e;return 5+2.5*((e=n.teeth)!=null?e:1)},beak:n=>{var e;return 6+1.5*((e=n.hook)!=null?e:.5)},mandibles:()=>7,maw:n=>{var e;return 4+2.5*((e=n.teeth)!=null?e:1)},trunk:()=>3,feelers:()=>2,lips:()=>1,tusk:()=>5,horn_spike:()=>4,horn_curved:()=>5,horn_ram:()=>6,antler:()=>5,tentacle:()=>3,tail_club:()=>7,tail_stinger:()=>5,tail_thick:()=>3,spike:()=>2},Ey={claw:4,talon:4,pincer:6,paw:2.5,hoof:3,human:3,point:2.5,webbed:2,stump:2.5,mitt:1.5,none:0},Ty=[1,.6,.4,.3,.2,.15],Ti=(n,e,t)=>Math.min(t,Math.max(e,n));function lr(n){var T,A;let e=0;for(let C=0;C<n.nodes.length-1;C++){let M=n.nodes[C],b=n.nodes[C+1];e+=Math.hypot(M.y-b.y,M.z-b.z)*Math.PI*((M.rx+b.rx)/2)*((M.ry+b.ry)/2)}let t=Math.cbrt(e*n.bulk*n.bulk),i=n.parts.filter(C=>!C.sexOnly||C.sexOnly===n.sex),s=C=>C.mirror&&Math.abs(Math.sin(C.a))>.1?1.25:1,r=[],o=0,a=0,c=0,h=0,l=0,u=0,f=0,p=0,g=0,_=!1,m=!1,d=!1,x=!1,v=0;for(let C of i){let M=C.kind;Xd[M]&&r.push(Xd[M](C.p)*s(C)),(C.p.endType!==void 0||M.startsWith("leg_")||M.startsWith("arm_"))&&r.push(((T=Ey[C.p.endType])!=null?T:2)*s(C));let b=s(C)>1?2:1;M.startsWith("leg_")&&(o++,g+=b),M.startsWith("arm_")&&(p+=b),M==="tentacle"&&(p+=b,v+=b),M.startsWith("tail_")&&(_=!0),(M.startsWith("horn_")||M==="antler"||M==="tusk")&&(m=!0),["muzzle","beak","mandibles","maw","trunk","feelers","lips"].includes(M)&&(d=!0),["claw","talon","paw","pincer"].includes(C.p.endType)&&(x=!0),M==="feelers"&&(l+=1),M.startsWith("wing_")&&a++,M.startsWith("eye_")&&(c+=s(C)>1?2:1),M==="ridge_spikes"&&(h+=.12),M==="spike"&&(h+=.04),M==="tail_stinger"&&(l+=3),M==="mandibles"&&(l+=1),M==="shell"&&(u+=.15,f+=25),M==="ridge_plates"&&(u+=.08,f+=10)}r.sort((C,M)=>M-C);let y=7;r.forEach((C,M)=>{var b;y+=C*((b=Ty[M])!=null?b:.1)}),y*=.75+.6*t,u+=(A={scales:.08,chitin:.12,fur:.02+.05*n.look.furLen,slime:.02,skin:0}[n.look.cover])!=null?A:0;let P=o===0?.9:o===1?1:o===2?1.08:1.14;return a&&(P+=.12),P-=.3*(t-.45),u>.2&&(P-=.06),P=Ti(P,.6,1.5),{hp:Math.round(80+210*t+f*1.5),atk:Math.round(y*10)/10,def:Ti(u,0,.45),spd:Math.round(P*100)/100,dodge:Ti(.04+(P-1)*.2+(n.look.cover==="slime"?.05:0)+(a?.03:0),0,.3),crit:Ti(.04+.02*c,.04,.16),miss:c===0?.25:.04,thorns:Ti(h,0,.3),venom:l,wings:a>0,eyes:c,hands:Math.min(p,8),slots:Math.min(p,8)||1,abilitySlots:n.type==="humanoid"?3:2,legs:g,tail:_,horns:m,mouth:d,claws:x,tentacles:v,armoured:u>=.12,big:t>.56,small:t<.42,serpent:n.type==="serpent",type:n.type}}function Yd(n){let e=[];return n.venom&&e.push("Venom"),n.thorns>0&&e.push("Spiny"),n.def>=.15&&e.push("Armoured"),n.wings&&e.push("Winged"),n.spd>=1.12&&e.push("Quick"),n.eyes===0?e.push("Blind"):n.crit>=.12&&e.push("Keen-eyed"),e}function qd(n){let e=n===9?1.3:1;return{hp:(Ua.hp0+Ua.hp1*n)*e,atk:(Ua.atk0+Ua.atk1*n)*(e>1?1.12:1)}}var Ua={hp0:.34,hp1:.099,atk0:.4,atk1:.091},Ay=["hpP","atkP","atkF","spdP","crit","critD","dodge","def","pierce","lifesteal","thorns","regen","bleedC","poisonC","poisonD","burnC","stunC","stunDur","dbl","ramp","lowP","firstX","giantP","vsBleedP","perStatusCrit","perStatusDmg","critBleed","critCdr","execP","riposte","blockHeal","killHeal","killHp","secondWind","hemo","festerP","shieldP","opener","guardCdr","perWeaponSpd","perLegAtk","perEyeCrit","thornsBleed","dodgeCrit","weapons"];function mh(n,e={}){let t={};for(let a of Ay)t[a]=e.mods&&e.mods[a]||0;let i=e.mul||{hp:1,atk:1},s=e.boost||{hp:1,atk:1},r=Math.round(n.hp*(1+t.hpP)*i.hp*s.hp*(1+(e.bonusHp||0))),o=Ti(n.spd*(1+t.spdP+t.perWeaponSpd*t.weapons),.5,2.4);return{s:n,m:t,max:r,hp:r,shield:Math.round(r*t.shieldP),atk:(n.atk+t.atkF)*(1+t.atkP+t.perLegAtk*n.legs)*i.atk*s.atk,crit:n.crit+t.crit+t.perEyeCrit*n.eyes,dodge:Ti(n.dodge+t.dodge,0,.45),def:Ti(n.def+t.def,0,.6),thorns:n.thorns+t.thorns,poisonC:(n.venom?.35:0)+t.poisonC,poisonD:Math.max(n.venom,t.poisonC>0?3:0)+t.poisonD,every:1.75/o,t:.9+.5/o,power:!1,powerCd:2,guard:0,guardCd:0,guardEvery:Math.max(2.5,4.5-t.guardCdr),st:{bleed:0,bleedT:0,bleedD:1,poison:0,poisonD:0,burn:0,burnD:0,stun:0,immune:0,weak:0,slow:0,blind:0},buff:{evade:0,shell:0,frenzy:0},tick:0,fury:0,first:!0,wind:t.secondWind>0,nextCrit:!1,opened:!(t.opener>0),abil:(e.abilities||[]).map(a=>({id:a.id,lvl:a.lvl,cd:3}))}}function gh(n){return n.powerCd>0||n.hp<=0?!1:(n.power=!0,n.powerCd=7,!0)}function _h(n){return n.guardCd>0||n.hp<=0?!1:(n.guard=.9,n.guardCd=n.guardEvery,!0)}function fh(n,e){if(n.shield>0){let t=Math.min(n.shield,e);n.shield-=t,e-=t}n.hp-=e}function jr(n,e){n.hp=Math.min(n.max,n.hp+e)}function Na(n,e,t){n.st.bleed=Math.min(12,n.st.bleed+e),n.st.bleedT=5,n.st.bleedD=Math.max(1,t.atk*.05)*(1+t.m.festerP)}function ph(n,e){return n.st.immune>0?!1:(n.st.stun=e,n.st.immune=e+3,n.t+=e,!0)}var Ry=n=>(n.st.bleed>0)+(n.st.poison>0)+(n.st.burn>0)+(n.st.stun>0);function ka(n,e,t,i,s={}){let r=n[e],o=n[1-e],a=r.m,c=o.m,h={type:"hit",by:e,dmg:0,power:!!s.power,name:s.name};if(!s.sure&&(i()<(r.s.miss+(r.st.blind>0?.5:0))*(s.power?.5:1)||o.buff.evade>0||i()<o.dodge))return h.miss=!0,c.dodgeCrit&&(o.nextCrit=!0),h;let l=Ry(o),u=r.atk*t*(.85+.3*i()),f=1+r.fury*a.ramp+(r.hp<r.max*.4?a.lowP:0)+(o.st.bleed>0?a.vsBleedP:0)+l*a.perStatusDmg+(o.max>r.max?a.giantP:0)+(o.hp<o.max*.3?a.execP:0);if(r.first&&(f+=a.firstX,r.first=!1),u*=f*(r.st.weak>0?.7:1)*(r.st.burn>0?.9:1),(r.nextCrit||i()<r.crit+l*a.perStatusCrit)&&(u*=1.6+a.critD,h.crit=!0,r.nextCrit=!1,a.critBleed&&Na(o,a.critBleed,r),a.critCdr))for(let p of r.abil)p.cd=Math.max(0,p.cd-a.critCdr);return u*=(1-Math.max(0,o.def-a.pierce))*(o.buff.shell>0?.3:1),o.guard>0?(u*=.2,h.blocked=!0,o.guard=0,r.t+=.6,c.riposte&&(h.riposte=Math.max(1,Math.round(o.atk*c.riposte)),fh(r,h.riposte)),c.blockHeal&&jr(o,o.max*c.blockHeal)):(o.thorns>0&&!s.ranged&&(h.thorns=Math.max(1,Math.round(u*o.thorns*(o.buff.shell>0?2:1))),fh(r,h.thorns),c.thornsBleed&&Na(r,1,o)),i()<a.bleedC&&(Na(o,1,r),h.bleed=!0),i()<r.poisonC&&(o.st.poison=4,o.st.poisonD=r.poisonD*(1+a.festerP),h.venom=!0),i()<a.burnC&&(o.st.burn=3,o.st.burnD=Math.max(1,u*.14)*(1+a.festerP),h.burn=!0),i()<a.stunC&&ph(o,.7*(1+a.stunDur))&&(h.stun=!0),a.lifesteal&&jr(r,u*a.lifesteal)),h.dmg=Math.max(1,Math.round(u)),fh(o,h.dmg),r.fury++,h}function xh(n,e,t,i,s){let r=n[e],o=n[1-e],a=r.abil[t];if(!a||a.cd>0||r.hp<=0||o.hp<=0||r.st.stun>0)return!1;let c=a.lvl,h=u=>s.push({type:"cast",by:e,name:u}),l=(u,f,p)=>{let g=ka(n,e,u,i,{name:f,...p});return g.ability=!0,s.push(g),g};switch(a.id){case"pounce":{let u=l(1.5+.3*c,"Pounce");!u.miss&&!u.blocked&&ph(o,.8);break}case"roar":o.st.weak=4+c,h("Roar");break;case"lick":jr(r,r.max*(.11+.04*c)),s.push({type:"heal",on:e,name:"Lick Wounds"});break;case"spit":o.st.poison=6,o.st.poisonD=Math.max(o.st.poisonD,(4+2*c+r.m.poisonD)*(1+r.m.festerP)),h("Venom Spit");break;case"dive":r.buff.evade=1.5+.5*c,r.nextCrit=!0,h("Dive");break;case"constrict":{l(.8+.3*c,"Constrict",{sure:!0}).blocked||ph(o,(1.4+.3*c)*(1+r.m.stunDur));break}case"web":o.st.slow=4+c,h("Web");break;case"ink":o.st.blind=3+c,h("Ink Cloud");break;case"shellup":r.buff.shell=2+c,h("Shell Up");break;case"sweep":{l(1+.25*c,"Tail Sweep").miss||(o.t+=1.2);break}case"gore":{let u=l(1.2+.2*c,"Gore");!u.miss&&!u.blocked&&Na(o,2+c,r);break}case"frenzy":r.buff.frenzy=4,r.frenzyX=1.5+.2*c,h("Frenzy");break;case"hurl":l(1.8+.4*c,"Hurl",{sure:!0,ranged:!0});break;case"rend":l(Math.max(.3,(.35+.1*c)*o.st.bleed),"Rend");break;case"breath":{let u=l(.8+.2*c,"Fire Breath",{sure:!0,ranged:!0});o.st.burn=5,o.st.burnD=Math.max(o.st.burnD,Math.max(2,u.dmg*.2)*(1+r.m.festerP));break}default:return!1}return a.cd=yh[a.id]||10,!0}var yh={pounce:9,roar:12,lick:14,spit:10,dive:11,constrict:12,web:12,ink:12,shellup:13,sweep:8,gore:10,frenzy:13,hurl:9,rend:9,breath:11};function vh(n,e,t,i,s,r){let o=n[e],a=n[1-e];o.powerCd<=0&&i()<t*.6&&gh(o),o.guardCd<=0&&a.t<.3&&i()<t*8*s&&_h(o);for(let c=0;c<o.abil.length;c++)o.abil[c].cd<=0&&i()<t*1.2&&!(o.abil[c].id==="lick"&&o.hp>o.max*.75)&&!(o.abil[c].id==="rend"&&a.st.bleed<3)&&xh(n,e,c,i,r)}function Zd(n,e,t,i){for(let s=0;s<2;s++){let r=n[s],o=n[1-s],a=r.st;if(r.hp<=0||o.hp<=0)continue;if(!r.opened){r.opened=!0;let h=ka(n,s,r.m.opener,t,{sure:!0,ranged:!0,name:"Sling"});h.ability=!0,i.push(h)}r.powerCd=Math.max(0,r.powerCd-e),r.guardCd=Math.max(0,r.guardCd-e),r.guard=Math.max(0,r.guard-e);for(let h of r.abil)h.cd=Math.max(0,h.cd-e);for(let h of["stun","immune","weak","slow","blind","poison","burn"])a[h]=Math.max(0,a[h]-e);for(let h of["evade","shell","frenzy"])r.buff[h]=Math.max(0,r.buff[h]-e);if(a.bleed>0&&(a.bleedT-=e,a.bleedT<=0&&(a.bleed=0)),r.m.regen&&jr(r,r.max*r.m.regen*e),r.tick+=e,r.tick>=1){r.tick-=1;let h=0;a.bleed>0&&(h+=a.bleed*a.bleedD,o.m.hemo&&jr(o,o.m.hemo*a.bleed)),a.poison>0&&(h+=a.poisonD),a.burn>0&&(h+=a.burnD),h>0&&(h=Math.max(1,Math.round(h)),r.hp-=h,i.push({type:"dot",on:s,dmg:h,kind:a.burn>0?"burn":a.poison>0?"venom":"bleed"}))}if(a.stun>0||(r.t-=e*(r.buff.frenzy>0?r.frenzyX:1)*(a.slow>0?.5:1),r.t>0||r.hp<=0))continue;r.t=r.every*(.9+.2*t());let c=r.power;if(r.power=!1,i.push(ka(n,s,c?2.1:1,t,{power:c})),o.hp>0&&r.hp>0&&t()<r.m.dbl){let h=ka(n,s,.7,t,{});h.extra=!0,i.push(h)}}for(let s=0;s<2;s++){let r=n[s];r.hp<=0&&r.wind&&(r.wind=!1,r.hp=Math.max(1,Math.round(r.max*r.m.secondWind)),i.push({type:"heal",on:s,name:"Second Wind"}))}return n[0].hp<=0&&n[1].hp<=0&&(n[0].hp=1),n[1].hp<=0?0:n[0].hp<=0?1:-1}function $d(n,e){return 1e3+Math.round(500*Ti(n/e,0,1))}var Me=n=>Math.round(n*100)+"%",Vt=n=>(Math.round(n*10)/10).toString(),In=(n,e,t,i,s,r,o,a=1,c)=>({id:n,name:e,icon:t,tags:i,cost:s,mods:r,text:o,hands:a,req:c,cat:"weapon"}),We=(n,e,t,i,s,r,o,a,c)=>({id:n,name:e,icon:t,tags:i,cost:s,mods:r,text:o,req:a,reqText:c,cat:"relic"}),rn=(n,e,t,i,s,r,o,a,c)=>({id:n,name:e,icon:t,tags:i,cost:s,cd:r,text:o,req:a,reqText:c,cat:"ability"}),cr=[In("club","Bone Club","\u{1F9B4}",["stun","fury"],0,n=>({atkF:3*n,stunC:.08*n}),n=>`+${Vt(3*n)} attack. ${Me(.08*n)} chance to stun.`),In("cleaver","Notched Cleaver","\u{1FA93}",["bleed"],0,n=>({atkF:2.5*n,bleedC:.3*n}),n=>`+${Vt(2.5*n)} attack. ${Me(.3*n)} chance to cause bleeding.`),In("fang","Fang Dagger","\u{1F5E1}\uFE0F",["poison","speed"],0,n=>({atkF:1.5*n,poisonC:.3*n,spdP:.05*n}),n=>`+${Vt(1.5*n)} attack, +${Me(.05*n)} speed. ${Me(.3*n)} chance to poison.`),In("mace","Thorn Mace","\u{1F335}",["thorns"],0,n=>({atkF:2*n,thorns:.08*n}),n=>`+${Vt(2*n)} attack. Attackers take ${Me(.08*n)} of their damage back.`),In("buckler","Spiked Buckler","\u{1F6E1}\uFE0F",["guard","thorns"],0,n=>({def:.06*n,riposte:.5*n,guardCdr:.5}),n=>`+${Me(.06*n)} armour. Guard recharges faster and a block hits back for ${Me(.5*n)} attack.`),In("sling","Stone Sling","\u{1FAA8}",["crit"],0,n=>({opener:.7*n,crit:.03*n}),n=>`Opens each fight with a shot for ${Me(.7*n)} attack. +${Me(.03*n)} critical chance.`),In("brand","Ember Brand","\u{1F525}",["burn"],250,n=>({atkF:2*n,burnC:.3*n}),n=>`+${Vt(2*n)} attack. ${Me(.3*n)} chance to set the enemy on fire.`),In("pick","War Pick","\u26CF\uFE0F",["crit"],250,n=>({atkF:2.5*n,pierce:.2*n}),n=>`+${Vt(2.5*n)} attack. Ignores ${Me(.2*n)} armour.`),In("hooks","Twin Hooks","\u{1FA9D}",["speed"],300,n=>({atkF:1.5*n,dbl:.1*n}),n=>`+${Vt(1.5*n)} attack. ${Me(.1*n)} chance to strike twice.`),In("whip","Leech Whip","\u{1FA78}",["life"],350,n=>({atkF:1.5*n,lifesteal:.08*n}),n=>`+${Vt(1.5*n)} attack. Heals for ${Me(.08*n)} of damage dealt.`),In("maul","Great Maul","\u{1F528}",["stun","fury"],400,n=>({atkF:8*n,spdP:-.08,stunC:.1*n}),n=>`Needs two hands. +${Vt(8*n)} attack, -8% speed. ${Me(.1*n)} chance to stun.`,2),In("trident","Barbed Trident","\u{1F531}",["bleed","crit"],450,n=>({atkF:3*n,vsBleedP:.15*n,critD:.2*n}),n=>`+${Vt(3*n)} attack. +${Me(.15*n)} damage to bleeding enemies, +${Me(.2*n)} critical damage.`),We("hide","Thick Hide","\u{1F418}",["life"],0,n=>({hpP:.12*n}),n=>`+${Me(.12*n)} health.`),We("tooth","Whetted Tooth","\u{1F9B7}",["fury"],0,n=>({atkP:.12*n}),n=>`+${Me(.12*n)} attack.`),We("blood","Quick Blood","\u{1F4A8}",["speed"],0,n=>({spdP:.1*n}),n=>`+${Me(.1*n)} speed.`),We("eye","Hunter's Eye","\u{1F441}\uFE0F",["crit"],0,n=>({crit:.07*n}),n=>`+${Me(.07*n)} critical chance.`),We("edge","Cruel Edge","\u2702\uFE0F",["crit"],0,n=>({critD:.35*n}),n=>`+${Me(.35*n)} critical damage.`),We("slick","Slick Skin","\u{1F4A7}",["speed"],0,n=>({dodge:.05*n}),n=>`+${Me(.05*n)} dodge.`),We("plate","Iron Scales","\u{1F529}",["guard"],0,n=>({def:.06*n}),n=>`+${Me(.06*n)} armour.`),We("jag","Jagged Claws","\u{1FA78}",["bleed"],0,n=>({bleedC:.2*n}),n=>`${Me(.2*n)} chance on hit to cause bleeding.`),We("rot","Rot Gland","\u2623\uFE0F",["poison"],0,n=>({poisonC:.2*n,poisonD:n}),n=>`${Me(.2*n)} chance on hit to poison. Poison is stronger.`),We("gut","Ember Gut","\u{1F30B}",["burn"],200,n=>({burnC:.2*n}),n=>`${Me(.2*n)} chance on hit to set the enemy on fire.`),We("scent","Blood Scent","\u{1F43A}",["bleed","fury"],0,n=>({vsBleedP:.25*n}),n=>`+${Me(.25*n)} damage to bleeding enemies.`),We("torment","Tormentor","\u{1F608}",["bleed","poison","burn"],400,n=>({perStatusDmg:.1*n}),n=>`+${Me(.1*n)} damage for each ailment on the enemy (bleed, poison, fire, stun).`),We("opp","Opportunist","\u{1F3AF}",["crit","bleed","poison","burn"],300,n=>({perStatusCrit:.08*n}),n=>`+${Me(.08*n)} critical chance for each ailment on the enemy.`),We("fester","Festering","\u{1F9A0}",["poison","burn","bleed"],0,n=>({festerP:.4*n}),n=>`Bleed, poison and fire deal ${Me(.4*n)} more.`),We("hemo","Hemophage","\u{1F987}",["bleed","life"],350,n=>({hemo:1.2*n}),n=>`Heal ${Vt(1.2*n)} for each bleed stack on the enemy, every second.`),We("mist","Red Mist","\u{1F32B}\uFE0F",["crit","bleed"],350,n=>({critBleed:Math.max(1,Math.round(n))}),n=>`Critical hits add ${Math.max(1,Math.round(n))} bleed.`),We("rhythm","Predator's Rhythm","\u23F1\uFE0F",["crit","ability"],0,n=>({critCdr:.6*n}),n=>`Critical hits cut ability cooldowns by ${Vt(.6*n)}s.`),We("finish","Finisher","\u{1F480}",["crit","fury"],0,n=>({execP:.4*n}),n=>`+${Me(.4*n)} damage to enemies below 30% health.`),We("flurry","Flurry","\u{1F300}",["speed"],0,n=>({dbl:.08*n}),n=>`${Me(.08*n)} chance to strike twice.`),We("moment","Momentum","\u{1F4C8}",["speed","fury"],0,n=>({ramp:.025*n}),n=>`Each hit you land adds +${Vt(2.5*n)}% damage for the rest of the fight.`),We("riposte","Riposte","\u{1F93A}",["guard"],0,n=>({riposte:.6*n}),n=>`A block hits back for ${Me(.6*n)} attack.`),We("bulwark","Bulwark","\u{1F9F1}",["guard","life"],0,n=>({blockHeal:.05*n}),n=>`A block heals ${Me(.05*n)} health.`),We("spite","Spite","\u{1F994}",["thorns"],0,n=>({thorns:.08*n}),n=>`Attackers take ${Me(.08*n)} of their damage back.`),We("barbs","Barbed Hide","\u{1FAA1}",["thorns","bleed"],300,n=>({thornsBleed:1,thorns:.04*n}),n=>`Attackers take ${Me(.04*n)} back and start bleeding.`),We("leech","Leech","\u{1FAB1}",["life"],0,n=>({lifesteal:.06*n}),n=>`Heal for ${Me(.06*n)} of damage dealt.`),We("trophy","Trophy Hunter","\u{1F3C6}",["life"],0,n=>({killHp:.05*n}),n=>`Each kill adds +${Me(.05*n)} health for the rest of the gauntlet.`),We("feast","Feast","\u{1F356}",["life"],0,n=>({killHeal:.12*n}),n=>`Each kill heals an extra ${Me(.12*n)} health.`),We("wind","Second Wind","\u{1F54A}\uFE0F",["life"],500,n=>({secondWind:.15*n}),n=>`Once per fight, survive a killing blow and heal ${Me(.15*n)}.`),We("breath","Deep Breath","\u{1F33F}",["life"],0,n=>({regen:.006*n}),n=>`Regain ${Vt(.6*n)}% health every second.`),We("shellr","Carapace","\u{1F95A}",["guard","life"],0,n=>({shieldP:.15*n}),n=>`Start each fight with a shield worth ${Me(.15*n)} health.`),We("corner","Cornered","\u{1F621}",["fury"],0,n=>({lowP:.3*n}),n=>`+${Me(.3*n)} damage while below 40% health.`),We("ambush","Ambush","\u{1F311}",["crit"],0,n=>({firstX:n}),n=>`Your first hit each fight deals +${Me(n)} damage.`),We("giant","Giant Slayer","\u{1FA93}",["fury"],250,n=>({giantP:.2*n}),n=>`+${Me(.2*n)} damage to enemies with more health than you.`),We("herd","Stampede","\u{1F9AC}",["fury"],0,n=>({perLegAtk:.03*n}),n=>`+${Me(.03*n)} attack for each leg.`,n=>n.legs>=4,"four or more legs"),We("eyes","Many Eyes","\u{1F577}\uFE0F",["crit"],0,n=>({perEyeCrit:.015*n}),n=>`+${Vt(1.5*n)}% critical chance for each eye.`,n=>n.eyes>=2,"two or more eyes"),We("ambi","Ambidextrous","\u{1F64C}",["speed","weapon"],0,n=>({perWeaponSpd:.04*n}),n=>`+${Me(.04*n)} speed for each weapon held.`,n=>n.hands>=2,"two or more hands"),We("updraft","Updraft","\u{1FABD}",["speed","crit"],0,n=>({dodge:.08*n,dodgeCrit:1}),n=>`+${Me(.08*n)} dodge. After a dodge, your next hit is critical.`,n=>n.wings,"wings"),We("heavy","Heavyweight","\u{1F5FF}",["guard","thorns"],0,n=>({def:.04*n,thorns:.05*n}),n=>`+${Me(.04*n)} armour, and attackers take ${Me(.05*n)} back.`,n=>n.big,"a large body"),We("feather","Featherweight","\u{1FAB6}",["speed"],0,n=>({spdP:.08*n,dodge:.04*n}),n=>`+${Me(.08*n)} speed and +${Me(.04*n)} dodge.`,n=>n.small,"a small body"),We("coil","Coiled","\u27B0",["stun"],0,n=>({stunC:.06*n,stunDur:.5}),n=>`${Me(.06*n)} chance to stun, and stuns last longer.`,n=>n.serpent||n.tentacles>=2,"a serpent body or tentacles"),We("virulent","Virulent","\u{1F9EB}",["poison"],0,n=>({poisonD:2*n,poisonC:.1}),n=>`Your poison deals ${Vt(2*n)} more each second.`,n=>n.venom,"a stinger, mandibles or feelers"),rn("pounce","Pounce","\u{1F43E}",["stun","fury"],0,9,n=>`Leap for ${Me(1.5+.3*n)} attack and stun briefly.`,n=>n.legs>=2,"legs"),rn("roar","Roar","\u{1F981}",["guard"],0,12,n=>`Weaken the enemy's attacks by 30% for ${4+n}s.`,n=>n.mouth,"a mouth"),rn("lick","Lick Wounds","\u{1F497}",["life"],0,14,n=>`Heal ${Me(.11+.04*n)} health.`),rn("spit","Venom Spit","\u{1F9EA}",["poison"],0,10,n=>`Poison the enemy for ${4+2*n} damage a second, for 6s.`,n=>n.venom,"a stinger, mandibles or feelers"),rn("dive","Dive","\u{1F985}",["crit","speed"],0,11,n=>`Dodge everything for ${Vt(1.5+.5*n)}s; your next hit is critical.`,n=>n.wings,"wings"),rn("constrict","Constrict","\u{1F40D}",["stun"],0,12,n=>`Squeeze for ${Me(.8+.3*n)} attack and stun for ${Vt(1.4+.3*n)}s.`,n=>n.serpent||n.tentacles>=2,"a serpent body or tentacles"),rn("web","Web","\u{1F578}\uFE0F",["speed","stun"],0,12,n=>`Slow the enemy's attacks by half for ${4+n}s.`,n=>n.type==="arachnid"||n.type==="insectoid","an arachnid or insectoid body"),rn("ink","Ink Cloud","\u{1F32B}\uFE0F",["speed"],0,12,n=>`Blind the enemy for ${3+n}s: most of its attacks miss.`,n=>n.type==="cephalopod"||n.type==="aquatic","a cephalopod or aquatic body"),rn("shellup","Shell Up","\u{1F422}",["guard","thorns"],0,13,n=>`Take 70% less damage for ${2+n}s and double what attackers take back.`,n=>n.armoured,"a shell, plates or tough hide"),rn("sweep","Tail Sweep","\u{1F98E}",["stun"],0,8,n=>`Hit for ${Me(1+.25*n)} attack and knock the enemy's next attack back.`,n=>n.tail,"a tail"),rn("gore","Gore","\u{1F402}",["bleed"],0,10,n=>`Hit for ${Me(1.2+.2*n)} attack and add ${2+n} bleed.`,n=>n.horns,"horns or tusks"),rn("frenzy","Frenzy","\u{1F624}",["speed","fury"],300,13,n=>`Attack ${Me(.5+.2*n)} faster for 4s.`),rn("hurl","Hurl Weapon","\u{1F3F9}",["weapon","crit"],300,9,n=>`Throw for ${Me(1.8+.4*n)} attack. Cannot miss.`,n=>n.hands>=1,"a hand"),rn("rend","Rend","\u{1F405}",["bleed"],350,9,n=>`Tear open wounds: ${Me(.35+.1*n)} attack for each bleed on the enemy.`,n=>n.claws,"claws, talons or paws"),rn("breath","Fire Breath","\u{1F432}",["burn"],400,11,n=>`Burn for ${Me(.8+.2*n)} attack and set the enemy alight for 5s.`,n=>n.mouth,"a mouth")],Cy=Object.fromEntries(cr.map(n=>[n.id+(n.cat==="ability"?"!":""),n])),Xn=(n,e)=>Cy[n+(e==="ability"?"!":"")],Jd=["Common","Rare","Epic"],bh=["humanoid","quadruped","avian"],hr={insectoid:400,arachnid:500,cephalopod:600,serpent:300,aquatic:300},Qr={eye_glow:100,eye_stalk:100,eye_compound:100,mandibles:150,maw:150,trunk:150,tusk:150,horn_ram:200,antler:200,antenna_feather:80,ear_fin:80,arm_pincer:250,tentacle:300,leg_insect:150,wing_bat:300,wing_insect:200,tail_club:250,tail_stinger:300,ridge_sail:150,ridge_plates:200,shell:300},Kd=[{id:"vital",name:"Vitality",icon:"\u2764\uFE0F",max:5,cost:n=>150+100*n,text:"+5% health for every creature, per level."},{id:"fero",name:"Ferocity",icon:"\u{1F4A2}",max:5,cost:n=>150+100*n,text:"+4% attack for every creature, per level."},{id:"recov",name:"Recovery",icon:"\u26FA",max:5,cost:n=>120+80*n,text:"+4% more health restored between fights, per level."},{id:"reroll",name:"Fickle Crowd",icon:"\u{1F3B2}",max:3,cost:n=>250+150*n,text:"+1 reroll of the rewards per gauntlet, per level."},{id:"head",name:"Head Start",icon:"\u{1F381}",max:1,cost:()=>800,text:"Choose a reward before the first fight."},{id:"revive",name:"Revive",icon:"\u2728",max:3,cost:()=>500,text:"Brings a dead creature back once, mid-gauntlet, at half health. Used up when spent. Hold up to three.",consumable:!0}],Mh=()=>({points:0,champions:0,fallen:0,unlocked:{},boosts:{},revives:0}),Sh=(n,e)=>!!n.unlocked[e],Fa=(n,e)=>bh.includes(e)||Sh(n,"type:"+e),wh=(n,e)=>!Qr[e]||Sh(n,"part:"+e),Eh=(n,e)=>!e.cost||Sh(n,"item:"+e.cat+":"+e.id),jd=n=>15*(n+1),Oa=()=>({weapons:[],relics:[],abilities:[]}),eo=n=>n.weapons.reduce((e,t)=>e+Xn(t.id,"weapon").hands,0);function Th(n){let e={};for(let t of[...n.weapons,...n.relics]){let i=Xn(t.id,t.cat||"x").mods(t.q);for(let s in i)e[s]=(e[s]||0)+i[s]}return e.weapons=n.weapons.length,e}function Py(n){let e={};for(let t of[...n.weapons,...n.relics,...n.abilities])for(let i of Xn(t.id,t.cat).tags)e[i]=(e[i]||0)+1;return e}function Qd(n,e,t){return n.req&&!n.req(e)?!1:n.cat==="weapon"?e.slots-eo(t)>=n.hands:n.cat==="ability"?t.abilities.some(i=>i.id===n.id)||t.abilities.length<e.abilitySlots:!0}function ef(n,e,t,i,s,r=3){let o=Py(t),a=[],c=new Set,h=cr.filter(f=>(!i||Eh(i,f))&&Qd(f,e,t)),u={weapon:e.slots-eo(t)>=2?.45:.32,relic:.42,ability:.26};for(let f=0;f<r;f++){let p=h.filter(y=>!c.has(y.cat+y.id));if(!p.length)break;let g=p.map(y=>{let P=0;for(let A of y.tags)P+=Math.min(o[A]||0,3);let T=y.cat==="ability"&&t.abilities.some(A=>A.id===y.id);return u[y.cat]/Math.max(1,p.filter(A=>A.cat===y.cat).length)*(1+.9*Math.min(P,5))*(T?1.5:1)}),_=n()*g.reduce((y,P)=>y+P,0),m=0;for(;m<g.length-1&&(_-=g[m])>0;)m++;let d=p[m];c.add(d.cat+d.id);let x=n(),v=x<.05+.015*s?2:x<.28+.035*s?1:0;a.push({id:d.id,cat:d.cat,rar:v,q:Math.round([1,1.5,2.2][v]*(.9+.2*n())*100)/100,syn:d.tags.some(y=>o[y])})}return a}function tf(n,e){if(e.cat==="weapon")n.weapons.push({id:e.id,cat:"weapon",q:e.q,rar:e.rar});else if(e.cat==="relic")n.relics.push({id:e.id,cat:"relic",q:e.q,rar:e.rar});else{let t=n.abilities.find(i=>i.id===e.id);t?t.lvl+=1+(e.rar>0?1:0):n.abilities.push({id:e.id,cat:"ability",lvl:1+e.rar})}}function Ba(n){var t;let e=Xn(n.id,n.cat);return n.cat!=="ability"?e.text(n.q):e.text((t=n.lvl)!=null?t:1+n.rar)+` Recharges in ${e.cd}s.`}function nf(n,e,t){let i=Oa(),s=.75+.04*t,r=cr.filter(a=>a.cat==="relic"&&Qd(a,e,i)),o=cr.filter(a=>a.cat==="weapon");for(let a=0;a<Math.floor(t*.75);a++)i.relics.push({id:r[Math.floor(n()*r.length)].id,cat:"relic",q:s,rar:0});for(let a=0;a<Math.min(e.slots,Math.floor((t+1)/3));a++){let c=o[Math.floor(n()*o.length)];e.slots-eo(i)>=c.hands&&i.weapons.push({id:c.id,cat:"weapon",q:s,rar:0})}return i}var Iy=["eye_round","eye_cat","eye_goat","eye_glow","eye_beady","eye_compound","eye_stalk"],Ly=["muzzle","beak","mandibles","maw","feelers","muzzle"],Dy=["horn_spike","horn_curved","horn_ram","antler","antenna","antenna_feather","crest"],Uy=["tail_thin","tail_thick","tail_fluffy","tail_tuft","tail_club","tail_stinger","tail_fan"],Ny=["ridge_spikes","ridge_plates","ridge_sail","ridge_mane","shell"],ky=["ear_point","ear_round","ear_long","ear_floppy","ear_fin"],Fy=["wing_feather","wing_bat","wing_insect"],Oy=["human","paw","hoof","talon","webbed","stump","point"],By=["human","claw","pincer","mitt"],zy=["skin","fur","scales","chitin","slime"],Hy=["Vor","Gra","Zul","Kra","Thu","Mog","Sha","Bru","Nyx","Ora","Ska","Dre","Hul","Fen","Ryz","Um","Qua","Ix","Bel","Tar"],Vy=["gath","nak","tor","ra","lix","mok","thos","zar","dun","ska","bor","vex","gul","ris","nor","ix"],Gy=["the Cruel","the Hungry","Bonebreaker","the Unblinking","of the Pit","the Swift","Skullsplitter","the Patient","the Loud","Twice-Bitten","the Scarred","Sandstrider","the Vile","Crowd-Pleaser","the Last"];function Wy(n,e){let t=i=>i[Math.floor(n()*i.length)];return t(Hy)+t(Vy)+(e?" "+t(Gy):"")}function to(n,e={}){let t=_=>_[Math.floor(n()*_.length)],i=(_,m)=>_+(m-_)*n(),s=(_,m,d)=>"#"+new Pe().setHSL((_%1+1)%1,m,d).getHexString(),r=e.type||t(Object.keys(At)),o=xs(r);o.name=Wy(n,e.titled),o.sex=n()<.5?"m":"f",o.bulk=i(.82,1.3),o.dimorph=i(.4,1.2);for(let _ of o.nodes){let m=_.role==="neck"||_.role==="waist"?i(.9,1.15):i(.82,1.28);_.rx*=m,_.ry*=m*i(.92,1.08)}let a=n(),c=o.look;Object.assign(c,{base:s(a,i(.25,.8),i(.25,.62)),second:s(a+i(-.25,.25),i(.35,.8),i(.1,.4)),belly:s(a+.04,i(.15,.4),i(.7,.88)),hair:s(a+i(0,.5),.5,i(.15,.5)),membrane:s(a+i(-.1,.1),.45,i(.45,.7)),eye:s(n(),.8,.47),accent:n()<.7?s(.11,.3,i(.75,.9)):s(a,.2,.12),pattern:Math.floor(n()*8),patScale:i(.7,2),bellyAmt:i(.3,.9)}),n()<.5&&(c.cover=t(zy),c.furLen=i(.1,.55),c.furDroop=i(.1,.7));let h=(_,m)=>{let d=Pt[_.kind],x=Pt[m];d.size&&x.size&&(_.size*=x.size/d.size),_.kind=m,_.p=Ia(m)},l=La(o,{sexless:!0}).userData.frames,u=_=>o.parts.some(m=>Pt[m.kind].cat===_),f=t(Iy),p=t(Ly);for(let _ of o.parts){let m=Pt[_.kind];m.cat==="eyes"&&n()<.55?h(_,f):m.cat==="mouth"&&m.slot==="mouth"&&n()<.55?h(_,p):m.cat==="limbs"&&_.p.endType!==void 0&&(n()<.4&&(_.p.endType=t(_.kind.startsWith("arm")?By:Oy)),_.p.thick*=i(.85,1.35),_.p.muscle=i(.9,1.35))}u("mouth")||ri(o,p,l);let g=(_,m,d)=>{if(n()<_&&!(d&&u(d)))return ri(o,t(m),l)};g(.5,Dy),g(.45,Uy,"tails"),g(.45,Ny,"back"),g(.2,Fy,"wings"),g(.3,ky,"ears"),n()<.2&&ri(o,"tusk",l),n()<.15&&ri(o,"spike",l);for(let _ of o.parts){let m=Pt[_.kind];if(_.size*=i(.88,1.2),!(m.cat==="limbs"||m.cat==="eyes"))for(let[d,x]of Object.entries(m.P||{}))["count","feathers","tines","lift","sweep","span"].includes(d)||(_.p[d]=_.p[d]+(i(x[0],x[1])-_.p[d])*.3)}return o}var af=["z","y","x","pitch","yaw","roll","sy","gait","legF","legH","legOut","armAll","arm","armOut","tent","wing","flap","tailYaw","tailUp","wag"],Ah=()=>{let n={};for(let e of af)n[e]=0;return n.sy=1,n.wag=1,n},sf=n=>n*n*(3-2*n),Xy=n=>1-(1-n)*(1-n)*(1-n),rf=n=>Math.min(1,Math.max(0,n)),of={lunge:{wind:{z:-.3,pitch:-.16,legF:.25,sy:.94},hit:{z:.9,pitch:.22,legF:-.6,legH:.35,tailUp:.3}},bite:{wind:{z:-.3,pitch:-.22,legF:.25,tailUp:.2},hit:{z:.95,pitch:.3,legF:-.55,legH:.35,tailUp:.4}},slash:{wind:{z:-.12,pitch:-.2,arm:-2.8,yaw:-.35,legF:.2},hit:{z:.7,pitch:.2,arm:-.45,yaw:.4,legH:.3}},swipe:{wind:{pitch:-.5,y:.12,legF:-1.3,z:-.1,tailUp:-.2},hit:{z:.65,pitch:.2,legF:-.15,legH:.35}},charge:{wind:{z:-.65,pitch:.14,legF:.35,legH:-.25,sy:.92},hit:{z:1.2,pitch:.3,legF:-.5,legH:.5},run:!0},swoop:{wind:{y:1.15,z:-.35,pitch:-.3,flap:1,wing:.35,legF:-.4,legH:-.4},hit:{y:.05,z:1,pitch:.45,wing:.6,legF:-.9,legH:-.5}},lash:{wind:{z:-.15,tent:.55,pitch:-.12,sy:1.06},hit:{z:.6,tent:-1.35,pitch:.14,sy:.95}},tail:{wind:{yaw:-.7,tailYaw:.6,z:-.1,sy:.95},hit:{yaw:Math.PI*2,tailYaw:-.5,z:.55,tailUp:.25},spin:!0},sting:{wind:{pitch:.12,tailUp:.5,z:-.15,sy:.95},hit:{pitch:.3,tailUp:1.5,z:.7}},pounce:{wind:{z:-.45,pitch:-.32,sy:.82,legF:.3,legH:-.3},hit:{z:1.05,pitch:.32,legF:-.9,legH:.6},arc:.95,slow:!0},roar:{wind:{pitch:-.4,wing:.7,armAll:-1.2,armOut:.6,tailUp:.4,sy:1.06},hit:{pitch:-.2,wing:.9,armAll:-1.6,armOut:.9,z:.15,sy:1.1}}};function lf(n){let e=[],t=new Ge().makeScale(-1,1,1),i=n.frames.C,s=(i[0].z+i[i.length-1].z)/2,r=0;n.group.traverse(a=>{let c=a.userData.joint;c&&(a.matrixAutoUpdate=!1,e.push({node:a,...c,front:c.pivot.z>=s-.02,ph:e.length*2.399%6.283,idx:c.kind==="arm"?r++:0,a:new hn,q:new Wt}))});let o=new Set(e.map(a=>a.kind));return{cr:n,joints:e,S:t,kinds:o,arms:r,cur:Ah(),t:0,gaitPh:0,flapPh:0,tmp:new Ge,tmp2:new Ge}}function Rh(n,e,t,i){var l,u;let s=of[n]||of.lunge,r={},o=i?1.3:1,a=s.slow?.2:.11,c=.55,h=new Set([...Object.keys(s.wind),...Object.keys(s.hit)]);for(let f of h){let p=f==="sy"?1:0,g=(l=s.wind[f])!=null?l:p,_=(u=s.hit[f])!=null?u:p,m;if(t<0)m=p+(g-p)*sf(rf(e));else if(t<a)m=g+(_-g)*Xy(t/a);else{let d=sf(rf((t-a)/(c-a)));m=_+((s.spin&&f==="yaw"?_:p)-_)*d}r[f]=p+(m-p)*(f==="yaw"||f==="arm"||f==="sy"?1:o)}return s.arc&&t>=0&&t<a&&(r.y=(r.y||0)+Math.sin(t/a*Math.PI)*s.arc),s.run&&t>=0&&t<a+.1&&(r.gait=1.5),r}var cf=.55;function hf(n,e,t,i,s){var l;let r=n.cur,o=s?1:Math.min(1,t*26);for(let u of af)r[u]+=(((l=e[u])!=null?l:u==="sy"||u==="wag"?1:0)-r[u])*(u==="yaw"&&Math.abs((e.yaw||0)-r.yaw)>3?1:o);n.t+=t,n.gaitPh+=t*(7+5*Math.min(r.gait,1.5)),n.flapPh+=t*(5+16*Math.min(Math.abs(r.flap),1));let a=Math.abs(Math.sin(r.pitch))*(n.len||0)*.42;i.position.set(r.x,r.y+a,r.z-(n.len||0)/2),i.rotation.set(r.pitch,r.yaw,r.roll),i.scale.set(1+(1-r.sy)*.5,r.sy,1+(1-r.sy)*.5);let c=n.t,h=n.cr.M.U.uPM.value;for(let u of n.joints){let f=0,p=0,g=0,_=u.side>0?0:Math.PI;u.kind==="leg"?(f=r.gait*.55*Math.sin(n.gaitPh+_+(u.front?0:Math.PI))+(u.front?r.legF:r.legH),g=r.legOut):u.kind==="arm"?(f=r.armAll+(u.idx===n.armSel||n.armSel<0?r.arm:r.arm*.25)+.07*Math.sin(c*1.6+u.ph)-r.gait*.4*Math.sin(n.gaitPh+_),g=r.armOut+.03*Math.sin(c*1.3+u.ph)):u.kind==="tentacle"?(f=r.tent*(.55+.45*Math.sin(u.ph*3))+.13*Math.sin(c*1.7+u.ph)+r.gait*.3*Math.sin(n.gaitPh+u.ph),g=.1*Math.sin(c*1.3+u.ph*2)+r.legOut*.6):u.kind==="wing"?(g=r.wing+(.07+.6*r.flap)*Math.sin(n.flapPh),f=.04*Math.sin(c*1.1)):(p=r.tailYaw+.2*r.wag*Math.sin(c*2.4+u.ph),f=r.tailUp+.05*Math.sin(c*1.9)),u.a.set(f,p,g),u.q.setFromEuler(u.a);let m=u.pivot;u.node.matrix.makeRotationFromQuaternion(u.q);let d=u.node.matrix.elements,x=m.x,v=m.y,y=m.z;d[12]=x-(d[0]*x+d[4]*v+d[8]*y),d[13]=v-(d[1]*x+d[5]*v+d[9]*y),d[14]=y-(d[2]*x+d[6]*v+d[10]*y),u.node.matrixWorldNeedsUpdate=!0,u.bone&&(u.side>0?h[u.bone].copy(u.node.matrix):h[u.bone].copy(n.S).multiply(u.node.matrix).multiply(n.S))}}function Ch(n){for(let e of n.U.uPM.value)e.identity()}function uf(n,e){let t=new xt,i=new Float32Array(e*3),s=new Float32Array(e*4),r=new Float32Array(e);t.setAttribute("position",new _t(i,3)),t.setAttribute("col",new _t(s,4)),t.setAttribute("size",new _t(r,1));let o=new Rn({transparent:!0,depthWrite:!1,blending:n,uniforms:{uScale:{value:400}},vertexShader:`attribute vec4 col; attribute float size; varying vec4 vCol; uniform float uScale;
void main(){ vCol = col; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying vec4 vCol;
void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; float a = smoothstep(1.0, 0.35, d) * vCol.a; if (a < 0.01) discard; gl_FragColor = vec4(vCol.rgb, a); }`}),a=new ca(t,o);return a.frustumCulled=!1,a.renderOrder=5,{pts:a,pos:i,col:s,size:r,cap:e,parts:[],geo:t,mat:o}}function ff(n){let e=uf(Ur,500),t=uf(zi,400);n.add(e.pts,t.pts);let i=[],s=new da(.85,1,40),r=new Pe;return{burst(a,c,h,l={}){var p,g,_,m;let u=df[a]||df.spark,f=u.add?e:t;for(let d=0;d<h;d++){f.parts.length>=f.cap&&f.parts.shift();let x=Math.random()*6.283,v=Math.random(),y=u.speed*(.4+Math.random()*.8)*(l.speed||1),P=l.dir||null;r.set(u.colors[Math.floor(Math.random()*u.colors.length)]),f.parts.push({x:c.x+(Math.random()-.5)*((p=l.spread)!=null?p:u.spread),y:c.y+(Math.random()-.5)*((g=l.spread)!=null?g:u.spread),z:c.z+(Math.random()-.5)*((_=l.spread)!=null?_:u.spread),vx:Math.cos(x)*y*(1-v*.5)+(P?P.x*y*1.5:0),vy:(v*u.up+(Math.random()-.3)*.5)*y+(P?P.y*y:0),vz:Math.sin(x)*y*(1-v*.5)+(P?P.z*y*1.5:0),g:u.grav,drag:u.drag,life:0,max:u.life*(.6+Math.random()*.7),s:u.size*(.6+Math.random()*.8)*(l.size||1),grow:u.grow||0,r:r.r,gr:r.g,b:r.b,a:(m=u.alpha)!=null?m:1})}},ring(a,c,h=1.6,l=!0){let u=new De(s,new zt({color:c,transparent:!0,depthWrite:!1,side:Lt,blending:Ur}));u.position.copy(a),l&&(u.rotation.x=-Math.PI/2),u.userData={t:0,size:h},n.add(u),i.push(u)},update(a){for(let c of[e,t]){let h=c.parts,l=0;for(let u=0;u<h.length;u++){let f=h[u];if(f.life+=a,f.life>=f.max)continue;f.vy-=f.g*a;let p=Math.max(0,1-f.drag*a);f.vx*=p,f.vy*=p,f.vz*=p,f.x+=f.vx*a,f.y+=f.vy*a,f.z+=f.vz*a,f.y<.02&&f.g>0&&(f.y=.02,f.vy*=-.3,f.vx*=.6,f.vz*=.6);let g=f.life/f.max;c.pos[l*3]=f.x,c.pos[l*3+1]=f.y,c.pos[l*3+2]=f.z,c.col[l*4]=f.r,c.col[l*4+1]=f.gr,c.col[l*4+2]=f.b,c.col[l*4+3]=f.a*(1-g*g),c.size[l]=f.s*(1+f.grow*g),h[l++]=f}h.length=l,c.geo.setDrawRange(0,l),c.geo.attributes.position.needsUpdate=c.geo.attributes.col.needsUpdate=c.geo.attributes.size.needsUpdate=!0}for(let c=i.length-1;c>=0;c--){let h=i[c];h.userData.t+=a;let l=h.userData.t/.45;if(l>=1){n.remove(h),h.material.dispose(),i.splice(c,1);continue}h.scale.setScalar(.2+h.userData.size*(1-(1-l)*(1-l))),h.material.opacity=(1-l)*.8}},resize(a){e.mat.uniforms.uScale.value=t.mat.uniforms.uScale.value=a*.9},clear(){e.parts.length=t.parts.length=0;for(let a of i)n.remove(a),a.material.dispose();i.length=0}}}var df={spark:{add:!0,colors:["#fff2a0","#ffd060","#ffffff"],speed:4.5,up:.8,grav:9,drag:1.5,life:.45,size:.09,spread:.1},dust:{colors:["#d9bb84","#c9a56a","#e9d2a4"],speed:1.3,up:.6,grav:-.3,drag:2.5,life:.9,size:.3,spread:.3,grow:1.6,alpha:.5},blood:{colors:["#b01818","#d83030","#7a0c0c"],speed:2.6,up:.9,grav:9,drag:.6,life:.7,size:.085,spread:.12},venom:{colors:["#8fe04a","#5ab82a","#c8ff7a"],speed:.9,up:1.4,grav:-1.2,drag:1.5,life:.9,size:.1,spread:.5,alpha:.85},fire:{add:!0,colors:["#ff8a20","#ffc040","#ff4a10"],speed:.8,up:2,grav:-3,drag:1.2,life:.55,size:.2,spread:.5,grow:-.6},heal:{add:!0,colors:["#7affb0","#c8ffd8","#40e090"],speed:.6,up:2.2,grav:-2,drag:1,life:.9,size:.11,spread:.8},star:{add:!0,colors:["#fff07a","#ffffff"],speed:1.6,up:.5,grav:0,drag:2,life:.6,size:.12,spread:.3},magic:{add:!0,colors:["#c89aff","#8a5aff","#ffffff"],speed:2.2,up:.8,grav:0,drag:2.5,life:.6,size:.13,spread:.3},ink:{colors:["#14101c","#2a2438","#0a0810"],speed:1.4,up:.5,grav:-.2,drag:2,life:1.5,size:.5,spread:.6,grow:1.2,alpha:.75},web:{colors:["#ffffff","#e8eef2"],speed:2.4,up:.3,grav:1,drag:3,life:1.1,size:.07,spread:.7},shield:{add:!0,colors:["#7fd0ff","#ffffff","#4aa0ff"],speed:2.5,up:.4,grav:0,drag:3,life:.35,size:.12,spread:.5}};var dr=(n,e,t)=>Math.min(t,Math.max(e,n));function Ph(n,e,t){let i=document.createElement("canvas");i.width=n,i.height=e,t(i.getContext("2d"),n,e);let s=new ni(i);return s.colorSpace=Bt,s}function qy(){let n=new Et,e=12,t=Ph(256,256,(m,d,x)=>{m.fillStyle="#d2a45c",m.fillRect(0,0,d,x);for(let y=0;y<5e3;y++)m.fillStyle=`rgba(${Math.random()<.5?"90,60,30":"255,235,190"},${Math.random()*.12})`,m.fillRect(Math.random()*d,Math.random()*x,1+Math.random()*3,1+Math.random()*2);let v=m.createRadialGradient(d/2,x/2,d*.1,d/2,x/2,d/2);v.addColorStop(0,"rgba(255,240,200,0.25)"),v.addColorStop(1,"rgba(60,35,15,0.45)"),m.fillStyle=v,m.fillRect(0,0,d,x)}),i=new De(new Ks(e,64),new Nt({map:t,roughness:1}));i.rotation.x=-Math.PI/2,i.receiveShadow=!0,n.add(i);let s=new Nt({color:9402204,roughness:.95,side:Lt}),r=new Nt({color:7167308,roughness:1,side:Lt}),o=[new be(e,0),new be(e,1.5)];for(let m=0;m<6;m++)o.push(new be(e+.5+m*1.15,1.5+m*.8),new be(e+.5+(m+1)*1.15,1.5+m*.8),new be(e+.5+(m+1)*1.15,1.5+(m+1)*.8));o.push(new be(e+8,8.5)),n.add(new De(new ha(o,72),s));let a=new De(new un(e,.14,6,72),r);a.rotation.x=Math.PI/2,a.position.y=1.5,n.add(a);let c=900,h=new Hr(new tn(.2,6,5),new Nt({roughness:.9}),c),l=new Ge,u=new Pe,f=[];for(let m=0;m<c;m++){let d=Math.floor(Math.random()*6),x=Math.random()*Math.PI*2,v=e+1.05+d*1.15+(Math.random()-.5)*.4;f.push({x:Math.cos(x)*v,y:1.5+d*.8+.3,z:Math.sin(x)*v,ph:Math.random()*6.28}),h.setColorAt(m,u.setHSL(Math.random(),.3+Math.random()*.5,.25+Math.random()*.35))}n.add(h);for(let m=0;m<24;m++){let d=m/24*Math.PI*2,x=e+7.7,v=new De(new Vn(.3,.36,3.4,10),s);v.position.set(Math.cos(d)*x,8.2,Math.sin(d)*x),n.add(v)}let p=new De(new un(e+7.7,.32,6,72),s);p.rotation.x=Math.PI/2,p.position.y=10,n.add(p);let g=new Nt({color:2759698,roughness:1});for(let m of[-1,1]){let d=new De(new Mi(1.6,1.25),g);d.position.set(m*(e-.02),.62,0),d.rotation.y=-m*Math.PI/2,n.add(d)}for(let m=0;m<10;m++){let d=m/10*Math.PI*2+.3,x=new De(new Mi(.7,1),new Nt({color:m%2?10099740:14262304,roughness:.8,side:Lt}));x.position.set(Math.cos(d)*(e-.03),.9,Math.sin(d)*(e-.03)),x.lookAt(0,.9,0),n.add(x)}let _=Ph(4,256,m=>{let d=m.createLinearGradient(0,0,0,256);d.addColorStop(0,"#2f5fa8"),d.addColorStop(.45,"#7fa6d0"),d.addColorStop(1,"#e9c79a"),m.fillStyle=d,m.fillRect(0,0,4,256)});return{g:n,crowd:h,seats:f,m4:l,sky:_}}function Zy(n){let e=new Et,t=(c,h=.5,l)=>new Nt({color:c,roughness:h,metalness:c===10134701?.7:0,emissive:l||0}),i=(c,h,l,u,f,p)=>{let g=new De(c,h);return g.position.set(l||0,u||0,f||0),p&&(g.rotation.z=p),e.add(g),g},s=t(7031342,.8),r=t(10134701,.35),o=t(15261900,.6),a=(c=1)=>i(new Vn(.035,.045,c,8),s,0,c/2);if(n==="club")i(new Vn(.13,.04,1,10),o,0,.5),i(new tn(.14,10,8),o,0,1);else if(n==="cleaver")a(.6),i(new Hn(.34,.5,.03),r,.14,.78);else if(n==="fang")a(.3),i(new Si(.07,.6,8),o,0,.6);else if(n==="mace"){a(.85),i(new ua(.17,0),r,0,.95);for(let c=0;c<6;c++)i(new Si(.04,.16,5),r,Math.cos(c)*.2,.95+Math.sin(c*2)*.12,Math.sin(c)*.2,-Math.cos(c)*1.57)}else if(n==="buckler"){let c=i(new Vn(.42,.42,.06,20),r,0,.3,.1);c.rotation.x=Math.PI/2;let h=i(new Si(.08,.25,8),o,0,.3,.25);h.rotation.x=Math.PI/2}else if(n==="sling")i(new un(.2,.02,5,14),s,0,.3),i(new tn(.09,8,6),t(9079430,.9),0,.1);else if(n==="brand")a(.8),i(new Si(.13,.42,8),t(16747040,.4,16734720),0,1);else if(n==="pick"){a(.95);let c=i(new Si(.06,.6,6),r,0,.9);c.rotation.z=Math.PI/2}else if(n==="hooks")a(.6),i(new un(.16,.03,6,12,Math.PI*1.2),r,.16,.62);else if(n==="whip")a(.3),i(new un(.3,.022,5,16,Math.PI*1.4),t(8002588,.7),.3,.35);else if(n==="maul")i(new Vn(.045,.055,1.4,8),s,0,.7),i(new Hn(.5,.32,.32),r,0,1.4);else{a(1.2);for(let c of[-.13,0,.13])i(new Si(.035,.4,6),r,c,1.35-Math.abs(c)*.6);i(new Hn(.3,.04,.04),r,0,1.15)}return e}var fr=null;function wn(n){try{fr=fr||new(window.AudioContext||window.webkitAudioContext);let e=fr.currentTime,t=fr.createOscillator(),i=fr.createGain(),[s,r,o,a,c]={hit:[150,50,.14,"triangle",.5],power:[220,40,.3,"sawtooth",.5],block:[700,500,.09,"square",.2],miss:[500,800,.1,"sine",.12],win:[440,880,.6,"triangle",.35],lose:[200,60,.9,"sawtooth",.3]}[n];t.type=a,t.frequency.setValueAtTime(s,e),t.frequency.exponentialRampToValueAtTime(r,e+o),i.gain.setValueAtTime(c,e),i.gain.exponentialRampToValueAtTime(.001,e+o),t.connect(i).connect(fr.destination),t.start(e),t.stop(e+o+.02)}catch{}}function pf(n){let{scene:e,camera:t,h:i,store:s}=n,r=qy();r.g.visible=!1,e.add(r.g);let o=ff(r.g),a=Aa(),c=Ph(64,64,w=>{let L=w.createRadialGradient(32,32,2,32,32,32);L.addColorStop(0,"rgba(0,0,0,0.6)"),L.addColorStop(1,"rgba(0,0,0,0)"),w.fillStyle=L,w.fillRect(0,0,64,64)}),h=document.getElementById("battle"),l={active:!1,phase:"off",run:null,data:null,views:[null,null],F:null,t:0,phaseT:0,enemy:null,shake:0,cheer:0,rand:Math.random,confetti:null,queue:[],eLoad:null,auto:!1,freeze:0,slow:0,punch:0,entered:!1},u=null,f={Pounce:"pounce","Tail Sweep":"tail",Gore:"charge",Hurl:"slash",Rend:"slash",Constrict:"lash","Fire Breath":"roar",Sling:"slash"};function p(w,L,B,J,Q){ii(L,w.look,At[w.type].bellyDir),Ch(L);let K=[],se=ar(w,L,{anchors:K,animated:!0}),U=Kr(se),z=U.getSize(new I),oe=lr(w),H=dr(1.9/Math.max(z.y,z.z*.85,z.x*.55,.6),.5,2.4)*(.85+.35*dr(Math.cbrt(oe.hp/200),.6,1.4)),he=w.type==="aquatic"?.45:0;se.group.scale.setScalar(H),se.group.position.set(-(U.min.x+U.max.x)/2*H,-U.min.y*H+he,-U.max.z*H+z.z*H/2);let Re=0;for(let Be of J?J.weapons:[]){let ze=K[Re];if(Re+=Xn(Be.id,"weapon").hands,!ze)continue;let Ce=Zy(Be.id),ft=dr(z.y*.3,.22,.6);Ce.scale.setScalar(ft),Ce.position.copy(ze.p).addScaledVector(ze.t,ze.r*2.2),Ce.quaternion.setFromUnitVectors(new I(0,1,0),ze.t.clone().multiplyScalar(.25).add(new I(.2,.5,.85)).normalize()),Ce.traverse(Ie=>{Ie.castShadow=!0}),ze.node.add(Ce)}let Ne=new Et,Qe=new Et;Ne.add(se.group),Qe.add(Ne);let qe=new De(new Mi(1,1),new zt({map:c,transparent:!0,depthWrite:!1,opacity:.45}));qe.rotation.x=-Math.PI/2,qe.position.set(0,.012,-z.z*H/2),qe.scale.set(Math.max(z.x*H,.6)*1.2,z.z*H*1.1,1),Qe.add(qe),Qe.position.x=B*(.75+(Q||0)),Qe.rotation.y=B<0?Math.PI/2:-Math.PI/2,r.g.add(Qe);let pt=lf(se),F=new Set(w.parts.map(Be=>Be.kind)),yt=[];return pt.arms>0?yt.push("slash"):oe.claws&&oe.legs>=4&&yt.push("swipe"),oe.mouth&&yt.push("bite"),oe.horns&&yt.push("charge"),oe.wings&&yt.push("swoop"),oe.tentacles>=2&&yt.push("lash"),["tail_club","tail_thick","tail_fluke","tail_fish"].some(Be=>F.has(Be))&&yt.push("tail"),F.has("tail_stinger")&&yt.push("sting"),yt.length||yt.push("lunge"),pt.armSel=-1,pt.len=z.z*H,{cr:se,mats:L,pose:Ne,holder:Qe,side:B,rig:pt,styles:yt,style:yt[0],styleN:0,hover:he,st:oe,walk:Q||0,half:z.x*H/2,len:z.z*H,head:new I(0,z.y*H+he+.15,-z.z*H*.3),mid:new I(0,z.y*H*.55+he,-z.z*H*.2),front:new I(0,z.y*H*.5+he,.1),strikeT:-1,winding:!1,power:!1,recoil:0,flash:0,dead:-1,dodge:-1,fxT:0,thud:!1,ph:Math.random()*6}}let g=(w,L)=>w.holder.localToWorld(L.clone());function _(w){let L=l.views[w];L&&(r.g.remove(L.holder),Yi(L.cr.group),l.views[w]=null)}let m=w=>[...w.weapons,...w.abilities,...w.relics].map(L=>Xn(L.id,L.cat).icon).join("");function d(w,L){let B=L.clone();return w.holder.localToWorld(B),B.project(t),[(B.x*.5+.5)*innerWidth,(-B.y*.5+.5)*innerHeight]}function x(w,L,B){let J=l.views[w];if(!J)return;let[Q,K]=d(J,J.head),se=i("div",{class:"float "+(B||""),style:`left:${Q+(Math.random()-.5)*40}px;top:${K}px`},L);h.querySelector(".floaters").append(se),setTimeout(()=>se.remove(),1100)}function v(){let w=[l.data.name,l.enemy?l.enemy.name:""],L=B=>J=>{J.preventDefault(),l.phase==="fight"&&B()};h.replaceChildren(i("div",{class:"hud"},i("div",{class:"who l"},i("b",null,w[0]),i("div",{class:"hp"},i("u",{id:"hg0"}),i("i",{id:"hp0"})),i("small",{id:"st0"}),i("div",{class:"kit"},m(l.run.load))),i("div",{class:"round"},i("small",null,"Fight"),i("b",null,l.run.round+1+" / "+10)),i("div",{class:"who r"},i("b",null,w[1]),i("div",{class:"hp"},i("u",{id:"hg1"}),i("i",{id:"hp1"})),i("small",{id:"st1"}),i("div",{class:"kit"},l.eLoad?m(l.eLoad):""))),i("div",{class:"msg",id:"bmsg"}),i("div",{class:"floaters"}),i("div",{class:"acts"},i("div",null,i("button",{id:"bpow",onpointerdown:L(()=>gh(l.F[0])&&wn("miss"))},i("i"),i("em",null,"\u2694\uFE0F"),i("span",null,"Power")),i("button",{id:"bgrd",onpointerdown:L(()=>_h(l.F[0])&&wn("block"))},i("i"),i("em",null,"\u{1F6E1}\uFE0F"),i("span",null,"Guard"))),i("div",null,l.run.load.abilities.map((B,J)=>i("button",{class:"abil",id:"bab"+J,onpointerdown:L(()=>{xh(l.F,0,J,l.rand,l.queue)&&wn("power")})},i("i"),i("em",null,Xn(B.id,"ability").icon),i("span",null,Xn(B.id,"ability").name))))))}function y(...w){let L=i("div",{class:"panel"},w);return h.append(L),L}function P(w){return i("div",{class:"stats"},...[["Health",w.hp],["Attack",w.atk.toFixed(1)],["Armour",Math.round(w.def*100)+"%"],["Speed",w.spd.toFixed(2)]].map(([L,B])=>i("div",null,i("small",null,L),i("b",null,String(B)))))}function T(){l.phase="gate",h.replaceChildren();let w=lr(l.data),L=Yd(w),B=n.meta();y(i("h2",null,"The Colosseum"),i("p",null,i("b",null,l.data.name)," faces ten fights in a row. Each opponent is tougher and better armed than the last, and the tenth is the reigning champion. After every win you choose one of three rewards."),P(w),i("div",{class:"stats"},i("div",null,i("small",null,"Weapon hands"),i("b",null,String(w.slots))),i("div",null,i("small",null,"Ability slots"),i("b",null,String(w.abilitySlots))),i("div",null,i("small",null,"Revives"),i("b",null,String(B.revives||0)))),i("p",{class:"dim"},L.length?"Traits: "+L.join(", ")+". ":"",w.hands?"Each arm or tentacle can hold one weapon.":"With no hands it can carry a single weapon in its jaws. Add arms or tentacles to wield more."," Wings, tails, horns, venom and the rest decide which abilities and relics can turn up."),i("p",{class:"warn"},"Fights are to the death. If "+l.data.name+" dies with no revive, it is gone for good."),i("div",{class:"row"},i("button",{onclick:()=>q({type:"back"})},"Back to the workshop"),i("button",{class:"go",onclick:()=>{wn("block"),(B.boosts.head||0)>0?A("A gift from the crowd","Choose a reward before the first fight."):C()}},"Enter the arena")))}function A(w,L){l.phase="won";let B=lr(l.data),J=l.run.load;l.run.draft||(l.run.draft=ef(Math.random,B,J,n.meta(),l.run.round),s.set("cc.run",l.run)),h.replaceChildren(i("div",{class:"floaters"}));let Q=U=>{tf(J,U),l.run.draft=null,s.set("cc.run",l.run),wn("block"),C()},K=U=>{let z=Xn(U.id,U.cat),oe=U.cat==="ability"&&J.abilities.find(he=>he.id===U.id),H=U.cat==="ability"?{...U,lvl:oe?oe.lvl+1+(U.rar>0?1:0):1+U.rar}:U;return i("button",{class:"reward r"+U.rar+" c-"+U.cat,onclick:()=>Q(U)},i("small",null,Jd[U.rar]+" "+(U.cat==="relic"?"relic":U.cat)+(oe?" \xB7 level up":"")),i("div",{class:"ico"},z.icon),i("b",null,z.name),i("p",null,Ba(H)),U.syn&&i("em",null,"Synergy: "+z.tags.filter(he=>[...J.weapons,...J.relics,...J.abilities].some(Re=>Xn(Re.id,Re.cat).tags.includes(he))).join(", ")))};y(i("h2",null,w),i("p",null,L),i("div",{class:"rewards"},l.run.draft.length?l.run.draft.map(K):i("p",{class:"dim"},"Nothing more fits this body.")),i("p",{class:"dim"},"Hands "+eo(J)+"/"+B.slots+" \xB7 Abilities "+J.abilities.length+"/"+B.abilitySlots+" \xB7 Relics "+J.relics.length+(m(J)?"   "+m(J):"")),i("div",{class:"row"},l.run.rerolls>0&&i("button",{onclick:()=>{l.run.rerolls--,l.run.draft=null,A(w,L)}},"Reroll ("+l.run.rerolls+" left)"),!l.run.draft.length&&i("button",{class:"go",onclick:()=>{l.run.draft=null,C()}},"Next fight"))).classList.add("wide")}function C(){_(1),_(0);let w=l.run.round===9,L=n.meta(),B=L.boosts;l.views[0]=p(l.data,n.M,-1,l.run.load,l.entered?0:5.5),l.entered=!0,l.enemy=to(Zr(l.run.seed+l.run.round*7919),{titled:!0}),w&&(l.enemy.name=l.enemy.name.split(" ")[0]+", Champion of the Sands");let J=lr(l.data),Q=lr(l.enemy);l.eLoad=nf(Zr(l.run.seed+l.run.round),Q,l.run.round),l.views[1]=p(l.enemy,a,1,l.eLoad,6),w&&l.views[1].holder.scale.setScalar(1.18),l.F=[mh(J,{mods:Th(l.run.load),abilities:l.run.load.abilities,bonusHp:l.run.bonusHp,boost:{hp:1+.05*(B.vital||0),atk:1+.04*(B.fero||0)}}),mh(Q,{mul:qd(l.run.round),mods:Th(l.eLoad)})],l.run.hp!=null&&(l.F[0].hp=Math.min(l.F[0].max,l.run.hp)),l.rand=Math.random,l.queue=[],v(),b(),l.phase="intro",l.phaseT=0,M(w?"Final fight":"Fight "+(l.run.round+1),"vs "+l.enemy.name)}function M(w,L){let B=document.getElementById("bmsg");B&&B.replaceChildren(w?i("b",null,w):"",L?i("span",null,L):"")}function b(){for(let L=0;L<2;L++){let B=l.F[L],J=document.getElementById("hp"+L);if(!J)continue;let Q=dr(B.hp/B.max,0,1),K=B.st;document.getElementById("hg"+L).style.width=Q*100+"%",J.style.width=Q*100+"%",J.style.background=K.poison>0?"#8fd14f":Q>.5?"#3fd0a4":Q>.25?"#ffb347":"#ff5a4a",J.parentNode.classList.toggle("shield",B.shield>0);let se=Math.max(0,Math.ceil(B.hp))+" / "+B.max+(B.shield>0?" +"+Math.ceil(B.shield):"")+(K.bleed>0?" \u{1FA78}"+K.bleed:"")+(K.poison>0?" \u2623\uFE0F":"")+(K.burn>0?" \u{1F525}":"")+(K.stun>0?" \u{1F4AB}":"")+(K.weak>0?" \u2B07\uFE0F":"")+(K.slow>0?" \u{1F578}\uFE0F":"")+(K.blind>0?" \u{1F32B}\uFE0F":"")+(B.buff.shell>0?" \u{1F422}":"")+(B.buff.evade>0?" \u{1F985}":"")+(B.buff.frenzy>0?" \u{1F624}":""),U=document.getElementById("st"+L);U.textContent!==se&&(U.textContent=se)}let w=(L,B,J,Q)=>{let K=document.getElementById(L);K&&(K.firstChild.style.height=dr(B/J,0,1)*100+"%",K.classList.toggle("armed",!!Q))};w("bpow",l.F[0].powerCd,7,l.F[0].power),w("bgrd",l.F[0].guardCd,l.F[0].guardEvery,l.F[0].guard>0),l.F[0].abil.forEach((L,B)=>w("bab"+B,L.cd,yh[L.id],!1))}function D(){let w=l.F[0],L=n.meta(),B=jd(l.run.round);if(L.points+=B,l.run.earned=(l.run.earned||0)+B,n.saveMeta(),l.run.bonusHp=(l.run.bonusHp||0)+w.m.killHp,l.run.round++,l.run.hp=Math.min(w.max,Math.max(1,w.hp)+w.max*(.4+.04*(L.boosts.recov||0)+w.m.killHeal)),l.run.draft=null,l.run.round>=10){G();return}s.set("cc.run",l.run),A(l.enemy.name.split(",")[0]+" is dead","+"+B+" points. "+l.data.name+" recovers to "+Math.round(l.run.hp)+" / "+w.max+" health. "+(l.run.round===9?"Only the champion remains. ":"")+"Choose a reward:")}function G(){l.phase="champion",s.set("cc.run",null),wn("win"),l.cheer=6,_(0),l.views[0]=p(l.data,n.M,-1,l.run.load);let w=$d(l.F[0].hp,l.F[0].max),L=l.run.earned||0;_(1),l.views[0].holder.position.x=0,l.views[0].holder.rotation.y=.35;let B=260,J=new Mi(.09,.14),Q=new Hr(J,new zt({side:Lt}),B),K=new Pe;l.confetti={mesh:Q,bits:[]};for(let se=0;se<B;se++)l.confetti.bits.push({x:(Math.random()-.5)*9,y:3+Math.random()*7,z:(Math.random()-.5)*5,v:.8+Math.random()*1.2,r:Math.random()*6,w:1+Math.random()*4}),Q.setColorAt(se,K.setHSL(Math.random(),.9,.6));r.g.add(Q),h.replaceChildren(i("div",{class:"floaters"})),y(i("h2",{class:"gold"},"Champion!"),i("p",null,i("b",null,l.data.name)," won all ten fights and rules the Colosseum."),i("div",{class:"stats"},i("div",null,i("small",null,"Fights"),i("b",null,String(L))),i("div",null,i("small",null,"Title"),i("b",null,"+1000")),i("div",null,i("small",null,"Health left"),i("b",null,"+"+(w-1e3))),i("div",null,i("small",null,"Total"),i("b",{class:"gold"},String(w+L)))),i("div",{class:"row"},i("button",{class:"go",onclick:()=>q({type:"champion",points:w})},"Take the crown"))).classList.add("low")}function W(){l.phase="dead",wn("lose"),h.querySelector(".acts").classList.add("hidden"),M("","");let w=n.meta(),L=l.run.earned||0;y(i("h2",{class:"red"},l.data.name+" has fallen"),i("p",null,"Killed by "+l.enemy.name+" in fight "+(l.run.round+1)+" of "+10+", after "+l.run.round+(l.run.round===1?" win":" wins")+" and "+L+" points earned."),w.revives>0?i("p",null,"You hold "+w.revives+(w.revives===1?" revive.":" revives.")+" Using one brings it back at half health to fight "+l.enemy.name.split(",")[0]+" again."):i("p",{class:"dim"},"The dead do not return. Build a new creature and try again. Revives are sold in the shop."),i("div",{class:"row"},w.revives>0&&i("button",{class:"go",onclick:()=>{w.revives--,n.saveMeta(),l.run.hp=Math.round(l.F[0].max*.5),s.set("cc.run",l.run),wn("win"),C()}},"Use a revive"),i("button",{class:w.revives>0?"":"go",onclick:()=>{s.set("cc.run",null),q({type:"dead",round:l.run.round,by:l.enemy.name})}},w.revives>0?"Let it die":"Create a new creature"))).classList.add("low")}function q(w){_(0),_(1),l.confetti&&(r.g.remove(l.confetti.mesh),l.confetti.mesh.geometry.dispose(),l.confetti=null),l.active=!1,l.phase="off",r.g.visible=!1,e.background=u,o.clear(),Ch(n.M),t.zoom=1,h.classList.add("hidden"),h.replaceChildren(),n.onDone(w)}function ie(w,L,B,J){let Q=l.F&&l.F[L],K=Ah(),se=w.rig,U=Math.sin(J*2+w.ph);if(K.sy=1+U*.012,K.y=w.hover?Math.sin(J*1.3+w.ph)*.06:0,w.st.wings&&(K.flap=w.hover?.3:.05),w.walk>0){let H=Math.min(w.walk,4.6*B);w.walk-=H,w.holder.position.x=w.side*(.75+w.walk),K.gait=1,K.y+=Math.abs(Math.sin(se.gaitPh))*.04,K.pitch=.04,w.fxT+=B,w.fxT>.16&&(w.fxT=0,o.burst("dust",g(w,new I(0,.05,-w.len*.5)),2,{speed:.5}))}else if(w.dead>=0){w.dead+=B;let H=Math.min(1,w.dead/.75),he=H*H*(3-2*H);Object.assign(K,{roll:1.48*he*(L?-1:1),y:Math.sin(he*Math.PI/2)*w.half*.85+Math.sin(H*Math.PI)*.25,z:-.5*he,pitch:-.2*Math.sin(H*Math.PI),legF:-.5*he,legH:.55*he,legOut:.35*he,armAll:-.7*he,armOut:.5*he,wing:-.7*he,tent:-.6*he,tailUp:-.3*he,wag:0,flap:0,sy:1-.06*he}),H>=.8&&!w.thud&&(w.thud=!0,o.burst("dust",g(w,new I(0,.1,-w.len*.5)),26,{spread:w.len*.8}),l.shake=Math.max(l.shake,.18))}else if(l.phase==="champion"||l.phase==="ending"&&l.winner===L&&l.phaseT>.5){let H=Math.abs(Math.sin(J*5.5));Object.assign(K,{y:K.y+H*.22,sy:1+(H-.5)*.08,armAll:-2.7,armOut:.35,wing:.7,flap:.5,tailUp:.5,wag:3,pitch:-.15,tent:-.9,legF:-.25*H})}else Q&&l.phase==="fight"&&(Q.st.stun>0?Object.assign(K,{roll:.13*Math.sin(J*9),pitch:.12,legOut:.12,armAll:.2,wing:-.3,wag:0,sy:.96}):(w.strikeT<0&&Q.t<.45?(w.winding||(w.winding=!0,w.style=w.styles[w.styleN++%w.styles.length],w.power=Q.power,se.armSel=se.arms?w.styleN%se.arms:-1,Q.power&&se.arms>1&&(se.armSel=-1)),Object.assign(K,Rh(w.style,1-Q.t/.45,-1,w.power))):w.strikeT<0&&(w.winding=!1),w.strikeT>=0&&(Object.assign(K,Rh(w.style,1,w.strikeT,w.power)),w.strikeT+=B,w.strikeT>cf&&(w.strikeT=-1,w.winding=!1)),Q.guard>0&&Object.assign(K,{sy:.9,pitch:.12,armAll:-1.4,armOut:.3,wing:.7,z:(K.z||0)-.12,legF:.15,tailUp:-.2}),Q.buff.shell>0&&(K.sy=.82,K.legOut=.2,K.armAll=-.8),Q.buff.frenzy>0&&(K.sy*=1+.03*Math.sin(J*22),K.wag=4),Q.buff.evade>0&&(K.y+=1.3,K.flap=1,K.pitch=-.2)));if(w.recoil>0){w.recoil=Math.max(0,w.recoil-B*3.2);let H=w.recoil;K.z=(K.z||0)-.5*H,K.pitch=(K.pitch||0)-.28*H,K.roll=(K.roll||0)+.14*H*Math.sin(J*30),K.legF=(K.legF||0)-.35*H,K.armAll=(K.armAll||0)+.5*H,K.wing=(K.wing||0)+.4*H,K.sy=K.sy*(1-.06*H)}if(w.dodge>=0)if(w.dodge+=B*3.2,w.dodge>=1)w.dodge=-1;else{let H=Math.sin(w.dodge*Math.PI);K.x=(K.x||0)+.95*H,K.roll=(K.roll||0)-.35*H,K.z=(K.z||0)-.3*H,K.gait=1}hf(se,K,B,w.pose),w.flash=Math.max(0,w.flash-B*5);let z=Q&&Q.guard>0?.1:0,oe=Q&&Q.buff.shell>0?.12:0;for(let H of[w.mats.skin,...w.mats.shells])H.emissive.setRGB(w.flash*.5+z*.2+oe,z*.6+oe,z+oe);if(w.holder.updateMatrixWorld(!0),Q&&w.dead<0&&l.phase==="fight"&&(w.fxT+=B,w.fxT>.07)){w.fxT=0;let H=()=>g(w,new I((Math.random()-.5)*w.half*1.6,w.mid.y*(.4+Math.random()*1.2),-w.len*Math.random()));Q.st.burn>0&&o.burst("fire",H(),2,{spread:.15}),Q.st.poison>0&&Math.random()<.5&&o.burst("venom",H(),1,{spread:.1}),Q.st.bleed>0&&Math.random()<.12*Q.st.bleed&&o.burst("blood",H(),1,{speed:.3}),Q.st.stun>0&&o.burst("star",g(w,w.head),1,{spread:.5,speed:.4}),Q.shield>0&&Math.random()<.4&&o.burst("shield",H(),1,{speed:.2}),Q.buff.frenzy>0&&o.burst("fire",H(),1,{spread:.1,size:.6}),Q.st.blind>0&&o.burst("ink",g(w,w.head),1,{spread:.4,speed:.3,size:.6}),Q.st.slow>0&&Math.random()<.4&&o.burst("web",H(),1,{speed:.2})}}function Z(w){if(w.type==="dot"){x(w.on,"-"+w.dmg,w.kind==="venom"?"venom":w.kind==="burn"?"burn":"bleed"),o.burst(w.kind==="venom"?"venom":w.kind==="burn"?"fire":"blood",g(l.views[w.on],l.views[w.on].mid),6);return}if(w.type==="cast"){let se=l.views[w.by],U=l.views[1-w.by];x(w.by,w.name,"cast"),wn("miss"),se.style="roar",se.strikeT=0,se.power=!1;let z={"Ink Cloud":["ink",U,26],Web:["web",U,40],"Venom Spit":["venom",U,26],Roar:["magic",se,14],"Shell Up":["shield",se,22],Frenzy:["fire",se,22],Dive:["dust",se,18]}[w.name]||["magic",se,16];o.burst(z[0],g(z[1],z[1].mid),z[2],{spread:.9}),w.name==="Roar"&&(o.ring(g(se,se.front),16766826,3.2,!1),l.shake=.15),w.name==="Shell Up"&&o.ring(g(se,new I(0,.05,-se.len/2)),8376575,2);return}if(w.type==="heal"){x(w.on,w.name,"venom"),wn("win"),o.burst("heal",g(l.views[w.on],l.views[w.on].mid),30,{spread:1.1});return}let L=l.views[w.by],B=l.views[1-w.by];if(w.name&&f[w.name]){let se=f[w.name];L.style=se==="tail"&&!L.rig.kinds.has("tail")||se==="slash"&&!L.rig.arms||se==="lash"&&!L.rig.kinds.has("tentacle")?"lunge":se,L.rig.armSel=-1}if(L.strikeT=0,L.power=!!w.power||!!w.ability,w.name&&x(w.by,w.name,"cast"),w.miss){x(1-w.by,"Miss","dim"),wn("miss"),B.dodge=0,o.burst("dust",g(B,new I(0,.05,-B.len*.4)),8);return}let J=w.power||w.crit||w.ability,Q=g(B,B.front);B.recoil=w.blocked?.3:J?1:.6,w.blocked||(B.flash=1),l.shake=w.blocked?.05:w.power?.3:J?.2:.1,l.cheer=Math.max(l.cheer,J?1:.4),l.freeze=w.blocked?.03:J?.09:.045,J&&!w.blocked&&(l.punch=.07),w.blocked?(o.burst("shield",Q,16),o.ring(Q,8376575,1.1,!1)):(o.burst("spark",Q,J?22:10,{dir:new I(-L.side,.3,0)}),o.burst("dust",g(B,new I(0,.05,-B.len*.4)),J?10:4),J&&o.ring(Q,w.crit?16766826:16777215,w.power?1.8:1.3,!1),(w.bleed||w.crit)&&o.burst("blood",Q,10),(w.burn||w.name==="Fire Breath")&&o.burst("fire",Q,24,{spread:.8}),w.venom&&o.burst("venom",Q,14,{spread:.6}),w.stun&&o.burst("star",g(B,B.head),12,{spread:.5})),x(1-w.by,(w.blocked?"Blocked ":"")+"-"+w.dmg+(w.crit?"!":""),w.blocked?"dim":J?"big":""),w.thorns&&(x(w.by,"-"+w.thorns,"dim"),o.burst("spark",g(L,L.front),6)),w.riposte&&(x(w.by,"Riposte -"+w.riposte,"dim"),L.recoil=.5,L.flash=1);let K=w.stun?"Stunned":w.venom?"Poisoned":w.burn?"Burning":w.bleed?"Bleeding":"";K&&x(1-w.by,K,w.venom?"venom":w.burn?"burn":"bleed"),wn(w.blocked?"block":J?"power":"hit")}return l.update=(w,L)=>{let B=w;if(l.freeze>0&&(l.freeze-=w,B=w*.05),l.slow>0&&(l.slow-=w,B*=.3),l.t+=B,l.phaseT+=B,l.phase==="intro"&&l.phaseT>1.9&&(l.phase="fight",l.phaseT=0,M("Fight!",""),setTimeout(()=>l.phase==="fight"&&M("",""),700)),l.phase==="fight"){let se=l.queue.splice(0),U=.15+.035*l.run.round,z=-1;for(let oe=0;oe<2&&z<0;oe++)vh(l.F,1,B/2,l.rand,U,se),l.auto&&vh(l.F,0,B/2,l.rand,.5,se),z=Zd(l.F,B/2,l.rand,se);se.forEach(Z),b(),z>=0&&(l.phase="ending",l.phaseT=0,l.winner=z,l.views[1-z].dead=0,l.cheer=3,l.slow=.9,l.punch=.14,M("K.O.",""),z===0&&wn("win"))}l.phase==="ending"&&l.phaseT>2.1&&(l.winner===0?D():W());for(let se=0;se<2;se++)l.views[se]&&ie(l.views[se],se,B,l.t);o.resize(window.innerHeight),o.update(B),l.cheer=Math.max(0,l.cheer-B*.8);let J=.03+.14*Math.min(l.cheer,1);r.seats.forEach((se,U)=>{r.m4.makeTranslation(se.x,se.y+Math.abs(Math.sin(L*6*(1+U%5*.2)+se.ph))*J,se.z),r.crowd.setMatrixAt(U,r.m4)}),r.crowd.instanceMatrix.needsUpdate=!0,l.confetti&&(l.confetti.bits.forEach((se,U)=>{se.y-=se.v*B,se.y<0&&(se.y=8),r.m4.makeRotationFromEuler(new hn(se.r+l.t*se.w,se.r*2+l.t*se.w*.7,0)).setPosition(se.x+Math.sin(l.t+se.r)*.3,se.y,se.z),l.confetti.mesh.setMatrixAt(U,r.m4)}),l.confetti.mesh.instanceMatrix.needsUpdate=!0),l.shake=Math.max(0,l.shake-w*1.2);let Q=dr(1.9/t.aspect,1,1.6),K=l.phase==="champion";l.punch=Math.max(0,l.punch-w*.35),Math.abs(t.zoom-(1+l.punch))>5e-4&&(t.zoom=1+l.punch,t.updateProjectionMatrix()),t.position.set(Math.sin(l.t*.25)*.8+(Math.random()-.5)*l.shake,(K?1.5:1.9)+(Math.random()-.5)*l.shake,(K?7.2:7.1)*Q),t.lookAt(0,K?-.25:1.05,0)},l.start=(w,L)=>{l.data=w,l.active=!0,l.t=0,l.enemy=null,l.F=null,l.entered=!1,l.freeze=l.slow=l.punch=0,n.sun.target.position.set(0,0,0),n.sun.position.set(3,7,5),l.run=L||{id:w.id,round:0,hp:null,seed:Math.floor(Math.random()*1e9),load:Oa(),bonusHp:0,earned:0,rerolls:n.meta().boosts.reroll||0,draft:null},l.run.load||(l.run.load=Oa()),l.eLoad=null,l.queue=[],u=e.background,e.background=r.sky,r.g.visible=!0,h.classList.remove("hidden"),l.views[0]=p(w,n.M,-1,l.run.load),l.run.draft?A("Back to the sands","Choose your reward:"):l.run.round>0?(l.phase="won",h.replaceChildren(),y(i("h2",null,"Back to the sands"),i("p",null,l.data.name+" has won "+l.run.round+" of "+10+" fights and has "+Math.round(l.run.hp)+" health."),i("div",{class:"row"},i("button",{class:"go",onclick:()=>C()},"Next fight")))):T()},l.back=()=>(l.phase==="gate"&&q({type:"back"}),!0),l}var Rt=n=>document.getElementById(n);function j(n,e,...t){let i=document.createElement(n);for(let[s,r]of Object.entries(e||{}))s==="class"?i.className=r:s==="style"?i.style.cssText=r:s.startsWith("on")?i.addEventListener(s.slice(2),r):r!==!1&&r!=null&&(i[s]=r);for(let s of t.flat())s!=null&&s!==!1&&i.append(s);return i}var Tt={get(n,e){try{let t=localStorage.getItem(n);return t?JSON.parse(t):e}catch{return e}},set(n,e){try{localStorage.setItem(n,JSON.stringify(e))}catch{}}};function ai(n){let e=Rt("toast");e.textContent=n,e.classList.remove("hidden"),clearTimeout(ai.t),ai.t=setTimeout(()=>e.classList.add("hidden"),2200)}var bs=Rt("view"),St=new ra({canvas:bs,antialias:!0,powerPreference:"high-performance"});St.setPixelRatio(Math.min(window.devicePixelRatio||1,2));St.toneMapping=Wc;St.toneMappingExposure=1.05;var Ft=new Js;{let n=document.createElement("canvas");n.width=4,n.height=256;let e=n.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"#3d7f86"),t.addColorStop(.55,"#1c3a40"),t.addColorStop(1,"#0c1719"),e.fillStyle=t,e.fillRect(0,0,4,256);let i=new ni(n);i.colorSpace=Bt,Ft.background=i}var $y=new $s(St);Ft.environment=$y.fromScene(new wa,.04).texture;Ft.environmentIntensity=.55;var Dn=new Wr(16773853,2.2);Dn.position.set(2.5,5,4);Ft.add(Dn);Ft.add(Dn.target);St.shadowMap.enabled=!0;St.shadowMap.type=Gc;Dn.castShadow=!0;Dn.shadow.mapSize.set(1024,1024);Dn.shadow.bias=-6e-4;Dn.shadow.normalBias=.025;Dn.shadow.radius=3;Object.assign(Dn.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.5,far:22});var yf=new Wr(10475775,.9);yf.position.set(-3,2.5,-4);Ft.add(yf);Ft.add(new pa(13626111,3813160,.5));var ht=new Gt(32,1,.05,100),En=Aa(),Jn=new Et;Ft.add(Jn);var oi=new De(new Vn(1,1.06,.06,64),new Nt({color:2377804,roughness:.85})),Zn=new De(new Ks(1,48),new zt({transparent:!0,depthWrite:!1,opacity:.55}));{let n=document.createElement("canvas");n.width=n.height=128;let e=n.getContext("2d"),t=e.createRadialGradient(64,64,4,64,64,64);t.addColorStop(0,"rgba(0,0,0,1)"),t.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=t,e.fillRect(0,0,128,128),Zn.material.map=new ni(n),Zn.material.color.set(0),Zn.rotation.x=-Math.PI/2}oi.receiveShadow=!0;Zn.material.opacity=.3;Jn.add(oi,Zn);var $n=new Et;Ft.add($n);var ys=new De(new un(1,.12,8,32),new zt({color:16757575,depthTest:!1,transparent:!0,opacity:.9}));ys.renderOrder=10;$n.add(ys);var Jy=new tn(1,16,12),Ky=new zt({color:16777215,depthTest:!1,transparent:!0,opacity:.9}),jy=new zt({color:16757575,depthTest:!1,transparent:!0}),Ai=new Et;$n.add(Ai);var oo=new la(new xt,new Vr({color:16777215,depthTest:!1,transparent:!0,opacity:.6}));oo.renderOrder=9;$n.add(oo);var Zt={orbit:null},ue=null,ut=null,dt=null,_n="body",qn=-1,ao=!1,an=!1,Ln=[],pr=[];function mn(){ut&&(Jn.remove(ut.group),Yi(ut.group)),ii(En,ue.look,At[ue.type].bellyDir),ut=ar(ue,En),Jn.add(ut.group),Nh(),uo()}function Nh(){vs=!0;let n=Kr(ut),e=n.getCenter(new I),t=n.getSize(new I),i=Math.max(t.x,t.z)*.42+.15;oi.position.set(e.x,n.min.y-.03,e.z),oi.scale.set(i,1,i),Dn.target.position.copy(e),Dn.position.copy(e).add(new I(2.5,5,4)),Zn.position.set(e.x,n.min.y+.004,e.z),Zn.scale.set(Math.max(t.x,.3)*.75,Math.max(t.z,.3)*.62,1),ut.box=n}function kh(n){let e=ut.box,t=e.getCenter(new I),i=e.getSize(new I).length()/2,s=i/Math.sin(qr.degToRad(ht.fov/2))*.74;Zt.orbit.target.copy(t),ht.position.copy(t).add((n||new I(.75,.28,1)).normalize().multiplyScalar(s)),Zt.orbit.minDistance=i*.5,Zt.orbit.maxDistance=s*2.5,Zt.orbit.update()}function uo(){vs=!0;let n=an&&_n==="body";for(Ai.visible=oo.visible=n;Ai.children.length;)Ai.remove(Ai.children[0]);if(n){let t=[],i=(ut.frames.m-1)/(ue.nodes.length-1);ue.nodes.forEach((s,r)=>{let o=ut.frames.C[Math.round(r*i)],a=new De(Jy,r===qn?jy:Ky);a.position.copy(o),a.userData.node=r,a.renderOrder=11,Ai.add(a),t.push(o)}),oo.geometry.dispose(),oo.geometry=new xt().setFromPoints(t)}let e=dt&&dt!=="body"&&ut.parts.get(dt);ys.visible=!!(an&&e&&e.userData.anchor),ys.visible&&ys.position.copy(e.userData.anchor)}function gn(){var e;let n=JSON.stringify(ue);Ln[Ln.length-1]!==n&&(Ln.push(n),Ln.length>60&&Ln.shift(),pr=[]),Tt.set("cc.current",ue),an&&((e=document.activeElement)==null?void 0:e.tagName)!=="INPUT"&&Bh()}function mf(n){ue=JSON.parse(n),dt&&dt!=="body"&&!ue.parts.find(e=>e.id===dt)&&(dt=null),mn(),Ci(),Tt.set("cc.current",ue)}var co=n=>ue.parts.find(e=>e.id===n),Ih=new zn(256,256,{samples:4}),no=new Gt(30,1,.01,100);function vf(n,e,t,i,s){let r=t.getCenter(new I),o=Math.max(t.getSize(new I).length()/2,.01);no.aspect=n/e,no.updateProjectionMatrix(),no.position.copy(r).add(i.clone().normalize().multiplyScalar(o/Math.sin(qr.degToRad(15))*(n>e?.92:1.02))),no.lookAt(r),Ih.setSize(n,e);let a=$n.visible;$n.visible=!1;let c=St.toneMapping;St.toneMapping=ti,St.setRenderTarget(Ih),St.render(Ft,no),St.setRenderTarget(null),St.toneMapping=c,$n.visible=a;let h=new Uint8Array(n*e*4);St.readRenderTargetPixels(Ih,0,0,n,e,h);let l=document.createElement("canvas");l.width=n,l.height=e;let u=l.getContext("2d"),f=u.createImageData(n,e),p=new Uint8Array(256);for(let g=0;g<256;g++)p[g]=Math.round(255*Math.pow(Math.min(g/255*1.1,1),1/2.2));for(let g=0;g<e;g++)for(let _=0;_<n;_++){let m=((e-1-g)*n+_)*4,d=(g*n+_)*4;f.data[d]=p[h[m]],f.data[d+1]=p[h[m+1]],f.data[d+2]=p[h[m+2]],f.data[d+3]=255}return u.putImageData(f,0,0),l.toDataURL(s||"image/jpeg",.85)}function Ha(n){let e=ut,t=oi.visible;e&&(e.group.visible=!1),ii(En,n.look,At[n.type].bellyDir);let i=ar(n,En);Jn.add(i.group),oi.visible=Zn.visible=!1;let s=vf(240,192,Kr(i),new I(.8,.25,1));return Jn.remove(i.group),Yi(i.group),oi.visible=Zn.visible=t,e&&(e.group.visible=!0,ii(En,ue.look,At[ue.type].bellyDir)),s}var Lh={},Qy={base:"#9fb6b0",second:"#5c7a76",belly:"#c9d8d2",bellyAmt:.5,pattern:0,patScale:1,cover:"skin",furLen:0,furDroop:0,accent:"#efe6cf",hair:"#d98a3a",membrane:"#d99a8a",eye:"#3f9f6a"};function Dh(n){if(Lh[n])return Lh[n];let e=Pt[n],t={type:"quadruped",sex:"f",dimorph:0,bulk:1,stretch:1,look:Qy,parts:[],nodes:[{y:0,z:-.25,rx:.3,ry:.3},{y:0,z:.25,rx:.3,ry:.3}]},i={limbs:[.5,1.9],wings:[.5,.9],tails:[-.9,0],back:[.5,0],mouth:[1.9,Math.PI],eyes:[1.3,1]}[e.cat]||[.6,.6],s=ut;s&&(s.group.visible=!1),ii(En,t.look,[0,-1,0]);let r=ar(t,En),o=ri(t,n,r.frames,i,{mirror:!1,size:e.kind==="surface"?.3:e.ridge?.18:.7}),a=Da(r,o);r.body.visible=e.ridge||n==="shell",Jn.add(r.group);let c=oi.visible;oi.visible=Zn.visible=!1;let h=Ft.background;Ft.background=new Pe(1452075);let l=new Sn().setFromObject(e.ridge?r.group:a),u={mouth:[1,.3,.8],eyes:[.6,.2,1],tails:[1,.3,-.3],limbs:[1,.15,.7]}[e.cat]||[1,.4,.8],f=vf(112,112,l,new I(...u),"image/png");return Ft.background=h,oi.visible=Zn.visible=c,Jn.remove(r.group),Yi(r.group),s&&(s.group.visible=!0,ii(En,ue.look,At[ue.type].bellyDir)),Lh[n]=f}var io={x:0,y:0,w:1,h:1};function xr(){let n=window.innerWidth,e=window.innerHeight;if(St.setSize(n,e,!1),$i.active){ht.clearViewOffset(),ht.aspect=n/e,ht.zoom=1,ht.updateProjectionMatrix();return}let t=0,i=0,s=0;an&&(t=Rt("left").getBoundingClientRect().right,s=Rt("topbar").getBoundingClientRect().bottom,i=Rt("right").classList.contains("hidden")?0:n-Rt("right").getBoundingClientRect().left),io={x:t,y:s,w:Math.max(n-t-i,50),h:Math.max(e-s,50)},ht.aspect=n/e;let r=t+io.w/2,o=s+io.h/2;ht.setViewOffset(n,e,n/2-r,e/2-o,n,e),ht.zoom=Math.min(io.w,io.h*1.15)*.82/e,ht.updateProjectionMatrix(),vs=!0}window.addEventListener("resize",()=>{an&&!$i.active?Ci():xr()});var gf=performance.now();function bf(n){requestAnimationFrame(bf);let e=Math.min((n-gf)/1e3,.1);if(gf=n,window.__ccPause)return;if($i.active){$i.update(e,n/1e3),St.render(Ft,ht);return}if(!an||!ut||(Zt.orbit.autoRotate=ao,Zt.orbit.update(e),Zi&&(Zi=!1,mn()),!vs&&!ao))return;vs=!1;let i=ht.position.distanceTo(Zt.orbit.target)*.0075/ht.zoom;Ai.children.forEach(s=>s.scale.setScalar(i*(s.userData.node===qn?1.5:1.1))),ys.scale.setScalar(i*1.7),ys.quaternion.copy(ht.quaternion),St.render(Ft,ht)}var Zi=!1,vs=!0,ev=()=>{vs=!0},ho=new _a,_f=new be,st={id:-1,x:0,y:0,t:0,mode:null,moved:!1,node:-1,count:0};function Va(n){_f.set(n.clientX/window.innerWidth*2-1,-(n.clientY/window.innerHeight)*2+1),ho.setFromCamera(_f,ht)}function Fh(){let n=ho.intersectObject(ut.group,!0);for(let e of n){let t=e.object;for(;t&&!t.userData.partId;)t=t.parent;if(t)return t.userData.partId}return null}bs.addEventListener("pointerdown",n=>{if(an){if(st.count++,st.count>1){st.mode&&Mf(),st.mode=null,Zt.orbit.enabled=!0;return}if(Object.assign(st,{id:n.pointerId,x:n.clientX,y:n.clientY,t:performance.now(),mode:null,moved:!1}),Va(n),_n==="body"){let e=ho.intersectObjects(Ai.children),t=-1,i=20;if(Ai.children.forEach(s=>{let r=s.position.clone().project(ht),o=(r.x*.5+.5)*innerWidth-n.clientX,a=(-r.y*.5+.5)*innerHeight-n.clientY,c=Math.hypot(o,a);c<i&&(i=c,t=s.userData.node)}),e.length&&(t=e[0].object.userData.node),t>=0){st.mode="node",st.node=t,qn=t,Zt.orbit.enabled=!1,uo(),Yn();return}}dt&&dt!=="body"&&Fh()===dt&&(st.mode="part",Zt.orbit.enabled=!1,Jr(ut,dt))}},!0);bs.addEventListener("pointermove",n=>{if(!(!an||n.pointerId!==st.id)&&(Math.hypot(n.clientX-st.x,n.clientY-st.y)>9&&(st.moved=!0),!(!st.mode||!st.moved))){if(Va(n),st.mode==="node"){let e=ho.ray.intersectPlane(new bn(new I(1,0,0),0),new I);if(e){let t=ue.nodes[st.node];t.y=e.y,t.z=e.z,Zi=!0}}else if(st.mode==="part"){let e=ho.intersectObject(ut.body,!1)[0];if(e&&e.uv){let t=co(dt);t.u=e.uv.x,t.a=e.uv.y*Math.PI*2,t.mirror&&(t.a=dh(t).a),Da(ut,t),uo()}}}});function Mf(){st.mode==="part"&&(Jr(ut),Nh()),st.mode&&st.moved&&gn(),Zt.orbit.enabled=!0}function Sf(n){if(!an||(st.count=Math.max(0,st.count-1),n.pointerId!==st.id))return;st.id=-1;let e=!st.moved&&performance.now()-st.t<450;if(Mf(),e&&st.mode!=="node"){Va(n);let t=Fh();gr(t)}st.mode=null}bs.addEventListener("pointerup",Sf);bs.addEventListener("pointercancel",Sf);function gr(n){if(dt=n,n&&n!=="body"){let e=Pt[co(n).kind].cat;_n!==e&&(_n=e)}n==="body"&&(_n="body"),Ci()}function on(n,e,t,i,s,r,o){let a=j("span",null,""),c=()=>h.style.setProperty("--p",(h.value-e)/(t-e)*100+"%"),h=j("input",{type:"range",min:e,max:t,step:o||(t-e)/200,value:i,oninput:()=>{c(),s(parseFloat(h.value))},onchange:()=>{(r||gn)(parseFloat(h.value))}});return c(),j("div",{class:"sl"},j("label",null,n,a),h)}function mr(n,e,t){return j("div",{class:"chips"},n.map(([i,s])=>j("button",{class:i===e?"on":"",onclick:()=>t(i)},s)))}var tv=["#f4f0e6","#d9d2c2","#a8a29a","#6b6660","#3a3632","#14100e","#f3e6d0","#e8c9a0","#c99573","#a06a45","#6b4a2e","#3a2616","#f2c230","#e8a020","#d9702a","#c8501c","#a8301c","#701818","#f2a0b0","#e06a8a","#c4472e","#b03080","#7a3aa0","#4a2a7a","#bfe8e0","#7fc4d0","#3a9fc2","#2f7fc2","#1f4f9a","#1c2f5a","#c8e6a0","#9fb86a","#4faa4a","#2f6b3a","#1f4a3a","#12281a","#e6dfa0","#b8b060","#7a8a3a","#8fb0ab"],nv=[["base","Main"],["second","Pattern"],["belly","Belly"],["eye","Eyes"],["accent","Horn, claw"],["hair","Hair, feather"],["membrane","Wing skin"]],so="base",iv=n=>n==="eye";function qi(n,e,t){ue.look[n]=e,iv(n)||n==="cover"?t||n==="cover"?mn():Zi=!0:ii(En,ue.look,At[ue.type].bellyDir),vs=!0,t&&gn()}var sv={body:'<path d="M7 5c5-3 11 1 10 7s-6 9-10 7-4-11 0-14z"/>',eyes:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',mouth:'<path d="M3 9c3 2 15 2 18 0-1 7-5 9-9 9s-8-2-9-9z"/><path d="M8 10l1 3 1.5-3M13.5 10l1.5 3 1-3"/>',ears:'<path d="M5 20C3 12 6 4 9 3c2 4 3 8 2 13M19 20c2-8-1-16-4-17-2 4-3 8-2 13"/>',horns:'<path d="M7 20c-4-5-4-12 0-17 0 6 2 9 5 11M17 20c4-5 4-12 0-17 0 6-2 9-5 11"/>',limbs:'<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17" cy="9" r="2"/><path d="M7 17c0-3 2-5 5-5s5 2 5 5-2 3-5 3-5 0-5-3z"/>',wings:'<path d="M3 6c7-2 14 1 18 8-4-1-6 0-8 2-1-3-4-4-6-3 0-3-2-5-4-7z"/>',tails:'<path d="M4 18c6 2 12-2 12-7s-5-6-7-3 1 5 4 4"/>',back:'<path d="M2 18c4-6 16-6 20 0M7 13l1-5 2 4M12 12l1-6 1.5 6M16 13l2-4 0 5"/>',skin:'<path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z"/>'},rv=n=>{let e=document.createElement("span");return e.innerHTML='<svg class="ic" viewBox="0 0 24 24">'+sv[n]+"</svg>",e.firstChild};function ov(){let n=Rt("tabs");n.replaceChildren();for(let[e,t]of[["body","Body"],...Pa,["skin","Skin"]])n.append(j("button",{class:_n===e?"on":"",onclick:()=>{_n=e,dt=null,Ci()}},rv(e),t))}var Uh=()=>window.innerWidth<1e3;function Yn(){let n=Rt("left");if(n.replaceChildren(),n.scrollTop=0,Uh()&&dt&&dt!=="body"&&co(dt)){Oh(n,co(dt));return}if(_n==="body"){if(n.append(j("h3",null,"Body shape"),j("p",{class:"note"},"Drag the white dots to bend and stretch the spine. Tap a dot to change how thick the body is there.")),qn>=0&&ue.nodes[qn]){let i=ue.nodes[qn];n.append(j("h4",null,"Selected section"),on("Width",.02,.6,i.rx,s=>{i.rx=s,Zi=!0}),on("Depth",.02,.6,i.ry,s=>{i.ry=s,Zi=!0}),j("div",{class:"row"},j("button",{onclick:()=>{let s=Math.min(qn,ue.nodes.length-2),r=ue.nodes[s],o=ue.nodes[s+1],a=ue.nodes.length-1;ue.nodes.splice(s+1,0,{y:(r.y+o.y)/2,z:(r.z+o.z)/2,rx:(r.rx+o.rx)/2,ry:(r.ry+o.ry)/2,role:o.role});for(let c of ue.parts)if(c.u>=0&&c.u<=1){let h=c.u*a;c.u=(h>s?h<s+1?s+(h-s)*2:h+1:h)/(a+1)}qn=s+1,mn(),gn(),Yn()}},"Add section"),j("button",{class:"warn",disabled:ue.nodes.length<=3,onclick:()=>{let s=ue.nodes.length-1,r=qn;ue.nodes.splice(r,1);for(let o of ue.parts)if(o.u>=0&&o.u<=1){let a=o.u*s;o.u=Wn((a>r?a-1:a)/(s-1),0,1)}qn=-1,mn(),gn(),Yn()}},"Remove")))}let t=i=>{let s=ue.nodes.reduce((o,a)=>o+a.y,0)/ue.nodes.length,r=ue.nodes.reduce((o,a)=>o+a.z,0)/ue.nodes.length;for(let o of ue.nodes)o.y=s+(o.y-s)*i,o.z=r+(o.z-r)*i;mn(),gn()};n.append(j("h4",null,"Whole body"),j("div",{class:"row"},j("button",{onclick:()=>t(1.08)},"Longer"),j("button",{onclick:()=>t(1/1.08)},"Shorter")),on("Bulk",.5,1.8,ue.bulk,i=>{ue.bulk=i,Zi=!0}),j("h4",null,"Male / female"),j("p",{class:"note"},"How different the two sexes look: build, limb thickness, and the size of horns, crests and manes."),on("Difference",0,1.6,ue.dimorph,i=>{ue.dimorph=i,Zi=!0}));return}if(_n==="skin"){let t=ue.look;n.append(j("h3",null,"Skin and colour"),j("h4",null,"Covering"),mr([["skin","Smooth"],["fur","Fur"],["scales","Scales"],["chitin","Shell"],["slime","Slick"]],t.cover,r=>{qi("cover",r,!0),Yn()})),t.cover==="fur"&&n.append(on("Fur length",0,1,t.furLen,r=>qi("furLen",r)),on("Shagginess",0,1,t.furDroop,r=>qi("furDroop",r))),n.append(j("h4",null,"Colours"),j("div",{class:"cols"},nv.map(([r,o])=>j("button",{class:"colbtn"+(so===r?" on":""),onclick:()=>{so=r,Yn()}},j("i",{style:"background:"+t[r]}),o))),j("div",{class:"sw"},tv.map(r=>j("button",{style:"background:"+r,onclick:()=>{qi(so,r,!0),Yn()}}))));let i={};new Pe(t[so]).getHSL(i);let s=r=>{qi(so,"#"+new Pe().setHSL(i.h,i.s,i.l).getHexString(),r),r&&Yn()};n.append(on("Hue",0,1,i.h,r=>{i.h=r,s()},()=>s(!0)),on("Richness",0,1,i.s,r=>{i.s=r,s()},()=>s(!0)),on("Lightness",.03,.97,i.l,r=>{i.l=r,s()},()=>s(!0)),j("h4",null,"Pattern"),mr([[0,"Plain"],[1,"Stripes"],[2,"Spots"],[3,"Patches"],[4,"Mosaic"],[5,"Saddle"],[6,"Speckle"],[7,"Bands"]],t.pattern,r=>{qi("pattern",r,!0),Yn()}),on("Pattern size",.3,3.5,3.8-t.patScale,r=>qi("patScale",3.8-r)),on("Belly colour",0,1,t.bellyAmt,r=>qi("bellyAmt",r)),j("div",{class:"row"},j("button",{onclick:()=>{let r=Math.random(),o=(a,c,h)=>"#"+new Pe().setHSL((a+1)%1,c,h).getHexString();Object.assign(t,{base:o(r,.3+Math.random()*.5,.3+Math.random()*.35),second:o(r+(Math.random()-.5)*.5,.4+Math.random()*.4,.12+Math.random()*.3),belly:o(r+.05,.25,.8),hair:o(r+.5*Math.random(),.5,.25+Math.random()*.3),membrane:o(r+.08,.45,.6),eye:o(Math.random(),.75,.45),pattern:Math.floor(Math.random()*8)}),mn(),gn(),Yn()}},"Surprise me")));return}n.append(j("h3",null,Pa.find(t=>t[0]===_n)[1]),j("p",{class:"note"},"Tap to add. Then tap the part on your creature and drag it where you want it."));let e=j("div",{class:"grid"});for(let[t,i]of Object.entries(Pt))i.cat===_n&&(wh(it,t)?e.append(j("button",{class:"tile",onclick:()=>{let s=ri(ue,t,ut.frames);mn(),gn(),gr(s.id)}},j("img",{src:Dh(t),alt:""}),i.n)):e.append(j("button",{class:"tile locked",onclick:()=>lo("part:"+t,Qr[t],i.n,Yn)},j("img",{src:Dh(t),alt:""}),i.n,j("small",null,"Locked \xB7 "+Qr[t]))));n.append(e)}var av={human:"Toes",paw:"Paw",hoof:"Hoof",talon:"Talons",webbed:"Webbed",stump:"Stump",point:"Spike",none:"None",claw:"Claws",pincer:"Pincer",mitt:"Mitt"};function lv(){let n=Rt("right"),e=dt&&dt!=="body"?co(dt):null;n.classList.toggle("hidden",!e||Uh()),n.replaceChildren(),e&&!Uh()&&Oh(n,e)}function Oh(n,e){var a;let t=Pt[e.kind],i=()=>{n.replaceChildren(),Oh(n,e)},s=()=>{Da(ut,e),uo()},r=()=>{Jr(ut),Nh(),gn()},o=e.size;n.append(j("h3",null,t.n),j("p",{class:"note"},t.ridge?"Drag it along the body to move the row.":"Drag it on the creature to move it."),on(t.cat==="limbs"?"Length":"Size",-2,2,0,c=>{e.size=o*Math.pow(2,c),s()},r));for(let[c,h]of Object.entries(t.P||{})){if(c==="suckers"){n.append(mr([[1,"Suckers"],[0,"Smooth"]],e.p[c],l=>{e.p[c]=l,s(),r(),i()}));continue}n.append(on(h[3],h[0],h[1],(a=e.p[c])!=null?a:h[2],l=>{e.p[c]=l,s()},r,["count","feathers","tines"].includes(c)?1:0))}if(t.C)for(let[c,h]of Object.entries(t.C))n.append(j("h4",null,h.includes("paw")?"Foot":"Hand"),mr(h.map(l=>[l,av[l]]),e.p[c],l=>{e.p[c]=l,s(),r(),i()}));t.kind==="surface"&&n.append(j("h4",null,"Angle"),on("Twist",-3.14,3.14,e.rot,c=>{e.rot=c,s()},r),on("Tilt",-1.5,1.5,e.tilt,c=>{e.tilt=c,s()},r)),n.append(j("h4",null,"Pair"),mr([[!0,"Mirrored pair"],[!1,"Single"]],e.mirror,c=>{e.mirror=c,s(),r(),i()})),n.append(j("h4",null,"Shown on"),mr([[null,"Both"],["f","Female only"],["m","Male only"]],e.sexOnly,c=>{e.sexOnly=c,s(),r(),i()}),j("div",{class:"row",style:"margin-top:10px"},j("button",{onclick:()=>{let c=JSON.parse(JSON.stringify(e));c.id="p"+Date.now().toString(36),c.u=Wn(c.u-.08,-.9,1.9),ue.parts.push(c),mn(),gn(),gr(c.id)}},"Copy"),j("button",{class:"warn",onclick:()=>{ue.parts=ue.parts.filter(c=>c.id!==e.id),dt=null,mn(),gn(),Ci()}},"Delete")),j("div",{class:"row"},j("button",{onclick:()=>gr(null)},"Done")))}function Bh(){Rt("topbar").replaceChildren(j("button",{onclick:wf},"Home"),j("input",{value:ue.name,maxLength:30,onchange:e=>{ue.name=e.target.value||"Creature",gn()}}),j("div",{class:"seg"},j("button",{class:ue.sex==="f"?"on":"",onclick:()=>xf("f")},"Female"),j("button",{class:ue.sex==="m"?"on":"",onclick:()=>xf("m")},"Male")),j("button",{disabled:Ln.length<2,onclick:()=>{Ln.length>1&&(pr.push(Ln.pop()),mf(Ln[Ln.length-1]))}},"Undo"),j("button",{disabled:!pr.length,onclick:()=>{if(pr.length){let e=pr.pop();Ln.push(e),mf(e)}}},"Redo"),j("button",{class:ao?"on":"",onclick:()=>{ao=!ao,Bh()}},"Spin"),j("button",{onclick:hv},"Photo"),j("button",{onclick:()=>zh()},"Save"),j("button",{class:"battle",onclick:Hh},"\u2694\uFE0F Battle"))}function xf(n){ue.sex=n,mn(),gn(),Ci()}function Ci(){ov(),Yn(),lv(),Bh(),xr(),uo(),Rt("hint").textContent=dt&&dt!=="body"?"":"Drag to spin. Pinch to zoom. Tap a part to select it."}function zh(n){ue.id||(ue.id="c"+Date.now().toString(36));let e=Tt.get("cc.saved",[]).filter(t=>t.id!==ue.id);e.unshift({id:ue.id,name:ue.name,thumb:Ha(ue),data:JSON.parse(JSON.stringify(ue))}),Tt.set("cc.saved",e),Tt.set("cc.current",ue),n||ai('Saved "'+ue.name+'"')}var it=Tt.get("cc.meta",null);if(!it){it=Object.assign(Mh(),Tt.get("cc.record",{}));for(let n of[...Tt.get("cc.saved",[]).map(e=>e.data),Tt.get("cc.current",null)])n&&!bh.includes(n.type)&&(it.unlocked["type:"+n.type]=!0)}it=Object.assign(Mh(),it);var _r=()=>Tt.set("cc.meta",it);function lo(n,e,t,i){if(it.points<e){ai("Not enough points: "+t+" costs "+e+", you have "+it.points+".");return}confirm("Unlock "+t+" for "+e+" points?")&&(it.points-=e,it.unlocked[n]=!0,_r(),ai("Unlocked "+t),i&&i())}var $i=pf({scene:Ft,camera:ht,M:En,h:j,store:Tt,sun:Dn,onDone:cv,meta:()=>it,saveMeta:_r});function Hh(n){zh(!0),dt=null,Zt.orbit.enabled=!1,Rt("editor").classList.add("hidden"),Rt("start").classList.add("hidden"),Jn.visible=$n.visible=!1,ii(En,ue.look,At[ue.type].bellyDir),$i.start(ue,n&&n.id===ue.id?n:null),xr()}function cv(n){Jn.visible=$n.visible=!0,Zt.orbit.enabled=!0;for(let t of[En.skin,...En.shells])t.emissive.setRGB(0,0,0);let e=it;if(n.type==="dead"){e.fallen++,_r(),Tt.set("cc.saved",Tt.get("cc.saved",[]).filter(t=>t.id!==ue.id)),Tt.set("cc.current",null),ut&&(Jn.remove(ut.group),Yi(ut.group),ut=null),ue=null,an=!1,Rt("start").classList.remove("hidden"),pn(),xr();return}n.type==="champion"&&(e.points+=n.points,e.champions++,_r(),ue.champion=(ue.champion||0)+1),an=!0,Rt("editor").classList.remove("hidden"),mn(),n.type==="champion"&&zh(!0),Ci(),kh(),n.type==="champion"&&ai(ue.name+" is champion! +"+n.points+" points")}function hv(){let t=St.getPixelRatio(),i=ht.zoom;$n.visible=!1,St.setPixelRatio(1),St.setSize(1920,1080,!1),ht.clearViewOffset(),ht.aspect=1920/1080,ht.zoom=i,ht.updateProjectionMatrix(),St.render(Ft,ht);let s=bs.toDataURL("image/png");$n.visible=!0,St.setPixelRatio(t),ht.zoom=i,xr(),St.render(Ft,ht);let r=(ue.name||"creature").replace(/[^\w-]+/g,"_")+"_"+Date.now().toString(36)+".png";window.Android&&window.Android.savePng?window.Android.savePng(s.split(",")[1],r):(j("a",{href:s,download:r}).click(),ai("Photo downloaded"))}window.ccToast=ai;window.ccBack=()=>$i.active?$i.back():!an&&Ri?(Ri=null,pn(),!0):an?(dt?gr(null):wf(),!0):!1;function ro(n){let e=Tt.get("cc.run",null);e&&n.id&&e.id===n.id&&(Tt.set("cc.run",null),ai("Gauntlet abandoned. It starts again from fight one.")),ue=n,dt=null,qn=-1,_n="body",Ln=[],pr=[],an=!0,ue.sex===void 0&&(ue.sex="f"),Rt("start").classList.add("hidden"),Rt("editor").classList.remove("hidden"),mn(),gn(),Ci(),kh()}function wf(){Tt.set("cc.current",ue),an=!1,Rt("editor").classList.add("hidden"),Rt("start").classList.remove("hidden"),pn()}var za={},Ri=null;function uv(){let n=Rt("start"),e=(r,o,a,c,h,l,u)=>j("div",{class:"shoprow"+(h?" owned":"")},j("div",{class:"ico"},r),j("div",{class:"what"},j("b",null,o),u&&j("small",{class:"req"},u),j("small",null,a)),h?j("span",{class:"have"},typeof h=="string"?h:"Owned"):j("button",{class:it.points>=c?"go":"",onclick:l},c+" pts")),t=r=>cr.filter(o=>o.cat===r).sort((o,a)=>o.cost-a.cost).map(o=>e(o.icon,o.name,Ba({id:o.id,cat:r,q:1,rar:0,lvl:1}),o.cost,Eh(it,o)&&(o.cost?"Owned":"Free"),()=>lo("item:"+r+":"+o.id,o.cost,o.name,pn),o.reqText?"Needs "+o.reqText:o.hands===2?"Needs two free hands":"")),i={Bodies:()=>Object.entries(At).map(([r,o])=>e("\u{1F9EC}",o.name,o.blurb,hr[r],Fa(it,r)&&(hr[r]?"Owned":"Free"),()=>lo("type:"+r,hr[r],"the "+o.name+" body",pn))),Parts:()=>Object.entries(Qr).map(([r,o])=>e(j("img",{src:Dh(r),alt:""}),Pt[r].n,"Body part for the workshop ("+Pa.find(a=>a[0]===Pt[r].cat)[1]+").",o,wh(it,r),()=>lo("part:"+r,o,Pt[r].n,pn))),Weapons:()=>t("weapon"),Abilities:()=>t("ability"),Relics:()=>t("relic"),Boosts:()=>Kd.map(r=>{let o=r.consumable?it.revives:it.boosts[r.id]||0,a=o>=r.max,c=r.cost(o);return e(r.icon,r.name+(r.consumable?" (holding "+o+")":r.max>1?" (level "+o+" of "+r.max+")":""),r.text,c,a&&(r.consumable?"Full":"Maxed"),()=>{if(it.points<c){ai("Not enough points: "+r.name+" costs "+c+", you have "+it.points+".");return}it.points-=c,r.consumable?it.revives++:it.boosts[r.id]=o+1,_r(),pn()})})},s={Weapons:"Weapons you own can turn up as rewards after a fight. A creature holds one per hand.",Abilities:"Abilities you own can turn up as rewards, if the creature has the right body for them.",Relics:"Relics are passive rewards that stack. Many only work, or work better, with the right body.",Parts:"Extra parts for building creatures. Starter creatures may already carry some of these.",Bodies:"New body types to start from.",Boosts:"Permanent upgrades, and revives."};n.replaceChildren(j("h1",null,"The ",j("span",null,"Shop"),j("small",{class:"record"},j("b",null,it.points+" points")," ",j("button",{class:"shopbtn",onclick:()=>{Ri=null,pn()}},"Back"))),j("div",{class:"chips",style:"margin-top:10px"},Object.keys(i).map(r=>j("button",{class:r===Ri?"on":"",onclick:()=>{Ri=r,pn()}},r))),j("p",{class:"note"},s[Ri]+" Points come from every fight won (more for later fights) and a big bonus for the title."),j("div",{class:"shop"},i[Ri]())),n.scrollTop=0}function pn(){let n=Rt("start"),e=Tt.get("cc.saved",[]),t=Tt.get("cc.current",null);if(Ri){uv();return}let i=it,s=Tt.get("cc.run",null),r=s&&t&&t.id===s.id;n.replaceChildren(...[j("h1",null,"Creature ",j("span",null,"Workshop"),j("small",{class:"record"},j("button",{class:"shopbtn",onclick:()=>{Ri="Bodies",pn()}},"Shop")," ",j("b",null,i.points+" points")," \xB7 "+i.champions+(i.champions===1?" champion":" champions")+" \xB7 "+i.fallen+" fallen")),r&&j("div",{class:"card resume",onclick:()=>{ue=t,Hh(s)}},j("b",null,"Gauntlet in progress"),j("small",null,t.name+" is waiting for fight "+(s.round+1)+" of 10. Tap to return to the Colosseum.")),j("h2",null,"Start from a body type"),j("div",{class:"cards"},j("div",{class:"card",onclick:()=>{let o=Object.keys(At).filter(a=>Fa(it,a));ro(to(Math.random,{type:o[Math.floor(Math.random()*o.length)]}))}},j("div",{class:"dice"},"?"),j("b",null,"Random"),j("small",null,"Roll a surprise creature")),Object.entries(At).map(([o,a])=>Fa(it,o)?j("div",{class:"card",onclick:()=>ro(xs(o))},j("img",{src:za[o]||(za[o]=Ha(xs(o))),alt:""}),j("b",null,a.name),j("small",null,a.blurb)):j("div",{class:"card locked",onclick:()=>lo("type:"+o,hr[o],"the "+a.name+" body",pn)},j("img",{src:za[o]||(za[o]=Ha(xs(o))),alt:""}),j("b",null,a.name),j("small",null,"Locked \xB7 "+hr[o]+" points"))))].filter(Boolean)),(t||e.length)&&n.append(j("h2",null,"Your creatures"),j("div",{class:"cards"},t&&j("div",{class:"card",onclick:()=>ro(t)},j("img",{src:Ha(t),alt:""}),j("b",null,"Continue"),j("small",null,t.name)),e.map(o=>j("div",{class:"card",onclick:()=>ro(JSON.parse(JSON.stringify(o.data)))},j("img",{src:o.thumb,alt:""}),j("b",null,o.name),j("small",null,At[o.data.type].name+(o.data.champion?" \xB7 Champion"+(o.data.champion>1?" x"+o.data.champion:""):"")),j("button",{class:"del warn",onclick:a=>{a.stopPropagation(),confirm('Delete "'+o.name+'"?')&&(Tt.set("cc.saved",Tt.get("cc.saved",[]).filter(c=>c.id!==o.id)),pn())}},"\xD7")))))}Zt.orbit=new Sa(ht,bs);Object.assign(Zt.orbit,{enableDamping:!0,dampingFactor:.12,enablePan:!1,autoRotateSpeed:2.2,rotateSpeed:.9,maxPolarAngle:Math.PI*.62,minPolarAngle:.15});Zt.orbit.addEventListener("change",ev);xr();pn();requestAnimationFrame(bf);window.__cc={get data(){return ue},get cr(){return ut},open:ro,newCreature:xs,select:gr,PARTS:Pt,TEMPLATES:At,setTab:n=>{_n=n,Ci()},camera:ht,controls:Zt,fitCamera:kh,rebuild:mn,renderer:St,scene:Ft,arena:$i,get meta(){return it},saveMeta:_r,renderStart:pn,enterBattle:Hh,randomCreature:to,addPartTest:n=>ri(ue,n,ut.frames),pickAt:(n,e)=>(Va({clientX:n,clientY:e}),Fh()),state:()=>({sel:dt,tab:_n,down:{...st}})};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
