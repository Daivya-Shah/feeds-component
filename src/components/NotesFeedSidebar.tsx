import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { formatRelativeTime } from '../utils/timeFormatting';

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

export const NotesFeedSidebar: React.FC<NotesFeedSidebarProps> = ({
  visible,
  onHide,
  clientName = 'Crucial AI',
  notes = mockNotes
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newNote, setNewNote] = useState('');
  const [noteCategory, setNoteCategory] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || note.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleSaveNote = () => {
    if (newNote.trim()) {
      console.log('Saving note:', { content: newNote, category: noteCategory });
      setNewNote('');
      setNoteCategory('');
    }
  };

  return (
    <Sidebar 
      visible={visible} 
      position="right" 
      onHide={onHide}
      style={{ 
        width: '50vw',
        height: '100vh',
        overflow: 'hidden'
      }}
      className="notes-feed-sidebar-exact"
    >
      <div style={{
        width: '100%',
        height: '100%',
        boxShadow: '0px 8px 10px -6px rgba(0, 0, 0, 0.10)',
        overflow: 'hidden',
        outline: '1px #E2E8F0 solid',
        outlineOffset: '-1px',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'inline-flex'
      }}>
        {/* Header */}
        <div style={{
          alignSelf: 'stretch',
          paddingLeft: '2.6%',
          paddingRight: '2.6%',
          paddingTop: '1.1%',
          paddingBottom: '1.1%',
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
            gap: '1.1%',
            display: 'flex'
          }}>
            <div data-size="24x24" style={{
              width: '3.2%',
              height: '2.3%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '1.8%',
                height: '1.7%',
                left: '0.7%',
                top: '0.3%',
                position: 'absolute',
                background: '#4B5563'
              }}></div>
            </div>
            <div style={{
              color: '#0F172A',
              fontSize: '2.1vw',
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: '2.2%',
              wordWrap: 'break-word'
            }}>{clientName}</div>
            <div style={{
              color: '#6B7280',
              fontSize: '2.1vw',
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: '2.2%',
              wordWrap: 'break-word'
            }}>Notes</div>
            <div data-circle="False" data-severity="Secondary" data-size="Small" style={{
              height: '1.7%',
              minWidth: '2.3%',
              paddingLeft: '0.9%',
              paddingRight: '0.9%',
              background: '#F1F5F9',
              borderRadius: '0.8%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'inline-flex'
            }}>
              <div style={{
                color: '#475569',
                fontSize: '2.1vw',
                fontFamily: 'Inter',
                fontWeight: '600',
                lineHeight: '2.2%',
                wordWrap: 'break-word'
              }}>8</div>
            </div>
          </div>

          {/* Empty space */}
          <div style={{
            color: '#026BB6',
            fontSize: '2.1vw',
            fontFamily: 'Inter',
            fontWeight: '600',
            lineHeight: '2.2%',
            wordWrap: 'break-word'
          }}> </div>

          {/* Right side - Controls */}
          <div style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '2.1%',
            display: 'flex'
          }}>
            <div style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '2.1%',
              display: 'flex'
            }}>
              {/* Search Input */}
              <div data-show-helper="false" data-state="Default" data-invalid="False" data-show-right-icon="false" data-show-left-icon="true" data-float-label="False" data-show-label="false" data-show-text="true" data-disabled="False" data-filled="False" data-size="Normal" style={{
                width: '28.6%',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '0.5%',
                display: 'inline-flex'
              }}>
                <div style={{
                  alignSelf: 'stretch',
                  paddingLeft: '1.6%',
                  paddingRight: '1.6%',
                  paddingTop: '1.1%',
                  paddingBottom: '1.1%',
                  background: 'white',
                  boxShadow: '0px 1px 2px rgba(18, 18, 23, 0.05)',
                  borderRadius: '0.8%',
                  outline: '1px #CBD5E1 solid',
                  outlineOffset: '-1px',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '1.1%',
                  display: 'inline-flex'
                }}>
                  <div style={{
                    width: '2.1%',
                    height: '1.6%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '1.8%',
                      height: '1.3%',
                      left: '0.2%',
                      top: '0.1%',
                      position: 'absolute',
                      background: '#94A3B8'
                    }}></div>
                  </div>
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
                        placeholder="Search notes"
                        style={{
                          flex: '1 1 0',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          color: '#64748B',
                          fontSize: '2.1vw',
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          lineHeight: '2.2%',
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
              gap: '2.1%',
              display: 'flex'
            }}>
              {/* Category Filter */}
              <div data-show-helper="false" data-state="Default" data-invalid="False" data-show-right-icon="true" data-show-left-icon="false" data-float-label="False" data-show-label="false" data-show-text="true" data-disabled="False" data-filled="False" data-size="Normal" style={{
                position: 'relative',
                width: '22.4%',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '0.5%',
                display: 'inline-flex'
              }}>
                <div 
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  style={{
                    alignSelf: 'stretch',
                    paddingLeft: '1.6%',
                    paddingRight: '1.6%',
                    paddingTop: '1.1%',
                    paddingBottom: '1.1%',
                    background: 'white',
                    boxShadow: '0px 1px 2px rgba(18, 18, 23, 0.05)',
                    borderRadius: '0.8%',
                    outline: '1px #CBD5E1 solid',
                    outlineOffset: '-1px',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '1.1%',
                    display: 'inline-flex',
                    cursor: 'pointer'
                  }}
                >
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
                        color: '#64748B',
                        fontSize: '2.1vw',
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        lineHeight: '2.2%',
                        wordWrap: 'break-word',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {selectedCategory || 'Filter by Category'}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    width: '2.1%',
                    height: '1.6%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '1.3%',
                      height: '0.6%',
                      left: '0.4%',
                      top: '0.5%',
                      position: 'absolute',
                      background: '#94A3B8'
                    }}></div>
                  </div>
                </div>
                
                {filterDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: '0',
                    background: 'white',
                    border: '1px solid #CBD5E1',
                    borderRadius: '0.8%',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000
                  }}>
                    {['All Categories', 'Team', 'Qualification', 'Private'].map((category) => (
                      <div
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category === 'All Categories' ? '' : category);
                          setFilterDropdownOpen(false);
                        }}
                        style={{
                          padding: '1.1% 1.6%',
                          cursor: 'pointer',
                          fontSize: '2.1vw',
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          color: '#64748B',
                          borderBottom: category === 'Private' ? 'none' : '1px solid #E2E8F0'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Close Button */}
            <div data-disabled="False" data-icon-only="True" data-link="False" data-severity="Secondary" data-show-left-icon="false" data-show-right-icon="false" data-state="Idle" data-rounded="False" data-raised="False" data-text="False" data-outlined="True" 
              onClick={onHide}
              style={{
                width: '4.5%',
                height: '3.1%',
                paddingTop: '1.0%',
                paddingBottom: '1.0%',
                borderRadius: '0.8%',
                outline: '1px #64748B solid',
                outlineOffset: '-1px',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                cursor: 'pointer'
              }}
            >
              <div data-size="14x14" style={{
                width: '1.9%',
                height: '1.4%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '1.5%',
                  height: '1.1%',
                  left: '0.2%',
                  top: '0.1%',
                  position: 'absolute',
                  background: '#64748B'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          alignSelf: 'stretch',
          flex: '1',
          padding: '3.2%',
          position: 'relative',
          background: '#F8FAFC',
          overflow: 'auto',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          gap: '3.2%',
          display: 'flex'
        }}>
          {/* Timeline Line */}
          <div style={{
            width: '100%',
            height: '0px',
            left: '3.8%',
            top: '0px',
            position: 'absolute',
            transform: 'rotate(90deg)',
            transformOrigin: 'top left',
            outline: '1px #ABC9FB solid',
            outlineOffset: '-0.50px'
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
                width: '97.6%',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: note.level === 2 ? '6.3%' : '2.1%',
                display: 'inline-flex'
              }}
            >
              {/* Timeline Dot */}
              <div style={{
                paddingTop: '0.4%',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '1.3%',
                display: 'flex'
              }}>
                <div style={{
                  width: '1.5%',
                  height: '1.1%',
                  background: 'white',
                  borderRadius: '9999px',
                  border: '1px #609AF8 solid'
                }}></div>
              </div>

              {/* Note Content */}
              <div style={{
                flex: '1 1 0',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '1.1%',
                display: 'inline-flex'
              }}>
                {/* Timestamp */}
                <div style={{
                  color: '#6B7280',
                  fontSize: '1.4vw',
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: '1.5%',
                  wordWrap: 'break-word'
                }}>
                  {formatRelativeTime(note.timestamp)}
                </div>

                {/* Note Card */}
                <div style={{
                  paddingTop: '1.6%',
                  paddingBottom: '2.1%',
                  paddingLeft: '2.1%',
                  paddingRight: '2.6%',
                  background: 'white',
                  overflow: 'hidden',
                  borderRadius: '1.6%',
                  outline: '1px #DFE7EF solid',
                  outlineOffset: '-1px',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: '1.1%',
                  display: 'flex'
                }}>
                  {/* Author Header */}
                  <div style={{
                    alignSelf: 'stretch',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    display: 'inline-flex'
                  }}>
                    <div style={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '1.1%',
                      display: 'flex'
                    }}>
                      <div data-variant={note.id === '6' ? '20' : note.id === '2' || note.id === '5' ? '2' : '3'} style={{
                        width: '3.2%',
                        height: '2.3%',
                        position: 'relative',
                        borderRadius: '999px',
                        ...(note.id === '6' && {
                          overflow: 'hidden',
                          backgroundImage: 'url(https://placehold.co/24x24)'
                        })
                      }}>
                        {note.id === '6' ? (
                          <img style={{
                            width: '6.6%',
                            height: '4.9%',
                            left: '-2.2%',
                            top: '-0.1%',
                            position: 'absolute',
                            borderRadius: '980px'
                          }}
                          src="https://placehold.co/50x50"
                          alt={note.author}
                          />
                        ) : (
                          <img style={{
                            width: '3.2%',
                            height: '2.3%',
                            left: '0px',
                            top: '0px',
                            position: 'absolute',
                            borderRadius: '980px'
                          }}
                          src={note.avatar}
                          alt={note.author}
                          />
                        )}
                      </div>
                      <div style={{
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: '0.5%',
                        display: 'flex'
                      }}>
                        <div style={{
                          color: '#111827',
                          fontSize: '1.9vw',
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          wordWrap: 'break-word'
                        }}>
                          {note.author}
                        </div>
                      </div>
                    </div>
                    <div data-size="14x14" style={{
                      width: '1.9%',
                      height: '1.4%',
                      position: 'relative',
                      overflow: 'hidden'
                    }}></div>
                  </div>

                  {/* Note Content */}
                  {note.id === '4' ? (
                    <div style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '0.5%',
                      display: 'inline-flex'
                    }}>
                      <div style={{
                        flex: '1 1 0',
                        color: '#212121',
                        fontSize: '1.9vw',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        lineHeight: '2.2%',
                        wordWrap: 'break-word',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {note.content}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '0.5%',
                      display: 'inline-flex'
                    }}>
                      <div style={{
                        color: '#212121',
                        fontSize: '1.9vw',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        lineHeight: '2.2%',
                        wordWrap: 'break-word'
                      }}>
                        {note.content}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  <div style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '1.1%',
                    display: 'inline-flex'
                  }}>
                    {note.isPrivate && (
                      <div data-rounded="False" data-severity="Default" data-show-icon="true" style={{
                        paddingLeft: '0.7%',
                        paddingRight: '0.7%',
                        paddingTop: '0.5%',
                        paddingBottom: '0.5%',
                        background: '#F5F5F5',
                        borderRadius: '0.8%',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.5%',
                        display: 'flex'
                      }}>
                        <div data-size="14x14" style={{
                          width: '1.4%',
                          height: '1.0%',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: '1.2%',
                            height: '1.0%',
                            left: '0.1%',
                            top: '0px',
                            position: 'absolute',
                            background: '#1F2937'
                          }}></div>
                        </div>
                        <div style={{
                          color: '#424242',
                          fontSize: '1.4vw',
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          lineHeight: '1.5%',
                          wordWrap: 'break-word'
                        }}>Private</div>
                      </div>
                    )}
                    {note.categories.map((category, idx) => (
                      <div 
                        key={idx}
                        data-rounded="False"
                        data-severity="Default"
                        data-show-icon={category === 'Team' ? 'true' : 'false'}
                        style={{
                          paddingLeft: '0.7%',
                          paddingRight: '0.7%',
                          paddingTop: '0.5%',
                          paddingBottom: '0.5%',
                          background: '#F5F5F5',
                          borderRadius: '0.8%',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: '0.5%',
                          display: 'flex'
                        }}
                      >
                        {category === 'Team' && (
                          <div data-size="14x14" style={{
                            width: '1.4%',
                            height: '1.0%',
                            position: 'relative',
                            overflow: 'hidden'
                          }}></div>
                        )}
                        <div style={{
                          color: '#424242',
                          fontSize: '1.4vw',
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          lineHeight: '1.5%',
                          wordWrap: 'break-word'
                        }}>{category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Scrollbar */}
          <div style={{
            width: '0.5%',
            height: '6.3%',
            right: '0.7%',
            bottom: '10%',
            position: 'absolute',
            background: '#CBD5E1',
            borderRadius: '99px'
          }}></div>
        </div>

        {/* Footer - Add Note */}
        <div data-state="Empty" style={{
          alignSelf: 'stretch',
          height: '7.0%',
          paddingLeft: '3.2%',
          paddingRight: '3.2%',
          paddingTop: '1.6%',
          paddingBottom: '1.6%',
          background: 'white',
          borderTop: '1px #DFE1E6 solid',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '2.1%',
          display: 'inline-flex'
        }}>
          {/* Note Input */}
          <div data-disabled="False" data-filled="False" data-float-label="True" data-invalid="False" data-show-float-label="false" data-show-helper="false" data-show-left-icon="true" data-show-right-icon="true" data-show-text="true" data-state="Default" style={{
            flex: '1 1 0',
            height: '3.9%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '1.1%',
            display: 'inline-flex'
          }}>
            <div style={{
              alignSelf: 'stretch',
              flex: '1 1 0',
              paddingLeft: '1.4%',
              paddingRight: '1.4%',
              paddingTop: '1.1%',
              paddingBottom: '1.1%',
              background: 'white',
              overflow: 'hidden',
              borderRadius: '0.8%',
              outline: '1px #D1D5DB solid',
              outlineOffset: '-1px',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '1.4%',
              display: 'inline-flex'
            }}>
              <div data-size="14x14" style={{
                width: '1.9%',
                height: '1.4%',
                position: 'relative',
                overflow: 'hidden'
              }}></div>
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
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter note"
                    style={{
                      flex: '1 1 0',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: '#6B7280',
                      fontSize: '2.1vw',
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      lineHeight: '2.2%',
                      wordWrap: 'break-word'
                    }}
                  />
                </div>
              </div>
              <div data-size="14x14" style={{
                width: '1.9%',
                height: '1.4%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '1.6%',
                  height: '1.4%',
                  left: '0.1%',
                  top: '0px',
                  position: 'absolute',
                  background: '#6B7280'
                }}></div>
              </div>
            </div>
          </div>

          {/* Category Input */}
          <div data-disabled="False" data-filled="False" data-float-label="True" data-invalid="False" data-show-float-label="false" data-show-helper="false" data-show-left-icon="false" data-show-right-icon="true" data-show-text="true" data-state="Default" style={{
            width: '18.0%',
            height: '3.9%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '1.1%',
            display: 'inline-flex'
          }}>
            <div 
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              style={{
                alignSelf: 'stretch',
                flex: '1 1 0',
                paddingLeft: '1.4%',
                paddingRight: '1.4%',
                paddingTop: '1.1%',
                paddingBottom: '1.1%',
                background: 'white',
                overflow: 'hidden',
                borderRadius: '0.8%',
                outline: '1px #D1D5DB solid',
                outlineOffset: '-1px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '1.4%',
                display: 'inline-flex',
                cursor: 'pointer',
                position: 'relative'
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
                    color: '#6B7280',
                    fontSize: '2.1vw',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    lineHeight: '2.2%',
                    wordWrap: 'break-word'
                  }}>{noteCategory || 'Category'}</div>
                </div>
              </div>
              <div data-size="14x14" style={{
                width: '1.9%',
                height: '1.4%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '1.1%',
                  height: '0.5%',
                  left: '0.4%',
                  top: '0.4%',
                  position: 'absolute',
                  background: '#6B7280'
                }}></div>
              </div>

              {categoryDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '0',
                  right: '0',
                  background: 'white',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.8%',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000
                }}>
                  {['Team', 'Qualification', 'Private'].map((category) => (
                    <div
                      key={category}
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteCategory(category);
                        setCategoryDropdownOpen(false);
                      }}
                      style={{
                        padding: '1.1% 1.4%',
                        cursor: 'pointer',
                        fontSize: '2.1vw',
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        color: '#6B7280',
                        borderBottom: category === 'Private' ? 'none' : '1px solid #E2E8F0'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div 
            data-disabled={!newNote.trim() ? "True" : "False"}
            data-icon-only="False"
            data-link="False"
            data-severity="Secondary"
            data-show-left-icon="false"
            data-show-right-icon="false"
            data-state="Idle"
            data-rounded="False"
            data-raised="False"
            data-text="False"
            data-outlined="False"
            onClick={handleSaveNote}
            style={{
              paddingLeft: '2.3%',
              paddingRight: '2.3%',
              paddingTop: '1.0%',
              paddingBottom: '1.0%',
              opacity: !newNote.trim() ? '0.70' : '1',
              background: '#64748B',
              borderRadius: '0.8%',
              outline: '1px #64748B solid',
              outlineOffset: '-1px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.9%',
              display: 'flex',
              cursor: !newNote.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            <div style={{
              color: 'white',
              fontSize: '2.1vw',
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: '2.2%',
              wordWrap: 'break-word'
            }}>Save</div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};