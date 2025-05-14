import type React from 'react';

import { useState } from 'react';
import { askOpenAI } from '@/services/openaiService';

export default function NoteForm() {
  const [fields, setFields] = useState({
    childName: '',
    sessionDate: '',
    sessionDuration: '',
    location: '',
    goals: '',
    activities: '',
    childResponse: '',
    caregiverParticipation: '',
    nextSteps: '',
  });

  const [generatedNote, setGeneratedNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const generateNote = async () => {
    setIsLoading(true);
    setError('');

    // Build user message from form values
    const userMessage = `
      Child's Name: ${fields.childName}
      Session Date: ${fields.sessionDate}
      Session Duration: ${fields.sessionDuration}
      Location: ${fields.location}
      Targeted Skills/Goals: ${fields.goals}
      Activities Used: ${fields.activities}
      Child's Response: ${fields.childResponse}
      Caregiver Participation: ${fields.caregiverParticipation}
      Next Steps: ${fields.nextSteps}
    `.trim();

    try {
      const aiNote = await askOpenAI(userMessage);
      setGeneratedNote(aiNote);
    } catch (err) {
      console.error('Error generating note:', err);
      setError('Failed to generate note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format field labels
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Insert a space before all capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  return (
    <>
      <div className="mx-auto grid max-w-full grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form Card */}
        <div className="overflow-hidden rounded-lg border border-[#1a2030] bg-[#0a1020] shadow-lg">
          <div className="border-b border-[#1a2030] p-6">
            <h2 className="text-2xl font-semibold text-blue-400">
              Patient's Information
            </h2>
            <p className="mt-2 text-white">
              Create detailed professional notes with AI assistance
            </p>
          </div>
          <div className="space-y-6 p-6">
            {/* Generate form fields dynamically based on the fields state */}
            {Object.entries(fields).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-white"
                >
                  {formatLabel(key)}{' '}
                  {key === 'childName' || key === 'sessionDate' ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    ''
                  )}
                </label>
                <textarea
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  rows={
                    key === 'childName' ||
                    key === 'sessionDate' ||
                    key === 'sessionDuration' ||
                    key === 'location'
                      ? 1
                      : 3
                  }
                  placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
                  className="w-full resize-none rounded-md border border-[#1a2030] bg-[#0f1729] px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            ))}

            {/* Generate Note Button */}
            <button
              className={`w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a1020] focus:outline-none ${
                isLoading ? 'cursor-not-allowed opacity-70' : ''
              }`}
              onClick={generateNote}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Note'}
            </button>
          </div>
        </div>

        {/* Generated Note Card */}
        <div className="overflow-hidden rounded-lg border border-[#1a2030] bg-[#0a1020] shadow-lg">
          <div className="border-b border-[#1a2030] p-6">
            <h2 className="text-2xl font-semibold text-blue-400">
              Generated Note
            </h2>
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-4 rounded-md border border-red-800 bg-red-900/20 p-4 text-red-200">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex h-[500px] flex-col items-center justify-center rounded-md border border-[#1a2030] bg-[#0f1729] p-4 text-white">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-t-2 border-solid border-blue-500"></div>
                <p>Generating professional note...</p>
              </div>
            ) : generatedNote ? (
              <div className="min-h-[500px] overflow-y-auto rounded-md border border-[#1a2030] bg-[#0f1729] p-4 whitespace-pre-line text-white">
                {generatedNote}
              </div>
            ) : (
              <div className="flex h-[500px] items-center justify-center rounded-md border border-[#1a2030] bg-[#0f1729] p-4 text-gray-400">
                Fill out the form and click "Generate Note" to see the
                AI-generated result here
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
