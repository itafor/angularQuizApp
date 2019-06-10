import { Component, OnInit,Input } from '@angular/core';
import { QuizService } from 'src/app/shared/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModalConfig, NgbModal,ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient } from '@angular/common/http';

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
  subjectName:any;
  numberOfQuestions:number;
  testTodEditId:number;
  testTodEditsubjectName:string;
  testTodEditNumberOfQn:any;
  testTodEditDuration:any;
  testTodEditTestCode:any;
  message:string;
  public imagePath;
  imgURL: any;
  ids:any=[];
  filter: boolean= false;
  deleteflag:any =[];
  numberOfQtns:any;
@Input() 
noOfQn:number;
@Input()
duration:number;
@Input()
questionsList:any[];
@Input()
subject:any;
selectedFile=null;
  constructor(private quizService:QuizService,
    private _activatedRoute:ActivatedRoute, private fb: FormBuilder,
    config: NgbModalConfig,private toarster:ToastrManager,private http:HttpClient,
    private modalService: NgbModal) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }

    openBackDropCustomClass(content) {
      this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
    }

    open(content,code:any) {
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

      this.resetMaxNumberOfQtn(this.code)
     
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
    localStorage.setItem('testCode',JSON.stringify(code));
    let retrievedCode=JSON.parse(localStorage.getItem('testCode'))



    this.quizService.questionDetailsCode=retrievedCode;
    if(code){
      this.getAllQuestions(code);
    }

    if(this.quizService.questionDetailsCode){
      this.testDetail(this.quizService.questionDetailsCode);
    }
    this.questionsFormFields();
    this.resetMaxNumberOfQtn(this.code)

  }

  
  resetMaxNumberOfQtn(code:any){
    this.quizService.getTestDetail(code).subscribe(
      data=>{
        this.testNumberToEdit=data
        localStorage.setItem('testDetailToEdit',JSON.stringify(this.testNumberToEdit));
        let testTodEditCredentials=JSON.parse(localStorage.getItem('testDetailToEdit'));
        if(testTodEditCredentials !==null){
          this.testTodEditId=testTodEditCredentials.id;
          this.testTodEditsubjectName=testTodEditCredentials.subjectName;
          this.testTodEditNumberOfQn=testTodEditCredentials.numberOfQn;
          this.testTodEditDuration=testTodEditCredentials.duration;
          this.testTodEditTestCode=testTodEditCredentials.testCode;
          console.log('real test data', testTodEditCredentials)
          console.log('real test data2 id',  this.testTodEditId)
        }
        
      }
    )
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
           localStorage.setItem('testDetails',JSON.stringify(this.quizService.testDetails))
           let testCredentials=JSON.parse(localStorage.getItem('testDetails'));
           this.subjectName=testCredentials.subjectName;
           this.numberOfQuestions=testCredentials.numberOfQn;
           console.log('Q number', this.numberOfQuestions)
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
        marks: [null, Validators.compose([Validators.required])],
        testCode:[null, Validators.compose([Validators.required])],
      });
    }

    removeFakeImagePath(imagePat:any){
      let rep=imagePat.toString().replace('C:\\fakepath\\','').trim();
      return rep;
    }


    uploadFile(event:any){    
      this.selectedFile=<File>event.target.files[0].name;
      let elem = event.target; 
      
      if(elem.files.length > 0){  
        //check if file is an image
        var mimeType = elem.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
          this.message = "Only images are supported.";
          alert('Only images are supported')
          return;
        } 
       //image preview
        var reader = new FileReader();
        this.imagePath = elem.files;
        reader.readAsDataURL(elem.files[0]); 
        reader.onload = (_event) => { 
          this.imgURL = reader.result; 
        }

       //image upload to server
        let formData = new FormData();  
        formData.append('myfile', elem.files[0]); 
        this.quizService.sendFile(formData).subscribe(
          (response) => {
         console.log(response);
          });
      }
  elem.value = ""; 
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
    const marks=this.getQuestions.marks.value;
    const testCode=this.getQuestions.testCode.value;
  console.log('image path ', imageName)
    this.quizService.addQuestion(question,this.selectedFile ? this.selectedFile:null,option1,option2,option3,option4,answer,marks,testCode)
    .subscribe( data=>{
      this.loading = false;
  this.getAllQuestions(this.quizService.testDetails.testCode);
  this.addQuestionForm.reset();
  this.modalService.dismissAll();
  this.toarster.successToastr('Question Added successfully', null, { toastTimeout: 3000 })
  this.quizService.testDetails.testCode=JSON.parse(localStorage.getItem('testCode'))
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
    const marks=this.testToEdit.marks;
    const id=this.testToEdit.id;
    const testCode=this.testToEdit.testCode;
    console.log('edited image', ImageName)
    this.quizService.updateQuestion(id,Qn,this.selectedFile ? this.selectedFile:null,Option1,Option2,Option3,Option4,answer,marks,testCode).subscribe(
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
   const id=this.testTodEditId
   const subjectName=this.testTodEditsubjectName
   const numberOfQn= this.testTodEditNumberOfQn
   const duration=this.testTodEditDuration;
   const testCode= this.testTodEditTestCode;
   this.quizService.updateTest(id,subjectName,numberOfQn,duration,testCode)
   .subscribe(
     data=>{
       this.loading = false;
       this.testDetail(this.quizService.testDetails.testCode)
       this.modalService.dismissAll();
       this.toarster.successToastr('Selected Test Number of Questions updated successfully', null, { toastTimeout: 3000 })
    
      },
     error=>{
       this.toarster.errorToastr('Error: ' + error.error.warning, null, { toastTimeout: 3000 })
       this.loading=false;
     }
   )}

   selectAllQuestions(event) {
    const checked = event.target.checked;
    this.listedQuestions.forEach(item =>{ 
     item.selected = checked;
     let toStrig=String(item.id)
     if(item.selected){
       if(this.ids.indexOf(toStrig) == -1){
        this.ids.push(toStrig);
       }
     } else{
        this.ids=[];
     }
    console.log('lengt',this.ids)
    });
  }

   getId(event:any){
      let targets=event.target.value;
      if(this.ids.find((x: any)=>x==targets))
    {
       this.ids.splice(this.ids.indexOf(targets),1)
   } else{
      this.ids.push(targets);
}
 console.log('ids ', this.ids)    
   }

   multiDelete(){
     if(this.ids.length >=1){
    this.ids.forEach(id=>{
      this.quizService.deleteQuestion(id).subscribe(
        data=>{
          localStorage.setItem('flag',JSON.stringify(data));
          this.getAllQuestions(this.quizService.testDetails.testCode);
          this.ids=[];
        },
        error=>{
            this.toarster.errorToastr('Error: ' + error.error.warning, null, { toastTimeout: 3000 })
        })
    })
    this.multiDeleteFlag();
   }else{
    this.toarster.errorToastr('Please select a at least one question to delete ', null, { toastTimeout: 3000 })
   }
   
  }

  multiDeleteFlag(){
let delFlag=JSON.parse(localStorage.getItem('flag'));
if(delFlag !==null){
  this.toarster.successToastr('Selected questions deleted successfully',null, { toastTimeout: 4000 });
 window.localStorage.removeItem('flag')
}
   console.log('the flag',)
  }

  
}
