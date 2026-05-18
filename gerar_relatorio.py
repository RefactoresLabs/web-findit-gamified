from fpdf import FPDF

class RelatorioPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, 'Achados e Perdidos - Relatório Técnico do Frontend', align='C', new_x="LMARGIN", new_y="NEXT")
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f'Página {self.page_no()}/{{nb}}', align='C')

    def titulo_secao(self, texto):
        self.ln(4)
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(30, 30, 30)
        self.cell(0, 10, texto, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(79, 70, 229)
        self.set_line_width(0.8)
        self.line(10, self.get_y(), 80, self.get_y())
        self.set_line_width(0.2)
        self.set_draw_color(0, 0, 0)
        self.ln(4)

    def subtitulo(self, texto):
        self.ln(2)
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(50, 50, 50)
        self.cell(0, 8, texto, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def paragrafo(self, texto):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(60, 60, 60)
        self.multi_cell(0, 5.5, texto)
        self.ln(2)

    def item_lista(self, texto, indent=10):
        x = self.get_x()
        self.set_font('Helvetica', '', 10)
        self.set_text_color(60, 60, 60)
        self.cell(indent, 5.5, '•')
        self.multi_cell(0, 5.5, texto)
        self.ln(1)

    def bloco_codigo(self, texto):
        self.set_font('Courier', '', 9)
        self.set_fill_color(240, 240, 240)
        self.set_text_color(40, 40, 40)
        self.set_draw_color(200, 200, 200)
        x = self.get_x()
        y = self.get_y()
        lines = texto.split('\n')
        h = len(lines) * 5 + 6
        if y + h > 270:
            self.add_page()
            y = self.get_y()
        self.rect(10, y, 190, h)
        self.set_xy(13, y + 3)
        for line in lines:
            self.cell(0, 5, line, new_x="LMARGIN", new_y="NEXT")
            self.set_x(13)
        self.set_xy(10, y + h + 2)
        self.ln(2)

    def badge(self, texto, cor):
        cores = {
            'verde': (34, 197, 94),
            'vermelho': (239, 68, 68),
            'amarelo': (234, 179, 8),
            'azul': (79, 70, 229),
        }
        r, g, b = cores.get(cor, (100, 100, 100))
        self.set_font('Helvetica', 'B', 9)
        w = self.get_string_width(texto) + 8
        self.set_fill_color(r, g, b)
        self.set_text_color(255, 255, 255)
        x = self.get_x()
        y = self.get_y()
        self.rect(x, y, w, 6, style='F')
        self.set_xy(x + 4, y + 0.5)
        self.cell(w - 8, 5, texto)
        self.set_xy(x + w + 2, y)
        self.set_text_color(60, 60, 60)


pdf = RelatorioPDF()
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)
pdf.add_page()

# ===================== CAPA =====================
pdf.ln(30)
pdf.set_font('Helvetica', 'B', 28)
pdf.set_text_color(30, 30, 30)
pdf.cell(0, 15, 'Relatório Técnico', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.set_font('Helvetica', '', 16)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 10, 'Módulo de Negociações - Frontend', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.ln(10)
pdf.set_draw_color(79, 70, 229)
pdf.set_line_width(1)
pdf.line(70, pdf.get_y(), 140, pdf.get_y())
pdf.set_line_width(0.2)
pdf.set_draw_color(0, 0, 0)
pdf.ln(15)
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 7, 'Projeto: Achados e Perdidos - UNDB', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 7, 'Data: 18 de maio de 2026', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 7, 'Autor: André Gustavo (Frontend)', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.ln(40)
pdf.set_font('Helvetica', 'I', 9)
pdf.set_text_color(150, 150, 150)
pdf.cell(0, 7, 'Este documento detalha o que foi implementado no frontend e as limitações', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 7, 'encontradas no backend que impactam o funcionamento completo do sistema.', align='C', new_x="LMARGIN", new_y="NEXT")


# ===================== PÁGINA 2: RESUMO =====================
pdf.add_page()

pdf.titulo_secao('1. Resumo do que foi implementado no Frontend')

pdf.paragrafo(
    'Todas as 5 telas solicitadas para o módulo de negociações foram implementadas '
    'no frontend utilizando Vue 3 com Composition API e TypeScript. '
    'O sistema se conecta ao backend real sempre que possível e utiliza dados '
    'mockados (simulados localmente) apenas quando o endpoint do backend não existe.'
)

pdf.subtitulo('1.1 Tela "Minhas Negociações"')
pdf.item_lista('Abas separadas para negociações "Criadas" e "Recebidas", com contadores')
pdf.item_lista('Cards exibindo: nome do item, nome do usuário e status (Pendente, Aceita, Rejeitada, Finalizada)')
pdf.item_lista('Botão "+" (FAB) para criar nova negociação')
pdf.item_lista('Clique no card redireciona para detalhes da negociação')
pdf.item_lista('Dados da listagem: MOCK (localStorage) — backend não possui endpoints de listagem')

pdf.subtitulo('1.2 Tela "Detalhes da Negociação"')
pdf.item_lista('Exibe: status, nome do item (clicável), dono do item, telefone do dono, data/hora de criação, nome do solicitante, telefone do solicitante e código de recuperação')
pdf.item_lista('Botões "Aceitar" e "Rejeitar" visíveis apenas em negociações recebidas com status Pendente')
pdf.item_lista('Botão "Completar Negociação" visível quando negociação recebida está com status Aceita')
pdf.item_lista('Dados do detalhe: REAL (GET /claim/:id do backend)')

pdf.subtitulo('1.3 Tela "Seleção de Itens Encontrados"')
pdf.item_lista('Lista todos os itens encontrados cadastrados no sistema')
pdf.item_lista('Ao clicar em um item, cria a negociação (POST /claims) e redireciona para listagem')
pdf.item_lista('Dados: REAL (backend)')

pdf.subtitulo('1.4 Tela "Ativação de Código"')
pdf.item_lista('Campo de input para digitar código de recuperação de 10 caracteres alfanuméricos')
pdf.item_lista('Botão "Confirmar Código" habilitado apenas quando 10 caracteres são preenchidos')
pdf.item_lista('Chama PATCH /claims/:id/complete-retrieval no backend')

pdf.subtitulo('1.5 Tela "Confirmação de Código Ativado"')
pdf.item_lista('Tela de sucesso exibida após finalização da negociação')
pdf.item_lista('Botão para voltar à listagem de negociações')

# ===================== PÁGINA 3: LIMITAÇÕES =====================
pdf.add_page()

pdf.titulo_secao('2. Limitações encontradas no Backend')

pdf.paragrafo(
    'Durante a integração do frontend com o backend, foram identificadas limitações '
    'que impedem o funcionamento completo de algumas funcionalidades. '
    'Abaixo estão detalhadas cada uma delas com exemplos concretos.'
)

# --- Limitação 1 ---
pdf.subtitulo('2.1 Endpoints de listagem não implementados')

pdf.set_font('Helvetica', 'B', 10)
pdf.set_text_color(239, 68, 68)
pdf.cell(20, 6, 'Gravidade: ')
pdf.badge('ALTA', 'vermelho')
pdf.ln(8)

pdf.paragrafo(
    'Os endpoints GET /my-created-claims e GET /my-received-claims não existem no backend. '
    'Esses endpoints são essenciais para que a tela "Minhas Negociações" liste as negociações '
    'do usuário logado.'
)

pdf.paragrafo('O que deveria acontecer:')
pdf.bloco_codigo(
    'GET /my-created-claims\n'
    'Authorization: Bearer <token>\n'
    '\n'
    'Resposta esperada: lista de negociações criadas pelo usuário logado\n'
    '[\n'
    '  { "id": 3, "status": "Pendente", "associated_found_item": {...}, ... },\n'
    '  ...\n'
    ']'
)

pdf.paragrafo('O que acontece atualmente:')
pdf.bloco_codigo(
    'GET /my-created-claims\n'
    'Authorization: Bearer <token>\n'
    '\n'
    'Resposta: 404 Not Found (endpoint não existe)'
)

pdf.paragrafo(
    'Solução paliativa no frontend: os dados da listagem são armazenados localmente '
    '(localStorage do navegador) após o usuário criar uma negociação. Isso funciona '
    'visualmente, mas os dados não aparecem em outros dispositivos ou navegadores, '
    'e se o usuário limpar o cache do navegador, as negociações somem da lista.'
)

# --- Limitação 2 ---
pdf.subtitulo('2.2 POST /claims não retorna o ID da negociação criada')

pdf.set_font('Helvetica', 'B', 10)
pdf.set_text_color(234, 179, 8)
pdf.cell(20, 6, 'Gravidade: ')
pdf.badge('MÉDIA', 'amarelo')
pdf.ln(8)

pdf.paragrafo(
    'Ao criar uma negociação com POST /claims, o backend retorna apenas uma mensagem '
    'de sucesso, sem informar o ID da negociação que acabou de ser criada.'
)

pdf.paragrafo('Resposta atual do backend:')
pdf.bloco_codigo(
    'POST /claims\n'
    'Body: { "found_item_id": 3 }\n'
    '\n'
    'Resposta (status 201):\n'
    '{ "message": "Negociação registrada com sucesso!" }'
)

pdf.paragrafo('Resposta ideal:')
pdf.bloco_codigo(
    'Resposta (status 201):\n'
    '{\n'
    '  "message": "Negociação registrada com sucesso!",\n'
    '  "id": 3\n'
    '}'
)

pdf.paragrafo(
    'Sem o ID, o frontend não consegue redirecionar diretamente para a tela de detalhes '
    'da negociação criada, nem associar corretamente os dados locais com o backend. '
    'A solução paliativa foi tentar descobrir o ID fazendo chamadas sequenciais '
    'GET /claim/1, GET /claim/2, GET /claim/3... até encontrar a negociação recém-criada. '
    'Isso é frágil e ineficiente.'
)

# --- Limitação 3 ---
pdf.add_page()

pdf.subtitulo('2.3 Completar negociação — contradição entre instruções e código')

pdf.set_font('Helvetica', 'B', 10)
pdf.set_text_color(239, 68, 68)
pdf.cell(20, 6, 'Gravidade: ')
pdf.badge('ALTA', 'vermelho')
pdf.ln(8)

pdf.paragrafo('Existe uma contradição entre as instruções enviadas e o código implementado:')

pdf.paragrafo(
    'Instrução recebida (mensagem do Lucas):\n'
    '"No caso de ser uma negociação recebida, a tela deve ter dois botões que permitam '
    'alterar o status da negociação (Aceitar ou Rejeitar). Caso essa negociação recebida '
    'for aceita, um botão de completar negociação deve aparecer no local onde havia os '
    'outros dois botões."'
)

pdf.paragrafo(
    'Ou seja, segundo as instruções, quem completa a negociação é quem RECEBEU '
    '(o dono do item encontrado).'
)

pdf.paragrafo('Porém, no código do backend (finish_claim_use_case.py, linha 68):')
pdf.bloco_codigo(
    'if dto.user_id != claim.claimant_user_account.id:\n'
    '    raise UserAccountDoesntHavePermissionError(\n'
    '        "Usuário não tem permissão para essa operação"\n'
    '    )'
)

pdf.paragrafo(
    'O backend só permite que o CLAIMANT (quem criou a negociação) finalize. '
    'Se o dono do item tenta completar, o backend rejeita.'
)

pdf.paragrafo('Exemplo concreto do erro:')
pdf.item_lista('André criou a negociação (ele é o claimant)')
pdf.item_lista('Maria recebeu a negociação (ela é a dona do item "Carteira de Couro")')
pdf.item_lista('Maria aceitou a negociação — botão "Completar Negociação" apareceu para ela')
pdf.item_lista('Maria digitou o código "NRHNDTIW90" e clicou confirmar')
pdf.item_lista('Backend retornou erro 500 porque Maria não é o claimant')

pdf.paragrafo(
    'Decisão necessária: quem deve completar a negociação? O claimant (André, quem perdeu '
    'o item) ou quem recebeu (Maria, dona do item encontrado)? O frontend precisa dessa '
    'definição para ajustar o botão para o usuário correto.'
)

# --- Limitação 4 ---
pdf.subtitulo('2.4 Erro 500 retorna HTML em vez de JSON')

pdf.set_font('Helvetica', 'B', 10)
pdf.set_text_color(234, 179, 8)
pdf.cell(20, 6, 'Gravidade: ')
pdf.badge('MÉDIA', 'amarelo')
pdf.ln(8)

pdf.paragrafo(
    'Quando o endpoint PATCH /claims/:id/complete-retrieval falha (por exemplo, por falta '
    'de permissão), o backend retorna um erro 500 com corpo em HTML em vez de JSON.'
)

pdf.paragrafo('Resposta recebida:')
pdf.bloco_codigo(
    'Status: 500 Internal Server Error\n'
    'Content-Type: text/html\n'
    '\n'
    '<!doctype html>\n'
    '<title>500 Internal Server Error</title>\n'
    '<h1>Internal Server Error</h1>'
)

pdf.paragrafo('Resposta esperada (JSON):')
pdf.bloco_codigo(
    'Status: 400 Bad Request\n'
    'Content-Type: application/json\n'
    '\n'
    '{\n'
    '  "message": "Usuário não tem permissão para essa operação",\n'
    '  "code": "USER_ACCOUNT_DOESNT_HAVE_PERMISSION_ERROR"\n'
    '}'
)

pdf.paragrafo(
    'Isso indica que a exceção não está sendo capturada corretamente pelo controller, '
    'fazendo o Flask retornar a página de erro padrão. O frontend não consegue exibir '
    'uma mensagem útil ao usuário — aparece "Unexpected token \'<\'" porque tenta '
    'interpretar HTML como JSON.'
)

# --- Limitação 5 ---
pdf.subtitulo('2.5 Código de recuperação alfanumérico vs. "10 dígitos"')

pdf.set_font('Helvetica', 'B', 10)
pdf.set_text_color(100, 100, 100)
pdf.cell(20, 6, 'Gravidade: ')
pdf.badge('BAIXA', 'azul')
pdf.ln(8)

pdf.paragrafo(
    'As instruções mencionam "código de recuperação de 10 dígitos". A palavra "dígitos" '
    'normalmente se refere a números (0-9). Porém, o backend gera códigos alfanuméricos '
    'com letras e números — exemplo: NRHNDTIW90.'
)

pdf.paragrafo(
    'Isso não é um erro grave. O frontend já foi ajustado para aceitar letras e números. '
    'Porém, seria bom padronizar a nomenclatura: usar "10 caracteres" em vez de "10 dígitos" '
    'na documentação.'
)

# ===================== PÁGINA FINAL: TABELA RESUMO =====================
pdf.add_page()

pdf.titulo_secao('3. Tabela Resumo: Backend Real vs. Mock')

pdf.paragrafo(
    'A tabela abaixo mostra cada funcionalidade, se ela usa dados reais do backend '
    'ou mock (simulação local), e o motivo.'
)

pdf.set_font('Helvetica', 'B', 9)
pdf.set_fill_color(79, 70, 229)
pdf.set_text_color(255, 255, 255)
pdf.cell(70, 8, ' Funcionalidade', fill=True)
pdf.cell(25, 8, ' Fonte', fill=True)
pdf.cell(95, 8, ' Observação', fill=True)
pdf.ln()

rows = [
    ('Criar negociação (POST /claims)', 'REAL', 'Funciona, mas não retorna ID'),
    ('Ver detalhes (GET /claim/:id)', 'REAL', 'Funciona corretamente'),
    ('Aceitar (PATCH /claims/:id/accept)', 'REAL', 'Funciona corretamente'),
    ('Rejeitar (PATCH /claims/:id/reject)', 'REAL', 'Funciona corretamente'),
    ('Completar (complete-retrieval)', 'REAL*', 'Erro 500 por contradição de permissão'),
    ('Listar criadas', 'MOCK', 'Endpoint não existe no backend'),
    ('Listar recebidas', 'MOCK', 'Endpoint não existe no backend'),
]

pdf.set_font('Helvetica', '', 9)
pdf.set_text_color(60, 60, 60)
for i, (func, fonte, obs) in enumerate(rows):
    fill = i % 2 == 0
    if fill:
        pdf.set_fill_color(245, 245, 250)
    else:
        pdf.set_fill_color(255, 255, 255)

    if fonte == 'REAL':
        cor_fonte = (34, 197, 94)
    elif fonte == 'MOCK':
        cor_fonte = (234, 179, 8)
    else:
        cor_fonte = (239, 68, 68)

    pdf.set_text_color(60, 60, 60)
    pdf.cell(70, 7, f' {func}', fill=True)
    pdf.set_text_color(*cor_fonte)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(25, 7, f' {fonte}', fill=True)
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(95, 7, f' {obs}', fill=True)
    pdf.ln()

pdf.ln(10)
pdf.set_font('Helvetica', 'I', 9)
pdf.set_text_color(120, 120, 120)
pdf.multi_cell(0, 5, '* REAL com ressalva: o endpoint existe mas apresenta erro devido à contradição de permissão descrita na seção 2.3.')

# ===================== SALVAR =====================
output_path = '/Users/andregustavoxs/Códigos/achados-e-perdidos/frontend-lostfinder/Relatorio_Negociacoes_Frontend.pdf'
pdf.output(output_path)
print(f'PDF gerado: {output_path}')
