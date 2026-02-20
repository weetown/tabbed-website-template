document.addEventListener("DOMContentLoaded", function () {
  const config = window.tabConfig || [];
  const staticContent = window.staticTabContent || {};
  const main = document.getElementById("main");
  const nav = document.querySelector("nav .tab");
  const mobileNav = document.querySelector("nav .mobile-top-tabs");

  config.forEach((tab, index) => {
    const tabName = tab.label;
    const filePath = tab.file;
    const tabId = tabName.replace(/\s+/g, "-");
    const containerId = `${tabId.toLowerCase()}-content`;

    // create desktop tab button
    const btn = document.createElement("button");
    btn.className = "tablinks";
    btn.dataset.tab = tabId;
    btn.dataset.file = filePath;
    btn.dataset.container = containerId;
    btn.textContent = tabName;
    if (index === 0) btn.id = "defaultOpen";
    nav.appendChild(btn);

    // create mobile tab button
    if (mobileNav) {
      const mobileBtn = document.createElement("button");
      mobileBtn.className = "tablinks";
      mobileBtn.dataset.tab = tabId;
      mobileBtn.dataset.file = filePath;
      mobileBtn.dataset.container = containerId;
      mobileBtn.textContent = tabName;
      mobileNav.appendChild(mobileBtn);

      mobileBtn.addEventListener("click", (e) => {
        openTab(e, tabId, containerId, filePath);
      });
    }

    // create article + content div
    if (!document.getElementById(tabId)) {
      const article = document.createElement("article");
      article.className = "tabcontent";
      article.id = tabId;

      const div = document.createElement("div");
      div.id = containerId;

      if (filePath === null && staticContent[tabName]) {
        div.innerHTML = staticContent[tabName];
      } else {
        div.textContent = "Loading...";
      }

      article.appendChild(div);
      main.appendChild(article);
    }

    btn.addEventListener("click", (e) => {
      openTab(e, tabId, containerId, filePath);
    });
  });

  const defaultTab = document.getElementById("defaultOpen");
  if (defaultTab) defaultTab.click();

  setupMobileSidebars();
});

function setupMobileSidebars() {
  const body = document.body;
  const leftToggle = document.getElementById("left-sidebar-toggle");
  const rightToggle = document.getElementById("right-sidebar-toggle");
  const backdrop = document.getElementById("sidebar-backdrop");

  if (!leftToggle || !rightToggle || !backdrop) return;

  const setState = (state = "") => {
    body.classList.remove("left-open", "right-open");
    if (state) body.classList.add(state);

    const leftOpen = state === "left-open";
    const rightOpen = state === "right-open";

    leftToggle.setAttribute("aria-expanded", String(leftOpen));
    leftToggle.setAttribute("aria-label", leftOpen ? "Close left sidebar" : "Open left sidebar");
    leftToggle.innerHTML = `<span class="chevron" aria-hidden="true">${leftOpen ? "‹" : "›"}</span>`;

    rightToggle.setAttribute("aria-expanded", String(rightOpen));
    rightToggle.setAttribute("aria-label", rightOpen ? "Close right sidebar" : "Open right sidebar");
    rightToggle.innerHTML = `<span class="chevron" aria-hidden="true">${rightOpen ? "›" : "‹"}</span>`;

    backdrop.hidden = !(leftOpen || rightOpen);
  };

  leftToggle.addEventListener("click", () => {
    setState(body.classList.contains("left-open") ? "" : "left-open");
  });

  rightToggle.addEventListener("click", () => {
    setState(body.classList.contains("right-open") ? "" : "right-open");
  });

  backdrop.addEventListener("click", () => setState(""));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setState("");
  });

  setState("");
}

function openTab(evt, tabId, containerId, filePath) {
  document.querySelectorAll(".tabcontent").forEach(tab => {
    tab.style.display = "none";
  });

  document.querySelectorAll(".tablinks").forEach(link => {
    link.classList.remove("active");
    if (link.dataset.tab === tabId) {
      link.classList.add("active");
    }
  });

  const article = document.getElementById(tabId);
  if (article) article.style.display = "block";

  if (filePath) {
    loadTabContent(containerId, filePath);
  }
}

function loadTabContent(containerId, filePath) {
  fetch(`pages/${filePath}`) //if you wanna change the name of the folder your html is in, edit the "pages" part of this
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = html;
    })
    .catch(err => {
      console.error(`error loading ${filePath}:`, err);
    });
}
