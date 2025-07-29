import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Dialog } from 'primereact/dialog';

// Real icon assets
import notesIcon from '@/components/icons/notes.svg';
import searchIcon from '@/components/icons/search.svg';
import angleDownIcon from '@/components/icons/angle-down.svg';
import lockIcon from '@/components/icons/lock.svg';
import usersIcon from '@/components/icons/users.svg';
import trashIcon from '@/components/icons/trash.svg';
import pencilIcon from '@/components/icons/pencil.svg';
import commentActionIcon from '@/components/icons/comment-action.svg';
import commentActionReplyIcon from '@/components/icons/comment-action-reply.svg';
import angleRightIcon from '@/components/icons/angle-right.svg'; // safeguard but might already exist
import timesIcon from '@/components/icons/times.svg';
import plusCircleIcon from '@/components/icons/plus-circle.svg';
import filterIcon from '@/components/icons/filter.svg';

// Local time formatter (past-oriented)
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours < 24) {
    if (diffHours < 1) return 'Just now';
    const hrs = Math.floor(diffHours);
    return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  }

  if (diffHours < 48) {
    return 'Yesterday';
  }

  if (diffDays < 7) {
    const days = Math.floor(diffDays);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  if (diffDays < 31) {
    const weeks = Math.floor(diffDays / 7) || 1;
    if ((weeks + 1) * 7 >= 31) return '1 month ago';
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }

  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30.44) || 1;
    if (months + 1 >= 12) return '1 year ago';
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }

  const years = Math.floor(diffDays / 365.25);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

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
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Company'],
    audience: 'Team',
    level: 1
  },
  {
    id: '2',
    author: 'Andrea Williams',
    content: 'Crucial just got Series C funding from Andreesen Horowitz. Should grow headcount significantly.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Company'],
    audience: 'Team',
    level: 1
  },
  {
    id: '3',
    author: 'Alberto Perez',
    content: 'Had a great call with Greg, Crucial\'s CEO. They have intent to move in the next quarter.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Company'],
    audience: 'Team',
    level: 1
  },
  {
    id: '4',
    author: 'Alberto Perez',
    content: 'Crucial is looking to find a new HQ in NYC in Midtown. They need a fully built, Class A space.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    avatar: 'https://placehold.co/24x24',
    categories: ['Company'],
    audience: 'Private',
    level: 1
  },
  {
    id: '5',
    author: 'Andrea Williams',
    content: 'Do you have an idea when they\'re looking to move?',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Company'],
    audience: 'Team',
    level: 1
  },
  {
    id: '6',
    author: 'Maria Foster',
    content: 'It sounds like they\'re waiting for the right space, but would be ready to close within a month',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    avatar: 'https://placehold.co/24x24',
    categories: ['Team', 'Company'],
    audience: 'Team',
    level: 2
  }
];

