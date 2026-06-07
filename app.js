// ============================================================
//  app.js — Pokéthon Bootcamp
// ============================================================

// ── STATE ────────────────────────────────────────────────────
const MAX_XP = 3000;
let STATE = {
  trainerName: 'Trainer',
  starter: null,          // { id, name, types, evoChain }
  starterStage: 0,        // 0=base, 1=mid, 2=final
  xp: 0,
  completedLessons: [],
  caughtPokemon: [],      // [{ id, name }]
  currentLesson: null,
};

// ── ALL-GEN STARTERS ─────────────────────────────────────────
const GENERATIONS = [
  { label: 'Gen I',   region: 'Kanto' },
  { label: 'Gen II',  region: 'Johto' },
  { label: 'Gen III', region: 'Hoenn' },
  { label: 'Gen IV',  region: 'Sinnoh' },
  { label: 'Gen V',   region: 'Unova' },
  { label: 'Gen VI',  region: 'Kalos' },
  { label: 'Gen VII', region: 'Alola' },
  { label: 'Gen VIII',region: 'Galar' },
  { label: 'Gen IX',  region: 'Paldea' },
];

const STARTERS = [
  // Gen I
  { gen:1, id:1,   name:'Bulbasaur',  types:['Grass','Poison'], evoChain:[1,2,3] },
  { gen:1, id:4,   name:'Charmander', types:['Fire'],           evoChain:[4,5,6] },
  { gen:1, id:7,   name:'Squirtle',   types:['Water'],          evoChain:[7,8,9] },
  // Gen II
  { gen:2, id:152, name:'Chikorita',  types:['Grass'],          evoChain:[152,153,154] },
  { gen:2, id:155, name:'Cyndaquil',  types:['Fire'],           evoChain:[155,156,157] },
  { gen:2, id:158, name:'Totodile',   types:['Water'],          evoChain:[158,159,160] },
  // Gen III
  { gen:3, id:252, name:'Treecko',    types:['Grass'],          evoChain:[252,253,254] },
  { gen:3, id:255, name:'Torchic',    types:['Fire'],           evoChain:[255,256,257] },
  { gen:3, id:258, name:'Mudkip',     types:['Water','Ground'], evoChain:[258,259,260] },
  // Gen IV
  { gen:4, id:387, name:'Turtwig',    types:['Grass'],          evoChain:[387,388,389] },
  { gen:4, id:390, name:'Chimchar',   types:['Fire'],           evoChain:[390,391,392] },
  { gen:4, id:393, name:'Piplup',     types:['Water'],          evoChain:[393,394,395] },
  // Gen V
  { gen:5, id:495, name:'Snivy',      types:['Grass'],          evoChain:[495,496,497] },
  { gen:5, id:498, name:'Tepig',      types:['Fire'],           evoChain:[498,499,500] },
  { gen:5, id:501, name:'Oshawott',   types:['Water'],          evoChain:[501,502,503] },
  // Gen VI
  { gen:6, id:650, name:'Chespin',    types:['Grass'],          evoChain:[650,651,652] },
  { gen:6, id:653, name:'Fennekin',   types:['Fire','Psychic'], evoChain:[653,654,655] },
  { gen:6, id:656, name:'Froakie',    types:['Water'],          evoChain:[656,657,658] },
  // Gen VII
  { gen:7, id:722, name:'Rowlet',     types:['Grass','Flying'], evoChain:[722,723,724] },
  { gen:7, id:725, name:'Litten',     types:['Fire'],           evoChain:[725,726,727] },
  { gen:7, id:728, name:'Popplio',    types:['Water'],          evoChain:[728,729,730] },
  // Gen VIII
  { gen:8, id:810, name:'Grookey',    types:['Grass'],          evoChain:[810,811,812] },
  { gen:8, id:813, name:'Scorbunny',  types:['Fire'],           evoChain:[813,814,815] },
  { gen:8, id:816, name:'Sobble',     types:['Water'],          evoChain:[816,817,818] },
  // Gen IX
  { gen:9, id:906, name:'Sprigatito', types:['Grass'],          evoChain:[906,907,908] },
  { gen:9, id:909, name:'Fuecoco',    types:['Fire'],           evoChain:[909,910,911] },
  { gen:9, id:912, name:'Quaxly',     types:['Water'],          evoChain:[912,913,914] },
];

const EVO_NAMES = {
  1:'Bulbasaur',2:'Ivysaur',3:'Venusaur',
  4:'Charmander',5:'Charmeleon',6:'Charizard',
  7:'Squirtle',8:'Wartortle',9:'Blastoise',
  152:'Chikorita',153:'Bayleef',154:'Meganium',
  155:'Cyndaquil',156:'Quilava',157:'Typhlosion',
  158:'Totodile',159:'Croconaw',160:'Feraligatr',
  252:'Treecko',253:'Grovyle',254:'Sceptile',
  255:'Torchic',256:'Combusken',257:'Blaziken',
  258:'Mudkip',259:'Marshtomp',260:'Swampert',
  387:'Turtwig',388:'Grotle',389:'Torterra',
  390:'Chimchar',391:'Monferno',392:'Infernape',
  393:'Piplup',394:'Prinplup',395:'Empoleon',
  495:'Snivy',496:'Servine',497:'Serperior',
  498:'Tepig',499:'Pignite',500:'Emboar',
  501:'Oshawott',502:'Dewott',503:'Samurott',
  650:'Chespin',651:'Quilladin',652:'Chesnaught',
  653:'Fennekin',654:'Braixen',655:'Delphox',
  656:'Froakie',657:'Frogadier',658:'Greninja',
  722:'Rowlet',723:'Dartrix',724:'Decidueye',
  725:'Litten',726:'Torracat',727:'Incineroar',
  728:'Popplio',729:'Brionne',730:'Primarina',
  810:'Grookey',811:'Thwackey',812:'Rillaboom',
  813:'Scorbunny',814:'Raboot',815:'Cinderace',
  816:'Sobble',817:'Drizzile',818:'Inteleon',
  906:'Sprigatito',907:'Floragato',908:'Meowscarada',
  909:'Fuecoco',910:'Crocalor',911:'Skeledirge',
  912:'Quaxly',913:'Quaxwell',914:'Quaquaval',
};

