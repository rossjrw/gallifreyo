import { Letter } from '../src/types'
import { settings } from './mocks'
import { letterDataFromBlock } from '../src/functions/blocks'

describe("block data extractor", () => {
  const Y: Letter = {
    depth: "letter",
    id: 0,
    subletters: [
      {
        depth: "subletter",
        value: "Y",
        block: "f",
      },
    ],
  }
  const A: Letter = {
    depth: "letter",
    id: 0,
    subletters: [
      {
        depth: "subletter",
        value: "A",
        block: "v",
      },
    ],
  }
  settings.config.f.width = 5
  settings.config.f.height = 10
  settings.config.v.height = 20
  letterDataFromBlock(Y, settings)
  letterDataFromBlock(A, settings)
  it("extracts data from a block", () => {
    expect(Y.subletters[0]).toHaveProperty("full", true)
    expect(Y.subletters[0]).toHaveProperty("relativeAngularSize", 5)
    expect(Y.subletters[0]).toHaveProperty("height", 10)
    expect(A.subletters[0]).toHaveProperty("relativeAngularSize", 1)
    expect(A.subletters[0]).toHaveProperty("height", 20)
  })
})
