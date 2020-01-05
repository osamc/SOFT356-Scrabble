import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToasterComponent } from './toaster.component';
import { ToastType } from '../services/toaster.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ToasterComponent', () => {
  let component: ToasterComponent;
  let fixture: ComponentFixture<ToasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('Should create a new toast when one is made', () => {
    component.toaster.createToast('test', ToastType.INFO);
    fixture.detectChanges();
    let toasts: DebugElement[] = fixture.debugElement.queryAll(By.css('.alert'));
    expect(toasts.length).toEqual(1);
  })

});
