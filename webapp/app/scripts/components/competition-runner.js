'use strict';

angular.module('knowledgebowl').component('competitionRunner', {
  templateUrl: 'views/components/competition-runner.html',
  controllerAs: 'ctrl',
  bindings: {
    questions: '=',
    timerAmount: '=?',
    isPractice: '=?'
  },
  bindToController: true,
  controller: ['_', '$interval', '$api', 'toastr', '$rootScope', function (_, $interval, $api, toastr, $rootScope) {
    $rootScope.runningCompetition = true;

    var ctrl = this;
    ctrl.$onInit = function () {
      ctrl.timer = ctrl.timerAmount && ctrl.timerAmount > 0 ? ctrl.timerAmount : 20;
      ctrl.fontSize = 20;
    
      ctrl.currentQuestion = ctrl.questions[0];
      ctrl.currentQuestionIdx = 0;
      ctrl.showQuestion = true;
      ctrl.showAnswer = false;
      ctrl.time = ctrl.timer;
      ctrl.questionIdStr = '';
      _.each(ctrl.questions, function (question, i) {
        ctrl.questionIdStr += question.id;
        if(i !== ctrl.questions.length - 1) {
          ctrl.questionIdStr += ',';
        }
      });
  
      ctrl.setSettings = function(e) {
        e.preventDefault();
        if(ctrl.settingsForm.$valid) {
    
          var categoryIds = [];
          _.each(ctrl.settings.categories, function(category) {
            categoryIds.push(category.id);
          });
    
          ctrl.saving = true;
          $api.competition.generateQuestions({
            categories: categoryIds,
            numberOfQuestions: ctrl.settings.numberOfQuestions
          }).then(function (response) {
            ctrl.timer = ctrl.settings.timer;
            startCompetition(response.data);
          }).catch(function (err) {
            console.log(err);
            toastr.error('Error generating competition. Please contact support');
          }).finally(function () {
            ctrl.saving = false;
          });
        }
      };
    
      ctrl.previousQuestion = function () {
        if(ctrl.currentQuestionIdx > 0) {
          ctrl.currentQuestionIdx--;
          ctrl.currentQuestion = ctrl.questions[ctrl.currentQuestionIdx];
          ctrl.timerStarted = false;
          ctrl.timerStopped = false;
          ctrl.showQuestion = true;
          ctrl.showAnswer = false;
          $interval.cancel(ctrl.runningTimer);
        }
      };
    
      ctrl.nextQuestion = function () {
        ctrl.currentQuestionIdx++;
        console.log('Finished? ', ctrl.currentQuestionIdx >= ctrl.questions.length);
        if(ctrl.currentQuestionIdx >= ctrl.questions.length) {
          ctrl.competitionOver = true;
        }
        else {
          ctrl.currentQuestion = ctrl.questions[ctrl.currentQuestionIdx];
          ctrl.timerStopped = false;
          ctrl.timerStarted = false;
          ctrl.showQuestion = true;
          ctrl.showAnswer = false;
          ctrl.time = ctrl.timer;
        }
        $interval.cancel(ctrl.runningTimer);
      };
    
      ctrl.startTimer = function () {
        ctrl.time = ctrl.timer;
        ctrl.timerStarted = true;
        ctrl.runningTimer = $interval(function () {
          if(ctrl.timerStopped) {
            ctrl.timerStarted = false;
            ctrl.timerStopped = true;
            $interval.cancel(ctrl.timer);
            return;
          }
          ctrl.time--;
          if(ctrl.time === 0) {
            $interval.cancel(ctrl.runningTimer);
            ctrl.timerStarted = false;
            ctrl.timerStopped = true;
          }
          else if(ctrl.time === 5) {
            playSound('audio/beep-07');
          }
        }, 1000);
      };
    
      ctrl.stopTimer = function () {
        ctrl.timerStopped = true;
      };
    
      ctrl.revealAnswer = function () {
        ctrl.showQuestion = false;
        ctrl.showAnswer = true;
      };
    
      ctrl.calcFontStyle = function () {
        return {'font-size': ctrl.fontSize + 'px'};
      };
    
      ctrl.downloadAsPowerpoint = function () {
        var pptx = new PptxGenJS();
        var textColor = '333333';
        _.each(ctrl.questions, function (question, i) {
          var slide = pptx.addNewSlide();
          slide.back = 'FFFFFF';
          slide.addText('#' + (i+1) + ' of ' + ctrl.questions.length + ' | Category: ' + question.category + ' | ' + 'Point value: ' + question.point_value, {x:0.25, y:0.25, font_size: 14, color: textColor});
            slide.addText(question.question, {x: 0.25, y: 1.75, font_size: 14, color: textColor});
            slide.addText('Answer: ' + question.answer, {x: 0.25, y: 4, font_size: 14, color: textColor});
        });
    
        pptx.save('Knowledge Bowl');
      };
    
      /**
       * @param {string} filename The name of the file WITHOUT ending
       */
      function playSound(filename){
        document.getElementById('sound').innerHTML='<audio autoplay="autoplay" id="beep"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed id="beepEmbed" hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
    
        var beepCount = 0;
        document.getElementById('beep').addEventListener('ended', function(){
          this.currentTime = 0;
          if(beepCount < 1){
            this.play();
          }
          beepCount++;
        }, false);
      }
    };

  }]
});
