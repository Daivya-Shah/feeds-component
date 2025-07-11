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
        width: '756px',
        height: '1024px',
        overflow: 'hidden'
      }}
      className="notes-feed-sidebar-exact"
    >
      <div style={{
        width: '756px',
        height: '1024px',
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
            <StickyNoteIcon />
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
            <div style={{
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
              }}>{notes.length}</div>
            </div>
          </div>

          {/* Right side - Controls */}
          <div style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '16px',
            display: 'flex'
          }}>
            {/* Search Input */}
            <div style={{
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
                outline: '1px #CBD5E1 solid',
                outlineOffset: '-1px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '8px',
                display: 'inline-flex'
              }}>
                <SearchIcon />
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
                    fontSize: '16px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    lineHeight: '22px'
                  }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div style={{
              position: 'relative',
              width: '169px',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '4px',
              display: 'inline-flex'
            }}>
              <div 
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                style={{
                  alignSelf: 'stretch',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  background: 'white',
                  boxShadow: '0px 1px 2px rgba(18, 18, 23, 0.05)',
                  borderRadius: '6px',
                  outline: '1px #CBD5E1 solid',
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
                  color: selectedCategory || '#64748B',
                  fontSize: '16px',
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: '22px'
                }}>
                  {selectedCategory || 'Filter by Category'}
                </div>
                <ChevronDownIcon />
              </div>
              
              {filterDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  background: 'white',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
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
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '16px',
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

            {/* Close Button */}
            <div 
              onClick={onHide}
              style={{
                width: '34px',
                height: '32px',
                paddingTop: '10.50px',
                paddingBottom: '10.50px',
                borderRadius: '6px',
                outline: '1px #64748B solid',
                outlineOffset: '-1px',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                cursor: 'pointer'
              }}
            >
              <CloseIcon />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          alignSelf: 'stretch',
          height: '896px',
          padding: '24px',
          position: 'relative',
          background: '#F8FAFC',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          gap: '24px',
          display: 'flex'
        }}>
          {/* Timeline Line */}
          <div style={{
            width: '896px',
            height: '0px',
            left: '29px',
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
              style={{
                width: '738px',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: note.level === 2 ? '48px' : '16px',
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
                  border: '1px #609AF8 solid'
                }}></div>
              </div>

              {/* Note Content */}
              <div style={{
                flex: '1 1 0',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '8px',
                display: 'inline-flex'
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
                  overflow: 'hidden',
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
                        borderRadius: '999px'
                      }}>
                        <img 
                          style={{
                            width: '24px',
                            height: '24px',
                            left: '0px',
                            top: '0px',
                            position: 'absolute',
                            borderRadius: '980px'
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
                  </div>

                  {/* Note Content */}
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

                  {/* Categories */}
                  <div style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '8px',
                    display: 'inline-flex'
                  }}>
                    {note.isPrivate && (
                      <div style={{
                        paddingLeft: '5.60px',
                        paddingRight: '5.60px',
                        paddingTop: '3.50px',
                        paddingBottom: '3.50px',
                        background: '#F5F5F5',
                        borderRadius: '6px',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '3.50px',
                        display: 'flex'
                      }}>
                        <PrivateLockIcon />
                        <div style={{
                          color: '#424242',
                          fontSize: '10.50px',
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          lineHeight: '15.75px',
                          wordWrap: 'break-word'
                        }}>Private</div>
                      </div>
                    )}
                    {note.categories.map((category, idx) => (
                      <div 
                        key={idx}
                        style={{
                          paddingLeft: '5.60px',
                          paddingRight: '5.60px',
                          paddingTop: '3.50px',
                          paddingBottom: '3.50px',
                          background: '#F5F5F5',
                          borderRadius: '6px',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: '3.50px',
                          display: 'flex'
                        }}
                      >
                        {category === 'Team' && <TeamIcon />}
                        <div style={{
                          color: '#424242',
                          fontSize: '10.50px',
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          lineHeight: '15.75px',
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
            width: '4px',
            height: '64px',
            left: '739px',
            top: '808px',
            position: 'absolute',
            background: '#CBD5E1',
            borderRadius: '99px'
          }}></div>
        </div>

        {/* Footer - Add Note */}
        <div style={{
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
          <div style={{
            flex: '1 1 0',
            height: '40px',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '8px',
            display: 'inline-flex'
          }}>
            <div style={{
              alignSelf: 'stretch',
              flex: '1 1 0',
              paddingLeft: '10.50px',
              paddingRight: '10.50px',
              paddingTop: '11.50px',
              paddingBottom: '11.50px',
              background: 'white',
              overflow: 'hidden',
              borderRadius: '6px',
              outline: '1px #D1D5DB solid',
              outlineOffset: '-1px',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '10.50px',
              display: 'inline-flex'
            }}>
              <NoteInputLeftIcon />
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
                  fontSize: '16px',
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: '22px'
                }}
              />
              <SendIcon />
            </div>
          </div>

          {/* Category Dropdown */}
          <div style={{
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
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
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
                outline: '1px #D1D5DB solid',
                outlineOffset: '-1px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '10.50px',
                display: 'inline-flex',
                cursor: 'pointer'
              }}
            >
              <div style={{
                flex: '1 1 0',
                color: noteCategory || '#6B7280',
                fontSize: '16px',
                fontFamily: 'Inter',
                fontWeight: '600',
                lineHeight: '22px'
              }}>
                {noteCategory || 'Category'}
              </div>
              <CategoryDropdownIcon />
            </div>
            
            {categoryDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '-120px',
                left: '0',
                right: '0',
                background: 'white',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000
              }}>
                {['Team', 'Qualification', 'Private'].map((category) => (
                  <div
                    key={category}
                    onClick={() => {
                      setNoteCategory(category);
                      setCategoryDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontSize: '16px',
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

          {/* Save Button */}
          <div 
            onClick={handleSaveNote}
            style={{
              paddingLeft: '17.50px',
              paddingRight: '17.50px',
              paddingTop: '10.50px',
              paddingBottom: '10.50px',
              opacity: newNote.trim() ? 1 : 0.70,
              background: '#64748B',
              borderRadius: '6px',
              outline: '1px #64748B solid',
              outlineOffset: '-1px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '7px',
              display: 'flex',
              cursor: newNote.trim() ? 'pointer' : 'not-allowed'
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
    </Sidebar>
  );
};