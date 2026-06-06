/* ============================================================
   POKÉTHON BOOTCAMP — app.js
   ============================================================ */

// ── STATE ────────────────────────────────────────────────────
const STATE = {
  trainerName: 'Trainer',
  xp: 0,
  completedLessons: new Set(),
  quizScores: {},
  streak: 0,
  currentLesson: null,
};

const XP_PER_QUIZ_CORRECT = 25;
const XP_PER_LESSON = 50;
const MAX_XP = 1500;

function saveState() {
  const s = { ...STATE, completedLessons: [...STATE.completedLessons] };
  localStorage.setItem('pokethon_state', JSON.stringify(s));
}
function loadState() {
  const raw = localStorage.getItem('pokethon_state');
  if (!raw) return;
  const s = JSON.parse(raw);
  STATE.trainerName = s.trainerName || 'Trainer';
  STATE.xp = s.xp || 0;
  STATE.completedLessons = new Set(s.completedLessons || []);
  STATE.quizScores = s.quizScores || {};
  STATE.streak = s.streak || 0;
}

// ── CURRICULUM ───────────────────────────────────────────────
const CURRICULUM = [
  { id:'variables',      icon:'📦', label:'Variables',       track:'python' },
  { id:'types',          icon:'🔢', label:'Data Types',      track:'python' },
  { id:'lists',          icon:'📋', label:'Lists',           track:'python' },
  { id:'dicts',          icon:'📖', label:'Dictionaries',    track:'python' },
  { id:'conditionals',   icon:'🔀', label:'Conditionals',    track:'python' },
  { id:'loops',          icon:'🔄', label:'Loops',           track:'python' },
  { id:'functions',      icon:'⚙️', label:'Functions',       track:'python' },
  { id:'classes',        icon:'🏗️', label:'Classes & OOP',  track:'python' },
  { id:'exceptions',     icon:'🛡️', label:'Exceptions',     track:'python' },
  { id:'comprehensions', icon:'⚡', label:'Comprehensions',  track:'python' },
  { id:'lc_twosum',      icon:'🧩', label:'Two Sum',         track:'lc', diff:'Easy'   },
  { id:'lc_valid_parens',icon:'🧩', label:'Valid Parens',    track:'lc', diff:'Easy'   },
  { id:'lc_longest_sub', icon:'🧩', label:'Longest Substring',track:'lc',diff:'Medium' },
  { id:'lc_maxsub',      icon:'🧩', label:'Max Subarray',    track:'lc', diff:'Medium' },
  { id:'lc_stairs',      icon:'🧩', label:'Climbing Stairs', track:'lc', diff:'Easy'   },
  { id:'lc_binsearch',   icon:'🧩', label:'Binary Search',   track:'lc', diff:'Easy'   },
];

// lesson is unlocked if the previous python lesson is complete (or it's the first)
function isUnlocked(id) {
  const idx = CURRICULUM.findIndex(c => c.id === id);
  if (idx === 0) return true;
  const prev = CURRICULUM[idx - 1];
  // lc track unlocks after all python done
  if (CURRICULUM[idx].track === 'lc') {
    const pythonDone = CURRICULUM.filter(c => c.track === 'python').every(c => STATE.completedLessons.has(c.id));
    if (idx === CURRICULUM.findIndex(c => c.track === 'lc')) return pythonDone;
    return STATE.completedLessons.has(prev.id);
  }
  return STATE.completedLessons.has(prev.id);
}

// ── TRAINER TITLES ───────────────────────────────────────────
function trainerTitle() {
  const done = STATE.completedLessons.size;
  if (done === 0)  return 'Pokéthon Rookie';
  if (done < 3)    return 'Bug Catcher';
  if (done < 6)    return 'Gym Challenger';
  if (done < 10)   return 'Elite Coder';
  if (done < 14)   return 'Champion Trainer';
  return 'Pokémon Master';
}

function earnedBadges() {
  const badges = [];
  if (STATE.completedLessons.has('variables'))    badges.push({ label:'📦 Variable Badge' });
  if (STATE.completedLessons.has('loops'))        badges.push({ label:'🔄 Loop Badge' });
  if (STATE.completedLessons.has('functions'))    badges.push({ label:'⚙️ Function Badge' });
  if (STATE.completedLessons.has('classes'))      badges.push({ label:'🏗️ OOP Badge' });
  if (STATE.completedLessons.has('lc_twosum'))    badges.push({ label:'🧩 LeetCode I' });
  if (STATE.completedLessons.size === CURRICULUM.length) badges.push({ label:'🏆 Champion!' });
  return badges;
}

// ── XP HELPERS ───────────────────────────────────────────────
function addXP(amount, label) {
  STATE.xp = Math.min(MAX_XP, STATE.xp + amount);
  saveState();
  updateXPBar();
  showXPToast(`+${amount} XP — ${label}`);
}

function updateXPBar() {
  const pct = (STATE.xp / MAX_XP) * 100;
  const fill = document.getElementById('header-xp-fill');
  const lbl  = document.getElementById('header-xp-label');
  if (fill) fill.style.width = pct + '%';
  if (lbl)  lbl.textContent = STATE.xp + ' XP';
}

let toastTimer;
function showXPToast(msg) {
  const t = document.getElementById('xp-toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2200);
}

// ── HOME / SPLASH ─────────────────────────────────────────────
function startBootcamp() {
  const input = document.getElementById('trainer-name-input');
  STATE.trainerName = (input.value.trim() || 'Trainer').slice(0, 20);
  saveState();
  switchScreen('bootcamp');
  document.getElementById('header-progress-wrap').style.display = 'flex';
  buildSidebar();
  updateXPBar();
  // open first uncompleted lesson
  const first = CURRICULUM.find(c => !STATE.completedLessons.has(c.id)) || CURRICULUM[0];
  openLesson(first.id);
}

function goHome() {
  switchScreen('home');
  document.getElementById('header-progress-wrap').style.display = 'none';
}

function switchScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}

// ── SIDEBAR ───────────────────────────────────────────────────
function buildSidebar() {
  renderSidebarTrack('lesson-list', 'python');
  renderSidebarTrack('lc-list', 'lc');
}

function renderSidebarTrack(containerId, track) {
  const el = document.getElementById(containerId);
  const items = CURRICULUM.filter(c => c.track === track);
  el.innerHTML = items.map(c => {
    const done     = STATE.completedLessons.has(c.id);
    const unlocked = isUnlocked(c.id);
    const active   = STATE.currentLesson === c.id;
    const cls = ['lesson-item', done ? 'completed' : '', unlocked ? '' : 'locked', active ? 'active' : ''].join(' ');
    const diffBadge = c.diff ? `<span class="diff-badge ${c.diff.toLowerCase()}" style="font-size:0.65rem;padding:0.1rem 0.45rem;margin-left:4px">${c.diff}</span>` : '';
    return `
      <div class="${cls}" onclick="${unlocked ? `openLesson('${c.id}')` : 'lockedClick()'}">
        <span class="li-icon">${c.icon}</span>
        <span class="li-label">${c.label}${diffBadge}</span>
        ${done ? '<span class="li-check">✓</span>' : ''}
        ${!unlocked ? '<span class="li-lock">🔒</span>' : ''}
      </div>`;
  }).join('');
}

function lockedClick() {
  showXPToast('🔒 Complete the previous lesson first!');
}

// ── OPEN LESSON ───────────────────────────────────────────────
function openLesson(id) {
  STATE.currentLesson = id;
  saveState();
  buildSidebar();

  const entry = CURRICULUM.find(c => c.id === id);
  const main  = document.getElementById('main-content');

  if (entry.track === 'lc') {
    main.innerHTML = renderLCPage(id);
  } else {
    main.innerHTML = renderLessonPage(id);
  }
  addCopyButtons();
  main.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── COPY BUTTONS ──────────────────────────────────────────────
function addCopyButtons() {
  document.querySelectorAll('.code-wrapper').forEach(w => {
    if (w.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.onclick = () => {
      navigator.clipboard.writeText(w.querySelector('code').innerText).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
      });
    };
    w.appendChild(btn);
  });
}

// ── TRAINER CARD ─────────────────────────────────────────────
function openTrainer() {
  document.getElementById('tc-name').textContent    = STATE.trainerName;
  document.getElementById('tc-title').textContent   = trainerTitle();
  document.getElementById('tc-xp').textContent      = STATE.xp;
  document.getElementById('tc-lessons').textContent = STATE.completedLessons.size;
  document.getElementById('tc-streak').textContent  = STATE.streak;
  const badges = earnedBadges();
  document.getElementById('tc-badges').innerHTML = badges.length
    ? badges.map(b => `<span class="tc-badge-item">${b.label}</span>`).join('')
    : '<span style="color:var(--muted);font-size:0.85rem">Complete lessons to earn badges!</span>';
  document.getElementById('trainer-overlay').classList.remove('hidden');
}
function closeTrainer() {
  document.getElementById('trainer-overlay').classList.add('hidden');
}

// ── LESSON COMPLETE ───────────────────────────────────────────
function markLessonComplete(id) {
  if (STATE.completedLessons.has(id)) return;
  STATE.completedLessons.add(id);
  STATE.streak++;
  addXP(XP_PER_LESSON, 'Lesson complete!');
  saveState();
  buildSidebar();
}

