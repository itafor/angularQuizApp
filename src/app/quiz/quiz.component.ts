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
startTestForm:FormGroup;
students:any;
timer;
studentEmail:any;
studentName:any;
participantId:number;
options:any=[];
optOne:any;
test:any;
choices : any;
choice:any;
pos:number=0;
correct:number=0;
displayFinalResult:any;
testCompletedMessage:any='';
theTestDetail:any=[];
testCode:any;
duration:number;
theTestCode:any;
testTitle:string;
hours:number;
minnutes:number;
seconds:number = 0;
time:number;
questions:any[];
remainingDuration:number;
getRemainingDuration:number;
flagSubmit:boolean=false;
myLogInTestCode:any;
textInstruction:any;
  constructor(public quizService:QuizService, private route:Router, public toarster:ToastrManager,
    public elem: ElementRef, public fb: FormBuilder, public _activatedRoute:ActivatedRoute,) {
      
     }

  ngOnInit() {
    this.myLogInTestCode=JSON.parse(localStorage.getItem('mylogTestCode'));
    this.textInstruction = JSON.parse(localStorage.getItem('textInstruction'));
    this.quizFormField();
    this.startFormField();
    if(localStorage.getItem('pos') == null){
    localStorage.setItem('pos', this.pos.toString());
    }
    this.students=JSON.parse(localStorage.getItem('participant'));
    if(this.students){
      this.studentEmail=this.students && this.students.email ? this.students.email : '';
      this.studentName=this.students && this.students.name ? this.students.name : '';
      this.participantId=this.students && this.students.id ? this.students.id : null;
    }
  
   
   if(parseInt(localStorage.getItem('seconds')) > 0){
     this.setTimer();
    this.seconds=parseInt(localStorage.getItem('seconds'));
    this.pos=parseInt(localStorage.getItem('pos'));
    this.quizService.qns=JSON.parse(localStorage.getItem('qns'));
    this.duration = parseInt(localStorage.getItem('duration'));
   this.theTestCode =JSON.parse(localStorage.getItem('theTestCode'));
    this.testTitle = JSON.parse(localStorage.getItem('testTitle'));
    this.renderQuestions();
   }
   
  
  }

  displayTimeElapse(){
  localStorage.setItem('hours',JSON.stringify(Math.floor(this.seconds/360)));
  let  hours=JSON.parse(localStorage.getItem('hours'));
  
  localStorage.setItem('minutes',JSON.stringify(Math.floor(this.seconds / 60)));
  let minnutes =JSON.parse(localStorage.getItem('minutes'));
  localStorage.setItem('sec',JSON.stringify(Math.floor(this.seconds % 60)));
  let sec  =JSON.parse(localStorage.getItem('sec'));
  localStorage.setItem('remainingDuration',JSON.stringify(this.duration - minnutes));
   this.remainingDuration =JSON.parse(localStorage.getItem('remainingDuration'));
  localStorage.setItem('countDown',JSON.stringify(hours + ':' + minnutes + ':' + sec));
  this.time =JSON.parse(localStorage.getItem('countDown'));
   return  this.time;
  }

  getAllQuestions(code:any,email:any){
    this.seconds=0;
    this.quizService.getAllQuestions(code,email).subscribe(
      data=>{
        localStorage.setItem('qns',JSON.stringify(data));

        this.quizService.qns =JSON.parse(localStorage.getItem('qns'));
        this.testDetails(this.testCode);
        this.renderQuestions();
        this.setTimer();
      },
      error=>{
        this.toarster.warningToastr(error.error.warning,null, { toastTimeout: 4000 })
        console.log(error.error.warning);
      }
    )
    
    }

  setTimer(){
   this.quizService.timer=setInterval(()=>{
    this.seconds++;
  localStorage.setItem('seconds',JSON.stringify(this.seconds));
  },1000)
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
        localStorage.setItem('duration', JSON.stringify(this.duration));
        this.testTitle=this.theTestDetail && this.theTestDetail.subjectName ? this.theTestDetail.subjectName: null;
        localStorage.setItem('testTitle', JSON.stringify(this.testTitle));
        this.theTestCode=this.theTestDetail && this.theTestDetail.testCode ? this.theTestDetail.testCode: null;
        localStorage.setItem('theTestCode', JSON.stringify(this.theTestCode));
      },
      error=>{
        console.log(error)
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

  startFormField() {
    this.startTestForm = this.fb.group({
      code:[null, Validators.compose([Validators.required])],
      email:[null, Validators.compose([Validators.required])]
    });
  }

  get getStartFormData(){
    return this.startTestForm.controls;
  }

  start(){
    if (
      confirm(
        'Are you sure you want to start this test?'
      )
    ){
    this.testCode=this.getStartFormData.code.value;
    const email=this.getStartFormData.email.value;
    this.getAllQuestions( this.testCode,email);
  }
  }
  getMaxScore(){
    let maxScore=0;
   for(let i=0; i<this.quizService.qns.length; i++){
    maxScore +=Number(this.quizService.qns[i].marks);
   } 
   return maxScore;
  }
  
  renderQuestions(){
  if(this.pos ==this.quizService.qns.length){
    this.displayFinalResult=" You got " + this.correct + " of " + this.quizService.qns.length + " questions correct";
   this.pos=0;
    this.correct=0;
    this.flagSubmit=true;
    clearInterval(this.quizService.timer);
    console.log('time taken:', this.quizService.timer)
   return false;
  }
  this.displayFinalResult="Questions: " + (this.pos + 1) + " of " + this.quizService.qns.length;
  }

  checkAnswer(){
    if(this.form.invalid){
      return;
    }
    const choices=this.getFormData.choices.value;
  
		 	if(choices === this.quizService.qns[this.pos].answer){
         localStorage.setItem('qns', JSON.stringify(this.quizService.qns));
       this.correct += Number(this.quizService.qns[this.pos].marks);
       localStorage.setItem('score',JSON.stringify(this.correct))
         console.log('correct')
		 	}

     this.pos++;
     localStorage.removeItem('pos');
     localStorage.setItem('pos', JSON.stringify(this.pos));
		 this.renderQuestions();
      this.form.reset();
  }


  removeFakeImagePath(imagePat:any){
    let rep=imagePat.replace('C:\fakepath','');
    return rep;
  }

  postResult(){
   
    localStorage.setItem('maxScore',JSON.stringify(this.getMaxScore()));
    const email=this.studentEmail;
    const participant_id=this.participantId;
    const code=JSON.parse((localStorage.getItem('theTestCode')))
    console.log('the main cod',  code)
    let score=JSON.parse(localStorage.getItem('score'))
    const maxScore= JSON.parse(localStorage.getItem('maxScore'));
    console.log(email + code)
    this.quizService.submitResult(email,code,score,maxScore,participant_id).subscribe(
      data=>{
        localStorage.setItem('result',JSON.stringify(data));
        localStorage.setItem('participant',JSON.stringify(data))
       localStorage.removeItem('qns');
        this.route.navigate(['/home'])
        localStorage.clear();
        localStorage.removeItem('seconds');
        this.toarster.successToastr('Result submitted successfully',null,{toastrTimeout:5000})
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  signout(){
    localStorage.clear();
    clearInterval(this.quizService.timer);
    this.route.navigate(['/home']);
      }
 
}
