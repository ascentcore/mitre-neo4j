import * as neo4j from 'neo4j-driver';
import EntryPopulator from './populators/abstract/entryPopulator';

// TODO: Attack Pattern has Data Sources
export default class Neo4jPopulater {
  private uri: string;
  private driver: neo4j.Driver;

  constructor(private nodePopulaters: EntryPopulator<any>[]) {
    this.uri = 'neo4j://localhost:7687';
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
}