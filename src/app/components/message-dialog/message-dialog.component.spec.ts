import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MessageDialogComponent } from './message-dialog.component';

describe('MessageDialogComponent', () => {
  let component: MessageDialogComponent;
  let fixture: ComponentFixture<MessageDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<MessageDialogComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [MessageDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Generation', message: 'Project generated.' } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the injected message and close on confirmation', () => {
    expect(fixture.nativeElement.textContent).toContain('Project generated.');
    fixture.nativeElement.querySelector('button').click();
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
  });
});
