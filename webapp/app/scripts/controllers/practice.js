'use strict';

  angular.module('knowledgebowl').controller('PracticeCtrl', function ($window, questions, _, $modal, $rootScope, $location) {
  var ctrl = this;
  
  $location.search('1', null)

  ctrl.questionMap = questions.data.questions;

  ctrl.globalFilters = undefined;
  ctrl.showAnswersForAll = true;
  ctrl.showAnswers = {};
  ctrl.showAnswersMap = {};
  ctrl.questionsSelected = {};
  ctrl.availableCategories = [];
  ctrl.selectedCategories = [];
  _.each(ctrl.questionMap, function (questions, category) {
    ctrl.availableCategories.push(category);
    ctrl.showAnswers[category] = true;
    ctrl.questionsSelected[category] = 'All';
  });

  $rootScope.$watch(function () { return ctrl.selectedCategories }, function(newCategories, oldCategories) {
    var addedCategories = [];
    _.each(newCategories, function (category) {
      if(oldCategories.indexOf(category) === -1) {
        addedCategories.push(category);
      }
    });
    _.each(addedCategories, function (category) {
      if(ctrl.globalFilters) {
        ctrl.applyGlobalFilters(category);
      } else {
        ctrl.clearFilters(category);
      }
    });
  })

  ctrl.runCompetition = function () {
    const questions = [];
    $modal({
      size: 'small',
      templateUrl: 'views/modals/practice-competition-settings.html',
      controllerAs: 'ctrl',
      controller: ['$scope', function ($scope) {
        var modalCtrl = this;
        modalCtrl.timerAmount = 20;
        modalCtrl.cancel = function () {
          $scope.$hide();
        };
        modalCtrl.submit = function () {
          ctrl.runningCompetition = true;
          ctrl.competitionTimerAmount = modalCtrl.timerAmount;
          _.each(ctrl.questionMap, function (questionList, category) {
            if(ctrl.selectedCategories.indexOf(category) !== -1) {
              _.each(questionList, function (question) {
                if(question.show) {
                  questions.push(question);
                }
              });
            }
          });
          console.log('RUNNIING WITH TIMER AMOUNT: ', ctrl.competitionTimerAmount);
          ctrl.competitionQuestions = _.shuffle(questions);   
          $scope.$hide();
        };
      }]
    });
  }

  ctrl.printQuiz = function () {
    $window.print(); // Print the current HTML page. Print formatting is done with print.css
  };

  ctrl.applyGlobalFilters = function (category) {
    if(ctrl.globalFilters) {
      var questionsSelected = [];

      // Turn "show" on for all questions, by default.
      _.each(ctrl.questionMap[category], function (question) {
        question.show = true;
      })

      // Apply global range
      if(ctrl.globalFilters.range) {
        _.each(ctrl.questionMap[category], function (question, i) {
          question.show = i + 1 >= ctrl.globalFilters.range.min && i + 1 <= ctrl.globalFilters.range.max;
        });
      }

      // Apply a randomization if selected
      if(ctrl.globalFilters.randomize) {
        var randomAmount = ctrl.globalFilters.randomize;

        if(randomAmount) {
          var subset = _.sampleSize(_.filter(ctrl.questionMap[category], {show: true}), randomAmount);
          _.each(ctrl.questionMap[category], function (question) {
            question.show = !!_.find(subset, {id: question.id});
          });
        }
      }

      // Loop through again to figured out questionsSelected array
      _.each(ctrl.questionMap[category], function (question, i) {
        if(question.show) {
          questionsSelected.push(i + 1);
        }
      });
      
      ctrl.questionsSelected[category] = questionsSelected.join(', ') || 'All';
    }
  };

  ctrl.applyFilters = function (category, questions) {
    var showingAll = true;
    ctrl.questionsSelected[category] = '';
    _.each(questions, function (question, i) {
      ctrl.questionMap[category][i].show = question.show;
      if(ctrl.questionMap[category][i].show) {
        if(!ctrl.questionsSelected[category]) {
          ctrl.questionsSelected[category] = (i+1) + '';
        } else {
          ctrl.questionsSelected[category] += ', ' + (i+1);
        }
      } else {
        showingAll = false;
      }
    });
    if(showingAll) {
      ctrl.questionsSelected[category] = 'All';
    }
  };

  ctrl.clearAllFilters = function () {
    ctrl.globalFilters = undefined;
    _.each(ctrl.questionMap, function (questions, category) {
      ctrl.questionsSelected[category] = 'All';
      _.each(questions, function (question) {
        question.show = true;
      });
    });
  };

  ctrl.clearFilters = function (category) {
    ctrl.questionsSelected[category] = 'All';
    _.each(ctrl.questionMap[category], function (question) {
      question.show = true;
    });
  };

  ctrl.globalFilterModal = function () {
    $modal({
      size: 'large',
      templateUrl: 'views/modals/global-category-filter.html',
      controllerAs: 'ctrl',
      controller: ['$scope', function ($scope) {
        var modalCtrl = this;
        modalCtrl.globalFilters = undefined;
        modalCtrl.questionRange = { 
          min: 1, 
          max: 99 
        };
        modalCtrl.cancel = function () {
          $scope.$hide();
        };
        modalCtrl.applyFilters = function () {
          if(modalCtrl.globalFilters) {
            ctrl.globalFilters = modalCtrl.globalFilters;
            _.each(ctrl.selectedCategories, function (category) {
              ctrl.applyGlobalFilters(category);
            });
          }
          $scope.$hide();
        };
        modalCtrl.applyRandomization = function (amount) {
          modalCtrl.globalFilters = {
            randomize: amount
          };
        };
        modalCtrl.applyRange = function (min, max, randomization) {
          modalCtrl.globalFilters = {
            range: {
              min: min,
              max: max
            }
          }
          if(randomization) {
            modalCtrl.globalFilters.randomize = randomization;
          }
        }

        modalCtrl.selectRandomization = function () {
          $modal({
            templateUrl: 'views/modals/global-category-filter__randomization.html',
            controllerAs: 'ctrl',
            controller: ['$scope', function ($scope) {
              var selectRandoCtrl = this;
              selectRandoCtrl.questionRange = modalCtrl.questionRange;
              selectRandoCtrl.amount = 50;

              selectRandoCtrl.cancel = function () {
                $scope.$hide();
              };
              selectRandoCtrl.applyRandomization = function () {
                modalCtrl.applyRandomization(selectRandoCtrl.amount);
                $scope.$hide();
              };
            }]
          });
        };

        modalCtrl.selectRange = function () {
          $modal({
            templateUrl: 'views/modals/global-category-filter__range.html',
            controllerAs: 'ctrl',
            controller: ['$scope', function ($scope) {
              var selectRangeCtrl = this;
              selectRangeCtrl.range = {
                min: 1,
                max: modalCtrl.questionRange.max,
                options: {
                  floor: 1,
                  ceil: modalCtrl.questionRange.max,
                }
              };

              selectRangeCtrl.maxPossibleResults = function () {
                return selectRangeCtrl.range.max - selectRangeCtrl.range.min + 1
              };

              selectRangeCtrl.cancel = function () {
                $scope.$hide();
              };
              selectRangeCtrl.applyRange = function () {
                modalCtrl.applyRange(selectRangeCtrl.range.min, selectRangeCtrl.range.max, (selectRangeCtrl.randomizeResults && selectRangeCtrl.numQuestions));
                $scope.$hide();
              };
            }],
            resolve: {
              questions: function () {
                return _.cloneDeep(modalCtrl.questions);
              },
              category: function () {
                return modalCtrl.category;
              }
            }
          });
        };
        
      }]
    });
  }

  ctrl.advancedFilterModal = function (category) {
    var questions = ctrl.questionMap[category];
    var modal = $modal({
      size: 'large',
      templateUrl: 'views/modals/advanced-category-filter.html',
      controllerAs: 'ctrl',
      controller: ['$scope', 'questions', 'category', function ($scope, questions, category) {
        var modalCtrl = this;
        modalCtrl.questions = questions;
        modalCtrl.category = category;
        modalCtrl.cancel = function () {
          $scope.$hide();
        };
        modalCtrl.applyFilters = function () {
          ctrl.applyFilters(modalCtrl.category, modalCtrl.questions);
          $scope.$hide();
        };
        modalCtrl.applyRange = function (range, randomAmount) {
          _.each(modalCtrl.questions, function (question, i) {
            question.show = !((i + 1) < range.min || (i + 1) > range.max);
          });

          // Filter a randomized amount if selected
          if(randomAmount) {
            var subset = _.sampleSize(_.filter(modalCtrl.questions, {show: true}), randomAmount);
            modalCtrl.applyRandomization(subset);
          }
        };
        modalCtrl.applyRandomization = function (randomizedQuestions) {
          _.each(modalCtrl.questions, function (question) {
            question.show = !!_.find(randomizedQuestions, {id: question.id});
          });
        };

        modalCtrl.selectRandomization = function () {
          $modal({
            templateUrl: 'views/modals/advanced-category-filter__randomization.html',
            controllerAs: 'ctrl',
            controller: ['$scope', 'questions', 'category', function ($scope, questions, category) {
              var selectRandoCtrl = this;
              selectRandoCtrl.questions = questions;
              selectRandoCtrl.category = category;
              selectRandoCtrl.amount = questions.length / 2;

              selectRandoCtrl.cancel = function () {
                $scope.$hide();
              };
              selectRandoCtrl.applyRandomization = function () {
                modalCtrl.applyRandomization(_.sampleSize(selectRandoCtrl.questions, selectRandoCtrl.amount));
                $scope.$hide();
              };
            }],
            resolve: {
              questions: function () {
                return _.cloneDeep(modalCtrl.questions);
              },
              category: function () {
                return modalCtrl.category;
              }
            }
          });
        };

        modalCtrl.selectRange = function () {
          $modal({
            templateUrl: 'views/modals/advanced-category-filter__range.html',
            controllerAs: 'ctrl',
            controller: ['$scope', 'questions', 'category', function ($scope, questions, category) {
              var selectRangeCtrl = this;
              selectRangeCtrl.questions = questions;
              selectRangeCtrl.category = category;
              selectRangeCtrl.range = {
                min: 1,
                max: selectRangeCtrl.questions.length,
                options: {
                  floor: 1,
                  ceil: selectRangeCtrl.questions.length,
                }
              };

              selectRangeCtrl.maxPossibleResults = selectRangeCtrl.questions.length;
              var updateMaxPossibleResults = function () {
                selectRangeCtrl.maxPossibleResults = selectRangeCtrl.range.max - selectRangeCtrl.range.min + 1;
              };
              $scope.$watch(function () {return selectRangeCtrl.range.min;}, updateMaxPossibleResults);
              $scope.$watch(function () {return selectRangeCtrl.range.max;}, updateMaxPossibleResults);

              selectRangeCtrl.cancel = function () {
                $scope.$hide();
              };
              selectRangeCtrl.applyRange = function () {
                modalCtrl.applyRange(selectRangeCtrl.range, (selectRangeCtrl.randomizeResults && selectRangeCtrl.numQuestions));
                $scope.$hide();
              };
            }],
            resolve: {
              questions: function () {
                return _.cloneDeep(modalCtrl.questions);
              },
              category: function () {
                return modalCtrl.category;
              }
            }
          });
        };

        // Manual selection controls
        modalCtrl.manuallySelect = function () {
          modalCtrl.showManualSelections = true;
          modalCtrl.manualSelections = _.cloneDeep(questions);
          _.each(modalCtrl.manualSelections, function (val, i) {
            modalCtrl.manualSelections[i].show = false;
          });
        };
        modalCtrl.discardManualSelections = function () {
          modalCtrl.showManualSelections = false;
        };

        // Range slider controls
        modalCtrl.rangeSelections = [];
        modalCtrl.addRangeSlider = function () {
          modalCtrl.rangeSelections.push({
            min: 1,
            max: modalCtrl.questions.length,
            options: {
              floor: 1,
              ceil: modalCtrl.questions.length,
            },
          });
        };
        modalCtrl.removeRangeSlider = function ($index) {
          modalCtrl.rangeSelections.splice($index, 1);
        }
      }],
      resolve: {
        category: function () {
          return category;
        },
        questions: function () {
          return _.cloneDeep(questions);
        }
      }
    });
  };

  ctrl.toggleShowAllAnswerInput = function () {
    _.each(ctrl.showAnswers, function (val, key) {
      ctrl.showAnswers[key] = ctrl.showAnswersForAll;
    });
  };

  ctrl.showAnswerChanged = function () {
    var showingAll = true;
    var hidingAll = true;
    _.each(ctrl.selectedCategories, function (category) {
      if(ctrl.showAnswers[category]) {
        hidingAll = false;
      } else {
        showingAll = false;
      }
    });
    if(showingAll) {
      ctrl.showAnswersForAll = true;
    } else if (hidingAll) {
      ctrl.showAnswersForAll = false;
    }
  }

});
