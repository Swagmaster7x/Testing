(()=>{var ps={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ms={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Kf=0,du=1,jf=2;var Sd=1,eh=2,xi=3,Wi=0,tn=1,Ct=2,Vi=0,Gi=1,Fr=2,fu=3,pu=4,Qf=5,as=100,ep=101,tp=102,np=103,ip=104,sp=200,rp=201,ap=202,op=203,Nl=204,kl=205,lp=206,cp=207,hp=208,up=209,dp=210,fp=211,pp=212,mp=213,gp=214,Fl=0,Ol=1,Bl=2,qs=3,zl=4,Hl=5,Vl=6,Gl=7,wd=0,_p=1,yp=2,ai=0,xp=1,vp=2,bp=3,th=4,Mp=5,Sp=6,wp=7;var Ed=300,Zs=301,$s=302,Wl=303,Xl=304,wo=306,Or=1e3,cs=1001,Yl=1002,Tn=1003,Ep=1004;var xa=1005;var si=1006,tl=1007;var hs=1008;var Mi=1009,Td=1010,Ad=1011,Br=1012,nh=1013,us=1014,ri=1015,$r=1016,ih=1017,sh=1018,Js=1020,Rd=35902,Cd=1021,Pd=1022,Wn=1023,Id=1024,Ld=1025,Ws=1026,Ks=1027,rh=1028,ah=1029,Dd=1030,oh=1031;var lh=1033,qa=33776,Za=33777,$a=33778,Ja=33779,ql=35840,Zl=35841,$l=35842,Jl=35843,Kl=36196,jl=37492,Ql=37496,ec=37808,tc=37809,nc=37810,ic=37811,sc=37812,rc=37813,ac=37814,oc=37815,lc=37816,cc=37817,hc=37818,uc=37819,dc=37820,fc=37821,Ka=36492,pc=36494,mc=36495,Ud=36283,gc=36284,_c=36285,yc=36286;var ja=2300,xc=2301,nl=2302,mu=2400,gu=2401,_u=2402;var Tp=3200,Ap=3201;var Nd=0,Rp=1,Hi="",Ot="srgb",ir="srgb-linear",Eo="linear",ot="srgb";var As=7680;var yu=519,Cp=512,Pp=513,Ip=514,kd=515,Lp=516,Dp=517,Up=518,Np=519,xu=35044;var vu="300 es",vi=2e3,Qa=2001,Si=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let i=this._listeners[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],bu=1234567,Ur=Math.PI/180,zr=180/Math.PI;function sr(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Qt[n&255]+Qt[n>>8&255]+Qt[n>>16&255]+Qt[n>>24&255]+"-"+Qt[e&255]+Qt[e>>8&255]+"-"+Qt[e>>16&15|64]+Qt[e>>24&255]+"-"+Qt[t&63|128]+Qt[t>>8&255]+"-"+Qt[t>>16&255]+Qt[t>>24&255]+Qt[i&255]+Qt[i>>8&255]+Qt[i>>16&255]+Qt[i>>24&255]).toLowerCase()}function It(n,e,t){return Math.max(e,Math.min(t,n))}function ch(n,e){return(n%e+e)%e}function kp(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Fp(n,e,t){return n!==e?(t-n)/(e-n):0}function Nr(n,e,t){return(1-t)*n+t*e}function Op(n,e,t,i){return Nr(n,e,1-Math.exp(-t*i))}function Bp(n,e=1){return e-Math.abs(ch(n,e*2)-e)}function zp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Hp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Vp(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Gp(n,e){return n+Math.random()*(e-n)}function Wp(n){return n*(.5-Math.random())}function Xp(n){n!==void 0&&(bu=n);let e=bu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Yp(n){return n*Ur}function qp(n){return n*zr}function Zp(n){return(n&n-1)===0&&n!==0}function $p(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Jp(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Kp(n,e,t,i,s){let r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),h=r((e+i)/2),l=a((e+i)/2),u=r((e-i)/2),f=a((e-i)/2),p=r((i-e)/2),g=a((i-e)/2);switch(s){case"XYX":n.set(o*l,c*u,c*f,o*h);break;case"YZY":n.set(c*f,o*l,c*u,o*h);break;case"ZXZ":n.set(c*u,c*f,o*l,o*h);break;case"XZX":n.set(o*l,c*g,c*p,o*h);break;case"YXY":n.set(c*p,o*l,c*g,o*h);break;case"ZYZ":n.set(c*g,c*p,o*l,o*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Vs(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function sn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Jr={DEG2RAD:Ur,RAD2DEG:zr,generateUUID:sr,clamp:It,euclideanModulo:ch,mapLinear:kp,inverseLerp:Fp,lerp:Nr,damp:Op,pingpong:Bp,smoothstep:zp,smootherstep:Hp,randInt:Vp,randFloat:Gp,randFloatSpread:Wp,seededRandom:Xp,degToRad:Yp,radToDeg:qp,isPowerOfTwo:Zp,ceilPowerOfTwo:$p,floorPowerOfTwo:Jp,setQuaternionFromProperEuler:Kp,normalize:sn,denormalize:Vs},Te=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(It(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ze=class n{constructor(e,t,i,s,r,a,o,c,h){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,h)}set(e,t,i,s,r,a,o,c,h){let l=this.elements;return l[0]=e,l[1]=s,l[2]=o,l[3]=t,l[4]=r,l[5]=c,l[6]=i,l[7]=a,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],h=i[1],l=i[4],u=i[7],f=i[2],p=i[5],g=i[8],_=s[0],m=s[3],d=s[6],y=s[1],v=s[4],x=s[7],P=s[2],T=s[5],A=s[8];return r[0]=a*_+o*y+c*P,r[3]=a*m+o*v+c*T,r[6]=a*d+o*x+c*A,r[1]=h*_+l*y+u*P,r[4]=h*m+l*v+u*T,r[7]=h*d+l*x+u*A,r[2]=f*_+p*y+g*P,r[5]=f*m+p*v+g*T,r[8]=f*d+p*x+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],l=e[8];return t*a*l-t*o*h-i*r*l+i*o*c+s*r*h-s*a*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],l=e[8],u=l*a-o*h,f=o*c-l*r,p=h*r-a*c,g=t*u+i*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(s*h-l*i)*_,e[2]=(o*i-s*a)*_,e[3]=f*_,e[4]=(l*t-s*c)*_,e[5]=(s*r-o*t)*_,e[6]=p*_,e[7]=(i*c-h*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){let c=Math.cos(r),h=Math.sin(r);return this.set(i*c,i*h,-i*(c*a+h*o)+a+e,-s*h,s*c,-s*(-h*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(il.makeScale(e,t)),this}rotate(e){return this.premultiply(il.makeRotation(-e)),this}translate(e,t){return this.premultiply(il.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},il=new ze;function Fd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function eo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function jp(){let n=eo("canvas");return n.style.display="block",n}var Mu={};function Lr(n){n in Mu||(Mu[n]=!0,console.warn(n))}function Qp(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function em(n){let e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function tm(n){let e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var Qe={enabled:!0,workingColorSpace:ir,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===ot&&(n.r=bi(n.r),n.g=bi(n.g),n.b=bi(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===ot&&(n.r=Xs(n.r),n.g=Xs(n.g),n.b=Xs(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Hi?Eo:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function bi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Xs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Su=[.64,.33,.3,.6,.15,.06],wu=[.2126,.7152,.0722],Eu=[.3127,.329],Tu=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Au=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Qe.define({[ir]:{primaries:Su,whitePoint:Eu,transfer:Eo,toXYZ:Tu,fromXYZ:Au,luminanceCoefficients:wu,workingColorSpaceConfig:{unpackColorSpace:Ot},outputColorSpaceConfig:{drawingBufferColorSpace:Ot}},[Ot]:{primaries:Su,whitePoint:Eu,transfer:ot,toXYZ:Tu,fromXYZ:Au,luminanceCoefficients:wu,outputColorSpaceConfig:{drawingBufferColorSpace:Ot}}});var Rs,vc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Rs===void 0&&(Rs=eo("canvas")),Rs.width=e.width,Rs.height=e.height;let i=Rs.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Rs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=eo("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=bi(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(bi(t[i]/255)*255):t[i]=bi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},nm=0,to=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nm++}),this.uuid=sr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(sl(s[a].image)):r.push(sl(s[a]))}else r=sl(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function sl(n){return typeof HTMLImageElement!="undefined"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&n instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&n instanceof ImageBitmap?vc.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var im=0,pn=class n extends Si{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=cs,s=cs,r=si,a=hs,o=Wn,c=Mi,h=n.DEFAULT_ANISOTROPY,l=Hi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:im++}),this.uuid=sr(),this.name="",this.source=new to(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ed)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Or:e.x=e.x-Math.floor(e.x);break;case cs:e.x=e.x<0?0:1;break;case Yl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Or:e.y=e.y-Math.floor(e.y);break;case cs:e.y=e.y<0?0:1;break;case Yl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};pn.DEFAULT_IMAGE=null;pn.DEFAULT_MAPPING=Ed;pn.DEFAULT_ANISOTROPY=1;var lt=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,h=c[0],l=c[4],u=c[8],f=c[1],p=c[5],g=c[9],_=c[2],m=c[6],d=c[10];if(Math.abs(l-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(h+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(h+1)/2,x=(p+1)/2,P=(d+1)/2,T=(l+f)/4,A=(u+_)/4,C=(g+m)/4;return v>x&&v>P?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=T/i,r=A/i):x>P?x<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),i=T/s,r=C/s):P<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),i=A/r,s=C/r),this.set(i,s,r,t),this}let y=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-l)*(f-l));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-_)/y,this.z=(f-l)/y,this.w=Math.acos((h+p+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},bc=class extends Si{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t);let s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:si,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let r=new pn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new to(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xn=class extends bc{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},no=class extends pn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Tn,this.minFilter=Tn,this.wrapR=cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Mc=class extends pn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Tn,this.minFilter=Tn,this.wrapR=cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var qt=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let c=i[s+0],h=i[s+1],l=i[s+2],u=i[s+3],f=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){e[t+0]=c,e[t+1]=h,e[t+2]=l,e[t+3]=u;return}if(o===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(u!==_||c!==f||h!==p||l!==g){let m=1-o,d=c*f+h*p+l*g+u*_,y=d>=0?1:-1,v=1-d*d;if(v>Number.EPSILON){let P=Math.sqrt(v),T=Math.atan2(P,d*y);m=Math.sin(m*T)/P,o=Math.sin(o*T)/P}let x=o*y;if(c=c*m+f*x,h=h*m+p*x,l=l*m+g*x,u=u*m+_*x,m===1-o){let P=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=P,h*=P,l*=P,u*=P}}e[t]=c,e[t+1]=h,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){let o=i[s],c=i[s+1],h=i[s+2],l=i[s+3],u=r[a],f=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+l*u+c*p-h*f,e[t+1]=c*g+l*f+h*u-o*p,e[t+2]=h*g+l*p+o*f-c*u,e[t+3]=l*g-o*u-c*f-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,h=o(i/2),l=o(s/2),u=o(r/2),f=c(i/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=f*l*u+h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u-f*p*g;break;case"YXZ":this._x=f*l*u+h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u+f*p*g;break;case"ZXY":this._x=f*l*u-h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u-f*p*g;break;case"ZYX":this._x=f*l*u-h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u+f*p*g;break;case"YZX":this._x=f*l*u+h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u-f*p*g;break;case"XZY":this._x=f*l*u-h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],h=t[2],l=t[6],u=t[10],f=i+o+u;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(l-c)*p,this._y=(r-h)*p,this._z=(a-s)*p}else if(i>o&&i>u){let p=2*Math.sqrt(1+i-o-u);this._w=(l-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+h)/p}else if(o>u){let p=2*Math.sqrt(1+o-i-u);this._w=(r-h)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+l)/p}else{let p=2*Math.sqrt(1+u-i-o);this._w=(a-s)/p,this._x=(r+h)/p,this._y=(c+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(It(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,h=t._z,l=t._w;return this._x=i*l+a*o+s*h-r*c,this._y=s*l+a*c+r*o-i*h,this._z=r*l+a*h+i*c-s*o,this._w=a*l-i*o-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let h=Math.sqrt(c),l=Math.atan2(h,o),u=Math.sin((1-t)*l)/h,f=Math.sin(t*l)/h;return this._w=a*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ru.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ru.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,h=2*(a*s-o*i),l=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+c*h+a*u-o*l,this.y=i+c*l+o*h-r*u,this.z=s+c*u+r*l-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return rl.copy(this).projectOnVector(e),this.sub(rl)}reflect(e){return this.sub(rl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(It(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},rl=new I,Ru=new qt,An=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Hn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Hn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Hn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Hn):Hn.fromBufferAttribute(r,a),Hn.applyMatrix4(e.matrixWorld),this.expandByPoint(Hn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),va.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),va.copy(i.boundingBox)),va.applyMatrix4(e.matrixWorld),this.union(va)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Hn),Hn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wr),ba.subVectors(this.max,wr),Cs.subVectors(e.a,wr),Ps.subVectors(e.b,wr),Is.subVectors(e.c,wr),Ni.subVectors(Ps,Cs),ki.subVectors(Is,Ps),Qi.subVectors(Cs,Is);let t=[0,-Ni.z,Ni.y,0,-ki.z,ki.y,0,-Qi.z,Qi.y,Ni.z,0,-Ni.x,ki.z,0,-ki.x,Qi.z,0,-Qi.x,-Ni.y,Ni.x,0,-ki.y,ki.x,0,-Qi.y,Qi.x,0];return!al(t,Cs,Ps,Is,ba)||(t=[1,0,0,0,1,0,0,0,1],!al(t,Cs,Ps,Is,ba))?!1:(Ma.crossVectors(Ni,ki),t=[Ma.x,Ma.y,Ma.z],al(t,Cs,Ps,Is,ba))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Hn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Hn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(pi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},pi=[new I,new I,new I,new I,new I,new I,new I,new I],Hn=new I,va=new An,Cs=new I,Ps=new I,Is=new I,Ni=new I,ki=new I,Qi=new I,wr=new I,ba=new I,Ma=new I,es=new I;function al(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){es.fromArray(n,r);let o=s.x*Math.abs(es.x)+s.y*Math.abs(es.y)+s.z*Math.abs(es.z),c=e.dot(es),h=t.dot(es),l=i.dot(es);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>o)return!1}return!0}var sm=new An,Er=new I,ol=new I,wi=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):sm.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Er.subVectors(e,this.center);let t=Er.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Er,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ol.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Er.copy(e.center).add(ol)),this.expandByPoint(Er.copy(e.center).sub(ol))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},mi=new I,ll=new I,Sa=new I,Fi=new I,cl=new I,wa=new I,hl=new I,Xi=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(mi.copy(this.origin).addScaledVector(this.direction,t),mi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){ll.copy(e).add(t).multiplyScalar(.5),Sa.copy(t).sub(e).normalize(),Fi.copy(this.origin).sub(ll);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Sa),o=Fi.dot(this.direction),c=-Fi.dot(Sa),h=Fi.lengthSq(),l=Math.abs(1-a*a),u,f,p,g;if(l>0)if(u=a*c-o,f=a*o-c,g=r*l,u>=0)if(f>=-g)if(f<=g){let _=1/l;u*=_,f*=_,p=u*(u+a*f+2*o)+f*(a*u+f+2*c)+h}else f=r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+h;else f=-r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+h;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+h):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ll).addScaledVector(Sa,f),p}intersectSphere(e,t){mi.subVectors(e.center,this.origin);let i=mi.dot(this.direction),s=mi.dot(mi)-i*i,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,c,h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,f=this.origin;return h>=0?(i=(e.min.x-f.x)*h,s=(e.max.x-f.x)*h):(i=(e.max.x-f.x)*h,s=(e.min.x-f.x)*h),l>=0?(r=(e.min.y-f.y)*l,a=(e.max.y-f.y)*l):(r=(e.max.y-f.y)*l,a=(e.min.y-f.y)*l),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,mi)!==null}intersectTriangle(e,t,i,s,r){cl.subVectors(t,e),wa.subVectors(i,e),hl.crossVectors(cl,wa);let a=this.direction.dot(hl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Fi.subVectors(this.origin,e);let c=o*this.direction.dot(wa.crossVectors(Fi,wa));if(c<0)return null;let h=o*this.direction.dot(cl.cross(Fi));if(h<0||c+h>a)return null;let l=-o*Fi.dot(hl);return l<0?null:this.at(l/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},We=class n{constructor(e,t,i,s,r,a,o,c,h,l,u,f,p,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,h,l,u,f,p,g,_,m)}set(e,t,i,s,r,a,o,c,h,l,u,f,p,g,_,m){let d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=c,d[2]=h,d[6]=l,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/Ls.setFromMatrixColumn(e,0).length(),r=1/Ls.setFromMatrixColumn(e,1).length(),a=1/Ls.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=a*l,p=a*u,g=o*l,_=o*u;t[0]=c*l,t[4]=-c*u,t[8]=h,t[1]=p+g*h,t[5]=f-_*h,t[9]=-o*c,t[2]=_-f*h,t[6]=g+p*h,t[10]=a*c}else if(e.order==="YXZ"){let f=c*l,p=c*u,g=h*l,_=h*u;t[0]=f+_*o,t[4]=g*o-p,t[8]=a*h,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=p*o-g,t[6]=_+f*o,t[10]=a*c}else if(e.order==="ZXY"){let f=c*l,p=c*u,g=h*l,_=h*u;t[0]=f-_*o,t[4]=-a*u,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*l,t[9]=_-f*o,t[2]=-a*h,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let f=a*l,p=a*u,g=o*l,_=o*u;t[0]=c*l,t[4]=g*h-p,t[8]=f*h+_,t[1]=c*u,t[5]=_*h+f,t[9]=p*h-g,t[2]=-h,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let f=a*c,p=a*h,g=o*c,_=o*h;t[0]=c*l,t[4]=_-f*u,t[8]=g*u+p,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-h*l,t[6]=p*u+g,t[10]=f-_*u}else if(e.order==="XZY"){let f=a*c,p=a*h,g=o*c,_=o*h;t[0]=c*l,t[4]=-u,t[8]=h*l,t[1]=f*u+_,t[5]=a*l,t[9]=p*u-g,t[2]=g*u-p,t[6]=o*l,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(rm,e,am)}lookAt(e,t,i){let s=this.elements;return Sn.subVectors(e,t),Sn.lengthSq()===0&&(Sn.z=1),Sn.normalize(),Oi.crossVectors(i,Sn),Oi.lengthSq()===0&&(Math.abs(i.z)===1?Sn.x+=1e-4:Sn.z+=1e-4,Sn.normalize(),Oi.crossVectors(i,Sn)),Oi.normalize(),Ea.crossVectors(Sn,Oi),s[0]=Oi.x,s[4]=Ea.x,s[8]=Sn.x,s[1]=Oi.y,s[5]=Ea.y,s[9]=Sn.y,s[2]=Oi.z,s[6]=Ea.z,s[10]=Sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],h=i[12],l=i[1],u=i[5],f=i[9],p=i[13],g=i[2],_=i[6],m=i[10],d=i[14],y=i[3],v=i[7],x=i[11],P=i[15],T=s[0],A=s[4],C=s[8],M=s[12],b=s[1],L=s[5],z=s[9],V=s[13],$=s[2],ie=s[6],K=s[10],ce=s[14],J=s[3],fe=s[7],w=s[11],B=s[15];return r[0]=a*T+o*b+c*$+h*J,r[4]=a*A+o*L+c*ie+h*fe,r[8]=a*C+o*z+c*K+h*w,r[12]=a*M+o*V+c*ce+h*B,r[1]=l*T+u*b+f*$+p*J,r[5]=l*A+u*L+f*ie+p*fe,r[9]=l*C+u*z+f*K+p*w,r[13]=l*M+u*V+f*ce+p*B,r[2]=g*T+_*b+m*$+d*J,r[6]=g*A+_*L+m*ie+d*fe,r[10]=g*C+_*z+m*K+d*w,r[14]=g*M+_*V+m*ce+d*B,r[3]=y*T+v*b+x*$+P*J,r[7]=y*A+v*L+x*ie+P*fe,r[11]=y*C+v*z+x*K+P*w,r[15]=y*M+v*V+x*ce+P*B,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],h=e[13],l=e[2],u=e[6],f=e[10],p=e[14],g=e[3],_=e[7],m=e[11],d=e[15];return g*(+r*c*u-s*h*u-r*o*f+i*h*f+s*o*p-i*c*p)+_*(+t*c*p-t*h*f+r*a*f-s*a*p+s*h*l-r*c*l)+m*(+t*h*u-t*o*p-r*a*u+i*a*p+r*o*l-i*h*l)+d*(-s*o*l-t*c*u+t*o*f+s*a*u-i*a*f+i*c*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],l=e[8],u=e[9],f=e[10],p=e[11],g=e[12],_=e[13],m=e[14],d=e[15],y=u*m*h-_*f*h+_*c*p-o*m*p-u*c*d+o*f*d,v=g*f*h-l*m*h-g*c*p+a*m*p+l*c*d-a*f*d,x=l*_*h-g*u*h+g*o*p-a*_*p-l*o*d+a*u*d,P=g*u*c-l*_*c-g*o*f+a*_*f+l*o*m-a*u*m,T=t*y+i*v+s*x+r*P;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/T;return e[0]=y*A,e[1]=(_*f*r-u*m*r-_*s*p+i*m*p+u*s*d-i*f*d)*A,e[2]=(o*m*r-_*c*r+_*s*h-i*m*h-o*s*d+i*c*d)*A,e[3]=(u*c*r-o*f*r-u*s*h+i*f*h+o*s*p-i*c*p)*A,e[4]=v*A,e[5]=(l*m*r-g*f*r+g*s*p-t*m*p-l*s*d+t*f*d)*A,e[6]=(g*c*r-a*m*r-g*s*h+t*m*h+a*s*d-t*c*d)*A,e[7]=(a*f*r-l*c*r+l*s*h-t*f*h-a*s*p+t*c*p)*A,e[8]=x*A,e[9]=(g*u*r-l*_*r-g*i*p+t*_*p+l*i*d-t*u*d)*A,e[10]=(a*_*r-g*o*r+g*i*h-t*_*h-a*i*d+t*o*d)*A,e[11]=(l*o*r-a*u*r-l*i*h+t*u*h+a*i*p-t*o*p)*A,e[12]=P*A,e[13]=(l*_*s-g*u*s+g*i*f-t*_*f-l*i*m+t*u*m)*A,e[14]=(g*o*s-a*_*s-g*i*c+t*_*c+a*i*m-t*o*m)*A,e[15]=(a*u*s-l*o*s+l*i*c-t*u*c-a*i*f+t*o*f)*A,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,h=r*a,l=r*o;return this.set(h*a+i,h*o-s*c,h*c+s*o,0,h*o+s*c,l*o+i,l*c-s*a,0,h*c-s*o,l*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,h=r+r,l=a+a,u=o+o,f=r*h,p=r*l,g=r*u,_=a*l,m=a*u,d=o*u,y=c*h,v=c*l,x=c*u,P=i.x,T=i.y,A=i.z;return s[0]=(1-(_+d))*P,s[1]=(p+x)*P,s[2]=(g-v)*P,s[3]=0,s[4]=(p-x)*T,s[5]=(1-(f+d))*T,s[6]=(m+y)*T,s[7]=0,s[8]=(g+v)*A,s[9]=(m-y)*A,s[10]=(1-(f+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=Ls.set(s[0],s[1],s[2]).length(),a=Ls.set(s[4],s[5],s[6]).length(),o=Ls.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Vn.copy(this);let h=1/r,l=1/a,u=1/o;return Vn.elements[0]*=h,Vn.elements[1]*=h,Vn.elements[2]*=h,Vn.elements[4]*=l,Vn.elements[5]*=l,Vn.elements[6]*=l,Vn.elements[8]*=u,Vn.elements[9]*=u,Vn.elements[10]*=u,t.setFromRotationMatrix(Vn),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=vi){let c=this.elements,h=2*r/(t-e),l=2*r/(i-s),u=(t+e)/(t-e),f=(i+s)/(i-s),p,g;if(o===vi)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Qa)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=vi){let c=this.elements,h=1/(t-e),l=1/(i-s),u=1/(a-r),f=(t+e)*h,p=(i+s)*l,g,_;if(o===vi)g=(a+r)*u,_=-2*u;else if(o===Qa)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Ls=new I,Vn=new We,rm=new I(0,0,0),am=new I(1,1,1),Oi=new I,Ea=new I,Sn=new I,Cu=new We,Pu=new qt,mn=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],l=s[9],u=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(It(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-It(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(It(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-It(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(It(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-It(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-l,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Cu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Cu,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Pu.setFromEuler(this),this.setFromQuaternion(Pu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};mn.DEFAULT_ORDER="XYZ";var Hr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},om=0,Iu=new I,Ds=new qt,gi=new We,Ta=new I,Tr=new I,lm=new I,cm=new qt,Lu=new I(1,0,0),Du=new I(0,1,0),Uu=new I(0,0,1),Nu={type:"added"},hm={type:"removed"},Us={type:"childadded",child:null},ul={type:"childremoved",child:null},Zt=class n extends Si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:om++}),this.uuid=sr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new I,t=new mn,i=new qt,s=new I(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new We},normalMatrix:{value:new ze}}),this.matrix=new We,this.matrixWorld=new We,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Hr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ds.setFromAxisAngle(e,t),this.quaternion.multiply(Ds),this}rotateOnWorldAxis(e,t){return Ds.setFromAxisAngle(e,t),this.quaternion.premultiply(Ds),this}rotateX(e){return this.rotateOnAxis(Lu,e)}rotateY(e){return this.rotateOnAxis(Du,e)}rotateZ(e){return this.rotateOnAxis(Uu,e)}translateOnAxis(e,t){return Iu.copy(e).applyQuaternion(this.quaternion),this.position.add(Iu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Lu,e)}translateY(e){return this.translateOnAxis(Du,e)}translateZ(e){return this.translateOnAxis(Uu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(gi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ta.copy(e):Ta.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Tr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gi.lookAt(Tr,Ta,this.up):gi.lookAt(Ta,Tr,this.up),this.quaternion.setFromRotationMatrix(gi),s&&(gi.extractRotation(s.matrixWorld),Ds.setFromRotationMatrix(gi),this.quaternion.premultiply(Ds.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Nu),Us.child=e,this.dispatchEvent(Us),Us.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(hm),ul.child=e,this.dispatchEvent(ul),ul.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),gi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),gi.multiply(e.parent.matrixWorld)),e.applyMatrix4(gi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Nu),Us.child=e,this.dispatchEvent(Us),Us.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Tr,e,lm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Tr,cm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){let u=c[h];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),h=a(e.textures),l=a(e.images),u=a(e.shapes),f=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),l.length>0&&(i.images=l),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){let c=[];for(let h in o){let l=o[h];delete l.metadata,c.push(l)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Zt.DEFAULT_UP=new I(0,1,0);Zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Gn=new I,_i=new I,dl=new I,yi=new I,Ns=new I,ks=new I,ku=new I,fl=new I,pl=new I,ml=new I,gl=new lt,_l=new lt,yl=new lt,os=class n{constructor(e=new I,t=new I,i=new I){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Gn.subVectors(e,t),s.cross(Gn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Gn.subVectors(s,t),_i.subVectors(i,t),dl.subVectors(e,t);let a=Gn.dot(Gn),o=Gn.dot(_i),c=Gn.dot(dl),h=_i.dot(_i),l=_i.dot(dl),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;let f=1/u,p=(h*c-o*l)*f,g=(a*l-o*c)*f;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,yi)===null?!1:yi.x>=0&&yi.y>=0&&yi.x+yi.y<=1}static getInterpolation(e,t,i,s,r,a,o,c){return this.getBarycoord(e,t,i,s,yi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,yi.x),c.addScaledVector(a,yi.y),c.addScaledVector(o,yi.z),c)}static getInterpolatedAttribute(e,t,i,s,r,a){return gl.setScalar(0),_l.setScalar(0),yl.setScalar(0),gl.fromBufferAttribute(e,t),_l.fromBufferAttribute(e,i),yl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(gl,r.x),a.addScaledVector(_l,r.y),a.addScaledVector(yl,r.z),a}static isFrontFacing(e,t,i,s){return Gn.subVectors(i,t),_i.subVectors(e,t),Gn.cross(_i).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Gn.subVectors(this.c,this.b),_i.subVectors(this.a,this.b),Gn.cross(_i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,a,o;Ns.subVectors(s,i),ks.subVectors(r,i),fl.subVectors(e,i);let c=Ns.dot(fl),h=ks.dot(fl);if(c<=0&&h<=0)return t.copy(i);pl.subVectors(e,s);let l=Ns.dot(pl),u=ks.dot(pl);if(l>=0&&u<=l)return t.copy(s);let f=c*u-l*h;if(f<=0&&c>=0&&l<=0)return a=c/(c-l),t.copy(i).addScaledVector(Ns,a);ml.subVectors(e,r);let p=Ns.dot(ml),g=ks.dot(ml);if(g>=0&&p<=g)return t.copy(r);let _=p*h-c*g;if(_<=0&&h>=0&&g<=0)return o=h/(h-g),t.copy(i).addScaledVector(ks,o);let m=l*g-p*u;if(m<=0&&u-l>=0&&p-g>=0)return ku.subVectors(r,s),o=(u-l)/(u-l+(p-g)),t.copy(s).addScaledVector(ku,o);let d=1/(m+_+f);return a=_*d,o=f*d,t.copy(i).addScaledVector(Ns,a).addScaledVector(ks,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Od={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bi={h:0,s:0,l:0},Aa={h:0,s:0,l:0};function xl(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Ue=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ot){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Qe.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=Qe.workingColorSpace){if(e=ch(e,1),t=It(t,0,1),i=It(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=xl(a,r,e+1/3),this.g=xl(a,r,e),this.b=xl(a,r,e-1/3)}return Qe.toWorkingColorSpace(this,s),this}setStyle(e,t=Ot){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ot){let i=Od[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=bi(e.r),this.g=bi(e.g),this.b=bi(e.b),this}copyLinearToSRGB(e){return this.r=Xs(e.r),this.g=Xs(e.g),this.b=Xs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ot){return Qe.fromWorkingColorSpace(en.copy(this),e),Math.round(It(en.r*255,0,255))*65536+Math.round(It(en.g*255,0,255))*256+Math.round(It(en.b*255,0,255))}getHexString(e=Ot){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.fromWorkingColorSpace(en.copy(this),t);let i=en.r,s=en.g,r=en.b,a=Math.max(i,s,r),o=Math.min(i,s,r),c,h,l=(o+a)/2;if(o===a)c=0,h=0;else{let u=a-o;switch(h=l<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=l,e}getRGB(e,t=Qe.workingColorSpace){return Qe.fromWorkingColorSpace(en.copy(this),t),e.r=en.r,e.g=en.g,e.b=en.b,e}getStyle(e=Ot){Qe.fromWorkingColorSpace(en.copy(this),e);let t=en.r,i=en.g,s=en.b;return e!==Ot?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Bi),this.setHSL(Bi.h+e,Bi.s+t,Bi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Bi),e.getHSL(Aa);let i=Nr(Bi.h,Aa.h,t),s=Nr(Bi.s,Aa.s,t),r=Nr(Bi.l,Aa.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},en=new Ue;Ue.NAMES=Od;var um=0,Ei=class extends Si{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=sr(),this.name="",this.blending=Gi,this.side=Wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nl,this.blendDst=kl,this.blendEquation=as,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ue(0,0,0),this.blendAlpha=0,this.depthFunc=qs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=As,this.stencilZFail=As,this.stencilZPass=As,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Gi&&(i.blending=this.blending),this.side!==Wi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Nl&&(i.blendSrc=this.blendSrc),this.blendDst!==kl&&(i.blendDst=this.blendDst),this.blendEquation!==as&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==qs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==yu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==As&&(i.stencilFail=this.stencilFail),this.stencilZFail!==As&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==As&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Bt=class extends Ei{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=wd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Rt=new I,Ra=new Te,xt=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=xu,this.updateRanges=[],this.gpuType=ri,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ra.fromBufferAttribute(this,t),Ra.applyMatrix3(e),this.setXY(t,Ra.x,Ra.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Vs(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=sn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Vs(t,this.array)),t}setX(e,t){return this.normalized&&(t=sn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Vs(t,this.array)),t}setY(e,t){return this.normalized&&(t=sn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Vs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=sn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Vs(t,this.array)),t}setW(e,t){return this.normalized&&(t=sn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=sn(t,this.array),i=sn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=sn(t,this.array),i=sn(i,this.array),s=sn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=sn(t,this.array),i=sn(i,this.array),s=sn(s,this.array),r=sn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==xu&&(e.usage=this.usage),e}};var io=class extends xt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var so=class extends xt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var $e=class extends xt{constructor(e,t,i){super(new Float32Array(e),t,i)}},dm=0,In=new We,vl=new Zt,Fs=new I,wn=new An,Ar=new An,Ft=new I,ct=class n extends Si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:dm++}),this.uuid=sr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Fd(e)?so:io)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new ze().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return In.makeRotationFromQuaternion(e),this.applyMatrix4(In),this}rotateX(e){return In.makeRotationX(e),this.applyMatrix4(In),this}rotateY(e){return In.makeRotationY(e),this.applyMatrix4(In),this}rotateZ(e){return In.makeRotationZ(e),this.applyMatrix4(In),this}translate(e,t,i){return In.makeTranslation(e,t,i),this.applyMatrix4(In),this}scale(e,t,i){return In.makeScale(e,t,i),this.applyMatrix4(In),this}lookAt(e){return vl.lookAt(e),vl.updateMatrix(),this.applyMatrix4(vl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fs).negate(),this.translate(Fs.x,Fs.y,Fs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new $e(i,3))}else{for(let i=0,s=t.count;i<s;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];wn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,wn.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,wn.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(wn.min),this.boundingBox.expandByPoint(wn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let i=this.boundingSphere.center;if(wn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ar.setFromBufferAttribute(o),this.morphTargetsRelative?(Ft.addVectors(wn.min,Ar.min),wn.expandByPoint(Ft),Ft.addVectors(wn.max,Ar.max),wn.expandByPoint(Ft)):(wn.expandByPoint(Ar.min),wn.expandByPoint(Ar.max))}wn.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Ft.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ft));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let h=0,l=o.count;h<l;h++)Ft.fromBufferAttribute(o,h),c&&(Fs.fromBufferAttribute(e,h),Ft.add(Fs)),s=Math.max(s,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new xt(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let C=0;C<i.count;C++)o[C]=new I,c[C]=new I;let h=new I,l=new I,u=new I,f=new Te,p=new Te,g=new Te,_=new I,m=new I;function d(C,M,b){h.fromBufferAttribute(i,C),l.fromBufferAttribute(i,M),u.fromBufferAttribute(i,b),f.fromBufferAttribute(r,C),p.fromBufferAttribute(r,M),g.fromBufferAttribute(r,b),l.sub(h),u.sub(h),p.sub(f),g.sub(f);let L=1/(p.x*g.y-g.x*p.y);isFinite(L)&&(_.copy(l).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(L),m.copy(u).multiplyScalar(p.x).addScaledVector(l,-g.x).multiplyScalar(L),o[C].add(_),o[M].add(_),o[b].add(_),c[C].add(m),c[M].add(m),c[b].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let C=0,M=y.length;C<M;++C){let b=y[C],L=b.start,z=b.count;for(let V=L,$=L+z;V<$;V+=3)d(e.getX(V+0),e.getX(V+1),e.getX(V+2))}let v=new I,x=new I,P=new I,T=new I;function A(C){P.fromBufferAttribute(s,C),T.copy(P);let M=o[C];v.copy(M),v.sub(P.multiplyScalar(P.dot(M))).normalize(),x.crossVectors(T,M);let L=x.dot(c[C])<0?-1:1;a.setXYZW(C,v.x,v.y,v.z,L)}for(let C=0,M=y.length;C<M;++C){let b=y[C],L=b.start,z=b.count;for(let V=L,$=L+z;V<$;V+=3)A(e.getX(V+0)),A(e.getX(V+1)),A(e.getX(V+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new xt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);let s=new I,r=new I,a=new I,o=new I,c=new I,h=new I,l=new I,u=new I;if(e)for(let f=0,p=e.count;f<p;f+=3){let g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,m),o.add(l),c.add(l),h.add(l),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,h.x,h.y,h.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),i.setXYZ(f+0,l.x,l.y,l.z),i.setXYZ(f+1,l.x,l.y,l.z),i.setXYZ(f+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ft.fromBufferAttribute(e,t),Ft.normalize(),e.setXYZ(t,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(o,c){let h=o.array,l=o.itemSize,u=o.normalized,f=new h.constructor(c.length*l),p=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*l;for(let d=0;d<l;d++)f[g++]=h[p++]}return new xt(f,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let o in s){let c=s[o],h=e(c,i);t.setAttribute(o,h)}let r=this.morphAttributes;for(let o in r){let c=[],h=r[o];for(let l=0,u=h.length;l<u;l++){let f=h[l],p=e(f,i);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let h=a[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let h=i[c];e.data.attributes[c]=h.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let h=this.morphAttributes[c],l=[];for(let u=0,f=h.length;u<f;u++){let p=h[u];l.push(p.toJSON(e.data))}l.length>0&&(s[c]=l,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let s=e.attributes;for(let h in s){let l=s[h];this.setAttribute(h,l.clone(t))}let r=e.morphAttributes;for(let h in r){let l=[],u=r[h];for(let f=0,p=u.length;f<p;f++)l.push(u[f].clone(t));this.morphAttributes[h]=l}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let h=0,l=a.length;h<l;h++){let u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fu=new We,ts=new Xi,Ca=new wi,Ou=new I,Pa=new I,Ia=new I,La=new I,bl=new I,Da=new I,Bu=new I,Ua=new I,ke=class extends Zt{constructor(e=new ct,t=new Bt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Da.set(0,0,0);for(let c=0,h=r.length;c<h;c++){let l=o[c],u=r[c];l!==0&&(bl.fromBufferAttribute(u,e),a?Da.addScaledVector(bl,l):Da.addScaledVector(bl.sub(t),l))}t.add(Da)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ca.copy(i.boundingSphere),Ca.applyMatrix4(r),ts.copy(e.ray).recast(e.near),!(Ca.containsPoint(ts.origin)===!1&&(ts.intersectSphere(Ca,Ou)===null||ts.origin.distanceToSquared(Ou)>(e.far-e.near)**2))&&(Fu.copy(r).invert(),ts.copy(e.ray).applyMatrix4(Fu),!(i.boundingBox!==null&&ts.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ts)))}_computeIntersections(e,t,i){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){let m=f[g],d=a[m.materialIndex],y=Math.max(m.start,p.start),v=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let x=y,P=v;x<P;x+=3){let T=o.getX(x),A=o.getX(x+1),C=o.getX(x+2);s=Na(this,d,e,i,h,l,u,T,A,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){let y=o.getX(m),v=o.getX(m+1),x=o.getX(m+2);s=Na(this,a,e,i,h,l,u,y,v,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){let m=f[g],d=a[m.materialIndex],y=Math.max(m.start,p.start),v=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let x=y,P=v;x<P;x+=3){let T=x,A=x+1,C=x+2;s=Na(this,d,e,i,h,l,u,T,A,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){let y=m,v=m+1,x=m+2;s=Na(this,a,e,i,h,l,u,y,v,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function fm(n,e,t,i,s,r,a,o){let c;if(e.side===tn?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===Wi,o),c===null)return null;Ua.copy(o),Ua.applyMatrix4(n.matrixWorld);let h=t.ray.origin.distanceTo(Ua);return h<t.near||h>t.far?null:{distance:h,point:Ua.clone(),object:n}}function Na(n,e,t,i,s,r,a,o,c,h){n.getVertexPosition(o,Pa),n.getVertexPosition(c,Ia),n.getVertexPosition(h,La);let l=fm(n,e,t,i,Pa,Ia,La,Bu);if(l){let u=new I;os.getBarycoord(Bu,Pa,Ia,La,u),s&&(l.uv=os.getInterpolatedAttribute(s,o,c,h,u,new Te)),r&&(l.uv1=os.getInterpolatedAttribute(r,o,c,h,u,new Te)),a&&(l.normal=os.getInterpolatedAttribute(a,o,c,h,u,new I),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));let f={a:o,b:c,c:h,normal:new I,materialIndex:0};os.getNormal(Pa,Ia,La,f.normal),l.face=f,l.barycoord=u}return l}var Yn=class n extends ct{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],h=[],l=[],u=[],f=0,p=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new $e(h,3)),this.setAttribute("normal",new $e(l,3)),this.setAttribute("uv",new $e(u,2));function g(_,m,d,y,v,x,P,T,A,C,M){let b=x/A,L=P/C,z=x/2,V=P/2,$=T/2,ie=A+1,K=C+1,ce=0,J=0,fe=new I;for(let w=0;w<K;w++){let B=w*L-V;for(let G=0;G<ie;G++){let ne=G*b-z;fe[_]=ne*y,fe[m]=B*v,fe[d]=$,h.push(fe.x,fe.y,fe.z),fe[_]=0,fe[m]=0,fe[d]=T>0?1:-1,l.push(fe.x,fe.y,fe.z),u.push(G/A),u.push(1-w/C),ce+=1}}for(let w=0;w<C;w++)for(let B=0;B<A;B++){let G=f+B+ie*w,ne=f+B+ie*(w+1),N=f+(B+1)+ie*(w+1),k=f+(B+1)+ie*w;c.push(G,ne,k),c.push(ne,N,k),J+=6}o.addGroup(p,J,M),p+=J,f+=ce}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function js(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function rn(n){let e={};for(let t=0;t<n.length;t++){let i=js(n[t]);for(let s in i)e[s]=i[s]}return e}function pm(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Bd(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}var mm={clone:js,merge:rn},gm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_m=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ln=class extends Ei{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gm,this.fragmentShader=_m,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=js(e.uniforms),this.uniformsGroups=pm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},ro=class extends Zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new We,this.projectionMatrix=new We,this.projectionMatrixInverse=new We,this.coordinateSystem=vi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},zi=new I,zu=new Te,Hu=new Te,Yt=class extends ro{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=zr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ur*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return zr*2*Math.atan(Math.tan(Ur*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zi.x,zi.y).multiplyScalar(-e/zi.z),zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(zi.x,zi.y).multiplyScalar(-e/zi.z)}getViewSize(e,t){return this.getViewBounds(e,zu,Hu),t.subVectors(Hu,zu)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ur*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*i/h,s*=a.width/c,i*=a.height/h}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Os=-90,Bs=1,Sc=class extends Zt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Yt(Os,Bs,e,t);s.layers=this.layers,this.add(s);let r=new Yt(Os,Bs,e,t);r.layers=this.layers,this.add(r);let a=new Yt(Os,Bs,e,t);a.layers=this.layers,this.add(a);let o=new Yt(Os,Bs,e,t);o.layers=this.layers,this.add(o);let c=new Yt(Os,Bs,e,t);c.layers=this.layers,this.add(c);let h=new Yt(Os,Bs,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,c]=t;for(let h of t)this.remove(h);if(e===vi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Qa)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,h,l]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,l),e.setRenderTarget(u,f,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},ao=class extends pn{constructor(e,t,i,s,r,a,o,c,h,l){e=e!==void 0?e:[],t=t!==void 0?t:Zs,super(e,t,i,s,r,a,o,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},wc=class extends Xn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new ao(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:si}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Yn(5,5,5),r=new Ln({name:"CubemapFromEquirect",uniforms:js(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:tn,blending:Vi});r.uniforms.tEquirect.value=t;let a=new ke(s,r),o=t.minFilter;return t.minFilter===hs&&(t.minFilter=si),new Sc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,s){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}},Ml=new I,ym=new I,xm=new ze,En=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=Ml.subVectors(i,t).cross(ym.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Ml),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||xm.getNormalMatrix(e),s=this.coplanarPoint(Ml).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ns=new wi,ka=new I,Vr=class{constructor(e=new En,t=new En,i=new En,s=new En,r=new En,a=new En){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=vi){let i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],c=s[3],h=s[4],l=s[5],u=s[6],f=s[7],p=s[8],g=s[9],_=s[10],m=s[11],d=s[12],y=s[13],v=s[14],x=s[15];if(i[0].setComponents(c-r,f-h,m-p,x-d).normalize(),i[1].setComponents(c+r,f+h,m+p,x+d).normalize(),i[2].setComponents(c+a,f+l,m+g,x+y).normalize(),i[3].setComponents(c-a,f-l,m-g,x-y).normalize(),i[4].setComponents(c-o,f-u,m-_,x-v).normalize(),t===vi)i[5].setComponents(c+o,f+u,m+_,x+v).normalize();else if(t===Qa)i[5].setComponents(o,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ns.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ns.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ns)}intersectsSprite(e){return ns.center.set(0,0,0),ns.radius=.7071067811865476,ns.applyMatrix4(e.matrixWorld),this.intersectsSphere(ns)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(ka.x=s.normal.x>0?e.max.x:e.min.x,ka.y=s.normal.y>0?e.max.y:e.min.y,ka.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ka)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function zd(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function vm(n){let e=new WeakMap;function t(o,c){let h=o.array,l=o.usage,u=h.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,h,l),o.onUploadCallback();let p;if(h instanceof Float32Array)p=n.FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=n.SHORT;else if(h instanceof Uint32Array)p=n.UNSIGNED_INT;else if(h instanceof Int32Array)p=n.INT;else if(h instanceof Int8Array)p=n.BYTE;else if(h instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:f,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,h){let l=c.array,u=c.updateRanges;if(n.bindBuffer(h,o),u.length===0)n.bufferSubData(h,0,l);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){let g=u[f],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];n.bufferSubData(h,_.start*l.BYTES_PER_ELEMENT,l,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let l=e.get(o);(!l||l.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:r,update:a}}var Ti=class n extends ct{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(s),h=o+1,l=c+1,u=e/o,f=t/c,p=[],g=[],_=[],m=[];for(let d=0;d<l;d++){let y=d*f-a;for(let v=0;v<h;v++){let x=v*u-r;g.push(x,-y,0),_.push(0,0,1),m.push(v/o),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let y=0;y<o;y++){let v=y+h*d,x=y+h*(d+1),P=y+1+h*(d+1),T=y+1+h*d;p.push(v,x,T),p.push(x,P,T)}this.setIndex(p),this.setAttribute("position",new $e(g,3)),this.setAttribute("normal",new $e(_,3)),this.setAttribute("uv",new $e(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},bm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mm=`#ifdef USE_ALPHAHASH
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
#endif`,Sm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Em=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Tm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Am=`#ifdef USE_AOMAP
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
#endif`,Rm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cm=`#ifdef USE_BATCHING
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
#endif`,Pm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Im=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Um=`#ifdef USE_IRIDESCENCE
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
#endif`,Nm=`#ifdef USE_BUMPMAP
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
#endif`,km=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Om=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Hm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Vm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Wm=`#define PI 3.141592653589793
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
} // validated`,Xm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ym=`vec3 transformedNormal = objectNormal;
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
#endif`,qm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$m=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Km="gl_FragColor = linearToOutputTexel( gl_FragColor );",jm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Qm=`#ifdef USE_ENVMAP
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
#endif`,e0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,t0=`#ifdef USE_ENVMAP
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
#endif`,n0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,i0=`#ifdef USE_ENVMAP
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
#endif`,s0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,r0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,a0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,o0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,l0=`#ifdef USE_GRADIENTMAP
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
}`,c0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,h0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,u0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,d0=`uniform bool receiveShadow;
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
#endif`,f0=`#ifdef USE_ENVMAP
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
#endif`,p0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,m0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,g0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,y0=`PhysicalMaterial material;
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
#endif`,x0=`struct PhysicalMaterial {
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
}`,v0=`
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
#endif`,b0=`#if defined( RE_IndirectDiffuse )
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
#endif`,M0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,S0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,w0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,E0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,T0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,A0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,R0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,C0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,P0=`#if defined( USE_POINTS_UV )
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
#endif`,I0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,L0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,D0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,U0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,N0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,k0=`#ifdef USE_MORPHTARGETS
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
#endif`,F0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,O0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,B0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,z0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,H0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,V0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,G0=`#ifdef USE_NORMALMAP
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
#endif`,W0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,X0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Y0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,q0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Z0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,J0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,K0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,j0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Q0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,eg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ng=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ig=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,rg=`float getShadowMask() {
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
}`,ag=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,og=`#ifdef USE_SKINNING
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
#endif`,lg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cg=`#ifdef USE_SKINNING
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
#endif`,hg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ug=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,fg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,pg=`#ifdef USE_TRANSMISSION
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
#endif`,mg=`#ifdef USE_TRANSMISSION
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
#endif`,gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,vg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,bg=`uniform sampler2D t2D;
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
}`,Mg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,wg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Eg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tg=`#include <common>
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
}`,Ag=`#if DEPTH_PACKING == 3200
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
}`,Rg=`#define DISTANCE
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
}`,Cg=`#define DISTANCE
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
}`,Pg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ig=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lg=`uniform float scale;
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
}`,Dg=`uniform vec3 diffuse;
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
}`,Ug=`#include <common>
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
}`,Ng=`uniform vec3 diffuse;
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
}`,kg=`#define LAMBERT
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
}`,Fg=`#define LAMBERT
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
}`,Og=`#define MATCAP
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
}`,Bg=`#define MATCAP
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
}`,zg=`#define NORMAL
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
}`,Hg=`#define NORMAL
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
}`,Vg=`#define PHONG
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
}`,Gg=`#define PHONG
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
}`,Wg=`#define STANDARD
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
}`,Xg=`#define STANDARD
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
}`,Yg=`#define TOON
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
}`,qg=`#define TOON
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
}`,Zg=`uniform float size;
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
}`,$g=`uniform vec3 diffuse;
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
}`,Jg=`#include <common>
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
}`,Kg=`uniform vec3 color;
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
}`,jg=`uniform float rotation;
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
}`,Qg=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:bm,alphahash_pars_fragment:Mm,alphamap_fragment:Sm,alphamap_pars_fragment:wm,alphatest_fragment:Em,alphatest_pars_fragment:Tm,aomap_fragment:Am,aomap_pars_fragment:Rm,batching_pars_vertex:Cm,batching_vertex:Pm,begin_vertex:Im,beginnormal_vertex:Lm,bsdfs:Dm,iridescence_fragment:Um,bumpmap_pars_fragment:Nm,clipping_planes_fragment:km,clipping_planes_pars_fragment:Fm,clipping_planes_pars_vertex:Om,clipping_planes_vertex:Bm,color_fragment:zm,color_pars_fragment:Hm,color_pars_vertex:Vm,color_vertex:Gm,common:Wm,cube_uv_reflection_fragment:Xm,defaultnormal_vertex:Ym,displacementmap_pars_vertex:qm,displacementmap_vertex:Zm,emissivemap_fragment:$m,emissivemap_pars_fragment:Jm,colorspace_fragment:Km,colorspace_pars_fragment:jm,envmap_fragment:Qm,envmap_common_pars_fragment:e0,envmap_pars_fragment:t0,envmap_pars_vertex:n0,envmap_physical_pars_fragment:f0,envmap_vertex:i0,fog_vertex:s0,fog_pars_vertex:r0,fog_fragment:a0,fog_pars_fragment:o0,gradientmap_pars_fragment:l0,lightmap_pars_fragment:c0,lights_lambert_fragment:h0,lights_lambert_pars_fragment:u0,lights_pars_begin:d0,lights_toon_fragment:p0,lights_toon_pars_fragment:m0,lights_phong_fragment:g0,lights_phong_pars_fragment:_0,lights_physical_fragment:y0,lights_physical_pars_fragment:x0,lights_fragment_begin:v0,lights_fragment_maps:b0,lights_fragment_end:M0,logdepthbuf_fragment:S0,logdepthbuf_pars_fragment:w0,logdepthbuf_pars_vertex:E0,logdepthbuf_vertex:T0,map_fragment:A0,map_pars_fragment:R0,map_particle_fragment:C0,map_particle_pars_fragment:P0,metalnessmap_fragment:I0,metalnessmap_pars_fragment:L0,morphinstance_vertex:D0,morphcolor_vertex:U0,morphnormal_vertex:N0,morphtarget_pars_vertex:k0,morphtarget_vertex:F0,normal_fragment_begin:O0,normal_fragment_maps:B0,normal_pars_fragment:z0,normal_pars_vertex:H0,normal_vertex:V0,normalmap_pars_fragment:G0,clearcoat_normal_fragment_begin:W0,clearcoat_normal_fragment_maps:X0,clearcoat_pars_fragment:Y0,iridescence_pars_fragment:q0,opaque_fragment:Z0,packing:$0,premultiplied_alpha_fragment:J0,project_vertex:K0,dithering_fragment:j0,dithering_pars_fragment:Q0,roughnessmap_fragment:eg,roughnessmap_pars_fragment:tg,shadowmap_pars_fragment:ng,shadowmap_pars_vertex:ig,shadowmap_vertex:sg,shadowmask_pars_fragment:rg,skinbase_vertex:ag,skinning_pars_vertex:og,skinning_vertex:lg,skinnormal_vertex:cg,specularmap_fragment:hg,specularmap_pars_fragment:ug,tonemapping_fragment:dg,tonemapping_pars_fragment:fg,transmission_fragment:pg,transmission_pars_fragment:mg,uv_pars_fragment:gg,uv_pars_vertex:_g,uv_vertex:yg,worldpos_vertex:xg,background_vert:vg,background_frag:bg,backgroundCube_vert:Mg,backgroundCube_frag:Sg,cube_vert:wg,cube_frag:Eg,depth_vert:Tg,depth_frag:Ag,distanceRGBA_vert:Rg,distanceRGBA_frag:Cg,equirect_vert:Pg,equirect_frag:Ig,linedashed_vert:Lg,linedashed_frag:Dg,meshbasic_vert:Ug,meshbasic_frag:Ng,meshlambert_vert:kg,meshlambert_frag:Fg,meshmatcap_vert:Og,meshmatcap_frag:Bg,meshnormal_vert:zg,meshnormal_frag:Hg,meshphong_vert:Vg,meshphong_frag:Gg,meshphysical_vert:Wg,meshphysical_frag:Xg,meshtoon_vert:Yg,meshtoon_frag:qg,points_vert:Zg,points_frag:$g,shadow_vert:Jg,shadow_frag:Kg,sprite_vert:jg,sprite_frag:Qg},me={common:{diffuse:{value:new Ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Ue(16777215)},opacity:{value:1},center:{value:new Te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},ii={basic:{uniforms:rn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:rn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ue(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:rn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ue(0)},specular:{value:new Ue(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:rn([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:rn([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Ue(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:rn([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:rn([me.points,me.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:rn([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:rn([me.common,me.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:rn([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:rn([me.sprite,me.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:rn([me.common,me.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:rn([me.lights,me.fog,{color:{value:new Ue(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};ii.physical={uniforms:rn([ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Ue(0)},specularColor:{value:new Ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};var Fa={r:0,b:0,g:0},is=new mn,e_=new We;function t_(n,e,t,i,s,r,a){let o=new Ue(0),c=r===!0?0:1,h,l,u=null,f=0,p=null;function g(y){let v=y.isScene===!0?y.background:null;return v&&v.isTexture&&(v=(y.backgroundBlurriness>0?t:e).get(v)),v}function _(y){let v=!1,x=g(y);x===null?d(o,c):x&&x.isColor&&(d(x,1),v=!0);let P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,v){let x=g(v);x&&(x.isCubeTexture||x.mapping===wo)?(l===void 0&&(l=new ke(new Yn(1,1,1),new Ln({name:"BackgroundCubeMaterial",uniforms:js(ii.backgroundCube.uniforms),vertexShader:ii.backgroundCube.vertexShader,fragmentShader:ii.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(P,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),is.copy(v.backgroundRotation),is.x*=-1,is.y*=-1,is.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),l.material.uniforms.envMap.value=x,l.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(e_.makeRotationFromEuler(is)),l.material.toneMapped=Qe.getTransfer(x.colorSpace)!==ot,(u!==x||f!==x.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=x,f=x.version,p=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null)):x&&x.isTexture&&(h===void 0&&(h=new ke(new Ti(2,2),new Ln({name:"BackgroundMaterial",uniforms:js(ii.background.uniforms),vertexShader:ii.background.vertexShader,fragmentShader:ii.background.fragmentShader,side:Wi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=x,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.toneMapped=Qe.getTransfer(x.colorSpace)!==ot,x.matrixAutoUpdate===!0&&x.updateMatrix(),h.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=x,f=x.version,p=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null))}function d(y,v){y.getRGB(Fa,Bd(n)),i.buffers.color.setClear(Fa.r,Fa.g,Fa.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(y,v=1){o.set(y),c=v,d(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,d(o,c)},render:_,addToRenderList:m}}function n_(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,a=!1;function o(b,L,z,V,$){let ie=!1,K=u(V,z,L);r!==K&&(r=K,h(r.object)),ie=p(b,V,z,$),ie&&g(b,V,z,$),$!==null&&e.update($,n.ELEMENT_ARRAY_BUFFER),(ie||a)&&(a=!1,x(b,L,z,V),$!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function c(){return n.createVertexArray()}function h(b){return n.bindVertexArray(b)}function l(b){return n.deleteVertexArray(b)}function u(b,L,z){let V=z.wireframe===!0,$=i[b.id];$===void 0&&($={},i[b.id]=$);let ie=$[L.id];ie===void 0&&(ie={},$[L.id]=ie);let K=ie[V];return K===void 0&&(K=f(c()),ie[V]=K),K}function f(b){let L=[],z=[],V=[];for(let $=0;$<t;$++)L[$]=0,z[$]=0,V[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:V,object:b,attributes:{},index:null}}function p(b,L,z,V){let $=r.attributes,ie=L.attributes,K=0,ce=z.getAttributes();for(let J in ce)if(ce[J].location>=0){let w=$[J],B=ie[J];if(B===void 0&&(J==="instanceMatrix"&&b.instanceMatrix&&(B=b.instanceMatrix),J==="instanceColor"&&b.instanceColor&&(B=b.instanceColor)),w===void 0||w.attribute!==B||B&&w.data!==B.data)return!0;K++}return r.attributesNum!==K||r.index!==V}function g(b,L,z,V){let $={},ie=L.attributes,K=0,ce=z.getAttributes();for(let J in ce)if(ce[J].location>=0){let w=ie[J];w===void 0&&(J==="instanceMatrix"&&b.instanceMatrix&&(w=b.instanceMatrix),J==="instanceColor"&&b.instanceColor&&(w=b.instanceColor));let B={};B.attribute=w,w&&w.data&&(B.data=w.data),$[J]=B,K++}r.attributes=$,r.attributesNum=K,r.index=V}function _(){let b=r.newAttributes;for(let L=0,z=b.length;L<z;L++)b[L]=0}function m(b){d(b,0)}function d(b,L){let z=r.newAttributes,V=r.enabledAttributes,$=r.attributeDivisors;z[b]=1,V[b]===0&&(n.enableVertexAttribArray(b),V[b]=1),$[b]!==L&&(n.vertexAttribDivisor(b,L),$[b]=L)}function y(){let b=r.newAttributes,L=r.enabledAttributes;for(let z=0,V=L.length;z<V;z++)L[z]!==b[z]&&(n.disableVertexAttribArray(z),L[z]=0)}function v(b,L,z,V,$,ie,K){K===!0?n.vertexAttribIPointer(b,L,z,$,ie):n.vertexAttribPointer(b,L,z,V,$,ie)}function x(b,L,z,V){_();let $=V.attributes,ie=z.getAttributes(),K=L.defaultAttributeValues;for(let ce in ie){let J=ie[ce];if(J.location>=0){let fe=$[ce];if(fe===void 0&&(ce==="instanceMatrix"&&b.instanceMatrix&&(fe=b.instanceMatrix),ce==="instanceColor"&&b.instanceColor&&(fe=b.instanceColor)),fe!==void 0){let w=fe.normalized,B=fe.itemSize,G=e.get(fe);if(G===void 0)continue;let ne=G.buffer,N=G.type,k=G.bytesPerElement,Z=N===n.INT||N===n.UNSIGNED_INT||fe.gpuType===nh;if(fe.isInterleavedBufferAttribute){let Q=fe.data,W=Q.stride,ae=fe.offset;if(Q.isInstancedInterleavedBuffer){for(let te=0;te<J.locationSize;te++)d(J.location+te,Q.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let te=0;te<J.locationSize;te++)m(J.location+te);n.bindBuffer(n.ARRAY_BUFFER,ne);for(let te=0;te<J.locationSize;te++)v(J.location+te,B/J.locationSize,N,w,W*k,(ae+B/J.locationSize*te)*k,Z)}else{if(fe.isInstancedBufferAttribute){for(let Q=0;Q<J.locationSize;Q++)d(J.location+Q,fe.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Q=0;Q<J.locationSize;Q++)m(J.location+Q);n.bindBuffer(n.ARRAY_BUFFER,ne);for(let Q=0;Q<J.locationSize;Q++)v(J.location+Q,B/J.locationSize,N,w,B*k,B/J.locationSize*Q*k,Z)}}else if(K!==void 0){let w=K[ce];if(w!==void 0)switch(w.length){case 2:n.vertexAttrib2fv(J.location,w);break;case 3:n.vertexAttrib3fv(J.location,w);break;case 4:n.vertexAttrib4fv(J.location,w);break;default:n.vertexAttrib1fv(J.location,w)}}}}y()}function P(){C();for(let b in i){let L=i[b];for(let z in L){let V=L[z];for(let $ in V)l(V[$].object),delete V[$];delete L[z]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;let L=i[b.id];for(let z in L){let V=L[z];for(let $ in V)l(V[$].object),delete V[$];delete L[z]}delete i[b.id]}function A(b){for(let L in i){let z=i[L];if(z[b.id]===void 0)continue;let V=z[b.id];for(let $ in V)l(V[$].object),delete V[$];delete z[b.id]}}function C(){M(),a=!0,r!==s&&(r=s,h(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:M,dispose:P,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function i_(n,e,t){let i;function s(h){i=h}function r(h,l){n.drawArrays(i,h,l),t.update(l,i,1)}function a(h,l,u){u!==0&&(n.drawArraysInstanced(i,h,l,u),t.update(l,i,u))}function o(h,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,l,0,u);let p=0;for(let g=0;g<u;g++)p+=l[g];t.update(p,i,1)}function c(h,l,u,f){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<h.length;g++)a(h[g],l[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(i,h,0,l,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=l[_]*f[_];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function s_(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Wn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let C=A===$r&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Mi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ri&&!C)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp",l=c(h);l!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",l,"instead."),h=l);let u=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:x,vertexTextures:P,maxSamples:T}}function r_(n){let e=this,t=null,i=0,s=!1,r=!1,a=new En,o=new ze,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let p=u.length!==0||f||i!==0||s;return s=f,i=u.length,p},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=l(u,f,0)},this.setState=function(u,f,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,d=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?l(null):h();else{let y=r?0:i,v=y*4,x=d.clippingState||null;c.value=x,x=l(g,f,v,p);for(let P=0;P!==v;++P)x[P]=t[P];d.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function l(u,f,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let d=p+_*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<d)&&(m=new Float32Array(d));for(let v=0,x=p;v!==_;++v,x+=4)a.copy(u[v]).applyMatrix4(y,o),a.normal.toArray(m,x),m[x+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function a_(n){let e=new WeakMap;function t(a,o){return o===Wl?a.mapping=Zs:o===Xl&&(a.mapping=$s),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===Wl||o===Xl)if(e.has(a)){let c=e.get(a).texture;return t(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let h=new wc(c.height);return h.fromEquirectangularTexture(n,a),e.set(a,h),a.addEventListener("dispose",s),t(h.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var oo=class extends ro{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,a=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=l*this.view.offsetY,c=o-l*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Gs=4,Vu=[.125,.215,.35,.446,.526,.582],ls=20,Sl=new oo,Gu=new Ue,wl=null,El=0,Tl=0,Al=!1,rs=(1+Math.sqrt(5))/2,zs=1/rs,Wu=[new I(-rs,zs,0),new I(rs,zs,0),new I(-zs,0,rs),new I(zs,0,rs),new I(0,rs,-zs),new I(0,rs,zs),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],Qs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){wl=this._renderer.getRenderTarget(),El=this._renderer.getActiveCubeFace(),Tl=this._renderer.getActiveMipmapLevel(),Al=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(wl,El,Tl),this._renderer.xr.enabled=Al,e.scissorTest=!1,Oa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Zs||e.mapping===$s?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),wl=this._renderer.getRenderTarget(),El=this._renderer.getActiveCubeFace(),Tl=this._renderer.getActiveMipmapLevel(),Al=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:si,minFilter:si,generateMipmaps:!1,type:$r,format:Wn,colorSpace:ir,depthBuffer:!1},s=Xu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xu(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=o_(r)),this._blurMaterial=l_(r,e,t)}return s}_compileMaterial(e){let t=new ke(this._lodPlanes[0],e);this._renderer.compile(t,Sl)}_sceneToCubeUV(e,t,i,s){let o=new Yt(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,f=l.toneMapping;l.getClearColor(Gu),l.toneMapping=ai,l.autoClear=!1;let p=new Bt({name:"PMREM.Background",side:tn,depthWrite:!1,depthTest:!1}),g=new ke(new Yn,p),_=!1,m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(Gu),_=!0);for(let d=0;d<6;d++){let y=d%3;y===0?(o.up.set(0,c[d],0),o.lookAt(h[d],0,0)):y===1?(o.up.set(0,0,c[d]),o.lookAt(0,h[d],0)):(o.up.set(0,c[d],0),o.lookAt(0,0,h[d]));let v=this._cubeSize;Oa(s,y*v,d>2?v:0,v,v),l.setRenderTarget(s),_&&l.render(g,o),l.render(e,o)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=f,l.autoClear=u,e.background=m}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Zs||e.mapping===$s;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=qu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new ke(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;Oa(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,Sl)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Wu[(s-r-1)%Wu.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){let c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let l=3,u=new ke(this._lodPlanes[s],h),f=h.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ls-1),_=r/g,m=isFinite(r)?1+Math.floor(l*_):ls;m>ls&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ls}`);let d=[],y=0;for(let A=0;A<ls;++A){let C=A/_,M=Math.exp(-C*C/2);d.push(M),A===0?y+=M:A<m&&(y+=2*M)}for(let A=0;A<d.length;A++)d[A]=d[A]/y;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);let{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-i;let x=this._sizeLods[s],P=3*x*(s>v-Gs?s-v+Gs:0),T=4*(this._cubeSize-x);Oa(t,P,T,3*x,2*x),c.setRenderTarget(t),c.render(u,Sl)}};function o_(n){let e=[],t=[],i=[],s=n,r=n-Gs+1+Vu.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>n-Gs?c=Vu[a-n+Gs-1]:a===0&&(c=0),i.push(c);let h=1/(o-2),l=-h,u=1+h,f=[l,l,u,l,u,u,l,l,u,u,l,u],p=6,g=6,_=3,m=2,d=1,y=new Float32Array(_*g*p),v=new Float32Array(m*g*p),x=new Float32Array(d*g*p);for(let T=0;T<p;T++){let A=T%3*2/3-1,C=T>2?0:-1,M=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];y.set(M,_*g*T),v.set(f,m*g*T);let b=[T,T,T,T,T,T];x.set(b,d*g*T)}let P=new ct;P.setAttribute("position",new xt(y,_)),P.setAttribute("uv",new xt(v,m)),P.setAttribute("faceIndex",new xt(x,d)),e.push(P),s>Gs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Xu(n,e,t){let i=new Xn(n,e,t);return i.texture.mapping=wo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Oa(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function l_(n,e,t){let i=new Float32Array(ls),s=new I(0,1,0);return new Ln({name:"SphericalGaussianBlur",defines:{n:ls,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:hh(),fragmentShader:`

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
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function Yu(){return new Ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hh(),fragmentShader:`

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
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function qu(){return new Ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hh(),fragmentShader:`

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
	`}function c_(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){let c=o.mapping,h=c===Wl||c===Xl,l=c===Zs||c===$s;if(h||l){let u=e.get(o),f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Qs(n)),u=h?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let p=o.image;return h&&p&&p.height>0||l&&p&&s(p)?(t===null&&(t=new Qs(n)),u=h?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0,h=6;for(let l=0;l<h;l++)o[l]!==void 0&&c++;return c===h}function r(o){let c=o.target;c.removeEventListener("dispose",r);let h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function h_(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Lr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function u_(n,e,t,i){let s={},r=new WeakMap;function a(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);for(let g in f.morphAttributes){let _=f.morphAttributes[g];for(let m=0,d=_.length;m<d;m++)e.remove(_[m])}f.removeEventListener("dispose",a),delete s[f.id];let p=r.get(f);p&&(e.remove(p),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(u){let f=u.attributes;for(let g in f)e.update(f[g],n.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let m=0,d=_.length;m<d;m++)e.update(_[m],n.ARRAY_BUFFER)}}function h(u){let f=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let y=p.array;_=p.version;for(let v=0,x=y.length;v<x;v+=3){let P=y[v+0],T=y[v+1],A=y[v+2];f.push(P,T,T,A,A,P)}}else if(g!==void 0){let y=g.array;_=g.version;for(let v=0,x=y.length/3-1;v<x;v+=3){let P=v+0,T=v+1,A=v+2;f.push(P,T,T,A,A,P)}}else return;let m=new(Fd(f)?so:io)(f,1);m.version=_;let d=r.get(u);d&&e.remove(d),r.set(u,m)}function l(u){let f=r.get(u);if(f){let p=u.index;p!==null&&f.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:l}}function d_(n,e,t){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,p){n.drawElements(i,p,r,f*a),t.update(p,i,1)}function h(f,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,f*a,g),t.update(p,i,g))}function l(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];t.update(m,i,1)}function u(f,p,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)h(f[d]/a,p[d],_[d]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,f,0,_,0,g);let d=0;for(let y=0;y<g;y++)d+=p[y]*_[y];t.update(d,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=l,this.renderMultiDrawInstances=u}function f_(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function p_(n,e,t){let i=new WeakMap,s=new lt;function r(a,o,c){let h=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l!==void 0?l.length:0,f=i.get(o);if(f===void 0||f.count!==u){let M=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",M)};f!==void 0&&f.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],v=0;p===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let x=o.attributes.position.count*v,P=1;x>e.maxTextureSize&&(P=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let T=new Float32Array(x*P*4*u),A=new no(T,x,P,u);A.type=ri,A.needsUpdate=!0;let C=v*4;for(let b=0;b<u;b++){let L=m[b],z=d[b],V=y[b],$=x*P*4*b;for(let ie=0;ie<L.count;ie++){let K=ie*C;p===!0&&(s.fromBufferAttribute(L,ie),T[$+K+0]=s.x,T[$+K+1]=s.y,T[$+K+2]=s.z,T[$+K+3]=0),g===!0&&(s.fromBufferAttribute(z,ie),T[$+K+4]=s.x,T[$+K+5]=s.y,T[$+K+6]=s.z,T[$+K+7]=0),_===!0&&(s.fromBufferAttribute(V,ie),T[$+K+8]=s.x,T[$+K+9]=s.y,T[$+K+10]=s.z,T[$+K+11]=V.itemSize===4?s.w:1)}}f={count:u,texture:A,size:new Te(x,P)},i.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let _=0;_<h.length;_++)p+=h[_];let g=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function m_(n,e,t,i){let s=new WeakMap;function r(c){let h=i.render.frame,l=c.geometry,u=e.get(c,l);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function a(){s=new WeakMap}function o(c){let h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:a}}var lo=class extends pn{constructor(e,t,i,s,r,a,o,c,h,l=Ws){if(l!==Ws&&l!==Ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&l===Ws&&(i=us),i===void 0&&l===Ks&&(i=Js),super(null,s,r,a,o,c,l,i,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Tn,this.minFilter=c!==void 0?c:Tn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Hd=new pn,Zu=new lo(1,1),Vd=new no,Gd=new Mc,Wd=new ao,$u=[],Ju=[],Ku=new Float32Array(16),ju=new Float32Array(9),Qu=new Float32Array(4);function rr(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=$u[s];if(r===void 0&&(r=new Float32Array(s),$u[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Lt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Dt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function To(n,e){let t=Ju[e];t===void 0&&(t=new Int32Array(e),Ju[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function g_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function __(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2fv(this.addr,e),Dt(t,e)}}function y_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;n.uniform3fv(this.addr,e),Dt(t,e)}}function x_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4fv(this.addr,e),Dt(t,e)}}function v_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Qu.set(i),n.uniformMatrix2fv(this.addr,!1,Qu),Dt(t,i)}}function b_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;ju.set(i),n.uniformMatrix3fv(this.addr,!1,ju),Dt(t,i)}}function M_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Ku.set(i),n.uniformMatrix4fv(this.addr,!1,Ku),Dt(t,i)}}function S_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function w_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2iv(this.addr,e),Dt(t,e)}}function E_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3iv(this.addr,e),Dt(t,e)}}function T_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4iv(this.addr,e),Dt(t,e)}}function A_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function R_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2uiv(this.addr,e),Dt(t,e)}}function C_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3uiv(this.addr,e),Dt(t,e)}}function P_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4uiv(this.addr,e),Dt(t,e)}}function I_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Zu.compareFunction=kd,r=Zu):r=Hd,t.setTexture2D(e||r,s)}function L_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Gd,s)}function D_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Wd,s)}function U_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Vd,s)}function N_(n){switch(n){case 5126:return g_;case 35664:return __;case 35665:return y_;case 35666:return x_;case 35674:return v_;case 35675:return b_;case 35676:return M_;case 5124:case 35670:return S_;case 35667:case 35671:return w_;case 35668:case 35672:return E_;case 35669:case 35673:return T_;case 5125:return A_;case 36294:return R_;case 36295:return C_;case 36296:return P_;case 35678:case 36198:case 36298:case 36306:case 35682:return I_;case 35679:case 36299:case 36307:return L_;case 35680:case 36300:case 36308:case 36293:return D_;case 36289:case 36303:case 36311:case 36292:return U_}}function k_(n,e){n.uniform1fv(this.addr,e)}function F_(n,e){let t=rr(e,this.size,2);n.uniform2fv(this.addr,t)}function O_(n,e){let t=rr(e,this.size,3);n.uniform3fv(this.addr,t)}function B_(n,e){let t=rr(e,this.size,4);n.uniform4fv(this.addr,t)}function z_(n,e){let t=rr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function H_(n,e){let t=rr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function V_(n,e){let t=rr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function G_(n,e){n.uniform1iv(this.addr,e)}function W_(n,e){n.uniform2iv(this.addr,e)}function X_(n,e){n.uniform3iv(this.addr,e)}function Y_(n,e){n.uniform4iv(this.addr,e)}function q_(n,e){n.uniform1uiv(this.addr,e)}function Z_(n,e){n.uniform2uiv(this.addr,e)}function $_(n,e){n.uniform3uiv(this.addr,e)}function J_(n,e){n.uniform4uiv(this.addr,e)}function K_(n,e,t){let i=this.cache,s=e.length,r=To(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Hd,r[a])}function j_(n,e,t){let i=this.cache,s=e.length,r=To(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Gd,r[a])}function Q_(n,e,t){let i=this.cache,s=e.length,r=To(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Wd,r[a])}function ey(n,e,t){let i=this.cache,s=e.length,r=To(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Vd,r[a])}function ty(n){switch(n){case 5126:return k_;case 35664:return F_;case 35665:return O_;case 35666:return B_;case 35674:return z_;case 35675:return H_;case 35676:return V_;case 5124:case 35670:return G_;case 35667:case 35671:return W_;case 35668:case 35672:return X_;case 35669:case 35673:return Y_;case 5125:return q_;case 36294:return Z_;case 36295:return $_;case 36296:return J_;case 35678:case 36198:case 36298:case 36306:case 35682:return K_;case 35679:case 36299:case 36307:return j_;case 35680:case 36300:case 36308:case 36293:return Q_;case 36289:case 36303:case 36311:case 36292:return ey}}var Ec=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=N_(t.type)}},Tc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ty(t.type)}},Ac=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],i)}}},Rl=/(\w+)(\])?(\[|\.)?/g;function ed(n,e){n.seq.push(e),n.map[e.id]=e}function ny(n,e,t){let i=n.name,s=i.length;for(Rl.lastIndex=0;;){let r=Rl.exec(i),a=Rl.lastIndex,o=r[1],c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){ed(t,h===void 0?new Ec(o,n,e):new Tc(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Ac(o),ed(t,u)),t=u}}}var Ys=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);ny(r,a,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&i.push(a)}return i}};function td(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var iy=37297,sy=0;function ry(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}var nd=new ze;function ay(n){Qe._getMatrix(nd,Qe.workingColorSpace,n);let e=`mat3( ${nd.elements.map(t=>t.toFixed(4))} )`;switch(Qe.getTransfer(n)){case Eo:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function id(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+ry(n.getShaderSource(e),a)}else return s}function oy(n,e){let t=ay(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function ly(n,e){let t;switch(e){case xp:t="Linear";break;case vp:t="Reinhard";break;case bp:t="Cineon";break;case th:t="ACESFilmic";break;case Sp:t="AgX";break;case wp:t="Neutral";break;case Mp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ba=new I;function cy(){Qe.getLuminanceCoefficients(Ba);let n=Ba.x.toFixed(4),e=Ba.y.toFixed(4),t=Ba.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function hy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Dr).join(`
`)}function uy(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function dy(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Dr(n){return n!==""}function sd(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function rd(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var fy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Rc(n){return n.replace(fy,my)}var py=new Map;function my(n,e){let t=qe[e];if(t===void 0){let i=py.get(e);if(i!==void 0)t=qe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Rc(t)}var gy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ad(n){return n.replace(gy,_y)}function _y(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function od(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function yy(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Sd?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===eh?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===xi&&(e="SHADOWMAP_TYPE_VSM"),e}function xy(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Zs:case $s:e="ENVMAP_TYPE_CUBE";break;case wo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function vy(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case $s:e="ENVMAP_MODE_REFRACTION";break}return e}function by(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case wd:e="ENVMAP_BLENDING_MULTIPLY";break;case _p:e="ENVMAP_BLENDING_MIX";break;case yp:e="ENVMAP_BLENDING_ADD";break}return e}function My(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Sy(n,e,t,i){let s=n.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=yy(t),h=xy(t),l=vy(t),u=by(t),f=My(t),p=hy(t),g=uy(r),_=s.createProgram(),m,d,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Dr).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Dr).join(`
`),d.length>0&&(d+=`
`)):(m=[od(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Dr).join(`
`),d=[od(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ai?"#define TONE_MAPPING":"",t.toneMapping!==ai?qe.tonemapping_pars_fragment:"",t.toneMapping!==ai?ly("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,oy("linearToOutputTexel",t.outputColorSpace),cy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Dr).join(`
`)),a=Rc(a),a=sd(a,t),a=rd(a,t),o=Rc(o),o=sd(o,t),o=rd(o,t),a=ad(a),o=ad(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===vu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let v=y+m+a,x=y+d+o,P=td(s,s.VERTEX_SHADER,v),T=td(s,s.FRAGMENT_SHADER,x);s.attachShader(_,P),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(L){if(n.debug.checkShaderErrors){let z=s.getProgramInfoLog(_).trim(),V=s.getShaderInfoLog(P).trim(),$=s.getShaderInfoLog(T).trim(),ie=!0,K=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(ie=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,P,T);else{let ce=id(s,P,"vertex"),J=id(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+z+`
`+ce+`
`+J)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(V===""||$==="")&&(K=!1);K&&(L.diagnostics={runnable:ie,programLog:z,vertexShader:{log:V,prefix:m},fragmentShader:{log:$,prefix:d}})}s.deleteShader(P),s.deleteShader(T),C=new Ys(s,_),M=dy(s,_)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(_,iy)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=sy++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=T,this}var wy=0,Cc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Pc(e),t.set(e,i)),i}},Pc=class{constructor(e){this.id=wy++,this.code=e,this.usedTimes=0}};function Ey(n,e,t,i,s,r,a){let o=new Hr,c=new Cc,h=new Set,l=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return h.add(M),M===0?"uv":`uv${M}`}function m(M,b,L,z,V){let $=z.fog,ie=V.geometry,K=M.isMeshStandardMaterial?z.environment:null,ce=(M.isMeshStandardMaterial?t:e).get(M.envMap||K),J=ce&&ce.mapping===wo?ce.image.height:null,fe=g[M.type];M.precision!==null&&(p=s.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));let w=ie.morphAttributes.position||ie.morphAttributes.normal||ie.morphAttributes.color,B=w!==void 0?w.length:0,G=0;ie.morphAttributes.position!==void 0&&(G=1),ie.morphAttributes.normal!==void 0&&(G=2),ie.morphAttributes.color!==void 0&&(G=3);let ne,N,k,Z;if(fe){let at=ii[fe];ne=at.vertexShader,N=at.fragmentShader}else ne=M.vertexShader,N=M.fragmentShader,c.update(M),k=c.getVertexShaderID(M),Z=c.getFragmentShaderID(M);let Q=n.getRenderTarget(),W=n.state.buffers.depth.getReversed(),ae=V.isInstancedMesh===!0,te=V.isBatchedMesh===!0,pe=!!M.map,Fe=!!M.matcap,nt=!!ce,D=!!M.aoMap,Xt=!!M.lightMap,Ze=!!M.bumpMap,Je=!!M.normalMap,Ae=!!M.displacementMap,et=!!M.emissiveMap,Ie=!!M.metalnessMap,R=!!M.roughnessMap,S=M.anisotropy>0,H=M.clearcoat>0,se=M.dispersion>0,oe=M.iridescence>0,ee=M.sheen>0,Le=M.transmission>0,ye=S&&!!M.anisotropyMap,Me=H&&!!M.clearcoatMap,je=H&&!!M.clearcoatNormalMap,ue=H&&!!M.clearcoatRoughnessMap,we=oe&&!!M.iridescenceMap,Ne=oe&&!!M.iridescenceThicknessMap,Oe=ee&&!!M.sheenColorMap,Ee=ee&&!!M.sheenRoughnessMap,Ke=!!M.specularMap,Ye=!!M.specularColorMap,_t=!!M.specularIntensityMap,U=Le&&!!M.transmissionMap,_e=Le&&!!M.thicknessMap,j=!!M.gradientMap,re=!!M.alphaMap,be=M.alphaTest>0,xe=!!M.alphaHash,Ve=!!M.extensions,wt=ai;M.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(wt=n.toneMapping);let jt={shaderID:fe,shaderType:M.type,shaderName:M.name,vertexShader:ne,fragmentShader:N,defines:M.defines,customVertexShaderID:k,customFragmentShaderID:Z,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:te,batchingColor:te&&V._colorsTexture!==null,instancing:ae,instancingColor:ae&&V.instanceColor!==null,instancingMorph:ae&&V.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Q===null?n.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:ir,alphaToCoverage:!!M.alphaToCoverage,map:pe,matcap:Fe,envMap:nt,envMapMode:nt&&ce.mapping,envMapCubeUVHeight:J,aoMap:D,lightMap:Xt,bumpMap:Ze,normalMap:Je,displacementMap:f&&Ae,emissiveMap:et,normalMapObjectSpace:Je&&M.normalMapType===Rp,normalMapTangentSpace:Je&&M.normalMapType===Nd,metalnessMap:Ie,roughnessMap:R,anisotropy:S,anisotropyMap:ye,clearcoat:H,clearcoatMap:Me,clearcoatNormalMap:je,clearcoatRoughnessMap:ue,dispersion:se,iridescence:oe,iridescenceMap:we,iridescenceThicknessMap:Ne,sheen:ee,sheenColorMap:Oe,sheenRoughnessMap:Ee,specularMap:Ke,specularColorMap:Ye,specularIntensityMap:_t,transmission:Le,transmissionMap:U,thicknessMap:_e,gradientMap:j,opaque:M.transparent===!1&&M.blending===Gi&&M.alphaToCoverage===!1,alphaMap:re,alphaTest:be,alphaHash:xe,combine:M.combine,mapUv:pe&&_(M.map.channel),aoMapUv:D&&_(M.aoMap.channel),lightMapUv:Xt&&_(M.lightMap.channel),bumpMapUv:Ze&&_(M.bumpMap.channel),normalMapUv:Je&&_(M.normalMap.channel),displacementMapUv:Ae&&_(M.displacementMap.channel),emissiveMapUv:et&&_(M.emissiveMap.channel),metalnessMapUv:Ie&&_(M.metalnessMap.channel),roughnessMapUv:R&&_(M.roughnessMap.channel),anisotropyMapUv:ye&&_(M.anisotropyMap.channel),clearcoatMapUv:Me&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:je&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:we&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:Ne&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&_(M.sheenRoughnessMap.channel),specularMapUv:Ke&&_(M.specularMap.channel),specularColorMapUv:Ye&&_(M.specularColorMap.channel),specularIntensityMapUv:_t&&_(M.specularIntensityMap.channel),transmissionMapUv:U&&_(M.transmissionMap.channel),thicknessMapUv:_e&&_(M.thicknessMap.channel),alphaMapUv:re&&_(M.alphaMap.channel),vertexTangents:!!ie.attributes.tangent&&(Je||S),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!ie.attributes.color&&ie.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!ie.attributes.uv&&(pe||re),fog:!!$,useFog:M.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:W,skinning:V.isSkinnedMesh===!0,morphTargets:ie.morphAttributes.position!==void 0,morphNormals:ie.morphAttributes.normal!==void 0,morphColors:ie.morphAttributes.color!==void 0,morphTargetsCount:B,morphTextureStride:G,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:wt,decodeVideoTexture:pe&&M.map.isVideoTexture===!0&&Qe.getTransfer(M.map.colorSpace)===ot,decodeVideoTextureEmissive:et&&M.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(M.emissiveMap.colorSpace)===ot,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Ct,flipSided:M.side===tn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ve&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ve&&M.extensions.multiDraw===!0||te)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return jt.vertexUv1s=h.has(1),jt.vertexUv2s=h.has(2),jt.vertexUv3s=h.has(3),h.clear(),jt}function d(M){let b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(let L in M.defines)b.push(L),b.push(M.defines[L]);return M.isRawShaderMaterial===!1&&(y(b,M),v(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function y(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function v(M,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reverseDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),M.push(o.mask)}function x(M){let b=g[M.type],L;if(b){let z=ii[b];L=mm.clone(z.uniforms)}else L=M.uniforms;return L}function P(M,b){let L;for(let z=0,V=l.length;z<V;z++){let $=l[z];if($.cacheKey===b){L=$,++L.usedTimes;break}}return L===void 0&&(L=new Sy(n,b,M,r),l.push(L)),L}function T(M){if(--M.usedTimes===0){let b=l.indexOf(M);l[b]=l[l.length-1],l.pop(),M.destroy()}}function A(M){c.remove(M)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:x,acquireProgram:P,releaseProgram:T,releaseShaderCache:A,programs:l,dispose:C}}function Ty(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Ay(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function ld(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function cd(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u,f,p,g,_,m){let d=n[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=m),e++,d}function o(u,f,p,g,_,m){let d=a(u,f,p,g,_,m);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):t.push(d)}function c(u,f,p,g,_,m){let d=a(u,f,p,g,_,m);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function h(u,f){t.length>1&&t.sort(u||Ay),i.length>1&&i.sort(f||ld),s.length>1&&s.sort(f||ld)}function l(){for(let u=e,f=n.length;u<f;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:l,sort:h}}function Ry(){let n=new WeakMap;function e(i,s){let r=n.get(i),a;return r===void 0?(a=new cd,n.set(i,[a])):s>=r.length?(a=new cd,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Cy(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Ue};break;case"SpotLight":t={position:new I,direction:new I,color:new Ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Ue,groundColor:new Ue};break;case"RectAreaLight":t={color:new Ue,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t}}}function Py(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var Iy=0;function Ly(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Dy(n){let e=new Cy,t=Py(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new I);let s=new I,r=new We,a=new We;function o(h){let l=0,u=0,f=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let p=0,g=0,_=0,m=0,d=0,y=0,v=0,x=0,P=0,T=0,A=0;h.sort(Ly);for(let M=0,b=h.length;M<b;M++){let L=h[M],z=L.color,V=L.intensity,$=L.distance,ie=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)l+=z.r*V,u+=z.g*V,f+=z.b*V;else if(L.isLightProbe){for(let K=0;K<9;K++)i.probe[K].addScaledVector(L.sh.coefficients[K],V);A++}else if(L.isDirectionalLight){let K=e.get(L);if(K.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let ce=L.shadow,J=t.get(L);J.shadowIntensity=ce.intensity,J.shadowBias=ce.bias,J.shadowNormalBias=ce.normalBias,J.shadowRadius=ce.radius,J.shadowMapSize=ce.mapSize,i.directionalShadow[p]=J,i.directionalShadowMap[p]=ie,i.directionalShadowMatrix[p]=L.shadow.matrix,y++}i.directional[p]=K,p++}else if(L.isSpotLight){let K=e.get(L);K.position.setFromMatrixPosition(L.matrixWorld),K.color.copy(z).multiplyScalar(V),K.distance=$,K.coneCos=Math.cos(L.angle),K.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),K.decay=L.decay,i.spot[_]=K;let ce=L.shadow;if(L.map&&(i.spotLightMap[P]=L.map,P++,ce.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[_]=ce.matrix,L.castShadow){let J=t.get(L);J.shadowIntensity=ce.intensity,J.shadowBias=ce.bias,J.shadowNormalBias=ce.normalBias,J.shadowRadius=ce.radius,J.shadowMapSize=ce.mapSize,i.spotShadow[_]=J,i.spotShadowMap[_]=ie,x++}_++}else if(L.isRectAreaLight){let K=e.get(L);K.color.copy(z).multiplyScalar(V),K.halfWidth.set(L.width*.5,0,0),K.halfHeight.set(0,L.height*.5,0),i.rectArea[m]=K,m++}else if(L.isPointLight){let K=e.get(L);if(K.color.copy(L.color).multiplyScalar(L.intensity),K.distance=L.distance,K.decay=L.decay,L.castShadow){let ce=L.shadow,J=t.get(L);J.shadowIntensity=ce.intensity,J.shadowBias=ce.bias,J.shadowNormalBias=ce.normalBias,J.shadowRadius=ce.radius,J.shadowMapSize=ce.mapSize,J.shadowCameraNear=ce.camera.near,J.shadowCameraFar=ce.camera.far,i.pointShadow[g]=J,i.pointShadowMap[g]=ie,i.pointShadowMatrix[g]=L.shadow.matrix,v++}i.point[g]=K,g++}else if(L.isHemisphereLight){let K=e.get(L);K.skyColor.copy(L.color).multiplyScalar(V),K.groundColor.copy(L.groundColor).multiplyScalar(V),i.hemi[d]=K,d++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=l,i.ambient[1]=u,i.ambient[2]=f;let C=i.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==d||C.numDirectionalShadows!==y||C.numPointShadows!==v||C.numSpotShadows!==x||C.numSpotMaps!==P||C.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=d,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=x+P-T,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,C.directionalLength=p,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=d,C.numDirectionalShadows=y,C.numPointShadows=v,C.numSpotShadows=x,C.numSpotMaps=P,C.numLightProbes=A,i.version=Iy++)}function c(h,l){let u=0,f=0,p=0,g=0,_=0,m=l.matrixWorldInverse;for(let d=0,y=h.length;d<y;d++){let v=h[d];if(v.isDirectionalLight){let x=i.directional[u];x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),u++}else if(v.isSpotLight){let x=i.spot[p];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),p++}else if(v.isRectAreaLight){let x=i.rectArea[g];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),a.identity(),r.copy(v.matrixWorld),r.premultiply(m),a.extractRotation(r),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(v.isPointLight){let x=i.point[f];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){let x=i.hemi[_];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:i}}function hd(n){let e=new Dy(n),t=[],i=[];function s(l){h.camera=l,t.length=0,i.length=0}function r(l){t.push(l)}function a(l){i.push(l)}function o(){e.setup(t)}function c(l){e.setupView(t,l)}let h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Uy(n){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new hd(n),e.set(s,[o])):r>=a.length?(o=new hd(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}var Ic=class extends Ei{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Tp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Lc=class extends Ei{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},Ny=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ky=`uniform sampler2D shadow_pass;
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
}`;function Fy(n,e,t){let i=new Vr,s=new Te,r=new Te,a=new lt,o=new Ic({depthPacking:Ap}),c=new Lc,h={},l=t.maxTextureSize,u={[Wi]:tn,[tn]:Wi,[Ct]:Ct},f=new Ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:Ny,fragmentShader:ky}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let g=new ct;g.setAttribute("position",new xt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ke(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sd;let d=this.type;this.render=function(T,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;let M=n.getRenderTarget(),b=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),z=n.state;z.setBlending(Vi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let V=d!==xi&&this.type===xi,$=d===xi&&this.type!==xi;for(let ie=0,K=T.length;ie<K;ie++){let ce=T[ie],J=ce.shadow;if(J===void 0){console.warn("THREE.WebGLShadowMap:",ce,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;s.copy(J.mapSize);let fe=J.getFrameExtents();if(s.multiply(fe),r.copy(J.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/fe.x),s.x=r.x*fe.x,J.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/fe.y),s.y=r.y*fe.y,J.mapSize.y=r.y)),J.map===null||V===!0||$===!0){let B=this.type!==xi?{minFilter:Tn,magFilter:Tn}:{};J.map!==null&&J.map.dispose(),J.map=new Xn(s.x,s.y,B),J.map.texture.name=ce.name+".shadowMap",J.camera.updateProjectionMatrix()}n.setRenderTarget(J.map),n.clear();let w=J.getViewportCount();for(let B=0;B<w;B++){let G=J.getViewport(B);a.set(r.x*G.x,r.y*G.y,r.x*G.z,r.y*G.w),z.viewport(a),J.updateMatrices(ce,B),i=J.getFrustum(),x(A,C,J.camera,ce,this.type)}J.isPointLightShadow!==!0&&this.type===xi&&y(J,C),J.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(M,b,L)};function y(T,A){let C=e.update(_);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Xn(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,C,f,_,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,C,p,_,null)}function v(T,A,C,M){let b=null,L=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)b=L;else if(b=C.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let z=b.uuid,V=A.uuid,$=h[z];$===void 0&&($={},h[z]=$);let ie=$[V];ie===void 0&&(ie=b.clone(),$[V]=ie,A.addEventListener("dispose",P)),b=ie}if(b.visible=A.visible,b.wireframe=A.wireframe,M===xi?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,C.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let z=n.properties.get(b);z.light=C}return b}function x(T,A,C,M,b){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===xi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);let V=e.update(T),$=T.material;if(Array.isArray($)){let ie=V.groups;for(let K=0,ce=ie.length;K<ce;K++){let J=ie[K],fe=$[J.materialIndex];if(fe&&fe.visible){let w=v(T,fe,M,b);T.onBeforeShadow(n,T,A,C,V,w,J),n.renderBufferDirect(C,null,V,w,T,J),T.onAfterShadow(n,T,A,C,V,w,J)}}}else if($.visible){let ie=v(T,$,M,b);T.onBeforeShadow(n,T,A,C,V,ie,null),n.renderBufferDirect(C,null,V,ie,T,null),T.onAfterShadow(n,T,A,C,V,ie,null)}}let z=T.children;for(let V=0,$=z.length;V<$;V++)x(z[V],A,C,M,b)}function P(T){T.target.removeEventListener("dispose",P);for(let C in h){let M=h[C],b=T.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}var Oy={[Fl]:Ol,[Bl]:Vl,[zl]:Gl,[qs]:Hl,[Ol]:Fl,[Vl]:Bl,[Gl]:zl,[Hl]:qs};function By(n,e){function t(){let U=!1,_e=new lt,j=null,re=new lt(0,0,0,0);return{setMask:function(be){j!==be&&!U&&(n.colorMask(be,be,be,be),j=be)},setLocked:function(be){U=be},setClear:function(be,xe,Ve,wt,jt){jt===!0&&(be*=wt,xe*=wt,Ve*=wt),_e.set(be,xe,Ve,wt),re.equals(_e)===!1&&(n.clearColor(be,xe,Ve,wt),re.copy(_e))},reset:function(){U=!1,j=null,re.set(-1,0,0,0)}}}function i(){let U=!1,_e=!1,j=null,re=null,be=null;return{setReversed:function(xe){if(_e!==xe){let Ve=e.get("EXT_clip_control");_e?Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.ZERO_TO_ONE_EXT):Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.NEGATIVE_ONE_TO_ONE_EXT);let wt=be;be=null,this.setClear(wt)}_e=xe},getReversed:function(){return _e},setTest:function(xe){xe?Q(n.DEPTH_TEST):W(n.DEPTH_TEST)},setMask:function(xe){j!==xe&&!U&&(n.depthMask(xe),j=xe)},setFunc:function(xe){if(_e&&(xe=Oy[xe]),re!==xe){switch(xe){case Fl:n.depthFunc(n.NEVER);break;case Ol:n.depthFunc(n.ALWAYS);break;case Bl:n.depthFunc(n.LESS);break;case qs:n.depthFunc(n.LEQUAL);break;case zl:n.depthFunc(n.EQUAL);break;case Hl:n.depthFunc(n.GEQUAL);break;case Vl:n.depthFunc(n.GREATER);break;case Gl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}re=xe}},setLocked:function(xe){U=xe},setClear:function(xe){be!==xe&&(_e&&(xe=1-xe),n.clearDepth(xe),be=xe)},reset:function(){U=!1,j=null,re=null,be=null,_e=!1}}}function s(){let U=!1,_e=null,j=null,re=null,be=null,xe=null,Ve=null,wt=null,jt=null;return{setTest:function(at){U||(at?Q(n.STENCIL_TEST):W(n.STENCIL_TEST))},setMask:function(at){_e!==at&&!U&&(n.stencilMask(at),_e=at)},setFunc:function(at,Bn,di){(j!==at||re!==Bn||be!==di)&&(n.stencilFunc(at,Bn,di),j=at,re=Bn,be=di)},setOp:function(at,Bn,di){(xe!==at||Ve!==Bn||wt!==di)&&(n.stencilOp(at,Bn,di),xe=at,Ve=Bn,wt=di)},setLocked:function(at){U=at},setClear:function(at){jt!==at&&(n.clearStencil(at),jt=at)},reset:function(){U=!1,_e=null,j=null,re=null,be=null,xe=null,Ve=null,wt=null,jt=null}}}let r=new t,a=new i,o=new s,c=new WeakMap,h=new WeakMap,l={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,y=null,v=null,x=null,P=null,T=null,A=new Ue(0,0,0),C=0,M=!1,b=null,L=null,z=null,V=null,$=null,ie=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,ce=0,J=n.getParameter(n.VERSION);J.indexOf("WebGL")!==-1?(ce=parseFloat(/^WebGL (\d)/.exec(J)[1]),K=ce>=1):J.indexOf("OpenGL ES")!==-1&&(ce=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),K=ce>=2);let fe=null,w={},B=n.getParameter(n.SCISSOR_BOX),G=n.getParameter(n.VIEWPORT),ne=new lt().fromArray(B),N=new lt().fromArray(G);function k(U,_e,j,re){let be=new Uint8Array(4),xe=n.createTexture();n.bindTexture(U,xe),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ve=0;Ve<j;Ve++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(_e,0,n.RGBA,1,1,re,0,n.RGBA,n.UNSIGNED_BYTE,be):n.texImage2D(_e+Ve,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,be);return xe}let Z={};Z[n.TEXTURE_2D]=k(n.TEXTURE_2D,n.TEXTURE_2D,1),Z[n.TEXTURE_CUBE_MAP]=k(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[n.TEXTURE_2D_ARRAY]=k(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Z[n.TEXTURE_3D]=k(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Q(n.DEPTH_TEST),a.setFunc(qs),Ze(!1),Je(du),Q(n.CULL_FACE),D(Vi);function Q(U){l[U]!==!0&&(n.enable(U),l[U]=!0)}function W(U){l[U]!==!1&&(n.disable(U),l[U]=!1)}function ae(U,_e){return u[U]!==_e?(n.bindFramebuffer(U,_e),u[U]=_e,U===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=_e),U===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=_e),!0):!1}function te(U,_e){let j=p,re=!1;if(U){j=f.get(_e),j===void 0&&(j=[],f.set(_e,j));let be=U.textures;if(j.length!==be.length||j[0]!==n.COLOR_ATTACHMENT0){for(let xe=0,Ve=be.length;xe<Ve;xe++)j[xe]=n.COLOR_ATTACHMENT0+xe;j.length=be.length,re=!0}}else j[0]!==n.BACK&&(j[0]=n.BACK,re=!0);re&&n.drawBuffers(j)}function pe(U){return g!==U?(n.useProgram(U),g=U,!0):!1}let Fe={[as]:n.FUNC_ADD,[ep]:n.FUNC_SUBTRACT,[tp]:n.FUNC_REVERSE_SUBTRACT};Fe[np]=n.MIN,Fe[ip]=n.MAX;let nt={[sp]:n.ZERO,[rp]:n.ONE,[ap]:n.SRC_COLOR,[Nl]:n.SRC_ALPHA,[dp]:n.SRC_ALPHA_SATURATE,[hp]:n.DST_COLOR,[lp]:n.DST_ALPHA,[op]:n.ONE_MINUS_SRC_COLOR,[kl]:n.ONE_MINUS_SRC_ALPHA,[up]:n.ONE_MINUS_DST_COLOR,[cp]:n.ONE_MINUS_DST_ALPHA,[fp]:n.CONSTANT_COLOR,[pp]:n.ONE_MINUS_CONSTANT_COLOR,[mp]:n.CONSTANT_ALPHA,[gp]:n.ONE_MINUS_CONSTANT_ALPHA};function D(U,_e,j,re,be,xe,Ve,wt,jt,at){if(U===Vi){_===!0&&(W(n.BLEND),_=!1);return}if(_===!1&&(Q(n.BLEND),_=!0),U!==Qf){if(U!==m||at!==M){if((d!==as||x!==as)&&(n.blendEquation(n.FUNC_ADD),d=as,x=as),at)switch(U){case Gi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Fr:n.blendFunc(n.ONE,n.ONE);break;case fu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case pu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Gi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Fr:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case fu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case pu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}y=null,v=null,P=null,T=null,A.set(0,0,0),C=0,m=U,M=at}return}be=be||_e,xe=xe||j,Ve=Ve||re,(_e!==d||be!==x)&&(n.blendEquationSeparate(Fe[_e],Fe[be]),d=_e,x=be),(j!==y||re!==v||xe!==P||Ve!==T)&&(n.blendFuncSeparate(nt[j],nt[re],nt[xe],nt[Ve]),y=j,v=re,P=xe,T=Ve),(wt.equals(A)===!1||jt!==C)&&(n.blendColor(wt.r,wt.g,wt.b,jt),A.copy(wt),C=jt),m=U,M=!1}function Xt(U,_e){U.side===Ct?W(n.CULL_FACE):Q(n.CULL_FACE);let j=U.side===tn;_e&&(j=!j),Ze(j),U.blending===Gi&&U.transparent===!1?D(Vi):D(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);let re=U.stencilWrite;o.setTest(re),re&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),et(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Q(n.SAMPLE_ALPHA_TO_COVERAGE):W(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ze(U){b!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),b=U)}function Je(U){U!==Kf?(Q(n.CULL_FACE),U!==L&&(U===du?n.cullFace(n.BACK):U===jf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):W(n.CULL_FACE),L=U}function Ae(U){U!==z&&(K&&n.lineWidth(U),z=U)}function et(U,_e,j){U?(Q(n.POLYGON_OFFSET_FILL),(V!==_e||$!==j)&&(n.polygonOffset(_e,j),V=_e,$=j)):W(n.POLYGON_OFFSET_FILL)}function Ie(U){U?Q(n.SCISSOR_TEST):W(n.SCISSOR_TEST)}function R(U){U===void 0&&(U=n.TEXTURE0+ie-1),fe!==U&&(n.activeTexture(U),fe=U)}function S(U,_e,j){j===void 0&&(fe===null?j=n.TEXTURE0+ie-1:j=fe);let re=w[j];re===void 0&&(re={type:void 0,texture:void 0},w[j]=re),(re.type!==U||re.texture!==_e)&&(fe!==j&&(n.activeTexture(j),fe=j),n.bindTexture(U,_e||Z[U]),re.type=U,re.texture=_e)}function H(){let U=w[fe];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function se(){try{n.compressedTexImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function oe(){try{n.compressedTexImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ee(){try{n.texSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Le(){try{n.texSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ye(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Me(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function je(){try{n.texStorage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ue(){try{n.texStorage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function we(){try{n.texImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ne(){try{n.texImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Oe(U){ne.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),ne.copy(U))}function Ee(U){N.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),N.copy(U))}function Ke(U,_e){let j=h.get(_e);j===void 0&&(j=new WeakMap,h.set(_e,j));let re=j.get(U);re===void 0&&(re=n.getUniformBlockIndex(_e,U.name),j.set(U,re))}function Ye(U,_e){let re=h.get(_e).get(U);c.get(_e)!==re&&(n.uniformBlockBinding(_e,re,U.__bindingPointIndex),c.set(_e,re))}function _t(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),l={},fe=null,w={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,y=null,v=null,x=null,P=null,T=null,A=new Ue(0,0,0),C=0,M=!1,b=null,L=null,z=null,V=null,$=null,ne.set(0,0,n.canvas.width,n.canvas.height),N.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Q,disable:W,bindFramebuffer:ae,drawBuffers:te,useProgram:pe,setBlending:D,setMaterial:Xt,setFlipSided:Ze,setCullFace:Je,setLineWidth:Ae,setPolygonOffset:et,setScissorTest:Ie,activeTexture:R,bindTexture:S,unbindTexture:H,compressedTexImage2D:se,compressedTexImage3D:oe,texImage2D:we,texImage3D:Ne,updateUBOMapping:Ke,uniformBlockBinding:Ye,texStorage2D:je,texStorage3D:ue,texSubImage2D:ee,texSubImage3D:Le,compressedTexSubImage2D:ye,compressedTexSubImage3D:Me,scissor:Oe,viewport:Ee,reset:_t}}function ud(n,e,t,i){let s=zy(i);switch(t){case Cd:return n*e;case Id:return n*e;case Ld:return n*e*2;case rh:return n*e/s.components*s.byteLength;case ah:return n*e/s.components*s.byteLength;case Dd:return n*e*2/s.components*s.byteLength;case oh:return n*e*2/s.components*s.byteLength;case Pd:return n*e*3/s.components*s.byteLength;case Wn:return n*e*4/s.components*s.byteLength;case lh:return n*e*4/s.components*s.byteLength;case qa:case Za:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case $a:case Ja:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Zl:case Jl:return Math.max(n,16)*Math.max(e,8)/4;case ql:case $l:return Math.max(n,8)*Math.max(e,8)/2;case Kl:case jl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ql:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ec:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case tc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case nc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ic:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case sc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case rc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ac:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case oc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case lc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case cc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case hc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case uc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case dc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case fc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ka:case pc:case mc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Ud:case gc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case _c:case yc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function zy(n){switch(n){case Mi:case Td:return{byteLength:1,components:1};case Br:case Ad:case $r:return{byteLength:2,components:1};case ih:case sh:return{byteLength:2,components:4};case us:case nh:case ri:return{byteLength:4,components:1};case Rd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Hy(n,e,t,i,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Te,l=new WeakMap,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,S){return p?new OffscreenCanvas(R,S):eo("canvas")}function _(R,S,H){let se=1,oe=Ie(R);if((oe.width>H||oe.height>H)&&(se=H/Math.max(oe.width,oe.height)),se<1)if(typeof HTMLImageElement!="undefined"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&R instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&R instanceof ImageBitmap||typeof VideoFrame!="undefined"&&R instanceof VideoFrame){let ee=Math.floor(se*oe.width),Le=Math.floor(se*oe.height);u===void 0&&(u=g(ee,Le));let ye=S?g(ee,Le):u;return ye.width=ee,ye.height=Le,ye.getContext("2d").drawImage(R,0,0,ee,Le),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+ee+"x"+Le+")."),ye}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),R;return R}function m(R){return R.generateMipmaps}function d(R){n.generateMipmap(R)}function y(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(R,S,H,se,oe=!1){if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ee=S;if(S===n.RED&&(H===n.FLOAT&&(ee=n.R32F),H===n.HALF_FLOAT&&(ee=n.R16F),H===n.UNSIGNED_BYTE&&(ee=n.R8)),S===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.R8UI),H===n.UNSIGNED_SHORT&&(ee=n.R16UI),H===n.UNSIGNED_INT&&(ee=n.R32UI),H===n.BYTE&&(ee=n.R8I),H===n.SHORT&&(ee=n.R16I),H===n.INT&&(ee=n.R32I)),S===n.RG&&(H===n.FLOAT&&(ee=n.RG32F),H===n.HALF_FLOAT&&(ee=n.RG16F),H===n.UNSIGNED_BYTE&&(ee=n.RG8)),S===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.RG8UI),H===n.UNSIGNED_SHORT&&(ee=n.RG16UI),H===n.UNSIGNED_INT&&(ee=n.RG32UI),H===n.BYTE&&(ee=n.RG8I),H===n.SHORT&&(ee=n.RG16I),H===n.INT&&(ee=n.RG32I)),S===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.RGB8UI),H===n.UNSIGNED_SHORT&&(ee=n.RGB16UI),H===n.UNSIGNED_INT&&(ee=n.RGB32UI),H===n.BYTE&&(ee=n.RGB8I),H===n.SHORT&&(ee=n.RGB16I),H===n.INT&&(ee=n.RGB32I)),S===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(ee=n.RGBA16UI),H===n.UNSIGNED_INT&&(ee=n.RGBA32UI),H===n.BYTE&&(ee=n.RGBA8I),H===n.SHORT&&(ee=n.RGBA16I),H===n.INT&&(ee=n.RGBA32I)),S===n.RGB&&H===n.UNSIGNED_INT_5_9_9_9_REV&&(ee=n.RGB9_E5),S===n.RGBA){let Le=oe?Eo:Qe.getTransfer(se);H===n.FLOAT&&(ee=n.RGBA32F),H===n.HALF_FLOAT&&(ee=n.RGBA16F),H===n.UNSIGNED_BYTE&&(ee=Le===ot?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT_4_4_4_4&&(ee=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(ee=n.RGB5_A1)}return(ee===n.R16F||ee===n.R32F||ee===n.RG16F||ee===n.RG32F||ee===n.RGBA16F||ee===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function x(R,S){let H;return R?S===null||S===us||S===Js?H=n.DEPTH24_STENCIL8:S===ri?H=n.DEPTH32F_STENCIL8:S===Br&&(H=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===us||S===Js?H=n.DEPTH_COMPONENT24:S===ri?H=n.DEPTH_COMPONENT32F:S===Br&&(H=n.DEPTH_COMPONENT16),H}function P(R,S){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Tn&&R.minFilter!==si?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function T(R){let S=R.target;S.removeEventListener("dispose",T),C(S),S.isVideoTexture&&l.delete(S)}function A(R){let S=R.target;S.removeEventListener("dispose",A),b(S)}function C(R){let S=i.get(R);if(S.__webglInit===void 0)return;let H=R.source,se=f.get(H);if(se){let oe=se[S.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&M(R),Object.keys(se).length===0&&f.delete(H)}i.remove(R)}function M(R){let S=i.get(R);n.deleteTexture(S.__webglTexture);let H=R.source,se=f.get(H);delete se[S.__cacheKey],a.memory.textures--}function b(R){let S=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let se=0;se<6;se++){if(Array.isArray(S.__webglFramebuffer[se]))for(let oe=0;oe<S.__webglFramebuffer[se].length;oe++)n.deleteFramebuffer(S.__webglFramebuffer[se][oe]);else n.deleteFramebuffer(S.__webglFramebuffer[se]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[se])}else{if(Array.isArray(S.__webglFramebuffer))for(let se=0;se<S.__webglFramebuffer.length;se++)n.deleteFramebuffer(S.__webglFramebuffer[se]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let se=0;se<S.__webglColorRenderbuffer.length;se++)S.__webglColorRenderbuffer[se]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[se]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let H=R.textures;for(let se=0,oe=H.length;se<oe;se++){let ee=i.get(H[se]);ee.__webglTexture&&(n.deleteTexture(ee.__webglTexture),a.memory.textures--),i.remove(H[se])}i.remove(R)}let L=0;function z(){L=0}function V(){let R=L;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),L+=1,R}function $(R){let S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function ie(R,S){let H=i.get(R);if(R.isVideoTexture&&Ae(R),R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){let se=R.image;if(se===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(se.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{N(H,R,S);return}}t.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+S)}function K(R,S){let H=i.get(R);if(R.version>0&&H.__version!==R.version){N(H,R,S);return}t.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+S)}function ce(R,S){let H=i.get(R);if(R.version>0&&H.__version!==R.version){N(H,R,S);return}t.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+S)}function J(R,S){let H=i.get(R);if(R.version>0&&H.__version!==R.version){k(H,R,S);return}t.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+S)}let fe={[Or]:n.REPEAT,[cs]:n.CLAMP_TO_EDGE,[Yl]:n.MIRRORED_REPEAT},w={[Tn]:n.NEAREST,[Ep]:n.NEAREST_MIPMAP_NEAREST,[xa]:n.NEAREST_MIPMAP_LINEAR,[si]:n.LINEAR,[tl]:n.LINEAR_MIPMAP_NEAREST,[hs]:n.LINEAR_MIPMAP_LINEAR},B={[Cp]:n.NEVER,[Np]:n.ALWAYS,[Pp]:n.LESS,[kd]:n.LEQUAL,[Ip]:n.EQUAL,[Up]:n.GEQUAL,[Lp]:n.GREATER,[Dp]:n.NOTEQUAL};function G(R,S){if(S.type===ri&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===si||S.magFilter===tl||S.magFilter===xa||S.magFilter===hs||S.minFilter===si||S.minFilter===tl||S.minFilter===xa||S.minFilter===hs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,fe[S.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,fe[S.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,fe[S.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,w[S.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,w[S.minFilter]),S.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,B[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Tn||S.minFilter!==xa&&S.minFilter!==hs||S.type===ri&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function ne(R,S){let H=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",T));let se=S.source,oe=f.get(se);oe===void 0&&(oe={},f.set(se,oe));let ee=$(S);if(ee!==R.__cacheKey){oe[ee]===void 0&&(oe[ee]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,H=!0),oe[ee].usedTimes++;let Le=oe[R.__cacheKey];Le!==void 0&&(oe[R.__cacheKey].usedTimes--,Le.usedTimes===0&&M(S)),R.__cacheKey=ee,R.__webglTexture=oe[ee].texture}return H}function N(R,S,H){let se=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(se=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(se=n.TEXTURE_3D);let oe=ne(R,S),ee=S.source;t.bindTexture(se,R.__webglTexture,n.TEXTURE0+H);let Le=i.get(ee);if(ee.version!==Le.__version||oe===!0){t.activeTexture(n.TEXTURE0+H);let ye=Qe.getPrimaries(Qe.workingColorSpace),Me=S.colorSpace===Hi?null:Qe.getPrimaries(S.colorSpace),je=S.colorSpace===Hi||ye===Me?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);let ue=_(S.image,!1,s.maxTextureSize);ue=et(S,ue);let we=r.convert(S.format,S.colorSpace),Ne=r.convert(S.type),Oe=v(S.internalFormat,we,Ne,S.colorSpace,S.isVideoTexture);G(se,S);let Ee,Ke=S.mipmaps,Ye=S.isVideoTexture!==!0,_t=Le.__version===void 0||oe===!0,U=ee.dataReady,_e=P(S,ue);if(S.isDepthTexture)Oe=x(S.format===Ks,S.type),_t&&(Ye?t.texStorage2D(n.TEXTURE_2D,1,Oe,ue.width,ue.height):t.texImage2D(n.TEXTURE_2D,0,Oe,ue.width,ue.height,0,we,Ne,null));else if(S.isDataTexture)if(Ke.length>0){Ye&&_t&&t.texStorage2D(n.TEXTURE_2D,_e,Oe,Ke[0].width,Ke[0].height);for(let j=0,re=Ke.length;j<re;j++)Ee=Ke[j],Ye?U&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,Ee.width,Ee.height,we,Ne,Ee.data):t.texImage2D(n.TEXTURE_2D,j,Oe,Ee.width,Ee.height,0,we,Ne,Ee.data);S.generateMipmaps=!1}else Ye?(_t&&t.texStorage2D(n.TEXTURE_2D,_e,Oe,ue.width,ue.height),U&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ue.width,ue.height,we,Ne,ue.data)):t.texImage2D(n.TEXTURE_2D,0,Oe,ue.width,ue.height,0,we,Ne,ue.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ye&&_t&&t.texStorage3D(n.TEXTURE_2D_ARRAY,_e,Oe,Ke[0].width,Ke[0].height,ue.depth);for(let j=0,re=Ke.length;j<re;j++)if(Ee=Ke[j],S.format!==Wn)if(we!==null)if(Ye){if(U)if(S.layerUpdates.size>0){let be=ud(Ee.width,Ee.height,S.format,S.type);for(let xe of S.layerUpdates){let Ve=Ee.data.subarray(xe*be/Ee.data.BYTES_PER_ELEMENT,(xe+1)*be/Ee.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,xe,Ee.width,Ee.height,1,we,Ve)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,Ee.width,Ee.height,ue.depth,we,Ee.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,j,Oe,Ee.width,Ee.height,ue.depth,0,Ee.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ye?U&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,Ee.width,Ee.height,ue.depth,we,Ne,Ee.data):t.texImage3D(n.TEXTURE_2D_ARRAY,j,Oe,Ee.width,Ee.height,ue.depth,0,we,Ne,Ee.data)}else{Ye&&_t&&t.texStorage2D(n.TEXTURE_2D,_e,Oe,Ke[0].width,Ke[0].height);for(let j=0,re=Ke.length;j<re;j++)Ee=Ke[j],S.format!==Wn?we!==null?Ye?U&&t.compressedTexSubImage2D(n.TEXTURE_2D,j,0,0,Ee.width,Ee.height,we,Ee.data):t.compressedTexImage2D(n.TEXTURE_2D,j,Oe,Ee.width,Ee.height,0,Ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?U&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,Ee.width,Ee.height,we,Ne,Ee.data):t.texImage2D(n.TEXTURE_2D,j,Oe,Ee.width,Ee.height,0,we,Ne,Ee.data)}else if(S.isDataArrayTexture)if(Ye){if(_t&&t.texStorage3D(n.TEXTURE_2D_ARRAY,_e,Oe,ue.width,ue.height,ue.depth),U)if(S.layerUpdates.size>0){let j=ud(ue.width,ue.height,S.format,S.type);for(let re of S.layerUpdates){let be=ue.data.subarray(re*j/ue.data.BYTES_PER_ELEMENT,(re+1)*j/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,re,ue.width,ue.height,1,we,Ne,be)}S.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,we,Ne,ue.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Oe,ue.width,ue.height,ue.depth,0,we,Ne,ue.data);else if(S.isData3DTexture)Ye?(_t&&t.texStorage3D(n.TEXTURE_3D,_e,Oe,ue.width,ue.height,ue.depth),U&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,we,Ne,ue.data)):t.texImage3D(n.TEXTURE_3D,0,Oe,ue.width,ue.height,ue.depth,0,we,Ne,ue.data);else if(S.isFramebufferTexture){if(_t)if(Ye)t.texStorage2D(n.TEXTURE_2D,_e,Oe,ue.width,ue.height);else{let j=ue.width,re=ue.height;for(let be=0;be<_e;be++)t.texImage2D(n.TEXTURE_2D,be,Oe,j,re,0,we,Ne,null),j>>=1,re>>=1}}else if(Ke.length>0){if(Ye&&_t){let j=Ie(Ke[0]);t.texStorage2D(n.TEXTURE_2D,_e,Oe,j.width,j.height)}for(let j=0,re=Ke.length;j<re;j++)Ee=Ke[j],Ye?U&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,we,Ne,Ee):t.texImage2D(n.TEXTURE_2D,j,Oe,we,Ne,Ee);S.generateMipmaps=!1}else if(Ye){if(_t){let j=Ie(ue);t.texStorage2D(n.TEXTURE_2D,_e,Oe,j.width,j.height)}U&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,we,Ne,ue)}else t.texImage2D(n.TEXTURE_2D,0,Oe,we,Ne,ue);m(S)&&d(se),Le.__version=ee.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function k(R,S,H){if(S.image.length!==6)return;let se=ne(R,S),oe=S.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+H);let ee=i.get(oe);if(oe.version!==ee.__version||se===!0){t.activeTexture(n.TEXTURE0+H);let Le=Qe.getPrimaries(Qe.workingColorSpace),ye=S.colorSpace===Hi?null:Qe.getPrimaries(S.colorSpace),Me=S.colorSpace===Hi||Le===ye?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);let je=S.isCompressedTexture||S.image[0].isCompressedTexture,ue=S.image[0]&&S.image[0].isDataTexture,we=[];for(let re=0;re<6;re++)!je&&!ue?we[re]=_(S.image[re],!0,s.maxCubemapSize):we[re]=ue?S.image[re].image:S.image[re],we[re]=et(S,we[re]);let Ne=we[0],Oe=r.convert(S.format,S.colorSpace),Ee=r.convert(S.type),Ke=v(S.internalFormat,Oe,Ee,S.colorSpace),Ye=S.isVideoTexture!==!0,_t=ee.__version===void 0||se===!0,U=oe.dataReady,_e=P(S,Ne);G(n.TEXTURE_CUBE_MAP,S);let j;if(je){Ye&&_t&&t.texStorage2D(n.TEXTURE_CUBE_MAP,_e,Ke,Ne.width,Ne.height);for(let re=0;re<6;re++){j=we[re].mipmaps;for(let be=0;be<j.length;be++){let xe=j[be];S.format!==Wn?Oe!==null?Ye?U&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,be,0,0,xe.width,xe.height,Oe,xe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,be,Ke,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ye?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,be,0,0,xe.width,xe.height,Oe,Ee,xe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,be,Ke,xe.width,xe.height,0,Oe,Ee,xe.data)}}}else{if(j=S.mipmaps,Ye&&_t){j.length>0&&_e++;let re=Ie(we[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,_e,Ke,re.width,re.height)}for(let re=0;re<6;re++)if(ue){Ye?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,we[re].width,we[re].height,Oe,Ee,we[re].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ke,we[re].width,we[re].height,0,Oe,Ee,we[re].data);for(let be=0;be<j.length;be++){let Ve=j[be].image[re].image;Ye?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,be+1,0,0,Ve.width,Ve.height,Oe,Ee,Ve.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,be+1,Ke,Ve.width,Ve.height,0,Oe,Ee,Ve.data)}}else{Ye?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Oe,Ee,we[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ke,Oe,Ee,we[re]);for(let be=0;be<j.length;be++){let xe=j[be];Ye?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,be+1,0,0,Oe,Ee,xe.image[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,be+1,Ke,Oe,Ee,xe.image[re])}}}m(S)&&d(n.TEXTURE_CUBE_MAP),ee.__version=oe.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function Z(R,S,H,se,oe,ee){let Le=r.convert(H.format,H.colorSpace),ye=r.convert(H.type),Me=v(H.internalFormat,Le,ye,H.colorSpace),je=i.get(S),ue=i.get(H);if(ue.__renderTarget=S,!je.__hasExternalTextures){let we=Math.max(1,S.width>>ee),Ne=Math.max(1,S.height>>ee);oe===n.TEXTURE_3D||oe===n.TEXTURE_2D_ARRAY?t.texImage3D(oe,ee,Me,we,Ne,S.depth,0,Le,ye,null):t.texImage2D(oe,ee,Me,we,Ne,0,Le,ye,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),Je(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,se,oe,ue.__webglTexture,0,Ze(S)):(oe===n.TEXTURE_2D||oe>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,se,oe,ue.__webglTexture,ee),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Q(R,S,H){if(n.bindRenderbuffer(n.RENDERBUFFER,R),S.depthBuffer){let se=S.depthTexture,oe=se&&se.isDepthTexture?se.type:null,ee=x(S.stencilBuffer,oe),Le=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ye=Ze(S);Je(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ye,ee,S.width,S.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,ye,ee,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,ee,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Le,n.RENDERBUFFER,R)}else{let se=S.textures;for(let oe=0;oe<se.length;oe++){let ee=se[oe],Le=r.convert(ee.format,ee.colorSpace),ye=r.convert(ee.type),Me=v(ee.internalFormat,Le,ye,ee.colorSpace),je=Ze(S);H&&Je(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,je,Me,S.width,S.height):Je(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,je,Me,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,Me,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function W(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let se=i.get(S.depthTexture);se.__renderTarget=S,(!se.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),ie(S.depthTexture,0);let oe=se.__webglTexture,ee=Ze(S);if(S.depthTexture.format===Ws)Je(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,oe,0,ee):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,oe,0);else if(S.depthTexture.format===Ks)Je(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,oe,0,ee):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,oe,0);else throw new Error("Unknown depthTexture format")}function ae(R){let S=i.get(R),H=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){let se=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),se){let oe=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,se.removeEventListener("dispose",oe)};se.addEventListener("dispose",oe),S.__depthDisposeCallback=oe}S.__boundDepthTexture=se}if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");W(S.__webglFramebuffer,R)}else if(H){S.__webglDepthbuffer=[];for(let se=0;se<6;se++)if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[se]),S.__webglDepthbuffer[se]===void 0)S.__webglDepthbuffer[se]=n.createRenderbuffer(),Q(S.__webglDepthbuffer[se],R,!1);else{let oe=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=S.__webglDepthbuffer[se];n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,ee)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),Q(S.__webglDepthbuffer,R,!1);else{let se=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,oe),n.framebufferRenderbuffer(n.FRAMEBUFFER,se,n.RENDERBUFFER,oe)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function te(R,S,H){let se=i.get(R);S!==void 0&&Z(se.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&ae(R)}function pe(R){let S=R.texture,H=i.get(R),se=i.get(S);R.addEventListener("dispose",A);let oe=R.textures,ee=R.isWebGLCubeRenderTarget===!0,Le=oe.length>1;if(Le||(se.__webglTexture===void 0&&(se.__webglTexture=n.createTexture()),se.__version=S.version,a.memory.textures++),ee){H.__webglFramebuffer=[];for(let ye=0;ye<6;ye++)if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer[ye]=[];for(let Me=0;Me<S.mipmaps.length;Me++)H.__webglFramebuffer[ye][Me]=n.createFramebuffer()}else H.__webglFramebuffer[ye]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer=[];for(let ye=0;ye<S.mipmaps.length;ye++)H.__webglFramebuffer[ye]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(Le)for(let ye=0,Me=oe.length;ye<Me;ye++){let je=i.get(oe[ye]);je.__webglTexture===void 0&&(je.__webglTexture=n.createTexture(),a.memory.textures++)}if(R.samples>0&&Je(R)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ye=0;ye<oe.length;ye++){let Me=oe[ye];H.__webglColorRenderbuffer[ye]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[ye]);let je=r.convert(Me.format,Me.colorSpace),ue=r.convert(Me.type),we=v(Me.internalFormat,je,ue,Me.colorSpace,R.isXRRenderTarget===!0),Ne=Ze(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ne,we,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,H.__webglColorRenderbuffer[ye])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),Q(H.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ee){t.bindTexture(n.TEXTURE_CUBE_MAP,se.__webglTexture),G(n.TEXTURE_CUBE_MAP,S);for(let ye=0;ye<6;ye++)if(S.mipmaps&&S.mipmaps.length>0)for(let Me=0;Me<S.mipmaps.length;Me++)Z(H.__webglFramebuffer[ye][Me],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Me);else Z(H.__webglFramebuffer[ye],R,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0);m(S)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Le){for(let ye=0,Me=oe.length;ye<Me;ye++){let je=oe[ye],ue=i.get(je);t.bindTexture(n.TEXTURE_2D,ue.__webglTexture),G(n.TEXTURE_2D,je),Z(H.__webglFramebuffer,R,je,n.COLOR_ATTACHMENT0+ye,n.TEXTURE_2D,0),m(je)&&d(n.TEXTURE_2D)}t.unbindTexture()}else{let ye=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ye=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ye,se.__webglTexture),G(ye,S),S.mipmaps&&S.mipmaps.length>0)for(let Me=0;Me<S.mipmaps.length;Me++)Z(H.__webglFramebuffer[Me],R,S,n.COLOR_ATTACHMENT0,ye,Me);else Z(H.__webglFramebuffer,R,S,n.COLOR_ATTACHMENT0,ye,0);m(S)&&d(ye),t.unbindTexture()}R.depthBuffer&&ae(R)}function Fe(R){let S=R.textures;for(let H=0,se=S.length;H<se;H++){let oe=S[H];if(m(oe)){let ee=y(R),Le=i.get(oe).__webglTexture;t.bindTexture(ee,Le),d(ee),t.unbindTexture()}}}let nt=[],D=[];function Xt(R){if(R.samples>0){if(Je(R)===!1){let S=R.textures,H=R.width,se=R.height,oe=n.COLOR_BUFFER_BIT,ee=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Le=i.get(R),ye=S.length>1;if(ye)for(let Me=0;Me<S.length;Me++)t.bindFramebuffer(n.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Le.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Le.__webglFramebuffer);for(let Me=0;Me<S.length;Me++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(oe|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(oe|=n.STENCIL_BUFFER_BIT)),ye){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Le.__webglColorRenderbuffer[Me]);let je=i.get(S[Me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,je,0)}n.blitFramebuffer(0,0,H,se,0,0,H,se,oe,n.NEAREST),c===!0&&(nt.length=0,D.length=0,nt.push(n.COLOR_ATTACHMENT0+Me),R.depthBuffer&&R.resolveDepthBuffer===!1&&(nt.push(ee),D.push(ee),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,D)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,nt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ye)for(let Me=0;Me<S.length;Me++){t.bindFramebuffer(n.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.RENDERBUFFER,Le.__webglColorRenderbuffer[Me]);let je=i.get(S[Me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.TEXTURE_2D,je,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Le.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let S=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function Ze(R){return Math.min(s.maxSamples,R.samples)}function Je(R){let S=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Ae(R){let S=a.render.frame;l.get(R)!==S&&(l.set(R,S),R.update())}function et(R,S){let H=R.colorSpace,se=R.format,oe=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||H!==ir&&H!==Hi&&(Qe.getTransfer(H)===ot?(se!==Wn||oe!==Mi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),S}function Ie(R){return typeof HTMLImageElement!="undefined"&&R instanceof HTMLImageElement?(h.width=R.naturalWidth||R.width,h.height=R.naturalHeight||R.height):typeof VideoFrame!="undefined"&&R instanceof VideoFrame?(h.width=R.displayWidth,h.height=R.displayHeight):(h.width=R.width,h.height=R.height),h}this.allocateTextureUnit=V,this.resetTextureUnits=z,this.setTexture2D=ie,this.setTexture2DArray=K,this.setTexture3D=ce,this.setTextureCube=J,this.rebindTextures=te,this.setupRenderTarget=pe,this.updateRenderTargetMipmap=Fe,this.updateMultisampleRenderTarget=Xt,this.setupDepthRenderbuffer=ae,this.setupFrameBufferTexture=Z,this.useMultisampledRTT=Je}function Vy(n,e){function t(i,s=Hi){let r,a=Qe.getTransfer(s);if(i===Mi)return n.UNSIGNED_BYTE;if(i===ih)return n.UNSIGNED_SHORT_4_4_4_4;if(i===sh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Rd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Td)return n.BYTE;if(i===Ad)return n.SHORT;if(i===Br)return n.UNSIGNED_SHORT;if(i===nh)return n.INT;if(i===us)return n.UNSIGNED_INT;if(i===ri)return n.FLOAT;if(i===$r)return n.HALF_FLOAT;if(i===Cd)return n.ALPHA;if(i===Pd)return n.RGB;if(i===Wn)return n.RGBA;if(i===Id)return n.LUMINANCE;if(i===Ld)return n.LUMINANCE_ALPHA;if(i===Ws)return n.DEPTH_COMPONENT;if(i===Ks)return n.DEPTH_STENCIL;if(i===rh)return n.RED;if(i===ah)return n.RED_INTEGER;if(i===Dd)return n.RG;if(i===oh)return n.RG_INTEGER;if(i===lh)return n.RGBA_INTEGER;if(i===qa||i===Za||i===$a||i===Ja)if(a===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===qa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===qa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Za)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===$a)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ja)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ql||i===Zl||i===$l||i===Jl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ql)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Zl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===$l)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Jl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Kl||i===jl||i===Ql)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Kl||i===jl)return a===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Ql)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ec||i===tc||i===nc||i===ic||i===sc||i===rc||i===ac||i===oc||i===lc||i===cc||i===hc||i===uc||i===dc||i===fc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ec)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===tc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===nc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ic)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===sc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===rc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ac)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===oc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===lc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===cc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===hc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===uc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===dc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===fc)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ka||i===pc||i===mc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Ka)return a===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===pc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===mc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ud||i===gc||i===_c||i===yc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Ka)return r.COMPRESSED_RED_RGTC1_EXT;if(i===gc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===_c)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===yc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Js?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var Dc=class extends Yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Et=class extends Zt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Gy={type:"move"},kr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Et,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Et,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Et,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,i),d=this._getHandJoint(h,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],f=l.position.distanceTo(u.position),p=.02,g=.005;h.inputState.pinching&&f>p+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&f<=p-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Gy)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Et;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},Wy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Xy=`
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

}`,Uc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){let s=new pn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Ln({vertexShader:Wy,fragmentShader:Xy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ke(new Ti(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Nc=class extends Si{constructor(e,t){super();let i=this,s=null,r=1,a=null,o="local-floor",c=1,h=null,l=null,u=null,f=null,p=null,g=null,_=new Uc,m=t.getContextAttributes(),d=null,y=null,v=[],x=[],P=new Te,T=null,A=new Yt;A.viewport=new lt;let C=new Yt;C.viewport=new lt;let M=[A,C],b=new Dc,L=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(N){let k=v[N];return k===void 0&&(k=new kr,v[N]=k),k.getTargetRaySpace()},this.getControllerGrip=function(N){let k=v[N];return k===void 0&&(k=new kr,v[N]=k),k.getGripSpace()},this.getHand=function(N){let k=v[N];return k===void 0&&(k=new kr,v[N]=k),k.getHandSpace()};function V(N){let k=x.indexOf(N.inputSource);if(k===-1)return;let Z=v[k];Z!==void 0&&(Z.update(N.inputSource,N.frame,h||a),Z.dispatchEvent({type:N.type,data:N.inputSource}))}function $(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",ie);for(let N=0;N<v.length;N++){let k=x[N];k!==null&&(x[N]=null,v[N].disconnect(k))}L=null,z=null,_.reset(),e.setRenderTarget(d),p=null,f=null,u=null,s=null,y=null,ne.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(N){r=N,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(N){o=N,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(N){h=N},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(N){if(s=N,s!==null){if(d=e.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",$),s.addEventListener("inputsourceschange",ie),m.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(P),s.renderState.layers===void 0){let k={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,k),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Xn(p.framebufferWidth,p.framebufferHeight,{format:Wn,type:Mi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let k=null,Z=null,Q=null;m.depth&&(Q=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,k=m.stencil?Ks:Ws,Z=m.stencil?Js:us);let W={colorFormat:t.RGBA8,depthFormat:Q,scaleFactor:r};u=new XRWebGLBinding(s,t),f=u.createProjectionLayer(W),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),y=new Xn(f.textureWidth,f.textureHeight,{format:Wn,type:Mi,depthTexture:new lo(f.textureWidth,f.textureHeight,Z,void 0,void 0,void 0,void 0,void 0,void 0,k),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),ne.setContext(s),ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function ie(N){for(let k=0;k<N.removed.length;k++){let Z=N.removed[k],Q=x.indexOf(Z);Q>=0&&(x[Q]=null,v[Q].disconnect(Z))}for(let k=0;k<N.added.length;k++){let Z=N.added[k],Q=x.indexOf(Z);if(Q===-1){for(let ae=0;ae<v.length;ae++)if(ae>=x.length){x.push(Z),Q=ae;break}else if(x[ae]===null){x[ae]=Z,Q=ae;break}if(Q===-1)break}let W=v[Q];W&&W.connect(Z)}}let K=new I,ce=new I;function J(N,k,Z){K.setFromMatrixPosition(k.matrixWorld),ce.setFromMatrixPosition(Z.matrixWorld);let Q=K.distanceTo(ce),W=k.projectionMatrix.elements,ae=Z.projectionMatrix.elements,te=W[14]/(W[10]-1),pe=W[14]/(W[10]+1),Fe=(W[9]+1)/W[5],nt=(W[9]-1)/W[5],D=(W[8]-1)/W[0],Xt=(ae[8]+1)/ae[0],Ze=te*D,Je=te*Xt,Ae=Q/(-D+Xt),et=Ae*-D;if(k.matrixWorld.decompose(N.position,N.quaternion,N.scale),N.translateX(et),N.translateZ(Ae),N.matrixWorld.compose(N.position,N.quaternion,N.scale),N.matrixWorldInverse.copy(N.matrixWorld).invert(),W[10]===-1)N.projectionMatrix.copy(k.projectionMatrix),N.projectionMatrixInverse.copy(k.projectionMatrixInverse);else{let Ie=te+Ae,R=pe+Ae,S=Ze-et,H=Je+(Q-et),se=Fe*pe/R*Ie,oe=nt*pe/R*Ie;N.projectionMatrix.makePerspective(S,H,se,oe,Ie,R),N.projectionMatrixInverse.copy(N.projectionMatrix).invert()}}function fe(N,k){k===null?N.matrixWorld.copy(N.matrix):N.matrixWorld.multiplyMatrices(k.matrixWorld,N.matrix),N.matrixWorldInverse.copy(N.matrixWorld).invert()}this.updateCamera=function(N){if(s===null)return;let k=N.near,Z=N.far;_.texture!==null&&(_.depthNear>0&&(k=_.depthNear),_.depthFar>0&&(Z=_.depthFar)),b.near=C.near=A.near=k,b.far=C.far=A.far=Z,(L!==b.near||z!==b.far)&&(s.updateRenderState({depthNear:b.near,depthFar:b.far}),L=b.near,z=b.far),A.layers.mask=N.layers.mask|2,C.layers.mask=N.layers.mask|4,b.layers.mask=A.layers.mask|C.layers.mask;let Q=N.parent,W=b.cameras;fe(b,Q);for(let ae=0;ae<W.length;ae++)fe(W[ae],Q);W.length===2?J(b,A,C):b.projectionMatrix.copy(A.projectionMatrix),w(N,b,Q)};function w(N,k,Z){Z===null?N.matrix.copy(k.matrixWorld):(N.matrix.copy(Z.matrixWorld),N.matrix.invert(),N.matrix.multiply(k.matrixWorld)),N.matrix.decompose(N.position,N.quaternion,N.scale),N.updateMatrixWorld(!0),N.projectionMatrix.copy(k.projectionMatrix),N.projectionMatrixInverse.copy(k.projectionMatrixInverse),N.isPerspectiveCamera&&(N.fov=zr*2*Math.atan(1/N.projectionMatrix.elements[5]),N.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(N){c=N,f!==null&&(f.fixedFoveation=N),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=N)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(b)};let B=null;function G(N,k){if(l=k.getViewerPose(h||a),g=k,l!==null){let Z=l.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let Q=!1;Z.length!==b.cameras.length&&(b.cameras.length=0,Q=!0);for(let ae=0;ae<Z.length;ae++){let te=Z[ae],pe=null;if(p!==null)pe=p.getViewport(te);else{let nt=u.getViewSubImage(f,te);pe=nt.viewport,ae===0&&(e.setRenderTargetTextures(y,nt.colorTexture,f.ignoreDepthValues?void 0:nt.depthStencilTexture),e.setRenderTarget(y))}let Fe=M[ae];Fe===void 0&&(Fe=new Yt,Fe.layers.enable(ae),Fe.viewport=new lt,M[ae]=Fe),Fe.matrix.fromArray(te.transform.matrix),Fe.matrix.decompose(Fe.position,Fe.quaternion,Fe.scale),Fe.projectionMatrix.fromArray(te.projectionMatrix),Fe.projectionMatrixInverse.copy(Fe.projectionMatrix).invert(),Fe.viewport.set(pe.x,pe.y,pe.width,pe.height),ae===0&&(b.matrix.copy(Fe.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),Q===!0&&b.cameras.push(Fe)}let W=s.enabledFeatures;if(W&&W.includes("depth-sensing")){let ae=u.getDepthInformation(Z[0]);ae&&ae.isValid&&ae.texture&&_.init(e,ae,s.renderState)}}for(let Z=0;Z<v.length;Z++){let Q=x[Z],W=v[Z];Q!==null&&W!==void 0&&W.update(Q,k,h||a)}B&&B(N,k),k.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:k}),g=null}let ne=new zd;ne.setAnimationLoop(G),this.setAnimationLoop=function(N){B=N},this.dispose=function(){}}},ss=new mn,Yy=new We;function qy(n,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,Bd(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,y,v,x){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),l(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,x)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),_(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?c(m,d,y,v):d.isSpriteMaterial?h(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===tn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===tn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let y=e.get(d),v=y.envMap,x=y.envMapRotation;v&&(m.envMap.value=v,ss.copy(x),ss.x*=-1,ss.y*=-1,ss.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ss.y*=-1,ss.z*=-1),m.envMapRotation.value.setFromMatrix4(Yy.makeRotationFromEuler(ss)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,y,v){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*y,m.scale.value=v*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,y){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===tn&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){let y=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Zy(n,e,t,i){let s={},r={},a=[],o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,v){let x=v.program;i.uniformBlockBinding(y,x)}function h(y,v){let x=s[y.id];x===void 0&&(g(y),x=l(y),s[y.id]=x,y.addEventListener("dispose",m));let P=v.program;i.updateUBOMapping(y,P);let T=e.render.frame;r[y.id]!==T&&(f(y),r[y.id]=T)}function l(y){let v=u();y.__bindingPointIndex=v;let x=n.createBuffer(),P=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,P,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,x),x}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){let v=s[y.id],x=y.uniforms,P=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,A=x.length;T<A;T++){let C=Array.isArray(x[T])?x[T]:[x[T]];for(let M=0,b=C.length;M<b;M++){let L=C[M];if(p(L,T,M,P)===!0){let z=L.__offset,V=Array.isArray(L.value)?L.value:[L.value],$=0;for(let ie=0;ie<V.length;ie++){let K=V[ie],ce=_(K);typeof K=="number"||typeof K=="boolean"?(L.__data[0]=K,n.bufferSubData(n.UNIFORM_BUFFER,z+$,L.__data)):K.isMatrix3?(L.__data[0]=K.elements[0],L.__data[1]=K.elements[1],L.__data[2]=K.elements[2],L.__data[3]=0,L.__data[4]=K.elements[3],L.__data[5]=K.elements[4],L.__data[6]=K.elements[5],L.__data[7]=0,L.__data[8]=K.elements[6],L.__data[9]=K.elements[7],L.__data[10]=K.elements[8],L.__data[11]=0):(K.toArray(L.__data,$),$+=ce.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(y,v,x,P){let T=y.value,A=v+"_"+x;if(P[A]===void 0)return typeof T=="number"||typeof T=="boolean"?P[A]=T:P[A]=T.clone(),!0;{let C=P[A];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return P[A]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(y){let v=y.uniforms,x=0,P=16;for(let A=0,C=v.length;A<C;A++){let M=Array.isArray(v[A])?v[A]:[v[A]];for(let b=0,L=M.length;b<L;b++){let z=M[b],V=Array.isArray(z.value)?z.value:[z.value];for(let $=0,ie=V.length;$<ie;$++){let K=V[$],ce=_(K),J=x%P,fe=J%ce.boundary,w=J+fe;x+=fe,w!==0&&P-w<ce.storage&&(x+=P-w),z.__data=new Float32Array(ce.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=x,x+=ce.storage}}}let T=x%P;return T>0&&(x+=P-T),y.__size=x,y.__cache={},this}function _(y){let v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function m(y){let v=y.target;v.removeEventListener("dispose",m);let x=a.indexOf(v.__bindingPointIndex);a.splice(x,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function d(){for(let y in s)n.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:c,update:h,dispose:d}}var co=class{constructor(e={}){let{canvas:t=jp(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext!="undefined"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;let g=new Uint32Array(4),_=new Int32Array(4),m=null,d=null,y=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ot,this.toneMapping=ai,this.toneMappingExposure=1;let x=this,P=!1,T=0,A=0,C=null,M=-1,b=null,L=new lt,z=new lt,V=null,$=new Ue(0),ie=0,K=t.width,ce=t.height,J=1,fe=null,w=null,B=new lt(0,0,K,ce),G=new lt(0,0,K,ce),ne=!1,N=new Vr,k=!1,Z=!1,Q=new We,W=new We,ae=new I,te=new lt,pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Fe=!1;function nt(){return C===null?J:1}let D=i;function Xt(E,F){return t.getContext(E,F)}try{let E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",xe,!1),D===null){let F="webgl2";if(D=Xt(F,E),D===null)throw Xt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ze,Je,Ae,et,Ie,R,S,H,se,oe,ee,Le,ye,Me,je,ue,we,Ne,Oe,Ee,Ke,Ye,_t,U;function _e(){Ze=new h_(D),Ze.init(),Ye=new Vy(D,Ze),Je=new s_(D,Ze,e,Ye),Ae=new By(D,Ze),Je.reverseDepthBuffer&&f&&Ae.buffers.depth.setReversed(!0),et=new f_(D),Ie=new Ty,R=new Hy(D,Ze,Ae,Ie,Je,Ye,et),S=new a_(x),H=new c_(x),se=new vm(D),_t=new n_(D,se),oe=new u_(D,se,et,_t),ee=new m_(D,oe,se,et),Oe=new p_(D,Je,R),ue=new r_(Ie),Le=new Ey(x,S,H,Ze,Je,_t,ue),ye=new qy(x,Ie),Me=new Ry,je=new Uy(Ze),Ne=new t_(x,S,H,Ae,ee,p,c),we=new Fy(x,ee,Je),U=new Zy(D,et,Je,Ae),Ee=new i_(D,Ze,et),Ke=new d_(D,Ze,et),et.programs=Le.programs,x.capabilities=Je,x.extensions=Ze,x.properties=Ie,x.renderLists=Me,x.shadowMap=we,x.state=Ae,x.info=et}_e();let j=new Nc(x,D);this.xr=j,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let E=Ze.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Ze.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(E){E!==void 0&&(J=E,this.setSize(K,ce,!1))},this.getSize=function(E){return E.set(K,ce)},this.setSize=function(E,F,Y=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=E,ce=F,t.width=Math.floor(E*J),t.height=Math.floor(F*J),Y===!0&&(t.style.width=E+"px",t.style.height=F+"px"),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(K*J,ce*J).floor()},this.setDrawingBufferSize=function(E,F,Y){K=E,ce=F,J=Y,t.width=Math.floor(E*Y),t.height=Math.floor(F*Y),this.setViewport(0,0,E,F)},this.getCurrentViewport=function(E){return E.copy(L)},this.getViewport=function(E){return E.copy(B)},this.setViewport=function(E,F,Y,q){E.isVector4?B.set(E.x,E.y,E.z,E.w):B.set(E,F,Y,q),Ae.viewport(L.copy(B).multiplyScalar(J).round())},this.getScissor=function(E){return E.copy(G)},this.setScissor=function(E,F,Y,q){E.isVector4?G.set(E.x,E.y,E.z,E.w):G.set(E,F,Y,q),Ae.scissor(z.copy(G).multiplyScalar(J).round())},this.getScissorTest=function(){return ne},this.setScissorTest=function(E){Ae.setScissorTest(ne=E)},this.setOpaqueSort=function(E){fe=E},this.setTransparentSort=function(E){w=E},this.getClearColor=function(E){return E.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor.apply(Ne,arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha.apply(Ne,arguments)},this.clear=function(E=!0,F=!0,Y=!0){let q=0;if(E){let O=!1;if(C!==null){let de=C.texture.format;O=de===lh||de===oh||de===ah}if(O){let de=C.texture.type,ve=de===Mi||de===us||de===Br||de===Js||de===ih||de===sh,Re=Ne.getClearColor(),Ce=Ne.getClearAlpha(),Be=Re.r,Ge=Re.g,Pe=Re.b;ve?(g[0]=Be,g[1]=Ge,g[2]=Pe,g[3]=Ce,D.clearBufferuiv(D.COLOR,0,g)):(_[0]=Be,_[1]=Ge,_[2]=Pe,_[3]=Ce,D.clearBufferiv(D.COLOR,0,_))}else q|=D.COLOR_BUFFER_BIT}F&&(q|=D.DEPTH_BUFFER_BIT),Y&&(q|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",xe,!1),Me.dispose(),je.dispose(),Ie.dispose(),S.dispose(),H.dispose(),ee.dispose(),_t.dispose(),U.dispose(),Le.dispose(),j.dispose(),j.removeEventListener("sessionstart",su),j.removeEventListener("sessionend",ru),ji.stop()};function re(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function be(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;let E=et.autoReset,F=we.enabled,Y=we.autoUpdate,q=we.needsUpdate,O=we.type;_e(),et.autoReset=E,we.enabled=F,we.autoUpdate=Y,we.needsUpdate=q,we.type=O}function xe(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ve(E){let F=E.target;F.removeEventListener("dispose",Ve),wt(F)}function wt(E){jt(E),Ie.remove(E)}function jt(E){let F=Ie.get(E).programs;F!==void 0&&(F.forEach(function(Y){Le.releaseProgram(Y)}),E.isShaderMaterial&&Le.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,Y,q,O,de){F===null&&(F=pe);let ve=O.isMesh&&O.matrixWorld.determinant()<0,Re=Zf(E,F,Y,q,O);Ae.setMaterial(q,ve);let Ce=Y.index,Be=1;if(q.wireframe===!0){if(Ce=oe.getWireframeAttribute(Y),Ce===void 0)return;Be=2}let Ge=Y.drawRange,Pe=Y.attributes.position,tt=Ge.start*Be,yt=(Ge.start+Ge.count)*Be;de!==null&&(tt=Math.max(tt,de.start*Be),yt=Math.min(yt,(de.start+de.count)*Be)),Ce!==null?(tt=Math.max(tt,0),yt=Math.min(yt,Ce.count)):Pe!=null&&(tt=Math.max(tt,0),yt=Math.min(yt,Pe.count));let vt=yt-tt;if(vt<0||vt===1/0)return;_t.setup(O,q,Re,Y,Ce);let fn,st=Ee;if(Ce!==null&&(fn=se.get(Ce),st=Ke,st.setIndex(fn)),O.isMesh)q.wireframe===!0?(Ae.setLineWidth(q.wireframeLinewidth*nt()),st.setMode(D.LINES)):st.setMode(D.TRIANGLES);else if(O.isLine){let De=q.linewidth;De===void 0&&(De=1),Ae.setLineWidth(De*nt()),O.isLineSegments?st.setMode(D.LINES):O.isLineLoop?st.setMode(D.LINE_LOOP):st.setMode(D.LINE_STRIP)}else O.isPoints?st.setMode(D.POINTS):O.isSprite&&st.setMode(D.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)st.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Ze.get("WEBGL_multi_draw"))st.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let De=O._multiDrawStarts,fi=O._multiDrawCounts,rt=O._multiDrawCount,zn=Ce?se.get(Ce).bytesPerElement:1,Ts=Ie.get(q).currentProgram.getUniforms();for(let Mn=0;Mn<rt;Mn++)Ts.setValue(D,"_gl_DrawID",Mn),st.render(De[Mn]/zn,fi[Mn])}else if(O.isInstancedMesh)st.renderInstances(tt,vt,O.count);else if(Y.isInstancedBufferGeometry){let De=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,fi=Math.min(Y.instanceCount,De);st.renderInstances(tt,vt,fi)}else st.render(tt,vt)};function at(E,F,Y){E.transparent===!0&&E.side===Ct&&E.forceSinglePass===!1?(E.side=tn,E.needsUpdate=!0,ya(E,F,Y),E.side=Wi,E.needsUpdate=!0,ya(E,F,Y),E.side=Ct):ya(E,F,Y)}this.compile=function(E,F,Y=null){Y===null&&(Y=E),d=je.get(Y),d.init(F),v.push(d),Y.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),E!==Y&&E.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),d.setupLights();let q=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let de=O.material;if(de)if(Array.isArray(de))for(let ve=0;ve<de.length;ve++){let Re=de[ve];at(Re,Y,O),q.add(Re)}else at(de,Y,O),q.add(de)}),v.pop(),d=null,q},this.compileAsync=function(E,F,Y=null){let q=this.compile(E,F,Y);return new Promise(O=>{function de(){if(q.forEach(function(ve){Ie.get(ve).currentProgram.isReady()&&q.delete(ve)}),q.size===0){O(E);return}setTimeout(de,10)}Ze.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Bn=null;function di(E){Bn&&Bn(E)}function su(){ji.stop()}function ru(){ji.start()}let ji=new zd;ji.setAnimationLoop(di),typeof self!="undefined"&&ji.setContext(self),this.setAnimationLoop=function(E){Bn=E,j.setAnimationLoop(E),E===null?ji.stop():ji.start()},j.addEventListener("sessionstart",su),j.addEventListener("sessionend",ru),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(F),F=j.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,F,C),d=je.get(E,v.length),d.init(F),v.push(d),W.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),N.setFromProjectionMatrix(W),Z=this.localClippingEnabled,k=ue.init(this.clippingPlanes,Z),m=Me.get(E,y.length),m.init(),y.push(m),j.enabled===!0&&j.isPresenting===!0){let de=x.xr.getDepthSensingMesh();de!==null&&el(de,F,-1/0,x.sortObjects)}el(E,F,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(fe,w),Fe=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,Fe&&Ne.addToRenderList(m,E),this.info.render.frame++,k===!0&&ue.beginShadows();let Y=d.state.shadowsArray;we.render(Y,E,F),k===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=m.opaque,O=m.transmissive;if(d.setupLights(),F.isArrayCamera){let de=F.cameras;if(O.length>0)for(let ve=0,Re=de.length;ve<Re;ve++){let Ce=de[ve];ou(q,O,E,Ce)}Fe&&Ne.render(E);for(let ve=0,Re=de.length;ve<Re;ve++){let Ce=de[ve];au(m,E,Ce,Ce.viewport)}}else O.length>0&&ou(q,O,E,F),Fe&&Ne.render(E),au(m,E,F);C!==null&&(R.updateMultisampleRenderTarget(C),R.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(x,E,F),_t.resetDefaultState(),M=-1,b=null,v.pop(),v.length>0?(d=v[v.length-1],k===!0&&ue.setGlobalState(x.clippingPlanes,d.state.camera)):d=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function el(E,F,Y,q){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)Y=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLight)d.pushLight(E),E.castShadow&&d.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||N.intersectsSprite(E)){q&&te.setFromMatrixPosition(E.matrixWorld).applyMatrix4(W);let ve=ee.update(E),Re=E.material;Re.visible&&m.push(E,ve,Re,Y,te.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||N.intersectsObject(E))){let ve=ee.update(E),Re=E.material;if(q&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),te.copy(E.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),te.copy(ve.boundingSphere.center)),te.applyMatrix4(E.matrixWorld).applyMatrix4(W)),Array.isArray(Re)){let Ce=ve.groups;for(let Be=0,Ge=Ce.length;Be<Ge;Be++){let Pe=Ce[Be],tt=Re[Pe.materialIndex];tt&&tt.visible&&m.push(E,ve,tt,Y,te.z,Pe)}}else Re.visible&&m.push(E,ve,Re,Y,te.z,null)}}let de=E.children;for(let ve=0,Re=de.length;ve<Re;ve++)el(de[ve],F,Y,q)}function au(E,F,Y,q){let O=E.opaque,de=E.transmissive,ve=E.transparent;d.setupLightsView(Y),k===!0&&ue.setGlobalState(x.clippingPlanes,Y),q&&Ae.viewport(L.copy(q)),O.length>0&&_a(O,F,Y),de.length>0&&_a(de,F,Y),ve.length>0&&_a(ve,F,Y),Ae.buffers.depth.setTest(!0),Ae.buffers.depth.setMask(!0),Ae.buffers.color.setMask(!0),Ae.setPolygonOffset(!1)}function ou(E,F,Y,q){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[q.id]===void 0&&(d.state.transmissionRenderTarget[q.id]=new Xn(1,1,{generateMipmaps:!0,type:Ze.has("EXT_color_buffer_half_float")||Ze.has("EXT_color_buffer_float")?$r:Mi,minFilter:hs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace}));let de=d.state.transmissionRenderTarget[q.id],ve=q.viewport||L;de.setSize(ve.z,ve.w);let Re=x.getRenderTarget();x.setRenderTarget(de),x.getClearColor($),ie=x.getClearAlpha(),ie<1&&x.setClearColor(16777215,.5),x.clear(),Fe&&Ne.render(Y);let Ce=x.toneMapping;x.toneMapping=ai;let Be=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),d.setupLightsView(q),k===!0&&ue.setGlobalState(x.clippingPlanes,q),_a(E,Y,q),R.updateMultisampleRenderTarget(de),R.updateRenderTargetMipmap(de),Ze.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let Pe=0,tt=F.length;Pe<tt;Pe++){let yt=F[Pe],vt=yt.object,fn=yt.geometry,st=yt.material,De=yt.group;if(st.side===Ct&&vt.layers.test(q.layers)){let fi=st.side;st.side=tn,st.needsUpdate=!0,lu(vt,Y,q,fn,st,De),st.side=fi,st.needsUpdate=!0,Ge=!0}}Ge===!0&&(R.updateMultisampleRenderTarget(de),R.updateRenderTargetMipmap(de))}x.setRenderTarget(Re),x.setClearColor($,ie),Be!==void 0&&(q.viewport=Be),x.toneMapping=Ce}function _a(E,F,Y){let q=F.isScene===!0?F.overrideMaterial:null;for(let O=0,de=E.length;O<de;O++){let ve=E[O],Re=ve.object,Ce=ve.geometry,Be=q===null?ve.material:q,Ge=ve.group;Re.layers.test(Y.layers)&&lu(Re,F,Y,Ce,Be,Ge)}}function lu(E,F,Y,q,O,de){E.onBeforeRender(x,F,Y,q,O,de),E.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(x,F,Y,q,E,de),O.transparent===!0&&O.side===Ct&&O.forceSinglePass===!1?(O.side=tn,O.needsUpdate=!0,x.renderBufferDirect(Y,F,q,O,E,de),O.side=Wi,O.needsUpdate=!0,x.renderBufferDirect(Y,F,q,O,E,de),O.side=Ct):x.renderBufferDirect(Y,F,q,O,E,de),E.onAfterRender(x,F,Y,q,O,de)}function ya(E,F,Y){F.isScene!==!0&&(F=pe);let q=Ie.get(E),O=d.state.lights,de=d.state.shadowsArray,ve=O.state.version,Re=Le.getParameters(E,O.state,de,F,Y),Ce=Le.getProgramCacheKey(Re),Be=q.programs;q.environment=E.isMeshStandardMaterial?F.environment:null,q.fog=F.fog,q.envMap=(E.isMeshStandardMaterial?H:S).get(E.envMap||q.environment),q.envMapRotation=q.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,Be===void 0&&(E.addEventListener("dispose",Ve),Be=new Map,q.programs=Be);let Ge=Be.get(Ce);if(Ge!==void 0){if(q.currentProgram===Ge&&q.lightsStateVersion===ve)return hu(E,Re),Ge}else Re.uniforms=Le.getUniforms(E),E.onBeforeCompile(Re,x),Ge=Le.acquireProgram(Re,Ce),Be.set(Ce,Ge),q.uniforms=Re.uniforms;let Pe=q.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Pe.clippingPlanes=ue.uniform),hu(E,Re),q.needsLights=Jf(E),q.lightsStateVersion=ve,q.needsLights&&(Pe.ambientLightColor.value=O.state.ambient,Pe.lightProbe.value=O.state.probe,Pe.directionalLights.value=O.state.directional,Pe.directionalLightShadows.value=O.state.directionalShadow,Pe.spotLights.value=O.state.spot,Pe.spotLightShadows.value=O.state.spotShadow,Pe.rectAreaLights.value=O.state.rectArea,Pe.ltc_1.value=O.state.rectAreaLTC1,Pe.ltc_2.value=O.state.rectAreaLTC2,Pe.pointLights.value=O.state.point,Pe.pointLightShadows.value=O.state.pointShadow,Pe.hemisphereLights.value=O.state.hemi,Pe.directionalShadowMap.value=O.state.directionalShadowMap,Pe.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Pe.spotShadowMap.value=O.state.spotShadowMap,Pe.spotLightMatrix.value=O.state.spotLightMatrix,Pe.spotLightMap.value=O.state.spotLightMap,Pe.pointShadowMap.value=O.state.pointShadowMap,Pe.pointShadowMatrix.value=O.state.pointShadowMatrix),q.currentProgram=Ge,q.uniformsList=null,Ge}function cu(E){if(E.uniformsList===null){let F=E.currentProgram.getUniforms();E.uniformsList=Ys.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function hu(E,F){let Y=Ie.get(E);Y.outputColorSpace=F.outputColorSpace,Y.batching=F.batching,Y.batchingColor=F.batchingColor,Y.instancing=F.instancing,Y.instancingColor=F.instancingColor,Y.instancingMorph=F.instancingMorph,Y.skinning=F.skinning,Y.morphTargets=F.morphTargets,Y.morphNormals=F.morphNormals,Y.morphColors=F.morphColors,Y.morphTargetsCount=F.morphTargetsCount,Y.numClippingPlanes=F.numClippingPlanes,Y.numIntersection=F.numClipIntersection,Y.vertexAlphas=F.vertexAlphas,Y.vertexTangents=F.vertexTangents,Y.toneMapping=F.toneMapping}function Zf(E,F,Y,q,O){F.isScene!==!0&&(F=pe),R.resetTextureUnits();let de=F.fog,ve=q.isMeshStandardMaterial?F.environment:null,Re=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:ir,Ce=(q.isMeshStandardMaterial?H:S).get(q.envMap||ve),Be=q.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Ge=!!Y.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Pe=!!Y.morphAttributes.position,tt=!!Y.morphAttributes.normal,yt=!!Y.morphAttributes.color,vt=ai;q.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(vt=x.toneMapping);let fn=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,st=fn!==void 0?fn.length:0,De=Ie.get(q),fi=d.state.lights;if(k===!0&&(Z===!0||E!==b)){let Pn=E===b&&q.id===M;ue.setState(q,E,Pn)}let rt=!1;q.version===De.__version?(De.needsLights&&De.lightsStateVersion!==fi.state.version||De.outputColorSpace!==Re||O.isBatchedMesh&&De.batching===!1||!O.isBatchedMesh&&De.batching===!0||O.isBatchedMesh&&De.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&De.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&De.instancing===!1||!O.isInstancedMesh&&De.instancing===!0||O.isSkinnedMesh&&De.skinning===!1||!O.isSkinnedMesh&&De.skinning===!0||O.isInstancedMesh&&De.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&De.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&De.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&De.instancingMorph===!1&&O.morphTexture!==null||De.envMap!==Ce||q.fog===!0&&De.fog!==de||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==ue.numPlanes||De.numIntersection!==ue.numIntersection)||De.vertexAlphas!==Be||De.vertexTangents!==Ge||De.morphTargets!==Pe||De.morphNormals!==tt||De.morphColors!==yt||De.toneMapping!==vt||De.morphTargetsCount!==st)&&(rt=!0):(rt=!0,De.__version=q.version);let zn=De.currentProgram;rt===!0&&(zn=ya(q,F,O));let Ts=!1,Mn=!1,Mr=!1,bt=zn.getUniforms(),ni=De.uniforms;if(Ae.useProgram(zn.program)&&(Ts=!0,Mn=!0,Mr=!0),q.id!==M&&(M=q.id,Mn=!0),Ts||b!==E){Ae.buffers.depth.getReversed()?(Q.copy(E.projectionMatrix),em(Q),tm(Q),bt.setValue(D,"projectionMatrix",Q)):bt.setValue(D,"projectionMatrix",E.projectionMatrix),bt.setValue(D,"viewMatrix",E.matrixWorldInverse);let Di=bt.map.cameraPosition;Di!==void 0&&Di.setValue(D,ae.setFromMatrixPosition(E.matrixWorld)),Je.logarithmicDepthBuffer&&bt.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&bt.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),b!==E&&(b=E,Mn=!0,Mr=!0)}if(O.isSkinnedMesh){bt.setOptional(D,O,"bindMatrix"),bt.setOptional(D,O,"bindMatrixInverse");let Pn=O.skeleton;Pn&&(Pn.boneTexture===null&&Pn.computeBoneTexture(),bt.setValue(D,"boneTexture",Pn.boneTexture,R))}O.isBatchedMesh&&(bt.setOptional(D,O,"batchingTexture"),bt.setValue(D,"batchingTexture",O._matricesTexture,R),bt.setOptional(D,O,"batchingIdTexture"),bt.setValue(D,"batchingIdTexture",O._indirectTexture,R),bt.setOptional(D,O,"batchingColorTexture"),O._colorsTexture!==null&&bt.setValue(D,"batchingColorTexture",O._colorsTexture,R));let Sr=Y.morphAttributes;if((Sr.position!==void 0||Sr.normal!==void 0||Sr.color!==void 0)&&Oe.update(O,Y,zn),(Mn||De.receiveShadow!==O.receiveShadow)&&(De.receiveShadow=O.receiveShadow,bt.setValue(D,"receiveShadow",O.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(ni.envMap.value=Ce,ni.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&F.environment!==null&&(ni.envMapIntensity.value=F.environmentIntensity),Mn&&(bt.setValue(D,"toneMappingExposure",x.toneMappingExposure),De.needsLights&&$f(ni,Mr),de&&q.fog===!0&&ye.refreshFogUniforms(ni,de),ye.refreshMaterialUniforms(ni,q,J,ce,d.state.transmissionRenderTarget[E.id]),Ys.upload(D,cu(De),ni,R)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Ys.upload(D,cu(De),ni,R),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&bt.setValue(D,"center",O.center),bt.setValue(D,"modelViewMatrix",O.modelViewMatrix),bt.setValue(D,"normalMatrix",O.normalMatrix),bt.setValue(D,"modelMatrix",O.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let Pn=q.uniformsGroups;for(let Di=0,Ui=Pn.length;Di<Ui;Di++){let uu=Pn[Di];U.update(uu,zn),U.bind(uu,zn)}}return zn}function $f(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function Jf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,F,Y){Ie.get(E.texture).__webglTexture=F,Ie.get(E.depthTexture).__webglTexture=Y;let q=Ie.get(E);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=Y===void 0,q.__autoAllocateDepthBuffer||Ze.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,F){let Y=Ie.get(E);Y.__webglFramebuffer=F,Y.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,Y=0){C=E,T=F,A=Y;let q=!0,O=null,de=!1,ve=!1;if(E){let Ce=Ie.get(E);if(Ce.__useDefaultFramebuffer!==void 0)Ae.bindFramebuffer(D.FRAMEBUFFER,null),q=!1;else if(Ce.__webglFramebuffer===void 0)R.setupRenderTarget(E);else if(Ce.__hasExternalTextures)R.rebindTextures(E,Ie.get(E.texture).__webglTexture,Ie.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Pe=E.depthTexture;if(Ce.__boundDepthTexture!==Pe){if(Pe!==null&&Ie.has(Pe)&&(E.width!==Pe.image.width||E.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(E)}}let Be=E.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(ve=!0);let Ge=Ie.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ge[F])?O=Ge[F][Y]:O=Ge[F],de=!0):E.samples>0&&R.useMultisampledRTT(E)===!1?O=Ie.get(E).__webglMultisampledFramebuffer:Array.isArray(Ge)?O=Ge[Y]:O=Ge,L.copy(E.viewport),z.copy(E.scissor),V=E.scissorTest}else L.copy(B).multiplyScalar(J).floor(),z.copy(G).multiplyScalar(J).floor(),V=ne;if(Ae.bindFramebuffer(D.FRAMEBUFFER,O)&&q&&Ae.drawBuffers(E,O),Ae.viewport(L),Ae.scissor(z),Ae.setScissorTest(V),de){let Ce=Ie.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ce.__webglTexture,Y)}else if(ve){let Ce=Ie.get(E.texture),Be=F||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ce.__webglTexture,Y||0,Be)}M=-1},this.readRenderTargetPixels=function(E,F,Y,q,O,de,ve){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=Ie.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ve!==void 0&&(Re=Re[ve]),Re){Ae.bindFramebuffer(D.FRAMEBUFFER,Re);try{let Ce=E.texture,Be=Ce.format,Ge=Ce.type;if(!Je.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Je.textureTypeReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-q&&Y>=0&&Y<=E.height-O&&D.readPixels(F,Y,q,O,Ye.convert(Be),Ye.convert(Ge),de)}finally{let Ce=C!==null?Ie.get(C).__webglFramebuffer:null;Ae.bindFramebuffer(D.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(E,F,Y,q,O,de,ve){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=Ie.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ve!==void 0&&(Re=Re[ve]),Re){let Ce=E.texture,Be=Ce.format,Ge=Ce.type;if(!Je.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Je.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=E.width-q&&Y>=0&&Y<=E.height-O){Ae.bindFramebuffer(D.FRAMEBUFFER,Re);let Pe=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Pe),D.bufferData(D.PIXEL_PACK_BUFFER,de.byteLength,D.STREAM_READ),D.readPixels(F,Y,q,O,Ye.convert(Be),Ye.convert(Ge),0);let tt=C!==null?Ie.get(C).__webglFramebuffer:null;Ae.bindFramebuffer(D.FRAMEBUFFER,tt);let yt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Qp(D,yt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Pe),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,de),D.deleteBuffer(Pe),D.deleteSync(yt),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,F=null,Y=0){E.isTexture!==!0&&(Lr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,E=arguments[1]);let q=Math.pow(2,-Y),O=Math.floor(E.image.width*q),de=Math.floor(E.image.height*q),ve=F!==null?F.x:0,Re=F!==null?F.y:0;R.setTexture2D(E,0),D.copyTexSubImage2D(D.TEXTURE_2D,Y,0,0,ve,Re,O,de),Ae.unbindTexture()},this.copyTextureToTexture=function(E,F,Y=null,q=null,O=0){E.isTexture!==!0&&(Lr("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,E=arguments[1],F=arguments[2],O=arguments[3]||0,Y=null);let de,ve,Re,Ce,Be,Ge,Pe,tt,yt,vt=E.isCompressedTexture?E.mipmaps[O]:E.image;Y!==null?(de=Y.max.x-Y.min.x,ve=Y.max.y-Y.min.y,Re=Y.isBox3?Y.max.z-Y.min.z:1,Ce=Y.min.x,Be=Y.min.y,Ge=Y.isBox3?Y.min.z:0):(de=vt.width,ve=vt.height,Re=vt.depth||1,Ce=0,Be=0,Ge=0),q!==null?(Pe=q.x,tt=q.y,yt=q.z):(Pe=0,tt=0,yt=0);let fn=Ye.convert(F.format),st=Ye.convert(F.type),De;F.isData3DTexture?(R.setTexture3D(F,0),De=D.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(R.setTexture2DArray(F,0),De=D.TEXTURE_2D_ARRAY):(R.setTexture2D(F,0),De=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,F.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,F.unpackAlignment);let fi=D.getParameter(D.UNPACK_ROW_LENGTH),rt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),zn=D.getParameter(D.UNPACK_SKIP_PIXELS),Ts=D.getParameter(D.UNPACK_SKIP_ROWS),Mn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,vt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,vt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ce),D.pixelStorei(D.UNPACK_SKIP_ROWS,Be),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ge);let Mr=E.isDataArrayTexture||E.isData3DTexture,bt=F.isDataArrayTexture||F.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){let ni=Ie.get(E),Sr=Ie.get(F),Pn=Ie.get(ni.__renderTarget),Di=Ie.get(Sr.__renderTarget);Ae.bindFramebuffer(D.READ_FRAMEBUFFER,Pn.__webglFramebuffer),Ae.bindFramebuffer(D.DRAW_FRAMEBUFFER,Di.__webglFramebuffer);for(let Ui=0;Ui<Re;Ui++)Mr&&D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ie.get(E).__webglTexture,O,Ge+Ui),E.isDepthTexture?(bt&&D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ie.get(F).__webglTexture,O,yt+Ui),D.blitFramebuffer(Ce,Be,de,ve,Pe,tt,de,ve,D.DEPTH_BUFFER_BIT,D.NEAREST)):bt?D.copyTexSubImage3D(De,O,Pe,tt,yt+Ui,Ce,Be,de,ve):D.copyTexSubImage2D(De,O,Pe,tt,yt+Ui,Ce,Be,de,ve);Ae.bindFramebuffer(D.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else bt?E.isDataTexture||E.isData3DTexture?D.texSubImage3D(De,O,Pe,tt,yt,de,ve,Re,fn,st,vt.data):F.isCompressedArrayTexture?D.compressedTexSubImage3D(De,O,Pe,tt,yt,de,ve,Re,fn,vt.data):D.texSubImage3D(De,O,Pe,tt,yt,de,ve,Re,fn,st,vt):E.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,O,Pe,tt,de,ve,fn,st,vt.data):E.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,O,Pe,tt,vt.width,vt.height,fn,vt.data):D.texSubImage2D(D.TEXTURE_2D,O,Pe,tt,de,ve,fn,st,vt);D.pixelStorei(D.UNPACK_ROW_LENGTH,fi),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,rt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,zn),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ts),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Mn),O===0&&F.generateMipmaps&&D.generateMipmap(De),Ae.unbindTexture()},this.copyTextureToTexture3D=function(E,F,Y=null,q=null,O=0){return E.isTexture!==!0&&(Lr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Y=arguments[0]||null,q=arguments[1]||null,E=arguments[2],F=arguments[3],O=arguments[4]||0),Lr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,F,Y,q,O)},this.initRenderTarget=function(E){Ie.get(E).__webglFramebuffer===void 0&&R.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?R.setTextureCube(E,0):E.isData3DTexture?R.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?R.setTexture2DArray(E,0):R.setTexture2D(E,0),Ae.unbindTexture()},this.resetState=function(){T=0,A=0,C=null,Ae.reset(),_t.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=Qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Qe._getUnpackColorSpace()}};var er=class extends Zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var kc=class extends pn{constructor(e=null,t=1,i=1,s,r,a,o,c,h=Tn,l=Tn,u,f){super(null,a,o,c,h,l,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Gr=class extends xt{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Hs=new We,dd=new We,za=[],fd=new An,$y=new We,Rr=new ke,Cr=new wi,Wr=class extends ke{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Gr(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,$y)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new An),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Hs),fd.copy(e.boundingBox).applyMatrix4(Hs),this.boundingBox.union(fd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new wi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Hs),Cr.copy(e.boundingSphere).applyMatrix4(Hs),this.boundingSphere.union(Cr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(Rr.geometry=this.geometry,Rr.material=this.material,Rr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Cr.copy(this.boundingSphere),Cr.applyMatrix4(i),e.ray.intersectsSphere(Cr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Hs),dd.multiplyMatrices(i,Hs),Rr.matrixWorld=dd,Rr.raycast(e,za);for(let a=0,o=za.length;a<o;a++){let c=za[a];c.instanceId=r,c.object=this,t.push(c)}za.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Gr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new kc(new Float32Array(s*this.count),s,this.count,rh,ri));let r=this.morphTexture.source.data.data,a=0;for(let h=0;h<i.length;h++)a+=i[h];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Xr=class extends Ei{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ho=new I,uo=new I,pd=new We,Pr=new Xi,Ha=new wi,Cl=new I,md=new I,fo=class extends Zt{constructor(e=new ct,t=new Xr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)ho.fromBufferAttribute(t,s-1),uo.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=ho.distanceTo(uo);e.setAttribute("lineDistance",new $e(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ha.copy(i.boundingSphere),Ha.applyMatrix4(s),Ha.radius+=r,e.ray.intersectsSphere(Ha)===!1)return;pd.copy(s).invert(),Pr.copy(e.ray).applyMatrix4(pd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,l=i.index,f=i.attributes.position;if(l!==null){let p=Math.max(0,a.start),g=Math.min(l.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=h){let d=l.getX(_),y=l.getX(_+1),v=Va(this,e,Pr,c,d,y);v&&t.push(v)}if(this.isLineLoop){let _=l.getX(g-1),m=l.getX(p),d=Va(this,e,Pr,c,_,m);d&&t.push(d)}}else{let p=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=h){let d=Va(this,e,Pr,c,_,_+1);d&&t.push(d)}if(this.isLineLoop){let _=Va(this,e,Pr,c,g-1,p);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Va(n,e,t,i,s,r){let a=n.geometry.attributes.position;if(ho.fromBufferAttribute(a,s),uo.fromBufferAttribute(a,r),t.distanceSqToSegment(ho,uo,Cl,md)>i)return;Cl.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(Cl);if(!(c<e.near||c>e.far))return{distance:c,point:md.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}var Fc=class extends Ei{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},gd=new We,Oc=new Xi,Ga=new wi,Wa=new I,po=class extends Zt{constructor(e=new ct,t=new Fc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ga.copy(i.boundingSphere),Ga.applyMatrix4(s),Ga.radius+=r,e.ray.intersectsSphere(Ga)===!1)return;gd.copy(s).invert(),Oc.copy(e.ray).applyMatrix4(gd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=i.index,u=i.attributes.position;if(h!==null){let f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let g=f,_=p;g<_;g++){let m=h.getX(g);Wa.fromBufferAttribute(u,m),_d(Wa,m,c,s,e,t,this)}}else{let f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let g=f,_=p;g<_;g++)Wa.fromBufferAttribute(u,g),_d(Wa,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function _d(n,e,t,i,s,r,a){let o=Oc.distanceSqToPoint(n);if(o<t){let c=new I;Oc.closestPointToPoint(n,c),c.applyMatrix4(i);let h=s.ray.origin.distanceTo(c);if(h<s.near||h>s.far)return;r.push({distance:h,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var oi=class extends pn{constructor(e,t,i,s,r,a,o,c,h){super(e,t,i,s,r,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}},Bc=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),s=0,r=i.length,a;t?a=t:a=e*i[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);let l=i[s],f=i[s+1]-l,p=(a-l)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Te:new I);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new I,s=[],r=[],a=[],o=new I,c=new We;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let h=Number.MAX_VALUE,l=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);l<=h&&(h=l,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),f<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(It(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(It(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}};function uh(){let n=0,e=0,t=0,i=0;function s(r,a,o,c){n=r,e=o,t=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,l,u){let f=(a-r)/h-(o-r)/(h+l)+(o-a)/l,p=(o-a)/l-(c-a)/(l+u)+(c-o)/u;f*=l,p*=l,s(a,o,f,p)},calc:function(r){let a=r*r,o=a*r;return n+e*r+t*a+i*o}}}var Xa=new I,Pl=new uh,Il=new uh,Ll=new uh,Yi=class extends Bc{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new I){let i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,l;this.closed||o>0?h=s[(o-1)%r]:(Xa.subVectors(s[0],s[1]).add(s[0]),h=Xa);let u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?l=s[(o+2)%r]:(Xa.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=Xa),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(h.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(l),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Pl.initNonuniformCatmullRom(h.x,u.x,f.x,l.x,g,_,m),Il.initNonuniformCatmullRom(h.y,u.y,f.y,l.y,g,_,m),Ll.initNonuniformCatmullRom(h.z,u.z,f.z,l.z,g,_,m)}else this.curveType==="catmullrom"&&(Pl.initCatmullRom(h.x,u.x,f.x,l.x,this.tension),Il.initCatmullRom(h.y,u.y,f.y,l.y,this.tension),Ll.initCatmullRom(h.z,u.z,f.z,l.z,this.tension));return i.set(Pl.calc(c),Il.calc(c),Ll.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};var mo=class n extends ct{constructor(e=[new Te(0,-.5),new Te(.5,0),new Te(0,.5)],t=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:s},t=Math.floor(t),s=It(s,0,Math.PI*2);let r=[],a=[],o=[],c=[],h=[],l=1/t,u=new I,f=new Te,p=new I,g=new I,_=new I,m=0,d=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:m=e[y+1].x-e[y].x,d=e[y+1].y-e[y].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(_.x,_.y,_.z);break;default:m=e[y+1].x-e[y].x,d=e[y+1].y-e[y].y,p.x=d*1,p.y=-m,p.z=d*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),c.push(p.x,p.y,p.z),_.copy(g)}for(let y=0;y<=t;y++){let v=i+y*l*s,x=Math.sin(v),P=Math.cos(v);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*x,u.y=e[T].y,u.z=e[T].x*P,a.push(u.x,u.y,u.z),f.x=y/t,f.y=T/(e.length-1),o.push(f.x,f.y);let A=c[3*T+0]*x,C=c[3*T+1],M=c[3*T+0]*P;h.push(A,C,M)}}for(let y=0;y<t;y++)for(let v=0;v<e.length-1;v++){let x=v+y*e.length,P=x,T=x+e.length,A=x+e.length+1,C=x+1;r.push(P,T,C),r.push(A,C,T)}this.setIndex(r),this.setAttribute("position",new $e(a,3)),this.setAttribute("uv",new $e(o,2)),this.setAttribute("normal",new $e(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.points,e.segments,e.phiStart,e.phiLength)}};var tr=class n extends ct{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],h=new I,l=new Te;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){let p=i+u/t*s;h.x=e*Math.cos(p),h.y=e*Math.sin(p),a.push(h.x,h.y,h.z),o.push(0,0,1),l.x=(a[f]/e+1)/2,l.y=(a[f+1]/e+1)/2,c.push(l.x,l.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new $e(a,3)),this.setAttribute("normal",new $e(o,3)),this.setAttribute("uv",new $e(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.segments,e.thetaStart,e.thetaLength)}},qn=class n extends ct{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let h=this;s=Math.floor(s),r=Math.floor(r);let l=[],u=[],f=[],p=[],g=0,_=[],m=i/2,d=0;y(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute("position",new $e(u,3)),this.setAttribute("normal",new $e(f,3)),this.setAttribute("uv",new $e(p,2));function y(){let x=new I,P=new I,T=0,A=(t-e)/i;for(let C=0;C<=r;C++){let M=[],b=C/r,L=b*(t-e)+e;for(let z=0;z<=s;z++){let V=z/s,$=V*c+o,ie=Math.sin($),K=Math.cos($);P.x=L*ie,P.y=-b*i+m,P.z=L*K,u.push(P.x,P.y,P.z),x.set(ie,A,K).normalize(),f.push(x.x,x.y,x.z),p.push(V,1-b),M.push(g++)}_.push(M)}for(let C=0;C<s;C++)for(let M=0;M<r;M++){let b=_[M][C],L=_[M+1][C],z=_[M+1][C+1],V=_[M][C+1];(e>0||M!==0)&&(l.push(b,L,V),T+=3),(t>0||M!==r-1)&&(l.push(L,z,V),T+=3)}h.addGroup(d,T,0),d+=T}function v(x){let P=g,T=new Te,A=new I,C=0,M=x===!0?e:t,b=x===!0?1:-1;for(let z=1;z<=s;z++)u.push(0,m*b,0),f.push(0,b,0),p.push(.5,.5),g++;let L=g;for(let z=0;z<=s;z++){let $=z/s*c+o,ie=Math.cos($),K=Math.sin($);A.x=M*K,A.y=m*b,A.z=M*ie,u.push(A.x,A.y,A.z),f.push(0,b,0),T.x=ie*.5+.5,T.y=K*.5*b+.5,p.push(T.x,T.y),g++}for(let z=0;z<s;z++){let V=P+z,$=L+z;x===!0?l.push($,$+1,V):l.push($+1,$,V),C+=3}h.addGroup(d,C,x===!0?1:2),d+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ai=class n extends qn{constructor(e=1,t=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},zc=class n extends ct{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],a=[];o(s),h(i),l(),this.setAttribute("position",new $e(r,3)),this.setAttribute("normal",new $e(r.slice(),3)),this.setAttribute("uv",new $e(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){let v=new I,x=new I,P=new I;for(let T=0;T<t.length;T+=3)p(t[T+0],v),p(t[T+1],x),p(t[T+2],P),c(v,x,P,y)}function c(y,v,x,P){let T=P+1,A=[];for(let C=0;C<=T;C++){A[C]=[];let M=y.clone().lerp(x,C/T),b=v.clone().lerp(x,C/T),L=T-C;for(let z=0;z<=L;z++)z===0&&C===T?A[C][z]=M:A[C][z]=M.clone().lerp(b,z/L)}for(let C=0;C<T;C++)for(let M=0;M<2*(T-C)-1;M++){let b=Math.floor(M/2);M%2===0?(f(A[C][b+1]),f(A[C+1][b]),f(A[C][b])):(f(A[C][b+1]),f(A[C+1][b+1]),f(A[C+1][b]))}}function h(y){let v=new I;for(let x=0;x<r.length;x+=3)v.x=r[x+0],v.y=r[x+1],v.z=r[x+2],v.normalize().multiplyScalar(y),r[x+0]=v.x,r[x+1]=v.y,r[x+2]=v.z}function l(){let y=new I;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];let x=m(y)/2/Math.PI+.5,P=d(y)/Math.PI+.5;a.push(x,1-P)}g(),u()}function u(){for(let y=0;y<a.length;y+=6){let v=a[y+0],x=a[y+2],P=a[y+4],T=Math.max(v,x,P),A=Math.min(v,x,P);T>.9&&A<.1&&(v<.2&&(a[y+0]+=1),x<.2&&(a[y+2]+=1),P<.2&&(a[y+4]+=1))}}function f(y){r.push(y.x,y.y,y.z)}function p(y,v){let x=y*3;v.x=e[x+0],v.y=e[x+1],v.z=e[x+2]}function g(){let y=new I,v=new I,x=new I,P=new I,T=new Te,A=new Te,C=new Te;for(let M=0,b=0;M<r.length;M+=9,b+=6){y.set(r[M+0],r[M+1],r[M+2]),v.set(r[M+3],r[M+4],r[M+5]),x.set(r[M+6],r[M+7],r[M+8]),T.set(a[b+0],a[b+1]),A.set(a[b+2],a[b+3]),C.set(a[b+4],a[b+5]),P.copy(y).add(v).add(x).divideScalar(3);let L=m(P);_(T,b+0,y,L),_(A,b+2,v,L),_(C,b+4,x,L)}}function _(y,v,x,P){P<0&&y.x===1&&(a[v]=y.x-1),x.x===0&&x.z===0&&(a[v]=P/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function d(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}};var go=class n extends zc{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var _o=class n extends ct{constructor(e=.5,t=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);let o=[],c=[],h=[],l=[],u=e,f=(t-e)/s,p=new I,g=new Te;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){let d=r+m/i*a;p.x=u*Math.cos(d),p.y=u*Math.sin(d),c.push(p.x,p.y,p.z),h.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,l.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){let m=_*(i+1);for(let d=0;d<i;d++){let y=d+m,v=y,x=y+i+1,P=y+i+2,T=y+1;o.push(v,x,T),o.push(x,P,T)}}this.setIndex(o),this.setAttribute("position",new $e(c,3)),this.setAttribute("normal",new $e(h,3)),this.setAttribute("uv",new $e(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var an=class n extends ct{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(a+o,Math.PI),h=0,l=[],u=new I,f=new I,p=[],g=[],_=[],m=[];for(let d=0;d<=i;d++){let y=[],v=d/i,x=0;d===0&&a===0?x=.5/t:d===i&&c===Math.PI&&(x=-.5/t);for(let P=0;P<=t;P++){let T=P/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+v*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(T+x,1-v),y.push(h++)}l.push(y)}for(let d=0;d<i;d++)for(let y=0;y<t;y++){let v=l[d][y+1],x=l[d][y],P=l[d+1][y],T=l[d+1][y+1];(d!==0||a>0)&&p.push(v,x,T),(d!==i-1||c<Math.PI)&&p.push(x,P,T)}this.setIndex(p),this.setAttribute("position",new $e(g,3)),this.setAttribute("normal",new $e(_,3)),this.setAttribute("uv",new $e(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var gn=class n extends ct{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let a=[],o=[],c=[],h=[],l=new I,u=new I,f=new I;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){let _=g/s*r,m=p/i*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),l.x=e*Math.cos(_),l.y=e*Math.sin(_),f.subVectors(u,l).normalize(),c.push(f.x,f.y,f.z),h.push(g/s),h.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){let _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,d=(s+1)*(p-1)+g,y=(s+1)*p+g;a.push(_,m,y),a.push(m,d,y)}this.setIndex(a),this.setAttribute("position",new $e(o,3)),this.setAttribute("normal",new $e(c,3)),this.setAttribute("uv",new $e(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Ut=class extends Ei{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nd,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function Ya(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Jy(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var nr=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(i=2,r=o);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}a=i,i=0;break t}break n}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Hc=class extends nr{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:mu,endingEnd:mu}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case gu:r=e,o=2*t-i;break;case _u:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(c===void 0)switch(this.getSettings_().endingEnd){case gu:a=e,c=2*i-t;break;case _u:a=1,c=i+s[1]-s[0];break;default:a=e-1,c=t}let h=(i-t)*.5,l=this.valueSize;this._weightPrev=h/(t-o),this._weightNext=h/(c-i),this._offsetPrev=r*l,this._offsetNext=a*l}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,h=c-o,l=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,p=this._weightNext,g=(i-t)/(s-t),_=g*g,m=_*g,d=-f*m+2*f*_-f*g,y=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,v=(-1-p)*m+(1.5+p)*_+.5*g,x=p*m-p*_;for(let P=0;P!==o;++P)r[P]=d*a[l+P]+y*a[h+P]+v*a[c+P]+x*a[u+P];return r}},Vc=class extends nr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,h=c-o,l=(i-t)/(s-t),u=1-l;for(let f=0;f!==o;++f)r[f]=a[h+f]*u+a[c+f]*l;return r}},Gc=class extends nr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Zn=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ya(t,this.TimeBufferType),this.values=Ya(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Ya(e.times,Array),values:Ya(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Gc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Vc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Hc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ja:t=this.InterpolantFactoryMethodDiscrete;break;case xc:t=this.InterpolantFactoryMethodLinear;break;case nl:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ja;case this.InterpolantFactoryMethodLinear:return xc;case this.InterpolantFactoryMethodSmooth:return nl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=i[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&Jy(s))for(let o=0,c=s.length;o!==c;++o){let h=s[o];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,h),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===nl,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,h=e[o],l=e[o+1];if(h!==l&&(o!==1||h!==e[0]))if(s)c=!0;else{let u=o*i,f=u-i,p=u+i;for(let g=0;g!==i;++g){let _=t[u+g];if(_!==t[f+g]||_!==t[p+g]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let u=o*i,f=a*i;for(let p=0;p!==i;++p)t[f+p]=t[u+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,c=a*i,h=0;h!==i;++h)t[c+h]=t[o+h];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Zn.prototype.TimeBufferType=Float32Array;Zn.prototype.ValueBufferType=Float32Array;Zn.prototype.DefaultInterpolation=xc;var ds=class extends Zn{constructor(e,t,i){super(e,t,i)}};ds.prototype.ValueTypeName="bool";ds.prototype.ValueBufferType=Array;ds.prototype.DefaultInterpolation=ja;ds.prototype.InterpolantFactoryMethodLinear=void 0;ds.prototype.InterpolantFactoryMethodSmooth=void 0;var Wc=class extends Zn{};Wc.prototype.ValueTypeName="color";var Xc=class extends Zn{};Xc.prototype.ValueTypeName="number";var Yc=class extends nr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(i-t)/(s-t),h=e*o;for(let l=h+o;h!==l;h+=4)qt.slerpFlat(r,0,a,h-o,a,h,c);return r}},yo=class extends Zn{InterpolantFactoryMethodLinear(e){return new Yc(this.times,this.values,this.getValueSize(),e)}};yo.prototype.ValueTypeName="quaternion";yo.prototype.InterpolantFactoryMethodSmooth=void 0;var fs=class extends Zn{constructor(e,t,i){super(e,t,i)}};fs.prototype.ValueTypeName="string";fs.prototype.ValueBufferType=Array;fs.prototype.DefaultInterpolation=ja;fs.prototype.InterpolantFactoryMethodLinear=void 0;fs.prototype.InterpolantFactoryMethodSmooth=void 0;var qc=class extends Zn{};qc.prototype.ValueTypeName="vector";var Zc=class{constructor(e,t,i){let s=this,r=!1,a=0,o=0,c,h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(l){o++,r===!1&&s.onStart!==void 0&&s.onStart(l,a,o),r=!0},this.itemEnd=function(l){a++,s.onProgress!==void 0&&s.onProgress(l,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(l){s.onError!==void 0&&s.onError(l)},this.resolveURL=function(l){return c?c(l):l},this.setURLModifier=function(l){return c=l,this},this.addHandler=function(l,u){return h.push(l,u),this},this.removeHandler=function(l){let u=h.indexOf(l);return u!==-1&&h.splice(u,2),this},this.getHandler=function(l){for(let u=0,f=h.length;u<f;u+=2){let p=h[u],g=h[u+1];if(p.global&&(p.lastIndex=0),p.test(l))return g}return null}}},Ky=new Zc,$c=class{constructor(e){this.manager=e!==void 0?e:Ky,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};$c.DEFAULT_MATERIAL_NAME="__DEFAULT";var Yr=class extends Zt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ue(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},xo=class extends Yr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Zt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Dl=new We,yd=new I,xd=new I,vo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.map=null,this.mapPass=null,this.matrix=new We,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Vr,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;yd.setFromMatrixPosition(e.matrixWorld),t.position.copy(yd),xd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(xd),t.updateMatrixWorld(),Dl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Dl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var vd=new We,Ir=new I,Ul=new I,Jc=class extends vo{constructor(){super(new Yt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Te(4,2),this._viewportCount=6,this._viewports=[new lt(2,1,1,1),new lt(0,1,1,1),new lt(3,1,1,1),new lt(1,1,1,1),new lt(3,0,1,1),new lt(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Ir.setFromMatrixPosition(e.matrixWorld),i.position.copy(Ir),Ul.copy(i.position),Ul.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Ul),i.updateMatrixWorld(),s.makeTranslation(-Ir.x,-Ir.y,-Ir.z),vd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vd)}},bo=class extends Yr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Jc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Kc=class extends vo{constructor(){super(new oo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},qr=class extends Yr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Zt.DEFAULT_UP),this.updateMatrix(),this.target=new Zt,this.shadow=new Kc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var dh="\\[\\]\\.:\\/",jy=new RegExp("["+dh+"]","g"),fh="[^"+dh+"]",Qy="[^"+dh.replace("\\.","")+"]",ex=/((?:WC+[\/:])*)/.source.replace("WC",fh),tx=/(WCOD+)?/.source.replace("WCOD",Qy),nx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",fh),ix=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",fh),sx=new RegExp("^"+ex+tx+nx+ix+"$"),rx=["material","materials","bones","map"],jc=class{constructor(e,t,i){let s=i||Mt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Mt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(jy,"")}static parseTrackName(e){let t=sx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);rx.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=i(o.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let h=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let l=0;l<e.length;l++)if(e[l].name===h){h=l;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(h!==void 0){if(e[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}let a=e[s];if(a===void 0){let h=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Mt.Composite=jc;Mt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Mt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Mt.prototype.GetterByBindingType=[Mt.prototype._getValue_direct,Mt.prototype._getValue_array,Mt.prototype._getValue_arrayElement,Mt.prototype._getValue_toArray];Mt.prototype.SetterByBindingTypeAndVersioning=[[Mt.prototype._setValue_direct,Mt.prototype._setValue_direct_setNeedsUpdate,Mt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_array,Mt.prototype._setValue_array_setNeedsUpdate,Mt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_arrayElement,Mt.prototype._setValue_arrayElement_setNeedsUpdate,Mt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_fromArray,Mt.prototype._setValue_fromArray_setNeedsUpdate,Mt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Gv=new Float32Array(1);var bd=new We,Mo=class{constructor(e,t,i=0,s=1/0){this.ray=new Xi(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Hr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return bd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(bd),this}intersectObject(e,t=!0,i=[]){return Qc(e,this,i,t),i.sort(Md),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Qc(e[s],this,i,t);return i.sort(Md),i}};function Md(n,e){return n.distance-e.distance}function Qc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let a=0,o=r.length;a<o;a++)Qc(r[a],e,t,!0)}}var Zr=class{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(It(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var So=class extends Si{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");var Xd={type:"change"},mh={type:"start"},qd={type:"end"},Ao=new Xi,Yd=new En,ax=Math.cos(70*Jr.DEG2RAD),Nt=new I,_n=2*Math.PI,ht={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ph=1e-6,Ro=class extends So{constructor(e,t=null){super(e,t),this.state=ht.NONE,this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ps.ROTATE,MIDDLE:ps.DOLLY,RIGHT:ps.PAN},this.touches={ONE:ms.ROTATE,TWO:ms.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new qt,this._lastTargetPosition=new I,this._quat=new qt().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Zr,this._sphericalDelta=new Zr,this._scale=1,this._panOffset=new I,this._rotateStart=new Te,this._rotateEnd=new Te,this._rotateDelta=new Te,this._panStart=new Te,this._panEnd=new Te,this._panDelta=new Te,this._dollyStart=new Te,this._dollyEnd=new Te,this._dollyDelta=new Te,this._dollyDirection=new I,this._mouse=new Te,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=lx.bind(this),this._onPointerDown=ox.bind(this),this._onPointerUp=cx.bind(this),this._onContextMenu=gx.bind(this),this._onMouseWheel=dx.bind(this),this._onKeyDown=fx.bind(this),this._onTouchStart=px.bind(this),this._onTouchMove=mx.bind(this),this._onMouseDown=hx.bind(this),this._onMouseMove=ux.bind(this),this._interceptControlDown=_x.bind(this),this._interceptControlUp=yx.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Xd),this.update(),this.state=ht.NONE}update(e=null){let t=this.object.position;Nt.copy(t).sub(this.target),Nt.applyQuaternion(this._quat),this._spherical.setFromVector3(Nt),this.autoRotate&&this.state===ht.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=_n:i>Math.PI&&(i-=_n),s<-Math.PI?s+=_n:s>Math.PI&&(s-=_n),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Nt.setFromSpherical(this._spherical),Nt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Nt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=Nt.length();a=this._clampDistance(o*this._scale);let c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let o=new I(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let h=new I(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(o),this.object.updateMatrixWorld(),a=Nt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Ao.origin.copy(this.object.position),Ao.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ao.direction))<ax?this.object.lookAt(this.target):(Yd.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ao.intersectPlane(Yd,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ph||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ph||this._lastTargetPosition.distanceToSquared(this.target)>ph?(this.dispatchEvent(Xd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?_n/60*this.autoRotateSpeed*e:_n/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Nt.setFromMatrixColumn(t,0),Nt.multiplyScalar(-e),this._panOffset.add(Nt)}_panUp(e,t){this.screenSpacePanning===!0?Nt.setFromMatrixColumn(t,1):(Nt.setFromMatrixColumn(t,0),Nt.crossVectors(this.object.up,Nt)),Nt.multiplyScalar(e),this._panOffset.add(Nt)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Nt.copy(s).sub(this.target);let r=Nt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(_n*this._rotateDelta.x/t.clientHeight),this._rotateUp(_n*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(_n*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-_n*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(_n*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-_n*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(_n*this._rotateDelta.x/t.clientHeight),this._rotateUp(_n*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Te,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function ox(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function lx(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function cx(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(qd),this.state=ht.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function hx(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ps.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ht.DOLLY;break;case ps.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ht.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ht.ROTATE}break;case ps.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ht.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ht.PAN}break;default:this.state=ht.NONE}this.state!==ht.NONE&&this.dispatchEvent(mh)}function ux(n){switch(this.state){case ht.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ht.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ht.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function dx(n){this.enabled===!1||this.enableZoom===!1||this.state!==ht.NONE||(n.preventDefault(),this.dispatchEvent(mh),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(qd))}function fx(n){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(n)}function px(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ms.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ht.TOUCH_ROTATE;break;case ms.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ht.TOUCH_PAN;break;default:this.state=ht.NONE}break;case 2:switch(this.touches.TWO){case ms.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ht.TOUCH_DOLLY_PAN;break;case ms.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ht.TOUCH_DOLLY_ROTATE;break;default:this.state=ht.NONE}break;default:this.state=ht.NONE}this.state!==ht.NONE&&this.dispatchEvent(mh)}function mx(n){switch(this._trackPointer(n),this.state){case ht.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ht.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ht.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ht.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ht.NONE}}function gx(n){this.enabled!==!1&&n.preventDefault()}function _x(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function yx(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Co=class extends er{constructor(){super();let e=new Yn;e.deleteAttribute("uv");let t=new Ut({side:tn}),i=new Ut,s=new bo(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new ke(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new ke(e,i);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);let o=new ke(e,i);o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),this.add(o);let c=new ke(e,i);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);let h=new ke(e,i);h.position.set(-2.017,.018,6.124),h.rotation.set(0,.333,0),h.scale.set(2.002,4.566,2.064),this.add(h);let l=new ke(e,i);l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),this.add(l);let u=new ke(e,i);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);let f=new ke(e,ar(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);let p=new ke(e,ar(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let g=new ke(e,ar(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);let _=new ke(e,ar(43));_.position.set(-.462,8.89,14.52),_.scale.set(4.38,5.441,.088),this.add(_);let m=new ke(e,ar(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);let d=new ke(e,ar(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function ar(n){let e=new Bt;return e.color.setScalar(n),e}var Po=18,Io=24,xx=`
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
`,vx=`
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
`;function Lo(){let n={uBase:{value:new Ue},uSecond:{value:new Ue},uBellyCol:{value:new Ue},uBellyDir:{value:new I(0,-1,0)},uBelly:{value:.8},uPattern:{value:0},uPatScale:{value:1},uTex:{value:0},uTexScale:{value:22},uPM:{value:Array.from({length:Io},()=>new We)},uBump:{value:1},uFurLen:{value:0},uFurDensity:{value:90},uDroop:{value:.3}},e=s=>{let r=new Ut({roughness:.7,metalness:0});return s>0&&(r.defines={FUR_SHELL:1}),r.onBeforeCompile=a=>{Object.assign(a.uniforms,n,{uShell:{value:s}}),a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
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
          uniform int uPattern, uTex; varying vec3 vWPos; varying vec3 vWNrm; float ccH = 0.0;`+xx).replace("#include <color_fragment>",`#include <color_fragment>
`+vx).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
          #ifndef FUR_SHELL
          { vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
            vec3 r1 = cross(sy, normal), r2 = cross(normal, sx); float det = dot(sx, r1);
            vec3 grad = sign(det) * (dFdx(ccH) * r1 + dFdy(ccH) * r2);
            normal = normalize(abs(det) * normal - grad * uBump); }
          #endif`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
          totalEmissiveRadiance += diffuseColor.rgb * pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0) * 0.4;`)},r},t=s=>new Ut(s);return{U:n,skin:e(0),shells:Array.from({length:Po},(s,r)=>e((r+1)/Po)),accent:t({roughness:.35}),hair:t({roughness:.55}),membrane:t({roughness:.6,side:Ct}),glass:t({roughness:.15,transparent:!0,opacity:.45,side:Ct,depthWrite:!1}),teeth:t({color:16052188,roughness:.3}),mouth:t({color:3804436,roughness:.5}),tongue:t({color:14248572,roughness:.4}),dark:t({color:1775384,roughness:.25}),lip:t({roughness:.35}),cloth:t({roughness:.9,side:Ct}),glint:new Bt({color:16777215}),lash:t({color:1380370,roughness:.6}),eyeCache:new Map}}var bx={skin:0,scales:1,chitin:2,slime:0,fur:0},Mx={skin:.72,scales:.45,chitin:.22,slime:.1,fur:.9};function li(n,e,t){var r,a;let i=n.U;i.uBase.value.set(e.base),i.uSecond.value.set(e.second),i.uBellyCol.value.set(e.belly),i.uBelly.value=e.bellyAmt,i.uPattern.value=e.pattern,i.uPatScale.value=e.patScale,i.uBellyDir.value.set(...t).normalize(),i.uTex.value=(r=bx[e.cover])!=null?r:0,i.uBump.value=e.cover==="slime"?.35:1;let s=e.cover==="fur";i.uFurLen.value=s?.012+e.furLen*.13:0,i.uDroop.value=e.furDroop*1.2,i.uFurDensity.value=330-e.furLen*170;for(let o of[n.skin,...n.shells])o.roughness=(a=Mx[e.cover])!=null?a:.7,o.metalness=e.cover==="chitin"?.25:0;n.accent.color.set(e.accent),n.hair.color.set(e.hair),n.membrane.color.set(e.membrane),n.glass.color.set(e.membrane),n.cloth.color.set(e.cloth||"#6b4a2e"),n.lip.color.set(e.base).lerp(new Ue(12075102),.6)}function Zd(n,e,t,i){let s=e+t+i.toFixed(2);if(n.eyeCache.has(s))return n.eyeCache.get(s);let r=256,a=128,o=document.createElement("canvas");o.width=r,o.height=a;let c=o.getContext("2d"),h=new Ue(t),l={};h.getHSL(l);let u=(g,_,m)=>`hsl(${(g*360).toFixed(0)},${(_*100).toFixed(0)}%,${(Sx(m)*100).toFixed(0)}%)`,f=new Ut({roughness:.06,metalness:0});if(e==="compound"){c.fillStyle=u(l.h,l.s,l.l*.8),c.fillRect(0,0,r,a);for(let g=0;g<22;g++)for(let _=0;_<44;_++){let m=(_+g%2*.5)*(r/44),d=g*(a/22)+3,y=c.createRadialGradient(m-1,d-1,0,m,d,3.4);y.addColorStop(0,u(l.h+.05,l.s,l.l*1.5+.1)),y.addColorStop(1,u(l.h,l.s,l.l*.35)),c.fillStyle=y,c.beginPath(),c.arc(m,d,3.4,0,7),c.fill()}f.roughness=.18,f.metalness=.3}else if(e==="beady")c.fillStyle="#0b0a0d",c.fillRect(0,0,r,a),c.fillStyle=u(l.h,l.s,.12),c.fillRect(0,0,r,a*.3);else{let g=c.createLinearGradient(0,0,0,a);g.addColorStop(0,"#f7f4ee"),g.addColorStop(.45,"#efe6df"),g.addColorStop(.7,"#d9a9a4"),c.fillStyle=g,c.fillRect(0,0,r,a);let _=i*.95/Math.PI*a,m=7,d=()=>(m=m*16807%2147483647,m/2147483647);for(let y=0;y<r;y++){let v=y/r*Math.PI*2+Math.PI,x=.75+d()*.5,P=c.createLinearGradient(0,0,0,_);if(P.addColorStop(0,u(l.h+.03,l.s,l.l*1.5*x+.08)),P.addColorStop(.75,u(l.h,l.s,l.l*x)),P.addColorStop(.93,u(l.h,l.s,l.l*.3)),P.addColorStop(1,"#20140f"),c.fillStyle=P,c.fillRect(y,0,1,_),e!=="glow"){let T=.5,A=.5;e==="cat"?(T=.13,A=.9):e==="goat"&&(T=.85,A=.22);let C=T*A/Math.sqrt((A*Math.cos(v))**2+(T*Math.sin(v))**2);c.fillStyle="#050406",c.fillRect(y,0,1,_*C)}}if(e==="glow"){f.emissive=h.clone(),f.emissiveIntensity=1.3;let y=document.createElement("canvas");y.width=4,y.height=a;let v=y.getContext("2d");v.fillStyle="#000",v.fillRect(0,0,4,a);let x=v.createLinearGradient(0,0,0,_);x.addColorStop(0,"#fff"),x.addColorStop(1,"#333"),v.fillStyle=x,v.fillRect(0,0,4,_),f.emissiveMap=new oi(y)}}let p=new oi(o);if(p.colorSpace=Ot,p.wrapS=Or,p.anisotropy=4,f.map=p,n.eyeCache.set(s,f),n.eyeCache.size>24){let[g,_]=n.eyeCache.entries().next().value;n.eyeCache.delete(g),_.map.dispose(),_.emissiveMap&&_.emissiveMap.dispose(),_.dispose()}return f}var Sx=n=>Math.min(1,Math.max(0,n));function Jd(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,c=new ct,h=0;for(let l=0;l<n.length;++l){let u=n[l],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(u.morphAttributes[p])}if(e){let p;if(t)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,l),h+=p}}if(t){let l=0,u=[];for(let f=0;f<n.length;++f){let p=n[f].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+l);l+=n[f].attributes.position.count}c.setIndex(u)}for(let l in r){let u=$d(r[l]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;c.setAttribute(l,u)}for(let l in a){let u=a[l][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[l]=[];for(let f=0;f<u;++f){let p=[];for(let _=0;_<a[l].length;++_)p.push(a[l][_][f]);let g=$d(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;c.morphAttributes[l].push(g)}}return c}function $d(n){let e,t,i,s=-1,r=0;for(let h=0;h<n.length;++h){let l=n[h];if(e===void 0&&(e=l.array.constructor),e!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=l.itemSize),t!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=l.normalized),i!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=l.gpuType),s!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=l.count*t}let a=new e(r),o=new xt(a,t,i),c=0;for(let h=0;h<n.length;++h){let l=n[h];if(l.isInterleavedBufferAttribute){let u=c/t;for(let f=0,p=l.count;f<p;f++)for(let g=0;g<t;g++){let _=l.getComponent(f,g);o.setComponent(f+u,g,_)}}else a.set(l.array,c);c+=l.count*t}return s!==void 0&&(o.gpuType=s),o}var wx=I,le=(n=0,e=0,t=0)=>new wx(n,e,t),on=(n,e,t)=>Math.min(t,Math.max(e,n)),$t=(n,e,t)=>n+(e-n)*t,Dn=le(1,0,0),Jt=le(0,1,0),or=le(0,0,1);function lr(n){let e=(n|0)+1831565813;return()=>(e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296)}function Ex(n,e,t,i,s){let r=s*s,a=r*s;return .5*(2*e+(t-n)*s+(2*n-5*e+4*t-i)*r+(3*e-n-3*t+i)*a)}function Do(n,e){let t=n.length,i=on(e,0,1)*(t-1),s=Math.min(Math.floor(i),t-2),r=i-s,a=n[Math.max(s-1,0)],o=n[s],c=n[s+1],h=n[Math.min(s+2,t-1)];return on(Ex(a,o,c,h,r),Math.min(o,c)*.9,Math.max(o,c)*1.06)}function ln(n,e={}){var ne,N,k,Z,Q;let t=(ne=e.radial)!=null?ne:14,i=(N=e.sub)!=null?N:6,s=(k=e.capRings)!=null?k:4,r=(Z=e.capStart)!=null?Z:1,a=(Q=e.capEnd)!=null?Q:1,o=n.length,c=new Yi(n.map(W=>W.p),!1,"centripetal"),h=n.map(W=>W.rx),l=n.map(W=>{var ae;return(ae=W.ry)!=null?ae:W.rx}),u=n.map(W=>{var ae;return(ae=W.f)!=null?ae:1}),f=n.map(W=>{var ae;return(ae=W.b)!=null?ae:1}),p=[],g=[],_=(o-1)*i+1,m=[],d=[],y=[],v=[],x=[],P=[],T=null;for(let W=0;W<_;W++){let ae=W/(_-1),te=c.getPoint(ae),pe=c.getTangent(ae).normalize();T||(T=e.side?e.side.clone():Math.abs(pe.x)<.9?Dn.clone():Jt.clone()),T=T.clone().addScaledVector(pe,-T.dot(pe)),T.lengthSq()<1e-8&&(T=Math.abs(pe.y)<.9?Jt.clone().cross(pe):Dn.clone().cross(pe)),T.normalize(),m.push(te),d.push(pe),y.push(T),v.push(pe.clone().cross(T).normalize());let Fe=Do(h,ae),nt=Do(l,ae);if(e.ridges){let D=1+e.ridgeAmp*Math.sin(ae*e.ridges*Math.PI*2);Fe*=D,nt*=D}x.push(Math.max(Fe,1e-4)),P.push(Math.max(nt,1e-4)),p.push(Do(u,ae)),g.push(Do(f,ae))}let A=[],C=(W,ae)=>ae*(x[W]+P[W])*.5;if(r>0)for(let W=s;W>=1;W--){let ae=W/s*Math.PI/2;A.push({c:m[0].clone().addScaledVector(d[0],-C(0,r)*Math.sin(ae)),i:0,s:Math.max(Math.cos(ae),.015),u:-W/s})}for(let W=0;W<_;W++)A.push({c:m[W],i:W,s:1,u:W/(_-1)});if(a>0)for(let W=1;W<=s;W++){let ae=W/s*Math.PI/2;A.push({c:m[_-1].clone().addScaledVector(d[_-1],C(_-1,a)*Math.sin(ae)),i:_-1,s:Math.max(Math.cos(ae),.015),u:1+W/s})}let M=A.length,b=t+1,L=new Float32Array(M*b*3),z=new Float32Array(M*b*3),V=new Float32Array(M*b*2),$=le();for(let W=0;W<M;W++){let ae=A[W],te=ae.i;for(let pe=0;pe<=t;pe++){let Fe=pe/t*Math.PI*2,nt=Math.cos(Fe);$.copy(ae.c).addScaledVector(y[te],x[te]*ae.s*Math.sin(Fe)).addScaledVector(v[te],P[te]*ae.s*nt*(nt<0?p[te]:g[te]));let D=(W*b+pe)*3;L[D]=$.x,L[D+1]=$.y,L[D+2]=$.z,V[(W*b+pe)*2]=ae.u,V[(W*b+pe)*2+1]=pe/t}}let ie=(W,ae,te)=>{let pe=(W*b+ae)*3;return te.set(L[pe],L[pe+1],L[pe+2])},K=le(),ce=le(),J=le(),fe=le(),w=le();for(let W=0;W<M;W++)for(let ae=0;ae<=t;ae++){let te=ae%t;ie(Math.min(W+1,M-1),te,K),ie(Math.max(W-1,0),te,ce),ie(W,(te+1)%t,J),ie(W,(te-1+t)%t,fe),w.copy(K.sub(ce)).cross(J.sub(fe)),w.lengthSq()<1e-16&&w.copy(d[A[W].i]).multiplyScalar(W<M/2?-1:1),w.normalize();let pe=(W*b+ae)*3;z[pe]=w.x,z[pe+1]=w.y,z[pe+2]=w.z}let B=[];for(let W=0;W<M-1;W++)for(let ae=0;ae<t;ae++){let te=W*b+ae,pe=te+b;B.push(te,pe,te+1,te+1,pe,pe+1)}let G=new ct;return G.setAttribute("position",new xt(L,3)),G.setAttribute("normal",new xt(z,3)),G.setAttribute("uv",new xt(V,2)),G.setIndex(B),e.frames&&(G.userData.frames={C:m,T:d,S:y,U:v,RX:x,RY:P,RF:p,RB:g,capS:r,capE:a,m:_}),G.userData.end={p:m[_-1],t:d[_-1],r:(x[_-1]+P[_-1])/2},G}function gs(n,e,t){let i=on(e,0,1),s=i*(n.m-1),r=Math.min(Math.floor(s),n.m-2),a=s-r,o=r+1,c=n.C[r].clone().lerp(n.C[o],a),h=n.S[r].clone().lerp(n.S[o],a).normalize(),l=n.T[r].clone().lerp(n.T[o],a).normalize(),u=l.clone().cross(h).normalize(),f=$t(n.RX[r],n.RX[o],a),g=$t(n.RY[r],n.RY[o],a)*(Math.cos(t)<0?$t(n.RF[r],n.RF[o],a):$t(n.RB[r],n.RB[o],a)),_=1,m=0,d=0;(e<0||e>1)&&(d=e<0?-1:1,m=on(e<0?-e:e-1,0,1)*Math.PI/2,c.addScaledVector(l,d*(d<0?n.capS:n.capE)*(f+g)*.5*Math.sin(m)),_=Math.max(Math.cos(m),.015));let y=Math.sin(t),v=Math.cos(t),x=c.clone().addScaledVector(h,f*_*y).addScaledVector(u,g*_*v),T=h.clone().multiplyScalar(y/f).addScaledVector(u,v/g).normalize().multiplyScalar(Math.cos(m)).addScaledVector(l,d*Math.sin(m)).normalize();return{pos:x,normal:T,tangent:l,center:c,rx:f,ry:g,r:(f+g)/2}}function ut(n,e){return ln(n.map(t=>{var i;return{p:le(t[0],t[1],t[2]),rx:t[3],ry:(i=t[4])!=null?i:t[3]}}),e)}function dt(n,e=1,t=1,i=1,s=0,r=0,a=0,o=14){let c=new an(n,o,Math.max(8,Math.round(o*.7)));return c.scale(e,t,i),c.translate(s,r,a),c}function _s(n,e){let t=n.length,i=[],s=[],r=[];for(let o=0;o<t;o++)i.push(n[o].x,n[o].y,n[o].z,e[o].x,e[o].y,e[o].z),r.push(o/(t-1),0,o/(t-1),1);for(let o=0;o<t-1;o++){let c=o*2;s.push(c,c+1,c+2,c+2,c+1,c+3)}let a=new ct;return a.setAttribute("position",new $e(i,3)),a.setAttribute("uv",new $e(r,2)),a.setIndex(s),a.computeVertexNormals(),a}function Kd(n,e){return n.applyMatrix4(e),n}function ys(n,e,t,i){return n.translate(e,t,i),n}function gh(n,e,t,i){return new We().makeBasis(n,e,t).setPosition(i||le())}function jd(n){let e=n.index.array;for(let t=0;t<e.length;t+=3){let i=e[t];e[t]=e[t+2],e[t+2]=i}}function He(n,e=[]){if(n.length===1)return n[0];let t=n.map(i=>{let s=i.index?i:i.toNonIndexed();for(let r of Object.keys(s.attributes))r!=="position"&&r!=="normal"&&r!=="uv"&&!e.includes(r)&&s.deleteAttribute(r);return s});return Jd(t,!1)}var zt=Math.PI;var cn=(n,e,t,i={})=>ln([{p:n,rx:t},{p:n.clone().lerp(e,.5),rx:t*.62},{p:e,rx:t*.04}],{radial:8,sub:3,capStart:0,capEnd:0,...i}),ci=(n,e)=>{let t=e.clone().addScaledVector(n,-e.dot(n));return t.lengthSq()<1e-6?(Math.abs(n.x)<.9?Dn:Jt).clone().cross(n).normalize():t.normalize()};function Rn(n,e,t,i,s={}){let r=n[n.length-1].clone().sub(n[0]).normalize(),a=r.clone().cross(i);return ln(n.map((o,c)=>({p:o,rx:Math.max(e[c],.004),ry:Math.max(t*(e[c]>.03?1:.4),.003)})),{radial:8,sub:4,side:a.lengthSq()<1e-6?ci(r,Dn):a.normalize(),capStart:.5,capEnd:.5,capRings:2,...s})}function Tx(n){return(e,t)=>{var c,h,l,u,f;let i=[],r=n==="stalk",a=r?1.55:n==="compound"?0:n==="beady"?.05:-.1,o=new an(.5,28,18);if(o.rotateX(zt/2),n==="compound"&&o.scale(.95,1.2,.85),i.push({g:ys(o,0,0,a),m:Zd(t.M,r?"round":n,t.look.eye,(c=e.iris)!=null?c:.75)}),n!=="compound"&&i.push({g:dt(.055,1.5,1,.5,-.14,.17,a+.455,8),m:t.M.glint}),r&&i.push({g:ut([[0,0,-.3,.3],[0,.05,.5,.2],[0,0,1.15,.19],[0,0,1.5,.4]],{capEnd:.6}),m:"skin"}),n!=="compound"){let p=new gn(.5,.06,8,28);p.scale(1,1,1.5),r||i.push({g:ys(p,0,0,-.03),m:"skin"});let g=(h=e.lid)!=null?h:.3;if(g>.02&&n!=="beady"){let _=new an(.535,22,10,0,zt*2,0,.55+g*1.05);_.rotateX(.55),_.rotateZ((l=e.brow)!=null?l:0),i.push({g:ys(_,0,0,a),m:"skin"});let m=new an(.5*1.06,22,8,0,zt*2,0,.42+g*.4);if(m.rotateX(zt-.3),i.push({g:ys(m,0,0,a),m:"skin"}),t.female&&((u=e.lash)!=null?u:1)>.05){let d=.55+g*1.05,y=[];for(let v=0;v<7;v++){let x=-1.05+v*.35,P=le(Math.sin(d)*Math.sin(x),Math.cos(d),Math.sin(d)*Math.cos(x)).applyAxisAngle(Dn,.55).applyAxisAngle(or,(f=e.brow)!=null?f:0),T=P.clone().multiplyScalar(.5*1.06).add(le(0,0,a)),A=T.clone().add(P.clone().add(le(0,.75,.55)).normalize().multiplyScalar(.3*e.lash*(1-Math.abs(x)*.3)));y.push(cn(T,A,.028,{radial:5}))}i.push({g:He(y),m:"lash"})}}}return i}}var Ax={iris:[.4,1.2,.75,"Iris size"],lid:[0,.9,.3,"Eyelid"],brow:[-.7,.7,0,"Sad / angry"],lash:[0,2,1,"Lashes (female)"]};function Qd(n,e,t,i=1){let s=[];for(let r=0;r<n;r++){let a=e(r/(n-1));s.push(cn(a.p,a.p.clone().add(le(0,-i*t*a.s,0)),.035*(.7+a.s*.5),{radial:6}))}return s}function Rx(n){let e=n.len,t=[],i=n.open;t.push({g:ut([[0,.06,-.35,.52,.44],[0,.08,.2*e,.44,.34],[0,.04,.62*e,.34,.24],[0,0,.9*e,.27,.19]],{radial:16}),m:"skin",fur:.3}),t.push({g:dt(.15,1.25,.85,.9,0,.1,.9*e+.2),m:"dark"});let s=ut([[0,-.1,-.3,.44,.22],[0,-.14,.3*e,.34,.15],[0,-.13,.82*e,.21,.1]],{radial:14}),r=n.teeth,a=[s],o=[],c=[];for(let l of[-1,1])o.push(...Qd(6,u=>({p:le(l*$t(.36,.17,u),-.08,$t(.2,.95,u)*e),s:u>.75&&u<.95?2.2:1}),.13*r)),c.push(...Qd(5,u=>({p:le(l*$t(.3,.14,u),-.05,$t(.25,.82,u)*e),s:u>.7?1.6:.8}),.1*r,-1));let h=l=>(l.translate(0,.1,.3),l.rotateX(i*.75),l.translate(0,-.1,-.3),l);return t.push({g:h(s),m:"skin",fur:.3}),r>.05&&(t.push({g:He(o),m:"teeth"}),t.push({g:h(He(c)),m:"teeth"})),t.push({g:dt(.5,.62,.16+i*.25,.9*e,0,-.1-i*.1,.4*e),m:"mouth"}),i>.25&&t.push({g:h(dt(.5,.36,.07,.7*e,0,-.03,.42*e)),m:"tongue"}),t}function Cx(n){let e=n.len,t=n.hook,i=[];i.push({g:ut([[0,.05,-.3,.44,.38],[0,.07,.3*e,.33,.27],[0,.03-t*.05,.72*e,.17,.15],[0,-t*.4,1*e,.015]],{radial:12,capEnd:.3}),m:"accent"});let s=ut([[0,-.16,-.3,.38,.2],[0,-.17,.35*e,.24,.11],[0,-.14,.8*e,.02]],{radial:12,capEnd:.3});return s.translate(0,.1,.2),s.rotateX(n.open*.6),s.translate(0,-.1,-.2),i.push({g:s,m:"accent"}),i.push({g:He([dt(.035,1,1,1.6,.14,.2,.3*e),dt(.035,1,1,1.6,-.14,.2,.3*e)]),m:"dark"}),n.open>.2&&i.push({g:dt(.5,.4,.12,.6*e,0,-.08,.3*e),m:"mouth"}),i}function Px(n){let e=[],t=[],i=n.open;for(let s of[-1,1])e.push(ut([[s*.28,0,-.15,.17],[s*(.5+i*.25),-.05,.4,.14],[s*(.36+i*.3),-.1,.85*n.len,.08],[s*(.08+i*.3),-.12,1.1*n.len,.01]],{radial:10,ridges:0})),t.push(ut([[s*.12,-.2,-.1,.07],[s*.15,-.35,.3,.05],[s*.1,-.5,.45,.02]],{radial:8}));return[{g:He(e),m:"accent"},{g:He(t),m:"skin"},{g:dt(.3,1,.8,.5,0,-.08,.02),m:"mouth"}]}function Ix(n){let e=new gn(.42,.15,10,28);e.translate(0,0,.05);let t=[],i=Math.round(n.count);for(let s=0;s<2;s++)for(let r=0;r<i;r++){let a=(r+s*.5)/i*zt*2,o=.36-s*.1,c=le(Math.cos(a)*o,Math.sin(a)*o,.1-s*.08);t.push(cn(c,c.clone().add(le(-Math.cos(a)*.14,-Math.sin(a)*.14,.16).multiplyScalar(n.teeth)),.045,{radial:6}))}return[{g:e,m:"skin"},{g:dt(.4,1,1,.35,0,0,-.02),m:"mouth"},{g:He(t),m:"teeth"}]}function Lx(n){let e=(i,s,r)=>{let a=[];for(let o=0;o<=6;o++){let c=o/6-.5,h=1-Math.abs(c)*2;a.push([c,i+n.smile*.22*(c*c*4)+r*.03*h,.04-c*c*.45,.012+.075*s*Math.pow(h,.6),.012+.06*s*Math.pow(h,.6)])}return ut(a,{radial:10,sub:3,side:le(0,1,0)})},t=ut([[-.48,n.smile*.2,-.06,.012],[0,0,.065,.02],[.48,n.smile*.2,-.06,.012]],{radial:6});return[{g:He([e(.045,n.full*.85,1),e(-.05,n.full,-1)]),m:"lip"},{g:t,m:"mouth"}]}function Dx(n){let e=n.curl;return[{g:ut([[0,0,-.3,.4],[0,-.05,.45,.34],[0,-.55,.95,.27],[0,-1.25*n.len,1.1,.21],[0,-1.9*n.len,1+e*.2,.17],[0,-2.3*n.len,1+e*.9,.14]],{radial:14,sub:8,ridges:26,ridgeAmp:.04}),m:"skin"}]}function Ux(n,e){let t=[],i=Math.round(n.count);for(let s=0;s<i;s++){let r=(s-(i-1)/2)*(.7/i),a=.1*Math.sin(s*2.4),o=e.down,c=le(r,0,-.15),h=le(r*1.2,0,.3),l=h.clone().addScaledVector(o,.5*n.len).add(le(0,0,.1)),u=l.clone().addScaledVector(o,.6*n.len).add(le(r*.5+a,0,-.1+a));t.push(ln([{p:c,rx:.12},{p:h,rx:.1},{p:l,rx:.07},{p:u,rx:.02}],{radial:8}))}return[{g:He(t),m:"skin"},{g:dt(.25,1.2,.7,.4,0,-.05,0),m:"mouth"}]}function Nx(n,e){let t=[];for(let i=0;i<=4;i++){let s=i/4-.5;t.push(le(s,n.arch*.22*(1-s*s*4)+s*-.1,.04-s*s*.25))}return[{g:Rn(t,[.03,.09*n.thick,.1*n.thick,.08*n.thick,.02],.045,le(0,0,1),{radial:6,sub:3}),m:"hair"}]}function kx(n,e){let s=on(e.part.u-n.span/2,-.97,1.97),r=on(e.part.u+n.span/2,-.97,1.97),a=e.size*.3,o=[],c=[],h=[];for(let u=0;u<=22;u++)for(let f=0;f<=40;f++){let p=gs(e.frames,$t(s,r,u/22),f/40*zt*2),g=Math.min(u,22-u)===0?.35:1,_=p.pos.addScaledVector(p.normal,a*g);o.push(_.x,_.y,_.z),c.push(p.normal.x,p.normal.y,p.normal.z)}for(let u=0;u<22;u++)for(let f=0;f<40;f++){let p=u*41+f,g=p+40+1;h.push(p,g,p+1,p+1,g,g+1)}let l=new ct;return l.setAttribute("position",new $e(o,3)),l.setAttribute("normal",new $e(c,3)),l.setAttribute("uv",new $e(new Float32Array(o.length/3*2),2)),l.setIndex(h),[{g:l,m:"cloth"}]}function Fx(n){return[{g:He([ut([[0,.5*n.len,-.1,.09,.08],[0,.2,.1*n.len+.05,.12,.11],[0,-.06,.3*n.len,.17,.14]],{radial:10}),dt(.12,1,.8,1,.15*n.wide,-.1,.1*n.len),dt(.12,1,.8,1,-.15*n.wide,-.1,.1*n.len)]),m:"skin"}]}function Kr(n){return(e,t)=>{let i=t.up,s=t.down,r={point:[[le(0,0,-.15),.34],[le(0,.04,.3),.37],[le(0,.07,.72),.22],[le(0,.09,1.08),.02]],round:[[le(0,0,-.12),.3],[le(0,0,.3),.5],[le(0,0,.62),.44],[le(0,0,.8),.2]],long:[[le(0,0,-.15),.2],[le(0,.03,.6),.27],[le(0,.04,1.45),.24],[le(0,0,2.1),.03]],elf:[[le(0,0,-.12),.17],[le(0,0,.2).addScaledVector(i,.12),.3],[le(0,0,.42).addScaledVector(i,.45),.2],[le(0,0,.62).addScaledVector(i,.95*e.len),.02]],floppy:[[le(0,0,-.12),.3],[le(0,0,.3),.38],[le(0,0,.5).addScaledVector(s,.5*e.len),.42],[le(0,0,.46).addScaledVector(s,1.1*e.len),.32],[le(0,0,.42).addScaledVector(s,1.45*e.len),.06]]}[n],a=n==="floppy"||n==="elf"?1:e.len,o=r.map(u=>le(u[0].x,u[0].y,u[0].z*(u[0].z>0?a:1))),c=r.map(u=>u[1]*e.wide),h=n==="floppy"?le(0,0,1):t.fwd,l=Rn(o.map((u,f)=>u.clone().addScaledVector(h,.045).multiplyScalar(f?.9:1)),c.map(u=>u*.62),.03,h);return[{g:Rn(o,c,.07,h,{radial:10}),m:"skin",fur:.3},{g:l,m:"membrane"}]}}function Ox(n,e){let t=[],i=[],s=[];for(let r=0;r<5;r++){let a=-.6+r*.42,o=le(0,0,1).multiplyScalar(Math.cos(a)).addScaledVector(e.up,Math.sin(a)),c=o.clone().multiplyScalar(n.len*(.8+.35*Math.sin((r+.5)/5*zt)));t.push(c),i.push(o.clone().multiplyScalar(.05)),s.push(cn(le(0,0,-.1),c,.045,{radial:6}))}return[{g:He(s),m:"accent"},{g:_s(i,t.map(r=>r.clone().multiplyScalar(.93))),m:"membrane"}]}function cr(n){return e=>{var c,h;let t=e.len,i=(c=e.curve)!=null?c:1,s={radial:12,sub:7,ridges:n==="spike"?0:9*t,ridgeAmp:.05,capEnd:.3};if(n==="spike")return[{g:ut([[0,0,-.15,.3],[0,.02*i,.5*t,.2],[0,.1*i,1.25*t,.01]],s),m:"accent"}];if(n==="curved")return[{g:ut([[0,0,-.15,.3],[0,.05*i,.42*t,.26],[0,.32*i,.88*t,.18],[0,.78*i,1.12*t,.09],[0,1.2*i,1.05*t,.01]],s),m:"accent"}];if(n==="ram"){let l=[];for(let u=0;u<=12;u++){let f=u/12,p=f*zt*1.75*i,g=.62*t*(1-f*.45);l.push([.12+f*.75,g*Math.sin(p)*.9,-.15+g*(1-Math.cos(p)),.32*(1-f*.95)+.01])}return[{g:ut(l,{...s,sub:4,ridges:22}),m:"accent"}]}if(n==="tusk")return[{g:ut([[0,0,-.25,.2],[0,-.3*i,.3*t,.17],[0,-.38*i,.8*t,.12],[0,-.05,1.3*t,.01]],{...s,ridges:0}),m:"teeth"}];let r=[[0,0,-.15,.14],[.05,.2,.6,.115],[.12,.5,1.2,.095],[.15,.62,1.9,.065],[.1,.5,2.5,.012]].map(l=>[l[0],l[1]*i,l[2]*t,l[3]]),a=[ut(r,{radial:8,sub:5})],o=Math.round((h=e.tines)!=null?h:3);for(let l=0;l<o;l++){let u=(l+.6)/(o+.4),f=u*4,p=Math.min(Math.floor(f),3),g=f-p,_=le($t(r[p][0],r[p+1][0],g),$t(r[p][1],r[p+1][1],g),$t(r[p][2],r[p+1][2],g)),m=l%2?1:-1,d=.7*(1-u*.4);a.push(ln([{p:_,rx:.08},{p:_.clone().add(le(m*.2*d,-.35*d,.3*d)),rx:.065},{p:_.clone().add(le(m*.3*d,-.5*d,.9*d)),rx:.012}],{radial:7,sub:4,capStart:0}))}return[{g:He(a),m:"accent"}]}}function ef(n){return e=>{let t=e.len,i=e.curve,s=[[0,0,-.08,.055],[0,.1*i,.6*t,.045],[0,.5*i,1.2*t,.035],[0,1.05*i,1.5*t,.028]],r=[ut(s,{radial:7,sub:6})];if(!n)return[{g:r[0],m:"accent"},{g:dt(.09,1,1,1,0,1.05*i,1.5*t),m:"accent"}];let a=new Yi(s.map(o=>le(o[0],o[1],o[2])));for(let o=2;o<16;o++){let c=a.getPoint(o/16),h=.3*Math.sin(o/16*zt)+.05;for(let l of[-1,1])r.push(cn(c,c.clone().add(le(l*h,.05,h*.3)),.016,{radial:4}))}return[{g:He(r),m:"hair"}]}}function jr(n){return(e,t)=>{var l,u,f,p,g,_;let i=[],s=Math.round((l=e.count)!=null?l:n.count),r=(u=e.droop)!=null?u:n.droop,a=(f=e.len)!=null?f:1,o=(p=e.spread)!=null?p:n.spread,c=(g=n.capR)!=null?g:.5,h=le(0,0,-c-.02);for(let m=0;m<s;m++){let d=o*Math.sqrt((m+.5)/s),y=m*2.39996+t.rnd()*.3,v=le(Math.sin(d)*Math.cos(y),Math.sin(d)*Math.sin(y),Math.cos(d)),x=a*(.75+.5*t.rnd()),P=n.width*(.8+.4*t.rnd()),T=x/4,A=[h.clone().addScaledVector(v,c)],C=v.clone(),M=A[0].clone();for(let L=1;L<=4;L++){C.multiplyScalar(1-r*.5).addScaledVector(t.down,r*.3*L).normalize(),M=M.clone().addScaledVector(C,T);let z=M.clone().sub(h);n.hug&&z.length()<c*1.05&&(M=h.clone().add(z.setLength(c*1.05))),A.push(M)}let b=n.hug?A[2].clone().sub(h).normalize():ci(v,t.fwd.clone().add(le(t.rnd()-.5,t.rnd()-.5,0)));i.push(Rn(A,[P*.75,P,P*.95,P*.65,.012],P*.2,b,{radial:6,sub:3}))}if(n.hug){let m=new an(c*1.03,24,12,0,zt*2,0,Math.min(o*.82,zt*.6));m.rotateX(zt/2),m.translate(h.x,h.y,h.z),i.push(m)}return[{g:He(i),m:(_=n.mat)!=null?_:"hair"}]}}function Bx(n,e){let t=[];for(let i=0;i<4;i++){let s=-.45+i*.3,a=le(0,0,1).multiplyScalar(.35).addScaledVector(e.up,Math.sin(s)*.6).addScaledVector(e.fwd,-.15).add(le(0,0,.6)).normalize().clone().multiplyScalar(n.len*1.6);t.push(ln([{p:le(0,(i-1.5)*.1,0),rx:.016},{p:a.clone().multiplyScalar(.5).addScaledVector(e.down,-.05),rx:.012},{p:a.addScaledVector(e.down,.12*n.len),rx:.004}],{radial:4,sub:4}))}return[{g:He(t),m:"teeth"}]}function zx(n){let e=new gn(.5,.06,6,28);e.scale(1,n.long,1);let t=[];for(let i=0;i<7;i++){let s=i/6*zt*2,r=i===6?0:.27;t.push(dt(.17,1,1,.35,Math.cos(s)*r,Math.sin(s)*r*n.long,.5*n.dome*(i===6?.98:.8)))}return[{g:He([dt(.5,1,n.long,n.dome,0,0,0,22),e]),m:"accent"},{g:He(t),m:"skin"}]}function Hx(n,e){let t=e.fwd.clone().multiplyScalar(-1),i=le(0,0,1),s=(r,a)=>i.clone().multiplyScalar(r).addScaledVector(t,a);return[{g:Rn([s(-.12,0),s(.4*n.len,.15*n.sweep),s(.8*n.len,.5*n.sweep),s(1.1*n.len,.95*n.sweep)],[.5,.42,.25,.02],.06,ci(i,t.clone().cross(i)),{radial:10}),m:"skin"}]}function Vx(n,e){let t=e.fwd.clone().multiplyScalar(-1),i=le(0,0,1),s=e.down,r=(a,o,c)=>i.clone().multiplyScalar(a).addScaledVector(t,o).addScaledVector(s,c);return[{g:Rn([r(-.12,0,0),r(.4*n.len,.15*n.sweep,.08),r(.9*n.len,.5*n.sweep,.2),r(1.25*n.len,.95*n.sweep,.3)],[.3,.38,.27,.02],.05,e.up,{radial:10}),m:"skin"}]}var No={human(){let n=[];for(let e=0;e<5;e++)n.push(dt(.3-e*.03,1,.8,1.3,-.62+e*.33,-.95,2.55-e*.14));return[{g:He([dt(.95,.95,.85,1.05,0,-.45,-.25),ut([[0,-.4,-.2,.8,.6],[0,-.65,1.1,.9,.5],[0,-.85,2.3,.95,.3]],{radial:10}),...n]),m:"skin"}]},paw(){let n=[dt(1,1.15,.8,1.35,0,-.55,.45)],e=[];for(let t=0;t<4;t++){let i=-.75+t*.5,s=1.55-Math.abs(t-1.5)*.18;n.push(dt(.42,1,.9,1.3,i,-.75,s)),e.push(cn(le(i,-.6,s+.35),le(i*1.08,-1.05,s+.95),.14,{radial:6}))}return[{g:He(n),m:"skin",fur:.35},{g:He(e),m:"accent"}]},hoof(){return[{g:ut([[0,.1,0,.95],[0,-.6,.15,1.2,1.25],[0,-1.15,.3,1.4,1.5]],{radial:12,capEnd:.12,capStart:0}),m:"accent"}]},talon(n){let e=[],t=[];for(let[s,r,a]of[[-1.25,1.7,1],[0,2.3,1.1],[1.25,1.7,1],[0,-1.4,.7]]){e.push(ut([[0,-.1,0,.55],[s*.5,-.75,r*.5,.45],[s,-1,r,.32]],{radial:8,ridges:5,ridgeAmp:.08}));let o=le(s,0,r).normalize();t.push(cn(le(s,-.95,r),le(s,-1.25,r).addScaledVector(o,.75*a),.26,{radial:6}))}let i=[{g:He(e),m:"skin"},{g:He(t),m:"accent"}];return n&&i.push({g:_s([le(0,-.6,.2),le(0,-.6,.2),le(0,-.6,.2),le(0,-.6,.2),le(0,-.6,.2)],[le(-1.45,-1.05,1.95),le(-.75,-1.05,1.8),le(0,-1.05,2.6),le(.75,-1.05,1.8),le(1.45,-1.05,1.95)]),m:"membrane"}),i},webbed(){return No.talon(!0)},stump(){let n=[];for(let e=0;e<4;e++){let t=-.9+e*.6;n.push(dt(.3,1,.8,.6,Math.sin(t)*1.3,-.95,Math.cos(t)*1.3+.1))}return[{g:ut([[0,.2,0,1],[0,-.6,.05,1.2],[0,-1.15,.1,1.38]],{radial:12,capEnd:.1,capStart:0}),m:"skin"},{g:He(n),m:"accent"}]},point(){return[{g:cn(le(0,.2,0),le(.3,-1.9,.2),.95,{capStart:0}),m:"accent"}]},none(){return[]}},tf={human(){let n=[dt(1,1.2,1.3,.6,0,1,0)];return[-.82,-.28,.27,.8].forEach((e,t)=>{let i=[.85,1,1.05,.95][t];n.push(ut([[e,1.8,0,.3],[e*1.1,1.8+1.1*i,.1,.27],[e*1.15,1.8+1.9*i,.4,.24],[e*1.15,1.8+2.4*i,.8,.2]],{radial:7,sub:4,ridges:3,ridgeAmp:.06}))}),n.push(ut([[.7,.6,.2,.36],[1.5,1.3,.5,.3],[1.9,2.1,.75,.24]],{radial:7,sub:4})),[{g:He(n),m:"skin"}]},claw(){let n=[dt(1,1.2,1.2,.75,0,.9,0)],e=[];for(let t of[-.85,0,.85])n.push(ut([[t,1.5,0,.42],[t*1.3,2.6,.2,.38],[t*1.4,3.3,.7,.3]],{radial:7,sub:4,ridges:2,ridgeAmp:.08})),e.push(cn(le(t*1.4,3.25,.65),le(t*1.45,3.9,1.6),.27,{radial:6}));return n.push(ut([[.9,.5,.2,.4],[1.7,1.2,.6,.3]],{radial:7})),e.push(cn(le(1.7,1.2,.6),le(2,1.7,1.3),.26,{radial:6})),[{g:He(n),m:"skin"},{g:He(e),m:"accent"}]},pincer(){return[{g:He([dt(1,1.7,2.1,1.25,0,1.6,0),ut([[-.7,3,0,.8,.6],[-1.1,4.4,0,.6,.45],[-.75,5.5,0,.3],[-.1,6.1,0,.03]],{radial:9,capStart:0}),ut([[.8,2.9,0,.6,.5],[1.1,4.1,0,.42],[.75,5.1,0,.22],[.2,5.7,0,.03]],{radial:9,capStart:0})]),m:"skin"}]},mitt(){return[{g:dt(1,1.25,1.5,.9,0,1.1,0),m:"skin",fur:!0}]},none(){return[]}},Gx={plant:{pts:[[0,0,0],[.02,-.14,.02],[.035,-.3,.035],[.04,-.48,.045],[.038,-.63,0],[.032,-.8,-.012],[.03,-.97,-.012]],r:[1.02,1.1,.98,.72,.86,.6,.46],bulge:[1,2,4]},digi:{pts:[[0,0,0],[.03,-.2,.1],[.05,-.42,.16],[.04,-.62,-.02],[.03,-.8,-.12],[.03,-.97,-.03]],r:[1.1,1.2,.8,.62,.42,.4],bulge:[1]},pillar:{pts:[[0,0,0],[.01,-.3,.01],[.02,-.6,.02],[.02,-.9,0]],r:[1.15,1.1,.95,.95],bulge:[1]},arm:{pts:[[0,0,0],[.045,-.1,-.005],[.06,-.26,-.012],[.075,-.46,-.028],[.082,-.59,.008],[.086,-.78,.058],[.088,-.93,.1]],r:[1,1.14,.98,.72,.84,.6,.5],bulge:[1,2,4]},insect:{pts:[[0,0,0],[.28,.2,0],[.5,.32,0],[.72,-.15,.02],[.88,-.65,.03],[.93,-.95,.03]],r:[.75,.62,.5,.42,.3,.16],bulge:[]}};function xh(n,e,t){return(i,s)=>{var P;let r=s.size,a=Gx[n],o=r*.105*i.thick*s.limbMul,c=Math.cos(i.splay),h=Math.sin(i.splay),l=Math.cos(i.swing),u=Math.sin(i.swing),p=a.pts.map(([T,A,C])=>{C*=i.bend,n==="insect"&&(A=A>0?A*i.bend:A);let M=T*c-A*h,b=T*h+A*c,L=b*l+C*u,z=-b*u+C*l;return s.root.clone().addScaledVector(s.out,M*r).addScaledVector(Jt,L*r).addScaledVector(s.fwd,z*r)}).map((T,A)=>({p:T,rx:a.r[A]*o*(a.bulge.includes(A)?i.muscle:1)})),g=n==="insect",_=ln(p,{radial:16,sub:7,ridges:g?5:0,ridgeAmp:.1}),m=[{g:_,m:"skin",fur:g?.5:.75}],d=_.userData.end,y=d.r*i.end,v=(P=i.endType)!=null?P:t;s.anchors&&e===tf&&s.anchors.push({p:d.p.clone(),t:d.t.clone(),r:d.r*i.end});let x;if(e===No)x=gh(s.out.clone().multiplyScalar(y),Jt.clone().multiplyScalar(y),s.fwd.clone().multiplyScalar(y),d.p);else{let T=d.t.clone(),A=ci(T,s.fwd),C=T.clone().cross(A);x=gh(C.multiplyScalar(y),T.multiplyScalar(y),A.multiplyScalar(y),d.p.clone().addScaledVector(d.t,-d.r*.4))}for(let T of e[v]())m.push({g:Kd(T.g,x),m:T.m,fur:T.fur||0});return m}}function Wx(n,e){let t=e.size,i=[],s=n.curl,r=t*.085*n.thick*e.limbMul;for(let c=0;c<=9;c++){let h=c/9,l=.5*Math.pow(h,.8)+s*.16*Math.sin(h*5+e.seed)*h,u=-.8*Math.pow(h,1.25)+s*.22*h*h*Math.sin(h*6.5),f=.14*Math.sin(h*7+e.seed*2)*h*s,p=Math.cos(n.splay),g=Math.sin(n.splay);i.push({p:e.root.clone().addScaledVector(e.out,(l*p-u*g)*t).addScaledVector(Jt,(l*g+u*p)*t).addScaledVector(e.fwd,f*t),rx:r*(Math.pow(1-h,.75)*.94+.06)})}let a=ln(i,{radial:12,sub:5}),o=[{g:a,m:"skin"}];if(e.anchors&&e.anchors.push({p:a.userData.end.p.clone(),t:a.userData.end.t.clone(),r:r*.5}),n.suckers>.5){let c=new Yi(i.map(l=>l.p)),h=[];for(let l=3;l<22;l++){let u=l/22,f=c.getPoint(u),p=c.getTangent(u),g=r*(Math.pow(1-u,.75)*.94+.06),_=ci(p,e.out.clone().multiplyScalar(-1).add(le(0,-.6,0))),m=dt(g*.36,1,1,1,0,0,0,8);m.translate(f.x+_.x*g*.85,f.y+_.y*g*.85,f.z+_.z*g*.85),h.push(m)}o.push({g:He(h),m:"membrane"})}return o}function _h(n){return(e,t)=>{let i=t.size,s=Math.cos(e.lift),r=Math.sin(e.lift),a=Math.cos(e.sweep),o=Math.sin(e.sweep),c=(l,u,f)=>{let p=l*s-u*r,g=l*r+u*s,_=p*a+f*o,m=-p*o+f*a;return t.root.clone().addScaledVector(t.out,_*i).addScaledVector(Jt,g*i).addScaledVector(t.fwd,m*i)},h=[];if(n==="bat"){let l=c(0,0,0),u=c(.33,.22,0),f=c(.6,.45,.06),p=[c(1.45,.5,-.1),c(1.25,-.02,-.38),c(.92,-.36,-.52),c(.55,-.45,-.55),c(.02,-.3,-.3)],g=[ln([{p:l,rx:i*.05},{p:u,rx:i*.036},{p:f,rx:i*.028}],{radial:8})],_=[];p.forEach((m,d)=>{if(d<4&&g.push(ln([{p:f,rx:i*.018},{p:f.clone().lerp(m,.5).addScaledVector(Jt,i*.03),rx:i*.013},{p:m,rx:i*.004}],{radial:6,capStart:0})),d>0){let y=[],v=[],x=d<4?f:u;for(let P=0;P<=8;P++){let T=P/8,A=p[d-1].clone().lerp(m,T);A.lerp(x,.2*Math.sin(T*zt)),y.push(x),v.push(A)}_.push(_s(y,v))}}),_.push(_s([l,l,l],[u,p[4].clone().lerp(u,.5),p[4]])),_.push(_s([f,f],[u,p[4]])),g.push(cn(f,c(.62,.62,.16),i*.02,{radial:5})),h.push({g:He(g),m:"skin"},{g:He(_),m:"membrane"})}else if(n==="feather"){let l=[c(0,0,0),c(.3,.16,.02),c(.62,.26,.06),c(.9,.2,.02)];h.push({g:ln(l.map((d,y)=>({p:d,rx:i*[.07,.06,.045,.03][y]})),{radial:8}),m:"skin",fur:!0});let u=new Yi(l),f=c(0,0,1).sub(c(0,0,0)).normalize(),p=[],g=[],_=(d,y,v,x,P,T)=>{let A=u.getPoint(d).addScaledVector(f,T*i),C=c(Math.sin(y),-Math.cos(y),-.18).sub(c(0,0,0)).normalize(),M=A.clone().addScaledVector(C,v*i);P.push(Rn([A,A.clone().lerp(M,.4),A.clone().lerp(M,.8),M],[x*i*.6,x*i,x*i*.9,x*i*.15],i*.006,f,{radial:6,sub:3}))},m=Math.round(e.feathers);for(let d=0;d<m;d++){let y=d/(m-1);_(.08+y*.92,$t(-.15,1.45,Math.pow(y,1.6)),$t(.5,.95,Math.sin(y*zt*.62)),.062,p,-.004*(d%2)),_(.05+y*.9,$t(-.1,1.2,Math.pow(y,1.6)),$t(.28,.4,y),.07,g,.012)}h.push({g:He(p),m:"hair"},{g:He(g),m:"skin"})}else{let l=[];for(let[u,f,p]of[[.2,1,.17],[.85,.72,.2]]){let g=_=>c(Math.cos(u)*_*f,.04*_,-Math.sin(u)*_*f);l.push(Rn([g(0),g(.35),g(.75),g(1)],[.03*i,p*i*.8,p*i,.02*i],i*.004,Jt,{radial:6,sub:4}))}h.push({g:He(l),m:"glass"})}return h}}function Ci(n){return(e,t)=>{let i=t.size,s=e.curl,r=t.normal,a=[],o=ci(r,Jt),c=m=>n==="stinger"?t.root.clone().addScaledVector(r,i*.42*Math.sin(m*2.7*Math.abs(s||1))).addScaledVector(o,i*.4*(1-Math.cos(m*2.7*Math.abs(s||1)))*Math.sign(s||1)):t.root.clone().addScaledVector(r,i*m*(1-.3*Math.abs(s)*m)).addScaledVector(o,i*s*.65*m*m),h=Math.min(t.r*.8,i*.22)*e.thick,l={thin:m=>i*.035*e.thick*(1-m*.7),thick:m=>h*Math.pow(1-m,.9)+i*.006,fluffy:m=>i*.1*e.thick*(.35+1*Math.sin(Math.min(m*1.25,1)*zt*.8))*(m>.95?.5:1),club:m=>i*.05*e.thick*(1-m*.4),stinger:m=>i*.075*e.thick*(1-m*.45),fluke:m=>h*Math.pow(1-m,.7)*.9+i*.02,fishfin:m=>h*Math.pow(1-m,.7)*.9+i*.02,fan:m=>i*.05*(1-m*.5),tuft:m=>i*.03*e.thick*(1-m*.5)}[n],u=n==="fan"?.3:n==="fluke"||n==="fishfin"?.75:1,f=[];for(let m=0;m<=7;m++){let d=m/7;f.push({p:c(d*u),rx:Math.max(l(d),.003),ry:Math.max(l(d)*(n==="fishfin"?1.25:1),.003)})}let p=ln(f,{radial:12,sub:5,ridges:n==="stinger"?7:0,ridgeAmp:.12});a.push({g:p,m:"skin",fur:n==="fluffy"?1.6:n!=="stinger"&&n!=="fishfin"&&n!=="fluke"});let g=p.userData.end,_=g.t;if(n==="club"){let m=[];for(let d=0;d<12;d++){let y=le(Math.sin(d*2.4)*Math.sqrt(1-(d/11*2-1)**2),d/11*2-1,Math.cos(d*2.4)*Math.sqrt(1-(d/11*2-1)**2));m.push(cn(g.p.clone().addScaledVector(y,i*.07),g.p.clone().addScaledVector(y,i*.17*e.tip),i*.03,{radial:6}))}a.push({g:He([ys(dt(i*.1*e.tip,1,1,1),g.p.x,g.p.y,g.p.z),...m]),m:"accent"})}else if(n==="stinger"){let m=g.p.clone().addScaledVector(_,i*.06);a.push({g:ys(dt(i*.075*e.tip,1,1,1),m.x,m.y,m.z),m:"skin"}),a.push({g:cn(m.clone().addScaledVector(_,i*.04),m.clone().addScaledVector(_,i*.2*e.tip).addScaledVector(o,-i*.1*e.tip*Math.sign(s||1)),i*.035*e.tip),m:"accent"})}else if(n==="fluke"||n==="fishfin"){let m=n==="fluke"?t.out:o,d=n==="fluke"?o:t.out,y=[];for(let v of[-1,1]){let x=g.p.clone().addScaledVector(_,-i*.08),P=g.p.clone().addScaledVector(_,i*.3*e.tip).addScaledVector(m,v*i*.36*e.tip);y.push(Rn([x,x.clone().lerp(P,.45).addScaledVector(_,i*.05),x.clone().lerp(P,.8),P],[i*.03,i*.11*e.tip,i*.08*e.tip,i*.01],i*.012,d,{radial:8}))}a.push({g:He(y),m:n==="fluke"?"skin":"membrane"})}else if(n==="fan"){let m=[],d=Math.round(e.count);for(let y=0;y<d;y++){let v=(y/(d-1)-.5)*e.spread*2,x=_.clone().multiplyScalar(Math.cos(v)).addScaledVector(t.out,Math.sin(v)).addScaledVector(o,s*.2).normalize(),P=g.p.clone().addScaledVector(x,i*(.8+.2*Math.cos(v*1.5)));m.push(Rn([g.p.clone().addScaledVector(_,-i*.1),g.p.clone().lerp(P,.4),g.p.clone().lerp(P,.82),P],[i*.02,i*.055,i*.07,i*.02],i*.005,o,{radial:6,sub:3}))}a.push({g:He(m),m:"hair"})}else if(n==="tuft"){let m=[];for(let d=0;d<14;d++){let y=_.clone().add(le(Math.sin(d*2.4),Math.cos(d*1.7),Math.sin(d*.9)).multiplyScalar(.55)).normalize(),v=g.p.clone().addScaledVector(y,i*.24*e.tip);m.push(Rn([g.p.clone(),g.p.clone().lerp(v,.5),v],[i*.02,i*.035*e.tip,i*.004],i*.012,ci(y,Jt),{radial:6,sub:3}))}a.push({g:He(m),m:"hair"})}return a}}function Uo(n){return(e,t)=>{let i=Math.round(e.count),s=[],r=[],a=[],o=[];for(let h=0;h<i;h++){let l=i===1?.5:h/(i-1),u=on(t.part.u+(l-.5)*e.span,-.6,1.6),f=gs(t.frames,u,t.a),p=t.size*Math.pow(Math.sin((l*.84+.08)*zt),.7),g=f.normal,_=f.tangent.clone().multiplyScalar(-1),m=f.pos.clone().addScaledVector(g,-p*.12);if(n==="spikes")s.push(cn(m,f.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean),p*.2,{radial:7}));else if(n==="plates"){let d=f.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean);s.push(Rn([m,m.clone().lerp(d,.45),m.clone().lerp(d,.8),d],[p*.3,p*.42,p*.3,p*.03],p*.05,ci(g,f.tangent.clone().cross(g)),{radial:8}))}else if(n==="mane")for(let d=0;d<3;d++){let y=ci(g,Dn).multiplyScalar((d-1)*.7+(t.rnd()-.5)*.4),v=g.clone().add(y).addScaledVector(_,e.lean).normalize(),x=m.clone().addScaledVector(v,p*.45),P=x.clone().addScaledVector(v,p*.3).addScaledVector(Jt,-p*.45*e.droop).addScaledVector(y,p*.3);r.push(Rn([m,x,P],[p*.09,p*.11,p*.01],p*.025,ci(v,_),{radial:6,sub:3}))}else{let d=f.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean);s.push(cn(m,d,p*.035,{radial:5})),a.push(m.clone().lerp(d,.94)),o.push(m)}}let c=[];if(s.length&&c.push({g:He(s),m:"accent"}),n==="mane"&&c.push({g:He(r),m:"hair"}),a.length>1){let h=[],l=[];for(let u=0;u<a.length-1;u++)for(let f=0;f<4;f++){let p=f/4,g=on(t.part.u+((u+p)/(i-1)-.5)*e.span,-.6,1.6);h.push(gs(t.frames,g,t.a).pos),l.push(a[u].clone().lerp(a[u+1],p).lerp(h[h.length-1],.12*Math.sin(p*zt)))}h.push(o[i-1]),l.push(a[i-1]),c.push({g:_s(h,l),m:"membrane"})}return c}}var vh={thick:[.4,2.2,1,"Thickness"],muscle:[.7,1.6,1,"Muscle"],splay:[-.3,1.3,.05,"Spread"],swing:[-1.4,1.4,0,"Swing"],yaw:[-1.6,1.6,0,"Turn"],bend:[-.5,2.5,1,"Bend"],end:[.5,2.2,1,"Foot size"]},Xx={...vh,end:[.5,2.2,1,"Hand size"]},nf=["human","paw","hoof","talon","webbed","stump","point","none"],Yx=["human","claw","pincer","mitt","none"],xs={thick:[.3,2.5,1,"Thickness"],curl:[-1.2,1.2,.2,"Curl"]},hr=(n,e,t,i={})=>({n,cat:"limbs",kind:"world",slot:"leg",rel:1,mirror:!0,P:vh,C:{endType:nf},D:{endType:t,...i},build:xh(e,No,t)}),yh=(n,e,t={})=>({n,cat:"limbs",kind:"world",slot:"arm",rel:.85,mirror:!0,P:Xx,C:{endType:Yx},D:{endType:e,...t},build:xh("arm",tf,e)}),vs=(n,e,t={})=>({n,cat:"eyes",kind:"surface",slot:"eye",size:.55,mirror:!0,P:e==="compound"||e==="beady"?{}:Ax,build:Tx(e),...t}),qi={len:[.4,2.5,1,"Length"],curve:[-1.5,2,1,"Curve"]},Pt={eye_round:vs("Round eye","round"),eye_cat:vs("Slit eye","cat"),eye_goat:vs("Bar-pupil eye","goat"),eye_glow:vs("Glowing eye","glow"),eye_beady:vs("Beady eye","beady",{size:.3}),eye_compound:vs("Compound eye","compound",{size:.8}),eye_stalk:vs("Stalk eye","stalk",{size:.45}),brow:{n:"Eyebrow",cat:"eyes",kind:"surface",slot:"brow",size:.6,sink:0,mirror:!0,P:{arch:[-1,2,.6,"Arch"],thick:[.4,2.5,1,"Thickness"]},build:Nx},muzzle:{n:"Muzzle",cat:"mouth",kind:"surface",slot:"mouth",size:1.25,P:{len:[.3,2.5,1,"Length"],open:[0,1,.15,"Open"],teeth:[0,3,1,"Teeth"]},build:Rx},beak:{n:"Beak",cat:"mouth",kind:"surface",slot:"mouth",size:1.2,P:{len:[.4,3.5,1,"Length"],hook:[0,1.5,.5,"Hook"],open:[0,1,.1,"Open"]},build:Cx},mandibles:{n:"Mandibles",cat:"mouth",kind:"surface",slot:"mouth",size:1.2,P:{len:[.5,2,1,"Length"],open:[0,1,.3,"Open"]},build:Px},maw:{n:"Round maw",cat:"mouth",kind:"surface",slot:"mouth",size:1.1,P:{teeth:[.3,2.5,1,"Teeth"],count:[5,18,11,"Tooth count"]},build:Ix},lips:{n:"Lips",cat:"mouth",kind:"surface",slot:"mouth",size:.85,P:{full:[.3,2,1,"Fullness"],smile:[-1,1,.25,"Frown / smile"]},build:Lx},trunk:{n:"Trunk",cat:"mouth",kind:"surface",slot:"mouth",size:.9,P:{len:[.4,2,1,"Length"],curl:[-1,1.5,.4,"Curl"]},build:Dx},feelers:{n:"Face feelers",cat:"mouth",kind:"surface",slot:"mouth",size:1.1,P:{len:[.4,2.5,1,"Length"],count:[2,8,4,"Count"]},build:Ux},nose:{n:"Nose",cat:"mouth",kind:"surface",slot:"nose",size:.55,P:{len:[.4,2.2,1,"Length"],wide:[.5,1.8,1,"Width"]},build:Fx},whiskers:{n:"Whiskers",cat:"mouth",kind:"surface",slot:"cheek",size:.9,mirror:!0,P:{len:[.4,2,1,"Length"]},build:Bx},tusk:{n:"Tusk",cat:"mouth",kind:"surface",slot:"cheek",size:.7,mirror:!0,orn:!0,P:qi,build:cr("tusk")},beard:{n:"Beard",cat:"mouth",kind:"surface",slot:"chin",size:.9,P:{len:[.3,3,1,"Length"],count:[6,60,26,"Thickness"]},build:jr({count:26,spread:.7,droop:1,width:.11,capR:.6})},ear_point:{n:"Pointed ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Kr("point")},ear_round:{n:"Round ear",cat:"ears",kind:"surface",slot:"ear",size:.9,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Kr("round")},ear_long:{n:"Long ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Kr("long")},ear_floppy:{n:"Floppy ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Kr("floppy")},ear_elf:{n:"Swept ear",cat:"ears",kind:"surface",slot:"earSide",size:.75,mirror:!0,P:{len:[.2,2.5,.6,"Length"],wide:[.4,2,1,"Width"]},build:Kr("elf")},ear_fin:{n:"Fin ear",cat:"ears",kind:"surface",slot:"earSide",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"]},build:Ox},horn_spike:{n:"Spike horn",cat:"horns",kind:"surface",slot:"horn",size:.7,mirror:!0,orn:!0,P:qi,build:cr("spike")},horn_curved:{n:"Curved horn",cat:"horns",kind:"surface",slot:"horn",size:.75,mirror:!0,orn:!0,P:qi,build:cr("curved")},horn_ram:{n:"Ram horn",cat:"horns",kind:"surface",slot:"horn",size:.8,mirror:!0,orn:!0,P:qi,build:cr("ram")},antler:{n:"Antler",cat:"horns",kind:"surface",slot:"horn",size:.7,mirror:!0,orn:!0,P:{...qi,tines:[1,6,3,"Tines"]},build:cr("antler")},antenna:{n:"Antenna",cat:"horns",kind:"surface",slot:"horn",size:1.2,mirror:!0,P:qi,build:ef(!1)},antenna_feather:{n:"Feathery antenna",cat:"horns",kind:"surface",slot:"horn",size:1.2,mirror:!0,orn:!0,P:qi,build:ef(!0)},crest:{n:"Feather crest",cat:"horns",kind:"surface",slot:"top",size:1.3,orn:!0,P:{len:[.3,3,1,"Length"],count:[3,30,9,"Feathers"],spread:[.1,1.4,.45,"Spread"],droop:[0,1,.1,"Droop"]},build:jr({count:9,spread:.45,droop:.1,width:.12,capR:.3})},hair:{n:"Hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.15,2.5,.7,"Length"],count:[20,200,110,"Thickness"],spread:[.5,1.9,1.45,"Coverage"],droop:[0,1,.85,"Droop"]},build:jr({count:110,spread:1.45,droop:.85,width:.085,capR:.5,hug:!0})},hair_short:{n:"Cropped hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.1,1,.26,"Length"],count:[40,220,150,"Thickness"],spread:[.5,1.9,1.3,"Coverage"],droop:[0,1,.55,"Droop"]},build:jr({count:150,spread:1.3,droop:.55,width:.075,capR:.5,hug:!0})},hair_long:{n:"Long hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.8,3.2,1.7,"Length"],count:[40,220,130,"Thickness"],spread:[.5,1.9,1.5,"Coverage"],droop:[0,1,1,"Droop"]},build:jr({count:130,spread:1.5,droop:1,width:.09,capR:.5,hug:!0})},leg_human:hr("Walker leg","plant","human"),leg_beast:hr("Beast leg","digi","paw"),leg_hoof:hr("Hoofed leg","digi","hoof",{thick:.8}),leg_bird:hr("Taloned leg","digi","talon",{thick:.6,end:1.3}),leg_frog:hr("Webbed leg","plant","webbed",{bend:2,end:1.3}),leg_pillar:hr("Pillar leg","pillar","stump",{thick:1.5}),leg_insect:{n:"Jointed leg",cat:"limbs",kind:"world",slot:"leg",rel:1.25,mirror:!0,radial:!0,P:{...vh,thick:[.3,2.2,.55,"Thickness"]},C:{endType:nf},D:{endType:"point",thick:.55,splay:0},build:xh("insect",No,"point")},arm_human:yh("Arm with hand","human"),arm_claw:yh("Clawed arm","claw"),arm_pincer:yh("Pincer arm","pincer",{splay:.5,swing:.9}),tentacle:{n:"Tentacle",cat:"limbs",kind:"world",slot:"arm",rel:1.3,mirror:!0,radial:!0,P:{thick:[.4,2.2,1,"Thickness"],curl:[0,2,1,"Wiggle"],splay:[-.6,1.4,.1,"Spread"],yaw:[-1.6,1.6,0,"Turn"],suckers:[0,1,1,"Suckers"]},build:Wx},wing_feather:{n:"Feathered wing",cat:"wings",kind:"world",slot:"wing",rel:1.3,mirror:!0,P:{lift:[-1.2,1.3,.25,"Lift"],sweep:[-.6,1.4,.3,"Sweep"],feathers:[5,16,11,"Feathers"]},build:_h("feather")},wing_bat:{n:"Skin wing",cat:"wings",kind:"world",slot:"wing",rel:1.3,mirror:!0,P:{lift:[-1.2,1.3,.3,"Lift"],sweep:[-.6,1.4,.25,"Sweep"]},build:_h("bat")},wing_insect:{n:"Glass wing",cat:"wings",kind:"world",slot:"wing",rel:1.2,mirror:!0,P:{lift:[-1.2,1.3,.35,"Lift"],sweep:[-.6,1.4,.2,"Sweep"]},build:_h("insect")},fin_dorsal:{n:"Back fin",cat:"wings",kind:"surface",slot:"back",size:1.3,P:{len:[.4,2.5,1,"Height"],sweep:[-.5,2,1,"Sweep"]},build:Hx},fin_side:{n:"Flipper",cat:"wings",kind:"surface",slot:"arm",size:1.5,mirror:!0,P:{len:[.4,2.5,1,"Length"],sweep:[-.5,2,1,"Sweep"]},build:Vx},tail_thin:{n:"Whip tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:xs,build:Ci("thin")},tail_thick:{n:"Heavy tail",cat:"tails",kind:"world",slot:"tail",rel:1.2,P:xs,build:Ci("thick")},tail_fluffy:{n:"Bushy tail",cat:"tails",kind:"world",slot:"tail",rel:.9,P:xs,build:Ci("fluffy")},tail_tuft:{n:"Tufted tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:{...xs,tip:[.4,2.5,1,"Tuft size"]},build:Ci("tuft")},tail_club:{n:"Club tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:{...xs,tip:[.4,2.5,1,"Club size"]},build:Ci("club")},tail_stinger:{n:"Stinger tail",cat:"tails",kind:"world",slot:"tail",rel:1.3,P:{thick:[.3,2.5,1,"Thickness"],curl:[-1.2,1.2,1,"Curl"],tip:[.4,2.5,1,"Stinger size"]},build:Ci("stinger")},tail_fluke:{n:"Fluke tail",cat:"tails",kind:"world",slot:"tail",rel:.9,P:{...xs,tip:[.4,2.5,1,"Fluke size"]},D:{curl:0},build:Ci("fluke")},tail_fish:{n:"Fish tail",cat:"tails",kind:"world",slot:"tail",rel:.8,P:{...xs,tip:[.4,2.5,1,"Fin size"]},D:{curl:0},build:Ci("fishfin")},tail_fan:{n:"Feather fan",cat:"tails",kind:"world",slot:"tail",rel:.8,orn:!0,P:{curl:[-1.2,1.5,.3,"Lift"],count:[3,21,9,"Feathers"],spread:[.1,1.5,.6,"Spread"]},build:Ci("fan")},ridge_spikes:{n:"Spike row",cat:"back",kind:"world",slot:"back",rel:.22,ridge:!0,P:{count:[1,24,9,"Count"],span:[.05,1.6,.6,"Row length"],lean:[-1,1.5,.3,"Lean"]},build:Uo("spikes")},ridge_plates:{n:"Plate row",cat:"back",kind:"world",slot:"back",rel:.3,ridge:!0,P:{count:[1,20,8,"Count"],span:[.05,1.6,.6,"Row length"],lean:[-1,1.5,.1,"Lean"]},build:Uo("plates")},ridge_sail:{n:"Sail",cat:"back",kind:"world",slot:"back",rel:.45,ridge:!0,P:{count:[3,20,9,"Spines"],span:[.05,1.6,.55,"Row length"],lean:[-1,1.5,.2,"Lean"]},build:Uo("sail")},ridge_mane:{n:"Mane",cat:"back",kind:"world",slot:"mane",rel:.4,ridge:!0,orn:!0,P:{count:[3,30,14,"Thickness"],span:[.05,1.6,.3,"Row length"],lean:[-1,1.5,.5,"Sweep"],droop:[0,2,1,"Droop"]},build:Uo("mane")},spike:{n:"Single spike",cat:"back",kind:"surface",slot:"back",size:.5,P:qi,build:cr("spike")},wrap:{n:"Wrap band",cat:"back",kind:"world",slot:"back",rel:.06,ridge:!0,mirror:!1,P:{span:[.03,1.2,.16,"Width"]},build:kx},shell:{n:"Shell",cat:"back",kind:"surface",slot:"back",size:2.4,P:{dome:[.2,1.5,.55,"Dome"],long:[.6,2.2,1.35,"Length"]},build:zx}},ko=[["eyes","Eyes"],["mouth","Mouth"],["ears","Ears"],["horns","Head"],["limbs","Limbs"],["wings","Wings"],["tails","Tails"],["back","Back"]];function Fo(n){let e=Pt[n],t={};for(let[i,s]of Object.entries(e.P||{}))t[i]=s[2];return Object.assign(t,e.D||{})}var Ht=Math.PI,Zi=n=>({base:"#c9b08a",second:"#6b4a2e",belly:"#efe2c8",bellyAmt:.8,pattern:0,patScale:1,cover:"skin",furLen:.3,furDroop:.3,accent:"#e8e0cc",hair:"#3b2a1e",cloth:"#6b4a2e",membrane:"#c98a8a",eye:"#3f8f4a",...n}),Tt={humanoid:{name:"Humanoid",blurb:"Upright, two arms, two legs",limbLen:.9,bellyDir:[0,-.2,1],dimorph:"human",capS:.5,nodes:[[.9,-.008,.142,.094,"hips",.95,1.12],[1,-.006,.156,.104,"hips",.98,1.18],[1.1,0,.14,.095,"waist",1.03,1],[1.2,.006,.121,.085,"waist",1,.98],[1.31,.012,.139,.1,"chest",1.04,1],[1.4,.015,.157,.107,"chest",1.1,.96],[1.475,.008,.172,.094,"shoulders",1,1],[1.525,.002,.122,.076,"shoulders",.95,1.05],[1.562,.002,.063,.061,"neck"],[1.62,.01,.056,.058,"neck"],[1.69,.03,.08,.094,"head",1.16,.9],[1.752,.032,.112,.118,"head",1.07,1],[1.82,.024,.124,.13,"head",1,1.05],[1.878,.016,.102,.11,"head"]],slots:{eye:[.882,2.8],brow:[.912,2.8],mouth:[.808,Ht],nose:[.848,Ht],cheek:[.83,2.45],chin:[.78,Ht],ear:[1.35,1.1],earSide:[.86,1.57],horn:[1.4,2.1],top:[1.85,0],leg:[-.4,1.57],arm:[.452,1.57],wing:[.42,.45],tail:[.03,0],back:[.3,0],mane:[.6,0]},look:Zi({base:"#c99573",second:"#8a5a3c",belly:"#d9a888",bellyAmt:.35,hair:"#2c1b12",eye:"#4a7fb5",cloth:"#5a3a24"}),parts:[["leg_human","leg",{size:.9,p:{end:.9}}],["arm_human","arm",{size:.72,p:{splay:.1,end:.82}}],["eye_round","eye",{size:.047,p:{lid:.22,iris:.9}}],["brow","brow",{size:.055}],["nose","nose",{size:.05,p:{len:1.25,wide:.85}}],["lips","mouth",{size:.074,p:{full:.95,smile:.25}}],["ear_elf","earSide",{size:.075,p:{len:.25}}],["hair","top",{size:.3,p:{len:.55,count:140}}],["wrap",[-.36,0],{size:.028,p:{span:1.02}}],["wrap",[.4,0],{size:.02,sexOnly:"f",p:{span:.1}}]]},quadruped:{name:"Quadruped",blurb:"Four legs, tail, muzzle",limbLen:.85,bellyDir:[0,-1,0],dimorph:"std",nodes:[[.95,-.62,.15,.17,"hips"],[.98,-.36,.2,.23,"hips"],[.96,0,.195,.235,"waist"],[.99,.34,.21,.27,"chest"],[1.06,.55,.17,.22,"shoulders"],[1.25,.74,.115,.135,"neck"],[1.39,.9,.125,.13,"head"],[1.38,1.03,.105,.105,"head"]],slots:{eye:[.93,.95],mouth:[1.85,Ht],nose:[1.9,0],cheek:[1.35,1.9],chin:[.95,Ht],ear:[.85,.6],earSide:[.86,1.2],horn:[.9,.3],top:[.86,0],leg:[.3,2.1],arm:[.56,1.5],wing:[.5,.55],tail:[-.8,0],back:[.35,0],mane:[.68,0]},look:Zi({base:"#b9773a",second:"#3a2616",belly:"#f3e6d0",cover:"fur",furLen:.3,pattern:5,hair:"#3a2616",eye:"#d9a020"}),parts:[["leg_beast",[.12,2.1],{size:.84}],["leg_beast",[.53,2.1],{size:.86,p:{bend:.45,thick:.9}}],["muzzle","mouth"],["eye_cat","eye"],["ear_point","ear"],["tail_fluffy","tail",{p:{curl:-.35}}],["whiskers","cheek"]]},avian:{name:"Avian",blurb:"Wings, beak, talons",limbLen:.7,bellyDir:[0,-.8,.6],dimorph:"std",nodes:[[.76,-.32,.07,.07,"hips"],[.8,-.1,.17,.17,"hips"],[.92,.1,.19,.2,"chest"],[1.1,.22,.12,.125,"neck"],[1.3,.26,.075,.075,"neck"],[1.42,.3,.1,.1,"head"],[1.44,.38,.085,.085,"head"]],slots:{eye:[.9,1.25],mouth:[1.85,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.85,Ht],ear:[.86,.6],earSide:[.86,1.2],horn:[.92,.5],top:[.9,0],leg:[.22,2.35],arm:[.36,1.5],wing:[.38,.85],tail:[-.85,0],back:[.25,0],mane:[.55,0]},look:Zi({base:"#2f7fc2",second:"#f2c230",belly:"#f4f0e6",cover:"fur",furLen:.12,pattern:5,accent:"#e8a020",hair:"#1f4f9a",eye:"#e8a020"}),parts:[["leg_bird","leg",{size:.74}],["wing_feather","wing",{size:.95}],["beak","mouth"],["eye_round","eye",{p:{lid:.15}}],["crest","top",{sexOnly:null}],["tail_fan","tail",{size:.6}]]},insectoid:{name:"Insectoid",blurb:"Six legs, antennae, chitin",limbLen:.72,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[.5,-.78,.1,.1,"abdomen"],[.56,-.5,.26,.24,"abdomen"],[.53,-.2,.2,.18,"abdomen"],[.5,-.02,.07,.07,"waist"],[.55,.15,.16,.15,"chest"],[.56,.38,.15,.14,"chest"],[.56,.5,.06,.06,"neck"],[.58,.62,.14,.13,"head"],[.56,.74,.1,.1,"head"]],slots:{eye:[.93,1.1],mouth:[1.8,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Ht],ear:[.9,.8],earSide:[.9,1.3],horn:[.97,.45],top:[.9,0],leg:[.56,2],arm:[.64,1.7],wing:[.56,.5],tail:[-.9,0],back:[.15,0],mane:[.55,0]},look:Zi({base:"#2f6b3a",second:"#12281a",belly:"#9fb86a",bellyAmt:.5,cover:"chitin",pattern:7,accent:"#1c1a14",membrane:"#bfe8e0",eye:"#b03020"}),parts:[["leg_insect",[.47,2],{size:.72,p:{yaw:-.7}}],["leg_insect",[.56,2],{size:.68,p:{yaw:0}}],["leg_insect",[.64,2],{size:.7,p:{yaw:.75}}],["eye_compound","eye"],["mandibles","mouth",{size:.13}],["antenna","horn"],["wing_insect","wing",{size:.95}]]},arachnid:{name:"Arachnid",blurb:"Eight legs, many eyes",limbLen:1,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[.62,-.62,.14,.14,"abdomen"],[.7,-.36,.32,.3,"abdomen"],[.6,-.08,.2,.18,"abdomen"],[.5,.05,.08,.07,"waist"],[.5,.25,.22,.15,"chest"],[.5,.45,.17,.12,"head"],[.48,.55,.1,.08,"head"]],slots:{eye:[1.3,.6],mouth:[1.85,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Ht],ear:[.9,.8],earSide:[.9,1.3],horn:[.9,.45],top:[.85,0],leg:[.7,1.9],arm:[.85,1.7],wing:[.66,.5],tail:[-.9,0],back:[.18,0],mane:[.5,0]},look:Zi({base:"#3a2a22",second:"#c8501c",belly:"#5a463a",bellyAmt:.4,cover:"fur",furLen:.1,pattern:7,accent:"#14100e",eye:"#a01818"}),parts:[["leg_insect",[.6,1.9],{size:1,p:{yaw:-1}}],["leg_insect",[.66,1.9],{size:.9,p:{yaw:-.35}}],["leg_insect",[.72,1.9],{size:.9,p:{yaw:.3}}],["leg_insect",[.78,1.9],{size:1.05,p:{yaw:.95}}],["eye_beady",[1.35,.5],{size:.045}],["eye_beady",[1.3,1.15],{size:.03}],["eye_beady",[.97,.5],{size:.032}],["eye_beady",[.95,1],{size:.026}],["mandibles","mouth",{size:.12}]]},cephalopod:{name:"Cephalopod",blurb:"Soft mantle, eight tentacles",limbLen:1.1,bellyDir:[0,-.5,-.8],dimorph:"reverse",nodes:[[1.78,-.52,.07,.07,"abdomen"],[1.56,-.38,.24,.22,"abdomen"],[1.26,-.2,.3,.28,"abdomen"],[.97,-.05,.215,.215,"waist"],[.77,.02,.225,.215,"head"],[.62,.05,.19,.19,"head"]],slots:{eye:[.86,1.4],mouth:[2,0],nose:[.8,0],cheek:[.9,.8],chin:[1.2,0],ear:[.7,1.2],earSide:[.7,1.5],horn:[.72,.6],top:[.3,Ht],leg:[1.45,1.57],arm:[1.45,1],wing:[.3,1.57],tail:[-.9,0],back:[.3,Ht],mane:[.4,Ht]},look:Zi({base:"#c4472e",second:"#f0b090",belly:"#f2d6c4",bellyAmt:.7,cover:"slime",pattern:2,patScale:1.6,membrane:"#f2c4b0",eye:"#e0b030"}),parts:[["tentacle",[1.45,.38],{size:1.15}],["tentacle",[1.45,1.15],{size:1.05}],["tentacle",[1.45,1.95],{size:1.05}],["tentacle",[1.45,2.75],{size:1.15}],["eye_goat","eye",{p:{lid:.2}}]]},serpent:{name:"Serpent",blurb:"Long limbless body",limbLen:.5,bellyDir:[0,-1,0],dimorph:"std",nodes:[[.05,-1.75,.025,.025,"tail"],[.09,-1.35,.07,.07,"tail"],[.11,-.9,.1,.1,"hips"],[.12,-.4,.115,.115,"waist"],[.13,.1,.12,.12,"waist"],[.22,.5,.115,.115,"chest"],[.56,.74,.105,.105,"neck"],[.9,.8,.095,.1,"neck"],[1.09,.93,.125,.1,"head"],[1.07,1.1,.1,.075,"head"]],slots:{eye:[.96,.95],mouth:[1.8,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.97,Ht],ear:[.92,.7],earSide:[.92,1.3],horn:[.95,.45],top:[.93,0],leg:[.45,2.1],arm:[.72,1.7],wing:[.68,.6],tail:[-.9,0],back:[.5,0],mane:[.8,0]},look:Zi({base:"#4f8a3a",second:"#1f3a1c",belly:"#e6dfa0",cover:"scales",pattern:1,eye:"#e8c020"}),parts:[["muzzle","mouth",{size:.13,p:{len:.7,teeth:1.8,open:.35}}],["eye_cat","eye",{size:.05}],["ridge_spikes",[.6,0],{size:.07,p:{count:16,span:.7}}]]},aquatic:{name:"Aquatic",blurb:"Fins, flippers, fish tail",limbLen:.5,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[1,-1,.03,.07,"tail"],[1,-.6,.08,.15,"tail"],[1,-.1,.17,.26,"abdomen"],[1.02,.35,.19,.28,"chest"],[1,.7,.15,.2,"head"],[.98,.95,.09,.11,"head"]],slots:{eye:[.9,1.15],mouth:[1.75,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Ht],ear:[.85,.7],earSide:[.85,1.3],horn:[.9,.45],top:[.85,0],leg:[.4,2.3],arm:[.64,2],wing:[.5,.6],tail:[-.8,0],back:[.52,0],mane:[.7,0]},look:Zi({base:"#3a7f9a",second:"#1c3f5a",belly:"#eef2f0",cover:"scales",pattern:5,membrane:"#7fc4d0",eye:"#e8e0a0"}),parts:[["muzzle","mouth",{size:.13,p:{len:.45,teeth:1.6,open:.3}}],["eye_round","eye",{size:.06,p:{lid:0}}],["fin_dorsal","back",{size:.32}],["fin_side","arm",{size:.3}],["tail_fish","tail",{size:.5,p:{tip:1.3}}]]}};var qx=1,Zx=()=>"p"+qx+++Math.random().toString(36).slice(2,6),$x={std:{m:{roles:{shoulders:[.16,.08],chest:[.1,.05],neck:[.2,.16],waist:[.04,.02],head:[.03,.03]},limb:.15,orn:.3,all:.03},f:{roles:{shoulders:[-.1,-.05],chest:[-.04,.07],waist:[-.14,-.08],hips:[.13,.07],neck:[-.13,-.1]},limb:-.1,orn:-.4,all:-.02}},human:{m:{roles:{shoulders:[.14,.06],chest:[.08,.02],neck:[.2,.16],waist:[.06,.04],head:[.03,.02]},front:{chest:[-.04,.04],waist:[.03,0]},limb:.14,orn:.3,all:.03},f:{roles:{shoulders:[-.09,-.04],chest:[-.05,0],waist:[-.13,-.06],hips:[.1,.04],neck:[-.12,-.1]},front:{chest:[.24,0],hips:[0,.12],waist:[-.04,0]},limb:-.1,orn:-.4,all:-.02}},reverse:{m:{roles:{abdomen:[-.12,-.12],head:[.05,.05]},limb:-.05,orn:.35,all:-.05},f:{roles:{abdomen:[.2,.18]},limb:.05,orn:-.3,all:.04}}};function rf(n){let e=$x[Tt[n.type].dimorph][n.sex],t=n.dimorph;return{roles:e.roles,front:e.front,k:t,limb:1+e.limb*t,orn:1+e.orn*t,all:1+e.all*t}}function bs(n){let e=Tt[n],t={v:1,name:"New "+e.name,type:n,sex:"f",dimorph:.7,bulk:1,stretch:1,nodes:e.nodes.map(s=>{var r,a;return{y:s[0],z:s[1],rx:s[2],ry:s[3],role:s[4],f:(r=s[5])!=null?r:1,b:(a=s[6])!=null?a:1}}),look:{...e.look},parts:[]},i=Oo(t,{sexless:!0}).userData.frames;for(let[s,r,a]of e.parts)hi(t,s,i,typeof r=="string"?e.slots[r]:r,a);return t}function hi(n,e,t,i,s={}){let r=Pt[e],a=Tt[n.type],[o,c]=i||a.slots[r.slot]||(r.slot==="brow"?[a.slots.eye[0]+.035,a.slots.eye[1]]:a.slots.back);for(;!i&&n.parts.some(u=>Math.abs(u.u-o)<.02&&Math.abs(u.a-c)<.05&&Pt[u.kind].cat===r.cat);)o-=.07;let h=gs(t,o,c),l={id:Zx(),kind:e,u:o,a:c,mirror:!!r.mirror,rot:0,tilt:0,sexOnly:null,size:r.kind==="surface"?r.size*h.r:r.rel*(r.ridge?Math.max(h.r,.08)*4.5:a.limbLen),p:Fo(e)};s.p&&Object.assign(l.p,s.p);for(let u of["size","rot","tilt","sexOnly","mirror"])s[u]!==void 0&&(l[u]=s[u]);return n.parts.push(l),l}function Oo(n,e={}){var a;let t=rf(n),i=n.nodes.reduce((o,c)=>o+c.y,0)/n.nodes.length,s=n.nodes.reduce((o,c)=>o+c.z,0)/n.nodes.length,r=n.nodes.map(o=>{var l,u;let c=!e.sexless&&t.roles[o.role]||[0,0],h=!e.sexless&&t.front&&t.front[o.role]||[0,0];return{p:le(0,i+(o.y-i)*n.stretch,s+(o.z-s)*n.stretch),rx:o.rx*n.bulk*(e.sexless?1:t.all)*(1+c[0]*t.k),ry:o.ry*n.bulk*(e.sexless?1:t.all)*(1+c[1]*t.k),f:((l=o.f)!=null?l:1)*(1+h[0]*t.k),b:((u=o.b)!=null?u:1)*(1+h[1]*t.k)}});return ln(r,{radial:52,sub:10,capRings:7,side:Dn.clone(),frames:!0,capStart:(a=Tt[n.type].capS)!=null?a:1})}function sf(n,e,t){let i=new Map;for(let r of n){if(!r||!r.g)continue;let a=typeof r.m=="string"?e[r.m]:r.m,o=a.uuid+(r.fur||0);i.has(o)||i.set(o,{mat:a,fur:r.fur,gs:[]}),i.get(o).gs.push(r.g)}let s=[];for(let r of i.values()){let a=new ke(He(r.gs),r.mat);a.userData.fur=r.mat===e.skin?r.fur===!0?1:r.fur||0:0,a.castShadow=r.mat!==e.glass,a.receiveShadow=r.mat===e.skin,s.push(a)}return s}function Mh(n){let e=(n.a%(2*Math.PI)+2*Math.PI)%(2*Math.PI);return n.mirror?(e>Math.PI&&(e=2*Math.PI-e),e<.1?{a:0,mirrored:!1}:e>Math.PI-.1?{a:Math.PI,mirrored:!1}:{a:e,mirrored:!0}):{a:e,mirrored:!1}}function bh(n,e){let t=n.geometry;if(!e){t.setAttribute("rp",t.attributes.position),t.setAttribute("rn",t.attributes.normal);return}let i=t.attributes.position.clone().applyMatrix4(e),s=t.attributes.normal.clone().applyNormalMatrix(new ze().getNormalMatrix(e));t.setAttribute("rp",i),t.setAttribute("rn",s)}function af(n,e,t,i,s,r){let a=Pt[e.kind],o=rf(n),c=new Et;if(c.userData.partId=e.id,e.sexOnly&&e.sexOnly!==n.sex)return c;let{a:h,mirrored:l}=Mh(e),u=gs(t,e.u,h),f=[...e.id].reduce((y,v)=>y*31+v.charCodeAt(0)|0,7),p={M:i,look:n.look,female:n.sex==="f",k:o.k,limbMul:o.limb,rnd:lr(f),seed:f%100/16,part:e,frames:t,a:h,r:u.r,normal:u.normal},g=a.orn?o.orn:1,_=s?[]:null;p.anchors=_;let m=new Et;if(c.userData.anchor=u.pos.clone(),a.kind==="surface"){let y=u.normal,v=Math.abs(y.y)<.9?Jt.clone():y.y>0?or.clone().multiplyScalar(-1):or.clone(),x=v.addScaledVector(y,-v.dot(y)).normalize(),P=x.clone().cross(y),T=new qt().setFromRotationMatrix(new We().makeBasis(P,x,y));T.multiply(new qt().setFromAxisAngle(or,e.rot)).multiply(new qt().setFromAxisAngle(Dn,-e.tilt));let A=T.clone().invert();p.down=le(0,-1,0).applyQuaternion(A),p.up=le(0,1,0).applyQuaternion(A),p.fwd=le(0,0,1).applyQuaternion(A);for(let C of sf(a.build(e.p,p),i))m.add(C);m.quaternion.copy(T),m.position.copy(u.pos),m.scale.setScalar(e.size*g),m.updateMatrix();for(let C of m.children)C.material===i.skin&&bh(C,m.matrix)}else{p.size=e.size*g;let y=e.p.yaw||0,v=Dn.clone();a.radial&&(v=le(u.normal.x,0,u.normal.z),v.lengthSq()<.01&&(v=Dn.clone()),v.normalize()),v.applyAxisAngle(Jt,-y),p.out=v,p.fwd=v.clone().cross(Jt).normalize(),p.root=a.ridge?u.pos:u.pos.clone().addScaledVector(u.normal,-u.r*(a.cat==="limbs"?.4:.25));for(let x of sf(a.build(e.p,p),i))m.add(x),x.material===i.skin&&bh(x);a.ridge||(m.userData.joint={pivot:p.root.clone(),kind:a.cat==="limbs"?e.kind.startsWith("leg")?"leg":e.kind==="tentacle"?"tentacle":"arm":a.cat==="wings"?"wing":"tail",partId:e.id,side:1})}c.add(m);let d=null;if(l){let y=new Et;y.scale.x=-1,d=m.clone(),m.userData.joint&&(d.userData.joint={...m.userData.joint,side:-1}),y.add(d),c.add(y)}if(r&&m.userData.joint)for(let y of[m,d])y&&r.n<Io&&(y.userData.joint.bone=r.n++);if(_)for(let y of _)s.push({...y,node:m}),d&&s.push({...y,node:d});return c}function ur(n,e,t={}){let i=new Et,s=Oo(n),r=s.userData.frames,a=new ke(s,e.skin),o=t.animated?{n:1}:null;a.castShadow=a.receiveShadow=!0,bh(a),a.userData.fur=1,a.userData.partId="body",i.add(a);let c={group:i,body:a,frames:r,parts:new Map,shells:new Et,data:n,M:e};for(let h of n.parts){let l;try{l=af(n,h,r,e,t.anchors,o)}catch(u){console.error("part failed",h.kind,u),l=new Et,l.userData.partId=h.id}c.parts.set(h.id,l),i.add(l)}return i.add(c.shells),Qr(c),c}function Bo(n,e){let t=n.parts.get(e.id);t&&(n.group.remove(t),dr(t));let i=af(n.data,e,n.frames,n.M);return n.parts.set(e.id,i),n.group.add(i),i}function Qr(n,e){for(let s of[...n.shells.children])n.shells.remove(s);if(n.shellGeo&&(n.shellGeo.dispose(),n.shellGeo=null),n.data.look.cover!=="fur")return;n.group.updateMatrixWorld(!0);let t=[],i=n.group.matrixWorld.clone().invert();if(n.group.traverse(s=>{if(!s.isMesh||!s.userData.fur)return;let r=s,a=!1;for(;r;)e&&r.userData.partId===e&&(a=!0),r=r.parent;if(a)return;let o=0;for(let l=s.parent;l&&l!==n.group;l=l.parent)l.userData.joint&&l.userData.joint.bone&&(o=l.userData.joint.bone);let c=i.clone().multiply(s.matrixWorld),h=s.geometry.clone();h.deleteAttribute("rp"),h.deleteAttribute("rn"),h.applyMatrix4(c),c.determinant()<0&&jd(h),h.setAttribute("bone",new xt(new Float32Array(h.attributes.position.count).fill(o),1)),h.setAttribute("fur",new xt(new Float32Array(h.attributes.position.count).fill(s.userData.fur),1)),t.push(h)}),!!t.length){n.shellGeo=He(t,["fur","bone"]),n.shellGeo.setAttribute("rp",n.shellGeo.attributes.position),n.shellGeo.setAttribute("rn",n.shellGeo.attributes.normal),t.forEach(s=>s!==n.shellGeo&&s.dispose());for(let s=0;s<Po;s++){let r=new ke(n.shellGeo,n.M.shells[s]);r.frustumCulled=!1,r.raycast=()=>{},n.shells.add(r)}}}function dr(n){n.traverse(e=>{e.isMesh&&e.geometry.dispose()})}function ea(n){let e=new An;return n.group.updateMatrixWorld(!0),n.group.traverse(t=>{t.isMesh&&t.parent!==n.shells&&(t.geometry.computeBoundingBox(),e.union(t.geometry.boundingBox.clone().applyMatrix4(t.matrixWorld)))}),e}var of={muzzle:n=>{var e;return 5+2.5*((e=n.teeth)!=null?e:1)},beak:n=>{var e;return 6+1.5*((e=n.hook)!=null?e:.5)},mandibles:()=>7,maw:n=>{var e;return 4+2.5*((e=n.teeth)!=null?e:1)},trunk:()=>3,feelers:()=>2,lips:()=>1,tusk:()=>5,horn_spike:()=>4,horn_curved:()=>5,horn_ram:()=>6,antler:()=>5,tentacle:()=>3,tail_club:()=>7,tail_stinger:()=>5,tail_thick:()=>3,spike:()=>2},Jx={claw:4,talon:4,pincer:6,paw:2.5,hoof:3,human:3,point:2.5,webbed:2,stump:2.5,mitt:1.5,none:0},Kx=[1,.6,.4,.3,.2,.15],Pi=(n,e,t)=>Math.min(t,Math.max(e,n));function fr(n){var T,A;let e=0;for(let C=0;C<n.nodes.length-1;C++){let M=n.nodes[C],b=n.nodes[C+1];e+=Math.hypot(M.y-b.y,M.z-b.z)*Math.PI*((M.rx+b.rx)/2)*((M.ry+b.ry)/2)}let t=Math.min(Math.cbrt(e*n.bulk*n.bulk),.9),i=n.parts.filter(C=>!C.sexOnly||C.sexOnly===n.sex),s=C=>C.mirror&&Math.abs(Math.sin(C.a))>.1?1.25:1,r=[],a=0,o=0,c=0,h=0,l=0,u=0,f=0,p=0,g=0,_=!1,m=!1,d=!1,y=!1,v=0;for(let C of i){let M=C.kind;of[M]&&r.push(of[M](C.p)*s(C)),(C.p.endType!==void 0||M.startsWith("leg_")||M.startsWith("arm_"))&&r.push(((T=Jx[C.p.endType])!=null?T:2)*s(C));let b=s(C)>1?2:1;M.startsWith("leg_")&&(a++,g+=b),M.startsWith("arm_")&&(p+=b),M==="tentacle"&&(p+=b,v+=b),M.startsWith("tail_")&&(_=!0),(M.startsWith("horn_")||M==="antler"||M==="tusk")&&(m=!0),["muzzle","beak","mandibles","maw","trunk","feelers","lips"].includes(M)&&(d=!0),["claw","talon","paw","pincer"].includes(C.p.endType)&&(y=!0),M==="feelers"&&(l+=1),M.startsWith("wing_")&&o++,M.startsWith("eye_")&&(c+=s(C)>1?2:1),M==="ridge_spikes"&&(h+=.12),M==="spike"&&(h+=.04),M==="tail_stinger"&&(l+=3),M==="mandibles"&&(l+=1),M==="shell"&&(u+=.15,f+=25),M==="ridge_plates"&&(u+=.08,f+=10)}r.sort((C,M)=>M-C);let x=7;r.forEach((C,M)=>{var b;x+=C*((b=Kx[M])!=null?b:M<10?.06:0)}),f=Math.min(f,60),l=Math.min(l,6),x*=.82+.42*t,u+=(A={scales:.08,chitin:.12,fur:.02+.05*n.look.furLen,slime:.02,skin:0}[n.look.cover])!=null?A:0;let P=a===0?.9:a===1?1:a===2?1.08:1.14;return o&&(P+=.12),P-=.3*(t-.45),u>.2&&(P-=.06),P=Pi(P,.6,1.5),{hp:Math.round(80+210*t+f*1.5),atk:Math.round(x*10)/10,def:Pi(u,0,.45),spd:Math.round(P*100)/100,dodge:Pi(.04+(P-1)*.2+(n.look.cover==="slime"?.05:0)+(o?.03:0),0,.3),crit:Pi(.04+.02*c,.04,.16),miss:c===0?.25:.04,thorns:Pi(h,0,.3),venom:l,wings:o>0,eyes:c,hands:Math.min(p,8),slots:Math.min(p,8)||1,abilitySlots:n.type==="humanoid"?3:2,legs:g,tail:_,horns:m,mouth:d,claws:y,tentacles:v,armoured:u>=.12,big:t>.56,small:t<.42,serpent:n.type==="serpent",type:n.type}}function lf(n){let e=[];return n.venom&&e.push("Venom"),n.thorns>0&&e.push("Spiny"),n.def>=.15&&e.push("Armoured"),n.wings&&e.push("Winged"),n.spd>=1.12&&e.push("Quick"),n.eyes===0?e.push("Blind"):n.crit>=.12&&e.push("Keen-eyed"),e}function cf(n,e=0){let t=n===9?1.3:1;return{hp:(zo.hp0+zo.hp1*n)*t*(1+.1*e),atk:(zo.atk0+zo.atk1*n)*(t>1?1.12:1)*(1+.07*e)}}var zo={hp0:.34,hp1:.093,atk0:.4,atk1:.086},jx=["hpP","atkP","atkF","spdP","crit","critD","dodge","def","pierce","lifesteal","thorns","regen","bleedC","poisonC","poisonD","burnC","stunC","stunDur","dbl","ramp","lowP","firstX","giantP","vsBleedP","perStatusCrit","perStatusDmg","critBleed","critCdr","execP","riposte","blockHeal","killHeal","killHp","secondWind","hemo","festerP","shieldP","opener","guardCdr","perWeaponSpd","perLegAtk","perEyeCrit","thornsBleed","dodgeCrit","weapons"];function Eh(n,e={}){let t={};for(let o of jx)t[o]=e.mods&&e.mods[o]||0;let i=e.mul||{hp:1,atk:1},s=e.boost||{hp:1,atk:1},r=Math.round(n.hp*(1+t.hpP)*i.hp*s.hp*(1+(e.bonusHp||0))),a=Pi(n.spd*(1+t.spdP+t.perWeaponSpd*t.weapons),.5,2.4);return{s:n,m:t,max:r,hp:r,shield:Math.round(r*t.shieldP),atk:(n.atk+t.atkF)*(1+t.atkP+t.perLegAtk*n.legs)*i.atk*s.atk,crit:n.crit+t.crit+t.perEyeCrit*n.eyes,dodge:Pi(n.dodge+t.dodge,0,.45),def:Pi(n.def+t.def,0,.6),thorns:n.thorns+t.thorns,poisonC:(n.venom?.35:0)+t.poisonC,poisonD:Math.max(n.venom,t.poisonC>0?2:0)+t.poisonD,every:1.75/a,t:.9+.5/a,power:!1,powerCd:2,guard:0,guardCd:0,guardEvery:Math.max(2.5,4.5-t.guardCdr),st:{bleed:0,bleedT:0,bleedD:1,poison:0,poisonD:0,burn:0,burnD:0,stun:0,immune:0,weak:0,slow:0,blind:0},buff:{evade:0,shell:0,frenzy:0},tick:0,fury:0,first:!0,wind:t.secondWind>0,nextCrit:!1,opened:!(t.opener>0),abil:(e.abilities||[]).map(o=>({id:o.id,lvl:Math.min(o.lvl,5),cd:3}))}}function Th(n){return n.powerCd>0||n.hp<=0?!1:(n.power=!0,n.powerCd=7,!0)}function Ah(n){return n.guardCd>0||n.hp<=0?!1:(n.guard=.9,n.guardCd=n.guardEvery,!0)}function Sh(n,e){if(n.shield>0){let t=Math.min(n.shield,e);n.shield-=t,e-=t}n.hp-=e}function ta(n,e){n.hp=Math.min(n.max,n.hp+e)}function Ho(n,e,t){n.st.bleed=Math.min(12,n.st.bleed+e),n.st.bleedT=5,n.st.bleedD=Math.max(1,t.atk*.08)*(1+t.m.festerP)}function wh(n,e){return n.st.immune>0?!1:(n.st.stun=e,n.st.immune=e+3,!0)}function Go(n,e,t,i){n[e+"D"]=n[e]>0?Math.max(n[e+"D"],i):i,n[e]=Math.max(n[e],t)}var Qx=n=>(n.st.bleed>0)+(n.st.poison>0)+(n.st.burn>0)+(n.st.stun>0);function Vo(n,e,t,i,s={}){let r=n[e],a=n[1-e],o=r.m,c=a.m,h={type:"hit",by:e,dmg:0,power:!!s.power,name:s.name};if(!s.sure&&i()<(r.s.miss+(r.st.blind>0?.6:0))*(s.power?.5:1))return h.miss=!0,h;if(!s.sure&&(a.buff.evade>0||i()<a.dodge))return c.dodgeCrit&&(a.nextCrit=!0),h.miss=!0,h;let l=Qx(a),u=r.atk*t*(.85+.3*i())*(1+Math.max(0,(n.time||0)-40)*.05),f=1+r.fury*o.ramp+(r.hp<r.max*.4?o.lowP:0)+(a.st.bleed>0?o.vsBleedP:0)+l*o.perStatusDmg+(a.max>r.max?o.giantP:0)+(a.hp<a.max*.3?o.execP:0);if(r.first&&s.name!=="Sling"&&(f+=o.firstX,r.first=!1),u*=f*(r.st.weak>0?.7:1)*(r.st.burn>0?.9:1),(r.nextCrit||i()<r.crit+l*o.perStatusCrit)&&(u*=1.8+o.critD,h.crit=!0,r.nextCrit=!1,o.critBleed&&Ho(a,o.critBleed,r),o.critCdr))for(let p of r.abil)p.cd=Math.max(0,p.cd-o.critCdr);return u*=(1-Math.max(0,a.def-o.pierce))*(a.buff.shell>0?.3:1),a.guard>0?(u*=.2,h.blocked=!0,a.guard=0,r.t+=.6,c.riposte&&(h.riposte=Math.max(1,Math.round(a.atk*c.riposte)),Sh(r,h.riposte)),c.blockHeal&&ta(a,a.max*c.blockHeal)):(a.thorns>0&&!s.ranged&&(h.thorns=Math.max(1,Math.round(u*a.thorns*(a.buff.shell>0?2:1))),Sh(r,h.thorns),c.thornsBleed&&Ho(r,1,a)),i()<o.bleedC&&(Ho(a,1,r),h.bleed=!0),i()<r.poisonC&&(Go(a.st,"poison",5,(r.poisonD+r.atk*.12)*(1+o.festerP)),h.venom=!0),i()<o.burnC&&(Go(a.st,"burn",3,Math.max(1,u*.14)*(1+o.festerP)),h.burn=!0),i()<o.stunC&&wh(a,.7*(1+o.stunDur))&&(h.stun=!0),o.lifesteal&&ta(r,u*o.lifesteal)),h.dmg=Math.max(1,Math.round(u)),Sh(a,h.dmg),r.fury++,h}function Rh(n,e,t,i,s){let r=n[e],a=n[1-e],o=r.abil[t];if(!o||o.cd>0||r.hp<=0||a.hp<=0||r.st.stun>0)return!1;let c=o.lvl,h=u=>s.push({type:"cast",by:e,name:u}),l=(u,f,p)=>{let g=Vo(n,e,u,i,{name:f,...p});return g.ability=!0,s.push(g),g};switch(o.id){case"pounce":{let u=l(1.4+.3*c,"Pounce");!u.miss&&!u.blocked&&wh(a,.8);break}case"roar":a.st.weak=4+c,h("Roar");break;case"lick":ta(r,r.max*(.11+.04*c)),s.push({type:"heal",on:e,name:"Lick Wounds"});break;case"spit":Go(a.st,"poison",6,(r.atk*(.22+.08*c)+r.m.poisonD)*(1+r.m.festerP)),h("Venom Spit");break;case"dive":r.buff.evade=1.5+.5*c,r.nextCrit=!0,h("Dive");break;case"constrict":{l(.8+.3*c,"Constrict",{sure:!0}).blocked||wh(a,(1.3+.3*c)*(1+r.m.stunDur));break}case"web":a.st.slow=4+c,h("Web");break;case"ink":a.st.blind=3+c,h("Ink Cloud");break;case"shellup":r.buff.shell=3+c,h("Shell Up");break;case"sweep":{l(1+.25*c,"Tail Sweep").miss||(a.t+=1.2);break}case"gore":{let u=l(1.2+.2*c,"Gore");!u.miss&&!u.blocked&&Ho(a,2+c,r);break}case"frenzy":r.buff.frenzy=4,r.frenzyX=1.5+.2*c,h("Frenzy");break;case"hurl":l(1.6+.3*c,"Hurl",{sure:!0,ranged:!0});break;case"rend":l(.6+(.35+.1*c)*a.st.bleed,"Rend");break;case"breath":{let u=l(.8+.2*c,"Fire Breath",{sure:!0,ranged:!0});Go(a.st,"burn",5,Math.max(2,u.dmg*.2)*(1+r.m.festerP));break}default:return!1}return o.cd=Ch[o.id]||10,!0}var Ch={pounce:9,roar:12,lick:14,spit:10,dive:11,constrict:12,web:12,ink:12,shellup:13,sweep:8,gore:10,frenzy:13,hurl:10,rend:9,breath:11};function Ph(n,e,t,i,s,r){let a=n[e],o=n[1-e];a.powerCd<=0&&i()<t*.6&&Th(a),a.guardCd<=0&&o.t<.3&&i()<t*8*s&&Ah(a);for(let c=0;c<a.abil.length;c++)a.abil[c].cd<=0&&i()<t*1.2&&!(a.abil[c].id==="lick"&&a.hp>a.max*.75)&&!(a.abil[c].id==="rend"&&o.st.bleed<2)&&Rh(n,e,c,i,r)}function hf(n,e,t,i){n.time=(n.time||0)+e;for(let s=0;s<2;s++){let r=n[s],a=n[1-s],o=r.st;if(r.hp<=0||a.hp<=0)continue;if(!r.opened){r.opened=!0;let h=Vo(n,s,r.m.opener,t,{sure:!0,ranged:!0,name:"Sling"});h.ability=!0,i.push(h)}r.powerCd=Math.max(0,r.powerCd-e),r.guardCd=Math.max(0,r.guardCd-e),r.guard=Math.max(0,r.guard-e);for(let h of r.abil)h.cd=Math.max(0,h.cd-e);for(let h of["stun","immune","weak","slow","blind","poison","burn"])o[h]=Math.max(0,o[h]-e);for(let h of["evade","shell","frenzy"])r.buff[h]=Math.max(0,r.buff[h]-e);if(o.bleed>0&&(o.bleedT-=e,o.bleedT<=0&&(o.bleed=0)),r.m.regen&&ta(r,r.max*r.m.regen*e),r.tick+=e,r.tick>=1){r.tick-=1;let h=0;o.bleed>0&&(h+=o.bleed*o.bleedD,a.m.hemo&&ta(a,a.m.hemo*o.bleed)),o.poison>0&&(h+=o.poisonD),o.burn>0&&(h+=o.burnD),h>0&&(h=Math.max(1,Math.round(h)),r.hp-=h,i.push({type:"dot",on:s,dmg:h,kind:o.burn>0?"burn":o.poison>0?"venom":"bleed"}))}if(o.stun>0||(r.t-=e*(r.buff.frenzy>0?r.frenzyX:1)*(o.slow>0?.5:1),r.t>0||r.hp<=0))continue;r.t=r.every*(.9+.2*t());let c=r.power;if(r.power=!1,i.push(Vo(n,s,c?2.1:1,t,{power:c})),a.hp>0&&r.hp>0&&t()<r.m.dbl){let h=Vo(n,s,.7,t,{});h.extra=!0,i.push(h)}}for(let s=0;s<2;s++){let r=n[s];r.hp<=0&&r.wind&&(r.wind=!1,r.hp=Math.max(1,Math.round(r.max*r.m.secondWind)),i.push({type:"heal",on:s,name:"Second Wind"}))}return n[0].hp<=0&&n[1].hp<=0&&(n[0].hp=1),n[1].hp<=0?0:n[0].hp<=0?1:-1}function uf(n,e){return 1e3+Math.round(500*Pi(n/e,0,1))}var Se=n=>Math.round(n*100)+"%",Vt=n=>(Math.round(n*10)/10).toString(),Un=(n,e,t,i,s,r,a,o=1,c)=>({id:n,name:e,icon:t,tags:i,cost:s,mods:r,text:a,hands:o,req:c,cat:"weapon"}),Xe=(n,e,t,i,s,r,a,o,c)=>({id:n,name:e,icon:t,tags:i,cost:s,mods:r,text:a,req:o,reqText:c,cat:"relic"}),hn=(n,e,t,i,s,r,a,o,c)=>({id:n,name:e,icon:t,tags:i,cost:s,cd:r,text:a,req:o,reqText:c,cat:"ability"}),Ms=[Un("club","Bone Club","\u{1F9B4}",["stun","fury"],0,n=>({atkF:3.5*n,stunC:.07*n}),n=>`+${Vt(3.5*n)} attack. ${Se(.07*n)} chance to stun.`),Un("cleaver","Notched Cleaver","\u{1FA93}",["bleed"],0,n=>({atkF:3*n,bleedC:.4*n}),n=>`+${Vt(3*n)} attack. ${Se(.4*n)} chance to cause bleeding.`),Un("fang","Fang Dagger","\u{1F5E1}\uFE0F",["poison","speed"],0,n=>({atkF:2*n,poisonC:.35*n,spdP:.06*n}),n=>`+${Vt(2*n)} attack, +${Se(.06*n)} speed. ${Se(.35*n)} chance to poison.`),Un("mace","Thorn Mace","\u{1F335}",["thorns"],0,n=>({atkF:2*n,thorns:.08*n}),n=>`+${Vt(2*n)} attack. Attackers take ${Se(.08*n)} of their damage back.`),Un("buckler","Spiked Buckler","\u{1F6E1}\uFE0F",["guard","thorns"],0,n=>({def:.05*n,riposte:.4*n,guardCdr:.5}),n=>`+${Se(.05*n)} armour. Guard recharges faster and a block hits back for ${Se(.4*n)} attack.`),Un("sling","Stone Sling","\u{1FAA8}",["crit"],0,n=>({opener:.9*n,crit:.06*n}),n=>`Opens each fight with a shot for ${Se(.9*n)} attack. +${Se(.06*n)} critical chance.`),Un("brand","Ember Brand","\u{1F525}",["burn"],250,n=>({atkF:2*n,burnC:.3*n}),n=>`+${Vt(2*n)} attack. ${Se(.3*n)} chance to set the enemy on fire.`),Un("pick","War Pick","\u26CF\uFE0F",["crit"],250,n=>({atkF:2.5*n,pierce:.2*n}),n=>`+${Vt(2.5*n)} attack. Ignores ${Se(.2*n)} armour.`),Un("hooks","Twin Hooks","\u{1FA9D}",["speed"],300,n=>({atkF:2*n,dbl:.15*n}),n=>`+${Vt(2*n)} attack. ${Se(.15*n)} chance to strike twice.`),Un("whip","Leech Whip","\u{1FA78}",["life"],350,n=>({atkF:1.5*n,lifesteal:.08*n}),n=>`+${Vt(1.5*n)} attack. Heals for ${Se(.08*n)} of damage dealt.`),Un("maul","Great Maul","\u{1F528}",["stun","fury"],400,n=>({atkF:7*n,spdP:-.1,stunC:.08*n}),n=>`Needs two hands. +${Vt(7*n)} attack, -10% speed. ${Se(.08*n)} chance to stun.`,2),Un("trident","Barbed Trident","\u{1F531}",["bleed","crit"],450,n=>({atkF:3.5*n,vsBleedP:.2*n,critD:.3*n,bleedC:.15*n}),n=>`+${Vt(3.5*n)} attack. ${Se(.15*n)} chance to cause bleeding, +${Se(.2*n)} damage to bleeding enemies, +${Se(.3*n)} critical damage.`),Xe("hide","Thick Hide","\u{1F418}",["life"],0,n=>({hpP:.12*n}),n=>`+${Se(.12*n)} health.`),Xe("tooth","Whetted Tooth","\u{1F9B7}",["fury"],0,n=>({atkP:.12*n}),n=>`+${Se(.12*n)} attack.`),Xe("blood","Quick Blood","\u{1F4A8}",["speed"],0,n=>({spdP:.1*n}),n=>`+${Se(.1*n)} speed.`),Xe("eye","Hunter's Eye","\u{1F441}\uFE0F",["crit"],0,n=>({crit:.12*n}),n=>`+${Se(.12*n)} critical chance.`),Xe("edge","Cruel Edge","\u2702\uFE0F",["crit"],0,n=>({critD:.5*n,crit:.03}),n=>`+${Se(.5*n)} critical damage and +3% critical chance.`),Xe("slick","Slick Skin","\u{1F4A7}",["speed"],0,n=>({dodge:.08*n}),n=>`+${Se(.08*n)} dodge.`),Xe("plate","Iron Scales","\u{1F529}",["guard"],0,n=>({def:.06*n}),n=>`+${Se(.06*n)} armour.`),Xe("jag","Jagged Claws","\u{1FA78}",["bleed"],0,n=>({bleedC:.3*n}),n=>`${Se(.3*n)} chance on hit to cause bleeding.`),Xe("rot","Rot Gland","\u2623\uFE0F",["poison"],0,n=>({poisonC:.3*n,poisonD:1.5*n}),n=>`${Se(.3*n)} chance on hit to poison. Poison is stronger.`),Xe("gut","Ember Gut","\u{1F30B}",["burn"],200,n=>({burnC:.2*n}),n=>`${Se(.2*n)} chance on hit to set the enemy on fire.`),Xe("scent","Blood Scent","\u{1F43A}",["bleed","fury"],0,n=>({vsBleedP:.3*n,bleedC:.1}),n=>`+${Se(.3*n)} damage to bleeding enemies, and 10% chance to cause bleeding.`),Xe("torment","Tormentor","\u{1F608}",["bleed","poison","burn"],400,n=>({perStatusDmg:.14*n}),n=>`+${Se(.14*n)} damage for each ailment on the enemy (bleed, poison, fire, stun).`),Xe("opp","Opportunist","\u{1F3AF}",["crit","bleed","poison","burn"],300,n=>({perStatusCrit:.12*n}),n=>`+${Se(.12*n)} critical chance for each ailment on the enemy.`),Xe("fester","Festering","\u{1F9A0}",["poison","burn","bleed"],0,n=>({festerP:.5*n}),n=>`Bleed, poison and fire deal ${Se(.5*n)} more.`),Xe("hemo","Hemophage","\u{1F987}",["bleed","life"],350,n=>({hemo:1.2*n}),n=>`Heal ${Vt(1.2*n)} for each bleed stack on the enemy, every second.`),Xe("mist","Red Mist","\u{1F32B}\uFE0F",["crit","bleed"],350,n=>({critBleed:Math.max(1,Math.round(n))}),n=>`Critical hits add ${Math.max(1,Math.round(n))} bleed.`),Xe("rhythm","Predator's Rhythm","\u23F1\uFE0F",["crit","ability"],0,n=>({critCdr:1*n,crit:.05}),n=>`+5% critical chance. Critical hits cut ability cooldowns by ${Vt(1*n)}s.`),Xe("finish","Finisher","\u{1F480}",["crit","fury"],0,n=>({execP:.4*n}),n=>`+${Se(.4*n)} damage to enemies below 30% health.`),Xe("flurry","Flurry","\u{1F300}",["speed"],0,n=>({dbl:.13*n}),n=>`${Se(.13*n)} chance to strike twice.`),Xe("moment","Momentum","\u{1F4C8}",["speed","fury"],0,n=>({ramp:.025*n}),n=>`Each hit you land adds +${Vt(2.5*n)}% damage for the rest of the fight.`),Xe("riposte","Riposte","\u{1F93A}",["guard"],0,n=>({riposte:.5*n}),n=>`A block hits back for ${Se(.5*n)} attack.`),Xe("bulwark","Bulwark","\u{1F9F1}",["guard","life"],0,n=>({blockHeal:.05*n}),n=>`A block heals ${Se(.05*n)} health.`),Xe("spite","Spite","\u{1F994}",["thorns"],0,n=>({thorns:.08*n}),n=>`Attackers take ${Se(.08*n)} of their damage back.`),Xe("barbs","Barbed Hide","\u{1FAA1}",["thorns","bleed"],300,n=>({thornsBleed:1,thorns:.04*n}),n=>`Attackers take ${Se(.04*n)} back and start bleeding.`),Xe("leech","Leech","\u{1FAB1}",["life"],0,n=>({lifesteal:.06*n}),n=>`Heal for ${Se(.06*n)} of damage dealt.`),Xe("trophy","Trophy Hunter","\u{1F3C6}",["life"],0,n=>({killHp:.04*n}),n=>`Each kill adds +${Se(.04*n)} health for the rest of the gauntlet.`),Xe("feast","Feast","\u{1F356}",["life"],0,n=>({killHeal:.12*n}),n=>`Each kill heals an extra ${Se(.12*n)} health.`),Xe("wind","Second Wind","\u{1F54A}\uFE0F",["life"],500,n=>({secondWind:.15*n}),n=>`Once per fight, survive a killing blow and heal ${Se(.15*n)}.`),Xe("breath","Deep Breath","\u{1F33F}",["life"],0,n=>({regen:.006*n}),n=>`Regain ${Vt(.6*n)}% health every second.`),Xe("shellr","Carapace","\u{1F95A}",["guard","life"],0,n=>({shieldP:.15*n}),n=>`Start each fight with a shield worth ${Se(.15*n)} health.`),Xe("corner","Cornered","\u{1F621}",["fury"],0,n=>({lowP:.3*n}),n=>`+${Se(.3*n)} damage while below 40% health.`),Xe("ambush","Ambush","\u{1F311}",["crit"],0,n=>({firstX:n}),n=>`Your first hit each fight deals +${Se(n)} damage.`),Xe("giant","Giant Slayer","\u{1FA93}",["fury"],250,n=>({giantP:.2*n}),n=>`+${Se(.2*n)} damage to enemies with more health than you.`),Xe("herd","Stampede","\u{1F9AC}",["fury"],0,n=>({perLegAtk:.03*n}),n=>`+${Se(.03*n)} attack for each leg.`,n=>n.legs>=4,"four or more legs"),Xe("eyes","Many Eyes","\u{1F577}\uFE0F",["crit"],0,n=>({perEyeCrit:.03*n}),n=>`+${Vt(3*n)}% critical chance for each eye.`,n=>n.eyes>=2,"two or more eyes"),Xe("ambi","Ambidextrous","\u{1F64C}",["speed","weapon"],0,n=>({perWeaponSpd:.06*n}),n=>`+${Se(.06*n)} speed for each weapon held.`,n=>n.hands>=2,"two or more hands"),Xe("updraft","Updraft","\u{1FABD}",["speed","crit"],0,n=>({dodge:.08*n,dodgeCrit:1}),n=>`+${Se(.08*n)} dodge. After a dodge, your next hit is critical.`,n=>n.wings,"wings"),Xe("heavy","Heavyweight","\u{1F5FF}",["guard","thorns"],0,n=>({def:.04*n,thorns:.05*n}),n=>`+${Se(.04*n)} armour, and attackers take ${Se(.05*n)} back.`,n=>n.big,"a large body"),Xe("feather","Featherweight","\u{1FAB6}",["speed"],0,n=>({spdP:.08*n,dodge:.04*n}),n=>`+${Se(.08*n)} speed and +${Se(.04*n)} dodge.`,n=>n.small,"a small body"),Xe("coil","Coiled","\u27B0",["stun"],0,n=>({stunC:.06*n,stunDur:.5}),n=>`${Se(.06*n)} chance to stun, and stuns last longer.`,n=>n.serpent||n.tentacles>=2,"a serpent body or tentacles"),Xe("virulent","Virulent","\u{1F9EB}",["poison"],0,n=>({poisonD:3*n,poisonC:.15}),n=>`Your poison deals ${Vt(3*n)} more each second, and lands more often.`,n=>n.venom,"a stinger, mandibles or feelers"),hn("pounce","Pounce","\u{1F43E}",["stun","fury"],0,9,n=>`Leap for ${Se(1.4+.3*n)} attack and stun briefly.`,n=>n.legs>=2,"legs"),hn("roar","Roar","\u{1F981}",["guard"],0,12,n=>`Weaken the enemy's attacks by 30% for ${4+n}s.`,n=>n.mouth,"a mouth"),hn("lick","Lick Wounds","\u{1F497}",["life"],0,14,n=>`Heal ${Se(.11+.04*n)} health.`),hn("spit","Venom Spit","\u{1F9EA}",["poison"],0,10,n=>`Poison the enemy for ${Se(.22+.08*n)} of your attack every second, for 6s.`,n=>n.venom,"a stinger, mandibles or feelers"),hn("dive","Dive","\u{1F985}",["crit","speed"],0,11,n=>`Dodge everything for ${Vt(1.5+.5*n)}s; your next hit is critical.`,n=>n.wings,"wings"),hn("constrict","Constrict","\u{1F40D}",["stun"],0,12,n=>`Squeeze for ${Se(.8+.3*n)} attack and stun for ${Vt(1.3+.3*n)}s.`,n=>n.serpent||n.tentacles>=2,"a serpent body or tentacles"),hn("web","Web","\u{1F578}\uFE0F",["speed","stun"],0,12,n=>`Slow the enemy's attacks by half for ${4+n}s.`,n=>n.type==="arachnid"||n.type==="insectoid","an arachnid or insectoid body"),hn("ink","Ink Cloud","\u{1F32B}\uFE0F",["speed"],0,12,n=>`Blind the enemy for ${3+n}s: most of its attacks miss.`,n=>n.type==="cephalopod"||n.type==="aquatic","a cephalopod or aquatic body"),hn("shellup","Shell Up","\u{1F422}",["guard","thorns"],0,13,n=>`Take 70% less damage for ${3+n}s and double what attackers take back.`,n=>n.armoured,"a shell, plates or tough hide"),hn("sweep","Tail Sweep","\u{1F98E}",["stun"],0,8,n=>`Hit for ${Se(1+.25*n)} attack and knock the enemy's next attack back.`,n=>n.tail,"a tail"),hn("gore","Gore","\u{1F402}",["bleed"],0,10,n=>`Hit for ${Se(1.2+.2*n)} attack and add ${2+n} bleed.`,n=>n.horns,"horns or tusks"),hn("frenzy","Frenzy","\u{1F624}",["speed","fury"],300,13,n=>`Attack ${Se(.5+.2*n)} faster for 4s.`),hn("hurl","Hurl Weapon","\u{1F3F9}",["weapon","crit"],300,10,n=>`Throw for ${Se(1.6+.3*n)} attack. Cannot miss.`,n=>n.hands>=1,"a hand"),hn("rend","Rend","\u{1F405}",["bleed"],350,9,n=>`Tear for ${Se(.6)} attack, plus ${Se(.35+.1*n)} for each bleed on the enemy.`,n=>n.claws,"claws, talons or paws"),hn("breath","Fire Breath","\u{1F432}",["burn"],400,11,n=>`Burn for ${Se(.8+.2*n)} attack and set the enemy alight for 5s.`,n=>n.mouth,"a mouth")],ev=Object.fromEntries(Ms.map(n=>[n.id+(n.cat==="ability"?"!":""),n])),$n=(n,e)=>ev[n+(e==="ability"?"!":"")],pf=["Common","Rare","Epic"],Lh=["humanoid","quadruped","avian"],pr={insectoid:400,arachnid:500,cephalopod:600,serpent:300,aquatic:300},ia={eye_glow:100,eye_stalk:100,eye_compound:100,mandibles:150,maw:150,trunk:150,tusk:150,horn_ram:200,antler:200,antenna_feather:80,ear_fin:80,arm_pincer:250,tentacle:300,leg_insect:150,wing_bat:300,wing_insect:200,tail_club:250,tail_stinger:300,ridge_sail:150,ridge_plates:200,shell:300},mf=[{id:"vital",name:"Vitality",icon:"\u2764\uFE0F",max:5,cost:n=>150+100*n,text:"+5% health for every creature, per level."},{id:"fero",name:"Ferocity",icon:"\u{1F4A2}",max:5,cost:n=>150+100*n,text:"+4% attack for every creature, per level."},{id:"recov",name:"Recovery",icon:"\u26FA",max:5,cost:n=>120+80*n,text:"+4% more health restored between fights, per level."},{id:"reroll",name:"Fickle Crowd",icon:"\u{1F3B2}",max:3,cost:n=>250+150*n,text:"+1 reroll of the rewards per gauntlet, per level."},{id:"stable",name:"Bigger Stable",icon:"\u26A1",max:2,cost:n=>600+400*n,text:"+1 to the most runs you can hold, per level."},{id:"head",name:"Head Start",icon:"\u{1F381}",max:1,cost:()=>800,text:"Choose a reward before the first fight."},{id:"revive",name:"Revive",icon:"\u2728",max:3,cost:()=>500,text:"Brings a dead creature back once, mid-gauntlet, at half health. Used up when spent. Hold up to three.",consumable:!0}],Dh=()=>({points:0,champions:0,fallen:0,unlocked:{},boosts:{},revives:0,runs:null,rank:0,rankSel:0,stats:{},seen:{},typesWon:{},goals:{},hall:[],daily:null}),tv=5,Ih=1800*1e3,nv=n=>tv+(n.boosts.stable||0);function $i(n,e=Date.now()){let t=nv(n);n.runs||(n.runs={n:t,t:e});let i=n.runs;for(i.t>e&&(i.t=e);i.n<t&&e-i.t>=Ih;)i.n++,i.t+=Ih;return i.n>=t&&(i.t=e),{n:i.n,max:t,next:i.n>=t?0:Ih-(e-i.t)}}function gf(n,e=Date.now()){let t=$i(n,e);return t.n<=0?!1:(t.n>=t.max&&(n.runs.t=e),n.runs.n--,!0)}function Wo(n,e=Date.now()){let t=$i(n,e);t.n<t.max&&n.runs.n++}var Xo=n=>{let e=Math.ceil(n/1e3);return Math.floor(e/60)+":"+String(e%60).padStart(2,"0")},Uh=(n,e)=>!!n.unlocked[e],Yo=(n,e)=>Lh.includes(e)||Uh(n,"type:"+e),Nh=(n,e)=>!ia[e]||Uh(n,"part:"+e),kh=(n,e)=>!e.cost||Uh(n,"item:"+e.cat+":"+e.id),_f=(n,e=0,t=!1)=>Math.round(15*(n+1)*(1+.25*e)*(t?1.5:1)),qo=()=>({weapons:[],relics:[],abilities:[]}),sa=n=>n.weapons.reduce((e,t)=>e+$n(t.id,"weapon").hands,0),iv=.65;function Fh(n,e){let t={},i=e&&e.hands===0?iv:1;for(let s of[...n.weapons,...n.relics]){let r=$n(s.id,s.cat||"x").mods(s.q);for(let a in r)t[a]=(t[a]||0)+r[a]*(s.cat==="weapon"&&r[a]>0?i:1)}return t.weapons=n.weapons.length,t}function sv(n){let e={};for(let t of[...n.weapons,...n.relics,...n.abilities])for(let i of $n(t.id,t.cat).tags)e[i]=(e[i]||0)+1;return e}function yf(n,e,t){return n.req&&!n.req(e)?!1:n.cat==="weapon"?e.slots-sa(t)>=n.hands:n.cat==="ability"?t.abilities.some(i=>i.id===n.id)||t.abilities.length<e.abilitySlots:!0}function xf(n,e,t,i,s,r=3){let a=sv(t),o=[],c=new Set,h=Ms.filter(f=>(!i||kh(i,f))&&yf(f,e,t)),u={weapon:e.slots-sa(t)>=2?.45:.32,relic:.42,ability:.26};for(let f=0;f<r;f++){let p=h.filter(x=>!c.has(x.cat+x.id));if(!p.length)break;let g=p.map(x=>{let P=0;for(let A of x.tags)P+=Math.min(a[A]||0,3);let T=x.cat==="ability"&&t.abilities.some(A=>A.id===x.id);return u[x.cat]/Math.max(1,p.filter(A=>A.cat===x.cat).length)*(1+.9*Math.min(P,5))*(T?1.5:1)}),_=n()*g.reduce((x,P)=>x+P,0),m=0;for(;m<g.length-1&&(_-=g[m])>0;)m++;let d=p[m];c.add(d.cat+d.id);let y=n(),v=y<.05+.015*s?2:y<.28+.035*s?1:0;o.push({id:d.id,cat:d.cat,rar:v,q:Math.round([1,1.5,2.2][v]*(.9+.2*n())*100)/100,syn:d.tags.some(x=>a[x])})}return o}var rv=5;function vf(n,e){if(e.cat==="weapon")n.weapons.push({id:e.id,cat:"weapon",q:e.q,rar:e.rar});else if(e.cat==="relic")n.relics.push({id:e.id,cat:"relic",q:e.q,rar:e.rar});else{let t=n.abilities.find(i=>i.id===e.id);t?t.lvl=Math.min(rv,t.lvl+1+(e.rar>0?1:0)):n.abilities.push({id:e.id,cat:"ability",lvl:1+e.rar})}}function Zo(n){var t;let e=$n(n.id,n.cat);return n.cat!=="ability"?e.text(n.q):e.text((t=n.lvl)!=null?t:1+n.rar)+` Recharges in ${e.cd}s.`}function bf(n,e,t){let i=qo(),s=.75+.04*t,r=Ms.filter(o=>o.cat==="relic"&&yf(o,e,i)),a=Ms.filter(o=>o.cat==="weapon");for(let o=0;o<Math.floor(t*.75);o++)i.relics.push({id:r[Math.floor(n()*r.length)].id,cat:"relic",q:s,rar:0});for(let o=0;o<Math.min(e.slots,Math.floor((t+1)/3));o++){let c=a[Math.floor(n()*a.length)];e.slots-sa(i)>=c.hands&&i.weapons.push({id:c.id,cat:"weapon",q:s,rar:0})}return i}var $o=10,Oh=n=>1+.25*n,df=[{id:"enraged",name:"Enraged",mods:{atkP:.25}},{id:"armoured",name:"Iron-hided",mods:{def:.15}},{id:"swift",name:"Swift",mods:{spdP:.2,dodge:.05}},{id:"giant",name:"Giant",mods:{hpP:.35}},{id:"venomous",name:"Venomous",mods:{poisonC:.4,poisonD:2}},{id:"thorny",name:"Thorned",mods:{thorns:.15}}];function Mf(n,e){return e>=2&&e<9&&n()<.28?df[Math.floor(n()*df.length)]:null}var ff=n=>{let e=new Date(n);return e.getFullYear()+"-"+(e.getMonth()+1)+"-"+e.getDate()};function Bh(n,e=Date.now()){let t=ff(e),i=n.daily||{day:"",streak:0};if(i.day===t)return null;let s=i.day===ff(e-864e5)?i.streak+1:1;return{today:t,streak:s,points:40+20*Math.min(s-1,6),revive:s%7===0}}function Sf(n,e=Date.now()){let t=Bh(n,e);return t?(n.points+=t.points,t.revive&&(n.revives=Math.min(3,(n.revives||0)+1)),n.daily={day:t.today,streak:t.streak},t):null}var Nn=(n,e)=>n.stats&&n.stats[e]||0,na=n=>Object.keys(n||{}).length,zh=[{id:"first",name:"First blood",text:"Win a fight.",pts:50,prog:n=>[Nn(n,"fightsWon"),1]},{id:"glad",name:"Gladiator",text:"Win 25 fights.",pts:150,prog:n=>[Nn(n,"fightsWon"),25]},{id:"vet",name:"Veteran",text:"Win 100 fights.",pts:400,prog:n=>[Nn(n,"fightsWon"),100]},{id:"legend",name:"Legend of the sands",text:"Win 500 fights.",pts:1500,prog:n=>[Nn(n,"fightsWon"),500]},{id:"half",name:"Crowd favourite",text:"Reach the sixth fight of a gauntlet.",pts:100,prog:n=>[Nn(n,"bestFight"),6]},{id:"champ",name:"Champion",text:"Win the title.",pts:300,prog:n=>[n.champions||0,1]},{id:"champ3",name:"Dynasty",text:"Win the title three times.",pts:600,prog:n=>[n.champions||0,3]},{id:"types3",name:"Many shapes",text:"Win the title with three different body types.",pts:600,prog:n=>[na(n.typesWon),3]},{id:"types8",name:"Master breeder",text:"Win the title with all eight body types.",pts:2e3,prog:n=>[na(n.typesWon),8]},{id:"rank3",name:"Rising star",text:"Win the title at Rank 3.",pts:500,prog:n=>[Nn(n,"bestRankWon"),3]},{id:"rank6",name:"Terror of the pits",text:"Win the title at Rank 6.",pts:1200,prog:n=>[Nn(n,"bestRankWon"),6]},{id:"rank10",name:"Undying",text:"Win the title at Rank 10.",pts:3e3,prog:n=>[Nn(n,"bestRankWon"),10]},{id:"elite",name:"Giant killer",text:"Defeat 10 elite opponents.",pts:250,prog:n=>[Nn(n,"elites"),10]},{id:"armed",name:"Armed to the teeth",text:"Hold four weapons at once.",pts:200,prog:n=>[Nn(n,"mostWeapons"),4]},{id:"seen20",name:"Collector",text:"Pick 20 different rewards.",pts:150,prog:n=>[na(n.seen),20]},{id:"seen45",name:"Curator",text:"Pick 45 different rewards.",pts:500,prog:n=>[na(n.seen),45]},{id:"flawless",name:"Untouchable",text:"Win a fight without losing any health.",pts:100,prog:n=>[Nn(n,"flawless"),1]},{id:"close",name:"By a whisker",text:"Win a fight with less than a tenth of your health left.",pts:100,prog:n=>[Nn(n,"closeCalls"),1]},{id:"mourn",name:"Graveyard",text:"Lose five creatures. It happens.",pts:100,prog:n=>[n.fallen||0,5]},{id:"streak7",name:"Regular",text:"Collect the daily gift seven days running.",pts:300,prog:n=>[n.daily&&n.daily.streak||0,7]},{id:"shop10",name:"Big spender",text:"Unlock ten things in the shop.",pts:150,prog:n=>[na(n.unlocked),10]}],Jo=(n,e)=>{let[t,i]=e.prog(n);return t>=i},wf=n=>zh.filter(e=>Jo(n,e)&&!(n.goals&&n.goals[e.id])).length;var av=["eye_round","eye_cat","eye_goat","eye_glow","eye_beady","eye_compound","eye_stalk"],ov=["muzzle","beak","mandibles","maw","feelers","muzzle"],lv=["horn_spike","horn_curved","horn_ram","antler","antenna","antenna_feather","crest"],cv=["tail_thin","tail_thick","tail_fluffy","tail_tuft","tail_club","tail_stinger","tail_fan"],hv=["ridge_spikes","ridge_plates","ridge_sail","ridge_mane","shell"],uv=["ear_point","ear_round","ear_long","ear_floppy","ear_fin"],dv=["wing_feather","wing_bat","wing_insect"],fv=["human","paw","hoof","talon","webbed","stump","point"],pv=["human","claw","pincer","mitt"],mv=["skin","fur","scales","chitin","slime"],gv=["Vor","Gra","Zul","Kra","Thu","Mog","Sha","Bru","Nyx","Ora","Ska","Dre","Hul","Fen","Ryz","Um","Qua","Ix","Bel","Tar"],_v=["gath","nak","tor","ra","lix","mok","thos","zar","dun","ska","bor","vex","gul","ris","nor","ix"],yv=["the Cruel","the Hungry","Bonebreaker","the Unblinking","of the Pit","the Swift","Skullsplitter","the Patient","the Loud","Twice-Bitten","the Scarred","Sandstrider","the Vile","Crowd-Pleaser","the Last"];function xv(n,e){let t=i=>i[Math.floor(n()*i.length)];return t(gv)+t(_v)+(e?" "+t(yv):"")}function ra(n,e={}){let t=_=>_[Math.floor(n()*_.length)],i=(_,m)=>_+(m-_)*n(),s=(_,m,d)=>"#"+new Ue().setHSL((_%1+1)%1,m,d).getHexString(),r=e.type||t(Object.keys(Tt)),a=bs(r);a.name=xv(n,e.titled),a.sex=n()<.5?"m":"f",a.bulk=i(.82,1.3),a.dimorph=i(.4,1.2);for(let _ of a.nodes){let m=_.role==="neck"||_.role==="waist"?i(.9,1.15):i(.82,1.28);_.rx*=m,_.ry*=m*i(.92,1.08)}let o=n(),c=a.look;Object.assign(c,{base:s(o,i(.25,.8),i(.25,.62)),second:s(o+i(-.25,.25),i(.35,.8),i(.1,.4)),belly:s(o+.04,i(.15,.4),i(.7,.88)),hair:s(o+i(0,.5),.5,i(.15,.5)),membrane:s(o+i(-.1,.1),.45,i(.45,.7)),eye:s(n(),.8,.47),accent:n()<.7?s(.11,.3,i(.75,.9)):s(o,.2,.12),pattern:Math.floor(n()*8),patScale:i(.7,2),bellyAmt:i(.3,.9)}),n()<.5&&(c.cover=t(mv),c.furLen=i(.1,.55),c.furDroop=i(.1,.7));let h=(_,m)=>{let d=Pt[_.kind],y=Pt[m];d.size&&y.size&&(_.size*=y.size/d.size),_.kind=m,_.p=Fo(m)},l=Oo(a,{sexless:!0}).userData.frames,u=_=>a.parts.some(m=>Pt[m.kind].cat===_),f=t(av),p=t(ov);for(let _ of a.parts){let m=Pt[_.kind];m.cat==="eyes"&&n()<.55?h(_,f):m.cat==="mouth"&&m.slot==="mouth"&&n()<.55?h(_,p):m.cat==="limbs"&&_.p.endType!==void 0&&(n()<.4&&(_.p.endType=t(_.kind.startsWith("arm")?pv:fv)),_.p.thick*=i(.85,1.35),_.p.muscle=i(.9,1.35))}u("mouth")||hi(a,p,l);let g=(_,m,d)=>{if(n()<_&&!(d&&u(d)))return hi(a,t(m),l)};g(.5,lv),g(.45,cv,"tails"),g(.45,hv,"back"),g(.2,dv,"wings"),g(.3,uv,"ears"),n()<.2&&hi(a,"tusk",l),n()<.15&&hi(a,"spike",l);for(let _ of a.parts){let m=Pt[_.kind];if(_.size*=i(.88,1.2),!(m.cat==="limbs"||m.cat==="eyes"))for(let[d,y]of Object.entries(m.P||{}))["count","feathers","tines","lift","sweep","span"].includes(d)||(_.p[d]=_.p[d]+(i(y[0],y[1])-_.p[d])*.3)}return a}var Rf=["z","y","x","pitch","yaw","roll","sy","gait","legF","legH","legOut","armAll","arm","armOut","tent","wing","flap","tailYaw","tailUp","wag"],Hh=()=>{let n={};for(let e of Rf)n[e]=0;return n.sy=1,n.wag=1,n},Ef=n=>n*n*(3-2*n),vv=n=>1-(1-n)*(1-n)*(1-n),Tf=n=>Math.min(1,Math.max(0,n)),Af={lunge:{wind:{z:-.3,pitch:-.16,legF:.25,sy:.94},hit:{z:.9,pitch:.22,legF:-.6,legH:.35,tailUp:.3}},bite:{wind:{z:-.3,pitch:-.22,legF:.25,tailUp:.2},hit:{z:.95,pitch:.3,legF:-.55,legH:.35,tailUp:.4}},slash:{wind:{z:-.12,pitch:-.2,arm:-2.8,yaw:-.35,legF:.2},hit:{z:.7,pitch:.2,arm:-.45,yaw:.4,legH:.3}},swipe:{wind:{pitch:-.5,y:.12,legF:-1.3,z:-.1,tailUp:-.2},hit:{z:.65,pitch:.2,legF:-.15,legH:.35}},charge:{wind:{z:-.65,pitch:.14,legF:.35,legH:-.25,sy:.92},hit:{z:1.2,pitch:.3,legF:-.5,legH:.5},run:!0},swoop:{wind:{y:1.15,z:-.35,pitch:-.3,flap:1,wing:.35,legF:-.4,legH:-.4},hit:{y:.05,z:1,pitch:.45,wing:.6,legF:-.9,legH:-.5}},lash:{wind:{z:-.15,tent:.55,pitch:-.12,sy:1.06},hit:{z:.6,tent:-1.35,pitch:.14,sy:.95}},tail:{wind:{yaw:-.7,tailYaw:.6,z:-.1,sy:.95},hit:{yaw:Math.PI*2,tailYaw:-.5,z:.55,tailUp:.25},spin:!0},sting:{wind:{pitch:.12,tailUp:.5,z:-.15,sy:.95},hit:{pitch:.3,tailUp:1.5,z:.7}},pounce:{wind:{z:-.45,pitch:-.32,sy:.82,legF:.3,legH:-.3},hit:{z:1.05,pitch:.32,legF:-.9,legH:.6},arc:.95,slow:!0},roar:{wind:{pitch:-.4,wing:.7,armAll:-1.2,armOut:.6,tailUp:.4,sy:1.06},hit:{pitch:-.2,wing:.9,armAll:-1.6,armOut:.9,z:.15,sy:1.1}}};function Cf(n){let e=[],t=new We().makeScale(-1,1,1),i=n.frames.C,s=(i[0].z+i[i.length-1].z)/2,r=0;n.group.traverse(o=>{let c=o.userData.joint;c&&(o.matrixAutoUpdate=!1,e.push({node:o,...c,front:c.pivot.z>=s-.02,ph:e.length*2.399%6.283,idx:c.kind==="arm"?r++:0,a:new mn,q:new qt}))});let a=new Set(e.map(o=>o.kind));return{cr:n,joints:e,S:t,kinds:a,arms:r,cur:Hh(),t:0,gaitPh:0,flapPh:0,tmp:new We,tmp2:new We}}function Vh(n,e,t,i){var l,u;let s=Af[n]||Af.lunge,r={},a=i?1.3:1,o=s.slow?.2:.11,c=.55,h=new Set([...Object.keys(s.wind),...Object.keys(s.hit)]);for(let f of h){let p=f==="sy"?1:0,g=(l=s.wind[f])!=null?l:p,_=(u=s.hit[f])!=null?u:p,m;if(t<0)m=p+(g-p)*Ef(Tf(e));else if(t<o)m=g+(_-g)*vv(t/o);else{let d=Ef(Tf((t-o)/(c-o)));m=_+((s.spin&&f==="yaw"?_:p)-_)*d}r[f]=p+(m-p)*(f==="yaw"||f==="arm"||f==="sy"?1:a)}return s.arc&&t>=0&&t<o&&(r.y=(r.y||0)+Math.sin(t/o*Math.PI)*s.arc),s.run&&t>=0&&t<o+.1&&(r.gait=1.5),r}var Pf=.55;function If(n,e,t,i,s){var l;let r=n.cur,a=s?1:Math.min(1,t*26);for(let u of Rf)r[u]+=(((l=e[u])!=null?l:u==="sy"||u==="wag"?1:0)-r[u])*(u==="yaw"&&Math.abs((e.yaw||0)-r.yaw)>3?1:a);n.t+=t,n.gaitPh+=t*(7+5*Math.min(r.gait,1.5)),n.flapPh+=t*(5+16*Math.min(Math.abs(r.flap),1));let o=Math.abs(Math.sin(r.pitch))*(n.len||0)*.42;i.position.set(r.x,r.y+o,r.z-(n.len||0)/2),i.rotation.set(r.pitch,r.yaw,r.roll),i.scale.set(1+(1-r.sy)*.5,r.sy,1+(1-r.sy)*.5);let c=n.t,h=n.cr.M.U.uPM.value;for(let u of n.joints){let f=0,p=0,g=0,_=u.side>0?0:Math.PI;u.kind==="leg"?(f=r.gait*.55*Math.sin(n.gaitPh+_+(u.front?0:Math.PI))+(u.front?r.legF:r.legH),g=r.legOut):u.kind==="arm"?(f=r.armAll+(u.idx===n.armSel||n.armSel<0?r.arm:r.arm*.25)+.07*Math.sin(c*1.6+u.ph)-r.gait*.4*Math.sin(n.gaitPh+_),g=r.armOut+.03*Math.sin(c*1.3+u.ph)):u.kind==="tentacle"?(f=r.tent*(.55+.45*Math.sin(u.ph*3))+.13*Math.sin(c*1.7+u.ph)+r.gait*.3*Math.sin(n.gaitPh+u.ph),g=.1*Math.sin(c*1.3+u.ph*2)+r.legOut*.6):u.kind==="wing"?(g=r.wing+(.07+.6*r.flap)*Math.sin(n.flapPh),f=.04*Math.sin(c*1.1)):(p=r.tailYaw+.2*r.wag*Math.sin(c*2.4+u.ph),f=r.tailUp+.05*Math.sin(c*1.9)),u.a.set(f,p,g),u.q.setFromEuler(u.a);let m=u.pivot;u.node.matrix.makeRotationFromQuaternion(u.q);let d=u.node.matrix.elements,y=m.x,v=m.y,x=m.z;d[12]=y-(d[0]*y+d[4]*v+d[8]*x),d[13]=v-(d[1]*y+d[5]*v+d[9]*x),d[14]=x-(d[2]*y+d[6]*v+d[10]*x),u.node.matrixWorldNeedsUpdate=!0,u.bone&&(u.side>0?h[u.bone].copy(u.node.matrix):h[u.bone].copy(n.S).multiply(u.node.matrix).multiply(n.S))}}function Gh(n){for(let e of n.U.uPM.value)e.identity()}function Lf(n,e){let t=new ct,i=new Float32Array(e*3),s=new Float32Array(e*4),r=new Float32Array(e);t.setAttribute("position",new xt(i,3)),t.setAttribute("col",new xt(s,4)),t.setAttribute("size",new xt(r,1));let a=new Ln({transparent:!0,depthWrite:!1,blending:n,uniforms:{uScale:{value:400}},vertexShader:`attribute vec4 col; attribute float size; varying vec4 vCol; uniform float uScale;
void main(){ vCol = col; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying vec4 vCol;
void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; float a = smoothstep(1.0, 0.35, d) * vCol.a; if (a < 0.01) discard; gl_FragColor = vec4(vCol.rgb, a); }`}),o=new po(t,a);return o.frustumCulled=!1,o.renderOrder=5,{pts:o,pos:i,col:s,size:r,cap:e,parts:[],geo:t,mat:a}}function Uf(n){let e=Lf(Fr,500),t=Lf(Gi,400);n.add(e.pts,t.pts);let i=[],s=new _o(.85,1,40),r=new Ue;return{burst(o,c,h,l={}){var p,g,_,m;let u=Df[o]||Df.spark,f=u.add?e:t;for(let d=0;d<h;d++){f.parts.length>=f.cap&&f.parts.shift();let y=Math.random()*6.283,v=Math.random(),x=u.speed*(.4+Math.random()*.8)*(l.speed||1),P=l.dir||null;r.set(u.colors[Math.floor(Math.random()*u.colors.length)]),f.parts.push({x:c.x+(Math.random()-.5)*((p=l.spread)!=null?p:u.spread),y:c.y+(Math.random()-.5)*((g=l.spread)!=null?g:u.spread),z:c.z+(Math.random()-.5)*((_=l.spread)!=null?_:u.spread),vx:Math.cos(y)*x*(1-v*.5)+(P?P.x*x*1.5:0),vy:(v*u.up+(Math.random()-.3)*.5)*x+(P?P.y*x:0),vz:Math.sin(y)*x*(1-v*.5)+(P?P.z*x*1.5:0),g:u.grav,drag:u.drag,life:0,max:u.life*(.6+Math.random()*.7),s:u.size*(.6+Math.random()*.8)*(l.size||1),grow:u.grow||0,r:r.r,gr:r.g,b:r.b,a:(m=u.alpha)!=null?m:1})}},ring(o,c,h=1.6,l=!0){let u=new ke(s,new Bt({color:c,transparent:!0,depthWrite:!1,side:Ct,blending:Fr}));u.position.copy(o),l&&(u.rotation.x=-Math.PI/2),u.userData={t:0,size:h},n.add(u),i.push(u)},update(o){for(let c of[e,t]){let h=c.parts,l=0;for(let u=0;u<h.length;u++){let f=h[u];if(f.life+=o,f.life>=f.max)continue;f.vy-=f.g*o;let p=Math.max(0,1-f.drag*o);f.vx*=p,f.vy*=p,f.vz*=p,f.x+=f.vx*o,f.y+=f.vy*o,f.z+=f.vz*o,f.y<.02&&f.g>0&&(f.y=.02,f.vy*=-.3,f.vx*=.6,f.vz*=.6);let g=f.life/f.max;c.pos[l*3]=f.x,c.pos[l*3+1]=f.y,c.pos[l*3+2]=f.z,c.col[l*4]=f.r,c.col[l*4+1]=f.gr,c.col[l*4+2]=f.b,c.col[l*4+3]=f.a*(1-g*g),c.size[l]=f.s*(1+f.grow*g),h[l++]=f}h.length=l,c.geo.setDrawRange(0,l),c.geo.attributes.position.needsUpdate=c.geo.attributes.col.needsUpdate=c.geo.attributes.size.needsUpdate=!0}for(let c=i.length-1;c>=0;c--){let h=i[c];h.userData.t+=o;let l=h.userData.t/.45;if(l>=1){n.remove(h),h.material.dispose(),i.splice(c,1);continue}h.scale.setScalar(.2+h.userData.size*(1-(1-l)*(1-l))),h.material.opacity=(1-l)*.8}},resize(o){e.mat.uniforms.uScale.value=t.mat.uniforms.uScale.value=o*.9},clear(){e.parts.length=t.parts.length=0;for(let o of i)n.remove(o),o.material.dispose();i.length=0}}}var Df={spark:{add:!0,colors:["#fff2a0","#ffd060","#ffffff"],speed:4.5,up:.8,grav:9,drag:1.5,life:.45,size:.09,spread:.1},dust:{colors:["#d9bb84","#c9a56a","#e9d2a4"],speed:1.3,up:.6,grav:-.3,drag:2.5,life:.9,size:.3,spread:.3,grow:1.6,alpha:.5},blood:{colors:["#b01818","#d83030","#7a0c0c"],speed:2.6,up:.9,grav:9,drag:.6,life:.7,size:.085,spread:.12},venom:{colors:["#8fe04a","#5ab82a","#c8ff7a"],speed:.9,up:1.4,grav:-1.2,drag:1.5,life:.9,size:.1,spread:.5,alpha:.85},fire:{add:!0,colors:["#ff8a20","#ffc040","#ff4a10"],speed:.8,up:2,grav:-3,drag:1.2,life:.55,size:.2,spread:.5,grow:-.6},heal:{add:!0,colors:["#7affb0","#c8ffd8","#40e090"],speed:.6,up:2.2,grav:-2,drag:1,life:.9,size:.11,spread:.8},star:{add:!0,colors:["#fff07a","#ffffff"],speed:1.6,up:.5,grav:0,drag:2,life:.6,size:.12,spread:.3},magic:{add:!0,colors:["#c89aff","#8a5aff","#ffffff"],speed:2.2,up:.8,grav:0,drag:2.5,life:.6,size:.13,spread:.3},ink:{colors:["#14101c","#2a2438","#0a0810"],speed:1.4,up:.5,grav:-.2,drag:2,life:1.5,size:.5,spread:.6,grow:1.2,alpha:.75},web:{colors:["#ffffff","#e8eef2"],speed:2.4,up:.3,grav:1,drag:3,life:1.1,size:.07,spread:.7},shield:{add:!0,colors:["#7fd0ff","#ffffff","#4aa0ff"],speed:2.5,up:.4,grav:0,drag:3,life:.35,size:.12,spread:.5}};var gr=(n,e,t)=>Math.min(t,Math.max(e,n));function Wh(n,e,t){let i=document.createElement("canvas");i.width=n,i.height=e,t(i.getContext("2d"),n,e);let s=new oi(i);return s.colorSpace=Ot,s}function Mv(){let n=new Et,e=12,t=Wh(256,256,(m,d,y)=>{m.fillStyle="#d2a45c",m.fillRect(0,0,d,y);for(let x=0;x<5e3;x++)m.fillStyle=`rgba(${Math.random()<.5?"90,60,30":"255,235,190"},${Math.random()*.12})`,m.fillRect(Math.random()*d,Math.random()*y,1+Math.random()*3,1+Math.random()*2);let v=m.createRadialGradient(d/2,y/2,d*.1,d/2,y/2,d/2);v.addColorStop(0,"rgba(255,240,200,0.25)"),v.addColorStop(1,"rgba(60,35,15,0.45)"),m.fillStyle=v,m.fillRect(0,0,d,y)}),i=new ke(new tr(e,64),new Ut({map:t,roughness:1}));i.rotation.x=-Math.PI/2,i.receiveShadow=!0,n.add(i);let s=new Ut({color:9402204,roughness:.95,side:Ct}),r=new Ut({color:7167308,roughness:1,side:Ct}),a=[new Te(e,0),new Te(e,1.5)];for(let m=0;m<6;m++)a.push(new Te(e+.5+m*1.15,1.5+m*.8),new Te(e+.5+(m+1)*1.15,1.5+m*.8),new Te(e+.5+(m+1)*1.15,1.5+(m+1)*.8));a.push(new Te(e+8,8.5)),n.add(new ke(new mo(a,72),s));let o=new ke(new gn(e,.14,6,72),r);o.rotation.x=Math.PI/2,o.position.y=1.5,n.add(o);let c=900,h=new Wr(new an(.2,6,5),new Ut({roughness:.9}),c),l=new We,u=new Ue,f=[];for(let m=0;m<c;m++){let d=Math.floor(Math.random()*6),y=Math.random()*Math.PI*2,v=e+1.05+d*1.15+(Math.random()-.5)*.4;f.push({x:Math.cos(y)*v,y:1.5+d*.8+.3,z:Math.sin(y)*v,ph:Math.random()*6.28}),h.setColorAt(m,u.setHSL(Math.random(),.3+Math.random()*.5,.25+Math.random()*.35))}n.add(h);for(let m=0;m<24;m++){let d=m/24*Math.PI*2,y=e+7.7,v=new ke(new qn(.3,.36,3.4,10),s);v.position.set(Math.cos(d)*y,8.2,Math.sin(d)*y),n.add(v)}let p=new ke(new gn(e+7.7,.32,6,72),s);p.rotation.x=Math.PI/2,p.position.y=10,n.add(p);let g=new Ut({color:2759698,roughness:1});for(let m of[-1,1]){let d=new ke(new Ti(1.6,1.25),g);d.position.set(m*(e-.02),.62,0),d.rotation.y=-m*Math.PI/2,n.add(d)}for(let m=0;m<10;m++){let d=m/10*Math.PI*2+.3,y=new ke(new Ti(.7,1),new Ut({color:m%2?10099740:14262304,roughness:.8,side:Ct}));y.position.set(Math.cos(d)*(e-.03),.9,Math.sin(d)*(e-.03)),y.lookAt(0,.9,0),n.add(y)}let _=Wh(4,256,m=>{let d=m.createLinearGradient(0,0,0,256);d.addColorStop(0,"#2f5fa8"),d.addColorStop(.45,"#7fa6d0"),d.addColorStop(1,"#e9c79a"),m.fillStyle=d,m.fillRect(0,0,4,256)});return{g:n,crowd:h,seats:f,m4:l,sky:_}}function Sv(n){let e=new Et,t=(c,h=.5,l)=>new Ut({color:c,roughness:h,metalness:c===10134701?.7:0,emissive:l||0}),i=(c,h,l,u,f,p)=>{let g=new ke(c,h);return g.position.set(l||0,u||0,f||0),p&&(g.rotation.z=p),e.add(g),g},s=t(7031342,.8),r=t(10134701,.35),a=t(15261900,.6),o=(c=1)=>i(new qn(.035,.045,c,8),s,0,c/2);if(n==="club")i(new qn(.13,.04,1,10),a,0,.5),i(new an(.14,10,8),a,0,1);else if(n==="cleaver")o(.6),i(new Yn(.34,.5,.03),r,.14,.78);else if(n==="fang")o(.3),i(new Ai(.07,.6,8),a,0,.6);else if(n==="mace"){o(.85),i(new go(.17,0),r,0,.95);for(let c=0;c<6;c++)i(new Ai(.04,.16,5),r,Math.cos(c)*.2,.95+Math.sin(c*2)*.12,Math.sin(c)*.2,-Math.cos(c)*1.57)}else if(n==="buckler"){let c=i(new qn(.42,.42,.06,20),r,0,.3,.1);c.rotation.x=Math.PI/2;let h=i(new Ai(.08,.25,8),a,0,.3,.25);h.rotation.x=Math.PI/2}else if(n==="sling")i(new gn(.2,.02,5,14),s,0,.3),i(new an(.09,8,6),t(9079430,.9),0,.1);else if(n==="brand")o(.8),i(new Ai(.13,.42,8),t(16747040,.4,16734720),0,1);else if(n==="pick"){o(.95);let c=i(new Ai(.06,.6,6),r,0,.9);c.rotation.z=Math.PI/2}else if(n==="hooks")o(.6),i(new gn(.16,.03,6,12,Math.PI*1.2),r,.16,.62);else if(n==="whip")o(.3),i(new gn(.3,.022,5,16,Math.PI*1.4),t(8002588,.7),.3,.35);else if(n==="maul")i(new qn(.045,.055,1.4,8),s,0,.7),i(new Yn(.5,.32,.32),r,0,1.4);else{o(1.2);for(let c of[-.13,0,.13])i(new Ai(.035,.4,6),r,c,1.35-Math.abs(c)*.6);i(new Yn(.3,.04,.04),r,0,1.15)}return e}var _r=null;function yn(n){try{_r=_r||new(window.AudioContext||window.webkitAudioContext);let e=_r.currentTime,t=_r.createOscillator(),i=_r.createGain(),[s,r,a,o,c]={hit:[150,50,.14,"triangle",.5],power:[220,40,.3,"sawtooth",.5],block:[700,500,.09,"square",.2],miss:[500,800,.1,"sine",.12],win:[440,880,.6,"triangle",.35],lose:[200,60,.9,"sawtooth",.3]}[n];t.type=o,t.frequency.setValueAtTime(s,e),t.frequency.exponentialRampToValueAtTime(r,e+a),i.gain.setValueAtTime(c,e),i.gain.exponentialRampToValueAtTime(.001,e+a),t.connect(i).connect(_r.destination),t.start(e),t.stop(e+a+.02)}catch{}}function Nf(n){let{scene:e,camera:t,h:i,store:s}=n,r=Mv();r.g.visible=!1,e.add(r.g);let a=Uf(r.g),o=Lo(),c=Wh(64,64,w=>{let B=w.createRadialGradient(32,32,2,32,32,32);B.addColorStop(0,"rgba(0,0,0,0.6)"),B.addColorStop(1,"rgba(0,0,0,0)"),w.fillStyle=B,w.fillRect(0,0,64,64)}),h=document.getElementById("battle"),l={active:!1,phase:"off",run:null,data:null,views:[null,null],F:null,t:0,phaseT:0,enemy:null,shake:0,cheer:0,rand:Math.random,confetti:null,queue:[],eLoad:null,auto:!1,freeze:0,slow:0,punch:0,entered:!1},u=null,f={Pounce:"pounce","Tail Sweep":"tail",Gore:"charge",Hurl:"slash",Rend:"slash",Constrict:"lash","Fire Breath":"roar",Sling:"slash"};function p(w,B,G,ne,N){li(B,w.look,Tt[w.type].bellyDir),Gh(B);let k=[],Z=ur(w,B,{anchors:k,animated:!0}),Q=ea(Z),W=Q.getSize(new I),ae=fr(w),te=gr(1.9/Math.max(W.y,W.z*.85,W.x*.55,.6),.5,2.4)*(.85+.35*gr(Math.cbrt(ae.hp/200),.6,1.4)),pe=w.type==="aquatic"?.45:0;Z.group.scale.setScalar(te),Z.group.position.set(-(Q.min.x+Q.max.x)/2*te,-Q.min.y*te+pe,-Q.max.z*te+W.z*te/2);let Fe=0;for(let et of ne?ne.weapons:[]){let Ie=k[Fe];if(Fe+=$n(et.id,"weapon").hands,!Ie)continue;let R=Sv(et.id),S=gr(W.y*.3,.22,.6);R.scale.setScalar(S),R.position.copy(Ie.p).addScaledVector(Ie.t,Ie.r*2.2),R.quaternion.setFromUnitVectors(new I(0,1,0),Ie.t.clone().multiplyScalar(.25).add(new I(.2,.5,.85)).normalize()),R.traverse(H=>{H.castShadow=!0}),Ie.node.add(R)}let nt=new Et,D=new Et;nt.add(Z.group),D.add(nt);let Xt=new ke(new Ti(1,1),new Bt({map:c,transparent:!0,depthWrite:!1,opacity:.45}));Xt.rotation.x=-Math.PI/2,Xt.position.set(0,.012,-W.z*te/2),Xt.scale.set(Math.max(W.x*te,.6)*1.2,W.z*te*1.1,1),D.add(Xt),D.position.x=G*(.75+(N||0)),D.rotation.y=G<0?Math.PI/2:-Math.PI/2,r.g.add(D);let Ze=Cf(Z),Je=new Set(w.parts.map(et=>et.kind)),Ae=[];return Ze.arms>0?Ae.push("slash"):ae.claws&&ae.legs>=4&&Ae.push("swipe"),ae.mouth&&Ae.push("bite"),ae.horns&&Ae.push("charge"),ae.wings&&Ae.push("swoop"),ae.tentacles>=2&&Ae.push("lash"),["tail_club","tail_thick","tail_fluke","tail_fish"].some(et=>Je.has(et))&&Ae.push("tail"),Je.has("tail_stinger")&&Ae.push("sting"),Ae.length||Ae.push("lunge"),Ze.armSel=-1,Ze.len=W.z*te,{cr:Z,mats:B,pose:nt,holder:D,side:G,rig:Ze,styles:Ae,style:Ae[0],styleN:0,hover:pe,st:ae,walk:N||0,half:W.x*te/2,len:W.z*te,head:new I(0,W.y*te+pe+.15,-W.z*te*.3),mid:new I(0,W.y*te*.55+pe,-W.z*te*.2),front:new I(0,W.y*te*.5+pe,.1),strikeT:-1,winding:!1,power:!1,recoil:0,flash:0,dead:-1,dodge:-1,fxT:0,thud:!1,ph:Math.random()*6}}let g=(w,B)=>w.holder.localToWorld(B.clone());function _(w){let B=l.views[w];if(!B)return;r.g.remove(B.holder);let G=new Set([...Object.values(B.mats).filter(ne=>ne&&ne.isMaterial),...B.mats.shells,...B.mats.eyeCache.values()]);B.holder.traverse(ne=>{ne.isMesh&&(ne.geometry.dispose(),G.has(ne.material)||ne.material.dispose())}),l.views[w]=null}let m=w=>[...w.weapons,...w.abilities,...w.relics].map(B=>$n(B.id,B.cat).icon).join("");function d(w,B){let G=B.clone();return w.holder.localToWorld(G),G.project(t),[(G.x*.5+.5)*innerWidth,(-G.y*.5+.5)*innerHeight]}function y(w,B,G){let ne=l.views[w];if(!ne)return;let[N,k]=d(ne,ne.head),Z=i("div",{class:"float "+(G||""),style:`left:${N+(Math.random()-.5)*40}px;top:${k}px`},B);h.querySelector(".floaters").append(Z),setTimeout(()=>Z.remove(),1100)}function v(){let w=[l.data.name,l.enemy?l.enemy.name:""],B=G=>ne=>{ne.preventDefault(),l.phase==="fight"&&G()};h.replaceChildren(i("div",{class:"hud"},i("div",{class:"who l"},i("b",null,w[0]),i("div",{class:"hp"},i("u",{id:"hg0"}),i("i",{id:"hp0"})),i("small",{id:"st0"}),i("div",{class:"kit"},m(l.run.load))),i("div",{class:"round"},i("small",null,"Fight"),i("b",null,l.run.round+1+" / "+10)),i("div",{class:"who r"},i("b",null,w[1]),i("div",{class:"hp"},i("u",{id:"hg1"}),i("i",{id:"hp1"})),i("small",{id:"st1"}),i("div",{class:"kit"},l.eLoad?m(l.eLoad):""))),i("div",{class:"msg",id:"bmsg"}),i("div",{class:"floaters"}),i("div",{class:"acts"},i("div",null,i("button",{id:"bpow",onpointerdown:B(()=>Th(l.F[0])&&yn("miss"))},i("i"),i("em",null,"\u2694\uFE0F"),i("span",null,"Power")),i("button",{id:"bgrd",onpointerdown:B(()=>Ah(l.F[0])&&yn("block"))},i("i"),i("em",null,"\u{1F6E1}\uFE0F"),i("span",null,"Guard"))),i("div",null,l.run.load.abilities.map((G,ne)=>i("button",{class:"abil",id:"bab"+ne,onpointerdown:B(()=>{Rh(l.F,0,ne,l.rand,l.queue)&&yn("power")})},i("i"),i("em",null,$n(G.id,"ability").icon),i("span",null,$n(G.id,"ability").name))))))}function x(...w){let B=i("div",{class:"panel"},w);return h.append(B),B}function P(w){return i("div",{class:"stats"},...[["Health",w.hp],["Attack",w.atk.toFixed(1)],["Armour",Math.round(w.def*100)+"%"],["Speed",w.spd.toFixed(2)]].map(([B,G])=>i("div",null,i("small",null,B),i("b",null,String(G)))))}function T(){l.phase="gate",h.replaceChildren();let w=fr(l.data),B=lf(w),G=n.meta(),ne=(N,k)=>i("div",null,i("small",null,N),i("b",null,String(k)));x(i("h2",null,"The Colosseum"),i("p",null,i("b",null,l.data.name)," faces ten fights in a row, each tougher than the last, ending with the reigning champion. Choose a reward after every win."),i("div",{class:"stats"},ne("Health",w.hp),ne("Attack",w.atk.toFixed(1)),ne("Armour",Math.round(w.def*100)+"%"),ne("Speed",w.spd.toFixed(2)),ne("Hands",w.slots),ne("Abilities",w.abilitySlots),ne("Revives",G.revives||0)),i("p",{class:"dim"},B.length?"Traits: "+B.join(", ")+". ":"",w.hands?"Each arm or tentacle holds one weapon.":"No hands: it carries one weapon in its jaws, at reduced effect. Add arms or tentacles to wield more."," Its body decides which abilities and relics turn up."),i("p",{class:"warn"},"Fights are to the death. If it dies with no revive, it is gone for good."),G.rank>0&&i("div",{class:"ranks"},i("small",null,"Rank (tougher opponents, more points)"),i("div",{class:"chips"},Array.from({length:G.rank+1},(N,k)=>i("button",{class:k===l.run.tier?"on":"",onclick:()=>{l.run.tier=G.rankSel=k,n.saveMeta(),T()}},k?"Rank "+k+" \xB7 x"+Oh(k):"Rank 0")))),i("p",{class:"runs",id:"gruns"}),i("div",{class:"row"},i("button",{onclick:()=>ce({type:"back"})},"Back to the workshop"),i("button",{class:"ad",id:"gad",onclick:async N=>{await C(N,"gate")&&(Wo(G),n.saveMeta()),M()}},"\u{1F4FA} Watch an ad: +1 run"),i("button",{class:"go",id:"ggo",onclick:()=>{if(!gf(G)){M();return}n.saveMeta(),l.run.paid=!0,s.set("cc.run",l.run),yn("block"),A()}},"Enter the arena"))).classList.add("wide"),M()}function A(){(n.meta().boosts.head||0)>0&&!l.run.headTaken?(l.run.headTaken=!0,s.set("cc.run",l.run),b("A gift from the crowd","Choose a reward before the first fight.")):L()}async function C(w,B){let G=w.target.closest(".row"),ne=G?[...G.querySelectorAll("button")]:[w.target];ne.forEach(k=>{k.disabled=!0});let N=await n.showAd();return ne.forEach(k=>{k.disabled=!1}),!N.ok&&N.why&&n.toast(N.why),N.ok&&l.active&&l.phase===B}function M(){let w=document.getElementById("gruns");if(!w)return;let B=$i(n.meta());w.textContent="\u26A1 Runs: "+B.n+" / "+B.max+(B.next?" \xB7 next in "+Xo(B.next):"")+(B.n?". Entering uses one.":". None left: wait, or watch an ad."),document.getElementById("ggo").disabled=B.n<=0,document.getElementById("gad").classList.toggle("hidden",B.n>=B.max)}setInterval(()=>{l.phase==="gate"&&M()},1e3);function b(w,B){l.phase="won";let G=fr(l.data),ne=l.run.load;l.run.draft||(l.run.draft=xf(Math.random,G,ne,n.meta(),l.run.round),s.set("cc.run",l.run)),h.replaceChildren(i("div",{class:"floaters"}));let N=Q=>{vf(ne,Q),n.meta().seen[Q.cat+":"+Q.id]=1,n.stat("mostWeapons",ne.weapons.length,!0),n.saveMeta(),l.run.draft=null,s.set("cc.run",l.run),yn("block"),L()},k=Q=>{let W=$n(Q.id,Q.cat),ae=Q.cat==="ability"&&ne.abilities.find(pe=>pe.id===Q.id),te=Q.cat==="ability"?{...Q,lvl:ae?ae.lvl+1+(Q.rar>0?1:0):1+Q.rar}:Q;return i("button",{class:"reward r"+Q.rar+" c-"+Q.cat,onclick:()=>N(Q)},i("small",null,pf[Q.rar]+" "+(Q.cat==="relic"?"relic":Q.cat)+(ae?" \xB7 level up":"")),i("div",{class:"ico"},W.icon),i("b",null,W.name),i("p",null,Zo(te)),Q.syn&&i("em",null,"Synergy: "+W.tags.filter(pe=>[...ne.weapons,...ne.relics,...ne.abilities].some(Fe=>$n(Fe.id,Fe.cat).tags.includes(pe))).join(", ")))};x(i("h2",null,w),i("p",null,B),i("div",{class:"rewards"},l.run.draft.length?l.run.draft.map(k):i("p",{class:"dim"},"Nothing more fits this body.")),i("p",{class:"dim"},"Hands "+sa(ne)+"/"+G.slots+" \xB7 Abilities "+ne.abilities.length+"/"+G.abilitySlots+" \xB7 Relics "+ne.relics.length+(m(ne)?"   "+m(ne):"")),i("div",{class:"row"},l.run.lastPts>0&&i("button",{class:"ad",onclick:async Q=>{if(!await C(Q,"won")||!(l.run.lastPts>0))return;let W=n.meta();W.points+=l.run.lastPts,l.run.earned+=l.run.lastPts,n.saveMeta(),n.toast("Doubled: +"+l.run.lastPts+" points"),l.run.lastPts=0,s.set("cc.run",l.run),Q.target.remove()}},"\u{1F4FA} Watch an ad: double the "+l.run.lastPts+" points"),l.run.rerolls>0&&i("button",{onclick:()=>{l.run.rerolls--,l.run.draft=null,b(w,B)}},"Reroll ("+l.run.rerolls+" left)"),!l.run.draft.length&&i("button",{class:"go",onclick:()=>{l.run.draft=null,L()}},"Next fight"))).classList.add("wide")}function L(){_(1),_(0);let w=l.run.round===9,B=n.meta(),G=B.boosts;l.views[0]=p(l.data,n.M,-1,l.run.load,l.entered?0:5.5),l.entered=!0,l.enemy=ra(lr(l.run.seed+l.run.round*7919),{titled:!0}),w&&(l.enemy.name=l.enemy.name.split(" ")[0]+", Champion of the Sands");let ne=fr(l.data),N=fr(l.enemy);l.eLoad=bf(lr(l.run.seed+l.run.round),N,l.run.round),l.elite=w?null:Mf(lr(l.run.seed*3+l.run.round),l.run.round),l.elite&&(l.enemy.name=l.elite.name+" "+l.enemy.name.split(" ")[0]),l.hurt=!1,l.views[1]=p(l.enemy,o,1,l.eLoad,6),w&&l.views[1].holder.scale.setScalar(1.18),l.F=[Eh(ne,{mods:Fh(l.run.load,ne),abilities:l.run.load.abilities,bonusHp:l.run.bonusHp,boost:{hp:1+.05*(G.vital||0),atk:1+.04*(G.fero||0)}}),Eh(N,{mul:cf(l.run.round,l.run.tier||0),mods:(()=>{let k=Fh(l.eLoad,N);if(l.elite)for(let Z in l.elite.mods)k[Z]=(k[Z]||0)+l.elite.mods[Z];return k})()})],l.run.hp!=null&&(l.F[0].hp=Math.min(l.F[0].max,l.run.hp)),l.rand=Math.random,l.queue=[],l.run.fighting=!0,l.run.dead=!1,s.set("cc.run",l.run),v(),V(),l.phase="intro",l.phaseT=0,l.elite&&l.views[1].holder.scale.setScalar(l.elite.id==="giant"?1.25:1.08),z(w?"Final fight":l.elite?"Elite!":"Fight "+(l.run.round+1),"vs "+l.enemy.name+(l.elite?" (+50% points)":""))}function z(w,B){let G=document.getElementById("bmsg");G&&G.replaceChildren(w?i("b",null,w):"",B?i("span",null,B):"")}function V(){for(let B=0;B<2;B++){let G=l.F[B],ne=document.getElementById("hp"+B);if(!ne)continue;let N=gr(G.hp/G.max,0,1),k=G.st;document.getElementById("hg"+B).style.width=N*100+"%",ne.style.width=N*100+"%",ne.style.background=k.poison>0?"#8fd14f":N>.5?"#3fd0a4":N>.25?"#ffb347":"#ff5a4a",ne.parentNode.classList.toggle("shield",G.shield>0);let Z=Math.max(0,Math.ceil(G.hp))+" / "+G.max+(G.shield>0?" +"+Math.ceil(G.shield):"")+(k.bleed>0?" \u{1FA78}"+k.bleed:"")+(k.poison>0?" \u2623\uFE0F":"")+(k.burn>0?" \u{1F525}":"")+(k.stun>0?" \u{1F4AB}":"")+(k.weak>0?" \u2B07\uFE0F":"")+(k.slow>0?" \u{1F578}\uFE0F":"")+(k.blind>0?" \u{1F32B}\uFE0F":"")+(G.buff.shell>0?" \u{1F422}":"")+(G.buff.evade>0?" \u{1F985}":"")+(G.buff.frenzy>0?" \u{1F624}":""),Q=document.getElementById("st"+B);Q.textContent!==Z&&(Q.textContent=Z)}let w=(B,G,ne,N)=>{let k=document.getElementById(B);k&&(k.firstChild.style.height=gr(G/ne,0,1)*100+"%",k.classList.toggle("armed",!!N))};w("bpow",l.F[0].powerCd,7,l.F[0].power),w("bgrd",l.F[0].guardCd,l.F[0].guardEvery,l.F[0].guard>0),l.F[0].abil.forEach((B,G)=>w("bab"+G,B.cd,Ch[B.id],!1))}function $(){let w=l.F[0],B=n.meta(),G=_f(l.run.round,l.run.tier||0,!!l.elite);if(n.stat("fightsWon"),n.stat("bestFight",l.run.round+1,!0),l.elite&&n.stat("elites"),l.hurt||n.stat("flawless"),w.hp<w.max*.1&&n.stat("closeCalls"),B.points+=G,l.run.earned=(l.run.earned||0)+G,l.run.lastPts=G,n.saveMeta(),l.run.bonusHp=(l.run.bonusHp||0)+w.m.killHp,l.run.round++,l.run.fighting=!1,l.run.hp=Math.min(w.max,Math.max(1,w.hp)+w.max*(.4+.04*(B.boosts.recov||0)+w.m.killHeal)),l.run.draft=null,l.run.round>=10){ie();return}s.set("cc.run",l.run),b(l.enemy.name.split(",")[0]+" is dead","+"+G+" points. "+l.data.name+" recovers to "+Math.round(l.run.hp)+" / "+w.max+" health. "+(l.run.round===9?"Only the champion remains. ":"")+"Choose a reward:")}function ie(){l.phase="champion",s.set("cc.run",null),yn("win"),l.cheer=6,_(0),l.views[0]=p(l.data,n.M,-1,l.run.load);let w=Math.round(uf(l.F[0].hp,l.F[0].max)*Oh(l.run.tier||0)),B=l.run.earned||0;_(1),l.views[0].holder.position.x=0,l.views[0].holder.rotation.y=.35;let G=260,ne=new Ti(.09,.14),N=new Wr(ne,new Bt({side:Ct}),G),k=new Ue;l.confetti={mesh:N,bits:[]};for(let Z=0;Z<G;Z++)l.confetti.bits.push({x:(Math.random()-.5)*9,y:3+Math.random()*7,z:(Math.random()-.5)*5,v:.8+Math.random()*1.2,r:Math.random()*6,w:1+Math.random()*4}),N.setColorAt(Z,k.setHSL(Math.random(),.9,.6));r.g.add(N),h.replaceChildren(i("div",{class:"floaters"})),x(i("h2",{class:"gold"},"Champion!"),i("p",null,i("b",null,l.data.name)," won all ten fights and rules the Colosseum"+(l.run.tier?" at Rank "+l.run.tier:"")+"."+((l.run.tier||0)>=(n.meta().rank||0)&&(l.run.tier||0)<$o?" Rank "+((l.run.tier||0)+1)+" is now open.":"")),i("div",{class:"stats"},i("div",null,i("small",null,"Fights"),i("b",null,String(B))),i("div",null,i("small",null,"Title"),i("b",null,"+1000")),i("div",null,i("small",null,"Health left"),i("b",null,"+"+(w-1e3))),i("div",null,i("small",null,"Total"),i("b",{class:"gold"},String(w+B)))),i("div",{class:"row"},i("button",{class:"ad",onclick:async Z=>{await C(Z,"champion")&&(n.bonus(w),ce({type:"champion",points:w*2}))}},"\u{1F4FA} Watch an ad: double the title prize (+"+w+")"),i("button",{class:"go",onclick:()=>ce({type:"champion",points:w})},"Take the crown"))).classList.add("low"),n.crown(w,l.run)}function K(){l.phase="dead",yn("lose"),l.run.dead=!0,l.run.fighting=!1,s.set("cc.run",l.run),h.querySelector(".acts").classList.add("hidden"),z("","");let w=n.meta(),B=l.run.earned||0;x(i("h2",{class:"red"},l.data.name+" has fallen"),i("p",null,"Killed by "+l.enemy.name+" in fight "+(l.run.round+1)+" of "+10+", after "+l.run.round+(l.run.round===1?" win":" wins")+" and "+B+" points earned."),!l.run.adRevived&&i("p",null,"The crowd wants more: watch an ad to bring it back once, at half health."),w.revives>0?i("p",null,"You hold "+w.revives+(w.revives===1?" revive.":" revives.")+" Using one brings it back at half health to fight "+l.enemy.name.split(",")[0]+" again."):i("p",{class:"dim"},"The dead do not return. Build a new creature and try again. Revives are sold in the shop."),i("div",{class:"row"},!l.run.adRevived&&i("button",{class:"ad",onclick:async G=>{await C(G,"dead")&&(l.run.adRevived=!0,l.run.hp=Math.round(l.F[0].max*.5),s.set("cc.run",l.run),yn("win"),L())}},"\u{1F4FA} Watch an ad to revive"),w.revives>0&&i("button",{class:"go",onclick:()=>{w.revives--,n.saveMeta(),l.run.hp=Math.round(l.F[0].max*.5),s.set("cc.run",l.run),yn("win"),L()}},"Use a revive"),i("button",{class:w.revives>0||!l.run.adRevived?"":"go",onclick:()=>{s.set("cc.run",null),ce({type:"dead",round:l.run.round,by:l.enemy.name})}},w.revives>0?"Let it die":"Create a new creature"))).classList.add("low")}function ce(w){l.active&&(_(0),_(1),l.confetti&&(r.g.remove(l.confetti.mesh),l.confetti.mesh.geometry.dispose(),l.confetti.mesh.material.dispose(),l.confetti.mesh.dispose(),l.confetti=null),l.active=!1,l.phase="off",r.g.visible=!1,e.background=u,a.clear(),Gh(n.M),t.zoom=1,h.classList.add("hidden"),h.replaceChildren(),n.onDone(w))}function J(w,B,G,ne){let N=l.F&&l.F[B],k=Hh(),Z=w.rig,Q=Math.sin(ne*2+w.ph);if(k.sy=1+Q*.012,k.y=w.hover?Math.sin(ne*1.3+w.ph)*.06:0,w.st.wings&&(k.flap=w.hover?.3:.05),w.walk>0){let te=Math.min(w.walk,4.6*G);w.walk-=te,w.holder.position.x=w.side*(.75+w.walk),k.gait=1,k.y+=Math.abs(Math.sin(Z.gaitPh))*.04,k.pitch=.04,w.fxT+=G,w.fxT>.16&&(w.fxT=0,a.burst("dust",g(w,new I(0,.05,-w.len*.5)),2,{speed:.5}))}else if(w.dead>=0){w.dead+=G;let te=Math.min(1,w.dead/.75),pe=te*te*(3-2*te);Object.assign(k,{roll:1.48*pe*(B?-1:1),y:Math.sin(pe*Math.PI/2)*w.half*.85+Math.sin(te*Math.PI)*.25,z:-.5*pe,pitch:-.2*Math.sin(te*Math.PI),legF:-.5*pe,legH:.55*pe,legOut:.35*pe,armAll:-.7*pe,armOut:.5*pe,wing:-.7*pe,tent:-.6*pe,tailUp:-.3*pe,wag:0,flap:0,sy:1-.06*pe}),te>=.8&&!w.thud&&(w.thud=!0,a.burst("dust",g(w,new I(0,.1,-w.len*.5)),26,{spread:w.len*.8}),l.shake=Math.max(l.shake,.18))}else if(l.phase==="champion"||l.phase==="ending"&&l.winner===B&&l.phaseT>.5){let te=Math.abs(Math.sin(ne*5.5));Object.assign(k,{y:k.y+te*.22,sy:1+(te-.5)*.08,armAll:-2.7,armOut:.35,wing:.7,flap:.5,tailUp:.5,wag:3,pitch:-.15,tent:-.9,legF:-.25*te})}else N&&l.phase==="fight"&&(N.st.stun>0?Object.assign(k,{roll:.13*Math.sin(ne*9),pitch:.12,legOut:.12,armAll:.2,wing:-.3,wag:0,sy:.96}):(w.strikeT<0&&N.t<.45?(w.winding||(w.winding=!0,w.style=w.styles[w.styleN++%w.styles.length],w.power=N.power,Z.armSel=Z.arms?w.styleN%Z.arms:-1,N.power&&Z.arms>1&&(Z.armSel=-1)),Object.assign(k,Vh(w.style,1-N.t/.45,-1,w.power))):w.strikeT<0&&(w.winding=!1),w.strikeT>=0&&(Object.assign(k,Vh(w.style,1,w.strikeT,w.power)),w.strikeT+=G,w.strikeT>Pf&&(w.strikeT=-1,w.winding=!1)),N.guard>0&&Object.assign(k,{sy:.9,pitch:.12,armAll:-1.4,armOut:.3,wing:.7,z:(k.z||0)-.12,legF:.15,tailUp:-.2}),N.buff.shell>0&&(k.sy=.82,k.legOut=.2,k.armAll=-.8),N.buff.frenzy>0&&(k.sy*=1+.03*Math.sin(ne*22),k.wag=4),N.buff.evade>0&&(k.y+=1.3,k.flap=1,k.pitch=-.2)));if(w.recoil>0){w.recoil=Math.max(0,w.recoil-G*3.2);let te=w.recoil;k.z=(k.z||0)-.5*te,k.pitch=(k.pitch||0)-.28*te,k.roll=(k.roll||0)+.14*te*Math.sin(ne*30),k.legF=(k.legF||0)-.35*te,k.armAll=(k.armAll||0)+.5*te,k.wing=(k.wing||0)+.4*te,k.sy=k.sy*(1-.06*te)}if(w.dodge>=0)if(w.dodge+=G*3.2,w.dodge>=1)w.dodge=-1;else{let te=Math.sin(w.dodge*Math.PI);k.x=(k.x||0)+.95*te,k.roll=(k.roll||0)-.35*te,k.z=(k.z||0)-.3*te,k.gait=1}If(Z,k,G,w.pose),w.flash=Math.max(0,w.flash-G*5);let W=N&&N.guard>0?.1:0,ae=N&&N.buff.shell>0?.12:0;for(let te of[w.mats.skin,...w.mats.shells])te.emissive.setRGB(w.flash*.5+W*.2+ae,W*.6+ae,W+ae);if(w.holder.updateMatrixWorld(!0),N&&w.dead<0&&l.phase==="fight"&&(w.fxT+=G,w.fxT>.07)){w.fxT=0;let te=()=>g(w,new I((Math.random()-.5)*w.half*1.6,w.mid.y*(.4+Math.random()*1.2),-w.len*Math.random()));N.st.burn>0&&a.burst("fire",te(),2,{spread:.15}),N.st.poison>0&&Math.random()<.5&&a.burst("venom",te(),1,{spread:.1}),N.st.bleed>0&&Math.random()<.12*N.st.bleed&&a.burst("blood",te(),1,{speed:.3}),N.st.stun>0&&a.burst("star",g(w,w.head),1,{spread:.5,speed:.4}),N.shield>0&&Math.random()<.4&&a.burst("shield",te(),1,{speed:.2}),N.buff.frenzy>0&&a.burst("fire",te(),1,{spread:.1,size:.6}),N.st.blind>0&&a.burst("ink",g(w,w.head),1,{spread:.4,speed:.3,size:.6}),N.st.slow>0&&Math.random()<.4&&a.burst("web",te(),1,{speed:.2})}}function fe(w){if(w.type==="dot"){w.on===0&&(l.hurt=!0),y(w.on,"-"+w.dmg,w.kind==="venom"?"venom":w.kind==="burn"?"burn":"bleed"),a.burst(w.kind==="venom"?"venom":w.kind==="burn"?"fire":"blood",g(l.views[w.on],l.views[w.on].mid),6);return}if(w.type==="cast"){let Z=l.views[w.by],Q=l.views[1-w.by];y(w.by,w.name,"cast"),yn("miss"),Z.style="roar",Z.strikeT=0,Z.power=!1;let W={"Ink Cloud":["ink",Q,26],Web:["web",Q,40],"Venom Spit":["venom",Q,26],Roar:["magic",Z,14],"Shell Up":["shield",Z,22],Frenzy:["fire",Z,22],Dive:["dust",Z,18]}[w.name]||["magic",Z,16];a.burst(W[0],g(W[1],W[1].mid),W[2],{spread:.9}),w.name==="Roar"&&(a.ring(g(Z,Z.front),16766826,3.2,!1),l.shake=.15),w.name==="Shell Up"&&a.ring(g(Z,new I(0,.05,-Z.len/2)),8376575,2);return}if(w.type==="heal"){y(w.on,w.name,"venom"),yn("win"),a.burst("heal",g(l.views[w.on],l.views[w.on].mid),30,{spread:1.1});return}let B=l.views[w.by],G=l.views[1-w.by];if((w.by===1&&w.dmg>0||w.by===0&&(w.thorns||w.riposte))&&(l.hurt=!0),w.name&&f[w.name]){let Z=f[w.name];B.style=Z==="tail"&&!B.rig.kinds.has("tail")||Z==="slash"&&!B.rig.arms||Z==="lash"&&!B.rig.kinds.has("tentacle")?"lunge":Z,B.rig.armSel=-1}if(B.strikeT=0,B.power=!!w.power||!!w.ability,w.name&&y(w.by,w.name,"cast"),w.miss){y(1-w.by,"Miss","dim"),yn("miss"),G.dodge=0,a.burst("dust",g(G,new I(0,.05,-G.len*.4)),8);return}let ne=w.power||w.crit||w.ability,N=g(G,G.front);G.recoil=w.blocked?.3:ne?1:.6,w.blocked||(G.flash=1),l.shake=w.blocked?.05:w.power?.3:ne?.2:.1,l.cheer=Math.max(l.cheer,ne?1:.4),l.freeze=w.blocked?.03:ne?.09:.045,ne&&!w.blocked&&(l.punch=.07),w.blocked?(a.burst("shield",N,16),a.ring(N,8376575,1.1,!1)):(a.burst("spark",N,ne?22:10,{dir:new I(-B.side,.3,0)}),a.burst("dust",g(G,new I(0,.05,-G.len*.4)),ne?10:4),ne&&a.ring(N,w.crit?16766826:16777215,w.power?1.8:1.3,!1),(w.bleed||w.crit)&&a.burst("blood",N,10),(w.burn||w.name==="Fire Breath")&&a.burst("fire",N,24,{spread:.8}),w.venom&&a.burst("venom",N,14,{spread:.6}),w.stun&&a.burst("star",g(G,G.head),12,{spread:.5})),y(1-w.by,(w.blocked?"Blocked ":"")+"-"+w.dmg+(w.crit?"!":""),w.blocked?"dim":ne?"big":""),w.thorns&&(y(w.by,"-"+w.thorns,"dim"),a.burst("spark",g(B,B.front),6)),w.riposte&&(y(w.by,"Riposte -"+w.riposte,"dim"),B.recoil=.5,B.flash=1);let k=w.stun?"Stunned":w.venom?"Poisoned":w.burn?"Burning":w.bleed?"Bleeding":"";k&&y(1-w.by,k,w.venom?"venom":w.burn?"burn":"bleed"),yn(w.blocked?"block":ne?"power":"hit")}return l.update=(w,B)=>{let G=w;if(l.freeze>0&&(l.freeze-=w,G=w*.05),l.slow>0&&(l.slow-=w,G*=.3),l.t+=G,l.phaseT+=G,l.phase==="intro"&&l.phaseT>1.9&&(l.phase="fight",l.phaseT=0,z("Fight!",""),setTimeout(()=>l.phase==="fight"&&z("",""),700)),l.phase==="fight"){let Z=l.queue.splice(0),Q=.15+.035*l.run.round,W=-1;for(let ae=0;ae<2&&W<0;ae++)Ph(l.F,1,G/2,l.rand,Q,Z),l.auto&&Ph(l.F,0,G/2,l.rand,.5,Z),W=hf(l.F,G/2,l.rand,Z);Z.forEach(fe),V(),W>=0&&(l.phase="ending",l.phaseT=0,l.winner=W,l.views[1-W].dead=0,l.cheer=3,l.slow=.9,l.punch=.14,z("K.O.",""),W===0&&yn("win"))}l.phase==="ending"&&l.phaseT>2.1&&(l.winner===0?$():K());for(let Z=0;Z<2;Z++)l.views[Z]&&J(l.views[Z],Z,G,l.t);a.resize(window.innerHeight),a.update(G),l.cheer=Math.max(0,l.cheer-G*.8);let ne=.03+.14*Math.min(l.cheer,1);r.seats.forEach((Z,Q)=>{r.m4.makeTranslation(Z.x,Z.y+Math.abs(Math.sin(B*6*(1+Q%5*.2)+Z.ph))*ne,Z.z),r.crowd.setMatrixAt(Q,r.m4)}),r.crowd.instanceMatrix.needsUpdate=!0,l.confetti&&(l.confetti.bits.forEach((Z,Q)=>{Z.y-=Z.v*G,Z.y<0&&(Z.y=8),r.m4.makeRotationFromEuler(new mn(Z.r+l.t*Z.w,Z.r*2+l.t*Z.w*.7,0)).setPosition(Z.x+Math.sin(l.t+Z.r)*.3,Z.y,Z.z),l.confetti.mesh.setMatrixAt(Q,r.m4)}),l.confetti.mesh.instanceMatrix.needsUpdate=!0),l.shake=Math.max(0,l.shake-w*1.2);let N=gr(1.9/t.aspect,1,1.6),k=l.phase==="champion";l.punch=Math.max(0,l.punch-w*.35),Math.abs(t.zoom-(1+l.punch))>5e-4&&(t.zoom=1+l.punch,t.updateProjectionMatrix()),t.position.set(Math.sin(l.t*.25)*.8+(Math.random()-.5)*l.shake,(k?1.5:1.9)+(Math.random()-.5)*l.shake,(k?7.2:7.1)*N),t.lookAt(0,k?-.25:1.05,0)},l.start=(w,B)=>{l.data=w,l.active=!0,l.t=0,l.enemy=null,l.F=null,l.entered=!1,l.freeze=l.slow=l.punch=0,n.sun.target.position.set(0,0,0),n.sun.position.set(3,7,5),l.run=B||{id:w.id,round:0,hp:null,tier:Math.min(n.meta().rankSel||0,n.meta().rank||0),seed:Math.floor(Math.random()*1e9),load:qo(),bonusHp:0,earned:0,rerolls:n.meta().boosts.reroll||0,draft:null},l.run.load||(l.run.load=qo()),l.eLoad=null,l.queue=[],u=e.background,e.background=r.sky,r.g.visible=!0,h.classList.remove("hidden"),l.views[0]=p(w,n.M,-1,l.run.load);let G=l.run.fighting&&l.run.retried;if(l.run.dead||G)L(),l.phase="ending",l.F[0].hp=0,l.views[0].dead=5,l.views[1].walk=0,l.views[1].holder.position.x=.75,z("",""),K();else if(l.run.draft)b("Back to the sands","Choose your reward:");else if(l.run.round>0||l.run.paid){let ne=!!l.run.fighting;ne&&(l.run.retried=!0,s.set("cc.run",l.run)),l.phase="won",h.replaceChildren(),x(i("h2",null,"Back to the sands"),i("p",null,l.data.name+" has won "+l.run.round+" of "+10+" fights"+(l.run.hp!=null?" and has "+Math.round(l.run.hp)+" health.":".")),ne&&i("p",{class:"warn"},"You left in the middle of a fight, so it starts again. That is forgiven once per gauntlet: leave mid-fight again and it counts as a death."),i("div",{class:"row"},i("button",{class:"go",onclick:()=>A()},"Next fight")))}else T()},l.back=()=>(l.phase==="gate"&&ce({type:"back"}),!0),l}var aa=null;window.ccAdDone=(n,e)=>{let t=aa;aa=null,t&&t({ok:!!n,why:e||""})};function Xh(){return aa?Promise.resolve({ok:!1,why:""}):new Promise(n=>{if(aa=n,window.Android&&window.Android.showRewarded){try{window.Android.showRewarded()}catch{window.ccAdDone(!1,"Ads are unavailable right now.");return}let r=n,a=0,o=setInterval(()=>{if(aa!==r){clearInterval(o);return}document.visibilityState==="visible"?a++:a=0,a>=20&&(clearInterval(o),window.ccAdDone(!1,"The ad did not finish."))},1e3);return}if(window.__ccAdInstant){window.ccAdDone(!0);return}let e=document.createElement("div");e.className="adph";let t=3,i=()=>{e.innerHTML="<div><small>Ad placeholder</small><b>"+t+"</b><p>The Android app shows a real rewarded ad here.</p></div>"};i(),document.body.append(e);let s=setInterval(()=>{t--,t<=0?(clearInterval(s),e.remove(),window.ccAdDone(!0)):i()},1e3)})}var At=n=>document.getElementById(n);function X(n,e,...t){let i=document.createElement(n);for(let[s,r]of Object.entries(e||{}))s==="class"?i.className=r:s==="style"?i.style.cssText=r:s.startsWith("on")?i.addEventListener(s.slice(2),r):r!==!1&&r!=null&&(i[s]=r);for(let s of t.flat())s!=null&&s!==!1&&i.append(s);return i}var gt={get(n,e){try{let t=localStorage.getItem(n);return t?JSON.parse(t):e}catch{return e}},set(n,e){try{return localStorage.setItem(n,JSON.stringify(e)),!0}catch{return!1}}};function Wt(n){let e=At("toast");e.textContent=n,e.classList.remove("hidden"),clearTimeout(Wt.t),Wt.t=setTimeout(()=>e.classList.add("hidden"),2200)}var Es=At("view"),St=new co({canvas:Es,antialias:!0,powerPreference:"high-performance"});St.setPixelRatio(Math.min(window.devicePixelRatio||1,2));St.toneMapping=th;St.toneMappingExposure=1.05;var kt=new er;{let n=document.createElement("canvas");n.width=4,n.height=256;let e=n.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"#3d7f86"),t.addColorStop(.55,"#1c3a40"),t.addColorStop(1,"#0c1719"),e.fillStyle=t,e.fillRect(0,0,4,256);let i=new oi(n);i.colorSpace=Ot,kt.background=i}var wv=new Qs(St);kt.environment=wv.fromScene(new Co,.04).texture;kt.environmentIntensity=.55;var On=new qr(16773853,2.2);On.position.set(2.5,5,4);kt.add(On);kt.add(On.target);St.shadowMap.enabled=!0;St.shadowMap.type=eh;On.castShadow=!0;On.shadow.mapSize.set(1024,1024);On.shadow.bias=-6e-4;On.shadow.normalBias=.025;On.shadow.radius=3;Object.assign(On.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.5,far:22});var Hf=new qr(10475775,.9);Hf.position.set(-3,2.5,-4);kt.add(Hf);kt.add(new xo(13626111,3813160,.5));var ft=new Yt(32,1,.05,100),Cn=Lo(),ei=new Et;kt.add(ei);var ui=new ke(new qn(1,1.06,.06,64),new Ut({color:2377804,roughness:.85})),jn=new ke(new tr(1,48),new Bt({transparent:!0,depthWrite:!1,opacity:.55}));{let n=document.createElement("canvas");n.width=n.height=128;let e=n.getContext("2d"),t=e.createRadialGradient(64,64,4,64,64,64);t.addColorStop(0,"rgba(0,0,0,1)"),t.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=t,e.fillRect(0,0,128,128),jn.material.map=new oi(n),jn.material.color.set(0),jn.rotation.x=-Math.PI/2}ui.receiveShadow=!0;jn.material.opacity=.3;ei.add(ui,jn);var Qn=new Et;kt.add(Qn);var Ss=new ke(new gn(1,.12,8,32),new Bt({color:16757575,depthTest:!1,transparent:!0,opacity:.9}));Ss.renderOrder=10;Qn.add(Ss);var Ev=new an(1,16,12),Tv=new Bt({color:16777215,depthTest:!1,transparent:!0,opacity:.9}),Av=new Bt({color:16757575,depthTest:!1,transparent:!0}),Ii=new Et;Qn.add(Ii);var ua=new fo(new ct,new Xr({color:16777215,depthTest:!1,transparent:!0,opacity:.6}));ua.renderOrder=9;Qn.add(ua);var Kt={orbit:null},he=null,pt=null,mt=null,bn="body",Kn=-1,da=!1,dn=!1,kn=[],yr=[];function xn(){pt&&(ei.remove(pt.group),dr(pt.group)),li(Cn,he.look,Tt[he.type].bellyDir),pt=ur(he,Cn),ei.add(pt.group),Kh(),ga()}function Kh(){ws=!0;let n=ea(pt),e=n.getCenter(new I),t=n.getSize(new I),i=Math.max(t.x,t.z)*.42+.15;ui.position.set(e.x,n.min.y-.03,e.z),ui.scale.set(i,1,i),On.target.position.copy(e),On.position.copy(e).add(new I(2.5,5,4)),jn.position.set(e.x,n.min.y+.004,e.z),jn.scale.set(Math.max(t.x,.3)*.75,Math.max(t.z,.3)*.62,1),pt.box=n}function jh(n){let e=pt.box,t=e.getCenter(new I),i=e.getSize(new I).length()/2,s=i/Math.sin(Jr.degToRad(ft.fov/2))*.74;Kt.orbit.target.copy(t),ft.position.copy(t).add((n||new I(.75,.28,1)).normalize().multiplyScalar(s)),Kt.orbit.minDistance=i*.5,Kt.orbit.maxDistance=s*2.5,Kt.orbit.update()}function ga(){ws=!0;let n=dn&&bn==="body";for(Ii.visible=ua.visible=n;Ii.children.length;)Ii.remove(Ii.children[0]);if(n){let t=[],i=(pt.frames.m-1)/(he.nodes.length-1);he.nodes.forEach((s,r)=>{let a=pt.frames.C[Math.round(r*i)],o=new ke(Ev,r===Kn?Av:Tv);o.position.copy(a),o.userData.node=r,o.renderOrder=11,Ii.add(o),t.push(a)}),ua.geometry.dispose(),ua.geometry=new ct().setFromPoints(t)}let e=mt&&mt!=="body"&&pt.parts.get(mt);Ss.visible=!!(dn&&e&&e.userData.anchor),Ss.visible&&Ss.position.copy(e.userData.anchor)}function vn(){var e;let n=JSON.stringify(he);kn[kn.length-1]!==n&&(kn.push(n),kn.length>60&&kn.shift(),yr=[]),gt.set("cc.current",he),dn&&((e=document.activeElement)==null?void 0:e.tagName)!=="INPUT"&&tu()}function kf(n){he=JSON.parse(n),mt&&mt!=="body"&&!he.parts.find(e=>e.id===mt)&&(mt=null),xn(),Li(),gt.set("cc.current",he)}var pa=n=>he.parts.find(e=>e.id===n),Yh=new Xn(256,256,{samples:4}),oa=new Yt(30,1,.01,100);function Vf(n,e,t,i,s){let r=t.getCenter(new I),a=Math.max(t.getSize(new I).length()/2,.01);oa.aspect=n/e,oa.updateProjectionMatrix(),oa.position.copy(r).add(i.clone().normalize().multiplyScalar(a/Math.sin(Jr.degToRad(15))*(n>e?.92:1.02))),oa.lookAt(r),Yh.setSize(n,e);let o=Qn.visible;Qn.visible=!1;let c=St.toneMapping;St.toneMapping=ai,St.setRenderTarget(Yh),St.render(kt,oa),St.setRenderTarget(null),St.toneMapping=c,Qn.visible=o;let h=new Uint8Array(n*e*4);St.readRenderTargetPixels(Yh,0,0,n,e,h);let l=document.createElement("canvas");l.width=n,l.height=e;let u=l.getContext("2d"),f=u.createImageData(n,e),p=new Uint8Array(256);for(let g=0;g<256;g++)p[g]=Math.round(255*Math.pow(Math.min(g/255*1.1,1),1/2.2));for(let g=0;g<e;g++)for(let _=0;_<n;_++){let m=((e-1-g)*n+_)*4,d=(g*n+_)*4;f.data[d]=p[h[m]],f.data[d+1]=p[h[m+1]],f.data[d+2]=p[h[m+2]],f.data[d+3]=255}return u.putImageData(f,0,0),l.toDataURL(s||"image/jpeg",.85)}function jo(n){let e=pt,t=ui.visible;e&&(e.group.visible=!1),li(Cn,n.look,Tt[n.type].bellyDir);let i=ur(n,Cn);ei.add(i.group),ui.visible=jn.visible=!1;let s=Vf(240,192,ea(i),new I(.8,.25,1));return ei.remove(i.group),dr(i.group),ui.visible=jn.visible=t,e&&(e.group.visible=!0,li(Cn,he.look,Tt[he.type].bellyDir)),s}var qh={},Rv={base:"#9fb6b0",second:"#5c7a76",belly:"#c9d8d2",bellyAmt:.5,pattern:0,patScale:1,cover:"skin",furLen:0,furDroop:0,accent:"#efe6cf",hair:"#d98a3a",membrane:"#d99a8a",eye:"#3f9f6a"};function Zh(n){if(qh[n])return qh[n];let e=Pt[n],t={type:"quadruped",sex:"f",dimorph:0,bulk:1,stretch:1,look:Rv,parts:[],nodes:[{y:0,z:-.25,rx:.3,ry:.3},{y:0,z:.25,rx:.3,ry:.3}]},i={limbs:[.5,1.9],wings:[.5,.9],tails:[-.9,0],back:[.5,0],mouth:[1.9,Math.PI],eyes:[1.3,1]}[e.cat]||[.6,.6],s=pt;s&&(s.group.visible=!1),li(Cn,t.look,[0,-1,0]);let r=ur(t,Cn),a=hi(t,n,r.frames,i,{mirror:!1,size:e.kind==="surface"?.3:e.ridge?.18:.7}),o=Bo(r,a);r.body.visible=e.ridge||n==="shell",ei.add(r.group);let c=ui.visible;ui.visible=jn.visible=!1;let h=kt.background;kt.background=new Ue(1452075);let l=new An().setFromObject(e.ridge?r.group:o),u={mouth:[1,.3,.8],eyes:[.6,.2,1],tails:[1,.3,-.3],limbs:[1,.15,.7]}[e.cat]||[1,.4,.8],f=Vf(112,112,l,new I(...u),"image/png");return kt.background=h,ui.visible=jn.visible=c,ei.remove(r.group),dr(r.group),s&&(s.group.visible=!0,li(Cn,he.look,Tt[he.type].bellyDir)),qh[n]=f}var la={x:0,y:0,w:1,h:1};function br(){let n=window.innerWidth,e=window.innerHeight;if(St.setSize(n,e,!1),ti.active){ft.clearViewOffset(),ft.aspect=n/e,ft.zoom=1,ft.updateProjectionMatrix();return}let t=0,i=0,s=0;dn&&(t=At("left").getBoundingClientRect().right,s=At("topbar").getBoundingClientRect().bottom,i=At("right").classList.contains("hidden")?0:n-At("right").getBoundingClientRect().left),la={x:t,y:s,w:Math.max(n-t-i,50),h:Math.max(e-s,50)},ft.aspect=n/e;let r=t+la.w/2,a=s+la.h/2;ft.setViewOffset(n,e,n/2-r,e/2-a,n,e),ft.zoom=Math.min(la.w,la.h*1.15)*.82/e,ft.updateProjectionMatrix(),ws=!0}window.addEventListener("resize",()=>{dn&&!ti.active?Li():br()});var Ff=performance.now();function Gf(n){requestAnimationFrame(Gf);let e=Math.min((n-Ff)/1e3,.1);if(Ff=n,window.__ccPause)return;if(ti.active){ti.update(e,n/1e3),St.render(kt,ft);return}if(!dn||!pt||(Kt.orbit.autoRotate=da,Kt.orbit.update(e),Ki&&(Ki=!1,xn()),!ws&&!da))return;ws=!1;let i=ft.position.distanceTo(Kt.orbit.target)*.0075/ft.zoom;Ii.children.forEach(s=>s.scale.setScalar(i*(s.userData.node===Kn?1.5:1.1))),Ss.scale.setScalar(i*1.7),Ss.quaternion.copy(ft.quaternion),St.render(kt,ft)}var Ki=!1,ws=!0,Cv=()=>{ws=!0},ma=new Mo,Of=new Te,it={id:-1,x:0,y:0,t:0,mode:null,moved:!1,node:-1,count:0};function Qo(n){Of.set(n.clientX/window.innerWidth*2-1,-(n.clientY/window.innerHeight)*2+1),ma.setFromCamera(Of,ft)}function Qh(){let n=ma.intersectObject(pt.group,!0);for(let e of n){let t=e.object;for(;t&&!t.userData.partId;)t=t.parent;if(t)return t.userData.partId}return null}Es.addEventListener("pointerdown",n=>{if(!(!dn||ti.active)){if(it.count++,it.count>1){it.mode&&Wf(),it.mode=null,Kt.orbit.enabled=!0;return}if(Object.assign(it,{id:n.pointerId,x:n.clientX,y:n.clientY,t:performance.now(),mode:null,moved:!1}),Qo(n),bn==="body"){let e=ma.intersectObjects(Ii.children),t=-1,i=20;if(Ii.children.forEach(s=>{let r=s.position.clone().project(ft),a=(r.x*.5+.5)*innerWidth-n.clientX,o=(-r.y*.5+.5)*innerHeight-n.clientY,c=Math.hypot(a,o);c<i&&(i=c,t=s.userData.node)}),e.length&&(t=e[0].object.userData.node),t>=0){it.mode="node",it.node=t,Kn=t,Kt.orbit.enabled=!1,ga(),Jn();return}}mt&&mt!=="body"&&Qh()===mt&&(it.mode="part",Kt.orbit.enabled=!1,Qr(pt,mt))}},!0);Es.addEventListener("pointermove",n=>{if(!(!dn||ti.active||n.pointerId!==it.id)&&(Math.hypot(n.clientX-it.x,n.clientY-it.y)>9&&(it.moved=!0),!(!it.mode||!it.moved))){if(Qo(n),it.mode==="node"){let e=ma.ray.intersectPlane(new En(new I(1,0,0),0),new I);if(e){let t=he.nodes[it.node];t.y=on(e.y,-1,5),t.z=on(e.z,-4,4),Ki=!0}}else if(it.mode==="part"){let e=ma.intersectObject(pt.body,!1)[0];if(e&&e.uv){let t=pa(mt);t.u=e.uv.x,t.a=e.uv.y*Math.PI*2,t.mirror&&(t.a=Mh(t).a),Bo(pt,t),ga()}}}});function Wf(){it.mode==="part"&&(Qr(pt),Kh()),it.mode&&it.moved&&vn(),Kt.orbit.enabled=!0}function Xf(n){if(!dn||ti.active){it.count=0;return}if(it.count=Math.max(0,it.count-1),n.pointerId!==it.id)return;it.id=-1;let e=!it.moved&&performance.now()-it.t<450;if(Wf(),e&&it.mode!=="node"){Qo(n);let t=Qh();vr(t)}it.mode=null}Es.addEventListener("pointerup",Xf);Es.addEventListener("pointercancel",Xf);function vr(n){if(mt=n,n&&n!=="body"){let e=Pt[pa(n).kind].cat;bn!==e&&(bn=e)}n==="body"&&(bn="body"),Li()}function un(n,e,t,i,s,r,a){let o=X("span",null,""),c=()=>h.style.setProperty("--p",(h.value-e)/(t-e)*100+"%"),h=X("input",{type:"range",min:e,max:t,step:a||(t-e)/200,value:i,oninput:()=>{c(),s(parseFloat(h.value))},onchange:()=>{(r||vn)(parseFloat(h.value))}});return c(),X("div",{class:"sl"},X("label",null,n,o),h)}function xr(n,e,t){return X("div",{class:"chips"},n.map(([i,s])=>X("button",{class:i===e?"on":"",onclick:()=>t(i)},s)))}var Pv=["#f4f0e6","#d9d2c2","#a8a29a","#6b6660","#3a3632","#14100e","#f3e6d0","#e8c9a0","#c99573","#a06a45","#6b4a2e","#3a2616","#f2c230","#e8a020","#d9702a","#c8501c","#a8301c","#701818","#f2a0b0","#e06a8a","#c4472e","#b03080","#7a3aa0","#4a2a7a","#bfe8e0","#7fc4d0","#3a9fc2","#2f7fc2","#1f4f9a","#1c2f5a","#c8e6a0","#9fb86a","#4faa4a","#2f6b3a","#1f4a3a","#12281a","#e6dfa0","#b8b060","#7a8a3a","#8fb0ab"],Iv=[["base","Main"],["second","Pattern"],["belly","Belly"],["eye","Eyes"],["accent","Horn, claw"],["hair","Hair, feather"],["membrane","Wing skin"],["cloth","Cloth"]],ca="base",Lv=n=>n==="eye";function Ji(n,e,t){he.look[n]=e,Lv(n)||n==="cover"?t||n==="cover"?xn():Ki=!0:li(Cn,he.look,Tt[he.type].bellyDir),ws=!0,t&&vn()}var Dv={body:'<path d="M7 5c5-3 11 1 10 7s-6 9-10 7-4-11 0-14z"/>',eyes:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',mouth:'<path d="M3 9c3 2 15 2 18 0-1 7-5 9-9 9s-8-2-9-9z"/><path d="M8 10l1 3 1.5-3M13.5 10l1.5 3 1-3"/>',ears:'<path d="M5 20C3 12 6 4 9 3c2 4 3 8 2 13M19 20c2-8-1-16-4-17-2 4-3 8-2 13"/>',horns:'<path d="M7 20c-4-5-4-12 0-17 0 6 2 9 5 11M17 20c4-5 4-12 0-17 0 6-2 9-5 11"/>',limbs:'<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17" cy="9" r="2"/><path d="M7 17c0-3 2-5 5-5s5 2 5 5-2 3-5 3-5 0-5-3z"/>',wings:'<path d="M3 6c7-2 14 1 18 8-4-1-6 0-8 2-1-3-4-4-6-3 0-3-2-5-4-7z"/>',tails:'<path d="M4 18c6 2 12-2 12-7s-5-6-7-3 1 5 4 4"/>',back:'<path d="M2 18c4-6 16-6 20 0M7 13l1-5 2 4M12 12l1-6 1.5 6M16 13l2-4 0 5"/>',skin:'<path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z"/>'},Uv=n=>{let e=document.createElement("span");return e.innerHTML='<svg class="ic" viewBox="0 0 24 24">'+Dv[n]+"</svg>",e.firstChild};function Nv(){let n=At("tabs");n.replaceChildren();for(let[e,t]of[["body","Body"],...ko,["skin","Skin"]])n.append(X("button",{class:bn===e?"on":"",onclick:()=>{bn=e,mt=null,Li()}},Uv(e),t))}var $h=()=>window.innerWidth<1e3;function Jn(){let n=At("left");if(n.replaceChildren(),n.scrollTop=0,$h()&&mt&&mt!=="body"&&pa(mt)){eu(n,pa(mt));return}if(bn==="body"){if(n.append(X("h3",null,"Body shape"),X("p",{class:"note"},"Drag the white dots to bend and stretch the spine. Tap a dot to change how thick the body is there.")),Kn>=0&&he.nodes[Kn]){let i=he.nodes[Kn];n.append(X("h4",null,"Selected section"),un("Width",.02,.6,i.rx,s=>{i.rx=s,Ki=!0}),un("Depth",.02,.6,i.ry,s=>{i.ry=s,Ki=!0}),X("div",{class:"row"},X("button",{onclick:()=>{let s=Math.min(Kn,he.nodes.length-2),r=he.nodes[s],a=he.nodes[s+1],o=he.nodes.length-1;he.nodes.splice(s+1,0,{y:(r.y+a.y)/2,z:(r.z+a.z)/2,rx:(r.rx+a.rx)/2,ry:(r.ry+a.ry)/2,role:a.role});for(let c of he.parts)if(c.u>=0&&c.u<=1){let h=c.u*o;c.u=(h>s?h<s+1?s+(h-s)*2:h+1:h)/(o+1)}Kn=s+1,xn(),vn(),Jn()}},"Add section"),X("button",{class:"warn",disabled:he.nodes.length<=3,onclick:()=>{let s=he.nodes.length-1,r=Kn;he.nodes.splice(r,1);for(let a of he.parts)if(a.u>=0&&a.u<=1){let o=a.u*s;a.u=on((o>r?o-1:o)/(s-1),0,1)}Kn=-1,xn(),vn(),Jn()}},"Remove")))}let t=i=>{let s=he.nodes.reduce((o,c)=>o+c.y,0)/he.nodes.length,r=he.nodes.reduce((o,c)=>o+c.z,0)/he.nodes.length,a=Math.max(...he.nodes.map(o=>Math.hypot(o.y-s,o.z-r)));if(i>1&&a>2.6||i<1&&a<.25){Wt(i>1?"That is as long as a body can get.":"That is as short as a body can get.");return}for(let o of he.nodes)o.y=s+(o.y-s)*i,o.z=r+(o.z-r)*i;xn(),vn()};n.append(X("h4",null,"Whole body"),X("div",{class:"row"},X("button",{onclick:()=>t(1.08)},"Longer"),X("button",{onclick:()=>t(1/1.08)},"Shorter")),un("Bulk",.5,1.8,he.bulk,i=>{he.bulk=i,Ki=!0}),X("h4",null,"Male / female"),X("p",{class:"note"},"How different the two sexes look: build, limb thickness, and the size of horns, crests and manes."),un("Difference",0,1.6,he.dimorph,i=>{he.dimorph=i,Ki=!0}));return}if(bn==="skin"){let t=he.look;n.append(X("h3",null,"Skin and colour"),X("h4",null,"Covering"),xr([["skin","Smooth"],["fur","Fur"],["scales","Scales"],["chitin","Shell"],["slime","Slick"]],t.cover,r=>{Ji("cover",r,!0),Jn()})),t.cover==="fur"&&n.append(un("Fur length",0,1,t.furLen,r=>Ji("furLen",r)),un("Shagginess",0,1,t.furDroop,r=>Ji("furDroop",r))),n.append(X("h4",null,"Colours"),X("div",{class:"cols"},Iv.map(([r,a])=>X("button",{class:"colbtn"+(ca===r?" on":""),onclick:()=>{ca=r,Jn()}},X("i",{style:"background:"+t[r]}),a))),X("div",{class:"sw"},Pv.map(r=>X("button",{style:"background:"+r,onclick:()=>{Ji(ca,r,!0),Jn()}}))));let i={};new Ue(t[ca]).getHSL(i);let s=r=>{Ji(ca,"#"+new Ue().setHSL(i.h,i.s,i.l).getHexString(),r),r&&Jn()};n.append(un("Hue",0,1,i.h,r=>{i.h=r,s()},()=>s(!0)),un("Richness",0,1,i.s,r=>{i.s=r,s()},()=>s(!0)),un("Lightness",.03,.97,i.l,r=>{i.l=r,s()},()=>s(!0)),X("h4",null,"Pattern"),xr([[0,"Plain"],[1,"Stripes"],[2,"Spots"],[3,"Patches"],[4,"Mosaic"],[5,"Saddle"],[6,"Speckle"],[7,"Bands"]],t.pattern,r=>{Ji("pattern",r,!0),Jn()}),un("Pattern size",.3,3.5,3.8-t.patScale,r=>Ji("patScale",3.8-r)),un("Belly colour",0,1,t.bellyAmt,r=>Ji("bellyAmt",r)),X("div",{class:"row"},X("button",{onclick:()=>{let r=Math.random(),a=(o,c,h)=>"#"+new Ue().setHSL((o+1)%1,c,h).getHexString();Object.assign(t,{base:a(r,.3+Math.random()*.5,.3+Math.random()*.35),second:a(r+(Math.random()-.5)*.5,.4+Math.random()*.4,.12+Math.random()*.3),belly:a(r+.05,.25,.8),hair:a(r+.5*Math.random(),.5,.25+Math.random()*.3),membrane:a(r+.08,.45,.6),eye:a(Math.random(),.75,.45),pattern:Math.floor(Math.random()*8)}),xn(),vn(),Jn()}},"Surprise me")));return}n.append(X("h3",null,ko.find(t=>t[0]===bn)[1]),X("p",{class:"note"},"Tap to add. Then tap the part on your creature and drag it where you want it."));let e=X("div",{class:"grid"});for(let[t,i]of Object.entries(Pt))i.cat===bn&&(Nh(ge,t)?e.append(X("button",{class:"tile",onclick:()=>{if(Yf())return;let s=hi(he,t,pt.frames);xn(),vn(),vr(s.id)}},X("img",{src:Zh(t),alt:""}),i.n)):e.append(X("button",{class:"tile locked",onclick:()=>fa("part:"+t,ia[t],i.n,Jn)},X("img",{src:Zh(t),alt:""}),i.n,X("small",null,"Locked \xB7 "+ia[t]))));n.append(e)}var Bf=48,Yf=()=>he.parts.length<Bf?!1:(Wt("A creature can carry "+Bf+" parts at most. Remove one first."),!0),kv={human:"Toes",paw:"Paw",hoof:"Hoof",talon:"Talons",webbed:"Webbed",stump:"Stump",point:"Spike",none:"None",claw:"Claws",pincer:"Pincer",mitt:"Mitt"};function Fv(){let n=At("right"),e=mt&&mt!=="body"?pa(mt):null;n.classList.toggle("hidden",!e||$h()),n.replaceChildren(),e&&!$h()&&eu(n,e)}function eu(n,e){var o;let t=Pt[e.kind],i=()=>{n.replaceChildren(),eu(n,e)},s=()=>{Bo(pt,e),ga()},r=()=>{Qr(pt),Kh(),vn()},a=e.size;n.append(X("h3",null,t.n),X("p",{class:"note"},t.ridge?"Drag it along the body to move the row.":"Drag it on the creature to move it."),un(t.cat==="limbs"?"Length":"Size",-2,2,0,c=>{e.size=a*Math.pow(2,c),s()},r));for(let[c,h]of Object.entries(t.P||{})){if(c==="suckers"){n.append(xr([[1,"Suckers"],[0,"Smooth"]],e.p[c],l=>{e.p[c]=l,s(),r(),i()}));continue}n.append(un(h[3],h[0],h[1],(o=e.p[c])!=null?o:h[2],l=>{e.p[c]=l,s()},r,["count","feathers","tines"].includes(c)?1:0))}if(t.C)for(let[c,h]of Object.entries(t.C))n.append(X("h4",null,h.includes("paw")?"Foot":"Hand"),xr(h.map(l=>[l,kv[l]]),e.p[c],l=>{e.p[c]=l,s(),r(),i()}));t.kind==="surface"&&n.append(X("h4",null,"Angle"),un("Twist",-3.14,3.14,e.rot,c=>{e.rot=c,s()},r),un("Tilt",-1.5,1.5,e.tilt,c=>{e.tilt=c,s()},r)),n.append(X("h4",null,"Pair"),xr([[!0,"Mirrored pair"],[!1,"Single"]],e.mirror,c=>{e.mirror=c,s(),r(),i()})),n.append(X("h4",null,"Shown on"),xr([[null,"Both"],["f","Female only"],["m","Male only"]],e.sexOnly,c=>{e.sexOnly=c,s(),r(),i()}),X("div",{class:"row",style:"margin-top:10px"},X("button",{onclick:()=>{if(Yf())return;let c=JSON.parse(JSON.stringify(e));c.id="p"+Date.now().toString(36),c.u=on(c.u-.08,-.9,1.9),he.parts.push(c),xn(),vn(),vr(c.id)}},"Copy"),X("button",{class:"warn",onclick:()=>{he.parts=he.parts.filter(c=>c.id!==e.id),mt=null,xn(),vn(),Li()}},"Delete")),X("div",{class:"row"},X("button",{onclick:()=>vr(null)},"Done")))}function tu(){At("topbar").replaceChildren(X("button",{onclick:qf},"Home"),X("input",{value:he.name,maxLength:30,onchange:e=>{he.name=e.target.value||"Creature",vn()}}),X("div",{class:"seg"},X("button",{class:he.sex==="f"?"on":"",onclick:()=>zf("f")},"Female"),X("button",{class:he.sex==="m"?"on":"",onclick:()=>zf("m")},"Male")),X("button",{disabled:kn.length<2,onclick:()=>{kn.length>1&&(yr.push(kn.pop()),kf(kn[kn.length-1]))}},"Undo"),X("button",{disabled:!yr.length,onclick:()=>{if(yr.length){let e=yr.pop();kn.push(e),kf(e)}}},"Redo"),X("button",{class:da?"on":"",onclick:()=>{da=!da,tu()}},"Spin"),X("button",{onclick:Hv},"Photo"),X("button",{onclick:()=>nu()},"Save"),X("button",{class:"battle",onclick:iu},"\u2694\uFE0F Battle"))}function zf(n){he.sex=n,xn(),vn(),Li()}function Li(){Nv(),Jn(),Fv(),tu(),br(),ga(),At("hint").textContent=mt&&mt!=="body"?"":"Drag to spin. Pinch to zoom. Tap a part to select it."}function nu(n){he.id||(he.id="c"+Date.now().toString(36));let e=gt.get("cc.saved",[]).filter(i=>i.id!==he.id);e.unshift({id:he.id,name:he.name,thumb:jo(he),data:JSON.parse(JSON.stringify(he))});let t=gt.set("cc.saved",e);gt.set("cc.current",he),t?n||Wt('Saved "'+he.name+'"'):Wt("Could not save: the phone is out of storage for this app. Delete a creature or two.")}var ge=gt.get("cc.meta",null);if(!ge){ge=Object.assign(Dh(),gt.get("cc.record",{}));for(let n of[...gt.get("cc.saved",[]).map(e=>e.data),gt.get("cc.current",null)])n&&!Lh.includes(n.type)&&(ge.unlocked["type:"+n.type]=!0)}ge=Object.assign(Dh(),ge);for(let n of["stats","seen","typesWon","goals","unlocked","boosts"])ge[n]||(ge[n]={});Array.isArray(ge.hall)||(ge.hall=[]);var Fn=()=>gt.set("cc.meta",ge);function fa(n,e,t,i){if(ge.points<e){Wt("Not enough points: "+t+" costs "+e+", you have "+ge.points+".");return}confirm("Unlock "+t+" for "+e+" points?")&&(ge.points-=e,ge.unlocked[n]=!0,Fn(),Wt("Unlocked "+t),i&&i())}function Ov(n,e=1,t){ge.stats[n]=t?Math.max(ge.stats[n]||0,e):(ge.stats[n]||0)+e,Fn()}function Bv(n,e){let t=e.tier||0;ge.points+=n,ge.champions++,ge.typesWon[he.type]=1,ge.stats.bestRankWon=Math.max(ge.stats.bestRankWon||0,t),t>=ge.rank&&ge.rank<$o&&(ge.rank=t+1,ge.rankSel=ge.rank),ge.hall.unshift({name:he.name,type:he.type,rank:t,when:Date.now()}),ge.hall.length=Math.min(ge.hall.length,30),he.champion=(he.champion||0)+1,Fn(),gt.set("cc.current",he);let i=gt.get("cc.saved",[]),s=i.find(r=>r.id===he.id);s&&(s.data=JSON.parse(JSON.stringify(he)),s.name=he.name,gt.set("cc.saved",i))}var ti=Nf({scene:kt,camera:ft,M:Cn,h:X,store:gt,sun:On,showAd:Xh,toast:Wt,stat:Ov,crown:Bv,bonus:n=>{ge.points+=n,Fn()},onDone:zv,meta:()=>ge,saveMeta:Fn});function iu(n){let e=gt.get("cc.run",null);e&&e.id!==he.id&&!(n&&n.id===he.id)&&!confirm("Another creature is still in the middle of a gauntlet. Starting this one abandons that run. Go ahead?")||(nu(!0),mt=null,Kt.orbit.enabled=!1,At("editor").classList.add("hidden"),At("start").classList.add("hidden"),ei.visible=Qn.visible=!1,li(Cn,he.look,Tt[he.type].bellyDir),ti.start(he,n&&n.id===he.id?n:null),br())}function zv(n){ei.visible=Qn.visible=!0,Kt.orbit.enabled=!0;for(let t of[Cn.skin,...Cn.shells])t.emissive.setRGB(0,0,0);let e=ge;if(n.type==="dead"){e.fallen++,Fn(),gt.set("cc.saved",gt.get("cc.saved",[]).filter(t=>t.id!==he.id)),gt.set("cc.current",null),pt&&(ei.remove(pt.group),dr(pt.group),pt=null),he=null,dn=!1,At("start").classList.remove("hidden"),Gt(),br();return}it.count=0,dn=!0,At("editor").classList.remove("hidden"),xn(),n.type==="champion"&&nu(!0),Li(),jh(),n.type==="champion"&&Wt(he.name+" is champion! +"+n.points+" points")}function Hv(){let t=St.getPixelRatio(),i=ft.zoom;Qn.visible=!1,St.setPixelRatio(1),St.setSize(1920,1080,!1),ft.clearViewOffset(),ft.aspect=1920/1080,ft.zoom=i,ft.updateProjectionMatrix(),St.render(kt,ft);let s=Es.toDataURL("image/png");Qn.visible=!0,St.setPixelRatio(t),ft.zoom=i,br(),St.render(kt,ft);let r=(he.name||"creature").replace(/[^\w-]+/g,"_")+"_"+Date.now().toString(36)+".png";window.Android&&window.Android.savePng?window.Android.savePng(s.split(",")[1],r):(X("a",{href:s,download:r}).click(),Wt("Photo downloaded"))}window.ccToast=Wt;window.ccBack=()=>ti.active?ti.back():!dn&&nn?(nn=null,Gt(),!0):dn?(mt?vr(null):qf(),!0):!1;function ha(n){let e=gt.get("cc.run",null);e&&n.id&&e.id===n.id&&(gt.set("cc.run",null),Wt("Gauntlet abandoned. It starts again from fight one.")),he=n,mt=null,Kn=-1,bn="body",kn=[],yr=[],dn=!0,he.sex===void 0&&(he.sex="f"),he.look.cloth||(he.look.cloth="#6b4a2e"),At("start").classList.add("hidden"),At("editor").classList.remove("hidden"),xn(),vn(),Li(),jh()}function qf(){gt.set("cc.current",he),dn=!1,At("editor").classList.add("hidden"),At("start").classList.remove("hidden"),Gt()}var Ko={};function Jh(){let n=At("runpill");if(!n)return;let e=$i(ge);n.textContent="\u26A1 "+e.n+"/"+e.max+(e.next?" \xB7 "+Xo(e.next)+" \xB7 \u{1F4FA} +1":"")}setInterval(Jh,1e3);var nn=null;function Vv(){let n=At("start"),e=(o,c,h,l,u,f,p)=>X("div",{class:"shoprow"+(u?" owned":"")},X("div",{class:"ico"},o),X("div",{class:"what"},X("b",null,c),p&&X("small",{class:"req"},p),X("small",null,h)),u?X("span",{class:"have"},typeof u=="string"?u:"Owned"):X("button",{class:ge.points>=l?"go":"",onclick:f},l+" pts")),t=o=>Ms.filter(c=>c.cat===o).sort((c,h)=>c.cost-h.cost).map(c=>e(c.icon,c.name,Zo({id:c.id,cat:o,q:1,rar:0,lvl:1}),c.cost,kh(ge,c)&&(c.cost?"Owned":"Free"),()=>fa("item:"+o+":"+c.id,c.cost,c.name,Gt),c.reqText?"Needs "+c.reqText:c.hands===2?"Needs two free hands":"")),i=o=>{let[c,h]=o.prog(ge),l=c>=h,u=!!ge.goals[o.id];return X("div",{class:"shoprow"+(u?" owned":"")},X("div",{class:"ico"},u?"\u2705":l?"\u{1F3C5}":"\u{1F3AF}"),X("div",{class:"what"},X("b",null,o.name),X("small",null,o.text),X("div",{class:"bar"},X("i",{style:"width:"+Math.min(100,c/h*100)+"%"})),X("small",null,Math.min(c,h)+" / "+h)),u?X("span",{class:"have"},"Claimed"):X("button",{class:l?"go":"",disabled:!l,onclick:()=>{ge.goals[o.id]=1,ge.points+=o.pts,Fn(),Wt(o.name+": +"+o.pts+" points"),Gt()}},(l?"Claim ":"")+o.pts+" pts"))},s=(o,c)=>X("div",{class:"shoprow"},X("div",{class:"what"},X("small",null,o),X("b",null,String(c)))),r={Goals:()=>[...zh].sort((o,c)=>(ge.goals[o.id]?2:Jo(ge,o)?0:1)-(ge.goals[c.id]?2:Jo(ge,c)?0:1)).map(i),Records:()=>[s("Fights won",ge.stats.fightsWon||0),s("Titles won",ge.champions),s("Creatures lost",ge.fallen),s("Highest rank open",ge.rank),s("Furthest fight reached",ge.stats.bestFight||0),s("Elite opponents beaten",ge.stats.elites||0),s("Different rewards picked",Object.keys(ge.seen).length+" of "+Ms.length),s("Body types crowned",Object.keys(ge.typesWon).length+" of 8"),...ge.hall.map(o=>X("div",{class:"shoprow"},X("div",{class:"ico"},"\u{1F451}"),X("div",{class:"what"},X("b",null,o.name),X("small",null,Tt[o.type].name+" \xB7 Rank "+o.rank+" \xB7 "+new Date(o.when).toLocaleDateString()))))],Bodies:()=>Object.entries(Tt).map(([o,c])=>e("\u{1F9EC}",c.name,c.blurb,pr[o],Yo(ge,o)&&(pr[o]?"Owned":"Free"),()=>fa("type:"+o,pr[o],"the "+c.name+" body",Gt))),Parts:()=>Object.entries(ia).map(([o,c])=>e(X("img",{src:Zh(o),alt:""}),Pt[o].n,"Body part for the workshop ("+ko.find(h=>h[0]===Pt[o].cat)[1]+").",c,Nh(ge,o),()=>fa("part:"+o,c,Pt[o].n,Gt))),Weapons:()=>t("weapon"),Abilities:()=>t("ability"),Relics:()=>t("relic"),Boosts:()=>mf.map(o=>{let c=o.consumable?ge.revives:ge.boosts[o.id]||0,h=c>=o.max,l=o.cost(c);return e(o.icon,o.name+(o.consumable?" (holding "+c+")":o.max>1?" (level "+c+" of "+o.max+")":""),o.text,l,h&&(o.consumable?"Full":"Maxed"),()=>{if(ge.points<l){Wt("Not enough points: "+o.name+" costs "+l+", you have "+ge.points+".");return}ge.points-=l,o.consumable?ge.revives++:ge.boosts[o.id]=c+1,Fn(),Gt()})})},a={Goals:"Targets that pay points when you claim them.",Records:"Your history in the Colosseum, and the hall of champions.",Weapons:"Weapons you own can turn up as rewards after a fight. A creature holds one per hand.",Abilities:"Abilities you own can turn up as rewards, if the creature has the right body for them.",Relics:"Relics are passive rewards that stack. Many only work, or work better, with the right body.",Parts:"Extra parts for building creatures. Starter creatures may already carry some of these.",Bodies:"New body types to start from.",Boosts:"Permanent upgrades, and revives."};n.replaceChildren(X("h1",null,nn==="Goals"||nn==="Records"?"Your ":"The ",X("span",null,nn==="Goals"?"Goals":nn==="Records"?"Records":"Shop"),X("small",{class:"record"},X("b",null,ge.points+" points")," ",X("button",{class:"shopbtn",onclick:()=>{nn=null,Gt()}},"Back"))),X("div",{class:"chips",style:"margin-top:10px"},Object.keys(r).map(o=>X("button",{class:o===nn?"on":"",onclick:()=>{nn=o,Gt()}},o))),X("p",{class:"note"},a[nn]+(nn==="Goals"||nn==="Records"?"":" Points come from every fight won (more for later fights) and a big bonus for the title.")),X("div",{class:"shop"},r[nn]())),n.scrollTop=0}function Gt(){let n=At("start"),e=gt.get("cc.saved",[]),t=gt.get("cc.current",null);if(nn){Vv();return}let i=ge,s=gt.get("cc.run",null),r=s&&(t&&t.id===s.id?t:(e.find(h=>h.id===s.id)||{}).data),a=!!r;s&&!a&&gt.set("cc.run",null);let o=Bh(ge),c=wf(ge);n.replaceChildren(...[X("h1",null,"Critter ",X("span",null,"Arena"),X("small",{class:"record"},X("span",{class:"runpill",id:"runpill",onclick:async()=>{let h=$i(ge);if(h.n>=h.max)return;let l=await Xh();l.ok?(Wo(ge),Fn(),Jh(),Wt("+1 run")):l.why&&Wt(l.why)}}),X("button",{class:"goalbtn"+(c?" ready":""),onclick:()=>{nn="Goals",Gt()}},"Goals"+(c?" ("+c+")":"")),X("button",{class:"shopbtn",onclick:()=>{nn="Bodies",Gt()}},"Shop")," ",X("b",null,i.points+" points")," \xB7 "+i.champions+(i.champions===1?" champion":" champions")+" \xB7 "+i.fallen+" fallen")),a&&X("div",{class:"card resume",onclick:()=>{he=JSON.parse(JSON.stringify(r)),iu(s)}},X("b",null,"Gauntlet in progress"),X("small",null,r.name+" is waiting for fight "+(s.round+1)+" of 10. Tap to return to the Colosseum.")),!ge.seenIntro&&X("div",{class:"card resume intro"},X("b",null,"Welcome to Critter Arena"),X("small",null,"1. Pick a body below and build a critter: drag the dots to shape it, add parts, colour it."),X("small",null,"2. Hit Battle to enter the Colosseum: ten fights to the death, with a reward to choose after each win."),X("small",null,"3. How you build it matters: size is health, teeth and claws are attack, arms hold weapons. Spend the points you earn in the Shop."),X("button",{onclick:h=>{h.stopPropagation(),ge.seenIntro=1,Fn(),Gt()}},"Got it")),o&&X("div",{class:"card resume gift",onclick:()=>{let h=Sf(ge);Fn(),h&&Wt("Daily gift: +"+h.points+" points"+(h.revive?" and a revive":"")),Gt()}},X("b",null,"\u{1F381} Daily gift: +"+o.points+" points"+(o.revive?" and a revive":"")),X("small",null,"Day "+o.streak+" in a row. Come back tomorrow for more; every seventh day adds a revive. Tap to collect.")),X("h2",null,"Start from a body type"),X("div",{class:"cards"},X("div",{class:"card",onclick:()=>{let h=Object.keys(Tt).filter(l=>Yo(ge,l));ha(ra(Math.random,{type:h[Math.floor(Math.random()*h.length)]}))}},X("div",{class:"dice"},"?"),X("b",null,"Random"),X("small",null,"Roll a surprise creature")),Object.entries(Tt).map(([h,l])=>Yo(ge,h)?X("div",{class:"card",onclick:()=>ha(bs(h))},X("img",{src:Ko[h]||(Ko[h]=jo(bs(h))),alt:""}),X("b",null,l.name),X("small",null,l.blurb)):X("div",{class:"card locked",onclick:()=>fa("type:"+h,pr[h],"the "+l.name+" body",Gt)},X("img",{src:Ko[h]||(Ko[h]=jo(bs(h))),alt:""}),X("b",null,l.name),X("small",null,"Locked \xB7 "+pr[h]+" points"))))].filter(Boolean)),Jh(),(t||e.length)&&n.append(X("h2",null,"Your creatures"),X("div",{class:"cards"},t&&X("div",{class:"card",onclick:()=>ha(t)},X("img",{src:jo(t),alt:""}),X("b",null,"Continue"),X("small",null,t.name)),e.map(h=>X("div",{class:"card",onclick:()=>ha(JSON.parse(JSON.stringify(h.data)))},X("img",{src:h.thumb,alt:""}),X("b",null,h.name),X("small",null,Tt[h.data.type].name+(h.data.champion?" \xB7 Champion"+(h.data.champion>1?" x"+h.data.champion:""):"")),X("button",{class:"del warn",onclick:l=>{l.stopPropagation(),confirm('Delete "'+h.name+'"?')&&(gt.set("cc.saved",gt.get("cc.saved",[]).filter(u=>u.id!==h.id)),Gt())}},"\xD7")))))}Kt.orbit=new Ro(ft,Es);Object.assign(Kt.orbit,{enableDamping:!0,dampingFactor:.12,enablePan:!1,autoRotateSpeed:2.2,rotateSpeed:.9,maxPolarAngle:Math.PI*.62,minPolarAngle:.15});Kt.orbit.addEventListener("change",Cv);br();Gt();requestAnimationFrame(Gf);window.__cc={get data(){return he},get cr(){return pt},open:ha,newCreature:bs,select:vr,PARTS:Pt,TEMPLATES:Tt,setTab:n=>{bn=n,Li()},camera:ft,controls:Kt,fitCamera:jh,rebuild:xn,renderer:St,scene:kt,arena:ti,get meta(){return ge},saveMeta:Fn,renderStart:Gt,runsNow:$i,enterBattle:iu,randomCreature:ra,addPartTest:n=>hi(he,n,pt.frames),pickAt:(n,e)=>(Qo({clientX:n,clientY:e}),Qh()),state:()=>({sel:mt,tab:bn,down:{...it}})};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
