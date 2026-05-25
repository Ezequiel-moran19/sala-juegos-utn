import { TestBed } from '@angular/core/testing';

import { MayorMenorService } from './mayor-menor.service';

describe('MayorMenor', () => {
  let service: MayorMenorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MayorMenorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