function SPRITE(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function recalcStarterStage() {
  const done = STATE.completedLessons.length;
  const total = CURRICULUM.length;
  if (done >= Math.floor(total * 0.66)) STATE.starterStage = 2;
  else if (done >= Math.floor(total * 0.33)) STATE.starterStage = 1;
  else STATE.starterStage = 0;
}

// ── CURRICULUM ───────────────────────────────────────────────
const CURRICULUM = [
  // ── PYTHON FUNDAMENTALS ──
  {
    id: 'py_vars', track: 'python', title: 'Variables & Data Types',
    pokemon: { id: 25, name: 'Pikachu' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Variables &amp; Data Types</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Every program stores data. Understanding types prevents bugs like adding a number to a string, and Python's dynamic typing means you need to <em>know</em> what type you're working with even when the language doesn't force you to declare it.</p>
    <h3>The Four Core Types</h3>
    <ul>
      <li><strong>int</strong> — whole numbers, no decimal: <code>42</code>, <code>-7</code>, <code>0</code></li>
      <li><strong>float</strong> — numbers with decimals: <code>3.14</code>, <code>0.5</code>, <code>-1.0</code></li>
      <li><strong>str</strong> — text, always in quotes: <code>"Pikachu"</code>, <code>'hello'</code></li>
      <li><strong>bool</strong> — exactly two values: <code>True</code> or <code>False</code> (capital T/F)</li>
    </ul>
    <h3>Annotated Example</h3>
    <pre><code>trainer_name = "Ash"    # str — quotes make it text
level = 10              # int — whole number, no quotes
catch_rate = 0.45       # float — has a decimal point
has_badge = True        # bool — True or False, no quotes

# type() tells you what type a variable is
print(type(level))      # &lt;class 'int'&gt;
print(type(catch_rate)) # &lt;class 'float'&gt;

# f-strings: embed variables directly in text
# Put the variable name inside curly braces {}
print(f"Trainer: {trainer_name}, Level: {level}")
# Output: Trainer: Ash, Level: 10

# Type conversion (casting)
level_str = str(level)  # int → str: "10"
hp = int("45")          # str → int: 45
rate = float("0.5")     # str → float: 0.5</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ <code>name = Ash</code> — missing quotes makes Python look for a variable called Ash</li>
      <li>❌ <code>has_badge = true</code> — lowercase: Python treats this as an undefined variable</li>
      <li>❌ <code>"5" + 5</code> — can't add str and int; use <code>int("5") + 5</code></li>
      <li>✅ <code>x = 1</code> then <code>x = "hello"</code> — valid in Python (dynamic typing)</li>
    </ul>
    <h3>Pattern Recognition</h3>
    <p>When you see a value in quotes → str. Whole number → int. Has a dot → float. True/False → bool. Use <code>type(x)</code> when unsure.</p>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" />
</div>`,
    quiz: [
      { q: 'What is the type of 3.14?', choices: ['int','float','str','bool'], answer: 1 },
      { q: 'Which correctly creates a string variable?', choices: ['name = Ash','name = 42','name = "Ash"','name = True'], answer: 2 },
      { q: 'What does f"HP: {hp}" do?', choices: ['Multiplies hp','Inserts hp into the string','Creates a function','Declares hp as float'], answer: 1 },
      { q: 'What does type(42) return?', choices: ["'int'","<class 'int'>","int","42"], answer: 1 },
      { q: 'Which of these will cause an error?', choices: ['x = 1; x = "hi"','"5" + "3"','int("10")','x = True + 1'], answer: 2 },
      { q: 'What is the value of int(3.9)?', choices: ['4','3','3.9','Error'], answer: 1 },
    ],
    starterCode: `trainer = "Ash"\nlevel = 10\nhp = 45.5\nhas_badge = True\n\nprint(type(level))\nprint(f"Trainer: {trainer}, Level: {level}, HP: {hp}")\n\n# Casting\nlevel_str = str(level)\nprint(f"Level as string: '{level_str}', type: {type(level_str)}")`,
    challenge: {
      prompt: `Build a Pokémon stat card from scratch.\n\nCreate these variables:\n  name       — string, any Pokémon\n  level      — int between 1–100\n  hp         — float (e.g. 45.5)\n  is_shiny   — bool\n  type_one   — string (e.g. "Fire")\n\nThen:\n1. Print a formatted card:\n   "⚡ Pikachu [Lv.25] | Type: Electric | HP: 35.0 | Shiny: False"\n2. Print the type of each variable using type()\n3. Convert level to a string and concatenate (not f-string): "Level: " + str(level)`,
      code: `# Define your variables\nname = \nlevel = \nhp = \nis_shiny = \ntype_one = \n\n# 1. Print the stat card\n\n# 2. Print types\n\n# 3. String concatenation (no f-string)\n`
    }
  },
  {
    id: 'py_lists', track: 'python', title: 'Lists & Indexing',
    pokemon: { id: 52, name: 'Meowth' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Lists &amp; Indexing</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Lists are the most common data structure in Python interviews. Nearly every problem involves storing, accessing, or modifying a sequence of values. Master indexing and slicing — you'll use it constantly.</p>
    <h3>How Lists Work</h3>
    <p>A list is an ordered, mutable (changeable) sequence. Items are stored in memory in order and accessed by their <strong>index</strong> — their position number, starting at 0.</p>
    <pre><code>party = ["Pikachu", "Charizard", "Blastoise"]
#           index 0      index 1      index 2
#          index -3     index -2     index -1  (negative = count from end)

print(party[0])   # "Pikachu"  — first item
print(party[2])   # "Blastoise" — third item
print(party[-1])  # "Blastoise" — last item (same as party[2] here)
print(party[-2])  # "Charizard" — second to last</code></pre>
    <h3>Slicing — Get a Sublist</h3>
    <pre><code>nums = [0, 1, 2, 3, 4, 5]
print(nums[1:4])   # [1, 2, 3]  — index 1 up to (not including) 4
print(nums[:3])    # [0, 1, 2]  — from start up to index 3
print(nums[3:])    # [3, 4, 5]  — from index 3 to end
print(nums[::2])   # [0, 2, 4]  — every 2nd item (step)
print(nums[::-1])  # [5,4,3,2,1,0] — reversed!</code></pre>
    <h3>Essential Methods</h3>
    <pre><code>party = ["Pikachu", "Snorlax"]
party.append("Gengar")        # add to end → ["Pikachu","Snorlax","Gengar"]
party.insert(1, "Eevee")      # insert at index 1
party.remove("Snorlax")       # remove first occurrence by value
popped = party.pop()          # remove &amp; return last item
popped2 = party.pop(0)        # remove &amp; return item at index 0
party.sort()                  # sort in place (modifies the list)
length = len(party)           # number of items</code></pre>
    <h3>Complexity — Know This for Interviews</h3>
    <ul>
      <li><code>list[i]</code> — <strong>O(1)</strong> — direct memory access</li>
      <li><code>append()</code> — <strong>O(1)</strong> amortized</li>
      <li><code>pop()</code> — <strong>O(1)</strong> from end, <strong>O(n)</strong> from middle</li>
      <li><code>insert(i, x)</code> — <strong>O(n)</strong> — must shift elements</li>
      <li><code>remove(x)</code> — <strong>O(n)</strong> — must scan to find x</li>
      <li><code>in</code> operator — <strong>O(n)</strong> — scans every element</li>
    </ul>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ <code>party[3]</code> on a 3-item list → IndexError (valid: 0, 1, 2)</li>
      <li>❌ <code>party[1:3]</code> returns items at index 1 and 2, NOT 3</li>
      <li>❌ <code>a = b = []</code> — both variables point to the SAME list; use <code>a = []; b = []</code></li>
      <li>✅ <code>party[:]</code> creates a shallow copy of the entire list</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png" alt="Meowth" />
</div>`,
    quiz: [
      { q: 'What does party[-1] return?', choices: ['First item','Error','Last item','Length of list'], answer: 2 },
      { q: 'What is the time complexity of list[i]?', choices: ['O(n)','O(log n)','O(1)','O(n²)'], answer: 2 },
      { q: 'What does nums[1:4] return for [0,1,2,3,4]?', choices: ['[1,2,3,4]','[1,2,3]','[0,1,2,3]','[2,3,4]'], answer: 1 },
      { q: 'Which operation is O(n) — avoid in tight loops?', choices: ['list[i]','list.append(x)','list.pop()','list.insert(0, x)'], answer: 3 },
      { q: 'What does nums[::-1] do?', choices: ['Sorts the list','Returns every 2nd item','Reverses the list','Returns last item'], answer: 2 },
      { q: 'a = [1,2,3]; b = a; b.append(4). What is a?', choices: ['[1,2,3]','[1,2,3,4]','Error','[4,3,2,1]'], answer: 1 },
    ],
    starterCode: `party = ["Pikachu", "Charizard", "Blastoise"]\n\n# Indexing\nprint(party[0])    # first\nprint(party[-1])   # last\n\n# Slicing\nprint(party[0:2])  # first two\nprint(party[::-1]) # reversed\n\n# Methods\nparty.append("Mewtwo")\nparty.remove("Charizard")\nprint(party)\nprint(f"Size: {len(party)}")`,
    challenge: {
      prompt: `Given: party = ["Pikachu", "Snorlax", "Gengar", "Mewtwo", "Eevee", "Dragonite"]\n\n1. Print the 3rd Pokémon (index 2)\n2. Print the last two Pokémon using slicing\n3. Print the party reversed (do NOT modify the original — use slicing)\n4. Remove "Snorlax" and add "Charizard" to the end\n5. Print the final party and size\n6. Check if "Mewtwo" is in the party (print True/False)`,
      code: `party = ["Pikachu", "Snorlax", "Gengar", "Mewtwo", "Eevee", "Dragonite"]\n\n# 1. 3rd Pokemon\n\n# 2. Last two using slicing\n\n# 3. Reversed copy (don't modify original)\n\n# 4. Remove Snorlax, add Charizard\n\n# 5. Final party and size\n\n# 6. Is Mewtwo in the party?\n`
    }
  },
  {
    id: 'py_dicts', track: 'python', title: 'Dictionaries',
    pokemon: { id: 137, name: 'Porygon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Dictionaries</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Dictionaries are the #1 tool for interview problems. Any time you think "I need to look something up fast" or "count how many times X appears" — reach for a dict. They give you O(1) lookup, which turns many O(n²) brute-force solutions into O(n).</p>
    <h3>How Dicts Work</h3>
    <p>A dict stores <strong>key → value</strong> pairs. Under the hood it uses a hash table — the key is hashed to a memory location, so lookup is O(1) regardless of size. Keys must be immutable (strings, ints, tuples). Values can be anything.</p>
    <pre><code>pokemon = {
    "name": "Pikachu",   # key: "name", value: "Pikachu"
    "type": "Electric",
    "level": 25,
    "hp": 35
}

# Access — two ways:
print(pokemon["name"])           # "Pikachu" — raises KeyError if missing
print(pokemon.get("speed", 0))  # 0 — safe, returns default if missing

# Add / update
pokemon["level"] = 26           # update existing key
pokemon["moves"] = ["Thunder"]  # add new key

# Check if key exists — O(1)
if "type" in pokemon:
    print("Has type:", pokemon["type"])

# Iterate
for key in pokemon:                        # just keys
    print(key)
for key, val in pokemon.items():          # key-value pairs — most common
    print(f"{key}: {val}")
for val in pokemon.values():              # just values
    print(val)</code></pre>
    <h3>The Most Important Pattern: Frequency Count</h3>
    <pre><code># Count how many times each item appears
moves = ["Thunder","Tackle","Thunder","Growl","Tackle","Thunder"]
freq = {}
for move in moves:
    freq[move] = freq.get(move, 0) + 1
# freq = {"Thunder": 3, "Tackle": 2, "Growl": 1}

# Or use setdefault
freq2 = {}
for move in moves:
    freq2.setdefault(move, 0)
    freq2[move] += 1</code></pre>
    <h3>Complexity</h3>
    <ul>
      <li><code>d[key]</code> lookup — <strong>O(1)</strong> average</li>
      <li><code>d[key] = val</code> insert/update — <strong>O(1)</strong> average</li>
      <li><code>key in d</code> — <strong>O(1)</strong> — this is the killer feature vs lists</li>
      <li><code>for k in d</code> — <strong>O(n)</strong></li>
    </ul>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ <code>d["missing"]</code> → KeyError; always use <code>d.get("missing", default)</code> when unsure</li>
      <li>❌ Using a list as a dict key → TypeError (lists are mutable, can't be hashed)</li>
      <li>✅ Tuples can be keys: <code>d[(1, 2)] = "point"</code></li>
      <li>✅ <code>key in d</code> is O(1); <code>val in d.values()</code> is O(n) — big difference!</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png" alt="Porygon" />
</div>`,
    quiz: [
      { q: 'Average time complexity of dict lookup by key?', choices: ['O(n)','O(log n)','O(1)','O(n²)'], answer: 2 },
      { q: 'Which safely gets a value without raising KeyError?', choices: ['d[key]','d.fetch(key)','d.get(key, default)','d.find(key)'], answer: 2 },
      { q: 'How do you iterate key-value pairs?', choices: ['for k in d','for k,v in d.items()','for k,v in d','for d.each()'], answer: 1 },
      { q: '"key" in d checks keys or values?', choices: ['Values','Both','Keys','Neither'], answer: 2 },
      { q: 'What does d.get("x", 0) return if "x" is not in d?', choices: ['None','KeyError','0','False'], answer: 2 },
      { q: 'Which type CANNOT be used as a dict key?', choices: ['str','int','tuple','list'], answer: 3 },
    ],
    starterCode: `# Frequency count pattern — memorize this!\nmoves = ["Thunder","Tackle","Thunder","Growl","Tackle","Thunder"]\nfreq = {}\nfor move in moves:\n    freq[move] = freq.get(move, 0) + 1\nprint(freq)\n\n# Dict methods\nstats = {"name": "Charizard", "type": "Fire", "level": 36}\nstats["hp"] = 150                    # add key\nprint(stats.get("speed", "???"))    # safe get\nfor k, v in stats.items():\n    print(f"  {k}: {v}")`,
    challenge: {
      prompt: `1. Count word frequencies: given the string below, count how many times each word appears and print them sorted by count (highest first).\n\n2. Invert a dictionary: given {1:"a", 2:"b", 3:"c"}, create {"a":1, "b":2, "c":3}\n\n3. Two dicts: merge stats1 and stats2 into one dict (stats2 values win on conflict)`,
      code: `# 1. Word frequency\nsentence = "pikachu used thunder pikachu used tackle pikachu fainted"\n\n# 2. Invert a dict\noriginal = {1: "a", 2: "b", 3: "c"}\n\n# 3. Merge (stats2 wins conflicts)\nstats1 = {"hp": 100, "attack": 80, "defense": 60}\nstats2 = {"hp": 120, "speed": 90}\n`
    }
  },
  {
    id: 'py_conditionals', track: 'python', title: 'Conditionals',
    pokemon: { id: 6, name: 'Charizard' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Conditionals</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Conditionals are the decision-making core of every algorithm. Every binary search, every tree traversal, every DP transition — all built from if/elif/else logic. You also need to write clean, readable conditions to pass code reviews.</p>
    <h3>Structure</h3>
    <p>Python uses <strong>indentation</strong> (4 spaces) to define blocks — no curly braces. The order matters: Python checks top to bottom and stops at the first true condition.</p>
    <pre><code>hp = 15

if hp == 0:           # checked first
    print("Fainted!")
elif hp &lt; 20:         # only checked if above is False
    print("Critical HP! Use a potion!")
elif hp &lt; 50:         # only checked if both above are False
    print("Moderate HP")
else:                 # runs if ALL above are False
    print(f"HP: {hp} — looking good!")</code></pre>
    <h3>Comparison &amp; Logical Operators</h3>
    <pre><code># Comparison operators
x == y   # equal (not assignment!)
x != y   # not equal
x &lt; y    # less than
x &lt;= y   # less than or equal
x &gt; y    # greater than
x &gt;= y   # greater than or equal

# Logical operators — combine conditions
hp &gt; 0 and has_pokeball       # BOTH must be True
hp == 0 or pp == 0            # AT LEAST ONE must be True
not has_badge                  # flips True↔False

# Membership
"Thunder" in moves             # True if Thunder is in the list
"speed" not in stats           # True if speed is NOT a key

# Identity (use for None checks, not value equality)
x is None     # preferred over x == None
x is not None</code></pre>
    <h3>Ternary — One-Line If/Else</h3>
    <pre><code># value_if_true if condition else value_if_false
status = "critical" if hp &lt; 20 else "healthy"
label = "legendary" if level &gt;= 70 else "normal"

# Also useful in return statements
def classify(n):
    return "even" if n % 2 == 0 else "odd"</code></pre>
    <h3>Truthiness — What Python Treats as False</h3>
    <pre><code># These ALL evaluate to False in a boolean context:
if 0:    pass   # zero
if []:   pass   # empty list
if {}:   pass   # empty dict
if "":   pass   # empty string
if None: pass   # None

# So you can write:
if my_list:           # same as if len(my_list) > 0
    print("has items")
if not my_dict:       # same as if len(my_dict) == 0
    print("empty")</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ <code>if x = 5</code> — assignment in condition → SyntaxError; use <code>==</code></li>
      <li>❌ <code>if x == True</code> — just write <code>if x</code></li>
      <li>❌ <code>if x == None</code> — use <code>if x is None</code></li>
      <li>✅ Chain comparisons: <code>0 &lt; hp &lt; 100</code> works in Python!</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" alt="Charizard" />
</div>`,
    quiz: [
      { q: 'What does elif mean?', choices: ['Else always runs','Else if — only checked if above conditions are False','Another loop','A function call'], answer: 1 },
      { q: 'What is status = "low" if hp < 20 else "ok" called?', choices: ['Lambda','Ternary expression','Switch statement','Boolean cast'], answer: 1 },
      { q: 'Which is the correct way to check for None?', choices: ['x == None','x = None','x is None','None in x'], answer: 2 },
      { q: 'What does "not []" evaluate to?', choices: ['False','[]','True','Error'], answer: 2 },
      { q: 'if hp > 0 and has_ball — when is this True?', choices: ['When either is True','When hp > 0 only','When both are True','When has_ball only'], answer: 2 },
      { q: 'What does 0 < x < 10 check in Python?', choices: ['Syntax error','x > 0 and x < 10','x > 0 or x < 10','x == 5'], answer: 1 },
    ],
    starterCode: `hp = 15\n\nif hp == 0:\n    print("Fainted!")\nelif hp < 20:\n    print("Critical HP!")\nelse:\n    print(f"HP: {hp}")\n\n# Ternary\nstatus = "critical" if hp < 20 else "healthy"\nprint(status)\n\n# Truthiness\nparty = []\nif not party:\n    print("Party is empty!")\n\n# Chained comparison\nif 0 < hp < 100:\n    print("Valid HP range")`,
    challenge: {
      prompt: `Write a function grade_trainer(wins, losses, badges) that returns a trainer rank:\n- "Elite Four" if badges >= 8 and wins > 50\n- "Gym Leader" if badges >= 4 and wins > losses\n- "Rising Star" if wins > losses\n- "Beginner" otherwise\n\nAlso write a one-liner using ternary that checks if a Pokémon is "legendary" (level >= 70) or "common".\n\nTest with multiple inputs.`,
      code: `def grade_trainer(wins, losses, badges):\n    # Write your conditions (order matters!)\n    pass\n\nprint(grade_trainer(60, 10, 8))   # Elite Four\nprint(grade_trainer(30, 10, 5))   # Gym Leader\nprint(grade_trainer(10, 5, 2))    # Rising Star\nprint(grade_trainer(2, 8, 0))     # Beginner\n\n# Ternary: legendary or common\nlevel = 75\nrank = # your one-liner here\nprint(rank)`
    }
  },
  {
    id: 'py_loops', track: 'python', title: 'Loops',
    pokemon: { id: 143, name: 'Snorlax' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Loops</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Every algorithm processes data — loops are how you do it. You must know for vs while, range variants, enumerate, zip, and break/continue cold. Interviewers will test whether you instinctively write clean loops.</p>
    <h3>For Loops — Iterate Over a Sequence</h3>
    <pre><code>party = ["Pikachu", "Snorlax", "Gengar"]

# Basic — iterate over items
for mon in party:
    print(mon)          # Pikachu, Snorlax, Gengar

# range(stop) — 0 to stop-1
for i in range(5):      # 0, 1, 2, 3, 4
    print(i)

# range(start, stop) — start to stop-1
for i in range(2, 6):   # 2, 3, 4, 5
    print(i)

# range(start, stop, step)
for i in range(0, 10, 2):  # 0, 2, 4, 6, 8 (even numbers)
    print(i)
for i in range(5, 0, -1):  # 5, 4, 3, 2, 1 (countdown)
    print(i)</code></pre>
    <h3>enumerate — Index + Value Together</h3>
    <pre><code># Use this instead of range(len(list)) — cleaner!
for i, mon in enumerate(party):
    print(f"{i}: {mon}")   # 0: Pikachu, 1: Snorlax, 2: Gengar

# Start at 1
for i, mon in enumerate(party, start=1):
    print(f"{i}. {mon}")   # 1. Pikachu, 2. Snorlax, 3. Gengar</code></pre>
    <h3>zip — Iterate Two Lists Together</h3>
    <pre><code>names  = ["Pikachu", "Snorlax", "Gengar"]
levels = [25, 40, 30]

for name, level in zip(names, levels):
    print(f"{name} is level {level}")</code></pre>
    <h3>While Loops — Run Until Condition is False</h3>
    <pre><code>hp = 100
turn = 1
while hp &gt; 0:
    hp -= 15            # deal damage
    print(f"Turn {turn}: HP = {hp}")
    turn += 1
# Runs until hp hits 0 or below — be careful of infinite loops!</code></pre>
    <h3>break and continue</h3>
    <pre><code>for mon in party:
    if mon == "Snorlax":
        continue        # skip Snorlax, keep going
    if mon == "Gengar":
        break           # stop the loop entirely
    print(mon)

# for/else — else runs only if loop completed without break
for mon in party:
    if mon == "Mewtwo":
        break
else:
    print("Mewtwo not found!")   # runs if no break</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ <code>for i in range(len(list))</code> when you need index+value — use <code>enumerate</code></li>
      <li>❌ Modifying a list while iterating over it — iterate over a copy: <code>for x in list[:]</code></li>
      <li>❌ Forgetting to increment in while loop → infinite loop</li>
      <li>✅ <code>while True: ... if cond: break</code> is a valid pattern for "loop until done"</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png" alt="Snorlax" />
</div>`,
    quiz: [
      { q: 'What does range(3) produce?', choices: ['[1,2,3]','[0,1,2,3]','[0,1,2]','[1,2]'], answer: 2 },
      { q: 'Which exits a loop immediately?', choices: ['exit','continue','return','break'], answer: 3 },
      { q: 'What does enumerate(["a","b"], start=1) give?', choices: ['(0,"a"),(1,"b")','(1,"a"),(2,"b")','("a",1),("b",2)','Error'], answer: 1 },
      { q: 'What does continue do?', choices: ['Exits the loop','Skips to the next iteration','Restarts the loop','Pauses execution'], answer: 1 },
      { q: 'range(2, 10, 3) produces?', choices: ['[2,3,4]','[2,5,8]','[2,4,6,8]','[3,6,9]'], answer: 1 },
      { q: 'for/else — when does the else block run?', choices: ['Always','When the loop body is empty','When no break occurred','When continue is used'], answer: 2 },
    ],
    starterCode: `party = ["Pikachu", "Snorlax", "Gengar"]\n\n# enumerate\nfor i, mon in enumerate(party, start=1):\n    print(f"{i}. {mon}")\n\n# zip\nlevels = [25, 40, 30]\nfor mon, lvl in zip(party, levels):\n    print(f"{mon}: Lv.{lvl}")\n\n# range with step\nfor i in range(10, 0, -2):  # 10,8,6,4,2\n    print(i, end=" ")\nprint()\n\n# break and continue\nfor mon in party:\n    if mon == "Snorlax": continue\n    print(mon)`,
    challenge: {
      prompt: `1. Print a multiplication table for 7: "7 x 1 = 7" through "7 x 10 = 70"\n\n2. Given two lists, use zip to build a dict:\n   names  = ["Pikachu","Charizard","Snorlax"]\n   levels = [25, 36, 40]\n   Result: {"Pikachu": 25, "Charizard": 36, "Snorlax": 40}\n\n3. Find the FIRST Pokémon in the party whose name starts with "C" using a for loop + break. If none found, print "Not found" (use for/else).`,
      code: `# 1. Multiplication table for 7\n\n# 2. Build dict with zip\nnames  = ["Pikachu","Charizard","Snorlax"]\nlevels = [25, 36, 40]\n\n# 3. Find first Pokemon starting with C\nparty = ["Pikachu","Snorlax","Charizard","Gengar","Clefairy"]\n`
    }
  },
  {
    id: 'py_functions', track: 'python', title: 'Functions',
    pokemon: { id: 150, name: 'Mewtwo' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Functions</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Every interview solution is a function. You need to write clean, correct functions fast — with proper parameters, return values, and defaults. You'll also see lambdas constantly in sorting and filtering.</p>
    <h3>Defining and Calling</h3>
    <pre><code>def calculate_damage(attack, defense, level=1):
    # Parameters: attack, defense are required
    # level has a default value of 1
    base = (attack * 2 * level) / defense
    return round(base, 1)   # return sends the value back to the caller

result = calculate_damage(50, 30)       # level defaults to 1
result2 = calculate_damage(50, 30, 5)  # level = 5
result3 = calculate_damage(attack=80, defense=40)  # keyword args</code></pre>
    <h3>Return Multiple Values</h3>
    <pre><code>def min_max(nums):
    return min(nums), max(nums)  # returns a tuple

lo, hi = min_max([3, 1, 4, 1, 5, 9])
print(lo, hi)   # 1 9

# Without unpacking:
result = min_max([3, 1, 4])
print(result)       # (1, 4)
print(result[0])    # 1</code></pre>
    <h3>*args and **kwargs — Variable Arguments</h3>
    <pre><code>def total_damage(*attacks):   # *args = any number of positional args
    return sum(attacks)

print(total_damage(10, 20, 30))  # 60

def create_pokemon(**stats):  # **kwargs = keyword args as a dict
    return stats

p = create_pokemon(name="Pikachu", level=25, hp=35)
print(p)  # {"name": "Pikachu", "level": 25, "hp": 35}</code></pre>
    <h3>Lambda — Anonymous One-Line Functions</h3>
    <pre><code># lambda args: expression
double = lambda x: x * 2
is_super = lambda mult: mult >= 2.0
add = lambda a, b: a + b

# Most useful as inline sorting keys:
party = [("Snorlax",40), ("Pikachu",25), ("Mewtwo",80)]
party.sort(key=lambda p: p[1])         # sort by level
party.sort(key=lambda p: p[1], reverse=True)  # descending</code></pre>
    <h3>Scope — Where Variables Live</h3>
    <pre><code>x = 10          # global variable

def foo():
    x = 5       # local variable — does NOT affect global x
    print(x)    # 5

foo()
print(x)        # 10 — unchanged

def bar():
    global x    # explicitly reference the global
    x = 99

bar()
print(x)        # 99 — now changed</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ Mutable default argument: <code>def f(items=[])</code> — the list is shared across all calls! Use <code>def f(items=None): if items is None: items = []</code></li>
      <li>❌ Forgetting <code>return</code> — function returns <code>None</code> silently</li>
      <li>✅ A function with no return statement returns <code>None</code></li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" alt="Mewtwo" />
</div>`,
    quiz: [
      { q: 'How do you define a function in Python?', choices: ['function f():','def f():','func f():','fn f():'], answer: 1 },
      { q: 'What does a function return if it has no return statement?', choices: ['0','""','None','Error'], answer: 2 },
      { q: 'What is lambda x: x*2 equivalent to?', choices: ['def f(): return x*2','def f(x): return x*2','x = 2','x*2'], answer: 1 },
      { q: 'def f(x=5) — what is 5?', choices: ['Return value','Default parameter','Global variable','Type hint'], answer: 1 },
      { q: 'a, b = min_max([3,1,4]) — what is this called?', choices: ['Assignment','Slicing','Tuple unpacking','Type casting'], answer: 2 },
      { q: 'What does *args let a function accept?', choices: ['Keyword arguments only','Any number of positional arguments','Only two arguments','Named parameters'], answer: 1 },
    ],
    starterCode: `def calculate_damage(attack, defense, level=1):\n    base = (attack * 2 * level) / defense\n    return round(base, 1)\n\n# Return multiple values\ndef min_max(nums):\n    return min(nums), max(nums)\n\nprint(calculate_damage(50, 30))\nprint(calculate_damage(50, 30, 5))\n\nlo, hi = min_max([3, 1, 4, 1, 5, 9])\nprint(f"Min: {lo}, Max: {hi}")\n\n# Lambda as sort key\nparty = [("Snorlax",40), ("Pikachu",25), ("Mewtwo",80)]\nparty.sort(key=lambda p: p[1])\nprint(party)`,
    challenge: {
      prompt: `1. Write is_palindrome(s) — returns True if s reads same forwards and backwards. Use slicing.\n\n2. Write clamp(value, lo, hi) — returns value constrained between lo and hi. One line using min/max.\n\n3. Write summarize(*nums) — takes any number of ints, returns a dict with "min", "max", "sum", "avg" (rounded to 2 decimal places).`,
      code: `# 1. Palindrome check\ndef is_palindrome(s):\n    pass\n\nprint(is_palindrome("racecar"))  # True\nprint(is_palindrome("pikachu"))  # False\n\n# 2. Clamp\ndef clamp(value, lo, hi):\n    pass  # one line!\n\nprint(clamp(150, 0, 100))  # 100\nprint(clamp(-5, 0, 100))   # 0\nprint(clamp(42, 0, 100))   # 42\n\n# 3. Summarize *args\ndef summarize(*nums):\n    pass\n\nprint(summarize(3, 1, 4, 1, 5, 9, 2, 6))`
    }
  },
  {
    id: 'py_classes', track: 'python', title: 'Classes & OOP',
    pokemon: { id: 149, name: 'Dragonite' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Classes &amp; OOP</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Interviews often ask you to design a class (LRU Cache, Trie, MinStack). You need to know how to write clean __init__, methods, and inheritance. Even when problems don't explicitly ask for OOP, using a class can make your solution cleaner.</p>
    <h3>What is a Class?</h3>
    <p>A class is a <strong>blueprint</strong>. An <strong>object/instance</strong> is a copy created from that blueprint. Each instance has its own data (attributes) but shares the same methods (functions).</p>
    <pre><code>class Pokemon:
    # __init__ is called automatically when you create an instance
    # self refers to THIS specific instance — always the first parameter
    def __init__(self, name, hp, type_="Normal"):
        self.name = name    # instance attribute
        self.hp = hp
        self.type_ = type_
        self.moves = []     # each Pokemon gets its own empty list

    def learn(self, move):
        self.moves.append(move)
        print(f"{self.name} learned {move}!")

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)  # hp never goes below 0
        if self.hp == 0:
            print(f"{self.name} fainted!")

    def __repr__(self):     # called by print() — always define this
        return f"{self.name} [{self.type_}] HP={self.hp}"

# Create instances
p1 = Pokemon("Squirtle", 50, "Water")
p2 = Pokemon("Charizard", 80, "Fire")

p1.learn("Bubble")
p2.take_damage(100)   # will faint
print(p1)             # Squirtle [Water] HP=50</code></pre>
    <h3>Inheritance — Child Extends Parent</h3>
    <pre><code>class FirePokemon(Pokemon):  # inherits everything from Pokemon
    def __init__(self, name, hp):
        super().__init__(name, hp, type_="Fire")  # call parent __init__
        self.flame_charge = 3   # extra attribute

    def flamethrower(self, other):
        if self.flame_charge &gt; 0:
            other.take_damage(40)
            self.flame_charge -= 1
            print(f"{self.name} uses Flamethrower! ({self.flame_charge} left)")
        else:
            print("Out of flame charge!")

charizard = FirePokemon("Charizard", 80)
squirtle  = Pokemon("Squirtle", 50)
charizard.flamethrower(squirtle)   # 40 damage
charizard.learn("Fire Blast")      # inherited from Pokemon</code></pre>
    <h3>Class vs Instance Variables</h3>
    <pre><code>class Pokemon:
    species_count = 0    # CLASS variable — shared by ALL instances

    def __init__(self, name):
        self.name = name
        Pokemon.species_count += 1   # increment the shared counter

p1 = Pokemon("Pikachu")
p2 = Pokemon("Snorlax")
print(Pokemon.species_count)  # 2</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ Forgetting <code>self</code> as first parameter → TypeError when calling</li>
      <li>❌ <code>self.moves = []</code> in __init__ (correct) vs <code>moves = []</code> as class var (shared!)</li>
      <li>✅ Always call <code>super().__init__(...)</code> in child __init__</li>
      <li>✅ Define <code>__repr__</code> so print() shows something useful</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png" alt="Dragonite" />
</div>`,
    quiz: [
      { q: 'What is __init__ called?', choices: ['Destructor','Constructor — runs automatically on creation','Main method','Class variable'], answer: 1 },
      { q: 'What does self refer to?', choices: ['The class blueprint','A static method','The current instance','The parent class'], answer: 2 },
      { q: 'What does super().__init__() do?', choices: ['Deletes the parent','Calls the parent class constructor','Creates a new instance','Resets attributes'], answer: 1 },
      { q: 'Class variables are shared by?', choices: ['Only the first instance','Each instance separately','All instances','No instances'], answer: 2 },
      { q: 'Which dunder method controls what print(obj) shows?', choices: ['__str__ or __repr__','__init__','__class__','__print__'], answer: 0 },
      { q: 'child class(ParentClass) — what does this give the child?', choices: ['Nothing extra','All parent attributes and methods','Only methods, not attributes','Only __init__'], answer: 1 },
    ],
    starterCode: `class Pokemon:\n    def __init__(self, name, hp, type_="Normal"):\n        self.name = name\n        self.hp = hp\n        self.type_ = type_\n        self.moves = []\n\n    def learn(self, move):\n        self.moves.append(move)\n\n    def take_damage(self, amount):\n        self.hp = max(0, self.hp - amount)\n\n    def __repr__(self):\n        return f"{self.name} [{self.type_}] HP={self.hp} Moves={self.moves}"\n\nclass WaterPokemon(Pokemon):\n    def __init__(self, name, hp):\n        super().__init__(name, hp, type_="Water")\n\n    def surf(self, other):\n        other.take_damage(30)\n        print(f"{self.name} uses Surf!")\n\np1 = WaterPokemon("Blastoise", 80)\np2 = Pokemon("Charizard", 80, "Fire")\np1.learn("Surf")\np1.surf(p2)\nprint(p1)\nprint(p2)`,
    challenge: {
      prompt: `Design a Stack class from scratch (this is a real interview question — LC #155 MinStack variant):\n\n- __init__: empty stack\n- push(val): add to top\n- pop(): remove and return top (return None if empty)\n- peek(): return top without removing (return None if empty)\n- is_empty(): return True if empty\n- __repr__: show the stack contents\n\nTest all methods.`,
      code: `class Stack:\n    def __init__(self):\n        self._data = []\n\n    def push(self, val):\n        pass\n\n    def pop(self):\n        pass\n\n    def peek(self):\n        pass\n\n    def is_empty(self):\n        pass\n\n    def __repr__(self):\n        return f"Stack({self._data})"\n\ns = Stack()\nprint(s.is_empty())   # True\ns.push(1)\ns.push(2)\ns.push(3)\nprint(s)              # Stack([1, 2, 3])\nprint(s.peek())       # 3\nprint(s.pop())        # 3\nprint(s)              # Stack([1, 2])`
    }
  },
  {
    id: 'py_exceptions', track: 'python', title: 'Exceptions',
    pokemon: { id: 94, name: 'Gengar' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Exceptions</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Production code and interview solutions both need error handling. Know what the common built-in exceptions are, when to raise vs catch, and how to write custom exceptions for design questions.</p>
    <h3>Try / Except / Else / Finally</h3>
    <pre><code>try:
    result = 10 / 0           # code that might fail
except ZeroDivisionError:     # handle specific error type
    print("Can't divide by zero!")
except ValueError as e:       # bind the exception to e
    print(f"Bad value: {e}")
except (TypeError, KeyError): # catch multiple types
    print("Type or key error!")
else:
    print("No error!")        # runs ONLY if no exception raised
finally:
    print("Always runs")      # cleanup — files, locks, etc.</code></pre>
    <h3>Common Built-In Exceptions</h3>
    <ul>
      <li><code>ValueError</code> — right type, wrong value: <code>int("abc")</code></li>
      <li><code>TypeError</code> — wrong type: <code>"5" + 5</code></li>
      <li><code>KeyError</code> — dict key missing: <code>d["missing"]</code></li>
      <li><code>IndexError</code> — list index out of range: <code>[1,2,3][9]</code></li>
      <li><code>AttributeError</code> — no such attribute: <code>None.upper()</code></li>
      <li><code>ZeroDivisionError</code> — dividing by zero</li>
    </ul>
    <h3>Raising and Custom Exceptions</h3>
    <pre><code># Raise a built-in exception with a message
def safe_get(lst, i):
    if i &lt; 0 or i &gt;= len(lst):
        raise IndexError(f"Index {i} is out of range for list of size {len(lst)}")
    return lst[i]

# Custom exception — inherit from Exception
class PokemonFaintedError(Exception):
    pass

class NoPokeBallsError(Exception):
    def __init__(self, needed, have):
        super().__init__(f"Need {needed} balls, only have {have}")

def catch(pokemon, balls_needed, balls_have):
    if balls_have &lt; balls_needed:
        raise NoPokeBallsError(balls_needed, balls_have)
    return f"Caught {pokemon}!"

try:
    print(catch("Mewtwo", 5, 2))
except NoPokeBallsError as e:
    print(f"Failed: {e}")</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ Bare <code>except:</code> — catches everything including KeyboardInterrupt</li>
      <li>❌ <code>except Exception: pass</code> — silently swallows bugs</li>
      <li>✅ Always catch the most specific exception you can</li>
      <li>✅ Use <code>raise</code> (no args) inside except to re-raise the same exception</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png" alt="Gengar" />
</div>`,
    quiz: [
      { q: 'Which block always executes?', choices: ['try','except','else','finally'], answer: 3 },
      { q: 'When does the else block run?', choices: ['Always','When an exception occurs','When NO exception occurs','After finally'], answer: 2 },
      { q: 'What exception does int("abc") raise?', choices: ['TypeError','ValueError','KeyError','AttributeError'], answer: 1 },
      { q: 'What does "raise" (no args) do inside except?', choices: ['Raises a new generic error','Re-raises the current exception','Stops execution silently','Clears the error'], answer: 1 },
      { q: 'What exception does d["x"] raise when x not in d?', choices: ['ValueError','IndexError','KeyError','AttributeError'], answer: 2 },
      { q: 'Custom exceptions should inherit from?', choices: ['object','BaseException','Exception','Error'], answer: 2 },
    ],
    starterCode: `# See all common exception types in action\ntests = [\n    ("int('abc')",    lambda: int("abc")),\n    ("[1,2,3][10]",   lambda: [1,2,3][10]),\n    ('{}["key"]',     lambda: {}["key"]),\n    ('"x" + 5',       lambda: "x" + 5),\n    ("1 / 0",         lambda: 1 / 0),\n]\nfor desc, fn in tests:\n    try:\n        fn()\n    except Exception as e:\n        print(f"{desc} -> {type(e).__name__}: {e}")`,
    challenge: {
      prompt: `Write a safe_divide(a, b) function:\n- Raises ValueError if a or b is not int or float (use isinstance)\n- Raises ZeroDivisionError with message "Cannot divide by zero" if b == 0\n- Otherwise returns a / b rounded to 2 decimal places\n\nThen write calculator(expression) that:\n- Takes a string like "10 / 2" or "5 / 0"\n- Splits it, converts to numbers, calls safe_divide\n- Prints the result or a friendly error message for each case`,
      code: `def safe_divide(a, b):\n    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):\n        raise ValueError(f"Expected numbers, got {type(a).__name__} and {type(b).__name__}")\n    if b == 0:\n        raise ZeroDivisionError("Cannot divide by zero")\n    return round(a / b, 2)\n\ndef calculator(expression):\n    parts = expression.split()\n    a, op, b = float(parts[0]), parts[1], float(parts[2])\n    # Call safe_divide and handle errors\n    pass\n\ncalculator("10 / 2")\ncalculator("5 / 0")\ncalculator("15 / 4")`
    }
  },
  {
    id: 'py_comprehensions', track: 'python', title: 'Comprehensions',
    pokemon: { id: 196, name: 'Espeon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Comprehensions</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Comprehensions are the most "Pythonic" way to transform data. Interviewers notice when you use them well — they signal fluency. They also replace verbose for-loops with readable one-liners.</p>
    <h3>List Comprehension — The Core Pattern</h3>
    <pre><code># [expression for item in iterable if condition]
#  ^what to keep  ^loop variable  ^optional filter

nums = [1, 2, 3, 4, 5]
squared = [x**2 for x in nums]          # [1, 4, 9, 16, 25]
even    = [x for x in nums if x%2==0]  # [2, 4]
evensq  = [x**2 for x in nums if x%2==0]  # [4, 16]

# Works on any iterable
upper = [c.upper() for c in "pikachu"]  # ['P','I','K','A','C','H','U']
flat  = [x for row in [[1,2],[3,4]] for x in row]  # [1,2,3,4]</code></pre>
    <h3>Dict and Set Comprehensions</h3>
    <pre><code># Dict comprehension: {key: value for ...}
sq_map   = {x: x**2 for x in range(1, 6)}   # {1:1, 2:4, 3:9, 4:16, 5:25}
inverted = {v: k for k, v in {"a":1,"b":2}.items()}  # {1:"a", 2:"b"}

# Set comprehension: {expression for ...} — automatically deduplicates
types  = {p[1] for p in [("Pikachu","Electric"),("Raichu","Electric"),("Snorlax","Normal")]}
# {"Electric", "Normal"}</code></pre>
    <h3>Generator Expressions — Memory Efficient</h3>
    <pre><code># Like a list comprehension but lazy — computes values one at a time
# Use () instead of []
total = sum(x**2 for x in range(1000000))  # doesn't build a 1M-item list!
any_big = any(x > 100 for x in nums)       # stops as soon as it finds one</code></pre>
    <h3>map, filter — Functional Style</h3>
    <pre><code># map(function, iterable) — apply function to every item
doubled = list(map(lambda x: x*2, [1,2,3]))    # [2, 4, 6]
# equivalent: [x*2 for x in [1,2,3]]

# filter(function, iterable) — keep items where function returns True
big = list(filter(lambda x: x > 3, [1,2,3,4,5]))  # [4, 5]
# equivalent: [x for x in [1,2,3,4,5] if x > 3]

# In interviews, comprehensions are usually clearer than map/filter</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ Nested comprehension confusion: <code>[x for row in matrix for x in row]</code> — read left-to-right like nested for loops</li>
      <li>❌ Using list comprehension when you only need to iterate once — use a generator instead</li>
      <li>✅ <code>any()</code> and <code>all()</code> with generators short-circuit — very fast</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png" alt="Espeon" />
</div>`,
    quiz: [
      { q: 'What does [x*2 for x in range(3)] produce?', choices: ['[1,2,3]','[0,2,4]','[2,4,6]','[0,1,2]'], answer: 1 },
      { q: 'What does {x: x**2 for x in [1,2,3]} produce?', choices: ['[1,4,9]','{1:1,2:4,3:9}','{1,4,9}','(1,4,9)'], answer: 1 },
      { q: 'A set comprehension uses which brackets?', choices: ['[]','()','{}','<>'], answer: 2 },
      { q: 'Generator expression uses which brackets?', choices: ['[]','()','{}','<>'], answer: 1 },
      { q: '[x for row in [[1,2],[3,4]] for x in row] produces?', choices: ['[[1,2],[3,4]]','[1,2,3,4]','[(1,2),(3,4)]','Error'], answer: 1 },
      { q: 'What is the advantage of a generator over a list comprehension?', choices: ['Faster to write','Uses less memory — lazy evaluation','Can be indexed','Always faster'], answer: 1 },
    ],
    starterCode: `nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# List comprehensions\nsquared = [x**2 for x in nums]\neven_sq = [x**2 for x in nums if x % 2 == 0]\nprint(squared)\nprint(even_sq)\n\n# Dict comprehension\nsq_map = {x: x**2 for x in range(1, 6)}\nprint(sq_map)\n\n# Set comprehension (deduplicates)\ntypes = {t for t in ["Fire","Water","Fire","Grass","Water"]}\nprint(types)\n\n# Generator with any/all\nprint(any(x > 8 for x in nums))    # True\nprint(all(x > 0 for x in nums))    # True`,
    challenge: {
      prompt: `pokemon = [("Pikachu","Electric",25),("Snorlax","Normal",40),("Charizard","Fire",36),("Blastoise","Water",36),("Mewtwo","Psychic",70)]\n\nUsing ONLY comprehensions (no for loops):\n1. List of names in uppercase\n2. List of (name, level) tuples for Pokemon with level >= 36\n3. Dict mapping name to type\n4. Set of all unique types\n5. Total XP = sum of all levels squared (use generator expression)\n6. List of names sorted by level descending (sorted() + key)`,
      code: `pokemon = [("Pikachu","Electric",25),("Snorlax","Normal",40),\n           ("Charizard","Fire",36),("Blastoise","Water",36),\n           ("Mewtwo","Psychic",70)]\n\n# 1. Uppercase names\n\n# 2. (name, level) for level >= 36\n\n# 3. Dict: name -> type\n\n# 4. Unique types (set)\n\n# 5. Total XP (sum of level^2)\n\n# 6. Names sorted by level desc\n`
    }
  },
  {
    id: 'py_sorting', track: 'python', title: 'Sorting & Built-ins',
    pokemon: { id: 448, name: 'Lucario' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Sorting &amp; Built-ins</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Python's built-ins are your secret weapon in interviews. Knowing sort(), sorted(), max(key=), min(key=), and string methods cold lets you write clean solutions in half the lines. Interviewers love seeing fluent use of these.</p>
    <h3>sort() vs sorted()</h3>
    <pre><code># list.sort() — modifies the list IN PLACE, returns None
nums = [3, 1, 4, 1, 5]
nums.sort()                     # nums is now [1, 1, 3, 4, 5]
nums.sort(reverse=True)         # [5, 4, 3, 1, 1]

# sorted() — returns a NEW sorted list, original unchanged
original = [3, 1, 4, 1, 5]
result = sorted(original)       # [1, 1, 3, 4, 5]
print(original)                 # [3, 1, 4, 1, 5] — unchanged!

# Key function — sort by a custom value
party = [("Pikachu",25), ("Mewtwo",80), ("Eevee",12)]
by_level = sorted(party, key=lambda x: x[1])          # ascending by level
top_first = sorted(party, key=lambda x: x[1], reverse=True)

# Sort by multiple criteria: primary key, then secondary
words = ["banana","apple","cherry","fig","date"]
sorted(words, key=lambda w: (len(w), w))   # by length, then alphabetically</code></pre>
    <h3>Essential Built-ins</h3>
    <pre><code>nums = [3, 1, 4, 1, 5, 9, 2, 6]

max(nums)                       # 9
min(nums)                       # 1
sum(nums)                       # 31
len(nums)                       # 8
abs(-5)                         # 5
round(3.14159, 2)               # 3.14

max(party, key=lambda x: x[1]) # ("Mewtwo",80) — max by level!
min(party, key=lambda x: x[1]) # ("Eevee",12)

# any / all
any(x > 8 for x in nums)       # True — at least one > 8
all(x > 0 for x in nums)       # True — all positive</code></pre>
    <h3>String Methods — Use These in Problems</h3>
    <pre><code>s = "  Hello, World!  "
s.strip()           # "Hello, World!" — remove whitespace
s.lower()           # "  hello, world!  "
s.upper()           # "  HELLO, WORLD!  "
s.replace("Hello", "Hi")  # "  Hi, World!  "
s.split(", ")       # ["  Hello", "World!  "]
"-".join(["a","b","c"])   # "a-b-c"
s.startswith("  H")       # True
s.endswith("!  ")         # True
"abc".count("a")          # 1
"pikachu".index("k")      # 2 (position of "k")</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ <code>result = nums.sort()</code> — sort() returns None! Use <code>sorted(nums)</code> if you need the value</li>
      <li>✅ Use <code>max(items, key=func)</code> instead of sorting then taking last — O(n) vs O(n log n)</li>
      <li>✅ <code>",".join(list)</code> — items must be strings; use <code>",".join(str(x) for x in list)</code></li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png" alt="Lucario" />
</div>`,
    quiz: [
      { q: 'What does list.sort() return?', choices: ['The sorted list','A new sorted list','None — sorts in place','A sorted copy'], answer: 2 },
      { q: 'How do you get the max item by a custom key without sorting?', choices: ['nums[-1]','sorted(nums)[-1]','max(nums, key=func)','nums.sort()[-1]'], answer: 2 },
      { q: 'What does "a,b,c".split(",") return?', choices: ["['a','b','c']","('a','b','c')","['a,b,c']","'abc'"], answer: 0 },
      { q: 'Which is O(n) — finding max vs sorting?', choices: ['Both O(n)','max() is O(n), sort is O(n log n)','Both O(n log n)','Sort is O(n)'], answer: 1 },
      { q: 'sorted(words, key=lambda w: len(w)) sorts by?', choices: ['Alphabetical','Word length','Reverse alpha','Nothing'], answer: 1 },
      { q: 'all(x > 0 for x in [-1,2,3]) returns?', choices: ['True','False','[False,True,True]','Error'], answer: 1 },
    ],
    starterCode: `# sort() vs sorted()\nnums = [3, 1, 4, 1, 5, 9]\nresult = sorted(nums)      # new list\nnums.sort(reverse=True)    # in place\nprint(result)              # [1,1,3,4,5,9]\nprint(nums)                # [9,5,4,3,1,1]\n\n# Sort by key\nparty = [("Pikachu",25), ("Mewtwo",80), ("Eevee",12)]\nprint(sorted(party, key=lambda x: x[1]))\nprint(max(party, key=lambda x: x[1]))   # fastest Pokemon level\n\n# String methods\nraw = "  pikachu,snorlax,gengar  "\nnames = [n.strip().title() for n in raw.strip().split(",")]\nprint(names)\nprint(" | ".join(names))`,
    challenge: {
      prompt: `Given a list of player scores:\nscores = [("Ash",850),("Misty",920),("Brock",760),("Gary",980),("Jessie",540)]\n\n1. Print leaderboard sorted by score descending with rank numbers\n2. Print the top 3 players only\n3. Find the player with the LOWEST score using min() with key\n4. Calculate the average score (round to 1 decimal)\n5. Create a string: "Leaderboard: Ash(850) > Misty(920) > ..." sorted descending`,
      code: `scores = [("Ash",850),("Misty",920),("Brock",760),("Gary",980),("Jessie",540)]\n\n# 1. Ranked leaderboard (sorted desc)\n\n# 2. Top 3\n\n# 3. Lowest score player\n\n# 4. Average score\n\n# 5. Leaderboard string sorted desc\n`
    }
  },

  // ── DATA STRUCTURES ──
  {
    id: 'ds_arrays', track: 'ds', title: 'Arrays & Two Pointers',
    pokemon: { id: 448, name: 'Lucario' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Arrays &amp; Two Pointers</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Two pointers is one of the most frequently tested patterns. It reduces O(n²) brute force to O(n) by using two indices that move toward each other (or in the same direction). Recognize it when: the array is sorted, you need pairs/subarrays, or you need to compare from both ends.</p>
    <h3>Pattern: Opposite Ends (Sorted Array)</h3>
    <p>Start left=0, right=end. Move inward based on comparison. Each element is visited at most once → O(n).</p>
    <pre><code># Two Sum on SORTED array — O(n) time, O(1) space
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left &lt; right:          # stop when pointers meet
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]   # found it
        elif s &lt; target:
            left += 1             # sum too small → move left pointer right (bigger value)
        else:
            right -= 1            # sum too big → move right pointer left (smaller value)
    return []

# Why does this work? Because the array is sorted.
# Moving left pointer right always increases sum.
# Moving right pointer left always decreases sum.

print(two_sum_sorted([1,3,6,8,11], 9))  # [1,3] — indices of 3 and 6</code></pre>
    <h3>Pattern: Same Direction (Fast/Slow)</h3>
    <pre><code># Remove duplicates in-place from sorted array — O(n) time, O(1) space
# slow pointer: tracks where to write the next unique value
# fast pointer: scans ahead looking for new values
def remove_dups(nums):
    if not nums: return 0
    slow = 0                          # slow marks the last "kept" position
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:  # found a new unique value
            slow += 1
            nums[slow] = nums[fast]   # write it to the next position
    return slow + 1                   # number of unique elements

nums = [1,1,2,3,3,4]
k = remove_dups(nums)
print(nums[:k])  # [1,2,3,4]</code></pre>
    <h3>Pattern Recognition</h3>
    <ul>
      <li>"Find pair that sums to X" in sorted array → opposite-end two pointers</li>
      <li>"Remove duplicates / filter in-place" → fast/slow same-direction pointers</li>
      <li>"Is palindrome" → compare from both ends, move inward</li>
      <li>"Container with most water" → opposite ends, move the shorter side</li>
    </ul>
    <h3>Complexity</h3>
    <ul>
      <li><strong>Time: O(n)</strong> — each pointer moves at most n steps total</li>
      <li><strong>Space: O(1)</strong> — no extra data structures, just two index variables</li>
    </ul>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ Using two pointers on an unsorted array for sum problems — won't work</li>
      <li>❌ <code>while left &lt;= right</code> — should be <code>&lt;</code> (equal means they're the same element)</li>
      <li>✅ Always check: does this array need to be sorted first?</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png" alt="Lucario" />
</div>`,
    quiz: [
      { q: 'Time complexity of two-pointer on sorted array?', choices: ['O(n²)','O(n log n)','O(n)','O(1)'], answer: 2 },
      { q: 'When sum < target (opposite-end), you move which pointer?', choices: ['Right pointer left','Left pointer right','Both inward','Neither'], answer: 1 },
      { q: 'What is the space complexity of two-pointer?', choices: ['O(n)','O(log n)','O(1)','O(n²)'], answer: 2 },
      { q: 'Two pointers works on sorted arrays. Why?', choices: ['Sorted arrays are smaller','Moving a pointer predictably increases or decreases the sum','Python sorts faster','No particular reason'], answer: 1 },
      { q: 'In fast/slow pointers, the slow pointer tracks?', choices: ['The current element','Where to write the next valid value','The maximum','The right end'], answer: 1 },
      { q: 'Which problem is NOT naturally a two-pointer problem?', choices: ['Palindrome check','Two sum (sorted)','Finding max in unsorted array','Remove duplicates in-place'], answer: 2 },
    ],
    starterCode: `def two_sum_sorted(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        s = nums[left] + nums[right]\n        if s == target:\n            return [left, right]\n        elif s < target:\n            left += 1\n        else:\n            right -= 1\n    return []\n\nprint(two_sum_sorted([1,3,6,8,11], 9))`,
    challenge: {
      prompt: `Write a function is_palindrome(s) that checks if a string reads the same forwards and backwards — using two pointers (not slicing).\n\nIgnore case. Test with: "racecar", "Pikachu", "level", "MewM"`,
      code: `def is_palindrome(s):\n    s = s.lower()\n    left, right = 0, len(s) - 1\n    # Use two pointers\n    pass\n\nfor word in ["racecar", "Pikachu", "level", "MewM"]:\n    print(f"{word}: {is_palindrome(word)}")`
    }
  },
  {
    id: 'ds_hashmaps', track: 'ds', title: 'Hash Maps & Sets',
    pokemon: { id: 82, name: 'Magneton' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Hash Maps &amp; Sets</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Hash maps are the single most important data structure for interviews. They convert O(n²) brute force into O(n) by trading space for lookup speed. The mental trigger: "I need to know if I've seen X before" or "I need to count occurrences of X" → use a hash map or set.</p>
    <h3>Two Sum — The Classic Hash Map Problem</h3>
    <pre><code># Brute force: O(n²) — try all pairs
# Hash map: O(n) — for each number, ask "is its complement already in the map?"

def two_sum(nums, target):
    seen = {}           # maps value → index
    for i, n in enumerate(nums):
        complement = target - n   # what we need to pair with n
        if complement in seen:    # O(1) lookup — found the pair!
            return [seen[complement], i]
        seen[n] = i               # remember n at index i for future iterations
    return []

# Walk through: nums=[2,7,11,15], target=9
# i=0, n=2, complement=7, seen={},  7 not in seen, seen={2:0}
# i=1, n=7, complement=2, seen={2:0}, 2 IS in seen → return [0,1]</code></pre>
    <h3>Sets — When You Only Care About Existence</h3>
    <pre><code>seen = set()           # only stores keys, no values — O(1) add/lookup/remove

# Has duplicate?
def has_duplicate(nums):
    seen = set()
    for n in nums:
        if n in seen:      # O(1) check
            return True
        seen.add(n)
    return False

# Set operations — very useful
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)    # {3, 4}     — intersection
print(a | b)    # {1,2,3,4,5,6} — union
print(a - b)    # {1, 2}     — difference (in a but not b)</code></pre>
    <h3>Counter — Frequency Counting Made Easy</h3>
    <pre><code>from collections import Counter

freq = Counter("pikachu")      # {'p':1,'i':1,'k':1,'a':1,'c':1,'h':1,'u':1}
freq = Counter([1,2,2,3,3,3]) # {3:3, 2:2, 1:1}

# Most common
freq.most_common(2)            # [(3, 3), (2, 2)] — top 2 most frequent

# Anagram check — O(n)
def is_anagram(s, t):
    return Counter(s) == Counter(t)

# Group anagrams by sorted-letter key
from collections import defaultdict
def group_anagrams(words):
    groups = defaultdict(list)  # auto-creates [] for new keys
    for w in words:
        key = tuple(sorted(w))  # "eat" → ('a','e','t')
        groups[key].append(w)
    return list(groups.values())</code></pre>
    <h3>defaultdict — No More KeyError on New Keys</h3>
    <pre><code>from collections import defaultdict

# Adjacency list for a graph
graph = defaultdict(list)
graph["A"].append("B")   # no need to check if "A" exists first
graph["A"].append("C")

# Frequency count
freq = defaultdict(int)
for char in "pikachu":
    freq[char] += 1      # starts at 0 automatically</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ <code>val in d.values()</code> — this is O(n), not O(1). Check keys instead</li>
      <li>✅ Use a set when you only need membership, not counts</li>
      <li>✅ <code>defaultdict(list)</code> for grouping, <code>defaultdict(int)</code> for counting</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/82.png" alt="Magneton" />
</div>`,
    quiz: [
      { q: 'Average time complexity of a hash map lookup?', choices: ['O(n)','O(log n)','O(1)','O(n²)'], answer: 2 },
      { q: 'In Two Sum hash map, what do you store as the value?', choices: ['The target','The complement','The index','The number itself'], answer: 2 },
      { q: 'What does Counter("aab") return?', choices: ["{'a':2,'b':1}","['a','a','b']","3","{'a':1,'b':1}"], answer: 0 },
      { q: 'What is the time complexity of "x in my_set"?', choices: ['O(n)','O(log n)','O(1)','O(n²)'], answer: 2 },
      { q: 'defaultdict(list) — what happens when you access a missing key?', choices: ['KeyError','Returns None','Creates an empty list for that key','Returns 0'], answer: 2 },
      { q: 'a = {1,2,3}, b = {2,3,4}. What is a & b?', choices: ['{1,2,3,4}','{2,3}','{1}','{4}'], answer: 1 },
    ],
    starterCode: `from collections import Counter\n\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        comp = target - n\n        if comp in seen:\n            return [seen[comp], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2,7,11,15], 9))\nprint(Counter("pikachu"))`,
    challenge: {
      prompt: `Write a function first_duplicate(nums) that returns the first number that appears more than once, or -1 if none exists. Use a hash set for O(n) time.\n\nTest with: [4,3,2,7,8,2,3,1] → 2\n           [1,2,3,4] → -1`,
      code: `def first_duplicate(nums):\n    seen = set()\n    # Check each number\n    pass\n\nprint(first_duplicate([4,3,2,7,8,2,3,1]))\nprint(first_duplicate([1,2,3,4]))`
    }
  },
  {
    id: 'ds_stacks', track: 'ds', title: 'Stacks & Queues',
    pokemon: { id: 100, name: 'Voltorb' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Stacks &amp; Queues</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Stacks appear in matching problems (parentheses, brackets), monotonic stack problems (next greater element), and DFS. Queues appear in BFS and level-order traversal. Recognizing which to use is a key interview skill.</p>
    <h3>Stack — LIFO (Last In, First Out)</h3>
    <pre><code># Use a Python list as a stack
stack = []
stack.append("Pikachu")   # push — O(1)
stack.append("Snorlax")
stack.append("Gengar")
top = stack[-1]            # peek — see top without removing: "Gengar"
popped = stack.pop()       # pop — remove and return top: "Gengar", O(1)
is_empty = len(stack) == 0</code></pre>
    <h3>Classic Stack Problem: Valid Parentheses</h3>
    <pre><code>def is_valid(s):
    stack = []
    pairs = {')':'(', ']':'[', '}':'{'}  # closing → matching opening
    for ch in s:
        if ch in '([{':
            stack.append(ch)              # push opening brackets
        elif not stack:
            return False                  # closing bracket but stack is empty!
        elif stack[-1] == pairs[ch]:
            stack.pop()                   # top matches → valid pair, pop it
        else:
            return False                  # mismatch
    return len(stack) == 0               # valid only if nothing left over

# Trace: "([)]"
# '(' → stack: ['(']
# '[' → stack: ['(','[']
# ')' → top is '[', pairs[')'] is '(' — mismatch! → False</code></pre>
    <h3>Monotonic Stack — Next Greater Element Pattern</h3>
    <pre><code># Find next greater element for each position — O(n)
def next_greater(nums):
    result = [-1] * len(nums)   # default: no greater element
    stack = []                  # stores indices
    for i, n in enumerate(nums):
        # While stack has elements smaller than current, we found their answer
        while stack and nums[stack[-1]] &lt; n:
            idx = stack.pop()
            result[idx] = n
        stack.append(i)
    return result

print(next_greater([2,1,2,4,3]))  # [4,2,4,-1,-1]</code></pre>
    <h3>Queue — FIFO (First In, First Out)</h3>
    <pre><code>from collections import deque  # double-ended queue — O(1) on both ends

q = deque()
q.append("first")     # enqueue to right — O(1)
q.append("second")
front = q[0]          # peek front: "first"
item = q.popleft()    # dequeue from left — O(1)  ← KEY: list.pop(0) is O(n)!

# deque also supports:
q.appendleft(x)       # add to left — O(1)
q.pop()               # remove from right — O(1)</code></pre>
    <h3>When to Use Which</h3>
    <ul>
      <li><strong>Stack</strong> — matching pairs, "undo" operations, DFS, function call tracking</li>
      <li><strong>Queue</strong> — BFS, level-order traversal, processing in order received</li>
      <li><strong>Monotonic stack</strong> — "next/previous greater/smaller element" problems</li>
    </ul>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ <code>list.pop(0)</code> for queue — O(n)! Use <code>deque.popleft()</code></li>
      <li>❌ Checking stack top without checking if stack is empty first → IndexError</li>
      <li>✅ Always: <code>if stack and stack[-1] == ...</code> — check non-empty first</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png" alt="Voltorb" />
</div>`,
    quiz: [
      { q: 'Stack removes items in what order?', choices: ['FIFO','LIFO','Random','Sorted'], answer: 1 },
      { q: 'Why use deque.popleft() instead of list.pop(0)?', choices: ['deque holds more items','list.pop(0) is O(n); deque.popleft() is O(1)','deque is sorted','No practical difference'], answer: 1 },
      { q: 'In Valid Parentheses, when do you pop the stack?', choices: ['On every character','On opening brackets','When top matches the current closing bracket','Never'], answer: 2 },
      { q: 'If is_valid("([)]") is called, it returns?', choices: ['True','False','Error','None'], answer: 1 },
      { q: 'Monotonic stack problems typically ask about?', choices: ['Sorting','Next/previous greater or smaller elements','Graph shortest path','Anagram detection'], answer: 1 },
      { q: 'How do you peek the top of a stack without removing it?', choices: ['stack.peek()','stack.top()','stack[-1]','stack.pop() then push back'], answer: 2 },
    ],
    starterCode: `def is_valid(s):\n    stack = []\n    pairs = {')':'(', ']':'[', '}':'{'}\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif stack and stack[-1] == pairs[ch]:\n            stack.pop()\n        else:\n            return False\n    return len(stack) == 0\n\nprint(is_valid("()[]{}"))\nprint(is_valid("(]"))`,
    challenge: {
      prompt: `Use a stack to reverse a string without using slicing or reversed().\n\nWrite reverse_string(s) that pushes each character onto a stack, then pops them all to build the reversed string.\n\nTest with: "Pikachu", "hello", "racecar"`,
      code: `def reverse_string(s):\n    stack = []\n    # Push all chars\n    \n    # Pop all chars to build result\n    result = ""\n    \n    return result\n\nfor word in ["Pikachu", "hello", "racecar"]:\n    print(reverse_string(word))`
    }
  },
  {
    id: 'ds_linkedlist', track: 'ds', title: 'Linked Lists',
    pokemon: { id: 235, name: 'Smeargle' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Linked Lists</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Linked lists are a staple of technical interviews. The key skill is pointer manipulation — re-wiring .next references without losing nodes. The two most important techniques are iterative reversal and the slow/fast pointer.</p>
    <h3>Structure</h3>
    <pre><code>class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val    # data stored at this node
        self.next = next  # pointer to the next node (or None if last)

# Building a list: 1 → 2 → 3 → None
n3 = ListNode(3)        # 3 → None
n2 = ListNode(2, n3)    # 2 → 3 → None
n1 = ListNode(1, n2)    # 1 → 2 → 3 → None
head = n1               # head is the entry point

# Traversal
curr = head
while curr:
    print(curr.val)     # 1, 2, 3
    curr = curr.next</code></pre>
    <h3>Reversing a Linked List — Must Memorize</h3>
    <pre><code># You need 3 variables: prev, curr, nxt
# At each step: save next, flip pointer, advance
def reverse_list(head):
    prev = None    # will become the new tail
    curr = head
    while curr:
        nxt = curr.next   # 1. save next before we overwrite it
        curr.next = prev  # 2. flip the pointer backwards
        prev = curr       # 3. advance prev
        curr = nxt        # 4. advance curr
    return prev           # prev is now the new head

# Trace: 1→2→3→None
# Step 1: nxt=2, 1.next=None, prev=1, curr=2
# Step 2: nxt=3, 2.next=1,    prev=2, curr=3
# Step 3: nxt=None, 3.next=2, prev=3, curr=None → done
# Result: 3→2→1→None</code></pre>
    <h3>Floyd's Cycle Detection — Slow/Fast Pointers</h3>
    <pre><code># If there's a cycle, fast will eventually lap slow and they'll meet
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:   # fast needs 2 steps, check both
        slow = slow.next        # move 1 step
        fast = fast.next.next   # move 2 steps
        if slow == fast:
            return True         # they met — cycle exists!
    return False                # fast reached end — no cycle

# Same pattern for finding the middle node:
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow  # when fast reaches end, slow is at middle</code></pre>
    <h3>Complexity vs Arrays</h3>
    <ul>
      <li>Insert at head: <strong>O(1)</strong> linked list vs O(n) array (shift needed)</li>
      <li>Access by index: <strong>O(n)</strong> linked list vs O(1) array</li>
      <li>Search: <strong>O(n)</strong> both</li>
      <li>No random access — must traverse from head</li>
    </ul>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ Losing a node by overwriting .next before saving it — always save nxt first</li>
      <li>❌ <code>while fast.next and fast.next.next</code> order matters — check fast.next before fast.next.next</li>
      <li>✅ Use a dummy head node for operations that might modify the head</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/235.png" alt="Smeargle" />
</div>`,
    quiz: [
      { q: 'Inserting at the head of a linked list is?', choices: ['O(n)','O(log n)','O(1)','O(n²)'], answer: 2 },
      { q: 'Accessing index i in a linked list is?', choices: ['O(1)','O(log n)','O(n)','O(n²)'], answer: 2 },
      { q: "In Floyd's algorithm, fast moves how many steps?", choices: ['One','Two','Three','Varies'], answer: 1 },
      { q: 'When reversing, what must you save FIRST before flipping curr.next?', choices: ['prev','curr','curr.next (nxt)','head'], answer: 2 },
      { q: 'When fast pointer reaches None, slow pointer is at?', choices: ['Head','Tail','Middle','End-1'], answer: 2 },
      { q: 'Why is linked list head insert faster than array?', choices: ['Linked lists are faster in general','No shifting required — just update pointer','Arrays use more memory','Linked lists are sorted'], answer: 1 },
    ],
    starterCode: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n\nn3 = ListNode(3)\nn2 = ListNode(2, n3)\nn1 = ListNode(1, n2)\nrev = reverse_list(n1)\nwhile rev:\n    print(rev.val, end=" -> ")\n    rev = rev.next`,
    challenge: {
      prompt: `Write a function get_middle(head) that returns the value of the middle node of a linked list using the slow/fast pointer technique (no counting, one pass).\n\nFor even length, return the second middle node.\n\nBuild list: 1 → 2 → 3 → 4 → 5 (middle = 3)\nBuild list: 1 → 2 → 3 → 4 (middle = 3)`,
      code: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef get_middle(head):\n    slow = fast = head\n    # Move slow by 1, fast by 2\n    \n    return slow.val\n\n# Build 1->2->3->4->5\ndef build(vals):\n    head = ListNode(vals[0])\n    cur = head\n    for v in vals[1:]:\n        cur.next = ListNode(v)\n        cur = cur.next\n    return head\n\nprint(get_middle(build([1,2,3,4,5])))\nprint(get_middle(build([1,2,3,4])))`
    }
  },
  {
    id: 'ds_trees', track: 'ds', title: 'Binary Trees',
    pokemon: { id: 357, name: 'Tropius' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Binary Trees</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Binary trees are one of the most tested topics in FAANG interviews. You must internalize DFS (recursive) and BFS (iterative with queue) cold — they are templates you apply to dozens of problems.</p>
    <h3>Structure &amp; Terminology</h3>
    <pre><code>class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val      # data at this node
        self.left = left    # left child (or None)
        self.right = right  # right child (or None)

#       1          ← root
#      / \\
#     2   3        ← level 1
#    / \\
#   4   5          ← leaves (no children)

root = TreeNode(1,
    TreeNode(2, TreeNode(4), TreeNode(5)),
    TreeNode(3)
)</code></pre>
    <h3>DFS — Three Traversal Orders (Recursive)</h3>
    <pre><code># Base case is ALWAYS: if not root: return
# This handles both None leaves and empty tree

def inorder(root):    # left → root → right
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)
# For a BST, inorder gives SORTED values — very useful!

def preorder(root):   # root → left → right (used to clone a tree)
    if not root: return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def postorder(root):  # left → right → root (used to delete a tree)
    if not root: return []
    return postorder(root.left) + postorder(root.right) + [root.val]

# Most problems use a helper that returns a value upward:
def max_depth(root):
    if not root: return 0         # base case: empty subtree has depth 0
    left  = max_depth(root.left)  # get depth of left subtree
    right = max_depth(root.right) # get depth of right subtree
    return 1 + max(left, right)   # this node adds 1 to the deeper subtree</code></pre>
    <h3>BFS — Level Order (Iterative with Queue)</h3>
    <pre><code>from collections import deque

def level_order(root):
    if not root: return []
    result = []
    q = deque([root])          # start with root in queue
    while q:
        level = []
        for _ in range(len(q)):  # process ALL nodes at current level
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)   # add children for next level
            if node.right: q.append(node.right)
        result.append(level)
    return result
# For our tree: [[1], [2,3], [4,5]]

# BFS without level grouping — just visit order:
def bfs_simple(root):
    if not root: return
    q = deque([root])
    while q:
        node = q.popleft()
        print(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)</code></pre>
    <h3>DFS vs BFS — When to Use Which</h3>
    <ul>
      <li><strong>DFS (recursive)</strong>: height, depth, path problems, any "explore all possibilities" problem</li>
      <li><strong>BFS (queue)</strong>: shortest path, level-order, "closest to root" problems</li>
      <li><strong>Both are O(n)</strong> time and O(n) space in worst case</li>
    </ul>
    <h3>Common Mistakes</h3>
    <ul>
      <li>❌ Forgetting the base case <code>if not root</code> → NullPointerError on None children</li>
      <li>❌ Using stack (DFS) when you need BFS — stack gives DFS order, queue gives BFS order</li>
      <li>✅ Most tree problems follow: base case → recurse left → recurse right → combine results</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/357.png" alt="Tropius" />
</div>`,
    quiz: [
      { q: 'Inorder traversal of a BST gives what?', choices: ['Random order','Sorted values (ascending)','Level-by-level','Reversed sorted'], answer: 1 },
      { q: 'BFS uses which data structure?', choices: ['Stack','Queue','Set','Dict'], answer: 1 },
      { q: 'The base case for almost every recursive tree function?', choices: ['root.val == 0','if not root: return','root.left is None','len(tree) == 1'], answer: 1 },
      { q: 'DFS is better for which type of problem?', choices: ['Shortest path','Level-by-level processing','Height/depth/path problems','Closest to root'], answer: 2 },
      { q: 'max_depth(root) returns 0 when root is None because?', choices: ['Bugs in the code','An empty tree has no depth','0 is the default','It is the base case — no node = depth 0'], answer: 3 },
      { q: 'Level order traversal processes nodes?', choices: ['Root to leaves depth-first','Left subtree first','One complete level at a time','Randomly'], answer: 2 },
    ],
    starterCode: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef max_depth(root):\n    if not root:\n        return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))\n\nroot = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))\nprint(max_depth(root))`,
    challenge: {
      prompt: `Write a function count_nodes(root) that counts the total number of nodes in a binary tree using recursion.\n\nBase case: empty tree has 0 nodes.\nRecursion: 1 + count of left subtree + count of right subtree.\n\nTest tree: 1 → left:2(left:4, right:5), right:3\nExpected: 5 nodes`,
      code: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef count_nodes(root):\n    # Base case + recursion\n    pass\n\nroot = TreeNode(1,\n    TreeNode(2, TreeNode(4), TreeNode(5)),\n    TreeNode(3)\n)\nprint(count_nodes(root))`
    }
  },
  {
    id: 'ds_graphs', track: 'ds', title: 'Graphs & BFS/DFS',
    pokemon: { id: 598, name: 'Ferrothorn' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Graphs &amp; BFS/DFS</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Graph problems are everywhere — social networks, routing, dependency graphs. The two templates (BFS for shortest path, DFS for reachability/connected components) solve a huge range of interview problems including Number of Islands, Clone Graph, Course Schedule, and Word Ladder.</p>
    <h3>Representing a Graph</h3>
    <pre><code># Adjacency list — most common in interviews
graph = {
    'A': ['B', 'C'],   # A connects to B and C
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C'],
}

# Build from edge list
edges = [('A','B'), ('A','C'), ('B','D')]
from collections import defaultdict
adj = defaultdict(list)
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)  # for undirected graph</code></pre>
    <h3>BFS — Shortest Path (Fewest Edges)</h3>
    <pre><code># BFS explores layer by layer — guarantees shortest path in unweighted graph
from collections import deque

def bfs_shortest(graph, start, end):
    visited = {start}           # track visited to avoid re-processing
    q = deque([(start, [start])])  # (current_node, path_so_far)
    while q:
        node, path = q.popleft()
        if node == end:
            return path          # first time we reach end = shortest path
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                q.append((neighbor, path + [neighbor]))
    return None  # no path exists

# Count steps only (more memory efficient):
def bfs_distance(graph, start, end):
    visited = {start}
    q = deque([(start, 0)])     # (node, distance)
    while q:
        node, dist = q.popleft()
        if node == end: return dist
        for nb in graph.get(node, []):
            if nb not in visited:
                visited.add(nb)
                q.append((nb, dist + 1))
    return -1</code></pre>
    <h3>DFS — Reachability &amp; Connected Components</h3>
    <pre><code># DFS iterative (using a stack — avoids recursion limit)
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            for nb in graph.get(node, []):
                if nb not in visited:
                    stack.append(nb)
    return visited

# DFS recursive — cleaner but has recursion limit for large graphs
def dfs_recursive(graph, node, visited=None):
    if visited is None: visited = set()
    visited.add(node)
    for nb in graph.get(node, []):
        if nb not in visited:
            dfs_recursive(graph, nb, visited)
    return visited

# Count connected components
def count_components(n, edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v); adj[v].append(u)
    visited = set()
    count = 0
    for node in range(n):
        if node not in visited:
            dfs_recursive(adj, node, visited)
            count += 1
    return count</code></pre>
    <h3>Pattern Recognition</h3>
    <ul>
      <li>"Shortest path" or "minimum steps" → BFS</li>
      <li>"All paths", "connected components", "cycle detection" → DFS</li>
      <li>"Grid problems" (islands, etc.) → DFS/BFS on implicit graph (cells as nodes)</li>
      <li>Always pass/maintain a <strong>visited set</strong> — cyclic graphs will loop forever without it</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/598.png" alt="Ferrothorn" />
</div>`,
    quiz: [
      { q: 'BFS guarantees the shortest path in terms of?', choices: ['Weighted distance','Fewest edges (hops)','Alphabetical order','Memory usage'], answer: 1 },
      { q: 'Why must you track visited nodes in a graph?', choices: ['To sort them','To avoid infinite loops in cyclic graphs','To count edges','To build the adjacency list'], answer: 1 },
      { q: 'BFS uses what data structure internally?', choices: ['Stack','Priority queue','Queue (deque)','Sorted list'], answer: 2 },
      { q: 'DFS iterative uses what data structure?', choices: ['Queue','Stack','Set','Dict'], answer: 1 },
      { q: 'For "minimum steps to reach X", you should use?', choices: ['DFS recursive','DFS iterative','BFS','Sorted BFS'], answer: 2 },
      { q: 'For "count connected components", you should use?', choices: ['BFS only','DFS only','Either BFS or DFS works','Neither'], answer: 2 },
    ],
    starterCode: `from collections import deque\n\ngraph = {'A':['B','C'], 'B':['A','D'], 'C':['A','D'], 'D':['B','C']}\n\ndef bfs(graph, start, end):\n    visited = {start}\n    q = deque([(start, [start])])\n    while q:\n        node, path = q.popleft()\n        if node == end:\n            return path\n        for nb in graph.get(node, []):\n            if nb not in visited:\n                visited.add(nb)\n                q.append((nb, path + [nb]))\n    return None\n\nprint(bfs(graph, 'A', 'D'))`,
    challenge: {
      prompt: `Write a function has_path(graph, start, end) using DFS (recursively) that returns True if there is any path from start to end, False otherwise.\n\nUse a visited set to avoid infinite loops.\n\nTest:\ngraph = {'A':['B','C'], 'B':['D'], 'C':[], 'D':[], 'E':['F'], 'F':[]}\nhas_path(graph, 'A', 'D') → True\nhas_path(graph, 'A', 'E') → False`,
      code: `def has_path(graph, start, end, visited=None):\n    if visited is None:\n        visited = set()\n    if start == end:\n        return True\n    visited.add(start)\n    # Recurse on neighbors\n    pass\n\ngraph = {'A':['B','C'], 'B':['D'], 'C':[], 'D':[], 'E':['F'], 'F':[]}\nprint(has_path(graph, 'A', 'D'))\nprint(has_path(graph, 'A', 'E'))`
    }
  },

  // ── ALGORITHMS ──
  {
    id: 'algo_binsearch', track: 'algo', title: 'Binary Search',
    pokemon: { id: 137, name: 'Porygon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Binary Search</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Binary search turns O(n) searches into O(log n) — searching 1 billion elements in ~30 steps. Mastering it unlocks a whole class of problems: not just "find a value" but also "find the minimum valid X" (search on answer), rotated arrays, and first/last occurrence. Shows up constantly in interviews.</p>
    <h3>Core Template — Find a Value</h3>
    <pre><code># ALWAYS use left + (right-left)//2, not (left+right)//2
# Reason: (left+right) can overflow in other languages; habit to build now.
def binary_search(nums, target):
    left, right = 0, len(nums) - 1  # inclusive bounds
    while left <= right:             # = because single element still needs checking
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1           # target must be RIGHT of mid
        else:
            right = mid - 1          # target must be LEFT of mid
    return -1                        # not found

# [1, 3, 5, 7, 9] target=7
# left=0 right=4 mid=2 → nums[2]=5 < 7 → left=3
# left=3 right=4 mid=3 → nums[3]=7 == target → return 3  ✓</code></pre>
    <h3>Find Leftmost / Rightmost Occurrence</h3>
    <pre><code># "First occurrence" — bias search left when found
def first_pos(nums, target):
    left, right = 0, len(nums) - 1
    result = -1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            result = mid         # record, but keep searching left
            right = mid - 1
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result

# "Last occurrence" — bias search right when found
def last_pos(nums, target):
    left, right = 0, len(nums) - 1
    result = -1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            result = mid         # record, but keep searching right
            left = mid + 1
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result

nums = [1, 2, 2, 2, 3, 4]
print(first_pos(nums, 2))  # → 1
print(last_pos(nums, 2))   # → 3</code></pre>
    <h3>"Search on Answer" — Binary Search Without Array</h3>
    <pre><code># "What is the minimum capacity needed to ship packages in D days?"
# Key insight: the ANSWER itself is a sorted space we can binary search on.
def ship_packages(weights, days):
    def can_ship(capacity):          # can we do it with this capacity?
        day_count, load = 1, 0
        for w in weights:
            if load + w > capacity:
                day_count += 1; load = 0
            load += w
        return day_count <= days

    left = max(weights)              # minimum: must carry heaviest package
    right = sum(weights)             # maximum: carry everything in 1 day
    while left < right:
        mid = left + (right - left) // 2
        if can_ship(mid):
            right = mid              # might do better (smaller capacity)
        else:
            left = mid + 1           # too small, need more capacity
    return left

print(ship_packages([1,2,3,4,5,6,7,8,9,10], 5))  # → 15</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li><strong>left &lt; right vs left &lt;= right</strong>: Standard search uses &lt;=. Lower-bound variants often use &lt;.</li>
      <li><strong>Off-by-one in bounds</strong>: Think about what your invariant is — does right=mid or right=mid-1?</li>
      <li><strong>Infinite loop</strong>: If neither branch moves the pointer, you loop forever. Always ensure left or right moves.</li>
      <li><strong>Forgetting sorted requirement</strong>: Binary search ONLY works on sorted input (or a monotone condition).</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png" alt="Porygon" />
</div>`,
    quiz: [
      { q: 'Time complexity of binary search?', choices: ['O(n)','O(n log n)','O(log n)','O(1)'], answer: 2 },
      { q: 'Why write mid = left + (right-left)//2 instead of (left+right)//2?', choices: ['It is faster','It avoids integer overflow in other languages','Python requires it','It handles negative numbers'], answer: 1 },
      { q: 'Binary search requires the array to be?', choices: ['Unique values only','All positive','Sorted','Unsorted'], answer: 2 },
      { q: 'To find the FIRST occurrence of a value, when you find it you should?', choices: ['Return immediately','Record it and keep searching right','Record it and keep searching left','Skip it'], answer: 2 },
      { q: '"Search on answer" means binary searching on?', choices: ['The array indices','The answer space (possible values of the result)','A hash map','The call stack'], answer: 1 },
      { q: 'What is the correct loop condition for standard binary search?', choices: ['while left < right','while left <= right','while left != right','while left > 0'], answer: 1 },
    ],
    starterCode: `def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nnums = [1, 3, 5, 7, 9, 11, 13]\nprint(binary_search(nums, 7))\nprint(binary_search(nums, 4))`,
    challenge: {
      prompt: `Write a function count_occurrences(nums, target) that counts how many times target appears in a sorted array — in O(log n) using binary search twice: once to find the leftmost index, once to find the rightmost.\n\nTest: [1,2,2,2,3,4] with target=2 → 3\n      [1,1,1,1,1] with target=1 → 5`,
      code: `def first_pos(nums, target):\n    left, right = 0, len(nums) - 1\n    result = -1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            result = mid\n            right = mid - 1  # keep searching left\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return result\n\ndef last_pos(nums, target):\n    # Similar but keep searching right\n    pass\n\ndef count_occurrences(nums, target):\n    first = first_pos(nums, target)\n    if first == -1:\n        return 0\n    return last_pos(nums, target) - first + 1\n\nprint(count_occurrences([1,2,2,2,3,4], 2))\nprint(count_occurrences([1,1,1,1,1], 1))`
    }
  },
  {
    id: 'algo_recursion', track: 'algo', title: 'Recursion & Backtracking',
    pokemon: { id: 197, name: 'Umbreon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Recursion &amp; Backtracking</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Recursion is the engine behind tree traversals, DFS, divide-and-conquer, and DP. Backtracking solves the hardest combinatorial problems: Subsets, Permutations, Combinations, N-Queens, Sudoku Solver. These patterns appear in many Meta and Google interview questions.</p>
    <h3>Recursion — The Mental Model</h3>
    <pre><code># Every recursive function needs:
# 1. A BASE CASE (stops recursion)
# 2. A RECURSIVE CASE (calls itself on a smaller input)

def factorial(n):
    if n == 0: return 1        # BASE CASE
    return n * factorial(n-1)  # RECURSIVE CASE — smaller input

# Call stack for factorial(3):
# factorial(3) → 3 * factorial(2)
#                     factorial(2) → 2 * factorial(1)
#                                         factorial(1) → 1 * factorial(0)
#                                                             return 1
# Unwinds: 1*1=1, 2*1=2, 3*2=6 ✓

# Fibonacci — SLOW without memoization (O(2^n))
def fib_slow(n):
    if n <= 1: return n
    return fib_slow(n-1) + fib_slow(n-2)

# Fibonacci — FAST with memoization (O(n))
def fib(n, memo=None):
    if memo is None: memo = {}   # NEVER use mutable default arg {}!
    if n <= 1: return n
    if n in memo: return memo[n]
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]</code></pre>
    <h3>Backtracking Template</h3>
    <pre><code># The backtracking pattern is always:
# 1. Choose — add an option to the current path
# 2. Explore — recurse with that choice
# 3. Unchoose — UNDO the choice (pop/remove)

# SUBSETS — collect all subsets of [1,2,3]
def subsets(nums):
    result = []
    def backtrack(start, current):
        result.append(current[:])    # snapshot current path (copy!)
        for i in range(start, len(nums)):
            current.append(nums[i])  # CHOOSE
            backtrack(i + 1, current) # EXPLORE
            current.pop()            # UNCHOOSE
    backtrack(0, [])
    return result

# PERMUTATIONS — all orderings of [1,2,3]
def permutations(nums):
    result = []
    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        for i in range(len(remaining)):
            current.append(remaining[i])              # CHOOSE
            backtrack(current, remaining[:i] + remaining[i+1:])  # EXPLORE
            current.pop()                             # UNCHOOSE
    backtrack([], nums)
    return result

print("Subsets:", len(subsets([1,2,3])))        # → 8  (2^3)
print("Perms:", len(permutations([1,2,3])))     # → 6  (3!)</code></pre>
    <h3>Pattern Recognition</h3>
    <ul>
      <li>"All subsets / combinations / permutations" → Backtracking</li>
      <li>Avoid using mutable defaults like <code>memo={}</code> — use <code>None</code> and initialize inside</li>
      <li>Always pass a <strong>copy</strong> (current[:]) when appending to results — lists are mutable</li>
      <li>Recursion depth limit in Python is ~1000 by default. For deep problems, convert to iterative</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png" alt="Umbreon" />
</div>`,
    quiz: [
      { q: 'Every recursive function must have?', choices: ['A loop','A base case','A return type','Global variables'], answer: 1 },
      { q: 'What does backtracking do after exploring a path?', choices: ['Saves the path','Undoes the last choice (pops)','Starts over from scratch','Throws an error'], answer: 1 },
      { q: 'Memoization speeds up recursion by?', choices: ['Adding base cases','Caching subproblem results','Using iteration instead','Reducing stack depth'], answer: 1 },
      { q: 'Why must you append current[:] instead of current to results?', choices: ['Faster','current is mutable — a copy captures the current state','Python requires it','current is None'], answer: 1 },
      { q: 'Time complexity of naive Fibonacci without memoization?', choices: ['O(n)','O(n log n)','O(2^n)','O(log n)'], answer: 2 },
      { q: 'Using def f(n, memo={}) as a default arg is a problem because?', choices: ['It is slow','The dict is shared across all calls permanently','Python doesnt allow it','Memo must be a list'], answer: 1 },
    ],
    starterCode: `def fib(n, memo={}):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]\n\nfor i in range(10):\n    print(fib(i), end=" ")`,
    challenge: {
      prompt: `Write a function permutations(nums) using backtracking that returns all possible orderings of the list.\n\nFor [1,2,3] the result should be all 6 arrangements: [1,2,3], [1,3,2], [2,1,3], etc.\n\nHint: at each step, try placing each unused number, recurse, then undo.`,
      code: `def permutations(nums):\n    result = []\n    def backtrack(current, remaining):\n        if not remaining:\n            result.append(current[:])\n            return\n        for i in range(len(remaining)):\n            # Choose remaining[i], recurse, undo\n            pass\n    backtrack([], nums)\n    return result\n\nperms = permutations([1, 2, 3])\nprint(f"Total: {len(perms)}")\nfor p in perms:\n    print(p)`
    }
  },
  {
    id: 'algo_dp', track: 'algo', title: 'Dynamic Programming',
    pokemon: { id: 384, name: 'Rayquaza' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Dynamic Programming</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> DP is one of the most tested topics in interviews. It solves optimization problems (max/min) and counting problems that would be exponential with brute force. The key is recognizing the pattern: break into subproblems, cache results, build bottom-up.</p>
    <h3>When to Use DP</h3>
    <ul>
      <li>Problem asks for "maximum", "minimum", "number of ways", "can we achieve X"</li>
      <li>The optimal answer at step N depends on optimal answers at earlier steps</li>
      <li>Recursion would recompute the same subproblems (overlapping)</li>
    </ul>
    <h3>Approach 1: Top-Down (Memoization)</h3>
    <pre><code># Fibonacci — classic overlapping subproblems
def fib(n, memo=None):
    if memo is None: memo = {}
    if n <= 1: return n
    if n in memo: return memo[n]
    memo[n] = fib(n-1, memo) + fib(n-2, memo)  # O(n) with memo vs O(2^n) naive
    return memo[n]</code></pre>
    <h3>Approach 2: Bottom-Up (Tabulation)</h3>
    <pre><code># Climbing Stairs — O(n) time, O(1) space
# Ways to climb n stairs taking 1 or 2 steps at a time
# dp[i] = dp[i-1] + dp[i-2]  (same as Fibonacci!)
def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2               # a=dp[i-2], b=dp[i-1]
    for _ in range(3, n+1):
        a, b = b, a + b       # new b = old a + old b
    return b

# House Robber — can't rob adjacent houses
# dp[i] = max(dp[i-1], dp[i-2] + nums[i])
def house_robber(nums):
    if not nums: return 0
    prev2, prev1 = 0, 0
    for n in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + n)
    return prev1

# Coin Change — minimum coins to make amount
# dp[a] = min coins to make amount a
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0              # base: 0 coins to make 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a-c] + 1)  # +1 for this coin
    return dp[amount] if dp[amount] != float('inf') else -1

print(climb_stairs(5))                      # → 8
print(house_robber([2,7,9,3,1]))            # → 12
print(coin_change([1,5,10,25], 36))         # → 3  (25+10+1)</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li><strong>float('inf') as sentinel</strong>: Initialize dp to infinity for "minimum" problems, -infinity or 0 for "maximum"</li>
      <li><strong>Bottom-up order</strong>: Make sure smaller subproblems are solved before larger ones that depend on them</li>
      <li><strong>Not returning -1 when unreachable</strong>: If dp[amount] == inf, target is impossible — return -1</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png" alt="Rayquaza" />
</div>`,
    quiz: [
      { q: 'DP requires which two properties?', choices: ['Sorted input & unique values','Optimal substructure & overlapping subproblems','Greedy choice & local optimum','Recursion & hashing'], answer: 1 },
      { q: 'Optimized space complexity of Fibonacci DP?', choices: ['O(n)','O(n²)','O(1)','O(log n)'], answer: 2 },
      { q: 'Bottom-up DP fills the table in what order?', choices: ['Largest subproblem first','Smallest subproblem first (iteratively)','Random order','Sorted order'], answer: 1 },
      { q: 'Coin change dp[a] represents?', choices: ['Coins used so far','Minimum coins to make amount a','Maximum coins used','Whether amount a is possible'], answer: 1 },
      { q: 'What signals "this subproblem is impossible" in min DP?', choices: ['dp[i] = 0','dp[i] = -1','dp[i] = float("inf")','dp[i] = None'], answer: 2 },
      { q: 'House Robber transition: dp[i] = ?', choices: ['dp[i-1] + nums[i]','max(dp[i-1], dp[i-2] + nums[i])','dp[i-2] + nums[i]','min(dp[i-1], nums[i])'], answer: 1 },
    ],
    starterCode: `def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n+1):\n        a, b = b, a + b\n    return b\n\nfor n in range(1, 8):\n    print(f"climb_stairs({n}) = {climb_stairs(n)}")`,
    challenge: {
      prompt: `Write a function house_robber(nums) that solves the classic DP problem: given a list of house values, find the maximum you can rob without taking from two adjacent houses.\n\nDP rule: dp[i] = max(dp[i-1], dp[i-2] + nums[i])\n\nTest:\n[2,7,9,3,1] → 12 (rob houses 0,2,4)\n[1,2,3,1] → 4 (rob houses 0,2)`,
      code: `def house_robber(nums):\n    if not nums: return 0\n    if len(nums) == 1: return nums[0]\n    # Use two variables instead of full dp array\n    prev2, prev1 = 0, 0\n    for n in nums:\n        # Update prev2 and prev1\n        pass\n    return prev1\n\nprint(house_robber([2,7,9,3,1]))\nprint(house_robber([1,2,3,1]))`
    }
  },
  {
    id: 'algo_heaps', track: 'algo', title: 'Heaps & Priority Queues',
    pokemon: { id: 208, name: 'Steelix' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Heaps &amp; Priority Queues</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Heaps solve a class of problems that neither sorting nor hashmaps can: "keep track of the K largest/smallest seen so far" in O(log K) per element. Classic problems: Kth Largest Element, K Closest Points, Merge K Sorted Lists, Task Scheduler, and Median of a Stream.</p>
    <h3>Heap Fundamentals</h3>
    <pre><code>import heapq

# Python's heapq is a MIN-heap (smallest element always at index 0)
nums = [5, 2, 8, 1, 9]
heapq.heapify(nums)          # O(n) — converts list in-place
print(nums[0])               # → 1 (peek without removing)
print(heapq.heappop(nums))   # → 1 (removes minimum)
heapq.heappush(nums, 3)      # O(log n)

# MAX-heap — negate values
maxheap = []
for x in [5, 2, 8, 1, 9]:
    heapq.heappush(maxheap, -x)   # store as negative
largest = -heapq.heappop(maxheap) # → 9 (negate back)

# Tuples: heap compares first element, then second
tasks = [(3, 'low'), (1, 'high'), (2, 'med')]
heapq.heapify(tasks)
print(heapq.heappop(tasks))  # → (1, 'high')</code></pre>
    <h3>K Largest / K Smallest — Size-K Heap</h3>
    <pre><code># K Largest Elements — maintain a MIN-heap of size K
# Why min-heap? The root tells us the SMALLEST of the top-K
# If new element > root, kick the root out (it's no longer top-K)
def k_largest(nums, k):
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)   # remove smallest to keep heap size = k
    return sorted(heap, reverse=True)

# Kth Largest — same idea, just return the root (smallest of top-K)
def kth_largest(nums, k):
    return heapq.nlargest(k, nums)[-1]  # O(n log k)

# K Closest Points to Origin
def k_closest(points, k):
    return heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)

print(k_largest([3,2,1,5,6,4], 3))           # → [6, 5, 4]
print(kth_largest([3,2,1,5,6,4], 2))         # → 5
print(k_closest([[1,3],[-2,2],[5,0]], 2))     # → [[-2,2],[1,3]]</code></pre>
    <h3>Median of a Data Stream</h3>
    <pre><code># Two heaps: max-heap for lower half, min-heap for upper half
# Balance them so sizes differ by at most 1
class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negated) — lower half
        self.hi = []  # min-heap — upper half

    def add(self, num):
        heapq.heappush(self.lo, -num)        # always push to lo first
        if self.lo and self.hi and (-self.lo[0] > self.hi[0]):
            heapq.heappush(self.hi, -heapq.heappop(self.lo))  # rebalance
        if len(self.lo) > len(self.hi) + 1:
            heapq.heappush(self.hi, -heapq.heappop(self.lo))
        elif len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def median(self):
        if len(self.lo) > len(self.hi): return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2.0</code></pre>
    <h3>Complexity Reference</h3>
    <ul>
      <li>heappush / heappop: <strong>O(log n)</strong></li>
      <li>heapify: <strong>O(n)</strong></li>
      <li>nlargest(k, n) / nsmallest(k, n): <strong>O(n log k)</strong></li>
      <li>Peek (heap[0]): <strong>O(1)</strong> — no removal</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/208.png" alt="Steelix" />
</div>`,
    quiz: [
      { q: "Python's heapq implements which type of heap?", choices: ['Max-heap','Min-heap','Balanced BST','Random heap'], answer: 1 },
      { q: 'Time complexity of heap push/pop?', choices: ['O(1)','O(n)','O(log n)','O(n log n)'], answer: 2 },
      { q: 'How do you simulate a max-heap with heapq?', choices: ['Use heapq.maxheap()','Reverse the list','Negate values before pushing','Sort first'], answer: 2 },
      { q: 'To find K largest elements efficiently, maintain a heap of size?', choices: ['n (entire array)','1','K','K²'], answer: 2 },
      { q: 'heap[0] gives you the ___ without removing it?', choices: ['Maximum element','Minimum element','Median','Random element'], answer: 1 },
      { q: 'For K closest points to origin, the correct key function is?', choices: ['key=sum(p)','key=lambda p: p[0]+p[1]','key=lambda p: p[0]**2+p[1]**2','key=max(p)'], answer: 2 },
    ],
    starterCode: `import heapq\n\nnums = [5, 2, 8, 1, 9, 3]\nheapq.heapify(nums)\nprint("Min:", heapq.heappop(nums))\nprint("3 largest:", heapq.nlargest(3, [5,2,8,1,9,3]))`,
    challenge: {
      prompt: `Write a function k_closest(points, k) that returns the k closest points to the origin (0,0) from a list of [x,y] pairs.\n\nDistance formula: x² + y² (no need for sqrt).\nUse heapq.nsmallest with a key function.\n\nTest: points=[[1,3],[-2,2],[5,0],[0,1]], k=2 → [[-2,2],[0,1]] or [[0,1],[-2,2]]`,
      code: `import heapq\n\ndef k_closest(points, k):\n    # Use heapq.nsmallest with key=lambda p: p[0]**2 + p[1]**2\n    pass\n\npoints = [[1,3],[-2,2],[5,0],[0,1]]\nprint(k_closest(points, 2))`
    }
  },
  {
    id: 'algo_sorting', track: 'algo', title: 'Sorting Algorithms',
    pokemon: { id: 227, name: 'Skarmory' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Sorting Algorithms</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Python's built-in sort is almost always what you'll use, but interviews test whether you can implement merge sort (divide-and-conquer pattern, stable) and understand trade-offs. Sorting also unlocks other patterns — once sorted, you can use two pointers or binary search.</p>
    <h3>Python Built-in Sort</h3>
    <pre><code># Python uses Timsort — O(n log n) average and worst case, stable
nums = [5, 2, 8, 1]
nums.sort()                          # in-place, returns None
sorted_copy = sorted(nums)           # returns new list, original unchanged

# Custom sort key
people = [('Alice', 30), ('Bob', 25), ('Charlie', 35)]
people.sort(key=lambda x: x[1])     # sort by age
people.sort(key=lambda x: (-x[1], x[0]))  # age desc, then name asc

# COMMON MISTAKE: sort() returns None
result = [3,1,2].sort()   # result is None!
result = sorted([3,1,2])  # correct — sorted() returns new list</code></pre>
    <h3>Merge Sort — O(n log n), Stable</h3>
    <pre><code># Divide array in half, sort each half, merge them back
# "Stable" means equal elements keep their original relative order
def merge_sort(arr):
    if len(arr) <= 1: return arr           # BASE CASE
    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])          # sort left half
    right = merge_sort(arr[mid:])          # sort right half
    return merge(left, right)              # merge sorted halves

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:            # <= keeps it stable
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]  # append any remainder

print(merge_sort([5, 2, 8, 1, 9, 3]))     # → [1, 2, 3, 5, 8, 9]</code></pre>
    <h3>Quick Sort — O(n log n) avg, O(n²) worst</h3>
    <pre><code># Pick a pivot, partition into less/equal/greater, recurse
# Worst case O(n²) when already sorted (bad pivot choice)
def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr) // 2]             # middle element as pivot
    left  = [x for x in arr if x < pivot]
    mid   = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + mid + quick_sort(right)</code></pre>
    <h3>Algorithm Comparison</h3>
    <pre><code># Algorithm     | Best    | Avg      | Worst    | Space  | Stable
