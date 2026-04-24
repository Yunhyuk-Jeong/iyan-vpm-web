import { createProjectCard, loadProjects } from './scripts/portfolio-data.js';

document.documentElement.classList.add('js');

const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja'];
const LANGUAGE_STORAGE_KEY = 'site-language';

const UI_TEXT = {
	ko: {
		nav: {
			home: 'HOME',
			portfolio: 'PORTFOLIO',
		},
		home: {
			kicker: 'VRChat Gimmicks & Unity Tools',
			role: 'Game Developer',
			scrollCue: 'Portfolio',
			addVcc: 'VCC에 추가',
			addAlcom: 'ALCOM에 추가',
		},
		portfolio: {
			kicker: 'Portfolio',
			title: 'VRChat Gimmicks & Unity Tools',
			copy: '지금까지 작업한 프로젝트, 상품, 기믹, 툴을 모아둔 공간입니다.',
		},
		filters: {
			all: 'All',
			'vrchat-gimmick': 'VRChat Gimmick',
			'unity-tool': 'Unity Tool',
		},
		modal: {
			visit: 'BOOTH 방문',
			close: '닫기',
		},
		status: {
			loadingProjects: '프로젝트를 불러오는 중...',
			noProjectsYet: '아직 등록된 프로젝트가 없습니다.',
			failedToLoadData: '포트폴리오 데이터를 불러오지 못했습니다.',
		},
	},
	en: {
		nav: {
			home: 'HOME',
			portfolio: 'PORTFOLIO',
		},
		home: {
			kicker: 'VRChat Gimmicks & Unity Tools',
			role: 'Game Developer',
			scrollCue: 'Portfolio',
			addVcc: 'Add to VCC',
			addAlcom: 'Add to ALCOM',
		},
		portfolio: {
			kicker: 'Portfolio',
			title: 'VRChat Gimmicks & Unity Tools',
			copy: 'A collection of projects, products, gimmicks, and tools I have worked on.',
		},
		filters: {
			all: 'All',
			'vrchat-gimmick': 'VRChat Gimmick',
			'unity-tool': 'Unity Tool',
		},
		modal: {
			visit: 'Visit BOOTH',
			close: 'Close',
		},
		status: {
			loadingProjects: 'Loading projects...',
			noProjectsYet: 'No projects yet.',
			failedToLoadData: 'Failed to load portfolio data.',
		},
	},
	ja: {
		nav: {
			home: 'HOME',
			portfolio: 'PORTFOLIO',
		},
		home: {
			kicker: 'VRChat Gimmicks & Unity Tools',
			role: 'Game Developer',
			scrollCue: 'Portfolio',
			addVcc: 'VCCに追加',
			addAlcom: 'ALCOMに追加',
		},
		portfolio: {
			kicker: 'Portfolio',
			title: 'VRChat Gimmicks & Unity Tools',
			copy: 'これまで制作したプロジェクト、商品、ギミック、ツールをまとめたページです。',
		},
		filters: {
			all: 'All',
			'vrchat-gimmick': 'VRChat Gimmick',
			'unity-tool': 'Unity Tool',
		},
		modal: {
			visit: 'BOOTHを見る',
			close: '閉じる',
		},
		status: {
			loadingProjects: 'プロジェクトを読み込み中...',
			noProjectsYet: 'まだプロジェクトがありません。',
			failedToLoadData: 'ポートフォリオデータを読み込めませんでした。',
		},
	},
};

const TAG_TEXT = {
	'VRChat Gimmick': {
		ko: 'VRChat Gimmick',
		en: 'VRChat Gimmick',
		ja: 'VRChat Gimmick',
	},
	'Unity Tool': {
		ko: 'Unity Tool',
		en: 'Unity Tool',
		ja: 'Unity Tool',
	},
};

const CATEGORY_TEXT = {
	Gimmick: {
		ko: 'Gimmick',
		en: 'Gimmick',
		ja: 'Gimmick',
	},
	Tool: {
		ko: 'Tool',
		en: 'Tool',
		ja: 'Tool',
	},
};

