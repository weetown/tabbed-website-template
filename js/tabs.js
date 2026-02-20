document.addEventListener("DOMContentLoaded", function () {
  const config = window.tabConfig || [];
  const staticContent = window.staticTabContent || {};
  const main = document.getElementById("main");
  const nav = document.querySelector("nav .tab");

  config.forEach((tab, index) => {
    const tabName = tab.label;
    const filePath = tab.file;
    const tabId = tabName.replace(/\s+/g, "-");
    const containerId = `${tabId.toLowerCase()}-content`;

    const btn = document.createElement("button");
    btn.className = "tablinks";
    btn.dataset.tab = tabId;
    btn.dataset.file = filePath;
    btn.dataset.container = containerId;
    btn.textContent = tabName;
    if (index === 0) btn.id = "defaultOpen";
    nav.appendChild(btn);

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

  setupMobileSidebarControls();
});

function openTab(evt, tabId, containerId, filePath) {
  document.querySelectorAll(".tabcontent").forEach((tab) => {
    tab.style.display = "none";
  });

  document.querySelectorAll(".tablinks").forEach((link) => {
    link.classList.remove("active");
  });

  const article = document.getElementById(tabId);
  if (article) article.style.display = "block";
  evt.currentTarget.classList.add("active");

  if (filePath) {
    loadTabContent(containerId, filePath);
  }
}

function loadTabContent(containerId, filePath) {
  fetch(`pages/${filePath}`)
    .then((res) => res.text())
    .then((html) => {
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = html;
    })
    .catch((err) => {
      console.error(`error loading ${filePath}:`, err);
    });
}

function setupMobileSidebarControls() {
  const leftToggle = document.getElementById("mobile-left-toggle");
  const rightToggle = document.getElementById("mobile-right-toggle");

  if (!leftToggle || !rightToggle) return;

  const leftIcon = leftToggle.querySelector("i");
  const rightIcon = rightToggle.querySelector("i");

  const closeAll = () => {
    document.body.classList.remove("left-open", "right-open");
  };

  const setChevron = (iconEl, className) => {
    if (!iconEl) return;
    iconEl.classList.remove("fa-chevron-left", "fa-chevron-right");
    iconEl.classList.add(className);
  };

  const syncSidebarUI = () => {
    const leftOpen = document.body.classList.contains("left-open");
    const rightOpen = document.body.classList.contains("right-open");

    leftToggle.setAttribute("aria-expanded", String(leftOpen));
    rightToggle.setAttribute("aria-expanded", String(rightOpen));

    leftToggle.setAttribute("aria-label", leftOpen ? "Close left sidebar" : "Open left sidebar");
    rightToggle.setAttribute("aria-label", rightOpen ? "Close right sidebar" : "Open right sidebar");

    setChevron(leftIcon, leftOpen ? "fa-chevron-left" : "fa-chevron-right");
    setChevron(rightIcon, rightOpen ? "fa-chevron-right" : "fa-chevron-left");
  };

  leftToggle.addEventListener("click", () => {
    const leftOpen = document.body.classList.contains("left-open");
    closeAll();
    if (!leftOpen) document.body.classList.add("left-open");
    syncSidebarUI();
  });

  rightToggle.addEventListener("click", () => {
    const rightOpen = document.body.classList.contains("right-open");
    closeAll();
    if (!rightOpen) document.body.classList.add("right-open");
    syncSidebarUI();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAll();
      syncSidebarUI();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeAll();
      syncSidebarUI();
    }
  });

  syncSidebarUI();
}