# Timsort       | O(n)    | O(n lgn) | O(n lgn) | O(n)   | Yes  ← Python built-in
# Merge Sort    | O(nlgn) | O(n lgn) | O(n lgn) | O(n)   | Yes
# Quick Sort    | O(nlgn) | O(n lgn) | O(n²)    | O(lgn) | No
# Heap Sort     | O(nlgn) | O(n lgn) | O(n lgn) | O(1)   | No
# Bubble Sort   | O(n)    | O(n²)    | O(n²)    | O(1)   | Yes  ← never use
</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/227.png" alt="Skarmory" />
</div>`,
    quiz: [
      { q: 'Time complexity of merge sort?', choices: ['O(n)','O(n²)','O(n log n)','O(log n)'], answer: 2 },
      { q: 'Which sorting algorithm is stable AND always O(n log n)?', choices: ['Quick Sort','Heap Sort','Merge Sort','Bubble Sort'], answer: 2 },
      { q: "Quick sort's worst case time complexity?", choices: ['O(n log n)','O(n)','O(n²)','O(1)'], answer: 2 },
      { q: 'What does list.sort() return in Python?', choices: ['The sorted list','A copy of the list','None','True'], answer: 2 },
      { q: 'Python\'s built-in sort algorithm is called?', choices: ['Quicksort','Heapsort','Timsort','Mergesort'], answer: 2 },
      { q: 'A "stable" sort means?', choices: ['It never crashes','Equal elements keep their original relative order','It runs in O(n) always','It uses no extra space'], answer: 1 },
    ],
    starterCode: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    result, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]\n\nprint(merge_sort([5, 2, 8, 1, 9, 3]))`,
    challenge: {
      prompt: `Write a function merge_sorted(a, b) that merges two already-sorted lists into one sorted list in O(n+m) time — without using sort().\n\nThis is the merge step of merge sort.\n\nTest:\nmerge_sorted([1,3,5], [2,4,6]) → [1,2,3,4,5,6]\nmerge_sorted([1,5,9], [2,3,4,6]) → [1,2,3,4,5,6,9]`,
      code: `def merge_sorted(a, b):\n    result = []\n    i, j = 0, 0\n    # Compare and merge\n    \n    # Append any remaining elements\n    \n    return result\n\nprint(merge_sorted([1,3,5], [2,4,6]))\nprint(merge_sorted([1,5,9], [2,3,4,6]))`
    }
  },
  {
    id: 'algo_sliding', track: 'algo', title: 'Sliding Window',
    pokemon: { id: 330, name: 'Flygon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Sliding Window</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Sliding window converts O(n²) brute-force subarray problems to O(n). It's one of the most common patterns: Longest Substring Without Repeating Characters, Minimum Window Substring, Max Sum Subarray of Size K, Fruits in Basket. Master it and you get a whole category for free.</p>
    <h3>Pattern 1: Fixed-Size Window</h3>
    <pre><code># Maximum sum of subarray of exactly k elements
# Key: add new right element, subtract leftmost element
def max_sum_k(nums, k):
    window_sum = sum(nums[:k])     # build initial window
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i]      # add new right
        window_sum -= nums[i-k]    # remove old left
        max_sum = max(max_sum, window_sum)
    return max_sum

print(max_sum_k([2,1,5,1,3,2], 3))  # → 9  (window [5,1,3])</code></pre>
    <h3>Pattern 2: Variable-Size Window (Expand/Shrink)</h3>
    <pre><code># Longest substring without repeating characters
# Expand right; when constraint violated, shrink from left
def longest_unique(s):
    seen = set()
    left = 0
    max_len = 0
    for right in range(len(s)):
        while s[right] in seen:    # constraint violated: shrink
            seen.remove(s[left])
            left += 1
        seen.add(s[right])         # extend window
        max_len = max(max_len, right - left + 1)
    return max_len

# Minimum window containing all chars of t
def min_window(s, t):
    need = {}
    for c in t: need[c] = need.get(c, 0) + 1
    have, total = 0, len(need)
    window = {}
    left = 0
    result = ""
    for right in range(len(s)):
        c = s[right]
        window[c] = window.get(c, 0) + 1
        if c in need and window[c] == need[c]:
            have += 1
        while have == total:           # window is valid — try shrinking
            if not result or right - left + 1 < len(result):
                result = s[left:right+1]
            window[s[left]] -= 1
            if s[left] in need and window[s[left]] < need[s[left]]:
                have -= 1
            left += 1
    return result

print(longest_unique("abcabcbb"))  # → 3
print(min_window("ADOBECODEBANC", "ABC"))  # → "BANC"</code></pre>
    <h3>Pattern Recognition</h3>
    <ul>
      <li>"Subarray of size K" → fixed window</li>
      <li>"Longest/shortest subarray with constraint" → variable window</li>
      <li>Two-pointer pattern: right always moves forward, left only moves forward → O(n) total</li>
      <li>Use a hashmap/counter to track window contents for character problems</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/330.png" alt="Flygon" />
</div>`,
    quiz: [
      { q: 'Time complexity of the sliding window technique?', choices: ['O(n²)','O(n log n)','O(n)','O(k)'], answer: 2 },
      { q: 'In a variable window, when do you shrink (move left pointer)?', choices: ['When window is empty','When window constraint is violated','Every other iteration','Never'], answer: 1 },
      { q: 'Fixed vs variable window difference?', choices: ['Fixed never loops','Fixed size stays constant; variable adjusts based on constraint','Variable is slower','No difference'], answer: 1 },
      { q: 'For a fixed window of size k, moving from index i to i+1 you?', choices: ['Rebuild entire window','Add nums[i+k] and remove nums[i]','Sort the window','Use binary search'], answer: 1 },
      { q: 'Why is sliding window O(n) and not O(n²)?', choices: ['Because left pointer only moves forward too','Because we sort first','Because we use a hash map','Because windows dont overlap'], answer: 0 },
      { q: 'Longest Substring Without Repeating Characters uses which window type?', choices: ['Fixed window of size 3','Variable window with a set','Fixed window of size k','No window needed'], answer: 1 },
    ],
    starterCode: `def longest_unique(s):\n    seen = set()\n    left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nprint(longest_unique("pikachu"))\nprint(longest_unique("abcabcbb"))`,
    challenge: {
      prompt: `Write a function max_sum_subarray(nums, k) that finds the maximum sum of any contiguous subarray of exactly k elements using a fixed sliding window.\n\nTest:\n[2,1,5,1,3,2], k=3 → 9 (subarray [5,1,3])\n[1,4,2,9,7,3,8], k=4 → 24 (subarray [9,7,3,8] wait... check)`,
      code: `def max_sum_subarray(nums, k):\n    # Build initial window\n    window_sum = sum(nums[:k])\n    max_sum = window_sum\n    # Slide the window\n    for i in range(k, len(nums)):\n        # Add new element, remove leftmost\n        pass\n    return max_sum\n\nprint(max_sum_subarray([2,1,5,1,3,2], 3))\nprint(max_sum_subarray([1,4,2,9,7,3,8], 4))`
    }
  },

  // ── LEETCODE PATTERNS ──
  {
    id: 'lc_twosum', track: 'lc', title: 'Two Sum (LC #1)',
    pokemon: { id: 81, name: 'Magnemite' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Two Sum — LC #1</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Two Sum is the most common interview question and the gateway to a whole family of hash map problems. The O(n) pattern — "check if complement exists, then store current" — appears in 3Sum, 4Sum, subarray sum equals K, and more. Nail this, and you've learned the template.</p>
    <h3>The Thinking Process</h3>
    <pre><code># Brute force O(n²) — check every pair:
# For each i, loop j from i+1 to end. Works but interviewers expect better.
def two_sum_brute(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]

# Hash map O(n) — the correct answer:
# For each num, ask: "Have I already seen target - num?"
# If yes → found the pair. If no → store num for future lookups.
def two_sum(nums, target):
    seen = {}                          # value → index map
    for i, n in enumerate(nums):
        complement = target - n        # what we need to pair with n
        if complement in seen:
            return [seen[complement], i]  # found it!
        seen[n] = i                    # store for future lookups
    return []

# Trace: nums=[2,7,11,15], target=9
# i=0, n=2: need 7, not in seen. seen={2:0}
# i=1, n=7: need 2, 2 IS in seen at index 0! return [0,1] ✓</code></pre>
    <h3>Variation: Sorted Array — Two Pointers</h3>
    <pre><code># If array is SORTED, use two pointers — O(n) time, O(1) space
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target: return [left, right]
        elif s < target: left += 1    # need bigger sum
        else: right -= 1              # need smaller sum</code></pre>
    <h3>Variation: Three Sum</h3>
    <pre><code># Sort first, then fix one number and run two pointers on the rest
def three_sum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]: continue  # skip duplicates
        left, right = i + 1, len(nums) - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left+1]: left += 1
                while left < right and nums[right] == nums[right-1]: right -= 1
                left += 1; right -= 1
            elif s < 0: left += 1
            else: right -= 1
    return result

