import { isFunction } from "lodash"
import { Settings, Letter } from '@/types'

interface BlockSettings {
  [block: string]: BlockSetting
}

type TypeOrFunc<T> = T | ((letter: Letter, settings: Settings) => T)

interface BlockSetting {
  height?: TypeOrFunc<number>
  full?: TypeOrFunc<boolean>
  relativeAngularSize?: TypeOrFunc<number>
  attached?: TypeOrFunc<boolean>
}

const BLOCK_SETTINGS: BlockSettings = {
  s: {
    height: (_: Letter, settings: Settings) => {
      return settings.config.s.height
    },
    relativeAngularSize: (_: Letter, settings: Settings) => {
      return settings.config.s.width
    },
    full: false,
  },
  p: {
    height: (_: Letter, settings: Settings) => {
      return settings.config.p.height
    },
    relativeAngularSize: (_: Letter, settings: Settings) => {
      return settings.config.p.width
    },
    full: true,
  },
  d: {
    height: (_: Letter, settings: Settings) => {
      return settings.config.d.height
    },
    relativeAngularSize: (_: Letter, settings: Settings) => {
      return settings.config.d.width
    },
    full: false,
  },
  f: {
    height: (_: Letter, settings: Settings) => {
      return settings.config.f.height
    },
    relativeAngularSize: (_: Letter, settings: Settings) => {
      return settings.config.f.width
    },
    full: true,
  },
  v: {
    height: (_: Letter, settings: Settings) => {
      return settings.config.v.height
    },
    attached: (letter: Letter, _: Settings) => {
      return letter.subletters.length === 1
    },
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
