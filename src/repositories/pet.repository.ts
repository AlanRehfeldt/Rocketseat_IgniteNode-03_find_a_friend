import { fetchPetsUseCaseRequest } from '@/use-cases/pet/fetch-pet'
import { UpdatePetUseCaseRequest } from '@/use-cases/pet/update-pet'
import { Pet, Prisma } from '@prisma/client'

export interface PetRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  update(data: UpdatePetUseCaseRequest): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  searchMany(data: fetchPetsUseCaseRequest): Promise<Pet[]>
}
