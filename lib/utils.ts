export async function processText(text: string, file: File | null): Promise<string> {
    const formData = new FormData()
  
    if (file) {
      formData.append('file', file)
    } else {
      formData.append('text', text)
    }
  
    const response = await fetch('/api/process-text', {
      method: 'POST',
      body: formData,
    })
  
    if (!response.ok) {
      throw new Error('Failed to process text')
    }
  
    const data = await response.json()
    return data.result
  }