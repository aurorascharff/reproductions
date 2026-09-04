'use client';

export function HistoryJumpButton() {
  return (
    <button className="primary-button" type="button" onClick={() => window.history.go(-4)}>
      Return to the list through history
    </button>
  );
}
