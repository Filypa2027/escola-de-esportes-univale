export type Status = "ATIVO" | "INATIVO" | "DELETADO";

export interface Person {
  id: number;
  nome: string;
  categoria: string;
  escola: string;
  telefone: string;
  email: string;
  cpf: string;
  situacao: Status;
  dataNascimento: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  escolaridade: string;
}

export interface School {
  id: number;
  nome: string;
  cnpj: string;
  situacao: Status;
}

export interface Modality {
  id: number;
  modalidade: string;
  descricao: string;
  situacao: Status;
}

export interface AcademicPeriod {
  id: number;
  anoSemestre: string;
  dataInicio: string;
  dataFim: string;
  situacao: Status;
}

export interface Turma {
  id: number;
  nome: string;
  modalidade: string;
  periodoLetivo: string;
  horario: string;
  diaSemana: string;
  situacao: Status;
}

export interface Matricula {
  id: number;
  aluno: string;
  turma: string;
  modalidade: string;
  dataMatricula: string;
  situacao: Status;
}

export interface Aula {
  id: number;
  turma: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  descricao: string;
}

export interface Acompanhamento {
  id: number;
  data: string;
  aluno: string;
  profissional: string;
  turma: string;
  resumo: string;
  observacao: string;
  situacao: Status;
}

export const mockPessoas: Person[] = [
  { id: 1, nome: "João Paulo Silva", categoria: "Aluno", escola: "Escola Municipal São Paulo", telefone: "(11) 99234-5678", email: "joao.paulo@email.com", cpf: "123.456.789-00", situacao: "ATIVO", dataNascimento: "2010-03-15", cep: "01310-100", logradouro: "Av. Paulista", numero: "1200", bairro: "Bela Vista", cidade: "São Paulo", escolaridade: "Ensino Fundamental" },
  { id: 2, nome: "Maria Clara Oliveira", categoria: "Aluno", escola: "Colégio Estadual Centro", telefone: "(11) 98765-4321", email: "maria.clara@email.com", cpf: "234.567.890-11", situacao: "ATIVO", dataNascimento: "2011-07-22", cep: "01050-010", logradouro: "Rua Direita", numero: "45", bairro: "Centro", cidade: "São Paulo", escolaridade: "Ensino Fundamental" },
  { id: 3, nome: "Pedro Henrique Costa", categoria: "Aluno", escola: "Escola Municipal São Paulo", telefone: "(11) 97654-3210", email: "pedro.h@email.com", cpf: "345.678.901-22", situacao: "INATIVO", dataNascimento: "2009-11-08", cep: "04101-000", logradouro: "Rua Vergueiro", numero: "890", bairro: "Liberdade", cidade: "São Paulo", escolaridade: "Ensino Médio" },
  { id: 4, nome: "Ana Beatriz Ferreira", categoria: "Aluno", escola: "Colégio Particular Elite", telefone: "(11) 96543-2109", email: "ana.bf@email.com", cpf: "456.789.012-33", situacao: "ATIVO", dataNascimento: "2012-05-30", cep: "01406-100", logradouro: "Rua Augusta", numero: "200", bairro: "Consolação", cidade: "São Paulo", escolaridade: "Ensino Fundamental" },
  { id: 5, nome: "Carlos Eduardo Lima", categoria: "Professor", escola: "—", telefone: "(11) 95432-1098", email: "carlos.lima@escolaesportes.com", cpf: "567.890.123-44", situacao: "ATIVO", dataNascimento: "1985-09-12", cep: "05001-100", logradouro: "Av. Rebouças", numero: "3300", bairro: "Pinheiros", cidade: "São Paulo", escolaridade: "Superior Completo" },
  { id: 6, nome: "Fernanda Souza Gomes", categoria: "Psicóloga", escola: "—", telefone: "(11) 94321-0987", email: "fernanda.gomes@escolaesportes.com", cpf: "678.901.234-55", situacao: "ATIVO", dataNascimento: "1990-02-28", cep: "04011-001", logradouro: "Rua Domingos de Moraes", numero: "150", bairro: "Vila Mariana", cidade: "São Paulo", escolaridade: "Pós-Graduação" },
  { id: 7, nome: "Lucas Rodrigues Martins", categoria: "Aluno", escola: "Escola Municipal Norte", telefone: "(11) 93210-9876", email: "lucas.rm@email.com", cpf: "789.012.345-66", situacao: "ATIVO", dataNascimento: "2010-12-03", cep: "02040-001", logradouro: "Av. Cruzeiro do Sul", numero: "750", bairro: "Santana", cidade: "São Paulo", escolaridade: "Ensino Fundamental" },
  { id: 8, nome: "Isabela Nunes Pereira", categoria: "Aluno", escola: "Colégio Estadual Centro", telefone: "(11) 92109-8765", email: "isabela.np@email.com", cpf: "890.123.456-77", situacao: "ATIVO", dataNascimento: "2013-04-17", cep: "01001-001", logradouro: "Praça da Sé", numero: "1", bairro: "Sé", cidade: "São Paulo", escolaridade: "Ensino Fundamental" },
  { id: 9, nome: "Rafael Alves Santos", categoria: "Coordenador", escola: "—", telefone: "(11) 91098-7654", email: "rafael.alves@escolaesportes.com", cpf: "901.234.567-88", situacao: "ATIVO", dataNascimento: "1978-06-25", cep: "01301-100", logradouro: "Av. São Luís", numero: "50", bairro: "República", cidade: "São Paulo", escolaridade: "Pós-Graduação" },
  { id: 10, nome: "Thais Carvalho Dias", categoria: "Aluno", escola: "Escola Municipal Sul", telefone: "(11) 90987-6543", email: "thais.cd@email.com", cpf: "012.345.678-99", situacao: "INATIVO", dataNascimento: "2011-08-14", cep: "04602-001", logradouro: "Av. Santo Amaro", numero: "4500", bairro: "Santo Amaro", cidade: "São Paulo", escolaridade: "Ensino Fundamental" },
];