print(two_sum([2,7,11,15], 9))          # → [0, 1]
print(three_sum([-1,0,1,2,-1,-4]))      # → [[-1,-1,2],[-1,0,1]]</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/81.png" alt="Magnemite" />
</div>`,
    quiz: [
      { q: 'Two Sum hash map solution time complexity?', choices: ['O(n²)','O(n log n)','O(n)','O(1)'], answer: 2 },
      { q: 'In the hash map, what is stored as key and value?', choices: ['index → value','value → index','target → count','pair → sum'], answer: 1 },
      { q: 'If target=9 and current num=2, what complement do you look for?', choices: ['2','9','7','11'], answer: 2 },
      { q: 'Why check complement BEFORE storing current num?', choices: ['Faster','Avoids using the same element twice (as both nums[i] and nums[j])','Python requires it','To handle duplicates'], answer: 1 },
      { q: 'For a SORTED array Two Sum, what technique is O(1) space?', choices: ['Hash map','Two pointers','Binary search','Brute force'], answer: 1 },
      { q: 'Three Sum sorts the array first because?', choices: ['Sorting is always first','Sorted order allows using two pointers to skip duplicates efficiently','Hash maps dont work on unsorted','Sorting makes it O(n)'], answer: 1 },
    ],
    starterCode: `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        complement = target - n\n        if complement in seen:\n            return [seen[complement], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2,7,11,15], 9))\nprint(two_sum([3,2,4], 6))`,
    challenge: {
      prompt: `Variation: Three Sum (LC #15)\n\nWrite a function three_sum(nums) that returns all unique triplets [a,b,c] such that a+b+c=0.\n\nHint: Sort the array. Fix one number, then use two pointers on the rest.\n\nTest: [-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]`,
      code: `def three_sum(nums):\n    nums.sort()\n    result = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i-1]:\n            continue  # skip duplicates\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            s = nums[i] + nums[left] + nums[right]\n            if s == 0:\n                result.append([nums[i], nums[left], nums[right]])\n                # Skip duplicates\n                while left < right and nums[left] == nums[left+1]: left += 1\n                while left < right and nums[right] == nums[right-1]: right -= 1\n                left += 1; right -= 1\n            elif s < 0:\n                left += 1\n            else:\n                right -= 1\n    return result\n\nprint(three_sum([-1,0,1,2,-1,-4]))`
    }
  },
  {
    id: 'lc_valid_parens', track: 'lc', title: 'Valid Parentheses (LC #20)',
    pokemon: { id: 100, name: 'Voltorb' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Valid Parentheses — LC #20</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Valid Parentheses is the canonical stack problem. The pattern — push open, pop and verify on close, empty at end = valid — generalizes to: decode strings, asteroid collision, daily temperatures, largest rectangle in histogram, and more. Stack is the right tool whenever you need to match "opening" with "closing" events.</p>
    <h3>Core Solution — Traced</h3>
    <pre><code>def is_valid(s):
    stack = []
    pairs = {')':'(', ']':'[', '}':'{'}   # closing → expected opening
    for ch in s:
        if ch in '([{':
            stack.append(ch)              # push opening bracket
        else:
            # It's a closing bracket
            if not stack or stack[-1] != pairs[ch]:
                return False              # stack empty OR top doesn't match
            stack.pop()                  # matched — remove the opening bracket
    return len(stack) == 0               # unmatched opens would remain

# Trace: s = "{[()]}"
# '{' → push: [{]
# '[' → push: [{, []
# '(' → push: [{, [, (]
# ')' → pairs[')']='(' == stack[-1]='(' → pop: [{, []
# ']' → pairs[']']='[' == stack[-1]='[' → pop: [{]
# '}' → pairs['}]='{' == stack[-1]='{' → pop: []
# Return len([]) == 0 → True ✓

print(is_valid("()[]{}"))   # → True
print(is_valid("(]"))       # → False
print(is_valid("{[()]}"))   # → True
print(is_valid("([)]"))     # → False  (wrong nesting order)</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li><strong>Forgetting empty stack check</strong>: If stack is empty on a closing bracket, return False immediately</li>
      <li><strong>Wrong map direction</strong>: Map closing → opening (not opening → closing)</li>
      <li><strong>Not checking stack empty at end</strong>: "((()" has unmatched opens — must check <code>len(stack) == 0</code></li>
    </ul>
    <h3>Pattern — Min Stack (O(1) get_min)</h3>
    <pre><code># Keep a parallel min_stack tracking the min AT EACH LEVEL
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        # min is either this new val or the current running min
        curr_min = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(curr_min)

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()          # both stacks always same height

    def get_min(self): return self.min_stack[-1]

ms = MinStack()
ms.push(5); ms.push(3); ms.push(7); ms.push(2)
print(ms.get_min())  # → 2
ms.pop()
print(ms.get_min())  # → 3</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png" alt="Voltorb" />
</div>`,
    quiz: [
      { q: 'Valid Parentheses uses which data structure?', choices: ['Queue','Stack','Hash Map','Array'], answer: 1 },
      { q: 'The string is valid if at the end the stack is?', choices: ['Full','Contains one item','Empty','Reversed'], answer: 2 },
      { q: 'For closing bracket ")", what must be true?', choices: ['Stack is non-empty AND top == "("','Stack is empty','Previous char is "("','Stack has even length'], answer: 0 },
      { q: 'Why does "([)]" return False even though counts match?', choices: ['Extra bracket','Wrong nesting order — ) closes before [ is closed','Different types','Stack overflow'], answer: 1 },
      { q: 'The pairs dict maps closing bracket to?', choices: ['Its index','Its matching opening bracket','Its ASCII value','Nothing'], answer: 1 },
      { q: 'MinStack achieves O(1) get_min by?', choices: ['Sorting on every push','Maintaining a parallel min_stack','Scanning entire stack','Caching last min'], answer: 1 },
    ],
    starterCode: `def is_valid(s):\n    stack = []\n    pairs = {')':'(', ']':'[', '}':'{'}\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif not stack or stack[-1] != pairs[ch]:\n            return False\n        else:\n            stack.pop()\n    return len(stack) == 0\n\nfor test in ["()[]{}","(]","([)]","{[]}"]:\n    print(f'"{test}" -> {is_valid(test)}')`,
    challenge: {
      prompt: `Variation: Min Stack (LC #155)\n\nDesign a stack that supports push, pop, and get_min in O(1) time.\n\nHint: Keep a second stack that tracks the current minimum at each level.\n\nImplement: push(val), pop(), get_min()`,
      code: `class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []  # tracks minimums\n\n    def push(self, val):\n        self.stack.append(val)\n        # Push to min_stack: min of val and current min\n        \n\n    def pop(self):\n        self.stack.pop()\n        self.min_stack.pop()\n\n    def get_min(self):\n        return self.min_stack[-1]\n\nms = MinStack()\nms.push(5)\nms.push(3)\nms.push(7)\nms.push(2)\nprint(ms.get_min())  # 2\nms.pop()\nprint(ms.get_min())  # 3`
    }
  },
  {
    id: 'lc_maxsub', track: 'lc', title: "Kadane's / Max Subarray (LC #53)",
    pokemon: { id: 59, name: 'Arcanine' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Maximum Subarray — LC #53</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Kadane's algorithm is a classic DP-on-array pattern that reduces O(n²) brute force to O(n) in one pass. The same "extend or reset" decision appears in Best Time to Buy Stock, Maximum Product Subarray, and any problem about "running optimal value."</p>
    <h3>Kadane's Algorithm — Traced</h3>
    <pre><code># At each element, choose: start a new subarray here, or extend existing one?
# curr_sum = max(n, curr_sum + n)
#   → if curr_sum was negative, adding it hurts — start fresh (take just n)
#   → if curr_sum was positive, extending helps — take curr_sum + n
def max_sub_array(nums):
    curr_sum = max_sum = nums[0]    # initialize to first element (handles all-negative)
    for n in nums[1:]:
        curr_sum = max(n, curr_sum + n)  # extend or restart
        max_sum  = max(max_sum, curr_sum)
    return max_sum

# Trace: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
# n=-2: curr=-2 max=-2
# n=1:  curr=max(1, -2+1)=max(1,-1)=1   max=1
# n=-3: curr=max(-3, 1-3)=max(-3,-2)=-2 max=1
# n=4:  curr=max(4, -2+4)=max(4,2)=4    max=4
# n=-1: curr=max(-1, 4-1)=max(-1,3)=3   max=4
# n=2:  curr=max(2, 3+2)=5              max=5
# n=1:  curr=max(1, 5+1)=6              max=6
# n=-5: curr=max(-5, 6-5)=1             max=6
# n=4:  curr=max(4, 1+4)=5              max=6  ← answer

print(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))  # → 6
print(max_sub_array([-1,-2,-3]))                # → -1  (best of a bad set)</code></pre>
    <h3>Variation: Best Time to Buy and Sell Stock</h3>
    <pre><code># Same "running optimal" idea — track min price seen so far
def max_profit(prices):
    min_price = float('inf')
    max_prof  = 0
    for price in prices:
        min_price = min(min_price, price)      # cheapest buy so far
        max_prof  = max(max_prof, price - min_price)  # profit if sold today
    return max_prof

print(max_profit([7,1,5,3,6,4]))  # → 5 (buy at 1, sell at 6)
print(max_profit([7,6,4,3,1]))    # → 0 (never profitable)</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li><strong>Initializing to 0 instead of nums[0]</strong>: If all numbers are negative, max is the least-negative number — 0 would be wrong</li>
      <li><strong>Not updating max_sum every iteration</strong>: The max could occur in the middle, not at the end</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png" alt="Arcanine" />
</div>`,
    quiz: [
      { q: "Kadane's time and space complexity?", choices: ['O(n²) time, O(1) space','O(n) time, O(n) space','O(n) time, O(1) space','O(n log n) time, O(1) space'], answer: 2 },
      { q: 'curr_sum update formula is?', choices: ['curr_sum + n','max(n, curr_sum + n)','min(n, curr_sum)','n only'], answer: 1 },
      { q: 'For all-negative array [-3,-1,-2], the answer is?', choices: ['-6','-1','0','-3'], answer: 1 },
      { q: 'Why initialize max_sum = nums[0] instead of 0?', choices: ['Faster','Handles all-negative arrays correctly','Python requires it','Avoids index errors'], answer: 1 },
      { q: 'curr_sum = max(n, curr_sum+n) means?', choices: ['Start fresh if curr_sum was negative','Always extend','Always restart','Take smaller value'], answer: 0 },
      { q: 'Best Time to Buy Stock uses the same idea by tracking?', choices: ['Max price so far','Min price seen so far','Sorted prices','Complement prices'], answer: 1 },
    ],
    starterCode: `def max_sub_array(nums):\n    max_sum = curr_sum = nums[0]\n    for n in nums[1:]:\n        curr_sum = max(n, curr_sum + n)\n        max_sum  = max(max_sum, curr_sum)\n    return max_sum\n\nprint(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))\nprint(max_sub_array([-1,-2,-3]))`,
    challenge: {
      prompt: `Variation: Best Time to Buy and Sell Stock (LC #121)\n\nGiven a list of daily prices, find the maximum profit from one buy and one sell (buy before sell).\n\nUse Kadane's thinking: track the min price seen so far, update max profit at each step.\n\nTest:\n[7,1,5,3,6,4] → 5 (buy at 1, sell at 6)\n[7,6,4,3,1] → 0 (prices only fall)`,
      code: `def max_profit(prices):\n    min_price = float('inf')\n    max_prof = 0\n    for price in prices:\n        # Update min_price and max_prof\n        pass\n    return max_prof\n\nprint(max_profit([7,1,5,3,6,4]))\nprint(max_profit([7,6,4,3,1]))`
    }
  },
  {
    id: 'lc_stairs', track: 'lc', title: 'Climbing Stairs (LC #70)',
    pokemon: { id: 245, name: 'Suicune' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Climbing Stairs — LC #70</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Climbing Stairs is the gateway DP problem. It teaches the core DP insight: "the answer at step n depends only on the answers at n-1 and n-2." This exact pattern appears in House Robber, Fibonacci, Min Cost Climbing Stairs, and all 1D DP problems.</p>
    <h3>Building the Intuition</h3>
    <pre><code># How many ways to climb n stairs taking 1 or 2 steps at a time?
# To REACH step n, you must have come from step n-1 (took 1 step)
#                              OR from step n-2 (took 2 steps)
# So: ways(n) = ways(n-1) + ways(n-2)  ← This is Fibonacci!

# Manual trace:
# n=1: 1 way  [1]
# n=2: 2 ways [1,1] or [2]
# n=3: 3 ways [1,1,1] [1,2] [2,1]
# n=4: 5 ways [1,1,1,1] [1,1,2] [1,2,1] [2,1,1] [2,2]
# n=5: 8 ways ...  → 1,1,2,3,5,8,13 — Fibonacci sequence!

# O(n) time, O(1) space
def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2         # a = ways(n-2), b = ways(n-1)
    for _ in range(3, n + 1):
        a, b = b, a + b  # new b = old a + old b
    return b

for i in range(1, 8):
    print(f"n={i}: {climb_stairs(i)} ways")</code></pre>
    <h3>Variation: Min Cost Climbing Stairs</h3>
    <pre><code># Each step costs cost[i]. Find minimum cost to reach top (past last index).
# dp[i] = cost[i] + min(dp[i-1], dp[i-2])
def min_cost_climbing(cost):
    n = len(cost)
    if n == 1: return cost[0]
    prev2, prev1 = cost[0], cost[1]
    for i in range(2, n):
        curr = cost[i] + min(prev1, prev2)
        prev2, prev1 = prev1, curr
    return min(prev1, prev2)  # can start from 0 or 1

print(min_cost_climbing([10, 15, 20]))  # → 15</code></pre>
    <h3>Variation: House Robber</h3>
    <pre><code># Can't rob adjacent houses. Max loot?
# dp[i] = max(dp[i-1], dp[i-2] + nums[i])
def house_robber(nums):
    prev2, prev1 = 0, 0
    for n in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + n)
    return prev1

print(house_robber([2, 7, 9, 3, 1]))  # → 12</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/245.png" alt="Suicune" />
</div>`,
    quiz: [
      { q: 'For n=4, how many distinct ways?', choices: ['3','4','5','6'], answer: 2 },
      { q: 'Climbing stairs is equivalent to which famous sequence?', choices: ['Factorial','Fibonacci','Powers of 2','Prime numbers'], answer: 1 },
      { q: 'The O(1) space solution only needs to track how many previous values?', choices: ['n values','1 value','2 values','n/2 values'], answer: 2 },
      { q: 'ways(n) = ways(n-1) + ways(n-2) because?', choices: ['Its recursive by definition','To reach n you came from n-1 or n-2','Its a guess','Fibonacci says so'], answer: 1 },
      { q: 'Min Cost Climbing Stairs transition is?', choices: ['dp[i] = cost[i]','dp[i] = cost[i] + min(dp[i-1], dp[i-2])','dp[i] = dp[i-1] + dp[i-2]','dp[i] = max(dp[i-1], dp[i-2])'], answer: 1 },
      { q: 'House Robber transition dp[i] = max(dp[i-1], dp[i-2]+nums[i]) means?', choices: ['Rob every house','Skip or rob current house','Always rob current','Random choice'], answer: 1 },
    ],
    starterCode: `def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b\n\nfor i in range(1, 8):\n    print(f"n={i}: {climb_stairs(i)} ways")`,
    challenge: {
      prompt: `Variation: Min Cost Climbing Stairs (LC #746)\n\nYou can start at index 0 or 1. Each step costs cost[i]. You can climb 1 or 2 steps at a time. Find the minimum cost to reach the top (past the last index).\n\ndp[i] = cost[i] + min(dp[i-1], dp[i-2])\n\nTest:\ncost=[10,15,20] → 15\ncost=[1,100,1,1,1,100,1,1,100,1] → 6`,
      code: `def min_cost_climbing(cost):\n    n = len(cost)\n    if n == 1: return cost[0]\n    # Initialize first two\n    prev2, prev1 = cost[0], cost[1]\n    for i in range(2, n):\n        curr = cost[i] + min(prev1, prev2)\n        prev2, prev1 = prev1, curr\n    return min(prev1, prev2)\n\nprint(min_cost_climbing([10,15,20]))\nprint(min_cost_climbing([1,100,1,1,1,100,1,1,100,1]))`
    }
  },
  {
    id: 'lc_binsearch', track: 'lc', title: 'Binary Search (LC #704)',
    pokemon: { id: 249, name: 'Lugia' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Binary Search — LC #704</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> LC #704 is the purest form of binary search — commit the template to muscle memory. From here you'll handle rotated arrays, finding boundaries, and "search on answer" — all variants of the same template with one parameter changed.</p>
    <h3>Core Template (Memorize This)</h3>
    <pre><code>def search(nums, target):
    left, right = 0, len(nums) - 1   # inclusive on both ends
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1            # target is to the RIGHT
        else:
            right = mid - 1           # target is to the LEFT
    return -1

print(search([-1,0,3,5,9,12], 9))    # → 4
print(search([-1,0,3,5,9,12], 2))    # → -1</code></pre>
    <h3>Search in Rotated Sorted Array (LC #33)</h3>
    <pre><code># Key insight: In a rotated array, ONE HALF is always fully sorted.
# Use that to decide which half the target is in.
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target: return mid
        if nums[left] <= nums[mid]:      # left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1          # target in left half
            else:
                left = mid + 1           # target in right half
        else:                            # right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1           # target in right half
            else:
                right = mid - 1          # target in left half
    return -1

print(search_rotated([4,5,6,7,0,1,2], 0))   # → 4
print(search_rotated([4,5,6,7,0,1,2], 3))   # → -1</code></pre>
    <h3>Find Minimum in Rotated Sorted Array (LC #153)</h3>
    <pre><code># The minimum is where the "drop" is — always in the unsorted half
def find_min(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1           # min is in right half
        else:
            right = mid              # mid could be the min
    return nums[left]

print(find_min([3,4,5,1,2]))  # → 1
print(find_min([4,5,6,7,0,1,2]))  # → 0</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png" alt="Lugia" />
</div>`,
    quiz: [
      { q: 'The while loop condition for standard binary search is?', choices: ['left > right','left < right','left <= right','left != right'], answer: 2 },
      { q: 'After nums[mid] < target, you set?', choices: ['right = mid','left = mid','right = mid - 1','left = mid + 1'], answer: 3 },
      { q: 'Binary search on rotated array works because?', choices: ['It cant be done','One half is always fully sorted','Sort it first','Target is always in right half'], answer: 1 },
      { q: 'Why use left + (right-left)//2 for mid?', choices: ['Faster','Avoids integer overflow in other languages','Python requires it','Handles negatives better'], answer: 1 },
      { q: 'In rotated array [4,5,6,7,0,1,2], the minimum value is?', choices: ['4','0','2','7'], answer: 1 },
      { q: 'search([1,3,5,7,9], 6) returns?', choices: ['5','3','-1','2'], answer: 2 },
    ],
    starterCode: `def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nprint(search([-1,0,3,5,9,12], 9))\nprint(search([-1,0,3,5,9,12], 2))`,
    challenge: {
      prompt: `Search on Answer: Koko Eating Bananas (LC #875)\n\nKoko can eat k bananas/hour. She has piles and h hours. Find the minimum k to finish all bananas.\n\nBinary search k between 1 and max(piles).\nFor each k, compute hours needed: sum(ceil(pile/k) for each pile).\n\nTest:\npiles=[3,6,7,11], h=8 → 4\npiles=[30,11,23,4,20], h=5 → 30`,
      code: `import math\n\ndef min_eating_speed(piles, h):\n    left, right = 1, max(piles)\n    result = right\n    while left <= right:\n        mid = (left + right) // 2\n        hours = sum(math.ceil(p / mid) for p in piles)\n        if hours <= h:\n            result = mid\n            right = mid - 1\n        else:\n            left = mid + 1\n    return result\n\nprint(min_eating_speed([3,6,7,11], 8))\nprint(min_eating_speed([30,11,23,4,20], 5))`
    }
  },
  {
    id: 'lc_longest_sub', track: 'lc', title: 'Longest Substring (LC #3)',
    pokemon: { id: 330, name: 'Flygon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Longest Substring Without Repeating Characters — LC #3</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> This is the canonical variable sliding window problem. Master the expand/shrink pattern here and you'll recognize it in Minimum Window Substring, Longest Substring with At Most K Distinct Characters, Fruits into Baskets, and Permutation in String.</p>
    <h3>Solution — Traced</h3>
    <pre><code># Maintain a window [left, right] with no duplicates.
# Expand right every iteration. When duplicate found, shrink from left.
def length_of_longest_substring(s):
    seen = set()
    left = 0
    max_len = 0
    for right in range(len(s)):
        while s[right] in seen:    # duplicate found — shrink
            seen.remove(s[left])
            left += 1
        seen.add(s[right])          # extend window
        max_len = max(max_len, right - left + 1)
    return max_len

# Trace: s = "abcabcbb"
# right=0 'a': add a. window=[a]       len=1
# right=1 'b': add b. window=[a,b]     len=2
# right=2 'c': add c. window=[a,b,c]   len=3
# right=3 'a': 'a' in seen → remove s[left=0]='a', left=1. window=[b,c,a] len=3
# right=4 'b': 'b' in seen → remove s[left=1]='b', left=2. window=[c,a,b] len=3
# ... max stays 3 ✓</code></pre>
    <h3>Optimization: Use Dict for O(1) Jump</h3>
    <pre><code># Instead of removing one by one, jump left directly to duplicate+1
def length_of_longest_substring_fast(s):
    char_index = {}             # char → most recent index
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= left:
            left = char_index[ch] + 1  # jump past duplicate
        char_index[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len

print(length_of_longest_substring("abcabcbb"))  # → 3
print(length_of_longest_substring("pwwkew"))    # → 3  ("wke")
print(length_of_longest_substring(""))          # → 0</code></pre>
    <h3>Common Mistakes</h3>
    <ul>
      <li><strong>Window size formula</strong>: It's <code>right - left + 1</code> (inclusive on both ends)</li>
      <li><strong>Dict optimization gotcha</strong>: Must check <code>char_index[ch] >= left</code> — the old position might be OUTSIDE current window</li>
      <li><strong>Empty string</strong>: Initialize max_len=0, not -1, so empty string returns 0</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/330.png" alt="Flygon" />
</div>`,
    quiz: [
      { q: 'Longest Substring uses which algorithm pattern?', choices: ['Binary search','Sliding window','Dynamic programming','BFS'], answer: 1 },
      { q: 'For "abcabcbb", the answer is?', choices: ['4','2','3','7'], answer: 2 },
      { q: 'When do you move the left pointer?', choices: ['Every iteration','When a duplicate character enters the window','When right reaches end','Never'], answer: 1 },
      { q: 'Window size with inclusive bounds [left, right] is?', choices: ['right - left','right - left + 1','right + left','right * left'], answer: 1 },
      { q: 'The dict optimization jumps left to duplicate+1 but must also check?', choices: ['char is a letter','char_index[ch] >= left (not stale)','right < n','Seen count'], answer: 1 },
      { q: 'For "pwwkew", the answer is?', choices: ['2','3','4','1'], answer: 1 },
    ],
    starterCode: `def length_of_longest_substring(s):\n    seen = set()\n    left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nprint(length_of_longest_substring("abcabcbb"))\nprint(length_of_longest_substring("pwwkew"))`,
    challenge: {
      prompt: `Variation: Minimum Window Substring (LC #76 — hard but classic)\n\nGiven strings s and t, find the minimum window in s that contains all characters of t.\n\nUse a sliding window with two frequency maps.\n\nTest:\ns="ADOBECODEBANC", t="ABC" → "BANC"\ns="a", t="a" → "a"`,
      code: `from collections import Counter\n\ndef min_window(s, t):\n    if not t or not s: return ""\n    need = Counter(t)\n    have = {}\n    formed = 0\n    required = len(need)\n    left = 0\n    best = (float('inf'), 0, 0)  # (length, left, right)\n    for right, ch in enumerate(s):\n        have[ch] = have.get(ch, 0) + 1\n        if ch in need and have[ch] == need[ch]:\n            formed += 1\n        while formed == required:\n            if right - left + 1 < best[0]:\n                best = (right - left + 1, left, right)\n            have[s[left]] -= 1\n            if s[left] in need and have[s[left]] < need[s[left]]:\n                formed -= 1\n            left += 1\n    return "" if best[0] == float('inf') else s[best[1]:best[2]+1]\n\nprint(min_window("ADOBECODEBANC", "ABC"))\nprint(min_window("a", "a"))`
    }
  },
  {
    id: 'lc_product', track: 'lc', title: 'Product Except Self (LC #238)',
    pokemon: { id: 196, name: 'Espeon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Product Except Self — LC #238</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> This is a classic "prefix/suffix precomputation" problem. The trick — two passes, no division — is a template for Trapping Rain Water, Sum of Subarray Minimums, and any "at position i, combine info from left and right." Interviewers love that it can't be solved naively without division (and division breaks on zeros).</p>
    <h3>The Trick: Two-Pass Prefix × Suffix</h3>
    <pre><code># output[i] = (product of everything LEFT of i) × (product of everything RIGHT of i)
#
# Pass 1 (left to right): fill output[i] with prefix product up to but NOT including i
# Pass 2 (right to left): multiply by suffix product from right side

def product_except_self(nums):
    n = len(nums)
    output = [1] * n

    # Left pass: output[i] = product of nums[0..i-1]
    prefix = 1
    for i in range(n):
        output[i] = prefix    # store left product at position i
        prefix *= nums[i]     # update for next iteration

    # Right pass: multiply output[i] by product of nums[i+1..n-1]
    suffix = 1
    for i in range(n - 1, -1, -1):
        output[i] *= suffix   # combine with right product
        suffix *= nums[i]     # update for next iteration

    return output

# Trace: [1, 2, 3, 4]
# After left pass:  output = [1,  1,  2,  6]
#                            ↑   ↑   ↑   ↑
#                           1   1×1 1×2 1×2×3
# After right pass: suffix starts at 1, going right to left
# i=3: output[3]=6×1=6,    suffix=4
# i=2: output[2]=2×4=8,    suffix=12
# i=1: output[1]=1×12=12,  suffix=24
# i=0: output[0]=1×24=24,  suffix=24
# Result: [24, 12, 8, 6] ✓

print(product_except_self([1,2,3,4]))    # → [24, 12, 8, 6]
print(product_except_self([-1,1,0,-3,3]))  # → [0, 0, 9, 0, 0]</code></pre>
    <h3>Why Not Use Division?</h3>
    <ul>
      <li>If any element is 0, total product is 0, and dividing by 0 is undefined</li>
      <li>Even with no zeros, the problem explicitly says no division allowed</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png" alt="Espeon" />
</div>`,
    quiz: [
      { q: 'Why not divide total product by nums[i]?', choices: ['Division is slow','Array might contain zeros which breaks division','Python prevents it','You can use division'], answer: 1 },
      { q: 'After the left pass, output[i] contains?', choices: ['All elements product','Product of elements to the RIGHT of i','Product of elements to the LEFT of i','nums[i]'], answer: 2 },
      { q: 'Time and space complexity (not counting output)?', choices: ['O(n²) time, O(n) space','O(n log n) time, O(n) space','O(n) time, O(1) space','O(n) time, O(n) space'], answer: 2 },
      { q: 'product_except_self([1,2,3,4]) → ?', choices: ['[1,2,3,4]','[4,3,2,1]','[24,12,8,6]','[2,3,4,5]'], answer: 2 },
      { q: 'The second pass multiplies by suffix going which direction?', choices: ['Left to right','Right to left','Random','Both directions'], answer: 1 },
      { q: 'This same prefix/suffix technique applies to?', choices: ['Fibonacci only','Sorting','Trapping Rain Water and similar problems','Two Sum'], answer: 2 },
    ],
    starterCode: `def product_except_self(nums):\n    n = len(nums)\n    output = [1] * n\n    prefix = 1\n    for i in range(n):\n        output[i] = prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(n-1, -1, -1):\n        output[i] *= suffix\n        suffix *= nums[i]\n    return output\n\nprint(product_except_self([1,2,3,4]))`,
    challenge: {
      prompt: `Apply prefix/suffix thinking to: Trapping Rain Water (LC #42)\n\nFor each position, water = min(max_left, max_right) - height[i].\n\nPrecompute left_max and right_max arrays, then sum the water.\n\nTest:\nheight=[0,1,0,2,1,0,1,3,2,1,2,1] → 6\nheight=[4,2,0,3,2,5] → 9`,
      code: `def trap(height):\n    n = len(height)\n    left_max = [0] * n\n    right_max = [0] * n\n    # Fill left_max: max height from left up to i\n    left_max[0] = height[0]\n    for i in range(1, n):\n        left_max[i] = max(left_max[i-1], height[i])\n    # Fill right_max\n    right_max[n-1] = height[n-1]\n    for i in range(n-2, -1, -1):\n        right_max[i] = max(right_max[i+1], height[i])\n    # Sum water\n    water = 0\n    for i in range(n):\n        water += min(left_max[i], right_max[i]) - height[i]\n    return water\n\nprint(trap([0,1,0,2,1,0,1,3,2,1,2,1]))\nprint(trap([4,2,0,3,2,5]))`
    }
  },
  {
    id: 'lc_numislands', track: 'lc', title: 'Number of Islands (LC #200)',
    pokemon: { id: 598, name: 'Ferrothorn' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Number of Islands — LC #200</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Number of Islands is the entry point to all grid graph problems. The template — treat cells as graph nodes, DFS/BFS on 4 neighbors — applies to Max Area of Island, Pacific Atlantic Water Flow, Surrounded Regions, Rotting Oranges (BFS), and Walls and Gates.</p>
    <h3>Grid DFS — Count Connected Components</h3>
    <pre><code># Think of the grid as a graph: each '1' cell is a node, connected to 4 neighbors.
# Count how many connected components of '1's exist.
def num_islands(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        # Out of bounds or not land — stop
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '#'     # mark visited (modify in-place)
        dfs(r+1, c); dfs(r-1, c)
        dfs(r, c+1); dfs(r, c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)    # flood-fill the entire island
                count += 1   # entire component visited — count it
    return count

grid = [
    ["1","1","0","0","0"],
    ["1","1","0","0","0"],
    ["0","0","1","0","0"],
    ["0","0","0","1","1"],
]
print(num_islands(grid))   # → 3</code></pre>
    <h3>Variation: Max Area of Island (LC #695)</h3>
    <pre><code># Same DFS, but return island SIZE instead of just marking visited
def max_area_of_island(grid):
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != 1:
            return 0
        grid[r][c] = -1      # mark visited
        return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1)

    return max(dfs(r, c) for r in range(rows) for c in range(cols)
               if grid[r][c] == 1) or 0</code></pre>
    <h3>BFS Template (Rotting Oranges / Shortest Steps)</h3>
    <pre><code>from collections import deque
def bfs_grid(grid, start_r, start_c):
    rows, cols = len(grid), len(grid[0])
    q = deque([(start_r, start_c, 0)])    # (row, col, distance)
    visited = {(start_r, start_c)}
    while q:
        r, c, dist = q.popleft()
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr,nc) not in visited:
                visited.add((nr, nc))
                q.append((nr, nc, dist + 1))</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/598.png" alt="Ferrothorn" />
</div>`,
    quiz: [
      { q: 'How does the DFS mark a cell as visited in-place?', choices: ['Delete it from grid','Set to "0"','Set to "#" or any non-land value','Separate visited set'], answer: 2 },
      { q: 'One complete DFS call from a land cell marks?', choices: ['A single row','A single column','The entire connected island','The entire grid'], answer: 2 },
      { q: 'Time complexity of num_islands?', choices: ['O(rows)','O(rows+cols)','O(rows × cols)','O(1)'], answer: 2 },
      { q: 'To find MAX AREA instead of count, modify DFS to?', choices: ['Count differently at end','Return island size (1 + 4 neighbors)','Use BFS instead','Sort islands'], answer: 1 },
      { q: 'For BFS (shortest steps) on a grid, use?', choices: ['Stack','Priority queue','deque with distance','Recursion'], answer: 2 },
      { q: '4-directional neighbors of cell (r,c) are?', choices: ['(r+1,c) only','(r±1,c) and (r,c±1)','(r+1,c+1) and (r-1,c-1)','All 8 adjacent cells'], answer: 1 },
    ],
    starterCode: `def num_islands(grid):\n    if not grid: return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':\n            return\n        grid[r][c] = '#'\n        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                dfs(r, c); count += 1\n    return count\n\ngrid = [["1","1","0"],["1","1","0"],["0","0","1"]]\nprint(num_islands(grid))`,
    challenge: {
      prompt: `Variation: Max Area of Island (LC #695)\n\nInstead of counting islands, return the area of the largest island.\n\nModify the DFS to return the size of each island, track the maximum.\n\nTest:\ngrid = [\n  ["0","1","1","0"],\n  ["1","1","0","0"],\n  ["0","0","1","0"]\n] → 4`,
      code: `def max_area_of_island(grid):\n    rows, cols = len(grid), len(grid[0])\n    \n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':\n            return 0\n        grid[r][c] = '#'\n        # Return 1 + sum of 4 neighbors\n        return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1)\n    \n    max_area = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                max_area = max(max_area, dfs(r, c))\n    return max_area\n\ngrid = [["0","1","1","0"],["1","1","0","0"],["0","0","1","0"]]\nprint(max_area_of_island(grid))`
    }
  },
  {
    id: 'lc_coinchange', track: 'lc', title: 'Coin Change (LC #322)',
    pokemon: { id: 384, name: 'Rayquaza' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Coin Change — LC #322</h2>
    <p class="lesson-why">🎯 <strong>Why this matters:</strong> Coin Change is the classic "unbounded knapsack" DP problem. It teaches the bottom-up DP approach that fills a table from 0 to the answer. This exact pattern applies to Coin Change II (count ways), Word Break, Jump Game, and any "can we reach target using repeated choices" problem.</p>
    <h3>Bottom-Up DP — Traced</h3>
    <pre><code># dp[i] = minimum coins needed to make amount i
# Transition: for each coin, dp[i] = min(dp[i], dp[i - coin] + 1)
# "Use this coin (1 coin) + optimal solution for the remaining (i - coin)"
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)  # start: all impossible
    dp[0] = 0                           # 0 coins to make amount 0

    for a in range(1, amount + 1):      # fill from 1 to amount
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

# Trace: coins=[1,5,10], amount=7
# dp[0]=0
# dp[1]: try 1 → dp[1-1]+1=1; dp[1]=1
# dp[2]: try 1 → dp[1]+1=2;   dp[2]=2
# dp[5]: try 5 → dp[0]+1=1;   dp[5]=1
# dp[6]: try 1 → dp[5]+1=2; try 5 → dp[1]+1=2; dp[6]=2
# dp[7]: try 1 → dp[6]+1=3; try 5 → dp[2]+1=3; dp[7]=2 ← 5+1+1

print(coin_change([1,5,10], 7))    # → 2  (5+1+1? No: 5+1+1=7, 3 coins!)
print(coin_change([1,5,11], 15))   # → 3  (5+9? No: 11+3×1? = 4; 5+5+5=3) ✓
print(coin_change([2], 3))         # → -1 (impossible)
print(coin_change([1,2,5], 11))    # → 3  (5+5+1)</code></pre>
    <h3>Variation: Count Ways (Coin Change II)</h3>
    <pre><code># dp[i] = number of ways to make amount i
# Transition: dp[i] += dp[i - coin]
# Process each coin OUTER loop to avoid duplicate combos
def coin_change_ways(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1   # one way to make 0: use no coins
    for coin in coins:              # OUTER loop over coins (avoids ordering duplicates)
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    return dp[amount]

print(coin_change_ways([1,2,5], 5))   # → 4 ways: [5],[2+2+1],[2+1+1+1],[1×5]</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png" alt="Rayquaza" />
</div>`,
    quiz: [
      { q: 'dp[0] is initialized to?', choices: ['1','float("inf")','0','-1'], answer: 2 },
      { q: 'dp[i] represents?', choices: ['Coin value at index i','Minimum coins to make amount i','Maximum coins possible','i-th coin in sorted order'], answer: 1 },
      { q: 'If dp[amount] is still float("inf") after filling, return?', choices: ['0','float("inf")','amount','-1'], answer: 3 },
      { q: 'The transition dp[i] = min(dp[i], dp[i-coin]+1) means?', choices: ['Use all coins','Use this coin once and optimally solve remainder','Sort coins first','Greedy choice'], answer: 1 },
      { q: 'For Coin Change II (count ways), dp is initialized with dp[0] = ?', choices: ['0','float("inf")','1','-1'], answer: 2 },
      { q: 'coin_change([2], 3) returns -1 because?', choices: ['Coins must be sorted','3 is odd and only coin is 2 — impossible to sum to 3','dp not initialized','3 > len(coins)'], answer: 1 },
    ],
    starterCode: `def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for coin in coins:\n        for i in range(coin, amount + 1):\n            dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1\n\nprint(coin_change([1,5,11], 15))\nprint(coin_change([1,2,5], 11))\nprint(coin_change([2], 3))`,
    challenge: {
      prompt: `Variation: Coin Change II — Count Ways (LC #518)\n\nInstead of minimum coins, count the number of ways to make the amount.\n\ndp[0] = 1 (one way to make 0: use no coins)\nFor each coin, for each amount i >= coin: dp[i] += dp[i - coin]\n\nTest:\ncoins=[1,2,5], amount=5 → 4\ncoins=[2], amount=3 → 0`,
      code: `def coin_change_ways(coins, amount):\n    dp = [0] * (amount + 1)\n    dp[0] = 1  # one way to make 0\n    for coin in coins:\n        for i in range(coin, amount + 1):\n            # Add ways using this coin\n            pass\n    return dp[amount]\n\nprint(coin_change_ways([1,2,5], 5))\nprint(coin_change_ways([2], 3))\nprint(coin_change_ways([10], 10))`
    }
  },
];

// ── SAVE / LOAD ───────────────────────────────────────────────
function saveState() {
  const serialized = {
    trainerName: STATE.trainerName,
    starter: STATE.starter,
    starterStage: STATE.starterStage,
    xp: STATE.xp,
    completedLessons: [...STATE.completedLessons],
    caughtPokemon: STATE.caughtPokemon,
    currentLesson: STATE.currentLesson,
  };
  localStorage.setItem('pokethon_state', JSON.stringify(serialized));
  if (window.cloudSave) window.cloudSave(serialized);
}

function loadState() {
  const raw = localStorage.getItem('pokethon_state');
  if (!raw) return false;
  try {
    applyState(JSON.parse(raw));
    return true;
  } catch(e) {
    return false;
  }
}

function applyState(s) {
  STATE.trainerName      = s.trainerName      || 'Trainer';
  STATE.starter          = s.starter          || null;
  STATE.starterStage     = s.starterStage     ?? 0;
  STATE.xp               = s.xp              || 0;
  STATE.completedLessons = s.completedLessons || [];
  STATE.caughtPokemon    = s.caughtPokemon    || [];
  STATE.currentLesson    = s.currentLesson    || null;
}

// ── SCREEN NAVIGATION ─────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome() {
  // If trainer already has a starter, logo click just returns to bootcamp
  if (STATE.starter) {
    startBootcamp();
    return;
  }
  showScreen('screen-home');
  document.getElementById('header-progress-wrap').style.display = 'none';
}

// ── STARTER PICKER ────────────────────────────────────────────
let selectedStarterData = null;
let activeGen = 1;

function goToStarterPick() {
  if (STATE.starter) { startBootcamp(); return; }
  const input = document.getElementById('trainer-name-input');
  const name = input.value.trim();
  if (!name) {
    input.focus();
    input.style.borderColor = 'var(--red)';
    setTimeout(() => input.style.borderColor = '', 800);
    return;
  }
  STATE.trainerName = name;
  buildGenTabs();
  renderStarterGrid(1);
  showScreen('screen-starter');
}

function buildGenTabs() {
  const tabs = document.getElementById('gen-tabs');
  tabs.innerHTML = GENERATIONS.map((g, i) => `
    <button class="gen-tab ${i === 0 ? 'active' : ''}"
      onclick="switchGen(${i+1}, this)">${g.label}</button>
  `).join('');
}

function switchGen(gen, btn) {
  activeGen = gen;
  document.querySelectorAll('.gen-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderStarterGrid(gen);
}

function renderStarterGrid(gen) {
  const grid = document.getElementById('starter-grid');
  const gens = STARTERS.filter(s => s.gen === gen);
  grid.innerHTML = gens.map(s => `
    <div class="starter-card ${selectedStarterData && selectedStarterData.id === s.id ? 'selected' : ''}"
         onclick="selectStarter(${s.id})">
      <img src="${SPRITE(s.id)}" alt="${s.name}" loading="lazy" />
      <div class="starter-card-name">${s.name}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center">${s.types.map(t =>
        '<span class="starter-card-type type-' + t.toLowerCase() + '">' + t + '</span>'
      ).join('')}</div>
    </div>
  `).join('');
}

function selectStarter(id) {
  selectedStarterData = STARTERS.find(s => s.id === id);
  renderStarterGrid(activeGen);
  showStarterConfirm(selectedStarterData);
}

function showStarterConfirm(s) {
  document.getElementById('starter-confirm-img').src = SPRITE(s.id);
  document.getElementById('starter-confirm-img').alt = s.name;
  document.getElementById('starter-confirm-name').textContent = s.name;
  document.getElementById('starter-confirm-type').innerHTML =
    s.types.map(t => '<span class="type-badge type-' + t.toLowerCase() + '">' + t + '</span>').join('');
  const names = s.evoChain.map(id => EVO_NAMES[id] || '?').join(' → ');
  document.getElementById('starter-confirm-evo').textContent = 'Evo: ' + names;
  document.getElementById('starter-confirm').classList.remove('hidden');
}

function confirmStarter() {
  if (!selectedStarterData) return;
  STATE.starter = selectedStarterData;
  STATE.starterStage = 0;
  STATE.caughtPokemon = [];
  STATE.completedLessons = [];
  STATE.xp = 0;
  saveState();
  startBootcamp();
}

// ── BOOTCAMP ──────────────────────────────────────────────────
function startBootcamp() {
  recalcStarterStage();
  showScreen('screen-bootcamp');
  document.getElementById('header-progress-wrap').style.display = '';
  buildSidebar();
  renderSidebarStarter();
  updateHeaderXP();
  const first = CURRICULUM.find(l => !STATE.completedLessons.includes(l.id));
  if (first) openLesson(first.id);
  else openLesson(CURRICULUM[CURRICULUM.length - 1].id);
}

function buildSidebar() {
  const tracks = { python: 'list-python', ds: 'list-ds', algo: 'list-algo', lc: 'list-lc' };
  Object.entries(tracks).forEach(([track, listId]) => {
    const el = document.getElementById(listId);
    if (!el) return;
    el.innerHTML = CURRICULUM.filter(l => l.track === track).map(l => {
      const done = STATE.completedLessons.includes(l.id);
      const locked = !isUnlocked(l.id);
      const active = STATE.currentLesson === l.id;
      const icon = done ? '✓' : locked ? '🔒' : '○';
      const click = locked ? '' : 'onclick="openLesson(\'' + l.id + '\')"';
      return '<div class="lesson-item' + (done?' done':'') + (locked?' locked':'') + (active?' active':'') + '" ' + click + '>' +
        '<span class="li-icon">' + icon + '</span>' +
        '<span class="li-title">' + l.title + '</span>' +
        '</div>';
    }).join('');
  });
}

function isUnlocked(id) {
  const idx = CURRICULUM.findIndex(l => l.id === id);
  if (idx === 0) return true;
  return STATE.completedLessons.includes(CURRICULUM[idx - 1].id);
}

function renderSidebarStarter() {
  const el = document.getElementById('sidebar-starter');
  if (!el || !STATE.starter) { if (el) el.innerHTML = ''; return; }
  const spriteId = STATE.starter.evoChain[STATE.starterStage];
  const name = EVO_NAMES[spriteId] || STATE.starter.name;
  const done = STATE.completedLessons.length;
  const total = CURRICULUM.length;
  const pct = Math.round((done / total) * 100);
  const nextThreshold = STATE.starterStage < 2
    ? Math.floor(total * (STATE.starterStage === 0 ? 0.33 : 0.66))
    : null;
  const nextEvo = nextThreshold !== null ? nextThreshold - done : null;
  el.innerHTML =
    '<img class="ss-sprite" src="' + SPRITE(spriteId) + '" alt="' + name + '" />' +
    '<div class="ss-info">' +
      '<div class="ss-name">' + name + '</div>' +
      '<div class="ss-level">Lv. ' + (done + 1) + '</div>' +
      (nextEvo !== null && nextEvo > 0 ? '<div class="ss-evo-hint">' + nextEvo + ' lesson' + (nextEvo !== 1 ? 's' : '') + ' to evolve</div>' : '') +
      '<div class="ss-xp-bar"><div class="ss-xp-fill" style="width:' + pct + '%"></div></div>' +
    '</div>';
}

function updateHeaderXP() {
  const pct = Math.min(100, (STATE.xp / MAX_XP) * 100);
  const fill = document.getElementById('header-xp-fill');
  const label = document.getElementById('header-xp-label');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = STATE.xp + ' XP';
}

// ── LESSON ────────────────────────────────────────────────────
function openLesson(id) {
  const lesson = CURRICULUM.find(l => l.id === id);
  if (!lesson || !isUnlocked(id)) return;
  STATE.currentLesson = id;
  buildSidebar();

  const completed = STATE.completedLessons.includes(id);
  const main = document.getElementById('main-content');

  const challengeHTML = lesson.challenge ? (
    '<div class="challenge-section">' +
      '<div class="challenge-header">&#x1F3AF; Your Challenge</div>' +
      '<pre class="challenge-prompt">' + lesson.challenge.prompt + '</pre>' +
      '<div class="code-editor-wrap">' +
        '<div class="editor-header">' +
          '<span class="editor-label">&#x1F40D;&nbsp; Python</span>' +
          '<button class="run-btn" onclick="runCode(\'ch_' + id + '\')">&#9654; Run</button>' +
        '</div>' +
        '<textarea id="code-editor-ch_' + id + '" class="code-editor" spellcheck="false">' + (lesson.challenge.code || '') + '</textarea>' +
        '<div id="code-output-ch_' + id + '" class="code-output hidden"></div>' +
      '</div>' +
    '</div>'
  ) : '';

  main.innerHTML =
    '<div class="lesson-content">' +
      lesson.content +
      '<div class="lesson-actions">' +
        '<div class="code-editor-wrap">' +
          '<div class="editor-header">' +
            '<span class="editor-label">&#x1F40D;&nbsp; Python &mdash; Example</span>' +
            '<button class="run-btn" onclick="runCode(\'' + id + '\')">&#9654; Run</button>' +
          '</div>' +
          '<textarea id="code-editor-' + id + '" class="code-editor" spellcheck="false">' + (lesson.starterCode || '') + '</textarea>' +
          '<div id="code-output-' + id + '" class="code-output hidden"></div>' +
        '</div>' +
        challengeHTML +
        (completed
          ? '<div class="already-done">&#10003; Lesson complete! <button class="quiz-btn" onclick="startQuiz(\'' + id + '\')">Retake Quiz</button></div>'
          : '<button class="quiz-btn" onclick="startQuiz(\'' + id + '\')">Take Quiz &#8594;</button>'
        ) +
      '</div>' +
    '</div>';

  // Tab key inserts 4 spaces instead of switching focus
  ['code-editor-' + id, 'code-editor-ch_' + id].forEach(edId => {
    const ta = document.getElementById(edId);
    if (ta) {
      ta.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = this.selectionStart;
          const end = this.selectionEnd;
          this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
          this.selectionStart = this.selectionEnd = start + 4;
        }
      });
    }
  });
}

// ── CODE RUNNER ───────────────────────────────────────────────
function runCode(lessonId) {
  const editor = document.getElementById('code-editor-' + lessonId);
  const output = document.getElementById('code-output-' + lessonId);
  if (!editor || !output) return;
  output.classList.remove('hidden');
  try {
    const js = pythonToJS(editor.value);
    const lines = [];
    const fn = new Function('console', js);
    fn({ log: (...args) => lines.push(args.map(String).join(' ')) });
    output.textContent = lines.join('\n') || '(no output)';
    output.classList.remove('error');
  } catch(e) {
    output.textContent = 'Error: ' + e.message;
    output.classList.add('error');
  }
}

function pythonToJS(code) {
  let js = code;
  js = js.replace(/#.*$/gm, '');
  js = js.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
  js = js.replace(/f"([^"]*)"/g, (_, s) => '`' + s.replace(/\{([^}]+)\}/g, '${$1}') + '`');
  js = js.replace(/f'([^']*)'/g, (_, s) => '`' + s.replace(/\{([^}]+)\}/g, '${$1}') + '`');
  js = js.replace(/\bprint\s*\(([^)]*)\)/g, 'console.log($1)');
  js = js.replace(/\bnot\s+/g, '!');
  js = js.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||');
  js = js.replace(/\*\*/g, '**');
  js = js.replace(/\blen\s*\(([^)]+)\)/g, '($1).length');
  js = js.replace(/\brange\s*\(([^,)]+),\s*([^,)]+)\)/g,
    (_, a, b) => '{[Symbol.iterator]:function*(){for(let _i=' + a + ';_i<' + b + ';_i++)yield _i;}}');
  js = js.replace(/\brange\s*\(([^)]+)\)/g,
    (_, n) => '{[Symbol.iterator]:function*(){for(let _i=0;_i<' + n + ';_i++)yield _i;}}');
  js = js.replace(/\.append\s*\(/g, '.push(');
  js = js.replace(/\.items\s*\(\)/g, '.entries()');
  js = js.replace(/\.keys\s*\(\)/g, '.keys()');
  js = js.replace(/\.values\s*\(\)/g, '.values()');
  js = js.replace(/\blist\s*\(([^)]*)\)/g, 'Array.from($1)');
  js = js.replace(/for\s+(\w+),\s*(\w+)\s+in\s+(.+?):/g, 'for (const [$1, $2] of $3) {');
  js = js.replace(/for\s+(\w+)\s+in\s+(.+?):/g, 'for (const $1 of $2) {');
  js = js.replace(/while\s+(.+?):/g, 'while ($1) {');
  js = js.replace(/elif\s+(.+?):/g, '} else if ($1) {');
  js = js.replace(/if\s+(.+?):/g, 'if ($1) {');
  js = js.replace(/else\s*:/g, '} else {');
  js = js.replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'function $1($2) {');
  js = js.replace(/class\s+(\w+)\s*:/g, 'class $1 {');
  return closeBlocks(js);
}

