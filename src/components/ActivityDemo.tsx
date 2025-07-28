import React, { useState } from 'react';
import { ActivityFeedSidebar, mockNotes } from './ActivityFeedSidebar';
import boltIcon from '@/components/icons/bolt.svg';

export const ActivityDemo: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notes, setNotes] = useState([...mockNotes]);

  const handleAddNote = (note: any) => {
    setNotes((prev) => [...prev, note]);
  };

  const handleUpdateNotes = (updated: any[]) => {
    setNotes(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Notes icon */}
      <div className="px-4 pt-4 pb-4 flex gap-2 items-center">
        <button onClick={() => setSidebarVisible(true)} aria-label="Open activity sidebar">
          <img src={boltIcon} alt="Activity" className="w-6 h-6 object-contain" />
        </button>
      </div>

      {/* Inline Notes Feed */}
      <div className="px-4">
        <ActivityFeedSidebar
          // `visible` is ignored when `inline` is true, but required by the props.
          visible={false}
          onHide={() => { /* no-op for inline */ }}
          inline
          clientName="Crucial AI"
          notes={notes}
          currentAuthor="User"
          onAddNote={handleAddNote}
          onUpdateNotes={handleUpdateNotes}
        />
      </div>

      {/* Sidebar */}
      <ActivityFeedSidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        clientName="Crucial AI"
        notes={notes}
        currentAuthor="User"
        onAddNote={handleAddNote}
        onUpdateNotes={handleUpdateNotes}
      />
    </div>
  );
};