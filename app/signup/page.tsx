'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('Mechanic');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create the Auth User in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (user) {
      // 2. Get location and send to your FastAPI "Pro-Connect" Brain
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const response = await fetch('http://127.0.0.1:8000/register-pro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pro: {
                full_name: fullName,
                profession: profession,
                lat: latitude,
                lng: longitude
              },
              user_id: user.id // Linking the Auth ID to the Pro table
            }),
          });

          if (response.ok) {
            alert("Success! Please check your email for the confirmation link.");
          }
        } catch (err) {
          console.error("Backend sync failed:", err);
        } finally {
          setLoading(false);
        }
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
       {/* (Keep the same form UI from the previous step) */}
    </main>
  );
}