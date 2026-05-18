"use client";

import { useEffect, useState } from "react";

const exercises = [
  { name: "腹筋", msg: "お腹に力を込めた状態をキープ！", bg:"#111", color:"#fff"},
  { name: "お尻", msg: "お尻に力を込めた状態をキープ！", bg:"#1e3a5f", color:"#fff"},
  { name: "大胸筋", msg: "胸に力を込めた状態をキープ！", bg:"#5a189a", color:"#fff"},
  { name: "両腕", msg: "両腕に力を込めた状態をキープ！", bg:"#7f1d1d", color:"#fff"},
  { name: "両腿", msg: "両腿に力を込めた状態をキープ！", bg:"#2d6a4f", color:"#fff"},
  { name: "両ふくらはぎ", msg: "両ふくらはぎに力を込めた状態をキープ！", bg:"#495057", color:"#fff"},
];

const SECTION = 180; //3分
const TOTAL = SECTION * exercises.length;

export default function Home(){

  const [started,setStarted]=useState(false);
  const [finished,setFinished]=useState(false);
  const [totalLeft,setTotalLeft]=useState(TOTAL);

  useEffect(()=>{

    if(!started || finished) return;

    const timer=setInterval(()=>{

      setTotalLeft(prev=>{

        if(prev<=1){
          clearInterval(timer);
          setFinished(true);
          return 0;
        }

        return prev-1;

      });

    },1000);

    return ()=>clearInterval(timer);

  },[started,finished]);

  const currentIndex=
    Math.min(
      exercises.length-1,
      Math.floor((TOTAL-totalLeft)/SECTION)
    );

  const sectionLeft=
    SECTION -
    ((TOTAL-totalLeft)%SECTION || SECTION);

  const current=
    exercises[currentIndex];

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
        ? "#fff"
        : started
        ? current.bg
        : "#fff",

      color:
        finished
        ? "#111"
        : started
        ? current.color
        : "#111",

      transition:"0.8s"
    }}>

      {!started && !finished && (

        <div>

          <h1>Train-ing</h1>

          <p>
            通勤時間を<br/>
            “ながら筋トレ時間”へ
          </p>

          <button
            onClick={()=>setStarted(true)}
            style={{
              padding:"18px 40px",
              fontSize:"26px",
              borderRadius:"12px",
              border:"none",
              cursor:"pointer"
            }}
          >
            START
          </button>

        </div>

      )}

      {started && !finished && (

        <div>

          <div style={{fontSize:18}}>
            TOTAL
          </div>

          <h1>
            {fmt(totalLeft)}
          </h1>

          <div>
            CURRENT {fmt(sectionLeft)}
          </div>

          <h2 style={{marginTop:40}}>
            {current.name}
          </h2>

          <p>
            {current.msg}
          </p>

        </div>

      )}

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