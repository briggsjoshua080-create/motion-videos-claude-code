# Script: Mexican election system, "How Mexico votes." (≈59.3 s, 9:16)

**Style:** the default look (`SwedishElection`, the user's Belgian reference) in the **Mexican flag's colours**: a deep
Mexican-green background (`#00573C`, lighter in the middle, darker at the edges) with white text; accent words in
**flag-red blocks with a thin white rim**; red-and-white wipe bands and sweeps; light "paper" scenes for the ballot and
the 2024 result; the tricolour (green, white, red) stood on end as the title bar, and a simplified coat of arms (eagle on
a cactus in a wreath, `Emblem` in `src/scenes/mexican-election/ui.tsx`). **Standard red subtitle pill** (red is in the
flag and reads on green).

**No questions asked:** the user's standing instruction (28 Oct 2026). Choices made:
- Vertical 1080×1920 @ 30 fps, ≤ 60 s, AI narrator (Kokoro `bm_george`, en-gb, speed 1.15) + TikTok subtitles.
- **Hook:** the president gets one six-year term and can never run again (the *sexenio*).
- **Worked example:** the **general election of 2 Jun 2024** (president + both chambers).
- **Specialities:** no prime minister and no run-off; voting is a constitutional duty with no fine; voters may mark two
  logos if the parties are in one alliance; the 8-point cap on over-representation; **elected judges** since 2025.
- **Closing question:** "So, should 54% of the votes win 73% of the seats?" (the alliance's share of the votes for
  deputies vs. its share of the Chamber).
- First draft measured 60.9 s of voice (62.1 s total); trimmed the Congress and result lines to 58.1 s of voice
  (59.3 s with the closing hold).
- Sheinbaum is named only in text and voice (no likeness); the ballot parties and the "most votes wins" race are made up.

## Narration (source of truth: `src/voiceover/mexican-election.script.json`)

| Section | id | Time (s) | Narration |
|---|---|---|---|
| 01 How Mexico votes | hook | 0.2–4.3 | Mexico's president gets one term. Six years. Then never again. |
| 02 Who can vote | who | 4.7–13.0 | Who can vote? Citizens aged 18 with a photo voter card, even online from abroad. Voting is a duty, but there's no fine. |
| 03 The ballot | ballot | 13.4–19.0 | Each race gets its own ballot. Mark one party's logo, or two, if they're in the same alliance. |
| 04 The seats | seats | 19.4–25.4 | 300 deputies win a district. 200 more are shared by votes, for parties above 3%. |
| 05 The Congress | congress | 25.7–33.5 | That's the Chamber of Deputies: it makes laws and sets the budget. The 128-member Senate must pass every law too. |
| 06 The president | president | 33.8–39.6 | There's no prime minister. The president runs the government, and wins with the most votes, no run-off. |
| 06 (cont.) | judges | 39.9–43.6 | And since 2025, Mexicans even elect their judges. |
| 07 The result | result | 43.9–53.5 | In 2024, Claudia Sheinbaum became the first woman president. Her alliance won 54% of the votes, but 73% of the deputies. |
| 08 Your verdict | question | 54.1–58.1 | So, should 54% of the votes win 73% of the seats? |

## Fact sheet (checked 29 Oct 2026)

| Fact | Source |
|---|---|
| **Who can vote:** Mexican nationals aged **18** (17-year-olds may register if they turn 18 by election day), on the electoral roll with a **Credencial para Votar** (photo voter card, free, issued only by the INE). Voting is an **obligation** of citizens (Constitution art. 36), but there is no penalty in practice. | [INE: documents for the voter card](https://www.ine.mx/credencial/documentos-necesarios/), [INE: requirements](https://www.ine.mx/wp-content/uploads/2023/10/Requisitos_VF.pdf), Constitution art. 34–36 |
| **Abroad:** citizens abroad with a valid voter card who register in advance may vote **online, by post or in person at 23 consulates** (2024). **184,326** votes from abroad for president in 2024, **122,497** of them online. | [INE: 184 mil votaron desde el extranjero](https://centralelectoral.ine.mx/2024/06/06/mas-de-184-mil-mexicanas-y-mexicanos-participaron-en-la-eleccion-presidencial-de-2024-desde-el-extranjero/), [INE: three ways to vote abroad](https://centralelectoral.ine.mx/2024/04/15/las-mexicanas-y-mexicanos-residentes-en-el-extranjero-podran-votar-mediante-3-modalidades-por-internet-voto-postal-o-de-manera-presencial-norma-de-la-cruz-con-enrique-villanueva/) |
| **Ballot:** a separate ballot for each race (in 2024: president, senators, deputies, plus local races). The voter marks a **party emblem** (an X, a tick, a circle… any clear mark). Marking **two or more emblems is valid only if those parties are in a coalition** (the vote goes to the joint candidate and is split between them); otherwise it is void. | [INE: more than one box if same candidacy](https://centralelectoral.ine.mx/2024/05/31/votantes-pueden-marcar-mas-de-un-recuadro-en-la-boleta-electoral-siempre-y-cuando-sean-de-la-misma-candidatura-martin-faz-con-bianca-aguirre/), [INE: valid even if the mark goes over the box](https://centralelectoral.ine.mx/2024/05/31/aclaracion-el-voto-es-valido-aun-cuando-la-marca-del-voto-rebase-el-recuadro-o-emblema-del-partido-siempre-que-la-intencion-del-voto-sea-clara/), [INE: valid and void votes](https://www.ine.mx/wp-content/uploads/2018/06/Cuaderrnillo-Votos-validos-nulos.pdf) |
| **Chamber of Deputies:** **500** for three years: **300** by plurality in single-member districts, **200** by proportional representation from lists in five regions; **3%** of the valid vote needed for list seats. **Cap:** no party may hold a share of seats more than **8 points** above its national vote share (unless won in districts), and **never more than 300**. It passes laws with the Senate and alone approves the budget. | Constitution art. 52–54, 74 ([TEPJF summary](https://www.te.gob.mx/editorial_service/media/pdf/141120251353369970.pdf)); [INE: 2024 list-seat allocation](https://centralelectoral.ine.mx/2024/08/23/asignan-diputaciones-y-senadurias-mediante-el-principio-de-representacion-proporcional/) |
| **Senate:** **128** for six years: in each of the 32 states, **2** for the winning ticket and **1** for the runner-up (96), plus **32** from national party lists. Both chambers must pass federal laws; the Senate also ratifies treaties and approves Supreme Court–related and other appointments. | Constitution art. 56, 72, 76 |
| **President:** head of state **and** of government (no prime minister); elected directly by **plurality** (no run-off) for **six years**, **never** re-elected (art. 83). Takes office 1 October. | Constitution art. 80–83 |
| **2024 presidential result (INE count):** Claudia **Sheinbaum 59.76%** (35,924,519 votes), Xóchitl Gálvez 27.45%, Jorge Álvarez Máynez 10.3%; turnout **61.04%**. Sheinbaum is the **first woman president**, in office since **1 Oct 2024**, term ends 2030. | [INE: 60,115,184 votes counted](https://centralelectoral.ine.mx/2024/06/09/informa-ine-que-se-computaron-60-millones-115-mil-184-votos-en-la-eleccion-presidencial/), [DOF: TEPJF final count](https://sidof.segob.gob.mx/notas/docFuente/5736767) |
| **2024 Chamber of Deputies:** Sigamos Haciendo Historia (Morena 40.8%, PVEM 8.4%, PT 5.5% = **54.7%** of the vote) seated **Morena 257, PVEM 60, PT 47 = 364 of 500 (72.8%)**; the rest (PAN 71, PRI, MC and others) **136**. The 8-point cap is applied **per party**, so the alliance as a whole went far above it; the INE cut Morena's list seats from 87 to 75, the TEPJF confirmed the allocation (SUP-REC-3505/2024). | [Cámara de Diputados: initial composition](https://comunicacionsocial.diputados.gob.mx/sintesis/LINKSIN2/30824_M_BOLETIN_0_LASECRETARIAGENERAL_COMPOSICIONINICIALLXVILEGISLATURA_1M_.pdf), [INE: allocation](https://centralelectoral.ine.mx/2024/08/23/asignan-diputaciones-y-senadurias-mediante-el-principio-de-representacion-proporcional/), [TEPJF SUP-REC-3505/2024](https://www.te.gob.mx/media/SentenciasN/pdf/superior/SUP-REC-3505-2024.pdf), [Mexico News Daily](https://mexiconewsdaily.com/politics/plurinominal-morena-coalition-supermajority-lower-house-congress/) |
| **2024 Senate:** the alliance won **83 of 128** (Morena 60, PVEM 14, PT 9), short of the two-thirds (86) at first. | [Mexico News Daily](https://mexiconewsdaily.com/mexico-elections-2024/mexico-morena-falls-short-senate-supermajority/), [El Financiero](https://elfinanciero.com.mx/nacional/2024/08/23/morena-no-alcanza-la-mayoria-calificada-en-el-senado-asi-quedan-los-escanos/) |
| **Elected judges:** after the 2024 judicial reform, federal judges, including the nine Supreme Court justices, were elected by popular vote for the first time on **1 Jun 2025**; turnout about **13%**. | [INE: Supreme Court count](https://centralelectoral.ine.mx/2025/06/03/informa-ine-avance-del-91-7-en-los-computos-de-eleccion-de-magistraturas-de-la-scjn/), [INE: participation estimate](https://ine.mx/estimacion-ciudadana-peepjf/) |
| **2026 electoral reform:** Sheinbaum's constitutional reform (cutting the Senate's list seats, changing how list deputies are chosen) **failed in March 2026** after PT and PVEM refused to back it; a narrower "Plan B" (costs and privileges, not seats) was declared constitutional on **14 Apr 2026**. The seat numbers in the video are unchanged. Next federal (midterm) election: **6 Jun 2027**. | [GlobalPost](https://globalpost.com/stories/mexican-congress-rejects-electoral-reform-law-in-first-defeat-for-president-sheinbaum/), [Zeta Tijuana: Plan B constitutional](https://zetatijuana.com/2026/04/diputados-declaran-constitucional-plan-b-electoral-de-sheinbaum-tras-aval-de-19-congresos-locales/), [INE: 2026–2027 federal process](https://www.ine.mx/voto-y-elecciones/elecciones-2027/) |

**Will go stale:** the Chamber after the **6 Jun 2027** midterm, any new electoral reform (the seat rules), the date of
the next judicial election (2027 or 2028). Re-check before reusing the video.

**Research note:** official sites are blocked for direct fetching in Claude cloud sessions; facts were gathered with web
searches limited to official domains (ine.mx, centralelectoral.ine.mx, te.gob.mx, diputados.gob.mx, senado.gob.mx,
gob.mx) and cross-checked with Mexico News Daily, El Financiero and GlobalPost.

## Pronunciation
`pronounce`: Sheinbaum → ʃˈeɪnbaʊm. Numbers are spelled out under `say` ("128-member" → "hundred-and-twenty-eight-member").
