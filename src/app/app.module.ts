import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizMakerComponent } from './quiz-maker/quiz-maker.component';
import { ResultsComponent } from './results/results.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { RandomizePipe } from './shared/pipes/randomize.pipe';
import { HtmlToTextPipe } from './shared/pipes/html-to-text.pipe';

@NgModule({
  declarations: [
    AppComponent,
    QuizMakerComponent,
    ResultsComponent,
    QuestionsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [RandomizePipe, HtmlToTextPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
