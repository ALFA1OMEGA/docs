import { forEachInlineChild } from 'markdownlint-rule-helpers'

import { addFixErrorDetail, getRange, isStringQuoted } from '../helpers/utils.js'

export const imageAltTextEndPunctuation = {
  names: ['GHD002', 'image-alt-text-end-punctuation'],
  description: 'Alternate text for images should end with a punctuation.',
  severity: 'error',
  tags: ['accessibility', 'images'],
  information: new URL('https://github.com/github/docs/blob/main/src/content-linter/README.md'),
  function: function GHD003(params, onError) {
    forEachInlineChild(params, 'image', function forToken(token) {
      const quoteRegex = /[.?!]['"]$/
      const endRegex = /[.?!]$/
      const imageAltText = token.content.trim()
      const range = getRange(token.line, imageAltText)
      if (
        (!imageAltText.endsWith('"') && !imageAltText.slice(-1).match(endRegex)) ||
        (imageAltText.endsWith('"') && !imageAltText.slice(-2).match(quoteRegex))
      ) {
        addFixErrorDetail(onError, token.lineNumber, imageAltText + '.', imageAltText, range, {
          lineNumber: token.lineNumber,
          editColumn: isStringQuoted(imageAltText)
            ? token.line.indexOf(']')
            : token.line.indexOf(']') + 1,
          deleteCount: 0,
          insertText: '.',
        })
      }
    })
  },
}
