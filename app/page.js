"use client";

import { useEffect, useRef, useState } from "react";

const exercises = [

{
name:"お腹",
bg:"#111",
msg:"お腹を凹ませてキープ",
tip:"きついズボンのチャックを閉めるイメージ",

image:`
 〇
╱│╲
 █
╱ ╲
`
},

{
name:"お尻",
bg:"#263238",
msg:"お尻を締める",
tip:"コインを挟む感覚",

image:`
 〇
╱│╲
╱█╲
╱ ╲
`
},

{
name:"太もも",
bg:"#1b5e20",
msg:"内側⇄外側へ押し合う",
tip:"膝を動かさない",

image:`
 〇
╱│╲
╱██╲
`
},

{
name:"背中上部",
bg:"#0d47a1",
msg:"肩甲骨を寄せる",
tip:"つり革を後ろへ引く",

image:`
 〇
███
╱│╲
╱ ╲
`
},

{
name:"両腕",
bg:"#6a1b9a",
msg:"腕を引き寄せる",
tip:"つり革を手前へ",

image:`
╲〇╱
 │
╱ ╲
`
},

{
name:"背中下部",
bg:"#5d4037",
msg:"腰脇を締める",
tip:"姿勢を良くする",

image:`
 〇
╱│╲
░█░
╱ ╲
`
},

{
name:"ふくらはぎ",
bg:"#455a64",
msg:"つま先立ち",
tip:"上下運動",

image:`
 〇
╱│╲
╱█╲
 ▲
`
}

];

export default function Home(){

const [level,setLevel]=useState(2);
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

if(!sound||!audioRef.current)return;

const ctx=audioRef.current;

const osc=ctx.createOscillator();
const gain=ctx.createGain();

osc.frequency.value=freq;
osc.type="sine";

osc.connect(gain);
gain.connect(ctx.destination);

gain.gain.value=.05;

osc.start();

setTimeout(()=>osc.stop(),dur);

};

const pong=()=>beep(520,350);
const pip=()=>beep(1000,80);
const tick=()=>beep(700,40);



useEffect(()=>{

if(!started||finished)return;

const timer=setInterval(()=>{

setTotalLeft(prev=>{

const next=prev-1;

const remain=
SECTION-
((TOTAL-next)%SECTION||SECTION);


if(remain%10===0 && remain!==0){
tick();
}

if(remain===120 || remain===60){
pip();
}

if([3,2,1].includes(remain)){
pip();
}

if(remain===SECTION-1){
pong();
}

if(next<=0){

pong();

clearInterval(timer);

setFinished(true);

return 0;
}

return next;

});

},1000);

return()=>clearInterval(timer);

},
[started,finished,SECTION,TOTAL,sound]);


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
finished
?"#fff"
:started
?current.bg
:"#fff",

color:
finished
?"#111"
:started
?"#fff"
:"#111",

transition:"1s"

}}>


{/* 初期画面 */}

{!started&&!finished&&(

<div>

<h1 style={{

fontSize:64,
marginBottom:30

}}>

Train-ing

</h1>


<p>

通勤時間を<br/>
ながら筋トレへ

</p>


<h2>

コース選択

</h2>


<div style={{

display:"flex",
gap:10,
justifyContent:"center",
flexWrap:"wrap"

}}>

{[
[1,"通勤デビュー"],
[2,"習慣化"],
[3,"ガチ勢"]

].map(([lv,label])=>(

<button

key={lv}

onClick={()=>setLevel(lv)}

style={{

padding:"14px",

borderRadius:12,

background:
level===lv
?"#111"
:"#fff",

color:
level===lv
?"#fff"
:"#111",

fontWeight:
level===lv
?"bold"
:"normal",

transform:
level===lv
?"scale(1.08)"
:"scale(1)",

border:
level===lv
?"2px solid #111"
:"1px solid #aaa",

transition:".2s"

}}

>

{label}<br/>
({lv}分)

</button>

))}

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

style={{

marginTop:40,

padding:
"20px 60px",

fontSize:32

}}

>

START

</button>

</div>

)}



{/* トレ中 */}

{started&&!finished&&(

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


<pre style={{

fontSize:34,

lineHeight:1.1,

fontFamily:"monospace",

letterSpacing:"2px",

marginTop:20

}}>

{current.image}

</pre>


<h2>

{current.name}

</h2>


<div>

{current.msg}

</div>


<div style={{

opacity:.8,

maxWidth:280,

marginTop:20,

marginInline:"auto"

}}>

💡 {current.tip}

</div>

</div>

)}



{/* 終了 */}

{finished&&(

<div>

<h1>

お疲れ様でした！

</h1>

<p>

今日も一日<br/>
頑張りましょう

</p>


<button

onClick={()=>location.reload()}

style={{

padding:
"16px 32px",

marginTop:20

}}

>

もう一度

</button>

</div>

)}

</main>

);

}