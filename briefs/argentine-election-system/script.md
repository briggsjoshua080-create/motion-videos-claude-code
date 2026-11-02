# Script: Argentine election system, "How Argentina votes." (≈59.6 s, 9:16)

**Style:** the default look (`SwedishElection`, the user's Belgian reference) in the **Argentine flag's colours**: a
strong, deep celeste background (`#2F6EAE`, lighter in the middle, darker at the edges) with white text; accent words
in **white blocks (the flag's middle stripe) with deep-blue letters and a thin Sun-of-May gold rim**; celeste-and-white
wipe bands and sweeps; light "paper" scenes for the ballot and the result; the flag (celeste, white, celeste with a
small sun) as the title bar and a simplified, slowly turning **Sun of May** (`Emblem` in
`src/scenes/argentine-election/ui.tsx`, no face). **Subtitle pill: Sun-of-May gold with navy text** (red is not in the
flag; same idea as Sweden's and Brazil's yellow pills).

**No questions asked:** the user's standing instruction (28 Oct 2026). Choices made:
- Vertical 1080×1920 @ 30 fps, ≤ 60 s, AI narrator (Kokoro `bm_george`, en-gb, speed 1.17) + TikTok subtitles.
- **Hook:** "40% of the vote can make you president" (the 40% + 10-point rule).
- **Worked example:** the most recent national election is the **midterm of 26 Oct 2025** (no president elected), so
  the video shows the **2023 presidential election** (Milei) for the government and the **2025 midterms** for Congress.
- **Specialities:** voting from 16 (compulsory 18–70); the new single paper ballot (Boleta Única de Papel, first used
  nationally in 2025); half the Chamber renewed every two years; 3% of registered voters as the line; the Senate's
  2-for-the-winner, 1-for-the-runner-up rule; the 45% / 40%+10 first-round rule.
- **Left out for length:** the PASO open primaries (held 2011–2023, suspended in 2025; Milei's bill to scrap them was
  still stuck in the Senate on 2 Nov 2026) and the Chief of Cabinet (appointed by the president, can be removed by
  Congress). Both are in the fact sheet.
- **Closing question:** "So, should 16-year-olds help choose who runs a country?"
- First draft measured 64.7 s of voice; shortened every line except "who" and the question, dropped "with 41%" from
  the voice (still on screen as 40.8%) and raised the speed from 1.15 to 1.17 → 58.4 s of voice, 59.6 s with the hold.
- Milei, Massa and Bullrich are named only in text and voice (no likeness); the ballot's parties, the province and the
  first-round race in the president scene are made up.

## Narration (source of truth: `src/voiceover/argentine-election.script.json`)

| Section | id | Time (s) | Narration |
|---|---|---|---|
| 01 How Argentina votes | hook | 0.2–3.8 | In Argentina, 40% of the vote can make you president. |
| 02 Who can vote | who | 4.1–10.9 | Who can vote? Every citizen from 16, and it's a must from 18 to 70. Citizens abroad can vote too. |
| 03 The ballot | ballot | 11.2–19.3 | Since 2025, there's one paper ballot: a row per race, a column per party. Tick one box per row, fold it, and drop it in. |
| 04 The seats | seats | 19.7–26.6 | Deputies are shared out by vote share in each province, above a 3% line. Half are elected every two years. |
| 05 The Congress | congress | 26.9–35.8 | That's the 257-member Chamber of Deputies, which makes the laws. The Senate must pass them too: three per province, one for the runner-up. |
| 06 The president | president | 36.2–44.4 | The president runs the government. 45% wins in round one, or 40% with a ten-point lead. If not, there's a run-off. |
| 07 The result | result | 44.7–54.8 | In 2023, Javier Milei won the run-off with 55.7%. In 2025, his party won the midterms, but still has no majority. |
| 08 Your verdict | question | 55.5–58.4 | So, should 16-year-olds help choose who runs a country? |

## Fact sheet (checked 2 Nov 2026)

| Fact | Source |
|---|---|
| **Who votes:** Argentine citizens from **16** (Ley 26.774, 2012). **Compulsory 18–70**; optional at 16–17 and over 70 (not put on the register of non-voters). No sign-up: the roll is built from the national ID (DNI). Skipping without a reason within 60 days: a small fine (Ley 26.774: 50–500 pesos), unpaid = no dealings with public bodies for a year. Foreigners cannot vote nationally; some provinces and Buenos Aires city let resident foreigners vote locally. | [argentina.gob.ar: Ley simple – Voto](https://www.argentina.gob.ar/justicia/derechofacil/leysimple/voto), [Voto joven](https://www.argentina.gob.ar/justicia/derechofacil/leysimple/voto-joven), [DINE: derechos y obligaciones](https://www.argentina.gob.ar/interior/dine/electores/derechos-y-obligaciones-del-elector), [Ley 26.774](https://www.argentina.gob.ar/normativa/nacional/204176/texto) |
| **Abroad:** citizens from 16 with a foreign address on their DNI (at least 180 days before the election) may vote, **optionally**, for national offices at consulates. | [CNE: Voto exterior FAQ](https://www.electoral.gob.ar/votoexterior/faq.php), [argentina.gob.ar: residentes en el exterior](https://www.argentina.gob.ar/elecciones-2025/residentes-en-el-exterior) |
| **The ballot:** the **Boleta Única de Papel** (Ley 27.781), first used nationally on 26 Oct 2025: one sheet, a row per office, a column per party; mark one box per row with the pen given (cross or tick); no "whole list" box; fold and put in the box. | [CNE: ¿Qué es la BUP?](https://www.electoral.gob.ar/bup/), [CNE FAQ](https://www.electoral.gob.ar/bup/preg_freq.php), [Observatorio electoral: BUP](https://www.argentina.gob.ar/interior/observatorioelectoral/boleta-unica-papel-bup) |
| **Chamber of Deputies:** **257**, four years, **half renewed every two years** (127 in 2025, 130 in 2027), seats per province by population, **D'Hondt** with a line of **3% of the district's registered voters**. | [argentina.gob.ar: ¿Qué elegimos? (2025)](https://www.argentina.gob.ar/elecciones-2025/que-elegimos), [Cuadernillo sistemas electorales](https://www.argentina.gob.ar/sites/default/files/sistemaselectorales_cuadernillo.pdf) |
| **Senate:** **72** = 3 for each of the 23 provinces and Buenos Aires city; **2 seats to the most-voted list, 1 to the runner-up**; six years, a third renewed every two years. Laws need both chambers. | [Senado: Poder legislativo](https://www.senado.gob.ar/poderlegislativo), Constitution art. 54 |
| **President:** head of state and government, four years, one re-election in a row (Constitution art. 90). Wins outright with **more than 45%** of valid votes, or **40% with more than 10 points over the runner-up**; otherwise a **run-off** within 30 days (art. 96–98). | Constitution art. 94–98; [argentina.gob.ar: lo que hay que saber (2023)](https://www.argentina.gob.ar/elecciones-2023/lo-que-hay-que-saber-sobre-las-elecciones/lo-que-hay-que-saber-sobre-las-elecciones) |
| **2023:** round one 22 Oct: **Massa 36.78%**, **Milei 29.99%**, Bullrich 23.81% (final count). Run-off 19 Nov: **Milei 55.65%** of votes for a candidate. Took office 10 Dec 2023. | [La Nación: escrutinio definitivo](https://www.lanacion.com.ar/politica/elecciones-generales-2023-el-escrutinio-definitivo-no-tuvo-sorpresas-sergio-massa-saco-3668-y-javier-nid02112023), [BAE Negocios: run-off final count](https://www.baenegocios.com/politica/Escrutinio-definitivo-con-que-porcentaje-gano-Javier-Milei-20231128-0117.html), [CNE: actas 2023](https://www.electoral.gob.ar/nuevo/paginas/pdf/actas_escrutinio/2023/GENERALES/MISIONES.pdf) |
| **2025 midterms (26 Oct):** La Libertad Avanza **40.84%** of the national deputy vote (64 of 127 seats), Fuerza Patria 24.50% (31); Senate seats up in 8 provinces: LLA 13 of 24. Turnout 67.9%, the lowest in a decade. | [C5N: official results](https://www.c5n.com/politica/resultados-oficiales-elecciones-legislativas-nacionales-26-octubre-2025), [El Cronista](https://www.cronista.com/economia-politica/elecciones-2025-como-quedo-el-mapa-electoral-tras-las-legislativas/), [Chequeado](https://chequeado.com/nota/la-libertad-avanza-gano-las-elecciones-legislativas-2025-como-queda-conformado-el-nuevo-congreso) |
| **Chamber from Dec 2025:** LLA bloc **95** (biggest, after switches from PRO/UCR and others), Unión por la Patria **93**, others 69; majority **129**. | [BAE Negocios](https://www.baenegocios.com/politica/Javier-Milei-festejo-el-mapa-del-Congreso-La-Libertad-Avanza-es-la-primera-minoria-en-Diputados-20251203-0015.html), [Misiones Online](https://misionesonline.net/2025/12/03/diputados-como-quedaron-conformados-los-bloques-tras-la-jura-de-los-127-legisladores/) |
| **Senate now:** LLA **21** own senators; 37 needed for a majority (Nov 2026). | [El Esquiú, 1 Nov 2026](https://www.elesquiu.com/politica/2026/11/1/el-gobierno-no-consigue-los-votos-en-el-senado-para-eliminar-las-paso-y-crece-la-tension-con-sus-ali-601837.html) |
| **PASO (not in the video):** open primaries 2011–2023, suspended for 2025; the April 2026 reform bill to scrap them had not passed the Senate by 2 Nov 2026. | [Chequeado](https://chequeado.com/el-explicador/reforma-electoral-de-milei-5-claves-del-proyecto-que-elimina-las-paso-y-cambia-el-financiamiento-de-campanas/), [Senado](https://www.senado.gob.ar/prensa/23818/noticias), [Infobae, 28 Oct 2026](https://www.infobae.com/politica/2026/10/28/se-achica-el-margen-del-gobierno-para-la-reforma-electoral-y-crecen-las-dudas-sobre-los-votos/) |

**Will go stale:** bloc sizes (95/93) and the 21 senators change with party switches; the electoral reform (PASO) may
pass; the next general election (president + 130 deputies + 24 senators) is due in Oct 2027. Re-check before reusing.

**Research note:** official sites are blocked for direct fetching in Claude cloud sessions; facts were gathered with web
searches (some limited to argentina.gob.ar, electoral.gob.ar, senado.gob.ar, hcdn.gob.ar) and cross-checked with
La Nación, El Cronista, Chequeado and Infobae.

## Pronunciation
`pronounce`: Milei → mɪlˈeɪ, Javier → hˌæviˈɛə. Numbers and percentages spelled out under `say`.
