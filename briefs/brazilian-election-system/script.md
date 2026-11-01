# Script: Brazilian election system, "How Brazil votes." (≈58.3 s, 9:16)

**Style:** the default look (`SwedishElection`, the user's Belgian reference) in the **Brazilian flag's colours**: a deep
Brazilian-green background (`#00733A`, lighter in the middle, darker at the edges) with white text; accent words in
**flag-yellow blocks with flag-blue letters and a thin white rim**; yellow-and-blue wipe bands and sweeps; light "paper"
scenes for the voting machine and the 2026 result; the flag's green, yellow and blue stacked as the title bar, and a
simplified flag (`Emblem` in `src/scenes/brazilian-election/ui.tsx`, no motto). **Subtitle pill: flag yellow with
flag-blue text** (red is not in the flag; same idea as Sweden's yellow pill).

**No questions asked:** the user's standing instruction (28 Oct 2026). Choices made:
- Vertical 1080×1920 @ 30 fps, ≤ 60 s, AI narrator (Kokoro `bm_george`, en-gb, speed 1.17) + TikTok subtitles.
- **Hook:** skipping the vote can cost you your passport (compulsory voting; an unpaid fine blocks a passport).
- **Worked example:** the **general election of 4 Oct 2026** with the presidential **run-off on 25 Oct 2026**.
- **Specialities:** compulsory voting 18–70 (optional at 16–17, 70+, illiterate); voters abroad vote only for president;
  electronic voting machines (type the number, check the photo, press green; six votes in 2026); open-list seats pooled
  by party, so a "vote puller" brings others in (limited by the 10% rule); the Senate with 3 seats per state regardless
  of size; two-round presidential election.
- **Closing question:** "So, should anyone be forced to vote?"
- First draft measured 61.3 s of voice (62.5 s total); shortened the ballot, seats and Congress lines and raised the speed
  from 1.15 to 1.17 → 57.1 s of voice, 58.3 s with the closing hold.
- Lula and Flávio Bolsonaro are named only in text and voice (no likeness); the voting-machine candidate, the party list
  and the first-round race are made up.

## Narration (source of truth: `src/voiceover/brazilian-election.script.json`)

| Section | id | Time (s) | Narration |
|---|---|---|---|
| 01 How Brazil votes | hook | 0.2–3.1 | In Brazil, skipping the vote can cost you your passport. |
| 02 Who can vote | who | 3.4–13.8 | Who can vote? Voting is a must from 18 to 70. It's optional at 16 and 17, over 70, and if you can't read. Citizens abroad only vote for president. |
| 03 The ballot | ballot | 14.1–21.7 | There's no paper ballot. You type each candidate's number into a machine, check the photo, and press green. Six votes in a row. |
| 04 The seats | seats | 22.1–28.3 | Deputies' seats are shared by party votes in each state. So one star candidate can pull others in with them. |
| 05 The Congress | congress | 28.6–36.2 | That's the 513-member Chamber of Deputies. It makes the laws. The Senate, three per state, must approve them too. |
| 06 The president | president | 36.5–43.2 | The president runs the government, with no prime minister. If nobody gets over half, the top two meet in a run-off. |
| 07 The result | result | 43.5–54.6 | In 2026, Lula trailed Flávio Bolsonaro in round one, then won the run-off with 51.8%. But Bolsonaro's party won the most seats in both houses. |
| 08 Your verdict | question | 55.2–57.0 | So, should anyone be forced to vote? |

## Fact sheet (checked 1 Nov 2026)

| Fact | Source |
|---|---|
| **Who must vote:** literate citizens aged **18–70** (Constitution art. 14). **Optional:** 16–17, over 70, and people who cannot read. Optional voters need no excuse and face no penalty. Foreigners cannot vote. | [TSE: obligation](https://www.tse.jus.br/servicos-eleitorais/titulo-eleitoral/voto-obrigatoriedade), [TSE: who must vote (2026)](https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/faltam-19-dias-saiba-para-quem-o-voto-e-obrigatorio-ou-facultativo) |
| **Skipping:** justify within 60 days of each round, or pay a fine of **up to R$3.51 per round** (3–10% of R$35.13, can be raised up to tenfold by the judge; waived for those who declare poverty). Unpaid: **no passport**, no ID card, no public post or public bank loan; three missed rounds without justification or payment can cancel the registration. | [TSE manual do eleitor 2026](https://www.tse.jus.br/eleicoes/arquivos/manual-do-eleitor-2026/@@display-file/file/manual-do-eleitor-2026.pdf), [TSE: what if I didn't vote](https://www.tse.jus.br/comunicacao/noticias/2025/Janeiro/o-que-faco-quando-nao-votei-nem-justifiquei-a-ausencia-na-eleicao), [TSE Res. 23.759/2026](https://www.tse.jus.br/legislacao/compilada/res/2026/resolucao-no-23-759-de-26-de-fevereiro-de-2026) |
| **Electorate 2026:** about **158.7 million**; **918,876** registered abroad, who vote **only for president and vice-president**. Biometrics are not required to vote. | [TSE: 158.7 million](https://www.tse.jus.br/comunicacao/noticias/2026/Outubro/eleicoes-2026-em-numeros-158-7-milhoes-de-eleitores-estao-aptos-a-votar), [TSE: 918,876 abroad](https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/faltam-24-dias-mais-de-918-mil-brasileiros-estao-aptos-a-votar-no-exterior), [TSE: biometrics](https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/faltam-11-dias-biometria-e-obrigatoria-para-votar) |
| **The machine (urna eletrônica):** six votes in 2026, in order: federal deputy (4 digits), state/district deputy (5), senator 1 and senator 2 (3 each), governor (2), president (2). The screen shows photo, name, office and party before the voter presses **CONFIRMA** (green). For deputies one may vote for a party only (2 digits, *voto de legenda*). | [TSE: order of voting 2026](https://www.tse.jus.br/comunicacao/noticias/2026/Marco/eleicoes-2026-conheca-a-ordem-de-votacao-na-urna-eletronica), [TSE: 25 days to go](https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/faltam-25-dias-saiba-qual-e-a-ordem-de-votacao-na-urna-eletronica) |
| **Seats for deputies:** open-list proportional representation by state. Party votes (all its candidates' votes + party votes) ÷ electoral quotient = seats; the party's most-voted candidates take them. A **"puxador de votos"** (vote puller) can bring in colleagues with few votes; since 2015 each winner needs at least **10% of the quotient**. | [TSE: quotients](https://www.tse.jus.br/comunicacao/noticias/2023/Julho/quocientes-eleitoral-partidario-e-sobras-por-media-entenda-como-funcionam-esses-calculos-eleitorais), [TSE: quotient (Temas Selecionados)](https://temasselecionados.tse.jus.br/temas-selecionados/apuracao-de-votos-e-eleicoes-extraordinarias/eleicao-proporcional/quociente-eleitoral/generalidades) |
| **Chamber of Deputies:** **513**, four years, **8 to 70 per state** by population. A 2025 law raising it to 531 was vetoed by Lula and the STF kept the old seat shares for 2026 (any change from 2030 at the earliest). | Constitution art. 45; [Congresso em Foco: veto](https://www.congressoemfoco.com.br/noticia/110276/governo-publica-no-dou-veto-integral-ao-aumento-de-deputados), [Bahia Notícias: STF](https://www.bahianoticias.com.br/justica/noticia/73152-stf-mantem-por-unanimidade-decisao-que-barra-mudanca-no-numero-de-deputados-federais-para-2026) |
| **Senate:** **81** = 3 for each of the 26 states and the Federal District, **eight-year** terms, renewed by one third and two thirds alternately; 2026 elected **54** (two per unit, plurality). Both chambers must pass federal laws. | Constitution art. 46, 65; [Correio da Manhã: 54 elected](https://www.correiodamanha.com.br/politica/2026/10/324406-senado-renova-dois-tercos-das-cadeiras-veja-os-54-eleitos-em-cada-estado.html) |
| **President:** head of state **and** government (no prime minister), four years, **one immediate re-election**; needs an absolute majority of valid votes, else a **run-off** between the top two on the last Sunday of October. From 2027 the term starts on **5 January** (EC 111/2021). | Constitution art. 76–77, 82 |
| **2026 result:** round one (4 Oct): **Flávio Bolsonaro (PL) 47.03%** (56,103,033), **Lula (PT) 45.16%** (53,870,724), abstention 21.08%. Run-off (25 Oct): **Lula 51.79%** (64,256,232) vs Bolsonaro 48.21% (59,826,041), abstention 19.2%. Lula's **fourth** (non-consecutive) term, from 5 Jan 2027. Flávio Bolsonaro claimed fraud without evidence. | [TSE: Lula re-elected](https://www.tse.jus.br/comunicacao/noticias/2026/Outubro/presidente-do-tse-anuncia-reeleicao-de-lula-e-faz-balanco-do-2o-turno-das-eleicoes-2026), [Agência Brasil: round one](https://agenciabrasil.ebc.com.br/politica/noticia/2026-09/flavio-e-lula-vao-disputar-2o-turno-para-presidente-da-republica), [Rádio Senado](https://www12.senado.leg.br/radio/1/noticia/2026/10/25/lula-e-reeleito-presidente-do-brasil) |
| **Chamber 2027–2031 (elected 4 Oct 2026):** **PL 121** (largest single-party bench since 1990), PT/PCdoB/PV federation **88** (PT 70), União/PP 87, PSD 43, Republicanos 41, MDB 36, Podemos 27, others smaller = 513. | [Câmara: PL leads with 121](https://especial.camara.leg.br/no-aniversario-de-200-anos-da-camara-dos-deputados-motta-reforca-defesa-da-democracia/), [CNN Brasil](https://www.cnnbrasil.com.br/eleicoes/bancada-partidos-camara/), [Exame](https://exame.com/brasil/pl-amplia-bancada-e-tera-121-deputados-veja-a-nova-composicao-da-camara/) |
| **Senate from Feb 2027 (projection):** PL won 19 of 54 seats → **28 of 81**; PT 9. | [CNN Brasil](https://www.cnnbrasil.com.br/eleicoes/divisao-bancada-senado/), [Poder360](https://www.poder360.com.br/poder-eleicoes/pl-tera-a-maior-bancada-do-senado-a-partir-de-2027/) |

**Will go stale:** party benches (party switches until the new Congress sits on 1 Feb 2027 and later), the Senate
projection, the R$3.51 fine, the seat shares per state (possibly from 2030). Lula takes office 5 Jan 2027; the next
general election is in Oct 2030. Re-check before reusing the video.

**Research note:** official sites are blocked for direct fetching in Claude cloud sessions; facts were gathered with web
searches limited to official domains (tse.jus.br, camara.leg.br, senado.leg.br, agenciabrasil.ebc.com.br) and
cross-checked with CNN Brasil, Exame, Poder360 and Al Jazeera.

## Pronunciation
`pronounce`: Flávio → flˈɑːviəʊ, Lula → lˈuːlə, Bolsonaro(’s) → bˌɒlsənˈɑːɹəʊ(z). Numbers spelled out under `say`.
