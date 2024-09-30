import { Prisma, Organization } from '@prisma/client'
import { OrganizationRepository } from '../organization.repository'
import { randomUUID } from 'node:crypto'
import { UpdateOrganizationUseCaseRequest } from '@/use-cases/organization/update-organization'

export class InMemoryOrganizationRepository implements OrganizationRepository {
  public organizations: Organization[] = []

  async create(data: Prisma.OrganizationUncheckedCreateInput) {
    const organization: Organization = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: new Date(),
      updatedAt: null,
    }

    this.organizations.push(organization)

    return organization
  }

  async update(data: UpdateOrganizationUseCaseRequest) {
    const organizationIndex = this.organizations.findIndex(
      (organization) => organization.id === data.id,
    )

    if (organizationIndex === -1) {
      throw new Error('Organization not found')
    }

    const organizationToUpdate = this.organizations[organizationIndex]

    return (this.organizations[organizationIndex] = {
      ...organizationToUpdate,
      ...data,
    })
  }

  async findById(id: string) {
    const organization = this.organizations.find(
      (organization) => organization.id === id,
    )

    if (!organization) {
      return null
    }

    return organization
  }

  async findByEmail(email: string) {
    const organization = this.organizations.find(
      (organization) => organization.email === email,
    )

    if (!organization) {
      return null
    }

    return organization
  }
}
