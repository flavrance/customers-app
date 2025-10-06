import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

const testClient: Client = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
};

const mockClientsService = {
  create: jest.fn((dto) => ({ id: Date.now(), ...dto })),
  findAll: jest.fn(() => [testClient]),
  findOne: jest.fn((id) => (id === 1 ? testClient : null)),
  update: jest.fn((id, dto) => ({ id, ...dto })),
  remove: jest.fn((id) => ({ affected: id === 1 ? 1 : 0 })),
};

describe('ClientsController', () => {
  let controller: ClientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a client', () => {
    const dto: CreateClientDto = { name: 'New User', email: 'new@example.com' };
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
    expect(mockClientsService.create).toHaveBeenCalledWith(dto);
  });

  it('should find all clients', () => {
    expect(controller.findAll()).toEqual([testClient]);
    expect(mockClientsService.findAll).toHaveBeenCalled();
  });

  it('should find one client', () => {
    expect(controller.findOne('1')).toEqual(testClient);
    expect(mockClientsService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a client', () => {
    const dto: UpdateClientDto = { name: 'Updated User' };
    expect(controller.update('1', dto)).toEqual({
      id: 1,
      ...dto,
    });
    expect(mockClientsService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a client', () => {
    expect(controller.remove('1')).toEqual({ affected: 1 });
    expect(mockClientsService.remove).toHaveBeenCalledWith(1);
  });
});
