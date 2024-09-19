import { OrganizationRepository } from '@/repositories/organization.repository'
import { PetRepository } from '@/repositories/pet.repository'
import { RequirementRepository } from '@/repositories/requirement.repository'
import { ImageRepository } from '@/repositories/image.repository'
import {
  Pet,
  PetAge,
  PetDependencyLevel,
  PetEnergy,
  PetEnvironment,
  PetSize,
} from '@prisma/client'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'

interface CreatePetUseCaseRequest {
  name: string
  description: string
  age: PetAge
  size: PetSize
  energy: PetEnergy
  dependencyLevel: PetDependencyLevel
  environment: PetEnvironment
  organizationId: string
  images: string[]
  requirements: string[]
}

interface CreatePetUseCaseResponse extends Pet {
  images: {
    id: string
    url: string
    petId: string
  }[]
  requirements: {
    id: string
    description: string
    petId: string
  }[]
}

export class CreatePetUseCase {
  constructor(
    private petRepository: PetRepository,
    private organizationRepository: OrganizationRepository,
    private requirementRepository: RequirementRepository,
    private imageRepository: ImageRepository,
  ) {}

  async execute({
    name,
    description,
    age,
    size,
    energy,
    dependencyLevel,
    environment,
    organizationId,
    images,
    requirements,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const organizationExists =
      await this.organizationRepository.findById(organizationId)

    if (organizationExists) {
      throw new OrganizationNotFoundError()
    }

    const pet = await this.petRepository.create({
      name,
      description,
      age,
      size,
      energy,
      dependencyLevel,
      environment,
      organizationId,
    })

    const requirementsList = []
    for (const requirement of requirements) {
      const requirementCreated = await this.requirementRepository.create({
        description: requirement,
        petId: pet.id,
      })
      requirementsList.push(requirementCreated)
    }

    const imagesList = []
    for (const image of images) {
      const imageCreated = await this.imageRepository.create({
        url: image,
        petId: pet.id,
      })
      imagesList.push(imageCreated)
    }

    return {
      ...pet,
      requirements: requirementsList,
      images: imagesList,
    }
  }
}
