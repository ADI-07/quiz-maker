import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlToText'
})
export class HtmlToTextPipe implements PipeTransform {

  transform(htmlText: string[]): string[] {
    const domParser = new DOMParser()
    let textArray: string[] = []
    htmlText.forEach((html) => {
      textArray.push(domParser.parseFromString(html, 'text/html').getElementsByTagName('body')[0].innerHTML)
    })
    return textArray;
  }
}

