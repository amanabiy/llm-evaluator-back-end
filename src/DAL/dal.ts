import { BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Repository, DeepPartial, FindManyOptions, FindOneOptions, In } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import FindAllResponseDto from 'src/dto/find-all-response.dto';

export class GenericDAL<Entity, DTO, UpdateDTO> {
  entityName: string;
  private readonly entityClass: new () => Entity;

  constructor(
    private readonly repository: Repository<Entity>,
    private readonly defaultSkip: number = 0,
    private readonly defaultTake: number = 1,
    private readonly defaultRelations: string[] = [],
    entityClass: new () => Entity,
  ) {
    this.entityName = repository.metadata.name;
    this.entityClass = entityClass; 
  }

  private applyPagination(
    options: any,
    page?: number,
    pageSize?: number,
  ): void {
    if ((page && page <= 0) || (pageSize && pageSize <= 0)) {
      throw new BadRequestException(
        'Invalid page or limit. both should be above zero.',
      );
    }
    if (page && pageSize) {
      options.skip = (page - 1) * pageSize;
      options.take = pageSize;
    } else {
      options.skip = this.defaultSkip;
      options.take = this.defaultTake;
    }
  }

  private addDefaultRelations(options: any) {
    if (!options.relations) {
      options.relations = this.defaultRelations;
    }
  }

  private transformIfRequired(items: any, transform: boolean): any {
    return transform ? plainToInstance(this.entityClass, items) : items; // Use the class reference
  }

  async create(dto: DeepPartial<Entity>, transform: boolean = true): Promise<Entity> {
    try {
      const entity = this.repository.create(dto as DeepPartial<Entity>);
      const savedEntity = await this.repository.save(entity);
      return this.transformIfRequired(savedEntity, transform);
    } catch (error) {
      throw new HttpException(
        `Error creating ${this.entityName}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    transform: boolean = true,
  ): Promise<FindAllResponseDto<Entity>> {
    try {
      const options: any = {};
      this.applyPagination(options, page, pageSize);
      this.addDefaultRelations(options);

      const [items, total] = await this.repository.findAndCount(options);
      const transformedItems = this.transformIfRequired(items, transform);
      return new FindAllResponseDto<Entity>(page, pageSize, total, transformedItems);
    } catch (error) {
      throw new HttpException(
        `Error fetching ${this.entityName}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(
    id: string,
    options: FindOneOptions = { where: {} },
    transform: boolean = true,
  ): Promise<Entity | undefined> {
    try {
      if (!options.where) {
        options.where = {};
      }
      options.where['id'] = id;
      if (id === "") {
        delete options.where['id'];
      }
      this.addDefaultRelations(options);

      const result = await this.repository.findOne(options);
      if (!result) {
        throw new NotFoundException(`No ${this.entityName} found with id ${id}`);
      }

      return this.transformIfRequired(result, transform);
    } catch (error) {
      throw new HttpException(
        `Error fetching ${this.entityName} with id ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIds(ids: string[], transform: boolean = true): Promise<Entity[]> {
    try {
      if (!ids || ids.length === 0) {
        return [];
      }
      const options: FindManyOptions<Entity> = { where: { id: In(ids) } } as any;
      this.addDefaultRelations(options);

      const entities = await this.repository.find(options);

      if (entities.length !== ids.length) {
        const missingIds = ids.filter(id => !entities.some(entity => entity['id'] === id));
        throw new NotFoundException(
          `Some ${this.entityName} were not found: ${missingIds.join(', ')}`
        );
      }

      return this.transformIfRequired(entities, transform);
    } catch (error) {
      throw new HttpException(
        `Error fetching ${this.entityName} with ids ${ids.join(', ')}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, dto: DeepPartial<Entity>, transform: boolean = true): Promise<Entity | undefined> {
    try {
      const entityToUpdate = await this.findOne(id, {}, false);
      const updatedEntity = { ...entityToUpdate, ...dto } as Entity;
      await this.repository.save(updatedEntity);

      return this.findOne(id, {}, transform);
    } catch (error) {
      throw new HttpException(
        `Error updating ${this.entityName} with id ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.repository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `No ${this.entityName} found with id ${id}`,
        );
      }
    } catch (error) {
      throw new HttpException(
        `Error deleting ${this.entityName} with id ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async find(conditions: FindManyOptions<Entity>, transform: boolean = true): Promise<Entity[]> {
    try {
      this.addDefaultRelations(conditions);
      const result = await this.repository.find(conditions);
      return this.transformIfRequired(result, transform);
    } catch (error) {
      throw new HttpException(
        `Error fetching ${this.entityName}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findWithPagination(
    conditions?: FindManyOptions<Entity>,
    page: number = 1,
    pageSize: number = 10,
    transform: boolean = true,
  ): Promise<FindAllResponseDto<Entity>> {
    try {
      const options: FindManyOptions = conditions || {};
      this.applyPagination(options, page, pageSize);
      this.addDefaultRelations(options);
      console.log(options)
      const [items, total] = await this.repository.findAndCount(options);
      console.log(items)
      const transformedItems = this.transformIfRequired(items, transform);
      return new FindAllResponseDto<Entity>(page, pageSize, total, transformedItems);
    } catch (error) {
      throw new HttpException(
        `Error fetching ${this.entityName}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
}
