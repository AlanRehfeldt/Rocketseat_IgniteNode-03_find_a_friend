import { Image, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { ImageRepository } from '../image.repository'

export class InMemoryImageRepository implements ImageRepository {
  public images: Image[] = []

  async create(data: Prisma.ImageUncheckedCreateInput) {
    const image: Image = {
      id: data.id ?? randomUUID(),
      url: data.url,
      petId: data.petId,
    }

    this.images.push(image)

    return image
  }

  async findById(id: string) {
    const image = this.images.find((image) => image.id === id)

    if (!image) {
      return null
    }

    return image
  }

  async delete(id: string) {
    const imageIndex = this.images.findIndex((image) => image.id === id)

    if (imageIndex === -1) {
      throw new Error('Image not found')
    }

    this.images.splice(imageIndex, 1)
  }
}
