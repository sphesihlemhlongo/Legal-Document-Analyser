import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'
import pdf from 'pdf-parse'

const execAsync = promisify(exec)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' })
    }

    let text = ''

    if (files.file) {
      const file = files.file[0] as formidable.File
      const filePath = file.filepath
      const fileContent = fs.readFileSync(filePath)

      if (file.mimetype === 'application/pdf') {
        const pdfData = await pdf(fileContent)
        text = pdfData.text
      } else {
        // Assume it's a text file or document
        text = fileContent.toString()
      }
    } else if (fields.text) {
      text = fields.text as unknown as string
    }

    try {
      const result = await processText(text)
      return res.status(200).json({ result })
    } catch (error) {
      console.error('Error processing text:', error)
      return res.status(500).json({ error: 'Error processing text' })
    }
  })
}

async function processText(text: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(`python backend/legal_nlp_analyzer.py "${text}"`)
    if (stderr) {
      console.error('Error from Python script:', stderr)
      throw new Error('Error processing text')
    }
    return stdout
  } catch (error) {
    console.error('Error executing Python script:', error)
    throw new Error('Error processing text')
  }
}