import { useApp } from '../state';

/** Passing notices, announced politely to screen readers. */
export function Toast() {
  const notice = useApp((s) => s.notice);
  return (
    <div className="toast-host" aria-live="polite" role="status">
      {notice ? (
        <div key={notice.id} className="toast">
          {notice.text}
        </div>
      ) : null}
    </div>
  );
}
