import {Routes} from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultComponent } from './result/result.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminpanelComponent } from './admin/adminpanel/adminpanel.component';
import { TestmanagementComponent } from './admin/testmanagement/testmanagement.component';
import { ListTestComponent } from './admin/list-test/list-test.component';
import { ListQuestionsComponent } from './admin/list-questions/list-questions.component';
import { ParticipantsComponent } from './participants/participants.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const appRoutes : Routes = [
{path:'register',component:RegisterComponent},
{path:'home',component:HomeComponent},
{path:'login',component:LoginComponent},
{path:'quiz',component:QuizComponent, canActivate:[AuthGuard]},
{path:'result/:Code',component:ResultComponent,canActivate:[AuthGuard]},
{path:'questions/:Code',component:AddQuestionComponent},
{path:'admin',component:AdminpanelComponent, canActivate:[AuthGuard]},
{path:'testmgt',component:TestmanagementComponent, canActivate:[AuthGuard]},
{path:'testList',component:ListTestComponent, canActivate:[AuthGuard]},
{path:'questionList',component:ListQuestionsComponent, canActivate:[AuthGuard]},
{path:'participant',component:ParticipantsComponent, canActivate:[AuthGuard]},
{path:'testmgt/:Code',component:ListQuestionsComponent},
 {path:'**', component:HomeComponent},
//when the user enters route that does not exist
{path:'',redirectTo: '/home', pathMatch:'full'},
];