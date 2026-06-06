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
    <p>Variables are containers for storing data. Python is dynamically typed — you don't need to declare a type.</p>
    <pre><code>trainer_name = "Ash"       # str
level = 10                 # int
catch_rate = 0.45          # float
has_badge = True           # bool

print(type(trainer_name))
print(f"Trainer: {trainer_name}, Level: {level}")</code></pre>
    <h3>Common Types</h3>
    <ul>
      <li><strong>int</strong> — whole numbers: <code>42</code></li>
      <li><strong>float</strong> — decimals: <code>3.14</code></li>
      <li><strong>str</strong> — text: <code>"Pikachu"</code></li>
      <li><strong>bool</strong> — True / False</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" />
</div>`,
    quiz: [
      { q: 'What is the type of 3.14?', choices: ['int','float','str','bool'], answer: 1 },
      { q: 'Which correctly creates a string variable?', choices: ['name = Ash','name = 42','name = "Ash"','name = True'], answer: 2 },
      { q: 'What does f"HP: {hp}" do?', choices: ['Multiplies hp','Inserts hp into string','Creates a function','None'], answer: 1 },
    ],
    starterCode: `trainer = "Ash"\nlevel = 1\nhp = 45.5\nprint(f"Trainer: {trainer}, Level: {level}, HP: {hp}")`
  },
  {
    id: 'py_lists', track: 'python', title: 'Lists & Indexing',
    pokemon: { id: 52, name: 'Meowth' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Lists &amp; Indexing</h2>
    <p>Lists store ordered collections. Index with <code>[]</code>, starting at 0.</p>
    <pre><code>party = ["Pikachu", "Charizard", "Blastoise"]
print(party[0])      # Pikachu
print(party[-1])     # Blastoise

party.append("Mewtwo")
party.remove("Blastoise")
print(len(party))    # 3</code></pre>
    <h3>Key Operations</h3>
    <ul>
      <li><code>list.append(x)</code> — add to end</li>
      <li><code>list.remove(x)</code> — remove first match</li>
      <li><code>list.pop(i)</code> — remove &amp; return at index</li>
      <li><code>list[start:end]</code> — slice</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png" alt="Meowth" />
</div>`,
    quiz: [
      { q: 'What index is the first element of a list?', choices: ['1','0','-1','None'], answer: 1 },
      { q: 'Which method adds an item to the end of a list?', choices: ['push','insert','append','add'], answer: 2 },
      { q: 'What does party[-1] return?', choices: ['First item','Error','Last item','Length'], answer: 2 },
    ],
    starterCode: `party = ["Bulbasaur", "Squirtle"]\nparty.append("Jigglypuff")\nprint(party)\nprint(f"Party size: {len(party)}")`
  },
  {
    id: 'py_dicts', track: 'python', title: 'Dictionaries',
    pokemon: { id: 137, name: 'Porygon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Dictionaries</h2>
    <p>Dicts store key→value pairs. Lookup is O(1) — constant time. Essential for interview problems.</p>
    <pre><code>pokemon = {
    "name": "Pikachu",
    "type": "Electric",
    "level": 25
}

print(pokemon["name"])          # Pikachu
pokemon["hp"] = 55              # add key
print(pokemon.get("speed", 0))  # 0 (default)

for key, val in pokemon.items():
    print(f"{key}: {val}")</code></pre>
    <h3>Key Methods</h3>
    <ul>
      <li><code>d[key]</code> — get (raises KeyError if missing)</li>
      <li><code>d.get(key, default)</code> — safe get</li>
      <li><code>d.keys()</code>, <code>d.values()</code>, <code>d.items()</code></li>
      <li><code>key in d</code> — membership check O(1)</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png" alt="Porygon" />
</div>`,
    quiz: [
      { q: 'Time complexity of dict lookup?', choices: ['O(n)','O(log n)','O(1)','O(n²)'], answer: 2 },
      { q: 'Which safely gets a value without raising an error?', choices: ['d[key]','d.fetch(key)','d.get(key)','d.find(key)'], answer: 2 },
      { q: 'How do you iterate over key-value pairs?', choices: ['for k in d','for k,v in d.items()','for k,v in d','for d in items()'], answer: 1 },
    ],
    starterCode: `stats = {"name": "Charizard", "type": "Fire", "level": 36}\nstats["hp"] = 150\nprint(stats.get("speed", "unknown"))\nfor k, v in stats.items():\n    print(f"{k}: {v}")`
  },
  {
    id: 'py_conditionals', track: 'python', title: 'Conditionals',
    pokemon: { id: 6, name: 'Charizard' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Conditionals</h2>
    <p>Control flow with <code>if / elif / else</code>. Python uses indentation instead of braces.</p>
    <pre><code>hp = 15

if hp == 0:
    print("Fainted!")
elif hp &lt; 20:
    print("Critical HP!")
else:
    print(f"HP: {hp}")

# Ternary
status = "low" if hp &lt; 20 else "good"</code></pre>
    <h3>Operators</h3>
    <ul>
      <li><code>==</code> equal, <code>!=</code> not equal</li>
      <li><code>&lt;</code> <code>&lt;=</code> <code>&gt;</code> <code>&gt;=</code></li>
      <li><code>and</code>, <code>or</code>, <code>not</code></li>
      <li><code>in</code>, <code>is</code></li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" alt="Charizard" />
</div>`,
    quiz: [
      { q: 'What does elif mean?', choices: ['Else always runs','Else if','Another loop','A function'], answer: 1 },
      { q: 'What is x = "yes" if flag else "no" called?', choices: ['Lambda','Ternary expression','Switch','Boolean cast'], answer: 1 },
      { q: 'Which checks if item is in a list?', choices: ['item == list','item in list','list.has(item)','item.exists()'], answer: 1 },
    ],
    starterCode: `hp = 15\nif hp == 0:\n    print("Fainted!")\nelif hp < 20:\n    print("Critical HP!")\nelse:\n    print(f"HP: {hp}")`
  },
  {
    id: 'py_loops', track: 'python', title: 'Loops',
    pokemon: { id: 143, name: 'Snorlax' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Loops</h2>
    <p><code>for</code> iterates over sequences. <code>while</code> runs while a condition is true.</p>
    <pre><code>party = ["Pikachu", "Snorlax", "Gengar"]
for mon in party:
    print(mon)

for i in range(5):      # 0,1,2,3,4
    print(i)

for i, mon in enumerate(party):
    print(f"{i}: {mon}")

turns = 0
while turns &lt; 3:
    print(f"Turn {turns + 1}")
    turns += 1</code></pre>
    <h3>Loop Control</h3>
    <ul>
      <li><code>break</code> — exit loop</li>
      <li><code>continue</code> — skip to next iteration</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png" alt="Snorlax" />
</div>`,
    quiz: [
      { q: 'What does range(3) produce?', choices: ['1,2,3','0,1,2,3','0,1,2','1,2'], answer: 2 },
      { q: 'Which exits a loop immediately?', choices: ['exit','continue','return','break'], answer: 3 },
      { q: 'What does enumerate() provide?', choices: ['Only indices','Only values','Both index and value','A reversed list'], answer: 2 },
    ],
    starterCode: `party = ["Pikachu", "Snorlax", "Gengar"]\nfor i, mon in enumerate(party):\n    print(f"{i+1}. {mon}")\n\ncount = 0\nwhile count < 3:\n    print(f"Turn {count+1}")\n    count += 1`
  },
  {
    id: 'py_functions', track: 'python', title: 'Functions',
    pokemon: { id: 150, name: 'Mewtwo' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Functions</h2>
    <p>Use <code>def</code> to define, <code>return</code> to output a value.</p>
    <pre><code>def calculate_damage(attack, defense, level=1):
    base = (attack * 2 * level) / defense
    return round(base, 1)

result = calculate_damage(50, 30)
print(result)

# Lambda
is_super = lambda mult: mult >= 2.0
print(is_super(2.5))</code></pre>
    <h3>Concepts</h3>
    <ul>
      <li>Default parameters: <code>def f(x=10)</code></li>
      <li>Return multiple values: <code>return a, b</code></li>
      <li>Scope: local vs global</li>
    </ul>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" alt="Mewtwo" />
</div>`,
    quiz: [
      { q: 'How do you define a function in Python?', choices: ['function f():','def f():','func f():','fn f():'], answer: 1 },
      { q: 'What keyword sends a value back from a function?', choices: ['yield','send','output','return'], answer: 3 },
      { q: 'What is a lambda?', choices: ['A loop','A class method','An anonymous function','A decorator'], answer: 2 },
    ],
    starterCode: `def greet(name, level=1):\n    return f"Welcome, {name}! You are level {level}."\n\nprint(greet("Ash"))\nprint(greet("Misty", 5))`
  },
  {
    id: 'py_classes', track: 'python', title: 'Classes & OOP',
    pokemon: { id: 149, name: 'Dragonite' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Classes &amp; OOP</h2>
    <p>Classes are blueprints for objects. Core pillars: Encapsulation, Inheritance, Polymorphism.</p>
    <pre><code>class Pokemon:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def attack(self, other):
        other.hp -= 10
        print(f"{self.name} attacks!")

    def __repr__(self):
        return f"Pokemon({self.name}, HP={self.hp})"

class FirePokemon(Pokemon):
    def attack(self, other):
        other.hp -= 20
        print(f"{self.name} uses Flamethrower!")

p1 = Pokemon("Squirtle", 50)
p2 = FirePokemon("Charizard", 80)
p2.attack(p1)
print(p1)</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png" alt="Dragonite" />
</div>`,
    quiz: [
      { q: 'What is __init__ called?', choices: ['Destructor','Constructor','Main method','Class variable'], answer: 1 },
      { q: 'What is inheritance?', choices: ['Copying variables','Child class extending parent','Deleting an object','A loop'], answer: 1 },
      { q: 'What does self refer to?', choices: ['The class itself','A static method','The current instance','The parent class'], answer: 2 },
    ],
    starterCode: `class Pokemon:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n    def __repr__(self):\n        return f"Pokemon({self.name}, HP={self.hp})"\n\np = Pokemon("Bulbasaur", 45)\nprint(p)`
  },
  {
    id: 'py_exceptions', track: 'python', title: 'Exceptions',
    pokemon: { id: 94, name: 'Gengar' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Exceptions</h2>
    <p>Handle errors gracefully with <code>try/except/finally</code>.</p>
    <pre><code>try:
    result = 10 / 0
except ZeroDivisionError:
    print("Can't divide by zero!")
except ValueError as e:
    print(f"Value error: {e}")
else:
    print("No errors!")
finally:
    print("Always runs")

class PokemonFaintedError(Exception):
    pass

def check_hp(hp):
    if hp &lt;= 0:
        raise PokemonFaintedError("Fainted!")</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png" alt="Gengar" />
</div>`,
    quiz: [
      { q: 'Which block always executes?', choices: ['try','except','else','finally'], answer: 3 },
      { q: 'How do you raise a custom error?', choices: ['error(msg)','throw Exception(msg)','raise Exception(msg)','except Exception(msg)'], answer: 2 },
      { q: 'What exception does int("abc") raise?', choices: ['TypeError','ValueError','KeyError','AttributeError'], answer: 1 },
    ],
    starterCode: `try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Can't divide by zero!")\nfinally:\n    print("Done")`
  },
  {
    id: 'py_comprehensions', track: 'python', title: 'Comprehensions',
    pokemon: { id: 196, name: 'Espeon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Comprehensions</h2>
    <p>Pythonic one-liners to build lists, dicts, and sets.</p>
    <pre><code>nums = [1, 2, 3, 4, 5]

# List comprehension
squared = [x**2 for x in nums]

# With filter
even = [x for x in nums if x % 2 == 0]

# Dict comprehension
sq_map = {x: x**2 for x in nums}

# Set comprehension
types = {"Fire", "Water", "Fire"}  # {'Fire','Water'}

# map, filter, zip
doubled = list(map(lambda x: x*2, nums))
strong  = list(filter(lambda x: x > 3, nums))
pairs   = list(zip(["Ash","Misty"], [25, 22]))</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png" alt="Espeon" />
</div>`,
    quiz: [
      { q: 'What does [x*2 for x in range(3)] produce?', choices: ['[1,2,3]','[0,2,4]','[2,4,6]','[0,1,2]'], answer: 1 },
      { q: 'Which built-in filters items by a condition?', choices: ['map','reduce','filter','zip'], answer: 2 },
      { q: 'A set comprehension uses which brackets?', choices: ['[]','()','{}','<>'], answer: 2 },
    ],
    starterCode: `nums = [1, 2, 3, 4, 5]\nsquared = [x**2 for x in nums]\neven = [x for x in nums if x % 2 == 0]\nprint(squared)\nprint(even)`
  },
  {
    id: 'py_sorting', track: 'python', title: 'Sorting & Built-ins',
    pokemon: { id: 448, name: 'Lucario' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Sorting &amp; Built-ins</h2>
    <p>Master Python's built-ins and you'll write cleaner interview solutions.</p>
    <pre><code># Sorting
party = [("Pikachu",25), ("Mewtwo",80), ("Eevee",12)]
party.sort(key=lambda x: x[1])
top = sorted(party, key=lambda x: x[1], reverse=True)

# String methods
s = "  hello world  "
print(s.strip())          # "hello world"
print(s.upper())
print("a,b,c".split(",")) # ['a','b','c']
print("-".join(["a","b"])) # "a-b"

# Useful built-ins
print(max([3,1,4,1,5]))   # 5
print(min([3,1,4,1,5]))   # 1
print(sum([1,2,3,4,5]))   # 15</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png" alt="Lucario" />
</div>`,
    quiz: [
      { q: 'What does sorted() return?', choices: ['Sorts in place','A new sorted list','A sorted tuple','Error'], answer: 1 },
      { q: 'Which removes leading/trailing whitespace?', choices: ['strip()','clean()','trim()','lstrip() only'], answer: 0 },
      { q: 'What does "a-b".split("-") return?', choices: ["['a','b']","('a','b')","['a-b']","'ab'"], answer: 0 },
    ],
    starterCode: `nums = [5, 2, 8, 1, 9, 3]\nnums.sort()\nprint(nums)\nprint(max(nums), min(nums), sum(nums))\n\nwords = ["catch","them","all"]\nprint(" ".join(words))`
  },

  // ── DATA STRUCTURES ──
  {
    id: 'ds_arrays', track: 'ds', title: 'Arrays & Two Pointers',
    pokemon: { id: 448, name: 'Lucario' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Arrays &amp; Two Pointers</h2>
    <p>Two pointers gives O(n) instead of O(n²) — one of the most common interview patterns.</p>
    <pre><code># Two Sum (sorted array) — O(n)
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left &lt; right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        elif s &lt; target:
            left += 1
        else:
            right -= 1
    return []

# Remove Duplicates in-place
def remove_dups(nums):
    k = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[i-1]:
            nums[k] = nums[i]
            k += 1
    return k</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png" alt="Lucario" />
</div>`,
    quiz: [
      { q: 'Time complexity of two-pointer on sorted array?', choices: ['O(n²)','O(n log n)','O(n)','O(1)'], answer: 2 },
      { q: 'Two pointers works best on what type of input?', choices: ['Random','Sorted array (usually)','All positive','Unique elements'], answer: 1 },
      { q: 'When sum < target, you move which pointer?', choices: ['Right pointer left','Left pointer right','Both','Neither'], answer: 1 },
    ],
    starterCode: `def two_sum_sorted(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        s = nums[left] + nums[right]\n        if s == target:\n            return [left, right]\n        elif s < target:\n            left += 1\n        else:\n            right -= 1\n    return []\n\nprint(two_sum_sorted([1,3,6,8,11], 9))`
  },
  {
    id: 'ds_hashmaps', track: 'ds', title: 'Hash Maps & Sets',
    pokemon: { id: 82, name: 'Magneton' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Hash Maps &amp; Sets</h2>
    <p>The most powerful tool for interview problems. O(1) lookup trades space for speed.</p>
    <pre><code># Two Sum — classic hash map O(n)
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []

# Frequency count
from collections import Counter
freq = Counter("pikachu")

# Anagram check
def is_anagram(s, t):
    return Counter(s) == Counter(t)

# Group anagrams
def group_anagrams(words):
    groups = {}
    for w in words:
        key = tuple(sorted(w))
        groups.setdefault(key, []).append(w)
    return list(groups.values())</code></pre>
    <p><strong>Key insight:</strong> "Have I seen X before?" or "How many times does X appear?" → use a hash map.</p>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/82.png" alt="Magneton" />
</div>`,
    quiz: [
      { q: 'Average time complexity of a hash map lookup?', choices: ['O(n)','O(log n)','O(1)','O(n²)'], answer: 2 },
      { q: 'What does Counter("hello") return?', choices: ["{'h':1,'e':1,'l':2,'o':1}","['h','e','l','l','o']","5","Error"], answer: 0 },
      { q: 'In Two Sum, what do you store in the hash map?', choices: ['All pairs','Value → index','Index → value','Nothing'], answer: 1 },
    ],
    starterCode: `from collections import Counter\n\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        comp = target - n\n        if comp in seen:\n            return [seen[comp], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2,7,11,15], 9))\nprint(Counter("pikachu"))`
  },
  {
    id: 'ds_stacks', track: 'ds', title: 'Stacks & Queues',
    pokemon: { id: 100, name: 'Voltorb' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Stacks &amp; Queues</h2>
    <p>Stack: LIFO (last in, first out). Queue: FIFO. Use <code>deque</code> for O(1) queue ops.</p>
    <pre><code># Stack
stack = []
stack.append("Pikachu")
top = stack.pop()

# Valid Parentheses — stack pattern
def is_valid(s):
    stack = []
    pairs = {')':'(', ']':'[', '}':'{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif stack and stack[-1] == pairs[ch]:
            stack.pop()
        else:
            return False
    return len(stack) == 0

# Queue (O(1) popleft)
from collections import deque
q = deque()
q.append("first")
front = q.popleft()</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png" alt="Voltorb" />
</div>`,
    quiz: [
      { q: 'Stack removes items in what order?', choices: ['FIFO','LIFO','Random','Sorted'], answer: 1 },
      { q: 'Why use deque instead of list for a queue?', choices: ['More items','list.pop(0) is O(n); deque.popleft() is O(1)','Sorted','No reason'], answer: 1 },
      { q: 'In Valid Parentheses, when do you pop the stack?', choices: ['Always','On opening bracket','When top matches closing bracket','Never'], answer: 2 },
    ],
    starterCode: `def is_valid(s):\n    stack = []\n    pairs = {')':'(', ']':'[', '}':'{'}\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif stack and stack[-1] == pairs[ch]:\n            stack.pop()\n        else:\n            return False\n    return len(stack) == 0\n\nprint(is_valid("()[]{}"))\nprint(is_valid("(]"))`
  },
  {
    id: 'ds_linkedlist', track: 'ds', title: 'Linked Lists',
    pokemon: { id: 235, name: 'Smeargle' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Linked Lists</h2>
    <p>Each node holds data and a pointer to next. O(1) insert at head; O(n) lookup.</p>
    <pre><code>class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Reverse — iterative O(n)
def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# Detect cycle — Floyd's algorithm
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/235.png" alt="Smeargle" />
</div>`,
    quiz: [
      { q: 'Inserting at the head of a linked list is?', choices: ['O(n)','O(log n)','O(1)','O(n²)'], answer: 2 },
      { q: "Floyd's cycle detection uses how many pointers?", choices: ['One','Two (slow & fast)','Three','None'], answer: 1 },
      { q: 'The slow pointer moves how many nodes at a time?', choices: ['Two','Varies','One','None'], answer: 2 },
    ],
    starterCode: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n\nn3 = ListNode(3)\nn2 = ListNode(2, n3)\nn1 = ListNode(1, n2)\nrev = reverse_list(n1)\nwhile rev:\n    print(rev.val, end=" -> ")\n    rev = rev.next`
  },
  {
    id: 'ds_trees', track: 'ds', title: 'Binary Trees',
    pokemon: { id: 357, name: 'Tropius' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Binary Trees</h2>
    <p>Master BFS (level order) and DFS (recursive). Base case is always <code>if not root: return</code>.</p>
    <pre><code>class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# DFS — inorder (sorted for BST)
def inorder(root):
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# BFS — level order
from collections import deque
def level_order(root):
    if not root: return []
    result, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result

# Max depth
def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/357.png" alt="Tropius" />
</div>`,
    quiz: [
      { q: 'Inorder traversal of a BST gives?', choices: ['Random order','Sorted values','Level-by-level','Reversed'], answer: 1 },
      { q: 'BFS uses which data structure?', choices: ['Stack','Queue','Set','Dict'], answer: 1 },
      { q: 'Base case for recursive tree problems?', choices: ['root.val == 0','root is None','root.left == root.right','len(root) == 1'], answer: 1 },
    ],
    starterCode: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef max_depth(root):\n    if not root:\n        return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))\n\nroot = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))\nprint(max_depth(root))`
  },
  {
    id: 'ds_graphs', track: 'ds', title: 'Graphs & BFS/DFS',
    pokemon: { id: 598, name: 'Ferrothorn' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Graphs &amp; BFS/DFS</h2>
    <p>BFS finds shortest path; DFS explores all paths. Always track visited nodes.</p>
    <pre><code>graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C'],
}

# BFS — shortest path
from collections import deque
def bfs(graph, start, end):
    visited = {start}
    q = deque([(start, [start])])
    while q:
        node, path = q.popleft()
        if node == end:
            return path
        for nb in graph.get(node, []):
            if nb not in visited:
                visited.add(nb)
                q.append((nb, path + [nb]))
    return None

# DFS — recursive
def dfs(graph, node, visited=None):
    if visited is None: visited = set()
    visited.add(node)
    for nb in graph.get(node, []):
        if nb not in visited:
            dfs(graph, nb, visited)
    return visited</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/598.png" alt="Ferrothorn" />
</div>`,
    quiz: [
      { q: 'What does BFS guarantee when finding a path?', choices: ['Fastest runtime','Shortest path (fewest edges)','DFS does not','Random path'], answer: 1 },
      { q: 'Why track visited nodes?', choices: ['Sorting','Avoid infinite loops in cyclic graphs','Memory efficiency','Count edges'], answer: 1 },
      { q: 'What data structure does BFS use?', choices: ['Stack','Priority queue','Queue','Linked list'], answer: 2 },
    ],
    starterCode: `from collections import deque\n\ngraph = {'A':['B','C'], 'B':['A','D'], 'C':['A','D'], 'D':['B','C']}\n\ndef bfs(graph, start, end):\n    visited = {start}\n    q = deque([(start, [start])])\n    while q:\n        node, path = q.popleft()\n        if node == end:\n            return path\n        for nb in graph.get(node, []):\n            if nb not in visited:\n                visited.add(nb)\n                q.append((nb, path + [nb]))\n    return None\n\nprint(bfs(graph, 'A', 'D'))`
  },

  // ── ALGORITHMS ──
  {
    id: 'algo_binsearch', track: 'algo', title: 'Binary Search',
    pokemon: { id: 137, name: 'Porygon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Binary Search</h2>
    <p>O(log n) search on sorted arrays. Also applies to "search on answer" problems.</p>
    <pre><code>def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left &lt;= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] &lt; target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Lower bound (leftmost position)
def lower_bound(nums, target):
    left, right = 0, len(nums)
    while left &lt; right:
        mid = (left + right) // 2
        if nums[mid] &lt; target:
            left = mid + 1
        else:
            right = mid
    return left</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png" alt="Porygon" />
</div>`,
    quiz: [
      { q: 'Time complexity of binary search?', choices: ['O(n)','O(n log n)','O(log n)','O(1)'], answer: 2 },
      { q: 'Why use mid = left + (right-left)//2?', choices: ['Faster','Avoids integer overflow','More readable','Required in Python'], answer: 1 },
      { q: 'Binary search requires what?', choices: ['Unsorted array','Sorted array','Unique values','All positive'], answer: 1 },
    ],
    starterCode: `def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nnums = [1, 3, 5, 7, 9, 11, 13]\nprint(binary_search(nums, 7))\nprint(binary_search(nums, 4))`
  },
  {
    id: 'algo_recursion', track: 'algo', title: 'Recursion & Backtracking',
    pokemon: { id: 197, name: 'Umbreon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Recursion &amp; Backtracking</h2>
    <p>Recursion solves problems by breaking into subproblems. Backtracking explores all possibilities.</p>
    <pre><code># Fibonacci with memoization
def fib(n, memo={}):
    if n &lt;= 1: return n
    if n in memo: return memo[n]
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]

# Subsets — backtracking
def subsets(nums):
    result = []
    def backtrack(start, current):
        result.append(current[:])
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()        # ← undo choice
    backtrack(0, [])
    return result

print(subsets([1,2,3]))</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png" alt="Umbreon" />
</div>`,
    quiz: [
      { q: 'Every recursive function must have?', choices: ['A loop','A base case','A return type','Global variables'], answer: 1 },
      { q: 'What does backtracking do after exploring a path?', choices: ['Saves the path','Undoes the last choice','Starts over','Throws an error'], answer: 1 },
      { q: 'Memoization speeds up recursion by?', choices: ['Adding base cases','Caching subproblem results','Using iteration','Reducing stack depth'], answer: 1 },
    ],
    starterCode: `def fib(n, memo={}):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]\n\nfor i in range(10):\n    print(fib(i), end=" ")`
  },
  {
    id: 'algo_dp', track: 'algo', title: 'Dynamic Programming',
    pokemon: { id: 384, name: 'Rayquaza' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Dynamic Programming</h2>
    <p>DP = optimal substructure + overlapping subproblems. Build solutions bottom-up.</p>
    <pre><code># Climbing Stairs — O(n) time, O(1) space
def climb_stairs(n):
    if n &lt;= 2: return n
    a, b = 1, 2
    for _ in range(3, n+1):
        a, b = b, a + b
    return b

# 0/1 Knapsack
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(W+1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] &lt;= w:
                dp[i][w] = max(dp[i][w],
                    dp[i-1][w-weights[i-1]] + values[i-1])
    return dp[n][W]</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png" alt="Rayquaza" />
</div>`,
    quiz: [
      { q: 'DP requires which two properties?', choices: ['Sorted input & unique values','Optimal substructure & overlapping subproblems','Greedy choice & local optimum','Recursion & hashing'], answer: 1 },
      { q: 'Optimized space complexity of Fibonacci DP?', choices: ['O(n)','O(n²)','O(1)','O(log n)'], answer: 2 },
      { q: 'Bottom-up DP uses?', choices: ['A queue','Memoization','Iterative table filling','BFS'], answer: 2 },
    ],
    starterCode: `def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n+1):\n        a, b = b, a + b\n    return b\n\nfor n in range(1, 8):\n    print(f"climb_stairs({n}) = {climb_stairs(n)}")`
  },
  {
    id: 'algo_heaps', track: 'algo', title: 'Heaps & Priority Queues',
    pokemon: { id: 208, name: 'Steelix' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Heaps &amp; Priority Queues</h2>
    <p>Python's heapq is a min-heap. Negate values for max-heap. O(log n) push/pop.</p>
    <pre><code>import heapq

nums = [5, 2, 8, 1, 9]
heapq.heapify(nums)         # O(n)
heapq.heappush(nums, 3)
smallest = heapq.heappop(nums)

# Max-heap (negate values)
maxheap = []
for x in [5, 2, 8, 1, 9]:
    heapq.heappush(maxheap, -x)
largest = -heapq.heappop(maxheap)   # 9

# K largest elements
def k_largest(nums, k):
    return heapq.nlargest(k, nums)

print(k_largest([5,2,8,1,9,3], 3))  # [9,8,5]</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/208.png" alt="Steelix" />
</div>`,
    quiz: [
      { q: "Python's heapq implements which heap?", choices: ['Max-heap','Min-heap','Balanced BST','Random heap'], answer: 1 },
      { q: 'Time complexity of heap push/pop?', choices: ['O(1)','O(n)','O(log n)','O(n log n)'], answer: 2 },
      { q: 'How do you simulate a max-heap with heapq?', choices: ['Use heapq.maxheap()','Reverse the list','Negate values before pushing','Sort first'], answer: 2 },
    ],
    starterCode: `import heapq\n\nnums = [5, 2, 8, 1, 9, 3]\nheapq.heapify(nums)\nprint("Min:", heapq.heappop(nums))\nprint("3 largest:", heapq.nlargest(3, [5,2,8,1,9,3]))`
  },
  {
    id: 'algo_sorting', track: 'algo', title: 'Sorting Algorithms',
    pokemon: { id: 227, name: 'Skarmory' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Sorting Algorithms</h2>
    <p>Know the trade-offs. Python uses Timsort (O(n log n)). Interviews may ask you to implement merge sort or quicksort.</p>
    <pre><code># Merge Sort — O(n log n), stable
def merge_sort(arr):
    if len(arr) &lt;= 1: return arr
    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    result, i, j = [], 0, 0
    while i &lt; len(left) and j &lt; len(right):
        if left[i] &lt;= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

# Quick Sort — O(n log n) avg, O(n²) worst
def quick_sort(arr):
    if len(arr) &lt;= 1: return arr
    pivot = arr[len(arr) // 2]
    left  = [x for x in arr if x &lt; pivot]
    mid   = [x for x in arr if x == pivot]
    right = [x for x in arr if x &gt; pivot]
    return quick_sort(left) + mid + quick_sort(right)</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/227.png" alt="Skarmory" />
</div>`,
    quiz: [
      { q: 'Time complexity of merge sort?', choices: ['O(n)','O(n²)','O(n log n)','O(log n)'], answer: 2 },
      { q: 'Which algorithm is stable and O(n log n)?', choices: ['Quick Sort','Heap Sort','Merge Sort','Bubble Sort'], answer: 2 },
      { q: "Quick sort's worst case?", choices: ['O(n log n)','O(n)','O(n²)','O(1)'], answer: 2 },
    ],
    starterCode: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    result, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]\n\nprint(merge_sort([5, 2, 8, 1, 9, 3]))`
  },
  {
    id: 'algo_sliding', track: 'algo', title: 'Sliding Window',
    pokemon: { id: 330, name: 'Flygon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Sliding Window</h2>
    <p>Process subarrays without recomputing from scratch. O(n) instead of O(n²).</p>
    <pre><code># Fixed window — max sum of k elements
def max_sum_k(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i-k]
        max_sum = max(max_sum, window_sum)
    return max_sum

# Variable window — longest substring no repeats
def longest_unique(s):
    seen = set()
    left = max_len = 0
    for right in range(len(s)):
        while s[right] in seen:
            seen.remove(s[left])
            left += 1
        seen.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len

print(max_sum_k([2,1,5,1,3,2], 3))  # 9
print(longest_unique("abcabcbb"))    # 3</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/330.png" alt="Flygon" />
</div>`,
    quiz: [
      { q: 'Time complexity of sliding window?', choices: ['O(n²)','O(n log n)','O(n)','O(k)'], answer: 2 },
      { q: 'When should you shrink the window from the left?', choices: ['When window is valid and you want minimum','Randomly','When target found','Never'], answer: 0 },
      { q: 'Fixed vs variable window difference?', choices: ['Fixed never loops','Fixed size stays constant; variable adjusts','Variable is slower','No difference'], answer: 1 },
    ],
    starterCode: `def longest_unique(s):\n    seen = set()\n    left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nprint(longest_unique("pikachu"))\nprint(longest_unique("abcabcbb"))`
  },

  // ── LEETCODE PATTERNS ──
  {
    id: 'lc_twosum', track: 'lc', title: 'Two Sum (LC #1)',
    pokemon: { id: 81, name: 'Magnemite' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Two Sum — LC #1</h2>
    <p>The most common interview question. Hash map approach is O(n).</p>
    <pre><code># Brute force O(n²) — never in interviews
def two_sum_brute(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]

# Hash map O(n) — the correct answer
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []

print(two_sum([2,7,11,15], 9))   # [0,1]
print(two_sum([3,2,4], 6))       # [1,2]</code></pre>
    <p><strong>Key insight:</strong> For each number, ask "Is <code>target - num</code> in my map?"</p>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/81.png" alt="Magnemite" />
</div>`,
    quiz: [
      { q: 'Two Sum hash map solution time complexity?', choices: ['O(n²)','O(n log n)','O(n)','O(1)'], answer: 2 },
      { q: 'What do you store in the hash map?', choices: ['target values','value → index','index → value','pairs'], answer: 1 },
      { q: 'If target=9 and current num=2, what do you look for?', choices: ['2','9','7','11'], answer: 2 },
    ],
    starterCode: `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        complement = target - n\n        if complement in seen:\n            return [seen[complement], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2,7,11,15], 9))\nprint(two_sum([3,2,4], 6))`
  },
  {
    id: 'lc_valid_parens', track: 'lc', title: 'Valid Parentheses (LC #20)',
    pokemon: { id: 100, name: 'Voltorb' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Valid Parentheses — LC #20</h2>
    <p>Classic stack problem. Every opening bracket must match its closing counterpart.</p>
    <pre><code>def is_valid(s):
    stack = []
    pairs = {')':'(', ']':'[', '}':'{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif not stack or stack[-1] != pairs[ch]:
            return False
        else:
            stack.pop()
    return len(stack) == 0

print(is_valid("()[]{}"))  # True
print(is_valid("(]"))      # False
print(is_valid("{[]}"))    # True</code></pre>
    <p><strong>Pattern:</strong> Push opening brackets. Pop on closing bracket if top matches. Empty at end = valid.</p>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png" alt="Voltorb" />
</div>`,
    quiz: [
      { q: 'What data structure is used?', choices: ['Queue','Stack','Hash Map','Array'], answer: 1 },
      { q: 'The string is valid if at the end the stack is?', choices: ['Full','Contains one item','Empty','Reversed'], answer: 2 },
      { q: 'For closing bracket ")", what do you check?', choices: ['Stack non-empty and top == "("','Stack is empty','Previous char is "("','Nothing'], answer: 0 },
    ],
    starterCode: `def is_valid(s):\n    stack = []\n    pairs = {')':'(', ']':'[', '}':'{'}\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif not stack or stack[-1] != pairs[ch]:\n            return False\n        else:\n            stack.pop()\n    return len(stack) == 0\n\nfor test in ["()[]{}","(]","([)]","{[]}"]:\n    print(f'"{test}" -> {is_valid(test)}')`
  },
  {
    id: 'lc_maxsub', track: 'lc', title: "Kadane's / Max Subarray (LC #53)",
    pokemon: { id: 59, name: 'Arcanine' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Maximum Subarray — LC #53</h2>
    <p>Kadane's algorithm: at each element, extend or start fresh. O(n) in one pass.</p>
    <pre><code>def max_sub_array(nums):
    max_sum  = nums[0]
    curr_sum = nums[0]
    for n in nums[1:]:
        curr_sum = max(n, curr_sum + n)
        max_sum  = max(max_sum, curr_sum)
    return max_sum

print(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))  # 6
print(max_sub_array([-1,-2,-3]))                # -1</code></pre>
    <p><strong>Key insight:</strong> <code>curr = max(n, curr + n)</code> — "Start fresh here, or extend existing subarray?"</p>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png" alt="Arcanine" />
</div>`,
    quiz: [
      { q: "Kadane's time complexity?", choices: ['O(n²)','O(n log n)','O(n)','O(1)'], answer: 2 },
      { q: 'curr_sum = ?', choices: ['curr_sum + n','max(n, curr_sum + n)','min(n, curr_sum)','n only'], answer: 1 },
      { q: 'For all-negative array [-3,-1,-2], the answer is?', choices: ['-6','-1','0','-3'], answer: 1 },
    ],
    starterCode: `def max_sub_array(nums):\n    max_sum = curr_sum = nums[0]\n    for n in nums[1:]:\n        curr_sum = max(n, curr_sum + n)\n        max_sum  = max(max_sum, curr_sum)\n    return max_sum\n\nprint(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))\nprint(max_sub_array([-1,-2,-3]))`
  },
  {
    id: 'lc_stairs', track: 'lc', title: 'Climbing Stairs (LC #70)',
    pokemon: { id: 245, name: 'Suicune' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Climbing Stairs — LC #70</h2>
    <p>Classic DP. To reach step n, you came from n-1 or n-2. Fibonacci in disguise.</p>
    <pre><code>def climb_stairs(n):
    if n &lt;= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

for i in range(1, 8):
    print(f"n={i}: {climb_stairs(i)} ways")</code></pre>
    <p><strong>Pattern:</strong> "Ways to reach X" with 1 or 2 steps → Fibonacci DP.</p>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/245.png" alt="Suicune" />
</div>`,
    quiz: [
      { q: 'For n=4, how many distinct ways?', choices: ['3','4','5','6'], answer: 2 },
      { q: 'Climbing stairs is equivalent to?', choices: ['Sorting','Fibonacci','Binary search','BFS'], answer: 1 },
      { q: 'The O(1) space solution tracks?', choices: ['n variables','1','2','n/2'], answer: 2 },
    ],
    starterCode: `def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b\n\nfor i in range(1, 8):\n    print(f"n={i}: {climb_stairs(i)} ways")`
  },
  {
    id: 'lc_binsearch', track: 'lc', title: 'Binary Search (LC #704)',
    pokemon: { id: 249, name: 'Lugia' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Binary Search — LC #704</h2>
    <p>Memorize this template — you'll use it in dozens of problems.</p>
    <pre><code>def search(nums, target):
    left, right = 0, len(nums) - 1
    while left &lt;= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] &lt; target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Rotated sorted array (LC #33)
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left &lt;= right:
        mid = (left + right) // 2
        if nums[mid] == target: return mid
        if nums[left] &lt;= nums[mid]:    # left half sorted
            if nums[left] &lt;= target &lt; nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:                           # right half sorted
            if nums[mid] &lt; target &lt;= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png" alt="Lugia" />
</div>`,
    quiz: [
      { q: 'While loop ends when?', choices: ['left > right','mid == 0','After n iterations','Array is sorted'], answer: 0 },
      { q: 'After nums[mid] < target, set?', choices: ['right = mid','left = mid','right = mid - 1','left = mid + 1'], answer: 3 },
      { q: 'Binary search on rotated array — key insight?', choices: ['Cannot do it','One half is always sorted','Sort it first','Use BFS'], answer: 1 },
    ],
    starterCode: `def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nprint(search([-1,0,3,5,9,12], 9))\nprint(search([-1,0,3,5,9,12], 2))`
  },
  {
    id: 'lc_longest_sub', track: 'lc', title: 'Longest Substring (LC #3)',
    pokemon: { id: 330, name: 'Flygon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Longest Substring Without Repeating Characters — LC #3</h2>
    <p>Sliding window + hash set. A template for many string problems.</p>
    <pre><code>def length_of_longest_substring(s):
    seen = set()
    left = max_len = 0
    for right in range(len(s)):
        while s[right] in seen:
            seen.remove(s[left])
            left += 1
        seen.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len

print(length_of_longest_substring("abcabcbb"))  # 3
print(length_of_longest_substring("pwwkew"))    # 3</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/330.png" alt="Flygon" />
</div>`,
    quiz: [
      { q: 'Pattern used?', choices: ['Binary search','Sliding window','DP','BFS'], answer: 1 },
      { q: 'For "abcabcbb", the answer is?', choices: ['4','2','3','7'], answer: 2 },
      { q: 'When do you move the left pointer?', choices: ['Every iteration','When a duplicate is found','When right reaches end','Never'], answer: 1 },
    ],
    starterCode: `def length_of_longest_substring(s):\n    seen = set()\n    left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nprint(length_of_longest_substring("abcabcbb"))\nprint(length_of_longest_substring("pwwkew"))`
  },
  {
    id: 'lc_product', track: 'lc', title: 'Product Except Self (LC #238)',
    pokemon: { id: 196, name: 'Espeon' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Product Except Self — LC #238</h2>
    <p>O(n) without division. Two-pass prefix/suffix — a classic interview trick.</p>
    <pre><code>def product_except_self(nums):
    n = len(nums)
    output = [1] * n
    # Left pass: product of all elements to the left
    prefix = 1
    for i in range(n):
        output[i] = prefix
        prefix *= nums[i]
    # Right pass: multiply by product to the right
    suffix = 1
    for i in range(n - 1, -1, -1):
        output[i] *= suffix
        suffix *= nums[i]
    return output

print(product_except_self([1,2,3,4]))  # [24,12,8,6]</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png" alt="Espeon" />
</div>`,
    quiz: [
      { q: "Why not divide total product by nums[i]?", choices: ['Division is slow','Array might contain zeros','Python prevents it','You can'], answer: 1 },
      { q: 'Left pass computes for output[i]?', choices: ['All elements','Right elements','Left elements','nums[i]'], answer: 2 },
      { q: 'Time complexity?', choices: ['O(n²)','O(n log n)','O(n)','O(1)'], answer: 2 },
    ],
    starterCode: `def product_except_self(nums):\n    n = len(nums)\n    output = [1] * n\n    prefix = 1\n    for i in range(n):\n        output[i] = prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(n-1, -1, -1):\n        output[i] *= suffix\n        suffix *= nums[i]\n    return output\n\nprint(product_except_self([1,2,3,4]))`
  },
  {
    id: 'lc_numislands', track: 'lc', title: 'Number of Islands (LC #200)',
    pokemon: { id: 598, name: 'Ferrothorn' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Number of Islands — LC #200</h2>
    <p>Grid DFS — count connected components. A template for many grid problems.</p>
    <pre><code>def num_islands(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r &lt; 0 or r &gt;= rows or c &lt; 0 or c &gt;= cols:
            return
        if grid[r][c] != '1':
            return
        grid[r][c] = '#'   # mark visited
        dfs(r+1,c); dfs(r-1,c)
        dfs(r,c+1); dfs(r,c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    return count</code></pre>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/598.png" alt="Ferrothorn" />
</div>`,
    quiz: [
      { q: 'How do you mark a cell as visited?', choices: ['Delete it','Set to "0"','Set to "#"','Separate visited set'], answer: 2 },
      { q: 'Each DFS call marks one complete?', choices: ['Row','Column','Island (connected component)','Grid'], answer: 2 },
      { q: 'Time complexity?', choices: ['O(rows)','O(rows+cols)','O(rows × cols)','O(1)'], answer: 2 },
    ],
    starterCode: `def num_islands(grid):\n    if not grid: return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':\n            return\n        grid[r][c] = '#'\n        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                dfs(r, c); count += 1\n    return count\n\ngrid = [["1","1","0"],["1","1","0"],["0","0","1"]]\nprint(num_islands(grid))`
  },
  {
    id: 'lc_coinchange', track: 'lc', title: 'Coin Change (LC #322)',
    pokemon: { id: 384, name: 'Rayquaza' },
    content: `
<div class="lesson-hero">
  <div>
    <h2>Coin Change — LC #322</h2>
    <p>Classic unbounded knapsack DP. Build up the answer from 0 to amount.</p>
    <pre><code>def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

print(coin_change([1,5,11], 15))  # 3
print(coin_change([2], 3))        # -1
print(coin_change([1,2,5], 11))   # 3</code></pre>
    <p><strong>State:</strong> <code>dp[i]</code> = min coins to make amount <code>i</code>.<br/>
    <strong>Transition:</strong> <code>dp[i] = min(dp[i], dp[i-coin] + 1)</code></p>
  </div>
  <img class="lesson-hero-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png" alt="Rayquaza" />
</div>`,
    quiz: [
      { q: 'dp[0] is initialized to?', choices: ['1','infinity','0','-1'], answer: 2 },
      { q: 'dp[i] represents?', choices: ['Coin value at i','Min coins for amount i','Max coins','i-th coin'], answer: 1 },
      { q: 'If dp[amount] is still infinity, return?', choices: ['0','infinity','amount','-1'], answer: 3 },
    ],
    starterCode: `def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for coin in coins:\n        for i in range(coin, amount + 1):\n            dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1\n\nprint(coin_change([1,5,11], 15))\nprint(coin_change([1,2,5], 11))\nprint(coin_change([2], 3))`
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
  showScreen('screen-home');
  document.getElementById('header-progress-wrap').style.display = 'none';
}

// ── STARTER PICKER ────────────────────────────────────────────
let selectedStarterData = null;
let activeGen = 1;

function goToStarterPick() {
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
  const code = (lesson.starterCode || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  main.innerHTML =
    '<div class="lesson-content">' +
      lesson.content +
      '<div class="lesson-actions">' +
        '<div class="code-editor-wrap">' +
          '<div class="editor-header">' +
            '<span class="editor-label">&#x1F40D;&nbsp; Python</span>' +
            '<div style="display:flex;gap:0.5rem">' +
              '<button class="run-btn" onclick="runCode(\'' + id + '\')">&#9654; Run</button>' +
            '</div>' +
          '</div>' +
          '<textarea id="code-editor-' + id + '" class="code-editor" spellcheck="false">' + (lesson.starterCode || '') + '</textarea>' +
          '<div id="code-output-' + id + '" class="code-output hidden"></div>' +
        '</div>' +
        (completed
          ? '<div class="already-done">&#10003; Lesson complete! <button class="quiz-btn" onclick="startQuiz(\'' + id + '\')">Retake Quiz</button></div>'
          : '<button class="quiz-btn" onclick="startQuiz(\'' + id + '\')">Take Quiz &#8594;</button>'
        ) +
      '</div>' +
    '</div>';

  // Tab key inserts 4 spaces instead of switching focus
  const ta = document.getElementById('code-editor-' + id);
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
