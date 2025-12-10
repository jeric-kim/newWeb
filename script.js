const STORAGE_KEYS = {
  USER: 'community_user',
  POSTS: 'community_posts'
};

const loginForm = document.querySelector('#login-form');
const loginMeta = document.querySelector('#login-meta');
const postForm = document.querySelector('#post-form');
const postsContainer = document.querySelector('#posts');
const myPostsContainer = document.querySelector('#my-posts');
const fortuneForm = document.querySelector('#fortune-form');
const fortuneResult = document.querySelector('#fortune-result');
const fortuneShareRow = document.querySelector('#fortune-share-row');
const copyFortuneBtn = document.querySelector('#copy-fortune');
const shareFortuneBtn = document.querySelector('#share-fortune');
const newPostBtn = document.querySelector('#new-post-btn');
const cancelEditBtn = document.querySelector('#cancel-edit');
const boardFilter = document.querySelector('#board-filter');
const logoutBtn = document.querySelector('#logout-btn');
const deleteAccountBtn = document.querySelector('#delete-account-btn');

let currentUser = loadUser();
let posts = loadPosts();
let fortuneText = '';

renderLoginMeta();
renderPosts();
renderMyPosts();

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickname = document.querySelector('#nickname').value.trim();
  const email = document.querySelector('#email').value.trim();
  const avatar = document.querySelector('#avatar').value.trim();
  const consent = document.querySelector('#consent').value;

  if (!nickname || !email) return;
  currentUser = { nickname, email, avatar, consent: consent === 'true' };
  saveUser(currentUser);
  renderLoginMeta();
  renderMyPosts();
  alert('로그인/가입이 완료되었습니다.');
});

newPostBtn.addEventListener('click', () => {
  postForm.classList.remove('hidden');
  postForm.scrollIntoView({ behavior: 'smooth' });
});

cancelEditBtn.addEventListener('click', resetPostForm);

postForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentUser) {
    alert('로그인 후 작성할 수 있습니다.');
    return;
  }
  const id = document.querySelector('#post-id').value;
  const board = document.querySelector('#post-board').value;
  const title = document.querySelector('#post-title').value.trim();
  const body = document.querySelector('#post-body').value.trim();
  const fileInput = document.querySelector('#post-attachment');
  const attachment = fileInput.files[0]?.name || '';
  const commentsAllowed = document.querySelector('#post-comments').value === 'true';

  if (!title || !body) return;

  if (id) {
    posts = posts.map((p) => (p.id === id ? { ...p, board, title, body, attachment, commentsAllowed } : p));
  } else {
    posts.push({
      id: crypto.randomUUID(),
      board,
      title,
      body,
      attachment,
      commentsAllowed,
      author: currentUser.nickname,
      createdAt: new Date().toISOString()
    });
  }

  savePosts(posts);
  renderPosts();
  renderMyPosts();
  resetPostForm();
});

boardFilter.addEventListener('change', renderPosts);

fortuneForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const birthdate = document.querySelector('#birthdate').value;
  const zodiac = document.querySelector('#zodiac').value || calculateZodiac(birthdate);
  if (!birthdate) return;
  fortuneText = buildFortune(birthdate, zodiac);
  fortuneResult.textContent = fortuneText;
  fortuneShareRow.classList.remove('hidden');
});

copyFortuneBtn.addEventListener('click', async () => {
  if (!fortuneText) return;
  await navigator.clipboard.writeText(fortuneText);
  alert('운세 결과가 복사되었습니다.');
});

shareFortuneBtn.addEventListener('click', async () => {
  if (!fortuneText) return;
  if (navigator.share) {
    await navigator.share({ title: '오늘의 운세', text: fortuneText });
  } else {
    alert('기기 공유 모달을 사용할 수 없어 복사로 대체합니다.');
    await navigator.clipboard.writeText(fortuneText);
  }
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  saveUser(null);
  renderLoginMeta();
  renderMyPosts();
  alert('로그아웃되었습니다.');
});

deleteAccountBtn.addEventListener('click', () => {
  if (!confirm('정말 탈퇴하시겠습니까? 저장된 데이터가 모두 삭제됩니다.')) return;
  currentUser = null;
  posts = [];
  saveUser(null);
  savePosts(posts);
  renderPosts();
  renderMyPosts();
  renderLoginMeta();
});

function loadUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

function saveUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
  return raw ? JSON.parse(raw) : [];
}

function savePosts(list) {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(list));
}

function renderLoginMeta() {
  if (!currentUser) {
    loginMeta.innerHTML = '<strong>비회원</strong> - 로그인하면 게시물 작성과 마이페이지 기능을 사용할 수 있습니다.';
    return;
  }
  const xml = `<?xml version="1.0"?><user><nickname>${currentUser.nickname}</nickname><email>${currentUser.email}</email><avatar>${currentUser.avatar || ''}</avatar><consent>${currentUser.consent}</consent></user>`;
  loginMeta.innerHTML = `
    <div><strong>${currentUser.nickname}</strong> (${currentUser.email})</div>
    <div class="text-small muted">XML 저장 예시</div>
    <pre class="text-small">${escapeHtml(xml)}</pre>
  `;
}

