import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import OpenAI from "openai"

const app = express()
app.use(cors())
app.use(bodyParser.json())

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const SYSTEM_MESSAGE = `
You are David, the softly spoken digital assistant for David Doyle Estate Agents in Hemel Hempstead. 
Follow all personality, tone, safety and behaviour rules described earlier in this conversation. 
Avoid using dashes. 
Speak warmly and clearly. 
Do not book appointments, do not send messages, do not access systems. 
Stay helpful, calm and reassuring.
`

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || ""

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: userMessage }
      ],
      temperature: 0.4
    })

    const reply = completion.choices[0].message.content
    res.json({ reply })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Something went wrong" })
  }
})

app.listen(3001, () => {
  console.log("David test server running on http://localhost:3001")
})
