import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { ArchetypeService } from './core/services/archetype.service';
import { SessionService } from './core/services/session-storage.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: ArchetypeService, useValue: { getMapping: jasmine.createSpy().and.resolveTo('ISEP') } },
        { provide: SessionService, useValue: jasmine.createSpyObj('SessionService', ['clear', 'setItem']) }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the title, routed content and footer', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('page-title')?.textContent).toContain('ISEP');
    expect(compiled.querySelector('main.app-content router-outlet')).not.toBeNull();
    expect(compiled.querySelector('page-end')).not.toBeNull();
  });
});
