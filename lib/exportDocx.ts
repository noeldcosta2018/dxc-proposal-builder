import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  UnderlineType,
} from 'docx'
import { saveAs } from 'file-saver'

interface DocSection {
  heading: string
  content: string
}

function parseMarkdown(md: string): Paragraph[] {
  const lines = md.split('\n')
  const paragraphs: Paragraph[] = []

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (line.startsWith('## ')) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(3).trim(),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 320, after: 160 },
          run: {
            bold: true,
            color: '330072',
            size: 32,
          },
        })
      )
      continue
    }

    if (line.startsWith('### ')) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(4).trim(),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          run: {
            bold: true,
            color: '5F249F',
            size: 26,
          },
        })
      )
      continue
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.slice(2).trim()
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          children: parseInline(text),
          spacing: { before: 60, after: 60 },
        })
      )
      continue
    }

    if (line.trim() === '') {
      paragraphs.push(new Paragraph({ text: '' }))
      continue
    }

    paragraphs.push(
      new Paragraph({
        children: parseInline(line),
        spacing: { before: 80, after: 80 },
      })
    )
  }

  return paragraphs
}

function parseInline(text: string): TextRun[] {
  const runs: TextRun[] = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      runs.push(new TextRun({ text: text.slice(last, match.index), color: '44445a', size: 22 }))
    }
    runs.push(new TextRun({ text: match[1], bold: true, color: '0E1020', size: 22 }))
    last = match.index + match[0].length
  }
  if (last < text.length) {
    runs.push(new TextRun({ text: text.slice(last), color: '44445a', size: 22 }))
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text, color: '44445a', size: 22 }))
  }
  return runs
}

export async function exportSectionDocx(section: DocSection, clientName: string, projectName: string) {
  const header = new Paragraph({
    children: [
      new TextRun({ text: 'DXC Technology', bold: true, color: '5F249F', size: 28 }),
      new TextRun({ text: `  |  ${clientName} - ${projectName}`, color: '969696', size: 22 }),
    ],
    spacing: { after: 320 },
    border: { bottom: { color: 'e2e0dc', space: 1, style: 'single', size: 6 } },
  })

  const doc = new Document({
    sections: [{
      children: [header, ...parseMarkdown(section.content)],
    }],
  })

  const blob = await Packer.toBlob(doc)
  const safe = section.heading.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  saveAs(blob, `${safe}.docx`)
}

export async function exportAllDocx(sections: DocSection[], clientName: string, projectName: string) {
  const header = new Paragraph({
    children: [
      new TextRun({ text: 'DXC Technology', bold: true, color: '5F249F', size: 28 }),
      new TextRun({ text: `  |  ${clientName} - ${projectName}`, color: '969696', size: 22 }),
    ],
    spacing: { after: 320 },
    border: { bottom: { color: 'e2e0dc', space: 1, style: 'single', size: 6 } },
  })

  const children: Paragraph[] = [header]

  sections.forEach((sec, i) => {
    if (i > 0) {
      children.push(new Paragraph({ children: [new PageBreak()] }))
    }
    children.push(...parseMarkdown(sec.content))
  })

  const doc = new Document({
    sections: [{ children }],
  })

  const blob = await Packer.toBlob(doc)
  const safe = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'proposal'
  saveAs(blob, `${safe}_proposal.docx`)
}