const topTabs = document.querySelector('.top-tabs');
const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
const portfolioSection = document.getElementById('portfolio');
const filterButtons = [...document.querySelectorAll('[data-filter-button]')];
const languageButtons = [...document.querySelectorAll('[data-language]')];
const productGrid = document.getElementById('product-grid');
const portfolioStatus = document.getElementById('portfolio-status');
const projectModal = document.getElementById('project-modal');
const projectModalImage = document.getElementById('project-modal-image');
const projectModalTitle = document.getElementById('project-modal-title');
const projectModalShop = document.getElementById('project-modal-shop');
const projectModalDate = document.getElementById('project-modal-date');
const projectModalPlatform = document.getElementById('project-modal-platform');
const projectModalCategory = document.getElementById('project-modal-category');
const projectModalBuiltWith = document.getElementById('project-modal-built-with');
const projectModalSummary = document.getElementById('project-modal-summary');
const projectModalLink = document.getElementById('project-modal-link');

let activeFilter = 'all';
let currentLanguage = 'en';
let currentStatusKey = 'loadingProjects';
let currentStatusError = false;
let lastFocusedCard = null;
let activeModalProject = null;
let modalCloseTimer = null;
let projectById = new Map();
const filterHideTimers = new WeakMap();

const getProjectCards = () => [...document.querySelectorAll('.product-card')];

const getInitialLanguage = () => {
	const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
	if (SUPPORTED_LANGUAGES.includes(storedLanguage)) {
		return storedLanguage;
	}
	return 'en';
};

const getText = (path, language = currentLanguage) => path.split('.').reduce((value, key) => (value && typeof value === 'object' ? value[key] : undefined), UI_TEXT[language]);

const translateTag = (tag, language = currentLanguage) => TAG_TEXT[tag]?.[language] || tag;

const translateCategory = (category, language = currentLanguage) => CATEGORY_TEXT[category]?.[language] || category;

