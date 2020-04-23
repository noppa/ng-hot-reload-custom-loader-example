class SomeComponentController {
  counter = 0
  incr() { this.counter += 12 }
  decr() { this.counter-- }
}

const SomeComponentControllerLoader = (module) => module
  .controller('SomeComponentController', SomeComponentController)

export default SomeComponentControllerLoader