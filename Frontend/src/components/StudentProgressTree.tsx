import React from 'react';
import { Phase, StudentProgress } from '@/services/api';
import LiveAnimated2DTree from '@/components/LiveAnimated2DTree';

interface StudentProgressTreeProps {
  phases: Phase[];
  progressMap: Record<string, StudentProgress>;
}

export default function StudentProgressTree({ phases, progressMap }: StudentProgressTreeProps) {
  return (
    <div className="w-full">
      <LiveAnimated2DTree phases={phases} progressMap={progressMap} />
    </div>
  );
}
