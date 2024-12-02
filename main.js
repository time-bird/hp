// 動的にheader.htmlのパスを決定
const depth = (window.location.pathname.match(/\//g) || []).length - 1;
const headerPath = '../'.repeat(depth) + 'header.html';

const includeHeader = new XMLHttpRequest();
includeHeader.open("GET", headerPath, true);
includeHeader.onreadystatechange = function () {
  if (includeHeader.readyState === 4 && includeHeader.status === 200) {
    const headerHTML = includeHeader.responseText;
    const header = document.querySelector("#header");
    header.insertAdjacentHTML("afterbegin", headerHTML);

    // すべての `current` クラスを削除
    const allNavItems = header.querySelectorAll('.nav_list');
    allNavItems.forEach(item => {
      item.classList.remove('current');
    });

    // currentクラスを適用するロジック（前回の修正内容を再利用）
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
