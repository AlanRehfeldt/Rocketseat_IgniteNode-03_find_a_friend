import { Prisma } from '@prisma/client'
import { ImageRepository } from '../image.repository'
import { prisma } from '@/lib/prisma'

export class PrismaImageRepository implements ImageRepository {
  async create(data: Prisma.ImageUncheckedCreateInput) {
    const image = await prisma.image.create({
      data: {
        ...data,
      },
    })

    return image
  }

  async findById(id: string) {
    const image = await prisma.image.findUnique({
      where: {
        id,
      },
    })

    return image
  }

  async delete(id: string) {
    await prisma.image.delete({
      where: {
        id,
      },
    })
  }
}
