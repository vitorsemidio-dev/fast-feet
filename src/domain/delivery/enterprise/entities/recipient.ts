import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { UserRoles } from '@/domain/delivery/enterprise/entities/user-roles.enum'
import { CPF } from '@/domain/delivery/enterprise/entities/value-objects/cpf'

export interface RecipientProps {
  cpf: CPF
  name: string
  password: string
  role: UserRoles.RECIPIENT
}

export class Recipient extends Entity<RecipientProps> {
  static create(props: Optional<RecipientProps, 'role'>, id?: UniqueEntityId) {
    return new Recipient(
      {
        ...props,
        role: UserRoles.RECIPIENT,
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
      cpf: this.cpf.value,
      name: this.name,
      password: this.password,
      role: this.role,
    }
  }

  clone() {
    return Recipient.create(
      {
        cpf: this.cpf,
        name: this.name,
        password: this.password,
        role: this.role,
      },
      this.id,
    )
  }
}
