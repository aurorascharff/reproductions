import { execFileSync } from "node:child_process";
import { chromium } from "playwright";

const baseURL = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const rawRequestTarget = process.argv.includes("--raw-request-target");
const paths = [
  "/über/example/",
  "/%C3%BCber/example/",
  "/uber/example/",
  "/über-encoded/example/",
  "/%C3%BCber-encoded/example/",
  "/target/",
];

console.log(JSON.stringify({ baseURL, node: process.version }));
for (const path of paths) {
  const headers = execFileSync(
    "curl",
    [
      "--path-as-is",
      ...(rawRequestTarget ? ["--http1.1", "--request-target", path] : []),
      "--max-time",
      "60",
      "--silent",
      "--show-error",
      "--output",
      "/dev/null",
      "--dump-header",
      "-",
      baseURL + path,
    ],
    { encoding: "utf8" },
  );
  console.log(
    JSON.stringify({
      client: rawRequestTarget ? "curl-raw-request-target" : "curl",
      input: path,
      status: Number(headers.match(/^HTTP\/\S+\s+(\d+)/m)?.[1]),
      location: headers.match(/^location:\s*(.*)\r?$/im)?.[1].trim() || null,
    }),
  );
}

const browser = rawRequestTarget
  ? null
  : await chromium.launch({ headless: true });
if (browser) {
  try {
    console.log(JSON.stringify({ browser: browser.version() }));
    for (const path of paths) {
      // Isolate each navigation so permanent redirects cannot carry over.
      const context = await browser.newContext();
      try {
        const page = await context.newPage();
        const network = [];
        page.on("response", (response) => {
          if (response.request().isNavigationRequest()) {
            network.push({
              url: response.url(),
              status: response.status(),
              location: response.headers().location || null,
            });
          }
        });
        await page.goto(baseURL + path, {
          waitUntil: "domcontentloaded",
          timeout: 60_000,
        });
        console.log(
          JSON.stringify({
            client: "chromium",
            input: path,
            network,
            finalURL: page.url(),
          }),
        );
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
