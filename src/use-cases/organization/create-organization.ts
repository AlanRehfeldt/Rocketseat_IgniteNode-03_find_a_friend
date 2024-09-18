import { OrganizationRepository } from '@/repositories/organization.repository'
import { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'
import { OrganizationAlreadyExistsError } from '../errors/organization-already-exists-error'

interface CreateOrganizationUseCaseRequest {
  name: string
  email: string
  phone: string
  password: string
  latitude: number
  longitude: number
}

interface CreateOrganizationUseCaseResponse {
  organization: Organization
}

export class CreateOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    name,
    email,
    phone,
    password,
    latitude,
    longitude,
  }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
    const organizationWithSameEmail =
      await this.organizationRepository.findByEmail(email)

    if (organizationWithSameEmail) {
      throw new OrganizationAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const organization = await this.organizationRepository.create({
      name,
      email,
      phone,
      password: password_hash,
      latitude,
      longitude,
    })

    return { organization }
  }
}
