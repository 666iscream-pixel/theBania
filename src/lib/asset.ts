// Ścieżka do pliku z /public z uwzględnieniem podkatalogu (GitHub Pages: /theBania).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => `${BASE_PATH}${p}`;
