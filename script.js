// 커뮤니티 관련 요소는 비활성화(주석 처리)하여 운세 기능만 동작하도록 유지합니다.
// const STORAGE_KEYS = { USER: 'community_user', POSTS: 'community_posts' };

// const loginForm = document.querySelector('#login-form');
// const loginMeta = document.querySelector('#login-meta');
// const postForm = document.querySelector('#post-form');
// const postsContainer = document.querySelector('#posts');
// const myPostsContainer = document.querySelector('#my-posts');
const fortuneForm = document.querySelector('#fortune-form');
const fortuneTypeSelect = document.querySelector('#fortune-type');
const fortuneResult = document.querySelector('#fortune-result');
const fortuneShareRow = document.querySelector('#fortune-share-row');
const copyFortuneBtn = document.querySelector('#copy-fortune');
const shareFortuneBtn = document.querySelector('#share-fortune');
const birthYearSelect = document.querySelector('#birth-year');
const birthMonthSelect = document.querySelector('#birth-month');
const birthDaySelect = document.querySelector('#birth-day');
// const newPostBtn = document.querySelector('#new-post-btn');
// const cancelEditBtn = document.querySelector('#cancel-edit');
// const boardFilter = document.querySelector('#board-filter');
// const logoutBtn = document.querySelector('#logout-btn');
// const deleteAccountBtn = document.querySelector('#delete-account-btn');

// let currentUser = loadUser();
// let posts = loadPosts();
let fortuneText = '';

populateBirthSelects();

