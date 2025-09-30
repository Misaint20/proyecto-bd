import { Prisma } from '@prisma/client';

type VinoCreateInput = Prisma.VinoCreateInput;

export interface CreateVinoData extends VinoCreateInput {}

export interface UpdateVinoData extends Partial<CreateVinoData> {}