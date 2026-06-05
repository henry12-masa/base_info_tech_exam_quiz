const params = new URLSearchParams(location.search);
const type = params.get("type") || "technology";

const quizInfo = {
  technology: {
    title: "テクノロジ系",
    desc: "基礎理論・アルゴリズム・ハードウェア・ソフトウェア"
  },
  management: {
    title: "マネジメント系",
    desc: "プロジェクト・サービス・システム監査"
  },
  strategy: {
    title: "ストラテジ系",
    desc: "経営戦略・企業活動・法務"
  },
  security: {
    title: "情報セキュリティ",
    desc: "暗号・認証・攻撃対策・リスク管理"
  },
  database: {
    title: "データベース",
    desc: "SQL・正規化・トランザクション"
  },
  network: {
    title: "ネットワーク",
    desc: "TCP/IP・DNS・HTTP・LAN"
  },
  algorithm: {
    title: "アルゴリズム",
    desc: "探索・整列・計算量・疑似言語"
  },
  practice: {
    title: "総合演習",
    desc: "基本情報技術者試験の総合問題"
  }
};

const info = quizInfo[type] || quizInfo.technology;

document.title = info.title;
document.getElementById("pageTitle").textContent = info.title;
document.getElementById("pageDesc").textContent = info.desc;

const quizList = document.getElementById("quizList");

quizList.innerHTML = Object.keys(quizInfo).map(key => `
  <a href="?type=${key}" class="${key === type ? "active" : ""}">
    ${quizInfo[key].title}
  </a>
`).join("");

function normalizeQuestion(q) {
  return {
    question: q.question || q.q,
    choices: q.choices || q.c,
    answer: q.answer || q.a,
    explanation: q.explanation || q.e || ""
  };
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const rawQuestions = window.quizData[type] || window.quizData.technology || [];
let questions = shuffle(rawQuestions.map(normalizeQuestion)).slice(0, 50);

let current = 0;
let score = 0;
let answered = false;

const counter = document.getElementById("counter");
const scoreEl = document.getElementById("score");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const progressBar = document.getElementById("progressBar");

function showQuestion() {
  if (questions.length === 0) {
    counter.textContent = "0 / 0";
    questionEl.textContent = "問題データが読み込めません";
    choicesEl.innerHTML = "";
    resultEl.textContent = `window.quizData.${type} がありません`;
    return;
  }

  if (current >= questions.length) {
    finishQuiz();
    return;
  }

  answered = false;
  const q = questions[current];

  counter.textContent = `${current + 1} / ${questions.length}`;
  scoreEl.textContent = `スコア: ${score}`;
  questionEl.textContent = q.question;
  resultEl.textContent = "";
  progressBar.style.width = `${(current / questions.length) * 100}%`;

  choicesEl.innerHTML = "";

  shuffle(q.choices).forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice;
    button.onclick = () => checkAnswer(button, choice);
    choicesEl.appendChild(button);
  });
}

function checkAnswer(button, choice) {
  if (answered) return;
  answered = true;

  const q = questions[current];

  document.querySelectorAll("#choices button").forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === q.answer) {
      btn.classList.add("correct");
    }
  });

  if (choice === q.answer) {
    score++;
    button.classList.add("correct");
    resultEl.textContent = q.explanation ? `正解！ ${q.explanation}` : "正解！";
  } else {
    button.classList.add("wrong");
    resultEl.textContent = q.explanation
      ? `不正解！ 正解は「${q.answer}」 ${q.explanation}`
      : `不正解！ 正解は「${q.answer}」`;
  }

  scoreEl.textContent = `スコア: ${score}`;

  setTimeout(() => {
    current++;
    showQuestion();
  }, 1700);
}

function finishQuiz() {
  counter.textContent = "終了";
  progressBar.style.width = "100%";
  questionEl.textContent = "結果発表";

  choicesEl.innerHTML = `
    <div class="finish">
      <p>${questions.length}問中 ${score}問正解！</p>
      <button onclick="location.reload()">もう一度挑戦</button>
      <a class="home-btn" href="./">ジャンル選択へ戻る</a>
    </div>
  `;

  resultEl.textContent = "";
}

showQuestion();