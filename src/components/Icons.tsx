import React from 'react';

// Sticky Note Icon (24x24)
export const StickyNoteIcon: React.FC<{ className?: string }> = ({ className }) => (
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

// Search Icon (16x16)
export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
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

// Chevron Down Icon (16x16)
export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
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

// Close Icon (14x14)
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
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

// Private Lock Icon (10.5x10.5)
export const PrivateLockIcon: React.FC<{ className?: string }> = ({ className }) => (
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

// Team Icon (10.5x10.5) - placeholder
export const TeamIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '10.50px', height: '10.50px', position: 'relative', overflow: 'hidden' }}>
  </div>
);

// Note Input Left Icon (14x14) - placeholder
export const NoteInputLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ width: '14px', height: '14px', position: 'relative', overflow: 'hidden' }}>
  </div>
);

// Send Icon (14x14)
export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
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

// Category Dropdown Icon (14x14)
export const CategoryDropdownIcon: React.FC<{ className?: string }> = ({ className }) => (
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