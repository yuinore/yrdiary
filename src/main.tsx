import * as React from 'react';
import ReactDOM from 'react-dom';
import Hello from './Hello';

// -------- mock ResizeObserver --------
// -- https://kuma-emon.com/it/pc/1539/
let instanceResize: ResizeObserver | null = null;
let callbackResize: ResizeObserverCallback | null = null;
global.ResizeObserver = class mockResizeObjerver {
  constructor(callback: ResizeObserverCallback) {
    instanceResize = this;
    callbackResize = callback;
  }

  disconnect() {}

  observe(target: Element, options?: ResizeObserverOptions) {}

  unobserve(target: Element) {}
};
//-------------------------------------

ReactDOM.render(
  <React.StrictMode>
    <Hello />
  </React.StrictMode>,
  document.getElementById('main'),
);
