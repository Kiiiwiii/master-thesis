export const debouncer = (fn: (...agrs: any[]) => void, debounceTime = 1000) => {
  let timer: any;
  let myargs: any;
  return (...args: any[]) => {
    myargs = args;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      fn(...myargs);
    }, debounceTime);
  }
}