export const mockEscolas: School[] = [
  { id: 1, nome: "Escola Municipal São Paulo", cnpj: "01.234.567/0001-00", situacao: "ATIVO" },
  { id: 2, nome: "Colégio Estadual Centro", cnpj: "12.345.678/0001-11", situacao: "ATIVO" },
  { id: 3, nome: "Colégio Particular Elite", cnpj: "23.456.789/0001-22", situacao: "ATIVO" },
  { id: 4, nome: "Escola Municipal Norte", cnpj: "34.567.890/0001-33", situacao: "ATIVO" },
  { id: 5, nome: "Escola Municipal Sul", cnpj: "45.678.901/0001-44", situacao: "INATIVO" },
  { id: 6, nome: "Instituto Educacional Novo Horizonte", cnpj: "56.789.012/0001-55", situacao: "ATIVO" },
];

export const mockModalidades: Modality[] = [
  { id: 1, modalidade: "Futebol", descricao: "Futebol de campo com times de 11 jogadores", situacao: "ATIVO" },
  { id: 2, modalidade: "Futsal", descricao: "Futebol de salão com times de 5 jogadores", situacao: "ATIVO" },
  { id: 3, modalidade: "Vôlei", descricao: "Voleibol quadra com times de 6 jogadores", situacao: "ATIVO" },
  { id: 4, modalidade: "Basquete", descricao: "Basquetebol com times de 5 jogadores", situacao: "ATIVO" },
  { id: 5, modalidade: "Atletismo", descricao: "Corridas, saltos e lançamentos", situacao: "ATIVO" },
  { id: 6, modalidade: "Natação", descricao: "Modalidade aquática em piscina olímpica", situacao: "INATIVO" },
];

export const mockPeriodos: AcademicPeriod[] = [
  { id: 1, anoSemestre: "2025/1°", dataInicio: "2025-02-01", dataFim: "2025-06-30", situacao: "INATIVO" },
  { id: 2, anoSemestre: "2025/2°", dataInicio: "2025-07-01", dataFim: "2025-12-15", situacao: "ATIVO" },
  { id: 3, anoSemestre: "2026/1°", dataInicio: "2026-02-01", dataFim: "2026-06-30", situacao: "ATIVO" },
];

