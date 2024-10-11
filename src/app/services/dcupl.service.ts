import { Injectable } from '@angular/core';
import { Dcupl } from '@dcupl/core';
import { DcuplAppLoader } from '@dcupl/loader';
@Injectable({
  providedIn: 'root',
})
export class DcuplService {
  public dcupl!: Dcupl;
  public dcuplAppLoader!: DcuplAppLoader;

  constructor() {}

  public async init() {
    this.dcupl = new Dcupl({
      config: {
        projectId: 'PP7ECntN4AI5Zfn5vEou',
        apiKey: 'e0aa9e13-8f82-4edb-a5f3-3cf0c9e40207',
      },
    });
    this.dcuplAppLoader = new DcuplAppLoader();
    this.dcupl.loaders.add(this.dcuplAppLoader);

    await this.dcuplAppLoader.config.fetch();

    await this.dcuplAppLoader.process({ applicationKey: 'default' });

    await this.dcupl.init();
  }
}
