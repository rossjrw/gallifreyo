import { isFunction } from "lodash"

import { Settings } from '@/types/state'
import { Letter } from '@/types/phrases'

interface BlockSettings {
  [block: string]: BlockSetting
}

type BlockFunc<T> = (letter: Letter, settings: Settings) => T

interface BlockSetting {
  height?: BlockFunc<number>
  full?: BlockFunc<boolean>
  relativeAngularSize: BlockFunc<number>
  attached?: BlockFunc<boolean>
}

const BLOCK_SETTINGS: BlockSettings = {
  s: {
    height: (_letter, settings) => settings.config.s.height,
    relativeAngularSize: (_letter, settings) => settings.config.s.width,
    full: (_letter, _settings) => false,
  },
  p: {
    height: (_letter, settings) => settings.config.p.height,
    relativeAngularSize: (_letter, settings) => settings.config.p.width,
    full: (_letter, _settings) => true,
  },
  d: {
    height: (_letter, settings) => settings.config.d.height,
    relativeAngularSize: (_letter, settings) => settings.config.d.width,
    full: (_letter, _settings) => false,
  },
  f: {
    height: (_letter, settings) => settings.config.f.height,
    relativeAngularSize: (_letter, settings) => settings.config.f.width,
    full: (_letter, _settings) => true,
  },
  v: {
    height: (_letter, settings) => settings.config.v.height,
    relativeAngularSize: (_letter, _settings) => 1,
  },
  buffer: {
    relativeAngularSize: (_letter, settings) => settings.config.buffer.letter
  },
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
