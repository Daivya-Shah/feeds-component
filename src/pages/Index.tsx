import { NotesDemo } from '../components/NotesDemo';
import { ActivityDemo } from '../components/ActivityDemo';
import { CalendarDemo } from '../components/CalendarDemo';

const Index = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
      {/* Left: Notes Feed */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <NotesDemo />
      </div>

      {/* Center: Activity Feed */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <ActivityDemo />
      </div>

      {/* Right: Calendar Feed */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <CalendarDemo />
      </div>
    </div>
  );
};

export default Index;
