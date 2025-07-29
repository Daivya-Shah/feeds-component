import React, { useState } from 'react';
import { CalendarFeedSidebar, mockNotes } from './CalendarFeedSidebar';
import calendarIcon from '@/components/icons/calendar.svg';

export const CalendarDemo: React.FC = () => {
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
          <div style={{ position: 'relative', width: '24px', height: '24px' }}>
            <img src={calendarIcon} alt="Calendar" className="w-6 h-6 object-contain" />
            {notes.length > 0 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '6px',
                height: '6px',
                borderRadius: '999px',
                background: '#1D4ED8'
              }} />
            )}
          </div>
        </button>
      </div>

      {/* Inline Notes Feed */}
      <div className="px-4">
        <CalendarFeedSidebar
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
      <CalendarFeedSidebar
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