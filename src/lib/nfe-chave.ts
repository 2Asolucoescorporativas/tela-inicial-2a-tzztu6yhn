import { UF_IBGE } from '@/lib/uf-ibge'

export function generateChaveNFe(params: {
  uf: string
  cpfCnpj: string
  nNF: string
  serie: number
  mod: number
}): string {
  const cUF = UF_IBGE[params.uf.toUpperCase()] || '52'
  const d = new Date()
  const aamm = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0')
  const doc = params.cpfCnpj.replace(/\D/g, '').padStart(14, '0')
  const mod = String(params.mod).padStart(2, '0')
  const serie = String(params.serie).padStart(3, '0')
  const nNF = params.nNF.replace(/\D/g, '').padStart(9, '0')
  const tpEmis = '1'
  const cNF = String(Math.floor(Math.random() * 90000000) + 10000000)

  const base = cUF + aamm + doc + mod + serie + nNF + tpEmis + cNF

  let sum = 0
  let weight = 2
  for (let i = base.length - 1; i >= 0; i--) {
    sum += parseInt(base[i], 10) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  const dv = 11 - (sum % 11)
  const dvStr = dv >= 10 ? '0' : String(dv)

  return base + dvStr
}
