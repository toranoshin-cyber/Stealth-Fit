"use client";

import { useState } from "react";

export default function Home() {
  const [ok, setOk] = useState(false);

  return (
    <main style={{ padding: 80 }}>
      {!ok ? (
        <button
          onClick={() => setOk(true)}
          style={{
            fontSize: "30px",
            padding: "30px"
          }}
        >
          START
        </button>
      ) : (
        <h1>成功！</h1>
      )}
    </main>
  );
}