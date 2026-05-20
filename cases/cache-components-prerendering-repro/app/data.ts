async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getData(id: string) {
  await delay(500);
  return { id, timestamp: Date.now() };
}
