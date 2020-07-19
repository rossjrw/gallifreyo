import { isFunction } from "lodash"
import { Settings, Letter } from '@/types'

interface BlockSettings {
  [block: string]: BlockSetting
}

type TypeOrFunc<T> = T | ((letter: Letter, settings: Settings) => T)

interface BlockSetting {
  b?: TypeOrFunc<number>
  full?: TypeOrFunc<boolean>
  relativeAngularSize?: TypeOrFunc<number>
  attached?: TypeOrFunc<boolean>
}

const BLOCK_SETTINGS: BlockSettings = {
  s: {
    b: (_: Letter, settings: Settings) => settings.config.s.b,
    full: false,
    relativeAngularSize: (_: Letter, settings: Settings) => settings.config.s.a,
  },
  p: {
    b: (_: Letter, settings: Settings) => settings.config.p.b,
    full: true,
    relativeAngularSize: (_: Letter, settings: Settings) => settings.config.p.a,
  },
  d: {
    b: (_: Letter, settings: Settings) => settings.config.d.b,
    full: false,
    relativeAngularSize: (_: Letter, settings: Settings) => settings.config.d.a,
  },
  f: {
    b: (_: Letter, settings: Settings) => settings.config.f.b,
    full: true,
    relativeAngularSize: (_: Letter, settings: Settings) => settings.config.f.a,
  },
  v: {
    b: (_: Letter, settings: Settings) => settings.config.v.b,
    attached: (letter: Letter, _: Settings) => letter.subletters.length === 1,
    relativeAngularSize: 1,
    // there was buffer property but I'm not sure what it did
  },
  buffer: {
    relativeAngularSize: (_: Letter, settings: Settings) => {
      return settings.config.buffer.letter
    }
  },
  // There used to be a default case where an unknown letter would be given a
  // default block. In the new system unknown letters are represented by null
  // and they should be ignored.
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
  // Note that Letters do not have a block - subletters do.
  // A letter can be null, but null letters should not be passed to this
  // function.
  for (const subletter of letter.subletters) {
    for (const [property, value] of
         Object.entries(BLOCK_SETTINGS[subletter.block])) {
      // This is the part that requires [_: string]: unknown on Subletter
      if (isFunction(value)) {
        subletter[property] = value(letter, settings)
      } else {
        subletter[property] = value
      }
    }
  }
}
