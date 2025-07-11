import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { formatRelativeTime } from '../utils/timeFormatting';
import { StickyNote, Search, ChevronDown, X, Send } from 'lucide-react';

interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  avatar: string;
  categories: string[];
  isPrivate?: boolean;
  level?: number;
}

interface NotesFeedSidebarProps {
  visible: boolean;
  onHide: () => void;
  clientName?: string;
  notes?: Note[];
}

const mockNotes: Note[] = [
  {
    id: '1',
    author: 'Alberto Perez',
    content: 'Do diligence on Crucial\'s financials, seem like they have a lot of growth potential.',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Qualification'],
    level: 1
  },
  {
    id: '2',
    author: 'Andrea Williams',
    content: 'Crucial just got Series C funding from Andreesen Horowitz. Should grow headcount significantly.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Qualification'],
    level: 1
  },
  {
    id: '3',
    author: 'Alberto Perez',
    content: 'Had a great call with Greg, Crucial\'s CEO. They have intent to move in the next quarter.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Qualification'],
    level: 1
  },
  {
    id: '4',
    author: 'Alberto Perez',
    content: 'Crucial is looking to find a new HQ in NYC in Midtown. They need a fully built, Class A space.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    avatar: 'https://placehold.co/24x24',
    categories: ['Qualification'],
    isPrivate: true,
    level: 1
  },
  {
    id: '5',
    author: 'Andrea Williams',
    content: 'Do you have an idea when they\'re looking to move?',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Qualification'],
    level: 1
  },
  {
    id: '6',
    author: 'Maria Foster',
    content: 'It sounds like they\'re waiting for the right space, but would be ready to close within a month',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    avatar: 'https://placehold.co/50x50',
    categories: ['Team', 'Qualification'],
    level: 2
  }
];

const categoryOptions = [
  { label: 'All Categories', value: null },
  { label: 'Team', value: 'Team' },
  { label: 'Qualification', value: 'Qualification' },
  { label: 'Private', value: 'Private' }
];

