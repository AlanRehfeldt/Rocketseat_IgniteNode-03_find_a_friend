import { OrganizationRepository } from '@/repositories/organization.repository'
import { Organization } from '@prisma/client'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'

interface GetOrganizationUseCaseRequest {
  id: string
}

interface GetOrganizationUseCaseResponse {
  organization: Organization | null
}

export class GetOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    id,
  }: GetOrganizationUseCaseRequest): Promise<GetOrganizationUseCaseResponse> {
    const organization = await this.organizationRepository.findById(id)

    if (!organization) {
      throw new OrganizationNotFoundError()
    }

    return { organization }
  }
}
