import * as neo4j from 'neo4j-driver';
import Mitre from '../mitre/mitre';
import { MitreItem } from '../mitre/types';

// TODO: Created by ref (created_by_ref)
// TODO: External references
export default class Neo4jPopulater {
  private uri: string;
  private mitre: Mitre;
  private driver: neo4j.Driver;

  constructor() {
    this.uri = 'neo4j://localhost:7687';
    this.mitre = new Mitre()
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
    console.log(this.mitre.types)

    // Populate nodes
    await this.populatePlatforms()
    await this.populateTechniques()
    await this.populateAttackPatterns()
    await this.populateCoursesOfAction()
    await this.populateTools()
    await this.populateDataSources()
    await this.populateDataComponents()
    await this.populateIdentities()
    await this.populateIntrusionSets()
    await this.populateMalwares()

    // Popuate relations
    await this.populatePlatformRelations()
    await this.populateRelationships()
  }

  async disconnect(): Promise<void> {
    return this.driver.close()
  }

  private async populatePlatforms(): Promise<void> {
    const session = this.driver.session()
    for (const platform of this.mitre.platforms) {
      await session.writeTransaction(tx => this.addPlatform(tx, platform))
    }
    return session.close()
  }

  private async populateTechniques(): Promise<void> {
    const session = this.driver.session();
    for (const technique of this.mitre.techniques) {
      await session.writeTransaction(tx => this.addTechnique(tx, technique))
    }
    return session.close()
  }

  private async populateAttackPatterns(): Promise<void> {
    const session = this.driver.session()
    for (const attackPattern of this.mitre.attackPatterns) {
      await session.writeTransaction(tx => this.addAttackPattern(tx, attackPattern))
    }
    return session.close()
  }

  private async populateCoursesOfAction(): Promise<void> {
    const session = this.driver.session()
    for (const courseOfAction of this.mitre.coursesOfAction) {
      await session.writeTransaction(tx => this.addCourseOfAction(tx, courseOfAction))
    }
    return session.close()
  }

  private async populateTools(): Promise<void> {
    const session = this.driver.session()
    for (const tool of this.mitre.tools) {
      await session.writeTransaction(tx => this.addTool(tx, tool))
    }
    return session.close()
  }

  private async populateDataSources(): Promise<void> {
    const session = this.driver.session()
    for (const dataSource of this.mitre.dataSources) {
      await session.writeTransaction(tx => this.addDataSource(tx, dataSource))
    }
    return session.close()
  }

  private async populateDataComponents(): Promise<void> {
    const session = this.driver.session()
    for (const dataComponent of this.mitre.dataComponents) {
      await session.writeTransaction(tx => this.addDataComponent(tx, dataComponent))
    }
    return session.close()
  }

  private async populateIdentities(): Promise<void> {
    const session = this.driver.session()
    for (const identity of this.mitre.identities) {
      await session.writeTransaction(tx => this.addIdentity(tx, identity))
    }
    return session.close()
  }

  private async populateIntrusionSets(): Promise<void> {
    const session = this.driver.session()
    for (const intrusionSet of this.mitre.intrusionSets) {
      await session.writeTransaction(tx => this.addIntrusionSet(tx, intrusionSet))
    }
    return session.close()
  }

  private async populateMalwares(): Promise<void> {
    const session = this.driver.session()
    for (const malware of this.mitre.malwares) {
      await session.writeTransaction(tx => this.addMalware(tx, malware))
    }
    return session.close()
  }

  private async populateRelationships(): Promise<void> {
    const session = this.driver.session()
    for (const relationship of this.mitre.relationships) {
      await session.writeTransaction(tx => this.addRelationship(tx, relationship))
    }
    return session.close()
  }
  
  private async populatePlatformRelations(): Promise<void> {
    const session = this.driver.session()
    for (const r of this.mitre.platformRelations) {
      await session.writeTransaction(tx => this.addPlatformRelation(tx, r.itemId, r.platform))
    }
    return session.close();
  }

  private addPlatform(tx: neo4j.Transaction, platform: string): neo4j.Result {
    console.log(`Creating platform ${platform}`)
    return tx.run("CREATE (p:Platform {name: $platform})", { platform })
  }

  private addTechnique(tx: neo4j.Transaction, technique: MitreItem): neo4j.Result {
    console.log(`Creating technique ${technique.name}`)
    return tx.run(
      "CREATE (t:Technique {id: $id, name: $name, description: $description, shortName: $x_mitre_shortname})",
      technique,
    )
  }

