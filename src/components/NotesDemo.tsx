import React, { useState } from 'react';
import { NotesFeedSidebar, mockNotes } from './NotesFeedSidebar';
import notesIcon from '@/components/icons/notes.svg';

export const NotesDemo: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [notes, setNotes] = useState([...mockNotes]);

  const users = [
    'Alberto Perez',
    'Andrea Williams',
    'Maria Foster',
    'Daivya Shah',
    'Shawn Martin',
  ];

  const handleAddNote = (note: any) => {
    setNotes((prev) => [...prev, note]);
  };

  const handleUpdateNotes = (updated: any[]) => {
    setNotes(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Notes icon and User buttons */}
      <div className="px-4 pt-4 pb-4 flex gap-2 flex-wrap items-center">
        <button onClick={() => setSidebarVisible(true)} aria-label="Open notes sidebar">
          <div style={{ position: 'relative', width: '24px', height: '24px' }}>
            <img src={notesIcon} alt="Notes" className="w-6 h-6 object-contain" />
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
        {users.map((user) => (
          <button
            key={user}
            onClick={() => {
              setSelectedUser(user);
            }}
            className={`h-6 px-3 rounded text-sm font-medium flex items-center ${
              selectedUser === user 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-slate-100 text-gray-900 hover:bg-slate-200'
            }`}
          >
            {user}
          </button>
        ))}
      </div>

      {/* Inline Notes Feed */}
      <div className="px-4">
        <NotesFeedSidebar
          // `visible` is ignored when `inline` is true, but required by the props.
          visible={false}
          onHide={() => { /* no-op for inline */ }}
          inline
          clientName="Crucial AI"
          notes={notes}
          currentAuthor={selectedUser ?? 'Anonymous'}
          onAddNote={handleAddNote}
          onUpdateNotes={handleUpdateNotes}
        />
      </div>

      {/* Sidebar */}
      <NotesFeedSidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        clientName="Crucial AI"
        notes={notes}
        currentAuthor={selectedUser ?? 'Anonymous'}
        onAddNote={handleAddNote}
        onUpdateNotes={handleUpdateNotes}
      />
    </div>
  );
};