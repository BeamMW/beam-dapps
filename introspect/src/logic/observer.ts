abstract class Observer<T> {
  readonly observers: Set<(res: T) => void > = new Set();

  readonly attach = (
    ...handlers: ((res: T) => void) []
  ): void => {
    handlers.forEach((handler) => {
      this.observers.add(handler);
    });
  };

  protected readonly notifyAll = (parsed:T):void => {
    this.observers.forEach((element) => {
      element(parsed);
    });
  };

  protected readonly deleteSubscriber = (handler: (res: T) => void): void => {
    this.observers.delete(handler);
  };
}

export default Observer;