const formatProjectDate = (date) => {
	if (!date) {
		return '';
	}

	const parsedDate = new Date(date);
	if (Number.isNaN(parsedDate.getTime())) {
		return date;
	}

	const localeMap = {
		ko: 'ko-KR',
		en: 'en-US',
		ja: 'ja-JP',
	};

	return new Intl.DateTimeFormat(localeMap[currentLanguage], {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(parsedDate);
};

const updateTabIndicator = (activeLink) => {
	if (!topTabs || !activeLink) {
		return;
	}

	const tabBounds = topTabs.getBoundingClientRect();
	const activeBounds = activeLink.getBoundingClientRect();
	topTabs.style.setProperty('--tab-indicator-width', `${activeBounds.width}px`);
	topTabs.style.setProperty('--tab-indicator-x', `${activeBounds.left - tabBounds.left}px`);
};

const setActiveSection = (sectionId) => {
	let activeLink = null;

	sectionLinks.forEach((link) => {
		const isActive = link.dataset.sectionLink === sectionId;
		link.classList.toggle('top-tab--active', isActive);

		if (isActive) {
			link.setAttribute('aria-current', 'page');
			activeLink = link;
			return;
		}

		link.removeAttribute('aria-current');
	});

	updateTabIndicator(activeLink);
};

const updateActiveSectionFromScroll = () => {
	if (!portfolioSection) {
		setActiveSection('home');
		return;
	}

	const activationLine = window.innerHeight * 0.45;
	const portfolioTop = portfolioSection.getBoundingClientRect().top;
	setActiveSection(portfolioTop <= activationLine ? 'portfolio' : 'home');
};

const setStatus = (statusKey, isError = false) => {
	currentStatusKey = statusKey;
	currentStatusError = isError;

	if (!portfolioStatus) {
		return;
	}

	portfolioStatus.hidden = false;
	portfolioStatus.textContent = getText(`status.${statusKey}`) || '';
	portfolioStatus.classList.toggle('portfolio-status--error', isError);
};

const clearStatus = () => {
	if (!portfolioStatus) {
		return;
	}

	portfolioStatus.hidden = true;
	portfolioStatus.textContent = '';
	portfolioStatus.classList.remove('portfolio-status--error');
};

const showCard = (card) => {
	const hideTimer = filterHideTimers.get(card);
	if (hideTimer) {
		window.clearTimeout(hideTimer);
		filterHideTimers.delete(card);
	}

	card.hidden = false;
	card.classList.remove('is-filtering-out');

	card.animate(
		[
			{ opacity: 0, transform: 'translateY(18px) scale(0.96)' },
			{ opacity: 1, transform: 'translateY(0) scale(1)' },
		],
		{
			duration: 280,
			easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
			fill: 'both',
		},
	);
};

const hideCard = (card) => {
	const existingTimer = filterHideTimers.get(card);
	if (existingTimer) {
		window.clearTimeout(existingTimer);
	}

	card.classList.add('is-filtering-out');

	card.animate(
		[
			{ opacity: 1, transform: 'translateY(0) scale(1)' },
			{ opacity: 0, transform: 'translateY(18px) scale(0.96)' },
		],
		{
			duration: 220,
			easing: 'ease',
			fill: 'both',
		},
	);

	const timer = window.setTimeout(() => {
		card.hidden = true;
		card.classList.remove('is-filtering-out');
		filterHideTimers.delete(card);
	}, 220);

	filterHideTimers.set(card, timer);
};

const applyFilter = (filterValue) => {
	activeFilter = filterValue;

	filterButtons.forEach((button) => {
		const isActive = button.dataset.filterButton === filterValue;
		button.classList.toggle('filter-chip--active', isActive);
		button.setAttribute('aria-pressed', String(isActive));
	});

	getProjectCards().forEach((card) => {
		const cardType = card.dataset.type;
		const matchesFilter = filterValue === 'all' || (filterValue === 'unity-tool' && cardType === 'unity-tool') || (filterValue === 'vrchat-gimmick' && cardType === 'vrchat-gimmick');

		if (matchesFilter) {
			showCard(card);
			return;
		}

		hideCard(card);
	});
};

const updateLocalizedCardLabels = () => {
	getProjectCards().forEach((card) => {
		const tag = card.dataset.tag;
		const typeElement = card.querySelector('.product-type');

		if (typeElement && tag) {
			typeElement.textContent = translateTag(tag);
		}
	});
};

const updateLocalizedStaticText = () => {
	document.documentElement.lang = currentLanguage;
	document.querySelectorAll('[data-i18n]').forEach((element) => {
		const text = getText(element.dataset.i18n);
		if (typeof text === 'string') {
			element.textContent = text;
		}
	});

	languageButtons.forEach((button) => {
		const isActive = button.dataset.language === currentLanguage;
		button.classList.toggle('language-switcher__button--active', isActive);
		button.setAttribute('aria-pressed', String(isActive));
	});

	if (!portfolioStatus?.hidden) {
		setStatus(currentStatusKey, currentStatusError);
	}
};

const updateModalContent = (project) => {
	if (!projectModal || !project) {
		return;
	}

	activeModalProject = project;

	if (projectModalImage) {
		projectModalImage.src = project.image;
		projectModalImage.alt = `${project.productName} thumbnail`;
	}

	if (projectModalShop) {
		projectModalShop.textContent = project.shopName;
	}

	if (projectModalDate) {
		const formattedDate = formatProjectDate(project.date);
		projectModalDate.hidden = !formattedDate;
		projectModalDate.textContent = formattedDate;
	}

	if (projectModalTitle) {
		projectModalTitle.textContent = project.productName;
	}

	if (projectModalPlatform) {
		projectModalPlatform.textContent = project.meta.platform;
	}

	if (projectModalCategory) {
		projectModalCategory.textContent = translateCategory(project.meta.category);
	}

	if (projectModalBuiltWith) {
		projectModalBuiltWith.textContent = project.meta.builtWith;
	}

	if (projectModalSummary) {
		projectModalSummary.textContent = project.description[currentLanguage] || project.description.en || project.description.ko || project.description.ja || '';
	}

	if (projectModalLink) {
		projectModalLink.href = project.address;
	}
};

const applyLanguage = (language) => {
	currentLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'en';
	window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);

	updateLocalizedStaticText();
	updateLocalizedCardLabels();

	if (activeModalProject) {
		updateModalContent(activeModalProject);
	}
};

const openProjectModal = (project, card) => {
	if (!projectModal) {
		return;
	}

	lastFocusedCard = card;

	if (modalCloseTimer) {
		window.clearTimeout(modalCloseTimer);
		modalCloseTimer = null;
	}

	projectModal.hidden = false;
	projectModal.setAttribute('aria-hidden', 'false');
	document.body.classList.add('modal-open');
	updateModalContent(project);

	window.requestAnimationFrame(() => {
		projectModal.classList.add('is-open');
	});
};

const closeProjectModal = () => {
	if (!projectModal || projectModal.hidden) {
		return;
	}

	if (modalCloseTimer) {
		window.clearTimeout(modalCloseTimer);
	}

	projectModal.classList.remove('is-open');

	modalCloseTimer = window.setTimeout(() => {
		projectModal.hidden = true;
		projectModal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');
		activeModalProject = null;

		if (projectModalImage) {
			projectModalImage.src = '';
			projectModalImage.alt = '';
		}

		if (projectModalDate) {
			projectModalDate.hidden = true;
			projectModalDate.textContent = '';
		}

		lastFocusedCard?.focus();
		modalCloseTimer = null;
	}, 220);
};

const renderProjects = (projects) => {
	if (!productGrid) {
		return;
	}

	productGrid.replaceChildren(...projects.map(createProjectCard));
	updateLocalizedCardLabels();
};

const handleProjectActivation = (card) => {
	const projectId = card.dataset.projectId;
	if (!projectId) {
		return;
	}

	const project = projectById.get(projectId);
	if (!project) {
		return;
	}

	openProjectModal(project, card);
};

const initPortfolio = async () => {
	if (!productGrid) {
		return;
	}

	setStatus('loadingProjects');

	try {
		const projects = await loadProjects();
		projectById = new Map(projects.map((project) => [project.id, project]));
		renderProjects(projects);

		if (projects.length === 0) {
			setStatus('noProjectsYet');
			return;
		}

		clearStatus();
		applyFilter(activeFilter);
	} catch (error) {
		console.error(error);
		setStatus('failedToLoadData', true);
	}
};

sectionLinks.forEach((link) => {
	link.addEventListener('click', () => {
		setActiveSection(link.dataset.sectionLink);
	});
});

filterButtons.forEach((button) => {
	button.addEventListener('click', () => {
		applyFilter(button.dataset.filterButton || 'all');
	});
});

languageButtons.forEach((button) => {
	button.addEventListener('click', () => {
		applyLanguage(button.dataset.language || 'en');
	});
});

productGrid?.addEventListener('click', (event) => {
	const card = event.target instanceof Element ? event.target.closest('.product-card') : null;
	if (!(card instanceof HTMLElement)) {
		return;
	}

	event.preventDefault();
	handleProjectActivation(card);
});

productGrid?.addEventListener('keydown', (event) => {
	const card = event.target instanceof Element ? event.target.closest('.product-card') : null;
	if (!(card instanceof HTMLElement)) {
		return;
	}

	if (event.key !== 'Enter' && event.key !== ' ') {
		return;
	}

	event.preventDefault();
	handleProjectActivation(card);
});

projectModal?.addEventListener('click', (event) => {
	const target = event.target;
	if (!(target instanceof HTMLElement)) {
		return;
	}

	if (target.dataset.modalClose === 'true') {
		closeProjectModal();
	}
});

window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		closeProjectModal();
	}
});

window.addEventListener('scroll', updateActiveSectionFromScroll, { passive: true });
window.addEventListener('resize', () => {
	updateActiveSectionFromScroll();
	updateTabIndicator(document.querySelector('.top-tab--active'));
});

currentLanguage = getInitialLanguage();
applyLanguage(currentLanguage);
updateActiveSectionFromScroll();

if (portfolioSection) {
	const portfolioRevealObserver = new IntersectionObserver(
		([entry]) => {
			portfolioSection.classList.toggle('is-visible', entry.isIntersecting);
		},
		{
			rootMargin: '-12% 0px -18% 0px',
			threshold: 0.18,
		},
	);

	portfolioRevealObserver.observe(portfolioSection);
}

initPortfolio();
