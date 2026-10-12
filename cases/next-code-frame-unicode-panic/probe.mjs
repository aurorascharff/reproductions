import { codeFrameColumns } from "next/dist/shared/lib/errors/code-frame.js";
import { loadBindings } from "next/dist/build/swc/index.js";

const width = Number(process.argv[2] ?? 80);
const source = `export default function Page() {
  (null as any).v;
  return (
    <div>
      <span title={\`این متن فارسی عمداً طولانی است تا برش قاب کد در عرض‌های مختلف ترمینال روی یک نویسهٔ چندبایتی فرود بیاید و خرابی گزارش خطا را بازتولید کند.\`} />
    </div>
  );
}`;

await loadBindings();

const frame = codeFrameColumns(
  source,
  { start: { line: 2, column: 17 } },
  { color: true, highlightCode: true, maxWidth: width },
);

console.log(frame);
