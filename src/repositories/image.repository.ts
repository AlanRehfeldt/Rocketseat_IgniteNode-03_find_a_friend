import { Prisma, Image } from '@prisma/client'

export interface ImageRepository {
  create(data: Prisma.ImageUncheckedCreateInput): Promise<Image>
  findById(id: string): Promise<Image | null>
  delete(id: string): Promise<void>
}