const NEW_YEAR_2026_FORTUNE = {
  rat: {
    총운: '그동안 준비한 일들이 드러나는 해. 작은 성과라도 꾸준히 쌓아가면 하반기부터 인정이 따른다.',
    직업_사업: '팀 플레이가 길을 연다. 협업 제안을 적극 수용하고, 계약서는 꼼꼼히 검토할 것.',
    재물: '투자보다는 현금흐름 관리에 집중. 반복 지출을 줄이면 여유 자금이 생긴다.',
    연애_가족: '소소한 데이트나 가족 모임이 정답. 대화 주도권을 쥐기보다 경청이 유리.',
    건강: '수면 리듬 관리가 핵심. 목·어깨 스트레칭 루틴을 만들면 컨디션이 올라간다.'
  },
  ox: {
    총운: '꾸준함이 빛나는 해. 주변에서 든든한 조력자를 만날 수 있다.',
    직업_사업: '기존 포지션을 지키며 역량을 깊이 파는 전략이 좋다. 교육·자격증 투자도 효율적.',
    재물: '장기 저축과 연금, 분산투자로 안정성을 확보. 충동구매만 피하면 순항.',
    연애_가족: '솔직한 피드백이 관계를 단단하게 한다. 일정 공유로 갈등을 줄일 것.',
    건강: '허리·관절 주의. 가벼운 근력 운동과 걷기 병행으로 체력을 끌어올리자.'
  },
  tiger: {
    총운: '도전 운이 강하다. 새로운 역할 제안이 온다면 한 번쯤 시도할 만하다.',
    직업_사업: '리더십이 요구되는 프로젝트가 들어온다. 단, 일정 관리와 리스크 체크는 필수.',
    재물: '큰돈보다는 빠른 회전의 사이드잡이 유리. 계약 시 수익 배분 구조를 명확히.',
    연애_가족: '직설적 표현이 상처가 될 수 있으니 완곡한 표현을 연습하자.',
    건강: '과로로 인한 면역 저하 주의. 단백질·수분 섭취를 챙기고 과음은 삼가자.'
  },
  rabbit: {
    총운: '휴식과 재정비의 해. 환경을 정돈하면 새 기회가 자연스럽게 찾아온다.',
    직업_사업: '작은 개선 아이디어가 높은 평가를 받는다. 자동화나 효율화에 주목.',
    재물: '지출 구조를 재정리할 때. 구독·멤버십을 정리하면 체감 효율이 크다.',
    연애_가족: '배려형 커뮤니케이션이 강점. 단, 감정 숨기기는 오해를 낳을 수 있다.',
    건강: '소화기 관리가 필요. 규칙적 식사와 가벼운 유산소를 유지하자.'
  },
  dragon: {
    총운: '확장 운이 강하다. 스케일업이나 해외, 새로운 시장 탐색이 길을 연다.',
    직업_사업: '결단력 있는 선택이 성장의 기회. 단, 재무 리스크는 보수적으로 관리.',
    재물: '수익과 지출 변동폭이 크다. 중간 점검 일정을 만들어야 손실을 막는다.',
    연애_가족: '카리스마가 돋보이지만, 상대의 페이스를 존중하면 관계가 깊어진다.',
    건강: '심박 관리와 호흡 운동이 도움. 일정한 루틴으로 컨디션을 안정화하자.'
  },
  snake: {
    총운: '분석과 준비가 통한다. 차분히 정보를 모아 움직이면 실수가 적다.',
    직업_사업: '기획·데이터·법무 영역에서 두각. 보고서나 문서 품질을 높이면 신뢰도가 상승.',
    재물: '안정적 자산을 선호하라. 금·적금처럼 보수적 상품이 방어력을 준다.',
    연애_가족: '섬세한 배려가 매력. 다만 답장을 미루면 오해가 쌓이니 빠른 응답을.',
    건강: '목·눈 피로 관리. 스크린 타임을 줄이고 스트레칭 알람을 활용하자.'
  },
  horse: {
    총운: '에너지와 추진력이 강해지는 해. 이동·이직 운도 열린다.',
    직업_사업: '신속한 실행으로 앞서갈 수 있다. 단, 문서와 백업을 남겨 리스크를 줄이자.',
    재물: '수입 증대 기회가 있지만 지출도 커지기 쉬움. 예산 한도를 명확히.',
    연애_가족: '직설적 호감 표현이 통하지만, 상대 속도를 배려하면 안정적.',
    건강: '근골격 부상 주의. 준비운동과 정리 스트레칭을 습관화하자.'
  },
  goat: {
    총운: '관계 확장과 협업이 행운을 부른다. 커뮤니티 활동이 길을 열어준다.',
    직업_사업: '조율자 역할이 부각. 이해관계 조정에 강점을 살려보자.',
    재물: '소액 투자는 분산, 큰 지출은 공동 의사결정으로 리스크 분담.',
    연애_가족: '따뜻한 공감이 신뢰를 만든다. 일정한 루틴의 연락이 포인트.',
    건강: '불규칙 수면과 당 섭취를 조절. 야식 대신 미지근한 차가 도움.'
  },
  monkey: {
    총운: '아이디어가 넘치는 해. 새로운 도구나 스킬을 배우면 시너지가 크다.',
    직업_사업: '실험적 프로젝트에 유리. 다만 우선순위를 명확히 정해 산만함을 막자.',
    재물: '지식·교육 분야 투자로 회수가 가능. 충동적 코인·주식 매수는 자제.',
    연애_가족: '유머와 센스로 호감 상승. 약속을 잊지 않도록 일정 관리 필요.',
    건강: '어깨·손목 부담을 관리. 자세 교정과 짧은 휴식 타이머를 활용하자.'
  },
  rooster: {
    총운: '정밀함이 인정받는 해. 꼼꼼한 검수와 마감 능력이 빛난다.',
    직업_사업: '품질·감리·QA 역할에 강세. 데이터 기반 보고가 신뢰를 더한다.',
    재물: '세금·보험 등 필수 비용을 정리하면 새는 돈을 막을 수 있다.',
    연애_가족: '섬세한 이벤트보다 꾸준한 성실함이 더 큰 감동을 준다.',
    건강: '위·소화 관리. 식사 속도를 늦추고 규칙적 식습관을 유지.'
  },
  dog: {
    총운: '신뢰와 의리가 보상받는다. 오래된 인연이 귀인으로 작용할 수 있다.',
    직업_사업: '지속 프로젝트 관리에 강점. 장기 플랜과 위험 대비책을 준비하자.',
    재물: '안정 자산 우위. 보험 재점검, 비상금 확충이 도움 된다.',
    연애_가족: '포근한 돌봄이 매력. 다만 지나친 걱정은 간섭으로 비칠 수 있으니 속도 조절.',
    건강: '규칙적 운동과 반려동물 산책이 기분 전환에 좋다. 호흡 운동 추천.'
  },
  pig: {
    총운: '정리와 새출발의 해. 쌓인 것을 비우면 기회가 들어온다.',
    직업_사업: '업무 프로세스를 단순화할 때 성과가 난다. 불필요한 회의·보고를 줄이자.',
    재물: '지출 구조 조정으로 즉시 효과. 생활비 예산을 명확히 세우면 저축이 늘어난다.',
    연애_가족: '따뜻한 위로가 힘을 준다. 솔직한 감정 표현이 관계를 깊게 만든다.',
    건강: '체중 관리와 순환 개선에 집중. 가벼운 유산소와 스트레칭 병행.'
  },
  default: {
    총운: '출생 정보를 기반으로 맞춤 운세를 준비했습니다. 정보를 다시 입력해 주세요.',
    직업_사업: '기본에 충실하면 안정적인 흐름을 만들 수 있습니다.',
    재물: '재무 점검과 지출 관리가 행운을 끌어옵니다.',
    연애_가족: '가까운 사람과의 대화가 큰 힘이 됩니다.',
    건강: '규칙적 생활과 수면 관리가 우선입니다.'
  }
};

