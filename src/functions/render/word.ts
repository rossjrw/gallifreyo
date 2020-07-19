import { remove, sum } from "lodash"
import { Settings, Word, Letter } from '@/types'
import { setRelativeLetterAngle } from '@/functions/setAngles'
import { renderLetter } from '@/functions/render/letter'

export function renderWord(
  word: Word,
  settings: Settings,
): void {
  // XXX a lot of this function is very similar to geometry.ts
  // for each letter, render it
  word.x = 0
  word.y = 0
  // Word should have radius already from geometry.ts
  // word.radius = radius

  // Assign relative angles to each subphrase
  word.phrases.forEach((letter: Letter) => {
    setRelativeLetterAngle(letter, settings)
  })

  // Calculate the sum of the relative angles
  // Note that buffers are their own letters, so do not need to be excepted
  // Also note that a letter's relative angle is held by its first subletter
  const relativeAngularSizeSum = word.phrases.reduce(
    (total: number, letter: Letter) => {
      return total + letter.subletters[0].relativeAngularSize!
    }, 0
  )

  // Convert relative angles to absolute angles (radians)
  word.phrases.forEach((letter: Letter) => {
    letter.subletters[0].absoluteAngularSize = (
      letter.subletters[0].relativeAngularSize! * 2 * Math.PI / relativeAngularSizeSum
    )
  })

  // Calculate the absolute angle subtended by a single vowel, so that it is
  // consistent across the entire word
  const vAngle = settings.config.v.a * 2 * Math.PI / relativeAngularSizeSum

  // Assign positions and calculate the size of each subphrase, and then render
  // them
  word.phrases.forEach(
    // XXX this is the same bit of code used in geometry; should consolidate
    // Sum the angles of the letters so far
    // Do not need to include buffer distance spefically, because the buffers
    // already exist as phantom letters
    (letter: Letter, index: number) => {
      let angularLocation = (
        word.phrases.slice(0, index + 1).reduce(
          (total: number, letter: Letter) => {
            return total + letter.subletters[0].absoluteAngularSize!
          }, 0
        )
        - (word.phrases[0].subletters[0].absoluteAngularSize! / 2)
        - (word.phrases[index].subletters[0].absoluteAngularSize! / 2)
      )
      renderLetter(
        letter!,
        vAngle,
        word.radius!,
      )
      angularLocation = angularLocation * 180 / Math.PI
      letter!.transform = `rotate(${angularLocation}, 0, ${word.radius})`
    }
  )
}
