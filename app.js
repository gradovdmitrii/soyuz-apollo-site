'use strict';
// Небольшие улучшения поверх читаемого HTML: выбор модуля станции, шаги примера,
// копирование образца и мобильное меню. Без JavaScript страница остаётся полной.
(() => {
  document.documentElement.classList.add('js');
  const all = (selector) => [...document.querySelectorAll(selector)];

  // Модули станции: кнопки и области на рисунке переключают одно пояснение.
  const moduleButtons = all('[data-select-module]');
  const readout = document.querySelector('.readout');
  function selectModule(key, announce) {
    if (!moduleButtons.some(button => button.dataset.selectModule === key)) return;
    if (readout) readout.setAttribute('aria-live', announce ? 'polite' : 'off');
    moduleButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.selectModule === key)));
    all('[data-panel-module]').forEach(panel => { panel.hidden = panel.dataset.panelModule !== key; });
    all('.module-highlights [data-module]').forEach(group => group.classList.toggle('is-active', group.dataset.module === key));
  }
  moduleButtons.forEach(button => button.addEventListener('click', () => selectModule(button.dataset.selectModule, true)));
  all('.module-highlights [data-module]').forEach(group => group.addEventListener('click', () => selectModule(group.dataset.module, true)));
  selectModule('core', false);

  // Три шага примера передачи.
  const stepButtons = all('[data-select-step]');
  const stepPanels = document.querySelector('.example-panels');
  function selectStep(key, announce) {
    if (stepPanels) stepPanels.setAttribute('aria-live', announce ? 'polite' : 'off');
    stepButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.selectStep === key)));
    all('[data-panel-step]').forEach(panel => { panel.hidden = panel.dataset.panelStep !== key; });
  }
  stepButtons.forEach(button => button.addEventListener('click', () => selectStep(button.dataset.selectStep, true)));
  if (stepButtons.length) selectStep('2', false);

  // Копирование образца первого сообщения. «Скопировано» — только после успеха.
  const copyButton = document.getElementById('copy-prompt');
  const copyStatus = document.getElementById('copy-status');
  const prompt = document.getElementById('starter-prompt');
  if (copyButton && copyStatus && prompt) {
    copyButton.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(prompt.textContent);
        copyStatus.textContent = 'Скопировано';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(prompt);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copyStatus.textContent = 'Текст выделен. Нажмите Ctrl+C или ⌘C.';
      }
    });
  }

  // Мобильное меню: закрывается по ссылке, Escape и нажатию вне шапки.
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  if (menuButton && nav) {
    const closeMenu = (returnFocus = false) => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      if (returnFocus) menuButton.focus();
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header')) closeMenu();
    });
  }
})();
