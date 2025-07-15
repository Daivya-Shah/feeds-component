import React, { useState } from 'react';
import trashIcon from '@/components/icons/trash.svg';
import pencilIcon from '@/components/icons/pencil.svg';
import angleRightIcon from '@/components/icons/angle-right.svg';
import lockIcon from '@/components/icons/lock.svg';
import usersIcon from '@/components/icons/users.svg';

interface NoteMenuProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onChangeAudience: (aud: 'Private' | 'Team' | 'Specific') => void;
  onChangeCategory: (cat: string) => void;
}

// Lightweight pop-over menu that appears inside a note card when the note belongs to the current user.
// Contains its own nested sub-menus for changing audience and category.
export const NoteMenu: React.FC<NoteMenuProps> = ({ onClose, onEdit, onDelete, onChangeAudience, onChangeCategory }) => {
  const [submenu, setSubmenu] = useState<null | 'audience' | 'category'>(null);
  const [submenuDirection, setSubmenuDirection] = useState<'left' | 'right'>('right');

  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
        // Collapse submenu when leaving row (unless entering submenu itself)
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
      {/* Icon */}
      <img src={iconSrc} alt="" style={{ width: '16px', height: '16px' }} />
      <div style={{ color: 'var(--menu-item-color, #334155)', fontSize: '14px', fontFamily: 'Inter', lineHeight: '22px' }}>
        {label}
      </div>

      {/* Nested dropdown */}
      {label === 'Change audience' && submenu === 'audience' && (
        <AudienceDropdown direction={submenuDirection} />
      )}
      {label === 'Change category' && submenu === 'category' && (
        <CategoryDropdown direction={submenuDirection} />
      )}
    </div>
  );

  const AudienceDropdown: React.FC<{direction:'left'|'right'}> = ({direction}) => (
    <div
      style={{
        width: '175px',
        position: 'absolute',
        left: direction==='right' ? 'calc(100% + 4px)' : 'auto',
        right: direction==='left' ? 'calc(100% + 4px)' : 'auto',
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
          style={{ padding: '10.5px 17.5px', cursor: 'pointer', fontSize: 14, color: '#4B5563', display:'flex', alignItems:'center', gap:'8px' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          onClick={() => {
            // We are only handling UI for now.
            onChangeAudience(opt as 'Private' | 'Team' | 'Specific');
            onClose();
          }}
        >
          {/* icon */}
          {opt==='Private' && <img src={lockIcon} alt="" style={{width:'11px',height:'11px'}} />}
          {opt==='Team' && <img src={usersIcon} alt="" style={{width:'11px',height:'11px'}} />}
          {opt==='Specific' && <span style={{width:'11px',display:'inline-flex',justifyContent:'center',fontSize:11,color:'#6B7280'}}>@</span>}
          <span>{opt==='Specific' ? 'Someone specific' : opt}</span>
        </div>
      ))}
    </div>
  );

  const CategoryDropdown: React.FC<{direction:'left'|'right'}> = ({direction}) => (
    <div
      style={{
        width: '136px',
        position: 'absolute',
        left: direction==='right' ? 'calc(100% + 4px)' : 'auto',
        right: direction==='left' ? 'calc(100% + 4px)' : 'auto',
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
          onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
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
        width: '175px',
        minWidth: '175px',
        background: 'var(--menu-background, white)',
        borderRadius: '6px',
        outline: '1px var(--menu-border-color, #E2E8F0) solid',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'inline-flex',
        position: 'absolute',
        top: '100%', // directly below the trigger icon
        right: 0,
        zIndex: 2000,
      }}
    >
      <div style={{ alignSelf: 'stretch', padding: '3.5px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <MenuRow label="Edit note" iconSrc={pencilIcon} onClick={onEdit} />
        <MenuRow label="Delete note" iconSrc={trashIcon} onClick={onDelete} />
        <MenuRow
          label="Change audience"
          iconSrc={angleRightIcon}
          onMouseEnter={(e) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const menuWidth = 175; // width of nested menu
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