# Storyboard: Who runs the Netherlands?

Format: 1080×1920 (9:16), 30 fps, 1331 frames (44.4 s). Palette: Dutch flag red `#AE1C28`, white, blue `#21468B`, the
national orange `#FF7F00`, on a deep blue background (`NL` in `src/scenes/dutch-election/ui.tsx`). Font: Inter.

Every scene starts 6 frames before its sentence, and every visual cue is looked up from the voice-over timing with
`cue(sentence, word)`. No narration frame numbers are hard-coded.

**Persistent layers**
- **Backdrop:** a deep blue gradient with soft orange and red glows, drifting specks, and the tricolour along the top edge.
- **Subtitles:** TikTok style (`src/components/Subtitles.tsx`), centred at y = 1330, with the spoken word highlighted
  orange. They are hidden for the closing question, whose words appear big on screen.
- **Audio:** the voice-over, soft music 16 LU under the voice (`public/audio/dutch-election/music.mp3`), and light sound
  effects tied to words (`SFX` in `DutchElection.tsx`). Mastered to −14 LUFS.

| # | Scene (file) | Narration | Visual |
|---|---|---|---|
| 1 | Hook (`HookScene`) | The Dutch **never** vote for their head of state. **So who's** in charge? | A ballot paper "HEAD OF STATE" with a crown is visible from frame 0. A red "NO VOTE" stamp slams in on "never" (thud). The title "WHO'S IN CHARGE?" appears on "So" and an orange "?" pops on "who's". |
| 2 | King (`KingScene`) | **King** Willem-Alexander **inherited the crown**. His **daughter Amalia** is **next**. | Family chain: Queen Beatrix (until 2013), then King Willem-Alexander (since 2013), then Princess Amalia (next in line). The crown travels from Beatrix to the King on "inherited the crown". A dotted line draws to Amalia, and a faint crown waits above her on "next". Title: "INHERITED, NOT ELECTED". |
| 3 | Role (`RoleScene`) | He **signs** every law, but his **ministers** take the **responsibility**. | An "ACT OF PARLIAMENT" with a royal seal. The King's signature draws on "signs" and a minister's on "ministers" (scribble sounds). On "responsibility": "MINISTERS ARE RESPONSIBLE · Constitution, article 42". |
| 4 | Voters (`VotersScene`) | Voters **fill** all **150** seats in the **House** of Representatives, at **least** every four years. | A ballot marked with the Dutch red pencil on "fill". The 150-seat hemicycle sweeps in with a counter on "150", the "HOUSE OF REPRESENTATIVES" label appears on "House", and an "AT LEAST EVERY 4 YEARS" calendar on "least". |
| 5 | Senate (`SenateScene`) | The **75** senators? **Provincial** councils **choose** them, **not** the people directly. | The 75-seat Senate hemicycle with a counter. 12 council-hall tiles pop in on "Provincial", arrows rise to the Senate on "choose", and a "NO DIRECT VOTE" stamp lands on "not". |
| 6 | Result (`ResultScene`) | In 2025, **D66** and the **PVV tied** with 26 seats each. A **majority** needs 76. | The 150-seat hemicycle in idle blue. 26 seats fill orange from the left (D66) and 26 white from the right (PVV), with tags and "TIE". On "majority", a red line through the middle and "MAJORITY = 76 SEATS". Caption: "+ 13 other parties share 98 seats". |
| 7 | Cabinet (`CabinetScene`) | After **117** days of **coalition talks**, the **King swore** in **Rob** Jetten's cabinet, with **66** seats. | The header counts to "117 DAYS OF TALKS". D66 · 26, VVD · 22 and CDA · 18 chips pop in, and the seat bar fills to 66 against the majority tick at 76. The palace-steps photo rises on "King" (crown on the King), with "SWORN IN BY THE KING · 23 FEB 2026". The PM figure turns orange on "Rob" with a "PRIME MINISTER ROB JETTEN" pill, and on "66": "66 SEATS · MINORITY CABINET". |
| 8 | Question (`QuestionScene`) | Is it really **democracy** if you don't **vote** for your head of state? | A crown, "?" and a ballot box. The question appears word by word with the voice ("DEMOCRACY" and "VOTE" in orange). "COMMENT BELOW" pops after the last word (chime) and holds for 1.4 s. |

## Safe areas (TikTok)
Key content stays inside x 120–960 and y 170–1200, and the subtitles sit at y ≈ 1250–1410. The bottom ~440 px stays
clear for TikTok's caption and UI, and the right edge for its buttons.
