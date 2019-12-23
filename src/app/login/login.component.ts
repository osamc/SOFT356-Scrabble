import { Component, OnInit } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  md5: Md5;;
  create: boolean = false;

  constructor() { 
    this.md5 = new Md5();
    console.log(this.md5.appendStr('hello').end());
  }

  ngOnInit() {
  }



  createAccount(name: string) {
    console.log(name);
  }

  login(name: string, hash: string) {

  }



}
