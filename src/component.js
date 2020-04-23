import SomeComponentTemplate from './SomeComponentTemplate.html';

const SomeComponent = {
    template: SomeComponentTemplate,
    controller: 'SomeComponentController',
};

const SomeComponentLoader = (module) => module.component('someComponent', SomeComponent);

export default SomeComponentLoader