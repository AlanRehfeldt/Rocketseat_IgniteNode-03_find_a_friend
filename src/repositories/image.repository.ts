import { Prisma, Image } from '@prisma/client'

export interface ImageRepository {
  create(data: Prisma.ImageUncheckedCreateInput): Promise<Image>
  update(data: Prisma.ImageUncheckedUpdateInput): Promise<Image>
  findById(id: string): Promise<Image | null>
}
