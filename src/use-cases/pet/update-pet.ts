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

export interface UpdatePetUseCaseRequest {
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

    pet.name = name ?? pet.name
    pet.description = description ?? pet.description
    pet.isAdopted = isAdopted ?? pet.isAdopted
    pet.age = age ?? pet.age
    pet.size = size ?? pet.size
    pet.energy = energy ?? pet.energy
    pet.dependencyLevel = dependencyLevel ?? pet.dependencyLevel
    pet.environment = environment ?? pet.environment
    pet.organizationId = organizationId ?? pet.organizationId

    const petUpdated = await this.petRepository.update(pet)

    return { pet: petUpdated }
  }
}
