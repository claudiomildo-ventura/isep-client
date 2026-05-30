import {CommonModule} from "@angular/common";
import {AfterViewInit, Component, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {ProgressBarComponent} from "src/app/components/progress-bar/progress-bar.component";
import {ArchetypeService} from "src/app/core/services/archetype.service";
import {MaterialModule} from "src/app/material.module";
import {ApiResponse} from "src/app/shared/interface/ApiResponse";
import {NUMBER_CONSTANT} from "src/app/shared/NumberConstant";
import {StringFunc} from 'src/app/shared/string-utils/StringFunc';
import {Validator} from 'src/app/shared/validator/validator';
import {TECHNICAL_LOGGER} from "src/config/technical-logger";
import {ENVIRONMENT} from 'src/environments/environment';

@Component({
    selector: 'page-home',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        ProgressBarComponent
    ],
    templateUrl: './page-home.component.html',
    styleUrls: ['./page-home.component.css', "../../../../styles/sass/_variables.scss"],
})
export class PageHomeComponent implements OnInit, AfterViewInit {
    private readonly _detail: WritableSignal<ApiResponse<string>> = signal({payload: StringFunc.STRING_EMPTY});
    public detail: Signal<ApiResponse<string>> = this._detail.asReadonly();

    public isPageLoading: boolean = true;
    public startValidation: boolean = false;
    public selectedFileName: string = StringFunc.STRING_EMPTY;
    public errorList: string[] = [];

    private readonly router: Router = inject(Router);
    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    public frm: FormGroup = this.fb.group({
        detail: [StringFunc.STRING_EMPTY,
            [
                Validators.required,
                Validators.minLength(NUMBER_CONSTANT.INITIALIZE_WITH_2),
                Validator.textContainsValue,
                Validator.textContainsDefaultValue,
                Validator.textContainsCreateTableValue
            ]
        ]
    });

    ngOnInit(): void {
        void this.detailInitialize();
    }

    ngAfterViewInit(): void {
        this.progressBarInitialize();
    }

    get detailControl(): AbstractControl<any, any> | null {
        return this.frm.get('detail');
    }

    get errorMessage(): string | null {
        const error = this.detailControl?.errors;
        if (!error) return null;

        if (error['minlength']) return this.errorList[0];
        if (error['required'] || error['textContainsValue']) return this.errorList[1];
        if (error['textContainsDefaultValue'] || error['textContainsCreateTableValue']) return this.errorList[2];

        return null;
    }

    public submit(): void {
        if (this.frm.valid) {
            const detailValue: any = this.frm.getRawValue().detail;
            this.navigateToPageStructure(StringFunc.encodeBase64(detailValue));
        } else {
            this.startValidation = true;
            this.frm.markAllAsTouched();
        }
    }

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file: File | undefined = input.files?.[0];
        if (!file) return;

        this.selectedFileName = file.name;
        const reader = new FileReader();
        reader.onload = (): void => this.frm.patchValue({detail: reader.result as string});
        reader.readAsText(file);
    }

    private navigateToPageStructure(content: string): void {
        this.router.navigate(['/page-structure'], {
            state: {detailContent: content}
        }).then(success => TECHNICAL_LOGGER.info(`Navigation result: ${success}`));
    }

    private async detailInitialize(): Promise<void> {
        this._detail.set({payload: await this.archetypeService.getMapping(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.detail}`)});
        this.frm.patchValue({detail: this.detail().payload});
    }

    private progressBarInitialize(): void {
        setTimeout((): void => {
            this.isPageLoading = false;
        }, 5000);
    }
}