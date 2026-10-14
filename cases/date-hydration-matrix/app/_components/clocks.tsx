"use client";

import { use } from "react";
import { io } from "next/cache";

export function DirectYear() {
  return <time className="value">{new Date().getFullYear()}</time>;
}

export function DirectTimestamp() {
  return <time className="value">{Date.now()}</time>;
}

export function IoYear() {
  use(io());
  return <time className="value">{new Date().getFullYear()}</time>;
}

export function IoTimestamp() {
  use(io());
  return <time className="value">{Date.now()}</time>;
}
