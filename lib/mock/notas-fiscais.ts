import type { NotaFiscalEletronica } from "../types/nota-fiscal"
import type { ConhecimentoTransporteEletronico } from "../types/cte"

// Mock de notas fiscais para demonstração
export const notasFiscaisMock: NotaFiscalEletronica[] = [
  {
    id: "1",
    chaveAcesso: "31251111908486000187550000000275231175843650",
    xmlOriginal: "",
    dataEntrada: "2025-11-26T16:30:00",
    usuarioEntrada: "admin",
    status: "ativa",
    ide: {
      cUF: "31",
      cNF: "17584365",
      natOp: "Saidas",
      mod: "55",
      serie: "0",
      nNF: "27523",
      dhEmi: "2025-11-26T16:24:11-03:00",
      dhSaiEnt: "2025-11-26T16:24:11-03:00",
      tpNF: "1",
      idDest: "2",
      cMunFG: "3128709",
      tpImp: "1",
      tpEmis: "1",
      cDV: "0",
      tpAmb: "1",
      finNFe: "1",
      indFinal: "0",
      indPres: "0",
      procEmi: "0",
      verProc: "12.1.2410.292",
    },
    emit: {
      CNPJ: "11908486000187",
      xNome: "FGL INDUSTRIA DE CONDUTORES ELETRICOS LTDA",
      xFant: "FGL INDUSTRIA DE CONDUTORES ELETRICOS LTDA",
      enderEmit: {
        xLgr: "RUA - JOAQUIM PEDRO RIBEIRO",
        nro: "200",
        xBairro: "DISTRITO - INDUSTRIAL LUIZ CELANI PRIMO",
        cMun: "3128709",
        xMun: "GUAXUPE",
        UF: "MG",
        CEP: "37834650",
        cPais: "1058",
        xPais: "Brasil",
        fone: "3535514409",
      },
      IE: "0015927040004",
      IM: "26607",
      CNAE: "2733300",
      CRT: "3",
    },
    dest: {
      CNPJ: "06970652000135",
      xNome: "TRP IND COM DE TRANSFORMADORES ELET LTDA",
      enderDest: {
        xLgr: "RODOVIA - ROD ARISTIDES PIO DOS SANTOS",
        nro: "SN",
        xCpl: "KM 01 BRCAO 1",
        xBairro: "BAIRRO - DISTRITO INDUSTRIAL",
        cMun: "3536901",
        xMun: "PEDRANOPOLIS",
        UF: "SP",
        CEP: "15630000",
        cPais: "1058",
        xPais: "BRASIL",
        fone: "1732224444",
      },
      indIEDest: "1",
      IE: "517014500114",
      email: "financeiro@trptransformadores.com.br",
    },
    det: [
      {
        nItem: "1",
        prod: {
          cProd: "005.3.041",
          cEAN: "SEM GTIN",
          xProd: "FIO DE COBRE RET 3 CAPAS TERMOESTABILIZADO 4,00 X 7,50 MM",
          NCM: "74081900",
          CFOP: "6101",
          uCom: "KG",
          qCom: "112.5000",
          vUnCom: "83.0000000000",
          vProd: "9337.50",
          cEANTrib: "SEM GTIN",
          uTrib: "KG",
          qTrib: "112.5000",
          vUnTrib: "83.0000000000",
          indTot: "1",
        },
        imposto: {
          ICMS: {
            orig: "0",
            CST: "00",
            modBC: "3",
            vBC: "9337.50",
            pICMS: "12.00",
            vICMS: "1120.50",
          },
          PIS: {
            CST: "01",
            vBC: "9337.50",
            pPIS: "1.65",
            vPIS: "154.07",
          },
          COFINS: {
            CST: "01",
            vBC: "9337.50",
            pCOFINS: "7.60",
            vCOFINS: "709.65",
          },
        },
      },
    ],
    total: {
      ICMSTot: {
        vBC: "35100.00",
        vICMS: "4212.00",
        vICMSDeson: "0.00",
        vBCST: "0.00",
        vST: "0.00",
        vProd: "35100.00",
        vFrete: "0.00",
        vSeg: "0.00",
        vDesc: "0.00",
        vII: "0.00",
        vIPI: "0.00",
        vPIS: "579.15",
        vCOFINS: "2667.60",
        vOutro: "0.00",
        vNF: "35100.00",
        vTotTrib: "9316.98",
      },
    },
    transp: {
      modFrete: "0",
      vol: [
        {
          qVol: "3",
          esp: "BOBINA",
          pesoL: "423.00",
          pesoB: "423.00",
        },
      ],
    },
    pag: [
      {
        indPag: "1",
        tPag: "99",
        vPag: "0.00",
      },
    ],
    contabilizado: false,
    estoqueLancado: false,
    contasLancadas: false,
  },
]

