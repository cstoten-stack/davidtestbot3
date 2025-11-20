import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import OpenAI from "openai"

const app = express()

// Render port fix
const PORT = process.env.PORT || 3001

// Correct CORS allow list
app.use(cors({
  origin: [
    "https://daviddoyle.co.uk",
    "https://www.daviddoyle.co.uk",
    "https://davidtestbotiframe.onrender.com",
    "https://cdn.siteloft.com"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}))

app.options("*", cors())

app.use(bodyParser.json())

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const SYSTEM_MESSAGE = `
You are David, the softly spoken digital assistant for David Doyle Estate Agents in Hemel Hempstead.
Follow all tone and behaviour guidelines.
Avoid using dashes.
Stay warm and helpful.
Do not book appointments or access systems.
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
    console.error("Chat error", err)
    res.status(500).json({ error: "Something went wrong" })
  }
})

app.listen(PORT, () => {
  console.log("David server live on port", PORT)
})