function showCompleteBanner(id) {
  const idx  = CURRICULUM.findIndex(c => c.id === id);
  const next = CURRICULUM[idx + 1];
  const banner = document.getElementById('levelup-banner');
  document.getElementById('lu-title').textContent = '🎉 Lesson Complete!';
  document.getElementById('lu-sub').textContent   = next ? `Next up: ${next.label}` : 'You finished the track!';
  const btn = document.getElementById('lu-next-btn');
  if (next) {
    btn.textContent = `Next: ${next.label} →`;
    btn.onclick = () => { banner.classList.add('hidden'); openLesson(next.id); };
  } else {
    btn.textContent = 'View Trainer Card 🏆';
    btn.onclick = () => { banner.classList.add('hidden'); openTrainer(); };
  }
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 8000);
}

// ── QUIZ ENGINE ───────────────────────────────────────────────
let quizState = { questions:[], current:0, score:0, lessonId:'' };

function startQuiz(lessonId) {
  const qs = QUIZZES[lessonId];
  if (!qs) return;
  quizState = { questions: qs, current: 0, score: 0, lessonId };
  document.getElementById('quiz-overlay').classList.remove('hidden');
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const { questions, current } = quizState;
  const q = questions[current];
  const total = questions.length;

  // dots
  document.getElementById('quiz-dots').innerHTML = questions.map((_, i) => {
    const cls = i < current ? 'done' : i === current ? 'current' : '';
    return `<div class="qdot ${cls}"></div>`;
  }).join('');

  document.getElementById('quiz-title').textContent = `Question ${current + 1} of ${total}`;

  const letters = ['A','B','C','D'];
  document.getElementById('quiz-body').innerHTML = `
    <div class="quiz-question">${q.question}</div>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button class="quiz-opt" onclick="answerQuiz(${i})" data-idx="${i}">
          <span class="opt-letter">${letters[i]}</span>
          ${opt}
        </button>`).join('')}
    </div>
    <div class="quiz-feedback" id="quiz-feedback"></div>
    <button class="quiz-next-btn" id="quiz-next-btn" onclick="nextQuizQuestion()">
      ${current + 1 < total ? 'Next Question →' : 'See Results →'}
    </button>
  `;
}

function answerQuiz(selectedIdx) {
  const q = quizState.questions[quizState.current];
  const opts = document.querySelectorAll('.quiz-opt');
  const fb   = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next-btn');

  opts.forEach(o => o.disabled = true);

  const correct = selectedIdx === q.answer;
  opts[selectedIdx].classList.add(correct ? 'correct' : 'wrong');
  if (!correct) opts[q.answer].classList.add('correct');

  fb.className = `quiz-feedback show ${correct ? 'correct-fb' : 'wrong-fb'}`;
  fb.innerHTML = correct
    ? `✅ <strong>Correct!</strong> ${q.explanation}`
    : `❌ <strong>Not quite.</strong> ${q.explanation}`;

  if (correct) quizState.score++;
  nextBtn.classList.add('show');
}

function nextQuizQuestion() {
  quizState.current++;
  if (quizState.current >= quizState.questions.length) {
    showQuizResult();
  } else {
    renderQuizQuestion();
  }
}

function showQuizResult() {
  const { score, questions, lessonId } = quizState;
  const total  = questions.length;
  const xpEarned = score * XP_PER_QUIZ_CORRECT;
  STATE.quizScores[lessonId] = score;

  document.getElementById('quiz-body').innerHTML = `
    <div class="quiz-result">
      <div class="qr-score">${score}/${total}</div>
      <div class="qr-label">${score === total ? '🏆 Perfect score!' : score >= total/2 ? '👍 Good work!' : '📚 Keep practicing!'}</div>
      <div class="qr-xp">+${xpEarned} XP earned</div>
      <button class="qr-close" onclick="closeQuiz('${lessonId}')">Continue Training →</button>
    </div>
  `;
  addXP(xpEarned, 'Quiz complete!');
}

function closeQuiz(lessonId) {
  document.getElementById('quiz-overlay').classList.add('hidden');
  markLessonComplete(lessonId);
  showCompleteBanner(lessonId);
}

// ── LIVE CODE RUNNER (simulated) ─────────────────────────────
// We use a sandboxed JS interpreter approach: capture print() calls
// by running the code through a tiny Python→output simulator.
// For real execution we use a public eval trick with a print bridge.

function runCode(editorId, outputId, defaultCode) {
  const textarea = document.getElementById(editorId);
  const outputEl = document.getElementById(outputId);
  const code = textarea ? textarea.value : defaultCode;

  outputEl.className = 'editor-output';
  outputEl.innerHTML = '<span class="output-prefix">Output</span>';

  try {
    const lines = [];
    // build a fake python runtime in JS
    const printFn = (...args) => lines.push(args.map(String).join(' '));
    const fakeEnv = buildFakePythonEnv(printFn);

    // transpile simple python to JS and eval
    const js = pythonToJS(code);
    const fn = new Function(...Object.keys(fakeEnv), js);
    fn(...Object.values(fakeEnv));

    if (lines.length === 0) {
      outputEl.innerHTML += '<span style="color:var(--muted);font-style:italic">(no output)</span>';
    } else {
      outputEl.innerHTML += lines.join('\n');
      outputEl.classList.add('success');
    }
  } catch(e) {
    outputEl.innerHTML += `<span style="color:#f85149">${e.message}</span>`;
    outputEl.classList.add('error');
  }
}

function buildFakePythonEnv(printFn) {
  return {
    print: printFn,
    len: (x) => (x && x.length !== undefined ? x.length : 0),
    range: (a, b, step=1) => {
      const arr = [];
      if (b === undefined) { b = a; a = 0; }
      for (let i = a; (step > 0 ? i < b : i > b); i += step) arr.push(i);
      return arr;
    },
    int:   (x) => parseInt(x),
    float: (x) => parseFloat(x),
    str:   (x) => String(x),
    bool:  (x) => Boolean(x),
    list:  (x) => Array.from(x || []),
    abs:   Math.abs,
    max:   (...a) => a.length === 1 ? Math.max(...a[0]) : Math.max(...a),
    min:   (...a) => a.length === 1 ? Math.min(...a[0]) : Math.min(...a),
    round: Math.round,
    sum:   (a) => a.reduce((s, v) => s + v, 0),
    sorted:(a, opts={}) => [...a].sort((x,y) => opts.reverse ? y-x : (typeof x==='string' ? x.localeCompare(y) : x-y)),
    enumerate: (a, start=0) => a.map((v, i) => [i + start, v]),
    zip:   (...arrs) => arrs[0].map((_, i) => arrs.map(a => a[i])),
    type:  (x) => { const t = typeof x; return t === 'object' ? (Array.isArray(x) ? "<class 'list'>" : "<class 'dict'>") : `<class '${t === 'number' ? (Number.isInteger(x)?'int':'float') : t}'>`; },
  };
}

function pythonToJS(code) {
  let js = code;

  // f-strings: f"...{expr}..." → `...${expr}...`
  js = js.replace(/f"""([\s\S]*?)"""/g, (_, s) => '`' + s.replace(/\{([^}]+)\}/g, '${$1}') + '`');
  js = js.replace(/f"([^"]*)"/g,        (_, s) => '`' + s.replace(/\{([^}]+)\}/g, '${$1}') + '`');
  js = js.replace(/f'([^']*)'/g,        (_, s) => '`' + s.replace(/\{([^}]+)\}/g, '${$1}') + '`');

  // booleans / None
  js = js.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');

  // not → !  (standalone)
  js = js.replace(/\bnot\s+/g, '!');

  // and / or
  js = js.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||');

  // elif → else if
  js = js.replace(/\belif\b/g, 'else if');

  // in operator for arrays: x in arr → arr.includes(x)  (handled via transpile)
  // not in
  js = js.replace(/(\w+)\s+not\s+in\s+(\w+)/g, '!$2.includes($1)');
  js = js.replace(/(\w+)\s+in\s+(\w+)/g, '$2.includes($1)');

  // ** power
  js = js.replace(/\*\*/g, '**');

  // // floor division
  js = js.replace(/\/\//g, '/');

  // Python string methods shim
  js = js.replace(/\.upper\(\)/g, '.toUpperCase()');
  js = js.replace(/\.lower\(\)/g, '.toLowerCase()');
  js = js.replace(/\.capitalize\(\)/g, '.charAt(0).toUpperCase()+String(this).slice(1)');
  js = js.replace(/\.replace\(/g, '.replaceAll(');

  // list methods
  js = js.replace(/\.append\(/g, '.push(');
  js = js.replace(/\.extend\(/g, '.push(');

  // dict .items() → Object.entries()
  js = js.replace(/(\w+)\.items\(\)/g, 'Object.entries($1)');
  js = js.replace(/(\w+)\.keys\(\)/g, 'Object.keys($1)');
  js = js.replace(/(\w+)\.values\(\)/g, 'Object.values($1)');
  js = js.replace(/(\w+)\.get\(([^,)]+),?\s*([^)]*)\)/g, (_, d, k, def) => def ? `($1[$2] !== undefined ? $1[$2] : ${def})`.replace('$1', d).replace('$2', k) : `${d}[${k}]`);

  // def → function (simple single-line)
  js = js.replace(/^(\s*)def (\w+)\(([^)]*)\):/gm, '$1function $2($3) {');

  // class
  js = js.replace(/^(\s*)class (\w+)(?:\((\w+)\))?:/gm, (_, sp, name, base) =>
    base ? `${sp}class ${name} extends ${base} {` : `${sp}class ${name} {`);

  // self → this
  js = js.replace(/\bself\b/g, 'this');

  // __init__ → constructor
  js = js.replace(/function __init__/g, 'constructor');

  // lambda
  js = js.replace(/lambda ([^:]+):\s*(.+)/g, '($1) => $2');

  // for x in range(...):
  js = js.replace(/^(\s*)for (\w+) in range\((.+)\):/gm, '$1for (let $2 of range($3)) {');

  // for x, y in enumerate(arr):
  js = js.replace(/^(\s*)for (\w+),\s*(\w+) in enumerate\((\w+)(?:,\s*(\d+))?\):/gm,
    (_, sp, i, v, arr, start) => `${sp}for (let [${i},${v}] of enumerate(${arr}${start?','+start:''})) {`);

  // for k, v in dict.items():
  js = js.replace(/^(\s*)for (\w+),\s*(\w+) in Object\.entries\((\w+)\):/gm,
    '$1for (let [$2,$3] of Object.entries($4)) {');

  // for x in arr:
  js = js.replace(/^(\s*)for (\w+) in (\w+):/gm, '$1for (let $2 of $3) {');

  // while ... :
  js = js.replace(/^(\s*)while (.+):/gm, '$1while ($2) {');

  // if / else if / else
  js = js.replace(/^(\s*)if (.+):/gm,         '$1if ($2) {');
  js = js.replace(/^(\s*)else if (.+):/gm,     '$1} else if ($2) {');
  js = js.replace(/^(\s*)else:/gm,             '$1} else {');

  // return
  js = js.replace(/^(\s*)return (.+)$/gm, '$1return $2;');
  js = js.replace(/^(\s*)return$/gm, '$1return;');

  // variable assignment (not already let/const/var)
  js = js.replace(/^(\s*)([a-zA-Z_]\w*)\s*=\s*(.+)$/gm, (_, sp, name, val) => {
    if (name === 'this' || val.startsWith('{') || sp.includes('function') || sp.includes('class')) return _;
    return `${sp}let ${name} = ${val};`;
  });

  // augmented assignment
  js = js.replace(/^(\s*)(\w+)\s*\+=\s*(.+)$/gm, '$1$2 += $3;');
  js = js.replace(/^(\s*)(\w+)\s*-=\s*(.+)$/gm, '$1$2 -= $3;');

  // close blocks by dedent — simplified: add } before lines that reduce indent
  js = closeBlocks(js);

  return js;
}

function closeBlocks(code) {
  const lines = code.split('\n');
  const result = [];
  const indents = [0];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') { result.push(''); continue; }

    const indent = line.match(/^(\s*)/)[1].length;
    const cur = indents[indents.length - 1];

    if (indent < cur) {
      // close all blocks deeper than current indent
      while (indents.length > 1 && indents[indents.length - 1] > indent) {
        indents.pop();
        result.push(' '.repeat(indents[indents.length - 1]) + '}');
      }
    }

    result.push(line);

    // if line opens a block (ends with {), record new indent
    if (line.trimEnd().endsWith('{')) {
      // next line's indent
      const next = lines[i + 1];
      if (next) {
        const nextIndent = next.match(/^(\s*)/)[1].length;
        if (nextIndent > indent) indents.push(nextIndent);
      }
    }
  }
  // close remaining
  while (indents.length > 1) {
    indents.pop();
    result.push('}');
  }
  return result.join('\n');
}

function resetEditor(editorId, outputId, defaultCode) {
  document.getElementById(editorId).value = defaultCode;
  const out = document.getElementById(outputId);
  out.className = 'editor-output empty';
  out.innerHTML = '<span class="output-prefix">Output</span><span style="color:var(--muted);font-style:italic"> Run your code to see output...</span>';
}

// ── QUIZZES ───────────────────────────────────────────────────
const QUIZZES = {
  variables: [
    {
      question: 'Ash wants to store his starter\'s name. Which line correctly creates a variable in Python?',
      options: ['var starter = "Charmander"', 'starter = "Charmander"', 'let starter = "Charmander"', 'string starter = "Charmander"'],
      answer: 1,
      explanation: 'Python uses simple assignment with <code>=</code>. No <code>var</code>, <code>let</code>, or type declarations needed.',
    },
    {
      question: 'What does this print? <br><code>a, b = "Pikachu", "Raichu"<br>a, b = b, a<br>print(a)</code>',
      options: ['"Pikachu"', '"Raichu"', 'Error', 'None'],
      answer: 1,
      explanation: 'Python\'s multiple assignment swaps values in one step. After the swap, <code>a</code> holds "Raichu".',
    },
    {
      question: 'Which naming style is correct for Python variables?',
      options: ['maxHP', 'MaxHp', 'max_hp', 'MAX-HP'],
      answer: 2,
      explanation: 'Python convention is <code>snake_case</code> for variables. <code>max_hp</code> is correct.',
    },
  ],
  types: [
    {
      question: 'What is the type of <code>is_shiny = True</code>?',
      options: ['str', 'int', 'bool', 'float'],
      answer: 2,
      explanation: '<code>True</code> and <code>False</code> are Python <code>bool</code> values.',
    },
    {
      question: 'What does <code>int("42")</code> return?',
      options: ['"42"', '42', '42.0', 'Error'],
      answer: 1,
      explanation: '<code>int()</code> converts a string to an integer. <code>"42"</code> becomes <code>42</code>.',
    },
    {
      question: 'What is the output of <code>print(type(6.0))</code>?',
      options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'number'>"],
      answer: 1,
      explanation: '<code>6.0</code> has a decimal point, making it a <code>float</code>.',
    },
  ],
  lists: [
    {
      question: 'Given <code>party = ["Pikachu","Charizard","Blastoise"]</code>, what is <code>party[-1]</code>?',
      options: ['"Pikachu"', '"Charizard"', '"Blastoise"', 'Error'],
      answer: 2,
      explanation: 'Negative indexing counts from the end. <code>-1</code> is the last element: "Blastoise".',
    },
    {
      question: 'Which method adds a Pokémon to the END of a list?',
      options: ['.insert()', '.add()', '.append()', '.push()'],
      answer: 2,
      explanation: '<code>.append(item)</code> adds to the end. <code>.insert(i, item)</code> inserts at a specific index.',
    },
    {
      question: 'What does <code>party[1:3]</code> return from <code>["A","B","C","D"]</code>?',
      options: ['["A","B"]', '["B","C"]', '["B","C","D"]', '["A","B","C"]'],
      answer: 1,
      explanation: 'Slicing is <code>[start:stop]</code> — includes start, excludes stop. Indices 1 and 2 → ["B","C"].',
    },
  ],
  dicts: [
    {
      question: 'What does <code>pokedex.get(999, "Unknown")</code> return if key 999 doesn\'t exist?',
      options: ['None', 'Error', '"Unknown"', '999'],
      answer: 2,
      explanation: '<code>.get(key, default)</code> returns the default value if the key is missing — no error.',
    },
    {
      question: 'How do you iterate over both keys AND values of a dict <code>d</code>?',
      options: ['for k in d:', 'for k, v in d.items():', 'for k, v in d:', 'for d.keys(), d.values():'],
      answer: 1,
      explanation: '<code>d.items()</code> returns key-value pairs. Unpack with <code>for k, v in d.items()</code>.',
    },
    {
      question: 'Which line adds a new key "item" with value "Potion" to dict <code>p</code>?',
      options: ['p.add("item", "Potion")', 'p["item"] = "Potion"', 'p.insert("item", "Potion")', 'p.set("item", "Potion")'],
      answer: 1,
      explanation: 'Dict assignment: <code>p["key"] = value</code> adds or updates the key.',
    },
  ],
  conditionals: [
    {
      question: 'What prints when <code>hp = 10</code> and you check <code>if hp / 100 < 0.25</code>?',
      options: ['Nothing', '"HP is fine"', '"HP is critical"', 'Error'],
      answer: 2,
      explanation: '<code>10/100 = 0.1</code>, which is less than 0.25, so the critical branch runs.',
    },
    {
      question: 'What is the one-line ternary result of <code>"Win" if 110 > 80 else "Lose"</code>?',
      options: ['"Lose"', 'Error', '"Win"', 'True'],
      answer: 2,
      explanation: 'Python\'s ternary: <code>value_if_true if condition else value_if_false</code>. 110 > 80 is True → "Win".',
    },
    {
      question: 'Which keyword handles an "otherwise" branch in Python?',
      options: ['elif', 'else if', 'else', 'default'],
      answer: 2,
      explanation: 'Python uses <code>else:</code> for the final fallback. <code>elif</code> is for additional conditions.',
    },
  ],
  loops: [
    {
      question: 'What does <code>range(2, 10, 3)</code> produce?',
      options: ['[2, 5, 8]', '[2, 3, 4, 5, 6, 7, 8, 9]', '[3, 6, 9]', '[2, 4, 6, 8]'],
      answer: 0,
      explanation: '<code>range(start, stop, step)</code>: starts at 2, steps by 3 → 2, 5, 8 (stops before 10).',
    },
    {
      question: 'Which gives you both the index and value while looping a list?',
      options: ['for i, v in list()', 'for i, v in enumerate(list)', 'for i in range(list)', 'for i, v in zip(list)'],
      answer: 1,
      explanation: '<code>enumerate(iterable)</code> yields <code>(index, value)</code> pairs.',
    },
    {
      question: 'What keyword immediately exits a loop in Python?',
      options: ['exit', 'stop', 'return', 'break'],
      answer: 3,
      explanation: '<code>break</code> exits the loop. <code>continue</code> skips to the next iteration.',
    },
  ],
  functions: [
    {
      question: 'What does <code>def catch(pokemon, ball="Poké Ball")</code> mean for <code>ball</code>?',
      options: ['ball is required', 'ball defaults to "Poké Ball" if not passed', 'ball must be a string', 'ball is a global variable'],
      answer: 1,
      explanation: 'A parameter with <code>=</code> is a default parameter — optional when calling the function.',
    },
    {
      question: 'What does <code>*args</code> collect in a function definition?',
      options: ['keyword arguments as a dict', 'a single required argument', 'any number of positional arguments as a tuple', 'nothing — it\'s a syntax error'],
      answer: 2,
      explanation: '<code>*args</code> collects extra positional arguments into a tuple. <code>**kwargs</code> collects keyword arguments into a dict.',
    },
    {
      question: 'What is the output? <code>def f(x): return x * 2<br>print(f(5))</code>',
      options: ['None', '5', '10', 'Error'],
      answer: 2,
      explanation: '<code>f(5)</code> returns <code>5 * 2 = 10</code>, which is then printed.',
    },
  ],
  classes: [
    {
      question: 'What is the purpose of <code>__init__</code> in a Python class?',
      options: ['It runs when the class is imported', 'It initializes a new instance (constructor)', 'It deletes an instance', 'It is called when printing the object'],
      answer: 1,
      explanation: '<code>__init__</code> is the constructor — it runs when you create a new object with <code>ClassName()</code>.',
    },
    {
      question: 'What does <code>super().__init__(...)</code> do in a subclass?',
      options: ['Creates a new parent class', 'Calls the parent class constructor', 'Deletes the parent', 'Overrides the parent method'],
      answer: 1,
      explanation: '<code>super()</code> refers to the parent class. <code>super().__init__()</code> runs the parent\'s constructor.',
    },
    {
      question: 'What does <code>self</code> refer to inside a class method?',
      options: ['The class itself', 'The current instance', 'The parent class', 'A global variable'],
      answer: 1,
      explanation: '<code>self</code> is a reference to the specific object (instance) the method is called on.',
    },
  ],
  exceptions: [
    {
      question: 'Which block always runs, whether or not an exception occurs?',
      options: ['try', 'except', 'else', 'finally'],
      answer: 3,
      explanation: '<code>finally</code> always executes — used for cleanup like closing files.',
    },
    {
      question: 'How do you raise a custom error with a message?',
      options: ['error("message")', 'throw ValueError("message")', 'raise ValueError("message")', 'except ValueError("message")'],
      answer: 2,
      explanation: '<code>raise ExceptionType("message")</code> triggers an exception manually.',
    },
    {
      question: 'What exception is raised when a dict key doesn\'t exist?',
      options: ['IndexError', 'TypeError', 'KeyError', 'ValueError'],
      answer: 2,
      explanation: 'Accessing a missing dict key raises <code>KeyError</code>. Use <code>.get()</code> to avoid it.',
    },
  ],
  comprehensions: [
    {
      question: 'What does <code>[p.upper() for p in ["a","b","c"]]</code> return?',
      options: ['["a","b","c"]', '["A","B","C"]', '"ABC"', 'Error'],
      answer: 1,
      explanation: 'The list comprehension applies <code>.upper()</code> to each element, producing <code>["A","B","C"]</code>.',
    },
    {
      question: 'What does the filter condition do in <code>[p for p in party if len(p) > 7]</code>?',
      options: ['Keeps only Pokémon with names longer than 7 chars', 'Removes names longer than 7 chars', 'Limits the list to 7 items', 'Sorts by length'],
      answer: 0,
      explanation: 'The <code>if</code> clause filters — only items where the condition is True are included.',
    },
    {
      question: 'Which syntax creates a dict comprehension?',
      options: ['[k: v for k, v in items]', '{k: v for k, v in items}', '(k: v for k, v in items)', 'dict(k: v for k, v in items)'],
      answer: 1,
      explanation: 'Dict comprehensions use curly braces with a colon: <code>{key: value for ...}</code>.',
    },
  ],
};

// ── LESSON CONTENT ────────────────────────────────────────────
function renderLessonPage(id) {
  const idx   = CURRICULUM.findIndex(c => c.id === id);
  const entry = CURRICULUM[idx];
  const done  = STATE.completedLessons.has(id);
  const data  = LESSONS[id];
  if (!data) return '<p style="color:var(--muted)">Lesson not found.</p>';

  return `
    <div class="lesson-page">
      <div class="lesson-topbar">
        <span class="lesson-badge">${entry.track === 'python' ? 'Python Track' : 'LeetCode Track'}</span>
        <span class="lesson-num">Lesson ${idx + 1} of ${CURRICULUM.length}</span>
        ${done ? '<span style="color:var(--green);font-size:0.85rem;font-weight:700">✓ Completed</span>' : ''}
      </div>
      <h1 class="lesson-title">${entry.icon} ${data.title}</h1>
      <p class="lesson-subtitle">${data.subtitle}</p>

      ${data.content}

      ${data.editor ? renderEditor(id, data.editor) : ''}

      <div class="quiz-cta">
        <div class="quiz-cta-icon">🧩</div>
        <div>
          <h4>Ready to test your knowledge?</h4>
          <p>Take a 3-question quiz on ${data.title} and earn XP!</p>
        </div>
        <button class="quiz-start-btn" onclick="startQuiz('${id}')">
          ${done ? 'Retake Quiz' : 'Start Quiz →'}
        </button>
      </div>
    </div>`;
}

function renderEditor(lessonId, editorData) {
  const eid = `editor-${lessonId}`;
  const oid = `output-${lessonId}`;
  return `
    <div class="editor-section">
      <div class="editor-header">
        <div class="editor-title">💻 Try It <span>— edit and run the code</span></div>
        <div class="editor-actions">
          <button class="reset-btn" onclick="resetEditor('${eid}','${oid}', \`${editorData.code.replace(/`/g,'\\`')}\`)">Reset</button>
          <button class="run-btn" onclick="runCode('${eid}','${oid}')">▶ Run</button>
        </div>
      </div>
      <textarea class="editor-textarea" id="${eid}" spellcheck="false">${editorData.code}</textarea>
      <div class="editor-output empty" id="${oid}">
        <span class="output-prefix">Output</span>
        <span style="color:var(--muted);font-style:italic"> Run your code to see output...</span>
      </div>
    </div>`;
}

// ── LESSON DATA ───────────────────────────────────────────────
const LESSONS = {
  variables: {
    title: 'Variables & Assignment',
    subtitle: 'Think of variables as Pokémon nicknames — just labels pointing to a value in memory.',
    editor: {
      code: `# Try changing the values and hit Run!
starter = "Charmander"
level = 5
is_shiny = False

print(starter)
print(level)
print(is_shiny)

# Swap two variables
a, b = "Bulbasaur", "Squirtle"
a, b = b, a
print(a)`
    },
    content: `
    <div class="concept-block">
      <h4>Creating variables</h4>
      <p>In Python, you create a variable by simply assigning a value with <code>=</code>. No types, no keywords like <code>var</code> or <code>let</code>.</p>
      <div class="code-wrapper"><pre><code><span class="cm"># Each variable is like nicknaming a Pokémon</span>
<span class="nm">starter</span> = <span class="st">"Charmander"</span>    <span class="cm"># str</span>
<span class="nm">level</span>   = <span class="nb">5</span>               <span class="cm"># int</span>
<span class="nm">hp</span>      = <span class="nb">39.0</span>            <span class="cm"># float</span>
<span class="nm">is_shiny</span> = <span class="kw">False</span>          <span class="cm"># bool</span>

<span class="fn">print</span>(<span class="nm">starter</span>)  <span class="cm"># Charmander</span></code></pre></div>
    </div>
    <div class="concept-block">
      <h4>Multiple assignment & swapping</h4>
      <p>Python lets you assign or swap multiple variables in one line — no temp variable needed.</p>
      <div class="code-wrapper"><pre><code><span class="nm">attack</span>, <span class="nm">defense</span>, <span class="nm">speed</span> = <span class="nb">52</span>, <span class="nb">43</span>, <span class="nb">65</span>

<span class="cm"># Swap without a temp variable</span>
<span class="nm">poke_a</span>, <span class="nm">poke_b</span> = <span class="st">"Pikachu"</span>, <span class="st">"Raichu"</span>
<span class="nm">poke_a</span>, <span class="nm">poke_b</span> = <span class="nm">poke_b</span>, <span class="nm">poke_a</span>
<span class="fn">print</span>(<span class="nm">poke_a</span>)  <span class="cm"># Raichu</span></code></pre></div>
      <div class="output-box"><div class="output-label">Output</div>Raichu</div>
    </div>
    <div class="tip-box"><strong>Naming convention:</strong> Use <code>snake_case</code> for variables (<code>max_hp</code>) and <code>ALL_CAPS</code> for constants (<code>MAX_LEVEL = 100</code>).</div>`
  },

  types: {
    title: 'Data Types',
    subtitle: 'Like Pokémon have types (Fire, Water, Grass), every Python value has a type.',
    editor: { code: `name   = "Pikachu"
level  = 25
weight = 6.0
caught = True

print(type(name))
print(type(level))
print(type(weight))

# Type conversion
num_str = "50"
print(int(num_str) + 10)` },
    content: `
    <div class="concept-block">
      <h4>The core types</h4>
      <div class="code-wrapper"><pre><code><span class="nm">name</span>   = <span class="st">"Pikachu"</span>   <span class="cm"># str</span>
<span class="nm">level</span>  = <span class="nb">25</span>          <span class="cm"># int</span>
<span class="nm">weight</span> = <span class="nb">6.0</span>        <span class="cm"># float</span>
<span class="nm">caught</span> = <span class="kw">True</span>       <span class="cm"># bool</span>
<span class="nm">item</span>   = <span class="kw">None</span>       <span class="cm"># NoneType — absence of value</span>

<span class="fn">print</span>(<span class="fn">type</span>(<span class="nm">name</span>))   <span class="cm"># &lt;class 'str'&gt;</span>
<span class="fn">print</span>(<span class="fn">type</span>(<span class="nm">level</span>))  <span class="cm"># &lt;class 'int'&gt;</span></code></pre></div>
    </div>
    <div class="concept-block">
      <h4>Type conversion (casting)</h4>
      <div class="code-wrapper"><pre><code><span class="nm">level_str</span> = <span class="st">"50"</span>
<span class="nm">level_int</span> = <span class="fn">int</span>(<span class="nm">level_str</span>)    <span class="cm"># 50</span>
<span class="nm">level_flt</span> = <span class="fn">float</span>(<span class="nm">level_str</span>)  <span class="cm"># 50.0</span>

<span class="nm">num</span> = <span class="nb">25</span>
<span class="nm">tag</span> = <span class="st">f"#<span class="nb">{str(num).zfill(3)}</span>"</span>  <span class="cm"># "#025"</span>
<span class="fn">print</span>(<span class="nm">tag</span>)</code></pre></div>
      <div class="output-box"><div class="output-label">Output</div>#025</div>
    </div>`
  },

  lists: {
    title: 'Lists',
    subtitle: 'A list is your Pokémon party — ordered, mutable, and you can hold as many as you want.',
    editor: { code: `party = ["Pikachu", "Charizard", "Blastoise"]

print(party[0])    # first
print(party[-1])   # last
print(len(party))

party.append("Gengar")
print(party)` },
    content: `
    <div class="concept-block">
      <h4>Creating & indexing</h4>
      <div class="code-wrapper"><pre><code><span class="nm">party</span> = [<span class="st">"Pikachu"</span>, <span class="st">"Charizard"</span>, <span class="st">"Blastoise"</span>, <span class="st">"Gengar"</span>]

<span class="fn">print</span>(<span class="nm">party</span>[<span class="nb">0</span>])    <span class="cm"># Pikachu</span>
<span class="fn">print</span>(<span class="nm">party</span>[<span class="nb">-1</span>])   <span class="cm"># Gengar (last)</span>
<span class="fn">print</span>(<span class="nm">party</span>[<span class="nb">1</span>:<span class="nb">3</span>])  <span class="cm"># ['Charizard', 'Blastoise']</span></code></pre></div>
    </div>
    <div class="concept-block">
      <h4>Mutating a list</h4>
      <div class="code-wrapper"><pre><code><span class="nm">party</span>.<span class="fn">append</span>(<span class="st">"Snorlax"</span>)   <span class="cm"># add to end</span>
<span class="nm">party</span>.<span class="fn">insert</span>(<span class="nb">0</span>, <span class="st">"Eevee"</span>)   <span class="cm"># add at index 0</span>
<span class="nm">party</span>.<span class="fn">remove</span>(<span class="st">"Gengar"</span>)    <span class="cm"># remove by value</span>
<span class="nm">last</span> = <span class="nm">party</span>.<span class="fn">pop</span>()         <span class="cm"># remove & return last</span>
<span class="fn">print</span>(<span class="st">f"Released: <span class="nb">{last}</span>"</span>)</code></pre></div>
    </div>
    <div class="tip-box"><strong>Check membership:</strong> <code>"Pikachu" in party</code> returns <code>True</code> or <code>False</code> — way faster with a set for large data.</div>`
  },

  dicts: {
    title: 'Dictionaries',
    subtitle: 'A dict is a Pokédex entry — fast key/value lookups by name or number.',
    editor: { code: `pikachu = {
    "name": "Pikachu",
    "type": "Electric",
    "level": 25,
}

print(pikachu["name"])
print(pikachu.get("hp", 100))

pikachu["level"] = 26
for key, value in pikachu.items():
    print(key, ":", value)` },
    content: `
    <div class="concept-block">
      <h4>Creating & accessing</h4>
      <div class="code-wrapper"><pre><code><span class="nm">pikachu</span> = {
    <span class="st">"name"</span>:  <span class="st">"Pikachu"</span>,
    <span class="st">"type"</span>:  <span class="st">"Electric"</span>,
    <span class="st">"level"</span>: <span class="nb">25</span>,
    <span class="st">"moves"</span>: [<span class="st">"Thunderbolt"</span>, <span class="st">"Quick Attack"</span>],
}

<span class="fn">print</span>(<span class="nm">pikachu</span>[<span class="st">"name"</span>])           <span class="cm"># Pikachu</span>
<span class="fn">print</span>(<span class="nm">pikachu</span>.<span class="fn">get</span>(<span class="st">"hp"</span>, <span class="nb">100</span>))   <span class="cm"># 100 (default)</span></code></pre></div>
    </div>
    <div class="concept-block">
      <h4>Update & iterate</h4>
      <div class="code-wrapper"><pre><code><span class="nm">pikachu</span>[<span class="st">"level"</span>] = <span class="nb">26</span>          <span class="cm"># update</span>
<span class="nm">pikachu</span>[<span class="st">"item"</span>] = <span class="st">"Light Ball"</span> <span class="cm"># add new key</span>

<span class="kw">for</span> <span class="nm">key</span>, <span class="nm">val</span> <span class="kw">in</span> <span class="nm">pikachu</span>.<span class="fn">items</span>():
    <span class="fn">print</span>(<span class="st">f"  <span class="nb">{key}</span>: <span class="nb">{val}</span>"</span>)</code></pre></div>
    </div>`
  },

  conditionals: {
    title: 'Conditionals',
    subtitle: 'Type matchups are perfect for if/elif/else — is this move effective?',
    editor: { code: `hp = 12
max_hp = 100

ratio = hp / max_hp

if ratio <= 0:
    print("Fainted!")
elif ratio < 0.25:
    print("Critical HP! Use a Potion!")
elif ratio < 0.5:
    print("HP is low")
else:
    print("HP is fine")` },
    content: `
    <div class="concept-block">
      <h4>if / elif / else</h4>
      <div class="code-wrapper"><pre><code><span class="nm">move_type</span>     = <span class="st">"Water"</span>
<span class="nm">opponent_type</span> = <span class="st">"Fire"</span>

<span class="kw">if</span> <span class="nm">move_type</span> == <span class="st">"Water"</span> <span class="kw">and</span> <span class="nm">opponent_type</span> == <span class="st">"Fire"</span>:
    <span class="fn">print</span>(<span class="st">"Super effective! x2 damage"</span>)
<span class="kw">elif</span> <span class="nm">move_type</span> == <span class="nm">opponent_type</span>:
    <span class="fn">print</span>(<span class="st">"Not very effective... x0.5"</span>)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="st">"Normal damage"</span>)</code></pre></div>
      <div class="output-box"><div class="output-label">Output</div>Super effective! x2 damage</div>
    </div>
    <div class="concept-block">
      <h4>Ternary (one-liner)</h4>
      <div class="code-wrapper"><pre><code><span class="nm">speed</span>, <span class="nm">opp_speed</span> = <span class="nb">110</span>, <span class="nb">80</span>
<span class="nm">first</span> = <span class="st">"You"</span> <span class="kw">if</span> <span class="nm">speed</span> > <span class="nm">opp_speed</span> <span class="kw">else</span> <span class="st">"Opponent"</span>
<span class="fn">print</span>(<span class="st">f"<span class="nb">{first}</span> goes first!"</span>)</code></pre></div>
      <div class="output-box"><div class="output-label">Output</div>You goes first!</div>
    </div>`
  },

  loops: {
    title: 'Loops',
    subtitle: 'Loops let you battle every trainer in the gym, one by one.',
    editor: { code: `party = ["Pikachu", "Charizard", "Blastoise"]

for pokemon in party:
    print("Go,", pokemon)

print("---")

for level in range(10, 51, 10):
    print("Reached level", level)` },
    content: `
    <div class="concept-block">
      <h4>for loop</h4>
      <div class="code-wrapper"><pre><code><span class="kw">for</span> <span class="nm">pokemon</span> <span class="kw">in</span> [<span class="st">"Pikachu"</span>, <span class="st">"Charizard"</span>, <span class="st">"Blastoise"</span>]:
    <span class="fn">print</span>(<span class="st">f"Go, <span class="nb">{pokemon}</span>!"</span>)</code></pre></div>
    </div>
    <div class="concept-block">
      <h4>enumerate — index + value</h4>
      <div class="code-wrapper"><pre><code><span class="nm">moves</span> = [<span class="st">"Flamethrower"</span>, <span class="st">"Dragon Claw"</span>, <span class="st">"Fly"</span>]
<span class="kw">for</span> <span class="nm">i</span>, <span class="nm">move</span> <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="nm">moves</span>, <span class="nb">1</span>):
    <span class="fn">print</span>(<span class="st">f"Slot <span class="nb">{i}</span>: <span class="nb">{move}</span>"</span>)</code></pre></div>
      <div class="output-box"><div class="output-label">Output</div>Slot 1: Flamethrower<br/>Slot 2: Dragon Claw<br/>Slot 3: Fly</div>
    </div>
    <div class="concept-block">
      <h4>while loop</h4>
      <div class="code-wrapper"><pre><code><span class="nm">enemy_hp</span> = <span class="nb">45</span>
<span class="kw">while</span> <span class="nm">enemy_hp</span> > <span class="nb">0</span>:
    <span class="nm">enemy_hp</span> -= <span class="nb">15</span>
    <span class="fn">print</span>(<span class="st">f"Enemy HP: <span class="nb">{max(0, enemy_hp)}</span>"</span>)
<span class="fn">print</span>(<span class="st">"Pokémon fainted!"</span>)</code></pre></div>
    </div>`
  },

  functions: {
    title: 'Functions',
    subtitle: 'Functions are like TMs — reusable moves you can teach to any Pokémon.',
    editor: { code: `def calculate_damage(attack, defense, power=90):
    damage = (attack / defense) * power * 0.5
    return round(damage)

print(calculate_damage(90, 65))
print(calculate_damage(120, 50, 110))

def show_party(*pokemon):
    for p in pokemon:
        print("-", p)

show_party("Pikachu", "Gengar", "Dragonite")` },
    content: `
    <div class="concept-block">
      <h4>def and return</h4>
      <div class="code-wrapper"><pre><code><span class="kw">def</span> <span class="fn">calculate_damage</span>(<span class="nm">attack</span>, <span class="nm">defense</span>, <span class="nm">power</span>):
    <span class="nm">damage</span> = (<span class="nm">attack</span> / <span class="nm">defense</span>) * <span class="nm">power</span> * <span class="nb">0.5</span>
    <span class="kw">return</span> <span class="fn">round</span>(<span class="nm">damage</span>)

<span class="fn">print</span>(<span class="fn">calculate_damage</span>(<span class="nb">90</span>, <span class="nb">65</span>, <span class="nb">95</span>))  <span class="cm"># 66</span></code></pre></div>
    </div>
    <div class="concept-block">
      <h4>Default parameters</h4>
      <div class="code-wrapper"><pre><code><span class="kw">def</span> <span class="fn">catch</span>(<span class="nm">pokemon</span>, <span class="nm">ball</span>=<span class="st">"Poké Ball"</span>):
    <span class="fn">print</span>(<span class="st">f"Throwing {ball} at {pokemon}!"</span>)

<span class="fn">catch</span>(<span class="st">"Pidgey"</span>)
<span class="fn">catch</span>(<span class="st">"Mewtwo"</span>, <span class="st">"Master Ball"</span>)</code></pre></div>
    </div>
    <div class="concept-block">
      <h4>*args and **kwargs</h4>
      <div class="code-wrapper"><pre><code><span class="kw">def</span> <span class="fn">show_party</span>(*<span class="nm">pokemon</span>):
    <span class="kw">for</span> <span class="nm">p</span> <span class="kw">in</span> <span class="nm">pokemon</span>:
        <span class="fn">print</span>(<span class="st">f"  - <span class="nb">{p}</span>"</span>)

<span class="fn">show_party</span>(<span class="st">"Pikachu"</span>, <span class="st">"Gengar"</span>, <span class="st">"Dragonite"</span>)</code></pre></div>
    </div>`
  },

  classes: {
    title: 'Classes & OOP',
    subtitle: 'Every Pokémon is an object. Classes are the blueprint.',
    editor: { code: `class Pokemon:
    def __init__(self, name, hp, attack):
        self.name = name
        self.hp = hp
        self.max_hp = hp
        self.attack = attack

    def status(self):
        print(self.name, "HP:", self.hp, "/", self.max_hp)

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)
        if self.hp == 0:
            print(self.name, "fainted!")

