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
  examinalId:number;
  participant;any;
  constructor(public quizService:QuizService, public route:Router,) { }

  ngOnInit() {
    this.displayTest(this.examinalId);
    if(localStorage.getItem('participant') !=null){
      this.participant=JSON.parse(localStorage.getItem('participant'));
      this.examinalId=this.participant && this.participant.id ? this.participant.id : null;
    }
  }

  displayTest(id:number){
    this.quizService.getTest(id).subscribe(
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
      this.quizService.theTestCode = code;
      this.route.navigate(['/quiz', this.quizService.theTestCode]);
  }
}
}
