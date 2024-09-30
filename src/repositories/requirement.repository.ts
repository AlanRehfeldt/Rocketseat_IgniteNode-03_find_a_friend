import { Prisma, Requirement } from '@prisma/client'

export interface RequirementRepository {
  create(data: Prisma.RequirementUncheckedCreateInput): Promise<Requirement>
  update(data: Prisma.RequirementUncheckedUpdateInput): Promise<Requirement>
  findById(id: string): Promise<Requirement | null>
  delete(id: string): Promise<void>
}
