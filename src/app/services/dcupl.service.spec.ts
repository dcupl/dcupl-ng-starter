import { TestBed } from '@angular/core/testing';
import { Dcupl } from '@dcupl/core';
import { DcuplService } from './dcupl.service';

type LoadSpy = { load: () => Promise<Dcupl> };

describe('DcuplService', () => {
  it('loads only once when the load succeeds', async () => {
    const service = TestBed.inject(DcuplService);
    const dcupl = {} as Dcupl;
    const load = vi.spyOn(service as unknown as LoadSpy, 'load').mockResolvedValue(dcupl);

    await service.init();
    await expect(service.init()).resolves.toBe(dcupl);

    expect(load).toHaveBeenCalledTimes(1);
  });

  it('does not keep a failed load, so the next call tries again', async () => {
    const service = TestBed.inject(DcuplService);
    const dcupl = {} as Dcupl;
    const load = vi
      .spyOn(service as unknown as LoadSpy, 'load')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(dcupl);

    await expect(service.init()).rejects.toThrow('offline');
    await expect(service.init()).resolves.toBe(dcupl);

    expect(load).toHaveBeenCalledTimes(2);
  });
});
