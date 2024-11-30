import { User } from '@prisma/client';
import { CONFIG_MESSAGES } from 'src/config/config';

// Interfaces
export interface UserDetailsResponse extends User {}
export interface UserListResponse extends Array<User> {}

export interface UpdateUserResponse {
  message: string;
  updatedFields: Partial<User>;
}

export interface DeleteUserResponse {
  message: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  verifyLoginUrl: string;
  loginToken: string;
}

export interface RegisterResponse {
  message: string;
  registerToken: string;
  verifyRegisterUrl: string;
}

export interface VerifyLoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface VerifyRegisterResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  message: string;
  accessToken: string;
}

// Erros
export const SwaggerErros = {
  Unauthorized: {
    status: 401,
    description: CONFIG_MESSAGES.unauthorized,
  } as const,

  TooManyRequests: {
    status: 429,
    description: CONFIG_MESSAGES.tooManyRequests,
  } as const,

  InvalidDetails: {
    status: 400,
    description: CONFIG_MESSAGES.invalidData,
  } as const,
};

// Auth Swagger Docs
export const AuthSwaggerDocs = {
  login: {
    operation: { summary: 'Enviar magic link para login' },
    response: {
      status: 201,
      description: CONFIG_MESSAGES.loginLinkSent,
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: CONFIG_MESSAGES.loginLinkSent },
          verifyLoginUrl: {
            type: 'string',
            example: 'http://seusite.com/verify-login?token=xyz',
          },
          loginToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    },
  },

  register: {
    operation: { summary: 'Criar novo usuário' },
    response: {
      status: 201,
      description: CONFIG_MESSAGES.verificationLinkSent,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: CONFIG_MESSAGES.verificationLinkSent,
          },
          registerToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          verifyRegisterUrl: {
            type: 'string',
            example: 'http://seusite.com/verify-register?token=xyz',
          },
        },
      },
    },
  },

  verifyLogin: {
    operation: { summary: 'Verificar magic link' },
    header: { name: 'loginToken', required: true },
    responses: {
      success: {
        status: 200,
        description: CONFIG_MESSAGES.userLogged,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: CONFIG_MESSAGES.userLogged,
            },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      },
    },
  },

  verifyRegister: {
    operation: { summary: 'Verificar registro de usuário' },
    header: { name: 'registerToken', required: true },
    responses: {
      success: {
        status: 200,
        description: CONFIG_MESSAGES.userVerified,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: CONFIG_MESSAGES.userVerified,
            },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      },
    },
  },

  googleAuth: {
    operation: { summary: 'Iniciar autenticação com Google' },
    response: {
      status: 302,
      description: 'Redirecionamento para Google',
      schema: {
        type: 'string',
        example: 'Redirecionando para autenticação Google',
      },
    },
  },

  googleCallback: {
    operation: { summary: 'Callback da autenticação Google' },
    response: {
      status: 302,
      description: 'Redirecionamento após autenticação',
      schema: {
        type: 'string',
        example: '{FRONTEND_URL}/google/callback?token=token',
      },
    },
  },

  refreshToken: {
    operation: { summary: 'Renovar token de acesso' },
    header: { name: 'refreshToken', required: true },
    responses: {
      success: {
        status: 200,
        description: CONFIG_MESSAGES.tokenUpdated,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: CONFIG_MESSAGES.tokenUpdated,
            },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      },
    },
  },
};

