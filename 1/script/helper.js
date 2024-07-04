/**
 * fungsi untuk memudahkan menangani pembuatan DOM
 * @param {string} tag
 * @param {Record<string,any> | null} props
 * @param {Array<HTMLElement> | string =} childrens
 */
export function h(tag, props, childrens) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      el.setAttribute(k, v);
    }
  }
  if (typeof childrens === "string") {
    el.innerText = childrens;
  } else if (childrens) {
    mount(el, childrens);
  }
  return el;
}

/**
 * @param {HTMLElement} target
 * @param {Array<HTMLElement>} childrens
 */
export function mount(target, childrens) {
  for (const c of childrens) {
    target.appendChild(c);
  }
}

/**
 * @param {HTMLElement} el
 */
export function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

export function store(value) {
  const listener = [];
  function set(newValue) {
    value = newValue;
    for (const fn of listener) {
      fn(value);
    }
  }
  function subscribe(fn) {
    fn(value);
    listener.push(fn);
  }
  return {
    subscribe,
    set,
  };
}