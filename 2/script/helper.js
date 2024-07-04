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
      if (k === "html") {
        el.innerHTML = v;
        continue;
      }
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
 * @param {boolean} clear
 */
export function mount(target, childrens, clear) {
  if (clear) {
    clearElement(target);
  }
  for (const c of childrens) {
    if (childrens.indexOf(c) === -1) {
      continue;
    }
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

/**
 * @template T
 * @param {T} value
 * @returns {Store<T>}
 */
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
  function update(fn) {
    set(fn(value) || value);
  }
  return {
    subscribe,
    set,
    update,
  };
}

/**
 * @template T
 * @typedef {object} Store
 * @property {(v: T)} set
 * @property {(cb: (v: T))} subscribe
 * @property {(cb: (v: T) => T | undefined)} update
 */

/** @type {HTMLStyleElement} */
const style = h("style", { id: "css-in-js" });
const styleSet = new Set();
function camelToKebab(str) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
/**
 * @param {Record<string, string>} props
 * @returns
 */
export function css(props) {
  const str = Object.keys(props)
    .sort()
    .map((k) => `${camelToKebab(k)}: ${props[k]};`)
    .join("");
  const before = styleSet.size;
  styleSet.add(str);
  const after = styleSet.size;
  const index = Array.from(styleSet).indexOf(str);
  const name = "falentio-" + index.toString(16);
  if (before !== after) {
    style.innerHTML += `\n .${name} {${str}}`;
  }
  return name;
}
document.head.appendChild(style);