export const NotesFeedSidebar: React.FC<NotesFeedSidebarProps> = ({
  visible,
  onHide,
  clientName = 'Crucial AI',
  notes = mockNotes
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [noteCategory, setNoteCategory] = useState(null);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || note.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleSaveNote = () => {
    if (newNote.trim()) {
      // Handle note saving logic here
      console.log('Saving note:', { content: newNote, category: noteCategory });
      setNewNote('');
      setNoteCategory(null);
    }
  };

  return (
    <Sidebar 
      visible={visible} 
      position="right" 
      onHide={onHide}
      style={{ width: '756px' }}
      className="notes-feed-sidebar"
    >
      <div className="h-full flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div 
          className="flex justify-between items-center px-5 py-3 border-b"
          style={{ 
            backgroundColor: 'hsl(var(--notes-header-bg))',
            borderColor: 'hsl(var(--notes-header-border))'
          }}
        >
          <div className="flex items-center gap-2">
            <StickyNote size={24} className="text-gray-600" />
            <span className="text-gray-900 font-semibold text-base">{clientName}</span>
            <span className="text-gray-500 font-semibold text-base">Notes</span>
            <div 
              className="px-2 py-1 rounded text-sm font-semibold min-w-4 h-4 flex items-center justify-center"
              style={{ 
                backgroundColor: 'hsl(var(--notes-badge-bg))',
                color: 'hsl(var(--notes-badge-text))'
              }}
            >
              {notes.length}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes"
                className="pl-10 pr-3 py-2 w-54 text-sm border rounded-md"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600',
                  fontSize: '16px',
                  color: 'hsl(var(--notes-text-secondary))'
                }}
              />
            </div>

            {/* Category Filter */}
            <Dropdown
              value={selectedCategory}
              options={categoryOptions}
              onChange={(e) => setSelectedCategory(e.value)}
              placeholder="Filter by Category"
              className="w-42"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}
            />

            {/* Close Button */}
            <Button
              icon={<X size={14} />}
              className="p-2 border border-gray-400 rounded-md"
              outlined
              onClick={onHide}
            />
          </div>
        </div>

        {/* Content Area */}
        <div 
          className="flex-1 p-6 relative overflow-y-auto"
          style={{ backgroundColor: 'hsl(var(--notes-content-bg))' }}
        >
          {/* Timeline Line */}
          <div 
            className="absolute left-8 top-0 w-px h-full"
            style={{ backgroundColor: 'hsl(var(--notes-timeline-color))' }}
          />

          <div className="space-y-6">
            {filteredNotes.map((note, index) => (
              <div 
                key={note.id} 
                className="flex gap-4"
                style={{ marginLeft: note.level === 2 ? '32px' : '0' }}
              >
                {/* Timeline Dot */}
                <div className="flex items-start pt-1">
                  <div 
                    className="w-3 h-3 rounded-full border-2"
                    style={{ 
                      backgroundColor: 'hsl(var(--notes-timeline-dot-bg))',
                      borderColor: 'hsl(var(--notes-timeline-color))'
                    }}
                  />
                </div>

                {/* Note Content */}
                <div className="flex-1">
                  {/* Timestamp */}
                  <div 
                    className="text-xs font-semibold mb-2"
                    style={{ 
                      color: 'hsl(var(--notes-text-meta))',
                      fontSize: '10.5px',
                      lineHeight: '15.75px'
                    }}
                  >
                    {formatRelativeTime(note.timestamp)}
                  </div>

                  {/* Note Card */}
                  <div 
                    className="bg-white rounded-xl p-4 border"
                    style={{ 
                      backgroundColor: 'hsl(var(--notes-card-bg))',
                      borderColor: 'hsl(var(--notes-card-border))'
                    }}
                  >
                    {/* Author Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={note.avatar} 
                          alt={note.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <span 
                          className="font-semibold text-sm"
                          style={{ color: 'hsl(var(--notes-text-primary))' }}
                        >
                          {note.author}
                        </span>
                      </div>
                    </div>

                    {/* Note Content */}
                    <div 
                      className="text-sm mb-3"
                      style={{ 
                        color: 'hsl(var(--notes-text-primary))',
                        lineHeight: '22px'
                      }}
                    >
                      {note.content}
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2">
                      {note.isPrivate && (
                        <div 
                          className="px-2 py-1 rounded text-xs font-semibold flex items-center gap-1"
                          style={{ 
                            backgroundColor: 'hsl(var(--notes-badge-bg))',
                            color: 'hsl(var(--notes-badge-text))'
                          }}
                        >
                          🔒 Private
                        </div>
                      )}
                      {note.categories.map((category, idx) => (
                        <div 
                          key={idx}
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ 
                            backgroundColor: 'hsl(var(--notes-badge-bg))',
                            color: 'hsl(var(--notes-badge-text))'
                          }}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scrollbar */}
          <div 
            className="absolute right-4 top-4 w-1 h-16 rounded-full"
            style={{ backgroundColor: 'hsl(var(--notes-input-border))' }}
          />
        </div>

        {/* Footer - Add Note */}
        <div 
          className="p-6 border-t bg-white flex items-center gap-4"
          style={{ borderColor: 'hsl(var(--notes-header-border))' }}
        >
          {/* Note Input */}
          <div className="flex-1 relative">
            <StickyNote size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <InputText
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter note"
              className="w-full pl-10 pr-10 py-3 border rounded-md"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600',
                fontSize: '16px'
              }}
            />
            <Send size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Category Dropdown */}
          <Dropdown
            value={noteCategory}
            options={categoryOptions.slice(1)} // Exclude "All Categories"
            onChange={(e) => setNoteCategory(e.value)}
            placeholder="Category"
            className="w-34"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}
          />

          {/* Save Button */}
          <Button
            label="Save"
            disabled={!newNote.trim()}
            onClick={handleSaveNote}
            className="px-4 py-2 rounded-md font-semibold"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              backgroundColor: !newNote.trim() ? 'hsl(var(--notes-button-disabled))' : undefined,
              opacity: !newNote.trim() ? 0.7 : 1
            }}
          />
        </div>
      </div>
    </Sidebar>
  );
};