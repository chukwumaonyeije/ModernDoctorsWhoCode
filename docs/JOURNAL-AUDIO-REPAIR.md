# Journal discovery and narration repair

November 17, 2026

Regenerated `retire-the-typing-olympics` with the existing configured Fish Audio voice, from the article title and cleaned prose. The source contains no narration directions, so the reported unwanted speech cannot be attributed to prompt leakage from source inspection alone. The replacement is 374.07 seconds and passes a full FFmpeg decode. Subjective listening acceptance remains separate.

The generator now removes HTML comments as well as MDX comments. Forced regeneration preserves the existing MP3 until a nonempty replacement has been written successfully. Regression tests cover production-note removal and preservation of existing audio when the service fails.

Reduced featured articles from 71 to three using the highest existing editorial ranks: the frightening-research-headline article, SMFM 2026, and AI Wardrobe MD. All 68 deselected articles retain identical prose and non-featured metadata. Lists now sort by publication date instead of historical featured ranks. The Journal includes a featured-only selector.

Journal search indexes article body text in addition to titles, descriptions, and tags. Every query word must match, regardless of order; title matches rank above metadata and body matches. Punctuation and accents are normalized. Readers can override relevance with newest or oldest sorting. Queries and filters persist in the URL, Enter submits without navigation, failed index requests can retry, and stale responses cannot replace newer results.

Preservation changes are limited to approved featured metadata and adding protection for the regenerated article and MP3. The protected route manifest is unchanged. PDF binary attributes prevent Windows checkout conversion of ten existing PDFs; their bytes were restored directly from Git and match the existing preservation hashes.

Validation commands: `npm ci`, `npm run check`, `python -X utf8 -m unittest discover -s tests -p test_generate_audio.py`, and `npx playwright test tests/browser/journal.spec.mjs`. Browser coverage includes desktop/mobile body search, URL restoration, Enter, featured filtering, empty states, reset, date sorting, retry after an index failure, and horizontal reflow.

Validation result: all 34 Node tests, both Python tests, the full build/preservation suite, and all four desktop/mobile browser tests passed. Browser verification used matching Chromium with PLAYWRIGHT_CHANNEL=chromium, a worktree-local PLAYWRIGHT_BROWSERS_PATH, and --timeout=60000 --trace=off; installed system browsers could not complete the initial protocol checks.
