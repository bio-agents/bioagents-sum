import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsdocx from 'jsdocx'
import * as R from 'ramda'

function s2ab (s) {
  let buf = new ArrayBuffer(s.length)
  let view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

function saveXlsx (data) {
  let workSheet = XLSX.utils.json_to_sheet(data)

  let workBook = { SheetNames: ['sheet1'], Sheets: { 'sheet1': workSheet } }

  /* bookType can be any supported output type */
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' }

  const wbout = XLSX.write(workBook, wopts)

  /* the saveAs call downloads a file on the local machine */
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'generated.xlsx')
}

export function generateXlsx (pickedListOfAgents, values) {
  pickedListOfAgents = R.map(agent => R.compose(
    R.dissoc('name'),
    R.assoc('Name', agent.name),
  )(agent), pickedListOfAgents)

  if (!values.includeProps.includes('agentType')) {
    pickedListOfAgents = R.map(R.omit(['agentType']), pickedListOfAgents)
  } else {
    pickedListOfAgents = R.map(agent => R.compose(
      R.dissoc('agentType'),
      R.assoc('Agent type', R.join(', ', agent.agentType)),
    )(agent), pickedListOfAgents)
  }

  if (!values.includeProps.includes('institute')) {
    pickedListOfAgents = R.map(R.omit(['credit']), pickedListOfAgents)
  } else {
    pickedListOfAgents = R.map(agent => R.compose(
      R.dissoc('credit'),
      R.assoc('Institute', R.join('\n ', R.pluck('name', agent.credit))),
    )(agent), pickedListOfAgents)
  }

  if (!values.includeProps.includes('description')) {
    pickedListOfAgents = R.map(R.omit(['description']), pickedListOfAgents)
  } else {
    pickedListOfAgents = R.map(agent => R.compose(
      R.dissoc('description'),
      R.assoc('Description', agent.description),
    )(agent), pickedListOfAgents)
  }

  if (!values.includeProps.includes('publication')) {
    pickedListOfAgents = R.map(R.omit(['publicationsStrings']), pickedListOfAgents)
  } else {
    pickedListOfAgents = R.map(agent => R.compose(
      R.dissoc('publicationsStrings'),
      R.assoc('Publications', R.join('\n ', agent.publicationsStrings || [])),
    )(agent), pickedListOfAgents)
  }

  if (!values.includeProps.includes('citations')) {
    pickedListOfAgents = R.map(R.omit(['citations']), pickedListOfAgents)
  } else {
    pickedListOfAgents = R.map(agent => R.compose(
      R.dissoc('citations'),
      R.assoc('Citations', agent.citations),
    )(agent), pickedListOfAgents)
  }

  if (!values.includeProps.includes('topic')) {
    pickedListOfAgents = R.map(R.omit(['topic']), pickedListOfAgents)
  } else {
    pickedListOfAgents = R.map(agent => R.compose(
      R.dissoc('topic'),
      R.assoc('Topic', R.join(', ', R.pluck('term', agent.topic))),
    )(agent), pickedListOfAgents)
  }

  if (!values.includeProps.includes('function')) {
    pickedListOfAgents = R.map(R.omit(['function']), pickedListOfAgents)
  } else {
    pickedListOfAgents = R.map(agent => R.compose(
      R.dissoc('function'),
      R.assoc('Function', R.join(', ', R.pluck('term', agent.function))),
    )(agent), pickedListOfAgents)
  }

  if (!values.includeProps.includes('maturity')) {
    pickedListOfAgents = R.map(R.omit(['maturity']), pickedListOfAgents)
  } else {
    pickedListOfAgents = R.map(agent => R.compose(
      R.dissoc('maturity'),
      R.assoc('Maturity', agent.maturity),
    )(agent), pickedListOfAgents)
  }

  if (!values.includeProps.includes('platform')) {
    pickedListOfAgents = R.map(R.omit(['operatingSystem']), pickedListOfAgents)
  } else {
    pickedListOfAgents = R.map(agent => R.compose(
      R.dissoc('operatingSystem'),
      R.assoc('Platform', R.join(', ', agent.operatingSystem)),
    )(agent), pickedListOfAgents)
  }

  saveXlsx(pickedListOfAgents)
}

