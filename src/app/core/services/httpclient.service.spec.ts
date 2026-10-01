import {TestBed} from '@angular/core/testing';
import {HttpclientService} from './httpclient.service';
import {HttpClient, HttpContext} from '@angular/common/http';
import {of} from 'rxjs';

describe('HttpclientService', (): void => {
    let service: HttpclientService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
        TestBed.configureTestingModule({
            providers: [
                HttpclientService,
                {provide: HttpClient, useValue: httpClientSpy}
            ]
        });
        service = TestBed.inject(HttpclientService);
    });

    it('should be created', (): void => {
        expect(service).toBeTruthy();
    });

    it('should call getMapping$ and return expected data', (): void => {
        const expectedData = {param: 'value'};
        httpClientSpy.get.and.returnValue(of(expectedData));
        service.getMapping$<typeof expectedData>('test-url').subscribe((data: typeof expectedData): void => {
            expect(data).toEqual(expectedData);
        });
        expect(httpClientSpy.get).toHaveBeenCalledWith('test-url', jasmine.objectContaining({context: jasmine.any(HttpContext)}));
    });

    it('should call postMapping$ and return expected response', (): void => {
        const postData = {key: 'val'};
        const expectedResponse = {success: true};
        httpClientSpy.post.and.returnValue(of(expectedResponse));
        service.postMapping$<typeof expectedResponse>('test-url', postData).subscribe((res: typeof expectedResponse): void => {
            expect(res).toEqual(expectedResponse);
        });
        expect(httpClientSpy.post).toHaveBeenCalledWith('test-url', postData, jasmine.objectContaining({context: jasmine.any(HttpContext)}));
    });
});
