import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { ReportComponent } from './reports/report.component';

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "aboutus", component: AboutusComponent },
    { path: "contactus", component: ContactusComponent },
    { path: "login", component: LoginComponent },
    { path: "game", component: GameComponent},
    { path: "report", component: ReportComponent },
    { path: "**", component: HomeComponent }, // Updated wildcard route
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}