const TOJEONG_BIJEOL = {
  rat: {
    상반기: '새 계획을 세우고 발판을 다질 시기. 작은 성공이 이어지니 흐름을 놓치지 말 것.',
    중반기: '기존 관계를 재정비하면 귀인이 나타난다. 서류·계약은 이중 확인 필요.',
    하반기: '지출이 늘 수 있으니 예산을 나눠 관리. 이동·이직 운이 열려 있다.',
    조언: '감정을 눌러두지 말고 대화를 통해 푸는 것이 길.'
  },
  ox: {
    상반기: '안정과 신뢰를 쌓는 구간. 맡은 일을 끝까지 책임지면 평가가 높다.',
    중반기: '학습·자격증 운이 좋다. 작게라도 자기계발을 시작해 보자.',
    하반기: '가족·동료와 협의하면 계획이 순조롭다. 금전은 보수적 운영.',
    조언: '규칙적 생활로 체력 저하를 막자.'
  },
  tiger: {
    상반기: '과감한 선택이 길을 연다. 다만 일정과 리스크를 병행 관리해야 한다.',
    중반기: '주변 조력자가 붙는다. 역할을 나눠 부담을 덜어라.',
    하반기: '성과 리뷰 시기. 지나친 확장보다는 정리와 최적화에 집중.',
    조언: '말 한마디가 성패를 가른다. 부드러운 표현을 연습할 것.'
  },
  rabbit: {
    상반기: '정돈과 휴식이 필요한 때. 환경을 정리하면 새 제안이 들어온다.',
    중반기: '소규모 협업에 행운. 효율화 아이디어로 주목받는다.',
    하반기: '인맥이 넓어지며 새로운 기회가 열린다. 단, 과로 주의.',
    조언: '소화기 건강을 챙기며 페이스를 일정하게 유지.'
  },
  dragon: {
    상반기: '기세가 오른다. 도전 과제를 맡아볼 만하다.',
    중반기: '계약·재무 검토에 신중해야 한다. 전문가 자문을 구하면 안정.',
    하반기: '확장보다 내실 다지기. 데이터와 지표를 확인하며 정리.',
    조언: '휴식 없는 질주는 독이 된다. 루틴 휴식 시간을 확보.'
  },
  snake: {
    상반기: '분석과 기획이 빛난다. 자료를 쌓아두면 하반기 활용 가능.',
    중반기: '법무·계약 관련 행운. 문서 품질이 신뢰를 높인다.',
    하반기: '조용히 성장하는 흐름. 느리지만 단단히 나아간다.',
    조언: '눈·목 피로 관리가 필수.'
  },
  horse: {
    상반기: '이동·출장·변경 운이 강하다. 새로운 환경이 자극이 된다.',
    중반기: '빠른 실행력이 성과를 만든다. 문서 정리와 백업을 병행.',
    하반기: '성과가 드러나는 시점. 과로하지 않도록 페이스 조절.',
    조언: '준비운동과 스트레칭으로 부상 예방.'
  },
  goat: {
    상반기: '협력과 조율에 강점. 커뮤니티 활동이 기회를 만든다.',
    중반기: '공동 투자·공동 프로젝트가 길. 의사소통을 투명하게.',
    하반기: '휴식과 재충전 필요. 내 사람과의 시간을 늘리자.',
    조언: '수면과 당 섭취 관리로 체력 유지.'
  },
  monkey: {
    상반기: '새로운 도구와 학습에 유리. 아이디어 노트를 쌓아보자.',
    중반기: '우선순위 관리가 핵심. 중요한 한두 개에 집중할 것.',
    하반기: '성과가 나오는 시기. 마감 품질을 챙기면 평가 상승.',
    조언: '손목·어깨 휴식 타이머를 두자.'
  },
  rooster: {
    상반기: '정밀함이 요구되는 과제에서 빛난다. 검수·QA에 강점.',
    중반기: '세무·보험 점검 운. 지출을 구조화하면 여유가 생긴다.',
    하반기: '꾸준함이 결실을 맺는다. 서두르지 말고 루틴을 유지.',
    조언: '위·소화 관리, 식사 속도를 늦출 것.'
  },
  dog: {
    상반기: '신뢰 기반 협업이 늘어난다. 장기 프로젝트를 안정적으로 운영.',
    중반기: '가족·지인과의 협력이 행운. 보수적 재무 운영이 좋다.',
    하반기: '평판이 오르는 시기. 과도한 걱정은 내려놓자.',
    조언: '호흡 운동과 규칙적 산책이 도움.'
  },
  pig: {
    상반기: '정리와 구조화에 강세. 불필요한 일을 걷어내자.',
    중반기: '지출을 줄이고 비상금을 늘릴 기회. 실속형 소비 추천.',
    하반기: '새 출발을 준비하기 좋다. 네트워킹을 통해 길이 열린다.',
    조언: '체중·순환 관리로 컨디션 회복.'
  },
  default: {
    상반기: '출생 정보를 입력하면 맞춤 토정비결을 제공합니다.',
    중반기: '계획과 점검을 병행해 균형을 맞추세요.',
    하반기: '무리한 확장보다 내실을 다질 때입니다.',
    조언: '생활 리듬을 안정적으로 유지하면 길합니다.'
  }
};

