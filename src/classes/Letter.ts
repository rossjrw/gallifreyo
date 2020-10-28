class Letter {
  depth: "letter"
  // Token properties
  id: string | number
  subletters: Subletter[]
  // Render properties
  height?: number
  angularLocation?: number
  // Drawing properties
  paths?: Path[]
  transform?: string
}

class Subletter extends LetterData {
  depth: "subletter"
  // Render properties
  height?: number
  full?: boolean // Circle is full or cut off by word line
  relativeAngularSize?: number
  absoluteAngularSize?: number
}
