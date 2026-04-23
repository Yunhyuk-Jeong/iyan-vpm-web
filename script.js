document.documentElement.classList.add("js");

const topTabs = document.querySelector(".top-tabs");
const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
const sections = sectionLinks
  .map((link) => document.getElementById(link.dataset.sectionLink))
  .filter(Boolean);
const portfolioSection = document.getElementById("portfolio");

const updateTabIndicator = (activeLink) => {
  if (!topTabs || !activeLink) {
    return;
  }

  const tabBounds = topTabs.getBoundingClientRect();
  const activeBounds = activeLink.getBoundingClientRect();
  topTabs.style.setProperty("--tab-indicator-width", `${activeBounds.width}px`);
  topTabs.style.setProperty("--tab-indicator-x", `${activeBounds.left - tabBounds.left}px`);
};

const setActiveSection = (sectionId) => {
  let activeLink = null;

  sectionLinks.forEach((link) => {
    const isActive = link.dataset.sectionLink === sectionId;
    link.classList.toggle("top-tab--active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
      activeLink = link;
      return;
    }

    link.removeAttribute("aria-current");
  });

  updateTabIndicator(activeLink);
};

const updateActiveSectionFromScroll = () => {
  if (!portfolioSection) {
    setActiveSection("home");
    return;
  }

  const activationLine = window.innerHeight * 0.45;
  const portfolioTop = portfolioSection.getBoundingClientRect().top;
  setActiveSection(portfolioTop <= activationLine ? "portfolio" : "home");
};

sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveSection(link.dataset.sectionLink);
  });
});
window.addEventListener("scroll", updateActiveSectionFromScroll, { passive: true });
window.addEventListener("resize", () => {
  updateActiveSectionFromScroll();
  updateTabIndicator(document.querySelector(".top-tab--active"));
});
updateActiveSectionFromScroll();

if (portfolioSection) {
  const portfolioRevealObserver = new IntersectionObserver(
    ([entry]) => {
      portfolioSection.classList.toggle("is-visible", entry.isIntersecting);
    },
    {
      rootMargin: "-12% 0px -18% 0px",
      threshold: 0.18,
    },
  );

  portfolioRevealObserver.observe(portfolioSection);
}
