import React from 'react';
import { Suspense } from 'react';
import BookingClient from './BookingClient';

export default function BookPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingClient />
    </Suspense>
  );
}
