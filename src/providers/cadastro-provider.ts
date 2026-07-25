import { consultarCpf, type ConsultaCadastroResponse } from '@/services/cadastro'

export interface CadastroProvider {
  consultarCPF(cpf: string): Promise<ConsultaCadastroResponse>
}

export class MockCadastroProvider implements CadastroProvider {
  async consultarCPF(cpf: string): Promise<ConsultaCadastroResponse> {
    return consultarCpf(cpf)
  }
}

const provider: CadastroProvider = new MockCadastroProvider()

export function getCadastroProvider(): CadastroProvider {
  return provider
}
