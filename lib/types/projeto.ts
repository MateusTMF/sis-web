export interface ProjetoTecnico {
  id: string
  numero: string
  nome: string
  dataCriacao: string
  dataAtualizacao: string

  // Dados Gerais do Transformador
  potencia: number // KVA
  classe: number // KV
  tipoTransformador: string
  tipoNucleo: string
  fases: number
  frequencia: number // Hz
  norma: string

  // Tensões (V)
  tensaoATPrimaria: number // 13800V
  tensaoATSecundaria?: number // 13200V
  tensaoATTerciaria?: number // 12600V, 12000V, 11400V
  tensaoBT: number // 380V / 219.4V

  // Correntes (A)
  correnteAT1: number
  correnteAT2: number
  correnteBT: number
  correnteLinhaAT: number

  // Núcleo
  materialNucleo: string // Aço Silício
  pesNucleo: number // kg
  snuc: number // cm²
  areaLiquida: number // cm²
  espessuraNucleo: number // mm
  chapa: string
  fatEmpilhamento: number

  // Enrolamento AT
  tipoFioAT: string
  diametroFioAT: number // mm
  numeroEspirasAT: number
  numeroCapasAT: number
  secoFioAT: number // mm²
  pesoFioAT: number // kg
  larguraFioAT: number // mm
  ligacaoAT: string // Triângulo/Estrela
  larg_fio_at: number
  larg_fio_tot: number
  h_nuc: number
  lt_fio_at: number

  // Detalhes AT
  densidadeAT: number // A/mm²
  espFioAT: number // mm
  espIsolAT: number // mm
  nCamAT: number
  disposicaoAT: string
  øiAT: number // mm interno
  øeAT_menor: number // mm externo menor
  øeAT_maior: number // mm externo maior
  entrecentroAT: number // mm
  espPorCamada: number
  qtdeFiosAT: number
  cutEspAT: number
  tapsAT: Array<{
    numero: number
    tensao: number
    espiras: number
    relacao: number
    erro: number
  }>

  // Enrolamento BT
  tipoFioBT: string
  diametroFioBT: number // mm
  numeroEspirasBT: number
  numeroCapasBT: number
  secoFioBT: number // mm²
  pesoFioBT: number // kg
  larguraFioBT: number // mm
  ligacaoBT: string // Estrela/Delta
  ibt: number // Ampères

  // Detalhes BT
  densidadeBT: number // A/mm²
  espFioBT: number // mm
  espIsolBT: number // mm
  nCamBT: number
  disposicaoBT: string
  øiBT: number // mm interno
  øeBT: number // mm externo
  ømedBT: number // mm médio
  nBobinas: number
  espPorCamadaBT: number

  // Tanque
  tipoTanque: string // Oval
  materialTanque: string
  alturaTanque: number // mm
  larguraTanque: number // mm
  profundidadeTanque: number // mm
  pesoTanque: number // kg
  volumeOleo: number // L
  nivelOleo: number // cm
  tipoResfriamento: string // ONAN
  tipoIsolante: string // Mineral

  // Especificações Elétricas
  impedancia: number // %
  perda: number // W
  perdaSemCarga: number // W
  perdaCargaAT: number // W
  perdaCargaBT: number // W
  temperatura: number // °C
  classeIsolacao: string // A, B, F, H, etc

  // Peso e Dimensões
  massaTotalTrafo: number // kg
  masaParte_ativa: number // kg
  massaParteOleo: number // kg
  masaViga: number // kg
  altura: number // mm
  largura: number // mm
  profundidade: number // mm

  // Acessórios e Configurações
  radiadores: boolean
  manovacuometro: boolean
  indicadorNivel: boolean
  termometro: boolean
  releGas: boolean
  valvPressao: boolean
  conservadorOleo: boolean
  secadorAr: boolean
  comutadorCarga: boolean
  buscha: string
  nBucha: number
  ventilacaoForcada: number
  acionamentoComutador: string

  // Desenhos/Attachments
  desenhos: Array<{
    id: string
    nome: string
    url: string
    tipo: "aplicativo" | "placa" | "construção" | "esquema" | "núcleo" | "enrolamento" | "outro"
    dataCriacao: string
  }>

  // Observações
  observacoes: string
  especificacoes: string
}

