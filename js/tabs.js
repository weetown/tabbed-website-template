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

    // create tab button
    const btn = document.createElement("button");
    btn.className = "tablinks";
    btn.dataset.tab = tabId;
    btn.dataset.file = filePath;
    btn.dataset.container = containerId;
    btn.textContent = tabName;
    if (index === 0) btn.id = "defaultOpen";
    nav.appendChild(btn);

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
});

function openTab(evt, tabId, containerId, filePath) {
  document.querySelectorAll(".tabcontent").forEach(tab => {
    tab.style.display = "none";
  });

  document.querySelectorAll(".tablinks").forEach(link => {
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
