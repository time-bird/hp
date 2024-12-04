// 動的にheader.htmlのパスを決定
const currentPath = window.location.pathname;
const depth = (currentPath.match(/\//g) || []).length - 1;
const headerPath = './' + '../'.repeat(depth) + 'header.html';

// #headerの存在を確認してから動作
document.addEventListener("DOMContentLoaded", () => {
  const includeHeader = new XMLHttpRequest();
  includeHeader.open("GET", headerPath, true);
  includeHeader.onreadystatechange = function () {
    if (includeHeader.readyState === 4) {
      if (includeHeader.status === 200) {
        const headerHTML = includeHeader.responseText;
        const header = document.querySelector("#header");
        if (header) {
          header.insertAdjacentHTML("afterbegin", headerHTML);
          console.log("Header loaded successfully:", headerPath);
        } else {
          console.error("#header element not found in DOM.");
        }
      } else {
        console.error(`Failed to load header.html: ${headerPath} (status: ${includeHeader.status})`);
      }
    }
  };
  includeHeader.send();
});

// ヘッダーを動的にインクルード
const includeHeader = new XMLHttpRequest();
includeHeader.open("GET", headerPath, true);
includeHeader.onreadystatechange = function () {
  if (includeHeader.readyState === 4 && includeHeader.status === 200) {
    const headerHTML = includeHeader.responseText;
    const header = document.querySelector("#header");
    header.insertAdjacentHTML("afterbegin", headerHTML);

    // 動的にリンクパスを補正
    const links = header.querySelectorAll("a, img");
    links.forEach(link => {
      const originalPath = link.getAttribute("href") || link.getAttribute("src");
      if (originalPath && !originalPath.startsWith("http") && !originalPath.startsWith("#")) {
        const adjustedPath = './' + '../'.repeat(depth) + originalPath.replace(/^\//, '');
        if (link.tagName === "A") {
          link.setAttribute("href", adjustedPath);
        } else if (link.tagName === "IMG") {
          link.setAttribute("src", adjustedPath);
        }
      }
    });

    // すべての `current` クラスを削除
    const allNavItems = header.querySelectorAll('.nav_list');
    allNavItems.forEach(item => {
      item.classList.remove('current');
    });

    // 現在のページに応じて`current`クラスを設定
    const currentFullPath = window.location.pathname;
    const navLinks = header.querySelectorAll('.nav_list > a');

    navLinks.forEach(link => {
      const linkFullPath = new URL(link.getAttribute('href'), window.location.origin).pathname;

      if ((currentFullPath === '/' || currentFullPath.endsWith('index.html')) && linkFullPath.endsWith('index.html')) {
        link.parentElement.classList.add('current');
      } else if (currentFullPath === linkFullPath) {
        link.parentElement.classList.add('current');
      } else {
        const subLinks = link.parentElement.querySelectorAll('.dd_list a');
        subLinks.forEach(subLink => {
          const subLinkFullPath = new URL(subLink.getAttribute('href'), window.location.origin).pathname;
          if (currentFullPath === subLinkFullPath) {
            link.parentElement.classList.add('current');
          }
        });
      }
    });
  }
};
includeHeader.send();
