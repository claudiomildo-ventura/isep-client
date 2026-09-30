import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ArchetypeService } from 'src/app/core/services/archetype.service';
import { IndexedDbService } from 'src/app/core/services/indexed-db.service';
import { Table } from 'src/app/shared/interface/Table';
import { ENVIRONMENT } from 'src/environments/environment';

import { PageStructureComponent } from './page-structure.component';

describe('PageStructureComponent', () => {
  let component: PageStructureComponent;
  let fixture: ComponentFixture<PageStructureComponent>;
  let archetypeService: jasmine.SpyObj<ArchetypeService>;
  let indexedDbService: jasmine.SpyObj<IndexedDbService>;
  let navigate: jasmine.Spy;
  let table: Table;
  let previousState: unknown;
  const encodedSql = btoa('CREATE TABLE users (\n    id INT PRIMARY KEY\n);');

  beforeEach(async () => {
    previousState = history.state;
    history.replaceState({detailContent: encodedSql}, '');
    table = {
      id: 1, name: 'users', type: 'TABLE', autoCreated: true,
      fields: [{
        id: 10, tableRelationId: 1, columnName: 'id', type: 'INT', index: '', length: 0,
        sequence: 1, isAutoCreated: true, isPrimaryKey: true, isForeignKey: false,
        isIndex: false, isNotNull: true
      }]
    };
    archetypeService = jasmine.createSpyObj('ArchetypeService', ['postMapping']);
    archetypeService.postMapping.and.resolveTo({tables: [table]});
    indexedDbService = jasmine.createSpyObj('IndexedDbService', ['clearData', 'saveData']);
    indexedDbService.clearData.and.resolveTo(undefined);
    indexedDbService.saveData.and.resolveTo(undefined);
    await TestBed.configureTestingModule({
      imports: [PageStructureComponent],
      providers: [
        provideRouter([]),
        { provide: ArchetypeService, useValue: archetypeService },
        { provide: IndexedDbService, useValue: indexedDbService }
      ]
    })
    .compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(PageStructureComponent);
    component = fixture.componentInstance;
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
  }));

  afterEach(() => {
    history.replaceState(previousState, '');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(archetypeService.postMapping).toHaveBeenCalledWith(
      `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.generate_structure}`, {data: encodedSql}
    );
    expect(component.isPageLoading()).toBeFalse();
    expect(component.canSubmit()).toBeTrue();
    expect(component.selectionModel.selected).toEqual(table.fields);
  });

  it('should not submit without selected fields', async () => {
    component.toggleAllCheckboxes(table);
    await component.submit();
    expect(component.canSubmit()).toBeFalse();
    expect(indexedDbService.saveData).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should persist selected fields before navigating', async () => {
    await component.submit();
    expect(indexedDbService.saveData).toHaveBeenCalledWith([table]);
    expect(navigate).toHaveBeenCalledWith(['/page-parameter'], {});
  });
});
