# Política de Segurança

## 🔒 Versões Suportadas

Atualmente, estamos fornecendo atualizações de segurança para as seguintes versões:

| Versão | Suportada          |
| ------ | ------------------ |
| 0.1.x  | :white_check_mark: |

## 🚨 Reportando uma Vulnerabilidade

A segurança dos nossos usuários é nossa prioridade máxima. Se você descobriu uma vulnerabilidade de segurança, pedimos que nos ajude de forma responsável.

### Como Reportar

**NÃO** abra uma issue pública para vulnerabilidades de segurança.

Em vez disso:

1. **Email**: Envie detalhes para [security@neurovendas-elevare.com] (ou use GitHub Security Advisories se disponível)
2. **Assunto**: Use "SECURITY: [Breve descrição]"
3. **Detalhes**: Inclua:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestões de correção (se houver)

### O que Esperar

- **Confirmação**: Confirmaremos o recebimento em até 48 horas
- **Avaliação**: Avaliaremos a vulnerabilidade e sua severidade
- **Atualização**: Manteremos você informado sobre o progresso
- **Correção**: Trabalharemos em uma correção
- **Divulgação**: Coordenaremos a divulgação pública após a correção

### Período de Divulgação Responsável

Pedimos que você:
- Nos dê tempo razoável (90 dias) para corrigir antes da divulgação pública
- Não explore a vulnerabilidade além do necessário para demonstrá-la
- Não comprometa dados de usuários ou interrompa serviços

## 🛡️ Melhores Práticas de Segurança

### Para Contribuidores

1. **Nunca commite secrets**
   - Credenciais
   - API keys
   - Tokens
   - Senhas

2. **Use .env para configurações sensíveis**
   - Sempre use `.env` para dados sensíveis
   - Mantenha `.env` no `.gitignore`
   - Forneça `.env.example` como template

3. **Valide inputs**
   - Sempre valide e sanitize inputs de usuário
   - Previna SQL Injection
   - Previna XSS (Cross-Site Scripting)
   - Previna CSRF (Cross-Site Request Forgery)

4. **Mantenha dependências atualizadas**
   - Execute `npm audit` regularmente
   - Atualize dependências com vulnerabilidades conhecidas
   - Use ferramentas automatizadas quando possível

5. **Revise código**
   - Todo código deve ser revisado antes do merge
   - Preste atenção especial a código relacionado a segurança
   - Use ferramentas de análise estática

### Para Usuários

1. **Mantenha credenciais seguras**
   - Use senhas fortes e únicas
   - Habilite autenticação de dois fatores quando disponível
   - Não compartilhe credenciais

2. **Mantenha software atualizado**
   - Use sempre a versão mais recente da plataforma
   - Aplique patches de segurança prontamente

3. **Reporte comportamento suspeito**
   - Se notar algo suspeito, reporte imediatamente
   - Siga o processo de reporte de vulnerabilidades

## 🔐 Controles de Segurança

### Autenticação
- Implementação de JWT ou OAuth 2.0
- Hash de senhas com bcrypt ou argon2
- Tokens com expiração apropriada

### Autorização
- Controle de acesso baseado em roles (RBAC)
- Validação de permissões em cada endpoint
- Princípio do menor privilégio

### Dados
- Criptografia de dados sensíveis em repouso
- HTTPS/TLS para dados em trânsito
- Sanitização de inputs
- Validação de outputs

### Infraestrutura
- Firewall configurado adequadamente
- Logs de auditoria
- Monitoramento de segurança
- Backup regular

## 📋 Checklist de Segurança

Antes de fazer deploy:

- [ ] Todas as dependências estão atualizadas
- [ ] Não há secrets no código
- [ ] HTTPS está habilitado
- [ ] Autenticação está implementada corretamente
- [ ] Autorização está implementada corretamente
- [ ] Inputs são validados e sanitizados
- [ ] Logs não contêm informações sensíveis
- [ ] Backups estão configurados
- [ ] Monitoramento está ativo

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## 🏆 Reconhecimento

Agradecemos a pesquisadores de segurança que reportam vulnerabilidades de forma responsável. Com permissão, reconheceremos suas contribuições:

### Hall da Fama de Segurança

<!-- Adicionar pesquisadores de segurança aqui -->

---

**Última atualização**: 2026-01-04
