import {CommonModule} from "@angular/common";
import {Component, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ProgressBarComponent} from "src/app/components/progress-bar/progress-bar.component";
import {ApiResponse} from "src/app/shared/interface/ApiResponse";
import {ArchetypeGenerate} from "src/app/shared/interface/archetype-generate";
import {TECHNICAL_LOGGER} from "src/config/technical-logger";
import {ENVIRONMENT} from "src/environments/environment";
import {ArchetypeService} from "../../core/services/archetype.service";
import {DialogService} from "../../core/services/dialog.service";
import {IndexedDbService} from "../../core/services/indexed-db.service";
import {MaterialModule} from "../../material.module";
import {Field} from "../../shared/interface/Field";
import {ParameterListResponse} from "../../shared/interface/parameter-list-response";
import {Table} from "../../shared/interface/Table";
import {StringFunc} from "../../shared/string-utils/StringFunc";

type ParameterForm = FormGroup<{
    architectures: FormControl<string>;
    databasePlatforms: FormControl<string>;
    databaseEngineers: FormControl<string>;
    engineeringPlatforms: FormControl<string>;
    templates: FormControl<string>;
    projectTemplates: FormControl<string>;
}>;

@Component({
    selector: 'parameter-view',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        ProgressBarComponent
    ],
    templateUrl: './parameter-view.component.html',
    styleUrl: './parameter-view.component.css'
})
export class ParameterViewComponent implements OnInit {
    private readonly _architecture: WritableSignal<ApiResponse<string>> = signal({payload: StringFunc.STRING_EMPTY});
    public architecture: Signal<ApiResponse<string>> = this._architecture.asReadonly();

    private readonly _databasePlatform: WritableSignal<ApiResponse<string>> = signal({payload: StringFunc.STRING_EMPTY});
    public databasePlatform: Signal<ApiResponse<string>> = this._databasePlatform.asReadonly();

    private readonly _databaseEngineer: WritableSignal<ApiResponse<string>> = signal({payload: StringFunc.STRING_EMPTY});
    public databaseEngineer: Signal<ApiResponse<string>> = this._databaseEngineer.asReadonly();

    private readonly _engineeringPlatform: WritableSignal<ApiResponse<string>> = signal({payload: StringFunc.STRING_EMPTY});
    public engineeringPlatform: Signal<ApiResponse<string>> = this._engineeringPlatform.asReadonly();

    private readonly _template: WritableSignal<ApiResponse<string>> = signal({payload: StringFunc.STRING_EMPTY});
    public template: Signal<ApiResponse<string>> = this._template.asReadonly();

    private readonly _projectTemplate: WritableSignal<ApiResponse<string>> = signal({payload: StringFunc.STRING_EMPTY});
    public projectTemplate: Signal<ApiResponse<string>> = this._projectTemplate.asReadonly();

    private readonly _architectures: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public architectures: Signal<ParameterListResponse[]> = this._architectures.asReadonly();

    private readonly _databasePlatforms: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public databasePlatforms: Signal<ParameterListResponse[]> = this._databasePlatforms.asReadonly();

    private readonly _databaseEngineers: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public databaseEngineers: Signal<ParameterListResponse[]> = this._databaseEngineers.asReadonly();

    private readonly _engineeringPlatforms: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public engineeringPlatforms: Signal<ParameterListResponse[]> = this._engineeringPlatforms.asReadonly();

    private readonly _templates: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public templates: Signal<ParameterListResponse[]> = this._templates.asReadonly();

    private readonly _projectTemplates: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public projectTemplates: Signal<ParameterListResponse[]> = this._projectTemplates.asReadonly();

