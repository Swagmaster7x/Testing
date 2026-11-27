/**
 * Drills: generated exercises that run on the lesson runner, one after another. Each finished
 * exercise is recorded as practice (not rated), so Progress can count them.
 */
import { useMemo, useState } from 'react';
import { createRng } from '../../core/rng';
import { loadPractice } from '../../games/practice';
import { loadGameUi } from '../../games/registry';
import { appDb } from '../../store/db';
import { addAttempt } from '../../store/learning';
import { t } from '../../text';
import { LessonPlayer } from '../learn/LessonScreen';
import { CenterMessage } from '../screens/common';
import { useApp } from '../state';
import { useAsync } from '../useAsync';

export function DrillScreen({ gameId, drillId, seed }: { gameId: string; drillId: string; seed: string | null }) {
  const profileId = useApp((s) => s.profile?.id ?? '');
  const data = useAsync(async () => {
    const [pack, ui] = await Promise.all([loadPractice(gameId), loadGameUi(gameId)]);
    return { pack, ui };
  }, gameId);
  const [round, setRound] = useState(0);
  const [start] = useState(() => seed ?? String(Date.now()));
  const lesson = useMemo(() => {
    if (data.status !== 'done' || !data.value.pack) return null;
    const drill = data.value.pack.drills.find((d) => d.id === drillId);
    if (!drill) return null;
    const rng = createRng(`${start}/${drillId}/${round}`);
    return drill.make(() => rng.next());
  }, [data, drillId, round, start]);
  if (data.status === 'loading') return <CenterMessage>{t('app.loading')}</CenterMessage>;
  if (data.status === 'failed' || !data.value.pack || !lesson) return <CenterMessage>{t('app.not-found')}</CenterMessage>;
  const { pack, ui } = data.value;
  return (
    <LessonPlayer
      key={`${drillId}-${round}`}
      lesson={lesson}
      pack={{ lessons: [], game: pack.game }}
      ui={ui}
      drill={{
        backTo: `/games/${gameId}/practice`,
        onDone: (mistakes) => addAttempt(appDb(), { profileId, gameId, problemId: drillId, solved: mistakes === 0, at: Date.now(), rated: false }),
        onNext: () => setRound((r) => r + 1),
      }}
    />
  );
}
