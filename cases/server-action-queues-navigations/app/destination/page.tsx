async function getDestination() {
  return "Destination page (dynamic, no caching, no prefetch).";
}

export default async function Destination() {
  const message = await getDestination();
  return (
    <>
      <h1 style={{ marginTop: 0 }}>Destination</h1>
      <p>{message}</p>
    </>
  );
}
