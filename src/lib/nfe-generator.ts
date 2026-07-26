import { UF_IBGE } from '@/lib/uf-ibge'
import { FISCAL_CONFIG } from '@/lib/fiscal-config'

export interface NfeBuildInput {
  userCpf: string
  userName: string
  property: {
    inscricao_estadual: string
    municipio: string
    uf: string
    codigo_ibge?: string
    endereco?: string
  }
  recipient: {
    cnpj: string
    razaoSocial: string
    ie: string
    logradouro: string
    numero: string
    bairro: string
    municipio: string
    uf: string
    cMun: string
  }
  quantidade: number
  valorUnitario: number
  valorTotal: number
  nNF: string
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function tags(obj: Record<string, string | number>, indent = '      '): string {
  return Object.entries(obj)
    .map(([k, v]) => `${indent}<${k}>${esc(String(v))}</${k}>`)
    .join('\n')
}

function fmt2(v: number): string {
  return v.toFixed(2)
}
function fmt4(v: number): string {
  return v.toFixed(4)
}

function formatDhEmi(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function generateCNF(): string {
  return String(Math.floor(Math.random() * 90000000) + 10000000)
}

function digits(s: string): string {
  return s.replace(/\D/g, '')
}

export function generateNfe(input: NfeBuildInput): { data: Record<string, unknown>; xml: string } {
  const cpf = digits(input.userCpf)
  const cnpj = digits(input.recipient.cnpj)
  const ie = input.property.inscricao_estadual.replace(/[.\-/]/g, '')
  const ieDest = input.recipient.ie.replace(/[.\-/]/g, '')
  const cUF = UF_IBGE[input.property.uf?.toUpperCase()] || '52'
  const cNF = generateCNF()
  const dhEmi = formatDhEmi()
  const cMun = input.property.codigo_ibge || ''
  const vProd = fmt2(input.valorTotal)
  const qCom = fmt4(input.quantidade)
  const vUnCom = fmt4(input.valorUnitario)

  const data: Record<string, unknown> = {
    versao: '4.00',
    ide: {
      cUF,
      cNF,
      natOp: FISCAL_CONFIG.natOp,
      mod: FISCAL_CONFIG.mod,
      serie: FISCAL_CONFIG.serie,
      nNF: input.nNF,
      dhEmi,
      tpNF: 1,
      idDest: 1,
      cMunFG: cMun,
      tpImp: 1,
      tpEmis: 1,
      tpAmb: FISCAL_CONFIG.tpAmb,
      finNFe: 1,
      indFinal: 0,
      indPres: 9,
      indIntermed: 0,
      procEmi: 0,
      verProc: FISCAL_CONFIG.verProc,
    },
    emit: {
      CPF: cpf,
      xNome: input.userName,
      IE: ie,
      enderEmit: {
        xLgr: input.property.endereco || 'Não informado',
        nro: 'S/N',
        xBairro: 'Zona Rural',
        cMun,
        xMun: input.property.municipio,
        UF: input.property.uf,
        CEP: '00000000',
      },
    },
    dest: {
      CNPJ: cnpj,
      xNome: input.recipient.razaoSocial,
      IE: ieDest,
      enderDest: {
        xLgr: input.recipient.logradouro,
        nro: input.recipient.numero,
        xBairro: input.recipient.bairro,
        cMun: input.recipient.cMun,
        xMun: input.recipient.municipio,
        UF: input.recipient.uf,
      },
    },
    det: [
      {
        nItem: 1,
        prod: {
          cProd: FISCAL_CONFIG.cProd,
          cEAN: 'SEM GTIN',
          xProd: FISCAL_CONFIG.xProd,
          NCM: FISCAL_CONFIG.ncm,
          CFOP: FISCAL_CONFIG.cfopLeite,
          uCom: 'L',
          qCom: input.quantidade,
          vUnCom: input.valorUnitario,
          vProd: input.valorTotal,
          cEANTrib: 'SEM GTIN',
          uTrib: 'L',
          qTrib: input.quantidade,
          vUnTrib: input.valorUnitario,
          indTot: 1,
        },
      },
    ],
    total: { ICMSTot: { vProd: input.valorTotal } },
    transp: { modFrete: 9 },
    pag: { detPag: [{ tPag: 90, vPag: '0.00' }] },
    infAdic: { infCpl: FISCAL_CONFIG.infCpl },
  }

  const ideXml = tags({
    cUF,
    cNF,
    natOp: FISCAL_CONFIG.natOp,
    mod: FISCAL_CONFIG.mod,
    serie: FISCAL_CONFIG.serie,
    nNF: input.nNF,
    dhEmi,
    tpNF: 1,
    idDest: 1,
    cMunFG: cMun,
    tpImp: 1,
    tpEmis: 1,
    tpAmb: FISCAL_CONFIG.tpAmb,
    finNFe: 1,
    indFinal: 0,
    indPres: 9,
    indIntermed: 0,
    procEmi: 0,
    verProc: FISCAL_CONFIG.verProc,
  })
  const enderEmitXml = tags({
    xLgr: input.property.endereco || 'Não informado',
    nro: 'S/N',
    xBairro: 'Zona Rural',
    cMun,
    xMun: input.property.municipio,
    UF: input.property.uf,
    CEP: '00000000',
  })
  const enderDestXml = tags({
    xLgr: input.recipient.logradouro,
    nro: input.recipient.numero,
    xBairro: input.recipient.bairro,
    cMun: input.recipient.cMun,
    xMun: input.recipient.municipio,
    UF: input.recipient.uf,
  })
  const prodXml = tags({
    cProd: FISCAL_CONFIG.cProd,
    cEAN: 'SEM GTIN',
    xProd: FISCAL_CONFIG.xProd,
    NCM: FISCAL_CONFIG.ncm,
    CFOP: FISCAL_CONFIG.cfopLeite,
    uCom: 'L',
    qCom,
    vUnCom,
    vProd,
    cEANTrib: 'SEM GTIN',
    uTrib: 'L',
    qTrib: qCom,
    vUnTrib: vUnCom,
    indTot: 1,
  })
  const icmsTotXml = tags({
    vBC: '0.00',
    vICMS: '0.00',
    vICMSDeson: '0.00',
    vFCP: '0.00',
    vProd,
    vFrete: '0.00',
    vSeg: '0.00',
    vDesc: '0.00',
    vII: '0.00',
    vIPI: '0.00',
    vIPIDevol: '0.00',
    vPIS: '0.00',
    vCOFINS: '0.00',
    vOutro: '0.00',
    vNF: vProd,
  })
  const emitFields = tags({ CPF: cpf, xNome: input.userName, IE: ie })
  const destFields = tags({ CNPJ: cnpj, xNome: input.recipient.razaoSocial, IE: ieDest })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe versao="4.00">
    <ide>
${ideXml}
    </ide>
    <emit>
${emitFields}
      <enderEmit>
${enderEmitXml}
      </enderEmit>
    </emit>
    <dest>
${destFields}
      <enderDest>
${enderDestXml}
      </enderDest>
    </dest>
    <det nItem="1">
      <prod>
${prodXml}
      </prod>
      <imposto>
        <vTotTrib>0.00</vTotTrib>
        <ICMS><ICMS00><orig>0</orig><CST>00</CST><modBC>0</modBC><vBC>0.00</vBC><pICMS>0.00</pICMS><vICMS>0.00</vICMS></ICMS00></ICMS>
        <PIS><PISAliq><CST>01</CST><vBC>0.00</vBC><pPIS>0.00</pPIS><vPIS>0.00</vPIS></PISAliq></PIS>
        <COFINS><COFINSAliq><CST>01</CST><vBC>0.00</vBC><pCOFINS>0.00</pCOFINS><vCOFINS>0.00</vCOFINS></COFINSAliq></COFINS>
        <IBS/>
        <CBS/>
      </imposto>
    </det>
    <total>
      <ICMSTot>
${icmsTotXml}
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>90</tPag>
        <vPag>0.00</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infCpl>${esc(FISCAL_CONFIG.infCpl)}</infCpl>
    </infAdic>
  </infNFe>
</NFe>`

  return { data, xml }
}
