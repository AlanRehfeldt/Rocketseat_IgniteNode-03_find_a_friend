import { ImageRepository } from '@/repositories/image.repository'
import { PetRepository } from '../../repositories/pet.repository'
import { Image } from '@prisma/client'
import { PetNotFoundError } from '../errors/pet-not-found-error'

export interface CreateImageUseCaseRequest {
  url: string
  petId: string
}

interface CreateImageUseCaseResponse {
  image: Image
}

export class CreateImageUseCase {
  constructor(
    private imageRepository: ImageRepository,
    private petRepository: PetRepository,
  ) {}

  async execute({
    url,
    petId,
  }: CreateImageUseCaseRequest): Promise<CreateImageUseCaseResponse> {
    const pet = await this.petRepository.findById(petId)

    if (!pet) {
      throw new PetNotFoundError()
    }

    const image = await this.imageRepository.create({
      url,
      petId,
    })

    return { image }
  }
}