// renderLoginMeta();
// renderPosts();
// renderMyPosts();

// 로그인/게시판 관련 이벤트 리스너 비활성화
// loginForm.addEventListener('submit', ...);
// newPostBtn.addEventListener('click', ...);
// cancelEditBtn.addEventListener('click', ...);
// postForm.addEventListener('submit', ...);
// boardFilter.addEventListener('change', renderPosts);

fortuneForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const birthdate = buildBirthdate();
  const fortuneType = fortuneTypeSelect.value;
  const zodiac = document.querySelector('#zodiac').value || calculateZodiac(birthdate);
  if (!birthdate) {
    alert('생년월일을 모두 선택해 주세요.');
    return;
  }
  if (Number.isNaN(new Date(birthdate).getTime())) {
    alert('유효한 생년월일을 선택해 주세요.');
    return;
  }
  const fortunePayload = buildFortune(birthdate, zodiac, fortuneType);
  fortuneText = fortunePayload.shareText;
  renderFortuneResult(fortunePayload);
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

// logoutBtn.addEventListener('click', ...);
// deleteAccountBtn.addEventListener('click', ...);

// function loadUser() {...}
// function saveUser(user) {...}
// function loadPosts() {...}
// function savePosts(list) {...}
// function renderLoginMeta() {...}
// function renderPosts() {...}
// function renderMyPosts() {...}
// function startEdit(post) {...}
// function deletePost(id) {...}
// function resetPostForm() {...}

function populateBirthSelects() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 90 }, (_, i) => currentYear - i); // 최근 연도부터 90년 범위
  years.forEach((year) => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = `${year}년`;
    birthYearSelect.appendChild(option);
  });

  for (let m = 1; m <= 12; m++) {
    const option = document.createElement('option');
    option.value = m;
    option.textContent = `${m}월`;
    birthMonthSelect.appendChild(option);
  }

  birthYearSelect.addEventListener('change', updateDays);
  birthMonthSelect.addEventListener('change', updateDays);
}

function updateDays() {
  birthDaySelect.innerHTML = '<option value="">일</option>';
  const year = parseInt(birthYearSelect.value, 10);
  const month = parseInt(birthMonthSelect.value, 10);
  if (!year || !month) return;
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = `${d}일`;
    birthDaySelect.appendChild(option);
  }
}

