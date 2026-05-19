"use client";

import { useEffect, useRef, useState } from "react";

const exercises = [

{
name:"お腹",
bg:"#111",
tip:"きついズボンのチャックを閉めるため、お腹を薄くするイメージ",
image:"🫃➡️🧍",
msg:"お腹を凹ませてキープ"
},

{
name:"お尻",
bg:"#263238",
tip:"左右のお尻でコインを挟むイメージ",
image:"🪙",
msg:"お尻をキュッと締める"
},

{
name:"太もも",
bg:"#1b5e20",
tip:"膝を動かさず内→外へ押し合う",
image:"🦵",
msg:"太もも全体に力"
},

{
name:"背中上部",
bg:"#0d47a1",
tip:"つり革を後ろ斜めに引く",
image:"🚇",
msg:"肩甲骨を寄せる"
},

{
name:"両腕",
bg:"#6a1b9a",
tip:"つり革を手前に引く",
image:"💪",
msg:"腕全体を意識"
},

{
name:"背中下部",
bg:"#5d4037",
tip:"姿勢を良くした時の腰の両脇",
image:"🧍",
msg:"腰まわりを締める"
},

{
name:"ふくらはぎ",
bg:"#455a64",
tip:"つま先立ち→ゆっくり下ろす",
image:"🦶",
msg:"上下を繰り返す"
}

];

export default function Home(){

const [level,setLevel]=useState(1);
const [started,setStarted]=useState(false);
const [finished,setFinished]=useState(false);
const [sound,setSound]=useState(true);
const [totalLeft,setTotalLeft]=useState(0);

const audioRef=useRef(null);

const SECTION=level*60;
const TOTAL=SECTION*exercises.length;

const currentIndex=
Math.min(
exercises.length-1,
Math.floor((TOTAL-totalLeft)/SECTION)
);

const current=
exercises[currentIndex];

const currentLeft=
SECTION-
((TOTAL-totalLeft)%SECTION||SECTION);

const beep=(freq,dur)=>{

if(!sound || !audioRef.current)return;

const ctx=audioRef.current;

const osc=ctx.createOscillator();
const gain=ctx.createGain();

osc.frequency.value=freq;
osc.type="sine";

osc.connect(gain);
gain.connect(ctx.destination);

gain.gain.value=0.05;

osc.start();

setTimeout(()=>{
osc.stop();
},dur);

};

const pong=()=>beep(520,400);
const pip=()=>beep(1000,80);
const tick=()=>beep(700,40);

useEffect(()=>{

if(!started || finished)return;

const timer=setInterval(()=>{

setTotalLeft(prev=>{

const next=prev-1;

const sectionRemain=
SECTION-
((TOTAL-next)%SECTION||SECTION);


//10秒毎
if(
sectionRemain%10===0 &&
sectionRemain!==0
){
tick();
}

//1分毎
if(
sectionRemain===120 ||
sectionRemain===60
){
pip();
}

//3秒前
if([3,2,1].includes(sectionRemain)){
pip();
}

//次種目
if(sectionRemain===SECTION-1){
pong();
}

//終了
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

},[
started,
finished,
sound,
SECTION,
TOTAL
]);

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

{!started && !finished &&(

<div>

<h1 style={{fontSize:56}}>
Train-ing
</h1>

<p>
通勤時間を<br/>
ながら筋トレへ
</p>

<div style={{marginTop:30}}>

<h3>コース選択</h3>

<button onClick={()=>setLevel(1)}>
通勤デビュー（1分）
</button>

<button onClick={()=>setLevel(2)}>
習慣化（2分）
</button>

<button onClick={()=>setLevel(3)}>
ガチ勢（3分）
</button>

</div>


<div style={{
marginTop:30
}}>

Sound

<input
type="checkbox"
checked={sound}
onChange={()=>setSound(!sound)}
/>

</div>


<button

style={{
marginTop:40,
padding:"20px 50px",
fontSize:30
}}

onClick={()=>{

audioRef.current=
new(
window.AudioContext||
window.webkitAudioContext
)();

setStarted(true);

setTotalLeft(TOTAL);

pong();

}}

>

START

</button>

</div>

)}

{started && !finished &&(

<div>

<div>TOTAL</div>

<h1>
{fmt(totalLeft)}
</h1>

<div>

CURRENT

<h2>
{fmt(currentLeft)}
</h2>

</div>


<h1 style={{
fontSize:60
}}>
{current.image}
</h1>

<h2>
{current.name}
</h2>

<p>
{current.msg}
</p>

<div style={{

opacity:.8,
maxWidth:280,
margin:"20px auto"

}}>
💡 {current.tip}
</div>

</div>

)}

{finished &&(

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