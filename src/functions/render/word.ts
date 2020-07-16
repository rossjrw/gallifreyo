import { Settings, Word, Letter } from '@/types'
import { setRelativeLetterAngle } from '@/functions/relativeAngles'

export function renderWord(
  word: Word,
  radius: number,
  settings: Settings,
): void {
  // for each letter, render it
  word.x = 0
  word.y = 0
  word.radius = radius

  // Filter away null letters
  word.phrases.filter((letter: Letter | null) => letter !== null)
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
  word.phrases.forEach(
    (_: Phrase, subphrase: number) => {
      calculateSubphraseGeometry(
        sentence,
        subphrase,
        sentence.radius!,
        settings.structure,
        relativeAngularSizeSum,
        settings,
      )
      // TODO if subphrase is not word... recurse?
      renderWord(
        sentence.phrases[subphrase],
        subphrase,
      )
    }
  )
}
