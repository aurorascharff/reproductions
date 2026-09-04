import Link from 'next/link';
import {HistoryJumpButton} from './history-jump-button';

export function StepPage({step, nextHref}: {step: number; nextHref?: string}) {
  return (
    <div className="page-scroll">
      <article className="detail-card">
        <p className="eyebrow">Distinct route {step} of 4</p>
        <h1>{step === 4 ? 'The list is now evicted' : 'Continue forward'}</h1>
        <p className="lead">
          {step === 4
            ? 'Jump back through the four history entries. The list is recreated, but its nested scroll offset is not restored.'
            : 'Each distinct route advances Activity’s three-route retention window. Continue without using Back yet.'}
        </p>
        {nextHref ? (
          <Link className="primary-button" href={nextHref}>
            Continue to route {step + 1}
          </Link>
        ) : (
          <HistoryJumpButton />
        )}
      </article>
    </div>
  );
}
