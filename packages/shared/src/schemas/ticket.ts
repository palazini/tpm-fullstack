import { z } from "zod";

export const TicketStatus = z.enum(["aberto", "atendido", "concluido"]);
export const TicketPriority = z.enum(["baixa", "media", "alta"]);

export const TicketSchema = z.object({
  id: z.string().uuid().optional(),          // gerado no banco
  titulo: z.string().min(1, "Informe um título"),
  descricao: z.string().optional().nullable(),
  status: TicketStatus.default("aberto"),
  prioridade: TicketPriority.default("media"),
  ativo_id: z.string().optional().nullable(),
  criado_em: z.string().datetime(),          // ISO string
  criado_por_email: z.string().email()
});

export type Ticket = z.infer<typeof TicketSchema>;
