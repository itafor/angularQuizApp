import { Component, OnInit,Input } from '@angular/core';
import { QuizService } from 'src/app/shared/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModalConfig, NgbModal,ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class ListQuestionsComponent implements OnInit {
  listedQuestions:any=[];
  presentNumberOfQuest:number;
  remainingNumberOfQtn:number;
  public addQuestionForm:FormGroup;
  questCode:any;
  alternateCode:any;
  closeResult: string;
  loading = false;
  testToEdit:any;
  testNumberToEdit:any;
  code:any;
  testId:number;
  // subject:any;
  numberOfQtns:any;
@Input() 
noOfQn:number;
@Input()
duration:number;
@Input()
questionsList:any[];
@Input()
subject:any;
  constructor(private quizService:QuizService,
    private _activatedRoute:ActivatedRoute, private fb: FormBuilder,
    config: NgbModalConfig,private toarster:ToastrManager,
    private modalService: NgbModal) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }

    openBackDropCustomClass(content) {
      this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
    }

    open(content,code:any) {
      //this.modalService.open(content);
      this.modalService
      .open(content,{ size: 'lg' })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }

    openModalToEditQuestion(contentToEdit,test){
      this.modalService
      .open(contentToEdit,{ size: 'lg' })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
      this.testToEdit=test;
      console.log('test to edit', this.testToEdit)
    }

    openEditNumberOfTest(openTestModal:any,testCode:any){
      this.modalService
      .open(openTestModal,{ size: 'lg' })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
      this.code=testCode;
      this.quizService.getTestDetail(this.code).subscribe(
        data=>{
          this.testNumberToEdit=data
          console.log('real test data', data)
        }
      )
      console.log(this.code)
    }
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }

  ngOnInit() {
    let code:string = this._activatedRoute.snapshot.params['Code'];
    this.quizService.questionDetailsCode=code;
    if(code){
      this.getAllQuestions(code);
      
    }

    if(this.quizService.questionDetailsCode){
      this.testDetail(this.quizService.questionDetailsCode);
    }
    this.questionsFormFields();
  //this.testId =  parseInt(this.testNumberToEdit.id) ? parseInt(this.testNumberToEdit.id) : parseInt(this.testNumberToEdit.id) ;
  }

  get getQuestions() { return this.addQuestionForm.controls; }
  
  getAllQuestions(code:any){
     this.quizService.getAllQuestions(code).subscribe(
       data=>{
         this.listedQuestions = data;
       this.countQuestion();
       },
       error=>{
         console.log(error);
       }
     )
     }
  
    
     testDetail(code:any){
       this.quizService.getTestDetail(code).subscribe(
         data=>{
           this.quizService.testDetails=data;
           console.log('detail', this.quizService.testDetails)
         },
         error=>{
           console.log(error)
         }
       )
     }

    countQuestion(){
      let numberOfQuestion = 0;
      for(let i=0; i<this.listedQuestions.length; i++){
         numberOfQuestion++;
   }
       this.presentNumberOfQuest=numberOfQuestion;
    }

    remainingNumberOfQuestion(prev:number,curr:number){
      return prev - curr;
    }

     questionsFormFields() {
      this.addQuestionForm = this.fb.group({
        question: [null, Validators.compose([Validators.required])],
        imageName: [null],
        option1: [null, Validators.compose([Validators.required])],
        option2: [null, Validators.compose([Validators.required])],
        option3:[null, Validators.compose([Validators.required])],
        option4:[null, Validators.compose([Validators.required])],
        answer: [null, Validators.compose([Validators.required])],
        testCode:[null, Validators.compose([Validators.required])],
      });
    }

    
  postQuestion(){
    if(this.addQuestionForm.invalid){
      return;
    }
    this.loading = true;
    const question=this.getQuestions.question.value;
    const imageName=this.getQuestions.imageName.value;
    const option1=this.getQuestions.option1.value;
    const option2=this.getQuestions.option2.value;
    const option3=this.getQuestions.option3.value;
    const option4=this.getQuestions.option4.value;
    const answer=this.getQuestions.answer.value;
    const testCode=this.getQuestions.testCode.value;
  console.log(question + imageName + option1+ ' ' +option2+option3 + option4 + answer + testCode)
    this.quizService.addQuestion(question,imageName,option1,option2,option3,option4,answer,testCode)
    .subscribe( data=>{
      this.loading = false;
  this.getAllQuestions(this.quizService.testDetails.testCode);
  this.addQuestionForm.reset();
  this.modalService.dismissAll();
  this.toarster.successToastr('Question Added successfully', null, { toastTimeout: 3000 })
    },
    (error)=>{
  this.toarster.errorToastr('Error: ' + error.error.warning, null, { toastTimeout: 3000 })
  this.loading = false;
  console.log(error);
    })
  }
  edit(){
    this.loading=true;
    const Qn=this.testToEdit.Qn;
    const ImageName=this.testToEdit.ImageName;
    const Option1=this.testToEdit.Option1;
    const Option2=this.testToEdit.Option2;
    const Option3= this.testToEdit.Option3;
    const Option4=this.testToEdit.Option4;
    const answer=this.testToEdit.answer;
    const id=this.testToEdit.id;
    const testCode=this.testToEdit.testCode;
    this.quizService.updateQuestion(id,Qn,ImageName,Option1,Option2,Option3,Option4,answer,testCode).subscribe(
      data=>{
        this.loading = false;
        this.getAllQuestions(this.quizService.testDetails.testCode);
        this.addQuestionForm.reset();
        this.modalService.dismissAll();
        this.toarster.successToastr('Selected Question updated successfully', null, { toastTimeout: 3000 })
      },
      error=>{
  this.toarster.errorToastr('Error: ' + error.error.warning, null, { toastTimeout: 3000 })
this.loading=false;
      }
    )
  }
  
  delete(id:number){
    this.quizService.deleteQuestion(id).subscribe(
      data=>{
        this.toarster.successToastr('Selected question deleted successfully',null, { toastTimeout: 3000 });
        this.getAllQuestions(this.quizService.testDetails.testCode);
        
      },
      error=>{
          this.toarster.errorToastr('Error: ' + error.error.warning, null, { toastTimeout: 3000 })
      }
      
    )
    console.log(id)
  }

  changeNumberOfQuestions(){
    this.loading=true;
   const id=this.testNumberToEdit.id;
   const subjectName=this.testNumberToEdit.subjectName;
   const numberOfQn=this.testNumberToEdit.numberOfQn;
   const duration=this.testNumberToEdit.duration;
   const testCode=this.testNumberToEdit.testCode;
   this.quizService.updateTest(id,subjectName,numberOfQn,duration,testCode)
   .subscribe(
     data=>{
       this.loading = false;
       this.getAllQuestions(this.quizService.testDetails.testCode);
       this.testDetail(this.quizService.testDetails.testCode)
       this.modalService.dismissAll();
       this.toarster.successToastr('Selected Test Number of Questions updated successfully', null, { toastTimeout: 3000 })
    
      },
     error=>{
       this.toarster.errorToastr('Error: ' + error.error.warning, null, { toastTimeout: 3000 })
       this.loading=false;
     }
   )}
}
