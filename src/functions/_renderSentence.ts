import { Settings, Phrase, Sentence } from '@/types'
import { setRelativePhraseAngle } from '@/functions/relativeAngles'

export function renderSentence(
  sentence: Sentence,
  settings: Settings,
): void {
  // Coordinates of the middle of this sentence
  // TODO determine by argument
  sentence.x = 0
  sentence.y = 0
  sentence.radius = 100 // TODO determine by angular subtension

  // Assign relative angles to each subphrase
  sentence.phrases.forEach((phrase: Phrase) => {
    return setRelativePhraseAngle(phrase, settings)
  })
  let angles: number[] = sentence.phrases.map((phrase: Phrase) => {
    return phrase.relativeAngle ?? 1
  })

  // Calculate the sum of the relative angles
  // Note that this calculation includes buffers between letters, which at this
  // point do not yet exist
  const relativeAngleSum = angles.reduce((a, b) => a + b, 0) +
    (settings.config.buffer.word * sentence.phrases.length)

  // Convert relative angles to absolute angles (radians)
  angles = angles.map(angle => angle * 2 * Math.PI / relativeAngleSum)

  for(let w = 0; w < sentence.words.length; w++){
    var B;
    if(w === 0){
      B = 0;
    } else {
      B = angles[w-1]/2 +
        (settings.config.buffer.word * 2 * Math.PI / relativeAngleSum) +
        angles[w]/2 +
        B;
    }
    // B is the angular distance from k_alpha to k_0
    //renderWord(phrase.words[w],s_,w,wordRadius); this gets called in switchStructure
    // output is in word.letters[l].d and word.letters[l].path
    // having said that, this isn't even relevant because ngRepeat
    switchStructure(w,sentence.radius,angles,host.structure.sentence,relativeAngleSum,B);
  }
}
