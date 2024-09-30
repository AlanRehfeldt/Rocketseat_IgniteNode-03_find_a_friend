import { RequirementRepository } from '@/repositories/requirement.repository'
import { Requirement } from '@prisma/client'
import { RequirementNotFoundError } from '../errors/requirement-not-found-error'

export interface UpdateRequirementUseCaseRequest {
  id: string
  description: string
}

interface UpdateRequirementUseCaseResponse {
  requirement: Requirement
}

export class UpdateRequirementUseCase {
  constructor(private requirementRepository: RequirementRepository) {}

  async execute({
    id,
    description,
  }: UpdateRequirementUseCaseRequest): Promise<UpdateRequirementUseCaseResponse> {
    const requirement = await this.requirementRepository.findById(id)

    if (!requirement) {
      throw new RequirementNotFoundError()
    }

    const requirementUpdated = await this.requirementRepository.update({
      ...requirement,
      description,
    })

    return { requirement: requirementUpdated }
  }
}
