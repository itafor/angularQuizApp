import { AfterViewInit, Component, OnInit, Optional,ElementRef, ViewChild,Inject  } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit{
  
form:FormGroup;
options:any=[];
optOne:any;
test:any;
choices : any;
choice:any;
pos:number=0;
correct:number=0;
displayFinalResult:any='';
testCompletedMessage:any='';
theTestDetail:any=[];
duration:number;
hours:number;
minnutes:number;
seconds:number;
time:any;
remainingDuration:number;
  constructor(private quizService:QuizService, route:Router,private toarster:ToastrManager,
    private elem: ElementRef, private fb: FormBuilder,private _activatedRoute:ActivatedRoute) {
      
     }

  ngOnInit() {
    if(this.quizService.theTestCode){
      this.getQuix(this.quizService.theTestCode);
    }
    this.quizFormField();
    let code:string = this._activatedRoute.snapshot.params['Code'];
    this.quizService.questionDetailsCode=code;
    if(code){
      this.getAllQuestions(code);
     this.testDetails(code);
    }
    this.displayTimeElapse();
  }

  displayTimeElapse(){
  localStorage.setItem('hours',JSON.stringify(Math.floor(this.seconds/360)));
  let  hours=JSON.parse(localStorage.getItem('hours'));
  localStorage.setItem('minutes',JSON.stringify(Math.floor(this.seconds / 60)));
  let minnutes =JSON.parse(localStorage.getItem('minutes'));
  localStorage.setItem('seconds',JSON.stringify(Math.floor(this.seconds % 60)));
  let seconds  =JSON.parse(localStorage.getItem('seconds'));
  localStorage.setItem('remainingDuration',JSON.stringify(this.duration - minnutes));
   this.remainingDuration =JSON.parse(localStorage.getItem('remainingDuration'));
  localStorage.setItem('countDown',JSON.stringify(hours + ':' + minnutes + ':' + seconds));
  this.time =JSON.parse(localStorage.getItem('countDown'));
   return  this.time;
  }

  timeAlert(time:number){
    switch(time){
      case 58:
           this.toarster.warningToastr('You have 58 Minutes remaining', null, { toastTimeout: 3000 });
      break;  
}
  }

  testDetails(code:any){
    this.quizService.getTestDetail(code).subscribe(
      data=>{
        this.theTestDetail=data;
        console.log('the test details', this.theTestDetail)
        this.duration=this.theTestDetail && this.theTestDetail.duration ? Number(this.theTestDetail.duration): null;
      },
      error=>{
        console.log(error)
      }
    )
  }

  getAllQuestions(code:any){
    
    this.quizService.getAllQuestions(code).subscribe(
      data=>{
        this.quizService.qns = <any[]>data;
        //this. setTimer();
      },
      error=>{
        console.log(error);
      }
    )
    }

  quizFormField() {
    this.form = this.fb.group({
      choices:[null, Validators.compose([Validators.required])]
    });
  }

  get getFormData(){
    return this.form.controls;
  }

  getQuix(code:any){
    this.seconds=0;
    this.quizService.qnProgress=0;
    this.quizService.getAllQuestions(code).subscribe(
      (data:any)=>{
        this.quizService.qns = data;
        this.setTimer();
      console.log(data)
    },
    (error)=>{
      console.log(error)
    })
   this.renderQuestions();
  }

  
  renderQuestions(){
  if(this.pos >=this.quizService.qns.length){
    this.displayFinalResult="You got " + this.correct + " of " + this.quizService.qns.length + " questions correct";
    this.testCompletedMessage="test completed";
   this.pos=0;
    this.correct=0;
    return false;
  }
  this.displayFinalResult="Questions: " + (this.pos + 1) + " of " + this.quizService.qns.length;
  }

  checkAnswer(){
    if(this.form.invalid){
      return;
    }
    const choices=this.getFormData.choices.value;
    this.quizService.qnProgress++;
    
    if(this.quizService.qnProgress === this.quizService.qns.length){
      clearInterval(this.quizService.timer);
    }
		 	if(choices === this.quizService.qns[this.pos].answer){
       this.correct += Number(this.quizService.qns[this.pos].marks);
         console.log('correct')
		 	}

		 this.pos++;
		 this.renderQuestions();
      this.form.reset();
  }

  setTimer(){
    this.quizService.timer=setInterval(()=>{
      this.seconds++;
    },1000)
  }

  removeFakeImagePath(imagePat:any){
    let rep=imagePat.replace('C:\fakepath','');
    return rep;
  }

}
