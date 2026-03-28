import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Noticia from '../models/Noticia.js';
import Glossario from '../models/Glossario.js';

dotenv.config();

const noticias = [
    {
        titulo: "Governo Propõe Salário Mínimo de R$ 1.627 para 2026 e Avança Isenção do IR",
        resumo: "O governo federal enviou ao Congresso o PLOA prevendo o salário mínimo de R$ 1.627,00 para 2026 — reajuste de 7,44% sobre o piso atual. A medida ocorre em paralelo à implementação da isenção de IR para quem ganha até R$ 5.000, promessa de campanha agendada para o ano eleitoral.",
        linkSite: "https://www12.senado.leg.br/noticias",
        dataPublicacao: new Date("2026-03-15T10:00:00Z"),
        dataExpiracao: new Date("2026-09-15T23:59:59Z"),
        destaque: true,
        categorias: ["economia", "orcamento"],
        fontes: ["Agência Senado", "Agência Câmara", "Portal da Transparência (PLOA)"],
        analise: {
            beneficiados: [
                {
                    tipo: "direto",
                    descricao: "Aposentados, pensionistas do INSS e trabalhadores que recebem o piso (~54 milhões de pessoas) com recomposição inflacionária + ganho real limitado."
                },
                {
                    tipo: "indireto",
                    descricao: "Mercado financeiro e rentistas. A limitação do salário mínimo preserva orçamento para juros da dívida."
                }
            ],
            efeitosPraticos: [
                "O aumento segue a regra do pacote fiscal de 2024, que limitou o ganho real a 2,5% ao ano. O trabalhador recebe aumento nominal, mas o poder de compra cresce em ritmo travado.",
                "A isenção do IR funciona como renúncia fiscal que pressiona as contas públicas, exigindo cortes em outras áreas ou aumento de impostos sobre consumo."
            ]
        },
        cortinaFumaca: {
            titulo: "A Narrativa do \"Imposto para os Ricos\"",
            descricao: "O governo enfatiza a taxação de \"super-ricos\" (renda acima de R$ 50 mil) como compensação para a isenção do IR da classe média.",
            evidencias: [
                {
                    rotulo: "Ocultação",
                    texto: "A arrecadação com \"super-ricos\" é volátil e insuficiente para cobrir o rombo da isenção geral."
                },
                {
                    rotulo: "Manipulação",
                    texto: "O foco na isenção em 2026 desvia a atenção dos cortes em benefícios previdenciários e no Abono Salarial."
                }
            ]
        },
        confronto: {
            discursoOficial: "Afirma que o orçamento de 2026 é \"socialmente equilibrado\" e promove justiça fiscal.",
            realidade: "O reajuste de R$ 1.627 está atrelado a travas fiscais. O governo \"dá com uma mão\" (isenção de IR) no ano eleitoral, enquanto \"tira com a outra\" (travas no ganho real e restrições no abono)."
        },
        agentesPublicos: [
            {
                nome: "Luiz Inácio Lula da Silva",
                iniciais: "L",
                cargo: "Presidente",
                historico: "Governa em busca da reeleição. Histórico inclui condenações na Lava Jato por corrupção passiva e lavagem de dinheiro, anuladas pelo STF por questões processuais, sem absolvição do mérito."
            },
            {
                nome: "Fernando Haddad",
                iniciais: "FH",
                cargo: "Ministro da Fazenda",
                historico: "Articulador do pacote fiscal. Réu por caixa dois em 2012 (absolvido pelo TRE-SP). Alvo de inquéritos por corrupção baseados em delações da Odebrecht (arquivados por falta de provas)."
            }
        ],
        videoReferencia: {
            titulo: "Cortes de gastos e manobras no orçamento explicados",
            descricao: "Vídeo sobre a aprovação do pacote fiscal de 2024 e as limitações estruturais do cenário vigente.",
            url: "https://youtube.com/watch?v=exemplo"
        },
        glossario: [
            { termo: "PLOA", definicao: "Projeto de Lei Orçamentária Anual. Define quanto o governo planeja arrecadar e gastar no ano seguinte." },
            { termo: "rentistas", definicao: "Pessoas que vivem de rendimentos de investimentos, como juros de títulos públicos." },
            { termo: "renúncia fiscal", definicao: "Quando o governo abre mão de receber dinheiro de impostos." }
        ]
    },
    {
        titulo: "STF Retoma Julgamento sobre Descriminalização do Porte de Maconha",
        resumo: "O Supremo Tribunal Federal reiniciou o julgamento que pode descriminalizar o porte de até 40 gramas de maconha para uso pessoal. O placar está em 6 a 3 a favor da descriminalização, com sessão decisiva marcada para abril.",
        dataPublicacao: new Date("2026-03-10T14:00:00Z"),
        dataExpiracao: new Date("2026-06-10T23:59:59Z"),
        destaque: false,
        categorias: ["judiciario", "legislativo"],
        fontes: ["STF", "Agência Brasil"],
        analise: {
            beneficiados: [
                {
                    tipo: "direto",
                    descricao: "Usuários de drogas que deixariam de ser criminalizados, especialmente populações periféricas."
                },
                {
                    tipo: "indireto",
                    descricao: "Sistema prisional, com potencial redução de encarceramento por posse."
                }
            ],
            efeitosPraticos: [
                "A decisão não legaliza a maconha — apenas descriminaliza o porte para uso pessoal, mantendo o tráfico como crime.",
                "A definição de 'uso pessoal' por quantidade (40g) é criticada por especialistas como arbitrária."
            ]
        },
        confronto: {
            discursoOficial: "Ministros favoráveis defendem que a medida respeita direitos individuais e reduz encarceramento.",
            realidade: "Sem regulamentação do cultivo e venda, o usuário descriminalizado ainda depende do tráfico para obter a substância."
        },
        agentesPublicos: [
            {
                nome: "Alexandre de Moraes",
                iniciais: "AM",
                cargo: "Ministro do STF",
                historico: "Presidente do TSE durante as eleições de 2022. Relator de diversos inquéritos sobre ataques às instituições democráticas."
            }
        ],
        glossario: [
            { termo: "descriminalização", definicao: "Retirar a conduta do rol de crimes, mas sem legalizá-la completamente." },
            { termo: "porte", definicao: "Ter consigo determinada substância ou objeto." }
        ]
    },
    {
        titulo: "Câmara Aprova PL que Amplia Controle do Congresso sobre Agências Reguladoras",
        resumo: "A Câmara dos Deputados aprovou em primeiro turno um projeto de lei que aumenta a supervisão parlamentar sobre agências como ANATEL, ANEEL e ANS, permitindo que o Congresso anule resoluções técnicas por maioria simples.",
        dataPublicacao: new Date("2026-03-05T09:00:00Z"),
        dataExpiracao: new Date("2026-07-05T23:59:59Z"),
        destaque: false,
        categorias: ["legislativo", "economia"],
        fontes: ["Câmara dos Deputados", "Agência Câmara"],
        analise: {
            beneficiados: [
                {
                    tipo: "direto",
                    descricao: "Congressistas que ganham poder de veto sobre decisões técnicas das agências."
                },
                {
                    tipo: "indireto",
                    descricao: "Setores econômicos regulados que poderão influenciar parlamentares para derrubar decisões desfavoráveis."
                }
            ],
            efeitosPraticos: [
                "A medida enfraquece a independência técnica das agências reguladoras, pilar do modelo regulatório brasileiro desde os anos 1990.",
                "Investidores estrangeiros tendem a reduzir alocações em setores regulados ante maior incerteza regulatória."
            ]
        },
        cortinaFumaca: {
            titulo: "\"Controle Democrático\" das Agências",
            descricao: "O projeto é apresentado como medida de transparência e controle democrático das agências.",
            evidencias: [
                {
                    rotulo: "Problema",
                    texto: "Agências reguladoras foram criadas justamente para isolar decisões técnicas de pressões políticas de curto prazo."
                },
                {
                    rotulo: "Risco",
                    texto: "A politização de tarifas e regulações pode gerar instabilidade e afugentar investimentos."
                }
            ]
        },
        glossario: [
            { termo: "agência reguladora", definicao: "Entidade estatal independente que regula setores específicos da economia, como energia, telecomunicações e saúde." },
            { termo: "resolução técnica", definicao: "Norma emitida por agência reguladora com base em critérios técnicos e científicos." }
        ]
    }
];

