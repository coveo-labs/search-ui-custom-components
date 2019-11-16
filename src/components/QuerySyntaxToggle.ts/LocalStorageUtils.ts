let localStorage: any;

// This check must be made in a try/catch. If cookies are disabled for a
// browser then window.localStorage will throw an undefined exception.
try {
  localStorage = window.localStorage;
} catch (error) {
  localStorage = null;
}

export class LocalStorageUtils<T> {
  constructor(public id: string) {}

  public save(data: T) {
    try {
      if (localStorage != null) {
        localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(data));
      }
      // tslint:disable-next-line:no-empty
    } catch (error) {}
  }

  public load(): T | null {
    try {
      if (localStorage == null) {
        return null;
      }
      const value = localStorage.getItem(this.getLocalStorageKey());
      return value && JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  public remove(key?: string) {
    try {
      if (localStorage != null) {
        if (key === undefined) {
          localStorage.removeItem(this.getLocalStorageKey());
        } else {
          const oldObj: any = this.load();
          delete oldObj[key];
          this.save(oldObj);
        }
      }
      // tslint:disable-next-line:no-empty
    } catch (error) {}
  }

  private getLocalStorageKey() {
    return 'coveo-' + this.id;
  }
}
