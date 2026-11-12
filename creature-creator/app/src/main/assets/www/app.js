(()=>{var fs={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ps={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},kf=0,su=1,Ff=2;var md=1,$c=2,mi=3,Hi=0,jt=1,Ct=2,Bi=0,zi=1,Nr=2,ru=3,ou=4,Of=5,rs=100,Bf=101,zf=102,Hf=103,Vf=104,Gf=200,Wf=201,Xf=202,Yf=203,Pl=204,Il=205,qf=206,Zf=207,$f=208,Jf=209,Kf=210,jf=211,Qf=212,ep=213,tp=214,Ll=0,Dl=1,Ul=2,Ys=3,Nl=4,kl=5,Fl=6,Ol=7,gd=0,np=1,ip=2,ni=0,sp=1,rp=2,op=3,Jc=4,ap=5,lp=6,cp=7;var _d=300,qs=301,Zs=302,Bl=303,zl=304,ba=306,kr=1e3,ls=1001,Hl=1002,Sn=1003,hp=1004;var _o=1005;var ei=1006,Ja=1007;var cs=1008;var xi=1009,xd=1010,yd=1011,Fr=1012,Kc=1013,hs=1014,ti=1015,qr=1016,jc=1017,Qc=1018,$s=1020,vd=35902,bd=1021,Md=1022,Hn=1023,Sd=1024,wd=1025,Gs=1026,Js=1027,eh=1028,th=1029,Ed=1030,nh=1031;var ih=1033,Xo=33776,Yo=33777,qo=33778,Zo=33779,Vl=35840,Gl=35841,Wl=35842,Xl=35843,Yl=36196,ql=37492,Zl=37496,$l=37808,Jl=37809,Kl=37810,jl=37811,Ql=37812,ec=37813,tc=37814,nc=37815,ic=37816,sc=37817,rc=37818,oc=37819,ac=37820,lc=37821,$o=36492,cc=36494,hc=36495,Td=36283,uc=36284,dc=36285,fc=36286;var Jo=2300,pc=2301,Ka=2302,au=2400,lu=2401,cu=2402;var up=3200,dp=3201;var Ad=0,fp=1,Oi="",Ot="srgb",nr="srgb-linear",Ma="linear",at="srgb";var Ts=7680;var hu=519,pp=512,mp=513,gp=514,Rd=515,_p=516,xp=517,yp=518,vp=519,uu=35044;var du="300 es",gi=2e3,Ko=2001,yi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let i=this._listeners[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fu=1234567,Lr=Math.PI/180,Or=180/Math.PI;function ir(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Jt[n&255]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[t&63|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[i&255]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]).toLowerCase()}function It(n,e,t){return Math.max(e,Math.min(t,n))}function sh(n,e){return(n%e+e)%e}function bp(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Mp(n,e,t){return n!==e?(t-n)/(e-n):0}function Dr(n,e,t){return(1-t)*n+t*e}function Sp(n,e,t,i){return Dr(n,e,1-Math.exp(-t*i))}function wp(n,e=1){return e-Math.abs(sh(n,e*2)-e)}function Ep(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Tp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Ap(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Rp(n,e){return n+Math.random()*(e-n)}function Cp(n){return n*(.5-Math.random())}function Pp(n){n!==void 0&&(fu=n);let e=fu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ip(n){return n*Lr}function Lp(n){return n*Or}function Dp(n){return(n&n-1)===0&&n!==0}function Up(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Np(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function kp(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),h=r((e+i)/2),l=o((e+i)/2),u=r((e-i)/2),f=o((e-i)/2),p=r((i-e)/2),g=o((i-e)/2);switch(s){case"XYX":n.set(a*l,c*u,c*f,a*h);break;case"YZY":n.set(c*f,a*l,c*u,a*h);break;case"ZXZ":n.set(c*u,c*f,a*l,a*h);break;case"XZX":n.set(a*l,c*g,c*p,a*h);break;case"YXY":n.set(c*p,a*l,c*g,a*h);break;case"ZYZ":n.set(c*g,c*p,a*l,a*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Hs(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function en(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Zr={DEG2RAD:Lr,RAD2DEG:Or,generateUUID:ir,clamp:It,euclideanModulo:sh,mapLinear:bp,inverseLerp:Mp,lerp:Dr,damp:Sp,pingpong:wp,smoothstep:Ep,smootherstep:Tp,randInt:Ap,randFloat:Rp,randFloatSpread:Cp,seededRandom:Pp,degToRad:Ip,radToDeg:Lp,isPowerOfTwo:Dp,ceilPowerOfTwo:Up,floorPowerOfTwo:Np,setQuaternionFromProperEuler:kp,normalize:en,denormalize:Hs},Se=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(It(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ze=class n{constructor(e,t,i,s,r,o,a,c,h){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,h)}set(e,t,i,s,r,o,a,c,h){let l=this.elements;return l[0]=e,l[1]=s,l[2]=a,l[3]=t,l[4]=r,l[5]=c,l[6]=i,l[7]=o,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],c=i[6],h=i[1],l=i[4],u=i[7],f=i[2],p=i[5],g=i[8],_=s[0],m=s[3],d=s[6],x=s[1],b=s[4],y=s[7],P=s[2],T=s[5],A=s[8];return r[0]=o*_+a*x+c*P,r[3]=o*m+a*b+c*T,r[6]=o*d+a*y+c*A,r[1]=h*_+l*x+u*P,r[4]=h*m+l*b+u*T,r[7]=h*d+l*y+u*A,r[2]=f*_+p*x+g*P,r[5]=f*m+p*b+g*T,r[8]=f*d+p*y+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8];return t*o*l-t*a*h-i*r*l+i*a*c+s*r*h-s*o*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8],u=l*o-a*h,f=a*c-l*r,p=h*r-o*c,g=t*u+i*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(s*h-l*i)*_,e[2]=(a*i-s*o)*_,e[3]=f*_,e[4]=(l*t-s*c)*_,e[5]=(s*r-a*t)*_,e[6]=p*_,e[7]=(i*c-h*t)*_,e[8]=(o*t-i*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let c=Math.cos(r),h=Math.sin(r);return this.set(i*c,i*h,-i*(c*o+h*a)+o+e,-s*h,s*c,-s*(-h*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(ja.makeScale(e,t)),this}rotate(e){return this.premultiply(ja.makeRotation(-e)),this}translate(e,t){return this.premultiply(ja.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ja=new ze;function Cd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function jo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Fp(){let n=jo("canvas");return n.style.display="block",n}var pu={};function Pr(n){n in pu||(pu[n]=!0,console.warn(n))}function Op(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function Bp(n){let e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function zp(n){let e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var je={enabled:!0,workingColorSpace:nr,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===at&&(n.r=_i(n.r),n.g=_i(n.g),n.b=_i(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===at&&(n.r=Ws(n.r),n.g=Ws(n.g),n.b=Ws(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Oi?Ma:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function _i(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ws(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var mu=[.64,.33,.3,.6,.15,.06],gu=[.2126,.7152,.0722],_u=[.3127,.329],xu=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yu=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);je.define({[nr]:{primaries:mu,whitePoint:_u,transfer:Ma,toXYZ:xu,fromXYZ:yu,luminanceCoefficients:gu,workingColorSpaceConfig:{unpackColorSpace:Ot},outputColorSpaceConfig:{drawingBufferColorSpace:Ot}},[Ot]:{primaries:mu,whitePoint:_u,transfer:at,toXYZ:xu,fromXYZ:yu,luminanceCoefficients:gu,outputColorSpaceConfig:{drawingBufferColorSpace:Ot}}});var As,mc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{As===void 0&&(As=jo("canvas")),As.width=e.width,As.height=e.height;let i=As.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=As}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=jo("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=_i(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(_i(t[i]/255)*255):t[i]=_i(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Hp=0,Qo=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Hp++}),this.uuid=ir(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Qa(s[o].image)):r.push(Qa(s[o]))}else r=Qa(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function Qa(n){return typeof HTMLImageElement!="undefined"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&n instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&n instanceof ImageBitmap?mc.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Vp=0,hn=class n extends yi{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=ls,s=ls,r=ei,o=cs,a=Hn,c=xi,h=n.DEFAULT_ANISOTROPY,l=Oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vp++}),this.uuid=ir(),this.name="",this.source=new Qo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=h,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Se(0,0),this.repeat=new Se(1,1),this.center=new Se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==_d)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case kr:e.x=e.x-Math.floor(e.x);break;case ls:e.x=e.x<0?0:1;break;case Hl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case kr:e.y=e.y-Math.floor(e.y);break;case ls:e.y=e.y<0?0:1;break;case Hl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};hn.DEFAULT_IMAGE=null;hn.DEFAULT_MAPPING=_d;hn.DEFAULT_ANISOTROPY=1;var lt=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,h=c[0],l=c[4],u=c[8],f=c[1],p=c[5],g=c[9],_=c[2],m=c[6],d=c[10];if(Math.abs(l-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(h+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let b=(h+1)/2,y=(p+1)/2,P=(d+1)/2,T=(l+f)/4,A=(u+_)/4,C=(g+m)/4;return b>y&&b>P?b<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(b),s=T/i,r=A/i):y>P?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=T/s,r=C/s):P<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),i=A/r,s=C/r),this.set(i,s,r,t),this}let x=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-l)*(f-l));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-_)/x,this.z=(f-l)/x,this.w=Math.acos((h+p+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},gc=class extends yi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t);let s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ei,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let r=new hn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Qo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Vn=class extends gc{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},ea=class extends hn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Sn,this.minFilter=Sn,this.wrapR=ls,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var _c=class extends hn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Sn,this.minFilter=Sn,this.wrapR=ls,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Wt=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let c=i[s+0],h=i[s+1],l=i[s+2],u=i[s+3],f=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=h,e[t+2]=l,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(u!==_||c!==f||h!==p||l!==g){let m=1-a,d=c*f+h*p+l*g+u*_,x=d>=0?1:-1,b=1-d*d;if(b>Number.EPSILON){let P=Math.sqrt(b),T=Math.atan2(P,d*x);m=Math.sin(m*T)/P,a=Math.sin(a*T)/P}let y=a*x;if(c=c*m+f*y,h=h*m+p*y,l=l*m+g*y,u=u*m+_*y,m===1-a){let P=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=P,h*=P,l*=P,u*=P}}e[t]=c,e[t+1]=h,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],c=i[s+1],h=i[s+2],l=i[s+3],u=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+l*u+c*p-h*f,e[t+1]=c*g+l*f+h*u-a*p,e[t+2]=h*g+l*p+a*f-c*u,e[t+3]=l*g-a*u-c*f-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,h=a(i/2),l=a(s/2),u=a(r/2),f=c(i/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*l*u+h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u-f*p*g;break;case"YXZ":this._x=f*l*u+h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u+f*p*g;break;case"ZXY":this._x=f*l*u-h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u-f*p*g;break;case"ZYX":this._x=f*l*u-h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u+f*p*g;break;case"YZX":this._x=f*l*u+h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u-f*p*g;break;case"XZY":this._x=f*l*u-h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],h=t[2],l=t[6],u=t[10],f=i+a+u;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(l-c)*p,this._y=(r-h)*p,this._z=(o-s)*p}else if(i>a&&i>u){let p=2*Math.sqrt(1+i-a-u);this._w=(l-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+h)/p}else if(a>u){let p=2*Math.sqrt(1+a-i-u);this._w=(r-h)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+l)/p}else{let p=2*Math.sqrt(1+u-i-a);this._w=(o-s)/p,this._x=(r+h)/p,this._y=(c+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(It(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,h=t._z,l=t._w;return this._x=i*l+o*a+s*h-r*c,this._y=s*l+o*c+r*a-i*h,this._z=r*l+o*h+i*c-s*a,this._w=o*l-i*a-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+i*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let h=Math.sqrt(c),l=Math.atan2(h,a),u=Math.sin((1-t)*l)/h,f=Math.sin(t*l)/h;return this._w=o*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(vu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(vu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,h=2*(o*s-a*i),l=2*(a*t-r*s),u=2*(r*i-o*t);return this.x=t+c*h+o*u-a*l,this.y=i+c*l+a*h-r*u,this.z=s+c*u+r*l-o*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return el.copy(this).projectOnVector(e),this.sub(el)}reflect(e){return this.sub(el.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(It(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},el=new I,vu=new Wt,wn=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(On.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(On.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=On.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,On):On.fromBufferAttribute(r,o),On.applyMatrix4(e.matrixWorld),this.expandByPoint(On);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),xo.copy(i.boundingBox)),xo.applyMatrix4(e.matrixWorld),this.union(xo)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,On),On.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Mr),yo.subVectors(this.max,Mr),Rs.subVectors(e.a,Mr),Cs.subVectors(e.b,Mr),Ps.subVectors(e.c,Mr),Li.subVectors(Cs,Rs),Di.subVectors(Ps,Cs),ji.subVectors(Rs,Ps);let t=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-ji.z,ji.y,Li.z,0,-Li.x,Di.z,0,-Di.x,ji.z,0,-ji.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-ji.y,ji.x,0];return!tl(t,Rs,Cs,Ps,yo)||(t=[1,0,0,0,1,0,0,0,1],!tl(t,Rs,Cs,Ps,yo))?!1:(vo.crossVectors(Li,Di),t=[vo.x,vo.y,vo.z],tl(t,Rs,Cs,Ps,yo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,On).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(On).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(hi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},hi=[new I,new I,new I,new I,new I,new I,new I,new I],On=new I,xo=new wn,Rs=new I,Cs=new I,Ps=new I,Li=new I,Di=new I,ji=new I,Mr=new I,yo=new I,vo=new I,Qi=new I;function tl(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Qi.fromArray(n,r);let a=s.x*Math.abs(Qi.x)+s.y*Math.abs(Qi.y)+s.z*Math.abs(Qi.z),c=e.dot(Qi),h=t.dot(Qi),l=i.dot(Qi);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>a)return!1}return!0}var Gp=new wn,Sr=new I,nl=new I,vi=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Gp.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Sr.subVectors(e,this.center);let t=Sr.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Sr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(nl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Sr.copy(e.center).add(nl)),this.expandByPoint(Sr.copy(e.center).sub(nl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},ui=new I,il=new I,bo=new I,Ui=new I,sl=new I,Mo=new I,rl=new I,Vi=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ui)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ui.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ui.copy(this.origin).addScaledVector(this.direction,t),ui.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){il.copy(e).add(t).multiplyScalar(.5),bo.copy(t).sub(e).normalize(),Ui.copy(this.origin).sub(il);let r=e.distanceTo(t)*.5,o=-this.direction.dot(bo),a=Ui.dot(this.direction),c=-Ui.dot(bo),h=Ui.lengthSq(),l=Math.abs(1-o*o),u,f,p,g;if(l>0)if(u=o*c-a,f=o*a-c,g=r*l,u>=0)if(f>=-g)if(f<=g){let _=1/l;u*=_,f*=_,p=u*(u+o*f+2*a)+f*(o*u+f+2*c)+h}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+h):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(il).addScaledVector(bo,f),p}intersectSphere(e,t){ui.subVectors(e.center,this.origin);let i=ui.dot(this.direction),s=ui.dot(ui)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,c,h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,f=this.origin;return h>=0?(i=(e.min.x-f.x)*h,s=(e.max.x-f.x)*h):(i=(e.max.x-f.x)*h,s=(e.min.x-f.x)*h),l>=0?(r=(e.min.y-f.y)*l,o=(e.max.y-f.y)*l):(r=(e.max.y-f.y)*l,o=(e.min.y-f.y)*l),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,ui)!==null}intersectTriangle(e,t,i,s,r){sl.subVectors(t,e),Mo.subVectors(i,e),rl.crossVectors(sl,Mo);let o=this.direction.dot(rl),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ui.subVectors(this.origin,e);let c=a*this.direction.dot(Mo.crossVectors(Ui,Mo));if(c<0)return null;let h=a*this.direction.dot(sl.cross(Ui));if(h<0||c+h>o)return null;let l=-a*Ui.dot(rl);return l<0?null:this.at(l/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Xe=class n{constructor(e,t,i,s,r,o,a,c,h,l,u,f,p,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,h,l,u,f,p,g,_,m)}set(e,t,i,s,r,o,a,c,h,l,u,f,p,g,_,m){let d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=h,d[6]=l,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/Is.setFromMatrixColumn(e,0).length(),r=1/Is.setFromMatrixColumn(e,1).length(),o=1/Is.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=o*l,p=o*u,g=a*l,_=a*u;t[0]=c*l,t[4]=-c*u,t[8]=h,t[1]=p+g*h,t[5]=f-_*h,t[9]=-a*c,t[2]=_-f*h,t[6]=g+p*h,t[10]=o*c}else if(e.order==="YXZ"){let f=c*l,p=c*u,g=h*l,_=h*u;t[0]=f+_*a,t[4]=g*a-p,t[8]=o*h,t[1]=o*u,t[5]=o*l,t[9]=-a,t[2]=p*a-g,t[6]=_+f*a,t[10]=o*c}else if(e.order==="ZXY"){let f=c*l,p=c*u,g=h*l,_=h*u;t[0]=f-_*a,t[4]=-o*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*l,t[9]=_-f*a,t[2]=-o*h,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let f=o*l,p=o*u,g=a*l,_=a*u;t[0]=c*l,t[4]=g*h-p,t[8]=f*h+_,t[1]=c*u,t[5]=_*h+f,t[9]=p*h-g,t[2]=-h,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let f=o*c,p=o*h,g=a*c,_=a*h;t[0]=c*l,t[4]=_-f*u,t[8]=g*u+p,t[1]=u,t[5]=o*l,t[9]=-a*l,t[2]=-h*l,t[6]=p*u+g,t[10]=f-_*u}else if(e.order==="XZY"){let f=o*c,p=o*h,g=a*c,_=a*h;t[0]=c*l,t[4]=-u,t[8]=h*l,t[1]=f*u+_,t[5]=o*l,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*l,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Wp,e,Xp)}lookAt(e,t,i){let s=this.elements;return vn.subVectors(e,t),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),Ni.crossVectors(i,vn),Ni.lengthSq()===0&&(Math.abs(i.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),Ni.crossVectors(i,vn)),Ni.normalize(),So.crossVectors(vn,Ni),s[0]=Ni.x,s[4]=So.x,s[8]=vn.x,s[1]=Ni.y,s[5]=So.y,s[9]=vn.y,s[2]=Ni.z,s[6]=So.z,s[10]=vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],c=i[8],h=i[12],l=i[1],u=i[5],f=i[9],p=i[13],g=i[2],_=i[6],m=i[10],d=i[14],x=i[3],b=i[7],y=i[11],P=i[15],T=s[0],A=s[4],C=s[8],S=s[12],M=s[1],L=s[5],V=s[9],G=s[13],Y=s[2],Q=s[6],$=s[10],ce=s[14],v=s[3],B=s[7],O=s[11],J=s[15];return r[0]=o*T+a*M+c*Y+h*v,r[4]=o*A+a*L+c*Q+h*B,r[8]=o*C+a*V+c*$+h*O,r[12]=o*S+a*G+c*ce+h*J,r[1]=l*T+u*M+f*Y+p*v,r[5]=l*A+u*L+f*Q+p*B,r[9]=l*C+u*V+f*$+p*O,r[13]=l*S+u*G+f*ce+p*J,r[2]=g*T+_*M+m*Y+d*v,r[6]=g*A+_*L+m*Q+d*B,r[10]=g*C+_*V+m*$+d*O,r[14]=g*S+_*G+m*ce+d*J,r[3]=x*T+b*M+y*Y+P*v,r[7]=x*A+b*L+y*Q+P*B,r[11]=x*C+b*V+y*$+P*O,r[15]=x*S+b*G+y*ce+P*J,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],h=e[13],l=e[2],u=e[6],f=e[10],p=e[14],g=e[3],_=e[7],m=e[11],d=e[15];return g*(+r*c*u-s*h*u-r*a*f+i*h*f+s*a*p-i*c*p)+_*(+t*c*p-t*h*f+r*o*f-s*o*p+s*h*l-r*c*l)+m*(+t*h*u-t*a*p-r*o*u+i*o*p+r*a*l-i*h*l)+d*(-s*a*l-t*c*u+t*a*f+s*o*u-i*o*f+i*c*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],l=e[8],u=e[9],f=e[10],p=e[11],g=e[12],_=e[13],m=e[14],d=e[15],x=u*m*h-_*f*h+_*c*p-a*m*p-u*c*d+a*f*d,b=g*f*h-l*m*h-g*c*p+o*m*p+l*c*d-o*f*d,y=l*_*h-g*u*h+g*a*p-o*_*p-l*a*d+o*u*d,P=g*u*c-l*_*c-g*a*f+o*_*f+l*a*m-o*u*m,T=t*x+i*b+s*y+r*P;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/T;return e[0]=x*A,e[1]=(_*f*r-u*m*r-_*s*p+i*m*p+u*s*d-i*f*d)*A,e[2]=(a*m*r-_*c*r+_*s*h-i*m*h-a*s*d+i*c*d)*A,e[3]=(u*c*r-a*f*r-u*s*h+i*f*h+a*s*p-i*c*p)*A,e[4]=b*A,e[5]=(l*m*r-g*f*r+g*s*p-t*m*p-l*s*d+t*f*d)*A,e[6]=(g*c*r-o*m*r-g*s*h+t*m*h+o*s*d-t*c*d)*A,e[7]=(o*f*r-l*c*r+l*s*h-t*f*h-o*s*p+t*c*p)*A,e[8]=y*A,e[9]=(g*u*r-l*_*r-g*i*p+t*_*p+l*i*d-t*u*d)*A,e[10]=(o*_*r-g*a*r+g*i*h-t*_*h-o*i*d+t*a*d)*A,e[11]=(l*a*r-o*u*r-l*i*h+t*u*h+o*i*p-t*a*p)*A,e[12]=P*A,e[13]=(l*_*s-g*u*s+g*i*f-t*_*f-l*i*m+t*u*m)*A,e[14]=(g*a*s-o*_*s-g*i*c+t*_*c+o*i*m-t*a*m)*A,e[15]=(o*u*s-l*a*s+l*i*c-t*u*c-o*i*f+t*a*f)*A,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,c=e.z,h=r*o,l=r*a;return this.set(h*o+i,h*a-s*c,h*c+s*a,0,h*a+s*c,l*a+i,l*c-s*o,0,h*c-s*a,l*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,h=r+r,l=o+o,u=a+a,f=r*h,p=r*l,g=r*u,_=o*l,m=o*u,d=a*u,x=c*h,b=c*l,y=c*u,P=i.x,T=i.y,A=i.z;return s[0]=(1-(_+d))*P,s[1]=(p+y)*P,s[2]=(g-b)*P,s[3]=0,s[4]=(p-y)*T,s[5]=(1-(f+d))*T,s[6]=(m+x)*T,s[7]=0,s[8]=(g+b)*A,s[9]=(m-x)*A,s[10]=(1-(f+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=Is.set(s[0],s[1],s[2]).length(),o=Is.set(s[4],s[5],s[6]).length(),a=Is.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Bn.copy(this);let h=1/r,l=1/o,u=1/a;return Bn.elements[0]*=h,Bn.elements[1]*=h,Bn.elements[2]*=h,Bn.elements[4]*=l,Bn.elements[5]*=l,Bn.elements[6]*=l,Bn.elements[8]*=u,Bn.elements[9]*=u,Bn.elements[10]*=u,t.setFromRotationMatrix(Bn),i.x=r,i.y=o,i.z=a,this}makePerspective(e,t,i,s,r,o,a=gi){let c=this.elements,h=2*r/(t-e),l=2*r/(i-s),u=(t+e)/(t-e),f=(i+s)/(i-s),p,g;if(a===gi)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ko)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=gi){let c=this.elements,h=1/(t-e),l=1/(i-s),u=1/(o-r),f=(t+e)*h,p=(i+s)*l,g,_;if(a===gi)g=(o+r)*u,_=-2*u;else if(a===Ko)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Is=new I,Bn=new Xe,Wp=new I(0,0,0),Xp=new I(1,1,1),Ni=new I,So=new I,vn=new I,bu=new Xe,Mu=new Wt,un=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],h=s[5],l=s[9],u=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(It(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-It(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(It(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-It(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(It(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-It(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-l,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return bu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bu,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Mu.setFromEuler(this),this.setFromQuaternion(Mu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};un.DEFAULT_ORDER="XYZ";var Br=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Yp=0,Su=new I,Ls=new Wt,di=new Xe,wo=new I,wr=new I,qp=new I,Zp=new Wt,wu=new I(1,0,0),Eu=new I(0,1,0),Tu=new I(0,0,1),Au={type:"added"},$p={type:"removed"},Ds={type:"childadded",child:null},ol={type:"childremoved",child:null},Xt=class n extends yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=ir(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new I,t=new un,i=new Wt,s=new I(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xe},normalMatrix:{value:new ze}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Br,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ls.setFromAxisAngle(e,t),this.quaternion.multiply(Ls),this}rotateOnWorldAxis(e,t){return Ls.setFromAxisAngle(e,t),this.quaternion.premultiply(Ls),this}rotateX(e){return this.rotateOnAxis(wu,e)}rotateY(e){return this.rotateOnAxis(Eu,e)}rotateZ(e){return this.rotateOnAxis(Tu,e)}translateOnAxis(e,t){return Su.copy(e).applyQuaternion(this.quaternion),this.position.add(Su.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wu,e)}translateY(e){return this.translateOnAxis(Eu,e)}translateZ(e){return this.translateOnAxis(Tu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?wo.copy(e):wo.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),wr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(wr,wo,this.up):di.lookAt(wo,wr,this.up),this.quaternion.setFromRotationMatrix(di),s&&(di.extractRotation(s.matrixWorld),Ls.setFromRotationMatrix(di),this.quaternion.premultiply(Ls.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Au),Ds.child=e,this.dispatchEvent(Ds),Ds.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent($p),ol.child=e,this.dispatchEvent(ol),ol.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),di.multiply(e.parent.matrixWorld)),e.applyMatrix4(di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Au),Ds.child=e,this.dispatchEvent(Ds),Ds.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,e,qp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,Zp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){let u=c[h];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,h=this.material.length;c<h;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),h=o(e.textures),l=o(e.images),u=o(e.shapes),f=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),l.length>0&&(i.images=l),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let c=[];for(let h in a){let l=a[h];delete l.metadata,c.push(l)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Xt.DEFAULT_UP=new I(0,1,0);Xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var zn=new I,fi=new I,al=new I,pi=new I,Us=new I,Ns=new I,Ru=new I,ll=new I,cl=new I,hl=new I,ul=new lt,dl=new lt,fl=new lt,os=class n{constructor(e=new I,t=new I,i=new I){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),zn.subVectors(e,t),s.cross(zn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){zn.subVectors(s,t),fi.subVectors(i,t),al.subVectors(e,t);let o=zn.dot(zn),a=zn.dot(fi),c=zn.dot(al),h=fi.dot(fi),l=fi.dot(al),u=o*h-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,p=(h*c-a*l)*f,g=(o*l-a*c)*f;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(e,t,i,s,r,o,a,c){return this.getBarycoord(e,t,i,s,pi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,pi.x),c.addScaledVector(o,pi.y),c.addScaledVector(a,pi.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return ul.setScalar(0),dl.setScalar(0),fl.setScalar(0),ul.fromBufferAttribute(e,t),dl.fromBufferAttribute(e,i),fl.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(ul,r.x),o.addScaledVector(dl,r.y),o.addScaledVector(fl,r.z),o}static isFrontFacing(e,t,i,s){return zn.subVectors(i,t),fi.subVectors(e,t),zn.cross(fi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),zn.cross(fi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;Us.subVectors(s,i),Ns.subVectors(r,i),ll.subVectors(e,i);let c=Us.dot(ll),h=Ns.dot(ll);if(c<=0&&h<=0)return t.copy(i);cl.subVectors(e,s);let l=Us.dot(cl),u=Ns.dot(cl);if(l>=0&&u<=l)return t.copy(s);let f=c*u-l*h;if(f<=0&&c>=0&&l<=0)return o=c/(c-l),t.copy(i).addScaledVector(Us,o);hl.subVectors(e,r);let p=Us.dot(hl),g=Ns.dot(hl);if(g>=0&&p<=g)return t.copy(r);let _=p*h-c*g;if(_<=0&&h>=0&&g<=0)return a=h/(h-g),t.copy(i).addScaledVector(Ns,a);let m=l*g-p*u;if(m<=0&&u-l>=0&&p-g>=0)return Ru.subVectors(r,s),a=(u-l)/(u-l+(p-g)),t.copy(s).addScaledVector(Ru,a);let d=1/(m+_+f);return o=_*d,a=f*d,t.copy(i).addScaledVector(Us,o).addScaledVector(Ns,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Pd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ki={h:0,s:0,l:0},Eo={h:0,s:0,l:0};function pl(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Le=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ot){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=je.workingColorSpace){return this.r=e,this.g=t,this.b=i,je.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=je.workingColorSpace){if(e=sh(e,1),t=It(t,0,1),i=It(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=pl(o,r,e+1/3),this.g=pl(o,r,e),this.b=pl(o,r,e-1/3)}return je.toWorkingColorSpace(this,s),this}setStyle(e,t=Ot){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ot){let i=Pd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=_i(e.r),this.g=_i(e.g),this.b=_i(e.b),this}copyLinearToSRGB(e){return this.r=Ws(e.r),this.g=Ws(e.g),this.b=Ws(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ot){return je.fromWorkingColorSpace(Kt.copy(this),e),Math.round(It(Kt.r*255,0,255))*65536+Math.round(It(Kt.g*255,0,255))*256+Math.round(It(Kt.b*255,0,255))}getHexString(e=Ot){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.fromWorkingColorSpace(Kt.copy(this),t);let i=Kt.r,s=Kt.g,r=Kt.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,h,l=(a+o)/2;if(a===o)c=0,h=0;else{let u=o-a;switch(h=l<=.5?u/(o+a):u/(2-o-a),o){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=l,e}getRGB(e,t=je.workingColorSpace){return je.fromWorkingColorSpace(Kt.copy(this),t),e.r=Kt.r,e.g=Kt.g,e.b=Kt.b,e}getStyle(e=Ot){je.fromWorkingColorSpace(Kt.copy(this),e);let t=Kt.r,i=Kt.g,s=Kt.b;return e!==Ot?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ki),this.setHSL(ki.h+e,ki.s+t,ki.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ki),e.getHSL(Eo);let i=Dr(ki.h,Eo.h,t),s=Dr(ki.s,Eo.s,t),r=Dr(ki.l,Eo.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Kt=new Le;Le.NAMES=Pd;var Jp=0,bi=class extends yi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jp++}),this.uuid=ir(),this.name="",this.blending=zi,this.side=Hi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Pl,this.blendDst=Il,this.blendEquation=rs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Le(0,0,0),this.blendAlpha=0,this.depthFunc=Ys,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=hu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ts,this.stencilZFail=Ts,this.stencilZPass=Ts,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(i.blending=this.blending),this.side!==Hi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Pl&&(i.blendSrc=this.blendSrc),this.blendDst!==Il&&(i.blendDst=this.blendDst),this.blendEquation!==rs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ys&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==hu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ts&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ts&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ts&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Bt=class extends bi{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.combine=gd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Rt=new I,To=new Se,xt=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=uu,this.updateRanges=[],this.gpuType=ti,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)To.fromBufferAttribute(this,t),To.applyMatrix3(e),this.setXY(t,To.x,To.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Hs(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=en(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Hs(t,this.array)),t}setX(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Hs(t,this.array)),t}setY(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Hs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Hs(t,this.array)),t}setW(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=en(t,this.array),i=en(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=en(t,this.array),i=en(i,this.array),s=en(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=en(t,this.array),i=en(i,this.array),s=en(s,this.array),r=en(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==uu&&(e.usage=this.usage),e}};var ta=class extends xt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var na=class extends xt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var $e=class extends xt{constructor(e,t,i){super(new Float32Array(e),t,i)}},Kp=0,Pn=new Xe,ml=new Xt,ks=new I,bn=new wn,Er=new wn,Ft=new I,ct=class n extends yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=ir(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Cd(e)?na:ta)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new ze().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Pn.makeRotationFromQuaternion(e),this.applyMatrix4(Pn),this}rotateX(e){return Pn.makeRotationX(e),this.applyMatrix4(Pn),this}rotateY(e){return Pn.makeRotationY(e),this.applyMatrix4(Pn),this}rotateZ(e){return Pn.makeRotationZ(e),this.applyMatrix4(Pn),this}translate(e,t,i){return Pn.makeTranslation(e,t,i),this.applyMatrix4(Pn),this}scale(e,t,i){return Pn.makeScale(e,t,i),this.applyMatrix4(Pn),this}lookAt(e){return ml.lookAt(e),ml.updateMatrix(),this.applyMatrix4(ml.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ks).negate(),this.translate(ks.x,ks.y,ks.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new $e(i,3))}else{for(let i=0,s=t.count;i<s;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];bn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let i=this.boundingSphere.center;if(bn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Er.setFromBufferAttribute(a),this.morphTargetsRelative?(Ft.addVectors(bn.min,Er.min),bn.expandByPoint(Ft),Ft.addVectors(bn.max,Er.max),bn.expandByPoint(Ft)):(bn.expandByPoint(Er.min),bn.expandByPoint(Er.max))}bn.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)Ft.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ft));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let h=0,l=a.count;h<l;h++)Ft.fromBufferAttribute(a,h),c&&(ks.fromBufferAttribute(e,h),Ft.add(ks)),s=Math.max(s,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new xt(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<i.count;C++)a[C]=new I,c[C]=new I;let h=new I,l=new I,u=new I,f=new Se,p=new Se,g=new Se,_=new I,m=new I;function d(C,S,M){h.fromBufferAttribute(i,C),l.fromBufferAttribute(i,S),u.fromBufferAttribute(i,M),f.fromBufferAttribute(r,C),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,M),l.sub(h),u.sub(h),p.sub(f),g.sub(f);let L=1/(p.x*g.y-g.x*p.y);isFinite(L)&&(_.copy(l).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(L),m.copy(u).multiplyScalar(p.x).addScaledVector(l,-g.x).multiplyScalar(L),a[C].add(_),a[S].add(_),a[M].add(_),c[C].add(m),c[S].add(m),c[M].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let C=0,S=x.length;C<S;++C){let M=x[C],L=M.start,V=M.count;for(let G=L,Y=L+V;G<Y;G+=3)d(e.getX(G+0),e.getX(G+1),e.getX(G+2))}let b=new I,y=new I,P=new I,T=new I;function A(C){P.fromBufferAttribute(s,C),T.copy(P);let S=a[C];b.copy(S),b.sub(P.multiplyScalar(P.dot(S))).normalize(),y.crossVectors(T,S);let L=y.dot(c[C])<0?-1:1;o.setXYZW(C,b.x,b.y,b.z,L)}for(let C=0,S=x.length;C<S;++C){let M=x[C],L=M.start,V=M.count;for(let G=L,Y=L+V;G<Y;G+=3)A(e.getX(G+0)),A(e.getX(G+1)),A(e.getX(G+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new xt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);let s=new I,r=new I,o=new I,a=new I,c=new I,h=new I,l=new I,u=new I;if(e)for(let f=0,p=e.count;f<p;f+=3){let g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),l.subVectors(o,r),u.subVectors(s,r),l.cross(u),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,m),a.add(l),c.add(l),h.add(l),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,h.x,h.y,h.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),l.subVectors(o,r),u.subVectors(s,r),l.cross(u),i.setXYZ(f+0,l.x,l.y,l.z),i.setXYZ(f+1,l.x,l.y,l.z),i.setXYZ(f+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ft.fromBufferAttribute(e,t),Ft.normalize(),e.setXYZ(t,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(a,c){let h=a.array,l=a.itemSize,u=a.normalized,f=new h.constructor(c.length*l),p=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?p=c[_]*a.data.stride+a.offset:p=c[_]*l;for(let d=0;d<l;d++)f[g++]=h[p++]}return new xt(f,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],h=e(c,i);t.setAttribute(a,h)}let r=this.morphAttributes;for(let a in r){let c=[],h=r[a];for(let l=0,u=h.length;l<u;l++){let f=h[l],p=e(f,i);c.push(p)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let h=o[a];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let h=i[c];e.data.attributes[c]=h.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let h=this.morphAttributes[c],l=[];for(let u=0,f=h.length;u<f;u++){let p=h[u];l.push(p.toJSON(e.data))}l.length>0&&(s[c]=l,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let s=e.attributes;for(let h in s){let l=s[h];this.setAttribute(h,l.clone(t))}let r=e.morphAttributes;for(let h in r){let l=[],u=r[h];for(let f=0,p=u.length;f<p;f++)l.push(u[f].clone(t));this.morphAttributes[h]=l}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let h=0,l=o.length;h<l;h++){let u=o[h];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Cu=new Xe,es=new Vi,Ao=new vi,Pu=new I,Ro=new I,Co=new I,Po=new I,gl=new I,Io=new I,Iu=new I,Lo=new I,Ne=class extends Xt{constructor(e=new ct,t=new Bt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Io.set(0,0,0);for(let c=0,h=r.length;c<h;c++){let l=a[c],u=r[c];l!==0&&(gl.fromBufferAttribute(u,e),o?Io.addScaledVector(gl,l):Io.addScaledVector(gl.sub(t),l))}t.add(Io)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ao.copy(i.boundingSphere),Ao.applyMatrix4(r),es.copy(e.ray).recast(e.near),!(Ao.containsPoint(es.origin)===!1&&(es.intersectSphere(Ao,Pu)===null||es.origin.distanceToSquared(Pu)>(e.far-e.near)**2))&&(Cu.copy(r).invert(),es.copy(e.ray).applyMatrix4(Cu),!(i.boundingBox!==null&&es.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,es)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],d=o[m.materialIndex],x=Math.max(m.start,p.start),b=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=x,P=b;y<P;y+=3){let T=a.getX(y),A=a.getX(y+1),C=a.getX(y+2);s=Do(this,d,e,i,h,l,u,T,A,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){let x=a.getX(m),b=a.getX(m+1),y=a.getX(m+2);s=Do(this,o,e,i,h,l,u,x,b,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],d=o[m.materialIndex],x=Math.max(m.start,p.start),b=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let y=x,P=b;y<P;y+=3){let T=y,A=y+1,C=y+2;s=Do(this,d,e,i,h,l,u,T,A,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){let x=m,b=m+1,y=m+2;s=Do(this,o,e,i,h,l,u,x,b,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function jp(n,e,t,i,s,r,o,a){let c;if(e.side===jt?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,e.side===Hi,a),c===null)return null;Lo.copy(a),Lo.applyMatrix4(n.matrixWorld);let h=t.ray.origin.distanceTo(Lo);return h<t.near||h>t.far?null:{distance:h,point:Lo.clone(),object:n}}function Do(n,e,t,i,s,r,o,a,c,h){n.getVertexPosition(a,Ro),n.getVertexPosition(c,Co),n.getVertexPosition(h,Po);let l=jp(n,e,t,i,Ro,Co,Po,Iu);if(l){let u=new I;os.getBarycoord(Iu,Ro,Co,Po,u),s&&(l.uv=os.getInterpolatedAttribute(s,a,c,h,u,new Se)),r&&(l.uv1=os.getInterpolatedAttribute(r,a,c,h,u,new Se)),o&&(l.normal=os.getInterpolatedAttribute(o,a,c,h,u,new I),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));let f={a,b:c,c:h,normal:new I,materialIndex:0};os.getNormal(Ro,Co,Po,f.normal),l.face=f,l.barycoord=u}return l}var Gn=class n extends ct{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],h=[],l=[],u=[],f=0,p=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new $e(h,3)),this.setAttribute("normal",new $e(l,3)),this.setAttribute("uv",new $e(u,2));function g(_,m,d,x,b,y,P,T,A,C,S){let M=y/A,L=P/C,V=y/2,G=P/2,Y=T/2,Q=A+1,$=C+1,ce=0,v=0,B=new I;for(let O=0;O<$;O++){let J=O*L-G;for(let se=0;se<Q;se++){let ie=se*M-V;B[_]=ie*x,B[m]=J*b,B[d]=Y,h.push(B.x,B.y,B.z),B[_]=0,B[m]=0,B[d]=T>0?1:-1,l.push(B.x,B.y,B.z),u.push(se/A),u.push(1-O/C),ce+=1}}for(let O=0;O<C;O++)for(let J=0;J<A;J++){let se=f+J+Q*O,ie=f+J+Q*(O+1),D=f+(J+1)+Q*(O+1),q=f+(J+1)+Q*O;c.push(se,ie,q),c.push(ie,D,q),v+=6}a.addGroup(p,v,S),p+=v,f+=ce}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ks(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function tn(n){let e={};for(let t=0;t<n.length;t++){let i=Ks(n[t]);for(let s in i)e[s]=i[s]}return e}function Qp(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Id(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}var em={clone:Ks,merge:tn},tm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,nm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,In=class extends bi{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tm,this.fragmentShader=nm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ks(e.uniforms),this.uniformsGroups=Qp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},ia=class extends Xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=gi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Fi=new I,Lu=new Se,Du=new Se,Gt=class extends ia{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Or*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Lr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Or*2*Math.atan(Math.tan(Lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z)}getViewSize(e,t){return this.getViewBounds(e,Lu,Du),t.subVectors(Du,Lu)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Lr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,h=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/h,s*=o.width/c,i*=o.height/h}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Fs=-90,Os=1,xc=class extends Xt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Gt(Fs,Os,e,t);s.layers=this.layers,this.add(s);let r=new Gt(Fs,Os,e,t);r.layers=this.layers,this.add(r);let o=new Gt(Fs,Os,e,t);o.layers=this.layers,this.add(o);let a=new Gt(Fs,Os,e,t);a.layers=this.layers,this.add(a);let c=new Gt(Fs,Os,e,t);c.layers=this.layers,this.add(c);let h=new Gt(Fs,Os,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,c]=t;for(let h of t)this.remove(h);if(e===gi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ko)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,h,l]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,o),e.setRenderTarget(i,2,s),e.render(t,a),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,l),e.setRenderTarget(u,f,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},sa=class extends hn{constructor(e,t,i,s,r,o,a,c,h,l){e=e!==void 0?e:[],t=t!==void 0?t:qs,super(e,t,i,s,r,o,a,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},yc=class extends Vn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new sa(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ei}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Gn(5,5,5),r=new In({name:"CubemapFromEquirect",uniforms:Ks(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:jt,blending:Bi});r.uniforms.tEquirect.value=t;let o=new Ne(s,r),a=t.minFilter;return t.minFilter===cs&&(t.minFilter=ei),new xc(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}},_l=new I,im=new I,sm=new ze,Mn=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=_l.subVectors(i,t).cross(im.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(_l),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||sm.getNormalMatrix(e),s=this.coplanarPoint(_l).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ts=new vi,Uo=new I,zr=class{constructor(e=new Mn,t=new Mn,i=new Mn,s=new Mn,r=new Mn,o=new Mn){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=gi){let i=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],h=s[4],l=s[5],u=s[6],f=s[7],p=s[8],g=s[9],_=s[10],m=s[11],d=s[12],x=s[13],b=s[14],y=s[15];if(i[0].setComponents(c-r,f-h,m-p,y-d).normalize(),i[1].setComponents(c+r,f+h,m+p,y+d).normalize(),i[2].setComponents(c+o,f+l,m+g,y+x).normalize(),i[3].setComponents(c-o,f-l,m-g,y-x).normalize(),i[4].setComponents(c-a,f-u,m-_,y-b).normalize(),t===gi)i[5].setComponents(c+a,f+u,m+_,y+b).normalize();else if(t===Ko)i[5].setComponents(a,u,_,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(e){return ts.center.set(0,0,0),ts.radius=.7071067811865476,ts.applyMatrix4(e.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(Uo.x=s.normal.x>0?e.max.x:e.min.x,Uo.y=s.normal.y>0?e.max.y:e.min.y,Uo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Uo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Ld(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function rm(n){let e=new WeakMap;function t(a,c){let h=a.array,l=a.usage,u=h.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,h,l),a.onUploadCallback();let p;if(h instanceof Float32Array)p=n.FLOAT;else if(h instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=n.SHORT;else if(h instanceof Uint32Array)p=n.UNSIGNED_INT;else if(h instanceof Int32Array)p=n.INT;else if(h instanceof Int8Array)p=n.BYTE;else if(h instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:f,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,c,h){let l=c.array,u=c.updateRanges;if(n.bindBuffer(h,a),u.length===0)n.bufferSubData(h,0,l);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){let g=u[f],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];n.bufferSubData(h,_.start*l.BYTES_PER_ELEMENT,l,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let l=e.get(a);(!l||l.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let h=e.get(a);if(h===void 0)e.set(a,t(a,c));else if(h.version<a.version){if(h.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,a,c),h.version=a.version}}return{get:s,remove:r,update:o}}var Mi=class n extends ct{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),c=Math.floor(s),h=a+1,l=c+1,u=e/a,f=t/c,p=[],g=[],_=[],m=[];for(let d=0;d<l;d++){let x=d*f-o;for(let b=0;b<h;b++){let y=b*u-r;g.push(y,-x,0),_.push(0,0,1),m.push(b/a),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let x=0;x<a;x++){let b=x+h*d,y=x+h*(d+1),P=x+1+h*(d+1),T=x+1+h*d;p.push(b,y,T),p.push(y,P,T)}this.setIndex(p),this.setAttribute("position",new $e(g,3)),this.setAttribute("normal",new $e(_,3)),this.setAttribute("uv",new $e(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},om=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,am=`#ifdef USE_ALPHAHASH
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
#endif`,lm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,um=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,dm=`#ifdef USE_AOMAP
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
#endif`,fm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pm=`#ifdef USE_BATCHING
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
#endif`,mm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_m=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,ym=`#ifdef USE_IRIDESCENCE
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
#endif`,vm=`#ifdef USE_BUMPMAP
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
#endif`,bm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Mm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Em=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Tm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Am=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Rm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Cm=`#define PI 3.141592653589793
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
} // validated`,Pm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Im=`vec3 transformedNormal = objectNormal;
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
#endif`,Lm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Um=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Nm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,km="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Om=`#ifdef USE_ENVMAP
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
#endif`,Bm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,zm=`#ifdef USE_ENVMAP
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
#endif`,Hm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vm=`#ifdef USE_ENVMAP
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
#endif`,Gm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ym=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qm=`#ifdef USE_GRADIENTMAP
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
}`,Zm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$m=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Km=`uniform bool receiveShadow;
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
#endif`,jm=`#ifdef USE_ENVMAP
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
#endif`,Qm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,e0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,t0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,n0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,i0=`PhysicalMaterial material;
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
#endif`,s0=`struct PhysicalMaterial {
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
}`,r0=`
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
#endif`,o0=`#if defined( RE_IndirectDiffuse )
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
#endif`,a0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,l0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,c0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,h0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,u0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,d0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,f0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,p0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,m0=`#if defined( USE_POINTS_UV )
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
#endif`,g0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,x0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,y0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,v0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,b0=`#ifdef USE_MORPHTARGETS
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
#endif`,M0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,S0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,w0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,E0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,T0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,A0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,R0=`#ifdef USE_NORMALMAP
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
#endif`,C0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,P0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,I0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,L0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,D0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,U0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,N0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,k0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,F0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,O0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,B0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,z0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,H0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,V0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,G0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,W0=`float getShadowMask() {
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
}`,X0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Y0=`#ifdef USE_SKINNING
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
#endif`,q0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Z0=`#ifdef USE_SKINNING
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
#endif`,$0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,J0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,K0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,j0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Q0=`#ifdef USE_TRANSMISSION
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
#endif`,eg=`#ifdef USE_TRANSMISSION
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
#endif`,tg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,rg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,og=`uniform sampler2D t2D;
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
}`,ag=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ug=`#include <common>
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
}`,dg=`#if DEPTH_PACKING == 3200
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
}`,fg=`#define DISTANCE
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
}`,pg=`#define DISTANCE
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
}`,mg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,gg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_g=`uniform float scale;
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
}`,xg=`uniform vec3 diffuse;
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
}`,yg=`#include <common>
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
}`,vg=`uniform vec3 diffuse;
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
}`,bg=`#define LAMBERT
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
}`,Mg=`#define LAMBERT
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
}`,Sg=`#define MATCAP
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
}`,wg=`#define MATCAP
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
}`,Eg=`#define NORMAL
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
}`,Tg=`#define NORMAL
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
}`,Ag=`#define PHONG
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
}`,Rg=`#define PHONG
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
}`,Cg=`#define STANDARD
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
}`,Pg=`#define STANDARD
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
}`,Ig=`#define TOON
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
}`,Lg=`#define TOON
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
}`,Dg=`uniform float size;
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
}`,Ug=`uniform vec3 diffuse;
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
}`,Ng=`#include <common>
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
}`,kg=`uniform vec3 color;
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
}`,Fg=`uniform float rotation;
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
}`,Og=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:om,alphahash_pars_fragment:am,alphamap_fragment:lm,alphamap_pars_fragment:cm,alphatest_fragment:hm,alphatest_pars_fragment:um,aomap_fragment:dm,aomap_pars_fragment:fm,batching_pars_vertex:pm,batching_vertex:mm,begin_vertex:gm,beginnormal_vertex:_m,bsdfs:xm,iridescence_fragment:ym,bumpmap_pars_fragment:vm,clipping_planes_fragment:bm,clipping_planes_pars_fragment:Mm,clipping_planes_pars_vertex:Sm,clipping_planes_vertex:wm,color_fragment:Em,color_pars_fragment:Tm,color_pars_vertex:Am,color_vertex:Rm,common:Cm,cube_uv_reflection_fragment:Pm,defaultnormal_vertex:Im,displacementmap_pars_vertex:Lm,displacementmap_vertex:Dm,emissivemap_fragment:Um,emissivemap_pars_fragment:Nm,colorspace_fragment:km,colorspace_pars_fragment:Fm,envmap_fragment:Om,envmap_common_pars_fragment:Bm,envmap_pars_fragment:zm,envmap_pars_vertex:Hm,envmap_physical_pars_fragment:jm,envmap_vertex:Vm,fog_vertex:Gm,fog_pars_vertex:Wm,fog_fragment:Xm,fog_pars_fragment:Ym,gradientmap_pars_fragment:qm,lightmap_pars_fragment:Zm,lights_lambert_fragment:$m,lights_lambert_pars_fragment:Jm,lights_pars_begin:Km,lights_toon_fragment:Qm,lights_toon_pars_fragment:e0,lights_phong_fragment:t0,lights_phong_pars_fragment:n0,lights_physical_fragment:i0,lights_physical_pars_fragment:s0,lights_fragment_begin:r0,lights_fragment_maps:o0,lights_fragment_end:a0,logdepthbuf_fragment:l0,logdepthbuf_pars_fragment:c0,logdepthbuf_pars_vertex:h0,logdepthbuf_vertex:u0,map_fragment:d0,map_pars_fragment:f0,map_particle_fragment:p0,map_particle_pars_fragment:m0,metalnessmap_fragment:g0,metalnessmap_pars_fragment:_0,morphinstance_vertex:x0,morphcolor_vertex:y0,morphnormal_vertex:v0,morphtarget_pars_vertex:b0,morphtarget_vertex:M0,normal_fragment_begin:S0,normal_fragment_maps:w0,normal_pars_fragment:E0,normal_pars_vertex:T0,normal_vertex:A0,normalmap_pars_fragment:R0,clearcoat_normal_fragment_begin:C0,clearcoat_normal_fragment_maps:P0,clearcoat_pars_fragment:I0,iridescence_pars_fragment:L0,opaque_fragment:D0,packing:U0,premultiplied_alpha_fragment:N0,project_vertex:k0,dithering_fragment:F0,dithering_pars_fragment:O0,roughnessmap_fragment:B0,roughnessmap_pars_fragment:z0,shadowmap_pars_fragment:H0,shadowmap_pars_vertex:V0,shadowmap_vertex:G0,shadowmask_pars_fragment:W0,skinbase_vertex:X0,skinning_pars_vertex:Y0,skinning_vertex:q0,skinnormal_vertex:Z0,specularmap_fragment:$0,specularmap_pars_fragment:J0,tonemapping_fragment:K0,tonemapping_pars_fragment:j0,transmission_fragment:Q0,transmission_pars_fragment:eg,uv_pars_fragment:tg,uv_pars_vertex:ng,uv_vertex:ig,worldpos_vertex:sg,background_vert:rg,background_frag:og,backgroundCube_vert:ag,backgroundCube_frag:lg,cube_vert:cg,cube_frag:hg,depth_vert:ug,depth_frag:dg,distanceRGBA_vert:fg,distanceRGBA_frag:pg,equirect_vert:mg,equirect_frag:gg,linedashed_vert:_g,linedashed_frag:xg,meshbasic_vert:yg,meshbasic_frag:vg,meshlambert_vert:bg,meshlambert_frag:Mg,meshmatcap_vert:Sg,meshmatcap_frag:wg,meshnormal_vert:Eg,meshnormal_frag:Tg,meshphong_vert:Ag,meshphong_frag:Rg,meshphysical_vert:Cg,meshphysical_frag:Pg,meshtoon_vert:Ig,meshtoon_frag:Lg,points_vert:Dg,points_frag:Ug,shadow_vert:Ng,shadow_frag:kg,sprite_vert:Fg,sprite_frag:Og},fe={common:{diffuse:{value:new Le(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Le(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Le(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Le(16777215)},opacity:{value:1},center:{value:new Se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},Qn={basic:{uniforms:tn([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:tn([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Le(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:tn([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Le(0)},specular:{value:new Le(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:tn([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new Le(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:tn([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new Le(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:tn([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:tn([fe.points,fe.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:tn([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:tn([fe.common,fe.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:tn([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:tn([fe.sprite,fe.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:tn([fe.common,fe.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:tn([fe.lights,fe.fog,{color:{value:new Le(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Qn.physical={uniforms:tn([Qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Le(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Le(0)},specularColor:{value:new Le(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};var No={r:0,b:0,g:0},ns=new un,Bg=new Xe;function zg(n,e,t,i,s,r,o){let a=new Le(0),c=r===!0?0:1,h,l,u=null,f=0,p=null;function g(x){let b=x.isScene===!0?x.background:null;return b&&b.isTexture&&(b=(x.backgroundBlurriness>0?t:e).get(b)),b}function _(x){let b=!1,y=g(x);y===null?d(a,c):y&&y.isColor&&(d(y,1),b=!0);let P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,o):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,b){let y=g(b);y&&(y.isCubeTexture||y.mapping===ba)?(l===void 0&&(l=new Ne(new Gn(1,1,1),new In({name:"BackgroundCubeMaterial",uniforms:Ks(Qn.backgroundCube.uniforms),vertexShader:Qn.backgroundCube.vertexShader,fragmentShader:Qn.backgroundCube.fragmentShader,side:jt,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(P,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),ns.copy(b.backgroundRotation),ns.x*=-1,ns.y*=-1,ns.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),l.material.uniforms.envMap.value=y,l.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Bg.makeRotationFromEuler(ns)),l.material.toneMapped=je.getTransfer(y.colorSpace)!==at,(u!==y||f!==y.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,f=y.version,p=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null)):y&&y.isTexture&&(h===void 0&&(h=new Ne(new Mi(2,2),new In({name:"BackgroundMaterial",uniforms:Ks(Qn.background.uniforms),vertexShader:Qn.background.vertexShader,fragmentShader:Qn.background.fragmentShader,side:Hi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=y,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.toneMapped=je.getTransfer(y.colorSpace)!==at,y.matrixAutoUpdate===!0&&y.updateMatrix(),h.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||f!==y.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=y,f=y.version,p=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null))}function d(x,b){x.getRGB(No,Id(n)),i.buffers.color.setClear(No.r,No.g,No.b,b,o)}return{getClearColor:function(){return a},setClearColor:function(x,b=1){a.set(x),c=b,d(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,d(a,c)},render:_,addToRenderList:m}}function Hg(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,o=!1;function a(M,L,V,G,Y){let Q=!1,$=u(G,V,L);r!==$&&(r=$,h(r.object)),Q=p(M,G,V,Y),Q&&g(M,G,V,Y),Y!==null&&e.update(Y,n.ELEMENT_ARRAY_BUFFER),(Q||o)&&(o=!1,y(M,L,V,G),Y!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function c(){return n.createVertexArray()}function h(M){return n.bindVertexArray(M)}function l(M){return n.deleteVertexArray(M)}function u(M,L,V){let G=V.wireframe===!0,Y=i[M.id];Y===void 0&&(Y={},i[M.id]=Y);let Q=Y[L.id];Q===void 0&&(Q={},Y[L.id]=Q);let $=Q[G];return $===void 0&&($=f(c()),Q[G]=$),$}function f(M){let L=[],V=[],G=[];for(let Y=0;Y<t;Y++)L[Y]=0,V[Y]=0,G[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:V,attributeDivisors:G,object:M,attributes:{},index:null}}function p(M,L,V,G){let Y=r.attributes,Q=L.attributes,$=0,ce=V.getAttributes();for(let v in ce)if(ce[v].location>=0){let O=Y[v],J=Q[v];if(J===void 0&&(v==="instanceMatrix"&&M.instanceMatrix&&(J=M.instanceMatrix),v==="instanceColor"&&M.instanceColor&&(J=M.instanceColor)),O===void 0||O.attribute!==J||J&&O.data!==J.data)return!0;$++}return r.attributesNum!==$||r.index!==G}function g(M,L,V,G){let Y={},Q=L.attributes,$=0,ce=V.getAttributes();for(let v in ce)if(ce[v].location>=0){let O=Q[v];O===void 0&&(v==="instanceMatrix"&&M.instanceMatrix&&(O=M.instanceMatrix),v==="instanceColor"&&M.instanceColor&&(O=M.instanceColor));let J={};J.attribute=O,O&&O.data&&(J.data=O.data),Y[v]=J,$++}r.attributes=Y,r.attributesNum=$,r.index=G}function _(){let M=r.newAttributes;for(let L=0,V=M.length;L<V;L++)M[L]=0}function m(M){d(M,0)}function d(M,L){let V=r.newAttributes,G=r.enabledAttributes,Y=r.attributeDivisors;V[M]=1,G[M]===0&&(n.enableVertexAttribArray(M),G[M]=1),Y[M]!==L&&(n.vertexAttribDivisor(M,L),Y[M]=L)}function x(){let M=r.newAttributes,L=r.enabledAttributes;for(let V=0,G=L.length;V<G;V++)L[V]!==M[V]&&(n.disableVertexAttribArray(V),L[V]=0)}function b(M,L,V,G,Y,Q,$){$===!0?n.vertexAttribIPointer(M,L,V,Y,Q):n.vertexAttribPointer(M,L,V,G,Y,Q)}function y(M,L,V,G){_();let Y=G.attributes,Q=V.getAttributes(),$=L.defaultAttributeValues;for(let ce in Q){let v=Q[ce];if(v.location>=0){let B=Y[ce];if(B===void 0&&(ce==="instanceMatrix"&&M.instanceMatrix&&(B=M.instanceMatrix),ce==="instanceColor"&&M.instanceColor&&(B=M.instanceColor)),B!==void 0){let O=B.normalized,J=B.itemSize,se=e.get(B);if(se===void 0)continue;let ie=se.buffer,D=se.type,q=se.bytesPerElement,re=D===n.INT||D===n.UNSIGNED_INT||B.gpuType===Kc;if(B.isInterleavedBufferAttribute){let ae=B.data,z=ae.stride,ee=B.offset;if(ae.isInstancedInterleavedBuffer){for(let ye=0;ye<v.locationSize;ye++)d(v.location+ye,ae.meshPerAttribute);M.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let ye=0;ye<v.locationSize;ye++)m(v.location+ye);n.bindBuffer(n.ARRAY_BUFFER,ie);for(let ye=0;ye<v.locationSize;ye++)b(v.location+ye,J/v.locationSize,D,O,z*q,(ee+J/v.locationSize*ye)*q,re)}else{if(B.isInstancedBufferAttribute){for(let ae=0;ae<v.locationSize;ae++)d(v.location+ae,B.meshPerAttribute);M.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let ae=0;ae<v.locationSize;ae++)m(v.location+ae);n.bindBuffer(n.ARRAY_BUFFER,ie);for(let ae=0;ae<v.locationSize;ae++)b(v.location+ae,J/v.locationSize,D,O,J*q,J/v.locationSize*ae*q,re)}}else if($!==void 0){let O=$[ce];if(O!==void 0)switch(O.length){case 2:n.vertexAttrib2fv(v.location,O);break;case 3:n.vertexAttrib3fv(v.location,O);break;case 4:n.vertexAttrib4fv(v.location,O);break;default:n.vertexAttrib1fv(v.location,O)}}}}x()}function P(){C();for(let M in i){let L=i[M];for(let V in L){let G=L[V];for(let Y in G)l(G[Y].object),delete G[Y];delete L[V]}delete i[M]}}function T(M){if(i[M.id]===void 0)return;let L=i[M.id];for(let V in L){let G=L[V];for(let Y in G)l(G[Y].object),delete G[Y];delete L[V]}delete i[M.id]}function A(M){for(let L in i){let V=i[L];if(V[M.id]===void 0)continue;let G=V[M.id];for(let Y in G)l(G[Y].object),delete G[Y];delete V[M.id]}}function C(){S(),o=!0,r!==s&&(r=s,h(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:S,dispose:P,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function Vg(n,e,t){let i;function s(h){i=h}function r(h,l){n.drawArrays(i,h,l),t.update(l,i,1)}function o(h,l,u){u!==0&&(n.drawArraysInstanced(i,h,l,u),t.update(l,i,u))}function a(h,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,l,0,u);let p=0;for(let g=0;g<u;g++)p+=l[g];t.update(p,i,1)}function c(h,l,u,f){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<h.length;g++)o(h[g],l[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(i,h,0,l,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=l[_]*f[_];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Gg(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Hn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let C=A===qr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==xi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ti&&!C)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp",l=c(h);l!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",l,"instead."),h=l);let u=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:h,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:x,maxVaryings:b,maxFragmentUniforms:y,vertexTextures:P,maxSamples:T}}function Wg(n){let e=this,t=null,i=0,s=!1,r=!1,o=new Mn,a=new ze,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let p=u.length!==0||f||i!==0||s;return s=f,i=u.length,p},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=l(u,f,0)},this.setState=function(u,f,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,d=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?l(null):h();else{let x=r?0:i,b=x*4,y=d.clippingState||null;c.value=y,y=l(g,f,b,p);for(let P=0;P!==b;++P)y[P]=t[P];d.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function l(u,f,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let d=p+_*4,x=f.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<d)&&(m=new Float32Array(d));for(let b=0,y=p;b!==_;++b,y+=4)o.copy(u[b]).applyMatrix4(x,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Xg(n){let e=new WeakMap;function t(o,a){return a===Bl?o.mapping=qs:a===zl&&(o.mapping=Zs),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===Bl||a===zl)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let h=new yc(c.height);return h.fromEquirectangularTexture(n,o),e.set(o,h),o.addEventListener("dispose",s),t(h.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var ra=class extends ia{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,o=r+h*this.view.width,a-=l*this.view.offsetY,c=a-l*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Vs=4,Uu=[.125,.215,.35,.446,.526,.582],as=20,xl=new ra,Nu=new Le,yl=null,vl=0,bl=0,Ml=!1,ss=(1+Math.sqrt(5))/2,Bs=1/ss,ku=[new I(-ss,Bs,0),new I(ss,Bs,0),new I(-Bs,0,ss),new I(Bs,0,ss),new I(0,ss,-Bs),new I(0,ss,Bs),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],js=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){yl=this._renderer.getRenderTarget(),vl=this._renderer.getActiveCubeFace(),bl=this._renderer.getActiveMipmapLevel(),Ml=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ou(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(yl,vl,bl),this._renderer.xr.enabled=Ml,e.scissorTest=!1,ko(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qs||e.mapping===Zs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),yl=this._renderer.getRenderTarget(),vl=this._renderer.getActiveCubeFace(),bl=this._renderer.getActiveMipmapLevel(),Ml=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ei,minFilter:ei,generateMipmaps:!1,type:qr,format:Hn,colorSpace:nr,depthBuffer:!1},s=Fu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fu(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Yg(r)),this._blurMaterial=qg(r,e,t)}return s}_compileMaterial(e){let t=new Ne(this._lodPlanes[0],e);this._renderer.compile(t,xl)}_sceneToCubeUV(e,t,i,s){let a=new Gt(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,f=l.toneMapping;l.getClearColor(Nu),l.toneMapping=ni,l.autoClear=!1;let p=new Bt({name:"PMREM.Background",side:jt,depthWrite:!1,depthTest:!1}),g=new Ne(new Gn,p),_=!1,m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(Nu),_=!0);for(let d=0;d<6;d++){let x=d%3;x===0?(a.up.set(0,c[d],0),a.lookAt(h[d],0,0)):x===1?(a.up.set(0,0,c[d]),a.lookAt(0,h[d],0)):(a.up.set(0,c[d],0),a.lookAt(0,0,h[d]));let b=this._cubeSize;ko(s,x*b,d>2?b:0,b,b),l.setRenderTarget(s),_&&l.render(g,a),l.render(e,a)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=f,l.autoClear=u,e.background=m}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===qs||e.mapping===Zs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ou());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Ne(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;ko(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,xl)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=ku[(s-r-1)%ku.length];this._blur(e,r-1,r,o,a)}t.autoClear=i}_blur(e,t,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){let c=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let l=3,u=new Ne(this._lodPlanes[s],h),f=h.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*as-1),_=r/g,m=isFinite(r)?1+Math.floor(l*_):as;m>as&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${as}`);let d=[],x=0;for(let A=0;A<as;++A){let C=A/_,S=Math.exp(-C*C/2);d.push(S),A===0?x+=S:A<m&&(x+=2*S)}for(let A=0;A<d.length;A++)d[A]=d[A]/x;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:b}=this;f.dTheta.value=g,f.mipInt.value=b-i;let y=this._sizeLods[s],P=3*y*(s>b-Vs?s-b+Vs:0),T=4*(this._cubeSize-y);ko(t,P,T,3*y,2*y),c.setRenderTarget(t),c.render(u,xl)}};function Yg(n){let e=[],t=[],i=[],s=n,r=n-Vs+1+Uu.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>n-Vs?c=Uu[o-n+Vs-1]:o===0&&(c=0),i.push(c);let h=1/(a-2),l=-h,u=1+h,f=[l,l,u,l,u,u,l,l,u,u,l,u],p=6,g=6,_=3,m=2,d=1,x=new Float32Array(_*g*p),b=new Float32Array(m*g*p),y=new Float32Array(d*g*p);for(let T=0;T<p;T++){let A=T%3*2/3-1,C=T>2?0:-1,S=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];x.set(S,_*g*T),b.set(f,m*g*T);let M=[T,T,T,T,T,T];y.set(M,d*g*T)}let P=new ct;P.setAttribute("position",new xt(x,_)),P.setAttribute("uv",new xt(b,m)),P.setAttribute("faceIndex",new xt(y,d)),e.push(P),s>Vs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Fu(n,e,t){let i=new Vn(n,e,t);return i.texture.mapping=ba,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ko(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function qg(n,e,t){let i=new Float32Array(as),s=new I(0,1,0);return new In({name:"SphericalGaussianBlur",defines:{n:as,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:rh(),fragmentShader:`

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
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function Ou(){return new In({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:rh(),fragmentShader:`

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
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function Bu(){return new In({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:rh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function rh(){return`

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
	`}function Zg(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){let c=a.mapping,h=c===Bl||c===zl,l=c===qs||c===Zs;if(h||l){let u=e.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new js(n)),u=h?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return h&&p&&p.height>0||l&&p&&s(p)?(t===null&&(t=new js(n)),u=h?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0,h=6;for(let l=0;l<h;l++)a[l]!==void 0&&c++;return c===h}function r(a){let c=a.target;c.removeEventListener("dispose",r);let h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function $g(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Pr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Jg(n,e,t,i){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);for(let g in f.morphAttributes){let _=f.morphAttributes[g];for(let m=0,d=_.length;m<d;m++)e.remove(_[m])}f.removeEventListener("dispose",o),delete s[f.id];let p=r.get(f);p&&(e.remove(p),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function c(u){let f=u.attributes;for(let g in f)e.update(f[g],n.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let m=0,d=_.length;m<d;m++)e.update(_[m],n.ARRAY_BUFFER)}}function h(u){let f=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let x=p.array;_=p.version;for(let b=0,y=x.length;b<y;b+=3){let P=x[b+0],T=x[b+1],A=x[b+2];f.push(P,T,T,A,A,P)}}else if(g!==void 0){let x=g.array;_=g.version;for(let b=0,y=x.length/3-1;b<y;b+=3){let P=b+0,T=b+1,A=b+2;f.push(P,T,T,A,A,P)}}else return;let m=new(Cd(f)?na:ta)(f,1);m.version=_;let d=r.get(u);d&&e.remove(d),r.set(u,m)}function l(u){let f=r.get(u);if(f){let p=u.index;p!==null&&f.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:l}}function Kg(n,e,t){let i;function s(f){i=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,p){n.drawElements(i,p,r,f*o),t.update(p,i,1)}function h(f,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,f*o,g),t.update(p,i,g))}function l(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];t.update(m,i,1)}function u(f,p,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)h(f[d]/o,p[d],_[d]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,f,0,_,0,g);let d=0;for(let x=0;x<g;x++)d+=p[x]*_[x];t.update(d,i,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=h,this.renderMultiDraw=l,this.renderMultiDrawInstances=u}function jg(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Qg(n,e,t){let i=new WeakMap,s=new lt;function r(o,a,c){let h=o.morphTargetInfluences,l=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=l!==void 0?l.length:0,f=i.get(a);if(f===void 0||f.count!==u){let S=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",S)};f!==void 0&&f.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],b=0;p===!0&&(b=1),g===!0&&(b=2),_===!0&&(b=3);let y=a.attributes.position.count*b,P=1;y>e.maxTextureSize&&(P=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let T=new Float32Array(y*P*4*u),A=new ea(T,y,P,u);A.type=ti,A.needsUpdate=!0;let C=b*4;for(let M=0;M<u;M++){let L=m[M],V=d[M],G=x[M],Y=y*P*4*M;for(let Q=0;Q<L.count;Q++){let $=Q*C;p===!0&&(s.fromBufferAttribute(L,Q),T[Y+$+0]=s.x,T[Y+$+1]=s.y,T[Y+$+2]=s.z,T[Y+$+3]=0),g===!0&&(s.fromBufferAttribute(V,Q),T[Y+$+4]=s.x,T[Y+$+5]=s.y,T[Y+$+6]=s.z,T[Y+$+7]=0),_===!0&&(s.fromBufferAttribute(G,Q),T[Y+$+8]=s.x,T[Y+$+9]=s.y,T[Y+$+10]=s.z,T[Y+$+11]=G.itemSize===4?s.w:1)}}f={count:u,texture:A,size:new Se(y,P)},i.set(a,f),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let p=0;for(let _=0;_<h.length;_++)p+=h[_];let g=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function e_(n,e,t,i){let s=new WeakMap;function r(c){let h=i.render.frame,l=c.geometry,u=e.get(c,l);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function o(){s=new WeakMap}function a(c){let h=c.target;h.removeEventListener("dispose",a),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}var oa=class extends hn{constructor(e,t,i,s,r,o,a,c,h,l=Gs){if(l!==Gs&&l!==Js)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&l===Gs&&(i=hs),i===void 0&&l===Js&&(i=$s),super(null,s,r,o,a,c,l,i,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Sn,this.minFilter=c!==void 0?c:Sn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Dd=new hn,zu=new oa(1,1),Ud=new ea,Nd=new _c,kd=new sa,Hu=[],Vu=[],Gu=new Float32Array(16),Wu=new Float32Array(9),Xu=new Float32Array(4);function sr(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=Hu[s];if(r===void 0&&(r=new Float32Array(s),Hu[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function Lt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Dt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Sa(n,e){let t=Vu[e];t===void 0&&(t=new Int32Array(e),Vu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function t_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function n_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2fv(this.addr,e),Dt(t,e)}}function i_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;n.uniform3fv(this.addr,e),Dt(t,e)}}function s_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4fv(this.addr,e),Dt(t,e)}}function r_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Xu.set(i),n.uniformMatrix2fv(this.addr,!1,Xu),Dt(t,i)}}function o_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Wu.set(i),n.uniformMatrix3fv(this.addr,!1,Wu),Dt(t,i)}}function a_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Gu.set(i),n.uniformMatrix4fv(this.addr,!1,Gu),Dt(t,i)}}function l_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function c_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2iv(this.addr,e),Dt(t,e)}}function h_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3iv(this.addr,e),Dt(t,e)}}function u_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4iv(this.addr,e),Dt(t,e)}}function d_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function f_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2uiv(this.addr,e),Dt(t,e)}}function p_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3uiv(this.addr,e),Dt(t,e)}}function m_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4uiv(this.addr,e),Dt(t,e)}}function g_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(zu.compareFunction=Rd,r=zu):r=Dd,t.setTexture2D(e||r,s)}function __(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Nd,s)}function x_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||kd,s)}function y_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Ud,s)}function v_(n){switch(n){case 5126:return t_;case 35664:return n_;case 35665:return i_;case 35666:return s_;case 35674:return r_;case 35675:return o_;case 35676:return a_;case 5124:case 35670:return l_;case 35667:case 35671:return c_;case 35668:case 35672:return h_;case 35669:case 35673:return u_;case 5125:return d_;case 36294:return f_;case 36295:return p_;case 36296:return m_;case 35678:case 36198:case 36298:case 36306:case 35682:return g_;case 35679:case 36299:case 36307:return __;case 35680:case 36300:case 36308:case 36293:return x_;case 36289:case 36303:case 36311:case 36292:return y_}}function b_(n,e){n.uniform1fv(this.addr,e)}function M_(n,e){let t=sr(e,this.size,2);n.uniform2fv(this.addr,t)}function S_(n,e){let t=sr(e,this.size,3);n.uniform3fv(this.addr,t)}function w_(n,e){let t=sr(e,this.size,4);n.uniform4fv(this.addr,t)}function E_(n,e){let t=sr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function T_(n,e){let t=sr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function A_(n,e){let t=sr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function R_(n,e){n.uniform1iv(this.addr,e)}function C_(n,e){n.uniform2iv(this.addr,e)}function P_(n,e){n.uniform3iv(this.addr,e)}function I_(n,e){n.uniform4iv(this.addr,e)}function L_(n,e){n.uniform1uiv(this.addr,e)}function D_(n,e){n.uniform2uiv(this.addr,e)}function U_(n,e){n.uniform3uiv(this.addr,e)}function N_(n,e){n.uniform4uiv(this.addr,e)}function k_(n,e,t){let i=this.cache,s=e.length,r=Sa(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Dd,r[o])}function F_(n,e,t){let i=this.cache,s=e.length,r=Sa(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Nd,r[o])}function O_(n,e,t){let i=this.cache,s=e.length,r=Sa(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||kd,r[o])}function B_(n,e,t){let i=this.cache,s=e.length,r=Sa(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Ud,r[o])}function z_(n){switch(n){case 5126:return b_;case 35664:return M_;case 35665:return S_;case 35666:return w_;case 35674:return E_;case 35675:return T_;case 35676:return A_;case 5124:case 35670:return R_;case 35667:case 35671:return C_;case 35668:case 35672:return P_;case 35669:case 35673:return I_;case 5125:return L_;case 36294:return D_;case 36295:return U_;case 36296:return N_;case 35678:case 36198:case 36298:case 36306:case 35682:return k_;case 35679:case 36299:case 36307:return F_;case 35680:case 36300:case 36308:case 36293:return O_;case 36289:case 36303:case 36311:case 36292:return B_}}var vc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=v_(t.type)}},bc=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=z_(t.type)}},Mc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},Sl=/(\w+)(\])?(\[|\.)?/g;function Yu(n,e){n.seq.push(e),n.map[e.id]=e}function H_(n,e,t){let i=n.name,s=i.length;for(Sl.lastIndex=0;;){let r=Sl.exec(i),o=Sl.lastIndex,a=r[1],c=r[2]==="]",h=r[3];if(c&&(a=a|0),h===void 0||h==="["&&o+2===s){Yu(t,h===void 0?new vc(a,n,e):new bc(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new Mc(a),Yu(t,u)),t=u}}}var Xs=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);H_(r,o,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function qu(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var V_=37297,G_=0;function W_(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var Zu=new ze;function X_(n){je._getMatrix(Zu,je.workingColorSpace,n);let e=`mat3( ${Zu.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(n)){case Ma:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function $u(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+W_(n.getShaderSource(e),o)}else return s}function Y_(n,e){let t=X_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function q_(n,e){let t;switch(e){case sp:t="Linear";break;case rp:t="Reinhard";break;case op:t="Cineon";break;case Jc:t="ACESFilmic";break;case lp:t="AgX";break;case cp:t="Neutral";break;case ap:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Fo=new I;function Z_(){je.getLuminanceCoefficients(Fo);let n=Fo.x.toFixed(4),e=Fo.y.toFixed(4),t=Fo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ir).join(`
`)}function J_(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function K_(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Ir(n){return n!==""}function Ju(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ku(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var j_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Sc(n){return n.replace(j_,ex)}var Q_=new Map;function ex(n,e){let t=Ze[e];if(t===void 0){let i=Q_.get(e);if(i!==void 0)t=Ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Sc(t)}var tx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ju(n){return n.replace(tx,nx)}function nx(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Qu(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function ix(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===md?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===$c?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===mi&&(e="SHADOWMAP_TYPE_VSM"),e}function sx(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case qs:case Zs:e="ENVMAP_TYPE_CUBE";break;case ba:e="ENVMAP_TYPE_CUBE_UV";break}return e}function rx(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Zs:e="ENVMAP_MODE_REFRACTION";break}return e}function ox(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case gd:e="ENVMAP_BLENDING_MULTIPLY";break;case np:e="ENVMAP_BLENDING_MIX";break;case ip:e="ENVMAP_BLENDING_ADD";break}return e}function ax(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function lx(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=ix(t),h=sx(t),l=rx(t),u=ox(t),f=ax(t),p=$_(t),g=J_(r),_=s.createProgram(),m,d,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ir).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ir).join(`
`),d.length>0&&(d+=`
`)):(m=[Qu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ir).join(`
`),d=[Qu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ni?"#define TONE_MAPPING":"",t.toneMapping!==ni?Ze.tonemapping_pars_fragment:"",t.toneMapping!==ni?q_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,Y_("linearToOutputTexel",t.outputColorSpace),Z_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ir).join(`
`)),o=Sc(o),o=Ju(o,t),o=Ku(o,t),a=Sc(a),a=Ju(a,t),a=Ku(a,t),o=ju(o),a=ju(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===du?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===du?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let b=x+m+o,y=x+d+a,P=qu(s,s.VERTEX_SHADER,b),T=qu(s,s.FRAGMENT_SHADER,y);s.attachShader(_,P),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(L){if(n.debug.checkShaderErrors){let V=s.getProgramInfoLog(_).trim(),G=s.getShaderInfoLog(P).trim(),Y=s.getShaderInfoLog(T).trim(),Q=!0,$=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(Q=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,P,T);else{let ce=$u(s,P,"vertex"),v=$u(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+V+`
`+ce+`
`+v)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(G===""||Y==="")&&($=!1);$&&(L.diagnostics={runnable:Q,programLog:V,vertexShader:{log:G,prefix:m},fragmentShader:{log:Y,prefix:d}})}s.deleteShader(P),s.deleteShader(T),C=new Xs(s,_),S=K_(s,_)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,V_)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=G_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=T,this}var cx=0,wc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Ec(e),t.set(e,i)),i}},Ec=class{constructor(e){this.id=cx++,this.code=e,this.usedTimes=0}};function hx(n,e,t,i,s,r,o){let a=new Br,c=new wc,h=new Set,l=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return h.add(S),S===0?"uv":`uv${S}`}function m(S,M,L,V,G){let Y=V.fog,Q=G.geometry,$=S.isMeshStandardMaterial?V.environment:null,ce=(S.isMeshStandardMaterial?t:e).get(S.envMap||$),v=ce&&ce.mapping===ba?ce.image.height:null,B=g[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));let O=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,J=O!==void 0?O.length:0,se=0;Q.morphAttributes.position!==void 0&&(se=1),Q.morphAttributes.normal!==void 0&&(se=2),Q.morphAttributes.color!==void 0&&(se=3);let ie,D,q,re;if(B){let rt=Qn[B];ie=rt.vertexShader,D=rt.fragmentShader}else ie=S.vertexShader,D=S.fragmentShader,c.update(S),q=c.getVertexShaderID(S),re=c.getFragmentShaderID(S);let ae=n.getRenderTarget(),z=n.state.buffers.depth.getReversed(),ee=G.isInstancedMesh===!0,ye=G.isBatchedMesh===!0,Re=!!S.map,Fe=!!S.matcap,Qe=!!ce,U=!!S.aoMap,Qt=!!S.lightMap,ke=!!S.bumpMap,Ve=!!S.normalMap,Ce=!!S.displacementMap,nt=!!S.emissiveMap,De=!!S.metalnessMap,R=!!S.roughnessMap,w=S.anisotropy>0,H=S.clearcoat>0,te=S.dispersion>0,oe=S.iridescence>0,j=S.sheen>0,Pe=S.transmission>0,me=w&&!!S.anisotropyMap,ve=H&&!!S.clearcoatMap,Ke=H&&!!S.clearcoatNormalMap,he=H&&!!S.clearcoatRoughnessMap,be=oe&&!!S.iridescenceMap,Ue=oe&&!!S.iridescenceThicknessMap,Oe=j&&!!S.sheenColorMap,Me=j&&!!S.sheenRoughnessMap,Je=!!S.specularMap,qe=!!S.specularColorMap,gt=!!S.specularIntensityMap,N=Pe&&!!S.transmissionMap,pe=Pe&&!!S.thicknessMap,Z=!!S.gradientMap,ne=!!S.alphaMap,xe=S.alphaTest>0,ge=!!S.alphaHash,Ge=!!S.extensions,St=ni;S.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(St=n.toneMapping);let $t={shaderID:B,shaderType:S.type,shaderName:S.name,vertexShader:ie,fragmentShader:D,defines:S.defines,customVertexShaderID:q,customFragmentShaderID:re,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:ye,batchingColor:ye&&G._colorsTexture!==null,instancing:ee,instancingColor:ee&&G.instanceColor!==null,instancingMorph:ee&&G.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ae===null?n.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:nr,alphaToCoverage:!!S.alphaToCoverage,map:Re,matcap:Fe,envMap:Qe,envMapMode:Qe&&ce.mapping,envMapCubeUVHeight:v,aoMap:U,lightMap:Qt,bumpMap:ke,normalMap:Ve,displacementMap:f&&Ce,emissiveMap:nt,normalMapObjectSpace:Ve&&S.normalMapType===fp,normalMapTangentSpace:Ve&&S.normalMapType===Ad,metalnessMap:De,roughnessMap:R,anisotropy:w,anisotropyMap:me,clearcoat:H,clearcoatMap:ve,clearcoatNormalMap:Ke,clearcoatRoughnessMap:he,dispersion:te,iridescence:oe,iridescenceMap:be,iridescenceThicknessMap:Ue,sheen:j,sheenColorMap:Oe,sheenRoughnessMap:Me,specularMap:Je,specularColorMap:qe,specularIntensityMap:gt,transmission:Pe,transmissionMap:N,thicknessMap:pe,gradientMap:Z,opaque:S.transparent===!1&&S.blending===zi&&S.alphaToCoverage===!1,alphaMap:ne,alphaTest:xe,alphaHash:ge,combine:S.combine,mapUv:Re&&_(S.map.channel),aoMapUv:U&&_(S.aoMap.channel),lightMapUv:Qt&&_(S.lightMap.channel),bumpMapUv:ke&&_(S.bumpMap.channel),normalMapUv:Ve&&_(S.normalMap.channel),displacementMapUv:Ce&&_(S.displacementMap.channel),emissiveMapUv:nt&&_(S.emissiveMap.channel),metalnessMapUv:De&&_(S.metalnessMap.channel),roughnessMapUv:R&&_(S.roughnessMap.channel),anisotropyMapUv:me&&_(S.anisotropyMap.channel),clearcoatMapUv:ve&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:Ke&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ue&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Me&&_(S.sheenRoughnessMap.channel),specularMapUv:Je&&_(S.specularMap.channel),specularColorMapUv:qe&&_(S.specularColorMap.channel),specularIntensityMapUv:gt&&_(S.specularIntensityMap.channel),transmissionMapUv:N&&_(S.transmissionMap.channel),thicknessMapUv:pe&&_(S.thicknessMap.channel),alphaMapUv:ne&&_(S.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&(Ve||w),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!Q.attributes.uv&&(Re||ne),fog:!!Y,useFog:S.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:z,skinning:G.isSkinnedMesh===!0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:se,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:St,decodeVideoTexture:Re&&S.map.isVideoTexture===!0&&je.getTransfer(S.map.colorSpace)===at,decodeVideoTextureEmissive:nt&&S.emissiveMap.isVideoTexture===!0&&je.getTransfer(S.emissiveMap.colorSpace)===at,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Ct,flipSided:S.side===jt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ge&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ge&&S.extensions.multiDraw===!0||ye)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return $t.vertexUv1s=h.has(1),$t.vertexUv2s=h.has(2),$t.vertexUv3s=h.has(3),h.clear(),$t}function d(S){let M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(let L in S.defines)M.push(L),M.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(x(M,S),b(M,S),M.push(n.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function x(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function b(S,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),S.push(a.mask)}function y(S){let M=g[S.type],L;if(M){let V=Qn[M];L=em.clone(V.uniforms)}else L=S.uniforms;return L}function P(S,M){let L;for(let V=0,G=l.length;V<G;V++){let Y=l[V];if(Y.cacheKey===M){L=Y,++L.usedTimes;break}}return L===void 0&&(L=new lx(n,M,S,r),l.push(L)),L}function T(S){if(--S.usedTimes===0){let M=l.indexOf(S);l[M]=l[l.length-1],l.pop(),S.destroy()}}function A(S){c.remove(S)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:y,acquireProgram:P,releaseProgram:T,releaseShaderCache:A,programs:l,dispose:C}}function ux(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function dx(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function ed(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function td(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(u,f,p,g,_,m){let d=n[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=m),e++,d}function a(u,f,p,g,_,m){let d=o(u,f,p,g,_,m);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):t.push(d)}function c(u,f,p,g,_,m){let d=o(u,f,p,g,_,m);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function h(u,f){t.length>1&&t.sort(u||dx),i.length>1&&i.sort(f||ed),s.length>1&&s.sort(f||ed)}function l(){for(let u=e,f=n.length;u<f;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:a,unshift:c,finish:l,sort:h}}function fx(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new td,n.set(i,[o])):s>=r.length?(o=new td,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function px(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Le};break;case"SpotLight":t={position:new I,direction:new I,color:new Le,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Le,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Le,groundColor:new Le};break;case"RectAreaLight":t={color:new Le,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t}}}function mx(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var gx=0;function _x(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function xx(n){let e=new px,t=mx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new I);let s=new I,r=new Xe,o=new Xe;function a(h){let l=0,u=0,f=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let p=0,g=0,_=0,m=0,d=0,x=0,b=0,y=0,P=0,T=0,A=0;h.sort(_x);for(let S=0,M=h.length;S<M;S++){let L=h[S],V=L.color,G=L.intensity,Y=L.distance,Q=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)l+=V.r*G,u+=V.g*G,f+=V.b*G;else if(L.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(L.sh.coefficients[$],G);A++}else if(L.isDirectionalLight){let $=e.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let ce=L.shadow,v=t.get(L);v.shadowIntensity=ce.intensity,v.shadowBias=ce.bias,v.shadowNormalBias=ce.normalBias,v.shadowRadius=ce.radius,v.shadowMapSize=ce.mapSize,i.directionalShadow[p]=v,i.directionalShadowMap[p]=Q,i.directionalShadowMatrix[p]=L.shadow.matrix,x++}i.directional[p]=$,p++}else if(L.isSpotLight){let $=e.get(L);$.position.setFromMatrixPosition(L.matrixWorld),$.color.copy(V).multiplyScalar(G),$.distance=Y,$.coneCos=Math.cos(L.angle),$.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),$.decay=L.decay,i.spot[_]=$;let ce=L.shadow;if(L.map&&(i.spotLightMap[P]=L.map,P++,ce.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[_]=ce.matrix,L.castShadow){let v=t.get(L);v.shadowIntensity=ce.intensity,v.shadowBias=ce.bias,v.shadowNormalBias=ce.normalBias,v.shadowRadius=ce.radius,v.shadowMapSize=ce.mapSize,i.spotShadow[_]=v,i.spotShadowMap[_]=Q,y++}_++}else if(L.isRectAreaLight){let $=e.get(L);$.color.copy(V).multiplyScalar(G),$.halfWidth.set(L.width*.5,0,0),$.halfHeight.set(0,L.height*.5,0),i.rectArea[m]=$,m++}else if(L.isPointLight){let $=e.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),$.distance=L.distance,$.decay=L.decay,L.castShadow){let ce=L.shadow,v=t.get(L);v.shadowIntensity=ce.intensity,v.shadowBias=ce.bias,v.shadowNormalBias=ce.normalBias,v.shadowRadius=ce.radius,v.shadowMapSize=ce.mapSize,v.shadowCameraNear=ce.camera.near,v.shadowCameraFar=ce.camera.far,i.pointShadow[g]=v,i.pointShadowMap[g]=Q,i.pointShadowMatrix[g]=L.shadow.matrix,b++}i.point[g]=$,g++}else if(L.isHemisphereLight){let $=e.get(L);$.skyColor.copy(L.color).multiplyScalar(G),$.groundColor.copy(L.groundColor).multiplyScalar(G),i.hemi[d]=$,d++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=fe.LTC_FLOAT_1,i.rectAreaLTC2=fe.LTC_FLOAT_2):(i.rectAreaLTC1=fe.LTC_HALF_1,i.rectAreaLTC2=fe.LTC_HALF_2)),i.ambient[0]=l,i.ambient[1]=u,i.ambient[2]=f;let C=i.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==d||C.numDirectionalShadows!==x||C.numPointShadows!==b||C.numSpotShadows!==y||C.numSpotMaps!==P||C.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=d,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=y+P-T,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,C.directionalLength=p,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=d,C.numDirectionalShadows=x,C.numPointShadows=b,C.numSpotShadows=y,C.numSpotMaps=P,C.numLightProbes=A,i.version=gx++)}function c(h,l){let u=0,f=0,p=0,g=0,_=0,m=l.matrixWorldInverse;for(let d=0,x=h.length;d<x;d++){let b=h[d];if(b.isDirectionalLight){let y=i.directional[u];y.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(b.isSpotLight){let y=i.spot[p];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(b.isRectAreaLight){let y=i.rectArea[g];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(b.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){let y=i.point[f];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),f++}else if(b.isHemisphereLight){let y=i.hemi[_];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:i}}function nd(n){let e=new xx(n),t=[],i=[];function s(l){h.camera=l,t.length=0,i.length=0}function r(l){t.push(l)}function o(l){i.push(l)}function a(){e.setup(t)}function c(l){e.setupView(t,l)}let h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function yx(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new nd(n),e.set(s,[a])):r>=o.length?(a=new nd(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var Tc=class extends bi{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=up,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ac=class extends bi{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},vx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bx=`uniform sampler2D shadow_pass;
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
}`;function Mx(n,e,t){let i=new zr,s=new Se,r=new Se,o=new lt,a=new Tc({depthPacking:dp}),c=new Ac,h={},l=t.maxTextureSize,u={[Hi]:jt,[jt]:Hi,[Ct]:Ct},f=new In({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Se},radius:{value:4}},vertexShader:vx,fragmentShader:bx}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let g=new ct;g.setAttribute("position",new xt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Ne(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=md;let d=this.type;this.render=function(T,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;let S=n.getRenderTarget(),M=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),V=n.state;V.setBlending(Bi),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let G=d!==mi&&this.type===mi,Y=d===mi&&this.type!==mi;for(let Q=0,$=T.length;Q<$;Q++){let ce=T[Q],v=ce.shadow;if(v===void 0){console.warn("THREE.WebGLShadowMap:",ce,"has no shadow.");continue}if(v.autoUpdate===!1&&v.needsUpdate===!1)continue;s.copy(v.mapSize);let B=v.getFrameExtents();if(s.multiply(B),r.copy(v.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/B.x),s.x=r.x*B.x,v.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/B.y),s.y=r.y*B.y,v.mapSize.y=r.y)),v.map===null||G===!0||Y===!0){let J=this.type!==mi?{minFilter:Sn,magFilter:Sn}:{};v.map!==null&&v.map.dispose(),v.map=new Vn(s.x,s.y,J),v.map.texture.name=ce.name+".shadowMap",v.camera.updateProjectionMatrix()}n.setRenderTarget(v.map),n.clear();let O=v.getViewportCount();for(let J=0;J<O;J++){let se=v.getViewport(J);o.set(r.x*se.x,r.y*se.y,r.x*se.z,r.y*se.w),V.viewport(o),v.updateMatrices(ce,J),i=v.getFrustum(),y(A,C,v.camera,ce,this.type)}v.isPointLightShadow!==!0&&this.type===mi&&x(v,C),v.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(S,M,L)};function x(T,A){let C=e.update(_);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Vn(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,C,f,_,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,C,p,_,null)}function b(T,A,C,S){let M=null,L=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)M=L;else if(M=C.isPointLight===!0?c:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let V=M.uuid,G=A.uuid,Y=h[V];Y===void 0&&(Y={},h[V]=Y);let Q=Y[G];Q===void 0&&(Q=M.clone(),Y[G]=Q,A.addEventListener("dispose",P)),M=Q}if(M.visible=A.visible,M.wireframe=A.wireframe,S===mi?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:u[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let V=n.properties.get(M);V.light=C}return M}function y(T,A,C,S,M){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&M===mi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);let G=e.update(T),Y=T.material;if(Array.isArray(Y)){let Q=G.groups;for(let $=0,ce=Q.length;$<ce;$++){let v=Q[$],B=Y[v.materialIndex];if(B&&B.visible){let O=b(T,B,S,M);T.onBeforeShadow(n,T,A,C,G,O,v),n.renderBufferDirect(C,null,G,O,T,v),T.onAfterShadow(n,T,A,C,G,O,v)}}}else if(Y.visible){let Q=b(T,Y,S,M);T.onBeforeShadow(n,T,A,C,G,Q,null),n.renderBufferDirect(C,null,G,Q,T,null),T.onAfterShadow(n,T,A,C,G,Q,null)}}let V=T.children;for(let G=0,Y=V.length;G<Y;G++)y(V[G],A,C,S,M)}function P(T){T.target.removeEventListener("dispose",P);for(let C in h){let S=h[C],M=T.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}var Sx={[Ll]:Dl,[Ul]:Fl,[Nl]:Ol,[Ys]:kl,[Dl]:Ll,[Fl]:Ul,[Ol]:Nl,[kl]:Ys};function wx(n,e){function t(){let N=!1,pe=new lt,Z=null,ne=new lt(0,0,0,0);return{setMask:function(xe){Z!==xe&&!N&&(n.colorMask(xe,xe,xe,xe),Z=xe)},setLocked:function(xe){N=xe},setClear:function(xe,ge,Ge,St,$t){$t===!0&&(xe*=St,ge*=St,Ge*=St),pe.set(xe,ge,Ge,St),ne.equals(pe)===!1&&(n.clearColor(xe,ge,Ge,St),ne.copy(pe))},reset:function(){N=!1,Z=null,ne.set(-1,0,0,0)}}}function i(){let N=!1,pe=!1,Z=null,ne=null,xe=null;return{setReversed:function(ge){if(pe!==ge){let Ge=e.get("EXT_clip_control");pe?Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.ZERO_TO_ONE_EXT):Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.NEGATIVE_ONE_TO_ONE_EXT);let St=xe;xe=null,this.setClear(St)}pe=ge},getReversed:function(){return pe},setTest:function(ge){ge?ae(n.DEPTH_TEST):z(n.DEPTH_TEST)},setMask:function(ge){Z!==ge&&!N&&(n.depthMask(ge),Z=ge)},setFunc:function(ge){if(pe&&(ge=Sx[ge]),ne!==ge){switch(ge){case Ll:n.depthFunc(n.NEVER);break;case Dl:n.depthFunc(n.ALWAYS);break;case Ul:n.depthFunc(n.LESS);break;case Ys:n.depthFunc(n.LEQUAL);break;case Nl:n.depthFunc(n.EQUAL);break;case kl:n.depthFunc(n.GEQUAL);break;case Fl:n.depthFunc(n.GREATER);break;case Ol:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ne=ge}},setLocked:function(ge){N=ge},setClear:function(ge){xe!==ge&&(pe&&(ge=1-ge),n.clearDepth(ge),xe=ge)},reset:function(){N=!1,Z=null,ne=null,xe=null,pe=!1}}}function s(){let N=!1,pe=null,Z=null,ne=null,xe=null,ge=null,Ge=null,St=null,$t=null;return{setTest:function(rt){N||(rt?ae(n.STENCIL_TEST):z(n.STENCIL_TEST))},setMask:function(rt){pe!==rt&&!N&&(n.stencilMask(rt),pe=rt)},setFunc:function(rt,kn,li){(Z!==rt||ne!==kn||xe!==li)&&(n.stencilFunc(rt,kn,li),Z=rt,ne=kn,xe=li)},setOp:function(rt,kn,li){(ge!==rt||Ge!==kn||St!==li)&&(n.stencilOp(rt,kn,li),ge=rt,Ge=kn,St=li)},setLocked:function(rt){N=rt},setClear:function(rt){$t!==rt&&(n.clearStencil(rt),$t=rt)},reset:function(){N=!1,pe=null,Z=null,ne=null,xe=null,ge=null,Ge=null,St=null,$t=null}}}let r=new t,o=new i,a=new s,c=new WeakMap,h=new WeakMap,l={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,x=null,b=null,y=null,P=null,T=null,A=new Le(0,0,0),C=0,S=!1,M=null,L=null,V=null,G=null,Y=null,Q=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,ce=0,v=n.getParameter(n.VERSION);v.indexOf("WebGL")!==-1?(ce=parseFloat(/^WebGL (\d)/.exec(v)[1]),$=ce>=1):v.indexOf("OpenGL ES")!==-1&&(ce=parseFloat(/^OpenGL ES (\d)/.exec(v)[1]),$=ce>=2);let B=null,O={},J=n.getParameter(n.SCISSOR_BOX),se=n.getParameter(n.VIEWPORT),ie=new lt().fromArray(J),D=new lt().fromArray(se);function q(N,pe,Z,ne){let xe=new Uint8Array(4),ge=n.createTexture();n.bindTexture(N,ge),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ge=0;Ge<Z;Ge++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(pe,0,n.RGBA,1,1,ne,0,n.RGBA,n.UNSIGNED_BYTE,xe):n.texImage2D(pe+Ge,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,xe);return ge}let re={};re[n.TEXTURE_2D]=q(n.TEXTURE_2D,n.TEXTURE_2D,1),re[n.TEXTURE_CUBE_MAP]=q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[n.TEXTURE_2D_ARRAY]=q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),re[n.TEXTURE_3D]=q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ae(n.DEPTH_TEST),o.setFunc(Ys),ke(!1),Ve(su),ae(n.CULL_FACE),U(Bi);function ae(N){l[N]!==!0&&(n.enable(N),l[N]=!0)}function z(N){l[N]!==!1&&(n.disable(N),l[N]=!1)}function ee(N,pe){return u[N]!==pe?(n.bindFramebuffer(N,pe),u[N]=pe,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=pe),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=pe),!0):!1}function ye(N,pe){let Z=p,ne=!1;if(N){Z=f.get(pe),Z===void 0&&(Z=[],f.set(pe,Z));let xe=N.textures;if(Z.length!==xe.length||Z[0]!==n.COLOR_ATTACHMENT0){for(let ge=0,Ge=xe.length;ge<Ge;ge++)Z[ge]=n.COLOR_ATTACHMENT0+ge;Z.length=xe.length,ne=!0}}else Z[0]!==n.BACK&&(Z[0]=n.BACK,ne=!0);ne&&n.drawBuffers(Z)}function Re(N){return g!==N?(n.useProgram(N),g=N,!0):!1}let Fe={[rs]:n.FUNC_ADD,[Bf]:n.FUNC_SUBTRACT,[zf]:n.FUNC_REVERSE_SUBTRACT};Fe[Hf]=n.MIN,Fe[Vf]=n.MAX;let Qe={[Gf]:n.ZERO,[Wf]:n.ONE,[Xf]:n.SRC_COLOR,[Pl]:n.SRC_ALPHA,[Kf]:n.SRC_ALPHA_SATURATE,[$f]:n.DST_COLOR,[qf]:n.DST_ALPHA,[Yf]:n.ONE_MINUS_SRC_COLOR,[Il]:n.ONE_MINUS_SRC_ALPHA,[Jf]:n.ONE_MINUS_DST_COLOR,[Zf]:n.ONE_MINUS_DST_ALPHA,[jf]:n.CONSTANT_COLOR,[Qf]:n.ONE_MINUS_CONSTANT_COLOR,[ep]:n.CONSTANT_ALPHA,[tp]:n.ONE_MINUS_CONSTANT_ALPHA};function U(N,pe,Z,ne,xe,ge,Ge,St,$t,rt){if(N===Bi){_===!0&&(z(n.BLEND),_=!1);return}if(_===!1&&(ae(n.BLEND),_=!0),N!==Of){if(N!==m||rt!==S){if((d!==rs||y!==rs)&&(n.blendEquation(n.FUNC_ADD),d=rs,y=rs),rt)switch(N){case zi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Nr:n.blendFunc(n.ONE,n.ONE);break;case ru:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ou:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case zi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Nr:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case ru:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ou:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,b=null,P=null,T=null,A.set(0,0,0),C=0,m=N,S=rt}return}xe=xe||pe,ge=ge||Z,Ge=Ge||ne,(pe!==d||xe!==y)&&(n.blendEquationSeparate(Fe[pe],Fe[xe]),d=pe,y=xe),(Z!==x||ne!==b||ge!==P||Ge!==T)&&(n.blendFuncSeparate(Qe[Z],Qe[ne],Qe[ge],Qe[Ge]),x=Z,b=ne,P=ge,T=Ge),(St.equals(A)===!1||$t!==C)&&(n.blendColor(St.r,St.g,St.b,$t),A.copy(St),C=$t),m=N,S=!1}function Qt(N,pe){N.side===Ct?z(n.CULL_FACE):ae(n.CULL_FACE);let Z=N.side===jt;pe&&(Z=!Z),ke(Z),N.blending===zi&&N.transparent===!1?U(Bi):U(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let ne=N.stencilWrite;a.setTest(ne),ne&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),nt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ae(n.SAMPLE_ALPHA_TO_COVERAGE):z(n.SAMPLE_ALPHA_TO_COVERAGE)}function ke(N){M!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),M=N)}function Ve(N){N!==kf?(ae(n.CULL_FACE),N!==L&&(N===su?n.cullFace(n.BACK):N===Ff?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):z(n.CULL_FACE),L=N}function Ce(N){N!==V&&($&&n.lineWidth(N),V=N)}function nt(N,pe,Z){N?(ae(n.POLYGON_OFFSET_FILL),(G!==pe||Y!==Z)&&(n.polygonOffset(pe,Z),G=pe,Y=Z)):z(n.POLYGON_OFFSET_FILL)}function De(N){N?ae(n.SCISSOR_TEST):z(n.SCISSOR_TEST)}function R(N){N===void 0&&(N=n.TEXTURE0+Q-1),B!==N&&(n.activeTexture(N),B=N)}function w(N,pe,Z){Z===void 0&&(B===null?Z=n.TEXTURE0+Q-1:Z=B);let ne=O[Z];ne===void 0&&(ne={type:void 0,texture:void 0},O[Z]=ne),(ne.type!==N||ne.texture!==pe)&&(B!==Z&&(n.activeTexture(Z),B=Z),n.bindTexture(N,pe||re[N]),ne.type=N,ne.texture=pe)}function H(){let N=O[B];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function te(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function oe(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function j(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Pe(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function me(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ve(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ke(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function he(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function be(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ue(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Oe(N){ie.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),ie.copy(N))}function Me(N){D.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),D.copy(N))}function Je(N,pe){let Z=h.get(pe);Z===void 0&&(Z=new WeakMap,h.set(pe,Z));let ne=Z.get(N);ne===void 0&&(ne=n.getUniformBlockIndex(pe,N.name),Z.set(N,ne))}function qe(N,pe){let ne=h.get(pe).get(N);c.get(pe)!==ne&&(n.uniformBlockBinding(pe,ne,N.__bindingPointIndex),c.set(pe,ne))}function gt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),l={},B=null,O={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,x=null,b=null,y=null,P=null,T=null,A=new Le(0,0,0),C=0,S=!1,M=null,L=null,V=null,G=null,Y=null,ie.set(0,0,n.canvas.width,n.canvas.height),D.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ae,disable:z,bindFramebuffer:ee,drawBuffers:ye,useProgram:Re,setBlending:U,setMaterial:Qt,setFlipSided:ke,setCullFace:Ve,setLineWidth:Ce,setPolygonOffset:nt,setScissorTest:De,activeTexture:R,bindTexture:w,unbindTexture:H,compressedTexImage2D:te,compressedTexImage3D:oe,texImage2D:be,texImage3D:Ue,updateUBOMapping:Je,uniformBlockBinding:qe,texStorage2D:Ke,texStorage3D:he,texSubImage2D:j,texSubImage3D:Pe,compressedTexSubImage2D:me,compressedTexSubImage3D:ve,scissor:Oe,viewport:Me,reset:gt}}function id(n,e,t,i){let s=Ex(i);switch(t){case bd:return n*e;case Sd:return n*e;case wd:return n*e*2;case eh:return n*e/s.components*s.byteLength;case th:return n*e/s.components*s.byteLength;case Ed:return n*e*2/s.components*s.byteLength;case nh:return n*e*2/s.components*s.byteLength;case Md:return n*e*3/s.components*s.byteLength;case Hn:return n*e*4/s.components*s.byteLength;case ih:return n*e*4/s.components*s.byteLength;case Xo:case Yo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case qo:case Zo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Gl:case Xl:return Math.max(n,16)*Math.max(e,8)/4;case Vl:case Wl:return Math.max(n,8)*Math.max(e,8)/2;case Yl:case ql:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Zl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case $l:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Jl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Kl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case jl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ql:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case ec:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case tc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case nc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ic:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case sc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case rc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case oc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ac:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case lc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case $o:case cc:case hc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Td:case uc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case dc:case fc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ex(n){switch(n){case xi:case xd:return{byteLength:1,components:1};case Fr:case yd:case qr:return{byteLength:2,components:1};case jc:case Qc:return{byteLength:2,components:4};case hs:case Kc:case ti:return{byteLength:4,components:1};case vd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Tx(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Se,l=new WeakMap,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,w){return p?new OffscreenCanvas(R,w):jo("canvas")}function _(R,w,H){let te=1,oe=De(R);if((oe.width>H||oe.height>H)&&(te=H/Math.max(oe.width,oe.height)),te<1)if(typeof HTMLImageElement!="undefined"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&R instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&R instanceof ImageBitmap||typeof VideoFrame!="undefined"&&R instanceof VideoFrame){let j=Math.floor(te*oe.width),Pe=Math.floor(te*oe.height);u===void 0&&(u=g(j,Pe));let me=w?g(j,Pe):u;return me.width=j,me.height=Pe,me.getContext("2d").drawImage(R,0,0,j,Pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+j+"x"+Pe+")."),me}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),R;return R}function m(R){return R.generateMipmaps}function d(R){n.generateMipmap(R)}function x(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function b(R,w,H,te,oe=!1){if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let j=w;if(w===n.RED&&(H===n.FLOAT&&(j=n.R32F),H===n.HALF_FLOAT&&(j=n.R16F),H===n.UNSIGNED_BYTE&&(j=n.R8)),w===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(j=n.R8UI),H===n.UNSIGNED_SHORT&&(j=n.R16UI),H===n.UNSIGNED_INT&&(j=n.R32UI),H===n.BYTE&&(j=n.R8I),H===n.SHORT&&(j=n.R16I),H===n.INT&&(j=n.R32I)),w===n.RG&&(H===n.FLOAT&&(j=n.RG32F),H===n.HALF_FLOAT&&(j=n.RG16F),H===n.UNSIGNED_BYTE&&(j=n.RG8)),w===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(j=n.RG8UI),H===n.UNSIGNED_SHORT&&(j=n.RG16UI),H===n.UNSIGNED_INT&&(j=n.RG32UI),H===n.BYTE&&(j=n.RG8I),H===n.SHORT&&(j=n.RG16I),H===n.INT&&(j=n.RG32I)),w===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(j=n.RGB8UI),H===n.UNSIGNED_SHORT&&(j=n.RGB16UI),H===n.UNSIGNED_INT&&(j=n.RGB32UI),H===n.BYTE&&(j=n.RGB8I),H===n.SHORT&&(j=n.RGB16I),H===n.INT&&(j=n.RGB32I)),w===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(j=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(j=n.RGBA16UI),H===n.UNSIGNED_INT&&(j=n.RGBA32UI),H===n.BYTE&&(j=n.RGBA8I),H===n.SHORT&&(j=n.RGBA16I),H===n.INT&&(j=n.RGBA32I)),w===n.RGB&&H===n.UNSIGNED_INT_5_9_9_9_REV&&(j=n.RGB9_E5),w===n.RGBA){let Pe=oe?Ma:je.getTransfer(te);H===n.FLOAT&&(j=n.RGBA32F),H===n.HALF_FLOAT&&(j=n.RGBA16F),H===n.UNSIGNED_BYTE&&(j=Pe===at?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function y(R,w){let H;return R?w===null||w===hs||w===$s?H=n.DEPTH24_STENCIL8:w===ti?H=n.DEPTH32F_STENCIL8:w===Fr&&(H=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===hs||w===$s?H=n.DEPTH_COMPONENT24:w===ti?H=n.DEPTH_COMPONENT32F:w===Fr&&(H=n.DEPTH_COMPONENT16),H}function P(R,w){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Sn&&R.minFilter!==ei?Math.log2(Math.max(w.width,w.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?w.mipmaps.length:1}function T(R){let w=R.target;w.removeEventListener("dispose",T),C(w),w.isVideoTexture&&l.delete(w)}function A(R){let w=R.target;w.removeEventListener("dispose",A),M(w)}function C(R){let w=i.get(R);if(w.__webglInit===void 0)return;let H=R.source,te=f.get(H);if(te){let oe=te[w.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&S(R),Object.keys(te).length===0&&f.delete(H)}i.remove(R)}function S(R){let w=i.get(R);n.deleteTexture(w.__webglTexture);let H=R.source,te=f.get(H);delete te[w.__cacheKey],o.memory.textures--}function M(R){let w=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(w.__webglFramebuffer[te]))for(let oe=0;oe<w.__webglFramebuffer[te].length;oe++)n.deleteFramebuffer(w.__webglFramebuffer[te][oe]);else n.deleteFramebuffer(w.__webglFramebuffer[te]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[te])}else{if(Array.isArray(w.__webglFramebuffer))for(let te=0;te<w.__webglFramebuffer.length;te++)n.deleteFramebuffer(w.__webglFramebuffer[te]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let te=0;te<w.__webglColorRenderbuffer.length;te++)w.__webglColorRenderbuffer[te]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[te]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let H=R.textures;for(let te=0,oe=H.length;te<oe;te++){let j=i.get(H[te]);j.__webglTexture&&(n.deleteTexture(j.__webglTexture),o.memory.textures--),i.remove(H[te])}i.remove(R)}let L=0;function V(){L=0}function G(){let R=L;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),L+=1,R}function Y(R){let w=[];return w.push(R.wrapS),w.push(R.wrapT),w.push(R.wrapR||0),w.push(R.magFilter),w.push(R.minFilter),w.push(R.anisotropy),w.push(R.internalFormat),w.push(R.format),w.push(R.type),w.push(R.generateMipmaps),w.push(R.premultiplyAlpha),w.push(R.flipY),w.push(R.unpackAlignment),w.push(R.colorSpace),w.join()}function Q(R,w){let H=i.get(R);if(R.isVideoTexture&&Ce(R),R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){let te=R.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{D(H,R,w);return}}t.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+w)}function $(R,w){let H=i.get(R);if(R.version>0&&H.__version!==R.version){D(H,R,w);return}t.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+w)}function ce(R,w){let H=i.get(R);if(R.version>0&&H.__version!==R.version){D(H,R,w);return}t.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+w)}function v(R,w){let H=i.get(R);if(R.version>0&&H.__version!==R.version){q(H,R,w);return}t.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+w)}let B={[kr]:n.REPEAT,[ls]:n.CLAMP_TO_EDGE,[Hl]:n.MIRRORED_REPEAT},O={[Sn]:n.NEAREST,[hp]:n.NEAREST_MIPMAP_NEAREST,[_o]:n.NEAREST_MIPMAP_LINEAR,[ei]:n.LINEAR,[Ja]:n.LINEAR_MIPMAP_NEAREST,[cs]:n.LINEAR_MIPMAP_LINEAR},J={[pp]:n.NEVER,[vp]:n.ALWAYS,[mp]:n.LESS,[Rd]:n.LEQUAL,[gp]:n.EQUAL,[yp]:n.GEQUAL,[_p]:n.GREATER,[xp]:n.NOTEQUAL};function se(R,w){if(w.type===ti&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===ei||w.magFilter===Ja||w.magFilter===_o||w.magFilter===cs||w.minFilter===ei||w.minFilter===Ja||w.minFilter===_o||w.minFilter===cs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,B[w.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,B[w.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,B[w.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,O[w.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,O[w.minFilter]),w.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,J[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Sn||w.minFilter!==_o&&w.minFilter!==cs||w.type===ti&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function ie(R,w){let H=!1;R.__webglInit===void 0&&(R.__webglInit=!0,w.addEventListener("dispose",T));let te=w.source,oe=f.get(te);oe===void 0&&(oe={},f.set(te,oe));let j=Y(w);if(j!==R.__cacheKey){oe[j]===void 0&&(oe[j]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,H=!0),oe[j].usedTimes++;let Pe=oe[R.__cacheKey];Pe!==void 0&&(oe[R.__cacheKey].usedTimes--,Pe.usedTimes===0&&S(w)),R.__cacheKey=j,R.__webglTexture=oe[j].texture}return H}function D(R,w,H){let te=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(te=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(te=n.TEXTURE_3D);let oe=ie(R,w),j=w.source;t.bindTexture(te,R.__webglTexture,n.TEXTURE0+H);let Pe=i.get(j);if(j.version!==Pe.__version||oe===!0){t.activeTexture(n.TEXTURE0+H);let me=je.getPrimaries(je.workingColorSpace),ve=w.colorSpace===Oi?null:je.getPrimaries(w.colorSpace),Ke=w.colorSpace===Oi||me===ve?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let he=_(w.image,!1,s.maxTextureSize);he=nt(w,he);let be=r.convert(w.format,w.colorSpace),Ue=r.convert(w.type),Oe=b(w.internalFormat,be,Ue,w.colorSpace,w.isVideoTexture);se(te,w);let Me,Je=w.mipmaps,qe=w.isVideoTexture!==!0,gt=Pe.__version===void 0||oe===!0,N=j.dataReady,pe=P(w,he);if(w.isDepthTexture)Oe=y(w.format===Js,w.type),gt&&(qe?t.texStorage2D(n.TEXTURE_2D,1,Oe,he.width,he.height):t.texImage2D(n.TEXTURE_2D,0,Oe,he.width,he.height,0,be,Ue,null));else if(w.isDataTexture)if(Je.length>0){qe&&gt&&t.texStorage2D(n.TEXTURE_2D,pe,Oe,Je[0].width,Je[0].height);for(let Z=0,ne=Je.length;Z<ne;Z++)Me=Je[Z],qe?N&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,Me.width,Me.height,be,Ue,Me.data):t.texImage2D(n.TEXTURE_2D,Z,Oe,Me.width,Me.height,0,be,Ue,Me.data);w.generateMipmaps=!1}else qe?(gt&&t.texStorage2D(n.TEXTURE_2D,pe,Oe,he.width,he.height),N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,he.width,he.height,be,Ue,he.data)):t.texImage2D(n.TEXTURE_2D,0,Oe,he.width,he.height,0,be,Ue,he.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){qe&&gt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,pe,Oe,Je[0].width,Je[0].height,he.depth);for(let Z=0,ne=Je.length;Z<ne;Z++)if(Me=Je[Z],w.format!==Hn)if(be!==null)if(qe){if(N)if(w.layerUpdates.size>0){let xe=id(Me.width,Me.height,w.format,w.type);for(let ge of w.layerUpdates){let Ge=Me.data.subarray(ge*xe/Me.data.BYTES_PER_ELEMENT,(ge+1)*xe/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,ge,Me.width,Me.height,1,be,Ge)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,Me.width,Me.height,he.depth,be,Me.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Z,Oe,Me.width,Me.height,he.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qe?N&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,Me.width,Me.height,he.depth,be,Ue,Me.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Z,Oe,Me.width,Me.height,he.depth,0,be,Ue,Me.data)}else{qe&&gt&&t.texStorage2D(n.TEXTURE_2D,pe,Oe,Je[0].width,Je[0].height);for(let Z=0,ne=Je.length;Z<ne;Z++)Me=Je[Z],w.format!==Hn?be!==null?qe?N&&t.compressedTexSubImage2D(n.TEXTURE_2D,Z,0,0,Me.width,Me.height,be,Me.data):t.compressedTexImage2D(n.TEXTURE_2D,Z,Oe,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qe?N&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,Me.width,Me.height,be,Ue,Me.data):t.texImage2D(n.TEXTURE_2D,Z,Oe,Me.width,Me.height,0,be,Ue,Me.data)}else if(w.isDataArrayTexture)if(qe){if(gt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,pe,Oe,he.width,he.height,he.depth),N)if(w.layerUpdates.size>0){let Z=id(he.width,he.height,w.format,w.type);for(let ne of w.layerUpdates){let xe=he.data.subarray(ne*Z/he.data.BYTES_PER_ELEMENT,(ne+1)*Z/he.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ne,he.width,he.height,1,be,Ue,xe)}w.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,he.width,he.height,he.depth,be,Ue,he.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Oe,he.width,he.height,he.depth,0,be,Ue,he.data);else if(w.isData3DTexture)qe?(gt&&t.texStorage3D(n.TEXTURE_3D,pe,Oe,he.width,he.height,he.depth),N&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,he.width,he.height,he.depth,be,Ue,he.data)):t.texImage3D(n.TEXTURE_3D,0,Oe,he.width,he.height,he.depth,0,be,Ue,he.data);else if(w.isFramebufferTexture){if(gt)if(qe)t.texStorage2D(n.TEXTURE_2D,pe,Oe,he.width,he.height);else{let Z=he.width,ne=he.height;for(let xe=0;xe<pe;xe++)t.texImage2D(n.TEXTURE_2D,xe,Oe,Z,ne,0,be,Ue,null),Z>>=1,ne>>=1}}else if(Je.length>0){if(qe&&gt){let Z=De(Je[0]);t.texStorage2D(n.TEXTURE_2D,pe,Oe,Z.width,Z.height)}for(let Z=0,ne=Je.length;Z<ne;Z++)Me=Je[Z],qe?N&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,be,Ue,Me):t.texImage2D(n.TEXTURE_2D,Z,Oe,be,Ue,Me);w.generateMipmaps=!1}else if(qe){if(gt){let Z=De(he);t.texStorage2D(n.TEXTURE_2D,pe,Oe,Z.width,Z.height)}N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,be,Ue,he)}else t.texImage2D(n.TEXTURE_2D,0,Oe,be,Ue,he);m(w)&&d(te),Pe.__version=j.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function q(R,w,H){if(w.image.length!==6)return;let te=ie(R,w),oe=w.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+H);let j=i.get(oe);if(oe.version!==j.__version||te===!0){t.activeTexture(n.TEXTURE0+H);let Pe=je.getPrimaries(je.workingColorSpace),me=w.colorSpace===Oi?null:je.getPrimaries(w.colorSpace),ve=w.colorSpace===Oi||Pe===me?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);let Ke=w.isCompressedTexture||w.image[0].isCompressedTexture,he=w.image[0]&&w.image[0].isDataTexture,be=[];for(let ne=0;ne<6;ne++)!Ke&&!he?be[ne]=_(w.image[ne],!0,s.maxCubemapSize):be[ne]=he?w.image[ne].image:w.image[ne],be[ne]=nt(w,be[ne]);let Ue=be[0],Oe=r.convert(w.format,w.colorSpace),Me=r.convert(w.type),Je=b(w.internalFormat,Oe,Me,w.colorSpace),qe=w.isVideoTexture!==!0,gt=j.__version===void 0||te===!0,N=oe.dataReady,pe=P(w,Ue);se(n.TEXTURE_CUBE_MAP,w);let Z;if(Ke){qe&&gt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,Je,Ue.width,Ue.height);for(let ne=0;ne<6;ne++){Z=be[ne].mipmaps;for(let xe=0;xe<Z.length;xe++){let ge=Z[xe];w.format!==Hn?Oe!==null?qe?N&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,xe,0,0,ge.width,ge.height,Oe,ge.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,xe,Je,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):qe?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,xe,0,0,ge.width,ge.height,Oe,Me,ge.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,xe,Je,ge.width,ge.height,0,Oe,Me,ge.data)}}}else{if(Z=w.mipmaps,qe&&gt){Z.length>0&&pe++;let ne=De(be[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,Je,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(he){qe?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,be[ne].width,be[ne].height,Oe,Me,be[ne].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Je,be[ne].width,be[ne].height,0,Oe,Me,be[ne].data);for(let xe=0;xe<Z.length;xe++){let Ge=Z[xe].image[ne].image;qe?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,xe+1,0,0,Ge.width,Ge.height,Oe,Me,Ge.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,xe+1,Je,Ge.width,Ge.height,0,Oe,Me,Ge.data)}}else{qe?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,Oe,Me,be[ne]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Je,Oe,Me,be[ne]);for(let xe=0;xe<Z.length;xe++){let ge=Z[xe];qe?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,xe+1,0,0,Oe,Me,ge.image[ne]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,xe+1,Je,Oe,Me,ge.image[ne])}}}m(w)&&d(n.TEXTURE_CUBE_MAP),j.__version=oe.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function re(R,w,H,te,oe,j){let Pe=r.convert(H.format,H.colorSpace),me=r.convert(H.type),ve=b(H.internalFormat,Pe,me,H.colorSpace),Ke=i.get(w),he=i.get(H);if(he.__renderTarget=w,!Ke.__hasExternalTextures){let be=Math.max(1,w.width>>j),Ue=Math.max(1,w.height>>j);oe===n.TEXTURE_3D||oe===n.TEXTURE_2D_ARRAY?t.texImage3D(oe,j,ve,be,Ue,w.depth,0,Pe,me,null):t.texImage2D(oe,j,ve,be,Ue,0,Pe,me,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),Ve(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,te,oe,he.__webglTexture,0,ke(w)):(oe===n.TEXTURE_2D||oe>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,te,oe,he.__webglTexture,j),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ae(R,w,H){if(n.bindRenderbuffer(n.RENDERBUFFER,R),w.depthBuffer){let te=w.depthTexture,oe=te&&te.isDepthTexture?te.type:null,j=y(w.stencilBuffer,oe),Pe=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,me=ke(w);Ve(w)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,me,j,w.width,w.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,me,j,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,j,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Pe,n.RENDERBUFFER,R)}else{let te=w.textures;for(let oe=0;oe<te.length;oe++){let j=te[oe],Pe=r.convert(j.format,j.colorSpace),me=r.convert(j.type),ve=b(j.internalFormat,Pe,me,j.colorSpace),Ke=ke(w);H&&Ve(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ke,ve,w.width,w.height):Ve(w)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ke,ve,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,ve,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function z(R,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let te=i.get(w.depthTexture);te.__renderTarget=w,(!te.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),Q(w.depthTexture,0);let oe=te.__webglTexture,j=ke(w);if(w.depthTexture.format===Gs)Ve(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,oe,0,j):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,oe,0);else if(w.depthTexture.format===Js)Ve(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,oe,0,j):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,oe,0);else throw new Error("Unknown depthTexture format")}function ee(R){let w=i.get(R),H=R.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==R.depthTexture){let te=R.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),te){let oe=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,te.removeEventListener("dispose",oe)};te.addEventListener("dispose",oe),w.__depthDisposeCallback=oe}w.__boundDepthTexture=te}if(R.depthTexture&&!w.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");z(w.__webglFramebuffer,R)}else if(H){w.__webglDepthbuffer=[];for(let te=0;te<6;te++)if(t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[te]),w.__webglDepthbuffer[te]===void 0)w.__webglDepthbuffer[te]=n.createRenderbuffer(),ae(w.__webglDepthbuffer[te],R,!1);else{let oe=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,j=w.__webglDepthbuffer[te];n.bindRenderbuffer(n.RENDERBUFFER,j),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,j)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),ae(w.__webglDepthbuffer,R,!1);else{let te=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,oe),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,oe)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ye(R,w,H){let te=i.get(R);w!==void 0&&re(te.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&ee(R)}function Re(R){let w=R.texture,H=i.get(R),te=i.get(w);R.addEventListener("dispose",A);let oe=R.textures,j=R.isWebGLCubeRenderTarget===!0,Pe=oe.length>1;if(Pe||(te.__webglTexture===void 0&&(te.__webglTexture=n.createTexture()),te.__version=w.version,o.memory.textures++),j){H.__webglFramebuffer=[];for(let me=0;me<6;me++)if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer[me]=[];for(let ve=0;ve<w.mipmaps.length;ve++)H.__webglFramebuffer[me][ve]=n.createFramebuffer()}else H.__webglFramebuffer[me]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer=[];for(let me=0;me<w.mipmaps.length;me++)H.__webglFramebuffer[me]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(Pe)for(let me=0,ve=oe.length;me<ve;me++){let Ke=i.get(oe[me]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&Ve(R)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let me=0;me<oe.length;me++){let ve=oe[me];H.__webglColorRenderbuffer[me]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[me]);let Ke=r.convert(ve.format,ve.colorSpace),he=r.convert(ve.type),be=b(ve.internalFormat,Ke,he,ve.colorSpace,R.isXRRenderTarget===!0),Ue=ke(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ue,be,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,H.__webglColorRenderbuffer[me])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),ae(H.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(j){t.bindTexture(n.TEXTURE_CUBE_MAP,te.__webglTexture),se(n.TEXTURE_CUBE_MAP,w);for(let me=0;me<6;me++)if(w.mipmaps&&w.mipmaps.length>0)for(let ve=0;ve<w.mipmaps.length;ve++)re(H.__webglFramebuffer[me][ve],R,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+me,ve);else re(H.__webglFramebuffer[me],R,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0);m(w)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Pe){for(let me=0,ve=oe.length;me<ve;me++){let Ke=oe[me],he=i.get(Ke);t.bindTexture(n.TEXTURE_2D,he.__webglTexture),se(n.TEXTURE_2D,Ke),re(H.__webglFramebuffer,R,Ke,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,0),m(Ke)&&d(n.TEXTURE_2D)}t.unbindTexture()}else{let me=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(me=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(me,te.__webglTexture),se(me,w),w.mipmaps&&w.mipmaps.length>0)for(let ve=0;ve<w.mipmaps.length;ve++)re(H.__webglFramebuffer[ve],R,w,n.COLOR_ATTACHMENT0,me,ve);else re(H.__webglFramebuffer,R,w,n.COLOR_ATTACHMENT0,me,0);m(w)&&d(me),t.unbindTexture()}R.depthBuffer&&ee(R)}function Fe(R){let w=R.textures;for(let H=0,te=w.length;H<te;H++){let oe=w[H];if(m(oe)){let j=x(R),Pe=i.get(oe).__webglTexture;t.bindTexture(j,Pe),d(j),t.unbindTexture()}}}let Qe=[],U=[];function Qt(R){if(R.samples>0){if(Ve(R)===!1){let w=R.textures,H=R.width,te=R.height,oe=n.COLOR_BUFFER_BIT,j=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Pe=i.get(R),me=w.length>1;if(me)for(let ve=0;ve<w.length;ve++)t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let ve=0;ve<w.length;ve++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(oe|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(oe|=n.STENCIL_BUFFER_BIT)),me){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[ve]);let Ke=i.get(w[ve]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ke,0)}n.blitFramebuffer(0,0,H,te,0,0,H,te,oe,n.NEAREST),c===!0&&(Qe.length=0,U.length=0,Qe.push(n.COLOR_ATTACHMENT0+ve),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Qe.push(j),U.push(j),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,U)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Qe))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),me)for(let ve=0;ve<w.length;ve++){t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[ve]);let Ke=i.get(w[ve]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.TEXTURE_2D,Ke,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let w=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function ke(R){return Math.min(s.maxSamples,R.samples)}function Ve(R){let w=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Ce(R){let w=o.render.frame;l.get(R)!==w&&(l.set(R,w),R.update())}function nt(R,w){let H=R.colorSpace,te=R.format,oe=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||H!==nr&&H!==Oi&&(je.getTransfer(H)===at?(te!==Hn||oe!==xi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),w}function De(R){return typeof HTMLImageElement!="undefined"&&R instanceof HTMLImageElement?(h.width=R.naturalWidth||R.width,h.height=R.naturalHeight||R.height):typeof VideoFrame!="undefined"&&R instanceof VideoFrame?(h.width=R.displayWidth,h.height=R.displayHeight):(h.width=R.width,h.height=R.height),h}this.allocateTextureUnit=G,this.resetTextureUnits=V,this.setTexture2D=Q,this.setTexture2DArray=$,this.setTexture3D=ce,this.setTextureCube=v,this.rebindTextures=ye,this.setupRenderTarget=Re,this.updateRenderTargetMipmap=Fe,this.updateMultisampleRenderTarget=Qt,this.setupDepthRenderbuffer=ee,this.setupFrameBufferTexture=re,this.useMultisampledRTT=Ve}function Ax(n,e){function t(i,s=Oi){let r,o=je.getTransfer(s);if(i===xi)return n.UNSIGNED_BYTE;if(i===jc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Qc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===vd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===xd)return n.BYTE;if(i===yd)return n.SHORT;if(i===Fr)return n.UNSIGNED_SHORT;if(i===Kc)return n.INT;if(i===hs)return n.UNSIGNED_INT;if(i===ti)return n.FLOAT;if(i===qr)return n.HALF_FLOAT;if(i===bd)return n.ALPHA;if(i===Md)return n.RGB;if(i===Hn)return n.RGBA;if(i===Sd)return n.LUMINANCE;if(i===wd)return n.LUMINANCE_ALPHA;if(i===Gs)return n.DEPTH_COMPONENT;if(i===Js)return n.DEPTH_STENCIL;if(i===eh)return n.RED;if(i===th)return n.RED_INTEGER;if(i===Ed)return n.RG;if(i===nh)return n.RG_INTEGER;if(i===ih)return n.RGBA_INTEGER;if(i===Xo||i===Yo||i===qo||i===Zo)if(o===at)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Xo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Yo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===qo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Xo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Yo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===qo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Zo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Vl||i===Gl||i===Wl||i===Xl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Vl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Gl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Wl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Xl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Yl||i===ql||i===Zl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Yl||i===ql)return o===at?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Zl)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===$l||i===Jl||i===Kl||i===jl||i===Ql||i===ec||i===tc||i===nc||i===ic||i===sc||i===rc||i===oc||i===ac||i===lc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===$l)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Jl)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Kl)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===jl)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ql)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ec)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===tc)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===nc)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ic)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===sc)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===rc)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===oc)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ac)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===lc)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===$o||i===cc||i===hc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===$o)return o===at?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===cc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===hc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Td||i===uc||i===dc||i===fc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===$o)return r.COMPRESSED_RED_RGTC1_EXT;if(i===uc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===dc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===fc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===$s?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var Rc=class extends Gt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},wt=class extends Xt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Rx={type:"move"},Ur=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,i),d=this._getHandJoint(h,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],f=l.position.distanceTo(u.position),p=.02,g=.005;h.inputState.pinching&&f>p+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&f<=p-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Rx)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new wt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},Cx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Px=`
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

}`,Cc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){let s=new hn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new In({vertexShader:Cx,fragmentShader:Px,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ne(new Mi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Pc=class extends yi{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,h=null,l=null,u=null,f=null,p=null,g=null,_=new Cc,m=t.getContextAttributes(),d=null,x=null,b=[],y=[],P=new Se,T=null,A=new Gt;A.viewport=new lt;let C=new Gt;C.viewport=new lt;let S=[A,C],M=new Rc,L=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(D){let q=b[D];return q===void 0&&(q=new Ur,b[D]=q),q.getTargetRaySpace()},this.getControllerGrip=function(D){let q=b[D];return q===void 0&&(q=new Ur,b[D]=q),q.getGripSpace()},this.getHand=function(D){let q=b[D];return q===void 0&&(q=new Ur,b[D]=q),q.getHandSpace()};function G(D){let q=y.indexOf(D.inputSource);if(q===-1)return;let re=b[q];re!==void 0&&(re.update(D.inputSource,D.frame,h||o),re.dispatchEvent({type:D.type,data:D.inputSource}))}function Y(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",Q);for(let D=0;D<b.length;D++){let q=y[D];q!==null&&(y[D]=null,b[D].disconnect(q))}L=null,V=null,_.reset(),e.setRenderTarget(d),p=null,f=null,u=null,s=null,x=null,ie.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(D){r=D,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(D){a=D,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(D){h=D},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(D){if(s=D,s!==null){if(d=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",Q),m.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(P),s.renderState.layers===void 0){let q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,q),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new Vn(p.framebufferWidth,p.framebufferHeight,{format:Hn,type:xi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let q=null,re=null,ae=null;m.depth&&(ae=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,q=m.stencil?Js:Gs,re=m.stencil?$s:hs);let z={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:r};u=new XRWebGLBinding(s,t),f=u.createProjectionLayer(z),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new Vn(f.textureWidth,f.textureHeight,{format:Hn,type:xi,depthTexture:new oa(f.textureWidth,f.textureHeight,re,void 0,void 0,void 0,void 0,void 0,void 0,q),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),h=null,o=await s.requestReferenceSpace(a),ie.setContext(s),ie.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function Q(D){for(let q=0;q<D.removed.length;q++){let re=D.removed[q],ae=y.indexOf(re);ae>=0&&(y[ae]=null,b[ae].disconnect(re))}for(let q=0;q<D.added.length;q++){let re=D.added[q],ae=y.indexOf(re);if(ae===-1){for(let ee=0;ee<b.length;ee++)if(ee>=y.length){y.push(re),ae=ee;break}else if(y[ee]===null){y[ee]=re,ae=ee;break}if(ae===-1)break}let z=b[ae];z&&z.connect(re)}}let $=new I,ce=new I;function v(D,q,re){$.setFromMatrixPosition(q.matrixWorld),ce.setFromMatrixPosition(re.matrixWorld);let ae=$.distanceTo(ce),z=q.projectionMatrix.elements,ee=re.projectionMatrix.elements,ye=z[14]/(z[10]-1),Re=z[14]/(z[10]+1),Fe=(z[9]+1)/z[5],Qe=(z[9]-1)/z[5],U=(z[8]-1)/z[0],Qt=(ee[8]+1)/ee[0],ke=ye*U,Ve=ye*Qt,Ce=ae/(-U+Qt),nt=Ce*-U;if(q.matrixWorld.decompose(D.position,D.quaternion,D.scale),D.translateX(nt),D.translateZ(Ce),D.matrixWorld.compose(D.position,D.quaternion,D.scale),D.matrixWorldInverse.copy(D.matrixWorld).invert(),z[10]===-1)D.projectionMatrix.copy(q.projectionMatrix),D.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{let De=ye+Ce,R=Re+Ce,w=ke-nt,H=Ve+(ae-nt),te=Fe*Re/R*De,oe=Qe*Re/R*De;D.projectionMatrix.makePerspective(w,H,te,oe,De,R),D.projectionMatrixInverse.copy(D.projectionMatrix).invert()}}function B(D,q){q===null?D.matrixWorld.copy(D.matrix):D.matrixWorld.multiplyMatrices(q.matrixWorld,D.matrix),D.matrixWorldInverse.copy(D.matrixWorld).invert()}this.updateCamera=function(D){if(s===null)return;let q=D.near,re=D.far;_.texture!==null&&(_.depthNear>0&&(q=_.depthNear),_.depthFar>0&&(re=_.depthFar)),M.near=C.near=A.near=q,M.far=C.far=A.far=re,(L!==M.near||V!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),L=M.near,V=M.far),A.layers.mask=D.layers.mask|2,C.layers.mask=D.layers.mask|4,M.layers.mask=A.layers.mask|C.layers.mask;let ae=D.parent,z=M.cameras;B(M,ae);for(let ee=0;ee<z.length;ee++)B(z[ee],ae);z.length===2?v(M,A,C):M.projectionMatrix.copy(A.projectionMatrix),O(D,M,ae)};function O(D,q,re){re===null?D.matrix.copy(q.matrixWorld):(D.matrix.copy(re.matrixWorld),D.matrix.invert(),D.matrix.multiply(q.matrixWorld)),D.matrix.decompose(D.position,D.quaternion,D.scale),D.updateMatrixWorld(!0),D.projectionMatrix.copy(q.projectionMatrix),D.projectionMatrixInverse.copy(q.projectionMatrixInverse),D.isPerspectiveCamera&&(D.fov=Or*2*Math.atan(1/D.projectionMatrix.elements[5]),D.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(D){c=D,f!==null&&(f.fixedFoveation=D),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=D)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let J=null;function se(D,q){if(l=q.getViewerPose(h||o),g=q,l!==null){let re=l.views;p!==null&&(e.setRenderTargetFramebuffer(x,p.framebuffer),e.setRenderTarget(x));let ae=!1;re.length!==M.cameras.length&&(M.cameras.length=0,ae=!0);for(let ee=0;ee<re.length;ee++){let ye=re[ee],Re=null;if(p!==null)Re=p.getViewport(ye);else{let Qe=u.getViewSubImage(f,ye);Re=Qe.viewport,ee===0&&(e.setRenderTargetTextures(x,Qe.colorTexture,f.ignoreDepthValues?void 0:Qe.depthStencilTexture),e.setRenderTarget(x))}let Fe=S[ee];Fe===void 0&&(Fe=new Gt,Fe.layers.enable(ee),Fe.viewport=new lt,S[ee]=Fe),Fe.matrix.fromArray(ye.transform.matrix),Fe.matrix.decompose(Fe.position,Fe.quaternion,Fe.scale),Fe.projectionMatrix.fromArray(ye.projectionMatrix),Fe.projectionMatrixInverse.copy(Fe.projectionMatrix).invert(),Fe.viewport.set(Re.x,Re.y,Re.width,Re.height),ee===0&&(M.matrix.copy(Fe.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ae===!0&&M.cameras.push(Fe)}let z=s.enabledFeatures;if(z&&z.includes("depth-sensing")){let ee=u.getDepthInformation(re[0]);ee&&ee.isValid&&ee.texture&&_.init(e,ee,s.renderState)}}for(let re=0;re<b.length;re++){let ae=y[re],z=b[re];ae!==null&&z!==void 0&&z.update(ae,q,h||o)}J&&J(D,q),q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:q}),g=null}let ie=new Ld;ie.setAnimationLoop(se),this.setAnimationLoop=function(D){J=D},this.dispose=function(){}}},is=new un,Ix=new Xe;function Lx(n,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,Id(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,x,b,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),l(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,y)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),_(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?c(m,d,x,b):d.isSpriteMaterial?h(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===jt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===jt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let x=e.get(d),b=x.envMap,y=x.envMapRotation;b&&(m.envMap.value=b,is.copy(y),is.x*=-1,is.y*=-1,is.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),m.envMapRotation.value.setFromMatrix4(Ix.makeRotationFromEuler(is)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,x,b){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*x,m.scale.value=b*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,x){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===jt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){let x=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Dx(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,b){let y=b.program;i.uniformBlockBinding(x,y)}function h(x,b){let y=s[x.id];y===void 0&&(g(x),y=l(x),s[x.id]=y,x.addEventListener("dispose",m));let P=b.program;i.updateUBOMapping(x,P);let T=e.render.frame;r[x.id]!==T&&(f(x),r[x.id]=T)}function l(x){let b=u();x.__bindingPointIndex=b;let y=n.createBuffer(),P=x.__size,T=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,P,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,b,y),y}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){let b=s[x.id],y=x.uniforms,P=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let T=0,A=y.length;T<A;T++){let C=Array.isArray(y[T])?y[T]:[y[T]];for(let S=0,M=C.length;S<M;S++){let L=C[S];if(p(L,T,S,P)===!0){let V=L.__offset,G=Array.isArray(L.value)?L.value:[L.value],Y=0;for(let Q=0;Q<G.length;Q++){let $=G[Q],ce=_($);typeof $=="number"||typeof $=="boolean"?(L.__data[0]=$,n.bufferSubData(n.UNIFORM_BUFFER,V+Y,L.__data)):$.isMatrix3?(L.__data[0]=$.elements[0],L.__data[1]=$.elements[1],L.__data[2]=$.elements[2],L.__data[3]=0,L.__data[4]=$.elements[3],L.__data[5]=$.elements[4],L.__data[6]=$.elements[5],L.__data[7]=0,L.__data[8]=$.elements[6],L.__data[9]=$.elements[7],L.__data[10]=$.elements[8],L.__data[11]=0):($.toArray(L.__data,Y),Y+=ce.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,V,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(x,b,y,P){let T=x.value,A=b+"_"+y;if(P[A]===void 0)return typeof T=="number"||typeof T=="boolean"?P[A]=T:P[A]=T.clone(),!0;{let C=P[A];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return P[A]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(x){let b=x.uniforms,y=0,P=16;for(let A=0,C=b.length;A<C;A++){let S=Array.isArray(b[A])?b[A]:[b[A]];for(let M=0,L=S.length;M<L;M++){let V=S[M],G=Array.isArray(V.value)?V.value:[V.value];for(let Y=0,Q=G.length;Y<Q;Y++){let $=G[Y],ce=_($),v=y%P,B=v%ce.boundary,O=v+B;y+=B,O!==0&&P-O<ce.storage&&(y+=P-O),V.__data=new Float32Array(ce.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=y,y+=ce.storage}}}let T=y%P;return T>0&&(y+=P-T),x.__size=y,x.__cache={},this}function _(x){let b={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(b.boundary=4,b.storage=4):x.isVector2?(b.boundary=8,b.storage=8):x.isVector3||x.isColor?(b.boundary=16,b.storage=12):x.isVector4?(b.boundary=16,b.storage=16):x.isMatrix3?(b.boundary=48,b.storage=48):x.isMatrix4?(b.boundary=64,b.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),b}function m(x){let b=x.target;b.removeEventListener("dispose",m);let y=o.indexOf(b.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function d(){for(let x in s)n.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:c,update:h,dispose:d}}var aa=class{constructor(e={}){let{canvas:t=Fp(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext!="undefined"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,d=null,x=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ot,this.toneMapping=ni,this.toneMappingExposure=1;let y=this,P=!1,T=0,A=0,C=null,S=-1,M=null,L=new lt,V=new lt,G=null,Y=new Le(0),Q=0,$=t.width,ce=t.height,v=1,B=null,O=null,J=new lt(0,0,$,ce),se=new lt(0,0,$,ce),ie=!1,D=new zr,q=!1,re=!1,ae=new Xe,z=new Xe,ee=new I,ye=new lt,Re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Fe=!1;function Qe(){return C===null?v:1}let U=i;function Qt(E,k){return t.getContext(E,k)}try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",ne,!1),t.addEventListener("webglcontextrestored",xe,!1),t.addEventListener("webglcontextcreationerror",ge,!1),U===null){let k="webgl2";if(U=Qt(k,E),U===null)throw Qt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let ke,Ve,Ce,nt,De,R,w,H,te,oe,j,Pe,me,ve,Ke,he,be,Ue,Oe,Me,Je,qe,gt,N;function pe(){ke=new $g(U),ke.init(),qe=new Ax(U,ke),Ve=new Gg(U,ke,e,qe),Ce=new wx(U,ke),Ve.reverseDepthBuffer&&f&&Ce.buffers.depth.setReversed(!0),nt=new jg(U),De=new ux,R=new Tx(U,ke,Ce,De,Ve,qe,nt),w=new Xg(y),H=new Zg(y),te=new rm(U),gt=new Hg(U,te),oe=new Jg(U,te,nt,gt),j=new e_(U,oe,te,nt),Oe=new Qg(U,Ve,R),he=new Wg(De),Pe=new hx(y,w,H,ke,Ve,gt,he),me=new Lx(y,De),ve=new fx,Ke=new yx(ke),Ue=new zg(y,w,H,Ce,j,p,c),be=new Mx(y,j,Ve),N=new Dx(U,nt,Ve,Ce),Me=new Vg(U,ke,nt),Je=new Kg(U,ke,nt),nt.programs=Pe.programs,y.capabilities=Ve,y.extensions=ke,y.properties=De,y.renderLists=ve,y.shadowMap=be,y.state=Ce,y.info=nt}pe();let Z=new Pc(y,U);this.xr=Z,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let E=ke.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=ke.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return v},this.setPixelRatio=function(E){E!==void 0&&(v=E,this.setSize($,ce,!1))},this.getSize=function(E){return E.set($,ce)},this.setSize=function(E,k,W=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=E,ce=k,t.width=Math.floor(E*v),t.height=Math.floor(k*v),W===!0&&(t.style.width=E+"px",t.style.height=k+"px"),this.setViewport(0,0,E,k)},this.getDrawingBufferSize=function(E){return E.set($*v,ce*v).floor()},this.setDrawingBufferSize=function(E,k,W){$=E,ce=k,v=W,t.width=Math.floor(E*W),t.height=Math.floor(k*W),this.setViewport(0,0,E,k)},this.getCurrentViewport=function(E){return E.copy(L)},this.getViewport=function(E){return E.copy(J)},this.setViewport=function(E,k,W,X){E.isVector4?J.set(E.x,E.y,E.z,E.w):J.set(E,k,W,X),Ce.viewport(L.copy(J).multiplyScalar(v).round())},this.getScissor=function(E){return E.copy(se)},this.setScissor=function(E,k,W,X){E.isVector4?se.set(E.x,E.y,E.z,E.w):se.set(E,k,W,X),Ce.scissor(V.copy(se).multiplyScalar(v).round())},this.getScissorTest=function(){return ie},this.setScissorTest=function(E){Ce.setScissorTest(ie=E)},this.setOpaqueSort=function(E){B=E},this.setTransparentSort=function(E){O=E},this.getClearColor=function(E){return E.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor.apply(Ue,arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha.apply(Ue,arguments)},this.clear=function(E=!0,k=!0,W=!0){let X=0;if(E){let F=!1;if(C!==null){let ue=C.texture.format;F=ue===ih||ue===nh||ue===th}if(F){let ue=C.texture.type,_e=ue===xi||ue===hs||ue===Fr||ue===$s||ue===jc||ue===Qc,Ee=Ue.getClearColor(),Te=Ue.getClearAlpha(),Be=Ee.r,We=Ee.g,Ae=Ee.b;_e?(g[0]=Be,g[1]=We,g[2]=Ae,g[3]=Te,U.clearBufferuiv(U.COLOR,0,g)):(_[0]=Be,_[1]=We,_[2]=Ae,_[3]=Te,U.clearBufferiv(U.COLOR,0,_))}else X|=U.COLOR_BUFFER_BIT}k&&(X|=U.DEPTH_BUFFER_BIT),W&&(X|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ne,!1),t.removeEventListener("webglcontextrestored",xe,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),ve.dispose(),Ke.dispose(),De.dispose(),w.dispose(),H.dispose(),j.dispose(),gt.dispose(),N.dispose(),Pe.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",Jh),Z.removeEventListener("sessionend",Kh),Ki.stop()};function ne(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;let E=nt.autoReset,k=be.enabled,W=be.autoUpdate,X=be.needsUpdate,F=be.type;pe(),nt.autoReset=E,be.enabled=k,be.autoUpdate=W,be.needsUpdate=X,be.type=F}function ge(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ge(E){let k=E.target;k.removeEventListener("dispose",Ge),St(k)}function St(E){$t(E),De.remove(E)}function $t(E){let k=De.get(E).programs;k!==void 0&&(k.forEach(function(W){Pe.releaseProgram(W)}),E.isShaderMaterial&&Pe.releaseShaderCache(E))}this.renderBufferDirect=function(E,k,W,X,F,ue){k===null&&(k=Re);let _e=F.isMesh&&F.matrixWorld.determinant()<0,Ee=Df(E,k,W,X,F);Ce.setMaterial(X,_e);let Te=W.index,Be=1;if(X.wireframe===!0){if(Te=oe.getWireframeAttribute(W),Te===void 0)return;Be=2}let We=W.drawRange,Ae=W.attributes.position,et=We.start*Be,_t=(We.start+We.count)*Be;ue!==null&&(et=Math.max(et,ue.start*Be),_t=Math.min(_t,(ue.start+ue.count)*Be)),Te!==null?(et=Math.max(et,0),_t=Math.min(_t,Te.count)):Ae!=null&&(et=Math.max(et,0),_t=Math.min(_t,Ae.count));let yt=_t-et;if(yt<0||yt===1/0)return;gt.setup(F,X,Ee,W,Te);let cn,it=Me;if(Te!==null&&(cn=te.get(Te),it=Je,it.setIndex(cn)),F.isMesh)X.wireframe===!0?(Ce.setLineWidth(X.wireframeLinewidth*Qe()),it.setMode(U.LINES)):it.setMode(U.TRIANGLES);else if(F.isLine){let Ie=X.linewidth;Ie===void 0&&(Ie=1),Ce.setLineWidth(Ie*Qe()),F.isLineSegments?it.setMode(U.LINES):F.isLineLoop?it.setMode(U.LINE_LOOP):it.setMode(U.LINE_STRIP)}else F.isPoints?it.setMode(U.POINTS):F.isSprite&&it.setMode(U.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)it.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(ke.get("WEBGL_multi_draw"))it.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{let Ie=F._multiDrawStarts,ci=F._multiDrawCounts,st=F._multiDrawCount,Fn=Te?te.get(Te).bytesPerElement:1,Es=De.get(X).currentProgram.getUniforms();for(let yn=0;yn<st;yn++)Es.setValue(U,"_gl_DrawID",yn),it.render(Ie[yn]/Fn,ci[yn])}else if(F.isInstancedMesh)it.renderInstances(et,yt,F.count);else if(W.isInstancedBufferGeometry){let Ie=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ci=Math.min(W.instanceCount,Ie);it.renderInstances(et,yt,ci)}else it.render(et,yt)};function rt(E,k,W){E.transparent===!0&&E.side===Ct&&E.forceSinglePass===!1?(E.side=jt,E.needsUpdate=!0,go(E,k,W),E.side=Hi,E.needsUpdate=!0,go(E,k,W),E.side=Ct):go(E,k,W)}this.compile=function(E,k,W=null){W===null&&(W=E),d=Ke.get(W),d.init(k),b.push(d),W.traverseVisible(function(F){F.isLight&&F.layers.test(k.layers)&&(d.pushLight(F),F.castShadow&&d.pushShadow(F))}),E!==W&&E.traverseVisible(function(F){F.isLight&&F.layers.test(k.layers)&&(d.pushLight(F),F.castShadow&&d.pushShadow(F))}),d.setupLights();let X=new Set;return E.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;let ue=F.material;if(ue)if(Array.isArray(ue))for(let _e=0;_e<ue.length;_e++){let Ee=ue[_e];rt(Ee,W,F),X.add(Ee)}else rt(ue,W,F),X.add(ue)}),b.pop(),d=null,X},this.compileAsync=function(E,k,W=null){let X=this.compile(E,k,W);return new Promise(F=>{function ue(){if(X.forEach(function(_e){De.get(_e).currentProgram.isReady()&&X.delete(_e)}),X.size===0){F(E);return}setTimeout(ue,10)}ke.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let kn=null;function li(E){kn&&kn(E)}function Jh(){Ki.stop()}function Kh(){Ki.start()}let Ki=new Ld;Ki.setAnimationLoop(li),typeof self!="undefined"&&Ki.setContext(self),this.setAnimationLoop=function(E){kn=E,Z.setAnimationLoop(E),E===null?Ki.stop():Ki.start()},Z.addEventListener("sessionstart",Jh),Z.addEventListener("sessionend",Kh),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(k),k=Z.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,k,C),d=Ke.get(E,b.length),d.init(k),b.push(d),z.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),D.setFromProjectionMatrix(z),re=this.localClippingEnabled,q=he.init(this.clippingPlanes,re),m=ve.get(E,x.length),m.init(),x.push(m),Z.enabled===!0&&Z.isPresenting===!0){let ue=y.xr.getDepthSensingMesh();ue!==null&&$a(ue,k,-1/0,y.sortObjects)}$a(E,k,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(B,O),Fe=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,Fe&&Ue.addToRenderList(m,E),this.info.render.frame++,q===!0&&he.beginShadows();let W=d.state.shadowsArray;be.render(W,E,k),q===!0&&he.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=m.opaque,F=m.transmissive;if(d.setupLights(),k.isArrayCamera){let ue=k.cameras;if(F.length>0)for(let _e=0,Ee=ue.length;_e<Ee;_e++){let Te=ue[_e];Qh(X,F,E,Te)}Fe&&Ue.render(E);for(let _e=0,Ee=ue.length;_e<Ee;_e++){let Te=ue[_e];jh(m,E,Te,Te.viewport)}}else F.length>0&&Qh(X,F,E,k),Fe&&Ue.render(E),jh(m,E,k);C!==null&&(R.updateMultisampleRenderTarget(C),R.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(y,E,k),gt.resetDefaultState(),S=-1,M=null,b.pop(),b.length>0?(d=b[b.length-1],q===!0&&he.setGlobalState(y.clippingPlanes,d.state.camera)):d=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function $a(E,k,W,X){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)W=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLight)d.pushLight(E),E.castShadow&&d.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||D.intersectsSprite(E)){X&&ye.setFromMatrixPosition(E.matrixWorld).applyMatrix4(z);let _e=j.update(E),Ee=E.material;Ee.visible&&m.push(E,_e,Ee,W,ye.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||D.intersectsObject(E))){let _e=j.update(E),Ee=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),ye.copy(E.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),ye.copy(_e.boundingSphere.center)),ye.applyMatrix4(E.matrixWorld).applyMatrix4(z)),Array.isArray(Ee)){let Te=_e.groups;for(let Be=0,We=Te.length;Be<We;Be++){let Ae=Te[Be],et=Ee[Ae.materialIndex];et&&et.visible&&m.push(E,_e,et,W,ye.z,Ae)}}else Ee.visible&&m.push(E,_e,Ee,W,ye.z,null)}}let ue=E.children;for(let _e=0,Ee=ue.length;_e<Ee;_e++)$a(ue[_e],k,W,X)}function jh(E,k,W,X){let F=E.opaque,ue=E.transmissive,_e=E.transparent;d.setupLightsView(W),q===!0&&he.setGlobalState(y.clippingPlanes,W),X&&Ce.viewport(L.copy(X)),F.length>0&&mo(F,k,W),ue.length>0&&mo(ue,k,W),_e.length>0&&mo(_e,k,W),Ce.buffers.depth.setTest(!0),Ce.buffers.depth.setMask(!0),Ce.buffers.color.setMask(!0),Ce.setPolygonOffset(!1)}function Qh(E,k,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[X.id]===void 0&&(d.state.transmissionRenderTarget[X.id]=new Vn(1,1,{generateMipmaps:!0,type:ke.has("EXT_color_buffer_half_float")||ke.has("EXT_color_buffer_float")?qr:xi,minFilter:cs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace}));let ue=d.state.transmissionRenderTarget[X.id],_e=X.viewport||L;ue.setSize(_e.z,_e.w);let Ee=y.getRenderTarget();y.setRenderTarget(ue),y.getClearColor(Y),Q=y.getClearAlpha(),Q<1&&y.setClearColor(16777215,.5),y.clear(),Fe&&Ue.render(W);let Te=y.toneMapping;y.toneMapping=ni;let Be=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),d.setupLightsView(X),q===!0&&he.setGlobalState(y.clippingPlanes,X),mo(E,W,X),R.updateMultisampleRenderTarget(ue),R.updateRenderTargetMipmap(ue),ke.has("WEBGL_multisampled_render_to_texture")===!1){let We=!1;for(let Ae=0,et=k.length;Ae<et;Ae++){let _t=k[Ae],yt=_t.object,cn=_t.geometry,it=_t.material,Ie=_t.group;if(it.side===Ct&&yt.layers.test(X.layers)){let ci=it.side;it.side=jt,it.needsUpdate=!0,eu(yt,W,X,cn,it,Ie),it.side=ci,it.needsUpdate=!0,We=!0}}We===!0&&(R.updateMultisampleRenderTarget(ue),R.updateRenderTargetMipmap(ue))}y.setRenderTarget(Ee),y.setClearColor(Y,Q),Be!==void 0&&(X.viewport=Be),y.toneMapping=Te}function mo(E,k,W){let X=k.isScene===!0?k.overrideMaterial:null;for(let F=0,ue=E.length;F<ue;F++){let _e=E[F],Ee=_e.object,Te=_e.geometry,Be=X===null?_e.material:X,We=_e.group;Ee.layers.test(W.layers)&&eu(Ee,k,W,Te,Be,We)}}function eu(E,k,W,X,F,ue){E.onBeforeRender(y,k,W,X,F,ue),E.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),F.onBeforeRender(y,k,W,X,E,ue),F.transparent===!0&&F.side===Ct&&F.forceSinglePass===!1?(F.side=jt,F.needsUpdate=!0,y.renderBufferDirect(W,k,X,F,E,ue),F.side=Hi,F.needsUpdate=!0,y.renderBufferDirect(W,k,X,F,E,ue),F.side=Ct):y.renderBufferDirect(W,k,X,F,E,ue),E.onAfterRender(y,k,W,X,F,ue)}function go(E,k,W){k.isScene!==!0&&(k=Re);let X=De.get(E),F=d.state.lights,ue=d.state.shadowsArray,_e=F.state.version,Ee=Pe.getParameters(E,F.state,ue,k,W),Te=Pe.getProgramCacheKey(Ee),Be=X.programs;X.environment=E.isMeshStandardMaterial?k.environment:null,X.fog=k.fog,X.envMap=(E.isMeshStandardMaterial?H:w).get(E.envMap||X.environment),X.envMapRotation=X.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,Be===void 0&&(E.addEventListener("dispose",Ge),Be=new Map,X.programs=Be);let We=Be.get(Te);if(We!==void 0){if(X.currentProgram===We&&X.lightsStateVersion===_e)return nu(E,Ee),We}else Ee.uniforms=Pe.getUniforms(E),E.onBeforeCompile(Ee,y),We=Pe.acquireProgram(Ee,Te),Be.set(Te,We),X.uniforms=Ee.uniforms;let Ae=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ae.clippingPlanes=he.uniform),nu(E,Ee),X.needsLights=Nf(E),X.lightsStateVersion=_e,X.needsLights&&(Ae.ambientLightColor.value=F.state.ambient,Ae.lightProbe.value=F.state.probe,Ae.directionalLights.value=F.state.directional,Ae.directionalLightShadows.value=F.state.directionalShadow,Ae.spotLights.value=F.state.spot,Ae.spotLightShadows.value=F.state.spotShadow,Ae.rectAreaLights.value=F.state.rectArea,Ae.ltc_1.value=F.state.rectAreaLTC1,Ae.ltc_2.value=F.state.rectAreaLTC2,Ae.pointLights.value=F.state.point,Ae.pointLightShadows.value=F.state.pointShadow,Ae.hemisphereLights.value=F.state.hemi,Ae.directionalShadowMap.value=F.state.directionalShadowMap,Ae.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Ae.spotShadowMap.value=F.state.spotShadowMap,Ae.spotLightMatrix.value=F.state.spotLightMatrix,Ae.spotLightMap.value=F.state.spotLightMap,Ae.pointShadowMap.value=F.state.pointShadowMap,Ae.pointShadowMatrix.value=F.state.pointShadowMatrix),X.currentProgram=We,X.uniformsList=null,We}function tu(E){if(E.uniformsList===null){let k=E.currentProgram.getUniforms();E.uniformsList=Xs.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function nu(E,k){let W=De.get(E);W.outputColorSpace=k.outputColorSpace,W.batching=k.batching,W.batchingColor=k.batchingColor,W.instancing=k.instancing,W.instancingColor=k.instancingColor,W.instancingMorph=k.instancingMorph,W.skinning=k.skinning,W.morphTargets=k.morphTargets,W.morphNormals=k.morphNormals,W.morphColors=k.morphColors,W.morphTargetsCount=k.morphTargetsCount,W.numClippingPlanes=k.numClippingPlanes,W.numIntersection=k.numClipIntersection,W.vertexAlphas=k.vertexAlphas,W.vertexTangents=k.vertexTangents,W.toneMapping=k.toneMapping}function Df(E,k,W,X,F){k.isScene!==!0&&(k=Re),R.resetTextureUnits();let ue=k.fog,_e=X.isMeshStandardMaterial?k.environment:null,Ee=C===null?y.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:nr,Te=(X.isMeshStandardMaterial?H:w).get(X.envMap||_e),Be=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,We=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ae=!!W.morphAttributes.position,et=!!W.morphAttributes.normal,_t=!!W.morphAttributes.color,yt=ni;X.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(yt=y.toneMapping);let cn=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,it=cn!==void 0?cn.length:0,Ie=De.get(X),ci=d.state.lights;if(q===!0&&(re===!0||E!==M)){let Cn=E===M&&X.id===S;he.setState(X,E,Cn)}let st=!1;X.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==ci.state.version||Ie.outputColorSpace!==Ee||F.isBatchedMesh&&Ie.batching===!1||!F.isBatchedMesh&&Ie.batching===!0||F.isBatchedMesh&&Ie.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Ie.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Ie.instancing===!1||!F.isInstancedMesh&&Ie.instancing===!0||F.isSkinnedMesh&&Ie.skinning===!1||!F.isSkinnedMesh&&Ie.skinning===!0||F.isInstancedMesh&&Ie.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Ie.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Ie.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Ie.instancingMorph===!1&&F.morphTexture!==null||Ie.envMap!==Te||X.fog===!0&&Ie.fog!==ue||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==he.numPlanes||Ie.numIntersection!==he.numIntersection)||Ie.vertexAlphas!==Be||Ie.vertexTangents!==We||Ie.morphTargets!==Ae||Ie.morphNormals!==et||Ie.morphColors!==_t||Ie.toneMapping!==yt||Ie.morphTargetsCount!==it)&&(st=!0):(st=!0,Ie.__version=X.version);let Fn=Ie.currentProgram;st===!0&&(Fn=go(X,k,F));let Es=!1,yn=!1,vr=!1,vt=Fn.getUniforms(),jn=Ie.uniforms;if(Ce.useProgram(Fn.program)&&(Es=!0,yn=!0,vr=!0),X.id!==S&&(S=X.id,yn=!0),Es||M!==E){Ce.buffers.depth.getReversed()?(ae.copy(E.projectionMatrix),Bp(ae),zp(ae),vt.setValue(U,"projectionMatrix",ae)):vt.setValue(U,"projectionMatrix",E.projectionMatrix),vt.setValue(U,"viewMatrix",E.matrixWorldInverse);let Pi=vt.map.cameraPosition;Pi!==void 0&&Pi.setValue(U,ee.setFromMatrixPosition(E.matrixWorld)),Ve.logarithmicDepthBuffer&&vt.setValue(U,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&vt.setValue(U,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,yn=!0,vr=!0)}if(F.isSkinnedMesh){vt.setOptional(U,F,"bindMatrix"),vt.setOptional(U,F,"bindMatrixInverse");let Cn=F.skeleton;Cn&&(Cn.boneTexture===null&&Cn.computeBoneTexture(),vt.setValue(U,"boneTexture",Cn.boneTexture,R))}F.isBatchedMesh&&(vt.setOptional(U,F,"batchingTexture"),vt.setValue(U,"batchingTexture",F._matricesTexture,R),vt.setOptional(U,F,"batchingIdTexture"),vt.setValue(U,"batchingIdTexture",F._indirectTexture,R),vt.setOptional(U,F,"batchingColorTexture"),F._colorsTexture!==null&&vt.setValue(U,"batchingColorTexture",F._colorsTexture,R));let br=W.morphAttributes;if((br.position!==void 0||br.normal!==void 0||br.color!==void 0)&&Oe.update(F,W,Fn),(yn||Ie.receiveShadow!==F.receiveShadow)&&(Ie.receiveShadow=F.receiveShadow,vt.setValue(U,"receiveShadow",F.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(jn.envMap.value=Te,jn.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&k.environment!==null&&(jn.envMapIntensity.value=k.environmentIntensity),yn&&(vt.setValue(U,"toneMappingExposure",y.toneMappingExposure),Ie.needsLights&&Uf(jn,vr),ue&&X.fog===!0&&me.refreshFogUniforms(jn,ue),me.refreshMaterialUniforms(jn,X,v,ce,d.state.transmissionRenderTarget[E.id]),Xs.upload(U,tu(Ie),jn,R)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Xs.upload(U,tu(Ie),jn,R),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&vt.setValue(U,"center",F.center),vt.setValue(U,"modelViewMatrix",F.modelViewMatrix),vt.setValue(U,"normalMatrix",F.normalMatrix),vt.setValue(U,"modelMatrix",F.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let Cn=X.uniformsGroups;for(let Pi=0,Ii=Cn.length;Pi<Ii;Pi++){let iu=Cn[Pi];N.update(iu,Fn),N.bind(iu,Fn)}}return Fn}function Uf(E,k){E.ambientLightColor.needsUpdate=k,E.lightProbe.needsUpdate=k,E.directionalLights.needsUpdate=k,E.directionalLightShadows.needsUpdate=k,E.pointLights.needsUpdate=k,E.pointLightShadows.needsUpdate=k,E.spotLights.needsUpdate=k,E.spotLightShadows.needsUpdate=k,E.rectAreaLights.needsUpdate=k,E.hemisphereLights.needsUpdate=k}function Nf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,k,W){De.get(E.texture).__webglTexture=k,De.get(E.depthTexture).__webglTexture=W;let X=De.get(E);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||ke.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,k){let W=De.get(E);W.__webglFramebuffer=k,W.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(E,k=0,W=0){C=E,T=k,A=W;let X=!0,F=null,ue=!1,_e=!1;if(E){let Te=De.get(E);if(Te.__useDefaultFramebuffer!==void 0)Ce.bindFramebuffer(U.FRAMEBUFFER,null),X=!1;else if(Te.__webglFramebuffer===void 0)R.setupRenderTarget(E);else if(Te.__hasExternalTextures)R.rebindTextures(E,De.get(E.texture).__webglTexture,De.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Ae=E.depthTexture;if(Te.__boundDepthTexture!==Ae){if(Ae!==null&&De.has(Ae)&&(E.width!==Ae.image.width||E.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(E)}}let Be=E.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(_e=!0);let We=De.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(We[k])?F=We[k][W]:F=We[k],ue=!0):E.samples>0&&R.useMultisampledRTT(E)===!1?F=De.get(E).__webglMultisampledFramebuffer:Array.isArray(We)?F=We[W]:F=We,L.copy(E.viewport),V.copy(E.scissor),G=E.scissorTest}else L.copy(J).multiplyScalar(v).floor(),V.copy(se).multiplyScalar(v).floor(),G=ie;if(Ce.bindFramebuffer(U.FRAMEBUFFER,F)&&X&&Ce.drawBuffers(E,F),Ce.viewport(L),Ce.scissor(V),Ce.setScissorTest(G),ue){let Te=De.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+k,Te.__webglTexture,W)}else if(_e){let Te=De.get(E.texture),Be=k||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Te.__webglTexture,W||0,Be)}S=-1},this.readRenderTargetPixels=function(E,k,W,X,F,ue,_e){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=De.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&_e!==void 0&&(Ee=Ee[_e]),Ee){Ce.bindFramebuffer(U.FRAMEBUFFER,Ee);try{let Te=E.texture,Be=Te.format,We=Te.type;if(!Ve.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ve.textureTypeReadable(We)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=E.width-X&&W>=0&&W<=E.height-F&&U.readPixels(k,W,X,F,qe.convert(Be),qe.convert(We),ue)}finally{let Te=C!==null?De.get(C).__webglFramebuffer:null;Ce.bindFramebuffer(U.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(E,k,W,X,F,ue,_e){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=De.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&_e!==void 0&&(Ee=Ee[_e]),Ee){let Te=E.texture,Be=Te.format,We=Te.type;if(!Ve.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ve.textureTypeReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=E.width-X&&W>=0&&W<=E.height-F){Ce.bindFramebuffer(U.FRAMEBUFFER,Ee);let Ae=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ae),U.bufferData(U.PIXEL_PACK_BUFFER,ue.byteLength,U.STREAM_READ),U.readPixels(k,W,X,F,qe.convert(Be),qe.convert(We),0);let et=C!==null?De.get(C).__webglFramebuffer:null;Ce.bindFramebuffer(U.FRAMEBUFFER,et);let _t=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Op(U,_t,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ae),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ue),U.deleteBuffer(Ae),U.deleteSync(_t),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,k=null,W=0){E.isTexture!==!0&&(Pr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,E=arguments[1]);let X=Math.pow(2,-W),F=Math.floor(E.image.width*X),ue=Math.floor(E.image.height*X),_e=k!==null?k.x:0,Ee=k!==null?k.y:0;R.setTexture2D(E,0),U.copyTexSubImage2D(U.TEXTURE_2D,W,0,0,_e,Ee,F,ue),Ce.unbindTexture()},this.copyTextureToTexture=function(E,k,W=null,X=null,F=0){E.isTexture!==!0&&(Pr("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,E=arguments[1],k=arguments[2],F=arguments[3]||0,W=null);let ue,_e,Ee,Te,Be,We,Ae,et,_t,yt=E.isCompressedTexture?E.mipmaps[F]:E.image;W!==null?(ue=W.max.x-W.min.x,_e=W.max.y-W.min.y,Ee=W.isBox3?W.max.z-W.min.z:1,Te=W.min.x,Be=W.min.y,We=W.isBox3?W.min.z:0):(ue=yt.width,_e=yt.height,Ee=yt.depth||1,Te=0,Be=0,We=0),X!==null?(Ae=X.x,et=X.y,_t=X.z):(Ae=0,et=0,_t=0);let cn=qe.convert(k.format),it=qe.convert(k.type),Ie;k.isData3DTexture?(R.setTexture3D(k,0),Ie=U.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(R.setTexture2DArray(k,0),Ie=U.TEXTURE_2D_ARRAY):(R.setTexture2D(k,0),Ie=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,k.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,k.unpackAlignment);let ci=U.getParameter(U.UNPACK_ROW_LENGTH),st=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Fn=U.getParameter(U.UNPACK_SKIP_PIXELS),Es=U.getParameter(U.UNPACK_SKIP_ROWS),yn=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,yt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,yt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Te),U.pixelStorei(U.UNPACK_SKIP_ROWS,Be),U.pixelStorei(U.UNPACK_SKIP_IMAGES,We);let vr=E.isDataArrayTexture||E.isData3DTexture,vt=k.isDataArrayTexture||k.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){let jn=De.get(E),br=De.get(k),Cn=De.get(jn.__renderTarget),Pi=De.get(br.__renderTarget);Ce.bindFramebuffer(U.READ_FRAMEBUFFER,Cn.__webglFramebuffer),Ce.bindFramebuffer(U.DRAW_FRAMEBUFFER,Pi.__webglFramebuffer);for(let Ii=0;Ii<Ee;Ii++)vr&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,De.get(E).__webglTexture,F,We+Ii),E.isDepthTexture?(vt&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,De.get(k).__webglTexture,F,_t+Ii),U.blitFramebuffer(Te,Be,ue,_e,Ae,et,ue,_e,U.DEPTH_BUFFER_BIT,U.NEAREST)):vt?U.copyTexSubImage3D(Ie,F,Ae,et,_t+Ii,Te,Be,ue,_e):U.copyTexSubImage2D(Ie,F,Ae,et,_t+Ii,Te,Be,ue,_e);Ce.bindFramebuffer(U.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else vt?E.isDataTexture||E.isData3DTexture?U.texSubImage3D(Ie,F,Ae,et,_t,ue,_e,Ee,cn,it,yt.data):k.isCompressedArrayTexture?U.compressedTexSubImage3D(Ie,F,Ae,et,_t,ue,_e,Ee,cn,yt.data):U.texSubImage3D(Ie,F,Ae,et,_t,ue,_e,Ee,cn,it,yt):E.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,F,Ae,et,ue,_e,cn,it,yt.data):E.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,F,Ae,et,yt.width,yt.height,cn,yt.data):U.texSubImage2D(U.TEXTURE_2D,F,Ae,et,ue,_e,cn,it,yt);U.pixelStorei(U.UNPACK_ROW_LENGTH,ci),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,st),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Fn),U.pixelStorei(U.UNPACK_SKIP_ROWS,Es),U.pixelStorei(U.UNPACK_SKIP_IMAGES,yn),F===0&&k.generateMipmaps&&U.generateMipmap(Ie),Ce.unbindTexture()},this.copyTextureToTexture3D=function(E,k,W=null,X=null,F=0){return E.isTexture!==!0&&(Pr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,E=arguments[2],k=arguments[3],F=arguments[4]||0),Pr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,k,W,X,F)},this.initRenderTarget=function(E){De.get(E).__webglFramebuffer===void 0&&R.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?R.setTextureCube(E,0):E.isData3DTexture?R.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?R.setTexture2DArray(E,0):R.setTexture2D(E,0),Ce.unbindTexture()},this.resetState=function(){T=0,A=0,C=null,Ce.reset(),gt.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}};var Qs=class extends Xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new un,this.environmentIntensity=1,this.environmentRotation=new un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Ic=class extends hn{constructor(e=null,t=1,i=1,s,r,o,a,c,h=Sn,l=Sn,u,f){super(null,o,a,c,h,l,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Hr=class extends xt{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},zs=new Xe,sd=new Xe,Oo=[],rd=new wn,Ux=new Xe,Tr=new Ne,Ar=new vi,Vr=class extends Ne{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Hr(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Ux)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new wn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,zs),rd.copy(e.boundingBox).applyMatrix4(zs),this.boundingBox.union(rd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new vi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,zs),Ar.copy(e.boundingSphere).applyMatrix4(zs),this.boundingSphere.union(Ar)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(Tr.geometry=this.geometry,Tr.material=this.material,Tr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ar.copy(this.boundingSphere),Ar.applyMatrix4(i),e.ray.intersectsSphere(Ar)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,zs),sd.multiplyMatrices(i,zs),Tr.matrixWorld=sd,Tr.raycast(e,Oo);for(let o=0,a=Oo.length;o<a;o++){let c=Oo[o];c.instanceId=r,c.object=this,t.push(c)}Oo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Hr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Ic(new Float32Array(s*this.count),s,this.count,eh,ti));let r=this.morphTexture.source.data.data,o=0;for(let h=0;h<i.length;h++)o+=i[h];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;r[c]=a,r.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Gr=class extends bi{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Le(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},la=new I,ca=new I,od=new Xe,Rr=new Vi,Bo=new vi,wl=new I,ad=new I,ha=class extends Xt{constructor(e=new ct,t=new Gr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)la.fromBufferAttribute(t,s-1),ca.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=la.distanceTo(ca);e.setAttribute("lineDistance",new $e(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bo.copy(i.boundingSphere),Bo.applyMatrix4(s),Bo.radius+=r,e.ray.intersectsSphere(Bo)===!1)return;od.copy(s).invert(),Rr.copy(e.ray).applyMatrix4(od);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,h=this.isLineSegments?2:1,l=i.index,f=i.attributes.position;if(l!==null){let p=Math.max(0,o.start),g=Math.min(l.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=h){let d=l.getX(_),x=l.getX(_+1),b=zo(this,e,Rr,c,d,x);b&&t.push(b)}if(this.isLineLoop){let _=l.getX(g-1),m=l.getX(p),d=zo(this,e,Rr,c,_,m);d&&t.push(d)}}else{let p=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=h){let d=zo(this,e,Rr,c,_,_+1);d&&t.push(d)}if(this.isLineLoop){let _=zo(this,e,Rr,c,g-1,p);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function zo(n,e,t,i,s,r){let o=n.geometry.attributes.position;if(la.fromBufferAttribute(o,s),ca.fromBufferAttribute(o,r),t.distanceSqToSegment(la,ca,wl,ad)>i)return;wl.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(wl);if(!(c<e.near||c>e.far))return{distance:c,point:ad.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}var Lc=class extends bi{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Le(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ld=new Xe,Dc=new Vi,Ho=new vi,Vo=new I,ua=class extends Xt{constructor(e=new ct,t=new Lc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ho.copy(i.boundingSphere),Ho.applyMatrix4(s),Ho.radius+=r,e.ray.intersectsSphere(Ho)===!1)return;ld.copy(s).invert(),Dc.copy(e.ray).applyMatrix4(ld);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,h=i.index,u=i.attributes.position;if(h!==null){let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let g=f,_=p;g<_;g++){let m=h.getX(g);Vo.fromBufferAttribute(u,m),cd(Vo,m,c,s,e,t,this)}}else{let f=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let g=f,_=p;g<_;g++)Vo.fromBufferAttribute(u,g),cd(Vo,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function cd(n,e,t,i,s,r,o){let a=Dc.distanceSqToPoint(n);if(a<t){let c=new I;Dc.closestPointToPoint(n,c),c.applyMatrix4(i);let h=s.ray.origin.distanceTo(c);if(h<s.near||h>s.far)return;r.push({distance:h,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var ii=class extends hn{constructor(e,t,i,s,r,o,a,c,h){super(e,t,i,s,r,o,a,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}},Uc=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,c=r-1,h;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),h=i[s]-o,h<0)a=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(r-1);let l=i[s],f=i[s+1]-l,p=(o-l)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new Se:new I);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new I,s=[],r=[],o=[],a=new I,c=new Xe;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new I)}r[0]=new I,o[0]=new I;let h=Number.MAX_VALUE,l=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);l<=h&&(h=l,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),f<=h&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(It(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(It(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}};function oh(){let n=0,e=0,t=0,i=0;function s(r,o,a,c){n=r,e=a,t=-3*r+3*o-2*a-c,i=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,h){s(o,a,h*(a-r),h*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,h,l,u){let f=(o-r)/h-(a-r)/(h+l)+(a-o)/l,p=(a-o)/l-(c-o)/(l+u)+(c-a)/u;f*=l,p*=l,s(o,a,f,p)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var Go=new I,El=new oh,Tl=new oh,Al=new oh,Gi=class extends Uc{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new I){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let h,l;this.closed||a>0?h=s[(a-1)%r]:(Go.subVectors(s[0],s[1]).add(s[0]),h=Go);let u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?l=s[(a+2)%r]:(Go.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=Go),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(h.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(l),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),El.initNonuniformCatmullRom(h.x,u.x,f.x,l.x,g,_,m),Tl.initNonuniformCatmullRom(h.y,u.y,f.y,l.y,g,_,m),Al.initNonuniformCatmullRom(h.z,u.z,f.z,l.z,g,_,m)}else this.curveType==="catmullrom"&&(El.initCatmullRom(h.x,u.x,f.x,l.x,this.tension),Tl.initCatmullRom(h.y,u.y,f.y,l.y,this.tension),Al.initCatmullRom(h.z,u.z,f.z,l.z,this.tension));return i.set(El.calc(c),Tl.calc(c),Al.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};var da=class n extends ct{constructor(e=[new Se(0,-.5),new Se(.5,0),new Se(0,.5)],t=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:s},t=Math.floor(t),s=It(s,0,Math.PI*2);let r=[],o=[],a=[],c=[],h=[],l=1/t,u=new I,f=new Se,p=new I,g=new I,_=new I,m=0,d=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:m=e[x+1].x-e[x].x,d=e[x+1].y-e[x].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(_.x,_.y,_.z);break;default:m=e[x+1].x-e[x].x,d=e[x+1].y-e[x].y,p.x=d*1,p.y=-m,p.z=d*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),c.push(p.x,p.y,p.z),_.copy(g)}for(let x=0;x<=t;x++){let b=i+x*l*s,y=Math.sin(b),P=Math.cos(b);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*y,u.y=e[T].y,u.z=e[T].x*P,o.push(u.x,u.y,u.z),f.x=x/t,f.y=T/(e.length-1),a.push(f.x,f.y);let A=c[3*T+0]*y,C=c[3*T+1],S=c[3*T+0]*P;h.push(A,C,S)}}for(let x=0;x<t;x++)for(let b=0;b<e.length-1;b++){let y=b+x*e.length,P=y,T=y+e.length,A=y+e.length+1,C=y+1;r.push(P,T,C),r.push(A,C,T)}this.setIndex(r),this.setAttribute("position",new $e(o,3)),this.setAttribute("uv",new $e(a,2)),this.setAttribute("normal",new $e(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.points,e.segments,e.phiStart,e.phiLength)}};var er=class n extends ct{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],c=[],h=new I,l=new Se;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){let p=i+u/t*s;h.x=e*Math.cos(p),h.y=e*Math.sin(p),o.push(h.x,h.y,h.z),a.push(0,0,1),l.x=(o[f]/e+1)/2,l.y=(o[f+1]/e+1)/2,c.push(l.x,l.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new $e(o,3)),this.setAttribute("normal",new $e(a,3)),this.setAttribute("uv",new $e(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Wn=class n extends ct{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let h=this;s=Math.floor(s),r=Math.floor(r);let l=[],u=[],f=[],p=[],g=0,_=[],m=i/2,d=0;x(),o===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(l),this.setAttribute("position",new $e(u,3)),this.setAttribute("normal",new $e(f,3)),this.setAttribute("uv",new $e(p,2));function x(){let y=new I,P=new I,T=0,A=(t-e)/i;for(let C=0;C<=r;C++){let S=[],M=C/r,L=M*(t-e)+e;for(let V=0;V<=s;V++){let G=V/s,Y=G*c+a,Q=Math.sin(Y),$=Math.cos(Y);P.x=L*Q,P.y=-M*i+m,P.z=L*$,u.push(P.x,P.y,P.z),y.set(Q,A,$).normalize(),f.push(y.x,y.y,y.z),p.push(G,1-M),S.push(g++)}_.push(S)}for(let C=0;C<s;C++)for(let S=0;S<r;S++){let M=_[S][C],L=_[S+1][C],V=_[S+1][C+1],G=_[S][C+1];(e>0||S!==0)&&(l.push(M,L,G),T+=3),(t>0||S!==r-1)&&(l.push(L,V,G),T+=3)}h.addGroup(d,T,0),d+=T}function b(y){let P=g,T=new Se,A=new I,C=0,S=y===!0?e:t,M=y===!0?1:-1;for(let V=1;V<=s;V++)u.push(0,m*M,0),f.push(0,M,0),p.push(.5,.5),g++;let L=g;for(let V=0;V<=s;V++){let Y=V/s*c+a,Q=Math.cos(Y),$=Math.sin(Y);A.x=S*$,A.y=m*M,A.z=S*Q,u.push(A.x,A.y,A.z),f.push(0,M,0),T.x=Q*.5+.5,T.y=$*.5*M+.5,p.push(T.x,T.y),g++}for(let V=0;V<s;V++){let G=P+V,Y=L+V;y===!0?l.push(Y,Y+1,G):l.push(Y+1,Y,G),C+=3}h.addGroup(d,C,y===!0?1:2),d+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Si=class n extends Wn{constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Nc=class n extends ct{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),h(i),l(),this.setAttribute("position",new $e(r,3)),this.setAttribute("normal",new $e(r.slice(),3)),this.setAttribute("uv",new $e(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let b=new I,y=new I,P=new I;for(let T=0;T<t.length;T+=3)p(t[T+0],b),p(t[T+1],y),p(t[T+2],P),c(b,y,P,x)}function c(x,b,y,P){let T=P+1,A=[];for(let C=0;C<=T;C++){A[C]=[];let S=x.clone().lerp(y,C/T),M=b.clone().lerp(y,C/T),L=T-C;for(let V=0;V<=L;V++)V===0&&C===T?A[C][V]=S:A[C][V]=S.clone().lerp(M,V/L)}for(let C=0;C<T;C++)for(let S=0;S<2*(T-C)-1;S++){let M=Math.floor(S/2);S%2===0?(f(A[C][M+1]),f(A[C+1][M]),f(A[C][M])):(f(A[C][M+1]),f(A[C+1][M+1]),f(A[C+1][M]))}}function h(x){let b=new I;for(let y=0;y<r.length;y+=3)b.x=r[y+0],b.y=r[y+1],b.z=r[y+2],b.normalize().multiplyScalar(x),r[y+0]=b.x,r[y+1]=b.y,r[y+2]=b.z}function l(){let x=new I;for(let b=0;b<r.length;b+=3){x.x=r[b+0],x.y=r[b+1],x.z=r[b+2];let y=m(x)/2/Math.PI+.5,P=d(x)/Math.PI+.5;o.push(y,1-P)}g(),u()}function u(){for(let x=0;x<o.length;x+=6){let b=o[x+0],y=o[x+2],P=o[x+4],T=Math.max(b,y,P),A=Math.min(b,y,P);T>.9&&A<.1&&(b<.2&&(o[x+0]+=1),y<.2&&(o[x+2]+=1),P<.2&&(o[x+4]+=1))}}function f(x){r.push(x.x,x.y,x.z)}function p(x,b){let y=x*3;b.x=e[y+0],b.y=e[y+1],b.z=e[y+2]}function g(){let x=new I,b=new I,y=new I,P=new I,T=new Se,A=new Se,C=new Se;for(let S=0,M=0;S<r.length;S+=9,M+=6){x.set(r[S+0],r[S+1],r[S+2]),b.set(r[S+3],r[S+4],r[S+5]),y.set(r[S+6],r[S+7],r[S+8]),T.set(o[M+0],o[M+1]),A.set(o[M+2],o[M+3]),C.set(o[M+4],o[M+5]),P.copy(x).add(b).add(y).divideScalar(3);let L=m(P);_(T,M+0,x,L),_(A,M+2,b,L),_(C,M+4,y,L)}}function _(x,b,y,P){P<0&&x.x===1&&(o[b]=x.x-1),y.x===0&&y.z===0&&(o[b]=P/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}};var fa=class n extends Nc{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var pa=class n extends ct{constructor(e=.5,t=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],c=[],h=[],l=[],u=e,f=(t-e)/s,p=new I,g=new Se;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){let d=r+m/i*o;p.x=u*Math.cos(d),p.y=u*Math.sin(d),c.push(p.x,p.y,p.z),h.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,l.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){let m=_*(i+1);for(let d=0;d<i;d++){let x=d+m,b=x,y=x+i+1,P=x+i+2,T=x+1;a.push(b,y,T),a.push(y,P,T)}}this.setIndex(a),this.setAttribute("position",new $e(c,3)),this.setAttribute("normal",new $e(h,3)),this.setAttribute("uv",new $e(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var nn=class n extends ct{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(o+a,Math.PI),h=0,l=[],u=new I,f=new I,p=[],g=[],_=[],m=[];for(let d=0;d<=i;d++){let x=[],b=d/i,y=0;d===0&&o===0?y=.5/t:d===i&&c===Math.PI&&(y=-.5/t);for(let P=0;P<=t;P++){let T=P/t;u.x=-e*Math.cos(s+T*r)*Math.sin(o+b*a),u.y=e*Math.cos(o+b*a),u.z=e*Math.sin(s+T*r)*Math.sin(o+b*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(T+y,1-b),x.push(h++)}l.push(x)}for(let d=0;d<i;d++)for(let x=0;x<t;x++){let b=l[d][x+1],y=l[d][x],P=l[d+1][x],T=l[d+1][x+1];(d!==0||o>0)&&p.push(b,y,T),(d!==i-1||c<Math.PI)&&p.push(y,P,T)}this.setIndex(p),this.setAttribute("position",new $e(g,3)),this.setAttribute("normal",new $e(_,3)),this.setAttribute("uv",new $e(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var dn=class n extends ct{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let o=[],a=[],c=[],h=[],l=new I,u=new I,f=new I;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){let _=g/s*r,m=p/i*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),l.x=e*Math.cos(_),l.y=e*Math.sin(_),f.subVectors(u,l).normalize(),c.push(f.x,f.y,f.z),h.push(g/s),h.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){let _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,d=(s+1)*(p-1)+g,x=(s+1)*p+g;o.push(_,m,x),o.push(m,d,x)}this.setIndex(o),this.setAttribute("position",new $e(a,3)),this.setAttribute("normal",new $e(c,3)),this.setAttribute("uv",new $e(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Ut=class extends bi{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Le(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ad,this.normalScale=new Se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function Wo(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Nx(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var tr=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},kc=class extends tr{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:au,endingEnd:au}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case lu:r=e,a=2*t-i;break;case cu:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case lu:o=e,c=2*i-t;break;case cu:o=1,c=i+s[1]-s[0];break;default:o=e-1,c=t}let h=(i-t)*.5,l=this.valueSize;this._weightPrev=h/(t-a),this._weightNext=h/(c-i),this._offsetPrev=r*l,this._offsetNext=o*l}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,h=c-a,l=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,p=this._weightNext,g=(i-t)/(s-t),_=g*g,m=_*g,d=-f*m+2*f*_-f*g,x=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,b=(-1-p)*m+(1.5+p)*_+.5*g,y=p*m-p*_;for(let P=0;P!==a;++P)r[P]=d*o[l+P]+x*o[h+P]+b*o[c+P]+y*o[u+P];return r}},Fc=class extends tr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,h=c-a,l=(i-t)/(s-t),u=1-l;for(let f=0;f!==a;++f)r[f]=o[h+f]*u+o[c+f]*l;return r}},Oc=class extends tr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Xn=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Wo(t,this.TimeBufferType),this.values=Wo(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Wo(e.times,Array),values:Wo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Oc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Fc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new kc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Jo:t=this.InterpolantFactoryMethodDiscrete;break;case pc:t=this.InterpolantFactoryMethodLinear;break;case Ka:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Jo;case this.InterpolantFactoryMethodLinear:return pc;case this.InterpolantFactoryMethodSmooth:return Ka}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&Nx(s))for(let a=0,c=s.length;a!==c;++a){let h=s[a];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,h),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Ka,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,h=e[a],l=e[a+1];if(h!==l&&(a!==1||h!==e[0]))if(s)c=!0;else{let u=a*i,f=u-i,p=u+i;for(let g=0;g!==i;++g){let _=t[u+g];if(_!==t[f+g]||_!==t[p+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let u=a*i,f=o*i;for(let p=0;p!==i;++p)t[f+p]=t[u+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,c=o*i,h=0;h!==i;++h)t[c+h]=t[a+h];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Xn.prototype.TimeBufferType=Float32Array;Xn.prototype.ValueBufferType=Float32Array;Xn.prototype.DefaultInterpolation=pc;var us=class extends Xn{constructor(e,t,i){super(e,t,i)}};us.prototype.ValueTypeName="bool";us.prototype.ValueBufferType=Array;us.prototype.DefaultInterpolation=Jo;us.prototype.InterpolantFactoryMethodLinear=void 0;us.prototype.InterpolantFactoryMethodSmooth=void 0;var Bc=class extends Xn{};Bc.prototype.ValueTypeName="color";var zc=class extends Xn{};zc.prototype.ValueTypeName="number";var Hc=class extends tr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-t)/(s-t),h=e*a;for(let l=h+a;h!==l;h+=4)Wt.slerpFlat(r,0,o,h-a,o,h,c);return r}},ma=class extends Xn{InterpolantFactoryMethodLinear(e){return new Hc(this.times,this.values,this.getValueSize(),e)}};ma.prototype.ValueTypeName="quaternion";ma.prototype.InterpolantFactoryMethodSmooth=void 0;var ds=class extends Xn{constructor(e,t,i){super(e,t,i)}};ds.prototype.ValueTypeName="string";ds.prototype.ValueBufferType=Array;ds.prototype.DefaultInterpolation=Jo;ds.prototype.InterpolantFactoryMethodLinear=void 0;ds.prototype.InterpolantFactoryMethodSmooth=void 0;var Vc=class extends Xn{};Vc.prototype.ValueTypeName="vector";var Gc=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,c,h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(l){a++,r===!1&&s.onStart!==void 0&&s.onStart(l,o,a),r=!0},this.itemEnd=function(l){o++,s.onProgress!==void 0&&s.onProgress(l,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(l){s.onError!==void 0&&s.onError(l)},this.resolveURL=function(l){return c?c(l):l},this.setURLModifier=function(l){return c=l,this},this.addHandler=function(l,u){return h.push(l,u),this},this.removeHandler=function(l){let u=h.indexOf(l);return u!==-1&&h.splice(u,2),this},this.getHandler=function(l){for(let u=0,f=h.length;u<f;u+=2){let p=h[u],g=h[u+1];if(p.global&&(p.lastIndex=0),p.test(l))return g}return null}}},kx=new Gc,Wc=class{constructor(e){this.manager=e!==void 0?e:kx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Wc.DEFAULT_MATERIAL_NAME="__DEFAULT";var Wr=class extends Xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Le(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},ga=class extends Wr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Le(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Rl=new Xe,hd=new I,ud=new I,_a=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Se(512,512),this.map=null,this.mapPass=null,this.matrix=new Xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zr,this._frameExtents=new Se(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;hd.setFromMatrixPosition(e.matrixWorld),t.position.copy(hd),ud.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ud),t.updateMatrixWorld(),Rl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Rl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var dd=new Xe,Cr=new I,Cl=new I,Xc=class extends _a{constructor(){super(new Gt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Se(4,2),this._viewportCount=6,this._viewports=[new lt(2,1,1,1),new lt(0,1,1,1),new lt(3,1,1,1),new lt(1,1,1,1),new lt(3,0,1,1),new lt(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Cr.setFromMatrixPosition(e.matrixWorld),i.position.copy(Cr),Cl.copy(i.position),Cl.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Cl),i.updateMatrixWorld(),s.makeTranslation(-Cr.x,-Cr.y,-Cr.z),dd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(dd)}},xa=class extends Wr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Xc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Yc=class extends _a{constructor(){super(new ra(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Xr=class extends Wr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.target=new Xt,this.shadow=new Yc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var ah="\\[\\]\\.:\\/",Fx=new RegExp("["+ah+"]","g"),lh="[^"+ah+"]",Ox="[^"+ah.replace("\\.","")+"]",Bx=/((?:WC+[\/:])*)/.source.replace("WC",lh),zx=/(WCOD+)?/.source.replace("WCOD",Ox),Hx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",lh),Vx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",lh),Gx=new RegExp("^"+Bx+zx+Hx+Vx+"$"),Wx=["material","materials","bones","map"],qc=class{constructor(e,t,i){let s=i||bt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},bt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Fx,"")}static parseTrackName(e){let t=Gx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Wx.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=i(a.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let h=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let l=0;l<e.length;l++)if(e[l].name===h){h=l;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(h!==void 0){if(e[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}let o=e[s];if(o===void 0){let h=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};bt.Composite=qc;bt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};bt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};bt.prototype.GetterByBindingType=[bt.prototype._getValue_direct,bt.prototype._getValue_array,bt.prototype._getValue_arrayElement,bt.prototype._getValue_toArray];bt.prototype.SetterByBindingTypeAndVersioning=[[bt.prototype._setValue_direct,bt.prototype._setValue_direct_setNeedsUpdate,bt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_array,bt.prototype._setValue_array_setNeedsUpdate,bt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_arrayElement,bt.prototype._setValue_arrayElement_setNeedsUpdate,bt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_fromArray,bt.prototype._setValue_fromArray_setNeedsUpdate,bt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var wv=new Float32Array(1);var fd=new Xe,ya=class{constructor(e,t,i=0,s=1/0){this.ray=new Vi(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Br,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return fd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(fd),this}intersectObject(e,t=!0,i=[]){return Zc(e,this,i,t),i.sort(pd),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Zc(e[s],this,i,t);return i.sort(pd),i}};function pd(n,e){return n.distance-e.distance}function Zc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let o=0,a=r.length;o<a;o++)Zc(r[o],e,t,!0)}}var Yr=class{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(It(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var va=class extends yi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");var Fd={type:"change"},hh={type:"start"},Bd={type:"end"},wa=new Vi,Od=new Mn,Xx=Math.cos(70*Zr.DEG2RAD),Nt=new I,fn=2*Math.PI,ht={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ch=1e-6,Ea=class extends va{constructor(e,t=null){super(e,t),this.state=ht.NONE,this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:fs.ROTATE,MIDDLE:fs.DOLLY,RIGHT:fs.PAN},this.touches={ONE:ps.ROTATE,TWO:ps.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new Wt,this._lastTargetPosition=new I,this._quat=new Wt().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Yr,this._sphericalDelta=new Yr,this._scale=1,this._panOffset=new I,this._rotateStart=new Se,this._rotateEnd=new Se,this._rotateDelta=new Se,this._panStart=new Se,this._panEnd=new Se,this._panDelta=new Se,this._dollyStart=new Se,this._dollyEnd=new Se,this._dollyDelta=new Se,this._dollyDirection=new I,this._mouse=new Se,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=qx.bind(this),this._onPointerDown=Yx.bind(this),this._onPointerUp=Zx.bind(this),this._onContextMenu=ty.bind(this),this._onMouseWheel=Kx.bind(this),this._onKeyDown=jx.bind(this),this._onTouchStart=Qx.bind(this),this._onTouchMove=ey.bind(this),this._onMouseDown=$x.bind(this),this._onMouseMove=Jx.bind(this),this._interceptControlDown=ny.bind(this),this._interceptControlUp=iy.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Fd),this.update(),this.state=ht.NONE}update(e=null){let t=this.object.position;Nt.copy(t).sub(this.target),Nt.applyQuaternion(this._quat),this._spherical.setFromVector3(Nt),this.autoRotate&&this.state===ht.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=fn:i>Math.PI&&(i-=fn),s<-Math.PI?s+=fn:s>Math.PI&&(s-=fn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Nt.setFromSpherical(this._spherical),Nt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Nt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Nt.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let a=new I(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let h=new I(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(a),this.object.updateMatrixWorld(),o=Nt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(wa.origin.copy(this.object.position),wa.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(wa.direction))<Xx?this.object.lookAt(this.target):(Od.setFromNormalAndCoplanarPoint(this.object.up,this.target),wa.intersectPlane(Od,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ch||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ch||this._lastTargetPosition.distanceToSquared(this.target)>ch?(this.dispatchEvent(Fd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?fn/60*this.autoRotateSpeed*e:fn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Nt.setFromMatrixColumn(t,0),Nt.multiplyScalar(-e),this._panOffset.add(Nt)}_panUp(e,t){this.screenSpacePanning===!0?Nt.setFromMatrixColumn(t,1):(Nt.setFromMatrixColumn(t,0),Nt.crossVectors(this.object.up,Nt)),Nt.multiplyScalar(e),this._panOffset.add(Nt)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Nt.copy(s).sub(this.target);let r=Nt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(fn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-fn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(fn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-fn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Se,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function Yx(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function qx(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Zx(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Bd),this.state=ht.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function $x(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case fs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ht.DOLLY;break;case fs.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ht.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ht.ROTATE}break;case fs.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ht.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ht.PAN}break;default:this.state=ht.NONE}this.state!==ht.NONE&&this.dispatchEvent(hh)}function Jx(n){switch(this.state){case ht.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ht.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ht.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Kx(n){this.enabled===!1||this.enableZoom===!1||this.state!==ht.NONE||(n.preventDefault(),this.dispatchEvent(hh),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Bd))}function jx(n){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(n)}function Qx(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ps.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ht.TOUCH_ROTATE;break;case ps.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ht.TOUCH_PAN;break;default:this.state=ht.NONE}break;case 2:switch(this.touches.TWO){case ps.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ht.TOUCH_DOLLY_PAN;break;case ps.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ht.TOUCH_DOLLY_ROTATE;break;default:this.state=ht.NONE}break;default:this.state=ht.NONE}this.state!==ht.NONE&&this.dispatchEvent(hh)}function ey(n){switch(this._trackPointer(n),this.state){case ht.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ht.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ht.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ht.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ht.NONE}}function ty(n){this.enabled!==!1&&n.preventDefault()}function ny(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function iy(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Ta=class extends Qs{constructor(){super();let e=new Gn;e.deleteAttribute("uv");let t=new Ut({side:jt}),i=new Ut,s=new xa(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new Ne(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new Ne(e,i);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);let a=new Ne(e,i);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);let c=new Ne(e,i);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);let h=new Ne(e,i);h.position.set(-2.017,.018,6.124),h.rotation.set(0,.333,0),h.scale.set(2.002,4.566,2.064),this.add(h);let l=new Ne(e,i);l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),this.add(l);let u=new Ne(e,i);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);let f=new Ne(e,rr(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);let p=new Ne(e,rr(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let g=new Ne(e,rr(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);let _=new Ne(e,rr(43));_.position.set(-.462,8.89,14.52),_.scale.set(4.38,5.441,.088),this.add(_);let m=new Ne(e,rr(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);let d=new Ne(e,rr(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function rr(n){let e=new Bt;return e.color.setScalar(n),e}var Aa=18,Ra=24,sy=`
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
`,ry=`
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
`;function Ca(){let n={uBase:{value:new Le},uSecond:{value:new Le},uBellyCol:{value:new Le},uBellyDir:{value:new I(0,-1,0)},uBelly:{value:.8},uPattern:{value:0},uPatScale:{value:1},uTex:{value:0},uTexScale:{value:22},uPM:{value:Array.from({length:Ra},()=>new Xe)},uBump:{value:1},uFurLen:{value:0},uFurDensity:{value:90},uDroop:{value:.3}},e=s=>{let r=new Ut({roughness:.7,metalness:0});return s>0&&(r.defines={FUR_SHELL:1}),r.onBeforeCompile=o=>{Object.assign(o.uniforms,n,{uShell:{value:s}}),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
attribute float fur; attribute float bone; attribute vec3 rp; attribute vec3 rn;
uniform float uShell; uniform float uFurLen; uniform float uDroop; uniform mat4 uPM[`+Ra+`];
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
          uniform int uPattern, uTex; varying vec3 vWPos; varying vec3 vWNrm; float ccH = 0.0;`+sy).replace("#include <color_fragment>",`#include <color_fragment>
`+ry).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
          #ifndef FUR_SHELL
          { vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
            vec3 r1 = cross(sy, normal), r2 = cross(normal, sx); float det = dot(sx, r1);
            vec3 grad = sign(det) * (dFdx(ccH) * r1 + dFdy(ccH) * r2);
            normal = normalize(abs(det) * normal - grad * uBump); }
          #endif`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
          totalEmissiveRadiance += diffuseColor.rgb * pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0) * 0.4;`)},r},t=s=>new Ut(s);return{U:n,skin:e(0),shells:Array.from({length:Aa},(s,r)=>e((r+1)/Aa)),accent:t({roughness:.35}),hair:t({roughness:.55}),membrane:t({roughness:.6,side:Ct}),glass:t({roughness:.15,transparent:!0,opacity:.45,side:Ct,depthWrite:!1}),teeth:t({color:16052188,roughness:.3}),mouth:t({color:3804436,roughness:.5}),tongue:t({color:14248572,roughness:.4}),dark:t({color:1775384,roughness:.25}),lip:t({roughness:.35}),cloth:t({roughness:.9,side:Ct}),glint:new Bt({color:16777215}),lash:t({color:1380370,roughness:.6}),eyeCache:new Map}}var oy={skin:0,scales:1,chitin:2,slime:0,fur:0},ay={skin:.72,scales:.45,chitin:.22,slime:.1,fur:.9};function si(n,e,t){var r,o;let i=n.U;i.uBase.value.set(e.base),i.uSecond.value.set(e.second),i.uBellyCol.value.set(e.belly),i.uBelly.value=e.bellyAmt,i.uPattern.value=e.pattern,i.uPatScale.value=e.patScale,i.uBellyDir.value.set(...t).normalize(),i.uTex.value=(r=oy[e.cover])!=null?r:0,i.uBump.value=e.cover==="slime"?.35:1;let s=e.cover==="fur";i.uFurLen.value=s?.012+e.furLen*.13:0,i.uDroop.value=e.furDroop*1.2,i.uFurDensity.value=330-e.furLen*170;for(let a of[n.skin,...n.shells])a.roughness=(o=ay[e.cover])!=null?o:.7,a.metalness=e.cover==="chitin"?.25:0;n.accent.color.set(e.accent),n.hair.color.set(e.hair),n.membrane.color.set(e.membrane),n.glass.color.set(e.membrane),n.cloth.color.set(e.cloth||"#6b4a2e"),n.lip.color.set(e.base).lerp(new Le(12075102),.6)}function zd(n,e,t,i){let s=e+t+i.toFixed(2);if(n.eyeCache.has(s))return n.eyeCache.get(s);let r=256,o=128,a=document.createElement("canvas");a.width=r,a.height=o;let c=a.getContext("2d"),h=new Le(t),l={};h.getHSL(l);let u=(g,_,m)=>`hsl(${(g*360).toFixed(0)},${(_*100).toFixed(0)}%,${(ly(m)*100).toFixed(0)}%)`,f=new Ut({roughness:.06,metalness:0});if(e==="compound"){c.fillStyle=u(l.h,l.s,l.l*.8),c.fillRect(0,0,r,o);for(let g=0;g<22;g++)for(let _=0;_<44;_++){let m=(_+g%2*.5)*(r/44),d=g*(o/22)+3,x=c.createRadialGradient(m-1,d-1,0,m,d,3.4);x.addColorStop(0,u(l.h+.05,l.s,l.l*1.5+.1)),x.addColorStop(1,u(l.h,l.s,l.l*.35)),c.fillStyle=x,c.beginPath(),c.arc(m,d,3.4,0,7),c.fill()}f.roughness=.18,f.metalness=.3}else if(e==="beady")c.fillStyle="#0b0a0d",c.fillRect(0,0,r,o),c.fillStyle=u(l.h,l.s,.12),c.fillRect(0,0,r,o*.3);else{let g=c.createLinearGradient(0,0,0,o);g.addColorStop(0,"#f7f4ee"),g.addColorStop(.45,"#efe6df"),g.addColorStop(.7,"#d9a9a4"),c.fillStyle=g,c.fillRect(0,0,r,o);let _=i*.95/Math.PI*o,m=7,d=()=>(m=m*16807%2147483647,m/2147483647);for(let x=0;x<r;x++){let b=x/r*Math.PI*2+Math.PI,y=.75+d()*.5,P=c.createLinearGradient(0,0,0,_);if(P.addColorStop(0,u(l.h+.03,l.s,l.l*1.5*y+.08)),P.addColorStop(.75,u(l.h,l.s,l.l*y)),P.addColorStop(.93,u(l.h,l.s,l.l*.3)),P.addColorStop(1,"#20140f"),c.fillStyle=P,c.fillRect(x,0,1,_),e!=="glow"){let T=.5,A=.5;e==="cat"?(T=.13,A=.9):e==="goat"&&(T=.85,A=.22);let C=T*A/Math.sqrt((A*Math.cos(b))**2+(T*Math.sin(b))**2);c.fillStyle="#050406",c.fillRect(x,0,1,_*C)}}if(e==="glow"){f.emissive=h.clone(),f.emissiveIntensity=1.3;let x=document.createElement("canvas");x.width=4,x.height=o;let b=x.getContext("2d");b.fillStyle="#000",b.fillRect(0,0,4,o);let y=b.createLinearGradient(0,0,0,_);y.addColorStop(0,"#fff"),y.addColorStop(1,"#333"),b.fillStyle=y,b.fillRect(0,0,4,_),f.emissiveMap=new ii(x)}}let p=new ii(a);return p.colorSpace=Ot,p.wrapS=kr,p.anisotropy=4,f.map=p,n.eyeCache.set(s,f),f}var ly=n=>Math.min(1,Math.max(0,n));function Vd(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,c=new ct,h=0;for(let l=0;l<n.length;++l){let u=n[l],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(e){let p;if(t)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,l),h+=p}}if(t){let l=0,u=[];for(let f=0;f<n.length;++f){let p=n[f].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+l);l+=n[f].attributes.position.count}c.setIndex(u)}for(let l in r){let u=Hd(r[l]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;c.setAttribute(l,u)}for(let l in o){let u=o[l][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[l]=[];for(let f=0;f<u;++f){let p=[];for(let _=0;_<o[l].length;++_)p.push(o[l][_][f]);let g=Hd(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;c.morphAttributes[l].push(g)}}return c}function Hd(n){let e,t,i,s=-1,r=0;for(let h=0;h<n.length;++h){let l=n[h];if(e===void 0&&(e=l.array.constructor),e!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=l.itemSize),t!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=l.normalized),i!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=l.gpuType),s!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=l.count*t}let o=new e(r),a=new xt(o,t,i),c=0;for(let h=0;h<n.length;++h){let l=n[h];if(l.isInterleavedBufferAttribute){let u=c/t;for(let f=0,p=l.count;f<p;f++)for(let g=0;g<t;g++){let _=l.getComponent(f,g);a.setComponent(f+u,g,_)}}else o.set(l.array,c);c+=l.count*t}return s!==void 0&&(a.gpuType=s),a}var cy=I,le=(n=0,e=0,t=0)=>new cy(n,e,t),En=(n,e,t)=>Math.min(t,Math.max(e,n)),Yt=(n,e,t)=>n+(e-n)*t,Ln=le(1,0,0),qt=le(0,1,0),or=le(0,0,1);function $r(n){let e=(n|0)+1831565813;return()=>(e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296)}function hy(n,e,t,i,s){let r=s*s,o=r*s;return .5*(2*e+(t-n)*s+(2*n-5*e+4*t-i)*r+(3*e-n-3*t+i)*o)}function Pa(n,e){let t=n.length,i=En(e,0,1)*(t-1),s=Math.min(Math.floor(i),t-2),r=i-s,o=n[Math.max(s-1,0)],a=n[s],c=n[s+1],h=n[Math.min(s+2,t-1)];return En(hy(o,a,c,h,r),Math.min(a,c)*.9,Math.max(a,c)*1.06)}function sn(n,e={}){var ie,D,q,re,ae;let t=(ie=e.radial)!=null?ie:14,i=(D=e.sub)!=null?D:6,s=(q=e.capRings)!=null?q:4,r=(re=e.capStart)!=null?re:1,o=(ae=e.capEnd)!=null?ae:1,a=n.length,c=new Gi(n.map(z=>z.p),!1,"centripetal"),h=n.map(z=>z.rx),l=n.map(z=>{var ee;return(ee=z.ry)!=null?ee:z.rx}),u=n.map(z=>{var ee;return(ee=z.f)!=null?ee:1}),f=n.map(z=>{var ee;return(ee=z.b)!=null?ee:1}),p=[],g=[],_=(a-1)*i+1,m=[],d=[],x=[],b=[],y=[],P=[],T=null;for(let z=0;z<_;z++){let ee=z/(_-1),ye=c.getPoint(ee),Re=c.getTangent(ee).normalize();T||(T=e.side?e.side.clone():Math.abs(Re.x)<.9?Ln.clone():qt.clone()),T=T.clone().addScaledVector(Re,-T.dot(Re)),T.lengthSq()<1e-8&&(T=Math.abs(Re.y)<.9?qt.clone().cross(Re):Ln.clone().cross(Re)),T.normalize(),m.push(ye),d.push(Re),x.push(T),b.push(Re.clone().cross(T).normalize());let Fe=Pa(h,ee),Qe=Pa(l,ee);if(e.ridges){let U=1+e.ridgeAmp*Math.sin(ee*e.ridges*Math.PI*2);Fe*=U,Qe*=U}y.push(Math.max(Fe,1e-4)),P.push(Math.max(Qe,1e-4)),p.push(Pa(u,ee)),g.push(Pa(f,ee))}let A=[],C=(z,ee)=>ee*(y[z]+P[z])*.5;if(r>0)for(let z=s;z>=1;z--){let ee=z/s*Math.PI/2;A.push({c:m[0].clone().addScaledVector(d[0],-C(0,r)*Math.sin(ee)),i:0,s:Math.max(Math.cos(ee),.015),u:-z/s})}for(let z=0;z<_;z++)A.push({c:m[z],i:z,s:1,u:z/(_-1)});if(o>0)for(let z=1;z<=s;z++){let ee=z/s*Math.PI/2;A.push({c:m[_-1].clone().addScaledVector(d[_-1],C(_-1,o)*Math.sin(ee)),i:_-1,s:Math.max(Math.cos(ee),.015),u:1+z/s})}let S=A.length,M=t+1,L=new Float32Array(S*M*3),V=new Float32Array(S*M*3),G=new Float32Array(S*M*2),Y=le();for(let z=0;z<S;z++){let ee=A[z],ye=ee.i;for(let Re=0;Re<=t;Re++){let Fe=Re/t*Math.PI*2,Qe=Math.cos(Fe);Y.copy(ee.c).addScaledVector(x[ye],y[ye]*ee.s*Math.sin(Fe)).addScaledVector(b[ye],P[ye]*ee.s*Qe*(Qe<0?p[ye]:g[ye]));let U=(z*M+Re)*3;L[U]=Y.x,L[U+1]=Y.y,L[U+2]=Y.z,G[(z*M+Re)*2]=ee.u,G[(z*M+Re)*2+1]=Re/t}}let Q=(z,ee,ye)=>{let Re=(z*M+ee)*3;return ye.set(L[Re],L[Re+1],L[Re+2])},$=le(),ce=le(),v=le(),B=le(),O=le();for(let z=0;z<S;z++)for(let ee=0;ee<=t;ee++){let ye=ee%t;Q(Math.min(z+1,S-1),ye,$),Q(Math.max(z-1,0),ye,ce),Q(z,(ye+1)%t,v),Q(z,(ye-1+t)%t,B),O.copy($.sub(ce)).cross(v.sub(B)),O.lengthSq()<1e-16&&O.copy(d[A[z].i]).multiplyScalar(z<S/2?-1:1),O.normalize();let Re=(z*M+ee)*3;V[Re]=O.x,V[Re+1]=O.y,V[Re+2]=O.z}let J=[];for(let z=0;z<S-1;z++)for(let ee=0;ee<t;ee++){let ye=z*M+ee,Re=ye+M;J.push(ye,Re,ye+1,ye+1,Re,Re+1)}let se=new ct;return se.setAttribute("position",new xt(L,3)),se.setAttribute("normal",new xt(V,3)),se.setAttribute("uv",new xt(G,2)),se.setIndex(J),e.frames&&(se.userData.frames={C:m,T:d,S:x,U:b,RX:y,RY:P,RF:p,RB:g,capS:r,capE:o,m:_}),se.userData.end={p:m[_-1],t:d[_-1],r:(y[_-1]+P[_-1])/2},se}function ms(n,e,t){let i=En(e,0,1),s=i*(n.m-1),r=Math.min(Math.floor(s),n.m-2),o=s-r,a=r+1,c=n.C[r].clone().lerp(n.C[a],o),h=n.S[r].clone().lerp(n.S[a],o).normalize(),l=n.T[r].clone().lerp(n.T[a],o).normalize(),u=l.clone().cross(h).normalize(),f=Yt(n.RX[r],n.RX[a],o),g=Yt(n.RY[r],n.RY[a],o)*(Math.cos(t)<0?Yt(n.RF[r],n.RF[a],o):Yt(n.RB[r],n.RB[a],o)),_=1,m=0,d=0;(e<0||e>1)&&(d=e<0?-1:1,m=En(e<0?-e:e-1,0,1)*Math.PI/2,c.addScaledVector(l,d*(d<0?n.capS:n.capE)*(f+g)*.5*Math.sin(m)),_=Math.max(Math.cos(m),.015));let x=Math.sin(t),b=Math.cos(t),y=c.clone().addScaledVector(h,f*_*x).addScaledVector(u,g*_*b),T=h.clone().multiplyScalar(x/f).addScaledVector(u,b/g).normalize().multiplyScalar(Math.cos(m)).addScaledVector(l,d*Math.sin(m)).normalize();return{pos:y,normal:T,tangent:l,center:c,rx:f,ry:g,r:(f+g)/2}}function ut(n,e){return sn(n.map(t=>{var i;return{p:le(t[0],t[1],t[2]),rx:t[3],ry:(i=t[4])!=null?i:t[3]}}),e)}function dt(n,e=1,t=1,i=1,s=0,r=0,o=0,a=14){let c=new nn(n,a,Math.max(8,Math.round(a*.7)));return c.scale(e,t,i),c.translate(s,r,o),c}function gs(n,e){let t=n.length,i=[],s=[],r=[];for(let a=0;a<t;a++)i.push(n[a].x,n[a].y,n[a].z,e[a].x,e[a].y,e[a].z),r.push(a/(t-1),0,a/(t-1),1);for(let a=0;a<t-1;a++){let c=a*2;s.push(c,c+1,c+2,c+2,c+1,c+3)}let o=new ct;return o.setAttribute("position",new $e(i,3)),o.setAttribute("uv",new $e(r,2)),o.setIndex(s),o.computeVertexNormals(),o}function Gd(n,e){return n.applyMatrix4(e),n}function _s(n,e,t,i){return n.translate(e,t,i),n}function uh(n,e,t,i){return new Xe().makeBasis(n,e,t).setPosition(i||le())}function Wd(n){let e=n.index.array;for(let t=0;t<e.length;t+=3){let i=e[t];e[t]=e[t+2],e[t+2]=i}}function He(n,e=[]){if(n.length===1)return n[0];let t=n.map(i=>{let s=i.index?i:i.toNonIndexed();for(let r of Object.keys(s.attributes))r!=="position"&&r!=="normal"&&r!=="uv"&&!e.includes(r)&&s.deleteAttribute(r);return s});return Vd(t,!1)}var zt=Math.PI;var rn=(n,e,t,i={})=>sn([{p:n,rx:t},{p:n.clone().lerp(e,.5),rx:t*.62},{p:e,rx:t*.04}],{radial:8,sub:3,capStart:0,capEnd:0,...i}),ri=(n,e)=>{let t=e.clone().addScaledVector(n,-e.dot(n));return t.lengthSq()<1e-6?(Math.abs(n.x)<.9?Ln:qt).clone().cross(n).normalize():t.normalize()};function Tn(n,e,t,i,s={}){let r=n[n.length-1].clone().sub(n[0]).normalize(),o=r.clone().cross(i);return sn(n.map((a,c)=>({p:a,rx:Math.max(e[c],.004),ry:Math.max(t*(e[c]>.03?1:.4),.003)})),{radial:8,sub:4,side:o.lengthSq()<1e-6?ri(r,Ln):o.normalize(),capStart:.5,capEnd:.5,capRings:2,...s})}function uy(n){return(e,t)=>{var c,h,l,u,f;let i=[],r=n==="stalk",o=r?1.55:n==="compound"?0:n==="beady"?.05:-.1,a=new nn(.5,28,18);if(a.rotateX(zt/2),n==="compound"&&a.scale(.95,1.2,.85),i.push({g:_s(a,0,0,o),m:zd(t.M,r?"round":n,t.look.eye,(c=e.iris)!=null?c:.75)}),n!=="compound"&&i.push({g:dt(.055,1.5,1,.5,-.14,.17,o+.455,8),m:t.M.glint}),r&&i.push({g:ut([[0,0,-.3,.3],[0,.05,.5,.2],[0,0,1.15,.19],[0,0,1.5,.4]],{capEnd:.6}),m:"skin"}),n!=="compound"){let p=new dn(.5,.06,8,28);p.scale(1,1,1.5),r||i.push({g:_s(p,0,0,-.03),m:"skin"});let g=(h=e.lid)!=null?h:.3;if(g>.02&&n!=="beady"){let _=new nn(.535,22,10,0,zt*2,0,.55+g*1.05);_.rotateX(.55),_.rotateZ((l=e.brow)!=null?l:0),i.push({g:_s(_,0,0,o),m:"skin"});let m=new nn(.5*1.06,22,8,0,zt*2,0,.42+g*.4);if(m.rotateX(zt-.3),i.push({g:_s(m,0,0,o),m:"skin"}),t.female&&((u=e.lash)!=null?u:1)>.05){let d=.55+g*1.05,x=[];for(let b=0;b<7;b++){let y=-1.05+b*.35,P=le(Math.sin(d)*Math.sin(y),Math.cos(d),Math.sin(d)*Math.cos(y)).applyAxisAngle(Ln,.55).applyAxisAngle(or,(f=e.brow)!=null?f:0),T=P.clone().multiplyScalar(.5*1.06).add(le(0,0,o)),A=T.clone().add(P.clone().add(le(0,.75,.55)).normalize().multiplyScalar(.3*e.lash*(1-Math.abs(y)*.3)));x.push(rn(T,A,.028,{radial:5}))}i.push({g:He(x),m:"lash"})}}}return i}}var dy={iris:[.4,1.2,.75,"Iris size"],lid:[0,.9,.3,"Eyelid"],brow:[-.7,.7,0,"Sad / angry"],lash:[0,2,1,"Lashes (female)"]};function Xd(n,e,t,i=1){let s=[];for(let r=0;r<n;r++){let o=e(r/(n-1));s.push(rn(o.p,o.p.clone().add(le(0,-i*t*o.s,0)),.035*(.7+o.s*.5),{radial:6}))}return s}function fy(n){let e=n.len,t=[],i=n.open;t.push({g:ut([[0,.06,-.35,.52,.44],[0,.08,.2*e,.44,.34],[0,.04,.62*e,.34,.24],[0,0,.9*e,.27,.19]],{radial:16}),m:"skin",fur:.3}),t.push({g:dt(.15,1.25,.85,.9,0,.1,.9*e+.2),m:"dark"});let s=ut([[0,-.1,-.3,.44,.22],[0,-.14,.3*e,.34,.15],[0,-.13,.82*e,.21,.1]],{radial:14}),r=n.teeth,o=[s],a=[],c=[];for(let l of[-1,1])a.push(...Xd(6,u=>({p:le(l*Yt(.36,.17,u),-.08,Yt(.2,.95,u)*e),s:u>.75&&u<.95?2.2:1}),.13*r)),c.push(...Xd(5,u=>({p:le(l*Yt(.3,.14,u),-.05,Yt(.25,.82,u)*e),s:u>.7?1.6:.8}),.1*r,-1));let h=l=>(l.translate(0,.1,.3),l.rotateX(i*.75),l.translate(0,-.1,-.3),l);return t.push({g:h(s),m:"skin",fur:.3}),r>.05&&(t.push({g:He(a),m:"teeth"}),t.push({g:h(He(c)),m:"teeth"})),t.push({g:dt(.5,.62,.16+i*.25,.9*e,0,-.1-i*.1,.4*e),m:"mouth"}),i>.25&&t.push({g:h(dt(.5,.36,.07,.7*e,0,-.03,.42*e)),m:"tongue"}),t}function py(n){let e=n.len,t=n.hook,i=[];i.push({g:ut([[0,.05,-.3,.44,.38],[0,.07,.3*e,.33,.27],[0,.03-t*.05,.72*e,.17,.15],[0,-t*.4,1*e,.015]],{radial:12,capEnd:.3}),m:"accent"});let s=ut([[0,-.16,-.3,.38,.2],[0,-.17,.35*e,.24,.11],[0,-.14,.8*e,.02]],{radial:12,capEnd:.3});return s.translate(0,.1,.2),s.rotateX(n.open*.6),s.translate(0,-.1,-.2),i.push({g:s,m:"accent"}),i.push({g:He([dt(.035,1,1,1.6,.14,.2,.3*e),dt(.035,1,1,1.6,-.14,.2,.3*e)]),m:"dark"}),n.open>.2&&i.push({g:dt(.5,.4,.12,.6*e,0,-.08,.3*e),m:"mouth"}),i}function my(n){let e=[],t=[],i=n.open;for(let s of[-1,1])e.push(ut([[s*.28,0,-.15,.17],[s*(.5+i*.25),-.05,.4,.14],[s*(.36+i*.3),-.1,.85*n.len,.08],[s*(.08+i*.3),-.12,1.1*n.len,.01]],{radial:10,ridges:0})),t.push(ut([[s*.12,-.2,-.1,.07],[s*.15,-.35,.3,.05],[s*.1,-.5,.45,.02]],{radial:8}));return[{g:He(e),m:"accent"},{g:He(t),m:"skin"},{g:dt(.3,1,.8,.5,0,-.08,.02),m:"mouth"}]}function gy(n){let e=new dn(.42,.15,10,28);e.translate(0,0,.05);let t=[],i=Math.round(n.count);for(let s=0;s<2;s++)for(let r=0;r<i;r++){let o=(r+s*.5)/i*zt*2,a=.36-s*.1,c=le(Math.cos(o)*a,Math.sin(o)*a,.1-s*.08);t.push(rn(c,c.clone().add(le(-Math.cos(o)*.14,-Math.sin(o)*.14,.16).multiplyScalar(n.teeth)),.045,{radial:6}))}return[{g:e,m:"skin"},{g:dt(.4,1,1,.35,0,0,-.02),m:"mouth"},{g:He(t),m:"teeth"}]}function _y(n){let e=(i,s,r)=>{let o=[];for(let a=0;a<=6;a++){let c=a/6-.5,h=1-Math.abs(c)*2;o.push([c,i+n.smile*.22*(c*c*4)+r*.03*h,.04-c*c*.45,.012+.075*s*Math.pow(h,.6),.012+.06*s*Math.pow(h,.6)])}return ut(o,{radial:10,sub:3,side:le(0,1,0)})},t=ut([[-.48,n.smile*.2,-.06,.012],[0,0,.065,.02],[.48,n.smile*.2,-.06,.012]],{radial:6});return[{g:He([e(.045,n.full*.85,1),e(-.05,n.full,-1)]),m:"lip"},{g:t,m:"mouth"}]}function xy(n){let e=n.curl;return[{g:ut([[0,0,-.3,.4],[0,-.05,.45,.34],[0,-.55,.95,.27],[0,-1.25*n.len,1.1,.21],[0,-1.9*n.len,1+e*.2,.17],[0,-2.3*n.len,1+e*.9,.14]],{radial:14,sub:8,ridges:26,ridgeAmp:.04}),m:"skin"}]}function yy(n,e){let t=[],i=Math.round(n.count);for(let s=0;s<i;s++){let r=(s-(i-1)/2)*(.7/i),o=.1*Math.sin(s*2.4),a=e.down,c=le(r,0,-.15),h=le(r*1.2,0,.3),l=h.clone().addScaledVector(a,.5*n.len).add(le(0,0,.1)),u=l.clone().addScaledVector(a,.6*n.len).add(le(r*.5+o,0,-.1+o));t.push(sn([{p:c,rx:.12},{p:h,rx:.1},{p:l,rx:.07},{p:u,rx:.02}],{radial:8}))}return[{g:He(t),m:"skin"},{g:dt(.25,1.2,.7,.4,0,-.05,0),m:"mouth"}]}function vy(n,e){let t=[];for(let i=0;i<=4;i++){let s=i/4-.5;t.push(le(s,n.arch*.22*(1-s*s*4)+s*-.1,.04-s*s*.25))}return[{g:Tn(t,[.03,.09*n.thick,.1*n.thick,.08*n.thick,.02],.045,le(0,0,1),{radial:6,sub:3}),m:"hair"}]}function by(n,e){let s=En(e.part.u-n.span/2,-.97,1.97),r=En(e.part.u+n.span/2,-.97,1.97),o=e.size*.3,a=[],c=[],h=[];for(let u=0;u<=22;u++)for(let f=0;f<=40;f++){let p=ms(e.frames,Yt(s,r,u/22),f/40*zt*2),g=Math.min(u,22-u)===0?.35:1,_=p.pos.addScaledVector(p.normal,o*g);a.push(_.x,_.y,_.z),c.push(p.normal.x,p.normal.y,p.normal.z)}for(let u=0;u<22;u++)for(let f=0;f<40;f++){let p=u*41+f,g=p+40+1;h.push(p,g,p+1,p+1,g,g+1)}let l=new ct;return l.setAttribute("position",new $e(a,3)),l.setAttribute("normal",new $e(c,3)),l.setAttribute("uv",new $e(new Float32Array(a.length/3*2),2)),l.setIndex(h),[{g:l,m:"cloth"}]}function My(n){return[{g:He([ut([[0,.5*n.len,-.1,.09,.08],[0,.2,.1*n.len+.05,.12,.11],[0,-.06,.3*n.len,.17,.14]],{radial:10}),dt(.12,1,.8,1,.15*n.wide,-.1,.1*n.len),dt(.12,1,.8,1,-.15*n.wide,-.1,.1*n.len)]),m:"skin"}]}function Jr(n){return(e,t)=>{let i=t.up,s=t.down,r={point:[[le(0,0,-.15),.34],[le(0,.04,.3),.37],[le(0,.07,.72),.22],[le(0,.09,1.08),.02]],round:[[le(0,0,-.12),.3],[le(0,0,.3),.5],[le(0,0,.62),.44],[le(0,0,.8),.2]],long:[[le(0,0,-.15),.2],[le(0,.03,.6),.27],[le(0,.04,1.45),.24],[le(0,0,2.1),.03]],elf:[[le(0,0,-.12),.17],[le(0,0,.2).addScaledVector(i,.12),.3],[le(0,0,.42).addScaledVector(i,.45),.2],[le(0,0,.62).addScaledVector(i,.95*e.len),.02]],floppy:[[le(0,0,-.12),.3],[le(0,0,.3),.38],[le(0,0,.5).addScaledVector(s,.5*e.len),.42],[le(0,0,.46).addScaledVector(s,1.1*e.len),.32],[le(0,0,.42).addScaledVector(s,1.45*e.len),.06]]}[n],o=n==="floppy"||n==="elf"?1:e.len,a=r.map(u=>le(u[0].x,u[0].y,u[0].z*(u[0].z>0?o:1))),c=r.map(u=>u[1]*e.wide),h=n==="floppy"?le(0,0,1):t.fwd,l=Tn(a.map((u,f)=>u.clone().addScaledVector(h,.045).multiplyScalar(f?.9:1)),c.map(u=>u*.62),.03,h);return[{g:Tn(a,c,.07,h,{radial:10}),m:"skin",fur:.3},{g:l,m:"membrane"}]}}function Sy(n,e){let t=[],i=[],s=[];for(let r=0;r<5;r++){let o=-.6+r*.42,a=le(0,0,1).multiplyScalar(Math.cos(o)).addScaledVector(e.up,Math.sin(o)),c=a.clone().multiplyScalar(n.len*(.8+.35*Math.sin((r+.5)/5*zt)));t.push(c),i.push(a.clone().multiplyScalar(.05)),s.push(rn(le(0,0,-.1),c,.045,{radial:6}))}return[{g:He(s),m:"accent"},{g:gs(i,t.map(r=>r.clone().multiplyScalar(.93))),m:"membrane"}]}function ar(n){return e=>{var c,h;let t=e.len,i=(c=e.curve)!=null?c:1,s={radial:12,sub:7,ridges:n==="spike"?0:9*t,ridgeAmp:.05,capEnd:.3};if(n==="spike")return[{g:ut([[0,0,-.15,.3],[0,.02*i,.5*t,.2],[0,.1*i,1.25*t,.01]],s),m:"accent"}];if(n==="curved")return[{g:ut([[0,0,-.15,.3],[0,.05*i,.42*t,.26],[0,.32*i,.88*t,.18],[0,.78*i,1.12*t,.09],[0,1.2*i,1.05*t,.01]],s),m:"accent"}];if(n==="ram"){let l=[];for(let u=0;u<=12;u++){let f=u/12,p=f*zt*1.75*i,g=.62*t*(1-f*.45);l.push([.12+f*.75,g*Math.sin(p)*.9,-.15+g*(1-Math.cos(p)),.32*(1-f*.95)+.01])}return[{g:ut(l,{...s,sub:4,ridges:22}),m:"accent"}]}if(n==="tusk")return[{g:ut([[0,0,-.25,.2],[0,-.3*i,.3*t,.17],[0,-.38*i,.8*t,.12],[0,-.05,1.3*t,.01]],{...s,ridges:0}),m:"teeth"}];let r=[[0,0,-.15,.14],[.05,.2,.6,.115],[.12,.5,1.2,.095],[.15,.62,1.9,.065],[.1,.5,2.5,.012]].map(l=>[l[0],l[1]*i,l[2]*t,l[3]]),o=[ut(r,{radial:8,sub:5})],a=Math.round((h=e.tines)!=null?h:3);for(let l=0;l<a;l++){let u=(l+.6)/(a+.4),f=u*4,p=Math.min(Math.floor(f),3),g=f-p,_=le(Yt(r[p][0],r[p+1][0],g),Yt(r[p][1],r[p+1][1],g),Yt(r[p][2],r[p+1][2],g)),m=l%2?1:-1,d=.7*(1-u*.4);o.push(sn([{p:_,rx:.08},{p:_.clone().add(le(m*.2*d,-.35*d,.3*d)),rx:.065},{p:_.clone().add(le(m*.3*d,-.5*d,.9*d)),rx:.012}],{radial:7,sub:4,capStart:0}))}return[{g:He(o),m:"accent"}]}}function Yd(n){return e=>{let t=e.len,i=e.curve,s=[[0,0,-.08,.055],[0,.1*i,.6*t,.045],[0,.5*i,1.2*t,.035],[0,1.05*i,1.5*t,.028]],r=[ut(s,{radial:7,sub:6})];if(!n)return[{g:r[0],m:"accent"},{g:dt(.09,1,1,1,0,1.05*i,1.5*t),m:"accent"}];let o=new Gi(s.map(a=>le(a[0],a[1],a[2])));for(let a=2;a<16;a++){let c=o.getPoint(a/16),h=.3*Math.sin(a/16*zt)+.05;for(let l of[-1,1])r.push(rn(c,c.clone().add(le(l*h,.05,h*.3)),.016,{radial:4}))}return[{g:He(r),m:"hair"}]}}function Kr(n){return(e,t)=>{var l,u,f,p,g,_;let i=[],s=Math.round((l=e.count)!=null?l:n.count),r=(u=e.droop)!=null?u:n.droop,o=(f=e.len)!=null?f:1,a=(p=e.spread)!=null?p:n.spread,c=(g=n.capR)!=null?g:.5,h=le(0,0,-c-.02);for(let m=0;m<s;m++){let d=a*Math.sqrt((m+.5)/s),x=m*2.39996+t.rnd()*.3,b=le(Math.sin(d)*Math.cos(x),Math.sin(d)*Math.sin(x),Math.cos(d)),y=o*(.75+.5*t.rnd()),P=n.width*(.8+.4*t.rnd()),T=y/4,A=[h.clone().addScaledVector(b,c)],C=b.clone(),S=A[0].clone();for(let L=1;L<=4;L++){C.multiplyScalar(1-r*.5).addScaledVector(t.down,r*.3*L).normalize(),S=S.clone().addScaledVector(C,T);let V=S.clone().sub(h);n.hug&&V.length()<c*1.05&&(S=h.clone().add(V.setLength(c*1.05))),A.push(S)}let M=n.hug?A[2].clone().sub(h).normalize():ri(b,t.fwd.clone().add(le(t.rnd()-.5,t.rnd()-.5,0)));i.push(Tn(A,[P*.75,P,P*.95,P*.65,.012],P*.2,M,{radial:6,sub:3}))}if(n.hug){let m=new nn(c*1.03,24,12,0,zt*2,0,Math.min(a*.82,zt*.6));m.rotateX(zt/2),m.translate(h.x,h.y,h.z),i.push(m)}return[{g:He(i),m:(_=n.mat)!=null?_:"hair"}]}}function wy(n,e){let t=[];for(let i=0;i<4;i++){let s=-.45+i*.3,o=le(0,0,1).multiplyScalar(.35).addScaledVector(e.up,Math.sin(s)*.6).addScaledVector(e.fwd,-.15).add(le(0,0,.6)).normalize().clone().multiplyScalar(n.len*1.6);t.push(sn([{p:le(0,(i-1.5)*.1,0),rx:.016},{p:o.clone().multiplyScalar(.5).addScaledVector(e.down,-.05),rx:.012},{p:o.addScaledVector(e.down,.12*n.len),rx:.004}],{radial:4,sub:4}))}return[{g:He(t),m:"teeth"}]}function Ey(n){let e=new dn(.5,.06,6,28);e.scale(1,n.long,1);let t=[];for(let i=0;i<7;i++){let s=i/6*zt*2,r=i===6?0:.27;t.push(dt(.17,1,1,.35,Math.cos(s)*r,Math.sin(s)*r*n.long,.5*n.dome*(i===6?.98:.8)))}return[{g:He([dt(.5,1,n.long,n.dome,0,0,0,22),e]),m:"accent"},{g:He(t),m:"skin"}]}function Ty(n,e){let t=e.fwd.clone().multiplyScalar(-1),i=le(0,0,1),s=(r,o)=>i.clone().multiplyScalar(r).addScaledVector(t,o);return[{g:Tn([s(-.12,0),s(.4*n.len,.15*n.sweep),s(.8*n.len,.5*n.sweep),s(1.1*n.len,.95*n.sweep)],[.5,.42,.25,.02],.06,ri(i,t.clone().cross(i)),{radial:10}),m:"skin"}]}function Ay(n,e){let t=e.fwd.clone().multiplyScalar(-1),i=le(0,0,1),s=e.down,r=(o,a,c)=>i.clone().multiplyScalar(o).addScaledVector(t,a).addScaledVector(s,c);return[{g:Tn([r(-.12,0,0),r(.4*n.len,.15*n.sweep,.08),r(.9*n.len,.5*n.sweep,.2),r(1.25*n.len,.95*n.sweep,.3)],[.3,.38,.27,.02],.05,e.up,{radial:10}),m:"skin"}]}var La={human(){let n=[];for(let e=0;e<5;e++)n.push(dt(.3-e*.03,1,.8,1.3,-.62+e*.33,-.95,2.55-e*.14));return[{g:He([dt(.95,.95,.85,1.05,0,-.45,-.25),ut([[0,-.4,-.2,.8,.6],[0,-.65,1.1,.9,.5],[0,-.85,2.3,.95,.3]],{radial:10}),...n]),m:"skin"}]},paw(){let n=[dt(1,1.15,.8,1.35,0,-.55,.45)],e=[];for(let t=0;t<4;t++){let i=-.75+t*.5,s=1.55-Math.abs(t-1.5)*.18;n.push(dt(.42,1,.9,1.3,i,-.75,s)),e.push(rn(le(i,-.6,s+.35),le(i*1.08,-1.05,s+.95),.14,{radial:6}))}return[{g:He(n),m:"skin",fur:.35},{g:He(e),m:"accent"}]},hoof(){return[{g:ut([[0,.1,0,.95],[0,-.6,.15,1.2,1.25],[0,-1.15,.3,1.4,1.5]],{radial:12,capEnd:.12,capStart:0}),m:"accent"}]},talon(n){let e=[],t=[];for(let[s,r,o]of[[-1.25,1.7,1],[0,2.3,1.1],[1.25,1.7,1],[0,-1.4,.7]]){e.push(ut([[0,-.1,0,.55],[s*.5,-.75,r*.5,.45],[s,-1,r,.32]],{radial:8,ridges:5,ridgeAmp:.08}));let a=le(s,0,r).normalize();t.push(rn(le(s,-.95,r),le(s,-1.25,r).addScaledVector(a,.75*o),.26,{radial:6}))}let i=[{g:He(e),m:"skin"},{g:He(t),m:"accent"}];return n&&i.push({g:gs([le(0,-.6,.2),le(0,-.6,.2),le(0,-.6,.2),le(0,-.6,.2),le(0,-.6,.2)],[le(-1.45,-1.05,1.95),le(-.75,-1.05,1.8),le(0,-1.05,2.6),le(.75,-1.05,1.8),le(1.45,-1.05,1.95)]),m:"membrane"}),i},webbed(){return La.talon(!0)},stump(){let n=[];for(let e=0;e<4;e++){let t=-.9+e*.6;n.push(dt(.3,1,.8,.6,Math.sin(t)*1.3,-.95,Math.cos(t)*1.3+.1))}return[{g:ut([[0,.2,0,1],[0,-.6,.05,1.2],[0,-1.15,.1,1.38]],{radial:12,capEnd:.1,capStart:0}),m:"skin"},{g:He(n),m:"accent"}]},point(){return[{g:rn(le(0,.2,0),le(.3,-1.9,.2),.95,{capStart:0}),m:"accent"}]},none(){return[]}},qd={human(){let n=[dt(1,1.2,1.3,.6,0,1,0)];return[-.82,-.28,.27,.8].forEach((e,t)=>{let i=[.85,1,1.05,.95][t];n.push(ut([[e,1.8,0,.3],[e*1.1,1.8+1.1*i,.1,.27],[e*1.15,1.8+1.9*i,.4,.24],[e*1.15,1.8+2.4*i,.8,.2]],{radial:7,sub:4,ridges:3,ridgeAmp:.06}))}),n.push(ut([[.7,.6,.2,.36],[1.5,1.3,.5,.3],[1.9,2.1,.75,.24]],{radial:7,sub:4})),[{g:He(n),m:"skin"}]},claw(){let n=[dt(1,1.2,1.2,.75,0,.9,0)],e=[];for(let t of[-.85,0,.85])n.push(ut([[t,1.5,0,.42],[t*1.3,2.6,.2,.38],[t*1.4,3.3,.7,.3]],{radial:7,sub:4,ridges:2,ridgeAmp:.08})),e.push(rn(le(t*1.4,3.25,.65),le(t*1.45,3.9,1.6),.27,{radial:6}));return n.push(ut([[.9,.5,.2,.4],[1.7,1.2,.6,.3]],{radial:7})),e.push(rn(le(1.7,1.2,.6),le(2,1.7,1.3),.26,{radial:6})),[{g:He(n),m:"skin"},{g:He(e),m:"accent"}]},pincer(){return[{g:He([dt(1,1.7,2.1,1.25,0,1.6,0),ut([[-.7,3,0,.8,.6],[-1.1,4.4,0,.6,.45],[-.75,5.5,0,.3],[-.1,6.1,0,.03]],{radial:9,capStart:0}),ut([[.8,2.9,0,.6,.5],[1.1,4.1,0,.42],[.75,5.1,0,.22],[.2,5.7,0,.03]],{radial:9,capStart:0})]),m:"skin"}]},mitt(){return[{g:dt(1,1.25,1.5,.9,0,1.1,0),m:"skin",fur:!0}]},none(){return[]}},Ry={plant:{pts:[[0,0,0],[.02,-.14,.02],[.035,-.3,.035],[.04,-.48,.045],[.038,-.63,0],[.032,-.8,-.012],[.03,-.97,-.012]],r:[1.02,1.1,.98,.72,.86,.6,.46],bulge:[1,2,4]},digi:{pts:[[0,0,0],[.03,-.2,.1],[.05,-.42,.16],[.04,-.62,-.02],[.03,-.8,-.12],[.03,-.97,-.03]],r:[1.1,1.2,.8,.62,.42,.4],bulge:[1]},pillar:{pts:[[0,0,0],[.01,-.3,.01],[.02,-.6,.02],[.02,-.9,0]],r:[1.15,1.1,.95,.95],bulge:[1]},arm:{pts:[[0,0,0],[.045,-.1,-.005],[.06,-.26,-.012],[.075,-.46,-.028],[.082,-.59,.008],[.086,-.78,.058],[.088,-.93,.1]],r:[1,1.14,.98,.72,.84,.6,.5],bulge:[1,2,4]},insect:{pts:[[0,0,0],[.28,.2,0],[.5,.32,0],[.72,-.15,.02],[.88,-.65,.03],[.93,-.95,.03]],r:[.75,.62,.5,.42,.3,.16],bulge:[]}};function ph(n,e,t){return(i,s)=>{var P;let r=s.size,o=Ry[n],a=r*.105*i.thick*s.limbMul,c=Math.cos(i.splay),h=Math.sin(i.splay),l=Math.cos(i.swing),u=Math.sin(i.swing),p=o.pts.map(([T,A,C])=>{C*=i.bend,n==="insect"&&(A=A>0?A*i.bend:A);let S=T*c-A*h,M=T*h+A*c,L=M*l+C*u,V=-M*u+C*l;return s.root.clone().addScaledVector(s.out,S*r).addScaledVector(qt,L*r).addScaledVector(s.fwd,V*r)}).map((T,A)=>({p:T,rx:o.r[A]*a*(o.bulge.includes(A)?i.muscle:1)})),g=n==="insect",_=sn(p,{radial:16,sub:7,ridges:g?5:0,ridgeAmp:.1}),m=[{g:_,m:"skin",fur:g?.5:.75}],d=_.userData.end,x=d.r*i.end,b=(P=i.endType)!=null?P:t;s.anchors&&e===qd&&s.anchors.push({p:d.p.clone(),t:d.t.clone(),r:d.r*i.end});let y;if(e===La)y=uh(s.out.clone().multiplyScalar(x),qt.clone().multiplyScalar(x),s.fwd.clone().multiplyScalar(x),d.p);else{let T=d.t.clone(),A=ri(T,s.fwd),C=T.clone().cross(A);y=uh(C.multiplyScalar(x),T.multiplyScalar(x),A.multiplyScalar(x),d.p.clone().addScaledVector(d.t,-d.r*.4))}for(let T of e[b]())m.push({g:Gd(T.g,y),m:T.m,fur:T.fur||0});return m}}function Cy(n,e){let t=e.size,i=[],s=n.curl,r=t*.085*n.thick*e.limbMul;for(let c=0;c<=9;c++){let h=c/9,l=.5*Math.pow(h,.8)+s*.16*Math.sin(h*5+e.seed)*h,u=-.8*Math.pow(h,1.25)+s*.22*h*h*Math.sin(h*6.5),f=.14*Math.sin(h*7+e.seed*2)*h*s,p=Math.cos(n.splay),g=Math.sin(n.splay);i.push({p:e.root.clone().addScaledVector(e.out,(l*p-u*g)*t).addScaledVector(qt,(l*g+u*p)*t).addScaledVector(e.fwd,f*t),rx:r*(Math.pow(1-h,.75)*.94+.06)})}let o=sn(i,{radial:12,sub:5}),a=[{g:o,m:"skin"}];if(e.anchors&&e.anchors.push({p:o.userData.end.p.clone(),t:o.userData.end.t.clone(),r:r*.5}),n.suckers>.5){let c=new Gi(i.map(l=>l.p)),h=[];for(let l=3;l<22;l++){let u=l/22,f=c.getPoint(u),p=c.getTangent(u),g=r*(Math.pow(1-u,.75)*.94+.06),_=ri(p,e.out.clone().multiplyScalar(-1).add(le(0,-.6,0))),m=dt(g*.36,1,1,1,0,0,0,8);m.translate(f.x+_.x*g*.85,f.y+_.y*g*.85,f.z+_.z*g*.85),h.push(m)}a.push({g:He(h),m:"membrane"})}return a}function dh(n){return(e,t)=>{let i=t.size,s=Math.cos(e.lift),r=Math.sin(e.lift),o=Math.cos(e.sweep),a=Math.sin(e.sweep),c=(l,u,f)=>{let p=l*s-u*r,g=l*r+u*s,_=p*o+f*a,m=-p*a+f*o;return t.root.clone().addScaledVector(t.out,_*i).addScaledVector(qt,g*i).addScaledVector(t.fwd,m*i)},h=[];if(n==="bat"){let l=c(0,0,0),u=c(.33,.22,0),f=c(.6,.45,.06),p=[c(1.45,.5,-.1),c(1.25,-.02,-.38),c(.92,-.36,-.52),c(.55,-.45,-.55),c(.02,-.3,-.3)],g=[sn([{p:l,rx:i*.05},{p:u,rx:i*.036},{p:f,rx:i*.028}],{radial:8})],_=[];p.forEach((m,d)=>{if(d<4&&g.push(sn([{p:f,rx:i*.018},{p:f.clone().lerp(m,.5).addScaledVector(qt,i*.03),rx:i*.013},{p:m,rx:i*.004}],{radial:6,capStart:0})),d>0){let x=[],b=[],y=d<4?f:u;for(let P=0;P<=8;P++){let T=P/8,A=p[d-1].clone().lerp(m,T);A.lerp(y,.2*Math.sin(T*zt)),x.push(y),b.push(A)}_.push(gs(x,b))}}),_.push(gs([l,l,l],[u,p[4].clone().lerp(u,.5),p[4]])),_.push(gs([f,f],[u,p[4]])),g.push(rn(f,c(.62,.62,.16),i*.02,{radial:5})),h.push({g:He(g),m:"skin"},{g:He(_),m:"membrane"})}else if(n==="feather"){let l=[c(0,0,0),c(.3,.16,.02),c(.62,.26,.06),c(.9,.2,.02)];h.push({g:sn(l.map((d,x)=>({p:d,rx:i*[.07,.06,.045,.03][x]})),{radial:8}),m:"skin",fur:!0});let u=new Gi(l),f=c(0,0,1).sub(c(0,0,0)).normalize(),p=[],g=[],_=(d,x,b,y,P,T)=>{let A=u.getPoint(d).addScaledVector(f,T*i),C=c(Math.sin(x),-Math.cos(x),-.18).sub(c(0,0,0)).normalize(),S=A.clone().addScaledVector(C,b*i);P.push(Tn([A,A.clone().lerp(S,.4),A.clone().lerp(S,.8),S],[y*i*.6,y*i,y*i*.9,y*i*.15],i*.006,f,{radial:6,sub:3}))},m=Math.round(e.feathers);for(let d=0;d<m;d++){let x=d/(m-1);_(.08+x*.92,Yt(-.15,1.45,Math.pow(x,1.6)),Yt(.5,.95,Math.sin(x*zt*.62)),.062,p,-.004*(d%2)),_(.05+x*.9,Yt(-.1,1.2,Math.pow(x,1.6)),Yt(.28,.4,x),.07,g,.012)}h.push({g:He(p),m:"hair"},{g:He(g),m:"skin"})}else{let l=[];for(let[u,f,p]of[[.2,1,.17],[.85,.72,.2]]){let g=_=>c(Math.cos(u)*_*f,.04*_,-Math.sin(u)*_*f);l.push(Tn([g(0),g(.35),g(.75),g(1)],[.03*i,p*i*.8,p*i,.02*i],i*.004,qt,{radial:6,sub:4}))}h.push({g:He(l),m:"glass"})}return h}}function Ei(n){return(e,t)=>{let i=t.size,s=e.curl,r=t.normal,o=[],a=ri(r,qt),c=m=>n==="stinger"?t.root.clone().addScaledVector(r,i*.42*Math.sin(m*2.7*Math.abs(s||1))).addScaledVector(a,i*.4*(1-Math.cos(m*2.7*Math.abs(s||1)))*Math.sign(s||1)):t.root.clone().addScaledVector(r,i*m*(1-.3*Math.abs(s)*m)).addScaledVector(a,i*s*.65*m*m),h=Math.min(t.r*.8,i*.22)*e.thick,l={thin:m=>i*.035*e.thick*(1-m*.7),thick:m=>h*Math.pow(1-m,.9)+i*.006,fluffy:m=>i*.1*e.thick*(.35+1*Math.sin(Math.min(m*1.25,1)*zt*.8))*(m>.95?.5:1),club:m=>i*.05*e.thick*(1-m*.4),stinger:m=>i*.075*e.thick*(1-m*.45),fluke:m=>h*Math.pow(1-m,.7)*.9+i*.02,fishfin:m=>h*Math.pow(1-m,.7)*.9+i*.02,fan:m=>i*.05*(1-m*.5),tuft:m=>i*.03*e.thick*(1-m*.5)}[n],u=n==="fan"?.3:n==="fluke"||n==="fishfin"?.75:1,f=[];for(let m=0;m<=7;m++){let d=m/7;f.push({p:c(d*u),rx:Math.max(l(d),.003),ry:Math.max(l(d)*(n==="fishfin"?1.25:1),.003)})}let p=sn(f,{radial:12,sub:5,ridges:n==="stinger"?7:0,ridgeAmp:.12});o.push({g:p,m:"skin",fur:n==="fluffy"?1.6:n!=="stinger"&&n!=="fishfin"&&n!=="fluke"});let g=p.userData.end,_=g.t;if(n==="club"){let m=[];for(let d=0;d<12;d++){let x=le(Math.sin(d*2.4)*Math.sqrt(1-(d/11*2-1)**2),d/11*2-1,Math.cos(d*2.4)*Math.sqrt(1-(d/11*2-1)**2));m.push(rn(g.p.clone().addScaledVector(x,i*.07),g.p.clone().addScaledVector(x,i*.17*e.tip),i*.03,{radial:6}))}o.push({g:He([_s(dt(i*.1*e.tip,1,1,1),g.p.x,g.p.y,g.p.z),...m]),m:"accent"})}else if(n==="stinger"){let m=g.p.clone().addScaledVector(_,i*.06);o.push({g:_s(dt(i*.075*e.tip,1,1,1),m.x,m.y,m.z),m:"skin"}),o.push({g:rn(m.clone().addScaledVector(_,i*.04),m.clone().addScaledVector(_,i*.2*e.tip).addScaledVector(a,-i*.1*e.tip*Math.sign(s||1)),i*.035*e.tip),m:"accent"})}else if(n==="fluke"||n==="fishfin"){let m=n==="fluke"?t.out:a,d=n==="fluke"?a:t.out,x=[];for(let b of[-1,1]){let y=g.p.clone().addScaledVector(_,-i*.08),P=g.p.clone().addScaledVector(_,i*.3*e.tip).addScaledVector(m,b*i*.36*e.tip);x.push(Tn([y,y.clone().lerp(P,.45).addScaledVector(_,i*.05),y.clone().lerp(P,.8),P],[i*.03,i*.11*e.tip,i*.08*e.tip,i*.01],i*.012,d,{radial:8}))}o.push({g:He(x),m:n==="fluke"?"skin":"membrane"})}else if(n==="fan"){let m=[],d=Math.round(e.count);for(let x=0;x<d;x++){let b=(x/(d-1)-.5)*e.spread*2,y=_.clone().multiplyScalar(Math.cos(b)).addScaledVector(t.out,Math.sin(b)).addScaledVector(a,s*.2).normalize(),P=g.p.clone().addScaledVector(y,i*(.8+.2*Math.cos(b*1.5)));m.push(Tn([g.p.clone().addScaledVector(_,-i*.1),g.p.clone().lerp(P,.4),g.p.clone().lerp(P,.82),P],[i*.02,i*.055,i*.07,i*.02],i*.005,a,{radial:6,sub:3}))}o.push({g:He(m),m:"hair"})}else if(n==="tuft"){let m=[];for(let d=0;d<14;d++){let x=_.clone().add(le(Math.sin(d*2.4),Math.cos(d*1.7),Math.sin(d*.9)).multiplyScalar(.55)).normalize(),b=g.p.clone().addScaledVector(x,i*.24*e.tip);m.push(Tn([g.p.clone(),g.p.clone().lerp(b,.5),b],[i*.02,i*.035*e.tip,i*.004],i*.012,ri(x,qt),{radial:6,sub:3}))}o.push({g:He(m),m:"hair"})}return o}}function Ia(n){return(e,t)=>{let i=Math.round(e.count),s=[],r=[],o=[],a=[];for(let h=0;h<i;h++){let l=i===1?.5:h/(i-1),u=En(t.part.u+(l-.5)*e.span,-.6,1.6),f=ms(t.frames,u,t.a),p=t.size*Math.pow(Math.sin((l*.84+.08)*zt),.7),g=f.normal,_=f.tangent.clone().multiplyScalar(-1),m=f.pos.clone().addScaledVector(g,-p*.12);if(n==="spikes")s.push(rn(m,f.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean),p*.2,{radial:7}));else if(n==="plates"){let d=f.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean);s.push(Tn([m,m.clone().lerp(d,.45),m.clone().lerp(d,.8),d],[p*.3,p*.42,p*.3,p*.03],p*.05,ri(g,f.tangent.clone().cross(g)),{radial:8}))}else if(n==="mane")for(let d=0;d<3;d++){let x=ri(g,Ln).multiplyScalar((d-1)*.7+(t.rnd()-.5)*.4),b=g.clone().add(x).addScaledVector(_,e.lean).normalize(),y=m.clone().addScaledVector(b,p*.45),P=y.clone().addScaledVector(b,p*.3).addScaledVector(qt,-p*.45*e.droop).addScaledVector(x,p*.3);r.push(Tn([m,y,P],[p*.09,p*.11,p*.01],p*.025,ri(b,_),{radial:6,sub:3}))}else{let d=f.pos.clone().addScaledVector(g,p).addScaledVector(_,p*e.lean);s.push(rn(m,d,p*.035,{radial:5})),o.push(m.clone().lerp(d,.94)),a.push(m)}}let c=[];if(s.length&&c.push({g:He(s),m:"accent"}),n==="mane"&&c.push({g:He(r),m:"hair"}),o.length>1){let h=[],l=[];for(let u=0;u<o.length-1;u++)for(let f=0;f<4;f++){let p=f/4,g=En(t.part.u+((u+p)/(i-1)-.5)*e.span,-.6,1.6);h.push(ms(t.frames,g,t.a).pos),l.push(o[u].clone().lerp(o[u+1],p).lerp(h[h.length-1],.12*Math.sin(p*zt)))}h.push(a[i-1]),l.push(o[i-1]),c.push({g:gs(h,l),m:"membrane"})}return c}}var mh={thick:[.4,2.2,1,"Thickness"],muscle:[.7,1.6,1,"Muscle"],splay:[-.3,1.3,.05,"Spread"],swing:[-1.4,1.4,0,"Swing"],yaw:[-1.6,1.6,0,"Turn"],bend:[-.5,2.5,1,"Bend"],end:[.5,2.2,1,"Foot size"]},Py={...mh,end:[.5,2.2,1,"Hand size"]},Zd=["human","paw","hoof","talon","webbed","stump","point","none"],Iy=["human","claw","pincer","mitt","none"],xs={thick:[.3,2.5,1,"Thickness"],curl:[-1.2,1.2,.2,"Curl"]},lr=(n,e,t,i={})=>({n,cat:"limbs",kind:"world",slot:"leg",rel:1,mirror:!0,P:mh,C:{endType:Zd},D:{endType:t,...i},build:ph(e,La,t)}),fh=(n,e,t={})=>({n,cat:"limbs",kind:"world",slot:"arm",rel:.85,mirror:!0,P:Py,C:{endType:Iy},D:{endType:e,...t},build:ph("arm",qd,e)}),ys=(n,e,t={})=>({n,cat:"eyes",kind:"surface",slot:"eye",size:.55,mirror:!0,P:e==="compound"||e==="beady"?{}:dy,build:uy(e),...t}),Wi={len:[.4,2.5,1,"Length"],curve:[-1.5,2,1,"Curve"]},Pt={eye_round:ys("Round eye","round"),eye_cat:ys("Slit eye","cat"),eye_goat:ys("Bar-pupil eye","goat"),eye_glow:ys("Glowing eye","glow"),eye_beady:ys("Beady eye","beady",{size:.3}),eye_compound:ys("Compound eye","compound",{size:.8}),eye_stalk:ys("Stalk eye","stalk",{size:.45}),brow:{n:"Eyebrow",cat:"eyes",kind:"surface",slot:"brow",size:.6,sink:0,mirror:!0,P:{arch:[-1,2,.6,"Arch"],thick:[.4,2.5,1,"Thickness"]},build:vy},muzzle:{n:"Muzzle",cat:"mouth",kind:"surface",slot:"mouth",size:1.25,P:{len:[.3,2.5,1,"Length"],open:[0,1,.15,"Open"],teeth:[0,3,1,"Teeth"]},build:fy},beak:{n:"Beak",cat:"mouth",kind:"surface",slot:"mouth",size:1.2,P:{len:[.4,3.5,1,"Length"],hook:[0,1.5,.5,"Hook"],open:[0,1,.1,"Open"]},build:py},mandibles:{n:"Mandibles",cat:"mouth",kind:"surface",slot:"mouth",size:1.2,P:{len:[.5,2,1,"Length"],open:[0,1,.3,"Open"]},build:my},maw:{n:"Round maw",cat:"mouth",kind:"surface",slot:"mouth",size:1.1,P:{teeth:[.3,2.5,1,"Teeth"],count:[5,18,11,"Tooth count"]},build:gy},lips:{n:"Lips",cat:"mouth",kind:"surface",slot:"mouth",size:.85,P:{full:[.3,2,1,"Fullness"],smile:[-1,1,.25,"Frown / smile"]},build:_y},trunk:{n:"Trunk",cat:"mouth",kind:"surface",slot:"mouth",size:.9,P:{len:[.4,2,1,"Length"],curl:[-1,1.5,.4,"Curl"]},build:xy},feelers:{n:"Face feelers",cat:"mouth",kind:"surface",slot:"mouth",size:1.1,P:{len:[.4,2.5,1,"Length"],count:[2,8,4,"Count"]},build:yy},nose:{n:"Nose",cat:"mouth",kind:"surface",slot:"nose",size:.55,P:{len:[.4,2.2,1,"Length"],wide:[.5,1.8,1,"Width"]},build:My},whiskers:{n:"Whiskers",cat:"mouth",kind:"surface",slot:"cheek",size:.9,mirror:!0,P:{len:[.4,2,1,"Length"]},build:wy},tusk:{n:"Tusk",cat:"mouth",kind:"surface",slot:"cheek",size:.7,mirror:!0,orn:!0,P:Wi,build:ar("tusk")},beard:{n:"Beard",cat:"mouth",kind:"surface",slot:"chin",size:.9,P:{len:[.3,3,1,"Length"],count:[6,60,26,"Thickness"]},build:Kr({count:26,spread:.7,droop:1,width:.11,capR:.6})},ear_point:{n:"Pointed ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Jr("point")},ear_round:{n:"Round ear",cat:"ears",kind:"surface",slot:"ear",size:.9,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Jr("round")},ear_long:{n:"Long ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Jr("long")},ear_floppy:{n:"Floppy ear",cat:"ears",kind:"surface",slot:"ear",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"],wide:[.4,2,1,"Width"]},build:Jr("floppy")},ear_elf:{n:"Swept ear",cat:"ears",kind:"surface",slot:"earSide",size:.75,mirror:!0,P:{len:[.2,2.5,.6,"Length"],wide:[.4,2,1,"Width"]},build:Jr("elf")},ear_fin:{n:"Fin ear",cat:"ears",kind:"surface",slot:"earSide",size:1,mirror:!0,P:{len:[.4,2.5,1,"Length"]},build:Sy},horn_spike:{n:"Spike horn",cat:"horns",kind:"surface",slot:"horn",size:.7,mirror:!0,orn:!0,P:Wi,build:ar("spike")},horn_curved:{n:"Curved horn",cat:"horns",kind:"surface",slot:"horn",size:.75,mirror:!0,orn:!0,P:Wi,build:ar("curved")},horn_ram:{n:"Ram horn",cat:"horns",kind:"surface",slot:"horn",size:.8,mirror:!0,orn:!0,P:Wi,build:ar("ram")},antler:{n:"Antler",cat:"horns",kind:"surface",slot:"horn",size:.7,mirror:!0,orn:!0,P:{...Wi,tines:[1,6,3,"Tines"]},build:ar("antler")},antenna:{n:"Antenna",cat:"horns",kind:"surface",slot:"horn",size:1.2,mirror:!0,P:Wi,build:Yd(!1)},antenna_feather:{n:"Feathery antenna",cat:"horns",kind:"surface",slot:"horn",size:1.2,mirror:!0,orn:!0,P:Wi,build:Yd(!0)},crest:{n:"Feather crest",cat:"horns",kind:"surface",slot:"top",size:1.3,orn:!0,P:{len:[.3,3,1,"Length"],count:[3,30,9,"Feathers"],spread:[.1,1.4,.45,"Spread"],droop:[0,1,.1,"Droop"]},build:Kr({count:9,spread:.45,droop:.1,width:.12,capR:.3})},hair:{n:"Hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.15,2.5,.7,"Length"],count:[20,200,110,"Thickness"],spread:[.5,1.9,1.45,"Coverage"],droop:[0,1,.85,"Droop"]},build:Kr({count:110,spread:1.45,droop:.85,width:.085,capR:.5,hug:!0})},hair_short:{n:"Cropped hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.1,1,.26,"Length"],count:[40,220,150,"Thickness"],spread:[.5,1.9,1.3,"Coverage"],droop:[0,1,.55,"Droop"]},build:Kr({count:150,spread:1.3,droop:.55,width:.075,capR:.5,hug:!0})},hair_long:{n:"Long hair",cat:"horns",kind:"surface",slot:"top",size:2.3,P:{len:[.8,3.2,1.7,"Length"],count:[40,220,130,"Thickness"],spread:[.5,1.9,1.5,"Coverage"],droop:[0,1,1,"Droop"]},build:Kr({count:130,spread:1.5,droop:1,width:.09,capR:.5,hug:!0})},leg_human:lr("Walker leg","plant","human"),leg_beast:lr("Beast leg","digi","paw"),leg_hoof:lr("Hoofed leg","digi","hoof",{thick:.8}),leg_bird:lr("Taloned leg","digi","talon",{thick:.6,end:1.3}),leg_frog:lr("Webbed leg","plant","webbed",{bend:2,end:1.3}),leg_pillar:lr("Pillar leg","pillar","stump",{thick:1.5}),leg_insect:{n:"Jointed leg",cat:"limbs",kind:"world",slot:"leg",rel:1.25,mirror:!0,radial:!0,P:{...mh,thick:[.3,2.2,.55,"Thickness"]},C:{endType:Zd},D:{endType:"point",thick:.55,splay:0},build:ph("insect",La,"point")},arm_human:fh("Arm with hand","human"),arm_claw:fh("Clawed arm","claw"),arm_pincer:fh("Pincer arm","pincer",{splay:.5,swing:.9}),tentacle:{n:"Tentacle",cat:"limbs",kind:"world",slot:"arm",rel:1.3,mirror:!0,radial:!0,P:{thick:[.4,2.2,1,"Thickness"],curl:[0,2,1,"Wiggle"],splay:[-.6,1.4,.1,"Spread"],yaw:[-1.6,1.6,0,"Turn"],suckers:[0,1,1,"Suckers"]},build:Cy},wing_feather:{n:"Feathered wing",cat:"wings",kind:"world",slot:"wing",rel:1.3,mirror:!0,P:{lift:[-1.2,1.3,.25,"Lift"],sweep:[-.6,1.4,.3,"Sweep"],feathers:[5,16,11,"Feathers"]},build:dh("feather")},wing_bat:{n:"Skin wing",cat:"wings",kind:"world",slot:"wing",rel:1.3,mirror:!0,P:{lift:[-1.2,1.3,.3,"Lift"],sweep:[-.6,1.4,.25,"Sweep"]},build:dh("bat")},wing_insect:{n:"Glass wing",cat:"wings",kind:"world",slot:"wing",rel:1.2,mirror:!0,P:{lift:[-1.2,1.3,.35,"Lift"],sweep:[-.6,1.4,.2,"Sweep"]},build:dh("insect")},fin_dorsal:{n:"Back fin",cat:"wings",kind:"surface",slot:"back",size:1.3,P:{len:[.4,2.5,1,"Height"],sweep:[-.5,2,1,"Sweep"]},build:Ty},fin_side:{n:"Flipper",cat:"wings",kind:"surface",slot:"arm",size:1.5,mirror:!0,P:{len:[.4,2.5,1,"Length"],sweep:[-.5,2,1,"Sweep"]},build:Ay},tail_thin:{n:"Whip tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:xs,build:Ei("thin")},tail_thick:{n:"Heavy tail",cat:"tails",kind:"world",slot:"tail",rel:1.2,P:xs,build:Ei("thick")},tail_fluffy:{n:"Bushy tail",cat:"tails",kind:"world",slot:"tail",rel:.9,P:xs,build:Ei("fluffy")},tail_tuft:{n:"Tufted tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:{...xs,tip:[.4,2.5,1,"Tuft size"]},build:Ei("tuft")},tail_club:{n:"Club tail",cat:"tails",kind:"world",slot:"tail",rel:1,P:{...xs,tip:[.4,2.5,1,"Club size"]},build:Ei("club")},tail_stinger:{n:"Stinger tail",cat:"tails",kind:"world",slot:"tail",rel:1.3,P:{thick:[.3,2.5,1,"Thickness"],curl:[-1.2,1.2,1,"Curl"],tip:[.4,2.5,1,"Stinger size"]},build:Ei("stinger")},tail_fluke:{n:"Fluke tail",cat:"tails",kind:"world",slot:"tail",rel:.9,P:{...xs,tip:[.4,2.5,1,"Fluke size"]},D:{curl:0},build:Ei("fluke")},tail_fish:{n:"Fish tail",cat:"tails",kind:"world",slot:"tail",rel:.8,P:{...xs,tip:[.4,2.5,1,"Fin size"]},D:{curl:0},build:Ei("fishfin")},tail_fan:{n:"Feather fan",cat:"tails",kind:"world",slot:"tail",rel:.8,orn:!0,P:{curl:[-1.2,1.5,.3,"Lift"],count:[3,21,9,"Feathers"],spread:[.1,1.5,.6,"Spread"]},build:Ei("fan")},ridge_spikes:{n:"Spike row",cat:"back",kind:"world",slot:"back",rel:.22,ridge:!0,P:{count:[1,24,9,"Count"],span:[.05,1.6,.6,"Row length"],lean:[-1,1.5,.3,"Lean"]},build:Ia("spikes")},ridge_plates:{n:"Plate row",cat:"back",kind:"world",slot:"back",rel:.3,ridge:!0,P:{count:[1,20,8,"Count"],span:[.05,1.6,.6,"Row length"],lean:[-1,1.5,.1,"Lean"]},build:Ia("plates")},ridge_sail:{n:"Sail",cat:"back",kind:"world",slot:"back",rel:.45,ridge:!0,P:{count:[3,20,9,"Spines"],span:[.05,1.6,.55,"Row length"],lean:[-1,1.5,.2,"Lean"]},build:Ia("sail")},ridge_mane:{n:"Mane",cat:"back",kind:"world",slot:"mane",rel:.4,ridge:!0,orn:!0,P:{count:[3,30,14,"Thickness"],span:[.05,1.6,.3,"Row length"],lean:[-1,1.5,.5,"Sweep"],droop:[0,2,1,"Droop"]},build:Ia("mane")},spike:{n:"Single spike",cat:"back",kind:"surface",slot:"back",size:.5,P:Wi,build:ar("spike")},wrap:{n:"Wrap band",cat:"back",kind:"world",slot:"back",rel:.06,ridge:!0,mirror:!1,P:{span:[.03,1.2,.16,"Width"]},build:by},shell:{n:"Shell",cat:"back",kind:"surface",slot:"back",size:2.4,P:{dome:[.2,1.5,.55,"Dome"],long:[.6,2.2,1.35,"Length"]},build:Ey}},Da=[["eyes","Eyes"],["mouth","Mouth"],["ears","Ears"],["horns","Head"],["limbs","Limbs"],["wings","Wings"],["tails","Tails"],["back","Back"]];function Ua(n){let e=Pt[n],t={};for(let[i,s]of Object.entries(e.P||{}))t[i]=s[2];return Object.assign(t,e.D||{})}var Ht=Math.PI,Xi=n=>({base:"#c9b08a",second:"#6b4a2e",belly:"#efe2c8",bellyAmt:.8,pattern:0,patScale:1,cover:"skin",furLen:.3,furDroop:.3,accent:"#e8e0cc",hair:"#3b2a1e",cloth:"#6b4a2e",membrane:"#c98a8a",eye:"#3f8f4a",...n}),At={humanoid:{name:"Humanoid",blurb:"Upright, two arms, two legs",limbLen:.9,bellyDir:[0,-.2,1],dimorph:"human",capS:.5,nodes:[[.9,-.008,.142,.094,"hips",.95,1.12],[1,-.006,.156,.104,"hips",.98,1.18],[1.1,0,.14,.095,"waist",1.03,1],[1.2,.006,.121,.085,"waist",1,.98],[1.31,.012,.139,.1,"chest",1.04,1],[1.4,.015,.157,.107,"chest",1.1,.96],[1.475,.008,.172,.094,"shoulders",1,1],[1.525,.002,.122,.076,"shoulders",.95,1.05],[1.562,.002,.063,.061,"neck"],[1.62,.01,.056,.058,"neck"],[1.69,.03,.08,.094,"head",1.16,.9],[1.752,.032,.112,.118,"head",1.07,1],[1.82,.024,.124,.13,"head",1,1.05],[1.878,.016,.102,.11,"head"]],slots:{eye:[.882,2.8],brow:[.912,2.8],mouth:[.808,Ht],nose:[.848,Ht],cheek:[.83,2.45],chin:[.78,Ht],ear:[1.35,1.1],earSide:[.86,1.57],horn:[1.4,2.1],top:[1.85,0],leg:[-.4,1.57],arm:[.452,1.57],wing:[.42,.45],tail:[.03,0],back:[.3,0],mane:[.6,0]},look:Xi({base:"#c99573",second:"#8a5a3c",belly:"#d9a888",bellyAmt:.35,hair:"#2c1b12",eye:"#4a7fb5",cloth:"#5a3a24"}),parts:[["leg_human","leg",{size:.9,p:{end:.9}}],["arm_human","arm",{size:.72,p:{splay:.1,end:.82}}],["eye_round","eye",{size:.047,p:{lid:.22,iris:.9}}],["brow","brow",{size:.055}],["nose","nose",{size:.05,p:{len:1.25,wide:.85}}],["lips","mouth",{size:.074,p:{full:.95,smile:.25}}],["ear_elf","earSide",{size:.075,p:{len:.25}}],["hair","top",{size:.3,p:{len:.55,count:140}}],["wrap",[-.36,0],{size:.028,p:{span:1.02}}],["wrap",[.4,0],{size:.02,sexOnly:"f",p:{span:.1}}]]},quadruped:{name:"Quadruped",blurb:"Four legs, tail, muzzle",limbLen:.85,bellyDir:[0,-1,0],dimorph:"std",nodes:[[.95,-.62,.15,.17,"hips"],[.98,-.36,.2,.23,"hips"],[.96,0,.195,.235,"waist"],[.99,.34,.21,.27,"chest"],[1.06,.55,.17,.22,"shoulders"],[1.25,.74,.115,.135,"neck"],[1.39,.9,.125,.13,"head"],[1.38,1.03,.105,.105,"head"]],slots:{eye:[.93,.95],mouth:[1.85,Ht],nose:[1.9,0],cheek:[1.35,1.9],chin:[.95,Ht],ear:[.85,.6],earSide:[.86,1.2],horn:[.9,.3],top:[.86,0],leg:[.3,2.1],arm:[.56,1.5],wing:[.5,.55],tail:[-.8,0],back:[.35,0],mane:[.68,0]},look:Xi({base:"#b9773a",second:"#3a2616",belly:"#f3e6d0",cover:"fur",furLen:.3,pattern:5,hair:"#3a2616",eye:"#d9a020"}),parts:[["leg_beast",[.12,2.1],{size:.84}],["leg_beast",[.53,2.1],{size:.86,p:{bend:.45,thick:.9}}],["muzzle","mouth"],["eye_cat","eye"],["ear_point","ear"],["tail_fluffy","tail",{p:{curl:-.35}}],["whiskers","cheek"]]},avian:{name:"Avian",blurb:"Wings, beak, talons",limbLen:.7,bellyDir:[0,-.8,.6],dimorph:"std",nodes:[[.76,-.32,.07,.07,"hips"],[.8,-.1,.17,.17,"hips"],[.92,.1,.19,.2,"chest"],[1.1,.22,.12,.125,"neck"],[1.3,.26,.075,.075,"neck"],[1.42,.3,.1,.1,"head"],[1.44,.38,.085,.085,"head"]],slots:{eye:[.9,1.25],mouth:[1.85,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.85,Ht],ear:[.86,.6],earSide:[.86,1.2],horn:[.92,.5],top:[.9,0],leg:[.22,2.35],arm:[.36,1.5],wing:[.38,.85],tail:[-.85,0],back:[.25,0],mane:[.55,0]},look:Xi({base:"#2f7fc2",second:"#f2c230",belly:"#f4f0e6",cover:"fur",furLen:.12,pattern:5,accent:"#e8a020",hair:"#1f4f9a",eye:"#e8a020"}),parts:[["leg_bird","leg",{size:.74}],["wing_feather","wing",{size:.95}],["beak","mouth"],["eye_round","eye",{p:{lid:.15}}],["crest","top",{sexOnly:null}],["tail_fan","tail",{size:.6}]]},insectoid:{name:"Insectoid",blurb:"Six legs, antennae, chitin",limbLen:.72,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[.5,-.78,.1,.1,"abdomen"],[.56,-.5,.26,.24,"abdomen"],[.53,-.2,.2,.18,"abdomen"],[.5,-.02,.07,.07,"waist"],[.55,.15,.16,.15,"chest"],[.56,.38,.15,.14,"chest"],[.56,.5,.06,.06,"neck"],[.58,.62,.14,.13,"head"],[.56,.74,.1,.1,"head"]],slots:{eye:[.93,1.1],mouth:[1.8,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Ht],ear:[.9,.8],earSide:[.9,1.3],horn:[.97,.45],top:[.9,0],leg:[.56,2],arm:[.64,1.7],wing:[.56,.5],tail:[-.9,0],back:[.15,0],mane:[.55,0]},look:Xi({base:"#2f6b3a",second:"#12281a",belly:"#9fb86a",bellyAmt:.5,cover:"chitin",pattern:7,accent:"#1c1a14",membrane:"#bfe8e0",eye:"#b03020"}),parts:[["leg_insect",[.47,2],{size:.72,p:{yaw:-.7}}],["leg_insect",[.56,2],{size:.68,p:{yaw:0}}],["leg_insect",[.64,2],{size:.7,p:{yaw:.75}}],["eye_compound","eye"],["mandibles","mouth",{size:.13}],["antenna","horn"],["wing_insect","wing",{size:.95}]]},arachnid:{name:"Arachnid",blurb:"Eight legs, many eyes",limbLen:1,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[.62,-.62,.14,.14,"abdomen"],[.7,-.36,.32,.3,"abdomen"],[.6,-.08,.2,.18,"abdomen"],[.5,.05,.08,.07,"waist"],[.5,.25,.22,.15,"chest"],[.5,.45,.17,.12,"head"],[.48,.55,.1,.08,"head"]],slots:{eye:[1.3,.6],mouth:[1.85,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Ht],ear:[.9,.8],earSide:[.9,1.3],horn:[.9,.45],top:[.85,0],leg:[.7,1.9],arm:[.85,1.7],wing:[.66,.5],tail:[-.9,0],back:[.18,0],mane:[.5,0]},look:Xi({base:"#3a2a22",second:"#c8501c",belly:"#5a463a",bellyAmt:.4,cover:"fur",furLen:.1,pattern:7,accent:"#14100e",eye:"#a01818"}),parts:[["leg_insect",[.6,1.9],{size:1,p:{yaw:-1}}],["leg_insect",[.66,1.9],{size:.9,p:{yaw:-.35}}],["leg_insect",[.72,1.9],{size:.9,p:{yaw:.3}}],["leg_insect",[.78,1.9],{size:1.05,p:{yaw:.95}}],["eye_beady",[1.35,.5],{size:.045}],["eye_beady",[1.3,1.15],{size:.03}],["eye_beady",[.97,.5],{size:.032}],["eye_beady",[.95,1],{size:.026}],["mandibles","mouth",{size:.12}]]},cephalopod:{name:"Cephalopod",blurb:"Soft mantle, eight tentacles",limbLen:1.1,bellyDir:[0,-.5,-.8],dimorph:"reverse",nodes:[[1.78,-.52,.07,.07,"abdomen"],[1.56,-.38,.24,.22,"abdomen"],[1.26,-.2,.3,.28,"abdomen"],[.97,-.05,.215,.215,"waist"],[.77,.02,.225,.215,"head"],[.62,.05,.19,.19,"head"]],slots:{eye:[.86,1.4],mouth:[2,0],nose:[.8,0],cheek:[.9,.8],chin:[1.2,0],ear:[.7,1.2],earSide:[.7,1.5],horn:[.72,.6],top:[.3,Ht],leg:[1.45,1.57],arm:[1.45,1],wing:[.3,1.57],tail:[-.9,0],back:[.3,Ht],mane:[.4,Ht]},look:Xi({base:"#c4472e",second:"#f0b090",belly:"#f2d6c4",bellyAmt:.7,cover:"slime",pattern:2,patScale:1.6,membrane:"#f2c4b0",eye:"#e0b030"}),parts:[["tentacle",[1.45,.38],{size:1.15}],["tentacle",[1.45,1.15],{size:1.05}],["tentacle",[1.45,1.95],{size:1.05}],["tentacle",[1.45,2.75],{size:1.15}],["eye_goat","eye",{p:{lid:.2}}]]},serpent:{name:"Serpent",blurb:"Long limbless body",limbLen:.5,bellyDir:[0,-1,0],dimorph:"std",nodes:[[.05,-1.75,.025,.025,"tail"],[.09,-1.35,.07,.07,"tail"],[.11,-.9,.1,.1,"hips"],[.12,-.4,.115,.115,"waist"],[.13,.1,.12,.12,"waist"],[.22,.5,.115,.115,"chest"],[.56,.74,.105,.105,"neck"],[.9,.8,.095,.1,"neck"],[1.09,.93,.125,.1,"head"],[1.07,1.1,.1,.075,"head"]],slots:{eye:[.96,.95],mouth:[1.8,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.97,Ht],ear:[.92,.7],earSide:[.92,1.3],horn:[.95,.45],top:[.93,0],leg:[.45,2.1],arm:[.72,1.7],wing:[.68,.6],tail:[-.9,0],back:[.5,0],mane:[.8,0]},look:Xi({base:"#4f8a3a",second:"#1f3a1c",belly:"#e6dfa0",cover:"scales",pattern:1,eye:"#e8c020"}),parts:[["muzzle","mouth",{size:.13,p:{len:.7,teeth:1.8,open:.35}}],["eye_cat","eye",{size:.05}],["ridge_spikes",[.6,0],{size:.07,p:{count:16,span:.7}}]]},aquatic:{name:"Aquatic",blurb:"Fins, flippers, fish tail",limbLen:.5,bellyDir:[0,-1,0],dimorph:"reverse",nodes:[[1,-1,.03,.07,"tail"],[1,-.6,.08,.15,"tail"],[1,-.1,.17,.26,"abdomen"],[1.02,.35,.19,.28,"chest"],[1,.7,.15,.2,"head"],[.98,.95,.09,.11,"head"]],slots:{eye:[.9,1.15],mouth:[1.75,Ht],nose:[1.8,0],cheek:[1.2,1.9],chin:[.95,Ht],ear:[.85,.7],earSide:[.85,1.3],horn:[.9,.45],top:[.85,0],leg:[.4,2.3],arm:[.64,2],wing:[.5,.6],tail:[-.8,0],back:[.52,0],mane:[.7,0]},look:Xi({base:"#3a7f9a",second:"#1c3f5a",belly:"#eef2f0",cover:"scales",pattern:5,membrane:"#7fc4d0",eye:"#e8e0a0"}),parts:[["muzzle","mouth",{size:.13,p:{len:.45,teeth:1.6,open:.3}}],["eye_round","eye",{size:.06,p:{lid:0}}],["fin_dorsal","back",{size:.32}],["fin_side","arm",{size:.3}],["tail_fish","tail",{size:.5,p:{tip:1.3}}]]}};var Ly=1,Dy=()=>"p"+Ly+++Math.random().toString(36).slice(2,6),Uy={std:{m:{roles:{shoulders:[.16,.08],chest:[.1,.05],neck:[.2,.16],waist:[.04,.02],head:[.03,.03]},limb:.15,orn:.3,all:.03},f:{roles:{shoulders:[-.1,-.05],chest:[-.04,.07],waist:[-.14,-.08],hips:[.13,.07],neck:[-.13,-.1]},limb:-.1,orn:-.4,all:-.02}},human:{m:{roles:{shoulders:[.14,.06],chest:[.08,.02],neck:[.2,.16],waist:[.06,.04],head:[.03,.02]},front:{chest:[-.04,.04],waist:[.03,0]},limb:.14,orn:.3,all:.03},f:{roles:{shoulders:[-.09,-.04],chest:[-.05,0],waist:[-.13,-.06],hips:[.1,.04],neck:[-.12,-.1]},front:{chest:[.24,0],hips:[0,.12],waist:[-.04,0]},limb:-.1,orn:-.4,all:-.02}},reverse:{m:{roles:{abdomen:[-.12,-.12],head:[.05,.05]},limb:-.05,orn:.35,all:-.05},f:{roles:{abdomen:[.2,.18]},limb:.05,orn:-.3,all:.04}}};function Jd(n){let e=Uy[At[n.type].dimorph][n.sex],t=n.dimorph;return{roles:e.roles,front:e.front,k:t,limb:1+e.limb*t,orn:1+e.orn*t,all:1+e.all*t}}function vs(n){let e=At[n],t={v:1,name:"New "+e.name,type:n,sex:"f",dimorph:.7,bulk:1,stretch:1,nodes:e.nodes.map(s=>{var r,o;return{y:s[0],z:s[1],rx:s[2],ry:s[3],role:s[4],f:(r=s[5])!=null?r:1,b:(o=s[6])!=null?o:1}}),look:{...e.look},parts:[]},i=Na(t,{sexless:!0}).userData.frames;for(let[s,r,o]of e.parts)oi(t,s,i,typeof r=="string"?e.slots[r]:r,o);return t}function oi(n,e,t,i,s={}){let r=Pt[e],o=At[n.type],[a,c]=i||o.slots[r.slot]||(r.slot==="brow"?[o.slots.eye[0]+.035,o.slots.eye[1]]:o.slots.back);for(;!i&&n.parts.some(u=>Math.abs(u.u-a)<.02&&Math.abs(u.a-c)<.05&&Pt[u.kind].cat===r.cat);)a-=.07;let h=ms(t,a,c),l={id:Dy(),kind:e,u:a,a:c,mirror:!!r.mirror,rot:0,tilt:0,sexOnly:null,size:r.kind==="surface"?r.size*h.r:r.rel*(r.ridge?Math.max(h.r,.08)*4.5:o.limbLen),p:Ua(e)};s.p&&Object.assign(l.p,s.p);for(let u of["size","rot","tilt","sexOnly","mirror"])s[u]!==void 0&&(l[u]=s[u]);return n.parts.push(l),l}function Na(n,e={}){var o;let t=Jd(n),i=n.nodes.reduce((a,c)=>a+c.y,0)/n.nodes.length,s=n.nodes.reduce((a,c)=>a+c.z,0)/n.nodes.length,r=n.nodes.map(a=>{var l,u;let c=!e.sexless&&t.roles[a.role]||[0,0],h=!e.sexless&&t.front&&t.front[a.role]||[0,0];return{p:le(0,i+(a.y-i)*n.stretch,s+(a.z-s)*n.stretch),rx:a.rx*n.bulk*(e.sexless?1:t.all)*(1+c[0]*t.k),ry:a.ry*n.bulk*(e.sexless?1:t.all)*(1+c[1]*t.k),f:((l=a.f)!=null?l:1)*(1+h[0]*t.k),b:((u=a.b)!=null?u:1)*(1+h[1]*t.k)}});return sn(r,{radial:52,sub:10,capRings:7,side:Ln.clone(),frames:!0,capStart:(o=At[n.type].capS)!=null?o:1})}function $d(n,e,t){let i=new Map;for(let r of n){if(!r||!r.g)continue;let o=typeof r.m=="string"?e[r.m]:r.m,a=o.uuid+(r.fur||0);i.has(a)||i.set(a,{mat:o,fur:r.fur,gs:[]}),i.get(a).gs.push(r.g)}let s=[];for(let r of i.values()){let o=new Ne(He(r.gs),r.mat);o.userData.fur=r.mat===e.skin?r.fur===!0?1:r.fur||0:0,o.castShadow=r.mat!==e.glass,o.receiveShadow=r.mat===e.skin,s.push(o)}return s}function _h(n){let e=(n.a%(2*Math.PI)+2*Math.PI)%(2*Math.PI);return n.mirror?(e>Math.PI&&(e=2*Math.PI-e),e<.1?{a:0,mirrored:!1}:e>Math.PI-.1?{a:Math.PI,mirrored:!1}:{a:e,mirrored:!0}):{a:e,mirrored:!1}}function gh(n,e){let t=n.geometry;if(!e){t.setAttribute("rp",t.attributes.position),t.setAttribute("rn",t.attributes.normal);return}let i=t.attributes.position.clone().applyMatrix4(e),s=t.attributes.normal.clone().applyNormalMatrix(new ze().getNormalMatrix(e));t.setAttribute("rp",i),t.setAttribute("rn",s)}function Kd(n,e,t,i,s,r){let o=Pt[e.kind],a=Jd(n),c=new wt;if(c.userData.partId=e.id,e.sexOnly&&e.sexOnly!==n.sex)return c;let{a:h,mirrored:l}=_h(e),u=ms(t,e.u,h),f=[...e.id].reduce((x,b)=>x*31+b.charCodeAt(0)|0,7),p={M:i,look:n.look,female:n.sex==="f",k:a.k,limbMul:a.limb,rnd:$r(f),seed:f%100/16,part:e,frames:t,a:h,r:u.r,normal:u.normal},g=o.orn?a.orn:1,_=s?[]:null;p.anchors=_;let m=new wt;if(c.userData.anchor=u.pos.clone(),o.kind==="surface"){let x=u.normal,b=Math.abs(x.y)<.9?qt.clone():x.y>0?or.clone().multiplyScalar(-1):or.clone(),y=b.addScaledVector(x,-b.dot(x)).normalize(),P=y.clone().cross(x),T=new Wt().setFromRotationMatrix(new Xe().makeBasis(P,y,x));T.multiply(new Wt().setFromAxisAngle(or,e.rot)).multiply(new Wt().setFromAxisAngle(Ln,-e.tilt));let A=T.clone().invert();p.down=le(0,-1,0).applyQuaternion(A),p.up=le(0,1,0).applyQuaternion(A),p.fwd=le(0,0,1).applyQuaternion(A);for(let C of $d(o.build(e.p,p),i))m.add(C);m.quaternion.copy(T),m.position.copy(u.pos),m.scale.setScalar(e.size*g),m.updateMatrix();for(let C of m.children)C.material===i.skin&&gh(C,m.matrix)}else{p.size=e.size*g;let x=e.p.yaw||0,b=Ln.clone();o.radial&&(b=le(u.normal.x,0,u.normal.z),b.lengthSq()<.01&&(b=Ln.clone()),b.normalize()),b.applyAxisAngle(qt,-x),p.out=b,p.fwd=b.clone().cross(qt).normalize(),p.root=o.ridge?u.pos:u.pos.clone().addScaledVector(u.normal,-u.r*(o.cat==="limbs"?.4:.25));for(let y of $d(o.build(e.p,p),i))m.add(y),y.material===i.skin&&gh(y);o.ridge||(m.userData.joint={pivot:p.root.clone(),kind:o.cat==="limbs"?e.kind.startsWith("leg")?"leg":e.kind==="tentacle"?"tentacle":"arm":o.cat==="wings"?"wing":"tail",partId:e.id,side:1})}c.add(m);let d=null;if(l){let x=new wt;x.scale.x=-1,d=m.clone(),m.userData.joint&&(d.userData.joint={...m.userData.joint,side:-1}),x.add(d),c.add(x)}if(r&&m.userData.joint)for(let x of[m,d])x&&r.n<Ra&&(x.userData.joint.bone=r.n++);if(_)for(let x of _)s.push({...x,node:m}),d&&s.push({...x,node:d});return c}function cr(n,e,t={}){let i=new wt,s=Na(n),r=s.userData.frames,o=new Ne(s,e.skin),a=t.animated?{n:1}:null;o.castShadow=o.receiveShadow=!0,gh(o),o.userData.fur=1,o.userData.partId="body",i.add(o);let c={group:i,body:o,frames:r,parts:new Map,shells:new wt,data:n,M:e};for(let h of n.parts){let l;try{l=Kd(n,h,r,e,t.anchors,a)}catch(u){console.error("part failed",h.kind,u),l=new wt,l.userData.partId=h.id}c.parts.set(h.id,l),i.add(l)}return i.add(c.shells),jr(c),c}function ka(n,e){let t=n.parts.get(e.id);t&&(n.group.remove(t),Yi(t));let i=Kd(n.data,e,n.frames,n.M);return n.parts.set(e.id,i),n.group.add(i),i}function jr(n,e){for(let s of[...n.shells.children])n.shells.remove(s);if(n.shellGeo&&(n.shellGeo.dispose(),n.shellGeo=null),n.data.look.cover!=="fur")return;n.group.updateMatrixWorld(!0);let t=[],i=n.group.matrixWorld.clone().invert();if(n.group.traverse(s=>{if(!s.isMesh||!s.userData.fur)return;let r=s,o=!1;for(;r;)e&&r.userData.partId===e&&(o=!0),r=r.parent;if(o)return;let a=0;for(let l=s.parent;l&&l!==n.group;l=l.parent)l.userData.joint&&l.userData.joint.bone&&(a=l.userData.joint.bone);let c=i.clone().multiply(s.matrixWorld),h=s.geometry.clone();h.deleteAttribute("rp"),h.deleteAttribute("rn"),h.applyMatrix4(c),c.determinant()<0&&Wd(h),h.setAttribute("bone",new xt(new Float32Array(h.attributes.position.count).fill(a),1)),h.setAttribute("fur",new xt(new Float32Array(h.attributes.position.count).fill(s.userData.fur),1)),t.push(h)}),!!t.length){n.shellGeo=He(t,["fur","bone"]),n.shellGeo.setAttribute("rp",n.shellGeo.attributes.position),n.shellGeo.setAttribute("rn",n.shellGeo.attributes.normal),t.forEach(s=>s!==n.shellGeo&&s.dispose());for(let s=0;s<Aa;s++){let r=new Ne(n.shellGeo,n.M.shells[s]);r.frustumCulled=!1,r.raycast=()=>{},n.shells.add(r)}}}function Yi(n){n.traverse(e=>{e.isMesh&&e.geometry.dispose()})}function Qr(n){let e=new wn;return n.group.updateMatrixWorld(!0),n.group.traverse(t=>{t.isMesh&&t.parent!==n.shells&&(t.geometry.computeBoundingBox(),e.union(t.geometry.boundingBox.clone().applyMatrix4(t.matrixWorld)))}),e}var jd={muzzle:n=>{var e;return 5+2.5*((e=n.teeth)!=null?e:1)},beak:n=>{var e;return 6+1.5*((e=n.hook)!=null?e:.5)},mandibles:()=>7,maw:n=>{var e;return 4+2.5*((e=n.teeth)!=null?e:1)},trunk:()=>3,feelers:()=>2,lips:()=>1,tusk:()=>5,horn_spike:()=>4,horn_curved:()=>5,horn_ram:()=>6,antler:()=>5,tentacle:()=>3,tail_club:()=>7,tail_stinger:()=>5,tail_thick:()=>3,spike:()=>2},Ny={claw:4,talon:4,pincer:6,paw:2.5,hoof:3,human:3,point:2.5,webbed:2,stump:2.5,mitt:1.5,none:0},ky=[1,.6,.4,.3,.2,.15],Ti=(n,e,t)=>Math.min(t,Math.max(e,n));function hr(n){var T,A;let e=0;for(let C=0;C<n.nodes.length-1;C++){let S=n.nodes[C],M=n.nodes[C+1];e+=Math.hypot(S.y-M.y,S.z-M.z)*Math.PI*((S.rx+M.rx)/2)*((S.ry+M.ry)/2)}let t=Math.cbrt(e*n.bulk*n.bulk),i=n.parts.filter(C=>!C.sexOnly||C.sexOnly===n.sex),s=C=>C.mirror&&Math.abs(Math.sin(C.a))>.1?1.25:1,r=[],o=0,a=0,c=0,h=0,l=0,u=0,f=0,p=0,g=0,_=!1,m=!1,d=!1,x=!1,b=0;for(let C of i){let S=C.kind;jd[S]&&r.push(jd[S](C.p)*s(C)),(C.p.endType!==void 0||S.startsWith("leg_")||S.startsWith("arm_"))&&r.push(((T=Ny[C.p.endType])!=null?T:2)*s(C));let M=s(C)>1?2:1;S.startsWith("leg_")&&(o++,g+=M),S.startsWith("arm_")&&(p+=M),S==="tentacle"&&(p+=M,b+=M),S.startsWith("tail_")&&(_=!0),(S.startsWith("horn_")||S==="antler"||S==="tusk")&&(m=!0),["muzzle","beak","mandibles","maw","trunk","feelers","lips"].includes(S)&&(d=!0),["claw","talon","paw","pincer"].includes(C.p.endType)&&(x=!0),S==="feelers"&&(l+=1),S.startsWith("wing_")&&a++,S.startsWith("eye_")&&(c+=s(C)>1?2:1),S==="ridge_spikes"&&(h+=.12),S==="spike"&&(h+=.04),S==="tail_stinger"&&(l+=3),S==="mandibles"&&(l+=1),S==="shell"&&(u+=.15,f+=25),S==="ridge_plates"&&(u+=.08,f+=10)}r.sort((C,S)=>S-C);let y=7;r.forEach((C,S)=>{var M;y+=C*((M=ky[S])!=null?M:.1)}),y*=.75+.6*t,u+=(A={scales:.08,chitin:.12,fur:.02+.05*n.look.furLen,slime:.02,skin:0}[n.look.cover])!=null?A:0;let P=o===0?.9:o===1?1:o===2?1.08:1.14;return a&&(P+=.12),P-=.3*(t-.45),u>.2&&(P-=.06),P=Ti(P,.6,1.5),{hp:Math.round(80+210*t+f*1.5),atk:Math.round(y*10)/10,def:Ti(u,0,.45),spd:Math.round(P*100)/100,dodge:Ti(.04+(P-1)*.2+(n.look.cover==="slime"?.05:0)+(a?.03:0),0,.3),crit:Ti(.04+.02*c,.04,.16),miss:c===0?.25:.04,thorns:Ti(h,0,.3),venom:l,wings:a>0,eyes:c,hands:Math.min(p,8),slots:Math.min(p,8)||1,abilitySlots:n.type==="humanoid"?3:2,legs:g,tail:_,horns:m,mouth:d,claws:x,tentacles:b,armoured:u>=.12,big:t>.56,small:t<.42,serpent:n.type==="serpent",type:n.type}}function Qd(n){let e=[];return n.venom&&e.push("Venom"),n.thorns>0&&e.push("Spiny"),n.def>=.15&&e.push("Armoured"),n.wings&&e.push("Winged"),n.spd>=1.12&&e.push("Quick"),n.eyes===0?e.push("Blind"):n.crit>=.12&&e.push("Keen-eyed"),e}function ef(n){let e=n===9?1.3:1;return{hp:(Fa.hp0+Fa.hp1*n)*e,atk:(Fa.atk0+Fa.atk1*n)*(e>1?1.12:1)}}var Fa={hp0:.34,hp1:.099,atk0:.4,atk1:.091},Fy=["hpP","atkP","atkF","spdP","crit","critD","dodge","def","pierce","lifesteal","thorns","regen","bleedC","poisonC","poisonD","burnC","stunC","stunDur","dbl","ramp","lowP","firstX","giantP","vsBleedP","perStatusCrit","perStatusDmg","critBleed","critCdr","execP","riposte","blockHeal","killHeal","killHp","secondWind","hemo","festerP","shieldP","opener","guardCdr","perWeaponSpd","perLegAtk","perEyeCrit","thornsBleed","dodgeCrit","weapons"];function vh(n,e={}){let t={};for(let a of Fy)t[a]=e.mods&&e.mods[a]||0;let i=e.mul||{hp:1,atk:1},s=e.boost||{hp:1,atk:1},r=Math.round(n.hp*(1+t.hpP)*i.hp*s.hp*(1+(e.bonusHp||0))),o=Ti(n.spd*(1+t.spdP+t.perWeaponSpd*t.weapons),.5,2.4);return{s:n,m:t,max:r,hp:r,shield:Math.round(r*t.shieldP),atk:(n.atk+t.atkF)*(1+t.atkP+t.perLegAtk*n.legs)*i.atk*s.atk,crit:n.crit+t.crit+t.perEyeCrit*n.eyes,dodge:Ti(n.dodge+t.dodge,0,.45),def:Ti(n.def+t.def,0,.6),thorns:n.thorns+t.thorns,poisonC:(n.venom?.35:0)+t.poisonC,poisonD:Math.max(n.venom,t.poisonC>0?3:0)+t.poisonD,every:1.75/o,t:.9+.5/o,power:!1,powerCd:2,guard:0,guardCd:0,guardEvery:Math.max(2.5,4.5-t.guardCdr),st:{bleed:0,bleedT:0,bleedD:1,poison:0,poisonD:0,burn:0,burnD:0,stun:0,immune:0,weak:0,slow:0,blind:0},buff:{evade:0,shell:0,frenzy:0},tick:0,fury:0,first:!0,wind:t.secondWind>0,nextCrit:!1,opened:!(t.opener>0),abil:(e.abilities||[]).map(a=>({id:a.id,lvl:a.lvl,cd:3}))}}function bh(n){return n.powerCd>0||n.hp<=0?!1:(n.power=!0,n.powerCd=7,!0)}function Mh(n){return n.guardCd>0||n.hp<=0?!1:(n.guard=.9,n.guardCd=n.guardEvery,!0)}function xh(n,e){if(n.shield>0){let t=Math.min(n.shield,e);n.shield-=t,e-=t}n.hp-=e}function eo(n,e){n.hp=Math.min(n.max,n.hp+e)}function Oa(n,e,t){n.st.bleed=Math.min(12,n.st.bleed+e),n.st.bleedT=5,n.st.bleedD=Math.max(1,t.atk*.05)*(1+t.m.festerP)}function yh(n,e){return n.st.immune>0?!1:(n.st.stun=e,n.st.immune=e+3,n.t+=e,!0)}var Oy=n=>(n.st.bleed>0)+(n.st.poison>0)+(n.st.burn>0)+(n.st.stun>0);function Ba(n,e,t,i,s={}){let r=n[e],o=n[1-e],a=r.m,c=o.m,h={type:"hit",by:e,dmg:0,power:!!s.power,name:s.name};if(!s.sure&&(i()<(r.s.miss+(r.st.blind>0?.5:0))*(s.power?.5:1)||o.buff.evade>0||i()<o.dodge))return h.miss=!0,c.dodgeCrit&&(o.nextCrit=!0),h;let l=Oy(o),u=r.atk*t*(.85+.3*i()),f=1+r.fury*a.ramp+(r.hp<r.max*.4?a.lowP:0)+(o.st.bleed>0?a.vsBleedP:0)+l*a.perStatusDmg+(o.max>r.max?a.giantP:0)+(o.hp<o.max*.3?a.execP:0);if(r.first&&(f+=a.firstX,r.first=!1),u*=f*(r.st.weak>0?.7:1)*(r.st.burn>0?.9:1),(r.nextCrit||i()<r.crit+l*a.perStatusCrit)&&(u*=1.6+a.critD,h.crit=!0,r.nextCrit=!1,a.critBleed&&Oa(o,a.critBleed,r),a.critCdr))for(let p of r.abil)p.cd=Math.max(0,p.cd-a.critCdr);return u*=(1-Math.max(0,o.def-a.pierce))*(o.buff.shell>0?.3:1),o.guard>0?(u*=.2,h.blocked=!0,o.guard=0,r.t+=.6,c.riposte&&(h.riposte=Math.max(1,Math.round(o.atk*c.riposte)),xh(r,h.riposte)),c.blockHeal&&eo(o,o.max*c.blockHeal)):(o.thorns>0&&!s.ranged&&(h.thorns=Math.max(1,Math.round(u*o.thorns*(o.buff.shell>0?2:1))),xh(r,h.thorns),c.thornsBleed&&Oa(r,1,o)),i()<a.bleedC&&(Oa(o,1,r),h.bleed=!0),i()<r.poisonC&&(o.st.poison=4,o.st.poisonD=r.poisonD*(1+a.festerP),h.venom=!0),i()<a.burnC&&(o.st.burn=3,o.st.burnD=Math.max(1,u*.14)*(1+a.festerP),h.burn=!0),i()<a.stunC&&yh(o,.7*(1+a.stunDur))&&(h.stun=!0),a.lifesteal&&eo(r,u*a.lifesteal)),h.dmg=Math.max(1,Math.round(u)),xh(o,h.dmg),r.fury++,h}function Sh(n,e,t,i,s){let r=n[e],o=n[1-e],a=r.abil[t];if(!a||a.cd>0||r.hp<=0||o.hp<=0||r.st.stun>0)return!1;let c=a.lvl,h=u=>s.push({type:"cast",by:e,name:u}),l=(u,f,p)=>{let g=Ba(n,e,u,i,{name:f,...p});return g.ability=!0,s.push(g),g};switch(a.id){case"pounce":{let u=l(1.5+.3*c,"Pounce");!u.miss&&!u.blocked&&yh(o,.8);break}case"roar":o.st.weak=4+c,h("Roar");break;case"lick":eo(r,r.max*(.11+.04*c)),s.push({type:"heal",on:e,name:"Lick Wounds"});break;case"spit":o.st.poison=6,o.st.poisonD=Math.max(o.st.poisonD,(4+2*c+r.m.poisonD)*(1+r.m.festerP)),h("Venom Spit");break;case"dive":r.buff.evade=1.5+.5*c,r.nextCrit=!0,h("Dive");break;case"constrict":{l(.8+.3*c,"Constrict",{sure:!0}).blocked||yh(o,(1.4+.3*c)*(1+r.m.stunDur));break}case"web":o.st.slow=4+c,h("Web");break;case"ink":o.st.blind=3+c,h("Ink Cloud");break;case"shellup":r.buff.shell=2+c,h("Shell Up");break;case"sweep":{l(1+.25*c,"Tail Sweep").miss||(o.t+=1.2);break}case"gore":{let u=l(1.2+.2*c,"Gore");!u.miss&&!u.blocked&&Oa(o,2+c,r);break}case"frenzy":r.buff.frenzy=4,r.frenzyX=1.5+.2*c,h("Frenzy");break;case"hurl":l(1.8+.4*c,"Hurl",{sure:!0,ranged:!0});break;case"rend":l(Math.max(.3,(.35+.1*c)*o.st.bleed),"Rend");break;case"breath":{let u=l(.8+.2*c,"Fire Breath",{sure:!0,ranged:!0});o.st.burn=5,o.st.burnD=Math.max(o.st.burnD,Math.max(2,u.dmg*.2)*(1+r.m.festerP));break}default:return!1}return a.cd=wh[a.id]||10,!0}var wh={pounce:9,roar:12,lick:14,spit:10,dive:11,constrict:12,web:12,ink:12,shellup:13,sweep:8,gore:10,frenzy:13,hurl:9,rend:9,breath:11};function Eh(n,e,t,i,s,r){let o=n[e],a=n[1-e];o.powerCd<=0&&i()<t*.6&&bh(o),o.guardCd<=0&&a.t<.3&&i()<t*8*s&&Mh(o);for(let c=0;c<o.abil.length;c++)o.abil[c].cd<=0&&i()<t*1.2&&!(o.abil[c].id==="lick"&&o.hp>o.max*.75)&&!(o.abil[c].id==="rend"&&a.st.bleed<3)&&Sh(n,e,c,i,r)}function tf(n,e,t,i){for(let s=0;s<2;s++){let r=n[s],o=n[1-s],a=r.st;if(r.hp<=0||o.hp<=0)continue;if(!r.opened){r.opened=!0;let h=Ba(n,s,r.m.opener,t,{sure:!0,ranged:!0,name:"Sling"});h.ability=!0,i.push(h)}r.powerCd=Math.max(0,r.powerCd-e),r.guardCd=Math.max(0,r.guardCd-e),r.guard=Math.max(0,r.guard-e);for(let h of r.abil)h.cd=Math.max(0,h.cd-e);for(let h of["stun","immune","weak","slow","blind","poison","burn"])a[h]=Math.max(0,a[h]-e);for(let h of["evade","shell","frenzy"])r.buff[h]=Math.max(0,r.buff[h]-e);if(a.bleed>0&&(a.bleedT-=e,a.bleedT<=0&&(a.bleed=0)),r.m.regen&&eo(r,r.max*r.m.regen*e),r.tick+=e,r.tick>=1){r.tick-=1;let h=0;a.bleed>0&&(h+=a.bleed*a.bleedD,o.m.hemo&&eo(o,o.m.hemo*a.bleed)),a.poison>0&&(h+=a.poisonD),a.burn>0&&(h+=a.burnD),h>0&&(h=Math.max(1,Math.round(h)),r.hp-=h,i.push({type:"dot",on:s,dmg:h,kind:a.burn>0?"burn":a.poison>0?"venom":"bleed"}))}if(a.stun>0||(r.t-=e*(r.buff.frenzy>0?r.frenzyX:1)*(a.slow>0?.5:1),r.t>0||r.hp<=0))continue;r.t=r.every*(.9+.2*t());let c=r.power;if(r.power=!1,i.push(Ba(n,s,c?2.1:1,t,{power:c})),o.hp>0&&r.hp>0&&t()<r.m.dbl){let h=Ba(n,s,.7,t,{});h.extra=!0,i.push(h)}}for(let s=0;s<2;s++){let r=n[s];r.hp<=0&&r.wind&&(r.wind=!1,r.hp=Math.max(1,Math.round(r.max*r.m.secondWind)),i.push({type:"heal",on:s,name:"Second Wind"}))}return n[0].hp<=0&&n[1].hp<=0&&(n[0].hp=1),n[1].hp<=0?0:n[0].hp<=0?1:-1}function nf(n,e){return 1e3+Math.round(500*Ti(n/e,0,1))}var we=n=>Math.round(n*100)+"%",Vt=n=>(Math.round(n*10)/10).toString(),Dn=(n,e,t,i,s,r,o,a=1,c)=>({id:n,name:e,icon:t,tags:i,cost:s,mods:r,text:o,hands:a,req:c,cat:"weapon"}),Ye=(n,e,t,i,s,r,o,a,c)=>({id:n,name:e,icon:t,tags:i,cost:s,mods:r,text:o,req:a,reqText:c,cat:"relic"}),on=(n,e,t,i,s,r,o,a,c)=>({id:n,name:e,icon:t,tags:i,cost:s,cd:r,text:o,req:a,reqText:c,cat:"ability"}),ur=[Dn("club","Bone Club","\u{1F9B4}",["stun","fury"],0,n=>({atkF:3*n,stunC:.08*n}),n=>`+${Vt(3*n)} attack. ${we(.08*n)} chance to stun.`),Dn("cleaver","Notched Cleaver","\u{1FA93}",["bleed"],0,n=>({atkF:2.5*n,bleedC:.3*n}),n=>`+${Vt(2.5*n)} attack. ${we(.3*n)} chance to cause bleeding.`),Dn("fang","Fang Dagger","\u{1F5E1}\uFE0F",["poison","speed"],0,n=>({atkF:1.5*n,poisonC:.3*n,spdP:.05*n}),n=>`+${Vt(1.5*n)} attack, +${we(.05*n)} speed. ${we(.3*n)} chance to poison.`),Dn("mace","Thorn Mace","\u{1F335}",["thorns"],0,n=>({atkF:2*n,thorns:.08*n}),n=>`+${Vt(2*n)} attack. Attackers take ${we(.08*n)} of their damage back.`),Dn("buckler","Spiked Buckler","\u{1F6E1}\uFE0F",["guard","thorns"],0,n=>({def:.06*n,riposte:.5*n,guardCdr:.5}),n=>`+${we(.06*n)} armour. Guard recharges faster and a block hits back for ${we(.5*n)} attack.`),Dn("sling","Stone Sling","\u{1FAA8}",["crit"],0,n=>({opener:.7*n,crit:.03*n}),n=>`Opens each fight with a shot for ${we(.7*n)} attack. +${we(.03*n)} critical chance.`),Dn("brand","Ember Brand","\u{1F525}",["burn"],250,n=>({atkF:2*n,burnC:.3*n}),n=>`+${Vt(2*n)} attack. ${we(.3*n)} chance to set the enemy on fire.`),Dn("pick","War Pick","\u26CF\uFE0F",["crit"],250,n=>({atkF:2.5*n,pierce:.2*n}),n=>`+${Vt(2.5*n)} attack. Ignores ${we(.2*n)} armour.`),Dn("hooks","Twin Hooks","\u{1FA9D}",["speed"],300,n=>({atkF:1.5*n,dbl:.1*n}),n=>`+${Vt(1.5*n)} attack. ${we(.1*n)} chance to strike twice.`),Dn("whip","Leech Whip","\u{1FA78}",["life"],350,n=>({atkF:1.5*n,lifesteal:.08*n}),n=>`+${Vt(1.5*n)} attack. Heals for ${we(.08*n)} of damage dealt.`),Dn("maul","Great Maul","\u{1F528}",["stun","fury"],400,n=>({atkF:8*n,spdP:-.08,stunC:.1*n}),n=>`Needs two hands. +${Vt(8*n)} attack, -8% speed. ${we(.1*n)} chance to stun.`,2),Dn("trident","Barbed Trident","\u{1F531}",["bleed","crit"],450,n=>({atkF:3*n,vsBleedP:.15*n,critD:.2*n}),n=>`+${Vt(3*n)} attack. +${we(.15*n)} damage to bleeding enemies, +${we(.2*n)} critical damage.`),Ye("hide","Thick Hide","\u{1F418}",["life"],0,n=>({hpP:.12*n}),n=>`+${we(.12*n)} health.`),Ye("tooth","Whetted Tooth","\u{1F9B7}",["fury"],0,n=>({atkP:.12*n}),n=>`+${we(.12*n)} attack.`),Ye("blood","Quick Blood","\u{1F4A8}",["speed"],0,n=>({spdP:.1*n}),n=>`+${we(.1*n)} speed.`),Ye("eye","Hunter's Eye","\u{1F441}\uFE0F",["crit"],0,n=>({crit:.07*n}),n=>`+${we(.07*n)} critical chance.`),Ye("edge","Cruel Edge","\u2702\uFE0F",["crit"],0,n=>({critD:.35*n}),n=>`+${we(.35*n)} critical damage.`),Ye("slick","Slick Skin","\u{1F4A7}",["speed"],0,n=>({dodge:.05*n}),n=>`+${we(.05*n)} dodge.`),Ye("plate","Iron Scales","\u{1F529}",["guard"],0,n=>({def:.06*n}),n=>`+${we(.06*n)} armour.`),Ye("jag","Jagged Claws","\u{1FA78}",["bleed"],0,n=>({bleedC:.2*n}),n=>`${we(.2*n)} chance on hit to cause bleeding.`),Ye("rot","Rot Gland","\u2623\uFE0F",["poison"],0,n=>({poisonC:.2*n,poisonD:n}),n=>`${we(.2*n)} chance on hit to poison. Poison is stronger.`),Ye("gut","Ember Gut","\u{1F30B}",["burn"],200,n=>({burnC:.2*n}),n=>`${we(.2*n)} chance on hit to set the enemy on fire.`),Ye("scent","Blood Scent","\u{1F43A}",["bleed","fury"],0,n=>({vsBleedP:.25*n}),n=>`+${we(.25*n)} damage to bleeding enemies.`),Ye("torment","Tormentor","\u{1F608}",["bleed","poison","burn"],400,n=>({perStatusDmg:.1*n}),n=>`+${we(.1*n)} damage for each ailment on the enemy (bleed, poison, fire, stun).`),Ye("opp","Opportunist","\u{1F3AF}",["crit","bleed","poison","burn"],300,n=>({perStatusCrit:.08*n}),n=>`+${we(.08*n)} critical chance for each ailment on the enemy.`),Ye("fester","Festering","\u{1F9A0}",["poison","burn","bleed"],0,n=>({festerP:.4*n}),n=>`Bleed, poison and fire deal ${we(.4*n)} more.`),Ye("hemo","Hemophage","\u{1F987}",["bleed","life"],350,n=>({hemo:1.2*n}),n=>`Heal ${Vt(1.2*n)} for each bleed stack on the enemy, every second.`),Ye("mist","Red Mist","\u{1F32B}\uFE0F",["crit","bleed"],350,n=>({critBleed:Math.max(1,Math.round(n))}),n=>`Critical hits add ${Math.max(1,Math.round(n))} bleed.`),Ye("rhythm","Predator's Rhythm","\u23F1\uFE0F",["crit","ability"],0,n=>({critCdr:.6*n}),n=>`Critical hits cut ability cooldowns by ${Vt(.6*n)}s.`),Ye("finish","Finisher","\u{1F480}",["crit","fury"],0,n=>({execP:.4*n}),n=>`+${we(.4*n)} damage to enemies below 30% health.`),Ye("flurry","Flurry","\u{1F300}",["speed"],0,n=>({dbl:.08*n}),n=>`${we(.08*n)} chance to strike twice.`),Ye("moment","Momentum","\u{1F4C8}",["speed","fury"],0,n=>({ramp:.025*n}),n=>`Each hit you land adds +${Vt(2.5*n)}% damage for the rest of the fight.`),Ye("riposte","Riposte","\u{1F93A}",["guard"],0,n=>({riposte:.6*n}),n=>`A block hits back for ${we(.6*n)} attack.`),Ye("bulwark","Bulwark","\u{1F9F1}",["guard","life"],0,n=>({blockHeal:.05*n}),n=>`A block heals ${we(.05*n)} health.`),Ye("spite","Spite","\u{1F994}",["thorns"],0,n=>({thorns:.08*n}),n=>`Attackers take ${we(.08*n)} of their damage back.`),Ye("barbs","Barbed Hide","\u{1FAA1}",["thorns","bleed"],300,n=>({thornsBleed:1,thorns:.04*n}),n=>`Attackers take ${we(.04*n)} back and start bleeding.`),Ye("leech","Leech","\u{1FAB1}",["life"],0,n=>({lifesteal:.06*n}),n=>`Heal for ${we(.06*n)} of damage dealt.`),Ye("trophy","Trophy Hunter","\u{1F3C6}",["life"],0,n=>({killHp:.05*n}),n=>`Each kill adds +${we(.05*n)} health for the rest of the gauntlet.`),Ye("feast","Feast","\u{1F356}",["life"],0,n=>({killHeal:.12*n}),n=>`Each kill heals an extra ${we(.12*n)} health.`),Ye("wind","Second Wind","\u{1F54A}\uFE0F",["life"],500,n=>({secondWind:.15*n}),n=>`Once per fight, survive a killing blow and heal ${we(.15*n)}.`),Ye("breath","Deep Breath","\u{1F33F}",["life"],0,n=>({regen:.006*n}),n=>`Regain ${Vt(.6*n)}% health every second.`),Ye("shellr","Carapace","\u{1F95A}",["guard","life"],0,n=>({shieldP:.15*n}),n=>`Start each fight with a shield worth ${we(.15*n)} health.`),Ye("corner","Cornered","\u{1F621}",["fury"],0,n=>({lowP:.3*n}),n=>`+${we(.3*n)} damage while below 40% health.`),Ye("ambush","Ambush","\u{1F311}",["crit"],0,n=>({firstX:n}),n=>`Your first hit each fight deals +${we(n)} damage.`),Ye("giant","Giant Slayer","\u{1FA93}",["fury"],250,n=>({giantP:.2*n}),n=>`+${we(.2*n)} damage to enemies with more health than you.`),Ye("herd","Stampede","\u{1F9AC}",["fury"],0,n=>({perLegAtk:.03*n}),n=>`+${we(.03*n)} attack for each leg.`,n=>n.legs>=4,"four or more legs"),Ye("eyes","Many Eyes","\u{1F577}\uFE0F",["crit"],0,n=>({perEyeCrit:.015*n}),n=>`+${Vt(1.5*n)}% critical chance for each eye.`,n=>n.eyes>=2,"two or more eyes"),Ye("ambi","Ambidextrous","\u{1F64C}",["speed","weapon"],0,n=>({perWeaponSpd:.04*n}),n=>`+${we(.04*n)} speed for each weapon held.`,n=>n.hands>=2,"two or more hands"),Ye("updraft","Updraft","\u{1FABD}",["speed","crit"],0,n=>({dodge:.08*n,dodgeCrit:1}),n=>`+${we(.08*n)} dodge. After a dodge, your next hit is critical.`,n=>n.wings,"wings"),Ye("heavy","Heavyweight","\u{1F5FF}",["guard","thorns"],0,n=>({def:.04*n,thorns:.05*n}),n=>`+${we(.04*n)} armour, and attackers take ${we(.05*n)} back.`,n=>n.big,"a large body"),Ye("feather","Featherweight","\u{1FAB6}",["speed"],0,n=>({spdP:.08*n,dodge:.04*n}),n=>`+${we(.08*n)} speed and +${we(.04*n)} dodge.`,n=>n.small,"a small body"),Ye("coil","Coiled","\u27B0",["stun"],0,n=>({stunC:.06*n,stunDur:.5}),n=>`${we(.06*n)} chance to stun, and stuns last longer.`,n=>n.serpent||n.tentacles>=2,"a serpent body or tentacles"),Ye("virulent","Virulent","\u{1F9EB}",["poison"],0,n=>({poisonD:2*n,poisonC:.1}),n=>`Your poison deals ${Vt(2*n)} more each second.`,n=>n.venom,"a stinger, mandibles or feelers"),on("pounce","Pounce","\u{1F43E}",["stun","fury"],0,9,n=>`Leap for ${we(1.5+.3*n)} attack and stun briefly.`,n=>n.legs>=2,"legs"),on("roar","Roar","\u{1F981}",["guard"],0,12,n=>`Weaken the enemy's attacks by 30% for ${4+n}s.`,n=>n.mouth,"a mouth"),on("lick","Lick Wounds","\u{1F497}",["life"],0,14,n=>`Heal ${we(.11+.04*n)} health.`),on("spit","Venom Spit","\u{1F9EA}",["poison"],0,10,n=>`Poison the enemy for ${4+2*n} damage a second, for 6s.`,n=>n.venom,"a stinger, mandibles or feelers"),on("dive","Dive","\u{1F985}",["crit","speed"],0,11,n=>`Dodge everything for ${Vt(1.5+.5*n)}s; your next hit is critical.`,n=>n.wings,"wings"),on("constrict","Constrict","\u{1F40D}",["stun"],0,12,n=>`Squeeze for ${we(.8+.3*n)} attack and stun for ${Vt(1.4+.3*n)}s.`,n=>n.serpent||n.tentacles>=2,"a serpent body or tentacles"),on("web","Web","\u{1F578}\uFE0F",["speed","stun"],0,12,n=>`Slow the enemy's attacks by half for ${4+n}s.`,n=>n.type==="arachnid"||n.type==="insectoid","an arachnid or insectoid body"),on("ink","Ink Cloud","\u{1F32B}\uFE0F",["speed"],0,12,n=>`Blind the enemy for ${3+n}s: most of its attacks miss.`,n=>n.type==="cephalopod"||n.type==="aquatic","a cephalopod or aquatic body"),on("shellup","Shell Up","\u{1F422}",["guard","thorns"],0,13,n=>`Take 70% less damage for ${2+n}s and double what attackers take back.`,n=>n.armoured,"a shell, plates or tough hide"),on("sweep","Tail Sweep","\u{1F98E}",["stun"],0,8,n=>`Hit for ${we(1+.25*n)} attack and knock the enemy's next attack back.`,n=>n.tail,"a tail"),on("gore","Gore","\u{1F402}",["bleed"],0,10,n=>`Hit for ${we(1.2+.2*n)} attack and add ${2+n} bleed.`,n=>n.horns,"horns or tusks"),on("frenzy","Frenzy","\u{1F624}",["speed","fury"],300,13,n=>`Attack ${we(.5+.2*n)} faster for 4s.`),on("hurl","Hurl Weapon","\u{1F3F9}",["weapon","crit"],300,9,n=>`Throw for ${we(1.8+.4*n)} attack. Cannot miss.`,n=>n.hands>=1,"a hand"),on("rend","Rend","\u{1F405}",["bleed"],350,9,n=>`Tear open wounds: ${we(.35+.1*n)} attack for each bleed on the enemy.`,n=>n.claws,"claws, talons or paws"),on("breath","Fire Breath","\u{1F432}",["burn"],400,11,n=>`Burn for ${we(.8+.2*n)} attack and set the enemy alight for 5s.`,n=>n.mouth,"a mouth")],By=Object.fromEntries(ur.map(n=>[n.id+(n.cat==="ability"?"!":""),n])),Yn=(n,e)=>By[n+(e==="ability"?"!":"")],sf=["Common","Rare","Epic"],Ah=["humanoid","quadruped","avian"],dr={insectoid:400,arachnid:500,cephalopod:600,serpent:300,aquatic:300},to={eye_glow:100,eye_stalk:100,eye_compound:100,mandibles:150,maw:150,trunk:150,tusk:150,horn_ram:200,antler:200,antenna_feather:80,ear_fin:80,arm_pincer:250,tentacle:300,leg_insect:150,wing_bat:300,wing_insect:200,tail_club:250,tail_stinger:300,ridge_sail:150,ridge_plates:200,shell:300},rf=[{id:"vital",name:"Vitality",icon:"\u2764\uFE0F",max:5,cost:n=>150+100*n,text:"+5% health for every creature, per level."},{id:"fero",name:"Ferocity",icon:"\u{1F4A2}",max:5,cost:n=>150+100*n,text:"+4% attack for every creature, per level."},{id:"recov",name:"Recovery",icon:"\u26FA",max:5,cost:n=>120+80*n,text:"+4% more health restored between fights, per level."},{id:"reroll",name:"Fickle Crowd",icon:"\u{1F3B2}",max:3,cost:n=>250+150*n,text:"+1 reroll of the rewards per gauntlet, per level."},{id:"stable",name:"Bigger Stable",icon:"\u26A1",max:2,cost:n=>600+400*n,text:"+1 to the most runs you can hold, per level."},{id:"head",name:"Head Start",icon:"\u{1F381}",max:1,cost:()=>800,text:"Choose a reward before the first fight."},{id:"revive",name:"Revive",icon:"\u2728",max:3,cost:()=>500,text:"Brings a dead creature back once, mid-gauntlet, at half health. Used up when spent. Hold up to three.",consumable:!0}],Rh=()=>({points:0,champions:0,fallen:0,unlocked:{},boosts:{},revives:0,runs:null}),zy=5,Th=1800*1e3,Hy=n=>zy+(n.boosts.stable||0);function qi(n,e=Date.now()){let t=Hy(n);n.runs||(n.runs={n:t,t:e});let i=n.runs;for(i.t>e&&(i.t=e);i.n<t&&e-i.t>=Th;)i.n++,i.t+=Th;return i.n>=t&&(i.t=e),{n:i.n,max:t,next:i.n>=t?0:Th-(e-i.t)}}function of(n,e=Date.now()){let t=qi(n,e);return t.n<=0?!1:(t.n>=t.max&&(n.runs.t=e),n.runs.n--,!0)}function za(n,e=Date.now()){qi(n,e),n.runs.n++}var Ha=n=>{let e=Math.ceil(n/1e3);return Math.floor(e/60)+":"+String(e%60).padStart(2,"0")},Ch=(n,e)=>!!n.unlocked[e],Va=(n,e)=>Ah.includes(e)||Ch(n,"type:"+e),Ph=(n,e)=>!to[e]||Ch(n,"part:"+e),Ih=(n,e)=>!e.cost||Ch(n,"item:"+e.cat+":"+e.id),af=n=>15*(n+1),Ga=()=>({weapons:[],relics:[],abilities:[]}),no=n=>n.weapons.reduce((e,t)=>e+Yn(t.id,"weapon").hands,0);function Lh(n){let e={};for(let t of[...n.weapons,...n.relics]){let i=Yn(t.id,t.cat||"x").mods(t.q);for(let s in i)e[s]=(e[s]||0)+i[s]}return e.weapons=n.weapons.length,e}function Vy(n){let e={};for(let t of[...n.weapons,...n.relics,...n.abilities])for(let i of Yn(t.id,t.cat).tags)e[i]=(e[i]||0)+1;return e}function lf(n,e,t){return n.req&&!n.req(e)?!1:n.cat==="weapon"?e.slots-no(t)>=n.hands:n.cat==="ability"?t.abilities.some(i=>i.id===n.id)||t.abilities.length<e.abilitySlots:!0}function cf(n,e,t,i,s,r=3){let o=Vy(t),a=[],c=new Set,h=ur.filter(f=>(!i||Ih(i,f))&&lf(f,e,t)),u={weapon:e.slots-no(t)>=2?.45:.32,relic:.42,ability:.26};for(let f=0;f<r;f++){let p=h.filter(y=>!c.has(y.cat+y.id));if(!p.length)break;let g=p.map(y=>{let P=0;for(let A of y.tags)P+=Math.min(o[A]||0,3);let T=y.cat==="ability"&&t.abilities.some(A=>A.id===y.id);return u[y.cat]/Math.max(1,p.filter(A=>A.cat===y.cat).length)*(1+.9*Math.min(P,5))*(T?1.5:1)}),_=n()*g.reduce((y,P)=>y+P,0),m=0;for(;m<g.length-1&&(_-=g[m])>0;)m++;let d=p[m];c.add(d.cat+d.id);let x=n(),b=x<.05+.015*s?2:x<.28+.035*s?1:0;a.push({id:d.id,cat:d.cat,rar:b,q:Math.round([1,1.5,2.2][b]*(.9+.2*n())*100)/100,syn:d.tags.some(y=>o[y])})}return a}function hf(n,e){if(e.cat==="weapon")n.weapons.push({id:e.id,cat:"weapon",q:e.q,rar:e.rar});else if(e.cat==="relic")n.relics.push({id:e.id,cat:"relic",q:e.q,rar:e.rar});else{let t=n.abilities.find(i=>i.id===e.id);t?t.lvl+=1+(e.rar>0?1:0):n.abilities.push({id:e.id,cat:"ability",lvl:1+e.rar})}}function Wa(n){var t;let e=Yn(n.id,n.cat);return n.cat!=="ability"?e.text(n.q):e.text((t=n.lvl)!=null?t:1+n.rar)+` Recharges in ${e.cd}s.`}function uf(n,e,t){let i=Ga(),s=.75+.04*t,r=ur.filter(a=>a.cat==="relic"&&lf(a,e,i)),o=ur.filter(a=>a.cat==="weapon");for(let a=0;a<Math.floor(t*.75);a++)i.relics.push({id:r[Math.floor(n()*r.length)].id,cat:"relic",q:s,rar:0});for(let a=0;a<Math.min(e.slots,Math.floor((t+1)/3));a++){let c=o[Math.floor(n()*o.length)];e.slots-no(i)>=c.hands&&i.weapons.push({id:c.id,cat:"weapon",q:s,rar:0})}return i}var Gy=["eye_round","eye_cat","eye_goat","eye_glow","eye_beady","eye_compound","eye_stalk"],Wy=["muzzle","beak","mandibles","maw","feelers","muzzle"],Xy=["horn_spike","horn_curved","horn_ram","antler","antenna","antenna_feather","crest"],Yy=["tail_thin","tail_thick","tail_fluffy","tail_tuft","tail_club","tail_stinger","tail_fan"],qy=["ridge_spikes","ridge_plates","ridge_sail","ridge_mane","shell"],Zy=["ear_point","ear_round","ear_long","ear_floppy","ear_fin"],$y=["wing_feather","wing_bat","wing_insect"],Jy=["human","paw","hoof","talon","webbed","stump","point"],Ky=["human","claw","pincer","mitt"],jy=["skin","fur","scales","chitin","slime"],Qy=["Vor","Gra","Zul","Kra","Thu","Mog","Sha","Bru","Nyx","Ora","Ska","Dre","Hul","Fen","Ryz","Um","Qua","Ix","Bel","Tar"],ev=["gath","nak","tor","ra","lix","mok","thos","zar","dun","ska","bor","vex","gul","ris","nor","ix"],tv=["the Cruel","the Hungry","Bonebreaker","the Unblinking","of the Pit","the Swift","Skullsplitter","the Patient","the Loud","Twice-Bitten","the Scarred","Sandstrider","the Vile","Crowd-Pleaser","the Last"];function nv(n,e){let t=i=>i[Math.floor(n()*i.length)];return t(Qy)+t(ev)+(e?" "+t(tv):"")}function io(n,e={}){let t=_=>_[Math.floor(n()*_.length)],i=(_,m)=>_+(m-_)*n(),s=(_,m,d)=>"#"+new Le().setHSL((_%1+1)%1,m,d).getHexString(),r=e.type||t(Object.keys(At)),o=vs(r);o.name=nv(n,e.titled),o.sex=n()<.5?"m":"f",o.bulk=i(.82,1.3),o.dimorph=i(.4,1.2);for(let _ of o.nodes){let m=_.role==="neck"||_.role==="waist"?i(.9,1.15):i(.82,1.28);_.rx*=m,_.ry*=m*i(.92,1.08)}let a=n(),c=o.look;Object.assign(c,{base:s(a,i(.25,.8),i(.25,.62)),second:s(a+i(-.25,.25),i(.35,.8),i(.1,.4)),belly:s(a+.04,i(.15,.4),i(.7,.88)),hair:s(a+i(0,.5),.5,i(.15,.5)),membrane:s(a+i(-.1,.1),.45,i(.45,.7)),eye:s(n(),.8,.47),accent:n()<.7?s(.11,.3,i(.75,.9)):s(a,.2,.12),pattern:Math.floor(n()*8),patScale:i(.7,2),bellyAmt:i(.3,.9)}),n()<.5&&(c.cover=t(jy),c.furLen=i(.1,.55),c.furDroop=i(.1,.7));let h=(_,m)=>{let d=Pt[_.kind],x=Pt[m];d.size&&x.size&&(_.size*=x.size/d.size),_.kind=m,_.p=Ua(m)},l=Na(o,{sexless:!0}).userData.frames,u=_=>o.parts.some(m=>Pt[m.kind].cat===_),f=t(Gy),p=t(Wy);for(let _ of o.parts){let m=Pt[_.kind];m.cat==="eyes"&&n()<.55?h(_,f):m.cat==="mouth"&&m.slot==="mouth"&&n()<.55?h(_,p):m.cat==="limbs"&&_.p.endType!==void 0&&(n()<.4&&(_.p.endType=t(_.kind.startsWith("arm")?Ky:Jy)),_.p.thick*=i(.85,1.35),_.p.muscle=i(.9,1.35))}u("mouth")||oi(o,p,l);let g=(_,m,d)=>{if(n()<_&&!(d&&u(d)))return oi(o,t(m),l)};g(.5,Xy),g(.45,Yy,"tails"),g(.45,qy,"back"),g(.2,$y,"wings"),g(.3,Zy,"ears"),n()<.2&&oi(o,"tusk",l),n()<.15&&oi(o,"spike",l);for(let _ of o.parts){let m=Pt[_.kind];if(_.size*=i(.88,1.2),!(m.cat==="limbs"||m.cat==="eyes"))for(let[d,x]of Object.entries(m.P||{}))["count","feathers","tines","lift","sweep","span"].includes(d)||(_.p[d]=_.p[d]+(i(x[0],x[1])-_.p[d])*.3)}return o}var mf=["z","y","x","pitch","yaw","roll","sy","gait","legF","legH","legOut","armAll","arm","armOut","tent","wing","flap","tailYaw","tailUp","wag"],Dh=()=>{let n={};for(let e of mf)n[e]=0;return n.sy=1,n.wag=1,n},df=n=>n*n*(3-2*n),iv=n=>1-(1-n)*(1-n)*(1-n),ff=n=>Math.min(1,Math.max(0,n)),pf={lunge:{wind:{z:-.3,pitch:-.16,legF:.25,sy:.94},hit:{z:.9,pitch:.22,legF:-.6,legH:.35,tailUp:.3}},bite:{wind:{z:-.3,pitch:-.22,legF:.25,tailUp:.2},hit:{z:.95,pitch:.3,legF:-.55,legH:.35,tailUp:.4}},slash:{wind:{z:-.12,pitch:-.2,arm:-2.8,yaw:-.35,legF:.2},hit:{z:.7,pitch:.2,arm:-.45,yaw:.4,legH:.3}},swipe:{wind:{pitch:-.5,y:.12,legF:-1.3,z:-.1,tailUp:-.2},hit:{z:.65,pitch:.2,legF:-.15,legH:.35}},charge:{wind:{z:-.65,pitch:.14,legF:.35,legH:-.25,sy:.92},hit:{z:1.2,pitch:.3,legF:-.5,legH:.5},run:!0},swoop:{wind:{y:1.15,z:-.35,pitch:-.3,flap:1,wing:.35,legF:-.4,legH:-.4},hit:{y:.05,z:1,pitch:.45,wing:.6,legF:-.9,legH:-.5}},lash:{wind:{z:-.15,tent:.55,pitch:-.12,sy:1.06},hit:{z:.6,tent:-1.35,pitch:.14,sy:.95}},tail:{wind:{yaw:-.7,tailYaw:.6,z:-.1,sy:.95},hit:{yaw:Math.PI*2,tailYaw:-.5,z:.55,tailUp:.25},spin:!0},sting:{wind:{pitch:.12,tailUp:.5,z:-.15,sy:.95},hit:{pitch:.3,tailUp:1.5,z:.7}},pounce:{wind:{z:-.45,pitch:-.32,sy:.82,legF:.3,legH:-.3},hit:{z:1.05,pitch:.32,legF:-.9,legH:.6},arc:.95,slow:!0},roar:{wind:{pitch:-.4,wing:.7,armAll:-1.2,armOut:.6,tailUp:.4,sy:1.06},hit:{pitch:-.2,wing:.9,armAll:-1.6,armOut:.9,z:.15,sy:1.1}}};function gf(n){let e=[],t=new Xe().makeScale(-1,1,1),i=n.frames.C,s=(i[0].z+i[i.length-1].z)/2,r=0;n.group.traverse(a=>{let c=a.userData.joint;c&&(a.matrixAutoUpdate=!1,e.push({node:a,...c,front:c.pivot.z>=s-.02,ph:e.length*2.399%6.283,idx:c.kind==="arm"?r++:0,a:new un,q:new Wt}))});let o=new Set(e.map(a=>a.kind));return{cr:n,joints:e,S:t,kinds:o,arms:r,cur:Dh(),t:0,gaitPh:0,flapPh:0,tmp:new Xe,tmp2:new Xe}}function Uh(n,e,t,i){var l,u;let s=pf[n]||pf.lunge,r={},o=i?1.3:1,a=s.slow?.2:.11,c=.55,h=new Set([...Object.keys(s.wind),...Object.keys(s.hit)]);for(let f of h){let p=f==="sy"?1:0,g=(l=s.wind[f])!=null?l:p,_=(u=s.hit[f])!=null?u:p,m;if(t<0)m=p+(g-p)*df(ff(e));else if(t<a)m=g+(_-g)*iv(t/a);else{let d=df(ff((t-a)/(c-a)));m=_+((s.spin&&f==="yaw"?_:p)-_)*d}r[f]=p+(m-p)*(f==="yaw"||f==="arm"||f==="sy"?1:o)}return s.arc&&t>=0&&t<a&&(r.y=(r.y||0)+Math.sin(t/a*Math.PI)*s.arc),s.run&&t>=0&&t<a+.1&&(r.gait=1.5),r}var _f=.55;function xf(n,e,t,i,s){var l;let r=n.cur,o=s?1:Math.min(1,t*26);for(let u of mf)r[u]+=(((l=e[u])!=null?l:u==="sy"||u==="wag"?1:0)-r[u])*(u==="yaw"&&Math.abs((e.yaw||0)-r.yaw)>3?1:o);n.t+=t,n.gaitPh+=t*(7+5*Math.min(r.gait,1.5)),n.flapPh+=t*(5+16*Math.min(Math.abs(r.flap),1));let a=Math.abs(Math.sin(r.pitch))*(n.len||0)*.42;i.position.set(r.x,r.y+a,r.z-(n.len||0)/2),i.rotation.set(r.pitch,r.yaw,r.roll),i.scale.set(1+(1-r.sy)*.5,r.sy,1+(1-r.sy)*.5);let c=n.t,h=n.cr.M.U.uPM.value;for(let u of n.joints){let f=0,p=0,g=0,_=u.side>0?0:Math.PI;u.kind==="leg"?(f=r.gait*.55*Math.sin(n.gaitPh+_+(u.front?0:Math.PI))+(u.front?r.legF:r.legH),g=r.legOut):u.kind==="arm"?(f=r.armAll+(u.idx===n.armSel||n.armSel<0?r.arm:r.arm*.25)+.07*Math.sin(c*1.6+u.ph)-r.gait*.4*Math.sin(n.gaitPh+_),g=r.armOut+.03*Math.sin(c*1.3+u.ph)):u.kind==="tentacle"?(f=r.tent*(.55+.45*Math.sin(u.ph*3))+.13*Math.sin(c*1.7+u.ph)+r.gait*.3*Math.sin(n.gaitPh+u.ph),g=.1*Math.sin(c*1.3+u.ph*2)+r.legOut*.6):u.kind==="wing"?(g=r.wing+(.07+.6*r.flap)*Math.sin(n.flapPh),f=.04*Math.sin(c*1.1)):(p=r.tailYaw+.2*r.wag*Math.sin(c*2.4+u.ph),f=r.tailUp+.05*Math.sin(c*1.9)),u.a.set(f,p,g),u.q.setFromEuler(u.a);let m=u.pivot;u.node.matrix.makeRotationFromQuaternion(u.q);let d=u.node.matrix.elements,x=m.x,b=m.y,y=m.z;d[12]=x-(d[0]*x+d[4]*b+d[8]*y),d[13]=b-(d[1]*x+d[5]*b+d[9]*y),d[14]=y-(d[2]*x+d[6]*b+d[10]*y),u.node.matrixWorldNeedsUpdate=!0,u.bone&&(u.side>0?h[u.bone].copy(u.node.matrix):h[u.bone].copy(n.S).multiply(u.node.matrix).multiply(n.S))}}function Nh(n){for(let e of n.U.uPM.value)e.identity()}function yf(n,e){let t=new ct,i=new Float32Array(e*3),s=new Float32Array(e*4),r=new Float32Array(e);t.setAttribute("position",new xt(i,3)),t.setAttribute("col",new xt(s,4)),t.setAttribute("size",new xt(r,1));let o=new In({transparent:!0,depthWrite:!1,blending:n,uniforms:{uScale:{value:400}},vertexShader:`attribute vec4 col; attribute float size; varying vec4 vCol; uniform float uScale;
void main(){ vCol = col; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying vec4 vCol;
void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; float a = smoothstep(1.0, 0.35, d) * vCol.a; if (a < 0.01) discard; gl_FragColor = vec4(vCol.rgb, a); }`}),a=new ua(t,o);return a.frustumCulled=!1,a.renderOrder=5,{pts:a,pos:i,col:s,size:r,cap:e,parts:[],geo:t,mat:o}}function bf(n){let e=yf(Nr,500),t=yf(zi,400);n.add(e.pts,t.pts);let i=[],s=new pa(.85,1,40),r=new Le;return{burst(a,c,h,l={}){var p,g,_,m;let u=vf[a]||vf.spark,f=u.add?e:t;for(let d=0;d<h;d++){f.parts.length>=f.cap&&f.parts.shift();let x=Math.random()*6.283,b=Math.random(),y=u.speed*(.4+Math.random()*.8)*(l.speed||1),P=l.dir||null;r.set(u.colors[Math.floor(Math.random()*u.colors.length)]),f.parts.push({x:c.x+(Math.random()-.5)*((p=l.spread)!=null?p:u.spread),y:c.y+(Math.random()-.5)*((g=l.spread)!=null?g:u.spread),z:c.z+(Math.random()-.5)*((_=l.spread)!=null?_:u.spread),vx:Math.cos(x)*y*(1-b*.5)+(P?P.x*y*1.5:0),vy:(b*u.up+(Math.random()-.3)*.5)*y+(P?P.y*y:0),vz:Math.sin(x)*y*(1-b*.5)+(P?P.z*y*1.5:0),g:u.grav,drag:u.drag,life:0,max:u.life*(.6+Math.random()*.7),s:u.size*(.6+Math.random()*.8)*(l.size||1),grow:u.grow||0,r:r.r,gr:r.g,b:r.b,a:(m=u.alpha)!=null?m:1})}},ring(a,c,h=1.6,l=!0){let u=new Ne(s,new Bt({color:c,transparent:!0,depthWrite:!1,side:Ct,blending:Nr}));u.position.copy(a),l&&(u.rotation.x=-Math.PI/2),u.userData={t:0,size:h},n.add(u),i.push(u)},update(a){for(let c of[e,t]){let h=c.parts,l=0;for(let u=0;u<h.length;u++){let f=h[u];if(f.life+=a,f.life>=f.max)continue;f.vy-=f.g*a;let p=Math.max(0,1-f.drag*a);f.vx*=p,f.vy*=p,f.vz*=p,f.x+=f.vx*a,f.y+=f.vy*a,f.z+=f.vz*a,f.y<.02&&f.g>0&&(f.y=.02,f.vy*=-.3,f.vx*=.6,f.vz*=.6);let g=f.life/f.max;c.pos[l*3]=f.x,c.pos[l*3+1]=f.y,c.pos[l*3+2]=f.z,c.col[l*4]=f.r,c.col[l*4+1]=f.gr,c.col[l*4+2]=f.b,c.col[l*4+3]=f.a*(1-g*g),c.size[l]=f.s*(1+f.grow*g),h[l++]=f}h.length=l,c.geo.setDrawRange(0,l),c.geo.attributes.position.needsUpdate=c.geo.attributes.col.needsUpdate=c.geo.attributes.size.needsUpdate=!0}for(let c=i.length-1;c>=0;c--){let h=i[c];h.userData.t+=a;let l=h.userData.t/.45;if(l>=1){n.remove(h),h.material.dispose(),i.splice(c,1);continue}h.scale.setScalar(.2+h.userData.size*(1-(1-l)*(1-l))),h.material.opacity=(1-l)*.8}},resize(a){e.mat.uniforms.uScale.value=t.mat.uniforms.uScale.value=a*.9},clear(){e.parts.length=t.parts.length=0;for(let a of i)n.remove(a),a.material.dispose();i.length=0}}}var vf={spark:{add:!0,colors:["#fff2a0","#ffd060","#ffffff"],speed:4.5,up:.8,grav:9,drag:1.5,life:.45,size:.09,spread:.1},dust:{colors:["#d9bb84","#c9a56a","#e9d2a4"],speed:1.3,up:.6,grav:-.3,drag:2.5,life:.9,size:.3,spread:.3,grow:1.6,alpha:.5},blood:{colors:["#b01818","#d83030","#7a0c0c"],speed:2.6,up:.9,grav:9,drag:.6,life:.7,size:.085,spread:.12},venom:{colors:["#8fe04a","#5ab82a","#c8ff7a"],speed:.9,up:1.4,grav:-1.2,drag:1.5,life:.9,size:.1,spread:.5,alpha:.85},fire:{add:!0,colors:["#ff8a20","#ffc040","#ff4a10"],speed:.8,up:2,grav:-3,drag:1.2,life:.55,size:.2,spread:.5,grow:-.6},heal:{add:!0,colors:["#7affb0","#c8ffd8","#40e090"],speed:.6,up:2.2,grav:-2,drag:1,life:.9,size:.11,spread:.8},star:{add:!0,colors:["#fff07a","#ffffff"],speed:1.6,up:.5,grav:0,drag:2,life:.6,size:.12,spread:.3},magic:{add:!0,colors:["#c89aff","#8a5aff","#ffffff"],speed:2.2,up:.8,grav:0,drag:2.5,life:.6,size:.13,spread:.3},ink:{colors:["#14101c","#2a2438","#0a0810"],speed:1.4,up:.5,grav:-.2,drag:2,life:1.5,size:.5,spread:.6,grow:1.2,alpha:.75},web:{colors:["#ffffff","#e8eef2"],speed:2.4,up:.3,grav:1,drag:3,life:1.1,size:.07,spread:.7},shield:{add:!0,colors:["#7fd0ff","#ffffff","#4aa0ff"],speed:2.5,up:.4,grav:0,drag:3,life:.35,size:.12,spread:.5}};var pr=(n,e,t)=>Math.min(t,Math.max(e,n));function kh(n,e,t){let i=document.createElement("canvas");i.width=n,i.height=e,t(i.getContext("2d"),n,e);let s=new ii(i);return s.colorSpace=Ot,s}function rv(){let n=new wt,e=12,t=kh(256,256,(m,d,x)=>{m.fillStyle="#d2a45c",m.fillRect(0,0,d,x);for(let y=0;y<5e3;y++)m.fillStyle=`rgba(${Math.random()<.5?"90,60,30":"255,235,190"},${Math.random()*.12})`,m.fillRect(Math.random()*d,Math.random()*x,1+Math.random()*3,1+Math.random()*2);let b=m.createRadialGradient(d/2,x/2,d*.1,d/2,x/2,d/2);b.addColorStop(0,"rgba(255,240,200,0.25)"),b.addColorStop(1,"rgba(60,35,15,0.45)"),m.fillStyle=b,m.fillRect(0,0,d,x)}),i=new Ne(new er(e,64),new Ut({map:t,roughness:1}));i.rotation.x=-Math.PI/2,i.receiveShadow=!0,n.add(i);let s=new Ut({color:9402204,roughness:.95,side:Ct}),r=new Ut({color:7167308,roughness:1,side:Ct}),o=[new Se(e,0),new Se(e,1.5)];for(let m=0;m<6;m++)o.push(new Se(e+.5+m*1.15,1.5+m*.8),new Se(e+.5+(m+1)*1.15,1.5+m*.8),new Se(e+.5+(m+1)*1.15,1.5+(m+1)*.8));o.push(new Se(e+8,8.5)),n.add(new Ne(new da(o,72),s));let a=new Ne(new dn(e,.14,6,72),r);a.rotation.x=Math.PI/2,a.position.y=1.5,n.add(a);let c=900,h=new Vr(new nn(.2,6,5),new Ut({roughness:.9}),c),l=new Xe,u=new Le,f=[];for(let m=0;m<c;m++){let d=Math.floor(Math.random()*6),x=Math.random()*Math.PI*2,b=e+1.05+d*1.15+(Math.random()-.5)*.4;f.push({x:Math.cos(x)*b,y:1.5+d*.8+.3,z:Math.sin(x)*b,ph:Math.random()*6.28}),h.setColorAt(m,u.setHSL(Math.random(),.3+Math.random()*.5,.25+Math.random()*.35))}n.add(h);for(let m=0;m<24;m++){let d=m/24*Math.PI*2,x=e+7.7,b=new Ne(new Wn(.3,.36,3.4,10),s);b.position.set(Math.cos(d)*x,8.2,Math.sin(d)*x),n.add(b)}let p=new Ne(new dn(e+7.7,.32,6,72),s);p.rotation.x=Math.PI/2,p.position.y=10,n.add(p);let g=new Ut({color:2759698,roughness:1});for(let m of[-1,1]){let d=new Ne(new Mi(1.6,1.25),g);d.position.set(m*(e-.02),.62,0),d.rotation.y=-m*Math.PI/2,n.add(d)}for(let m=0;m<10;m++){let d=m/10*Math.PI*2+.3,x=new Ne(new Mi(.7,1),new Ut({color:m%2?10099740:14262304,roughness:.8,side:Ct}));x.position.set(Math.cos(d)*(e-.03),.9,Math.sin(d)*(e-.03)),x.lookAt(0,.9,0),n.add(x)}let _=kh(4,256,m=>{let d=m.createLinearGradient(0,0,0,256);d.addColorStop(0,"#2f5fa8"),d.addColorStop(.45,"#7fa6d0"),d.addColorStop(1,"#e9c79a"),m.fillStyle=d,m.fillRect(0,0,4,256)});return{g:n,crowd:h,seats:f,m4:l,sky:_}}function ov(n){let e=new wt,t=(c,h=.5,l)=>new Ut({color:c,roughness:h,metalness:c===10134701?.7:0,emissive:l||0}),i=(c,h,l,u,f,p)=>{let g=new Ne(c,h);return g.position.set(l||0,u||0,f||0),p&&(g.rotation.z=p),e.add(g),g},s=t(7031342,.8),r=t(10134701,.35),o=t(15261900,.6),a=(c=1)=>i(new Wn(.035,.045,c,8),s,0,c/2);if(n==="club")i(new Wn(.13,.04,1,10),o,0,.5),i(new nn(.14,10,8),o,0,1);else if(n==="cleaver")a(.6),i(new Gn(.34,.5,.03),r,.14,.78);else if(n==="fang")a(.3),i(new Si(.07,.6,8),o,0,.6);else if(n==="mace"){a(.85),i(new fa(.17,0),r,0,.95);for(let c=0;c<6;c++)i(new Si(.04,.16,5),r,Math.cos(c)*.2,.95+Math.sin(c*2)*.12,Math.sin(c)*.2,-Math.cos(c)*1.57)}else if(n==="buckler"){let c=i(new Wn(.42,.42,.06,20),r,0,.3,.1);c.rotation.x=Math.PI/2;let h=i(new Si(.08,.25,8),o,0,.3,.25);h.rotation.x=Math.PI/2}else if(n==="sling")i(new dn(.2,.02,5,14),s,0,.3),i(new nn(.09,8,6),t(9079430,.9),0,.1);else if(n==="brand")a(.8),i(new Si(.13,.42,8),t(16747040,.4,16734720),0,1);else if(n==="pick"){a(.95);let c=i(new Si(.06,.6,6),r,0,.9);c.rotation.z=Math.PI/2}else if(n==="hooks")a(.6),i(new dn(.16,.03,6,12,Math.PI*1.2),r,.16,.62);else if(n==="whip")a(.3),i(new dn(.3,.022,5,16,Math.PI*1.4),t(8002588,.7),.3,.35);else if(n==="maul")i(new Wn(.045,.055,1.4,8),s,0,.7),i(new Gn(.5,.32,.32),r,0,1.4);else{a(1.2);for(let c of[-.13,0,.13])i(new Si(.035,.4,6),r,c,1.35-Math.abs(c)*.6);i(new Gn(.3,.04,.04),r,0,1.15)}return e}var mr=null;function pn(n){try{mr=mr||new(window.AudioContext||window.webkitAudioContext);let e=mr.currentTime,t=mr.createOscillator(),i=mr.createGain(),[s,r,o,a,c]={hit:[150,50,.14,"triangle",.5],power:[220,40,.3,"sawtooth",.5],block:[700,500,.09,"square",.2],miss:[500,800,.1,"sine",.12],win:[440,880,.6,"triangle",.35],lose:[200,60,.9,"sawtooth",.3]}[n];t.type=a,t.frequency.setValueAtTime(s,e),t.frequency.exponentialRampToValueAtTime(r,e+o),i.gain.setValueAtTime(c,e),i.gain.exponentialRampToValueAtTime(.001,e+o),t.connect(i).connect(mr.destination),t.start(e),t.stop(e+o+.02)}catch{}}function Mf(n){let{scene:e,camera:t,h:i,store:s}=n,r=rv();r.g.visible=!1,e.add(r.g);let o=bf(r.g),a=Ca(),c=kh(64,64,v=>{let B=v.createRadialGradient(32,32,2,32,32,32);B.addColorStop(0,"rgba(0,0,0,0.6)"),B.addColorStop(1,"rgba(0,0,0,0)"),v.fillStyle=B,v.fillRect(0,0,64,64)}),h=document.getElementById("battle"),l={active:!1,phase:"off",run:null,data:null,views:[null,null],F:null,t:0,phaseT:0,enemy:null,shake:0,cheer:0,rand:Math.random,confetti:null,queue:[],eLoad:null,auto:!1,freeze:0,slow:0,punch:0,entered:!1},u=null,f={Pounce:"pounce","Tail Sweep":"tail",Gore:"charge",Hurl:"slash",Rend:"slash",Constrict:"lash","Fire Breath":"roar",Sling:"slash"};function p(v,B,O,J,se){si(B,v.look,At[v.type].bellyDir),Nh(B);let ie=[],D=cr(v,B,{anchors:ie,animated:!0}),q=Qr(D),re=q.getSize(new I),ae=hr(v),z=pr(1.9/Math.max(re.y,re.z*.85,re.x*.55,.6),.5,2.4)*(.85+.35*pr(Math.cbrt(ae.hp/200),.6,1.4)),ee=v.type==="aquatic"?.45:0;D.group.scale.setScalar(z),D.group.position.set(-(q.min.x+q.max.x)/2*z,-q.min.y*z+ee,-q.max.z*z+re.z*z/2);let ye=0;for(let Ve of J?J.weapons:[]){let Ce=ie[ye];if(ye+=Yn(Ve.id,"weapon").hands,!Ce)continue;let nt=ov(Ve.id),De=pr(re.y*.3,.22,.6);nt.scale.setScalar(De),nt.position.copy(Ce.p).addScaledVector(Ce.t,Ce.r*2.2),nt.quaternion.setFromUnitVectors(new I(0,1,0),Ce.t.clone().multiplyScalar(.25).add(new I(.2,.5,.85)).normalize()),nt.traverse(R=>{R.castShadow=!0}),Ce.node.add(nt)}let Re=new wt,Fe=new wt;Re.add(D.group),Fe.add(Re);let Qe=new Ne(new Mi(1,1),new Bt({map:c,transparent:!0,depthWrite:!1,opacity:.45}));Qe.rotation.x=-Math.PI/2,Qe.position.set(0,.012,-re.z*z/2),Qe.scale.set(Math.max(re.x*z,.6)*1.2,re.z*z*1.1,1),Fe.add(Qe),Fe.position.x=O*(.75+(se||0)),Fe.rotation.y=O<0?Math.PI/2:-Math.PI/2,r.g.add(Fe);let U=gf(D),Qt=new Set(v.parts.map(Ve=>Ve.kind)),ke=[];return U.arms>0?ke.push("slash"):ae.claws&&ae.legs>=4&&ke.push("swipe"),ae.mouth&&ke.push("bite"),ae.horns&&ke.push("charge"),ae.wings&&ke.push("swoop"),ae.tentacles>=2&&ke.push("lash"),["tail_club","tail_thick","tail_fluke","tail_fish"].some(Ve=>Qt.has(Ve))&&ke.push("tail"),Qt.has("tail_stinger")&&ke.push("sting"),ke.length||ke.push("lunge"),U.armSel=-1,U.len=re.z*z,{cr:D,mats:B,pose:Re,holder:Fe,side:O,rig:U,styles:ke,style:ke[0],styleN:0,hover:ee,st:ae,walk:se||0,half:re.x*z/2,len:re.z*z,head:new I(0,re.y*z+ee+.15,-re.z*z*.3),mid:new I(0,re.y*z*.55+ee,-re.z*z*.2),front:new I(0,re.y*z*.5+ee,.1),strikeT:-1,winding:!1,power:!1,recoil:0,flash:0,dead:-1,dodge:-1,fxT:0,thud:!1,ph:Math.random()*6}}let g=(v,B)=>v.holder.localToWorld(B.clone());function _(v){let B=l.views[v];B&&(r.g.remove(B.holder),Yi(B.cr.group),l.views[v]=null)}let m=v=>[...v.weapons,...v.abilities,...v.relics].map(B=>Yn(B.id,B.cat).icon).join("");function d(v,B){let O=B.clone();return v.holder.localToWorld(O),O.project(t),[(O.x*.5+.5)*innerWidth,(-O.y*.5+.5)*innerHeight]}function x(v,B,O){let J=l.views[v];if(!J)return;let[se,ie]=d(J,J.head),D=i("div",{class:"float "+(O||""),style:`left:${se+(Math.random()-.5)*40}px;top:${ie}px`},B);h.querySelector(".floaters").append(D),setTimeout(()=>D.remove(),1100)}function b(){let v=[l.data.name,l.enemy?l.enemy.name:""],B=O=>J=>{J.preventDefault(),l.phase==="fight"&&O()};h.replaceChildren(i("div",{class:"hud"},i("div",{class:"who l"},i("b",null,v[0]),i("div",{class:"hp"},i("u",{id:"hg0"}),i("i",{id:"hp0"})),i("small",{id:"st0"}),i("div",{class:"kit"},m(l.run.load))),i("div",{class:"round"},i("small",null,"Fight"),i("b",null,l.run.round+1+" / "+10)),i("div",{class:"who r"},i("b",null,v[1]),i("div",{class:"hp"},i("u",{id:"hg1"}),i("i",{id:"hp1"})),i("small",{id:"st1"}),i("div",{class:"kit"},l.eLoad?m(l.eLoad):""))),i("div",{class:"msg",id:"bmsg"}),i("div",{class:"floaters"}),i("div",{class:"acts"},i("div",null,i("button",{id:"bpow",onpointerdown:B(()=>bh(l.F[0])&&pn("miss"))},i("i"),i("em",null,"\u2694\uFE0F"),i("span",null,"Power")),i("button",{id:"bgrd",onpointerdown:B(()=>Mh(l.F[0])&&pn("block"))},i("i"),i("em",null,"\u{1F6E1}\uFE0F"),i("span",null,"Guard"))),i("div",null,l.run.load.abilities.map((O,J)=>i("button",{class:"abil",id:"bab"+J,onpointerdown:B(()=>{Sh(l.F,0,J,l.rand,l.queue)&&pn("power")})},i("i"),i("em",null,Yn(O.id,"ability").icon),i("span",null,Yn(O.id,"ability").name))))))}function y(...v){let B=i("div",{class:"panel"},v);return h.append(B),B}function P(v){return i("div",{class:"stats"},...[["Health",v.hp],["Attack",v.atk.toFixed(1)],["Armour",Math.round(v.def*100)+"%"],["Speed",v.spd.toFixed(2)]].map(([B,O])=>i("div",null,i("small",null,B),i("b",null,String(O)))))}function T(){l.phase="gate",h.replaceChildren();let v=hr(l.data),B=Qd(v),O=n.meta();y(i("h2",null,"The Colosseum"),i("p",null,i("b",null,l.data.name)," faces ten fights in a row. Each opponent is tougher and better armed than the last, and the tenth is the reigning champion. After every win you choose one of three rewards."),P(v),i("div",{class:"stats"},i("div",null,i("small",null,"Weapon hands"),i("b",null,String(v.slots))),i("div",null,i("small",null,"Ability slots"),i("b",null,String(v.abilitySlots))),i("div",null,i("small",null,"Revives"),i("b",null,String(O.revives||0)))),i("p",{class:"dim"},B.length?"Traits: "+B.join(", ")+". ":"",v.hands?"Each arm or tentacle can hold one weapon.":"With no hands it can carry a single weapon in its jaws. Add arms or tentacles to wield more."," Wings, tails, horns, venom and the rest decide which abilities and relics can turn up."),i("p",{class:"warn"},"Fights are to the death. If "+l.data.name+" dies with no revive, it is gone for good."),i("p",{class:"runs",id:"gruns"}),i("div",{class:"row"},i("button",{onclick:()=>Q({type:"back"})},"Back to the workshop"),i("button",{class:"ad",id:"gad",onclick:async()=>{let J=await n.showAd();J.ok?(za(O),n.saveMeta(),A()):J.why&&n.toast(J.why)}},"\u{1F4FA} Watch an ad: +1 run"),i("button",{class:"go",id:"ggo",onclick:()=>{if(!of(O)){A();return}n.saveMeta(),pn("block"),(O.boosts.head||0)>0?C("A gift from the crowd","Choose a reward before the first fight."):S()}},"Enter the arena"))),A()}function A(){let v=document.getElementById("gruns");if(!v)return;let B=qi(n.meta());v.textContent="\u26A1 Runs: "+B.n+" / "+B.max+(B.next?" \xB7 next in "+Ha(B.next):"")+(B.n?". Entering uses one.":". None left: wait, or watch an ad."),document.getElementById("ggo").disabled=B.n<=0,document.getElementById("gad").classList.toggle("hidden",B.n>=B.max)}setInterval(()=>{l.phase==="gate"&&A()},1e3);function C(v,B){l.phase="won";let O=hr(l.data),J=l.run.load;l.run.draft||(l.run.draft=cf(Math.random,O,J,n.meta(),l.run.round),s.set("cc.run",l.run)),h.replaceChildren(i("div",{class:"floaters"}));let se=q=>{hf(J,q),l.run.draft=null,s.set("cc.run",l.run),pn("block"),S()},ie=q=>{let re=Yn(q.id,q.cat),ae=q.cat==="ability"&&J.abilities.find(ee=>ee.id===q.id),z=q.cat==="ability"?{...q,lvl:ae?ae.lvl+1+(q.rar>0?1:0):1+q.rar}:q;return i("button",{class:"reward r"+q.rar+" c-"+q.cat,onclick:()=>se(q)},i("small",null,sf[q.rar]+" "+(q.cat==="relic"?"relic":q.cat)+(ae?" \xB7 level up":"")),i("div",{class:"ico"},re.icon),i("b",null,re.name),i("p",null,Wa(z)),q.syn&&i("em",null,"Synergy: "+re.tags.filter(ee=>[...J.weapons,...J.relics,...J.abilities].some(ye=>Yn(ye.id,ye.cat).tags.includes(ee))).join(", ")))};y(i("h2",null,v),i("p",null,B),i("div",{class:"rewards"},l.run.draft.length?l.run.draft.map(ie):i("p",{class:"dim"},"Nothing more fits this body.")),i("p",{class:"dim"},"Hands "+no(J)+"/"+O.slots+" \xB7 Abilities "+J.abilities.length+"/"+O.abilitySlots+" \xB7 Relics "+J.relics.length+(m(J)?"   "+m(J):"")),i("div",{class:"row"},l.run.lastPts>0&&i("button",{class:"ad",onclick:async q=>{let re=await n.showAd();if(!re.ok){re.why&&n.toast(re.why);return}let ae=n.meta();ae.points+=l.run.lastPts,l.run.earned+=l.run.lastPts,n.saveMeta(),n.toast("Doubled: +"+l.run.lastPts+" points"),l.run.lastPts=0,s.set("cc.run",l.run),q.target.remove()}},"\u{1F4FA} Watch an ad: double the "+l.run.lastPts+" points"),l.run.rerolls>0&&i("button",{onclick:()=>{l.run.rerolls--,l.run.draft=null,C(v,B)}},"Reroll ("+l.run.rerolls+" left)"),!l.run.draft.length&&i("button",{class:"go",onclick:()=>{l.run.draft=null,S()}},"Next fight"))).classList.add("wide")}function S(){_(1),_(0);let v=l.run.round===9,B=n.meta(),O=B.boosts;l.views[0]=p(l.data,n.M,-1,l.run.load,l.entered?0:5.5),l.entered=!0,l.enemy=io($r(l.run.seed+l.run.round*7919),{titled:!0}),v&&(l.enemy.name=l.enemy.name.split(" ")[0]+", Champion of the Sands");let J=hr(l.data),se=hr(l.enemy);l.eLoad=uf($r(l.run.seed+l.run.round),se,l.run.round),l.views[1]=p(l.enemy,a,1,l.eLoad,6),v&&l.views[1].holder.scale.setScalar(1.18),l.F=[vh(J,{mods:Lh(l.run.load),abilities:l.run.load.abilities,bonusHp:l.run.bonusHp,boost:{hp:1+.05*(O.vital||0),atk:1+.04*(O.fero||0)}}),vh(se,{mul:ef(l.run.round),mods:Lh(l.eLoad)})],l.run.hp!=null&&(l.F[0].hp=Math.min(l.F[0].max,l.run.hp)),l.rand=Math.random,l.queue=[],b(),L(),l.phase="intro",l.phaseT=0,M(v?"Final fight":"Fight "+(l.run.round+1),"vs "+l.enemy.name)}function M(v,B){let O=document.getElementById("bmsg");O&&O.replaceChildren(v?i("b",null,v):"",B?i("span",null,B):"")}function L(){for(let B=0;B<2;B++){let O=l.F[B],J=document.getElementById("hp"+B);if(!J)continue;let se=pr(O.hp/O.max,0,1),ie=O.st;document.getElementById("hg"+B).style.width=se*100+"%",J.style.width=se*100+"%",J.style.background=ie.poison>0?"#8fd14f":se>.5?"#3fd0a4":se>.25?"#ffb347":"#ff5a4a",J.parentNode.classList.toggle("shield",O.shield>0);let D=Math.max(0,Math.ceil(O.hp))+" / "+O.max+(O.shield>0?" +"+Math.ceil(O.shield):"")+(ie.bleed>0?" \u{1FA78}"+ie.bleed:"")+(ie.poison>0?" \u2623\uFE0F":"")+(ie.burn>0?" \u{1F525}":"")+(ie.stun>0?" \u{1F4AB}":"")+(ie.weak>0?" \u2B07\uFE0F":"")+(ie.slow>0?" \u{1F578}\uFE0F":"")+(ie.blind>0?" \u{1F32B}\uFE0F":"")+(O.buff.shell>0?" \u{1F422}":"")+(O.buff.evade>0?" \u{1F985}":"")+(O.buff.frenzy>0?" \u{1F624}":""),q=document.getElementById("st"+B);q.textContent!==D&&(q.textContent=D)}let v=(B,O,J,se)=>{let ie=document.getElementById(B);ie&&(ie.firstChild.style.height=pr(O/J,0,1)*100+"%",ie.classList.toggle("armed",!!se))};v("bpow",l.F[0].powerCd,7,l.F[0].power),v("bgrd",l.F[0].guardCd,l.F[0].guardEvery,l.F[0].guard>0),l.F[0].abil.forEach((B,O)=>v("bab"+O,B.cd,wh[B.id],!1))}function V(){let v=l.F[0],B=n.meta(),O=af(l.run.round);if(B.points+=O,l.run.earned=(l.run.earned||0)+O,l.run.lastPts=O,n.saveMeta(),l.run.bonusHp=(l.run.bonusHp||0)+v.m.killHp,l.run.round++,l.run.hp=Math.min(v.max,Math.max(1,v.hp)+v.max*(.4+.04*(B.boosts.recov||0)+v.m.killHeal)),l.run.draft=null,l.run.round>=10){G();return}s.set("cc.run",l.run),C(l.enemy.name.split(",")[0]+" is dead","+"+O+" points. "+l.data.name+" recovers to "+Math.round(l.run.hp)+" / "+v.max+" health. "+(l.run.round===9?"Only the champion remains. ":"")+"Choose a reward:")}function G(){l.phase="champion",s.set("cc.run",null),pn("win"),l.cheer=6,_(0),l.views[0]=p(l.data,n.M,-1,l.run.load);let v=nf(l.F[0].hp,l.F[0].max),B=l.run.earned||0;_(1),l.views[0].holder.position.x=0,l.views[0].holder.rotation.y=.35;let O=260,J=new Mi(.09,.14),se=new Vr(J,new Bt({side:Ct}),O),ie=new Le;l.confetti={mesh:se,bits:[]};for(let D=0;D<O;D++)l.confetti.bits.push({x:(Math.random()-.5)*9,y:3+Math.random()*7,z:(Math.random()-.5)*5,v:.8+Math.random()*1.2,r:Math.random()*6,w:1+Math.random()*4}),se.setColorAt(D,ie.setHSL(Math.random(),.9,.6));r.g.add(se),h.replaceChildren(i("div",{class:"floaters"})),y(i("h2",{class:"gold"},"Champion!"),i("p",null,i("b",null,l.data.name)," won all ten fights and rules the Colosseum."),i("div",{class:"stats"},i("div",null,i("small",null,"Fights"),i("b",null,String(B))),i("div",null,i("small",null,"Title"),i("b",null,"+1000")),i("div",null,i("small",null,"Health left"),i("b",null,"+"+(v-1e3))),i("div",null,i("small",null,"Total"),i("b",{class:"gold"},String(v+B)))),i("div",{class:"row"},i("button",{class:"ad",onclick:async()=>{let D=await n.showAd();D.ok?Q({type:"champion",points:v*2}):D.why&&n.toast(D.why)}},"\u{1F4FA} Watch an ad: double the title prize (+"+v+")"),i("button",{class:"go",onclick:()=>Q({type:"champion",points:v})},"Take the crown"))).classList.add("low")}function Y(){l.phase="dead",pn("lose"),h.querySelector(".acts").classList.add("hidden"),M("","");let v=n.meta(),B=l.run.earned||0;y(i("h2",{class:"red"},l.data.name+" has fallen"),i("p",null,"Killed by "+l.enemy.name+" in fight "+(l.run.round+1)+" of "+10+", after "+l.run.round+(l.run.round===1?" win":" wins")+" and "+B+" points earned."),!l.run.adRevived&&i("p",null,"The crowd wants more: watch an ad to bring it back once, at half health."),v.revives>0?i("p",null,"You hold "+v.revives+(v.revives===1?" revive.":" revives.")+" Using one brings it back at half health to fight "+l.enemy.name.split(",")[0]+" again."):i("p",{class:"dim"},"The dead do not return. Build a new creature and try again. Revives are sold in the shop."),i("div",{class:"row"},!l.run.adRevived&&i("button",{class:"ad",onclick:async()=>{let O=await n.showAd();if(!O.ok){O.why&&n.toast(O.why);return}l.run.adRevived=!0,l.run.hp=Math.round(l.F[0].max*.5),s.set("cc.run",l.run),pn("win"),S()}},"\u{1F4FA} Watch an ad to revive"),v.revives>0&&i("button",{class:"go",onclick:()=>{v.revives--,n.saveMeta(),l.run.hp=Math.round(l.F[0].max*.5),s.set("cc.run",l.run),pn("win"),S()}},"Use a revive"),i("button",{class:v.revives>0||!l.run.adRevived?"":"go",onclick:()=>{s.set("cc.run",null),Q({type:"dead",round:l.run.round,by:l.enemy.name})}},v.revives>0?"Let it die":"Create a new creature"))).classList.add("low")}function Q(v){_(0),_(1),l.confetti&&(r.g.remove(l.confetti.mesh),l.confetti.mesh.geometry.dispose(),l.confetti=null),l.active=!1,l.phase="off",r.g.visible=!1,e.background=u,o.clear(),Nh(n.M),t.zoom=1,h.classList.add("hidden"),h.replaceChildren(),n.onDone(v)}function $(v,B,O,J){let se=l.F&&l.F[B],ie=Dh(),D=v.rig,q=Math.sin(J*2+v.ph);if(ie.sy=1+q*.012,ie.y=v.hover?Math.sin(J*1.3+v.ph)*.06:0,v.st.wings&&(ie.flap=v.hover?.3:.05),v.walk>0){let z=Math.min(v.walk,4.6*O);v.walk-=z,v.holder.position.x=v.side*(.75+v.walk),ie.gait=1,ie.y+=Math.abs(Math.sin(D.gaitPh))*.04,ie.pitch=.04,v.fxT+=O,v.fxT>.16&&(v.fxT=0,o.burst("dust",g(v,new I(0,.05,-v.len*.5)),2,{speed:.5}))}else if(v.dead>=0){v.dead+=O;let z=Math.min(1,v.dead/.75),ee=z*z*(3-2*z);Object.assign(ie,{roll:1.48*ee*(B?-1:1),y:Math.sin(ee*Math.PI/2)*v.half*.85+Math.sin(z*Math.PI)*.25,z:-.5*ee,pitch:-.2*Math.sin(z*Math.PI),legF:-.5*ee,legH:.55*ee,legOut:.35*ee,armAll:-.7*ee,armOut:.5*ee,wing:-.7*ee,tent:-.6*ee,tailUp:-.3*ee,wag:0,flap:0,sy:1-.06*ee}),z>=.8&&!v.thud&&(v.thud=!0,o.burst("dust",g(v,new I(0,.1,-v.len*.5)),26,{spread:v.len*.8}),l.shake=Math.max(l.shake,.18))}else if(l.phase==="champion"||l.phase==="ending"&&l.winner===B&&l.phaseT>.5){let z=Math.abs(Math.sin(J*5.5));Object.assign(ie,{y:ie.y+z*.22,sy:1+(z-.5)*.08,armAll:-2.7,armOut:.35,wing:.7,flap:.5,tailUp:.5,wag:3,pitch:-.15,tent:-.9,legF:-.25*z})}else se&&l.phase==="fight"&&(se.st.stun>0?Object.assign(ie,{roll:.13*Math.sin(J*9),pitch:.12,legOut:.12,armAll:.2,wing:-.3,wag:0,sy:.96}):(v.strikeT<0&&se.t<.45?(v.winding||(v.winding=!0,v.style=v.styles[v.styleN++%v.styles.length],v.power=se.power,D.armSel=D.arms?v.styleN%D.arms:-1,se.power&&D.arms>1&&(D.armSel=-1)),Object.assign(ie,Uh(v.style,1-se.t/.45,-1,v.power))):v.strikeT<0&&(v.winding=!1),v.strikeT>=0&&(Object.assign(ie,Uh(v.style,1,v.strikeT,v.power)),v.strikeT+=O,v.strikeT>_f&&(v.strikeT=-1,v.winding=!1)),se.guard>0&&Object.assign(ie,{sy:.9,pitch:.12,armAll:-1.4,armOut:.3,wing:.7,z:(ie.z||0)-.12,legF:.15,tailUp:-.2}),se.buff.shell>0&&(ie.sy=.82,ie.legOut=.2,ie.armAll=-.8),se.buff.frenzy>0&&(ie.sy*=1+.03*Math.sin(J*22),ie.wag=4),se.buff.evade>0&&(ie.y+=1.3,ie.flap=1,ie.pitch=-.2)));if(v.recoil>0){v.recoil=Math.max(0,v.recoil-O*3.2);let z=v.recoil;ie.z=(ie.z||0)-.5*z,ie.pitch=(ie.pitch||0)-.28*z,ie.roll=(ie.roll||0)+.14*z*Math.sin(J*30),ie.legF=(ie.legF||0)-.35*z,ie.armAll=(ie.armAll||0)+.5*z,ie.wing=(ie.wing||0)+.4*z,ie.sy=ie.sy*(1-.06*z)}if(v.dodge>=0)if(v.dodge+=O*3.2,v.dodge>=1)v.dodge=-1;else{let z=Math.sin(v.dodge*Math.PI);ie.x=(ie.x||0)+.95*z,ie.roll=(ie.roll||0)-.35*z,ie.z=(ie.z||0)-.3*z,ie.gait=1}xf(D,ie,O,v.pose),v.flash=Math.max(0,v.flash-O*5);let re=se&&se.guard>0?.1:0,ae=se&&se.buff.shell>0?.12:0;for(let z of[v.mats.skin,...v.mats.shells])z.emissive.setRGB(v.flash*.5+re*.2+ae,re*.6+ae,re+ae);if(v.holder.updateMatrixWorld(!0),se&&v.dead<0&&l.phase==="fight"&&(v.fxT+=O,v.fxT>.07)){v.fxT=0;let z=()=>g(v,new I((Math.random()-.5)*v.half*1.6,v.mid.y*(.4+Math.random()*1.2),-v.len*Math.random()));se.st.burn>0&&o.burst("fire",z(),2,{spread:.15}),se.st.poison>0&&Math.random()<.5&&o.burst("venom",z(),1,{spread:.1}),se.st.bleed>0&&Math.random()<.12*se.st.bleed&&o.burst("blood",z(),1,{speed:.3}),se.st.stun>0&&o.burst("star",g(v,v.head),1,{spread:.5,speed:.4}),se.shield>0&&Math.random()<.4&&o.burst("shield",z(),1,{speed:.2}),se.buff.frenzy>0&&o.burst("fire",z(),1,{spread:.1,size:.6}),se.st.blind>0&&o.burst("ink",g(v,v.head),1,{spread:.4,speed:.3,size:.6}),se.st.slow>0&&Math.random()<.4&&o.burst("web",z(),1,{speed:.2})}}function ce(v){if(v.type==="dot"){x(v.on,"-"+v.dmg,v.kind==="venom"?"venom":v.kind==="burn"?"burn":"bleed"),o.burst(v.kind==="venom"?"venom":v.kind==="burn"?"fire":"blood",g(l.views[v.on],l.views[v.on].mid),6);return}if(v.type==="cast"){let D=l.views[v.by],q=l.views[1-v.by];x(v.by,v.name,"cast"),pn("miss"),D.style="roar",D.strikeT=0,D.power=!1;let re={"Ink Cloud":["ink",q,26],Web:["web",q,40],"Venom Spit":["venom",q,26],Roar:["magic",D,14],"Shell Up":["shield",D,22],Frenzy:["fire",D,22],Dive:["dust",D,18]}[v.name]||["magic",D,16];o.burst(re[0],g(re[1],re[1].mid),re[2],{spread:.9}),v.name==="Roar"&&(o.ring(g(D,D.front),16766826,3.2,!1),l.shake=.15),v.name==="Shell Up"&&o.ring(g(D,new I(0,.05,-D.len/2)),8376575,2);return}if(v.type==="heal"){x(v.on,v.name,"venom"),pn("win"),o.burst("heal",g(l.views[v.on],l.views[v.on].mid),30,{spread:1.1});return}let B=l.views[v.by],O=l.views[1-v.by];if(v.name&&f[v.name]){let D=f[v.name];B.style=D==="tail"&&!B.rig.kinds.has("tail")||D==="slash"&&!B.rig.arms||D==="lash"&&!B.rig.kinds.has("tentacle")?"lunge":D,B.rig.armSel=-1}if(B.strikeT=0,B.power=!!v.power||!!v.ability,v.name&&x(v.by,v.name,"cast"),v.miss){x(1-v.by,"Miss","dim"),pn("miss"),O.dodge=0,o.burst("dust",g(O,new I(0,.05,-O.len*.4)),8);return}let J=v.power||v.crit||v.ability,se=g(O,O.front);O.recoil=v.blocked?.3:J?1:.6,v.blocked||(O.flash=1),l.shake=v.blocked?.05:v.power?.3:J?.2:.1,l.cheer=Math.max(l.cheer,J?1:.4),l.freeze=v.blocked?.03:J?.09:.045,J&&!v.blocked&&(l.punch=.07),v.blocked?(o.burst("shield",se,16),o.ring(se,8376575,1.1,!1)):(o.burst("spark",se,J?22:10,{dir:new I(-B.side,.3,0)}),o.burst("dust",g(O,new I(0,.05,-O.len*.4)),J?10:4),J&&o.ring(se,v.crit?16766826:16777215,v.power?1.8:1.3,!1),(v.bleed||v.crit)&&o.burst("blood",se,10),(v.burn||v.name==="Fire Breath")&&o.burst("fire",se,24,{spread:.8}),v.venom&&o.burst("venom",se,14,{spread:.6}),v.stun&&o.burst("star",g(O,O.head),12,{spread:.5})),x(1-v.by,(v.blocked?"Blocked ":"")+"-"+v.dmg+(v.crit?"!":""),v.blocked?"dim":J?"big":""),v.thorns&&(x(v.by,"-"+v.thorns,"dim"),o.burst("spark",g(B,B.front),6)),v.riposte&&(x(v.by,"Riposte -"+v.riposte,"dim"),B.recoil=.5,B.flash=1);let ie=v.stun?"Stunned":v.venom?"Poisoned":v.burn?"Burning":v.bleed?"Bleeding":"";ie&&x(1-v.by,ie,v.venom?"venom":v.burn?"burn":"bleed"),pn(v.blocked?"block":J?"power":"hit")}return l.update=(v,B)=>{let O=v;if(l.freeze>0&&(l.freeze-=v,O=v*.05),l.slow>0&&(l.slow-=v,O*=.3),l.t+=O,l.phaseT+=O,l.phase==="intro"&&l.phaseT>1.9&&(l.phase="fight",l.phaseT=0,M("Fight!",""),setTimeout(()=>l.phase==="fight"&&M("",""),700)),l.phase==="fight"){let D=l.queue.splice(0),q=.15+.035*l.run.round,re=-1;for(let ae=0;ae<2&&re<0;ae++)Eh(l.F,1,O/2,l.rand,q,D),l.auto&&Eh(l.F,0,O/2,l.rand,.5,D),re=tf(l.F,O/2,l.rand,D);D.forEach(ce),L(),re>=0&&(l.phase="ending",l.phaseT=0,l.winner=re,l.views[1-re].dead=0,l.cheer=3,l.slow=.9,l.punch=.14,M("K.O.",""),re===0&&pn("win"))}l.phase==="ending"&&l.phaseT>2.1&&(l.winner===0?V():Y());for(let D=0;D<2;D++)l.views[D]&&$(l.views[D],D,O,l.t);o.resize(window.innerHeight),o.update(O),l.cheer=Math.max(0,l.cheer-O*.8);let J=.03+.14*Math.min(l.cheer,1);r.seats.forEach((D,q)=>{r.m4.makeTranslation(D.x,D.y+Math.abs(Math.sin(B*6*(1+q%5*.2)+D.ph))*J,D.z),r.crowd.setMatrixAt(q,r.m4)}),r.crowd.instanceMatrix.needsUpdate=!0,l.confetti&&(l.confetti.bits.forEach((D,q)=>{D.y-=D.v*O,D.y<0&&(D.y=8),r.m4.makeRotationFromEuler(new un(D.r+l.t*D.w,D.r*2+l.t*D.w*.7,0)).setPosition(D.x+Math.sin(l.t+D.r)*.3,D.y,D.z),l.confetti.mesh.setMatrixAt(q,r.m4)}),l.confetti.mesh.instanceMatrix.needsUpdate=!0),l.shake=Math.max(0,l.shake-v*1.2);let se=pr(1.9/t.aspect,1,1.6),ie=l.phase==="champion";l.punch=Math.max(0,l.punch-v*.35),Math.abs(t.zoom-(1+l.punch))>5e-4&&(t.zoom=1+l.punch,t.updateProjectionMatrix()),t.position.set(Math.sin(l.t*.25)*.8+(Math.random()-.5)*l.shake,(ie?1.5:1.9)+(Math.random()-.5)*l.shake,(ie?7.2:7.1)*se),t.lookAt(0,ie?-.25:1.05,0)},l.start=(v,B)=>{l.data=v,l.active=!0,l.t=0,l.enemy=null,l.F=null,l.entered=!1,l.freeze=l.slow=l.punch=0,n.sun.target.position.set(0,0,0),n.sun.position.set(3,7,5),l.run=B||{id:v.id,round:0,hp:null,seed:Math.floor(Math.random()*1e9),load:Ga(),bonusHp:0,earned:0,rerolls:n.meta().boosts.reroll||0,draft:null},l.run.load||(l.run.load=Ga()),l.eLoad=null,l.queue=[],u=e.background,e.background=r.sky,r.g.visible=!0,h.classList.remove("hidden"),l.views[0]=p(v,n.M,-1,l.run.load),l.run.draft?C("Back to the sands","Choose your reward:"):l.run.round>0?(l.phase="won",h.replaceChildren(),y(i("h2",null,"Back to the sands"),i("p",null,l.data.name+" has won "+l.run.round+" of "+10+" fights and has "+Math.round(l.run.hp)+" health."),i("div",{class:"row"},i("button",{class:"go",onclick:()=>S()},"Next fight")))):T()},l.back=()=>(l.phase==="gate"&&Q({type:"back"}),!0),l}var Xa=null;window.ccAdDone=(n,e)=>{let t=Xa;Xa=null,t&&t({ok:!!n,why:e||""})};function Fh(){return Xa?Promise.resolve({ok:!1,why:"busy"}):new Promise(n=>{if(Xa=n,window.Android&&window.Android.showRewarded){window.Android.showRewarded();return}if(window.__ccAdInstant){window.ccAdDone(!0);return}let e=document.createElement("div");e.className="adph";let t=3,i=()=>{e.innerHTML="<div><small>Ad placeholder</small><b>"+t+"</b><p>The Android app shows a real rewarded ad here.</p></div>"};i(),document.body.append(e);let s=setInterval(()=>{t--,t<=0?(clearInterval(s),e.remove(),window.ccAdDone(!0)):i()},1e3)})}var Tt=n=>document.getElementById(n);function K(n,e,...t){let i=document.createElement(n);for(let[s,r]of Object.entries(e||{}))s==="class"?i.className=r:s==="style"?i.style.cssText=r:s.startsWith("on")?i.addEventListener(s.slice(2),r):r!==!1&&r!=null&&(i[s]=r);for(let s of t.flat())s!=null&&s!==!1&&i.append(s);return i}var Et={get(n,e){try{let t=localStorage.getItem(n);return t?JSON.parse(t):e}catch{return e}},set(n,e){try{localStorage.setItem(n,JSON.stringify(e))}catch{}}};function Rn(n){let e=Tt("toast");e.textContent=n,e.classList.remove("hidden"),clearTimeout(Rn.t),Rn.t=setTimeout(()=>e.classList.add("hidden"),2200)}var ws=Tt("view"),Mt=new aa({canvas:ws,antialias:!0,powerPreference:"high-performance"});Mt.setPixelRatio(Math.min(window.devicePixelRatio||1,2));Mt.toneMapping=Jc;Mt.toneMappingExposure=1.05;var kt=new Qs;{let n=document.createElement("canvas");n.width=4,n.height=256;let e=n.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"#3d7f86"),t.addColorStop(.55,"#1c3a40"),t.addColorStop(1,"#0c1719"),e.fillStyle=t,e.fillRect(0,0,4,256);let i=new ii(n);i.colorSpace=Ot,kt.background=i}var av=new js(Mt);kt.environment=av.fromScene(new Ta,.04).texture;kt.environmentIntensity=.55;var Nn=new Xr(16773853,2.2);Nn.position.set(2.5,5,4);kt.add(Nn);kt.add(Nn.target);Mt.shadowMap.enabled=!0;Mt.shadowMap.type=$c;Nn.castShadow=!0;Nn.shadow.mapSize.set(1024,1024);Nn.shadow.bias=-6e-4;Nn.shadow.normalBias=.025;Nn.shadow.radius=3;Object.assign(Nn.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.5,far:22});var Af=new Xr(10475775,.9);Af.position.set(-3,2.5,-4);kt.add(Af);kt.add(new ga(13626111,3813160,.5));var ft=new Gt(32,1,.05,100),An=Ca(),Kn=new wt;kt.add(Kn);var ai=new Ne(new Wn(1,1.06,.06,64),new Ut({color:2377804,roughness:.85})),$n=new Ne(new er(1,48),new Bt({transparent:!0,depthWrite:!1,opacity:.55}));{let n=document.createElement("canvas");n.width=n.height=128;let e=n.getContext("2d"),t=e.createRadialGradient(64,64,4,64,64,64);t.addColorStop(0,"rgba(0,0,0,1)"),t.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=t,e.fillRect(0,0,128,128),$n.material.map=new ii(n),$n.material.color.set(0),$n.rotation.x=-Math.PI/2}ai.receiveShadow=!0;$n.material.opacity=.3;Kn.add(ai,$n);var Jn=new wt;kt.add(Jn);var bs=new Ne(new dn(1,.12,8,32),new Bt({color:16757575,depthTest:!1,transparent:!0,opacity:.9}));bs.renderOrder=10;Jn.add(bs);var lv=new nn(1,16,12),cv=new Bt({color:16777215,depthTest:!1,transparent:!0,opacity:.9}),hv=new Bt({color:16757575,depthTest:!1,transparent:!0}),Ai=new wt;Jn.add(Ai);var lo=new ha(new ct,new Gr({color:16777215,depthTest:!1,transparent:!0,opacity:.6}));lo.renderOrder=9;Jn.add(lo);var Zt={orbit:null},de=null,pt=null,mt=null,xn="body",Zn=-1,co=!1,ln=!1,Un=[],gr=[];function gn(){pt&&(Kn.remove(pt.group),Yi(pt.group)),si(An,de.look,At[de.type].bellyDir),pt=cr(de,An),Kn.add(pt.group),Gh(),po()}function Gh(){Ms=!0;let n=Qr(pt),e=n.getCenter(new I),t=n.getSize(new I),i=Math.max(t.x,t.z)*.42+.15;ai.position.set(e.x,n.min.y-.03,e.z),ai.scale.set(i,1,i),Nn.target.position.copy(e),Nn.position.copy(e).add(new I(2.5,5,4)),$n.position.set(e.x,n.min.y+.004,e.z),$n.scale.set(Math.max(t.x,.3)*.75,Math.max(t.z,.3)*.62,1),pt.box=n}function Wh(n){let e=pt.box,t=e.getCenter(new I),i=e.getSize(new I).length()/2,s=i/Math.sin(Zr.degToRad(ft.fov/2))*.74;Zt.orbit.target.copy(t),ft.position.copy(t).add((n||new I(.75,.28,1)).normalize().multiplyScalar(s)),Zt.orbit.minDistance=i*.5,Zt.orbit.maxDistance=s*2.5,Zt.orbit.update()}function po(){Ms=!0;let n=ln&&xn==="body";for(Ai.visible=lo.visible=n;Ai.children.length;)Ai.remove(Ai.children[0]);if(n){let t=[],i=(pt.frames.m-1)/(de.nodes.length-1);de.nodes.forEach((s,r)=>{let o=pt.frames.C[Math.round(r*i)],a=new Ne(lv,r===Zn?hv:cv);a.position.copy(o),a.userData.node=r,a.renderOrder=11,Ai.add(a),t.push(o)}),lo.geometry.dispose(),lo.geometry=new ct().setFromPoints(t)}let e=mt&&mt!=="body"&&pt.parts.get(mt);bs.visible=!!(ln&&e&&e.userData.anchor),bs.visible&&bs.position.copy(e.userData.anchor)}function _n(){var e;let n=JSON.stringify(de);Un[Un.length-1]!==n&&(Un.push(n),Un.length>60&&Un.shift(),gr=[]),Et.set("cc.current",de),ln&&((e=document.activeElement)==null?void 0:e.tagName)!=="INPUT"&&qh()}function Sf(n){de=JSON.parse(n),mt&&mt!=="body"&&!de.parts.find(e=>e.id===mt)&&(mt=null),gn(),Ci(),Et.set("cc.current",de)}var uo=n=>de.parts.find(e=>e.id===n),Oh=new Vn(256,256,{samples:4}),so=new Gt(30,1,.01,100);function Rf(n,e,t,i,s){let r=t.getCenter(new I),o=Math.max(t.getSize(new I).length()/2,.01);so.aspect=n/e,so.updateProjectionMatrix(),so.position.copy(r).add(i.clone().normalize().multiplyScalar(o/Math.sin(Zr.degToRad(15))*(n>e?.92:1.02))),so.lookAt(r),Oh.setSize(n,e);let a=Jn.visible;Jn.visible=!1;let c=Mt.toneMapping;Mt.toneMapping=ni,Mt.setRenderTarget(Oh),Mt.render(kt,so),Mt.setRenderTarget(null),Mt.toneMapping=c,Jn.visible=a;let h=new Uint8Array(n*e*4);Mt.readRenderTargetPixels(Oh,0,0,n,e,h);let l=document.createElement("canvas");l.width=n,l.height=e;let u=l.getContext("2d"),f=u.createImageData(n,e),p=new Uint8Array(256);for(let g=0;g<256;g++)p[g]=Math.round(255*Math.pow(Math.min(g/255*1.1,1),1/2.2));for(let g=0;g<e;g++)for(let _=0;_<n;_++){let m=((e-1-g)*n+_)*4,d=(g*n+_)*4;f.data[d]=p[h[m]],f.data[d+1]=p[h[m+1]],f.data[d+2]=p[h[m+2]],f.data[d+3]=255}return u.putImageData(f,0,0),l.toDataURL(s||"image/jpeg",.85)}function qa(n){let e=pt,t=ai.visible;e&&(e.group.visible=!1),si(An,n.look,At[n.type].bellyDir);let i=cr(n,An);Kn.add(i.group),ai.visible=$n.visible=!1;let s=Rf(240,192,Qr(i),new I(.8,.25,1));return Kn.remove(i.group),Yi(i.group),ai.visible=$n.visible=t,e&&(e.group.visible=!0,si(An,de.look,At[de.type].bellyDir)),s}var Bh={},uv={base:"#9fb6b0",second:"#5c7a76",belly:"#c9d8d2",bellyAmt:.5,pattern:0,patScale:1,cover:"skin",furLen:0,furDroop:0,accent:"#efe6cf",hair:"#d98a3a",membrane:"#d99a8a",eye:"#3f9f6a"};function zh(n){if(Bh[n])return Bh[n];let e=Pt[n],t={type:"quadruped",sex:"f",dimorph:0,bulk:1,stretch:1,look:uv,parts:[],nodes:[{y:0,z:-.25,rx:.3,ry:.3},{y:0,z:.25,rx:.3,ry:.3}]},i={limbs:[.5,1.9],wings:[.5,.9],tails:[-.9,0],back:[.5,0],mouth:[1.9,Math.PI],eyes:[1.3,1]}[e.cat]||[.6,.6],s=pt;s&&(s.group.visible=!1),si(An,t.look,[0,-1,0]);let r=cr(t,An),o=oi(t,n,r.frames,i,{mirror:!1,size:e.kind==="surface"?.3:e.ridge?.18:.7}),a=ka(r,o);r.body.visible=e.ridge||n==="shell",Kn.add(r.group);let c=ai.visible;ai.visible=$n.visible=!1;let h=kt.background;kt.background=new Le(1452075);let l=new wn().setFromObject(e.ridge?r.group:a),u={mouth:[1,.3,.8],eyes:[.6,.2,1],tails:[1,.3,-.3],limbs:[1,.15,.7]}[e.cat]||[1,.4,.8],f=Rf(112,112,l,new I(...u),"image/png");return kt.background=h,ai.visible=$n.visible=c,Kn.remove(r.group),Yi(r.group),s&&(s.group.visible=!0,si(An,de.look,At[de.type].bellyDir)),Bh[n]=f}var ro={x:0,y:0,w:1,h:1};function yr(){let n=window.innerWidth,e=window.innerHeight;if(Mt.setSize(n,e,!1),Ji.active){ft.clearViewOffset(),ft.aspect=n/e,ft.zoom=1,ft.updateProjectionMatrix();return}let t=0,i=0,s=0;ln&&(t=Tt("left").getBoundingClientRect().right,s=Tt("topbar").getBoundingClientRect().bottom,i=Tt("right").classList.contains("hidden")?0:n-Tt("right").getBoundingClientRect().left),ro={x:t,y:s,w:Math.max(n-t-i,50),h:Math.max(e-s,50)},ft.aspect=n/e;let r=t+ro.w/2,o=s+ro.h/2;ft.setViewOffset(n,e,n/2-r,e/2-o,n,e),ft.zoom=Math.min(ro.w,ro.h*1.15)*.82/e,ft.updateProjectionMatrix(),Ms=!0}window.addEventListener("resize",()=>{ln&&!Ji.active?Ci():yr()});var wf=performance.now();function Cf(n){requestAnimationFrame(Cf);let e=Math.min((n-wf)/1e3,.1);if(wf=n,window.__ccPause)return;if(Ji.active){Ji.update(e,n/1e3),Mt.render(kt,ft);return}if(!ln||!pt||(Zt.orbit.autoRotate=co,Zt.orbit.update(e),$i&&($i=!1,gn()),!Ms&&!co))return;Ms=!1;let i=ft.position.distanceTo(Zt.orbit.target)*.0075/ft.zoom;Ai.children.forEach(s=>s.scale.setScalar(i*(s.userData.node===Zn?1.5:1.1))),bs.scale.setScalar(i*1.7),bs.quaternion.copy(ft.quaternion),Mt.render(kt,ft)}var $i=!1,Ms=!0,dv=()=>{Ms=!0},fo=new ya,Ef=new Se,ot={id:-1,x:0,y:0,t:0,mode:null,moved:!1,node:-1,count:0};function Za(n){Ef.set(n.clientX/window.innerWidth*2-1,-(n.clientY/window.innerHeight)*2+1),fo.setFromCamera(Ef,ft)}function Xh(){let n=fo.intersectObject(pt.group,!0);for(let e of n){let t=e.object;for(;t&&!t.userData.partId;)t=t.parent;if(t)return t.userData.partId}return null}ws.addEventListener("pointerdown",n=>{if(ln){if(ot.count++,ot.count>1){ot.mode&&Pf(),ot.mode=null,Zt.orbit.enabled=!0;return}if(Object.assign(ot,{id:n.pointerId,x:n.clientX,y:n.clientY,t:performance.now(),mode:null,moved:!1}),Za(n),xn==="body"){let e=fo.intersectObjects(Ai.children),t=-1,i=20;if(Ai.children.forEach(s=>{let r=s.position.clone().project(ft),o=(r.x*.5+.5)*innerWidth-n.clientX,a=(-r.y*.5+.5)*innerHeight-n.clientY,c=Math.hypot(o,a);c<i&&(i=c,t=s.userData.node)}),e.length&&(t=e[0].object.userData.node),t>=0){ot.mode="node",ot.node=t,Zn=t,Zt.orbit.enabled=!1,po(),qn();return}}mt&&mt!=="body"&&Xh()===mt&&(ot.mode="part",Zt.orbit.enabled=!1,jr(pt,mt))}},!0);ws.addEventListener("pointermove",n=>{if(!(!ln||n.pointerId!==ot.id)&&(Math.hypot(n.clientX-ot.x,n.clientY-ot.y)>9&&(ot.moved=!0),!(!ot.mode||!ot.moved))){if(Za(n),ot.mode==="node"){let e=fo.ray.intersectPlane(new Mn(new I(1,0,0),0),new I);if(e){let t=de.nodes[ot.node];t.y=e.y,t.z=e.z,$i=!0}}else if(ot.mode==="part"){let e=fo.intersectObject(pt.body,!1)[0];if(e&&e.uv){let t=uo(mt);t.u=e.uv.x,t.a=e.uv.y*Math.PI*2,t.mirror&&(t.a=_h(t).a),ka(pt,t),po()}}}});function Pf(){ot.mode==="part"&&(jr(pt),Gh()),ot.mode&&ot.moved&&_n(),Zt.orbit.enabled=!0}function If(n){if(!ln||(ot.count=Math.max(0,ot.count-1),n.pointerId!==ot.id))return;ot.id=-1;let e=!ot.moved&&performance.now()-ot.t<450;if(Pf(),e&&ot.mode!=="node"){Za(n);let t=Xh();xr(t)}ot.mode=null}ws.addEventListener("pointerup",If);ws.addEventListener("pointercancel",If);function xr(n){if(mt=n,n&&n!=="body"){let e=Pt[uo(n).kind].cat;xn!==e&&(xn=e)}n==="body"&&(xn="body"),Ci()}function an(n,e,t,i,s,r,o){let a=K("span",null,""),c=()=>h.style.setProperty("--p",(h.value-e)/(t-e)*100+"%"),h=K("input",{type:"range",min:e,max:t,step:o||(t-e)/200,value:i,oninput:()=>{c(),s(parseFloat(h.value))},onchange:()=>{(r||_n)(parseFloat(h.value))}});return c(),K("div",{class:"sl"},K("label",null,n,a),h)}function _r(n,e,t){return K("div",{class:"chips"},n.map(([i,s])=>K("button",{class:i===e?"on":"",onclick:()=>t(i)},s)))}var fv=["#f4f0e6","#d9d2c2","#a8a29a","#6b6660","#3a3632","#14100e","#f3e6d0","#e8c9a0","#c99573","#a06a45","#6b4a2e","#3a2616","#f2c230","#e8a020","#d9702a","#c8501c","#a8301c","#701818","#f2a0b0","#e06a8a","#c4472e","#b03080","#7a3aa0","#4a2a7a","#bfe8e0","#7fc4d0","#3a9fc2","#2f7fc2","#1f4f9a","#1c2f5a","#c8e6a0","#9fb86a","#4faa4a","#2f6b3a","#1f4a3a","#12281a","#e6dfa0","#b8b060","#7a8a3a","#8fb0ab"],pv=[["base","Main"],["second","Pattern"],["belly","Belly"],["eye","Eyes"],["accent","Horn, claw"],["hair","Hair, feather"],["membrane","Wing skin"],["cloth","Cloth"]],oo="base",mv=n=>n==="eye";function Zi(n,e,t){de.look[n]=e,mv(n)||n==="cover"?t||n==="cover"?gn():$i=!0:si(An,de.look,At[de.type].bellyDir),Ms=!0,t&&_n()}var gv={body:'<path d="M7 5c5-3 11 1 10 7s-6 9-10 7-4-11 0-14z"/>',eyes:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',mouth:'<path d="M3 9c3 2 15 2 18 0-1 7-5 9-9 9s-8-2-9-9z"/><path d="M8 10l1 3 1.5-3M13.5 10l1.5 3 1-3"/>',ears:'<path d="M5 20C3 12 6 4 9 3c2 4 3 8 2 13M19 20c2-8-1-16-4-17-2 4-3 8-2 13"/>',horns:'<path d="M7 20c-4-5-4-12 0-17 0 6 2 9 5 11M17 20c4-5 4-12 0-17 0 6-2 9-5 11"/>',limbs:'<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17" cy="9" r="2"/><path d="M7 17c0-3 2-5 5-5s5 2 5 5-2 3-5 3-5 0-5-3z"/>',wings:'<path d="M3 6c7-2 14 1 18 8-4-1-6 0-8 2-1-3-4-4-6-3 0-3-2-5-4-7z"/>',tails:'<path d="M4 18c6 2 12-2 12-7s-5-6-7-3 1 5 4 4"/>',back:'<path d="M2 18c4-6 16-6 20 0M7 13l1-5 2 4M12 12l1-6 1.5 6M16 13l2-4 0 5"/>',skin:'<path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z"/>'},_v=n=>{let e=document.createElement("span");return e.innerHTML='<svg class="ic" viewBox="0 0 24 24">'+gv[n]+"</svg>",e.firstChild};function xv(){let n=Tt("tabs");n.replaceChildren();for(let[e,t]of[["body","Body"],...Da,["skin","Skin"]])n.append(K("button",{class:xn===e?"on":"",onclick:()=>{xn=e,mt=null,Ci()}},_v(e),t))}var Hh=()=>window.innerWidth<1e3;function qn(){let n=Tt("left");if(n.replaceChildren(),n.scrollTop=0,Hh()&&mt&&mt!=="body"&&uo(mt)){Yh(n,uo(mt));return}if(xn==="body"){if(n.append(K("h3",null,"Body shape"),K("p",{class:"note"},"Drag the white dots to bend and stretch the spine. Tap a dot to change how thick the body is there.")),Zn>=0&&de.nodes[Zn]){let i=de.nodes[Zn];n.append(K("h4",null,"Selected section"),an("Width",.02,.6,i.rx,s=>{i.rx=s,$i=!0}),an("Depth",.02,.6,i.ry,s=>{i.ry=s,$i=!0}),K("div",{class:"row"},K("button",{onclick:()=>{let s=Math.min(Zn,de.nodes.length-2),r=de.nodes[s],o=de.nodes[s+1],a=de.nodes.length-1;de.nodes.splice(s+1,0,{y:(r.y+o.y)/2,z:(r.z+o.z)/2,rx:(r.rx+o.rx)/2,ry:(r.ry+o.ry)/2,role:o.role});for(let c of de.parts)if(c.u>=0&&c.u<=1){let h=c.u*a;c.u=(h>s?h<s+1?s+(h-s)*2:h+1:h)/(a+1)}Zn=s+1,gn(),_n(),qn()}},"Add section"),K("button",{class:"warn",disabled:de.nodes.length<=3,onclick:()=>{let s=de.nodes.length-1,r=Zn;de.nodes.splice(r,1);for(let o of de.parts)if(o.u>=0&&o.u<=1){let a=o.u*s;o.u=En((a>r?a-1:a)/(s-1),0,1)}Zn=-1,gn(),_n(),qn()}},"Remove")))}let t=i=>{let s=de.nodes.reduce((o,a)=>o+a.y,0)/de.nodes.length,r=de.nodes.reduce((o,a)=>o+a.z,0)/de.nodes.length;for(let o of de.nodes)o.y=s+(o.y-s)*i,o.z=r+(o.z-r)*i;gn(),_n()};n.append(K("h4",null,"Whole body"),K("div",{class:"row"},K("button",{onclick:()=>t(1.08)},"Longer"),K("button",{onclick:()=>t(1/1.08)},"Shorter")),an("Bulk",.5,1.8,de.bulk,i=>{de.bulk=i,$i=!0}),K("h4",null,"Male / female"),K("p",{class:"note"},"How different the two sexes look: build, limb thickness, and the size of horns, crests and manes."),an("Difference",0,1.6,de.dimorph,i=>{de.dimorph=i,$i=!0}));return}if(xn==="skin"){let t=de.look;n.append(K("h3",null,"Skin and colour"),K("h4",null,"Covering"),_r([["skin","Smooth"],["fur","Fur"],["scales","Scales"],["chitin","Shell"],["slime","Slick"]],t.cover,r=>{Zi("cover",r,!0),qn()})),t.cover==="fur"&&n.append(an("Fur length",0,1,t.furLen,r=>Zi("furLen",r)),an("Shagginess",0,1,t.furDroop,r=>Zi("furDroop",r))),n.append(K("h4",null,"Colours"),K("div",{class:"cols"},pv.map(([r,o])=>K("button",{class:"colbtn"+(oo===r?" on":""),onclick:()=>{oo=r,qn()}},K("i",{style:"background:"+t[r]}),o))),K("div",{class:"sw"},fv.map(r=>K("button",{style:"background:"+r,onclick:()=>{Zi(oo,r,!0),qn()}}))));let i={};new Le(t[oo]).getHSL(i);let s=r=>{Zi(oo,"#"+new Le().setHSL(i.h,i.s,i.l).getHexString(),r),r&&qn()};n.append(an("Hue",0,1,i.h,r=>{i.h=r,s()},()=>s(!0)),an("Richness",0,1,i.s,r=>{i.s=r,s()},()=>s(!0)),an("Lightness",.03,.97,i.l,r=>{i.l=r,s()},()=>s(!0)),K("h4",null,"Pattern"),_r([[0,"Plain"],[1,"Stripes"],[2,"Spots"],[3,"Patches"],[4,"Mosaic"],[5,"Saddle"],[6,"Speckle"],[7,"Bands"]],t.pattern,r=>{Zi("pattern",r,!0),qn()}),an("Pattern size",.3,3.5,3.8-t.patScale,r=>Zi("patScale",3.8-r)),an("Belly colour",0,1,t.bellyAmt,r=>Zi("bellyAmt",r)),K("div",{class:"row"},K("button",{onclick:()=>{let r=Math.random(),o=(a,c,h)=>"#"+new Le().setHSL((a+1)%1,c,h).getHexString();Object.assign(t,{base:o(r,.3+Math.random()*.5,.3+Math.random()*.35),second:o(r+(Math.random()-.5)*.5,.4+Math.random()*.4,.12+Math.random()*.3),belly:o(r+.05,.25,.8),hair:o(r+.5*Math.random(),.5,.25+Math.random()*.3),membrane:o(r+.08,.45,.6),eye:o(Math.random(),.75,.45),pattern:Math.floor(Math.random()*8)}),gn(),_n(),qn()}},"Surprise me")));return}n.append(K("h3",null,Da.find(t=>t[0]===xn)[1]),K("p",{class:"note"},"Tap to add. Then tap the part on your creature and drag it where you want it."));let e=K("div",{class:"grid"});for(let[t,i]of Object.entries(Pt))i.cat===xn&&(Ph(tt,t)?e.append(K("button",{class:"tile",onclick:()=>{let s=oi(de,t,pt.frames);gn(),_n(),xr(s.id)}},K("img",{src:zh(t),alt:""}),i.n)):e.append(K("button",{class:"tile locked",onclick:()=>ho("part:"+t,to[t],i.n,qn)},K("img",{src:zh(t),alt:""}),i.n,K("small",null,"Locked \xB7 "+to[t]))));n.append(e)}var yv={human:"Toes",paw:"Paw",hoof:"Hoof",talon:"Talons",webbed:"Webbed",stump:"Stump",point:"Spike",none:"None",claw:"Claws",pincer:"Pincer",mitt:"Mitt"};function vv(){let n=Tt("right"),e=mt&&mt!=="body"?uo(mt):null;n.classList.toggle("hidden",!e||Hh()),n.replaceChildren(),e&&!Hh()&&Yh(n,e)}function Yh(n,e){var a;let t=Pt[e.kind],i=()=>{n.replaceChildren(),Yh(n,e)},s=()=>{ka(pt,e),po()},r=()=>{jr(pt),Gh(),_n()},o=e.size;n.append(K("h3",null,t.n),K("p",{class:"note"},t.ridge?"Drag it along the body to move the row.":"Drag it on the creature to move it."),an(t.cat==="limbs"?"Length":"Size",-2,2,0,c=>{e.size=o*Math.pow(2,c),s()},r));for(let[c,h]of Object.entries(t.P||{})){if(c==="suckers"){n.append(_r([[1,"Suckers"],[0,"Smooth"]],e.p[c],l=>{e.p[c]=l,s(),r(),i()}));continue}n.append(an(h[3],h[0],h[1],(a=e.p[c])!=null?a:h[2],l=>{e.p[c]=l,s()},r,["count","feathers","tines"].includes(c)?1:0))}if(t.C)for(let[c,h]of Object.entries(t.C))n.append(K("h4",null,h.includes("paw")?"Foot":"Hand"),_r(h.map(l=>[l,yv[l]]),e.p[c],l=>{e.p[c]=l,s(),r(),i()}));t.kind==="surface"&&n.append(K("h4",null,"Angle"),an("Twist",-3.14,3.14,e.rot,c=>{e.rot=c,s()},r),an("Tilt",-1.5,1.5,e.tilt,c=>{e.tilt=c,s()},r)),n.append(K("h4",null,"Pair"),_r([[!0,"Mirrored pair"],[!1,"Single"]],e.mirror,c=>{e.mirror=c,s(),r(),i()})),n.append(K("h4",null,"Shown on"),_r([[null,"Both"],["f","Female only"],["m","Male only"]],e.sexOnly,c=>{e.sexOnly=c,s(),r(),i()}),K("div",{class:"row",style:"margin-top:10px"},K("button",{onclick:()=>{let c=JSON.parse(JSON.stringify(e));c.id="p"+Date.now().toString(36),c.u=En(c.u-.08,-.9,1.9),de.parts.push(c),gn(),_n(),xr(c.id)}},"Copy"),K("button",{class:"warn",onclick:()=>{de.parts=de.parts.filter(c=>c.id!==e.id),mt=null,gn(),_n(),Ci()}},"Delete")),K("div",{class:"row"},K("button",{onclick:()=>xr(null)},"Done")))}function qh(){Tt("topbar").replaceChildren(K("button",{onclick:Lf},"Home"),K("input",{value:de.name,maxLength:30,onchange:e=>{de.name=e.target.value||"Creature",_n()}}),K("div",{class:"seg"},K("button",{class:de.sex==="f"?"on":"",onclick:()=>Tf("f")},"Female"),K("button",{class:de.sex==="m"?"on":"",onclick:()=>Tf("m")},"Male")),K("button",{disabled:Un.length<2,onclick:()=>{Un.length>1&&(gr.push(Un.pop()),Sf(Un[Un.length-1]))}},"Undo"),K("button",{disabled:!gr.length,onclick:()=>{if(gr.length){let e=gr.pop();Un.push(e),Sf(e)}}},"Redo"),K("button",{class:co?"on":"",onclick:()=>{co=!co,qh()}},"Spin"),K("button",{onclick:Mv},"Photo"),K("button",{onclick:()=>Zh()},"Save"),K("button",{class:"battle",onclick:$h},"\u2694\uFE0F Battle"))}function Tf(n){de.sex=n,gn(),_n(),Ci()}function Ci(){xv(),qn(),vv(),qh(),yr(),po(),Tt("hint").textContent=mt&&mt!=="body"?"":"Drag to spin. Pinch to zoom. Tap a part to select it."}function Zh(n){de.id||(de.id="c"+Date.now().toString(36));let e=Et.get("cc.saved",[]).filter(t=>t.id!==de.id);e.unshift({id:de.id,name:de.name,thumb:qa(de),data:JSON.parse(JSON.stringify(de))}),Et.set("cc.saved",e),Et.set("cc.current",de),n||Rn('Saved "'+de.name+'"')}var tt=Et.get("cc.meta",null);if(!tt){tt=Object.assign(Rh(),Et.get("cc.record",{}));for(let n of[...Et.get("cc.saved",[]).map(e=>e.data),Et.get("cc.current",null)])n&&!Ah.includes(n.type)&&(tt.unlocked["type:"+n.type]=!0)}tt=Object.assign(Rh(),tt);var Ss=()=>Et.set("cc.meta",tt);function ho(n,e,t,i){if(tt.points<e){Rn("Not enough points: "+t+" costs "+e+", you have "+tt.points+".");return}confirm("Unlock "+t+" for "+e+" points?")&&(tt.points-=e,tt.unlocked[n]=!0,Ss(),Rn("Unlocked "+t),i&&i())}var Ji=Mf({scene:kt,camera:ft,M:An,h:K,store:Et,sun:Nn,showAd:Fh,toast:Rn,onDone:bv,meta:()=>tt,saveMeta:Ss});function $h(n){Zh(!0),mt=null,Zt.orbit.enabled=!1,Tt("editor").classList.add("hidden"),Tt("start").classList.add("hidden"),Kn.visible=Jn.visible=!1,si(An,de.look,At[de.type].bellyDir),Ji.start(de,n&&n.id===de.id?n:null),yr()}function bv(n){Kn.visible=Jn.visible=!0,Zt.orbit.enabled=!0;for(let t of[An.skin,...An.shells])t.emissive.setRGB(0,0,0);let e=tt;if(n.type==="dead"){e.fallen++,Ss(),Et.set("cc.saved",Et.get("cc.saved",[]).filter(t=>t.id!==de.id)),Et.set("cc.current",null),pt&&(Kn.remove(pt.group),Yi(pt.group),pt=null),de=null,ln=!1,Tt("start").classList.remove("hidden"),mn(),yr();return}n.type==="champion"&&(e.points+=n.points,e.champions++,Ss(),de.champion=(de.champion||0)+1),ln=!0,Tt("editor").classList.remove("hidden"),gn(),n.type==="champion"&&Zh(!0),Ci(),Wh(),n.type==="champion"&&Rn(de.name+" is champion! +"+n.points+" points")}function Mv(){let t=Mt.getPixelRatio(),i=ft.zoom;Jn.visible=!1,Mt.setPixelRatio(1),Mt.setSize(1920,1080,!1),ft.clearViewOffset(),ft.aspect=1920/1080,ft.zoom=i,ft.updateProjectionMatrix(),Mt.render(kt,ft);let s=ws.toDataURL("image/png");Jn.visible=!0,Mt.setPixelRatio(t),ft.zoom=i,yr(),Mt.render(kt,ft);let r=(de.name||"creature").replace(/[^\w-]+/g,"_")+"_"+Date.now().toString(36)+".png";window.Android&&window.Android.savePng?window.Android.savePng(s.split(",")[1],r):(K("a",{href:s,download:r}).click(),Rn("Photo downloaded"))}window.ccToast=Rn;window.ccBack=()=>Ji.active?Ji.back():!ln&&Ri?(Ri=null,mn(),!0):ln?(mt?xr(null):Lf(),!0):!1;function ao(n){let e=Et.get("cc.run",null);e&&n.id&&e.id===n.id&&(Et.set("cc.run",null),Rn("Gauntlet abandoned. It starts again from fight one.")),de=n,mt=null,Zn=-1,xn="body",Un=[],gr=[],ln=!0,de.sex===void 0&&(de.sex="f"),de.look.cloth||(de.look.cloth="#6b4a2e"),Tt("start").classList.add("hidden"),Tt("editor").classList.remove("hidden"),gn(),_n(),Ci(),Wh()}function Lf(){Et.set("cc.current",de),ln=!1,Tt("editor").classList.add("hidden"),Tt("start").classList.remove("hidden"),mn()}var Ya={};function Vh(){let n=Tt("runpill");if(!n)return;let e=qi(tt);n.textContent="\u26A1 "+e.n+"/"+e.max+(e.next?" \xB7 "+Ha(e.next)+" \xB7 \u{1F4FA} +1":"")}setInterval(Vh,1e3);var Ri=null;function Sv(){let n=Tt("start"),e=(r,o,a,c,h,l,u)=>K("div",{class:"shoprow"+(h?" owned":"")},K("div",{class:"ico"},r),K("div",{class:"what"},K("b",null,o),u&&K("small",{class:"req"},u),K("small",null,a)),h?K("span",{class:"have"},typeof h=="string"?h:"Owned"):K("button",{class:tt.points>=c?"go":"",onclick:l},c+" pts")),t=r=>ur.filter(o=>o.cat===r).sort((o,a)=>o.cost-a.cost).map(o=>e(o.icon,o.name,Wa({id:o.id,cat:r,q:1,rar:0,lvl:1}),o.cost,Ih(tt,o)&&(o.cost?"Owned":"Free"),()=>ho("item:"+r+":"+o.id,o.cost,o.name,mn),o.reqText?"Needs "+o.reqText:o.hands===2?"Needs two free hands":"")),i={Bodies:()=>Object.entries(At).map(([r,o])=>e("\u{1F9EC}",o.name,o.blurb,dr[r],Va(tt,r)&&(dr[r]?"Owned":"Free"),()=>ho("type:"+r,dr[r],"the "+o.name+" body",mn))),Parts:()=>Object.entries(to).map(([r,o])=>e(K("img",{src:zh(r),alt:""}),Pt[r].n,"Body part for the workshop ("+Da.find(a=>a[0]===Pt[r].cat)[1]+").",o,Ph(tt,r),()=>ho("part:"+r,o,Pt[r].n,mn))),Weapons:()=>t("weapon"),Abilities:()=>t("ability"),Relics:()=>t("relic"),Boosts:()=>rf.map(r=>{let o=r.consumable?tt.revives:tt.boosts[r.id]||0,a=o>=r.max,c=r.cost(o);return e(r.icon,r.name+(r.consumable?" (holding "+o+")":r.max>1?" (level "+o+" of "+r.max+")":""),r.text,c,a&&(r.consumable?"Full":"Maxed"),()=>{if(tt.points<c){Rn("Not enough points: "+r.name+" costs "+c+", you have "+tt.points+".");return}tt.points-=c,r.consumable?tt.revives++:tt.boosts[r.id]=o+1,Ss(),mn()})})},s={Weapons:"Weapons you own can turn up as rewards after a fight. A creature holds one per hand.",Abilities:"Abilities you own can turn up as rewards, if the creature has the right body for them.",Relics:"Relics are passive rewards that stack. Many only work, or work better, with the right body.",Parts:"Extra parts for building creatures. Starter creatures may already carry some of these.",Bodies:"New body types to start from.",Boosts:"Permanent upgrades, and revives."};n.replaceChildren(K("h1",null,"The ",K("span",null,"Shop"),K("small",{class:"record"},K("b",null,tt.points+" points")," ",K("button",{class:"shopbtn",onclick:()=>{Ri=null,mn()}},"Back"))),K("div",{class:"chips",style:"margin-top:10px"},Object.keys(i).map(r=>K("button",{class:r===Ri?"on":"",onclick:()=>{Ri=r,mn()}},r))),K("p",{class:"note"},s[Ri]+" Points come from every fight won (more for later fights) and a big bonus for the title."),K("div",{class:"shop"},i[Ri]())),n.scrollTop=0}function mn(){let n=Tt("start"),e=Et.get("cc.saved",[]),t=Et.get("cc.current",null);if(Ri){Sv();return}let i=tt,s=Et.get("cc.run",null),r=s&&t&&t.id===s.id;n.replaceChildren(...[K("h1",null,"Creature ",K("span",null,"Workshop"),K("small",{class:"record"},K("span",{class:"runpill",id:"runpill",onclick:async()=>{let o=qi(tt);if(o.n>=o.max)return;let a=await Fh();a.ok?(za(tt),Ss(),Vh(),Rn("+1 run")):a.why&&Rn(a.why)}}),K("button",{class:"shopbtn",onclick:()=>{Ri="Bodies",mn()}},"Shop")," ",K("b",null,i.points+" points")," \xB7 "+i.champions+(i.champions===1?" champion":" champions")+" \xB7 "+i.fallen+" fallen")),r&&K("div",{class:"card resume",onclick:()=>{de=t,$h(s)}},K("b",null,"Gauntlet in progress"),K("small",null,t.name+" is waiting for fight "+(s.round+1)+" of 10. Tap to return to the Colosseum.")),K("h2",null,"Start from a body type"),K("div",{class:"cards"},K("div",{class:"card",onclick:()=>{let o=Object.keys(At).filter(a=>Va(tt,a));ao(io(Math.random,{type:o[Math.floor(Math.random()*o.length)]}))}},K("div",{class:"dice"},"?"),K("b",null,"Random"),K("small",null,"Roll a surprise creature")),Object.entries(At).map(([o,a])=>Va(tt,o)?K("div",{class:"card",onclick:()=>ao(vs(o))},K("img",{src:Ya[o]||(Ya[o]=qa(vs(o))),alt:""}),K("b",null,a.name),K("small",null,a.blurb)):K("div",{class:"card locked",onclick:()=>ho("type:"+o,dr[o],"the "+a.name+" body",mn)},K("img",{src:Ya[o]||(Ya[o]=qa(vs(o))),alt:""}),K("b",null,a.name),K("small",null,"Locked \xB7 "+dr[o]+" points"))))].filter(Boolean)),Vh(),(t||e.length)&&n.append(K("h2",null,"Your creatures"),K("div",{class:"cards"},t&&K("div",{class:"card",onclick:()=>ao(t)},K("img",{src:qa(t),alt:""}),K("b",null,"Continue"),K("small",null,t.name)),e.map(o=>K("div",{class:"card",onclick:()=>ao(JSON.parse(JSON.stringify(o.data)))},K("img",{src:o.thumb,alt:""}),K("b",null,o.name),K("small",null,At[o.data.type].name+(o.data.champion?" \xB7 Champion"+(o.data.champion>1?" x"+o.data.champion:""):"")),K("button",{class:"del warn",onclick:a=>{a.stopPropagation(),confirm('Delete "'+o.name+'"?')&&(Et.set("cc.saved",Et.get("cc.saved",[]).filter(c=>c.id!==o.id)),mn())}},"\xD7")))))}Zt.orbit=new Ea(ft,ws);Object.assign(Zt.orbit,{enableDamping:!0,dampingFactor:.12,enablePan:!1,autoRotateSpeed:2.2,rotateSpeed:.9,maxPolarAngle:Math.PI*.62,minPolarAngle:.15});Zt.orbit.addEventListener("change",dv);yr();mn();requestAnimationFrame(Cf);window.__cc={get data(){return de},get cr(){return pt},open:ao,newCreature:vs,select:xr,PARTS:Pt,TEMPLATES:At,setTab:n=>{xn=n,Ci()},camera:ft,controls:Zt,fitCamera:Wh,rebuild:gn,renderer:Mt,scene:kt,arena:Ji,get meta(){return tt},saveMeta:Ss,renderStart:mn,runsNow:qi,enterBattle:$h,randomCreature:io,addPartTest:n=>oi(de,n,pt.frames),pickAt:(n,e)=>(Za({clientX:n,clientY:e}),Xh()),state:()=>({sel:mt,tab:xn,down:{...ot}})};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
