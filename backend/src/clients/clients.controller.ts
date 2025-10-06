import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Client } from './entities/client.entity';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'The client has been successfully created.', type: Client })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body(new ValidationPipe()) createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'Return all clients.', type: [Client] })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by id' })
  @ApiResponse({ status: 200, description: 'Return the client.', type: Client })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'The client has been successfully updated.', type: Client })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 200, description: 'The client has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
