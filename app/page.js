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

  const audioRef = useRef(null);

  const beep=(freq=880,duration=0.1)=>{

    if(!sound || !audioRef.current) return;

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
    },duration*1000);

  };

  const pong=()=>beep(523,0.5); //ポーン
  const pip=()=>beep(1000,0.08); //ピッ

  useEffect(()=>{

    if(!started || finished) return;

    const timer=setInterval(()=>{

      setTotalLeft(prev=>{

        const next=prev-1;

        const sectionLeft=
          SECTION -
          ((TOTAL-next)%SECTION || SECTION);

        // 毎分
        if(sectionLeft===120 || sectionLeft===60){
          pip();
        }

        // 3秒前
        if([3,2,1].includes(sectionLeft)){
          pip();
        }

        // CURRENT切替
        if(sectionLeft===180){
          pong();
        }

        // 終了
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

  const currentIndex=
    Math.min(
      exercises.length-1,
      Math.floor((TOTAL-totalLeft)/SECTION)
    );

  const sectionLeft=
    SECTION-
    ((TOTAL-totalLeft)%SECTION || SECTION);

  const current=exercises[currentIndex];

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
finished?"#111":"#fff",
transition:"0.8s"
}}>

{!started && (

<div>

<h1>Train-ing</h1>

<label
style={{
display:"flex",
gap:10,
justifyContent:"center",
marginBottom:30
}}
>

Sound

<input
type="checkbox"
checked={sound}
onChange={()=>setSound(!sound)}
/>

</label>

<button
onClick={()=>{

audioRef.current =
new(
window.AudioContext||
window.webkitAudioContext
)();

setStarted(true);
pong();

}}
style={{
padding:"18px 40px",
fontSize:24
}}
>

START

</button>

</div>

)}

{started && !finished && (

<div>

<div>TOTAL</div>
<h1>{fmt(totalLeft)}</h1>

<div>
CURRENT {fmt(sectionLeft)}
</div>

<h2>{current.name}</h2>

<p>{current.msg}</p>

</div>

)}

{finished && (

<div>

<h1>お疲れ様でした！</h1>
<p>今日も一日頑張りましょう</p>

</div>

)}

</main>

  );

}