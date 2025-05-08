import type React from 'react'

import { useState } from 'react'
import { askOpenAI } from '@/services/openaiService'
import TestFirestore from '../components/testFirestore'

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
  })

  const [generatedNote, setGeneratedNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
  }

  const generateNote = async () => {
    setIsLoading(true)
    setError('')

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
    `.trim()

    try {
      const aiNote = await askOpenAI(userMessage)
      setGeneratedNote(aiNote)
    } catch (err) {
      console.error('Error generating note:', err)
      setError('Failed to generate note. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to format field labels
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Insert a space before all capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
  }

  return (
    <>
      <TestFirestore />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full mx-auto'>
        {/* Form Card */}
        <div className='bg-[#0a1020] border border-[#1a2030] rounded-lg shadow-lg overflow-hidden'>
          <div className='p-6 border-b border-[#1a2030]'>
            <h2 className='text-2xl font-semibold text-blue-400'>Patient's Information</h2>
            <p className='text-white mt-2'>Create detailed professional notes with AI assistance</p>
          </div>
          <div className='p-6 space-y-6'>
            {/* Generate form fields dynamically based on the fields state */}
            {Object.entries(fields).map(([key, value]) => (
              <div key={key} className='space-y-2'>
                <label htmlFor={key} className='block text-white text-sm font-medium'>
                  {formatLabel(key)}{' '}
                  {key === 'childName' || key === 'sessionDate' ? (
                    <span className='text-red-500'>*</span>
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
                  className='w-full px-4 py-2 bg-[#0f1729] border border-[#1a2030] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                />
              </div>
            ))}

            {/* Generate Note Button */}
            <button
              className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a1020] ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={generateNote}
              disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Note'}
            </button>
          </div>
        </div>

        {/* Generated Note Card */}
        <div className='bg-[#0a1020] border border-[#1a2030] rounded-lg shadow-lg overflow-hidden'>
          <div className='p-6 border-b border-[#1a2030]'>
            <h2 className='text-2xl font-semibold text-blue-400'>Generated Note</h2>
          </div>
          <div className='p-6'>
            {error && (
              <div className='bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-md mb-4'>
                {error}
              </div>
            )}

            {isLoading ? (
              <div className='flex flex-col items-center justify-center h-[500px] bg-[#0f1729] p-4 rounded-md border border-[#1a2030] text-white'>
                <div className='w-10 h-10 border-t-2 border-blue-500 border-solid rounded-full animate-spin mb-4'></div>
                <p>Generating professional note...</p>
              </div>
            ) : generatedNote ? (
              <div className='whitespace-pre-line bg-[#0f1729] p-4 rounded-md border border-[#1a2030] min-h-[500px] text-white overflow-y-auto'>
                {generatedNote}
              </div>
            ) : (
              <div className='flex items-center justify-center h-[500px] bg-[#0f1729] p-4 rounded-md border border-[#1a2030] text-gray-400'>
                Fill out the form and click "Generate Note" to see the AI-generated result here
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