export const mockTurmas: Turma[] = [
  { id: 1, nome: "Futebol Sub-12 A", modalidade: "Futebol", periodoLetivo: "2026/1°", horario: "08:00 – 09:30", diaSemana: "Seg, Qua, Sex", situacao: "ATIVO" },
  { id: 2, nome: "Futebol Sub-14 B", modalidade: "Futebol", periodoLetivo: "2026/1°", horario: "10:00 – 11:30", diaSemana: "Ter, Qui", situacao: "ATIVO" },
  { id: 3, nome: "Vôlei Feminino A", modalidade: "Vôlei", periodoLetivo: "2026/1°", horario: "14:00 – 15:30", diaSemana: "Seg, Qua", situacao: "ATIVO" },
  { id: 4, nome: "Basquete Misto", modalidade: "Basquete", periodoLetivo: "2026/1°", horario: "16:00 – 17:30", diaSemana: "Ter, Qui, Sáb", situacao: "ATIVO" },
  { id: 5, nome: "Atletismo Iniciante", modalidade: "Atletismo", periodoLetivo: "2025/2°", horario: "07:00 – 08:30", diaSemana: "Seg, Sex", situacao: "INATIVO" },
  { id: 6, nome: "Futsal Sub-10", modalidade: "Futsal", periodoLetivo: "2026/1°", horario: "09:00 – 10:00", diaSemana: "Qua, Sex", situacao: "ATIVO" },
];

export const mockMatriculas: Matricula[] = [
  { id: 1, aluno: "João Paulo Silva", turma: "Futebol Sub-12 A", modalidade: "Futebol", dataMatricula: "2026-02-03", situacao: "ATIVO" },
  { id: 7, aluno: "João Paulo Silva", turma: "Futsal Sub-10", modalidade: "Futsal", dataMatricula: "2025-03-12", situacao: "INATIVO" },
  { id: 2, aluno: "Maria Clara Oliveira", turma: "Vôlei Feminino A", modalidade: "Vôlei", dataMatricula: "2026-02-04", situacao: "ATIVO" },
  { id: 8, aluno: "Maria Clara Oliveira", turma: "Atletismo Iniciante", modalidade: "Atletismo", dataMatricula: "2025-08-20", situacao: "INATIVO" },
  { id: 3, aluno: "Pedro Henrique Costa", turma: "Futebol Sub-14 B", modalidade: "Futebol", dataMatricula: "2025-07-10", situacao: "INATIVO" },
  { id: 4, aluno: "Ana Beatriz Ferreira", turma: "Vôlei Feminino A", modalidade: "Vôlei", dataMatricula: "2026-02-05", situacao: "ATIVO" },
  { id: 5, aluno: "Lucas Rodrigues Martins", turma: "Futebol Sub-12 A", modalidade: "Futebol", dataMatricula: "2026-02-10", situacao: "ATIVO" },
  { id: 6, aluno: "Isabela Nunes Pereira", turma: "Basquete Misto", modalidade: "Basquete", dataMatricula: "2026-02-08", situacao: "ATIVO" },
];

export const mockAulas: Aula[] = [
  { id: 1, turma: "Futebol Sub-12 A", data: "2026-06-02", horarioInicio: "08:00", horarioFim: "09:30", descricao: "Treino de posicionamento e passes curtos" },
  { id: 2, turma: "Vôlei Feminino A", data: "2026-06-02", horarioInicio: "14:00", horarioFim: "15:30", descricao: "Fundamentos: manchete e toque" },
  { id: 3, turma: "Futebol Sub-12 A", data: "2026-06-04", horarioInicio: "08:00", horarioFim: "09:30", descricao: "Jogo simulado 4x4" },
  { id: 4, turma: "Basquete Misto", data: "2026-06-03", horarioInicio: "16:00", horarioFim: "17:30", descricao: "Dribles e arremessos livres" },
  { id: 5, turma: "Futsal Sub-10", data: "2026-06-04", horarioInicio: "09:00", horarioFim: "10:00", descricao: "Introdução às regras e fundamentos" },
  { id: 6, turma: "Futebol Sub-14 B", data: "2026-06-05", horarioInicio: "10:00", horarioFim: "11:30", descricao: "Táticas defensivas e cobranças de falta" },
];

