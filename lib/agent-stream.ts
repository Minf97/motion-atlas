// 消费分片事件流
export async function readEventStream(response: Response, onFrame: (frame: string) => void) {
  if (!response.ok) throw new Error("Agent API returned " + response.status)
  if (!response.body) throw new Error("Agent API returned no stream")
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  try {
    while (true) {
      const { value, done } = await reader.read()
      buffer += decoder.decode(value, { stream: !done })
      buffer = buffer.replace(/\r\n/g, "\n")
      let boundary = buffer.indexOf("\n\n")
      while (boundary !== -1) {
        const frame = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)
        onFrame(frame)
        boundary = buffer.indexOf("\n\n")
      }
      if (done) {
        if (buffer.trim()) onFrame(buffer)
        break
      }
    }
  } finally {
    reader.releaseLock()
  }
}
