'use client'

import { useState } from 'react'
import { Upload, FileText, File, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { processText } from '@/lib/utils'

export default function TextProcessor() {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState('')

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    setProcessing(true)
    try {
      const result = await processText(text, file)
      setResult(result)
    } catch (error) {
      console.error('Error processing text:', error)
      setResult('An error occurred while processing the text.')
    }
    setProcessing(false)
  }

  return (
    <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Creative Text Processor</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="document">Document Upload</TabsTrigger>
            <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <Textarea
              placeholder="Enter your text here..."
              className="min-h-[200px] resize-none"
              value={text}
              onChange={handleTextChange}
            />
          </TabsContent>
          <TabsContent value="document">
            <Label htmlFor="document-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Upload a document
                </span>
              </div>
              <Input
                id="document-upload"
                type="file"
                className="hidden"
                accept=".doc,.docx,.txt"
                onChange={handleFileChange}
              />
            </Label>
          </TabsContent>
          <TabsContent value="pdf">
            <Label htmlFor="pdf-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <File className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Upload a PDF
                </span>
              </div>
              <Input
                id="pdf-upload"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Label>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {file ? `Selected file: ${file.name}` : 'No file selected'}
        </div>
        <Button onClick={handleSubmit} disabled={processing}>
          {processing ? (
            'Processing...'
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Process Text
            </>
          )}
        </Button>
      </CardFooter>
      {result && (
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Processing Result:</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{result}</pre>
        </CardContent>
      )}
    </Card>
  )
}