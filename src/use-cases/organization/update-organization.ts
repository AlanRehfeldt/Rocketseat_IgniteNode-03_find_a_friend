import { OrganizationRepository } from '@/repositories/organization.repository'
import { Organization } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'
import { OrganizationAlreadyExistsError } from '../errors/organization-already-exists-error'

interface UpdateOrganizationUseCaseRequest {
  id: string
  name?: string
  email?: string
  phone?: string
  latitude?: number
  longitude?: number
  currentPassword?: string
  newPassword?: string
}

interface UpdateOrganizationUseCaseResponse {
  organization: Organization
}

export class UpdateOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    id,
    name,
    email,
    phone,
    latitude,
    longitude,
    currentPassword,
    newPassword,
  }: UpdateOrganizationUseCaseRequest): Promise<UpdateOrganizationUseCaseResponse> {
    const organization = await this.organizationRepository.findById(id)

    if (!organization) {
      throw new OrganizationNotFoundError()
    }

    if (email) {
      const organizationWithSameEmail =
        await this.organizationRepository.findByEmail(email)

      if (organizationWithSameEmail) {
        throw new OrganizationAlreadyExistsError()
      }
    }

    if (newPassword && !currentPassword) {
      throw new Error('New password requires current password.')
    }

    if (currentPassword && newPassword) {
      const passwordMatch = await compare(
        currentPassword,
        organization.password,
      )

      if (!passwordMatch) {
        throw new Error('Current password does not match.')
      }

      organization.password = await hash(newPassword, 6)
    }

    const organizationUpdated = await this.organizationRepository.update({
      id,
      name: name ?? organization.name,
      email: email ?? organization.email,
      phone: phone ?? organization.phone,
      password: organization.password,
      latitude: latitude ?? organization.latitude,
      longitude: longitude ?? organization.longitude,
    })

    return { organization: organizationUpdated }
  }
}
