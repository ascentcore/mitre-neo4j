import { Transaction, Result } from "neo4j-driver-core";
import EntryPopulator from "../abstract/entryPopulator";

export default class PlatformPopulator extends EntryPopulator<string> {
  protected addOne(tx: Transaction, obj: string): Result {
    return tx.run("CREATE (p:Platform {name: $platform})", { platform: obj })
  }
}