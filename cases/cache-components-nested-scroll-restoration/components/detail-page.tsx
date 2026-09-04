import {BackButton} from './back-button';

export function DetailPage() {
  return (
    <div className="page-scroll">
      <article className="detail-card">
        <p className="eyebrow">Retained control</p>
        <h1>Now go back</h1>
        <p className="lead">
          Use the browser Back button, swipe-back gesture, or the button below. The list is still retained,
          so it returns to the same numbered row.
        </p>
        <BackButton />
      </article>
    </div>
  );
}
