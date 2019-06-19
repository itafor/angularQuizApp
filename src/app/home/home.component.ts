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
        background:'url(assets/images/vector-illustration-students-taking.webp)', height: '300px',
         'background-size': 'cover',' background-position': 'center'
        }
      
    }
}
