interface IRoutes {
  path: string | RegExp;
  cb: (...rest: (string | number | boolean)[]) => void;
}
interface IRouterArgs {
  mode: 'history' | 'hash';
  root: string;
}

class Router implements IRouterArgs {
  interval?: NodeJS.Timeout;

  current?: string;

  routes: IRoutes[] = [];

  root = '/';

  mode = (
    (): 'history' | 'hash' => (
      'pushState' in window.history ? 'history' : 'hash'))();

  constructor({ mode, root }: IRouterArgs) {
    this.mode = 'pushState' in window.history ? 'history' : 'hash';
    if (mode) this.mode = mode;
    if (root) this.root = root;
    this.listen();
  }

  add = (
    path: string | RegExp,
    cb: (...rest: (string | number | boolean)[]) => void
  ): Router => {
    this.routes.push({ path, cb });
    return this;
  };

  remove = (path: string): Router => {
    for (let i = 0; i < this.routes.length; i += 1) {
      if (this.routes[i]?.path === path) {
        this.routes.slice(i, 1);
        return this;
      }
    }
    return this;
  };

  flush = (): Router => {
    this.routes = [];
    return this;
  };

  clearSlashes = (path: string): string => path
    .toString().replace(/\/$/, '').replace(/^\//, '');

  getFragment = (): string => {
    let fragment = '';
    if (this.mode === 'history') {
      fragment = this.clearSlashes(
        decodeURI(window.location.pathname + window.location.search)
      );
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      const match = window.location.href.match(/#(.*)$/);
      fragment = match ? (match[1] as string) : '';
    }
    return this.clearSlashes(fragment);
  };

  navigate = (path = ''): Router => {
    if (this.mode === 'history') {
      window.history.pushState(null, '', this.root + this.clearSlashes(path));
    } else {
      window.location.href = `${window.location.href.replace(
        /#(.*)$/,
        ''
      )}#${path}`;
    }
    return this;
  };

  listen = (): void => {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(this.intervalFunc, 50);
  };

  intervalFunc = (): void => {
    if (this.current === this.getFragment()) return;
    this.current = this.getFragment();
    this.routes.some((route) => {
      const match: RegExpMatchArray | null | undefined = this.current?.match(
        route.path
      );
      if (match) {
        match.shift();
        route.cb.apply({}, match);
        return match;
      }
      return false;
    });
  };
}

export default Router;