export const mockAcompanhamentos: Acompanhamento[] = [
  { id: 1, data: "2026-06-05", aluno: "João Paulo Silva", profissional: "Fernanda Souza Gomes", turma: "Futebol Sub-12 A", resumo: "Acompanhamento psicológico mensal", observacao: "Aluno demonstra evolução no comportamento em grupo. Apresenta maior integração com colegas. Recomenda-se continuar atividades coletivas com reforço positivo.", situacao: "ATIVO" },
  { id: 2, data: "2026-06-04", aluno: "Maria Clara Oliveira", profissional: "Carlos Eduardo Lima", turma: "Vôlei Feminino A", resumo: "Avaliação pedagógica de desempenho técnico", observacao: "Aluna apresentou melhora significativa na execução do toque. Precisa trabalhar mais o saque por cima. Indicado treino específico nas próximas semanas.", situacao: "ATIVO" },
  { id: 3, data: "2026-06-03", aluno: "Ana Beatriz Ferreira", profissional: "Fernanda Souza Gomes", turma: "Vôlei Feminino A", resumo: "Sessão de acompanhamento emocional", observacao: "Aluna relatou ansiedade antes das competições. Trabalhamos técnicas de respiração e foco. Próxima sessão em 15 dias.", situacao: "ATIVO" },
  { id: 4, data: "2026-05-28", aluno: "Lucas Rodrigues Martins", profissional: "Carlos Eduardo Lima", turma: "Futebol Sub-12 A", resumo: "Avaliação física e técnica", observacao: "Aluno em bom desenvolvimento físico para a idade. Destaque para velocidade e agilidade. Potencial para evolução na posição de meia.", situacao: "ATIVO" },
];

export const mockFrequencia = {
  alunos: [
    { id: 1, nome: "João Paulo Silva", presente: true },
    { id: 2, nome: "Lucas Rodrigues Martins", presente: true },
    { id: 3, nome: "Pedro Henrique Costa", presente: false },
    { id: 4, nome: "Gabriel Moreira Alves", presente: true },
    { id: 5, nome: "Matheus Fernandes Silva", presente: false },
    { id: 6, nome: "Bruno Carvalho Lima", presente: true },
    { id: 7, nome: "Diego Santos Rocha", presente: true },
    { id: 8, nome: "Felipe Costa Martins", presente: false },
  ]
};

export const mockDashboard = {
  totalAlunos: 127,
  totalTurmas: 12,
  totalModalidades: 6,
  frequenciaMedia: 87.4,
  acompanhamentosMes: 34,
  ultimasAtividades: [
    { tipo: "Frequência", descricao: "Chamada registrada — Futebol Sub-12 A", usuario: "Carlos Lima", tempo: "há 15 min", icon: "check" },
    { tipo: "Matrícula", descricao: "Nova matrícula — Isabela Nunes em Basquete Misto", usuario: "Rafael Alves", tempo: "há 42 min", icon: "user" },
    { tipo: "Acompanhamento", descricao: "Sessão psicológica — João Paulo Silva", usuario: "Fernanda Gomes", tempo: "há 1h", icon: "heart" },
    { tipo: "Aula", descricao: "Nova aula cadastrada — Vôlei Feminino A", usuario: "Carlos Lima", tempo: "há 2h", icon: "book" },
    { tipo: "Matrícula", descricao: "Nova matrícula — Gabriel Alves em Futsal Sub-10", usuario: "Rafael Alves", tempo: "há 3h", icon: "user" },
  ],
  alunosPorModalidade: [
    { name: "Futebol", value: 38 },
    { name: "Futsal", value: 18 },
    { name: "Vôlei", value: 24 },
    { name: "Basquete", value: 22 },
    { name: "Atletismo", value: 15 },
    { name: "Natação", value: 10 },
  ],
  frequenciaPorTurma: [
    { turma: "Fut. Sub-12 A", frequencia: 91 },
    { turma: "Fut. Sub-14 B", frequencia: 84 },
    { turma: "Vôlei Fem. A", frequencia: 89 },
    { turma: "Basquete M.", frequencia: 82 },
    { turma: "Futsal Sub-10", frequencia: 93 },
    { turma: "Atletismo", frequencia: 78 },
  ],
  evolucaoMatriculas: [
    { mes: "Jan", matriculas: 8 },
    { mes: "Fev", matriculas: 22 },
    { mes: "Mar", matriculas: 12 },
    { mes: "Abr", matriculas: 9 },
    { mes: "Mai", matriculas: 15 },
    { mes: "Jun", matriculas: 11 },
  ],
};


