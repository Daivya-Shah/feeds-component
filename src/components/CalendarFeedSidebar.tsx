import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Dialog } from 'primereact/dialog';
import { formatRelativeTime } from '../utils/timeFormatting';

// Real icon assets
import calendarIcon from '@/components/icons/calendar.svg';
import searchIcon from '@/components/icons/search.svg';
import angleRightIcon from '@/components/icons/angle-right.svg'; // safeguard but might already exist
import timesIcon from '@/components/icons/times.svg';
import typeIcon from '@/components/icons/type.svg';
import plusIcon from '@/components/icons/plus.svg';
import buildingIcon from '@/components/icons/building.svg';

// Icons - defined inline to avoid import issues
const StickyNoteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '24px', height: '24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      width: '13.50px',
      height: '17.50px',
      left: '5.25px',
      top: '3.25px',
      position: 'absolute',
      background: '#4B5563'
    }}></div>
  </div>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '16px', height: '16px', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      width: '13.33px',
      height: '13.33px',
      left: '1.33px',
      top: '1.33px',
      position: 'absolute',
      background: '#94A3B8'
    }}></div>
  </div>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '16px', height: '16px', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      width: '9.71px',
      height: '5.71px',
      left: '3.14px',
      top: '5.14px',
      position: 'absolute',
      background: '#94A3B8'
    }}></div>
  </div>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '14px', height: '14px', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      width: '11px',
      height: '11px',
      left: '1.50px',
      top: '1.50px',
      position: 'absolute',
      background: '#64748B'
    }}></div>
  </div>
);

const PrivateLockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '10.50px', height: '10.50px', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      width: '9.30px',
      height: '10.50px',
      left: '0.60px',
      top: '0px',
      position: 'absolute',
      background: '#1F2937'
    }}></div>
  </div>
);

const TeamIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '10.50px', height: '10.50px', position: 'relative', overflow: 'hidden' }}>
  </div>
);

const NoteInputLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '14px', height: '14px', position: 'relative', overflow: 'hidden' }}>
  </div>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '14px', height: '14px', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      width: '12.40px',
      height: '14px',
      left: '0.80px',
      top: '0px',
      position: 'absolute',
      background: '#6B7280'
    }}></div>
  </div>
);

const CategoryDropdownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '14px', height: '14px', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      width: '8.39px',
      height: '5px',
      left: '2.81px',
      top: '4.50px',
      position: 'absolute',
      background: '#6B7280'
    }}></div>
  </div>
);

interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  avatar: string;
  categories: string[];
  audience: 'Private' | 'Team' | 'Specific';
  level?: number;
  deleted?: boolean;
}

interface NotesFeedSidebarProps {
  visible: boolean;
  onHide: () => void;
  clientName?: string;
  notes?: Note[];
  currentAuthor?: string;
  onAddNote?: (note: Note) => void;
  onUpdateNotes?: (notes: Note[]) => void;
  inline?: boolean;
}

export const mockNotes: Note[] = [
  {
    id: '1',
    author: 'Alberto Perez',
    content: 'Do diligence on Crucial\'s financials, seem like they have a lot of growth potential.',
    timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000), // in 2 hours
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Company'],
    audience: 'Team',
    level: 1
  },
  {
    id: '2',
    author: 'Andrea Williams',
    content: 'Crucial just got Series C funding from Andreesen Horowitz. Should grow headcount significantly.',
    timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Company'],
    audience: 'Team',
    level: 1
  },
];

