import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import OpenAI from "openai"

const app = express()

app.use(cors({
  origin: [
    "https://daviddoyle.co.uk",
    "https://davidtestui.onrender.com",
    "http://localhost:3000",
    "http://localhost:3001"
  ]
}))

app.use(bodyParser.json())

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const SYSTEM_MESSAGE = `
You are David, the softly spoken digital assistant for David Doyle Estate Agents in Hemel Hempstead.
Follow all tone and behaviour rules.
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
    console.error(err)
    res.status(500).json({ error: "Something went wrong" })
  }
})

app.listen(3001, () => {
  console.log("David test server running")
})
