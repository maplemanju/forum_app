export function generateRandomDisplayName(): string {
  const adjectives = [
    'Happy',
    'Lucky',
    'Clever',
    'Bright',
    'Swift',
    'Cool',
    'Gentle',
    'Brave',
  ]
  const nouns = [
    'Panda',
    'Tiger',
    'Eagle',
    'Dolphin',
    'Fox',
    'Wolf',
    'Bear',
    'Lion',
  ]

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  const randomNumber = Math.floor(Math.random() * 1000)

  return `${randomAdjective}${randomNoun}${randomNumber}`
}

export default generateRandomDisplayName
