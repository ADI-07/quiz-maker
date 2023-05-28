import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { Trivia, TriviaCategory } from '../shared/trivia.model';
import { FormGroup, FormControl } from '@angular/forms';
import { QuizOptions } from '../shared/quiz-options.model';
import { QuizQuestions, QuizQuestionsResponse } from '../shared/quiz-questions.model';
import { map, Observable, Subscription } from 'rxjs';
import { RandomizePipe } from '../shared/pipes/randomize.pipe';
import { HtmlToTextPipe } from '../shared/pipes/html-to-text.pipe';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {
  trivias: TriviaCategory[] = [{ id: 100001, name: 'Select category' }];
  difficulties: string[] = ['Select difficulty', 'Easy', 'Medium', 'Hard'];
  questions: QuizQuestions[] = [];
  quizOptions = new FormGroup({
    trivia: new FormControl<Number | null>(null),
    difficulty: new FormControl<String | null>(null)
  })
  flag = true;
  subscriptions: Subscription[] = [];

  constructor(private appService: AppService, private randomize: RandomizePipe, private htmlToText:HtmlToTextPipe) { }

  ngOnInit(): void {
    let trivias$: Observable<Trivia> = this.appService.getTrivia();
    let triviSubscription = trivias$.subscribe(
      (trivia: Trivia) => {
        this.trivias = [...this.trivias, ...trivia.trivia_categories];
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
    this.questions = []
    this.flag = false;
    let questions$: Observable<QuizQuestions[]> = this.appService.getQuestions(JSON.parse(JSON.stringify(this.quizOptions.value)))
      .pipe(
        map((data: QuizQuestionsResponse) => {
          data.results.forEach((question: QuizQuestions) => {
            this.questions.push({
              ...question,
              "question": this.htmlToText.transform([question.question])[0],
              "answers": this.randomize.transform([question.correct_answer, ...this.htmlToText.transform(question.incorrect_answers)]),
              "selected_answer": "",
            })
          })
          return this.questions
        })
      )
    let questionsSubscription = questions$.subscribe(
      (questions: QuizQuestions[]) => {
        this.appService.questionsSubject.next(questions)
        this.flag = true;
      })
    this.subscriptions.push(questionsSubscription)
  }

  ngOnDestroy(): void {
    this.appService.unsubsribeAllSubscriptions(this.subscriptions);
    this.subscriptions = [];
  }
}
