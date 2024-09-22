import { PetRepository } from '@/repositories/pet.repository'
import {
  Pet,
  PetAge,
  PetDependencyLevel,
  PetEnergy,
  PetEnvironment,
  PetSize,
} from '@prisma/client'

export interface fetchPetsUseCaseRequest {
  age?: PetAge
  size?: PetSize
  energy?: PetEnergy
  dependencyLevel?: PetDependencyLevel
  environment?: PetEnvironment
  latitude: string
  longitude: string
}

interface fetchPetsUseCaseResponse {
  pets: Pet[]
}

export class fetchPetsUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    age,
    size,
    energy,
    dependencyLevel,
    environment,
    latitude,
    longitude,
  }: fetchPetsUseCaseRequest): Promise<fetchPetsUseCaseResponse> {
    const pets = await this.petRepository.searchMany({
      age,
      size,
      energy,
      dependencyLevel,
      environment,
      latitude,
      longitude,
    })

    return { pets }
  }
}
