export function normalizeString (text) {
  if (!text) return ''

  return text
    .normalize('NFD')
    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
    .split(' ')
    .join(' ')
    .trim() || ''
}

export default normalizeString