// User Swagger Docs
export const UserSwaggerDocs = {
  findOne: {
    operation: { summary: 'Obter detalhes do usuário atual' },
    response: {
      status: 200,
      description: 'Detalhes do usuário',
      schema: {
        type: 'object',
        properties: {
          role: { type: 'string', example: 'USER' },
          id: { type: 'number', example: 1 },
          email: { type: 'string', example: 'usuario@email.com' },
          firstName: { type: 'string', example: 'Nome' },
          lastName: { type: 'string', example: 'Sobrenome' },
          whatsappNumber: { type: 'string', example: '11999999999' },
          verified: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        },
      },
    },
  },

  update: {
    operation: { summary: 'Atualizar usuário atual' },
    response: {
      status: 200,
      description: CONFIG_MESSAGES.userUpdated,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: CONFIG_MESSAGES.userUpdated,
          },
          updatedFields: {
            type: 'object',
            example: {
              fisrtName: 'Novo',
              lastName: 'Nome',
              whatsappNumber: '11999999999',
            },
          },
        },
      },
    },
  },

  remove: {
    operation: { summary: 'Deletar usuário atual' },
    responses: {
      success: {
        status: 200,
        description: CONFIG_MESSAGES.userDeleted,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: CONFIG_MESSAGES.userDeleted,
            },
            user: {
              type: 'object',
              properties: {
                role: { type: 'string', example: 'USER' },
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'usuario@email.com' },
                fisrtName: { type: 'string', example: 'Nome' },
                lastName: { type: 'string', example: 'Sobrenome' },
                whatsappNumber: { type: 'string', example: '11999999999' },
                imageUrl: { type: 'string', example: 'imageUrl' },
                verified: { type: 'boolean', example: true },
                createdAt: {
                  type: 'string',
                  example: '2023-01-01T00:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  example: '2023-01-01T00:00:00.000',
                },
              },
            },
          },
        },
      },
    },
  },
  findAll: {
    operation: { summary: 'Listar todos usuários (Admin)' },
    responses: {
      success: {
        status: 200,
        description: 'Lista de usuários retornada com sucesso',
        schema: {
          type: 'array',
          example: [
            {
              role: 'USER',
              id: 1,
              email: 'joao@email.com',
              firstName: 'João',
              lastName: 'Silva',
              whatsappNumber: '11999999999',
              imageUrl: 'https://exemplo.com/joao.jpg',
              verified: true,
              createdAt: '2023-01-01T00:00:00.000Z',
              updatedAt: '2023-01-01T00:00:00.000Z',
            },
            {
              role: 'ADMIN',
              id: 2,
              email: 'maria@email.com',
              firstName: 'Maria',
              lastName: 'Santos',
              whatsappNumber: '11988888888',
              imageUrl: 'https://exemplo.com/maria.jpg',
              verified: true,
              createdAt: '2023-01-02T00:00:00.000Z',
              updatedAt: '2023-01-02T00:00:00.000Z',
            },
            {
              role: 'USER',
              id: 3,
              email: 'pedro@email.com',
              firstName: 'Pedro',
              lastName: 'Oliveira',
              whatsappNumber: '11977777777',
              imageUrl: 'https://exemplo.com/pedro.jpg',
              verified: false,
              createdAt: '2023-01-03T00:00:00.000Z',
              updatedAt: '2023-01-03T00:00:00.000Z',
            },
          ],
          items: {
            type: 'object',
            properties: {
              role: { type: 'string' },
              id: { type: 'number' },
              email: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              whatsappNumber: { type: 'string' },
              imageUrl: { type: 'string' },
              verified: { type: 'boolean' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
  },

  findById: {
    operation: { summary: 'Buscar usuário por ID (Admin)' },
    responses: {
      success: {
        status: 200,
        description: 'Usuário encontrado',
        schema: {
          type: 'object',
          properties: {
            role: { type: 'string', example: 'USER' },
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'usuario@email.com' },
            firstName: { type: 'string', example: 'Nome' },
            lastName: { type: 'string', example: 'Sobrenome' },
            whatsappNumber: {
              type: 'string',
              example: '11999999999',
              nullable: true,
            },
            imageUrl: { type: 'string', example: 'imageUrl' },
            verified: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-11-30T16:14:20.100Z' },
            updatedAt: { type: 'string', example: '2024-11-30T17:02:17.452Z' },
          },
        },
      },
    },
  },

  updateById: {
    operation: { summary: 'Atualizar usuário por ID (Admin)' },
    responses: {
      success: {
        status: 200,
        description: CONFIG_MESSAGES.userUpdated,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: CONFIG_MESSAGES.userUpdated,
            },
            updatedFields: {
              type: 'object',
              example: {
                firstName: 'novo',
                lastName: 'nome',
                whatsappNumber: '11999999999',
              },
            },
          },
        },
      },
    },
  },

  removeById: {
    operation: { summary: 'Deletar usuário por ID (Admin)' },
    responses: {
      success: {
        status: 200,
        description: CONFIG_MESSAGES.userDeleted,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: CONFIG_MESSAGES.userDeleted,
            },
            user: {
              type: 'object',
              properties: {
                role: { type: 'string', example: 'USER' },
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'usuario@email.com' },
                fisrtName: { type: 'string', example: 'Nome' },
                lastName: { type: 'string', example: 'Sobrenome' },
                whatsappNumber: { type: 'string', example: '11999999999' },
                imageUrl: { type: 'string', example: 'imageUrl' },
                verified: { type: 'boolean', example: true },
                createdAt: {
                  type: 'string',
                  example: '2023-01-01T00:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  example: '2023-01-01T00:00:00.000',
                },
              },
            },
          },
        },
      },
    },
  },
};
