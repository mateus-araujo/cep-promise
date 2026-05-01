export function isNumberAtComplementPattern (complement, number) {
  if (!complement || !number) return false;

  const num = Number(number);
  const complementStr = String(complement);

  // Check for exact number: "123"
  if (complementStr.includes(String(number))) {
    return true;
  }

  // Check for range patterns like "de 100 ao fim" or "de 100/200"
  const rangeMatch = complementStr.match(/de\s+(\d+)\s+(?:ao|até)\s+(\d+|fim)/i);
  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = rangeMatch[2] === 'fim' ? Infinity : Number(rangeMatch[2]);
    return num >= start && num <= end;
  }

  // Check for simple range like "100-200" or "100/200"
  const simpleRange = complementStr.match(/(\d+)\s*[-\/]\s*(\d+)/);
  if (simpleRange) {
    const start = Number(simpleRange[1]);
    const end = Number(simpleRange[2]);
    return num >= start && num <= end;
  }

  return false;
}
