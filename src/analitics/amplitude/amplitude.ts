// amplitude.ts
"use client";

import * as amplitude from "@amplitude/analytics-browser";

async function initAmplitude() {
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

  if (typeof window === "undefined" || !apiKey) {
    console.warn(
      "Amplitude not initialized: running on server or missing NEXT_PUBLIC_AMPLITUDE_API_KEY",
    );
    return;
  }

  try {
    await amplitude.init(apiKey, undefined, {
    autocapture: true,
  }).promise
  } catch (err) {
    console.error("Amplitude init failed:", err);
  }
}

initAmplitude();



export const Amplitude = () => null;
export default amplitude;
