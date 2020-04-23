class SomeComponentController {
  counter = 0
  incr() { this.counter++ }
  decr() { this.counter-- }
}

const SomeComponentControllerLoader = (module) => module
  .controller('SomeComponentController', SomeComponentController)

export default SomeComponentControllerLoader