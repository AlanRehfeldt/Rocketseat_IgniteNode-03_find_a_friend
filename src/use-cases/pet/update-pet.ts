import { PetRepository } from '@/repositories/pet.repository'
import {
  Pet,
  PetAge,
  PetDependencyLevel,
  PetEnergy,
  PetEnvironment,
  PetSize,
} from '@prisma/client'
import { PetNotFoundError } from '../errors/pet-not-found-error'
import { OrganizationRepository } from '@/repositories/organization.repository'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'

interface UpdatePetUseCaseRequest {
  id: string
  name?: string
  description?: string
  isAdopted?: boolean
  age?: PetAge
  size?: PetSize
  energy?: PetEnergy
  dependencyLevel?: PetDependencyLevel
  environment?: PetEnvironment
  organizationId?: string
}

interface UpdatePetUseCaseResponse {
  pet: Pet
}

export class UpdatePetUseCase {
  constructor(
    private petRepository: PetRepository,
    private organizationRepository: OrganizationRepository,
  ) {}

  async execute({
    id,
    name,
    description,
    isAdopted,
    age,
    size,
    energy,
    dependencyLevel,
    environment,
    organizationId,
  }: UpdatePetUseCaseRequest): Promise<UpdatePetUseCaseResponse> {
    const pet = await this.petRepository.findById(id)

    if (!pet) {
      throw new PetNotFoundError()
    }

    if (organizationId) {
      const organizationExists =
        await this.organizationRepository.findById(organizationId)

      if (!organizationExists) {
        throw new OrganizationNotFoundError()
      }
    }

    const petUpdated = await this.petRepository.update({
      id,
      name: name ?? pet.name,
      description: description ?? pet.description,
      isAdopted: isAdopted ?? pet.isAdopted,
      age: age ?? pet.age,
      size: size ?? pet.size,
      energy: energy ?? pet.energy,
      dependencyLevel: dependencyLevel ?? pet.dependencyLevel,
      environment: environment ?? pet.environment,
      organizationId: organizationId ?? pet.organizationId,
    })

    return { pet: petUpdated }
  }
}
