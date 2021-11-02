import * as fs from 'fs';
import MitreData, { MitreItem } from './types';

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

    public get platformRelations(): { platform: string; itemId: string }[] {
      return this.data.objects.map(item => {
        if (!item.x_mitre_platforms) {
          return undefined;
        }
        return item.x_mitre_platforms.map(platform => ({ platform, itemId: item.id }));
      }).flat().filter(x => x !== undefined);
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

    // TODO: Implement this in the end
    public get relationships(): MitreItem[] {
      return this.data.objects.filter(obj => obj.type === 'relationship')
    }
}
