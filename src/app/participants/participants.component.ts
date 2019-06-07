import { Component, OnInit } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
  testLists:any=[];
  constructor(private quizService:QuizService, private route:Router,) { }

  ngOnInit() {
    this.displayTest()
  }

  displayTest(){
    this.quizService.getTest().subscribe(
      data=>{
        this.testLists=data;
        console.log(data);
      }
    ),
    error=>{
      console.log(error)
    }
  }
  
  takeTest(code:any){
    if (
      confirm(
        'Are you ready to take this test?, once you start, you can not pause or restart'
      )
    ) {
console.log(code)
      this.quizService.theTestCode = code;
      this.route.navigate(['/quiz', this.quizService.theTestCode]);
  }
}
}
