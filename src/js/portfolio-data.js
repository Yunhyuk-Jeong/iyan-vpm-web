const PROJECTS_DATA_URL = "./data/projects/portfolio-items.json";
const THUMBNAIL_CACHE_URL = "./data/projects/thumbnail-cache.json";
const PROJECT_PLACEHOLDER_IMAGE = "./assets/project-placeholder.svg";

const slugifyTag = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeTag = (tag) => {
  if (tag === "Unity Tool") {
    return "Tool";
  }

  return tag;
};

const parseProjectDate = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = Date.parse(value);
  return Number.isNaN(parsedDate) ? null : parsedDate;
};

const normalizeDescription = (description, tag, shopName, productName) => {
  if (description && typeof description === "object" && !Array.isArray(description)) {
    return {
      ko: description.ko || description.en || description.ja || "",
      en: description.en || description.ko || description.ja || "",
      ja: description.ja || description.en || description.ko || "",
    };
  }

  const fallback = typeof description === "string" && description
    ? description
    : buildFallbackSummary({ tag, shopName, productName });

  return {
    ko: fallback,
    en: fallback,
    ja: fallback,
  };
};

const buildFallbackSummary = (project) => {
  if (project.tag === "Tool" || project.tag === "Unity Tool") {
    return `${project.productName} is a Unity workflow tool released through ${project.shopName}. Add a short project summary here to explain the problem it solves and the workflow it improves.`;
  }

  if (project.tag === "Unity Shader") {
    return `${project.productName} is a Unity shader release published through ${project.shopName}. Add a short summary here to explain the visual target, rendering workflow, and what this shader is built for.`;
  }

  if (project.tag === "Game Mods") {
    return `${project.productName} is a game mod release published through ${project.shopName}. Add a short summary here to explain the target game, the assets or systems it changes, and the player experience it is designed for.`;
  }

  return `${project.productName} is a VRChat gimmick release published through ${project.shopName}. Add a short summary here to explain the core interaction, technical focus, and what makes this work stand out.`;
};

const inferMeta = (tag) => {
  if (tag === "Tool" || tag === "Unity Tool") {
    return {
      platform: "Unity",
      category: "Tool",
      builtWith: "Unity",
    };
  }

  if (tag === "Unity Shader") {
    return {
      platform: "Unity",
      category: "Shader",
      builtWith: "Unity",
    };
  }

  if (tag === "Game Mods") {
    return {
      platform: "Game",
      category: "Mods",
      builtWith: "Engine",
    };
  }

  return {
    platform: "VRChat",
    category: "Gimmick",
    builtWith: "Unity",
  };
};

const normalizeProject = (project, index, thumbnailCache) => {
  const normalizedTag = normalizeTag(project.tag || "VRChat Gimmick");
  const fallbackMeta = inferMeta(normalizedTag);
  const resolvedImage = project.manualImage
    || thumbnailCache[project.address]
    || PROJECT_PLACEHOLDER_IMAGE;

  return {
    id: `${slugifyTag(project.shopName || "project")}-${slugifyTag(project.productName || String(index + 1))}-${index + 1}`,
    sourceIndex: index,
    address: project.address,
    shopName: project.shopName,
    productName: project.productName,
    tag: normalizedTag,
    typeSlug: slugifyTag(normalizedTag),
    description: normalizeDescription(
      project.description,
      normalizedTag,
      project.shopName,
      project.productName,
    ),
    image: resolvedImage,
    date: project.date || "",
    parsedDate: parseProjectDate(project.date),
    meta: {
      platform: project.platform || fallbackMeta.platform,
      category: project.category || fallbackMeta.category,
      builtWith: project.builtWith || fallbackMeta.builtWith,
    },
  };
};

const sortProjects = (projects) => [...projects].sort((left, right) => {
  if (left.parsedDate !== null && right.parsedDate !== null) {
    return right.parsedDate - left.parsedDate;
  }

  if (left.parsedDate !== null) {
    return -1;
  }

  if (right.parsedDate !== null) {
    return 1;
  }

  return left.sourceIndex - right.sourceIndex;
});

export const loadProjects = async () => {
  const [projectsResponse, thumbnailResponse] = await Promise.all([
    fetch(PROJECTS_DATA_URL, { cache: "no-store" }),
    fetch(THUMBNAIL_CACHE_URL, { cache: "no-store" }).catch(() => null),
  ]);

  if (!projectsResponse.ok) {
    throw new Error(`Failed to load portfolio data: ${projectsResponse.status}`);
  }

  const rawProjects = await projectsResponse.json();

  if (!Array.isArray(rawProjects)) {
    throw new Error("Portfolio data must be an array.");
  }

  let thumbnailCache = {};

  if (thumbnailResponse?.ok) {
    const parsedCache = await thumbnailResponse.json();
    if (parsedCache && typeof parsedCache === "object" && !Array.isArray(parsedCache)) {
      thumbnailCache = parsedCache;
    }
  }

  return sortProjects(rawProjects.map((project, index) => normalizeProject(project, index, thumbnailCache)));
};

export const createProjectCard = (project) => {
  const card = document.createElement("a");
  const shop = document.createElement("span");
  const title = document.createElement("h2");
  const type = document.createElement("p");
  const image = document.createElement("img");

  card.className = "product-card";
  if (project.typeSlug === "tool") {
    card.classList.add("product-card--tool");
  } else if (project.typeSlug === "unity-shader") {
    card.classList.add("product-card--unity-shader");
  } else if (project.typeSlug === "game-mods") {
    card.classList.add("product-card--game-mods");
  }

  card.href = project.address;
  card.rel = "noreferrer";
  card.dataset.projectId = project.id;
  card.dataset.type = project.typeSlug;
  card.dataset.tag = project.tag;
  card.setAttribute("aria-haspopup", "dialog");

  image.src = project.image;
  image.alt = `${project.productName} thumbnail`;
  image.loading = "lazy";

  shop.textContent = project.shopName;
  title.textContent = project.productName;
  type.className = "product-type";
  type.textContent = project.tag;

  card.append(image, shop, title, type);
  return card;
};