    private readonly router: Router = inject(Router);
    private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
    private readonly dialogService: DialogService = inject(DialogService);
    private readonly indexedDbService: IndexedDbService = inject(IndexedDbService);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);
    private readonly selectionValidators = [Validators.required, Validators.pattern(/^(?!0$).+$/)];

    public frm: ParameterForm = this.fb.group({
        architectures: ['0', this.selectionValidators],
        databasePlatforms: ['0', this.selectionValidators],
        databaseEngineers: ['0', this.selectionValidators],
        engineeringPlatforms: ['0', this.selectionValidators],
        templates: ['0', this.selectionValidators],
        projectTemplates: ['0', this.selectionValidators]
    });

    ngOnInit(): void {
        this.allTitleComponentsInitialize();
        this.allListComponentsInitialize();
        this.allTemplateComponentsInitialize();
    }

    public async submit(): Promise<void> {
        if (this.frm.invalid) {
            this.frm.markAllAsTouched();
            return;
        }

        try {
            await this.dataPost();
        } catch {
            void this.dialogService.alert('Unable to generate the solution. Check the selected profile and try again.');
            return;
        }
        await this.navigateToPageHome();
        void this.dialogService.info('Solution generated successfully.');
    }

    private async navigateToPageHome(): Promise<void> {
        await this.router.navigate(['/page-home'], {}).then(success => TECHNICAL_LOGGER.info(`Navigation result: ${success}`));
    }

    private async dataPost(): Promise<void> {
        const tablesData: Table[] = await this.indexedDbService.getColumns();

        const tables: Table[] = [];

        for (const element of tablesData) {
            const t = element;

            const table: Table = {
                id: t.id,
                name: t.name,
                type: t.type,
                autoCreated: true,
                fields: []
            };

            for (const element of t.fields) {
                const column = element;

                const field: Field = {
                    id: column.id,
                    tableRelationId: column.tableRelationId,
                    columnName: column.columnName,
                    type: column.type,
                    index: column.index,
                    length: column.length,
                    sequence: column.sequence,
                    isAutoCreated: column.isAutoCreated,
                    isPrimaryKey: column.isPrimaryKey,
                    isForeignKey: column.isForeignKey,
                    isIndex: column.isIndex,
                    isNotNull: column.isNotNull
                };

                table.fields.push(field);
            }
            tables.push(table);
        }

        const formValue = this.frm.getRawValue();
        const archetypeGenerate: ArchetypeGenerate = {
            autoCreated: true,
            architecture: formValue.architectures,
            databasePlatform: formValue.databasePlatforms,
            databaseEngineer: formValue.databaseEngineers,
            engineeringPlatform: formValue.engineeringPlatforms,
            template: formValue.templates,
            projectTemplate: formValue.projectTemplates,
            tables: tables
        };

        await this.archetypeService.postMapping<void>(
            `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.generate_solution}`,
            archetypeGenerate
        );
    }

    private allTitleComponentsInitialize(): void {
        this._architecture.set({payload: StringFunc.STRING_EMPTY});
        this._databasePlatform.set({payload: StringFunc.STRING_EMPTY});
        this._databaseEngineer.set({payload: StringFunc.STRING_EMPTY});
        this._engineeringPlatform.set({payload: StringFunc.STRING_EMPTY});
        this._template.set({payload: StringFunc.STRING_EMPTY});
        this._projectTemplate.set({payload: StringFunc.STRING_EMPTY});
    }

    private allListComponentsInitialize(): void {
        this._architectures.set([]);
        this._databasePlatforms.set([]);
        this._databaseEngineers.set([]);
        this._engineeringPlatforms.set([]);
        this._templates.set([]);
        this._projectTemplates.set([]);
    }

    private allTemplateComponentsInitialize(): void {
        void this.architecturesInitialize();
        void this.databasePlatformInitialize();
        void this.databaseEngineerInitialize();
        void this.engineeringPlatformInitialize();
        void this.templatesInitialize();
        void this.projectTemplatesInitialize();
    }

    private async architecturesInitialize(): Promise<void> {
        this._architecture.set({payload: 'Architecture'});
        this._architectures.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.architectures}`));
        this.frm.patchValue({architectures: '0'});
    }

    private async databasePlatformInitialize(): Promise<void> {
        this._databasePlatform.set({payload: 'Database platform'});
        this._databasePlatforms.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.database_platforms}`));
        this.frm.patchValue({databasePlatforms: '0'});
    }

    private async databaseEngineerInitialize(): Promise<void> {
        this._databaseEngineer.set({payload: 'Database engineer'});
        this._databaseEngineers.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.database_engineers}`));
        this.frm.patchValue({databaseEngineers: '0'});
    }

    private async engineeringPlatformInitialize(): Promise<void> {
        this._engineeringPlatform.set({payload: 'Engineering platform'});
        this._engineeringPlatforms.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.engineering_platforms}`));
        this.frm.patchValue({engineeringPlatforms: '0'});
    }

    private async templatesInitialize(): Promise<void> {
        this._template.set({payload: 'Template'});
        this._templates.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.templates}`));
        this.frm.patchValue({templates: '0'});
    }

    private async projectTemplatesInitialize(): Promise<void> {
        this._projectTemplate.set({payload: 'Project template'});
        this._projectTemplates.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.project_templates}`));
        this.frm.patchValue({projectTemplates: '0'});
    }
}