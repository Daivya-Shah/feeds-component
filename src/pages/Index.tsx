import { NotesDemo } from '../components/NotesDemo';
import { ActivityDemo } from '../components/ActivityDemo';
import { CalendarDemo } from '../components/CalendarDemo';

const Index = () => {
  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', padding: '16px' }}>
      <NotesDemo />
      <ActivityDemo />
      <CalendarDemo />
    </div>
  );
};

export default Index;