pikachu = Pokemon("Pikachu", 35, 55)
pikachu.status()
pikachu.take_damage(20)
pikachu.status()` },
    content: `
    <div class="concept-block">
      <h4>Class definition</h4>
      <div class="code-wrapper"><pre><code><span class="kw">class</span> <span class="fn">Pokemon</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, <span class="nm">name</span>, <span class="nm">hp</span>):
        <span class="nm">self</span>.<span class="nm">name</span>   = <span class="nm">name</span>
        <span class="nm">self</span>.<span class="nm">hp</span>     = <span class="nm">hp</span>
        <span class="nm">self</span>.<span class="nm">max_hp</span> = <span class="nm">hp</span>

    <span class="kw">def</span> <span class="fn">status</span>(<span class="nm">self</span>):
        <span class="fn">print</span>(<span class="st">f"<span class="nb">{self.name}</span> HP: <span class="nb">{self.hp}</span>/<span class="nb">{self.max_hp}</span>"</span>)

<span class="nm">p</span> = <span class="fn">Pokemon</span>(<span class="st">"Pikachu"</span>, <span class="nb">35</span>)
<span class="nm">p</span>.<span class="fn">status</span>()</code></pre></div>
      <div class="output-box"><div class="output-label">Output</div>Pikachu HP: 35/35</div>
    </div>
    <div class="concept-block">
      <h4>Inheritance = Evolution</h4>
      <div class="code-wrapper"><pre><code><span class="kw">class</span> <span class="fn">FirePokemon</span>(<span class="fn">Pokemon</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="nm">self</span>, <span class="nm">name</span>, <span class="nm">hp</span>, <span class="nm">fire_power</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>(<span class="nm">name</span>, <span class="nm">hp</span>)
        <span class="nm">self</span>.<span class="nm">fire_power</span> = <span class="nm">fire_power</span>

    <span class="kw">def</span> <span class="fn">flamethrower</span>(<span class="nm">self</span>, <span class="nm">target</span>):
        <span class="fn">print</span>(<span class="st">f"<span class="nb">{self.name}</span> uses Flamethrower!"</span>)
        <span class="nm">target</span>.<span class="nm">hp</span> -= <span class="nm">self</span>.<span class="nm">fire_power</span></code></pre></div>
    </div>`
  },

  exceptions: {
    title: 'Exceptions & Error Handling',
    subtitle: 'Like a move missing — handle failures gracefully instead of crashing.',
    editor: { code: `def use_item(bag, item):
    try:
        count = bag[item]
        if count <= 0:
            raise ValueError("No " + item + " left!")
        bag[item] -= 1
        print("Used", item + "! Remaining:", bag[item])
    except KeyError:
        print("You don't have", item)
    except ValueError as e:
        print("Error:", e)
    finally:
        print("Turn ended.")

bag = {"Potion": 2, "Antidote": 0}
use_item(bag, "Potion")
use_item(bag, "Antidote")
use_item(bag, "Revive")` },
    content: `
    <div class="concept-block">
      <h4>try / except / finally</h4>
      <div class="code-wrapper"><pre><code><span class="kw">try</span>:
    <span class="nm">item_bag</span>[<span class="nm">item_name</span>] -= <span class="nb">1</span>
    <span class="fn">print</span>(<span class="st">f"Used <span class="nb">{item_name}</span>!"</span>)
<span class="kw">except</span> <span class="fn">KeyError</span>:
    <span class="fn">print</span>(<span class="st">f"You don't have <span class="nb">{item_name}</span>."</span>)
<span class="kw">except</span> <span class="fn">ValueError</span> <span class="kw">as</span> <span class="nm">e</span>:
    <span class="fn">print</span>(<span class="st">f"Error: <span class="nb">{e}</span>"</span>)
<span class="kw">finally</span>:
    <span class="fn">print</span>(<span class="st">"Turn ended."</span>)</code></pre></div>
    </div>
    <div class="concept-block">
      <h4>Custom exceptions</h4>
      <div class="code-wrapper"><pre><code><span class="kw">class</span> <span class="fn">PokeballMissError</span>(<span class="fn">Exception</span>):
    <span class="kw">pass</span>

<span class="kw">def</span> <span class="fn">throw_ball</span>(<span class="nm">catch_rate</span>):
    <span class="kw">if</span> <span class="nm">catch_rate</span> < <span class="nb">0.5</span>:
        <span class="kw">raise</span> <span class="fn">PokeballMissError</span>(<span class="st">"Pokémon broke free!"</span>)
    <span class="kw">return</span> <span class="kw">True</span></code></pre></div>
    </div>`
  },

  comprehensions: {
    title: 'List & Dict Comprehensions',
    subtitle: 'Process your whole Pokédex in one elegant line.',
    editor: { code: `pokemon = ["pikachu", "charizard", "blastoise", "gengar", "snorlax"]

# Capitalize all
proper = [p.upper() for p in pokemon]
print(proper)

# Filter long names (> 7 chars)
long_names = [p for p in pokemon if len(p) > 7]
print(long_names)

# Dict: name -> length
name_lengths = {p: len(p) for p in pokemon}
print(name_lengths)` },
    content: `
    <div class="concept-block">
      <h4>List comprehension</h4>
      <div class="code-wrapper"><pre><code><span class="nm">pokemon</span> = [<span class="st">"pikachu"</span>, <span class="st">"charizard"</span>, <span class="st">"gengar"</span>]

<span class="nm">proper</span>    = [<span class="nm">p</span>.<span class="fn">capitalize</span>() <span class="kw">for</span> <span class="nm">p</span> <span class="kw">in</span> <span class="nm">pokemon</span>]
<span class="nm">long_names</span>= [<span class="nm">p</span> <span class="kw">for</span> <span class="nm">p</span> <span class="kw">in</span> <span class="nm">pokemon</span> <span class="kw">if</span> <span class="fn">len</span>(<span class="nm">p</span>) > <span class="nb">7</span>]</code></pre></div>
    </div>
    <div class="concept-block">
      <h4>Dict comprehension</h4>
      <div class="code-wrapper"><pre><code><span class="nm">base_stats</span> = {<span class="st">"Pikachu"</span>: <span class="nb">320</span>, <span class="st">"Charizard"</span>: <span class="nb">534</span>, <span class="st">"Mewtwo"</span>: <span class="nb">680</span>}

<span class="nm">strong</span> = {<span class="nm">n</span>: <span class="nm">s</span> <span class="kw">for</span> <span class="nm">n</span>, <span class="nm">s</span> <span class="kw">in</span> <span class="nm">base_stats</span>.<span class="fn">items</span>() <span class="kw">if</span> <span class="nm">s</span> > <span class="nb">500</span>}
<span class="fn">print</span>(<span class="nm">strong</span>)  <span class="cm"># {'Charizard': 534, 'Mewtwo': 680}</span></code></pre></div>
    </div>
    <div class="tip-box"><strong>Set comprehension:</strong> <code>{p[0] for p in pokemon}</code> — unique first letters. <strong>Generator:</strong> <code>(p.upper() for p in pokemon)</code> — lazy, memory-efficient.</div>`
  },
};

// ── LEETCODE PAGES ────────────────────────────────────────────
const LC_DATA = {
  lc_twosum: {
    title: 'Two Sum', diff: 'Easy', num: 1,
    pokemon: 'Two Pokémon whose stat totals combine to a target',
    story: 'Professor Oak has a list of Pokémon base stat totals. Find two whose stats add exactly to a target value.',
    approach: 'Hash map (dict): store each value → index as we go. For each element, check if the complement (target - current) is already in the map.',
    steps: [
      { title: 'Initialize a seen dict', body: '<code>seen = {}</code> maps value → index.' },
      { title: 'Loop with enumerate', body: 'For each <code>i, stat</code>, compute <code>need = target - stat</code>.' },
      { title: 'Check complement', body: 'If <code>need in seen</code>, return <code>[seen[need], i]</code>.' },
      { title: 'Store current', body: 'Otherwise <code>seen[stat] = i</code> and continue.' },
    ],
    code: `<span class="kw">def</span> <span class="fn">two_sum</span>(<span class="nm">stats</span>, <span class="nm">target</span>):
    <span class="nm">seen</span> = {}
    <span class="kw">for</span> <span class="nm">i</span>, <span class="nm">stat</span> <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="nm">stats</span>):
        <span class="nm">need</span> = <span class="nm">target</span> - <span class="nm">stat</span>
        <span class="kw">if</span> <span class="nm">need</span> <span class="kw">in</span> <span class="nm">seen</span>:
            <span class="kw">return</span> [<span class="nm">seen</span>[<span class="nm">need</span>], <span class="nm">i</span>]
        <span class="nm">seen</span>[<span class="nm">stat</span>] = <span class="nm">i</span>

