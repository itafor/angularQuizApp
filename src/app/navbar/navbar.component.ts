import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../shared/quiz.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public quizService:QuizService, public route:Router) { }

  ngOnInit() {
  }
  signout(){
localStorage.clear();
clearInterval(this.quizService.timer);
this.route.navigate(['/register']);
  }
}
