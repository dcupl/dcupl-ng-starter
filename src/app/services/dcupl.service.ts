import { Injectable } from '@angular/core';
import { Dcupl } from '@dcupl/core';
import { DcuplAppLoader } from '@dcupl/loader';

@Injectable({
  providedIn: 'root',
})
export class DcuplService {
  private ready?: Promise<Dcupl>;

  /** Creates the instance, loads the console project and runs init() once. A failed load is retried on the next call. */
  public init(): Promise<Dcupl> {
    this.ready ??= this.load().catch((err: unknown) => {
      this.ready = undefined;
      throw err;
    });
    return this.ready;
  }

  private async load(): Promise<Dcupl> {
    const dcupl = new Dcupl({
      config: {
        projectId: 'PP7ECntN4AI5Zfn5vEou',
        apiKey: 'e0aa9e13-8f82-4edb-a5f3-3cf0c9e40207',
      },
    });
    const loader = new DcuplAppLoader();
    dcupl.loaders.add(loader);

    await loader.config.fetch();
    await loader.process({ applicationKey: 'default' });
    await dcupl.init();

    return dcupl;
  }
}
