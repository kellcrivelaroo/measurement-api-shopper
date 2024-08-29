export const AppErrors = {
  INVALID_DATA: {
    code: 'INVALID_DATA',
    message: 'Dados inválidos',
    status: 400,
  },
  MEASURE_NOT_FOUND: {
    code: 'MEASURE_NOT_FOUND',
    message: 'Leitura não encontrada',
    status: 404,
  },
  DOUBLE_REPORT: {
    code: 'DOUBLE_REPORT',
    message: 'Leitura do mês já realizada',
    status: 409,
  },
  CONFIRMATION_DUPLICATE: {
    code: 'CONFIRMATION_DUPLICATE',
    message: 'Leitura do mês já confirmada',
    status: 409,
  },
  INVALID_TYPE: {
    code: 'INVALID_TYPE',
    message: 'Tipo de medição não permitida',
    status: 400,
  },
  MEASURES_NOT_FOUND: {
    code: 'MEASURES_NOT_FOUND',
    message: 'Nenhuma leitura encontrada',
    status: 404,
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Ocorreu um erro inesperado.',
    status: 500,
  },
} as const

export type AppErrorType = typeof AppErrors
