import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/shared/quiz.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-testmanagement',
  templateUrl: './testmanagement.component.html',
  styleUrls: ['./testmanagement.component.css']
})
export class TestmanagementComponent implements OnInit {
  public addTestForm:FormGroup;
  constructor(public quizService:QuizService, 
    route:Router,public toarster:ToastrManager,
    public fb: FormBuilder) { }

  ngOnInit() {
    this.testFormFields();
  }

  testFormFields() {
    this.addTestForm = this.fb.group({
      subjectName: [null, Validators.compose([Validators.required])],
      numberOfQn: [null, Validators.compose([Validators.required])],
      duration: [null, Validators.compose([Validators.required])],
      testCode: [null, Validators.compose([Validators.required])],
      instruction:[null, Validators.compose([Validators.required])],
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
    const instruction=this.getTest.instruction.value;
console.log(instruction);
    this.quizService.addTest(subjectName,numberOfQn,duration,testCode,instruction).subscribe(
      data=>{
  this.toarster.successToastr('Test Added successfully', null, { toastTimeout: 3000 })
        this.addTestForm.reset();
      },
      error=>{
      this.toarster.errorToastr('Error: ' + error.error.warning, null, { toastTimeout: 4000 })
      })

    
  }
}
