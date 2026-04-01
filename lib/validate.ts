/** Validate text input for AI checks */
export function validateTextInput(
  text: unknown,
  maxLength: number
): string | null {
  if (typeof text !== "string") return "text must be a string";
  if (text.trim().length === 0) return "text cannot be empty";
  if (text.length > maxLength)
    return `text exceeds maximum length of ${maxLength.toLocaleString()} characters`;
  return null;
}
