import * as neo4j from 'neo4j-driver';
import Query from './query/query';

export default class Neo4jQuerier {
  private uri: string;
  private driver: neo4j.Driver;

  constructor() {
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

  async runQuery(query: Query): Promise<any> {
    const session = this.driver.session();
    console.log(`Running query ${query.query}`);
    const result = await session.readTransaction(tx => query.run(tx));
    console.log(result.records);
    await session.close();
  }

  async disconnect(): Promise<void> {
    return this.driver.close()
  }
}