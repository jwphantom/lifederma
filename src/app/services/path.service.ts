import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  public previousPath : string;

 

  constructor(private router : Router) { }

  routeTo(nurl, url){
    this.previousPath = url;
    console.log(nurl)
    this.router.navigate([nurl]);

  }
}
