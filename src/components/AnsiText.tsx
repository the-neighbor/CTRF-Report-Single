import React from 'react'

type AnsiCode = {
  code: number
  type: 'foreground' | 'background' | 'style'
}

const ansiToStyle = (codes: AnsiCode[]): React.CSSProperties => {
  const style: React.CSSProperties = {}

  codes.forEach(({ code, type }) => {
    if (type === 'foreground') {
      if (code >= 30 && code <= 37) {
        const colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
        style.color = colors[code - 30]
      } else if (code >= 90 && code <= 97) {
        const colors = ['gray', 'lightred', 'lightgreen', 'lightyellow', 'lightblue', 'lightmagenta', 'lightcyan', 'white']
        style.color = colors[code - 90]
      }
    } else if (type === 'background') {
      if (code >= 40 && code <= 47) {
        const colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
        style.backgroundColor = colors[code - 40]
      } else if (code >= 100 && code <= 107) {
        const colors = ['gray', 'lightred', 'lightgreen', 'lightyellow', 'lightblue', 'lightmagenta', 'lightcyan', 'white']
        style.backgroundColor = colors[code - 100]
      }
    } else if (type === 'style') {
      switch (code) {
        case 0: // Reset
          return {}
        case 1:
          style.fontWeight = 'bold'
          break
        case 3:
          style.fontStyle = 'italic'
          break
        case 4:
          style.textDecoration = 'underline'
          break
      }
    }
  })

  return style
}

const parseAnsiString = (str: string) => {
  const regex = /\u001b\[(\d+)m/g
  const segments: { text: string; codes: AnsiCode[] }[] = []
  let lastIndex = 0
  let currentCodes: AnsiCode[] = []
  let match

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: str.slice(lastIndex, match.index),
        codes: [...currentCodes],
      })
    }

    const code = parseInt(match[1], 10)
    let type: AnsiCode['type'] = 'style'

    if ((code >= 30 && code <= 37) || (code >= 90 && code <= 97)) {
      type = 'foreground'
    } else if ((code >= 40 && code <= 47) || (code >= 100 && code <= 107)) {
      type = 'background'
    }

    if (code === 0) {
      currentCodes = []
    } else {
      currentCodes = currentCodes.filter(c => c.type !== type)
      currentCodes.push({ code, type })
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < str.length) {
    segments.push({
      text: str.slice(lastIndex),
      codes: currentCodes,
    })
  }

  return segments.filter(segment => segment.text.length > 0)
}

export default function AnsiText({ text }: { text: string }) {
  const segments = parseAnsiString(text)

  return (
    <pre className="font-mono p-4 bg-gray-100 rounded-lg overflow-x-auto">
      {segments.map((segment, index) => (
        <span key={index} style={ansiToStyle(segment.codes)}>
          {segment.text}
        </span>
      ))}
    </pre>
  )
}