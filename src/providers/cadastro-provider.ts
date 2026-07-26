import { consultarPropriedades, type ConsultaPropriedadesResponse } from '@/services/cadastro'

export interface CadastroProvider {
  consultarPropriedades(cpf: string): Promise<ConsultaPropriedadesResponse>
}

export class SintegraProdutorRuralProvider implements CadastroProvider {
  async consultarPropriedades(cpf: string): Promise<ConsultaPropriedadesResponse> {
    return consultarPropriedades(cpf)
  }
}

const provider: CadastroProvider = new SintegraProdutorRuralProvider()

export function getCadastroProvider(): CadastroProvider {
  return provider
}
