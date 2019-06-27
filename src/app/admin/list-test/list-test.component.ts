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
  students:any;
  studentEmail:any;
  testToEdit:any;
  confirmTest:any=[];
  ids:any=[];
  filter: boolean= false;
  deleteflag:any =[];
  testCodeToDelete;any=[]
  allTheQuestions:any=[];
  testvalues:any=[];
  pushedTest:any=[];
  testTobeDeleted:any[];
  testWithQtnIds:any=[];
  constructor(public quizService:QuizService, public route:Router, 
    public _activatedRoute:ActivatedRoute, config: NgbModalConfig, public toarster:ToastrManager,
    public modalService: NgbModal) {
      config.backdrop = 'static';
    config.keyboard = false;
   }

   open(contentToEdit: any) {
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
    this.students=JSON.parse(localStorage.getItem('participant'));
    this.studentEmail=this.students && this.students.email ? this.students.email : '';
    this.displayTest()
    this. getListedQns();
    this.numberOfQns();
    this.allQuestionsCodes();
    
  }

  

displayTest(){
  this.quizService.getTest().subscribe(
    data=>{
      this.testLists=data;
    }
  ),
    (  error: any)=>{
    console.log(error)
  }
 
}


allQuestionsCodes(){
  this.quizService.groupQuestionsByCode().subscribe(data=>{
    this.allTheQuestions=data;
    this.allTheQuestions.forEach(codes=>{
      this.quizService.getTestDetail(codes.testCode).subscribe(
        resp=>{
          this.testvalues=resp;
          this.pushedTest.push(this.testvalues)
          console.log('all the test',  this.pushedTest );
          this.testToDelete();
        }
      )
    })
   
  })
  
}

testToDelete(){
  this.testTobeDeleted = this.testLists.filter(itemA => !this.pushedTest.some(itemB => itemB.id === itemA.id));
  console.log('test to delete', this.testTobeDeleted);
  this.pushedTest.forEach(item=>{
    let idToStrg =String(item.id);
    this.testWithQtnIds.push(idToStrg);
  })

  console.log('test ids not to del', this.testWithQtnIds);

}
  getAllQuestions(code:any,noOfQn:number,duration:number,subject:string){
    this.studentEmail=this.students && this.students.email ? this.students.email : '';
    this.quizService.getAllQuestions(code,this.studentEmail).subscribe(
      data=>{
        this.listedQuestions = data;
        this.numberOfQuestions=noOfQn;
        this.displayDuration=duration;
        this.subj = subject;
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
    const instruction=this.testToEdit.instruction;
    this.quizService.updateTest(id,subjectName,numberOfQn,duration,testCode,instruction)
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
    this.studentEmail=this.students && this.students.email ? this.students.email : '';

           this.quizService.getAllQuestions(testCode,this.studentEmail).subscribe(
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

      
   selectAllQuestions(event: { target: { checked: any; }; }) {
   
    const checked = event.target.checked;
    this.testLists.forEach((item: { selected: any; id: any; }) =>{ 
     item.selected = checked;
     let toStrig=String(item.id)
     if(item.selected){
       if(this.ids.indexOf(toStrig) == -1){
        //this.ids.splice(this.testTobeDeleted.indexOf(toStrig),1) 
        this.ids.push(toStrig);
       }
     } else{
        this.ids=[];
     }
    console.log('the ids',this.ids)
    });
  
    console.log('pushed test',   this.pushedTest , '---' , this.testLists);
    console.log('test to delete', this.testTobeDeleted);
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
    const found = this.testTobeDeleted.some(r=> this.ids.indexOf(r) >= 0)
    if(found){
      this.toarster.warningToastr('The Test you are about to delete has some Questions that depends on it,First delete the questions', null, { toastTimeout: 4000 })
      console.log(found);
    }else{

     if(this.ids.length >=1){
    this.ids.forEach((id: number)=>{
      this.quizService.deleteTest(id).subscribe(
        data=>{
          localStorage.setItem('flag',JSON.stringify(data));
          this.displayTest()
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
