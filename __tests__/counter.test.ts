import * from '../src/counter'

describe('Counter', () => {
  let counter
  beforeEach(() => {
    counter = new Counter(1)
  })
  describe('increment()', () => {
    test('increment', () => {
      counter.increment()
      expect(counter.count).toBe(2)
    })
  })
  describe('decrement()', () => {
    test('decrement', () => {
      counter.decrement()
      expect(counter.count).toBe(0)
    })
  })
})