<span class="nm">stats</span> = [<span class="nb">320</span>, <span class="nb">534</span>, <span class="nb">200</span>, <span class="nb">146</span>, <span class="nb">680</span>]
<span class="fn">print</span>(<span class="fn">two_sum</span>(<span class="nm">stats</span>, <span class="nb">680</span>))  <span class="cm"># [1, 2]  534+146=680</span>`,
    output: '[1, 2]', time: 'O(n)', space: 'O(n)',
    editor: { code: `def two_sum(stats, target):
    seen = {}
    for i in range(len(stats)):
        need = target - stats[i]
        if need in seen:
            return [seen[need], i]
        seen[stats[i]] = i
    return []

stats = [320, 534, 200, 146, 680]
print(two_sum(stats, 680))
print(two_sum(stats, 520))` }
  },
  lc_valid_parens: {
    title: 'Valid Parentheses', diff: 'Easy', num: 20,
    pokemon: 'Pokémon combo move sequence validator',
    story: 'In double battles, combo moves must be properly paired. Check if a string of brackets is valid.',
    approach: 'Stack: push opening brackets, pop and match on closing brackets.',
    steps: [
      { title: 'Build a pairs map', body: '<code>{")":"(", "}":"{", "]":"["}</code>' },
      { title: 'Initialize a stack', body: '<code>stack = []</code> tracks unmatched openers.' },
      { title: 'Loop each char', body: 'Opener → push. Closer → check top of stack matches.' },
      { title: 'Return stack empty', body: 'If stack is empty at end, all brackets matched.' },
    ],
    code: `<span class="kw">def</span> <span class="fn">is_valid</span>(<span class="nm">s</span>):
    <span class="nm">pairs</span> = {<span class="st">')'</span>:<span class="st">'('</span>, <span class="st">'}'</span>:<span class="st">'{'</span>, <span class="st">']'</span>:<span class="st">'['</span>}
    <span class="nm">stack</span> = []
    <span class="kw">for</span> <span class="nm">c</span> <span class="kw">in</span> <span class="nm">s</span>:
        <span class="kw">if</span> <span class="nm">c</span> <span class="kw">in</span> <span class="st">"({["</span>:
            <span class="nm">stack</span>.<span class="fn">append</span>(<span class="nm">c</span>)
        <span class="kw">elif</span> <span class="kw">not</span> <span class="nm">stack</span> <span class="kw">or</span> <span class="nm">stack</span>[<span class="nb">-1</span>] != <span class="nm">pairs</span>[<span class="nm">c</span>]:
            <span class="kw">return</span> <span class="kw">False</span>
        <span class="kw">else</span>:
            <span class="nm">stack</span>.<span class="fn">pop</span>()
    <span class="kw">return</span> <span class="fn">len</span>(<span class="nm">stack</span>) == <span class="nb">0</span>

<span class="fn">print</span>(<span class="fn">is_valid</span>(<span class="st">"()[]{}"</span>))  <span class="cm"># True</span>
<span class="fn">print</span>(<span class="fn">is_valid</span>(<span class="st">"([)]"</span>))    <span class="cm"># False</span>`,
    output: 'True\nFalse', time: 'O(n)', space: 'O(n)',
    editor: { code: `def is_valid(s):
    pairs = {')': '(', '}': '{', ']': '['}
    stack = []
    for c in s:
        if c in "([{":
            stack.append(c)
        elif len(stack) == 0 or stack[-1] != pairs[c]:
            return False
        else:
            stack.pop()
    return len(stack) == 0

print(is_valid("()[]{}"))
print(is_valid("([)]"))
print(is_valid("{[]}"))` }
  },
  lc_longest_sub: {
    title: 'Longest Substring Without Repeating', diff: 'Medium', num: 3,
    pokemon: "Ash's non-repeating move streak",
    story: "Find the longest sequence of moves where no move repeats — Ash's record variety streak.",
    approach: 'Sliding window with a set. Expand right pointer; when duplicate found, shrink from left.',
    steps: [
      { title: 'Two pointers + set', body: '<code>left=0, best=0, window=set()</code>' },
      { title: 'Expand right', body: 'For each index <code>right</code>, check if <code>moves[right]</code> in window.' },
      { title: 'Shrink on duplicate', body: 'While duplicate exists, remove <code>moves[left]</code>, increment <code>left</code>.' },
      { title: 'Update best', body: '<code>best = max(best, right - left + 1)</code>' },
    ],
    code: `<span class="kw">def</span> <span class="fn">longest_streak</span>(<span class="nm">moves</span>):
    <span class="nm">window</span> = <span class="fn">set</span>()
    <span class="nm">left</span> = <span class="nm">best</span> = <span class="nb">0</span>
    <span class="kw">for</span> <span class="nm">right</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(<span class="nm">moves</span>)):
        <span class="kw">while</span> <span class="nm">moves</span>[<span class="nm">right</span>] <span class="kw">in</span> <span class="nm">window</span>:
            <span class="nm">window</span>.<span class="fn">discard</span>(<span class="nm">moves</span>[<span class="nm">left</span>])
            <span class="nm">left</span> += <span class="nb">1</span>
        <span class="nm">window</span>.<span class="fn">add</span>(<span class="nm">moves</span>[<span class="nm">right</span>])
        <span class="nm">best</span> = <span class="fn">max</span>(<span class="nm">best</span>, <span class="nm">right</span> - <span class="nm">left</span> + <span class="nb">1</span>)
    <span class="kw">return</span> <span class="nm">best</span>

<span class="nm">log</span> = [<span class="st">"Tackle"</span>,<span class="st">"Ember"</span>,<span class="st">"Growl"</span>,<span class="st">"Ember"</span>,<span class="st">"Thunder"</span>]
<span class="fn">print</span>(<span class="fn">longest_streak</span>(<span class="nm">log</span>))  <span class="cm"># 4</span>`,
    output: '4', time: 'O(n)', space: 'O(n)',
    editor: { code: `def longest_streak(moves):
    window = []
    left = 0
    best = 0
    for right in range(len(moves)):
        while moves[right] in window:
            window.remove(moves[left])
            left = left + 1
        window.append(moves[right])
        size = right - left + 1
        if size > best:
            best = size
    return best

log = ["Tackle", "Ember", "Growl", "Ember", "Thunder", "Quick Attack"]
print(longest_streak(log))` }
  },
  lc_maxsub: {
    title: "Max Subarray (Kadane's)", diff: 'Medium', num: 53,
    pokemon: "Ash's best battle score run",
    story: 'Each turn Ash gains or loses points. Find the run of consecutive turns with the highest total.',
    approach: "Kadane's: track running sum. If it goes negative, reset to 0 (start fresh). Track global max.",
    steps: [
      { title: 'Initialize trackers', body: '<code>current = 0, best = -infinity</code>' },
      { title: 'Add current score', body: '<code>current += score</code>' },
      { title: 'Update global best', body: '<code>best = max(best, current)</code>' },
      { title: 'Reset if negative', body: 'If <code>current < 0</code>: <code>current = 0</code>' },
    ],
    code: `<span class="kw">def</span> <span class="fn">best_run</span>(<span class="nm">scores</span>):
    <span class="nm">current</span> = <span class="nb">0</span>
    <span class="nm">best</span> = <span class="fn">float</span>(<span class="st">'-inf'</span>)
    <span class="kw">for</span> <span class="nm">s</span> <span class="kw">in</span> <span class="nm">scores</span>:
        <span class="nm">current</span> += <span class="nm">s</span>
        <span class="nm">best</span> = <span class="fn">max</span>(<span class="nm">best</span>, <span class="nm">current</span>)
        <span class="kw">if</span> <span class="nm">current</span> < <span class="nb">0</span>:
            <span class="nm">current</span> = <span class="nb">0</span>
    <span class="kw">return</span> <span class="nm">best</span>

<span class="nm">turns</span> = [<span class="nb">-2</span>, <span class="nb">10</span>, <span class="nb">-3</span>, <span class="nb">4</span>, <span class="nb">-1</span>, <span class="nb">2</span>, <span class="nb">1</span>, <span class="nb">-5</span>, <span class="nb">4</span>]
<span class="fn">print</span>(<span class="fn">best_run</span>(<span class="nm">turns</span>))  <span class="cm"># 13</span>`,
    output: '13', time: 'O(n)', space: 'O(1)',
    editor: { code: `def best_run(scores):
    current = 0
    best = scores[0]
    for s in scores:
        current = current + s
        if current > best:
            best = current
        if current < 0:
            current = 0
    return best

turns = [-2, 10, -3, 4, -1, 2, 1, -5, 4]
print(best_run(turns))` }
  },
  lc_stairs: {
    title: 'Climbing Stairs', diff: 'Easy', num: 70,
    pokemon: 'Paths up Victory Road (1 or 2 steps)',
    story: 'Victory Road has n steps. Ash can take 1 or 2 at a time. How many distinct paths reach the top?',
    approach: 'DP (Fibonacci): ways(n) = ways(n-1) + ways(n-2). Use two variables instead of an array.',
    steps: [
      { title: 'Base cases', body: 'n=1 → 1 way. n=2 → 2 ways.' },
      { title: 'Two rolling variables', body: '<code>prev=1, curr=2</code>' },
      { title: 'Iterate from 3 to n', body: '<code>prev, curr = curr, prev + curr</code>' },
      { title: 'Return curr', body: 'After the loop, <code>curr</code> holds the answer.' },
    ],
    code: `<span class="kw">def</span> <span class="fn">climb</span>(<span class="nm">n</span>):
    <span class="kw">if</span> <span class="nm">n</span> <= <span class="nb">2</span>: <span class="kw">return</span> <span class="nm">n</span>
    <span class="nm">prev</span>, <span class="nm">curr</span> = <span class="nb">1</span>, <span class="nb">2</span>
    <span class="kw">for</span> <span class="nm">_</span> <span class="kw">in</span> <span class="fn">range</span>(<span class="nb">3</span>, <span class="nm">n</span> + <span class="nb">1</span>):
        <span class="nm">prev</span>, <span class="nm">curr</span> = <span class="nm">curr</span>, <span class="nm">prev</span> + <span class="nm">curr</span>
    <span class="kw">return</span> <span class="nm">curr</span>

<span class="kw">for</span> <span class="nm">n</span> <span class="kw">in</span> [<span class="nb">1</span>,<span class="nb">2</span>,<span class="nb">3</span>,<span class="nb">5</span>,<span class="nb">10</span>]:
    <span class="fn">print</span>(<span class="st">f"<span class="nb">{n}</span> steps → <span class="nb">{climb(n)}</span> paths"</span>)`,
    output: '1 steps → 1 paths\n2 steps → 2 paths\n3 steps → 3 paths\n5 steps → 8 paths\n10 steps → 89 paths',
    time: 'O(n)', space: 'O(1)',
    editor: { code: `def climb(n):
    if n <= 2:
        return n
    prev = 1
    curr = 2
    for i in range(3, n + 1):
        temp = curr
        curr = prev + curr
        prev = temp
    return curr

for n in [1, 2, 3, 5, 10]:
    print(n, "steps ->", climb(n), "paths")` }
  },
  lc_binsearch: {
    title: 'Binary Search', diff: 'Easy', num: 704,
    pokemon: 'Finding a Pokémon in a sorted Pokédex',
    story: 'The Pokédex is sorted by number. Use binary search to find Pokémon #X in at most log₂(n) checks.',
    approach: 'Halve the search space each step: compare middle element to target, eliminate the half that cannot contain it.',
    steps: [
      { title: 'Set boundaries', body: '<code>left=0, right=len(dex)-1</code>' },
      { title: 'Compute mid', body: '<code>mid = (left + right) // 2</code>' },
      { title: 'Compare and narrow', body: 'Found → return mid. Too small → left=mid+1. Too big → right=mid-1.' },
      { title: 'Not found', body: 'If <code>left > right</code>, return -1.' },
    ],
    code: `<span class="kw">def</span> <span class="fn">find_pokemon</span>(<span class="nm">ids</span>, <span class="nm">target</span>):
    <span class="nm">left</span>, <span class="nm">right</span> = <span class="nb">0</span>, <span class="fn">len</span>(<span class="nm">ids</span>) - <span class="nb">1</span>
    <span class="kw">while</span> <span class="nm">left</span> <= <span class="nm">right</span>:
        <span class="nm">mid</span> = (<span class="nm">left</span> + <span class="nm">right</span>) // <span class="nb">2</span>
        <span class="kw">if</span>   <span class="nm">ids</span>[<span class="nm">mid</span>] == <span class="nm">target</span>: <span class="kw">return</span> <span class="nm">mid</span>
        <span class="kw">elif</span> <span class="nm">ids</span>[<span class="nm">mid</span>] < <span class="nm">target</span>:  <span class="nm">left</span>  = <span class="nm">mid</span> + <span class="nb">1</span>
        <span class="kw">else</span>:                      <span class="nm">right</span> = <span class="nm">mid</span> - <span class="nb">1</span>
    <span class="kw">return</span> <span class="nb">-1</span>

<span class="nm">ids</span> = [<span class="nb">1</span>,<span class="nb">4</span>,<span class="nb">7</span>,<span class="nb">25</span>,<span class="nb">39</span>,<span class="nb">94</span>,<span class="nb">131</span>,<span class="nb">150</span>]
<span class="fn">print</span>(<span class="fn">find_pokemon</span>(<span class="nm">ids</span>, <span class="nb">94</span>))   <span class="cm"># 5</span>
<span class="fn">print</span>(<span class="fn">find_pokemon</span>(<span class="nm">ids</span>, <span class="nb">99</span>))   <span class="cm"># -1</span>`,
    output: '5\n-1', time: 'O(log n)', space: 'O(1)',
    editor: { code: `def find_pokemon(ids, target):
    left = 0
    right = len(ids) - 1
    while left <= right:
        mid = (left + right) // 2
        if ids[mid] == target:
            return mid
        elif ids[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

ids = [1, 4, 7, 25, 39, 94, 131, 150]
print(find_pokemon(ids, 94))
print(find_pokemon(ids, 99))
print(find_pokemon(ids, 1))` }
  },
};

