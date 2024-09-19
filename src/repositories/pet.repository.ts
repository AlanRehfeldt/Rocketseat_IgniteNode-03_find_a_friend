import { Pet, Prisma } from '@prisma/client'

export interface PetRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  update(data: Prisma.PetUncheckedUpdateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  findByOrganizationId(organizationId: string): Promise<Pet | null>
}
