import { TestBed } from '@angular/core/testing';

import { ActivityDetailService } from './activity-detail.service';

describe('ActivityDetailService', () => {
  let service: ActivityDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
