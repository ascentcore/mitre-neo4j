import * as fs from 'fs';
import MitreData, { ExternalReference, MitreItem } from './types';

export default class Mitre {
    private data: MitreData;

    constructor() {
      const raw = fs.readFileSync(`${__dirname}/../../data/mitre-attack.json`, 'utf-8')
      this.data = JSON.parse(raw)
    }

    public get types(): string[] {
      return [...new Set(this.nonDeprecatedObjects.map(obj => obj.type))]
    }

    public get platforms(): string[] {
      return [...new Set(this.nonDeprecatedObjects.map(obj => obj.x_mitre_platforms).flat().sort())].filter(v => v !== undefined)
    }

    public get contributors(): string[] {
      return [...new Set(this.nonDeprecatedObjects.map(obj => obj.x_mitre_contributors).flat().sort())].filter(v => v !== undefined)
    }

    public get permissions(): string[] {
      return [...new Set(this.nonDeprecatedObjects.map(obj => obj.x_mitre_permissions_required).flat().sort())].filter(v => v !== undefined)
    }

    public get techniques(): MitreItem[] {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'x-mitre-tactic')
    }

    public get attackPatterns(): MitreItem[] {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'attack-pattern')
    }

    public get coursesOfAction(): MitreItem[] {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'course-of-action')
    }

    public get tools(): MitreItem[] {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'tool')
    }

    public get dataSources(): MitreItem[] {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'x-mitre-data-source')
    }

    public get dataComponents(): MitreItem[] {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'x-mitre-data-component')
    }

    public get identities(): MitreItem[] {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'identity')
    }

    public get intrusionSets(): MitreItem[] {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'intrusion-set')
    }

    public get malwares(): MitreItem[] {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'malware')
    }

    public get relationships(): MitreItem[] {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'relationship')
    }

    public get externalReferences(): { reference: ExternalReference; itemId: string }[] {
      return this.nonDeprecatedObjects.map(item => {
        if (!item.external_references || item.external_references.length === 0) {
          return undefined;
        }
        return item.external_references.map(reference => ({ reference, itemId: item.id }));
      }).flat().filter(x => x !== undefined);
    }

    public get platformRelations(): { platform: string; itemId: string }[] {
      return this.nonDeprecatedObjects.map(item => {
        if (!item.x_mitre_platforms) {
          return undefined;
        }
        return item.x_mitre_platforms.map(platform => ({ platform, itemId: item.id }));
      }).flat().filter(x => x !== undefined);
    }

    public get contributorRelations(): { contributor: string; itemId: string }[] {
      return this.nonDeprecatedObjects.map(item => {
        if (!item.x_mitre_contributors) {
          return undefined;
        }
        return item.x_mitre_contributors.map(contributor => ({ contributor, itemId: item.id }));
      }).flat().filter(x => x !== undefined);
    }

    public get permissionRelations(): { permission: string, itemId: string }[] {
      return this.nonDeprecatedObjects.map(item => {
        if (!item.x_mitre_permissions_required) {
          return undefined;
        }
        return item.x_mitre_permissions_required.map(permission => ({ permission, itemId: item.id }));
      }).flat().filter(x => x !== undefined);
    }

    public get matrixRelations(): { srcTactic: string, destTactic: string }[] {
      const result = [];
      for (let id = 0; id !== this.matrix.tactic_refs.length - 1; id ++) {
        const tactic = this.matrix.tactic_refs[id]
        const nextTactic = this.matrix.tactic_refs[id + 1]
        result.push({ srcTactic: tactic, destTactic: nextTactic });
      }
      return result;
    }

    public get techinqueAttackPatternRelations(): { techniqueShortName: string, attackPattern: string }[] {
      return this.attackPatterns.map(item => {
        if (!item.kill_chain_phases || item.kill_chain_phases.length === 0) {
          return undefined;
        }
        return item.kill_chain_phases.map(phase => ({ techniqueShortName: phase.phase_name, attackPattern: item.id }));
      }).flat().filter(x => x !== undefined);
    }

    public get dataSourceRelations(): { dataSource: string, itemId: string }[] {
      return this.dataComponents.map(item => {
        if (!item.x_mitre_data_source_ref) {
          return undefined;
        }
        return ({ dataSource: item.x_mitre_data_source_ref, itemId: item.id });
      }).flat().filter(x => x !== undefined);
    }

    private get matrix(): MitreItem {
      return this.nonDeprecatedObjects.filter(obj => obj.type === 'x-mitre-matrix')[0]
    }

    private get nonDeprecatedObjects(): MitreItem[] {
      return this.data.objects.filter(obj => !obj.x_mitre_deprecated && !obj.revoked);
    }
}
