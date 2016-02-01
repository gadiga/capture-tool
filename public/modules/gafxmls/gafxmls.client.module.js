'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('gafxmls',['globals','xeditable','checklist-model','angularResizable']);

angular.module('gafxmls').run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});