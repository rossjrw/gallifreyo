import { BlockName } from '@/types/alphabets'
import { Settings } from '@/types/state'
import { Letter } from '@/types/phrases'

type BlockSetting = {
  height?: number
  full?: boolean
  relativeAngularSize: number
}

type BlockSettings = {
  [block in BlockName]: BlockSetting
}

export function letterDataFromBlock(
  letter: Letter,
  settings: Settings,
): void {
  /**
   * Takes a letter with tokenised subletters (i.e. subletters that do not yet
   * have intermediary data attached to them). Then, from their block (which
   * was always a placeholder to represent later configuration), supply that
   * block's configuration.
   *
   * Attaches intermediary data to subletters. Modifies letter in place.
   *
   * @param letter: The letter to be given block data.
   * @returns void; modifies letters in place.
   */

  const BLOCK_SETTINGS: BlockSettings = {
    s: {
      height: settings.config.s.height,
      relativeAngularSize: settings.config.s.width,
      full: false,
    },
    p: {
      height: settings.config.p.height,
      relativeAngularSize: settings.config.p.width,
      full: true,
    },
    d: {
      height: settings.config.d.height,
      relativeAngularSize: settings.config.d.width,
      full: false,
    },
    f: {
      height: settings.config.f.height,
      relativeAngularSize: settings.config.f.width,
      full: true,
    },
    v: {
      height: settings.config.v.height,
      relativeAngularSize: 1,
    },
    buffer: {
      relativeAngularSize: settings.config.buffer.letter
    },
  }

  // Note that Letters do not have a block - subletters do.
  // A letter can be null, but null letters should not be passed to this
  // function.
  letter.subletters = letter.subletters.map(subletter => {
    const blockSetting = BLOCK_SETTINGS[subletter.block]
    return {
      ...subletter,
      ...blockSetting,
    }
  })
}