const glossarioGeral = [
    { termo: "PLOA", definicao: "Projeto de Lei Orçamentária Anual. Define quanto o governo planeja arrecadar e gastar no ano seguinte." },
    { termo: "rentistas", definicao: "Pessoas que vivem de rendimentos de investimentos, como juros de títulos públicos." },
    { termo: "renúncia fiscal", definicao: "Quando o governo abre mão de receber dinheiro de impostos." },
    { termo: "descriminalização", definicao: "Retirar uma conduta do rol de crimes sem necessariamente legalizá-la completamente." },
    { termo: "agência reguladora", definicao: "Entidade estatal independente que regula setores específicos da economia, como energia, telecomunicações e saúde." },
    { termo: "pacote fiscal", definicao: "Conjunto de medidas econômicas para controle de gastos públicos e equilíbrio das contas do governo." }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado ao MongoDB');

        await Noticia.deleteMany({});
        await Glossario.deleteMany({});
        console.log('Collections limpas');

        const noticiasInseridas = await Noticia.insertMany(noticias);
        console.log(`${noticiasInseridas.length} notícias inseridas:`);
        noticiasInseridas.forEach(n => console.log(`  - [${n._id}] ${n.titulo}`));

        const termosInseridos = await Glossario.insertMany(glossarioGeral);
        console.log(`\n${termosInseridos.length} termos do glossário inseridos:`);
        termosInseridos.forEach(t => console.log(`  - ${t.termo}`));

    } catch (error) {
        console.error('Erro no seed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\nDesconectado. Seed concluído.');
    }
}

seed();
