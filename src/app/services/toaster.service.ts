import { Injectable } from '@angular/core';

export enum ToastType {
  PRIMARY = "primary",
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  DANGER = "danger"
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor() { }

  toasts = [];

  //Method used to create a toast, the message being the string
  //shown, the type determines the class and the lifespan
  //determines how long the message lasts
  createToast(message: string, type: ToastType, lifespan?: number){
    let toast = {message: message, type: type.toString(), delete: false, timers: []};    
    this.toasts.push(toast);

    if (!lifespan) {
      lifespan = 5000;
    }
    
    //We use two timers to start the animation and then to remove the
    //toast.
    toast.timers.push(setTimeout(() => {
      toast.delete = true;
      toast.timers.push(setTimeout(() => {
        this.toasts.splice(this.toasts.indexOf(toast), 1);
      }, 450));
    }, lifespan));
  }



  //Method to dimiss a toast early
  dismissToast(toast) {
    toast.delete = true;
    
    for(let i = 0; i < toast.timers.length; i++) {
      clearTimeout(toast.timers[i]);
    }

    setTimeout(() => {
      this.toasts.splice(this.toasts.indexOf(toast), 1);
    }, 450);

  }


}
