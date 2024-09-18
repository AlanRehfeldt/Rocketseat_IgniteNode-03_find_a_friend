import { Organization, Prisma } from '@prisma/client'

export interface OrganizationRepository {
  create(data: Prisma.OrganizationUncheckedCreateInput): Promise<Organization>
  update(data: Prisma.OrganizationUncheckedUpdateInput): Promise<Organization>
  findById(id: string): Promise<Organization | null>
  findByEmail(email: string): Promise<Organization | null>
}
