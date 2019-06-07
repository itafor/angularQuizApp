import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/shared/quiz.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-testmanagement',
  templateUrl: './testmanagement.component.html',
  styleUrls: ['./testmanagement.component.css']
})
export class TestmanagementComponent implements OnInit {
  public addTestForm:FormGroup;
  constructor(private quizService:QuizService, 
    route:Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.testFormFields();
  }

  testFormFields() {
    this.addTestForm = this.fb.group({
      subjectName: [null, Validators.compose([Validators.required])],
      numberOfQn: [null, Validators.compose([Validators.required])],
      duration: [null, Validators.compose([Validators.required])],
      testCode: [null, Validators.compose([Validators.required])],
    });
  }

  get getTest() { return this.addTestForm.controls; }
  
  postTest(){
    if(this.addTestForm.invalid){
      return;
    }
    const subjectName=this.getTest.subjectName.value;
    const numberOfQn=this.getTest.numberOfQn.value;
    const duration=this.getTest.duration.value;
    const testCode=this.getTest.testCode.value;
console.log(subjectName);
    this.quizService.addTest(subjectName,numberOfQn,duration,testCode).subscribe(
      data=>{
        console.log(data)
        this.addTestForm.reset();
      },
      error=>{
        console.log(error)
      })

    
  }
}
