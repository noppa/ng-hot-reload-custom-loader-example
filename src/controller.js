class SomeComponentController {
  counter = 0
  incr() { this.counter += 1 }
  decr() { this.counter-- }
}

export const SomeComponentControllerLoader = (module) => module
  .controller('SomeComponentController', SomeComponentController)
