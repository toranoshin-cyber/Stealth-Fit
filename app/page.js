"use client";

import { useState, useEffect, useRef } from "react";

const parts = [
  { name: "お腹を軽く締めるだけでOK", label: "体幹" },
  { name: "お尻を少し意識して立つだけ", label: "お尻・腰" },
  { name: "足を軽く踏ん張る感じでOK", label: "脚" },
  { name: "背筋をスッと伸ばしてみて", label: "上半身" },
];

export default function Home() {
  const [running, setRunning] = useState(false);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(5); // 駅数
  const intervalRef = useRef(null);

  const DURATION = 120000; // 1駅 = 2分

  useEffect(() => {
    if (running) {
      notify("通勤トレ、スタートしました");

      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % parts.length);
        setRemaining((prev) => prev - 1);

        notify(parts[(index + 1) % parts.length].name);

      }, DURATION);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (remaining <= 0 && running) {
      stop();
      notify("今日の通勤トレ、おつかれさまでした");
    }
  }, [remaining]);

  const start = async () => {
    if ("Notification" in window) {
      await Notification.requestPermission();
    }
    setRunning(true);
    setRemaining(5);
    setIndex(0);
  };

  const stop = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const notify = (text) => {
    if (Notification.permission === "granted") {
      new Notification(text);
    }
  };

  return (
    <main style={{ padding: 20, textAlign: "center" }}>
      <h1>Train-ing</h1>

      {!running ? (
        <button onClick={start} style={btn}>
          スタート
        </button>
      ) : (
        <button onClick={stop} style={btn}>
          ストップ
        </button>
      )}

      <div style={{ marginTop: 40 }}>
        <h2>{parts[index].label}</h2>
        <p>{parts[index].name}</p>
      </div>

      <p style={{ marginTop: 20 }}>
        あと {remaining} 駅
      </p>
    </main>
  );
}

const btn = {
  padding: "15px 30px",
  fontSize: "18px",
  borderRadius: "10px",
};