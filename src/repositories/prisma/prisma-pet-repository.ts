import { Prisma, Pet } from '@prisma/client'
import { PetRepository } from '../pet.repository'
import { UpdatePetUseCaseRequest } from '@/use-cases/pet/update-pet'
import { fetchPetsUseCaseRequest } from '@/use-cases/pet/fetch-pet'
import { prisma } from '@/lib/prisma'

export class PrismaPetRepository implements PetRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async update(data: UpdatePetUseCaseRequest) {
    const pet = await prisma.pet.update({
      where: {
        id: data.id,
      },
      data,
    })

    return pet
  }

  findById(id: string) {
    const pet = prisma.pet.findUnique({
      where: {
        id,
      },
    })

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
    const organizations = await prisma.$queryRaw<Pet[]>`
      SELECT * from organizations
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    const pets = await prisma.pet.findMany({
      where: {
        organization: {
          id: {
            in: organizations.map((organization) => organization.id),
          },
        },
        age,
        size,
        energy,
        dependencyLevel,
        environment,
      },
    })

    return pets
  }
}
