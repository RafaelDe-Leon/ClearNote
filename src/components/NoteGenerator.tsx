import React, { useState } from 'react'
import { askOpenAI } from '../services/openaiService'

function NoteForm() {
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

  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)

    // Build user message from form values
    const userMessage = `
      Child's Name: ${fields.childName}
      Session Date: ${fields.sessionDate}
      Session Duration: ${fields.sessionDuration}
      Location: ${fields.location}
      Targeted Skills/Goals: ${fields.goals}
      Activities Used: ${fields.activities}
      Child’s Response: ${fields.childResponse}
      Caregiver Participation: ${fields.caregiverParticipation}
      Next Steps: ${fields.nextSteps}
    `.trim()

    try {
      const aiNote = await askOpenAI(userMessage)
      setNote(aiNote)
    } catch (err) {
      setNote('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 space-y-4 max-w-xl mx-auto'>
      {Object.entries(fields).map(([key, value]) => (
        <div key={key}>
          <label className='block font-bold'>{key.replace(/([A-Z])/g, ' $1')}</label>
          <textarea
            name={key}
            value={value}
            onChange={handleChange}
            rows={2}
            className='w-full border p-2'
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className='bg-blue-500 text-white px-4 py-2 rounded'
        disabled={loading}>
        {loading ? 'Generating...' : 'Generate Note'}
      </button>

      {note && <div className='mt-4 whitespace-pre-wrap border p-4 bg-gray-100'>{note}</div>}
    </div>
  )
}

export default NoteForm
