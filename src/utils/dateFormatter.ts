import dayjs from 'dayjs'

export const fromNowShort = (date: Date) => {
  const timeString = dayjs(date).fromNow()

  const replacements = {
    ' seconds': 'sec',
    second: 'sec',
    ' minutes': 'min',
    minute: 'min',
    ' hours': 'hr',
    hour: 'hr',
    ' days': 'd',
    day: 'd',
    ' months': 'mo',
    month: 'mo',
    ' years': 'yr',
    year: 'yr',
    'a few': 'few ',
    'an ': '1',
    'a ': '1',
  }

  return Object.entries(replacements).reduce(
    (result, [search, replace]) => result.replace(search, replace),
    timeString
  )
}
