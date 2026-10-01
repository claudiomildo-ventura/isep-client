import {SelectionModel} from "@angular/cdk/collections";
import {CommonModule} from "@angular/common";
import {AfterViewInit, Component, inject, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {ProgressBarComponent} from "src/app/components/progress-bar/progress-bar.component";
import {ArchetypeService} from "src/app/core/services/archetype.service";
import {IndexedDbService} from "src/app/core/services/indexed-db.service";
import {MaterialModule} from "src/app/material.module";
import {Field} from "src/app/shared/interface/Field";
import {Table} from "src/app/shared/interface/Table";
import {TableResponse} from "src/app/shared/interface/TablesResponse";
import {BoldPipe} from "src/app/shared/pipe/bold.pipe";
import {TECHNICAL_LOGGER} from "src/config/technical-logger";
import {ENVIRONMENT} from "src/environments/environment";

@Component({
    selector: 'page-structure',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        ProgressBarComponent,
        BoldPipe
    ],
    templateUrl: './page-structure.component.html',
    styleUrl: './page-structure-app.component.css'
})
export class PageStructureComponent implements OnInit, AfterViewInit {
    private detailContent: unknown;
    private readonly _isPageLoading: WritableSignal<boolean> = signal(true);
    public isPageLoading: Signal<boolean> = this._isPageLoading.asReadonly();

    private readonly _canSubmit: WritableSignal<boolean> = signal(false);
    public canSubmit: Signal<boolean> = this._canSubmit.asReadonly();

    public tables: Table[] = [];
    public dtsTablesCols: string[] = ['fields'];
    public dtsTables: MatTableDataSource<Table> = new MatTableDataSource<Table>();
    public selectionModel: SelectionModel<Field> = new SelectionModel<Field>(true, []);

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly router: Router = inject(Router);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);
    private readonly indexedDbService: IndexedDbService = inject(IndexedDbService);

    @ViewChild(MatSort) sort!: MatSort;

    public frm: FormGroup = this.fb.group({});

    ngOnInit(): void {
        this.getDetailFromDashboardForm();
        void this.pageLoadInitialize();
    }

    ngAfterViewInit(): void {
        this.dataSourceSort();
    }

    public async submit(): Promise<void> {
        if (this.frm.invalid || this.selectionModel.selected.length === 0) return;

        const tablesWithFields: Table[] = this.getAllTablesWithFieldsFromStructureForm();
        await this.saveData(tablesWithFields);
        await this.navigateToPageParameter();
    }

    public toggleRow(field: Field): void {
        this.selectionModel.toggle(field);
        this.updateCanSubmit();
    }

    public toggleAllCheckboxes(table: Table): void {
        this.areAllCheckboxesSelected(table)
            ? table.fields.forEach((f: Field): boolean | void => this.selectionModel.deselect(f))
            : table.fields.forEach((f: Field): boolean | void => this.selectionModel.select(f));
        this.updateCanSubmit();
    }

    public areAllCheckboxesSelected(table: Table): boolean {
        return table.fields.length > 0 && table.fields.every(f => this.selectionModel.isSelected(f));
    }

    public isSomeCheckboxesSelected(table: Table): boolean {
        const selectedCount = table.fields.filter(f => this.selectionModel.isSelected(f)).length;
        return selectedCount > 0 && selectedCount < table.fields.length;
    }

    public handleKeydown(event: KeyboardEvent, field: Field): void {
        // Stop propagation if the keypress is relevant to prevent it from affecting parent elements
        event.stopPropagation();

        // Example 1: Trigger toggleRow if the SPACE key is pressed
        if (event.key === ' ') {
            // Prevent the default action (which the checkbox usually handles anyway,
            // but this is good practice)
            event.preventDefault();

            // Call your existing selection logic
            this.toggleRow(field);
            TECHNICAL_LOGGER.info('Space bar pressed on checkbox.');
        }

        // Example 2: Do something else on the ENTER key
        if (event.key === 'Enter') {
            TECHNICAL_LOGGER.info('Enter key pressed on checkbox.');
        }
    }

    private selectingAllCheckboxesOnLoad(): void {
        this.selectionModel.select(...this.tables.flatMap(t => t.fields));
    }

    private getDetailFromDashboardForm(): void {
        const {detailContent} = history.state ?? {};
        this.detailContent = detailContent as string;
    }

    private dtsTablesInitialize(tables: Table[]): void {
        this.tables = tables;
        this.dtsTables.data = this.tables;
    }

    private dataSourceSort(): void {
        if (this.sort) {
            this.dtsTables.sort = this.sort;
        }
    }

    private formShow(tablesResponse: TableResponse): void {
        this.dtsTablesInitialize(tablesResponse.tables);
        this.dataSourceSort();
        this.selectingAllCheckboxesOnLoad();
    }

    private async pageLoadInitialize(): Promise<void> {
        this._isPageLoading.set(true);
        this._canSubmit.set(false);

        try {
            await this.clearData();
            await this.dataPost();
        } finally {
            setTimeout((): void => {
                this._isPageLoading.set(false);
                this.updateCanSubmit();
            });
        }
    }

    private updateCanSubmit(): void {
        this._canSubmit.set(!this._isPageLoading() && this.selectionModel.selected.length > 0);
    }

    private getAllTablesWithFieldsFromStructureForm(): Table[] {
        return this.dtsTables.data
            .map((table: Table) => ({
                ...table,
                fields: table.fields.filter((field: Field): boolean => this.selectionModel.isSelected(field))
            }))
            .filter(table => table.fields.length > 0);
    }

    private async navigateToPageParameter(): Promise<void> {
        await this.router.navigate(['/page-parameter'], {}).then(success => TECHNICAL_LOGGER.info(`Navigation result: ${success}`));
    }

    private async dataPost(): Promise<void> {
        const response: TableResponse = await this.archetypeService.postMapping<TableResponse>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.generate_structure}`,
            {data: this.detailContent}
        );

        this.formShow(response);
    }

    private async saveData(columns: Table[]): Promise<void> {
        try {
            await this.indexedDbService.saveData(columns);
        } catch (err) {
            TECHNICAL_LOGGER.error(err);
            throw err;
        }
    }

    private async clearData(): Promise<void> {
        try {
            await this.indexedDbService.clearData();
        } catch (err) {
            TECHNICAL_LOGGER.error(err);
        }
    }
}