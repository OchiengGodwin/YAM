import { Suspense } from 'react';
import DiscoverClient from './DiscoverClient';

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center py-12">Loading discovery…</div>}>
      <DiscoverClient />
    </Suspense>
  );
}