export const NotesFeedSidebar: React.FC<NotesFeedSidebarProps> = ({
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newNote, setNewNote] = useState('');
  const [noteCategory, setNoteCategory] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [audienceDropdownOpen, setAudienceDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<'Private' | 'Team' | 'Specific'>('Private');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [replyingTo, setReplyingTo] = useState<Note | null>(null);
  const [replyContent, setReplyContent] = useState('');
  // Ref for the bottom note input
  const noteInputRef = useRef<HTMLInputElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  // Currently opened options-menu inside a note card (by note id)
  const [activeMenuNoteId, setActiveMenuNoteId] = useState<string | null>(null);

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
    setActiveMenuNoteId(null);
  };

  const handleEditNote = (id: string) => {
    const note = localNotes.find(n => n.id === id);
    if (!note) return;
    setEditingNote(note);
    setNewNote(note.content);
    setActiveMenuNoteId(null);
    // focus handled by effect
  };

  const handleChangeAudience = (id: string, aud: 'Private' | 'Team' | 'Specific') => {
    setLocalNotes(prev => {
      const updated = prev.map(n => n.id===id ? { ...n, audience: aud }: n);
      onUpdateNotes?.(updated);
      return updated;
    });
  };

  const handleChangeCategory = (id: string, cat: string) => {
    setLocalNotes(prev => {
      const updated = prev.map(n => n.id===id ? { ...n, categories: cat ? [cat] : [] }: n);
      onUpdateNotes?.(updated);
      return updated;
    });
  };

  const handleReplyClick = (note: Note) => {
    setReplyingTo(note);
    setReplyContent('');
    // focus will be handled by effect
  };

  const handleSaveReply = () => {
    if(!replyingTo) return;
    const newReply: Note = {
      id: Date.now().toString(),
      author: currentAuthor,
      content: replyContent,
      timestamp: new Date(),
      avatar: 'https://placehold.co/24x24',
      categories: replyingTo.categories,
      audience: replyingTo.audience,
      level: Math.min((replyingTo.level ?? 1) + 1, 4)
    };
    setLocalNotes(prev => {
      const idx = prev.findIndex(n=>n.id===replyingTo.id);
      const updated = [...prev.slice(0, idx+1), newReply, ...prev.slice(idx+1)];
      onUpdateNotes?.(updated);
      return updated;
    });
    setReplyingTo(null);
    setReplyContent('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const filteredNotes = localNotes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || note.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
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
      setFilterDropdownOpen(false);
      setAudienceDropdownOpen(false);
      setCategoryDropdownOpen(false);
    }

    // Cancel editing or replying if click is outside the input bar
    if ((editingNote || replyingTo) && inputBarRef.current && !inputBarRef.current.contains(target)) {
      setEditingNote(null);
      setReplyingTo(null);
      setNewNote('');
    }
  }, [editingNote, replyingTo]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Timeline line spans full content area height at all times

  // Focus the note input when entering reply mode
  useEffect(() => {
    if (replyingTo) {
      noteInputRef.current?.focus();
    }
  }, [replyingTo]);

  // Focus and highlight input when editing a note
  useEffect(() => {
    if (editingNote) {
      noteInputRef.current?.focus();
      setInputFocused(true);
    }
  }, [editingNote]);

  const handleSaveNote = () => {
    if (!newNote.trim()) return;

    if (editingNote) {
      // update existing note
      setLocalNotes(prev => {
        const updated = prev.map(n => n.id === editingNote.id ? { ...n, content: newNote.trim() } : n);
        onUpdateNotes?.(updated);
        return updated;
      });
      setEditingNote(null);
    } else if (replyingTo) {
      // Create a reply note
      const newReply: Note = {
        id: Date.now().toString(),
        author: currentAuthor,
        content: newNote.trim(),
        timestamp: new Date(),
        avatar: 'https://placehold.co/24x24',
        categories: replyingTo.categories,
        audience: replyingTo.audience,
        level: Math.min((replyingTo.level ?? 1) + 1, 4),
      };

      setLocalNotes(prev => {
        const idx = prev.findIndex(n => n.id === replyingTo.id);
        const updated = [...prev.slice(0, idx + 1), newReply, ...prev.slice(idx + 1)];
        onUpdateNotes?.(updated);
        return updated;
      });

      setReplyingTo(null);
    } else {
    const newNoteObj: Note = {
      id: Date.now().toString(),
      author: currentAuthor,
      content: newNote.trim(),
      timestamp: new Date(),
      avatar: 'https://placehold.co/24x24',
      categories: noteCategory ? [noteCategory] : [],
      audience: selectedAudience,
      level: 1,
    };

    onAddNote?.(newNoteObj);
    }

    setNewNote('');
    setNoteCategory('');
  };

  const FeedContent = (
      <div style={{
        width: '756px',
        height: inline ? 'auto' : '100%',
        boxShadow: '0px 8px 10px -6px rgba(0, 0, 0, 0.10)',
        overflow: 'hidden',
        outline: '1px #DFE7EF solid',
        borderRadius: '12px',
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
            {/* Notes icon */}
            <img src={notesIcon} alt="Notes" style={{ width: '24px', height: '24px' }} />
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
            }}>Notes</div>
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
                width: '216px',
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
                        placeholder="Search notes"
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

            <div style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '16px',
              display: 'flex'
            }}>
              {/* Category Filter */}
              <div data-dropdown="filter" data-show-helper="false" data-state="Default" data-invalid="False" data-show-right-icon="true" data-show-left-icon="false" data-float-label="False" data-show-label="false" data-show-text="true" data-disabled="False" data-filled="False" data-size="Normal" style={{
                position: 'relative',
                width: '169px',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '4px',
                display: 'inline-flex'
              }}>
                <div 
                  onClick={() => {
                    setFilterDropdownOpen(!filterDropdownOpen);
                    setAudienceDropdownOpen(false);
                    setCategoryDropdownOpen(false);
                  }}
                  style={{
                    alignSelf: 'stretch',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    background: 'white',
                    boxShadow: '0px 1px 2px rgba(18, 18, 23, 0.05)',
                    borderRadius: '6px',
                    outline: filterDropdownOpen ? '2px #026BB6 solid' : '1px #CBD5E1 solid',
                    outlineOffset: '-1px',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '8px',
                    display: 'inline-flex',
                    cursor: 'pointer'
                  }}
                >
                  {/* Filter icon */}
                  <img src={filterIcon} alt="" style={{ width: '16px', height: '16px' }} />

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
                      <div style={{
                        flex: '1 1 0',
                        color: selectedCategory ? '#64748B' : '#94A3B8',
                        fontSize: '16px',
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        lineHeight: '22px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {selectedCategory || 'Filter'}
                      </div>
                    </div>
                  </div>
                  {/* Dropdown arrow */}
                  <img src={angleDownIcon} alt="" style={{ width: '15px', height: '14px' }} />
                </div>
                
                {filterDropdownOpen && (
                  <div data-dropdown="filter" style={{
                    width: '136px',
                    paddingTop: '7px',
                    paddingBottom: '7px',
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    background: 'white',
                    borderRadius: '6px',
                    outline: '1px #E5E7EB solid',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    display: 'inline-flex'
                  }}>
                    {/* Categories Header */}
                    <div style={{
                      alignSelf: 'stretch',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '7px',
                      display: 'inline-flex'
                    }}>
                      <div style={{
                        flex: '1 1 0',
                        paddingLeft: '17.50px',
                        paddingRight: '17.50px',
                        paddingTop: '10.50px',
                        paddingBottom: '10.50px',
                        background: 'white',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: '7px',
                        display: 'inline-flex'
                      }}>
                        <div style={{
                          alignSelf: 'stretch',
                          color: '#374151',
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '700',
                          wordWrap: 'break-word'
                        }}>Categories</div>
                      </div>
                    </div>

                    {/* Category Items */}
                    {['None', 'Company', 'Contact', 'Location', 'Budget', 'Property'].map((category) => (
                      <div
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category === 'None' ? '' : category);
                          setFilterDropdownOpen(false);
                        }}
                        style={{
                          alignSelf: 'stretch',
                          background: selectedCategory === (category === 'None' ? '' : category) ? '#EFF6FF' : 'transparent',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: '7px',
                          display: 'inline-flex',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedCategory !== (category === 'None' ? '' : category)) {
                            e.currentTarget.style.background = '#F8FAFC';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCategory !== (category === 'None' ? '' : category)) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <div style={{
                          flex: '1 1 0',
                          paddingLeft: '17.50px',
                          paddingRight: '17.50px',
                          paddingTop: '10.50px',
                          paddingBottom: '10.50px',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          gap: '7px',
                          display: 'flex'
                        }}>
                          <div style={{
                            flex: '1 1 0',
                            color: selectedCategory === (category === 'None' ? '' : category) ? '#1D4ED8' : '#4B5563',
                            fontSize: '14px',
                            fontFamily: 'Inter',
                            fontWeight: '400',
                            lineHeight: '14px',
                            wordWrap: 'break-word'
                          }}>{category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
            ...(inline ? { height: '896px' } : { flex: '1 1 0' }),
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
          {filteredNotes.map((note, index) => (
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
                      <div style={{
                        width: '24px',
                        height: '24px',
                        position: 'relative',
                        borderRadius: '999px',
                        overflow: 'hidden'
                      }}>
                          <img style={{
                            width: '24px',
                            height: '24px',
                          left: '0',
                          top: '0',
                            position: 'absolute',
                          borderRadius: '999px'
                          }}
                          src={note.avatar}
                          alt={note.author}
                          />
                      </div>
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
                          fontWeight: '600',
                          wordWrap: 'break-word'
                        }}>
                          {note.author}
                        </div>
                      </div>
                    </div>
                    {/* Options icon & menu – only for owner */}
                    {note.author === currentAuthor ? (
                      <div style={{ position: 'relative' }}>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuNoteId(activeMenuNoteId === note.id ? null : note.id);
                          }}
                          style={{ cursor: 'pointer', padding: '4px' }}
                        >
                          <img src={commentActionIcon} alt="Menu" className="hover-scale" style={{ width: '16px', height: '16px' }} />
                        </div>

                        {activeMenuNoteId === note.id && (
                          <NoteMenu
                             onClose={() => setActiveMenuNoteId(null)}
                             onDelete={() => handleDeleteNote(note.id)}
                             onEdit={() => handleEditNote(note.id)}
                             onChangeAudience={(aud)=>handleChangeAudience(note.id,aud)}
                             onChangeCategory={(cat)=>handleChangeCategory(note.id,cat)}
                          />
                        )}
                      </div>
                    ) : (
                      // Reply icon for notes not by current user
                      <div style={{ cursor: 'pointer', padding:'4px' }} onClick={()=>handleReplyClick(note)}>
                        <img src={commentActionReplyIcon} alt="Reply" className="hover-scale" style={{ width:'16px', height:'16px' }} />
                      </div>
                    )}
                  </div>
                  )}

                  {/* Note Content */}
                  {note.id === '4' ? (
                    <div style={{
                      width: '612px',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '4px',
                      display: 'inline-flex'
                    }}>
                      <div style={{
                        flex: '1 1 0',
                        color: '#212121',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        lineHeight: '22px',
                        wordWrap: 'break-word'
                      }}>
                        {note.content}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '4px',
                      display: 'inline-flex'
                    }}>
                      <div style={{
                        color: '#212121',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        lineHeight: '22px',
                        wordWrap: 'break-word'
                      }}>
                        {note.content}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {!note.deleted && (<div style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '8px',
                    display: 'inline-flex'
                  }}>
                    {/* Audience badge */}
                    {note.audience === 'Private' && (
                      <div style={{
                        padding: '3px 6px',
                        background: '#F5F5F5',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <img src={lockIcon} alt="Lock" style={{ width: '11px', height: '11px' }} />
                        <span style={{ color: '#4B5563', fontSize: '11px', lineHeight: '14px', fontFamily: 'Inter', fontWeight: 600 }}>Private</span>
                      </div>
                    )}
                    {note.audience === 'Team' && (
                      <div style={{
                        padding: '3px 6px',
                        background: '#F5F5F5',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <img src={usersIcon} alt="Team" style={{ width: '11px', height: '11px' }} />
                        <span style={{ color: '#4B5563', fontSize: '11px', lineHeight: '14px', fontFamily: 'Inter', fontWeight: 600 }}>Team</span>
                      </div>
                    )}
                    {note.audience === 'Specific' && (
                      <div style={{
                        padding: '3px 6px',
                        background: '#F5F5F5',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <div style={{ width: '11px', height: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontWeight: 400, fontSize: '11px', color: '#6B7280' }}>@</span>
                        </div>
                        <span style={{ color: '#4B5563', fontSize: '11px', lineHeight: '14px', fontFamily: 'Inter', fontWeight: 600 }}>Specific</span>
                      </div>
                    )}
                    {note.categories.filter((c) => c !== 'Team').map((category, idx) => (
                      <div 
                        key={idx}
                        style={{
                          padding: '3px 6px',
                          background: '#F5F5F5',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <div style={{
                          color: '#424242',
                          fontSize: '11px',
                          lineHeight: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{category}</div>
                      </div>
                    ))}
                  </div>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer - Add Note */}
        <div data-state="Empty" style={{
          alignSelf: 'stretch',
          height: '72px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '16px',
          paddingBottom: '16px',
          background: 'white',
          borderTop: '1px #DFE1E6 solid',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '16px',
          display: 'inline-flex'
        }}>
          {/* Note Input */}
          <div data-disabled="False" data-filled="False" data-float-label="True" data-invalid="False" data-show-float-label="false" data-show-helper="false" data-show-left-icon="true" data-show-right-icon="true" data-show-text="true" data-state="Default" style={{
            flex: '1 1 0',
            height: '40px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div ref={inputBarRef} style={{
              alignSelf: 'stretch',
              flex: '1 1 0',
              paddingLeft: '10.50px',
              paddingRight: '10.50px',
              paddingTop: '0px',
              paddingBottom: '0px',
              background: 'white',
              overflow: 'visible',
              borderRadius: '6px',
              outline: inputFocused ? '2px #026BB6 solid' : '1px #D1D5DB solid',
              outlineOffset: '-1px',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '10.50px',
              display: 'inline-flex',
              position: 'relative'
            }}>
              {/* Plus icon on left */}
              <img src={plusCircleIcon} alt="Add" style={{ width: '14px', height: '14px' }} />
              <div style={{
                flex: '1 1 0',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                display: 'inline-flex'
              }}>
                <div data-show-token-1="true" data-show-token-2="false" data-show-token-3="false" data-text-config="Placeholder" style={{
                  alignSelf: 'stretch',
                  overflow: 'hidden',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  display: 'inline-flex'
                }}>
                  <input
                    ref={noteInputRef}
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder={replyingTo ? `Reply to @${replyingTo.author}` : editingNote ? 'Edit note' : 'Enter note'}
                    style={{
                      flex: '1 1 0',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: '#6B7280',
                      fontSize: '16px',
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      lineHeight: '22px',
                      wordWrap: 'break-word'
                    }}
                  />
                </div>
              </div>
              {/* Audience icon on right */}
              <div data-dropdown="audience" onClick={() => {
                setAudienceDropdownOpen(!audienceDropdownOpen);
                setFilterDropdownOpen(false);
                setCategoryDropdownOpen(false);
              }} style={{ cursor: 'pointer' }}>
                {selectedAudience==='Private' && <img src={lockIcon} alt="Private" className="hover-scale" style={{ width:'15px',height:'14px' }} />}
                {selectedAudience==='Team' && <img src={usersIcon} alt="Team" style={{ width:'15px',height:'14px' }} />}
                {selectedAudience==='Specific' && <span style={{fontSize:'14px',fontWeight:600,color:'#6B7280'}}>@</span>}
              </div>
              
              {/* Audience Dropdown */}
              {audienceDropdownOpen && (
                <div data-dropdown="audience"
                  data-show-button="true" 
                  data-show-menu="true" 
                  data-show-separator="false" 
                  data-type="Basic" 
                  style={{
                    width: '175px',
                    paddingTop: '7px',
                    paddingBottom: '7px',
                    position: 'absolute',
                    bottom: '100%',
                    right: 0,
                    background: 'white',
                    borderRadius: '6px',
                    outline: '1px #E5E7EB solid',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    display: 'inline-flex'
                  }}
                >
                  {/* Audience Header */}
                  <div 
                    data-direction="Vertical" 
                    data-show-icon="true" 
                    data-show-left-angle="true" 
                    data-show-right-angle="true" 
                    data-state="Idle" 
                    data-type="Header" 
                    style={{
                      alignSelf: 'stretch',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '7px',
                      display: 'inline-flex'
                    }}
                  >
                    <div style={{
                      flex: '1 1 0',
                      paddingLeft: '17.50px',
                      paddingRight: '17.50px',
                      paddingTop: '10.50px',
                      paddingBottom: '10.50px',
                      background: 'white',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      gap: '7px',
                      display: 'inline-flex'
                    }}>
                      <div style={{
                        alignSelf: 'stretch',
                        color: '#374151',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '700',
                        wordWrap: 'break-word'
                      }}>Audience</div>
                    </div>
                  </div>

                  {/* Private Option */}
                  <div 
                    data-direction="Vertical" 
                    data-show-icon="true" 
                    data-show-left-angle="false" 
                    data-show-right-angle="false" 
                    data-state={selectedAudience==='Private' ? 'Highlight':'Idle'} 
                    data-type="Link" 
                    style={{
                      alignSelf: 'stretch',
                      background: selectedAudience==='Private' ? '#EFF6FF':'transparent',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '7px',
                      display: 'inline-flex',
                      cursor:'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={()=>{setSelectedAudience('Private'); setAudienceDropdownOpen(false);}}
                    onMouseEnter={(e) => {
                      if (selectedAudience !== 'Private') {
                        e.currentTarget.style.background = '#F8FAFC';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAudience !== 'Private') {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      flex: '1 1 0',
                      paddingLeft: '17.50px',
                      paddingRight: '17.50px',
                      paddingTop: '10.50px',
                      paddingBottom: '10.50px',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      gap: '7px',
                      display: 'flex'
                    }}>
                      <img src={lockIcon} alt="Lock" style={{ width: '15px', height: '14px' }} />
                      <div style={{
                        flex: '1 1 0',
                        color: selectedAudience==='Private' ? '#1D4ED8' : '#4B5563',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        lineHeight: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>Private</div>
                    </div>
                  </div>

                  {/* My team Option */}
                  <div 
                    data-direction="Vertical" 
                    data-show-icon="true" 
                    data-show-left-angle="false" 
                    data-show-right-angle="false" 
                    data-state={selectedAudience==='Team' ? 'Highlight':'Idle'}
                    data-type="Link" 
                    style={{
                      alignSelf: 'stretch',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '7px',
                      display: 'inline-flex',
                      background: selectedAudience==='Team' ? '#EFF6FF':'transparent',
                      cursor:'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={()=>{setSelectedAudience('Team'); setAudienceDropdownOpen(false);}}
                    onMouseEnter={(e) => {
                      if (selectedAudience !== 'Team') {
                        e.currentTarget.style.background = '#F8FAFC';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAudience !== 'Team') {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      flex: '1 1 0',
                      paddingLeft: '17.50px',
                      paddingRight: '17.50px',
                      paddingTop: '10.50px',
                      paddingBottom: '10.50px',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      gap: '7px',
                      display: 'flex'
                    }}>
                      <img src={usersIcon} alt="Users" style={{ width: '15px', height: '14px' }} />
                      <div style={{
                        flex: '1 1 0',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        lineHeight: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: selectedAudience==='Team' ? '#1D4ED8' : '#4B5563'
                      }}>My team</div>
                    </div>
                  </div>

                  {/* Someone specific Option */}
                  <div 
                    data-direction="Vertical" 
                    data-show-icon="true" 
                    data-show-left-angle="false" 
                    data-show-right-angle="false" 
                    data-state={selectedAudience==='Specific' ? 'Highlight':'Idle'}
                    data-type="Link" 
                    style={{
                      alignSelf: 'stretch',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '7px',
                      display: 'inline-flex',
                      background: selectedAudience==='Specific' ? '#EFF6FF':'transparent',
                      cursor:'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={()=>{setSelectedAudience('Specific'); setAudienceDropdownOpen(false);}}
                    onMouseEnter={(e) => {
                      if (selectedAudience !== 'Specific') {
                        e.currentTarget.style.background = '#F8FAFC';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAudience !== 'Specific') {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      flex: '1 1 0',
                      paddingLeft: '17.50px',
                      paddingRight: '17.50px',
                      paddingTop: '10.50px',
                      paddingBottom: '10.50px',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      gap: '7px',
                      display: 'flex'
                    }}>
                      <div style={{ width: '11px', height: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontWeight: 400, fontSize: '14px', lineHeight: '14px', color: selectedAudience==='Specific' ? '#1D4ED8' : '#6B7280' }}>@</span>
                      </div>
                      <div style={{
                        flex: '1 1 0',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        lineHeight: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: selectedAudience==='Specific' ? '#1D4ED8' : '#4B5563'
                      }}>Someone specific</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div data-dropdown="category" data-disabled="False" data-filled="False" data-float-label="True" data-invalid="False" data-show-float-label="false" data-show-helper="false" data-show-left-icon="false" data-show-right-icon="true" data-show-text="true" data-state="Default" style={{
            position: 'relative',
            width: '136px',
            height: '40px',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '8px',
            display: 'inline-flex'
          }}>
            <div 
              onClick={() => {
                setCategoryDropdownOpen(!categoryDropdownOpen);
                setFilterDropdownOpen(false);
                setAudienceDropdownOpen(false);
              }}
              style={{
                alignSelf: 'stretch',
                flex: '1 1 0',
                paddingLeft: '10.50px',
                paddingRight: '10.50px',
                paddingTop: '11.50px',
                paddingBottom: '11.50px',
                background: 'white',
                overflow: 'hidden',
                borderRadius: '6px',
                outline: categoryDropdownOpen ? '2px #026BB6 solid' : '1px #D1D5DB solid',
                outlineOffset: '-1px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '8px',
                display: 'inline-flex',
                cursor: 'pointer'
              }}
            >
              <div style={{
                flex: '1 1 0',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                display: 'inline-flex'
              }}>
                <div data-show-token-1="true" data-show-token-2="false" data-show-token-3="false" data-text-config="Placeholder" style={{
                  alignSelf: 'stretch',
                  overflow: 'hidden',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  display: 'inline-flex'
                }}>
                  <div style={{
                    flex: '1 1 0',
                    color: noteCategory ? '#64748B' : '#94A3B8',
                    fontSize: '16px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    lineHeight: '22px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {noteCategory || 'Category'}
                  </div>
                </div>
              </div>
              {/* Dropdown arrow */}
              <img src={angleDownIcon} alt="" style={{ width: '15px', height: '14px' }} />
            </div>
            
            {categoryDropdownOpen && (
              <div data-dropdown="category" style={{
                width: '136px',
                paddingTop: '7px',
                paddingBottom: '7px',
                position: 'absolute',
                bottom: '100%',
                left: 0,
                background: 'white',
                borderRadius: '6px',
                outline: '1px #E5E7EB solid',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                display: 'inline-flex'
              }}>
                {/* Categories Header */}
                <div style={{
                  alignSelf: 'stretch',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '7px',
                  display: 'inline-flex'
                }}>
                  <div style={{
                    flex: '1 1 0',
                    paddingLeft: '17.50px',
                    paddingRight: '17.50px',
                    paddingTop: '10.50px',
                    paddingBottom: '10.50px',
                    background: 'white',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '7px',
                    display: 'inline-flex'
                  }}>
                    <div style={{
                      alignSelf: 'stretch',
                      color: '#374151',
                      fontSize: '14px',
                      fontFamily: 'Inter',
                      fontWeight: '700',
                      wordWrap: 'break-word'
                    }}>Categories</div>
                  </div>
                </div>

                {/* Category Items */}
                {['None', 'Company', 'Contact', 'Location', 'Budget', 'Property'].map((category) => (
                  <div
                    key={category}
                    onClick={() => {
                      setNoteCategory(category === 'None' ? '' : category);
                      setCategoryDropdownOpen(false);
                    }}
                    style={{
                      alignSelf: 'stretch',
                      background: noteCategory === (category === 'None' ? '' : category) ? '#EFF6FF' : 'transparent',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '7px',
                      display: 'inline-flex',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (noteCategory !== (category === 'None' ? '' : category)) {
                        e.currentTarget.style.background = '#F8FAFC';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (noteCategory !== (category === 'None' ? '' : category)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      flex: '1 1 0',
                      paddingLeft: '17.50px',
                      paddingRight: '17.50px',
                      paddingTop: '10.50px',
                      paddingBottom: '10.50px',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      gap: '7px',
                      display: 'flex'
                    }}>
                      <div style={{
                        flex: '1 1 0',
                        color: noteCategory === (category === 'None' ? '' : category) ? '#1D4ED8' : '#4B5563',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        lineHeight: '14px',
                        wordWrap: 'break-word'
                      }}>{category}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div data-disabled="True" data-icon-only="False" data-link="False" data-severity="Secondary" data-show-left-icon="false" data-show-right-icon="false" data-state="Idle" data-rounded="False" data-raised="False" data-text="False" data-outlined="False" 
            onClick={handleSaveNote}
            style={{
              height: '40px',
              paddingLeft: '17.50px',
              paddingRight: '17.50px',
              paddingTop: '0px',
              paddingBottom: '0px',
              opacity: newNote.trim() ? 1 : 0.70,
              background: newNote.trim() ? '#026BB6' : '#64748B',
              borderRadius: '6px',
              outline: newNote.trim() ? '1px #026BB6 solid' : '1px #64748B solid',
              outlineOffset: '-1px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '7px',
              display: 'flex',
              cursor: newNote.trim() ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (newNote.trim()) {
                e.currentTarget.style.background = '#1D4ED8';
              }
            }}
            onMouseLeave={(e) => {
              if (newNote.trim()) {
                e.currentTarget.style.background = '#026BB6';
              }
            }}
          >
            <div style={{
              color: 'white',
              fontSize: '16px',
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: '22px',
              wordWrap: 'break-word'
            }}>Save</div>
          </div>
        </div>
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

interface NoteMenuProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onChangeAudience: (aud: 'Private' | 'Team' | 'Specific') => void;
  onChangeCategory: (cat: string) => void;
}

const NoteMenu: React.FC<NoteMenuProps> = ({ onClose, onEdit, onDelete, onChangeAudience, onChangeCategory }) => {
  const [submenu, setSubmenu] = useState<null | 'audience' | 'category'>(null);
  const [submenuDirection, setSubmenuDirection] = useState<'left' | 'right'>('right');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const commonHover = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).style.background = '#F1F5F9';
  };
  const commonLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
  };

  const MenuRow: React.FC<{
    label: string;
    iconSrc: string;
    onClick?: ((e: React.MouseEvent<HTMLDivElement>) => void) | (() => void);
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  }> = ({ label, iconSrc, onClick, onMouseEnter }) => (
    <div
      onClick={(e) => onClick?.(e)}
      onMouseEnter={(e) => {
        commonHover(e);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        commonLeave(e);
        if (submenu && label !== 'Change audience' && label !== 'Change category') {
          setSubmenu(null);
        }
      }}
      style={{
        width: '100%',
        padding: '6px 8px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        position: 'relative',
      }}
    >
      <img src={iconSrc} alt="" style={{ width: '16px', height: '16px' }} />
      <div style={{ color: '#334155', fontSize: 14, fontFamily: 'Inter', lineHeight: '22px' }}>{label}</div>

      {label === 'Change audience' && submenu === 'audience' && <AudienceDropdown direction={submenuDirection} />}
      {label === 'Change category' && submenu === 'category' && <CategoryDropdown direction={submenuDirection} />}
          </div>
  );

  const AudienceDropdown: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => (
    <div
      style={{
        width: 175,
        position: 'absolute',
        left: direction === 'right' ? 'calc(100% + 4px)' : 'auto',
        right: direction === 'left' ? 'calc(100% + 4px)' : 'auto',
        top: 0,
        background: 'white',
        borderRadius: '6px',
        outline: '1px #E5E7EB solid',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 3000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '10.5px 17.5px', fontSize: 14, fontWeight: 700, color: '#374151' }}>Audience</div>
      {['Private', 'Team', 'Specific'].map((opt) => (
        <div
          key={opt}
          style={{ padding: '10.5px 17.5px', cursor: 'pointer', fontSize: 14, color: '#4B5563', display: 'flex', alignItems: 'center', gap: '8px' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F8FAFC')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          onClick={() => {
            onChangeAudience(opt as 'Private' | 'Team' | 'Specific');
            onClose();
          }}
        >
          {opt === 'Private' && <img src={lockIcon} alt="" style={{ width: 11, height: 11 }} />}
          {opt === 'Team' && <img src={usersIcon} alt="" style={{ width: 11, height: 11 }} />}
          {opt === 'Specific' && <span style={{ width: 11, display: 'inline-flex', justifyContent: 'center', fontSize: 11, color: '#6B7280' }}>@</span>}
          <span>{opt === 'Specific' ? 'Someone specific' : opt}</span>
        </div>
      ))}
          </div>
  );

  const CategoryDropdown: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => (
    <div
      style={{
        width: 136,
        position: 'absolute',
        left: direction === 'right' ? 'calc(100% + 4px)' : 'auto',
        right: direction === 'left' ? 'calc(100% + 4px)' : 'auto',
        top: 0,
        background: 'white',
        borderRadius: '6px',
        outline: '1px #E5E7EB solid',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 3000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '10.5px 17.5px', fontSize: 14, fontWeight: 700, color: '#374151' }}>Categories</div>
      {['None', 'Company', 'Contact', 'Location', 'Budget', 'Property'].map((cat) => (
        <div
          key={cat}
          style={{ padding: '10.5px 17.5px', cursor: 'pointer', fontSize: 14, color: '#4B5563' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F8FAFC')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          onClick={() => {
            onChangeCategory(cat === 'None' ? '' : cat);
            onClose();
          }}
        >
          {cat}
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={menuRef}
      data-show-button="true"
      data-show-menu="true"
      data-type="Basic"
      style={{
        width: 175,
        minWidth: 175,
        background: 'white',
        borderRadius: '6px',
        outline: '1px #E2E8F0 solid',
        display: 'inline-flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '100%',
        right: 0,
        zIndex: 2000,
      }}
    >
      <div style={{ alignSelf: 'stretch', padding: '3.5px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <MenuRow label="Edit note" iconSrc={pencilIcon} onClick={onEdit} />
        <MenuRow label="Delete note" iconSrc={trashIcon} onClick={onDelete} />
        <MenuRow
          label="Change audience"
          iconSrc={angleRightIcon}
          onMouseEnter={(e) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const menuWidth = 175;
            const spaceRight = window.innerWidth - rect.right;
            const spaceLeft = rect.left;
            setSubmenuDirection(spaceRight < menuWidth + 8 && spaceLeft >= menuWidth + 8 ? 'left' : 'right');
            setSubmenu('audience');
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <MenuRow
          label="Change category"
          iconSrc={angleRightIcon}
          onMouseEnter={(e) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const menuWidth = 136;
            const spaceRight = window.innerWidth - rect.right;
            const spaceLeft = rect.left;
            setSubmenuDirection(spaceRight < menuWidth + 8 && spaceLeft >= menuWidth + 8 ? 'left' : 'right');
            setSubmenu('category');
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};