import { TestBed } from '@angular/core/testing';

import { PurchaseTrackingServiceService } from './purchase-tracking-service.service';

describe('PurchaseTrackingServiceService', () => {
  let service: PurchaseTrackingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseTrackingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
