import { createProjectCard, loadProjects } from './portfolio-data.js';
import {
	applyTranslations,
	getCurrentLanguage,
	getInitialLanguage,
	getText,
	setLanguage,
	updateLanguageButtons,
} from './i18n.js';

document.documentElement.classList.add('js');

const topTabs = document.querySelector('.top-tabs');
const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
const portfolioSection = document.getElementById('portfolio');
const filterButtons = [...document.querySelectorAll('[data-filter-button]')];
const languageButtons = [...document.querySelectorAll('[data-language]')];
const productGrid = document.getElementById('product-grid');
const portfolioMore = document.getElementById('portfolio-more');
const portfolioToggleButton = document.getElementById('portfolio-toggle');
const portfolioToggleLabel = document.getElementById('portfolio-toggle-label');
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
const LOCALE_BUNDLES = ['main'];

let activeFilter = 'all';
let visiblePortfolioCount = 12;
let currentStatusKey = 'loadingProjects';
let currentStatusError = false;
let lastFocusedCard = null;
let activeModalProject = null;
let modalCloseTimer = null;
let projectById = new Map();

const filterHideTimers = new WeakMap();
const INITIAL_PORTFOLIO_VISIBLE_COUNT = 12;

const getProjectCards = () => [...document.querySelectorAll('.product-card')];
const getFilteredCards = () => getProjectCards().filter((card) => card.dataset.matchesFilter === 'true');

const translateTag = (tag) => getText(`tags.${tag}`, tag);
const translateCategory = (category) => getText(`categories.${category}`, category);

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

	return new Intl.DateTimeFormat(localeMap[getCurrentLanguage()], {
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
	portfolioStatus.textContent = getText(`status.${statusKey}`);
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

const updatePortfolioToggle = () => {
	if (!portfolioMore || !portfolioToggleButton || !portfolioToggleLabel) {
		return;
	}

	const filteredCards = getFilteredCards();
	const shouldShowToggle = filteredCards.length > INITIAL_PORTFOLIO_VISIBLE_COUNT;
	const isExpanded = visiblePortfolioCount >= filteredCards.length;

	portfolioMore.hidden = !shouldShowToggle;
	portfolioToggleButton.setAttribute('aria-expanded', String(isExpanded));
	portfolioToggleLabel.textContent = isExpanded ? getText('portfolio.showLess') : getText('portfolio.showMore');
};

const updateVisibleCards = () => {
	let visibleMatchIndex = 0;

	getProjectCards().forEach((card) => {
		const matchesFilter = card.dataset.matchesFilter === 'true';
		const shouldShow = matchesFilter && visibleMatchIndex < visiblePortfolioCount;

		if (matchesFilter) {
			visibleMatchIndex += 1;
		}

		if (shouldShow) {
			showCard(card);
			return;
		}

		hideCard(card);
	});

	updatePortfolioToggle();
};

const applyFilter = (filterValue) => {
	activeFilter = filterValue;
	visiblePortfolioCount = INITIAL_PORTFOLIO_VISIBLE_COUNT;

	filterButtons.forEach((button) => {
		const isActive = button.dataset.filterButton === filterValue;
		button.classList.toggle('filter-chip--active', isActive);
		button.setAttribute('aria-pressed', String(isActive));
	});

	getProjectCards().forEach((card) => {
		const cardType = card.dataset.type;
		const matchesFilter = filterValue === 'all' || cardType === filterValue;
		card.dataset.matchesFilter = String(matchesFilter);
	});

	updateVisibleCards();
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

const refreshTranslations = () => {
	applyTranslations(document);
	updateLanguageButtons(languageButtons);
	updateLocalizedCardLabels();

	if (!portfolioStatus?.hidden) {
		setStatus(currentStatusKey, currentStatusError);
	}

	updatePortfolioToggle();

	if (activeModalProject) {
		updateModalContent(activeModalProject);
	}
};

const updateModalContent = (project) => {
	if (!projectModal || !project) {
		return;
	}

	const activeLanguage = getCurrentLanguage();
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
		projectModalSummary.textContent =
			project.description[activeLanguage] ||
			project.description.en ||
			project.description.ko ||
			project.description.ja ||
			'';
	}

	if (projectModalLink) {
		projectModalLink.href = project.address;
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
	getProjectCards().forEach((card) => {
		card.dataset.matchesFilter = 'true';
	});
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

portfolioToggleButton?.addEventListener('click', () => {
	const filteredCards = getFilteredCards();
	const isExpanded = visiblePortfolioCount >= filteredCards.length;
	visiblePortfolioCount = isExpanded ? INITIAL_PORTFOLIO_VISIBLE_COUNT : filteredCards.length;
	updateVisibleCards();
});

languageButtons.forEach((button) => {
	button.addEventListener('click', async () => {
		await setLanguage(button.dataset.language || 'en', { bundles: LOCALE_BUNDLES });
		refreshTranslations();
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

const initialize = async () => {
	await setLanguage(getInitialLanguage(), { bundles: LOCALE_BUNDLES });
	refreshTranslations();
	updateActiveSectionFromScroll();

	if (portfolioSection) {
		const portfolioRevealObserver = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) {
					return;
				}

				portfolioSection.classList.add('is-visible');
				portfolioRevealObserver.unobserve(portfolioSection);
			},
			{
				rootMargin: '-12% 0px -18% 0px',
				threshold: 0.18,
			},
		);

		portfolioRevealObserver.observe(portfolioSection);
	}

	await initPortfolio();
};

initialize().catch((error) => {
	console.error(error);
});