function closeBlocks(code) {
  const lines = code.split('\n');
  const result = [];
  const stack = [0];
  for (const line of lines) {
    if (line.trim() === '') { result.push(''); continue; }
    const indent = line.search(/\S/);
    while (stack.length > 1 && stack[stack.length - 1] > indent) {
      stack.pop();
      result.push(' '.repeat(indent) + '}');
    }
    if (indent > stack[stack.length - 1]) stack.push(indent);
    result.push(line);
  }
  while (stack.length > 1) { stack.pop(); result.push('}'); }
  return result.join('\n');
}

// ── QUIZ ENGINE ───────────────────────────────────────────────
let QUIZ_STATE = { lessonId: null, questions: [], index: 0, correct: 0 };

function startQuiz(lessonId) {
  const lesson = CURRICULUM.find(l => l.id === lessonId);
  if (!lesson) return;
  QUIZ_STATE = { lessonId, questions: lesson.quiz, index: 0, correct: 0 };
  document.getElementById('quiz-title').textContent = lesson.title;
  document.getElementById('quiz-overlay').classList.remove('hidden');
  renderQuizQuestion();
}

const LETTERS = ['A', 'B', 'C', 'D'];

function renderQuizQuestion() {
  const q = QUIZ_STATE.questions[QUIZ_STATE.index];
  const total = QUIZ_STATE.questions.length;
  document.getElementById('quiz-dots').innerHTML = QUIZ_STATE.questions.map((_, i) =>
    '<span class="qdot ' + (i < QUIZ_STATE.index ? 'done' : i === QUIZ_STATE.index ? 'current' : '') + '"></span>'
  ).join('');
  document.getElementById('quiz-body').innerHTML =
    '<div class="quiz-question">Q' + (QUIZ_STATE.index + 1) + '/' + total + ': ' + q.q + '</div>' +
    '<div class="quiz-options">' +
      q.choices.map((c, i) =>
        '<button class="quiz-opt" onclick="answerQuiz(' + i + ')">' +
          '<span class="opt-letter">' + LETTERS[i] + '</span>' +
          c +
        '</button>'
      ).join('') +
    '</div>';
}

