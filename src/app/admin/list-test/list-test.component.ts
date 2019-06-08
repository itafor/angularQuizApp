import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/shared/quiz.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgbModalConfig, NgbModal,ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-list-test',
  templateUrl: './list-test.component.html',
  styleUrls: ['./list-test.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class ListTestComponent implements OnInit {
  loading:boolean=false;
  testLists:any=[];
  listedQuestions:any=[];
  numberOfQuestions:number;
  displayDuration:number;
  subj:string;
  closeResult:string;
  testToEdit:any;
  confirmTest:any=[];
  constructor(private quizService:QuizService, private route:Router, 
    private _activatedRoute:ActivatedRoute, config: NgbModalConfig,private toarster:ToastrManager,
    private modalService: NgbModal) {
      config.backdrop = 'static';
    config.keyboard = false;
   }

   open(contentToEdit) {
    this.modalService.open(contentToEdit);
  }
    
    openModalToEditTest(contentToEdit:any,test:any){
      this.modalService
      .open(contentToEdit)
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
    this.displayTest()
    this. getListedQns();
    this.numberOfQns();
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



  getAllQuestions(code:any,noOfQn:number,duration:number,subject:string){
   console.log(subject)
    this.quizService.getAllQuestions(code).subscribe(
      data=>{
        this.listedQuestions = data;
        this.numberOfQuestions=noOfQn;
        this.displayDuration=duration;
        this.subj = subject;
        //console.log(data);
        // this.route.navigate(['/questionList']);
      },
      error=>{
        console.log(error);
      }
    )
    }
    
  

    numberOfQns(){
      console.log('number of qtn ', this.numberOfQuestions)
      return this.numberOfQuestions;
    }

    getDuration(){
      console.log('duration ', this.displayDuration)
      return this.displayDuration;
    }

    getSubject(){
      return this.subj;
    }

    getListedQns(){
      console.log('listed questions ', this.listedQuestions)
      return this.listedQuestions;
    }

    editTest(){
     this.loading=true;
    const id=this.testToEdit.id;
    const subjectName=this.testToEdit.subjectName;
    const numberOfQn=this.testToEdit.numberOfQn;
    const duration=this.testToEdit.duration;
    const testCode=this.testToEdit.testCode;
    this.quizService.updateTest(id,subjectName,numberOfQn,duration,testCode)
    .subscribe(
      data=>{
        console.log(data);
        this.loading = false;
        this.displayTest();
        this.modalService.dismissAll();
        this.toarster.successToastr('Selected Test updated successfully', null, { toastTimeout: 3000 })
      },
      error=>{
        this.toarster.errorToastr('Error: ' + error.error.warning, null, { toastTimeout: 3000 })
        this.loading=false;
      }
    )}
      
      

        deleteTest(id:number,testCode:any){
           this.quizService.getAllQuestions(testCode).subscribe(
             resp=>{
             this.confirmTest=resp;
           if(this.confirmTest.length >=1){
            this.toarster.warningToastr('The Test you are about to delete has some Questions that depends on it,First delete the questions', null, { toastTimeout: 4000 })
           }else{
            this.finalDelete(id)
           }
             }
           )
      }

      finalDelete(id:number){
        if (
          confirm(
            'Are you sure you want to permanently delete the selected  Test?'
          )
        ) {
        this.quizService.deleteTest(id).subscribe(
          data=>{
            this.toarster.successToastr('Selected Test deleted successfully',null, { toastTimeout: 3000 });
            this.displayTest();
          },
          error=>{
              this.toarster.errorToastr('Error: ' + error.error.warning, null, { toastTimeout: 3000 })
          })
        }
      }
}
