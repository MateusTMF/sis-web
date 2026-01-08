// Parser completo para XML de NFe e CTe

import type {
  NotaFiscalEletronica,
  NFeDetalheProduto,
  NFeImpostosProduto,
  NFeICMS,
  NFeIPI,
  NFePIS,
  NFeCOFINS,
  NFePagamento,
  NFeDuplicata,
} from "../types/nota-fiscal"
import type { ConhecimentoTransporteEletronico, CTeComponenteValor, CTeInfNFe } from "../types/cte"

// Função auxiliar para extrair texto de um nó XML
function getTextContent(parent: Element | Document, tagName: string): string {
  const element = parent.getElementsByTagName(tagName)[0]
  return element?.textContent || ""
}

// Função auxiliar para extrair atributo de um nó XML
function getAttribute(parent: Element | Document, tagName: string, attrName: string): string {
  const element = parent.getElementsByTagName(tagName)[0]
  return element?.getAttribute(attrName) || ""
}

// Parser para NFe
export function parseNFeXML(xmlString: string): Partial<NotaFiscalEletronica> {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, "text/xml")

  // Verificar se é uma NFe válida
  const nfeProc = xmlDoc.getElementsByTagName("nfeProc")[0] || xmlDoc.getElementsByTagName("NFe")[0]
  if (!nfeProc) {
    throw new Error("XML não é uma NFe válida")
  }

  const infNFe = xmlDoc.getElementsByTagName("infNFe")[0]
  if (!infNFe) {
    throw new Error("Elemento infNFe não encontrado")
  }

  const chaveAcesso = infNFe.getAttribute("Id")?.replace("NFe", "") || ""

  // Parse IDE
  const ide = xmlDoc.getElementsByTagName("ide")[0]

  // Parse Emitente
  const emit = xmlDoc.getElementsByTagName("emit")[0]
  const enderEmit = emit?.getElementsByTagName("enderEmit")[0]

  // Parse Destinatário
  const dest = xmlDoc.getElementsByTagName("dest")[0]
  const enderDest = dest?.getElementsByTagName("enderDest")[0]

  // Parse Produtos (det)
  const detElements = xmlDoc.getElementsByTagName("det")
  const produtos: NFeDetalheProduto[] = []

  for (let i = 0; i < detElements.length; i++) {
    const det = detElements[i]
    const prod = det.getElementsByTagName("prod")[0]
    const imposto = det.getElementsByTagName("imposto")[0]

    // Parse ICMS
    const icmsElement = imposto?.getElementsByTagName("ICMS")[0]
    const icmsInner = icmsElement?.children[0] // ICMS00, ICMS10, etc.

    const icms: NFeICMS = {
      orig: getTextContent(icmsInner as Element, "orig"),
      CST: getTextContent(icmsInner as Element, "CST"),
      CSOSN: getTextContent(icmsInner as Element, "CSOSN"),
      modBC: getTextContent(icmsInner as Element, "modBC"),
      pRedBC: getTextContent(icmsInner as Element, "pRedBC"),
      vBC: getTextContent(icmsInner as Element, "vBC"),
      pICMS: getTextContent(icmsInner as Element, "pICMS"),
      vICMS: getTextContent(icmsInner as Element, "vICMS"),
      vBCFCP: getTextContent(icmsInner as Element, "vBCFCP"),
      pFCP: getTextContent(icmsInner as Element, "pFCP"),
      vFCP: getTextContent(icmsInner as Element, "vFCP"),
      modBCST: getTextContent(icmsInner as Element, "modBCST"),
      pMVAST: getTextContent(icmsInner as Element, "pMVAST"),
      pRedBCST: getTextContent(icmsInner as Element, "pRedBCST"),
      vBCST: getTextContent(icmsInner as Element, "vBCST"),
      pICMSST: getTextContent(icmsInner as Element, "pICMSST"),
      vICMSST: getTextContent(icmsInner as Element, "vICMSST"),
      vICMSDeson: getTextContent(icmsInner as Element, "vICMSDeson"),
      motDesICMS: getTextContent(icmsInner as Element, "motDesICMS"),
      pCredSN: getTextContent(icmsInner as Element, "pCredSN"),
      vCredICMSSN: getTextContent(icmsInner as Element, "vCredICMSSN"),
    }

    // Parse IPI
    const ipiElement = imposto?.getElementsByTagName("IPI")[0]
    const ipiTrib = ipiElement?.getElementsByTagName("IPITrib")[0] || ipiElement?.getElementsByTagName("IPINT")[0]
    const ipi: NFeIPI | undefined = ipiElement
      ? {
          cEnq: getTextContent(ipiElement, "cEnq"),
          CST: getTextContent(ipiTrib as Element, "CST"),
          vBC: getTextContent(ipiTrib as Element, "vBC"),
          pIPI: getTextContent(ipiTrib as Element, "pIPI"),
          vIPI: getTextContent(ipiTrib as Element, "vIPI"),
        }
      : undefined

    // Parse PIS
    const pisElement = imposto?.getElementsByTagName("PIS")[0]
    const pisInner = pisElement?.children[0]
    const pis: NFePIS = {
      CST: getTextContent(pisInner as Element, "CST"),
      vBC: getTextContent(pisInner as Element, "vBC"),
      pPIS: getTextContent(pisInner as Element, "pPIS"),
      vPIS: getTextContent(pisInner as Element, "vPIS"),
    }

    // Parse COFINS
    const cofinsElement = imposto?.getElementsByTagName("COFINS")[0]
    const cofinsInner = cofinsElement?.children[0]
    const cofins: NFeCOFINS = {
      CST: getTextContent(cofinsInner as Element, "CST"),
      vBC: getTextContent(cofinsInner as Element, "vBC"),
      pCOFINS: getTextContent(cofinsInner as Element, "pCOFINS"),
      vCOFINS: getTextContent(cofinsInner as Element, "vCOFINS"),
    }

    const impostos: NFeImpostosProduto = {
      ICMS: icms,
      IPI: ipi,
      PIS: pis,
      COFINS: cofins,
    }

    produtos.push({
      nItem: det.getAttribute("nItem") || "",
      prod: {
        cProd: getTextContent(prod, "cProd"),
        cEAN: getTextContent(prod, "cEAN"),
        xProd: getTextContent(prod, "xProd"),
        NCM: getTextContent(prod, "NCM"),
        CEST: getTextContent(prod, "CEST"),
        CFOP: getTextContent(prod, "CFOP"),
        uCom: getTextContent(prod, "uCom"),
        qCom: getTextContent(prod, "qCom"),
        vUnCom: getTextContent(prod, "vUnCom"),
        vProd: getTextContent(prod, "vProd"),
        cEANTrib: getTextContent(prod, "cEANTrib"),
        uTrib: getTextContent(prod, "uTrib"),
        qTrib: getTextContent(prod, "qTrib"),
        vUnTrib: getTextContent(prod, "vUnTrib"),
        vFrete: getTextContent(prod, "vFrete"),
        vSeg: getTextContent(prod, "vSeg"),
        vDesc: getTextContent(prod, "vDesc"),
        vOutro: getTextContent(prod, "vOutro"),
        indTot: getTextContent(prod, "indTot"),
        xPed: getTextContent(prod, "xPed"),
        nItemPed: getTextContent(prod, "nItemPed"),
      },
      imposto: impostos,
      infAdProd: getTextContent(det, "infAdProd"),
    })
  }

  // Parse Totais
  const total = xmlDoc.getElementsByTagName("total")[0]
  const ICMSTot = total?.getElementsByTagName("ICMSTot")[0]

  // Parse Transporte
  const transp = xmlDoc.getElementsByTagName("transp")[0]
  const transporta = transp?.getElementsByTagName("transporta")[0]
  const volElements = transp?.getElementsByTagName("vol")
  const volumes = []
  if (volElements) {
    for (let i = 0; i < volElements.length; i++) {
      const vol = volElements[i]
      volumes.push({
        qVol: getTextContent(vol, "qVol"),
        esp: getTextContent(vol, "esp"),
        marca: getTextContent(vol, "marca"),
        nVol: getTextContent(vol, "nVol"),
        pesoL: getTextContent(vol, "pesoL"),
        pesoB: getTextContent(vol, "pesoB"),
      })
    }
  }

  // Parse Cobrança
  const cobr = xmlDoc.getElementsByTagName("cobr")[0]
  const fat = cobr?.getElementsByTagName("fat")[0]
  const dupElements = cobr?.getElementsByTagName("dup")
  const duplicatas: NFeDuplicata[] = []
  if (dupElements) {
    for (let i = 0; i < dupElements.length; i++) {
      const dup = dupElements[i]
      duplicatas.push({
        nDup: getTextContent(dup, "nDup"),
        dVenc: getTextContent(dup, "dVenc"),
        vDup: getTextContent(dup, "vDup"),
      })
    }
  }

  // Parse Pagamento
  const pag = xmlDoc.getElementsByTagName("pag")[0]
  const detPagElements = pag?.getElementsByTagName("detPag")
  const pagamentos: NFePagamento[] = []
  if (detPagElements) {
    for (let i = 0; i < detPagElements.length; i++) {
      const detPag = detPagElements[i]
      pagamentos.push({
        indPag: getTextContent(detPag, "indPag"),
        tPag: getTextContent(detPag, "tPag"),
        vPag: getTextContent(detPag, "vPag"),
      })
    }
  }

  // Parse Informações Adicionais
  const infAdic = xmlDoc.getElementsByTagName("infAdic")[0]

  // Parse Protocolo
  const protNFe = xmlDoc.getElementsByTagName("protNFe")[0]
  const infProt = protNFe?.getElementsByTagName("infProt")[0]

  // Parse autXML
  const autXMLElements = xmlDoc.getElementsByTagName("autXML")
  const autXML = []
  for (let i = 0; i < autXMLElements.length; i++) {
    const aut = autXMLElements[i]
    autXML.push({
      CNPJ: getTextContent(aut, "CNPJ"),
      CPF: getTextContent(aut, "CPF"),
    })
  }

  return {
    chaveAcesso,
    xmlOriginal: xmlString,
    ide: {
      cUF: getTextContent(ide, "cUF"),
      cNF: getTextContent(ide, "cNF"),
      natOp: getTextContent(ide, "natOp"),
      mod: getTextContent(ide, "mod"),
      serie: getTextContent(ide, "serie"),
      nNF: getTextContent(ide, "nNF"),
      dhEmi: getTextContent(ide, "dhEmi"),
      dhSaiEnt: getTextContent(ide, "dhSaiEnt"),
      tpNF: getTextContent(ide, "tpNF"),
      idDest: getTextContent(ide, "idDest"),
      cMunFG: getTextContent(ide, "cMunFG"),
      tpImp: getTextContent(ide, "tpImp"),
      tpEmis: getTextContent(ide, "tpEmis"),
      cDV: getTextContent(ide, "cDV"),
      tpAmb: getTextContent(ide, "tpAmb"),
      finNFe: getTextContent(ide, "finNFe"),
      indFinal: getTextContent(ide, "indFinal"),
      indPres: getTextContent(ide, "indPres"),
      procEmi: getTextContent(ide, "procEmi"),
      verProc: getTextContent(ide, "verProc"),
    },
    emit: {
      CNPJ: getTextContent(emit, "CNPJ"),
      CPF: getTextContent(emit, "CPF"),
      xNome: getTextContent(emit, "xNome"),
      xFant: getTextContent(emit, "xFant"),
      enderEmit: {
        xLgr: getTextContent(enderEmit as Element, "xLgr"),
        nro: getTextContent(enderEmit as Element, "nro"),
        xCpl: getTextContent(enderEmit as Element, "xCpl"),
        xBairro: getTextContent(enderEmit as Element, "xBairro"),
        cMun: getTextContent(enderEmit as Element, "cMun"),
        xMun: getTextContent(enderEmit as Element, "xMun"),
        UF: getTextContent(enderEmit as Element, "UF"),
        CEP: getTextContent(enderEmit as Element, "CEP"),
        cPais: getTextContent(enderEmit as Element, "cPais"),
        xPais: getTextContent(enderEmit as Element, "xPais"),
        fone: getTextContent(enderEmit as Element, "fone"),
      },
      IE: getTextContent(emit, "IE"),
      IEST: getTextContent(emit, "IEST"),
      IM: getTextContent(emit, "IM"),
      CNAE: getTextContent(emit, "CNAE"),
      CRT: getTextContent(emit, "CRT"),
    },
    dest: {
      CNPJ: getTextContent(dest, "CNPJ"),
      CPF: getTextContent(dest, "CPF"),
      xNome: getTextContent(dest, "xNome"),
      enderDest: {
        xLgr: getTextContent(enderDest as Element, "xLgr"),
        nro: getTextContent(enderDest as Element, "nro"),
        xCpl: getTextContent(enderDest as Element, "xCpl"),
        xBairro: getTextContent(enderDest as Element, "xBairro"),
        cMun: getTextContent(enderDest as Element, "cMun"),
        xMun: getTextContent(enderDest as Element, "xMun"),
        UF: getTextContent(enderDest as Element, "UF"),
        CEP: getTextContent(enderDest as Element, "CEP"),
        cPais: getTextContent(enderDest as Element, "cPais"),
        xPais: getTextContent(enderDest as Element, "xPais"),
        fone: getTextContent(enderDest as Element, "fone"),
      },
      indIEDest: getTextContent(dest, "indIEDest"),
      IE: getTextContent(dest, "IE"),
      ISUF: getTextContent(dest, "ISUF"),
      IM: getTextContent(dest, "IM"),
      email: getTextContent(dest, "email"),
    },
    autXML,
    det: produtos,
    total: {
      ICMSTot: {
        vBC: getTextContent(ICMSTot as Element, "vBC"),
        vICMS: getTextContent(ICMSTot as Element, "vICMS"),
        vICMSDeson: getTextContent(ICMSTot as Element, "vICMSDeson"),
        vFCPUFDest: getTextContent(ICMSTot as Element, "vFCPUFDest"),
        vICMSUFDest: getTextContent(ICMSTot as Element, "vICMSUFDest"),
        vICMSUFRemet: getTextContent(ICMSTot as Element, "vICMSUFRemet"),
        vFCP: getTextContent(ICMSTot as Element, "vFCP"),
        vBCST: getTextContent(ICMSTot as Element, "vBCST"),
        vST: getTextContent(ICMSTot as Element, "vST"),
        vFCPST: getTextContent(ICMSTot as Element, "vFCPST"),
        vFCPSTRet: getTextContent(ICMSTot as Element, "vFCPSTRet"),
        vProd: getTextContent(ICMSTot as Element, "vProd"),
        vFrete: getTextContent(ICMSTot as Element, "vFrete"),
        vSeg: getTextContent(ICMSTot as Element, "vSeg"),
        vDesc: getTextContent(ICMSTot as Element, "vDesc"),
        vII: getTextContent(ICMSTot as Element, "vII"),
        vIPI: getTextContent(ICMSTot as Element, "vIPI"),
        vIPIDevol: getTextContent(ICMSTot as Element, "vIPIDevol"),
        vPIS: getTextContent(ICMSTot as Element, "vPIS"),
        vCOFINS: getTextContent(ICMSTot as Element, "vCOFINS"),
        vOutro: getTextContent(ICMSTot as Element, "vOutro"),
        vNF: getTextContent(ICMSTot as Element, "vNF"),
        vTotTrib: getTextContent(ICMSTot as Element, "vTotTrib"),
      },
    },
    transp: {
      modFrete: getTextContent(transp, "modFrete"),
      transporta: transporta
        ? {
            CNPJ: getTextContent(transporta, "CNPJ"),
            CPF: getTextContent(transporta, "CPF"),
            xNome: getTextContent(transporta, "xNome"),
            IE: getTextContent(transporta, "IE"),
            xEnder: getTextContent(transporta, "xEnder"),
            xMun: getTextContent(transporta, "xMun"),
            UF: getTextContent(transporta, "UF"),
          }
        : undefined,
      vol: volumes,
    },
    cobr: cobr
      ? {
          fat: fat
            ? {
                nFat: getTextContent(fat, "nFat"),
                vOrig: getTextContent(fat, "vOrig"),
                vDesc: getTextContent(fat, "vDesc"),
                vLiq: getTextContent(fat, "vLiq"),
              }
            : undefined,
          dup: duplicatas.length > 0 ? duplicatas : undefined,
        }
      : undefined,
    pag: pagamentos,
    infAdic: infAdic
      ? {
          infAdFisco: getTextContent(infAdic, "infAdFisco"),
          infCpl: getTextContent(infAdic, "infCpl"),
        }
      : undefined,
    protNFe: infProt
      ? {
          tpAmb: getTextContent(infProt, "tpAmb"),
          verAplic: getTextContent(infProt, "verAplic"),
          chNFe: getTextContent(infProt, "chNFe"),
          dhRecbto: getTextContent(infProt, "dhRecbto"),
          nProt: getTextContent(infProt, "nProt"),
          digVal: getTextContent(infProt, "digVal"),
          cStat: getTextContent(infProt, "cStat"),
          xMotivo: getTextContent(infProt, "xMotivo"),
        }
      : undefined,
  }
}

