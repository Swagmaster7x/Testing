(()=>{var ms={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},gs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},jf=0,uu=1,Qf=2;var Md=1,eh=2,vi=3,Wi=0,tn=1,Pt=2,Vi=0,Gi=1,Fr=2,du=3,fu=4,ep=5,os=100,tp=101,np=102,ip=103,sp=104,rp=200,ap=201,op=202,lp=203,Nl=204,kl=205,cp=206,hp=207,up=208,dp=209,fp=210,pp=211,mp=212,gp=213,_p=214,Fl=0,Ol=1,Bl=2,Zs=3,zl=4,Hl=5,Vl=6,Gl=7,Sd=0,yp=1,xp=2,oi=0,vp=1,bp=2,Mp=3,th=4,Sp=5,wp=6,Ep=7;var wd=300,$s=301,Js=302,Wl=303,Xl=304,wo=306,Or=1e3,hs=1001,Yl=1002,An=1003,Tp=1004;var xa=1005;var ri=1006,tl=1007;var us=1008;var Si=1009,Ed=1010,Td=1011,Br=1012,nh=1013,ds=1014,ai=1015,$r=1016,ih=1017,sh=1018,Ks=1020,Ad=35902,Rd=1021,Cd=1022,Xn=1023,Pd=1024,Id=1025,Xs=1026,js=1027,rh=1028,ah=1029,Ld=1030,oh=1031;var lh=1033,qa=33776,Za=33777,$a=33778,Ja=33779,ql=35840,Zl=35841,$l=35842,Jl=35843,Kl=36196,jl=37492,Ql=37496,ec=37808,tc=37809,nc=37810,ic=37811,sc=37812,rc=37813,ac=37814,oc=37815,lc=37816,cc=37817,hc=37818,uc=37819,dc=37820,fc=37821,Ka=36492,pc=36494,mc=36495,Dd=36283,gc=36284,_c=36285,yc=36286;var ja=2300,xc=2301,nl=2302,pu=2400,mu=2401,gu=2402;var Ap=3200,Rp=3201;var Ud=0,Cp=1,Hi="",zt="srgb",sr="srgb-linear",Eo="linear",lt="srgb";var Rs=7680;var _u=519,Pp=512,Ip=513,Lp=514,Nd=515,Dp=516,Up=517,Np=518,kp=519,yu=35044;var xu="300 es",bi=2e3,Qa=2001,wi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let i=this._listeners[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],vu=1234567,Ur=Math.PI/180,zr=180/Math.PI;function rr(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Qt[n&255]+Qt[n>>8&255]+Qt[n>>16&255]+Qt[n>>24&255]+"-"+Qt[e&255]+Qt[e>>8&255]+"-"+Qt[e>>16&15|64]+Qt[e>>24&255]+"-"+Qt[t&63|128]+Qt[t>>8&255]+"-"+Qt[t>>16&255]+Qt[t>>24&255]+Qt[i&255]+Qt[i>>8&255]+Qt[i>>16&255]+Qt[i>>24&255]).toLowerCase()}function Lt(n,e,t){return Math.max(e,Math.min(t,n))}function ch(n,e){return(n%e+e)%e}function Fp(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Op(n,e,t){return n!==e?(t-n)/(e-n):0}function Nr(n,e,t){return(1-t)*n+t*e}function Bp(n,e,t,i){return Nr(n,e,1-Math.exp(-t*i))}function zp(n,e=1){return e-Math.abs(ch(n,e*2)-e)}function Hp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Vp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Gp(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Wp(n,e){return n+Math.random()*(e-n)}function Xp(n){return n*(.5-Math.random())}function Yp(n){n!==void 0&&(vu=n);let e=vu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function qp(n){return n*Ur}function Zp(n){return n*zr}function $p(n){return(n&n-1)===0&&n!==0}function Jp(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Kp(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function jp(n,e,t,i,s){let r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),h=r((e+i)/2),l=a((e+i)/2),u=r((e-i)/2),d=a((e-i)/2),p=r((i-e)/2),g=a((i-e)/2);switch(s){case"XYX":n.set(o*l,c*u,c*d,o*h);break;case"YZY":n.set(c*d,o*l,c*u,o*h);break;case"ZXZ":n.set(c*u,c*d,o*l,o*h);break;case"XZX":n.set(o*l,c*g,c*p,o*h);break;case"YXY":n.set(c*p,o*l,c*g,o*h);break;case"ZYZ":n.set(c*g,c*p,o*l,o*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Gs(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function rn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Jr={DEG2RAD:Ur,RAD2DEG:zr,generateUUID:rr,clamp:Lt,euclideanModulo:ch,mapLinear:Fp,inverseLerp:Op,lerp:Nr,damp:Bp,pingpong:zp,smoothstep:Hp,smootherstep:Vp,randInt:Gp,randFloat:Wp,randFloatSpread:Xp,seededRandom:Yp,degToRad:qp,radToDeg:Zp,isPowerOfTwo:$p,ceilPowerOfTwo:Jp,floorPowerOfTwo:Kp,setQuaternionFromProperEuler:jp,normalize:rn,denormalize:Gs},Re=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Lt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ge=class n{constructor(e,t,i,s,r,a,o,c,h){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,h)}set(e,t,i,s,r,a,o,c,h){let l=this.elements;return l[0]=e,l[1]=s,l[2]=o,l[3]=t,l[4]=r,l[5]=c,l[6]=i,l[7]=a,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],h=i[1],l=i[4],u=i[7],d=i[2],p=i[5],g=i[8],_=s[0],m=s[3],f=s[6],y=s[1],v=s[4],x=s[7],C=s[2],T=s[5],A=s[8];return r[0]=a*_+o*y+c*C,r[3]=a*m+o*v+c*T,r[6]=a*f+o*x+c*A,r[1]=h*_+l*y+u*C,r[4]=h*m+l*v+u*T,r[7]=h*f+l*x+u*A,r[2]=d*_+p*y+g*C,r[5]=d*m+p*v+g*T,r[8]=d*f+p*x+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],l=e[8];return t*a*l-t*o*h-i*r*l+i*o*c+s*r*h-s*a*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],l=e[8],u=l*a-o*h,d=o*c-l*r,p=h*r-a*c,g=t*u+i*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(s*h-l*i)*_,e[2]=(o*i-s*a)*_,e[3]=d*_,e[4]=(l*t-s*c)*_,e[5]=(s*r-o*t)*_,e[6]=p*_,e[7]=(i*c-h*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){let c=Math.cos(r),h=Math.sin(r);return this.set(i*c,i*h,-i*(c*a+h*o)+a+e,-s*h,s*c,-s*(-h*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(il.makeScale(e,t)),this}rotate(e){return this.premultiply(il.makeRotation(-e)),this}translate(e,t){return this.premultiply(il.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},il=new Ge;function kd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function eo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Qp(){let n=eo("canvas");return n.style.display="block",n}var bu={};function Lr(n){n in bu||(bu[n]=!0,console.warn(n))}function em(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function tm(n){let e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function nm(n){let e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var tt={enabled:!0,workingColorSpace:sr,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===lt&&(n.r=Mi(n.r),n.g=Mi(n.g),n.b=Mi(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===lt&&(n.r=Ys(n.r),n.g=Ys(n.g),n.b=Ys(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Hi?Eo:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Mi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ys(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Mu=[.64,.33,.3,.6,.15,.06],Su=[.2126,.7152,.0722],wu=[.3127,.329],Eu=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tu=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);tt.define({[sr]:{primaries:Mu,whitePoint:wu,transfer:Eo,toXYZ:Eu,fromXYZ:Tu,luminanceCoefficients:Su,workingColorSpaceConfig:{unpackColorSpace:zt},outputColorSpaceConfig:{drawingBufferColorSpace:zt}},[zt]:{primaries:Mu,whitePoint:wu,transfer:lt,toXYZ:Eu,fromXYZ:Tu,luminanceCoefficients:Su,outputColorSpaceConfig:{drawingBufferColorSpace:zt}}});var Cs,vc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Cs===void 0&&(Cs=eo("canvas")),Cs.width=e.width,Cs.height=e.height;let i=Cs.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Cs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=eo("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Mi(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Mi(t[i]/255)*255):t[i]=Mi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},im=0,to=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:im++}),this.uuid=rr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(sl(s[a].image)):r.push(sl(s[a]))}else r=sl(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function sl(n){return typeof HTMLImageElement!="undefined"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&n instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&n instanceof ImageBitmap?vc.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var sm=0,gn=class n extends wi{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=hs,s=hs,r=ri,a=us,o=Xn,c=Si,h=n.DEFAULT_ANISOTROPY,l=Hi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sm++}),this.uuid=rr(),this.name="",this.source=new to(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Re(0,0),this.repeat=new Re(1,1),this.center=new Re(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==wd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Or:e.x=e.x-Math.floor(e.x);break;case hs:e.x=e.x<0?0:1;break;case Yl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Or:e.y=e.y-Math.floor(e.y);break;case hs:e.y=e.y<0?0:1;break;case Yl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};gn.DEFAULT_IMAGE=null;gn.DEFAULT_MAPPING=wd;gn.DEFAULT_ANISOTROPY=1;var ct=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,h=c[0],l=c[4],u=c[8],d=c[1],p=c[5],g=c[9],_=c[2],m=c[6],f=c[10];if(Math.abs(l-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(h+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(h+1)/2,x=(p+1)/2,C=(f+1)/2,T=(l+d)/4,A=(u+_)/4,I=(g+m)/4;return v>x&&v>C?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=T/i,r=A/i):x>C?x<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),i=T/s,r=I/s):C<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),i=A/r,s=I/r),this.set(i,s,r,t),this}let y=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-l)*(d-l));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-_)/y,this.z=(d-l)/y,this.w=Math.acos((h+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},bc=class extends wi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ct(0,0,e,t),this.scissorTest=!1,this.viewport=new ct(0,0,e,t);let s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ri,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let r=new gn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new to(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Yn=class extends bc{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},no=class extends gn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=hs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Mc=class extends gn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=hs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var qt=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let c=i[s+0],h=i[s+1],l=i[s+2],u=i[s+3],d=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){e[t+0]=c,e[t+1]=h,e[t+2]=l,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(u!==_||c!==d||h!==p||l!==g){let m=1-o,f=c*d+h*p+l*g+u*_,y=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){let C=Math.sqrt(v),T=Math.atan2(C,f*y);m=Math.sin(m*T)/C,o=Math.sin(o*T)/C}let x=o*y;if(c=c*m+d*x,h=h*m+p*x,l=l*m+g*x,u=u*m+_*x,m===1-o){let C=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=C,h*=C,l*=C,u*=C}}e[t]=c,e[t+1]=h,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){let o=i[s],c=i[s+1],h=i[s+2],l=i[s+3],u=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+l*u+c*p-h*d,e[t+1]=c*g+l*d+h*u-o*p,e[t+2]=h*g+l*p+o*d-c*u,e[t+3]=l*g-o*u-c*d-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,h=o(i/2),l=o(s/2),u=o(r/2),d=c(i/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=d*l*u+h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u-d*p*g;break;case"YXZ":this._x=d*l*u+h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u+d*p*g;break;case"ZXY":this._x=d*l*u-h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u-d*p*g;break;case"ZYX":this._x=d*l*u-h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u+d*p*g;break;case"YZX":this._x=d*l*u+h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u-d*p*g;break;case"XZY":this._x=d*l*u-h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],h=t[2],l=t[6],u=t[10],d=i+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(l-c)*p,this._y=(r-h)*p,this._z=(a-s)*p}else if(i>o&&i>u){let p=2*Math.sqrt(1+i-o-u);this._w=(l-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+h)/p}else if(o>u){let p=2*Math.sqrt(1+o-i-u);this._w=(r-h)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+l)/p}else{let p=2*Math.sqrt(1+u-i-o);this._w=(a-s)/p,this._x=(r+h)/p,this._y=(c+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Lt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,h=t._z,l=t._w;return this._x=i*l+a*o+s*h-r*c,this._y=s*l+a*c+r*o-i*h,this._z=r*l+a*h+i*c-s*o,this._w=a*l-i*o-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let h=Math.sqrt(c),l=Math.atan2(h,o),u=Math.sin((1-t)*l)/h,d=Math.sin(t*l)/h;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Au.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Au.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,h=2*(a*s-o*i),l=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+c*h+a*u-o*l,this.y=i+c*l+o*h-r*u,this.z=s+c*u+r*l-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return rl.copy(this).projectOnVector(e),this.sub(rl)}reflect(e){return this.sub(rl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Lt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},rl=new L,Au=new qt,Rn=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Vn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Vn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Vn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Vn):Vn.fromBufferAttribute(r,a),Vn.applyMatrix4(e.matrixWorld),this.expandByPoint(Vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),va.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),va.copy(i.boundingBox)),va.applyMatrix4(e.matrixWorld),this.union(va)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Vn),Vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wr),ba.subVectors(this.max,wr),Ps.subVectors(e.a,wr),Is.subVectors(e.b,wr),Ls.subVectors(e.c,wr),Ni.subVectors(Is,Ps),ki.subVectors(Ls,Is),es.subVectors(Ps,Ls);let t=[0,-Ni.z,Ni.y,0,-ki.z,ki.y,0,-es.z,es.y,Ni.z,0,-Ni.x,ki.z,0,-ki.x,es.z,0,-es.x,-Ni.y,Ni.x,0,-ki.y,ki.x,0,-es.y,es.x,0];return!al(t,Ps,Is,Ls,ba)||(t=[1,0,0,0,1,0,0,0,1],!al(t,Ps,Is,Ls,ba))?!1:(Ma.crossVectors(Ni,ki),t=[Ma.x,Ma.y,Ma.z],al(t,Ps,Is,Ls,ba))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},mi=[new L,new L,new L,new L,new L,new L,new L,new L],Vn=new L,va=new Rn,Ps=new L,Is=new L,Ls=new L,Ni=new L,ki=new L,es=new L,wr=new L,ba=new L,Ma=new L,ts=new L;function al(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){ts.fromArray(n,r);let o=s.x*Math.abs(ts.x)+s.y*Math.abs(ts.y)+s.z*Math.abs(ts.z),c=e.dot(ts),h=t.dot(ts),l=i.dot(ts);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>o)return!1}return!0}var rm=new Rn,Er=new L,ol=new L,Ei=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):rm.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Er.subVectors(e,this.center);let t=Er.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Er,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ol.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Er.copy(e.center).add(ol)),this.expandByPoint(Er.copy(e.center).sub(ol))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},gi=new L,ll=new L,Sa=new L,Fi=new L,cl=new L,wa=new L,hl=new L,Xi=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=gi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gi.copy(this.origin).addScaledVector(this.direction,t),gi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){ll.copy(e).add(t).multiplyScalar(.5),Sa.copy(t).sub(e).normalize(),Fi.copy(this.origin).sub(ll);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Sa),o=Fi.dot(this.direction),c=-Fi.dot(Sa),h=Fi.lengthSq(),l=Math.abs(1-a*a),u,d,p,g;if(l>0)if(u=a*c-o,d=a*o-c,g=r*l,u>=0)if(d>=-g)if(d<=g){let _=1/l;u*=_,d*=_,p=u*(u+a*d+2*o)+d*(a*u+d+2*c)+h}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+h;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+h;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+h):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+h):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+h);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ll).addScaledVector(Sa,d),p}intersectSphere(e,t){gi.subVectors(e.center,this.origin);let i=gi.dot(this.direction),s=gi.dot(gi)-i*i,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,c,h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return h>=0?(i=(e.min.x-d.x)*h,s=(e.max.x-d.x)*h):(i=(e.max.x-d.x)*h,s=(e.min.x-d.x)*h),l>=0?(r=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(r=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,gi)!==null}intersectTriangle(e,t,i,s,r){cl.subVectors(t,e),wa.subVectors(i,e),hl.crossVectors(cl,wa);let a=this.direction.dot(hl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Fi.subVectors(this.origin,e);let c=o*this.direction.dot(wa.crossVectors(Fi,wa));if(c<0)return null;let h=o*this.direction.dot(cl.cross(Fi));if(h<0||c+h>a)return null;let l=-o*Fi.dot(hl);return l<0?null:this.at(l/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},qe=class n{constructor(e,t,i,s,r,a,o,c,h,l,u,d,p,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,h,l,u,d,p,g,_,m)}set(e,t,i,s,r,a,o,c,h,l,u,d,p,g,_,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=h,f[6]=l,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/Ds.setFromMatrixColumn(e,0).length(),r=1/Ds.setFromMatrixColumn(e,1).length(),a=1/Ds.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*l,p=a*u,g=o*l,_=o*u;t[0]=c*l,t[4]=-c*u,t[8]=h,t[1]=p+g*h,t[5]=d-_*h,t[9]=-o*c,t[2]=_-d*h,t[6]=g+p*h,t[10]=a*c}else if(e.order==="YXZ"){let d=c*l,p=c*u,g=h*l,_=h*u;t[0]=d+_*o,t[4]=g*o-p,t[8]=a*h,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=p*o-g,t[6]=_+d*o,t[10]=a*c}else if(e.order==="ZXY"){let d=c*l,p=c*u,g=h*l,_=h*u;t[0]=d-_*o,t[4]=-a*u,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*l,t[9]=_-d*o,t[2]=-a*h,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let d=a*l,p=a*u,g=o*l,_=o*u;t[0]=c*l,t[4]=g*h-p,t[8]=d*h+_,t[1]=c*u,t[5]=_*h+d,t[9]=p*h-g,t[2]=-h,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let d=a*c,p=a*h,g=o*c,_=o*h;t[0]=c*l,t[4]=_-d*u,t[8]=g*u+p,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-h*l,t[6]=p*u+g,t[10]=d-_*u}else if(e.order==="XZY"){let d=a*c,p=a*h,g=o*c,_=o*h;t[0]=c*l,t[4]=-u,t[8]=h*l,t[1]=d*u+_,t[5]=a*l,t[9]=p*u-g,t[2]=g*u-p,t[6]=o*l,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(am,e,om)}lookAt(e,t,i){let s=this.elements;return wn.subVectors(e,t),wn.lengthSq()===0&&(wn.z=1),wn.normalize(),Oi.crossVectors(i,wn),Oi.lengthSq()===0&&(Math.abs(i.z)===1?wn.x+=1e-4:wn.z+=1e-4,wn.normalize(),Oi.crossVectors(i,wn)),Oi.normalize(),Ea.crossVectors(wn,Oi),s[0]=Oi.x,s[4]=Ea.x,s[8]=wn.x,s[1]=Oi.y,s[5]=Ea.y,s[9]=wn.y,s[2]=Oi.z,s[6]=Ea.z,s[10]=wn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],h=i[12],l=i[1],u=i[5],d=i[9],p=i[13],g=i[2],_=i[6],m=i[10],f=i[14],y=i[3],v=i[7],x=i[11],C=i[15],T=s[0],A=s[4],I=s[8],S=s[12],b=s[1],D=s[5],z=s[9],H=s[13],q=s[2],te=s[6],$=s[10],oe=s[14],Y=s[3],fe=s[7],ge=s[11],Pe=s[15];return r[0]=a*T+o*b+c*q+h*Y,r[4]=a*A+o*D+c*te+h*fe,r[8]=a*I+o*z+c*$+h*ge,r[12]=a*S+o*H+c*oe+h*Pe,r[1]=l*T+u*b+d*q+p*Y,r[5]=l*A+u*D+d*te+p*fe,r[9]=l*I+u*z+d*$+p*ge,r[13]=l*S+u*H+d*oe+p*Pe,r[2]=g*T+_*b+m*q+f*Y,r[6]=g*A+_*D+m*te+f*fe,r[10]=g*I+_*z+m*$+f*ge,r[14]=g*S+_*H+m*oe+f*Pe,r[3]=y*T+v*b+x*q+C*Y,r[7]=y*A+v*D+x*te+C*fe,r[11]=y*I+v*z+x*$+C*ge,r[15]=y*S+v*H+x*oe+C*Pe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],h=e[13],l=e[2],u=e[6],d=e[10],p=e[14],g=e[3],_=e[7],m=e[11],f=e[15];return g*(+r*c*u-s*h*u-r*o*d+i*h*d+s*o*p-i*c*p)+_*(+t*c*p-t*h*d+r*a*d-s*a*p+s*h*l-r*c*l)+m*(+t*h*u-t*o*p-r*a*u+i*a*p+r*o*l-i*h*l)+f*(-s*o*l-t*c*u+t*o*d+s*a*u-i*a*d+i*c*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],l=e[8],u=e[9],d=e[10],p=e[11],g=e[12],_=e[13],m=e[14],f=e[15],y=u*m*h-_*d*h+_*c*p-o*m*p-u*c*f+o*d*f,v=g*d*h-l*m*h-g*c*p+a*m*p+l*c*f-a*d*f,x=l*_*h-g*u*h+g*o*p-a*_*p-l*o*f+a*u*f,C=g*u*c-l*_*c-g*o*d+a*_*d+l*o*m-a*u*m,T=t*y+i*v+s*x+r*C;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/T;return e[0]=y*A,e[1]=(_*d*r-u*m*r-_*s*p+i*m*p+u*s*f-i*d*f)*A,e[2]=(o*m*r-_*c*r+_*s*h-i*m*h-o*s*f+i*c*f)*A,e[3]=(u*c*r-o*d*r-u*s*h+i*d*h+o*s*p-i*c*p)*A,e[4]=v*A,e[5]=(l*m*r-g*d*r+g*s*p-t*m*p-l*s*f+t*d*f)*A,e[6]=(g*c*r-a*m*r-g*s*h+t*m*h+a*s*f-t*c*f)*A,e[7]=(a*d*r-l*c*r+l*s*h-t*d*h-a*s*p+t*c*p)*A,e[8]=x*A,e[9]=(g*u*r-l*_*r-g*i*p+t*_*p+l*i*f-t*u*f)*A,e[10]=(a*_*r-g*o*r+g*i*h-t*_*h-a*i*f+t*o*f)*A,e[11]=(l*o*r-a*u*r-l*i*h+t*u*h+a*i*p-t*o*p)*A,e[12]=C*A,e[13]=(l*_*s-g*u*s+g*i*d-t*_*d-l*i*m+t*u*m)*A,e[14]=(g*o*s-a*_*s-g*i*c+t*_*c+a*i*m-t*o*m)*A,e[15]=(a*u*s-l*o*s+l*i*c-t*u*c-a*i*d+t*o*d)*A,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,h=r*a,l=r*o;return this.set(h*a+i,h*o-s*c,h*c+s*o,0,h*o+s*c,l*o+i,l*c-s*a,0,h*c-s*o,l*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,h=r+r,l=a+a,u=o+o,d=r*h,p=r*l,g=r*u,_=a*l,m=a*u,f=o*u,y=c*h,v=c*l,x=c*u,C=i.x,T=i.y,A=i.z;return s[0]=(1-(_+f))*C,s[1]=(p+x)*C,s[2]=(g-v)*C,s[3]=0,s[4]=(p-x)*T,s[5]=(1-(d+f))*T,s[6]=(m+y)*T,s[7]=0,s[8]=(g+v)*A,s[9]=(m-y)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=Ds.set(s[0],s[1],s[2]).length(),a=Ds.set(s[4],s[5],s[6]).length(),o=Ds.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Gn.copy(this);let h=1/r,l=1/a,u=1/o;return Gn.elements[0]*=h,Gn.elements[1]*=h,Gn.elements[2]*=h,Gn.elements[4]*=l,Gn.elements[5]*=l,Gn.elements[6]*=l,Gn.elements[8]*=u,Gn.elements[9]*=u,Gn.elements[10]*=u,t.setFromRotationMatrix(Gn),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=bi){let c=this.elements,h=2*r/(t-e),l=2*r/(i-s),u=(t+e)/(t-e),d=(i+s)/(i-s),p,g;if(o===bi)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Qa)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=bi){let c=this.elements,h=1/(t-e),l=1/(i-s),u=1/(a-r),d=(t+e)*h,p=(i+s)*l,g,_;if(o===bi)g=(a+r)*u,_=-2*u;else if(o===Qa)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Ds=new L,Gn=new qe,am=new L(0,0,0),om=new L(1,1,1),Oi=new L,Ea=new L,wn=new L,Ru=new qe,Cu=new qt,_n=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],l=s[9],u=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Lt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Lt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Lt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Lt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Lt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Lt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-l,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Ru.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ru,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Cu.setFromEuler(this),this.setFromQuaternion(Cu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};_n.DEFAULT_ORDER="XYZ";var Hr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},lm=0,Pu=new L,Us=new qt,_i=new qe,Ta=new L,Tr=new L,cm=new L,hm=new qt,Iu=new L(1,0,0),Lu=new L(0,1,0),Du=new L(0,0,1),Uu={type:"added"},um={type:"removed"},Ns={type:"childadded",child:null},ul={type:"childremoved",child:null},Zt=class n extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lm++}),this.uuid=rr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new L,t=new _n,i=new qt,s=new L(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new qe},normalMatrix:{value:new Ge}}),this.matrix=new qe,this.matrixWorld=new qe,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Hr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Us.setFromAxisAngle(e,t),this.quaternion.multiply(Us),this}rotateOnWorldAxis(e,t){return Us.setFromAxisAngle(e,t),this.quaternion.premultiply(Us),this}rotateX(e){return this.rotateOnAxis(Iu,e)}rotateY(e){return this.rotateOnAxis(Lu,e)}rotateZ(e){return this.rotateOnAxis(Du,e)}translateOnAxis(e,t){return Pu.copy(e).applyQuaternion(this.quaternion),this.position.add(Pu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Iu,e)}translateY(e){return this.translateOnAxis(Lu,e)}translateZ(e){return this.translateOnAxis(Du,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_i.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ta.copy(e):Ta.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Tr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_i.lookAt(Tr,Ta,this.up):_i.lookAt(Ta,Tr,this.up),this.quaternion.setFromRotationMatrix(_i),s&&(_i.extractRotation(s.matrixWorld),Us.setFromRotationMatrix(_i),this.quaternion.premultiply(Us.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Uu),Ns.child=e,this.dispatchEvent(Ns),Ns.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(um),ul.child=e,this.dispatchEvent(ul),ul.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_i.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_i.multiply(e.parent.matrixWorld)),e.applyMatrix4(_i),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Uu),Ns.child=e,this.dispatchEvent(Ns),Ns.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Tr,e,cm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Tr,hm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){let u=c[h];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),h=a(e.textures),l=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),l.length>0&&(i.images=l),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){let c=[];for(let h in o){let l=o[h];delete l.metadata,c.push(l)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Zt.DEFAULT_UP=new L(0,1,0);Zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Wn=new L,yi=new L,dl=new L,xi=new L,ks=new L,Fs=new L,Nu=new L,fl=new L,pl=new L,ml=new L,gl=new ct,_l=new ct,yl=new ct,ls=class n{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Wn.subVectors(e,t),s.cross(Wn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Wn.subVectors(s,t),yi.subVectors(i,t),dl.subVectors(e,t);let a=Wn.dot(Wn),o=Wn.dot(yi),c=Wn.dot(dl),h=yi.dot(yi),l=yi.dot(dl),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(h*c-o*l)*d,g=(a*l-o*c)*d;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,xi)===null?!1:xi.x>=0&&xi.y>=0&&xi.x+xi.y<=1}static getInterpolation(e,t,i,s,r,a,o,c){return this.getBarycoord(e,t,i,s,xi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,xi.x),c.addScaledVector(a,xi.y),c.addScaledVector(o,xi.z),c)}static getInterpolatedAttribute(e,t,i,s,r,a){return gl.setScalar(0),_l.setScalar(0),yl.setScalar(0),gl.fromBufferAttribute(e,t),_l.fromBufferAttribute(e,i),yl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(gl,r.x),a.addScaledVector(_l,r.y),a.addScaledVector(yl,r.z),a}static isFrontFacing(e,t,i,s){return Wn.subVectors(i,t),yi.subVectors(e,t),Wn.cross(yi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Wn.subVectors(this.c,this.b),yi.subVectors(this.a,this.b),Wn.cross(yi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,a,o;ks.subVectors(s,i),Fs.subVectors(r,i),fl.subVectors(e,i);let c=ks.dot(fl),h=Fs.dot(fl);if(c<=0&&h<=0)return t.copy(i);pl.subVectors(e,s);let l=ks.dot(pl),u=Fs.dot(pl);if(l>=0&&u<=l)return t.copy(s);let d=c*u-l*h;if(d<=0&&c>=0&&l<=0)return a=c/(c-l),t.copy(i).addScaledVector(ks,a);ml.subVectors(e,r);let p=ks.dot(ml),g=Fs.dot(ml);if(g>=0&&p<=g)return t.copy(r);let _=p*h-c*g;if(_<=0&&h>=0&&g<=0)return o=h/(h-g),t.copy(i).addScaledVector(Fs,o);let m=l*g-p*u;if(m<=0&&u-l>=0&&p-g>=0)return Nu.subVectors(r,s),o=(u-l)/(u-l+(p-g)),t.copy(s).addScaledVector(Nu,o);let f=1/(m+_+d);return a=_*f,o=d*f,t.copy(i).addScaledVector(ks,a).addScaledVector(Fs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Fd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bi={h:0,s:0,l:0},Aa={h:0,s:0,l:0};function xl(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var ke=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=i,tt.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=tt.workingColorSpace){if(e=ch(e,1),t=Lt(t,0,1),i=Lt(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=xl(a,r,e+1/3),this.g=xl(a,r,e),this.b=xl(a,r,e-1/3)}return tt.toWorkingColorSpace(this,s),this}setStyle(e,t=zt){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=zt){let i=Fd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Mi(e.r),this.g=Mi(e.g),this.b=Mi(e.b),this}copyLinearToSRGB(e){return this.r=Ys(e.r),this.g=Ys(e.g),this.b=Ys(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=zt){return tt.fromWorkingColorSpace(en.copy(this),e),Math.round(Lt(en.r*255,0,255))*65536+Math.round(Lt(en.g*255,0,255))*256+Math.round(Lt(en.b*255,0,255))}getHexString(e=zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.fromWorkingColorSpace(en.copy(this),t);let i=en.r,s=en.g,r=en.b,a=Math.max(i,s,r),o=Math.min(i,s,r),c,h,l=(o+a)/2;if(o===a)c=0,h=0;else{let u=a-o;switch(h=l<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=l,e}getRGB(e,t=tt.workingColorSpace){return tt.fromWorkingColorSpace(en.copy(this),t),e.r=en.r,e.g=en.g,e.b=en.b,e}getStyle(e=zt){tt.fromWorkingColorSpace(en.copy(this),e);let t=en.r,i=en.g,s=en.b;return e!==zt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Bi),this.setHSL(Bi.h+e,Bi.s+t,Bi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Bi),e.getHSL(Aa);let i=Nr(Bi.h,Aa.h,t),s=Nr(Bi.s,Aa.s,t),r=Nr(Bi.l,Aa.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},en=new ke;ke.NAMES=Fd;var dm=0,Ti=class extends wi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:dm++}),this.uuid=rr(),this.name="",this.blending=Gi,this.side=Wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nl,this.blendDst=kl,this.blendEquation=os,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ke(0,0,0),this.blendAlpha=0,this.depthFunc=Zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_u,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rs,this.stencilZFail=Rs,this.stencilZPass=Rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Gi&&(i.blending=this.blending),this.side!==Wi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Nl&&(i.blendSrc=this.blendSrc),this.blendDst!==kl&&(i.blendDst=this.blendDst),this.blendEquation!==os&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Zs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_u&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Rs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Rs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Ht=class extends Ti{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Sd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Ct=new L,Ra=new Re,vt=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=yu,this.updateRanges=[],this.gpuType=ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ra.fromBufferAttribute(this,t),Ra.applyMatrix3(e),this.setXY(t,Ra.x,Ra.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Gs(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=rn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Gs(t,this.array)),t}setX(e,t){return this.normalized&&(t=rn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Gs(t,this.array)),t}setY(e,t){return this.normalized&&(t=rn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Gs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=rn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Gs(t,this.array)),t}setW(e,t){return this.normalized&&(t=rn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=rn(t,this.array),i=rn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=rn(t,this.array),i=rn(i,this.array),s=rn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=rn(t,this.array),i=rn(i,this.array),s=rn(s,this.array),r=rn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==yu&&(e.usage=this.usage),e}};var io=class extends vt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var so=class extends vt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var Ke=class extends vt{constructor(e,t,i){super(new Float32Array(e),t,i)}},fm=0,Un=new qe,vl=new Zt,Os=new L,En=new Rn,Ar=new Rn,Bt=new L,ht=class n extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=rr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kd(e)?so:io)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Ge().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Un.makeRotationFromQuaternion(e),this.applyMatrix4(Un),this}rotateX(e){return Un.makeRotationX(e),this.applyMatrix4(Un),this}rotateY(e){return Un.makeRotationY(e),this.applyMatrix4(Un),this}rotateZ(e){return Un.makeRotationZ(e),this.applyMatrix4(Un),this}translate(e,t,i){return Un.makeTranslation(e,t,i),this.applyMatrix4(Un),this}scale(e,t,i){return Un.makeScale(e,t,i),this.applyMatrix4(Un),this}lookAt(e){return vl.lookAt(e),vl.updateMatrix(),this.applyMatrix4(vl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Os).negate(),this.translate(Os.x,Os.y,Os.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ke(i,3))}else{for(let i=0,s=t.count;i<s;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Rn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];En.setFromBufferAttribute(r),this.morphTargetsRelative?(Bt.addVectors(this.boundingBox.min,En.min),this.boundingBox.expandByPoint(Bt),Bt.addVectors(this.boundingBox.max,En.max),this.boundingBox.expandByPoint(Bt)):(this.boundingBox.expandByPoint(En.min),this.boundingBox.expandByPoint(En.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ei);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let i=this.boundingSphere.center;if(En.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ar.setFromBufferAttribute(o),this.morphTargetsRelative?(Bt.addVectors(En.min,Ar.min),En.expandByPoint(Bt),Bt.addVectors(En.max,Ar.max),En.expandByPoint(Bt)):(En.expandByPoint(Ar.min),En.expandByPoint(Ar.max))}En.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Bt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Bt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let h=0,l=o.count;h<l;h++)Bt.fromBufferAttribute(o,h),c&&(Os.fromBufferAttribute(e,h),Bt.add(Os)),s=Math.max(s,i.distanceToSquared(Bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vt(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let I=0;I<i.count;I++)o[I]=new L,c[I]=new L;let h=new L,l=new L,u=new L,d=new Re,p=new Re,g=new Re,_=new L,m=new L;function f(I,S,b){h.fromBufferAttribute(i,I),l.fromBufferAttribute(i,S),u.fromBufferAttribute(i,b),d.fromBufferAttribute(r,I),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,b),l.sub(h),u.sub(h),p.sub(d),g.sub(d);let D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(_.copy(l).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(D),m.copy(u).multiplyScalar(p.x).addScaledVector(l,-g.x).multiplyScalar(D),o[I].add(_),o[S].add(_),o[b].add(_),c[I].add(m),c[S].add(m),c[b].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let I=0,S=y.length;I<S;++I){let b=y[I],D=b.start,z=b.count;for(let H=D,q=D+z;H<q;H+=3)f(e.getX(H+0),e.getX(H+1),e.getX(H+2))}let v=new L,x=new L,C=new L,T=new L;function A(I){C.fromBufferAttribute(s,I),T.copy(C);let S=o[I];v.copy(S),v.sub(C.multiplyScalar(C.dot(S))).normalize(),x.crossVectors(T,S);let D=x.dot(c[I])<0?-1:1;a.setXYZW(I,v.x,v.y,v.z,D)}for(let I=0,S=y.length;I<S;++I){let b=y[I],D=b.start,z=b.count;for(let H=D,q=D+z;H<q;H+=3)A(e.getX(H+0)),A(e.getX(H+1)),A(e.getX(H+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new vt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let s=new L,r=new L,a=new L,o=new L,c=new L,h=new L,l=new L,u=new L;if(e)for(let d=0,p=e.count;d<p;d+=3){let g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,m),o.add(l),c.add(l),h.add(l),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,h.x,h.y,h.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),i.setXYZ(d+0,l.x,l.y,l.z),i.setXYZ(d+1,l.x,l.y,l.z),i.setXYZ(d+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Bt.fromBufferAttribute(e,t),Bt.normalize(),e.setXYZ(t,Bt.x,Bt.y,Bt.z)}toNonIndexed(){function e(o,c){let h=o.array,l=o.itemSize,u=o.normalized,d=new h.constructor(c.length*l),p=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*l;for(let f=0;f<l;f++)d[g++]=h[p++]}return new vt(d,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let o in s){let c=s[o],h=e(c,i);t.setAttribute(o,h)}let r=this.morphAttributes;for(let o in r){let c=[],h=r[o];for(let l=0,u=h.length;l<u;l++){let d=h[l],p=e(d,i);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let h=a[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let h=i[c];e.data.attributes[c]=h.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let h=this.morphAttributes[c],l=[];for(let u=0,d=h.length;u<d;u++){let p=h[u];l.push(p.toJSON(e.data))}l.length>0&&(s[c]=l,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let s=e.attributes;for(let h in s){let l=s[h];this.setAttribute(h,l.clone(t))}let r=e.morphAttributes;for(let h in r){let l=[],u=r[h];for(let d=0,p=u.length;d<p;d++)l.push(u[d].clone(t));this.morphAttributes[h]=l}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let h=0,l=a.length;h<l;h++){let u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},ku=new qe,ns=new Xi,Ca=new Ei,Fu=new L,Pa=new L,Ia=new L,La=new L,bl=new L,Da=new L,Ou=new L,Ua=new L,ze=class extends Zt{constructor(e=new ht,t=new Ht){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Da.set(0,0,0);for(let c=0,h=r.length;c<h;c++){let l=o[c],u=r[c];l!==0&&(bl.fromBufferAttribute(u,e),a?Da.addScaledVector(bl,l):Da.addScaledVector(bl.sub(t),l))}t.add(Da)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ca.copy(i.boundingSphere),Ca.applyMatrix4(r),ns.copy(e.ray).recast(e.near),!(Ca.containsPoint(ns.origin)===!1&&(ns.intersectSphere(Ca,Fu)===null||ns.origin.distanceToSquared(Fu)>(e.far-e.near)**2))&&(ku.copy(r).invert(),ns.copy(e.ray).applyMatrix4(ku),!(i.boundingBox!==null&&ns.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ns)))}_computeIntersections(e,t,i){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],y=Math.max(m.start,p.start),v=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let x=y,C=v;x<C;x+=3){let T=o.getX(x),A=o.getX(x+1),I=o.getX(x+2);s=Na(this,f,e,i,h,l,u,T,A,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let y=o.getX(m),v=o.getX(m+1),x=o.getX(m+2);s=Na(this,a,e,i,h,l,u,y,v,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],y=Math.max(m.start,p.start),v=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let x=y,C=v;x<C;x+=3){let T=x,A=x+1,I=x+2;s=Na(this,f,e,i,h,l,u,T,A,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let y=m,v=m+1,x=m+2;s=Na(this,a,e,i,h,l,u,y,v,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function pm(n,e,t,i,s,r,a,o){let c;if(e.side===tn?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===Wi,o),c===null)return null;Ua.copy(o),Ua.applyMatrix4(n.matrixWorld);let h=t.ray.origin.distanceTo(Ua);return h<t.near||h>t.far?null:{distance:h,point:Ua.clone(),object:n}}function Na(n,e,t,i,s,r,a,o,c,h){n.getVertexPosition(o,Pa),n.getVertexPosition(c,Ia),n.getVertexPosition(h,La);let l=pm(n,e,t,i,Pa,Ia,La,Ou);if(l){let u=new L;ls.getBarycoord(Ou,Pa,Ia,La,u),s&&(l.uv=ls.getInterpolatedAttribute(s,o,c,h,u,new Re)),r&&(l.uv1=ls.getInterpolatedAttribute(r,o,c,h,u,new Re)),a&&(l.normal=ls.getInterpolatedAttribute(a,o,c,h,u,new L),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));let d={a:o,b:c,c:h,normal:new L,materialIndex:0};ls.getNormal(Pa,Ia,La,d.normal),l.face=d,l.barycoord=u}return l}var qn=class n extends ht{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],h=[],l=[],u=[],d=0,p=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Ke(h,3)),this.setAttribute("normal",new Ke(l,3)),this.setAttribute("uv",new Ke(u,2));function g(_,m,f,y,v,x,C,T,A,I,S){let b=x/A,D=C/I,z=x/2,H=C/2,q=T/2,te=A+1,$=I+1,oe=0,Y=0,fe=new L;for(let ge=0;ge<$;ge++){let Pe=ge*D-H;for(let Oe=0;Oe<te;Oe++){let et=Oe*b-z;fe[_]=et*y,fe[m]=Pe*v,fe[f]=q,h.push(fe.x,fe.y,fe.z),fe[_]=0,fe[m]=0,fe[f]=T>0?1:-1,l.push(fe.x,fe.y,fe.z),u.push(Oe/A),u.push(1-ge/I),oe+=1}}for(let ge=0;ge<I;ge++)for(let Pe=0;Pe<A;Pe++){let Oe=d+Pe+te*ge,et=d+Pe+te*(ge+1),K=d+(Pe+1)+te*(ge+1),ce=d+(Pe+1)+te*ge;c.push(Oe,et,ce),c.push(et,K,ce),Y+=6}o.addGroup(p,Y,S),p+=Y,d+=oe}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Qs(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function an(n){let e={};for(let t=0;t<n.length;t++){let i=Qs(n[t]);for(let s in i)e[s]=i[s]}return e}function mm(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Od(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}var gm={clone:Qs,merge:an},_m=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ym=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Nn=class extends Ti{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_m,this.fragmentShader=ym,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qs(e.uniforms),this.uniformsGroups=mm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},ro=class extends Zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new qe,this.projectionMatrix=new qe,this.projectionMatrixInverse=new qe,this.coordinateSystem=bi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},zi=new L,Bu=new Re,zu=new Re,Yt=class extends ro{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=zr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ur*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return zr*2*Math.atan(Math.tan(Ur*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zi.x,zi.y).multiplyScalar(-e/zi.z),zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(zi.x,zi.y).multiplyScalar(-e/zi.z)}getViewSize(e,t){return this.getViewBounds(e,Bu,zu),t.subVectors(zu,Bu)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ur*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*i/h,s*=a.width/c,i*=a.height/h}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Bs=-90,zs=1,Sc=class extends Zt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Yt(Bs,zs,e,t);s.layers=this.layers,this.add(s);let r=new Yt(Bs,zs,e,t);r.layers=this.layers,this.add(r);let a=new Yt(Bs,zs,e,t);a.layers=this.layers,this.add(a);let o=new Yt(Bs,zs,e,t);o.layers=this.layers,this.add(o);let c=new Yt(Bs,zs,e,t);c.layers=this.layers,this.add(c);let h=new Yt(Bs,zs,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,c]=t;for(let h of t)this.remove(h);if(e===bi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Qa)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,h,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,l),e.setRenderTarget(u,d,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},ao=class extends gn{constructor(e,t,i,s,r,a,o,c,h,l){e=e!==void 0?e:[],t=t!==void 0?t:$s,super(e,t,i,s,r,a,o,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},wc=class extends Yn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new ao(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ri}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new qn(5,5,5),r=new Nn({name:"CubemapFromEquirect",uniforms:Qs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:tn,blending:Vi});r.uniforms.tEquirect.value=t;let a=new ze(s,r),o=t.minFilter;return t.minFilter===us&&(t.minFilter=ri),new Sc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,s){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}},Ml=new L,xm=new L,vm=new Ge,Tn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=Ml.subVectors(i,t).cross(xm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Ml),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||vm.getNormalMatrix(e),s=this.coplanarPoint(Ml).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},is=new Ei,ka=new L,Vr=class{constructor(e=new Tn,t=new Tn,i=new Tn,s=new Tn,r=new Tn,a=new Tn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=bi){let i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],c=s[3],h=s[4],l=s[5],u=s[6],d=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],y=s[13],v=s[14],x=s[15];if(i[0].setComponents(c-r,d-h,m-p,x-f).normalize(),i[1].setComponents(c+r,d+h,m+p,x+f).normalize(),i[2].setComponents(c+a,d+l,m+g,x+y).normalize(),i[3].setComponents(c-a,d-l,m-g,x-y).normalize(),i[4].setComponents(c-o,d-u,m-_,x-v).normalize(),t===bi)i[5].setComponents(c+o,d+u,m+_,x+v).normalize();else if(t===Qa)i[5].setComponents(o,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(is)}intersectsSprite(e){return is.center.set(0,0,0),is.radius=.7071067811865476,is.applyMatrix4(e.matrixWorld),this.intersectsSphere(is)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(ka.x=s.normal.x>0?e.max.x:e.min.x,ka.y=s.normal.y>0?e.max.y:e.min.y,ka.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ka)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Bd(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function bm(n){let e=new WeakMap;function t(o,c){let h=o.array,l=o.usage,u=h.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,h,l),o.onUploadCallback();let p;if(h instanceof Float32Array)p=n.FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=n.SHORT;else if(h instanceof Uint32Array)p=n.UNSIGNED_INT;else if(h instanceof Int32Array)p=n.INT;else if(h instanceof Int8Array)p=n.BYTE;else if(h instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,h){let l=c.array,u=c.updateRanges;if(n.bindBuffer(h,o),u.length===0)n.bufferSubData(h,0,l);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){let g=u[d],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];n.bufferSubData(h,_.start*l.BYTES_PER_ELEMENT,l,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let l=e.get(o);(!l||l.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:r,update:a}}var Ai=class n extends ht{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(s),h=o+1,l=c+1,u=e/o,d=t/c,p=[],g=[],_=[],m=[];for(let f=0;f<l;f++){let y=f*d-a;for(let v=0;v<h;v++){let x=v*u-r;g.push(x,-y,0),_.push(0,0,1),m.push(v/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<o;y++){let v=y+h*f,x=y+h*(f+1),C=y+1+h*(f+1),T=y+1+h*f;p.push(v,x,T),p.push(x,C,T)}this.setIndex(p),this.setAttribute("position",new Ke(g,3)),this.setAttribute("normal",new Ke(_,3)),this.setAttribute("uv",new Ke(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},Mm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sm=`#ifdef USE_ALPHAHASH
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
#endif`,wm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Em=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Am=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Rm=`#ifdef USE_AOMAP
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
#endif`,Cm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Pm=`#ifdef USE_BATCHING
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
#endif`,Im=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Lm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Dm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Um=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Nm=`#ifdef USE_IRIDESCENCE
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
#endif`,km=`#ifdef USE_BUMPMAP
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
#endif`,Fm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Om=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Gm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Wm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Xm=`#define PI 3.141592653589793
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
} // validated`,Ym=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,qm=`vec3 transformedNormal = objectNormal;
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
#endif`,Zm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$m=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Km=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Qm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,e0=`#ifdef USE_ENVMAP
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
#endif`,t0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,n0=`#ifdef USE_ENVMAP
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
#endif`,i0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,s0=`#ifdef USE_ENVMAP
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
#endif`,r0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,a0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,o0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,l0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,c0=`#ifdef USE_GRADIENTMAP
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
}`,h0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,u0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,d0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,f0=`uniform bool receiveShadow;
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
#endif`,p0=`#ifdef USE_ENVMAP
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
#endif`,m0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,g0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,y0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,x0=`PhysicalMaterial material;
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
#endif`,v0=`struct PhysicalMaterial {
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
}`,b0=`
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
#endif`,M0=`#if defined( RE_IndirectDiffuse )
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
#endif`,S0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,w0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,E0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,T0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,A0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,R0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,C0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,P0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,I0=`#if defined( USE_POINTS_UV )
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
#endif`,L0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,D0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,U0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,N0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,k0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,F0=`#ifdef USE_MORPHTARGETS
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
#endif`,O0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,B0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,z0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,H0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,V0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,G0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,W0=`#ifdef USE_NORMALMAP
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
#endif`,X0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Y0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,q0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Z0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,J0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,K0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,j0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Q0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,eg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,tg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ng=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ig=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ag=`float getShadowMask() {
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
}`,og=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,lg=`#ifdef USE_SKINNING
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
#endif`,cg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hg=`#ifdef USE_SKINNING
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
#endif`,ug=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,fg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,mg=`#ifdef USE_TRANSMISSION
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
#endif`,gg=`#ifdef USE_TRANSMISSION
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
#endif`,_g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,bg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mg=`uniform sampler2D t2D;
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
}`,Sg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ag=`#include <common>
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
}`,Rg=`#if DEPTH_PACKING == 3200
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
}`,Cg=`#define DISTANCE
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
}`,Pg=`#define DISTANCE
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
}`,Ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dg=`uniform float scale;
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
}`,Ug=`uniform vec3 diffuse;
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
}`,Ng=`#include <common>
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
}`,kg=`uniform vec3 diffuse;
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
}`,Fg=`#define LAMBERT
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
}`,Og=`#define LAMBERT
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
}`,Bg=`#define MATCAP
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
}`,zg=`#define MATCAP
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
}`,Hg=`#define NORMAL
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
}`,Vg=`#define NORMAL
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
}`,Gg=`#define PHONG
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
}`,Wg=`#define PHONG
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
}`,Xg=`#define STANDARD
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
}`,Yg=`#define STANDARD
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
}`,qg=`#define TOON
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
}`,Zg=`#define TOON
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
}`,$g=`uniform float size;
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
}`,Jg=`uniform vec3 diffuse;
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
}`,Kg=`#include <common>
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
}`,jg=`uniform vec3 color;
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
}`,Qg=`uniform float rotation;
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
}`,e_=`uniform vec3 diffuse;
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
}`,Je={alphahash_fragment:Mm,alphahash_pars_fragment:Sm,alphamap_fragment:wm,alphamap_pars_fragment:Em,alphatest_fragment:Tm,alphatest_pars_fragment:Am,aomap_fragment:Rm,aomap_pars_fragment:Cm,batching_pars_vertex:Pm,batching_vertex:Im,begin_vertex:Lm,beginnormal_vertex:Dm,bsdfs:Um,iridescence_fragment:Nm,bumpmap_pars_fragment:km,clipping_planes_fragment:Fm,clipping_planes_pars_fragment:Om,clipping_planes_pars_vertex:Bm,clipping_planes_vertex:zm,color_fragment:Hm,color_pars_fragment:Vm,color_pars_vertex:Gm,color_vertex:Wm,common:Xm,cube_uv_reflection_fragment:Ym,defaultnormal_vertex:qm,displacementmap_pars_vertex:Zm,displacementmap_vertex:$m,emissivemap_fragment:Jm,emissivemap_pars_fragment:Km,colorspace_fragment:jm,colorspace_pars_fragment:Qm,envmap_fragment:e0,envmap_common_pars_fragment:t0,envmap_pars_fragment:n0,envmap_pars_vertex:i0,envmap_physical_pars_fragment:p0,envmap_vertex:s0,fog_vertex:r0,fog_pars_vertex:a0,fog_fragment:o0,fog_pars_fragment:l0,gradientmap_pars_fragment:c0,lightmap_pars_fragment:h0,lights_lambert_fragment:u0,lights_lambert_pars_fragment:d0,lights_pars_begin:f0,lights_toon_fragment:m0,lights_toon_pars_fragment:g0,lights_phong_fragment:_0,lights_phong_pars_fragment:y0,lights_physical_fragment:x0,lights_physical_pars_fragment:v0,lights_fragment_begin:b0,lights_fragment_maps:M0,lights_fragment_end:S0,logdepthbuf_fragment:w0,logdepthbuf_pars_fragment:E0,logdepthbuf_pars_vertex:T0,logdepthbuf_vertex:A0,map_fragment:R0,map_pars_fragment:C0,map_particle_fragment:P0,map_particle_pars_fragment:I0,metalnessmap_fragment:L0,metalnessmap_pars_fragment:D0,morphinstance_vertex:U0,morphcolor_vertex:N0,morphnormal_vertex:k0,morphtarget_pars_vertex:F0,morphtarget_vertex:O0,normal_fragment_begin:B0,normal_fragment_maps:z0,normal_pars_fragment:H0,normal_pars_vertex:V0,normal_vertex:G0,normalmap_pars_fragment:W0,clearcoat_normal_fragment_begin:X0,clearcoat_normal_fragment_maps:Y0,clearcoat_pars_fragment:q0,iridescence_pars_fragment:Z0,opaque_fragment:$0,packing:J0,premultiplied_alpha_fragment:K0,project_vertex:j0,dithering_fragment:Q0,dithering_pars_fragment:eg,roughnessmap_fragment:tg,roughnessmap_pars_fragment:ng,shadowmap_pars_fragment:ig,shadowmap_pars_vertex:sg,shadowmap_vertex:rg,shadowmask_pars_fragment:ag,skinbase_vertex:og,skinning_pars_vertex:lg,skinning_vertex:cg,skinnormal_vertex:hg,specularmap_fragment:ug,specularmap_pars_fragment:dg,tonemapping_fragment:fg,tonemapping_pars_fragment:pg,transmission_fragment:mg,transmission_pars_fragment:gg,uv_pars_fragment:_g,uv_pars_vertex:yg,uv_vertex:xg,worldpos_vertex:vg,background_vert:bg,background_frag:Mg,backgroundCube_vert:Sg,backgroundCube_frag:wg,cube_vert:Eg,cube_frag:Tg,depth_vert:Ag,depth_frag:Rg,distanceRGBA_vert:Cg,distanceRGBA_frag:Pg,equirect_vert:Ig,equirect_frag:Lg,linedashed_vert:Dg,linedashed_frag:Ug,meshbasic_vert:Ng,meshbasic_frag:kg,meshlambert_vert:Fg,meshlambert_frag:Og,meshmatcap_vert:Bg,meshmatcap_frag:zg,meshnormal_vert:Hg,meshnormal_frag:Vg,meshphong_vert:Gg,meshphong_frag:Wg,meshphysical_vert:Xg,meshphysical_frag:Yg,meshtoon_vert:qg,meshtoon_frag:Zg,points_vert:$g,points_frag:Jg,shadow_vert:Kg,shadow_frag:jg,sprite_vert:Qg,sprite_frag:e_},me={common:{diffuse:{value:new ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Re(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new ke(16777215)},opacity:{value:1},center:{value:new Re(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},si={basic:{uniforms:an([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Je.meshbasic_vert,fragmentShader:Je.meshbasic_frag},lambert:{uniforms:an([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new ke(0)}}]),vertexShader:Je.meshlambert_vert,fragmentShader:Je.meshlambert_frag},phong:{uniforms:an([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new ke(0)},specular:{value:new ke(1118481)},shininess:{value:30}}]),vertexShader:Je.meshphong_vert,fragmentShader:Je.meshphong_frag},standard:{uniforms:an([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag},toon:{uniforms:an([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new ke(0)}}]),vertexShader:Je.meshtoon_vert,fragmentShader:Je.meshtoon_frag},matcap:{uniforms:an([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Je.meshmatcap_vert,fragmentShader:Je.meshmatcap_frag},points:{uniforms:an([me.points,me.fog]),vertexShader:Je.points_vert,fragmentShader:Je.points_frag},dashed:{uniforms:an([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Je.linedashed_vert,fragmentShader:Je.linedashed_frag},depth:{uniforms:an([me.common,me.displacementmap]),vertexShader:Je.depth_vert,fragmentShader:Je.depth_frag},normal:{uniforms:an([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Je.meshnormal_vert,fragmentShader:Je.meshnormal_frag},sprite:{uniforms:an([me.sprite,me.fog]),vertexShader:Je.sprite_vert,fragmentShader:Je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Je.background_vert,fragmentShader:Je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:Je.backgroundCube_vert,fragmentShader:Je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Je.cube_vert,fragmentShader:Je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Je.equirect_vert,fragmentShader:Je.equirect_frag},distanceRGBA:{uniforms:an([me.common,me.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Je.distanceRGBA_vert,fragmentShader:Je.distanceRGBA_frag},shadow:{uniforms:an([me.lights,me.fog,{color:{value:new ke(0)},opacity:{value:1}}]),vertexShader:Je.shadow_vert,fragmentShader:Je.shadow_frag}};si.physical={uniforms:an([si.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Re(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Re},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new ke(0)},specularColor:{value:new ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Re},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag};var Fa={r:0,b:0,g:0},ss=new _n,t_=new qe;function n_(n,e,t,i,s,r,a){let o=new ke(0),c=r===!0?0:1,h,l,u=null,d=0,p=null;function g(y){let v=y.isScene===!0?y.background:null;return v&&v.isTexture&&(v=(y.backgroundBlurriness>0?t:e).get(v)),v}function _(y){let v=!1,x=g(y);x===null?f(o,c):x&&x.isColor&&(f(x,1),v=!0);let C=n.xr.getEnvironmentBlendMode();C==="additive"?i.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,v){let x=g(v);x&&(x.isCubeTexture||x.mapping===wo)?(l===void 0&&(l=new ze(new qn(1,1,1),new Nn({name:"BackgroundCubeMaterial",uniforms:Qs(si.backgroundCube.uniforms),vertexShader:si.backgroundCube.vertexShader,fragmentShader:si.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(C,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),ss.copy(v.backgroundRotation),ss.x*=-1,ss.y*=-1,ss.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ss.y*=-1,ss.z*=-1),l.material.uniforms.envMap.value=x,l.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(t_.makeRotationFromEuler(ss)),l.material.toneMapped=tt.getTransfer(x.colorSpace)!==lt,(u!==x||d!==x.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=x,d=x.version,p=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null)):x&&x.isTexture&&(h===void 0&&(h=new ze(new Ai(2,2),new Nn({name:"BackgroundMaterial",uniforms:Qs(si.background.uniforms),vertexShader:si.background.vertexShader,fragmentShader:si.background.fragmentShader,side:Wi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=x,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.toneMapped=tt.getTransfer(x.colorSpace)!==lt,x.matrixAutoUpdate===!0&&x.updateMatrix(),h.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,p=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null))}function f(y,v){y.getRGB(Fa,Od(n)),i.buffers.color.setClear(Fa.r,Fa.g,Fa.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(y,v=1){o.set(y),c=v,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,f(o,c)},render:_,addToRenderList:m}}function i_(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,a=!1;function o(b,D,z,H,q){let te=!1,$=u(H,z,D);r!==$&&(r=$,h(r.object)),te=p(b,H,z,q),te&&g(b,H,z,q),q!==null&&e.update(q,n.ELEMENT_ARRAY_BUFFER),(te||a)&&(a=!1,x(b,D,z,H),q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function c(){return n.createVertexArray()}function h(b){return n.bindVertexArray(b)}function l(b){return n.deleteVertexArray(b)}function u(b,D,z){let H=z.wireframe===!0,q=i[b.id];q===void 0&&(q={},i[b.id]=q);let te=q[D.id];te===void 0&&(te={},q[D.id]=te);let $=te[H];return $===void 0&&($=d(c()),te[H]=$),$}function d(b){let D=[],z=[],H=[];for(let q=0;q<t;q++)D[q]=0,z[q]=0,H[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:z,attributeDivisors:H,object:b,attributes:{},index:null}}function p(b,D,z,H){let q=r.attributes,te=D.attributes,$=0,oe=z.getAttributes();for(let Y in oe)if(oe[Y].location>=0){let ge=q[Y],Pe=te[Y];if(Pe===void 0&&(Y==="instanceMatrix"&&b.instanceMatrix&&(Pe=b.instanceMatrix),Y==="instanceColor"&&b.instanceColor&&(Pe=b.instanceColor)),ge===void 0||ge.attribute!==Pe||Pe&&ge.data!==Pe.data)return!0;$++}return r.attributesNum!==$||r.index!==H}function g(b,D,z,H){let q={},te=D.attributes,$=0,oe=z.getAttributes();for(let Y in oe)if(oe[Y].location>=0){let ge=te[Y];ge===void 0&&(Y==="instanceMatrix"&&b.instanceMatrix&&(ge=b.instanceMatrix),Y==="instanceColor"&&b.instanceColor&&(ge=b.instanceColor));let Pe={};Pe.attribute=ge,ge&&ge.data&&(Pe.data=ge.data),q[Y]=Pe,$++}r.attributes=q,r.attributesNum=$,r.index=H}function _(){let b=r.newAttributes;for(let D=0,z=b.length;D<z;D++)b[D]=0}function m(b){f(b,0)}function f(b,D){let z=r.newAttributes,H=r.enabledAttributes,q=r.attributeDivisors;z[b]=1,H[b]===0&&(n.enableVertexAttribArray(b),H[b]=1),q[b]!==D&&(n.vertexAttribDivisor(b,D),q[b]=D)}function y(){let b=r.newAttributes,D=r.enabledAttributes;for(let z=0,H=D.length;z<H;z++)D[z]!==b[z]&&(n.disableVertexAttribArray(z),D[z]=0)}function v(b,D,z,H,q,te,$){$===!0?n.vertexAttribIPointer(b,D,z,q,te):n.vertexAttribPointer(b,D,z,H,q,te)}function x(b,D,z,H){_();let q=H.attributes,te=z.getAttributes(),$=D.defaultAttributeValues;for(let oe in te){let Y=te[oe];if(Y.location>=0){let fe=q[oe];if(fe===void 0&&(oe==="instanceMatrix"&&b.instanceMatrix&&(fe=b.instanceMatrix),oe==="instanceColor"&&b.instanceColor&&(fe=b.instanceColor)),fe!==void 0){let ge=fe.normalized,Pe=fe.itemSize,Oe=e.get(fe);if(Oe===void 0)continue;let et=Oe.buffer,K=Oe.type,ce=Oe.bytesPerElement,Ce=K===n.INT||K===n.UNSIGNED_INT||fe.gpuType===nh;if(fe.isInterleavedBufferAttribute){let M=fe.data,U=M.stride,N=fe.offset;if(M.isInstancedInterleavedBuffer){for(let X=0;X<Y.locationSize;X++)f(Y.location+X,M.meshPerAttribute);b.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=M.meshPerAttribute*M.count)}else for(let X=0;X<Y.locationSize;X++)m(Y.location+X);n.bindBuffer(n.ARRAY_BUFFER,et);for(let X=0;X<Y.locationSize;X++)v(Y.location+X,Pe/Y.locationSize,K,ge,U*ce,(N+Pe/Y.locationSize*X)*ce,Ce)}else{if(fe.isInstancedBufferAttribute){for(let M=0;M<Y.locationSize;M++)f(Y.location+M,fe.meshPerAttribute);b.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let M=0;M<Y.locationSize;M++)m(Y.location+M);n.bindBuffer(n.ARRAY_BUFFER,et);for(let M=0;M<Y.locationSize;M++)v(Y.location+M,Pe/Y.locationSize,K,ge,Pe*ce,Pe/Y.locationSize*M*ce,Ce)}}else if($!==void 0){let ge=$[oe];if(ge!==void 0)switch(ge.length){case 2:n.vertexAttrib2fv(Y.location,ge);break;case 3:n.vertexAttrib3fv(Y.location,ge);break;case 4:n.vertexAttrib4fv(Y.location,ge);break;default:n.vertexAttrib1fv(Y.location,ge)}}}}y()}function C(){I();for(let b in i){let D=i[b];for(let z in D){let H=D[z];for(let q in H)l(H[q].object),delete H[q];delete D[z]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;let D=i[b.id];for(let z in D){let H=D[z];for(let q in H)l(H[q].object),delete H[q];delete D[z]}delete i[b.id]}function A(b){for(let D in i){let z=i[D];if(z[b.id]===void 0)continue;let H=z[b.id];for(let q in H)l(H[q].object),delete H[q];delete z[b.id]}}function I(){S(),a=!0,r!==s&&(r=s,h(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:S,dispose:C,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function s_(n,e,t){let i;function s(h){i=h}function r(h,l){n.drawArrays(i,h,l),t.update(l,i,1)}function a(h,l,u){u!==0&&(n.drawArraysInstanced(i,h,l,u),t.update(l,i,u))}function o(h,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,l,0,u);let p=0;for(let g=0;g<u;g++)p+=l[g];t.update(p,i,1)}function c(h,l,u,d){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<h.length;g++)a(h[g],l[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(i,h,0,l,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=l[_]*d[_];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function r_(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Xn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let I=A===$r&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Si&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ai&&!I)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp",l=c(h);l!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",l,"instead."),h=l);let u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:x,vertexTextures:C,maxSamples:T}}function a_(n){let e=this,t=null,i=0,s=!1,r=!1,a=new Tn,o=new Ge,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||i!==0||s;return s=d,i=u.length,p},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=l(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?l(null):h();else{let y=r?0:i,v=y*4,x=f.clippingState||null;c.value=x,x=l(g,d,v,p);for(let C=0;C!==v;++C)x[C]=t[C];f.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function l(u,d,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let f=p+_*4,y=d.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<f)&&(m=new Float32Array(f));for(let v=0,x=p;v!==_;++v,x+=4)a.copy(u[v]).applyMatrix4(y,o),a.normal.toArray(m,x),m[x+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function o_(n){let e=new WeakMap;function t(a,o){return o===Wl?a.mapping=$s:o===Xl&&(a.mapping=Js),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===Wl||o===Xl)if(e.has(a)){let c=e.get(a).texture;return t(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let h=new wc(c.height);return h.fromEquirectangularTexture(n,a),e.set(a,h),a.addEventListener("dispose",s),t(h.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var oo=class extends ro{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,a=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=l*this.view.offsetY,c=o-l*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ws=4,Hu=[.125,.215,.35,.446,.526,.582],cs=20,Sl=new oo,Vu=new ke,wl=null,El=0,Tl=0,Al=!1,as=(1+Math.sqrt(5))/2,Hs=1/as,Gu=[new L(-as,Hs,0),new L(as,Hs,0),new L(-Hs,0,as),new L(Hs,0,as),new L(0,as,-Hs),new L(0,as,Hs),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],er=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){wl=this._renderer.getRenderTarget(),El=this._renderer.getActiveCubeFace(),Tl=this._renderer.getActiveMipmapLevel(),Al=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(wl,El,Tl),this._renderer.xr.enabled=Al,e.scissorTest=!1,Oa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===$s||e.mapping===Js?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),wl=this._renderer.getRenderTarget(),El=this._renderer.getActiveCubeFace(),Tl=this._renderer.getActiveMipmapLevel(),Al=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ri,minFilter:ri,generateMipmaps:!1,type:$r,format:Xn,colorSpace:sr,depthBuffer:!1},s=Wu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wu(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=l_(r)),this._blurMaterial=c_(r,e,t)}return s}_compileMaterial(e){let t=new ze(this._lodPlanes[0],e);this._renderer.compile(t,Sl)}_sceneToCubeUV(e,t,i,s){let o=new Yt(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,d=l.toneMapping;l.getClearColor(Vu),l.toneMapping=oi,l.autoClear=!1;let p=new Ht({name:"PMREM.Background",side:tn,depthWrite:!1,depthTest:!1}),g=new ze(new qn,p),_=!1,m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(Vu),_=!0);for(let f=0;f<6;f++){let y=f%3;y===0?(o.up.set(0,c[f],0),o.lookAt(h[f],0,0)):y===1?(o.up.set(0,0,c[f]),o.lookAt(0,h[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,h[f]));let v=this._cubeSize;Oa(s,y*v,f>2?v:0,v,v),l.setRenderTarget(s),_&&l.render(g,o),l.render(e,o)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=d,l.autoClear=u,e.background=m}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===$s||e.mapping===Js;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new ze(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;Oa(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,Sl)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Gu[(s-r-1)%Gu.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){let c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let l=3,u=new ze(this._lodPlanes[s],h),d=h.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*cs-1),_=r/g,m=isFinite(r)?1+Math.floor(l*_):cs;m>cs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${cs}`);let f=[],y=0;for(let A=0;A<cs;++A){let I=A/_,S=Math.exp(-I*I/2);f.push(S),A===0?y+=S:A<m&&(y+=2*S)}for(let A=0;A<f.length;A++)f[A]=f[A]/y;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-i;let x=this._sizeLods[s],C=3*x*(s>v-Ws?s-v+Ws:0),T=4*(this._cubeSize-x);Oa(t,C,T,3*x,2*x),c.setRenderTarget(t),c.render(u,Sl)}};function l_(n){let e=[],t=[],i=[],s=n,r=n-Ws+1+Hu.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>n-Ws?c=Hu[a-n+Ws-1]:a===0&&(c=0),i.push(c);let h=1/(o-2),l=-h,u=1+h,d=[l,l,u,l,u,u,l,l,u,u,l,u],p=6,g=6,_=3,m=2,f=1,y=new Float32Array(_*g*p),v=new Float32Array(m*g*p),x=new Float32Array(f*g*p);for(let T=0;T<p;T++){let A=T%3*2/3-1,I=T>2?0:-1,S=[A,I,0,A+2/3,I,0,A+2/3,I+1,0,A,I,0,A+2/3,I+1,0,A,I+1,0];y.set(S,_*g*T),v.set(d,m*g*T);let b=[T,T,T,T,T,T];x.set(b,f*g*T)}let C=new ht;C.setAttribute("position",new vt(y,_)),C.setAttribute("uv",new vt(v,m)),C.setAttribute("faceIndex",new vt(x,f)),e.push(C),s>Ws&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Wu(n,e,t){let i=new Yn(n,e,t);return i.texture.mapping=wo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Oa(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function c_(n,e,t){let i=new Float32Array(cs),s=new L(0,1,0);return new Nn({name:"SphericalGaussianBlur",defines:{n:cs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:hh(),fragmentShader:`

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
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function Xu(){return new Nn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hh(),fragmentShader:`

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
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function Yu(){return new Nn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function hh(){return`

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
	`}function h_(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){let c=o.mapping,h=c===Wl||c===Xl,l=c===$s||c===Js;if(h||l){let u=e.get(o),d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new er(n)),u=h?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let p=o.image;return h&&p&&p.height>0||l&&p&&s(p)?(t===null&&(t=new er(n)),u=h?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0,h=6;for(let l=0;l<h;l++)o[l]!==void 0&&c++;return c===h}function r(o){let c=o.target;c.removeEventListener("dispose",r);let h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function u_(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Lr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function d_(n,e,t,i){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);for(let g in d.morphAttributes){let _=d.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)e.remove(_[m])}d.removeEventListener("dispose",a),delete s[d.id];let p=r.get(d);p&&(e.remove(p),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function c(u){let d=u.attributes;for(let g in d)e.update(d[g],n.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let m=0,f=_.length;m<f;m++)e.update(_[m],n.ARRAY_BUFFER)}}function h(u){let d=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let y=p.array;_=p.version;for(let v=0,x=y.length;v<x;v+=3){let C=y[v+0],T=y[v+1],A=y[v+2];d.push(C,T,T,A,A,C)}}else if(g!==void 0){let y=g.array;_=g.version;for(let v=0,x=y.length/3-1;v<x;v+=3){let C=v+0,T=v+1,A=v+2;d.push(C,T,T,A,A,C)}}else return;let m=new(kd(d)?so:io)(d,1);m.version=_;let f=r.get(u);f&&e.remove(f),r.set(u,m)}function l(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:l}}function f_(n,e,t){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,p){n.drawElements(i,p,r,d*a),t.update(p,i,1)}function h(d,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,d*a,g),t.update(p,i,g))}function l(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,i,1)}function u(d,p,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)h(d[f]/a,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,d,0,_,0,g);let f=0;for(let y=0;y<g;y++)f+=p[y]*_[y];t.update(f,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=l,this.renderMultiDrawInstances=u}function p_(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function m_(n,e,t){let i=new WeakMap,s=new ct;function r(a,o,c){let h=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l!==void 0?l.length:0,d=i.get(o);if(d===void 0||d.count!==u){let S=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],v=0;p===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let x=o.attributes.position.count*v,C=1;x>e.maxTextureSize&&(C=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let T=new Float32Array(x*C*4*u),A=new no(T,x,C,u);A.type=ai,A.needsUpdate=!0;let I=v*4;for(let b=0;b<u;b++){let D=m[b],z=f[b],H=y[b],q=x*C*4*b;for(let te=0;te<D.count;te++){let $=te*I;p===!0&&(s.fromBufferAttribute(D,te),T[q+$+0]=s.x,T[q+$+1]=s.y,T[q+$+2]=s.z,T[q+$+3]=0),g===!0&&(s.fromBufferAttribute(z,te),T[q+$+4]=s.x,T[q+$+5]=s.y,T[q+$+6]=s.z,T[q+$+7]=0),_===!0&&(s.fromBufferAttribute(H,te),T[q+$+8]=s.x,T[q+$+9]=s.y,T[q+$+10]=s.z,T[q+$+11]=H.itemSize===4?s.w:1)}}d={count:u,texture:A,size:new Re(x,C)},i.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let _=0;_<h.length;_++)p+=h[_];let g=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function g_(n,e,t,i){let s=new WeakMap;function r(c){let h=i.render.frame,l=c.geometry,u=e.get(c,l);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==h&&(d.update(),s.set(d,h))}return u}function a(){s=new WeakMap}function o(c){let h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:a}}var lo=class extends gn{constructor(e,t,i,s,r,a,o,c,h,l=Xs){if(l!==Xs&&l!==js)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&l===Xs&&(i=ds),i===void 0&&l===js&&(i=Ks),super(null,s,r,a,o,c,l,i,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:An,this.minFilter=c!==void 0?c:An,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},zd=new gn,qu=new lo(1,1),Hd=new no,Vd=new Mc,Gd=new ao,Zu=[],$u=[],Ju=new Float32Array(16),Ku=new Float32Array(9),ju=new Float32Array(4);function ar(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=Zu[s];if(r===void 0&&(r=new Float32Array(s),Zu[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ut(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function To(n,e){let t=$u[e];t===void 0&&(t=new Int32Array(e),$u[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function __(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function y_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2fv(this.addr,e),Ut(t,e)}}function x_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;n.uniform3fv(this.addr,e),Ut(t,e)}}function v_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4fv(this.addr,e),Ut(t,e)}}function b_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;ju.set(i),n.uniformMatrix2fv(this.addr,!1,ju),Ut(t,i)}}function M_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;Ku.set(i),n.uniformMatrix3fv(this.addr,!1,Ku),Ut(t,i)}}function S_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;Ju.set(i),n.uniformMatrix4fv(this.addr,!1,Ju),Ut(t,i)}}function w_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function E_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2iv(this.addr,e),Ut(t,e)}}function T_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3iv(this.addr,e),Ut(t,e)}}function A_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4iv(this.addr,e),Ut(t,e)}}function R_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function C_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2uiv(this.addr,e),Ut(t,e)}}function P_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3uiv(this.addr,e),Ut(t,e)}}function I_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4uiv(this.addr,e),Ut(t,e)}}function L_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(qu.compareFunction=Nd,r=qu):r=zd,t.setTexture2D(e||r,s)}function D_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Vd,s)}function U_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Gd,s)}function N_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Hd,s)}function k_(n){switch(n){case 5126:return __;case 35664:return y_;case 35665:return x_;case 35666:return v_;case 35674:return b_;case 35675:return M_;case 35676:return S_;case 5124:case 35670:return w_;case 35667:case 35671:return E_;case 35668:case 35672:return T_;case 35669:case 35673:return A_;case 5125:return R_;case 36294:return C_;case 36295:return P_;case 36296:return I_;case 35678:case 36198:case 36298:case 36306:case 35682:return L_;case 35679:case 36299:case 36307:return D_;case 35680:case 36300:case 36308:case 36293:return U_;case 36289:case 36303:case 36311:case 36292:return N_}}function F_(n,e){n.uniform1fv(this.addr,e)}function O_(n,e){let t=ar(e,this.size,2);n.uniform2fv(this.addr,t)}function B_(n,e){let t=ar(e,this.size,3);n.uniform3fv(this.addr,t)}function z_(n,e){let t=ar(e,this.size,4);n.uniform4fv(this.addr,t)}function H_(n,e){let t=ar(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function V_(n,e){let t=ar(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function G_(n,e){let t=ar(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function W_(n,e){n.uniform1iv(this.addr,e)}function X_(n,e){n.uniform2iv(this.addr,e)}function Y_(n,e){n.uniform3iv(this.addr,e)}function q_(n,e){n.uniform4iv(this.addr,e)}function Z_(n,e){n.uniform1uiv(this.addr,e)}function $_(n,e){n.uniform2uiv(this.addr,e)}function J_(n,e){n.uniform3uiv(this.addr,e)}function K_(n,e){n.uniform4uiv(this.addr,e)}function j_(n,e,t){let i=this.cache,s=e.length,r=To(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||zd,r[a])}function Q_(n,e,t){let i=this.cache,s=e.length,r=To(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Vd,r[a])}function ey(n,e,t){let i=this.cache,s=e.length,r=To(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Gd,r[a])}function ty(n,e,t){let i=this.cache,s=e.length,r=To(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Hd,r[a])}function ny(n){switch(n){case 5126:return F_;case 35664:return O_;case 35665:return B_;case 35666:return z_;case 35674:return H_;case 35675:return V_;case 35676:return G_;case 5124:case 35670:return W_;case 35667:case 35671:return X_;case 35668:case 35672:return Y_;case 35669:case 35673:return q_;case 5125:return Z_;case 36294:return $_;case 36295:return J_;case 36296:return K_;case 35678:case 36198:case 36298:case 36306:case 35682:return j_;case 35679:case 36299:case 36307:return Q_;case 35680:case 36300:case 36308:case 36293:return ey;case 36289:case 36303:case 36311:case 36292:return ty}}var Ec=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=k_(t.type)}},Tc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ny(t.type)}},Ac=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],i)}}},Rl=/(\w+)(\])?(\[|\.)?/g;function Qu(n,e){n.seq.push(e),n.map[e.id]=e}function iy(n,e,t){let i=n.name,s=i.length;for(Rl.lastIndex=0;;){let r=Rl.exec(i),a=Rl.lastIndex,o=r[1],c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){Qu(t,h===void 0?new Ec(o,n,e):new Tc(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Ac(o),Qu(t,u)),t=u}}}var qs=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);iy(r,a,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&i.push(a)}return i}};function ed(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var sy=37297,ry=0;function ay(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}var td=new Ge;function oy(n){tt._getMatrix(td,tt.workingColorSpace,n);let e=`mat3( ${td.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(n)){case Eo:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function nd(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+ay(n.getShaderSource(e),a)}else return s}function ly(n,e){let t=oy(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function cy(n,e){let t;switch(e){case vp:t="Linear";break;case bp:t="Reinhard";break;case Mp:t="Cineon";break;case th:t="ACESFilmic";break;case wp:t="AgX";break;case Ep:t="Neutral";break;case Sp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ba=new L;function hy(){tt.getLuminanceCoefficients(Ba);let n=Ba.x.toFixed(4),e=Ba.y.toFixed(4),t=Ba.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function uy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Dr).join(`
`)}function dy(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function fy(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Dr(n){return n!==""}function id(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function sd(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var py=/^[ \t]*#include +<([\w\d./]+)>/gm;function Rc(n){return n.replace(py,gy)}var my=new Map;function gy(n,e){let t=Je[e];if(t===void 0){let i=my.get(e);if(i!==void 0)t=Je[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Rc(t)}var _y=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function rd(n){return n.replace(_y,yy)}function yy(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ad(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function xy(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Md?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===eh?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===vi&&(e="SHADOWMAP_TYPE_VSM"),e}function vy(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case $s:case Js:e="ENVMAP_TYPE_CUBE";break;case wo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function by(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Js:e="ENVMAP_MODE_REFRACTION";break}return e}function My(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Sd:e="ENVMAP_BLENDING_MULTIPLY";break;case yp:e="ENVMAP_BLENDING_MIX";break;case xp:e="ENVMAP_BLENDING_ADD";break}return e}function Sy(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function wy(n,e,t,i){let s=n.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=xy(t),h=vy(t),l=by(t),u=My(t),d=Sy(t),p=uy(t),g=dy(r),_=s.createProgram(),m,f,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Dr).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Dr).join(`
`),f.length>0&&(f+=`
`)):(m=[ad(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Dr).join(`
`),f=[ad(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==oi?"#define TONE_MAPPING":"",t.toneMapping!==oi?Je.tonemapping_pars_fragment:"",t.toneMapping!==oi?cy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Je.colorspace_pars_fragment,ly("linearToOutputTexel",t.outputColorSpace),hy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Dr).join(`
`)),a=Rc(a),a=id(a,t),a=sd(a,t),o=Rc(o),o=id(o,t),o=sd(o,t),a=rd(a),o=rd(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===xu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===xu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let v=y+m+a,x=y+f+o,C=ed(s,s.VERTEX_SHADER,v),T=ed(s,s.FRAGMENT_SHADER,x);s.attachShader(_,C),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(D){if(n.debug.checkShaderErrors){let z=s.getProgramInfoLog(_).trim(),H=s.getShaderInfoLog(C).trim(),q=s.getShaderInfoLog(T).trim(),te=!0,$=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(te=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,C,T);else{let oe=nd(s,C,"vertex"),Y=nd(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+z+`
`+oe+`
`+Y)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(H===""||q==="")&&($=!1);$&&(D.diagnostics={runnable:te,programLog:z,vertexShader:{log:H,prefix:m},fragmentShader:{log:q,prefix:f}})}s.deleteShader(C),s.deleteShader(T),I=new qs(s,_),S=fy(s,_)}let I;this.getUniforms=function(){return I===void 0&&A(this),I};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(_,sy)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ry++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=C,this.fragmentShader=T,this}var Ey=0,Cc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Pc(e),t.set(e,i)),i}},Pc=class{constructor(e){this.id=Ey++,this.code=e,this.usedTimes=0}};function Ty(n,e,t,i,s,r,a){let o=new Hr,c=new Cc,h=new Set,l=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return h.add(S),S===0?"uv":`uv${S}`}function m(S,b,D,z,H){let q=z.fog,te=H.geometry,$=S.isMeshStandardMaterial?z.environment:null,oe=(S.isMeshStandardMaterial?t:e).get(S.envMap||$),Y=oe&&oe.mapping===wo?oe.image.height:null,fe=g[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));let ge=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,Pe=ge!==void 0?ge.length:0,Oe=0;te.morphAttributes.position!==void 0&&(Oe=1),te.morphAttributes.normal!==void 0&&(Oe=2),te.morphAttributes.color!==void 0&&(Oe=3);let et,K,ce,Ce;if(fe){let ot=si[fe];et=ot.vertexShader,K=ot.fragmentShader}else et=S.vertexShader,K=S.fragmentShader,c.update(S),ce=c.getVertexShaderID(S),Ce=c.getFragmentShaderID(S);let M=n.getRenderTarget(),U=n.state.buffers.depth.getReversed(),N=H.isInstancedMesh===!0,X=H.isBatchedMesh===!0,j=!!S.map,Z=!!S.matcap,se=!!oe,P=!!S.aoMap,Fe=!!S.lightMap,Se=!!S.bumpMap,he=!!S.normalMap,_e=!!S.displacementMap,it=!!S.emissiveMap,Ne=!!S.metalnessMap,R=!!S.roughnessMap,w=S.anisotropy>0,B=S.clearcoat>0,ne=S.dispersion>0,ee=S.iridescence>0,Q=S.sheen>0,Ee=S.transmission>0,pe=w&&!!S.anisotropyMap,Me=B&&!!S.clearcoatMap,je=B&&!!S.clearcoatNormalMap,ue=B&&!!S.clearcoatRoughnessMap,Te=ee&&!!S.iridescenceMap,Be=ee&&!!S.iridescenceThicknessMap,He=Q&&!!S.sheenColorMap,Ae=Q&&!!S.sheenRoughnessMap,Qe=!!S.specularMap,$e=!!S.specularColorMap,yt=!!S.specularIntensityMap,k=Ee&&!!S.transmissionMap,ye=Ee&&!!S.thicknessMap,J=!!S.gradientMap,ie=!!S.alphaMap,be=S.alphaTest>0,xe=!!S.alphaHash,Xe=!!S.extensions,Et=oi;S.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(Et=n.toneMapping);let jt={shaderID:fe,shaderType:S.type,shaderName:S.name,vertexShader:et,fragmentShader:K,defines:S.defines,customVertexShaderID:ce,customFragmentShaderID:Ce,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:X,batchingColor:X&&H._colorsTexture!==null,instancing:N,instancingColor:N&&H.instanceColor!==null,instancingMorph:N&&H.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:M===null?n.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:sr,alphaToCoverage:!!S.alphaToCoverage,map:j,matcap:Z,envMap:se,envMapMode:se&&oe.mapping,envMapCubeUVHeight:Y,aoMap:P,lightMap:Fe,bumpMap:Se,normalMap:he,displacementMap:d&&_e,emissiveMap:it,normalMapObjectSpace:he&&S.normalMapType===Cp,normalMapTangentSpace:he&&S.normalMapType===Ud,metalnessMap:Ne,roughnessMap:R,anisotropy:w,anisotropyMap:pe,clearcoat:B,clearcoatMap:Me,clearcoatNormalMap:je,clearcoatRoughnessMap:ue,dispersion:ne,iridescence:ee,iridescenceMap:Te,iridescenceThicknessMap:Be,sheen:Q,sheenColorMap:He,sheenRoughnessMap:Ae,specularMap:Qe,specularColorMap:$e,specularIntensityMap:yt,transmission:Ee,transmissionMap:k,thicknessMap:ye,gradientMap:J,opaque:S.transparent===!1&&S.blending===Gi&&S.alphaToCoverage===!1,alphaMap:ie,alphaTest:be,alphaHash:xe,combine:S.combine,mapUv:j&&_(S.map.channel),aoMapUv:P&&_(S.aoMap.channel),lightMapUv:Fe&&_(S.lightMap.channel),bumpMapUv:Se&&_(S.bumpMap.channel),normalMapUv:he&&_(S.normalMap.channel),displacementMapUv:_e&&_(S.displacementMap.channel),emissiveMapUv:it&&_(S.emissiveMap.channel),metalnessMapUv:Ne&&_(S.metalnessMap.channel),roughnessMapUv:R&&_(S.roughnessMap.channel),anisotropyMapUv:pe&&_(S.anisotropyMap.channel),clearcoatMapUv:Me&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:je&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Te&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Be&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:He&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&_(S.sheenRoughnessMap.channel),specularMapUv:Qe&&_(S.specularMap.channel),specularColorMapUv:$e&&_(S.specularColorMap.channel),specularIntensityMapUv:yt&&_(S.specularIntensityMap.channel),transmissionMapUv:k&&_(S.transmissionMap.channel),thicknessMapUv:ye&&_(S.thicknessMap.channel),alphaMapUv:ie&&_(S.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(he||w),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!te.attributes.uv&&(j||ie),fog:!!q,useFog:S.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:U,skinning:H.isSkinnedMesh===!0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:Pe,morphTextureStride:Oe,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:Et,decodeVideoTexture:j&&S.map.isVideoTexture===!0&&tt.getTransfer(S.map.colorSpace)===lt,decodeVideoTextureEmissive:it&&S.emissiveMap.isVideoTexture===!0&&tt.getTransfer(S.emissiveMap.colorSpace)===lt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Pt,flipSided:S.side===tn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Xe&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xe&&S.extensions.multiDraw===!0||X)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return jt.vertexUv1s=h.has(1),jt.vertexUv2s=h.has(2),jt.vertexUv3s=h.has(3),h.clear(),jt}function f(S){let b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(let D in S.defines)b.push(D),b.push(S.defines[D]);return S.isRawShaderMaterial===!1&&(y(b,S),v(b,S),b.push(n.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function y(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function v(S,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reverseDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),S.push(o.mask)}function x(S){let b=g[S.type],D;if(b){let z=si[b];D=gm.clone(z.uniforms)}else D=S.uniforms;return D}function C(S,b){let D;for(let z=0,H=l.length;z<H;z++){let q=l[z];if(q.cacheKey===b){D=q,++D.usedTimes;break}}return D===void 0&&(D=new wy(n,b,S,r),l.push(D)),D}function T(S){if(--S.usedTimes===0){let b=l.indexOf(S);l[b]=l[l.length-1],l.pop(),S.destroy()}}function A(S){c.remove(S)}function I(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:x,acquireProgram:C,releaseProgram:T,releaseShaderCache:A,programs:l,dispose:I}}function Ay(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Ry(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function od(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ld(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u,d,p,g,_,m){let f=n[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),e++,f}function o(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):t.push(f)}function c(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function h(u,d){t.length>1&&t.sort(u||Ry),i.length>1&&i.sort(d||od),s.length>1&&s.sort(d||od)}function l(){for(let u=e,d=n.length;u<d;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:l,sort:h}}function Cy(){let n=new WeakMap;function e(i,s){let r=n.get(i),a;return r===void 0?(a=new ld,n.set(i,[a])):s>=r.length?(a=new ld,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Py(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new ke};break;case"SpotLight":t={position:new L,direction:new L,color:new ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new ke,groundColor:new ke};break;case"RectAreaLight":t={color:new ke,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function Iy(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var Ly=0;function Dy(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Uy(n){let e=new Py,t=Iy(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new L);let s=new L,r=new qe,a=new qe;function o(h){let l=0,u=0,d=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,y=0,v=0,x=0,C=0,T=0,A=0;h.sort(Dy);for(let S=0,b=h.length;S<b;S++){let D=h[S],z=D.color,H=D.intensity,q=D.distance,te=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)l+=z.r*H,u+=z.g*H,d+=z.b*H;else if(D.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(D.sh.coefficients[$],H);A++}else if(D.isDirectionalLight){let $=e.get(D);if($.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let oe=D.shadow,Y=t.get(D);Y.shadowIntensity=oe.intensity,Y.shadowBias=oe.bias,Y.shadowNormalBias=oe.normalBias,Y.shadowRadius=oe.radius,Y.shadowMapSize=oe.mapSize,i.directionalShadow[p]=Y,i.directionalShadowMap[p]=te,i.directionalShadowMatrix[p]=D.shadow.matrix,y++}i.directional[p]=$,p++}else if(D.isSpotLight){let $=e.get(D);$.position.setFromMatrixPosition(D.matrixWorld),$.color.copy(z).multiplyScalar(H),$.distance=q,$.coneCos=Math.cos(D.angle),$.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),$.decay=D.decay,i.spot[_]=$;let oe=D.shadow;if(D.map&&(i.spotLightMap[C]=D.map,C++,oe.updateMatrices(D),D.castShadow&&T++),i.spotLightMatrix[_]=oe.matrix,D.castShadow){let Y=t.get(D);Y.shadowIntensity=oe.intensity,Y.shadowBias=oe.bias,Y.shadowNormalBias=oe.normalBias,Y.shadowRadius=oe.radius,Y.shadowMapSize=oe.mapSize,i.spotShadow[_]=Y,i.spotShadowMap[_]=te,x++}_++}else if(D.isRectAreaLight){let $=e.get(D);$.color.copy(z).multiplyScalar(H),$.halfWidth.set(D.width*.5,0,0),$.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=$,m++}else if(D.isPointLight){let $=e.get(D);if($.color.copy(D.color).multiplyScalar(D.intensity),$.distance=D.distance,$.decay=D.decay,D.castShadow){let oe=D.shadow,Y=t.get(D);Y.shadowIntensity=oe.intensity,Y.shadowBias=oe.bias,Y.shadowNormalBias=oe.normalBias,Y.shadowRadius=oe.radius,Y.shadowMapSize=oe.mapSize,Y.shadowCameraNear=oe.camera.near,Y.shadowCameraFar=oe.camera.far,i.pointShadow[g]=Y,i.pointShadowMap[g]=te,i.pointShadowMatrix[g]=D.shadow.matrix,v++}i.point[g]=$,g++}else if(D.isHemisphereLight){let $=e.get(D);$.skyColor.copy(D.color).multiplyScalar(H),$.groundColor.copy(D.groundColor).multiplyScalar(H),i.hemi[f]=$,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=l,i.ambient[1]=u,i.ambient[2]=d;let I=i.hash;(I.directionalLength!==p||I.pointLength!==g||I.spotLength!==_||I.rectAreaLength!==m||I.hemiLength!==f||I.numDirectionalShadows!==y||I.numPointShadows!==v||I.numSpotShadows!==x||I.numSpotMaps!==C||I.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=x+C-T,i.spotLightMap.length=C,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,I.directionalLength=p,I.pointLength=g,I.spotLength=_,I.rectAreaLength=m,I.hemiLength=f,I.numDirectionalShadows=y,I.numPointShadows=v,I.numSpotShadows=x,I.numSpotMaps=C,I.numLightProbes=A,i.version=Ly++)}function c(h,l){let u=0,d=0,p=0,g=0,_=0,m=l.matrixWorldInverse;for(let f=0,y=h.length;f<y;f++){let v=h[f];if(v.isDirectionalLight){let x=i.directional[u];x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),u++}else if(v.isSpotLight){let x=i.spot[p];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),p++}else if(v.isRectAreaLight){let x=i.rectArea[g];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),a.identity(),r.copy(v.matrixWorld),r.premultiply(m),a.extractRotation(r),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(v.isPointLight){let x=i.point[d];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){let x=i.hemi[_];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:i}}function cd(n){let e=new Uy(n),t=[],i=[];function s(l){h.camera=l,t.length=0,i.length=0}function r(l){t.push(l)}function a(l){i.push(l)}function o(){e.setup(t)}function c(l){e.setupView(t,l)}let h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Ny(n){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new cd(n),e.set(s,[o])):r>=a.length?(o=new cd(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}var Ic=class extends Ti{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Ap,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Lc=class extends Ti{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},ky=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fy=`uniform sampler2D shadow_pass;
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
}`;function Oy(n,e,t){let i=new Vr,s=new Re,r=new Re,a=new ct,o=new Ic({depthPacking:Rp}),c=new Lc,h={},l=t.maxTextureSize,u={[Wi]:tn,[tn]:Wi,[Pt]:Pt},d=new Nn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Re},radius:{value:4}},vertexShader:ky,fragmentShader:Fy}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new ht;g.setAttribute("position",new vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ze(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Md;let f=this.type;this.render=function(T,A,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;let S=n.getRenderTarget(),b=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),z=n.state;z.setBlending(Vi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let H=f!==vi&&this.type===vi,q=f===vi&&this.type!==vi;for(let te=0,$=T.length;te<$;te++){let oe=T[te],Y=oe.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",oe,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);let fe=Y.getFrameExtents();if(s.multiply(fe),r.copy(Y.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/fe.x),s.x=r.x*fe.x,Y.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/fe.y),s.y=r.y*fe.y,Y.mapSize.y=r.y)),Y.map===null||H===!0||q===!0){let Pe=this.type!==vi?{minFilter:An,magFilter:An}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Yn(s.x,s.y,Pe),Y.map.texture.name=oe.name+".shadowMap",Y.camera.updateProjectionMatrix()}n.setRenderTarget(Y.map),n.clear();let ge=Y.getViewportCount();for(let Pe=0;Pe<ge;Pe++){let Oe=Y.getViewport(Pe);a.set(r.x*Oe.x,r.y*Oe.y,r.x*Oe.z,r.y*Oe.w),z.viewport(a),Y.updateMatrices(oe,Pe),i=Y.getFrustum(),x(A,I,Y.camera,oe,this.type)}Y.isPointLightShadow!==!0&&this.type===vi&&y(Y,I),Y.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(S,b,D)};function y(T,A){let I=e.update(_);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Yn(s.x,s.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,I,d,_,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,I,p,_,null)}function v(T,A,I,S){let b=null,D=I.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)b=D;else if(b=I.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let z=b.uuid,H=A.uuid,q=h[z];q===void 0&&(q={},h[z]=q);let te=q[H];te===void 0&&(te=b.clone(),q[H]=te,A.addEventListener("dispose",C)),b=te}if(b.visible=A.visible,b.wireframe=A.wireframe,S===vi?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,I.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let z=n.properties.get(b);z.light=I}return b}function x(T,A,I,S,b){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===vi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,T.matrixWorld);let H=e.update(T),q=T.material;if(Array.isArray(q)){let te=H.groups;for(let $=0,oe=te.length;$<oe;$++){let Y=te[$],fe=q[Y.materialIndex];if(fe&&fe.visible){let ge=v(T,fe,S,b);T.onBeforeShadow(n,T,A,I,H,ge,Y),n.renderBufferDirect(I,null,H,ge,T,Y),T.onAfterShadow(n,T,A,I,H,ge,Y)}}}else if(q.visible){let te=v(T,q,S,b);T.onBeforeShadow(n,T,A,I,H,te,null),n.renderBufferDirect(I,null,H,te,T,null),T.onAfterShadow(n,T,A,I,H,te,null)}}let z=T.children;for(let H=0,q=z.length;H<q;H++)x(z[H],A,I,S,b)}function C(T){T.target.removeEventListener("dispose",C);for(let I in h){let S=h[I],b=T.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}var By={[Fl]:Ol,[Bl]:Vl,[zl]:Gl,[Zs]:Hl,[Ol]:Fl,[Vl]:Bl,[Gl]:zl,[Hl]:Zs};function zy(n,e){function t(){let k=!1,ye=new ct,J=null,ie=new ct(0,0,0,0);return{setMask:function(be){J!==be&&!k&&(n.colorMask(be,be,be,be),J=be)},setLocked:function(be){k=be},setClear:function(be,xe,Xe,Et,jt){jt===!0&&(be*=Et,xe*=Et,Xe*=Et),ye.set(be,xe,Xe,Et),ie.equals(ye)===!1&&(n.clearColor(be,xe,Xe,Et),ie.copy(ye))},reset:function(){k=!1,J=null,ie.set(-1,0,0,0)}}}function i(){let k=!1,ye=!1,J=null,ie=null,be=null;return{setReversed:function(xe){if(ye!==xe){let Xe=e.get("EXT_clip_control");ye?Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.ZERO_TO_ONE_EXT):Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.NEGATIVE_ONE_TO_ONE_EXT);let Et=be;be=null,this.setClear(Et)}ye=xe},getReversed:function(){return ye},setTest:function(xe){xe?M(n.DEPTH_TEST):U(n.DEPTH_TEST)},setMask:function(xe){J!==xe&&!k&&(n.depthMask(xe),J=xe)},setFunc:function(xe){if(ye&&(xe=By[xe]),ie!==xe){switch(xe){case Fl:n.depthFunc(n.NEVER);break;case Ol:n.depthFunc(n.ALWAYS);break;case Bl:n.depthFunc(n.LESS);break;case Zs:n.depthFunc(n.LEQUAL);break;case zl:n.depthFunc(n.EQUAL);break;case Hl:n.depthFunc(n.GEQUAL);break;case Vl:n.depthFunc(n.GREATER);break;case Gl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ie=xe}},setLocked:function(xe){k=xe},setClear:function(xe){be!==xe&&(ye&&(xe=1-xe),n.clearDepth(xe),be=xe)},reset:function(){k=!1,J=null,ie=null,be=null,ye=!1}}}function s(){let k=!1,ye=null,J=null,ie=null,be=null,xe=null,Xe=null,Et=null,jt=null;return{setTest:function(ot){k||(ot?M(n.STENCIL_TEST):U(n.STENCIL_TEST))},setMask:function(ot){ye!==ot&&!k&&(n.stencilMask(ot),ye=ot)},setFunc:function(ot,zn,fi){(J!==ot||ie!==zn||be!==fi)&&(n.stencilFunc(ot,zn,fi),J=ot,ie=zn,be=fi)},setOp:function(ot,zn,fi){(xe!==ot||Xe!==zn||Et!==fi)&&(n.stencilOp(ot,zn,fi),xe=ot,Xe=zn,Et=fi)},setLocked:function(ot){k=ot},setClear:function(ot){jt!==ot&&(n.clearStencil(ot),jt=ot)},reset:function(){k=!1,ye=null,J=null,ie=null,be=null,xe=null,Xe=null,Et=null,jt=null}}}let r=new t,a=new i,o=new s,c=new WeakMap,h=new WeakMap,l={},u={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,y=null,v=null,x=null,C=null,T=null,A=new ke(0,0,0),I=0,S=!1,b=null,D=null,z=null,H=null,q=null,te=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,oe=0,Y=n.getParameter(n.VERSION);Y.indexOf("WebGL")!==-1?(oe=parseFloat(/^WebGL (\d)/.exec(Y)[1]),$=oe>=1):Y.indexOf("OpenGL ES")!==-1&&(oe=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),$=oe>=2);let fe=null,ge={},Pe=n.getParameter(n.SCISSOR_BOX),Oe=n.getParameter(n.VIEWPORT),et=new ct().fromArray(Pe),K=new ct().fromArray(Oe);function ce(k,ye,J,ie){let be=new Uint8Array(4),xe=n.createTexture();n.bindTexture(k,xe),n.texParameteri(k,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(k,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Xe=0;Xe<J;Xe++)k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY?n.texImage3D(ye,0,n.RGBA,1,1,ie,0,n.RGBA,n.UNSIGNED_BYTE,be):n.texImage2D(ye+Xe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,be);return xe}let Ce={};Ce[n.TEXTURE_2D]=ce(n.TEXTURE_2D,n.TEXTURE_2D,1),Ce[n.TEXTURE_CUBE_MAP]=ce(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ce[n.TEXTURE_2D_ARRAY]=ce(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Ce[n.TEXTURE_3D]=ce(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),M(n.DEPTH_TEST),a.setFunc(Zs),Se(!1),he(uu),M(n.CULL_FACE),P(Vi);function M(k){l[k]!==!0&&(n.enable(k),l[k]=!0)}function U(k){l[k]!==!1&&(n.disable(k),l[k]=!1)}function N(k,ye){return u[k]!==ye?(n.bindFramebuffer(k,ye),u[k]=ye,k===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ye),k===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ye),!0):!1}function X(k,ye){let J=p,ie=!1;if(k){J=d.get(ye),J===void 0&&(J=[],d.set(ye,J));let be=k.textures;if(J.length!==be.length||J[0]!==n.COLOR_ATTACHMENT0){for(let xe=0,Xe=be.length;xe<Xe;xe++)J[xe]=n.COLOR_ATTACHMENT0+xe;J.length=be.length,ie=!0}}else J[0]!==n.BACK&&(J[0]=n.BACK,ie=!0);ie&&n.drawBuffers(J)}function j(k){return g!==k?(n.useProgram(k),g=k,!0):!1}let Z={[os]:n.FUNC_ADD,[tp]:n.FUNC_SUBTRACT,[np]:n.FUNC_REVERSE_SUBTRACT};Z[ip]=n.MIN,Z[sp]=n.MAX;let se={[rp]:n.ZERO,[ap]:n.ONE,[op]:n.SRC_COLOR,[Nl]:n.SRC_ALPHA,[fp]:n.SRC_ALPHA_SATURATE,[up]:n.DST_COLOR,[cp]:n.DST_ALPHA,[lp]:n.ONE_MINUS_SRC_COLOR,[kl]:n.ONE_MINUS_SRC_ALPHA,[dp]:n.ONE_MINUS_DST_COLOR,[hp]:n.ONE_MINUS_DST_ALPHA,[pp]:n.CONSTANT_COLOR,[mp]:n.ONE_MINUS_CONSTANT_COLOR,[gp]:n.CONSTANT_ALPHA,[_p]:n.ONE_MINUS_CONSTANT_ALPHA};function P(k,ye,J,ie,be,xe,Xe,Et,jt,ot){if(k===Vi){_===!0&&(U(n.BLEND),_=!1);return}if(_===!1&&(M(n.BLEND),_=!0),k!==ep){if(k!==m||ot!==S){if((f!==os||x!==os)&&(n.blendEquation(n.FUNC_ADD),f=os,x=os),ot)switch(k){case Gi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Fr:n.blendFunc(n.ONE,n.ONE);break;case du:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case fu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case Gi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Fr:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case du:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case fu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}y=null,v=null,C=null,T=null,A.set(0,0,0),I=0,m=k,S=ot}return}be=be||ye,xe=xe||J,Xe=Xe||ie,(ye!==f||be!==x)&&(n.blendEquationSeparate(Z[ye],Z[be]),f=ye,x=be),(J!==y||ie!==v||xe!==C||Xe!==T)&&(n.blendFuncSeparate(se[J],se[ie],se[xe],se[Xe]),y=J,v=ie,C=xe,T=Xe),(Et.equals(A)===!1||jt!==I)&&(n.blendColor(Et.r,Et.g,Et.b,jt),A.copy(Et),I=jt),m=k,S=!1}function Fe(k,ye){k.side===Pt?U(n.CULL_FACE):M(n.CULL_FACE);let J=k.side===tn;ye&&(J=!J),Se(J),k.blending===Gi&&k.transparent===!1?P(Vi):P(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);let ie=k.stencilWrite;o.setTest(ie),ie&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),it(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?M(n.SAMPLE_ALPHA_TO_COVERAGE):U(n.SAMPLE_ALPHA_TO_COVERAGE)}function Se(k){b!==k&&(k?n.frontFace(n.CW):n.frontFace(n.CCW),b=k)}function he(k){k!==jf?(M(n.CULL_FACE),k!==D&&(k===uu?n.cullFace(n.BACK):k===Qf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):U(n.CULL_FACE),D=k}function _e(k){k!==z&&($&&n.lineWidth(k),z=k)}function it(k,ye,J){k?(M(n.POLYGON_OFFSET_FILL),(H!==ye||q!==J)&&(n.polygonOffset(ye,J),H=ye,q=J)):U(n.POLYGON_OFFSET_FILL)}function Ne(k){k?M(n.SCISSOR_TEST):U(n.SCISSOR_TEST)}function R(k){k===void 0&&(k=n.TEXTURE0+te-1),fe!==k&&(n.activeTexture(k),fe=k)}function w(k,ye,J){J===void 0&&(fe===null?J=n.TEXTURE0+te-1:J=fe);let ie=ge[J];ie===void 0&&(ie={type:void 0,texture:void 0},ge[J]=ie),(ie.type!==k||ie.texture!==ye)&&(fe!==J&&(n.activeTexture(J),fe=J),n.bindTexture(k,ye||Ce[k]),ie.type=k,ie.texture=ye)}function B(){let k=ge[fe];k!==void 0&&k.type!==void 0&&(n.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function ne(){try{n.compressedTexImage2D.apply(n,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ee(){try{n.compressedTexImage3D.apply(n,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Q(){try{n.texSubImage2D.apply(n,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ee(){try{n.texSubImage3D.apply(n,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function pe(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Me(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function je(){try{n.texStorage2D.apply(n,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ue(){try{n.texStorage3D.apply(n,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Te(){try{n.texImage2D.apply(n,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Be(){try{n.texImage3D.apply(n,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function He(k){et.equals(k)===!1&&(n.scissor(k.x,k.y,k.z,k.w),et.copy(k))}function Ae(k){K.equals(k)===!1&&(n.viewport(k.x,k.y,k.z,k.w),K.copy(k))}function Qe(k,ye){let J=h.get(ye);J===void 0&&(J=new WeakMap,h.set(ye,J));let ie=J.get(k);ie===void 0&&(ie=n.getUniformBlockIndex(ye,k.name),J.set(k,ie))}function $e(k,ye){let ie=h.get(ye).get(k);c.get(ye)!==ie&&(n.uniformBlockBinding(ye,ie,k.__bindingPointIndex),c.set(ye,ie))}function yt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),l={},fe=null,ge={},u={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,y=null,v=null,x=null,C=null,T=null,A=new ke(0,0,0),I=0,S=!1,b=null,D=null,z=null,H=null,q=null,et.set(0,0,n.canvas.width,n.canvas.height),K.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:M,disable:U,bindFramebuffer:N,drawBuffers:X,useProgram:j,setBlending:P,setMaterial:Fe,setFlipSided:Se,setCullFace:he,setLineWidth:_e,setPolygonOffset:it,setScissorTest:Ne,activeTexture:R,bindTexture:w,unbindTexture:B,compressedTexImage2D:ne,compressedTexImage3D:ee,texImage2D:Te,texImage3D:Be,updateUBOMapping:Qe,uniformBlockBinding:$e,texStorage2D:je,texStorage3D:ue,texSubImage2D:Q,texSubImage3D:Ee,compressedTexSubImage2D:pe,compressedTexSubImage3D:Me,scissor:He,viewport:Ae,reset:yt}}function hd(n,e,t,i){let s=Hy(i);switch(t){case Rd:return n*e;case Pd:return n*e;case Id:return n*e*2;case rh:return n*e/s.components*s.byteLength;case ah:return n*e/s.components*s.byteLength;case Ld:return n*e*2/s.components*s.byteLength;case oh:return n*e*2/s.components*s.byteLength;case Cd:return n*e*3/s.components*s.byteLength;case Xn:return n*e*4/s.components*s.byteLength;case lh:return n*e*4/s.components*s.byteLength;case qa:case Za:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case $a:case Ja:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Zl:case Jl:return Math.max(n,16)*Math.max(e,8)/4;case ql:case $l:return Math.max(n,8)*Math.max(e,8)/2;case Kl:case jl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ql:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ec:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case tc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case nc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ic:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case sc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case rc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ac:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case oc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case lc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case cc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case hc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case uc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case dc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case fc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ka:case pc:case mc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Dd:case gc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case _c:case yc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Hy(n){switch(n){case Si:case Ed:return{byteLength:1,components:1};case Br:case Td:case $r:return{byteLength:2,components:1};case ih:case sh:return{byteLength:2,components:4};case ds:case nh:case ai:return{byteLength:4,components:1};case Ad:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Vy(n,e,t,i,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Re,l=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,w){return p?new OffscreenCanvas(R,w):eo("canvas")}function _(R,w,B){let ne=1,ee=Ne(R);if((ee.width>B||ee.height>B)&&(ne=B/Math.max(ee.width,ee.height)),ne<1)if(typeof HTMLImageElement!="undefined"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&R instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&R instanceof ImageBitmap||typeof VideoFrame!="undefined"&&R instanceof VideoFrame){let Q=Math.floor(ne*ee.width),Ee=Math.floor(ne*ee.height);u===void 0&&(u=g(Q,Ee));let pe=w?g(Q,Ee):u;return pe.width=Q,pe.height=Ee,pe.getContext("2d").drawImage(R,0,0,Q,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+Q+"x"+Ee+")."),pe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),R;return R}function m(R){return R.generateMipmaps}function f(R){n.generateMipmap(R)}function y(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(R,w,B,ne,ee=!1){if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Q=w;if(w===n.RED&&(B===n.FLOAT&&(Q=n.R32F),B===n.HALF_FLOAT&&(Q=n.R16F),B===n.UNSIGNED_BYTE&&(Q=n.R8)),w===n.RED_INTEGER&&(B===n.UNSIGNED_BYTE&&(Q=n.R8UI),B===n.UNSIGNED_SHORT&&(Q=n.R16UI),B===n.UNSIGNED_INT&&(Q=n.R32UI),B===n.BYTE&&(Q=n.R8I),B===n.SHORT&&(Q=n.R16I),B===n.INT&&(Q=n.R32I)),w===n.RG&&(B===n.FLOAT&&(Q=n.RG32F),B===n.HALF_FLOAT&&(Q=n.RG16F),B===n.UNSIGNED_BYTE&&(Q=n.RG8)),w===n.RG_INTEGER&&(B===n.UNSIGNED_BYTE&&(Q=n.RG8UI),B===n.UNSIGNED_SHORT&&(Q=n.RG16UI),B===n.UNSIGNED_INT&&(Q=n.RG32UI),B===n.BYTE&&(Q=n.RG8I),B===n.SHORT&&(Q=n.RG16I),B===n.INT&&(Q=n.RG32I)),w===n.RGB_INTEGER&&(B===n.UNSIGNED_BYTE&&(Q=n.RGB8UI),B===n.UNSIGNED_SHORT&&(Q=n.RGB16UI),B===n.UNSIGNED_INT&&(Q=n.RGB32UI),B===n.BYTE&&(Q=n.RGB8I),B===n.SHORT&&(Q=n.RGB16I),B===n.INT&&(Q=n.RGB32I)),w===n.RGBA_INTEGER&&(B===n.UNSIGNED_BYTE&&(Q=n.RGBA8UI),B===n.UNSIGNED_SHORT&&(Q=n.RGBA16UI),B===n.UNSIGNED_INT&&(Q=n.RGBA32UI),B===n.BYTE&&(Q=n.RGBA8I),B===n.SHORT&&(Q=n.RGBA16I),B===n.INT&&(Q=n.RGBA32I)),w===n.RGB&&B===n.UNSIGNED_INT_5_9_9_9_REV&&(Q=n.RGB9_E5),w===n.RGBA){let Ee=ee?Eo:tt.getTransfer(ne);B===n.FLOAT&&(Q=n.RGBA32F),B===n.HALF_FLOAT&&(Q=n.RGBA16F),B===n.UNSIGNED_BYTE&&(Q=Ee===lt?n.SRGB8_ALPHA8:n.RGBA8),B===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),B===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function x(R,w){let B;return R?w===null||w===ds||w===Ks?B=n.DEPTH24_STENCIL8:w===ai?B=n.DEPTH32F_STENCIL8:w===Br&&(B=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===ds||w===Ks?B=n.DEPTH_COMPONENT24:w===ai?B=n.DEPTH_COMPONENT32F:w===Br&&(B=n.DEPTH_COMPONENT16),B}function C(R,w){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==An&&R.minFilter!==ri?Math.log2(Math.max(w.width,w.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?w.mipmaps.length:1}function T(R){let w=R.target;w.removeEventListener("dispose",T),I(w),w.isVideoTexture&&l.delete(w)}function A(R){let w=R.target;w.removeEventListener("dispose",A),b(w)}function I(R){let w=i.get(R);if(w.__webglInit===void 0)return;let B=R.source,ne=d.get(B);if(ne){let ee=ne[w.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&S(R),Object.keys(ne).length===0&&d.delete(B)}i.remove(R)}function S(R){let w=i.get(R);n.deleteTexture(w.__webglTexture);let B=R.source,ne=d.get(B);delete ne[w.__cacheKey],a.memory.textures--}function b(R){let w=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(w.__webglFramebuffer[ne]))for(let ee=0;ee<w.__webglFramebuffer[ne].length;ee++)n.deleteFramebuffer(w.__webglFramebuffer[ne][ee]);else n.deleteFramebuffer(w.__webglFramebuffer[ne]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[ne])}else{if(Array.isArray(w.__webglFramebuffer))for(let ne=0;ne<w.__webglFramebuffer.length;ne++)n.deleteFramebuffer(w.__webglFramebuffer[ne]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ne=0;ne<w.__webglColorRenderbuffer.length;ne++)w.__webglColorRenderbuffer[ne]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[ne]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let B=R.textures;for(let ne=0,ee=B.length;ne<ee;ne++){let Q=i.get(B[ne]);Q.__webglTexture&&(n.deleteTexture(Q.__webglTexture),a.memory.textures--),i.remove(B[ne])}i.remove(R)}let D=0;function z(){D=0}function H(){let R=D;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),D+=1,R}function q(R){let w=[];return w.push(R.wrapS),w.push(R.wrapT),w.push(R.wrapR||0),w.push(R.magFilter),w.push(R.minFilter),w.push(R.anisotropy),w.push(R.internalFormat),w.push(R.format),w.push(R.type),w.push(R.generateMipmaps),w.push(R.premultiplyAlpha),w.push(R.flipY),w.push(R.unpackAlignment),w.push(R.colorSpace),w.join()}function te(R,w){let B=i.get(R);if(R.isVideoTexture&&_e(R),R.isRenderTargetTexture===!1&&R.version>0&&B.__version!==R.version){let ne=R.image;if(ne===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ne.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(B,R,w);return}}t.bindTexture(n.TEXTURE_2D,B.__webglTexture,n.TEXTURE0+w)}function $(R,w){let B=i.get(R);if(R.version>0&&B.__version!==R.version){K(B,R,w);return}t.bindTexture(n.TEXTURE_2D_ARRAY,B.__webglTexture,n.TEXTURE0+w)}function oe(R,w){let B=i.get(R);if(R.version>0&&B.__version!==R.version){K(B,R,w);return}t.bindTexture(n.TEXTURE_3D,B.__webglTexture,n.TEXTURE0+w)}function Y(R,w){let B=i.get(R);if(R.version>0&&B.__version!==R.version){ce(B,R,w);return}t.bindTexture(n.TEXTURE_CUBE_MAP,B.__webglTexture,n.TEXTURE0+w)}let fe={[Or]:n.REPEAT,[hs]:n.CLAMP_TO_EDGE,[Yl]:n.MIRRORED_REPEAT},ge={[An]:n.NEAREST,[Tp]:n.NEAREST_MIPMAP_NEAREST,[xa]:n.NEAREST_MIPMAP_LINEAR,[ri]:n.LINEAR,[tl]:n.LINEAR_MIPMAP_NEAREST,[us]:n.LINEAR_MIPMAP_LINEAR},Pe={[Pp]:n.NEVER,[kp]:n.ALWAYS,[Ip]:n.LESS,[Nd]:n.LEQUAL,[Lp]:n.EQUAL,[Np]:n.GEQUAL,[Dp]:n.GREATER,[Up]:n.NOTEQUAL};function Oe(R,w){if(w.type===ai&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===ri||w.magFilter===tl||w.magFilter===xa||w.magFilter===us||w.minFilter===ri||w.minFilter===tl||w.minFilter===xa||w.minFilter===us)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,fe[w.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,fe[w.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,fe[w.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,ge[w.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,ge[w.minFilter]),w.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,Pe[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===An||w.minFilter!==xa&&w.minFilter!==us||w.type===ai&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){let B=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function et(R,w){let B=!1;R.__webglInit===void 0&&(R.__webglInit=!0,w.addEventListener("dispose",T));let ne=w.source,ee=d.get(ne);ee===void 0&&(ee={},d.set(ne,ee));let Q=q(w);if(Q!==R.__cacheKey){ee[Q]===void 0&&(ee[Q]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,B=!0),ee[Q].usedTimes++;let Ee=ee[R.__cacheKey];Ee!==void 0&&(ee[R.__cacheKey].usedTimes--,Ee.usedTimes===0&&S(w)),R.__cacheKey=Q,R.__webglTexture=ee[Q].texture}return B}function K(R,w,B){let ne=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ne=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ne=n.TEXTURE_3D);let ee=et(R,w),Q=w.source;t.bindTexture(ne,R.__webglTexture,n.TEXTURE0+B);let Ee=i.get(Q);if(Q.version!==Ee.__version||ee===!0){t.activeTexture(n.TEXTURE0+B);let pe=tt.getPrimaries(tt.workingColorSpace),Me=w.colorSpace===Hi?null:tt.getPrimaries(w.colorSpace),je=w.colorSpace===Hi||pe===Me?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);let ue=_(w.image,!1,s.maxTextureSize);ue=it(w,ue);let Te=r.convert(w.format,w.colorSpace),Be=r.convert(w.type),He=v(w.internalFormat,Te,Be,w.colorSpace,w.isVideoTexture);Oe(ne,w);let Ae,Qe=w.mipmaps,$e=w.isVideoTexture!==!0,yt=Ee.__version===void 0||ee===!0,k=Q.dataReady,ye=C(w,ue);if(w.isDepthTexture)He=x(w.format===js,w.type),yt&&($e?t.texStorage2D(n.TEXTURE_2D,1,He,ue.width,ue.height):t.texImage2D(n.TEXTURE_2D,0,He,ue.width,ue.height,0,Te,Be,null));else if(w.isDataTexture)if(Qe.length>0){$e&&yt&&t.texStorage2D(n.TEXTURE_2D,ye,He,Qe[0].width,Qe[0].height);for(let J=0,ie=Qe.length;J<ie;J++)Ae=Qe[J],$e?k&&t.texSubImage2D(n.TEXTURE_2D,J,0,0,Ae.width,Ae.height,Te,Be,Ae.data):t.texImage2D(n.TEXTURE_2D,J,He,Ae.width,Ae.height,0,Te,Be,Ae.data);w.generateMipmaps=!1}else $e?(yt&&t.texStorage2D(n.TEXTURE_2D,ye,He,ue.width,ue.height),k&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ue.width,ue.height,Te,Be,ue.data)):t.texImage2D(n.TEXTURE_2D,0,He,ue.width,ue.height,0,Te,Be,ue.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){$e&&yt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,He,Qe[0].width,Qe[0].height,ue.depth);for(let J=0,ie=Qe.length;J<ie;J++)if(Ae=Qe[J],w.format!==Xn)if(Te!==null)if($e){if(k)if(w.layerUpdates.size>0){let be=hd(Ae.width,Ae.height,w.format,w.type);for(let xe of w.layerUpdates){let Xe=Ae.data.subarray(xe*be/Ae.data.BYTES_PER_ELEMENT,(xe+1)*be/Ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,xe,Ae.width,Ae.height,1,Te,Xe)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,Ae.width,Ae.height,ue.depth,Te,Ae.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,J,He,Ae.width,Ae.height,ue.depth,0,Ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else $e?k&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,Ae.width,Ae.height,ue.depth,Te,Be,Ae.data):t.texImage3D(n.TEXTURE_2D_ARRAY,J,He,Ae.width,Ae.height,ue.depth,0,Te,Be,Ae.data)}else{$e&&yt&&t.texStorage2D(n.TEXTURE_2D,ye,He,Qe[0].width,Qe[0].height);for(let J=0,ie=Qe.length;J<ie;J++)Ae=Qe[J],w.format!==Xn?Te!==null?$e?k&&t.compressedTexSubImage2D(n.TEXTURE_2D,J,0,0,Ae.width,Ae.height,Te,Ae.data):t.compressedTexImage2D(n.TEXTURE_2D,J,He,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):$e?k&&t.texSubImage2D(n.TEXTURE_2D,J,0,0,Ae.width,Ae.height,Te,Be,Ae.data):t.texImage2D(n.TEXTURE_2D,J,He,Ae.width,Ae.height,0,Te,Be,Ae.data)}else if(w.isDataArrayTexture)if($e){if(yt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,He,ue.width,ue.height,ue.depth),k)if(w.layerUpdates.size>0){let J=hd(ue.width,ue.height,w.format,w.type);for(let ie of w.layerUpdates){let be=ue.data.subarray(ie*J/ue.data.BYTES_PER_ELEMENT,(ie+1)*J/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ie,ue.width,ue.height,1,Te,Be,be)}w.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,Te,Be,ue.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,He,ue.width,ue.height,ue.depth,0,Te,Be,ue.data);else if(w.isData3DTexture)$e?(yt&&t.texStorage3D(n.TEXTURE_3D,ye,He,ue.width,ue.height,ue.depth),k&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,Te,Be,ue.data)):t.texImage3D(n.TEXTURE_3D,0,He,ue.width,ue.height,ue.depth,0,Te,Be,ue.data);else if(w.isFramebufferTexture){if(yt)if($e)t.texStorage2D(n.TEXTURE_2D,ye,He,ue.width,ue.height);else{let J=ue.width,ie=ue.height;for(let be=0;be<ye;be++)t.texImage2D(n.TEXTURE_2D,be,He,J,ie,0,Te,Be,null),J>>=1,ie>>=1}}else if(Qe.length>0){if($e&&yt){let J=Ne(Qe[0]);t.texStorage2D(n.TEXTURE_2D,ye,He,J.width,J.height)}for(let J=0,ie=Qe.length;J<ie;J++)Ae=Qe[J],$e?k&&t.texSubImage2D(n.TEXTURE_2D,J,0,0,Te,Be,Ae):t.texImage2D(n.TEXTURE_2D,J,He,Te,Be,Ae);w.generateMipmaps=!1}else if($e){if(yt){let J=Ne(ue);t.texStorage2D(n.TEXTURE_2D,ye,He,J.width,J.height)}k&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Te,Be,ue)}else t.texImage2D(n.TEXTURE_2D,0,He,Te,Be,ue);m(w)&&f(ne),Ee.__version=Q.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function ce(R,w,B){if(w.image.length!==6)return;let ne=et(R,w),ee=w.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+B);let Q=i.get(ee);if(ee.version!==Q.__version||ne===!0){t.activeTexture(n.TEXTURE0+B);let Ee=tt.getPrimaries(tt.workingColorSpace),pe=w.colorSpace===Hi?null:tt.getPrimaries(w.colorSpace),Me=w.colorSpace===Hi||Ee===pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);let je=w.isCompressedTexture||w.image[0].isCompressedTexture,ue=w.image[0]&&w.image[0].isDataTexture,Te=[];for(let ie=0;ie<6;ie++)!je&&!ue?Te[ie]=_(w.image[ie],!0,s.maxCubemapSize):Te[ie]=ue?w.image[ie].image:w.image[ie],Te[ie]=it(w,Te[ie]);let Be=Te[0],He=r.convert(w.format,w.colorSpace),Ae=r.convert(w.type),Qe=v(w.internalFormat,He,Ae,w.colorSpace),$e=w.isVideoTexture!==!0,yt=Q.__version===void 0||ne===!0,k=ee.dataReady,ye=C(w,Be);Oe(n.TEXTURE_CUBE_MAP,w);let J;if(je){$e&&yt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,Qe,Be.width,Be.height);for(let ie=0;ie<6;ie++){J=Te[ie].mipmaps;for(let be=0;be<J.length;be++){let xe=J[be];w.format!==Xn?He!==null?$e?k&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,be,0,0,xe.width,xe.height,He,xe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,be,Qe,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$e?k&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,be,0,0,xe.width,xe.height,He,Ae,xe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,be,Qe,xe.width,xe.height,0,He,Ae,xe.data)}}}else{if(J=w.mipmaps,$e&&yt){J.length>0&&ye++;let ie=Ne(Te[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,Qe,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(ue){$e?k&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Te[ie].width,Te[ie].height,He,Ae,Te[ie].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Qe,Te[ie].width,Te[ie].height,0,He,Ae,Te[ie].data);for(let be=0;be<J.length;be++){let Xe=J[be].image[ie].image;$e?k&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,be+1,0,0,Xe.width,Xe.height,He,Ae,Xe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,be+1,Qe,Xe.width,Xe.height,0,He,Ae,Xe.data)}}else{$e?k&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,He,Ae,Te[ie]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Qe,He,Ae,Te[ie]);for(let be=0;be<J.length;be++){let xe=J[be];$e?k&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,be+1,0,0,He,Ae,xe.image[ie]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,be+1,Qe,He,Ae,xe.image[ie])}}}m(w)&&f(n.TEXTURE_CUBE_MAP),Q.__version=ee.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function Ce(R,w,B,ne,ee,Q){let Ee=r.convert(B.format,B.colorSpace),pe=r.convert(B.type),Me=v(B.internalFormat,Ee,pe,B.colorSpace),je=i.get(w),ue=i.get(B);if(ue.__renderTarget=w,!je.__hasExternalTextures){let Te=Math.max(1,w.width>>Q),Be=Math.max(1,w.height>>Q);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,Q,Me,Te,Be,w.depth,0,Ee,pe,null):t.texImage2D(ee,Q,Me,Te,Be,0,Ee,pe,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),he(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ne,ee,ue.__webglTexture,0,Se(w)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ne,ee,ue.__webglTexture,Q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function M(R,w,B){if(n.bindRenderbuffer(n.RENDERBUFFER,R),w.depthBuffer){let ne=w.depthTexture,ee=ne&&ne.isDepthTexture?ne.type:null,Q=x(w.stencilBuffer,ee),Ee=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,pe=Se(w);he(w)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,pe,Q,w.width,w.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,pe,Q,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,Q,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ee,n.RENDERBUFFER,R)}else{let ne=w.textures;for(let ee=0;ee<ne.length;ee++){let Q=ne[ee],Ee=r.convert(Q.format,Q.colorSpace),pe=r.convert(Q.type),Me=v(Q.internalFormat,Ee,pe,Q.colorSpace),je=Se(w);B&&he(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,je,Me,w.width,w.height):he(w)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,je,Me,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,Me,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function U(R,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let ne=i.get(w.depthTexture);ne.__renderTarget=w,(!ne.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),te(w.depthTexture,0);let ee=ne.__webglTexture,Q=Se(w);if(w.depthTexture.format===Xs)he(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0);else if(w.depthTexture.format===js)he(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function N(R){let w=i.get(R),B=R.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==R.depthTexture){let ne=R.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),ne){let ee=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,ne.removeEventListener("dispose",ee)};ne.addEventListener("dispose",ee),w.__depthDisposeCallback=ee}w.__boundDepthTexture=ne}if(R.depthTexture&&!w.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");U(w.__webglFramebuffer,R)}else if(B){w.__webglDepthbuffer=[];for(let ne=0;ne<6;ne++)if(t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[ne]),w.__webglDepthbuffer[ne]===void 0)w.__webglDepthbuffer[ne]=n.createRenderbuffer(),M(w.__webglDepthbuffer[ne],R,!1);else{let ee=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=w.__webglDepthbuffer[ne];n.bindRenderbuffer(n.RENDERBUFFER,Q),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,Q)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),M(w.__webglDepthbuffer,R,!1);else{let ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,ee)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function X(R,w,B){let ne=i.get(R);w!==void 0&&Ce(ne.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),B!==void 0&&N(R)}function j(R){let w=R.texture,B=i.get(R),ne=i.get(w);R.addEventListener("dispose",A);let ee=R.textures,Q=R.isWebGLCubeRenderTarget===!0,Ee=ee.length>1;if(Ee||(ne.__webglTexture===void 0&&(ne.__webglTexture=n.createTexture()),ne.__version=w.version,a.memory.textures++),Q){B.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(w.mipmaps&&w.mipmaps.length>0){B.__webglFramebuffer[pe]=[];for(let Me=0;Me<w.mipmaps.length;Me++)B.__webglFramebuffer[pe][Me]=n.createFramebuffer()}else B.__webglFramebuffer[pe]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){B.__webglFramebuffer=[];for(let pe=0;pe<w.mipmaps.length;pe++)B.__webglFramebuffer[pe]=n.createFramebuffer()}else B.__webglFramebuffer=n.createFramebuffer();if(Ee)for(let pe=0,Me=ee.length;pe<Me;pe++){let je=i.get(ee[pe]);je.__webglTexture===void 0&&(je.__webglTexture=n.createTexture(),a.memory.textures++)}if(R.samples>0&&he(R)===!1){B.__webglMultisampledFramebuffer=n.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let pe=0;pe<ee.length;pe++){let Me=ee[pe];B.__webglColorRenderbuffer[pe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,B.__webglColorRenderbuffer[pe]);let je=r.convert(Me.format,Me.colorSpace),ue=r.convert(Me.type),Te=v(Me.internalFormat,je,ue,Me.colorSpace,R.isXRRenderTarget===!0),Be=Se(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Be,Te,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.RENDERBUFFER,B.__webglColorRenderbuffer[pe])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(B.__webglDepthRenderbuffer=n.createRenderbuffer(),M(B.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Q){t.bindTexture(n.TEXTURE_CUBE_MAP,ne.__webglTexture),Oe(n.TEXTURE_CUBE_MAP,w);for(let pe=0;pe<6;pe++)if(w.mipmaps&&w.mipmaps.length>0)for(let Me=0;Me<w.mipmaps.length;Me++)Ce(B.__webglFramebuffer[pe][Me],R,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Me);else Ce(B.__webglFramebuffer[pe],R,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);m(w)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let pe=0,Me=ee.length;pe<Me;pe++){let je=ee[pe],ue=i.get(je);t.bindTexture(n.TEXTURE_2D,ue.__webglTexture),Oe(n.TEXTURE_2D,je),Ce(B.__webglFramebuffer,R,je,n.COLOR_ATTACHMENT0+pe,n.TEXTURE_2D,0),m(je)&&f(n.TEXTURE_2D)}t.unbindTexture()}else{let pe=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(pe,ne.__webglTexture),Oe(pe,w),w.mipmaps&&w.mipmaps.length>0)for(let Me=0;Me<w.mipmaps.length;Me++)Ce(B.__webglFramebuffer[Me],R,w,n.COLOR_ATTACHMENT0,pe,Me);else Ce(B.__webglFramebuffer,R,w,n.COLOR_ATTACHMENT0,pe,0);m(w)&&f(pe),t.unbindTexture()}R.depthBuffer&&N(R)}function Z(R){let w=R.textures;for(let B=0,ne=w.length;B<ne;B++){let ee=w[B];if(m(ee)){let Q=y(R),Ee=i.get(ee).__webglTexture;t.bindTexture(Q,Ee),f(Q),t.unbindTexture()}}}let se=[],P=[];function Fe(R){if(R.samples>0){if(he(R)===!1){let w=R.textures,B=R.width,ne=R.height,ee=n.COLOR_BUFFER_BIT,Q=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ee=i.get(R),pe=w.length>1;if(pe)for(let Me=0;Me<w.length;Me++)t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let Me=0;Me<w.length;Me++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),pe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ee.__webglColorRenderbuffer[Me]);let je=i.get(w[Me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,je,0)}n.blitFramebuffer(0,0,B,ne,0,0,B,ne,ee,n.NEAREST),c===!0&&(se.length=0,P.length=0,se.push(n.COLOR_ATTACHMENT0+Me),R.depthBuffer&&R.resolveDepthBuffer===!1&&(se.push(Q),P.push(Q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,P)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,se))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),pe)for(let Me=0;Me<w.length;Me++){t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.RENDERBUFFER,Ee.__webglColorRenderbuffer[Me]);let je=i.get(w[Me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.TEXTURE_2D,je,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let w=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function Se(R){return Math.min(s.maxSamples,R.samples)}function he(R){let w=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function _e(R){let w=a.render.frame;l.get(R)!==w&&(l.set(R,w),R.update())}function it(R,w){let B=R.colorSpace,ne=R.format,ee=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||B!==sr&&B!==Hi&&(tt.getTransfer(B)===lt?(ne!==Xn||ee!==Si)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),w}function Ne(R){return typeof HTMLImageElement!="undefined"&&R instanceof HTMLImageElement?(h.width=R.naturalWidth||R.width,h.height=R.naturalHeight||R.height):typeof VideoFrame!="undefined"&&R instanceof VideoFrame?(h.width=R.displayWidth,h.height=R.displayHeight):(h.width=R.width,h.height=R.height),h}this.allocateTextureUnit=H,this.resetTextureUnits=z,this.setTexture2D=te,this.setTexture2DArray=$,this.setTexture3D=oe,this.setTextureCube=Y,this.rebindTextures=X,this.setupRenderTarget=j,this.updateRenderTargetMipmap=Z,this.updateMultisampleRenderTarget=Fe,this.setupDepthRenderbuffer=N,this.setupFrameBufferTexture=Ce,this.useMultisampledRTT=he}function Gy(n,e){function t(i,s=Hi){let r,a=tt.getTransfer(s);if(i===Si)return n.UNSIGNED_BYTE;if(i===ih)return n.UNSIGNED_SHORT_4_4_4_4;if(i===sh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ad)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ed)return n.BYTE;if(i===Td)return n.SHORT;if(i===Br)return n.UNSIGNED_SHORT;if(i===nh)return n.INT;if(i===ds)return n.UNSIGNED_INT;if(i===ai)return n.FLOAT;if(i===$r)return n.HALF_FLOAT;if(i===Rd)return n.ALPHA;if(i===Cd)return n.RGB;if(i===Xn)return n.RGBA;if(i===Pd)return n.LUMINANCE;if(i===Id)return n.LUMINANCE_ALPHA;if(i===Xs)return n.DEPTH_COMPONENT;if(i===js)return n.DEPTH_STENCIL;if(i===rh)return n.RED;if(i===ah)return n.RED_INTEGER;if(i===Ld)return n.RG;if(i===oh)return n.RG_INTEGER;if(i===lh)return n.RGBA_INTEGER;if(i===qa||i===Za||i===$a||i===Ja)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===qa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===qa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Za)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===$a)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ja)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ql||i===Zl||i===$l||i===Jl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ql)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Zl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===$l)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Jl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Kl||i===jl||i===Ql)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Kl||i===jl)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Ql)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ec||i===tc||i===nc||i===ic||i===sc||i===rc||i===ac||i===oc||i===lc||i===cc||i===hc||i===uc||i===dc||i===fc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ec)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===tc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===nc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ic)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===sc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===rc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ac)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===oc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===lc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===cc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===hc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===uc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===dc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===fc)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ka||i===pc||i===mc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Ka)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===pc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===mc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Dd||i===gc||i===_c||i===yc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Ka)return r.COMPRESSED_RED_RGTC1_EXT;if(i===gc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===_c)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===yc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ks?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var Dc=class extends Yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Tt=class extends Zt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Wy={type:"move"},kr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Tt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Tt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Tt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,i),f=this._getHandJoint(h,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],d=l.position.distanceTo(u.position),p=.02,g=.005;h.inputState.pinching&&d>p+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&d<=p-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wy)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Tt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},Xy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Yy=`
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

}`,Uc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){let s=new gn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Nn({vertexShader:Xy,fragmentShader:Yy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ze(new Ai(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Nc=class extends wi{constructor(e,t){super();let i=this,s=null,r=1,a=null,o="local-floor",c=1,h=null,l=null,u=null,d=null,p=null,g=null,_=new Uc,m=t.getContextAttributes(),f=null,y=null,v=[],x=[],C=new Re,T=null,A=new Yt;A.viewport=new ct;let I=new Yt;I.viewport=new ct;let S=[A,I],b=new Dc,D=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ce=v[K];return ce===void 0&&(ce=new kr,v[K]=ce),ce.getTargetRaySpace()},this.getControllerGrip=function(K){let ce=v[K];return ce===void 0&&(ce=new kr,v[K]=ce),ce.getGripSpace()},this.getHand=function(K){let ce=v[K];return ce===void 0&&(ce=new kr,v[K]=ce),ce.getHandSpace()};function H(K){let ce=x.indexOf(K.inputSource);if(ce===-1)return;let Ce=v[ce];Ce!==void 0&&(Ce.update(K.inputSource,K.frame,h||a),Ce.dispatchEvent({type:K.type,data:K.inputSource}))}function q(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",te);for(let K=0;K<v.length;K++){let ce=x[K];ce!==null&&(x[K]=null,v[K].disconnect(ce))}D=null,z=null,_.reset(),e.setRenderTarget(f),p=null,d=null,u=null,s=null,y=null,et.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(K){h=K},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(f=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",q),s.addEventListener("inputsourceschange",te),m.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(C),s.renderState.layers===void 0){let ce={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ce),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Yn(p.framebufferWidth,p.framebufferHeight,{format:Xn,type:Si,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ce=null,Ce=null,M=null;m.depth&&(M=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ce=m.stencil?js:Xs,Ce=m.stencil?Ks:ds);let U={colorFormat:t.RGBA8,depthFormat:M,scaleFactor:r};u=new XRWebGLBinding(s,t),d=u.createProjectionLayer(U),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Yn(d.textureWidth,d.textureHeight,{format:Xn,type:Si,depthTexture:new lo(d.textureWidth,d.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,ce),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),et.setContext(s),et.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function te(K){for(let ce=0;ce<K.removed.length;ce++){let Ce=K.removed[ce],M=x.indexOf(Ce);M>=0&&(x[M]=null,v[M].disconnect(Ce))}for(let ce=0;ce<K.added.length;ce++){let Ce=K.added[ce],M=x.indexOf(Ce);if(M===-1){for(let N=0;N<v.length;N++)if(N>=x.length){x.push(Ce),M=N;break}else if(x[N]===null){x[N]=Ce,M=N;break}if(M===-1)break}let U=v[M];U&&U.connect(Ce)}}let $=new L,oe=new L;function Y(K,ce,Ce){$.setFromMatrixPosition(ce.matrixWorld),oe.setFromMatrixPosition(Ce.matrixWorld);let M=$.distanceTo(oe),U=ce.projectionMatrix.elements,N=Ce.projectionMatrix.elements,X=U[14]/(U[10]-1),j=U[14]/(U[10]+1),Z=(U[9]+1)/U[5],se=(U[9]-1)/U[5],P=(U[8]-1)/U[0],Fe=(N[8]+1)/N[0],Se=X*P,he=X*Fe,_e=M/(-P+Fe),it=_e*-P;if(ce.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(it),K.translateZ(_e),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),U[10]===-1)K.projectionMatrix.copy(ce.projectionMatrix),K.projectionMatrixInverse.copy(ce.projectionMatrixInverse);else{let Ne=X+_e,R=j+_e,w=Se-it,B=he+(M-it),ne=Z*j/R*Ne,ee=se*j/R*Ne;K.projectionMatrix.makePerspective(w,B,ne,ee,Ne,R),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function fe(K,ce){ce===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ce.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let ce=K.near,Ce=K.far;_.texture!==null&&(_.depthNear>0&&(ce=_.depthNear),_.depthFar>0&&(Ce=_.depthFar)),b.near=I.near=A.near=ce,b.far=I.far=A.far=Ce,(D!==b.near||z!==b.far)&&(s.updateRenderState({depthNear:b.near,depthFar:b.far}),D=b.near,z=b.far),A.layers.mask=K.layers.mask|2,I.layers.mask=K.layers.mask|4,b.layers.mask=A.layers.mask|I.layers.mask;let M=K.parent,U=b.cameras;fe(b,M);for(let N=0;N<U.length;N++)fe(U[N],M);U.length===2?Y(b,A,I):b.projectionMatrix.copy(A.projectionMatrix),ge(K,b,M)};function ge(K,ce,Ce){Ce===null?K.matrix.copy(ce.matrixWorld):(K.matrix.copy(Ce.matrixWorld),K.matrix.invert(),K.matrix.multiply(ce.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ce.projectionMatrix),K.projectionMatrixInverse.copy(ce.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=zr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(K){c=K,d!==null&&(d.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(b)};let Pe=null;function Oe(K,ce){if(l=ce.getViewerPose(h||a),g=ce,l!==null){let Ce=l.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let M=!1;Ce.length!==b.cameras.length&&(b.cameras.length=0,M=!0);for(let N=0;N<Ce.length;N++){let X=Ce[N],j=null;if(p!==null)j=p.getViewport(X);else{let se=u.getViewSubImage(d,X);j=se.viewport,N===0&&(e.setRenderTargetTextures(y,se.colorTexture,d.ignoreDepthValues?void 0:se.depthStencilTexture),e.setRenderTarget(y))}let Z=S[N];Z===void 0&&(Z=new Yt,Z.layers.enable(N),Z.viewport=new ct,S[N]=Z),Z.matrix.fromArray(X.transform.matrix),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.projectionMatrix.fromArray(X.projectionMatrix),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert(),Z.viewport.set(j.x,j.y,j.width,j.height),N===0&&(b.matrix.copy(Z.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),M===!0&&b.cameras.push(Z)}let U=s.enabledFeatures;if(U&&U.includes("depth-sensing")){let N=u.getDepthInformation(Ce[0]);N&&N.isValid&&N.texture&&_.init(e,N,s.renderState)}}for(let Ce=0;Ce<v.length;Ce++){let M=x[Ce],U=v[Ce];M!==null&&U!==void 0&&U.update(M,ce,h||a)}Pe&&Pe(K,ce),ce.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ce}),g=null}let et=new Bd;et.setAnimationLoop(Oe),this.setAnimationLoop=function(K){Pe=K},this.dispose=function(){}}},rs=new _n,qy=new qe;function Zy(n,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Od(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,y,v,x){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),l(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,x)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,y,v):f.isSpriteMaterial?h(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===tn&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===tn&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let y=e.get(f),v=y.envMap,x=y.envMapRotation;v&&(m.envMap.value=v,rs.copy(x),rs.x*=-1,rs.y*=-1,rs.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(rs.y*=-1,rs.z*=-1),m.envMapRotation.value.setFromMatrix4(qy.makeRotationFromEuler(rs)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,y,v){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*y,m.scale.value=v*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,y){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===tn&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let y=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function $y(n,e,t,i){let s={},r={},a=[],o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,v){let x=v.program;i.uniformBlockBinding(y,x)}function h(y,v){let x=s[y.id];x===void 0&&(g(y),x=l(y),s[y.id]=x,y.addEventListener("dispose",m));let C=v.program;i.updateUBOMapping(y,C);let T=e.render.frame;r[y.id]!==T&&(d(y),r[y.id]=T)}function l(y){let v=u();y.__bindingPointIndex=v;let x=n.createBuffer(),C=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,C,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,x),x}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){let v=s[y.id],x=y.uniforms,C=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,A=x.length;T<A;T++){let I=Array.isArray(x[T])?x[T]:[x[T]];for(let S=0,b=I.length;S<b;S++){let D=I[S];if(p(D,T,S,C)===!0){let z=D.__offset,H=Array.isArray(D.value)?D.value:[D.value],q=0;for(let te=0;te<H.length;te++){let $=H[te],oe=_($);typeof $=="number"||typeof $=="boolean"?(D.__data[0]=$,n.bufferSubData(n.UNIFORM_BUFFER,z+q,D.__data)):$.isMatrix3?(D.__data[0]=$.elements[0],D.__data[1]=$.elements[1],D.__data[2]=$.elements[2],D.__data[3]=0,D.__data[4]=$.elements[3],D.__data[5]=$.elements[4],D.__data[6]=$.elements[5],D.__data[7]=0,D.__data[8]=$.elements[6],D.__data[9]=$.elements[7],D.__data[10]=$.elements[8],D.__data[11]=0):($.toArray(D.__data,q),q+=oe.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(y,v,x,C){let T=y.value,A=v+"_"+x;if(C[A]===void 0)return typeof T=="number"||typeof T=="boolean"?C[A]=T:C[A]=T.clone(),!0;{let I=C[A];if(typeof T=="number"||typeof T=="boolean"){if(I!==T)return C[A]=T,!0}else if(I.equals(T)===!1)return I.copy(T),!0}return!1}function g(y){let v=y.uniforms,x=0,C=16;for(let A=0,I=v.length;A<I;A++){let S=Array.isArray(v[A])?v[A]:[v[A]];for(let b=0,D=S.length;b<D;b++){let z=S[b],H=Array.isArray(z.value)?z.value:[z.value];for(let q=0,te=H.length;q<te;q++){let $=H[q],oe=_($),Y=x%C,fe=Y%oe.boundary,ge=Y+fe;x+=fe,ge!==0&&C-ge<oe.storage&&(x+=C-ge),z.__data=new Float32Array(oe.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=x,x+=oe.storage}}}let T=x%C;return T>0&&(x+=C-T),y.__size=x,y.__cache={},this}function _(y){let v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function m(y){let v=y.target;v.removeEventListener("dispose",m);let x=a.indexOf(v.__bindingPointIndex);a.splice(x,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(let y in s)n.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:c,update:h,dispose:f}}var co=class{constructor(e={}){let{canvas:t=Qp(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext!="undefined"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;let g=new Uint32Array(4),_=new Int32Array(4),m=null,f=null,y=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=zt,this.toneMapping=oi,this.toneMappingExposure=1;let x=this,C=!1,T=0,A=0,I=null,S=-1,b=null,D=new ct,z=new ct,H=null,q=new ke(0),te=0,$=t.width,oe=t.height,Y=1,fe=null,ge=null,Pe=new ct(0,0,$,oe),Oe=new ct(0,0,$,oe),et=!1,K=new Vr,ce=!1,Ce=!1,M=new qe,U=new qe,N=new L,X=new ct,j={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Z=!1;function se(){return I===null?Y:1}let P=i;function Fe(E,F){return t.getContext(E,F)}try{let E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",xe,!1),P===null){let F="webgl2";if(P=Fe(F,E),P===null)throw Fe(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Se,he,_e,it,Ne,R,w,B,ne,ee,Q,Ee,pe,Me,je,ue,Te,Be,He,Ae,Qe,$e,yt,k;function ye(){Se=new u_(P),Se.init(),$e=new Gy(P,Se),he=new r_(P,Se,e,$e),_e=new zy(P,Se),he.reverseDepthBuffer&&d&&_e.buffers.depth.setReversed(!0),it=new p_(P),Ne=new Ay,R=new Vy(P,Se,_e,Ne,he,$e,it),w=new o_(x),B=new h_(x),ne=new bm(P),yt=new i_(P,ne),ee=new d_(P,ne,it,yt),Q=new g_(P,ee,ne,it),He=new m_(P,he,R),ue=new a_(Ne),Ee=new Ty(x,w,B,Se,he,yt,ue),pe=new Zy(x,Ne),Me=new Cy,je=new Ny(Se),Be=new n_(x,w,B,_e,Q,p,c),Te=new Oy(x,Q,he),k=new $y(P,it,he,_e),Ae=new s_(P,Se,it),Qe=new f_(P,Se,it),it.programs=Ee.programs,x.capabilities=he,x.extensions=Se,x.properties=Ne,x.renderLists=Me,x.shadowMap=Te,x.state=_e,x.info=it}ye();let J=new Nc(x,P);this.xr=J,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let E=Se.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Se.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(E){E!==void 0&&(Y=E,this.setSize($,oe,!1))},this.getSize=function(E){return E.set($,oe)},this.setSize=function(E,F,G=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=E,oe=F,t.width=Math.floor(E*Y),t.height=Math.floor(F*Y),G===!0&&(t.style.width=E+"px",t.style.height=F+"px"),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set($*Y,oe*Y).floor()},this.setDrawingBufferSize=function(E,F,G){$=E,oe=F,Y=G,t.width=Math.floor(E*G),t.height=Math.floor(F*G),this.setViewport(0,0,E,F)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(Pe)},this.setViewport=function(E,F,G,W){E.isVector4?Pe.set(E.x,E.y,E.z,E.w):Pe.set(E,F,G,W),_e.viewport(D.copy(Pe).multiplyScalar(Y).round())},this.getScissor=function(E){return E.copy(Oe)},this.setScissor=function(E,F,G,W){E.isVector4?Oe.set(E.x,E.y,E.z,E.w):Oe.set(E,F,G,W),_e.scissor(z.copy(Oe).multiplyScalar(Y).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(E){_e.setScissorTest(et=E)},this.setOpaqueSort=function(E){fe=E},this.setTransparentSort=function(E){ge=E},this.getClearColor=function(E){return E.copy(Be.getClearColor())},this.setClearColor=function(){Be.setClearColor.apply(Be,arguments)},this.getClearAlpha=function(){return Be.getClearAlpha()},this.setClearAlpha=function(){Be.setClearAlpha.apply(Be,arguments)},this.clear=function(E=!0,F=!0,G=!0){let W=0;if(E){let O=!1;if(I!==null){let de=I.texture.format;O=de===lh||de===oh||de===ah}if(O){let de=I.texture.type,ve=de===Si||de===ds||de===Br||de===Ks||de===ih||de===sh,Ie=Be.getClearColor(),Le=Be.getClearAlpha(),Ve=Ie.r,Ye=Ie.g,De=Ie.b;ve?(g[0]=Ve,g[1]=Ye,g[2]=De,g[3]=Le,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Ve,_[1]=Ye,_[2]=De,_[3]=Le,P.clearBufferiv(P.COLOR,0,_))}else W|=P.COLOR_BUFFER_BIT}F&&(W|=P.DEPTH_BUFFER_BIT),G&&(W|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",xe,!1),Me.dispose(),je.dispose(),Ne.dispose(),w.dispose(),B.dispose(),Q.dispose(),yt.dispose(),k.dispose(),Ee.dispose(),J.dispose(),J.removeEventListener("sessionstart",iu),J.removeEventListener("sessionend",su),Qi.stop()};function ie(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function be(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let E=it.autoReset,F=Te.enabled,G=Te.autoUpdate,W=Te.needsUpdate,O=Te.type;ye(),it.autoReset=E,Te.enabled=F,Te.autoUpdate=G,Te.needsUpdate=W,Te.type=O}function xe(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Xe(E){let F=E.target;F.removeEventListener("dispose",Xe),Et(F)}function Et(E){jt(E),Ne.remove(E)}function jt(E){let F=Ne.get(E).programs;F!==void 0&&(F.forEach(function(G){Ee.releaseProgram(G)}),E.isShaderMaterial&&Ee.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,G,W,O,de){F===null&&(F=j);let ve=O.isMesh&&O.matrixWorld.determinant()<0,Ie=$f(E,F,G,W,O);_e.setMaterial(W,ve);let Le=G.index,Ve=1;if(W.wireframe===!0){if(Le=ee.getWireframeAttribute(G),Le===void 0)return;Ve=2}let Ye=G.drawRange,De=G.attributes.position,nt=Ye.start*Ve,xt=(Ye.start+Ye.count)*Ve;de!==null&&(nt=Math.max(nt,de.start*Ve),xt=Math.min(xt,(de.start+de.count)*Ve)),Le!==null?(nt=Math.max(nt,0),xt=Math.min(xt,Le.count)):De!=null&&(nt=Math.max(nt,0),xt=Math.min(xt,De.count));let bt=xt-nt;if(bt<0||bt===1/0)return;yt.setup(O,W,Ie,G,Le);let mn,rt=Ae;if(Le!==null&&(mn=ne.get(Le),rt=Qe,rt.setIndex(mn)),O.isMesh)W.wireframe===!0?(_e.setLineWidth(W.wireframeLinewidth*se()),rt.setMode(P.LINES)):rt.setMode(P.TRIANGLES);else if(O.isLine){let Ue=W.linewidth;Ue===void 0&&(Ue=1),_e.setLineWidth(Ue*se()),O.isLineSegments?rt.setMode(P.LINES):O.isLineLoop?rt.setMode(P.LINE_LOOP):rt.setMode(P.LINE_STRIP)}else O.isPoints?rt.setMode(P.POINTS):O.isSprite&&rt.setMode(P.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)rt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Se.get("WEBGL_multi_draw"))rt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Ue=O._multiDrawStarts,pi=O._multiDrawCounts,at=O._multiDrawCount,Hn=Le?ne.get(Le).bytesPerElement:1,As=Ne.get(W).currentProgram.getUniforms();for(let Sn=0;Sn<at;Sn++)As.setValue(P,"_gl_DrawID",Sn),rt.render(Ue[Sn]/Hn,pi[Sn])}else if(O.isInstancedMesh)rt.renderInstances(nt,bt,O.count);else if(G.isInstancedBufferGeometry){let Ue=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,pi=Math.min(G.instanceCount,Ue);rt.renderInstances(nt,bt,pi)}else rt.render(nt,bt)};function ot(E,F,G){E.transparent===!0&&E.side===Pt&&E.forceSinglePass===!1?(E.side=tn,E.needsUpdate=!0,ya(E,F,G),E.side=Wi,E.needsUpdate=!0,ya(E,F,G),E.side=Pt):ya(E,F,G)}this.compile=function(E,F,G=null){G===null&&(G=E),f=je.get(G),f.init(F),v.push(f),G.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),E!==G&&E.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),f.setupLights();let W=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let de=O.material;if(de)if(Array.isArray(de))for(let ve=0;ve<de.length;ve++){let Ie=de[ve];ot(Ie,G,O),W.add(Ie)}else ot(de,G,O),W.add(de)}),v.pop(),f=null,W},this.compileAsync=function(E,F,G=null){let W=this.compile(E,F,G);return new Promise(O=>{function de(){if(W.forEach(function(ve){Ne.get(ve).currentProgram.isReady()&&W.delete(ve)}),W.size===0){O(E);return}setTimeout(de,10)}Se.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let zn=null;function fi(E){zn&&zn(E)}function iu(){Qi.stop()}function su(){Qi.start()}let Qi=new Bd;Qi.setAnimationLoop(fi),typeof self!="undefined"&&Qi.setContext(self),this.setAnimationLoop=function(E){zn=E,J.setAnimationLoop(E),E===null?Qi.stop():Qi.start()},J.addEventListener("sessionstart",iu),J.addEventListener("sessionend",su),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(F),F=J.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,F,I),f=je.get(E,v.length),f.init(F),v.push(f),U.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),K.setFromProjectionMatrix(U),Ce=this.localClippingEnabled,ce=ue.init(this.clippingPlanes,Ce),m=Me.get(E,y.length),m.init(),y.push(m),J.enabled===!0&&J.isPresenting===!0){let de=x.xr.getDepthSensingMesh();de!==null&&el(de,F,-1/0,x.sortObjects)}el(E,F,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(fe,ge),Z=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,Z&&Be.addToRenderList(m,E),this.info.render.frame++,ce===!0&&ue.beginShadows();let G=f.state.shadowsArray;Te.render(G,E,F),ce===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=m.opaque,O=m.transmissive;if(f.setupLights(),F.isArrayCamera){let de=F.cameras;if(O.length>0)for(let ve=0,Ie=de.length;ve<Ie;ve++){let Le=de[ve];au(W,O,E,Le)}Z&&Be.render(E);for(let ve=0,Ie=de.length;ve<Ie;ve++){let Le=de[ve];ru(m,E,Le,Le.viewport)}}else O.length>0&&au(W,O,E,F),Z&&Be.render(E),ru(m,E,F);I!==null&&(R.updateMultisampleRenderTarget(I),R.updateRenderTargetMipmap(I)),E.isScene===!0&&E.onAfterRender(x,E,F),yt.resetDefaultState(),S=-1,b=null,v.pop(),v.length>0?(f=v[v.length-1],ce===!0&&ue.setGlobalState(x.clippingPlanes,f.state.camera)):f=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function el(E,F,G,W){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)G=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLight)f.pushLight(E),E.castShadow&&f.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||K.intersectsSprite(E)){W&&X.setFromMatrixPosition(E.matrixWorld).applyMatrix4(U);let ve=Q.update(E),Ie=E.material;Ie.visible&&m.push(E,ve,Ie,G,X.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||K.intersectsObject(E))){let ve=Q.update(E),Ie=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),X.copy(E.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),X.copy(ve.boundingSphere.center)),X.applyMatrix4(E.matrixWorld).applyMatrix4(U)),Array.isArray(Ie)){let Le=ve.groups;for(let Ve=0,Ye=Le.length;Ve<Ye;Ve++){let De=Le[Ve],nt=Ie[De.materialIndex];nt&&nt.visible&&m.push(E,ve,nt,G,X.z,De)}}else Ie.visible&&m.push(E,ve,Ie,G,X.z,null)}}let de=E.children;for(let ve=0,Ie=de.length;ve<Ie;ve++)el(de[ve],F,G,W)}function ru(E,F,G,W){let O=E.opaque,de=E.transmissive,ve=E.transparent;f.setupLightsView(G),ce===!0&&ue.setGlobalState(x.clippingPlanes,G),W&&_e.viewport(D.copy(W)),O.length>0&&_a(O,F,G),de.length>0&&_a(de,F,G),ve.length>0&&_a(ve,F,G),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function au(E,F,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[W.id]===void 0&&(f.state.transmissionRenderTarget[W.id]=new Yn(1,1,{generateMipmaps:!0,type:Se.has("EXT_color_buffer_half_float")||Se.has("EXT_color_buffer_float")?$r:Si,minFilter:us,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));let de=f.state.transmissionRenderTarget[W.id],ve=W.viewport||D;de.setSize(ve.z,ve.w);let Ie=x.getRenderTarget();x.setRenderTarget(de),x.getClearColor(q),te=x.getClearAlpha(),te<1&&x.setClearColor(16777215,.5),x.clear(),Z&&Be.render(G);let Le=x.toneMapping;x.toneMapping=oi;let Ve=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),f.setupLightsView(W),ce===!0&&ue.setGlobalState(x.clippingPlanes,W),_a(E,G,W),R.updateMultisampleRenderTarget(de),R.updateRenderTargetMipmap(de),Se.has("WEBGL_multisampled_render_to_texture")===!1){let Ye=!1;for(let De=0,nt=F.length;De<nt;De++){let xt=F[De],bt=xt.object,mn=xt.geometry,rt=xt.material,Ue=xt.group;if(rt.side===Pt&&bt.layers.test(W.layers)){let pi=rt.side;rt.side=tn,rt.needsUpdate=!0,ou(bt,G,W,mn,rt,Ue),rt.side=pi,rt.needsUpdate=!0,Ye=!0}}Ye===!0&&(R.updateMultisampleRenderTarget(de),R.updateRenderTargetMipmap(de))}x.setRenderTarget(Ie),x.setClearColor(q,te),Ve!==void 0&&(W.viewport=Ve),x.toneMapping=Le}function _a(E,F,G){let W=F.isScene===!0?F.overrideMaterial:null;for(let O=0,de=E.length;O<de;O++){let ve=E[O],Ie=ve.object,Le=ve.geometry,Ve=W===null?ve.material:W,Ye=ve.group;Ie.layers.test(G.layers)&&ou(Ie,F,G,Le,Ve,Ye)}}function ou(E,F,G,W,O,de){E.onBeforeRender(x,F,G,W,O,de),E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(x,F,G,W,E,de),O.transparent===!0&&O.side===Pt&&O.forceSinglePass===!1?(O.side=tn,O.needsUpdate=!0,x.renderBufferDirect(G,F,W,O,E,de),O.side=Wi,O.needsUpdate=!0,x.renderBufferDirect(G,F,W,O,E,de),O.side=Pt):x.renderBufferDirect(G,F,W,O,E,de),E.onAfterRender(x,F,G,W,O,de)}function ya(E,F,G){F.isScene!==!0&&(F=j);let W=Ne.get(E),O=f.state.lights,de=f.state.shadowsArray,ve=O.state.version,Ie=Ee.getParameters(E,O.state,de,F,G),Le=Ee.getProgramCacheKey(Ie),Ve=W.programs;W.environment=E.isMeshStandardMaterial?F.environment:null,W.fog=F.fog,W.envMap=(E.isMeshStandardMaterial?B:w).get(E.envMap||W.environment),W.envMapRotation=W.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,Ve===void 0&&(E.addEventListener("dispose",Xe),Ve=new Map,W.programs=Ve);let Ye=Ve.get(Le);if(Ye!==void 0){if(W.currentProgram===Ye&&W.lightsStateVersion===ve)return cu(E,Ie),Ye}else Ie.uniforms=Ee.getUniforms(E),E.onBeforeCompile(Ie,x),Ye=Ee.acquireProgram(Ie,Le),Ve.set(Le,Ye),W.uniforms=Ie.uniforms;let De=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(De.clippingPlanes=ue.uniform),cu(E,Ie),W.needsLights=Kf(E),W.lightsStateVersion=ve,W.needsLights&&(De.ambientLightColor.value=O.state.ambient,De.lightProbe.value=O.state.probe,De.directionalLights.value=O.state.directional,De.directionalLightShadows.value=O.state.directionalShadow,De.spotLights.value=O.state.spot,De.spotLightShadows.value=O.state.spotShadow,De.rectAreaLights.value=O.state.rectArea,De.ltc_1.value=O.state.rectAreaLTC1,De.ltc_2.value=O.state.rectAreaLTC2,De.pointLights.value=O.state.point,De.pointLightShadows.value=O.state.pointShadow,De.hemisphereLights.value=O.state.hemi,De.directionalShadowMap.value=O.state.directionalShadowMap,De.directionalShadowMatrix.value=O.state.directionalShadowMatrix,De.spotShadowMap.value=O.state.spotShadowMap,De.spotLightMatrix.value=O.state.spotLightMatrix,De.spotLightMap.value=O.state.spotLightMap,De.pointShadowMap.value=O.state.pointShadowMap,De.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=Ye,W.uniformsList=null,Ye}function lu(E){if(E.uniformsList===null){let F=E.currentProgram.getUniforms();E.uniformsList=qs.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function cu(E,F){let G=Ne.get(E);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function $f(E,F,G,W,O){F.isScene!==!0&&(F=j),R.resetTextureUnits();let de=F.fog,ve=W.isMeshStandardMaterial?F.environment:null,Ie=I===null?x.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:sr,Le=(W.isMeshStandardMaterial?B:w).get(W.envMap||ve),Ve=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ye=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),De=!!G.morphAttributes.position,nt=!!G.morphAttributes.normal,xt=!!G.morphAttributes.color,bt=oi;W.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(bt=x.toneMapping);let mn=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,rt=mn!==void 0?mn.length:0,Ue=Ne.get(W),pi=f.state.lights;if(ce===!0&&(Ce===!0||E!==b)){let Dn=E===b&&W.id===S;ue.setState(W,E,Dn)}let at=!1;W.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==pi.state.version||Ue.outputColorSpace!==Ie||O.isBatchedMesh&&Ue.batching===!1||!O.isBatchedMesh&&Ue.batching===!0||O.isBatchedMesh&&Ue.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ue.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ue.instancing===!1||!O.isInstancedMesh&&Ue.instancing===!0||O.isSkinnedMesh&&Ue.skinning===!1||!O.isSkinnedMesh&&Ue.skinning===!0||O.isInstancedMesh&&Ue.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ue.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ue.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ue.instancingMorph===!1&&O.morphTexture!==null||Ue.envMap!==Le||W.fog===!0&&Ue.fog!==de||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==ue.numPlanes||Ue.numIntersection!==ue.numIntersection)||Ue.vertexAlphas!==Ve||Ue.vertexTangents!==Ye||Ue.morphTargets!==De||Ue.morphNormals!==nt||Ue.morphColors!==xt||Ue.toneMapping!==bt||Ue.morphTargetsCount!==rt)&&(at=!0):(at=!0,Ue.__version=W.version);let Hn=Ue.currentProgram;at===!0&&(Hn=ya(W,F,O));let As=!1,Sn=!1,Mr=!1,Mt=Hn.getUniforms(),ii=Ue.uniforms;if(_e.useProgram(Hn.program)&&(As=!0,Sn=!0,Mr=!0),W.id!==S&&(S=W.id,Sn=!0),As||b!==E){_e.buffers.depth.getReversed()?(M.copy(E.projectionMatrix),tm(M),nm(M),Mt.setValue(P,"projectionMatrix",M)):Mt.setValue(P,"projectionMatrix",E.projectionMatrix),Mt.setValue(P,"viewMatrix",E.matrixWorldInverse);let Di=Mt.map.cameraPosition;Di!==void 0&&Di.setValue(P,N.setFromMatrixPosition(E.matrixWorld)),he.logarithmicDepthBuffer&&Mt.setValue(P,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Mt.setValue(P,"isOrthographic",E.isOrthographicCamera===!0),b!==E&&(b=E,Sn=!0,Mr=!0)}if(O.isSkinnedMesh){Mt.setOptional(P,O,"bindMatrix"),Mt.setOptional(P,O,"bindMatrixInverse");let Dn=O.skeleton;Dn&&(Dn.boneTexture===null&&Dn.computeBoneTexture(),Mt.setValue(P,"boneTexture",Dn.boneTexture,R))}O.isBatchedMesh&&(Mt.setOptional(P,O,"batchingTexture"),Mt.setValue(P,"batchingTexture",O._matricesTexture,R),Mt.setOptional(P,O,"batchingIdTexture"),Mt.setValue(P,"batchingIdTexture",O._indirectTexture,R),Mt.setOptional(P,O,"batchingColorTexture"),O._colorsTexture!==null&&Mt.setValue(P,"batchingColorTexture",O._colorsTexture,R));let Sr=G.morphAttributes;if((Sr.position!==void 0||Sr.normal!==void 0||Sr.color!==void 0)&&He.update(O,G,Hn),(Sn||Ue.receiveShadow!==O.receiveShadow)&&(Ue.receiveShadow=O.receiveShadow,Mt.setValue(P,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(ii.envMap.value=Le,ii.flipEnvMap.value=Le.isCubeTexture&&Le.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&F.environment!==null&&(ii.envMapIntensity.value=F.environmentIntensity),Sn&&(Mt.setValue(P,"toneMappingExposure",x.toneMappingExposure),Ue.needsLights&&Jf(ii,Mr),de&&W.fog===!0&&pe.refreshFogUniforms(ii,de),pe.refreshMaterialUniforms(ii,W,Y,oe,f.state.transmissionRenderTarget[E.id]),qs.upload(P,lu(Ue),ii,R)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(qs.upload(P,lu(Ue),ii,R),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Mt.setValue(P,"center",O.center),Mt.setValue(P,"modelViewMatrix",O.modelViewMatrix),Mt.setValue(P,"normalMatrix",O.normalMatrix),Mt.setValue(P,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let Dn=W.uniformsGroups;for(let Di=0,Ui=Dn.length;Di<Ui;Di++){let hu=Dn[Di];k.update(hu,Hn),k.bind(hu,Hn)}}return Hn}function Jf(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function Kf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(E,F,G){Ne.get(E.texture).__webglTexture=F,Ne.get(E.depthTexture).__webglTexture=G;let W=Ne.get(E);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=G===void 0,W.__autoAllocateDepthBuffer||Se.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,F){let G=Ne.get(E);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,G=0){I=E,T=F,A=G;let W=!0,O=null,de=!1,ve=!1;if(E){let Le=Ne.get(E);if(Le.__useDefaultFramebuffer!==void 0)_e.bindFramebuffer(P.FRAMEBUFFER,null),W=!1;else if(Le.__webglFramebuffer===void 0)R.setupRenderTarget(E);else if(Le.__hasExternalTextures)R.rebindTextures(E,Ne.get(E.texture).__webglTexture,Ne.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let De=E.depthTexture;if(Le.__boundDepthTexture!==De){if(De!==null&&Ne.has(De)&&(E.width!==De.image.width||E.height!==De.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(E)}}let Ve=E.texture;(Ve.isData3DTexture||Ve.isDataArrayTexture||Ve.isCompressedArrayTexture)&&(ve=!0);let Ye=Ne.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ye[F])?O=Ye[F][G]:O=Ye[F],de=!0):E.samples>0&&R.useMultisampledRTT(E)===!1?O=Ne.get(E).__webglMultisampledFramebuffer:Array.isArray(Ye)?O=Ye[G]:O=Ye,D.copy(E.viewport),z.copy(E.scissor),H=E.scissorTest}else D.copy(Pe).multiplyScalar(Y).floor(),z.copy(Oe).multiplyScalar(Y).floor(),H=et;if(_e.bindFramebuffer(P.FRAMEBUFFER,O)&&W&&_e.drawBuffers(E,O),_e.viewport(D),_e.scissor(z),_e.setScissorTest(H),de){let Le=Ne.get(E.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+F,Le.__webglTexture,G)}else if(ve){let Le=Ne.get(E.texture),Ve=F||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,Le.__webglTexture,G||0,Ve)}S=-1},this.readRenderTargetPixels=function(E,F,G,W,O,de,ve){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=Ne.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ve!==void 0&&(Ie=Ie[ve]),Ie){_e.bindFramebuffer(P.FRAMEBUFFER,Ie);try{let Le=E.texture,Ve=Le.format,Ye=Le.type;if(!he.textureFormatReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!he.textureTypeReadable(Ye)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-W&&G>=0&&G<=E.height-O&&P.readPixels(F,G,W,O,$e.convert(Ve),$e.convert(Ye),de)}finally{let Le=I!==null?Ne.get(I).__webglFramebuffer:null;_e.bindFramebuffer(P.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(E,F,G,W,O,de,ve){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=Ne.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ve!==void 0&&(Ie=Ie[ve]),Ie){let Le=E.texture,Ve=Le.format,Ye=Le.type;if(!he.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!he.textureTypeReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=E.width-W&&G>=0&&G<=E.height-O){_e.bindFramebuffer(P.FRAMEBUFFER,Ie);let De=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,De),P.bufferData(P.PIXEL_PACK_BUFFER,de.byteLength,P.STREAM_READ),P.readPixels(F,G,W,O,$e.convert(Ve),$e.convert(Ye),0);let nt=I!==null?Ne.get(I).__webglFramebuffer:null;_e.bindFramebuffer(P.FRAMEBUFFER,nt);let xt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await em(P,xt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,De),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,de),P.deleteBuffer(De),P.deleteSync(xt),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,F=null,G=0){E.isTexture!==!0&&(Lr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,E=arguments[1]);let W=Math.pow(2,-G),O=Math.floor(E.image.width*W),de=Math.floor(E.image.height*W),ve=F!==null?F.x:0,Ie=F!==null?F.y:0;R.setTexture2D(E,0),P.copyTexSubImage2D(P.TEXTURE_2D,G,0,0,ve,Ie,O,de),_e.unbindTexture()},this.copyTextureToTexture=function(E,F,G=null,W=null,O=0){E.isTexture!==!0&&(Lr("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,E=arguments[1],F=arguments[2],O=arguments[3]||0,G=null);let de,ve,Ie,Le,Ve,Ye,De,nt,xt,bt=E.isCompressedTexture?E.mipmaps[O]:E.image;G!==null?(de=G.max.x-G.min.x,ve=G.max.y-G.min.y,Ie=G.isBox3?G.max.z-G.min.z:1,Le=G.min.x,Ve=G.min.y,Ye=G.isBox3?G.min.z:0):(de=bt.width,ve=bt.height,Ie=bt.depth||1,Le=0,Ve=0,Ye=0),W!==null?(De=W.x,nt=W.y,xt=W.z):(De=0,nt=0,xt=0);let mn=$e.convert(F.format),rt=$e.convert(F.type),Ue;F.isData3DTexture?(R.setTexture3D(F,0),Ue=P.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(R.setTexture2DArray(F,0),Ue=P.TEXTURE_2D_ARRAY):(R.setTexture2D(F,0),Ue=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,F.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,F.unpackAlignment);let pi=P.getParameter(P.UNPACK_ROW_LENGTH),at=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Hn=P.getParameter(P.UNPACK_SKIP_PIXELS),As=P.getParameter(P.UNPACK_SKIP_ROWS),Sn=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,bt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,bt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Le),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ve),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ye);let Mr=E.isDataArrayTexture||E.isData3DTexture,Mt=F.isDataArrayTexture||F.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){let ii=Ne.get(E),Sr=Ne.get(F),Dn=Ne.get(ii.__renderTarget),Di=Ne.get(Sr.__renderTarget);_e.bindFramebuffer(P.READ_FRAMEBUFFER,Dn.__webglFramebuffer),_e.bindFramebuffer(P.DRAW_FRAMEBUFFER,Di.__webglFramebuffer);for(let Ui=0;Ui<Ie;Ui++)Mr&&P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ne.get(E).__webglTexture,O,Ye+Ui),E.isDepthTexture?(Mt&&P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ne.get(F).__webglTexture,O,xt+Ui),P.blitFramebuffer(Le,Ve,de,ve,De,nt,de,ve,P.DEPTH_BUFFER_BIT,P.NEAREST)):Mt?P.copyTexSubImage3D(Ue,O,De,nt,xt+Ui,Le,Ve,de,ve):P.copyTexSubImage2D(Ue,O,De,nt,xt+Ui,Le,Ve,de,ve);_e.bindFramebuffer(P.READ_FRAMEBUFFER,null),_e.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Mt?E.isDataTexture||E.isData3DTexture?P.texSubImage3D(Ue,O,De,nt,xt,de,ve,Ie,mn,rt,bt.data):F.isCompressedArrayTexture?P.compressedTexSubImage3D(Ue,O,De,nt,xt,de,ve,Ie,mn,bt.data):P.texSubImage3D(Ue,O,De,nt,xt,de,ve,Ie,mn,rt,bt):E.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,O,De,nt,de,ve,mn,rt,bt.data):E.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,O,De,nt,bt.width,bt.height,mn,bt.data):P.texSubImage2D(P.TEXTURE_2D,O,De,nt,de,ve,mn,rt,bt);P.pixelStorei(P.UNPACK_ROW_LENGTH,pi),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,at),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Hn),P.pixelStorei(P.UNPACK_SKIP_ROWS,As),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Sn),O===0&&F.generateMipmaps&&P.generateMipmap(Ue),_e.unbindTexture()},this.copyTextureToTexture3D=function(E,F,G=null,W=null,O=0){return E.isTexture!==!0&&(Lr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,W=arguments[1]||null,E=arguments[2],F=arguments[3],O=arguments[4]||0),Lr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,F,G,W,O)},this.initRenderTarget=function(E){Ne.get(E).__webglFramebuffer===void 0&&R.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?R.setTextureCube(E,0):E.isData3DTexture?R.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?R.setTexture2DArray(E,0):R.setTexture2D(E,0),_e.unbindTexture()},this.resetState=function(){T=0,A=0,I=null,_e.reset(),yt.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}};var tr=class extends Zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var kc=class extends gn{constructor(e=null,t=1,i=1,s,r,a,o,c,h=An,l=An,u,d){super(null,a,o,c,h,l,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Gr=class extends vt{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Vs=new qe,ud=new qe,za=[],dd=new Rn,Jy=new qe,Rr=new ze,Cr=new Ei,Wr=class extends ze{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Gr(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Jy)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Rn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Vs),dd.copy(e.boundingBox).applyMatrix4(Vs),this.boundingBox.union(dd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ei),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Vs),Cr.copy(e.boundingSphere).applyMatrix4(Vs),this.boundingSphere.union(Cr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(Rr.geometry=this.geometry,Rr.material=this.material,Rr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Cr.copy(this.boundingSphere),Cr.applyMatrix4(i),e.ray.intersectsSphere(Cr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Vs),ud.multiplyMatrices(i,Vs),Rr.matrixWorld=ud,Rr.raycast(e,za);for(let a=0,o=za.length;a<o;a++){let c=za[a];c.instanceId=r,c.object=this,t.push(c)}za.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Gr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new kc(new Float32Array(s*this.count),s,this.count,rh,ai));let r=this.morphTexture.source.data.data,a=0;for(let h=0;h<i.length;h++)a+=i[h];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Xr=class extends Ti{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ho=new L,uo=new L,fd=new qe,Pr=new Xi,Ha=new Ei,Cl=new L,pd=new L,fo=class extends Zt{constructor(e=new ht,t=new Xr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)ho.fromBufferAttribute(t,s-1),uo.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=ho.distanceTo(uo);e.setAttribute("lineDistance",new Ke(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ha.copy(i.boundingSphere),Ha.applyMatrix4(s),Ha.radius+=r,e.ray.intersectsSphere(Ha)===!1)return;fd.copy(s).invert(),Pr.copy(e.ray).applyMatrix4(fd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,l=i.index,d=i.attributes.position;if(l!==null){let p=Math.max(0,a.start),g=Math.min(l.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=h){let f=l.getX(_),y=l.getX(_+1),v=Va(this,e,Pr,c,f,y);v&&t.push(v)}if(this.isLineLoop){let _=l.getX(g-1),m=l.getX(p),f=Va(this,e,Pr,c,_,m);f&&t.push(f)}}else{let p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=h){let f=Va(this,e,Pr,c,_,_+1);f&&t.push(f)}if(this.isLineLoop){let _=Va(this,e,Pr,c,g-1,p);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Va(n,e,t,i,s,r){let a=n.geometry.attributes.position;if(ho.fromBufferAttribute(a,s),uo.fromBufferAttribute(a,r),t.distanceSqToSegment(ho,uo,Cl,pd)>i)return;Cl.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(Cl);if(!(c<e.near||c>e.far))return{distance:c,point:pd.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}var Fc=class extends Ti{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},md=new qe,Oc=new Xi,Ga=new Ei,Wa=new L,po=class extends Zt{constructor(e=new ht,t=new Fc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ga.copy(i.boundingSphere),Ga.applyMatrix4(s),Ga.radius+=r,e.ray.intersectsSphere(Ga)===!1)return;md.copy(s).invert(),Oc.copy(e.ray).applyMatrix4(md);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=i.index,u=i.attributes.position;if(h!==null){let d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let g=d,_=p;g<_;g++){let m=h.getX(g);Wa.fromBufferAttribute(u,m),gd(Wa,m,c,s,e,t,this)}}else{let d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let g=d,_=p;g<_;g++)Wa.fromBufferAttribute(u,g),gd(Wa,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function gd(n,e,t,i,s,r,a){let o=Oc.distanceSqToPoint(n);if(o<t){let c=new L;Oc.closestPointToPoint(n,c),c.applyMatrix4(i);let h=s.ray.origin.distanceTo(c);if(h<s.near||h>s.far)return;r.push({distance:h,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var li=class extends gn{constructor(e,t,i,s,r,a,o,c,h){super(e,t,i,s,r,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}},Bc=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),s=0,r=i.length,a;t?a=t:a=e*i[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);let l=i[s],d=i[s+1]-l,p=(a-l)/d;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Re:new L);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new L,s=[],r=[],a=[],o=new L,c=new qe;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new L)}r[0]=new L,a[0]=new L;let h=Number.MAX_VALUE,l=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);l<=h&&(h=l,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),d<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Lt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Lt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}};function uh(){let n=0,e=0,t=0,i=0;function s(r,a,o,c){n=r,e=o,t=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,l,u){let d=(a-r)/h-(o-r)/(h+l)+(o-a)/l,p=(o-a)/l-(c-a)/(l+u)+(c-o)/u;d*=l,p*=l,s(a,o,d,p)},calc:function(r){let a=r*r,o=a*r;return n+e*r+t*a+i*o}}}var Xa=new L,Pl=new uh,Il=new uh,Ll=new uh,Yi=class extends Bc{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new L){let i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,l;this.closed||o>0?h=s[(o-1)%r]:(Xa.subVectors(s[0],s[1]).add(s[0]),h=Xa);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?l=s[(o+2)%r]:(Xa.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=Xa),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(h.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(l),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Pl.initNonuniformCatmullRom(h.x,u.x,d.x,l.x,g,_,m),Il.initNonuniformCatmullRom(h.y,u.y,d.y,l.y,g,_,m),Ll.initNonuniformCatmullRom(h.z,u.z,d.z,l.z,g,_,m)}else this.curveType==="catmullrom"&&(Pl.initCatmullRom(h.x,u.x,d.x,l.x,this.tension),Il.initCatmullRom(h.y,u.y,d.y,l.y,this.tension),Ll.initCatmullRom(h.z,u.z,d.z,l.z,this.tension));return i.set(Pl.calc(c),Il.calc(c),Ll.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};var mo=class n extends ht{constructor(e=[new Re(0,-.5),new Re(.5,0),new Re(0,.5)],t=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:s},t=Math.floor(t),s=Lt(s,0,Math.PI*2);let r=[],a=[],o=[],c=[],h=[],l=1/t,u=new L,d=new Re,p=new L,g=new L,_=new L,m=0,f=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:m=e[y+1].x-e[y].x,f=e[y+1].y-e[y].y,p.x=f*1,p.y=-m,p.z=f*0,_.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(_.x,_.y,_.z);break;default:m=e[y+1].x-e[y].x,f=e[y+1].y-e[y].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),c.push(p.x,p.y,p.z),_.copy(g)}for(let y=0;y<=t;y++){let v=i+y*l*s,x=Math.sin(v),C=Math.cos(v);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*x,u.y=e[T].y,u.z=e[T].x*C,a.push(u.x,u.y,u.z),d.x=y/t,d.y=T/(e.length-1),o.push(d.x,d.y);let A=c[3*T+0]*x,I=c[3*T+1],S=c[3*T+0]*C;h.push(A,I,S)}}for(let y=0;y<t;y++)for(let v=0;v<e.length-1;v++){let x=v+y*e.length,C=x,T=x+e.length,A=x+e.length+1,I=x+1;r.push(C,T,I),r.push(A,I,T)}this.setIndex(r),this.setAttribute("position",new Ke(a,3)),this.setAttribute("uv",new Ke(o,2)),this.setAttribute("normal",new Ke(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.points,e.segments,e.phiStart,e.phiLength)}};var nr=class n extends ht{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],h=new L,l=new Re;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let p=i+u/t*s;h.x=e*Math.cos(p),h.y=e*Math.sin(p),a.push(h.x,h.y,h.z),o.push(0,0,1),l.x=(a[d]/e+1)/2,l.y=(a[d+1]/e+1)/2,c.push(l.x,l.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ke(a,3)),this.setAttribute("normal",new Ke(o,3)),this.setAttribute("uv",new Ke(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Zn=class n extends ht{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let h=this;s=Math.floor(s),r=Math.floor(r);let l=[],u=[],d=[],p=[],g=0,_=[],m=i/2,f=0;y(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute("position",new Ke(u,3)),this.setAttribute("normal",new Ke(d,3)),this.setAttribute("uv",new Ke(p,2));function y(){let x=new L,C=new L,T=0,A=(t-e)/i;for(let I=0;I<=r;I++){let S=[],b=I/r,D=b*(t-e)+e;for(let z=0;z<=s;z++){let H=z/s,q=H*c+o,te=Math.sin(q),$=Math.cos(q);C.x=D*te,C.y=-b*i+m,C.z=D*$,u.push(C.x,C.y,C.z),x.set(te,A,$).normalize(),d.push(x.x,x.y,x.z),p.push(H,1-b),S.push(g++)}_.push(S)}for(let I=0;I<s;I++)for(let S=0;S<r;S++){let b=_[S][I],D=_[S+1][I],z=_[S+1][I+1],H=_[S][I+1];(e>0||S!==0)&&(l.push(b,D,H),T+=3),(t>0||S!==r-1)&&(l.push(D,z,H),T+=3)}h.addGroup(f,T,0),f+=T}function v(x){let C=g,T=new Re,A=new L,I=0,S=x===!0?e:t,b=x===!0?1:-1;for(let z=1;z<=s;z++)u.push(0,m*b,0),d.push(0,b,0),p.push(.5,.5),g++;let D=g;for(let z=0;z<=s;z++){let q=z/s*c+o,te=Math.cos(q),$=Math.sin(q);A.x=S*$,A.y=m*b,A.z=S*te,u.push(A.x,A.y,A.z),d.push(0,b,0),T.x=te*.5+.5,T.y=$*.5*b+.5,p.push(T.x,T.y),g++}for(let z=0;z<s;z++){let H=C+z,q=D+z;x===!0?l.push(q,q+1,H):l.push(q+1,q,H),I+=3}h.addGroup(f,I,x===!0?1:2),f+=I}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ri=class n extends Zn{constructor(e=1,t=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},zc=class n extends ht{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],a=[];o(s),h(i),l(),this.setAttribute("position",new Ke(r,3)),this.setAttribute("normal",new Ke(r.slice(),3)),this.setAttribute("uv",new Ke(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){let v=new L,x=new L,C=new L;for(let T=0;T<t.length;T+=3)p(t[T+0],v),p(t[T+1],x),p(t[T+2],C),c(v,x,C,y)}function c(y,v,x,C){let T=C+1,A=[];for(let I=0;I<=T;I++){A[I]=[];let S=y.clone().lerp(x,I/T),b=v.clone().lerp(x,I/T),D=T-I;for(let z=0;z<=D;z++)z===0&&I===T?A[I][z]=S:A[I][z]=S.clone().lerp(b,z/D)}for(let I=0;I<T;I++)for(let S=0;S<2*(T-I)-1;S++){let b=Math.floor(S/2);S%2===0?(d(A[I][b+1]),d(A[I+1][b]),d(A[I][b])):(d(A[I][b+1]),d(A[I+1][b+1]),d(A[I+1][b]))}}function h(y){let v=new L;for(let x=0;x<r.length;x+=3)v.x=r[x+0],v.y=r[x+1],v.z=r[x+2],v.normalize().multiplyScalar(y),r[x+0]=v.x,r[x+1]=v.y,r[x+2]=v.z}function l(){let y=new L;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];let x=m(y)/2/Math.PI+.5,C=f(y)/Math.PI+.5;a.push(x,1-C)}g(),u()}function u(){for(let y=0;y<a.length;y+=6){let v=a[y+0],x=a[y+2],C=a[y+4],T=Math.max(v,x,C),A=Math.min(v,x,C);T>.9&&A<.1&&(v<.2&&(a[y+0]+=1),x<.2&&(a[y+2]+=1),C<.2&&(a[y+4]+=1))}}function d(y){r.push(y.x,y.y,y.z)}function p(y,v){let x=y*3;v.x=e[x+0],v.y=e[x+1],v.z=e[x+2]}function g(){let y=new L,v=new L,x=new L,C=new L,T=new Re,A=new Re,I=new Re;for(let S=0,b=0;S<r.length;S+=9,b+=6){y.set(r[S+0],r[S+1],r[S+2]),v.set(r[S+3],r[S+4],r[S+5]),x.set(r[S+6],r[S+7],r[S+8]),T.set(a[b+0],a[b+1]),A.set(a[b+2],a[b+3]),I.set(a[b+4],a[b+5]),C.copy(y).add(v).add(x).divideScalar(3);let D=m(C);_(T,b+0,y,D),_(A,b+2,v,D),_(I,b+4,x,D)}}function _(y,v,x,C){C<0&&y.x===1&&(a[v]=y.x-1),x.x===0&&x.z===0&&(a[v]=C/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}};var go=class n extends zc{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var _o=class n extends ht{constructor(e=.5,t=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);let o=[],c=[],h=[],l=[],u=e,d=(t-e)/s,p=new L,g=new Re;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){let f=r+m/i*a;p.x=u*Math.cos(f),p.y=u*Math.sin(f),c.push(p.x,p.y,p.z),h.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,l.push(g.x,g.y)}u+=d}for(let _=0;_<s;_++){let m=_*(i+1);for(let f=0;f<i;f++){let y=f+m,v=y,x=y+i+1,C=y+i+2,T=y+1;o.push(v,x,T),o.push(x,C,T)}}this.setIndex(o),this.setAttribute("position",new Ke(c,3)),this.setAttribute("normal",new Ke(h,3)),this.setAttribute("uv",new Ke(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var on=class n extends ht{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(a+o,Math.PI),h=0,l=[],u=new L,d=new L,p=[],g=[],_=[],m=[];for(let f=0;f<=i;f++){let y=[],v=f/i,x=0;f===0&&a===0?x=.5/t:f===i&&c===Math.PI&&(x=-.5/t);for(let C=0;C<=t;C++){let T=C/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+v*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(T+x,1-v),y.push(h++)}l.push(y)}for(let f=0;f<i;f++)for(let y=0;y<t;y++){let v=l[f][y+1],x=l[f][y],C=l[f+1][y],T=l[f+1][y+1];(f!==0||a>0)&&p.push(v,x,T),(f!==i-1||c<Math.PI)&&p.push(x,C,T)}this.setIndex(p),this.setAttribute("position",new Ke(g,3)),this.setAttribute("normal",new Ke(_,3)),this.setAttribute("uv",new Ke(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var yn=class n extends ht{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let a=[],o=[],c=[],h=[],l=new L,u=new L,d=new L;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){let _=g/s*r,m=p/i*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),l.x=e*Math.cos(_),l.y=e*Math.sin(_),d.subVectors(u,l).normalize(),c.push(d.x,d.y,d.z),h.push(g/s),h.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){let _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,y=(s+1)*p+g;a.push(_,m,y),a.push(m,f,y)}this.setIndex(a),this.setAttribute("position",new Ke(o,3)),this.setAttribute("normal",new Ke(c,3)),this.setAttribute("uv",new Ke(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Nt=class extends Ti{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ud,this.normalScale=new Re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function Ya(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Ky(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var ir=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(i=2,r=o);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}a=i,i=0;break t}break n}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Hc=class extends ir{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:pu,endingEnd:pu}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case mu:r=e,o=2*t-i;break;case gu:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(c===void 0)switch(this.getSettings_().endingEnd){case mu:a=e,c=2*i-t;break;case gu:a=1,c=i+s[1]-s[0];break;default:a=e-1,c=t}let h=(i-t)*.5,l=this.valueSize;this._weightPrev=h/(t-o),this._weightNext=h/(c-i),this._offsetPrev=r*l,this._offsetNext=a*l}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,h=c-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(i-t)/(s-t),_=g*g,m=_*g,f=-d*m+2*d*_-d*g,y=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,v=(-1-p)*m+(1.5+p)*_+.5*g,x=p*m-p*_;for(let C=0;C!==o;++C)r[C]=f*a[l+C]+y*a[h+C]+v*a[c+C]+x*a[u+C];return r}},Vc=class extends ir{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,h=c-o,l=(i-t)/(s-t),u=1-l;for(let d=0;d!==o;++d)r[d]=a[h+d]*u+a[c+d]*l;return r}},Gc=class extends ir{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},$n=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ya(t,this.TimeBufferType),this.values=Ya(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Ya(e.times,Array),values:Ya(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Gc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Vc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Hc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ja:t=this.InterpolantFactoryMethodDiscrete;break;case xc:t=this.InterpolantFactoryMethodLinear;break;case nl:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ja;case this.InterpolantFactoryMethodLinear:return xc;case this.InterpolantFactoryMethodSmooth:return nl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=i[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&Ky(s))for(let o=0,c=s.length;o!==c;++o){let h=s[o];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,h),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===nl,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,h=e[o],l=e[o+1];if(h!==l&&(o!==1||h!==e[0]))if(s)c=!0;else{let u=o*i,d=u-i,p=u+i;for(let g=0;g!==i;++g){let _=t[u+g];if(_!==t[d+g]||_!==t[p+g]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let u=o*i,d=a*i;for(let p=0;p!==i;++p)t[d+p]=t[u+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,c=a*i,h=0;h!==i;++h)t[c+h]=t[o+h];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};$n.prototype.TimeBufferType=Float32Array;$n.prototype.ValueBufferType=Float32Array;$n.prototype.DefaultInterpolation=xc;var fs=class extends $n{constructor(e,t,i){super(e,t,i)}};fs.prototype.ValueTypeName="bool";fs.prototype.ValueBufferType=Array;fs.prototype.DefaultInterpolation=ja;fs.prototype.InterpolantFactoryMethodLinear=void 0;fs.prototype.InterpolantFactoryMethodSmooth=void 0;var Wc=class extends $n{};Wc.prototype.ValueTypeName="color";var Xc=class extends $n{};Xc.prototype.ValueTypeName="number";var Yc=class extends ir{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(i-t)/(s-t),h=e*o;for(let l=h+o;h!==l;h+=4)qt.slerpFlat(r,0,a,h-o,a,h,c);return r}},yo=class extends $n{InterpolantFactoryMethodLinear(e){return new Yc(this.times,this.values,this.getValueSize(),e)}};yo.prototype.ValueTypeName="quaternion";yo.prototype.InterpolantFactoryMethodSmooth=void 0;var ps=class extends $n{constructor(e,t,i){super(e,t,i)}};ps.prototype.ValueTypeName="string";ps.prototype.ValueBufferType=Array;ps.prototype.DefaultInterpolation=ja;ps.prototype.InterpolantFactoryMethodLinear=void 0;ps.prototype.InterpolantFactoryMethodSmooth=void 0;var qc=class extends $n{};qc.prototype.ValueTypeName="vector";var Zc=class{constructor(e,t,i){let s=this,r=!1,a=0,o=0,c,h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(l){o++,r===!1&&s.onStart!==void 0&&s.onStart(l,a,o),r=!0},this.itemEnd=function(l){a++,s.onProgress!==void 0&&s.onProgress(l,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(l){s.onError!==void 0&&s.onError(l)},this.resolveURL=function(l){return c?c(l):l},this.setURLModifier=function(l){return c=l,this},this.addHandler=function(l,u){return h.push(l,u),this},this.removeHandler=function(l){let u=h.indexOf(l);return u!==-1&&h.splice(u,2),this},this.getHandler=function(l){for(let u=0,d=h.length;u<d;u+=2){let p=h[u],g=h[u+1];if(p.global&&(p.lastIndex=0),p.test(l))return g}return null}}},jy=new Zc,$c=class{constructor(e){this.manager=e!==void 0?e:jy,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};$c.DEFAULT_MATERIAL_NAME="__DEFAULT";var Yr=class extends Zt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},xo=class extends Yr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Zt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Dl=new qe,_d=new L,yd=new L,vo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Re(512,512),this.map=null,this.mapPass=null,this.matrix=new qe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Vr,this._frameExtents=new Re(1,1),this._viewportCount=1,this._viewports=[new ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;_d.setFromMatrixPosition(e.matrixWorld),t.position.copy(_d),yd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(yd),t.updateMatrixWorld(),Dl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Dl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var xd=new qe,Ir=new L,Ul=new L,Jc=class extends vo{constructor(){super(new Yt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Re(4,2),this._viewportCount=6,this._viewports=[new ct(2,1,1,1),new ct(0,1,1,1),new ct(3,1,1,1),new ct(1,1,1,1),new ct(3,0,1,1),new ct(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Ir.setFromMatrixPosition(e.matrixWorld),i.position.copy(Ir),Ul.copy(i.position),Ul.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Ul),i.updateMatrixWorld(),s.makeTranslation(-Ir.x,-Ir.y,-Ir.z),xd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xd)}},bo=class extends Yr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Jc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Kc=class extends vo{constructor(){super(new oo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},qr=class extends Yr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Zt.DEFAULT_UP),this.updateMatrix(),this.target=new Zt,this.shadow=new Kc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var dh="\\[\\]\\.:\\/",Qy=new RegExp("["+dh+"]","g"),fh="[^"+dh+"]",ex="[^"+dh.replace("\\.","")+"]",tx=/((?:WC+[\/:])*)/.source.replace("WC",fh),nx=/(WCOD+)?/.source.replace("WCOD",ex),ix=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",fh),sx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",fh),rx=new RegExp("^"+tx+nx+ix+sx+"$"),ax=["material","materials","bones","map"],jc=class{constructor(e,t,i){let s=i||St.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},St=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Qy,"")}static parseTrackName(e){let t=rx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);ax.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=i(o.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let h=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let l=0;l<e.length;l++)if(e[l].name===h){h=l;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(h!==void 0){if(e[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}let a=e[s];if(a===void 0){let h=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};St.Composite=jc;St.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};St.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};St.prototype.GetterByBindingType=[St.prototype._getValue_direct,St.prototype._getValue_array,St.prototype._getValue_arrayElement,St.prototype._getValue_toArray];St.prototype.SetterByBindingTypeAndVersioning=[[St.prototype._setValue_direct,St.prototype._setValue_direct_setNeedsUpdate,St.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[St.prototype._setValue_array,St.prototype._setValue_array_setNeedsUpdate,St.prototype._setValue_array_setMatrixWorldNeedsUpdate],[St.prototype._setValue_arrayElement,St.prototype._setValue_arrayElement_setNeedsUpdate,St.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[St.prototype._setValue_fromArray,St.prototype._setValue_fromArray_setNeedsUpdate,St.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Gv=new Float32Array(1);var vd=new qe,Mo=class{constructor(e,t,i=0,s=1/0){this.ray=new Xi(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Hr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return vd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(vd),this}intersectObject(e,t=!0,i=[]){return Qc(e,this,i,t),i.sort(bd),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Qc(e[s],this,i,t);return i.sort(bd),i}};function bd(n,e){return n.distance-e.distance}function Qc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let a=0,o=r.length;a<o;a++)Qc(r[a],e,t,!0)}}var Zr=class{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Lt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var So=class extends wi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");var Wd={type:"change"},mh={type:"start"},Yd={type:"end"},Ao=new Xi,Xd=new Tn,ox=Math.cos(70*Jr.DEG2RAD),kt=new L,xn=2*Math.PI,ut={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ph=1e-6,Ro=class extends So{constructor(e,t=null){super(e,t),this.state=ut.NONE,this.enabled=!0,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ms.ROTATE,MIDDLE:ms.DOLLY,RIGHT:ms.PAN},this.touches={ONE:gs.ROTATE,TWO:gs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new qt,this._lastTargetPosition=new L,this._quat=new qt().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Zr,this._sphericalDelta=new Zr,this._scale=1,this._panOffset=new L,this._rotateStart=new Re,this._rotateEnd=new Re,this._rotateDelta=new Re,this._panStart=new Re,this._panEnd=new Re,this._panDelta=new Re,this._dollyStart=new Re,this._dollyEnd=new Re,this._dollyDelta=new Re,this._dollyDirection=new L,this._mouse=new Re,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=cx.bind(this),this._onPointerDown=lx.bind(this),this._onPointerUp=hx.bind(this),this._onContextMenu=_x.bind(this),this._onMouseWheel=fx.bind(this),this._onKeyDown=px.bind(this),this._onTouchStart=mx.bind(this),this._onTouchMove=gx.bind(this),this._onMouseDown=ux.bind(this),this._onMouseMove=dx.bind(this),this._interceptControlDown=yx.bind(this),this._interceptControlUp=xx.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Wd),this.update(),this.state=ut.NONE}update(e=null){let t=this.object.position;kt.copy(t).sub(this.target),kt.applyQuaternion(this._quat),this._spherical.setFromVector3(kt),this.autoRotate&&this.state===ut.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=xn:i>Math.PI&&(i-=xn),s<-Math.PI?s+=xn:s>Math.PI&&(s-=xn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(kt.setFromSpherical(this._spherical),kt.applyQuaternion(this._quatInverse),t.copy(this.target).add(kt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=kt.length();a=this._clampDistance(o*this._scale);let c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let o=new L(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let h=new L(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(o),this.object.updateMatrixWorld(),a=kt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Ao.origin.copy(this.object.position),Ao.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ao.direction))<ox?this.object.lookAt(this.target):(Xd.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ao.intersectPlane(Xd,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ph||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ph||this._lastTargetPosition.distanceToSquared(this.target)>ph?(this.dispatchEvent(Wd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?xn/60*this.autoRotateSpeed*e:xn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){kt.setFromMatrixColumn(t,0),kt.multiplyScalar(-e),this._panOffset.add(kt)}_panUp(e,t){this.screenSpacePanning===!0?kt.setFromMatrixColumn(t,1):(kt.setFromMatrixColumn(t,0),kt.crossVectors(this.object.up,kt)),kt.multiplyScalar(e),this._panOffset.add(kt)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;kt.copy(s).sub(this.target);let r=kt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(xn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-xn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(xn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-xn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Re,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function lx(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function cx(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function hx(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Yd),this.state=ut.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function ux(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ms.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ut.DOLLY;break;case ms.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ut.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ut.ROTATE}break;case ms.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ut.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ut.PAN}break;default:this.state=ut.NONE}this.state!==ut.NONE&&this.dispatchEvent(mh)}function dx(n){switch(this.state){case ut.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ut.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ut.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function fx(n){this.enabled===!1||this.enableZoom===!1||this.state!==ut.NONE||(n.preventDefault(),this.dispatchEvent(mh),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Yd))}function px(n){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(n)}function mx(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case gs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ut.TOUCH_ROTATE;break;case gs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ut.TOUCH_PAN;break;default:this.state=ut.NONE}break;case 2:switch(this.touches.TWO){case gs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ut.TOUCH_DOLLY_PAN;break;case gs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ut.TOUCH_DOLLY_ROTATE;break;default:this.state=ut.NONE}break;default:this.state=ut.NONE}this.state!==ut.NONE&&this.dispatchEvent(mh)}function gx(n){switch(this._trackPointer(n),this.state){case ut.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ut.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ut.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ut.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ut.NONE}}function _x(n){this.enabled!==!1&&n.preventDefault()}function yx(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function xx(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Co=class extends tr{constructor(){super();let e=new qn;e.deleteAttribute("uv");let t=new Nt({side:tn}),i=new Nt,s=new bo(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new ze(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new ze(e,i);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);let o=new ze(e,i);o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),this.add(o);let c=new ze(e,i);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);let h=new ze(e,i);h.position.set(-2.017,.018,6.124),h.rotation.set(0,.333,0),h.scale.set(2.002,4.566,2.064),this.add(h);let l=new ze(e,i);l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),this.add(l);let u=new ze(e,i);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);let d=new ze(e,or(50));d.position.set(-16.116,14.37,8.208),d.scale.set(.1,2.428,2.739),this.add(d);let p=new ze(e,or(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let g=new ze(e,or(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);let _=new ze(e,or(43));_.position.set(-.462,8.89,14.52),_.scale.set(4.38,5.441,.088),this.add(_);let m=new ze(e,or(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);let f=new ze(e,or(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function or(n){let e=new Ht;return e.color.setScalar(n),e}var Po=18,Io=24,vx=`
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
`,bx=`
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
  else if (uShell == 0.0 && uFurLen == 0.0) { float k = fbm(vWPos*60.0); col *= 0.97 + 0.06*k; ccH = k * 0.0003 + vn(vWPos*220.0) * 0.00018; }
  if (uShell > 0.0) col *= furShade; else if (uFurLen > 0.0) col *= 0.75;
  diffuseColor.rgb = col;
}
`;function Lo(){let n={uBase:{value:new ke},uSecond:{value:new ke},uBellyCol:{value:new ke},uBellyDir:{value:new L(0,-1,0)},uBelly:{value:.8},uPattern:{value:0},uPatScale:{value:1},uTex:{value:0},uTexScale:{value:22},uPM:{value:Array.from({length:Io},()=>new qe)},uBump:{value:1},uFurLen:{value:0},uFurDensity:{value:90},uDroop:{value:.3}},e=s=>{let r=new Nt({roughness:.7,metalness:0});return s>0&&(r.defines={FUR_SHELL:1}),r.onBeforeCompile=a=>{Object.assign(a.uniforms,n,{uShell:{value:s}}),a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
attribute float fur; attribute float bone; attribute vec3 rp; attribute vec3 rn;
uniform float uShell; uniform float uFurLen; uniform float uDroop; uniform mat4 uPM[`+Io+`];
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
          #endif`),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
          uniform vec3 uBase, uSecond, uBellyCol, uBellyDir; uniform float uBelly, uPatScale, uTexScale, uShell, uFurLen, uFurDensity, uBump;
          uniform int uPattern, uTex; varying vec3 vWPos; varying vec3 vWNrm; float ccH = 0.0;`+vx).replace("#include <color_fragment>",`#include <color_fragment>
`+bx).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
          #ifndef FUR_SHELL
          { vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
            vec3 r1 = cross(sy, normal), r2 = cross(normal, sx); float det = dot(sx, r1);
            vec3 grad = sign(det) * (dFdx(ccH) * r1 + dFdy(ccH) * r2);
            normal = normalize(abs(det) * normal - grad * uBump); }
          #endif`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
          totalEmissiveRadiance += diffuseColor.rgb * pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0) * 0.4;`)},r},t=s=>new Nt(s);return{U:n,skin:e(0),shells:Array.from({length:Po},(s,r)=>e((r+1)/Po)),accent:t({roughness:.35}),hair:t({roughness:.55}),membrane:t({roughness:.6,side:Pt}),glass:t({roughness:.15,transparent:!0,opacity:.45,side:Pt,depthWrite:!1}),teeth:t({color:16052188,roughness:.3}),mouth:t({color:3804436,roughness:.5}),tongue:t({color:14248572,roughness:.4}),dark:t({color:1775384,roughness:.25}),lip:t({roughness:.35}),cloth:t({roughness:.9,side:Pt}),glint:new Ht({color:16777215}),lash:t({color:1380370,roughness:.6}),eyeCache:new Map}}var Mx={skin:0,scales:1,chitin:2,slime:0,fur:0},Sx={skin:.72,scales:.45,chitin:.22,slime:.1,fur:.9};function ci(n,e,t){var r,a;let i=n.U;i.uBase.value.set(e.base),i.uSecond.value.set(e.second),i.uBellyCol.value.set(e.belly),i.uBelly.value=e.bellyAmt,i.uPattern.value=e.pattern,i.uPatScale.value=e.patScale,i.uBellyDir.value.set(...t).normalize(),i.uTex.value=(r=Mx[e.cover])!=null?r:0,i.uBump.value=e.cover==="slime"?.35:1;let s=e.cover==="fur";i.uFurLen.value=s?.012+e.furLen*.13:0,i.uDroop.value=e.furDroop*1.2,i.uFurDensity.value=330-e.furLen*170;for(let o of[n.skin,...n.shells])o.roughness=(a=Sx[e.cover])!=null?a:.7,o.metalness=e.cover==="chitin"?.25:0;n.accent.color.set(e.accent),n.hair.color.set(e.hair),n.membrane.color.set(e.membrane),n.glass.color.set(e.membrane),n.cloth.color.set(e.cloth||"#6b4a2e"),n.lip.color.set(e.base).lerp(new ke(12075102),.6)}function qd(n,e,t,i){let s=e+t+i.toFixed(2);if(n.eyeCache.has(s))return n.eyeCache.get(s);let r=256,a=128,o=document.createElement("canvas");o.width=r,o.height=a;let c=o.getContext("2d"),h=new ke(t),l={};h.getHSL(l);let u=(g,_,m)=>`hsl(${(g*360).toFixed(0)},${(_*100).toFixed(0)}%,${(wx(m)*100).toFixed(0)}%)`,d=new Nt({roughness:.06,metalness:0});if(e==="compound"){c.fillStyle=u(l.h,l.s,l.l*.8),c.fillRect(0,0,r,a);for(let g=0;g<22;g++)for(let _=0;_<44;_++){let m=(_+g%2*.5)*(r/44),f=g*(a/22)+3,y=c.createRadialGradient(m-1,f-1,0,m,f,3.4);y.addColorStop(0,u(l.h+.05,l.s,l.l*1.5+.1)),y.addColorStop(1,u(l.h,l.s,l.l*.35)),c.fillStyle=y,c.beginPath(),c.arc(m,f,3.4,0,7),c.fill()}d.roughness=.18,d.metalness=.3}else if(e==="beady")c.fillStyle="#0b0a0d",c.fillRect(0,0,r,a),c.fillStyle=u(l.h,l.s,.12),c.fillRect(0,0,r,a*.3);else{let g=c.createLinearGradient(0,0,0,a);g.addColorStop(0,"#f7f4ee"),g.addColorStop(.45,"#efe6df"),g.addColorStop(.7,"#d9a9a4"),c.fillStyle=g,c.fillRect(0,0,r,a);let _=i*.95/Math.PI*a,m=7,f=()=>(m=m*16807%2147483647,m/2147483647);for(let y=0;y<r;y++){let v=y/r*Math.PI*2+Math.PI,x=.75+f()*.5,C=c.createLinearGradient(0,0,0,_);if(C.addColorStop(0,u(l.h+.03,l.s,l.l*1.5*x+.08)),C.addColorStop(.75,u(l.h,l.s,l.l*x)),C.addColorStop(.93,u(l.h,l.s,l.l*.3)),C.addColorStop(1,"#20140f"),c.fillStyle=C,c.fillRect(y,0,1,_),e!=="glow"){let T=.5,A=.5;e==="cat"?(T=.13,A=.9):e==="goat"&&(T=.85,A=.22);let I=T*A/Math.sqrt((A*Math.cos(v))**2+(T*Math.sin(v))**2);c.fillStyle="#050406",c.fillRect(y,0,1,_*I)}}if(e==="glow"){d.emissive=h.clone(),d.emissiveIntensity=1.3;let y=document.createElement("canvas");y.width=4,y.height=a;let v=y.getContext("2d");v.fillStyle="#000",v.fillRect(0,0,4,a);let x=v.createLinearGradient(0,0,0,_);x.addColorStop(0,"#fff"),x.addColorStop(1,"#333"),v.fillStyle=x,v.fillRect(0,0,4,_),d.emissiveMap=new li(y)}}let p=new li(o);if(p.colorSpace=zt,p.wrapS=Or,p.anisotropy=4,d.map=p,n.eyeCache.set(s,d),n.eyeCache.size>24){let[g,_]=n.eyeCache.entries().next().value;n.eyeCache.delete(g),_.map.dispose(),_.emissiveMap&&_.emissiveMap.dispose(),_.dispose()}return d}var wx=n=>Math.min(1,Math.max(0,n));function $d(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,c=new ht,h=0;for(let l=0;l<n.length;++l){let u=n[l],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(u.morphAttributes[p])}if(e){let p;if(t)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,l),h+=p}}if(t){let l=0,u=[];for(let d=0;d<n.length;++d){let p=n[d].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+l);l+=n[d].attributes.position.count}c.setIndex(u)}for(let l in r){let u=Zd(r[l]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;c.setAttribute(l,u)}for(let l in a){let u=a[l][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[l]=[];for(let d=0;d<u;++d){let p=[];for(let _=0;_<a[l].length;++_)p.push(a[l][_][d]);let g=Zd(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;c.morphAttributes[l].push(g)}}return c}function Zd(n){let e,t,i,s=-1,r=0;for(let h=0;h<n.length;++h){let l=n[h];if(e===void 0&&(e=l.array.constructor),e!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=l.itemSize),t!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=l.normalized),i!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=l.gpuType),s!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=l.count*t}let a=new e(r),o=new vt(a,t,i),c=0;for(let h=0;h<n.length;++h){let l=n[h];if(l.isInterleavedBufferAttribute){let u=c/t;for(let d=0,p=l.count;d<p;d++)for(let g=0;g<t;g++){let _=l.getComponent(d,g);o.setComponent(d+u,g,_)}}else a.set(l.array,c);c+=l.count*t}return s!==void 0&&(o.gpuType=s),o}var Ex=L,re=(n=0,e=0,t=0)=>new Ex(n,e,t),ln=(n,e,t)=>Math.min(t,Math.max(e,n)),$t=(n,e,t)=>n+(e-n)*t,kn=re(1,0,0),Jt=re(0,1,0),lr=re(0,0,1);function cr(n){let e=(n|0)+1831565813;return()=>(e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296)}function Tx(n,e,t,i,s){let r=s*s,a=r*s;return .5*(2*e+(t-n)*s+(2*n-5*e+4*t-i)*r+(3*e-n-3*t+i)*a)}function Do(n,e){let t=n.length,i=ln(e,0,1)*(t-1),s=Math.min(Math.floor(i),t-2),r=i-s,a=n[Math.max(s-1,0)],o=n[s],c=n[s+1],h=n[Math.min(s+2,t-1)];return ln(Tx(a,o,c,h,r),Math.min(o,c)*.9,Math.max(o,c)*1.06)}function cn(n,e={}){var et,K,ce,Ce,M;let t=(et=e.radial)!=null?et:14,i=(K=e.sub)!=null?K:6,s=(ce=e.capRings)!=null?ce:4,r=(Ce=e.capStart)!=null?Ce:1,a=(M=e.capEnd)!=null?M:1,o=n.length,c=new Yi(n.map(U=>U.p),!1,"centripetal"),h=n.map(U=>U.rx),l=n.map(U=>{var N;return(N=U.ry)!=null?N:U.rx}),u=n.map(U=>{var N;return(N=U.f)!=null?N:1}),d=n.map(U=>{var N;return(N=U.b)!=null?N:1}),p=[],g=[],_=(o-1)*i+1,m=[],f=[],y=[],v=[],x=[],C=[],T=null;for(let U=0;U<_;U++){let N=U/(_-1),X=c.getPoint(N),j=c.getTangent(N).normalize();T||(T=e.side?e.side.clone():Math.abs(j.x)<.9?kn.clone():Jt.clone()),T=T.clone().addScaledVector(j,-T.dot(j)),T.lengthSq()<1e-8&&(T=Math.abs(j.y)<.9?Jt.clone().cross(j):kn.clone().cross(j)),T.normalize(),m.push(X),f.push(j),y.push(T),v.push(j.clone().cross(T).normalize());let Z=Do(h,N),se=Do(l,N);if(e.ridges){let P=1+e.ridgeAmp*Math.sin(N*e.ridges*Math.PI*2);Z*=P,se*=P}x.push(Math.max(Z,1e-4)),C.push(Math.max(se,1e-4)),p.push(Do(u,N)),g.push(Do(d,N))}let A=[],I=(U,N)=>N*(x[U]+C[U])*.5;if(r>0)for(let U=s;U>=1;U--){let N=U/s*Math.PI/2;A.push({c:m[0].clone().addScaledVector(f[0],-I(0,r)*Math.sin(N)),i:0,s:Math.max(Math.cos(N),.015),u:-U/s})}for(let U=0;U<_;U++)A.push({c:m[U],i:U,s:1,u:U/(_-1)});if(a>0)for(let U=1;U<=s;U++){let N=U/s*Math.PI/2;A.push({c:m[_-1].clone().addScaledVector(f[_-1],I(_-1,a)*Math.sin(N)),i:_-1,s:Math.max(Math.cos(N),.015),u:1+U/s})}let S=A.length,b=t+1,D=new Float32Array(S*b*3),z=new Float32Array(S*b*3),H=new Float32Array(S*b*2),q=re();for(let U=0;U<S;U++){let N=A[U],X=N.i;for(let j=0;j<=t;j++){let Z=j/t*Math.PI*2,se=Math.cos(Z);q.copy(N.c).addScaledVector(y[X],x[X]*N.s*Math.sin(Z)).addScaledVector(v[X],C[X]*N.s*se*(se<0?p[X]:g[X]));let P=(U*b+j)*3;D[P]=q.x,D[P+1]=q.y,D[P+2]=q.z,H[(U*b+j)*2]=N.u,H[(U*b+j)*2+1]=j/t}}let te=(U,N,X)=>{let j=(U*b+N)*3;return X.set(D[j],D[j+1],D[j+2])},$=re(),oe=re(),Y=re(),fe=re(),ge=re();for(let U=0;U<S;U++)for(let N=0;N<=t;N++){let X=N%t;te(Math.min(U+1,S-1),X,$),te(Math.max(U-1,0),X,oe),te(U,(X+1)%t,Y),te(U,(X-1+t)%t,fe),ge.copy($.sub(oe)).cross(Y.sub(fe)),ge.lengthSq()<1e-16&&ge.copy(f[A[U].i]).multiplyScalar(U<S/2?-1:1),ge.normalize();let j=(U*b+N)*3;z[j]=ge.x,z[j+1]=ge.y,z[j+2]=ge.z}let Pe=[];for(let U=0;U<S-1;U++)for(let N=0;N<t;N++){let X=U*b+N,j=X+b;Pe.push(X,j,X+1,X+1,j,j+1)}let Oe=new ht;return Oe.setAttribute("position",new vt(D,3)),Oe.setAttribute("normal",new vt(z,3)),Oe.setAttribute("uv",new vt(H,2)),Oe.setIndex(Pe),e.frames&&(Oe.userData.frames={C:m,T:f,S:y,U:v,RX:x,RY:C,RF:p,RB:g,capS:r,capE:a,m:_}),Oe.userData.end={p:m[_-1],t:f[_-1],r:(x[_-1]+C[_-1])/2},Oe}function _s(n,e,t){let i=ln(e,0,1),s=i*(n.m-1),r=Math.min(Math.floor(s),n.m-2),a=s-r,o=r+1,c=n.C[r].clone().lerp(n.C[o],a),h=n.S[r].clone().lerp(n.S[o],a).normalize(),l=n.T[r].clone().lerp(n.T[o],a).normalize(),u=l.clone().cross(h).normalize(),d=$t(n.RX[r],n.RX[o],a),g=$t(n.RY[r],n.RY[o],a)*(Math.cos(t)<0?$t(n.RF[r],n.RF[o],a):$t(n.RB[r],n.RB[o],a)),_=1,m=0,f=0;(e<0||e>1)&&(f=e<0?-1:1,m=ln(e<0?-e:e-1,0,1)*Math.PI/2,c.addScaledVector(l,f*(f<0?n.capS:n.capE)*(d+g)*.5*Math.sin(m)),_=Math.max(Math.cos(m),.015));let y=Math.sin(t),v=Math.cos(t),x=c.clone().addScaledVector(h,d*_*y).addScaledVector(u,g*_*v),T=h.clone().multiplyScalar(y/d).addScaledVector(u,v/g).normalize().multiplyScalar(Math.cos(m)).addScaledVector(l,f*Math.sin(m)).normalize();return{pos:x,normal:T,tangent:l,center:c,rx:d,ry:g,r:(d+g)/2}}function dt(n,e){return cn(n.map(t=>{var i;return{p:re(t[0],t[1],t[2]),rx:t[3],ry:(i=t[4])!=null?i:t[3]}}),e)}function ft(n,e=1,t=1,i=1,s=0,r=0,a=0,o=14){let c=new on(n,o,Math.max(8,Math.round(o*.7)));return c.scale(e,t,i),c.translate(s,r,a),c}function ys(n,e){let t=n.length,i=[],s=[],r=[];for(let o=0;o<t;o++)i.push(n[o].x,n[o].y,n[o].z,e[o].x,e[o].y,e[o].z),r.push(o/(t-1),0,o/(t-1),1);for(let o=0;o<t-1;o++){let c=o*2;s.push(c,c+1,c+2,c+2,c+1,c+3)}let a=new ht;return a.setAttribute("position",new Ke(i,3)),a.setAttribute("uv",new Ke(r,2)),a.setIndex(s),a.computeVertexNormals(),a}function Jd(n,e){return n.applyMatrix4(e),n}function xs(n,e,t,i){return n.translate(e,t,i),n}function gh(n,e,t,i){return new qe().makeBasis(n,e,t).setPosition(i||re())}function Kd(n){let e=n.index.array;for(let t=0;t<e.length;t+=3){let i=e[t];e[t]=e[t+2],e[t+2]=i}}function We(n,e=[]){if(n.length===1)return n[0];let t=n.map(i=>{let s=i.index?i:i.toNonIndexed();for(let r of Object.keys(s.attributes))r!=="position"&&r!=="normal"&&r!=="uv"&&!e.includes(r)&&s.deleteAttribute(r);return s});return $d(t,!1)}var Vt=Math.PI;var hn=(n,e,t,i={})=>cn([{p:n,rx:t},{p:n.clone().lerp(e,.5),rx:t*.62},{p:e,rx:t*.04}],{radial:8,sub:3,capStart:0,capEnd:0,...i}),hi=(n,e)=>{let t=e.clone().addScaledVector(n,-e.dot(n));return t.lengthSq()<1e-6?(Math.abs(n.x)<.9?kn:Jt).clone().cross(n).normalize():t.normalize()};function Cn(n,e,t,i,s={}){let r=n[n.length-1].clone().sub(n[0]).normalize(),a=r.clone().cross(i);return cn(n.map((o,c)=>({p:o,rx:Math.max(e[c],.004),ry:Math.max(t*(e[c]>.03?1:.4),.003)})),{radial:8,sub:4,side:a.lengthSq()<1e-6?hi(r,kn):a.normalize(),capStart:.5,capEnd:.5,capRings:2,...s})}function Ax(n){return(e,t)=>{var c,h,l,u,d;let i=[],r=n==="stalk",a=r?1.55:n==="compound"?0:n==="beady"?.05:-.1,o=new on(.5,28,18);if(o.rotateX(Vt/2),n==="compound"&&o.scale(.95,1.2,.85),i.push({g:xs(o,0,0,a),m:qd(t.M,r?"round":n,t.look.eye,(c=e.iris)!=null?c:.75)}),n!=="compound"&&i.push({g:ft(.055,1.5,1,.5,-.14,.17,a+.455,8),m:t.M.glint}),r&&i.push({g:dt([[0,0,-.3,.3],[0,.05,.5,.2],[0,0,1.15,.19],[0,0,1.5,.4]],{capEnd:.6}),m:"skin"}),n!=="compound"){let p=new yn(.5,.06,8,28);p.scale(1,1,1.5),r||i.push({g:xs(p,0,0,-.03),m:"skin"});let g=(h=e.lid)!=null?h:.3;if(g>.02&&n!=="beady"){let _=new on(.535,22,10,0,Vt*2,0,.55+g*1.05);_.rotateX(.55),_.rotateZ((l=e.brow)!=null?l:0),i.push({g:xs(_,0,0,a),m:"skin"});let m=new on(.5*1.06,22,8,0,Vt*2,0,.42+g*.4);if(m.rotateX(Vt-.3),i.push({g:xs(m,0,0,a),m:"skin"}),t.female&&((u=e.lash)!=null?u:1)>.05){let f=.55+g*1.05,y=[];for(let v=0;v<7;v++){let x=-1.05+v*.35,C=re(Math.sin(f)*Math.sin(x),Math.cos(f),Math.sin(f)*Math.cos(x)).applyAxisAngle(kn,.55).applyAxisAngle(lr,(d=e.brow)!=null?d:0),T=C.clone().multiplyScalar(.5*1.06).add(re(0,0,a)),A=T.clone().add(C.clone().add(re(0,.75,.55)).normalize().multiplyScalar(.3*e.lash*(1-Math.abs(x)*.3)));y.push(hn(T,A,.028,{radial:5}))}i.push({g:We(y),m:"lash"})}}}return i}}var Rx={iris:[.4,1.2,.75,"Iris size"],lid:[0,.9,.3,"Eyelid"],brow:[-.7,.7,0,"Sad / angry"],lash:[0,2,1,"Lashes (female)"]};function jd(n,e,t,i=1){let s=[];for(let r=0;r<n;r++){let a=e(r/(n-1));s.push(hn(a.p,a.p.clone().add(re(0,-i*t*a.s,0)),.035*(.7+a.s*.5),{radial:6}))}return s}function Cx(n){let e=n.len,t=[],i=n.open;t.push({g:dt([[0,.06,-.35,.52,.44],[0,.08,.2*e,.44,.34],[0,.04,.62*e,.34,.24],[0,0,.9*e,.27,.19]],{radial:16}),m:"skin",fur:.3}),t.push({g:ft(.15,1.25,.85,.9,0,.1,.9*e+.2),m:"dark"});let s=dt([[0,-.1,-.3,.44,.22],[0,-.14,.3*e,.34,.15],[0,-.13,.82*e,.21,.1]],{radial:14}),r=n.teeth,a=[s],o=[],c=[];for(let l of[-1,1])o.push(...jd(6,u=>({p:re(l*$t(.36,.17,u),-.08,$t(.2,.95,u)*e),s:u>.75&&u<.95?2.2:1}),.13*r)),c.push(...jd(5,u=>({p:re(l*$t(.3,.14,u),-.05,$t(.25,.82,u)*e),s:u>.7?1.6:.8}),.1*r,-1));let h=l=>(l.translate(0,.1,.3),l.rotateX(i*.75),l.translate(0,-.1,-.3),l);return t.push({g:h(s),m:"skin",fur:.3}),r>.05&&(t.push({g:We(o),m:"teeth"}),t.push({g:h(We(c)),m:"teeth"})),t.push({g:ft(.5,.62,.16+i*.25,.9*e,0,-.1-i*.1,.4*e),m:"mouth"}),i>.25&&t.push({g:h(ft(.5,.36,.07,.7*e,0,-.03,.42*e)),m:"tongue"}),t}function Px(n){let e=n.len,t=n.hook,i=[];i.push({g:dt([[0,.05,-.3,.44,.38],[0,.07,.3*e,.33,.27],[0,.03-t*.05,.72*e,.17,.15],[0,-t*.4,1*e,.015]],{radial:12,capEnd:.3}),m:"accent"});let s=dt([[0,-.16,-.3,.38,.2],[0,-.17,.35*e,.24,.11],[0,-.14,.8*e,.02]],{radial:12,capEnd:.3});return s.translate(0,.1,.2),s.rotateX(n.open*.6),s.translate(0,-.1,-.2),i.push({g:s,m:"accent"}),i.push({g:We([ft(.035,1,1,1.6,.14,.2,.3*e),ft(.035,1,1,1.6,-.14,.2,.3*e)]),m:"dark"}),n.open>.2&&i.push({g:ft(.5,.4,.12,.6*e,0,-.08,.3*e),m:"mouth"}),i}function Ix(n){let e=[],t=[],i=n.open;for(let s of[-1,1])e.push(dt([[s*.28,0,-.15,.17],[s*(.5+i*.25),-.05,.4,.14],[s*(.36+i*.3),-.1,.85*n.len,.08],[s*(.08+i*.3),-.12,1.1*n.len,.01]],{radial:10,ridges:0})),t.push(dt([[s*.12,-.2,-.1,.07],[s*.15,-.35,.3,.05],[s*.1,-.5,.45,.02]],{radial:8}));return[{g:We(e),m:"accent"},{g:We(t),m:"skin"},{g:ft(.3,1,.8,.5,0,-.08,.02),m:"mouth"}]}function Lx(n){let e=new yn(.42,.15,10,28);e.translate(0,0,.05);let t=[],i=Math.round(n.count);for(let s=0;s<2;s++)for(let r=0;r<i;r++){let a=(r+s*.5)/i*Vt*2,o=.36-s*.1,c=re(Math.cos(a)*o,Math.sin(a)*o,.1-s*.08);t.push(hn(c,c.clone().add(re(-Math.cos(a)*.14,-Math.sin(a)*.14,.16).multiplyScalar(n.teeth)),.045,{radial:6}))}return[{g:e,m:"skin"},{g:ft(.4,1,1,.35,0,0,-.02),m:"mouth"},{g:We(t),m:"teeth"}]}function Dx(n){let e=(i,s,r)=>{let a=[];for(let o=0;o<=6;o++){let c=o/6-.5,h=1-Math.abs(c)*2;a.push([c,i+n.smile*.22*(c*c*4)+r*.03*h,.04-c*c*.45,.012+.075*s*Math.pow(h,.6),.012+.06*s*Math.pow(h,.6)])}return dt(a,{radial:10,sub:3,side:re(0,1,0)})},t=dt([[-.48,n.smile*.2,-.06,.012],[0,0,.065,.02],[.48,n.smile*.2,-.06,.012]],{radial:6});return[{g:We([e(.045,n.full*.85,1),e(-.05,n.full,-1)]),m:"lip"},{g:t,m:"mouth"}]}function Ux(n){let e=n.curl;return[{g:dt([[0,0,-.3,.4],[0,-.05,.45,.34],[0,-.55,.95,.27],[0,-1.25*n.len,1.1,.21],[0,-1.9*n.len,1+e*.2,.17],[0,-2.3*n.len,1+e*.9,.14]],{radial:14,sub:8,ridges:26,ridgeAmp:.04}),m:"skin"}]}function Nx(n,e){let t=[],i=Math.round(n.count);for(let s=0;s<i;s++){let r=(s-(i-1)/2)*(.7/i),a=.1*Math.sin(s*2.4),o=e.down,c=re(r,0,-.15),h=re(r*1.2,0,.3),l=h.clone().addScaledVector(o,.5*n.len).add(re(0,0,.1)),u=l.clone().addScaledVector(o,.6*n.len).add(re(r*.5+a,0,-.1+a));t.push(cn([{p:c,rx:.12},{p:h,rx:.1},{p:l,rx:.07},{p:u,rx:.02}],{radial:8}))}return[{g:We(t),m:"skin"},{g:ft(.25,1.2,.7,.4,0,-.05,0),m:"mouth"}]}function kx(n,e){let t=[];for(let i=0;i<=4;i++){let s=i/4-.5;t.push(re(s,n.arch*.22*(1-s*s*4)+s*-.1,.04-s*s*.25))}return[{g:Cn(t,[.03,.09*n.thick,.1*n.thick,.08*n.thick,.02],.045,re(0,0,1),{radial:6,sub:3}),m:"hair"}]}function Fx(n,e){let s=ln(e.part.u-n.span/2,-.97,1.97),r=ln(e.part.u+n.span/2,-.97,1.97),a=e.size*.3,o=[],c=[],h=[];for(let u=0;u<=22;u++)for(let d=0;d<=40;d++){let p=_s(e.frames,$t(s,r,u/22),d/40*Vt*2),g=Math.min(u,22-u)===0?.35:1,_=p.pos.addScaledVector(p.normal,a*g);o.push(_.x,_.y,_.z),c.push(p.normal.x,p.normal.y,p.normal.z)}for(let u=0;u<22;u++)for(let d=0;d<40;d++){let p=u*41+d,g=p+40+1;h.push(p,g,p+1,p+1,g,g+1)}let l=new ht;return l.setAttribute("position",new Ke(o,3)),l.setAttribute("normal",new Ke(c,3)),l.setAttribute("uv",new Ke(new Float32Array(o.length/3*2),2)),l.setIndex(h),[{g:l,m:"cloth"}]}function Ox(n){return[{g:We([dt([[0,.5*n.len,-.1,.09,.08],[0,.2,.1*n.len+.05,.12,.11],[0,-.06,.3*n.len,.17,.14]],{radial:10}),ft(.12,1,.8,1,.15*n.wide,-.1,.1*n.len),ft(.12,1,.8,1,-.15*n.wide,-.1,.1*n.len)]),m:"skin"}]}function Kr(n){return(e,t)=>{let i=t.up,s=t.down,r={point:[[re(0,0,-.15),.34],[re(0,.04,.3),.37],[re(0,.07,.72),.22],[re(0,.09,1.08),.02]],round:[[re(0,0,-.12),.3],[re(0,0,.3),.5],[re(0,0,.62),.44],[re(0,0,.8),.2]],long:[[re(0,0,-.15),.2],[re(0,.03,.6),.27],[re(0,.04,1.45),.24],[re(0,0,2.1),.03]],elf:[[re(0,0,-.12),.17],[re(0,0,.2).addScaledVector(i,.12),.3],[re(0,0,.42).addScaledVector(i,.45),.2],[re(0,0,.62).addScaledVector(i,.95*e.len),.02]],floppy:[[re(0,0,-.12),.3],[re(0,0,.3),.38],[re(0,0,.5).addScaledVector(s,.5*e.len),.42],[re(0,0,.46).addScaledVector(s,1.1*e.len),.32],[re(0,0,.42).addScaledVector(s,1.45*e.len),.06]]}[n],a=n==="floppy"||n==="elf"?1:e.len,o=r.map(u=>re(u[0].x,u[0].y,u[0].z*(u[0].z>0?a:1))),c=r.map(u=>u[1]*e.wide),h=n==="floppy"?re(0,0,1):t.fwd,l=Cn(o.map((u,d)=>u.clone().addScaledVector(h,.045).multiplyScalar(d?.9:1)),c.map(u=>u*.62),.03,h);return[{g:Cn(o,c,.07,h,{radial:10}),m:"skin",fur:.3},{g:l,m:"membrane"}]}}function Bx(n,e){let t=[],i=[],s=[];for(let r=0;r<5;r++){let a=-.6+r*.42,o=re(0,0,1).multiplyScalar(Math.cos(a)).addScaledVector(e.up,Math.sin(a)),c=o.clone().multiplyScalar(n.len*(.8+.35*Math.sin((r+.5)/5*Vt)));t.push(c),i.push(o.clone().multiplyScalar(.05)),s.push(hn(re(0,0,-.1),c,.045,{radial:6}))}return[{g:We(s),m:"accent"},{g:ys(i,t.map(r=>r.clone().multiplyScalar(.93))),m:"membrane"}]}function hr(n){return e=>{var c,h;let t=e.len,i=(c=e.curve)!=null?c:1,s={radial:12,sub:7,ridges:n==="spike"?0:9*t,ridgeAmp:.05,capEnd:.3};if(n==="spike")return[{g:dt([[0,0,-.15,.3],[0,.02*i,.5*t,.2],[0,.1*i,1.25*t,.01]],s),m:"accent"}];if(n==="curved")return[{g:dt([[0,0,-.15,.3],[0,.05*i,.42*t,.26],[0,.32*i,.88*t,.18],[0,.78*i,1.12*t,.09],[0,1.2*i,1.05*t,.01]],s),m:"accent"}];if(n==="ram"){let l=[];for(let u=0;u<=12;u++){let d=u/12,p=d*Vt*1.75*i,g=.62*t*(1-d*.45);l.push([.12+d*.75,g*Math.sin(p)*.9,-.15+g*(1-Math.cos(p)),.32*(1-d*.95)+.01])}return[{g:dt(l,{...s,sub:4,ridges:22}),m:"accent"}]}if(n==="tusk")return[{g:dt([[0,0,-.25,.2],[0,-.3*i,.3*t,.17],[0,-.38*i,.8*t,.12],[0,-.05,1.3*t,.01]],{...s,ridges:0}),m:"teeth"}];let r=[[0,0,-.15,.14],[.05,.2,.6,.115],[.12,.5,1.2,.095],[.15,.62,1.9,.065],[.1,.5,2.5,.012]].map(l=>[l[0],l[1]*i,l[2]*t,l[3]]),a=[dt(r,{radial:8,sub:5})],o=Math.round((h=e.tines)!=null?h:3);for(let l=0;l<o;l++){let u=(l+.6)/(o+.4),d=u*4,p=Math.min(Math.floor(d),3),g=d-p,_=re($t(r[p][0],r[p+1][0],g),$t(r[p][1],r[p+1][1],g),$t(r[p][2],r[p+1][2],g)),m=l%2?1:-1,f=.7*(1-u*.4);a.push(cn([{p:_,rx:.08},{p:_.clone().add(re(m*.2*f,-.35*f,.3*f)),rx:.065},{p:_.clone().add(re(m*.3*f,-.5*f,.9*f)),rx:.012}],{radial:7,sub:4,capStart:0}))}return[{g:We(a),m:"accent"}]}}function Qd(n){return e=>{let t=e.len,i=e.curve,s=[[0,0,-.08,.055],[0,.1*i,.6*t,.045],[0,.5*i,1.2*t,.035],[0,1.05*i,1.5*t,.028]],r=[dt(s,{radial:7,sub:6})];if(!n)return[{g:r[0],m:"accent"},{g:ft(.09,1,1,1,0,1.05*i,1.5*t),m:"accent"}];let a=new Yi(s.map(o=>re(o[0],o[1],o[2])));for(let o=2;o<16;o++){let c=a.getPoint(o/16),h=.3*Math.sin(o/16*Vt)+.05;for(let l of[-1,1])r.push(hn(c,c.clone().add(re(l*h,.05,h*.3)),.016,{radial:4}))}return[{g:We(r),m:"hair"}]}}function jr(n){return(e,t)=>{var l,u,d,p,g,_;let i=[],s=Math.round((l=e.count)!=null?l:n.count),r=(u=e.droop)!=null?u:n.droop,a=(d=e.len)!=null?d:1,o=(p=e.spread)!=null?p:n.spread,c=(g=n.capR)!=null?g:.5,h=re(0,0,-c-.02);for(let m=0;m<s;m++){let f=o*Math.sqrt((m+.5)/s),y=m*2.39996+t.rnd()*.3,v=re(Math.sin(f)*Math.cos(y),Math.sin(f)*Math.sin(y),Math.cos(f)),x=a*(.75+.5*t.rnd()),C=n.width*(.8+.4*t.rnd()),T=x/4,A=[h.clone().addScaledVector(v,c)],I=v.clone(),S=A[0].clone();for(let D=1;D<=4;D++){I.multiplyScalar(1-r*.5).addScaledVector(t.down,r*.3*D).normalize(),S=S.clone().addScaledVector(I,T);let z=S.clone().sub(h);n.hug&&z.length()<c*1.05&&(S=h.clone().add(z.setLength(c*1.05))),A.push(S)}let b=n.hug?A[2].clone().sub(h).normalize():hi(v,t.fwd.clone().add(re(t.rnd()-.5,t.rnd()-.5,0)));i.push(Cn(A,[C*.75,C,C*.95,C*.65,.012],C*.2,b,{radial:6,sub:3}))}if(n.hug){let m=new on(c*1.03,24,12,0,Vt*2,0,Math.min(o*.82,Vt*.6));m.rotateX(Vt/2),m.translate(h.x,h.y,h.z),i.push(m)}return[{g:We(i),m:(_=n.mat)!=null?_:"hair"}]}}function zx(n,e){let t=[];for(let i=0;i<4;i++){let s=-.45+i*.3,a=re(0,0,1).multiplyScalar(.35).addScaledVector(e.up,Math.sin(s)*.6).addScaledVector(e.fwd,-.15).add(re(0,0,.6)).normalize().clone().multiplyScalar(n.len*1.6);t.push(cn([{p:re(0,(i-1.5)*.1,0),rx:.016},{p:a.clone().multiplyScalar(.5).addScaledVector(e.down,-.05),rx:.012},{p:a.addScaledVector(e.down,.12*n.len),rx:.004}],{radial:4,sub:4}))}return[{g:We(t),m:"teeth"}]}function Hx(n){let e=new yn(.5,.06,6,28);e.scale(1,n.long,1);let t=[];for(let i=0;i<7;i++){let s=i/6*Vt*2,r=i===6?0:.27;t.push(ft(.17,1,1,.35,Math.cos(s)*r,Math.sin(s)*r*n.long,.5*n.dome*(i===6?.98:.8)))}return[{g:We([ft(.5,1,n.long,n.dome,0,0,0,22),e]),m:"accent"},{g:We(t),m:"skin"}]}function Vx(n,e){let t=e.fwd.clone().multiplyScalar(-1),i=re(0,0,1),s=(r,a)=>i.clone().multiplyScalar(r).addScaledVector(t,a);return[{g:Cn([s(-.12,0),s(.4*n.len,.15*n.sweep),s(.8*n.len,.5*n.sweep),s(1.1*n.len,.95*n.sweep)],[.5,.42,.25,.02],.06,hi(i,t.clone().cross(i)),{radial:10}),m:"skin"}]}function Gx(n,e){let t=e.fwd.clone().multiplyScalar(-1),i=re(0,0,1),s=e.down,r=(a,o,c)=>i.clone().multiplyScalar(a).addScaledVector(t,o).addScaledVector(s,c);return[{g:Cn([r(-.12,0,0),r(.4*n.len,.15*n.sweep,.08),r(.9*n.len,.5*n.sweep,.2),r(1.25*n.len,.95*n.sweep,.3)],[.3,.38,.27,.02],.05,e.up,{radial:10}),m:"skin"}]}var No={human(){let n=[];for(let e=0;e<5;e++)n.push(ft(.3-e*.03,1,.8,1.3,-.62+e*.33,-.95,2.55-e*.14));return[{g:We([ft(.95,.95,.85,1.05,0,-.45,-.25),dt([[0,-.4,-.2,.8,.6],[0,-.65,1.1,.9,.5],[0,-.85,2.3,.95,.3]],{radial:10}),...n]),m:"skin"}]},paw(){let n=[ft(1,1.15,.8,1.35,0,-.55,.45)],e=[];for(let t=0;t<4;t++){let i=-.75+t*.5,s=1.55-Math.abs(t-1.5)*.18;n.push(ft(.42,1,.9,1.3,i,-.75,s)),e.push(hn(re(i,-.6,s+.35),re(i*1.08,-1.05,s+.95),.14,{radial:6}))}return[{g:We(n),m:"skin",fur:.35},{g:We(e),m:"accent"}]},hoof(){return[{g:dt([[0,.1,0,.95],[0,-.6,.15,1.2,1.25],[0,-1.15,.3,1.4,1.5]],{radial:12,capEnd:.12,capStart:0}),m:"accent"}]},talon(n){let e=[],t=[];for(let[s,r,a]of[[-1.25,1.7,1],[0,2.3,1.1],[1.25,1.7,1],[0,-1.4,.7]]){e.push(dt([[0,-.1,0,.55],[s*.5,-.75,r*.5,.45],[s,-1,r,.32]],{radial:8,ridges:5,ridgeAmp:.08}));let o=re(s,0,r).normalize();t.push(hn(re(s,-.95,r),re(s,-1.25,r).addScaledVector(o,.75*a),.26,{radial:6}))}let i=[{g:We(e),m:"skin"},{g:We(t),m:"accent"}];return n&&i.push({g:ys([re(0,-.6,.2),re(0,-.6,.2),re(0,-.6,.2),re(0,-.6,.2),re(0,-.6,.2)],[re(-1.45,-1.05,1.95),re(-.75,-1.05,1.8),re(0,-1.05,2.6),re(.75,-1.05,1.8),re(1.45,-1.05,1.95)]),m:"membrane"}),i},webbed(){return No.talon(!0)},stump(){let n=[];for(let e=0;e<4;e++){let t=-.9+e*.6;n.push(ft(.3,1,.8,.6,Math.sin(t)*1.3,-.95,Math.cos(t)*1.3+.1))}return[{g:dt([[0,.2,0,1],[0,-.6,.05,1.2],[0,-1.15,.1,1.38]],{radial:12,capEnd:.1,capStart:0}),m:"skin"},{g:We(n),m:"accent"}]},point(){return[{g:hn(re(0,.2,0),re(.3,-1.9,.2),.95,{capStart:0}),m:"accent"}]},none(){return[]}},ef={human(){let n=[ft(1,1.2,1.3,.6,0,1,0)];return[-.82,-.28,.27,.8].forEach((e,t)=>{let i=[.85,1,1.05,.95][t];n.push(dt([[e,1.8,0,.3],[e*1.1,1.8+1.1*i,.1,.27],[e*1.15,1.8+1.9*i,.4,.24],[e*1.15,1.8+2.4*i,.8,.2]],{radial:7,sub:4,ridges:3,ridgeAmp:.06}))}),n.push(dt([[.7,.6,.2,.36],[1.5,1.3,.5,.3],[1.9,2.1,.75,.24]],{radial:7,sub:4})),[{g:We(n),m:"skin"}]},claw(){let n=[ft(1,1.2,1.2,.75,0,.9,0)],e=[];for(let t of[-.85,0,.85])n.push(dt([[t,1.5,0,.42],[t*1.3,2.6,.2,.38],[t*1.4,3.3,.7,.3]],{radial:7,sub:4,ridges:2,ridgeAmp:.08})),e.push(hn(re(t*1.4,3.25,.65),re(t*1.45,3.9,1.6),.27,{radial:6}));return n.push(dt([[.9,.5,.2,.4],[1.7,1.2,.6,.3]],{radial:7})),e.push(hn(re(1.7,1.2,.6),re(2,1.7,1.3),.26,{radial:6})),[{g:We(n),m:"skin"},{g:We(e),m:"accent"}]},pincer(){return[{g:We([ft(1,1.7,2.1,1.25,0,1.6,0),dt([[-.7,3,0,.8,.6],[-1.1,4.4,0,.6,.45],[-.75,5.5,0,.3],[-.1,6.1,0,.03]],{radial:9,capStart:0}),dt([[.8,2.9,0,.6,.5],[1.1,4.1,0,.42],[.75,5.1,0,.22],[.2,5.7,0,.03]],{radial:9,capStart:0})]),m:"skin"}]},mitt(){return[{g:ft(1,1.25,1.5,.9,0,1.1,0),m:"skin",fur:!0}]},none(){return[]}},Wx={plant:{pts:[[0,0,0],[.02,-.14,.02],[.035,-.3,.035],[.04,-.48,.045],[.038,-.63,0],[.032,-.8,-.012],[.03,-.97,-.012]],r:[1.02,1.1,.98,.72,.86,.6,.46],bulge:[1,2,4]},digi:{pts:[[0,0,0],[.03,-.2,.1],[.05,-.42,.16],[.04,-.62,-.02],[.03,-.8,-.12],[.03,-.97,-.03]],r:[1.1,1.2,.8,.62,.42,.4],bulge:[1]},pillar:{pts:[[0,0,0],[.01,-.3,.01],[.02,-.6,.02],[.02,-.9,0]],r:[1.15,1.1,.95,.95],bulge:[1]},arm:{pts:[[0,0,0],[.045,-.1,-.005],[.06,-.26,-.012],[.075,-.46,-.028],[.082,-.59,.008],[.086,-.78,.058],[.088,-.93,.1]],r:[1,1.14,.98,.72,.84,.6,.5],bulge:[1,2,4]},insect:{pts:[[0,0,0],[.28,.2,0],[.5,.32,0],[.72,-.15,.02],[.88,-.65,.03],[.93,-.95,.03]],r:[.75,.62,.5,.42,.3,.16],bulge:[]}};function xh(n,e,t){return(i,s)=>{var C;let r=s.size,a=Wx[n],o=r*.105*i.thick*s.limbMul,c=Math.cos(i.splay),h=Math.sin(i.splay),l=Math.cos(i.swing),u=Math.sin(i.swing),p=a.pts.map(([T,A,I])=>{I*=i.bend,n==="insect"&&(A=A>0?A*i.bend:A);let S=T*c-A*h,b=T*h+A*c,D=b*l+I*u,z=-b*u+I*l;return s.root.clone().addScaledVector(s.out,S*r).addScaledVector(Jt,D*r).addScaledVector(s.fwd,z*r)}).map((T,A)=>({p:T,rx:a.r[A]*o*(a.bulge.includes(A)?i.muscle:1)})),g=n==="insect",_=cn(p,{radial:16,sub:7,ridges:g?5:0,ridgeAmp:.1}),m=[{g:_,m:"skin",fur:g?.5:.75}],f=_.userData.end,y=f.r*i.end,v=(C=i.endType)!=null?C:t;s.anchors&&e===ef&&s.anchors.push({p:f.p.clone(),t:f.t.clone(),r:f.r*i.end});let x;if(e===No)x=gh(s.out.clone().multiplyScalar(y),Jt.clone().multiplyScalar(y),s.fwd.clone().multiplyScalar(y),f.p);else{let T=f.t.clone(),A=hi(T,s.fwd),I=T.clone().cross(A);x=gh(I.multiplyScalar(y),T.multiplyScalar(y),A.multiplyScalar(y),f.p.clone().addScaledVector(f.t,-f.r*.4))}for(let T of e[v]())m.push({g:Jd(T.g,x),m:T.m,fur:T.fur||0});return m}}function Xx(n,e){let t=e.size,i=[],s=n.curl,r=t*.085*n.thick*e.limbMul;for(let c=0;c<=9;c++){let h=c/9,l=.5*Math.pow(h,.8)+s*.16*Math.sin(h*5+e.seed)*h,u=-.8*Math.pow(h,1.25)+s*.22*h*h*Math.sin(h*6.5),d=.14*Math.sin(h*7+e.seed*2)*h*s,p=Math.cos(n.splay),g=Math.sin(n.splay);i.push({p:e.root.clone().addScaledVector(e.out,(l*p-u*g)*t).addScaledVector(Jt,(l*g+u*p)*t).addScaledVector(e.fwd,d*t),rx:r*(Math.pow(1-h,.75)*.94+.06)})}let a=cn(i,{radial:12,sub:5}),o=[{g:a,m:"skin"}];if(e.anchors&&e.anchors.push({p:a.userData.end.p.clone(),t:a.userData.end.t.clone(),r:r*.5}),n.suckers>.5){let c=new Yi(i.map(l=>l.p)),h=[];for(let l=3;l<22;l++){let u=l/22,d=c.getPoint(u),p=c.getTangent(u),g=r*(Math.pow(1-u,.75)*.94+.06),_=hi(p,e.out.clone().multiplyScalar(-1).add(re(0,-.6,0))),m=ft(g*.36,1,1,1,0,0,0,8);m.translate(d.x+_.x*g*.85,d.y+_.y*g*.85,d.z+_.z*g*.85),h.push(m)}o.push({g:We(h),m:"membrane"})}return o}function _h(n){return(e,t)=>{let i=t.size,s=Math.cos(e.lift),r=Math.sin(e.lift),a=Math.cos(e.sweep),o=Math.sin(e.sweep),c=(l,u,d)=>{let p=l*s-u*r,g=l*r+u*s,_=p*a+d*o,m=-p*o+d*a;return t.root.clone().addScaledVector(t.out,_*i).addScaledVector(Jt,g*i).addScaledVector(t.fwd,m*i)},h=[];if(n==="bat"){let l=c(0,0,0),u=c(.33,.22,0),d=c(.6,.45,.06),p=[c(1.45,.5,-.1),c(1.25,-.02,-.38),c(.92,-.36,-.52),c(.55,-.45,-.55),c(.02,-.3,-.3)],g=[cn([{p:l,rx:i*.05},{p:u,rx:i*.036},{p:d,rx:i*.028}],{radial:8})],_=[];p.forEach((m,f)=>{if(f<4&&g.push(cn([{p:d,rx:i*.018},{p:d.clone().lerp(m,.5).addScaledVector(Jt,i*.03),rx:i*.013},{p:m,rx:i*.004}],{radial:6,capStart:0})),f>0){let y=[],v=[],x=f<4?d:u;for(let C=0;C<=8;C++){let T=C/8,A=p[f-1].clone().lerp(m,T);A.lerp(x,.2*Math.sin(T*Vt)),y.push(x),v.push(A)}_.push(ys(y,v))}}),_.push(ys([l,l,l],[u,p[4].clone().lerp(u,.5),p[4]])),_.push(ys([d,d],[u,p[4]])),g.push(hn(d,c(.62,.62,.16),i*.02,{radial:5})),h.push({g:We(g),m:"skin"},{g:We(_),m:"membrane"})}else if(n==="feather"){let l=[c(0,0,0),c(.3,.16,.02),c(.62,.26,.06),c(.9,.2,.02)];h.push({g:cn(l.map((f,y)=>({p:f,rx:i*[.07,.06,.045,.03][y]})),{radial:8}),m:"skin",fur:!0});let u=new Yi(l),d=c(0,0,1).sub(c(0,0,0)).normalize(),p=[],g=[],_=(f,y,v,x,C,T)=>{let A=u.getPoint(f).addScaledVector(d,T*i),I=c(Math.sin(y),-Math.cos(y),-.18).sub(c(0,0,0)).normalize(),S=A.clone().addScaledVector(I,v*i);C.push(Cn([A,A.clone().lerp(S,.4),A.clone().lerp(S,.8),S],[x*i*.6,x*i,x*i*.9,x*i*.15],i*.006,d,{radial:6,sub:3}))},m=Math.round(e.feathers);for(let f=0;f<m;f++){let y=f/(m-1);_(.08+y*.92,$t(-.15,1.45,Math.pow(y,1.6)),$t(.5,.95,Math.sin(y*Vt*.62)),.062,p,-.004*(f%2)),_(.05+y*.9,$t(-.1,1.2,Math.pow(y,1.6)),$t(.28,.4,y),.07,g,.012)}h.push({g:We(p),m:"hair"},{g:We(g),m:"skin"})}else{let l=[];for(let[u,d,p]of[[.2,1,.17],[.85,.72,.2]]){let g=_=>c(Math.cos(u)*_*d,.04*_,-Math.sin(u)*_*d);l.push(Cn([g(0),g(.35),g(.75),g(1)],[.03*i,p*i*.8,p*i,.02*i],i*.004,Jt,{radial:6,sub:4}))}h.push({g:We(l),m:"glass"})}return h}}function Pi(n){return(e,t)=>{let i=t.size,s=e.curl,r=t.normal,a=[],o=hi(r,Jt),c=m=>n==="stinger"?t.root.clone().addScaledVector(r,i*.42*Math.sin(m*2.7*Math.abs(s||1))).addScaledVector(o,i*.4*(1-Math.cos(m*2.7*Math.abs(s||1)))*Math.sign(s||1)):t.root.clone().addScaledVector(r,i*m*(1-.3*Math.abs(s)*m)).addScaledVector(o,i*s*.65*m*m),h=Math.min(t.r*.8,i*.22)*e.thick,l={thin:m=>i*.035*e.thick*(1-m*.7),thick:m=>h*Math.pow(1-m,.9)+i*.006,fluffy:m=>i*.1*e.thick*(.35+1*Math.sin(Math.min(m*1.25,1)*Vt*.8))*(m>.95?.5:1),club:m=>i*.05*e.thick*(1-m*.4),stinger:m=>i*.075*e.thick*(1-m*.45),fluke:m=>h*Math.pow(1-m,.7)*.9+i*.02,fishfin:m=>h*Math.pow(1-m,.7)*.9+i*.02,fan:m=>i*.05*(1-m*.5),tuft:m=>i*.03*e.thick*(1-m*.5)}[n],u=n==="fan"?.3:n==="fluke"||n==="fishfin"?.75:1,d=[];for(let m=0;m<=7;m++){let f=m/7;d.push({p:c(f*u),rx:Math.max(l(f),.003),ry:Math.max(l(f)*(n==="fishfin"?1.25:1),.003)})}let p=cn(d,{radial:12,sub:5,ridges:n==="stinger"?7:0,ridgeAmp:.12});a.push({g:p,m:"skin",fur:n==="fluffy"?1.6:n!=="stinger"&&n!=="fishfin"&&n!=="fluke"});let g=p.userData.end,_=g.t;if(n==="club"){let m=[];for(let f=0;f<12;f++){let y=re(Math.sin(f*2.4)*Math.sqrt(1-(f/11*2-1)**2),f/11*2-1,Math.cos(f*2.4)*Math.sqrt(1-(f/11*2-1)**2));m.push(hn(g.p.clone().addScaledVector(y,i*.07),g.p.clone().addScaledVector(y,i*.17*e.tip),i*.03,{radial:6}))}a.push({g:We([xs(ft(i*.1*e.tip,1,1,1),g.p.x,g.p.y,g.p.z),...m]),m:"accent"})}else if(n==="stinger"){let m=g.p.clone().addScaledVector(_,i*.06);a.push({g:xs(ft(i*.075*e.tip,1,1,1),m.x,m.y,m.z),m:"skin"}),a.push({g:hn(m.clone().addScaledVector(_,i*.04),m.clone().addScaledVector(_,i*.2*e.tip).addScaledVector(o,-i*.1*e.tip*Math.sign(s||1)),i*.035*e.tip),m:"accent"})}else if(n==="fluke"||n==="fishfin"){let m=n==="fluke"?t.out:o,f=n==="fluke"?o:t.out,y=[];for(let v of[-1,1]){let x=g.p.clone().addScaledVector(_,-i*.08),C=g.p.clone().addScaledVector(_,i*.3*e.tip).addScaledVector(m,v*i*.36*e.tip);y.push(Cn([x,x.clone().lerp(C,.45).addScaledVector(_,i*.05),x.clone().lerp(C,.8),C],[i*.03,i*.11*e.tip,i*.08*e.tip,i*.01],i*.012,f,{radial:8}))}a.push({g:We(y),m:n==="fluke"?"skin":"membrane"})}else if(n==="fan"){let m=[],f=Math.round(e.count);for(let y=0;y<f;y++){let v=(y/(f-1)-.5)*e.spread*2,x=_.clone().multiplyScalar(Math.cos(v)).addScaledVector(t.out,Math.sin(v)).addScaledVector(o,s*.2).normalize(),C=g.p.clone().addScaledVector(x,i*(.8+.2*Math.cos(v*1.5)));m.push(Cn([g.p.clone().addScaledVector(_,-i*.1),g.p.clone().lerp(C,.4),g.p.clone().lerp(C,.82),C],[i*.02,i*.055,i*.07,i*.02],i*.005,o,{radial:6,sub:3}))}a.push({g:We(m),m:"hair"})}else if(n==="tuft"){let m=[];for(let f=0;f<14;f++){let y=_.clone().add(re(Math.sin(f*2.4),Math.cos(f*1.7),Math.sin(f*.9)).multiplyScalar(.55)).normalize(),v=g.p.clone().addScaledVector(y,i*.24*e.tip);m.push(Cn([g.p.clone(),g.p.clone().lerp(v,.5),v],[i*.02,i*.035*e.tip,i*.004],i*.012,hi(y,Jt),{radial:6,sub:3}))}a.push({g:We(m),m:"hair"})}return a}}function Uo(n){return(e,t)=>{let i=Math.round(e.count),s=[],r=[],a=[],o=[];for(let h=0;h<i;h++){let l=i===1?.5:h/(i-1),u=ln(t.part.u+(l-.5)*e.span,-.6,1.6),d=_s(t.frames,u,t.a),p=t.size*Math.pow(Math.sin((l*.84+.08)*Vt),.7),g=d.normal,_=d.tangent.clone().multiplyScalar(-1),m=d.pos.clone().addScaledVector(g,-p*.12);if(n==="spikes")s.push(hn(m,d.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean),p*.2,{radial:7}));else if(n==="plates"){let f=d.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean);s.push(Cn([m,m.clone().lerp(f,.45),m.clone().lerp(f,.8),f],[p*.3,p*.42,p*.3,p*.03],p*.05,hi(g,d.tangent.clone().cross(g)),{radial:8}))}else if(n==="mane")for(let f=0;f<3;f++){let y=hi(g,kn).multiplyScalar((f-1)*.7+(t.rnd()-.5)*.4),v=g.clone().add(y).addScaledVector(_,e.lean).normalize(),x=m.clone().addScaledVector(v,p*.45),C=x.clone().addScaledVector(v,p*.3).addScaledVector(Jt,-p*.45*e.droop).addScaledVector(y,p*.3);r.push(Cn([m,x,C],[p*.09,p*.11,p*.01],p*.025,hi(v,_),{radial:6,sub:3}))}else{let f=d.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean);s.push(hn(m,f,p*.035,{radial:5})),a.push(m.clone().lerp(f,.94)),o.push(m)}}let c=[];if(s.length&&c.push({g:We(s),m:"accent"}),n==="mane"&&c.push({g:We(r),m:"hair"}),a.length>1){let h=[],l=[];for(let u=0;u<a.length-1;u++)for(let d=0;d<4;d++){let p=d/4,g=ln(t.part.u+((u+p)/(i-1)-.5)*e.span,-.6,1.6);h.push(_s(t.frames,g,t.a).pos),l.push(a[u].clone().lerp(a[u+1],p).lerp(h[h.length-1],.12*Math.sin(p*Vt)))}h.push(o[i-1]),l.push(a[i-1]),c.push({g:ys(h,l),m:"membrane"})}return c}}var vh={thick:[.4,2.2,1,"Thickness"],muscle:[.7,1.6,1,"Muscle"],splay:[-.3,1.3,.05,"Spread"],swing:[-1.4,1.4,0,"Swing"],yaw:[-1.6,1.6,0,"Turn"],bend:[-.5,2.5,1,"Bend"],end:[.5,2.2,1,"Foot size"]},Yx={...vh,end:[.5,2.2,1,"Hand size"]},tf=["human","paw","hoof","talon","webbed","stump","point","none"],qx=["human","claw","pincer","mitt","none"],vs={thick:[.3,2.5,1,"Thickness"],curl:[-1.2,1.2,.2,"Curl"]},ur=(n,e,t,i={})=>({n,cat:"limbs",kind:"world",slot:"leg",rel:1,mirror:!0,P:vh,C:{endType:tf},D:{endType:t,...i},build:xh(e,No,t)}),yh=(n,e,t={})=>({n,cat:"limbs",kind:"world",slot:"arm",rel:.85,mirror:!0,P:Yx,C:{endType:qx},D:{endType:e,...t},build:xh("arm",ef,e)}),bs=(n,e,t={})=>({n,cat:"eyes",kind:"surface",slot:"eye",size:.55,mirror:!0,P:e==="compound"||e==="beady"?{}:Rx,build:Ax(e),...t}),qi={len:[.4,2.5,1,"Length"],curve:[-1.5,2,1,"Curve"]},It={eye_round:bs("Round eye","round"),eye_cat:bs("Slit eye","cat"),eye_goat:bs("Bar-pupil eye","goat"),eye_glow:bs("Glowing eye","glow"),eye_beady:bs("Beady eye","beady",{size:.3}),eye_compound:bs("Compound eye","compound",{size:.8}),eye_stalk:bs("Stalk eye","stalk",{size:.45}),brow:{n:"Eyebrow",cat:"eyes",kind:"surface",slot:"brow",size:.6,sink:0,mirror:!0,P:{arch:[-1,2,.6,"Arch"],thick:[.4,2.5,1,"Thickness"]},build:kx},muzzle:{n:"Muzzle",cat:"mouth",kind:"surface",slot:"mouth",size:1.25,P:{len:[.3,2.5,1,"Length"],open:[0,1,.15,"Open"],teeth:[0,3,1,"Teeth"]},build:Cx},beak:{n:"Beak",cat:"mouth",kind:"surface",slot:"mouth",size:1.2,P:{len:[.4,3.5,1,"Length"],hook:[0,1.5,.5,"Hook"],open:[0,1,.1,"Open"]},build:Px},mandibles:{n:"Mandibles",cat:"mouth",kind:"surface",slot:"mouth",size:1.2,P:{len:[.5,2,1,"Length"],open:[0,1,.3,"Open"]},build:Ix},maw:{n:"Round maw",cat:"mouth",kind:"surface",slot:"mouth",size:1.1,P:{teeth:[.3,2.5,1,"Teeth"],count:[5,18,11,"Tooth count"]},build:Lx},lips:{n:"Lips",cat:"mouth",kind:"surface",slot:"mouth",size:.85,P:{full:[.3,2,1,"Fullness"],smile:[-1,1,.25,"Frown / smile"]},build:Dx},trunk:{n:"Trunk",cat:"mouth",kind:"surface",slot:"mouth",size:.9,P:{len:[.4,2,1,"Length"],curl:[-1,1.5,.4,"Curl"]},build:Ux},feelers:{n:"Face feelers",cat:"mouth",kind:"surface",slot:"mouth",size:1.1,P:{len:[.4,2.5,1,"Length"],count:[2,8,4,"Count"]},build:Nx},nose:{n:"Nose",cat:"mouth",kind:"surface",slot:"nose",size:.55,P:{len:[.4,2.2,1,"Length"],wide:[.5,1.8,1,"Width"]},build:Ox},whiskers:{n:"Whiskers",cat:"mouth",kind:"surface",slot:"cheek",size:.9,mirror:!0,P:{len:[.4,2,1,"Length"]},build:zx},tusk:{n:"Tusk",cat:"mouth",kind:"surface",slot:"cheek",size:.7,mirror:!0,orn:!0,P:qi,build:hr("tusk")},beard:{n:"Beard",cat:"mouth",kind:"surface",slot:"chin",size:.9,P:{len:[.3,3,1,"Length"],count:[6,60,26,"Thickness"]},build:jr({count:26,spread:.7,droop:1,width:.11,capR:.6})},ear_point:{n:"Pointed ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Kr("point")},ear_round:{n:"Round ear",cat:"ears",kind:"surface",slot:"ear",size:.9,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Kr("round")},ear_long:{n:"Long ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Kr("long")},ear_floppy:{n:"Floppy ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Kr("floppy")},ear_elf:{n:"Swept ear",cat:"ears",kind:"surface",slot:"earSide",size:.75,mirror:!0,P:{len:[.2,2.5,.6,"Length"],wide:[.4,2,1,"Width"]},build:Kr("elf")},ear_fin:{n:"Fin ear",cat:"ears",kind:"surface",slot:"earSide",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"]},build:Bx},horn_spike:{n:"Spike horn",cat:"horns",kind:"surface",slot:"horn",size:.7,mirror:!0,orn:!0,P:qi,build:hr("spike")},horn_curved:{n:"Curved horn",cat:"horns",kind:"surface",slot:"horn",size:.75,mirror:!0,orn:!0,P:qi,build:hr("curved")},horn_ram:{n:"Ram horn",cat:"horns",kind:"surface",slot:"horn",size:.8,mirror:!0,orn:!0,P:qi,build:hr("ram")},antler:{n:"Antler",cat:"horns",kind:"surface",slot:"horn",size:.7,mirror:!0,orn:!0,P:{...qi,tines:[1,6,3,"Tines"]},build:hr("antler")},antenna:{n:"Antenna",cat:"horns",kind:"surface",slot:"horn",size:1.2,mirror:!0,P:qi,build:Qd(!1)},antenna_feather:{n:"Feathery antenna",cat:"horns",kind:"surface",slot:"horn",size:1.2,mirror:!0,orn:!0,P:qi,build:Qd(!0)},crest:{n:"Feather crest",cat:"horns",kind:"surface",slot:"top",size:1.3,orn:!0,P:{len:[.3,3,1,"Length"],count:[3,30,9,"Feathers"],spread:[.1,1.4,.45,"Spread"],droop:[0,1,.1,"Droop"]},build:jr({count:9,spread:.45,droop:.1,width:.12,capR:.3})},hair:{n:"Hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.15,2.5,.7,"Length"],count:[20,200,110,"Thickness"],spread:[.5,1.9,1.45,"Coverage"],droop:[0,1,.85,"Droop"]},build:jr({count:110,spread:1.45,droop:.85,width:.085,capR:.5,hug:!0})},hair_short:{n:"Cropped hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.1,1,.26,"Length"],count:[40,220,150,"Thickness"],spread:[.5,1.9,1.3,"Coverage"],droop:[0,1,.55,"Droop"]},build:jr({count:150,spread:1.3,droop:.55,width:.075,capR:.5,hug:!0})},hair_long:{n:"Long hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.8,3.2,1.7,"Length"],count:[40,220,130,"Thickness"],spread:[.5,1.9,1.5,"Coverage"],droop:[0,1,1,"Droop"]},build:jr({count:130,spread:1.5,droop:1,width:.09,capR:.5,hug:!0})},leg_human:ur("Walker leg","plant","human"),leg_beast:ur("Beast leg","digi","paw"),leg_hoof:ur("Hoofed leg","digi","hoof",{thick:.8}),leg_bird:ur("Taloned leg","digi","talon",{thick:.6,end:1.3}),leg_frog:ur("Webbed leg","plant","webbed",{bend:2,end:1.3}),leg_pillar:ur("Pillar leg","pillar","stump",{thick:1.5}),leg_insect:{n:"Jointed leg",cat:"limbs",kind:"world",slot:"leg",rel:1.25,mirror:!0,radial:!0,P:{...vh,thick:[.3,2.2,.55,"Thickness"]},C:{endType:tf},D:{endType:"point",thick:.55,splay:0},build:xh("insect",No,"point")},arm_human:yh("Arm with hand","human"),arm_claw:yh("Clawed arm","claw"),arm_pincer:yh("Pincer arm","pincer",{splay:.5,swing:.9}),tentacle:{n:"Tentacle",cat:"limbs",kind:"world",slot:"arm",rel:1.3,mirror:!0,radial:!0,P:{thick:[.4,2.2,1,"Thickness"],curl:[0,2,1,"Wiggle"],splay:[-.6,1.4,.1,"Spread"],yaw:[-1.6,1.6,0,"Turn"],suckers:[0,1,1,"Suckers"]},build:Xx},wing_feather:{n:"Feathered wing",cat:"wings",kind:"world",slot:"wing",rel:1.3,mirror:!0,P:{lift:[-1.2,1.3,.25,"Lift"],sweep:[-.6,1.4,.3,"Sweep"],feathers:[5,16,11,"Feathers"]},build:_h("feather")},wing_bat:{n:"Skin wing",cat:"wings",kind:"world",slot:"wing",rel:1.3,mirror:!0,P:{lift:[-1.2,1.3,.3,"Lift"],sweep:[-.6,1.4,.25,"Sweep"]},build:_h("bat")},wing_insect:{n:"Glass wing",cat:"wings",kind:"world",slot:"wing",rel:1.2,mirror:!0,P:{lift:[-1.2,1.3,.35,"Lift"],sweep:[-.6,1.4,.2,"Sweep"]},build:_h("insect")},fin_dorsal:{n:"Back fin",cat:"wings",kind:"surface",slot:"back",size:1.3,P:{len:[.4,2.5,1,"Height"],sweep:[-.5,2,1,"Sweep"]},build:Vx},fin_side:{n:"Flipper",cat:"wings",kind:"surface",slot:"arm",size:1.5,mirror:!0,P:{len:[.4,2.5,1,"Length"],sweep:[-.5,2,1,"Sweep"]},build:Gx},tail_thin:{n:"Whip tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:vs,build:Pi("thin")},tail_thick:{n:"Heavy tail",cat:"tails",kind:"world",slot:"tail",rel:1.2,P:vs,build:Pi("thick")},tail_fluffy:{n:"Bushy tail",cat:"tails",kind:"world",slot:"tail",rel:.9,P:vs,build:Pi("fluffy")},tail_tuft:{n:"Tufted tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:{...vs,tip:[.4,2.5,1,"Tuft size"]},build:Pi("tuft")},tail_club:{n:"Club tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:{...vs,tip:[.4,2.5,1,"Club size"]},build:Pi("club")},tail_stinger:{n:"Stinger tail",cat:"tails",kind:"world",slot:"tail",rel:1.3,P:{thick:[.3,2.5,1,"Thickness"],curl:[-1.2,1.2,1,"Curl"],tip:[.4,2.5,1,"Stinger size"]},build:Pi("stinger")},tail_fluke:{n:"Fluke tail",cat:"tails",kind:"world",slot:"tail",rel:.9,P:{...vs,tip:[.4,2.5,1,"Fluke size"]},D:{curl:0},build:Pi("fluke")},tail_fish:{n:"Fish tail",cat:"tails",kind:"world",slot:"tail",rel:.8,P:{...vs,tip:[.4,2.5,1,"Fin size"]},D:{curl:0},build:Pi("fishfin")},tail_fan:{n:"Feather fan",cat:"tails",kind:"world",slot:"tail",rel:.8,orn:!0,P:{curl:[-1.2,1.5,.3,"Lift"],count:[3,21,9,"Feathers"],spread:[.1,1.5,.6,"Spread"]},build:Pi("fan")},ridge_spikes:{n:"Spike row",cat:"back",kind:"world",slot:"back",rel:.22,ridge:!0,P:{count:[1,24,9,"Count"],span:[.05,1.6,.6,"Row length"],lean:[-1,1.5,.3,"Lean"]},build:Uo("spikes")},ridge_plates:{n:"Plate row",cat:"back",kind:"world",slot:"back",rel:.3,ridge:!0,P:{count:[1,20,8,"Count"],span:[.05,1.6,.6,"Row length"],lean:[-1,1.5,.1,"Lean"]},build:Uo("plates")},ridge_sail:{n:"Sail",cat:"back",kind:"world",slot:"back",rel:.45,ridge:!0,P:{count:[3,20,9,"Spines"],span:[.05,1.6,.55,"Row length"],lean:[-1,1.5,.2,"Lean"]},build:Uo("sail")},ridge_mane:{n:"Mane",cat:"back",kind:"world",slot:"mane",rel:.4,ridge:!0,orn:!0,P:{count:[3,30,14,"Thickness"],span:[.05,1.6,.3,"Row length"],lean:[-1,1.5,.5,"Sweep"],droop:[0,2,1,"Droop"]},build:Uo("mane")},spike:{n:"Single spike",cat:"back",kind:"surface",slot:"back",size:.5,P:qi,build:hr("spike")},wrap:{n:"Wrap band",cat:"back",kind:"world",slot:"back",rel:.06,ridge:!0,mirror:!1,P:{span:[.03,1.2,.16,"Width"]},build:Fx},shell:{n:"Shell",cat:"back",kind:"surface",slot:"back",size:2.4,P:{dome:[.2,1.5,.55,"Dome"],long:[.6,2.2,1.35,"Length"]},build:Hx}},ko=[["eyes","Eyes"],["mouth","Mouth"],["ears","Ears"],["horns","Head"],["limbs","Limbs"],["wings","Wings"],["tails","Tails"],["back","Back"]];function Fo(n){let e=It[n],t={};for(let[i,s]of Object.entries(e.P||{}))t[i]=s[2];return Object.assign(t,e.D||{})}var Gt=Math.PI,Zi=n=>({base:"#c9b08a",second:"#6b4a2e",belly:"#efe2c8",bellyAmt:.8,pattern:0,patScale:1,cover:"skin",furLen:.3,furDroop:.3,accent:"#e8e0cc",hair:"#3b2a1e",cloth:"#6b4a2e",membrane:"#c98a8a",eye:"#3f8f4a",...n}),At={humanoid:{name:"Humanoid",blurb:"Upright, two arms, two legs",limbLen:.9,bellyDir:[0,-.2,1],dimorph:"human",capS:.5,nodes:[[.9,-.008,.142,.094,"hips",.95,1.12],[1,-.006,.156,.104,"hips",.98,1.18],[1.1,0,.14,.095,"waist",1.03,1],[1.2,.006,.121,.085,"waist",1,.98],[1.31,.012,.139,.1,"chest",1.04,1],[1.4,.015,.157,.107,"chest",1.1,.96],[1.475,.008,.172,.094,"shoulders",1,1],[1.525,.002,.122,.076,"shoulders",.95,1.05],[1.562,.002,.063,.061,"neck"],[1.62,.01,.056,.058,"neck"],[1.69,.03,.08,.094,"head",1.16,.9],[1.752,.032,.112,.118,"head",1.07,1],[1.82,.024,.124,.13,"head",1,1.05],[1.878,.016,.102,.11,"head"]],slots:{eye:[.882,2.8],brow:[.912,2.8],mouth:[.808,Gt],nose:[.848,Gt],cheek:[.83,2.45],chin:[.78,Gt],ear:[1.35,1.1],earSide:[.86,1.57],horn:[1.4,2.1],top:[1.85,0],leg:[-.4,1.57],arm:[.452,1.57],wing:[.42,.45],tail:[.03,0],back:[.3,0],mane:[.6,0]},look:Zi({base:"#c99573",second:"#8a5a3c",belly:"#d9a888",bellyAmt:.35,hair:"#2c1b12",eye:"#4a7fb5",cloth:"#5a3a24"}),parts:[["leg_human","leg",{size:.9,p:{end:.9}}],["arm_human","arm",{size:.72,p:{splay:.1,end:.82}}],["eye_round","eye",{size:.047,p:{lid:.22,iris:.9}}],["brow","brow",{size:.055}],["nose","nose",{size:.05,p:{len:1.25,wide:.85}}],["lips","mouth",{size:.074,p:{full:.95,smile:.25}}],["ear_elf","earSide",{size:.075,p:{len:.25}}],["hair","top",{size:.3,p:{len:.55,count:140}}],["wrap",[-.36,0],{size:.028,p:{span:1.02}}],["wrap",[.4,0],{size:.02,sexOnly:"f",p:{span:.1}}]]},quadruped:{name:"Quadruped",blurb:"Four legs, tail, muzzle",limbLen:.85,bellyDir:[0,-1,0],dimorph:"std",nodes:[[.95,-.62,.15,.17,"hips"],[.98,-.36,.2,.23,"hips"],[.96,0,.195,.235,"waist"],[.99,.34,.21,.27,"chest"],[1.06,.55,.17,.22,"shoulders"],[1.25,.74,.115,.135,"neck"],[1.39,.9,.125,.13,"head"],[1.38,1.03,.105,.105,"head"]],slots:{eye:[.93,.95],mouth:[1.85,Gt],nose:[1.9,0],cheek:[1.35,1.9],chin:[.95,Gt],ear:[.85,.6],earSide:[.86,1.2],horn:[.9,.3],top:[.86,0],leg:[.3,2.1],arm:[.56,1.5],wing:[.5,.55],tail:[-.8,0],back:[.35,0],mane:[.68,0]},look:Zi({base:"#b9773a",second:"#3a2616",belly:"#f3e6d0",cover:"fur",furLen:.3,pattern:5,hair:"#3a2616",eye:"#d9a020"}),parts:[["leg_beast",[.12,2.1],{size:.84}],["leg_beast",[.53,2.1],{size:.86,p:{bend:.45,thick:.9}}],["muzzle","mouth"],["eye_cat","eye"],["ear_point","ear"],["tail_fluffy","tail",{p:{curl:-.35}}],["whiskers","cheek"]]},avian:{name:"Avian",blurb:"Wings, beak, talons",limbLen:.7,bellyDir:[0,-.8,.6],dimorph:"std",nodes:[[.76,-.32,.07,.07,"hips"],[.8,-.1,.17,.17,"hips"],[.92,.1,.19,.2,"chest"],[1.1,.22,.12,.125,"neck"],[1.3,.26,.075,.075,"neck"],[1.42,.3,.1,.1,"head"],[1.44,.38,.085,.085,"head"]],slots:{eye:[.9,1.25],mouth:[1.85,Gt],nose:[1.8,0],cheek:[1.2,1.9],chin:[.85,Gt],ear:[.86,.6],earSide:[.86,1.2],horn:[.92,.5],top:[.9,0],leg:[.22,2.35],arm:[.36,1.5],wing:[.38,.85],tail:[-.85,0],back:[.25,0],mane:[.55,0]},look:Zi({base:"#2f7fc2",second:"#f2c230",belly:"#f4f0e6",cover:"fur",furLen:.12,pattern:5,accent:"#e8a020",hair:"#1f4f9a",eye:"#e8a020"}),parts:[["leg_bird","leg",{size:.74}],["wing_feather","wing",{size:.95}],["beak","mouth"],["eye_round","eye",{p:{lid:.15}}],["crest","top",{sexOnly:null}],["tail_fan","tail",{size:.6}]]},insectoid:{name:"Insectoid",blurb:"Six legs, antennae, chitin",limbLen:.72,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[.5,-.78,.1,.1,"abdomen"],[.56,-.5,.26,.24,"abdomen"],[.53,-.2,.2,.18,"abdomen"],[.5,-.02,.07,.07,"waist"],[.55,.15,.16,.15,"chest"],[.56,.38,.15,.14,"chest"],[.56,.5,.06,.06,"neck"],[.58,.62,.14,.13,"head"],[.56,.74,.1,.1,"head"]],slots:{eye:[.93,1.1],mouth:[1.8,Gt],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Gt],ear:[.9,.8],earSide:[.9,1.3],horn:[.97,.45],top:[.9,0],leg:[.56,2],arm:[.64,1.7],wing:[.56,.5],tail:[-.9,0],back:[.15,0],mane:[.55,0]},look:Zi({base:"#2f6b3a",second:"#12281a",belly:"#9fb86a",bellyAmt:.5,cover:"chitin",pattern:7,accent:"#1c1a14",membrane:"#bfe8e0",eye:"#b03020"}),parts:[["leg_insect",[.47,2],{size:.72,p:{yaw:-.7}}],["leg_insect",[.56,2],{size:.68,p:{yaw:0}}],["leg_insect",[.64,2],{size:.7,p:{yaw:.75}}],["eye_compound","eye"],["mandibles","mouth",{size:.13}],["antenna","horn"],["wing_insect","wing",{size:.95}]]},arachnid:{name:"Arachnid",blurb:"Eight legs, many eyes",limbLen:1,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[.62,-.62,.14,.14,"abdomen"],[.7,-.36,.32,.3,"abdomen"],[.6,-.08,.2,.18,"abdomen"],[.5,.05,.08,.07,"waist"],[.5,.25,.22,.15,"chest"],[.5,.45,.17,.12,"head"],[.48,.55,.1,.08,"head"]],slots:{eye:[1.3,.6],mouth:[1.85,Gt],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Gt],ear:[.9,.8],earSide:[.9,1.3],horn:[.9,.45],top:[.85,0],leg:[.7,1.9],arm:[.85,1.7],wing:[.66,.5],tail:[-.9,0],back:[.18,0],mane:[.5,0]},look:Zi({base:"#3a2a22",second:"#c8501c",belly:"#5a463a",bellyAmt:.4,cover:"fur",furLen:.1,pattern:7,accent:"#14100e",eye:"#a01818"}),parts:[["leg_insect",[.6,1.9],{size:1,p:{yaw:-1}}],["leg_insect",[.66,1.9],{size:.9,p:{yaw:-.35}}],["leg_insect",[.72,1.9],{size:.9,p:{yaw:.3}}],["leg_insect",[.78,1.9],{size:1.05,p:{yaw:.95}}],["eye_beady",[1.35,.5],{size:.045}],["eye_beady",[1.3,1.15],{size:.03}],["eye_beady",[.97,.5],{size:.032}],["eye_beady",[.95,1],{size:.026}],["mandibles","mouth",{size:.12}]]},cephalopod:{name:"Cephalopod",blurb:"Soft mantle, eight tentacles",limbLen:1.1,bellyDir:[0,-.5,-.8],dimorph:"reverse",nodes:[[1.78,-.52,.07,.07,"abdomen"],[1.56,-.38,.24,.22,"abdomen"],[1.26,-.2,.3,.28,"abdomen"],[.97,-.05,.215,.215,"waist"],[.77,.02,.225,.215,"head"],[.62,.05,.19,.19,"head"]],slots:{eye:[.86,1.4],mouth:[2,0],nose:[.8,0],cheek:[.9,.8],chin:[1.2,0],ear:[.7,1.2],earSide:[.7,1.5],horn:[.72,.6],top:[.3,Gt],leg:[1.45,1.57],arm:[1.45,1],wing:[.3,1.57],tail:[-.9,0],back:[.3,Gt],mane:[.4,Gt]},look:Zi({base:"#c4472e",second:"#f0b090",belly:"#f2d6c4",bellyAmt:.7,cover:"slime",pattern:2,patScale:1.6,membrane:"#f2c4b0",eye:"#e0b030"}),parts:[["tentacle",[1.45,.38],{size:1.15}],["tentacle",[1.45,1.15],{size:1.05}],["tentacle",[1.45,1.95],{size:1.05}],["tentacle",[1.45,2.75],{size:1.15}],["eye_goat","eye",{p:{lid:.2}}]]},serpent:{name:"Serpent",blurb:"Long limbless body",limbLen:.5,bellyDir:[0,-1,0],dimorph:"std",nodes:[[.05,-1.75,.025,.025,"tail"],[.09,-1.35,.07,.07,"tail"],[.11,-.9,.1,.1,"hips"],[.12,-.4,.115,.115,"waist"],[.13,.1,.12,.12,"waist"],[.22,.5,.115,.115,"chest"],[.56,.74,.105,.105,"neck"],[.9,.8,.095,.1,"neck"],[1.09,.93,.125,.1,"head"],[1.07,1.1,.1,.075,"head"]],slots:{eye:[.96,.95],mouth:[1.8,Gt],nose:[1.8,0],cheek:[1.2,1.9],chin:[.97,Gt],ear:[.92,.7],earSide:[.92,1.3],horn:[.95,.45],top:[.93,0],leg:[.45,2.1],arm:[.72,1.7],wing:[.68,.6],tail:[-.9,0],back:[.5,0],mane:[.8,0]},look:Zi({base:"#4f8a3a",second:"#1f3a1c",belly:"#e6dfa0",cover:"scales",pattern:1,eye:"#e8c020"}),parts:[["muzzle","mouth",{size:.13,p:{len:.7,teeth:1.8,open:.35}}],["eye_cat","eye",{size:.05}],["ridge_spikes",[.6,0],{size:.07,p:{count:16,span:.7}}]]},aquatic:{name:"Aquatic",blurb:"Fins, flippers, fish tail",limbLen:.5,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[1,-1,.03,.07,"tail"],[1,-.6,.08,.15,"tail"],[1,-.1,.17,.26,"abdomen"],[1.02,.35,.19,.28,"chest"],[1,.7,.15,.2,"head"],[.98,.95,.09,.11,"head"]],slots:{eye:[.9,1.15],mouth:[1.75,Gt],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Gt],ear:[.85,.7],earSide:[.85,1.3],horn:[.9,.45],top:[.85,0],leg:[.4,2.3],arm:[.64,2],wing:[.5,.6],tail:[-.8,0],back:[.52,0],mane:[.7,0]},look:Zi({base:"#3a7f9a",second:"#1c3f5a",belly:"#eef2f0",cover:"scales",pattern:5,membrane:"#7fc4d0",eye:"#e8e0a0"}),parts:[["muzzle","mouth",{size:.13,p:{len:.45,teeth:1.6,open:.3}}],["eye_round","eye",{size:.06,p:{lid:0}}],["fin_dorsal","back",{size:.32}],["fin_side","arm",{size:.3}],["tail_fish","tail",{size:.5,p:{tip:1.3}}]]}};var Zx=1,$x=()=>"p"+Zx+++Math.random().toString(36).slice(2,6),Jx={std:{m:{roles:{shoulders:[.16,.08],chest:[.1,.05],neck:[.2,.16],waist:[.04,.02],head:[.03,.03]},limb:.15,orn:.3,all:.03},f:{roles:{shoulders:[-.1,-.05],chest:[-.04,.07],waist:[-.14,-.08],hips:[.13,.07],neck:[-.13,-.1]},limb:-.1,orn:-.4,all:-.02}},human:{m:{roles:{shoulders:[.14,.06],chest:[.08,.02],neck:[.2,.16],waist:[.06,.04],head:[.03,.02]},front:{chest:[-.04,.04],waist:[.03,0]},limb:.14,orn:.3,all:.03},f:{roles:{shoulders:[-.09,-.04],chest:[-.05,0],waist:[-.13,-.06],hips:[.1,.04],neck:[-.12,-.1]},front:{chest:[.24,0],hips:[0,.12],waist:[-.04,0]},limb:-.1,orn:-.4,all:-.02}},reverse:{m:{roles:{abdomen:[-.12,-.12],head:[.05,.05]},limb:-.05,orn:.35,all:-.05},f:{roles:{abdomen:[.2,.18]},limb:.05,orn:-.3,all:.04}}};function sf(n){let e=Jx[At[n.type].dimorph][n.sex],t=n.dimorph;return{roles:e.roles,front:e.front,k:t,limb:1+e.limb*t,orn:1+e.orn*t,all:1+e.all*t}}function Ms(n){let e=At[n],t={v:1,name:"New "+e.name,type:n,sex:"f",dimorph:.7,bulk:1,stretch:1,nodes:e.nodes.map(s=>{var r,a;return{y:s[0],z:s[1],rx:s[2],ry:s[3],role:s[4],f:(r=s[5])!=null?r:1,b:(a=s[6])!=null?a:1}}),look:{...e.look},parts:[]},i=Oo(t,{sexless:!0}).userData.frames;for(let[s,r,a]of e.parts)ui(t,s,i,typeof r=="string"?e.slots[r]:r,a);return t}function ui(n,e,t,i,s={}){let r=It[e],a=At[n.type],[o,c]=i||a.slots[r.slot]||(r.slot==="brow"?[a.slots.eye[0]+.035,a.slots.eye[1]]:a.slots.back);for(;!i&&n.parts.some(u=>Math.abs(u.u-o)<.02&&Math.abs(u.a-c)<.05&&It[u.kind].cat===r.cat);)o-=.07;let h=_s(t,o,c),l={id:$x(),kind:e,u:o,a:c,mirror:!!r.mirror,rot:0,tilt:0,sexOnly:null,size:r.kind==="surface"?r.size*h.r:r.rel*(r.ridge?Math.max(h.r,.08)*4.5:a.limbLen),p:Fo(e)};s.p&&Object.assign(l.p,s.p);for(let u of["size","rot","tilt","sexOnly","mirror"])s[u]!==void 0&&(l[u]=s[u]);return n.parts.push(l),l}function Oo(n,e={}){var a;let t=sf(n),i=n.nodes.reduce((o,c)=>o+c.y,0)/n.nodes.length,s=n.nodes.reduce((o,c)=>o+c.z,0)/n.nodes.length,r=n.nodes.map(o=>{var l,u;let c=!e.sexless&&t.roles[o.role]||[0,0],h=!e.sexless&&t.front&&t.front[o.role]||[0,0];return{p:re(0,i+(o.y-i)*n.stretch,s+(o.z-s)*n.stretch),rx:o.rx*n.bulk*(e.sexless?1:t.all)*(1+c[0]*t.k),ry:o.ry*n.bulk*(e.sexless?1:t.all)*(1+c[1]*t.k),f:((l=o.f)!=null?l:1)*(1+h[0]*t.k),b:((u=o.b)!=null?u:1)*(1+h[1]*t.k)}});return cn(r,{radial:52,sub:10,capRings:7,side:kn.clone(),frames:!0,capStart:(a=At[n.type].capS)!=null?a:1})}function nf(n,e,t){let i=new Map;for(let r of n){if(!r||!r.g)continue;let a=typeof r.m=="string"?e[r.m]:r.m,o=a.uuid+(r.fur||0);i.has(o)||i.set(o,{mat:a,fur:r.fur,gs:[]}),i.get(o).gs.push(r.g)}let s=[];for(let r of i.values()){let a=new ze(We(r.gs),r.mat);a.userData.fur=r.mat===e.skin?r.fur===!0?1:r.fur||0:0,a.castShadow=r.mat!==e.glass,a.receiveShadow=r.mat===e.skin,s.push(a)}return s}function Mh(n){let e=(n.a%(2*Math.PI)+2*Math.PI)%(2*Math.PI);return n.mirror?(e>Math.PI&&(e=2*Math.PI-e),e<.1?{a:0,mirrored:!1}:e>Math.PI-.1?{a:Math.PI,mirrored:!1}:{a:e,mirrored:!0}):{a:e,mirrored:!1}}function bh(n,e){let t=n.geometry;if(!e){t.setAttribute("rp",t.attributes.position),t.setAttribute("rn",t.attributes.normal);return}let i=t.attributes.position.clone().applyMatrix4(e),s=t.attributes.normal.clone().applyNormalMatrix(new Ge().getNormalMatrix(e));t.setAttribute("rp",i),t.setAttribute("rn",s)}function rf(n,e,t,i,s,r){let a=It[e.kind],o=sf(n),c=new Tt;if(c.userData.partId=e.id,e.sexOnly&&e.sexOnly!==n.sex)return c;let{a:h,mirrored:l}=Mh(e),u=_s(t,e.u,h),d=[...e.id].reduce((y,v)=>y*31+v.charCodeAt(0)|0,7),p={M:i,look:n.look,female:n.sex==="f",k:o.k,limbMul:o.limb,rnd:cr(d),seed:d%100/16,part:e,frames:t,a:h,r:u.r,normal:u.normal},g=a.orn?o.orn:1,_=s?[]:null;p.anchors=_;let m=new Tt;if(c.userData.anchor=u.pos.clone(),a.kind==="surface"){let y=u.normal,v=Math.abs(y.y)<.9?Jt.clone():y.y>0?lr.clone().multiplyScalar(-1):lr.clone(),x=v.addScaledVector(y,-v.dot(y)).normalize(),C=x.clone().cross(y),T=new qt().setFromRotationMatrix(new qe().makeBasis(C,x,y));T.multiply(new qt().setFromAxisAngle(lr,e.rot)).multiply(new qt().setFromAxisAngle(kn,-e.tilt));let A=T.clone().invert();p.down=re(0,-1,0).applyQuaternion(A),p.up=re(0,1,0).applyQuaternion(A),p.fwd=re(0,0,1).applyQuaternion(A);for(let I of nf(a.build(e.p,p),i))m.add(I);m.quaternion.copy(T),m.position.copy(u.pos),m.scale.setScalar(e.size*g),m.updateMatrix();for(let I of m.children)I.material===i.skin&&bh(I,m.matrix)}else{p.size=e.size*g;let y=e.p.yaw||0,v=kn.clone();a.radial&&(v=re(u.normal.x,0,u.normal.z),v.lengthSq()<.01&&(v=kn.clone()),v.normalize()),v.applyAxisAngle(Jt,-y),p.out=v,p.fwd=v.clone().cross(Jt).normalize(),p.root=a.ridge?u.pos:u.pos.clone().addScaledVector(u.normal,-u.r*(a.cat==="limbs"?.4:.25));for(let x of nf(a.build(e.p,p),i))m.add(x),x.material===i.skin&&bh(x);a.ridge||(m.userData.joint={pivot:p.root.clone(),kind:a.cat==="limbs"?e.kind.startsWith("leg")?"leg":e.kind==="tentacle"?"tentacle":"arm":a.cat==="wings"?"wing":"tail",partId:e.id,side:1})}c.add(m);let f=null;if(l){let y=new Tt;y.scale.x=-1,f=m.clone(),m.userData.joint&&(f.userData.joint={...m.userData.joint,side:-1}),y.add(f),c.add(y)}if(r&&m.userData.joint)for(let y of[m,f])y&&r.n<Io&&(y.userData.joint.bone=r.n++);if(_)for(let y of _)s.push({...y,node:m}),f&&s.push({...y,node:f});return c}function dr(n,e,t={}){let i=new Tt,s=Oo(n),r=s.userData.frames,a=new ze(s,e.skin),o=t.animated?{n:1}:null;a.castShadow=a.receiveShadow=!0,bh(a),a.userData.fur=1,a.userData.partId="body",i.add(a);let c={group:i,body:a,frames:r,parts:new Map,shells:new Tt,data:n,M:e};for(let h of n.parts){let l;try{l=rf(n,h,r,e,t.anchors,o)}catch(u){console.error("part failed",h.kind,u),l=new Tt,l.userData.partId=h.id}c.parts.set(h.id,l),i.add(l)}return i.add(c.shells),Qr(c),c}function Bo(n,e){let t=n.parts.get(e.id);t&&(n.group.remove(t),fr(t));let i=rf(n.data,e,n.frames,n.M);return n.parts.set(e.id,i),n.group.add(i),i}function Qr(n,e){for(let s of[...n.shells.children])n.shells.remove(s);if(n.shellGeo&&(n.shellGeo.dispose(),n.shellGeo=null),n.data.look.cover!=="fur")return;n.group.updateMatrixWorld(!0);let t=[],i=n.group.matrixWorld.clone().invert();if(n.group.traverse(s=>{if(!s.isMesh||!s.userData.fur)return;let r=s,a=!1;for(;r;)e&&r.userData.partId===e&&(a=!0),r=r.parent;if(a)return;let o=0;for(let l=s.parent;l&&l!==n.group;l=l.parent)l.userData.joint&&l.userData.joint.bone&&(o=l.userData.joint.bone);let c=i.clone().multiply(s.matrixWorld),h=s.geometry.clone();h.deleteAttribute("rp"),h.deleteAttribute("rn"),h.applyMatrix4(c),c.determinant()<0&&Kd(h),h.setAttribute("bone",new vt(new Float32Array(h.attributes.position.count).fill(o),1)),h.setAttribute("fur",new vt(new Float32Array(h.attributes.position.count).fill(s.userData.fur),1)),t.push(h)}),!!t.length){n.shellGeo=We(t,["fur","bone"]),n.shellGeo.setAttribute("rp",n.shellGeo.attributes.position),n.shellGeo.setAttribute("rn",n.shellGeo.attributes.normal),t.forEach(s=>s!==n.shellGeo&&s.dispose());for(let s=0;s<Po;s++){let r=new ze(n.shellGeo,n.M.shells[s]);r.frustumCulled=!1,r.raycast=()=>{},n.shells.add(r)}}}function fr(n){n.traverse(e=>{e.isMesh&&e.geometry.dispose()})}function ea(n){let e=new Rn;return n.group.updateMatrixWorld(!0),n.group.traverse(t=>{t.isMesh&&t.parent!==n.shells&&(t.geometry.computeBoundingBox(),e.union(t.geometry.boundingBox.clone().applyMatrix4(t.matrixWorld)))}),e}var af={muzzle:n=>{var e;return 5+2.5*((e=n.teeth)!=null?e:1)},beak:n=>{var e;return 6+1.5*((e=n.hook)!=null?e:.5)},mandibles:()=>7,maw:n=>{var e;return 4+2.5*((e=n.teeth)!=null?e:1)},trunk:()=>3,feelers:()=>2,lips:()=>1,tusk:()=>5,horn_spike:()=>4,horn_curved:()=>5,horn_ram:()=>6,antler:()=>5,tentacle:()=>3,tail_club:()=>7,tail_stinger:()=>5,tail_thick:()=>3,spike:()=>2},Kx={claw:4,talon:4,pincer:6,paw:2.5,hoof:3,human:3,point:2.5,webbed:2,stump:2.5,mitt:1.5,none:0},jx=[1,.6,.4,.3,.2,.15],$i=(n,e,t)=>Math.min(t,Math.max(e,n));function pr(n){var T,A;let e=0;for(let I=0;I<n.nodes.length-1;I++){let S=n.nodes[I],b=n.nodes[I+1];e+=Math.hypot(S.y-b.y,S.z-b.z)*Math.PI*((S.rx+b.rx)/2)*((S.ry+b.ry)/2)}let t=Math.min(Math.cbrt(e*n.bulk*n.bulk),.9),i=n.parts.filter(I=>!I.sexOnly||I.sexOnly===n.sex),s=I=>I.mirror&&Math.abs(Math.sin(I.a))>.1?1.25:1,r=[],a=0,o=0,c=0,h=0,l=0,u=0,d=0,p=0,g=0,_=!1,m=!1,f=!1,y=!1,v=0;for(let I of i){let S=I.kind;af[S]&&r.push(af[S](I.p)*s(I)),(I.p.endType!==void 0||S.startsWith("leg_")||S.startsWith("arm_"))&&r.push(((T=Kx[I.p.endType])!=null?T:2)*s(I));let b=s(I)>1?2:1;S.startsWith("leg_")&&(a++,g+=b),S.startsWith("arm_")&&(p+=b),S==="tentacle"&&(p+=b,v+=b),S.startsWith("tail_")&&(_=!0),(S.startsWith("horn_")||S==="antler"||S==="tusk")&&(m=!0),["muzzle","beak","mandibles","maw","trunk","feelers","lips"].includes(S)&&(f=!0),["claw","talon","paw","pincer"].includes(I.p.endType)&&(y=!0),S==="feelers"&&(l+=1),S.startsWith("wing_")&&o++,S.startsWith("eye_")&&(c+=s(I)>1?2:1),S==="ridge_spikes"&&(h+=.12),S==="spike"&&(h+=.04),S==="tail_stinger"&&(l+=3),S==="mandibles"&&(l+=1),S==="shell"&&(u+=.15,d+=25),S==="ridge_plates"&&(u+=.08,d+=10)}r.sort((I,S)=>S-I);let x=7;r.forEach((I,S)=>{var b;x+=I*((b=jx[S])!=null?b:S<10?.06:0)}),d=Math.min(d,60),l=Math.min(l,6),x*=.82+.42*t,u+=(A={scales:.08,chitin:.12,fur:.02+.05*n.look.furLen,slime:.02,skin:0}[n.look.cover])!=null?A:0;let C=a===0?.9:a===1?1:a===2?1.08:1.14;return o&&(C+=.12),C-=.3*(t-.45),u>.2&&(C-=.06),C=$i(C,.6,1.5),{hp:Math.round(80+210*t+d*1.5),atk:Math.round(x*10)/10,def:$i(u,0,.45),spd:Math.round(C*100)/100,dodge:$i(.04+(C-1)*.2+(n.look.cover==="slime"?.05:0)+(o?.03:0),0,.3),crit:$i(.04+.02*c,.04,.16),miss:c===0?.25:.04,thorns:$i(h,0,.3),venom:l,wings:o>0,eyes:c,hands:Math.min(p,8),slots:Math.min(p,8)||1,abilitySlots:n.type==="humanoid"?3:2,legs:g,tail:_,horns:m,mouth:f,claws:y,tentacles:v,armoured:u>=.12,big:t>.56,small:t<.42,serpent:n.type==="serpent",type:n.type}}function of(n){let e=[];return n.venom&&e.push("Venom"),n.thorns>0&&e.push("Spiny"),n.def>=.15&&e.push("Armoured"),n.wings&&e.push("Winged"),n.spd>=1.12&&e.push("Quick"),n.eyes===0?e.push("Blind"):n.crit>=.12&&e.push("Keen-eyed"),e}function lf(n,e=0,t=!1,i=!1){let s=t?1.3:1,r=i?Math.pow(Go.grow,Math.max(0,n-Go.from)):1;return{hp:(zo.hp0+zo.hp1*n)*s*(1+.1*e)*r,atk:(zo.atk0+zo.atk1*n)*(t?1.12:1)*(1+.07*e)*r}}var Go={slope:.7,from:14,grow:1.03},zo={hp0:.34,hp1:.093,atk0:.4,atk1:.086},Qx=["hpP","atkP","atkF","spdP","crit","critD","dodge","def","pierce","lifesteal","thorns","regen","bleedC","poisonC","poisonD","burnC","stunC","stunDur","dbl","ramp","lowP","firstX","giantP","vsBleedP","perStatusCrit","perStatusDmg","critBleed","critCdr","execP","riposte","blockHeal","killHeal","killHp","secondWind","hemo","festerP","shieldP","opener","guardCdr","perWeaponSpd","perLegAtk","perEyeCrit","thornsBleed","dodgeCrit","weapons"];function Eh(n,e={}){let t={};for(let o of Qx)t[o]=e.mods&&e.mods[o]||0;let i=e.mul||{hp:1,atk:1},s=e.boost||{hp:1,atk:1},r=Math.round(n.hp*(1+t.hpP)*i.hp*s.hp*(1+(e.bonusHp||0))),a=$i(n.spd*(1+t.spdP+t.perWeaponSpd*t.weapons),.5,2.4);return{s:n,m:t,max:r,hp:r,shield:Math.round(r*t.shieldP),atk:(n.atk+t.atkF)*(1+t.atkP+t.perLegAtk*n.legs)*i.atk*s.atk,crit:n.crit+t.crit+t.perEyeCrit*n.eyes,dodge:$i(n.dodge+t.dodge,0,.45),def:$i(n.def+t.def,0,.6),thorns:n.thorns+t.thorns,poisonC:(n.venom?.35:0)+t.poisonC,poisonD:Math.max(n.venom,t.poisonC>0?2:0)+t.poisonD,every:1.75/a,t:.9+.5/a,power:!1,powerCd:2,guard:0,guardCd:0,guardEvery:Math.max(2.5,4.5-t.guardCdr),st:{bleed:0,bleedT:0,bleedD:1,poison:0,poisonD:0,burn:0,burnD:0,stun:0,immune:0,weak:0,slow:0,blind:0},buff:{evade:0,shell:0,frenzy:0},tick:0,fury:0,first:!0,wind:t.secondWind>0,nextCrit:!1,opened:!(t.opener>0),abil:(e.abilities||[]).map(o=>({id:o.id,lvl:Math.min(o.lvl,5),cd:3}))}}function Th(n){return n.powerCd>0||n.hp<=0?!1:(n.power=!0,n.powerCd=7,!0)}function Ah(n){return n.guardCd>0||n.hp<=0?!1:(n.guard=.9,n.guardCd=n.guardEvery,!0)}function Sh(n,e){if(n.shield>0){let t=Math.min(n.shield,e);n.shield-=t,e-=t}n.hp-=e}function ta(n,e){n.hp=Math.min(n.max,n.hp+e)}function Ho(n,e,t){n.st.bleed=Math.min(12,n.st.bleed+e),n.st.bleedT=5,n.st.bleedD=Math.max(1,t.atk*.08)*(1+t.m.festerP)}function wh(n,e){return n.st.immune>0?!1:(n.st.stun=e,n.st.immune=e+3,!0)}function Wo(n,e,t,i){n[e+"D"]=n[e]>0?Math.max(n[e+"D"],i):i,n[e]=Math.max(n[e],t)}var ev=n=>(n.st.bleed>0)+(n.st.poison>0)+(n.st.burn>0)+(n.st.stun>0);function Vo(n,e,t,i,s={}){let r=n[e],a=n[1-e],o=r.m,c=a.m,h={type:"hit",by:e,dmg:0,power:!!s.power,name:s.name};if(!s.sure&&i()<(r.s.miss+(r.st.blind>0?.6:0))*(s.power?.5:1))return h.miss=!0,h;if(!s.sure&&(a.buff.evade>0||i()<a.dodge))return c.dodgeCrit&&(a.nextCrit=!0),h.miss=!0,h;let l=ev(a),u=r.atk*t*(.85+.3*i())*(1+Math.max(0,(n.time||0)-40)*.05),d=1+r.fury*o.ramp+(r.hp<r.max*.4?o.lowP:0)+(a.st.bleed>0?o.vsBleedP:0)+l*o.perStatusDmg+(a.max>r.max?o.giantP:0)+(a.hp<a.max*.3?o.execP:0);if(r.first&&s.name!=="Sling"&&(d+=o.firstX,r.first=!1),u*=d*(r.st.weak>0?.7:1)*(r.st.burn>0?.9:1),(r.nextCrit||i()<r.crit+l*o.perStatusCrit)&&(u*=1.8+o.critD,h.crit=!0,r.nextCrit=!1,o.critBleed&&Ho(a,o.critBleed,r),o.critCdr))for(let p of r.abil)p.cd=Math.max(0,p.cd-o.critCdr);return u*=(1-Math.max(0,a.def-o.pierce))*(a.buff.shell>0?.3:1),a.guard>0?(u*=.2,h.blocked=!0,a.guard=0,r.t+=.6,c.riposte&&(h.riposte=Math.max(1,Math.round(a.atk*c.riposte)),Sh(r,h.riposte)),c.blockHeal&&ta(a,a.max*c.blockHeal)):(a.thorns>0&&!s.ranged&&(h.thorns=Math.max(1,Math.round(u*a.thorns*(a.buff.shell>0?2:1))),Sh(r,h.thorns),c.thornsBleed&&Ho(r,1,a)),i()<o.bleedC&&(Ho(a,1,r),h.bleed=!0),i()<r.poisonC&&(Wo(a.st,"poison",5,(r.poisonD+r.atk*.12)*(1+o.festerP)),h.venom=!0),i()<o.burnC&&(Wo(a.st,"burn",3,Math.max(1,u*.14)*(1+o.festerP)),h.burn=!0),i()<o.stunC&&wh(a,.7*(1+o.stunDur))&&(h.stun=!0),o.lifesteal&&ta(r,u*o.lifesteal)),h.dmg=Math.max(1,Math.round(u)),Sh(a,h.dmg),r.fury++,h}function Rh(n,e,t,i,s){let r=n[e],a=n[1-e],o=r.abil[t];if(!o||o.cd>0||r.hp<=0||a.hp<=0||r.st.stun>0)return!1;let c=o.lvl,h=u=>s.push({type:"cast",by:e,name:u}),l=(u,d,p)=>{let g=Vo(n,e,u,i,{name:d,...p});return g.ability=!0,s.push(g),g};switch(o.id){case"pounce":{let u=l(1.4+.3*c,"Pounce");!u.miss&&!u.blocked&&wh(a,.8);break}case"roar":a.st.weak=4+c,h("Roar");break;case"lick":ta(r,r.max*(.11+.04*c)),s.push({type:"heal",on:e,name:"Lick Wounds"});break;case"spit":Wo(a.st,"poison",6,(r.atk*(.22+.08*c)+r.m.poisonD)*(1+r.m.festerP)),h("Venom Spit");break;case"dive":r.buff.evade=1.5+.5*c,r.nextCrit=!0,h("Dive");break;case"constrict":{l(.8+.3*c,"Constrict",{sure:!0}).blocked||wh(a,(1.3+.3*c)*(1+r.m.stunDur));break}case"web":a.st.slow=4+c,h("Web");break;case"ink":a.st.blind=3+c,h("Ink Cloud");break;case"shellup":r.buff.shell=3+c,h("Shell Up");break;case"sweep":{l(1+.25*c,"Tail Sweep").miss||(a.t+=1.2);break}case"gore":{let u=l(1.2+.2*c,"Gore");!u.miss&&!u.blocked&&Ho(a,2+c,r);break}case"frenzy":r.buff.frenzy=4,r.frenzyX=1.5+.2*c,h("Frenzy");break;case"hurl":l(1.6+.3*c,"Hurl",{sure:!0,ranged:!0});break;case"rend":l(.6+(.35+.1*c)*a.st.bleed,"Rend");break;case"breath":{let u=l(.8+.2*c,"Fire Breath",{sure:!0,ranged:!0});Wo(a.st,"burn",5,Math.max(2,u.dmg*.2)*(1+r.m.festerP));break}default:return!1}return o.cd=Ch[o.id]||10,!0}var Ch={pounce:9,roar:12,lick:14,spit:10,dive:11,constrict:12,web:12,ink:12,shellup:13,sweep:8,gore:10,frenzy:13,hurl:10,rend:9,breath:11};function Ph(n,e,t,i,s,r){let a=n[e],o=n[1-e];a.powerCd<=0&&i()<t*.6&&Th(a),a.guardCd<=0&&o.t<.3&&i()<t*8*s&&Ah(a);for(let c=0;c<a.abil.length;c++)a.abil[c].cd<=0&&i()<t*1.2&&!(a.abil[c].id==="lick"&&a.hp>a.max*.75)&&!(a.abil[c].id==="rend"&&o.st.bleed<2)&&Rh(n,e,c,i,r)}function cf(n,e,t,i){n.time=(n.time||0)+e;for(let s=0;s<2;s++){let r=n[s],a=n[1-s],o=r.st;if(r.hp<=0||a.hp<=0)continue;if(!r.opened){r.opened=!0;let h=Vo(n,s,r.m.opener,t,{sure:!0,ranged:!0,name:"Sling"});h.ability=!0,i.push(h)}r.powerCd=Math.max(0,r.powerCd-e),r.guardCd=Math.max(0,r.guardCd-e),r.guard=Math.max(0,r.guard-e);for(let h of r.abil)h.cd=Math.max(0,h.cd-e);for(let h of["stun","immune","weak","slow","blind","poison","burn"])o[h]=Math.max(0,o[h]-e);for(let h of["evade","shell","frenzy"])r.buff[h]=Math.max(0,r.buff[h]-e);if(o.bleed>0&&(o.bleedT-=e,o.bleedT<=0&&(o.bleed=0)),r.m.regen&&ta(r,r.max*r.m.regen*e),r.tick+=e,r.tick>=1){r.tick-=1;let h=0;o.bleed>0&&(h+=o.bleed*o.bleedD,a.m.hemo&&ta(a,a.m.hemo*o.bleed)),o.poison>0&&(h+=o.poisonD),o.burn>0&&(h+=o.burnD),h>0&&(h=Math.max(1,Math.round(h)),r.hp-=h,i.push({type:"dot",on:s,dmg:h,kind:o.burn>0?"burn":o.poison>0?"venom":"bleed"}))}if(o.stun>0||(r.t-=e*(r.buff.frenzy>0?r.frenzyX:1)*(o.slow>0?.5:1),r.t>0||r.hp<=0))continue;r.t=r.every*(.9+.2*t());let c=r.power;if(r.power=!1,i.push(Vo(n,s,c?2.1:1,t,{power:c})),a.hp>0&&r.hp>0&&t()<r.m.dbl){let h=Vo(n,s,.7,t,{});h.extra=!0,i.push(h)}}for(let s=0;s<2;s++){let r=n[s];r.hp<=0&&r.wind&&(r.wind=!1,r.hp=Math.max(1,Math.round(r.max*r.m.secondWind)),i.push({type:"heal",on:s,name:"Second Wind"}))}return n[0].hp<=0&&n[1].hp<=0&&(n[0].hp=1),n[1].hp<=0?0:n[0].hp<=0?1:-1}var we=n=>Math.round(n*100)+"%",Wt=n=>(Math.round(n*10)/10).toString(),Fn=(n,e,t,i,s,r,a,o=1,c)=>({id:n,name:e,icon:t,tags:i,cost:s,mods:r,text:a,hands:o,req:c,cat:"weapon"}),Ze=(n,e,t,i,s,r,a,o,c)=>({id:n,name:e,icon:t,tags:i,cost:s,mods:r,text:a,req:o,reqText:c,cat:"relic"}),un=(n,e,t,i,s,r,a,o,c)=>({id:n,name:e,icon:t,tags:i,cost:s,cd:r,text:a,req:o,reqText:c,cat:"ability"}),Ss=[Fn("club","Bone Club","\u{1F9B4}",["stun","fury"],0,n=>({atkF:3.5*n,stunC:.07*n}),n=>`+${Wt(3.5*n)} attack. ${we(.07*n)} chance to stun.`),Fn("cleaver","Notched Cleaver","\u{1FA93}",["bleed"],0,n=>({atkF:3*n,bleedC:.4*n}),n=>`+${Wt(3*n)} attack. ${we(.4*n)} chance to cause bleeding.`),Fn("fang","Fang Dagger","\u{1F5E1}\uFE0F",["poison","speed"],0,n=>({atkF:2*n,poisonC:.35*n,spdP:.06*n}),n=>`+${Wt(2*n)} attack, +${we(.06*n)} speed. ${we(.35*n)} chance to poison.`),Fn("mace","Thorn Mace","\u{1F335}",["thorns"],0,n=>({atkF:2*n,thorns:.08*n}),n=>`+${Wt(2*n)} attack. Attackers take ${we(.08*n)} of their damage back.`),Fn("buckler","Spiked Buckler","\u{1F6E1}\uFE0F",["guard","thorns"],0,n=>({def:.05*n,riposte:.4*n,guardCdr:.5}),n=>`+${we(.05*n)} armour. Guard recharges faster and a block hits back for ${we(.4*n)} attack.`),Fn("sling","Stone Sling","\u{1FAA8}",["crit"],0,n=>({opener:.9*n,crit:.06*n}),n=>`Opens each fight with a shot for ${we(.9*n)} attack. +${we(.06*n)} critical chance.`),Fn("brand","Ember Brand","\u{1F525}",["burn"],250,n=>({atkF:2*n,burnC:.3*n}),n=>`+${Wt(2*n)} attack. ${we(.3*n)} chance to set the enemy on fire.`),Fn("pick","War Pick","\u26CF\uFE0F",["crit"],250,n=>({atkF:2.5*n,pierce:.2*n}),n=>`+${Wt(2.5*n)} attack. Ignores ${we(.2*n)} armour.`),Fn("hooks","Twin Hooks","\u{1FA9D}",["speed"],300,n=>({atkF:2*n,dbl:.15*n}),n=>`+${Wt(2*n)} attack. ${we(.15*n)} chance to strike twice.`),Fn("whip","Leech Whip","\u{1FA78}",["life"],350,n=>({atkF:1.5*n,lifesteal:.08*n}),n=>`+${Wt(1.5*n)} attack. Heals for ${we(.08*n)} of damage dealt.`),Fn("maul","Great Maul","\u{1F528}",["stun","fury"],400,n=>({atkF:7*n,spdP:-.1,stunC:.08*n}),n=>`Needs two hands. +${Wt(7*n)} attack, -10% speed. ${we(.08*n)} chance to stun.`,2),Fn("trident","Barbed Trident","\u{1F531}",["bleed","crit"],450,n=>({atkF:3.5*n,vsBleedP:.2*n,critD:.3*n,bleedC:.15*n}),n=>`+${Wt(3.5*n)} attack. ${we(.15*n)} chance to cause bleeding, +${we(.2*n)} damage to bleeding enemies, +${we(.3*n)} critical damage.`),Ze("hide","Thick Hide","\u{1F418}",["life"],0,n=>({hpP:.12*n}),n=>`+${we(.12*n)} health.`),Ze("tooth","Whetted Tooth","\u{1F9B7}",["fury"],0,n=>({atkP:.12*n}),n=>`+${we(.12*n)} attack.`),Ze("blood","Quick Blood","\u{1F4A8}",["speed"],0,n=>({spdP:.1*n}),n=>`+${we(.1*n)} speed.`),Ze("eye","Hunter's Eye","\u{1F441}\uFE0F",["crit"],0,n=>({crit:.12*n}),n=>`+${we(.12*n)} critical chance.`),Ze("edge","Cruel Edge","\u2702\uFE0F",["crit"],0,n=>({critD:.5*n,crit:.03}),n=>`+${we(.5*n)} critical damage and +3% critical chance.`),Ze("slick","Slick Skin","\u{1F4A7}",["speed"],0,n=>({dodge:.08*n}),n=>`+${we(.08*n)} dodge.`),Ze("plate","Iron Scales","\u{1F529}",["guard"],0,n=>({def:.06*n}),n=>`+${we(.06*n)} armour.`),Ze("jag","Jagged Claws","\u{1FA78}",["bleed"],0,n=>({bleedC:.3*n}),n=>`${we(.3*n)} chance on hit to cause bleeding.`),Ze("rot","Rot Gland","\u2623\uFE0F",["poison"],0,n=>({poisonC:.3*n,poisonD:1.5*n}),n=>`${we(.3*n)} chance on hit to poison. Poison is stronger.`),Ze("gut","Ember Gut","\u{1F30B}",["burn"],200,n=>({burnC:.2*n}),n=>`${we(.2*n)} chance on hit to set the enemy on fire.`),Ze("scent","Blood Scent","\u{1F43A}",["bleed","fury"],0,n=>({vsBleedP:.3*n,bleedC:.1}),n=>`+${we(.3*n)} damage to bleeding enemies, and 10% chance to cause bleeding.`),Ze("torment","Tormentor","\u{1F608}",["bleed","poison","burn"],400,n=>({perStatusDmg:.14*n}),n=>`+${we(.14*n)} damage for each ailment on the enemy (bleed, poison, fire, stun).`),Ze("opp","Opportunist","\u{1F3AF}",["crit","bleed","poison","burn"],300,n=>({perStatusCrit:.12*n}),n=>`+${we(.12*n)} critical chance for each ailment on the enemy.`),Ze("fester","Festering","\u{1F9A0}",["poison","burn","bleed"],0,n=>({festerP:.5*n}),n=>`Bleed, poison and fire deal ${we(.5*n)} more.`),Ze("hemo","Hemophage","\u{1F987}",["bleed","life"],350,n=>({hemo:1.2*n}),n=>`Heal ${Wt(1.2*n)} for each bleed stack on the enemy, every second.`),Ze("mist","Red Mist","\u{1F32B}\uFE0F",["crit","bleed"],350,n=>({critBleed:Math.max(1,Math.round(n))}),n=>`Critical hits add ${Math.max(1,Math.round(n))} bleed.`),Ze("rhythm","Predator's Rhythm","\u23F1\uFE0F",["crit","ability"],0,n=>({critCdr:1*n,crit:.05}),n=>`+5% critical chance. Critical hits cut ability cooldowns by ${Wt(1*n)}s.`),Ze("finish","Finisher","\u{1F480}",["crit","fury"],0,n=>({execP:.4*n}),n=>`+${we(.4*n)} damage to enemies below 30% health.`),Ze("flurry","Flurry","\u{1F300}",["speed"],0,n=>({dbl:.13*n}),n=>`${we(.13*n)} chance to strike twice.`),Ze("moment","Momentum","\u{1F4C8}",["speed","fury"],0,n=>({ramp:.025*n}),n=>`Each hit you land adds +${Wt(2.5*n)}% damage for the rest of the fight.`),Ze("riposte","Riposte","\u{1F93A}",["guard"],0,n=>({riposte:.5*n}),n=>`A block hits back for ${we(.5*n)} attack.`),Ze("bulwark","Bulwark","\u{1F9F1}",["guard","life"],0,n=>({blockHeal:.05*n}),n=>`A block heals ${we(.05*n)} health.`),Ze("spite","Spite","\u{1F994}",["thorns"],0,n=>({thorns:.08*n}),n=>`Attackers take ${we(.08*n)} of their damage back.`),Ze("barbs","Barbed Hide","\u{1FAA1}",["thorns","bleed"],300,n=>({thornsBleed:1,thorns:.04*n}),n=>`Attackers take ${we(.04*n)} back and start bleeding.`),Ze("leech","Leech","\u{1FAB1}",["life"],0,n=>({lifesteal:.06*n}),n=>`Heal for ${we(.06*n)} of damage dealt.`),Ze("trophy","Trophy Hunter","\u{1F3C6}",["life"],0,n=>({killHp:.04*n}),n=>`Each kill adds +${we(.04*n)} health for the rest of the gauntlet.`),Ze("feast","Feast","\u{1F356}",["life"],0,n=>({killHeal:.12*n}),n=>`Each kill heals an extra ${we(.12*n)} health.`),Ze("wind","Second Wind","\u{1F54A}\uFE0F",["life"],500,n=>({secondWind:.15*n}),n=>`Once per fight, survive a killing blow and heal ${we(.15*n)}.`),Ze("breath","Deep Breath","\u{1F33F}",["life"],0,n=>({regen:.006*n}),n=>`Regain ${Wt(.6*n)}% health every second.`),Ze("shellr","Carapace","\u{1F95A}",["guard","life"],0,n=>({shieldP:.15*n}),n=>`Start each fight with a shield worth ${we(.15*n)} health.`),Ze("corner","Cornered","\u{1F621}",["fury"],0,n=>({lowP:.3*n}),n=>`+${we(.3*n)} damage while below 40% health.`),Ze("ambush","Ambush","\u{1F311}",["crit"],0,n=>({firstX:n}),n=>`Your first hit each fight deals +${we(n)} damage.`),Ze("giant","Giant Slayer","\u{1FA93}",["fury"],250,n=>({giantP:.2*n}),n=>`+${we(.2*n)} damage to enemies with more health than you.`),Ze("herd","Stampede","\u{1F9AC}",["fury"],0,n=>({perLegAtk:.03*n}),n=>`+${we(.03*n)} attack for each leg.`,n=>n.legs>=4,"four or more legs"),Ze("eyes","Many Eyes","\u{1F577}\uFE0F",["crit"],0,n=>({perEyeCrit:.03*n}),n=>`+${Wt(3*n)}% critical chance for each eye.`,n=>n.eyes>=2,"two or more eyes"),Ze("ambi","Ambidextrous","\u{1F64C}",["speed","weapon"],0,n=>({perWeaponSpd:.06*n}),n=>`+${we(.06*n)} speed for each weapon held.`,n=>n.hands>=2,"two or more hands"),Ze("updraft","Updraft","\u{1FABD}",["speed","crit"],0,n=>({dodge:.08*n,dodgeCrit:1}),n=>`+${we(.08*n)} dodge. After a dodge, your next hit is critical.`,n=>n.wings,"wings"),Ze("heavy","Heavyweight","\u{1F5FF}",["guard","thorns"],0,n=>({def:.04*n,thorns:.05*n}),n=>`+${we(.04*n)} armour, and attackers take ${we(.05*n)} back.`,n=>n.big,"a large body"),Ze("feather","Featherweight","\u{1FAB6}",["speed"],0,n=>({spdP:.08*n,dodge:.04*n}),n=>`+${we(.08*n)} speed and +${we(.04*n)} dodge.`,n=>n.small,"a small body"),Ze("coil","Coiled","\u27B0",["stun"],0,n=>({stunC:.06*n,stunDur:.5}),n=>`${we(.06*n)} chance to stun, and stuns last longer.`,n=>n.serpent||n.tentacles>=2,"a serpent body or tentacles"),Ze("virulent","Virulent","\u{1F9EB}",["poison"],0,n=>({poisonD:3*n,poisonC:.15}),n=>`Your poison deals ${Wt(3*n)} more each second, and lands more often.`,n=>n.venom,"a stinger, mandibles or feelers"),un("pounce","Pounce","\u{1F43E}",["stun","fury"],0,9,n=>`Leap for ${we(1.4+.3*n)} attack and stun briefly.`,n=>n.legs>=2,"legs"),un("roar","Roar","\u{1F981}",["guard"],0,12,n=>`Weaken the enemy's attacks by 30% for ${4+n}s.`,n=>n.mouth,"a mouth"),un("lick","Lick Wounds","\u{1F497}",["life"],0,14,n=>`Heal ${we(.11+.04*n)} health.`),un("spit","Venom Spit","\u{1F9EA}",["poison"],0,10,n=>`Poison the enemy for ${we(.22+.08*n)} of your attack every second, for 6s.`,n=>n.venom,"a stinger, mandibles or feelers"),un("dive","Dive","\u{1F985}",["crit","speed"],0,11,n=>`Dodge everything for ${Wt(1.5+.5*n)}s; your next hit is critical.`,n=>n.wings,"wings"),un("constrict","Constrict","\u{1F40D}",["stun"],0,12,n=>`Squeeze for ${we(.8+.3*n)} attack and stun for ${Wt(1.3+.3*n)}s.`,n=>n.serpent||n.tentacles>=2,"a serpent body or tentacles"),un("web","Web","\u{1F578}\uFE0F",["speed","stun"],0,12,n=>`Slow the enemy's attacks by half for ${4+n}s.`,n=>n.type==="arachnid"||n.type==="insectoid","an arachnid or insectoid body"),un("ink","Ink Cloud","\u{1F32B}\uFE0F",["speed"],0,12,n=>`Blind the enemy for ${3+n}s: most of its attacks miss.`,n=>n.type==="cephalopod"||n.type==="aquatic","a cephalopod or aquatic body"),un("shellup","Shell Up","\u{1F422}",["guard","thorns"],0,13,n=>`Take 70% less damage for ${3+n}s and double what attackers take back.`,n=>n.armoured,"a shell, plates or tough hide"),un("sweep","Tail Sweep","\u{1F98E}",["stun"],0,8,n=>`Hit for ${we(1+.25*n)} attack and knock the enemy's next attack back.`,n=>n.tail,"a tail"),un("gore","Gore","\u{1F402}",["bleed"],0,10,n=>`Hit for ${we(1.2+.2*n)} attack and add ${2+n} bleed.`,n=>n.horns,"horns or tusks"),un("frenzy","Frenzy","\u{1F624}",["speed","fury"],300,13,n=>`Attack ${we(.5+.2*n)} faster for 4s.`),un("hurl","Hurl Weapon","\u{1F3F9}",["weapon","crit"],300,10,n=>`Throw for ${we(1.6+.3*n)} attack. Cannot miss.`,n=>n.hands>=1,"a hand"),un("rend","Rend","\u{1F405}",["bleed"],350,9,n=>`Tear for ${we(.6)} attack, plus ${we(.35+.1*n)} for each bleed on the enemy.`,n=>n.claws,"claws, talons or paws"),un("breath","Fire Breath","\u{1F432}",["burn"],400,11,n=>`Burn for ${we(.8+.2*n)} attack and set the enemy alight for 5s.`,n=>n.mouth,"a mouth")],tv=Object.fromEntries(Ss.map(n=>[n.id+(n.cat==="ability"?"!":""),n])),Jn=(n,e)=>tv[n+(e==="ability"?"!":"")],df=["Common","Rare","Epic"],Lh=["humanoid","quadruped","avian"],mr={insectoid:400,arachnid:500,cephalopod:600,serpent:300,aquatic:300},ia={eye_glow:100,eye_stalk:100,eye_compound:100,mandibles:150,maw:150,trunk:150,tusk:150,horn_ram:200,antler:200,antenna_feather:80,ear_fin:80,arm_pincer:250,tentacle:300,leg_insect:150,wing_bat:300,wing_insect:200,tail_club:250,tail_stinger:300,ridge_sail:150,ridge_plates:200,shell:300},ff=[{id:"vital",name:"Vitality",icon:"\u2764\uFE0F",max:5,cost:n=>150+100*n,text:"+5% health for every creature, per level."},{id:"fero",name:"Ferocity",icon:"\u{1F4A2}",max:5,cost:n=>150+100*n,text:"+4% attack for every creature, per level."},{id:"recov",name:"Recovery",icon:"\u26FA",max:5,cost:n=>120+80*n,text:"+4% more health restored between fights, per level."},{id:"reroll",name:"Fickle Crowd",icon:"\u{1F3B2}",max:3,cost:n=>250+150*n,text:"+1 reroll of the rewards per gauntlet, per level."},{id:"stable",name:"Bigger Stable",icon:"\u26A1",max:2,cost:n=>600+400*n,text:"+1 to the most runs you can hold, per level."},{id:"head",name:"Head Start",icon:"\u{1F381}",max:1,cost:()=>800,text:"Choose a reward before the first fight."},{id:"revive",name:"Revive",icon:"\u2728",max:3,cost:()=>500,text:"Brings a dead creature back once, mid-gauntlet, at half health. Used up when spent. Hold up to three.",consumable:!0}],Dh=()=>({points:0,champions:0,fallen:0,unlocked:{},boosts:{},revives:0,runs:null,level:0,levelSel:0,stats:{},seen:{},typesWon:{},goals:{},hall:[],daily:null}),nv=5,Ih=1800*1e3,iv=n=>nv+(n.boosts.stable||0);function Ji(n,e=Date.now()){let t=iv(n);n.runs||(n.runs={n:t,t:e});let i=n.runs;for(i.t>e&&(i.t=e);i.n<t&&e-i.t>=Ih;)i.n++,i.t+=Ih;return i.n>=t&&(i.t=e),{n:i.n,max:t,next:i.n>=t?0:Ih-(e-i.t)}}function pf(n,e=Date.now()){let t=Ji(n,e);return t.n<=0?!1:(t.n>=t.max&&(n.runs.t=e),n.runs.n--,!0)}function Xo(n,e=Date.now()){let t=Ji(n,e);t.n<t.max&&n.runs.n++}var Yo=n=>{let e=Math.ceil(n/1e3);return Math.floor(e/60)+":"+String(e%60).padStart(2,"0")},Uh=(n,e)=>!!n.unlocked[e],qo=(n,e)=>Lh.includes(e)||Uh(n,"type:"+e),Nh=(n,e)=>!ia[e]||Uh(n,"part:"+e),kh=(n,e)=>!e.cost||Uh(n,"item:"+e.cat+":"+e.id),mf=(n,e=1,t=!1)=>Math.round((15*Math.min(n+1,10)+5*Math.max(0,n-9))*e*(t?1.5:1)),Zo=()=>({weapons:[],relics:[],abilities:[]}),sa=n=>n.weapons.reduce((e,t)=>e+Jn(t.id,"weapon").hands,0),sv=.65;function Fh(n,e){let t={},i=e&&e.hands===0?sv:1;for(let s of[...n.weapons,...n.relics]){let r=Jn(s.id,s.cat||"x").mods(s.q);for(let a in r)t[a]=(t[a]||0)+r[a]*(s.cat==="weapon"&&r[a]>0?i:1)}return t.weapons=n.weapons.length,t}function rv(n){let e={};for(let t of[...n.weapons,...n.relics,...n.abilities])for(let i of Jn(t.id,t.cat).tags)e[i]=(e[i]||0)+1;return e}function gf(n,e,t){return n.req&&!n.req(e)?!1:n.cat==="weapon"?e.slots-sa(t)>=n.hands:n.cat==="ability"?t.abilities.some(i=>i.id===n.id)||t.abilities.length<e.abilitySlots:!0}function _f(n,e,t,i,s,r=3){let a=rv(t),o=[],c=new Set,h=Ss.filter(d=>(!i||kh(i,d))&&gf(d,e,t)),u={weapon:e.slots-sa(t)>=2?.45:.32,relic:.42,ability:.26};for(let d=0;d<r;d++){let p=h.filter(x=>!c.has(x.cat+x.id));if(!p.length)break;let g=p.map(x=>{let C=0;for(let A of x.tags)C+=Math.min(a[A]||0,3);let T=x.cat==="ability"&&t.abilities.some(A=>A.id===x.id);return u[x.cat]/Math.max(1,p.filter(A=>A.cat===x.cat).length)*(1+.9*Math.min(C,5))*(T?1.5:1)}),_=n()*g.reduce((x,C)=>x+C,0),m=0;for(;m<g.length-1&&(_-=g[m])>0;)m++;let f=p[m];c.add(f.cat+f.id);let y=n(),v=y<.05+.015*s?2:y<.28+.035*s?1:0;o.push({id:f.id,cat:f.cat,rar:v,q:Math.round([1,1.5,2.2][v]*(.9+.2*n())*100)/100,syn:f.tags.some(x=>a[x])})}return o}var av=5;function yf(n,e){if(e.cat==="weapon")n.weapons.push({id:e.id,cat:"weapon",q:e.q,rar:e.rar});else if(e.cat==="relic")n.relics.push({id:e.id,cat:"relic",q:e.q,rar:e.rar});else{let t=n.abilities.find(i=>i.id===e.id);t?t.lvl=Math.min(av,t.lvl+1+(e.rar>0?1:0)):n.abilities.push({id:e.id,cat:"ability",lvl:1+e.rar})}}function $o(n){var t;let e=Jn(n.id,n.cat);return n.cat!=="ability"?e.text(n.q):e.text((t=n.lvl)!=null?t:1+n.rar)+` Recharges in ${e.cd}s.`}function xf(n,e,t){let i=Zo(),s=.75+.04*t,r=Ss.filter(o=>o.cat==="relic"&&gf(o,e,i)),a=Ss.filter(o=>o.cat==="weapon");for(let o=0;o<Math.floor(t*.75);o++)i.relics.push({id:r[Math.floor(n()*r.length)].id,cat:"relic",q:s,rar:0});for(let o=0;o<Math.min(e.slots,Math.floor((t+1)/3));o++){let c=a[Math.floor(n()*a.length)];e.slots-sa(i)>=c.hands&&i.weapons.push({id:c.id,cat:"weapon",q:s,rar:0})}return i}var dn=[{name:"Novice",fights:6,tier:0,slope:1,pay:.8},{name:"Bronze",fights:8,tier:0,slope:1,pay:1},{name:"Silver",fights:10,tier:0,slope:1,pay:1.25},{name:"Gold",fights:12,tier:0,slope:.9,pay:1.6},{name:"Platinum",fights:14,tier:0,slope:.84,pay:2},{name:"Diamond",fights:16,tier:1,slope:.78,pay:2.5},{name:"Master",fights:18,tier:1,slope:.74,pay:3.2},{name:"Legend",fights:20,tier:2,slope:.7,pay:4}],vf=(n,e)=>Math.round((100*dn[n].fights+500*Math.min(1,Math.max(0,e)))*dn[n].pay),hf=[{id:"enraged",name:"Enraged",mods:{atkP:.25}},{id:"armoured",name:"Iron-hided",mods:{def:.15}},{id:"swift",name:"Swift",mods:{spdP:.2,dodge:.05}},{id:"giant",name:"Giant",mods:{hpP:.35}},{id:"venomous",name:"Venomous",mods:{poisonC:.4,poisonD:2}},{id:"thorny",name:"Thorned",mods:{thorns:.15}}];function bf(n,e,t){return e>=2&&!t&&n()<Math.min(.5,.28+.01*Math.max(0,e-9))?hf[Math.floor(n()*hf.length)]:null}var uf=n=>{let e=new Date(n);return e.getFullYear()+"-"+(e.getMonth()+1)+"-"+e.getDate()};function Oh(n,e=Date.now()){let t=uf(e),i=n.daily||{day:"",streak:0};if(i.day===t)return null;let s=i.day===uf(e-864e5)?i.streak+1:1;return{today:t,streak:s,points:40+20*Math.min(s-1,6),revive:s%7===0}}function Mf(n,e=Date.now()){let t=Oh(n,e);return t?(n.points+=t.points,t.revive&&(n.revives=Math.min(3,(n.revives||0)+1)),n.daily={day:t.today,streak:t.streak},t):null}var nn=(n,e)=>n.stats&&n.stats[e]||0,na=n=>Object.keys(n||{}).length,Bh=[{id:"first",name:"First blood",text:"Win a fight.",pts:50,prog:n=>[nn(n,"fightsWon"),1]},{id:"glad",name:"Gladiator",text:"Win 25 fights.",pts:150,prog:n=>[nn(n,"fightsWon"),25]},{id:"vet",name:"Veteran",text:"Win 100 fights.",pts:400,prog:n=>[nn(n,"fightsWon"),100]},{id:"legend",name:"Legend of the sands",text:"Win 500 fights.",pts:1500,prog:n=>[nn(n,"fightsWon"),500]},{id:"half",name:"Crowd favourite",text:"Reach the sixth fight of a gauntlet.",pts:100,prog:n=>[nn(n,"bestFight"),6]},{id:"champ",name:"Champion",text:"Win the title.",pts:300,prog:n=>[n.champions||0,1]},{id:"champ3",name:"Dynasty",text:"Win the title three times.",pts:600,prog:n=>[n.champions||0,3]},{id:"types3",name:"Many shapes",text:"Win the title with three different body types.",pts:600,prog:n=>[na(n.typesWon),3]},{id:"types8",name:"Master breeder",text:"Win the title with all eight body types.",pts:2e3,prog:n=>[na(n.typesWon),8]},{id:"silver",name:"Rising star",text:"Win the title on Silver.",pts:400,prog:n=>[nn(n,"bestLevelWon"),3]},{id:"plat",name:"Terror of the pits",text:"Win the title on Platinum.",pts:1e3,prog:n=>[nn(n,"bestLevelWon"),5]},{id:"legend2",name:"Undying",text:"Win the title on Legend.",pts:3e3,prog:n=>[nn(n,"bestLevelWon"),8]},{id:"end10",name:"Into the pit",text:"Win 10 fights in one Endless run.",pts:250,prog:n=>[nn(n,"bestEndless"),10]},{id:"end15",name:"Pit dweller",text:"Win 15 fights in one Endless run.",pts:600,prog:n=>[nn(n,"bestEndless"),15]},{id:"end20",name:"Bottomless",text:"Win 20 fights in one Endless run.",pts:1500,prog:n=>[nn(n,"bestEndless"),20]},{id:"dmg",name:"Heavy hitter",text:"Land a single hit for 100 damage or more.",pts:200,prog:n=>[nn(n,"biggestHit"),100]},{id:"elite",name:"Giant killer",text:"Defeat 10 elite opponents.",pts:250,prog:n=>[nn(n,"elites"),10]},{id:"armed",name:"Armed to the teeth",text:"Hold four weapons at once.",pts:200,prog:n=>[nn(n,"mostWeapons"),4]},{id:"seen20",name:"Collector",text:"Pick 20 different rewards.",pts:150,prog:n=>[na(n.seen),20]},{id:"seen45",name:"Curator",text:"Pick 45 different rewards.",pts:500,prog:n=>[na(n.seen),45]},{id:"flawless",name:"Untouchable",text:"Win a fight without losing any health.",pts:100,prog:n=>[nn(n,"flawless"),1]},{id:"close",name:"By a whisker",text:"Win a fight with less than a tenth of your health left.",pts:100,prog:n=>[nn(n,"closeCalls"),1]},{id:"mourn",name:"Graveyard",text:"Lose five creatures. It happens.",pts:100,prog:n=>[n.fallen||0,5]},{id:"streak7",name:"Regular",text:"Collect the daily gift seven days running.",pts:300,prog:n=>[n.daily&&n.daily.streak||0,7]},{id:"shop10",name:"Big spender",text:"Unlock ten things in the shop.",pts:150,prog:n=>[na(n.unlocked),10]}],Jo=(n,e)=>{let[t,i]=e.prog(n);return t>=i},Sf=n=>Bh.filter(e=>Jo(n,e)&&!(n.goals&&n.goals[e.id])).length;var ov=["eye_round","eye_cat","eye_goat","eye_glow","eye_beady","eye_compound","eye_stalk"],lv=["muzzle","beak","mandibles","maw","feelers","muzzle"],cv=["horn_spike","horn_curved","horn_ram","antler","antenna","antenna_feather","crest"],hv=["tail_thin","tail_thick","tail_fluffy","tail_tuft","tail_club","tail_stinger","tail_fan"],uv=["ridge_spikes","ridge_plates","ridge_sail","ridge_mane","shell"],dv=["ear_point","ear_round","ear_long","ear_floppy","ear_fin"],fv=["wing_feather","wing_bat","wing_insect"],pv=["human","paw","hoof","talon","webbed","stump","point"],mv=["human","claw","pincer","mitt"],gv=["skin","fur","scales","chitin","slime"],_v=["Vor","Gra","Zul","Kra","Thu","Mog","Sha","Bru","Nyx","Ora","Ska","Dre","Hul","Fen","Ryz","Um","Qua","Ix","Bel","Tar"],yv=["gath","nak","tor","ra","lix","mok","thos","zar","dun","ska","bor","vex","gul","ris","nor","ix"],xv=["the Cruel","the Hungry","Bonebreaker","the Unblinking","of the Pit","the Swift","Skullsplitter","the Patient","the Loud","Twice-Bitten","the Scarred","Sandstrider","the Vile","Crowd-Pleaser","the Last"];function vv(n,e){let t=i=>i[Math.floor(n()*i.length)];return t(_v)+t(yv)+(e?" "+t(xv):"")}function ra(n,e={}){let t=_=>_[Math.floor(n()*_.length)],i=(_,m)=>_+(m-_)*n(),s=(_,m,f)=>"#"+new ke().setHSL((_%1+1)%1,m,f).getHexString(),r=e.type||t(Object.keys(At)),a=Ms(r);a.name=vv(n,e.titled),a.sex=n()<.5?"m":"f",a.bulk=i(.82,1.3),a.dimorph=i(.4,1.2);for(let _ of a.nodes){let m=_.role==="neck"||_.role==="waist"?i(.9,1.15):i(.82,1.28);_.rx*=m,_.ry*=m*i(.92,1.08)}let o=n(),c=a.look;Object.assign(c,{base:s(o,i(.25,.8),i(.25,.62)),second:s(o+i(-.25,.25),i(.35,.8),i(.1,.4)),belly:s(o+.04,i(.15,.4),i(.7,.88)),hair:s(o+i(0,.5),.5,i(.15,.5)),membrane:s(o+i(-.1,.1),.45,i(.45,.7)),eye:s(n(),.8,.47),accent:n()<.7?s(.11,.3,i(.75,.9)):s(o,.2,.12),pattern:Math.floor(n()*8),patScale:i(.7,2),bellyAmt:i(.3,.9)}),n()<.5&&(c.cover=t(gv),c.furLen=i(.1,.55),c.furDroop=i(.1,.7));let h=(_,m)=>{let f=It[_.kind],y=It[m];f.size&&y.size&&(_.size*=y.size/f.size),_.kind=m,_.p=Fo(m)},l=Oo(a,{sexless:!0}).userData.frames,u=_=>a.parts.some(m=>It[m.kind].cat===_),d=t(ov),p=t(lv);for(let _ of a.parts){let m=It[_.kind];m.cat==="eyes"&&n()<.55?h(_,d):m.cat==="mouth"&&m.slot==="mouth"&&n()<.55?h(_,p):m.cat==="limbs"&&_.p.endType!==void 0&&(n()<.4&&(_.p.endType=t(_.kind.startsWith("arm")?mv:pv)),_.p.thick*=i(.85,1.35),_.p.muscle=i(.9,1.35))}u("mouth")||ui(a,p,l);let g=(_,m,f)=>{if(n()<_&&!(f&&u(f)))return ui(a,t(m),l)};g(.5,cv),g(.45,hv,"tails"),g(.45,uv,"back"),g(.2,fv,"wings"),g(.3,dv,"ears"),n()<.2&&ui(a,"tusk",l),n()<.15&&ui(a,"spike",l);for(let _ of a.parts){let m=It[_.kind];if(_.size*=i(.88,1.2),!(m.cat==="limbs"||m.cat==="eyes"))for(let[f,y]of Object.entries(m.P||{}))["count","feathers","tines","lift","sweep","span"].includes(f)||(_.p[f]=_.p[f]+(i(y[0],y[1])-_.p[f])*.3)}return a}var Af=["z","y","x","pitch","yaw","roll","sy","gait","legF","legH","legOut","armAll","arm","armOut","tent","wing","flap","tailYaw","tailUp","wag"],zh=()=>{let n={};for(let e of Af)n[e]=0;return n.sy=1,n.wag=1,n},wf=n=>n*n*(3-2*n),bv=n=>1-(1-n)*(1-n)*(1-n),Ef=n=>Math.min(1,Math.max(0,n)),Tf={lunge:{wind:{z:-.3,pitch:-.16,legF:.25,sy:.94},hit:{z:.9,pitch:.22,legF:-.6,legH:.35,tailUp:.3}},bite:{wind:{z:-.3,pitch:-.22,legF:.25,tailUp:.2},hit:{z:.95,pitch:.3,legF:-.55,legH:.35,tailUp:.4}},slash:{wind:{z:-.12,pitch:-.2,arm:-2.8,yaw:-.35,legF:.2},hit:{z:.7,pitch:.2,arm:-.45,yaw:.4,legH:.3}},swipe:{wind:{pitch:-.5,y:.12,legF:-1.3,z:-.1,tailUp:-.2},hit:{z:.65,pitch:.2,legF:-.15,legH:.35}},charge:{wind:{z:-.65,pitch:.14,legF:.35,legH:-.25,sy:.92},hit:{z:1.2,pitch:.3,legF:-.5,legH:.5},run:!0},swoop:{wind:{y:1.15,z:-.35,pitch:-.3,flap:1,wing:.35,legF:-.4,legH:-.4},hit:{y:.05,z:1,pitch:.45,wing:.6,legF:-.9,legH:-.5}},lash:{wind:{z:-.15,tent:.55,pitch:-.12,sy:1.06},hit:{z:.6,tent:-1.35,pitch:.14,sy:.95}},tail:{wind:{yaw:-.7,tailYaw:.6,z:-.1,sy:.95},hit:{yaw:Math.PI*2,tailYaw:-.5,z:.55,tailUp:.25},spin:!0},sting:{wind:{pitch:.12,tailUp:.5,z:-.15,sy:.95},hit:{pitch:.3,tailUp:1.5,z:.7}},pounce:{wind:{z:-.45,pitch:-.32,sy:.82,legF:.3,legH:-.3},hit:{z:1.05,pitch:.32,legF:-.9,legH:.6},arc:.95,slow:!0},roar:{wind:{pitch:-.4,wing:.7,armAll:-1.2,armOut:.6,tailUp:.4,sy:1.06},hit:{pitch:-.2,wing:.9,armAll:-1.6,armOut:.9,z:.15,sy:1.1}}};function Rf(n){let e=[],t=new qe().makeScale(-1,1,1),i=n.frames.C,s=(i[0].z+i[i.length-1].z)/2,r=0;n.group.traverse(o=>{let c=o.userData.joint;c&&(o.matrixAutoUpdate=!1,e.push({node:o,...c,front:c.pivot.z>=s-.02,ph:e.length*2.399%6.283,idx:c.kind==="arm"?r++:0,a:new _n,q:new qt}))});let a=new Set(e.map(o=>o.kind));return{cr:n,joints:e,S:t,kinds:a,arms:r,cur:zh(),t:0,gaitPh:0,flapPh:0,tmp:new qe,tmp2:new qe}}function Hh(n,e,t,i){var l,u;let s=Tf[n]||Tf.lunge,r={},a=i?1.3:1,o=s.slow?.2:.11,c=.55,h=new Set([...Object.keys(s.wind),...Object.keys(s.hit)]);for(let d of h){let p=d==="sy"?1:0,g=(l=s.wind[d])!=null?l:p,_=(u=s.hit[d])!=null?u:p,m;if(t<0)m=p+(g-p)*wf(Ef(e));else if(t<o)m=g+(_-g)*bv(t/o);else{let f=wf(Ef((t-o)/(c-o)));m=_+((s.spin&&d==="yaw"?_:p)-_)*f}r[d]=p+(m-p)*(d==="yaw"||d==="arm"||d==="sy"?1:a)}return s.arc&&t>=0&&t<o&&(r.y=(r.y||0)+Math.sin(t/o*Math.PI)*s.arc),s.run&&t>=0&&t<o+.1&&(r.gait=1.5),r}var Cf=.55;function Pf(n,e,t,i,s){var l;let r=n.cur,a=s?1:Math.min(1,t*26);for(let u of Af)r[u]+=(((l=e[u])!=null?l:u==="sy"||u==="wag"?1:0)-r[u])*(u==="yaw"&&Math.abs((e.yaw||0)-r.yaw)>3?1:a);n.t+=t,n.gaitPh+=t*(7+5*Math.min(r.gait,1.5)),n.flapPh+=t*(5+16*Math.min(Math.abs(r.flap),1));let o=Math.abs(Math.sin(r.pitch))*(n.len||0)*.42;i.position.set(r.x,r.y+o,r.z-(n.len||0)/2),i.rotation.set(r.pitch,r.yaw,r.roll),i.scale.set(1+(1-r.sy)*.5,r.sy,1+(1-r.sy)*.5);let c=n.t,h=n.cr.M.U.uPM.value;for(let u of n.joints){let d=0,p=0,g=0,_=u.side>0?0:Math.PI;u.kind==="leg"?(d=r.gait*.55*Math.sin(n.gaitPh+_+(u.front?0:Math.PI))+(u.front?r.legF:r.legH),g=r.legOut):u.kind==="arm"?(d=r.armAll+(u.idx===n.armSel||n.armSel<0?r.arm:r.arm*.25)+.07*Math.sin(c*1.6+u.ph)-r.gait*.4*Math.sin(n.gaitPh+_),g=r.armOut+.03*Math.sin(c*1.3+u.ph)):u.kind==="tentacle"?(d=r.tent*(.55+.45*Math.sin(u.ph*3))+.13*Math.sin(c*1.7+u.ph)+r.gait*.3*Math.sin(n.gaitPh+u.ph),g=.1*Math.sin(c*1.3+u.ph*2)+r.legOut*.6):u.kind==="wing"?(g=r.wing+(.07+.6*r.flap)*Math.sin(n.flapPh),d=.04*Math.sin(c*1.1)):(p=r.tailYaw+.2*r.wag*Math.sin(c*2.4+u.ph),d=r.tailUp+.05*Math.sin(c*1.9)),u.a.set(d,p,g),u.q.setFromEuler(u.a);let m=u.pivot;u.node.matrix.makeRotationFromQuaternion(u.q);let f=u.node.matrix.elements,y=m.x,v=m.y,x=m.z;f[12]=y-(f[0]*y+f[4]*v+f[8]*x),f[13]=v-(f[1]*y+f[5]*v+f[9]*x),f[14]=x-(f[2]*y+f[6]*v+f[10]*x),u.node.matrixWorldNeedsUpdate=!0,u.bone&&(u.side>0?h[u.bone].copy(u.node.matrix):h[u.bone].copy(n.S).multiply(u.node.matrix).multiply(n.S))}}function Vh(n){for(let e of n.U.uPM.value)e.identity()}function If(n,e){let t=new ht,i=new Float32Array(e*3),s=new Float32Array(e*4),r=new Float32Array(e);t.setAttribute("position",new vt(i,3)),t.setAttribute("col",new vt(s,4)),t.setAttribute("size",new vt(r,1));let a=new Nn({transparent:!0,depthWrite:!1,blending:n,uniforms:{uScale:{value:400}},vertexShader:`attribute vec4 col; attribute float size; varying vec4 vCol; uniform float uScale;
void main(){ vCol = col; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying vec4 vCol;
void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; float a = smoothstep(1.0, 0.35, d) * vCol.a; if (a < 0.01) discard; gl_FragColor = vec4(vCol.rgb, a); }`}),o=new po(t,a);return o.frustumCulled=!1,o.renderOrder=5,{pts:o,pos:i,col:s,size:r,cap:e,parts:[],geo:t,mat:a}}function Df(n){let e=If(Fr,500),t=If(Gi,400);n.add(e.pts,t.pts);let i=[],s=new _o(.85,1,40),r=new ke;return{burst(o,c,h,l={}){var p,g,_,m;let u=Lf[o]||Lf.spark,d=u.add?e:t;for(let f=0;f<h;f++){d.parts.length>=d.cap&&d.parts.shift();let y=Math.random()*6.283,v=Math.random(),x=u.speed*(.4+Math.random()*.8)*(l.speed||1),C=l.dir||null;r.set(u.colors[Math.floor(Math.random()*u.colors.length)]),d.parts.push({x:c.x+(Math.random()-.5)*((p=l.spread)!=null?p:u.spread),y:c.y+(Math.random()-.5)*((g=l.spread)!=null?g:u.spread),z:c.z+(Math.random()-.5)*((_=l.spread)!=null?_:u.spread),vx:Math.cos(y)*x*(1-v*.5)+(C?C.x*x*1.5:0),vy:(v*u.up+(Math.random()-.3)*.5)*x+(C?C.y*x:0),vz:Math.sin(y)*x*(1-v*.5)+(C?C.z*x*1.5:0),g:u.grav,drag:u.drag,life:0,max:u.life*(.6+Math.random()*.7),s:u.size*(.6+Math.random()*.8)*(l.size||1),grow:u.grow||0,r:r.r,gr:r.g,b:r.b,a:(m=u.alpha)!=null?m:1})}},ring(o,c,h=1.6,l=!0){let u=new ze(s,new Ht({color:c,transparent:!0,depthWrite:!1,side:Pt,blending:Fr}));u.position.copy(o),l&&(u.rotation.x=-Math.PI/2),u.userData={t:0,size:h},n.add(u),i.push(u)},update(o){for(let c of[e,t]){let h=c.parts,l=0;for(let u=0;u<h.length;u++){let d=h[u];if(d.life+=o,d.life>=d.max)continue;d.vy-=d.g*o;let p=Math.max(0,1-d.drag*o);d.vx*=p,d.vy*=p,d.vz*=p,d.x+=d.vx*o,d.y+=d.vy*o,d.z+=d.vz*o,d.y<.02&&d.g>0&&(d.y=.02,d.vy*=-.3,d.vx*=.6,d.vz*=.6);let g=d.life/d.max;c.pos[l*3]=d.x,c.pos[l*3+1]=d.y,c.pos[l*3+2]=d.z,c.col[l*4]=d.r,c.col[l*4+1]=d.gr,c.col[l*4+2]=d.b,c.col[l*4+3]=d.a*(1-g*g),c.size[l]=d.s*(1+d.grow*g),h[l++]=d}h.length=l,c.geo.setDrawRange(0,l),c.geo.attributes.position.needsUpdate=c.geo.attributes.col.needsUpdate=c.geo.attributes.size.needsUpdate=!0}for(let c=i.length-1;c>=0;c--){let h=i[c];h.userData.t+=o;let l=h.userData.t/.45;if(l>=1){n.remove(h),h.material.dispose(),i.splice(c,1);continue}h.scale.setScalar(.2+h.userData.size*(1-(1-l)*(1-l))),h.material.opacity=(1-l)*.8}},resize(o){e.mat.uniforms.uScale.value=t.mat.uniforms.uScale.value=o*.9},clear(){e.parts.length=t.parts.length=0;for(let o of i)n.remove(o),o.material.dispose();i.length=0}}}var Lf={spark:{add:!0,colors:["#fff2a0","#ffd060","#ffffff"],speed:4.5,up:.8,grav:9,drag:1.5,life:.45,size:.09,spread:.1},dust:{colors:["#d9bb84","#c9a56a","#e9d2a4"],speed:1.3,up:.6,grav:-.3,drag:2.5,life:.9,size:.3,spread:.3,grow:1.6,alpha:.5},blood:{colors:["#b01818","#d83030","#7a0c0c"],speed:2.6,up:.9,grav:9,drag:.6,life:.7,size:.085,spread:.12},venom:{colors:["#8fe04a","#5ab82a","#c8ff7a"],speed:.9,up:1.4,grav:-1.2,drag:1.5,life:.9,size:.1,spread:.5,alpha:.85},fire:{add:!0,colors:["#ff8a20","#ffc040","#ff4a10"],speed:.8,up:2,grav:-3,drag:1.2,life:.55,size:.2,spread:.5,grow:-.6},heal:{add:!0,colors:["#7affb0","#c8ffd8","#40e090"],speed:.6,up:2.2,grav:-2,drag:1,life:.9,size:.11,spread:.8},star:{add:!0,colors:["#fff07a","#ffffff"],speed:1.6,up:.5,grav:0,drag:2,life:.6,size:.12,spread:.3},magic:{add:!0,colors:["#c89aff","#8a5aff","#ffffff"],speed:2.2,up:.8,grav:0,drag:2.5,life:.6,size:.13,spread:.3},ink:{colors:["#14101c","#2a2438","#0a0810"],speed:1.4,up:.5,grav:-.2,drag:2,life:1.5,size:.5,spread:.6,grow:1.2,alpha:.75},web:{colors:["#ffffff","#e8eef2"],speed:2.4,up:.3,grav:1,drag:3,life:1.1,size:.07,spread:.7},shield:{add:!0,colors:["#7fd0ff","#ffffff","#4aa0ff"],speed:2.5,up:.4,grav:0,drag:3,life:.35,size:.12,spread:.5}};var gr=(n,e,t)=>Math.min(t,Math.max(e,n));function Gh(n,e,t){let i=document.createElement("canvas");i.width=n,i.height=e,t(i.getContext("2d"),n,e);let s=new li(i);return s.colorSpace=zt,s}function Sv(){let n=new Tt,e=12,t=Gh(256,256,(m,f,y)=>{m.fillStyle="#d2a45c",m.fillRect(0,0,f,y);for(let x=0;x<5e3;x++)m.fillStyle=`rgba(${Math.random()<.5?"90,60,30":"255,235,190"},${Math.random()*.12})`,m.fillRect(Math.random()*f,Math.random()*y,1+Math.random()*3,1+Math.random()*2);let v=m.createRadialGradient(f/2,y/2,f*.1,f/2,y/2,f/2);v.addColorStop(0,"rgba(255,240,200,0.25)"),v.addColorStop(1,"rgba(60,35,15,0.45)"),m.fillStyle=v,m.fillRect(0,0,f,y)}),i=new ze(new nr(e,64),new Nt({map:t,roughness:1}));i.rotation.x=-Math.PI/2,i.receiveShadow=!0,n.add(i);let s=new Nt({color:9402204,roughness:.95,side:Pt}),r=new Nt({color:7167308,roughness:1,side:Pt}),a=[new Re(e,0),new Re(e,1.5)];for(let m=0;m<6;m++)a.push(new Re(e+.5+m*1.15,1.5+m*.8),new Re(e+.5+(m+1)*1.15,1.5+m*.8),new Re(e+.5+(m+1)*1.15,1.5+(m+1)*.8));a.push(new Re(e+8,8.5)),n.add(new ze(new mo(a,72),s));let o=new ze(new yn(e,.14,6,72),r);o.rotation.x=Math.PI/2,o.position.y=1.5,n.add(o);let c=900,h=new Wr(new on(.2,6,5),new Nt({roughness:.9}),c),l=new qe,u=new ke,d=[];for(let m=0;m<c;m++){let f=Math.floor(Math.random()*6),y=Math.random()*Math.PI*2,v=e+1.05+f*1.15+(Math.random()-.5)*.4;d.push({x:Math.cos(y)*v,y:1.5+f*.8+.3,z:Math.sin(y)*v,ph:Math.random()*6.28}),h.setColorAt(m,u.setHSL(Math.random(),.3+Math.random()*.5,.25+Math.random()*.35))}n.add(h);for(let m=0;m<24;m++){let f=m/24*Math.PI*2,y=e+7.7,v=new ze(new Zn(.3,.36,3.4,10),s);v.position.set(Math.cos(f)*y,8.2,Math.sin(f)*y),n.add(v)}let p=new ze(new yn(e+7.7,.32,6,72),s);p.rotation.x=Math.PI/2,p.position.y=10,n.add(p);let g=new Nt({color:2759698,roughness:1});for(let m of[-1,1]){let f=new ze(new Ai(1.6,1.25),g);f.position.set(m*(e-.02),.62,0),f.rotation.y=-m*Math.PI/2,n.add(f)}for(let m=0;m<10;m++){let f=m/10*Math.PI*2+.3,y=new ze(new Ai(.7,1),new Nt({color:m%2?10099740:14262304,roughness:.8,side:Pt}));y.position.set(Math.cos(f)*(e-.03),.9,Math.sin(f)*(e-.03)),y.lookAt(0,.9,0),n.add(y)}let _=Gh(4,256,m=>{let f=m.createLinearGradient(0,0,0,256);f.addColorStop(0,"#2f5fa8"),f.addColorStop(.45,"#7fa6d0"),f.addColorStop(1,"#e9c79a"),m.fillStyle=f,m.fillRect(0,0,4,256)});return{g:n,crowd:h,seats:d,m4:l,sky:_}}function wv(n){let e=new Tt,t=(c,h=.5,l)=>new Nt({color:c,roughness:h,metalness:c===10134701?.7:0,emissive:l||0}),i=(c,h,l,u,d,p)=>{let g=new ze(c,h);return g.position.set(l||0,u||0,d||0),p&&(g.rotation.z=p),e.add(g),g},s=t(7031342,.8),r=t(10134701,.35),a=t(15261900,.6),o=(c=1)=>i(new Zn(.035,.045,c,8),s,0,c/2);if(n==="club")i(new Zn(.13,.04,1,10),a,0,.5),i(new on(.14,10,8),a,0,1);else if(n==="cleaver")o(.6),i(new qn(.34,.5,.03),r,.14,.78);else if(n==="fang")o(.3),i(new Ri(.07,.6,8),a,0,.6);else if(n==="mace"){o(.85),i(new go(.17,0),r,0,.95);for(let c=0;c<6;c++)i(new Ri(.04,.16,5),r,Math.cos(c)*.2,.95+Math.sin(c*2)*.12,Math.sin(c)*.2,-Math.cos(c)*1.57)}else if(n==="buckler"){let c=i(new Zn(.42,.42,.06,20),r,0,.3,.1);c.rotation.x=Math.PI/2;let h=i(new Ri(.08,.25,8),a,0,.3,.25);h.rotation.x=Math.PI/2}else if(n==="sling")i(new yn(.2,.02,5,14),s,0,.3),i(new on(.09,8,6),t(9079430,.9),0,.1);else if(n==="brand")o(.8),i(new Ri(.13,.42,8),t(16747040,.4,16734720),0,1);else if(n==="pick"){o(.95);let c=i(new Ri(.06,.6,6),r,0,.9);c.rotation.z=Math.PI/2}else if(n==="hooks")o(.6),i(new yn(.16,.03,6,12,Math.PI*1.2),r,.16,.62);else if(n==="whip")o(.3),i(new yn(.3,.022,5,16,Math.PI*1.4),t(8002588,.7),.3,.35);else if(n==="maul")i(new Zn(.045,.055,1.4,8),s,0,.7),i(new qn(.5,.32,.32),r,0,1.4);else{o(1.2);for(let c of[-.13,0,.13])i(new Ri(.035,.4,6),r,c,1.35-Math.abs(c)*.6);i(new qn(.3,.04,.04),r,0,1.15)}return e}var _r=null;function Pn(n){try{_r=_r||new(window.AudioContext||window.webkitAudioContext);let e=_r.currentTime,t=_r.createOscillator(),i=_r.createGain(),[s,r,a,o,c]={hit:[150,50,.14,"triangle",.5],power:[220,40,.3,"sawtooth",.5],block:[700,500,.09,"square",.2],miss:[500,800,.1,"sine",.12],win:[440,880,.6,"triangle",.35],lose:[200,60,.9,"sawtooth",.3]}[n];t.type=o,t.frequency.setValueAtTime(s,e),t.frequency.exponentialRampToValueAtTime(r,e+a),i.gain.setValueAtTime(c,e),i.gain.exponentialRampToValueAtTime(.001,e+a),t.connect(i).connect(_r.destination),t.start(e),t.stop(e+a+.02)}catch{}}function Uf(n){let{scene:e,camera:t,h:i,store:s}=n,r=Sv();r.g.visible=!1,e.add(r.g);let a=Df(r.g),o=Lo(),c=Gh(64,64,M=>{let U=M.createRadialGradient(32,32,2,32,32,32);U.addColorStop(0,"rgba(0,0,0,0.6)"),U.addColorStop(1,"rgba(0,0,0,0)"),M.fillStyle=U,M.fillRect(0,0,64,64)}),h=document.getElementById("battle"),l={active:!1,phase:"off",run:null,data:null,views:[null,null],F:null,t:0,phaseT:0,enemy:null,shake:0,cheer:0,rand:Math.random,confetti:null,queue:[],eLoad:null,auto:!1,freeze:0,slow:0,punch:0,entered:!1},u=null,d={Pounce:"pounce","Tail Sweep":"tail",Gore:"charge",Hurl:"slash",Rend:"slash",Constrict:"lash","Fire Breath":"roar",Sling:"slash"};function p(M,U,N,X,j){ci(U,M.look,At[M.type].bellyDir),Vh(U);let Z=[],se=dr(M,U,{anchors:Z,animated:!0}),P=ea(se),Fe=P.getSize(new L),Se=pr(M),he=gr(1.9/Math.max(Fe.y,Fe.z*.85,Fe.x*.55,.6),.5,2.4)*(.85+.35*gr(Math.cbrt(Se.hp/200),.6,1.4)),_e=M.type==="aquatic"?.45:0;se.group.scale.setScalar(he),se.group.position.set(-(P.min.x+P.max.x)/2*he,-P.min.y*he+_e,-P.max.z*he+Fe.z*he/2);let it=0;for(let Q of X?X.weapons:[]){let Ee=Z[it];if(it+=Jn(Q.id,"weapon").hands,!Ee)continue;let pe=wv(Q.id),Me=gr(Fe.y*.3,.22,.6);pe.scale.setScalar(Me),pe.position.copy(Ee.p).addScaledVector(Ee.t,Ee.r*2.2),pe.quaternion.setFromUnitVectors(new L(0,1,0),Ee.t.clone().multiplyScalar(.25).add(new L(.2,.5,.85)).normalize()),pe.traverse(je=>{je.castShadow=!0}),Ee.node.add(pe)}let Ne=new Tt,R=new Tt;Ne.add(se.group),R.add(Ne);let w=new ze(new Ai(1,1),new Ht({map:c,transparent:!0,depthWrite:!1,opacity:.45}));w.rotation.x=-Math.PI/2,w.position.set(0,.012,-Fe.z*he/2),w.scale.set(Math.max(Fe.x*he,.6)*1.2,Fe.z*he*1.1,1),R.add(w),R.position.x=N*(.75+(j||0)),R.rotation.y=N<0?Math.PI/2:-Math.PI/2,r.g.add(R);let B=Rf(se),ne=new Set(M.parts.map(Q=>Q.kind)),ee=[];return B.arms>0?ee.push("slash"):Se.claws&&Se.legs>=4&&ee.push("swipe"),Se.mouth&&ee.push("bite"),Se.horns&&ee.push("charge"),Se.wings&&ee.push("swoop"),Se.tentacles>=2&&ee.push("lash"),["tail_club","tail_thick","tail_fluke","tail_fish"].some(Q=>ne.has(Q))&&ee.push("tail"),ne.has("tail_stinger")&&ee.push("sting"),ee.length||ee.push("lunge"),B.armSel=-1,B.len=Fe.z*he,{cr:se,mats:U,pose:Ne,holder:R,side:N,rig:B,styles:ee,style:ee[0],styleN:0,hover:_e,st:Se,walk:j||0,half:Fe.x*he/2,len:Fe.z*he,head:new L(0,Fe.y*he+_e+.15,-Fe.z*he*.3),mid:new L(0,Fe.y*he*.55+_e,-Fe.z*he*.2),front:new L(0,Fe.y*he*.5+_e,.1),strikeT:-1,winding:!1,power:!1,recoil:0,flash:0,dead:-1,dodge:-1,fxT:0,thud:!1,ph:Math.random()*6}}let g=(M,U)=>M.holder.localToWorld(U.clone());function _(M){let U=l.views[M];if(!U)return;r.g.remove(U.holder);let N=new Set([...Object.values(U.mats).filter(X=>X&&X.isMaterial),...U.mats.shells,...U.mats.eyeCache.values()]);U.holder.traverse(X=>{X.isMesh&&(X.geometry.dispose(),N.has(X.material)||X.material.dispose())}),l.views[M]=null}let m=M=>[...M.weapons,...M.abilities,...M.relics].map(U=>Jn(U.id,U.cat).icon).join("");function f(M,U){let N=U.clone();return M.holder.localToWorld(N),N.project(t),[(N.x*.5+.5)*innerWidth,(-N.y*.5+.5)*innerHeight]}function y(M,U,N){let X=l.views[M];if(!X)return;let[j,Z]=f(X,X.head),se=i("div",{class:"float "+(N||""),style:`left:${j+(Math.random()-.5)*40}px;top:${Z}px`},U);h.querySelector(".floaters").append(se),setTimeout(()=>se.remove(),1100)}function v(){let M=[l.data.name,l.enemy?l.enemy.name:""],U=N=>X=>{X.preventDefault(),l.phase==="fight"&&N()};h.replaceChildren(i("div",{class:"hud"},i("div",{class:"who l"},i("b",null,M[0]),i("div",{class:"hp"},i("u",{id:"hg0"}),i("i",{id:"hp0"})),i("small",{id:"st0"}),i("div",{class:"kit"},m(l.run.load))),i("div",{class:"round"},i("small",null,C()?"Endless":x().name),i("b",null,l.run.round+1+(C()?"":" / "+T()))),i("div",{class:"who r"},i("b",null,M[1]),i("div",{class:"hp"},i("u",{id:"hg1"}),i("i",{id:"hp1"})),i("small",{id:"st1"}),i("div",{class:"kit"},l.eLoad?m(l.eLoad):""))),i("div",{class:"msg",id:"bmsg"}),i("div",{class:"floaters"}),i("div",{class:"acts"},i("div",null,i("button",{id:"bpow",onpointerdown:U(()=>Th(l.F[0])&&Pn("miss"))},i("i"),i("em",null,"\u2694\uFE0F"),i("span",null,"Power")),i("button",{id:"bgrd",onpointerdown:U(()=>Ah(l.F[0])&&Pn("block"))},i("i"),i("em",null,"\u{1F6E1}\uFE0F"),i("span",null,"Guard"))),i("div",null,l.run.load.abilities.map((N,X)=>i("button",{class:"abil",id:"bab"+X,onpointerdown:U(()=>{Rh(l.F,0,X,l.rand,l.queue)&&Pn("power")})},i("i"),i("em",null,Jn(N.id,"ability").icon),i("span",null,Jn(N.id,"ability").name))))))}let x=()=>{var M;return dn[(M=l.run.level)!=null?M:2]},C=()=>!!l.run.endless,T=()=>C()?1/0:x().fights,A=M=>C()?M%10===9:M===T()-1,I=()=>C()?"":" of "+T();function S(){let M=l.run.sum||{};return i("div",{class:"stats"},...[["Fights won",l.run.round],["Damage dealt",Math.round(M.dealt||0)],["Damage taken",Math.round(M.taken||0)],["Biggest hit",M.big||0],["Critical hits",M.crits||0],["Blocks",M.blocks||0],["Points",l.run.earned||0]].map(([U,N])=>i("div",null,i("small",null,U),i("b",null,String(N)))))}function b(...M){let U=i("div",{class:"panel"},M);return h.append(U),U}function D(M){return i("div",{class:"stats"},...[["Health",M.hp],["Attack",M.atk.toFixed(1)],["Armour",Math.round(M.def*100)+"%"],["Speed",M.spd.toFixed(2)]].map(([U,N])=>i("div",null,i("small",null,U),i("b",null,String(N)))))}function z(){l.phase="gate",h.replaceChildren();let M=pr(l.data),U=of(M),N=n.meta(),X=(se,P)=>i("div",null,i("small",null,se),i("b",null,String(P))),j=(se,P)=>{l.run.level=se,l.run.endless=P,N.levelSel=se,N.endlessSel=P,n.saveMeta(),z()},Z=x();b(i("h2",null,C()?"The Endless Pit":"The Colosseum \xB7 "+Z.name),C()?i("p",null,i("b",null,l.data.name)," fights on for as long as it can. Opponents never stop getting stronger, with a champion every tenth fight. How far can it go?"):i("p",null,i("b",null,l.data.name)," faces "+Z.fights+" fights in a row, each tougher than the last, ending with the reigning champion. Choose a reward after every win."),i("div",{class:"stats"},X("Health",M.hp),X("Attack",M.atk.toFixed(1)),X("Armour",Math.round(M.def*100)+"%"),X("Speed",M.spd.toFixed(2)),X("Hands",M.slots),X("Abilities",M.abilitySlots),X("Revives",N.revives||0)),i("p",{class:"dim"},U.length?"Traits: "+U.join(", ")+". ":"",M.hands?"Each arm or tentacle holds one weapon.":"No hands: it carries one weapon in its jaws, at reduced effect. Add arms or tentacles to wield more."," Its body decides which abilities and relics turn up."),C()?i("p",{class:"warn"},"The pit is an exhibition: when it falls it is carried out alive, and keeps its points."):i("p",{class:"warn"},"Fights are to the death. If it dies with no revive, it is gone for good."),i("div",{class:"ranks"},i("small",null,"Difficulty: harder levels have more fights, tougher opponents and pay more. Win the title to open the next."),i("div",{class:"chips"},dn.map((se,P)=>P<=N.level+1&&i("button",{class:!C()&&P===l.run.level?"on":"",disabled:P>N.level,onclick:()=>j(P,!1)},(P>N.level?"\u{1F512} ":"")+se.name+" \xB7 "+se.fights)),i("button",{class:C()?"on":"",disabled:!N.champions,onclick:()=>j(l.run.level,!0)},(N.champions?"":"\u{1F512} ")+"\u221E Endless"))),i("p",{class:"runs",id:"gruns"}),i("div",{class:"row"},i("button",{onclick:()=>K({type:"back"})},"Back to the workshop"),i("button",{class:"ad",id:"gad",onclick:async se=>{await q(se,"gate")&&(Xo(N),n.saveMeta()),te()}},"\u{1F4FA} Watch an ad: +1 run"),i("button",{class:"go",id:"ggo",onclick:()=>{if(!pf(N)){te();return}n.saveMeta(),l.run.paid=!0,s.set("cc.run",l.run),Pn("block"),H()}},C()?"Enter the pit":"Enter the arena"))).classList.add("wide"),te()}function H(){(n.meta().boosts.head||0)>0&&!l.run.headTaken?(l.run.headTaken=!0,s.set("cc.run",l.run),$("A gift from the crowd","Choose a reward before the first fight.")):oe()}async function q(M,U){let N=M.target.closest(".row"),X=N?[...N.querySelectorAll("button")]:[M.target];X.forEach(Z=>{Z.disabled=!0});let j=await n.showAd();return X.forEach(Z=>{Z.disabled=!1}),!j.ok&&j.why&&n.toast(j.why),j.ok&&l.active&&l.phase===U}function te(){let M=document.getElementById("gruns");if(!M)return;let U=Ji(n.meta());M.textContent="\u26A1 Runs: "+U.n+" / "+U.max+(U.next?" \xB7 next in "+Yo(U.next):"")+(U.n?". Entering uses one.":". None left: wait, or watch an ad."),document.getElementById("ggo").disabled=U.n<=0,document.getElementById("gad").classList.toggle("hidden",U.n>=U.max)}setInterval(()=>{l.phase==="gate"&&te()},1e3);function $(M,U){l.phase="won";let N=pr(l.data),X=l.run.load;l.run.draft||(l.run.draft=_f(Math.random,N,X,n.meta(),Math.min(l.run.round,12)),s.set("cc.run",l.run)),h.replaceChildren(i("div",{class:"floaters"}));let j=P=>{yf(X,P),n.meta().seen[P.cat+":"+P.id]=1,n.stat("mostWeapons",X.weapons.length,!0),n.saveMeta(),l.run.draft=null,s.set("cc.run",l.run),Pn("block"),oe()},Z=P=>{let Fe=Jn(P.id,P.cat),Se=P.cat==="ability"&&X.abilities.find(_e=>_e.id===P.id),he=P.cat==="ability"?{...P,lvl:Se?Se.lvl+1+(P.rar>0?1:0):1+P.rar}:P;return i("button",{class:"reward r"+P.rar+" c-"+P.cat,onclick:()=>j(P)},i("small",null,df[P.rar]+" "+(P.cat==="relic"?"relic":P.cat)+(Se?" \xB7 level up":"")),i("div",{class:"ico"},Fe.icon),i("b",null,Fe.name),i("p",null,$o(he)),P.syn&&i("em",null,"Synergy: "+Fe.tags.filter(_e=>[...X.weapons,...X.relics,...X.abilities].some(it=>Jn(it.id,it.cat).tags.includes(_e))).join(", ")))};b(i("h2",null,M),i("p",null,U),i("div",{class:"rewards"},l.run.draft.length?l.run.draft.map(Z):i("p",{class:"dim"},"Nothing more fits this body.")),i("p",{class:"dim"},"Hands "+sa(X)+"/"+N.slots+" \xB7 Abilities "+X.abilities.length+"/"+N.abilitySlots+" \xB7 Relics "+X.relics.length+(m(X)?"   "+m(X):"")),i("div",{class:"row"},l.run.lastPts>0&&i("button",{class:"ad",onclick:async P=>{if(!await q(P,"won")||!(l.run.lastPts>0))return;let Fe=n.meta();Fe.points+=l.run.lastPts,l.run.earned+=l.run.lastPts,n.saveMeta(),n.toast("Doubled: +"+l.run.lastPts+" points"),l.run.lastPts=0,s.set("cc.run",l.run),P.target.remove()}},"\u{1F4FA} Watch an ad: double the "+l.run.lastPts+" points"),l.run.rerolls>0&&i("button",{onclick:()=>{l.run.rerolls--,l.run.draft=null,$(M,U)}},"Reroll ("+l.run.rerolls+" left)"),!l.run.draft.length&&i("button",{class:"go",onclick:()=>{l.run.draft=null,oe()}},"Next fight"))).classList.add("wide")}function oe(){_(1),_(0);let M=A(l.run.round),U=n.meta(),N=U.boosts;l.run.sum||(l.run.sum={dealt:0,taken:0,big:0,crits:0,blocks:0}),l.views[0]=p(l.data,n.M,-1,l.run.load,l.entered?0:5.5),l.entered=!0,l.enemy=ra(cr(l.run.seed+l.run.round*7919),{titled:!0}),M&&(l.enemy.name=l.enemy.name.split(" ")[0]+", Champion of the Sands");let X=pr(l.data),j=pr(l.enemy);l.eLoad=xf(cr(l.run.seed+l.run.round),j,l.run.round),l.elite=bf(cr(l.run.seed*3+l.run.round),l.run.round,M),l.elite&&(l.enemy.name=l.elite.name+" "+l.enemy.name.split(" ")[0]),l.hurt=!1,l.views[1]=p(l.enemy,o,1,l.eLoad,6),M&&l.views[1].holder.scale.setScalar(1.18),l.F=[Eh(X,{mods:Fh(l.run.load,X),abilities:l.run.load.abilities,bonusHp:l.run.bonusHp,boost:{hp:1+.05*(N.vital||0),atk:1+.04*(N.fero||0)}}),Eh(j,{mul:lf(l.run.round*(C()?Go.slope:x().slope),C()?0:x().tier,M,C()),mods:(()=>{let Z=Fh(l.eLoad,j);if(l.elite)for(let se in l.elite.mods)Z[se]=(Z[se]||0)+l.elite.mods[se];return Z})()})],l.run.hp!=null&&(l.F[0].hp=Math.min(l.F[0].max,l.run.hp)),l.rand=Math.random,l.queue=[],l.run.fighting=!0,l.run.dead=!1,s.set("cc.run",l.run),v(),fe(),l.phase="intro",l.phaseT=0,l.elite&&l.views[1].holder.scale.setScalar(l.elite.id==="giant"?1.25:1.08),Y(M?C()?"Champion!":"Final fight":l.elite?"Elite!":"Fight "+(l.run.round+1),"vs "+l.enemy.name+(l.elite?" (+50% points)":""))}function Y(M,U){let N=document.getElementById("bmsg");N&&N.replaceChildren(M?i("b",null,M):"",U?i("span",null,U):"")}function fe(){for(let U=0;U<2;U++){let N=l.F[U],X=document.getElementById("hp"+U);if(!X)continue;let j=gr(N.hp/N.max,0,1),Z=N.st;document.getElementById("hg"+U).style.width=j*100+"%",X.style.width=j*100+"%",X.style.background=Z.poison>0?"#8fd14f":j>.5?"#3fd0a4":j>.25?"#ffb347":"#ff5a4a",X.parentNode.classList.toggle("shield",N.shield>0);let se=Math.max(0,Math.ceil(N.hp))+" / "+N.max+(N.shield>0?" +"+Math.ceil(N.shield):"")+(Z.bleed>0?" \u{1FA78}"+Z.bleed:"")+(Z.poison>0?" \u2623\uFE0F":"")+(Z.burn>0?" \u{1F525}":"")+(Z.stun>0?" \u{1F4AB}":"")+(Z.weak>0?" \u2B07\uFE0F":"")+(Z.slow>0?" \u{1F578}\uFE0F":"")+(Z.blind>0?" \u{1F32B}\uFE0F":"")+(N.buff.shell>0?" \u{1F422}":"")+(N.buff.evade>0?" \u{1F985}":"")+(N.buff.frenzy>0?" \u{1F624}":""),P=document.getElementById("st"+U);P.textContent!==se&&(P.textContent=se)}let M=(U,N,X,j)=>{let Z=document.getElementById(U);Z&&(Z.firstChild.style.height=gr(N/X,0,1)*100+"%",Z.classList.toggle("armed",!!j))};M("bpow",l.F[0].powerCd,7,l.F[0].power),M("bgrd",l.F[0].guardCd,l.F[0].guardEvery,l.F[0].guard>0),l.F[0].abil.forEach((U,N)=>M("bab"+N,U.cd,Ch[U.id],!1))}function ge(){let M=l.F[0],U=n.meta(),N=mf(l.run.round,C()?1:x().pay,!!l.elite);if(n.stat("fightsWon"),C()?n.stat("bestEndless",l.run.round+1,!0):n.stat("bestFight",l.run.round+1,!0),l.elite&&n.stat("elites"),l.hurt||n.stat("flawless"),M.hp<M.max*.1&&n.stat("closeCalls"),U.points+=N,l.run.earned=(l.run.earned||0)+N,l.run.lastPts=N,n.saveMeta(),l.run.bonusHp=(l.run.bonusHp||0)+M.m.killHp,l.run.round++,l.run.fighting=!1,l.run.hp=Math.min(M.max,Math.max(1,M.hp)+M.max*(.4+.04*(U.boosts.recov||0)+M.m.killHeal)),l.run.draft=null,l.run.round>=T()){Pe();return}s.set("cc.run",l.run),$(l.enemy.name.split(",")[0]+" is dead","+"+N+" points. "+l.data.name+" recovers to "+Math.round(l.run.hp)+" / "+M.max+" health. "+(A(l.run.round)?C()?"A champion is next. ":"Only the champion remains. ":"")+"Choose a reward:")}function Pe(){var Fe;l.phase="champion",s.set("cc.run",null),Pn("win"),l.cheer=6,_(0),l.views[0]=p(l.data,n.M,-1,l.run.load);let M=(Fe=l.run.level)!=null?Fe:2,U=vf(M,l.F[0].hp/l.F[0].max),N=l.run.earned||0,X=M>=(n.meta().level||0)&&M<dn.length-1;_(1),l.views[0].holder.position.x=0,l.views[0].holder.rotation.y=.35;let j=260,Z=new Ai(.09,.14),se=new Wr(Z,new Ht({side:Pt}),j),P=new ke;l.confetti={mesh:se,bits:[]};for(let Se=0;Se<j;Se++)l.confetti.bits.push({x:(Math.random()-.5)*9,y:3+Math.random()*7,z:(Math.random()-.5)*5,v:.8+Math.random()*1.2,r:Math.random()*6,w:1+Math.random()*4}),se.setColorAt(Se,P.setHSL(Math.random(),.9,.6));r.g.add(se),h.replaceChildren(i("div",{class:"floaters"})),l.run.earned=N+U,b(i("h2",{class:"gold"},x().name+" Champion!"),i("p",null,i("b",null,l.data.name)," won all "+T()+" fights and takes the "+x().name+" title: +"+U+" points."+(X?" "+dn[M+1].name+" is now open.":"")+(n.meta().champions?"":" The Endless Pit is now open too.")),S(),i("div",{class:"row"},i("button",{class:"ad",onclick:async Se=>{await q(Se,"champion")&&(n.bonus(U),K({type:"champion",points:U*2}))}},"\u{1F4FA} Watch an ad: double the title prize (+"+U+")"),i("button",{class:"go",onclick:()=>K({type:"champion",points:U})},"Take the crown"))).classList.add("low","wide"),Oe(),n.crown(U,l.run)}function Oe(){let M=l.run.sum||{};l.run.counted||(l.run.counted=!0,n.stat("damage",Math.round(M.dealt||0)),n.stat("biggestHit",M.big||0,!0),n.stat("runs"))}function et(){l.phase="dead",Pn("lose"),l.run.dead=!0,l.run.fighting=!1,s.set("cc.run",l.run),h.querySelector(".acts").classList.add("hidden"),Y("","");let M=n.meta(),U=()=>{l.run.hp=Math.round(l.F[0].max*.5),s.set("cc.run",l.run),Pn("win"),oe()},N=X=>!l.run.adRevived&&i("button",{class:"ad",onclick:async j=>{await q(j,"dead")&&(l.run.adRevived=!0,U())}},X);if(C()){b(i("h2",null,l.data.name+" is carried from the pit"),i("p",null,"Beaten by "+l.enemy.name+" after "+l.run.round+(l.run.round===1?" win":" wins")+". Your best in the pit is "+Math.max(l.run.round,M.stats.bestEndless||0)+"."),S(),i("div",{class:"row"},N("\u{1F4FA} Watch an ad to fight on"),i("button",{class:"go",onclick:()=>{Oe(),s.set("cc.run",null),K({type:"retired",wins:l.run.round})}},"Leave the pit"))).classList.add("low","wide");return}b(i("h2",{class:"red"},l.data.name+" has fallen"),i("p",null,"Killed by "+l.enemy.name+" in fight "+(l.run.round+1)+I()+" on "+x().name+"."),S(),i("p",{class:"dim"},(l.run.adRevived?"":"Watch an ad to bring it back once, at half health. ")+(M.revives>0?"You hold "+M.revives+(M.revives===1?" revive.":" revives."):"Revives are sold in the shop.")+" Otherwise the dead do not return."),i("div",{class:"row"},N("\u{1F4FA} Watch an ad to revive"),M.revives>0&&i("button",{class:"go",onclick:()=>{M.revives--,n.saveMeta(),U()}},"Use a revive"),i("button",{class:M.revives>0||!l.run.adRevived?"":"go",onclick:()=>{Oe(),s.set("cc.run",null),K({type:"dead",round:l.run.round,by:l.enemy.name})}},M.revives>0?"Let it die":"Create a new creature"))).classList.add("low","wide")}function K(M){l.active&&(_(0),_(1),l.confetti&&(r.g.remove(l.confetti.mesh),l.confetti.mesh.geometry.dispose(),l.confetti.mesh.material.dispose(),l.confetti.mesh.dispose(),l.confetti=null),l.active=!1,l.phase="off",r.g.visible=!1,e.background=u,a.clear(),Vh(n.M),t.zoom=1,h.classList.add("hidden"),h.replaceChildren(),n.onDone(M))}function ce(M,U,N,X){let j=l.F&&l.F[U],Z=zh(),se=M.rig,P=Math.sin(X*2+M.ph);if(Z.sy=1+P*.012,Z.y=M.hover?Math.sin(X*1.3+M.ph)*.06:0,M.st.wings&&(Z.flap=M.hover?.3:.05),M.walk>0){let he=Math.min(M.walk,4.6*N);M.walk-=he,M.holder.position.x=M.side*(.75+M.walk),Z.gait=1,Z.y+=Math.abs(Math.sin(se.gaitPh))*.04,Z.pitch=.04,M.fxT+=N,M.fxT>.16&&(M.fxT=0,a.burst("dust",g(M,new L(0,.05,-M.len*.5)),2,{speed:.5}))}else if(M.dead>=0){M.dead+=N;let he=Math.min(1,M.dead/.75),_e=he*he*(3-2*he);Object.assign(Z,{roll:1.48*_e*(U?-1:1),y:Math.sin(_e*Math.PI/2)*M.half*.85+Math.sin(he*Math.PI)*.25,z:-.5*_e,pitch:-.2*Math.sin(he*Math.PI),legF:-.5*_e,legH:.55*_e,legOut:.35*_e,armAll:-.7*_e,armOut:.5*_e,wing:-.7*_e,tent:-.6*_e,tailUp:-.3*_e,wag:0,flap:0,sy:1-.06*_e}),he>=.8&&!M.thud&&(M.thud=!0,a.burst("dust",g(M,new L(0,.1,-M.len*.5)),26,{spread:M.len*.8}),l.shake=Math.max(l.shake,.18))}else if(l.phase==="champion"||l.phase==="ending"&&l.winner===U&&l.phaseT>.5){let he=Math.abs(Math.sin(X*5.5));Object.assign(Z,{y:Z.y+he*.22,sy:1+(he-.5)*.08,armAll:-2.7,armOut:.35,wing:.7,flap:.5,tailUp:.5,wag:3,pitch:-.15,tent:-.9,legF:-.25*he})}else j&&l.phase==="fight"&&(j.st.stun>0?Object.assign(Z,{roll:.13*Math.sin(X*9),pitch:.12,legOut:.12,armAll:.2,wing:-.3,wag:0,sy:.96}):(M.strikeT<0&&j.t<.45?(M.winding||(M.winding=!0,M.style=M.styles[M.styleN++%M.styles.length],M.power=j.power,se.armSel=se.arms?M.styleN%se.arms:-1,j.power&&se.arms>1&&(se.armSel=-1)),Object.assign(Z,Hh(M.style,1-j.t/.45,-1,M.power))):M.strikeT<0&&(M.winding=!1),M.strikeT>=0&&(Object.assign(Z,Hh(M.style,1,M.strikeT,M.power)),M.strikeT+=N,M.strikeT>Cf&&(M.strikeT=-1,M.winding=!1)),j.guard>0&&Object.assign(Z,{sy:.9,pitch:.12,armAll:-1.4,armOut:.3,wing:.7,z:(Z.z||0)-.12,legF:.15,tailUp:-.2}),j.buff.shell>0&&(Z.sy=.82,Z.legOut=.2,Z.armAll=-.8),j.buff.frenzy>0&&(Z.sy*=1+.03*Math.sin(X*22),Z.wag=4),j.buff.evade>0&&(Z.y+=1.3,Z.flap=1,Z.pitch=-.2)));if(M.recoil>0){M.recoil=Math.max(0,M.recoil-N*3.2);let he=M.recoil;Z.z=(Z.z||0)-.5*he,Z.pitch=(Z.pitch||0)-.28*he,Z.roll=(Z.roll||0)+.14*he*Math.sin(X*30),Z.legF=(Z.legF||0)-.35*he,Z.armAll=(Z.armAll||0)+.5*he,Z.wing=(Z.wing||0)+.4*he,Z.sy=Z.sy*(1-.06*he)}if(M.dodge>=0)if(M.dodge+=N*3.2,M.dodge>=1)M.dodge=-1;else{let he=Math.sin(M.dodge*Math.PI);Z.x=(Z.x||0)+.95*he,Z.roll=(Z.roll||0)-.35*he,Z.z=(Z.z||0)-.3*he,Z.gait=1}Pf(se,Z,N,M.pose),M.flash=Math.max(0,M.flash-N*5);let Fe=j&&j.guard>0?.1:0,Se=j&&j.buff.shell>0?.12:0;for(let he of[M.mats.skin,...M.mats.shells])he.emissive.setRGB(M.flash*.5+Fe*.2+Se,Fe*.6+Se,Fe+Se);if(M.holder.updateMatrixWorld(!0),j&&M.dead<0&&l.phase==="fight"&&(M.fxT+=N,M.fxT>.07)){M.fxT=0;let he=()=>g(M,new L((Math.random()-.5)*M.half*1.6,M.mid.y*(.4+Math.random()*1.2),-M.len*Math.random()));j.st.burn>0&&a.burst("fire",he(),2,{spread:.15}),j.st.poison>0&&Math.random()<.5&&a.burst("venom",he(),1,{spread:.1}),j.st.bleed>0&&Math.random()<.12*j.st.bleed&&a.burst("blood",he(),1,{speed:.3}),j.st.stun>0&&a.burst("star",g(M,M.head),1,{spread:.5,speed:.4}),j.shield>0&&Math.random()<.4&&a.burst("shield",he(),1,{speed:.2}),j.buff.frenzy>0&&a.burst("fire",he(),1,{spread:.1,size:.6}),j.st.blind>0&&a.burst("ink",g(M,M.head),1,{spread:.4,speed:.3,size:.6}),j.st.slow>0&&Math.random()<.4&&a.burst("web",he(),1,{speed:.2})}}function Ce(M){if(M.type==="dot"){M.on===0&&(l.hurt=!0),l.run.sum&&(M.on===0?l.run.sum.taken+=M.dmg:l.run.sum.dealt+=M.dmg),y(M.on,"-"+M.dmg,M.kind==="venom"?"venom":M.kind==="burn"?"burn":"bleed"),a.burst(M.kind==="venom"?"venom":M.kind==="burn"?"fire":"blood",g(l.views[M.on],l.views[M.on].mid),6);return}if(M.type==="cast"){let P=l.views[M.by],Fe=l.views[1-M.by];y(M.by,M.name,"cast"),Pn("miss"),P.style="roar",P.strikeT=0,P.power=!1;let Se={"Ink Cloud":["ink",Fe,26],Web:["web",Fe,40],"Venom Spit":["venom",Fe,26],Roar:["magic",P,14],"Shell Up":["shield",P,22],Frenzy:["fire",P,22],Dive:["dust",P,18]}[M.name]||["magic",P,16];a.burst(Se[0],g(Se[1],Se[1].mid),Se[2],{spread:.9}),M.name==="Roar"&&(a.ring(g(P,P.front),16766826,3.2,!1),l.shake=.15),M.name==="Shell Up"&&a.ring(g(P,new L(0,.05,-P.len/2)),8376575,2);return}if(M.type==="heal"){y(M.on,M.name,"venom"),Pn("win"),a.burst("heal",g(l.views[M.on],l.views[M.on].mid),30,{spread:1.1});return}let U=l.views[M.by],N=l.views[1-M.by];(M.by===1&&M.dmg>0||M.by===0&&(M.thorns||M.riposte))&&(l.hurt=!0);let X=l.run.sum;if(X&&(M.by===0?(X.dealt+=M.dmg||0,X.taken+=(M.thorns||0)+(M.riposte||0),M.dmg>X.big&&(X.big=M.dmg),M.crit&&X.crits++):(X.taken+=M.dmg||0,X.dealt+=(M.thorns||0)+(M.riposte||0),M.blocked&&X.blocks++)),M.name&&d[M.name]){let P=d[M.name];U.style=P==="tail"&&!U.rig.kinds.has("tail")||P==="slash"&&!U.rig.arms||P==="lash"&&!U.rig.kinds.has("tentacle")?"lunge":P,U.rig.armSel=-1}if(U.strikeT=0,U.power=!!M.power||!!M.ability,M.name&&y(M.by,M.name,"cast"),M.miss){y(1-M.by,"Miss","dim"),Pn("miss"),N.dodge=0,a.burst("dust",g(N,new L(0,.05,-N.len*.4)),8);return}let j=M.power||M.crit||M.ability,Z=g(N,N.front);N.recoil=M.blocked?.3:j?1:.6,M.blocked||(N.flash=1),l.shake=M.blocked?.05:M.power?.3:j?.2:.1,l.cheer=Math.max(l.cheer,j?1:.4),l.freeze=M.blocked?.03:j?.09:.045,j&&!M.blocked&&(l.punch=.07),M.blocked?(a.burst("shield",Z,16),a.ring(Z,8376575,1.1,!1)):(a.burst("spark",Z,j?22:10,{dir:new L(-U.side,.3,0)}),a.burst("dust",g(N,new L(0,.05,-N.len*.4)),j?10:4),j&&a.ring(Z,M.crit?16766826:16777215,M.power?1.8:1.3,!1),(M.bleed||M.crit)&&a.burst("blood",Z,10),(M.burn||M.name==="Fire Breath")&&a.burst("fire",Z,24,{spread:.8}),M.venom&&a.burst("venom",Z,14,{spread:.6}),M.stun&&a.burst("star",g(N,N.head),12,{spread:.5})),y(1-M.by,(M.blocked?"Blocked ":"")+"-"+M.dmg+(M.crit?"!":""),M.blocked?"dim":j?"big":""),M.thorns&&(y(M.by,"-"+M.thorns,"dim"),a.burst("spark",g(U,U.front),6)),M.riposte&&(y(M.by,"Riposte -"+M.riposte,"dim"),U.recoil=.5,U.flash=1);let se=M.stun?"Stunned":M.venom?"Poisoned":M.burn?"Burning":M.bleed?"Bleeding":"";se&&y(1-M.by,se,M.venom?"venom":M.burn?"burn":"bleed"),Pn(M.blocked?"block":j?"power":"hit")}return l.update=(M,U)=>{let N=M;if(l.freeze>0&&(l.freeze-=M,N=M*.05),l.slow>0&&(l.slow-=M,N*=.3),l.t+=N,l.phaseT+=N,l.phase==="intro"&&l.phaseT>1.9&&(l.phase="fight",l.phaseT=0,Y("Fight!",""),setTimeout(()=>l.phase==="fight"&&Y("",""),700)),l.phase==="fight"){let se=l.queue.splice(0),P=Math.min(.6,.15+.035*l.run.round),Fe=-1;for(let Se=0;Se<2&&Fe<0;Se++)Ph(l.F,1,N/2,l.rand,P,se),l.auto&&Ph(l.F,0,N/2,l.rand,.5,se),Fe=cf(l.F,N/2,l.rand,se);se.forEach(Ce),fe(),Fe>=0&&(l.phase="ending",l.phaseT=0,l.winner=Fe,l.views[1-Fe].dead=0,l.cheer=3,l.slow=.9,l.punch=.14,Y("K.O.",""),Fe===0&&Pn("win"))}l.phase==="ending"&&l.phaseT>2.1&&(l.winner===0?ge():et());for(let se=0;se<2;se++)l.views[se]&&ce(l.views[se],se,N,l.t);a.resize(window.innerHeight),a.update(N),l.cheer=Math.max(0,l.cheer-N*.8);let X=.03+.14*Math.min(l.cheer,1);r.seats.forEach((se,P)=>{r.m4.makeTranslation(se.x,se.y+Math.abs(Math.sin(U*6*(1+P%5*.2)+se.ph))*X,se.z),r.crowd.setMatrixAt(P,r.m4)}),r.crowd.instanceMatrix.needsUpdate=!0,l.confetti&&(l.confetti.bits.forEach((se,P)=>{se.y-=se.v*N,se.y<0&&(se.y=8),r.m4.makeRotationFromEuler(new _n(se.r+l.t*se.w,se.r*2+l.t*se.w*.7,0)).setPosition(se.x+Math.sin(l.t+se.r)*.3,se.y,se.z),l.confetti.mesh.setMatrixAt(P,r.m4)}),l.confetti.mesh.instanceMatrix.needsUpdate=!0),l.shake=Math.max(0,l.shake-M*1.2);let j=gr(1.9/t.aspect,1,1.6),Z=l.phase==="champion";l.punch=Math.max(0,l.punch-M*.35),Math.abs(t.zoom-(1+l.punch))>5e-4&&(t.zoom=1+l.punch,t.updateProjectionMatrix()),t.position.set(Math.sin(l.t*.25)*.8+(Math.random()-.5)*l.shake,(Z?1.5:1.9)+(Math.random()-.5)*l.shake,(Z?7.2:7.1)*j),t.lookAt(0,Z?-.25:1.05,0)},l.start=(M,U)=>{l.data=M,l.active=!0,l.t=0,l.enemy=null,l.F=null,l.entered=!1,l.freeze=l.slow=l.punch=0,n.sun.target.position.set(0,0,0),n.sun.position.set(3,7,5),l.run=U||{id:M.id,round:0,hp:null,level:Math.min(n.meta().levelSel||0,n.meta().level||0),endless:!!(n.meta().endlessSel&&n.meta().champions),seed:Math.floor(Math.random()*1e9),load:Zo(),bonusHp:0,earned:0,rerolls:n.meta().boosts.reroll||0,draft:null},l.run.load||(l.run.load=Zo()),l.eLoad=null,l.queue=[],u=e.background,e.background=r.sky,r.g.visible=!0,h.classList.remove("hidden"),l.views[0]=p(M,n.M,-1,l.run.load);let N=l.run.fighting&&l.run.retried;if(l.run.dead||N)oe(),l.phase="ending",l.F[0].hp=0,l.views[0].dead=5,l.views[1].walk=0,l.views[1].holder.position.x=.75,Y("",""),et();else if(l.run.draft)$("Back to the sands","Choose your reward:");else if(l.run.round>0||l.run.paid){let X=!!l.run.fighting;X&&(l.run.retried=!0,s.set("cc.run",l.run)),l.phase="won",h.replaceChildren(),b(i("h2",null,"Back to the sands"),i("p",null,l.data.name+" has won "+l.run.round+I()+" fights"+(l.run.hp!=null?" and has "+Math.round(l.run.hp)+" health.":".")),X&&i("p",{class:"warn"},"You left in the middle of a fight, so it starts again. That is forgiven once per gauntlet: leave mid-fight again and it counts as a death."),i("div",{class:"row"},i("button",{class:"go",onclick:()=>H()},"Next fight")))}else z()},l.back=()=>(l.phase==="gate"&&K({type:"back"}),!0),l}var aa=null;window.ccAdDone=(n,e)=>{let t=aa;aa=null,t&&t({ok:!!n,why:e||""})};function Wh(){return aa?Promise.resolve({ok:!1,why:""}):new Promise(n=>{if(aa=n,window.Android&&window.Android.showRewarded){try{window.Android.showRewarded()}catch{window.ccAdDone(!1,"Ads are unavailable right now.");return}let r=n,a=0,o=setInterval(()=>{if(aa!==r){clearInterval(o);return}document.visibilityState==="visible"?a++:a=0,a>=20&&(clearInterval(o),window.ccAdDone(!1,"The ad did not finish."))},1e3);return}if(window.__ccAdInstant){window.ccAdDone(!0);return}let e=document.createElement("div");e.className="adph";let t=3,i=()=>{e.innerHTML="<div><small>Ad placeholder</small><b>"+t+"</b><p>The Android app shows a real rewarded ad here.</p></div>"};i(),document.body.append(e);let s=setInterval(()=>{t--,t<=0?(clearInterval(s),e.remove(),window.ccAdDone(!0)):i()},1e3)})}var Rt=n=>document.getElementById(n);function V(n,e,...t){let i=document.createElement(n);for(let[s,r]of Object.entries(e||{}))s==="class"?i.className=r:s==="style"?i.style.cssText=r:s.startsWith("on")?i.addEventListener(s.slice(2),r):r!==!1&&r!=null&&(i[s]=r);for(let s of t.flat())s!=null&&s!==!1&&i.append(s);return i}var _t={get(n,e){try{let t=localStorage.getItem(n);return t?JSON.parse(t):e}catch{return e}},set(n,e){try{return localStorage.setItem(n,JSON.stringify(e)),!0}catch{return!1}}};function Ft(n){let e=Rt("toast");e.textContent=n,e.classList.remove("hidden"),clearTimeout(Ft.t),Ft.t=setTimeout(()=>e.classList.add("hidden"),2200)}var Ts=Rt("view"),wt=new co({canvas:Ts,antialias:!0,powerPreference:"high-performance"});wt.setPixelRatio(Math.min(window.devicePixelRatio||1,2));wt.toneMapping=th;wt.toneMappingExposure=1.05;var Ot=new tr;{let n=document.createElement("canvas");n.width=4,n.height=256;let e=n.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"#3d7f86"),t.addColorStop(.55,"#1c3a40"),t.addColorStop(1,"#0c1719"),e.fillStyle=t,e.fillRect(0,0,4,256);let i=new li(n);i.colorSpace=zt,Ot.background=i}var Ev=new er(wt);Ot.environment=Ev.fromScene(new Co,.04).texture;Ot.environmentIntensity=.55;var Bn=new qr(16773853,2.2);Bn.position.set(2.5,5,4);Ot.add(Bn);Ot.add(Bn.target);wt.shadowMap.enabled=!0;wt.shadowMap.type=eh;Bn.castShadow=!0;Bn.shadow.mapSize.set(1024,1024);Bn.shadow.bias=-6e-4;Bn.shadow.normalBias=.025;Bn.shadow.radius=3;Object.assign(Bn.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.5,far:22});var Hf=new qr(10475775,.9);Hf.position.set(-3,2.5,-4);Ot.add(Hf);Ot.add(new xo(13626111,3813160,.5));var pt=new Yt(32,1,.05,100),In=Lo(),ti=new Tt;Ot.add(ti);var di=new ze(new Zn(1,1.06,.06,64),new Nt({color:2377804,roughness:.85})),Qn=new ze(new nr(1,48),new Ht({transparent:!0,depthWrite:!1,opacity:.55}));{let n=document.createElement("canvas");n.width=n.height=128;let e=n.getContext("2d"),t=e.createRadialGradient(64,64,4,64,64,64);t.addColorStop(0,"rgba(0,0,0,1)"),t.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=t,e.fillRect(0,0,128,128),Qn.material.map=new li(n),Qn.material.color.set(0),Qn.rotation.x=-Math.PI/2}di.receiveShadow=!0;Qn.material.opacity=.3;ti.add(di,Qn);var ei=new Tt;Ot.add(ei);var ws=new ze(new yn(1,.12,8,32),new Ht({color:16757575,depthTest:!1,transparent:!0,opacity:.9}));ws.renderOrder=10;ei.add(ws);var Tv=new on(1,16,12),Av=new Ht({color:16777215,depthTest:!1,transparent:!0,opacity:.9}),Rv=new Ht({color:16757575,depthTest:!1,transparent:!0}),Ii=new Tt;ei.add(Ii);var ua=new fo(new ht,new Xr({color:16777215,depthTest:!1,transparent:!0,opacity:.6}));ua.renderOrder=9;ei.add(ua);var Kt={orbit:null},le=null,mt=null,gt=null,Mn="body",jn=-1,da=!1,pn=!1,On=[],yr=[];function vn(){mt&&(ti.remove(mt.group),fr(mt.group)),ci(In,le.look,At[le.type].bellyDir),mt=dr(le,In),ti.add(mt.group),Jh(),ga()}function Jh(){Es=!0;let n=ea(mt),e=n.getCenter(new L),t=n.getSize(new L),i=Math.max(t.x,t.z)*.42+.15;di.position.set(e.x,n.min.y-.03,e.z),di.scale.set(i,1,i),Bn.target.position.copy(e),Bn.position.copy(e).add(new L(2.5,5,4)),Qn.position.set(e.x,n.min.y+.004,e.z),Qn.scale.set(Math.max(t.x,.3)*.75,Math.max(t.z,.3)*.62,1),mt.box=n}function Kh(n){let e=mt.box,t=e.getCenter(new L),i=e.getSize(new L).length()/2,s=i/Math.sin(Jr.degToRad(pt.fov/2))*.74;Kt.orbit.target.copy(t),pt.position.copy(t).add((n||new L(.75,.28,1)).normalize().multiplyScalar(s)),Kt.orbit.minDistance=i*.5,Kt.orbit.maxDistance=s*2.5,Kt.orbit.update()}function ga(){Es=!0;let n=pn&&Mn==="body";for(Ii.visible=ua.visible=n;Ii.children.length;)Ii.remove(Ii.children[0]);if(n){let t=[],i=(mt.frames.m-1)/(le.nodes.length-1);le.nodes.forEach((s,r)=>{let a=mt.frames.C[Math.round(r*i)],o=new ze(Tv,r===jn?Rv:Av);o.position.copy(a),o.userData.node=r,o.renderOrder=11,Ii.add(o),t.push(a)}),ua.geometry.dispose(),ua.geometry=new ht().setFromPoints(t)}let e=gt&&gt!=="body"&&mt.parts.get(gt);ws.visible=!!(pn&&e&&e.userData.anchor),ws.visible&&ws.position.copy(e.userData.anchor)}function bn(){var e;let n=JSON.stringify(le);On[On.length-1]!==n&&(On.push(n),On.length>60&&On.shift(),yr=[]),_t.set("cc.current",le),pn&&((e=document.activeElement)==null?void 0:e.tagName)!=="INPUT"&&eu()}function Nf(n){le=JSON.parse(n),gt&&gt!=="body"&&!le.parts.find(e=>e.id===gt)&&(gt=null),vn(),Li(),_t.set("cc.current",le)}var pa=n=>le.parts.find(e=>e.id===n),Xh=new Yn(256,256,{samples:4}),oa=new Yt(30,1,.01,100);function Vf(n,e,t,i,s){let r=t.getCenter(new L),a=Math.max(t.getSize(new L).length()/2,.01);oa.aspect=n/e,oa.updateProjectionMatrix(),oa.position.copy(r).add(i.clone().normalize().multiplyScalar(a/Math.sin(Jr.degToRad(15))*(n>e?.92:1.02))),oa.lookAt(r),Xh.setSize(n,e);let o=ei.visible;ei.visible=!1;let c=wt.toneMapping;wt.toneMapping=oi,wt.setRenderTarget(Xh),wt.render(Ot,oa),wt.setRenderTarget(null),wt.toneMapping=c,ei.visible=o;let h=new Uint8Array(n*e*4);wt.readRenderTargetPixels(Xh,0,0,n,e,h);let l=document.createElement("canvas");l.width=n,l.height=e;let u=l.getContext("2d"),d=u.createImageData(n,e),p=new Uint8Array(256);for(let g=0;g<256;g++)p[g]=Math.round(255*Math.pow(Math.min(g/255*1.1,1),1/2.2));for(let g=0;g<e;g++)for(let _=0;_<n;_++){let m=((e-1-g)*n+_)*4,f=(g*n+_)*4;d.data[f]=p[h[m]],d.data[f+1]=p[h[m+1]],d.data[f+2]=p[h[m+2]],d.data[f+3]=255}return u.putImageData(d,0,0),l.toDataURL(s||"image/jpeg",.85)}function jo(n){let e=mt,t=di.visible;e&&(e.group.visible=!1),ci(In,n.look,At[n.type].bellyDir);let i=dr(n,In);ti.add(i.group),di.visible=Qn.visible=!1;let s=Vf(240,192,ea(i),new L(.8,.25,1));return ti.remove(i.group),fr(i.group),di.visible=Qn.visible=t,e&&(e.group.visible=!0,ci(In,le.look,At[le.type].bellyDir)),s}var Yh={},Cv={base:"#9fb6b0",second:"#5c7a76",belly:"#c9d8d2",bellyAmt:.5,pattern:0,patScale:1,cover:"skin",furLen:0,furDroop:0,accent:"#efe6cf",hair:"#d98a3a",membrane:"#d99a8a",eye:"#3f9f6a"};function qh(n){if(Yh[n])return Yh[n];let e=It[n],t={type:"quadruped",sex:"f",dimorph:0,bulk:1,stretch:1,look:Cv,parts:[],nodes:[{y:0,z:-.25,rx:.3,ry:.3},{y:0,z:.25,rx:.3,ry:.3}]},i={limbs:[.5,1.9],wings:[.5,.9],tails:[-.9,0],back:[.5,0],mouth:[1.9,Math.PI],eyes:[1.3,1]}[e.cat]||[.6,.6],s=mt;s&&(s.group.visible=!1),ci(In,t.look,[0,-1,0]);let r=dr(t,In),a=ui(t,n,r.frames,i,{mirror:!1,size:e.kind==="surface"?.3:e.ridge?.18:.7}),o=Bo(r,a);r.body.visible=e.ridge||n==="shell",ti.add(r.group);let c=di.visible;di.visible=Qn.visible=!1;let h=Ot.background;Ot.background=new ke(1452075);let l=new Rn().setFromObject(e.ridge?r.group:o),u={mouth:[1,.3,.8],eyes:[.6,.2,1],tails:[1,.3,-.3],limbs:[1,.15,.7]}[e.cat]||[1,.4,.8],d=Vf(112,112,l,new L(...u),"image/png");return Ot.background=h,di.visible=Qn.visible=c,ti.remove(r.group),fr(r.group),s&&(s.group.visible=!0,ci(In,le.look,At[le.type].bellyDir)),Yh[n]=d}var la={x:0,y:0,w:1,h:1};function br(){let n=window.innerWidth,e=window.innerHeight;if(wt.setSize(n,e,!1),ni.active){pt.clearViewOffset(),pt.aspect=n/e,pt.zoom=1,pt.updateProjectionMatrix();return}let t=0,i=0,s=0;pn&&(t=Rt("left").getBoundingClientRect().right,s=Rt("topbar").getBoundingClientRect().bottom,i=Rt("right").classList.contains("hidden")?0:n-Rt("right").getBoundingClientRect().left),la={x:t,y:s,w:Math.max(n-t-i,50),h:Math.max(e-s,50)},pt.aspect=n/e;let r=t+la.w/2,a=s+la.h/2;pt.setViewOffset(n,e,n/2-r,e/2-a,n,e),pt.zoom=Math.min(la.w,la.h*1.15)*.82/e,pt.updateProjectionMatrix(),Es=!0}window.addEventListener("resize",()=>{pn&&!ni.active?Li():br()});var kf=performance.now();function Gf(n){requestAnimationFrame(Gf);let e=Math.min((n-kf)/1e3,.1);if(kf=n,window.__ccPause)return;if(ni.active){ni.update(e,n/1e3),wt.render(Ot,pt);return}if(!pn||!mt||(Kt.orbit.autoRotate=da,Kt.orbit.update(e),ji&&(ji=!1,vn()),!Es&&!da))return;Es=!1;let i=pt.position.distanceTo(Kt.orbit.target)*.0075/pt.zoom;Ii.children.forEach(s=>s.scale.setScalar(i*(s.userData.node===jn?1.5:1.1))),ws.scale.setScalar(i*1.7),ws.quaternion.copy(pt.quaternion),wt.render(Ot,pt)}var ji=!1,Es=!0,Pv=()=>{Es=!0},ma=new Mo,Ff=new Re,st={id:-1,x:0,y:0,t:0,mode:null,moved:!1,node:-1,count:0};function Qo(n){Ff.set(n.clientX/window.innerWidth*2-1,-(n.clientY/window.innerHeight)*2+1),ma.setFromCamera(Ff,pt)}function jh(){let n=ma.intersectObject(mt.group,!0);for(let e of n){let t=e.object;for(;t&&!t.userData.partId;)t=t.parent;if(t)return t.userData.partId}return null}Ts.addEventListener("pointerdown",n=>{if(!(!pn||ni.active)){if(st.count++,st.count>1){st.mode&&Wf(),st.mode=null,Kt.orbit.enabled=!0;return}if(Object.assign(st,{id:n.pointerId,x:n.clientX,y:n.clientY,t:performance.now(),mode:null,moved:!1}),Qo(n),Mn==="body"){let e=ma.intersectObjects(Ii.children),t=-1,i=20;if(Ii.children.forEach(s=>{let r=s.position.clone().project(pt),a=(r.x*.5+.5)*innerWidth-n.clientX,o=(-r.y*.5+.5)*innerHeight-n.clientY,c=Math.hypot(a,o);c<i&&(i=c,t=s.userData.node)}),e.length&&(t=e[0].object.userData.node),t>=0){st.mode="node",st.node=t,jn=t,Kt.orbit.enabled=!1,ga(),Kn();return}}gt&&gt!=="body"&&jh()===gt&&(st.mode="part",Kt.orbit.enabled=!1,Qr(mt,gt))}},!0);Ts.addEventListener("pointermove",n=>{if(!(!pn||ni.active||n.pointerId!==st.id)&&(Math.hypot(n.clientX-st.x,n.clientY-st.y)>9&&(st.moved=!0),!(!st.mode||!st.moved))){if(Qo(n),st.mode==="node"){let e=ma.ray.intersectPlane(new Tn(new L(1,0,0),0),new L);if(e){let t=le.nodes[st.node];t.y=ln(e.y,-1,5),t.z=ln(e.z,-4,4),ji=!0}}else if(st.mode==="part"){let e=ma.intersectObject(mt.body,!1)[0];if(e&&e.uv){let t=pa(gt);t.u=e.uv.x,t.a=e.uv.y*Math.PI*2,t.mirror&&(t.a=Mh(t).a),Bo(mt,t),ga()}}}});function Wf(){st.mode==="part"&&(Qr(mt),Jh()),st.mode&&st.moved&&bn(),Kt.orbit.enabled=!0}function Xf(n){if(!pn||ni.active){st.count=0;return}if(st.count=Math.max(0,st.count-1),n.pointerId!==st.id)return;st.id=-1;let e=!st.moved&&performance.now()-st.t<450;if(Wf(),e&&st.mode!=="node"){Qo(n);let t=jh();vr(t)}st.mode=null}Ts.addEventListener("pointerup",Xf);Ts.addEventListener("pointercancel",Xf);function vr(n){if(gt=n,n&&n!=="body"){let e=It[pa(n).kind].cat;Mn!==e&&(Mn=e)}n==="body"&&(Mn="body"),Li()}function fn(n,e,t,i,s,r,a){let o=V("span",null,""),c=()=>h.style.setProperty("--p",(h.value-e)/(t-e)*100+"%"),h=V("input",{type:"range",min:e,max:t,step:a||(t-e)/200,value:i,oninput:()=>{c(),s(parseFloat(h.value))},onchange:()=>{(r||bn)(parseFloat(h.value))}});return c(),V("div",{class:"sl"},V("label",null,n,o),h)}function xr(n,e,t){return V("div",{class:"chips"},n.map(([i,s])=>V("button",{class:i===e?"on":"",onclick:()=>t(i)},s)))}var Iv=["#f4f0e6","#d9d2c2","#a8a29a","#6b6660","#3a3632","#14100e","#f3e6d0","#e8c9a0","#c99573","#a06a45","#6b4a2e","#3a2616","#f2c230","#e8a020","#d9702a","#c8501c","#a8301c","#701818","#f2a0b0","#e06a8a","#c4472e","#b03080","#7a3aa0","#4a2a7a","#bfe8e0","#7fc4d0","#3a9fc2","#2f7fc2","#1f4f9a","#1c2f5a","#c8e6a0","#9fb86a","#4faa4a","#2f6b3a","#1f4a3a","#12281a","#e6dfa0","#b8b060","#7a8a3a","#8fb0ab"],Lv=[["base","Main"],["second","Pattern"],["belly","Belly"],["eye","Eyes"],["accent","Horn, claw"],["hair","Hair, feather"],["membrane","Wing skin"],["cloth","Cloth"]],ca="base",Dv=n=>n==="eye";function Ki(n,e,t){le.look[n]=e,Dv(n)||n==="cover"?t||n==="cover"?vn():ji=!0:ci(In,le.look,At[le.type].bellyDir),Es=!0,t&&bn()}var Uv={body:'<path d="M7 5c5-3 11 1 10 7s-6 9-10 7-4-11 0-14z"/>',eyes:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',mouth:'<path d="M3 9c3 2 15 2 18 0-1 7-5 9-9 9s-8-2-9-9z"/><path d="M8 10l1 3 1.5-3M13.5 10l1.5 3 1-3"/>',ears:'<path d="M5 20C3 12 6 4 9 3c2 4 3 8 2 13M19 20c2-8-1-16-4-17-2 4-3 8-2 13"/>',horns:'<path d="M7 20c-4-5-4-12 0-17 0 6 2 9 5 11M17 20c4-5 4-12 0-17 0 6-2 9-5 11"/>',limbs:'<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17" cy="9" r="2"/><path d="M7 17c0-3 2-5 5-5s5 2 5 5-2 3-5 3-5 0-5-3z"/>',wings:'<path d="M3 6c7-2 14 1 18 8-4-1-6 0-8 2-1-3-4-4-6-3 0-3-2-5-4-7z"/>',tails:'<path d="M4 18c6 2 12-2 12-7s-5-6-7-3 1 5 4 4"/>',back:'<path d="M2 18c4-6 16-6 20 0M7 13l1-5 2 4M12 12l1-6 1.5 6M16 13l2-4 0 5"/>',skin:'<path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z"/>'},Nv=n=>{let e=document.createElement("span");return e.innerHTML='<svg class="ic" viewBox="0 0 24 24">'+Uv[n]+"</svg>",e.firstChild};function kv(){let n=Rt("tabs");n.replaceChildren();for(let[e,t]of[["body","Body"],...ko,["skin","Skin"]])n.append(V("button",{class:Mn===e?"on":"",onclick:()=>{Mn=e,gt=null,Li()}},Nv(e),t))}var Zh=()=>window.innerWidth<1e3;function Kn(){let n=Rt("left");if(n.replaceChildren(),n.scrollTop=0,Zh()&&gt&&gt!=="body"&&pa(gt)){Qh(n,pa(gt));return}if(Mn==="body"){if(n.append(V("h3",null,"Body shape"),V("p",{class:"note"},"Drag the white dots to bend and stretch the spine. Tap a dot to change how thick the body is there.")),jn>=0&&le.nodes[jn]){let i=le.nodes[jn];n.append(V("h4",null,"Selected section"),fn("Width",.02,.6,i.rx,s=>{i.rx=s,ji=!0}),fn("Depth",.02,.6,i.ry,s=>{i.ry=s,ji=!0}),V("div",{class:"row"},V("button",{onclick:()=>{let s=Math.min(jn,le.nodes.length-2),r=le.nodes[s],a=le.nodes[s+1],o=le.nodes.length-1;le.nodes.splice(s+1,0,{y:(r.y+a.y)/2,z:(r.z+a.z)/2,rx:(r.rx+a.rx)/2,ry:(r.ry+a.ry)/2,role:a.role});for(let c of le.parts)if(c.u>=0&&c.u<=1){let h=c.u*o;c.u=(h>s?h<s+1?s+(h-s)*2:h+1:h)/(o+1)}jn=s+1,vn(),bn(),Kn()}},"Add section"),V("button",{class:"warn",disabled:le.nodes.length<=3,onclick:()=>{let s=le.nodes.length-1,r=jn;le.nodes.splice(r,1);for(let a of le.parts)if(a.u>=0&&a.u<=1){let o=a.u*s;a.u=ln((o>r?o-1:o)/(s-1),0,1)}jn=-1,vn(),bn(),Kn()}},"Remove")))}let t=i=>{let s=le.nodes.reduce((o,c)=>o+c.y,0)/le.nodes.length,r=le.nodes.reduce((o,c)=>o+c.z,0)/le.nodes.length,a=Math.max(...le.nodes.map(o=>Math.hypot(o.y-s,o.z-r)));if(i>1&&a>2.6||i<1&&a<.25){Ft(i>1?"That is as long as a body can get.":"That is as short as a body can get.");return}for(let o of le.nodes)o.y=s+(o.y-s)*i,o.z=r+(o.z-r)*i;vn(),bn()};n.append(V("h4",null,"Whole body"),V("div",{class:"row"},V("button",{onclick:()=>t(1.08)},"Longer"),V("button",{onclick:()=>t(1/1.08)},"Shorter")),fn("Bulk",.5,1.8,le.bulk,i=>{le.bulk=i,ji=!0}),V("h4",null,"Male / female"),V("p",{class:"note"},"How different the two sexes look: build, limb thickness, and the size of horns, crests and manes."),fn("Difference",0,1.6,le.dimorph,i=>{le.dimorph=i,ji=!0}));return}if(Mn==="skin"){let t=le.look;n.append(V("h3",null,"Skin and colour"),V("h4",null,"Covering"),xr([["skin","Smooth"],["fur","Fur"],["scales","Scales"],["chitin","Shell"],["slime","Slick"]],t.cover,r=>{Ki("cover",r,!0),Kn()})),t.cover==="fur"&&n.append(fn("Fur length",0,1,t.furLen,r=>Ki("furLen",r)),fn("Shagginess",0,1,t.furDroop,r=>Ki("furDroop",r))),n.append(V("h4",null,"Colours"),V("div",{class:"cols"},Lv.map(([r,a])=>V("button",{class:"colbtn"+(ca===r?" on":""),onclick:()=>{ca=r,Kn()}},V("i",{style:"background:"+t[r]}),a))),V("div",{class:"sw"},Iv.map(r=>V("button",{style:"background:"+r,onclick:()=>{Ki(ca,r,!0),Kn()}}))));let i={};new ke(t[ca]).getHSL(i);let s=r=>{Ki(ca,"#"+new ke().setHSL(i.h,i.s,i.l).getHexString(),r),r&&Kn()};n.append(fn("Hue",0,1,i.h,r=>{i.h=r,s()},()=>s(!0)),fn("Richness",0,1,i.s,r=>{i.s=r,s()},()=>s(!0)),fn("Lightness",.03,.97,i.l,r=>{i.l=r,s()},()=>s(!0)),V("h4",null,"Pattern"),xr([[0,"Plain"],[1,"Stripes"],[2,"Spots"],[3,"Patches"],[4,"Mosaic"],[5,"Saddle"],[6,"Speckle"],[7,"Bands"]],t.pattern,r=>{Ki("pattern",r,!0),Kn()}),fn("Pattern size",.3,3.5,3.8-t.patScale,r=>Ki("patScale",3.8-r)),fn("Belly colour",0,1,t.bellyAmt,r=>Ki("bellyAmt",r)),V("div",{class:"row"},V("button",{onclick:()=>{let r=Math.random(),a=(o,c,h)=>"#"+new ke().setHSL((o+1)%1,c,h).getHexString();Object.assign(t,{base:a(r,.3+Math.random()*.5,.3+Math.random()*.35),second:a(r+(Math.random()-.5)*.5,.4+Math.random()*.4,.12+Math.random()*.3),belly:a(r+.05,.25,.8),hair:a(r+.5*Math.random(),.5,.25+Math.random()*.3),membrane:a(r+.08,.45,.6),eye:a(Math.random(),.75,.45),pattern:Math.floor(Math.random()*8)}),vn(),bn(),Kn()}},"Surprise me")));return}n.append(V("h3",null,ko.find(t=>t[0]===Mn)[1]),V("p",{class:"note"},"Tap to add. Then tap the part on your creature and drag it where you want it."));let e=V("div",{class:"grid"});for(let[t,i]of Object.entries(It))i.cat===Mn&&(Nh(ae,t)?e.append(V("button",{class:"tile",onclick:()=>{if(Yf())return;let s=ui(le,t,mt.frames);vn(),bn(),vr(s.id)}},V("img",{src:qh(t),alt:""}),i.n)):e.append(V("button",{class:"tile locked",onclick:()=>fa("part:"+t,ia[t],i.n,Kn)},V("img",{src:qh(t),alt:""}),i.n,V("small",null,"Locked \xB7 "+ia[t]))));n.append(e)}var Of=48,Yf=()=>le.parts.length<Of?!1:(Ft("A creature can carry "+Of+" parts at most. Remove one first."),!0),Fv={human:"Toes",paw:"Paw",hoof:"Hoof",talon:"Talons",webbed:"Webbed",stump:"Stump",point:"Spike",none:"None",claw:"Claws",pincer:"Pincer",mitt:"Mitt"};function Ov(){let n=Rt("right"),e=gt&&gt!=="body"?pa(gt):null;n.classList.toggle("hidden",!e||Zh()),n.replaceChildren(),e&&!Zh()&&Qh(n,e)}function Qh(n,e){var o;let t=It[e.kind],i=()=>{n.replaceChildren(),Qh(n,e)},s=()=>{Bo(mt,e),ga()},r=()=>{Qr(mt),Jh(),bn()},a=e.size;n.append(V("h3",null,t.n),V("p",{class:"note"},t.ridge?"Drag it along the body to move the row.":"Drag it on the creature to move it."),fn(t.cat==="limbs"?"Length":"Size",-2,2,0,c=>{e.size=a*Math.pow(2,c),s()},r));for(let[c,h]of Object.entries(t.P||{})){if(c==="suckers"){n.append(xr([[1,"Suckers"],[0,"Smooth"]],e.p[c],l=>{e.p[c]=l,s(),r(),i()}));continue}n.append(fn(h[3],h[0],h[1],(o=e.p[c])!=null?o:h[2],l=>{e.p[c]=l,s()},r,["count","feathers","tines"].includes(c)?1:0))}if(t.C)for(let[c,h]of Object.entries(t.C))n.append(V("h4",null,h.includes("paw")?"Foot":"Hand"),xr(h.map(l=>[l,Fv[l]]),e.p[c],l=>{e.p[c]=l,s(),r(),i()}));t.kind==="surface"&&n.append(V("h4",null,"Angle"),fn("Twist",-3.14,3.14,e.rot,c=>{e.rot=c,s()},r),fn("Tilt",-1.5,1.5,e.tilt,c=>{e.tilt=c,s()},r)),n.append(V("h4",null,"Pair"),xr([[!0,"Mirrored pair"],[!1,"Single"]],e.mirror,c=>{e.mirror=c,s(),r(),i()})),n.append(V("h4",null,"Shown on"),xr([[null,"Both"],["f","Female only"],["m","Male only"]],e.sexOnly,c=>{e.sexOnly=c,s(),r(),i()}),V("div",{class:"row",style:"margin-top:10px"},V("button",{onclick:()=>{if(Yf())return;let c=JSON.parse(JSON.stringify(e));c.id="p"+Date.now().toString(36),c.u=ln(c.u-.08,-.9,1.9),le.parts.push(c),vn(),bn(),vr(c.id)}},"Copy"),V("button",{class:"warn",onclick:()=>{le.parts=le.parts.filter(c=>c.id!==e.id),gt=null,vn(),bn(),Li()}},"Delete")),V("div",{class:"row"},V("button",{onclick:()=>vr(null)},"Done")))}function eu(){Rt("topbar").replaceChildren(V("button",{onclick:Zf},"Home"),V("input",{value:le.name,maxLength:30,onchange:e=>{le.name=e.target.value||"Creature",bn()}}),V("div",{class:"seg"},V("button",{class:le.sex==="f"?"on":"",onclick:()=>Bf("f")},"Female"),V("button",{class:le.sex==="m"?"on":"",onclick:()=>Bf("m")},"Male")),V("button",{disabled:On.length<2,onclick:()=>{On.length>1&&(yr.push(On.pop()),Nf(On[On.length-1]))}},"Undo"),V("button",{disabled:!yr.length,onclick:()=>{if(yr.length){let e=yr.pop();On.push(e),Nf(e)}}},"Redo"),V("button",{class:da?"on":"",onclick:()=>{da=!da,eu()}},"Spin"),V("button",{onclick:Hv},"Photo"),V("button",{onclick:()=>tu()},"Save"),V("button",{class:"battle",onclick:nu},"\u2694\uFE0F Battle"))}function Bf(n){le.sex=n,vn(),bn(),Li()}function Li(){kv(),Kn(),Ov(),eu(),br(),ga(),Rt("hint").textContent=gt&&gt!=="body"?"":"Drag to spin. Pinch to zoom. Tap a part to select it."}function tu(n){le.id||(le.id="c"+Date.now().toString(36));let e=_t.get("cc.saved",[]).filter(i=>i.id!==le.id);e.unshift({id:le.id,name:le.name,thumb:jo(le),data:JSON.parse(JSON.stringify(le))});let t=_t.set("cc.saved",e);_t.set("cc.current",le),t?n||Ft('Saved "'+le.name+'"'):Ft("Could not save: the phone is out of storage for this app. Delete a creature or two.")}var ae=_t.get("cc.meta",null);if(!ae){ae=Object.assign(Dh(),_t.get("cc.record",{}));for(let n of[..._t.get("cc.saved",[]).map(e=>e.data),_t.get("cc.current",null)])n&&!Lh.includes(n.type)&&(ae.unlocked["type:"+n.type]=!0)}ae=Object.assign(Dh(),ae);for(let n of["stats","seen","typesWon","goals","unlocked","boosts"])ae[n]||(ae[n]={});Array.isArray(ae.hall)||(ae.hall=[]);ae.rank!==void 0&&(ae.level=Math.max(ae.level||0,ae.rank>0?Math.min(dn.length-1,ae.rank+3):ae.champions>0?3:0),ae.levelSel=ae.level,delete ae.rank,delete ae.rankSel);var Ln=()=>_t.set("cc.meta",ae);function fa(n,e,t,i){if(ae.points<e){Ft("Not enough points: "+t+" costs "+e+", you have "+ae.points+".");return}confirm("Unlock "+t+" for "+e+" points?")&&(ae.points-=e,ae.unlocked[n]=!0,Ln(),Ft("Unlocked "+t),i&&i())}function qf(n,e=1,t){ae.stats[n]=t?Math.max(ae.stats[n]||0,e):(ae.stats[n]||0)+e,Ln()}function Bv(n,e){var r;let t=(r=e.level)!=null?r:2;ae.points+=n,ae.champions++,ae.typesWon[le.type]=1,ae.stats.bestLevelWon=Math.max(ae.stats.bestLevelWon||0,t+1),t>=ae.level&&ae.level<dn.length-1&&(ae.level=t+1,ae.levelSel=ae.level),ae.hall.unshift({name:le.name,type:le.type,level:t,when:Date.now()}),ae.hall.length=Math.min(ae.hall.length,30),le.champion=(le.champion||0)+1,Ln(),_t.set("cc.current",le);let i=_t.get("cc.saved",[]),s=i.find(a=>a.id===le.id);s&&(s.data=JSON.parse(JSON.stringify(le)),s.name=le.name,_t.set("cc.saved",i))}var ni=Uf({scene:Ot,camera:pt,M:In,h:V,store:_t,sun:Bn,showAd:Wh,toast:Ft,stat:qf,crown:Bv,bonus:n=>{ae.points+=n,Ln()},onDone:zv,meta:()=>ae,saveMeta:Ln});function nu(n){let e=_t.get("cc.run",null);e&&e.id!==le.id&&!(n&&n.id===le.id)&&!confirm("Another creature is still in the middle of a gauntlet. Starting this one abandons that run. Go ahead?")||(tu(!0),gt=null,Kt.orbit.enabled=!1,Rt("editor").classList.add("hidden"),Rt("start").classList.add("hidden"),ti.visible=ei.visible=!1,ci(In,le.look,At[le.type].bellyDir),ni.start(le,n&&n.id===le.id?n:null),br())}function zf(){let n=ae.review||{n:0,at:0},e=Date.now();n.n>=3||e-n.at<21*864e5||(ae.stats.runs||0)<3||(ae.review={n:n.n+1,at:e},Ln(),window.Android&&window.Android.requestReview&&setTimeout(()=>{try{window.Android.requestReview()}catch{}},1500))}function zv(n){ti.visible=ei.visible=!0,Kt.orbit.enabled=!0;for(let t of[In.skin,...In.shells])t.emissive.setRGB(0,0,0);let e=ae;if(n.type==="dead"){e.fallen++,Ln(),_t.set("cc.saved",_t.get("cc.saved",[]).filter(t=>t.id!==le.id)),_t.set("cc.current",null),mt&&(ti.remove(mt.group),fr(mt.group),mt=null),le=null,pn=!1,Rt("start").classList.remove("hidden"),Xt(),br();return}st.count=0,n.type==="retired"&&qf("bestEndless",n.wins,!0),pn=!0,Rt("editor").classList.remove("hidden"),vn(),n.type==="champion"&&tu(!0),Li(),Kh(),n.type==="champion"&&(Ft(le.name+" is champion! +"+n.points+" points"),zf()),n.type==="retired"&&(Ft(le.name+" won "+n.wins+" fights in the pit"),n.wins>=10&&zf())}function Hv(){let t=wt.getPixelRatio(),i=pt.zoom;ei.visible=!1,wt.setPixelRatio(1),wt.setSize(1920,1080,!1),pt.clearViewOffset(),pt.aspect=1920/1080,pt.zoom=i,pt.updateProjectionMatrix(),wt.render(Ot,pt);let s=Ts.toDataURL("image/png");ei.visible=!0,wt.setPixelRatio(t),pt.zoom=i,br(),wt.render(Ot,pt);let r=(le.name||"creature").replace(/[^\w-]+/g,"_")+"_"+Date.now().toString(36)+".png";window.Android&&window.Android.savePng?window.Android.savePng(s.split(",")[1],r):(V("a",{href:s,download:r}).click(),Ft("Photo downloaded"))}window.ccToast=Ft;window.ccBack=()=>ni.active?ni.back():!pn&&sn?(sn=null,Xt(),!0):pn?(gt?vr(null):Zf(),!0):!1;function ha(n){let e=_t.get("cc.run",null);e&&n.id&&e.id===n.id&&(_t.set("cc.run",null),Ft("Gauntlet abandoned. It starts again from fight one.")),le=n,gt=null,jn=-1,Mn="body",On=[],yr=[],pn=!0,le.sex===void 0&&(le.sex="f"),le.look.cloth||(le.look.cloth="#6b4a2e"),Rt("start").classList.add("hidden"),Rt("editor").classList.remove("hidden"),vn(),bn(),Li(),Kh()}function Zf(){_t.set("cc.current",le),pn=!1,Rt("editor").classList.add("hidden"),Rt("start").classList.remove("hidden"),Xt()}var Ko={};function $h(){let n=Rt("runpill");if(!n)return;let e=Ji(ae);n.textContent="\u26A1 "+e.n+"/"+e.max+(e.next?" \xB7 "+Yo(e.next)+" \xB7 \u{1F4FA} +1":"")}setInterval($h,1e3);var sn=null;function Vv(){let n=Rt("start"),e=(o,c,h,l,u,d,p)=>V("div",{class:"shoprow"+(u?" owned":"")},V("div",{class:"ico"},o),V("div",{class:"what"},V("b",null,c),p&&V("small",{class:"req"},p),V("small",null,h)),u?V("span",{class:"have"},typeof u=="string"?u:"Owned"):V("button",{class:ae.points>=l?"go":"",onclick:d},l+" pts")),t=o=>Ss.filter(c=>c.cat===o).sort((c,h)=>c.cost-h.cost).map(c=>e(c.icon,c.name,$o({id:c.id,cat:o,q:1,rar:0,lvl:1}),c.cost,kh(ae,c)&&(c.cost?"Owned":"Free"),()=>fa("item:"+o+":"+c.id,c.cost,c.name,Xt),c.reqText?"Needs "+c.reqText:c.hands===2?"Needs two free hands":"")),i=o=>{let[c,h]=o.prog(ae),l=c>=h,u=!!ae.goals[o.id];return V("div",{class:"shoprow"+(u?" owned":"")},V("div",{class:"ico"},u?"\u2705":l?"\u{1F3C5}":"\u{1F3AF}"),V("div",{class:"what"},V("b",null,o.name),V("small",null,o.text),V("div",{class:"bar"},V("i",{style:"width:"+Math.min(100,c/h*100)+"%"})),V("small",null,Math.min(c,h)+" / "+h)),u?V("span",{class:"have"},"Claimed"):V("button",{class:l?"go":"",disabled:!l,onclick:()=>{ae.goals[o.id]=1,ae.points+=o.pts,Ln(),Ft(o.name+": +"+o.pts+" points"),Xt()}},(l?"Claim ":"")+o.pts+" pts"))},s=(o,c)=>V("div",{class:"shoprow"},V("div",{class:"what"},V("small",null,o),V("b",null,String(c)))),r={Goals:()=>[...Bh].sort((o,c)=>(ae.goals[o.id]?2:Jo(ae,o)?0:1)-(ae.goals[c.id]?2:Jo(ae,c)?0:1)).map(i),Records:()=>[s("Fights won",ae.stats.fightsWon||0),s("Titles won",ae.champions),s("Creatures lost",ae.fallen),s("Hardest level open",dn[ae.level].name),s("Hardest title won",ae.stats.bestLevelWon?dn[ae.stats.bestLevelWon-1].name:"None yet"),s("Best Endless run",(ae.stats.bestEndless||0)+" wins"),s("Gauntlets finished",ae.stats.runs||0),s("Total damage dealt",(ae.stats.damage||0).toLocaleString()),s("Biggest single hit",ae.stats.biggestHit||0),s("Elite opponents beaten",ae.stats.elites||0),s("Different rewards picked",Object.keys(ae.seen).length+" of "+Ss.length),s("Body types crowned",Object.keys(ae.typesWon).length+" of 8"),...ae.hall.map(o=>V("div",{class:"shoprow"},V("div",{class:"ico"},"\u{1F451}"),V("div",{class:"what"},V("b",null,o.name),V("small",null,At[o.type].name+" \xB7 "+(o.level!==void 0?dn[o.level].name:"Rank "+o.rank)+" \xB7 "+new Date(o.when).toLocaleDateString()))))],Bodies:()=>Object.entries(At).map(([o,c])=>e("\u{1F9EC}",c.name,c.blurb,mr[o],qo(ae,o)&&(mr[o]?"Owned":"Free"),()=>fa("type:"+o,mr[o],"the "+c.name+" body",Xt))),Parts:()=>Object.entries(ia).map(([o,c])=>e(V("img",{src:qh(o),alt:""}),It[o].n,"Body part for the workshop ("+ko.find(h=>h[0]===It[o].cat)[1]+").",c,Nh(ae,o),()=>fa("part:"+o,c,It[o].n,Xt))),Weapons:()=>t("weapon"),Abilities:()=>t("ability"),Relics:()=>t("relic"),Boosts:()=>ff.map(o=>{let c=o.consumable?ae.revives:ae.boosts[o.id]||0,h=c>=o.max,l=o.cost(c);return e(o.icon,o.name+(o.consumable?" (holding "+c+")":o.max>1?" (level "+c+" of "+o.max+")":""),o.text,l,h&&(o.consumable?"Full":"Maxed"),()=>{if(ae.points<l){Ft("Not enough points: "+o.name+" costs "+l+", you have "+ae.points+".");return}ae.points-=l,o.consumable?ae.revives++:ae.boosts[o.id]=c+1,Ln(),Xt()})})},a={Goals:"Targets that pay points when you claim them.",Records:"Your history in the Colosseum, and the hall of champions.",Weapons:"Weapons you own can turn up as rewards after a fight. A creature holds one per hand.",Abilities:"Abilities you own can turn up as rewards, if the creature has the right body for them.",Relics:"Relics are passive rewards that stack. Many only work, or work better, with the right body.",Parts:"Extra parts for building creatures. Starter creatures may already carry some of these.",Bodies:"New body types to start from.",Boosts:"Permanent upgrades, and revives."};n.replaceChildren(V("h1",null,sn==="Goals"||sn==="Records"?"Your ":"The ",V("span",null,sn==="Goals"?"Goals":sn==="Records"?"Records":"Shop"),V("small",{class:"record"},V("b",null,ae.points+" points")," ",V("button",{class:"shopbtn",onclick:()=>{sn=null,Xt()}},"Back"))),V("div",{class:"chips",style:"margin-top:10px"},Object.keys(r).map(o=>V("button",{class:o===sn?"on":"",onclick:()=>{sn=o,Xt()}},o))),V("p",{class:"note"},a[sn]+(sn==="Goals"||sn==="Records"?"":" Points come from every fight won (more for later fights) and a big bonus for the title.")),V("div",{class:"shop"},r[sn]())),n.scrollTop=0}function Xt(){var h,l;let n=Rt("start"),e=_t.get("cc.saved",[]),t=_t.get("cc.current",null);if(sn){Vv();return}let i=ae,s=_t.get("cc.run",null),r=s&&(t&&t.id===s.id?t:(e.find(u=>u.id===s.id)||{}).data),a=!!r;s&&!a&&_t.set("cc.run",null);let o=Oh(ae),c=Sf(ae);n.replaceChildren(...[V("h1",null,"Critter ",V("span",null,"Arena"),V("small",{class:"record"},V("span",{class:"runpill",id:"runpill",onclick:async()=>{let u=Ji(ae);if(u.n>=u.max)return;let d=await Wh();d.ok?(Xo(ae),Ln(),$h(),Ft("+1 run")):d.why&&Ft(d.why)}}),V("button",{class:"goalbtn"+(c?" ready":""),onclick:()=>{sn="Goals",Xt()}},"Goals"+(c?" ("+c+")":"")),V("button",{class:"shopbtn",onclick:()=>{sn="Bodies",Xt()}},"Shop")," ",V("b",null,i.points+" points")," \xB7 "+i.champions+(i.champions===1?" champion":" champions")+" \xB7 "+i.fallen+" fallen")),a&&V("div",{class:"card resume",onclick:()=>{le=JSON.parse(JSON.stringify(r)),nu(s)}},V("b",null,"Gauntlet in progress"),V("small",null,r.name+" is waiting for fight "+(s.round+1)+(s.endless?" in the Endless Pit":" of "+dn[(h=s.level)!=null?h:2].fights+" ("+dn[(l=s.level)!=null?l:2].name+")")+". Tap to return.")),!ae.seenIntro&&V("div",{class:"card resume intro"},V("b",null,"Welcome to Critter Arena"),V("small",null,"1. Pick a body below and build a critter: drag the dots to shape it, add parts, colour it."),V("small",null,"2. Hit Battle to enter the Colosseum: ten fights to the death, with a reward to choose after each win."),V("small",null,"3. How you build it matters: size is health, teeth and claws are attack, arms hold weapons. Spend the points you earn in the Shop."),V("button",{onclick:u=>{u.stopPropagation(),ae.seenIntro=1,Ln(),Xt()}},"Got it")),o&&V("div",{class:"card resume gift",onclick:()=>{let u=Mf(ae);Ln(),u&&Ft("Daily gift: +"+u.points+" points"+(u.revive?" and a revive":"")),Xt()}},V("b",null,"\u{1F381} Daily gift: +"+o.points+" points"+(o.revive?" and a revive":"")),V("small",null,"Day "+o.streak+" in a row. Come back tomorrow for more; every seventh day adds a revive. Tap to collect.")),V("h2",null,"Start from a body type"),V("div",{class:"cards"},V("div",{class:"card",onclick:()=>{let u=Object.keys(At).filter(d=>qo(ae,d));ha(ra(Math.random,{type:u[Math.floor(Math.random()*u.length)]}))}},V("div",{class:"dice"},"?"),V("b",null,"Random"),V("small",null,"Roll a surprise creature")),Object.entries(At).map(([u,d])=>qo(ae,u)?V("div",{class:"card",onclick:()=>ha(Ms(u))},V("img",{src:Ko[u]||(Ko[u]=jo(Ms(u))),alt:""}),V("b",null,d.name),V("small",null,d.blurb)):V("div",{class:"card locked",onclick:()=>fa("type:"+u,mr[u],"the "+d.name+" body",Xt)},V("img",{src:Ko[u]||(Ko[u]=jo(Ms(u))),alt:""}),V("b",null,d.name),V("small",null,"Locked \xB7 "+mr[u]+" points"))))].filter(Boolean)),$h(),(t||e.length)&&n.append(V("h2",null,"Your creatures"),V("div",{class:"cards"},t&&V("div",{class:"card",onclick:()=>ha(t)},V("img",{src:jo(t),alt:""}),V("b",null,"Continue"),V("small",null,t.name)),e.map(u=>V("div",{class:"card",onclick:()=>ha(JSON.parse(JSON.stringify(u.data)))},V("img",{src:u.thumb,alt:""}),V("b",null,u.name),V("small",null,At[u.data.type].name+(u.data.champion?" \xB7 Champion"+(u.data.champion>1?" x"+u.data.champion:""):"")),V("button",{class:"del warn",onclick:d=>{d.stopPropagation(),confirm('Delete "'+u.name+'"?')&&(_t.set("cc.saved",_t.get("cc.saved",[]).filter(p=>p.id!==u.id)),Xt())}},"\xD7")))))}Kt.orbit=new Ro(pt,Ts);Object.assign(Kt.orbit,{enableDamping:!0,dampingFactor:.12,enablePan:!1,autoRotateSpeed:2.2,rotateSpeed:.9,maxPolarAngle:Math.PI*.62,minPolarAngle:.15});Kt.orbit.addEventListener("change",Pv);br();Xt();requestAnimationFrame(Gf);window.__cc={get data(){return le},get cr(){return mt},open:ha,newCreature:Ms,select:vr,PARTS:It,TEMPLATES:At,setTab:n=>{Mn=n,Li()},camera:pt,controls:Kt,fitCamera:Kh,rebuild:vn,renderer:wt,scene:Ot,arena:ni,get meta(){return ae},saveMeta:Ln,renderStart:Xt,runsNow:Ji,enterBattle:nu,randomCreature:ra,addPartTest:n=>ui(le,n,mt.frames),pickAt:(n,e)=>(Qo({clientX:n,clientY:e}),jh()),state:()=>({sel:gt,tab:Mn,down:{...st}})};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
