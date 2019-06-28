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
  participant:any;
  examinalId:number;
  loadingTest:boolean=false;
  constructor(public quizService:QuizService, 
    private router:Router,public toarster:ToastrManager,
    public fb: FormBuilder) { }

  ngOnInit() {
    this.testFormFields();
    if(localStorage.getItem('participant') !=null){
      this.participant=JSON.parse(localStorage.getItem('participant'));
      this.examinalId=this.participant && this.participant.id ? this.participant.id : null;
    }
   
  }

  testFormFields() {
    this.addTestForm = this.fb.group({
      subjectName: [null, Validators.compose([Validators.required])],
      numberOfQn: [null, Validators.compose([Validators.required])],
      duration: [null, Validators.compose([Validators.required])],
      testCode: [null, Validators.compose([Validators.required])],
      instruction:[null, Validators.compose([Validators.required])],
      participantId:[null, Validators.compose([Validators.required])],
    });
  }

  get getTest() { return this.addTestForm.controls; }
  
  postTest(){
    if(this.addTestForm.invalid){
      return;
    }
    this.loadingTest=true;
    const subjectName=this.getTest.subjectName.value;
    const numberOfQn=this.getTest.numberOfQn.value;
    const duration=this.getTest.duration.value;
    const testCode=this.getTest.testCode.value;
    const instruction=this.getTest.instruction.value;
    const participantId = this.getTest.participantId.value;
console.log(instruction);
    this.quizService.addTest(subjectName,numberOfQn,duration,testCode,instruction,participantId).subscribe(
      data=>{
  this.toarster.successToastr('Test Added successfully', null, { toastTimeout: 3000 })
  this.loadingTest=false;
        this.addTestForm.reset();
        this.participant=JSON.parse(localStorage.getItem('participant'));
        this.router.navigate(['/testList']);
      },
      error=>{
      this.toarster.errorToastr('Error: ' + error.error.warning, null, { toastTimeout: 4000 })
      })

    
  }
}
