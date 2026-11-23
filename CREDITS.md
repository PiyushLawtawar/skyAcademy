# Credits

## Sound

All sound effects are synthesised at runtime in the browser using the
Web Audio API (`src/lib/sound.ts`) — simple oscillator tones with
gain envelopes. No audio files are bundled or loaded, so there is
nothing to license or credit.

Read-aloud speech is produced on-device via the browser's Web Speech
API (`speechSynthesis`); the voice used depends on what the user's
browser/OS provides.

## Art

All illustrations (Veer the mascot, the pilot avatar, clouds, icons)
are original inline SVG written for this project in
`src/components/*.tsx`. No photographs, copyrighted characters, logos
or third-party image assets are used.

## Fonts

"Baloo 2" and "Nunito", both from Google Fonts (open licenses), loaded
via `index.html`.
