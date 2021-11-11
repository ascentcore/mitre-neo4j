import { Record } from "neo4j-driver";

export default class RecordPrinter {
  constructor(private records: Record[] = []) {}

  public print(): void {
    console.log('Results: ')
    this.records.forEach(record => {
      this.printRecord(record);
    });
  }

  // TODO: Implement path printing
  private printRecord(record: Record): void {
    const nodes = {};
    const relationships = [];
    record.forEach((value) => {
      if (value.start && value.end) {
        relationships.push(value);
      } else {
        nodes[value.identity] = value.properties.name;
      }
    })

    if (relationships.length === 0) {
      this.printNoRelationships(nodes);
    }

    if (relationships.length === 1) {
      this.printSingleRelationship(nodes, relationships);
    }

    if (relationships.length > 1) {
      this.printMultipleRelationships(nodes, relationships);
    }
  }

  private printNoRelationships(nodes: { [key: string]: string }): void {
    console.log(Object.values(nodes).join('; '));
  }

  private printSingleRelationship(nodes: { [key: string]: string }, relationships: any[]): void {
    const rel = relationships[0];
    console.log(`${nodes[rel.start]} - ${rel.type} -> ${nodes[rel.end]}`);
  }

  private printMultipleRelationships(nodes: { [key: string]: string }, relationships: any[]): void {
    const rel = relationships[0];
    let resultStart = rel.start;
    let resultEnd = rel.end;
    let result = `${nodes[rel.start]} - ${rel.type} -> ${nodes[rel.end]}`;
    for (let i = 1; i < relationships.length; i++) {
      const r = relationships[i];
      if (r.start - resultEnd === 0) {
        resultEnd = r.end;
        result += ` - ${r.type} -> ${nodes[r.end]}`;
      } else if (r.end - resultStart === 0) {
        resultStart = r.start;
        result = `${nodes[r.start]} - ${r.type} -> ${result}`;
      }
    }
    console.log(result);
  }
}