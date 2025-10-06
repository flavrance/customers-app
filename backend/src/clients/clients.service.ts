import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientRepository.preload({
      id: id,
      ...updateClientDto,
    });
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }
    return this.clientRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }
  }
}
