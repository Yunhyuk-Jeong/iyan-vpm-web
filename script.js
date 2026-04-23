const projects = [
  {
    title: "Creator Tool Suite",
    type: "Automation",
    description:
      "반복 작업을 줄이는 개인 제작 도구 모음입니다. 작은 입력으로 빠르게 결과를 확인하는 흐름에 집중했습니다.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    tags: ["Tools", "Workflow", "UX"],
  },
  {
    title: "Personal Knowledge Hub",
    type: "Product Design",
    description:
      "메모, 프로젝트, 참고 자료를 한 곳에 묶어 다음 행동이 바로 보이도록 설계한 개인 지식 관리 콘셉트입니다.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    tags: ["Notes", "Systems", "Prototype"],
  },
  {
    title: "Interactive Profile",
    type: "Web Experience",
    description:
      "정적 페이지에서도 감각적인 첫인상과 명확한 정보 구조를 전달할 수 있도록 만든 반응형 웹 경험입니다.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    tags: ["Frontend", "Responsive", "A11y"],
  },
];

const root = document.documentElement;
const header = document.querySelector(".site-header");
const grid = document.querySelector("#project-grid");
const year = document.querySelector("#year");
const themeToggle = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme) {
  root.dataset.theme = storedTheme;
}

year.textContent = new Date().getFullYear();

grid.innerHTML = projects
  .map(
    (project) => `
      <article class="project-card">
        <div class="project-card__image">
          <img src="${project.image}" alt="${project.title} preview" loading="lazy" />
        </div>
        <div class="project-card__body">
          <span class="project-card__meta">${project.type}</span>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tag-row" aria-label="${project.title} tags">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
        </div>
      </article>
    `,
  )
  .join("");

const updateHeader = () => {
  header.dataset.elevated = window.scrollY > 12 ? "true" : "false";
};

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "" : "dark";

  if (nextTheme) {
    root.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    return;
  }

  delete root.dataset.theme;
  localStorage.removeItem("theme");
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
