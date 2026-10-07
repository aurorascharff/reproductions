import { spawnSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";

const diagnostic = "outside of `<Suspense>`";
const timerWarning =
  "cannot guarantee that Cache Components will run as expected";

function run(label, command, args) {
  rmSync(".next", { recursive: true, force: true });

  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
    },
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  const logFile = `build-${label.toLowerCase()}.log`;
  writeFileSync(logFile, output);

  console.log(`\n${label}`);
  console.log(`  exit status: ${result.status}`);
  console.log(
    `  false Suspense diagnostic: ${output.includes(diagnostic) ? "YES" : "no"}`,
  );
  console.log(
    `  runtime timer warning: ${output.includes(timerWarning) ? "YES" : "no"}`,
  );
  console.log(`  log: ${logFile}`);

  return {
    label,
    status: result.status,
    hasFalseDiagnostic: output.includes(diagnostic),
    hasTimerWarning: output.includes(timerWarning),
  };
}

const nextBin = "./node_modules/next/dist/bin/next";
const nodeResult = run("Node", process.execPath, [nextBin, "build"]);
const bunResult = run("Bun", "bun", ["--bun", nextBin, "build"]);

console.log("\nExpected: both builds exit 0 without the Suspense diagnostic.");

if (nodeResult.status !== 0 || bunResult.status !== 0) {
  process.exitCode = 1;
} else if (nodeResult.hasFalseDiagnostic || bunResult.hasFalseDiagnostic) {
  console.log("Reproduced: a successful build emitted the false diagnostic.");
  process.exitCode = 1;
} else {
  console.log("Not reproduced on these installed versions.");
}
