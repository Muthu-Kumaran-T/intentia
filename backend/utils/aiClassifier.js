// utils/aiClassifier.js
// 🧠 Rule-Based AI Classifier — Keyword Text Classification
// Pipeline: Input → Normalize → Remove Stop Words → Tokenize → Score → Category

// ─── Stop Words ────────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'i','me','my','myself','we','our','ours','ourselves','you','your','yours',
  'yourself','he','him','his','himself','she','her','hers','herself','it',
  'its','itself','they','them','their','theirs','themselves','what','which',
  'who','whom','this','that','these','those','am','is','are','was','were',
  'be','been','being','have','has','had','having','do','does','did','doing',
  'a','an','the','and','but','if','or','because','as','until','while','of',
  'at','by','for','with','about','against','between','into','through','during',
  'before','after','above','below','to','from','up','down','in','out','on',
  'off','over','under','again','further','then','once','here','there','when',
  'where','why','how','all','both','each','few','more','most','other','some',
  'such','no','nor','not','only','own','same','so','than','too','very',
  'can','will','just','should','now','get','got','go','going','make','made',
  'come','came','see','saw','say','said','look','really','actually','like',
  'also','even','still','back','way','well','much','many','new','old','good',
  'great','best','better','big','small','want','need','would','could','us',
  'time','people','man','woman','day','year','may','might','one','two','s',
  'd','ll','m','o','re','ve','y'
]);

