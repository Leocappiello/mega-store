import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MailServices } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';

jest.mock('../prisma/prisma.service');
jest.mock('../utils/utils.service');
jest.mock('@nestjs/jwt');
jest.mock('../mail/mail.services');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: jest.Mocked<PrismaService>;
  let utils: jest.Mocked<UtilsService>;
  let jwt: jest.Mocked<JwtService>;
  let mail: jest.Mocked<MailServices>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findFirstOrThrow: jest.fn(),
            },
            role: {
              findFirstOrThrow: jest.fn(),
            },
            dataChangeLog: {
              createMany: jest.fn(),
              findMany: jest.fn(),
            },
            rolePermission: {
              findMany: jest.fn(),
            },
            permission: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: UtilsService,
          useValue: { generateRandomCodeVerification: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), decode: jest.fn() },
        },
        { provide: MailServices, useValue: { sendMail: jest.fn() } },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
    utils = module.get(UtilsService);
    jwt = module.get(JwtService);
    mail = module.get(MailServices);
  });

  describe('getUsers', () => {
    it('should return a paginated list of users', async () => {
      const mockUsers = [
        {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          active: true,
        },
      ];

      const result = await service.getUsers(1, 10);

      expect(result).toEqual(mockUsers);
      expect(prisma.users.findMany).toHaveBeenCalledWith({
        skip: 10,
        take: 10,
        select: {
          id: true,
          username: true,
          email: true,
          active: true,
          role: {
            include: {
              permissions: {
                select: { name: true },
              },
            },
          },
        },
      });
    });
  });

  describe('createClient', () => {
    it('should create a new user and return a success message', async () => {
      const dto: CreateUserDTO = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'securepassword',
      };
      // prisma.users.findFirst.mockResolvedValue(null);
      // prisma.role.findFirstOrThrow.mockResolvedValue({
      //   id: 'role1',
      //   name: 'USER',
      // } as any);
      // prisma.users.create.mockResolvedValue({
      //   id: '1',
      //   username: dto.username,
      //   email: dto.email,
      // } as any);
      utils.generateRandomCodeVerification.mockReturnValue('12345');

      const result = await service.createClient(dto);

      expect(result).toEqual({ success: 'User successfully created' });
      expect(prisma.users.create).toHaveBeenCalled();
      expect(mail.sendMail).not.toHaveBeenCalled(); // Si el envío de correo está comentado.
    });

    it('should throw ConflictException if user already exists', async () => {
      // prisma.users.findFirst.mockResolvedValue({
      //   id: '1',
      //   username: 'john_doe',
      // } as any);

      await expect(
        service.createClient({
          username: 'john_doe',
          email: 'john@example.com',
          password: '123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
      };
      // prisma.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.findOne('john_doe');

      expect(result).toEqual(mockUser);
      expect(prisma.users.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: 'john_doe' },
            { username: 'john_doe' },
            { id: 'john_doe' },
          ],
        },
        include: {
          role: { select: { name: true } },
        },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      // prisma.users.findFirst.mockResolvedValue(null);

      await expect(service.findOne('unknown_user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user and create data change logs', async () => {
      // prisma.users.findUnique.mockResolvedValue({
      //   id: '1',
      //   username: 'old_user',
      //   email: 'old@example.com',
      // });
      // prisma.users.update.mockResolvedValue({
      //   id: '1',
      //   username: 'new_user',
      //   email: 'new@example.com',
      // });

      const result = await service.updateUser(
        '1',
        { username: 'new_user' },
        '127.0.0.1',
        'Mozilla',
      );

      expect(result.username).toEqual('new_user');
      expect(prisma.dataChangeLog.createMany).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user does not exist', async () => {
      // prisma.users.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUser('1', {}, '127.0.0.1', 'Mozilla'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
