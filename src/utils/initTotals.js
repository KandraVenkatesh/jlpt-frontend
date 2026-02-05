export function initTotals() {
  const existing = localStorage.getItem("totals");
  if (existing) return;

  // Adjust these numbers to match your data
  const totals = {
    vocab: {
      N5: 650,
      N4: 570,
      N3: 192
    },
    kanji: {
      N5: 96,
      N4: 167,
      N3: 370
    },
    grammar: {
      N5: 84,
      N4: 137,
      N3: 182
    }
  };

  localStorage.setItem("totals", JSON.stringify(totals));
}
