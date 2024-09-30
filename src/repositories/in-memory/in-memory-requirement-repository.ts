import { Requirement, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { RequirementRepository } from '../requirement.repository'
import { UpdateRequirementUseCaseRequest } from '@/use-cases/requirement/update-requirement'

export class InMemoryRequirementRepository implements RequirementRepository {
  public requirements: Requirement[] = []

  async create(data: Prisma.RequirementUncheckedCreateInput) {
    const requirement: Requirement = {
      id: data.id ?? randomUUID(),
      description: data.description,
      petId: data.petId,
    }

    this.requirements.push(requirement)

    return requirement
  }

  async update(data: UpdateRequirementUseCaseRequest) {
    const requirementIndex = this.requirements.findIndex(
      (requirement) => requirement.id === data.id,
    )

    if (requirementIndex === -1) {
      throw new Error('Requirement not found')
    }

    const requirementToUpdate = this.requirements[requirementIndex]

    return (this.requirements[requirementIndex] = {
      ...requirementToUpdate,
      ...data,
    })
  }

  async findById(id: string) {
    const requirement = this.requirements.find(
      (requirement) => requirement.id === id,
    )

    if (!requirement) {
      return null
    }

    return requirement
  }

  async delete(id: string) {
    const requirementIndex = this.requirements.findIndex(
      (requirement) => requirement.id === id,
    )

    if (requirementIndex === -1) {
      throw new Error('Requirement not found')
    }

    this.requirements.splice(requirementIndex, 1)
  }
}