// ─── Category Keyword Dictionaries ─────────────────────────────────────────────
// PRIMARY keywords  → weight: 2  (highly specific to this category)
// SECONDARY keywords → weight: 1  (supporting / common terms)
const CATEGORY_KEYWORDS = {
  'Share & Thoughts': {
    primary: [
      'thought','opinion','believe','perspective','mindset','rant','confession',
      'unpopular','honestly','personally','reflection','anxiety','overthinking',
      'vent','feelings','emotions','gratitude','grateful','self','growth',
      'journal','diary','mental','health','personal','experience','story','insight'
    ],
    secondary: [
      'share','think','feel','wonder','life','question','idea','moment','advice',
      'lesson','learned','daily','today','random','curious','inspire','motivation',
      'wisdom','quote','mood','reflect','genuine','relate','realise','realize'
    ]
  },

  'Music': {
    primary: [
      'song','album','artist','band','concert','lyrics','playlist','melody',
      'guitar','piano','drums','singer','rap','hiphop','rock','pop','jazz',
      'classical','indie','track','remix','cover','dj','producer','chord',
      'bass','violin','orchestra','soundcloud','vinyl','acoustic','debut'
    ],
    secondary: [
      'music','listen','listening','genre','beat','rhythm','festival','gig',
      'performance','musician','instrument','tune','spotify','youtube','bop',
      'streaming','collab','hook','verse','vibe','release','single','ep','lp'
    ]
  },

  'Play': {
    primary: [
      'gaming','gamer','console','xbox','playstation','nintendo','switch',
      'steam','esports','multiplayer','singleplayer','fps','rpg','mmorpg',
      'twitch','minecraft','fortnite','valorant','pubg','gta','fifa','pokemon',
      'zelda','mario','gameplay','controller','gpu','streamer','boss','quest',
      'npc','server','patch','mod','glitch','clan','lol','cod','elden'
    ],
    secondary: [
      'game','games','play','playing','player','pc','tournament','match',
      'stream','streaming','review','update','dlc','rank','ranked','lobby',
      'lag','ping','graphics','frame','level','unlock','achievement','leaderboard'
    ]
  },

  'Buzz': {
    primary: [
      'breaking','politics','political','government','president','election',
      'vote','economy','inflation','war','conflict','protest','rights','justice',
      'crime','court','verdict','scandal','controversy','headline','viral',
      'celebrity','gossip','drama','crypto','bitcoin','stocks','market'
    ],
    secondary: [
      'news','buzz','trending','latest','update','happening','current','affairs',
      'issue','society','social','global','local','national','world','report',
      'media','journalist','policy','law','international','situation','announcement'
    ]
  },

  'Movies': {
    primary: [
      'film','cinema','actor','actress','director','netflix','hulu','disney',
      'hbo','trailer','screenplay','script','oscar','blockbuster','horror',
      'thriller','animation','anime','documentary','bollywood','hollywood',
      'sequel','premiere','imdb','spoiler','casting','plottwist','scene'
    ],
    secondary: [
      'movie','movies','watch','watching','series','episode','episodes','review',
      'reviews','plot','cast','character','genre','ending','prime','amazon',
      'screen','award','awards','release','theatre','box','office'
    ]
  },

  'Learning & Tech': {
    primary: [
      'programming','developer','software','hardware','javascript','python',
      'java','typescript','react','angular','vue','nodejs','css','html','api',
      'database','sql','mongodb','mysql','cloud','aws','azure','devops','docker',
      'kubernetes','algorithm','cybersecurity','engineering','github','framework',
      'debugging','artificial','intelligence','machine','robotics','neural'
    ],
    secondary: [
      'learn','study','course','tutorial','education','tech','technology','code',
      'coding','ai','ml','app','skill','skills','certificate','degree','interview',
      'questions','project','build','engineer','research','bootcamp','udemy',
      'coursera','exam','innovation','startup','data','science','open','source'
    ]
  },

  'Sports': {
    primary: [
      'football','soccer','cricket','basketball','tennis','hockey','baseball',
      'volleyball','badminton','rugby','golf','boxing','mma','ufc','athletics',
      'olympic','olympics','championship','nba','nfl','nhl','mlb','premier',
      'ipl','fifa','uefa','wicket','goalkeeper','referee','penalty','stadium',
      'pitch','court','trophy','medal','athlete','league','season','transfer'
    ],
    secondary: [
      'sport','sports','match','matches','score','scores','goal','goals','player',
      'players','team','teams','coach','tournament','fitness','gym','workout',
      'run','running','race','marathon','swim','cycling','win','winning','loss',
      'draw','series','test','competition','cup'
    ]
  },

  'Food': {
    primary: [
      'recipe','recipes','cook','cooking','bake','baking','restaurant','dish',
      'dishes','meal','meals','breakfast','lunch','dinner','dessert','cake',
      'pizza','pasta','burger','curry','cuisine','chef','grill','vegan',
      'vegetarian','keto','nutrition','ingredient','ingredients','flavor',
      'spicy','sweet','sour','salty','delicious','yummy','homemade','organic'
    ],
    secondary: [
      'food','eat','eating','taste','tasty','snack','snacks','drink','coffee',
      'tea','juice','smoothie','cocktail','delivery','menu','order','foodie',
      'street','fresh','fruit','vegetables','meat','seafood','healthy','diet',
      'calories','oven','fry','steam','cheese','bread','rice','soup'
    ]
  },

  'Travel': {
    primary: [
      'traveling','travelling','vacation','holiday','destination','destinations',
      'flight','flights','hotel','hotels','hostel','airbnb','itinerary','passport',
      'visa','hiking','trekking','camping','backpacking','sightseeing','wanderlust',
      'roadtrip','cruise','safari','abroad','international','landmark','paris',
      'london','tokyo','bali','dubai','europe','asia','africa','america'
    ],
    secondary: [
      'travel','trip','trips','journey','adventure','adventures','explore',
      'exploring','tour','tours','tourist','tourism','culture','local','country',
      'city','beach','mountain','sea','ocean','island','forest','nature',
      'bucket','list','scenery','view','landscape','guide','luggage','airport'
    ]
  }
};

// ─── Tokenizer ─────────────────────────────────────────────────────────────────
/**
 * Normalize → strip punctuation → split → remove stop words & short tokens
 * Handles compound words: "hip-hop" → ["hip", "hop"]
 *
 * @param {string} text
 * @returns {string[]} clean token array
 */
