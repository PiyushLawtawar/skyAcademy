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

Veer the mascot, the pilot avatar, clouds, icons, and the aircraft
silhouettes used in the "Spot the Shape" game are original inline SVG
written for this project in `src/components/*.tsx`. No copyrighted
characters or logos are used anywhere.

## Photos (real aircraft/missile photography)

`public/aircraft-photos/` holds real photographs of real aircraft and
missiles, used starting with Stage 4 (India's Hangar of Fame) and in
the Stage 1 hardpoints/missiles lesson. **This is a deliberate exception
to "original art only"** for these specific photos, made at the project
owner's request — see the conversation history for that decision. Every
photo below is sourced from Wikimedia Commons under a licence that
permits reuse, and is credited here as that licence requires (CC BY,
CC BY-SA and GFDL all require attribution; Public Domain, CC0 and
GODL-India do not strictly require it, but are credited anyway as good
practice). Source links go to the Commons file page, which has the
full licence text.

| File | Subject | Credit | Licence | Source |
|---|---|---|---|---|
| `tejas.jpg` | HAL Tejas | Government of India | GODL-India | [Commons](https://commons.wikimedia.org/wiki/File:Tejas_MK1_in_service_for_7_years.jpg) |
| `su30mki.jpg` | Su-30MKI | Chris Lofting | GFDL 1.2 | [Commons](https://commons.wikimedia.org/wiki/File:Indian_Air_Force_Sukhoi_Su-30MKI_Lofting-3.jpg) |
| `rafale.jpg` | Rafale | Dylan Agbagni | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Indian_Air_Force_Rafale.jpg) |
| `c17.jpg` | C-17 Globemaster III | SD Singh | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:C_17_Globemaster_of_Indian_Air_Force.jpg) |
| `dhruv.jpg` | ALH Dhruv | Arpingstone | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Indian_air_force_dhruv_helicopter_j4042_arp.jpg) |
| `pc7.jpg` | Pilatus PC-7 Mk II | Nisarg Vyas | GFDL 1.2 | [Commons](https://commons.wikimedia.org/wiki/File:Pilatus_PC-7_Mk_II_of_Indian_Air_Force_en_route_to_Dundigal_AFA,_Hyderabad.PNG) |
| `hawk.jpg` | Hawk Mk132 / Surya Kiran | Government of India | GODL-India | [Commons](https://commons.wikimedia.org/wiki/File:IAF_Surya_Kiran_Aero_India_2023.jpg) |
| `il78.jpg` | Il-78 (MARS) | SSgt Matthew Hannen, USAF | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Indian_Air_Force_Ilyushin_Il-78MKI.jpg) |
| `mig21.jpg` | MiG-21 Bison | Sanil Nath | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Indian_Air_Force_MiG-21_Bison_landing.jpg) |
| `netra.jpg` | Netra AEW&C | Indian Air Force | GODL-India | [Commons](https://commons.wikimedia.org/wiki/File:IAF_Netra_AEW%26C_releasing_flares.jpg) |
| `astra-missile.jpg` | Astra missile launch | Ministry of Defence (India) | GODL-India | [Commons](https://commons.wikimedia.org/wiki/File:Tejas_firing_Astra_MK1.jpg) |
| `brahmos-missile.jpg` | BrahMos missile | Mike1979 Russia | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:BrahMos_missile_at_Engineering_Technologies_2012_02.jpg) |

No video content is used anywhere in the app.

## Fonts

"Baloo 2" and "Nunito", both from Google Fonts (open licenses), loaded
via `index.html`.
