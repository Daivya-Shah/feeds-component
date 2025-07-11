import React, { useState } from 'react';
import { NotesFeedSidebar } from './NotesFeedSidebar';
import { StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotesDemo: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Newmark Notes Feed Demo</h1>
        
        {/* Demo Data Table Row */}
        <div className="bg-white border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Crucial AI</h2>
              <p className="text-gray-600">Tech company looking for office space in NYC Midtown</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">Active Lead</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">High Priority</span>
              </div>
            </div>
            
            {/* Actions Column */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarVisible(true)}
                className="flex items-center gap-2"
              >
                <StickyNote size={16} />
                Notes
              </Button>
              <Button variant="outline" size="sm">
                📧 Email
              </Button>
              <Button variant="outline" size="sm">
                📞 Call
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">How to use the Notes Feed</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Click the "Notes" button above to open the notes feed sidebar</li>
            <li>• The sidebar shows a timeline of all notes related to this client</li>
            <li>• Use the search bar to find specific notes</li>
            <li>• Filter by category using the dropdown</li>
            <li>• Add new notes using the input at the bottom</li>
            <li>• Notes are automatically timestamped with relative time formatting</li>
          </ul>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">✨ Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Real-time relative timestamps</li>
              <li>• Search and filter functionality</li>
              <li>• Category tagging system</li>
              <li>• Thread-like conversation view</li>
              <li>• User avatars and attribution</li>
              <li>• Private note indicators</li>
            </ul>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">⏰ Time Formatting</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• &lt; 24 hours: "X hours ago"</li>
              <li>• &lt; 48 hours: "Yesterday"</li>
              <li>• &lt; 7 days: "X days ago"</li>
              <li>• 7-31 days: "X weeks ago"</li>
              <li>• 31-365 days: "X months ago"</li>
              <li>• 365+ days: "X years ago"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Notes Feed Sidebar */}
      <NotesFeedSidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        clientName="Crucial AI"
      />
    </div>
  );
};