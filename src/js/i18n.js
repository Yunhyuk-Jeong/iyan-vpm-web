export const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja'];
export const LANGUAGE_STORAGE_KEY = 'site-language';

const DEFAULT_LANGUAGE = 'en';
const localeCache = new Map();

let currentLanguage = DEFAULT_LANGUAGE;
let messages = {};

const getLocaleUrl = (language, bundle) => new URL(`../../data/locales/${language}/${bundle}.json`, import.meta.url);

const getNestedValue = (source, path) =>
	path.split('.').reduce((value, key) => (value && typeof value === 'object' ? value[key] : undefined), source);

const normalizeLanguage = (language) => (SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE);

const mergeMessages = (target, source) => {
	Object.entries(source).forEach(([key, value]) => {
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			target[key] = mergeMessages(target[key] && typeof target[key] === 'object' ? target[key] : {}, value);
			return;
		}

		target[key] = value;
	});

	return target;
};

const loadLocale = async (language, bundles) => {
	const normalizedLanguage = normalizeLanguage(language);
	const normalizedBundles = bundles.length > 0 ? bundles : ['main'];
	const cacheKey = `${normalizedLanguage}:${normalizedBundles.join('|')}`;

	if (localeCache.has(cacheKey)) {
		return localeCache.get(cacheKey);
	}

	const localeMessagesList = await Promise.all(
		normalizedBundles.map(async (bundle) => {
			const response = await fetch(getLocaleUrl(normalizedLanguage, bundle));
			if (!response.ok) {
				throw new Error(`Failed to load locale bundle: ${normalizedLanguage}/${bundle}`);
			}

			return response.json();
		}),
	);

	const localeMessages = localeMessagesList.reduce((accumulator, localePart) => mergeMessages(accumulator, localePart), {});
	localeCache.set(cacheKey, localeMessages);
	return localeMessages;
};

export const getInitialLanguage = () => {
	const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
	return normalizeLanguage(storedLanguage);
};

export const getCurrentLanguage = () => currentLanguage;

export const getText = (path, fallback = '') => {
	const value = getNestedValue(messages, path);
	return typeof value === 'string' ? value : fallback;
};

export const getMessage = (path, fallback = null) => {
	const value = getNestedValue(messages, path);
	return value === undefined ? fallback : value;
};

export const setLanguage = async (language, { bundles = ['main'] } = {}) => {
	const normalizedLanguage = normalizeLanguage(language);

	try {
		messages = await loadLocale(normalizedLanguage, bundles);
		currentLanguage = normalizedLanguage;
	} catch (error) {
		if (normalizedLanguage === DEFAULT_LANGUAGE) {
			throw error;
		}

		messages = await loadLocale(DEFAULT_LANGUAGE, bundles);
		currentLanguage = DEFAULT_LANGUAGE;
	}

	window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
	document.documentElement.lang = currentLanguage;
	return messages;
};

export const applyTranslations = (root = document) => {
	root.querySelectorAll('[data-i18n]').forEach((element) => {
		const text = getText(element.dataset.i18n);
		if (typeof text === 'string' && text.length > 0) {
			element.textContent = text;
		}
	});
};

export const updateLanguageButtons = (buttons) => {
	buttons.forEach((button) => {
		const isActive = button.dataset.language === currentLanguage;
		button.classList.toggle('language-switcher__button--active', isActive);
		button.setAttribute('aria-pressed', String(isActive));
	});
};