function buildBirthdate() {
  const year = birthYearSelect.value;
  const month = birthMonthSelect.value;
  const day = birthDaySelect.value;
  if (!year || !month || !day) return '';
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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

function calculateChineseZodiac(year) {
  const animals = ['monkey', 'rooster', 'dog', 'pig', 'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat'];
  return animals[year % 12];
}

function buildFortune(birthdate, zodiac, type) {
  const birth = new Date(birthdate);
  const year = birth.getFullYear();
  const lunar = calculateChineseZodiac(year);
  const starLabel = formatZodiac(zodiac);
  const lunarLabel = formatChineseZodiac(lunar);

  if (type === 'newYear2026') {
    const data = NEW_YEAR_2026_FORTUNE[lunar] || NEW_YEAR_2026_FORTUNE.default;
    return assembleFortune('2026년 신년 운세', `${year}년생 ${lunarLabel} · ${starLabel}`, data);
  }

  if (type === 'tojeong') {
    const data = TOJEONG_BIJEOL[lunar] || TOJEONG_BIJEOL.default;
    return assembleFortune('토정비결', `${year}년생 ${lunarLabel} 기준`, data);
  }

  return buildDailyFortune(birthdate, starLabel, lunarLabel);
}

function assembleFortune(title, subtitle, sectionsObj) {
  const sections = Object.entries(sectionsObj).map(([label, text]) => ({ label, text }));
  const shareText = `${title}\n${subtitle}\n${sections.map((s) => `- ${s.label}: ${s.text}`).join('\n')}`;
  return { title, subtitle, sections, shareText };
}

function buildDailyFortune(birthdate, starLabel, lunarLabel) {
  const base = [
    '오늘은 새로운 사람과의 만남이 행운을 가져옵니다.',
    '집중력이 높아지는 날! 미뤄둔 일을 끝내보세요.',
    '가벼운 산책이나 스트레칭으로 기분을 전환해보세요.',
    '주변의 작은 도움을 받으면 일이 술술 풀립니다.',
    '지갑 조심! 지출을 한 번 더 확인하세요.',
    '가족이나 친구에게 연락을 해보면 좋은 일이 생깁니다.'
  ];
  const cond = [
    '컨디션이 안정적이니 약속을 잡아도 좋다.',
    '잠을 충분히 자면 집중력이 배로 오른다.',
    '과식만 피하면 에너지 관리가 수월하다.',
    '짧은 스트레칭과 산책이 기분 전환에 도움.',
    '수분 섭취를 늘리고 카페인을 줄여보자.',
    '마음이 예민해질 수 있으니 휴식 시간을 확보.'
  ];
  const money = [
    '예산을 지키면 여유 자금이 생긴다.',
    '소액 지출을 합리화할 기회.',
    '큰 지출은 미루고 가격 비교를 추천.',
    '필요한 것만 사도 만족도가 높다.',
    '지출 로그를 남기면 새는 돈을 막는다.',
    '현금 흐름이 안정적. 단, 과소비는 금물.'
  ];
  const relation = [
    '가까운 사람에게 안부를 물어보자.',
    '정중한 표현이 갈등을 예방한다.',
    '감사 인사가 행운을 부른다.',
    '가벼운 농담이 분위기를 풀어준다.',
    '솔직한 감정 표현이 통하는 날.',
    '속도를 늦추고 경청하는 태도가 길.'
  ];
  const idx = (new Date(birthdate).getDate() + starLabel.length) % base.length;
  const sections = [
    { label: '오늘 포인트', text: base[idx] },
    { label: '컨디션', text: cond[idx] },
    { label: '금전', text: money[idx] },
    { label: '관계', text: relation[idx] }
  ];
  const title = '오늘의 운세';
  const subtitle = `${starLabel} · ${lunarLabel}`;
  const shareText = `${title}\n${subtitle}\n${sections.map((s) => `- ${s.label}: ${s.text}`).join('\n')}`;
  return { title, subtitle, sections, shareText };
}

function renderFortuneResult(payload) {
  fortuneResult.innerHTML = `
    <div class="fortune-block">
      <h3>${payload.title}</h3>
      <p class="muted">${payload.subtitle}</p>
      <div class="fortune-grid">
        ${payload.sections
          .map(
            (s) => `
              <div class="fortune-card">
                <div class="fortune-label">${s.label}</div>
                <p>${s.text}</p>
              </div>
            `
          )
          .join('')}
      </div>
    </div>
  `;
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

function formatChineseZodiac(animal) {
  const map = {
    rat: '쥐띠',
    ox: '소띠',
    tiger: '호랑이띠',
    rabbit: '토끼띠',
    dragon: '용띠',
    snake: '뱀띠',
    horse: '말띠',
    goat: '양띠',
    monkey: '원숭이띠',
    rooster: '닭띠',
    dog: '개띠',
    pig: '돼지띠'
  };
  return map[animal] || '띠 정보 없음';
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
