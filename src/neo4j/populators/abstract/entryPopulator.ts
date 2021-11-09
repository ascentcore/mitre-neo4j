import * as neo4j from 'neo4j-driver';

export interface Relation {
  source: string;
  destination: string;
}

export default abstract class EntryPopulator<T> {
  constructor(private data: T[]) {}

  public async populate(driver: neo4j.Driver): Promise<void> {
    const session = driver.session()
    for (const platform of this.data) {
      await session.writeTransaction(tx => this.addOne(tx, platform))
    }
    return session.close()
  }

  protected abstract addOne(tx: neo4j.Transaction, obj: T): Promise<neo4j.QueryResult>;
}