  // TODO: This has permissions, add that
  // TODO: Data Sources
  // TODO: Contributors
  private addAttackPattern(tx: neo4j.Transaction, attackPattern: MitreItem): neo4j.Result {
    console.log(`Creating attack pattern ${attackPattern.name}`)
    return tx.run(
      "CREATE (a:AttackPattern {id: $id, name: $name, description: $description, detection: $detection})",
      { 
        id: attackPattern.id,
        name: attackPattern.name,
        description: attackPattern.description || '',
        detection: attackPattern.x_mitre_detection || '',
      },
    )
  }

  private addCourseOfAction(tx: neo4j.Transaction, courseOfAction: MitreItem): neo4j.Result {
    console.log(`Creating course of action ${courseOfAction.name}`)
    return tx.run(
      "CREATE (c:CourseOfAction {id: $id, name: $name, description: $description})",
      { 
        id: courseOfAction.id,
        name: courseOfAction.name,
        description: courseOfAction.description || '',
      },
    )
  }

  private addTool(tx: neo4j.Transaction, tool: MitreItem): neo4j.Result {
    console.log(`Creating tool ${tool.name}`)
    return tx.run(
      "CREATE (t:Tool {id: $id, name: $name, description: $description})",
      { 
        id: tool.id,
        name: tool.name,
        description: tool.description || '',
      },
    )
  }

  private addDataSource(tx: neo4j.Transaction, dataSource: MitreItem): neo4j.Result {
    console.log(`Creating data source ${dataSource.name}`)
    return tx.run(
      "CREATE (d:DataSource {id: $id, name: $name, description: $description})",
      { 
        id: dataSource.id,
        name: dataSource.name,
        description: dataSource.description || '',
      },
    )
  }

  private addDataComponent(tx: neo4j.Transaction, dataComponent: MitreItem): neo4j.Result {
    console.log(`Creating data component ${dataComponent.name}`)
    return tx.run(
      "CREATE (d:DataComponent {id: $id, name: $name, description: $description})",
      { 
        id: dataComponent.id,
        name: dataComponent.name,
        description: dataComponent.description || '',
      },
    )
  }

  private addIdentity(tx: neo4j.Transaction, identity: MitreItem): neo4j.Result {
    console.log(`Creating identity ${identity.name}`)
    return tx.run(
      "CREATE (i:Identity {id: $id, name: $name})",
      { 
        id: identity.id,
        name: identity.name,
      },
    )
  }

  private addIntrusionSet(tx: neo4j.Transaction, intrusionSet: MitreItem): neo4j.Result {
    console.log(`Creating intrusion set ${intrusionSet.name}`)
    return tx.run(
      "CREATE (i:IntrusionSet {id: $id, name: $name, description: $description})",
      { 
        id: intrusionSet.id,
        name: intrusionSet.name,
        description: intrusionSet.description || '',
      },
    )
  }

  private addMalware(tx: neo4j.Transaction, malware: MitreItem): neo4j.Result {
    console.log(`Creating malware set ${malware.name}`)
    return tx.run(
      "CREATE (m:Malware {id: $id, name: $name, description: $description})",
      { 
        id: malware.id,
        name: malware.name,
        description: malware.description || '',
      },
    )
  }

  private async addPlatformRelation(tx: neo4j.Transaction, id: string, platform: string): Promise<any> {
    console.log(`Creating relation ${id}->${platform}`)
    const r = await tx.run(
      `MATCH (a),(p:Platform) where a.id = '${id}' and p.name = '${platform}' CREATE (a)-[r:ON_PLATFORM]->(p) return r`
    )
    if (r.summary.counters.updates().relationshipsCreated !== 1) {
      console.error('Relationship not created!')
    }
    return r
  }

  private async addRelationship(tx: neo4j.Transaction, relationship: MitreItem): Promise<any> {
    console.log(`Creating relation ${relationship.source_ref}->${relationship.target_ref}`)
    const type = relationship.relationship_type.toUpperCase().replace('-', '_');
    const r = await tx.run(
      `MATCH (a),(b) where a.id = '${relationship.source_ref}' and b.id = '${relationship.target_ref}' CREATE (a)-[r:${type}]->(b) return r`
    )
    if (r.summary.counters.updates().relationshipsCreated !== 1) {
      console.error('Relationship not created!')
    }
  }
}