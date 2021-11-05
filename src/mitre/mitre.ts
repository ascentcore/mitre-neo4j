import * as fs from 'fs';
import MitreData, { ExternalReference, MitreItem } from './types';

export default class Mitre {
    private data: MitreData;

    constructor() {
      const raw = fs.readFileSync(`${__dirname}/../../data/mitre-attack.json`, 'utf-8')
      this.data = JSON.parse(raw)
    }

    public get types(): string[] {
      return [...new Set(this.data.objects.map(obj => obj.type))]
    }

    public get platforms(): string[] {
      return [...new Set(this.data.objects.map(obj => obj.x_mitre_platforms).flat().sort())].filter(v => v !== undefined)
    }

    public get contributors(): string[] {
      return [...new Set(this.data.objects.map(obj => obj.x_mitre_contributors).flat().sort())].filter(v => v !== undefined)
    }

    public get techniques(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'x-mitre-tactic')
    }

    public get attackPatterns(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'attack-pattern')
    }

    public get coursesOfAction(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'course-of-action')
    }

    public get tools(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'tool')
    }

    public get dataSources(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'x-mitre-data-source')
    }

    public get dataComponents(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'x-mitre-data-component')
    }

    public get identities(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'identity')
    }

    public get intrusionSets(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'intrusion-set')
    }

    public get malwares(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'malware')
    }

    // TODO: Implement this in the end
    public get relationships(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'relationship')
    }

    public get externalReferences(): { reference: ExternalReference; itemId: string }[] {
      return this.data.objects.map(item => {
        if (!item.external_references || item.external_references.length === 0) {
          return undefined;
        }
        return item.external_references.map(reference => ({ reference, itemId: item.id }));
      }).flat().filter(x => x !== undefined);
    }

    public get platformRelations(): { platform: string; itemId: string }[] {
      return this.data.objects.map(item => {
        if (!item.x_mitre_platforms) {
          return undefined;
        }
        return item.x_mitre_platforms.map(platform => ({ platform, itemId: item.id }));
      }).flat().filter(x => x !== undefined);
    }

    public get contributorRelations(): { contributor: string; itemId: string }[] {
      return this.data.objects.map(item => {
        if (!item.x_mitre_contributors) {
          return undefined;
        }
        return item.x_mitre_contributors.map(contributor => ({ contributor, itemId: item.id }));
      }).flat().filter(x => x !== undefined);
    }
}
