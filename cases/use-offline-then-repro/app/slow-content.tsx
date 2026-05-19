async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function SlowContent({ id }: { id: string }) {
  'use cache';
  await delay(1000);
  return (
    <div style={{ padding: 16, border: '1px solid #444', borderRadius: 8, marginTop: 12 }}>
      <p>Loaded content for ID: <strong>{id}</strong></p>
      <p style={{ color: '#888', fontSize: 12 }}>This took 1 second to load on the server.</p>
    </div>
  );
}
