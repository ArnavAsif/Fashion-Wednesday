ed:!0
}
);
Re.call(()=>{
prepareHeaderIntroText(ke)
}
,null,0),_e&&gsapWithCSS.set(_e,{
autoAlpha:1
}
),Re.set(ke,{
autoAlpha:1
}
,.001),Le&&Re.to(Le,{
autoAlpha:1,scaleY:1,duration:.9,ease:"power3.out",transformOrigin:"50% 100%"
}
,.001);
const ze=gsapWithCSS.timeline();
if(Fe.forEach(($e,Be)=>{
const He=$e.querySelectorAll("[text-split] .char"),Ve=getHeaderTrailingSpan($e),Ne=gsapWithCSS.timeline();
if(He.length){
const We=createCharScrambleTimeline(He,{
durationPerChar:.18,stagger:.04,paused:!1
}
);
Ne.add(We,0)
}
if(Ve){
const We=createTrailingFadeTimeline(Ve,{
startAt:He.length*.04+.18,duration:.18,paused:!1
}
);
Ne.add(We,0)
}
Ne.getChildren(!1,!0,!0).length&&ze.add(Ne,Be*.05)
}
),De.length){
const $e=createCharScrambleTimeline(De,{
durationPerChar:.18,stagger:.04,paused:!1
}
);
ze.add($e,0)
}
return Re.add(ze,.001),Re
}
function initMenuMediaLogic({
noop:ke,canHover:_e,isDesktop1024:Ae,isMobile768:Le
}
){
const Ie=Ge=>{
if(Ge)try{
Ge.pause()
}
catch{

}

}
,Fe=Ge=>{
if(!Ge)return;
Ie(Ge);
const Ye=Ge.querySelectorAll("source");
Ye.length&&!Ge.getAttribute("data-saved-sources")&&Ge.setAttribute("data-saved-sources",Array.from(Ye).map(qe=>qe.outerHTML).join("")),Ye.forEach(qe=>qe.remove()),Ge.removeAttribute("src"),Ge.removeAttribute("autoplay"),Ge.preload="none",Ge.load()
}
,De=Ge=>{
if(!Ge)return;
const Ye=Ge.getAttribute("data-saved-sources");
!Ge.querySelector("source")&&Ye&&(Ge.innerHTML=Ye)
}
,Re=Ge=>{
if(!Ge||Le())return;
De(Ge),Ge.muted=!0,Ge.playsInline=!0,Ge.loop=!0,Ge.preload="metadata";
const Ye=Ge.play();
Ye&&typeof Ye.catch=="function"&&Ye.catch(ke)
}
,ze=Ge=>{
if(!Ge)return!1;
if(Le())return Fe(Ge),!1;
De(Ge);
const Ye=Ge.querySelectorAll("source");
let qe=!1;
return Ye.forEach(Xe=>{
if(Xe.getAttribute("src"))return;
const je=Xe.getAttribute("data-src");
je&&(Xe.setAttribute("src",je),qe=!0)
}
),qe&&Ge.load(),qe
}
,$e=Ge=>{
if(!Ge)return!1;
const Ye=Ge.querySelectorAll("source");
let qe=!1;
return Ye.forEach(Xe=>{
const je=Xe.getAttribute("src");
je&&(Xe.getAttribute("data-src")||Xe.setAttribute("data-src",je),Xe.removeAttribute("src"),qe=!0)
}
),qe&&(Ie(Ge),Ge.load()),qe
}
,Be=Ge=>{
Ge&&Ge.querySelectorAll(".menu__collection video").forEach(Ye=>{
Ie(Ye)
}
)
}
,He=Ge=>{
if(!Ge)return[];
const Ye=Ge.querySelector(".menu__collection");
if(!Ye)return[];
let qe=Array.from(Ye.children).filter(Xe=>Xe.classList.contains("menu__item"));
return _e()||qe.forEach(Xe=>{
Xe.classList.contains("default")||Xe.remove()
}
),qe=Array.from(Ye.children).filter(Xe=>Xe.classList.contains("menu__item")),Le()?(qe.forEach(Xe=>{
const je=Xe.querySelector(".menu__item-list");
je&&je.remove(),Xe.querySelectorAll("video").forEach(Ue=>{
Fe(Ue)
}
)
}
),qe):(qe.forEach(Xe=>{
const je=Xe.classList.contains("default");
Xe.querySelectorAll(".menu__item-main video").forEach(Je=>{
je?ze(Je):$e(Je)
}
),Xe.querySelectorAll(".menu__item-list video").forEach(Je=>{
$e(Je)
}
)
}
),qe)
}
,Ve=Ge=>{
if(!Ge||Le())return;
Be(Ge);
const Ye=Ge.querySelector(".menu__collection .menu__item.default");
if(!Ye)return;
Ye.querySelectorAll(".menu__item-main video").forEach(Xe=>{
ze(Xe),Re(Xe)
}
),Ae()&&Ye.querySelectorAll(".menu__item-list video").forEach(je=>{
ze(je),Re(je)
}
)
}
,Ne=(Ge,Ye)=>{
if(!Ge||!Ye||Le())return;
Be(Ge);
const qe=Ge.querySelector(".menu__collection .menu__item.default");
if(qe&&qe!==Ye&&qe.querySelectorAll("video").forEach(je=>{
Ie(je)
}
),Ye.classList.contains("default")){
Ye.querySelectorAll(".menu__item-main video").forEach(Ue=>{
ze(Ue),Re(Ue)
}
),Ae()&&Ye.querySelectorAll(".menu__item-list video").forEach(Ze=>{
ze(Ze),Re(Ze)
}
);
return
}
_e()&&Ye.querySelectorAll(".menu__item-main video").forEach(Ue=>{
ze(Ue),Re(Ue)
}
),Ae()&&Ye.querySelectorAll(".menu__item-list video").forEach(Ue=>{
ze(Ue),Re(Ue)
}
)
}
;
return{
stopAllVideosInMenu:Be,prepareCollectionForCurrentDeviceOnce:He,playDefaultOnly:Ve,playHoverItemOnly:Ne,syncActiveItemMediaState:Ge=>{
if(!Ge||Le())return;
const Ye=Ge.querySelector(".menu__collection .menu__item.active");
if(Ye){
Ne(Ge,Ye);
return
}
Ve(Ge)
}

}

}
function headerLogic(){
const ke=document.querySelector(".header");
if(!ke)return;
prepareHeaderIntroText(ke);
const _e=document.querySelector(".menu__popup"),Ae=()=>{

}
,Le=(xi,Hi)=>xi&&xi instanceof Element?xi.closest(Hi):null,Ie=()=>document.querySelector(".favorites"),Fe=()=>document.querySelector(".search");
let De=()=>{

}
;
const Re=()=>{
const xi=Ie();
xi&&(De("favorites"),xi.classList.add("visible"))
}
,ze=()=>{
const xi=Ie();
xi&&xi.classList.remove("visible")
}
,$e=()=>{
const xi=Ie();
if(!xi)return;
xi.classList.contains("visible")?ze():Re()
}
,Be=()=>{
const xi=Fe();
xi&&(xi.classList.remove("visible"),xi.classList.remove("closing"))
}
,He=()=>{
window.scrollY>5?ke.classList.add("small"):ke.classList.remove("small")
}
;
He(),window.addEventListener("scroll",He,{
passive:!0
}
);
const Ve=document.querySelector(".footer");
Ve&&ScrollTrigger.create({
trigger:Ve,start:"top 40%",end:"bottom top",onEnter:()=>{
ke.classList.add("hide")
}
,onEnterBack:()=>{
ke.classList.add("hide")
}
,onLeaveBack:()=>{
ke.classList.remove("hide")
}
,onLeave:()=>{
ke.classList.remove("hide")
}

}
);
const Ne=document.querySelector(".header__list"),We=()=>{
const{
lenis:xi
}
=window;
xi&&typeof xi.stop=="function"&&xi.stop()
}
,Ge=()=>{
const{
lenis:xi
}
=window;
xi&&typeof xi.start=="function"&&xi.start()
}
,Ye=()=>{
var Oi,Xi;
if(!Ne)return;
const xi=!!Ne.querySelector("li.active"),Hi=!!((Oi=Ie())!=null&&Oi.classList.contains("visible")),bi=!!((Xi=Fe())!=null&&Xi.classList.contains("visible"));
xi||Hi||bi?We():Ge()
}
,qe=()=>window.matchMedia("(hover: hover) and (pointer: fine)").matches,Xe=()=>window.matchMedia("(min-width: 1024px)").matches,je=()=>window.matchMedia("(max-width: 768px)").matches,Ue=document.querySelectorAll(".header__list > li > button, .header__list > li > a"),Ze=document.querySelectorAll(".header__hover > li > span[data-hover-lottie]"),Je=.5;
let Qe=null;
const ti=xi=>{
if(!xi)return null;
const Hi=xi.getAttribute("data-hover-lottie");
if(!Hi)return null;
xi.style.pointerEvents="none";
let bi=null,Oi=!1,Xi=!1,Mi=1,zi=1,er=null;
const Ki=()=>{
bi&&(bi.destroy(),bi=null),Oi=!1,Xi=!1,xi.innerHTML=""
}
,cr=()=>{
const ir=(bi==null?void 0:bi.frameRate)||0,pr=(bi==null?void 0:bi.totalFrames)||0;
if(!ir||!pr)return 1;
const gr=pr/ir;
return gr>0?gr/Je:1
}
,nr=()=>bi||(Oi?null:(Oi=!0,bi=lottie.loadAnimation({
container:xi,renderer:"canvas",loop:!1,autoplay:!1,path:Hi,rendererSettings:{
progressiveLoad:!0,hideOnTransparent:!0,preserveAspectRatio:"none"
}

}
),bi.addEventListener("DOMLoaded",()=>{
Oi=!1,Xi=!0,zi=cr(),bi.setSpeed(zi),bi.setDirection(Mi),bi.play()
}
),bi.addEventListener("complete",()=>{
bi&&Mi===-1&&Ki()
}
),bi)),hr=ir=>{
Mi=ir,Qe&&Qe!==er&&Qe.forceStop(),Qe=er;
const pr=nr();
pr&&Xi&&(pr.setSpeed(zi||1),pr.setDirection(ir),pr.play())
}
;
return er={
enter:()=>hr(1),leave:()=>hr(-1),forceStop:()=>{
Mi=-1,Ki()
}

}
,er
}
,si=Array.from(Ze).map(xi=>ti(xi));
Ue.length&&Ze.length&&Ue.forEach((xi,Hi)=>{
const bi=si[Hi];
xi.addEventListener("mouseenter",()=>{
bi&&bi.enter()
}
),xi.addEventListener("mouseleave",()=>{
bi&&bi.leave()
}
)
}
);
const{
stopAllVideosInMenu:ni,prepareCollectionForCurrentDeviceOnce:hi,playDefaultOnly:ai,playHoverItemOnly:ci,syncActiveItemMediaState:ui
}
=initMenuMediaLogic({
noop:Ae,canHover:qe,isDesktop1024:Xe,isMobile768:je
}
),fi=xi=>{
if(!xi)return null;
const Hi=xi.querySelector("[data-hover-lottie], [hover-lottie]"),bi=ti(Hi);
return Hi&&(Hi.style.pointerEvents="none",Hi.style.display="block"),xi.addEventListener("pointerenter",()=>{
bi&&bi.enter()
}
),xi.addEventListener("pointerleave",()=>{
bi&&bi.leave()
}
),bi
}
;
(()=>{
const xi=document.querySelector(".menu__popup");
if(!xi)return()=>{

}
;
const Hi=xi.querySelector(".menu__popup-close")||null;
let bi=!1;
const Oi=zi=>{
bi=!!zi,xi.classList.toggle("visible",bi),Ye()
}
;
Hi&&(fi(Hi),Hi.addEventListener("click",zi=>{
zi.preventDefault(),Oi(!1)
}
));
const Xi=zi=>{
Le(zi.target,"[credit]")&&(zi.preventDefault(),Oi(!0))
}
,Mi=zi=>{
if(!bi||Le(zi.target,"[credit]"))return;
const{
target:Ki
}
=zi;
Ki instanceof Node&&xi.contains(Ki)||Oi(!1)
}
;
return document.addEventListener("click",Xi),document.addEventListener("pointerdown",Mi,{
passive:!0
}
),()=>{
document.removeEventListener("click",Xi),document.removeEventListener("pointerdown",Mi)
}

}
)();
const oi=xi=>{
const{
toggleBtn:Hi,toggleLi:bi,menuRoot:Oi,syncTitle:Xi,name:Mi
}
=xi;
if(!Hi||!bi||!Oi)return null;
let zi=Oi.querySelector(".menu__list");
if(!zi)return null;
const er=Oi.querySelector(".menu__inner");
let Ki=Oi.querySelectorAll(".menu__list > li");
const cr=Xi?Oi.querySelector(".menu__title"):null;
let nr=[],hr=!1,dr=!1,ir=-1,pr=null,gr=0,Er=0;
const Ar=()=>{
hr||(hi(Oi),hr=!0,ir=-1)
}
,Pr=()=>{
Er&&(clearTimeout(Er),Er=0)
}
,Tr=()=>{
Pr(),Oi.classList.remove(MENU_HOVER_READY_CLASS)
}
,Ji=()=>{
Tr(),Er=window.setTimeout(()=>{
Er=0,dr&&Oi.classList.add(MENU_HOVER_READY_CLASS)
}
,MENU_HOVER_READY_DELAY_MS)
}
,Mr=qi=>{
const Gi=qi.querySelector("[text-split]")||qi.querySelector("span[text-split]");
return((Gi==null?void 0:Gi.textContent)||"").trim()
}
,mr=qi=>{
if(!nr.length)return;
const Gi=Math.max(0,Math.min(qi,nr.length-1));
nr.forEach(ur=>ur.classList.remove("active")),nr[Gi]&&nr[Gi].classList.add("active")
}
,_r=()=>{
if(!cr)return;
const qi=cr.querySelector("strong"),Gi=qi?qi.outerHTML:"",ur=["Select",...Array.from(Ki).map(Mr)];
cr.innerHTML=ur.map(rr=>`<span><span>${
rr
}
</span> ${
Gi
}
</span>`).join(""),nr=Array.from(cr.children).filter(rr=>rr&&rr.nodeType===1),mr(0)
}
;
Xi&&_r();
const gi=850,Ai=90;
let Bi=0,Fi=0;
const sr=()=>{
Fi&&(clearTimeout(Fi),Fi=0)
}
,Ii=()=>{
Bi=performance.now()+gi
}
,Di=()=>performance.now()<Bi,Yi=()=>Array.from(Oi.querySelectorAll(".menu__collection .menu__item")),Ci=qi=>{
const ur=Yi().length-1;
return Math.max(0,Math.min(qi,ur))
}
,Ni=(qi,Gi)=>{
const ur=Yi();
if(!ur.length)return;
const rr=Math.max(0,Math.min(qi,ur.length-1));
if(rr===ir){
Xi&&mr(Gi??0),ui(Oi);
return
}
ur.forEach(Cr=>Cr.classList.remove("active"));
const vr=ur[rr];
vr&&vr.classList.add("active"),rr===0?ai(Oi):vr&&ci(Oi,vr),Xi&&mr(Gi??0),ir=rr,Ii()
}
,Ri=()=>{
if(sr(),!dr||pr==null)return;
if(Di()){
Fi=setTimeout(Ri,Ai);
return
}
const qi=pr,Gi=gr;
pr=null,gr=0,Ni(qi,Gi),pr!=null&&(Fi=setTimeout(Ri,Ai))
}
,ji=(qi,Gi)=>{
pr=Ci(qi),gr=Math.max(0,Gi??0),Ri()
}
;
(()=>{
zi=Oi.querySelector(".menu__list"),Ki=Oi.querySelectorAll(".menu__list > li"),zi&&(Ki.forEach((qi,Gi)=>{
qi.addEventListener("mouseenter",()=>{
dr&&qe()&&ji(Gi+1,Gi+1)
}
)
}
),zi.addEventListener("mouseleave",()=>{
dr&&qe()&&ji(0,0)
}
))
}
)();
const Qi=()=>{
if(!dr)return;
dr=!1,Tr(),bi.classList.remove("active"),Oi.classList.remove("active"),pr=null,gr=0,Bi=0,sr(),Yi().forEach(Gi=>Gi.classList.remove("active")),Xi&&mr(0),ni(Oi),ir=-1,Ye()
}
,or=()=>{
dr||(De(Mi),dr=!0,Tr(),bi.classList.add("active"),Oi.classList.add("active"),pr=null,gr=0,Bi=0,sr(),Xi&&_r(),Ar(),requestAnimationFrame(()=>{
requestAnimationFrame(()=>{
dr&&(Ni(0,0),Ji())
}
)
}
),Ye())
}
,ar=qi=>{
dr&&qi.key==="Escape"&&(qi.preventDefault(),Qi())
}
,lr=qi=>{
if(!dr||!er)return;
const{
target:Gi
}
=qi;
!(Gi instanceof Node)||bi.contains(Gi)||er.contains(Gi)||_e&&_e.contains(Gi)||Qi()
}
;
return Hi.addEventListener("click",qi=>{
qi.preventDefault(),dr?Qi():or()
}
),document.addEventListener("keydown",ar),document.addEventListener("click",lr),Ar(),{
name:Mi,closeMenu:Qi,openMenu:or
}

}
,Ke=xi=>{
const{
name:Hi,toggleLi:bi,toggleLink:Oi,cartRoot:Xi
}
=xi;
if(!bi||!Oi||!Xi)return null;
const Mi=()=>Xi.classList.contains("visible")||bi.classList.contains("active"),zi=()=>{
Mi()||(De(Hi),bi.classList.add("active"),Xi.classList.add("visible"),Ye())
}
,er=()=>{
Mi()&&(bi.classList.remove("active"),Xi.classList.remove("visible"),Ye())
}
;
return Oi.addEventListener("click",Ki=>{
Ki.preventDefault(),Mi()?er():zi()
}
),{
name:Hi,closeMenu:er,openMenu:zi
}

}
,ei=document.querySelector(".header__list > li:first-child"),ii=ei==null?void 0:ei.querySelector("button"),li=document.querySelector(".menu.menu--menu"),pi=document.querySelector(".header__list > li:nth-child(5)"),Si=pi==null?void 0:pi.querySelector("button"),yi=document.querySelector(".menu.menu--categories"),ki=document.querySelector(".header__list > li:nth-child(2)"),mi=ki==null?void 0:ki.querySelector("a, button"),Ti=document.querySelector(".cart"),vi=document.querySelectorAll(".menu [favorites]"),Ei=oi({
name:"menu",toggleBtn:ii,toggleLi:ei,menuRoot:li,syncTitle:!1
}
),Li=oi({
name:"categories",toggleBtn:Si,toggleLi:pi,menuRoot:yi,syncTitle:!0
}
),$i=Ke({
name:"cart",toggleLi:ki,toggleLink:mi,cartRoot:Ti
}
);
vi.length&&vi.forEach(xi=>{
const Hi=xi.querySelector("[data-hover-lottie], [hover-lottie]"),bi=ti(Hi);
xi.addEventListener("pointerenter",()=>{
bi&&bi.enter()
}
),xi.addEventListener("pointerleave",()=>{
bi&&bi.leave()
}
),xi.addEventListener("click",Oi=>{
Oi.preventDefault(),$e(),Ye()
}
)
}
),De=xi=>{
Ei&&Ei.name!==xi&&Ei.closeMenu(),Li&&Li.name!==xi&&Li.closeMenu(),$i&&$i.name!==xi&&$i.closeMenu(),xi!=="favorites"&&ze(),xi!=="search"&&Be(),Ye()
}
,Ye(),window.closeHeaderOverlays=De;
let Wi=null,Pi=!1,wi=null;
const Zi=()=>new Promise(xi=>{
requestAnimationFrame(()=>{
requestAnimationFrame(()=>{
xi()
}
)
}
)
}
),Ui=()=>wi||(wi=new Promise(xi=>{
if(document.body.classList.contains("loaded")){
xi();
return
}
const Hi=()=>{
window.removeEventListener(LOADER_READY_EVENT,Hi),xi()
}
;
window.addEventListener(LOADER_READY_EVENT,Hi,{
once:!0
}
)
}
),wi),di=async()=>{
Wi||Pi||(Pi=!0,await Ui(),await Zi(),resetHeaderIntroState(ke),Wi=buildHeaderIntroTimeline(ke),Wi&&Wi.play(0))
}
;
!!document.querySelector(".hero-section")?window.addEventListener(HEADER_INTRO_EVENT,async()=>{
await Ui(),await di()
}
,{
once:!0
}
):di()
}
const COOKIE_READY_EVENT="hero:preloader-finished";
function cookie(){
const ke=document.querySelector(".cookie");
if(!ke)return;
const _e=ke.querySelector(".cookie__close"),Ae=ke.querySelector(".cookie__button-wrapper .cookie__button:nth-child(1)"),Le=ke.querySelector(".cookie__button-wrapper .cookie__button:nth-child(2)"),Ie=ke.querySelector(".cookie__settings-open"),Fe=ke.querySelector(".cookie__body"),De=ke.querySelector(".cookie__settings"),Re=ke.querySelector(".cookie__settings__cancel"),ze=ke.querySelector(".cookie__settings-save"),$e=ke.querySelector('input[value="option-1"]'),Be=ke.querySelector('input[value="option-2"]'),He=ke.querySelector('input[value="option-3"]'),Ve=ke.querySelector('input[value="option-4"]'),Ne="cookie_consent_v1",We=ii=>!!ii,Ge=()=>{
try{
return window.location&&