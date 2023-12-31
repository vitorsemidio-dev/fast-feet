import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'

export interface AdministratorProps {
  cpf: CPF
  name: string
  password: string
  role: UserRoles.ADMINISTRATOR
}

export class Administrator extends Entity<AdministratorProps> {
  static create(
    props: Optional<AdministratorProps, 'role'>,
    id?: UniqueEntityId,
  ) {
    return new Administrator(
      {
        ...props,
        role: UserRoles.ADMINISTRATOR,
      },
      id,
    )
  }

  get cpf() {
    return this.props.cpf
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get role() {
    return this.props.role
  }

  toJson() {
    return {
      id: this.id.toString(),
      cpf: this.cpf,
      name: this.name,
      password: this.password,
      role: this.role,
    }
  }
}
