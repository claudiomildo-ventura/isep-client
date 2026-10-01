import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchetypeService } from 'src/app/core/services/archetype.service';

import { PageEndComponent } from 'src/app/components/page-end/page-end.component';

describe('PageEndComponent', () => {
  let component: PageEndComponent;
  let fixture: ComponentFixture<PageEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageEndComponent],
      providers: [
        { provide: ArchetypeService, useValue: { getMapping: jasmine.createSpy().and.resolveTo('ISEP footer') } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.footer().payload).toBe('ISEP footer');
  });
});
