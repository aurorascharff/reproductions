import Link from 'next/link';

const rows = Array.from({length: 40}, (_, index) => index + 1);

export function ScrollCase({evict}: {evict: boolean}) {
  const detailHref = evict ? '/step-one' : '/retained-detail';

  return (
    <div className="page-scroll" data-testid="scroll-container">
      <div className="sticky-instructions">
        <div>
          <span className={`badge ${evict ? 'failure-badge' : 'control-badge'}`}>
            {evict ? 'Evicted' : 'Retained'}
          </span>
          <strong>{evict ? 'Visit four routes before Back' : 'Go Back immediately'}</strong>
        </div>
        <p>
          Scroll down and open a numbered row. {evict ? 'Follow all four steps.' : 'Then go straight Back.'}
        </p>
      </div>

      <div className="row-list">
        {rows.map(row => (
          <Link key={row} href={detailHref} className="row-card" data-testid={`row-${row}`}>
            <span className="row-number">{String(row).padStart(2, '0')}</span>
            <span>
              <strong>Open detail</strong>
              <small>{evict ? 'The list will leave Activity’s retention window' : 'Return immediately with Back'}</small>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
