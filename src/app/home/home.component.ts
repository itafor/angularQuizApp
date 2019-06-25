import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  styleObject(): Object {
        return {background: 'url(assets/images/question-mark.jpg)', height: '100vh',
         'background-size': 'cover',' background-position': 'center','margin-top':'-30px'}
    }

    studentsPix():Object{
      return {
        background:'url(assets/images/gettyimages.jpg)',
         'background-size': 'cover',' background-position': 'center', 'padding-bottom': '-150px'
        }
      
    }
}
