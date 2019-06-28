import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../shared/quiz.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  students:any;
  studentEmail;any;
  studentName:any;
  participantId:any;
  constructor(public quizService:QuizService, public route:Router) { }

  ngOnInit() {
    this.students=JSON.parse(localStorage.getItem('participant'));
    if(this.students){
      this.studentEmail=this.students && this.students.email ? this.students.email : '';
      this.studentName=this.students && this.students.name ? this.students.name : '';
      this.participantId=this.students && this.students.id ? this.students.id : null;
    }
  
  }
  signout(){
localStorage.clear();
clearInterval(this.quizService.timer);
this.route.navigate(['/home']);
  }

  // signout(){
  //   localStorage.clear();
  //   this.route.routeReuseStrategy.shouldReuseRoute = function () {
  //     return false;
  //   };
  //   this.quizService.qns=[];
  //   clearInterval(this.quizService.timer);
  //   this.route.navigate(['/register']);
  //     }
}
