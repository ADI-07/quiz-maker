import { Component, ChangeDetectorRef } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Result } from '../shared/result.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  result: Result = {
    total: 0,
    correct: 0
  }
  subscriptions: Subscription[] = [];

  constructor(private appService: AppService, private router: Router) { }

  get route(): Router {
    return this.router
  }

  ngOnInit(): void {
    let answerSubscription = this.appService.answerSubject.subscribe((result: Result) => {
      this.result = result;
    })
    this.subscriptions.push(answerSubscription);
  }

  applyStyleClass(correctScore: number): string {
    if (correctScore < 2) {
      return 'warning-result'
    }
    else if (correctScore > 1 && correctScore < 4) {
      return 'average-result'
    }
    else return 'good-result'
  }

  ngOnDestroy(): void {
    this.appService.questionsSubject.next([])
    this.appService.unsubsribeAllSubscriptions(this.subscriptions);
    this.subscriptions = [];
  }
}
