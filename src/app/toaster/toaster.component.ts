import { Component, OnInit } from '@angular/core';
import { ToasterService, ToastType } from '../services/toaster.service';


@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {

  constructor(public toaster: ToasterService) { }

  ngOnInit() {
  }

}
