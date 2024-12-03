import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { ChangePassDTO } from './dto/ChangePass.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUser = {
  id: '1',
  name: 'John Doe',
  username: 'JohnDoe',
  createdAt: new Date(),
  active: false,
  products: [],
  recoverPassword: false,
  codeRecover: '',
  address: [
    {
      id: 'idStreet',
      street: 'calleDePrueba',
      number: 123,
      description: 'description',
    },
  ],
  email: 'johndoe@test.com',
  password: 'test',
  roleId: 'roleId',
  logins: [],
  dataChanges: [],
  codeVerification: '',
  isTwoFactorAuthEnabled: false,
  twoFactorSecret: '',
  shoppingCart: null,
  orders: [],
  notifications: [],
  feedbacks: [],
  phoneNumber: '123',
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn(),
            changePassword: jest.fn(),
            createClient: jest.fn(),
            updateUser: jest.fn(),
            activateUser: jest.fn(),
            recoverPassword: jest.fn(),
            findOne: jest.fn(),
            getUserRoles: jest.fn(),
            modifyUserRoles: jest.fn(),
            getDataChanges: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  describe('getUsersText', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: '1', name: 'John Doe' }] as any;
      service.getUsers.mockResolvedValue(mockUsers);

      const result = await controller.getUsersText();

      expect(result).toEqual(mockUsers);
      expect(service.getUsers).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should call changePassword on the service', async () => {
      const code = 'test-code';
      const dto: ChangePassDTO = { password: 'newPassword123' };
      service.changePassword.mockResolvedValue({ message: '' });

      const result = await controller.changePassword(code, dto);

      expect(result).toBe(true);
      expect(service.changePassword).toHaveBeenCalledWith(code, dto.password);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      service.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      service.findOne.mockRejectedValue(new Error());

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const mockUserData = { name: 'Updated Name' } as Prisma.UsersUpdateInput;

      service.updateUser.mockResolvedValue({
        ...mockUserData,
        ...mockUser,
      });

      const request = {
        user: { sub: userId },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'jest' },
      } as any;

      const result = await controller.update(request, mockUserData);

      expect(result).toEqual(mockUser);
      expect(service.updateUser).toHaveBeenCalledWith(
        userId,
        mockUserData,
        '127.0.0.1',
        'jest',
      );
    });
  });
});
