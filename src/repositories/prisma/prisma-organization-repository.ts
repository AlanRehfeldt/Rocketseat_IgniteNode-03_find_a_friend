import { Prisma } from '@prisma/client'
import { OrganizationRepository } from '../organization.repository'
import { UpdateOrganizationUseCaseRequest } from '@/use-cases/organization/update-organization'
import { prisma } from '@/lib/prisma'

export class PrismaOrganizationRepository implements OrganizationRepository {
  async create(data: Prisma.OrganizationUncheckedCreateInput) {
    const organization = await prisma.organization.create({
      data,
    })

    return organization
  }

  async update(data: UpdateOrganizationUseCaseRequest) {
    const organization = await prisma.organization.update({
      where: {
        id: data.id,
      },
      data,
    })

    return organization
  }

  async findById(id: string) {
    const organization = await prisma.organization.findUnique({
      where: {
        id,
      },
    })

    return organization
  }

  async findByEmail(email: string) {
    const organization = await prisma.organization.findFirst({
      where: {
        email,
      },
    })

    return organization
  }
}
