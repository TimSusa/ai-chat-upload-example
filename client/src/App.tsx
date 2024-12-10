import './App.css'
import { PdfUploaderWithQuestion } from './PdfUploaderWithQuestion'
import SSEClient from './ServerSentEvents'

function App() {

  return (
    <>
      <PdfUploaderWithQuestion />
      <SSEClient url="http://localhost:3001/sse" title="Server-Sent Events" />
    </>
  )
}

export default App
