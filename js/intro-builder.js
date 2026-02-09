/* === 이에요/예요 Sentence Builder === */

(async () => {
  const data = await App.loadVocab();
  const intro = data.intro;

  /* --- State --- */
  let topicIdx = 0;
  let nounIdx = 0;

  /* --- DOM --- */
  const topicBlock = document.getElementById('block-topic');
  const nounBlock = document.getElementById('block-noun');
  const sentenceEl = document.getElementById('full-sentence');
  const translationEl = document.getElementById('translation');
  const ttsBtn = document.getElementById('tts-btn');

  /* --- Particle helper --- */
  function getParticle(word) {
    return App.hasJongseong(word[word.length - 1]) ? '이에요' : '예요';
  }

  /* --- Render --- */
  function render() {
    const topic = intro.topics[topicIdx];
    const noun = intro.nouns[nounIdx];

    // Topic block
    topicBlock.querySelector('.block-kr').textContent = topic.kr;
    topicBlock.querySelector('.block-rom').textContent = topic.rom;
    topicBlock.querySelector('.block-en').textContent = topic.en;

    // Noun block — show noun + particle
    const particle = getParticle(noun.kr);
    nounBlock.querySelector('.block-kr').textContent = noun.kr + particle;
    nounBlock.querySelector('.block-rom').textContent = noun.rom;
    nounBlock.querySelector('.block-en').textContent = noun.en;

    // Full sentence
    const fullKr = topic.kr + ' ' + noun.kr + particle + '.';
    sentenceEl.textContent = fullKr;

    // Translation
    const topicEn = topic.en.replace(' (topic)', '');
    translationEl.textContent = buildEnglish(topicEn, noun.en, particle);
  }

  function buildEnglish(topicEn, nounEn, particle) {
    if (topicEn === 'I') return 'I am ' + addArticle(nounEn) + '.';
    if (topicEn === 'This place') return 'This place is ' + addArticle(nounEn) + '.';
    if (topicEn === 'This thing') return 'This is ' + nounEn + '.';
    if (topicEn === 'My name') return 'My name is Clayton.';
    return topicEn + ' is ' + nounEn + '.';
  }

  function addArticle(en) {
    const lower = en.toLowerCase();
    // Don't add article to proper nouns or already has article
    if (/^(a |an |the |my )/.test(lower)) return en;
    if (/person$/.test(lower)) return 'a ' + en;
    if (/^[aeiou]/i.test(en)) return 'an ' + en;
    return 'a ' + en;
  }

  /* --- Block click handlers --- */
  topicBlock.addEventListener('click', () => {
    topicIdx = (topicIdx + 1) % intro.topics.length;
    App.pulseBlock(topicBlock);
    App.speak(intro.topics[topicIdx].kr);
    render();
  });

  nounBlock.addEventListener('click', () => {
    nounIdx = (nounIdx + 1) % intro.nouns.length;
    App.pulseBlock(nounBlock);
    App.speak(intro.nouns[nounIdx].kr);
    render();
  });

  /* --- TTS for full sentence --- */
  ttsBtn.addEventListener('click', () => {
    const topic = intro.topics[topicIdx];
    const noun = intro.nouns[nounIdx];
    const particle = getParticle(noun.kr);
    App.speak(topic.kr + ' ' + noun.kr + particle);
  });

  /* --- Block colors (reuse subject for topic, object for noun) --- */
  topicBlock.style.background = 'var(--block-subject)';
  topicBlock.style.color = '#fff';
  nounBlock.style.background = 'var(--block-verb)';
  nounBlock.style.color = '#fff';

  /* --- Initial render --- */
  render();
})();