// Parser para CTe
export function parseCTeXML(xmlString: string): Partial<ConhecimentoTransporteEletronico> {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, "text/xml")

  // Verificar se é um CTe válido
  const cteProc = xmlDoc.getElementsByTagName("cteProc")[0] || xmlDoc.getElementsByTagName("CTe")[0]
  if (!cteProc) {
    throw new Error("XML não é um CTe válido")
  }

  const infCte = xmlDoc.getElementsByTagName("infCte")[0]
  if (!infCte) {
    throw new Error("Elemento infCte não encontrado")
  }

  const chaveAcesso = infCte.getAttribute("Id")?.replace("CTe", "") || ""

  // Parse IDE
  const ide = xmlDoc.getElementsByTagName("ide")[0]

  // Parse Complemento
  const compl = xmlDoc.getElementsByTagName("compl")[0]
  const obsContElements = compl?.getElementsByTagName("ObsCont")
  const obsCont = []
  if (obsContElements) {
    for (let i = 0; i < obsContElements.length; i++) {
      const obs = obsContElements[i]
      obsCont.push({
        xCampo: obs.getAttribute("xCampo") || "",
        xTexto: getTextContent(obs, "xTexto"),
      })
    }
  }

  // Parse Emitente
  const emit = xmlDoc.getElementsByTagName("emit")[0]
  const enderEmit = emit?.getElementsByTagName("enderEmit")[0]

  // Parse Remetente
  const rem = xmlDoc.getElementsByTagName("rem")[0]
  const enderReme = rem?.getElementsByTagName("enderReme")[0]

  // Parse Destinatário
  const dest = xmlDoc.getElementsByTagName("dest")[0]
  const enderDest = dest?.getElementsByTagName("enderDest")[0]

  // Parse Valores da Prestação
  const vPrest = xmlDoc.getElementsByTagName("vPrest")[0]
  const compElements = vPrest?.getElementsByTagName("Comp")
  const componentes: CTeComponenteValor[] = []
  if (compElements) {
    for (let i = 0; i < compElements.length; i++) {
      const comp = compElements[i]
      componentes.push({
        xNome: getTextContent(comp, "xNome"),
        vComp: getTextContent(comp, "vComp"),
      })
    }
  }

  // Parse Impostos
  const imp = xmlDoc.getElementsByTagName("imp")[0]
  const icmsElement = imp?.getElementsByTagName("ICMS")[0]
  const icmsInner = icmsElement?.children[0]

  // Parse infCTeNorm
  const infCTeNorm = xmlDoc.getElementsByTagName("infCTeNorm")[0]
  const infCarga = infCTeNorm?.getElementsByTagName("infCarga")[0]
  const infDoc = infCTeNorm?.getElementsByTagName("infDoc")[0]

  // Parse NFe referenciadas
  const infNFeElements = infDoc?.getElementsByTagName("infNFe")
  const infNFe: CTeInfNFe[] = []
  if (infNFeElements) {
    for (let i = 0; i < infNFeElements.length; i++) {
      const nfe = infNFeElements[i]
      infNFe.push({
        chave: getTextContent(nfe, "chave"),
        PIN: getTextContent(nfe, "PIN"),
        dPrev: getTextContent(nfe, "dPrev"),
      })
    }
  }

  // Parse Protocolo
  const protCTe = xmlDoc.getElementsByTagName("protCTe")[0]
  const infProt = protCTe?.getElementsByTagName("infProt")[0]

  // Parse toma3/toma4
  const toma3 = ide?.getElementsByTagName("toma3")[0]
  const toma4 = ide?.getElementsByTagName("toma4")[0]

  return {
    chaveAcesso,
    xmlOriginal: xmlString,
    ide: {
      cUF: getTextContent(ide, "cUF"),
      cCT: getTextContent(ide, "cCT"),
      CFOP: getTextContent(ide, "CFOP"),
      natOp: getTextContent(ide, "natOp"),
      mod: getTextContent(ide, "mod"),
      serie: getTextContent(ide, "serie"),
      nCT: getTextContent(ide, "nCT"),
      dhEmi: getTextContent(ide, "dhEmi"),
      tpImp: getTextContent(ide, "tpImp"),
      tpEmis: getTextContent(ide, "tpEmis"),
      cDV: getTextContent(ide, "cDV"),
      tpAmb: getTextContent(ide, "tpAmb"),
      tpCTe: getTextContent(ide, "tpCTe"),
      procEmi: getTextContent(ide, "procEmi"),
      verProc: getTextContent(ide, "verProc"),
      cMunEnv: getTextContent(ide, "cMunEnv"),
      xMunEnv: getTextContent(ide, "xMunEnv"),
      UFEnv: getTextContent(ide, "UFEnv"),
      modal: getTextContent(ide, "modal"),
      tpServ: getTextContent(ide, "tpServ"),
      cMunIni: getTextContent(ide, "cMunIni"),
      xMunIni: getTextContent(ide, "xMunIni"),
      UFIni: getTextContent(ide, "UFIni"),
      cMunFim: getTextContent(ide, "cMunFim"),
      xMunFim: getTextContent(ide, "xMunFim"),
      UFFim: getTextContent(ide, "UFFim"),
      retira: getTextContent(ide, "retira"),
      xDetRetira: getTextContent(ide, "xDetRetira"),
      indIEToma: getTextContent(ide, "indIEToma"),
    },
    compl: compl
      ? {
          xCaracAd: getTextContent(compl, "xCaracAd"),
          xCaracSer: getTextContent(compl, "xCaracSer"),
          xObs: getTextContent(compl, "xObs"),
          ObsCont: obsCont.length > 0 ? obsCont : undefined,
        }
      : undefined,
    emit: {
      CNPJ: getTextContent(emit, "CNPJ"),
      CPF: getTextContent(emit, "CPF"),
      IE: getTextContent(emit, "IE"),
      xNome: getTextContent(emit, "xNome"),
      xFant: getTextContent(emit, "xFant"),
      enderEmit: {
        xLgr: getTextContent(enderEmit as Element, "xLgr"),
        nro: getTextContent(enderEmit as Element, "nro"),
        xCpl: getTextContent(enderEmit as Element, "xCpl"),
        xBairro: getTextContent(enderEmit as Element, "xBairro"),
        cMun: getTextContent(enderEmit as Element, "cMun"),
        xMun: getTextContent(enderEmit as Element, "xMun"),
        CEP: getTextContent(enderEmit as Element, "CEP"),
        UF: getTextContent(enderEmit as Element, "UF"),
        fone: getTextContent(enderEmit as Element, "fone"),
      },
      CRT: getTextContent(emit, "CRT"),
    },
    rem: rem
      ? {
          CNPJ: getTextContent(rem, "CNPJ"),
          CPF: getTextContent(rem, "CPF"),
          IE: getTextContent(rem, "IE"),
          xNome: getTextContent(rem, "xNome"),
          xFant: getTextContent(rem, "xFant"),
          fone: getTextContent(rem, "fone"),
          enderReme: {
            xLgr: getTextContent(enderReme as Element, "xLgr"),
            nro: getTextContent(enderReme as Element, "nro"),
            xCpl: getTextContent(enderReme as Element, "xCpl"),
            xBairro: getTextContent(enderReme as Element, "xBairro"),
            cMun: getTextContent(enderReme as Element, "cMun"),
            xMun: getTextContent(enderReme as Element, "xMun"),
            CEP: getTextContent(enderReme as Element, "CEP"),
            UF: getTextContent(enderReme as Element, "UF"),
            cPais: getTextContent(enderReme as Element, "cPais"),
            xPais: getTextContent(enderReme as Element, "xPais"),
            fone: getTextContent(enderReme as Element, "fone"),
          },
          email: getTextContent(rem, "email"),
        }
      : undefined,
    dest: dest
      ? {
          CNPJ: getTextContent(dest, "CNPJ"),
          CPF: getTextContent(dest, "CPF"),
          IE: getTextContent(dest, "IE"),
          xNome: getTextContent(dest, "xNome"),
          xFant: getTextContent(dest, "xFant"),
          fone: getTextContent(dest, "fone"),
          enderDest: {
            xLgr: getTextContent(enderDest as Element, "xLgr"),
            nro: getTextContent(enderDest as Element, "nro"),
            xCpl: getTextContent(enderDest as Element, "xCpl"),
            xBairro: getTextContent(enderDest as Element, "xBairro"),
            cMun: getTextContent(enderDest as Element, "cMun"),
            xMun: getTextContent(enderDest as Element, "xMun"),
            CEP: getTextContent(enderDest as Element, "CEP"),
            UF: getTextContent(enderDest as Element, "UF"),
            cPais: getTextContent(enderDest as Element, "cPais"),
            xPais: getTextContent(enderDest as Element, "xPais"),
            fone: getTextContent(enderDest as Element, "fone"),
          },
          email: getTextContent(dest, "email"),
        }
      : undefined,
    vPrest: {
      vTPrest: getTextContent(vPrest, "vTPrest"),
      vRec: getTextContent(vPrest, "vRec"),
      Comp: componentes.length > 0 ? componentes : undefined,
    },
    imp: {
      ICMS: {
        CST: getTextContent(icmsInner as Element, "CST"),
        vBC: getTextContent(icmsInner as Element, "vBC"),
        pICMS: getTextContent(icmsInner as Element, "pICMS"),
        vICMS: getTextContent(icmsInner as Element, "vICMS"),
        pRedBC: getTextContent(icmsInner as Element, "pRedBC"),
        indSN: getTextContent(icmsInner as Element, "indSN"),
      },
      vTotTrib: getTextContent(imp, "vTotTrib"),
      infAdFisco: getTextContent(imp, "infAdFisco"),
    },
    infCTeNorm: infCTeNorm
      ? {
          infCarga: {
            vCarga: getTextContent(infCarga as Element, "vCarga"),
            proPred: getTextContent(infCarga as Element, "proPred"),
            xOutCat: getTextContent(infCarga as Element, "xOutCat"),
          },
          infDoc: {
            infNFe: infNFe.length > 0 ? infNFe : undefined,
          },
          infModal: {
            versaoModal: "",
          },
        }
      : undefined,
    toma3: toma3
      ? {
          toma: getTextContent(toma3, "toma"),
        }
      : undefined,
    protCTe: infProt
      ? {
          tpAmb: getTextContent(infProt, "tpAmb"),
          verAplic: getTextContent(infProt, "verAplic"),
          chCTe: getTextContent(infProt, "chCTe"),
          dhRecbto: getTextContent(infProt, "dhRecbto"),
          nProt: getTextContent(infProt, "nProt"),
          digVal: getTextContent(infProt, "digVal"),
          cStat: getTextContent(infProt, "cStat"),
          xMotivo: getTextContent(infProt, "xMotivo"),
        }
      : undefined,
  }
}

// Detectar tipo de XML e fazer parse
export function parseXML(xmlString: string): {
  tipo: "nfe" | "cte"
  dados: Partial<NotaFiscalEletronica> | Partial<ConhecimentoTransporteEletronico>
} {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, "text/xml")

  // Verificar se há erros de parse
  const parseError = xmlDoc.getElementsByTagName("parsererror")
  if (parseError.length > 0) {
    throw new Error("XML inválido ou malformado")
  }

  // Detectar tipo
  if (xmlDoc.getElementsByTagName("nfeProc").length > 0 || xmlDoc.getElementsByTagName("NFe").length > 0) {
    return {
      tipo: "nfe",
      dados: parseNFeXML(xmlString),
    }
  } else if (xmlDoc.getElementsByTagName("cteProc").length > 0 || xmlDoc.getElementsByTagName("CTe").length > 0) {
    return {
      tipo: "cte",
      dados: parseCTeXML(xmlString),
    }
  }

  throw new Error("Tipo de XML não reconhecido. Esperado NFe ou CTe.")
}
