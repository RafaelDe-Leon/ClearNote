import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { OpenAI } from 'openai'

dotenv.config({ path: './server/.env' })

console.log('Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY)

const app = express()
const port = 3000

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.use(cors())
app.use(express.json())

app.post('/ask', async (req: express.Request, res: express.Response) => {
  try {
    const { message, systemMessage } = req.body

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: message },
      ],
    })

    res.json({ reply: completion.choices[0].message.content })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
