'use client';

export function BackButton() {
  return (
    <button className="primary-button" type="button" onClick={() => window.history.back()}>
      Go back through history
    </button>
  );
}
