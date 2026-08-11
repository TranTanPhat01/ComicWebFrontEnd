/**
 * Cleans up chapter titles by removing any duplicated "Chương X" prefix.
 * 
 * E.g.:
 * - getCleanChapterTitle(1, "Chương 1") -> ""
 * - getCleanChapterTitle(1, "Chương 1: Khởi đầu") -> "Khởi đầu"
 * - getCleanChapterTitle(2, "Chương 02 - Sóng gió") -> "Sóng gió"
 * - getCleanChapterTitle(3, "Trận chiến cuối") -> "Trận chiến cuối"
 */
export function getCleanChapterTitle(number: number, title?: string | null): string {
  if (!title) return "";

  const cleanTitle = title.trim();

  // Matches "Chương <number>", "chuong <number>", "CHƯƠNG <number>"
  // with possible decimal suffix like 1.5, letter suffix like 1a,
  // and trailing colons, hyphens, spaces, or dashes.
  const prefixRegex = /^(ch[ưu]ong\s+\d+(\.\d+)?([a-zA-Z])?[\s-:]*)/i;

  if (prefixRegex.test(cleanTitle)) {
    const stripped = cleanTitle.replace(prefixRegex, "").trim();
    // Clean any residual leading symbols like ": ", "- ", etc.
    return stripped.replace(/^[\s-:]+/, "").trim();
  }

  return cleanTitle;
}
