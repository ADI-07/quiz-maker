import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomize'
})
export class RandomizePipe implements PipeTransform {

  transform(optionsList: string[]): string[] {
    let randomizedOptionsList = [...optionsList];
    for (let i = randomizedOptionsList.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [randomizedOptionsList[i], randomizedOptionsList[j]] = [randomizedOptionsList[j], randomizedOptionsList[i]];
    }
    return randomizedOptionsList;
  }

}
