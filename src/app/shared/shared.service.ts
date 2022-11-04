import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private meta: Meta, private titleService: Title) {}

  setMeta({ title, description, keywords, img, path }: MetaInterface) {
    this.titleService.setTitle(title);

    if (environment.production) {
      this.meta.updateTag({
        name: 'description',
        content: description,
      });
      this.meta.updateTag({
        name: 'keywords',
        content: keywords,
      });
    }
  }
}

export interface MetaInterface extends Card {
  title: string;
  keywords: string;
}

export interface Card {
  description: string;
  img?: string;
  path?: string;
}
