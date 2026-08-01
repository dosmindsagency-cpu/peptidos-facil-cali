# PF BioVerse hero asset slots

Homepage V1 keeps its existing CSS background when the approved PF BioVerse artwork is unavailable. The optional image slots below are intentionally empty until official assets are supplied.

## Desktop

- **Path:** `/public/bioverso/hero/hero-anatomy-desktop.webp`
- **Required dimensions:** 2400 × 1400 px minimum; 2880 × 1680 px preferred
- **Aspect ratio:** 12:7 (approximately 1.714:1)
- **Safe area:** keep the human subject and all high-contrast detail in the right 42% of the frame; the left 42% is reserved for hero copy
- **Negative space:** left 42%, especially the upper-left quadrant, should remain low-detail and dark enough for white text
- **Recommended file-size limit:** 450 KB, maximum 700 KB
- **Object position:** `72% center`
- **Use:** desktop layouts at 1024 px and wider

## Mobile

- **Path:** `/public/bioverso/hero/hero-anatomy-mobile.webp`
- **Required dimensions:** 1170 × 1500 px minimum; 1440 × 1846 px preferred
- **Aspect ratio:** 39:50 (approximately 0.78:1)
- **Safe area:** keep the human subject in the upper-right-to-center region; preserve the lower 30% for the hero transition and avoid placing important detail behind the Pep panel
- **Negative space:** left 58% in the upper half for the eyebrow, headline, and supporting copy
- **Recommended file-size limit:** 300 KB, maximum 500 KB
- **Object position:** `78% center`
- **Use:** mobile and tablet layouts below 1024 px

When either file is added, the homepage renders it with `next/image`, responsive sizing, and readability masks. Until then, the existing CSS background remains the complete fallback. No replacement artwork or stock imagery is included.