export const CalendarFeedSidebar: React.FC<NotesFeedSidebarProps> = ({
  visible,
  onHide,
  clientName = 'Crucial AI',
  notes = mockNotes,
  currentAuthor = 'User',
  onAddNote,
  onUpdateNotes,
  inline = false,
}) => {

  const [searchTerm, setSearchTerm] = useState('');
  // category filter removed
  // newNote input removed
  const [searchFocused, setSearchFocused] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  // reply feature removed
  // Ref for the bottom note input
  const noteInputRef = useRef<HTMLInputElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  // Currently opened options-menu inside a note card (by note id)
  // menu state removed

  // Ref for auto-scroll functionality
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const [localNotes, setLocalNotes] = useState<Note[]>(notes);
  useEffect(() => setLocalNotes(notes), [notes]);

  const handleDeleteNote = (id: string) => {
    setLocalNotes(prev => {
      const updated = prev.map(n =>
        n.id === id
          ? {
              ...n,
              deleted: true,
              content: 'This message has been deleted',
              author: '',
              avatar: '',
              categories: [],
            }
          : n
      );
      onUpdateNotes?.(updated);
      return updated;
    });
    // setActiveMenuNoteId(null); // Removed
  };

  const handleEditNote = (id: string) => {
    const note = localNotes.find(n => n.id === id);
    if (!note) return;
    setEditingNote(note);
    // setNewNote(note.content); // input removed
    // setActiveMenuNoteId(null); // Removed
    // focus handled by effect
  };

  // reply feature removed

  const handleSaveReply = () => {
    // reply feature removed
  };

  const handleCancelReply = () => {
    // reply feature removed
  };

  const filteredNotes = localNotes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const updateScrollAndLine = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    // Scroll to bottom smoothly
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    // Extend dotted line
    if (lineRef.current) {
      lineRef.current.style.height = `${container.scrollHeight}px`;
    }
  }, []);

  // Auto-scroll and line extension whenever notes list changes
  useEffect(() => {
    updateScrollAndLine();
  }, [filteredNotes.length, updateScrollAndLine]);

  // Ensure line appears when sidebar becomes visible (after DOM paint)
  useEffect(() => {
    if (visible) {
      // Wait for Sidebar to finish its open animation / DOM mount
      const timer = setTimeout(updateScrollAndLine, 50);
      return () => clearTimeout(timer);
    }
  }, [visible, updateScrollAndLine]);

  // Close all dropdowns when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    
    // Check if click is outside any dropdown
    if (!target.closest('[data-dropdown="filter"]') && 
        !target.closest('[data-dropdown="audience"]') && 
        !target.closest('[data-dropdown="category"]')) {
      // setFilterDropdownOpen(false); // Removed
      // setAudienceDropdownOpen(false); // Removed
      // setCategoryDropdownOpen(false); // Removed
    }

    // Cancel editing or replying if click is outside the input bar
    if (editingNote) {
      setEditingNote(null);
      // setNewNote(''); // input removed
    }
  }, [editingNote]); // reply feature removed

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Timeline line spans full content area height at all times

  // reply focus effect removed

  // Focus and highlight input when editing a note
  useEffect(() => {
    if (editingNote) {
      noteInputRef.current?.focus();
      // setInputFocused(true); // input removed
    }
  }, [editingNote]);

  // handleSaveNote removed – adding messages disabled

  const FeedContent = (
      <div style={{
        width: '756px',
        height: inline ? 'auto' : '100%',
        boxShadow: '0px 8px 10px -6px rgba(0, 0, 0, 0.10)',
        overflow: inline ? 'visible' : 'hidden',
        outline: '1px #E2E8F0 solid',
        outlineOffset: '-1px',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'inline-flex',
        position: 'relative'
      }}>

        {/* Header */}
        <div style={{
          alignSelf: 'stretch',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '11.50px',
          paddingBottom: '11.50px',
          background: 'white',
          borderBottom: '1px #DFE1E6 solid',
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'inline-flex'
        }}>
          {/* Left side - Title and Badge */}
          <div style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '8px',
            display: 'flex'
          }}>
            {/* Calendar icon */}
            <img src={calendarIcon} alt="Calendar" style={{ width: '24px', height: '24px' }} />
            <div style={{
              color: '#0F172A',
              fontSize: '16px',
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: '22px',
              wordWrap: 'break-word'
            }}>{clientName}</div>
            <div style={{
              color: '#6B7280',
              fontSize: '16px',
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: '22px',
              wordWrap: 'break-word'
            }}>Calendar</div>
            <div data-circle="False" data-severity="Secondary" data-size="Small" style={{
              height: '17.50px',
              minWidth: '17.50px',
              paddingLeft: '7px',
              paddingRight: '7px',
              background: '#F1F5F9',
              borderRadius: '6px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'inline-flex'
            }}>
              <div style={{
                color: '#475569',
                fontSize: '16px',
                fontFamily: 'Inter',
                fontWeight: '600',
                lineHeight: '22px',
                wordWrap: 'break-word'
              }}>{filteredNotes.length}</div>
            </div>
          </div>

          {/* Empty space */}
          <div style={{
            color: '#026BB6',
            fontSize: '16px',
            fontFamily: 'Inter',
            fontWeight: '600',
            lineHeight: '22px',
            wordWrap: 'break-word'
          }}> </div>

          {/* Right side - Controls */}
          <div style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '16px',
            display: 'flex'
          }}>
            <div style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '16px',
              display: 'flex'
            }}>
              {/* Search Input */}
              <div data-show-helper="false" data-state="Default" data-invalid="False" data-show-right-icon="false" data-show-left-icon="true" data-float-label="False" data-show-label="false" data-show-text="true" data-disabled="False" data-filled="False" data-size="Normal" style={{
                width: '169px',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '4px',
                display: 'inline-flex'
              }}>
                <div style={{
                  alignSelf: 'stretch',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  background: 'white',
                  boxShadow: '0px 1px 2px rgba(18, 18, 23, 0.05)',
                  borderRadius: '6px',
                  outline: searchFocused ? '2px #026BB6 solid' : '1px #CBD5E1 solid',
                  outlineOffset: '-1px',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '8px',
                  display: 'inline-flex'
                }}>
                  {/* Search icon */}
                  <img src={searchIcon} alt="" style={{ width: '16px', height: '16px' }} />
                  <div style={{
                    flex: '1 1 0',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    display: 'inline-flex'
                  }}>
                    <div data-text-config="Placeholder" style={{
                      alignSelf: 'stretch',
                      overflow: 'hidden',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      display: 'inline-flex'
                    }}>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Search events"
                        style={{
                          flex: '1 1 0',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          color: '#64748B',
                          fontSize: '16px',
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          lineHeight: '22px',
                          wordWrap: 'break-word'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plus icon container */}
            <div style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'white',
              boxShadow: '0px 1px 2px rgba(18,18,23,0.05)',
              borderRadius: '6px',
              outline: '1px #7AC8FF solid',
              outlineOffset: '-1px',
              cursor: 'pointer'
            }} onClick={() => {
              const newId = (Date.now()).toString();
              const newNote = {
                id: newId,
                author: currentAuthor,
                content: '',
                timestamp: new Date(),
                avatar: 'https://placehold.co/24x24',
                categories: [],
                audience: 'Team',
                level: 1
              } as Note;
              setLocalNotes(prev => [...prev, newNote]);
            }}>
              <img src={plusIcon} alt="Add" style={{ width: '16px', height: '16px' }} />
            </div>

            {/* Close Button (hidden in inline mode) */}
            {!inline && (
              <div data-disabled="False" data-icon-only="True" data-link="False" data-severity="Secondary" data-show-left-icon="false" data-show-right-icon="false" data-state="Idle" data-rounded="False" data-raised="False" data-text="False" data-outlined="True" 
                onClick={onHide}
                style={{
                  width: '34px',
                  height: '32px',
                  paddingTop: '10.50px',
                  paddingBottom: '10.50px',
                  borderRadius: '6px',
                  outline: '1px #CBD5E1 solid',
                  outlineOffset: '-1px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  cursor: 'pointer'
                }}
              >
                {/* SVG cross icon */}
                <img src={timesIcon} alt="Close" style={{ width: '14px', height: '14px' }} />
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div
          ref={scrollContainerRef}
          style={{
            alignSelf: 'stretch',
            ...(inline ? { height: '968px' } : { flex: '1 1 0' }),
            padding: '24px',
            position: 'relative',
            background: '#F8FAFC',
            overflowY: 'auto',
            overflowX: 'hidden',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '24px',
            display: 'flex',
          }}
        >
            {/* Timeline Line inside body */}
            <div ref={lineRef} style={{
              position: 'absolute',
              left: '29px',
              top: 0,
              width: '1px',
              height: '0px',
              borderLeft: '1px dotted #ABC9FB',
              zIndex: 0
            }}></div>

          {/* Notes */}
          {filteredNotes.slice().reverse().map((note, index) => (
            <div 
              key={note.id}
              data-feed-type="Note"
              data-level={note.level}
              data-show-attachment="false"
              data-show-image="false"
              data-show-note-action="false"
              data-show-note-menu="false"
              data-show-note-subject="false"
              style={{
                width: '738px',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '16px',
                display: 'inline-flex'
              }}
            >
              {/* Timeline Dot */}
              <div style={{
                paddingTop: '3px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '10px',
                display: 'flex'
              }}>
                <div style={{
                  width: '11px',
                  height: '11px',
                  background: 'white',
                  borderRadius: '9999px',
                  border: '1px #609AF8 solid',
                  zIndex: 2
                }}></div>
              </div>

              {/* Note Content */}
              <div style={{
                flex: '1 1 0',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '8px',
                display: 'inline-flex',
                marginLeft: `${((note.level ?? 1)-1)*32}px`
              }}>
                {/* Timestamp */}
                <div style={{
                  color: '#6B7280',
                  fontSize: '10.50px',
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: '15.75px',
                  wordWrap: 'break-word'
                }}>
                  {formatRelativeTime(note.timestamp)}
                </div>

                {/* Note Card */}
                <div style={{
                  paddingTop: '12px',
                  paddingBottom: '16px',
                  paddingLeft: '16px',
                  paddingRight: '20px',
                  background: 'white',
                  overflow: 'visible',
                  borderRadius: '12px',
                  outline: '1px #DFE7EF solid',
                  outlineOffset: '-1px',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: '8px',
                  display: 'flex'
                }}>
                  {/* Author Header */}
                  {!note.deleted && (
                  <div style={{
                    alignSelf: 'stretch',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    display: 'inline-flex'
                  }}>
                    <div style={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '8px',
                      display: 'flex'
                    }}>
                      {/* Avatar removed for calendar feed */}
                      <div style={{
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: '4px',
                        display: 'flex'
                      }}>
                        <div style={{
                          color: '#111827',
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          wordWrap: 'break-word'
                        }}>
                          {note.id === '1' && (
                             <span style={{ color: '#111827' }}>Follow up with <span style={{ fontWeight: 600 }}>Mike Vernon</span> on <span style={{ fontWeight: 600, color: '#1D4ED8' }}>survey</span></span>
                           )}
                           {note.id === '2' && (
                              <span style={{ color: '#111827' }}>Tour spaces with <span style={{ fontWeight: 600 }}>Greg Hunter</span> for <span style={{ fontWeight: 600, color: '#1D4ED8' }}>NYC Office Tour</span></span>
                           )}
                        </div>
                      </div>
                    </div>
                    {/* reply icon removed */}
                  </div>
                  )}

                  {/* Note Content */}
                  {note.id === '1' ? (
                    <div style={{ display:'flex', alignItems:'center', gap:'4px', marginLeft:'4px' }}>
                      <img src={buildingIcon} alt="Building" style={{ width:'16px', height:'16px' }} />
                      <span style={{ fontSize:'14px', color:'#111827' }}>Vernon & Foster, LLP <span style={{ color:'#6B7280' }}>Midtown Office</span></span>
                    </div>
                  ) : note.id === '2' ? (
                    <div style={{ display:'flex', alignItems:'center', gap:'4px', marginLeft:'4px' }}>
                      <img src={buildingIcon} alt="Building" style={{ width:'16px', height:'16px' }} />
                      <span style={{ fontSize:'14px' }}><span style={{ color:'#111827' }}>Crucial AI</span> <span style={{ color:'#6B7280' }}>NYC HQ</span></span>
                    </div>
                  ) : null}
                   {/* location row moved into content for first note */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer removed */}
      </div>
  );

  if (inline) {
    return FeedContent;
  }

  return (
    <Sidebar 
      visible={visible} 
      position="right" 
      onHide={onHide}
      style={{ 
        width: '756px',
        height: '100vh',
        overflow: 'hidden'
      }}
      className="notes-feed-sidebar-exact"
    >
      {FeedContent}
      {/* Edit Note Dialog removed: editing done inline */}
      {/* Reply Dialog removed: reply handled inline */}
    </Sidebar>
  );
};

// ------------------------
// Inline NoteMenu component
// ------------------------

// Minimal placeholder (menu removed)
interface NoteMenuProps { onClose: () => void; onEdit: () => void; onDelete: () => void; }
const NoteMenu: React.FC<NoteMenuProps> = () => null;