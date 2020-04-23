import angular from 'angular'

import SomeComponentControllerLoader from './controller'
import SomeComponentLoader from './component'

const demoModule = angular.module('hot-reload-demo', [])

SomeComponentControllerLoader(demoModule)
SomeComponentLoader(demoModule)