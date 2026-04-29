import {
	applyTranslations,
	getInitialLanguage,
	getMessage,
	setLanguage,
	updateLanguageButtons,
} from './i18n.js';

const languageButtons = [...document.querySelectorAll('[data-language]')];
const wikiButtons = [...document.querySelectorAll('.wiki-nav__button[data-wiki-tab]')];
const wikiSubButtons = [...document.querySelectorAll('.wiki-nav__subbutton[data-wiki-tab]')];
const wikiGroupButtons = [...document.querySelectorAll('[data-wiki-group-toggle]')];
const wikiGroupPanels = [...document.querySelectorAll('[data-wiki-group-panel]')];
const wikiPanels = [...document.querySelectorAll('[data-wiki-panel]')];
const wikiContentContainers = [...document.querySelectorAll('[data-wiki-content]')];
const LOCALE_BUNDLES = [
	'wiki/common',
	'wiki/overview',
	'wiki/vpm-tools-overview',
	'wiki/plane-fit-to-camera-tool',
	'wiki/ma-blendshape-sync-auto-setup',
	'wiki/hierarchy-plus-rebone',
	'wiki/prefab-material-remapper',
	'wiki/uv-mask-tool',
	'wiki/tools-overview',
	'wiki/vsf-avatar-converter',
	'wiki/sdf-generator',
	'wiki/notes',
];

const refreshTranslations = () => {
	applyTranslations(document);
	updateLanguageButtons(languageButtons);
};

const escapeHtml = (value) =>
	String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const formatRichText = (value) =>
	escapeHtml(value)
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\n/g, '<br />');

const renderHeader = ({ eyebrow, title, copy }) => `
	<header class="wiki-panel__header">
		<p class="wiki-panel__eyebrow">${escapeHtml(eyebrow)}</p>
		<h2 class="wiki-panel__title">${escapeHtml(title)}</h2>
		<p class="wiki-panel__copy">${formatRichText(copy)}</p>
	</header>
`;

const renderCard = ({ title, body }) => `
	<section class="wiki-card">
		<h3 class="wiki-card__title">${escapeHtml(title)}</h3>
		<p class="wiki-card__body">${formatRichText(body)}</p>
	</section>
`;

const renderListCard = ({ title, items }) => `
	<div class="wiki-card">
		<h3 class="wiki-card__title">${escapeHtml(title)}</h3>
		<ul class="wiki-list">
			${items.map((item) => `<li>${formatRichText(item)}</li>`).join('')}
		</ul>
	</div>
`;

const renderMetaCard = ({ chips, body }) => `
	<div class="wiki-card">
		<div class="wiki-meta">
			${chips.map((chip) => `<span class="wiki-meta__chip">${escapeHtml(chip)}</span>`).join('')}
		</div>
		<p class="wiki-card__body">${formatRichText(body)}</p>
	</div>
`;

const renderMediaCard = ({ src, alt, caption }) => `
	<section class="wiki-card wiki-card--media">
		${renderMediaFigure({ src, alt, caption })}
	</section>
`;

const renderMediaFigure = ({ src, alt, caption, layout }) => `
		<div class="wiki-media${layout === 'landscape' ? ' wiki-media--landscape' : ''}">
			<img src="${escapeHtml(src)}" alt="${escapeHtml(alt || '')}" loading="lazy" />
		</div>
		${caption ? `<p class="wiki-media__caption">${formatRichText(caption)}</p>` : ''}
`;

const renderSectionItems = ({ items = [], ordered = false }) => {
	if (!Array.isArray(items) || items.length === 0) {
		return '';
	}

	const tag = ordered ? 'ol' : 'ul';
	return `
		<${tag} class="wiki-list${ordered ? ' wiki-list--ordered' : ''}">
			${items.map((item) => `<li>${formatRichText(item)}</li>`).join('')}
		</${tag}>
	`;
};

