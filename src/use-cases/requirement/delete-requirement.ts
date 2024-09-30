import { RequirementRepository } from '@/repositories/requirement.repository'
import { RequirementNotFoundError } from '../errors/requirement-not-found-error'

export interface DeleteRequirementUseCaseRequest {
  id: string
}

export class DeleteRequirementUseCase {
  constructor(private requirementRepository: RequirementRepository) {}

  async execute({ id }: DeleteRequirementUseCaseRequest) {
    const requirement = await this.requirementRepository.findById(id)

    if (!requirement) {
      throw new RequirementNotFoundError()
    }

    await this.requirementRepository.delete(id)
  }
}
