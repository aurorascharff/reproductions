export default function Page() {
  const start = performance.now()
  const sum = [1, 2, 3].reduce((a, b) => a + b)
  console.info('elapsed-ms:', performance.now() - start)
  return <main><h1>Static result: {sum}</h1></main>
}
