'use client';

import { useEffect, useState, useRef } from 'react';

const LINES = [
  'Rewrite this IB deal bullet — name the model and the assumptions...',
  'Write a cold LinkedIn message for a BCG analyst role...',
  'Excavate the LBO entry multiple before touching the CV...',
  'Draft a cover letter hook from this CSRD gap analysis...',
  'Prescribe the exact proactive deliverable for this luxury house...',
  'Generate a PE sourcing signal — not "deal flow", the specific trigger...',
  'Write the crisis holding statement — first 2 hours only...',
  'Reframe this ESG bullet using double materiality vocabulary...',
  'Build the sprint spec with HIPAA constraint in the acceptance criteria...',
  'Identify the sell-through anomaly before writing the recommendation...',
  'Draft interview prep for a Trading role — name the Bloomberg functions...',
  'Rewrite this consulting bullet — framework and client outcome only...',
];

const TYPING_SPEED = 38;
const DELETING_SPEED = 16;
const PAUSE_AFTER_TYPE = 2400;
const PAUSE_AFTER_DELETE = 350;

export default function TypewriterHero() {
  const [displayed, setDisplayed] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'waiting'>('typing');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = LINES[lineIndex];
    const clear = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        timeoutRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), TYPING_SPEED);
      } else {
        timeoutRef.current = setTimeout(() => setPhase('pausing'), PAUSE_AFTER_TYPE);
      }
    } else if (phase === 'pausing') {
      timeoutRef.current = setTimeout(() => setPhase('deleting'), 0);
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => setDisplayed((d) => d.slice(0, -1)), DELETING_SPEED);
      } else {
        timeoutRef.current = setTimeout(() => { setLineIndex((i) => (i + 1) % LINES.length); setPhase('waiting'); }, PAUSE_AFTER_DELETE);
      }
    } else if (phase === 'waiting') {
      timeoutRef.current = setTimeout(() => setPhase('typing'), 0);
    }

    return clear;
  }, [displayed, phase, lineIndex]);

  return (
    <div className="mt-[60px] flex items-center justify-center gap-2">
      <p className="font-mono text-[14px] text-[#6B6B6B] leading-[1.6] min-h-[22px]">
        {displayed}
        <span className="inline-block w-[2px] h-[14px] bg-[#E8622A] ml-[2px] align-middle animate-[blink_1s_step-end_infinite]" />
      </p>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}
