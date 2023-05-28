import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { Trivia, TriviaCategory } from '../shared/trivia.model';
import { FormGroup, FormControl } from '@angular/forms';
import { QuizOptions } from '../shared/quiz-options.model';
import { QuizQuestions, QuizQuestionsResponse } from '../shared/quiz-questions.model';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {
  trivias: TriviaCategory[] = [];
  difficulties: string[] = ['Easy', 'Medium', 'Hard'];
  questions: QuizQuestions[] = [];
  quizOptions = new FormGroup({
    trivia: new FormControl<Number | null>(null),
    difficulty: new FormControl<String | null>(null)
  })
  flag = false;
  subscriptions: Subscription[] = [];

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    let trivias$: Observable<Trivia> = this.appService.getTrivia();
    let triviSubscription = trivias$.subscribe(
      (trivia: Trivia) => {
        this.trivias = trivia.trivia_categories;
        this.quizOptions.patchValue({
          trivia: this.trivias[0].id,
          difficulty: this.difficulties[0]
        })
      }
    )
    this.subscriptions.push(triviSubscription)
  }

  onCreate(): void {
    this.appService.unsubsribeAllSubscriptions(this.subscriptions);
    this.subscriptions = [];
    this.flag = true;
    this.questions = []
    let questions$: Observable<QuizQuestions[]> = this.appService.getQuestions(JSON.parse(JSON.stringify(this.quizOptions.value)))
      .pipe(
        map((data: QuizQuestionsResponse) => {
          data.results.forEach((question: QuizQuestions) => {
            this.questions.push({
              ...question,
              "answers": [question.correct_answer, ...question.incorrect_answers],
              "selected_answer": "",
            })
          })
          return this.questions
        })
      )
    let questionsSubscription = questions$.subscribe(
      (questions: QuizQuestions[]) => {
        this.appService.questionsSubject.next(questions)
      })
    this.subscriptions.push(questionsSubscription)
  }

  ngOnDestroy(): void{
    this.appService.unsubsribeAllSubscriptions(this.subscriptions);
    this.subscriptions = [];
  }
}
