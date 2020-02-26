// import { ViewSet, ViewSetQuery } from 'nest-rest-framework';
// import { Model, Document } from 'mongoose';

export class MongoViewset<PrimaryKeyT, DataT extends Document> extends ViewSet<
  PrimaryKeyT,
  DataT
> {
  constructor(
    private readonly model: Model<DataT>,
    private readonly primaryKeyProperty: string, // 'id'
  ) {
    super();
  }

  async query(query?: ViewSetQuery): Promise<DataT[]> {
    return await this.model.find();
  }

  async create(data: DataT): Promise<DataT> {
    data._id = data[this.primaryKeyProperty];
    const createdDoc = await this.model.create(data);
    return createdDoc.toObject() as DataT;
  }

  async retrieve(pk: PrimaryKeyT): Promise<DataT> {
    const query = {};
    query[this.primaryKeyProperty] = pk;
    return await this.model.findOne(query);
  }

  async replace(pk: PrimaryKeyT, data: DataT): Promise<DataT> {
    const query = {};
    query[this.primaryKeyProperty] = pk;
    await this.model.replaceOne(query, data);
    return this.retrieve(pk);
  }

  async modify(pk: PrimaryKeyT, data: DataT): Promise<DataT> {
    const query = {};
    query[this.primaryKeyProperty] = pk;
    await this.model.replaceOne(query, data);
    return this.retrieve(pk);
  }

  async destroy(pk: PrimaryKeyT): Promise<void> {
    const query = {};
    query[this.primaryKeyProperty] = pk;
    await this.model.deleteOne(query);
  }
}
