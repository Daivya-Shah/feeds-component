# Feeds Component

A React UI prototype of three feed sidebar panels built for a commercial real estate SaaS product. The feeds are designed to work both as slide-in sidebars and as inline page sections, and they share a consistent timeline layout with threaded notes, timestamps, and audience controls.

The demo runs against a fictional client called "Crucial AI" with mock data baked in, making it easy to preview and iterate on the UI without a backend.

---

## The three feeds

### Notes Feed
The most fully-featured panel. Users can add, edit, delete, and reply to notes. Each note has an audience setting (Private, My Team, or Someone Specific) and a category tag (Company, Contact, Location, Budget, Property). Notes can be filtered by category from the header.

### Activity Feed
A read-only timeline of past activity events like tours and property surveys. No input, just a clean chronological view sorted newest to oldest.

### Calendar Feed
An upcoming events timeline that shows future-scheduled items with forward-looking timestamps ("In 2 hours", "Tomorrow"). Sorted soonest first.

---

## Tech stack

- **React 18** with TypeScript
- **Vite** for dev and build
- **PrimeReact** for the Sidebar and Dialog components
- **Tailwind CSS** for utility classes
- **shadcn/ui** component library (Radix-based)
- **Inter** font throughout

---

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app opens at `http://localhost:8080`. The index page renders all three feeds side by side so you can compare them at a glance.

---

## Component usage

Each feed component accepts the same core props:

```tsx
<NotesFeedSidebar
  visible={sidebarVisible}       // controls PrimeReact sidebar open state
  onHide={() => setSidebarVisible(false)}
  clientName="Crucial AI"        // displayed in the header
  notes={notes}                  // array of Note objects
  currentAuthor="Alberto Perez"  // used to show edit/delete controls on owned notes
  onAddNote={handleAddNote}
  onUpdateNotes={handleUpdateNotes}
  inline={false}                 // set to true to render inline instead of as a sidebar
/>
```

### Inline vs. sidebar mode

Every feed supports an `inline` prop. When `inline={true}`, the panel renders as a regular block element you can drop anywhere on the page. When `false` (the default), it slides in from the right as a PrimeReact sidebar overlay.

### The Note object

```ts
interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  avatar: string;
  categories: string[];
  audience: 'Private' | 'Team' | 'Specific';
  level?: number;    // 1-4, controls reply indentation
  deleted?: boolean; // soft delete, replaces content with a placeholder
}
```

---

## Project structure

```
src/
  components/
    NotesFeedSidebar.tsx      # Notes feed with full CRUD
    ActivityFeedSidebar.tsx   # Read-only past activity timeline
    CalendarFeedSidebar.tsx   # Upcoming events timeline
    NotesDemo.tsx             # Notes demo wrapper with user switcher
    ActivityDemo.tsx          # Activity demo wrapper
    CalendarDemo.tsx          # Calendar demo wrapper
    icons/                    # SVG icon assets
    ui/                       # shadcn/ui components
  pages/
    Index.tsx                 # Renders all three demos side by side
    NotFound.tsx
  App.tsx
```