const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[''`]/g, '')           // don't → dont
    .replace(/[-_]/g, ' ')           // hip-hop → hip hop
    .replace(/[^a-z0-9\s]/g, ' ')   // strip remaining punctuation
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
};

// ─── Classify Category ─────────────────────────────────────────────────────────
/**
 * Weighted keyword-based text classification.
 *
 * Scoring rules:
 *   Primary   exact match  → +2.0
 *   Secondary exact match  → +1.0
 *   Primary   partial match → +0.5  (catches plurals / variations)
 *   Secondary partial match → +0.25
 *
 * Tie-breaking: the more-specific category wins over 'Share & Thoughts'.
 * Falls back to 'Share & Thoughts' when no category scores ≥ 1.
 *
 * @param {string} text - Raw post content
 * @returns {string} - Detected category name
 */
const classifyCategory = (text) => {
  if (!text || text.trim().length === 0) return 'Share & Thoughts';

  const tokens  = tokenize(text);
  if (tokens.length === 0) return 'Share & Thoughts';

  const tokenSet = new Set(tokens);
  const scores   = {};

  for (const [category, { primary, secondary }] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;

    // ── Primary keywords ──────────────────────────────────────────────
    for (const kw of primary) {
      if (tokenSet.has(kw)) {
        score += 2;
      } else {
        // Partial match: "recipes" ↔ "recipe", "gaming" ↔ "game"
        for (const token of tokens) {
          if (token.includes(kw) || kw.includes(token)) {
            score += 0.5;
            break;
          }
        }
      }
    }

    // ── Secondary keywords ────────────────────────────────────────────
    for (const kw of secondary) {
      if (tokenSet.has(kw)) {
        score += 1;
      } else {
        for (const token of tokens) {
          if (token.includes(kw) || kw.includes(token)) {
            score += 0.25;
            break;
          }
        }
      }
    }

    scores[category] = parseFloat(score.toFixed(2));
  }

  // ── Pick winner ───────────────────────────────────────────────────────────
  let maxScore        = 0;
  let detectedCategory = 'Share & Thoughts';

  for (const [category, score] of Object.entries(scores)) {
    // Strict greater-than so 'Share & Thoughts' only wins when truly dominant
    if (score > maxScore) {
      maxScore         = score;
      detectedCategory = category;
    }
  }

  // Debug output — remove in production if preferred
  console.log('🧠 Classification Scores:');
  Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .forEach(([cat, s]) => console.log(`   ${cat.padEnd(20)} → ${s}`));
  console.log(`✅ Detected: "${detectedCategory}" (score: ${maxScore})\n`);

  return maxScore >= 1 ? detectedCategory : 'Share & Thoughts';
};

// ─── Extract Keywords ──────────────────────────────────────────────────────────
/**
 * Returns the top meaningful tokens from the post.
 * Category-matched tokens are surfaced first (more relevant).
 *
 * @param {string} text
 * @returns {string[]} up to 10 keywords
 */
const extractKeywords = (text) => {
  if (!text) return [];

  const tokens = tokenize(text);

  // Flat set of all known category keywords for relevance check
  const allCategoryKws = new Set(
    Object.values(CATEGORY_KEYWORDS).flatMap(({ primary, secondary }) => [
      ...primary,
      ...secondary
    ])
  );

  const matched = tokens.filter(t => allCategoryKws.has(t));
  const rest    = tokens.filter(t => !allCategoryKws.has(t));

  // Matched keywords first, then remaining unique tokens — cap at 10
  return [...new Set([...matched, ...rest])].slice(0, 10);
};

// ─── Detect User Intent ────────────────────────────────────────────────────────
/**
 * Detects user intent from onboarding / profile text.
 * Returns: 'discover' | 'share' | 'learn' | 'connect' | 'explore'
 *
 * @param {string} intentText
 * @returns {string}
 */
const detectIntent = (intentText) => {
  const intents = {
    discover: ['discover', 'find', 'explore', 'search', 'looking for', 'recommend', 'suggest', 'browse'],
    share:    ['share', 'post', 'tell', 'show', 'express', 'talk about', 'publish', 'upload', 'create'],
    learn:    ['learn', 'understand', 'know', 'study', 'educate', 'improve', 'master', 'practice'],
    connect:  ['connect', 'meet', 'follow', 'chat', 'friends', 'network', 'community', 'people']
  };

  const lowerText = intentText.toLowerCase();

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      return intent;
    }
  }

  return 'explore';
};

module.exports = {
  classifyCategory,
  extractKeywords,
  detectIntent
};