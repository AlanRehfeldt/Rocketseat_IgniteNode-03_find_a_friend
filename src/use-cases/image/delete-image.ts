import { ImageRepository } from '@/repositories/image.repository'
import { ImageNotFoundError } from '../errors/image-not-found-error'

export interface DeleteImageUseCaseRequest {
  id: string
}

export class DeleteImageUseCase {
  constructor(private imageRepository: ImageRepository) {}

  async execute({ id }: DeleteImageUseCaseRequest) {
    const image = await this.imageRepository.findById(id)

    if (!image) {
      throw new ImageNotFoundError()
    }

    await this.imageRepository.delete(id)
  }
}
