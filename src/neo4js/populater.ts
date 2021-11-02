import * as neo4j from 'neo4j-driver';
import Mitre from '../mitre/mitre';
import { MitreItem } from '../mitre/types';

// TODO: Created by ref (created_by_ref)
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
    // await this.populatePlatforms()
    // await this.populateTechniques()
    // await this.populateAttackPatterns()
    // await this.populateCoursesOfAction()

    // Popuate relations

    // await this.populatePlatformRelations()
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
  // TODO: External references
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

  // private asnyc addRelationship(tx: neo4j.Transaction, )
}