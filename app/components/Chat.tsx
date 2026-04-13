'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yam-mg62.onrender.com';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Chat({ jobId, userId }: { jobId: string, userId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch existing messages and subscribe to new ones
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat-${jobId}`)
      .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages', 
          filter: `job_id=eq.${jobId}` 
        }, 
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [jobId]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await supabase.from('messages').insert({
      job_id: jobId,
      sender_id: userId,
      content: newMessage
    });
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[400px] w-full lyft-panel overflow-hidden">
      <div className="p-4 font-bold text-white bg-[var(--deep-blue)] border-b-2 border-[rgba(37,99,235,0.35)]">Live Chat</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[rgba(245,240,232,0.45)]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.sender_id === userId
                ? 'text-white rounded-tr-none bg-[var(--deep-blue)] border-2 border-[rgba(37,99,235,0.45)]'
                : 'bg-white border-2 border-[rgba(37,99,235,0.25)] text-[var(--foreground)] rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <form onSubmit={sendMessage} className="p-3 border-t-2 border-[rgba(37,99,235,0.25)] bg-white/90 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border-2 border-[rgba(160,130,109,0.6)] rounded-full px-4 text-sm outline-none focus:border-[var(--accent-blue)]"
        />
        <button type="submit" className="lyft-secondary-btn p-2 rounded-full px-4 font-bold text-sm smooth-transition hover:-translate-y-0.5">Send</button>
      </form>
    </div>
  );
}