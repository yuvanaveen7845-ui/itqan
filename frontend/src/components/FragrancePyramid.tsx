'use client';

import { useState } from 'react';

interface Note {
  name: string;
  description: string;
}

interface FragrancePyramidProps {
  top: Note[];
  heart: Note[];
  base: Note[];
}

export default function FragrancePyramid({ top, heart, base }: FragrancePyramidProps) {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const NoteSection = ({ title, notes, type }: { title: string; notes: Note[]; type: 'top' | 'heart' | 'base' }) => (
    <div className="space-y-6 group/note">
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-black text-premium-gold/40 uppercase tracking-[0.4rem]">{title}</span>
        <div className="note-line opacity-20 group-hover/note:opacity-60 transition-opacity"></div>
      </div>
      <div className="flex flex-wrap gap-4">
        {notes.map((note) => (
          <div
            key={note.name}
            onMouseEnter={() => setActiveNote(note.name)}
            onMouseLeave={() => setActiveNote(null)}
            className={`cursor-crosshair px-6 py-3 border border-premium-gold/10 glass-panel note-layer ${
              activeNote === note.name ? 'border-premium-gold bg-premium-gold/5' : ''
            }`}
          >
            <span className="text-sm noto-serif text-white">{note.name}</span>
            {activeNote === note.name && (
              <div className="absolute top-full left-0 mt-4 p-6 bg-zinc-950 border border-premium-gold/20 z-50 min-w-[200px] shadow-2xl animate-reveal">
                <p className="text-[10px] text-premium-gold font-black uppercase tracking-widest mb-2">{title} Note</p>
                <p className="text-xs text-white/60 leading-relaxed font-manrope">{note.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-16 py-12">
      <div className="flex flex-col gap-12">
        <NoteSection title="The Head (Top)" notes={top} type="top" />
        <NoteSection title="The Soul (Heart)" notes={heart} type="heart" />
        <NoteSection title="The Foundation (Base)" notes={base} type="base" />
      </div>
      
      {/* Visual Pyramid Decoration */}
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-premium-gold/20 to-transparent">
        <div className="absolute left-1/2 -top-1 -translate-x-1/2 w-2 h-2 rotate-45 border border-premium-gold/40 bg-premium-black"></div>
      </div>
    </div>
  );
}
