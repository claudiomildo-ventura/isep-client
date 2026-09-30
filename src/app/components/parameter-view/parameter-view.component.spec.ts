import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ArchetypeService } from '../../core/services/archetype.service';
import { DialogService } from '../../core/services/dialog.service';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { ENVIRONMENT } from 'src/environments/environment';

import { ParameterViewComponent } from './parameter-view.component';

describe('ParameterViewComponent', () => {
  let component: ParameterViewComponent;
  let fixture: ComponentFixture<ParameterViewComponent>;
  let archetypeService: jasmine.SpyObj<ArchetypeService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let indexedDbService: jasmine.SpyObj<IndexedDbService>;
  let navigate: jasmine.Spy;

  beforeEach(async () => {
    archetypeService = jasmine.createSpyObj('ArchetypeService', ['getMappingList', 'postMapping']);
    archetypeService.getMappingList.and.resolveTo([]);
    archetypeService.postMapping.and.resolveTo(undefined);
    dialogService = jasmine.createSpyObj('DialogService', ['alert', 'info']);
    dialogService.alert.and.resolveTo(undefined);
    dialogService.info.and.resolveTo(undefined);
    indexedDbService = jasmine.createSpyObj('IndexedDbService', ['getColumns']);
    indexedDbService.getColumns.and.resolveTo([]);
    await TestBed.configureTestingModule({
      imports: [ParameterViewComponent],
      providers: [
        provideRouter([]),
        { provide: ArchetypeService, useValue: archetypeService },
        { provide: DialogService, useValue: dialogService },
        { provide: IndexedDbService, useValue: indexedDbService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterViewComponent);
    component = fixture.componentInstance;
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(archetypeService.getMappingList).toHaveBeenCalledTimes(6);
    expect(Object.values(component.frm.getRawValue())).toEqual(['', '', '', '', '', '']);
  });

  it('should reject an incomplete form without generating or navigating', async () => {
    await component.submit();
    expect(dialogService.alert).toHaveBeenCalledWith('Invalid form!');
    expect(archetypeService.postMapping).not.toHaveBeenCalled();
    expect(indexedDbService.getColumns).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should submit textual enum IDs and navigate after generation', async () => {
    const table = {
      id: 20, name: 'users', type: 'TABLE', autoCreated: false,
      fields: [{
        id: 10, tableRelationId: 20, columnName: 'id', type: 'INT', index: '', length: 0,
        sequence: 1, isAutoCreated: true, isPrimaryKey: true, isForeignKey: false,
        isIndex: false, isNotNull: true
      }]
    };
    indexedDbService.getColumns.and.resolveTo([table]);
    component.frm.setValue({
      architectures: 'HEXAGONAL',
      databasePlatforms: 'SQLITE',
      databaseEngineers: 'HIBERNATE',
      engineeringPlatforms: 'INTELLIJ_IDEA',
      templates: 'NOT_IMPLEMENTED',
      projectTemplates: 'API_WITH_MODEL'
    });

    await component.submit();

    expect(archetypeService.postMapping).toHaveBeenCalledWith(
      `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.generate_solution}`,
      {
        autoCreated: true,
        architecture: 'HEXAGONAL',
        databasePlatform: 'SQLITE',
        databaseEngineer: 'HIBERNATE',
        engineeringPlatform: 'INTELLIJ_IDEA',
        template: 'NOT_IMPLEMENTED',
        projectTemplate: 'API_WITH_MODEL',
        tables: [{...table, autoCreated: true}]
      }
    );
    expect(navigate).toHaveBeenCalledWith(['/page-home'], {});
    expect(dialogService.info).toHaveBeenCalledWith('Solution generated successfully.');
  });
});
