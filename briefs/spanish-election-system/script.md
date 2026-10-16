# Script: Spanish election system, "Who runs Spain?" (59.3 s, 9:16)

Made to the standing brief "educational motion graphics video, political system" (see `CLAUDE.md`), in the
`GermanElection` look (white background, step header, ballot cards, one hemicycle, cartoon characters), in Spain's
colours: the flag's red as the accent, yellow as the second colour, the flag (red, yellow twice as wide, red) as the
bar on the top edge. Real party colours appear only in the 2023 result and the investiture votes. Steps in the header:
**Vote · Parliament · Government · King**. Header title **"WHO RUNS SPAIN?"**.

The user chose (15 Oct 2026):
- The **2023 election** as the worked example, with **no mention** of the snap election called for 29 November 2026.
- The hook "In 2023, this party came first in Spain. But this man became prime minister. How?"
- The closing question "Should the party with the most votes always get to govern?" (it ties back to the hook).
- The narration below as written (approved 15 Oct 2026). Built 16 Oct 2026; the talks sentence got 0.3 s more pause
  after approval so the government line can be read (no words changed).

**Core message:** Spaniards from 18 (also abroad) get two ballots. For Congress (350 seats) they pick one party's closed
list; each province shares its seats among parties above 3% (D'Hondt). For the Senate they mark up to three people.
Congress makes the laws and elects the prime minister; the Senate can amend or veto, but Congress has the last word.
In 2023 the People's Party came first (137) but short of 176; Feijóo lost the investiture vote, Sánchez won it (179)
with Sumar and regional parties. The King inherits the throne, proposes the candidate and signs every law, but can't
block one.

## Narration (as spoken: Kokoro `bm_george`, en-gb, speed 1.15)

Source of truth: `src/voiceover/spanish-election.script.json`. Voice-over 58.3 s (the last word ends at 58.0 s);
video 59.3 s (1.3 s hold on the question). Limit: 60 s. A first draft measured 63.9 s and was trimmed before approval
(the "179 to 171" count moved to the screen, two lines shortened).

| Step | id | Time (s) | Narration |
|---|---|---|---|
| Hook | hook | 0.3–6.3 | In 2023, this party came first in Spain. But this man became prime minister. How? |
| 1 Vote | who | 6.7–10.4 | Who can vote? Spaniards from 18, even those living abroad. |
| | ballot | 10.8–17.0 | You get two ballots. For Congress, you pick one party's list, with no changes, and drop it in the envelope. |
| | seats | 17.4–21.0 | Each province shares its seats among parties above 3%. |
| | senate | 21.4–23.9 | For the Senate, you tick up to three candidates. |
| 2 Parliament | congress | 24.3–32.8 | The 350 members of Congress make the laws and elect the prime minister. The Senate can amend them, but Congress has the last word. |
| 3 Government | result | 33.3–39.1 | The People's Party won 137 seats, short of the 176 needed. |
| | talks | 39.5–46.4 | Its leader, Feijóo, lost the vote. Pedro Sánchez of the Socialists won it, backed by Sumar and regional parties. |
| 4 King | king | 47.2–54.5 | And the King? Felipe the Sixth inherited the throne. He proposes the candidate and signs every law, but can't block one. |
| Closing | question | 54.9–58.0 | Should the party with the most votes always get to govern? |

Alternatives offered (not chosen): worked example "wait for the 29 Nov 2026 result" or "2023 + mention 29 Nov"; hooks
"In Spain, you get two ballots, and on one of them you can't pick a single name. Why?" and "Spain votes on 29 November";
questions "Should you vote for people, or only for parties?" and "Does Spain still need a King?".

Shown on screen only: on the voter roll automatically; 18 on election day; vote at the polling station or by post;
abroad: registered at a consulate, by post or at the consulate, no request needed since 2022; not compulsory;
foreigners only in local elections (EU citizens and a few countries by treaty); Congress ballot white, Senate beige;
one white sheet per party with a fixed, numbered list (made-up parties A–C); a crossed-out or added name makes the vote
invalid; 52 districts (50 provinces + Ceuta and Melilla), at least 2 seats each (Ceuta, Melilla 1), the rest by
population; Madrid 37, Barcelona 32, Soria 2 (2023); a made-up province with 6 seats (D'Hondt: 9% can win nothing);
Senate ballot: candidates of all parties, marks may go to different parties, 4 senators per province (islands, Ceuta
and Melilla fewer); Congress elected at least every 4 years, passes the budget, can vote the PM out; Senate 266 (208
elected + 58 sent by the regional parliaments); all 11 parties' seats; 176 = majority; the investiture rule (176 yes, or
more yes than no in a second vote); Feijóo 172 yes / 178 no (27 Sep 2023); Sánchez 179 yes / 171 no (16 Nov 2023);
backers with seats; government Socialists + Sumar = 152, no majority of its own; Felipe VI since 19 June 2014; signs
laws within 15 days.

## Fact sheet (checked 15–16 Oct 2026)

| Fact | Source |
|---|---|
| **Who can vote:** Spaniards of age (18+ on election day) on the electoral roll, living in Spain or abroad, in person or by post; not compulsory; not deprived of the right to vote (since 2018 no one loses it for a disability). | [La Moncloa: 29N basic guide](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/interior/Paginas/guia-dudas-elecciones-generales-29n.aspx), [Infoelectoral: the right to vote](https://infoelectoral.interior.gob.es/es/proceso-electoral/el-derecho-de-sufragio/), [La Moncloa: 2018 disability reform](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/sanidad/Paginas/2018/181018-discapacidad.aspx) |
| **Spaniards abroad:** registered at a consulate and in the CERA roll; Organic Law 12/2022 (in force 3 Oct 2022) ended the "voto rogado": they get the documents without asking, vote by post or at the consulate. | [La Moncloa: end of the voto rogado](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/mpresidencia14/paginas/2022/031022-boevoto.aspx), [Exteriores: new rules](https://www.exteriores.gob.es/Embajadas/londres/es/Comunicacion/Noticias/Paginas/Articulos/20221005_NOT01.aspx) |
| **Foreigners:** only local (and EU-citizen European) elections: EU citizens, and citizens of countries with a reciprocity treaty (e.g. UK, Norway, Ecuador, Colombia, Peru) after set years of residence. | [Infoelectoral: the right to vote](https://infoelectoral.interior.gob.es/es/proceso-electoral/preguntas-frecuentes/el-derecho-de-sufragio/), [INE: 2023 municipal elections](https://www.ine.es/prensa/elecmun23_1.pdf) |
| **Ballots:** Congress ballot white, Senate ballot sepia. Congress: closed, blocked party lists (one sheet per party, no changes). Senate: one sheet with all candidates; mark up to 3 in provincial districts (2 in Gran Canaria, Mallorca, Tenerife, Ceuta, Melilla; 1 on the other islands); more marks = invalid. | [Infoelectoral: Cortes Generales elections](https://infoelectoral.interior.gob.es/es/proceso-electoral/preguntas-frecuentes/tipos-de-elecciones/elecciones-a-cortes-generales/), [Infoelectoral: Senate](https://infoelectoral.interior.gob.es/es/proceso-electoral/visitas-virtuales/senado/), [La Moncloa: 29N guide](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/interior/Paginas/guia-dudas-elecciones-generales-29n.aspx) |
| **Seats:** 350 deputies; the province is the district (50 + Ceuta and Melilla, 1 each); each province 2 at least, the remaining 248 by population; 3% threshold of valid votes in each district; D'Hondt. 2023: Madrid 37, Barcelona 32 (2026: Madrid 38). | [La Moncloa: 23J guide](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/interior/paginas/2023/090623-guia-dudas-elecciones-generales-2023.aspx), [Infoelectoral: electoral system](https://infoelectoral.interior.gob.es/es/proceso-electoral/preguntas-frecuentes/sistema-electoral/), [Infoelectoral: D'Hondt](https://infoelectoral.interior.gob.es/es/proceso-electoral/visitas-virtuales/metodo-dhont/) |
| **Senate:** XV legislature (from 17 Aug 2023) 266 senators: 208 directly elected (4 per province), 58 appointed by the regional parliaments (1 per region + 1 per million people). Functions: laws, budget, control of the government; it can amend or veto bills, Congress can override. | [Senado: composition](https://www.senado.es/web/conocersenado/temasclave/composicionsenadoelecciones/index.html), [Senado: appointed senators](https://www.senado.es/web/composicionorganizacion/senadores/composicionsenado/consultaprocedenciageografica/designados/index.html), [La Moncloa: Constitution Title III](https://www.lamoncloa.gob.es/espana/leyfundamental/paginas/titulo_tercero.aspx) |
| **Election 23 July 2023 (Congress seats):** PP 137, PSOE 121, Vox 33, Sumar 31, ERC 7, Junts 7, EH Bildu 6, PNV 5, BNG 1, CC 1, UPN 1 = 350. ⚠️ Only cross-checked on secondary sources (Wikipedia, Robert Schuman Foundation); the official BOE/JEC table could not be read in this session, and some outlets report PP 136 / PSOE 122. | [JEC: 2023 results](https://www.juntaelectoralcentral.es/cs/jec/elecciones/Generales-julio2023?p=1379061494717), [BOE-A-2023-18907](https://www.boe.es/boe/dias/2023/09/01/pdfs/BOE-A-2023-18907.pdf), [Wikipedia: 2023 election](https://en.wikipedia.org/wiki/2023_Spanish_general_election) |
| **Investiture (Constitution art. 99):** after consulting the parties the King proposes a candidate; absolute majority (176) in the first vote, or more yes than no 48 h later; after two months without one, new elections. | [Congreso: Constitution art. 99](https://app.congreso.es/consti/constitucion/indice/titulos/articulos.jsp?ini=99&fin=107&tipo=2) |
| **Feijóo:** 27 Sep 2023 172 yes, 178 no; 29 Sep 172 yes, 177 no, 1 void. Yes: PP, Vox, UPN, CC. | [El Salto](https://www.elsaltodiario.com/politica/feijoo-vuelve-fracasar-investidura-cierra-escenificacion-congreso), [Congreso: XV legislature](https://www.congreso.es/es/cem/histxvleg) |
| **Sánchez:** 16 Nov 2023, 179 yes, 171 no, first vote. Yes: PSOE, Sumar, ERC, Junts, EH Bildu, PNV, BNG, CC; no: PP, Vox, UPN. King had proposed him on 3 Oct 2023. Coalition government PSOE + Sumar (152 seats). | [La Moncloa: Sánchez invested](https://www.lamoncloa.gob.es/lang/en/presidente/news/paginas/2023/20231116_investiture-session.aspx), [Congreso: press release](https://www.congreso.es/en/notas-de-prensa?p_p_id=notasprensa&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_notasprensa_mvcPath=detalle&_notasprensa_notaId=45970), [Congreso: King proposes Sánchez](https://www.congreso.es/es/notas-de-prensa?p_p_id=notasprensa&amp=&p_p_lifecycle=0&amp=&p_p_state=normal&amp=&p_p_mode=view&amp=&_notasprensa_mvcPath=detalle&amp=&_notasprensa_notaId=45810) |
| **King:** Felipe VI, since 19 June 2014 (hereditary); sanctions laws within 15 days (Constitution art. 91), acts countersigned by the government, no veto. | [La Moncloa: Title II, the Crown](https://www.lamoncloa.gob.es/espana/leyfundamental/paginas/titulo_segundo.aspx), [BOE: Constitution](https://boe.es/buscar/act.php?id=BOE-A-1978-31229&p=20240217&tn=1) |

**Will go stale:** a snap election is called for **29 November 2026** (Royal Decree 806/2026, BOE 6 Oct 2026; new
chambers meet 23 Dec 2026). After it, the 2023 result, the government and possibly the prime minister in this video are
out of date; Madrid's seats rise to 38. The King is unlikely to change.

**Research note:** official sites are blocked for direct fetching in Claude cloud sessions; facts were gathered with web
searches limited to official domains (lamoncloa.gob.es, infoelectoral.interior.gob.es, congreso.es, senado.es,
juntaelectoralcentral.es, exteriores.gob.es, ine.es), cross-checked with secondary sources.

## Pronunciation
`Feijóo` → `fˌeɪhˈəʊ`, `Sánchez` → `sˈænʧɛz`, `Sumar` → `suːmˈɑː`, `Felipe` → `fəlˈiːpeɪ`. Numbers spelled out under `say`.
