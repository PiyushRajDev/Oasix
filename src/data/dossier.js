export const DOSSIER_KEYS = ['launch', 'trend', 'competitor', 'creator'];

export const NIGHT_FRAGMENTS = [
  { src: 'reddit', time: '02:11:04Z', text: '"has anyone actually shown week 1 vs week 4 tho?" — 640 comments' },
  { src: 'tiktok', time: '02:11:19Z', text: 'before/after routine — 1.2k posts/hr, +212% / 6h' },
  { src: 'instagram', time: '02:11:26Z', text: 'demo reel — 940 saves/hr, saves 2x likes' },
  { src: 'x', time: '02:11:31Z', text: 'competitor replies thinning — skepticism rising' },
  { src: 'tiktok', time: '02:11:44Z', text: 'unboxing wave — 4.1k posts/hr, 14 brands already there' },
  { src: 'x', time: '02:11:52Z', text: 'meme remix — peaking, no buyer question inside' },
];

export const DOSSIER_SCENARIOS = {
  launch: {
    label: 'Product launch',
    goal: 'Launch a new product to a younger audience.',
    signal: 'A creator format around "before / after proof" is accelerating across TikTok, Instagram and Reddit.',
    source: {
      quote: 'Has anyone actually tried this? Every brand claims results but nobody shows the first 2 weeks…',
      meta: 'r/SkincareAddiction · thread · 640 comments · 02:11:04Z',
    },
    fragments: [
      { src: 'tiktok', time: '02:11:19Z', text: 'before/after routine — 1.2k posts/hr, velocity +212% / 6h' },
      { src: 'instagram', time: '02:11:26Z', text: 'demo reels — 940 saves/hr, saves 2x likes' },
      { src: 'reddit', time: '02:11:04Z', text: 'question thread — 640 comments, wants proof' },
    ],
    evidence: [
      'velocity +212% over 6h — pre-peak, still compounding',
      'cross-platform spread: TikTok > Instagram > Reddit, same format',
      'saves 2x likes — intent signal, not vanity signal',
      'sentiment leans positive, no brand owns it yet',
    ],
    context: [
      ['Audience fit', 'High — under-30 buyers, proof-first voice match'],
      ['Timing', 'Now — format accelerating, not peaked'],
      ['Competition', 'Quiet — only 2 brands active'],
    ],
    rejected: [
      { text: 'Unboxing wave on TikTok — 4.1k posts/hr', reason: 'REJECT — saturated, 14 brands already there' },
      { text: 'Celebrity routine debate on X', reason: 'REJECT — wrong buyer, low overlap' },
      { text: 'Giveaway thread on Reddit', reason: 'REJECT — spike without intent, saves flat' },
    ],
    verdict: 'Create a proof-led response showing the product in use within the first 15 seconds.',
    confidence: 'confidence HIGH — quiet competition · strong fit · pre-peak timing',
    action: ['15s proof cut — product in use in first 15s', 'Instagram Reel — 4:5 + 9:16 cutdown', 'X reply + breakdown thread'],
    learning: 'saves +41% · profile visits +28% > weights updated, strategy sharpened',
  },
  trend: {
    label: 'Trend response',
    goal: 'Join a fast-moving conversation without looking late.',
    signal: 'An unfiltered teardown thread is spreading from Reddit to TikTok — your category is named directly.',
    source: {
      quote: 'POV: I stopped trusting ads and started filming week 1 vs week 4. Here is the unfiltered routine…',
      meta: '@skinlab.diaries · TikTok · 6h ago · 02:09:51Z',
    },
    fragments: [
      { src: 'reddit', time: '02:08:12Z', text: 'teardown thread — category named directly, 640 comments' },
      { src: 'tiktok', time: '02:09:51Z', text: 'stitch wave — unfiltered answers, rising fast' },
      { src: 'x', time: '02:10:33Z', text: 'quotes spreading — no good brand answer yet' },
    ],
    evidence: [
      'crossing 2 platforms in under 2h — Reddit > TikTok',
      'question matches buyers verbatim — does anyone show week 1?',
      'no good brand answer — opening, not pile-on',
      'evidence-led tone fits — calm beats hype here',
    ],
    context: [
      ['Audience fit', 'High — question matches buyers'],
      ['Timing', 'Now — crossing platforms this hour'],
      ['Competition', 'Quiet — no credible brand answer'],
    ],
    rejected: [
      { text: 'Meme remix of the teardown — 9k views/hr', reason: 'REJECT — late-entry risk, joke already peaked' },
      { text: 'Adjacent category drama on X', reason: 'REJECT — wrong category, guilt by association' },
      { text: 'Paid creator offer in comments', reason: 'REJECT — inauthentic vector, trust cost' },
    ],
    verdict: 'Answer the exact audience question with evidence — one clear demonstration, no hype.',
    confidence: 'confidence HIGH — direct naming · unanswered · evidence fits',
    action: ['TikTok stitch — direct answer, 15s', 'Carousel — step-by-step proof', 'Reddit FAQ response — source + proof'],
    learning: 'saves +36% · shares +24% > answer format banked for next teardown',
  },
  competitor: {
    label: 'Competitor move',
    goal: 'Respond when a rival launches without starting a price war.',
    signal: 'A competitor launch is getting attention — but replies are thinning and skepticism is rising on X and Reddit.',
    source: {
      quote: 'Save this if you are over 10-step routines. 15 seconds, morning light, no filter.',
      meta: '@glowwithpri · Instagram Reel · 3h ago · 02:07:44Z',
    },
    fragments: [
      { src: 'x', time: '02:06:02Z', text: 'competitor launch post — replies thinning, skepticism rising' },
      { src: 'reddit', time: '02:07:15Z', text: 'comparison questions — buyers asking for full picture' },
      { src: 'instagram', time: '02:07:44Z', text: 'demo reels — calm proof outperforming hype' },
    ],
    evidence: [
      'skepticism window open — over-claim detected in replies',
      'buyers comparing options — side-by-side wanted',
      'calm proof edge — brand voice matches this moment',
      'one rival active — no pile-on, clean entry',
    ],
    context: [
      ['Audience fit', 'High — buyers comparing options'],
      ['Timing', 'Open — skepticism window, not backlash'],
      ['Competition', 'One rival — measured entry, no war'],
    ],
    rejected: [
      { text: 'Price-comparison thread on X', reason: 'REJECT — price-war trap, brand loses' },
      { text: 'Influencer callout of rival', reason: 'REJECT — attack vector, trust cost' },
      { text: 'Launch-day meme pile-on', reason: 'REJECT — noise, no buyer intent' },
    ],
    verdict: 'Enter with calm proof: side-by-side evidence where the rival over-claimed.',
    confidence: 'confidence HIGH — skepticism + comparison intent · proof edge',
    action: ['Comparison cut — side-by-side, no naming', 'Creator duet — independent voice', 'Reddit context reply — full picture'],
    learning: 'saves +33% · profile visits +21% > calm-proof playbook reinforced',
  },
  creator: {
    label: 'Creator opportunity',
    goal: 'Find the right creator before everyone else does.',
    signal: 'A mid-size creator format is compounding — high saves, low brand saturation, strong overlap with your buyers.',
    source: {
      quote: '15 seconds, morning light, no filter — full steps in caption. Save this.',
      meta: '@glowwithpri · Instagram Reel · 940 saves/hr · 02:10:02Z',
    },
    fragments: [
      { src: 'instagram', time: '02:10:02Z', text: 'mid-size creator — 940 saves/hr, unsponsored so far' },
      { src: 'tiktok', time: '02:10:29Z', text: 'same format compounding — 318 creators, pre-peak' },
      { src: 'reddit', time: '02:10:47Z', text: 'buyers citing creator — this is the routine I meant' },
    ],
    evidence: [
      'pre-peak velocity — compounding, not spiked',
      'unsponsored so far — first-brand advantage',
      'core buyer overlap — native to category',
      'saves-led — intent, not reach',
    ],
    context: [
      ['Audience fit', 'Very high — core buyer overlap'],
      ['Timing', 'Early — pre-peak velocity'],
      ['Competition', 'None — unsponsored so far'],
    ],
    rejected: [
      { text: 'Mega-creator haul — 2.1M views', reason: 'REJECT — reach without fit, saturated rates' },
      { text: 'Comment-pod boosted reel', reason: 'REJECT — inflated saves, no intent' },
      { text: 'Off-category viral dancer', reason: 'REJECT — audience mismatch despite velocity' },
    ],
    verdict: 'Seed three creators with the proof format first — then amplify the winner within 48 hours.',
    confidence: 'confidence VERY HIGH — overlap + early + unsponsored',
    action: ['Creator brief — proof format, 3 seeds', 'Hook + demo — Reel cutdown', 'Amplify plan — 48h winner window'],
    learning: 'saves +44% · follows +31% > creator-fit weights updated',
  },
};
