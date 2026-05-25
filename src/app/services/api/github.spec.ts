import { TestBed } from '@angular/core/testing';

import { Github } from './github.service';

describe('Github', () => {
  let service: Github;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Github);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
