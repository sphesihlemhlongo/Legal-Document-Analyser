import { NextResponse } from 'next/server'
import formidable from 'formidable'
import fs from 'fs'
import pdf from 'pdf-parse'

export const config = {
  api: {
    bodyParser: false,
  },
}

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const form = new formidable.IncomingForm()
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         return res.status(500).json({ error: 'Error parsing form data' })
//       }

//       let text = ''

//       if (files.file) {
//         const file = files.file[0]
//         const filePath = file.filepath
//         const fileContent = fs.readFileSync(filePath)

//         if (file.mimetype === 'application/pdf') {
//           const pdfData = await pdf(fileContent)
//           text = pdfData.text
//         } else {
//           // Assume it's a text file or document
//           text = fileContent.toString()
//         }
//       } else if (fields.text) {
//         text = fields.text
//       }

//       // Process the text (this is where you'd implement your text processing logic)
//       const processedText = processText(text)

//       return res.status(200).json({ result: processedText })
//     })
//   } else {
//     res.setHeader('Allow', ['POST'])
//     res.status(405).end(`Method ${req.method} Not Allowed`)
//   }
// }

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ... (previous code remains the same)

async function processText(text) {
  try {
    const { stdout, stderr } = await execAsync(`python backend/legal_nlp_analyzer.py "${text}"`);
    if (stderr) {
      console.error('Error from Python script:', stderr);
      return 'An error occurred while processing the text.';
    }
    return stdout;
  } catch (error) {
    console.error('Error executing Python script:', error);
    return 'An error occurred while processing the text.';
  }
}

function processText(text) {
  // Implement your text processing logic here
  // For this example, we'll just return some basic statistics
  const wordCount = text.split(/\s+/).length
  const charCount = text.length
  const sentenceCount = text.split(/[.!?]+/).length

  return `Word count: ${wordCount}
Character count: ${charCount}
Sentence count: ${sentenceCount}

First 100 characters of processed text:
${text.substring(0, 100)}...`
}