function answerQuiz(choiceIdx) {
  const q = QUIZ_STATE.questions[QUIZ_STATE.index];
  const correct = choiceIdx === q.answer;
  if (correct) { QUIZ_STATE.correct++; addXP(25); }
  document.querySelectorAll('.quiz-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === choiceIdx) btn.classList.add('wrong');
  });
  setTimeout(() => {
    QUIZ_STATE.index++;
    if (QUIZ_STATE.index < QUIZ_STATE.questions.length) renderQuizQuestion();
    else showQuizResult();
  }, 800);
}

function showQuizResult() {
  const { lessonId, correct, questions } = QUIZ_STATE;
  const lesson = CURRICULUM.find(l => l.id === lessonId);
  const passed = correct >= Math.ceil(questions.length * 0.6);
  const mon = lesson.pokemon;
  document.getElementById('quiz-body').innerHTML =
    '<div class="quiz-result">' +
      '<img class="qr-sprite" src="' + SPRITE(mon.id) + '" alt="' + mon.name + '" />' +
      '<div class="qr-score">' + correct + '/' + questions.length + ' correct</div>' +
      '<div class="qr-verdict ' + (passed ? 'pass' : 'fail') + '">' + (passed ? 'Passed!' : 'Not quite — review the lesson') + '</div>' +
      (passed
        ? '<button class="quiz-btn" onclick="completeLesson(\'' + lessonId + '\')">Continue &#8594;</button>'
        : '<button class="quiz-btn" onclick="closeQuiz()">Try Again</button>'
      ) +
    '</div>';
}

