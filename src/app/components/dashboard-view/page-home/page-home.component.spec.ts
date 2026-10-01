import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ArchetypeService } from 'src/app/core/services/archetype.service';

import { PageHomeComponent } from './page-home.component';

describe('PageHomeComponent', () => {
  let component: PageHomeComponent;
  let fixture: ComponentFixture<PageHomeComponent>;
  let navigate: jasmine.Spy;
  const sql = 'CREATE TABLE users (\n    id INT PRIMARY KEY\n);';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHomeComponent],
      providers: [
        provideRouter([]),
        { provide: ArchetypeService, useValue: { getMapping: jasmine.createSpy().and.resolveTo(sql) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(PageHomeComponent);
    component = fixture.componentInstance;
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.frm.getRawValue().detail).toBe(sql);
  });

  it('should reject empty SQL without navigating', () => {
    component.frm.setValue({detail: ''});
    component.submit();
    expect(component.startValidation).toBeTrue();
    expect(component.frm.touched).toBeTrue();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should send SQL as Base64 navigation state', async () => {
    component.submit();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledWith(['/page-structure'], {state: {detailContent: btoa(sql)}});
  });
});
