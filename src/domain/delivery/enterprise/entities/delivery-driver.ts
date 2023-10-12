import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Roles } from '@/domain/delivery/enterprise/entities/roles.enum'
import { CPF } from './value-objects/cpf'

export interface DeliveryDriverProps {
  cpf: CPF
  name: string
  password: string
  role: Roles.DELIVERY_DRIVER
}

export class DeliveryDriver extends Entity<DeliveryDriverProps> {
  static create(
    props: Optional<DeliveryDriverProps, 'role'>,
    id?: UniqueEntityId,
  ) {
    return new DeliveryDriver(
      {
        ...props,
        role: Roles.DELIVERY_DRIVER,
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
    return DeliveryDriver.create(
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
