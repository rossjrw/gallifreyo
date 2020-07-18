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

  // Filter away null letters
  remove(word.phrases, (letter: Letter | null) => letter === null)
  // Assign relative angles to each subphrase
  word.phrases.forEach((letter: Letter | null) => {
    setRelativeLetterAngle(letter!, settings)
  })
  // XXX this is messy - may be an idea to disallow null letters from the
  // start?

  // Calculate the sum of the relative angles
  // Note that this calculation does not include buffers
  // Also note that a letter's relative angle is held by its first subletter
  const relativeAngularSizeSum = word.phrases.reduce(
    (total: number, letter: Letter | null) => {
      return total + letter!.subletters[0].relativeAngularSize!
    }, 0
  )

  // Convert relative angles to absolute angles (radians)
  word.phrases.forEach((letter: Letter | null) => {
    letter!.subletters[0].absoluteAngularSize = (
      letter!.subletters[0].relativeAngularSize! * 2 * Math.PI / relativeAngularSizeSum
    )
  })

  // Calculate the absolute angle subtended by a single vowel (why?)
  const vAngle = settings.config.v.a * 2 * Math.PI / relativeAngularSizeSum

  // for(let l = 0; l < word.letters.length; l++){
  //   // B is the sum of all previous letter angles and their buffers
  //   var B;
  //   if(l === 0){
  //     B = 0;
  //   } else if(l >= 1){
  //     B = angles[l-1]/2 + /*angles[l-1] +*/ angles[l]/2 + B;
  //   }
  //   renderLetter(word.letters[l],s_,w_,l,angles[l],vAngle,radius);

  //   word.letters[l].d = word.letters[l][0].path;
  //   word.letters[l].transform = ["rotate(",B.toDeg(),",",0,",",radius,")"].join("");
  // }

  // Assign positions and calculate the size of each subphrase, and then render
  // them
  console.log("NEW", JSON.parse(JSON.stringify(word.phrases)))
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
        // XXX convert to absolute?
      )
      console.log(index, angularLocation)
      renderLetter(
        letter!,
        angularLocation,
        vAngle,
        word.radius!,
      )
      angularLocation = angularLocation * 180 / Math.PI
      letter!.transform = `rotate(${angularLocation}, 0, ${word.radius})`
    }
  )
}
