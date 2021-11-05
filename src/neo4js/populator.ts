import * as neo4j from 'neo4j-driver';
import Mitre from '../mitre/mitre';
import AttackPatternPopulator from './populators/node/attackPatternPopulator';
import ContributorsPopulator from './populators/node/contributorsPopulator';
import CourseOfActionPopulator from './populators/node/courseOfActionPopulator';
import DataComponentPopulator from './populators/node/dataComponentPopulator';
import DataSourcePopulator from './populators/node/dataSourcePopulator';
import IdentitiesPopulator from './populators/node/identititesPopulator';
import IntrusionSetPopulator from './populators/node/intrusionSetPopulator';
import MalwaresPopulator from './populators/node/malwaresPopulator';
import NodePopulater from './populators/abstract/entryPopulator';
import PlatformPopulator from './populators/node/platformPopulator';
import TechniquesPopulator from './populators/node/techniquesPopulator';
import ToolsPopulator from './populators/node/toolsPopulator';
import PlatformRelationPopulator from './populators/relations/platformRelationPopulator';
import ContributorsRelationPopulator from './populators/relations/contributorsRelationPopulator';
import RelationshipsPopulator from './populators/relations/relationshipsPopulator';

// TODO: Attack Pattern has permissions, add that
// TODO: Attack Pattern has Data Sources
export default class Neo4jPopulater {
  private uri: string;
  private driver: neo4j.Driver;
  private nodePopulaters: NodePopulater<any>[];

  constructor() {
    this.uri = 'neo4j://localhost:7687';
    const mitre = new Mitre()
    this.nodePopulaters = [
      new TechniquesPopulator(mitre.techniques),
      new AttackPatternPopulator(mitre.attackPatterns),
      new CourseOfActionPopulator(mitre.coursesOfAction),
      new ToolsPopulator(mitre.tools),
      new DataSourcePopulator(mitre.dataSources),
      new DataComponentPopulator(mitre.dataComponents),
      new IdentitiesPopulator(mitre.identities),
      new IntrusionSetPopulator(mitre.intrusionSets),
      new MalwaresPopulator(mitre.malwares),

      new PlatformPopulator(mitre.platforms),
      new PlatformRelationPopulator(mitre.platformRelations.map(pr => ({ source: pr.itemId, destination: pr.platform }))),

      new ContributorsPopulator(mitre.contributors),
      new ContributorsRelationPopulator(mitre.contributorRelations.map(cr => ({ source: cr.contributor, destination: cr.itemId }))),

      new RelationshipsPopulator(mitre.relationships),
    ]
  }

  async connect(): Promise<void> {
    this.driver = neo4j.driver(this.uri)
    try {
      await this.driver.verifyConnectivity();
      console.log('Connected to neo4j!')
    } catch (err) {
      console.error(`Failed to connect to neo4j. ${err}`)
    }
  }

  async populate(): Promise<void> {
    for (const populator of this.nodePopulaters) {
      await populator.populate(this.driver)
    }
  }

  async disconnect(): Promise<void> {
    return this.driver.close()
  }

  // TODO: External reference is not working out properly
  // private addExternalReference(tx: neo4j.Transaction, reference: ExternalReference): neo4j.Result {
  //   console.log(`Creating external reference ${reference.url}`)
  //   return tx.run(
  //     "CREATE (r:ExternalReference {id: $id, name: $name, description: $description, url: $url})",
  //     {
  //       id: reference.external_id || reference.source_name,
  //       name: reference.source_name,
  //       description: reference.description || '',
  //       url: reference.url || '',
  //     }
  //   )
  // }

  // private async addExternalReferenceRelation(tx: neo4j.Transaction, itemId: string, refName: string): Promise<any> {
  //   console.log(`Create relation ${itemId}->${refName}`)
  //   const r = await tx.run(
  //     `MATCH (a),(b:ExternalReference) where a.id = '${itemId}' and b.name = "${refName}" CREATE (a)-[r:EXTERNAL_REF]->(b) return r`
  //   )
  //   if (r.summary.counters.updates().relationshipsCreated !== 1) {
  //     console.error('Relationship not created!')
  //   }
  //   return r
  // }
}