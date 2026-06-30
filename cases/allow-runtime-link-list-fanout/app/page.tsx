export const prefetch = 'allow-runtime';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>
        Hard-load this page, then watch the Network tab (filter <code>_rsc=</code>) and the dev
        server terminal. You clicked nothing, yet every playlist link in the sidebar fires its own
        runtime prefetch.
      </p>
    </div>
  );
}
