import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

const testClient: Client = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
};

const mockClientRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((client) => Promise.resolve({ id: Date.now(), ...client })),
  find: jest.fn().mockResolvedValue([testClient]),
  findOneBy: jest.fn().mockImplementation(({ id }) => {
    if (id === 1) {
      return Promise.resolve(testClient);
    }
    return Promise.resolve(null);
  }),
  preload: jest.fn().mockImplementation((client) => {
    if (client.id === 1) {
      return Promise.resolve(client);
    }
    return Promise.resolve(null);
  }),
  delete: jest.fn().mockImplementation((id) => Promise.resolve({ affected: id === 1 ? 1 : 0 })),
};

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: Repository<Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a client', async () => {
      const createClientDto: CreateClientDto = { name: 'New User', email: 'new@example.com' };
      const result = await service.create(createClientDto);
      expect(result).toEqual(expect.objectContaining(createClientDto));
      expect(repository.create).toHaveBeenCalledWith(createClientDto);
      expect(repository.save).toHaveBeenCalledWith(createClientDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const result = await service.findAll();
      expect(result).toEqual([testClient]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single client if found', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(testClient);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if client is not found', async () => {
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a client', async () => {
      const updateClientDto: UpdateClientDto = { name: 'Updated User' };
      const result = await service.update(1, updateClientDto);
      expect(result).toEqual(expect.objectContaining({ id: 1, ...updateClientDto }));
      expect(repository.preload).toHaveBeenCalledWith({ id: 1, ...updateClientDto });
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if client to update is not found', async () => {
      const updateClientDto: UpdateClientDto = { name: 'Updated User' };
      await expect(service.update(99, updateClientDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a client', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if client to remove is not found', async () => {
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
