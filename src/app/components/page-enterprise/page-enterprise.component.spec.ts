import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchetypeService } from 'src/app/core/services/archetype.service';

import { PageEnterpriseComponent } from 'src/app/components/page-enterprise/page-enterprise.component';

describe('PageEnterpriseComponent', () => {
  let component: PageEnterpriseComponent;
  let fixture: ComponentFixture<PageEnterpriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageEnterpriseComponent],
      providers: [
        { provide: ArchetypeService, useValue: { getMapping: jasmine.createSpy().and.resolveTo('ISEP enterprise') } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.enterprise().payload).toBe('ISEP enterprise');
  });
});
