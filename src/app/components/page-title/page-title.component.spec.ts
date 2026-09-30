import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchetypeService } from 'src/app/core/services/archetype.service';
import { SessionService } from 'src/app/core/services/session-storage.service';

import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';

describe('PageTitleComponent', () => {
  let component: PageTitleComponent;
  let fixture: ComponentFixture<PageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageTitleComponent],
      providers: [
        { provide: ArchetypeService, useValue: { getMapping: jasmine.createSpy().and.resolveTo('ISEP') } },
        { provide: SessionService, useValue: jasmine.createSpyObj('SessionService', ['clear', 'setItem']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.title().payload).toBe('ISEP');
    expect(fixture.nativeElement.textContent).toContain('ISEP');
  });
});
