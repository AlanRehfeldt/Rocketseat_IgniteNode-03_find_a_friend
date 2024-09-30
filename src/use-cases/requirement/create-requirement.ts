import { RequirementRepository } from '@/repositories/requirement.repository'
import { PetRepository } from '../../repositories/pet.repository'
import { Requirement } from '@prisma/client'
import { PetNotFoundError } from '../errors/pet-not-found-error'

export interface CreateRequirementUseCaseRequest {
  description: string
  petId: string
}

interface CreateRequirementUseCaseResponse {
  requirement: Requirement
}

export class CreateRequirementUseCase {
  constructor(
    private requirementRepository: RequirementRepository,
    private petRepository: PetRepository,
  ) {}

  async execute({
    description,
    petId,
  }: CreateRequirementUseCaseRequest): Promise<CreateRequirementUseCaseResponse> {
    const pet = await this.petRepository.findById(petId)

    if (!pet) {
      throw new PetNotFoundError()
    }

    const requirement = await this.requirementRepository.create({
      description,
      petId,
    })

    return { requirement }
  }
}
