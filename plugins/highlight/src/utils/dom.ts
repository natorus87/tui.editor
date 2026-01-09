export function findParentByClassName(el: HTMLElement, className: string) {
  let currentEl: HTMLElement | null = el;

  while (currentEl && !currentEl.classList.contains(className)) {
    currentEl = currentEl.parentElement;
  }

  return currentEl;
}
