export default class Counter {
  private count: number;
  constructor(count: number) {
    this.count = count
  }

  increment() {
    this.count += 1
  }

  decrement() {
    this.count -= 1
  }
}
