import { Component, OnInit } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import { ApiService } from '../services/api.service';
import { Player } from '../models/player';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private api: ApiService) {}

  ngOnInit() {}

  createPlayer(name: string) {
    this.api.createPlayer(name).subscribe(res => {
      console.log(res);
    });
  }




}
