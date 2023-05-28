import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Trivia } from './shared/trivia.model';
import { QuizOptions } from './shared/quiz-options.model';
import { QuizQuestions, QuizQuestionsResponse } from './shared/quiz-questions.model';
import { Result } from './shared/result.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  databaseUrl: String = "https://opentdb.com";
  questionsSubject = new BehaviorSubject<QuizQuestions[]>([])
  answerSubject = new BehaviorSubject<Result>({
    total: 0,
    correct: 0
  })

  constructor(private http: HttpClient) { }

  getTrivia(): Observable<Trivia> {
    return this.http.get<Trivia>(`${this.databaseUrl}/api_category.php`)
  }

  getQuestions(quizOptions: QuizOptions): Observable<QuizQuestionsResponse> {
    return this.http.get<QuizQuestionsResponse>(`${this.databaseUrl}/api.php?amount=5&category=${quizOptions.trivia}&difficulty=${quizOptions.difficulty?.toLowerCase()}&type=multiple`)
  }

  calculateScore(data: QuizQuestions[]): Result {
    let score: Result = {
      total: data.length,
      correct: 0
    }
    data.forEach((question) => {
      if (question.correct_answer == question.selected_answer) {
        score.correct += 1
      }
    })
    return score;
  }

  unsubsribeAllSubscriptions(subs: Subscription[]): void {
    subs.forEach((subscription: Subscription) => subscription.unsubscribe())
  }
}
