import { Prisma } from '@prisma/client'
import { RequirementRepository } from '../requirement.repository'
import { UpdateRequirementUseCaseRequest } from '@/use-cases/requirement/update-requirement'
import { prisma } from '@/lib/prisma'

export class PrismaRequirementRepository implements RequirementRepository {
  async create(data: Prisma.RequirementUncheckedCreateInput) {
    const requirement = await prisma.requirement.create({
      data,
    })

    return requirement
  }

  async update(data: UpdateRequirementUseCaseRequest) {
    const requirement = await prisma.requirement.update({
      where: {
        id: data.id,
      },
      data,
    })

    return requirement
  }

  async findById(id: string) {
    const requirement = await prisma.requirement.findUnique({
      where: {
        id,
      },
    })

    return requirement
  }

  async delete(id: string) {
    await prisma.requirement.delete({
      where: {
        id,
      },
    })
  }
}