const renderSectionEntries = (entries = []) => {
	if (!Array.isArray(entries) || entries.length === 0) {
		return '';
	}

	return `
		<div class="wiki-entry-list">
			${entries
				.map(
					(entry) => `
						<section class="wiki-entry">
							<h4 class="wiki-entry__title">${escapeHtml(entry.title)}</h4>
							${entry.body ? `<p class="wiki-entry__body">${formatRichText(entry.body)}</p>` : ''}
							${renderSectionItems({ items: entry.items, ordered: entry.ordered })}
						</section>
					`
				)
				.join('')}
		</div>
	`;
};

const renderContentSection = (section) => `
	<section class="wiki-card wiki-card--section">
		${section.image ? renderMediaFigure(section.image) : ''}
		<div class="wiki-section">
			<h3 class="wiki-section__title">${escapeHtml(section.title)}</h3>
			${section.body ? `<p class="wiki-card__body">${formatRichText(section.body)}</p>` : ''}
			${renderSectionItems(section)}
			${renderSectionEntries(section.entries)}
		</div>
	</section>
`;

const renderActionBlock = ({ title, body, href, label }) => `
	<section class="wiki-card wiki-card--cta">
		<div class="wiki-cta">
			<div class="wiki-cta__copy">
				<h3 class="wiki-section__title">${escapeHtml(title)}</h3>
				<p class="wiki-card__body">${formatRichText(body)}</p>
			</div>
			<a class="link-button link-button--blue wiki-cta__button" href="${escapeHtml(href)}">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 3 4.5 7.2v9.6L12 21l7.5-4.2V7.2L12 3Zm0 2.18 5.43 3.04L12 11.26 6.57 8.22 12 5.18Zm-5.7 4.15 4.95 2.78v5.73L6.3 15.06V9.33Zm6.45 8.51v-5.73l4.95-2.78v5.73l-4.95 2.78Z" />
				</svg>
				<span>${escapeHtml(label)}</span>
			</a>
		</div>
	</section>
`;

const renderLeadPanel = ({ image, cards, meta }) => {
	if (!image && (!Array.isArray(cards) || cards.length === 0) && !meta) {
		return '';
	}

	return `
		<section class="wiki-lead${image ? ' wiki-lead--with-media' : ''}${image?.layout === 'landscape' ? ' wiki-lead--wide-media' : ''}">
			${image ? `<div class="wiki-lead__media">${renderMediaFigure(image)}</div>` : ''}
			<div class="wiki-lead__content">
				${
					Array.isArray(cards) && cards.length > 0
						? `<div class="wiki-grid wiki-grid--lead">${cards.map(renderCard).join('')}</div>`
						: ''
				}
				${meta ? renderMetaCard(meta) : ''}
			</div>
		</section>
	`;
};

const renderWikiContent = async () => {
	wikiContentContainers.forEach((container) => {
		const section = container.dataset.wikiContent;
		if (!section) {
			return;
		}

		const sectionData = getMessage(section);
		if (!sectionData || typeof sectionData !== 'object') {
			container.innerHTML = '';
			return;
		}

		let html = renderHeader(sectionData);
		html += renderLeadPanel(sectionData);

		if (sectionData.listCard) {
			html += renderListCard(sectionData.listCard);
		}

		if (sectionData.notes) {
			html += renderCard(sectionData.notes);
		}

		if (Array.isArray(sectionData.sections) && sectionData.sections.length > 0) {
			html += sectionData.sections.map(renderContentSection).join('');
		}

		if (sectionData.action) {
			html += renderActionBlock(sectionData.action);
		}

		container.innerHTML = html;
	});
};

const GROUP_CHILDREN = {
	'vpm-tools': [
		'vpm-tools-overview',
		'plane-fit-to-camera-tool',
		'ma-blendshape-sync-auto-setup',
		'hierarchy-plus-rebone',
		'prefab-material-remapper',
		'uv-mask-tool',
	],
	tools: ['tools-overview', 'vsf-avatar-converter', 'sdf-generator'],
};