function closeQuiz() {
  document.getElementById('quiz-overlay').classList.add('hidden');
}

function completeLesson(lessonId) {
  closeQuiz();
  if (!STATE.completedLessons.includes(lessonId)) {
    STATE.completedLessons.push(lessonId);
    addXP(50);
    const prevStage = STATE.starterStage;
    recalcStarterStage();
    const evolved = STATE.starterStage > prevStage;
    saveState();
    buildSidebar();
    renderSidebarStarter();
    showCatchSequence(lessonId, evolved);
  } else {
    buildSidebar();
  }
}

// ── XP ────────────────────────────────────────────────────────
function addXP(amount) {
  STATE.xp = Math.min(MAX_XP, STATE.xp + amount);
  updateHeaderXP();
  showXPToast('+' + amount + ' XP');
}

function showXPToast(msg) {
  const toast = document.getElementById('xp-toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); toast.classList.add('hidden'); }, 1500);
}

// ── CATCH SEQUENCE ────────────────────────────────────────────
const CATCHABLE = [
  10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,
  31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,
  54,55,56,57,58,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,
  76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,95,96,97,
  98,99,102,103,104,105,106,107,108,111,112,113,114,115,116,117,
  118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,
  134,135,136,137,138,139,140,141,142,143,147,148,
];

function showCatchSequence(lessonId, evolved) {
  const id = CATCHABLE[Math.floor(Math.random() * CATCHABLE.length)];
  const overlay = document.getElementById('catch-overlay');
  const inner = document.getElementById('catch-inner');

  const evoMsg = evolved
    ? '<div class="catch-evo-msg">&#11088; ' + (EVO_NAMES[STATE.starter.evoChain[STATE.starterStage]] || 'Your starter') + ' evolved!</div>'
    : '';

  inner.innerHTML =
    evoMsg +
    '<div class="catch-title">A wild Pokémon appeared!</div>' +
    '<div class="catch-ball-wrap">' +
      '<div class="catch-pokeball shake">' +
        '<div class="cpb-top"></div>' +
        '<div class="cpb-mid"><div class="cpb-btn"></div></div>' +
        '<div class="cpb-bot"></div>' +
      '</div>' +
    '</div>' +
    '<div class="catch-status">Catching...</div>';

  overlay.classList.remove('hidden');

  setTimeout(() => {
    if (!STATE.caughtPokemon.some(p => p.id === id)) {
      STATE.caughtPokemon.push({ id, name: '#' + id });
    }
    saveState();
    inner.innerHTML =
      evoMsg +
      '<img class="catch-pokemon-img" src="' + SPRITE(id) + '" alt="Pokemon #' + id + '" />' +
      '<div class="catch-title">Gotcha! Pokémon #' + id + ' was caught!</div>' +
      '<div class="catch-subtitle">Added to your Pokédex</div>' +
      '<button class="cta-btn" onclick="closeCatch(\'' + lessonId + '\')">Continue →</button>';
  }, 1800);
}

function closeCatch(lessonId) {
  document.getElementById('catch-overlay').classList.add('hidden');
  const idx = CURRICULUM.findIndex(l => l.id === lessonId);
  const next = CURRICULUM[idx + 1];
  if (next && isUnlocked(next.id)) openLesson(next.id);
  else openLesson(lessonId);
}

// ── TRAINER CARD ──────────────────────────────────────────────
function openTrainer() {
  document.getElementById('tc-name').textContent = STATE.trainerName;
  document.getElementById('tc-xp').textContent = STATE.xp;
  document.getElementById('tc-lessons').textContent = STATE.completedLessons.length;
  document.getElementById('tc-caught').textContent = STATE.caughtPokemon.length;

  const titles = ['Rookie','Learner','Coder','Developer','Senior Dev','Tech Lead','Pokéthon Master'];
  const titleIdx = Math.min(Math.floor(STATE.completedLessons.length / 5), titles.length - 1);
  document.getElementById('tc-title').textContent = titles[titleIdx];

  const avatarEl = document.getElementById('tc-avatar');
  if (STATE.starter) {
    avatarEl.innerHTML = '<img src="' + SPRITE(STATE.starter.evoChain[STATE.starterStage]) + '" alt="starter" />';
  }

  const starterRow = document.getElementById('tc-starter-row');
  if (STATE.starter) {
    const spriteId = STATE.starter.evoChain[STATE.starterStage];
    const name = EVO_NAMES[spriteId] || STATE.starter.name;
    const stageLabel = ['Base','Stage 2','Final'][STATE.starterStage];
    starterRow.innerHTML =
      '<img src="' + SPRITE(spriteId) + '" alt="' + name + '" class="tc-starter-img" />' +
      '<div>' +
        '<div class="tc-starter-name">' + name + '</div>' +
        '<div class="tc-starter-stage">' + stageLabel + ' — Lv. ' + (STATE.completedLessons.length + 1) + '</div>' +
      '</div>';
  } else {
    starterRow.innerHTML = '<span class="tc-empty">No starter chosen</span>';
  }

  const party = document.getElementById('tc-party');
  if (STATE.caughtPokemon.length === 0) {
    party.innerHTML = '<span class="tc-empty">No Pokémon caught yet</span>';
  } else {
    party.innerHTML = STATE.caughtPokemon.slice(-18).map(p =>
      '<div class="tc-party-mon"><img src="' + SPRITE(p.id) + '" alt="#' + p.id + '" title="Pokémon #' + p.id + '" /></div>'
    ).join('');
  }

  document.getElementById('trainer-overlay').classList.remove('hidden');
}

function closeTrainer() {
  document.getElementById('trainer-overlay').classList.add('hidden');
}

// ── INIT ──────────────────────────────────────────────────────
window.addEventListener('pokethon-cloud-loaded', e => {
  const cloud = e.detail;
  if ((cloud.completedLessons?.length ?? 0) >= STATE.completedLessons.length) {
    applyState(cloud);
    localStorage.setItem('pokethon_state', JSON.stringify(cloud));
    if (STATE.starter) startBootcamp();
  }
});

(function init() {
  const loaded = loadState();
  if (loaded && STATE.starter) {
    document.getElementById('trainer-name-input').value = STATE.trainerName;
    startBootcamp();
  } else if (loaded && STATE.trainerName !== 'Trainer') {
    document.getElementById('trainer-name-input').value = STATE.trainerName;
    buildGenTabs();
    renderStarterGrid(1);
    showScreen('screen-starter');
  }
})();
