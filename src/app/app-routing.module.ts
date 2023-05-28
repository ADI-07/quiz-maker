import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizMakerComponent } from './quiz-maker/quiz-maker.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  {
    path:'',
    component: QuizMakerComponent
  },
  {
    path:'results',
    component: ResultsComponent
  },
  {
    path:'**',
    component: QuizMakerComponent,
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