export const ctesMock: ConhecimentoTransporteEletronico[] = [
  {
    id: "1",
    chaveAcesso: "35251121187045000197570040000976861000452085",
    xmlOriginal: "",
    dataEntrada: "2025-11-28T19:00:00",
    usuarioEntrada: "admin",
    status: "ativo",
    ide: {
      cUF: "35",
      cCT: "00045208",
      CFOP: "5353",
      natOp: "Transp a est comercial",
      mod: "57",
      serie: "4",
      nCT: "97686",
      dhEmi: "2025-11-28T18:32:20-03:00",
      tpImp: "1",
      tpEmis: "1",
      cDV: "5",
      tpAmb: "1",
      tpCTe: "0",
      procEmi: "0",
      verProc: "1.0",
      cMunEnv: "3550308",
      xMunEnv: "SAO PAULO",
      UFEnv: "SP",
      modal: "01",
      tpServ: "0",
      cMunIni: "3550308",
      xMunIni: "SAO PAULO",
      UFIni: "SP",
      cMunFim: "3536901",
      xMunFim: "PEDRANOPOLIS",
      UFFim: "SP",
      retira: "1",
      indIEToma: "1",
    },
    emit: {
      CNPJ: "21187045000197",
      IE: "145931690116",
      xNome: "SPP TRANSPORTES DE CARGAS EIRELI",
      enderEmit: {
        xLgr: "AV GUILHERME 483",
        nro: "0",
        xBairro: "VL GUILHERME",
        cMun: "3550308",
        xMun: "SAO PAULO",
        CEP: "02053000",
        UF: "SP",
        fone: "1129051881",
      },
    },
    rem: {
      CNPJ: "11908486000187",
      IE: "0015927040004",
      xNome: "FGL INDUSTRIA DE CONDUTORES ELETRICOS LTDA",
      fone: "3535514409",
      enderReme: {
        xLgr: "RUA - JOAQUIM PEDRO RIBEIRO",
        nro: "200",
        xBairro: "DIST INDUSTRIAL LUIZ C PRIMO",
        cMun: "3128709",
        xMun: "GUAXUPE",
        CEP: "37834650",
        UF: "MG",
        cPais: "1058",
        xPais: "BRASIL",
      },
    },
    dest: {
      CNPJ: "06970652000135",
      IE: "517014500114",
      xNome: "TRP INDUSTRIA E COMERCIO DE TRANSFORMADORES ELETRICOS LTDA",
      fone: "1732224444",
      enderDest: {
        xLgr: "RODOVIA - ARISTIDES PIO DOS SANTOS KM 01",
        nro: "SN",
        xBairro: "BAIRRO - ZONA RURAL",
        cMun: "3536901",
        xMun: "PEDRANOPOLIS",
        CEP: "15630000",
        UF: "SP",
        cPais: "1058",
        xPais: "BRASIL",
      },
      email: "financeiro@trptransformadores.com.br",
    },
    vPrest: {
      vTPrest: "1180.00",
      vRec: "1180.00",
      Comp: [{ xNome: "Frete Valor", vComp: "1180.00" }],
    },
    imp: {
      ICMS: {
        CST: "90",
        indSN: "1",
      },
    },
    toma3: {
      toma: "3",
    },
    compl: {
      xObs: "CST: 90 - Apolice seguro: 54018945/5507215 - Seguradora: 33164021000100 TOKIO MARINE SEGURADORA Empresa optante pelo simples nacional. Nao gera direito credito de icms",
    },
    contabilizado: false,
    contasLancadas: false,
  },
]

export type DocumentoFiscalUnificado = {
  id: string
  tipo: "nfe" | "cte"
  numero: string
  serie: string
  chaveAcesso: string
  dataEmissao: string
  dataEntrada: string
  emitenteNome: string
  emitenteCnpj: string
  destinatarioNome: string
  destinatarioCnpj: string
  valorTotal: number
  status: string
  cfop: string
  contabilizado: boolean
  estoqueLancado?: boolean
  contasLancadas: boolean
}

export function unificarDocumentos(): DocumentoFiscalUnificado[] {
  const nfes: DocumentoFiscalUnificado[] = notasFiscaisMock.map((nfe) => ({
    id: nfe.id,
    tipo: "nfe" as const,
    numero: nfe.ide.nNF,
    serie: nfe.ide.serie,
    chaveAcesso: nfe.chaveAcesso,
    dataEmissao: nfe.ide.dhEmi,
    dataEntrada: nfe.dataEntrada,
    emitenteNome: nfe.emit.xNome,
    emitenteCnpj: nfe.emit.CNPJ || nfe.emit.CPF || "",
    destinatarioNome: nfe.dest.xNome,
    destinatarioCnpj: nfe.dest.CNPJ || nfe.dest.CPF || "",
    valorTotal: Number.parseFloat(nfe.total.ICMSTot.vNF) || 0,
    status: nfe.status,
    cfop: nfe.det[0]?.prod.CFOP || "",
    contabilizado: nfe.contabilizado,
    estoqueLancado: nfe.estoqueLancado,
    contasLancadas: nfe.contasLancadas,
  }))

  const ctes: DocumentoFiscalUnificado[] = ctesMock.map((cte) => ({
    id: cte.id,
    tipo: "cte" as const,
    numero: cte.ide.nCT,
    serie: cte.ide.serie,
    chaveAcesso: cte.chaveAcesso,
    dataEmissao: cte.ide.dhEmi,
    dataEntrada: cte.dataEntrada,
    emitenteNome: cte.emit.xNome,
    emitenteCnpj: cte.emit.CNPJ || cte.emit.CPF || "",
    destinatarioNome: cte.dest?.xNome || "",
    destinatarioCnpj: cte.dest?.CNPJ || cte.dest?.CPF || "",
    valorTotal: Number.parseFloat(cte.vPrest.vTPrest) || 0,
    status: cte.status,
    cfop: cte.ide.CFOP,
    contabilizado: cte.contabilizado,
    contasLancadas: cte.contasLancadas,
  }))

  return [...nfes, ...ctes]
}
