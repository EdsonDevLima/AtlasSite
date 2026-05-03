# Atlas CRM Site

Site em Next.js para o CRM, conectado a `atlas-crm-api`.

## Rotas entregues

- `/login`
- `/dashboard`
- `/produtos`
- `/carrinho`
- `/pedidos`
- `/clientes`

## Variaveis de ambiente

Crie um `.env.local` com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_API_KEY=sua_api_key_interna
```

## Como rodar

```bash
npm install
npm run dev
```

Observacao: se a API estiver fora do ar, o site usa dados demonstrativos para nao travar a navegacao.
