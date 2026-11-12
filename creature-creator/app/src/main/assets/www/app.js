(()=>{var cs={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},hs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},rf=0,kh=1,of=2;var qu=1,af=2,fi=3,Fi=0,qt=1,Ht=2,Ni=0,Bs=1,Oh=2,Bh=3,zh=4,lf=5,es=100,cf=101,hf=102,uf=103,df=104,ff=200,pf=201,mf=202,gf=203,_l=204,xl=205,_f=206,xf=207,yf=208,vf=209,bf=210,Mf=211,Sf=212,wf=213,Ef=214,yl=0,vl=1,bl=2,Gs=3,Ml=4,Sl=5,wl=6,El=7,Zu=0,Tf=1,Af=2,jn=0,Rf=1,Cf=2,Pf=3,Uc=4,If=5,Lf=6,Df=7;var $u=300,Ws=301,Xs=302,Tl=303,Al=304,fa=306,Dr=1e3,is=1001,Rl=1002,bn=1003,Uf=1004;var fo=1005;var Jn=1006,ka=1007;var ss=1008;var gi=1009,Ju=1010,Ku=1011,Ur=1012,Nc=1013,rs=1014,Kn=1015,Wr=1016,Fc=1017,kc=1018,Ys=1020,ju=35902,Qu=1021,ed=1022,kn=1023,td=1024,nd=1025,zs=1026,qs=1027,Oc=1028,Bc=1029,id=1030,zc=1031;var Hc=1033,Bo=33776,zo=33777,Ho=33778,Vo=33779,Cl=35840,Pl=35841,Il=35842,Ll=35843,Dl=36196,Ul=37492,Nl=37496,Fl=37808,kl=37809,Ol=37810,Bl=37811,zl=37812,Hl=37813,Vl=37814,Gl=37815,Wl=37816,Xl=37817,Yl=37818,ql=37819,Zl=37820,$l=37821,Go=36492,Jl=36494,Kl=36495,sd=36283,jl=36284,Ql=36285,ec=36286;var Wo=2300,tc=2301,Oa=2302,Hh=2400,Vh=2401,Gh=2402;var Nf=3200,Ff=3201;var rd=0,kf=1,Ui="",Ft="srgb",Qs="srgb-linear",pa="linear",st="srgb";var Ms=7680;var Wh=519,Of=512,Bf=513,zf=514,od=515,Hf=516,Vf=517,Gf=518,Wf=519,Xh=35044;var Yh="300 es",pi=2e3,Xo=2001,_i=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let i=this._listeners[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Xt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],qh=1234567,Pr=Math.PI/180,Nr=180/Math.PI;function er(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xt[n&255]+Xt[n>>8&255]+Xt[n>>16&255]+Xt[n>>24&255]+"-"+Xt[e&255]+Xt[e>>8&255]+"-"+Xt[e>>16&15|64]+Xt[e>>24&255]+"-"+Xt[t&63|128]+Xt[t>>8&255]+"-"+Xt[t>>16&255]+Xt[t>>24&255]+Xt[i&255]+Xt[i>>8&255]+Xt[i>>16&255]+Xt[i>>24&255]).toLowerCase()}function Pt(n,e,t){return Math.max(e,Math.min(t,n))}function Vc(n,e){return(n%e+e)%e}function Xf(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Yf(n,e,t){return n!==e?(t-n)/(e-n):0}function Ir(n,e,t){return(1-t)*n+t*e}function qf(n,e,t,i){return Ir(n,e,1-Math.exp(-t*i))}function Zf(n,e=1){return e-Math.abs(Vc(n,e*2)-e)}function $f(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Jf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Kf(n,e){return n+Math.floor(Math.random()*(e-n+1))}function jf(n,e){return n+Math.random()*(e-n)}function Qf(n){return n*(.5-Math.random())}function ep(n){n!==void 0&&(qh=n);let e=qh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function tp(n){return n*Pr}function np(n){return n*Nr}function ip(n){return(n&n-1)===0&&n!==0}function sp(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function rp(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function op(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+i)/2),h=o((e+i)/2),u=r((e-i)/2),m=o((e-i)/2),p=r((i-e)/2),g=o((i-e)/2);switch(s){case"XYX":n.set(a*h,c*u,c*m,a*l);break;case"YZY":n.set(c*m,a*h,c*u,a*l);break;case"ZXZ":n.set(c*u,c*m,a*h,a*l);break;case"XZX":n.set(a*h,c*g,c*p,a*l);break;case"YXY":n.set(c*p,a*h,c*g,a*l);break;case"ZYZ":n.set(c*g,c*p,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ks(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function $t(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Xr={DEG2RAD:Pr,RAD2DEG:Nr,generateUUID:er,clamp:Pt,euclideanModulo:Vc,mapLinear:Xf,inverseLerp:Yf,lerp:Ir,damp:qf,pingpong:Zf,smoothstep:$f,smootherstep:Jf,randInt:Kf,randFloat:jf,randFloatSpread:Qf,seededRandom:ep,degToRad:tp,radToDeg:np,isPowerOfTwo:ip,ceilPowerOfTwo:sp,floorPowerOfTwo:rp,setQuaternionFromProperEuler:op,normalize:$t,denormalize:ks},ye=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Pt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ze=class n{constructor(e,t,i,s,r,o,a,c,l){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l)}set(e,t,i,s,r,o,a,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=i,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],h=i[4],u=i[7],m=i[2],p=i[5],g=i[8],_=s[0],f=s[3],d=s[6],x=s[1],M=s[4],y=s[7],C=s[2],T=s[5],A=s[8];return r[0]=o*_+a*x+c*C,r[3]=o*f+a*M+c*T,r[6]=o*d+a*y+c*A,r[1]=l*_+h*x+u*C,r[4]=l*f+h*M+u*T,r[7]=l*d+h*y+u*A,r[2]=m*_+p*x+g*C,r[5]=m*f+p*M+g*T,r[8]=m*d+p*y+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-i*r*h+i*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,m=a*c-h*r,p=l*r-o*c,g=t*u+i*m+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(s*l-h*i)*_,e[2]=(a*i-s*o)*_,e[3]=m*_,e[4]=(h*t-s*c)*_,e[5]=(s*r-a*t)*_,e[6]=p*_,e[7]=(i*c-l*t)*_,e[8]=(o*t-i*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ba.makeScale(e,t)),this}rotate(e){return this.premultiply(Ba.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ba.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ba=new ze;function ad(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Yo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function ap(){let n=Yo("canvas");return n.style.display="block",n}var Zh={};function Rr(n){n in Zh||(Zh[n]=!0,console.warn(n))}function lp(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function cp(n){let e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function hp(n){let e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var Je={enabled:!0,workingColorSpace:Qs,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===st&&(n.r=mi(n.r),n.g=mi(n.g),n.b=mi(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===st&&(n.r=Hs(n.r),n.g=Hs(n.g),n.b=Hs(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Ui?pa:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function mi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Hs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var $h=[.64,.33,.3,.6,.15,.06],Jh=[.2126,.7152,.0722],Kh=[.3127,.329],jh=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Qh=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Je.define({[Qs]:{primaries:$h,whitePoint:Kh,transfer:pa,toXYZ:jh,fromXYZ:Qh,luminanceCoefficients:Jh,workingColorSpaceConfig:{unpackColorSpace:Ft},outputColorSpaceConfig:{drawingBufferColorSpace:Ft}},[Ft]:{primaries:$h,whitePoint:Kh,transfer:st,toXYZ:jh,fromXYZ:Qh,luminanceCoefficients:Jh,outputColorSpaceConfig:{drawingBufferColorSpace:Ft}}});var Ss,nc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ss===void 0&&(Ss=Yo("canvas")),Ss.width=e.width,Ss.height=e.height;let i=Ss.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Ss}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=Yo("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=mi(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(mi(t[i]/255)*255):t[i]=mi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},up=0,qo=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:up++}),this.uuid=er(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(za(s[o].image)):r.push(za(s[o]))}else r=za(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function za(n){return typeof HTMLImageElement!="undefined"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&n instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&n instanceof ImageBitmap?nc.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var dp=0,rn=class n extends _i{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=is,s=is,r=Jn,o=ss,a=kn,c=gi,l=n.DEFAULT_ANISOTROPY,h=Ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:dp++}),this.uuid=er(),this.name="",this.source=new qo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==$u)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Dr:e.x=e.x-Math.floor(e.x);break;case is:e.x=e.x<0?0:1;break;case Rl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Dr:e.y=e.y-Math.floor(e.y);break;case is:e.y=e.y<0?0:1;break;case Rl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};rn.DEFAULT_IMAGE=null;rn.DEFAULT_MAPPING=$u;rn.DEFAULT_ANISOTROPY=1;var rt=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],m=c[1],p=c[5],g=c[9],_=c[2],f=c[6],d=c[10];if(Math.abs(h-m)<.01&&Math.abs(u-_)<.01&&Math.abs(g-f)<.01){if(Math.abs(h+m)<.1&&Math.abs(u+_)<.1&&Math.abs(g+f)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(l+1)/2,y=(p+1)/2,C=(d+1)/2,T=(h+m)/4,A=(u+_)/4,P=(g+f)/4;return M>y&&M>C?M<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(M),s=T/i,r=A/i):y>C?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=T/s,r=P/s):C<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),i=A/r,s=P/r),this.set(i,s,r,t),this}let x=Math.sqrt((f-g)*(f-g)+(u-_)*(u-_)+(m-h)*(m-h));return Math.abs(x)<.001&&(x=1),this.x=(f-g)/x,this.y=(u-_)/x,this.z=(m-h)/x,this.w=Math.acos((l+p+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ic=class extends _i{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new rt(0,0,e,t),this.scissorTest=!1,this.viewport=new rt(0,0,e,t);let s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let r=new rn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new qo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},On=class extends ic{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Zo=class extends rn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=bn,this.minFilter=bn,this.wrapR=is,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var sc=class extends rn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=bn,this.minFilter=bn,this.wrapR=is,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Kt=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3],m=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=m,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(u!==_||c!==m||l!==p||h!==g){let f=1-a,d=c*m+l*p+h*g+u*_,x=d>=0?1:-1,M=1-d*d;if(M>Number.EPSILON){let C=Math.sqrt(M),T=Math.atan2(C,d*x);f=Math.sin(f*T)/C,a=Math.sin(a*T)/C}let y=a*x;if(c=c*f+m*y,l=l*f+p*y,h=h*f+g*y,u=u*f+_*y,f===1-a){let C=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=C,l*=C,h*=C,u*=C}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[o],m=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+h*u+c*p-l*m,e[t+1]=c*g+h*m+l*u-a*p,e[t+2]=l*g+h*p+a*m-c*u,e[t+3]=h*g-a*u-c*m-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),h=a(s/2),u=a(r/2),m=c(i/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=m*h*u+l*p*g,this._y=l*p*u-m*h*g,this._z=l*h*g+m*p*u,this._w=l*h*u-m*p*g;break;case"YXZ":this._x=m*h*u+l*p*g,this._y=l*p*u-m*h*g,this._z=l*h*g-m*p*u,this._w=l*h*u+m*p*g;break;case"ZXY":this._x=m*h*u-l*p*g,this._y=l*p*u+m*h*g,this._z=l*h*g+m*p*u,this._w=l*h*u-m*p*g;break;case"ZYX":this._x=m*h*u-l*p*g,this._y=l*p*u+m*h*g,this._z=l*h*g-m*p*u,this._w=l*h*u+m*p*g;break;case"YZX":this._x=m*h*u+l*p*g,this._y=l*p*u+m*h*g,this._z=l*h*g-m*p*u,this._w=l*h*u-m*p*g;break;case"XZY":this._x=m*h*u-l*p*g,this._y=l*p*u-m*h*g,this._z=l*h*g+m*p*u,this._w=l*h*u+m*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],m=i+a+u;if(m>0){let p=.5/Math.sqrt(m+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(i>a&&i>u){let p=2*Math.sqrt(1+i-a-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>u){let p=2*Math.sqrt(1+a-i-u);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+h)/p}else{let p=2*Math.sqrt(1+u-i-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Pt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=i*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-i*l,this._z=r*h+o*l+i*c-s*a,this._w=o*h-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+i*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,m=Math.sin(t*h)/l;return this._w=o*u+this._w*m,this._x=i*u+this._x*m,this._y=s*u+this._y*m,this._z=r*u+this._z*m,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(eu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(eu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*i),h=2*(a*t-r*s),u=2*(r*i-o*t);return this.x=t+c*l+o*u-a*h,this.y=i+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ha.copy(this).projectOnVector(e),this.sub(Ha)}reflect(e){return this.sub(Ha.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Pt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ha=new I,eu=new Kt,Mn=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Un):Un.fromBufferAttribute(r,o),Un.applyMatrix4(e.matrixWorld),this.expandByPoint(Un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),po.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),po.copy(i.boundingBox)),po.applyMatrix4(e.matrixWorld),this.union(po)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Un),Un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(vr),mo.subVectors(this.max,vr),ws.subVectors(e.a,vr),Es.subVectors(e.b,vr),Ts.subVectors(e.c,vr),Ri.subVectors(Es,ws),Ci.subVectors(Ts,Es),qi.subVectors(ws,Ts);let t=[0,-Ri.z,Ri.y,0,-Ci.z,Ci.y,0,-qi.z,qi.y,Ri.z,0,-Ri.x,Ci.z,0,-Ci.x,qi.z,0,-qi.x,-Ri.y,Ri.x,0,-Ci.y,Ci.x,0,-qi.y,qi.x,0];return!Va(t,ws,Es,Ts,mo)||(t=[1,0,0,0,1,0,0,0,1],!Va(t,ws,Es,Ts,mo))?!1:(go.crossVectors(Ri,Ci),t=[go.x,go.y,go.z],Va(t,ws,Es,Ts,mo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},li=[new I,new I,new I,new I,new I,new I,new I,new I],Un=new I,po=new Mn,ws=new I,Es=new I,Ts=new I,Ri=new I,Ci=new I,qi=new I,vr=new I,mo=new I,go=new I,Zi=new I;function Va(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Zi.fromArray(n,r);let a=s.x*Math.abs(Zi.x)+s.y*Math.abs(Zi.y)+s.z*Math.abs(Zi.z),c=e.dot(Zi),l=t.dot(Zi),h=i.dot(Zi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var fp=new Mn,br=new I,Ga=new I,ki=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):fp.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;br.subVectors(e,this.center);let t=br.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(br,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ga.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(br.copy(e.center).add(Ga)),this.expandByPoint(br.copy(e.center).sub(Ga))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},ci=new I,Wa=new I,_o=new I,Pi=new I,Xa=new I,xo=new I,Ya=new I,os=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ci)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ci.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ci.copy(this.origin).addScaledVector(this.direction,t),ci.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Wa.copy(e).add(t).multiplyScalar(.5),_o.copy(t).sub(e).normalize(),Pi.copy(this.origin).sub(Wa);let r=e.distanceTo(t)*.5,o=-this.direction.dot(_o),a=Pi.dot(this.direction),c=-Pi.dot(_o),l=Pi.lengthSq(),h=Math.abs(1-o*o),u,m,p,g;if(h>0)if(u=o*c-a,m=o*a-c,g=r*h,u>=0)if(m>=-g)if(m<=g){let _=1/h;u*=_,m*=_,p=u*(u+o*m+2*a)+m*(o*u+m+2*c)+l}else m=r,u=Math.max(0,-(o*m+a)),p=-u*u+m*(m+2*c)+l;else m=-r,u=Math.max(0,-(o*m+a)),p=-u*u+m*(m+2*c)+l;else m<=-g?(u=Math.max(0,-(-o*r+a)),m=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+m*(m+2*c)+l):m<=g?(u=0,m=Math.min(Math.max(-r,-c),r),p=m*(m+2*c)+l):(u=Math.max(0,-(o*r+a)),m=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+m*(m+2*c)+l);else m=o>0?-r:r,u=Math.max(0,-(o*m+a)),p=-u*u+m*(m+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Wa).addScaledVector(_o,m),p}intersectSphere(e,t){ci.subVectors(e.center,this.origin);let i=ci.dot(this.direction),s=ci.dot(ci)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,m=this.origin;return l>=0?(i=(e.min.x-m.x)*l,s=(e.max.x-m.x)*l):(i=(e.max.x-m.x)*l,s=(e.min.x-m.x)*l),h>=0?(r=(e.min.y-m.y)*h,o=(e.max.y-m.y)*h):(r=(e.max.y-m.y)*h,o=(e.min.y-m.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-m.z)*u,c=(e.max.z-m.z)*u):(a=(e.max.z-m.z)*u,c=(e.min.z-m.z)*u),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,ci)!==null}intersectTriangle(e,t,i,s,r){Xa.subVectors(t,e),xo.subVectors(i,e),Ya.crossVectors(Xa,xo);let o=this.direction.dot(Ya),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Pi.subVectors(this.origin,e);let c=a*this.direction.dot(xo.crossVectors(Pi,xo));if(c<0)return null;let l=a*this.direction.dot(Xa.cross(Pi));if(l<0||c+l>o)return null;let h=-a*Pi.dot(Ya);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},We=class n{constructor(e,t,i,s,r,o,a,c,l,h,u,m,p,g,_,f){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l,h,u,m,p,g,_,f)}set(e,t,i,s,r,o,a,c,l,h,u,m,p,g,_,f){let d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=l,d[6]=h,d[10]=u,d[14]=m,d[3]=p,d[7]=g,d[11]=_,d[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/As.setFromMatrixColumn(e,0).length(),r=1/As.setFromMatrixColumn(e,1).length(),o=1/As.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let m=o*h,p=o*u,g=a*h,_=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=p+g*l,t[5]=m-_*l,t[9]=-a*c,t[2]=_-m*l,t[6]=g+p*l,t[10]=o*c}else if(e.order==="YXZ"){let m=c*h,p=c*u,g=l*h,_=l*u;t[0]=m+_*a,t[4]=g*a-p,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-g,t[6]=_+m*a,t[10]=o*c}else if(e.order==="ZXY"){let m=c*h,p=c*u,g=l*h,_=l*u;t[0]=m-_*a,t[4]=-o*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*h,t[9]=_-m*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let m=o*h,p=o*u,g=a*h,_=a*u;t[0]=c*h,t[4]=g*l-p,t[8]=m*l+_,t[1]=c*u,t[5]=_*l+m,t[9]=p*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let m=o*c,p=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=_-m*u,t[8]=g*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=p*u+g,t[10]=m-_*u}else if(e.order==="XZY"){let m=o*c,p=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=m*u+_,t[5]=o*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*h,t[10]=_*u+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pp,e,mp)}lookAt(e,t,i){let s=this.elements;return xn.subVectors(e,t),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),Ii.crossVectors(i,xn),Ii.lengthSq()===0&&(Math.abs(i.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),Ii.crossVectors(i,xn)),Ii.normalize(),yo.crossVectors(xn,Ii),s[0]=Ii.x,s[4]=yo.x,s[8]=xn.x,s[1]=Ii.y,s[5]=yo.y,s[9]=xn.y,s[2]=Ii.z,s[6]=yo.z,s[10]=xn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],h=i[1],u=i[5],m=i[9],p=i[13],g=i[2],_=i[6],f=i[10],d=i[14],x=i[3],M=i[7],y=i[11],C=i[15],T=s[0],A=s[4],P=s[8],b=s[12],v=s[1],L=s[5],V=s[9],G=s[13],E=s[2],B=s[6],D=s[10],q=s[14],z=s[3],Y=s[7],ie=s[11],te=s[15];return r[0]=o*T+a*v+c*E+l*z,r[4]=o*A+a*L+c*B+l*Y,r[8]=o*P+a*V+c*D+l*ie,r[12]=o*b+a*G+c*q+l*te,r[1]=h*T+u*v+m*E+p*z,r[5]=h*A+u*L+m*B+p*Y,r[9]=h*P+u*V+m*D+p*ie,r[13]=h*b+u*G+m*q+p*te,r[2]=g*T+_*v+f*E+d*z,r[6]=g*A+_*L+f*B+d*Y,r[10]=g*P+_*V+f*D+d*ie,r[14]=g*b+_*G+f*q+d*te,r[3]=x*T+M*v+y*E+C*z,r[7]=x*A+M*L+y*B+C*Y,r[11]=x*P+M*V+y*D+C*ie,r[15]=x*b+M*G+y*q+C*te,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],m=e[10],p=e[14],g=e[3],_=e[7],f=e[11],d=e[15];return g*(+r*c*u-s*l*u-r*a*m+i*l*m+s*a*p-i*c*p)+_*(+t*c*p-t*l*m+r*o*m-s*o*p+s*l*h-r*c*h)+f*(+t*l*u-t*a*p-r*o*u+i*o*p+r*a*h-i*l*h)+d*(-s*a*h-t*c*u+t*a*m+s*o*u-i*o*m+i*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],m=e[10],p=e[11],g=e[12],_=e[13],f=e[14],d=e[15],x=u*f*l-_*m*l+_*c*p-a*f*p-u*c*d+a*m*d,M=g*m*l-h*f*l-g*c*p+o*f*p+h*c*d-o*m*d,y=h*_*l-g*u*l+g*a*p-o*_*p-h*a*d+o*u*d,C=g*u*c-h*_*c-g*a*m+o*_*m+h*a*f-o*u*f,T=t*x+i*M+s*y+r*C;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/T;return e[0]=x*A,e[1]=(_*m*r-u*f*r-_*s*p+i*f*p+u*s*d-i*m*d)*A,e[2]=(a*f*r-_*c*r+_*s*l-i*f*l-a*s*d+i*c*d)*A,e[3]=(u*c*r-a*m*r-u*s*l+i*m*l+a*s*p-i*c*p)*A,e[4]=M*A,e[5]=(h*f*r-g*m*r+g*s*p-t*f*p-h*s*d+t*m*d)*A,e[6]=(g*c*r-o*f*r-g*s*l+t*f*l+o*s*d-t*c*d)*A,e[7]=(o*m*r-h*c*r+h*s*l-t*m*l-o*s*p+t*c*p)*A,e[8]=y*A,e[9]=(g*u*r-h*_*r-g*i*p+t*_*p+h*i*d-t*u*d)*A,e[10]=(o*_*r-g*a*r+g*i*l-t*_*l-o*i*d+t*a*d)*A,e[11]=(h*a*r-o*u*r-h*i*l+t*u*l+o*i*p-t*a*p)*A,e[12]=C*A,e[13]=(h*_*s-g*u*s+g*i*m-t*_*m-h*i*f+t*u*f)*A,e[14]=(g*a*s-o*_*s-g*i*c+t*_*c+o*i*f-t*a*f)*A,e[15]=(o*u*s-h*a*s+h*i*c-t*u*c-o*i*m+t*a*m)*A,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+i,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,u=a+a,m=r*l,p=r*h,g=r*u,_=o*h,f=o*u,d=a*u,x=c*l,M=c*h,y=c*u,C=i.x,T=i.y,A=i.z;return s[0]=(1-(_+d))*C,s[1]=(p+y)*C,s[2]=(g-M)*C,s[3]=0,s[4]=(p-y)*T,s[5]=(1-(m+d))*T,s[6]=(f+x)*T,s[7]=0,s[8]=(g+M)*A,s[9]=(f-x)*A,s[10]=(1-(m+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=As.set(s[0],s[1],s[2]).length(),o=As.set(s[4],s[5],s[6]).length(),a=As.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Nn.copy(this);let l=1/r,h=1/o,u=1/a;return Nn.elements[0]*=l,Nn.elements[1]*=l,Nn.elements[2]*=l,Nn.elements[4]*=h,Nn.elements[5]*=h,Nn.elements[6]*=h,Nn.elements[8]*=u,Nn.elements[9]*=u,Nn.elements[10]*=u,t.setFromRotationMatrix(Nn),i.x=r,i.y=o,i.z=a,this}makePerspective(e,t,i,s,r,o,a=pi){let c=this.elements,l=2*r/(t-e),h=2*r/(i-s),u=(t+e)/(t-e),m=(i+s)/(i-s),p,g;if(a===pi)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Xo)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=pi){let c=this.elements,l=1/(t-e),h=1/(i-s),u=1/(o-r),m=(t+e)*l,p=(i+s)*h,g,_;if(a===pi)g=(o+r)*u,_=-2*u;else if(a===Xo)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-m,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},As=new I,Nn=new We,pp=new I(0,0,0),mp=new I(1,1,1),Ii=new I,yo=new I,xn=new I,tu=new We,nu=new Kt,An=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],m=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Pt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(m,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Pt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Pt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Pt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(m,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Pt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Pt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(m,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return tu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(tu,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return nu.setFromEuler(this),this.setFromQuaternion(nu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};An.DEFAULT_ORDER="XYZ";var Fr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},gp=0,iu=new I,Rs=new Kt,hi=new We,vo=new I,Mr=new I,_p=new I,xp=new Kt,su=new I(1,0,0),ru=new I(0,1,0),ou=new I(0,0,1),au={type:"added"},yp={type:"removed"},Cs={type:"childadded",child:null},qa={type:"childremoved",child:null},Zt=class n extends _i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gp++}),this.uuid=er(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new I,t=new An,i=new Kt,s=new I(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new We},normalMatrix:{value:new ze}}),this.matrix=new We,this.matrixWorld=new We,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Rs.setFromAxisAngle(e,t),this.quaternion.multiply(Rs),this}rotateOnWorldAxis(e,t){return Rs.setFromAxisAngle(e,t),this.quaternion.premultiply(Rs),this}rotateX(e){return this.rotateOnAxis(su,e)}rotateY(e){return this.rotateOnAxis(ru,e)}rotateZ(e){return this.rotateOnAxis(ou,e)}translateOnAxis(e,t){return iu.copy(e).applyQuaternion(this.quaternion),this.position.add(iu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(su,e)}translateY(e){return this.translateOnAxis(ru,e)}translateZ(e){return this.translateOnAxis(ou,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?vo.copy(e):vo.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Mr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hi.lookAt(Mr,vo,this.up):hi.lookAt(vo,Mr,this.up),this.quaternion.setFromRotationMatrix(hi),s&&(hi.extractRotation(s.matrixWorld),Rs.setFromRotationMatrix(hi),this.quaternion.premultiply(Rs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(au),Cs.child=e,this.dispatchEvent(Cs),Cs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(yp),qa.child=e,this.dispatchEvent(qa),qa.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(au),Cs.child=e,this.dispatchEvent(Cs),Cs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mr,e,_p),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mr,xp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),m=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),m.length>0&&(i.skeletons=m),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Zt.DEFAULT_UP=new I(0,1,0);Zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Fn=new I,ui=new I,Za=new I,di=new I,Ps=new I,Is=new I,lu=new I,$a=new I,Ja=new I,Ka=new I,ja=new rt,Qa=new rt,el=new rt,ts=class n{constructor(e=new I,t=new I,i=new I){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Fn.subVectors(e,t),s.cross(Fn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Fn.subVectors(s,t),ui.subVectors(i,t),Za.subVectors(e,t);let o=Fn.dot(Fn),a=Fn.dot(ui),c=Fn.dot(Za),l=ui.dot(ui),h=ui.dot(Za),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let m=1/u,p=(l*c-a*h)*m,g=(o*h-a*c)*m;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,di)===null?!1:di.x>=0&&di.y>=0&&di.x+di.y<=1}static getInterpolation(e,t,i,s,r,o,a,c){return this.getBarycoord(e,t,i,s,di)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,di.x),c.addScaledVector(o,di.y),c.addScaledVector(a,di.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return ja.setScalar(0),Qa.setScalar(0),el.setScalar(0),ja.fromBufferAttribute(e,t),Qa.fromBufferAttribute(e,i),el.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(ja,r.x),o.addScaledVector(Qa,r.y),o.addScaledVector(el,r.z),o}static isFrontFacing(e,t,i,s){return Fn.subVectors(i,t),ui.subVectors(e,t),Fn.cross(ui).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Fn.subVectors(this.c,this.b),ui.subVectors(this.a,this.b),Fn.cross(ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;Ps.subVectors(s,i),Is.subVectors(r,i),$a.subVectors(e,i);let c=Ps.dot($a),l=Is.dot($a);if(c<=0&&l<=0)return t.copy(i);Ja.subVectors(e,s);let h=Ps.dot(Ja),u=Is.dot(Ja);if(h>=0&&u<=h)return t.copy(s);let m=c*u-h*l;if(m<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(i).addScaledVector(Ps,o);Ka.subVectors(e,r);let p=Ps.dot(Ka),g=Is.dot(Ka);if(g>=0&&p<=g)return t.copy(r);let _=p*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(i).addScaledVector(Is,a);let f=h*g-p*u;if(f<=0&&u-h>=0&&p-g>=0)return lu.subVectors(r,s),a=(u-h)/(u-h+(p-g)),t.copy(s).addScaledVector(lu,a);let d=1/(f+_+m);return o=_*d,a=m*d,t.copy(i).addScaledVector(Ps,o).addScaledVector(Is,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ld={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Li={h:0,s:0,l:0},bo={h:0,s:0,l:0};function tl(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Re=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ft){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=Je.workingColorSpace){return this.r=e,this.g=t,this.b=i,Je.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=Je.workingColorSpace){if(e=Vc(e,1),t=Pt(t,0,1),i=Pt(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=tl(o,r,e+1/3),this.g=tl(o,r,e),this.b=tl(o,r,e-1/3)}return Je.toWorkingColorSpace(this,s),this}setStyle(e,t=Ft){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ft){let i=ld[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=mi(e.r),this.g=mi(e.g),this.b=mi(e.b),this}copyLinearToSRGB(e){return this.r=Hs(e.r),this.g=Hs(e.g),this.b=Hs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ft){return Je.fromWorkingColorSpace(Yt.copy(this),e),Math.round(Pt(Yt.r*255,0,255))*65536+Math.round(Pt(Yt.g*255,0,255))*256+Math.round(Pt(Yt.b*255,0,255))}getHexString(e=Ft){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace(Yt.copy(this),t);let i=Yt.r,s=Yt.g,r=Yt.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=Ft){Je.fromWorkingColorSpace(Yt.copy(this),e);let t=Yt.r,i=Yt.g,s=Yt.b;return e!==Ft?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Li),this.setHSL(Li.h+e,Li.s+t,Li.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Li),e.getHSL(bo);let i=Ir(Li.h,bo.h,t),s=Ir(Li.s,bo.s,t),r=Ir(Li.l,bo.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Yt=new Re;Re.NAMES=ld;var vp=0,Oi=class extends _i{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vp++}),this.uuid=er(),this.name="",this.blending=Bs,this.side=Fi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_l,this.blendDst=xl,this.blendEquation=es,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Re(0,0,0),this.blendAlpha=0,this.depthFunc=Gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ms,this.stencilZFail=Ms,this.stencilZPass=Ms,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Bs&&(i.blending=this.blending),this.side!==Fi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==_l&&(i.blendSrc=this.blendSrc),this.blendDst!==xl&&(i.blendDst=this.blendDst),this.blendEquation!==es&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Gs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Wh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ms&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ms&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ms&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},on=class extends Oi{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Re(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new An,this.combine=Zu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Rt=new I,Mo=new ye,wt=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Xh,this.updateRanges=[],this.gpuType=Kn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Mo.fromBufferAttribute(this,t),Mo.applyMatrix3(e),this.setXY(t,Mo.x,Mo.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ks(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=$t(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ks(t,this.array)),t}setX(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ks(t,this.array)),t}setY(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ks(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ks(t,this.array)),t}setW(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array),s=$t(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array),s=$t(s,this.array),r=$t(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xh&&(e.usage=this.usage),e}};var $o=class extends wt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Jo=class extends wt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var je=class extends wt{constructor(e,t,i){super(new Float32Array(e),t,i)}},bp=0,Tn=new We,nl=new Zt,Ls=new I,yn=new Mn,Sr=new Mn,Nt=new I,bt=class n extends _i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bp++}),this.uuid=er(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ad(e)?Jo:$o)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new ze().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Tn.makeRotationFromQuaternion(e),this.applyMatrix4(Tn),this}rotateX(e){return Tn.makeRotationX(e),this.applyMatrix4(Tn),this}rotateY(e){return Tn.makeRotationY(e),this.applyMatrix4(Tn),this}rotateZ(e){return Tn.makeRotationZ(e),this.applyMatrix4(Tn),this}translate(e,t,i){return Tn.makeTranslation(e,t,i),this.applyMatrix4(Tn),this}scale(e,t,i){return Tn.makeScale(e,t,i),this.applyMatrix4(Tn),this}lookAt(e){return nl.lookAt(e),nl.updateMatrix(),this.applyMatrix4(nl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ls).negate(),this.translate(Ls.x,Ls.y,Ls.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new je(i,3))}else{for(let i=0,s=t.count;i<s;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ki);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let i=this.boundingSphere.center;if(yn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Sr.setFromBufferAttribute(a),this.morphTargetsRelative?(Nt.addVectors(yn.min,Sr.min),yn.expandByPoint(Nt),Nt.addVectors(yn.max,Sr.max),yn.expandByPoint(Nt)):(yn.expandByPoint(Sr.min),yn.expandByPoint(Sr.max))}yn.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)Nt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Nt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Nt.fromBufferAttribute(a,l),c&&(Ls.fromBufferAttribute(e,l),Nt.add(Ls)),s=Math.max(s,i.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wt(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let P=0;P<i.count;P++)a[P]=new I,c[P]=new I;let l=new I,h=new I,u=new I,m=new ye,p=new ye,g=new ye,_=new I,f=new I;function d(P,b,v){l.fromBufferAttribute(i,P),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,v),m.fromBufferAttribute(r,P),p.fromBufferAttribute(r,b),g.fromBufferAttribute(r,v),h.sub(l),u.sub(l),p.sub(m),g.sub(m);let L=1/(p.x*g.y-g.x*p.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(L),f.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(L),a[P].add(_),a[b].add(_),a[v].add(_),c[P].add(f),c[b].add(f),c[v].add(f))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let P=0,b=x.length;P<b;++P){let v=x[P],L=v.start,V=v.count;for(let G=L,E=L+V;G<E;G+=3)d(e.getX(G+0),e.getX(G+1),e.getX(G+2))}let M=new I,y=new I,C=new I,T=new I;function A(P){C.fromBufferAttribute(s,P),T.copy(C);let b=a[P];M.copy(b),M.sub(C.multiplyScalar(C.dot(b))).normalize(),y.crossVectors(T,b);let L=y.dot(c[P])<0?-1:1;o.setXYZW(P,M.x,M.y,M.z,L)}for(let P=0,b=x.length;P<b;++P){let v=x[P],L=v.start,V=v.count;for(let G=L,E=L+V;G<E;G+=3)A(e.getX(G+0)),A(e.getX(G+1)),A(e.getX(G+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new wt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let m=0,p=i.count;m<p;m++)i.setXYZ(m,0,0,0);let s=new I,r=new I,o=new I,a=new I,c=new I,l=new I,h=new I,u=new I;if(e)for(let m=0,p=e.count;m<p;m+=3){let g=e.getX(m+0),_=e.getX(m+1),f=e.getX(m+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,f),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,f),a.add(h),c.add(h),l.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(f,l.x,l.y,l.z)}else for(let m=0,p=t.count;m<p;m+=3)s.fromBufferAttribute(t,m+0),r.fromBufferAttribute(t,m+1),o.fromBufferAttribute(t,m+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(m+0,h.x,h.y,h.z),i.setXYZ(m+1,h.x,h.y,h.z),i.setXYZ(m+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(a,c){let l=a.array,h=a.itemSize,u=a.normalized,m=new l.constructor(c.length*h),p=0,g=0;for(let _=0,f=c.length;_<f;_++){a.isInterleavedBufferAttribute?p=c[_]*a.data.stride+a.offset:p=c[_]*h;for(let d=0;d<h;d++)m[g++]=l[p++]}return new wt(m,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,i);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let m=l[h],p=e(m,i);c.push(p)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let l=i[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,m=l.length;u<m;u++){let p=l[u];h.push(p.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let m=0,p=u.length;m<p;m++)h.push(u[m].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},cu=new We,$i=new os,So=new ki,hu=new I,wo=new I,Eo=new I,To=new I,il=new I,Ao=new I,uu=new I,Ro=new I,Le=class extends Zt{constructor(e=new bt,t=new on){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Ao.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(il.fromBufferAttribute(u,e),o?Ao.addScaledVector(il,h):Ao.addScaledVector(il.sub(t),h))}t.add(Ao)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),So.copy(i.boundingSphere),So.applyMatrix4(r),$i.copy(e.ray).recast(e.near),!(So.containsPoint($i.origin)===!1&&($i.intersectSphere(So,hu)===null||$i.origin.distanceToSquared(hu)>(e.far-e.near)**2))&&(cu.copy(r).invert(),$i.copy(e.ray).applyMatrix4(cu),!(i.boundingBox!==null&&$i.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,$i)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,m=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=m.length;g<_;g++){let f=m[g],d=o[f.materialIndex],x=Math.max(f.start,p.start),M=Math.min(a.count,Math.min(f.start+f.count,p.start+p.count));for(let y=x,C=M;y<C;y+=3){let T=a.getX(y),A=a.getX(y+1),P=a.getX(y+2);s=Co(this,d,e,i,l,h,u,T,A,P),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let f=g,d=_;f<d;f+=3){let x=a.getX(f),M=a.getX(f+1),y=a.getX(f+2);s=Co(this,o,e,i,l,h,u,x,M,y),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=m.length;g<_;g++){let f=m[g],d=o[f.materialIndex],x=Math.max(f.start,p.start),M=Math.min(c.count,Math.min(f.start+f.count,p.start+p.count));for(let y=x,C=M;y<C;y+=3){let T=y,A=y+1,P=y+2;s=Co(this,d,e,i,l,h,u,T,A,P),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let f=g,d=_;f<d;f+=3){let x=f,M=f+1,y=f+2;s=Co(this,o,e,i,l,h,u,x,M,y),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}};function Mp(n,e,t,i,s,r,o,a){let c;if(e.side===qt?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,e.side===Fi,a),c===null)return null;Ro.copy(a),Ro.applyMatrix4(n.matrixWorld);let l=t.ray.origin.distanceTo(Ro);return l<t.near||l>t.far?null:{distance:l,point:Ro.clone(),object:n}}function Co(n,e,t,i,s,r,o,a,c,l){n.getVertexPosition(a,wo),n.getVertexPosition(c,Eo),n.getVertexPosition(l,To);let h=Mp(n,e,t,i,wo,Eo,To,uu);if(h){let u=new I;ts.getBarycoord(uu,wo,Eo,To,u),s&&(h.uv=ts.getInterpolatedAttribute(s,a,c,l,u,new ye)),r&&(h.uv1=ts.getInterpolatedAttribute(r,a,c,l,u,new ye)),o&&(h.normal=ts.getInterpolatedAttribute(o,a,c,l,u,new I),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let m={a,b:c,c:l,normal:new I,materialIndex:0};ts.getNormal(wo,Eo,To,m.normal),h.face=m,h.barycoord=u}return h}var Bn=class n extends bt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],m=0,p=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new je(l,3)),this.setAttribute("normal",new je(h,3)),this.setAttribute("uv",new je(u,2));function g(_,f,d,x,M,y,C,T,A,P,b){let v=y/A,L=C/P,V=y/2,G=C/2,E=T/2,B=A+1,D=P+1,q=0,z=0,Y=new I;for(let ie=0;ie<D;ie++){let te=ie*L-G;for(let me=0;me<B;me++){let ke=me*v-V;Y[_]=ke*x,Y[f]=te*M,Y[d]=E,l.push(Y.x,Y.y,Y.z),Y[_]=0,Y[f]=0,Y[d]=T>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(me/A),u.push(1-ie/P),q+=1}}for(let ie=0;ie<P;ie++)for(let te=0;te<A;te++){let me=m+te+B*ie,ke=m+te+B*(ie+1),U=m+(te+1)+B*(ie+1),Z=m+(te+1)+B*ie;c.push(me,ke,Z),c.push(ke,U,Z),z+=6}a.addGroup(p,z,b),p+=z,m+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Zs(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Jt(n){let e={};for(let t=0;t<n.length;t++){let i=Zs(n[t]);for(let s in i)e[s]=i[s]}return e}function Sp(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function cd(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var wp={clone:Zs,merge:Jt},Ep=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Tp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Qn=class extends Oi{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ep,this.fragmentShader=Tp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zs(e.uniforms),this.uniformsGroups=Sp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},Ko=class extends Zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new We,this.projectionMatrix=new We,this.projectionMatrixInverse=new We,this.coordinateSystem=pi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Di=new I,du=new ye,fu=new ye,zt=class extends Ko{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Nr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Pr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Nr*2*Math.atan(Math.tan(Pr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Di.x,Di.y).multiplyScalar(-e/Di.z),Di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Di.x,Di.y).multiplyScalar(-e/Di.z)}getViewSize(e,t){return this.getViewBounds(e,du,fu),t.subVectors(fu,du)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Pr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ds=-90,Us=1,rc=class extends Zt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new zt(Ds,Us,e,t);s.layers=this.layers,this.add(s);let r=new zt(Ds,Us,e,t);r.layers=this.layers,this.add(r);let o=new zt(Ds,Us,e,t);o.layers=this.layers,this.add(o);let a=new zt(Ds,Us,e,t);a.layers=this.layers,this.add(a);let c=new zt(Ds,Us,e,t);c.layers=this.layers,this.add(c);let l=new zt(Ds,Us,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===pi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Xo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=e.getRenderTarget(),m=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,o),e.setRenderTarget(i,2,s),e.render(t,a),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,l),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,h),e.setRenderTarget(u,m,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},jo=class extends rn{constructor(e,t,i,s,r,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:Ws,super(e,t,i,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},oc=class extends On{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new jo(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Jn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Bn(5,5,5),r=new Qn({name:"CubemapFromEquirect",uniforms:Zs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:qt,blending:Ni});r.uniforms.tEquirect.value=t;let o=new Le(s,r),a=t.minFilter;return t.minFilter===ss&&(t.minFilter=Jn),new rc(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}},sl=new I,Ap=new I,Rp=new ze,vn=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=sl.subVectors(i,t).cross(Ap.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(sl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Rp.getNormalMatrix(e),s=this.coplanarPoint(sl).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ji=new ki,Po=new I,kr=class{constructor(e=new vn,t=new vn,i=new vn,s=new vn,r=new vn,o=new vn){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=pi){let i=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],m=s[7],p=s[8],g=s[9],_=s[10],f=s[11],d=s[12],x=s[13],M=s[14],y=s[15];if(i[0].setComponents(c-r,m-l,f-p,y-d).normalize(),i[1].setComponents(c+r,m+l,f+p,y+d).normalize(),i[2].setComponents(c+o,m+h,f+g,y+x).normalize(),i[3].setComponents(c-o,m-h,f-g,y-x).normalize(),i[4].setComponents(c-a,m-u,f-_,y-M).normalize(),t===pi)i[5].setComponents(c+a,m+u,f+_,y+M).normalize();else if(t===Xo)i[5].setComponents(a,u,_,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ji.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ji.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ji)}intersectsSprite(e){return Ji.center.set(0,0,0),Ji.radius=.7071067811865476,Ji.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ji)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(Po.x=s.normal.x>0?e.max.x:e.min.x,Po.y=s.normal.y>0?e.max.y:e.min.y,Po.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Po)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function hd(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Cp(n){let e=new WeakMap;function t(a,c){let l=a.array,h=a.usage,u=l.byteLength,m=n.createBuffer();n.bindBuffer(c,m),n.bufferData(c,l,h),a.onUploadCallback();let p;if(l instanceof Float32Array)p=n.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=n.SHORT;else if(l instanceof Uint32Array)p=n.UNSIGNED_INT;else if(l instanceof Int32Array)p=n.INT;else if(l instanceof Int8Array)p=n.BYTE;else if(l instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:m,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,c,l){let h=c.array,u=c.updateRanges;if(n.bindBuffer(l,a),u.length===0)n.bufferSubData(l,0,h);else{u.sort((p,g)=>p.start-g.start);let m=0;for(let p=1;p<u.length;p++){let g=u[m],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++m,u[m]=_)}u.length=m+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];n.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var xi=class n extends bt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),c=Math.floor(s),l=a+1,h=c+1,u=e/a,m=t/c,p=[],g=[],_=[],f=[];for(let d=0;d<h;d++){let x=d*m-o;for(let M=0;M<l;M++){let y=M*u-r;g.push(y,-x,0),_.push(0,0,1),f.push(M/a),f.push(1-d/c)}}for(let d=0;d<c;d++)for(let x=0;x<a;x++){let M=x+l*d,y=x+l*(d+1),C=x+1+l*(d+1),T=x+1+l*d;p.push(M,y,T),p.push(y,C,T)}this.setIndex(p),this.setAttribute("position",new je(g,3)),this.setAttribute("normal",new je(_,3)),this.setAttribute("uv",new je(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},Pp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ip=`#ifdef USE_ALPHAHASH
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
#endif`,Lp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Dp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Up=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Np=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Fp=`#ifdef USE_AOMAP
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
#endif`,kp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Op=`#ifdef USE_BATCHING
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
#endif`,Bp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,zp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Hp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Vp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gp=`#ifdef USE_IRIDESCENCE
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
#endif`,Wp=`#ifdef USE_BUMPMAP
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
#endif`,Xp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Yp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Zp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$p=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Jp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Kp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,jp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Qp=`#define PI 3.141592653589793
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
} // validated`,em=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,tm=`vec3 transformedNormal = objectNormal;
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
#endif`,nm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,im=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,om="gl_FragColor = linearToOutputTexel( gl_FragColor );",am=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,lm=`#ifdef USE_ENVMAP
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
#endif`,cm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,hm=`#ifdef USE_ENVMAP
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
#endif`,um=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dm=`#ifdef USE_ENVMAP
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
#endif`,fm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_m=`#ifdef USE_GRADIENTMAP
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
}`,xm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ym=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,vm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,bm=`uniform bool receiveShadow;
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
#endif`,Mm=`#ifdef USE_ENVMAP
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
#endif`,Sm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Em=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Tm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Am=`PhysicalMaterial material;
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
#endif`,Rm=`struct PhysicalMaterial {
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
}`,Cm=`
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
#endif`,Pm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Im=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Lm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Dm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Um=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Nm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Fm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,km=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Om=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Bm=`#if defined( USE_POINTS_UV )
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
#endif`,zm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Vm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Gm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Wm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xm=`#ifdef USE_MORPHTARGETS
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
#endif`,Ym=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Zm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$m=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Km=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,jm=`#ifdef USE_NORMALMAP
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
#endif`,Qm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,e0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,t0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,n0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,i0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,s0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,r0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,o0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,a0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,l0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,c0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,h0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,u0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,d0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,f0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,p0=`float getShadowMask() {
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
}`,m0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,g0=`#ifdef USE_SKINNING
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
#endif`,_0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,x0=`#ifdef USE_SKINNING
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
#endif`,y0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,v0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,b0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,M0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,S0=`#ifdef USE_TRANSMISSION
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
#endif`,w0=`#ifdef USE_TRANSMISSION
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
#endif`,E0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,T0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,A0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,R0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,C0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,P0=`uniform sampler2D t2D;
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
}`,I0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,L0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,D0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,U0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N0=`#include <common>
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
}`,F0=`#if DEPTH_PACKING == 3200
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
}`,k0=`#define DISTANCE
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
}`,O0=`#define DISTANCE
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
}`,B0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,z0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H0=`uniform float scale;
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
}`,V0=`uniform vec3 diffuse;
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
}`,G0=`#include <common>
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
}`,W0=`uniform vec3 diffuse;
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
}`,X0=`#define LAMBERT
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
}`,Y0=`#define LAMBERT
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
}`,q0=`#define MATCAP
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
}`,Z0=`#define MATCAP
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
}`,$0=`#define NORMAL
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
}`,J0=`#define NORMAL
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
}`,K0=`#define PHONG
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
}`,j0=`#define PHONG
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
}`,Q0=`#define STANDARD
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
}`,eg=`#define STANDARD
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
}`,tg=`#define TOON
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
}`,ng=`#define TOON
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
}`,ig=`uniform float size;
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
}`,sg=`uniform vec3 diffuse;
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
}`,rg=`#include <common>
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
}`,og=`uniform vec3 color;
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
}`,ag=`uniform float rotation;
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
}`,lg=`uniform vec3 diffuse;
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
}`,Ge={alphahash_fragment:Pp,alphahash_pars_fragment:Ip,alphamap_fragment:Lp,alphamap_pars_fragment:Dp,alphatest_fragment:Up,alphatest_pars_fragment:Np,aomap_fragment:Fp,aomap_pars_fragment:kp,batching_pars_vertex:Op,batching_vertex:Bp,begin_vertex:zp,beginnormal_vertex:Hp,bsdfs:Vp,iridescence_fragment:Gp,bumpmap_pars_fragment:Wp,clipping_planes_fragment:Xp,clipping_planes_pars_fragment:Yp,clipping_planes_pars_vertex:qp,clipping_planes_vertex:Zp,color_fragment:$p,color_pars_fragment:Jp,color_pars_vertex:Kp,color_vertex:jp,common:Qp,cube_uv_reflection_fragment:em,defaultnormal_vertex:tm,displacementmap_pars_vertex:nm,displacementmap_vertex:im,emissivemap_fragment:sm,emissivemap_pars_fragment:rm,colorspace_fragment:om,colorspace_pars_fragment:am,envmap_fragment:lm,envmap_common_pars_fragment:cm,envmap_pars_fragment:hm,envmap_pars_vertex:um,envmap_physical_pars_fragment:Mm,envmap_vertex:dm,fog_vertex:fm,fog_pars_vertex:pm,fog_fragment:mm,fog_pars_fragment:gm,gradientmap_pars_fragment:_m,lightmap_pars_fragment:xm,lights_lambert_fragment:ym,lights_lambert_pars_fragment:vm,lights_pars_begin:bm,lights_toon_fragment:Sm,lights_toon_pars_fragment:wm,lights_phong_fragment:Em,lights_phong_pars_fragment:Tm,lights_physical_fragment:Am,lights_physical_pars_fragment:Rm,lights_fragment_begin:Cm,lights_fragment_maps:Pm,lights_fragment_end:Im,logdepthbuf_fragment:Lm,logdepthbuf_pars_fragment:Dm,logdepthbuf_pars_vertex:Um,logdepthbuf_vertex:Nm,map_fragment:Fm,map_pars_fragment:km,map_particle_fragment:Om,map_particle_pars_fragment:Bm,metalnessmap_fragment:zm,metalnessmap_pars_fragment:Hm,morphinstance_vertex:Vm,morphcolor_vertex:Gm,morphnormal_vertex:Wm,morphtarget_pars_vertex:Xm,morphtarget_vertex:Ym,normal_fragment_begin:qm,normal_fragment_maps:Zm,normal_pars_fragment:$m,normal_pars_vertex:Jm,normal_vertex:Km,normalmap_pars_fragment:jm,clearcoat_normal_fragment_begin:Qm,clearcoat_normal_fragment_maps:e0,clearcoat_pars_fragment:t0,iridescence_pars_fragment:n0,opaque_fragment:i0,packing:s0,premultiplied_alpha_fragment:r0,project_vertex:o0,dithering_fragment:a0,dithering_pars_fragment:l0,roughnessmap_fragment:c0,roughnessmap_pars_fragment:h0,shadowmap_pars_fragment:u0,shadowmap_pars_vertex:d0,shadowmap_vertex:f0,shadowmask_pars_fragment:p0,skinbase_vertex:m0,skinning_pars_vertex:g0,skinning_vertex:_0,skinnormal_vertex:x0,specularmap_fragment:y0,specularmap_pars_fragment:v0,tonemapping_fragment:b0,tonemapping_pars_fragment:M0,transmission_fragment:S0,transmission_pars_fragment:w0,uv_pars_fragment:E0,uv_pars_vertex:T0,uv_vertex:A0,worldpos_vertex:R0,background_vert:C0,background_frag:P0,backgroundCube_vert:I0,backgroundCube_frag:L0,cube_vert:D0,cube_frag:U0,depth_vert:N0,depth_frag:F0,distanceRGBA_vert:k0,distanceRGBA_frag:O0,equirect_vert:B0,equirect_frag:z0,linedashed_vert:H0,linedashed_frag:V0,meshbasic_vert:G0,meshbasic_frag:W0,meshlambert_vert:X0,meshlambert_frag:Y0,meshmatcap_vert:q0,meshmatcap_frag:Z0,meshnormal_vert:$0,meshnormal_frag:J0,meshphong_vert:K0,meshphong_frag:j0,meshphysical_vert:Q0,meshphysical_frag:eg,meshtoon_vert:tg,meshtoon_frag:ng,points_vert:ig,points_frag:sg,shadow_vert:rg,shadow_frag:og,sprite_vert:ag,sprite_frag:lg},ce={common:{diffuse:{value:new Re(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Re(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Re(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Re(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},$n={basic:{uniforms:Jt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:Jt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Re(0)}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:Jt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Re(0)},specular:{value:new Re(1118481)},shininess:{value:30}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:Jt([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Re(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:Jt([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Re(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:Jt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:Jt([ce.points,ce.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:Jt([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:Jt([ce.common,ce.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:Jt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:Jt([ce.sprite,ce.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distanceRGBA:{uniforms:Jt([ce.common,ce.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distanceRGBA_vert,fragmentShader:Ge.distanceRGBA_frag},shadow:{uniforms:Jt([ce.lights,ce.fog,{color:{value:new Re(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};$n.physical={uniforms:Jt([$n.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Re(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Re(0)},specularColor:{value:new Re(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};var Io={r:0,b:0,g:0},Ki=new An,cg=new We;function hg(n,e,t,i,s,r,o){let a=new Re(0),c=r===!0?0:1,l,h,u=null,m=0,p=null;function g(x){let M=x.isScene===!0?x.background:null;return M&&M.isTexture&&(M=(x.backgroundBlurriness>0?t:e).get(M)),M}function _(x){let M=!1,y=g(x);y===null?d(a,c):y&&y.isColor&&(d(y,1),M=!0);let C=n.xr.getEnvironmentBlendMode();C==="additive"?i.buffers.color.setClear(0,0,0,1,o):C==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function f(x,M){let y=g(M);y&&(y.isCubeTexture||y.mapping===fa)?(h===void 0&&(h=new Le(new Bn(1,1,1),new Qn({name:"BackgroundCubeMaterial",uniforms:Zs($n.backgroundCube.uniforms),vertexShader:$n.backgroundCube.vertexShader,fragmentShader:$n.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ki.copy(M.backgroundRotation),Ki.x*=-1,Ki.y*=-1,Ki.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ki.y*=-1,Ki.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(cg.makeRotationFromEuler(Ki)),h.material.toneMapped=Je.getTransfer(y.colorSpace)!==st,(u!==y||m!==y.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=y,m=y.version,p=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Le(new xi(2,2),new Qn({name:"BackgroundMaterial",uniforms:Zs($n.background.uniforms),vertexShader:$n.background.vertexShader,fragmentShader:$n.background.fragmentShader,side:Fi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=Je.getTransfer(y.colorSpace)!==st,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||m!==y.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,m=y.version,p=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function d(x,M){x.getRGB(Io,cd(n)),i.buffers.color.setClear(Io.r,Io.g,Io.b,M,o)}return{getClearColor:function(){return a},setClearColor:function(x,M=1){a.set(x),c=M,d(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,d(a,c)},render:_,addToRenderList:f}}function ug(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=m(null),r=s,o=!1;function a(v,L,V,G,E){let B=!1,D=u(G,V,L);r!==D&&(r=D,l(r.object)),B=p(v,G,V,E),B&&g(v,G,V,E),E!==null&&e.update(E,n.ELEMENT_ARRAY_BUFFER),(B||o)&&(o=!1,y(v,L,V,G),E!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(E).buffer))}function c(){return n.createVertexArray()}function l(v){return n.bindVertexArray(v)}function h(v){return n.deleteVertexArray(v)}function u(v,L,V){let G=V.wireframe===!0,E=i[v.id];E===void 0&&(E={},i[v.id]=E);let B=E[L.id];B===void 0&&(B={},E[L.id]=B);let D=B[G];return D===void 0&&(D=m(c()),B[G]=D),D}function m(v){let L=[],V=[],G=[];for(let E=0;E<t;E++)L[E]=0,V[E]=0,G[E]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:V,attributeDivisors:G,object:v,attributes:{},index:null}}function p(v,L,V,G){let E=r.attributes,B=L.attributes,D=0,q=V.getAttributes();for(let z in q)if(q[z].location>=0){let ie=E[z],te=B[z];if(te===void 0&&(z==="instanceMatrix"&&v.instanceMatrix&&(te=v.instanceMatrix),z==="instanceColor"&&v.instanceColor&&(te=v.instanceColor)),ie===void 0||ie.attribute!==te||te&&ie.data!==te.data)return!0;D++}return r.attributesNum!==D||r.index!==G}function g(v,L,V,G){let E={},B=L.attributes,D=0,q=V.getAttributes();for(let z in q)if(q[z].location>=0){let ie=B[z];ie===void 0&&(z==="instanceMatrix"&&v.instanceMatrix&&(ie=v.instanceMatrix),z==="instanceColor"&&v.instanceColor&&(ie=v.instanceColor));let te={};te.attribute=ie,ie&&ie.data&&(te.data=ie.data),E[z]=te,D++}r.attributes=E,r.attributesNum=D,r.index=G}function _(){let v=r.newAttributes;for(let L=0,V=v.length;L<V;L++)v[L]=0}function f(v){d(v,0)}function d(v,L){let V=r.newAttributes,G=r.enabledAttributes,E=r.attributeDivisors;V[v]=1,G[v]===0&&(n.enableVertexAttribArray(v),G[v]=1),E[v]!==L&&(n.vertexAttribDivisor(v,L),E[v]=L)}function x(){let v=r.newAttributes,L=r.enabledAttributes;for(let V=0,G=L.length;V<G;V++)L[V]!==v[V]&&(n.disableVertexAttribArray(V),L[V]=0)}function M(v,L,V,G,E,B,D){D===!0?n.vertexAttribIPointer(v,L,V,E,B):n.vertexAttribPointer(v,L,V,G,E,B)}function y(v,L,V,G){_();let E=G.attributes,B=V.getAttributes(),D=L.defaultAttributeValues;for(let q in B){let z=B[q];if(z.location>=0){let Y=E[q];if(Y===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(Y=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(Y=v.instanceColor)),Y!==void 0){let ie=Y.normalized,te=Y.itemSize,me=e.get(Y);if(me===void 0)continue;let ke=me.buffer,U=me.type,Z=me.bytesPerElement,re=U===n.INT||U===n.UNSIGNED_INT||Y.gpuType===Nc;if(Y.isInterleavedBufferAttribute){let ee=Y.data,we=ee.stride,Ee=Y.offset;if(ee.isInstancedInterleavedBuffer){for(let De=0;De<z.locationSize;De++)d(z.location+De,ee.meshPerAttribute);v.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let De=0;De<z.locationSize;De++)f(z.location+De);n.bindBuffer(n.ARRAY_BUFFER,ke);for(let De=0;De<z.locationSize;De++)M(z.location+De,te/z.locationSize,U,ie,we*Z,(Ee+te/z.locationSize*De)*Z,re)}else{if(Y.isInstancedBufferAttribute){for(let ee=0;ee<z.locationSize;ee++)d(z.location+ee,Y.meshPerAttribute);v.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let ee=0;ee<z.locationSize;ee++)f(z.location+ee);n.bindBuffer(n.ARRAY_BUFFER,ke);for(let ee=0;ee<z.locationSize;ee++)M(z.location+ee,te/z.locationSize,U,ie,te*Z,te/z.locationSize*ee*Z,re)}}else if(D!==void 0){let ie=D[q];if(ie!==void 0)switch(ie.length){case 2:n.vertexAttrib2fv(z.location,ie);break;case 3:n.vertexAttrib3fv(z.location,ie);break;case 4:n.vertexAttrib4fv(z.location,ie);break;default:n.vertexAttrib1fv(z.location,ie)}}}}x()}function C(){P();for(let v in i){let L=i[v];for(let V in L){let G=L[V];for(let E in G)h(G[E].object),delete G[E];delete L[V]}delete i[v]}}function T(v){if(i[v.id]===void 0)return;let L=i[v.id];for(let V in L){let G=L[V];for(let E in G)h(G[E].object),delete G[E];delete L[V]}delete i[v.id]}function A(v){for(let L in i){let V=i[L];if(V[v.id]===void 0)continue;let G=V[v.id];for(let E in G)h(G[E].object),delete G[E];delete V[v.id]}}function P(){b(),o=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:b,dispose:C,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:f,disableUnusedAttributes:x}}function dg(n,e,t){let i;function s(l){i=l}function r(l,h){n.drawArrays(i,l,h),t.update(h,i,1)}function o(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),t.update(h,i,u))}function a(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];t.update(p,i,1)}function c(l,h,u,m){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],h[g],m[g]);else{p.multiDrawArraysInstancedWEBGL(i,l,0,h,0,m,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*m[_];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function fg(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==kn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let P=A===Wr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==gi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Kn&&!P)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,m=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),f=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:m,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:f,maxAttributes:d,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:y,vertexTextures:C,maxSamples:T}}function pg(n){let e=this,t=null,i=0,s=!1,r=!1,o=new vn,a=new ze,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,m){let p=u.length!==0||m||i!==0||s;return s=m,i=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,m){t=h(u,m,0)},this.setState=function(u,m,p){let g=u.clippingPlanes,_=u.clipIntersection,f=u.clipShadows,d=n.get(u);if(!s||g===null||g.length===0||r&&!f)r?h(null):l();else{let x=r?0:i,M=x*4,y=d.clippingState||null;c.value=y,y=h(g,m,M,p);for(let C=0;C!==M;++C)y[C]=t[C];d.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,m,p,g){let _=u!==null?u.length:0,f=null;if(_!==0){if(f=c.value,g!==!0||f===null){let d=p+_*4,x=m.matrixWorldInverse;a.getNormalMatrix(x),(f===null||f.length<d)&&(f=new Float32Array(d));for(let M=0,y=p;M!==_;++M,y+=4)o.copy(u[M]).applyMatrix4(x,a),o.normal.toArray(f,y),f[y+3]=o.constant}c.value=f,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,f}}function mg(n){let e=new WeakMap;function t(o,a){return a===Tl?o.mapping=Ws:a===Al&&(o.mapping=Xs),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===Tl||a===Al)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new oc(c.height);return l.fromEquirectangularTexture(n,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var Qo=class extends Ko{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Os=4,pu=[.125,.215,.35,.446,.526,.582],ns=20,rl=new Qo,mu=new Re,ol=null,al=0,ll=0,cl=!1,Qi=(1+Math.sqrt(5))/2,Ns=1/Qi,gu=[new I(-Qi,Ns,0),new I(Qi,Ns,0),new I(-Ns,0,Qi),new I(Ns,0,Qi),new I(0,Qi,-Ns),new I(0,Qi,Ns),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],$s=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){ol=this._renderer.getRenderTarget(),al=this._renderer.getActiveCubeFace(),ll=this._renderer.getActiveMipmapLevel(),cl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ol,al,ll),this._renderer.xr.enabled=cl,e.scissorTest=!1,Lo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ws||e.mapping===Xs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ol=this._renderer.getRenderTarget(),al=this._renderer.getActiveCubeFace(),ll=this._renderer.getActiveMipmapLevel(),cl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Jn,minFilter:Jn,generateMipmaps:!1,type:Wr,format:kn,colorSpace:Qs,depthBuffer:!1},s=_u(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_u(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=gg(r)),this._blurMaterial=_g(r,e,t)}return s}_compileMaterial(e){let t=new Le(this._lodPlanes[0],e);this._renderer.compile(t,rl)}_sceneToCubeUV(e,t,i,s){let a=new zt(90,1,t,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,m=h.toneMapping;h.getClearColor(mu),h.toneMapping=jn,h.autoClear=!1;let p=new on({name:"PMREM.Background",side:qt,depthWrite:!1,depthTest:!1}),g=new Le(new Bn,p),_=!1,f=e.background;f?f.isColor&&(p.color.copy(f),e.background=null,_=!0):(p.color.copy(mu),_=!0);for(let d=0;d<6;d++){let x=d%3;x===0?(a.up.set(0,c[d],0),a.lookAt(l[d],0,0)):x===1?(a.up.set(0,0,c[d]),a.lookAt(0,l[d],0)):(a.up.set(0,c[d],0),a.lookAt(0,0,l[d]));let M=this._cubeSize;Lo(s,x*M,d>2?M:0,M,M),h.setRenderTarget(s),_&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=m,h.autoClear=u,e.background=f}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Ws||e.mapping===Xs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=yu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xu());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Le(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Lo(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,rl)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=gu[(s-r-1)%gu.length];this._blur(e,r-1,r,o,a)}t.autoClear=i}_blur(e,t,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Le(this._lodPlanes[s],l),m=l.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ns-1),_=r/g,f=isFinite(r)?1+Math.floor(h*_):ns;f>ns&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${ns}`);let d=[],x=0;for(let A=0;A<ns;++A){let P=A/_,b=Math.exp(-P*P/2);d.push(b),A===0?x+=b:A<f&&(x+=2*b)}for(let A=0;A<d.length;A++)d[A]=d[A]/x;m.envMap.value=e.texture,m.samples.value=f,m.weights.value=d,m.latitudinal.value=o==="latitudinal",a&&(m.poleAxis.value=a);let{_lodMax:M}=this;m.dTheta.value=g,m.mipInt.value=M-i;let y=this._sizeLods[s],C=3*y*(s>M-Os?s-M+Os:0),T=4*(this._cubeSize-y);Lo(t,C,T,3*y,2*y),c.setRenderTarget(t),c.render(u,rl)}};function gg(n){let e=[],t=[],i=[],s=n,r=n-Os+1+pu.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>n-Os?c=pu[o-n+Os-1]:o===0&&(c=0),i.push(c);let l=1/(a-2),h=-l,u=1+l,m=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,f=2,d=1,x=new Float32Array(_*g*p),M=new Float32Array(f*g*p),y=new Float32Array(d*g*p);for(let T=0;T<p;T++){let A=T%3*2/3-1,P=T>2?0:-1,b=[A,P,0,A+2/3,P,0,A+2/3,P+1,0,A,P,0,A+2/3,P+1,0,A,P+1,0];x.set(b,_*g*T),M.set(m,f*g*T);let v=[T,T,T,T,T,T];y.set(v,d*g*T)}let C=new bt;C.setAttribute("position",new wt(x,_)),C.setAttribute("uv",new wt(M,f)),C.setAttribute("faceIndex",new wt(y,d)),e.push(C),s>Os&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function _u(n,e,t){let i=new On(n,e,t);return i.texture.mapping=fa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Lo(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function _g(n,e,t){let i=new Float32Array(ns),s=new I(0,1,0);return new Qn({name:"SphericalGaussianBlur",defines:{n:ns,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Gc(),fragmentShader:`

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
		`,blending:Ni,depthTest:!1,depthWrite:!1})}function xu(){return new Qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Gc(),fragmentShader:`

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
		`,blending:Ni,depthTest:!1,depthWrite:!1})}function yu(){return new Qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Gc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ni,depthTest:!1,depthWrite:!1})}function Gc(){return`

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
	`}function xg(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){let c=a.mapping,l=c===Tl||c===Al,h=c===Ws||c===Xs;if(l||h){let u=e.get(a),m=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==m)return t===null&&(t=new $s(n)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return l&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new $s(n)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function yg(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Rr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function vg(n,e,t,i){let s={},r=new WeakMap;function o(u){let m=u.target;m.index!==null&&e.remove(m.index);for(let g in m.attributes)e.remove(m.attributes[g]);for(let g in m.morphAttributes){let _=m.morphAttributes[g];for(let f=0,d=_.length;f<d;f++)e.remove(_[f])}m.removeEventListener("dispose",o),delete s[m.id];let p=r.get(m);p&&(e.remove(p),r.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function a(u,m){return s[m.id]===!0||(m.addEventListener("dispose",o),s[m.id]=!0,t.memory.geometries++),m}function c(u){let m=u.attributes;for(let g in m)e.update(m[g],n.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let f=0,d=_.length;f<d;f++)e.update(_[f],n.ARRAY_BUFFER)}}function l(u){let m=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let x=p.array;_=p.version;for(let M=0,y=x.length;M<y;M+=3){let C=x[M+0],T=x[M+1],A=x[M+2];m.push(C,T,T,A,A,C)}}else if(g!==void 0){let x=g.array;_=g.version;for(let M=0,y=x.length/3-1;M<y;M+=3){let C=M+0,T=M+1,A=M+2;m.push(C,T,T,A,A,C)}}else return;let f=new(ad(m)?Jo:$o)(m,1);f.version=_;let d=r.get(u);d&&e.remove(d),r.set(u,f)}function h(u){let m=r.get(u);if(m){let p=u.index;p!==null&&m.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function bg(n,e,t){let i;function s(m){i=m}let r,o;function a(m){r=m.type,o=m.bytesPerElement}function c(m,p){n.drawElements(i,p,r,m*o),t.update(p,i,1)}function l(m,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,m*o,g),t.update(p,i,g))}function h(m,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,m,0,g);let f=0;for(let d=0;d<g;d++)f+=p[d];t.update(f,i,1)}function u(m,p,g,_){if(g===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let d=0;d<m.length;d++)l(m[d]/o,p[d],_[d]);else{f.multiDrawElementsInstancedWEBGL(i,p,0,r,m,0,_,0,g);let d=0;for(let x=0;x<g;x++)d+=p[x]*_[x];t.update(d,i,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Mg(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Sg(n,e,t){let i=new WeakMap,s=new rt;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,m=i.get(a);if(m===void 0||m.count!==u){let b=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",b)};m!==void 0&&m.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],M=0;p===!0&&(M=1),g===!0&&(M=2),_===!0&&(M=3);let y=a.attributes.position.count*M,C=1;y>e.maxTextureSize&&(C=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let T=new Float32Array(y*C*4*u),A=new Zo(T,y,C,u);A.type=Kn,A.needsUpdate=!0;let P=M*4;for(let v=0;v<u;v++){let L=f[v],V=d[v],G=x[v],E=y*C*4*v;for(let B=0;B<L.count;B++){let D=B*P;p===!0&&(s.fromBufferAttribute(L,B),T[E+D+0]=s.x,T[E+D+1]=s.y,T[E+D+2]=s.z,T[E+D+3]=0),g===!0&&(s.fromBufferAttribute(V,B),T[E+D+4]=s.x,T[E+D+5]=s.y,T[E+D+6]=s.z,T[E+D+7]=0),_===!0&&(s.fromBufferAttribute(G,B),T[E+D+8]=s.x,T[E+D+9]=s.y,T[E+D+10]=s.z,T[E+D+11]=G.itemSize===4?s.w:1)}}m={count:u,texture:A,size:new ye(y,C)},i.set(a,m),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let p=0;for(let _=0;_<l.length;_++)p+=l[_];let g=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",m.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}return{update:r}}function wg(n,e,t,i){let s=new WeakMap;function r(c){let l=i.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let m=c.skeleton;s.get(m)!==l&&(m.update(),s.set(m,l))}return u}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}var ea=class extends rn{constructor(e,t,i,s,r,o,a,c,l,h=zs){if(h!==zs&&h!==qs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===zs&&(i=rs),i===void 0&&h===qs&&(i=Ys),super(null,s,r,o,a,c,h,i,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:bn,this.minFilter=c!==void 0?c:bn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ud=new rn,vu=new ea(1,1),dd=new Zo,fd=new sc,pd=new jo,bu=[],Mu=[],Su=new Float32Array(16),wu=new Float32Array(9),Eu=new Float32Array(4);function tr(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=bu[s];if(r===void 0&&(r=new Float32Array(s),bu[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function It(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Lt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ma(n,e){let t=Mu[e];t===void 0&&(t=new Int32Array(e),Mu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Eg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Tg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2fv(this.addr,e),Lt(t,e)}}function Ag(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(It(t,e))return;n.uniform3fv(this.addr,e),Lt(t,e)}}function Rg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4fv(this.addr,e),Lt(t,e)}}function Cg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Lt(t,e)}else{if(It(t,i))return;Eu.set(i),n.uniformMatrix2fv(this.addr,!1,Eu),Lt(t,i)}}function Pg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Lt(t,e)}else{if(It(t,i))return;wu.set(i),n.uniformMatrix3fv(this.addr,!1,wu),Lt(t,i)}}function Ig(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Lt(t,e)}else{if(It(t,i))return;Su.set(i),n.uniformMatrix4fv(this.addr,!1,Su),Lt(t,i)}}function Lg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Dg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2iv(this.addr,e),Lt(t,e)}}function Ug(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3iv(this.addr,e),Lt(t,e)}}function Ng(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4iv(this.addr,e),Lt(t,e)}}function Fg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function kg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2uiv(this.addr,e),Lt(t,e)}}function Og(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3uiv(this.addr,e),Lt(t,e)}}function Bg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4uiv(this.addr,e),Lt(t,e)}}function zg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(vu.compareFunction=od,r=vu):r=ud,t.setTexture2D(e||r,s)}function Hg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||fd,s)}function Vg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||pd,s)}function Gg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||dd,s)}function Wg(n){switch(n){case 5126:return Eg;case 35664:return Tg;case 35665:return Ag;case 35666:return Rg;case 35674:return Cg;case 35675:return Pg;case 35676:return Ig;case 5124:case 35670:return Lg;case 35667:case 35671:return Dg;case 35668:case 35672:return Ug;case 35669:case 35673:return Ng;case 5125:return Fg;case 36294:return kg;case 36295:return Og;case 36296:return Bg;case 35678:case 36198:case 36298:case 36306:case 35682:return zg;case 35679:case 36299:case 36307:return Hg;case 35680:case 36300:case 36308:case 36293:return Vg;case 36289:case 36303:case 36311:case 36292:return Gg}}function Xg(n,e){n.uniform1fv(this.addr,e)}function Yg(n,e){let t=tr(e,this.size,2);n.uniform2fv(this.addr,t)}function qg(n,e){let t=tr(e,this.size,3);n.uniform3fv(this.addr,t)}function Zg(n,e){let t=tr(e,this.size,4);n.uniform4fv(this.addr,t)}function $g(n,e){let t=tr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Jg(n,e){let t=tr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Kg(n,e){let t=tr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function jg(n,e){n.uniform1iv(this.addr,e)}function Qg(n,e){n.uniform2iv(this.addr,e)}function e_(n,e){n.uniform3iv(this.addr,e)}function t_(n,e){n.uniform4iv(this.addr,e)}function n_(n,e){n.uniform1uiv(this.addr,e)}function i_(n,e){n.uniform2uiv(this.addr,e)}function s_(n,e){n.uniform3uiv(this.addr,e)}function r_(n,e){n.uniform4uiv(this.addr,e)}function o_(n,e,t){let i=this.cache,s=e.length,r=ma(t,s);It(i,r)||(n.uniform1iv(this.addr,r),Lt(i,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||ud,r[o])}function a_(n,e,t){let i=this.cache,s=e.length,r=ma(t,s);It(i,r)||(n.uniform1iv(this.addr,r),Lt(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||fd,r[o])}function l_(n,e,t){let i=this.cache,s=e.length,r=ma(t,s);It(i,r)||(n.uniform1iv(this.addr,r),Lt(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||pd,r[o])}function c_(n,e,t){let i=this.cache,s=e.length,r=ma(t,s);It(i,r)||(n.uniform1iv(this.addr,r),Lt(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||dd,r[o])}function h_(n){switch(n){case 5126:return Xg;case 35664:return Yg;case 35665:return qg;case 35666:return Zg;case 35674:return $g;case 35675:return Jg;case 35676:return Kg;case 5124:case 35670:return jg;case 35667:case 35671:return Qg;case 35668:case 35672:return e_;case 35669:case 35673:return t_;case 5125:return n_;case 36294:return i_;case 36295:return s_;case 36296:return r_;case 35678:case 36198:case 36298:case 36306:case 35682:return o_;case 35679:case 36299:case 36307:return a_;case 35680:case 36300:case 36308:case 36293:return l_;case 36289:case 36303:case 36311:case 36292:return c_}}var ac=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Wg(t.type)}},lc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=h_(t.type)}},cc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},hl=/(\w+)(\])?(\[|\.)?/g;function Tu(n,e){n.seq.push(e),n.map[e.id]=e}function u_(n,e,t){let i=n.name,s=i.length;for(hl.lastIndex=0;;){let r=hl.exec(i),o=hl.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Tu(t,l===void 0?new ac(a,n,e):new lc(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new cc(a),Tu(t,u)),t=u}}}var Vs=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);u_(r,o,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function Au(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var d_=37297,f_=0;function p_(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var Ru=new ze;function m_(n){Je._getMatrix(Ru,Je.workingColorSpace,n);let e=`mat3( ${Ru.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(n)){case pa:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Cu(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+p_(n.getShaderSource(e),o)}else return s}function g_(n,e){let t=m_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function __(n,e){let t;switch(e){case Rf:t="Linear";break;case Cf:t="Reinhard";break;case Pf:t="Cineon";break;case Uc:t="ACESFilmic";break;case Lf:t="AgX";break;case Df:t="Neutral";break;case If:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Do=new I;function x_(){Je.getLuminanceCoefficients(Do);let n=Do.x.toFixed(4),e=Do.y.toFixed(4),t=Do.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function y_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cr).join(`
`)}function v_(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function b_(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Cr(n){return n!==""}function Pu(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Iu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var M_=/^[ \t]*#include +<([\w\d./]+)>/gm;function hc(n){return n.replace(M_,w_)}var S_=new Map;function w_(n,e){let t=Ge[e];if(t===void 0){let i=S_.get(e);if(i!==void 0)t=Ge[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return hc(t)}var E_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Lu(n){return n.replace(E_,T_)}function T_(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Du(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function A_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===qu?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===af?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===fi&&(e="SHADOWMAP_TYPE_VSM"),e}function R_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ws:case Xs:e="ENVMAP_TYPE_CUBE";break;case fa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function C_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Xs:e="ENVMAP_MODE_REFRACTION";break}return e}function P_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Zu:e="ENVMAP_BLENDING_MULTIPLY";break;case Tf:e="ENVMAP_BLENDING_MIX";break;case Af:e="ENVMAP_BLENDING_ADD";break}return e}function I_(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function L_(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=A_(t),l=R_(t),h=C_(t),u=P_(t),m=I_(t),p=y_(t),g=v_(r),_=s.createProgram(),f,d,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Cr).join(`
`),f.length>0&&(f+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Cr).join(`
`),d.length>0&&(d+=`
`)):(f=[Du(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cr).join(`
`),d=[Du(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==jn?"#define TONE_MAPPING":"",t.toneMapping!==jn?Ge.tonemapping_pars_fragment:"",t.toneMapping!==jn?__("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,g_("linearToOutputTexel",t.outputColorSpace),x_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Cr).join(`
`)),o=hc(o),o=Pu(o,t),o=Iu(o,t),a=hc(a),a=Pu(a,t),a=Iu(a,t),o=Lu(o),a=Lu(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,d=["#define varying in",t.glslVersion===Yh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Yh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let M=x+f+o,y=x+d+a,C=Au(s,s.VERTEX_SHADER,M),T=Au(s,s.FRAGMENT_SHADER,y);s.attachShader(_,C),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(L){if(n.debug.checkShaderErrors){let V=s.getProgramInfoLog(_).trim(),G=s.getShaderInfoLog(C).trim(),E=s.getShaderInfoLog(T).trim(),B=!0,D=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(B=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,C,T);else{let q=Cu(s,C,"vertex"),z=Cu(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+V+`
`+q+`
`+z)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(G===""||E==="")&&(D=!1);D&&(L.diagnostics={runnable:B,programLog:V,vertexShader:{log:G,prefix:f},fragmentShader:{log:E,prefix:d}})}s.deleteShader(C),s.deleteShader(T),P=new Vs(s,_),b=b_(s,_)}let P;this.getUniforms=function(){return P===void 0&&A(this),P};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,d_)),v},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=f_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=C,this.fragmentShader=T,this}var D_=0,uc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new dc(e),t.set(e,i)),i}},dc=class{constructor(e){this.id=D_++,this.code=e,this.usedTimes=0}};function U_(n,e,t,i,s,r,o){let a=new Fr,c=new uc,l=new Set,h=[],u=s.logarithmicDepthBuffer,m=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function f(b,v,L,V,G){let E=V.fog,B=G.geometry,D=b.isMeshStandardMaterial?V.environment:null,q=(b.isMeshStandardMaterial?t:e).get(b.envMap||D),z=q&&q.mapping===fa?q.image.height:null,Y=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));let ie=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,te=ie!==void 0?ie.length:0,me=0;B.morphAttributes.position!==void 0&&(me=1),B.morphAttributes.normal!==void 0&&(me=2),B.morphAttributes.color!==void 0&&(me=3);let ke,U,Z,re;if(Y){let tt=$n[Y];ke=tt.vertexShader,U=tt.fragmentShader}else ke=b.vertexShader,U=b.fragmentShader,c.update(b),Z=c.getVertexShaderID(b),re=c.getFragmentShaderID(b);let ee=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Ee=G.isInstancedMesh===!0,De=G.isBatchedMesh===!0,pt=!!b.map,Ze=!!b.matcap,St=!!q,O=!!b.aoMap,wn=!!b.lightMap,Xe=!!b.bumpMap,Ye=!!b.normalMap,Pe=!!b.displacementMap,mt=!!b.emissiveMap,Ce=!!b.metalnessMap,R=!!b.roughnessMap,S=b.anisotropy>0,H=b.clearcoat>0,j=b.dispersion>0,ne=b.iridescence>0,K=b.sheen>0,Te=b.transmission>0,ue=S&&!!b.anisotropyMap,ge=H&&!!b.clearcoatMap,$e=H&&!!b.clearcoatNormalMap,oe=H&&!!b.clearcoatRoughnessMap,_e=ne&&!!b.iridescenceMap,Ie=ne&&!!b.iridescenceThicknessMap,Ue=K&&!!b.sheenColorMap,xe=K&&!!b.sheenRoughnessMap,qe=!!b.specularMap,Ve=!!b.specularColorMap,dt=!!b.specularIntensityMap,N=Te&&!!b.transmissionMap,he=Te&&!!b.thicknessMap,$=!!b.gradientMap,Q=!!b.alphaMap,pe=b.alphaTest>0,de=!!b.alphaHash,Oe=!!b.extensions,yt=jn;b.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(yt=n.toneMapping);let Wt={shaderID:Y,shaderType:b.type,shaderName:b.name,vertexShader:ke,fragmentShader:U,defines:b.defines,customVertexShaderID:Z,customFragmentShaderID:re,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:De,batchingColor:De&&G._colorsTexture!==null,instancing:Ee,instancingColor:Ee&&G.instanceColor!==null,instancingMorph:Ee&&G.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:ee===null?n.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Qs,alphaToCoverage:!!b.alphaToCoverage,map:pt,matcap:Ze,envMap:St,envMapMode:St&&q.mapping,envMapCubeUVHeight:z,aoMap:O,lightMap:wn,bumpMap:Xe,normalMap:Ye,displacementMap:m&&Pe,emissiveMap:mt,normalMapObjectSpace:Ye&&b.normalMapType===kf,normalMapTangentSpace:Ye&&b.normalMapType===rd,metalnessMap:Ce,roughnessMap:R,anisotropy:S,anisotropyMap:ue,clearcoat:H,clearcoatMap:ge,clearcoatNormalMap:$e,clearcoatRoughnessMap:oe,dispersion:j,iridescence:ne,iridescenceMap:_e,iridescenceThicknessMap:Ie,sheen:K,sheenColorMap:Ue,sheenRoughnessMap:xe,specularMap:qe,specularColorMap:Ve,specularIntensityMap:dt,transmission:Te,transmissionMap:N,thicknessMap:he,gradientMap:$,opaque:b.transparent===!1&&b.blending===Bs&&b.alphaToCoverage===!1,alphaMap:Q,alphaTest:pe,alphaHash:de,combine:b.combine,mapUv:pt&&_(b.map.channel),aoMapUv:O&&_(b.aoMap.channel),lightMapUv:wn&&_(b.lightMap.channel),bumpMapUv:Xe&&_(b.bumpMap.channel),normalMapUv:Ye&&_(b.normalMap.channel),displacementMapUv:Pe&&_(b.displacementMap.channel),emissiveMapUv:mt&&_(b.emissiveMap.channel),metalnessMapUv:Ce&&_(b.metalnessMap.channel),roughnessMapUv:R&&_(b.roughnessMap.channel),anisotropyMapUv:ue&&_(b.anisotropyMap.channel),clearcoatMapUv:ge&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:$e&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:oe&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ie&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ue&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:xe&&_(b.sheenRoughnessMap.channel),specularMapUv:qe&&_(b.specularMap.channel),specularColorMapUv:Ve&&_(b.specularColorMap.channel),specularIntensityMapUv:dt&&_(b.specularIntensityMap.channel),transmissionMapUv:N&&_(b.transmissionMap.channel),thicknessMapUv:he&&_(b.thicknessMap.channel),alphaMapUv:Q&&_(b.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(Ye||S),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!B.attributes.uv&&(pt||Q),fog:!!E,useFog:b.fog===!0,fogExp2:!!E&&E.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:we,skinning:G.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:te,morphTextureStride:me,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:yt,decodeVideoTexture:pt&&b.map.isVideoTexture===!0&&Je.getTransfer(b.map.colorSpace)===st,decodeVideoTextureEmissive:mt&&b.emissiveMap.isVideoTexture===!0&&Je.getTransfer(b.emissiveMap.colorSpace)===st,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ht,flipSided:b.side===qt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Oe&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Oe&&b.extensions.multiDraw===!0||De)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Wt.vertexUv1s=l.has(1),Wt.vertexUv2s=l.has(2),Wt.vertexUv3s=l.has(3),l.clear(),Wt}function d(b){let v=[];if(b.shaderID?v.push(b.shaderID):(v.push(b.customVertexShaderID),v.push(b.customFragmentShaderID)),b.defines!==void 0)for(let L in b.defines)v.push(L),v.push(b.defines[L]);return b.isRawShaderMaterial===!1&&(x(v,b),M(v,b),v.push(n.outputColorSpace)),v.push(b.customProgramCacheKey),v.join()}function x(b,v){b.push(v.precision),b.push(v.outputColorSpace),b.push(v.envMapMode),b.push(v.envMapCubeUVHeight),b.push(v.mapUv),b.push(v.alphaMapUv),b.push(v.lightMapUv),b.push(v.aoMapUv),b.push(v.bumpMapUv),b.push(v.normalMapUv),b.push(v.displacementMapUv),b.push(v.emissiveMapUv),b.push(v.metalnessMapUv),b.push(v.roughnessMapUv),b.push(v.anisotropyMapUv),b.push(v.clearcoatMapUv),b.push(v.clearcoatNormalMapUv),b.push(v.clearcoatRoughnessMapUv),b.push(v.iridescenceMapUv),b.push(v.iridescenceThicknessMapUv),b.push(v.sheenColorMapUv),b.push(v.sheenRoughnessMapUv),b.push(v.specularMapUv),b.push(v.specularColorMapUv),b.push(v.specularIntensityMapUv),b.push(v.transmissionMapUv),b.push(v.thicknessMapUv),b.push(v.combine),b.push(v.fogExp2),b.push(v.sizeAttenuation),b.push(v.morphTargetsCount),b.push(v.morphAttributeCount),b.push(v.numDirLights),b.push(v.numPointLights),b.push(v.numSpotLights),b.push(v.numSpotLightMaps),b.push(v.numHemiLights),b.push(v.numRectAreaLights),b.push(v.numDirLightShadows),b.push(v.numPointLightShadows),b.push(v.numSpotLightShadows),b.push(v.numSpotLightShadowsWithMaps),b.push(v.numLightProbes),b.push(v.shadowMapType),b.push(v.toneMapping),b.push(v.numClippingPlanes),b.push(v.numClipIntersection),b.push(v.depthPacking)}function M(b,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reverseDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),b.push(a.mask)}function y(b){let v=g[b.type],L;if(v){let V=$n[v];L=wp.clone(V.uniforms)}else L=b.uniforms;return L}function C(b,v){let L;for(let V=0,G=h.length;V<G;V++){let E=h[V];if(E.cacheKey===v){L=E,++L.usedTimes;break}}return L===void 0&&(L=new L_(n,v,b,r),h.push(L)),L}function T(b){if(--b.usedTimes===0){let v=h.indexOf(b);h[v]=h[h.length-1],h.pop(),b.destroy()}}function A(b){c.remove(b)}function P(){c.dispose()}return{getParameters:f,getProgramCacheKey:d,getUniforms:y,acquireProgram:C,releaseProgram:T,releaseShaderCache:A,programs:h,dispose:P}}function N_(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function F_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Uu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Nu(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(u,m,p,g,_,f){let d=n[e];return d===void 0?(d={id:u.id,object:u,geometry:m,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:f},n[e]=d):(d.id=u.id,d.object=u,d.geometry=m,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=f),e++,d}function a(u,m,p,g,_,f){let d=o(u,m,p,g,_,f);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):t.push(d)}function c(u,m,p,g,_,f){let d=o(u,m,p,g,_,f);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function l(u,m){t.length>1&&t.sort(u||F_),i.length>1&&i.sort(m||Uu),s.length>1&&s.sort(m||Uu)}function h(){for(let u=e,m=n.length;u<m;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function k_(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new Nu,n.set(i,[o])):s>=r.length?(o=new Nu,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function O_(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Re};break;case"SpotLight":t={position:new I,direction:new I,color:new Re,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Re,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Re,groundColor:new Re};break;case"RectAreaLight":t={color:new Re,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t}}}function B_(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var z_=0;function H_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function V_(n){let e=new O_,t=B_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new I);let s=new I,r=new We,o=new We;function a(l){let h=0,u=0,m=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let p=0,g=0,_=0,f=0,d=0,x=0,M=0,y=0,C=0,T=0,A=0;l.sort(H_);for(let b=0,v=l.length;b<v;b++){let L=l[b],V=L.color,G=L.intensity,E=L.distance,B=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=V.r*G,u+=V.g*G,m+=V.b*G;else if(L.isLightProbe){for(let D=0;D<9;D++)i.probe[D].addScaledVector(L.sh.coefficients[D],G);A++}else if(L.isDirectionalLight){let D=e.get(L);if(D.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let q=L.shadow,z=t.get(L);z.shadowIntensity=q.intensity,z.shadowBias=q.bias,z.shadowNormalBias=q.normalBias,z.shadowRadius=q.radius,z.shadowMapSize=q.mapSize,i.directionalShadow[p]=z,i.directionalShadowMap[p]=B,i.directionalShadowMatrix[p]=L.shadow.matrix,x++}i.directional[p]=D,p++}else if(L.isSpotLight){let D=e.get(L);D.position.setFromMatrixPosition(L.matrixWorld),D.color.copy(V).multiplyScalar(G),D.distance=E,D.coneCos=Math.cos(L.angle),D.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),D.decay=L.decay,i.spot[_]=D;let q=L.shadow;if(L.map&&(i.spotLightMap[C]=L.map,C++,q.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[_]=q.matrix,L.castShadow){let z=t.get(L);z.shadowIntensity=q.intensity,z.shadowBias=q.bias,z.shadowNormalBias=q.normalBias,z.shadowRadius=q.radius,z.shadowMapSize=q.mapSize,i.spotShadow[_]=z,i.spotShadowMap[_]=B,y++}_++}else if(L.isRectAreaLight){let D=e.get(L);D.color.copy(V).multiplyScalar(G),D.halfWidth.set(L.width*.5,0,0),D.halfHeight.set(0,L.height*.5,0),i.rectArea[f]=D,f++}else if(L.isPointLight){let D=e.get(L);if(D.color.copy(L.color).multiplyScalar(L.intensity),D.distance=L.distance,D.decay=L.decay,L.castShadow){let q=L.shadow,z=t.get(L);z.shadowIntensity=q.intensity,z.shadowBias=q.bias,z.shadowNormalBias=q.normalBias,z.shadowRadius=q.radius,z.shadowMapSize=q.mapSize,z.shadowCameraNear=q.camera.near,z.shadowCameraFar=q.camera.far,i.pointShadow[g]=z,i.pointShadowMap[g]=B,i.pointShadowMatrix[g]=L.shadow.matrix,M++}i.point[g]=D,g++}else if(L.isHemisphereLight){let D=e.get(L);D.skyColor.copy(L.color).multiplyScalar(G),D.groundColor.copy(L.groundColor).multiplyScalar(G),i.hemi[d]=D,d++}}f>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ce.LTC_FLOAT_1,i.rectAreaLTC2=ce.LTC_FLOAT_2):(i.rectAreaLTC1=ce.LTC_HALF_1,i.rectAreaLTC2=ce.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=m;let P=i.hash;(P.directionalLength!==p||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==f||P.hemiLength!==d||P.numDirectionalShadows!==x||P.numPointShadows!==M||P.numSpotShadows!==y||P.numSpotMaps!==C||P.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=f,i.point.length=g,i.hemi.length=d,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=y+C-T,i.spotLightMap.length=C,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,P.directionalLength=p,P.pointLength=g,P.spotLength=_,P.rectAreaLength=f,P.hemiLength=d,P.numDirectionalShadows=x,P.numPointShadows=M,P.numSpotShadows=y,P.numSpotMaps=C,P.numLightProbes=A,i.version=z_++)}function c(l,h){let u=0,m=0,p=0,g=0,_=0,f=h.matrixWorldInverse;for(let d=0,x=l.length;d<x;d++){let M=l[d];if(M.isDirectionalLight){let y=i.directional[u];y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(f),u++}else if(M.isSpotLight){let y=i.spot[p];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(f),y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(f),p++}else if(M.isRectAreaLight){let y=i.rectArea[g];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(f),o.identity(),r.copy(M.matrixWorld),r.premultiply(f),o.extractRotation(r),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){let y=i.point[m];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(f),m++}else if(M.isHemisphereLight){let y=i.hemi[_];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(f),_++}}}return{setup:a,setupView:c,state:i}}function Fu(n){let e=new V_(n),t=[],i=[];function s(h){l.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function o(h){i.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function G_(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Fu(n),e.set(s,[a])):r>=o.length?(a=new Fu(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var fc=class extends Oi{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Nf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},pc=class extends Oi{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},W_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,X_=`uniform sampler2D shadow_pass;
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
}`;function Y_(n,e,t){let i=new kr,s=new ye,r=new ye,o=new rt,a=new fc({depthPacking:Ff}),c=new pc,l={},h=t.maxTextureSize,u={[Fi]:qt,[qt]:Fi,[Ht]:Ht},m=new Qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:W_,fragmentShader:X_}),p=m.clone();p.defines.HORIZONTAL_PASS=1;let g=new bt;g.setAttribute("position",new wt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Le(g,m),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qu;let d=this.type;this.render=function(T,A,P){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||T.length===0)return;let b=n.getRenderTarget(),v=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),V=n.state;V.setBlending(Ni),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let G=d!==fi&&this.type===fi,E=d===fi&&this.type!==fi;for(let B=0,D=T.length;B<D;B++){let q=T[B],z=q.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let Y=z.getFrameExtents();if(s.multiply(Y),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Y.x),s.x=r.x*Y.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Y.y),s.y=r.y*Y.y,z.mapSize.y=r.y)),z.map===null||G===!0||E===!0){let te=this.type!==fi?{minFilter:bn,magFilter:bn}:{};z.map!==null&&z.map.dispose(),z.map=new On(s.x,s.y,te),z.map.texture.name=q.name+".shadowMap",z.camera.updateProjectionMatrix()}n.setRenderTarget(z.map),n.clear();let ie=z.getViewportCount();for(let te=0;te<ie;te++){let me=z.getViewport(te);o.set(r.x*me.x,r.y*me.y,r.x*me.z,r.y*me.w),V.viewport(o),z.updateMatrices(q,te),i=z.getFrustum(),y(A,P,z.camera,q,this.type)}z.isPointLightShadow!==!0&&this.type===fi&&x(z,P),z.needsUpdate=!1}d=this.type,f.needsUpdate=!1,n.setRenderTarget(b,v,L)};function x(T,A){let P=e.update(_);m.defines.VSM_SAMPLES!==T.blurSamples&&(m.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,m.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new On(s.x,s.y)),m.uniforms.shadow_pass.value=T.map.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,P,m,_,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,P,p,_,null)}function M(T,A,P,b){let v=null,L=P.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)v=L;else if(v=P.isPointLight===!0?c:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let V=v.uuid,G=A.uuid,E=l[V];E===void 0&&(E={},l[V]=E);let B=E[G];B===void 0&&(B=v.clone(),E[G]=B,A.addEventListener("dispose",C)),v=B}if(v.visible=A.visible,v.wireframe=A.wireframe,b===fi?v.side=A.shadowSide!==null?A.shadowSide:A.side:v.side=A.shadowSide!==null?A.shadowSide:u[A.side],v.alphaMap=A.alphaMap,v.alphaTest=A.alphaTest,v.map=A.map,v.clipShadows=A.clipShadows,v.clippingPlanes=A.clippingPlanes,v.clipIntersection=A.clipIntersection,v.displacementMap=A.displacementMap,v.displacementScale=A.displacementScale,v.displacementBias=A.displacementBias,v.wireframeLinewidth=A.wireframeLinewidth,v.linewidth=A.linewidth,P.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let V=n.properties.get(v);V.light=P}return v}function y(T,A,P,b,v){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&v===fi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,T.matrixWorld);let G=e.update(T),E=T.material;if(Array.isArray(E)){let B=G.groups;for(let D=0,q=B.length;D<q;D++){let z=B[D],Y=E[z.materialIndex];if(Y&&Y.visible){let ie=M(T,Y,b,v);T.onBeforeShadow(n,T,A,P,G,ie,z),n.renderBufferDirect(P,null,G,ie,T,z),T.onAfterShadow(n,T,A,P,G,ie,z)}}}else if(E.visible){let B=M(T,E,b,v);T.onBeforeShadow(n,T,A,P,G,B,null),n.renderBufferDirect(P,null,G,B,T,null),T.onAfterShadow(n,T,A,P,G,B,null)}}let V=T.children;for(let G=0,E=V.length;G<E;G++)y(V[G],A,P,b,v)}function C(T){T.target.removeEventListener("dispose",C);for(let P in l){let b=l[P],v=T.target.uuid;v in b&&(b[v].dispose(),delete b[v])}}}var q_={[yl]:vl,[bl]:wl,[Ml]:El,[Gs]:Sl,[vl]:yl,[wl]:bl,[El]:Ml,[Sl]:Gs};function Z_(n,e){function t(){let N=!1,he=new rt,$=null,Q=new rt(0,0,0,0);return{setMask:function(pe){$!==pe&&!N&&(n.colorMask(pe,pe,pe,pe),$=pe)},setLocked:function(pe){N=pe},setClear:function(pe,de,Oe,yt,Wt){Wt===!0&&(pe*=yt,de*=yt,Oe*=yt),he.set(pe,de,Oe,yt),Q.equals(he)===!1&&(n.clearColor(pe,de,Oe,yt),Q.copy(he))},reset:function(){N=!1,$=null,Q.set(-1,0,0,0)}}}function i(){let N=!1,he=!1,$=null,Q=null,pe=null;return{setReversed:function(de){if(he!==de){let Oe=e.get("EXT_clip_control");he?Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.ZERO_TO_ONE_EXT):Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.NEGATIVE_ONE_TO_ONE_EXT);let yt=pe;pe=null,this.setClear(yt)}he=de},getReversed:function(){return he},setTest:function(de){de?ee(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(de){$!==de&&!N&&(n.depthMask(de),$=de)},setFunc:function(de){if(he&&(de=q_[de]),Q!==de){switch(de){case yl:n.depthFunc(n.NEVER);break;case vl:n.depthFunc(n.ALWAYS);break;case bl:n.depthFunc(n.LESS);break;case Gs:n.depthFunc(n.LEQUAL);break;case Ml:n.depthFunc(n.EQUAL);break;case Sl:n.depthFunc(n.GEQUAL);break;case wl:n.depthFunc(n.GREATER);break;case El:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Q=de}},setLocked:function(de){N=de},setClear:function(de){pe!==de&&(he&&(de=1-de),n.clearDepth(de),pe=de)},reset:function(){N=!1,$=null,Q=null,pe=null,he=!1}}}function s(){let N=!1,he=null,$=null,Q=null,pe=null,de=null,Oe=null,yt=null,Wt=null;return{setTest:function(tt){N||(tt?ee(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(tt){he!==tt&&!N&&(n.stencilMask(tt),he=tt)},setFunc:function(tt,Ln,oi){($!==tt||Q!==Ln||pe!==oi)&&(n.stencilFunc(tt,Ln,oi),$=tt,Q=Ln,pe=oi)},setOp:function(tt,Ln,oi){(de!==tt||Oe!==Ln||yt!==oi)&&(n.stencilOp(tt,Ln,oi),de=tt,Oe=Ln,yt=oi)},setLocked:function(tt){N=tt},setClear:function(tt){Wt!==tt&&(n.clearStencil(tt),Wt=tt)},reset:function(){N=!1,he=null,$=null,Q=null,pe=null,de=null,Oe=null,yt=null,Wt=null}}}let r=new t,o=new i,a=new s,c=new WeakMap,l=new WeakMap,h={},u={},m=new WeakMap,p=[],g=null,_=!1,f=null,d=null,x=null,M=null,y=null,C=null,T=null,A=new Re(0,0,0),P=0,b=!1,v=null,L=null,V=null,G=null,E=null,B=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),D=!1,q=0,z=n.getParameter(n.VERSION);z.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(z)[1]),D=q>=1):z.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),D=q>=2);let Y=null,ie={},te=n.getParameter(n.SCISSOR_BOX),me=n.getParameter(n.VIEWPORT),ke=new rt().fromArray(te),U=new rt().fromArray(me);function Z(N,he,$,Q){let pe=new Uint8Array(4),de=n.createTexture();n.bindTexture(N,de),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Oe=0;Oe<$;Oe++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(he,0,n.RGBA,1,1,Q,0,n.RGBA,n.UNSIGNED_BYTE,pe):n.texImage2D(he+Oe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,pe);return de}let re={};re[n.TEXTURE_2D]=Z(n.TEXTURE_2D,n.TEXTURE_2D,1),re[n.TEXTURE_CUBE_MAP]=Z(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[n.TEXTURE_2D_ARRAY]=Z(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),re[n.TEXTURE_3D]=Z(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ee(n.DEPTH_TEST),o.setFunc(Gs),Xe(!1),Ye(kh),ee(n.CULL_FACE),O(Ni);function ee(N){h[N]!==!0&&(n.enable(N),h[N]=!0)}function we(N){h[N]!==!1&&(n.disable(N),h[N]=!1)}function Ee(N,he){return u[N]!==he?(n.bindFramebuffer(N,he),u[N]=he,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=he),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=he),!0):!1}function De(N,he){let $=p,Q=!1;if(N){$=m.get(he),$===void 0&&($=[],m.set(he,$));let pe=N.textures;if($.length!==pe.length||$[0]!==n.COLOR_ATTACHMENT0){for(let de=0,Oe=pe.length;de<Oe;de++)$[de]=n.COLOR_ATTACHMENT0+de;$.length=pe.length,Q=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,Q=!0);Q&&n.drawBuffers($)}function pt(N){return g!==N?(n.useProgram(N),g=N,!0):!1}let Ze={[es]:n.FUNC_ADD,[cf]:n.FUNC_SUBTRACT,[hf]:n.FUNC_REVERSE_SUBTRACT};Ze[uf]=n.MIN,Ze[df]=n.MAX;let St={[ff]:n.ZERO,[pf]:n.ONE,[mf]:n.SRC_COLOR,[_l]:n.SRC_ALPHA,[bf]:n.SRC_ALPHA_SATURATE,[yf]:n.DST_COLOR,[_f]:n.DST_ALPHA,[gf]:n.ONE_MINUS_SRC_COLOR,[xl]:n.ONE_MINUS_SRC_ALPHA,[vf]:n.ONE_MINUS_DST_COLOR,[xf]:n.ONE_MINUS_DST_ALPHA,[Mf]:n.CONSTANT_COLOR,[Sf]:n.ONE_MINUS_CONSTANT_COLOR,[wf]:n.CONSTANT_ALPHA,[Ef]:n.ONE_MINUS_CONSTANT_ALPHA};function O(N,he,$,Q,pe,de,Oe,yt,Wt,tt){if(N===Ni){_===!0&&(we(n.BLEND),_=!1);return}if(_===!1&&(ee(n.BLEND),_=!0),N!==lf){if(N!==f||tt!==b){if((d!==es||y!==es)&&(n.blendEquation(n.FUNC_ADD),d=es,y=es),tt)switch(N){case Bs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Oh:n.blendFunc(n.ONE,n.ONE);break;case Bh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case zh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Bs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Oh:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Bh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case zh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,M=null,C=null,T=null,A.set(0,0,0),P=0,f=N,b=tt}return}pe=pe||he,de=de||$,Oe=Oe||Q,(he!==d||pe!==y)&&(n.blendEquationSeparate(Ze[he],Ze[pe]),d=he,y=pe),($!==x||Q!==M||de!==C||Oe!==T)&&(n.blendFuncSeparate(St[$],St[Q],St[de],St[Oe]),x=$,M=Q,C=de,T=Oe),(yt.equals(A)===!1||Wt!==P)&&(n.blendColor(yt.r,yt.g,yt.b,Wt),A.copy(yt),P=Wt),f=N,b=!1}function wn(N,he){N.side===Ht?we(n.CULL_FACE):ee(n.CULL_FACE);let $=N.side===qt;he&&($=!$),Xe($),N.blending===Bs&&N.transparent===!1?O(Ni):O(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let Q=N.stencilWrite;a.setTest(Q),Q&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),mt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ee(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function Xe(N){v!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),v=N)}function Ye(N){N!==rf?(ee(n.CULL_FACE),N!==L&&(N===kh?n.cullFace(n.BACK):N===of?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),L=N}function Pe(N){N!==V&&(D&&n.lineWidth(N),V=N)}function mt(N,he,$){N?(ee(n.POLYGON_OFFSET_FILL),(G!==he||E!==$)&&(n.polygonOffset(he,$),G=he,E=$)):we(n.POLYGON_OFFSET_FILL)}function Ce(N){N?ee(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function R(N){N===void 0&&(N=n.TEXTURE0+B-1),Y!==N&&(n.activeTexture(N),Y=N)}function S(N,he,$){$===void 0&&(Y===null?$=n.TEXTURE0+B-1:$=Y);let Q=ie[$];Q===void 0&&(Q={type:void 0,texture:void 0},ie[$]=Q),(Q.type!==N||Q.texture!==he)&&(Y!==$&&(n.activeTexture($),Y=$),n.bindTexture(N,he||re[N]),Q.type=N,Q.texture=he)}function H(){let N=ie[Y];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function j(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ne(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function K(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Te(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ue(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ge(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function $e(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function oe(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function _e(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ie(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ue(N){ke.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),ke.copy(N))}function xe(N){U.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),U.copy(N))}function qe(N,he){let $=l.get(he);$===void 0&&($=new WeakMap,l.set(he,$));let Q=$.get(N);Q===void 0&&(Q=n.getUniformBlockIndex(he,N.name),$.set(N,Q))}function Ve(N,he){let Q=l.get(he).get(N);c.get(he)!==Q&&(n.uniformBlockBinding(he,Q,N.__bindingPointIndex),c.set(he,Q))}function dt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},Y=null,ie={},u={},m=new WeakMap,p=[],g=null,_=!1,f=null,d=null,x=null,M=null,y=null,C=null,T=null,A=new Re(0,0,0),P=0,b=!1,v=null,L=null,V=null,G=null,E=null,ke.set(0,0,n.canvas.width,n.canvas.height),U.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ee,disable:we,bindFramebuffer:Ee,drawBuffers:De,useProgram:pt,setBlending:O,setMaterial:wn,setFlipSided:Xe,setCullFace:Ye,setLineWidth:Pe,setPolygonOffset:mt,setScissorTest:Ce,activeTexture:R,bindTexture:S,unbindTexture:H,compressedTexImage2D:j,compressedTexImage3D:ne,texImage2D:_e,texImage3D:Ie,updateUBOMapping:qe,uniformBlockBinding:Ve,texStorage2D:$e,texStorage3D:oe,texSubImage2D:K,texSubImage3D:Te,compressedTexSubImage2D:ue,compressedTexSubImage3D:ge,scissor:Ue,viewport:xe,reset:dt}}function ku(n,e,t,i){let s=$_(i);switch(t){case Qu:return n*e;case td:return n*e;case nd:return n*e*2;case Oc:return n*e/s.components*s.byteLength;case Bc:return n*e/s.components*s.byteLength;case id:return n*e*2/s.components*s.byteLength;case zc:return n*e*2/s.components*s.byteLength;case ed:return n*e*3/s.components*s.byteLength;case kn:return n*e*4/s.components*s.byteLength;case Hc:return n*e*4/s.components*s.byteLength;case Bo:case zo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ho:case Vo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Pl:case Ll:return Math.max(n,16)*Math.max(e,8)/4;case Cl:case Il:return Math.max(n,8)*Math.max(e,8)/2;case Dl:case Ul:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Nl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case kl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ol:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Bl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case zl:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Hl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Vl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Gl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Wl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Xl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Yl:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ql:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Zl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case $l:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Go:case Jl:case Kl:return Math.ceil(n/4)*Math.ceil(e/4)*16;case sd:case jl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ql:case ec:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function $_(n){switch(n){case gi:case Ju:return{byteLength:1,components:1};case Ur:case Ku:case Wr:return{byteLength:2,components:1};case Fc:case kc:return{byteLength:2,components:4};case rs:case Nc:case Kn:return{byteLength:4,components:1};case ju:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function J_(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ye,h=new WeakMap,u,m=new WeakMap,p=!1;try{p=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,S){return p?new OffscreenCanvas(R,S):Yo("canvas")}function _(R,S,H){let j=1,ne=Ce(R);if((ne.width>H||ne.height>H)&&(j=H/Math.max(ne.width,ne.height)),j<1)if(typeof HTMLImageElement!="undefined"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&R instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&R instanceof ImageBitmap||typeof VideoFrame!="undefined"&&R instanceof VideoFrame){let K=Math.floor(j*ne.width),Te=Math.floor(j*ne.height);u===void 0&&(u=g(K,Te));let ue=S?g(K,Te):u;return ue.width=K,ue.height=Te,ue.getContext("2d").drawImage(R,0,0,K,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+K+"x"+Te+")."),ue}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),R;return R}function f(R){return R.generateMipmaps}function d(R){n.generateMipmap(R)}function x(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(R,S,H,j,ne=!1){if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let K=S;if(S===n.RED&&(H===n.FLOAT&&(K=n.R32F),H===n.HALF_FLOAT&&(K=n.R16F),H===n.UNSIGNED_BYTE&&(K=n.R8)),S===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(K=n.R8UI),H===n.UNSIGNED_SHORT&&(K=n.R16UI),H===n.UNSIGNED_INT&&(K=n.R32UI),H===n.BYTE&&(K=n.R8I),H===n.SHORT&&(K=n.R16I),H===n.INT&&(K=n.R32I)),S===n.RG&&(H===n.FLOAT&&(K=n.RG32F),H===n.HALF_FLOAT&&(K=n.RG16F),H===n.UNSIGNED_BYTE&&(K=n.RG8)),S===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(K=n.RG8UI),H===n.UNSIGNED_SHORT&&(K=n.RG16UI),H===n.UNSIGNED_INT&&(K=n.RG32UI),H===n.BYTE&&(K=n.RG8I),H===n.SHORT&&(K=n.RG16I),H===n.INT&&(K=n.RG32I)),S===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(K=n.RGB8UI),H===n.UNSIGNED_SHORT&&(K=n.RGB16UI),H===n.UNSIGNED_INT&&(K=n.RGB32UI),H===n.BYTE&&(K=n.RGB8I),H===n.SHORT&&(K=n.RGB16I),H===n.INT&&(K=n.RGB32I)),S===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(K=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(K=n.RGBA16UI),H===n.UNSIGNED_INT&&(K=n.RGBA32UI),H===n.BYTE&&(K=n.RGBA8I),H===n.SHORT&&(K=n.RGBA16I),H===n.INT&&(K=n.RGBA32I)),S===n.RGB&&H===n.UNSIGNED_INT_5_9_9_9_REV&&(K=n.RGB9_E5),S===n.RGBA){let Te=ne?pa:Je.getTransfer(j);H===n.FLOAT&&(K=n.RGBA32F),H===n.HALF_FLOAT&&(K=n.RGBA16F),H===n.UNSIGNED_BYTE&&(K=Te===st?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT_4_4_4_4&&(K=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(K=n.RGB5_A1)}return(K===n.R16F||K===n.R32F||K===n.RG16F||K===n.RG32F||K===n.RGBA16F||K===n.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function y(R,S){let H;return R?S===null||S===rs||S===Ys?H=n.DEPTH24_STENCIL8:S===Kn?H=n.DEPTH32F_STENCIL8:S===Ur&&(H=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===rs||S===Ys?H=n.DEPTH_COMPONENT24:S===Kn?H=n.DEPTH_COMPONENT32F:S===Ur&&(H=n.DEPTH_COMPONENT16),H}function C(R,S){return f(R)===!0||R.isFramebufferTexture&&R.minFilter!==bn&&R.minFilter!==Jn?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function T(R){let S=R.target;S.removeEventListener("dispose",T),P(S),S.isVideoTexture&&h.delete(S)}function A(R){let S=R.target;S.removeEventListener("dispose",A),v(S)}function P(R){let S=i.get(R);if(S.__webglInit===void 0)return;let H=R.source,j=m.get(H);if(j){let ne=j[S.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&b(R),Object.keys(j).length===0&&m.delete(H)}i.remove(R)}function b(R){let S=i.get(R);n.deleteTexture(S.__webglTexture);let H=R.source,j=m.get(H);delete j[S.__cacheKey],o.memory.textures--}function v(R){let S=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(S.__webglFramebuffer[j]))for(let ne=0;ne<S.__webglFramebuffer[j].length;ne++)n.deleteFramebuffer(S.__webglFramebuffer[j][ne]);else n.deleteFramebuffer(S.__webglFramebuffer[j]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[j])}else{if(Array.isArray(S.__webglFramebuffer))for(let j=0;j<S.__webglFramebuffer.length;j++)n.deleteFramebuffer(S.__webglFramebuffer[j]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let j=0;j<S.__webglColorRenderbuffer.length;j++)S.__webglColorRenderbuffer[j]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[j]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let H=R.textures;for(let j=0,ne=H.length;j<ne;j++){let K=i.get(H[j]);K.__webglTexture&&(n.deleteTexture(K.__webglTexture),o.memory.textures--),i.remove(H[j])}i.remove(R)}let L=0;function V(){L=0}function G(){let R=L;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),L+=1,R}function E(R){let S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function B(R,S){let H=i.get(R);if(R.isVideoTexture&&Pe(R),R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){let j=R.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{U(H,R,S);return}}t.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+S)}function D(R,S){let H=i.get(R);if(R.version>0&&H.__version!==R.version){U(H,R,S);return}t.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+S)}function q(R,S){let H=i.get(R);if(R.version>0&&H.__version!==R.version){U(H,R,S);return}t.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+S)}function z(R,S){let H=i.get(R);if(R.version>0&&H.__version!==R.version){Z(H,R,S);return}t.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+S)}let Y={[Dr]:n.REPEAT,[is]:n.CLAMP_TO_EDGE,[Rl]:n.MIRRORED_REPEAT},ie={[bn]:n.NEAREST,[Uf]:n.NEAREST_MIPMAP_NEAREST,[fo]:n.NEAREST_MIPMAP_LINEAR,[Jn]:n.LINEAR,[ka]:n.LINEAR_MIPMAP_NEAREST,[ss]:n.LINEAR_MIPMAP_LINEAR},te={[Of]:n.NEVER,[Wf]:n.ALWAYS,[Bf]:n.LESS,[od]:n.LEQUAL,[zf]:n.EQUAL,[Gf]:n.GEQUAL,[Hf]:n.GREATER,[Vf]:n.NOTEQUAL};function me(R,S){if(S.type===Kn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Jn||S.magFilter===ka||S.magFilter===fo||S.magFilter===ss||S.minFilter===Jn||S.minFilter===ka||S.minFilter===fo||S.minFilter===ss)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,Y[S.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,Y[S.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,Y[S.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,ie[S.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,ie[S.minFilter]),S.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,te[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===bn||S.minFilter!==fo&&S.minFilter!==ss||S.type===Kn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function ke(R,S){let H=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",T));let j=S.source,ne=m.get(j);ne===void 0&&(ne={},m.set(j,ne));let K=E(S);if(K!==R.__cacheKey){ne[K]===void 0&&(ne[K]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,H=!0),ne[K].usedTimes++;let Te=ne[R.__cacheKey];Te!==void 0&&(ne[R.__cacheKey].usedTimes--,Te.usedTimes===0&&b(S)),R.__cacheKey=K,R.__webglTexture=ne[K].texture}return H}function U(R,S,H){let j=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(j=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(j=n.TEXTURE_3D);let ne=ke(R,S),K=S.source;t.bindTexture(j,R.__webglTexture,n.TEXTURE0+H);let Te=i.get(K);if(K.version!==Te.__version||ne===!0){t.activeTexture(n.TEXTURE0+H);let ue=Je.getPrimaries(Je.workingColorSpace),ge=S.colorSpace===Ui?null:Je.getPrimaries(S.colorSpace),$e=S.colorSpace===Ui||ue===ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,$e);let oe=_(S.image,!1,s.maxTextureSize);oe=mt(S,oe);let _e=r.convert(S.format,S.colorSpace),Ie=r.convert(S.type),Ue=M(S.internalFormat,_e,Ie,S.colorSpace,S.isVideoTexture);me(j,S);let xe,qe=S.mipmaps,Ve=S.isVideoTexture!==!0,dt=Te.__version===void 0||ne===!0,N=K.dataReady,he=C(S,oe);if(S.isDepthTexture)Ue=y(S.format===qs,S.type),dt&&(Ve?t.texStorage2D(n.TEXTURE_2D,1,Ue,oe.width,oe.height):t.texImage2D(n.TEXTURE_2D,0,Ue,oe.width,oe.height,0,_e,Ie,null));else if(S.isDataTexture)if(qe.length>0){Ve&&dt&&t.texStorage2D(n.TEXTURE_2D,he,Ue,qe[0].width,qe[0].height);for(let $=0,Q=qe.length;$<Q;$++)xe=qe[$],Ve?N&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,xe.width,xe.height,_e,Ie,xe.data):t.texImage2D(n.TEXTURE_2D,$,Ue,xe.width,xe.height,0,_e,Ie,xe.data);S.generateMipmaps=!1}else Ve?(dt&&t.texStorage2D(n.TEXTURE_2D,he,Ue,oe.width,oe.height),N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,oe.width,oe.height,_e,Ie,oe.data)):t.texImage2D(n.TEXTURE_2D,0,Ue,oe.width,oe.height,0,_e,Ie,oe.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ve&&dt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,he,Ue,qe[0].width,qe[0].height,oe.depth);for(let $=0,Q=qe.length;$<Q;$++)if(xe=qe[$],S.format!==kn)if(_e!==null)if(Ve){if(N)if(S.layerUpdates.size>0){let pe=ku(xe.width,xe.height,S.format,S.type);for(let de of S.layerUpdates){let Oe=xe.data.subarray(de*pe/xe.data.BYTES_PER_ELEMENT,(de+1)*pe/xe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,de,xe.width,xe.height,1,_e,Oe)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,xe.width,xe.height,oe.depth,_e,xe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,Ue,xe.width,xe.height,oe.depth,0,xe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ve?N&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,xe.width,xe.height,oe.depth,_e,Ie,xe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,$,Ue,xe.width,xe.height,oe.depth,0,_e,Ie,xe.data)}else{Ve&&dt&&t.texStorage2D(n.TEXTURE_2D,he,Ue,qe[0].width,qe[0].height);for(let $=0,Q=qe.length;$<Q;$++)xe=qe[$],S.format!==kn?_e!==null?Ve?N&&t.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,xe.width,xe.height,_e,xe.data):t.compressedTexImage2D(n.TEXTURE_2D,$,Ue,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ve?N&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,xe.width,xe.height,_e,Ie,xe.data):t.texImage2D(n.TEXTURE_2D,$,Ue,xe.width,xe.height,0,_e,Ie,xe.data)}else if(S.isDataArrayTexture)if(Ve){if(dt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,he,Ue,oe.width,oe.height,oe.depth),N)if(S.layerUpdates.size>0){let $=ku(oe.width,oe.height,S.format,S.type);for(let Q of S.layerUpdates){let pe=oe.data.subarray(Q*$/oe.data.BYTES_PER_ELEMENT,(Q+1)*$/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Q,oe.width,oe.height,1,_e,Ie,pe)}S.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,_e,Ie,oe.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ue,oe.width,oe.height,oe.depth,0,_e,Ie,oe.data);else if(S.isData3DTexture)Ve?(dt&&t.texStorage3D(n.TEXTURE_3D,he,Ue,oe.width,oe.height,oe.depth),N&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,_e,Ie,oe.data)):t.texImage3D(n.TEXTURE_3D,0,Ue,oe.width,oe.height,oe.depth,0,_e,Ie,oe.data);else if(S.isFramebufferTexture){if(dt)if(Ve)t.texStorage2D(n.TEXTURE_2D,he,Ue,oe.width,oe.height);else{let $=oe.width,Q=oe.height;for(let pe=0;pe<he;pe++)t.texImage2D(n.TEXTURE_2D,pe,Ue,$,Q,0,_e,Ie,null),$>>=1,Q>>=1}}else if(qe.length>0){if(Ve&&dt){let $=Ce(qe[0]);t.texStorage2D(n.TEXTURE_2D,he,Ue,$.width,$.height)}for(let $=0,Q=qe.length;$<Q;$++)xe=qe[$],Ve?N&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,_e,Ie,xe):t.texImage2D(n.TEXTURE_2D,$,Ue,_e,Ie,xe);S.generateMipmaps=!1}else if(Ve){if(dt){let $=Ce(oe);t.texStorage2D(n.TEXTURE_2D,he,Ue,$.width,$.height)}N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,_e,Ie,oe)}else t.texImage2D(n.TEXTURE_2D,0,Ue,_e,Ie,oe);f(S)&&d(j),Te.__version=K.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function Z(R,S,H){if(S.image.length!==6)return;let j=ke(R,S),ne=S.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+H);let K=i.get(ne);if(ne.version!==K.__version||j===!0){t.activeTexture(n.TEXTURE0+H);let Te=Je.getPrimaries(Je.workingColorSpace),ue=S.colorSpace===Ui?null:Je.getPrimaries(S.colorSpace),ge=S.colorSpace===Ui||Te===ue?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);let $e=S.isCompressedTexture||S.image[0].isCompressedTexture,oe=S.image[0]&&S.image[0].isDataTexture,_e=[];for(let Q=0;Q<6;Q++)!$e&&!oe?_e[Q]=_(S.image[Q],!0,s.maxCubemapSize):_e[Q]=oe?S.image[Q].image:S.image[Q],_e[Q]=mt(S,_e[Q]);let Ie=_e[0],Ue=r.convert(S.format,S.colorSpace),xe=r.convert(S.type),qe=M(S.internalFormat,Ue,xe,S.colorSpace),Ve=S.isVideoTexture!==!0,dt=K.__version===void 0||j===!0,N=ne.dataReady,he=C(S,Ie);me(n.TEXTURE_CUBE_MAP,S);let $;if($e){Ve&&dt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,he,qe,Ie.width,Ie.height);for(let Q=0;Q<6;Q++){$=_e[Q].mipmaps;for(let pe=0;pe<$.length;pe++){let de=$[pe];S.format!==kn?Ue!==null?Ve?N&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,0,0,de.width,de.height,Ue,de.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,qe,de.width,de.height,0,de.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ve?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,0,0,de.width,de.height,Ue,xe,de.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,qe,de.width,de.height,0,Ue,xe,de.data)}}}else{if($=S.mipmaps,Ve&&dt){$.length>0&&he++;let Q=Ce(_e[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,he,qe,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(oe){Ve?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,_e[Q].width,_e[Q].height,Ue,xe,_e[Q].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,qe,_e[Q].width,_e[Q].height,0,Ue,xe,_e[Q].data);for(let pe=0;pe<$.length;pe++){let Oe=$[pe].image[Q].image;Ve?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,0,0,Oe.width,Oe.height,Ue,xe,Oe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,qe,Oe.width,Oe.height,0,Ue,xe,Oe.data)}}else{Ve?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ue,xe,_e[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,qe,Ue,xe,_e[Q]);for(let pe=0;pe<$.length;pe++){let de=$[pe];Ve?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,0,0,Ue,xe,de.image[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,qe,Ue,xe,de.image[Q])}}}f(S)&&d(n.TEXTURE_CUBE_MAP),K.__version=ne.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function re(R,S,H,j,ne,K){let Te=r.convert(H.format,H.colorSpace),ue=r.convert(H.type),ge=M(H.internalFormat,Te,ue,H.colorSpace),$e=i.get(S),oe=i.get(H);if(oe.__renderTarget=S,!$e.__hasExternalTextures){let _e=Math.max(1,S.width>>K),Ie=Math.max(1,S.height>>K);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,K,ge,_e,Ie,S.depth,0,Te,ue,null):t.texImage2D(ne,K,ge,_e,Ie,0,Te,ue,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),Ye(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,ne,oe.__webglTexture,0,Xe(S)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,j,ne,oe.__webglTexture,K),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ee(R,S,H){if(n.bindRenderbuffer(n.RENDERBUFFER,R),S.depthBuffer){let j=S.depthTexture,ne=j&&j.isDepthTexture?j.type:null,K=y(S.stencilBuffer,ne),Te=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ue=Xe(S);Ye(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ue,K,S.width,S.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,ue,K,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,K,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Te,n.RENDERBUFFER,R)}else{let j=S.textures;for(let ne=0;ne<j.length;ne++){let K=j[ne],Te=r.convert(K.format,K.colorSpace),ue=r.convert(K.type),ge=M(K.internalFormat,Te,ue,K.colorSpace),$e=Xe(S);H&&Ye(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,$e,ge,S.width,S.height):Ye(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,$e,ge,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,ge,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function we(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let j=i.get(S.depthTexture);j.__renderTarget=S,(!j.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),B(S.depthTexture,0);let ne=j.__webglTexture,K=Xe(S);if(S.depthTexture.format===zs)Ye(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ne,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ne,0);else if(S.depthTexture.format===qs)Ye(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ne,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function Ee(R){let S=i.get(R),H=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){let j=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),j){let ne=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,j.removeEventListener("dispose",ne)};j.addEventListener("dispose",ne),S.__depthDisposeCallback=ne}S.__boundDepthTexture=j}if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");we(S.__webglFramebuffer,R)}else if(H){S.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[j]),S.__webglDepthbuffer[j]===void 0)S.__webglDepthbuffer[j]=n.createRenderbuffer(),ee(S.__webglDepthbuffer[j],R,!1);else{let ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=S.__webglDepthbuffer[j];n.bindRenderbuffer(n.RENDERBUFFER,K),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,K)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),ee(S.__webglDepthbuffer,R,!1);else{let j=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,ne)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(R,S,H){let j=i.get(R);S!==void 0&&re(j.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&Ee(R)}function pt(R){let S=R.texture,H=i.get(R),j=i.get(S);R.addEventListener("dispose",A);let ne=R.textures,K=R.isWebGLCubeRenderTarget===!0,Te=ne.length>1;if(Te||(j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture()),j.__version=S.version,o.memory.textures++),K){H.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer[ue]=[];for(let ge=0;ge<S.mipmaps.length;ge++)H.__webglFramebuffer[ue][ge]=n.createFramebuffer()}else H.__webglFramebuffer[ue]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer=[];for(let ue=0;ue<S.mipmaps.length;ue++)H.__webglFramebuffer[ue]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(Te)for(let ue=0,ge=ne.length;ue<ge;ue++){let $e=i.get(ne[ue]);$e.__webglTexture===void 0&&($e.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&Ye(R)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ue=0;ue<ne.length;ue++){let ge=ne[ue];H.__webglColorRenderbuffer[ue]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[ue]);let $e=r.convert(ge.format,ge.colorSpace),oe=r.convert(ge.type),_e=M(ge.internalFormat,$e,oe,ge.colorSpace,R.isXRRenderTarget===!0),Ie=Xe(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ie,_e,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,H.__webglColorRenderbuffer[ue])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),ee(H.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(K){t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),me(n.TEXTURE_CUBE_MAP,S);for(let ue=0;ue<6;ue++)if(S.mipmaps&&S.mipmaps.length>0)for(let ge=0;ge<S.mipmaps.length;ge++)re(H.__webglFramebuffer[ue][ge],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ge);else re(H.__webglFramebuffer[ue],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);f(S)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let ue=0,ge=ne.length;ue<ge;ue++){let $e=ne[ue],oe=i.get($e);t.bindTexture(n.TEXTURE_2D,oe.__webglTexture),me(n.TEXTURE_2D,$e),re(H.__webglFramebuffer,R,$e,n.COLOR_ATTACHMENT0+ue,n.TEXTURE_2D,0),f($e)&&d(n.TEXTURE_2D)}t.unbindTexture()}else{let ue=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ue=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ue,j.__webglTexture),me(ue,S),S.mipmaps&&S.mipmaps.length>0)for(let ge=0;ge<S.mipmaps.length;ge++)re(H.__webglFramebuffer[ge],R,S,n.COLOR_ATTACHMENT0,ue,ge);else re(H.__webglFramebuffer,R,S,n.COLOR_ATTACHMENT0,ue,0);f(S)&&d(ue),t.unbindTexture()}R.depthBuffer&&Ee(R)}function Ze(R){let S=R.textures;for(let H=0,j=S.length;H<j;H++){let ne=S[H];if(f(ne)){let K=x(R),Te=i.get(ne).__webglTexture;t.bindTexture(K,Te),d(K),t.unbindTexture()}}}let St=[],O=[];function wn(R){if(R.samples>0){if(Ye(R)===!1){let S=R.textures,H=R.width,j=R.height,ne=n.COLOR_BUFFER_BIT,K=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Te=i.get(R),ue=S.length>1;if(ue)for(let ge=0;ge<S.length;ge++)t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let ge=0;ge<S.length;ge++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),ue){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Te.__webglColorRenderbuffer[ge]);let $e=i.get(S[ge]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,$e,0)}n.blitFramebuffer(0,0,H,j,0,0,H,j,ne,n.NEAREST),c===!0&&(St.length=0,O.length=0,St.push(n.COLOR_ATTACHMENT0+ge),R.depthBuffer&&R.resolveDepthBuffer===!1&&(St.push(K),O.push(K),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,O)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,St))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ue)for(let ge=0;ge<S.length;ge++){t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,Te.__webglColorRenderbuffer[ge]);let $e=i.get(S[ge]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,$e,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let S=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function Xe(R){return Math.min(s.maxSamples,R.samples)}function Ye(R){let S=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Pe(R){let S=o.render.frame;h.get(R)!==S&&(h.set(R,S),R.update())}function mt(R,S){let H=R.colorSpace,j=R.format,ne=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||H!==Qs&&H!==Ui&&(Je.getTransfer(H)===st?(j!==kn||ne!==gi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),S}function Ce(R){return typeof HTMLImageElement!="undefined"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame!="undefined"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=G,this.resetTextureUnits=V,this.setTexture2D=B,this.setTexture2DArray=D,this.setTexture3D=q,this.setTextureCube=z,this.rebindTextures=De,this.setupRenderTarget=pt,this.updateRenderTargetMipmap=Ze,this.updateMultisampleRenderTarget=wn,this.setupDepthRenderbuffer=Ee,this.setupFrameBufferTexture=re,this.useMultisampledRTT=Ye}function K_(n,e){function t(i,s=Ui){let r,o=Je.getTransfer(s);if(i===gi)return n.UNSIGNED_BYTE;if(i===Fc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===kc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ju)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ju)return n.BYTE;if(i===Ku)return n.SHORT;if(i===Ur)return n.UNSIGNED_SHORT;if(i===Nc)return n.INT;if(i===rs)return n.UNSIGNED_INT;if(i===Kn)return n.FLOAT;if(i===Wr)return n.HALF_FLOAT;if(i===Qu)return n.ALPHA;if(i===ed)return n.RGB;if(i===kn)return n.RGBA;if(i===td)return n.LUMINANCE;if(i===nd)return n.LUMINANCE_ALPHA;if(i===zs)return n.DEPTH_COMPONENT;if(i===qs)return n.DEPTH_STENCIL;if(i===Oc)return n.RED;if(i===Bc)return n.RED_INTEGER;if(i===id)return n.RG;if(i===zc)return n.RG_INTEGER;if(i===Hc)return n.RGBA_INTEGER;if(i===Bo||i===zo||i===Ho||i===Vo)if(o===st)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Bo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ho)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Vo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Bo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===zo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ho)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Vo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Cl||i===Pl||i===Il||i===Ll)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Cl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Pl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Il)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ll)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Dl||i===Ul||i===Nl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Dl||i===Ul)return o===st?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Nl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Fl||i===kl||i===Ol||i===Bl||i===zl||i===Hl||i===Vl||i===Gl||i===Wl||i===Xl||i===Yl||i===ql||i===Zl||i===$l)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Fl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===kl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ol)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Bl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===zl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Hl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Vl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Gl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Wl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Xl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Yl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ql)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Zl)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===$l)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Go||i===Jl||i===Kl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Go)return o===st?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Jl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Kl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===sd||i===jl||i===Ql||i===ec)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Go)return r.COMPRESSED_RED_RGTC1_EXT;if(i===jl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ql)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ec)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ys?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var mc=class extends zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},vt=class extends Zt{constructor(){super(),this.isGroup=!0,this.type="Group"}},j_={type:"move"},Lr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let _ of e.hand.values()){let f=t.getJointPose(_,i),d=this._getHandJoint(l,_);f!==null&&(d.matrix.fromArray(f.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=f.radius),d.visible=f!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],m=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&m>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&m<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(j_)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new vt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},Q_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ex=`
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

}`,gc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){let s=new rn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Qn({vertexShader:Q_,fragmentShader:ex,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Le(new xi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},_c=class extends _i{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,m=null,p=null,g=null,_=new gc,f=t.getContextAttributes(),d=null,x=null,M=[],y=[],C=new ye,T=null,A=new zt;A.viewport=new rt;let P=new zt;P.viewport=new rt;let b=[A,P],v=new mc,L=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let Z=M[U];return Z===void 0&&(Z=new Lr,M[U]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(U){let Z=M[U];return Z===void 0&&(Z=new Lr,M[U]=Z),Z.getGripSpace()},this.getHand=function(U){let Z=M[U];return Z===void 0&&(Z=new Lr,M[U]=Z),Z.getHandSpace()};function G(U){let Z=y.indexOf(U.inputSource);if(Z===-1)return;let re=M[Z];re!==void 0&&(re.update(U.inputSource,U.frame,l||o),re.dispatchEvent({type:U.type,data:U.inputSource}))}function E(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",E),s.removeEventListener("inputsourceschange",B);for(let U=0;U<M.length;U++){let Z=y[U];Z!==null&&(y[U]=null,M[U].disconnect(Z))}L=null,V=null,_.reset(),e.setRenderTarget(d),p=null,m=null,u=null,s=null,x=null,ke.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){r=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){a=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(U){l=U},this.getBaseLayer=function(){return m!==null?m:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(U){if(s=U,s!==null){if(d=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",E),s.addEventListener("inputsourceschange",B),f.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(C),s.renderState.layers===void 0){let Z={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,Z),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new On(p.framebufferWidth,p.framebufferHeight,{format:kn,type:gi,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil})}else{let Z=null,re=null,ee=null;f.depth&&(ee=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=f.stencil?qs:zs,re=f.stencil?Ys:rs);let we={colorFormat:t.RGBA8,depthFormat:ee,scaleFactor:r};u=new XRWebGLBinding(s,t),m=u.createProjectionLayer(we),s.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),x=new On(m.textureWidth,m.textureHeight,{format:kn,type:gi,depthTexture:new ea(m.textureWidth,m.textureHeight,re,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),ke.setContext(s),ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function B(U){for(let Z=0;Z<U.removed.length;Z++){let re=U.removed[Z],ee=y.indexOf(re);ee>=0&&(y[ee]=null,M[ee].disconnect(re))}for(let Z=0;Z<U.added.length;Z++){let re=U.added[Z],ee=y.indexOf(re);if(ee===-1){for(let Ee=0;Ee<M.length;Ee++)if(Ee>=y.length){y.push(re),ee=Ee;break}else if(y[Ee]===null){y[Ee]=re,ee=Ee;break}if(ee===-1)break}let we=M[ee];we&&we.connect(re)}}let D=new I,q=new I;function z(U,Z,re){D.setFromMatrixPosition(Z.matrixWorld),q.setFromMatrixPosition(re.matrixWorld);let ee=D.distanceTo(q),we=Z.projectionMatrix.elements,Ee=re.projectionMatrix.elements,De=we[14]/(we[10]-1),pt=we[14]/(we[10]+1),Ze=(we[9]+1)/we[5],St=(we[9]-1)/we[5],O=(we[8]-1)/we[0],wn=(Ee[8]+1)/Ee[0],Xe=De*O,Ye=De*wn,Pe=ee/(-O+wn),mt=Pe*-O;if(Z.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(mt),U.translateZ(Pe),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert(),we[10]===-1)U.projectionMatrix.copy(Z.projectionMatrix),U.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{let Ce=De+Pe,R=pt+Pe,S=Xe-mt,H=Ye+(ee-mt),j=Ze*pt/R*Ce,ne=St*pt/R*Ce;U.projectionMatrix.makePerspective(S,H,j,ne,Ce,R),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}}function Y(U,Z){Z===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(Z.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(s===null)return;let Z=U.near,re=U.far;_.texture!==null&&(_.depthNear>0&&(Z=_.depthNear),_.depthFar>0&&(re=_.depthFar)),v.near=P.near=A.near=Z,v.far=P.far=A.far=re,(L!==v.near||V!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),L=v.near,V=v.far),A.layers.mask=U.layers.mask|2,P.layers.mask=U.layers.mask|4,v.layers.mask=A.layers.mask|P.layers.mask;let ee=U.parent,we=v.cameras;Y(v,ee);for(let Ee=0;Ee<we.length;Ee++)Y(we[Ee],ee);we.length===2?z(v,A,P):v.projectionMatrix.copy(A.projectionMatrix),ie(U,v,ee)};function ie(U,Z,re){re===null?U.matrix.copy(Z.matrixWorld):(U.matrix.copy(re.matrixWorld),U.matrix.invert(),U.matrix.multiply(Z.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(Z.projectionMatrix),U.projectionMatrixInverse.copy(Z.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=Nr*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(m===null&&p===null))return c},this.setFoveation=function(U){c=U,m!==null&&(m.fixedFoveation=U),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=U)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(v)};let te=null;function me(U,Z){if(h=Z.getViewerPose(l||o),g=Z,h!==null){let re=h.views;p!==null&&(e.setRenderTargetFramebuffer(x,p.framebuffer),e.setRenderTarget(x));let ee=!1;re.length!==v.cameras.length&&(v.cameras.length=0,ee=!0);for(let Ee=0;Ee<re.length;Ee++){let De=re[Ee],pt=null;if(p!==null)pt=p.getViewport(De);else{let St=u.getViewSubImage(m,De);pt=St.viewport,Ee===0&&(e.setRenderTargetTextures(x,St.colorTexture,m.ignoreDepthValues?void 0:St.depthStencilTexture),e.setRenderTarget(x))}let Ze=b[Ee];Ze===void 0&&(Ze=new zt,Ze.layers.enable(Ee),Ze.viewport=new rt,b[Ee]=Ze),Ze.matrix.fromArray(De.transform.matrix),Ze.matrix.decompose(Ze.position,Ze.quaternion,Ze.scale),Ze.projectionMatrix.fromArray(De.projectionMatrix),Ze.projectionMatrixInverse.copy(Ze.projectionMatrix).invert(),Ze.viewport.set(pt.x,pt.y,pt.width,pt.height),Ee===0&&(v.matrix.copy(Ze.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),ee===!0&&v.cameras.push(Ze)}let we=s.enabledFeatures;if(we&&we.includes("depth-sensing")){let Ee=u.getDepthInformation(re[0]);Ee&&Ee.isValid&&Ee.texture&&_.init(e,Ee,s.renderState)}}for(let re=0;re<M.length;re++){let ee=y[re],we=M[re];ee!==null&&we!==void 0&&we.update(ee,Z,l||o)}te&&te(U,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),g=null}let ke=new hd;ke.setAnimationLoop(me),this.setAnimationLoop=function(U){te=U},this.dispose=function(){}}},ji=new An,tx=new We;function nx(n,e){function t(f,d){f.matrixAutoUpdate===!0&&f.updateMatrix(),d.value.copy(f.matrix)}function i(f,d){d.color.getRGB(f.fogColor.value,cd(n)),d.isFog?(f.fogNear.value=d.near,f.fogFar.value=d.far):d.isFogExp2&&(f.fogDensity.value=d.density)}function s(f,d,x,M,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(f,d):d.isMeshToonMaterial?(r(f,d),u(f,d)):d.isMeshPhongMaterial?(r(f,d),h(f,d)):d.isMeshStandardMaterial?(r(f,d),m(f,d),d.isMeshPhysicalMaterial&&p(f,d,y)):d.isMeshMatcapMaterial?(r(f,d),g(f,d)):d.isMeshDepthMaterial?r(f,d):d.isMeshDistanceMaterial?(r(f,d),_(f,d)):d.isMeshNormalMaterial?r(f,d):d.isLineBasicMaterial?(o(f,d),d.isLineDashedMaterial&&a(f,d)):d.isPointsMaterial?c(f,d,x,M):d.isSpriteMaterial?l(f,d):d.isShadowMaterial?(f.color.value.copy(d.color),f.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(f,d){f.opacity.value=d.opacity,d.color&&f.diffuse.value.copy(d.color),d.emissive&&f.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(f.map.value=d.map,t(d.map,f.mapTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.bumpMap&&(f.bumpMap.value=d.bumpMap,t(d.bumpMap,f.bumpMapTransform),f.bumpScale.value=d.bumpScale,d.side===qt&&(f.bumpScale.value*=-1)),d.normalMap&&(f.normalMap.value=d.normalMap,t(d.normalMap,f.normalMapTransform),f.normalScale.value.copy(d.normalScale),d.side===qt&&f.normalScale.value.negate()),d.displacementMap&&(f.displacementMap.value=d.displacementMap,t(d.displacementMap,f.displacementMapTransform),f.displacementScale.value=d.displacementScale,f.displacementBias.value=d.displacementBias),d.emissiveMap&&(f.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,f.emissiveMapTransform)),d.specularMap&&(f.specularMap.value=d.specularMap,t(d.specularMap,f.specularMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest);let x=e.get(d),M=x.envMap,y=x.envMapRotation;M&&(f.envMap.value=M,ji.copy(y),ji.x*=-1,ji.y*=-1,ji.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ji.y*=-1,ji.z*=-1),f.envMapRotation.value.setFromMatrix4(tx.makeRotationFromEuler(ji)),f.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=d.reflectivity,f.ior.value=d.ior,f.refractionRatio.value=d.refractionRatio),d.lightMap&&(f.lightMap.value=d.lightMap,f.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,f.lightMapTransform)),d.aoMap&&(f.aoMap.value=d.aoMap,f.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,f.aoMapTransform))}function o(f,d){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,d.map&&(f.map.value=d.map,t(d.map,f.mapTransform))}function a(f,d){f.dashSize.value=d.dashSize,f.totalSize.value=d.dashSize+d.gapSize,f.scale.value=d.scale}function c(f,d,x,M){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,f.size.value=d.size*x,f.scale.value=M*.5,d.map&&(f.map.value=d.map,t(d.map,f.uvTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest)}function l(f,d){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,f.rotation.value=d.rotation,d.map&&(f.map.value=d.map,t(d.map,f.mapTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest)}function h(f,d){f.specular.value.copy(d.specular),f.shininess.value=Math.max(d.shininess,1e-4)}function u(f,d){d.gradientMap&&(f.gradientMap.value=d.gradientMap)}function m(f,d){f.metalness.value=d.metalness,d.metalnessMap&&(f.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,f.metalnessMapTransform)),f.roughness.value=d.roughness,d.roughnessMap&&(f.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,f.roughnessMapTransform)),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)}function p(f,d,x){f.ior.value=d.ior,d.sheen>0&&(f.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),f.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(f.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,f.sheenColorMapTransform)),d.sheenRoughnessMap&&(f.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,f.sheenRoughnessMapTransform))),d.clearcoat>0&&(f.clearcoat.value=d.clearcoat,f.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(f.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,f.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(f.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===qt&&f.clearcoatNormalScale.value.negate())),d.dispersion>0&&(f.dispersion.value=d.dispersion),d.iridescence>0&&(f.iridescence.value=d.iridescence,f.iridescenceIOR.value=d.iridescenceIOR,f.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(f.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,f.iridescenceMapTransform)),d.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),d.transmission>0&&(f.transmission.value=d.transmission,f.transmissionSamplerMap.value=x.texture,f.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(f.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,f.transmissionMapTransform)),f.thickness.value=d.thickness,d.thicknessMap&&(f.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=d.attenuationDistance,f.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(f.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(f.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=d.specularIntensity,f.specularColor.value.copy(d.specularColor),d.specularColorMap&&(f.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,f.specularColorMapTransform)),d.specularIntensityMap&&(f.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,d){d.matcap&&(f.matcap.value=d.matcap)}function _(f,d){let x=e.get(d).light;f.referencePosition.value.setFromMatrixPosition(x.matrixWorld),f.nearDistance.value=x.shadow.camera.near,f.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function ix(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,M){let y=M.program;i.uniformBlockBinding(x,y)}function l(x,M){let y=s[x.id];y===void 0&&(g(x),y=h(x),s[x.id]=y,x.addEventListener("dispose",f));let C=M.program;i.updateUBOMapping(x,C);let T=e.render.frame;r[x.id]!==T&&(m(x),r[x.id]=T)}function h(x){let M=u();x.__bindingPointIndex=M;let y=n.createBuffer(),C=x.__size,T=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,C,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,y),y}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(x){let M=s[x.id],y=x.uniforms,C=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let T=0,A=y.length;T<A;T++){let P=Array.isArray(y[T])?y[T]:[y[T]];for(let b=0,v=P.length;b<v;b++){let L=P[b];if(p(L,T,b,C)===!0){let V=L.__offset,G=Array.isArray(L.value)?L.value:[L.value],E=0;for(let B=0;B<G.length;B++){let D=G[B],q=_(D);typeof D=="number"||typeof D=="boolean"?(L.__data[0]=D,n.bufferSubData(n.UNIFORM_BUFFER,V+E,L.__data)):D.isMatrix3?(L.__data[0]=D.elements[0],L.__data[1]=D.elements[1],L.__data[2]=D.elements[2],L.__data[3]=0,L.__data[4]=D.elements[3],L.__data[5]=D.elements[4],L.__data[6]=D.elements[5],L.__data[7]=0,L.__data[8]=D.elements[6],L.__data[9]=D.elements[7],L.__data[10]=D.elements[8],L.__data[11]=0):(D.toArray(L.__data,E),E+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,V,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(x,M,y,C){let T=x.value,A=M+"_"+y;if(C[A]===void 0)return typeof T=="number"||typeof T=="boolean"?C[A]=T:C[A]=T.clone(),!0;{let P=C[A];if(typeof T=="number"||typeof T=="boolean"){if(P!==T)return C[A]=T,!0}else if(P.equals(T)===!1)return P.copy(T),!0}return!1}function g(x){let M=x.uniforms,y=0,C=16;for(let A=0,P=M.length;A<P;A++){let b=Array.isArray(M[A])?M[A]:[M[A]];for(let v=0,L=b.length;v<L;v++){let V=b[v],G=Array.isArray(V.value)?V.value:[V.value];for(let E=0,B=G.length;E<B;E++){let D=G[E],q=_(D),z=y%C,Y=z%q.boundary,ie=z+Y;y+=Y,ie!==0&&C-ie<q.storage&&(y+=C-ie),V.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=y,y+=q.storage}}}let T=y%C;return T>0&&(y+=C-T),x.__size=y,x.__cache={},this}function _(x){let M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=48,M.storage=48):x.isMatrix4?(M.boundary=64,M.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),M}function f(x){let M=x.target;M.removeEventListener("dispose",f);let y=o.indexOf(M.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function d(){for(let x in s)n.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:c,update:l,dispose:d}}var ta=class{constructor(e={}){let{canvas:t=ap(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:m=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext!="undefined"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),_=new Int32Array(4),f=null,d=null,x=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ft,this.toneMapping=jn,this.toneMappingExposure=1;let y=this,C=!1,T=0,A=0,P=null,b=-1,v=null,L=new rt,V=new rt,G=null,E=new Re(0),B=0,D=t.width,q=t.height,z=1,Y=null,ie=null,te=new rt(0,0,D,q),me=new rt(0,0,D,q),ke=!1,U=new kr,Z=!1,re=!1,ee=new We,we=new We,Ee=new I,De=new rt,pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ze=!1;function St(){return P===null?z:1}let O=i;function wn(w,F){return t.getContext(w,F)}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",Q,!1),t.addEventListener("webglcontextrestored",pe,!1),t.addEventListener("webglcontextcreationerror",de,!1),O===null){let F="webgl2";if(O=wn(F,w),O===null)throw wn(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Xe,Ye,Pe,mt,Ce,R,S,H,j,ne,K,Te,ue,ge,$e,oe,_e,Ie,Ue,xe,qe,Ve,dt,N;function he(){Xe=new yg(O),Xe.init(),Ve=new K_(O,Xe),Ye=new fg(O,Xe,e,Ve),Pe=new Z_(O,Xe),Ye.reverseDepthBuffer&&m&&Pe.buffers.depth.setReversed(!0),mt=new Mg(O),Ce=new N_,R=new J_(O,Xe,Pe,Ce,Ye,Ve,mt),S=new mg(y),H=new xg(y),j=new Cp(O),dt=new ug(O,j),ne=new vg(O,j,mt,dt),K=new wg(O,ne,j,mt),Ue=new Sg(O,Ye,R),oe=new pg(Ce),Te=new U_(y,S,H,Xe,Ye,dt,oe),ue=new nx(y,Ce),ge=new k_,$e=new G_(Xe),Ie=new hg(y,S,H,Pe,K,p,c),_e=new Y_(y,K,Ye),N=new ix(O,mt,Ye,Pe),xe=new dg(O,Xe,mt),qe=new bg(O,Xe,mt),mt.programs=Te.programs,y.capabilities=Ye,y.extensions=Xe,y.properties=Ce,y.renderLists=ge,y.shadowMap=_e,y.state=Pe,y.info=mt}he();let $=new _c(y,O);this.xr=$,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let w=Xe.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=Xe.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(w){w!==void 0&&(z=w,this.setSize(D,q,!1))},this.getSize=function(w){return w.set(D,q)},this.setSize=function(w,F,W=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=w,q=F,t.width=Math.floor(w*z),t.height=Math.floor(F*z),W===!0&&(t.style.width=w+"px",t.style.height=F+"px"),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(D*z,q*z).floor()},this.setDrawingBufferSize=function(w,F,W){D=w,q=F,z=W,t.width=Math.floor(w*W),t.height=Math.floor(F*W),this.setViewport(0,0,w,F)},this.getCurrentViewport=function(w){return w.copy(L)},this.getViewport=function(w){return w.copy(te)},this.setViewport=function(w,F,W,X){w.isVector4?te.set(w.x,w.y,w.z,w.w):te.set(w,F,W,X),Pe.viewport(L.copy(te).multiplyScalar(z).round())},this.getScissor=function(w){return w.copy(me)},this.setScissor=function(w,F,W,X){w.isVector4?me.set(w.x,w.y,w.z,w.w):me.set(w,F,W,X),Pe.scissor(V.copy(me).multiplyScalar(z).round())},this.getScissorTest=function(){return ke},this.setScissorTest=function(w){Pe.setScissorTest(ke=w)},this.setOpaqueSort=function(w){Y=w},this.setTransparentSort=function(w){ie=w},this.getClearColor=function(w){return w.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor.apply(Ie,arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha.apply(Ie,arguments)},this.clear=function(w=!0,F=!0,W=!0){let X=0;if(w){let k=!1;if(P!==null){let ae=P.texture.format;k=ae===Hc||ae===zc||ae===Bc}if(k){let ae=P.texture.type,fe=ae===gi||ae===rs||ae===Ur||ae===Ys||ae===Fc||ae===kc,be=Ie.getClearColor(),Me=Ie.getClearAlpha(),Ne=be.r,Be=be.g,Se=be.b;fe?(g[0]=Ne,g[1]=Be,g[2]=Se,g[3]=Me,O.clearBufferuiv(O.COLOR,0,g)):(_[0]=Ne,_[1]=Be,_[2]=Se,_[3]=Me,O.clearBufferiv(O.COLOR,0,_))}else X|=O.COLOR_BUFFER_BIT}F&&(X|=O.DEPTH_BUFFER_BIT),W&&(X|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Q,!1),t.removeEventListener("webglcontextrestored",pe,!1),t.removeEventListener("webglcontextcreationerror",de,!1),ge.dispose(),$e.dispose(),Ce.dispose(),S.dispose(),H.dispose(),K.dispose(),dt.dispose(),N.dispose(),Te.dispose(),$.dispose(),$.removeEventListener("sessionstart",Ch),$.removeEventListener("sessionend",Ph),Yi.stop()};function Q(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function pe(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let w=mt.autoReset,F=_e.enabled,W=_e.autoUpdate,X=_e.needsUpdate,k=_e.type;he(),mt.autoReset=w,_e.enabled=F,_e.autoUpdate=W,_e.needsUpdate=X,_e.type=k}function de(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Oe(w){let F=w.target;F.removeEventListener("dispose",Oe),yt(F)}function yt(w){Wt(w),Ce.remove(w)}function Wt(w){let F=Ce.get(w).programs;F!==void 0&&(F.forEach(function(W){Te.releaseProgram(W)}),w.isShaderMaterial&&Te.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,W,X,k,ae){F===null&&(F=pt);let fe=k.isMesh&&k.matrixWorld.determinant()<0,be=tf(w,F,W,X,k);Pe.setMaterial(X,fe);let Me=W.index,Ne=1;if(X.wireframe===!0){if(Me=ne.getWireframeAttribute(W),Me===void 0)return;Ne=2}let Be=W.drawRange,Se=W.attributes.position,Ke=Be.start*Ne,ft=(Be.start+Be.count)*Ne;ae!==null&&(Ke=Math.max(Ke,ae.start*Ne),ft=Math.min(ft,(ae.start+ae.count)*Ne)),Me!==null?(Ke=Math.max(Ke,0),ft=Math.min(ft,Me.count)):Se!=null&&(Ke=Math.max(Ke,0),ft=Math.min(ft,Se.count));let gt=ft-Ke;if(gt<0||gt===1/0)return;dt.setup(k,X,be,W,Me);let sn,Qe=xe;if(Me!==null&&(sn=j.get(Me),Qe=qe,Qe.setIndex(sn)),k.isMesh)X.wireframe===!0?(Pe.setLineWidth(X.wireframeLinewidth*St()),Qe.setMode(O.LINES)):Qe.setMode(O.TRIANGLES);else if(k.isLine){let Ae=X.linewidth;Ae===void 0&&(Ae=1),Pe.setLineWidth(Ae*St()),k.isLineSegments?Qe.setMode(O.LINES):k.isLineLoop?Qe.setMode(O.LINE_LOOP):Qe.setMode(O.LINE_STRIP)}else k.isPoints?Qe.setMode(O.POINTS):k.isSprite&&Qe.setMode(O.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Qe.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Xe.get("WEBGL_multi_draw"))Qe.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{let Ae=k._multiDrawStarts,ai=k._multiDrawCounts,et=k._multiDrawCount,Dn=Me?j.get(Me).bytesPerElement:1,bs=Ce.get(X).currentProgram.getUniforms();for(let _n=0;_n<et;_n++)bs.setValue(O,"_gl_DrawID",_n),Qe.render(Ae[_n]/Dn,ai[_n])}else if(k.isInstancedMesh)Qe.renderInstances(Ke,gt,k.count);else if(W.isInstancedBufferGeometry){let Ae=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ai=Math.min(W.instanceCount,Ae);Qe.renderInstances(Ke,gt,ai)}else Qe.render(Ke,gt)};function tt(w,F,W){w.transparent===!0&&w.side===Ht&&w.forceSinglePass===!1?(w.side=qt,w.needsUpdate=!0,uo(w,F,W),w.side=Fi,w.needsUpdate=!0,uo(w,F,W),w.side=Ht):uo(w,F,W)}this.compile=function(w,F,W=null){W===null&&(W=w),d=$e.get(W),d.init(F),M.push(d),W.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(d.pushLight(k),k.castShadow&&d.pushShadow(k))}),w!==W&&w.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(d.pushLight(k),k.castShadow&&d.pushShadow(k))}),d.setupLights();let X=new Set;return w.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;let ae=k.material;if(ae)if(Array.isArray(ae))for(let fe=0;fe<ae.length;fe++){let be=ae[fe];tt(be,W,k),X.add(be)}else tt(ae,W,k),X.add(ae)}),M.pop(),d=null,X},this.compileAsync=function(w,F,W=null){let X=this.compile(w,F,W);return new Promise(k=>{function ae(){if(X.forEach(function(fe){Ce.get(fe).currentProgram.isReady()&&X.delete(fe)}),X.size===0){k(w);return}setTimeout(ae,10)}Xe.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let Ln=null;function oi(w){Ln&&Ln(w)}function Ch(){Yi.stop()}function Ph(){Yi.start()}let Yi=new hd;Yi.setAnimationLoop(oi),typeof self!="undefined"&&Yi.setContext(self),this.setAnimationLoop=function(w){Ln=w,$.setAnimationLoop(w),w===null?Yi.stop():Yi.start()},$.addEventListener("sessionstart",Ch),$.addEventListener("sessionend",Ph),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(F),F=$.getCamera()),w.isScene===!0&&w.onBeforeRender(y,w,F,P),d=$e.get(w,M.length),d.init(F),M.push(d),we.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),U.setFromProjectionMatrix(we),re=this.localClippingEnabled,Z=oe.init(this.clippingPlanes,re),f=ge.get(w,x.length),f.init(),x.push(f),$.enabled===!0&&$.isPresenting===!0){let ae=y.xr.getDepthSensingMesh();ae!==null&&Fa(ae,F,-1/0,y.sortObjects)}Fa(w,F,0,y.sortObjects),f.finish(),y.sortObjects===!0&&f.sort(Y,ie),Ze=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,Ze&&Ie.addToRenderList(f,w),this.info.render.frame++,Z===!0&&oe.beginShadows();let W=d.state.shadowsArray;_e.render(W,w,F),Z===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=f.opaque,k=f.transmissive;if(d.setupLights(),F.isArrayCamera){let ae=F.cameras;if(k.length>0)for(let fe=0,be=ae.length;fe<be;fe++){let Me=ae[fe];Lh(X,k,w,Me)}Ze&&Ie.render(w);for(let fe=0,be=ae.length;fe<be;fe++){let Me=ae[fe];Ih(f,w,Me,Me.viewport)}}else k.length>0&&Lh(X,k,w,F),Ze&&Ie.render(w),Ih(f,w,F);P!==null&&(R.updateMultisampleRenderTarget(P),R.updateRenderTargetMipmap(P)),w.isScene===!0&&w.onAfterRender(y,w,F),dt.resetDefaultState(),b=-1,v=null,M.pop(),M.length>0?(d=M[M.length-1],Z===!0&&oe.setGlobalState(y.clippingPlanes,d.state.camera)):d=null,x.pop(),x.length>0?f=x[x.length-1]:f=null};function Fa(w,F,W,X){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)W=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLight)d.pushLight(w),w.castShadow&&d.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||U.intersectsSprite(w)){X&&De.setFromMatrixPosition(w.matrixWorld).applyMatrix4(we);let fe=K.update(w),be=w.material;be.visible&&f.push(w,fe,be,W,De.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||U.intersectsObject(w))){let fe=K.update(w),be=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),De.copy(w.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),De.copy(fe.boundingSphere.center)),De.applyMatrix4(w.matrixWorld).applyMatrix4(we)),Array.isArray(be)){let Me=fe.groups;for(let Ne=0,Be=Me.length;Ne<Be;Ne++){let Se=Me[Ne],Ke=be[Se.materialIndex];Ke&&Ke.visible&&f.push(w,fe,Ke,W,De.z,Se)}}else be.visible&&f.push(w,fe,be,W,De.z,null)}}let ae=w.children;for(let fe=0,be=ae.length;fe<be;fe++)Fa(ae[fe],F,W,X)}function Ih(w,F,W,X){let k=w.opaque,ae=w.transmissive,fe=w.transparent;d.setupLightsView(W),Z===!0&&oe.setGlobalState(y.clippingPlanes,W),X&&Pe.viewport(L.copy(X)),k.length>0&&ho(k,F,W),ae.length>0&&ho(ae,F,W),fe.length>0&&ho(fe,F,W),Pe.buffers.depth.setTest(!0),Pe.buffers.depth.setMask(!0),Pe.buffers.color.setMask(!0),Pe.setPolygonOffset(!1)}function Lh(w,F,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[X.id]===void 0&&(d.state.transmissionRenderTarget[X.id]=new On(1,1,{generateMipmaps:!0,type:Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float")?Wr:gi,minFilter:ss,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));let ae=d.state.transmissionRenderTarget[X.id],fe=X.viewport||L;ae.setSize(fe.z,fe.w);let be=y.getRenderTarget();y.setRenderTarget(ae),y.getClearColor(E),B=y.getClearAlpha(),B<1&&y.setClearColor(16777215,.5),y.clear(),Ze&&Ie.render(W);let Me=y.toneMapping;y.toneMapping=jn;let Ne=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),d.setupLightsView(X),Z===!0&&oe.setGlobalState(y.clippingPlanes,X),ho(w,W,X),R.updateMultisampleRenderTarget(ae),R.updateRenderTargetMipmap(ae),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let Se=0,Ke=F.length;Se<Ke;Se++){let ft=F[Se],gt=ft.object,sn=ft.geometry,Qe=ft.material,Ae=ft.group;if(Qe.side===Ht&&gt.layers.test(X.layers)){let ai=Qe.side;Qe.side=qt,Qe.needsUpdate=!0,Dh(gt,W,X,sn,Qe,Ae),Qe.side=ai,Qe.needsUpdate=!0,Be=!0}}Be===!0&&(R.updateMultisampleRenderTarget(ae),R.updateRenderTargetMipmap(ae))}y.setRenderTarget(be),y.setClearColor(E,B),Ne!==void 0&&(X.viewport=Ne),y.toneMapping=Me}function ho(w,F,W){let X=F.isScene===!0?F.overrideMaterial:null;for(let k=0,ae=w.length;k<ae;k++){let fe=w[k],be=fe.object,Me=fe.geometry,Ne=X===null?fe.material:X,Be=fe.group;be.layers.test(W.layers)&&Dh(be,F,W,Me,Ne,Be)}}function Dh(w,F,W,X,k,ae){w.onBeforeRender(y,F,W,X,k,ae),w.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),k.onBeforeRender(y,F,W,X,w,ae),k.transparent===!0&&k.side===Ht&&k.forceSinglePass===!1?(k.side=qt,k.needsUpdate=!0,y.renderBufferDirect(W,F,X,k,w,ae),k.side=Fi,k.needsUpdate=!0,y.renderBufferDirect(W,F,X,k,w,ae),k.side=Ht):y.renderBufferDirect(W,F,X,k,w,ae),w.onAfterRender(y,F,W,X,k,ae)}function uo(w,F,W){F.isScene!==!0&&(F=pt);let X=Ce.get(w),k=d.state.lights,ae=d.state.shadowsArray,fe=k.state.version,be=Te.getParameters(w,k.state,ae,F,W),Me=Te.getProgramCacheKey(be),Ne=X.programs;X.environment=w.isMeshStandardMaterial?F.environment:null,X.fog=F.fog,X.envMap=(w.isMeshStandardMaterial?H:S).get(w.envMap||X.environment),X.envMapRotation=X.environment!==null&&w.envMap===null?F.environmentRotation:w.envMapRotation,Ne===void 0&&(w.addEventListener("dispose",Oe),Ne=new Map,X.programs=Ne);let Be=Ne.get(Me);if(Be!==void 0){if(X.currentProgram===Be&&X.lightsStateVersion===fe)return Nh(w,be),Be}else be.uniforms=Te.getUniforms(w),w.onBeforeCompile(be,y),Be=Te.acquireProgram(be,Me),Ne.set(Me,Be),X.uniforms=be.uniforms;let Se=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Se.clippingPlanes=oe.uniform),Nh(w,be),X.needsLights=sf(w),X.lightsStateVersion=fe,X.needsLights&&(Se.ambientLightColor.value=k.state.ambient,Se.lightProbe.value=k.state.probe,Se.directionalLights.value=k.state.directional,Se.directionalLightShadows.value=k.state.directionalShadow,Se.spotLights.value=k.state.spot,Se.spotLightShadows.value=k.state.spotShadow,Se.rectAreaLights.value=k.state.rectArea,Se.ltc_1.value=k.state.rectAreaLTC1,Se.ltc_2.value=k.state.rectAreaLTC2,Se.pointLights.value=k.state.point,Se.pointLightShadows.value=k.state.pointShadow,Se.hemisphereLights.value=k.state.hemi,Se.directionalShadowMap.value=k.state.directionalShadowMap,Se.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Se.spotShadowMap.value=k.state.spotShadowMap,Se.spotLightMatrix.value=k.state.spotLightMatrix,Se.spotLightMap.value=k.state.spotLightMap,Se.pointShadowMap.value=k.state.pointShadowMap,Se.pointShadowMatrix.value=k.state.pointShadowMatrix),X.currentProgram=Be,X.uniformsList=null,Be}function Uh(w){if(w.uniformsList===null){let F=w.currentProgram.getUniforms();w.uniformsList=Vs.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function Nh(w,F){let W=Ce.get(w);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.batchingColor=F.batchingColor,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.instancingMorph=F.instancingMorph,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}function tf(w,F,W,X,k){F.isScene!==!0&&(F=pt),R.resetTextureUnits();let ae=F.fog,fe=X.isMeshStandardMaterial?F.environment:null,be=P===null?y.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Qs,Me=(X.isMeshStandardMaterial?H:S).get(X.envMap||fe),Ne=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Be=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Se=!!W.morphAttributes.position,Ke=!!W.morphAttributes.normal,ft=!!W.morphAttributes.color,gt=jn;X.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(gt=y.toneMapping);let sn=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Qe=sn!==void 0?sn.length:0,Ae=Ce.get(X),ai=d.state.lights;if(Z===!0&&(re===!0||w!==v)){let En=w===v&&X.id===b;oe.setState(X,w,En)}let et=!1;X.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==ai.state.version||Ae.outputColorSpace!==be||k.isBatchedMesh&&Ae.batching===!1||!k.isBatchedMesh&&Ae.batching===!0||k.isBatchedMesh&&Ae.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Ae.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Ae.instancing===!1||!k.isInstancedMesh&&Ae.instancing===!0||k.isSkinnedMesh&&Ae.skinning===!1||!k.isSkinnedMesh&&Ae.skinning===!0||k.isInstancedMesh&&Ae.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Ae.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Ae.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Ae.instancingMorph===!1&&k.morphTexture!==null||Ae.envMap!==Me||X.fog===!0&&Ae.fog!==ae||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==oe.numPlanes||Ae.numIntersection!==oe.numIntersection)||Ae.vertexAlphas!==Ne||Ae.vertexTangents!==Be||Ae.morphTargets!==Se||Ae.morphNormals!==Ke||Ae.morphColors!==ft||Ae.toneMapping!==gt||Ae.morphTargetsCount!==Qe)&&(et=!0):(et=!0,Ae.__version=X.version);let Dn=Ae.currentProgram;et===!0&&(Dn=uo(X,F,k));let bs=!1,_n=!1,xr=!1,_t=Dn.getUniforms(),Zn=Ae.uniforms;if(Pe.useProgram(Dn.program)&&(bs=!0,_n=!0,xr=!0),X.id!==b&&(b=X.id,_n=!0),bs||v!==w){Pe.buffers.depth.getReversed()?(ee.copy(w.projectionMatrix),cp(ee),hp(ee),_t.setValue(O,"projectionMatrix",ee)):_t.setValue(O,"projectionMatrix",w.projectionMatrix),_t.setValue(O,"viewMatrix",w.matrixWorldInverse);let Ti=_t.map.cameraPosition;Ti!==void 0&&Ti.setValue(O,Ee.setFromMatrixPosition(w.matrixWorld)),Ye.logarithmicDepthBuffer&&_t.setValue(O,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&_t.setValue(O,"isOrthographic",w.isOrthographicCamera===!0),v!==w&&(v=w,_n=!0,xr=!0)}if(k.isSkinnedMesh){_t.setOptional(O,k,"bindMatrix"),_t.setOptional(O,k,"bindMatrixInverse");let En=k.skeleton;En&&(En.boneTexture===null&&En.computeBoneTexture(),_t.setValue(O,"boneTexture",En.boneTexture,R))}k.isBatchedMesh&&(_t.setOptional(O,k,"batchingTexture"),_t.setValue(O,"batchingTexture",k._matricesTexture,R),_t.setOptional(O,k,"batchingIdTexture"),_t.setValue(O,"batchingIdTexture",k._indirectTexture,R),_t.setOptional(O,k,"batchingColorTexture"),k._colorsTexture!==null&&_t.setValue(O,"batchingColorTexture",k._colorsTexture,R));let yr=W.morphAttributes;if((yr.position!==void 0||yr.normal!==void 0||yr.color!==void 0)&&Ue.update(k,W,Dn),(_n||Ae.receiveShadow!==k.receiveShadow)&&(Ae.receiveShadow=k.receiveShadow,_t.setValue(O,"receiveShadow",k.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Zn.envMap.value=Me,Zn.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&F.environment!==null&&(Zn.envMapIntensity.value=F.environmentIntensity),_n&&(_t.setValue(O,"toneMappingExposure",y.toneMappingExposure),Ae.needsLights&&nf(Zn,xr),ae&&X.fog===!0&&ue.refreshFogUniforms(Zn,ae),ue.refreshMaterialUniforms(Zn,X,z,q,d.state.transmissionRenderTarget[w.id]),Vs.upload(O,Uh(Ae),Zn,R)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Vs.upload(O,Uh(Ae),Zn,R),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&_t.setValue(O,"center",k.center),_t.setValue(O,"modelViewMatrix",k.modelViewMatrix),_t.setValue(O,"normalMatrix",k.normalMatrix),_t.setValue(O,"modelMatrix",k.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let En=X.uniformsGroups;for(let Ti=0,Ai=En.length;Ti<Ai;Ti++){let Fh=En[Ti];N.update(Fh,Dn),N.bind(Fh,Dn)}}return Dn}function nf(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function sf(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(w,F,W){Ce.get(w.texture).__webglTexture=F,Ce.get(w.depthTexture).__webglTexture=W;let X=Ce.get(w);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||Xe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,F){let W=Ce.get(w);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(w,F=0,W=0){P=w,T=F,A=W;let X=!0,k=null,ae=!1,fe=!1;if(w){let Me=Ce.get(w);if(Me.__useDefaultFramebuffer!==void 0)Pe.bindFramebuffer(O.FRAMEBUFFER,null),X=!1;else if(Me.__webglFramebuffer===void 0)R.setupRenderTarget(w);else if(Me.__hasExternalTextures)R.rebindTextures(w,Ce.get(w.texture).__webglTexture,Ce.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Se=w.depthTexture;if(Me.__boundDepthTexture!==Se){if(Se!==null&&Ce.has(Se)&&(w.width!==Se.image.width||w.height!==Se.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(w)}}let Ne=w.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(fe=!0);let Be=Ce.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Be[F])?k=Be[F][W]:k=Be[F],ae=!0):w.samples>0&&R.useMultisampledRTT(w)===!1?k=Ce.get(w).__webglMultisampledFramebuffer:Array.isArray(Be)?k=Be[W]:k=Be,L.copy(w.viewport),V.copy(w.scissor),G=w.scissorTest}else L.copy(te).multiplyScalar(z).floor(),V.copy(me).multiplyScalar(z).floor(),G=ke;if(Pe.bindFramebuffer(O.FRAMEBUFFER,k)&&X&&Pe.drawBuffers(w,k),Pe.viewport(L),Pe.scissor(V),Pe.setScissorTest(G),ae){let Me=Ce.get(w.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+F,Me.__webglTexture,W)}else if(fe){let Me=Ce.get(w.texture),Ne=F||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Me.__webglTexture,W||0,Ne)}b=-1},this.readRenderTargetPixels=function(w,F,W,X,k,ae,fe){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=Ce.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&fe!==void 0&&(be=be[fe]),be){Pe.bindFramebuffer(O.FRAMEBUFFER,be);try{let Me=w.texture,Ne=Me.format,Be=Me.type;if(!Ye.textureFormatReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ye.textureTypeReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-X&&W>=0&&W<=w.height-k&&O.readPixels(F,W,X,k,Ve.convert(Ne),Ve.convert(Be),ae)}finally{let Me=P!==null?Ce.get(P).__webglFramebuffer:null;Pe.bindFramebuffer(O.FRAMEBUFFER,Me)}}},this.readRenderTargetPixelsAsync=async function(w,F,W,X,k,ae,fe){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=Ce.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&fe!==void 0&&(be=be[fe]),be){let Me=w.texture,Ne=Me.format,Be=Me.type;if(!Ye.textureFormatReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ye.textureTypeReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=w.width-X&&W>=0&&W<=w.height-k){Pe.bindFramebuffer(O.FRAMEBUFFER,be);let Se=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Se),O.bufferData(O.PIXEL_PACK_BUFFER,ae.byteLength,O.STREAM_READ),O.readPixels(F,W,X,k,Ve.convert(Ne),Ve.convert(Be),0);let Ke=P!==null?Ce.get(P).__webglFramebuffer:null;Pe.bindFramebuffer(O.FRAMEBUFFER,Ke);let ft=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await lp(O,ft,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Se),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,ae),O.deleteBuffer(Se),O.deleteSync(ft),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,F=null,W=0){w.isTexture!==!0&&(Rr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,w=arguments[1]);let X=Math.pow(2,-W),k=Math.floor(w.image.width*X),ae=Math.floor(w.image.height*X),fe=F!==null?F.x:0,be=F!==null?F.y:0;R.setTexture2D(w,0),O.copyTexSubImage2D(O.TEXTURE_2D,W,0,0,fe,be,k,ae),Pe.unbindTexture()},this.copyTextureToTexture=function(w,F,W=null,X=null,k=0){w.isTexture!==!0&&(Rr("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,w=arguments[1],F=arguments[2],k=arguments[3]||0,W=null);let ae,fe,be,Me,Ne,Be,Se,Ke,ft,gt=w.isCompressedTexture?w.mipmaps[k]:w.image;W!==null?(ae=W.max.x-W.min.x,fe=W.max.y-W.min.y,be=W.isBox3?W.max.z-W.min.z:1,Me=W.min.x,Ne=W.min.y,Be=W.isBox3?W.min.z:0):(ae=gt.width,fe=gt.height,be=gt.depth||1,Me=0,Ne=0,Be=0),X!==null?(Se=X.x,Ke=X.y,ft=X.z):(Se=0,Ke=0,ft=0);let sn=Ve.convert(F.format),Qe=Ve.convert(F.type),Ae;F.isData3DTexture?(R.setTexture3D(F,0),Ae=O.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(R.setTexture2DArray(F,0),Ae=O.TEXTURE_2D_ARRAY):(R.setTexture2D(F,0),Ae=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,F.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,F.unpackAlignment);let ai=O.getParameter(O.UNPACK_ROW_LENGTH),et=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Dn=O.getParameter(O.UNPACK_SKIP_PIXELS),bs=O.getParameter(O.UNPACK_SKIP_ROWS),_n=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,gt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,gt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Me),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ne),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Be);let xr=w.isDataArrayTexture||w.isData3DTexture,_t=F.isDataArrayTexture||F.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){let Zn=Ce.get(w),yr=Ce.get(F),En=Ce.get(Zn.__renderTarget),Ti=Ce.get(yr.__renderTarget);Pe.bindFramebuffer(O.READ_FRAMEBUFFER,En.__webglFramebuffer),Pe.bindFramebuffer(O.DRAW_FRAMEBUFFER,Ti.__webglFramebuffer);for(let Ai=0;Ai<be;Ai++)xr&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ce.get(w).__webglTexture,k,Be+Ai),w.isDepthTexture?(_t&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ce.get(F).__webglTexture,k,ft+Ai),O.blitFramebuffer(Me,Ne,ae,fe,Se,Ke,ae,fe,O.DEPTH_BUFFER_BIT,O.NEAREST)):_t?O.copyTexSubImage3D(Ae,k,Se,Ke,ft+Ai,Me,Ne,ae,fe):O.copyTexSubImage2D(Ae,k,Se,Ke,ft+Ai,Me,Ne,ae,fe);Pe.bindFramebuffer(O.READ_FRAMEBUFFER,null),Pe.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else _t?w.isDataTexture||w.isData3DTexture?O.texSubImage3D(Ae,k,Se,Ke,ft,ae,fe,be,sn,Qe,gt.data):F.isCompressedArrayTexture?O.compressedTexSubImage3D(Ae,k,Se,Ke,ft,ae,fe,be,sn,gt.data):O.texSubImage3D(Ae,k,Se,Ke,ft,ae,fe,be,sn,Qe,gt):w.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,k,Se,Ke,ae,fe,sn,Qe,gt.data):w.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,k,Se,Ke,gt.width,gt.height,sn,gt.data):O.texSubImage2D(O.TEXTURE_2D,k,Se,Ke,ae,fe,sn,Qe,gt);O.pixelStorei(O.UNPACK_ROW_LENGTH,ai),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,et),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Dn),O.pixelStorei(O.UNPACK_SKIP_ROWS,bs),O.pixelStorei(O.UNPACK_SKIP_IMAGES,_n),k===0&&F.generateMipmaps&&O.generateMipmap(Ae),Pe.unbindTexture()},this.copyTextureToTexture3D=function(w,F,W=null,X=null,k=0){return w.isTexture!==!0&&(Rr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,w=arguments[2],F=arguments[3],k=arguments[4]||0),Rr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,F,W,X,k)},this.initRenderTarget=function(w){Ce.get(w).__webglFramebuffer===void 0&&R.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?R.setTextureCube(w,0):w.isData3DTexture?R.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?R.setTexture2DArray(w,0):R.setTexture2D(w,0),Pe.unbindTexture()},this.resetState=function(){T=0,A=0,P=null,Pe.reset(),dt.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};var Js=class extends Zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new An,this.environmentIntensity=1,this.environmentRotation=new An,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var xc=class extends rn{constructor(e=null,t=1,i=1,s,r,o,a,c,l=bn,h=bn,u,m){super(null,o,a,c,l,h,s,r,u,m),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Or=class extends wt{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Fs=new We,Ou=new We,Uo=[],Bu=new Mn,sx=new We,wr=new Le,Er=new ki,Br=class extends Le{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Or(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,sx)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Mn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Fs),Bu.copy(e.boundingBox).applyMatrix4(Fs),this.boundingBox.union(Bu)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ki),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Fs),Er.copy(e.boundingSphere).applyMatrix4(Fs),this.boundingSphere.union(Er)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(wr.geometry=this.geometry,wr.material=this.material,wr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Er.copy(this.boundingSphere),Er.applyMatrix4(i),e.ray.intersectsSphere(Er)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Fs),Ou.multiplyMatrices(i,Fs),wr.matrixWorld=Ou,wr.raycast(e,Uo);for(let o=0,a=Uo.length;o<a;o++){let c=Uo[o];c.instanceId=r,c.object=this,t.push(c)}Uo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Or(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new xc(new Float32Array(s*this.count),s,this.count,Oc,Kn));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<i.length;l++)o+=i[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;r[c]=a,r.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var zr=class extends Oi{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Re(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},na=new I,ia=new I,zu=new We,Tr=new os,No=new ki,ul=new I,Hu=new I,sa=class extends Zt{constructor(e=new bt,t=new zr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)na.fromBufferAttribute(t,s-1),ia.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=na.distanceTo(ia);e.setAttribute("lineDistance",new je(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),No.copy(i.boundingSphere),No.applyMatrix4(s),No.radius+=r,e.ray.intersectsSphere(No)===!1)return;zu.copy(s).invert(),Tr.copy(e.ray).applyMatrix4(zu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=i.index,m=i.attributes.position;if(h!==null){let p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=p,f=g-1;_<f;_+=l){let d=h.getX(_),x=h.getX(_+1),M=Fo(this,e,Tr,c,d,x);M&&t.push(M)}if(this.isLineLoop){let _=h.getX(g-1),f=h.getX(p),d=Fo(this,e,Tr,c,_,f);d&&t.push(d)}}else{let p=Math.max(0,o.start),g=Math.min(m.count,o.start+o.count);for(let _=p,f=g-1;_<f;_+=l){let d=Fo(this,e,Tr,c,_,_+1);d&&t.push(d)}if(this.isLineLoop){let _=Fo(this,e,Tr,c,g-1,p);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Fo(n,e,t,i,s,r){let o=n.geometry.attributes.position;if(na.fromBufferAttribute(o,s),ia.fromBufferAttribute(o,r),t.distanceSqToSegment(na,ia,ul,Hu)>i)return;ul.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(ul);if(!(c<e.near||c>e.far))return{distance:c,point:Hu.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}var ei=class extends rn{constructor(e,t,i,s,r,o,a,c,l){super(e,t,i,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},yc=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=i[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(r-1);let h=i[s],m=i[s+1]-h,p=(o-h)/m;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new ye:new I);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new I,s=[],r=[],o=[],a=new I,c=new We;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new I)}r[0]=new I,o[0]=new I;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),m=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),m<=l&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Pt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Pt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}};function Wc(){let n=0,e=0,t=0,i=0;function s(r,o,a,c){n=r,e=a,t=-3*r+3*o-2*a-c,i=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let m=(o-r)/l-(a-r)/(l+h)+(a-o)/h,p=(a-o)/h-(c-o)/(h+u)+(c-a)/u;m*=h,p*=h,s(o,a,m,p)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var ko=new I,dl=new Wc,fl=new Wc,pl=new Wc,Bi=class extends yc{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new I){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(ko.subVectors(s[0],s[1]).add(s[0]),l=ko);let u=s[a%r],m=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(ko.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=ko),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(m),p),f=Math.pow(m.distanceToSquared(h),p);_<1e-4&&(_=1),g<1e-4&&(g=_),f<1e-4&&(f=_),dl.initNonuniformCatmullRom(l.x,u.x,m.x,h.x,g,_,f),fl.initNonuniformCatmullRom(l.y,u.y,m.y,h.y,g,_,f),pl.initNonuniformCatmullRom(l.z,u.z,m.z,h.z,g,_,f)}else this.curveType==="catmullrom"&&(dl.initCatmullRom(l.x,u.x,m.x,h.x,this.tension),fl.initCatmullRom(l.y,u.y,m.y,h.y,this.tension),pl.initCatmullRom(l.z,u.z,m.z,h.z,this.tension));return i.set(dl.calc(c),fl.calc(c),pl.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};var ra=class n extends bt{constructor(e=[new ye(0,-.5),new ye(.5,0),new ye(0,.5)],t=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:s},t=Math.floor(t),s=Pt(s,0,Math.PI*2);let r=[],o=[],a=[],c=[],l=[],h=1/t,u=new I,m=new ye,p=new I,g=new I,_=new I,f=0,d=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:f=e[x+1].x-e[x].x,d=e[x+1].y-e[x].y,p.x=d*1,p.y=-f,p.z=d*0,_.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(_.x,_.y,_.z);break;default:f=e[x+1].x-e[x].x,d=e[x+1].y-e[x].y,p.x=d*1,p.y=-f,p.z=d*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),c.push(p.x,p.y,p.z),_.copy(g)}for(let x=0;x<=t;x++){let M=i+x*h*s,y=Math.sin(M),C=Math.cos(M);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*y,u.y=e[T].y,u.z=e[T].x*C,o.push(u.x,u.y,u.z),m.x=x/t,m.y=T/(e.length-1),a.push(m.x,m.y);let A=c[3*T+0]*y,P=c[3*T+1],b=c[3*T+0]*C;l.push(A,P,b)}}for(let x=0;x<t;x++)for(let M=0;M<e.length-1;M++){let y=M+x*e.length,C=y,T=y+e.length,A=y+e.length+1,P=y+1;r.push(C,T,P),r.push(A,P,T)}this.setIndex(r),this.setAttribute("position",new je(o,3)),this.setAttribute("uv",new je(a,2)),this.setAttribute("normal",new je(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.points,e.segments,e.phiStart,e.phiLength)}};var Ks=class n extends bt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],c=[],l=new I,h=new ye;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,m=3;u<=t;u++,m+=3){let p=i+u/t*s;l.x=e*Math.cos(p),l.y=e*Math.sin(p),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[m]/e+1)/2,h.y=(o[m+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new je(o,3)),this.setAttribute("normal",new je(a,3)),this.setAttribute("uv",new je(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.segments,e.thetaStart,e.thetaLength)}},zn=class n extends bt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],m=[],p=[],g=0,_=[],f=i/2,d=0;x(),o===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new je(u,3)),this.setAttribute("normal",new je(m,3)),this.setAttribute("uv",new je(p,2));function x(){let y=new I,C=new I,T=0,A=(t-e)/i;for(let P=0;P<=r;P++){let b=[],v=P/r,L=v*(t-e)+e;for(let V=0;V<=s;V++){let G=V/s,E=G*c+a,B=Math.sin(E),D=Math.cos(E);C.x=L*B,C.y=-v*i+f,C.z=L*D,u.push(C.x,C.y,C.z),y.set(B,A,D).normalize(),m.push(y.x,y.y,y.z),p.push(G,1-v),b.push(g++)}_.push(b)}for(let P=0;P<s;P++)for(let b=0;b<r;b++){let v=_[b][P],L=_[b+1][P],V=_[b+1][P+1],G=_[b][P+1];(e>0||b!==0)&&(h.push(v,L,G),T+=3),(t>0||b!==r-1)&&(h.push(L,V,G),T+=3)}l.addGroup(d,T,0),d+=T}function M(y){let C=g,T=new ye,A=new I,P=0,b=y===!0?e:t,v=y===!0?1:-1;for(let V=1;V<=s;V++)u.push(0,f*v,0),m.push(0,v,0),p.push(.5,.5),g++;let L=g;for(let V=0;V<=s;V++){let E=V/s*c+a,B=Math.cos(E),D=Math.sin(E);A.x=b*D,A.y=f*v,A.z=b*B,u.push(A.x,A.y,A.z),m.push(0,v,0),T.x=B*.5+.5,T.y=D*.5*v+.5,p.push(T.x,T.y),g++}for(let V=0;V<s;V++){let G=C+V,E=L+V;y===!0?h.push(E,E+1,G):h.push(E+1,E,G),P+=3}l.addGroup(d,P,y===!0?1:2),d+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},yi=class n extends zn{constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},vc=class n extends bt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),l(i),h(),this.setAttribute("position",new je(r,3)),this.setAttribute("normal",new je(r.slice(),3)),this.setAttribute("uv",new je(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let M=new I,y=new I,C=new I;for(let T=0;T<t.length;T+=3)p(t[T+0],M),p(t[T+1],y),p(t[T+2],C),c(M,y,C,x)}function c(x,M,y,C){let T=C+1,A=[];for(let P=0;P<=T;P++){A[P]=[];let b=x.clone().lerp(y,P/T),v=M.clone().lerp(y,P/T),L=T-P;for(let V=0;V<=L;V++)V===0&&P===T?A[P][V]=b:A[P][V]=b.clone().lerp(v,V/L)}for(let P=0;P<T;P++)for(let b=0;b<2*(T-P)-1;b++){let v=Math.floor(b/2);b%2===0?(m(A[P][v+1]),m(A[P+1][v]),m(A[P][v])):(m(A[P][v+1]),m(A[P+1][v+1]),m(A[P+1][v]))}}function l(x){let M=new I;for(let y=0;y<r.length;y+=3)M.x=r[y+0],M.y=r[y+1],M.z=r[y+2],M.normalize().multiplyScalar(x),r[y+0]=M.x,r[y+1]=M.y,r[y+2]=M.z}function h(){let x=new I;for(let M=0;M<r.length;M+=3){x.x=r[M+0],x.y=r[M+1],x.z=r[M+2];let y=f(x)/2/Math.PI+.5,C=d(x)/Math.PI+.5;o.push(y,1-C)}g(),u()}function u(){for(let x=0;x<o.length;x+=6){let M=o[x+0],y=o[x+2],C=o[x+4],T=Math.max(M,y,C),A=Math.min(M,y,C);T>.9&&A<.1&&(M<.2&&(o[x+0]+=1),y<.2&&(o[x+2]+=1),C<.2&&(o[x+4]+=1))}}function m(x){r.push(x.x,x.y,x.z)}function p(x,M){let y=x*3;M.x=e[y+0],M.y=e[y+1],M.z=e[y+2]}function g(){let x=new I,M=new I,y=new I,C=new I,T=new ye,A=new ye,P=new ye;for(let b=0,v=0;b<r.length;b+=9,v+=6){x.set(r[b+0],r[b+1],r[b+2]),M.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),T.set(o[v+0],o[v+1]),A.set(o[v+2],o[v+3]),P.set(o[v+4],o[v+5]),C.copy(x).add(M).add(y).divideScalar(3);let L=f(C);_(T,v+0,x,L),_(A,v+2,M,L),_(P,v+4,y,L)}}function _(x,M,y,C){C<0&&x.x===1&&(o[M]=x.x-1),y.x===0&&y.z===0&&(o[M]=C/2/Math.PI+.5)}function f(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}};var oa=class n extends vc{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var an=class n extends bt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new I,m=new I,p=[],g=[],_=[],f=[];for(let d=0;d<=i;d++){let x=[],M=d/i,y=0;d===0&&o===0?y=.5/t:d===i&&c===Math.PI&&(y=-.5/t);for(let C=0;C<=t;C++){let T=C/t;u.x=-e*Math.cos(s+T*r)*Math.sin(o+M*a),u.y=e*Math.cos(o+M*a),u.z=e*Math.sin(s+T*r)*Math.sin(o+M*a),g.push(u.x,u.y,u.z),m.copy(u).normalize(),_.push(m.x,m.y,m.z),f.push(T+y,1-M),x.push(l++)}h.push(x)}for(let d=0;d<i;d++)for(let x=0;x<t;x++){let M=h[d][x+1],y=h[d][x],C=h[d+1][x],T=h[d+1][x+1];(d!==0||o>0)&&p.push(M,y,T),(d!==i-1||c<Math.PI)&&p.push(y,C,T)}this.setIndex(p),this.setAttribute("position",new je(g,3)),this.setAttribute("normal",new je(_,3)),this.setAttribute("uv",new je(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var ln=class n extends bt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let o=[],a=[],c=[],l=[],h=new I,u=new I,m=new I;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){let _=g/s*r,f=p/i*Math.PI*2;u.x=(e+t*Math.cos(f))*Math.cos(_),u.y=(e+t*Math.cos(f))*Math.sin(_),u.z=t*Math.sin(f),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),m.subVectors(u,h).normalize(),c.push(m.x,m.y,m.z),l.push(g/s),l.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){let _=(s+1)*p+g-1,f=(s+1)*(p-1)+g-1,d=(s+1)*(p-1)+g,x=(s+1)*p+g;o.push(_,f,x),o.push(f,d,x)}this.setIndex(o),this.setAttribute("position",new je(a,3)),this.setAttribute("normal",new je(c,3)),this.setAttribute("uv",new je(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Dt=class extends Oi{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Re(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Re(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rd,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new An,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function Oo(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function rx(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var js=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},bc=class extends js{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Hh,endingEnd:Hh}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Vh:r=e,a=2*t-i;break;case Gh:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Vh:o=e,c=2*i-t;break;case Gh:o=1,c=i+s[1]-s[0];break;default:o=e-1,c=t}let l=(i-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,m=this._weightPrev,p=this._weightNext,g=(i-t)/(s-t),_=g*g,f=_*g,d=-m*f+2*m*_-m*g,x=(1+m)*f+(-1.5-2*m)*_+(-.5+m)*g+1,M=(-1-p)*f+(1.5+p)*_+.5*g,y=p*f-p*_;for(let C=0;C!==a;++C)r[C]=d*o[h+C]+x*o[l+C]+M*o[c+C]+y*o[u+C];return r}},Mc=class extends js{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(i-t)/(s-t),u=1-h;for(let m=0;m!==a;++m)r[m]=o[l+m]*u+o[c+m]*h;return r}},Sc=class extends js{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Hn=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Oo(t,this.TimeBufferType),this.values=Oo(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Oo(e.times,Array),values:Oo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Sc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Mc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new bc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Wo:t=this.InterpolantFactoryMethodDiscrete;break;case tc:t=this.InterpolantFactoryMethodLinear;break;case Oa:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Wo;case this.InterpolantFactoryMethodLinear:return tc;case this.InterpolantFactoryMethodSmooth:return Oa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&rx(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Oa,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(s)c=!0;else{let u=a*i,m=u-i,p=u+i;for(let g=0;g!==i;++g){let _=t[u+g];if(_!==t[m+g]||_!==t[p+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let u=a*i,m=o*i;for(let p=0;p!==i;++p)t[m+p]=t[u+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,c=o*i,l=0;l!==i;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Hn.prototype.TimeBufferType=Float32Array;Hn.prototype.ValueBufferType=Float32Array;Hn.prototype.DefaultInterpolation=tc;var as=class extends Hn{constructor(e,t,i){super(e,t,i)}};as.prototype.ValueTypeName="bool";as.prototype.ValueBufferType=Array;as.prototype.DefaultInterpolation=Wo;as.prototype.InterpolantFactoryMethodLinear=void 0;as.prototype.InterpolantFactoryMethodSmooth=void 0;var wc=class extends Hn{};wc.prototype.ValueTypeName="color";var Ec=class extends Hn{};Ec.prototype.ValueTypeName="number";var Tc=class extends js{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-t)/(s-t),l=e*a;for(let h=l+a;l!==h;l+=4)Kt.slerpFlat(r,0,o,l-a,o,l,c);return r}},aa=class extends Hn{InterpolantFactoryMethodLinear(e){return new Tc(this.times,this.values,this.getValueSize(),e)}};aa.prototype.ValueTypeName="quaternion";aa.prototype.InterpolantFactoryMethodSmooth=void 0;var ls=class extends Hn{constructor(e,t,i){super(e,t,i)}};ls.prototype.ValueTypeName="string";ls.prototype.ValueBufferType=Array;ls.prototype.DefaultInterpolation=Wo;ls.prototype.InterpolantFactoryMethodLinear=void 0;ls.prototype.InterpolantFactoryMethodSmooth=void 0;var Ac=class extends Hn{};Ac.prototype.ValueTypeName="vector";var Rc=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,m=l.length;u<m;u+=2){let p=l[u],g=l[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}},ox=new Rc,Cc=class{constructor(e){this.manager=e!==void 0?e:ox,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Cc.DEFAULT_MATERIAL_NAME="__DEFAULT";var Hr=class extends Zt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Re(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},la=class extends Hr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Zt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Re(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},ml=new We,Vu=new I,Gu=new I,ca=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.map=null,this.mapPass=null,this.matrix=new We,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new kr,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;Vu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Vu),Gu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Gu),t.updateMatrixWorld(),ml.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ml),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ml)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Wu=new We,Ar=new I,gl=new I,Pc=class extends ca{constructor(){super(new zt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ye(4,2),this._viewportCount=6,this._viewports=[new rt(2,1,1,1),new rt(0,1,1,1),new rt(3,1,1,1),new rt(1,1,1,1),new rt(3,0,1,1),new rt(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Ar.setFromMatrixPosition(e.matrixWorld),i.position.copy(Ar),gl.copy(i.position),gl.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(gl),i.updateMatrixWorld(),s.makeTranslation(-Ar.x,-Ar.y,-Ar.z),Wu.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wu)}},ha=class extends Hr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Pc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Ic=class extends ca{constructor(){super(new Qo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Vr=class extends Hr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Zt.DEFAULT_UP),this.updateMatrix(),this.target=new Zt,this.shadow=new Ic}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Xc="\\[\\]\\.:\\/",ax=new RegExp("["+Xc+"]","g"),Yc="[^"+Xc+"]",lx="[^"+Xc.replace("\\.","")+"]",cx=/((?:WC+[\/:])*)/.source.replace("WC",Yc),hx=/(WCOD+)?/.source.replace("WCOD",lx),ux=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Yc),dx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Yc),fx=new RegExp("^"+cx+hx+ux+dx+"$"),px=["material","materials","bones","map"],Lc=class{constructor(e,t,i){let s=i||xt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},xt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ax,"")}static parseTrackName(e){let t=fx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);px.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=i(a.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};xt.Composite=Lc;xt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};xt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};xt.prototype.GetterByBindingType=[xt.prototype._getValue_direct,xt.prototype._getValue_array,xt.prototype._getValue_arrayElement,xt.prototype._getValue_toArray];xt.prototype.SetterByBindingTypeAndVersioning=[[xt.prototype._setValue_direct,xt.prototype._setValue_direct_setNeedsUpdate,xt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_array,xt.prototype._setValue_array_setNeedsUpdate,xt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_arrayElement,xt.prototype._setValue_arrayElement_setNeedsUpdate,xt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_fromArray,xt.prototype._setValue_fromArray_setNeedsUpdate,xt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Hy=new Float32Array(1);var Xu=new We,ua=class{constructor(e,t,i=0,s=1/0){this.ray=new os(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Fr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Xu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Xu),this}intersectObject(e,t=!0,i=[]){return Dc(e,this,i,t),i.sort(Yu),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Dc(e[s],this,i,t);return i.sort(Yu),i}};function Yu(n,e){return n.distance-e.distance}function Dc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let o=0,a=r.length;o<a;o++)Dc(r[o],e,t,!0)}}var Gr=class{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Pt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var da=class extends _i{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");var md={type:"change"},Zc={type:"start"},_d={type:"end"},ga=new os,gd=new vn,mx=Math.cos(70*Xr.DEG2RAD),Ut=new I,cn=2*Math.PI,ot={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},qc=1e-6,_a=class extends da{constructor(e,t=null){super(e,t),this.state=ot.NONE,this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:cs.ROTATE,MIDDLE:cs.DOLLY,RIGHT:cs.PAN},this.touches={ONE:hs.ROTATE,TWO:hs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new Kt,this._lastTargetPosition=new I,this._quat=new Kt().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Gr,this._sphericalDelta=new Gr,this._scale=1,this._panOffset=new I,this._rotateStart=new ye,this._rotateEnd=new ye,this._rotateDelta=new ye,this._panStart=new ye,this._panEnd=new ye,this._panDelta=new ye,this._dollyStart=new ye,this._dollyEnd=new ye,this._dollyDelta=new ye,this._dollyDirection=new I,this._mouse=new ye,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=_x.bind(this),this._onPointerDown=gx.bind(this),this._onPointerUp=xx.bind(this),this._onContextMenu=Ex.bind(this),this._onMouseWheel=bx.bind(this),this._onKeyDown=Mx.bind(this),this._onTouchStart=Sx.bind(this),this._onTouchMove=wx.bind(this),this._onMouseDown=yx.bind(this),this._onMouseMove=vx.bind(this),this._interceptControlDown=Tx.bind(this),this._interceptControlUp=Ax.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(md),this.update(),this.state=ot.NONE}update(e=null){let t=this.object.position;Ut.copy(t).sub(this.target),Ut.applyQuaternion(this._quat),this._spherical.setFromVector3(Ut),this.autoRotate&&this.state===ot.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=cn:i>Math.PI&&(i-=cn),s<-Math.PI?s+=cn:s>Math.PI&&(s-=cn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ut.setFromSpherical(this._spherical),Ut.applyQuaternion(this._quatInverse),t.copy(this.target).add(Ut),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Ut.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let a=new I(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new I(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=Ut.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(ga.origin.copy(this.object.position),ga.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ga.direction))<mx?this.object.lookAt(this.target):(gd.setFromNormalAndCoplanarPoint(this.object.up,this.target),ga.intersectPlane(gd,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>qc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>qc||this._lastTargetPosition.distanceToSquared(this.target)>qc?(this.dispatchEvent(md),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?cn/60*this.autoRotateSpeed*e:cn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Ut.setFromMatrixColumn(t,0),Ut.multiplyScalar(-e),this._panOffset.add(Ut)}_panUp(e,t){this.screenSpacePanning===!0?Ut.setFromMatrixColumn(t,1):(Ut.setFromMatrixColumn(t,0),Ut.crossVectors(this.object.up,Ut)),Ut.multiplyScalar(e),this._panOffset.add(Ut)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Ut.copy(s).sub(this.target);let r=Ut.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(cn*this._rotateDelta.x/t.clientHeight),this._rotateUp(cn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(cn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-cn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(cn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-cn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(cn*this._rotateDelta.x/t.clientHeight),this._rotateUp(cn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ye,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function gx(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function _x(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function xx(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(_d),this.state=ot.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function yx(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case cs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ot.DOLLY;break;case cs.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ot.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ot.ROTATE}break;case cs.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ot.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ot.PAN}break;default:this.state=ot.NONE}this.state!==ot.NONE&&this.dispatchEvent(Zc)}function vx(n){switch(this.state){case ot.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ot.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ot.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function bx(n){this.enabled===!1||this.enableZoom===!1||this.state!==ot.NONE||(n.preventDefault(),this.dispatchEvent(Zc),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(_d))}function Mx(n){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(n)}function Sx(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case hs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ot.TOUCH_ROTATE;break;case hs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ot.TOUCH_PAN;break;default:this.state=ot.NONE}break;case 2:switch(this.touches.TWO){case hs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ot.TOUCH_DOLLY_PAN;break;case hs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ot.TOUCH_DOLLY_ROTATE;break;default:this.state=ot.NONE}break;default:this.state=ot.NONE}this.state!==ot.NONE&&this.dispatchEvent(Zc)}function wx(n){switch(this._trackPointer(n),this.state){case ot.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ot.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ot.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ot.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ot.NONE}}function Ex(n){this.enabled!==!1&&n.preventDefault()}function Tx(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ax(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var xa=class extends Js{constructor(){super();let e=new Bn;e.deleteAttribute("uv");let t=new Dt({side:qt}),i=new Dt,s=new ha(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new Le(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new Le(e,i);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);let a=new Le(e,i);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);let c=new Le(e,i);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);let l=new Le(e,i);l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),this.add(l);let h=new Le(e,i);h.position.set(2.291,-.756,-2.621),h.rotation.set(0,-.286,0),h.scale.set(1.546,1.552,1.496),this.add(h);let u=new Le(e,i);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);let m=new Le(e,nr(50));m.position.set(-16.116,14.37,8.208),m.scale.set(.1,2.428,2.739),this.add(m);let p=new Le(e,nr(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let g=new Le(e,nr(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);let _=new Le(e,nr(43));_.position.set(-.462,8.89,14.52),_.scale.set(4.38,5.441,.088),this.add(_);let f=new Le(e,nr(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);let d=new Le(e,nr(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function nr(n){let e=new on;return e.color.setScalar(n),e}var ya=18,Rx=`
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
`,Cx=`
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
  if (uTex == 1) { vec3 w = vor(vWPos*uTexScale); col *= mix(0.55, 1.0, smoothstep(0.0, 0.14, w.y-w.x)) * (0.9 + 0.2*w.z); }
  else if (uTex == 2) { col *= 0.92 + 0.16*fbm(vWPos*30.0); }
  if (uShell > 0.0) col *= furShade; else if (uFurLen > 0.0) col *= 0.75;
  diffuseColor.rgb = col;
}
`;function va(){let n={uBase:{value:new Re},uSecond:{value:new Re},uBellyCol:{value:new Re},uBellyDir:{value:new I(0,-1,0)},uBelly:{value:.8},uPattern:{value:0},uPatScale:{value:1},uTex:{value:0},uTexScale:{value:22},uInv:{value:new We},uFurLen:{value:0},uFurDensity:{value:90},uDroop:{value:.3}},e=s=>{let r=new Dt({roughness:.7,metalness:0});return s>0&&(r.defines={FUR_SHELL:1}),r.onBeforeCompile=o=>{Object.assign(o.uniforms,n,{uShell:{value:s}}),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
attribute float fur;
uniform float uShell; uniform float uFurLen; uniform float uDroop; uniform mat4 uInv;
varying vec3 vWPos; varying vec3 vWNrm;`).replace("#include <begin_vertex>",`vec3 transformed = vec3(position);
          // Patterns and fur are worked out in the creature's own space (uInv undoes how it stands in the scene).
          vWPos = (uInv * modelMatrix * vec4(position, 1.0)).xyz;
          vWNrm = normalize(mat3(uInv) * mat3(modelMatrix) * normal);
          #ifdef FUR_SHELL
          float fl = uShell * uFurLen * fur;
          transformed += normal * fl;
          transformed += vec3(0.0, -1.0, -0.6) * (uShell * fl * uDroop);
          #endif`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
          uniform vec3 uBase, uSecond, uBellyCol, uBellyDir; uniform float uBelly, uPatScale, uTexScale, uShell, uFurLen, uFurDensity;
          uniform int uPattern, uTex; varying vec3 vWPos; varying vec3 vWNrm;`+Rx).replace("#include <color_fragment>",`#include <color_fragment>
`+Cx)},r},t=s=>new Dt(s);return{U:n,skin:e(0),shells:Array.from({length:ya},(s,r)=>e((r+1)/ya)),accent:t({roughness:.35}),hair:t({roughness:.55}),membrane:t({roughness:.6,side:Ht}),glass:t({roughness:.15,transparent:!0,opacity:.45,side:Ht,depthWrite:!1}),teeth:t({color:16052188,roughness:.3}),mouth:t({color:3804436,roughness:.5}),tongue:t({color:14248572,roughness:.4}),dark:t({color:1775384,roughness:.25}),lip:t({roughness:.35}),lash:t({color:1380370,roughness:.6}),eyeCache:new Map}}var Px={skin:0,scales:1,chitin:2,slime:0,fur:0},Ix={skin:.72,scales:.45,chitin:.22,slime:.1,fur:.9};function ti(n,e,t){var r,o;let i=n.U;i.uBase.value.set(e.base),i.uSecond.value.set(e.second),i.uBellyCol.value.set(e.belly),i.uBelly.value=e.bellyAmt,i.uPattern.value=e.pattern,i.uPatScale.value=e.patScale,i.uBellyDir.value.set(...t).normalize(),i.uTex.value=(r=Px[e.cover])!=null?r:0;let s=e.cover==="fur";i.uFurLen.value=s?.012+e.furLen*.13:0,i.uDroop.value=e.furDroop*1.2,i.uFurDensity.value=330-e.furLen*170;for(let a of[n.skin,...n.shells])a.roughness=(o=Ix[e.cover])!=null?o:.7,a.metalness=e.cover==="chitin"?.25:0;n.accent.color.set(e.accent),n.hair.color.set(e.hair),n.membrane.color.set(e.membrane),n.glass.color.set(e.membrane),n.lip.color.set(e.base).lerp(new Re(12075102),.6)}function xd(n,e,t,i){let s=e+t+i.toFixed(2);if(n.eyeCache.has(s))return n.eyeCache.get(s);let r=256,o=128,a=document.createElement("canvas");a.width=r,a.height=o;let c=a.getContext("2d"),l=new Re(t),h={};l.getHSL(h);let u=(g,_,f)=>`hsl(${(g*360).toFixed(0)},${(_*100).toFixed(0)}%,${(Lx(f)*100).toFixed(0)}%)`,m=new Dt({roughness:.06,metalness:0});if(e==="compound"){c.fillStyle=u(h.h,h.s,h.l*.8),c.fillRect(0,0,r,o);for(let g=0;g<22;g++)for(let _=0;_<44;_++){let f=(_+g%2*.5)*(r/44),d=g*(o/22)+3,x=c.createRadialGradient(f-1,d-1,0,f,d,3.4);x.addColorStop(0,u(h.h+.05,h.s,h.l*1.5+.1)),x.addColorStop(1,u(h.h,h.s,h.l*.35)),c.fillStyle=x,c.beginPath(),c.arc(f,d,3.4,0,7),c.fill()}m.roughness=.18,m.metalness=.3}else if(e==="beady")c.fillStyle="#0b0a0d",c.fillRect(0,0,r,o),c.fillStyle=u(h.h,h.s,.12),c.fillRect(0,0,r,o*.3);else{let g=c.createLinearGradient(0,0,0,o);g.addColorStop(0,"#f7f4ee"),g.addColorStop(.45,"#efe6df"),g.addColorStop(.7,"#d9a9a4"),c.fillStyle=g,c.fillRect(0,0,r,o);let _=i*.95/Math.PI*o,f=7,d=()=>(f=f*16807%2147483647,f/2147483647);for(let x=0;x<r;x++){let M=x/r*Math.PI*2+Math.PI,y=.75+d()*.5,C=c.createLinearGradient(0,0,0,_);if(C.addColorStop(0,u(h.h+.03,h.s,h.l*1.5*y+.08)),C.addColorStop(.75,u(h.h,h.s,h.l*y)),C.addColorStop(.93,u(h.h,h.s,h.l*.3)),C.addColorStop(1,"#20140f"),c.fillStyle=C,c.fillRect(x,0,1,_),e!=="glow"){let T=.5,A=.5;e==="cat"?(T=.13,A=.9):e==="goat"&&(T=.85,A=.22);let P=T*A/Math.sqrt((A*Math.cos(M))**2+(T*Math.sin(M))**2);c.fillStyle="#050406",c.fillRect(x,0,1,_*P)}}if(e==="glow"){m.emissive=l.clone(),m.emissiveIntensity=1.3;let x=document.createElement("canvas");x.width=4,x.height=o;let M=x.getContext("2d");M.fillStyle="#000",M.fillRect(0,0,4,o);let y=M.createLinearGradient(0,0,0,_);y.addColorStop(0,"#fff"),y.addColorStop(1,"#333"),M.fillStyle=y,M.fillRect(0,0,4,_),m.emissiveMap=new ei(x)}}let p=new ei(a);return p.colorSpace=Ft,p.wrapS=Dr,p.anisotropy=4,m.map=p,n.eyeCache.set(s,m),m}var Lx=n=>Math.min(1,Math.max(0,n));function vd(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,c=new bt,l=0;for(let h=0;h<n.length;++h){let u=n[h],m=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),m++}if(m!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(e){let p;if(t)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,h),l+=p}}if(t){let h=0,u=[];for(let m=0;m<n.length;++m){let p=n[m].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+h);h+=n[m].attributes.position.count}c.setIndex(u)}for(let h in r){let u=yd(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let m=0;m<u;++m){let p=[];for(let _=0;_<o[h].length;++_)p.push(o[h][_][m]);let g=yd(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function yd(n){let e,t,i,s=-1,r=0;for(let l=0;l<n.length;++l){let h=n[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new wt(o,t,i),c=0;for(let l=0;l<n.length;++l){let h=n[l];if(h.isInterleavedBufferAttribute){let u=c/t;for(let m=0,p=h.count;m<p;m++)for(let g=0;g<t;g++){let _=h.getComponent(m,g);a.setComponent(m+u,g,_)}}else o.set(h.array,c);c+=h.count*t}return s!==void 0&&(a.gpuType=s),a}var Dx=I,se=(n=0,e=0,t=0)=>new Dx(n,e,t),Vn=(n,e,t)=>Math.min(t,Math.max(e,n)),hn=(n,e,t)=>n+(e-n)*t,Rn=se(1,0,0),Vt=se(0,1,0),ir=se(0,0,1);function Yr(n){let e=(n|0)+1831565813;return()=>(e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296)}function Ux(n,e,t,i,s){let r=s*s,o=r*s;return .5*(2*e+(t-n)*s+(2*n-5*e+4*t-i)*r+(3*e-n-3*t+i)*o)}function bd(n,e){let t=n.length,i=Vn(e,0,1)*(t-1),s=Math.min(Math.floor(i),t-2),r=i-s,o=n[Math.max(s-1,0)],a=n[s],c=n[s+1],l=n[Math.min(s+2,t-1)];return Vn(Ux(o,a,c,l,r),Math.min(a,c)*.9,Math.max(a,c)*1.06)}function jt(n,e={}){var Y,ie,te,me,ke;let t=(Y=e.radial)!=null?Y:14,i=(ie=e.sub)!=null?ie:6,s=(te=e.capRings)!=null?te:4,r=(me=e.capStart)!=null?me:1,o=(ke=e.capEnd)!=null?ke:1,a=n.length,c=new Bi(n.map(U=>U.p),!1,"centripetal"),l=n.map(U=>U.rx),h=n.map(U=>{var Z;return(Z=U.ry)!=null?Z:U.rx}),u=(a-1)*i+1,m=[],p=[],g=[],_=[],f=[],d=[],x=null;for(let U=0;U<u;U++){let Z=U/(u-1),re=c.getPoint(Z),ee=c.getTangent(Z).normalize();x||(x=e.side?e.side.clone():Math.abs(ee.x)<.9?Rn.clone():Vt.clone()),x=x.clone().addScaledVector(ee,-x.dot(ee)),x.lengthSq()<1e-8&&(x=Math.abs(ee.y)<.9?Vt.clone().cross(ee):Rn.clone().cross(ee)),x.normalize(),m.push(re),p.push(ee),g.push(x),_.push(ee.clone().cross(x).normalize());let we=bd(l,Z),Ee=bd(h,Z);if(e.ridges){let De=1+e.ridgeAmp*Math.sin(Z*e.ridges*Math.PI*2);we*=De,Ee*=De}f.push(Math.max(we,1e-4)),d.push(Math.max(Ee,1e-4))}let M=[],y=(U,Z)=>Z*(f[U]+d[U])*.5;if(r>0)for(let U=s;U>=1;U--){let Z=U/s*Math.PI/2;M.push({c:m[0].clone().addScaledVector(p[0],-y(0,r)*Math.sin(Z)),i:0,s:Math.max(Math.cos(Z),.015),u:-U/s})}for(let U=0;U<u;U++)M.push({c:m[U],i:U,s:1,u:U/(u-1)});if(o>0)for(let U=1;U<=s;U++){let Z=U/s*Math.PI/2;M.push({c:m[u-1].clone().addScaledVector(p[u-1],y(u-1,o)*Math.sin(Z)),i:u-1,s:Math.max(Math.cos(Z),.015),u:1+U/s})}let C=M.length,T=t+1,A=new Float32Array(C*T*3),P=new Float32Array(C*T*3),b=new Float32Array(C*T*2),v=se();for(let U=0;U<C;U++){let Z=M[U],re=Z.i;for(let ee=0;ee<=t;ee++){let we=ee/t*Math.PI*2;v.copy(Z.c).addScaledVector(g[re],f[re]*Z.s*Math.sin(we)).addScaledVector(_[re],d[re]*Z.s*Math.cos(we));let Ee=(U*T+ee)*3;A[Ee]=v.x,A[Ee+1]=v.y,A[Ee+2]=v.z,b[(U*T+ee)*2]=Z.u,b[(U*T+ee)*2+1]=ee/t}}let L=(U,Z,re)=>{let ee=(U*T+Z)*3;return re.set(A[ee],A[ee+1],A[ee+2])},V=se(),G=se(),E=se(),B=se(),D=se();for(let U=0;U<C;U++)for(let Z=0;Z<=t;Z++){let re=Z%t;L(Math.min(U+1,C-1),re,V),L(Math.max(U-1,0),re,G),L(U,(re+1)%t,E),L(U,(re-1+t)%t,B),D.copy(V.sub(G)).cross(E.sub(B)),D.lengthSq()<1e-16&&D.copy(p[M[U].i]).multiplyScalar(U<C/2?-1:1),D.normalize();let ee=(U*T+Z)*3;P[ee]=D.x,P[ee+1]=D.y,P[ee+2]=D.z}let q=[];for(let U=0;U<C-1;U++)for(let Z=0;Z<t;Z++){let re=U*T+Z,ee=re+T;q.push(re,ee,re+1,re+1,ee,ee+1)}let z=new bt;return z.setAttribute("position",new wt(A,3)),z.setAttribute("normal",new wt(P,3)),z.setAttribute("uv",new wt(b,2)),z.setIndex(q),e.frames&&(z.userData.frames={C:m,T:p,S:g,U:_,RX:f,RY:d,capS:r,capE:o,m:u}),z.userData.end={p:m[u-1],t:p[u-1],r:(f[u-1]+d[u-1])/2},z}function sr(n,e,t){let i=Vn(e,0,1),s=i*(n.m-1),r=Math.min(Math.floor(s),n.m-2),o=s-r,a=r+1,c=n.C[r].clone().lerp(n.C[a],o),l=n.S[r].clone().lerp(n.S[a],o).normalize(),h=n.T[r].clone().lerp(n.T[a],o).normalize(),u=h.clone().cross(l).normalize(),m=hn(n.RX[r],n.RX[a],o),p=hn(n.RY[r],n.RY[a],o),g=1,_=0,f=0;(e<0||e>1)&&(f=e<0?-1:1,_=Vn(e<0?-e:e-1,0,1)*Math.PI/2,c.addScaledVector(h,f*(f<0?n.capS:n.capE)*(m+p)*.5*Math.sin(_)),g=Math.max(Math.cos(_),.015));let d=Math.sin(t),x=Math.cos(t),M=c.clone().addScaledVector(l,m*g*d).addScaledVector(u,p*g*x),C=l.clone().multiplyScalar(d/m).addScaledVector(u,x/p).normalize().multiplyScalar(Math.cos(_)).addScaledVector(h,f*Math.sin(_)).normalize();return{pos:M,normal:C,tangent:h,center:c,rx:m,ry:p,r:(m+p)/2}}function at(n,e){return jt(n.map(t=>{var i;return{p:se(t[0],t[1],t[2]),rx:t[3],ry:(i=t[4])!=null?i:t[3]}}),e)}function ut(n,e=1,t=1,i=1,s=0,r=0,o=0,a=14){let c=new an(n,a,Math.max(8,Math.round(a*.7)));return c.scale(e,t,i),c.translate(s,r,o),c}function ds(n,e){let t=n.length,i=[],s=[],r=[];for(let a=0;a<t;a++)i.push(n[a].x,n[a].y,n[a].z,e[a].x,e[a].y,e[a].z),r.push(a/(t-1),0,a/(t-1),1);for(let a=0;a<t-1;a++){let c=a*2;s.push(c,c+1,c+2,c+2,c+1,c+3)}let o=new bt;return o.setAttribute("position",new je(i,3)),o.setAttribute("uv",new je(r,2)),o.setIndex(s),o.computeVertexNormals(),o}function Md(n,e){return n.applyMatrix4(e),n}function fs(n,e,t,i){return n.translate(e,t,i),n}function $c(n,e,t,i){return new We().makeBasis(n,e,t).setPosition(i||se())}function Sd(n){let e=n.index.array;for(let t=0;t<e.length;t+=3){let i=e[t];e[t]=e[t+2],e[t+2]=i}}function Fe(n,e=[]){if(n.length===1)return n[0];let t=n.map(i=>{let s=i.index?i:i.toNonIndexed();for(let r of Object.keys(s.attributes))r!=="position"&&r!=="normal"&&r!=="uv"&&!e.includes(r)&&s.deleteAttribute(r);return s});return vd(t,!1)}var un=Math.PI;var Qt=(n,e,t,i={})=>jt([{p:n,rx:t},{p:n.clone().lerp(e,.5),rx:t*.62},{p:e,rx:t*.04}],{radial:8,sub:3,capStart:0,capEnd:0,...i}),ni=(n,e)=>{let t=e.clone().addScaledVector(n,-e.dot(n));return t.lengthSq()<1e-6?(Math.abs(n.x)<.9?Rn:Vt).clone().cross(n).normalize():t.normalize()};function Cn(n,e,t,i,s={}){let r=n[n.length-1].clone().sub(n[0]).normalize(),o=r.clone().cross(i);return jt(n.map((a,c)=>({p:a,rx:Math.max(e[c],.004),ry:Math.max(t*(e[c]>.03?1:.4),.003)})),{radial:8,sub:4,side:o.lengthSq()<1e-6?ni(r,Rn):o.normalize(),capStart:.5,capEnd:.5,capRings:2,...s})}function Nx(n){return(e,t)=>{var c,l,h,u,m;let i=[],r=n==="stalk",o=r?1.55:n==="compound"?0:n==="beady"?.05:-.1,a=new an(.5,28,18);if(a.rotateX(un/2),n==="compound"&&a.scale(.95,1.2,.85),i.push({g:fs(a,0,0,o),m:xd(t.M,r?"round":n,t.look.eye,(c=e.iris)!=null?c:.75)}),r&&i.push({g:at([[0,0,-.3,.3],[0,.05,.5,.2],[0,0,1.15,.19],[0,0,1.5,.4]],{capEnd:.6}),m:"skin"}),n!=="compound"){let p=new ln(.51,.085,8,28);p.scale(1,1,1.3),r||i.push({g:fs(p,0,0,-.03),m:"skin"});let g=(l=e.lid)!=null?l:.3;if(g>.02&&n!=="beady"){let _=new an(.535,22,10,0,un*2,0,.55+g*1.05);_.rotateX(.55),_.rotateZ((h=e.brow)!=null?h:0),i.push({g:fs(_,0,0,o),m:"skin"});let f=new an(.5*1.06,22,8,0,un*2,0,.42+g*.4);if(f.rotateX(un-.3),i.push({g:fs(f,0,0,o),m:"skin"}),t.female&&((u=e.lash)!=null?u:1)>.05){let d=.55+g*1.05,x=[];for(let M=0;M<7;M++){let y=-1.05+M*.35,C=se(Math.sin(d)*Math.sin(y),Math.cos(d),Math.sin(d)*Math.cos(y)).applyAxisAngle(Rn,.55).applyAxisAngle(ir,(m=e.brow)!=null?m:0),T=C.clone().multiplyScalar(.5*1.06).add(se(0,0,o)),A=T.clone().add(C.clone().add(se(0,.75,.55)).normalize().multiplyScalar(.3*e.lash*(1-Math.abs(y)*.3)));x.push(Qt(T,A,.028,{radial:5}))}i.push({g:Fe(x),m:"lash"})}}}return i}}var Fx={iris:[.4,1.2,.75,"Iris size"],lid:[0,.9,.3,"Eyelid"],brow:[-.7,.7,0,"Sad / angry"],lash:[0,2,1,"Lashes (female)"]};function wd(n,e,t,i=1){let s=[];for(let r=0;r<n;r++){let o=e(r/(n-1));s.push(Qt(o.p,o.p.clone().add(se(0,-i*t*o.s,0)),.035*(.7+o.s*.5),{radial:6}))}return s}function kx(n){let e=n.len,t=[],i=n.open;t.push({g:at([[0,.06,-.35,.52,.44],[0,.08,.2*e,.44,.34],[0,.04,.62*e,.34,.24],[0,0,.9*e,.27,.19]],{radial:16}),m:"skin",fur:.3}),t.push({g:ut(.15,1.25,.85,.9,0,.1,.9*e+.2),m:"dark"});let s=at([[0,-.1,-.3,.44,.22],[0,-.14,.3*e,.34,.15],[0,-.13,.82*e,.21,.1]],{radial:14}),r=n.teeth,o=[s],a=[],c=[];for(let h of[-1,1])a.push(...wd(6,u=>({p:se(h*hn(.36,.17,u),-.08,hn(.2,.95,u)*e),s:u>.75&&u<.95?2.2:1}),.13*r)),c.push(...wd(5,u=>({p:se(h*hn(.3,.14,u),-.05,hn(.25,.82,u)*e),s:u>.7?1.6:.8}),.1*r,-1));let l=h=>(h.translate(0,.1,.3),h.rotateX(i*.75),h.translate(0,-.1,-.3),h);return t.push({g:l(s),m:"skin",fur:.3}),r>.05&&(t.push({g:Fe(a),m:"teeth"}),t.push({g:l(Fe(c)),m:"teeth"})),t.push({g:ut(.5,.62,.16+i*.25,.9*e,0,-.1-i*.1,.4*e),m:"mouth"}),i>.25&&t.push({g:l(ut(.5,.36,.07,.7*e,0,-.03,.42*e)),m:"tongue"}),t}function Ox(n){let e=n.len,t=n.hook,i=[];i.push({g:at([[0,.05,-.3,.44,.38],[0,.07,.3*e,.33,.27],[0,.03-t*.05,.72*e,.17,.15],[0,-t*.4,1*e,.015]],{radial:12,capEnd:.3}),m:"accent"});let s=at([[0,-.16,-.3,.38,.2],[0,-.17,.35*e,.24,.11],[0,-.14,.8*e,.02]],{radial:12,capEnd:.3});return s.translate(0,.1,.2),s.rotateX(n.open*.6),s.translate(0,-.1,-.2),i.push({g:s,m:"accent"}),i.push({g:Fe([ut(.035,1,1,1.6,.14,.2,.3*e),ut(.035,1,1,1.6,-.14,.2,.3*e)]),m:"dark"}),n.open>.2&&i.push({g:ut(.5,.4,.12,.6*e,0,-.08,.3*e),m:"mouth"}),i}function Bx(n){let e=[],t=[],i=n.open;for(let s of[-1,1])e.push(at([[s*.28,0,-.15,.17],[s*(.5+i*.25),-.05,.4,.14],[s*(.36+i*.3),-.1,.85*n.len,.08],[s*(.08+i*.3),-.12,1.1*n.len,.01]],{radial:10,ridges:0})),t.push(at([[s*.12,-.2,-.1,.07],[s*.15,-.35,.3,.05],[s*.1,-.5,.45,.02]],{radial:8}));return[{g:Fe(e),m:"accent"},{g:Fe(t),m:"skin"},{g:ut(.3,1,.8,.5,0,-.08,.02),m:"mouth"}]}function zx(n){let e=new ln(.42,.15,10,28);e.translate(0,0,.05);let t=[],i=Math.round(n.count);for(let s=0;s<2;s++)for(let r=0;r<i;r++){let o=(r+s*.5)/i*un*2,a=.36-s*.1,c=se(Math.cos(o)*a,Math.sin(o)*a,.1-s*.08);t.push(Qt(c,c.clone().add(se(-Math.cos(o)*.14,-Math.sin(o)*.14,.16).multiplyScalar(n.teeth)),.045,{radial:6}))}return[{g:e,m:"skin"},{g:ut(.4,1,1,.35,0,0,-.02),m:"mouth"},{g:Fe(t),m:"teeth"}]}function Hx(n){let e=(i,s,r)=>{let o=[];for(let a=0;a<=6;a++){let c=a/6-.5,l=1-Math.abs(c)*2;o.push([c,i+n.smile*.22*(c*c*4)+r*.03*l,.04-c*c*.45,.012+.075*s*Math.pow(l,.6),.012+.06*s*Math.pow(l,.6)])}return at(o,{radial:10,sub:3,side:se(0,1,0)})},t=at([[-.48,n.smile*.2,-.06,.012],[0,0,.065,.02],[.48,n.smile*.2,-.06,.012]],{radial:6});return[{g:Fe([e(.045,n.full*.85,1),e(-.05,n.full,-1)]),m:"lip"},{g:t,m:"mouth"}]}function Vx(n){let e=n.curl;return[{g:at([[0,0,-.3,.4],[0,-.05,.45,.34],[0,-.55,.95,.27],[0,-1.25*n.len,1.1,.21],[0,-1.9*n.len,1+e*.2,.17],[0,-2.3*n.len,1+e*.9,.14]],{radial:14,sub:8,ridges:26,ridgeAmp:.04}),m:"skin"}]}function Gx(n,e){let t=[],i=Math.round(n.count);for(let s=0;s<i;s++){let r=(s-(i-1)/2)*(.7/i),o=.1*Math.sin(s*2.4),a=e.down,c=se(r,0,-.15),l=se(r*1.2,0,.3),h=l.clone().addScaledVector(a,.5*n.len).add(se(0,0,.1)),u=h.clone().addScaledVector(a,.6*n.len).add(se(r*.5+o,0,-.1+o));t.push(jt([{p:c,rx:.12},{p:l,rx:.1},{p:h,rx:.07},{p:u,rx:.02}],{radial:8}))}return[{g:Fe(t),m:"skin"},{g:ut(.25,1.2,.7,.4,0,-.05,0),m:"mouth"}]}function Wx(n){return[{g:Fe([at([[0,.5*n.len,-.1,.09,.08],[0,.2,.1*n.len+.05,.12,.11],[0,-.06,.3*n.len,.17,.14]],{radial:10}),ut(.12,1,.8,1,.15*n.wide,-.1,.1*n.len),ut(.12,1,.8,1,-.15*n.wide,-.1,.1*n.len)]),m:"skin"}]}function qr(n){return(e,t)=>{let i=t.up,s=t.down,r={point:[[se(0,0,-.15),.34],[se(0,.04,.3),.37],[se(0,.07,.72),.22],[se(0,.09,1.08),.02]],round:[[se(0,0,-.12),.3],[se(0,0,.3),.5],[se(0,0,.62),.44],[se(0,0,.8),.2]],long:[[se(0,0,-.15),.2],[se(0,.03,.6),.27],[se(0,.04,1.45),.24],[se(0,0,2.1),.03]],elf:[[se(0,0,-.12),.17],[se(0,0,.2).addScaledVector(i,.12),.3],[se(0,0,.42).addScaledVector(i,.45),.2],[se(0,0,.62).addScaledVector(i,.95*e.len),.02]],floppy:[[se(0,0,-.12),.3],[se(0,0,.3),.38],[se(0,0,.5).addScaledVector(s,.5*e.len),.42],[se(0,0,.46).addScaledVector(s,1.1*e.len),.32],[se(0,0,.42).addScaledVector(s,1.45*e.len),.06]]}[n],o=n==="floppy"||n==="elf"?1:e.len,a=r.map(u=>se(u[0].x,u[0].y,u[0].z*(u[0].z>0?o:1))),c=r.map(u=>u[1]*e.wide),l=n==="floppy"?se(0,0,1):t.fwd,h=Cn(a.map((u,m)=>u.clone().addScaledVector(l,.045).multiplyScalar(m?.9:1)),c.map(u=>u*.62),.03,l);return[{g:Cn(a,c,.07,l,{radial:10}),m:"skin",fur:.3},{g:h,m:"membrane"}]}}function Xx(n,e){let t=[],i=[],s=[];for(let r=0;r<5;r++){let o=-.6+r*.42,a=se(0,0,1).multiplyScalar(Math.cos(o)).addScaledVector(e.up,Math.sin(o)),c=a.clone().multiplyScalar(n.len*(.8+.35*Math.sin((r+.5)/5*un)));t.push(c),i.push(a.clone().multiplyScalar(.05)),s.push(Qt(se(0,0,-.1),c,.045,{radial:6}))}return[{g:Fe(s),m:"accent"},{g:ds(i,t.map(r=>r.clone().multiplyScalar(.93))),m:"membrane"}]}function rr(n){return e=>{var c,l;let t=e.len,i=(c=e.curve)!=null?c:1,s={radial:12,sub:7,ridges:n==="spike"?0:9*t,ridgeAmp:.05,capEnd:.3};if(n==="spike")return[{g:at([[0,0,-.15,.3],[0,.02*i,.5*t,.2],[0,.1*i,1.25*t,.01]],s),m:"accent"}];if(n==="curved")return[{g:at([[0,0,-.15,.3],[0,.05*i,.42*t,.26],[0,.32*i,.88*t,.18],[0,.78*i,1.12*t,.09],[0,1.2*i,1.05*t,.01]],s),m:"accent"}];if(n==="ram"){let h=[];for(let u=0;u<=12;u++){let m=u/12,p=m*un*1.75*i,g=.62*t*(1-m*.45);h.push([.12+m*.75,g*Math.sin(p)*.9,-.15+g*(1-Math.cos(p)),.32*(1-m*.95)+.01])}return[{g:at(h,{...s,sub:4,ridges:22}),m:"accent"}]}if(n==="tusk")return[{g:at([[0,0,-.25,.2],[0,-.3*i,.3*t,.17],[0,-.38*i,.8*t,.12],[0,-.05,1.3*t,.01]],{...s,ridges:0}),m:"teeth"}];let r=[[0,0,-.15,.14],[.05,.2,.6,.115],[.12,.5,1.2,.095],[.15,.62,1.9,.065],[.1,.5,2.5,.012]].map(h=>[h[0],h[1]*i,h[2]*t,h[3]]),o=[at(r,{radial:8,sub:5})],a=Math.round((l=e.tines)!=null?l:3);for(let h=0;h<a;h++){let u=(h+.6)/(a+.4),m=u*4,p=Math.min(Math.floor(m),3),g=m-p,_=se(hn(r[p][0],r[p+1][0],g),hn(r[p][1],r[p+1][1],g),hn(r[p][2],r[p+1][2],g)),f=h%2?1:-1,d=.7*(1-u*.4);o.push(jt([{p:_,rx:.08},{p:_.clone().add(se(f*.2*d,-.35*d,.3*d)),rx:.065},{p:_.clone().add(se(f*.3*d,-.5*d,.9*d)),rx:.012}],{radial:7,sub:4,capStart:0}))}return[{g:Fe(o),m:"accent"}]}}function Ed(n){return e=>{let t=e.len,i=e.curve,s=[[0,0,-.08,.055],[0,.1*i,.6*t,.045],[0,.5*i,1.2*t,.035],[0,1.05*i,1.5*t,.028]],r=[at(s,{radial:7,sub:6})];if(!n)return[{g:r[0],m:"accent"},{g:ut(.09,1,1,1,0,1.05*i,1.5*t),m:"accent"}];let o=new Bi(s.map(a=>se(a[0],a[1],a[2])));for(let a=2;a<16;a++){let c=o.getPoint(a/16),l=.3*Math.sin(a/16*un)+.05;for(let h of[-1,1])r.push(Qt(c,c.clone().add(se(h*l,.05,l*.3)),.016,{radial:4}))}return[{g:Fe(r),m:"hair"}]}}function Jc(n){return(e,t)=>{var h,u,m,p,g,_;let i=[],s=Math.round((h=e.count)!=null?h:n.count),r=(u=e.droop)!=null?u:n.droop,o=(m=e.len)!=null?m:1,a=(p=e.spread)!=null?p:n.spread,c=(g=n.capR)!=null?g:.5,l=se(0,0,-c-.02);for(let f=0;f<s;f++){let d=a*Math.sqrt((f+.5)/s),x=f*2.39996+t.rnd()*.3,M=se(Math.sin(d)*Math.cos(x),Math.sin(d)*Math.sin(x),Math.cos(d)),y=o*(.75+.5*t.rnd()),C=n.width*(.8+.4*t.rnd()),T=y/4,A=[l.clone().addScaledVector(M,c)],P=M.clone(),b=A[0].clone();for(let L=1;L<=4;L++){P.multiplyScalar(1-r*.5).addScaledVector(t.down,r*.3*L).normalize(),b=b.clone().addScaledVector(P,T);let V=b.clone().sub(l);n.hug&&V.length()<c*1.05&&(b=l.clone().add(V.setLength(c*1.05))),A.push(b)}let v=n.hug?A[2].clone().sub(l).normalize():ni(M,t.fwd.clone().add(se(t.rnd()-.5,t.rnd()-.5,0)));i.push(Cn(A,[C*.75,C,C*.95,C*.65,.012],C*.2,v,{radial:6,sub:3}))}return[{g:Fe(i),m:(_=n.mat)!=null?_:"hair"}]}}function Yx(n,e){let t=[];for(let i=0;i<4;i++){let s=-.45+i*.3,o=se(0,0,1).multiplyScalar(.35).addScaledVector(e.up,Math.sin(s)*.6).addScaledVector(e.fwd,-.15).add(se(0,0,.6)).normalize().clone().multiplyScalar(n.len*1.6);t.push(jt([{p:se(0,(i-1.5)*.1,0),rx:.016},{p:o.clone().multiplyScalar(.5).addScaledVector(e.down,-.05),rx:.012},{p:o.addScaledVector(e.down,.12*n.len),rx:.004}],{radial:4,sub:4}))}return[{g:Fe(t),m:"teeth"}]}function qx(n){let e=new ln(.5,.06,6,28);e.scale(1,n.long,1);let t=[];for(let i=0;i<7;i++){let s=i/6*un*2,r=i===6?0:.27;t.push(ut(.17,1,1,.35,Math.cos(s)*r,Math.sin(s)*r*n.long,.5*n.dome*(i===6?.98:.8)))}return[{g:Fe([ut(.5,1,n.long,n.dome,0,0,0,22),e]),m:"accent"},{g:Fe(t),m:"skin"}]}function Zx(n,e){let t=e.fwd.clone().multiplyScalar(-1),i=se(0,0,1),s=(r,o)=>i.clone().multiplyScalar(r).addScaledVector(t,o);return[{g:Cn([s(-.12,0),s(.4*n.len,.15*n.sweep),s(.8*n.len,.5*n.sweep),s(1.1*n.len,.95*n.sweep)],[.5,.42,.25,.02],.06,ni(i,t.clone().cross(i)),{radial:10}),m:"skin"}]}function $x(n,e){let t=e.fwd.clone().multiplyScalar(-1),i=se(0,0,1),s=e.down,r=(o,a,c)=>i.clone().multiplyScalar(o).addScaledVector(t,a).addScaledVector(s,c);return[{g:Cn([r(-.12,0,0),r(.4*n.len,.15*n.sweep,.08),r(.9*n.len,.5*n.sweep,.2),r(1.25*n.len,.95*n.sweep,.3)],[.3,.38,.27,.02],.05,e.up,{radial:10}),m:"skin"}]}var Ma={human(){let n=[];for(let e=0;e<5;e++)n.push(ut(.3-e*.03,1,.8,1.3,-.62+e*.33,-.95,2.55-e*.14));return[{g:Fe([ut(.95,.95,.85,1.05,0,-.45,-.25),at([[0,-.4,-.2,.8,.6],[0,-.65,1.1,.9,.5],[0,-.85,2.3,.95,.3]],{radial:10}),...n]),m:"skin"}]},paw(){let n=[ut(1,1.15,.8,1.35,0,-.55,.45)],e=[];for(let t=0;t<4;t++){let i=-.75+t*.5,s=1.55-Math.abs(t-1.5)*.18;n.push(ut(.42,1,.9,1.3,i,-.75,s)),e.push(Qt(se(i,-.6,s+.35),se(i*1.08,-1.05,s+.95),.14,{radial:6}))}return[{g:Fe(n),m:"skin",fur:.35},{g:Fe(e),m:"accent"}]},hoof(){return[{g:at([[0,.1,0,.95],[0,-.6,.15,1.2,1.25],[0,-1.15,.3,1.4,1.5]],{radial:12,capEnd:.12,capStart:0}),m:"accent"}]},talon(n){let e=[],t=[];for(let[s,r,o]of[[-1.25,1.7,1],[0,2.3,1.1],[1.25,1.7,1],[0,-1.4,.7]]){e.push(at([[0,-.1,0,.55],[s*.5,-.75,r*.5,.45],[s,-1,r,.32]],{radial:8,ridges:5,ridgeAmp:.08}));let a=se(s,0,r).normalize();t.push(Qt(se(s,-.95,r),se(s,-1.25,r).addScaledVector(a,.75*o),.26,{radial:6}))}let i=[{g:Fe(e),m:"skin"},{g:Fe(t),m:"accent"}];return n&&i.push({g:ds([se(0,-.6,.2),se(0,-.6,.2),se(0,-.6,.2),se(0,-.6,.2),se(0,-.6,.2)],[se(-1.45,-1.05,1.95),se(-.75,-1.05,1.8),se(0,-1.05,2.6),se(.75,-1.05,1.8),se(1.45,-1.05,1.95)]),m:"membrane"}),i},webbed(){return Ma.talon(!0)},stump(){let n=[];for(let e=0;e<4;e++){let t=-.9+e*.6;n.push(ut(.3,1,.8,.6,Math.sin(t)*1.3,-.95,Math.cos(t)*1.3+.1))}return[{g:at([[0,.2,0,1],[0,-.6,.05,1.2],[0,-1.15,.1,1.38]],{radial:12,capEnd:.1,capStart:0}),m:"skin"},{g:Fe(n),m:"accent"}]},point(){return[{g:Qt(se(0,.2,0),se(.3,-1.9,.2),.95,{capStart:0}),m:"accent"}]},none(){return[]}},Td={human(){let n=[ut(1,1.2,1.3,.6,0,1,0)];return[-.82,-.28,.27,.8].forEach((e,t)=>{let i=[.85,1,1.05,.95][t];n.push(at([[e,1.8,0,.3],[e*1.1,1.8+1.1*i,.1,.27],[e*1.15,1.8+1.9*i,.4,.24],[e*1.15,1.8+2.4*i,.8,.2]],{radial:7,sub:4,ridges:3,ridgeAmp:.06}))}),n.push(at([[.7,.6,.2,.36],[1.5,1.3,.5,.3],[1.9,2.1,.75,.24]],{radial:7,sub:4})),[{g:Fe(n),m:"skin"}]},claw(){let n=[ut(1,1.2,1.2,.75,0,.9,0)],e=[];for(let t of[-.85,0,.85])n.push(at([[t,1.5,0,.42],[t*1.3,2.6,.2,.38],[t*1.4,3.3,.7,.3]],{radial:7,sub:4,ridges:2,ridgeAmp:.08})),e.push(Qt(se(t*1.4,3.25,.65),se(t*1.45,3.9,1.6),.27,{radial:6}));return n.push(at([[.9,.5,.2,.4],[1.7,1.2,.6,.3]],{radial:7})),e.push(Qt(se(1.7,1.2,.6),se(2,1.7,1.3),.26,{radial:6})),[{g:Fe(n),m:"skin"},{g:Fe(e),m:"accent"}]},pincer(){return[{g:Fe([ut(1,1.7,2.1,1.25,0,1.6,0),at([[-.7,3,0,.8,.6],[-1.1,4.4,0,.6,.45],[-.75,5.5,0,.3],[-.1,6.1,0,.03]],{radial:9,capStart:0}),at([[.8,2.9,0,.6,.5],[1.1,4.1,0,.42],[.75,5.1,0,.22],[.2,5.7,0,.03]],{radial:9,capStart:0})]),m:"skin"}]},mitt(){return[{g:ut(1,1.25,1.5,.9,0,1.1,0),m:"skin",fur:!0}]},none(){return[]}},Jx={plant:{pts:[[0,0,0],[.03,-.24,.035],[.05,-.5,.075],[.04,-.74,.005],[.03,-.97,-.03]],r:[1,1.08,.72,.84,.48],bulge:[1,3]},digi:{pts:[[0,0,0],[.03,-.2,.1],[.05,-.42,.16],[.04,-.62,-.02],[.03,-.8,-.12],[.03,-.97,-.03]],r:[1.1,1.2,.8,.62,.42,.4],bulge:[1]},pillar:{pts:[[0,0,0],[.01,-.3,.01],[.02,-.6,.02],[.02,-.9,0]],r:[1.15,1.1,.95,.95],bulge:[1]},arm:{pts:[[0,0,0],[.05,-.22,-.01],[.08,-.46,-.03],[.09,-.7,.04],[.09,-.93,.11]],r:[.95,1.02,.7,.74,.5],bulge:[1,3]},insect:{pts:[[0,0,0],[.28,.2,0],[.5,.32,0],[.72,-.15,.02],[.88,-.65,.03],[.93,-.95,.03]],r:[.75,.62,.5,.42,.3,.16],bulge:[]}};function Qc(n,e,t){return(i,s)=>{var C;let r=s.size,o=Jx[n],a=r*.105*i.thick*s.limbMul,c=Math.cos(i.splay),l=Math.sin(i.splay),h=Math.cos(i.swing),u=Math.sin(i.swing),p=o.pts.map(([T,A,P])=>{P*=i.bend,n==="insect"&&(A=A>0?A*i.bend:A);let b=T*c-A*l,v=T*l+A*c,L=v*h+P*u,V=-v*u+P*h;return s.root.clone().addScaledVector(s.out,b*r).addScaledVector(Vt,L*r).addScaledVector(s.fwd,V*r)}).map((T,A)=>({p:T,rx:o.r[A]*a*(o.bulge.includes(A)?i.muscle:1)})),g=n==="insect",_=jt(p,{radial:12,sub:6,ridges:g?5:0,ridgeAmp:.1}),f=[{g:_,m:"skin",fur:g?.5:.75}],d=_.userData.end,x=d.r*i.end,M=(C=i.endType)!=null?C:t;s.anchors&&e===Td&&s.anchors.push({p:d.p.clone(),t:d.t.clone(),r:d.r*i.end});let y;if(e===Ma)y=$c(s.out.clone().multiplyScalar(x),Vt.clone().multiplyScalar(x),s.fwd.clone().multiplyScalar(x),d.p);else{let T=d.t.clone(),A=ni(T,s.fwd),P=T.clone().cross(A);y=$c(P.multiplyScalar(x),T.multiplyScalar(x),A.multiplyScalar(x),d.p.clone().addScaledVector(d.t,-d.r*.4))}for(let T of e[M]())f.push({g:Md(T.g,y),m:T.m,fur:T.fur||0});return f}}function Kx(n,e){let t=e.size,i=[],s=n.curl,r=t*.085*n.thick*e.limbMul;for(let c=0;c<=9;c++){let l=c/9,h=.5*Math.pow(l,.8)+s*.16*Math.sin(l*5+e.seed)*l,u=-.8*Math.pow(l,1.25)+s*.22*l*l*Math.sin(l*6.5),m=.14*Math.sin(l*7+e.seed*2)*l*s,p=Math.cos(n.splay),g=Math.sin(n.splay);i.push({p:e.root.clone().addScaledVector(e.out,(h*p-u*g)*t).addScaledVector(Vt,(h*g+u*p)*t).addScaledVector(e.fwd,m*t),rx:r*(Math.pow(1-l,.75)*.94+.06)})}let o=jt(i,{radial:12,sub:5}),a=[{g:o,m:"skin"}];if(e.anchors&&e.anchors.push({p:o.userData.end.p.clone(),t:o.userData.end.t.clone(),r:r*.5}),n.suckers>.5){let c=new Bi(i.map(h=>h.p)),l=[];for(let h=3;h<22;h++){let u=h/22,m=c.getPoint(u),p=c.getTangent(u),g=r*(Math.pow(1-u,.75)*.94+.06),_=ni(p,e.out.clone().multiplyScalar(-1).add(se(0,-.6,0))),f=ut(g*.36,1,1,1,0,0,0,8);f.translate(m.x+_.x*g*.85,m.y+_.y*g*.85,m.z+_.z*g*.85),l.push(f)}a.push({g:Fe(l),m:"membrane"})}return a}function Kc(n){return(e,t)=>{let i=t.size,s=Math.cos(e.lift),r=Math.sin(e.lift),o=Math.cos(e.sweep),a=Math.sin(e.sweep),c=(h,u,m)=>{let p=h*s-u*r,g=h*r+u*s,_=p*o+m*a,f=-p*a+m*o;return t.root.clone().addScaledVector(t.out,_*i).addScaledVector(Vt,g*i).addScaledVector(t.fwd,f*i)},l=[];if(n==="bat"){let h=c(0,0,0),u=c(.33,.22,0),m=c(.6,.45,.06),p=[c(1.45,.5,-.1),c(1.25,-.02,-.38),c(.92,-.36,-.52),c(.55,-.45,-.55),c(.02,-.3,-.3)],g=[jt([{p:h,rx:i*.05},{p:u,rx:i*.036},{p:m,rx:i*.028}],{radial:8})],_=[];p.forEach((f,d)=>{if(d<4&&g.push(jt([{p:m,rx:i*.018},{p:m.clone().lerp(f,.5).addScaledVector(Vt,i*.03),rx:i*.013},{p:f,rx:i*.004}],{radial:6,capStart:0})),d>0){let x=[],M=[],y=d<4?m:u;for(let C=0;C<=8;C++){let T=C/8,A=p[d-1].clone().lerp(f,T);A.lerp(y,.2*Math.sin(T*un)),x.push(y),M.push(A)}_.push(ds(x,M))}}),_.push(ds([h,h,h],[u,p[4].clone().lerp(u,.5),p[4]])),_.push(ds([m,m],[u,p[4]])),g.push(Qt(m,c(.62,.62,.16),i*.02,{radial:5})),l.push({g:Fe(g),m:"skin"},{g:Fe(_),m:"membrane"})}else if(n==="feather"){let h=[c(0,0,0),c(.3,.16,.02),c(.62,.26,.06),c(.9,.2,.02)];l.push({g:jt(h.map((d,x)=>({p:d,rx:i*[.07,.06,.045,.03][x]})),{radial:8}),m:"skin",fur:!0});let u=new Bi(h),m=c(0,0,1).sub(c(0,0,0)).normalize(),p=[],g=[],_=(d,x,M,y,C,T)=>{let A=u.getPoint(d).addScaledVector(m,T*i),P=c(Math.sin(x),-Math.cos(x),-.18).sub(c(0,0,0)).normalize(),b=A.clone().addScaledVector(P,M*i);C.push(Cn([A,A.clone().lerp(b,.4),A.clone().lerp(b,.8),b],[y*i*.6,y*i,y*i*.9,y*i*.15],i*.006,m,{radial:6,sub:3}))},f=Math.round(e.feathers);for(let d=0;d<f;d++){let x=d/(f-1);_(.08+x*.92,hn(-.15,1.45,Math.pow(x,1.6)),hn(.5,.95,Math.sin(x*un*.62)),.062,p,-.004*(d%2)),_(.05+x*.9,hn(-.1,1.2,Math.pow(x,1.6)),hn(.28,.4,x),.07,g,.012)}l.push({g:Fe(p),m:"hair"},{g:Fe(g),m:"skin"})}else{let h=[];for(let[u,m,p]of[[.2,1,.17],[.85,.72,.2]]){let g=_=>c(Math.cos(u)*_*m,.04*_,-Math.sin(u)*_*m);h.push(Cn([g(0),g(.35),g(.75),g(1)],[.03*i,p*i*.8,p*i,.02*i],i*.004,Vt,{radial:6,sub:4}))}l.push({g:Fe(h),m:"glass"})}return l}}function vi(n){return(e,t)=>{let i=t.size,s=e.curl,r=t.normal,o=[],a=ni(r,Vt),c=f=>n==="stinger"?t.root.clone().addScaledVector(r,i*.42*Math.sin(f*2.7*Math.abs(s||1))).addScaledVector(a,i*.4*(1-Math.cos(f*2.7*Math.abs(s||1)))*Math.sign(s||1)):t.root.clone().addScaledVector(r,i*f*(1-.3*Math.abs(s)*f)).addScaledVector(a,i*s*.65*f*f),l=Math.min(t.r*.8,i*.22)*e.thick,h={thin:f=>i*.035*e.thick*(1-f*.7),thick:f=>l*Math.pow(1-f,.9)+i*.006,fluffy:f=>i*.1*e.thick*(.35+1*Math.sin(Math.min(f*1.25,1)*un*.8))*(f>.95?.5:1),club:f=>i*.05*e.thick*(1-f*.4),stinger:f=>i*.075*e.thick*(1-f*.45),fluke:f=>l*Math.pow(1-f,.7)*.9+i*.02,fishfin:f=>l*Math.pow(1-f,.7)*.9+i*.02,fan:f=>i*.05*(1-f*.5),tuft:f=>i*.03*e.thick*(1-f*.5)}[n],u=n==="fan"?.3:n==="fluke"||n==="fishfin"?.75:1,m=[];for(let f=0;f<=7;f++){let d=f/7;m.push({p:c(d*u),rx:Math.max(h(d),.003),ry:Math.max(h(d)*(n==="fishfin"?1.25:1),.003)})}let p=jt(m,{radial:12,sub:5,ridges:n==="stinger"?7:0,ridgeAmp:.12});o.push({g:p,m:"skin",fur:n==="fluffy"?1.6:n!=="stinger"&&n!=="fishfin"&&n!=="fluke"});let g=p.userData.end,_=g.t;if(n==="club"){let f=[];for(let d=0;d<12;d++){let x=se(Math.sin(d*2.4)*Math.sqrt(1-(d/11*2-1)**2),d/11*2-1,Math.cos(d*2.4)*Math.sqrt(1-(d/11*2-1)**2));f.push(Qt(g.p.clone().addScaledVector(x,i*.07),g.p.clone().addScaledVector(x,i*.17*e.tip),i*.03,{radial:6}))}o.push({g:Fe([fs(ut(i*.1*e.tip,1,1,1),g.p.x,g.p.y,g.p.z),...f]),m:"accent"})}else if(n==="stinger"){let f=g.p.clone().addScaledVector(_,i*.06);o.push({g:fs(ut(i*.075*e.tip,1,1,1),f.x,f.y,f.z),m:"skin"}),o.push({g:Qt(f.clone().addScaledVector(_,i*.04),f.clone().addScaledVector(_,i*.2*e.tip).addScaledVector(a,-i*.1*e.tip*Math.sign(s||1)),i*.035*e.tip),m:"accent"})}else if(n==="fluke"||n==="fishfin"){let f=n==="fluke"?t.out:a,d=n==="fluke"?a:t.out,x=[];for(let M of[-1,1]){let y=g.p.clone().addScaledVector(_,-i*.08),C=g.p.clone().addScaledVector(_,i*.3*e.tip).addScaledVector(f,M*i*.36*e.tip);x.push(Cn([y,y.clone().lerp(C,.45).addScaledVector(_,i*.05),y.clone().lerp(C,.8),C],[i*.03,i*.11*e.tip,i*.08*e.tip,i*.01],i*.012,d,{radial:8}))}o.push({g:Fe(x),m:n==="fluke"?"skin":"membrane"})}else if(n==="fan"){let f=[],d=Math.round(e.count);for(let x=0;x<d;x++){let M=(x/(d-1)-.5)*e.spread*2,y=_.clone().multiplyScalar(Math.cos(M)).addScaledVector(t.out,Math.sin(M)).addScaledVector(a,s*.2).normalize(),C=g.p.clone().addScaledVector(y,i*(.8+.2*Math.cos(M*1.5)));f.push(Cn([g.p.clone().addScaledVector(_,-i*.1),g.p.clone().lerp(C,.4),g.p.clone().lerp(C,.82),C],[i*.02,i*.055,i*.07,i*.02],i*.005,a,{radial:6,sub:3}))}o.push({g:Fe(f),m:"hair"})}else if(n==="tuft"){let f=[];for(let d=0;d<14;d++){let x=_.clone().add(se(Math.sin(d*2.4),Math.cos(d*1.7),Math.sin(d*.9)).multiplyScalar(.55)).normalize(),M=g.p.clone().addScaledVector(x,i*.24*e.tip);f.push(Cn([g.p.clone(),g.p.clone().lerp(M,.5),M],[i*.02,i*.035*e.tip,i*.004],i*.012,ni(x,Vt),{radial:6,sub:3}))}o.push({g:Fe(f),m:"hair"})}return o}}function ba(n){return(e,t)=>{let i=Math.round(e.count),s=[],r=[],o=[],a=[];for(let l=0;l<i;l++){let h=i===1?.5:l/(i-1),u=Vn(t.part.u+(h-.5)*e.span,-.6,1.6),m=sr(t.frames,u,t.a),p=t.size*Math.pow(Math.sin((h*.84+.08)*un),.7),g=m.normal,_=m.tangent.clone().multiplyScalar(-1),f=m.pos.clone().addScaledVector(g,-p*.12);if(n==="spikes")s.push(Qt(f,m.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean),p*.2,{radial:7}));else if(n==="plates"){let d=m.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean);s.push(Cn([f,f.clone().lerp(d,.45),f.clone().lerp(d,.8),d],[p*.3,p*.42,p*.3,p*.03],p*.05,ni(g,m.tangent.clone().cross(g)),{radial:8}))}else if(n==="mane")for(let d=0;d<3;d++){let x=ni(g,Rn).multiplyScalar((d-1)*.7+(t.rnd()-.5)*.4),M=g.clone().add(x).addScaledVector(_,e.lean).normalize(),y=f.clone().addScaledVector(M,p*.45),C=y.clone().addScaledVector(M,p*.3).addScaledVector(Vt,-p*.45*e.droop).addScaledVector(x,p*.3);r.push(Cn([f,y,C],[p*.09,p*.11,p*.01],p*.025,ni(M,_),{radial:6,sub:3}))}else{let d=m.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean);s.push(Qt(f,d,p*.035,{radial:5})),o.push(f.clone().lerp(d,.94)),a.push(f)}}let c=[];if(s.length&&c.push({g:Fe(s),m:"accent"}),n==="mane"&&c.push({g:Fe(r),m:"hair"}),o.length>1){let l=[],h=[];for(let u=0;u<o.length-1;u++)for(let m=0;m<4;m++){let p=m/4,g=Vn(t.part.u+((u+p)/(i-1)-.5)*e.span,-.6,1.6);l.push(sr(t.frames,g,t.a).pos),h.push(o[u].clone().lerp(o[u+1],p).lerp(l[l.length-1],.12*Math.sin(p*un)))}l.push(a[i-1]),h.push(o[i-1]),c.push({g:ds(l,h),m:"membrane"})}return c}}var eh={thick:[.4,2.2,1,"Thickness"],muscle:[.7,1.6,1,"Muscle"],splay:[-.3,1.3,.05,"Spread"],swing:[-1.4,1.4,0,"Swing"],yaw:[-1.6,1.6,0,"Turn"],bend:[-.5,2.5,1,"Bend"],end:[.5,2.2,1,"Foot size"]},jx={...eh,end:[.5,2.2,1,"Hand size"]},Ad=["human","paw","hoof","talon","webbed","stump","point","none"],Qx=["human","claw","pincer","mitt","none"],ps={thick:[.3,2.5,1,"Thickness"],curl:[-1.2,1.2,.2,"Curl"]},or=(n,e,t,i={})=>({n,cat:"limbs",kind:"world",slot:"leg",rel:1,mirror:!0,P:eh,C:{endType:Ad},D:{endType:t,...i},build:Qc(e,Ma,t)}),jc=(n,e,t={})=>({n,cat:"limbs",kind:"world",slot:"arm",rel:.85,mirror:!0,P:jx,C:{endType:Qx},D:{endType:e,...t},build:Qc("arm",Td,e)}),ms=(n,e,t={})=>({n,cat:"eyes",kind:"surface",slot:"eye",size:.55,mirror:!0,P:e==="compound"||e==="beady"?{}:Fx,build:Nx(e),...t}),zi={len:[.4,2.5,1,"Length"],curve:[-1.5,2,1,"Curve"]},Ct={eye_round:ms("Round eye","round"),eye_cat:ms("Slit eye","cat"),eye_goat:ms("Bar-pupil eye","goat"),eye_glow:ms("Glowing eye","glow"),eye_beady:ms("Beady eye","beady",{size:.3}),eye_compound:ms("Compound eye","compound",{size:.8}),eye_stalk:ms("Stalk eye","stalk",{size:.45}),muzzle:{n:"Muzzle",cat:"mouth",kind:"surface",slot:"mouth",size:1.25,P:{len:[.3,2.5,1,"Length"],open:[0,1,.15,"Open"],teeth:[0,3,1,"Teeth"]},build:kx},beak:{n:"Beak",cat:"mouth",kind:"surface",slot:"mouth",size:1.2,P:{len:[.4,3.5,1,"Length"],hook:[0,1.5,.5,"Hook"],open:[0,1,.1,"Open"]},build:Ox},mandibles:{n:"Mandibles",cat:"mouth",kind:"surface",slot:"mouth",size:1.2,P:{len:[.5,2,1,"Length"],open:[0,1,.3,"Open"]},build:Bx},maw:{n:"Round maw",cat:"mouth",kind:"surface",slot:"mouth",size:1.1,P:{teeth:[.3,2.5,1,"Teeth"],count:[5,18,11,"Tooth count"]},build:zx},lips:{n:"Lips",cat:"mouth",kind:"surface",slot:"mouth",size:.85,P:{full:[.3,2,1,"Fullness"],smile:[-1,1,.25,"Frown / smile"]},build:Hx},trunk:{n:"Trunk",cat:"mouth",kind:"surface",slot:"mouth",size:.9,P:{len:[.4,2,1,"Length"],curl:[-1,1.5,.4,"Curl"]},build:Vx},feelers:{n:"Face feelers",cat:"mouth",kind:"surface",slot:"mouth",size:1.1,P:{len:[.4,2.5,1,"Length"],count:[2,8,4,"Count"]},build:Gx},nose:{n:"Nose",cat:"mouth",kind:"surface",slot:"nose",size:.55,P:{len:[.4,2.2,1,"Length"],wide:[.5,1.8,1,"Width"]},build:Wx},whiskers:{n:"Whiskers",cat:"mouth",kind:"surface",slot:"cheek",size:.9,mirror:!0,P:{len:[.4,2,1,"Length"]},build:Yx},tusk:{n:"Tusk",cat:"mouth",kind:"surface",slot:"cheek",size:.7,mirror:!0,orn:!0,P:zi,build:rr("tusk")},beard:{n:"Beard",cat:"mouth",kind:"surface",slot:"chin",size:.9,P:{len:[.3,3,1,"Length"],count:[6,60,26,"Thickness"]},build:Jc({count:26,spread:.7,droop:1,width:.11,capR:.6})},ear_point:{n:"Pointed ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:qr("point")},ear_round:{n:"Round ear",cat:"ears",kind:"surface",slot:"ear",size:.9,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:qr("round")},ear_long:{n:"Long ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:qr("long")},ear_floppy:{n:"Floppy ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:qr("floppy")},ear_elf:{n:"Swept ear",cat:"ears",kind:"surface",slot:"earSide",size:.75,mirror:!0,P:{len:[.2,2.5,.6,"Length"],wide:[.4,2,1,"Width"]},build:qr("elf")},ear_fin:{n:"Fin ear",cat:"ears",kind:"surface",slot:"earSide",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"]},build:Xx},horn_spike:{n:"Spike horn",cat:"horns",kind:"surface",slot:"horn",size:.7,mirror:!0,orn:!0,P:zi,build:rr("spike")},horn_curved:{n:"Curved horn",cat:"horns",kind:"surface",slot:"horn",size:.75,mirror:!0,orn:!0,P:zi,build:rr("curved")},horn_ram:{n:"Ram horn",cat:"horns",kind:"surface",slot:"horn",size:.8,mirror:!0,orn:!0,P:zi,build:rr("ram")},antler:{n:"Antler",cat:"horns",kind:"surface",slot:"horn",size:.7,mirror:!0,orn:!0,P:{...zi,tines:[1,6,3,"Tines"]},build:rr("antler")},antenna:{n:"Antenna",cat:"horns",kind:"surface",slot:"horn",size:1.2,mirror:!0,P:zi,build:Ed(!1)},antenna_feather:{n:"Feathery antenna",cat:"horns",kind:"surface",slot:"horn",size:1.2,mirror:!0,orn:!0,P:zi,build:Ed(!0)},crest:{n:"Feather crest",cat:"horns",kind:"surface",slot:"top",size:1.3,orn:!0,P:{len:[.3,3,1,"Length"],count:[3,30,9,"Feathers"],spread:[.1,1.4,.45,"Spread"],droop:[0,1,.1,"Droop"]},build:Jc({count:9,spread:.45,droop:.1,width:.12,capR:.3})},hair:{n:"Hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.15,2.5,.7,"Length"],count:[20,200,110,"Thickness"],spread:[.5,1.9,1.45,"Coverage"],droop:[0,1,.85,"Droop"]},build:Jc({count:110,spread:1.45,droop:.85,width:.085,capR:.5,hug:!0})},leg_human:or("Walker leg","plant","human"),leg_beast:or("Beast leg","digi","paw"),leg_hoof:or("Hoofed leg","digi","hoof",{thick:.8}),leg_bird:or("Taloned leg","digi","talon",{thick:.6,end:1.3}),leg_frog:or("Webbed leg","plant","webbed",{bend:2,end:1.3}),leg_pillar:or("Pillar leg","pillar","stump",{thick:1.5}),leg_insect:{n:"Jointed leg",cat:"limbs",kind:"world",slot:"leg",rel:1.25,mirror:!0,radial:!0,P:{...eh,thick:[.3,2.2,.55,"Thickness"]},C:{endType:Ad},D:{endType:"point",thick:.55,splay:0},build:Qc("insect",Ma,"point")},arm_human:jc("Arm with hand","human"),arm_claw:jc("Clawed arm","claw"),arm_pincer:jc("Pincer arm","pincer",{splay:.5,swing:.9}),tentacle:{n:"Tentacle",cat:"limbs",kind:"world",slot:"arm",rel:1.3,mirror:!0,radial:!0,P:{thick:[.4,2.2,1,"Thickness"],curl:[0,2,1,"Wiggle"],splay:[-.6,1.4,.1,"Spread"],yaw:[-1.6,1.6,0,"Turn"],suckers:[0,1,1,"Suckers"]},build:Kx},wing_feather:{n:"Feathered wing",cat:"wings",kind:"world",slot:"wing",rel:1.3,mirror:!0,P:{lift:[-1.2,1.3,.25,"Lift"],sweep:[-.6,1.4,.3,"Sweep"],feathers:[5,16,11,"Feathers"]},build:Kc("feather")},wing_bat:{n:"Skin wing",cat:"wings",kind:"world",slot:"wing",rel:1.3,mirror:!0,P:{lift:[-1.2,1.3,.3,"Lift"],sweep:[-.6,1.4,.25,"Sweep"]},build:Kc("bat")},wing_insect:{n:"Glass wing",cat:"wings",kind:"world",slot:"wing",rel:1.2,mirror:!0,P:{lift:[-1.2,1.3,.35,"Lift"],sweep:[-.6,1.4,.2,"Sweep"]},build:Kc("insect")},fin_dorsal:{n:"Back fin",cat:"wings",kind:"surface",slot:"back",size:1.3,P:{len:[.4,2.5,1,"Height"],sweep:[-.5,2,1,"Sweep"]},build:Zx},fin_side:{n:"Flipper",cat:"wings",kind:"surface",slot:"arm",size:1.5,mirror:!0,P:{len:[.4,2.5,1,"Length"],sweep:[-.5,2,1,"Sweep"]},build:$x},tail_thin:{n:"Whip tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:ps,build:vi("thin")},tail_thick:{n:"Heavy tail",cat:"tails",kind:"world",slot:"tail",rel:1.2,P:ps,build:vi("thick")},tail_fluffy:{n:"Bushy tail",cat:"tails",kind:"world",slot:"tail",rel:.9,P:ps,build:vi("fluffy")},tail_tuft:{n:"Tufted tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:{...ps,tip:[.4,2.5,1,"Tuft size"]},build:vi("tuft")},tail_club:{n:"Club tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:{...ps,tip:[.4,2.5,1,"Club size"]},build:vi("club")},tail_stinger:{n:"Stinger tail",cat:"tails",kind:"world",slot:"tail",rel:1.3,P:{thick:[.3,2.5,1,"Thickness"],curl:[-1.2,1.2,1,"Curl"],tip:[.4,2.5,1,"Stinger size"]},build:vi("stinger")},tail_fluke:{n:"Fluke tail",cat:"tails",kind:"world",slot:"tail",rel:.9,P:{...ps,tip:[.4,2.5,1,"Fluke size"]},D:{curl:0},build:vi("fluke")},tail_fish:{n:"Fish tail",cat:"tails",kind:"world",slot:"tail",rel:.8,P:{...ps,tip:[.4,2.5,1,"Fin size"]},D:{curl:0},build:vi("fishfin")},tail_fan:{n:"Feather fan",cat:"tails",kind:"world",slot:"tail",rel:.8,orn:!0,P:{curl:[-1.2,1.5,.3,"Lift"],count:[3,21,9,"Feathers"],spread:[.1,1.5,.6,"Spread"]},build:vi("fan")},ridge_spikes:{n:"Spike row",cat:"back",kind:"world",slot:"back",rel:.22,ridge:!0,P:{count:[1,24,9,"Count"],span:[.05,1.6,.6,"Row length"],lean:[-1,1.5,.3,"Lean"]},build:ba("spikes")},ridge_plates:{n:"Plate row",cat:"back",kind:"world",slot:"back",rel:.3,ridge:!0,P:{count:[1,20,8,"Count"],span:[.05,1.6,.6,"Row length"],lean:[-1,1.5,.1,"Lean"]},build:ba("plates")},ridge_sail:{n:"Sail",cat:"back",kind:"world",slot:"back",rel:.45,ridge:!0,P:{count:[3,20,9,"Spines"],span:[.05,1.6,.55,"Row length"],lean:[-1,1.5,.2,"Lean"]},build:ba("sail")},ridge_mane:{n:"Mane",cat:"back",kind:"world",slot:"mane",rel:.4,ridge:!0,orn:!0,P:{count:[3,30,14,"Thickness"],span:[.05,1.6,.3,"Row length"],lean:[-1,1.5,.5,"Sweep"],droop:[0,2,1,"Droop"]},build:ba("mane")},spike:{n:"Single spike",cat:"back",kind:"surface",slot:"back",size:.5,P:zi,build:rr("spike")},shell:{n:"Shell",cat:"back",kind:"surface",slot:"back",size:2.4,P:{dome:[.2,1.5,.55,"Dome"],long:[.6,2.2,1.35,"Length"]},build:qx}},Sa=[["eyes","Eyes"],["mouth","Mouth"],["ears","Ears"],["horns","Head"],["limbs","Limbs"],["wings","Wings"],["tails","Tails"],["back","Back"]];function wa(n){let e=Ct[n],t={};for(let[i,s]of Object.entries(e.P||{}))t[i]=s[2];return Object.assign(t,e.D||{})}var kt=Math.PI,Hi=n=>({base:"#c9b08a",second:"#6b4a2e",belly:"#efe2c8",bellyAmt:.8,pattern:0,patScale:1,cover:"skin",furLen:.3,furDroop:.3,accent:"#e8e0cc",hair:"#3b2a1e",membrane:"#c98a8a",eye:"#3f8f4a",...n}),Et={humanoid:{name:"Humanoid",blurb:"Upright, two arms, two legs",limbLen:.9,bellyDir:[0,-.2,1],dimorph:"std",capS:.55,nodes:[[.93,-.012,.15,.1,"hips"],[1.03,-.01,.16,.105,"hips"],[1.17,0,.118,.088,"waist"],[1.33,.012,.15,.115,"chest"],[1.45,.005,.17,.105,"shoulders"],[1.505,0,.13,.085,"shoulders"],[1.55,0,.06,.058,"neck"],[1.615,.008,.058,.058,"neck"],[1.68,.02,.098,.105,"head"],[1.76,.025,.115,.125,"head"],[1.83,.02,.105,.115,"head"]],slots:{eye:[.9,2.8],mouth:[.812,kt],nose:[.862,kt],cheek:[.83,2.45],chin:[.79,kt],ear:[1.35,1.1],earSide:[.885,1.57],horn:[1.4,2.1],top:[1.85,0],leg:[-.4,1.57],arm:[.43,1.57],wing:[.4,.45],tail:[.03,0],back:[.3,0],mane:[.6,0]},look:Hi({base:"#c99573",second:"#8a5a3c",belly:"#d9a888",bellyAmt:.4,hair:"#2c1b12",eye:"#4a7fb5"}),parts:[["leg_human","leg",{size:.9}],["arm_human","arm",{size:.74,p:{splay:.12}}],["eye_round","eye",{size:.046,p:{lid:.35}}],["nose","nose",{size:.055}],["lips","mouth",{size:.085}],["ear_elf","earSide",{size:.075,p:{len:.25}}],["hair","top",{size:.26}]]},quadruped:{name:"Quadruped",blurb:"Four legs, tail, muzzle",limbLen:.85,bellyDir:[0,-1,0],dimorph:"std",nodes:[[.95,-.62,.15,.17,"hips"],[.98,-.36,.2,.23,"hips"],[.96,0,.195,.235,"waist"],[.99,.34,.21,.27,"chest"],[1.06,.55,.17,.22,"shoulders"],[1.25,.74,.115,.135,"neck"],[1.39,.9,.125,.13,"head"],[1.38,1.03,.105,.105,"head"]],slots:{eye:[.93,.95],mouth:[1.85,kt],nose:[1.9,0],cheek:[1.35,1.9],chin:[.95,kt],ear:[.85,.6],earSide:[.86,1.2],horn:[.9,.3],top:[.86,0],leg:[.3,2.1],arm:[.56,1.5],wing:[.5,.55],tail:[-.8,0],back:[.35,0],mane:[.68,0]},look:Hi({base:"#b9773a",second:"#3a2616",belly:"#f3e6d0",cover:"fur",furLen:.3,pattern:5,hair:"#3a2616",eye:"#d9a020"}),parts:[["leg_beast",[.12,2.1],{size:.84}],["leg_beast",[.53,2.1],{size:.86,p:{bend:.45,thick:.9}}],["muzzle","mouth"],["eye_cat","eye"],["ear_point","ear"],["tail_fluffy","tail",{p:{curl:-.35}}],["whiskers","cheek"]]},avian:{name:"Avian",blurb:"Wings, beak, talons",limbLen:.7,bellyDir:[0,-.8,.6],dimorph:"std",nodes:[[.76,-.32,.07,.07,"hips"],[.8,-.1,.17,.17,"hips"],[.92,.1,.19,.2,"chest"],[1.1,.22,.12,.125,"neck"],[1.3,.26,.075,.075,"neck"],[1.42,.3,.1,.1,"head"],[1.44,.38,.085,.085,"head"]],slots:{eye:[.9,1.25],mouth:[1.85,kt],nose:[1.8,0],cheek:[1.2,1.9],chin:[.85,kt],ear:[.86,.6],earSide:[.86,1.2],horn:[.92,.5],top:[.9,0],leg:[.22,2.35],arm:[.36,1.5],wing:[.38,.85],tail:[-.85,0],back:[.25,0],mane:[.55,0]},look:Hi({base:"#2f7fc2",second:"#f2c230",belly:"#f4f0e6",cover:"fur",furLen:.12,pattern:5,accent:"#e8a020",hair:"#1f4f9a",eye:"#e8a020"}),parts:[["leg_bird","leg",{size:.74}],["wing_feather","wing",{size:.95}],["beak","mouth"],["eye_round","eye",{p:{lid:.15}}],["crest","top",{sexOnly:null}],["tail_fan","tail",{size:.6}]]},insectoid:{name:"Insectoid",blurb:"Six legs, antennae, chitin",limbLen:.72,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[.5,-.78,.1,.1,"abdomen"],[.56,-.5,.26,.24,"abdomen"],[.53,-.2,.2,.18,"abdomen"],[.5,-.02,.07,.07,"waist"],[.55,.15,.16,.15,"chest"],[.56,.38,.15,.14,"chest"],[.56,.5,.06,.06,"neck"],[.58,.62,.14,.13,"head"],[.56,.74,.1,.1,"head"]],slots:{eye:[.93,1.1],mouth:[1.8,kt],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,kt],ear:[.9,.8],earSide:[.9,1.3],horn:[.97,.45],top:[.9,0],leg:[.56,2],arm:[.64,1.7],wing:[.56,.5],tail:[-.9,0],back:[.15,0],mane:[.55,0]},look:Hi({base:"#2f6b3a",second:"#12281a",belly:"#9fb86a",bellyAmt:.5,cover:"chitin",pattern:7,accent:"#1c1a14",membrane:"#bfe8e0",eye:"#b03020"}),parts:[["leg_insect",[.47,2],{size:.72,p:{yaw:-.7}}],["leg_insect",[.56,2],{size:.68,p:{yaw:0}}],["leg_insect",[.64,2],{size:.7,p:{yaw:.75}}],["eye_compound","eye"],["mandibles","mouth",{size:.13}],["antenna","horn"],["wing_insect","wing",{size:.95}]]},arachnid:{name:"Arachnid",blurb:"Eight legs, many eyes",limbLen:1,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[.62,-.62,.14,.14,"abdomen"],[.7,-.36,.32,.3,"abdomen"],[.6,-.08,.2,.18,"abdomen"],[.5,.05,.08,.07,"waist"],[.5,.25,.22,.15,"chest"],[.5,.45,.17,.12,"head"],[.48,.55,.1,.08,"head"]],slots:{eye:[1.3,.6],mouth:[1.85,kt],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,kt],ear:[.9,.8],earSide:[.9,1.3],horn:[.9,.45],top:[.85,0],leg:[.7,1.9],arm:[.85,1.7],wing:[.66,.5],tail:[-.9,0],back:[.18,0],mane:[.5,0]},look:Hi({base:"#3a2a22",second:"#c8501c",belly:"#5a463a",bellyAmt:.4,cover:"fur",furLen:.1,pattern:7,accent:"#14100e",eye:"#a01818"}),parts:[["leg_insect",[.6,1.9],{size:1,p:{yaw:-1}}],["leg_insect",[.66,1.9],{size:.9,p:{yaw:-.35}}],["leg_insect",[.72,1.9],{size:.9,p:{yaw:.3}}],["leg_insect",[.78,1.9],{size:1.05,p:{yaw:.95}}],["eye_beady",[1.35,.5],{size:.045}],["eye_beady",[1.3,1.15],{size:.03}],["eye_beady",[.97,.5],{size:.032}],["eye_beady",[.95,1],{size:.026}],["mandibles","mouth",{size:.12}]]},cephalopod:{name:"Cephalopod",blurb:"Soft mantle, eight tentacles",limbLen:1.1,bellyDir:[0,-.5,-.8],dimorph:"reverse",nodes:[[1.78,-.52,.07,.07,"abdomen"],[1.56,-.38,.24,.22,"abdomen"],[1.26,-.2,.3,.28,"abdomen"],[.97,-.05,.215,.215,"waist"],[.77,.02,.225,.215,"head"],[.62,.05,.19,.19,"head"]],slots:{eye:[.86,1.4],mouth:[2,0],nose:[.8,0],cheek:[.9,.8],chin:[1.2,0],ear:[.7,1.2],earSide:[.7,1.5],horn:[.72,.6],top:[.3,kt],leg:[1.45,1.57],arm:[1.45,1],wing:[.3,1.57],tail:[-.9,0],back:[.3,kt],mane:[.4,kt]},look:Hi({base:"#c4472e",second:"#f0b090",belly:"#f2d6c4",bellyAmt:.7,cover:"slime",pattern:2,patScale:1.6,membrane:"#f2c4b0",eye:"#e0b030"}),parts:[["tentacle",[1.45,.38],{size:1.15}],["tentacle",[1.45,1.15],{size:1.05}],["tentacle",[1.45,1.95],{size:1.05}],["tentacle",[1.45,2.75],{size:1.15}],["eye_goat","eye",{p:{lid:.2}}]]},serpent:{name:"Serpent",blurb:"Long limbless body",limbLen:.5,bellyDir:[0,-1,0],dimorph:"std",nodes:[[.05,-1.75,.025,.025,"tail"],[.09,-1.35,.07,.07,"tail"],[.11,-.9,.1,.1,"hips"],[.12,-.4,.115,.115,"waist"],[.13,.1,.12,.12,"waist"],[.22,.5,.115,.115,"chest"],[.56,.74,.105,.105,"neck"],[.9,.8,.095,.1,"neck"],[1.09,.93,.125,.1,"head"],[1.07,1.1,.1,.075,"head"]],slots:{eye:[.96,.95],mouth:[1.8,kt],nose:[1.8,0],cheek:[1.2,1.9],chin:[.97,kt],ear:[.92,.7],earSide:[.92,1.3],horn:[.95,.45],top:[.93,0],leg:[.45,2.1],arm:[.72,1.7],wing:[.68,.6],tail:[-.9,0],back:[.5,0],mane:[.8,0]},look:Hi({base:"#4f8a3a",second:"#1f3a1c",belly:"#e6dfa0",cover:"scales",pattern:1,eye:"#e8c020"}),parts:[["muzzle","mouth",{size:.13,p:{len:.7,teeth:1.8,open:.35}}],["eye_cat","eye",{size:.05}],["ridge_spikes",[.6,0],{size:.07,p:{count:16,span:.7}}]]},aquatic:{name:"Aquatic",blurb:"Fins, flippers, fish tail",limbLen:.5,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[1,-1,.03,.07,"tail"],[1,-.6,.08,.15,"tail"],[1,-.1,.17,.26,"abdomen"],[1.02,.35,.19,.28,"chest"],[1,.7,.15,.2,"head"],[.98,.95,.09,.11,"head"]],slots:{eye:[.9,1.15],mouth:[1.75,kt],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,kt],ear:[.85,.7],earSide:[.85,1.3],horn:[.9,.45],top:[.85,0],leg:[.4,2.3],arm:[.64,2],wing:[.5,.6],tail:[-.8,0],back:[.52,0],mane:[.7,0]},look:Hi({base:"#3a7f9a",second:"#1c3f5a",belly:"#eef2f0",cover:"scales",pattern:5,membrane:"#7fc4d0",eye:"#e8e0a0"}),parts:[["muzzle","mouth",{size:.13,p:{len:.45,teeth:1.6,open:.3}}],["eye_round","eye",{size:.06,p:{lid:0}}],["fin_dorsal","back",{size:.32}],["fin_side","arm",{size:.3}],["tail_fish","tail",{size:.5,p:{tip:1.3}}]]}};var ey=1,ty=()=>"p"+ey+++Math.random().toString(36).slice(2,6),ny={std:{m:{roles:{shoulders:[.16,.08],chest:[.1,.05],neck:[.2,.16],waist:[.04,.02],head:[.03,.03]},limb:.15,orn:.3,all:.03},f:{roles:{shoulders:[-.1,-.05],chest:[-.04,.07],waist:[-.14,-.08],hips:[.13,.07],neck:[-.13,-.1]},limb:-.1,orn:-.4,all:-.02}},reverse:{m:{roles:{abdomen:[-.12,-.12],head:[.05,.05]},limb:-.05,orn:.35,all:-.05},f:{roles:{abdomen:[.2,.18]},limb:.05,orn:-.3,all:.04}}};function Cd(n){let e=ny[Et[n.type].dimorph][n.sex],t=n.dimorph;return{roles:e.roles,k:t,limb:1+e.limb*t,orn:1+e.orn*t,all:1+e.all*t}}function gs(n){let e=Et[n],t={v:1,name:"New "+e.name,type:n,sex:"f",dimorph:.7,bulk:1,stretch:1,nodes:e.nodes.map(s=>({y:s[0],z:s[1],rx:s[2],ry:s[3],role:s[4]})),look:{...e.look},parts:[]},i=Ea(t,{sexless:!0}).userData.frames;for(let[s,r,o]of e.parts)ii(t,s,i,typeof r=="string"?e.slots[r]:r,o);return t}function ii(n,e,t,i,s={}){let r=Ct[e],o=Et[n.type],[a,c]=i||o.slots[r.slot]||o.slots.back;for(;!i&&n.parts.some(u=>Math.abs(u.u-a)<.02&&Math.abs(u.a-c)<.05&&Ct[u.kind].cat===r.cat);)a-=.07;let l=sr(t,a,c),h={id:ty(),kind:e,u:a,a:c,mirror:!!r.mirror,rot:0,tilt:0,sexOnly:null,size:r.kind==="surface"?r.size*l.r:r.rel*(r.ridge?Math.max(l.r,.08)*4.5:o.limbLen),p:wa(e)};s.p&&Object.assign(h.p,s.p);for(let u of["size","rot","tilt","sexOnly","mirror"])s[u]!==void 0&&(h[u]=s[u]);return n.parts.push(h),h}function Ea(n,e={}){var o;let t=Cd(n),i=n.nodes.reduce((a,c)=>a+c.y,0)/n.nodes.length,s=n.nodes.reduce((a,c)=>a+c.z,0)/n.nodes.length,r=n.nodes.map(a=>{let c=!e.sexless&&t.roles[a.role]||[0,0];return{p:se(0,i+(a.y-i)*n.stretch,s+(a.z-s)*n.stretch),rx:a.rx*n.bulk*(e.sexless?1:t.all)*(1+c[0]*t.k),ry:a.ry*n.bulk*(e.sexless?1:t.all)*(1+c[1]*t.k)}});return jt(r,{radial:40,sub:9,capRings:7,side:Rn.clone(),frames:!0,capStart:(o=Et[n.type].capS)!=null?o:1})}function Rd(n,e,t){let i=new Map;for(let r of n){if(!r||!r.g)continue;let o=typeof r.m=="string"?e[r.m]:r.m,a=o.uuid+(r.fur||0);i.has(a)||i.set(a,{mat:o,fur:r.fur,gs:[]}),i.get(a).gs.push(r.g)}let s=[];for(let r of i.values()){let o=new Le(Fe(r.gs),r.mat);o.userData.fur=r.mat===e.skin?r.fur===!0?1:r.fur||0:0,s.push(o)}return s}function th(n){let e=(n.a%(2*Math.PI)+2*Math.PI)%(2*Math.PI);return n.mirror?(e>Math.PI&&(e=2*Math.PI-e),e<.1?{a:0,mirrored:!1}:e>Math.PI-.1?{a:Math.PI,mirrored:!1}:{a:e,mirrored:!0}):{a:e,mirrored:!1}}function Pd(n,e,t,i,s){let r=Ct[e.kind],o=Cd(n),a=new vt;if(a.userData.partId=e.id,e.sexOnly&&e.sexOnly!==n.sex)return a;let{a:c,mirrored:l}=th(e),h=sr(t,e.u,c),u=[...e.id].reduce((f,d)=>f*31+d.charCodeAt(0)|0,7),m={M:i,look:n.look,female:n.sex==="f",k:o.k,limbMul:o.limb,rnd:Yr(u),seed:u%100/16,part:e,frames:t,a:c,r:h.r,normal:h.normal},p=r.orn?o.orn:1,g=s?[]:null;m.anchors=g;let _=new vt;if(a.userData.anchor=h.pos.clone(),r.kind==="surface"){let f=h.normal,d=Math.abs(f.y)<.9?Vt.clone():f.y>0?ir.clone().multiplyScalar(-1):ir.clone(),x=d.addScaledVector(f,-d.dot(f)).normalize(),M=x.clone().cross(f),y=new Kt().setFromRotationMatrix(new We().makeBasis(M,x,f));y.multiply(new Kt().setFromAxisAngle(ir,e.rot)).multiply(new Kt().setFromAxisAngle(Rn,-e.tilt));let C=y.clone().invert();m.down=se(0,-1,0).applyQuaternion(C),m.up=se(0,1,0).applyQuaternion(C),m.fwd=se(0,0,1).applyQuaternion(C);for(let T of Rd(r.build(e.p,m),i))_.add(T);_.quaternion.copy(y),_.position.copy(h.pos),_.scale.setScalar(e.size*p)}else{m.size=e.size*p;let f=e.p.yaw||0,d=Rn.clone();r.radial&&(d=se(h.normal.x,0,h.normal.z),d.lengthSq()<.01&&(d=Rn.clone()),d.normalize()),d.applyAxisAngle(Vt,-f),m.out=d,m.fwd=d.clone().cross(Vt).normalize(),m.root=r.ridge?h.pos:h.pos.clone().addScaledVector(h.normal,-h.r*(r.cat==="limbs"?.4:.25));for(let x of Rd(r.build(e.p,m),i))_.add(x)}if(a.add(_),g)for(let f of g)s.push(f),l&&s.push({p:f.p.clone().setX(-f.p.x),t:f.t.clone().setX(-f.t.x),r:f.r});if(l){let f=new vt;f.scale.x=-1,f.add(_.clone()),a.add(f)}return a}function ar(n,e,t={}){let i=new vt,s=Ea(n),r=s.userData.frames,o=new Le(s,e.skin);o.userData.fur=1,o.userData.partId="body",i.add(o);let a={group:i,body:o,frames:r,parts:new Map,shells:new vt,data:n,M:e};for(let c of n.parts){let l;try{l=Pd(n,c,r,e,t.anchors)}catch(h){console.error("part failed",c.kind,h),l=new vt,l.userData.partId=c.id}a.parts.set(c.id,l),i.add(l)}return i.add(a.shells),Zr(a),a}function Ta(n,e){let t=n.parts.get(e.id);t&&(n.group.remove(t),Vi(t));let i=Pd(n.data,e,n.frames,n.M);return n.parts.set(e.id,i),n.group.add(i),i}function Zr(n,e){for(let i of[...n.shells.children])n.shells.remove(i);if(n.shellGeo&&(n.shellGeo.dispose(),n.shellGeo=null),n.data.look.cover!=="fur")return;n.group.updateMatrixWorld(!0);let t=[];if(n.group.traverse(i=>{if(!i.isMesh||!i.userData.fur)return;let s=i,r=!1;for(;s;)e&&s.userData.partId===e&&(r=!0),s=s.parent;if(r)return;let o=i.geometry.clone().applyMatrix4(i.matrixWorld);i.matrixWorld.determinant()<0&&Sd(o),o.setAttribute("fur",new wt(new Float32Array(o.attributes.position.count).fill(i.userData.fur),1)),t.push(o)}),!!t.length){n.shellGeo=Fe(t,["fur"]),t.forEach(i=>i!==n.shellGeo&&i.dispose());for(let i=0;i<ya;i++){let s=new Le(n.shellGeo,n.M.shells[i]);s.raycast=()=>{},n.shells.add(s)}}}function Vi(n){n.traverse(e=>{e.isMesh&&e.geometry.dispose()})}function $r(n){let e=new Mn;return n.group.updateMatrixWorld(!0),n.group.traverse(t=>{t.isMesh&&t.parent!==n.shells&&(t.geometry.computeBoundingBox(),e.union(t.geometry.boundingBox.clone().applyMatrix4(t.matrixWorld)))}),e}var Id={muzzle:n=>{var e;return 5+2.5*((e=n.teeth)!=null?e:1)},beak:n=>{var e;return 6+1.5*((e=n.hook)!=null?e:.5)},mandibles:()=>7,maw:n=>{var e;return 4+2.5*((e=n.teeth)!=null?e:1)},trunk:()=>3,feelers:()=>2,lips:()=>1,tusk:()=>5,horn_spike:()=>4,horn_curved:()=>5,horn_ram:()=>6,antler:()=>5,tentacle:()=>3,tail_club:()=>7,tail_stinger:()=>5,tail_thick:()=>3,spike:()=>2},iy={claw:4,talon:4,pincer:6,paw:2.5,hoof:3,human:3,point:2.5,webbed:2,stump:2.5,mitt:1.5,none:0},sy=[1,.6,.4,.3,.2,.15],bi=(n,e,t)=>Math.min(t,Math.max(e,n));function lr(n){var T,A;let e=0;for(let P=0;P<n.nodes.length-1;P++){let b=n.nodes[P],v=n.nodes[P+1];e+=Math.hypot(b.y-v.y,b.z-v.z)*Math.PI*((b.rx+v.rx)/2)*((b.ry+v.ry)/2)}let t=Math.cbrt(e*n.bulk*n.bulk),i=n.parts.filter(P=>!P.sexOnly||P.sexOnly===n.sex),s=P=>P.mirror&&Math.abs(Math.sin(P.a))>.1?1.25:1,r=[],o=0,a=0,c=0,l=0,h=0,u=0,m=0,p=0,g=0,_=!1,f=!1,d=!1,x=!1,M=0;for(let P of i){let b=P.kind;Id[b]&&r.push(Id[b](P.p)*s(P)),(P.p.endType!==void 0||b.startsWith("leg_")||b.startsWith("arm_"))&&r.push(((T=iy[P.p.endType])!=null?T:2)*s(P));let v=s(P)>1?2:1;b.startsWith("leg_")&&(o++,g+=v),b.startsWith("arm_")&&(p+=v),b==="tentacle"&&(p+=v,M+=v),b.startsWith("tail_")&&(_=!0),(b.startsWith("horn_")||b==="antler"||b==="tusk")&&(f=!0),["muzzle","beak","mandibles","maw","trunk","feelers","lips"].includes(b)&&(d=!0),["claw","talon","paw","pincer"].includes(P.p.endType)&&(x=!0),b==="feelers"&&(h+=1),b.startsWith("wing_")&&a++,b.startsWith("eye_")&&(c+=s(P)>1?2:1),b==="ridge_spikes"&&(l+=.12),b==="spike"&&(l+=.04),b==="tail_stinger"&&(h+=3),b==="mandibles"&&(h+=1),b==="shell"&&(u+=.15,m+=25),b==="ridge_plates"&&(u+=.08,m+=10)}r.sort((P,b)=>b-P);let y=7;r.forEach((P,b)=>{var v;y+=P*((v=sy[b])!=null?v:.1)}),y*=.75+.6*t,u+=(A={scales:.08,chitin:.12,fur:.02+.05*n.look.furLen,slime:.02,skin:0}[n.look.cover])!=null?A:0;let C=o===0?.9:o===1?1:o===2?1.08:1.14;return a&&(C+=.12),C-=.3*(t-.45),u>.2&&(C-=.06),C=bi(C,.6,1.5),{hp:Math.round(80+210*t+m*1.5),atk:Math.round(y*10)/10,def:bi(u,0,.45),spd:Math.round(C*100)/100,dodge:bi(.04+(C-1)*.2+(n.look.cover==="slime"?.05:0)+(a?.03:0),0,.3),crit:bi(.04+.02*c,.04,.16),miss:c===0?.25:.04,thorns:bi(l,0,.3),venom:h,wings:a>0,eyes:c,hands:Math.min(p,8),slots:Math.min(p,8)||1,abilitySlots:n.type==="humanoid"?3:2,legs:g,tail:_,horns:f,mouth:d,claws:x,tentacles:M,armoured:u>=.12,big:t>.56,small:t<.42,serpent:n.type==="serpent",type:n.type}}function Ld(n){let e=[];return n.venom&&e.push("Venom"),n.thorns>0&&e.push("Spiny"),n.def>=.15&&e.push("Armoured"),n.wings&&e.push("Winged"),n.spd>=1.12&&e.push("Quick"),n.eyes===0?e.push("Blind"):n.crit>=.12&&e.push("Keen-eyed"),e}function Dd(n){let e=n===9?1.3:1;return{hp:(Aa.hp0+Aa.hp1*n)*e,atk:(Aa.atk0+Aa.atk1*n)*(e>1?1.12:1)}}var Aa={hp0:.34,hp1:.099,atk0:.4,atk1:.091},ry=["hpP","atkP","atkF","spdP","crit","critD","dodge","def","pierce","lifesteal","thorns","regen","bleedC","poisonC","poisonD","burnC","stunC","stunDur","dbl","ramp","lowP","firstX","giantP","vsBleedP","perStatusCrit","perStatusDmg","critBleed","critCdr","execP","riposte","blockHeal","killHeal","killHp","secondWind","hemo","festerP","shieldP","opener","guardCdr","perWeaponSpd","perLegAtk","perEyeCrit","thornsBleed","dodgeCrit","weapons"];function sh(n,e={}){let t={};for(let a of ry)t[a]=e.mods&&e.mods[a]||0;let i=e.mul||{hp:1,atk:1},s=e.boost||{hp:1,atk:1},r=Math.round(n.hp*(1+t.hpP)*i.hp*s.hp*(1+(e.bonusHp||0))),o=bi(n.spd*(1+t.spdP+t.perWeaponSpd*t.weapons),.5,2.4);return{s:n,m:t,max:r,hp:r,shield:Math.round(r*t.shieldP),atk:(n.atk+t.atkF)*(1+t.atkP+t.perLegAtk*n.legs)*i.atk*s.atk,crit:n.crit+t.crit+t.perEyeCrit*n.eyes,dodge:bi(n.dodge+t.dodge,0,.45),def:bi(n.def+t.def,0,.6),thorns:n.thorns+t.thorns,poisonC:(n.venom?.35:0)+t.poisonC,poisonD:Math.max(n.venom,t.poisonC>0?3:0)+t.poisonD,every:1.75/o,t:.9+.5/o,power:!1,powerCd:2,guard:0,guardCd:0,guardEvery:Math.max(2.5,4.5-t.guardCdr),st:{bleed:0,bleedT:0,bleedD:1,poison:0,poisonD:0,burn:0,burnD:0,stun:0,immune:0,weak:0,slow:0,blind:0},buff:{evade:0,shell:0,frenzy:0},tick:0,fury:0,first:!0,wind:t.secondWind>0,nextCrit:!1,opened:!(t.opener>0),abil:(e.abilities||[]).map(a=>({id:a.id,lvl:a.lvl,cd:3}))}}function rh(n){return n.powerCd>0||n.hp<=0?!1:(n.power=!0,n.powerCd=7,!0)}function oh(n){return n.guardCd>0||n.hp<=0?!1:(n.guard=.9,n.guardCd=n.guardEvery,!0)}function nh(n,e){if(n.shield>0){let t=Math.min(n.shield,e);n.shield-=t,e-=t}n.hp-=e}function Jr(n,e){n.hp=Math.min(n.max,n.hp+e)}function Ra(n,e,t){n.st.bleed=Math.min(12,n.st.bleed+e),n.st.bleedT=5,n.st.bleedD=Math.max(1,t.atk*.05)*(1+t.m.festerP)}function ih(n,e){return n.st.immune>0?!1:(n.st.stun=e,n.st.immune=e+3,n.t+=e,!0)}var oy=n=>(n.st.bleed>0)+(n.st.poison>0)+(n.st.burn>0)+(n.st.stun>0);function Ca(n,e,t,i,s={}){let r=n[e],o=n[1-e],a=r.m,c=o.m,l={type:"hit",by:e,dmg:0,power:!!s.power,name:s.name};if(!s.sure&&(i()<(r.s.miss+(r.st.blind>0?.5:0))*(s.power?.5:1)||o.buff.evade>0||i()<o.dodge))return l.miss=!0,c.dodgeCrit&&(o.nextCrit=!0),l;let h=oy(o),u=r.atk*t*(.85+.3*i()),m=1+r.fury*a.ramp+(r.hp<r.max*.4?a.lowP:0)+(o.st.bleed>0?a.vsBleedP:0)+h*a.perStatusDmg+(o.max>r.max?a.giantP:0)+(o.hp<o.max*.3?a.execP:0);if(r.first&&(m+=a.firstX,r.first=!1),u*=m*(r.st.weak>0?.7:1)*(r.st.burn>0?.9:1),(r.nextCrit||i()<r.crit+h*a.perStatusCrit)&&(u*=1.6+a.critD,l.crit=!0,r.nextCrit=!1,a.critBleed&&Ra(o,a.critBleed,r),a.critCdr))for(let p of r.abil)p.cd=Math.max(0,p.cd-a.critCdr);return u*=(1-Math.max(0,o.def-a.pierce))*(o.buff.shell>0?.3:1),o.guard>0?(u*=.2,l.blocked=!0,o.guard=0,r.t+=.6,c.riposte&&(l.riposte=Math.max(1,Math.round(o.atk*c.riposte)),nh(r,l.riposte)),c.blockHeal&&Jr(o,o.max*c.blockHeal)):(o.thorns>0&&!s.ranged&&(l.thorns=Math.max(1,Math.round(u*o.thorns*(o.buff.shell>0?2:1))),nh(r,l.thorns),c.thornsBleed&&Ra(r,1,o)),i()<a.bleedC&&(Ra(o,1,r),l.bleed=!0),i()<r.poisonC&&(o.st.poison=4,o.st.poisonD=r.poisonD*(1+a.festerP),l.venom=!0),i()<a.burnC&&(o.st.burn=3,o.st.burnD=Math.max(1,u*.14)*(1+a.festerP),l.burn=!0),i()<a.stunC&&ih(o,.7*(1+a.stunDur))&&(l.stun=!0),a.lifesteal&&Jr(r,u*a.lifesteal)),l.dmg=Math.max(1,Math.round(u)),nh(o,l.dmg),r.fury++,l}function ah(n,e,t,i,s){let r=n[e],o=n[1-e],a=r.abil[t];if(!a||a.cd>0||r.hp<=0||o.hp<=0||r.st.stun>0)return!1;let c=a.lvl,l=u=>s.push({type:"cast",by:e,name:u}),h=(u,m,p)=>{let g=Ca(n,e,u,i,{name:m,...p});return g.ability=!0,s.push(g),g};switch(a.id){case"pounce":{let u=h(1.5+.3*c,"Pounce");!u.miss&&!u.blocked&&ih(o,.8);break}case"roar":o.st.weak=4+c,l("Roar");break;case"lick":Jr(r,r.max*(.11+.04*c)),s.push({type:"heal",on:e,name:"Lick Wounds"});break;case"spit":o.st.poison=6,o.st.poisonD=Math.max(o.st.poisonD,(4+2*c+r.m.poisonD)*(1+r.m.festerP)),l("Venom Spit");break;case"dive":r.buff.evade=1.5+.5*c,r.nextCrit=!0,l("Dive");break;case"constrict":{h(.8+.3*c,"Constrict",{sure:!0}).blocked||ih(o,(1.4+.3*c)*(1+r.m.stunDur));break}case"web":o.st.slow=4+c,l("Web");break;case"ink":o.st.blind=3+c,l("Ink Cloud");break;case"shellup":r.buff.shell=2+c,l("Shell Up");break;case"sweep":{h(1+.25*c,"Tail Sweep").miss||(o.t+=1.2);break}case"gore":{let u=h(1.2+.2*c,"Gore");!u.miss&&!u.blocked&&Ra(o,2+c,r);break}case"frenzy":r.buff.frenzy=4,r.frenzyX=1.5+.2*c,l("Frenzy");break;case"hurl":h(1.8+.4*c,"Hurl",{sure:!0,ranged:!0});break;case"rend":h(Math.max(.3,(.35+.1*c)*o.st.bleed),"Rend");break;case"breath":{let u=h(.8+.2*c,"Fire Breath",{sure:!0,ranged:!0});o.st.burn=5,o.st.burnD=Math.max(o.st.burnD,Math.max(2,u.dmg*.2)*(1+r.m.festerP));break}default:return!1}return a.cd=lh[a.id]||10,!0}var lh={pounce:9,roar:12,lick:14,spit:10,dive:11,constrict:12,web:12,ink:12,shellup:13,sweep:8,gore:10,frenzy:13,hurl:9,rend:9,breath:11};function ch(n,e,t,i,s,r){let o=n[e],a=n[1-e];o.powerCd<=0&&i()<t*.6&&rh(o),o.guardCd<=0&&a.t<.3&&i()<t*8*s&&oh(o);for(let c=0;c<o.abil.length;c++)o.abil[c].cd<=0&&i()<t*1.2&&!(o.abil[c].id==="lick"&&o.hp>o.max*.75)&&!(o.abil[c].id==="rend"&&a.st.bleed<3)&&ah(n,e,c,i,r)}function Ud(n,e,t,i){for(let s=0;s<2;s++){let r=n[s],o=n[1-s],a=r.st;if(r.hp<=0||o.hp<=0)continue;if(!r.opened){r.opened=!0;let l=Ca(n,s,r.m.opener,t,{sure:!0,ranged:!0,name:"Sling"});l.ability=!0,i.push(l)}r.powerCd=Math.max(0,r.powerCd-e),r.guardCd=Math.max(0,r.guardCd-e),r.guard=Math.max(0,r.guard-e);for(let l of r.abil)l.cd=Math.max(0,l.cd-e);for(let l of["stun","immune","weak","slow","blind","poison","burn"])a[l]=Math.max(0,a[l]-e);for(let l of["evade","shell","frenzy"])r.buff[l]=Math.max(0,r.buff[l]-e);if(a.bleed>0&&(a.bleedT-=e,a.bleedT<=0&&(a.bleed=0)),r.m.regen&&Jr(r,r.max*r.m.regen*e),r.tick+=e,r.tick>=1){r.tick-=1;let l=0;a.bleed>0&&(l+=a.bleed*a.bleedD,o.m.hemo&&Jr(o,o.m.hemo*a.bleed)),a.poison>0&&(l+=a.poisonD),a.burn>0&&(l+=a.burnD),l>0&&(l=Math.max(1,Math.round(l)),r.hp-=l,i.push({type:"dot",on:s,dmg:l,kind:a.burn>0?"burn":a.poison>0?"venom":"bleed"}))}if(a.stun>0||(r.t-=e*(r.buff.frenzy>0?r.frenzyX:1)*(a.slow>0?.5:1),r.t>0||r.hp<=0))continue;r.t=r.every*(.9+.2*t());let c=r.power;if(r.power=!1,i.push(Ca(n,s,c?2.1:1,t,{power:c})),o.hp>0&&r.hp>0&&t()<r.m.dbl){let l=Ca(n,s,.7,t,{});l.extra=!0,i.push(l)}}for(let s=0;s<2;s++){let r=n[s];r.hp<=0&&r.wind&&(r.wind=!1,r.hp=Math.max(1,Math.round(r.max*r.m.secondWind)),i.push({type:"heal",on:s,name:"Second Wind"}))}return n[0].hp<=0&&n[1].hp<=0&&(n[0].hp=1),n[1].hp<=0?0:n[0].hp<=0?1:-1}function Nd(n,e){return 1e3+Math.round(500*bi(n/e,0,1))}var ve=n=>Math.round(n*100)+"%",Ot=n=>(Math.round(n*10)/10).toString(),Pn=(n,e,t,i,s,r,o,a=1,c)=>({id:n,name:e,icon:t,tags:i,cost:s,mods:r,text:o,hands:a,req:c,cat:"weapon"}),He=(n,e,t,i,s,r,o,a,c)=>({id:n,name:e,icon:t,tags:i,cost:s,mods:r,text:o,req:a,reqText:c,cat:"relic"}),en=(n,e,t,i,s,r,o,a,c)=>({id:n,name:e,icon:t,tags:i,cost:s,cd:r,text:o,req:a,reqText:c,cat:"ability"}),cr=[Pn("club","Bone Club","\u{1F9B4}",["stun","fury"],0,n=>({atkF:3*n,stunC:.08*n}),n=>`+${Ot(3*n)} attack. ${ve(.08*n)} chance to stun.`),Pn("cleaver","Notched Cleaver","\u{1FA93}",["bleed"],0,n=>({atkF:2.5*n,bleedC:.3*n}),n=>`+${Ot(2.5*n)} attack. ${ve(.3*n)} chance to cause bleeding.`),Pn("fang","Fang Dagger","\u{1F5E1}\uFE0F",["poison","speed"],0,n=>({atkF:1.5*n,poisonC:.3*n,spdP:.05*n}),n=>`+${Ot(1.5*n)} attack, +${ve(.05*n)} speed. ${ve(.3*n)} chance to poison.`),Pn("mace","Thorn Mace","\u{1F335}",["thorns"],0,n=>({atkF:2*n,thorns:.08*n}),n=>`+${Ot(2*n)} attack. Attackers take ${ve(.08*n)} of their damage back.`),Pn("buckler","Spiked Buckler","\u{1F6E1}\uFE0F",["guard","thorns"],0,n=>({def:.06*n,riposte:.5*n,guardCdr:.5}),n=>`+${ve(.06*n)} armour. Guard recharges faster and a block hits back for ${ve(.5*n)} attack.`),Pn("sling","Stone Sling","\u{1FAA8}",["crit"],0,n=>({opener:.7*n,crit:.03*n}),n=>`Opens each fight with a shot for ${ve(.7*n)} attack. +${ve(.03*n)} critical chance.`),Pn("brand","Ember Brand","\u{1F525}",["burn"],250,n=>({atkF:2*n,burnC:.3*n}),n=>`+${Ot(2*n)} attack. ${ve(.3*n)} chance to set the enemy on fire.`),Pn("pick","War Pick","\u26CF\uFE0F",["crit"],250,n=>({atkF:2.5*n,pierce:.2*n}),n=>`+${Ot(2.5*n)} attack. Ignores ${ve(.2*n)} armour.`),Pn("hooks","Twin Hooks","\u{1FA9D}",["speed"],300,n=>({atkF:1.5*n,dbl:.1*n}),n=>`+${Ot(1.5*n)} attack. ${ve(.1*n)} chance to strike twice.`),Pn("whip","Leech Whip","\u{1FA78}",["life"],350,n=>({atkF:1.5*n,lifesteal:.08*n}),n=>`+${Ot(1.5*n)} attack. Heals for ${ve(.08*n)} of damage dealt.`),Pn("maul","Great Maul","\u{1F528}",["stun","fury"],400,n=>({atkF:8*n,spdP:-.08,stunC:.1*n}),n=>`Needs two hands. +${Ot(8*n)} attack, -8% speed. ${ve(.1*n)} chance to stun.`,2),Pn("trident","Barbed Trident","\u{1F531}",["bleed","crit"],450,n=>({atkF:3*n,vsBleedP:.15*n,critD:.2*n}),n=>`+${Ot(3*n)} attack. +${ve(.15*n)} damage to bleeding enemies, +${ve(.2*n)} critical damage.`),He("hide","Thick Hide","\u{1F418}",["life"],0,n=>({hpP:.12*n}),n=>`+${ve(.12*n)} health.`),He("tooth","Whetted Tooth","\u{1F9B7}",["fury"],0,n=>({atkP:.12*n}),n=>`+${ve(.12*n)} attack.`),He("blood","Quick Blood","\u{1F4A8}",["speed"],0,n=>({spdP:.1*n}),n=>`+${ve(.1*n)} speed.`),He("eye","Hunter's Eye","\u{1F441}\uFE0F",["crit"],0,n=>({crit:.07*n}),n=>`+${ve(.07*n)} critical chance.`),He("edge","Cruel Edge","\u2702\uFE0F",["crit"],0,n=>({critD:.35*n}),n=>`+${ve(.35*n)} critical damage.`),He("slick","Slick Skin","\u{1F4A7}",["speed"],0,n=>({dodge:.05*n}),n=>`+${ve(.05*n)} dodge.`),He("plate","Iron Scales","\u{1F529}",["guard"],0,n=>({def:.06*n}),n=>`+${ve(.06*n)} armour.`),He("jag","Jagged Claws","\u{1FA78}",["bleed"],0,n=>({bleedC:.2*n}),n=>`${ve(.2*n)} chance on hit to cause bleeding.`),He("rot","Rot Gland","\u2623\uFE0F",["poison"],0,n=>({poisonC:.2*n,poisonD:n}),n=>`${ve(.2*n)} chance on hit to poison. Poison is stronger.`),He("gut","Ember Gut","\u{1F30B}",["burn"],200,n=>({burnC:.2*n}),n=>`${ve(.2*n)} chance on hit to set the enemy on fire.`),He("scent","Blood Scent","\u{1F43A}",["bleed","fury"],0,n=>({vsBleedP:.25*n}),n=>`+${ve(.25*n)} damage to bleeding enemies.`),He("torment","Tormentor","\u{1F608}",["bleed","poison","burn"],400,n=>({perStatusDmg:.1*n}),n=>`+${ve(.1*n)} damage for each ailment on the enemy (bleed, poison, fire, stun).`),He("opp","Opportunist","\u{1F3AF}",["crit","bleed","poison","burn"],300,n=>({perStatusCrit:.08*n}),n=>`+${ve(.08*n)} critical chance for each ailment on the enemy.`),He("fester","Festering","\u{1F9A0}",["poison","burn","bleed"],0,n=>({festerP:.4*n}),n=>`Bleed, poison and fire deal ${ve(.4*n)} more.`),He("hemo","Hemophage","\u{1F987}",["bleed","life"],350,n=>({hemo:1.2*n}),n=>`Heal ${Ot(1.2*n)} for each bleed stack on the enemy, every second.`),He("mist","Red Mist","\u{1F32B}\uFE0F",["crit","bleed"],350,n=>({critBleed:Math.max(1,Math.round(n))}),n=>`Critical hits add ${Math.max(1,Math.round(n))} bleed.`),He("rhythm","Predator's Rhythm","\u23F1\uFE0F",["crit","ability"],0,n=>({critCdr:.6*n}),n=>`Critical hits cut ability cooldowns by ${Ot(.6*n)}s.`),He("finish","Finisher","\u{1F480}",["crit","fury"],0,n=>({execP:.4*n}),n=>`+${ve(.4*n)} damage to enemies below 30% health.`),He("flurry","Flurry","\u{1F300}",["speed"],0,n=>({dbl:.08*n}),n=>`${ve(.08*n)} chance to strike twice.`),He("moment","Momentum","\u{1F4C8}",["speed","fury"],0,n=>({ramp:.025*n}),n=>`Each hit you land adds +${Ot(2.5*n)}% damage for the rest of the fight.`),He("riposte","Riposte","\u{1F93A}",["guard"],0,n=>({riposte:.6*n}),n=>`A block hits back for ${ve(.6*n)} attack.`),He("bulwark","Bulwark","\u{1F9F1}",["guard","life"],0,n=>({blockHeal:.05*n}),n=>`A block heals ${ve(.05*n)} health.`),He("spite","Spite","\u{1F994}",["thorns"],0,n=>({thorns:.08*n}),n=>`Attackers take ${ve(.08*n)} of their damage back.`),He("barbs","Barbed Hide","\u{1FAA1}",["thorns","bleed"],300,n=>({thornsBleed:1,thorns:.04*n}),n=>`Attackers take ${ve(.04*n)} back and start bleeding.`),He("leech","Leech","\u{1FAB1}",["life"],0,n=>({lifesteal:.06*n}),n=>`Heal for ${ve(.06*n)} of damage dealt.`),He("trophy","Trophy Hunter","\u{1F3C6}",["life"],0,n=>({killHp:.05*n}),n=>`Each kill adds +${ve(.05*n)} health for the rest of the gauntlet.`),He("feast","Feast","\u{1F356}",["life"],0,n=>({killHeal:.12*n}),n=>`Each kill heals an extra ${ve(.12*n)} health.`),He("wind","Second Wind","\u{1F54A}\uFE0F",["life"],500,n=>({secondWind:.15*n}),n=>`Once per fight, survive a killing blow and heal ${ve(.15*n)}.`),He("breath","Deep Breath","\u{1F33F}",["life"],0,n=>({regen:.006*n}),n=>`Regain ${Ot(.6*n)}% health every second.`),He("shellr","Carapace","\u{1F95A}",["guard","life"],0,n=>({shieldP:.15*n}),n=>`Start each fight with a shield worth ${ve(.15*n)} health.`),He("corner","Cornered","\u{1F621}",["fury"],0,n=>({lowP:.3*n}),n=>`+${ve(.3*n)} damage while below 40% health.`),He("ambush","Ambush","\u{1F311}",["crit"],0,n=>({firstX:n}),n=>`Your first hit each fight deals +${ve(n)} damage.`),He("giant","Giant Slayer","\u{1FA93}",["fury"],250,n=>({giantP:.2*n}),n=>`+${ve(.2*n)} damage to enemies with more health than you.`),He("herd","Stampede","\u{1F9AC}",["fury"],0,n=>({perLegAtk:.03*n}),n=>`+${ve(.03*n)} attack for each leg.`,n=>n.legs>=4,"four or more legs"),He("eyes","Many Eyes","\u{1F577}\uFE0F",["crit"],0,n=>({perEyeCrit:.015*n}),n=>`+${Ot(1.5*n)}% critical chance for each eye.`,n=>n.eyes>=2,"two or more eyes"),He("ambi","Ambidextrous","\u{1F64C}",["speed","weapon"],0,n=>({perWeaponSpd:.04*n}),n=>`+${ve(.04*n)} speed for each weapon held.`,n=>n.hands>=2,"two or more hands"),He("updraft","Updraft","\u{1FABD}",["speed","crit"],0,n=>({dodge:.08*n,dodgeCrit:1}),n=>`+${ve(.08*n)} dodge. After a dodge, your next hit is critical.`,n=>n.wings,"wings"),He("heavy","Heavyweight","\u{1F5FF}",["guard","thorns"],0,n=>({def:.04*n,thorns:.05*n}),n=>`+${ve(.04*n)} armour, and attackers take ${ve(.05*n)} back.`,n=>n.big,"a large body"),He("feather","Featherweight","\u{1FAB6}",["speed"],0,n=>({spdP:.08*n,dodge:.04*n}),n=>`+${ve(.08*n)} speed and +${ve(.04*n)} dodge.`,n=>n.small,"a small body"),He("coil","Coiled","\u27B0",["stun"],0,n=>({stunC:.06*n,stunDur:.5}),n=>`${ve(.06*n)} chance to stun, and stuns last longer.`,n=>n.serpent||n.tentacles>=2,"a serpent body or tentacles"),He("virulent","Virulent","\u{1F9EB}",["poison"],0,n=>({poisonD:2*n,poisonC:.1}),n=>`Your poison deals ${Ot(2*n)} more each second.`,n=>n.venom,"a stinger, mandibles or feelers"),en("pounce","Pounce","\u{1F43E}",["stun","fury"],0,9,n=>`Leap for ${ve(1.5+.3*n)} attack and stun briefly.`,n=>n.legs>=2,"legs"),en("roar","Roar","\u{1F981}",["guard"],0,12,n=>`Weaken the enemy's attacks by 30% for ${4+n}s.`,n=>n.mouth,"a mouth"),en("lick","Lick Wounds","\u{1F497}",["life"],0,14,n=>`Heal ${ve(.11+.04*n)} health.`),en("spit","Venom Spit","\u{1F9EA}",["poison"],0,10,n=>`Poison the enemy for ${4+2*n} damage a second, for 6s.`,n=>n.venom,"a stinger, mandibles or feelers"),en("dive","Dive","\u{1F985}",["crit","speed"],0,11,n=>`Dodge everything for ${Ot(1.5+.5*n)}s; your next hit is critical.`,n=>n.wings,"wings"),en("constrict","Constrict","\u{1F40D}",["stun"],0,12,n=>`Squeeze for ${ve(.8+.3*n)} attack and stun for ${Ot(1.4+.3*n)}s.`,n=>n.serpent||n.tentacles>=2,"a serpent body or tentacles"),en("web","Web","\u{1F578}\uFE0F",["speed","stun"],0,12,n=>`Slow the enemy's attacks by half for ${4+n}s.`,n=>n.type==="arachnid"||n.type==="insectoid","an arachnid or insectoid body"),en("ink","Ink Cloud","\u{1F32B}\uFE0F",["speed"],0,12,n=>`Blind the enemy for ${3+n}s: most of its attacks miss.`,n=>n.type==="cephalopod"||n.type==="aquatic","a cephalopod or aquatic body"),en("shellup","Shell Up","\u{1F422}",["guard","thorns"],0,13,n=>`Take 70% less damage for ${2+n}s and double what attackers take back.`,n=>n.armoured,"a shell, plates or tough hide"),en("sweep","Tail Sweep","\u{1F98E}",["stun"],0,8,n=>`Hit for ${ve(1+.25*n)} attack and knock the enemy's next attack back.`,n=>n.tail,"a tail"),en("gore","Gore","\u{1F402}",["bleed"],0,10,n=>`Hit for ${ve(1.2+.2*n)} attack and add ${2+n} bleed.`,n=>n.horns,"horns or tusks"),en("frenzy","Frenzy","\u{1F624}",["speed","fury"],300,13,n=>`Attack ${ve(.5+.2*n)} faster for 4s.`),en("hurl","Hurl Weapon","\u{1F3F9}",["weapon","crit"],300,9,n=>`Throw for ${ve(1.8+.4*n)} attack. Cannot miss.`,n=>n.hands>=1,"a hand"),en("rend","Rend","\u{1F405}",["bleed"],350,9,n=>`Tear open wounds: ${ve(.35+.1*n)} attack for each bleed on the enemy.`,n=>n.claws,"claws, talons or paws"),en("breath","Fire Breath","\u{1F432}",["burn"],400,11,n=>`Burn for ${ve(.8+.2*n)} attack and set the enemy alight for 5s.`,n=>n.mouth,"a mouth")],ay=Object.fromEntries(cr.map(n=>[n.id+(n.cat==="ability"?"!":""),n])),Gn=(n,e)=>ay[n+(e==="ability"?"!":"")],Fd=["Common","Rare","Epic"],hh=["humanoid","quadruped","avian"],hr={insectoid:400,arachnid:500,cephalopod:600,serpent:300,aquatic:300},Kr={eye_glow:100,eye_stalk:100,eye_compound:100,mandibles:150,maw:150,trunk:150,tusk:150,horn_ram:200,antler:200,antenna_feather:80,ear_fin:80,arm_pincer:250,tentacle:300,leg_insect:150,wing_bat:300,wing_insect:200,tail_club:250,tail_stinger:300,ridge_sail:150,ridge_plates:200,shell:300},kd=[{id:"vital",name:"Vitality",icon:"\u2764\uFE0F",max:5,cost:n=>150+100*n,text:"+5% health for every creature, per level."},{id:"fero",name:"Ferocity",icon:"\u{1F4A2}",max:5,cost:n=>150+100*n,text:"+4% attack for every creature, per level."},{id:"recov",name:"Recovery",icon:"\u26FA",max:5,cost:n=>120+80*n,text:"+4% more health restored between fights, per level."},{id:"reroll",name:"Fickle Crowd",icon:"\u{1F3B2}",max:3,cost:n=>250+150*n,text:"+1 reroll of the rewards per gauntlet, per level."},{id:"head",name:"Head Start",icon:"\u{1F381}",max:1,cost:()=>800,text:"Choose a reward before the first fight."},{id:"revive",name:"Revive",icon:"\u2728",max:3,cost:()=>500,text:"Brings a dead creature back once, mid-gauntlet, at half health. Used up when spent. Hold up to three.",consumable:!0}],uh=()=>({points:0,champions:0,fallen:0,unlocked:{},boosts:{},revives:0}),dh=(n,e)=>!!n.unlocked[e],Pa=(n,e)=>hh.includes(e)||dh(n,"type:"+e),fh=(n,e)=>!Kr[e]||dh(n,"part:"+e),ph=(n,e)=>!e.cost||dh(n,"item:"+e.cat+":"+e.id),Od=n=>15*(n+1),Ia=()=>({weapons:[],relics:[],abilities:[]}),jr=n=>n.weapons.reduce((e,t)=>e+Gn(t.id,"weapon").hands,0);function mh(n){let e={};for(let t of[...n.weapons,...n.relics]){let i=Gn(t.id,t.cat||"x").mods(t.q);for(let s in i)e[s]=(e[s]||0)+i[s]}return e.weapons=n.weapons.length,e}function ly(n){let e={};for(let t of[...n.weapons,...n.relics,...n.abilities])for(let i of Gn(t.id,t.cat).tags)e[i]=(e[i]||0)+1;return e}function Bd(n,e,t){return n.req&&!n.req(e)?!1:n.cat==="weapon"?e.slots-jr(t)>=n.hands:n.cat==="ability"?t.abilities.some(i=>i.id===n.id)||t.abilities.length<e.abilitySlots:!0}function zd(n,e,t,i,s,r=3){let o=ly(t),a=[],c=new Set,l=cr.filter(m=>(!i||ph(i,m))&&Bd(m,e,t)),u={weapon:e.slots-jr(t)>=2?.45:.32,relic:.42,ability:.26};for(let m=0;m<r;m++){let p=l.filter(y=>!c.has(y.cat+y.id));if(!p.length)break;let g=p.map(y=>{let C=0;for(let A of y.tags)C+=Math.min(o[A]||0,3);let T=y.cat==="ability"&&t.abilities.some(A=>A.id===y.id);return u[y.cat]/Math.max(1,p.filter(A=>A.cat===y.cat).length)*(1+.9*Math.min(C,5))*(T?1.5:1)}),_=n()*g.reduce((y,C)=>y+C,0),f=0;for(;f<g.length-1&&(_-=g[f])>0;)f++;let d=p[f];c.add(d.cat+d.id);let x=n(),M=x<.05+.015*s?2:x<.28+.035*s?1:0;a.push({id:d.id,cat:d.cat,rar:M,q:Math.round([1,1.5,2.2][M]*(.9+.2*n())*100)/100,syn:d.tags.some(y=>o[y])})}return a}function Hd(n,e){if(e.cat==="weapon")n.weapons.push({id:e.id,cat:"weapon",q:e.q,rar:e.rar});else if(e.cat==="relic")n.relics.push({id:e.id,cat:"relic",q:e.q,rar:e.rar});else{let t=n.abilities.find(i=>i.id===e.id);t?t.lvl+=1+(e.rar>0?1:0):n.abilities.push({id:e.id,cat:"ability",lvl:1+e.rar})}}function La(n){var t;let e=Gn(n.id,n.cat);return n.cat!=="ability"?e.text(n.q):e.text((t=n.lvl)!=null?t:1+n.rar)+` Recharges in ${e.cd}s.`}function Vd(n,e,t){let i=Ia(),s=.75+.04*t,r=cr.filter(a=>a.cat==="relic"&&Bd(a,e,i)),o=cr.filter(a=>a.cat==="weapon");for(let a=0;a<Math.floor(t*.75);a++)i.relics.push({id:r[Math.floor(n()*r.length)].id,cat:"relic",q:s,rar:0});for(let a=0;a<Math.min(e.slots,Math.floor((t+1)/3));a++){let c=o[Math.floor(n()*o.length)];e.slots-jr(i)>=c.hands&&i.weapons.push({id:c.id,cat:"weapon",q:s,rar:0})}return i}var cy=["eye_round","eye_cat","eye_goat","eye_glow","eye_beady","eye_compound","eye_stalk"],hy=["muzzle","beak","mandibles","maw","feelers","muzzle"],uy=["horn_spike","horn_curved","horn_ram","antler","antenna","antenna_feather","crest"],dy=["tail_thin","tail_thick","tail_fluffy","tail_tuft","tail_club","tail_stinger","tail_fan"],fy=["ridge_spikes","ridge_plates","ridge_sail","ridge_mane","shell"],py=["ear_point","ear_round","ear_long","ear_floppy","ear_fin"],my=["wing_feather","wing_bat","wing_insect"],gy=["human","paw","hoof","talon","webbed","stump","point"],_y=["human","claw","pincer","mitt"],xy=["skin","fur","scales","chitin","slime"],yy=["Vor","Gra","Zul","Kra","Thu","Mog","Sha","Bru","Nyx","Ora","Ska","Dre","Hul","Fen","Ryz","Um","Qua","Ix","Bel","Tar"],vy=["gath","nak","tor","ra","lix","mok","thos","zar","dun","ska","bor","vex","gul","ris","nor","ix"],by=["the Cruel","the Hungry","Bonebreaker","the Unblinking","of the Pit","the Swift","Skullsplitter","the Patient","the Loud","Twice-Bitten","the Scarred","Sandstrider","the Vile","Crowd-Pleaser","the Last"];function My(n,e){let t=i=>i[Math.floor(n()*i.length)];return t(yy)+t(vy)+(e?" "+t(by):"")}function Qr(n,e={}){let t=_=>_[Math.floor(n()*_.length)],i=(_,f)=>_+(f-_)*n(),s=(_,f,d)=>"#"+new Re().setHSL((_%1+1)%1,f,d).getHexString(),r=e.type||t(Object.keys(Et)),o=gs(r);o.name=My(n,e.titled),o.sex=n()<.5?"m":"f",o.bulk=i(.82,1.3),o.dimorph=i(.4,1.2);for(let _ of o.nodes){let f=_.role==="neck"||_.role==="waist"?i(.9,1.15):i(.82,1.28);_.rx*=f,_.ry*=f*i(.92,1.08)}let a=n(),c=o.look;Object.assign(c,{base:s(a,i(.25,.8),i(.25,.62)),second:s(a+i(-.25,.25),i(.35,.8),i(.1,.4)),belly:s(a+.04,i(.15,.4),i(.7,.88)),hair:s(a+i(0,.5),.5,i(.15,.5)),membrane:s(a+i(-.1,.1),.45,i(.45,.7)),eye:s(n(),.8,.47),accent:n()<.7?s(.11,.3,i(.75,.9)):s(a,.2,.12),pattern:Math.floor(n()*8),patScale:i(.7,2),bellyAmt:i(.3,.9)}),n()<.5&&(c.cover=t(xy),c.furLen=i(.1,.55),c.furDroop=i(.1,.7));let l=(_,f)=>{let d=Ct[_.kind],x=Ct[f];d.size&&x.size&&(_.size*=x.size/d.size),_.kind=f,_.p=wa(f)},h=Ea(o,{sexless:!0}).userData.frames,u=_=>o.parts.some(f=>Ct[f.kind].cat===_),m=t(cy),p=t(hy);for(let _ of o.parts){let f=Ct[_.kind];f.cat==="eyes"&&n()<.55?l(_,m):f.cat==="mouth"&&f.slot==="mouth"&&n()<.55?l(_,p):f.cat==="limbs"&&_.p.endType!==void 0&&(n()<.4&&(_.p.endType=t(_.kind.startsWith("arm")?_y:gy)),_.p.thick*=i(.85,1.35),_.p.muscle=i(.9,1.35))}u("mouth")||ii(o,p,h);let g=(_,f,d)=>{if(n()<_&&!(d&&u(d)))return ii(o,t(f),h)};g(.5,uy),g(.45,dy,"tails"),g(.45,fy,"back"),g(.2,my,"wings"),g(.3,py,"ears"),n()<.2&&ii(o,"tusk",h),n()<.15&&ii(o,"spike",h);for(let _ of o.parts){let f=Ct[_.kind];if(_.size*=i(.88,1.2),!(f.cat==="limbs"||f.cat==="eyes"))for(let[d,x]of Object.entries(f.P||{}))["count","feathers","tines","lift","sweep","span"].includes(d)||(_.p[d]=_.p[d]+(i(x[0],x[1])-_.p[d])*.3)}return o}var _s=(n,e,t)=>Math.min(t,Math.max(e,n)),gh=n=>n*n*(3-2*n);function _h(n,e,t){let i=document.createElement("canvas");i.width=n,i.height=e,t(i.getContext("2d"),n,e);let s=new ei(i);return s.colorSpace=Ft,s}function wy(){let n=new vt,e=12,t=_h(256,256,(f,d,x)=>{f.fillStyle="#d2a45c",f.fillRect(0,0,d,x);for(let y=0;y<5e3;y++)f.fillStyle=`rgba(${Math.random()<.5?"90,60,30":"255,235,190"},${Math.random()*.12})`,f.fillRect(Math.random()*d,Math.random()*x,1+Math.random()*3,1+Math.random()*2);let M=f.createRadialGradient(d/2,x/2,d*.1,d/2,x/2,d/2);M.addColorStop(0,"rgba(255,240,200,0.25)"),M.addColorStop(1,"rgba(60,35,15,0.45)"),f.fillStyle=M,f.fillRect(0,0,d,x)}),i=new Le(new Ks(e,64),new Dt({map:t,roughness:1}));i.rotation.x=-Math.PI/2,n.add(i);let s=new Dt({color:9402204,roughness:.95,side:Ht}),r=new Dt({color:7167308,roughness:1,side:Ht}),o=[new ye(e,0),new ye(e,1.5)];for(let f=0;f<6;f++)o.push(new ye(e+.5+f*1.15,1.5+f*.8),new ye(e+.5+(f+1)*1.15,1.5+f*.8),new ye(e+.5+(f+1)*1.15,1.5+(f+1)*.8));o.push(new ye(e+8,8.5)),n.add(new Le(new ra(o,72),s));let a=new Le(new ln(e,.14,6,72),r);a.rotation.x=Math.PI/2,a.position.y=1.5,n.add(a);let c=900,l=new Br(new an(.2,6,5),new Dt({roughness:.9}),c),h=new We,u=new Re,m=[];for(let f=0;f<c;f++){let d=Math.floor(Math.random()*6),x=Math.random()*Math.PI*2,M=e+1.05+d*1.15+(Math.random()-.5)*.4;m.push({x:Math.cos(x)*M,y:1.5+d*.8+.3,z:Math.sin(x)*M,ph:Math.random()*6.28}),l.setColorAt(f,u.setHSL(Math.random(),.3+Math.random()*.5,.25+Math.random()*.35))}n.add(l);for(let f=0;f<24;f++){let d=f/24*Math.PI*2,x=e+7.7,M=new Le(new zn(.3,.36,3.4,10),s);M.position.set(Math.cos(d)*x,8.2,Math.sin(d)*x),n.add(M)}let p=new Le(new ln(e+7.7,.32,6,72),s);p.rotation.x=Math.PI/2,p.position.y=10,n.add(p);let g=new Dt({color:2759698,roughness:1});for(let f of[-1,1]){let d=new Le(new xi(1.6,1.25),g);d.position.set(f*(e-.02),.62,0),d.rotation.y=-f*Math.PI/2,n.add(d)}for(let f=0;f<10;f++){let d=f/10*Math.PI*2+.3,x=new Le(new xi(.7,1),new Dt({color:f%2?10099740:14262304,roughness:.8,side:Ht}));x.position.set(Math.cos(d)*(e-.03),.9,Math.sin(d)*(e-.03)),x.lookAt(0,.9,0),n.add(x)}let _=_h(4,256,f=>{let d=f.createLinearGradient(0,0,0,256);d.addColorStop(0,"#2f5fa8"),d.addColorStop(.45,"#7fa6d0"),d.addColorStop(1,"#e9c79a"),f.fillStyle=d,f.fillRect(0,0,4,256)});return{g:n,crowd:l,seats:m,m4:h,sky:_}}function Ey(n){let e=new vt,t=(c,l=.5,h)=>new Dt({color:c,roughness:l,metalness:c===10134701?.7:0,emissive:h||0}),i=(c,l,h,u,m,p)=>{let g=new Le(c,l);return g.position.set(h||0,u||0,m||0),p&&(g.rotation.z=p),e.add(g),g},s=t(7031342,.8),r=t(10134701,.35),o=t(15261900,.6),a=(c=1)=>i(new zn(.035,.045,c,8),s,0,c/2);if(n==="club")i(new zn(.13,.04,1,10),o,0,.5),i(new an(.14,10,8),o,0,1);else if(n==="cleaver")a(.6),i(new Bn(.34,.5,.03),r,.14,.78);else if(n==="fang")a(.3),i(new yi(.07,.6,8),o,0,.6);else if(n==="mace"){a(.85),i(new oa(.17,0),r,0,.95);for(let c=0;c<6;c++)i(new yi(.04,.16,5),r,Math.cos(c)*.2,.95+Math.sin(c*2)*.12,Math.sin(c)*.2,-Math.cos(c)*1.57)}else if(n==="buckler"){let c=i(new zn(.42,.42,.06,20),r,0,.3,.1);c.rotation.x=Math.PI/2;let l=i(new yi(.08,.25,8),o,0,.3,.25);l.rotation.x=Math.PI/2}else if(n==="sling")i(new ln(.2,.02,5,14),s,0,.3),i(new an(.09,8,6),t(9079430,.9),0,.1);else if(n==="brand")a(.8),i(new yi(.13,.42,8),t(16747040,.4,16734720),0,1);else if(n==="pick"){a(.95);let c=i(new yi(.06,.6,6),r,0,.9);c.rotation.z=Math.PI/2}else if(n==="hooks")a(.6),i(new ln(.16,.03,6,12,Math.PI*1.2),r,.16,.62);else if(n==="whip")a(.3),i(new ln(.3,.022,5,16,Math.PI*1.4),t(8002588,.7),.3,.35);else if(n==="maul")i(new zn(.045,.055,1.4,8),s,0,.7),i(new Bn(.5,.32,.32),r,0,1.4);else{a(1.2);for(let c of[-.13,0,.13])i(new yi(.035,.4,6),r,c,1.35-Math.abs(c)*.6);i(new Bn(.3,.04,.04),r,0,1.15)}return e}var dr=null;function Sn(n){try{dr=dr||new(window.AudioContext||window.webkitAudioContext);let e=dr.currentTime,t=dr.createOscillator(),i=dr.createGain(),[s,r,o,a,c]={hit:[150,50,.14,"triangle",.5],power:[220,40,.3,"sawtooth",.5],block:[700,500,.09,"square",.2],miss:[500,800,.1,"sine",.12],win:[440,880,.6,"triangle",.35],lose:[200,60,.9,"sawtooth",.3]}[n];t.type=a,t.frequency.setValueAtTime(s,e),t.frequency.exponentialRampToValueAtTime(r,e+o),i.gain.setValueAtTime(c,e),i.gain.exponentialRampToValueAtTime(.001,e+o),t.connect(i).connect(dr.destination),t.start(e),t.stop(e+o+.02)}catch{}}function Gd(n){let{scene:e,camera:t,h:i,store:s}=n,r=wy();r.g.visible=!1,e.add(r.g);let o=va(),a=_h(64,64,E=>{let B=E.createRadialGradient(32,32,2,32,32,32);B.addColorStop(0,"rgba(0,0,0,0.6)"),B.addColorStop(1,"rgba(0,0,0,0)"),E.fillStyle=B,E.fillRect(0,0,64,64)}),c=document.getElementById("battle"),l={active:!1,phase:"off",run:null,data:null,views:[null,null],F:null,t:0,phaseT:0,enemy:null,shake:0,cheer:0,rand:Math.random,confetti:null},h=null;function u(E,B,D,q){ti(B,E.look,Et[E.type].bellyDir);let z=[],Y=ar(E,B,{anchors:z}),ie=$r(Y),te=ie.getSize(new I),me=_s(1.9/Math.max(te.y,te.z*.85,te.x*.55,.6),.5,2.4)*(.85+.35*_s(Math.cbrt(lr(E).hp/200),.6,1.4)),ke=E.type==="aquatic"?.45:0;Y.group.scale.setScalar(me),Y.group.position.set(-(ie.min.x+ie.max.x)/2*me,-ie.min.y*me+ke,-ie.max.z*me);let U=0;for(let we of q?q.weapons:[]){let Ee=z[U];if(U+=Gn(we.id,"weapon").hands,!Ee)continue;let De=Ey(we.id),pt=_s(te.y*.3,.22,.6);De.scale.setScalar(pt),De.position.copy(Ee.p).addScaledVector(Ee.t,Ee.r*2.2),De.quaternion.setFromUnitVectors(new I(0,1,0),Ee.t.clone().multiplyScalar(.2).add(new I(Math.sign(Ee.p.x)*.25,.75,.6)).normalize()),Y.group.add(De)}let Z=new vt,re=new vt;Z.add(Y.group),re.add(Z);let ee=new Le(new xi(1,1),new on({map:a,transparent:!0,depthWrite:!1}));return ee.rotation.x=-Math.PI/2,ee.position.set(0,.01,-te.z*me/2),ee.scale.set(Math.max(te.x*me,.6)*1.3,te.z*me*1.2,1),re.add(ee),re.position.x=D*.5,re.rotation.y=D<0?Math.PI/2:-Math.PI/2,r.g.add(re),{cr:Y,mats:B,pose:Z,holder:re,side:D,baseY:Y.group.position.y,half:te.x*me/2,head:new I(0,te.y*me+ke+.15,-te.z*me*.3),mid:new I(0,te.y*me*.55+ke,-te.z*me*.2),strike:-1,recoil:0,flash:0,dead:-1,ph:Math.random()*6}}function m(E){let B=l.views[E];B&&(r.g.remove(B.holder),Vi(B.cr.group),l.views[E]=null)}let p=E=>[...E.weapons,...E.abilities,...E.relics].map(B=>Gn(B.id,B.cat).icon).join("");function g(E,B){let D=B.clone();return E.holder.localToWorld(D),D.project(t),[(D.x*.5+.5)*innerWidth,(-D.y*.5+.5)*innerHeight]}function _(E,B,D){let q=l.views[E];if(!q)return;let[z,Y]=g(q,q.head),ie=i("div",{class:"float "+(D||""),style:`left:${z+(Math.random()-.5)*40}px;top:${Y}px`},B);c.querySelector(".floaters").append(ie),setTimeout(()=>ie.remove(),1100)}function f(){let E=[l.data.name,l.enemy?l.enemy.name:""],B=D=>q=>{q.preventDefault(),l.phase==="fight"&&D()};c.replaceChildren(i("div",{class:"hud"},i("div",{class:"who l"},i("b",null,E[0]),i("div",{class:"hp"},i("i",{id:"hp0"})),i("small",{id:"st0"}),i("div",{class:"kit"},p(l.run.load))),i("div",{class:"round"},i("small",null,"Fight"),i("b",null,l.run.round+1+" / "+10)),i("div",{class:"who r"},i("b",null,E[1]),i("div",{class:"hp"},i("i",{id:"hp1"})),i("small",{id:"st1"}),i("div",{class:"kit"},l.eLoad?p(l.eLoad):""))),i("div",{class:"msg",id:"bmsg"}),i("div",{class:"floaters"}),i("div",{class:"acts"},i("div",null,i("button",{id:"bpow",onpointerdown:B(()=>rh(l.F[0])&&Sn("miss"))},i("i"),i("span",null,"Power strike")),i("button",{id:"bgrd",onpointerdown:B(()=>oh(l.F[0])&&Sn("block"))},i("i"),i("span",null,"Guard"))),i("div",null,l.run.load.abilities.map((D,q)=>i("button",{class:"abil",id:"bab"+q,onpointerdown:B(()=>{ah(l.F,0,q,l.rand,l.queue)&&Sn("power")})},i("i"),i("span",null,Gn(D.id,"ability").icon+" "+Gn(D.id,"ability").name))))))}function d(...E){let B=i("div",{class:"panel"},E);return c.append(B),B}function x(E){return i("div",{class:"stats"},...[["Health",E.hp],["Attack",E.atk.toFixed(1)],["Armour",Math.round(E.def*100)+"%"],["Speed",E.spd.toFixed(2)]].map(([B,D])=>i("div",null,i("small",null,B),i("b",null,String(D)))))}function M(){l.phase="gate",c.replaceChildren();let E=lr(l.data),B=Ld(E),D=n.meta();d(i("h2",null,"The Colosseum"),i("p",null,i("b",null,l.data.name)," faces ten fights in a row. Each opponent is tougher and better armed than the last, and the tenth is the reigning champion. After every win you choose one of three rewards."),x(E),i("div",{class:"stats"},i("div",null,i("small",null,"Weapon hands"),i("b",null,String(E.slots))),i("div",null,i("small",null,"Ability slots"),i("b",null,String(E.abilitySlots))),i("div",null,i("small",null,"Revives"),i("b",null,String(D.revives||0)))),i("p",{class:"dim"},B.length?"Traits: "+B.join(", ")+". ":"",E.hands?"Each arm or tentacle can hold one weapon.":"With no hands it can carry a single weapon in its jaws. Add arms or tentacles to wield more."," Wings, tails, horns, venom and the rest decide which abilities and relics can turn up."),i("p",{class:"warn"},"Fights are to the death. If "+l.data.name+" dies with no revive, it is gone for good."),i("div",{class:"row"},i("button",{onclick:()=>L({type:"back"})},"Back to the workshop"),i("button",{class:"go",onclick:()=>{Sn("block"),(D.boosts.head||0)>0?y("A gift from the crowd","Choose a reward before the first fight."):C()}},"Enter the arena")))}function y(E,B){l.phase="won";let D=lr(l.data),q=l.run.load;l.run.draft||(l.run.draft=zd(Math.random,D,q,n.meta(),l.run.round),s.set("cc.run",l.run)),c.replaceChildren(i("div",{class:"floaters"}));let z=te=>{Hd(q,te),l.run.draft=null,s.set("cc.run",l.run),Sn("block"),C()},Y=te=>{let me=Gn(te.id,te.cat),ke=te.cat==="ability"&&q.abilities.find(Z=>Z.id===te.id),U=te.cat==="ability"?{...te,lvl:ke?ke.lvl+1+(te.rar>0?1:0):1+te.rar}:te;return i("button",{class:"reward r"+te.rar+" c-"+te.cat,onclick:()=>z(te)},i("small",null,Fd[te.rar]+" "+(te.cat==="relic"?"relic":te.cat)+(ke?" \xB7 level up":"")),i("div",{class:"ico"},me.icon),i("b",null,me.name),i("p",null,La(U)),te.syn&&i("em",null,"Synergy: "+me.tags.filter(Z=>[...q.weapons,...q.relics,...q.abilities].some(re=>Gn(re.id,re.cat).tags.includes(Z))).join(", ")))};d(i("h2",null,E),i("p",null,B),i("div",{class:"rewards"},l.run.draft.length?l.run.draft.map(Y):i("p",{class:"dim"},"Nothing more fits this body.")),i("p",{class:"dim"},"Hands "+jr(q)+"/"+D.slots+" \xB7 Abilities "+q.abilities.length+"/"+D.abilitySlots+" \xB7 Relics "+q.relics.length+(p(q)?"   "+p(q):"")),i("div",{class:"row"},l.run.rerolls>0&&i("button",{onclick:()=>{l.run.rerolls--,l.run.draft=null,y(E,B)}},"Reroll ("+l.run.rerolls+" left)"),!l.run.draft.length&&i("button",{class:"go",onclick:()=>{l.run.draft=null,C()}},"Next fight"))).classList.add("wide")}function C(){m(1),m(0);let E=l.run.round===9,B=n.meta(),D=B.boosts;l.views[0]=u(l.data,n.M,-1,l.run.load),l.enemy=Qr(Yr(l.run.seed+l.run.round*7919),{titled:!0}),E&&(l.enemy.name=l.enemy.name.split(" ")[0]+", Champion of the Sands");let q=lr(l.data),z=lr(l.enemy);l.eLoad=Vd(Yr(l.run.seed+l.run.round),z,l.run.round),l.views[1]=u(l.enemy,o,1,l.eLoad),E&&l.views[1].holder.scale.setScalar(1.18),l.F=[sh(q,{mods:mh(l.run.load),abilities:l.run.load.abilities,bonusHp:l.run.bonusHp,boost:{hp:1+.05*(D.vital||0),atk:1+.04*(D.fero||0)}}),sh(z,{mul:Dd(l.run.round),mods:mh(l.eLoad)})],l.run.hp!=null&&(l.F[0].hp=Math.min(l.F[0].max,l.run.hp)),l.rand=Math.random,l.queue=[],f(),A(),l.phase="intro",l.phaseT=0,T(E?"Final fight":"Fight "+(l.run.round+1),"vs "+l.enemy.name)}function T(E,B){let D=document.getElementById("bmsg");D&&D.replaceChildren(E?i("b",null,E):"",B?i("span",null,B):"")}function A(){for(let B=0;B<2;B++){let D=l.F[B],q=document.getElementById("hp"+B);if(!q)continue;let z=_s(D.hp/D.max,0,1),Y=D.st;q.style.width=z*100+"%",q.style.background=Y.poison>0?"#8fd14f":z>.5?"#3fd0a4":z>.25?"#ffb347":"#ff5a4a",q.parentNode.classList.toggle("shield",D.shield>0);let ie=Math.max(0,Math.ceil(D.hp))+" / "+D.max+(D.shield>0?" +"+Math.ceil(D.shield):"")+(Y.bleed>0?" \u{1FA78}"+Y.bleed:"")+(Y.poison>0?" \u2623\uFE0F":"")+(Y.burn>0?" \u{1F525}":"")+(Y.stun>0?" \u{1F4AB}":"")+(Y.weak>0?" \u2B07\uFE0F":"")+(Y.slow>0?" \u{1F578}\uFE0F":"")+(Y.blind>0?" \u{1F32B}\uFE0F":"")+(D.buff.shell>0?" \u{1F422}":"")+(D.buff.evade>0?" \u{1F985}":"")+(D.buff.frenzy>0?" \u{1F624}":""),te=document.getElementById("st"+B);te.textContent!==ie&&(te.textContent=ie)}let E=(B,D,q,z)=>{let Y=document.getElementById(B);Y&&(Y.firstChild.style.height=_s(D/q,0,1)*100+"%",Y.classList.toggle("armed",!!z))};E("bpow",l.F[0].powerCd,7,l.F[0].power),E("bgrd",l.F[0].guardCd,l.F[0].guardEvery,l.F[0].guard>0),l.F[0].abil.forEach((B,D)=>E("bab"+D,B.cd,lh[B.id],!1))}function P(){let E=l.F[0],B=n.meta(),D=Od(l.run.round);if(B.points+=D,l.run.earned=(l.run.earned||0)+D,n.saveMeta(),l.run.bonusHp=(l.run.bonusHp||0)+E.m.killHp,l.run.round++,l.run.hp=Math.min(E.max,Math.max(1,E.hp)+E.max*(.4+.04*(B.boosts.recov||0)+E.m.killHeal)),l.run.draft=null,l.run.round>=10){b();return}s.set("cc.run",l.run),y(l.enemy.name.split(",")[0]+" is dead","+"+D+" points. "+l.data.name+" recovers to "+Math.round(l.run.hp)+" / "+E.max+" health. "+(l.run.round===9?"Only the champion remains. ":"")+"Choose a reward:")}function b(){l.phase="champion",s.set("cc.run",null),Sn("win"),l.cheer=6,m(0),l.views[0]=u(l.data,n.M,-1,l.run.load);let E=Nd(l.F[0].hp,l.F[0].max),B=l.run.earned||0;m(1),l.views[0].holder.position.x=0,l.views[0].holder.rotation.y=.35;let D=260,q=new xi(.09,.14),z=new Br(q,new on({side:Ht}),D),Y=new Re;l.confetti={mesh:z,bits:[]};for(let ie=0;ie<D;ie++)l.confetti.bits.push({x:(Math.random()-.5)*9,y:3+Math.random()*7,z:(Math.random()-.5)*5,v:.8+Math.random()*1.2,r:Math.random()*6,w:1+Math.random()*4}),z.setColorAt(ie,Y.setHSL(Math.random(),.9,.6));r.g.add(z),c.replaceChildren(i("div",{class:"floaters"})),d(i("h2",{class:"gold"},"Champion!"),i("p",null,i("b",null,l.data.name)," won all ten fights and rules the Colosseum."),i("div",{class:"stats"},i("div",null,i("small",null,"Fights"),i("b",null,String(B))),i("div",null,i("small",null,"Title"),i("b",null,"+1000")),i("div",null,i("small",null,"Health left"),i("b",null,"+"+(E-1e3))),i("div",null,i("small",null,"Total"),i("b",{class:"gold"},String(E+B)))),i("div",{class:"row"},i("button",{class:"go",onclick:()=>L({type:"champion",points:E})},"Take the crown"))).classList.add("low")}function v(){l.phase="dead",Sn("lose"),c.querySelector(".acts").classList.add("hidden"),T("","");let E=n.meta(),B=l.run.earned||0;d(i("h2",{class:"red"},l.data.name+" has fallen"),i("p",null,"Killed by "+l.enemy.name+" in fight "+(l.run.round+1)+" of "+10+", after "+l.run.round+(l.run.round===1?" win":" wins")+" and "+B+" points earned."),E.revives>0?i("p",null,"You hold "+E.revives+(E.revives===1?" revive.":" revives.")+" Using one brings it back at half health to fight "+l.enemy.name.split(",")[0]+" again."):i("p",{class:"dim"},"The dead do not return. Build a new creature and try again. Revives are sold in the shop."),i("div",{class:"row"},E.revives>0&&i("button",{class:"go",onclick:()=>{E.revives--,n.saveMeta(),l.run.hp=Math.round(l.F[0].max*.5),s.set("cc.run",l.run),Sn("win"),C()}},"Use a revive"),i("button",{class:E.revives>0?"":"go",onclick:()=>{s.set("cc.run",null),L({type:"dead",round:l.run.round,by:l.enemy.name})}},E.revives>0?"Let it die":"Create a new creature"))).classList.add("low")}function L(E){m(0),m(1),l.confetti&&(r.g.remove(l.confetti.mesh),l.confetti.mesh.geometry.dispose(),l.confetti=null),l.active=!1,l.phase="off",r.g.visible=!1,e.background=h,c.classList.add("hidden"),c.replaceChildren(),n.onDone(E)}function V(E,B,D,q){let z=l.F&&l.F[B],Y=0,ie=0,te=0,me=0;if(E.dead>=0){E.dead+=D;let U=gh(_s(E.dead/.7,0,1));te=U*Math.PI/2*(B?-1:1),me=Math.sin(U*Math.PI/2)*E.half*.9,Y=-.3*U}else{if(me=Math.sin(q*2+E.ph)*.015,z&&l.phase==="fight"&&z.t<.4&&E.strike<0){let U=gh(1-z.t/.4);Y-=.22*U,ie-=.1*U*(z.power?1.8:1)}if(E.strike>=0){E.strike+=D;let U=E.strike/.42;if(U>=1)E.strike=-1;else{let Z=U<.25?U/.25:1-(U-.25)/.75;Y+=.8*gh(Z),ie+=.12*Z}}E.recoil>0&&(E.recoil=Math.max(0,E.recoil-D*3.5),Y-=.3*E.recoil,ie-=.14*E.recoil),l.phase==="champion"&&(me+=Math.abs(Math.sin(q*5))*.18)}E.pose.position.set(0,me,Y),E.pose.rotation.set(ie,0,te),E.flash=Math.max(0,E.flash-D*5);let ke=z&&z.guard>0?.25:0;for(let U of[E.mats.skin,...E.mats.shells])U.emissive.setRGB(E.flash*.9+ke*.2,ke*.6,ke);E.holder.updateMatrixWorld(!0),E.mats.U.uInv.value.copy(E.cr.group.matrixWorld).invert()}function G(E){if(E.type==="dot"){_(E.on,"-"+E.dmg,E.kind==="venom"?"venom":E.kind==="burn"?"burn":"bleed");return}if(E.type==="cast"){_(E.by,E.name,"cast"),Sn("miss");return}if(E.type==="heal"){_(E.on,E.name,"venom"),Sn("win");return}let B=l.views[E.by],D=l.views[1-E.by];if(B.strike=0,E.name&&_(E.by,E.name,"cast"),E.miss){_(1-E.by,"Miss","dim"),Sn("miss");return}let q=E.power||E.crit||E.ability;D.recoil=E.blocked?.3:q?1:.6,E.blocked||(D.flash=1),l.shake=E.blocked?.05:E.power?.3:q?.2:.1,l.cheer=Math.max(l.cheer,q?1:.4),_(1-E.by,(E.blocked?"Blocked ":"")+"-"+E.dmg+(E.crit?"!":""),E.blocked?"dim":q?"big":""),E.thorns&&_(E.by,"-"+E.thorns,"dim"),E.riposte&&_(E.by,"Riposte -"+E.riposte,"dim");let z=E.stun?"Stunned":E.venom?"Poisoned":E.burn?"Burning":E.bleed?"Bleeding":"";z&&_(1-E.by,z,E.venom?"venom":E.burn?"burn":"bleed"),Sn(E.blocked?"block":q?"power":"hit")}return l.update=(E,B)=>{if(l.t+=E,l.phaseT+=E,l.phase==="intro"&&l.phaseT>1.7&&(l.phase="fight",l.phaseT=0,T("Fight!",""),setTimeout(()=>l.phase==="fight"&&T("",""),700)),l.phase==="fight"){let Y=l.queue.splice(0),ie=.15+.035*l.run.round,te=-1;for(let me=0;me<2&&te<0;me++)ch(l.F,1,E/2,l.rand,ie,Y),l.auto&&ch(l.F,0,E/2,l.rand,.5,Y),te=Ud(l.F,E/2,l.rand,Y);Y.forEach(G),A(),te>=0&&(l.phase="ending",l.phaseT=0,l.winner=te,l.views[1-te].dead=0,l.cheer=3,te===0&&Sn("win"))}l.phase==="ending"&&l.phaseT>1.6&&(l.winner===0?P():v());for(let Y=0;Y<2;Y++)l.views[Y]&&V(l.views[Y],Y,E,B);l.cheer=Math.max(0,l.cheer-E*.8);let D=.03+.14*Math.min(l.cheer,1);r.seats.forEach((Y,ie)=>{r.m4.makeTranslation(Y.x,Y.y+Math.abs(Math.sin(B*6*(1+ie%5*.2)+Y.ph))*D,Y.z),r.crowd.setMatrixAt(ie,r.m4)}),r.crowd.instanceMatrix.needsUpdate=!0,l.confetti&&(l.confetti.bits.forEach((Y,ie)=>{Y.y-=Y.v*E,Y.y<0&&(Y.y=8),r.m4.makeRotationFromEuler(new An(Y.r+l.t*Y.w,Y.r*2+l.t*Y.w*.7,0)).setPosition(Y.x+Math.sin(l.t+Y.r)*.3,Y.y,Y.z),l.confetti.mesh.setMatrixAt(ie,r.m4)}),l.confetti.mesh.instanceMatrix.needsUpdate=!0),l.shake=Math.max(0,l.shake-E*1.2);let q=_s(1.9/t.aspect,1,1.6),z=l.phase==="champion";t.position.set(Math.sin(l.t*.25)*.8+(Math.random()-.5)*l.shake,(z?1.5:2.1)+(Math.random()-.5)*l.shake,(z?7.2:8.2)*q),t.lookAt(0,z?-.25:.95,0)},l.start=(E,B)=>{l.data=E,l.active=!0,l.t=0,l.enemy=null,l.F=null,l.run=B||{id:E.id,round:0,hp:null,seed:Math.floor(Math.random()*1e9),load:Ia(),bonusHp:0,earned:0,rerolls:n.meta().boosts.reroll||0,draft:null},l.run.load||(l.run.load=Ia()),l.eLoad=null,l.queue=[],h=e.background,e.background=r.sky,r.g.visible=!0,c.classList.remove("hidden"),l.views[0]=u(E,n.M,-1,l.run.load),l.run.draft?y("Back to the sands","Choose your reward:"):l.run.round>0?(l.phase="won",c.replaceChildren(),d(i("h2",null,"Back to the sands"),i("p",null,l.data.name+" has won "+l.run.round+" of "+10+" fights and has "+Math.round(l.run.hp)+" health."),i("div",{class:"row"},i("button",{class:"go",onclick:()=>C()},"Next fight")))):M()},l.back=()=>(l.phase==="gate"&&L({type:"back"}),!0),l}var At=n=>document.getElementById(n);function J(n,e,...t){let i=document.createElement(n);for(let[s,r]of Object.entries(e||{}))s==="class"?i.className=r:s==="style"?i.style.cssText=r:s.startsWith("on")?i.addEventListener(s.slice(2),r):r!==!1&&r!=null&&(i[s]=r);for(let s of t.flat())s!=null&&s!==!1&&i.append(s);return i}var Mt={get(n,e){try{let t=localStorage.getItem(n);return t?JSON.parse(t):e}catch{return e}},set(n,e){try{localStorage.setItem(n,JSON.stringify(e))}catch{}}};function ri(n){let e=At("toast");e.textContent=n,e.classList.remove("hidden"),clearTimeout(ri.t),ri.t=setTimeout(()=>e.classList.add("hidden"),2200)}var vs=At("view"),Tt=new ta({canvas:vs,antialias:!0,powerPreference:"high-performance"});Tt.setPixelRatio(Math.min(window.devicePixelRatio||1,2));Tt.toneMapping=Uc;Tt.toneMappingExposure=1.05;var Bt=new Js;{let n=document.createElement("canvas");n.width=4,n.height=256;let e=n.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"#3d7f86"),t.addColorStop(.55,"#1c3a40"),t.addColorStop(1,"#0c1719"),e.fillStyle=t,e.fillRect(0,0,4,256);let i=new ei(n);i.colorSpace=Ft,Bt.background=i}var Ty=new $s(Tt);Bt.environment=Ty.fromScene(new xa,.04).texture;Bt.environmentIntensity=.55;var Zd=new Vr(16773853,2.2);Zd.position.set(2.5,5,4);Bt.add(Zd);var $d=new Vr(10475775,.9);$d.position.set(-3,2.5,-4);Bt.add($d);Bt.add(new la(13626111,3813160,.5));var lt=new zt(32,1,.05,100),gn=va(),qn=new vt;Bt.add(qn);var wi=new Le(new zn(1,1.06,.06,64),new Dt({color:2377804,roughness:.85})),si=new Le(new Ks(1,48),new on({transparent:!0,depthWrite:!1,opacity:.55}));{let n=document.createElement("canvas");n.width=n.height=128;let e=n.getContext("2d"),t=e.createRadialGradient(64,64,4,64,64,64);t.addColorStop(0,"rgba(0,0,0,1)"),t.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=t,e.fillRect(0,0,128,128),si.material.map=new ei(n),si.material.color.set(0),si.rotation.x=-Math.PI/2}qn.add(wi,si);var Yn=new vt;Bt.add(Yn);var xs=new Le(new ln(1,.12,8,32),new on({color:16757575,depthTest:!1,transparent:!0,opacity:.9}));xs.renderOrder=10;Yn.add(xs);var Ay=new an(1,16,12),Ry=new on({color:16777215,depthTest:!1,transparent:!0,opacity:.9}),Cy=new on({color:16757575,depthTest:!1,transparent:!0}),Mi=new vt;Yn.add(Mi);var so=new sa(new bt,new zr({color:16777215,depthTest:!1,transparent:!0,opacity:.6}));so.renderOrder=9;Yn.add(so);var Gt={orbit:null},le=null,ct=null,ht=null,mn="body",Xn=-1,ro=!1,nn=!1,In=[],fr=[];function fn(){ct&&(qn.remove(ct.group),Vi(ct.group)),ti(gn,le.look,Et[le.type].bellyDir),ct=ar(le,gn),qn.add(ct.group),Mh(),co()}function Mh(){ys=!0;let n=$r(ct),e=n.getCenter(new I),t=n.getSize(new I),i=Math.max(t.x,t.z)*.42+.15;wi.position.set(e.x,n.min.y-.03,e.z),wi.scale.set(i,1,i),si.position.set(e.x,n.min.y+.004,e.z),si.scale.set(Math.max(t.x,.3)*.75,Math.max(t.z,.3)*.62,1),ct.box=n}function Sh(n){let e=ct.box,t=e.getCenter(new I),i=e.getSize(new I).length()/2,s=i/Math.sin(Xr.degToRad(lt.fov/2))*.74;Gt.orbit.target.copy(t),lt.position.copy(t).add((n||new I(.75,.28,1)).normalize().multiplyScalar(s)),Gt.orbit.minDistance=i*.5,Gt.orbit.maxDistance=s*2.5,Gt.orbit.update()}function co(){ys=!0;let n=nn&&mn==="body";for(Mi.visible=so.visible=n;Mi.children.length;)Mi.remove(Mi.children[0]);if(n){let t=[],i=(ct.frames.m-1)/(le.nodes.length-1);le.nodes.forEach((s,r)=>{let o=ct.frames.C[Math.round(r*i)],a=new Le(Ay,r===Xn?Cy:Ry);a.position.copy(o),a.userData.node=r,a.renderOrder=11,Mi.add(a),t.push(o)}),so.geometry.dispose(),so.geometry=new bt().setFromPoints(t)}let e=ht&&ht!=="body"&&ct.parts.get(ht);xs.visible=!!(nn&&e&&e.userData.anchor),xs.visible&&xs.position.copy(e.userData.anchor)}function pn(){var e;let n=JSON.stringify(le);In[In.length-1]!==n&&(In.push(n),In.length>60&&In.shift(),fr=[]),Mt.set("cc.current",le),nn&&((e=document.activeElement)==null?void 0:e.tagName)!=="INPUT"&&Th()}function Wd(n){le=JSON.parse(n),ht&&ht!=="body"&&!le.parts.find(e=>e.id===ht)&&(ht=null),fn(),Ei(),Mt.set("cc.current",le)}var ao=n=>le.parts.find(e=>e.id===n),xh=new On(256,256,{samples:4}),eo=new zt(30,1,.01,100);function Jd(n,e,t,i,s){let r=t.getCenter(new I),o=Math.max(t.getSize(new I).length()/2,.01);eo.aspect=n/e,eo.updateProjectionMatrix(),eo.position.copy(r).add(i.clone().normalize().multiplyScalar(o/Math.sin(Xr.degToRad(15))*(n>e?.92:1.02))),eo.lookAt(r),xh.setSize(n,e);let a=Yn.visible;Yn.visible=!1;let c=Tt.toneMapping;Tt.toneMapping=jn,Tt.setRenderTarget(xh),Tt.render(Bt,eo),Tt.setRenderTarget(null),Tt.toneMapping=c,Yn.visible=a;let l=new Uint8Array(n*e*4);Tt.readRenderTargetPixels(xh,0,0,n,e,l);let h=document.createElement("canvas");h.width=n,h.height=e;let u=h.getContext("2d"),m=u.createImageData(n,e),p=new Uint8Array(256);for(let g=0;g<256;g++)p[g]=Math.round(255*Math.pow(Math.min(g/255*1.1,1),1/2.2));for(let g=0;g<e;g++)for(let _=0;_<n;_++){let f=((e-1-g)*n+_)*4,d=(g*n+_)*4;m.data[d]=p[l[f]],m.data[d+1]=p[l[f+1]],m.data[d+2]=p[l[f+2]],m.data[d+3]=255}return u.putImageData(m,0,0),h.toDataURL(s||"image/jpeg",.85)}function Ua(n){let e=ct,t=wi.visible;e&&(e.group.visible=!1),ti(gn,n.look,Et[n.type].bellyDir);let i=ar(n,gn);qn.add(i.group),wi.visible=si.visible=!1;let s=Jd(240,192,$r(i),new I(.8,.25,1));return qn.remove(i.group),Vi(i.group),wi.visible=si.visible=t,e&&(e.group.visible=!0,ti(gn,le.look,Et[le.type].bellyDir)),s}var yh={},Py={base:"#9fb6b0",second:"#5c7a76",belly:"#c9d8d2",bellyAmt:.5,pattern:0,patScale:1,cover:"skin",furLen:0,furDroop:0,accent:"#efe6cf",hair:"#d98a3a",membrane:"#d99a8a",eye:"#3f9f6a"};function vh(n){if(yh[n])return yh[n];let e=Ct[n],t={type:"quadruped",sex:"f",dimorph:0,bulk:1,stretch:1,look:Py,parts:[],nodes:[{y:0,z:-.25,rx:.3,ry:.3},{y:0,z:.25,rx:.3,ry:.3}]},i={limbs:[.5,1.9],wings:[.5,.9],tails:[-.9,0],back:[.5,0],mouth:[1.9,Math.PI],eyes:[1.3,1]}[e.cat]||[.6,.6],s=ct;s&&(s.group.visible=!1),ti(gn,t.look,[0,-1,0]);let r=ar(t,gn),o=ii(t,n,r.frames,i,{mirror:!1,size:e.kind==="surface"?.3:e.ridge?.18:.7}),a=Ta(r,o);r.body.visible=e.ridge||n==="shell",qn.add(r.group);let c=wi.visible;wi.visible=si.visible=!1;let l=Bt.background;Bt.background=new Re(1452075);let h=new Mn().setFromObject(e.ridge?r.group:a),u={mouth:[1,.3,.8],eyes:[.6,.2,1],tails:[1,.3,-.3],limbs:[1,.15,.7]}[e.cat]||[1,.4,.8],m=Jd(112,112,h,new I(...u),"image/png");return Bt.background=l,wi.visible=si.visible=c,qn.remove(r.group),Vi(r.group),s&&(s.group.visible=!0,ti(gn,le.look,Et[le.type].bellyDir)),yh[n]=m}var to={x:0,y:0,w:1,h:1};function _r(){let n=window.innerWidth,e=window.innerHeight;if(Tt.setSize(n,e,!1),Xi.active){lt.clearViewOffset(),lt.aspect=n/e,lt.zoom=1,lt.updateProjectionMatrix();return}let t=0,i=0,s=0;nn&&(t=At("left").getBoundingClientRect().right,s=At("topbar").getBoundingClientRect().bottom,i=At("right").classList.contains("hidden")?0:n-At("right").getBoundingClientRect().left),to={x:t,y:s,w:Math.max(n-t-i,50),h:Math.max(e-s,50)},lt.aspect=n/e;let r=t+to.w/2,o=s+to.h/2;lt.setViewOffset(n,e,n/2-r,e/2-o,n,e),lt.zoom=Math.min(to.w,to.h*1.15)*.82/e,lt.updateProjectionMatrix(),ys=!0}window.addEventListener("resize",()=>{nn&&!Xi.active?Ei():_r()});var Xd=performance.now();function Kd(n){requestAnimationFrame(Kd);let e=Math.min((n-Xd)/1e3,.1);if(Xd=n,window.__ccPause)return;if(Xi.active){Xi.update(e,n/1e3),Tt.render(Bt,lt);return}if(!nn||!ct||(Gt.orbit.autoRotate=ro,Gt.orbit.update(e),Wi&&(Wi=!1,fn()),!ys&&!ro))return;ys=!1;let i=lt.position.distanceTo(Gt.orbit.target)*.0075/lt.zoom;Mi.children.forEach(s=>s.scale.setScalar(i*(s.userData.node===Xn?1.5:1.1))),xs.scale.setScalar(i*1.7),xs.quaternion.copy(lt.quaternion),Tt.render(Bt,lt)}var Wi=!1,ys=!0,Iy=()=>{ys=!0},lo=new ua,Yd=new ye,it={id:-1,x:0,y:0,t:0,mode:null,moved:!1,node:-1,count:0};function Na(n){Yd.set(n.clientX/window.innerWidth*2-1,-(n.clientY/window.innerHeight)*2+1),lo.setFromCamera(Yd,lt)}function wh(){let n=lo.intersectObject(ct.group,!0);for(let e of n){let t=e.object;for(;t&&!t.userData.partId;)t=t.parent;if(t)return t.userData.partId}return null}vs.addEventListener("pointerdown",n=>{if(nn){if(it.count++,it.count>1){it.mode&&jd(),it.mode=null,Gt.orbit.enabled=!0;return}if(Object.assign(it,{id:n.pointerId,x:n.clientX,y:n.clientY,t:performance.now(),mode:null,moved:!1}),Na(n),mn==="body"){let e=lo.intersectObjects(Mi.children),t=-1,i=20;if(Mi.children.forEach(s=>{let r=s.position.clone().project(lt),o=(r.x*.5+.5)*innerWidth-n.clientX,a=(-r.y*.5+.5)*innerHeight-n.clientY,c=Math.hypot(o,a);c<i&&(i=c,t=s.userData.node)}),e.length&&(t=e[0].object.userData.node),t>=0){it.mode="node",it.node=t,Xn=t,Gt.orbit.enabled=!1,co(),Wn();return}}ht&&ht!=="body"&&wh()===ht&&(it.mode="part",Gt.orbit.enabled=!1,Zr(ct,ht))}},!0);vs.addEventListener("pointermove",n=>{if(!(!nn||n.pointerId!==it.id)&&(Math.hypot(n.clientX-it.x,n.clientY-it.y)>9&&(it.moved=!0),!(!it.mode||!it.moved))){if(Na(n),it.mode==="node"){let e=lo.ray.intersectPlane(new vn(new I(1,0,0),0),new I);if(e){let t=le.nodes[it.node];t.y=e.y,t.z=e.z,Wi=!0}}else if(it.mode==="part"){let e=lo.intersectObject(ct.body,!1)[0];if(e&&e.uv){let t=ao(ht);t.u=e.uv.x,t.a=e.uv.y*Math.PI*2,t.mirror&&(t.a=th(t).a),Ta(ct,t),co()}}}});function jd(){it.mode==="part"&&(Zr(ct),Mh()),it.mode&&it.moved&&pn(),Gt.orbit.enabled=!0}function Qd(n){if(!nn||(it.count=Math.max(0,it.count-1),n.pointerId!==it.id))return;it.id=-1;let e=!it.moved&&performance.now()-it.t<450;if(jd(),e&&it.mode!=="node"){Na(n);let t=wh();mr(t)}it.mode=null}vs.addEventListener("pointerup",Qd);vs.addEventListener("pointercancel",Qd);function mr(n){if(ht=n,n&&n!=="body"){let e=Ct[ao(n).kind].cat;mn!==e&&(mn=e)}n==="body"&&(mn="body"),Ei()}function tn(n,e,t,i,s,r,o){let a=J("span",null,""),c=J("input",{type:"range",min:e,max:t,step:o||(t-e)/200,value:i,oninput:()=>{s(parseFloat(c.value))},onchange:()=>{(r||pn)(parseFloat(c.value))}});return J("div",{class:"sl"},J("label",null,n,a),c)}function pr(n,e,t){return J("div",{class:"chips"},n.map(([i,s])=>J("button",{class:i===e?"on":"",onclick:()=>t(i)},s)))}var Ly=["#f4f0e6","#d9d2c2","#a8a29a","#6b6660","#3a3632","#14100e","#f3e6d0","#e8c9a0","#c99573","#a06a45","#6b4a2e","#3a2616","#f2c230","#e8a020","#d9702a","#c8501c","#a8301c","#701818","#f2a0b0","#e06a8a","#c4472e","#b03080","#7a3aa0","#4a2a7a","#bfe8e0","#7fc4d0","#3a9fc2","#2f7fc2","#1f4f9a","#1c2f5a","#c8e6a0","#9fb86a","#4faa4a","#2f6b3a","#1f4a3a","#12281a","#e6dfa0","#b8b060","#7a8a3a","#8fb0ab"],Dy=[["base","Main"],["second","Pattern"],["belly","Belly"],["eye","Eyes"],["accent","Horn, claw"],["hair","Hair, feather"],["membrane","Wing skin"]],no="base",Uy=n=>n==="eye";function Gi(n,e,t){le.look[n]=e,Uy(n)||n==="cover"?t||n==="cover"?fn():Wi=!0:ti(gn,le.look,Et[le.type].bellyDir),ys=!0,t&&pn()}function Ny(){let n=At("tabs");n.replaceChildren();for(let[e,t]of[["body","Body"],...Sa,["skin","Skin"]])n.append(J("button",{class:mn===e?"on":"",onclick:()=>{mn=e,ht=null,Ei()}},t))}var bh=()=>window.innerWidth<1e3;function Wn(){let n=At("left");if(n.replaceChildren(),n.scrollTop=0,bh()&&ht&&ht!=="body"&&ao(ht)){Eh(n,ao(ht));return}if(mn==="body"){if(n.append(J("h3",null,"Body shape"),J("p",{class:"note"},"Drag the white dots to bend and stretch the spine. Tap a dot to change how thick the body is there.")),Xn>=0&&le.nodes[Xn]){let i=le.nodes[Xn];n.append(J("h4",null,"Selected section"),tn("Width",.02,.6,i.rx,s=>{i.rx=s,Wi=!0}),tn("Depth",.02,.6,i.ry,s=>{i.ry=s,Wi=!0}),J("div",{class:"row"},J("button",{onclick:()=>{let s=Math.min(Xn,le.nodes.length-2),r=le.nodes[s],o=le.nodes[s+1],a=le.nodes.length-1;le.nodes.splice(s+1,0,{y:(r.y+o.y)/2,z:(r.z+o.z)/2,rx:(r.rx+o.rx)/2,ry:(r.ry+o.ry)/2,role:o.role});for(let c of le.parts)if(c.u>=0&&c.u<=1){let l=c.u*a;c.u=(l>s?l<s+1?s+(l-s)*2:l+1:l)/(a+1)}Xn=s+1,fn(),pn(),Wn()}},"Add section"),J("button",{class:"warn",disabled:le.nodes.length<=3,onclick:()=>{let s=le.nodes.length-1,r=Xn;le.nodes.splice(r,1);for(let o of le.parts)if(o.u>=0&&o.u<=1){let a=o.u*s;o.u=Vn((a>r?a-1:a)/(s-1),0,1)}Xn=-1,fn(),pn(),Wn()}},"Remove")))}let t=i=>{let s=le.nodes.reduce((o,a)=>o+a.y,0)/le.nodes.length,r=le.nodes.reduce((o,a)=>o+a.z,0)/le.nodes.length;for(let o of le.nodes)o.y=s+(o.y-s)*i,o.z=r+(o.z-r)*i;fn(),pn()};n.append(J("h4",null,"Whole body"),J("div",{class:"row"},J("button",{onclick:()=>t(1.08)},"Longer"),J("button",{onclick:()=>t(1/1.08)},"Shorter")),tn("Bulk",.5,1.8,le.bulk,i=>{le.bulk=i,Wi=!0}),J("h4",null,"Male / female"),J("p",{class:"note"},"How different the two sexes look: build, limb thickness, and the size of horns, crests and manes."),tn("Difference",0,1.6,le.dimorph,i=>{le.dimorph=i,Wi=!0}));return}if(mn==="skin"){let t=le.look;n.append(J("h3",null,"Skin and colour"),J("h4",null,"Covering"),pr([["skin","Smooth"],["fur","Fur"],["scales","Scales"],["chitin","Shell"],["slime","Slick"]],t.cover,r=>{Gi("cover",r,!0),Wn()})),t.cover==="fur"&&n.append(tn("Fur length",0,1,t.furLen,r=>Gi("furLen",r)),tn("Shagginess",0,1,t.furDroop,r=>Gi("furDroop",r))),n.append(J("h4",null,"Colours"),J("div",{class:"cols"},Dy.map(([r,o])=>J("button",{class:"colbtn"+(no===r?" on":""),onclick:()=>{no=r,Wn()}},J("i",{style:"background:"+t[r]}),o))),J("div",{class:"sw"},Ly.map(r=>J("button",{style:"background:"+r,onclick:()=>{Gi(no,r,!0),Wn()}}))));let i={};new Re(t[no]).getHSL(i);let s=r=>{Gi(no,"#"+new Re().setHSL(i.h,i.s,i.l).getHexString(),r),r&&Wn()};n.append(tn("Hue",0,1,i.h,r=>{i.h=r,s()},()=>s(!0)),tn("Richness",0,1,i.s,r=>{i.s=r,s()},()=>s(!0)),tn("Lightness",.03,.97,i.l,r=>{i.l=r,s()},()=>s(!0)),J("h4",null,"Pattern"),pr([[0,"Plain"],[1,"Stripes"],[2,"Spots"],[3,"Patches"],[4,"Mosaic"],[5,"Saddle"],[6,"Speckle"],[7,"Bands"]],t.pattern,r=>{Gi("pattern",r,!0),Wn()}),tn("Pattern size",.3,3.5,3.8-t.patScale,r=>Gi("patScale",3.8-r)),tn("Belly colour",0,1,t.bellyAmt,r=>Gi("bellyAmt",r)),J("div",{class:"row"},J("button",{onclick:()=>{let r=Math.random(),o=(a,c,l)=>"#"+new Re().setHSL((a+1)%1,c,l).getHexString();Object.assign(t,{base:o(r,.3+Math.random()*.5,.3+Math.random()*.35),second:o(r+(Math.random()-.5)*.5,.4+Math.random()*.4,.12+Math.random()*.3),belly:o(r+.05,.25,.8),hair:o(r+.5*Math.random(),.5,.25+Math.random()*.3),membrane:o(r+.08,.45,.6),eye:o(Math.random(),.75,.45),pattern:Math.floor(Math.random()*8)}),fn(),pn(),Wn()}},"Surprise me")));return}n.append(J("h3",null,Sa.find(t=>t[0]===mn)[1]),J("p",{class:"note"},"Tap to add. Then tap the part on your creature and drag it where you want it."));let e=J("div",{class:"grid"});for(let[t,i]of Object.entries(Ct))i.cat===mn&&(fh(nt,t)?e.append(J("button",{class:"tile",onclick:()=>{let s=ii(le,t,ct.frames);fn(),pn(),mr(s.id)}},J("img",{src:vh(t),alt:""}),i.n)):e.append(J("button",{class:"tile locked",onclick:()=>oo("part:"+t,Kr[t],i.n,Wn)},J("img",{src:vh(t),alt:""}),i.n,J("small",null,"Locked \xB7 "+Kr[t]))));n.append(e)}var Fy={human:"Toes",paw:"Paw",hoof:"Hoof",talon:"Talons",webbed:"Webbed",stump:"Stump",point:"Spike",none:"None",claw:"Claws",pincer:"Pincer",mitt:"Mitt"};function ky(){let n=At("right"),e=ht&&ht!=="body"?ao(ht):null;n.classList.toggle("hidden",!e||bh()),n.replaceChildren(),e&&!bh()&&Eh(n,e)}function Eh(n,e){var a;let t=Ct[e.kind],i=()=>{n.replaceChildren(),Eh(n,e)},s=()=>{Ta(ct,e),co()},r=()=>{Zr(ct),Mh(),pn()},o=e.size;n.append(J("h3",null,t.n),J("p",{class:"note"},t.ridge?"Drag it along the body to move the row.":"Drag it on the creature to move it."),tn(t.cat==="limbs"?"Length":"Size",-2,2,0,c=>{e.size=o*Math.pow(2,c),s()},r));for(let[c,l]of Object.entries(t.P||{})){if(c==="suckers"){n.append(pr([[1,"Suckers"],[0,"Smooth"]],e.p[c],h=>{e.p[c]=h,s(),r(),i()}));continue}n.append(tn(l[3],l[0],l[1],(a=e.p[c])!=null?a:l[2],h=>{e.p[c]=h,s()},r,["count","feathers","tines"].includes(c)?1:0))}if(t.C)for(let[c,l]of Object.entries(t.C))n.append(J("h4",null,l.includes("paw")?"Foot":"Hand"),pr(l.map(h=>[h,Fy[h]]),e.p[c],h=>{e.p[c]=h,s(),r(),i()}));t.kind==="surface"&&n.append(J("h4",null,"Angle"),tn("Twist",-3.14,3.14,e.rot,c=>{e.rot=c,s()},r),tn("Tilt",-1.5,1.5,e.tilt,c=>{e.tilt=c,s()},r)),n.append(J("h4",null,"Pair"),pr([[!0,"Mirrored pair"],[!1,"Single"]],e.mirror,c=>{e.mirror=c,s(),r(),i()})),n.append(J("h4",null,"Shown on"),pr([[null,"Both"],["f","Female only"],["m","Male only"]],e.sexOnly,c=>{e.sexOnly=c,s(),r(),i()}),J("div",{class:"row",style:"margin-top:10px"},J("button",{onclick:()=>{let c=JSON.parse(JSON.stringify(e));c.id="p"+Date.now().toString(36),c.u=Vn(c.u-.08,-.9,1.9),le.parts.push(c),fn(),pn(),mr(c.id)}},"Copy"),J("button",{class:"warn",onclick:()=>{le.parts=le.parts.filter(c=>c.id!==e.id),ht=null,fn(),pn(),Ei()}},"Delete")),J("div",{class:"row"},J("button",{onclick:()=>mr(null)},"Done")))}function Th(){At("topbar").replaceChildren(J("button",{onclick:ef},"Home"),J("input",{value:le.name,maxLength:30,onchange:e=>{le.name=e.target.value||"Creature",pn()}}),J("div",{class:"seg"},J("button",{class:le.sex==="f"?"on":"",onclick:()=>qd("f")},"Female"),J("button",{class:le.sex==="m"?"on":"",onclick:()=>qd("m")},"Male")),J("button",{disabled:In.length<2,onclick:()=>{In.length>1&&(fr.push(In.pop()),Wd(In[In.length-1]))}},"Undo"),J("button",{disabled:!fr.length,onclick:()=>{if(fr.length){let e=fr.pop();In.push(e),Wd(e)}}},"Redo"),J("button",{class:ro?"on":"",onclick:()=>{ro=!ro,Th()}},"Spin"),J("button",{onclick:By},"Photo"),J("button",{onclick:()=>Ah()},"Save"),J("button",{class:"battle",onclick:Rh},"Battle"))}function qd(n){le.sex=n,fn(),pn(),Ei()}function Ei(){Ny(),Wn(),ky(),Th(),_r(),co(),At("hint").textContent=ht&&ht!=="body"?"":"Drag to spin. Pinch to zoom. Tap a part to select it."}function Ah(n){le.id||(le.id="c"+Date.now().toString(36));let e=Mt.get("cc.saved",[]).filter(t=>t.id!==le.id);e.unshift({id:le.id,name:le.name,thumb:Ua(le),data:JSON.parse(JSON.stringify(le))}),Mt.set("cc.saved",e),Mt.set("cc.current",le),n||ri('Saved "'+le.name+'"')}var nt=Mt.get("cc.meta",null);if(!nt){nt=Object.assign(uh(),Mt.get("cc.record",{}));for(let n of[...Mt.get("cc.saved",[]).map(e=>e.data),Mt.get("cc.current",null)])n&&!hh.includes(n.type)&&(nt.unlocked["type:"+n.type]=!0)}nt=Object.assign(uh(),nt);var gr=()=>Mt.set("cc.meta",nt);function oo(n,e,t,i){if(nt.points<e){ri("Not enough points: "+t+" costs "+e+", you have "+nt.points+".");return}confirm("Unlock "+t+" for "+e+" points?")&&(nt.points-=e,nt.unlocked[n]=!0,gr(),ri("Unlocked "+t),i&&i())}var Xi=Gd({scene:Bt,camera:lt,M:gn,h:J,store:Mt,onDone:Oy,meta:()=>nt,saveMeta:gr});function Rh(n){Ah(!0),ht=null,Gt.orbit.enabled=!1,At("editor").classList.add("hidden"),At("start").classList.add("hidden"),qn.visible=Yn.visible=!1,ti(gn,le.look,Et[le.type].bellyDir),Xi.start(le,n&&n.id===le.id?n:null),_r()}function Oy(n){qn.visible=Yn.visible=!0,Gt.orbit.enabled=!0,gn.U.uInv.value.identity();for(let t of[gn.skin,...gn.shells])t.emissive.setRGB(0,0,0);let e=nt;if(n.type==="dead"){e.fallen++,gr(),Mt.set("cc.saved",Mt.get("cc.saved",[]).filter(t=>t.id!==le.id)),Mt.set("cc.current",null),ct&&(qn.remove(ct.group),Vi(ct.group),ct=null),le=null,nn=!1,At("start").classList.remove("hidden"),dn(),_r();return}n.type==="champion"&&(e.points+=n.points,e.champions++,gr(),le.champion=(le.champion||0)+1),nn=!0,At("editor").classList.remove("hidden"),fn(),n.type==="champion"&&Ah(!0),Ei(),Sh(),n.type==="champion"&&ri(le.name+" is champion! +"+n.points+" points")}function By(){let t=Tt.getPixelRatio(),i=lt.zoom;Yn.visible=!1,Tt.setPixelRatio(1),Tt.setSize(1920,1080,!1),lt.clearViewOffset(),lt.aspect=1920/1080,lt.zoom=i,lt.updateProjectionMatrix(),Tt.render(Bt,lt);let s=vs.toDataURL("image/png");Yn.visible=!0,Tt.setPixelRatio(t),lt.zoom=i,_r(),Tt.render(Bt,lt);let r=(le.name||"creature").replace(/[^\w-]+/g,"_")+"_"+Date.now().toString(36)+".png";window.Android&&window.Android.savePng?window.Android.savePng(s.split(",")[1],r):(J("a",{href:s,download:r}).click(),ri("Photo downloaded"))}window.ccToast=ri;window.ccBack=()=>Xi.active?Xi.back():!nn&&Si?(Si=null,dn(),!0):nn?(ht?mr(null):ef(),!0):!1;function io(n){let e=Mt.get("cc.run",null);e&&n.id&&e.id===n.id&&(Mt.set("cc.run",null),ri("Gauntlet abandoned. It starts again from fight one.")),le=n,ht=null,Xn=-1,mn="body",In=[],fr=[],nn=!0,le.sex===void 0&&(le.sex="f"),At("start").classList.add("hidden"),At("editor").classList.remove("hidden"),fn(),pn(),Ei(),Sh()}function ef(){Mt.set("cc.current",le),nn=!1,At("editor").classList.add("hidden"),At("start").classList.remove("hidden"),dn()}var Da={},Si=null;function zy(){let n=At("start"),e=(r,o,a,c,l,h,u)=>J("div",{class:"shoprow"+(l?" owned":"")},J("div",{class:"ico"},r),J("div",{class:"what"},J("b",null,o),u&&J("small",{class:"req"},u),J("small",null,a)),l?J("span",{class:"have"},typeof l=="string"?l:"Owned"):J("button",{class:nt.points>=c?"go":"",onclick:h},c+" pts")),t=r=>cr.filter(o=>o.cat===r).sort((o,a)=>o.cost-a.cost).map(o=>e(o.icon,o.name,La({id:o.id,cat:r,q:1,rar:0,lvl:1}),o.cost,ph(nt,o)&&(o.cost?"Owned":"Free"),()=>oo("item:"+r+":"+o.id,o.cost,o.name,dn),o.reqText?"Needs "+o.reqText:o.hands===2?"Needs two free hands":"")),i={Bodies:()=>Object.entries(Et).map(([r,o])=>e("\u{1F9EC}",o.name,o.blurb,hr[r],Pa(nt,r)&&(hr[r]?"Owned":"Free"),()=>oo("type:"+r,hr[r],"the "+o.name+" body",dn))),Parts:()=>Object.entries(Kr).map(([r,o])=>e(J("img",{src:vh(r),alt:""}),Ct[r].n,"Body part for the workshop ("+Sa.find(a=>a[0]===Ct[r].cat)[1]+").",o,fh(nt,r),()=>oo("part:"+r,o,Ct[r].n,dn))),Weapons:()=>t("weapon"),Abilities:()=>t("ability"),Relics:()=>t("relic"),Boosts:()=>kd.map(r=>{let o=r.consumable?nt.revives:nt.boosts[r.id]||0,a=o>=r.max,c=r.cost(o);return e(r.icon,r.name+(r.consumable?" (holding "+o+")":r.max>1?" (level "+o+" of "+r.max+")":""),r.text,c,a&&(r.consumable?"Full":"Maxed"),()=>{if(nt.points<c){ri("Not enough points: "+r.name+" costs "+c+", you have "+nt.points+".");return}nt.points-=c,r.consumable?nt.revives++:nt.boosts[r.id]=o+1,gr(),dn()})})},s={Weapons:"Weapons you own can turn up as rewards after a fight. A creature holds one per hand.",Abilities:"Abilities you own can turn up as rewards, if the creature has the right body for them.",Relics:"Relics are passive rewards that stack. Many only work, or work better, with the right body.",Parts:"Extra parts for building creatures. Starter creatures may already carry some of these.",Bodies:"New body types to start from.",Boosts:"Permanent upgrades, and revives."};n.replaceChildren(J("h1",null,"The ",J("span",null,"Shop"),J("small",{class:"record"},J("b",null,nt.points+" points")," ",J("button",{class:"shopbtn",onclick:()=>{Si=null,dn()}},"Back"))),J("div",{class:"chips",style:"margin-top:10px"},Object.keys(i).map(r=>J("button",{class:r===Si?"on":"",onclick:()=>{Si=r,dn()}},r))),J("p",{class:"note"},s[Si]+" Points come from every fight won (more for later fights) and a big bonus for the title."),J("div",{class:"shop"},i[Si]())),n.scrollTop=0}function dn(){let n=At("start"),e=Mt.get("cc.saved",[]),t=Mt.get("cc.current",null);if(Si){zy();return}let i=nt,s=Mt.get("cc.run",null),r=s&&t&&t.id===s.id;n.replaceChildren(...[J("h1",null,"Creature ",J("span",null,"Workshop"),J("small",{class:"record"},J("button",{class:"shopbtn",onclick:()=>{Si="Bodies",dn()}},"Shop")," ",J("b",null,i.points+" points")," \xB7 "+i.champions+(i.champions===1?" champion":" champions")+" \xB7 "+i.fallen+" fallen")),r&&J("div",{class:"card resume",onclick:()=>{le=t,Rh(s)}},J("b",null,"Gauntlet in progress"),J("small",null,t.name+" is waiting for fight "+(s.round+1)+" of 10. Tap to return to the Colosseum.")),J("h2",null,"Start from a body type"),J("div",{class:"cards"},J("div",{class:"card",onclick:()=>{let o=Object.keys(Et).filter(a=>Pa(nt,a));io(Qr(Math.random,{type:o[Math.floor(Math.random()*o.length)]}))}},J("div",{class:"dice"},"?"),J("b",null,"Random"),J("small",null,"Roll a surprise creature")),Object.entries(Et).map(([o,a])=>Pa(nt,o)?J("div",{class:"card",onclick:()=>io(gs(o))},J("img",{src:Da[o]||(Da[o]=Ua(gs(o))),alt:""}),J("b",null,a.name),J("small",null,a.blurb)):J("div",{class:"card locked",onclick:()=>oo("type:"+o,hr[o],"the "+a.name+" body",dn)},J("img",{src:Da[o]||(Da[o]=Ua(gs(o))),alt:""}),J("b",null,a.name),J("small",null,"Locked \xB7 "+hr[o]+" points"))))].filter(Boolean)),(t||e.length)&&n.append(J("h2",null,"Your creatures"),J("div",{class:"cards"},t&&J("div",{class:"card",onclick:()=>io(t)},J("img",{src:Ua(t),alt:""}),J("b",null,"Continue"),J("small",null,t.name)),e.map(o=>J("div",{class:"card",onclick:()=>io(JSON.parse(JSON.stringify(o.data)))},J("img",{src:o.thumb,alt:""}),J("b",null,o.name),J("small",null,Et[o.data.type].name+(o.data.champion?" \xB7 Champion"+(o.data.champion>1?" x"+o.data.champion:""):"")),J("button",{class:"del warn",onclick:a=>{a.stopPropagation(),confirm('Delete "'+o.name+'"?')&&(Mt.set("cc.saved",Mt.get("cc.saved",[]).filter(c=>c.id!==o.id)),dn())}},"\xD7")))))}Gt.orbit=new _a(lt,vs);Object.assign(Gt.orbit,{enableDamping:!0,dampingFactor:.12,enablePan:!1,autoRotateSpeed:2.2,rotateSpeed:.9,maxPolarAngle:Math.PI*.62,minPolarAngle:.15});Gt.orbit.addEventListener("change",Iy);_r();dn();requestAnimationFrame(Kd);window.__cc={get data(){return le},get cr(){return ct},open:io,newCreature:gs,select:mr,PARTS:Ct,TEMPLATES:Et,setTab:n=>{mn=n,Ei()},camera:lt,controls:Gt,fitCamera:Sh,rebuild:fn,renderer:Tt,scene:Bt,arena:Xi,get meta(){return nt},saveMeta:gr,renderStart:dn,enterBattle:Rh,randomCreature:Qr,addPartTest:n=>ii(le,n,ct.frames),pickAt:(n,e)=>(Na({clientX:n,clientY:e}),wh()),state:()=>({sel:ht,tab:mn,down:{...it}})};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