function renderLCPage(id) {
  const lc   = LC_DATA[id];
  const entry = CURRICULUM.find(c => c.id === id);
  const done  = STATE.completedLessons.has(id);
  const idx   = CURRICULUM.findIndex(c => c.id === id);

  return `
    <div class="lc-detail-page">
      <div class="lesson-topbar">
        <span class="lesson-badge">LeetCode Track</span>
        <span class="diff-badge ${lc.diff.toLowerCase()}">${lc.diff}</span>
        <span class="lesson-num">#${lc.num}</span>
        ${done ? '<span style="color:var(--green);font-size:0.85rem;font-weight:700">✓ Completed</span>' : ''}
      </div>
      <h1 class="lesson-title">${entry.icon} ${lc.title}</h1>
      <p class="lesson-subtitle">🎮 ${lc.pokemon}</p>

      <div class="concept-block">
        <h4>The Problem</h4>
        <p>${lc.story}</p>
      </div>

      <div class="concept-block">
        <h4>Approach</h4>
        <p>${lc.approach}</p>
      </div>

      <div class="concept-block">
        <h4>Step-by-Step</h4>
        <div class="steps">
          ${lc.steps.map((s, i) => `
            <div class="step">
              <div class="step-num">${i+1}</div>
              <div class="step-body"><h5>${s.title}</h5><p>${s.body}</p></div>
            </div>`).join('')}
        </div>
      </div>

      <div class="concept-block">
        <h4>Solution</h4>
        <div class="code-wrapper"><pre><code>${lc.code}</code></pre></div>
        <div class="output-box"><div class="output-label">Output</div>${lc.output.replace(/\n/g,'<br/>')}</div>
      </div>

      <div class="complexity-row">
        <div class="complexity-badge">Time: <span>${lc.time}</span></div>
        <div class="complexity-badge">Space: <span>${lc.space}</span></div>
      </div>

      ${renderEditor(id, lc.editor)}

      <div class="quiz-cta">
        <div class="quiz-cta-icon">⚔️</div>
        <div>
          <h4>Mark as complete</h4>
          <p>Understood the approach? Mark this problem complete and earn XP.</p>
        </div>
        <button class="quiz-start-btn" onclick="completeLCLesson('${id}')">
          ${done ? '✓ Completed' : 'Complete +' + XP_PER_LESSON + ' XP →'}
        </button>
      </div>
    </div>`;
}

function completeLCLesson(id) {
  markLessonComplete(id);
  showCompleteBanner(id);
  // re-render to show completed state
  setTimeout(() => openLesson(id), 100);
}

// ── INIT ─────────────────────────────────────────────────────
loadState();

if (STATE.trainerName !== 'Trainer' && STATE.completedLessons.size >= 0) {
  // returning user — pre-fill name
  document.getElementById('trainer-name-input').value = STATE.trainerName;
}

// Enter key on name input
document.getElementById('trainer-name-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') startBootcamp();
});

// Close modals on overlay click
document.getElementById('quiz-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('quiz-overlay')) {
    // don't close mid-quiz accidentally
  }
});
document.getElementById('trainer-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('trainer-overlay')) closeTrainer();
});