function renderPosts() {
  postsContainer.innerHTML = '';
  const filter = boardFilter.value;
  const list = filter === 'all' ? posts : posts.filter((p) => p.board === filter);
  if (!list.length) {
    postsContainer.innerHTML = '<p class="muted">작성된 글이 없습니다.</p>';
    return;
  }

  const template = document.querySelector('#post-template');
  list
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((post) => {
      const node = template.content.cloneNode(true);
      node.querySelector('[data-board]').textContent = post.board === 'free' ? '자유게시판' : '생활 TIP';
      node.querySelector('[data-author]').textContent = post.author;
      node.querySelector('[data-date]').textContent = new Date(post.createdAt).toLocaleString('ko-KR');
      node.querySelector('[data-title]').textContent = post.title;
      node.querySelector('[data-body]').textContent = post.body;
      node.querySelector('[data-attachment]').textContent = post.attachment ? `첨부: ${post.attachment}` : '첨부 없음';
      node.querySelector('[data-comment-status]').textContent = post.commentsAllowed ? '댓글 허용' : '댓글 비허용';
      node.querySelector('[data-comment-box]').classList.toggle('hidden', !post.commentsAllowed);

      const editBtn = node.querySelector('[data-edit]');
      const deleteBtn = node.querySelector('[data-delete]');

      editBtn.addEventListener('click', () => startEdit(post));
      deleteBtn.addEventListener('click', () => deletePost(post.id));

      postsContainer.appendChild(node);
    });
}

function renderMyPosts() {
  myPostsContainer.innerHTML = '';
  if (!currentUser) {
    myPostsContainer.innerHTML = '<p class="muted">로그인 후 내가 쓴 글을 확인할 수 있습니다.</p>';
    return;
  }
  const mine = posts.filter((p) => p.author === currentUser.nickname);
  if (!mine.length) {
    myPostsContainer.innerHTML = '<p class="muted">작성한 글이 없습니다.</p>';
    return;
  }
  const template = document.querySelector('#post-template');
  mine.forEach((post) => {
    const node = template.content.cloneNode(true);
    node.querySelector('[data-board]').textContent = post.board === 'free' ? '자유게시판' : '생활 TIP';
    node.querySelector('[data-author]').textContent = post.author;
    node.querySelector('[data-date]').textContent = new Date(post.createdAt).toLocaleDateString('ko-KR');
    node.querySelector('[data-title]').textContent = post.title;
    node.querySelector('[data-body]').textContent = post.body;
    node.querySelector('[data-attachment]').textContent = post.attachment ? `첨부: ${post.attachment}` : '첨부 없음';
    node.querySelector('[data-comment-status]').textContent = post.commentsAllowed ? '댓글 허용' : '댓글 비허용';
    node.querySelector('[data-comment-box]').classList.toggle('hidden', true);
    node.querySelector('.post-actions').remove();
    myPostsContainer.appendChild(node);
  });
}

function startEdit(post) {
  if (!currentUser || currentUser.nickname !== post.author) {
    alert('본인이 작성한 게시물만 수정할 수 있습니다.');
    return;
  }
  postForm.classList.remove('hidden');
  document.querySelector('#post-id').value = post.id;
  document.querySelector('#post-board').value = post.board;
  document.querySelector('#post-title').value = post.title;
  document.querySelector('#post-body').value = post.body;
  document.querySelector('#post-comments').value = post.commentsAllowed.toString();
  postForm.scrollIntoView({ behavior: 'smooth' });
}

function deletePost(id) {
  const target = posts.find((p) => p.id === id);
  if (!currentUser || !target || currentUser.nickname !== target.author) {
    alert('본인이 작성한 게시물만 삭제할 수 있습니다.');
    return;
  }
  if (!confirm('정말 삭제하시겠습니까?')) return;
  posts = posts.filter((p) => p.id !== id);
  savePosts(posts);
  renderPosts();
  renderMyPosts();
}

function resetPostForm() {
  postForm.reset();
  document.querySelector('#post-id').value = '';
  postForm.classList.add('hidden');
}

function calculateZodiac(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const pairs = [
    ['capricorn', 19],
    ['aquarius', 18],
    ['pisces', 20],
    ['aries', 19],
    ['taurus', 20],
    ['gemini', 20],
    ['cancer', 22],
    ['leo', 22],
    ['virgo', 22],
    ['libra', 22],
    ['scorpio', 21],
    ['sagittarius', 21]
  ];
  const index = month - 1;
  const [sign, endDay] = pairs[index];
  if (month === 1 && day <= 19) return 'capricorn';
  return day <= endDay ? sign : pairs[(index + 1) % 12][0];
}

function buildFortune(birthdate, zodiac) {
  const templates = [
    '오늘은 새로운 사람과의 만남이 행운을 가져옵니다.',
    '집중력이 높아지는 날! 미뤄둔 일을 끝내보세요.',
    '가벼운 산책이나 스트레칭으로 기분을 전환해보세요.',
    '주변의 작은 도움을 받으면 일이 술술 풀립니다.',
    '지갑 조심! 지출을 한 번 더 확인하세요.',
    '가족이나 친구에게 연락을 해보면 좋은 일이 생깁니다.'
  ];
  const index = (new Date(birthdate).getDate() + zodiac.length) % templates.length;
  return `${formatZodiac(zodiac)} ${templates[index]}`;
}

function formatZodiac(zodiac) {
  const map = {
    aries: '양자리',
    taurus: '황소자리',
    gemini: '쌍둥이자리',
    cancer: '게자리',
    leo: '사자자리',
    virgo: '처녀자리',
    libra: '천칭자리',
    scorpio: '전갈자리',
    sagittarius: '사수자리',
    capricorn: '염소자리',
    aquarius: '물병자리',
    pisces: '물고기자리'
  };
  return map[zodiac] || '맞춤 운세';
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