export const projetoMock: ProjetoTecnico[] = [
  {
    id: "proj-001",
    numero: "3075/ALM3/24",
    nome: "Trafo 75KVA - 15KV",
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
    potencia: 75,
    classe: 15,
    tipoTransformador: "Transformador a Óleo",
    tipoNucleo: "Núcleo de Ferro",
    fases: 3,
    frequencia: 60,
    norma: "ABNT NBR 5356",
    tensaoATPrimaria: 13800,
    tensaoATSecundaria: 13200,
    tensaoATTerciaria: 11400,
    tensaoBT: 380,
    correnteAT1: 1.81,
    correnteAT2: 2.19,
    correnteBT: 113.95,
    correnteLinhaAT: 113.95,
    materialNucleo: "Aço Silício",
    pesNucleo: 155,
    snuc: 85.82,
    areaLiquida: 154.45,
    espessuraNucleo: 105.6,
    chapa: "M30",
    fatEmpilhamento: 0.968,
    tipoFioAT: "ALUMINIO",
    diametroFioAT: 1.53,
    numeroEspirasAT: 3711,
    numeroCapasAT: 17,
    secoFioAT: 1.65,
    pesoFioAT: 33.0,
    larguraFioAT: 0.0,
    ligacaoAT: "Triângulo",
    larg_fio_at: 0.0,
    larg_fio_tot: 11.6,
    h_nuc: 610,
    lt_fio_at: 1.53,
    densidadeAT: 1.17,
    espFioAT: 0.0,
    espIsolAT: 0.3,
    nCamAT: 17,
    disposicaoAT: "Deitado",
    øiAT: 172,
    øeAT_menor: 240,
    øeAT_maior: 240,
    entrecentroAT: 247,
    espPorCamada: 220,
    qtdeFiosAT: 1,
    cutEspAT: 161,
    tapsAT: [
      { numero: 1, tensao: 13800, espiras: 3711, relacao: 62.8983, erro: -0.004 },
      { numero: 2, tensao: 13200, espiras: 3550, relacao: 60.1695, erro: 0.006 },
      { numero: 3, tensao: 12600, espiras: 3389, relacao: 57.4407, erro: 0.017 },
      { numero: 4, tensao: 12000, espiras: 3228, relacao: 54.7118, erro: 0.028 },
      { numero: 5, tensao: 11400, espiras: 3067, relacao: 51.9831, erro: 0.041 },
    ],
    tipoFioBT: "ALUMINIO",
    diametroFioBT: 4.5,
    numeroEspirasBT: 59,
    numeroCapasBT: 2,
    secoFioBT: 97.0,
    pesoFioBT: 21.5,
    larguraFioBT: 5.52,
    ligacaoBT: "Estrela com Neutro",
    ibt: 113.95,
    densidadeBT: 1.33,
    espFioBT: 0.0,
    espIsolBT: 0.3,
    nCamBT: 2,
    disposicaoBT: "Deitado",
    øiBT: 117,
    øeBT: 158,
    ømedBT: 137.5,
    nBobinas: 1,
    espPorCamadaBT: 29.5,
    tipoTanque: "Oval",
    materialTanque: "Aço",
    alturaTanque: 830,
    larguraTanque: 785,
    profundidadeTanque: 325,
    pesoTanque: 180.37,
    volumeOleo: 156.0,
    nivelOleo: 70,
    tipoResfriamento: "ONAN",
    tipoIsolante: "Mineral",
    impedancia: 3.5,
    perda: 1125,
    perdaSemCarga: 215,
    perdaCargaAT: 896,
    perdaCargaBT: 1008,
    temperatura: 55,
    classeIsolacao: "A (105°C)",
    massaTotalTrafo: 500,
    masaParte_ativa: 26.39,
    massaParteOleo: 156.0,
    masaViga: 11.9,
    altura: 830,
    largura: 785,
    profundidade: 325,
    radiadores: true,
    manovacuometro: true,
    indicadorNivel: true,
    termometro: true,
    releGas: true,
    valvPressao: true,
    conservadorOleo: false,
    secadorAr: true,
    comutadorCarga: true,
    buscha: "36,2 kV 12 Saias",
    nBucha: 2,
    ventilacaoForcada: 0,
    acionamentoComutador: "Externo",
    desenhos: [],
    observacoes: "Folga de 7mm entre AT/BT. Transformador trifásico a óleo.",
    especificacoes: "Refrigeração ONAN, Isolante Mineral, Tanque Oval Galvanizado",
  },
]