export function generateDocx (data, includeProps) {
  let doc = new jsdocx.Document()

  data.forEach(item => {
    // Name
    let nameRun = doc.addParagraph().addRun()
    nameRun.addText(item.name)
    let nameFormat = nameRun.addFormat()
    nameFormat.addFonts().setAscii('Calibri')
    nameFormat.addBold()

    // Agent type BEGIN
    if (includeProps.includes('agentType') && item.agentType && item.agentType.length > 0) {
      let agentTypeParagraph = doc.addParagraph()
      // Agent type title
      let agentTypeTitleRun = agentTypeParagraph.addRun()
      agentTypeTitleRun.addText('Agent type: ')
      let agentTypeTitleFormat = agentTypeTitleRun.addFormat()
      agentTypeTitleFormat.addFonts().setAscii('Calibri')
      agentTypeTitleFormat.addBold()
      // Agent type text
      let agentTypeTextRun = agentTypeParagraph.addRun()
      item.agentType.forEach((agentTypeItem, index) =>
        index + 1 < item.agentType.length
          ? agentTypeTextRun.addText(`${agentTypeItem}, `)
          : agentTypeTextRun.addText(`${agentTypeItem}.`)
      )
      let agentTypeTextFormat = agentTypeTextRun.addFormat()
      agentTypeTextFormat.addFonts().setAscii('Calibri')
    }
    // Agent type END

    // Institute BEGIN
    if (includeProps.includes('institute')) {
      let instituteParagraph = doc.addParagraph()
      // Institute title
      let instituteTitleRun = instituteParagraph.addRun()
      instituteTitleRun.addText('Institute: ')
      let instituteTitleFormat = instituteTitleRun.addFormat()
      instituteTitleFormat.addFonts().setAscii('Calibri')
      instituteTitleFormat.addBold()
      // Institute text
      let instituteTextRun = instituteParagraph.addRun()
      item.credit.forEach((instituteItem, index) =>
        index + 1 < item.credit.length
          ? instituteTextRun.addText(`${instituteItem.name}; `)
          : instituteTextRun.addText(`${instituteItem.name}.`)
      )
      let instituteTextFormat = instituteTextRun.addFormat()
      instituteTextFormat.addFonts().setAscii('Calibri')
    }
    // Institute END

    // Description BEGIN
    if (includeProps.includes('description')) {
      let descriptionParagraph = doc.addParagraph()
      // Description title
      let descriptionTitleRun = descriptionParagraph.addRun()
      descriptionTitleRun.addText('Description: ')
      let descriptionTitleFormat = descriptionTitleRun.addFormat()
      descriptionTitleFormat.addFonts().setAscii('Calibri')
      descriptionTitleFormat.addBold()
      // Description text
      let descriptionTextRun = descriptionParagraph.addRun()
      descriptionTextRun.addText(item.description)
      let descriptionTextFormat = descriptionTextRun.addFormat()
      descriptionTextFormat.addFonts().setAscii('Calibri')
    }
    // Description END

    // Publications BEGIN
    if (includeProps.includes('publication')) {
      const publicationParagraph = doc.addParagraph()
      // Publications title
      const publicationTitleRun = publicationParagraph.addRun()
      publicationTitleRun.addText('Publications: ')
      const publicationsTitleFormat = publicationTitleRun.addFormat()
      publicationsTitleFormat.addFonts().setAscii('Calibri')
      publicationsTitleFormat.addBold()
      // Publications text
      if (item.publicationsStrings && item.publicationsStrings.length > 0) {
        item.publicationsStrings.forEach((publicationString) => {
          const publicationsTextRun = doc.addParagraph().addRun()
          publicationsTextRun.addFormat().addFonts().setAscii('Calibri')
          return publicationsTextRun.addText(publicationString)
        })
      } else {
        const publicationsTextRun = publicationParagraph.addRun()
        publicationsTextRun.addFormat().addFonts().setAscii('Calibri')
        publicationsTextRun.addText('No publication info')
      }
    }
    // Publication END

    // Citations BEGIN
    if (includeProps.includes('citations') && item.citations) {
      let citationsParagraph = doc.addParagraph()
      // Citations title
      let citationsTitleRun = citationsParagraph.addRun()
      citationsTitleRun.addText('Total citations: ')
      let citationsTitleFormat = citationsTitleRun.addFormat()
      citationsTitleFormat.addFonts().setAscii('Calibri')
      citationsTitleFormat.addBold()
      // Citations text
      let citationsTextRun = citationsParagraph.addRun()
      citationsTextRun.addText(`${item.citations}.`)
      let citationsTextFormat = citationsTextRun.addFormat()
      citationsTextFormat.addFonts().setAscii('Calibri')
    }
    // Citations END

    // Topic BEGIN
    if (includeProps.includes('topic') && item.topic && item.topic.length > 0) {
      let topicParagraph = doc.addParagraph()
      // Topic title
      let topicTitleRun = topicParagraph.addRun()
      topicTitleRun.addText('Topic: ')
      let topicTitleFormat = topicTitleRun.addFormat()
      topicTitleFormat.addFonts().setAscii('Calibri')
      topicTitleFormat.addBold()
      // Topic text
      let topicTextRun = topicParagraph.addRun()
      item.topic.forEach((topicItem, index) =>
        index + 1 < item.topic.length
          ? topicTextRun.addText(`${topicItem.term}, `)
          : topicTextRun.addText(`${topicItem.term}.`)
      )
      let topicTextFormat = topicTextRun.addFormat()
      topicTextFormat.addFonts().setAscii('Calibri')
    }
    // Topic END

    // Topic BEGIN
    if (includeProps.includes('function') && item.function && item.function.length > 0) {
      let functionParagraph = doc.addParagraph()
      // Topic title
      let functionTitleRun = functionParagraph.addRun()
      functionTitleRun.addText('Function: ')
      let functionTitleFormat = functionTitleRun.addFormat()
      functionTitleFormat.addFonts().setAscii('Calibri')
      functionTitleFormat.addBold()
      // Topic text
      let functionTextRun = functionParagraph.addRun()
      item.function.forEach((functionItem, index) =>
        index + 1 < item.function.length
          ? functionTextRun.addText(`${functionItem.operation[0].term}, `)
          : functionTextRun.addText(`${functionItem.operation[0].term}.`)
      )
      let functionTextFormat = functionTextRun.addFormat()
      functionTextFormat.addFonts().setAscii('Calibri')
    }
    // Topic END

    // Maturity BEGIN
    if (includeProps.includes('maturity') && item.maturity) {
      let maturityParagraph = doc.addParagraph()
      // Maturity title
      let maturityTitleRun = maturityParagraph.addRun()
      maturityTitleRun.addText('Maturity: ')
      let maturityTitleFormat = maturityTitleRun.addFormat()
      maturityTitleFormat.addFonts().setAscii('Calibri')
      maturityTitleFormat.addBold()
      // Maturity text
      let maturityTextRun = maturityParagraph.addRun()
      maturityTextRun.addText(`${item.maturity}.`)
      let maturityTextFormat = maturityTextRun.addFormat()
      maturityTextFormat.addFonts().setAscii('Calibri')
    }
    // Maturity END

    // Platform BEGIN
    if (includeProps.includes('platform') && item.operatingSystem && item.operatingSystem.length > 0) {
      let platformParagraph = doc.addParagraph()
      // Platform title
      let platformTitleRun = platformParagraph.addRun()
      platformTitleRun.addText('Platform: ')
      let platformTitleFormat = platformTitleRun.addFormat()
      platformTitleFormat.addFonts().setAscii('Calibri')
      platformTitleFormat.addBold()
      // Platform text
      let platformTextRun = platformParagraph.addRun()
      item.operatingSystem.forEach((osItem, index) =>
        index + 1 < item.operatingSystem.length
          ? platformTextRun.addText(`${osItem}, `)
          : platformTextRun.addText(`${osItem}.`)
      )
      let platformTextFormat = platformTextRun.addFormat()
      platformTextFormat.addFonts().setAscii('Calibri')
    }
    // Platform END

    // Empty line
    doc.addParagraph().addRun().addBreak()
  })

  doc.generate().then((content) => {
    saveAs(content, 'generated.docx')
  })
}
