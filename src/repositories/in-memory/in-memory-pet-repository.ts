import { Prisma, Pet } from '@prisma/client'
import { PetRepository } from '../pet.repository'
import { randomUUID } from 'node:crypto'
import { UpdatePetUseCaseRequest } from '@/use-cases/pet/update-pet'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { fetchPetsUseCaseRequest } from '@/use-cases/pet/fetch-pet'
import { InMemoryOrganizationRepository } from './in-memory-organization-repository'

export class InMemoryPetRepository implements PetRepository {
  constructor(
    private inMemoryOrganizationRepository: InMemoryOrganizationRepository,
  ) {}

  public pets: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description,
      isAdopted: false,
      age: data.age,
      size: data.size,
      energy: data.energy,
      dependencyLevel: data.dependencyLevel,
      environment: data.environment,
      createdAt: new Date(),
      updatedAt: null,
      organizationId: data.organizationId,
    }

    this.pets.push(pet)

    return pet
  }

  async update(data: UpdatePetUseCaseRequest) {
    const petIndex = this.pets.findIndex((pet) => pet.id === data.id)

    if (petIndex === -1) {
      throw new Error('Pet not found')
    }

    const petToUpdate = this.pets[petIndex]

    return (this.pets[petIndex] = { ...petToUpdate, ...data })
  }

  async findById(id: string) {
    const pet = this.pets.find((pet) => pet.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async searchMany({
    age,
    size,
    energy,
    dependencyLevel,
    environment,
    latitude,
    longitude,
  }: fetchPetsUseCaseRequest) {
    let filteredPets = this.pets

    if (age) {
      filteredPets = filteredPets.filter((item) => item.age === age)
    }

    if (size) {
      filteredPets = filteredPets.filter((item) => item.size === size)
    }

    if (energy) {
      filteredPets = filteredPets.filter((item) => item.energy === energy)
    }

    if (dependencyLevel) {
      filteredPets = filteredPets.filter(
        (item) => item.dependencyLevel === dependencyLevel,
      )
    }

    if (environment) {
      filteredPets = filteredPets.filter(
        (item) => item.environment === environment,
      )
    }

    if (latitude && longitude) {
      filteredPets = filteredPets.filter((item) => {
        const filteredOrganizations =
          this.inMemoryOrganizationRepository.organizations.filter(
            (organization) => {
              const distance = getDistanceBetweenCoordinates(
                {
                  latitude: organization.latitude,
                  longitude: organization.longitude,
                },
                {
                  latitude: Number(latitude),
                  longitude: Number(longitude),
                },
              )
              return distance <= 10
            },
          )

        return filteredOrganizations.some(
          (organization) => organization.id === item.organizationId,
        )
      })
    }

    return filteredPets
  }
}
