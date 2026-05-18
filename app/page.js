"use client";

import { useEffect, useRef, useState } from "react";

const exercises = [
  { name:"腹筋", msg:"お腹に力を込めた状態をキープ！", bg:"#111"},
  { name:"お尻", msg:"お尻に力を込めた状態をキープ！", bg:"#1e3a5f"},
  { name:"大胸筋", msg:"胸に力を込めた状態をキープ！", bg:"#5a189a"},
  { name:"両腕", msg:"両腕に力を込めた状態をキープ！", bg:"#7f1d1d"},
  { name:"両腿", msg:"両腿に力を込めた状態をキープ！", bg:"#2d6a4f"},
  { name:"両ふくらはぎ", msg:"両ふくらはぎに力を込めた状態をキープ！", bg:"#495057"},
];

const SECTION = 180;
const TOTAL = SECTION * exercises.length;

export default function Home(){

const [started,setStarted]=useState(false);
const [finished,setFinished]=useState(false);
const [sound,setSound]=useState(true);
const [totalLeft,setTotalLeft]=useState(TOTAL);

const audioRef=useRef(null);

const beep=(freq,duration)=>{

if(!sound || !audioRef.current) return;

const ctx=audioRef.current;

const osc=ctx.createOscillator();
const gain=ctx.createGain();

osc.type="sine";
osc.frequency.value=freq;

osc.connect(gain);
gain.connect(ctx.destination);

gain.gain.value=0.05;

osc.start();

setTimeout(()=>{
osc.stop();
},duration);

};

const pong=()=>beep(520,450);
const pip=()=>beep(1000,100);

useEffect(()=>{

if(!started || finished) return;

const timer=setInterval(()=>{

setTotalLeft(prev=>{

const next=prev-1;

const currentLeft =
SECTION -
((TOTAL-next)%SECTION || SECTION);


// 1分ごと
if(
currentLeft===120 ||
currentLeft===60
){
pip();
}

// 3秒前
if([3,2,1].includes(currentLeft)){
pip();
}

// 次部位開始
if(currentLeft===179){
pong();
}

// 完了
if(next<=0){

pong();

clearInterval(timer);

setFinished(true);

return 0;
}

return next;

});

},1000);

return ()=>clearInterval(timer);

},[started,finished,sound]);

const currentIndex=Math.min(
exercises.length-1,
Math.floor((TOTAL-totalLeft)/SECTION)
);

const current=
exercises[currentIndex];

const currentLeft=
SECTION-
((TOTAL-totalLeft)%SECTION || SECTION);

const fmt=(s)=>{

const m=Math.floor(s/60);
const sec=s%60;

return `${m}:${String(sec).padStart(2,"0")}`;

};

return(

<main style={{

minHeight:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
textAlign:"center",

background:
finished?"#fff":
started?current.bg:"#fff",

color:
finished?"#111":
started?"#fff":"#111",

transition:"0.8s"

}}>

{/* 初期 */}

{!started && !finished && (

<div>

<h1
style={{
fontSize:56,
marginBottom:10
}}
>
Train-ing
</h1>

<p
style={{
marginBottom:40,
lineHeight:1.8
}}
>
通勤時間を<br/>
ながら筋トレ時間へ
</p>


<div
style={{
display:"flex",
justifyContent:"center",
gap:12,
alignItems:"center",
marginBottom:40
}}
>

<span>Sound</span>

<button
onClick={()=>setSound(!sound)}
style={{

width:60,
height:32,
borderRadius:30,
border:"none",

background:
sound
?"#111"
:"#ccc",

position:"relative",

cursor:"pointer"

}}
>

<div
style={{

width:24,
height:24,

background:"#fff",

borderRadius:"50%",

position:"absolute",

top:4,

left:
sound
?32
:4,

transition:"0.3s"

}}
/>

</button>

</div>

<button

onClick={()=>{

audioRef.current=
new(
window.AudioContext||
window.webkitAudioContext
)();

setStarted(true);

pong();

}}

style={{

padding:"20px 50px",
fontSize:28,
borderRadius:12,
cursor:"pointer"

}}

>

START

</button>

</div>

)}

{/* トレ中 */}

{started && !finished && (

<div>

<div>TOTAL</div>

<h1>{fmt(totalLeft)}</h1>

<div>
CURRENT {fmt(currentLeft)}
</div>

<h2
style={{
fontSize:48,
marginTop:40
}}
>
{current.name}
</h2>

<p>{current.msg}</p>

</div>

)}

{/* 終了 */}

{finished && (

<div>

<h1>
お疲れ様でした！
</h1>

<p>
今日も一日頑張りましょう
</p>

</div>

)}

</main>

);

}