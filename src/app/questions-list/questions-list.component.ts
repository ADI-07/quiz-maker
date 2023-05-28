import { Component, Input } from '@angular/core';
import { QuizQuestions } from '../shared/quiz-questions.model';
import { AppService } from '../app.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent {
  quizQuestions: QuizQuestions[] = [];
  quizAnswerForm: FormGroup;
  subscriptions: Subscription[] = [];

  @Input() results: string = "false";

  constructor(private appService: AppService, private formBuilder: FormBuilder, private router: Router) {
    this.quizAnswerForm = this.formBuilder.group({});
  }

  get quizAnsersArray(): FormArray {
    return this.quizAnswerForm.get('questions') as FormArray;
  }

  ngOnInit(): void {
    let quizQuestions$: Observable<QuizQuestions[]> = this.appService.questionsSubject;
    let quizSubscription = quizQuestions$.subscribe((questions: QuizQuestions[]) => {
      this.quizQuestions = questions;
      if (this.results == 'true') {
        this.appService.answerSubject.next(this.appService.calculateScore(this.quizQuestions));
      }
      if (this.results == "false") {
        this.quizAnswerForm = this.formBuilder.group({
          questions: this.formBuilder.array([])
        })
        let questionArray = this.quizAnsersArray;
        questions.forEach((question: QuizQuestions) => {
          questionArray.push(this.formBuilder.group({
            category: new FormControl(question?.category),
            type: new FormControl(question?.type),
            difficulty: new FormControl(question?.difficulty),
            question: new FormControl(question?.question),
            correct_answer: new FormControl(question?.correct_answer),
            incorrect_answers: new FormControl(question?.incorrect_answers),
            answers: new FormControl(question?.answers),
            selected_answer: new FormControl('', Validators.required)
          }))
        })
      }
    })
    this.subscriptions.push(quizSubscription)
  }

  selectOption(question: AbstractControl, selectedOption: string): void {
    question.patchValue({
      selected_answer: selectedOption
    })
  }

  submitQuiz(): void {
    this.appService.questionsSubject.next(this.quizAnswerForm.value.questions);
    this.router.navigate(['results']);
  }

  applyStyleClass(question: QuizQuestions, option: string): string {
    if (question.correct_answer == option) {
      return 'correct-option'
    }
    else if (question.selected_answer != question.correct_answer && option == question.selected_answer) {
      return 'wrong-option'
    }
    else return "options"
  }

  ngOnDestroy(): void{
    this.appService.unsubsribeAllSubscriptions(this.subscriptions);
    this.subscriptions = [];
  }
}