const getGroupForTab = (tabId) =>
	Object.entries(GROUP_CHILDREN).find(([, tabIds]) => tabIds.includes(tabId))?.[0] || null;

const setGroupExpanded = (groupId, isExpanded) => {
	const groupButton = wikiGroupButtons.find((button) => button.dataset.wikiGroupToggle === groupId);
	const groupPanel = wikiGroupPanels.find((panel) => panel.dataset.wikiGroupPanel === groupId);

	if (!groupButton || !groupPanel) {
		return;
	}

	groupButton.setAttribute('aria-expanded', String(isExpanded));
	groupPanel.hidden = !isExpanded;
};

const expandGroupForTab = (tabId) => {
	const activeGroupId = getGroupForTab(tabId);

	wikiGroupButtons.forEach((button) => {
		const groupId = button.dataset.wikiGroupToggle;
		setGroupExpanded(groupId, groupId === activeGroupId);
	});
};

const getPanelById = (panelId) => wikiPanels.find((panel) => panel.id === panelId);

const setActiveWikiPanel = (panelId, { updateHash = true } = {}) => {
	const activePanel = getPanelById(panelId) || wikiPanels[0];
	if (!activePanel) {
		return;
	}

	wikiButtons.forEach((button) => {
		const isActive = button.dataset.wikiTab === activePanel.id;
		button.classList.toggle('wiki-nav__button--active', isActive);

		if (isActive) {
			button.setAttribute('aria-current', 'page');
			return;
		}

		button.removeAttribute('aria-current');
	});

	wikiSubButtons.forEach((button) => {
		const isActive = button.dataset.wikiTab === activePanel.id;
		button.classList.toggle('wiki-nav__subbutton--active', isActive);

		if (isActive) {
			button.setAttribute('aria-current', 'page');
			return;
		}

		button.removeAttribute('aria-current');
	});

	expandGroupForTab(activePanel.id);

	const activeGroupId = getGroupForTab(activePanel.id);
	wikiGroupButtons.forEach((button) => {
		button.classList.toggle('wiki-nav__button--active', button.dataset.wikiGroupToggle === activeGroupId);
	});

	wikiPanels.forEach((panel) => {
		const isActive = panel.id === activePanel.id;
		panel.classList.toggle('is-active', isActive);
		panel.hidden = !isActive;
	});

	if (updateHash) {
		const nextHash = `#${activePanel.id}`;
		if (window.location.hash !== nextHash) {
			window.history.replaceState(null, '', nextHash);
		}
	}
};

languageButtons.forEach((button) => {
	button.addEventListener('click', async () => {
		await setLanguage(button.dataset.language || 'en', { bundles: LOCALE_BUNDLES });
		refreshTranslations();
		await renderWikiContent();
	});
});

wikiButtons.forEach((button) => {
	button.addEventListener('click', () => {
		setActiveWikiPanel(button.dataset.wikiTab || '', { updateHash: true });
	});
});

wikiSubButtons.forEach((button) => {
	button.addEventListener('click', () => {
		setActiveWikiPanel(button.dataset.wikiTab || '', { updateHash: true });
	});
});

wikiGroupButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const groupId = button.dataset.wikiGroupToggle;
		const isExpanded = button.getAttribute('aria-expanded') === 'true';
		setGroupExpanded(groupId, !isExpanded);
	});
});

window.addEventListener('hashchange', () => {
	setActiveWikiPanel(window.location.hash.slice(1), { updateHash: false });
});

const initialize = async () => {
	await setLanguage(getInitialLanguage(), { bundles: LOCALE_BUNDLES });
	refreshTranslations();
	await renderWikiContent();
	setActiveWikiPanel(window.location.hash.slice(1), { updateHash: false });
};

initialize().catch((error) => {
	console.error(error);
});
