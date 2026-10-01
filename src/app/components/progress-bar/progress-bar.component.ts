import {CommonModule} from "@angular/common";
import {Component, OnDestroy, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MaterialModule} from "src/app/material.module";
import {PROGRESS_BAR} from "src/config/progress-bar";

@Component({
    selector: 'progress-bar',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule
    ],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent implements OnInit, OnDestroy {
    private static readonly loadingShownKey: string = 'isep.progress.loadingShown';

    private readonly _isPageLoading: WritableSignal<boolean> = signal(false);
    public isPageLoading: Signal<boolean> = this._isPageLoading.asReadonly();

    private readonly _progressValue: WritableSignal<number> = signal(0);
    public progressValue: Signal<number> = this._progressValue.asReadonly();

    private interval?: ReturnType<typeof setInterval>;

    ngOnInit(): void {
        this.progressBarInitialize();
    }

    ngOnDestroy(): void {
        this.progressBarDestroyConfig();
    }

    private progressBarInitialize(): void {
        if (sessionStorage.getItem(ProgressBarComponent.loadingShownKey)) {
            return;
        }

        this._isPageLoading.set(true);
        this.progressBarLoadConfig();
    }

    private progressBarLoadConfig(): void {
        this.interval = setInterval((): void => {
            const nextProgressValue: number = Math.min(
                this._progressValue() + PROGRESS_BAR.progressIncrementValue,
                PROGRESS_BAR.progressMaxValue
            );

            this._progressValue.set(nextProgressValue);

            if (nextProgressValue === PROGRESS_BAR.progressMaxValue) {
                this.progressBarDestroyConfig();
                this._isPageLoading.set(false);

                try {
                    sessionStorage.setItem(ProgressBarComponent.loadingShownKey, 'true');
                } catch {
                    return;
                }
            }
        }, PROGRESS_BAR.delay);
    }

    private progressBarDestroyConfig(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
}