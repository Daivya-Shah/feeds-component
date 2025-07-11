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

  return (
    <div className="min-h-screen bg-background">
      {/* Notes icon and User buttons */}
      <div className="px-4 pt-4 pb-4 flex gap-2 flex-wrap items-center">
        <button onClick={() => setSidebarVisible(true)} aria-label="Open notes sidebar">
          <img src={notesIcon} alt="Notes" className="w-6 h-6 object-contain" />
        </button>
        {users.map((user) => (
          <button
            key={user}
            onClick={() => {
              setSelectedUser(user);
            }}
            className={`px-3 py-2 rounded text-sm font-medium ${
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
      />
    </div>
  );
};