export async function askOpenAI(message: string): Promise<string> {
  const systemMessage = `Create a professional early intervention session note including these sections: Child’s Name, Session Date, Session Duration, Location of Session, Targeted Skills/Goals or IFSP Objectives Addressed, Activities or Strategies Used, Child’s Response/Performance, Caregiver Participation/Strategies Modeled, and Next Steps or Plan for Upcoming Sessions. Make it sound detailed, structured, and in line with early intervention documentation standards.`

  const response = await fetch('http://localhost:3000/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, systemMessage }),
  })

  if (!response.ok) throw new Error('Failed to fetch AI response')
  const data = await response.json()
  return data.reply
}
